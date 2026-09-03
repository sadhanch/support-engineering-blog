# Exchange Online PowerShell Benchmark Harness

This harness is a framework for comparing two Exchange Online PowerShell retrieval patterns. It records timing, object counts, property counts, memory deltas, a serialized sample-size proxy, and captured errors.

Adapt module-log parsing separately because log schemas can change.

```powershell
param(
  [int]$Iterations = 8,
  [string]$OutputDirectory = (Join-Path $PWD 'EXO-Benchmark')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$resultsPath = Join-Path $OutputDirectory 'trials.csv'
$environmentPath = Join-Path $OutputDirectory 'environment.json'

$exo = Get-Module ExchangeOnlineManagement -ListAvailable |
  Sort-Object Version -Descending | Select-Object -First 1

[pscustomobject]@{
  CapturedUtc  = [DateTimeOffset]::UtcNow
  ComputerName = $env:COMPUTERNAME
  PowerShell   = $PSVersionTable.PSVersion.ToString()
  Edition      = $PSVersionTable.PSEdition
  OS           = $PSVersionTable.OS
  Platform     = $PSVersionTable.Platform
  EXOModule    = $exo.Version.ToString()
  Culture      = [Globalization.CultureInfo]::CurrentCulture.Name
} | ConvertTo-Json -Depth 5 | Set-Content $environmentPath -Encoding utf8

function Get-SerializedSampleBytes {
  param([object[]]$Objects,[int]$SampleSize = 100)
  $sample = @($Objects | Select-Object -First $SampleSize)
  if (-not $sample.Count) { return 0 }
  $sizes = foreach ($item in $sample) {
    $xml = [Management.Automation.PSSerializer]::Serialize($item, 4)
    [Text.Encoding]::UTF8.GetByteCount($xml)
  }
  ($sizes | Measure-Object -Average).Average
}

function Invoke-ExoTrial {
  param(
    [Parameter(Mandatory)][string]$Name,
    [Parameter(Mandatory)][scriptblock]$Query,
    [Parameter(Mandatory)][int]$Iteration,
    [Parameter(Mandatory)][int]$Order
  )

  [GC]::Collect()
  [GC]::WaitForPendingFinalizers()
  [GC]::Collect()

  $process = Get-Process -Id $PID
  $privateBefore = $process.PrivateMemorySize64
  $workingBefore = $process.WorkingSet64
  $allocatedBefore = [GC]::GetTotalAllocatedBytes($false)
  $started = [DateTimeOffset]::UtcNow
  $stopwatch = [Diagnostics.Stopwatch]::StartNew()
  $objects = @()
  $capturedErrors = [Collections.Generic.List[object]]::new()
  $status = 'Succeeded'

  try {
    $objects = @(& $Query -ErrorVariable +capturedErrors)
    if ($capturedErrors.Count) { $status = 'CompletedWithErrors' }
  }
  catch {
    $capturedErrors.Add($_)
    $status = 'Failed'
  }
  finally {
    $stopwatch.Stop()
  }

  $process.Refresh()
  $allocatedAfter = [GC]::GetTotalAllocatedBytes($false)
  $first = $objects | Select-Object -First 1
  $ids = @($objects.ExternalDirectoryObjectId | ForEach-Object { [string]$_ })

  [pscustomobject]@{
    StartedUtc             = $started
    Iteration              = $Iteration
    Order                  = $Order
    Test                   = $Name
    Status                 = $status
    ElapsedMilliseconds    = [math]::Round($stopwatch.Elapsed.TotalMilliseconds,2)
    ObjectCount            = $objects.Count
    UniqueIdCount          = @($ids | Sort-Object -Unique).Count
    FirstPropertyCount     = if ($first) { $first.PSObject.Properties.Count } else { 0 }
    DepartmentPropertySeen = [bool]($first -and $first.PSObject.Properties['Department'])
    OfficePropertySeen     = [bool]($first -and $first.PSObject.Properties['Office'])
    DepartmentNonNullCount = @($objects | Where-Object { $null -ne $_.Department }).Count
    OfficeNonNullCount     = @($objects | Where-Object { $null -ne $_.Office }).Count
    AvgSampleCliXmlBytes   = [math]::Round((Get-SerializedSampleBytes $objects),0)
    PrivateMemoryDeltaMB   = [math]::Round(($process.PrivateMemorySize64-$privateBefore)/1MB,2)
    WorkingSetDeltaMB      = [math]::Round(($process.WorkingSet64-$workingBefore)/1MB,2)
    ManagedAllocatedMB     = [math]::Round(($allocatedAfter-$allocatedBefore)/1MB,2)
    ErrorCount             = $capturedErrors.Count
    ErrorTypes             = (@($capturedErrors | ForEach-Object {
                                $_.Exception.GetType().FullName
                              } | Sort-Object -Unique) -join ';')
    FullyQualifiedErrorIds = (@($capturedErrors.FullyQualifiedErrorId |
                                Sort-Object -Unique) -join ';')
  }
}

$tests = [ordered]@{
  Minimum = { Get-EXOMailbox -ResultSize Unlimited }
  DepartmentOffice = {
    Get-EXOMailbox -ResultSize Unlimited -Properties Department,Office
  }
}

# Small warm-up: exclude first-use overhead from the warm series.
Get-EXOMailbox -ResultSize 1 | Out-Null

$rows = foreach ($iteration in 1..$Iterations) {
  $names = if ($iteration % 2) { @('Minimum','DepartmentOffice') }
           else { @('DepartmentOffice','Minimum') }
  $order = 0
  foreach ($name in $names) {
    $order++
    Invoke-ExoTrial -Name $name -Query $tests[$name] `
      -Iteration $iteration -Order $order
  }
}

$rows | Export-Csv $resultsPath -NoTypeInformation -Encoding utf8
$rows | Format-Table Iteration,Order,Test,Status,ElapsedMilliseconds,
  ObjectCount,FirstPropertyCount,PrivateMemoryDeltaMB,ErrorCount -AutoSize
```

## Harness limitations

- CLI XML sample bytes are a consistent local proxy, not REST wire bytes.
- Process-memory deltas can be negative or noisy because GC, allocator, and OS working-set behavior are asynchronous.
- For strict memory isolation, execute one trial per new PowerShell process and aggregate externally.
- The example references `Department`/`Office` for both result sets; property-existence flags show whether the minimum result actually exposes them. Null counts must be interpreted together with existence.
- A completed command can still be invalid if object IDs differ, duplicates appear, or non-terminating errors occurred.

## Important source note

This file preserves the benchmark structure from the blog.sadhan.ch research source. Validate the script in the target PowerShell/module environment before operational use.

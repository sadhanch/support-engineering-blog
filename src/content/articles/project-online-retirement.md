---
title: "Project Online Is Retiring: What Microsoft 365 Admins Need to Know"

description: "Understand Microsoft's retirement timeline, migration options, and what administrators should do before Project Online reaches end of life."

excerpt: "Microsoft will retire Project Online on September 30, 2026. Learn what the retirement means, migration options, licensing considerations, and how Microsoft 365 administrators should prepare."

summary:
  - Microsoft will retire Project Online on September 30, 2026.
  - Planner Premium is Microsoft's recommended cloud replacement.
  - Organizations should begin planning migration well before retirement.

category: "Microsoft 365"

technology:
  - Microsoft Project
  - Project Online
  - Microsoft Planner
  - Microsoft 365

tags:
  - Retirement
  - Migration
  - Licensing
  - Planner Premium
  - Project Management

publishDate: 2026-08-05

updatedDate: 2026-08-05

featured: true

draft: false

author: "Sadhan Chandra"

references:
  - title: Microsoft Learn
    url: https://learn.microsoft.com/en-us/project/
    description: Official documentation for Microsoft Project.

  - title: Microsoft 365 Roadmap
    url: https://www.microsoft.com/en-us/microsoft-365/roadmap
    description: Track upcoming Planner and Microsoft 365 features.
---

## Project Online Is Retiring

Microsoft has announced that **Project Online** will reach end of life on **September 30, 2026**.

## Why is Microsoft retiring Project Online?

Project Online is part of Microsoft's broader transition toward a unified work management platform centered around Microsoft Planner.

### Key changes

- Planner Premium becomes the recommended cloud solution.
- Project for the web capabilities continue moving into Planner.
- Organizations should review existing project portfolios.

> Migration should be planned well before the retirement deadline.

## What should administrators do?

1. Inventory existing Project Online sites.
2. Identify active projects.
3. Review licensing.
4. Test Planner Premium.

## Connect to Microsoft Graph

Use the following PowerShell command.

```powershell
Connect-MgGraph

Get-MgOrganization

Get-MgUser -Top 10
```

## Microsoft Graph Example

```powershell
Connect-MgGraph

Get-MgOrganization

Get-MgUser -Top 10
```

```bash
git clone https://github.com/example/repository.git
```

```json
{
    "tenantId": "xxxxxxxx",
    "clientId": "xxxxxxxx"
}
```

For official guidance, review Microsoft's retirement announcement.
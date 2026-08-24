# 15. Content Quality, Health, Taxonomy, and Review

## Purpose

The repository now has two complementary content-maintenance systems:

```text
npm run content:check
    -> validates repository/content correctness

npm run content:health
    -> reports editorial and publication health
```

The systems are intentionally separate.

`content:check` is a quality gate. Its blocking errors are suitable for GitHub Actions and must be resolved before a production-quality change is accepted.

`content:health` is a read-only reporting tool. It surfaces maintenance signals without changing article files or failing a deployment.

## Content quality gate

The validator is:

```text
scripts/validate-content.mjs
```

Run it with:

```bash
npm run content:check
```

### Current validation areas

The validator checks:

- article frontmatter structure
- required metadata
- valid `publishDate`
- valid `publishAt`
- explicit timezone on `publishAt`
- `publishDate` and `publishAt` calendar-date consistency
- valid `reviewedDate` when present
- `draft` boolean semantics
- social-image existence
- internal article links
- duplicate article slugs

Editorial checks such as unusually long descriptions are reported as warnings rather than blocking errors.

### Exit behavior

```text
0 -> validation passed
1 -> one or more blocking validation errors exist
```

A warning does not change the success exit code.

### Publication consistency

The validator treats `publishDate` and `publishAt` as different editorial concepts:

```text
publishDate
    -> editorial/publication date

publishAt
    -> exact scheduled publication timestamp
```

A `publishAt` calendar date earlier than `publishDate` is an error.

A `publishAt` calendar date later than `publishDate` is a warning because it may indicate an editorial mismatch, but it is not necessarily invalid.

## GitHub Actions quality gate

The workflow is:

```text
.github/workflows/content-quality.yml
```

It runs on:

- pull requests
- pushes to `main`
- manual `workflow_dispatch`

The workflow performs:

```text
checkout
   |
Node.js 22
   |
npm ci
   |
npm run content:check
   |
npm run build
```

The workflow requests only:

```yaml
permissions:
  contents: read
```

The content check runs before the production build. If the validator fails, the build step is not reached.

## Content health report

The health report is:

```text
scripts/content-health.mjs
```

Run it with:

```bash
npm run content:health
```

The report is read-only. It does not modify article files, commit changes, trigger deployments, or publish content.

### Publication health

The report shows:

- total article count
- published article count
- scheduled article count
- draft count

The current publication model is one article per day, with scheduled publication handled separately by the scheduled-publishing workflow.

### Metadata coverage

The report currently measures coverage for:

- social images
- references
- technology metadata
- tags
- summary
- updated date
- reviewed date

Coverage is reported as both an absolute count and a percentage.

### Editorial signals

The report identifies articles missing:

- references
- summary
- `updatedDate`
- `reviewedDate`

Missing `reviewedDate` is not treated as an error because historical technical review may not have been formally recorded.

## Technology taxonomy

The permanent taxonomy configuration is:

```text
scripts/config/technology-taxonomy.mjs
```

This file is the source of truth for recognized technology aliases and canonical labels.

### Current canonical labels

```text
Power Automate
    -> Microsoft Power Automate

Power Platform
    -> Microsoft Power Platform

Power BI
    -> Microsoft Power BI

Azure
    -> Microsoft Azure
```

Article `technology` metadata uses the canonical labels.

The taxonomy configuration is consumed by the Content Health report so that potential overlaps can be identified before additional inconsistent labels accumulate.

### What taxonomy health does

Taxonomy Health reports:

- potential technology overlaps
- low-frequency technologies
- the articles affected by a potential overlap

A potential overlap is advisory only. The report never rewrites metadata automatically.

For example, if both of these are found:

```text
Microsoft Power Automate
Power Automate
```

the report identifies the conflict, but it does not decide which article metadata should change.

### Taxonomy normalization

A one-time migration utility was used during the taxonomy cleanup to normalize existing article frontmatter. That migration utility was removed after the cleanup was verified.

The permanent taxonomy configuration remains because it is an ongoing maintenance reference.

Do not perform broad repository-wide replacements for technology names. Changes should be limited to the relevant frontmatter field so article prose, references, tags, and technical examples remain untouched.

## Technical review health

Technical review tracking is intentionally separate from publication/update dates.

The optional field is:

```yaml
reviewedDate: 2026-08-24
```

Its meaning is:

```text
publishDate
    -> when the article was originally published

updatedDate
    -> when article content was last changed

reviewedDate
    -> when technical accuracy was last reviewed
```

`reviewedDate` is internal editorial metadata. It is not rendered on the public article page unless the presentation layer is explicitly changed later.

### Validation

When present, `reviewedDate` must be a valid date.

Invalid values are blocking Content Quality errors.

Example of an invalid value:

```yaml
reviewedDate: definitely-not-a-date
```

This causes:

```text
content:check
-> FAIL
```

### Review interval

The current health policy uses:

```text
180 days
```

An article whose recorded `reviewedDate` is at least 180 days old is reported as a **review candidate**.

An article without `reviewedDate` is not treated as stale. It is reported as having an unknown review history instead.

This distinction is intentional:

```text
reviewedDate recent
    -> reviewed / healthy

reviewedDate older than 180 days
    -> review candidate

reviewedDate absent
    -> review history unknown
```

### Editorial review policy

The 180-day threshold is a maintenance signal, not a statement that an article becomes incorrect on day 181.

A technical review should also be triggered earlier when:

- Microsoft materially changes the product behavior described in the article
- a feature is deprecated, retired, or renamed
- licensing or pricing information changes
- security or governance behavior changes
- an important referenced source changes materially

After a genuine technical review, record the date in `reviewedDate`.

Do not populate historical `reviewedDate` values merely to make the health report look complete. A recorded review date should represent an actual technical review.

## Recommended maintenance sequence

For a normal article change:

```text
Edit article
   |
npm run content:check
   |
npm run content:health
   |
npm run build
   |
local QA
   |
git diff --check
   |
commit
   |
push
```

For a technical review without content changes:

```text
Review current Microsoft documentation
   |
Confirm article accuracy
   |
Update reviewedDate
   |
npm run content:check
   |
npm run content:health
   |
commit
```

## Important boundary: health vs quality

Do not turn every health signal into a blocking CI rule.

Examples:

```text
missing reviewedDate
    -> health signal
    -> not a CI error

low-frequency technology
    -> health signal
    -> not a CI error

long description
    -> warning
    -> not a CI error

invalid reviewedDate
    -> content error
    -> CI failure

missing required metadata
    -> content error
    -> CI failure
```

This distinction keeps the repository strict about correctness while allowing editorial judgment where appropriate.

## Common commands

```bash
npm run content:check
npm run content:health
npm run build
```

Useful repository checks:

```bash
git diff --check
git status
```

## Troubleshooting

### Content quality fails unexpectedly

Run:

```bash
npm run content:check
```

Read the `ERRORS` section first. Warnings do not block the command.

### Health report shows an unexpected taxonomy overlap

Check:

```text
scripts/config/technology-taxonomy.mjs
```

Then inspect the affected article slugs reported by the health report. Do not perform a broad string replacement until you have confirmed that the duplicate labels are genuinely equivalent.

### An article appears as a review candidate

Check its `reviewedDate` and compare it with the current date.

If the article has actually been technically reviewed, update `reviewedDate` to the date of that review.

If the article was not reviewed, leave the signal in place and perform the review before recording a new date.

### `reviewedDate` causes Content Quality to fail

Verify that it is a valid date, for example:

```yaml
reviewedDate: 2026-08-24
```

Do not use free-form strings.

## Maintenance boundaries

Keep these responsibilities separate:

```text
content.config.ts
    -> schema and field validity

validate-content.mjs
    -> blocking repository/content quality rules

content-health.mjs
    -> read-only editorial health reporting

technology-taxonomy.mjs
    -> canonical taxonomy reference

scheduled-publishing workflow
    -> publication timing and deployment trigger

Cloudflare Pages
    -> production build and deployment
```

This separation is intentional and should be preserved as the project grows.

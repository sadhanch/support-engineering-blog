# 4. Content Authoring

## Article location

All article source files belong in:

```text
src/content/articles/
```

Supported formats:

```text
.md
.mdx
```

The current collection loader supports both.

## Frontmatter schema

An article uses the following frontmatter structure:

```yaml
---
title: "Article title"

description: "Search and article description."

excerpt: "Short article summary for feeds and listings."

summary:
  - "Key takeaway one."
  - "Key takeaway two."

category: "Microsoft 365"

technology:
  - Microsoft Planner
  - Microsoft Project

tags:
  - Planner Premium
  - Microsoft 365

publishDate: 2026-07-31

updatedDate: 2026-07-31

reviewedDate: 2026-08-24

featured: true

draft: false

author: "Sadhan Chandra"

references:
  - title: "Reference title"
    url: "https://example.com/source"
    description: "Why this source is relevant."
---
```

## Field guidance

### `title`

The article's primary title and the value used for the document title.

### `description`

The primary page description. Keep it concise and representative of the article.

### `excerpt`

A shorter summary used by feeds and article listings.

### `summary`

Optional key takeaways rendered by the Quick Summary component.

### `category`

The article's broad editorial classification.

### `technology`

The technologies directly relevant to the article.

### `tags`

Searchable/conceptual terms used by the content relationship system.

### `publishDate`

Required publication date.

### `updatedDate`

Optional last-update date.

### `reviewedDate`

Optional internal date recording when the article was last technically reviewed. It is used by Content Health and is not currently rendered on public article pages. Do not invent historical review dates.

### `featured`

Controls featured article selection.

### `draft`

Draft articles are excluded by `getAllArticles()` and therefore do not appear in normal article listings or generated article routes.

### `author`

Article author.

### `references`

References require:

- title
- valid URL
- description

The schema validates URLs using Zod.


## Content quality commands

Before committing content changes, run:

```bash
npm run content:check
npm run content:health
npm run build
```

`content:check` is the blocking quality gate. `content:health` is a read-only maintenance report. See [Content Quality, Health, Taxonomy, and Review](15-content-quality-and-health.md).

## Technology taxonomy

Use the canonical technology labels defined in `scripts/config/technology-taxonomy.mjs`. The current canonical forms are:

```text
Microsoft Power Automate
Microsoft Power Platform
Microsoft Power BI
Microsoft Azure
```

Do not use the historical aliases `Power Automate`, `Power Platform`, `Power BI`, or `Azure` in the article `technology` field. These terms may still appear naturally in prose and tags.

## Technical review tracking

When an article has actually undergone a technical accuracy review, record the review date with:

```yaml
reviewedDate: 2026-08-24
```

This is different from `updatedDate`. A review does not require a content edit. The current maintenance threshold is 180 days, but a review should also be triggered earlier by major product, licensing, security, governance, or retirement changes.

Do not add a `reviewedDate` merely to remove an item from the health report. It should represent a real review.

## Related articles

Related article selection is implemented in:

```text
src/lib/relatedArticles.ts
```

Current relationship weighting:

```text
Technology  → strongest
Tags        → medium
Category    → broad
```

The system excludes the current article, removes articles with no meaningful relationship, sorts by relevance, and uses publication date as the tie-breaker.

## Editorial workflow

Before publishing an article:

1. Validate claims and references.
2. Check Microsoft terminology.
3. Review licensing/governance/security implications where relevant.
4. Explain limitations and trade-offs.
5. Check diagrams/tables/callouts.
6. Check image alt text.
7. Run the production build.
8. Review the rendered page locally.
9. Commit and push.

## Content quality principles

Prefer:

- authoritative sources
- Microsoft documentation for Microsoft product behavior
- clearly labeled analysis
- practical examples
- explicit limitations

Avoid:

- unsupported assumptions
- repetitive explanations
- filler
- generic marketing language
- presenting recommendations as Microsoft statements

## Scheduled publishing

The article schema supports an optional `publishAt` timestamp for approved articles that should become public at a defined time. Existing articles do not need the field.

Example:

```yaml
draft: false
publishDate: 2026-09-01
publishAt: "2026-09-01T09:07:00+05:30"
```

Publication rules are:

```text
draft: true
    -> never published

draft: false + future publishAt
    -> not generated yet

draft: false + past publishAt
    -> generated and published

draft: false + no publishAt
    -> existing articles remain published normally
```

The standard daily publication window is **09:07 Asia/Kolkata (IST)**. The timestamp should include the explicit `+05:30` offset.

Do not add `publishAt` to historical articles unless their publication timing needs to change.

The automated workflow checks once per day and triggers Cloudflare only when an approved, due article is still absent from production.


## Podcast episodes

Podcast episodes are authored separately from articles under:

```text
src/content/podcast/
```

The validated podcast collection is defined in `src/content.config.ts`. Episode metadata includes the published audio URL, duration, chapters, transcript references, and optional relationships to Support Engineering Blog articles.

A typical workflow is:

```text
Published RSS.com episode
        ↓
Confirm final metadata
        ↓
Create episode MDX
        ↓
Add chapters and transcript resource
        ↓
Run content check
        ↓
Run build
        ↓
Review /podcast/ and episode page
```

Do not store the production audio master in the blog repository. Use the published distribution URL for the web player. Long-term production assets are maintained in the separate podcast archive. See [Podcast](16-podcast.md).

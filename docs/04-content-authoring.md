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

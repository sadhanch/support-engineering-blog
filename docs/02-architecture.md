# 2. Architecture

## High-level architecture

```text
GitHub repository
       |
       | push to main
       v
Cloudflare Pages
       |
       | Astro build
       v
Static site
       |
       +--> HTML pages
       +--> optimized images
       +--> Pagefind search index
       +--> sitemap
       +--> RSS feed
```

## Application structure

```text
src/
├── assets/css/          Global design system and page/component CSS
├── components/          Reusable Astro UI and content components
├── config/              Central site configuration
├── content/             Article source files
├── data/                Static navigation/content datasets
├── layouts/             Base document and article layouts
├── lib/                 Content, taxonomy, search and relationship logic
├── pages/               Astro routes
├── scripts/             Browser-side behavior
├── templates/           Legacy/reference XML and article template assets
└── utils/               Small shared utilities
```

## Astro configuration

`astro.config.mjs` defines:

- Production site URL: `https://blog.sadhan.ch`
- Pagefind integration
- Sitemap generation
- MDX support

The sitemap excludes:

- `/search/`
- `/design-system/`

## Content architecture

Articles are loaded by `src/content.config.ts` using Astro's `glob` loader.

Supported patterns:

```text
**/*.{md,mdx}
```

The article schema validates:

- title
- description
- excerpt
- summary
- category
- technology
- references
- tags
- publish date
- update date
- featured state
- draft state
- author

Published article retrieval is centralized in `src/lib/articles.ts`.

## Article rendering

The article route is:

```text
src/pages/articles/[...slug].astro
```

The route:

1. Loads published articles.
2. Generates static paths.
3. Resolves the requested article.
4. Calculates related articles.
5. Renders Markdown/MDX content.
6. Passes article metadata and rendered content to `ArticleLayout.astro`.

`ArticleLayout.astro` provides:

- article header
- category link
- technology stack
- Quick Summary
- Reader's Toolkit
- main article body
- references
- related articles
- Pagefind body metadata

## Site shell

`BaseLayout.astro` provides:

- document metadata
- canonical URL
- Open Graph metadata
- X/Twitter metadata
- JSON-LD
- favicon
- RSS link
- theme initialization
- global header/footer
- accessibility skip link
- analytics consent
- global client-side initialization

## Search

Pagefind is integrated at build time.

The search page loads the generated Pagefind client and uses `src/scripts/search.ts` for:

- search execution
- result rendering
- highlighting
- keyboard result navigation

Global search shortcuts are implemented in `src/scripts/global-search.ts`:

- `Ctrl + K`
- `/` when focus is not already inside a text input/textarea

## Theme

Theme state is handled by `src/scripts/theme.ts`.

Supported states:

- system
- light
- dark

The current selection is stored as:

```text
seb-theme
```

An inline initialization block in `BaseLayout.astro` applies the stored/system preference early to reduce theme flashing.

## Analytics

Analytics is intentionally not loaded directly from the document head.

The flow is:

```text
BaseLayout
    |
    | data-ga-id
    v
analytics-consent.ts
    |
    +--> denied/no decision: Google Analytics not loaded
    |
    +--> granted: load gtag.js and configure GA4
```

The implementation uses the standard Google tag data-layer argument pattern.

## Static output

The Astro build is configured for static output. The final `dist/` directory contains the deployable site.

Generated assets include optimized image formats such as WebP where Astro's image pipeline is used.

# 2. Architecture

## High-level architecture

```text
GitHub repository
       |
       | push to main
       v
Cloudflare Pages
       |
       | npm run build
       v
Static Astro site
       |
       +--> HTML pages
       +--> optimized images
       +--> Pagefind search index
       +--> sitemap
       +--> RSS feed
       +--> PWA manifest
       +--> PWA service worker
       +--> offline fallback page
```

## Application structure

```text
src/
├── assets/css/          Global design system and page/component CSS
├── components/          Reusable Astro UI and content components
├── config/              Central site configuration
├── content/             Article and podcast source files
├── data/                Static navigation/content datasets
├── layouts/             Base document, article, and podcast episode layouts
├── lib/                 Content, taxonomy, search and relationship logic
├── pages/               Astro routes, including /offline/
├── scripts/             Maintenance tools and browser-side behavior
│   ├── check-scheduled-publication.mjs
│   ├── content-health.mjs
│   ├── validate-content.mjs
│   └── config/technology-taxonomy.mjs
├── templates/           Legacy/reference XML and article template assets
└── utils/               Small shared utilities

public/
├── favicon/             Browser favicon assets
├── logo/                Approved blog logo assets
├── social/              Article Open Graph images
├── icons/               PWA application icons
├── manifest.webmanifest PWA application manifest
└── sw.js                PWA service worker
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
- optional reviewed date
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


## Podcast architecture

The podcast is implemented as a first-class content area inside the existing static Astro application. Podcast episodes are separate from articles and are rendered through dedicated routes and a dedicated episode layout.

```text
src/content/podcast/*.mdx
        ↓
src/content.config.ts
        ↓
src/lib/podcast.ts
        ↓
┌──────────────────────────────┐
│ /podcast/                    │
│ /podcast/[...slug]/          │
└──────────────────────────────┘
        ↓
PodcastEpisodeLayout.astro
        ↓
PodcastPlayer + Transcript + related reading
```

Show-level metadata and listening destinations are centralized in `src/config/podcast.ts`. The public player uses the published RSS.com audio enclosure URL rather than a third-party embedded player. See [Podcast](16-podcast.md) for the complete podcast content model and maintenance workflow.

## Site shell

`BaseLayout.astro` provides:

- document metadata
- canonical URL
- Open Graph metadata
- X/Twitter metadata
- JSON-LD
- favicon
- Web App Manifest link
- RSS link
- theme initialization
- global header/footer
- accessibility skip link
- analytics consent
- global client-side initialization
- PWA service-worker registration


## Content quality and health architecture

The repository separates blocking content validation from read-only maintenance reporting.

```text
Article source
    |
    +--> content.config.ts
    |       -> schema validity
    |
    +--> validate-content.mjs
    |       -> blocking quality checks
    |
    +--> content-health.mjs
    |       -> publication health
    |       -> metadata coverage
    |       -> taxonomy health
    |       -> technical review health
    |
    +--> Astro build
```

The quality gate is enforced by:

```text
.github/workflows/content-quality.yml
```

The workflow runs `npm run content:check` followed by `npm run build`. It does not deploy the site.

The permanent taxonomy source is:

```text
scripts/config/technology-taxonomy.mjs
```

The optional internal `reviewedDate` field is validated but is not rendered in the public article interface.

## Scheduled publishing architecture

Scheduled publishing is layered on top of the existing static GitHub → Cloudflare Pages pipeline. It does not modify article files or require a database.

```text
Article with publishAt
        |
        v
GitHub main
        |
        | daily 09:07 Asia/Kolkata
        v
GitHub Actions
        |
        | check-scheduled-publication.mjs
        |
        +--> no due + unpublished article -> stop
        |
        +--> due + not live -> Cloudflare Deploy Hook
                                      |
                                      v
                              Cloudflare Pages
                                      |
                                      v
                                Astro build
```

The content layer remains the source of truth for whether an article is eligible for publication. GitHub Actions only determines whether a rebuild is needed.

The relevant files are:

```text
src/content.config.ts                  Article schema including optional publishAt
src/lib/articles.ts                     Central published-article filter
scripts/check-scheduled-publication.mjs Due-publication checker
.github/workflows/scheduled-publishing.yml Daily scheduler + deployment trigger
```

The Cloudflare Deploy Hook URL is stored only as the GitHub Actions repository secret `CLOUDFLARE_DEPLOY_HOOK`.

## Progressive Web App architecture

The PWA is intentionally layered on top of the static publication:

```text
BaseLayout.astro
      |
      +--> /manifest.webmanifest
      |
      +--> pwa-register.ts
                    |
                    v
                 /sw.js
                    |
          +---------+----------+
          |                    |
          v                    v
   static asset cache     page/document cache
          |                    |
          +---------+----------+
                    |
                    v
              /offline/
```

### Manifest

`public/manifest.webmanifest` defines:

- application name and short name
- description
- start URL and scope
- standalone display mode
- theme/background colors
- 192px and 512px application icons
- shortcuts for Latest Articles, Microsoft 365, Power Platform, and Search

### Service worker

`public/sw.js` provides three intentionally small behaviors:

1. Cache the `/offline/` page during installation.
2. Use network-first navigation so fresh online content wins.
3. Cache same-origin CSS, JavaScript, and font resources for offline support.

Successful page navigations are stored in a versioned page cache. When a navigation fails offline, the worker first checks for the previously cached page and then falls back to `/offline/`.

Cache generations are controlled through `CACHE_VERSION` in `public/sw.js`. Old cache generations are removed during service-worker activation.

### Offline page

`src/pages/offline.astro` is intentionally self-contained and uses inline critical CSS. This prevents the offline fallback from depending on separately cached stylesheet assets.

### PWA scope decisions

The current PWA intentionally excludes:

- push notifications
- background sync
- native share integration
- share-target behavior
- a separate PWA-only reader interface
- precaching of the entire article library

The dedicated Android application remains the place for richer mobile-specific behavior.

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

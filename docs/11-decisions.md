# 11. Architecture and Project Decisions

This document records important decisions made during the project so that future maintenance does not require reconstructing the original reasoning.

| Area | Decision | Reason |
|---|---|---|
| Framework | Astro | Static, component-oriented architecture suited to a technical publication |
| Content | Markdown + MDX | Simple editorial workflow with reusable components when needed |
| Hosting | Cloudflare Pages | Git-connected static deployment |
| Source control | GitHub | Version control and deployment integration |
| DNS | Cloudflare | Centralized DNS management |
| Search | Pagefind | Static-site search without a server-side search backend |
| Sitemap | `@astrojs/sitemap` | Generate sitemap from the Astro build |
| RSS | `@astrojs/rss` | Generate a standard publication feed |
| Analytics | Google Analytics 4 | Production traffic and engagement measurement |
| Analytics loading | Consent-controlled | Analytics should not load before visitor consent |
| Search engines | Google + Bing | Broader search discoverability |
| Article relationships | Taxonomy scoring | Related content can be generated without a database |
| Styling | Modular CSS | Keep design system, components, layouts, and pages separable |
| Theme | System/light/dark | Support visitor preference while allowing explicit selection |
| Tables | Reusable component | Avoid one-off table markup and allow consistent future articles |
| Images | Astro/build optimization | Reduce delivery cost and use optimized production formats |
| Production branch | `main` | Simple single-production-branch workflow |
| Domain | `blog.sadhan.ch` | Dedicated publication subdomain |

## Editorial decisions

The article workflow emphasizes:

- why before how
- evidence over assertion
- practical context
- explicit limitations
- clearly identified recommendations
- minimal filler

## Decisions intentionally deferred

The project does not currently require:

- a server-side database
- a CMS
- a server-side search service
- Google Tag Manager
- an application backend

Adding infrastructure should require a concrete requirement rather than being done preemptively.

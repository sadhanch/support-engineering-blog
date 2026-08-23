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
| PWA | Lightweight progressive enhancement | Add installability and offline reading without turning the publication into a client-heavy app |
| PWA navigation | Network-first | Prefer fresh article content online while allowing previously visited pages offline |
| PWA static assets | Cache-first after first retrieval | Support offline rendering for same-origin CSS, scripts, and fonts without precaching the entire site |
| PWA fallback | Dedicated `/offline/` page | Provide a branded, predictable offline experience instead of the browser's generic error |
| PWA shortcuts | Limited set of high-value destinations | Keep installed-app navigation useful without exposing every site category |
| PWA sharing | Deferred | Native share belongs in the dedicated Android experience rather than adding a new web/PWA control |
| PWA notifications | Deferred | No current content/product requirement for push notifications |
| PWA background sync | Deferred | Blog has no transactional offline work that requires deferred submission |
| PWA full precache | Avoided | The publication is frequently updated and contains a growing article/image library |
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

## Performance decisions

The build may report a Vite warning when a generated JavaScript chunk exceeds the default 500 kB warning threshold.

The current Mermaid integration already uses dynamic loading: the page checks for Mermaid diagrams before importing the Mermaid runtime. The warning is therefore treated as a measurement item rather than an automatic reason to add global chunk-splitting rules or raise the warning threshold.

Future performance work should measure which pages actually request the large Mermaid runtime chunk before changing its loading strategy.

## Decisions intentionally deferred

The project does not currently require:

- a server-side database
- a CMS
- a server-side search service
- Google Tag Manager
- an application backend
- PWA push notifications
- PWA background sync
- PWA share-target behavior

Adding infrastructure should require a concrete requirement rather than being done preemptively.

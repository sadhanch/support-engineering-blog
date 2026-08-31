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
| Content validation | Dedicated read-only Node validator + CI workflow | Catch structural/publication/content errors before production without mixing editorial reporting into CI |
| Content health | Read-only health report | Surface publication, metadata, taxonomy, and review signals without blocking on subjective editorial conditions |
| Technology taxonomy | Shared canonical configuration | Prevent drift between reporting and article metadata normalization |
| Technical review | Optional internal `reviewedDate` | Distinguish technical review from content modification and publication dates without changing public UI |

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



## Decision: content quality and health are separate concerns

The repository uses two commands:

```text
npm run content:check
npm run content:health
```

`content:check` is deterministic and blocking. `content:health` is observational and advisory. This prevents subjective editorial signals such as missing review history or low-frequency taxonomy labels from failing production builds.

## Decision: technology taxonomy uses a shared source of truth

Canonical technology labels and recognized aliases are stored in:

```text
scripts/config/technology-taxonomy.mjs
```

The initial normalized labels are:

```text
Microsoft Power Automate
Microsoft Power Platform
Microsoft Power BI
Microsoft Azure
```

A one-time normalization was performed on article frontmatter, and the migration utility was removed after verification. Future taxonomy changes should be deliberate and reviewable rather than broad string replacements.

## Decision: technical review is separate from updatedDate

`updatedDate` records a content change. `reviewedDate` records a technical accuracy review. The latter is optional, internal, and not rendered publicly.

The current health threshold is 180 days, while significant product, licensing, security, governance, or retirement changes can justify earlier review.

## Decision: scheduled publishing without a CMS

The blog uses GitHub + Astro + Cloudflare Pages as its source/build/deployment stack. Scheduled publishing was implemented without introducing a CMS, database, server, or repository-mutating bot.

Decision:

- Add optional `publishAt` to the article schema.
- Treat `draft` as the editorial approval state.
- Treat `publishAt` as the exact publication timestamp when provided.
- Keep historical articles unchanged.
- Run a single scheduled GitHub Actions check each day at 09:07 Asia/Kolkata.
- Trigger Cloudflare through a Deploy Hook only when a due article is still absent from production.
- Keep the Deploy Hook URL in the repository secret `CLOUDFLARE_DEPLOY_HOOK`.

Reasoning:

This preserves Git as the source of truth, keeps Astro's static architecture intact, and avoids introducing another content system.

## Decision: daily rather than 15-minute scheduling

The publication model is one article per day. A 15-minute always-on scheduler was therefore rejected in favor of a single daily publication window. The current standard time is 09:07 IST, intentionally offset from the top of the hour.

## Decision: PWA remains lightweight

The PWA intentionally remains an installable/offline layer over the static site. Richer mobile features remain scoped to the dedicated Android application rather than being duplicated in the web PWA.


## Decision: podcast episodes use a separate content collection

Podcast episodes are stored under `src/content/podcast/` and validated independently from the article collection.

Reasoning:

- Podcast episodes and articles have different metadata and presentation requirements.
- The separation keeps the article content model stable.
- Episodes can reference existing articles without duplicating their content.
- A dedicated collection makes the weekly podcast scalable as the show grows.

## Decision: use the published podcast audio for the web player

The website's podcast player uses the public RSS.com MP3 enclosure URL. The production audio master remains in the separate podcast archive.

Reasoning:

- The blog should not duplicate large production assets.
- RSS.com already provides the public distribution asset.
- The web player remains consistent with the published podcast feed.

## Decision: external podcast platforms are outbound destinations

The podcast page currently exposes Spotify and Apple Podcasts as listener-facing destinations rather than embedding third-party players. The blog's own player provides on-site playback.

Additional platforms should be added only after their canonical public URLs are confirmed.

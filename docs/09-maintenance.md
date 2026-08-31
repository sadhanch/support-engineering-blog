# 9. Maintenance

## Every article

Before publishing an article:

```text
[ ] `npm run content:check` passes
[ ] `npm run content:health` reviewed when metadata/publication state changed
[ ] Title is accurate
[ ] Description is accurate
[ ] Excerpt is present
[ ] Summary is useful
[ ] Category is correct
[ ] Technology taxonomy is correct
[ ] Tags are meaningful
[ ] References are valid
[ ] Images have useful alt text
[ ] Tables work at desktop and smaller widths
[ ] Internal links work
[ ] Article renders correctly
```

## Before every production push

```text
[ ] npm run build passes
[ ] Local article/page QA completed
[ ] Keyboard navigation checked
[ ] Theme behavior checked
[ ] Search checked when search code changed
[ ] Favicon checked when document shell changed
[ ] PWA manifest checked when PWA configuration changed
[ ] Service worker/offline fallback checked when PWA code changed
[ ] Analytics consent checked when analytics code changed
[ ] git status reviewed
```

## Technical review cycle

Run the health report periodically:

```bash
npm run content:health
```

Prioritize articles reported as review candidates and record `reviewedDate` only after a real technical accuracy review. The current review threshold is 180 days.

When product behavior, licensing, security, governance, or retirement status changes materially, review the affected article before the 180-day threshold if necessary.

## Monthly

Review:

- Google Analytics traffic
- Google Search Console indexing/search performance
- Bing Webmaster Tools
- broken links or unexpected 404s
- newly published content
- content that needs updates
- PWA behavior on the primary supported browser/device combination

## Periodic technical maintenance

Review dependencies periodically:

```bash
npm outdated
```

Do not upgrade Astro or major integrations blindly. Run the full production build and regression QA after dependency upgrades.

For PWA changes, also verify:

```text
manifest identity
service-worker activation
cache versioning
offline fallback
app shortcuts
```

## Content maintenance

When a Microsoft product changes materially:

1. Recheck the relevant Microsoft documentation.
2. Review affected articles.
3. Update `updatedDate`.
4. Recheck references.
5. Rebuild and deploy.

## Backups and source control

GitHub is the source-control system.

Important production configuration outside Git should be documented without committing credentials or secrets.

## Generated files

Do not manually maintain:

```text
dist/
pagefind generated assets
sitemap generated output
optimized build assets
```

These are build outputs.


## Scheduled publishing maintenance

The scheduled publishing system consists of four maintained pieces:

```text
src/content.config.ts
src/lib/articles.ts
scripts/check-scheduled-publication.mjs
.github/workflows/scheduled-publishing.yml
```

When changing publication behavior, keep the content filter and the checker aligned. The checker should determine when a rebuild is needed; Astro remains the final authority on which articles are generated.

Do not replace the `CLOUDFLARE_DEPLOY_HOOK` secret with a hard-coded URL. Treat the Deploy Hook as a secret.

The daily workflow currently runs at **09:07 Asia/Kolkata**. The manual `workflow_dispatch` trigger should remain enabled because it provides a safe way to validate the automation without waiting for the next scheduled run.

## Content quality and health tooling

Maintained scripts:

```text
scripts/validate-content.mjs
scripts/content-health.mjs
scripts/config/technology-taxonomy.mjs
```

The GitHub quality workflow is:

```text
.github/workflows/content-quality.yml
```

Use these commands for maintenance:

```bash
npm run content:check
npm run content:health
```

`content:check` should remain suitable for CI and should not be turned into a catch-all editorial linter. `content:health` is intentionally advisory.


## Podcast maintenance

For each published podcast episode, verify the published RSS.com record against the corresponding blog content entry. Check episode number, GUID, title, publication date, duration, audio URL, chapters, transcript, and related article references.

The podcast implementation is documented in [Podcast](16-podcast.md). The primary podcast files are:

```text
src/config/podcast.ts
src/content.config.ts
src/content/podcast/
src/lib/podcast.ts
src/components/podcast/
src/layouts/PodcastEpisodeLayout.astro
src/pages/podcast/
src/scripts/podcast-player.ts
src/assets/css/components/podcast-player.css
src/assets/css/pages/podcast.css
```

The website player uses the published RSS.com MP3. Do not copy the production audio master into the web repository.

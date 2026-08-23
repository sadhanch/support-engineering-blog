# 9. Maintenance

## Every article

Before publishing an article:

```text
[ ] Frontmatter validates
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

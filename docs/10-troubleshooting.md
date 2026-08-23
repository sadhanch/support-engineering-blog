# 10. Troubleshooting

## Build fails with content schema errors

Example symptom:

```text
InvalidContentEntryDataError
```

Check:

```text
src/content.config.ts
```

Then validate the article frontmatter.

A common example is a malformed reference URL. The schema requires:

```text
references[].url
```

to be a valid URL.

Use plain URLs in YAML rather than Markdown link syntax inside the `url` field.

## Article does not appear

Check:

```yaml
draft: false
```

`getAllArticles()` filters draft articles out.

Then run:

```bash
npm run build
```

## Related articles are unexpected

Review:

```text
src/lib/relatedArticles.ts
```

Current scoring:

```text
Technology = 3
Tags       = 2
Category   = 1
```

The current article is excluded and zero-score articles are removed.

## Search is not working

Check:

1. `npm run build` completed.
2. Pagefind was generated.
3. `dist/pagefind/` exists after build.
4. `src/scripts/search.ts` can load `/pagefind/pagefind.js`.
5. Search page element IDs still match the script.

## PWA manifest is not detected

Check:

1. `dist/manifest.webmanifest` exists after `npm run build`.
2. `BaseLayout.astro` contains the manifest link.
3. The production URL returns:
   `https://blog.sadhan.ch/manifest.webmanifest`
4. The manifest is valid JSON.
5. Both `/icons/icon-192.png` and `/icons/icon-512.png` are reachable.
6. Browser DevTools → Application → Manifest shows the expected metadata.

## Service worker is not registering

Check:

1. `dist/sw.js` exists after the build.
2. `BaseLayout.astro` loads `src/scripts/pwa-register.ts`.
3. The production site is served over HTTPS.
4. Browser DevTools → Application → Service Workers shows `/sw.js`.
5. There is no stale service worker preventing the new version from activating.

For local development, unregister the old service worker when testing a changed cache generation.

## Previously visited article does not load offline

Check:

1. The article was fully loaded once while online.
2. The service worker is active.
3. The browser is actually in Offline mode.
4. A successful online navigation occurred after the current service-worker version became active.
5. The page is same-origin with `blog.sadhan.ch`.

Article/document navigation uses a network-first strategy. Online requests update the page cache; offline navigation falls back to the cached document when available.

## Custom offline page does not appear

The service worker must cache `/offline/` during installation.

Verify:

```text
public/sw.js
```

contains the installation cache step for:

```text
/offline/
```

Then verify:

```text
dist/offline/index.html
```

exists after the build.

If a previously visited route still loads while offline, that is expected: cached page content is preferred over the general offline fallback.

## App shortcuts are not visible

Manifest shortcuts are only exposed by browsers and operating systems that support the feature.

Check:

1. `public/manifest.webmanifest` contains the `shortcuts` array.
2. The generated `dist/manifest.webmanifest` contains the same shortcuts.
3. The PWA is installed rather than opened only as a normal browser tab.
4. The target platform exposes shortcuts from the application icon/menu.

## PWA cache appears stale

The service worker uses a versioned cache controlled by:

```text
CACHE_VERSION
```

in `public/sw.js`.

When the cache generation is deliberately changed, the old static/page caches are removed during service-worker activation.

Do not manually edit `dist/` to repair a cache problem.

## Large JavaScript chunk warning

The build may report:

```text
Some chunks are larger than 500 kB after minification.
```

The current largest chunk is associated with the Mermaid runtime. The repository already uses dynamic `import("mermaid")` and checks for Mermaid diagrams before loading the library.

Do not immediately raise `build.chunkSizeWarningLimit` just to suppress the warning.

First inspect generated JavaScript sizes:

```bash
find dist/_astro -type f -name "*.js" -printf '%s %p
' | sort -nr | head -15
```

If performance work is justified, measure whether ordinary pages actually request the large Mermaid chunk before changing Mermaid or Rollup/Rolldown configuration.

## Favicon is missing or incorrect

The current favicon is:

```text
public/favicon/favicon.ico
```

and the document shell references:

```text
/favicon/favicon.ico
```

If the old Astro icon appears, check the deployed URL directly:

```text
https://blog.sadhan.ch/favicon/favicon.ico
```

Then check browser favicon caching with a hard refresh or private window.

## Analytics appears not to work

Check in this order:

1. Consent was granted.
2. `PUBLIC_GA_MEASUREMENT_ID` exists in the production build environment.
3. The rendered page contains the GA ID through `data-ga-id`.
4. `window.gtag` is a function.
5. `window.dataLayer` contains the GA configuration.
6. Network requests contain `google-analytics.com/g/collect`.
7. A `page_view` request returns a successful response.
8. GA4 Realtime shows the visit.

The presence of `gtag.js` alone is not enough to prove that GA4 is receiving events.

## GA4 setup banner says no data

Use GA4 Realtime and browser Network requests as the primary verification.

A stale setup banner does not override evidence from:

```text
g/collect
```

requests and Realtime users.

## DNS or domain issue

Verify:

- Cloudflare is authoritative for DNS.
- `blog.sadhan.ch` is configured as the Cloudflare Pages custom domain.
- HTTPS is active.
- No competing DNS records have been introduced.

## Deployment issue

Check:

1. GitHub push completed.
2. Cloudflare Pages deployment started.
3. Build completed successfully.
4. Production deployment is the expected commit.
5. `manifest.webmanifest` and `sw.js` are reachable in production when PWA changes were included.
6. Browser/service-worker caches are not masking the result.

## General rule

Do not change several layers at once.

Prefer:

```text
Observe
  ↓
Reproduce
  ↓
Identify the failing layer
  ↓
Make the smallest change
  ↓
Build
  ↓
Verify
```


## Scheduled publishing troubleshooting

### Article remains hidden after its publication time

Check the article frontmatter first:

```yaml
draft: false
publishAt: "2026-09-01T09:07:00+05:30"
```

Then run locally:

```bash
node scripts/check-scheduled-publication.mjs
```

Expected normal output when nothing is due:

```text
No scheduled publications are waiting for deployment.
```

A due, unpublished article causes the checker to return exit code `10`.

### GitHub Actions does not trigger Cloudflare

Check:

1. The workflow is enabled.
2. The repository secret `CLOUDFLARE_DEPLOY_HOOK` exists.
3. The checker returns exit code `10` when a publication is due.
4. The Cloudflare Deploy Hook still points to the `main` branch.
5. The workflow's Cloudflare step is not being skipped.

The workflow can be started manually from **Actions → Scheduled Publishing → Run workflow**.

### Checker returns 10 locally but the article is already live

The checker tests the production article URL. If the URL is already reachable, the article should not be considered pending. If this condition is unexpected, check the production URL and the article slug derived from the source filename.

### Do not confuse Cloudflare build timing with publication filtering

A future article can exist in GitHub and even be processed by a normal Cloudflare build while remaining excluded from generated routes. It becomes public only after a build occurs when its `publishAt` timestamp has been reached.

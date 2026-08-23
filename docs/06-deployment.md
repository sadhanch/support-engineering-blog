# 6. Deployment

## Production platform

The site is deployed as a static Astro site through Cloudflare Pages.

The source repository is hosted on GitHub.

## Production branch

The production workflow uses:

```text
main
```

A successful push to the production branch triggers the Cloudflare Pages deployment.

## Build command

Cloudflare Pages uses the Astro production build:

```bash
npm run build
```

The build output is:

```text
dist/
```

## What the build generates

The production build includes:

- static HTML routes
- optimized images
- Pagefind index
- RSS feed
- sitemap
- PWA manifest
- PWA service worker
- offline fallback route
- static assets

## Deployment workflow

```text
Local change
    ↓
npm run build
    ↓
git commit
    ↓
git push origin main
    ↓
Cloudflare Pages
    ↓
Production deployment
```

## Environment variables

The current production Analytics configuration requires:

```text
PUBLIC_GA_MEASUREMENT_ID
```

The value is configured in the Cloudflare Pages build environment.

Do not place production environment values in committed source code.

## Production verification

After a deployment:

1. Open the production homepage.
2. Open an article page.
3. Check navigation and search.
4. Check light/dark theme.
5. Check keyboard navigation.
6. Check favicon.
7. Verify `https://blog.sadhan.ch/manifest.webmanifest` returns the expected manifest.
8. Verify `https://blog.sadhan.ch/sw.js` returns the current service worker.
9. Verify the installed PWA still opens with the expected identity and shortcuts on a supported platform.
10. If relevant, verify offline behavior using a previously visited article and the `/offline/` fallback.
11. If relevant, verify Analytics consent behavior.
12. Confirm the Cloudflare deployment completed successfully.

## Rollback

If a deployment introduces a regression, use Cloudflare Pages deployment history to identify the previous successful deployment and roll back/redeploy according to the current Cloudflare Pages controls.

Remember that an installed PWA may retain a service-worker cache across deployments. A service-worker version change is handled by `CACHE_VERSION` in `public/sw.js`; when a new service-worker version activates, old PWA caches are removed.

Do not attempt to repair a production deployment by manually editing generated `dist/` files.

## Scheduled publication deployment path

Normal commits continue to deploy through the existing GitHub-connected Cloudflare Pages build. Scheduled publication adds a second, controlled deployment trigger:

```text
09:07 IST daily
      |
      v
GitHub Actions
      |
      v
check-scheduled-publication.mjs
      |
      +--> nothing due -> no deployment
      |
      +--> due + not live -> POST to Cloudflare Deploy Hook
                                      |
                                      v
                                  Cloudflare build
                                      |
                                      v
                                published article
```

The Deploy Hook URL is stored as the GitHub repository secret `CLOUDFLARE_DEPLOY_HOOK`. It must never be committed to the repository.

The scheduled workflow is defined in `.github/workflows/scheduled-publishing.yml`. It can also be started manually with GitHub Actions for testing.

The current production workflow was tested end-to-end before being considered ready for daily use.

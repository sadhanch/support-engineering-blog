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
7. If relevant, verify Analytics consent behavior.
8. Confirm the Cloudflare deployment completed successfully.

## Rollback

If a deployment introduces a regression, use Cloudflare Pages deployment history to identify the previous successful deployment and roll back/redeploy according to the current Cloudflare Pages controls.

Do not attempt to repair a production deployment by manually editing generated `dist/` files.

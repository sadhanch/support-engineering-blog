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
5. Browser cache is not masking the result.

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

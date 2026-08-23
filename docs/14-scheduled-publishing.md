# 14. Scheduled Publishing

## Purpose

Support Engineering Blog supports scheduled publication without introducing a CMS, database, dynamic application server, or repository-mutating publishing bot.

Git remains the source of truth. Astro decides which articles are eligible for the generated site, GitHub Actions determines whether a deployment is required, and Cloudflare Pages performs the rebuild.

## Production schedule

The blog currently follows a **one-article-per-day** publication model with a standard publication window of:

```text
09:07 Asia/Kolkata
09:07 IST / UTC+05:30
```

The workflow is intentionally offset from the top of the hour. The schedule can be changed later in `.github/workflows/scheduled-publishing.yml`.

## Article authoring

Existing articles do not need a new field. The optional `publishAt` value is used only when an article needs scheduled publication.

Example:

```yaml
draft: false
publishDate: 2026-09-01
publishAt: "2026-09-01T09:07:00+05:30"
```

### Publication rules

```text
draft: true
    -> never published

draft: false + no publishAt
    -> existing article behavior; published normally

draft: false + future publishAt
    -> excluded from generated publication routes

draft: false + past publishAt
    -> eligible for generation
```

`publishDate` remains the editorial/publication date field. `publishAt` is the exact timestamp used for scheduling. Historical articles should not be retrofitted with `publishAt` unless their publication timing needs to change.

Use an explicit offset such as `+05:30`; do not use an ambiguous local-time string.

## Content-layer implementation

The schema in `src/content.config.ts` defines:

```ts
publishAt: z.coerce.date().optional(),
```

Published article retrieval in `src/lib/articles.ts` excludes drafts and future `publishAt` values. This central filter is the authoritative publication rule used by the Astro site.

Because existing articles do not have `publishAt`, they continue to be treated as published when `draft` is `false`.

## Scheduler components

### Checker

`script/check-scheduled-publication.mjs`:

1. Reads Markdown/MDX files in `src/content/articles/`.
2. Ignores drafts and articles without `publishAt`.
3. Ignores timestamps that have not arrived.
4. Checks whether a due article is already available at `https://blog.sadhan.ch/articles/<slug>/`.
5. Reports pending publications only when the article is due and not yet live.

Exit codes:

```text
0  -> no deployment required
10 -> at least one due, unpublished article exists
1  -> checker failure
```

The checker uses `process.exitCode` rather than forcibly terminating Node, avoiding Windows/libuv shutdown issues encountered during local testing. Production URL checks use a bounded request timeout.

### GitHub Actions workflow

`.github/workflows/scheduled-publishing.yml` runs:

```text
Every day at 09:07 Asia/Kolkata
        |
        v
Checkout main branch
        |
        v
Run scheduled-publication checker
        |
        +--> exit 0 -> finish successfully
        |
        +--> exit 10 -> trigger Cloudflare
        |
        +--> exit 1 -> fail workflow
```

The workflow also exposes `workflow_dispatch` so it can be run manually from GitHub Actions during testing or maintenance.

The workflow requests only:

```yaml
permissions:
  contents: read
```

It does not create commits or change article files.

## Cloudflare integration

The Cloudflare Pages project contains a Deploy Hook named: `scheduled-publishing`, configured to build the `main` branch.

The Deploy Hook URL is stored in the GitHub repository secret:

```text
CLOUDFLARE_DEPLOY_HOOK
```

The URL must never be committed to the repository, placed in source code, or pasted into public documentation.

The workflow sends an HTTP `POST` to the secret URL only when the checker returns exit code `10`.

## Why the system does not run every 15 minutes

The original design considered a 15-minute scheduler. That was rejected because the blog follows a one-article-per-day publishing model. A single daily check reduces unnecessary GitHub Actions executions and keeps the operational model simple.

This means `publishAt` should normally match the standard daily publication window. Arbitrary intraday publication times are not guaranteed by the current daily scheduler.

## End-to-end production validation

Scheduled publishing was tested with a temporary article before the automation was considered production-ready. The validation included:

```text
Future publishAt
    -> article absent from generated route

Past publishAt
    -> article generated

No due articles
    -> checker returns 0

Due + unpublished article
    -> checker returns 10

Manual GitHub Actions run
    -> Cloudflare Deploy Hook triggered

Production rebuild
    -> article becomes live

Second checker run after publication
    -> article recognized as already live
    -> no repeated deployment
```

The temporary test article was removed after validation.

## Operational procedure for publishing an article

For a scheduled article:

1. Write and validate the article as usual.
2. Set `draft: false` when it is approved for publication.
3. Set `publishDate` to the intended editorial date.
4. Add `publishAt` using the standard 09:07 IST timestamp.
5. Commit and push to `main`.
6. Cloudflare may build immediately, but the future article remains excluded from the public generated routes.
7. At the next daily 09:07 IST check on or after the scheduled timestamp, GitHub Actions detects the pending publication.
8. The workflow triggers Cloudflare Pages.
9. Astro rebuilds the site and the article becomes public.

## Manual verification

### Local checker

Run:

```bash
node scripts/check-scheduled-publication.mjs
```

Normal state:

```text
No scheduled publications are waiting for deployment.
```

### GitHub Actions

Go to:

```text
GitHub -> support-engineering-blog -> Actions -> Scheduled Publishing
```

Use **Run workflow** for a controlled test.

### Production article

After deployment, verify the article directly at:

```text
https://blog.sadhan.ch/articles/<slug>/
```

Then rerun the checker to verify that the already-live article does not create a second pending deployment.

## Troubleshooting summary

| Symptom | Check |
|---|---|
| Article not public at publication time | `draft`, `publishAt`, daily schedule, and Actions run |
| Checker returns 10 locally | Confirm the production URL is genuinely absent |
| Cloudflare step skipped | Confirm checker output is exit code 10 and the workflow condition matches it |
| Deploy Hook fails | Check `CLOUDFLARE_DEPLOY_HOOK` secret and Cloudflare hook/branch configuration |
| Existing articles disappear | Inspect `src/lib/articles.ts`; historical articles should publish without `publishAt` when `draft` is false |
| Schedule runs but article stays hidden | Confirm the scheduled timestamp is in `Asia/Kolkata` with explicit `+05:30` offset and that a new Cloudflare build occurred |

## Maintenance guidance

Keep the following responsibilities separate:

```text
Astro content layer
  -> decides what is public

GitHub Actions
  -> decides when a rebuild is needed

Cloudflare Pages
  -> builds and deploys the static site
```

Do not add repository-mutating automation merely to flip `draft` or rewrite frontmatter at publication time. The current design is intentionally declarative: the article metadata remains unchanged, and the build determines eligibility.

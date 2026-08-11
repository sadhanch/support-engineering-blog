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

## Periodic technical maintenance

Review dependencies periodically:

```bash
npm outdated
```

Do not upgrade Astro or major integrations blindly. Run the full production build and regression QA after dependency upgrades.

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

# Support Engineering Blog

The Support Engineering Blog (SEB) is a static technical publication built with Astro and focused on Microsoft 365 administration, support engineering, project management, and related technical guidance.

**Production:** https://blog.sadhan.ch/  
**Source repository:** https://github.com/sadhanch/support-engineering-blog

## Documentation

- [Project Overview](docs/01-project-overview.md)
- [Architecture](docs/02-architecture.md)
- [Development](docs/03-development.md)
- [Content Authoring](docs/04-content-authoring.md)
- [Design System](docs/05-design-system.md)
- [Deployment](docs/06-deployment.md)
- [Domain and DNS](docs/07-domain-and-dns.md)
- [Analytics and SEO](docs/08-analytics-and-seo.md)
- [Maintenance](docs/09-maintenance.md)
- [Troubleshooting](docs/10-troubleshooting.md)
- [Architecture and Project Decisions](docs/11-decisions.md)
- [Final Repository Audit](docs/12-final-audit.md)
- [Progressive Web App](docs/13-progressive-web-app.md)
- [Scheduled Publishing](docs/14-scheduled-publishing.md)
- [Content Quality, Health, Taxonomy, and Review](docs/15-content-quality-and-health.md)
- [Podcast](docs/16-podcast.md)

## Technology

- Astro 7
- TypeScript
- Markdown and MDX
- CSS
- Pagefind
- `@astrojs/sitemap`
- `@astrojs/rss`
- Cloudflare Pages
- GitHub
- Progressive Web App APIs (Manifest + Service Worker)
- GitHub Actions scheduled publishing

## Common commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run content:check
npm run content:health
```

`npm run build` produces the static production output in `dist/`.

## Content

Articles live in:

```text
src/content/articles/
```

Content collections are defined in:

```text
src/content.config.ts
```

Articles live in `src/content/articles/`. Podcast episodes live in `src/content/podcast/` and are documented in [Podcast](docs/16-podcast.md).

Both `.md` and `.mdx` files are supported.

Scheduled articles can use the optional `publishAt` frontmatter field. Existing articles do not need this field. Articles can also record an optional internal `reviewedDate` for technical review tracking. See [Scheduled Publishing](docs/14-scheduled-publishing.md) and [Content Quality, Health, Taxonomy, and Review](docs/15-content-quality-and-health.md).

## Maintenance documentation

The current maintenance package documents PWA behavior, scheduled publishing, content quality gates, content health reporting, technology taxonomy, and technical review tracking. Start with [Maintenance](docs/09-maintenance.md) and [Content Quality, Health, Taxonomy, and Review](docs/15-content-quality-and-health.md).

## Production notes

The production site is deployed through Cloudflare Pages from the GitHub repository. DNS is managed by Cloudflare, while the domain was originally registered through GoDaddy.

Google Analytics 4 is consent-controlled and receives its public Measurement ID through the Cloudflare build environment variable:

```text
PUBLIC_GA_MEASUREMENT_ID
```

Do not commit the Measurement ID as a source-code constant or add credentials to the repository.

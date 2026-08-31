# 8. Analytics and SEO

## Google Analytics 4

The site uses Google Analytics 4 with Measurement ID:

```text
G-M35DC3WSK8
```

The ID is not hard-coded in source code.

It is supplied through:

```text
PUBLIC_GA_MEASUREMENT_ID
```

and exposed to the consent controller through:

```html
<html data-ga-id="...">
```

## Analytics consent model

The current implementation uses explicit analytics consent.

Storage key:

```text
seb-analytics-consent
```

States:

```text
granted
denied
```

Behavior:

```text
No decision
    ↓
Consent banner shown

Denied
    ↓
Analytics not loaded

Granted
    ↓
Google tag loaded
    ↓
GA4 configured
```

Google Analytics is therefore not loaded before the visitor grants analytics consent.

## GA4 verification

The production implementation was verified at the browser level.

Successful verification included:

- `window.gtag` initialized
- `window.dataLayer` populated
- `G-M35DC3WSK8` configured
- `page_view` collection request sent
- `google-analytics.com/g/collect` returned HTTP `204`
- GA4 Realtime displayed active users

The important troubleshooting signal is the actual collection request, not merely the presence of `gtag.js`.

## Search engine optimization

The base layout provides:

- page title
- meta description
- author
- robots directive
- canonical URL
- Open Graph metadata
- X/Twitter metadata
- JSON-LD structured data

Article pages generate:

```text
BlogPosting
```

structured data.

Non-article pages use:

```text
WebSite
```

structured data.

## Sitemap

`@astrojs/sitemap` generates the sitemap during the build.

The configured production site URL is:

```text
https://blog.sadhan.ch
```

The sitemap filter excludes:

```text
/search/
/design-system/
```

## Robots

The production `public/robots.txt` contains:

```text
User-agent: *
Allow: /

Sitemap: https://blog.sadhan.ch/sitemap-index.xml
```

## Google Search Console

Google Search Console was verified for the domain property:

```text
sadhan.ch
```

The sitemap was submitted successfully.

## Bing Webmaster Tools

Bing Webmaster Tools was successfully connected through the Google Search Console import.

The sitemap was submitted.

Bing URL Inspection confirmed that:

```text
https://blog.sadhan.ch/
```

is accessible to Bing and indexable.

## Important distinction

Search engine platform configuration lives outside this repository. The repository provides the site metadata, sitemap, robots file, canonical URLs, and structured data that those services consume.


## Podcast pages and SEO

Podcast pages use the same `BaseLayout.astro` document shell as the rest of the site. The podcast landing page and individual episode pages therefore inherit the canonical URL, Open Graph, X/Twitter, robots, and baseline structured-data behavior defined by the site shell.

The podcast landing page is: `https://blog.sadhan.ch/podcast/`. Individual episodes use the `/podcast/<episode-slug>/` pattern.

The podcast does not use the article RSS feed. Podcast distribution remains on the RSS.com podcast feed, while the blog provides the canonical editorial web destinations.

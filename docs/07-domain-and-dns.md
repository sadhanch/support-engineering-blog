# 7. Domain and DNS

## Domain arrangement

The domain was registered through GoDaddy.

DNS is managed through Cloudflare.

The production hostname is:

```text
blog.sadhan.ch
```

## Production relationship

```text
sadhan.ch
   |
   └── blog.sadhan.ch
             |
             v
      Cloudflare Pages
             |
             v
      Support Engineering Blog
```

## Operational principle

Cloudflare remains the DNS authority for the production domain.

Do not create competing DNS records at the registrar when the authoritative DNS is already managed by Cloudflare.

## Bing verification

Bing Webmaster Tools was successfully imported/verified through the Google Search Console domain property.

The imported property is:

```text
sadhan.ch
```

The blog subdomain was then confirmed through Bing URL Inspection.

The attempted standalone CNAME verification record was not required after the successful Google Search Console import.

## Search engine sitemap

The production sitemap is:

```text
https://blog.sadhan.ch/sitemap-index.xml
```

The repository's `public/robots.txt` also points crawlers to that sitemap.

## DNS changes

DNS changes should be made only when necessary. Prefer verifying the existing production configuration before adding new records.

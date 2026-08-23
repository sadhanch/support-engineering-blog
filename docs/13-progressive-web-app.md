# 13. Progressive Web App

## Purpose

The Support Engineering Blog includes a lightweight Progressive Web App (PWA) layer on top of the existing static Astro publication.

The goal is to make the site installable and useful when connectivity is interrupted without turning the blog into a client-heavy application.

## Current capabilities

The PWA currently provides:

- application manifest
- installable app identity
- 192px and 512px application icons
- standalone display mode
- service-worker registration
- network-first document navigation
- cached previously visited pages for offline reading
- cached same-origin CSS, JavaScript, and fonts after first retrieval
- branded `/offline/` fallback
- versioned service-worker caches
- app-icon shortcuts

## PWA files

```text
public/
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── manifest.webmanifest
└── sw.js

src/
├── pages/
│   └── offline.astro
├── scripts/
│   └── pwa-register.ts
└── layouts/
    └── BaseLayout.astro
```

## Manifest

`public/manifest.webmanifest` defines the installed application's:

- name
- short name
- description
- start URL
- scope
- standalone display mode
- theme/background colors
- application icons
- shortcuts

Current shortcuts are intentionally limited to:

```text
Latest Articles      /articles/
Microsoft 365       /category/microsoft-365/
Power Platform      /category/power-platform/
Search              /search/
```

Shortcut visibility depends on browser and operating-system support. They are only exposed from the installed PWA where the platform implements manifest shortcuts.

## Service-worker architecture

The service worker is `public/sw.js`.

It maintains two versioned caches:

```text
seb-pwa-v2-static
seb-pwa-v2-pages
```

The `CACHE_VERSION` constant controls the cache generation.

### Installation

During the `install` event, the service worker caches:

```text
/offline/
```

This guarantees that the branded offline fallback is available before it is needed.

### Activation

During `activate`, caches not matching the current `STATIC_CACHE` or `PAGE_CACHE` names are deleted. The new worker then claims existing clients.

### Navigation strategy

HTML navigation uses **network first**:

```text
Request page
    ↓
Try network
    ├── success → return fresh page + update page cache
    └── failure
          ↓
        cached page exists?
          ├── yes → return cached page
          └── no  → return /offline/
```

This is deliberate. The blog changes frequently, so fresh online content is more important than serving a stale cached page simply because it exists.

### Static asset strategy

Same-origin CSS, JavaScript, and font requests use a small cache-first strategy after their first successful network retrieval.

The worker does not deliberately precache the entire generated site or article/image library.

## Offline page

`src/pages/offline.astro` is intentionally self-contained.

The page uses inline critical CSS because external stylesheet requests may not be available when the page is being used as an offline fallback.

The page supports light/dark appearance through `prefers-color-scheme` rather than depending on the normal theme initialization script.

## Registration

`src/scripts/pwa-register.ts` registers `/sw.js` after the initial page load.

The registration is progressive enhancement:

- supported browser + successful registration → PWA functionality enabled
- unsupported browser or registration failure → normal website continues working

## Updating the service worker

When the caching model or service-worker behavior changes, increment:

```js
const CACHE_VERSION = "seb-pwa-v2";
```

in `public/sw.js`.

The new cache generation activates, and old cache generations are deleted during activation.

A normal content/article change does not require changing `CACHE_VERSION`; the network-first strategy updates the cached page when the page is successfully retrieved online.

## Testing checklist

### Manifest

```text
[ ] npm run build succeeds
[ ] dist/manifest.webmanifest exists
[ ] Browser Application → Manifest recognizes metadata
[ ] 192px icon loads
[ ] 512px icon loads
[ ] Installed app uses Support Engineering Blog identity
```

### Service worker

```text
[ ] dist/sw.js exists
[ ] Service worker is active
[ ] Previously visited article loads offline
[ ] Uncached route shows /offline/
[ ] Fresh online article content replaces cached content
```

### Shortcuts

```text
[ ] Latest Articles route is valid
[ ] Microsoft 365 route is valid
[ ] Power Platform route is valid
[ ] Search route is valid
[ ] Installed-platform shortcut menu exposes supported shortcuts
```

## Deliberately excluded features

The current PWA does not implement:

- push notifications
- background sync
- share-target behavior
- native share controls
- full-site precaching
- a separate PWA-only reader interface

These remain outside the current PWA scope. Richer mobile-specific features may be implemented in the dedicated Android application instead.

## Performance note

A Vite build warning currently identifies a Mermaid-related JavaScript chunk larger than the default 500 kB warning threshold.

The site already lazy-loads Mermaid using a dynamic `import("mermaid")` only after detecting Mermaid diagrams on the page. Therefore, the existence of the large Mermaid chunk does not by itself mean every article/page downloads that code.

Do not increase `build.chunkSizeWarningLimit` simply to hide the warning. If bundle performance becomes a real concern, measure which generated pages request the chunk before changing Mermaid or Rolldown configuration.

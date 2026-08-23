/**
 * Support Engineering Blog
 * ========================
 * PWA Service Worker
 *
 * Purpose:
 * Provides lightweight offline support for the Support Engineering Blog.
 *
 * Responsibilities:
 * - Cache the offline fallback page during service-worker installation.
 * - Cache successfully visited article/document pages.
 * - Cache locally served CSS, JavaScript, and font assets.
 * - Prefer fresh network content when the user is online.
 * - Serve previously cached content when the network is unavailable.
 * - Fall back to the branded /offline/ page when no cached page exists.
 * - Remove caches belonging to older PWA versions during activation.
 *
 * Caching philosophy:
 * The blog is a frequently updated technical publication, so this service
 * worker intentionally does NOT precache the entire site. Article pages use
 * a network-first strategy so fresh content is preferred whenever possible.
 *
 * Versioning:
 * Increment CACHE_VERSION whenever the cache structure or behavior changes
 * in a way that requires old cached data to be discarded.
 */

// ================================================================
// Cache Configuration
// ================================================================

/**
 * Change this value when a new service-worker cache generation is required.
 *
 * Example:
 *   seb-pwa-v2 → seb-pwa-v3
 *
 * During activation, caches from previous versions are deleted.
 */
const CACHE_VERSION = "seb-pwa-v2";

/**
 * Cache for static application assets such as stylesheets,
 * scripts, and fonts.
 */
const STATIC_CACHE = `${CACHE_VERSION}-static`;

/**
 * Cache for successfully retrieved page navigations.
 *
 * This includes article pages and other same-origin HTML pages
 * that users have visited while online.
 */
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

/**
 * Branded fallback page displayed when:
 * 1. The requested navigation cannot be fetched from the network.
 * 2. The requested page has not previously been cached.
 */
const OFFLINE_URL = "/offline/";

/**
 * Resource types that receive cache support through the
 * static-asset caching strategy.
 *
 * These correspond to Request.destination values.
 */
const STATIC_DESTINATIONS = new Set([
  "style",
  "script",
  "font",
]);


// ================================================================
// Service Worker Installation
// ================================================================

/**
 * Install event
 * ----------------------------------------------------------------
 * Runs when the browser installs a new version of the service worker.
 *
 * The offline page is cached immediately so that the service worker
 * always has a reliable fallback available before it begins controlling
 * pages.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);

      // The offline page is an essential PWA asset and must always
      // be available to the fallback path.
      await cache.add(OFFLINE_URL);
    })(),
  );

  /**
   * Activate the newly installed service worker immediately rather
   * than waiting for all existing tabs to close.
   */
  self.skipWaiting();
});


// ================================================================
// Service Worker Activation
// ================================================================

/**
 * Activate event
 * ----------------------------------------------------------------
 * Removes caches belonging to previous service-worker versions,
 * then takes control of all currently open pages.
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      /**
       * Keep only the caches belonging to the current PWA version.
       *
       * This prevents stale caches from accumulating after future
       * service-worker deployments.
       */
      await Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName !== STATIC_CACHE &&
              cacheName !== PAGE_CACHE,
          )
          .map((cacheName) => caches.delete(cacheName)),
      );

      /**
       * Make the new service worker control existing pages immediately.
       */
      await self.clients.claim();
    })(),
  );
});


// ================================================================
// Navigation Strategy
// ================================================================

/**
 * Network-first strategy
 * ----------------------------------------------------------------
 * Used for HTML navigation requests.
 *
 * Behavior:
 *   Online  → fetch the latest version from the network.
 *   Success → return it and update the page cache.
 *
 *   Offline → attempt to return the previously cached page.
 *   No cache → return the branded offline page.
 *
 * This strategy is intentional for the Support Engineering Blog:
 * readers should receive fresh articles whenever the network is available.
 */
async function networkFirst(request) {
  try {
    const response = await fetch(request);

    /**
     * Only cache successful responses.
     *
     * Failed responses should never overwrite a previously valid
     * cached article or page.
     */
    if (response.ok) {
      const cache = await caches.open(PAGE_CACHE);

      // Clone because the response body can only be consumed once.
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    /**
     * Network request failed.
     *
     * First attempt:
     * Return the exact page previously stored in the page cache.
     */
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    /**
     * Second attempt:
     * Return the dedicated Support Engineering Blog offline page.
     */
    const offlineResponse = await caches.match(OFFLINE_URL);

    if (offlineResponse) {
      return offlineResponse;
    }

    /**
     * Final defensive fallback.
     *
     * This should normally never be reached because /offline/ is
     * cached during service-worker installation.
     */
    return new Response(
      "You are offline.",
      {
        status: 503,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      },
    );
  }
}


// ================================================================
// Static Asset Strategy
// ================================================================

/**
 * Cache-first strategy for static assets
 * ----------------------------------------------------------------
 * Used for same-origin CSS, JavaScript, and font resources.
 *
 * Behavior:
 *   Cached → return immediately.
 *   Not cached → fetch from the network, then cache the response.
 *
 * Static assets change less frequently than article content, so
 * caching them improves performance and supports offline rendering.
 */
async function cacheStaticAsset(request) {
  /**
   * Check whether the requested asset already exists in the cache.
   */
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  /**
   * Asset is not cached yet, so retrieve it from the network.
   */
  const response = await fetch(request);

  /**
   * Cache only successful responses.
   */
  if (response.ok) {
    const cache = await caches.open(STATIC_CACHE);

    // Clone because the response body is also returned to the browser.
    await cache.put(request, response.clone());
  }

  return response;
}


// ================================================================
// Fetch Event
// ================================================================

/**
 * Fetch event
 * ----------------------------------------------------------------
 * Intercepts eligible requests made by pages controlled by the
 * service worker.
 */
self.addEventListener("fetch", (event) => {
  const request = event.request;

  /**
   * The service worker only handles GET requests.
   *
   * POST, PUT, DELETE, etc. are deliberately left untouched.
   */
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  /**
   * Only handle requests originating from the blog itself.
   *
   * External resources and third-party services remain under the
   * browser's normal request handling.
   */
  if (url.origin !== self.location.origin) {
    return;
  }

  /**
   * HTML navigation requests use the network-first strategy.
   *
   * This covers article pages, category pages, search pages,
   * and other navigable same-origin routes.
   */
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  /**
   * CSS, JavaScript, and font resources use the static-asset
   * cache-first strategy.
   */
  if (STATIC_DESTINATIONS.has(request.destination)) {
    event.respondWith(cacheStaticAsset(request));
  }
});
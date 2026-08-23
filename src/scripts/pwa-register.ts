/**
 * Support Engineering Blog
 * ========================
 * PWA Service Worker Registration
 *
 * Purpose:
 * Registers the site's Progressive Web App service worker so that the
 * browser can provide the offline and caching behavior implemented in
 * public/sw.js.
 *
 * Behavior:
 * - Only runs in browsers that support service workers.
 * - Waits until the page has finished loading before registration.
 * - Registers /sw.js for the entire site using the root scope.
 * - Logs successful registration for development diagnostics.
 * - Logs a warning if registration fails without preventing the website
 *   itself from continuing to operate normally.
 *
 * PWA design principle:
 * Service-worker support is progressive enhancement. The blog remains
 * fully functional as a normal website when service workers are unavailable
 * or registration fails.
 */

if ("serviceWorker" in navigator) {
  // Wait until the initial page load has completed so service-worker
  // registration does not compete with the page's critical startup work.
  window.addEventListener("load", async () => {
    try {
      /**
       * Register the PWA service worker from the site root.
       *
       * /sw.js controls the entire "/" scope, allowing the service worker
       * to handle article navigation, static assets, and the offline
       * fallback throughout the blog.
       */
      const registration =
        await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

      /**
       * Development diagnostic:
       * The registration scope confirms the portion of the site controlled
       * by the service worker.
       */
      console.log(
        "Support Engineering Blog service worker registered.",
        registration.scope,
      );
    } catch (error) {
      /**
       * Service-worker registration failure should never prevent the
       * underlying website from functioning.
       *
       * The blog remains usable as a normal website even when PWA
       * functionality is unavailable.
       */
      console.warn(
        "Support Engineering Blog service worker registration failed.",
        error,
      );
    }
  });
}
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration =
        await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

      console.log(
        "Support Engineering Blog service worker registered.",
        registration.scope
      );
    } catch (error) {
      console.warn(
        "Support Engineering Blog service worker registration failed.",
        error
      );
    }
  });
}
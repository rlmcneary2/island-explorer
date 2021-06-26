const version = "1";

const wgs = (self as unknown) as ServiceWorkerGlobalScope;

wgs.addEventListener("install", event => {
  console.log("service worker install event");

  return event.waitUntil(
    caches
      .open(version)
      .then((cache: Cache) =>
        cache.addAll([
          "https://acadia-explorer.netlify.app/api/InfoPoint/rest/Routes/GetVisibleRoutes",
        ])
      )
  );
});

wgs.addEventListener("activate", () => {
  console.log("service worker activate event");
});

wgs.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then((response: Response) => {
      // TODO: handle expiring the cache.

      if (response) {
        console.log("service worker cache entry found for ", event.request);
        return response;
      }

      console.log("service worker NO cache entry for ", event.request);
      return fetch(event.request);
    })
  );
});

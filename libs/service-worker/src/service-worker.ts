import * as pathData from "./paths.json";

const VERSION = "2021a";

const wgs = self as unknown as ServiceWorkerGlobalScope;

wgs.addEventListener("install", event => {
  console.log(`service-worker(${pathData.TARGET}): install event`);

  const paths = [
    ...pathData.paths,
    ...pathData.apiLeftPaths.map(path => `${pathData.apiLeft}${path}`),
    ...pathData.routeIds.reduce<string[]>((acc, id) => {
      acc.push(
        `${pathData.apiLeft}${pathData.stopsPath}${id}`,
        `route/${id}/map`,
        `route/${id}/information`
      );
      return acc;
    }, [])
  ];

  event.waitUntil(
    caches
      .open(VERSION)
      .then(cache => cache.addAll(paths))
      .catch(err => console.error("service-worker: addAll err", err))
  );
});

wgs.addEventListener("fetch", async event => {
  event.respondWith(
    (async () => {
      let response = await caches.match(event.request, { cacheName: VERSION });

      if (!response) {
        console.log(`service-worker: fetching '${event.request.url}'`);
        try {
          response = await fetch(event.request, {
            credentials: "same-origin"
          });
        } catch (err) {
          console.log(
            `service-worker: fetch error;\nurl='${event.request.url}'\nerr=`,
            err
          );
        }

        // Cache google fonts that vary by browser, etc.
        const { pathname: requestPathname, hostname: requestHostname } =
          new URL(event.request.url);
        if (
          requestHostname === "fonts.googleapis.com" ||
          requestHostname === "fonts.gstatic.com"
        ) {
          console.log(`service-worker: caching '${event.request.url}'`);
          (await caches.open(VERSION)).put(event.request, response.clone());
        }

        // Cache mapbox files
        const mapboxUrl = `${requestHostname}${requestPathname}`;
        if (
          mapboxUrl.startsWith("api.mapbox.com/styles") ||
          mapboxUrl.startsWith("api.mapbox.com/fonts")
        ) {
          console.log(`service-worker: caching '${event.request.url}'`);
          (await caches.open(VERSION)).put(event.request, response.clone());
        }

        return response;
      } else {
        console.log(`service-worker: CACHED '${event.request.url}'`);
        return response;
      }
    })()
  );
});

import * as version from "./version.json";
import * as pathData from "./paths.json";

const CACHE_VERSION = "Island-Explorer-2022n";

const wgs = self as unknown as ServiceWorkerGlobalScope;

wgs.addEventListener("message", evt => {
  if (evt.data === "SKIP_WAITING") {
    const source = evt.source as Client;

    wgs.skipWaiting().then(() => {
      source.postMessage({
        cacheVersion: CACHE_VERSION,
        clientData: evt.data,
        response: "COMPLETED",
        version: version.version
      });
    });
  }
});

wgs.addEventListener("install", async event => {
  console.log(
    `service-worker[${version.version}](${pathData.TARGET}): install event.`
  );

  const paths = [
    ...pathData.paths,
    ...pathData.apiLeftPaths.map(path => `${pathData.apiLeft}${path}`),
    ...pathData.routeIds.reduce<string[]>((acc, id) => {
      acc.push(
        `route/${id}/map`,
        `route/${id}/information`,
        `assets/trace-${id}.json`
      );
      return acc;
    }, [])
  ];

  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then(async cache => {
        await cache.addAll(paths);
        console.log(`service-worker[${version.version}]: addAll completed.`);
      })
      .catch(err =>
        console.error(`service-worker[${CACHE_VERSION}]: addAll err `, err)
      )
  );
});

wgs.addEventListener("activate", event => {
  console.log(`service-worker[${version.version}]: activate event`);

  event.waitUntil(
    caches.keys().then(async keys => {
      await Promise.all([
        keys.map(key => {
          // Have to check a list of our old versions because other things (like
          // mapbox) can create a cache that they need and those caches will be
          // included in the collection of keys, they must NOT be deleted.
          if (
            key !== CACHE_VERSION &&
            (key.startsWith("Island-Explorer-") ||
              key === "2021a" ||
              key === "2021b")
          ) {
            console.log(
              `service-worker[${CACHE_VERSION}]: deleting cache '${key}'.`
            );
            return caches.delete(key);
          }
        })
      ]);

      console.log(`service-worker[${CACHE_VERSION}]: caches delete completed.`);
    })
  );
});

wgs.addEventListener("fetch", async event => {
  event.respondWith(
    (async () => {
      let response = await caches.match(event.request, {
        cacheName: CACHE_VERSION
      });

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
          (await caches.open(CACHE_VERSION)).put(
            event.request,
            response.clone()
          );
        }

        // Cache mapbox files
        const mapboxUrl = `${requestHostname}${requestPathname}`;
        if (
          mapboxUrl.startsWith("api.mapbox.com/styles") ||
          mapboxUrl.startsWith("api.mapbox.com/fonts")
        ) {
          console.log(`service-worker: caching '${event.request.url}'`);
          (await caches.open(CACHE_VERSION)).put(
            event.request,
            response.clone()
          );
        }

        return response;
      } else {
        console.log(`service-worker: CACHED '${event.request.url}'`);
        return response;
      }
    })()
  );
});

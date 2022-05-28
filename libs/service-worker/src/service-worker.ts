import * as pathData from "./paths.json";

const VERSION = "2021a";

const wgs = self as unknown as ServiceWorkerGlobalScope;

wgs.addEventListener("install", event => {
  console.log(`service-worker(${pathData.TARGET}): install event`);

  const paths = [
    ...pathData.paths,
    ...pathData.apiLeftPaths.map(path => `${pathData.apiLeft}${path}`),
    ...pathData.routeIds.map(
      id => `${pathData.apiLeft}${pathData.stopsPath}${id}`
    )
  ];

  event.waitUntil(
    caches
      .open(VERSION)
      .then(cache => cache.addAll([...paths]))
      .catch(err => console.error("service-worker: addAll err", err))
  );
});

wgs.addEventListener("fetch", async event => {
  const response = await caches.match(event.request);

  if (!response) {
    console.log(`service-worker: fetching '${event.request.url}'`);
    // event.request.headers.forEach((...args) =>
    //   console.log("service-worker: request headers=", args)
    // );
    const response = await fetch(event.request, { credentials: "same-origin" });
    // try {
    //   response.headers.forEach((...args) =>
    //     console.log("service-worker: response headers=", args)
    //   );
    // } catch (err) {
    //   console.log("service-worker: header error=", err);
    // }

    // Cache google fonts that vary by browser, etc.
    const { pathname: requestPathname, hostname: requestHostname } = new URL(
      event.request.url
    );
    if (
      requestHostname === "fonts.googleapis.com" ||
      requestHostname === "fonts.gstatic.com"
    ) {
      (await caches.open(VERSION)).put(event.request, response);
      console.log(`service-worker: caching '${event.request.url}'`);
    }

    // Cache mapbox files
    const mapboxUrl = `${requestHostname}${requestPathname}`;
    if (
      mapboxUrl.startsWith("api.mapbox.com/styles") ||
      mapboxUrl.startsWith("api.mapbox.com/fonts")
    ) {
      (await caches.open(VERSION)).put(event.request, response);
      console.log(`service-worker: caching '${event.request.url}'`);
    }

    return response;
  } else {
    console.log(`service-worker: CACHED '${event.request.url}'`);
    return response;
  }
});

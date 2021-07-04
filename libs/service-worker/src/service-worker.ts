const version = "1";

const wgs = (self as unknown) as ServiceWorkerGlobalScope;

wgs.addEventListener("install", () => {
  console.log("service worker install event");
});

wgs.addEventListener("activate", () => {
  console.log("service worker activate event");
});

wgs.addEventListener("fetch", event => {
  console.log("service worker fetch event ", event.request.url);
  let responsePromise: Promise<Response>;

  if (matchingRequest(event.request)) {
    console.log("service worker matching request ", event.request.url);
    responsePromise = cacheFirst(event.request);
  } else {
    responsePromise = fetch(event.request);
  }

  event.respondWith(responsePromise);
});

const urlMatches: RegExp[] = [
  /\/InfoPoint\/rest\/Routes\/GetVisibleRoutes$/,
  /\/InfoPoint\/Resources\/Traces\/[a-z|A-Z]*.kml$/,
  /\/InfoPoint\/rest\/Stops\/GetAllStopsForRoutes\?routeIDs=/
];

function matchingRequest(request: Request): boolean {
  return urlMatches.some(urlMatch => urlMatch.test(request.url));
}

async function cacheFirst(request: Request) {
  let response = await caches.match(request);
  // TODO: handle expiring the cache.

  if (response) {
    console.log("service worker cache entry found for ", request.url);
    return response;
  }

  console.log("service worker NO cache entry for ", request.url);

  try {
    response = await fetch(request);
  } catch (err) {
    console.log("service worker failed to fetch ", request.url);
    throw err;
  }

  if (!response.ok) {
    console.log("service worker fetch response not ok ", request.url);
    throw response;
  }

  console.log("service worker fetched response ", response.url);

  const cache = await caches.open(version);
  await cache.put(request, response.clone());

  console.log("service worker cached response ", response.url);

  return response;
}

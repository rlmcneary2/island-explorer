const version = "2021a";

const wgs = (self as unknown) as ServiceWorkerGlobalScope;

wgs.addEventListener("install", event => {
  console.log("service worker install event");

  event.waitUntil(
    caches.open(version).then(cache => {
      // TODO list of URLs to cache.
      return cache.addAll([]);
    })
  );
});

wgs.addEventListener("activate", () => {
  console.log("service worker activate event");
});

wgs.addEventListener("message", (event: ReceivedMessageEvent) => {
  // console.log("service worker message event ", event);
  const { name } = event.data;
  if (name === "cache") {
    event.waitUntil(
      caches
        .open(version)
        .then(cache =>
          cache.addAll(
            // Does the cache already have any of these URLs? If so don't cache
            // them again.
            event.data.requests.map(({ url, ...req }) => new Request(url, req))
          )
        )
        .catch(err => console.log("service worker message err ", err))
        .then(() =>
          event.data.requests.forEach(
            req =>
              !urlMatches.some(rgx => rgx.test(req.url)) &&
              urlMatches.push(new RegExp(req.url))
          )
        )
        .catch(err =>
          console.log("service worker message urlMatches err ", err)
        )
    );
  }
});

wgs.addEventListener("fetch", event => {
  // console.log(
  //   `service worker fetch event (method='${event.request.method}') `,
  //   event.request.url
  // );

  let responsePromise: Promise<Response>;

  if (matchingRequest(event.request)) {
    // console.log("service worker matching request ", event.request.url);
    responsePromise = cacheFirst(event.request);
  } else {
    responsePromise = fetch(event.request);
  }

  event.respondWith(responsePromise);
});

const urlMatches: RegExp[] = [
  /\/InfoPoint\/rest\/Routes\/GetVisibleRoutes$/,
  /\/InfoPoint\/Resources\/Traces\/[a-z|A-Z]*.kml$/,
  /\/InfoPoint\/rest\/Stops\/GetAllStopsForRoutes\?routeIDs=/,
  /\/\/api.mapbox.com\/styles\/v1\/mapbox\/outdoors-v11\/?\?/ // We use the default remapgl topographic map style so cache it at install
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

  // console.log("service worker NO cache entry for ", request.url);

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

  // console.log("service worker cached response ", response.url);

  return response;
}

interface ReceivedMessageEvent extends ExtendableMessageEvent {
  data: {
    requests: [
      {
        headers: Record<string, string>;
        url: string;
      }
    ];
    name: string;
  };
}

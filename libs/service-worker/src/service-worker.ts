const API_LEFT = "https://acadia-explorer.netlify.app/api";

const VERSION = "2021a";

const wgs = self as unknown as ServiceWorkerGlobalScope;

wgs.addEventListener("install", event => {
  console.log("service worker install event");

  event.waitUntil(
    caches
      .open(VERSION)
      .then(cache =>
        cache.addAll([
          "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11?access_token=pk.eyJ1IjoicmxtY25lYXJ5MiIsImEiOiJjajgyZjJuMDAyajJrMndzNmJqZDFucTIzIn0.BYE_k7mYhhVCdLckWeTg0g",
          new Request(
            "//api.tiles.mapbox.com/mapbox-gl-js/v1.6.1/mapbox-gl.css",
            { headers: { accept: "text/css,*/*;q=0.1" } }
          ),

          `${API_LEFT}/InfoPoint/rest/Routes/GetVisibleRoutes`,

          `${API_LEFT}/InfoPoint/Resources/Traces/Oceanarium.kml`,
          `${API_LEFT}/InfoPoint/Resources/Traces/EdenStreet.kml`,
          `${API_LEFT}/InfoPoint/Resources/Traces/SandyBeach.kml`,
          `${API_LEFT}/InfoPoint/Resources/Traces/LoopRoad.kml`,
          `${API_LEFT}/InfoPoint/Resources/Traces/JordanPond.kml`,
          `${API_LEFT}/InfoPoint/Resources/Traces/BrownMountain.kml`,
          `${API_LEFT}/InfoPoint/Resources/Traces/SWH.kml`,
          `${API_LEFT}/InfoPoint/Resources/Traces/Schoodic.kml`,
          `${API_LEFT}/InfoPoint/Resources/Traces/Trenton.kml`,
          `${API_LEFT}/InfoPoint/Resources/Traces/blackwoods.kml`,

          `${API_LEFT}/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=1`,
          `${API_LEFT}/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=2`,
          `${API_LEFT}/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=3`,
          `${API_LEFT}/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=4`,
          `${API_LEFT}/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=5`,
          `${API_LEFT}/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=6`,
          `${API_LEFT}/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=7`,
          `${API_LEFT}/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=8`,
          `${API_LEFT}/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=9`,
          `${API_LEFT}/InfoPoint/rest/Stops/GetAllStopsForRoutes?routeIDs=10`
        ])
      )
  );
});

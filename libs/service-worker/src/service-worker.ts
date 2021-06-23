self.addEventListener("install", function () {
  console.log("service worker install event");
});

self.addEventListener("activate", function () {
  console.log("service worker activate event");
});

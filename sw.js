self.addEventListener("install", (e) => {
  e.waitUntil(startCache);
});

self.addEventListener("activate", () => {
  console.log("Service Worker Activated");
});

self.addEventListener("message", (e) => {
  if (e.data === "cache") {
    startCache();
  }
});

self.addEventListener("fetch", (e) => {
  if (e.request.method === "POST") return;
  if (navigator.onLine) return;
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});

function startCache() {
  caches.open("site-static").then((c) => {
    console.log("Caching Assets");
    c.addAll([
      "/",
      "/index.html",
      "/life.js",
      "/style.css",
      "/icons/icon.png",
    ]).then(() => console.log("Caching Done"));
  });
}

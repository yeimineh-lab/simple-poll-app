const CACHE_NAME = "poll-app-static-v2";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/app.css",
  "/app.mjs",
  "/offline.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// Bare cache app-shell/statisk innhold.
// IKKE cache API-kall.
function isStaticAsset(requestUrl) {
  const url = new URL(requestUrl);

  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith("/api/")) return false;

  return ASSETS_TO_CACHE.includes(url.pathname);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)),
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );

      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Bare håndter GET
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // ALDRI cache eller avskjær API-kall
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Navigasjon: prøv nett først, fallback til offline-side
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          const offline = await caches.match("/offline.html");
          return (
            offline ||
            new Response("Offline", {
              status: 503,
              headers: { "Content-Type": "text/plain" },
            })
          );
        }
      })(),
    );
    return;
  }

  // Kun kjente statiske filer: cache first
  if (isStaticAsset(request.url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
      })(),
    );
  }
});
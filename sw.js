/* ==========================================================
   PulsePal Configurator — sw.js
   - Precache the app shell + all pages (.frag)
   - Promise.allSettled: one bad path can't kill the whole install
   - Network-first, cache fallback: fresh files while online (and while
     developing on Live Server), still works offline in a parking lot
   Bump CACHE_VERSION whenever you ship changes.
   ========================================================== */

const CACHE_VERSION = "v1";
const CACHE_NAME = "pulsepal-configurator-" + CACHE_VERSION;

const PRECACHE_URLS = [
  "./",
  "index.html",
  "manifest.json",

  "css/main.css",
  "css/components.css",
  "css/pages.css",

  "js/theme.js",
  "js/dummy-data.js",
  "js/router.js",
  "js/app.js",

  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",

  "pages/login.frag",
  "pages/home.frag",
  "pages/install-step1.frag",
  "pages/install-step2.frag",
  "pages/install-step3.frag",
  "pages/install-step4.frag",
  "pages/install-step5.frag",
  "pages/install-complete.frag",
  "pages/my-installations.frag",
  "pages/installation-detail.frag",
  "pages/tools.frag",
  "pages/device-check.frag",
  "pages/troubleshoot.frag",
  "pages/settings.frag"
];

/* ---------- INSTALL: cache everything we can ---------- */
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.allSettled(
        PRECACHE_URLS.map(function (url) {
          return cache.add(url);
        })
      ).then(function (results) {
        results.forEach(function (result, i) {
          if (result.status === "rejected") {
            console.warn("[sw] could not cache:", PRECACHE_URLS[i]);
          }
        });
      });
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* ---------- ACTIVATE: remove old caches ---------- */
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys
          .filter(function (key) {
            return key.startsWith("pulsepal-configurator-") && key !== CACHE_NAME;
          })
          .map(function (key) {
            return caches.delete(key);
          })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* ---------- FETCH: network first, cache fallback ---------- */
self.addEventListener("fetch", function (event) {
  const request = event.request;

  // Only handle same-origin GET requests
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never touch Live Server's reload socket / scripts
  if (url.pathname.indexOf("livereload") !== -1 || url.pathname.indexOf("/ws") === 0) return;

  event.respondWith(
    fetch(request)
      .then(function (response) {
        // Keep a fresh copy for offline use
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, copy);
          });
        }
        return response;
      })
      .catch(function () {
        return caches.match(request).then(function (cached) {
          if (cached) return cached;
          // Offline page load: serve the app shell
          if (request.mode === "navigate") return caches.match("index.html");
          return new Response("", { status: 503, statusText: "Offline" });
        });
      })
  );
});
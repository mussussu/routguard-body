// RouteGuard Body — Service Worker (auto-versioned)
// We read the ?v=BUILD_ID from the script URL to version caches automatically.
const VERSION = new URL(self.location.href).searchParams.get('v') || 'dev';
const CACHE = `rg-${VERSION}-nav2`;

// App shell to pre-cache (keep this list tiny)
const APP_SHELL = [
  '/', '/index.html', '/manifest.webmanifest',
  '/images/icon-192-v2.png',
  '/images/icon-512-v2.png',
  '/images/icon-512-maskable-v2.png'
];

// --- Install: cache the app shell ---
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

// --- Activate: clear old caches and take control ---
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// --- Fetch strategy ---
// 1) SPA navigations: network-first, fallback to cached "/" (works offline)
// 2) Built assets (/assets/*.js, *.css): cache-first + update in background
// 3) Images/GIFs: cache-first
// 4) Default: network, fallback to cache
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // 1) SPA navigations → CACHE-FIRST index.html (reliable offline), update in background
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match('/index.html').then((cached) => {
        const online = fetch('/index.html')
          .then((res) => {
            caches.open(CACHE).then((c) => c.put('/index.html', res.clone()));
            return res;
          })
          .catch(() => cached); // if offline, use cached
        return cached || online; // if first time, use network, then cache
      })
    );
    return;
  }

  // 2) Built assets (Vite) → cache-first + update in background
  if (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(js|css)$/i)) {
    e.respondWith(
      caches.match(req).then((cached) => {
        const online = fetch(req).then((res) => {
          caches.open(CACHE).then((c) => c.put(req, res.clone()));
          return res;
        });
        return cached || online;
      })
    );
    return;
  }

  // 3) Images/GIFs → cache-first
  if (url.pathname.startsWith('/images/') || url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
    e.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          caches.open(CACHE).then((c) => c.put(req, res.clone()));
          return res;
        });
      })
    );
    return;
  }

  // 4) Default → network, fallback to cache
  e.respondWith(fetch(req).catch(() => caches.match(req)));
});

});

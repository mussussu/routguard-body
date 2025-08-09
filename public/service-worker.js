// RouteGuard Body — SW v2
const CACHE = 'rg-v2';
const APP_SHELL = [
  '/', '/index.html', '/manifest.webmanifest',
  '/images/icon-192.png', '/images/icon-512.png'
];

// install: cache the app shell
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

// activate: cleanup old caches and take control
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// fetch strategy:
// - navigation requests: network-first, fall back to cached index.html (SPA offline)
// - assets (/assets/*.js, *.css): cache-first, update in background
// - images/gifs: cache-first
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);

  // 1) SPA navigations
  const isNav = req.mode === 'navigate';
  if (isNav) {
    e.respondWith(
      fetch(req).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put('/', clone));
        return res;
      }).catch(() => caches.match('/') || caches.match('/index.html'))
    );
    return;
  }

  // 2) Built assets (Vite)
  if (url.pathname.startsWith('/assets/') || url.pathname.match(/\.(js|css)$/i)) {
    e.respondWith(
      caches.match(req).then(cached => {
        const fetchThenCache = fetch(req).then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        });
        return cached || fetchThenCache;
      })
    );
    return;
  }

  // 3) Images
  if (url.pathname.startsWith('/images/') || url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }))
    );
    return;
  }

  // default: try network, fall back to cache
  e.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

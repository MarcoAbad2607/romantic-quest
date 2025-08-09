const CACHE = 'rqg-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './service-worker.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  // tus assets locales:
  './models/carta1.png',
  './models/carta2.png',
  './models/carta3.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Para nuestros propios archivos: cache-first
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request))
    );
    return;
  }
  // Para Leaflet tiles (externo): network-first con fallback
  if (/tile.openstreetmap.org/.test(url.host)) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  // Resto: default
});

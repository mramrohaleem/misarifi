const CACHE_NAME = 'misarifi-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/script.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.5/dexie.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

/* تثبيت Service Worker وتخزين أصول التطبيق */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

/* جلب الموارد من الكاش أو الشبكة */
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((resp) => resp || fetch(e.request))
  );
});

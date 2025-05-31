/* اسم الكاش مع رقم إصدار لتسهيل التحديث عند تغيـير الملفات */
const CACHE_NAME = 'misarifi-cache-v1';

/* المجلّد الأساسي للموقع على GitHub Pages */
const BASE = '/misarifi/';

/* ملفات التطبيق التي تُحفظ للعمل أوفلاين */
const ASSETS = [
  BASE,                              // صفحة الجذر
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'script.js',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
  /* مكتبات CDN (يُفضَّل الاحتفاظ بنسخة محليّة منها فى الكاش) */
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/dexie/3.2.5/dexie.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

/* أثناء التثبيت—نضع كل الأصول فى الكاش */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

/* عند كل طلب—نرجع الملف من الكاش أو الشبكة إذا لم يكن محفوظًا */
self.addEventListener('fetch', event => {
  /* نتجاهل طلبات POST مثل حفظ البيانات، ونُعالِج GET فقط */
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResp => {
      return cachedResp || fetch(event.request);
    })
  );
});

/* تنظيف أى كاش قديم عند تحديث CACHE_NAME */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});

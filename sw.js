/* 防小人護盾 · Service Worker
   策略：Cache-First（index.html 先讀快取，無網路也能開）
   版本號改這裡即可強制更新快取 */
const CACHE_NAME = 'shield-v1';
const PRECACHE = [
  './',
  './index.html',
];

/* ── 安裝：預先快取核心頁面 ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

/* ── 啟用：清除舊版快取 ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ── 攔截請求：Cache-First，失敗才走網路 ── */
self.addEventListener('fetch', event => {
  /* 只處理 GET，API 呼叫直接放行 */
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('api.anthropic.com')) return;
  if (event.request.url.includes('cdn.tailwindcss.com')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        /* 只快取成功的 200 回應 */
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      });
    })
  );
});

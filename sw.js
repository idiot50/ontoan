/* sw.js — Service Worker cho trang chủ "Toán Vui" (hub chọn lớp).
 * Chiến lược: network-first, fallback cache (chạy offline ngay sau lần mở đầu).
 * CHỈ xử lý request same-origin + GET. Tất cả tài nguyên đều cùng-origin (offline thật).
 * Lưu ý: hub KHÔNG có engine.js.
 */
const CACHE = 'toanvui-hub-v1';

// App shell precache (đường dẫn TƯƠNG ĐỐI theo scope của SW).
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Chỉ can thiệp GET + same-origin; bỏ qua mọi thứ khác.
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Network OK -> cập nhật cache rồi trả về.
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        // Offline -> trả bản cache; điều hướng mà miss thì trả index.html.
        caches.match(req).then((hit) => {
          if (hit) return hit;
          if (req.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        })
      )
  );
});

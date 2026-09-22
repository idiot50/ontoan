/* sw.js — Service Worker cho trang chủ "Toán Vui" (hub chọn lớp).
 * Chiến lược: network-first, fallback cache (chạy offline ngay sau lần mở đầu).
 * CHỈ xử lý request same-origin + GET. Tất cả tài nguyên đều cùng-origin (offline thật).
 * Lưu ý: hub KHÔNG có engine.js.
 */
/* Nâng số phiên bản MỖI KHI trang chủ đổi nội dung (thêm/bớt thẻ chọn app).
   Máy đã "Lưu về máy" (PWA) giữ bản index.html cũ trong cache theo tên này; đổi tên
   cache thì trình duyệt cài lại service worker, nạp lại shell mới và dọn cache cũ —
   nhờ vậy thẻ app mới thêm chắc chắn hiện ra, kể cả khi mở lúc không có mạng.
   v2 (2026-08-09): thêm thẻ "Ôn Thi".
   v3 (2026-08-09): thẻ đổi tên "Thi Lớp 5" -> "Ôn Thi" và đổi đích ./thi-lop5/ -> ./on-thi/.
   v4 (2026-08-09): dựng lại bố cục cho vừa đúng MỘT màn, không phải kéo.
   v5 (2026-09-13): thêm thẻ "Từ Vựng Anh 4" (/tu-vung-anh4/).
   v6 (2026-09-14): thẻ đó đổi mô tả sang 117 từ Unit 1-7.
   v7 (2026-09-14): bổ sung trọng tâm ngữ pháp Unit 7 -> 155 từ.
   v8 (2026-09-14): thêm 3 trạng từ tần suất -> 158 từ.
   v9 (2026-09-14): thẻ đổi mô tả, app có thêm màn luyện trạng từ tần suất.
   v10 (2026-09-22): thêm Unit 8 -> 175 từ, có giọng đọc tiếng Việt. */
const CACHE = 'toanvui-hub-v10';

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
      // Chỉ dọn cache CŨ của CHÍNH app này (cùng tiền tố, khác version) — KHÔNG đụng
      // cache của app khác chung origin (hub/lop1/lop3/tienganh) để không phá offline của nhau.
      Promise.all(keys.filter((k) => k.indexOf(CACHE.replace(/-v\d+$/, '')) === 0 && k !== CACHE).map((k) => caches.delete(k)))
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

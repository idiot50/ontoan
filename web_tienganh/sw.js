/*
 * sw.js — Service Worker cho "Học tiếng Anh cùng Pi" (PWA offline-first).
 * ----------------------------------------------------------------------------
 * Chiến lược (ARCHITECTURE ADR-8):
 *   - App shell (HTML/CSS/JS/manifest/icon): NETWORK-FIRST, fallback cache
 *     → sửa code đẩy lên, lần online kế tiếp tự lấy bản mới; offline vẫn chạy.
 *   - Content & assets (content/**, assets/**): STALE-WHILE-REVALIDATE
 *     → mở offline tức thì (trả cache), đồng thời cập nhật nền cho lần sau.
 *       Trẻ không bị kẹt nội dung cũ ngay cả khi quên bump CACHE.
 *   - CHỈ same-origin GET; bỏ qua mọi request khác-origin (không cache cloud/bên thứ ba).
 *   - Cache name có VERSION → activate xoá cache cũ khi release.
 *
 * QUY TRÌNH RELEASE: khi đổi app shell hoặc cấu trúc cache, BUMP `CACHE` (vd v2→v3)
 * để activate dọn cache cũ. Content/asset tự cập nhật nền nhờ stale-while-revalidate
 * nên không bắt buộc bump khi chỉ sửa nội dung JSON.
 *
 * Lưu ý: trên file:// service worker KHÔNG chạy (cần http/https). App vẫn hoạt động
 * offline nhờ content nhúng (content-data.js). SW chỉ bật khi phục vụ qua server/HTTPS.
 */
'use strict';

var CACHE = 'enkids-v3';

// App shell precache lúc install. Đường dẫn tương đối theo scope.
// (Nội dung cũng nhúng sẵn trong content-data.js để chạy file://; precache JSON
//  giúp bản HTTP đủ-offline ngay lần tải đầu, không phải chờ stale-while-revalidate.)
var SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/tokens.css',
  './css/base.css',
  './js/tts.js',
  './js/engine.js',
  './js/progress.js',
  './js/content-data.js',
  './js/app.js',
  './assets/mascot/pi-icon.svg',
  './assets/mascot/pi-192.png',
  './assets/mascot/pi-512.png',
  './assets/mascot/apple-touch-icon.png',
  './content/level1/index.json',
  './content/level1/unit00.json',
  './content/level1/unit01.json',
  './content/level1/unit02.json',
  './content/level1/unit03.json',
  './content/level1/unit04.json',
  './content/level1/unit05.json',
  './content/level1/unit06.json',
  './content/level1/unit07.json',
  './content/level1/unit08.json',
  './content/level1/unit09.json',
  './content/level1/unit10.json',
  './content/level1/unit11.json',
  './content/level1/unit12.json',
  './content/level1/unit13.json',
  './content/level1/unit14.json',
  './content/level1/unit15.json'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      // addAll thất bại nếu 1 file lỗi → dùng vòng từng file để chịu lỗi.
      return Promise.all(SHELL.map(function (url) {
        return cache.add(url).catch(function () { /* bỏ qua file lỗi lẻ */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  // Nhiều app PWA chung origin (hub /ontoan/, /lop1/, /lop3/, /tienganh/) → CHỈ dọn cache
  // CŨ của CHÍNH app này (cùng tiền tố 'enkids-', khác version). KHÔNG xoá cache app khác,
  // nếu không sẽ phá khả năng offline của nhau khi người dùng đi lại giữa các app.
  var PREFIX = CACHE.replace(/-v\d+$/, '');
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k.indexOf(PREFIX) === 0 && k !== CACHE) return caches.delete(k);
        return null;
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

function isContentOrAsset(url) {
  return /\/(content|assets)\//.test(url.pathname);
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (e) { return; }

  // CHỈ xử lý same-origin (không can thiệp request khác-origin).
  if (url.origin !== self.location.origin) return;

  if (isContentOrAsset(url)) {
    // STALE-WHILE-REVALIDATE cho nội dung/asset:
    // trả ngay bản cache (mở offline tức thì) + fetch nền để cập nhật cho lần sau.
    event.respondWith(
      caches.match(req).then(function (hit) {
        var fetching = fetch(req).then(function (res) {
          if (res && res.ok) {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        }).catch(function () { return hit; });
        return hit || fetching;
      })
    );
    return;
  }

  // NETWORK-FIRST cho app shell.
  event.respondWith(
    fetch(req).then(function (res) {
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) {
        if (hit) return hit;
        // fallback cuối: trang chủ (SPA) cho điều hướng.
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 504, statusText: 'offline' });
      });
    })
  );
});

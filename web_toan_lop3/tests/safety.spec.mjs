/*
 * safety.spec.mjs — kiểm TĨNH index.html theo luật an toàn trẻ em (DESIGN.md §6).
 * KHÔNG có: URL ra ngoài, <iframe>, fetch, XMLHttpRequest, ảnh mạng, analytics,
 *           cookie, geolocation, WebSocket.
 * CÓ: lang="vi", aria-live.
 * Hợp đồng tích hợp: MC gọi check(...) với index số nguyên (selectedIndex);
 *                    stem/choices/explain render bằng innerHTML.
 * Vi phạm an toàn -> FAIL nặng (đánh dấu 🔴 trong msg).
 */
import { makeReporter } from './_harness.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML_PATH = path.join(__dirname, '..', 'index.html');

export function run() {
  const R = makeReporter('SAFETY');
  const html = fs.readFileSync(HTML_PATH, 'utf8');

  // Bỏ comment HTML để tránh báo nhầm trên chú thích.
  const code = html.replace(/<!--[\s\S]*?-->/g, '');

  /* --------- CẤM: mạng / nhúng ngoài / theo dõi (vi phạm = 🔴) --------- */
  const forbidden = [
    { re: /<iframe[\s>]/i, name: 'thẻ <iframe>' },
    { re: /\bfetch\s*\(/i, name: 'gọi fetch()' },
    { re: /XMLHttpRequest/i, name: 'XMLHttpRequest' },
    { re: /\bWebSocket\b/i, name: 'WebSocket' },
    { re: /navigator\.sendBeacon/i, name: 'sendBeacon' },
    { re: /\bEventSource\b/i, name: 'EventSource (SSE)' },
    { re: /navigator\.geolocation/i, name: 'geolocation' },
    { re: /document\.cookie/i, name: 'document.cookie' },
    { re: /\bimportScripts\s*\(/i, name: 'importScripts' },
    { re: /googletagmanager|google-analytics|gtag\(|analytics\.|mixpanel|hotjar|facebook\.net|fbq\(/i, name: 'analytics/tracking' },
    // thuộc tính nguồn mạng
    { re: /\b(?:src|href)\s*=\s*["']?https?:\/\//i, name: 'tài nguyên http(s) ngoài' },
    { re: /\b(?:src|href)\s*=\s*["']?\/\//i, name: 'tài nguyên protocol-relative //' },
    // ảnh mạng / CDN
    { re: /url\(\s*["']?https?:/i, name: 'CSS url() mạng' },
    { re: /<img[^>]+src\s*=\s*["']?https?:/i, name: '<img> nguồn mạng' }
  ];
  forbidden.forEach(f => {
    R.ok(!f.re.test(code), '🔴 KHÔNG được có ' + f.name, f.re.source);
  });

  // <link>/<script src=...> chỉ được trỏ tài nguyên cục bộ (không http, không //).
  const linkSrcs = [];
  const reSrc = /<(?:script|link|img|source|audio|video)\b[^>]*\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
  let mm;
  while ((mm = reSrc.exec(code)) !== null) linkSrcs.push(mm[1]);
  linkSrcs.forEach(u => {
    const bad = /^https?:/i.test(u) || u.startsWith('//') || /^data:/i.test(u) && /base64/i.test(u) === false ? false : false;
    R.ok(!/^https?:/i.test(u) && !u.startsWith('//'),
      '🔴 nguồn cục bộ (không mạng): ' + u, u);
  });
  // engine.js phải được nhúng cục bộ
  R.ok(/<script\s+src=["']engine\.js["']\s*>/i.test(code), 'nhúng engine.js cục bộ', null);

  /* --------------------- BẮT BUỘC: a11y cơ bản --------------------- */
  R.ok(/<html[^>]*\blang\s*=\s*["']vi["']/i.test(code), 'CÓ <html lang="vi">', null);
  R.ok(/aria-live\s*=\s*["']polite["']/i.test(code), 'CÓ vùng aria-live="polite"', null);
  R.ok(/<meta[^>]+charset\s*=\s*["']?utf-8/i.test(code), 'CÓ charset UTF-8', null);

  /* ----------- HỢP ĐỒNG TÍCH HỢP: MC gọi check với INDEX ----------- */
  // submitAnswer phải truyền selectedIndex (số nguyên) cho check() khi là mc.
  R.ok(/QuestionEngine\.check\(\s*currentQ\s*,\s*selectedIndex\s*\)/.test(code),
    'MC: check(currentQ, selectedIndex) — truyền INDEX số nguyên', null);
  // input thì truyền chuỗi value
  R.ok(/QuestionEngine\.check\(\s*currentQ\s*,\s*val\s*\)/.test(code),
    'INPUT: check(currentQ, val) — truyền chuỗi nhập', null);
  // selectedIndex là số nguyên (gán từ idx khi chọn)
  R.ok(/selectChoice\s*\(\s*idx\s*\)/.test(code) || /selectedIndex\s*=\s*idx/.test(code),
    'selectedIndex gán từ idx (số nguyên)', null);

  /* ------- HỢP ĐỒNG RENDER: stem/choices/explain qua innerHTML ------- */
  R.ok(/\$\(['"]stem['"]\)\.innerHTML\s*=\s*q\.stem/.test(code),
    'render stem bằng innerHTML', null);
  R.ok(/\.innerHTML\s*=\s*ch\b/.test(code) || /querySelector\(['"]\.txt['"]\)\.innerHTML\s*=\s*ch/.test(code),
    'render choice text bằng innerHTML', null);
  R.ok(/explain['"]?\)?\.innerHTML|\.explain['"]\)\.innerHTML|innerHTML\s*=\s*['"]<b>Cách làm/.test(code),
    'render explain bằng innerHTML', null);

  /* --------------- KHÔNG dark pattern: có nút Trang chủ -------------- */
  R.ok(/Trang chủ/.test(code), 'có nút "Trang chủ" (luôn thoát được)', null);
  // không đếm ngược tạo áp lực: không có setInterval đếm giảm thời gian làm bài
  R.ok(!/đếm ngược|countdown/i.test(code), 'không có cơ chế đếm ngược tạo áp lực', null);

  /* --------------- localStorage chịu lỗi (try/catch) ---------------- */
  R.ok(/try\s*\{[\s\S]*localStorage[\s\S]*\}\s*catch/.test(code),
    'truy cập localStorage có try/catch (không vỡ app khi hỏng)', null);

  /* --------------- prefers-reduced-motion + nút tắt âm -------------- */
  R.ok(/prefers-reduced-motion/i.test(code), 'tôn trọng prefers-reduced-motion', null);
  R.ok(/soundBtn/.test(code) && /aria-pressed/.test(code), 'có nút bật/tắt âm (aria-pressed)', null);

  return R.state;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const s = run();
  console.log(`[${s.group}] checks=${s.checks} fails=${s.fails.length}`);
  s.fails.forEach(f => console.log('  FAIL:', f.msg));
  process.exit(s.fails.length ? 1 : 0);
}

/*
 * cdp-run.mjs — mở trang bằng Chrome thật (headless), chạy kịch bản kiểm tra
 * trong trang qua giao thức CDP, in bảng kết quả PASS/FAIL.
 *
 * KHÔNG phụ thuộc thư viện ngoài: dùng WebSocket có sẵn của Node 22 và
 * Chrome cài sẵn trên máy. Vì vậy không cần npm install gì cả.
 *
 * Vì sao cần bộ test này: `node --check` chỉ bắt được lỗi CÚ PHÁP. Đã từng có
 * lần cú pháp đúng nhưng trang vẫn chết vì gọi hàm trước khi nó được gán —
 * loại lỗi đó chỉ lộ ra khi mở trang bằng trình duyệt thật.
 *
 * Chạy:
 *   node tests/cdp-run.mjs file:///D:/toanlop3/web_tuvung_anh4/index.html tests/page-test.js
 *   node tests/cdp-run.mjs https://idiot50.github.io/ontoan/tu-vung-anh4/ tests/page-test.js
 */
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
const CHROME = CHROME_CANDIDATES.find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });
if (!CHROME) {
  console.error('Không tìm thấy Chrome hoặc Edge trên máy này.');
  process.exit(2);
}

const URL = process.argv[2];
const TESTFILE = process.argv[3];
if (!URL || !TESTFILE) {
  console.error('Thiếu tham số. Cách dùng: node tests/cdp-run.mjs <url> <tests/page-test.js>');
  process.exit(2);
}
const PORT = 9333;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-profile-'));

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-extensions',
  '--mute-audio',
  '--remote-debugging-port=' + PORT,
  '--user-data-dir=' + profile,
  URL
], { stdio: 'ignore' });

let ws = null;
function cleanup() {
  try { if (ws) ws.close(); } catch (e) {}
  try { chrome.kill(); } catch (e) {}
}
process.on('exit', cleanup);

async function findPage() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch('http://127.0.0.1:' + PORT + '/json/list');
      const list = await res.json();
      const pg = list.find(t => t.type === 'page' && t.webSocketDebuggerUrl
        && t.url !== 'about:blank' && t.url.indexOf('devtools://') !== 0);
      if (pg) return pg;
    } catch (e) { /* Chrome chưa sẵn sàng */ }
    await sleep(400);
  }
  throw new Error('Không kết nối được Chrome sau 24 giây');
}

const pending = new Map();
let nextId = 1;
function send(method, params) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params: params || {} }));
  });
}

async function evaluate(expression, awaitPromise) {
  const r = await send('Runtime.evaluate', {
    expression,
    awaitPromise: !!awaitPromise,
    returnByValue: true,
    userGesture: true
  });
  if (r.exceptionDetails) {
    const e = r.exceptionDetails;
    throw new Error('Lỗi trong trang: ' + (e.exception && (e.exception.description || e.exception.value) || e.text));
  }
  return r.result && r.result.value;
}

(async () => {
  const pg = await findPage();
  ws = new WebSocket(pg.webSocketDebuggerUrl);

  const consoleErrs = [];
  ws.addEventListener('message', ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
      return;
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      const d = msg.params.exceptionDetails;
      consoleErrs.push(d.exception && (d.exception.description || d.exception.value) || d.text);
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrs.push((msg.params.args || []).map(a => a.value).join(' '));
    }
  });
  await new Promise((res, rej) => {
    ws.addEventListener('open', res);
    ws.addEventListener('error', () => rej(new Error('WebSocket lỗi')));
  });

  await send('Runtime.enable');
  await send('Page.enable');

  // Chờ trang nạp xong VÀ script của trang đã chạy tới cuối.
  // Kiểm tra cả biến cuối script (ADVQ) để bắt trường hợp script chết giữa chừng.
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try {
      ready = await evaluate('document.readyState === "complete" && typeof DATA !== "undefined" && typeof ADVQ !== "undefined"');
    } catch (e) { ready = false; }
    if (ready) break;
    await sleep(300);
  }
  if (!ready) throw new Error('Trang không nạp xong hoặc script của trang chết giữa chừng');

  const testSrc = fs.readFileSync(TESTFILE, 'utf8');
  await evaluate(testSrc);
  const log = await evaluate('window.__RUN_TEST__', true);

  let pass = 0, fail = 0;
  console.log('');
  console.log('================ KIỂM TRA TRÊN CHROME THẬT ================');
  console.log('Trang: ' + URL);
  console.log('');
  for (const r of log) {
    if (r.pass) pass++; else fail++;
    console.log((r.pass ? '  PASS  ' : '  FAIL  ') + r.name + (r.extra ? '   [' + r.extra + ']' : ''));
  }
  console.log('');
  console.log('Tổng: ' + pass + ' đạt / ' + fail + ' hỏng');
  if (consoleErrs.length) {
    console.log('');
    console.log('Lỗi console ghi nhận được:');
    consoleErrs.forEach(e => console.log('  - ' + String(e).slice(0, 200)));
  }
  cleanup();
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.error('LỖI CHẠY TEST: ' + e.message);
  cleanup();
  process.exit(2);
});

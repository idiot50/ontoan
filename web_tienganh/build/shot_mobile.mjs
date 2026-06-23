// shot_mobile.mjs — chụp màn với VIEWPORT DI ĐỘNG THẬT qua CDP (Emulation.setDeviceMetricsOverride).
// Dùng: node build/shot_mobile.mjs <url> <out.png> <width> [height]
// Không phụ thuộc npm: tự mở Chrome --remote-debugging-port rồi nói chuyện WebSocket thủ công.
import { spawn } from 'node:child_process';
import http from 'node:http';
import crypto from 'node:crypto';
import net from 'node:net';
import fs from 'node:fs';

const [,, PAGE_URL, OUT, WSTR, HSTR] = process.argv;
const W = parseInt(WSTR || '360', 10);
const H = parseInt(HSTR || '900', 10);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9300 + Math.floor(Math.random() * 400);
const userDir = process.env.TEMP + '/cdpshot_' + PORT;

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--allow-file-access-from-files', '--hide-scrollbars',
  '--remote-debugging-port=' + PORT, '--user-data-dir=' + userDir, 'about:blank'
], { stdio: 'ignore' });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function getJSON(path) {
  return new Promise((res, rej) => {
    http.get({ host: '127.0.0.1', port: PORT, path }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}
async function waitPort() {
  for (let i = 0; i < 60; i++) {
    const ok = await new Promise(r => { const s = net.connect(PORT, '127.0.0.1', () => { s.end(); r(true); }); s.on('error', () => r(false)); });
    if (ok) return; await sleep(150);
  }
  throw new Error('Chrome debug port không mở');
}

// WebSocket tối giản (client) — đủ để gửi/nhận text frame nhỏ + đọc frame nhị phân lớn.
function wsConnect(wsUrl) {
  return new Promise((resolve, reject) => {
    const u = new URL(wsUrl);
    const sock = net.connect(parseInt(u.port, 10), u.hostname, () => {
      const key = crypto.randomBytes(16).toString('base64');
      sock.write(
        `GET ${u.pathname} HTTP/1.1\r\nHost: ${u.host}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\n` +
        `Sec-WebSocket-Key: ${key}\r\nSec-WebSocket-Version: 13\r\n\r\n`);
    });
    let buf = Buffer.alloc(0), handshaken = false;
    const listeners = [];
    function emitMsg(s) { listeners.forEach(fn => fn(s)); }
    sock.on('data', chunk => {
      buf = Buffer.concat([buf, chunk]);
      if (!handshaken) {
        const idx = buf.indexOf('\r\n\r\n');
        if (idx === -1) return;
        handshaken = true; buf = buf.slice(idx + 4);
        resolve({
          send(obj) {
            const data = Buffer.from(JSON.stringify(obj));
            const mask = crypto.randomBytes(4);
            const len = data.length;
            let header;
            if (len < 126) header = Buffer.from([0x81, 0x80 | len]);
            else if (len < 65536) { header = Buffer.alloc(4); header[0] = 0x81; header[1] = 0x80 | 126; header.writeUInt16BE(len, 2); }
            else { header = Buffer.alloc(10); header[0] = 0x81; header[1] = 0x80 | 127; header.writeBigUInt64BE(BigInt(len), 2); }
            const masked = Buffer.alloc(len);
            for (let i = 0; i < len; i++) masked[i] = data[i] ^ mask[i % 4];
            sock.write(Buffer.concat([header, mask, masked]));
          },
          onMessage(fn) { listeners.push(fn); },
          close() { sock.end(); }
        });
      }
      // parse frames
      while (buf.length >= 2) {
        const op = buf[0] & 0x0f;
        let len = buf[1] & 0x7f, off = 2;
        if (len === 126) { if (buf.length < 4) return; len = buf.readUInt16BE(2); off = 4; }
        else if (len === 127) { if (buf.length < 10) return; len = Number(buf.readBigUInt64BE(2)); off = 10; }
        if (buf.length < off + len) return;
        const payload = buf.slice(off, off + len);
        buf = buf.slice(off + len);
        if (op === 0x1) emitMsg(payload.toString('utf8'));
      }
    });
    sock.on('error', reject);
  });
}

(async () => {
  try {
    await waitPort();
    await sleep(300);
    let target;
    for (let i = 0; i < 40; i++) {
      const list = await getJSON('/json/list');
      target = list.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (target) break; await sleep(150);
    }
    const ws = await wsConnect(target.webSocketDebuggerUrl);
    let id = 0; const pending = new Map();
    ws.onMessage(s => {
      const m = JSON.parse(s);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    });
    const cmd = (method, params) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send({ id: i, method, params: params || {} }); });

    await cmd('Page.enable');
    await cmd('Emulation.setDeviceMetricsOverride', {
      width: W, height: H, deviceScaleFactor: 1, mobile: true,
      screenWidth: W, screenHeight: H
    });
    await cmd('Runtime.enable');
    await cmd('Page.navigate', { url: PAGE_URL });
    await sleep(2600);
    // Tắt backstop overflow để PHÁT HIỆN tràn THẬT (nội dung bị clip vẫn vượt vw).
    await cmd('Runtime.evaluate', { expression: "var _s=document.createElement('style');_s.textContent='html,body{overflow-x:visible!important;max-width:none!important}.app__main{overflow-x:visible!important}';document.head.appendChild(_s);" });
    await sleep(200);
    // Báo cáo tràn ngang đo TRONG trang ở đúng W (TRƯỚC khi chụp ảnh lớn để tránh desync khung WS)
    const probeFn = function () {
      var vw = document.documentElement.clientWidth;
      var out = [];
      var all = document.querySelectorAll('*');
      for (var k = 0; k < all.length; k++) {
        var n = all[k];
        var b = n.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        if (b.right > vw + 0.5 || b.left < -0.5) {
          var c = (typeof n.className === 'string') ? n.className : ((n.className && n.className.baseVal) || '');
          out.push((b.right > vw + 0.5 ? 'R' : ' ') + (b.left < -0.5 ? 'L' : ' ') + ' ' + n.tagName.toLowerCase() + '.' + String(c).replace(/ +/g, '.').slice(0, 34) + ' [' + Math.round(b.left) + '..' + Math.round(b.right) + ']');
        }
      }
      return 'vw=' + vw + ' scrollW=' + document.documentElement.scrollWidth + ' OF=' + out.length + '\n' + out.slice(0, 40).join('\n');
    };
    const ev = await cmd('Runtime.evaluate', { returnByValue: true, expression: '(' + probeFn.toString() + ')()' });
    const evr = ev.result || {};
    if (evr.exceptionDetails) console.log('[' + W + 'px] EVAL-ERR', JSON.stringify((evr.exceptionDetails.exception && evr.exceptionDetails.exception.description) || evr.exceptionDetails.text));
    console.log('[' + W + 'px] ' + (evr.result && evr.result.value));

    const r = await cmd('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    fs.writeFileSync(OUT, Buffer.from(r.result.data, 'base64'));
    ws.close();
  } catch (e) {
    console.error('ERR', e && e.message);
  } finally {
    chrome.kill();
    setTimeout(() => process.exit(0), 200);
  }
})();

/*
 * builder.spec.mjs — Test Node cho trình tạo đề (GĐ0). Chạy: node tao_de/tests/builder.spec.mjs
 * Kiểm: build ra đề hợp lệ (20 câu, ma trận cộng đúng 10), MỌI đáp án khớp engine.check,
 * tier ∈ {0,1,2}, không trùng stem; render ra HTML đủ 3 phần; bản copy engine == bản gốc.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const require = createRequire(import.meta.url);

const DeBuilder = require('../de_builder.js');
const DeConfig = require('../de_config.js');
const ENGINES = {
  toan1: require('../engines/toan1.engine.js'),
  toan3: require('../engines/toan3.engine.js')
};

let pass = 0, fail = 0;
function ok(cond, msg, ctx) {
  if (cond) { pass++; } else { fail++; console.log('  FAIL:', msg, ctx != null ? ('| ' + JSON.stringify(ctx).slice(0, 160)) : ''); }
}

// 1) Bản copy engine == bản gốc (chống lệch)
for (const [k, srcRel] of [['toan1', 'web_toan_lop1/engine.js'], ['toan3', 'web_toan_lop3/engine.js']]) {
  const orig = fs.readFileSync(path.join(ROOT, srcRel), 'utf8');
  const copy = fs.readFileSync(path.join(__dirname, '..', 'engines', k + '.engine.js'), 'utf8');
  ok(orig === copy, 'copy engine ' + k + ' khớp bản gốc (chạy lại sync_engines.mjs nếu lệch)');
}

// 2) Build & kiểm cho từng môn/lớp, lặp nhiều lần để bắt ngẫu nhiên
for (const key of ['toan1', 'toan3']) {
  const cfg = DeConfig.CONFIG[key];
  const engine = ENGINES[key];
  for (let iter = 0; iter < 25; iter++) {
    const de = DeBuilder.build(cfg, engine, {});
    ok(de.tongCau === 20, key + ': đề đủ 20 câu', { tongCau: de.tongCau, iter });

    // ma trận cộng đúng
    const sumCau = de.matran.reduce((s, r) => s + r.soCau, 0);
    const sumDiem = Math.round(de.matran.reduce((s, r) => s + r.diem, 0) * 100) / 100;
    ok(sumCau === de.tongCau, key + ': ma trận Σ số câu = tổng câu', { sumCau });
    ok(sumDiem === 10, key + ': ma trận Σ điểm = 10', { sumDiem });

    // không trùng stem trong đề
    const stems = new Set();
    let dup = false;
    de.items.forEach(it => { const s = String(it.stem).replace(/\s+/g, ' ').trim(); if (stems.has(s)) dup = true; stems.add(s); });
    ok(!dup, key + ': không có câu trùng trong đề');

    // mọi câu: tier hợp lệ + đáp án khớp engine.check
    de.items.forEach(it => {
      ok(it.tier === 0 || it.tier === 1 || it.tier === 2, key + ': tier ∈ {0,1,2}', { tier: it.tier });
      ok(it.topic && cfg.mach.some(m => m.topic === it.topic), key + ': topic thuộc cấu hình', { topic: it.topic });
      if (it.type === 'mc') {
        ok(Array.isArray(it.choices) && it.choices.length >= 2, key + ': mc có ≥2 lựa chọn');
        ok(Number.isInteger(it.answer) && it.answer >= 0 && it.answer < it.choices.length, key + ': mc answer index hợp lệ', { a: it.answer });
        ok(engine.check(it, it.answer) === true, key + ': check() nhận đúng đáp án mc', { stem: it.stem });
        for (let i = 0; i < it.choices.length; i++) if (i !== it.answer) ok(engine.check(it, i) === false, key + ': check() bác index sai');
      } else {
        ok(engine.check(it, it.answer) === true, key + ': check() nhận đúng đáp án tự luận', { stem: it.stem, ans: it.answer });
      }
    });
  }

  // 3) render đủ 3 phần
  const de = DeBuilder.build(cfg, engine, {});
  const html = DeBuilder.renderDoc(de);
  ok(html.indexOf('MA TRẬN ĐỀ ÔN TẬP') !== -1, key + ': render có Ma trận');
  ok(html.indexOf('HƯỚNG DẪN CHẤM') !== -1, key + ': render có Hướng dẫn chấm');
  ok(/class="sec"/.test(html) && /class="sec key"/.test(html), key + ': render có 2 ngắt trang (.sec)');
  ok(html.indexOf('<html lang="vi">') !== -1, key + ': render <html lang=vi>');
}

console.log('\n=== KẾT QUẢ builder.spec: ' + pass + ' PASS, ' + fail + ' FAIL ===');
process.exit(fail ? 1 : 0);

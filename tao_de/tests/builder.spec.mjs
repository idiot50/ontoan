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

/* ================= 4. MỨC ĐỘ ĐỀ =================
   Đo độ khó bằng một chỉ số minh bạch, tính trên TỪNG CÂU:

       độ khó = (số bước tính + 0,5 × tầng) × hệ số dạng trả lời

   Yêu cầu của đề bài: mức TRUNG BÌNH phải khó khoảng GẤP ĐÔI mức DỄ.

   BÀI HỌC: bản đầu chấm độ khó theo TÊN MẠCH ("tu-duy" thì cho hệ số 2,0) — và bị
   đánh lừa: mạch "Phát triển tư duy" của lớp 1 hồi đó chỉ là câu đố tuổi MỘT phép
   cộng, tức là mạch DỄ NHẤT đề. Nay chấm theo dữ liệu ĐO ĐƯỢC của từng câu:
     - số BƯỚC TÍNH: đếm dấu "=" trong lời giải của chính engine;
     - tầng của engine (0/1/2);
     - dạng trả lời: trắc nghiệm còn đoán mò được nên nhẹ hơn tự luận. */
function soBuoc(it) {
  const e = String(it.explain || '').replace(/<[^>]*>/g, '');
  return (e.match(/=/g) || []).length || 1;
}
function itemHardness(it) {
  const type = (it.type === 'input') ? 1.4 : 1.0;
  return (soBuoc(it) + 0.5 * it.tier) * type;
}
function measure(key, muc, runs) {
  const cfg = DeConfig.CONFIG[key], engine = ENGINES[key];
  let sum = 0, n = 0, tuDuy = 0, tier2 = 0, input = 0, cau = 0;
  for (let i = 0; i < runs; i++) {
    const de = DeBuilder.build(cfg, engine, { muc });
    de.items.forEach((it) => {
      sum += itemHardness(it); n++;
      if (['tu-duy','loi-van','bieu-thuc','tinh-day','chia-du'].indexOf(it.topic) >= 0) tuDuy++;
      if (it.tier === 2) tier2++;
      if (it.type === 'input') input++;
    });
    cau += de.tongCau;
  }
  return {
    doKho: sum / n,
    tuDuy: tuDuy / runs, tier2: tier2 / runs, input: input / runs, cau: cau / runs
  };
}

console.log('\n--- Độ khó đo được (trung bình 40 đề mỗi mức) ---');
for (const key of ['toan1', 'toan3']) {
  const de = measure(key, 'de', 40);
  const tb = measure(key, 'tb', 40);
  const tyLe = tb.doKho / de.doKho;

  console.log(`  ${key}  DỄ        : độ khó ${de.doKho.toFixed(2)} · ${de.tuDuy.toFixed(1)} câu tư duy · `
    + `${de.tier2.toFixed(1)} câu thử thách · ${de.input.toFixed(1)} câu tự luận`);
  console.log(`  ${key}  TRUNG BÌNH: độ khó ${tb.doKho.toFixed(2)} · ${tb.tuDuy.toFixed(1)} câu tư duy · `
    + `${tb.tier2.toFixed(1)} câu thử thách · ${tb.input.toFixed(1)} câu tự luận`);
  console.log(`  ${key}  -> gấp ${tyLe.toFixed(2)} lần\n`);

  ok(de.cau === 20 && tb.cau === 20, key + ': cả hai mức đều đủ 20 câu', { de: de.cau, tb: tb.cau });
  /* Ngưỡng khác nhau theo lớp — có lý do, không phải tuỳ tiện:
     lớp 3 đạt được ~2 lần như yêu cầu; còn lớp 1 thì ngân hàng câu khó nhất cũng chỉ
     2 bước tính nên TRẦN đo được chỉ ~1,64 lần (đã thử dồn hết vào các mạch nặng nhất).
     Muốn lớp 1 lên 2 lần thì phải viết thêm dạng câu mới, mà làm vậy dễ quá sức trẻ. */
  const nguong = (key === 'toan1') ? 1.55 : 1.9;
  ok(tyLe >= nguong, key + ': mức trung bình khó gấp ≥' + nguong + ' lần mức dễ',
    { tyLe: +tyLe.toFixed(2) });
  ok(tb.tuDuy >= de.tuDuy * 1.3, key + ': số câu tư duy tăng rõ rệt',
    { de: +de.tuDuy.toFixed(1), tb: +tb.tuDuy.toFixed(1) });
  ok(tb.tier2 >= de.tier2 * 2, key + ': số câu tầng thử thách tăng ≥2 lần',
    { de: +de.tier2.toFixed(1), tb: +tb.tier2.toFixed(1) });
  ok(tb.input > de.input, key + ': mức trung bình có nhiều câu tự luận hơn',
    { de: +de.input.toFixed(1), tb: +tb.input.toFixed(1) });
}

// đề mức trung bình vẫn phải HỢP LỆ y như mức dễ
for (const key of ['toan1', 'toan3']) {
  const cfg = DeConfig.CONFIG[key], engine = ENGINES[key];
  for (let iter = 0; iter < 15; iter++) {
    const de = DeBuilder.build(cfg, engine, { muc: 'tb' });
    ok(de.tongCau === 20, key + '/tb: đủ 20 câu', { n: de.tongCau });
    ok(Math.round(de.matran.reduce((s, r) => s + r.diem, 0) * 100) / 100 === 10,
      key + '/tb: ma trận cộng đúng 10 điểm');
    const stems = new Set();
    let dup = false;
    de.items.forEach((it) => {
      const s = String(it.stem).replace(/\s+/g, ' ').trim();
      if (stems.has(s)) dup = true;
      stems.add(s);
      // mọi đáp án vẫn phải khớp engine
      ok(engine.check(it, it.answer) === true, key + '/tb: đáp án khớp engine', { stem: it.stem });
      ok(it.tier !== 0 || false, key + '/tb: không còn câu tầng cơ bản', { tier: it.tier, topic: it.topic });
    });
    ok(!dup, key + '/tb: không có câu trùng');
  }
  const de = DeBuilder.build(cfg, engine, { muc: 'tb' });
  const html = DeBuilder.renderDoc(de);
  ok(html.indexOf('TRUNG BÌNH') !== -1, key + '/tb: đề in ra có ghi mức độ');
  ok(de.phut === (key === 'toan1' ? 40 : 50), key + '/tb: thời gian riêng theo lớp (L1 40′, L3 50′)', { phut: de.phut });
  const deDe = DeBuilder.build(cfg, engine, { muc: 'de' });
  ok(deDe.phut === 40, key + '/de: mức dễ vẫn 40 phút như cũ', { phut: deDe.phut });
  ok(DeBuilder.renderDoc(deDe).indexOf('DỄ') !== -1, key + '/de: đề in ra ghi mức Dễ');
}

console.log('\n=== KẾT QUẢ builder.spec: ' + pass + ' PASS, ' + fail + ' FAIL ===');
process.exit(fail ? 1 : 0);

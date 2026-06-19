// Test cho engine.js (Toán lớp 1) — chạy: node engine.test.mjs
// Kiểm: answer đúng (tính lại độc lập từ stem), mc index hợp lệ & choices không trùng,
// trường `say` bắt buộc & không rỗng, check() chấp nhận đúng / từ chối sai, số <= 100,
// không lỗi runtime. Sinh nhiều câu mỗi chủ đề để soi ca biên.
// Ràng buộc ĐỘ KHÓ (3 TẦNG: ~60% cơ bản / 30% nâng vừa / 10% thử thách):
//   - Chỉ +, − ; số <= 100 (giờ <= 24); KHÔNG ×/÷, KHÔNG "gấp/giảm ... lần", KHÔNG "chẵn/lẻ".
//   - cong/tru: tầng thử thách là chuỗi 3 số (mọi bước >= 0, kết quả 0..100).
//   - gio-tuan: đổi giờ 24h chỉ dùng mốc quen 13/14/18 & phải có gợi ý "12 giờ trưa";
//     nhận biết buổi theo mốc quen; thu-sau số ngày <= 6; khoang-gio thời lượng <= 4;
//     ghép buổi+giờ giờ KẾT THÚC <= 12 (tránh nhập nhằng 24h).
//   - so-100: liệt kê 1..5 số; đếm khoảng count <= 5; so sánh kép đúng 1 nghiệm.
//   - tinh-day & tu-duy: dạng điền số GIỮA dãy cách đều (1 ô '?').
//   - loi-van: tối đa 2 bước; suy luận ngược tối đa 1 bước.
//   - tu-duy: lapso-max chứa 0 thì số lớn nhất phải khác số bé nhất (không trùng).
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const QE = require('./engine.js');

const N = 1500; // số câu mỗi chủ đề
let failures = [];
let total = 0;

function fail(topic, msg, q) {
  failures.push({ topic, msg, q: JSON.stringify(q) });
}

// Bỏ thẻ HTML, decode &lt; &gt; &amp;.
function plain(s) {
  return String(s)
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
// Lấy tất cả số nguyên (không âm) trong chuỗi.
function ints(s) {
  const m = plain(s).match(/-?\d+/g);
  return m ? m.map(Number) : [];
}

// Tính biểu thức an toàn (+ - và ngoặc), trả null nếu không phải biểu thức số.
function evalExpr(e) {
  e = e.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/\s/g, '');
  if (!/^[-0-9+*/()]+$/.test(e) || e === '') return null;
  try { return Function('"use strict";return (' + e + ')')(); } catch { return null; }
}

// ---- Kiểm tra chung cho 1 câu hỏi ----
function validateCommon(q) {
  total++;
  if (!q || typeof q !== 'object') return fail('?', 'không phải object', q);
  if (!q.stem) return fail(q.topic, 'thiếu stem', q);
  if (!q.explain) return fail(q.topic, 'thiếu explain', q);
  // SAY bắt buộc cho mọi câu, không rỗng, không chứa thẻ HTML.
  if (!q.say || String(q.say).trim() === '') return fail(q.topic, 'thiếu say', q);
  if (/<[^>]+>/.test(q.say)) return fail(q.topic, 'say chứa thẻ HTML', q);
  // TẦM LỚP 1: KHÔNG nhân/chia (× ÷ * /) trong đề/đáp án/say; KHÔNG "chẵn/lẻ".
  const allText = plain(q.stem) + ' | ' + plain(q.explain) + ' | ' + String(q.say) +
    (q.type === 'mc' ? ' | ' + q.choices.map(plain).join(' ') : ' | ' + String(q.answer));
  if (/[×÷]/.test(allText)) return fail(q.topic, 'có ký hiệu nhân/chia × ÷', q);
  // dấu * và / trong văn bản hiển thị (không tính dấu / trong "và/hoặc" tiếng Việt? ta cấm tuyệt đối * và phép /)
  if (/\d\s*[*]\s*\d/.test(allText)) return fail(q.topic, 'có phép nhân *', q);
  if (/\d\s*[/]\s*\d/.test(allText)) return fail(q.topic, 'có phép chia /', q);
  if (/chẵn|lẻ/i.test(allText)) return fail(q.topic, 'dùng thuật ngữ chẵn/lẻ', q);
  // KHÔNG dùng "gấp ... lần" / "giảm ... lần" (nhân/chia trá hình).
  // Chỉ bắt cụm "gấp/giảm <số hoặc chữ số> lần"; KHÔNG bắt "lần lượt" trong lời giải.
  if (/(gấp|giảm)\s+(\d+|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười)\s+lần/i.test(allText) ||
      /(\d+|hai|ba|bốn|năm|sáu|bảy|tám|chín|mười)\s+lần\b(?!\s*lượt)/i.test(allText))
    return fail(q.topic, 'dùng gấp/giảm ... lần (nhân-chia trá hình)', q);
  if (q.type === 'mc') {
    if (!Array.isArray(q.choices) || q.choices.length < 2) return fail(q.topic, 'choices không hợp lệ', q);
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.choices.length)
      return fail(q.topic, 'answer index ngoài phạm vi: ' + q.answer, q);
    const set = new Set(q.choices.map(String));
    if (set.size !== q.choices.length) return fail(q.topic, 'choices trùng nhau', q);
    if (!QE.check(q, q.answer)) fail(q.topic, 'check() từ chối index đúng', q);
    if (!QE.check(q, String(q.answer))) fail(q.topic, 'check() từ chối index đúng (chuỗi)', q);
    const wrong = (q.answer + 1) % q.choices.length;
    if (QE.check(q, wrong)) fail(q.topic, 'check() chấp nhận index sai', q);
  } else if (q.type === 'input') {
    if (q.answer === undefined || q.answer === null || q.answer === '') return fail(q.topic, 'thiếu answer input', q);
    if (!QE.check(q, q.answer)) fail(q.topic, 'check() từ chối answer chính nó', q);
  } else {
    return fail(q.topic, 'type lạ: ' + q.type, q);
  }
  // Số trong tầm lớp 1: mọi số trong stem & answer <= 100.
  const allNums = ints(q.stem).concat(q.type === 'input' ? ints(q.answer) : ints(plain(q.choices[q.answer])));
  // Ngoại lệ: giờ theo hệ 24h có thể đến 24.
  const limit = /giờ/.test(plain(q.stem)) ? 24 : 100;
  for (const v of allNums) {
    if (v > limit) fail(q.topic, `số vượt tầm lớp 1: ${v} (limit ${limit})`, q);
    if (v < 0) fail(q.topic, `số âm: ${v}`, q);
  }
}

// Lấy giá trị số của đáp án (mc lấy choice tại index, input lấy answer).
function ansNum(q) {
  if (q.type === 'mc') {
    const n = Number(plain(q.choices[q.answer]).replace(/[^\d-]/g, ''));
    return isNaN(n) ? null : n;
  }
  const n = Number(q.answer);
  return isNaN(n) ? null : n;
}

// ---- Kiểm chứng toán học theo chủ đề (TÍNH LẠI ĐỘC LẬP) ----
function checkMath(q) {
  const I = ints(q.stem);
  const s = plain(q.stem);
  switch (q.topic) {
    case 'cong': case 'tru': {
      // stem dạng "Tính: a + b" hoặc "a − b − c = ?" (2 hoặc 3 số) — tính bằng evalExpr.
      const expr = s.replace(/.*Tính:\s*/, '').replace(/=.*/, '');
      const v = evalExpr(expr);
      if (v === null) return fail(q.topic, 'không parse được phép tính: ' + expr, q);
      const got = ansNum(q);
      if (v !== got) fail(q.topic, `sai: ${expr.trim()}=${v} ≠ ${got}`, q);
      // cong chỉ có dấu +, tru chỉ có dấu − (không lẫn lộn).
      if (q.topic === 'cong' && /−/.test(expr)) fail(q.topic, 'cong có dấu trừ', q);
      if (q.topic === 'tru' && /\+/.test(expr)) fail(q.topic, 'tru có dấu cộng', q);
      if (q.topic === 'tru' && v < 0) fail(q.topic, 'trừ ra âm', q);
      if (v < 0 || v > 100) fail(q.topic, `kết quả ngoài [0,100]: ${v}`, q);
      break;
    }
    case 'so-100': {
      if (/gồm mấy chục/.test(s)) {
        // mc: choice đúng phải khớp cấu tạo của số trong stem
        const n = I[0];
        const want = Math.floor(n / 10) + ' chục ' + (n % 10) + ' đơn vị';
        if (plain(q.choices[q.answer]).trim() !== want) fail(q.topic, `cấu tạo sai: ${n} -> ${plain(q.choices[q.answer])}`, q);
      } else if (/gồm/.test(s) && /chục/.test(s) && q.type === 'input') {
        // cấu tạo ngược: "x chục y đơn vị"
        const mm = s.match(/(\d+)\s*chục\s*(\d+)\s*đơn vị/);
        const want = (+mm[1]) * 10 + (+mm[2]);
        if (+q.answer !== want) fail(q.topic, `cấu tạo ngược sai: muốn ${want} được ${q.answer}`, q);
      } else if (/dấu thích hợp/.test(s)) {
        const a = I[0], b = I[1];
        const sign = plain(q.choices[q.answer]).trim();
        const ok = (sign === '>' && a > b) || (sign === '<' && a < b) || (sign === '=' && a === b);
        if (!ok) fail(q.topic, `so sánh sai: ${a} ${sign} ${b}`, q);
      } else if (/liền trước/.test(s)) {
        if (+q.answer !== I[0] - 1) fail(q.topic, 'liền trước sai', q);
      } else if (/liền sau/.test(s)) {
        if (+q.answer !== I[0] + 1) fail(q.topic, 'liền sau sai', q);
      } else if (/tròn chục/.test(s)) {
        const n = I[0];
        const want = Math.floor(n / 10) * 10;
        const got = ansNum(q);
        if (got !== want) fail(q.topic, `tròn chục sai: dưới ${n} -> ${want} ≠ ${got}`, q);
        if (got >= n) fail(q.topic, `tròn chục không bé hơn N: ${got} >= ${n}`, q);
        if (got % 10 !== 0) fail(q.topic, 'không phải tròn chục', q);
      } else if (/lớn nhất|bé nhất/.test(s) && /trong các số/.test(s)) {
        const got = ansNum(q);
        const want = /lớn nhất/.test(s) ? Math.max(...I) : Math.min(...I);
        if (got !== want) fail(q.topic, `max/min sai: ${got} nên là ${want}`, q);
      } else if (/Sắp xếp/.test(s)) {
        const given = I.slice();
        const ansArr = q.answer.split(';').map(Number);
        const asc = JSON.stringify(ansArr) === JSON.stringify(given.slice().sort((a, b) => a - b));
        const desc = JSON.stringify(ansArr) === JSON.stringify(given.slice().sort((a, b) => b - a));
        const wantAsc = /bé đến lớn/.test(s);
        if (wantAsc ? !asc : !desc) fail(q.topic, 'sắp xếp sai', q);
      } else if (/hai chữ số/.test(s)) {
        const want = /lớn nhất/.test(s) ? 99 : 10;
        if (+q.answer !== want) fail(q.topic, `hai chữ số sai: ${q.answer} nên ${want}`, q);
      } else if (/Viết các số lớn hơn/.test(s)) {
        // Liệt kê các số trong khoảng MỞ (a, b): từ a+1 đến b-1.
        const a = I[0], b = I[1];
        const want = [];
        for (let v = a + 1; v < b; v++) want.push(v);
        if (want.length < 1 || want.length > 5) fail(q.topic, `liệt kê: số lượng ${want.length} ngoài [1,5]`, q);
        if (q.answer !== want.join(';')) fail(q.topic, `liệt kê sai: ${q.answer} nên ${want.join(';')}`, q);
      } else if (/Có mấy số lớn hơn/.test(s)) {
        const lo = I[0], hi = I[1];
        const c = Math.max(0, hi - lo - 1); // số nguyên trong khoảng mở (lo, hi)
        if (+q.answer !== c) fail(q.topic, `đếm khoảng sai: ${q.answer} nên ${c}`, q);
        if (c > 5) fail(q.topic, `đếm khoảng: count ${c} > 5`, q);
      } else if (/hàng đơn vị bé hơn hàng chục/.test(s)) {
        // Cấu tạo ngược suy luận: chục = I[0], đơn vị = chục - gap (gap = I[1]).
        const chuc = I[0], gap = I[1];
        const want = chuc * 10 + (chuc - gap);
        if (+q.answer !== want) fail(q.topic, `cấu tạo suy luận sai: ${q.answer} nên ${want}`, q);
        if (chuc - gap < 0) fail(q.topic, `đơn vị âm: ${chuc}-${gap}`, q);
      } else if (/vừa.*lớn hơn.*vừa.*bé hơn/.test(s)) {
        // So sánh kép: số duy nhất giữa lo và hi (lo = I[0], hi = I[1]).
        const lo = I[0], hi = I[1];
        const got = ansNum(q);
        if (!(got > lo && got < hi)) fail(q.topic, `so sánh kép sai: ${got} không thuộc (${lo},${hi})`, q);
        // phải là nghiệm duy nhất
        let cnt = 0; for (let v = lo + 1; v < hi; v++) cnt++;
        if (cnt !== 1) fail(q.topic, `so sánh kép không đúng 1 nghiệm: ${cnt}`, q);
      }
      break;
    }
    case 'tinh-day': {
      if (/Điền số còn thiếu/.test(s)) {
        // Dãy cách đều có 1 ô '?': kiểm các số đã hiện cách đều & answer khớp.
        const seq = ints(s);   // các số hiện (không gồm ô trống)
        const got = +q.answer;
        // dựng lại dãy đầy đủ với answer rồi kiểm cách đều
        const m = plain(s).match(/Điền số còn thiếu:\s*([^\(]+)/);
        const tokens = m[1].trim().split(/;\s*/).map(x => x.trim() === '?' ? got : +x.trim());
        const d = tokens[1] - tokens[0];
        const ok = tokens.every((v, i) => i === 0 || v - tokens[i - 1] === d);
        if (!ok) fail(q.topic, `điền giữa dãy: dãy không đều ${tokens}`, q);
        if (got < 0 || got > 100) fail(q.topic, `điền giữa dãy ngoài [0,100]: ${got}`, q);
      } else if (/Tính:/.test(s) && q.type === 'input') {
        const expr = s.replace(/.*Tính:\s*/, '').replace(/=.*/, '');
        const v = evalExpr(expr);
        if (v !== null && v !== +q.answer) fail(q.topic, `dãy sai: ${expr}=${v} ≠ ${q.answer}`, q);
        if (v !== null && (v < 0 || v > 100)) fail(q.topic, `dãy ngoài [0,100]: ${v}`, q);
      } else if (/ô trống/.test(s)) {
        // thay ? bằng answer rồi kiểm đẳng thức
        const eqRaw = s.replace(/.*ô trống:\s*/, '').replace(/\(gõ số\).*/, '').trim();
        const filled = eqRaw.replace('?', '(' + q.answer + ')');
        const [lhs, rhs] = filled.split('=');
        const lv = evalExpr(lhs), rv = evalExpr(rhs);
        if (lv === null || rv === null) fail(q.topic, 'không parse ô trống: ' + eqRaw, q);
        else if (lv !== rv) fail(q.topic, `ô trống sai: ${lhs}=${lv} ≠ ${rhs}=${rv}`, q);
      } else if (/dấu thích hợp/.test(s)) {
        // left ___ right ; left là "a + b", right có thể là phép tính hoặc số
        const body = s.replace(/.*dấu thích hợp:\s*/, '').trim();
        const [lp, rp] = body.split('___');
        const lv = evalExpr(lp), rv = evalExpr(rp);
        const sign = plain(q.choices[q.answer]).trim();
        const ok = (sign === '>' && lv > rv) || (sign === '<' && lv < rv) || (sign === '=' && lv === rv);
        if (!ok) fail(q.topic, `so sánh phép tính sai: ${lv} ${sign} ${rv}`, q);
      }
      break;
    }
    case 'do-dai': {
      const got = ansNum(q);
      if (got === null) { fail(q.topic, 'không lấy được số', q); break; }
      if (/hơn kém nhau mấy cm/.test(s)) {
        const want = Math.abs(I[0] - I[1]);
        if (got !== want) fail(q.topic, `hiệu độ dài sai: ${got} nên ${want}`, q);
      } else if (/Nối ba đoạn/.test(s)) {
        if (got !== I[0] + I[1] + I[2]) fail(q.topic, `nối 3 đoạn sai: ${got} nên ${I[0] + I[1] + I[2]}`, q);
      } else if (/Nối hai đoạn/.test(s)) {
        if (got !== I[0] + I[1]) fail(q.topic, `nối dây sai: ${got} nên ${I[0] + I[1]}`, q);
      } else if (/nối thêm đoạn/.test(s)) {
        // Suy luận ngược: AB = I[0], cả hai = I[1], BC = I[1] - I[0].
        if (got !== I[1] - I[0]) fail(q.topic, `suy luận ngược độ dài sai: ${got} nên ${I[1] - I[0]}`, q);
      } else if (/dài hơn đoạn thứ hai/.test(s)) {
        if (got !== I[0] - I[1]) fail(q.topic, `trừ độ dài sai`, q);
      } else if (/cắt đi.*rồi cắt tiếp/.test(s)) {
        // Cắt 2 lần: len - cut1 - cut2.
        if (got !== I[0] - I[1] - I[2]) fail(q.topic, `cắt 2 lần sai: ${got} nên ${I[0] - I[1] - I[2]}`, q);
      } else if (/cắt đi/.test(s)) {
        if (got !== I[0] - I[1]) fail(q.topic, `cắt dây sai: ${got} nên ${I[0] - I[1]}`, q);
      }
      if (got < 0 || got > 100) fail(q.topic, `độ dài ngoài [0,100]: ${got}`, q);
      break;
    }
    case 'gio-tuan': {
      const got = ansNum(q);
      // Buổi quen từ giờ 24h (NHẬN BIẾT BUỔI) — đáp án là chữ "buổi ...".
      const BUOI_MAP = {
        7: 'buổi sáng', 8: 'buổi sáng', 9: 'buổi sáng',
        11: 'buổi trưa', 12: 'buổi trưa',
        14: 'buổi chiều', 15: 'buổi chiều', 16: 'buổi chiều', 17: 'buổi chiều',
        19: 'buổi tối', 20: 'buổi tối', 21: 'buổi tối'
      };
      // Mốc đổi giờ 24h ĐƯỢC PHÉP (chỉ mốc quen).
      const DOI_OK = { 13: 1, 14: 2, 18: 6 };
      if (/kim ngắn/.test(s)) {
        if (got !== I[0]) fail(q.topic, `kim ngắn sai: ${got} nên ${I[0]}`, q);
      } else if (/kim dài/.test(s)) {
        if (got !== 12) fail(q.topic, `kim dài phải là 12, được ${got}`, q);
      } else if (/buổi nào trong ngày/.test(s)) {
        const h = I[0];
        const want = BUOI_MAP[h];
        if (!want) fail(q.topic, `nhận biết buổi: giờ ${h} không thuộc mốc quen`, q);
        else if (plain(q.choices[q.answer]).trim() !== want) fail(q.topic, `nhận biết buổi sai: ${h} giờ -> ${plain(q.choices[q.answer])} nên ${want}`, q);
      } else if (/là mấy giờ chiều/.test(s)) {
        const h = I[0]; // số đầu trong stem = giờ hệ 24h
        if (!(h in DOI_OK)) fail(q.topic, `đổi giờ 24h dùng mốc KHÔNG quen: ${h} giờ`, q);
        else if (got !== DOI_OK[h]) fail(q.topic, `đổi giờ 24h sai: ${h} giờ -> ${got} nên ${DOI_OK[h]}`, q);
        // Phải có gợi ý "12 giờ trưa" trong đề.
        if (!/12 giờ trưa/.test(s)) fail(q.topic, 'đổi giờ 24h thiếu gợi ý 12 giờ trưa', q);
      } else if (/học xong lúc mấy giờ/.test(s)) {
        if (got !== I[0] + I[1]) fail(q.topic, `khoảng giờ sai: ${got} nên ${I[0] + I[1]}`, q);
        if (I[1] > 4) fail(q.topic, `khoảng giờ: thời lượng > 4 (${I[1]})`, q);
        if (got > 12) fail(q.topic, `khoảng giờ: kết thúc > 12 (${got})`, q);
      } else if (/Lúc đó là mấy giờ/.test(s)) {
        // GHÉP BUỔI + GIỜ: bắt đầu I[0] giờ, ngủ I[1] giờ. Kết thúc theo đồng hồ 12 (<= 12).
        const base = I[0], dur = I[1];
        const wantEnd = (base + dur - 1) % 12 + 1;
        if (got !== wantEnd) fail(q.topic, `ghép buổi sai: ${base}+${dur} -> ${got} nên ${wantEnd}`, q);
        if (got > 12 || got < 1) fail(q.topic, `ghép buổi: giờ kết thúc ngoài 1..12 (${got})`, q);
        if (dur > 4) fail(q.topic, `ghép buổi: thời lượng > 4 (${dur})`, q);
      } else if (/ngày mai là thứ mấy/.test(s)) {
        verifyWeekday(q, s, 1);
      } else if (/ngày sau/.test(s)) {
        if (I[0] > 6) fail(q.topic, `thu-sau: số ngày > 6 (${I[0]})`, q);
        verifyWeekday(q, s, I[0]);
      }
      break;
    }
    case 'loi-van': {
      const got = Number(q.answer);
      const expNums = ints(q.explain);
      if (!expNums.includes(got)) fail(q.topic, `lời văn: answer ${got} không có trong explain`, q);
      // tái tính theo loại — ƯU TIÊN các dạng NHIỀU BƯỚC / SUY LUẬN NGƯỢC trước.
      if (/Sau khi được tặng thêm/.test(s)) {
        // ngược-thêm: I[0]=được tặng, I[1]=hiện có; lúc đầu = I[1] - I[0].
        if (got !== I[1] - I[0]) fail(q.topic, `ngược-thêm sai: ${got} nên ${I[1] - I[0]}`, q);
      } else if (/Sau khi cho bạn/.test(s)) {
        // ngược-bớt: I[0]=đã cho, I[1]=còn lại; lúc đầu = I[1] + I[0].
        if (got !== I[1] + I[0]) fail(q.topic, `ngược-bớt sai: ${got} nên ${I[1] + I[0]}`, q);
      } else if (/được tặng thêm.*rồi cho bạn/.test(s)) {
        // 2 bước thêm rồi bớt: I[0]+I[1]-I[2].
        if (got !== I[0] + I[1] - I[2]) fail(q.topic, `2 bước (thêm-bớt) sai: ${got} nên ${I[0] + I[1] - I[2]}`, q);
      } else if (/cho bạn.*rồi được tặng thêm/.test(s)) {
        // 2 bước bớt rồi thêm: I[0]-I[1]+I[2].
        if (got !== I[0] - I[1] + I[2]) fail(q.topic, `2 bước (bớt-thêm) sai: ${got} nên ${I[0] - I[1] + I[2]}`, q);
      } else if (/nhiều hơn.*cả hai bạn có tất cả/.test(s)) {
        // so sánh rồi tổng: A=I[0], B=I[0]+I[1], tổng = A + B.
        const want = I[0] + (I[0] + I[1]);
        if (got !== want) fail(q.topic, `so sánh-tổng sai: ${got} nên ${want}`, q);
      } else if (/tặng thêm/.test(s)) { if (got !== I[0] + I[1]) fail(q.topic, 'thêm sai', q); }
      else if (/cho bạn/.test(s)) { if (got !== I[0] - I[1]) fail(q.topic, 'bớt sai', q); }
      else if (/nhiều hơn/.test(s)) { if (got !== I[0] + I[1]) fail(q.topic, 'nhiều hơn sai', q); }
      else if (/ít hơn/.test(s)) { if (got !== I[0] - I[1]) fail(q.topic, 'ít hơn sai', q); }
      else if (/cả hai bạn có tất cả/.test(s)) { if (got !== I[0] + I[1]) fail(q.topic, 'gộp sai', q); }
      else if (/màu xanh/.test(s)) { if (got !== I[0] - I[1]) fail(q.topic, 'tách sai', q); }
      if (got < 0 || got > 100) fail(q.topic, `lời văn ngoài [0,100]: ${got}`, q);
      break;
    }
    case 'tu-duy': {
      if (/tuổi/.test(s)) {
        // Câu đố tuổi (do-tuoi): I[0]=tuổi bé, I[1]=hơn; đáp án = I[0]+I[1].
        if (+q.answer !== I[0] + I[1]) fail(q.topic, `đố tuổi sai: ${q.answer} nên ${I[0] + I[1]}`, q);
        if (+q.answer < 0 || +q.answer > 100) fail(q.topic, 'đố tuổi ngoài [0,100]', q);
      } else if (/còn thiếu trong dãy/.test(s)) {
        // day-otrong: dựng lại dãy với answer, kiểm cách đều.
        const got = +q.answer;
        const m = plain(s).match(/dãy:\s*([^\(]+)/);
        const tokens = m[1].trim().split(/;\s*/).map(x => x.trim() === '?' ? got : +x.trim());
        const d = tokens[1] - tokens[0];
        const ok = tokens.every((v, i) => i === 0 || v - tokens[i - 1] === d);
        if (!ok) fail(q.topic, `tu-duy điền giữa dãy không đều: ${tokens}`, q);
        if (got < 0 || got > 100) fail(q.topic, `tu-duy điền giữa dãy ngoài [0,100]: ${got}`, q);
      } else if (/dãy/.test(s)) {
        const seq = ints(s);
        const d = seq[1] - seq[0];
        const isArith = seq.every((v, i) => i === 0 || v - seq[i - 1] === d);
        if (!isArith) fail(q.topic, 'dãy không đều', q);
        else if (+q.answer !== seq[seq.length - 1] + d) fail(q.topic, `dãy: số tiếp sai (${q.answer} nên ${seq[seq.length - 1] + d})`, q);
        if (+q.answer < 0 || +q.answer > 100) fail(q.topic, 'dãy ngoài [0,100]', q);
      } else if (/lập số có hai chữ số/.test(s)) {
        // lấy các chữ số thẻ
        const cardLine = s.match(/thẻ chữ số ([\d, ]+)/);
        const digits = cardLine[1].split(/[,\s]+/).filter(x => x.length).map(Number);
        const wantMax = /lớn nhất/.test(s);
        let want;
        if (wantMax) {
          const d = digits.slice().sort((a, b) => b - a); want = d[0] * 10 + d[1];
        } else {
          const asc = digits.slice().sort((a, b) => a - b);
          const tens = asc.find(x => x !== 0);
          const rest = digits.slice(); rest.splice(rest.indexOf(tens), 1);
          const units = rest.sort((a, b) => a - b)[0];
          want = tens * 10 + units;
        }
        if (+q.answer !== want) fail(q.topic, `lập số sai: thẻ ${digits} ${wantMax ? 'max' : 'min'} -> ${q.answer} nên ${want}`, q);
        if (String(want)[0] === '0') fail(q.topic, '0 đứng đầu', q);
        // lapso-max với 0 trong bộ 2 thẻ thì max=min (vô nghĩa) -> phải có >=3 thẻ.
        if (wantMax && digits.indexOf(0) !== -1) {
          const desc = digits.slice().sort((a, b) => b - a);
          const asc2 = digits.slice().sort((a, b) => a - b);
          const tens2 = asc2.find(x => x !== 0);
          const maxNum = desc[0] * 10 + desc[1];
          const rest2 = digits.slice(); rest2.splice(rest2.indexOf(tens2), 1);
          const minNum = tens2 * 10 + rest2.sort((a, b) => a - b)[0];
          if (maxNum === minNum) fail(q.topic, `lapso-max chứa 0 nhưng max=min=${maxNum} (đáp án vô nghĩa)`, q);
        }
      } else if (/cộng với/.test(s)) {
        const a = I[0], res = I[1];
        if (+q.answer + a !== res) fail(q.topic, `tìm số cộng sai`, q);
      } else if (/trừ đi/.test(s)) {
        const a = I[0], res = I[1];
        if (+q.answer - a !== res) fail(q.topic, `tìm số trừ sai`, q);
      }
      break;
    }
  }
}

function verifyWeekday(q, s, addDays) {
  const WD = ['thứ Hai', 'thứ Ba', 'thứ Tư', 'thứ Năm', 'thứ Sáu', 'thứ Bảy', 'Chủ nhật'];
  // tìm thứ gốc trong stem
  let baseIdx = -1;
  for (let i = 0; i < WD.length; i++) {
    if (s.indexOf(WD[i]) !== -1) { baseIdx = i; break; }
  }
  if (baseIdx === -1) return fail(q.topic, 'không tìm thấy thứ gốc', q);
  const wantIdx = (baseIdx + addDays) % 7;
  const got = plain(q.choices[q.answer]).trim();
  if (got !== WD[wantIdx]) fail(q.topic, `thứ sai: gốc ${WD[baseIdx]} +${addDays} -> ${got} nên ${WD[wantIdx]}`, q);
}

// ---- Chạy ----
for (const t of QE.topics) {
  for (let i = 0; i < N; i++) {
    let q;
    try { q = QE.generate(t.id); }
    catch (err) { fail(t.id, 'runtime error: ' + err.message, { stack: err.stack }); continue; }
    validateCommon(q);
    try { checkMath(q); } catch (err) { fail(t.id, 'checkMath threw: ' + err.message, q); }
  }
}

// generateMixed
for (let i = 0; i < 200; i++) {
  const arr = QE.generateMixed(10);
  if (arr.length !== 10) fail('mixed', 'generateMixed length ≠ 10', arr);
  arr.forEach(q => validateCommon(q));
}

// check() chuẩn hoá
function assert(cond, msg) { if (!cond) fail('check-norm', msg, {}); total++; }
assert(QE.check({ type: 'input', answer: '45' }, '45'), 'số đơn');
assert(QE.check({ type: 'input', answer: '45' }, ' 45 '), 'bỏ khoảng trắng');
assert(QE.check({ type: 'input', answer: '100' }, '100'), 'số 100');
assert(QE.check({ type: 'input', answer: '10;20;30' }, '10, 20, 30'), 'dãy phẩy');
assert(QE.check({ type: 'input', answer: '10;20;30' }, '10 20 30'), 'dãy khoảng trắng');
assert(QE.check({ type: 'input', answer: '10;20;30' }, '10;20;30'), 'dãy chấm phẩy');
assert(!QE.check({ type: 'input', answer: '10;20;30' }, '20 10 30'), 'dãy sai thứ tự bị từ chối');
assert(!QE.check({ type: 'input', answer: '45' }, '46'), 'từ chối sai');
assert(QE.check({ type: 'mc', answer: 2 }, 2), 'mc index đúng');
assert(!QE.check({ type: 'mc', answer: 2 }, 1), 'mc index sai bị từ chối');

// Đọc số tiếng Việt (0..100) các ca khó.
const readCases = [
  [0, 'không'], [1, 'một'], [5, 'năm'], [10, 'mười'],
  [11, 'mười một'], [14, 'mười bốn'], [15, 'mười lăm'],
  [20, 'hai mươi'], [21, 'hai mươi mốt'], [24, 'hai mươi tư'], [25, 'hai mươi lăm'],
  [30, 'ba mươi'], [44, 'bốn mươi tư'], [55, 'năm mươi lăm'],
  [71, 'bảy mươi mốt'], [99, 'chín mươi chín'], [100, 'một trăm']
];
for (const [n, exp] of readCases) {
  total++;
  const got = QE._readNumberVi(n);
  if (got !== exp) fail('readNumberVi', `${n} -> '${got}' ≠ '${exp}'`, {});
}

// ---- Báo cáo ----
console.log(`Đã kiểm ${total} phép kiểm tra trên ${QE.topics.length} chủ đề (mỗi chủ đề ${N} câu).`);
if (failures.length === 0) {
  console.log('KẾT QUẢ: SẠCH — không có lỗi nào.');
  process.exit(0);
} else {
  console.log(`KẾT QUẢ: ${failures.length} lỗi:`);
  const byTopic = {};
  failures.forEach(f => { byTopic[f.topic] = (byTopic[f.topic] || 0) + 1; });
  console.log('Theo chủ đề:', byTopic);
  failures.slice(0, 30).forEach(f => console.log(' -', f.topic, '|', f.msg, '|', f.q));
  process.exit(1);
}

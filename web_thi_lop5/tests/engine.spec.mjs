/*
 * engine.spec.mjs — kiểm ĐỘC LẬP engine "Thi Lớp 5".
 *
 * Nguyên tắc: KHÔNG tin đáp án engine đưa ra. Với mỗi câu, test tự đọc lại ĐỀ BÀI
 * (stem), tự giải bằng công thức viết riêng trong file này, rồi đối chiếu với
 * `answer` của engine. Sai đáp án là lỗi nghiêm trọng nhất của phần mềm học toán.
 *
 * Ngoài ra kiểm phần "khung": cấu trúc câu hỏi, chỉ số đáp án trắc nghiệm,
 * định dạng số kiểu Việt (dấu phẩy thập phân), và check() nhận/từ chối đúng.
 */
import { QE, makeReporter, plain, nums, fracs, ansVal, gcd, nearly } from './_harness.mjs';

const N_MOI_CHU_DE = 400;   // số câu sinh cho mỗi chủ đề

/* Bảng đổi đơn vị dùng để kiểm lại câu đo lường (viết ĐỘC LẬP với engine). */
const DOI = {
  'km->m': 1000, 'm->cm': 100, 'm->dm': 10, 'tấn->kg': 1000, 'kg->g': 1000,
  'tạ->kg': 100, 'm²->dm²': 100, 'dm²->cm²': 100, 'km²->ha': 100, 'ha->m²': 10000,
  'cm->m': 1 / 100, 'g->kg': 1 / 1000, 'm->km': 1 / 1000, 'kg->tấn': 1 / 1000,
  'cm²->dm²': 1 / 100, 'm²->ha': 1 / 10000, 'giờ->phút': 60
};

export function run() {
  const R = makeReporter('ENGINE');
  const { state, ok, near, record } = R;

  // Đếm số câu đã được KIỂM LẠI VỀ MẶT TOÁN HỌC (không chỉ kiểm khung).
  const daGiaiLai = {};
  const tongCau = {};

  for (const topic of QE.topics) {
    daGiaiLai[topic.id] = 0;
    tongCau[topic.id] = 0;

    for (let i = 0; i < N_MOI_CHU_DE; i++) {
      // Ép đủ 3 tầng để không bỏ sót dạng khó.
      const q = QE.generate(topic.id, { tier: i % 3 });
      tongCau[topic.id]++;
      if (i === 0) record(`[${topic.id}] ${plain(q.stem).slice(0, 90)} → ${q.answer}`);

      if (!kiemKhung(ok, topic.id, q, i % 3)) continue;
      kiemThucTe(ok, topic.id, q);
      if (kiemToan(ok, near, topic.id, q)) daGiaiLai[topic.id]++;
    }
  }

  // Trộn đề: đủ 10 câu, đúng giao kèo, không lỗi.
  const mix = QE.generateMixed(30);
  ok(Array.isArray(mix) && mix.length === 30, 'generateMixed(30) trả về 30 câu');
  const tapChuDe = new Set(mix.map(q => q.topic));
  ok(tapChuDe.size >= 8, `generateMixed rải đều chủ đề (có ${tapChuDe.size}/10 chủ đề trong 30 câu)`);

  // generate() với chủ đề lạ phải ném lỗi rõ ràng.
  let nemLoi = false;
  try { QE.generate('khong-co-that'); } catch (e) { nemLoi = true; }
  ok(nemLoi, 'generate() với chủ đề không tồn tại phải ném lỗi');

  // Ngưỡng phủ: mỗi chủ đề phải có ít nhất 70% số câu được GIẢI LẠI độc lập.
  for (const topic of QE.topics) {
    const tyLe = daGiaiLai[topic.id] / tongCau[topic.id];
    ok(tyLe >= 0.7,
      `[${topic.id}] chỉ ${(tyLe * 100).toFixed(0)}% số câu được test giải lại độc lập (cần ≥ 70%)`);
  }

  state.coverage = Object.keys(daGiaiLai).map(k =>
    `${k}: ${(daGiaiLai[k] / tongCau[k] * 100).toFixed(0)}%`).join(' · ');

  return state;
}

/* ========================================================================
 *  A. KIỂM KHUNG — cấu trúc câu hỏi, định dạng, check()
 * ====================================================================== */
function kiemKhung(ok, topicId, q, tierEp) {
  const ctx = JSON.stringify(q).slice(0, 300);
  let good = true;

  good = ok(q && (q.type === 'mc' || q.type === 'input'), `[${topicId}] type phải là mc/input`, ctx) && good;
  good = ok(q.topic === topicId, `[${topicId}] topic của câu hỏi phải khớp`, ctx) && good;
  good = ok(typeof q.stem === 'string' && q.stem.length > 10, `[${topicId}] stem phải là chuỗi có nội dung`, ctx) && good;
  good = ok(typeof q.explain === 'string' && q.explain.length > 10, `[${topicId}] explain phải có lời giải`, ctx) && good;
  good = ok(q.tier === tierEp, `[${topicId}] tier phải bằng tầng bị ép (${tierEp}, nhận ${q.tier})`, ctx) && good;

  // Không được lọt chuỗi lỗi lập trình vào nội dung cho trẻ đọc.
  const toanBo = [q.stem, q.explain, String(q.answer)].concat(q.choices || []).join(' | ');
  good = ok(!/undefined|NaN|null|\[object/.test(toanBo),
    `[${topicId}] nội dung chứa chuỗi lỗi (undefined/NaN/null)`, ctx) && good;

  if (q.type === 'mc') {
    good = ok(Array.isArray(q.choices) && q.choices.length >= 3,
      `[${topicId}] mc phải có ≥ 3 phương án`, ctx) && good;
    good = ok(new Set(q.choices).size === q.choices.length,
      `[${topicId}] các phương án mc không được trùng nhau`, ctx) && good;
    good = ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length,
      `[${topicId}] mc answer phải là chỉ số hợp lệ`, ctx) && good;
    good = ok(QE.check(q, q.answer) === true, `[${topicId}] check() phải nhận chỉ số đúng`, ctx) && good;
    for (let j = 0; j < q.choices.length; j++) {
      if (j === q.answer) continue;
      good = ok(QE.check(q, j) === false, `[${topicId}] check() phải từ chối chỉ số sai`, ctx) && good;
    }
    // Chưa chọn gì thì KHÔNG được tính là đúng. Number('')/null/[]/false đều = 0 nên
    // câu có đáp án ở vị trí 0 rất dễ bị chấm đúng oan.
    for (const rong of ['', '   ', null, undefined, [], false]) {
      good = ok(QE.check(q, rong) === false,
        `[${topicId}] check() phải từ chối đáp án rỗng (${JSON.stringify(rong)})`, ctx) && good;
    }
  } else {
    const a = String(q.answer);
    good = ok(a.length > 0, `[${topicId}] input answer không được rỗng`, ctx) && good;
    // Đáp án kiểu Việt: chỉ chữ số, dấu phẩy thập phân, gạch phân số, dấu ; của dãy.
    good = ok(/^-?[\d,/;\s]+$/.test(a),
      `[${topicId}] answer "${a}" phải là số/phân số kiểu Việt (không dùng dấu chấm thập phân)`, ctx) && good;
    good = ok(!/\d\.\d/.test(a), `[${topicId}] answer "${a}" dùng dấu chấm thập phân (phải dùng dấu phẩy)`, ctx) && good;
    good = ok(QE.check(q, q.answer) === true, `[${topicId}] check() phải nhận chính answer`, ctx) && good;
    good = ok(QE.check(q, '') === false, `[${topicId}] check() phải từ chối đáp án rỗng`, ctx) && good;

    // Từ chối một giá trị KHÁC hẳn (answer + 1 về mặt giá trị).
    const v = ansVal(a);
    if (Number.isFinite(v) && a.indexOf(';') < 0) {
      const sai = String(v + 1).replace('.', ',');
      good = ok(QE.check(q, sai) === false, `[${topicId}] check() phải từ chối giá trị sai "${sai}"`, ctx) && good;
      // Chấp nhận cách gõ khác: dấu chấm thay dấu phẩy.
      if (a.indexOf(',') >= 0) {
        good = ok(QE.check(q, a.replace(',', '.')) === true,
          `[${topicId}] check() nên chấp nhận cách gõ dấu chấm "${a.replace(',', '.')}"`, ctx) && good;
      }
    }
  }
  return good;
}

/* ========================================================================
 *  A2. KIỂM "ĐỀ CÓ HỢP LÝ KHÔNG"
 *  Những lỗi mà việc tính lại đáp án KHÔNG bắt được: đáp án đúng nhưng đề vô lý
 *  với thực tế, sai quy ước tiểu học, hoặc bé không thể gõ nổi đáp án.
 *  Mỗi assert dưới đây tương ứng một lỗi ĐÃ TỪNG XẢY RA — giữ lại để chống tái phát.
 * ====================================================================== */
function kiemThucTe(ok, topicId, q) {
  const s = plain(q.stem);
  const ctx = s.slice(0, 200) + '  ⇒ answer=' + q.answer;

  /* 1. Đáp án tự luận không được quá 4 chữ số thập phân — bé không gõ nổi
        "1066,666667" và gõ "1066,67" thì bị chấm sai. */
  if (q.type === 'input') {
    const phanTP = String(q.answer).split(',')[1];
    ok(!phanTP || phanTP.length <= 4,
      `[${topicId}] đáp án "${q.answer}" có ${phanTP ? phanTP.length : 0} chữ số thập phân (tối đa 4)`, ctx);
  }

  /* 2. Tính nhẩm ×/: 10, 100, 1000 — SGK Toán 5 chỉ tới hàng phần nghìn. */
  if (/Tính nhẩm/.test(s)) {
    const phanTP = String(q.answer).split(',')[1];
    ok(!phanTP || phanTP.length <= 3,
      `[${topicId}] tính nhẩm ra ${phanTP ? phanTP.length : 0} chữ số thập phân (tối đa 3)`, ctx);
  }

  /* 3. Quy ước tiểu học: "chiều dài" luôn là cạnh DÀI HƠN. */
  let m;
  if ((m = s.match(/chiều dài ([\d ,]+) (?:cm|m|dm), chiều rộng ([\d ,]+) (?:cm|m|dm)/))) {
    const dai = ansVal(m[1].trim()), rong = ansVal(m[2].trim());
    ok(dai >= rong, `[${topicId}] chiều rộng (${rong}) lớn hơn chiều dài (${dai})`, ctx);
  }
  if ((m = s.match(/diện tích ([\d ,]+) m² và chiều dài ([\d ]+) m/))) {
    const dt = ansVal(m[1].trim()), dai = Number(m[2].replace(/ /g, ''));
    ok(dai >= dt / dai, `[${topicId}] chiều rộng tính ra lớn hơn chiều dài ${dai} m`, ctx);
  }

  /* 4. Dấu "…" phải THAY CHO số hạng bị bỏ, không được lặp lại số hạng đã liệt kê. */
  if (s.indexOf('…') >= 0) {
    const cum = plain(q.stem).match(/\(1 \+ 1\/\d+\)|1\/\(\d+×\d+\)/g) || [];
    ok(new Set(cum).size === cum.length,
      `[${topicId}] đề lặp lại một số hạng ở hai bên dấu "…" — đề tự mâu thuẫn với đáp án`, ctx);
  }

  /* 5. Lời giải nói "có N chữ số ở phần thập phân" phải khớp thừa số HIỂN THỊ trong đề. */
  const e = plain(q.explain);
  if ((m = e.match(/Thừa số ([\d,]+) có (\d+) chữ số ở phần thập phân/))) {
    const thuc = (m[1].split(',')[1] || '').length;
    ok(thuc === Number(m[2]),
      `[${topicId}] lời giải nói ${m[2]} chữ số thập phân nhưng thừa số ${m[1]} chỉ có ${thuc}`, ctx);
  }

  /* 6. Đề "làm tròn" phải thật sự có chữ số ở hàng cần xét (nếu không thì vô nghĩa). */
  if ((m = s.match(/Làm tròn số ([\d,]+) đến (hàng đơn vị|hàng phần mười)/))) {
    const tp = (m[1].split(',')[1] || '');
    ok(m[2] === 'hàng đơn vị' ? tp.length >= 1 : tp.length >= 2,
      `[${topicId}] "Làm tròn ${m[1]} đến ${m[2]}" — số không có chữ số ở hàng cần xét`, ctx);
  }

  /* 7. Tỉ số trong bài Tổng–Tỉ / Hiệu–Tỉ phải TỐI GIẢN ("tỉ số là 4/2" là viết sai). */
  if ((m = s.match(/Tỉ số của số lớn và số bé là (\d+)\/(\d+)/))) {
    ok(gcd(Number(m[1]), Number(m[2])) === 1,
      `[${topicId}] tỉ số ${m[1]}/${m[2]} chưa tối giản`, ctx);
  }

  /* 8. Phân số trong đáp án phải tối giản. */
  if (q.type === 'input' && /^\d+\/\d+$/.test(String(q.answer))) {
    const [tu, mau] = String(q.answer).split('/').map(Number);
    ok(gcd(tu, mau) === 1, `[${topicId}] đáp án phân số ${q.answer} chưa tối giản`, ctx);
  }

  /* 9. Vận tốc phải hợp với phương tiện. */
  if ((m = s.match(/(một người đi bộ|một người đi xe đạp|một chiếc xe máy|một chiếc ô tô|một chiếc ca nô)/))) {
    const gioiHan = {
      'một người đi bộ': [3, 8], 'một người đi xe đạp': [8, 25],
      'một chiếc xe máy': [25, 60], 'một chiếc ô tô': [30, 90], 'một chiếc ca nô': [10, 40]
    }[m[1]];
    const vm = s.match(/vận tốc ([\d,]+) km\/giờ/);
    const v = vm ? ansVal(vm[1]) : (/Tính vận tốc/.test(s) ? ansVal(q.answer) : null);
    if (v !== null && Number.isFinite(v)) {
      ok(v >= gioiHan[0] && v <= gioiHan[1],
        `[${topicId}] ${m[1]} đi ${v} km/giờ — ngoài khoảng hợp lý ${gioiHan[0]}–${gioiHan[1]}`, ctx);
    }
  }

  /* 10. Sĩ số MỘT LỚP phải thật (không có lớp 800 học sinh, cũng không có lớp 5 em). */
  // (chú ý: KHÔNG lấy nums(s)[0] — số đầu tiên trong "Lớp 5A" là chữ 5 của tên lớp)
  let siSo = null;
  if (/Hỏi lớp đó có bao nhiêu học sinh/.test(s)) siSo = ansVal(q.answer);
  else if ((m = s.match(/^Lớp 5[AB] có ([\d ]+) học sinh/))) siSo = Number(m[1].replace(/ /g, ''));
  if (siSo !== null) {
    ok(siSo >= 15 && siSo <= 55, `[${topicId}] sĩ số một lớp = ${siSo} (phải trong khoảng 15–55)`, ctx);
  }

  /* 11. Không dùng ký hiệu π (thuộc THCS) và không để dấu "<" trần trong HTML. */
  ok(q.stem.indexOf('π') < 0 && q.explain.indexOf('π') < 0,
    `[${topicId}] còn dùng ký hiệu π — SGK Toán 5 chỉ nói "lấy số 3,14"`, ctx);
  for (const truong of ['stem', 'explain']) {
    ok(!/<(?!\/?b>|br\s*\/?>)/.test(q[truong]),
      `[${topicId}] ${truong} có dấu "<" trần chưa escape thành &lt; (chỉ được dùng thẻ <b>, <br>)`, ctx);
  }
}

/* ========================================================================
 *  B. KIỂM TOÁN HỌC — tự giải lại từ đề bài
 *  Trả về true nếu test NHẬN DIỆN được dạng và đã giải lại (dù đúng hay sai).
 * ====================================================================== */
export function kiemToan(ok, near, topicId, q) {
  const s = plain(q.stem);
  const ctx = s.slice(0, 220) + '  ⇒ answer=' + q.answer;
  const A = ansVal(q.answer);
  const n = nums(s);
  const f = fracs(s);

  const dungSo = (mong, nhan) => near(nhan, mong, `[${topicId}] đáp án sai`, ctx);

  switch (topicId) {
    /* ---------------------------- 1. SỐ TỰ NHIÊN ---------------------------- */
    case 'so-tu-nhien': {
      let m;
      if ((m = s.match(/Trong số ([\d ]+), chữ số (\d) có giá trị/))) {
        const N = Number(m[1].replace(/ /g, '')), d = Number(m[2]);
        const str = String(N), pos = str.indexOf(String(d));
        dungSo(d * Math.pow(10, str.length - 1 - pos), ansVal(q.choices[q.answer]));
        return true;
      }
      if ((m = s.match(/^Viết số gồm (.+)\. \(gõ số\)$/))) {
        const HANG = { 'chục nghìn': 10000, 'nghìn': 1000, 'trăm': 100, 'chục': 10, 'đơn vị': 1 };
        let tong = 0;
        const re = /(\d+) (chục nghìn|nghìn|trăm|chục|đơn vị)/g;
        let g;
        while ((g = re.exec(m[1])) !== null) tong += Number(g[1]) * HANG[g[2]];
        dungSo(tong, A);
        return true;
      }
      if (/^Điền dấu thích hợp/.test(s)) {
        const dau = q.choices[q.answer].replace('&lt;', '<');
        const mong = n[0] > n[1] ? '>' : (n[0] < n[1] ? '<' : '=');
        ok(dau === mong, `[${topicId}] dấu so sánh sai (mong ${mong}, nhận ${dau})`, ctx);
        return true;
      }
      if ((m = s.match(/Tính nhanh: (\d+) × (\d+) \+ (\d+) × (\d+)/))) {
        dungSo(Number(m[1]) * Number(m[2]) + Number(m[3]) * Number(m[4]), A);
        return true;
      }
      if ((m = s.match(/Tính nhanh: (\d+) × (\d+) − (\d+) × (\d+)/))) {
        dungSo(Number(m[1]) * Number(m[2]) - Number(m[3]) * Number(m[4]), A);
        return true;
      }
      if ((m = s.match(/Tính nhanh: (\d+) × (\d+) × (\d+)/))) {
        dungSo(Number(m[1]) * Number(m[2]) * Number(m[3]), A);
        return true;
      }
      if ((m = s.match(/x × (\d+) ([+−]) (\d+) = (\d+)/))) {
        const a = Number(m[1]), b = Number(m[3]), c = Number(m[4]);
        dungSo(m[2] === '+' ? (c - b) / a : (c + b) / a, A);
        return true;
      }
      if ((m = s.match(/để số ([\d*]+) chia hết cho (\d+)/))) {
        const mau = m[1], chia = Number(m[2]);
        ok(Number.isInteger(A) && A >= 0 && A <= 9, `[${topicId}] chữ số điền phải trong 0..9`, ctx);
        const soDay = Number(mau.replace('*', String(A)));
        ok(soDay % chia === 0, `[${topicId}] thay * = ${A} không chia hết cho ${chia}`, ctx);
        ok(String(soDay).length === mau.length, `[${topicId}] thay * làm mất chữ số đầu`, ctx);
        return true;
      }
      if ((m = s.match(/Có bao nhiêu số có ba chữ số chia hết cho (\d+)/))) {
        const k = Number(m[1]);
        let d = 0;
        for (let x = 100; x <= 999; x++) if (x % k === 0) d++;
        dungSo(d, A);
        return true;
      }
      if ((m = s.match(/nhỏ nhất có bốn chữ số chia hết cho cả ([\d, ]+)\./))) {
        const bo = m[1].split(',').map(x => Number(x.trim()));
        let x = 1000;
        while (!bo.every(b => x % b === 0)) x++;
        dungSo(x, A);
        return true;
      }
      return false;
    }

    /* ------------------------------- 2. PHÂN SỐ ------------------------------ */
    case 'phan-so': {
      let m;
      if (/Rút gọn phân số/.test(s) && f.length >= 1) {
        dungSo(f[0].n / f[0].d, A);
        ok(/^\d+(\/\d+)?$/.test(String(q.answer)), `[${topicId}] đáp án rút gọn phải dạng a/b`, ctx);
        const fa = String(q.answer).split('/');
        if (fa.length === 2) {
          ok(gcd(Number(fa[0]), Number(fa[1])) === 1, `[${topicId}] đáp án chưa tối giản`, ctx);
        }
        return true;
      }
      if ((m = s.match(/Tính: (\d+)\/(\d+) ([+−×:]) (\d+)\/(\d+)/))) {
        const a = Number(m[1]), b = Number(m[2]), c = Number(m[4]), d = Number(m[5]);
        const val = { '+': a / b + c / d, '−': a / b - c / d, '×': (a / b) * (c / d), ':': (a / b) / (c / d) }[m[3]];
        dungSo(val, A);
        const fa = String(q.answer).split('/');
        if (fa.length === 2) ok(gcd(Number(fa[0]), Number(fa[1])) === 1, `[${topicId}] đáp án chưa tối giản`, ctx);
        return true;
      }
      if (/^Điền dấu thích hợp/.test(s) && f.length >= 2) {
        const dau = q.choices[q.answer].replace('&lt;', '<');
        const x = f[0].n / f[0].d, y = f[1].n / f[1].d;
        const mong = x > y ? '>' : (x < y ? '<' : '=');
        ok(dau === mong, `[${topicId}] dấu so sánh phân số sai (mong ${mong}, nhận ${dau})`, ctx);
        return true;
      }
      if (/lấy ra/.test(s) && f.length >= 1) {
        // Tìm phân số của một số: số tổng là số nguyên đầu tiên trong đề.
        const tong = n.find(v => Number.isInteger(v) && v > 2 && v !== f[0].n && v !== f[0].d);
        dungSo(tong * f[0].n / f[0].d, A);
        return true;
      }
      if ((m = s.match(/Viết hỗn số (\d+) (\d+)\/(\d+) thành phân số/))) {
        dungSo(Number(m[1]) + Number(m[2]) / Number(m[3]), A);
        return true;
      }
      if ((m = s.match(/^(\d+)\/(\d+) của một số là ([\d ]+)\./))) {
        const tu = Number(m[1]), mau = Number(m[2]), gt = Number(m[3].replace(/ /g, ''));
        dungSo(gt * mau / tu, A);
        return true;
      }
      if (/Tính nhanh: 1\/\(/.test(s)) {
        // Dãy sai phân. Phải dựng lại TOÀN BỘ dãy từ đề rồi cộng thật, không được
        // chỉ đọc số hạng cuối rồi áp công thức — làm vậy sẽ bỏ lọt đề viết sai
        // (dấu "…" lặp lại số hạng đã liệt kê).
        const cac = [...s.matchAll(/1\/\((\d+)×(\d+)\)/g)].map(g => [Number(g[1]), Number(g[2])]);
        if (cac.length < 2) return false;
        const dau = cac[0], cuoi = cac[cac.length - 1];
        ok(dau[0] === 1 && dau[1] === 2, `[${topicId}] dãy sai phân không bắt đầu từ 1/(1×2)`, ctx);
        ok(cuoi[1] === cuoi[0] + 1, `[${topicId}] số hạng cuối không đúng dạng 1/(n×(n+1))`, ctx);
        // Các số hạng liệt kê phải liên tiếp và số hạng sau dấu "…" phải BỎ QUA ít nhất 1 số hạng.
        const truoc = cac[cac.length - 2];
        ok(cuoi[0] > truoc[0] + 1,
          `[${topicId}] dấu "…" nằm giữa hai số hạng LIỀN NHAU (${truoc[0]} rồi ${cuoi[0]}) — không có gì bị bỏ`, ctx);
        let tong = 0;
        for (let k = 1; k <= cuoi[0]; k++) tong += 1 / (k * (k + 1));
        dungSo(tong, A);
        return true;
      }
      if (/Tính nhanh: \(1 \+ 1\//.test(s)) {
        // Tích (1 + 1/k). Cũng phải dựng lại toàn bộ tích từ đề.
        const cac = [...s.matchAll(/\(1 \+ 1\/(\d+)\)/g)].map(g => Number(g[1]));
        if (cac.length < 2) return false;
        const cuoi = cac[cac.length - 1], truoc = cac[cac.length - 2];
        ok(cac[0] === 2, `[${topicId}] tích không bắt đầu từ (1 + 1/2)`, ctx);
        ok(cuoi > truoc + 1,
          `[${topicId}] dấu "…" nằm giữa hai thừa số LIỀN NHAU (${truoc} rồi ${cuoi}) — không có gì bị bỏ`, ctx);
        let tich = 1;
        for (let k = 2; k <= cuoi; k++) tich *= (k + 1) / k;
        dungSo(tich, A);
        return true;
      }
      return false;
    }

    /* ---------------------------- 3. SỐ THẬP PHÂN --------------------------- */
    case 'so-thap-phan': {
      let m;
      if (/thuộc hàng nào/.test(s)) {
        const g = s.match(/Trong số ([\d]+),(\d+), chữ số (\d) thuộc hàng nào/);
        if (!g) return false;
        const viTri = g[2].indexOf(g[3]);
        const mong = ['phần mười', 'phần trăm', 'phần nghìn'][viTri];
        ok(q.choices[q.answer] === mong,
          `[${topicId}] tên hàng sai (mong ${mong}, nhận ${q.choices[q.answer]})`, ctx);
        return true;
      }
      if (/^Điền dấu thích hợp/.test(s)) {
        const dau = q.choices[q.answer].replace('&lt;', '<');
        const mong = n[0] > n[1] ? '>' : (n[0] < n[1] ? '<' : '=');
        ok(dau === mong, `[${topicId}] dấu so sánh số thập phân sai (mong ${mong}, nhận ${dau})`, ctx);
        return true;
      }
      if ((m = s.match(/(\d+) m (\d+) cm = … m/))) {
        dungSo(Number(m[1]) + Number(m[2]) / 100, A);
        return true;
      }
      if ((m = s.match(/Tính: ([\d ,]+) ([+−×:]) ([\d ,]+) = \?/))) {
        const a = Number(m[1].replace(/ /g, '').replace(',', '.'));
        const b = Number(m[3].replace(/ /g, '').replace(',', '.'));
        const val = { '+': a + b, '−': a - b, '×': a * b, ':': a / b }[m[2]];
        dungSo(val, A);
        return true;
      }
      if ((m = s.match(/Tính nhẩm: ([\d,]+) ([×:]) (\d+) = \?/))) {
        const a = Number(m[1].replace(',', '.')), b = Number(m[3]);
        dungSo(m[2] === '×' ? a * b : a / b, A);
        return true;
      }
      if ((m = s.match(/x × ([\d,]+) \+ ([\d,]+) = ([\d,]+)/))) {
        const k = Number(m[1].replace(',', '.'));
        const b = Number(m[2].replace(',', '.'));
        const c = Number(m[3].replace(',', '.'));
        dungSo((c - b) / k, A);
        return true;
      }
      if ((m = s.match(/Làm tròn số ([\d,]+) đến (hàng đơn vị|hàng phần mười)/))) {
        const v = Number(m[1].replace(',', '.'));
        dungSo(m[2] === 'hàng đơn vị' ? Math.round(v) : Math.round(v * 10) / 10, A);
        return true;
      }
      if (/Tổng của hai số là/.test(s)) {
        dungSo(n[0] - n[1], A);
        return true;
      }
      return false;
    }

    /* -------------------------- 4. ĐẠI LƯỢNG – ĐO LƯỜNG --------------------- */
    case 'do-luong': {
      let m;
      if ((m = s.match(/Đổi đơn vị: ([\d ]+) ([^\s]+) ([\d ]+) ([^\s]+) = … ([^\s]+)/))) {
        const a = Number(m[1].replace(/ /g, '')), lon = m[2];
        const b = Number(m[3].replace(/ /g, '')), be = m[4];
        const ti = DOI[lon + '->' + be];
        if (!ti) return false;
        dungSo(a * ti + b, A);
        return true;
      }
      if ((m = s.match(/Đổi đơn vị: (\d+) giờ (\d+) phút = … phút/))) {
        dungSo(Number(m[1]) * 60 + Number(m[2]), A);
        return true;
      }
      if ((m = s.match(/Đổi đơn vị: ([\d,]+|\d+\/\d+) giờ = … phút/))) {
        const v = m[1].indexOf('/') >= 0
          ? Number(m[1].split('/')[0]) / Number(m[1].split('/')[1])
          : Number(m[1].replace(',', '.'));
        dungSo(v * 60, A);
        return true;
      }
      if ((m = s.match(/số thập phân: ([\d ]+) ([^\s]+) ([\d ]+) ([^\s]+) = … ([^\s]+)/))) {
        const a = Number(m[1].replace(/ /g, '')), lon = m[2];
        const b = Number(m[3].replace(/ /g, '')), be = m[4];
        const ti = DOI[lon + '->' + be];
        if (!ti) return false;
        dungSo(a + b / ti, A);
        return true;
      }
      if ((m = s.match(/sau dưới dạng số thập phân: ([\d ]+) ([^\s]+) = … ([^\s]+)/))) {
        const v = Number(m[1].replace(/ /g, '')), be = m[2], lon = m[3];
        const ti = DOI[be + '->' + lon];
        if (!ti) return false;
        dungSo(v * ti, A);
        return true;
      }
      if (/hộp bánh giống nhau/.test(s)) {
        // n = [soHop, tongCu, soHopMoi]
        const [soHop, tongCu, soHopMoi] = n;
        dungSo(tongCu / soHop * soHopMoi, A);
        return true;
      }
      return false;
    }

    /* --------------------- 5. TỈ SỐ & TỈ SỐ PHẦN TRĂM ----------------------- */
    case 'ti-so-phan-tram': {
      let m;
      // Dạng 1: tìm tỉ số phần trăm của hai số (bối cảnh thay đổi nên bắt theo khung câu).
      if ((m = s.match(/có ([\d ]+) [^,]+, trong đó có ([\d ]+) .*?chiếm bao nhiêu phần trăm/s))) {
        const tong = Number(m[1].replace(/ /g, '')), phan = Number(m[2].replace(/ /g, ''));
        dungSo(phan / tong * 100, A);
        return true;
      }
      // Dạng 2: tìm giá trị phần trăm của một số — mọi bối cảnh đều là (tổng, tỉ lệ %).
      if (/trồng rau là bao nhiêu mét vuông|bán được bao nhiêu ki-lô-gam|bao nhiêu cây bạch đàn/.test(s)) {
        const [tong, pct] = n;
        dungSo(tong * pct / 100, A);
        return true;
      }
      if ((m = s.match(/là ([\d ]+) em, chiếm (\d+)%/))) {
        dungSo(Number(m[1].replace(/ /g, '')) * 100 / Number(m[2]), A);
        return true;
      }
      if ((m = s.match(/giá ([\d ]+) đồng.*?giảm (\d+)%/s))) {
        const goc = Number(m[1].replace(/ /g, '')), giam = Number(m[2]);
        dungSo(goc * (100 - giam) / 100, A);
        return true;
      }
      if ((m = s.match(/với giá ([\d ]+) đồng.*lãi (\d+)%/))) {
        const von = Number(m[1].replace(/ /g, '')), lai = Number(m[2]);
        dungSo(von * (100 + lai) / 100, A);
        return true;
      }
      if ((m = s.match(/([\d ]+) chiếc kẹo gồm \d+ loại.*tỉ lệ với ([\d :]+) \(.*kẹo ([^\s?]+)\?/s))) {
        const tong = Number(m[1].replace(/ /g, ''));
        const ty = m[2].trim().split(':').map(x => Number(x.trim()));
        const tenHoi = m[3];
        const TEN = ['cam', 'táo', 'dừa'];
        const idx = TEN.indexOf(tenHoi);
        if (idx < 0 || idx >= ty.length) return false;
        const tongPhan = ty.reduce((x, y) => x + y, 0);
        dungSo(tong / tongPhan * ty[idx], A);
        return true;
      }
      if ((m = s.match(/giỏi chiếm (\d+)%, học sinh khá chiếm (\d+)%.*còn lại là ([\d ]+) học sinh trung bình/s))) {
        const p1 = Number(m[1]), p2 = Number(m[2]), conLai = Number(m[3].replace(/ /g, ''));
        dungSo(conLai * 100 / (100 - p1 - p2), A);
        return true;
      }
      if ((m = s.match(/(\d+) người đắp xong một đoạn đường trong (\d+) ngày.*?(\d+) người \(làm với sức như nhau\)/s))) {
        dungSo(Number(m[1]) * Number(m[2]) / Number(m[3]), A);
        return true;
      }
      return false;
    }

    /* ------------------------ 6. TOÁN ĐIỂN HÌNH ----------------------------- */
    case 'toan-dien-hinh': {
      let m;
      if ((m = s.match(/Tổng của hai số là ([\d ]+), hiệu của chúng là ([\d ]+)\. Tìm số (lớn|bé)/))) {
        const tong = Number(m[1].replace(/ /g, '')), hieu = Number(m[2].replace(/ /g, ''));
        const be = (tong - hieu) / 2;
        dungSo(m[3] === 'lớn' ? be + hieu : be, A);
        return true;
      }
      if ((m = s.match(/Trung bình cộng của (\d+) số là (\d+)\..*lần lượt là ([\d, ]+)\. Tìm số còn lại/s))) {
        const sl = Number(m[1]), tbc = Number(m[2]);
        const cac = m[3].split(',').map(x => Number(x.trim()));
        dungSo(tbc * sl - cac.reduce((x, y) => x + y, 0), A);
        return true;
      }
      if ((m = s.match(/Tổng của hai số là ([\d ]+)\. Tỉ số của số lớn và số bé là (\d+)\/(\d+)\. Tìm số (lớn|bé)/))) {
        const tong = Number(m[1].replace(/ /g, '')), a = Number(m[2]), b = Number(m[3]);
        const dv = tong / (a + b);
        dungSo(m[4] === 'lớn' ? dv * a : dv * b, A);
        return true;
      }
      if ((m = s.match(/Hiệu của hai số là ([\d ]+)\. Tỉ số của số lớn và số bé là (\d+)\/(\d+)\. Tìm số (lớn|bé)/))) {
        const hieu = Number(m[1].replace(/ /g, '')), a = Number(m[2]), b = Number(m[3]);
        const dv = hieu / (a - b);
        dungSo(m[4] === 'lớn' ? dv * a : dv * b, A);
        return true;
      }
      if (/Cho dãy số:/.test(s) && /số hạng\?|tổng/.test(s)) {
        const g = s.match(/Cho dãy số: ([\d ]+); ([\d ]+); ([\d ]+); … ; ([\d ]+)/);
        if (!g) return false;
        const dau = Number(g[1].replace(/ /g, '')), hai = Number(g[2].replace(/ /g, ''));
        const cuoi = Number(g[4].replace(/ /g, ''));
        const kc = hai - dau;
        const sl = (cuoi - dau) / kc + 1;
        dungSo(/tổng/i.test(s) ? (dau + cuoi) * sl / 2 : sl, A);
        return true;
      }
      if (/trồng tất cả bao nhiêu cây/.test(s)) {
        // Ba kiểu đề: trồng cả hai đầu (số cây = số khoảng + 1), chỉ một đầu, và
        // vòng quanh hồ khép kín (cả hai kiểu sau: số cây = số khoảng).
        const g = s.match(/(?:dài|chu vi) ([\d ]+) m/);
        const k = s.match(/hai cây liền nhau cách nhau (\d+) m/);
        if (!g || !k) return false;
        const soKhoang = Number(g[1].replace(/ /g, '')) / Number(k[1]);
        ok(Number.isInteger(soKhoang), `[${topicId}] số khoảng không nguyên`, ctx);
        dungSo(/cả hai đầu/.test(s) ? soKhoang + 1 : soKhoang, A);
        return true;
      }
      if ((m = s.match(/Vòi thứ nhất chảy một mình thì (\d+) giờ đầy bể.*?(\d+) giờ đầy bể/s))) {
        const a = Number(m[1]), b = Number(m[2]);
        dungSo(a * b / (a + b), A);
        return true;
      }
      if ((m = s.match(/mẹ hơn con (\d+) tuổi\. Sau (\d+) năm nữa.*?gấp (\d+) lần/s))) {
        const hieu = Number(m[1]), nam = Number(m[2]), ti = Number(m[3]);
        dungSo(hieu / (ti - 1) - nam, A);
        return true;
      }
      if ((m = s.match(/đếm được (\d+) cái đầu và ([\d ]+) cái chân.*con (gà|chó)/s))) {
        const dau = Number(m[1]), chan = Number(m[2].replace(/ /g, ''));
        const cho = (chan - dau * 2) / 2;
        dungSo(m[3] === 'chó' ? cho : dau - cho, A);
        return true;
      }
      return false;
    }

    /* ----------------------------- 7. HÌNH PHẲNG ---------------------------- */
    case 'hinh-phang': {
      let m;
      if ((m = s.match(/hình chữ nhật có chiều dài (\d+) cm, chiều rộng (\d+) cm\. Tính (diện tích|chu vi)/))) {
        const d = Number(m[1]), r = Number(m[2]);
        dungSo(m[3] === 'diện tích' ? d * r : (d + r) * 2, A);
        return true;
      }
      if ((m = s.match(/hình vuông có cạnh (\d+) cm\. Tính (diện tích|chu vi)/))) {
        const c = Number(m[1]);
        dungSo(m[2] === 'diện tích' ? c * c : c * 4, A);
        return true;
      }
      if ((m = s.match(/diện tích ([\d ]+) m² và chiều dài (\d+) m/))) {
        dungSo(Number(m[1].replace(/ /g, '')) / Number(m[2]), A);
        return true;
      }
      if ((m = s.match(/tam giác có độ dài đáy (\d+) cm và chiều cao (\d+) cm/))) {
        dungSo(Number(m[1]) * Number(m[2]) / 2, A);
        return true;
      }
      if ((m = s.match(/đáy lớn (\d+) cm, đáy bé (\d+) cm, chiều cao (\d+) cm/))) {
        dungSo((Number(m[1]) + Number(m[2])) * Number(m[3]) / 2, A);
        return true;
      }
      if ((m = s.match(/hai đường chéo dài (\d+) cm và (\d+) cm/))) {
        dungSo(Number(m[1]) * Number(m[2]) / 2, A);
        return true;
      }
      if ((m = s.match(/tam giác có diện tích ([\d,]+) cm² và độ dài đáy (\d+) cm/))) {
        dungSo(Number(m[1].replace(',', '.')) * 2 / Number(m[2]), A);
        return true;
      }
      if ((m = s.match(/hình tròn có bán kính (\d+) cm\. Tính (chu vi|diện tích)/))) {
        const r = Number(m[1]);
        dungSo(m[2] === 'chu vi' ? 2 * r * 3.14 : r * r * 3.14, A);
        return true;
      }
      if ((m = s.match(/hình vuông có cạnh (\d+) cm\. Bên trong/))) {
        const c = Number(m[1]);
        dungSo(c * c - (c / 2) * (c / 2) * 3.14, A);
        return true;
      }
      if ((m = s.match(/tam giác ABC có diện tích (\d+) cm².*BM = 1\/(\d+) BC/s))) {
        dungSo(Number(m[1]) / Number(m[2]), A);
        return true;
      }
      return false;
    }

    /* ------------------------------ 8. HÌNH KHỐI ---------------------------- */
    case 'hinh-khoi': {
      let m;
      if ((m = s.match(/chiều dài (\d+) cm, chiều rộng (\d+) cm, chiều cao (\d+) cm\. Tính diện tích (xung quanh|toàn phần)/))) {
        const a = Number(m[1]), b = Number(m[2]), c = Number(m[3]);
        const sxq = (a + b) * 2 * c;
        dungSo(m[4] === 'xung quanh' ? sxq : sxq + 2 * a * b, A);
        return true;
      }
      if ((m = s.match(/thể tích hình hộp chữ nhật có chiều dài (\d+) cm, chiều rộng (\d+) cm, chiều cao (\d+) cm/))) {
        dungSo(Number(m[1]) * Number(m[2]) * Number(m[3]), A);
        return true;
      }
      if ((m = s.match(/hình lập phương có cạnh (\d+) cm\. Tính (thể tích|diện tích toàn phần)/))) {
        const c = Number(m[1]);
        dungSo(m[2] === 'thể tích' ? c * c * c : 6 * c * c, A);
        return true;
      }
      if ((m = s.match(/thể tích ([\d ]+) cm³, chiều dài (\d+) cm, chiều rộng (\d+) cm/))) {
        dungSo(Number(m[1].replace(/ /g, '')) / (Number(m[2]) * Number(m[3])), A);
        return true;
      }
      if ((m = s.match(/hình lập phương cạnh (\d+) cm được sơn đỏ/))) {
        const k = Number(m[1]);
        let mong;
        if (/sơn 3 mặt/.test(s)) mong = 8;
        else if (/đúng 2 mặt/.test(s)) mong = 12 * (k - 2);
        else if (/đúng 1 mặt/.test(s)) mong = 6 * (k - 2) * (k - 2);
        else mong = (k - 2) ** 3;
        dungSo(mong, A);
        return true;
      }
      if ((m = s.match(/chiều dài (\d+) dm, chiều rộng (\d+) dm, chiều cao (\d+) dm.*?đến (\d+)\/(\d+) bể/s))) {
        const V = Number(m[1]) * Number(m[2]) * Number(m[3]);
        dungSo(V * Number(m[4]) / Number(m[5]), A);
        return true;
      }
      if ((m = s.match(/gấp cạnh.*?lên (\d+) lần.*thể tích/s))) {
        const k = Number(m[1]);
        dungSo(k ** 3, ansVal(String(q.choices[q.answer]).replace(' lần', '')));
        return true;
      }
      return false;
    }

    /* ---------------------------- 9. CHUYỂN ĐỘNG ---------------------------- */
    case 'chuyen-dong': {
      let m;
      if ((m = s.match(/vận tốc ([\d,]+) km\/giờ trong ([\d,]+) giờ\. Tính quãng đường/))) {
        dungSo(Number(m[1].replace(',', '.')) * Number(m[2].replace(',', '.')), A);
        return true;
      }
      if ((m = s.match(/quãng đường ([\d,]+) km trong ([\d,]+) giờ\. Tính vận tốc/))) {
        dungSo(Number(m[1].replace(',', '.')) / Number(m[2].replace(',', '.')), A);
        return true;
      }
      if ((m = s.match(/quãng đường ([\d,]+) km với vận tốc ([\d,]+) km\/giờ\. Tính thời gian/))) {
        dungSo(Number(m[1].replace(',', '.')) / Number(m[2].replace(',', '.')), A);
        return true;
      }
      if ((m = s.match(/khởi hành từ A lúc (\d+) giờ và đến B lúc (\d+) giờ(?: (\d+) phút)?.*?nghỉ (\d+) phút.*?AB dài ([\d ]+) km/s))) {
        const di = Number(m[1]), denG = Number(m[2]), denP = m[3] ? Number(m[3]) : 0;
        const nghi = Number(m[4]), quang = Number(m[5].replace(/ /g, ''));
        const phutChay = (denG * 60 + denP) - di * 60 - nghi;
        dungSo(quang / (phutChay / 60), A);
        return true;
      }
      if ((m = s.match(/với vận tốc (\d+) km\/giờ, rồi từ B quay về A với vận tốc (\d+) km\/giờ/))) {
        const v1 = Number(m[1]), v2 = Number(m[2]);
        dungSo(2 * v1 * v2 / (v1 + v2), A);
        return true;
      }
      if ((m = s.match(/cách nhau ([\d,]+) km.*?từ A với vận tốc (\d+) km\/giờ và một xe đạp đi từ B với vận tốc (\d+) km\/giờ/s))) {
        dungSo(Number(m[1].replace(',', '.')) / (Number(m[2]) + Number(m[3])), A);
        return true;
      }
      if ((m = s.match(/vận tốc (\d+) km\/giờ đuổi theo một xe đạp đi với vận tốc (\d+) km\/giờ.*?cách xe đạp ([\d,]+) km/s))) {
        dungSo(Number(m[3].replace(',', '.')) / (Number(m[1]) - Number(m[2])), A);
        return true;
      }
      return false;
    }

    /* ------------------------------- 10. TƯ DUY ----------------------------- */
    case 'tu-duy': {
      let m;
      if (/viết tiếp vào dãy số sau/.test(s)) {
        const g = s.match(/([\d; ]+); …/);
        if (!g) return false;
        const day = g[1].split(';').map(x => Number(x.trim())).filter(Number.isFinite);
        if (day.length < 4) return false;
        const cuoi = day[day.length - 1];
        const hieu = day.slice(1).map((v, i) => v - day[i]);

        // Ba giả thuyết quy luật, mỗi giả thuyết phải đúng với TOÀN BỘ dãy
        // (kiểm 3 số đầu là chưa đủ: dãy 2;4;8;14;22 có 3 số đầu trông như dãy nhân 2).
        const cong = hieu.every(d => d === hieu[0]);
        const nhan = day[0] !== 0 && day.slice(1).every((v, i) => v === day[i] * (day[1] / day[0]));
        const tang = hieu.every((d, i) => d === hieu[0] * (i + 1));

        let mong;
        if (cong) mong = cuoi + hieu[0];
        else if (nhan) mong = cuoi * (day[1] / day[0]);
        else if (tang) mong = cuoi + hieu[0] * (hieu.length + 1);
        else return false;   // dãy không khớp quy luật nào -> engine sinh sai dạng

        dungSo(mong, A);
        return true;
      }
      if ((m = s.match(/Cho dãy số: (\d+); (\d+); .*?số hạng thứ (\d+) của dãy/s))) {
        const dau = Number(m[1]), kc = Number(m[2]) - Number(m[1]), n2 = Number(m[3]);
        dungSo(dau + (n2 - 1) * kc, A);
        return true;
      }
      if ((m = s.match(/từ 1 đến ([\d ]+) thì cần dùng bao nhiêu chữ số/))) {
        const N2 = Number(m[1].replace(/ /g, ''));
        let tong = 0;
        for (let x = 1; x <= N2; x++) tong += String(x).length;
        dungSo(tong, A);
        return true;
      }
      if ((m = s.match(/Có bao nhiêu số có (\d+) chữ số mà khi đọc/))) {
        const len = Number(m[1]);
        let d = 0;
        const lo = Math.pow(10, len - 1), hi = Math.pow(10, len) - 1;
        for (let x = lo; x <= hi; x++) {
          const t = String(x);
          if (t === t.split('').reverse().join('')) d++;
        }
        dungSo(d, A);
        return true;
      }
      if ((m = s.match(/chữ số tận cùng của tích .*?\(có (\d+) thừa số (\d+)\)/s))) {
        const soThua = Number(m[1]), co = Number(m[2]);
        let last = 1;
        for (let x = 0; x < soThua; x++) last = (last * co) % 10;
        dungSo(last, A);
        return true;
      }
      if ((m = s.match(/Trên bảng viết các số 1; 2; 3; … ; (\d+)/))) {
        const N2 = Number(m[1]);
        dungSo(N2 * (N2 + 1) / 2, A);
        return true;
      }
      if ((m = s.match(/có (\d+) bạn.*bắt tay|có (\d+) vận động viên/s))) {
        const k = Number(m[1] || m[2]);
        dungSo(k * (k - 1) / 2, A);
        return true;
      }
      if ((m = s.match(/để chắc chắn có (\d+) viên bi cùng màu/))) {
        const mMoi = Number(m[1]);
        const soMau = (s.match(/viên bi (đỏ|xanh|vàng|trắng)/g) || []).length;
        dungSo((mMoi - 1) * soMau + 1, A);
        return true;
      }
      return false;
    }
  }
  return false;
}

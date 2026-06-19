/*
 * check.spec.mjs — bảng ca CỐ ĐỊNH cho QuestionEngine.check().
 * Kiểm hành vi chuẩn hoá đáp án: MC theo index, chia có dư các biến thể,
 * số có dấu phân nhóm, dãy số nhiều dấu ngăn cách, đầu vào rác/null không ném lỗi.
 */
import { QE, makeReporter } from './_harness.mjs';

// Tạo câu giả lập đúng shape để gọi check().
function mc(choices, answer) { return { type: 'mc', topic: 't', stem: 's', choices, answer, explain: 'e' }; }
function inp(answer) { return { type: 'input', topic: 't', stem: 's', answer, explain: 'e' }; }

export function run() {
  const R = makeReporter('CHECK');

  /* ----------------------- MC: theo INDEX số nguyên ----------------------- */
  const q1 = mc(['12', '24', '36', '48'], 1);
  R.ok(QE.check(q1, 1) === true, 'mc: index đúng -> true');
  R.ok(QE.check(q1, 0) === false, 'mc: index sai 0 -> false');
  R.ok(QE.check(q1, 2) === false, 'mc: index sai 2 -> false');
  R.ok(QE.check(q1, 3) === false, 'mc: index sai 3 -> false');
  // chuỗi số "1" cũng được coi là index 1 (Number('1')===1) — đây là giao kèo
  R.ok(QE.check(q1, '1') === true, 'mc: "1" (chuỗi) coi như index 1 -> true');
  // KHÔNG so theo nội dung text: chọn nội dung "24" như chuỗi rác không phải index
  R.ok(QE.check(q1, '24') === false, 'mc: nội dung "24" không phải index -> false');
  R.ok(QE.check(q1, 1.5) === false, 'mc: index không nguyên -> false');
  R.ok(QE.check(q1, -1) === false, 'mc: index âm -> false');
  R.ok(QE.check(q1, null) === false, 'mc: null -> false');
  R.ok(QE.check(q1, undefined) === false, 'mc: undefined -> false');
  R.ok(QE.check(q1, 'abc') === false, 'mc: rác -> false');

  /* ----------------------- CHIA CÓ DƯ: biến thể "dư" ---------------------- */
  const q2 = inp('7 dư 2');
  ['7 dư 2', '7 du 2', '7 r 2', '7dư2', '7DƯ2', '  7 dư 2  ', '7 Dư 2'].forEach(v => {
    R.ok(QE.check(q2, v) === true, 'chia dư: chấp nhận "' + v + '"');
  });
  R.ok(QE.check(q2, '7 dư 3') === false, 'chia dư: sai số dư -> false');
  R.ok(QE.check(q2, '8 dư 2') === false, 'chia dư: sai thương -> false');
  R.ok(QE.check(q2, '7') === false, 'chia dư: thiếu phần dư -> false');
  R.ok(QE.check(q2, '72') === false, 'chia dư: gõ liền "72" -> false');

  /* ----------------------- SỐ CÓ DẤU PHÂN NHÓM ---------------------------- */
  const q3 = inp('14003');
  ['14003', '14 003', '14.003', '14,003', '  14003  '].forEach(v => {
    R.ok(QE.check(q3, v) === true, 'số: chấp nhận "' + v + '" = 14003');
  });
  R.ok(QE.check(q3, '14004') === false, 'số: 14004 -> false');
  R.ok(QE.check(q3, '1403') === false, 'số: 1403 -> false');
  R.ok(QE.check(q3, '') === false, 'số: rỗng -> false');

  // số nhỏ và mốc nghìn
  const q3b = inp('1000');
  ['1000', '1 000', '1.000', '1,000'].forEach(v => {
    R.ok(QE.check(q3b, v) === true, 'số: "' + v + '" = 1000');
  });

  /* ----------------------- DÃY SỐ: nhiều dấu ngăn cách -------------------- */
  const q4 = inp('12;34;56');
  ['12;34;56', '12, 34, 56', '12 34 56', '12,34,56', '12; 34; 56', ' 12 ; 34 ; 56 '].forEach(v => {
    R.ok(QE.check(q4, v) === true, 'dãy: chấp nhận "' + v + '"');
  });
  // sai thứ tự -> false
  R.ok(QE.check(q4, '34;12;56') === false, 'dãy: sai thứ tự -> false');
  R.ok(QE.check(q4, '56,34,12') === false, 'dãy: đảo ngược -> false');
  // thiếu phần tử / thừa phần tử
  R.ok(QE.check(q4, '12;34') === false, 'dãy: thiếu phần tử -> false');
  R.ok(QE.check(q4, '12;34;56;78') === false, 'dãy: thừa phần tử -> false');

  // dãy có số nhiều chữ số (đảm bảo không gộp nhầm phân nhóm)
  const q4b = inp('100;200;300;400');
  R.ok(QE.check(q4b, '100; 200; 300; 400') === true, 'dãy lớn: dấu ; + space');
  R.ok(QE.check(q4b, '100,200,300,400') === true, 'dãy lớn: dấu phẩy');

  /* ----------------------- ĐẦU VÀO RÁC / NULL ---------------------------- */
  const q5 = inp('42');
  let noThrow = true;
  try {
    QE.check(q5, null);
    QE.check(q5, undefined);
    QE.check(q5, '');
    QE.check(q5, '   ');
    QE.check(q5, '!@#$%');
    QE.check(q5, {});
    QE.check(q5, []);
    QE.check(q5, 0);
    QE.check(null, '42');
    QE.check(undefined, '42');
  } catch (e) { noThrow = false; }
  R.ok(noThrow, 'check(): đầu vào rác/null không ném lỗi');
  R.ok(QE.check(q5, null) === false, 'input null -> false');
  R.ok(QE.check(q5, '') === false, 'input rỗng -> false');
  R.ok(QE.check(q5, '!@#') === false, 'input rác -> false');
  R.ok(QE.check(null, '42') === false, 'question null -> false');
  R.ok(QE.check(q5, '42') === true, 'input "42" đúng -> true');

  return R.state;
}

import { fileURLToPath } from 'url';
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const s = run();
  console.log(`[${s.group}] checks=${s.checks} fails=${s.fails.length}`);
  s.fails.forEach(f => console.log('  FAIL:', f.msg));
  process.exit(s.fails.length ? 1 : 0);
}

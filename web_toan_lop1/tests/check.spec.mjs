/*
 * check.spec.mjs — bảng ca CỐ ĐỊNH cho QuestionEngine.check() lớp 1.
 * Kiểm hành vi chuẩn hoá đáp án: MC theo index, số có/không dấu phân nhóm,
 * dãy số nhiều dấu ngăn cách (; , khoảng trắng, kể cả không dấu cách),
 * đầu vào rác/null/rỗng -> false, không ném lỗi.
 * (Lớp 1 KHÔNG có chia có dư — không kiểm dạng "thương dư số dư".)
 */
import { QE, makeReporter } from './_harness.mjs';

function mc(choices, answer) { return { type: 'mc', topic: 't', stem: 's', choices, answer, explain: 'e', say: 'x' }; }
function inp(answer) { return { type: 'input', topic: 't', stem: 's', answer, explain: 'e', say: 'x' }; }

export function run() {
  const R = makeReporter('CHECK');

  /* ----------------------- MC: theo INDEX số nguyên ----------------------- */
  const q1 = mc(['12', '24', '36', '48'], 1);
  R.ok(QE.check(q1, 1) === true, 'mc: index đúng -> true');
  R.ok(QE.check(q1, 0) === false, 'mc: index sai 0 -> false');
  R.ok(QE.check(q1, 2) === false, 'mc: index sai 2 -> false');
  R.ok(QE.check(q1, 3) === false, 'mc: index sai 3 -> false');
  // chuỗi số "1" cũng coi là index 1 (Number('1')===1) — giao kèo frontend gửi index.
  R.ok(QE.check(q1, '1') === true, 'mc: "1" (chuỗi) coi như index 1 -> true');
  // KHÔNG so theo nội dung text.
  R.ok(QE.check(q1, '24') === false, 'mc: nội dung "24" không phải index -> false');
  R.ok(QE.check(q1, 1.5) === false, 'mc: index không nguyên -> false');
  R.ok(QE.check(q1, -1) === false, 'mc: index âm -> false');
  R.ok(QE.check(q1, 4) === false, 'mc: index quá lớn -> false');
  R.ok(QE.check(q1, null) === false, 'mc: null -> false');
  R.ok(QE.check(q1, undefined) === false, 'mc: undefined -> false');
  R.ok(QE.check(q1, 'abc') === false, 'mc: rác -> false');

  // MC dấu so sánh (choices là ký hiệu) — vẫn theo index.
  const q1b = mc(['>', '<', '='], 2);
  R.ok(QE.check(q1b, 2) === true, 'mc dấu: index đúng -> true');
  R.ok(QE.check(q1b, 0) === false, 'mc dấu: index sai -> false');
  R.ok(QE.check(q1b, '=') === false, 'mc dấu: nội dung "=" không phải index -> false');

  /* ----------------------- SỐ CÓ/KHÔNG DẤU PHÂN NHÓM ---------------------- */
  // Lớp 1 số <= 100, hiếm khi có phân nhóm; nhưng check() phải chịu được dấu cách/chấm/phẩy.
  const q2 = inp('45');
  ['45', ' 45 ', '45 ', '\t45'].forEach(v => {
    R.ok(QE.check(q2, v) === true, 'số: chấp nhận "' + JSON.stringify(v) + '" = 45');
  });
  R.ok(QE.check(q2, '46') === false, 'số: 46 -> false');
  R.ok(QE.check(q2, '54') === false, 'số: 54 -> false');
  R.ok(QE.check(q2, '') === false, 'số: rỗng -> false');

  const q2b = inp('100');
  ['100', '1 00', '1.00', '1,00', ' 100 '].forEach(v => {
    R.ok(QE.check(q2b, v) === true, 'số: "' + v + '" = 100 (chịu dấu phân nhóm)');
  });
  R.ok(QE.check(q2b, '10') === false, 'số: 10 ≠ 100 -> false');

  const q2c = inp('0');
  R.ok(QE.check(q2c, '0') === true, 'số: 0 -> true');
  R.ok(QE.check(q2c, ' 0 ') === true, 'số: " 0 " -> true');
  R.ok(QE.check(q2c, '1') === false, 'số: 1 ≠ 0 -> false');

  /* ----------------------- DÃY SỐ: nhiều dấu ngăn cách -------------------- */
  const q3 = inp('12;34;56');
  ['12;34;56', '12, 34, 56', '12 34 56', '12,34,56', '12; 34; 56', ' 12 ; 34 ; 56 '].forEach(v => {
    R.ok(QE.check(q3, v) === true, 'dãy: chấp nhận "' + v + '"');
  });
  R.ok(QE.check(q3, '34;12;56') === false, 'dãy: sai thứ tự -> false');
  R.ok(QE.check(q3, '56,34,12') === false, 'dãy: đảo ngược -> false');
  R.ok(QE.check(q3, '12;34') === false, 'dãy: thiếu phần tử -> false');
  R.ok(QE.check(q3, '12;34;56;78') === false, 'dãy: thừa phần tử -> false');

  // dãy giảm dần (lớp 1 có sắp xếp từ lớn đến bé)
  const q3b = inp('90;60;30');
  R.ok(QE.check(q3b, '90 60 30') === true, 'dãy giảm: khoảng trắng');
  R.ok(QE.check(q3b, '90, 60, 30') === true, 'dãy giảm: dấu phẩy');
  R.ok(QE.check(q3b, '30;60;90') === false, 'dãy giảm: sai chiều -> false');

  /* ----------------------- ĐẦU VÀO RÁC / NULL ---------------------------- */
  const q4 = inp('42');
  let noThrow = true;
  try {
    QE.check(q4, null);
    QE.check(q4, undefined);
    QE.check(q4, '');
    QE.check(q4, '   ');
    QE.check(q4, '!@#$%');
    QE.check(q4, {});
    QE.check(q4, []);
    QE.check(q4, 0);
    QE.check(null, '42');
    QE.check(undefined, '42');
  } catch (e) { noThrow = false; }
  R.ok(noThrow, 'check(): đầu vào rác/null không ném lỗi');
  R.ok(QE.check(q4, null) === false, 'input null -> false');
  R.ok(QE.check(q4, '') === false, 'input rỗng -> false');
  R.ok(QE.check(q4, '   ') === false, 'input toàn khoảng trắng -> false');
  R.ok(QE.check(q4, '!@#') === false, 'input rác -> false');
  R.ok(QE.check(null, '42') === false, 'question null -> false');
  R.ok(QE.check(q4, '42') === true, 'input "42" đúng -> true');

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

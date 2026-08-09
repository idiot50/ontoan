/*
 * check.spec.mjs — kiểm riêng hàm chấm bài QuestionEngine.check().
 * Trẻ gõ đáp án theo nhiều kiểu khác nhau; engine phải chấm theo GIÁ TRỊ,
 * đồng thời KHÔNG được dễ dãi tới mức nhận cả đáp án sai.
 */
import { QE, makeReporter } from './_harness.mjs';

export function run() {
  const R = makeReporter('CHECK');
  const { state, ok } = R;

  const q = (answer) => ({ type: 'input', topic: 'test', stem: 'x', answer: String(answer), explain: 'x' });

  /* --------- PHẢI NHẬN (cùng một giá trị, gõ theo kiểu khác nhau) --------- */
  const nhan = [
    ['12', '12'], ['12', ' 12 '], ['1234', '1 234'], ['1234', '1.234'],
    ['12,5', '12,5'], ['12,5', '12.5'], ['12,5', '12,50'], ['0,75', '0.75'],
    ['3/4', '3/4'], ['3/4', '6/8'], ['3/4', '0,75'], ['3/4', '0.75'],
    ['0,75', '3/4'], ['7/2', '3 1/2'], ['48', '48,0'], ['48', '48,00'],
    ['1500000', '1 500 000'], ['2,25', '2,250'], ['90', '90'],
    ['12;34;56', '12; 34; 56'], ['12;34;56', '12,34,56'], ['12;34;56', '12 34 56']
  ];
  for (const [a, u] of nhan) {
    ok(QE.check(q(a), u) === true, `check() phải NHẬN: đáp án "${a}", bé gõ "${u}"`);
  }

  /* ----------------------- PHẢI TỪ CHỐI (giá trị khác) ---------------------- */
  const tuChoi = [
    ['12', '13'], ['12', '1,2'], ['12', '120'], ['12,5', '12,6'], ['12,5', '125'],
    ['3/4', '4/3'], ['3/4', '0,74'], ['3/4', '3'], ['48', '48,1'],
    ['12;34;56', '12;34'], ['12;34;56', '12;34;57'], ['90', '9'],
    ['12', ''], ['12', '   '], ['12', 'abc'], ['3/4', 'ba phần tư']
  ];
  for (const [a, u] of tuChoi) {
    ok(QE.check(q(a), u) === false, `check() phải TỪ CHỐI: đáp án "${a}", bé gõ "${u}"`);
  }

  /* ------------------------------ Trắc nghiệm ----------------------------- */
  const mc = { type: 'mc', topic: 'test', stem: 'x', choices: ['A', 'B', 'C', 'D'], answer: 2, explain: 'x' };
  ok(QE.check(mc, 2) === true, 'check() mc: nhận chỉ số đúng');
  ok(QE.check(mc, '2') === true, 'check() mc: nhận chỉ số đúng dạng chuỗi');
  ok(QE.check(mc, 0) === false, 'check() mc: từ chối chỉ số sai');
  ok(QE.check(mc, -1) === false, 'check() mc: từ chối chỉ số âm');
  ok(QE.check(mc, 'B') === false, 'check() mc: từ chối nhãn chữ');
  ok(QE.check(null, 0) === false, 'check() với câu hỏi rỗng trả về false');

  /* Câu mc có đáp án ở VỊ TRÍ 0 — cạm bẫy ép kiểu: Number('') , Number(null),
     Number([]) và Number(false) đều bằng 0, nếu không chặn thì "chưa trả lời"
     sẽ được chấm là ĐÚNG. */
  const mc0 = { type: 'mc', topic: 'test', stem: 'x', choices: ['A', 'B', 'C'], answer: 0, explain: 'x' };
  ok(QE.check(mc0, 0) === true, 'check() mc: nhận đáp án đúng ở vị trí 0');
  ok(QE.check(mc0, '') === false, 'check() mc: TỪ CHỐI chuỗi rỗng dù đáp án ở vị trí 0');
  ok(QE.check(mc0, '   ') === false, 'check() mc: từ chối chuỗi toàn khoảng trắng');
  ok(QE.check(mc0, null) === false, 'check() mc: từ chối null');
  ok(QE.check(mc0, undefined) === false, 'check() mc: từ chối undefined');
  ok(QE.check(mc0, []) === false, 'check() mc: từ chối mảng rỗng');
  ok(QE.check(mc0, false) === false, 'check() mc: từ chối giá trị false');

  return state;
}

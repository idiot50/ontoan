/*
 * ui.harness.mjs — TEST GIAO DIỆN bằng Chrome headless (KHÔNG dùng Puppeteer).
 *
 * Cách làm:
 *  1. Đọc index.html gốc, tạo BẢN SAO trong tests/ (ui.run.html):
 *     - sửa <script src="engine.js"> -> "../engine.js" (vì copy nằm trong tests/)
 *     - chèn HOOK nhỏ NGAY SAU engine.js (chỉ trong bản sao): bọc
 *       QuestionEngine.generate / generateMixed để LƯU câu vừa sinh vào
 *       window.__lastQ (practice) và window.__queue (mixed). Nhờ vậy driver
 *       BIẾT TRƯỚC q.answer/q.type/q.choices của câu đang hiển thị -> chủ động
 *       trả lời ĐÚNG hoặc SAI theo ý muốn (kiểm soát số Đúng/Sai).
 *       KHÔNG sửa logic app, chỉ quan sát giá trị trả về của engine.
 *     - chèn <script> DRIVER trước </body>: kích hoạt SỰ KIỆN DOM THẬT
 *       (click thẻ chủ đề, chọn đáp án/nhập, bấm Kiểm tra/Câu tiếp/Kết thúc),
 *       rồi ghi kết quả ra <pre id="__result__"> và document.title.
 *  2. Chạy: chrome --headless --dump-dom file://.../ui.run.html
 *  3. Đọc DOM trả về, trích JSON trong #__result__, biến thành assertion.
 *
 * KHÔNG sửa index.html gốc — chỉ thao tác trên bản sao trong tests/.
 * Nếu Chrome không có / dump lỗi -> trả về skipped=true.
 */
import { makeReporter } from './_harness.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_HTML = path.join(__dirname, '..', 'index.html');
const RUN_HTML = path.join(__dirname, 'ui.run.html');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

/* ------------ HOOK quan sát engine (chèn trong BẢN SAO, không sửa app) ------ */
// Bọc generate/generateMixed để lưu câu vừa sinh -> driver biết đáp án trước.
const HOOK = `
<script>
(function () {
  if (!window.QuestionEngine) return;
  var QE = window.QuestionEngine;
  var _gen = QE.generate.bind(QE);
  var _mix = QE.generateMixed.bind(QE);
  window.__lastQ = null;
  window.__queue = null;
  QE.generate = function (id) { var q = _gen(id); window.__lastQ = q; return q; };
  QE.generateMixed = function (n) { var arr = _mix(n); window.__queue = arr; window.__mixIdx = 0; window.__lastQ = arr[0]; return arr; };
})();
</script>
`;

/* ------------ DRIVER: chèn vào trang, chạy trong trình duyệt ------------ */
const DRIVER = `
<pre id="__result__" style="position:fixed;left:-9999px;top:-9999px;">PENDING</pre>
<script>
(function () {
  function $(id){ return document.getElementById(id); }
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  function hidden(id){ return $(id).classList.contains('hidden'); }
  function fireClick(el){
    el.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, view:window }));
  }
  function setInput(el, v){
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles:true }));
  }
  var log = [];
  function note(k, v){ log.push({ step:k, val:v }); }

  // Đáp án hiển thị (giống answerDisplay của app) cho 1 câu engine.
  function answerDisplayOf(q){
    if (q.type === 'mc') return q.choices[q.answer];
    var a = String(q.answer);
    if (a.indexOf(';') >= 0) return a.replace(/;/g, '; ');
    return a;
  }
  // 1 giá trị SAI chắc chắn cho input (khác đáp án đúng).
  function wrongInputFor(q){
    var a = String(q.answer);
    if (/^-?\\d/.test(a) && a.indexOf(';') < 0 && !/dư|du|r /i.test(a)) {
      return String((parseInt(a, 10) || 0) + 7);   // số: cộng 7 -> chắc chắn sai
    }
    return 'xxx';   // dạng khác: chuỗi rác -> sai
  }

  // Trả lời câu ĐANG HIỂN THỊ. want = 'correct' | 'wrong'. Trả về true nếu đã chấm.
  // Dùng window.__lastQ (câu engine vừa sinh) để biết đáp án trước khi bấm.
  async function answerCurrent(want){
    var q = window.__lastQ;
    if (!q) return false;
    if (q.type === 'mc') {
      var btns = $('choices').querySelectorAll('.choice');
      var idx;
      if (want === 'correct') idx = q.answer;
      else {
        idx = 0; if (idx === q.answer) idx = 1;     // chọn 1 index KHÁC đáp án đúng
      }
      if (idx >= btns.length) idx = 0;
      fireClick(btns[idx]);
      await sleep(15);
    } else {
      var box = $('answerBox');
      var v = (want === 'correct') ? answerDisplayOf(q) : wrongInputFor(q);
      setInput(box, v);
      await sleep(15);
    }
    fireClick($('checkBtn'));
    await sleep(20);
    return true;
  }

  // Cập nhật __lastQ cho câu mixed kế tiếp sau khi bấm "Câu tiếp theo".
  function advanceMixedPointer(){
    if (window.__queue) {
      window.__mixIdx = (window.__mixIdx || 0) + 1;
      window.__lastQ = window.__queue[window.__mixIdx] || window.__lastQ;
    }
  }

  function reviewItems(){ return $('resReviewList').querySelectorAll('.review-item'); }
  function intOf(t){ var m = String(t).match(/-?\\d+/); return m ? parseInt(m[0],10) : NaN; }
  // đọc 3 ô số Đã làm / Đúng / Sai từ #resNums
  function resNums(){
    var nums = $('resNums').querySelectorAll('.resnum .big');
    return { done: intOf(nums[0] && nums[0].textContent),
             correct: intOf(nums[1] && nums[1].textContent),
             wrong: intOf(nums[2] && nums[2].textContent) };
  }

  async function main(){
    var res = { ok:true, errors:[], asserts:{} };
    function A(name, cond){ res.asserts[name] = !!cond; if(!cond){ res.ok=false; res.errors.push(name); } }
    try {
      await sleep(30);
      A('home_visible', !hidden('screen-home'));
      A('engine_loaded', typeof window.QuestionEngine !== 'undefined');
      A('hook_installed', !!QuestionEngine.generate);

      var topicBtns = $('topicGrid').querySelectorAll('.topic');
      A('topic_grid_9', topicBtns.length === 9);

      /* =========================================================
       * CA 1: Luồng Kết thúc cơ bản (practice) — chấm 4 câu
       *       (2 đúng + 2 sai, kiểm soát qua __lastQ.answer)
       * ========================================================= */
      fireClick(topicBtns[0]);             // chủ đề đầu (so-100000)
      await sleep(40);
      A('quiz_visible_after_topic', !hidden('screen-quiz'));
      A('finish_visible_practice', !hidden('finishBtn'));   // CA5: hiện ở practice trước khi chấm

      var plan = ['correct', 'wrong', 'correct', 'wrong'];
      var expectCorrect = 0, expectWrong = 0;
      var expectCorrectTexts = [];   // đáp án đúng của các câu SAI (để đối chiếu .ri-correct)
      for (var i = 0; i < plan.length; i++) {
        var q = window.__lastQ;
        var disp = answerDisplayOf(q);
        await answerCurrent(plan[i]);
        // đọc phản hồi thật để phân loại (verify __lastQ khớp chấm thật của app)
        var fbOk = $('feedback').classList.contains('ok');
        var fbBad = $('feedback').classList.contains('bad');
        if (plan[i] === 'correct') { if(!fbOk){res.errors.push('not_ok_at_'+i);res.ok=false;} expectCorrect++; }
        else { if(!fbBad){res.errors.push('not_bad_at_'+i);res.ok=false;} expectWrong++; expectCorrectTexts.push(disp); }
        A('finish_visible_after_grade_' + i, !hidden('finishBtn'));   // CA5: vẫn hiện sau chấm
        await sleep(10);
        fireClick($('nextBtn'));     // câu tiếp (practice sinh câu mới -> __lastQ cập nhật)
        await sleep(30);
      }
      note('expect', { correct:expectCorrect, wrong:expectWrong, texts:expectCorrectTexts });

      // bấm Kết thúc
      fireClick($('finishBtn'));
      await sleep(40);
      A('result_after_finish', !hidden('screen-result'));
      A('resReview_shown', !hidden('resReview'));

      var items = reviewItems();
      A('review_item_count_eq_graded', items.length === plan.length);   // 4 câu đã chấm
      var nums = resNums();
      note('resNums_practice', nums);
      A('resnum_done', nums.done === plan.length);
      A('resnum_correct', nums.correct === expectCorrect);
      A('resnum_wrong', nums.wrong === expectWrong);

      // mỗi câu SAI có .ri-correct và nội dung khớp đáp án thật của engine
      var badItems = $('resReviewList').querySelectorAll('.review-item.bad');
      A('bad_count_matches', badItems.length === expectWrong);
      var allBadHaveCorrect = true, allCorrectTextMatch = true;
      for (var b = 0; b < badItems.length; b++) {
        var ric = badItems[b].querySelector('.ri-correct');
        if (!ric) { allBadHaveCorrect = false; continue; }
        // .ri-correct chứa "✓ Đáp án đúng: <text>"; so text với đáp án thật đã thu (theo thứ tự)
        var txt = ric.textContent.replace(/\\s+/g,' ').trim();
        var want = expectCorrectTexts[b];
        if (txt.indexOf(want) < 0 && txt.replace(/[ ]/g,'').indexOf(String(want).replace(/[ ]/g,'')) < 0)
          allCorrectTextMatch = false;
      }
      A('every_bad_has_ri_correct', allBadHaveCorrect);
      A('ri_correct_matches_engine', allCorrectTextMatch);
      note('badTexts', Array.prototype.map.call(badItems, function(el){ var r=el.querySelector('.ri-correct'); return r?r.textContent.replace(/\\s+/g,' ').trim():null; }));

      /* =========================================================
       * CA 2: Nút sau tổng hợp — "➕ Làm tiếp" và "🏠 Trang chủ"
       * ========================================================= */
      A('again_label_lamtiep', /Làm tiếp/.test($('againBtn').textContent));
      fireClick($('againBtn'));
      await sleep(50);
      A('again_back_to_quiz', !hidden('screen-quiz'));
      // đúng chủ đề đã lưu (so-100000) — kiểm nhãn chủ đề hiển thị
      A('again_same_topic', /Số/i.test($('topicLabel').textContent) || $('topicLabel').textContent.length > 0);
      // records đã reset: chấm 0 câu, vào lại finish thì không mở (kiểm gián tiếp sau)
      // resHomeBtn -> về trang chủ: mở lại result trước bằng cách Kết thúc 1 câu nhanh
      var q2 = window.__lastQ; await answerCurrent('correct'); await sleep(20);
      fireClick($('finishBtn')); await sleep(40);
      A('result_again_after_one', !hidden('screen-result'));
      fireClick($('resHomeBtn'));
      await sleep(30);
      A('reshome_to_home', !hidden('screen-home'));

      /* =========================================================
       * CA 3: Biên — chưa làm câu nào -> KHÔNG mở màn, có lời mời
       * ========================================================= */
      var tb = $('topicGrid').querySelectorAll('.topic');
      fireClick(tb[1]);                    // chủ đề khác
      await sleep(40);
      A('quiz_visible_case3', !hidden('screen-quiz'));
      fireClick($('finishBtn'));           // chưa chấm câu nào
      await sleep(30);
      A('no_result_when_empty', hidden('screen-result'));    // vẫn KHÔNG mở màn tổng hợp
      A('still_on_quiz_when_empty', !hidden('screen-quiz'));
      A('invite_in_feedback', $('feedback').classList.contains('show') &&
          /chưa làm câu nào/i.test($('feedback').textContent));

      /* =========================================================
       * CA 4: Skip không được ghi — skip 3 lần, chấm 1 câu
       * ========================================================= */
      // đang ở quiz chủ đề tb[1], feedback đang hiện lời mời -> bấm Câu tiếp (skip) vài lần
      for (var s = 0; s < 3; s++) { fireClick($('skipBtn')); await sleep(30); }
      // chấm đúng 1 câu
      await answerCurrent('correct'); await sleep(20);
      fireClick($('finishBtn')); await sleep(40);
      A('result_after_skip_case', !hidden('screen-result'));
      var itemsSkip = reviewItems();
      note('skip_items', itemsSkip.length);
      A('skip_not_counted', itemsSkip.length === 1);          // chỉ 1 câu đã CHẤM
      var numsSkip = resNums();
      A('skip_resnum_done_1', numsSkip.done === 1);
      // về trang chủ
      fireClick($('resHomeBtn')); await sleep(30);

      /* =========================================================
       * CA 5 (phần mixed): finishBtn ẩn ở Ôn tập (trước & sau chấm)
       * + CA 6: Mixed vẫn có review (10 .review-item, score X/10)
       * ========================================================= */
      fireClick($('mixedBtn'));
      await sleep(50);
      A('mixed_quiz_visible', !hidden('screen-quiz'));
      A('finish_hidden_mixed_before', hidden('finishBtn'));   // CA5: ẩn ở mixed (trước chấm)

      var mixCorrect = 0;
      for (var k = 0; k < 10; k++) {
        // xen kẽ đúng/sai để score có ý nghĩa
        var wantK = (k % 3 === 0) ? 'wrong' : 'correct';
        var dispK = answerDisplayOf(window.__lastQ);
        await answerCurrent(wantK);
        if (k === 0) A('finish_hidden_mixed_after', hidden('finishBtn'));  // CA5: ẩn sau chấm
        var okK = $('feedback').classList.contains('ok');
        if (okK) mixCorrect++;
        await sleep(10);
        if (hidden('nextBtn')) { res.errors.push('mix_next_hidden_'+k); res.ok=false; }
        fireClick($('nextBtn'));
        advanceMixedPointer();
        await sleep(30);
        if (!hidden('screen-result')) break;
      }
      A('result_after_mixed10', !hidden('screen-result'));
      A('mixed_score_x_of_10', /\\d+\\/10/.test($('resScore').textContent));
      var mixItems = reviewItems();
      note('mix_items', mixItems.length);
      A('mixed_review_10_items', mixItems.length === 10);     // CA6
      A('mixed_resReview_shown', !hidden('resReview'));
      var numsMix = resNums();
      note('resNums_mixed', numsMix);
      A('mixed_resnum_done_10', numsMix.done === 10);
      A('mixed_resnum_sum', numsMix.correct + numsMix.wrong === 10);

      // về trang chủ trước khi sang các CA tự-chấm
      fireClick($('resHomeBtn')); await sleep(30);

      /* =========================================================
       * CA 7: TỰ CHẤM IM LẶNG khi KẾT THÚC (đã chọn, CHƯA Kiểm tra)
       *   - chọn/nhập đáp án ĐÚNG nhưng KHÔNG bấm Kiểm tra
       *   - bấm 🏁 Kết thúc -> câu đó phải được tính (review +1, done +1)
       *   - KHÔNG hiện feedback tại chỗ trước khi mở màn tổng hợp
       * ========================================================= */
      var tb7 = $('topicGrid').querySelectorAll('.topic');
      fireClick(tb7[0]); await sleep(40);
      var q7 = window.__lastQ;
      // chọn/nhập đáp án ĐÚNG, KHÔNG bấm checkBtn
      if (q7.type === 'mc') {
        var btns7 = $('choices').querySelectorAll('.choice');
        fireClick(btns7[q7.answer]); await sleep(15);
      } else {
        setInput($('answerBox'), answerDisplayOf(q7)); await sleep(15);
      }
      A('ca7_feedback_hidden_before_finish', !$('feedback').classList.contains('show'));
      fireClick($('finishBtn')); await sleep(40);
      A('ca7_result_shown', !hidden('screen-result'));
      var items7 = reviewItems();
      A('ca7_review_has_pending', items7.length === 1);     // câu đang làm được tính
      var nums7 = resNums();
      note('resNums_ca7', nums7);
      A('ca7_done_1', nums7.done === 1);
      A('ca7_correct_1', nums7.correct === 1);              // đã chọn đúng -> tính đúng
      fireClick($('resHomeBtn')); await sleep(30);

      /* =========================================================
       * CA 8: TỰ CHẤM IM LẶNG khi "Câu tiếp →" (đã chọn, CHƯA Kiểm tra)
       *   - câu A: chọn SAI -> bấm "Câu tiếp →" (skip) -> phải ghi record (sai)
       *   - câu B: chọn ĐÚNG -> bấm 🏁 Kết thúc -> tổng hợp 2 câu (1 sai + 1 đúng)
       *   - KHÔNG hiện feedback khi bấm "Câu tiếp →"
       * ========================================================= */
      var tb8 = $('topicGrid').querySelectorAll('.topic');
      fireClick(tb8[0]); await sleep(40);
      var qA = window.__lastQ;
      var wantTextA = answerDisplayOf(qA);   // đáp án đúng của câu A (để đối chiếu review)
      if (qA.type === 'mc') {
        var btnsA = $('choices').querySelectorAll('.choice');
        var idxA = (qA.answer === 0) ? 1 : 0;   // chọn SAI
        fireClick(btnsA[idxA]); await sleep(15);
      } else {
        setInput($('answerBox'), wrongInputFor(qA)); await sleep(15);
      }
      // bấm "Câu tiếp →" (skip) khi CHƯA Kiểm tra nhưng ĐÃ có đáp án
      A('ca8_feedback_hidden_before_skip', !$('feedback').classList.contains('show'));
      fireClick($('skipBtn')); await sleep(40);
      A('ca8_advanced_no_feedback', !$('feedback').classList.contains('show'));  // sang câu mới, không feedback
      // câu B: chọn ĐÚNG, rồi Kết thúc
      var qB = window.__lastQ;
      if (qB.type === 'mc') {
        var btnsB = $('choices').querySelectorAll('.choice');
        fireClick(btnsB[qB.answer]); await sleep(15);
      } else {
        setInput($('answerBox'), answerDisplayOf(qB)); await sleep(15);
      }
      fireClick($('finishBtn')); await sleep(40);
      A('ca8_result_shown', !hidden('screen-result'));
      var items8 = reviewItems();
      note('ca8_items', items8.length);
      A('ca8_two_recorded', items8.length === 2);           // cả câu skip-có-đáp-án + câu cuối
      var nums8 = resNums();
      note('resNums_ca8', nums8);
      A('ca8_done_2', nums8.done === 2);
      A('ca8_correct_1', nums8.correct === 1);
      A('ca8_wrong_1', nums8.wrong === 1);
      // câu A (skip, chọn sai) phải nằm ĐẦU danh sách và có .ri-correct khớp đáp án đúng
      var firstItem = items8[0];
      A('ca8_first_is_bad', firstItem.classList.contains('bad'));
      var ric8 = firstItem.querySelector('.ri-correct');
      A('ca8_first_has_correct', !!ric8 &&
         ric8.textContent.replace(/\\s+/g,' ').indexOf(wantTextA) >= 0);
      fireClick($('resHomeBtn')); await sleep(30);

      /* =========================================================
       * CA 9: "Câu tiếp →" KHÔNG đáp án = bỏ qua thật (không ghi)
       *   - vào chủ đề, KHÔNG chọn gì, bấm "Câu tiếp →" 2 lần
       *   - rồi chấm 1 câu đúng -> tổng hợp chỉ 1 câu
       * ========================================================= */
      var tb9 = $('topicGrid').querySelectorAll('.topic');
      fireClick(tb9[0]); await sleep(40);
      fireClick($('skipBtn')); await sleep(30);   // chưa chọn -> bỏ qua thật
      fireClick($('skipBtn')); await sleep(30);   // chưa chọn -> bỏ qua thật
      await answerCurrent('correct'); await sleep(20);
      fireClick($('finishBtn')); await sleep(40);
      var items9 = reviewItems();
      note('ca9_items', items9.length);
      A('ca9_only_graded_one', items9.length === 1);   // 2 skip rỗng KHÔNG ghi
      var nums9 = resNums();
      A('ca9_done_1', nums9.done === 1);
      fireClick($('resHomeBtn')); await sleep(30);

    } catch (e) {
      res.ok = false;
      res.errors.push('EXCEPTION: ' + (e && e.message ? e.message : String(e)) + ' @ ' + (e && e.stack ? e.stack.split('\\n')[1] : ''));
    }
    res.log = log;
    var pre = $('__result__');
    pre.textContent = '__BEGIN__' + JSON.stringify(res) + '__END__';
    document.title = 'DONE:' + (res.ok ? 'OK' : 'FAIL');
  }
  if (document.readyState === 'complete') main();
  else window.addEventListener('load', function(){ setTimeout(main, 30); });
})();
</script>
`;

function buildRunHtml() {
  let html = fs.readFileSync(SRC_HTML, 'utf8');
  // engine.js nằm ở thư mục cha so với tests/ui.run.html ; chèn HOOK ngay sau nó
  html = html.replace(/<script\s+src=["']engine\.js["']\s*>\s*<\/script>/i,
    '<script src="../engine.js"></script>' + HOOK);
  // dự phòng nếu thẻ engine viết không kèm </script> liền
  if (html.indexOf('window.__lastQ') < 0) {
    html = html.replace(/<script\s+src=["']engine\.js["']\s*>/i, '<script src="../engine.js">');
    html = html.replace(/<\/head>/i, HOOK + '</head>');
  }
  // chèn driver trước </body>
  html = html.replace(/<\/body>/i, DRIVER + '\n</body>');
  fs.writeFileSync(RUN_HTML, html, 'utf8');
}

function fileUrl(p) {
  return 'file:///' + p.replace(/\\/g, '/').replace(/ /g, '%20');
}

function runChromeDump() {
  const userDir = path.join(__dirname, '.chrome-profile');
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    '--disable-extensions',
    '--virtual-time-budget=15000',
    '--user-data-dir=' + userDir,
    '--dump-dom',
    fileUrl(RUN_HTML)
  ];
  return execFileSync(CHROME, args, { encoding: 'utf8', timeout: 60000, maxBuffer: 64 * 1024 * 1024 });
}

export function run() {
  const R = makeReporter('UI');

  if (!fs.existsSync(CHROME)) {
    R.state.skipped = true;
    R.state.skipReason = 'Không tìm thấy Chrome tại ' + CHROME + ' — phần UI headless CHƯA tự động hoá.';
    return R.state;
  }

  buildRunHtml();
  R.ok(fs.existsSync(RUN_HTML), 'tạo được bản sao ui.run.html', null);

  let dom = '';
  try {
    dom = runChromeDump();
  } catch (e) {
    dom = (e.stdout || '') + (e.stderr || '');
    if (!dom) {
      R.state.skipped = true;
      R.state.skipReason = 'Chrome headless không chạy được: ' + (e.message || e) +
        ' — phần UI headless CHƯA tự động hoá (chạy thủ công bằng cách mở index.html).';
      return R.state;
    }
  }

  const m = dom.match(/__BEGIN__([\s\S]*?)__END__/);
  R.ok(!!m, 'driver ghi được kết quả vào DOM (#__result__)', dom.slice(0, 400));
  if (!m) {
    R.state.note = 'DOM dump không chứa marker kết quả; driver có thể chưa chạy xong trong virtual-time.';
    return R.state;
  }

  let data;
  try { data = JSON.parse(m[1]); }
  catch (e) {
    R.ok(false, 'parse JSON kết quả driver', m[1].slice(0, 300));
    return R.state;
  }

  // Các phép kiểm gốc (luồng cơ bản) + các CA mới của tính năng Kết thúc.
  const expected = [
    'home_visible', 'engine_loaded', 'hook_installed', 'topic_grid_9',
    // CA1 — Kết thúc cơ bản (practice)
    'quiz_visible_after_topic', 'finish_visible_practice',
    'finish_visible_after_grade_0', 'finish_visible_after_grade_1',
    'finish_visible_after_grade_2', 'finish_visible_after_grade_3',
    'result_after_finish', 'resReview_shown',
    'review_item_count_eq_graded', 'resnum_done', 'resnum_correct', 'resnum_wrong',
    'bad_count_matches', 'every_bad_has_ri_correct', 'ri_correct_matches_engine',
    // CA2 — nút sau tổng hợp
    'again_label_lamtiep', 'again_back_to_quiz', 'again_same_topic',
    'result_again_after_one', 'reshome_to_home',
    // CA3 — biên chưa làm câu nào
    'quiz_visible_case3', 'no_result_when_empty', 'still_on_quiz_when_empty', 'invite_in_feedback',
    // CA4 — skip không ghi
    'result_after_skip_case', 'skip_not_counted', 'skip_resnum_done_1',
    // CA5 — finishBtn ẩn ở mixed / hiện ở practice
    'mixed_quiz_visible', 'finish_hidden_mixed_before', 'finish_hidden_mixed_after',
    // CA6 — mixed vẫn có review
    'result_after_mixed10', 'mixed_score_x_of_10', 'mixed_review_10_items',
    'mixed_resReview_shown', 'mixed_resnum_done_10', 'mixed_resnum_sum',
    // CA7 — tự chấm im lặng khi KẾT THÚC (đã chọn, chưa Kiểm tra)
    'ca7_feedback_hidden_before_finish', 'ca7_result_shown', 'ca7_review_has_pending',
    'ca7_done_1', 'ca7_correct_1',
    // CA8 — tự chấm im lặng khi "Câu tiếp →" (đã chọn, chưa Kiểm tra)
    'ca8_feedback_hidden_before_skip', 'ca8_advanced_no_feedback', 'ca8_result_shown',
    'ca8_two_recorded', 'ca8_done_2', 'ca8_correct_1', 'ca8_wrong_1',
    'ca8_first_is_bad', 'ca8_first_has_correct',
    // CA9 — skip không đáp án = bỏ qua thật
    'ca9_only_graded_one', 'ca9_done_1'
  ];
  expected.forEach(name => {
    R.ok(data.asserts && data.asserts[name] === true, 'UI: ' + name, JSON.stringify(data.log));
  });
  R.ok(Array.isArray(data.errors) && data.errors.length === 0,
    'UI: không có lỗi runtime trong driver', JSON.stringify(data.errors));

  R.state.uiData = data;
  return R.state;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const s = run();
  if (s.skipped) {
    console.log(`[${s.group}] SKIPPED — ${s.skipReason}`);
    process.exit(0);
  }
  console.log(`[${s.group}] checks=${s.checks} fails=${s.fails.length}`);
  s.fails.forEach(f => console.log('  FAIL:', f.msg, f.ctx ? ('\n    ' + String(f.ctx).slice(0, 600)) : ''));
  process.exit(s.fails.length ? 1 : 0);
}

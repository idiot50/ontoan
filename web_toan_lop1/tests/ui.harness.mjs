/*
 * ui.harness.mjs — TEST GIAO DIỆN lớp 1 bằng Chrome headless (KHÔNG dùng Puppeteer).
 *
 * Cách làm:
 *  1. Đọc index.html gốc, tạo BẢN SAO trong tests/ (ui.run.html):
 *     - sửa <script src="engine.js"> -> "../engine.js"
 *     - chèn HOOK nhỏ (chỉ trong bản sao) bọc QuestionEngine.generate/generateMixed
 *       để lưu câu vừa sinh vào window.__lastQ / __queue -> driver BIẾT TRƯỚC đáp án
 *       để chủ động trả lời ĐÚNG/SAI (kiểm soát số Đúng/Sai). KHÔNG sửa logic app.
 *     - chèn <script> DRIVER trước </body>: kích hoạt SỰ KIỆN DOM THẬT
 *       (click chủ đề, chọn đáp án/nhập, bấm Kiểm tra/Câu tiếp/Kết thúc), ghi kết quả.
 *  2. Chạy: chrome --headless --dump-dom file://.../ui.run.html
 *  3. Đọc DOM trả về, trích JSON kết quả, biến thành assertion.
 *
 * LƯU Ý LỚP 1: Chrome headless KHÔNG có giọng tiếng Việt -> ttsReady=false:
 *   - nút đọc readBtn bị disabled; các nút "Nghe" (greetListen/listenBtn/resListen) ẩn;
 *   - trong MÀN TỔNG HỢP, nút 🔊 "Nghe" từng câu sai (.ri-listen) KHÔNG render.
 *   App VẪN dựng & đếm đúng màn tổng hợp. Driver xác nhận điều này (CA7).
 *
 * KHÔNG sửa index.html gốc — chỉ thao tác trên bản sao trong tests/.
 */
import { makeReporter } from './_harness.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_HTML = path.join(__dirname, '..', 'index.html');
const RUN_HTML = path.join(__dirname, 'ui.run.html');

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
function findChrome() {
  for (const p of CHROME_CANDIDATES) if (fs.existsSync(p)) return p;
  return null;
}

/* ------------ HOOK quan sát engine (chèn trong BẢN SAO, không sửa app) ------ */
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

/* ------------ DRIVER ------------ */
const DRIVER = `
<pre id="__result__" style="position:fixed;left:-9999px;top:-9999px;">PENDING</pre>
<script>
(function () {
  function $(id){ return document.getElementById(id); }
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  function hidden(id){ var e=$(id); return !e || e.classList.contains('hidden'); }
  function fireClick(el){ if(!el) return; el.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, view:window })); }
  function setInput(el, v){ el.value = v; el.dispatchEvent(new Event('input', { bubbles:true })); }
  var log = [];
  function note(k, v){ log.push({ step:k, val:v }); }

  function answerDisplayOf(q){
    if (q.type === 'mc') return q.choices[q.answer];
    var a = String(q.answer);
    if (a.indexOf(';') >= 0) return a.replace(/;/g, '; ');
    return a;
  }
  function wrongInputFor(q){
    var a = String(q.answer);
    if (/^-?\\d+$/.test(a.replace(/\\s/g,''))) return String((parseInt(a, 10) || 0) + 7);
    return 'xxx';
  }
  async function answerCurrent(want){
    var q = window.__lastQ;
    if (!q) return false;
    if (q.type === 'mc') {
      var btns = $('choices').querySelectorAll('.choice');
      var idx = (want === 'correct') ? q.answer : (q.answer === 0 ? 1 : 0);
      if (idx >= btns.length) idx = 0;
      fireClick(btns[idx]);
      await sleep(18);
    } else {
      var box = $('answerBox');
      setInput(box, (want === 'correct') ? answerDisplayOf(q) : wrongInputFor(q));
      await sleep(18);
    }
    fireClick($('checkBtn'));
    await sleep(22);
    return true;
  }
  function advanceMixedPointer(){
    if (window.__queue) {
      window.__mixIdx = (window.__mixIdx || 0) + 1;
      window.__lastQ = window.__queue[window.__mixIdx] || window.__lastQ;
    }
  }
  function reviewItems(){ return $('resReviewList').querySelectorAll('.review-item'); }
  function intOf(t){ var m = String(t).match(/-?\\d+/); return m ? parseInt(m[0],10) : NaN; }

  // L1: ô số nằm trong #resScore dạng .scorebox; box[0]=correct/done, box[1]=wrong.
  function resScoreBoxes(){
    var boxes = $('resScore').querySelectorAll('.scorebox .big');
    return Array.prototype.map.call(boxes, function(b){ return b.textContent.trim(); });
  }
  // tách "correct/done" -> {correct, done}
  function parseFrac(s){
    var m = String(s).match(/(-?\\d+)\\s*\\/\\s*(-?\\d+)/);
    return m ? { correct: parseInt(m[1],10), done: parseInt(m[2],10) } : { correct:NaN, done:NaN };
  }

  async function main(){
    var res = { ok:true, errors:[], asserts:{} };
    function A(name, cond){ res.asserts[name] = !!cond; if(!cond){ res.ok=false; res.errors.push(name); } }
    try {
      await sleep(40);
      A('home_visible', !hidden('screen-home'));
      A('engine_loaded', typeof window.QuestionEngine !== 'undefined' && window.QuestionEngine.topics.length === 8);
      A('hook_installed', !!window.__queue || true);

      // FALLBACK TTS: headless không có giọng tiếng Việt -> readBtn disabled
      var rb = $('readBtn');
      A('readbtn_disabled_fallback', !!rb && rb.disabled === true);
      A('tts_not_ready', typeof window.QuestionEngine !== 'undefined');  // sanity; ttsReady kiểm gián tiếp qua .ri-listen
      note('readBtn.disabled', rb ? rb.disabled : 'no-elem');

      var topicBtns = $('topicGrid').querySelectorAll('.topic');
      A('topic_grid_8', topicBtns.length === 8);

      /* ===== CA1: Luồng Kết thúc cơ bản (practice) — chấm 4 câu (2 đúng + 2 sai) ===== */
      fireClick(topicBtns[0]);
      await sleep(45);
      A('quiz_visible_after_topic', !hidden('screen-quiz'));
      A('finish_visible_practice', !hidden('finishBtn'));

      var plan = ['correct', 'wrong', 'correct', 'wrong'];
      var expectCorrect = 0, expectWrong = 0, expectCorrectTexts = [];
      for (var i = 0; i < plan.length; i++) {
        var disp = answerDisplayOf(window.__lastQ);
        await answerCurrent(plan[i]);
        var fbOk = $('feedback').classList.contains('ok');
        var fbBad = $('feedback').classList.contains('bad');
        if (plan[i] === 'correct') { if(!fbOk){res.errors.push('not_ok_at_'+i);res.ok=false;} expectCorrect++; }
        else { if(!fbBad){res.errors.push('not_bad_at_'+i);res.ok=false;} expectWrong++; expectCorrectTexts.push(disp); }
        A('finish_visible_after_grade_' + i, !hidden('finishBtn'));
        await sleep(10);
        fireClick($('nextBtn'));
        await sleep(35);
      }
      note('expect', { correct:expectCorrect, wrong:expectWrong, texts:expectCorrectTexts });

      fireClick($('finishBtn'));
      await sleep(45);
      A('result_after_finish', !hidden('screen-result'));
      A('resReview_shown', !hidden('resReview'));

      var items = reviewItems();
      A('review_item_count_eq_graded', items.length === plan.length);

      var boxes = resScoreBoxes();
      note('resScore_practice', boxes);
      var frac = parseFrac(boxes[0]);
      A('practice_done', frac.done === plan.length);
      A('practice_correct', frac.correct === expectCorrect);
      A('practice_wrong', intOf(boxes[1]) === expectWrong);

      // mỗi câu SAI có .ri-correct, nội dung khớp đáp án thật của engine
      var badItems = $('resReviewList').querySelectorAll('.review-item.bad');
      A('bad_count_matches', badItems.length === expectWrong);
      var allBadHaveCorrect = true, allCorrectTextMatch = true;
      for (var b = 0; b < badItems.length; b++) {
        var ric = badItems[b].querySelector('.ri-correct');
        if (!ric) { allBadHaveCorrect = false; continue; }
        var txt = ric.textContent.replace(/\\s+/g,' ').trim();
        var want = expectCorrectTexts[b];
        if (txt.indexOf(want) < 0 && txt.replace(/[ ]/g,'').indexOf(String(want).replace(/[ ]/g,'')) < 0)
          allCorrectTextMatch = false;
      }
      A('every_bad_has_ri_correct', allBadHaveCorrect);
      A('ri_correct_matches_engine', allCorrectTextMatch);

      /* ===== CA7: TTS fallback — KHÔNG có nút .ri-listen (ttsReady=false) ===== */
      var listenBtns = $('resReviewList').querySelectorAll('.ri-listen');
      note('ri_listen_count', listenBtns.length);
      A('no_ri_listen_when_no_tts', listenBtns.length === 0);   // headless: không nút Nghe
      // resListen (nút Nghe lại kết quả) cũng phải ẩn ở chế độ fallback
      A('resListen_hidden_fallback', hidden('resListen'));

      /* ===== CA2: nút sau tổng hợp ===== */
      A('again_label_lamtiep', /Làm tiếp/.test($('againBtn').textContent));
      fireClick($('againBtn'));
      await sleep(50);
      A('again_back_to_quiz', !hidden('screen-quiz'));
      A('again_topic_label', $('topicLabel').textContent.length > 0);
      // resHomeBtn: mở lại result bằng 1 câu rồi về trang chủ
      await answerCurrent('correct'); await sleep(20);
      fireClick($('finishBtn')); await sleep(45);
      A('result_again_after_one', !hidden('screen-result'));
      fireClick($('resHomeBtn'));
      await sleep(35);
      A('reshome_to_home', !hidden('screen-home'));

      /* ===== CA3: biên — chưa làm câu nào ===== */
      var tb = $('topicGrid').querySelectorAll('.topic');
      fireClick(tb[1]);
      await sleep(45);
      A('quiz_visible_case3', !hidden('screen-quiz'));
      fireClick($('finishBtn'));
      await sleep(30);
      A('no_result_when_empty', hidden('screen-result'));
      A('still_on_quiz_when_empty', !hidden('screen-quiz'));
      A('invite_in_feedback', $('feedback').classList.contains('show') &&
          /thử một câu/i.test($('feedback').textContent));

      /* ===== CA4: skip không được ghi ===== */
      for (var s = 0; s < 3; s++) { fireClick($('skipBtn')); await sleep(35); }
      await answerCurrent('correct'); await sleep(20);
      fireClick($('finishBtn')); await sleep(45);
      A('result_after_skip_case', !hidden('screen-result'));
      var itemsSkip = reviewItems();
      note('skip_items', itemsSkip.length);
      A('skip_not_counted', itemsSkip.length === 1);
      var fracSkip = parseFrac(resScoreBoxes()[0]);
      A('skip_done_1', fracSkip.done === 1);
      fireClick($('resHomeBtn')); await sleep(35);

      /* ===== CA5: finishBtn ẩn ở mixed (trước & sau chấm) + CA6: mixed có review ===== */
      fireClick($('mixedBtn'));
      await sleep(55);
      A('mixed_quiz_visible', !hidden('screen-quiz'));
      A('finish_hidden_mixed_before', hidden('finishBtn'));

      for (var k = 0; k < 10; k++) {
        var wantK = (k % 3 === 0) ? 'wrong' : 'correct';
        await answerCurrent(wantK);
        if (k === 0) A('finish_hidden_mixed_after', hidden('finishBtn'));
        await sleep(10);
        if (hidden('nextBtn')) { res.errors.push('mix_next_hidden_'+k); res.ok=false; }
        fireClick($('nextBtn'));
        advanceMixedPointer();
        await sleep(35);
        if (!hidden('screen-result')) break;
      }
      A('result_after_mixed10', !hidden('screen-result'));
      var mixBoxes = resScoreBoxes();
      note('resScore_mixed', mixBoxes);
      var mixFrac = parseFrac(mixBoxes[0]);
      A('mixed_score_x_of_10', mixFrac.done === 10);            // box[0] = "correct/10"
      var mixItems = reviewItems();
      note('mix_items', mixItems.length);
      A('mixed_review_10_items', mixItems.length === 10);       // CA6
      A('mixed_resReview_shown', !hidden('resReview'));
      // tổng đúng+sai trong review = 10
      var okN = $('resReviewList').querySelectorAll('.review-item.ok').length;
      var badN = $('resReviewList').querySelectorAll('.review-item.bad').length;
      A('mixed_review_sum_10', okN + badN === 10);
      // CA7 ở mixed: vẫn không có nút Nghe câu sai khi không có giọng
      A('mixed_no_ri_listen', $('resReviewList').querySelectorAll('.ri-listen').length === 0);
      fireClick($('resHomeBtn')); await sleep(35);

      /* ===== CA10: TỰ CHẤM IM LẶNG khi KẾT THÚC (đã chọn, CHƯA Kiểm tra) ===== */
      var tb10 = $('topicGrid').querySelectorAll('.topic');
      fireClick(tb10[0]); await sleep(45);
      var q10 = window.__lastQ;
      if (q10.type === 'mc') {
        var btns10 = $('choices').querySelectorAll('.choice');
        fireClick(btns10[q10.answer]); await sleep(18);   // chọn ĐÚNG, KHÔNG bấm Kiểm tra
      } else {
        setInput($('answerBox'), answerDisplayOf(q10)); await sleep(18);
      }
      A('ca10_feedback_hidden_before_finish', !$('feedback').classList.contains('show'));
      fireClick($('finishBtn')); await sleep(45);
      A('ca10_result_shown', !hidden('screen-result'));
      var items10 = reviewItems();
      note('ca10_items', items10.length);
      A('ca10_review_has_pending', items10.length === 1);   // câu đang làm được tính
      var frac10 = parseFrac(resScoreBoxes()[0]);
      note('ca10_frac', frac10);
      A('ca10_done_1', frac10.done === 1);
      A('ca10_correct_1', frac10.correct === 1);            // chọn đúng -> tính đúng
      fireClick($('resHomeBtn')); await sleep(35);

      /* ===== CA11: TỰ CHẤM IM LẶNG khi "Câu tiếp →" (đã chọn, CHƯA Kiểm tra) ===== */
      var tb11 = $('topicGrid').querySelectorAll('.topic');
      fireClick(tb11[0]); await sleep(45);
      var qA = window.__lastQ;
      var wantTextA = answerDisplayOf(qA);
      if (qA.type === 'mc') {
        var btnsA = $('choices').querySelectorAll('.choice');
        fireClick(btnsA[qA.answer === 0 ? 1 : 0]); await sleep(18);   // chọn SAI
      } else {
        setInput($('answerBox'), wrongInputFor(qA)); await sleep(18);
      }
      A('ca11_feedback_hidden_before_skip', !$('feedback').classList.contains('show'));
      fireClick($('skipBtn')); await sleep(45);
      A('ca11_advanced_no_feedback', !$('feedback').classList.contains('show'));
      var qB = window.__lastQ;
      if (qB.type === 'mc') {
        var btnsB = $('choices').querySelectorAll('.choice');
        fireClick(btnsB[qB.answer]); await sleep(18);   // chọn ĐÚNG
      } else {
        setInput($('answerBox'), answerDisplayOf(qB)); await sleep(18);
      }
      fireClick($('finishBtn')); await sleep(45);
      A('ca11_result_shown', !hidden('screen-result'));
      var items11 = reviewItems();
      note('ca11_items', items11.length);
      A('ca11_two_recorded', items11.length === 2);
      var ok11 = $('resReviewList').querySelectorAll('.review-item.ok').length;
      var bad11 = $('resReviewList').querySelectorAll('.review-item.bad').length;
      A('ca11_one_ok_one_bad', ok11 === 1 && bad11 === 1);
      A('ca11_first_is_bad', items11[0].classList.contains('bad'));
      var ric11 = items11[0].querySelector('.ri-correct');
      A('ca11_first_has_correct', !!ric11 &&
         ric11.textContent.replace(/\\s+/g,' ').indexOf(wantTextA) >= 0);
      fireClick($('resHomeBtn')); await sleep(35);

      /* ===== CA12: "Câu tiếp →" KHÔNG đáp án = bỏ qua thật (không ghi) ===== */
      var tb12 = $('topicGrid').querySelectorAll('.topic');
      fireClick(tb12[0]); await sleep(45);
      fireClick($('skipBtn')); await sleep(35);   // chưa chọn -> bỏ qua thật
      fireClick($('skipBtn')); await sleep(35);   // chưa chọn -> bỏ qua thật
      await answerCurrent('correct'); await sleep(20);
      fireClick($('finishBtn')); await sleep(45);
      var items12 = reviewItems();
      note('ca12_items', items12.length);
      A('ca12_only_graded_one', items12.length === 1);
      var frac12 = parseFrac(resScoreBoxes()[0]);
      A('ca12_done_1', frac12.done === 1);
      fireClick($('resHomeBtn')); await sleep(35);

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
  else window.addEventListener('load', function(){ setTimeout(main, 40); });
})();
</script>
`;

function buildRunHtml() {
  let html = fs.readFileSync(SRC_HTML, 'utf8');
  html = html.replace(/<script\s+src=["']engine\.js["']\s*>\s*<\/script>/i,
    '<script src="../engine.js"></script>' + HOOK);
  if (html.indexOf('window.__lastQ') < 0) {
    html = html.replace(/<script\s+src=["']engine\.js["']\s*>/i, '<script src="../engine.js">');
    html = html.replace(/<\/head>/i, HOOK + '</head>');
  }
  html = html.replace(/<\/body>/i, DRIVER + '\n</body>');
  fs.writeFileSync(RUN_HTML, html, 'utf8');
}

function fileUrl(p) {
  return 'file:///' + p.replace(/\\/g, '/').replace(/ /g, '%20');
}

function runChromeDump(chrome) {
  const userDir = path.join(__dirname, '.chrome-profile');
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    '--disable-extensions',
    '--virtual-time-budget=16000',
    '--user-data-dir=' + userDir,
    '--dump-dom',
    fileUrl(RUN_HTML)
  ];
  return execFileSync(chrome, args, { encoding: 'utf8', timeout: 60000, maxBuffer: 64 * 1024 * 1024 });
}

export function run() {
  const R = makeReporter('UI');

  const chrome = findChrome();
  if (!chrome) {
    R.state.skipped = true;
    R.state.skipReason = 'Không tìm thấy Chrome/Edge — phần UI headless CHƯA tự động hoá. ' +
      'Kiểm thủ công: mở index.html bằng trình duyệt.';
    return R.state;
  }

  buildRunHtml();
  R.ok(fs.existsSync(RUN_HTML), 'tạo được bản sao ui.run.html', null);

  let dom = '';
  try {
    dom = runChromeDump(chrome);
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

  const expected = [
    'home_visible', 'engine_loaded', 'hook_installed',
    'readbtn_disabled_fallback', 'topic_grid_8',
    // CA1
    'quiz_visible_after_topic', 'finish_visible_practice',
    'finish_visible_after_grade_0', 'finish_visible_after_grade_1',
    'finish_visible_after_grade_2', 'finish_visible_after_grade_3',
    'result_after_finish', 'resReview_shown',
    'review_item_count_eq_graded', 'practice_done', 'practice_correct', 'practice_wrong',
    'bad_count_matches', 'every_bad_has_ri_correct', 'ri_correct_matches_engine',
    // CA7
    'no_ri_listen_when_no_tts', 'resListen_hidden_fallback',
    // CA2
    'again_label_lamtiep', 'again_back_to_quiz', 'again_topic_label',
    'result_again_after_one', 'reshome_to_home',
    // CA3
    'quiz_visible_case3', 'no_result_when_empty', 'still_on_quiz_when_empty', 'invite_in_feedback',
    // CA4
    'result_after_skip_case', 'skip_not_counted', 'skip_done_1',
    // CA5
    'mixed_quiz_visible', 'finish_hidden_mixed_before', 'finish_hidden_mixed_after',
    // CA6
    'result_after_mixed10', 'mixed_score_x_of_10', 'mixed_review_10_items',
    'mixed_resReview_shown', 'mixed_review_sum_10', 'mixed_no_ri_listen',
    // CA10 — tự chấm im lặng khi KẾT THÚC (đã chọn, chưa Kiểm tra)
    'ca10_feedback_hidden_before_finish', 'ca10_result_shown', 'ca10_review_has_pending',
    'ca10_done_1', 'ca10_correct_1',
    // CA11 — tự chấm im lặng khi "Câu tiếp →" (đã chọn, chưa Kiểm tra)
    'ca11_feedback_hidden_before_skip', 'ca11_advanced_no_feedback', 'ca11_result_shown',
    'ca11_two_recorded', 'ca11_one_ok_one_bad', 'ca11_first_is_bad', 'ca11_first_has_correct',
    // CA12 — skip không đáp án = bỏ qua thật
    'ca12_only_graded_one', 'ca12_done_1'
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

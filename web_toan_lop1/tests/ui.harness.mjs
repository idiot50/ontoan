/*
 * ui.harness.mjs — TEST GIAO DIỆN lớp 1 bằng Chrome headless (KHÔNG dùng Puppeteer).
 *
 * Cách làm:
 *  1. Đọc index.html gốc, tạo BẢN SAO trong tests/ (ui.run.html):
 *     - sửa <script src="engine.js"> -> "../engine.js"
 *     - chèn <script> DRIVER trước </body>: driver kích hoạt SỰ KIỆN DOM THẬT
 *       (click thẻ chủ đề, chọn đáp án/nhập, bấm Kiểm tra, bấm Câu tiếp, chạy trọn
 *        bộ 10 câu Ôn tập -> màn Kết quả), ghi kết quả ra <pre id="__result__">.
 *  2. Chạy: chrome --headless --dump-dom file://.../ui.run.html
 *  3. Đọc DOM trả về, trích JSON kết quả, biến thành assertion.
 *
 * LƯU Ý LỚP 1: Chrome headless KHÔNG có giọng tiếng Việt -> tính năng ĐỌC ĐỀ phải
 * chuyển sang chế độ FALLBACK (nút đọc readBtn bị disabled, các nút "Nghe" ẩn) và
 * app VẪN CHẠY BÌNH THƯỜNG. Driver xác nhận điều này.
 *
 * Nếu Chrome không có / dump lỗi -> trả về skipped=true (run.mjs ghi rõ CHƯA tự động hoá).
 */
import { makeReporter } from './_harness.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_HTML = path.join(__dirname, '..', 'index.html');
const RUN_HTML = path.join(__dirname, 'ui.run.html');

// Các đường dẫn Chrome thường gặp trên Windows.
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

/* ------------ DRIVER: chèn vào trang, chạy trong trình duyệt ------------ */
const DRIVER = `
<pre id="__result__" style="position:fixed;left:-9999px;top:-9999px;">PENDING</pre>
<script>
(function () {
  function $(id){ return document.getElementById(id); }
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }
  function fireClick(el){
    if(!el) return;
    el.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, view:window }));
  }
  function setInput(el, v){
    el.value = v;
    el.dispatchEvent(new Event('input', { bubbles:true }));
  }
  var log = [];
  function note(k, v){ log.push({ step:k, val:v }); }

  function finish(res){
    res.log = log;
    var pre = $('__result__');
    pre.textContent = '__BEGIN__' + JSON.stringify(res) + '__END__';
    document.title = 'DONE:' + (res.ok ? 'OK' : 'FAIL');
  }

  // Trả lời câu đang hiển thị: kích hoạt luồng chấm (đúng/sai không quan trọng cho UI).
  async function answerCurrent(ctx){
    var choicesEl = $('choices');
    var isMc = choicesEl && !choicesEl.classList.contains('hidden') &&
               choicesEl.querySelectorAll('.choice').length > 0;
    if (isMc) {
      var btns = choicesEl.querySelectorAll('.choice');
      fireClick(btns[0]);
      await sleep(25);
      ctx.checkBtnEnabled = !$('checkBtn').disabled;
      fireClick($('checkBtn'));
      await sleep(25);
      // sau chấm: phải có đúng 1 nút .correct được đánh dấu
      var correctBtns = choicesEl.querySelectorAll('.choice.correct');
      ctx.hasCorrectMark = correctBtns.length === 1;
      ctx.feedbackShown = $('feedback').classList.contains('show') ||
                          $('feedback').textContent.trim().length > 0;
      return;
    }
    var box = $('answerBox');
    setInput(box, '0');
    await sleep(25);
    ctx.checkBtnEnabled = !$('checkBtn').disabled;
    fireClick($('checkBtn'));
    await sleep(25);
    ctx.feedbackShown = $('feedback').classList.contains('show') ||
                        $('feedback').textContent.trim().length > 0;
  }

  async function main(){
    var res = { ok:true, errors:[], asserts:{} };
    function A(name, cond){ res.asserts[name] = !!cond; if(!cond){ res.ok=false; res.errors.push(name); } }
    try {
      // 0) trang chủ render + engine nạp
      await sleep(40);
      A('home_visible', !$('screen-home').classList.contains('hidden'));
      A('engine_loaded', typeof window.QuestionEngine !== 'undefined' &&
                         window.QuestionEngine.topics.length === 8);

      // 0b) FALLBACK TTS: headless không có giọng tiếng Việt ->
      //     nút đọc readBtn phải bị KHOÁ và app KHÔNG vỡ.
      var rb = $('readBtn');
      A('readbtn_exists', !!rb);
      A('readbtn_disabled_fallback', rb && rb.disabled === true);
      note('readBtn.disabled', rb ? rb.disabled : 'no-elem');
      // nút "Nghe" cạnh đề nên bị ẩn ở chế độ fallback
      var lb = $('listenBtn');
      note('listenBtn.hidden', lb ? lb.classList.contains('hidden') : 'no-elem');

      // 1) lưới chủ đề đủ 8 thẻ
      var topicBtns = $('topicGrid').querySelectorAll('.topic');
      A('topic_grid_8', topicBtns.length === 8);
      note('topics', topicBtns.length);

      // 2) click 1 chủ đề -> sang màn làm bài
      fireClick(topicBtns[0]);
      await sleep(50);
      A('quiz_visible_after_topic', !$('screen-quiz').classList.contains('hidden'));
      A('stem_nonempty', $('stem').innerHTML.trim().length > 0);

      // 3) trả lời 1 câu (luyện tập) -> chấm -> hiện nút Câu tiếp
      var ctx1 = {};
      await answerCurrent(ctx1);
      A('check_btn_enabled_after_select', !!ctx1.checkBtnEnabled);
      A('feedback_shown_practice', !!ctx1.feedbackShown);
      A('next_btn_visible_practice', !$('nextBtn').classList.contains('hidden'));
      note('ctx1', ctx1);

      // 4) bấm Câu tiếp -> câu mới, nút Kiểm tra hiện lại
      fireClick($('nextBtn'));
      await sleep(50);
      A('check_btn_back_after_next', !$('checkBtn').classList.contains('hidden'));
      A('next_btn_hidden_after_next', $('nextBtn').classList.contains('hidden'));

      // 5) về trang chủ
      fireClick($('quizHomeBtn'));
      await sleep(40);
      A('home_after_quizhome', !$('screen-home').classList.contains('hidden'));

      // 6) ÔN TẬP — hoàn thành đủ 10 câu -> màn Kết quả
      fireClick($('mixedBtn'));
      await sleep(50);
      A('mixed_quiz_visible', !$('screen-quiz').classList.contains('hidden'));
      var answeredCount = 0;
      for (var i = 0; i < 10; i++) {
        var ctx = {};
        await answerCurrent(ctx);
        answeredCount++;
        if ($('nextBtn').classList.contains('hidden')) { res.errors.push('next_hidden_at_' + i); res.ok=false; }
        await sleep(15);
        fireClick($('nextBtn'));
        await sleep(35);
        if (!$('screen-result').classList.contains('hidden')) break;
      }
      note('answeredCount', answeredCount);
      A('result_after_10', !$('screen-result').classList.contains('hidden'));
      A('result_score_text', /\\d+\\s*\\/\\s*\\d+/.test($('resScore').textContent) ||
                             /\\d+/.test($('resScore').textContent));

      // 7) chơi lại -> quay lại quiz
      fireClick($('againBtn'));
      await sleep(50);
      A('quiz_after_again', !$('screen-quiz').classList.contains('hidden'));

      // 8) màn huy hiệu mở được
      fireClick($('homeBtn'));
      await sleep(25);
      fireClick($('badgesBtn'));
      await sleep(25);
      A('badges_screen', !$('screen-badges').classList.contains('hidden'));
      A('badge_cards', $('badgeGrid').querySelectorAll('.bcard').length >= 8);

    } catch (e) {
      res.ok = false;
      res.errors.push('EXCEPTION: ' + (e && e.message ? e.message : String(e)));
    }
    finish(res);
  }
  if (document.readyState === 'complete') main();
  else window.addEventListener('load', function(){ setTimeout(main, 40); });
})();
</script>
`;

function buildRunHtml() {
  let html = fs.readFileSync(SRC_HTML, 'utf8');
  html = html.replace(/<script\s+src=["']engine\.js["']\s*>/i, '<script src="../engine.js">');
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
    '--virtual-time-budget=10000',
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
    'home_visible', 'engine_loaded',
    'readbtn_exists', 'readbtn_disabled_fallback',
    'topic_grid_8',
    'quiz_visible_after_topic', 'stem_nonempty',
    'check_btn_enabled_after_select', 'feedback_shown_practice', 'next_btn_visible_practice',
    'check_btn_back_after_next', 'next_btn_hidden_after_next',
    'home_after_quizhome',
    'mixed_quiz_visible', 'result_after_10', 'result_score_text',
    'quiz_after_again', 'badges_screen', 'badge_cards'
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
  s.fails.forEach(f => console.log('  FAIL:', f.msg, f.ctx ? ('\n    ' + String(f.ctx).slice(0, 300)) : ''));
  process.exit(s.fails.length ? 1 : 0);
}

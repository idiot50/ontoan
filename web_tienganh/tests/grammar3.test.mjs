/*
 * grammar3.test.mjs — Kiểm nội dung track "grammar3" (Ngữ pháp Tăng cường 20 bài).
 * Chạy:  node tests/grammar3.test.mjs
 *
 * Kiểm 3 lớp:
 *  A. SCHEMA  — cấu trúc theo CONTRACTS §1 (+ trường bổ sung `track`, `lesson`, `context_vi`).
 *  B. TÍNH ĐƠN NGHĨA — mọi slot chỗ trống (`blanks`) của grammar point có khai báo
 *     `fill_blank` PHẢI do `answerKey` điều khiển. Đây là điều kiện để bài có ĐÚNG
 *     MỘT đáp án: nếu slot tự do, engine chọn bừa 1 giá trị làm "đúng" (CONTRACTS §2.4.1).
 *  C. SINH BÀI THẬT — gọi Engine.generate() với nhiều seed cố định cho MỌI
 *     (grammar point × generator), soát bất biến + a/an + không rò {slot}.
 *     Nếu một distractor trùng câu đúng sinh ra, engine sẽ ném lỗi -> test bắt được.
 *
 * Tham số: --show   in kèm bài mẫu để người soạn duyệt chất lượng bằng mắt.
 */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const TRACK = 'grammar3';
const SHOW = process.argv.includes('--show');
const SEEDS = 40;

const Engine = require(path.join(root, 'js', 'engine.js'));
const index = require(path.join(root, 'content', TRACK, 'index.json'));

let pass = 0, fail = 0;
const fails = [];
function check(name, fn) {
  try { fn(); pass++; console.log('  ✓ ' + name); }
  catch (e) { fail++; fails.push(name + ' :: ' + (e && e.message)); console.error('  ✗ ' + name + '  ->  ' + (e && e.message)); }
}
function assert(c, m) { if (!c) throw new Error(m); }

const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const slotsInText = t => [...String(t).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map(m => m[1]);

// Soát mạo từ sai kiểu "a apple" / "an pen" trong một câu tiếng Anh đã ráp.
function badArticle(s) {
  const m = String(s).match(/\b(a|an)\s+([a-zA-Z]+)/i);
  if (!m) return null;
  const want = VOWELS.includes(m[2][0].toLowerCase()) ? 'an' : 'a';
  return m[1].toLowerCase() === want ? null : (m[1] + ' ' + m[2] + '" (nên "' + want + ' ' + m[2] + '")');
}

// Mặc định: chỉ kiểm bài status="ready" (ship dần từng bài mà CI vẫn xanh).
// --only unit04.json,unit05.json : kiểm đúng các file này bất kể status —
// dùng khi đang soạn bài mới, trước khi bật status sang "ready".
const onlyArg = process.argv.find(a => a.startsWith('--only'));
const onlyList = onlyArg
  ? (onlyArg.includes('=') ? onlyArg.split('=')[1] : process.argv[process.argv.indexOf(onlyArg) + 1] || '')
      .split(',').map(s => s.trim()).filter(Boolean)
  : null;

const ready = onlyList
  ? (index.lessons || []).filter(l => onlyList.includes(l.file))
  : (index.lessons || []).filter(l => l.status === 'ready');

if (onlyList) {
  const missing = onlyList.filter(f => !(index.lessons || []).some(l => l.file === f));
  if (missing.length) {
    console.error('\n✗ --only: không có bài nào trong index.json dùng file: ' + missing.join(', '));
    process.exit(1);
  }
  console.log('\n=== TRACK ' + TRACK + ' — kiểm riêng ' + ready.length + ' bài: ' + onlyList.join(', ') + ' ===');
} else {
  console.log('\n=== TRACK ' + TRACK + ' — ' + ready.length + '/' + (index.lessons || []).length +
              ' bài đã soạn (status=ready) ===');
}

const samples = [];

for (const meta of ready) {
  const abs = path.join(root, 'content', TRACK, meta.file);
  if (!fs.existsSync(abs)) {
    fail++;
    fails.push(meta.file + ' :: chưa có file này trong content/' + TRACK + '/');
    console.error('  ✗ ' + meta.file + '  ->  chưa có file (bài ' + meta.unit + ' còn ở trạng thái "' + meta.status + '")');
    continue;
  }
  const data = require(abs);
  const tag = 'unit' + String(data.unit).padStart(2, '0');

  /* ---------- A. SCHEMA ---------- */
  check(tag + ': cấu trúc top-level', () => {
    assert(data.schemaVersion === 'v1', 'schemaVersion phải "v1"');
    assert(data.track === TRACK, 'track phải "' + TRACK + '"');
    assert([1, 2, 3].includes(data.level), 'level 1|2|3');
    assert(data.unit === meta.unit, 'unit khớp index.json');
    assert(data.lesson === meta.lesson, 'lesson khớp index.json');
    assert(data.topic && data.topic_vi, 'thiếu topic/topic_vi');
    assert(Array.isArray(data.vocab) && data.vocab.length >= 4, 'cần ≥4 vocab');
    assert(Array.isArray(data.grammar) && data.grammar.length >= 1, 'cần ≥1 grammar point');
    assert(data.phonics === null || typeof data.phonics === 'object', 'phonics object|null');
    assert(Array.isArray(data.reading), 'reading[]');
  });

  check(tag + ': vocab đủ trường + example đúng mạo từ', () => {
    data.vocab.forEach((v, i) => {
      assert(v.word && v.vi && v.icon && v.example, 'vocab[' + i + '] thiếu word/vi/icon/example');
      const bad = badArticle(v.example);
      assert(!bad, 'vocab "' + v.word + '" example sai mạo từ: "' + bad);
    });
  });

  check(tag + ': reading hợp lệ', () => {
    data.reading.forEach(r => {
      assert(r.id && r.title && r.text, 'reading thiếu id/title/text');
      assert(Array.isArray(r.questions) && r.questions.length >= 1, r.id + ' cần ≥1 câu hỏi');
      r.questions.forEach(q => {
        assert(q.id && q.q_vi && q.type, r.id + '/' + q.id + ' thiếu id/q_vi/type');
        if (q.type === 'truefalse') {
          assert(typeof q.answer === 'boolean', r.id + '/' + q.id + ' truefalse cần answer boolean');
        } else if (q.type === 'mcq') {
          assert(Array.isArray(q.choices) && q.choices.length >= 3, r.id + '/' + q.id + ' mcq cần ≥3 choices');
          assert(new Set(q.choices).size === q.choices.length, r.id + '/' + q.id + ' choices trùng nhau');
          assert(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length,
                 r.id + '/' + q.id + ' answer index ngoài khoảng');
        } else {
          throw new Error(r.id + '/' + q.id + ' type lạ: ' + q.type);
        }
      });
    });
  });

  /* ---------- B. TÍNH ĐƠN NGHĨA ---------- */
  for (const g of data.grammar) {
    check(tag + '/' + g.id + ': safeZone hợp lệ', () => {
      assert(g.title_vi && g.explain_vi, 'thiếu title_vi/explain_vi');
      assert(Array.isArray(g.examples) && g.examples.length >= 2, 'cần ≥2 examples');
      assert(Array.isArray(g.generators) && g.generators.length, 'cần generators');
      const sz = g.safeZone;
      assert(sz && Array.isArray(sz.templates) && sz.templates.length, 'thiếu templates');
      assert(sz.slots && typeof sz.slots === 'object', 'thiếu slots');
      g.examples.forEach(ex => {
        const bad = badArticle(ex);
        assert(!bad, 'example sai mạo từ: "' + bad);
      });
      sz.templates.forEach(t => {
        assert(t.id && t.text, 'template thiếu id/text');
        const names = slotsInText(t.text);
        names.forEach(n => assert(Array.isArray(sz.slots[n]) && sz.slots[n].length,
          t.id + ': slot "' + n + '" không có giá trị trong slots'));
        assert(Array.isArray(t.blanks), t.id + ': phải khai báo blanks (dùng [] nếu không có chỗ trống)');
        t.blanks.forEach(b => assert(names.includes(b), t.id + ': blank "' + b + '" không có trong text'));
      });
      if (g.generators.includes('mcq') || g.generators.includes('listen_choose')) {
        assert(Array.isArray(sz.distractors) && sz.distractors.length >= 3,
          'mcq/listen_choose cần ≥3 distractors (có ' + ((sz.distractors || []).length) + ')');
      }
    });

    // context_vi KHÔNG được lộ đáp án. Engine in context_vi ngay trong đề fill_blank,
    // nên nếu nó nhắc ĐÚNG MỘT giá trị của slot chỗ trống (mà slot có ≥2 lựa chọn) thì
    // trẻ chỉ cần đọc gợi ý là xong — bài mất tác dụng. Nêu ĐỦ các lựa chọn thì hợp lệ
    // (đó là nêu quy tắc), nêu một cái là đưa đáp án.
    check(tag + '/' + g.id + ': context_vi không lộ đáp án', () => {
      const esc = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      g.safeZone.templates.forEach(t => {
        if (!t.context_vi) return;
        (t.blanks || []).forEach(b => {
          const vals = [...new Set(g.safeZone.slots[b] || [])];
          if (vals.length < 2) return;   // không có gì để chọn → không thể lộ
          const named = vals.filter(v => new RegExp('"' + esc(v) + '"', 'i').test(t.context_vi));
          assert(named.length !== 1,
            t.id + ': context_vi nhắc đúng một lựa chọn ' + JSON.stringify(named) +
            ' trong ' + vals.length + ' giá trị của slot "' + b + '" → lộ đáp án. ' +
            'Hãy nêu ĐỦ các lựa chọn, hoặc chỉ nêu manh mối.');
        });
      });
    });

    // Điều kiện ĐÚNG-MỘT-ĐÁP-ÁN cho fill_blank.
    if (g.generators.includes('fill_blank')) {
      check(tag + '/' + g.id + ': mọi blank do answerKey điều khiển (đúng 1 đáp án)', () => {
        const ak = g.safeZone.answerKey || {};
        g.safeZone.templates.forEach(t => {
          assert(t.blanks.length > 0, t.id + ': grammar point khai báo fill_blank nhưng template không có blank');
          t.blanks.forEach(b => {
            const rule = ak[t.id] && ak[t.id][b];
            assert(rule !== undefined,
              t.id + '/' + b + ': thiếu answerKey → engine sẽ chọn bừa 1 giá trị làm đáp án đúng');
            if (rule && typeof rule === 'object') {
              const cond = rule.__cond;
              assert(typeof cond === 'string', t.id + '/' + b + ': map answerKey nên khai báo "__cond"');
              const condVals = g.safeZone.slots[cond] || [];
              condVals.forEach(cv => assert(Object.prototype.hasOwnProperty.call(rule, cv),
                t.id + '/' + b + ': answerKey thiếu giá trị cho ' + cond + '="' + cv + '"'));
            }
          });
        });
      });
    }

    /* ---------- C. SINH BÀI THẬT ---------- */
    for (const type of g.generators) {
      check(tag + '/' + g.id + ' × ' + type + ': ' + SEEDS + ' seed đều hợp lệ', () => {
        // QUAN TRỌNG: bài NGỮ PHÁP chỉ truyền `grammar`, KHÔNG truyền `vocabPool`.
        // mcq/listen_choose ưu tiên vocabPool nếu có -> sẽ rơi về hỏi nghĩa từ và
        // KHÔNG luyện đúng điểm ngữ pháp. Frontend phải dựng spec theo đúng quy ước này.
        const spec = { type, level: data.level, unit: data.unit, grammarId: g.id, grammar: g };
        const seen = new Set();
        for (let s = 1; s <= SEEDS; s++) {
          const ex = Engine.generate(spec, s * 7919);
          assert(ex.type === type, 'type không khớp');
          assert(typeof ex.prompt === 'string' && ex.prompt.trim(), 'prompt rỗng');
          assert(typeof ex.explain === 'string' && ex.explain.trim(), 'explain rỗng');
          const blob = [ex.prompt, ex.explain, ex.audioText || '', (ex.choices || []).join(' '), (ex.tokens || []).join(' ')].join(' ');
          assert(!/\{[a-zA-Z0-9_]+\}/.test(blob), 'còn rò {slot} chưa điền: ' + blob);

          if (type === 'mcq' || type === 'listen_choose') {
            assert(Array.isArray(ex.choices) && ex.choices.length >= 4, 'cần ≥4 choices');
            assert(new Set(ex.choices.map(c => c.toLowerCase())).size === ex.choices.length, 'choices trùng nhau');
            assert(Number.isInteger(ex.answer) && ex.answer >= 0 && ex.answer < ex.choices.length, 'answer index sai');
            const correct = ex.choices[ex.answer];
            const bad = badArticle(correct);
            assert(!bad, 'câu đúng sai mạo từ: "' + bad);
          } else if (type === 'fill_blank') {
            assert(typeof ex.answer === 'string' && ex.answer.trim(), 'answer rỗng');
            assert(ex.prompt.includes('___'), 'prompt thiếu chỗ trống ___');
            const bad = badArticle(ex.audioText || '');
            assert(!bad, 'câu đúng sai mạo từ: "' + bad);
          } else if (type === 'order_words') {
            assert(Array.isArray(ex.answer) && ex.answer.length >= 2, 'answer phải là mảng ≥2 từ');
            assert(Array.isArray(ex.tokens) && ex.tokens.length === ex.answer.length, 'tokens không khớp answer');
            assert(ex.tokens.join(' ') !== ex.answer.join(' '), 'tokens đã sẵn đúng thứ tự');
            assert([...ex.tokens].sort().join('|') === [...ex.answer].sort().join('|'), 'tokens khác tập answer');
            // Trẻ 9-11 tuổi: quá nhiều thẻ thì bài thành đánh đố, không còn luyện ngữ pháp.
            assert(ex.answer.length <= 8, 'order_words có ' + ex.answer.length +
              ' thẻ (>8) — mẫu câu quá dài, nên bỏ order_words khỏi điểm ngữ pháp này: "' + ex.answer.join(' ') + '"');
            // Thẻ trùng nhau -> trẻ không biết đặt thẻ nào vào đâu, chấm điểm gây tranh cãi.
            assert(new Set(ex.tokens).size === ex.tokens.length, 'order_words có thẻ trùng nhau: "' + ex.answer.join(' ') + '"');
          } else if (type === 'transform') {
            assert(typeof ex.answer === 'string' && ex.answer.trim(), 'answer rỗng');
          }
          seen.add(JSON.stringify([ex.prompt, ex.answer]));
        }
        assert(seen.size >= 2, 'chỉ sinh ra 1 biến thể duy nhất trong ' + SEEDS + ' seed (nội dung quá hẹp)');
        // Lưu 1 bài mẫu để in ra cho người soạn duyệt.
        samples.push({ tag, gid: g.id, type, ex: Engine.generate(spec, 123457) });
      });
    }
  }
}

/* ---------- IN BÀI MẪU ---------- */
if (SHOW) {
  console.log('\n=== BÀI MẪU (seed 123457) ===');
  let lastTag = null;
  for (const s of samples) {
    if (s.tag !== lastTag) { console.log('\n──────── ' + s.tag + ' ────────'); lastTag = s.tag; }
    const e = s.ex;
    console.log('\n[' + s.gid + ' · ' + s.type + ']');
    console.log('  đề     : ' + e.prompt);
    if (e.choices) e.choices.forEach((c, i) => console.log('           ' + (i === e.answer ? '►' : ' ') + ' ' + String.fromCharCode(65 + i) + '. ' + c));
    if (e.tokens) console.log('  thẻ    : ' + e.tokens.join(' / '));
    console.log('  đáp án : ' + (Array.isArray(e.answer) ? e.answer.join(' ') : (e.choices ? String.fromCharCode(65 + e.answer) : e.answer)));
    console.log('  giải   : ' + e.explain);
    if (e.audioText) console.log('  TTS    : ' + e.audioText);
  }
}

console.log('\n======== grammar3: ' + pass + ' PASS · ' + fail + ' FAIL ========');
if (fail) { console.log('\nChi tiết lỗi:'); fails.forEach(f => console.log('  - ' + f)); }
process.exit(fail ? 1 : 0);

/*
 * bake_run3_audio.mjs — Sinh sẵn (bake) giọng đọc tiếng Anh cho "Ngữ Pháp Vui 3".
 *
 * VÌ SAO CẦN: máy học của trẻ có thể KHÔNG cài giọng tiếng Anh -> Web Speech câm.
 * Bake sẵn mp3 bằng Piper (offline, miễn phí) để app luôn đọc được, kể cả khi mở
 * bằng file:// (thẻ <audio src> nạp đường dẫn tương đối vẫn chạy, không cần fetch).
 *
 * CHẠY:  node build/bake_run3_audio.mjs [--voice en_GB-alba-medium] [--limit N] [--dry]
 *
 * Dùng lại pipeline Piper -> WAV -> MP3 (lamejs) của web_tienganh; KHÔNG cần ffmpeg.
 * Khoá file = FNV-1a của text đã chuẩn hoá — phải KHỚP js/say.js.
 * Sinh ra:  audio/<voice>/<key>.mp3  +  data/audio-manifest.js (window.RUN3_AUDIO)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { piperSynthWav, wavToMp3, audioKey } from '../../web_tienganh/build/bake_audio.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const CONTENT = path.join(ROOT, 'data', 'content.json');
const MANIFEST_JS = path.join(ROOT, 'data', 'audio-manifest.js');

const args = process.argv.slice(2);
function arg(name, def) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
}
const VOICE = arg('--voice', 'en_GB-alba-medium');
const LIMIT = parseInt(arg('--limit', '0'), 10) || 0;
const DRY = args.includes('--dry');
const AUDIO_DIR = path.join(ROOT, 'audio', VOICE);

/* ---------- LẤY CÂU: phải khớp sayTextOfLine() trong js/app.js ---------- */
function stripTags(s) { return String(s == null ? '' : s).replace(/<[^>]*>/g, ''); }

function sayTextOfLine(line) {
  const out = [];
  for (const t of line) {
    if (t.text !== undefined) {
      if (String(t.text).trim() === '/') continue;      // dấu ngăn của pickword
      out.push(t.text);
    } else if (t.gap !== undefined) {
      out.push(t.gap);
    } else if (t.dd) {
      out.push(t.dd.choices[t.dd.answer]);
    } else if (t.sel) {
      if (t.sel.correct) out.push(t.sel.word);
    }
  }
  return stripTags(out.join(''))
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?])/g, '$1')
    .trim();
}

function collect(data) {
  const set = new Map();                                 // text -> key
  const add = (t) => {
    const s = String(t || '').trim();
    if (s.length < 2) return;
    if (!set.has(s)) set.set(s, audioKey(s));
  };
  for (const u of data.units) {
    for (const ex of u.exercises) {
      const d = ex.data || {};
      if (ex.type === 'gapfill' || ex.type === 'dropdown') {
        (d.lines || []).forEach((l) => add(sayTextOfLine(l)));
      } else if (ex.type === 'pickword') {
        (d.sentences || []).forEach((l) => add(sayTextOfLine(l)));
      } else if (ex.type === 'mcq') {
        (d.questions || []).forEach((q) => {
          const full = stripTags(q.text).replace(/…|_{2,}/, q.choices[q.answer]).replace(/\s+/g, ' ').trim();
          add(full);
          add(q.choices[q.answer]);                      // đọc riêng đáp án
        });
      } else if (ex.type === 'matching') {
        (d.pairs || []).forEach((p) => {
          add(stripTags(p.left) + ' ' + stripTags(p.right));
          add(stripTags(p.right));
        });
      } else if (ex.type === 'group') {
        (d.groups || []).forEach((g) => (g.items || []).forEach((w) => add(String(w))));
      }
      // đáp án lẻ của gapfill/dropdown -> để đọc từng từ khi ôn tập
      if (ex.type === 'gapfill') {
        (d.lines || []).forEach((l) => l.forEach((t) => { if (t.gap !== undefined) add(String(t.gap)); }));
      }
      if (ex.type === 'dropdown') {
        (d.lines || []).forEach((l) => l.forEach((t) => { if (t.dd) add(t.dd.choices[t.dd.answer]); }));
      }
    }
  }
  return set;
}

/* ---------- CHẠY ---------- */
const data = JSON.parse(fs.readFileSync(CONTENT, 'utf8'));
const texts = collect(data);
const list = [...texts.entries()];
console.log(`Cần bake: ${list.length} clip (giọng ${VOICE})`);
if (DRY) {
  list.slice(0, 20).forEach(([t, k]) => console.log(' ', k, '|', t));
  process.exit(0);
}

fs.mkdirSync(AUDIO_DIR, { recursive: true });
const keys = {};
let made = 0, skipped = 0, failed = 0, bytes = 0;
const work = LIMIT ? list.slice(0, LIMIT) : list;

for (let i = 0; i < work.length; i++) {
  const [text, key] = work[i];
  const out = path.join(AUDIO_DIR, key + '.mp3');
  if (fs.existsSync(out) && fs.statSync(out).size > 300) {
    keys[key] = 1; skipped++; continue;
  }
  try {
    const wav = piperSynthWav(text, VOICE);
    const mp3 = await wavToMp3(wav, 56);
    fs.writeFileSync(out, mp3);
    keys[key] = 1;
    made++; bytes += mp3.length;
  } catch (e) {
    failed++;
    console.log('  ✗ lỗi:', text.slice(0, 50), '|', e.message);
  }
  if ((i + 1) % 25 === 0) console.log(`  … ${i + 1}/${work.length} (mới ${made}, có sẵn ${skipped})`);
}

// manifest NHÚNG (không fetch -> chạy được file://)
const js = `/* TỰ ĐỘNG SINH bởi build/bake_run3_audio.mjs — KHÔNG sửa tay.
   ${Object.keys(keys).length} clip, giọng ${VOICE}. Khoá = FNV-1a(text chuẩn hoá), khớp js/say.js. */
window.RUN3_AUDIO = ${JSON.stringify({ voice: VOICE, dir: 'audio', keys })};
`;
fs.writeFileSync(MANIFEST_JS, js, 'utf8');

console.log(`\nXONG: mới ${made} · có sẵn ${skipped} · lỗi ${failed} · thêm ${(bytes / 1048576).toFixed(1)} MB`);
console.log(`manifest: data/audio-manifest.js (${Object.keys(keys).length} khoá)`);

/*
 * run.mjs — chạy TẤT CẢ test lớp 1 (engine / check / safety / ui), in tổng kết
 * PASS/FAIL từng nhóm + tổng số phép kiểm. process.exit(1) khi có FAIL.
 *
 * Chạy:  node tests/run.mjs   (hoặc: npm test)
 */
import { run as runEngine } from './engine.spec.mjs';
import { run as runCheck } from './check.spec.mjs';
import { run as runSafety } from './safety.spec.mjs';
import { run as runUi } from './ui.harness.mjs';

const groups = [];
function add(fn, label) {
  const t0 = Date.now();
  let state;
  try {
    state = fn();
  } catch (e) {
    state = { group: label, checks: 0, fails: [{ msg: 'CRASH: ' + (e && e.stack || e) }], samples: [] };
  }
  state.ms = Date.now() - t0;
  groups.push(state);
  return state;
}

console.log('================ BỘ TEST WEB TOÁN LỚP 1 ================\n');

add(runEngine, 'ENGINE');
add(runCheck, 'CHECK');
add(runSafety, 'SAFETY');
add(runUi, 'UI');

let totalChecks = 0;
let totalFails = 0;
let hadFail = false;

for (const g of groups) {
  totalChecks += g.checks || 0;
  const fails = (g.fails && g.fails.length) || 0;
  totalFails += fails;

  if (g.skipped) {
    console.log(`⏭️  [${g.group}] SKIPPED (${g.ms}ms) — ${g.skipReason}`);
    continue;
  }
  const status = fails === 0 ? '✅ PASS' : '❌ FAIL';
  if (fails) hadFail = true;
  console.log(`${status}  [${g.group}]  ${g.checks} phép kiểm, ${fails} lỗi  (${g.ms}ms)`);

  if (fails) {
    g.fails.slice(0, 20).forEach(f => {
      console.log('     • ' + f.msg);
      if (f.ctx) {
        const c = typeof f.ctx === 'string' ? f.ctx : JSON.stringify(f.ctx);
        console.log('       ctx: ' + String(c).slice(0, 400));
      }
    });
    if (g.fails.length > 20) console.log('     • ... và ' + (g.fails.length - 20) + ' lỗi khác');
  }
}

const ui = groups.find(g => g.group === 'UI');
if (ui && ui.skipped) {
  console.log('\nGhi chú UI: phần kiểm GIAO DIỆN headless chưa chạy được trên máy này.');
  console.log('  -> Kiểm thủ công: mở d:\\toanlop3\\web_toan_lop1\\index.html bằng Chrome/Edge.');
}

console.log('\n--------------------------------------------------------');
console.log(`TỔNG: ${totalChecks} phép kiểm · ${totalFails} lỗi · ` +
  (hadFail ? '❌ CÓ FAIL' : '✅ TẤT CẢ PASS'));
console.log('--------------------------------------------------------');

process.exit(hadFail ? 1 : 0);

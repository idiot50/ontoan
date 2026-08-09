/*
 * run.mjs — chạy toàn bộ test của app "Thi Lớp 5", in PASS/FAIL.
 * Chạy:  node tests/run.mjs   (hoặc: npm test)
 */
import { run as runEngine } from './engine.spec.mjs';
import { run as runCheck } from './check.spec.mjs';
import { run as runUi } from './ui.harness.mjs';

const groups = [];
function add(fn, label) {
  const t0 = Date.now();
  let state;
  try {
    state = fn();
  } catch (e) {
    state = { group: label, checks: 0, fails: [{ msg: 'CRASH: ' + ((e && e.stack) || e) }], samples: [] };
  }
  state.ms = Date.now() - t0;
  groups.push(state);
}

console.log('============== BỘ TEST WEB "THI LỚP 5" ==============\n');

add(runEngine, 'ENGINE');
add(runCheck, 'CHECK');
add(runUi, 'UI');

let totalChecks = 0, totalFails = 0, hadFail = false;

for (const g of groups) {
  totalChecks += g.checks || 0;
  const fails = (g.fails && g.fails.length) || 0;
  totalFails += fails;
  if (g.skipped) {
    console.log(`⏭️  [${g.group}] SKIPPED (${g.ms}ms) — ${g.skipReason}`);
    continue;
  }
  if (fails) hadFail = true;
  console.log(`${fails === 0 ? '✅ PASS' : '❌ FAIL'}  [${g.group}]  ${g.checks} phép kiểm, ${fails} lỗi  (${g.ms}ms)`);
  if (g.coverage) console.log('     phủ kiểm lại toán học → ' + g.coverage);
  if (fails) {
    g.fails.slice(0, 25).forEach(f => {
      console.log('     • ' + f.msg);
      if (f.ctx) console.log('       ctx: ' + String(f.ctx).slice(0, 300));
    });
    if (g.fails.length > 25) console.log('     • ... và ' + (g.fails.length - 25) + ' lỗi khác');
  }
}

const eng = groups.find(g => g.group === 'ENGINE');
if (eng && eng.samples && eng.samples.length) {
  console.log('\nVí dụ câu hỏi sinh ra:');
  eng.samples.forEach(s => console.log('   · ' + s));
}

console.log('\n----------------------------------------------------');
console.log(`TỔNG: ${totalChecks} phép kiểm · ${totalFails} lỗi · ` + (hadFail ? '❌ CÓ FAIL' : '✅ TẤT CẢ PASS'));
console.log('----------------------------------------------------');

process.exit(hadFail ? 1 : 0);

/*
 * drive.mjs — Test tự động cho "Ôn Hôm Nay" (sổ từ vựng + ôn giãn cách).
 * Chạy:  node tests/drive.mjs
 * Chèn kịch bản test vào index.html -> _drive.html ở THƯ MỤC GỐC app (index.html
 * dùng đường dẫn tương đối), mở bằng Chrome headless --dump-dom rồi đọc kết quả.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = path.join(ROOT, '_drive.html');

const TEST = `
<div id="TESTOUT" style="display:none"></div>
<script>
(function(){
  var L=[],P=0,F=0;
  function ok(c,m,x){ if(c){P++;L.push('PASS '+m);} else {F++;L.push('FAIL '+m+(x!==undefined?' | '+JSON.stringify(x).slice(0,150):''));} }
  function q(s){ return document.querySelector(s); }
  function qa(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function txt(s){ var n=q(s); return n?(n.textContent||'').trim():''; }
  var steps=[],si=0;
  function step(f){ steps.push(f); }
  function run(){ if(si>=steps.length){ fin(); return; } var f=steps[si++]; try{ f(); }catch(e){ F++; L.push('FAIL bước '+si+' ném lỗi: '+e.message); } setTimeout(run,80); }
  function fin(){ document.getElementById('TESTOUT').textContent='@@'+JSON.stringify({pass:P,fail:F,lines:L})+'@@'; }

  /* --- 0. dọn sạch để test từ trạng thái trắng --- */
  step(function(){
    localStorage.removeItem('onhomnay.words.v1');
    window.Vocab.reload();
    location.hash='on';
  });

  /* --- 1. trạng thái rỗng --- */
  step(function(){
    ok(!!window.Vocab,'vocab.js đã nạp');
    ok(qa('.tab').length===3,'có 3 tab',{n:qa('.tab').length});
    ok(txt('#review').indexOf('Sổ từ còn trống')>=0,'sổ rỗng -> mời thêm từ',{t:txt('#review').slice(0,60)});
    ok(txt('#stat-line').indexOf('còn trống')>=0,'dòng thống kê báo sổ trống');
  });

  /* --- 2. thêm 1 từ bằng form --- */
  step(function(){
    location.hash='them';
  });
  step(function(){
    q('#f-word').value='apple';
    q('#f-mean').value='quả táo';
    q('#f-ex').value='I eat an apple.';
    q('#form-add').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  });
  step(function(){
    ok(window.Vocab.count()===1,'đã thêm 1 từ',{n:window.Vocab.count()});
    ok(!q('#flash').hidden && txt('#flash').indexOf('Đã thêm')>=0,'có báo thêm thành công',{t:txt('#flash')});
    ok(q('#f-word').value==='','ô nhập được xoá để gõ từ tiếp theo');
    var w=window.Vocab.get('apple');
    ok(!!w && w.vi==='quả táo' && w.ex==='I eat an apple.','lưu đúng nghĩa + ví dụ');
    ok(w.b===0 && w.d===window.Vocab.today(),'từ mới đến hạn ôn NGAY hôm nay',{b:w.b});
  });

  /* --- 3. thêm trùng --- */
  step(function(){
    q('#f-word').value='Apple';    // khác hoa/thường -> vẫn phải coi là trùng
    q('#f-mean').value='quả táo';
    q('#form-add').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  });
  step(function(){
    ok(window.Vocab.count()===1,'không thêm từ trùng (không phân biệt hoa/thường)',{n:window.Vocab.count()});
    ok(txt('#flash').indexOf('đã có')>=0,'báo từ đã có',{t:txt('#flash')});
  });

  /* --- 4. dán hàng loạt, nhiều kiểu dấu ngăn --- */
  step(function(){
    q('#f-word').value=''; q('#f-mean').value='';
    q('#f-bulk').value='book = quyển sách\\nhappy - vui vẻ\\nrainy : trời mưa - It is rainy today.\\nchair\\tcái ghế\\nDÒNG SAI KHÔNG CÓ NGHĨA';
    q('#btn-bulk').click();
  });
  step(function(){
    ok(window.Vocab.count()===5,'dán hàng loạt thêm được 4 từ (tổng 5)',{n:window.Vocab.count()});
    ok(!!window.Vocab.get('book') && !!window.Vocab.get('happy'),'nhận dấu = và -');
    ok(!!window.Vocab.get('rainy') && !!window.Vocab.get('chair'),'nhận dấu : và TAB');
    var r=window.Vocab.get('rainy');
    ok(r && r.ex.indexOf('rainy today')>=0,'lấy được cột ví dụ thứ 3',{ex:r?r.ex:''});
    ok(txt('#flash').indexOf('chưa đúng mẫu')>=0,'báo dòng sai mẫu',{t:txt('#flash')});
  });

  /* --- 5. sổ từ: liệt kê + tìm kiếm --- */
  step(function(){ location.hash='so'; });
  step(function(){
    ok(qa('#list .wrow').length===5,'sổ từ liệt kê đủ 5 từ',{n:qa('#list .wrow').length});
    ok(qa('#list .wrow .boxes').length===5,'mỗi từ có chỉ báo 5 hộp');
    ok(txt('#list').indexOf('cần ôn hôm nay')>=0,'có từ được đánh dấu cần ôn hôm nay');
    q('#f-search').value='táo';
    q('#f-search').dispatchEvent(new Event('input',{bubbles:true}));
  });
  step(function(){
    ok(qa('#list .wrow').length===1,'tìm theo NGHĨA tiếng Việt ra 1 kết quả',{n:qa('#list .wrow').length});
    q('#f-search').value='';
    q('#f-search').dispatchEvent(new Event('input',{bubbles:true}));
  });

  /* --- 6. ôn hôm nay: thang leo + chấm + lên hộp --- */
  step(function(){ location.hash='on'; });
  step(function(){
    ok(txt('#review').indexOf('Thẻ 1/5')>=0,'màn ôn có 5 thẻ đến hạn',{t:txt('.rc-prog')});
    ok(qa('#review .opt').length===4,'hộp 0 (≥4 từ) -> hỏi kiểu chọn nghĩa, 4 phương án',{n:qa('#review .opt').length});
    ok(!!q('#review .word-big'),'hộp 0 hiện TỪ tiếng Anh để chọn nghĩa');
  });
  step(function(){
    // chọn đúng nghĩa của từ đang hỏi
    var w=txt('#review .word-big');
    var want=window.Vocab.get(window.Vocab.normId(w)).vi;
    var hit=qa('#review .opt').filter(function(b){return b.textContent.trim()===want;})[0];
    ok(!!hit,'tìm được phương án đúng trong danh sách',{w:w,want:want});
    if(hit) hit.click();
  });
  step(function(){
    var fb=q('#review .rc-fb');
    ok(fb && !fb.hidden,'trả lời xong -> phản hồi ngay');
    ok(fb.className.indexOf('good')>=0,'chọn đúng -> phản hồi xanh',{c:fb.className});
    ok(txt('#review .fb-ans').length>3,'phản hồi hiện lại từ + nghĩa');
    ok(txt('#review').indexOf('Lên hộp 2')>=0,'đúng -> lên hộp 2',{t:txt('#review .rc-fb')});
    q('#review .rc-act .btn').click();
  });
  step(function(){
    ok(txt('#review .rc-prog').indexOf('Thẻ 2/5')>=0,'sang được thẻ 2',{t:txt('#review .rc-prog')});
    // thẻ 2: cố tình bấm "Chưa nhớ, xem đáp án"
    var sk=qa('#review .rc-act .btn').filter(function(b){return b.textContent.indexOf('Chưa nhớ')>=0;})[0];
    var op=q('#review .opt');
    if(sk) sk.click(); else if(op) op.click();
  });
  step(function(){
    ok(!q('#review .rc-fb').hidden,'thẻ 2 cũng có phản hồi');
    q('#review .rc-act .btn').click();
  });

  /* --- 7. chạy hết phiên --- */
  step(function(){
    // LƯU Ý: thẻ dạng "chọn nghĩa" khi CHƯA trả lời thì .rc-act rỗng,
    // nên không được lấy sự tồn tại của .rc-act .btn làm điều kiện lặp.
    var guard=0;
    while(guard++<40){
      if(txt('#review').indexOf('Xong rồi')>=0) break;
      var nx=qa('#review .rc-act .btn').filter(function(b){return b.textContent.indexOf('→')>=0;})[0];
      if(nx){ nx.click(); continue; }
      var sk=qa('#review .rc-act .btn').filter(function(b){return b.textContent.indexOf('Chưa nhớ')>=0;})[0];
      if(sk){ sk.click(); continue; }
      var op=q('#review .opt');
      if(op){ op.click(); continue; }
      break;
    }
  });
  step(function(){
    ok(txt('#review').indexOf('Xong rồi')>=0,'chạy hết phiên -> màn tổng kết',{t:txt('#review').slice(0,80)});
    ok(txt('#review').indexOf('Em vừa ôn')>=0,'tổng kết báo số từ đã ôn');
  });

  /* --- 8. lịch ôn đã được cập nhật --- */
  step(function(){
    var a=window.Vocab.all();
    var moved=a.filter(function(r){return r.it.d>window.Vocab.today();});
    ok(moved.length===5,'cả 5 từ đã được hẹn ngày ôn sau',{n:moved.length});
    var app=window.Vocab.get('apple');
    ok(app.s>=1,'có ghi số lần gặp',{s:app.s});
    ok(window.Vocab.countDue()===0,'hôm nay không còn từ đến hạn',{n:window.Vocab.countDue()});
    // bấm lại tab đang mở — phải render lại (không được đứng ở màn tổng kết)
    qa('.tab').filter(function(t){return t.dataset.go==='on';})[0].click();
  });
  step(function(){
    ok(txt('#review').indexOf('không có từ nào cần ôn')>=0,'màn ôn báo hết thẻ, không ép học thêm',
       {t:txt('#review').slice(0,80)});
    ok(txt('#review').indexOf('nghỉ ngơi')>=0 || txt('#review').indexOf('Mai Pi nhắc')>=0,'lời nhắn nhẹ nhàng, không tạo áp lực');
  });

  /* --- 9. sao lưu + xoá --- */
  step(function(){
    var js=window.Vocab.exportJson();
    ok(js.indexOf('apple')>=0,'xuất được JSON sao lưu');
    var before=window.Vocab.count();
    window.Vocab.remove('apple');
    ok(window.Vocab.count()===before-1,'xoá được một từ',{n:window.Vocab.count()});
    var r=window.Vocab.importJson(js,true);
    ok(r.ok && window.Vocab.count()===before,'nhập lại từ file sao lưu khôi phục đủ từ',{n:window.Vocab.count()});
  });

  /* --- 10. sạch sẽ --- */
  step(function(){
    ok(txt('#badge-count').length>0,'tab Sổ từ hiện số lượng',{t:txt('#badge-count')});
    var html=document.getElementById('view-them').innerHTML.toLowerCase();
    ok(html.indexOf('streak')<0 && html.indexOf('đếm ngược')<0,'không có streak / đếm ngược');
    localStorage.removeItem('onhomnay.words.v1');
  });

  setTimeout(run,250);
})();
<\/script>
`;

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
// replacer FUNCTION: nếu truyền chuỗi, "$$"/"$&" trong test sẽ bị String.replace diễn giải.
html = html.replace('</body>', function () { return TEST + '</body>'; });
fs.writeFileSync(OUT, html, 'utf8');

const url = 'file:///' + OUT.replace(/\\/g, '/');
let dom = '';
try {
  dom = execFileSync(CHROME, ['--headless', '--disable-gpu', '--no-sandbox', '--dump-dom',
    '--virtual-time-budget=25000', url],
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
} catch (e) {
  console.error('Chrome lỗi:', e.message);
  process.exit(2);
}

const m = /@@(\{[\s\S]*?\})@@/.exec(dom);
if (!m) {
  console.error('KHÔNG đọc được kết quả — app có thể ném lỗi lúc khởi động.');
  const err = /Uncaught[^<]{0,200}/.exec(dom);
  if (err) console.error('  ', err[0]);
  process.exit(2);
}
const r = JSON.parse(m[1]);
r.lines.forEach((l) => console.log((l.startsWith('PASS') ? '  ✓ ' : '  ✗ ') + l.slice(5)));
console.log(`\n=== ${r.pass} PASS · ${r.fail} FAIL ===`);
try { fs.unlinkSync(OUT); } catch (e) {}
process.exit(r.fail ? 1 : 0);

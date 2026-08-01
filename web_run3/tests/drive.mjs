/*
 * drive.mjs — Test tự động cho "Ngữ Pháp Vui 3" (chấm từng câu · SRS · chant).
 * Cách chạy:  node tests/drive.mjs
 *
 * Cách làm: chèn một kịch bản test vào cuối index.html -> tests/_drive.html,
 * mở bằng Chrome headless (--dump-dom) rồi đọc kết quả in ra trong DOM.
 * Không cần thư viện ngoài, không cần server (chạy file://).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
// PHẢI đặt ở thư mục gốc của app: index.html dùng đường dẫn TƯƠNG ĐỐI
// (data/content.js, js/app.js…), để trong tests/ là nạp trượt hết.
const OUT = path.join(ROOT, '_drive.html');

const TEST = `
<div id="TESTOUT" style="display:none"></div>
<script>
(function(){
  var L=[], P=0, F=0;
  function ok(c,m,x){ if(c){P++;L.push('PASS '+m);} else {F++;L.push('FAIL '+m+(x!==undefined?' | '+JSON.stringify(x).slice(0,140):''));} }
  function $(s,r){ return (r||document).querySelector(s); }
  function $$(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }
  function txt(s){ var n=$(s); return n?(n.textContent||'').trim():''; }
  function go(h){ location.hash=h; }
  var steps=[], si=0;
  function step(f){ steps.push(f); }
  function run(){ if(si>=steps.length){ finish(); return; } var f=steps[si++]; try{ f(); }catch(e){ F++; L.push('FAIL bước '+si+' ném lỗi: '+e.message); } setTimeout(run, 90); }
  function finish(){
    var o=document.getElementById('TESTOUT');
    o.textContent='@@'+JSON.stringify({pass:P,fail:F,lines:L})+'@@';
    document.title='DONE';
  }

  /* ---------- 1. Trang chủ ---------- */
  step(function(){
    ok($$('.card').length===20,'trang chủ có 20 unit',{n:$$('.card').length});
    ok($$('.ex-btn').length===60,'trang chủ có 60 bài',{n:$$('.ex-btn').length});
    ok(txt('#stat').indexOf('0/60')>=0,'thống kê 0/60',{t:txt('#stat')});
    ok($$('.chant-link').length===20,'mỗi unit có nút Đọc theo nhịp',{n:$$('.chant-link').length});
    ok(txt('#review-bar').length>0,'dải Ôn hôm nay có nội dung');
    ok(!!window.SRS && !!window.Say,'srs.js + say.js đã nạp');
  });

  /* ---------- 2. dropdown: sai -> gợi ý -> sửa lại -> xong ---------- */
  step(function(){ go('u2/2_1'); });
  step(function(){
    var sels=$$('#panel select.dd');
    ok(sels.length===6,'u2/2_1 có 6 ô chọn',{n:sels.length});
    // cố tình bỏ trống hết -> sai tất
    $$('#panel .act .btn')[0].click();
  });
  step(function(){
    var hb=$('#panel ~ .hintbox') || $('.hintbox');
    ok(hb && !hb.hidden,'sai lần 1 -> hiện hộp gợi ý');
    ok((hb?hb.textContent:'').indexOf('mách nhỏ')>=0,'gợi ý có lời dẫn của Pi');
    ok((hb?hb.textContent:'').length>80,'gợi ý có nội dung quy tắc',{len:(hb?hb.textContent.length:0)});
    var btn=$$('.act .btn')[0];
    ok(btn.textContent==='Kiểm tra lại','nút đổi thành "Kiểm tra lại"',{t:btn.textContent});
    ok($$('#panel select.dd:disabled').length===0,'chưa khoá ô nào -> còn sửa được');
    ok($$('#panel .ans').length===0,'sai lần 1 KHÔNG lộ đáp án');
  });
  step(function(){
    // giờ chọn đúng hết
    var D=window.GRAMMAR3.units.filter(function(u){return u.unit===2;})[0]
          .exercises.filter(function(e){return e.file==='2_1';})[0].data;
    var want=[]; D.lines.forEach(function(l){ l.forEach(function(t){ if(t.dd) want.push(t.dd.answer); }); });
    $$('#panel select.dd').forEach(function(s,i){ s.value=String(want[i]); });
    $$('.act .btn')[0].click();
  });
  step(function(){
    var r=txt('.result');
    ok(r.indexOf('Lần đầu đúng 0/6')>=0,'điểm ghi theo LẦN ĐẦU (0/6), không phải sau khi sửa',{r:r});
    ok(r.indexOf('sau khi sửa: 6/6')>=0,'có hiện điểm sau khi sửa',{r:r});
    ok($$('#panel select.dd:disabled').length===6,'chấm xong -> khoá lại');
    var st=window.SRS.stats();
    ok(st.total>=6,'SRS đã nhận 6 thẻ từ bài này',{st:st});
  });

  /* ---------- 3. mcq: đúng ngay lần đầu ---------- */
  step(function(){ go('u1/1_2'); });
  step(function(){
    var Q=window.GRAMMAR3.units[0].exercises.filter(function(e){return e.file==='1_2';})[0].data.questions;
    $$('#panel .q').forEach(function(box,qi){
      var opts=$$('.opt',box); if(opts[Q[qi].answer]) opts[Q[qi].answer].click();
    });
    $$('.act .btn')[0].click();
  });
  step(function(){
    var r=txt('.result');
    ok(r.indexOf('Lần đầu đúng 4/4')>=0,'mcq đúng hết lần đầu -> 4/4',{r:r});
    ok(r.indexOf('Tuyệt vời')>=0,'có lời khen khi trọn điểm');
    ok($('.hintbox')===null || $('.hintbox').hidden,'đúng hết thì không hiện gợi ý');
  });

  /* ---------- 4. gapfill gõ tay ---------- */
  step(function(){ go('u1/1_1'); });
  step(function(){
    var D=window.GRAMMAR3.units[0].exercises.filter(function(e){return e.file==='1_1';})[0].data;
    var ans=[]; D.lines.forEach(function(l){ l.forEach(function(t){ if(t.gap!==undefined) ans.push(t.gap); }); });
    $$('#panel input.gap').forEach(function(inp,i){ inp.value=ans[i]; });
    $$('.act .btn')[0].click();
  });
  step(function(){
    ok(txt('.result').indexOf('Lần đầu đúng 6/6')>=0,'gapfill gõ đúng -> 6/6',{r:txt('.result')});
  });

  /* ---------- 5. matching (nối câu) ---------- */
  step(function(){ go('u2/2_2'); });
  step(function(){
    var n=$$('#panel .mcol.left .mitem').length;
    ok(n===5,'matching có 5 cặp',{n:n});
    // Nối câu chỉ nghe pointerdown/pointerup và keydown Enter — .click() KHÔNG kích hoạt.
    function press(el){ el.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})); }
    $$('#panel .mcol.left .mitem').forEach(function(L){
      var p=L.dataset.p;
      var R=$('#panel .mcol.right .mitem[data-p="'+p+'"]');
      press(L); if(R) press(R);
    });
    $$('.act .btn')[0].click();
  });
  step(function(){
    ok(txt('.result').indexOf('Lần đầu đúng 5/5')>=0,'matching nối đúng -> 5/5',{r:txt('.result')});
  });

  /* ---------- 6. group (phân nhóm) ---------- */
  step(function(){ go('u4/4_2'); });
  step(function(){
    var G=window.GRAMMAR3.units.filter(function(u){return u.unit===4;})[0]
          .exercises.filter(function(e){return e.file==='4_2';})[0].data.groups;
    var where={}; G.forEach(function(g,gi){ g.items.forEach(function(w){ where[String(w)]=gi; }); });
    var zones=$$('#panel .zone');
    $$('#panel .tray .item').forEach(function(it){
      var gi=where[it.textContent];
      it.click();
      if(zones[gi]) zones[gi].click();
    });
    $$('.act .btn')[0].click();
  });
  step(function(){
    ok(txt('.result').indexOf('Lần đầu đúng 8/8')>=0,'group xếp đúng -> 8/8',{r:txt('.result')});
  });

  /* ---------- 7. Ôn hôm nay (SRS + thang leo) ---------- */
  step(function(){
    // ép vài thẻ đến hạn hôm nay để kiểm màn ôn
    var raw=JSON.parse(localStorage.getItem('nguphap3.srs.v1'));
    var ids=Object.keys(raw.cards).slice(0,5);
    var today=Math.floor(Date.now()/864e5);
    ids.forEach(function(id,i){ raw.cards[id].d=today; raw.cards[id].b=i%4; });
    localStorage.setItem('nguphap3.srs.v1', JSON.stringify(raw));
    window.SRS.reload();                       // SRS giữ dữ liệu trong bộ nhớ -> phải nạp lại
    ok(ids.length===5,'chuẩn bị 5 thẻ đến hạn');
    ok(window.SRS.todayCount()===5,'SRS thấy 5 thẻ đến hạn',{n:window.SRS.todayCount()});
    go('home');
  });
  step(function(){
    ok(txt('#review-bar').indexOf('Ôn hôm nay')>=0,'trang chủ hiện nút Ôn hôm nay',{t:txt('#review-bar')});
    go('review');
  });
  step(function(){
    var q=$('#review-panel .rc-q');
    ok(!!q,'màn ôn hiện thẻ đầu tiên');
    ok(txt('#review-panel .rc-prog').indexOf('Thẻ 1/')>=0,'có bộ đếm thẻ',{t:txt('#review-panel .rc-prog')});
    var zone=$('#review-panel .rc-zone');
    var hasChoose=$$('.opt',zone).length>0;
    var hasLetters=$$('.rc-letter',zone).length>0;
    var hasInput=!!$('.rc-input',zone);
    ok(hasChoose||hasLetters||hasInput,'thẻ render được 1 trong 3 tầng độ khó',
       {choose:hasChoose,letters:hasLetters,input:hasInput});
  });
  step(function(){
    // trả lời sai cố ý bằng nút "Chưa nhớ" (nếu có) hoặc chọn bừa
    var skip=$$('#review-panel .rc-act .btn').filter(function(b){return b.textContent.indexOf('Chưa nhớ')>=0;})[0];
    if(skip) skip.click();
    else { var o=$('#review-panel .opt'); if(o) o.click(); }
  });
  step(function(){
    var fb=$('#review-panel .rc-fb');
    ok(fb && !fb.hidden,'trả lời xong -> hiện phản hồi ngay');
    ok((fb?fb.textContent:'').length>10,'phản hồi có nội dung (đáp án/lời khen)');
    var nx=$$('#review-panel .rc-act .btn')[0];
    ok(!!nx,'có nút sang thẻ tiếp theo');
    nx.click();
  });
  step(function(){
    ok(txt('#review-panel .rc-prog').indexOf('Thẻ 2/')>=0 || !!$('#review-panel .rc-done'),
       'chuyển được sang thẻ 2',{t:txt('#review-panel .rc-prog')});
  });

  /* ---------- 8. Đọc theo nhịp ---------- */
  step(function(){ go('chant/1'); });
  step(function(){
    var rows=$$('#chant-panel .chant-row');
    ok(rows.length>0,'chant có câu để đọc',{n:rows.length});
    ok(rows.length<=6,'chant giới hạn ≤6 câu (bài ngắn)',{n:rows.length});
    var btns=$$('#chant-panel .act .btn');
    ok(btns.length>=3,'chant có nút Vòng 1 / Vòng 2 / Dừng',{n:btns.length});
    ok(btns[1].textContent.indexOf('Giấu bớt')>=0,'có vòng 2 giấu bớt từ',{t:btns[1].textContent});
    btns[1].click();   // vòng 2: che từ
  });
  step(function(){
    ok($$('#chant-panel .chant-mask').length>0,'vòng 2 có che từ để trẻ nhớ lại',
       {n:$$('#chant-panel .chant-mask').length});
    $$('#chant-panel .act .btn')[2].click();  // dừng
  });

  /* ---------- 9. Pi + không rò rỉ ---------- */
  step(function(){
    ok(!!document.getElementById('pi'),'có linh vật Pi');
    ok(document.getElementById('pi').className.indexOf('is-')>=0,'Pi có biểu cảm');
    // ghép chuỗi từ mảnh để CHÍNH bài test không làm bẩn DOM đang kiểm
    var bad=['pear'+'son','round'+' up','nr'+'u3'];
    var html=(document.getElementById('view-home').innerHTML+' '+document.title).toLowerCase();
    var hit=bad.filter(function(w){return html.indexOf(w)>=0;});
    ok(hit.length===0,'không lộ dấu vết bản quyền',{hit:hit});
  });

  setTimeout(run, 260);
})();
<\/script>
`;

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
// PHẢI dùng replacer FUNCTION: nếu truyền chuỗi, String.replace sẽ hiểu "$$" trong
// kịch bản test là ký tự "$" thoát -> mọi $$(...) biến thành $(...) và ghi đè hàm $.
html = html.replace('</body>', function () { return TEST + '</body>'; });
fs.writeFileSync(OUT, html, 'utf8');

const url = 'file:///' + OUT.replace(/\\/g, '/');
let dom = '';
try {
  dom = execFileSync(CHROME, [
    '--headless', '--disable-gpu', '--no-sandbox', '--dump-dom',
    '--virtual-time-budget=25000', url
  ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
} catch (e) {
  console.error('Chrome lỗi:', e.message);
  process.exit(2);
}

const m = /@@(\{[\s\S]*?\})@@/.exec(dom);
if (!m) {
  console.error('KHÔNG đọc được kết quả test — app có thể ném lỗi lúc khởi động.');
  const err = /Uncaught[^<]{0,200}/.exec(dom);
  if (err) console.error('  ', err[0]);
  process.exit(2);
}
const r = JSON.parse(m[1]);
r.lines.forEach((l) => console.log((l.startsWith('PASS') ? '  ✓ ' : '  ✗ ') + l.slice(5)));
console.log(`\n=== ${r.pass} PASS · ${r.fail} FAIL ===`);
try { fs.unlinkSync(OUT); } catch (e) {}
process.exit(r.fail ? 1 : 0);

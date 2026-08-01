/*
 * drive.mjs — Test tự động cho "Ôn Hôm Nay" (sổ từ + tra nghĩa + ôn nghe-trước).
 * Chạy:  node tests/drive.mjs
 *
 * Hai chỗ chèn:
 *   1) TRƯỚC các script của app: giả lập giọng đọc (headless không có giọng EN thật)
 *      -> test được đường chính "nghe trước, giấu từ và nghĩa".
 *   2) TRƯỚC </body>: kịch bản test, kết quả đọc lại bằng --dump-dom.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
// tên riêng theo tiến trình: chạy hai lượt cùng lúc không ghi đè file của nhau
const OUT = path.join(ROOT, '_drive_' + process.pid + '.html');

// Giả lập Web Speech: app coi như máy CÓ giọng tiếng Anh.
// LƯU Ý: window.speechSynthesis là thuộc tính CHỈ ĐỌC trên Window -> gán thẳng
// (window.speechSynthesis = ...) sẽ bị bỏ qua âm thầm. Phải defineProperty.
const VOICE_STUB = `<script>
  window.__spoke = [];
  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    value: {
      getVoices: function(){ return [{lang:'en-GB', name:'Test EN', voiceURI:'test'}]; },
      speak: function(u){ window.__spoke.push(u && u.text); if(u && u.onend) setTimeout(u.onend, 0); },
      cancel: function(){},
      addEventListener: function(){}
    }
  });
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    configurable: true,
    value: function(t){ this.text = t; }
  });
<\/script>`;

const TEST = `
<div id="TESTOUT" style="display:none"></div>
<script>
(function(){
  var L=[],P=0,F=0;
  function ok(c,m,x){ if(c){P++;L.push('PASS '+m);} else {F++;L.push('FAIL '+m+(x!==undefined?' | '+JSON.stringify(x).slice(0,160):''));} }
  function q(s){ return document.querySelector(s); }
  function qa(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function txt(s){ var n=q(s); return n?(n.textContent||'').trim():''; }
  var steps=[],si=0;
  function step(f){ steps.push(f); }
  function run(){ if(si>=steps.length){ fin(); return; } var f=steps[si++]; try{ f(); }catch(e){ F++; L.push('FAIL bước '+si+' ném lỗi: '+e.message); } setTimeout(run,70); }
  function fin(){ document.getElementById('TESTOUT').textContent='@@'+JSON.stringify({pass:P,fail:F,lines:L})+'@@'; }
  function tab(n){ qa('.tab').filter(function(t){return t.dataset.go===n;})[0].click(); }
  // Chờ tới khi điều kiện đúng (FileReader là bất đồng bộ, chờ cứng theo số bước không đáng tin).
  function waitFor(cond, label){
    var tries=0;
    function s(){
      try { if (cond()) return; } catch(e) {}
      if (++tries>40){ F++; L.push('FAIL quá hạn chờ: '+label); return; }
      steps.splice(si, 0, s);          // chèn lại chính nó để chạy ở lượt kế tiếp
    }
    step(s);
  }

  step(function(){
    localStorage.removeItem('onhomnay.words.v1');
    window.Vocab.reload();
    tab('on');
  });

  /* ---------- 1. từ điển nhúng ---------- */
  step(function(){
    ok(!!window.DICT,'từ điển đã nhúng');
    ok(window.Vocab.dictSize()>300,'từ điển có >300 từ',{n:window.Vocab.dictSize()});
    var f=window.Vocab.lookup('apple');
    ok(f && f.vi,'tra được "apple"',{f:f});
    ok(f && f.ex,'tra kèm câu ví dụ',{ex:f?f.ex:''});
    // dạng biến đổi
    ok(!!window.Vocab.lookup('apples'),'tra được số nhiều "apples"');
    ok(!!window.Vocab.lookup('running'),'tra được "running" -> run');
    ok(!!window.Vocab.lookup('cities'),'tra được "cities" -> city');
    ok(window.Vocab.lookup('zzzqqq')===null,'từ không có thì trả null');
  });

  /* ---------- 2. dán DANH SÁCH TỪ (không kèm nghĩa) -> máy tự tra ---------- */
  step(function(){ tab('them'); });
  step(function(){
    ok(txt('#dict-size').length>0,'có hiện số từ trong từ điển',{t:txt('#dict-size')});
    q('#f-bulk').value='apple\\nbook\\nhappy, rainy, chair\\nzzzqqq\\nkite = con diều';
    q('#btn-scan').click();
  });
  step(function(){
    ok(!q('#preview').hidden,'hiện bảng xem lại');
    var rows=qa('#preview .prow');
    ok(rows.length===7,'nhận ra 7 từ (kể cả dòng ngăn bằng dấu phẩy)',{n:rows.length});
    var found=qa('#preview .tag.ok').length;
    ok(found>=5,'tự tìm được nghĩa cho ít nhất 5 từ',{n:found});
    ok(qa('#preview .tag.miss').length===1,'đúng 1 từ lạ bị đánh dấu chưa có nghĩa',
       {n:qa('#preview .tag.miss').length});
    var inputs=qa('#preview .pvi');
    ok(inputs[0].value.length>0,'ô nghĩa được điền sẵn từ từ điển',{v:inputs[0].value});
    ok(qa('#preview .pex')[0].value.length>0,'ô ví dụ cũng được điền sẵn');
    ok(txt('#btn-commit').indexOf('6 từ')>=0,'nút Thêm đếm đúng 6 từ đã có nghĩa',{t:txt('#btn-commit')});
  });
  step(function(){
    // điền nghĩa cho từ lạ rồi thêm tất cả
    var rows=qa('#preview .prow');
    var missRow=rows.filter(function(r){return r.querySelector('.tag.miss');})[0];
    var inp=missRow.querySelector('.pvi');
    inp.value='từ thử nghiệm';
    inp.dispatchEvent(new Event('input',{bubbles:true}));
    q('#btn-commit').click();
  });
  step(function(){
    ok(window.Vocab.count()===7,'đã thêm đủ 7 từ vào sổ',{n:window.Vocab.count()});
    var a=window.Vocab.get('apple');
    ok(a && a.vi.length>0 && a.ex.length>0,'từ lấy từ từ điển có cả nghĩa lẫn ví dụ',{a:a});
    ok(window.Vocab.get('kite').vi==='con diều','dòng tự cho nghĩa vẫn dùng nghĩa của người dùng');
    ok(window.Vocab.get('zzzqqq').vi==='từ thử nghiệm','từ lạ dùng nghĩa em vừa điền');
    ok(q('#preview').hidden,'thêm xong thì đóng bảng xem lại');
    ok(q('#f-bulk').value==='','ô dán được xoá sạch');
  });

  /* ---------- 2b. NHẬP BẢNG CSV (đúng định dạng file người dùng) ---------- */
  step(function(){
    var CSV = [
      '"Từ vựng","Loại từ","Phiên âm","Nghĩa tiếng Việt","Tần suất","Cụm đi kèm","Ví dụ","Nguồn"',
      '"deadline","(n) danh từ","/ˈdedlaɪn/","hạn chót nộp","3","meet a deadline; extend a deadline","Isn\\'t the registration deadline tomorrow?","2026 • Đề 5 • Part 2"',
      '"public relations","(phr) cụm từ","/ˈpʌblɪk rɪˈleɪʃnz/","quan hệ công chúng (PR)","1","","Are you considering hiring a public relations firm?","2026 • Đề 3 • Part 2"',
      '"convention","(n) danh từ","/kənˈvenʃn/","hội nghị/triển lãm lớn của ngành","3","convention center; attend a convention","A much larger convention center.","2026 • Đề 6 • Part 2"'
    ].join('\\n');

    ok(window.Vocab.looksTabular(CSV),'nhận ra đây là bảng CSV');
    var rows=window.Vocab.parseTable(CSV);
    ok(rows.length===3,'đọc được 3 dòng',{n:rows.length});
    var r0=rows[0];
    ok(r0.word==='deadline','lấy đúng cột Từ vựng',{w:r0.word});
    ok(r0.vi==='hạn chót nộp','lấy đúng cột Nghĩa tiếng Việt',{vi:r0.vi});
    ok(r0.ipa.indexOf('ded')>=0,'lấy được Phiên âm',{ipa:r0.ipa});
    ok(r0.pos.indexOf('danh từ')>=0,'lấy được Loại từ',{pos:r0.pos});
    ok(r0.col.indexOf('meet a deadline')>=0,'lấy được Cụm đi kèm',{col:r0.col});
    ok(r0.ex.indexOf('registration')>=0,'lấy được Ví dụ (có dấu nháy trong câu)',{ex:r0.ex});
    ok(r0.src.indexOf('Đề 5')>=0,'lấy được Nguồn',{src:r0.src});
    ok(rows[1].word==='public relations','giữ nguyên từ có 2 tiếng');
    ok(rows[2].vi.indexOf('triển lãm')>=0,'ô có dấu / vẫn đúng');

    // đi đúng đường người dùng: dán cả bảng vào ô rồi bấm "Nhận dạng"
    q('#f-bulk').value = CSV;
    q('#btn-scan').click();
  });
  step(function(){
    ok(qa('#preview .prow').length===3,'bảng xem lại hiện 3 dòng CSV',{n:qa('#preview .prow').length});
    ok(qa('#preview .ipa').length===3,'hiện phiên âm trong bảng xem lại',{n:qa('#preview .ipa').length});
    ok(qa('#preview .tag.pos').length===3,'hiện loại từ trong bảng xem lại');
    ok(qa('#preview .tag.miss').length===0,'từ CSV đã có nghĩa thì KHÔNG bị báo "chưa có nghĩa"',
       {n:qa('#preview .tag.miss').length});
    ok(qa('#preview .tag.ok').length===3,'cả 3 dòng được đánh dấu đã có nghĩa');
    q('#btn-commit').click();
  });
  step(function(){
    ok(window.Vocab.count()===10,'sổ có thêm 3 từ từ CSV (7+3)',{n:window.Vocab.count()});
    var d=window.Vocab.get('deadline');
    ok(d && d.ipa && d.pos && d.col && d.src,'lưu đủ phiên âm / loại từ / cụm đi kèm / nguồn',{d:d});
    ok(d.fq===3,'lưu cả tần suất',{fq:d.fq});
    // xoá 3 từ CSV để phần ôn phía sau vẫn đúng như cũ
    ['deadline','public relations','convention'].forEach(function(id){ window.Vocab.remove(id); });
    ok(window.Vocab.count()===7,'dọn lại còn 7 từ',{n:window.Vocab.count()});
  });

  /* ---------- 2c. NHẬP THẬT QUA Ô CHỌN FILE (không lọc đuôi) ---------- */
  function putFile(inputId, name, content, mime){
    var dt = new DataTransfer();
    dt.items.add(new File([content], name, { type: mime || '' }));
    var inp = document.getElementById(inputId);
    inp.files = dt.files;
    inp.dispatchEvent(new Event('change', { bubbles: true }));
  }

  step(function(){
    ok(!document.getElementById('f-csv').getAttribute('accept'),
       'ô chọn file KHÔNG lọc đuôi (tránh máy báo "không hỗ trợ")');
    ok(!document.getElementById('f-import').getAttribute('accept'),
       'ô nhập ở Sổ từ cũng không lọc đuôi');
  });

  step(function(){
    var CSV='"Từ vựng","Loại từ","Phiên âm","Nghĩa tiếng Việt","Tần suất","Cụm đi kèm","Ví dụ","Nguồn"\\n'
      +'"warehouse","(n) danh từ","/ˈwerhaʊs/","nhà kho, kho hàng","2","","Aren\\'t the windows in the warehouse supposed to be replaced?","2026 • Đề 3 • Part 2"\\n'
      +'"voucher","(n) danh từ","/ˈvaʊtʃər/","phiếu (hoàn tiền, ăn uống)","1","travel voucher; meal voucher","Would you like me to process your travel voucher?","2026 • Đề 6 • Part 2"';
    putFile('f-csv','tu-vung-2026.csv', CSV, 'application/vnd.ms-excel');   // đúng MIME Excel hay gán
  });
  waitFor(function(){ return !q('#preview').hidden && qa('#preview .prow').length===2; },
          'đọc xong file CSV');
  step(function(){
    ok(!q('#preview').hidden,'chọn file .csv -> hiện bảng xem lại');
    ok(qa('#preview .prow').length===2,'đọc được 2 dòng từ file',{n:qa('#preview .prow').length});
    ok(txt('#csv-name').indexOf('tu-vung-2026.csv')>=0,'hiện tên file đã đọc',{t:txt('#csv-name')});
    // nghĩa nằm trong input.value -> phải đọc value, textContent không thấy
    var vals=qa('#preview .pvi').map(function(i){return i.value;}).join(' | ');
    ok(vals.indexOf('nhà kho')>=0,'lấy đúng nghĩa tiếng Việt từ file',{vals:vals});
    q('#btn-commit').click();
  });
  step(function(){
    ok(window.Vocab.count()===9,'đã thêm 2 từ từ file (7+2)',{n:window.Vocab.count()});
    ok(window.Vocab.get('warehouse').ipa.indexOf('werha')>=0,'giữ được phiên âm khi nhập qua file');
    ['warehouse','voucher'].forEach(function(id){ window.Vocab.remove(id); });
  });

  step(function(){
    // file danh sách từ thường (.txt) — cũng phải nhận
    putFile('f-csv','danhsach.txt','elephant\\nmonkey');
  });
  waitFor(function(){ return !q('#preview').hidden && qa('#preview .prow').length===2; },
          'đọc xong file .txt');
  step(function(){
    ok(qa('#preview .prow').length===2,'file .txt danh sách từ cũng nhận',{n:qa('#preview .prow').length});
    var v2=qa('#preview .pvi').map(function(i){return i.value;}).join(' | ');
    ok(v2.indexOf('con voi')>=0,'tự tra nghĩa cho từ trong file .txt',{vals:v2});
    q('#btn-cancel').click();
  });

  step(function(){
    // bản sao lưu .json thả vào ô CSV -> phải tự nhận ra là sao lưu
    var backup=window.Vocab.exportJson();
    window.Vocab.remove('apple');
    putFile('f-csv','sao-luu.json', backup, 'application/json');
  });
  waitFor(function(){ return window.Vocab.count()===7; }, 'khôi phục xong bản sao lưu');
  step(function(){
    ok(window.Vocab.count()===7,'thả file .json vào ô CSV vẫn khôi phục được sổ',{n:window.Vocab.count()});
    ok(txt('#csv-name').indexOf('sao lưu')>=0,'báo rõ đây là bản sao lưu',{t:txt('#csv-name')});
  });

  /* ---------- 3. ÔN: nghe trước, KHÔNG lộ từ lẫn nghĩa ---------- */
  step(function(){ tab('on'); });
  step(function(){
    ok(!!q('#review .hear'),'thẻ ôn có nút NGHE lớn');
    ok(txt('#review .hear-lbl').indexOf('Nghe rồi')>=0,'có lời dẫn "Nghe rồi…"',{t:txt('#review .hear-lbl')});
    ok(!q('#review .word-big'),'KHÔNG hiện từ tiếng Anh khi đang hỏi');
    ok(!q('#review .mean-big'),'KHÔNG hiện nghĩa khi đang hỏi');
    ok(window.__spoke.length>0,'tự đọc từ một lần khi thẻ hiện ra',{n:window.__spoke.length});
    // từ đang hỏi phải nằm trong sổ và KHÔNG được lộ ra text của thẻ
    var spoken=window.__spoke[window.__spoke.length-1];
    ok(txt('#review').toLowerCase().indexOf(String(spoken).toLowerCase())<0,
       'chữ của từ đang hỏi không xuất hiện trên màn hình',{w:spoken});
  });
  step(function(){
    var n=window.__spoke.length;
    q('#review .hear').click();
    ok(window.__spoke.length===n+1,'bấm nút NGHE thì đọc lại');
    var slow=qa('#review .rc-q .btn').filter(function(b){return b.textContent.indexOf('chậm')>=0;})[0];
    ok(!!slow,'có nút nghe chậm');
  });
  step(function(){
    var peek=qa('#review .rc-q .btn').filter(function(b){return b.textContent.indexOf('Gợi ý nghĩa')>=0;})[0];
    if(peek){
      peek.click();
      ok(!!q('#review .peek'),'bấm "Gợi ý nghĩa" thì hé NGHĨA');
      ok(!q('#review .word-big'),'gợi ý nghĩa vẫn KHÔNG lộ từ cần trả lời');
    } else {
      // thẻ dạng chọn nghĩa thì không có nút này
      ok(qa('#review .opt').length>0,'thẻ chọn nghĩa: có các phương án để chọn');
    }
  });

  /* ---------- 4. làm xong mới hiện đủ từ + nghĩa ---------- */
  step(function(){
    var spoken=String(window.__spoke[window.__spoke.length-1]||'');
    var opt=qa('#review .opt');
    if(opt.length){
      var want=window.Vocab.get(window.Vocab.normId(spoken)).vi;
      var hit=opt.filter(function(b){return b.textContent.trim()===want;})[0];
      if(hit) hit.click(); else opt[0].click();
    } else {
      var letters=qa('#review .letter');
      if(letters.length){
        // xếp đúng thứ tự chữ cái của từ đã nghe
        spoken.split('').forEach(function(ch){
          var b=qa('#review .letter').filter(function(x){return !x.disabled && x.textContent===ch;})[0];
          if(b) b.click();
        });
      } else if(q('#review .inp')){
        q('#review .inp').value=spoken;
      }
      var ck=qa('#review .rc-act .btn').filter(function(b){return b.textContent.indexOf('Kiểm tra')>=0;})[0];
      if(ck) ck.click();
    }
  });
  step(function(){
    var fb=q('#review .rc-fb');
    ok(fb && !fb.hidden,'làm xong -> hiện phản hồi');
    var t=txt('#review .fb-ans');
    ok(t.length>3,'phản hồi hiện CẢ từ và nghĩa',{t:t});
    ok(t.indexOf('—')>=0,'định dạng "từ — nghĩa"',{t:t});
  });

  /* ---------- 5. chạy hết phiên + lịch ôn ---------- */
  step(function(){
    var guard=0;
    while(guard++<60){
      if(txt('#review').indexOf('Xong rồi')>=0) break;
      var nx=qa('#review .rc-act .btn').filter(function(b){return b.textContent.indexOf('→')>=0;})[0];
      if(nx){ nx.click(); continue; }
      var sk=qa('#review .rc-act .btn').filter(function(b){return b.textContent.indexOf('Chưa nhớ')>=0;})[0];
      if(sk){ sk.click(); continue; }
      var op=q('#review .opt');
      if(op){ op.click(); continue; }
      break;
    }
    ok(txt('#review').indexOf('Xong rồi')>=0,'chạy hết phiên -> màn tổng kết',{t:txt('#review').slice(0,70)});
    ok(window.Vocab.countDue()===0,'hết từ đến hạn hôm nay',{n:window.Vocab.countDue()});
  });

  /* ---------- 6. sổ từ + sao lưu ---------- */
  step(function(){ tab('so'); });
  step(function(){
    ok(qa('#list .wrow').length===7,'sổ từ liệt kê đủ 7 từ',{n:qa('#list .wrow').length});
    q('#f-search').value='diều';
    q('#f-search').dispatchEvent(new Event('input',{bubbles:true}));
  });
  step(function(){
    ok(qa('#list .wrow').length===1,'tìm theo nghĩa tiếng Việt được',{n:qa('#list .wrow').length});
    var js=window.Vocab.exportJson();
    window.Vocab.remove('apple');
    var r=window.Vocab.importJson(js,true);
    ok(r.ok && window.Vocab.count()===7,'sao lưu & khôi phục đủ từ',{n:window.Vocab.count()});
    localStorage.removeItem('onhomnay.words.v1');
  });

  setTimeout(run,260);
})();
<\/script>
`;

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
// replacer FUNCTION: chuỗi thay thế sẽ nuốt "$$"/"$&" trong kịch bản test.
html = html.replace('<script src="data/dict.js"></script>',
  function () { return VOICE_STUB + '\n<script src="data/dict.js"><\/script>'; });
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

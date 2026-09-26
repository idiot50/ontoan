/* Kịch bản chạy BÊN TRONG trang, trả về bảng kết quả kiểm tra. */
window.__RUN_TEST__ = (async () => {
  const log = [];
  const ok = (name, cond, extra) => log.push({ name, pass: !!cond, extra: extra === undefined ? '' : String(extra) });
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const $ = id => document.getElementById(id);
  const errs = [];
  window.addEventListener('error', e => errs.push(String(e.message)));

  /* ===================== PHẦN NGHE ===================== */
  const spoken = [];
  ok('speechSynthesis có trong trình duyệt', !!window.speechSynthesis);
  if (window.speechSynthesis) {
    window.speechSynthesis.speak = function (u) {
      spoken.push({ text: u.text, rate: u.rate, lang: u.lang });
      if (typeof u.onstart === 'function') u.onstart();
    };
  }

  const firstSpeak = document.querySelector('#list .speak');
  ok('màn Tra từ có nút loa', !!firstSpeak);
  ok('danh sách render đủ 188 dòng', document.querySelectorAll('#list li.row').length === 188,
     document.querySelectorAll('#list li.row').length);
  ok('Unit 8 phần 1 có 17 mục', DATA.filter(r => String(r[0]) === '8.1').length === 17,
     DATA.filter(r => String(r[0]) === '8.1').length);
  ok('Unit 8 phần 3 có 13 mục', DATA.filter(r => String(r[0]) === '8.3').length === 13,
     DATA.filter(r => String(r[0]) === '8.3').length);
  ok('có đủ nút lọc U8, U8·1, U8·3 ở cả hai màn',
     ['8','8.1','8.3'].every(v => document.querySelector('[data-unit="'+v+'"]') && document.querySelector('[data-du="'+v+'"]')));
  ok('lọc U8 gộp cả hai phần', DATA.filter(r => unitOk(r,'8')).length === 30,
     DATA.filter(r => unitOk(r,'8')).length);
  ok('lọc U8·3 chỉ lấy phần 3', DATA.filter(r => unitOk(r,'8.3')).length === 13,
     DATA.filter(r => unitOk(r,'8.3')).length);

  let n0 = spoken.length;
  if (firstSpeak) firstSpeak.click();
  await sleep(60);
  ok('bấm loa thì gọi speak()', spoken.length > n0, 'số lần gọi: ' + (spoken.length - n0));
  const s1 = spoken[spoken.length - 1];
  ok('đọc đúng từ ở dòng đó', s1 && s1.text === DATA[0][1], s1 && s1.text);
  ok('tốc độ mặc định = 1', s1 && Math.abs(s1.rate - 1) < 0.001, s1 && s1.rate);
  ok('có chọn giọng tiếng Anh hoặc fallback en-GB', s1 && /^en/i.test(s1.lang || ''), s1 && s1.lang);

  const a = $('speedA'), b = $('speedB');
  ok('có ô chọn tốc độ ở cả hai màn', !!a && !!b);
  if (a && b) {
    a.value = '1.2';
    a.dispatchEvent(new Event('change'));
    ok('đổi tốc độ thì ô bên kia đồng bộ', b.value === '1.2', 'speedB=' + b.value);
    n0 = spoken.length;
    if (firstSpeak) firstSpeak.click();
    await sleep(60);
    const s2 = spoken[spoken.length - 1];
    ok('tốc độ đọc đổi theo lựa chọn', s2 && Math.abs(s2.rate - 1.2) < 0.001, s2 && s2.rate);
    a.value = '1';
    a.dispatchEvent(new Event('change'));
  }

  const viBtn = document.querySelector('#list .speakvi');
  ok('mỗi dòng có nút đọc nghĩa tiếng Việt', !!viBtn);
  n0 = spoken.length;
  if (viBtn) viBtn.click();
  await sleep(60);
  const sv = spoken[spoken.length - 1];
  ok('bấm nút VI thì đọc bằng tiếng Việt', sv && /^vi/i.test(sv.lang || ''), sv && sv.lang);
  ok('đọc đúng nghĩa tiếng Việt của dòng đó', sv && sv.text === DATA[0][4], sv && sv.text);

  /* Nghĩa có ngoặc / ghi chú thì phải được cắt gọn trước khi đọc */
  const idxNote = DATA.findIndex(r => /\(|—/.test(r[4]));
  ok('tìm được một nghĩa có ghi chú để thử', idxNote >= 0, idxNote >= 0 ? DATA[idxNote][4] : '');
  if (idxNote >= 0) {
    const cleaned = viSpeech(DATA[idxNote][4]);
    ok('bỏ ngoặc và ghi chú trước khi đọc', cleaned.indexOf('(') < 0 && cleaned.indexOf('—') < 0 && cleaned.length > 0, cleaned);
  }

  /* ===================== MÀN NGHE – VIẾT ===================== */
  $('tabViet').click();
  ok('mở được màn Nghe – Viết', !$('view-viet').hidden);
  n0 = spoken.length;
  $('start').click();
  await sleep(450);
  ok('vào bài là tự đọc từ đầu tiên', spoken.length > n0, 'số lần gọi: ' + (spoken.length - n0));
  ok('hiện ô nhập đáp án', !!$('answer') && !$('answer').disabled);

  let w = DATA[queue[qi]];
  $('answer').value = w[1];
  $('check').click();
  await sleep(60);
  ok('gõ đúng thì chấm ĐÚNG', $('verdict').className.indexOf('ok') >= 0,
     $('verdict').className + ' | ' + $('verdict').textContent.slice(0, 40));

  $('check').click();
  await sleep(60);
  w = DATA[queue[qi]];
  $('answer').value = w[1].toLowerCase() === w[1] ? w[1].toUpperCase() : w[1].toLowerCase();
  $('check').click();
  await sleep(60);
  ok('KHÔNG phân biệt hoa thường', $('verdict').className.indexOf('ok') >= 0,
     $('verdict').className + ' | gõ: ' + $('answer').value);

  $('check').click();
  await sleep(60);
  w = DATA[queue[qi]];
  const missing = w[1].slice(0, 2) + w[1].slice(3);
  $('answer').value = missing;
  $('check').click();
  await sleep(60);
  const vtxt = $('verdict').textContent;
  ok('gõ thiếu chữ thì chấm SAI', $('verdict').className.indexOf('no') >= 0, $('verdict').className);
  ok('có chỉ ra chỗ sai theo ký tự', $('verdict').querySelectorAll('.diff b').length > 0,
     'số ký tự được đánh dấu: ' + $('verdict').querySelectorAll('.diff b').length);
  ok('báo đúng số chỗ sai', /Sai \d+ chỗ/.test(vtxt), vtxt.slice(0, 30));

  $('hintViBtn').click();
  await sleep(30);
  ok('gợi ý nghĩa có kèm nút đọc tiếng Việt', !!document.getElementById('hintViSpeak'));
  n0 = spoken.length;
  const hb = document.getElementById('hintViSpeak');
  if (hb) hb.click();
  await sleep(60);
  const sh = spoken[spoken.length - 1];
  ok('bấm nút đó thì đọc tiếng Việt', spoken.length > n0 && sh && /^vi/i.test(sh.lang || ''), sh && sh.lang);

  /* --------- Ngôn ngữ đọc mặc định của cả bài chép --------- */
  ok('có hai lựa chọn ngôn ngữ đọc', document.querySelectorAll('#dLangs [data-dg]').length === 2,
     document.querySelectorAll('#dLangs [data-dg]').length);

  n0 = spoken.length;
  $('check').click();               // sang từ tiếp theo -> máy tự đọc
  await sleep(500);
  const sDef = spoken[spoken.length - 1];
  ok('mặc định vào bài đọc tiếng Anh', spoken.length > n0 && sDef && /^en/i.test(sDef.lang || ''), sDef && sDef.lang);

  n0 = spoken.length;
  $('speakOther').click();
  await sleep(90);
  const sOther = spoken[spoken.length - 1];
  ok('nút nghe tiếng kia đọc bằng tiếng Việt', spoken.length > n0 && sOther && /^vi/i.test(sOther.lang || ''), sOther && sOther.lang);

  $('answer').value = 'zzz';        // trả lời bừa cho nhanh rồi sang từ sau
  $('check').click(); await sleep(70);
  n0 = spoken.length;
  $('check').click(); await sleep(500);
  const sBack = spoken[spoken.length - 1];
  ok('nghe tiếng kia KHÔNG đổi mặc định của cả bài',
     spoken.length > n0 && sBack && /^en/i.test(sBack.lang || ''), sBack && sBack.lang);

  $('quit').click();
  await sleep(40);

  /* --------- Đổi mặc định sang tiếng Việt --------- */
  $('newBtn').click();
  await sleep(50);
  document.querySelector('#dLangs [data-dg="vi"]').click();
  await sleep(20);
  ok('chọn được mặc định tiếng Việt',
     document.querySelector('#dLangs [data-dg="vi"]').getAttribute('aria-pressed') === 'true');
  ok('lời nhắc đổi theo lựa chọn', ($('langNote').textContent || '').indexOf('nghĩa tiếng Việt') >= 0,
     ($('langNote').textContent || '').slice(0, 50));

  n0 = spoken.length;
  $('start').click();
  await sleep(500);
  const sVi = spoken[spoken.length - 1];
  ok('mặc định tiếng Việt thì vào bài đọc tiếng Việt',
     spoken.length > n0 && sVi && /^vi/i.test(sVi.lang || ''), sVi && sVi.lang);
  ok('đọc đúng nghĩa của từ đang hỏi', sVi && sVi.text === viSpeech(DATA[queue[qi]][4]), sVi && sVi.text);

  n0 = spoken.length;
  $('speakOther').click();
  await sleep(90);
  const sEn = spoken[spoken.length - 1];
  ok('lúc đó nút nghe tiếng kia đọc tiếng Anh',
     spoken.length > n0 && sEn && /^en/i.test(sEn.lang || ''), sEn && sEn.lang);

  $('quit').click();
  await sleep(40);

  /* ===================== MÀN TRẠNG TỪ ===================== */
  $('tabAdv').click();
  ok('mở được màn Trạng từ', !$('view-adv').hidden);
  $('advStart').click();
  await sleep(40);
  ok('hiện câu hỏi đầu tiên', $('advBody').querySelectorAll('button').length > 0,
     'số nút: ' + $('advBody').querySelectorAll('button').length);

  /* Lượt 1 — luôn chọn đáp án đúng, phải được 18/18 */
  let done = 0, badGrade = [];
  while (!$('advCard').hidden && done < 40) {
    const q = ADVQ[advQ[advI]];
    const sel = q.t === 'pos' ? '[data-g="' + q.ans + '"]' : '[data-o="' + q.ans + '"]';
    const btn = $('advBody').querySelector(sel);
    if (!btn) { badGrade.push('câu ' + (advI + 1) + ' (' + q.t + ') không có nút đáp án đúng'); break; }
    btn.click();
    await sleep(15);
    if ($('advVerdict').className.indexOf('ok') < 0) {
      badGrade.push('câu ' + (advI + 1) + ' chọn đúng mà bị chấm sai');
    }
    $('advNext').click();
    await sleep(15);
    done++;
  }
  ok('làm hết 18 câu', done === 18, 'làm được ' + done);
  ok('chọn đúng thì đều chấm đúng', badGrade.length === 0, badGrade.join(' | '));
  const sum = ($('advSummary').textContent || '');
  ok('bảng kết quả báo 18/18', sum.indexOf('18 / 18') >= 0, sum.slice(0, 60));

  /* Lượt 2 — luôn chọn một phương án SAI, kiểm tra lời giải riêng */
  $('advNew').click();
  await sleep(40);
  let whyOk = 0; const whyBad = [];
  for (let k = 0; k < 18; k++) {
    const q = ADVQ[advQ[advI]];
    const keys = Object.keys(q.why || {});
    if (!keys.length) { whyBad.push('câu ' + (k + 1) + ' không có lời giải nào'); continue; }
    const pick = keys[0];
    const sel = q.t === 'pos' ? '[data-g="' + pick + '"]' : '[data-o="' + pick + '"]';
    const btn = $('advBody').querySelector(sel);
    if (!btn) { whyBad.push('câu ' + (k + 1) + ' thiếu nút phương án sai ' + pick); $('advNext').click(); await sleep(10); continue; }
    btn.click();
    await sleep(15);
    const t = $('advVerdict').textContent || '';
    const wrongMarked = $('advBody').querySelectorAll('.wrong').length > 0;
    const rightMarked = $('advBody').querySelectorAll('.right').length > 0;
    if (t.indexOf(q.why[pick].slice(0, 22)) >= 0 && wrongMarked && rightMarked) whyOk++;
    else whyBad.push('câu ' + (k + 1) + ' (' + q.t + ')');
    $('advNext').click();
    await sleep(15);
  }
  ok('18 phương án sai đều có lời giải riêng + tô màu đúng/sai', whyOk === 18, whyBad.join(', '));

  ok('không có lỗi JavaScript nào', errs.length === 0, errs.join(' | '));
  return log;
})();

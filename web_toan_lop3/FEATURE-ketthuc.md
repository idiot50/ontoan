# FEATURE — Nút "Kết thúc" + Màn TỔNG HỢP KẾT QUẢ

> Spec dùng chung cho **cả 2 app**: `web_toan_lop3\` (bé ~9 tuổi) và `web_toan_lop1\` (bé ~6 tuổi, có đọc đề giọng nói).
> Người triển khai: `frontend-web-toan-treem`. Nội dung toán KHÔNG đổi (giữ giao kèo câu hỏi hiện có).
> Phong cách: bám **"Hiện đại tươi sáng"** (tokens indigo/gradient, icon-chip, không mascot) và **luật an toàn trẻ em** đã có trong DESIGN.md/REDESIGN.md.
> Quy ước trong file: phần ghi **(L1)** = chỉ áp dụng/khác ở lớp 1; **(L3)** = chỉ lớp 3; còn lại dùng cho cả hai.

---

## 0. Mục đích & bối cảnh

Hiện hai app có 2 chế độ:
- **Luyện tập** (practice): vô hạn, 1 chủ đề. KHÔNG có điểm dừng tự nhiên → hiện chỉ thoát bằng 🏠 Trang chủ, **mất sạch** những gì bé vừa làm, không có tổng kết. Đây là nơi cần "Kết thúc" nhất.
- **Ôn tập tổng hợp** (mixed): bộ 10 câu, hết câu 10 thì vào `screen-result` (có điểm/sao/huy hiệu nhưng **KHÔNG có danh sách chi tiết từng câu**).

Tính năng mới thêm **nút "🏁 Kết thúc"** ở hàng `.actions` và một **MÀN TỔNG HỢP** liệt kê các câu **đã làm** (đã bấm Kiểm tra) trong phiên: tổng đã làm / đúng / sai + **danh sách chi tiết**, câu sai có **đáp án đúng + lời giải**. Hoạt động ở **cả hai chế độ**.

Nguyên tắc xuyên suốt: **không phạt, không xếp hạng, giọng động viên, offline, a11y tốt**.

---

## 1. Nút "Kết thúc" — vị trí, kiểu, hiện/ẩn

### 1.1 Vị trí & markup
Thêm vào hàng `.actions` trong `#screen-quiz`, **sau** `nextBtn`/`similarBtn`. Nhãn: **`🏁 Kết thúc`**.

```html
<div class="actions">
  <button class="btn" id="checkBtn" disabled>✅ Kiểm tra</button>
  <button class="btn ghost" id="skipBtn">Câu tiếp →</button>
  <button class="btn hidden" id="nextBtn">Câu tiếp theo →</button>
  <button class="btn ghost hidden" id="similarBtn">Thử câu tương tự</button>
  <button class="btn ghost hidden" id="finishBtn">🏁 Kết thúc</button>   <!-- MỚI -->
</div>
```

### 1.2 Kiểu nút
- Dùng **`.btn.ghost`** (viền nhạt, nền trắng) — **không** dùng nút primary gradient và **không** dùng màu cảnh báo/đỏ. Lý do: "Kết thúc" là hành động trung tính, không nên cạnh tranh thị giác với hành động chính (`Kiểm tra` / `Câu tiếp`), cũng không tạo cảm giác "thoát/nguy hiểm". Giữ giọng nhẹ nhàng.
- Là nút ghost thứ hai cùng hàng (cạnh `skipBtn`), bố cục `flex-wrap` sẵn có sẽ tự xuống dòng trên màn hẹp — không cần CSS mới ngoài việc dùng lại class.

### 1.3 Thứ tự đọc & trực quan
Thứ tự trong DOM = thứ tự Tab: `Kiểm tra → Câu tiếp → (Câu tiếp theo) → (Thử câu tương tự) → Kết thúc`. "Kết thúc" luôn đứng **cuối hàng** để không bị bấm nhầm thay cho hành động chính.

### 1.4 Khi nào HIỆN / ẨN
- **Chỉ ở chế độ Luyện tập** (practice): `finishBtn` **luôn hiện** suốt màn làm bài (cả trước và sau khi chấm) — vì đây mới là nơi không có điểm dừng. Đặt hiện trong `startPractice()` và giữ nguyên qua `loadQuestion()`.
- **Chế độ Ôn tập** (mixed): **ẩn** `finishBtn`. Mixed đã có điểm dừng tự nhiên (hết 10 câu) và nút "🎉 Xem kết quả →"; thêm "Kết thúc" sẽ rối. (Vẫn có thể thoát giữa chừng bằng 🏠 — giữ nguyên hành vi cũ.) → Trong `loadQuestion()` thêm: `finishBtn.classList.toggle('hidden', session.mode !== 'practice')`.
- **Chưa làm câu nào** (mảng bản ghi rỗng): KHÔNG ẩn nút (tránh nút nhấp nháy xuất hiện/biến mất gây bối rối). Khi bấm mà chưa có câu nào đã chấm → **không** mở màn tổng hợp; thay vào đó hiện thông báo nhẹ nhàng tại chỗ (xem §1.5). Như vậy bé luôn thấy nút ở vị trí cố định.

### 1.5 Xử lý khi bấm "Kết thúc" lúc CHƯA làm câu nào
Không mở màn trống rỗng. Hiển thị câu mời ở vùng `#feedback` (kiểu thông tin, không phải lỗi) hoặc một dòng nhỏ dưới nút:
- (L3): "Con chưa làm câu nào cả. Thử bấm ✅ Kiểm tra một câu trước nhé!"
- (L1): "Bé làm thử một câu rồi xem kết quả nha!" (nếu TTS bật & có giọng → đọc câu này, xem §4).
Sau thông báo, ở lại màn làm bài. (Đơn giản hơn: cũng có thể luôn cho về Trang chủ; nhưng phương án thông báo tại chỗ mượt hơn cho bé.)

### 1.6 Phím tắt (tùy chọn, không bắt buộc)
KHÔNG gán Enter cho "Kết thúc" (Enter đã dành cho Kiểm tra/Câu tiếp). Có thể dùng phím **`F`** khi ở practice; nếu thêm thì phải loại trừ khi đang gõ trong `#answerBox` (giống cách `L` được xử lý ở L1). Ưu tiên: bấm chuột/chạm — phím tắt là "nice to have".

---

## 2. MÀN TỔNG HỢP KẾT QUẢ — bố cục

Dùng chung 1 màn cho **cả "Kết thúc sớm" (practice) lẫn kết thúc Ôn tập (mixed)** — xem §5 để biết lý do tái dùng `screen-result`. Bổ sung **một khối danh sách chi tiết cuộn được** vào `screen-result` hiện có, đặt **sau** phần điểm/huy hiệu/gợi ý và **trước** hàng nút.

Thứ tự khối từ trên xuống:

1. **Tiêu đề + emoji theo tỷ lệ đúng** (tái dùng `#resEmoji` + `#resMsg`).
   - Tỷ lệ tính trên **số câu ĐÃ LÀM** (không phải tổng cố định 10). Xem ngưỡng ở §7.
2. **Hàng ô SỐ TO** — đề xuất **3–4 ô**:
   - **Đã làm** (tổng số câu đã chấm)
   - **Đúng** (xanh `--ok`)
   - **Sai** (cam `--warn` — KHÔNG đỏ gắt)
   - (tùy chọn) **Bỏ qua**: chỉ thêm nếu có đếm số lần bấm "Câu tiếp/skip" khi chưa chấm. **Khuyến nghị: tạm BỎ** để giữ gọn — "đã làm/đúng/sai" là đủ và rõ. Nếu muốn thêm sau, đặt ô thứ 4 màu trung tính `--muted`.
   - (L3) tái dùng/đặt cạnh phần sao `#resRewards` hiện có.
   - (L1) tái dùng cấu trúc `.scoreboxes/.scorebox` đang có (ô SỐ TO 44px); thêm 1 ô "Sai" dùng biến thể màu cam.
3. **Khối DANH SÁCH CHI TIẾT — cuộn được** (`#resReview`), mỗi câu 1 thẻ `.review-item`:
   - Dấu trạng thái **`✓` / `✗`** (ký tự thật, KHÔNG chỉ dựa màu) trong một viên tròn nhỏ + class `.ok`/`.bad` để tô màu.
   - **Số thứ tự câu** ("Câu 1", "Câu 2"…).
   - (tùy chọn) emoji chủ đề + tên chủ đề (`topicEmoji + topicName`) — hữu ích ở mixed để bé biết câu thuộc mạch nào.
   - **Đề bài** (`stem`, render `innerHTML` vì chứa `<b>`, ký hiệu, `&lt; &gt;`).
   - **Câu trả lời của bé**: "Con trả lời: …" / (L1) "Bé chọn: …". Nếu bé bỏ trống thì hiển thị "(chưa trả lời)" — nhưng theo §3 ta chỉ ghi câu ĐÃ CHẤM nên trường này luôn có giá trị.
   - **Câu ĐÚNG**: hiển thị **gọn** — chỉ cần dấu ✓ + đề + (không bắt buộc) "Đáp án: …". Không cần lời giải dài cho câu đúng (có thể cho 1 nút nhỏ "xem cách làm" gập lại — tùy chọn, mặc định ẩn để gọn).
   - **Câu SAI** (bắt buộc đầy đủ):
     - "Con trả lời: <userText>" (tô nhạt cam).
     - "**Đáp án đúng: <correctText>**" (chip xanh `--ok`, đậm) — **luôn hiển thị**.
     - "**Cách làm:** <explain>" — lời giải, hiển thị ngay (không cần bấm mở) để bé ôn lại. Render `innerHTML`.
   - Thẻ có **thanh màu trái 6px** (`border-left`) `--ok`/`--warn` để phân biệt kể cả khi bỏ màu (đồng bộ kiểu `.feedback`).
   - Vùng cuộn: `max-height` (vd 46vh) + `overflow-y:auto`, viền + bo góc, `tabindex="0"` + `role="region"` + `aria-label="Danh sách các câu con đã làm"` để cuộn được bằng bàn phím.
   - Câu **sai xếp trước** hay theo **thứ tự làm**? → **Theo thứ tự làm** (tự nhiên, dễ nhớ "mình vừa làm gì"). Có thể thêm dòng tóm tắt đầu danh sách: "Con sai 2 câu — xem lại nhé" (chỉ khi có câu sai).
4. **Hàng nút** (tái dùng `.actions` trong `screen-result`):
   - **Nút chính (primary)** = tiếp tục luyện:
     - (practice) **"➕ Làm tiếp"** → quay lại làm bài cùng chủ đề (gọi `startPractice(session.topicId)` hoặc nạp câu mới), **reset** bản ghi phiên.
     - (mixed) giữ **"🔁 Làm bộ mới"** (L3) / **"🔁 Chơi lại"** (L1) như hiện tại → `startMixed()`.
   - **Nút ghost** = **"🏠 Trang chủ"** (`#resHomeBtn` hiện có).
   - (L1) thêm **🔊 nút "Nghe"** cạnh tiêu đề (đã có `#resListen`) — đọc câu tóm tắt (xem §4).
   - Đặt id nút tiếp-tục linh hoạt: dùng lại `#againBtn` nhưng đổi nhãn + đổi handler theo `mode` khi mở màn (xem §5.3).

### 2.1 CSS gợi ý (thêm mới, nhỏ gọn, dùng tokens sẵn có)
```css
.review { margin: 18px 0 6px; text-align: left; }
.review h3 { font-size: var(--fs-lg); font-weight: 800; margin: 0 0 10px; }
.reviewlist {
  max-height: 46vh; overflow-y: auto;
  display: flex; flex-direction: column; gap: 12px;
  padding: 4px; border: 1px solid var(--line); border-radius: var(--r-lg);
  background: var(--card-soft);
}
.review-item {
  background: #fff; border: 1px solid var(--line);
  border-left: 6px solid var(--line-2);
  border-radius: var(--r); padding: 14px 16px; box-shadow: var(--sh-sm);
}
.review-item.ok  { border-left-color: var(--ok); }
.review-item.bad { border-left-color: var(--warn); }
.review-item .ri-head { display:flex; align-items:center; gap:10px; font-weight:800; margin-bottom:8px; }
.review-item .ri-mark {
  flex:0 0 auto; width:30px; height:30px; border-radius:999px; color:#fff;
  display:inline-flex; align-items:center; justify-content:center; font-size:18px; font-weight:900;
}
.review-item.ok  .ri-mark { background: var(--ok); }
.review-item.bad .ri-mark { background: var(--warn); }
.review-item .ri-stem { font-size: var(--fs-body); line-height:1.45; }
.review-item .ri-your { margin-top:8px; font-weight:700; color: var(--ink-2); }
.review-item.bad .ri-your { color: var(--warn-ink); }
.review-item .ri-correct {
  margin-top:8px; font-weight:800;
  display:inline-flex; align-items:center; gap:6px;
  background:#fff; border:1.5px solid var(--ok); color: var(--ok-ink);
  border-radius: var(--r-pill); padding: 4px 14px;
}
.review-item .ri-explain {
  margin-top:10px; font-size: var(--fs-sm); line-height:1.55;
  background: var(--card-soft); border:1px solid var(--line); border-radius: var(--r-sm); padding: 12px 14px;
}
```
(L1) tăng cỡ: dùng `--fs-stem`/`--fs-body` lớn hơn của L1 là tự động (vì biến đã khác); cân nhắc `max-height: 50vh`, viên `.ri-mark` 34px, nút to hơn.

---

## 3. HỢP ĐỒNG DỮ LIỆU — bản ghi mỗi câu

Thêm một mảng phiên: `session.records = []`. Mỗi phần tử:

```js
{
  stem,          // string (HTML) — đề bài, render bằng innerHTML
  type,          // 'mc' | 'input'
  userText,      // string ĐỂ HIỂN THỊ câu trả lời của bé
  correctText,   // string ĐỂ HIỂN THỊ đáp án đúng
  isCorrect,     // boolean
  explain,       // string (HTML) — lời giải (q.explain)
  topicName,     // string — tên chủ đề (lấy qua topicById(currentQ.topic).name)
  topicEmoji     // string — emoji chủ đề (topicById(...).emoji)
}
```

### 3.1 Cách lấy `userText` / `correctText` (TÁI DÙNG hàm có sẵn)
- `correctText = answerDisplay(currentQ)` — hàm này đã có ở cả 2 app (mc → `q.choices[q.answer]`; input → chuỗi `q.answer`, thay `;`→`; `).
- `userText`:
  - **mc**: `currentQ.choices[selectedIndex]` (nội dung lựa chọn bé chọn — KHÔNG phải index).
  - **input**: `String($('answerBox').value).trim()` (nguyên văn bé gõ).
- Cả hai là **chuỗi HTML an toàn từ engine** (choices có thể chứa `²`, dấu) → render bằng `innerHTML` như chỗ khác. `userText` của input do bé gõ → render bằng `textContent` (an toàn hơn, tránh chèn thẻ).

### 3.2 KHI NÀO ghi
Ghi **1 lần mỗi câu, tại `submitAnswer()`** ngay sau khi xác định `ok` (đã có biến `ok`, `selectedIndex`, `currentQ`). Đặt **sau** dòng `answered = true;`:

```js
session.records.push({
  stem: currentQ.stem,
  type: currentQ.type,
  userText: (currentQ.type === 'mc') ? currentQ.choices[selectedIndex] : val.trim(),
  correctText: answerDisplay(currentQ),
  isCorrect: ok,
  explain: currentQ.explain,
  topicName: topicById(currentQ.topic).name,
  topicEmoji: topicById(currentQ.topic).emoji
});
```
(`val` là biến đã có trong nhánh input của `submitAnswer`; với mc dùng `selectedIndex`.)

- Câu **bỏ qua** (bấm "Câu tiếp/skip" khi chưa chấm) → **KHÔNG ghi** (đúng yêu cầu: chỉ tổng hợp câu ĐÃ LÀM). Nếu sau này muốn đếm "bỏ qua", tăng một biến `session.skipped++` trong handler `skipBtn` — nhưng KHÔNG đưa vào `records`.
- (L3) "Thử câu tương tự" sau khi sai: câu sai **đã được ghi** ở lần chấm; câu tương tự là câu MỚI, khi chấm sẽ ghi bản ghi riêng. Không ghi trùng.

### 3.3 KHI NÀO reset
Đặt `session.records = []` ở **đầu mỗi phiên**:
- `startPractice()` — reset (bắt đầu chủ đề mới hoặc bấm "Làm tiếp").
- `startMixed()` — reset (bắt đầu bộ ôn tập mới).
Như vậy "Kết thúc" chỉ tổng hợp đúng phiên hiện tại; về Trang chủ rồi vào lại = phiên mới.

### 3.4 Lưu trữ
`session.records` chỉ ở **bộ nhớ RAM trong phiên** — **KHÔNG** ghi vào localStorage (không cần lưu, và tránh phình dữ liệu cá nhân). Chỉ có thống kê tổng (sao, topicCorrect…) tiếp tục lưu như cũ qua `saveState()`. Tôn trọng luật offline/không thu thập dữ liệu.

---

## 4. KHÁC BIỆT LỚP 1 (bé ~6 tuổi)

1. **Chữ & nút to hơn, ít chữ hơn**: tự đạt nhờ biến `--fs-*`/`--tap-*` của L1; trong thẻ review ưu tiên hiển thị **dấu ✓/✗ to + số to + đề ngắn**. Giảm chữ phụ: bỏ dòng "Con trả lời" nếu đúng; với câu sai giữ "Bé chọn / Đáp án đúng / Cách làm".
2. **Nút 🔊 đọc TÓM TẮT** (tái dùng `#resListen` + hàm `speak`/`stripEmoji`/`lastResultSay` có sẵn):
   - Câu tóm tắt do frontend ghép, **thuần lời, bỏ emoji**:
     - Tất cả đúng: `"Giỏi lắm! Bé làm đúng hết X câu!"`
     - Có sai: `"Bé làm đúng X câu, sai Y câu. Mình cùng xem lại các câu sai nhé."`
     - X/Y lấy từ `records`. Gán vào `lastResultSay` và **tự đọc** khi mở màn (nếu `ttsReady && autoRead`), giống `showResult()` hiện tại.
3. **Đọc lại từng câu SAI (tùy chọn, khuyến nghị mức "nên có")**: mỗi `.review-item.bad` (L1) có **nút nhỏ 🔊 "Nghe"**. Bấm → đọc chuỗi ghép: đề (ưu tiên `record.say` nếu ta cũng ghi `say`; nếu không, dùng `questionSayText` từ stem) + "Đáp án đúng là <correctText đọc thuần lời>".
   - Để có lời đọc chuẩn, **nên ghi thêm `say: currentQ.say`** vào record ở L1 (trường tùy chọn, chỉ L1). Nếu thiếu thì fallback `questionSayText({stem})`.
   - **Fallback khi KHÔNG có giọng tiếng Việt** (`ttsReady === false`): **ẩn toàn bộ nút 🔊** trong màn tổng hợp (dùng `toggleListenButtons`/kiểm tra `ttsReady` y như app đang làm). Màn vẫn dùng tốt bằng mắt — chữ to, dấu ✓/✗, màu. KHÔNG đọc bằng giọng ngôn ngữ khác.
4. (L1) **`#resListen` đã tồn tại** trong markup `screen-result` → chỉ cần đảm bảo `lastResultSay` được set theo nội dung tổng hợp mới (đúng/sai) thay vì chỉ "đúng N/10".
5. (L3) **KHÔNG có TTS** → bỏ qua toàn bộ phần 🔊; màn tổng hợp thuần hình ảnh/chữ.

---

## 5. QUAN HỆ với màn Kết quả Ôn tập hiện có (`screen-result`)

### 5.1 Quyết định: **TÁI DÙNG `screen-result`** (không tạo màn mới)
Lý do (ít rủi ro, nhất quán):
- Đã có sẵn điều hướng (`SCREENS`, `show('screen-result')`), nút 🏠, (L1) nút 🔊, confetti, aria-live.
- Một màn "Tổng hợp" dùng cho **cả** kết thúc sớm (practice) lẫn hết bộ (mixed) → bé thấy quen, code ít nhánh.
- Chỉ cần **thêm 1 khối** `#resReview` (ẩn mặc định) vào trong `.qcard.result`, đặt trước hàng nút.

### 5.2 Markup bổ sung vào `screen-result`
```html
<!-- đặt trước <div class="actions"> trong .qcard.result -->
<div class="review hidden" id="resReview" role="region"
     tabindex="0" aria-label="Danh sách các câu con đã làm">
  <h3 id="resReviewTitle">Các câu con đã làm</h3>
  <div class="reviewlist" id="resReviewList"></div>
</div>
```
(L1) đổi nhãn "con" → "bé".

### 5.3 Tách logic dựng màn
Tạo hàm dùng chung, ví dụ `renderSummary(opts)` nhận `{ mode, fromFinish }`:
- **Tính số liệu từ `session.records`** (đã làm = `records.length`, đúng = đếm `isCorrect`, sai = phần còn lại) — **KHÔNG** dựa vào `session.correctCount/total` cũ (vì practice không có total cố định).
- Đặt emoji/tiêu đề theo **tỷ lệ đúng/đã làm** (§7).
- Dựng các ô số (Đã làm/Đúng/Sai).
- Dựng `#resReviewList` từ `records`; hiện `#resReview` (bỏ `hidden`). Nếu `records.length === 0` thì không vào đây (đã chặn ở §1.5).
- Đặt nhãn/handler nút tiếp-tục theo `mode`:
  - practice → `#againBtn` nhãn "➕ Làm tiếp", handler `startPractice(prevTopicId)`.
  - mixed → `#againBtn` nhãn "🔁 Làm bộ mới"/"🔁 Chơi lại", handler `startMixed`.
  - Cách an toàn: gỡ rồi gắn lại listener, hoặc một handler chung đọc `session._lastMode`. Vì nút "Làm tiếp" practice cần `topicId`, lưu `session._finishTopic = session.topicId` trước khi reset.
- **Phần thưởng/huy hiệu**:
  - **mixed** (hết bộ): giữ **nguyên** logic `showResult()` hiện tại (thưởng +5 sao, `bestQuizScore`, huy hiệu, gợi ý ôn lại) **rồi** append khối review. Tức là `showResult()` gọi `renderSummary({mode:'mixed'})` ở cuối để thêm danh sách.
  - **practice "Kết thúc sớm"**: **KHÔNG** thưởng "hoàn thành bộ" (không phải 1 bộ chuẩn), **KHÔNG** đụng `bestQuizScore`. Sao mỗi câu đã được cộng lúc làm rồi. Vẫn có thể gọi `checkBadges()` để hiển thị huy hiệu mới nếu vừa đạt (an toàn, không hại). Ẩn phần "gợi ý ôn lại theo bộ" hoặc tái dùng nếu muốn (tùy chọn).
- Sau khi dựng xong: `show('screen-result')`, `refreshHeader()`, confetti **vừa phải** (chỉ khi tỷ lệ đúng cao, theo §6), (L1) set `lastResultSay` + tự đọc.

### 5.4 Hàm `finishPractice()` (handler của `finishBtn`)
```
if (session.records.length === 0) -> hiện thông báo §1.5, return;
session._finishTopic = session.topicId;
stopSpeak(); // (L1)
renderSummary({ mode: 'practice', fromFinish: true });
```

---

## 6. AN TOÀN & A11Y

- **aria-live**: `screen-result` đã có `aria-live="polite"`. Khối `#resReview` để `role="region"` + `aria-label`; KHÔNG đặt `aria-live` cho danh sách dài (tránh đọc ồ ạt). Tiêu đề/ô số nằm trong vùng live sẽ được thông báo gọn.
- **Cuộn bằng bàn phím**: `#resReview` có `tabindex="0"` → focus được và cuộn bằng mũi tên. Đảm bảo focus nhìn rõ (đã có `:focus-visible` outline vàng).
- **Tương phản**: dùng tokens `--ok-ink`/`--warn-ink` trên nền nhạt (đạt ≥4.5:1). KHÔNG dùng đỏ tươi cho câu sai — dùng cam `--warn` "nhẹ".
- **Không chỉ dựa màu**: mọi câu có **dấu ✓/✗ ký tự thật** + thanh viền trái + nhãn chữ ("Đáp án đúng:") → người mù màu/đọc màn hình vẫn hiểu.
- **Không phạt, giọng động viên**: tiêu đề/emoji theo §7 luôn tích cực kể cả khi sai nhiều ("Mình cùng xem lại nhé"). KHÔNG dùng "Bạn thất bại", KHÔNG hiển thị xếp hạng, KHÔNG so với người khác, KHÔNG đếm ngược.
- **Ăn mừng vừa phải**: confetti chỉ khi tỷ lệ đúng ≥ ~70% (và `!reduceMotion`); âm fanfare chỉ khi rất tốt. Câu sai nhiều → KHÔNG confetti, chỉ lời mời ôn lại.
- **Offline**: không tài nguyên ngoài; `records` chỉ ở RAM; không thu thập dữ liệu.
- **prefers-reduced-motion**: tôn trọng (đã có rule tắt transition/animation).
- **Không dark pattern**: nút "Kết thúc" luôn dễ thấy, không bị che; thoát/đi tiếp đều 1 chạm.

---

## 7. BẢNG "COPY" tiếng Việt (màn tổng hợp)

Tỷ lệ `r = đúng / đã làm`. Chọn tiêu đề theo `r` (và trường hợp đặc biệt).

### 7.1 Lớp 3 (`web_toan_lop3`)
| Điều kiện | Emoji | Tiêu đề (`#resMsg`) |
|---|---|---|
| đã làm = 1 và đúng | 🌟 | "Đúng rồi! Khởi đầu tốt lắm!" |
| r = 100% (≥2 câu) | 🏆 | "Tuyệt vời! Con làm đúng tất cả!" |
| r ≥ 80% | 🎉 | "Giỏi lắm! Con làm rất tốt!" |
| r ≥ 60% | 😊 | "Khá lắm! Con đang tiến bộ rồi đó!" |
| r ≥ 40% | 💪 | "Cố lên nhé! Xem lại vài câu là con giỏi hơn!" |
| r < 40% | 🌱 | "Không sao đâu! Mình cùng xem lại từ từ, con làm được mà!" |

Nhãn ô số: **"Đã làm"**, **"Đúng"**, **"Sai"**.
Tiêu đề danh sách: "Các câu con đã làm". Dòng tóm tắt khi có sai: "Con sai N câu — xem lại nhé!".
Trong thẻ: "Con trả lời:", "Đáp án đúng:", "Cách làm:".
Nút: **"➕ Làm tiếp"** (practice) / **"🔁 Làm bộ mới"** (mixed) · **"🏠 Trang chủ"**.

### 7.2 Lớp 1 (`web_toan_lop1`) — NGẮN & ẤM hơn
| Điều kiện | Emoji | Tiêu đề |
|---|---|---|
| đã làm = 1 và đúng | 🌟 | "Đúng rồi! Giỏi quá!" |
| r = 100% (≥2 câu) | 🏆 | "Bé làm đúng hết! Giỏi ơi là giỏi!" |
| r ≥ 80% | 🎉 | "Giỏi lắm bé ơi!" |
| r ≥ 60% | 😊 | "Bé làm tốt lắm!" |
| r ≥ 40% | 💪 | "Cố lên nào, bé làm được mà!" |
| r < 40% | 🌱 | "Không sao đâu! Mình xem lại nhé!" |

Nhãn ô số: **"Đã làm"**, **"Đúng"**, **"Sai"** (số TO).
Tiêu đề danh sách: "Các câu bé đã làm". Trong thẻ (gọn): "Bé chọn:", "Đáp án đúng:", "Cách làm:" (lời giải có thể gập, nhưng nên hiện vì bé cần ôn).
Nút: **"➕ Làm tiếp"** (practice) / **"🔁 Chơi lại"** (mixed) · **"🏠 Trang chủ"**.
Câu đọc 🔊 (tóm tắt): đúng hết → "Giỏi lắm! Bé làm đúng hết X câu!"; có sai → "Bé làm đúng X câu, sai Y câu. Mình cùng xem lại nhé."

---

## 8. TÓM TẮT 8–12 QUYẾT ĐỊNH (giao cho `frontend-web-toan-treem`)

1. **Thêm `#finishBtn` "🏁 Kết thúc"** vào `.actions`, **cuối hàng**, kiểu **`.btn.ghost`** (không primary, không đỏ). Có ở **cả 2 app**.
2. **Chỉ hiện ở chế độ Luyện tập (practice); ẩn ở Ôn tập (mixed)** — toggle trong `loadQuestion()` theo `session.mode`; ở practice **luôn hiện** suốt màn làm bài.
3. **Bấm khi chưa làm câu nào → KHÔNG mở màn**, hiện câu mời nhẹ nhàng tại chỗ (copy §1.5); ở lại màn làm bài.
4. **Thêm `session.records = []`**, ghi **1 bản ghi mỗi câu trong `submitAnswer()`** sau khi có `ok`; **reset** ở đầu `startPractice()` và `startMixed()`. Câu "bỏ qua" KHÔNG ghi. Chỉ ở RAM, KHÔNG localStorage.
5. **Hợp đồng bản ghi**: `{ stem, type, userText, correctText, isCorrect, explain, topicName, topicEmoji }` (+ `say` chỉ ở L1, tùy chọn). `userText`/`correctText` là **chuỗi hiển thị**: mc lấy theo nội dung lựa chọn (`choices[selectedIndex]` / `answerDisplay`), input lấy chuỗi bé gõ vs `q.answer`. Tái dùng `answerDisplay()` đã có.
6. **TÁI DÙNG `screen-result`** (không tạo màn mới): thêm khối **`#resReview`** (cuộn được, `tabindex=0`, `role=region`) trước hàng nút. Một hàm chung `renderSummary({mode})` dựng cho cả "Kết thúc sớm" lẫn hết-bộ.
7. **Số liệu tính từ `records`** (đã làm/đúng/sai) — KHÔNG dựa total cố định. Hiển thị **3 ô số to**: Đã làm / Đúng / Sai (bỏ "Bỏ qua" cho gọn).
8. **Mỗi thẻ câu**: dấu **✓/✗ ký tự thật** + thanh viền trái màu + nhãn chữ. Câu đúng hiển thị **gọn**; câu **sai** hiện đầy đủ **"Đáp án đúng: …" (chip xanh) + "Cách làm: …" (lời giải)**. Theo **thứ tự làm**.
9. **Nút màn tổng hợp**: primary **"➕ Làm tiếp"** (practice, về cùng `topicId` đã lưu trước reset) / giữ **"🔁 Làm bộ mới|Chơi lại"** (mixed); ghost **"🏠 Trang chủ"**. Dùng lại `#againBtn`/`#resHomeBtn`, đổi nhãn + handler theo `mode`.
10. **Phần thưởng**: mixed giữ nguyên thưởng/huy hiệu cũ rồi **append review**; practice "Kết thúc sớm" **KHÔNG** thưởng "hoàn thành bộ", **KHÔNG** đụng `bestQuizScore` (sao mỗi câu đã cộng khi làm); vẫn được `checkBadges()`.
11. **(L1 khác L3)**: chữ/nút to hơn (tự nhờ tokens), **ít chữ hơn**; tái dùng `#resListen` + `speak/stripEmoji/lastResultSay` để **đọc câu tóm tắt** ("Bé làm đúng X câu, sai Y câu…"); **mỗi câu sai có nút 🔊 "Nghe"** (ưu tiên `record.say`, fallback `questionSayText`). **Fallback: nếu không có giọng tiếng Việt (`ttsReady=false`) → ẩn hết nút 🔊**, màn vẫn dùng tốt bằng mắt. **L3 không có TTS** → bỏ toàn bộ phần 🔊.
12. **An toàn & a11y**: giọng động viên (copy §7, không phạt/không xếp hạng), không-chỉ-dựa-màu, tương phản đạt, cuộn bằng bàn phím, **confetti chỉ khi tỷ lệ đúng cao** + tôn trọng `prefers-reduced-motion`, hoàn toàn offline.

---

**Điểm L1 khác L3 (gom nhanh):** (a) L1 có **TTS đọc tóm tắt + đọc lại câu sai**, kèm fallback ẩn khi không có giọng Việt; L3 không có. (b) L1 chữ/nút to hơn, **ít chữ hơn** (bỏ "Bé trả lời" ở câu đúng), copy ngắn & ấm hơn (§7.2). (c) Nhãn xưng hô "bé" (L1) vs "con" (L3). (d) Nút tiếp tục mixed: L1 "🔁 Chơi lại" vs L3 "🔁 Làm bộ mới". (e) L1 cân nhắc ghi thêm `say` vào record để đọc câu sai chuẩn lời.

> File này: `d:\toanlop3\web_toan_lop3\FEATURE-ketthuc.md` (spec dùng chung 2 app).

# UX FLOWS — Web học tiếng Anh trẻ 7–10 (MVP Level 1, offline-first)

> **Pha P1 — Luồng màn hình + Gamification cho MVP Level 1.**
> Đây là bản thiết kế TRẢI NGHIỆM (luồng/màn/copy/quy tắc) để `frontend-web-tienganh` triển khai.
> Tài liệu KHÔNG định nghĩa lại API/schema — chữ ký lấy từ `docs/CONTRACTS.md` (v1);
> ràng buộc lưu trữ/offline lấy từ `docs/ARCHITECTURE.md`; phạm vi từ `docs/BACKLOG_MVP.md`;
> nguyên tắc sư phạm từ `en_md/KE_HOACH_WEBSITE_TIENGANH.md` mục 13.
>
> **Bất biến trải nghiệm (áp cho MỌI màn):**
> - UI tiếng Việt; nội dung học tiếng Anh; **mọi văn bản EN có nút loa TTS** (US-G2).
> - Nút to (≥ `--touch-cta` 64px cho hành động chính), ít chữ, biểu tượng KÈM chữ; không chỉ dựa màu (WCAG AA).
> - Phản hồi sai = **gợi ý nhẹ + luôn cho NGHE/THẤY đáp án đúng + thử lại**, không âm tiêu cực, không "X to màu đỏ".
> - Động lực thiên **nỗ lực–hoàn thành**: sao/huy hiệu/thanh tiến độ/bản đồ mở khoá. **KHÔNG streak cứng, KHÔNG đếm giờ mặc định.**
> - Phiên ngắn 5–10 phút; có điểm dừng tự nhiên; gợi ý nghỉ mắt sau mỗi chặng; có **điểm dừng tích cực** ("Tạm biệt Pi") sau ~2–3 chặng (xem §4.6).
> - Linh vật **"Pi" (cáo đom đóm) 🦊** đồng hành/khích lệ (theo `tokens.css`/`DESIGN.md` — bảng nhân vật chuẩn §0); âm thanh & hiệu ứng có nút TẮT; tôn trọng `prefers-reduced-motion`.
> - Khi VÀO mỗi màn bài tập, **TTS tự đọc 1 lần** phần hướng dẫn VN + câu đề (hỗ trợ trẻ chưa đọc thạo); công tắc "Tự đọc đề khi mở bài" BẬT mặc định ở S9.

---

## 0. NHÂN VẬT CHUẨN (nguồn sự thật chung — đồng bộ với DESIGN.md)

> Để frontend code ra ĐÚNG một con vật và copy gọi ĐÚNG một tên, mọi tài liệu dùng bảng này.

| Thuộc tính | Giá trị chuẩn |
|---|---|
| Tên | **Pi** |
| Loài | Cáo đom đóm (firefly fox) |
| Emoji | 🦊 |
| Hình | SVG inline (định nghĩa trong `base.css`/`DESIGN.md`), có cơ chế **"bụng sao sáng dần"** gắn động lực |
| Giọng | Tích cực, đồng hành; xuất hiện khi chào / đúng / thử lại / hoàn thành / quay lại sau nghỉ |
| Biến thể mặt | vui (idle), reo (is-cheer khi ăn mừng) |

> Mọi chỗ trước đây ghi "Ò (cú mèo) 🦉" trong tài liệu này đã đổi thành **Pi (cáo đom đóm) 🦊**.

---

## 1. SITEMAP / SƠ ĐỒ MÀN HÌNH (MVP Level 1)

```
                         ┌─────────────────────────────┐
                         │  S0  KHỞI ĐỘNG / ONBOARDING  │  (chỉ lần đầu / khi chưa có hồ sơ)
                         │  - chào + chọn/tạo hồ sơ con │
                         └──────────────┬──────────────┘
                                        │
                         ┌──────────────▼──────────────┐
                         │  S1  CHỌN HỒ SƠ CON          │◄── (đổi hồ sơ bất cứ lúc nào)
                         │  avatar + biệt danh (≤4 con) │
                         └──────────────┬──────────────┘
                                        │ chọn 1 hồ sơ → activeChildId
                         ┌──────────────▼──────────────┐
                         │  S2  BẢN ĐỒ UNIT (Level 1)   │  ← màn chính ("Trang nhà")
                         │  - thẻ unit + % thành thạo   │
                         │  - đường mở khoá; sao đã đạt │
                         │  - nút: Phụ huynh / Cài đặt  │
                         └──────────────┬──────────────┘
                                        │ chạm 1 thẻ unit
                         ┌──────────────▼──────────────┐
                         │  S3  MENU UNIT               │
                         │  [ Từ vựng ] [ Luyện tập ]   │
                         │  [ Nói ]   ([ Phonics ]? )   │
                         │  + tiến độ từng mục          │
                         └───┬────────┬────────┬────────┘
                             │        │        │
          ┌──────────────────┘        │        └──────────────────┐
          ▼                           ▼                           ▼
 ┌──────────────────┐     ┌────────────────────────┐    ┌──────────────────────┐
 │ S4 FLASHCARD     │     │ S5 LUYỆN TẬP (bài tập) │    │ S6 NÓI (không chấm)  │
 │ từ vựng          │     │ fill_blank / mcq /     │    │ nghe mẫu→nhắc lại→   │
 │ icon+từ+nghĩa+câu│     │ order_words (+listen)  │    │ thu âm→nghe lại      │
 │ loa từ / loa câu │     │ 1 câu/màn, có loa      │    │ KHÔNG điểm phát âm    │
 └────────┬─────────┘     └───────────┬────────────┘    └──────────┬───────────┘
          │ hết bộ                    │ hết chặng                  │ hết lượt
          ▼                           ▼                            ▼
 ┌──────────────────┐     ┌────────────────────────┐    ┌──────────────────────┐
 │ → gợi "Luyện tập"│     │ S7 KẾT QUẢ CHẶNG       │    │ → "Em đã luyện nói!" │
 └──────────────────┘     │ sao + lời khen + "ôn   │    │ (ghi effort, score   │
                          │ lại phần yếu" + Tiếp   │    │  = null)             │
                          └───────────┬────────────┘    └──────────────────────┘
                                      │ về S3 / S2 (có thể đạt huy hiệu → toast)
                                      ▼
                   (mọi màn) ──► S8 PHỤ HUYNH (cổng nhẹ) ──► S9 CÀI ĐẶT
                                S2 ──► S8 ──► S9

   (Phụ — không nằm trong luồng học của trẻ)
   S8 PHỤ HUYNH (tối thiểu): chủ đề đang học · % thành thạo theo unit/kỹ năng ·
                             gợi ý "chơi cùng con 5 phút" · mục tiêu tuần MỀM (bật/tắt) ·
                             Export/Import JSON · quản lý hồ sơ con
   S9 CÀI ĐẶT: âm thanh on/off · hiệu ứng/độ động on/off · tốc độ TTS (thường/chậm) ·
               giọng EN (en-GB/US nếu có) · tương phản cao on/off · cỡ chữ
```

**Ghi chú điều hướng**
- Header cố định mọi màn học: trái = nút **← Quay lại** (≥48px, có nhãn "Quay lại"), giữa = tên màn/unit, phải = nút **loa toàn cục** (đọc đề hiện tại) + avatar nhỏ (chạm → đổi hồ sơ).
- Trang phụ huynh & cài đặt KHÔNG nằm trên đường đi học chính (đặt ở góc S2) để trẻ không lạc vào.
- Phonics (S thuộc menu unit) là **P1**: chỉ hiện khi `unit.phonics != null`; cùng khung như S5 nhưng dùng `phonics_pick` và ưu tiên `audio` nhúng.

---

## 2. LUỒNG CHI TIẾT TỪNG MÀN

> Mỗi màn nêu: **Mục đích · Thành phần · Hành động trẻ · Phản hồi · Lối thoát**.

### S0 — Khởi động / Onboarding (chỉ lần đầu)
- **Mục đích:** đón trẻ, tạo hồ sơ đầu tiên trong < 20 giây, không hỏi PII.
- **Thành phần:** linh vật Pi vẫy chào; 1 câu chào VN to ("Chào bạn nhỏ! Mình là Pi 🦊"); nút lớn **"Bắt đầu"**; bước tạo hồ sơ: lưới avatar emoji (🐱🐼🐶🐯🐧🐰…) + ô "Tên gọi" (gợi ý sẵn "Bé 1", không bắt buộc, không tên thật/ngày sinh).
- **Hành động trẻ:** chạm Bắt đầu → chọn 1 avatar → (tuỳ chọn) gõ biệt danh → "Xong".
- **Phản hồi:** chọn avatar có hiệu ứng nảy nhẹ; Pi nói "Tuyệt! Mình cùng học nhé."
- **Lối thoát:** "Xong" → S2 (đã set `activeChildId`). Có nút "Bỏ qua đặt tên" (dùng biệt danh gợi ý).
- **An toàn:** tạo `childId` ngẫu nhiên client; KHÔNG yêu cầu mạng/đăng nhập.

### S1 — Chọn hồ sơ con
- **Mục đích:** thiết bị dùng chung → mỗi con tiến độ riêng (US-F2).
- **Thành phần:** tối đa 4 thẻ hồ sơ (avatar to + biệt danh + "đã học N unit"); nút "+ Thêm bé" (mở mini-form như S0); mỗi thẻ có dấu sao tổng nhẹ.
- **Hành động trẻ:** chạm 1 thẻ → vào S2 với hồ sơ đó.
- **Phản hồi:** thẻ được chọn sáng viền + nảy nhẹ.
- **Lối thoát:** vào S2. "Thêm bé"/"Sửa hồ sơ" (đổi avatar/tên/xoá) đặt ở trang phụ huynh để tránh trẻ xoá nhầm — ở S1 chỉ THÊM, không xoá.

### S2 — Bản đồ Unit (màn chính, "Trang nhà")
- **Mục đích:** chọn unit để học; cho thấy tiến bộ và phần đã mở khoá (US-A1, US-F1).
- **Thành phần:**
  - Dải chào ngắn ("Chào [biệt danh]! Hôm nay học gì nào?") + linh vật.
  - **Lưới/đường "bản đồ" thẻ unit** (đọc `content/level1/index.json`): mỗi thẻ = icon chủ đề + **tên chủ đề tiếng Việt** to + **thanh tiến độ %** + số sao đã đạt + nút loa (đọc tên chủ đề EN).
  - Unit kế tiếp ở trạng thái **mở** nổi bật ("Học tiếp"); unit chưa mở mờ + ổ khoá nhẹ (mở khi unit trước đạt ngưỡng — xem §4).
  - Góc trên phải: nút **Phụ huynh** (icon người lớn + chữ) và **Cài đặt** (bánh răng + chữ).
  - Dải "Mục tiêu tuần" MỀM (nếu bật): "Tuần này em đã học 3 ngày 🌱" — KHÔNG đỏ/không cảnh báo nếu chưa đạt.
- **Hành động trẻ:** chạm thẻ unit mở → S3; chạm thẻ khoá → Pi nói nhẹ "Học xong [unit trước] là mở khoá nha!".
- **Phản hồi:** thanh tiến độ tô theo `masteryPct` (từ `progress.getMastery`); unit mới mở khoá có hiệu ứng "bung khoá" 1 lần.
- **Lối thoát:** S3 / S8 / S9.

### S3 — Menu Unit
- **Mục đích:** chọn hoạt động trong unit, không bị lạc (US-A2).
- **Thành phần:** tiêu đề unit (VN + nút loa EN); 3–4 thẻ hoạt động lớn, mỗi thẻ icon + nhãn + thanh tiến độ riêng + dấu ✓ khi xong:
  - **Từ vựng** (xem & nghe thẻ từ) → S4
  - **Luyện tập** (làm bài) → S5
  - **Nói** (nghe & nói theo) → S6
  - **Phonics** (P1, chỉ khi có) → S5-biến-thể
  - Gợi ý thứ tự đề xuất: Từ vựng → Luyện tập → Nói (số thứ tự nhỏ 1·2·3 trên thẻ, nhưng KHÔNG khoá cứng — trẻ chọn tự do).
- **Hành động trẻ:** chạm 1 thẻ hoạt động.
- **Phản hồi:** thẻ đã hoàn thành hiện ✓ xanh + "Đã xong" (kèm chữ, không chỉ màu).
- **Lối thoát:** ← về S2 (giữ tiến độ phiên).

### S4 — Flashcard từ vựng
- **Mục đích:** nhớ từ trong NGỮ CẢNH (hình + câu + âm), dạy theo chunk (US-B1); xen vi-tương tác nhẹ để trẻ KHÔNG tiếp nhận thụ động cả 8 thẻ.
- **Thành phần:** 1 thẻ lớn giữa màn: **icon/emoji to** (≥`--fs-3xl` khu vực hình) + **từ EN** to + **nghĩa VN** + **câu ví dụ EN**; **2 nút loa**: "🔊 Đọc từ" và "🔊 Đọc câu" (đọc chậm khả dụng). Chỉ báo "thẻ 3/8". Nút **"Tiếp →"** lớn; nút "← Trước". Mỗi thẻ có 2 nút nhẹ: **"Mình nhớ rồi 👍"** / **"Xem lại 🔁"** (chỉ ghi tự đánh giá, KHÔNG đúng/sai, KHÔNG ảnh hưởng sao).
- **Vi-tương tác "lật để đoán":** cứ sau 2–3 thẻ chèn 1 **thẻ lật**: mặt trước chỉ hiện hình → Pi mời "Em thử đoán từ này nhé!" → trẻ chạm **"Lật xem ↻"** để thấy từ + nghe. Đây là tự kiểm nhẹ, KHÔNG chấm điểm, KHÔNG biến S4 thành quiz.
- **Tự đọc khi mở:** khi vào màn (và mỗi lần sang thẻ mới), nếu công tắc "Tự đọc đề" BẬT → TTS tự đọc từ EN 1 lần (hỗ trợ trẻ chưa đọc thạo); trẻ vẫn bấm loa nghe lại bao nhiêu lần tuỳ thích.
- **Hành động trẻ:** nghe từ/câu (bao nhiêu lần tuỳ thích), đoán ở thẻ lật, tự đánh giá, vuốt hoặc "Tiếp".
- **Phản hồi:** nút loa có trạng thái "đang đọc" (sóng âm nhẹ); ưu tiên `audio` nhúng nếu `VocabItem.audio` có, fallback TTS.
- **Lối thoát:** hết bộ → màn nhỏ "Em đã xem hết từ! 🎉" + nút **"Luyện tập"** (→ S5) và "Về unit". Ghi `progress.save({skill:"vocab", effort+...})`.
- **Không tính giờ, không bắt trả lời** — đây là bước tiếp nhận; thẻ lật/tự đánh giá chỉ là nhịp chủ động nhẹ.

### S5 — Luyện tập (Engine sinh bài)
- **Mục đích:** luyện mẫu câu/từ qua `fill_blank` / `mcq` / `order_words` (+ `listen_choose`/`phonics_pick` nếu áp dụng) (US-C1/2/3).
- **Thành phần:** một chặng ngắn (gợi ý **5–8 câu**, 1 câu/màn để tập trung):
  - Vùng đề: `prompt` (VN hướng dẫn + câu EN có `___`); nút loa đọc câu/đề. **Khi vào màn (nếu công tắc "Tự đọc đề" BẬT) → TTS tự đọc 1 lần hướng dẫn VN + câu đề** để trẻ chưa đọc thạo biết phải làm gì.
  - Vùng trả lời theo `type`:
    - `fill_blank`: ô chọn/nhập từ (ưu tiên CHỌN từ thẻ để đỡ gõ; có loa từng lựa chọn).
    - `mcq`: **3** nút lựa chọn lớn (chữ và/hoặc hình) cho Level 1 (Pre-A1/A1), mỗi lựa chọn có loa; **mỗi nhiễu chỉ lệch ĐÚNG 1 yếu tố** so với đáp án (vd a/an), TRÁNH bày nhiều câu sai ngữ pháp toàn phần cùng lúc kẻo trẻ ghi nhớ mẫu sai.
    - `order_words`: **chạm-để-thêm** — chạm 1 thẻ từ (`tokens`) → thẻ bay vào khay; chạm thẻ TRONG khay → gỡ ra (KHÔNG bắt buộc kéo-thả). Vẫn có nút "Xoá thẻ cuối". **Level 1 giới hạn 3–5 token/câu** để khớp trí nhớ làm việc của trẻ.
    - `listen_choose`: nút "🔊 Nghe" lớn (đọc `audioText`) → chọn hình/từ.
  - **Preview lựa chọn:** với `mcq`/`listen_choose`, trẻ có thể **chạm-giữ** một lựa chọn để nghe trước khi chọn (không tính là đã chọn); hỗ trợ trẻ đọc kém.
  - Thanh tiến độ chặng ("Câu 4/6", dạng đốt sáng, không đếm ngược giờ).
  - Nút **"Kiểm tra"** (hoặc tự kiểm khi chọn xong với mcq/listen).
- **Hành động trẻ:** chọn/xếp/nghe → Kiểm tra.
- **Phản hồi (xem §5 chi tiết):**
  - **Đúng:** vùng xanh `--c-correct-soft` + ✓ + lời khen ngắn + (tuỳ) +1 sao; nút loa đọc lại **câu đúng** EN; "Tiếp →".
  - **Sai (động viên):** vùng cam `--c-try-soft` (KHÔNG đỏ) + icon "thử lại" + gợi ý NGẮN VN (từ `Exercise.explain`) + **luôn hiện & cho NGHE đáp án đúng** + nút **"Thử lại"**. Không trừ sao, không âm tiêu cực. Sau 2 lần chưa được → hiện sẵn đáp án đúng để chọn lại + "Mình cùng nghe câu đúng nhé" rồi cho qua (không kẹt).
- **Lối thoát:** hết chặng → **S7 Kết quả**. Nút "← Tạm dừng" giữa chừng → lưu tiến độ phần đã làm, về S3 không mất.
- **Bất biến gắn Engine:** mỗi bài đúng 1 đáp án; có `explain` VN; loại nghe luôn có `audioText` (CONTRACTS §2.4). Frontend dùng `seed` cố định khi cần tái lập.

### S6 — Nói (KHÔNG chấm điểm) — xem chi tiết §3
- **Mục đích:** luyện nói to, tự tin, không sợ sai (US-D1).
- **Thành phần:** câu mẫu (từ vocab/grammar) + nút **"🔊 Nghe mẫu"** (+ "Nghe chậm"); nút **"🎙️ Thu âm"** → "⏹ Dừng"; sau khi thu: 2 nút cạnh nhau **"▶ Nghe mẫu"** và **"▶ Nghe bản của em"** để TỰ SO SÁNH; nút "Thu lại"; nút "Câu tiếp".
- **Mini-mục tiêu vui (không chấm điểm):** mỗi câu nói xong giúp Pi **gom thêm 1 đom đóm** ("Nói 3 câu giúp Pi gom đom đóm nhé!") → bụng sao của Pi sáng thêm. Đây là đích tạo hứng thú dựa trên NỖ LỰC, KHÔNG phải điểm phát âm.
- **Hành động trẻ:** nghe mẫu → bấm thu → nói → tự nghe lại.
- **Phản hồi:** KHÔNG có điểm/đúng-sai/đánh giá phát âm. Sau khi thu, Pi **lặp lại câu theo cách đáng yêu** (hoặc reo vui) để trẻ thấy được "đáp lại". Pi khích lệ đồng hành ("Hay quá, mình thử lại nhé!"). Trực quan chỉ là sóng âm khi thu.
- **Gợi ý tự đánh giá có hướng dẫn** (vì trẻ 7–10 chưa tự đánh giá tốt): khi mời nghe lại, đưa 1 câu gợi ý CỤ THỂ, nhẹ nhàng theo câu mẫu — vd "Nghe xem em có nói được âm cuối /s/ trong *books* không?" — thay vì để trẻ tự mò "giống chưa".
- **Lối thoát:** "Xong" → màn "Em đã luyện nói! 🌟"; ghi `progress.save({skill:"speaking", score:null, effort++})`. Bản thu chỉ giữ tạm trong phiên (không lưu vĩnh viễn, không upload).
- **An toàn:** xin quyền micro lịch sự, có thể từ chối → vẫn nghe mẫu & nói (không thu) được. KHÔNG dùng nhận diện giọng để chấm.

### S7 — Kết quả chặng
- **Mục đích:** ăn mừng nỗ lực + mời ôn phần yếu (không phải "bảng điểm thi").
- **Thành phần:** linh vật Pi ăn mừng (trạng thái is-cheer, confetti có thể tắt); dòng to "Em làm xong rồi! 👏"; **sao đạt được chặng này** theo NỖ LỰC quan sát được (xem 3 mức dưới); 1 dòng tích cực ("Em đã luyện X câu"); nếu có phần yếu: thẻ **"Ôn lại: [điểm ngữ pháp/từ]"** (đẩy vào `reviewQueue`); nút **"Tiếp"** (về S3) và "Học mục khác".
- **3 mức sao theo NỖ LỰC (KHÔNG phạt đúng/sai), để trẻ có lý do tự nhiên cố thêm:**
  - ⭐ 1 sao = **hoàn thành** chặng (mức nền, ai cũng đạt được).
  - ⭐⭐ 2 sao = **làm hết, không bỏ qua câu nào**.
  - ⭐⭐⭐ 3 sao = **tự sửa lại các câu sai trong `reviewQueue`** (quay lại làm phần yếu). Vì gắn với nỗ lực sửa chứ không phải làm đúng ngay, sao 3 mức không bao giờ là "điểm thi".
- **Phản hồi:** nếu vừa đạt mốc/huy hiệu → toast huy hiệu (§4). Nếu mở khoá unit mới → báo nhẹ "Mở khoá unit mới!". Nếu `mastery` của unit còn thấp dù đã hoàn thành → S7 chủ động gợi "Ôn lại một chút cho chắc nhé" thay vì đẩy đi tiếp (xem §4.7).
- **Lối thoát:** S3 hoặc S2. Gợi ý nghỉ mắt nếu đã học liên tục nhiều chặng ("Nghỉ mắt 20 giây nhìn ra xa nhé 👀"). Nếu đã qua ~2–3 chặng trong phiên → hiện **điểm dừng tích cực** (§4.6).

### S8 — Trang phụ huynh (tối thiểu — đồng hành, không giám sát) (US-F3)
- **Mục đích:** giúp phụ huynh đồng hành, KHÔNG biến thành bảng điểm/giám sát.
- **Cổng vào (chặn-trẻ, KHÓ hơn tầm trẻ tiểu học):** vì đối tượng là trẻ 7–10 ĐÃ làm được cộng đơn giản, KHÔNG dùng "7 + 5 = ?". Dùng một trong các cách (frontend chọn 1, đổi luân phiên): **phép nhân 2 chữ số** ("Dành cho người lớn: 13 × 12 = ?"), HOẶC **giữ nút 3 giây + nhập năm sinh người lớn**, HOẶC **gõ một từ tiếng Anh dài** hiển thị sẵn. KHÔNG phải đăng nhập (MVP offline). Không lưu PII.
- **Lớp xác nhận riêng cho XOÁ hồ sơ:** chức năng xoá hồ sơ con phải có thêm 1 bước xác nhận độc lập (gõ lại/hai bước), ngoài cổng vào — giữ nguyên như đã có.
- **Thành phần:** với mỗi con (đọc `progress.getMastery`): chủ đề đang học; **% thành thạo theo unit & theo kỹ năng** (vocab/grammar/phonics/listening/speaking-không-điểm/reading); **gợi ý "Chơi cùng con 5 phút"** (1–2 ý cụ thể theo unit); mục tiêu tuần MỀM ("4 ngày/tuần", có công tắc TẮT, có "vé nghỉ phép"); **công tắc "Điểm dừng tích cực"** (Bật/Tắt + chỉnh ngưỡng số chặng, §4.6); nút **Export JSON** / **Import JSON** (backup & chuyển máy); quản lý hồ sơ con (đổi avatar/tên/xoá có xác nhận 2 lớp).
- **KHÔNG có:** bảng xếp hạng, so sánh giữa các con, điểm phát âm, đếm giờ học, cảnh báo "đứt chuỗi".
- **Lối thoát:** "← Về app của con" → S2.

### S9 — Cài đặt
- **Mục đích:** điều khiển trải nghiệm & khả năng truy cập (US-G2, UDL).
- **Thành phần (công tắc lớn, có nhãn):** **Tự đọc đề khi mở bài (BẬT mặc định)** — TTS tự đọc hướng dẫn VN + câu đề khi vào mỗi màn bài tập/flashcard, hỗ trợ trẻ chưa đọc thạo; Âm thanh on/off; Hiệu ứng động on/off (mặc định theo `prefers-reduced-motion`); Tốc độ TTS (Thường / Chậm); Giọng EN (Anh-Anh / Anh-Mỹ nếu có); Tương phản cao (`data-contrast="high"`); Cỡ chữ (Vừa/Lớn). Nếu thiếu giọng EN: dòng cảnh báo nhẹ vàng + hướng dẫn, không vỡ luồng.
- **Lối thoát:** ← về màn trước.

---

## 3. MẢNG "NÓI" — KHÔNG CHẤM ĐIỂM (chi tiết)

> Triết lý (review mục 13, cảnh báo): **tuyệt đối không dùng nhận diện giọng để báo "sai phát âm".** Mục tiêu là trẻ NÓI TO, tự tin, tự so sánh với mẫu. Ghi nhận **nỗ lực**, không điểm.

**Vòng lặp 4 nhịp cho mỗi câu:**

```
   ① NGHE MẪU                ② NHẮC LẠI               ③ THU ÂM                ④ NGHE LẠI
 ┌───────────────┐  →   ┌────────────────┐  →   ┌────────────────┐  →  ┌───────────────────┐
 │ 🔊 Nghe mẫu   │      │ Pi:"Nói theo   │      │ 🎙️ Thu âm      │     │ ▶ Mẫu | ▶ Bản em  │
 │ (Nghe chậm)   │      │  mình nhé!"    │      │ → ⏹ Dừng       │     │ (tự so sánh)      │
 │ nghe bao nhiêu│      │ (không ép, chỉ │      │ sóng âm khi thu│     │ "Thu lại" / "Tiếp"│
 │ lần tuỳ thích │      │  khích lệ)     │      │                │     │                   │
 └───────────────┘      └────────────────┘      └────────────────┘     └───────────────────┘
```

- **Không có:** điểm số, %, "đúng/sai", màu đỏ, xếp hạng giọng. Không gọi Web Speech Recognition để đánh giá.
- **Phản hồi duy nhất:** lời đồng hành tích cực + cho trẻ TỰ nghe lại để tự điều chỉnh.
- **Quyền micro:** hỏi lịch sự khi lần đầu chạm "Thu âm"; nếu từ chối → ẩn nút thu, vẫn dùng được Nghe mẫu + Nhắc lại (vẫn ghi effort cho việc luyện nghe-nói theo).
- **Lưu trữ:** bản thu chỉ trong RAM/phiên, KHÔNG ghi đĩa, KHÔNG upload. Khi rời màn → xoá.
- **Tiến độ:** `progress.save({ childId, level, unit, skill:"speaking", score:null, attempts, ts, effort })` — `score` LUÔN `null` (CONTRACTS §3.2). UI không bao giờ hiển thị "điểm nói".
- **Copy mẫu:** "Em nghe Pi nói trước nhé." · "Tới lượt em! Nói to vào nào." · "Nghe lại xem giống chưa? Không sao nếu khác chút — mình luyện thêm là giỏi!" · (tự đánh giá có hướng dẫn) "Nghe xem em có nói được âm cuối /s/ không?"

---

## 4. GAMIFICATION LÀNH MẠNH (nỗ lực–hoàn thành)

> Nguyên tắc: thưởng cho **luyện tập & hoàn thành**, không chỉ cho "trả lời đúng". KHÔNG streak cứng, KHÔNG đếm giờ, KHÔNG dark pattern, KHÔNG so sánh giữa trẻ. Mọi mốc nhỏ, dễ đạt, để duy trì động lực mà không gây lo âu.

### 4.1. Bốn trụ cột

| Cơ chế | Mô tả | Nguồn dữ liệu | Lành mạnh vì |
|---|---|---|---|
| **Sao ⭐ (hoàn thành)** | Mỗi chặng/hoạt động xong được sao; thưởng theo HOÀN THÀNH + nỗ lực, không trừ khi sai | `effort`, `attempts` trong record | Trẻ làm chậm/sai vẫn tiến bộ; không "cày đúng" |
| **Huy hiệu 🏅** | Thành tích gắn mạch kiến thức (xem 4.3) | `getMastery` + `effort` | Khuyến khích ôn ĐỦ các kỹ năng, không đua điểm |
| **Thanh tiến độ + Bản đồ mở khoá 🗺️** | Mỗi unit có % thành thạo; unit kế mở khi unit trước đạt ngưỡng nhẹ | `masteryPct` | Tiến bộ THẤY ĐƯỢC; mở khoá là phần thưởng tự thân |
| **Mục tiêu tuần MỀM + Vé nghỉ phép 🎟️** | "Học X ngày/tuần"; có thể TẮT; nghỉ không bị phạt nhờ `graceTickets` | `weeklyDays`, `effort.graceTickets` | Tạo thói quen, KHÔNG lo "đứt chuỗi" |

### 4.2. Bảng cơ chế thưởng (điều kiện · biểu tượng · thông điệp)

| Điều kiện đạt | Biểu tượng | Thông điệp (VN, thân thiện) |
|---|---|---|
| Xem hết bộ flashcard 1 unit | ⭐ | "Em đã xem hết từ mới! Giỏi lắm." |
| Hoàn thành 1 chặng Luyện tập (bất kể đúng/sai) | ⭐⭐ | "Em luyện xong rồi — kiên trì ghê!" |
| Hoàn thành lượt Nói (nghe→nhắc→thu→nghe lại) | ⭐ | "Em đã can đảm nói tiếng Anh! 🌟" |
| Đạt ≥ ngưỡng thành thạo 1 unit (vd masteryPct ≥ 60) | 🏅 Huy hiệu unit | "Em đã chinh phục [chủ đề]! Mở khoá unit mới." |
| Học đủ mục tiêu tuần mềm | 🌱 (mầm tuần) | "Tuần này em đã học chăm. Cây nhỏ lớn thêm rồi!" |
| Quay lại học sau khi nghỉ | 🦊 Pi vui | "Mừng em quay lại! Mình học tiếp nào." (KHÔNG trách nghỉ) |

> Sao là tích luỹ theo hồ sơ; hiển thị tổng nhẹ ở S1/S2. KHÔNG có "mất sao".

### 4.3. Huy hiệu gắn mạch kiến thức Level 1 (khuyến khích ôn đủ)
- 🔤 **"Nhà sưu tầm từ"** — xem hết từ vựng N unit.
- 🧩 **"Thợ ghép câu"** — hoàn thành order_words ở N unit.
- 👂 **"Đôi tai vàng"** — hoàn thành listen_choose/nghe-chọn-hình.
- 🗣️ **"Người dũng cảm nói"** — luyện Nói ở N câu/N unit (theo effort, KHÔNG theo phát âm).
- 🔡 **"Thám tử âm chữ"** (P1) — hoàn thành phonics_pick.
- Tên huy hiệu gắn KỸ NĂNG để trẻ được khích lệ luyện đủ các mặt, không thiên mỗi quiz.

### 4.4. Mục tiêu tuần mềm & vé nghỉ phép (quy tắc)
- `weeklyDays` từ `getMastery` chỉ để **động viên**; mặc định mục tiêu = 4 ngày/tuần, **có công tắc TẮT** ở S8.
- Hiển thị dạng "mầm cây/đếm ngày tích cực", KHÔNG đỏ/không cảnh báo khi thiếu.
- **Vé nghỉ phép (`graceTickets`)**: nghỉ vẫn được chào đón; không có khái niệm "đứt chuỗi". Trở lại sau nghỉ → Pi mừng (không trách).
- TUYỆT ĐỐI không: đồng hồ đếm ngược tạo áp lực, "chỉ còn X giờ giữ chuỗi", popup đòi quay lại, mua sao/vật phẩm, quảng cáo, link ra ngoài.

### 4.5. Ăn mừng vừa phải
- Confetti + âm vui khi đạt mốc; thời lượng ngắn (~1s); **nút tắt âm thanh & hiệu ứng** ở S9; tôn trọng `prefers-reduced-motion` (dùng `--t-base`/`--ease-bounce` tiết chế).
- Không nhấp nháy mạnh/đèn flash; tương phản & chữ to giữ theo `tokens.css`.

### 4.6. Điểm dừng tích cực (khép phiên lành mạnh — KHÔNG khoá cứng)
- Trẻ 7–10 dễ cuốn màn hình; chỉ "gợi ý nghỉ" thụ động chưa đủ. Sau **~2–3 chặng** trong 1 phiên, Pi xuất hiện chúc mừng: *"Hôm nay em học giỏi lắm rồi, nghỉ chút nhé!"*
  - **CTA chính:** **"Tạm biệt Pi 👋"** (đóng phiên vui vẻ, Pi vẫy tay).
  - **CTA phụ:** **"Học thêm một chút"** (trẻ tự quyết, không bị chặn).
- Đây là **lời mời dừng**, KHÔNG phải khoá cứng / không đếm ngược / không phạt. Có **công tắc Bật/Tắt** ở S8 (trang phụ huynh) để gia đình tự chỉnh ngưỡng chặng.
- Trẻ cũng có thể tự đặt "Hôm nay học 1 chủ đề là đủ" — sau khi xong 1 unit-hoạt động, Pi gợi nhẹ "Hôm nay vậy là đủ rồi nhé" nhưng không ép.

### 4.7. Hai chỉ số tách bạch: `completion` vs `mastery` (chống mở khoá hời hợt)
> Vì sao thưởng theo HOÀN THÀNH (rất tốt cho động lực) nhưng nếu mở khoá unit cũng chỉ theo "đã làm xong" thì trẻ mở unit mới mà chưa nắm từ/cấu trúc → phá i+1, unit sau quá tải. Do đó tách 2 chỉ số:

| Chỉ số | Tính từ | Dùng để |
|---|---|---|
| **`completion`** (nỗ lực) | đã xem/đã làm xong các hoạt động, bất kể đúng/sai | **trao sao + huy hiệu**; KHÔNG bao giờ chặn trẻ |
| **`mastery`** (độ nắm) | **tỉ lệ đúng ở LẦN LÀM ĐẦU** mỗi câu + độ thuộc qua ôn lại (`reviewQueue`/lặp ngắt quãng nhẹ) | **gợi ý ôn** + tô % thành thạo ở S2/S8 |

- **Mở khoá unit dựa trên `completion`** (đã hoàn thành unit trước) để KHÔNG chặn trẻ.
- **Nếu `mastery` thấp** (vd < 60%) dù đã hoàn thành → S7/S2 **chủ động gợi "Ôn lại một chút"** (đẩy phần yếu vào `reviewQueue`), thay vì đẩy thẳng sang unit mới. Đây là "rào mềm" sư phạm, không phải khoá.
- **Công thức gợi ý (ghi để CONTRACTS đồng bộ):**
  - `completionPct(unit)` = (số hoạt động đã hoàn thành / tổng hoạt động) × 100.
  - `masteryPct(unit)` ≈ trung bình `firstTryCorrect` của các câu trong unit, có nâng nhẹ theo số lần ôn đúng lại (clamp 0–100). Speaking (`score:null`) KHÔNG tính vào mastery, chỉ tính completion/effort.
- Thanh % ở S2 hiển thị **`masteryPct`** (độ nắm), không phải completion, để % phản ánh thực chất.

---

## 5. TRẠNG THÁI & PHẢN HỒI

### 5.1. Trả lời ĐÚNG
- Màu: nền `--c-correct-soft`, viền/nét `--c-correct`; icon ✓ + chữ "Đúng rồi!".
- Hành vi: nút loa đọc lại **câu/đáp án đúng EN** (củng cố mẫu đúng); (tuỳ) +sao; nút "Tiếp →".
- Copy luân phiên: "Đúng rồi! 🎉" · "Chuẩn luôn!" · "Em nhớ tốt ghê!" · "Tuyệt vời!"
- Âm: chuông vui ngắn (tắt được). Không kéo dài.

### 5.2. Trả lời SAI (động viên, không phạt)
- Màu: nền `--c-try-soft` **cam ấm (KHÔNG đỏ)**, icon "↺ thử lại" + chữ "Gần đúng rồi!".
- Hành vi bắt buộc: (1) gợi ý NGẮN bằng VN từ `Exercise.explain`; (2) **luôn HIỆN + cho NGHE đáp án đúng**; (3) nút **"Thử lại"**; (4) không trừ sao, không âm tiêu cực.
- Chống kẹt: sau 2 lần chưa được → tô sáng đáp án đúng để chọn lại + "Mình cùng nghe câu đúng nhé", rồi cho qua. Đẩy mục này vào `reviewQueue` để ôn lại sau.
- Copy luân phiên: "Gần đúng rồi, thử lại nhé!" · "Không sao đâu, cùng nghe lại nào." · "Sắp được rồi! Mình xem đáp án đúng nhé."

### 5.3. Đang tải / chờ
- Skeleton/placeholder thẻ (không spinner gắt); linh vật Pi nhỏ "Đang chuẩn bị bài…".
- Nếu nội dung unit chưa tải xong (offline cache): hiển thị nhẹ "Đang mở bài học…"; không bao giờ màn trắng.
- TTS đang đọc: nút loa có trạng thái "đang phát"; chặn double-tap chồng tiếng.

### 5.4. Lỗi / thiếu tài nguyên (US-G2)
- Thiếu giọng EN: dải vàng `--c-warn-soft` "Máy chưa có giọng tiếng Anh — em vẫn xem chữ và học được nhé", kèm hướng dẫn ngắn; KHÔNG vỡ luồng.
- Micro bị từ chối (S6): ẩn nút Thu âm, vẫn cho Nghe mẫu + Nhắc lại.
- Storage đầy/hỏng: bắt lỗi, báo nhẹ "Chưa lưu được tiến độ lần này"; app vẫn chạy (try/catch theo ARCHITECTURE §3).

### 5.5. Onboarding & rỗng (empty states)
- Lần đầu (chưa có hồ sơ): vào S0.
- Unit chưa học (0%): thanh tiến độ rỗng + nhãn "Chưa học" (kèm chữ, không chỉ màu) + nút "Bắt đầu".
- Phụ huynh chưa có dữ liệu: "Con chưa học buổi nào — cùng bắt đầu chủ đề đầu tiên nhé!".

---

## 6. WIREFRAME LOW-FI (4 màn chính)

### W1 — S2 Bản đồ Unit (Trang nhà)
```
┌───────────────────────────────────────────────┐
│ 🦊 Chào Bé Na!            [👪 Phụ huynh] [⚙️]   │
│ Tuần này em đã học 3 ngày 🌱  ⭐ 24             │
├───────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐            │
│  │ ✏️ Đồ dùng    │  │ 🧸 Đồ chơi    │           │
│  │   học tập 🔊  │  │      🔊       │           │
│  │ ███████░░ 70% │  │ ██░░░░░░ 20%  │           │
│  │   ⭐⭐⭐  ✓    │  │   ⭐         │           │
│  │  [ Học tiếp ] │  │  [ Học ]     │            │
│  └──────────────┘  └──────────────┘            │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ 🔒 Cơ thể    │  │ 🔒 Nghề      │             │
│  │  (mở sau)    │  │  (mở sau)    │             │
│  └──────────────┘  └──────────────┘            │
└───────────────────────────────────────────────┘
```

### W2 — S4 Flashcard từ vựng
```
┌───────────────────────────────────────────────┐
│ ← Quay lại     Từ vựng · Đồ dùng học tập   🔊  │
├───────────────────────────────────────────────┤
│                  Thẻ 3 / 8                      │
│        ┌─────────────────────────────┐         │
│        │                             │         │
│        │            🍎               │  ← icon to│
│        │                             │         │
│        │          apple              │  ← từ EN │
│        │        (quả táo)            │  ← nghĩa │
│        │      "It's an apple."       │  ← câu   │
│        └─────────────────────────────┘         │
│     [ 🔊 Đọc từ ]      [ 🔊 Đọc câu ]           │
│                                                 │
│   [ ← Trước ]                 [  Tiếp →  ]      │
└───────────────────────────────────────────────┘
```

### W3 — S5 Luyện tập (mcq) + trạng thái SAI (động viên)
```
┌───────────────────────────────────────────────┐
│ ← Tạm dừng    Luyện tập · Câu 4/6          🔊  │
├───────────────────────────────────────────────┤
│  Chọn câu đúng cho bức tranh:              🔊  │
│              🍎   (What is this?)               │
│                                                 │
│  [  It's a apple.   🔊 ]   ← nhiễu: lệch 1 (a/an)│
│  [  It's an apple.  🔊 ]   ← đáp án đúng        │
│  [  It's an apples. 🔊 ]   ← nhiễu: lệch 1 (số) │
│   (chỉ 3 lựa chọn; mỗi nhiễu sai ĐÚNG 1 yếu tố)│
├───────────────────────────────────────────────┤
│ ┌── nền CAM ẤM (không đỏ) ──────────────────┐  │
│ │ ↺ Gần đúng rồi!                           │  │
│ │ Trước nguyên âm (a-e-i-o-u) dùng "an".    │  │
│ │ ✔ Đáp án đúng:  It's an apple.   [ 🔊 ]   │  │
│ │            [  Thử lại  ]                   │  │
│ └───────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

### W4 — S6 Nói (không chấm điểm)
```
┌───────────────────────────────────────────────┐
│ ← Quay lại        Nói · Đồ dùng học tập    🔊  │
├───────────────────────────────────────────────┤
│   Nói theo Pi nhé! 🦊  (không chấm điểm)        │
│                                                 │
│        ┌─────────────────────────────┐         │
│        │      "It's an apple."        │        │
│        └─────────────────────────────┘         │
│      [ 🔊 Nghe mẫu ]   [ 🐢 Nghe chậm ]         │
│                                                 │
│            [ 🎙️  Thu âm ]                       │
│      ───  (sóng âm khi đang thu)  ───           │
│                                                 │
│   [ ▶ Nghe mẫu ]      [ ▶ Nghe bản của em ]     │
│   [ Thu lại ]                  [ Câu tiếp → ]   │
└───────────────────────────────────────────────┘
```

---

## 7. QUY TẮC AN TOÀN — checklist cho Frontend (BẮT BUỘC)

1. **Không mạng trong app trẻ:** S0–S7/S9 KHÔNG `fetch` ngoài/Firebase/analytics; chỉ same-origin content. Cloud chỉ ở trang phụ huynh khi opt-in (ARCHITECTURE ADR-7). MVP: 100% local.
2. **Không PII trẻ:** chỉ avatar emoji + biệt danh; không tên thật/ngày sinh/ảnh; `childId` ngẫu nhiên.
3. **Phản hồi sai luôn mang tính phát triển:** gợi ý + nghe/thấy đáp án đúng + thử lại; không đỏ gắt, không âm tiêu cực, không xếp hạng.
4. **Nói không chấm điểm:** không nhận diện giọng đánh giá; `score:null`; bản thu chỉ trong phiên, không upload.
5. **Không dark pattern:** không streak cứng, không đếm ngược áp lực, không phạt khi nghỉ, không mua bán/quảng cáo/link ngoài.
6. **Tôn trọng nghỉ ngơi:** gợi ý nghỉ mắt sau vài chặng; phiên ngắn; không hiệu ứng nhấp nháy mạnh.
7. **Khả năng truy cập (UDL/WCAG AA):** chữ to (≥18px), tương phản đạt AA, vùng chạm ≥48px, thao tác bàn phím + focus ring (`--c-focus-ring`), nhãn cho screen reader, không truyền tin chỉ bằng màu; mọi EN có TTS; có chế độ tương phản cao & cỡ chữ lớn.
   - **`order_words` KHÔNG bắt buộc kéo-thả:** dùng cơ chế **chạm-để-thêm / chạm-để-gỡ**; hỗ trợ bàn phím (Tab di chuyển giữa thẻ + Enter để thêm/gỡ), có nhãn screen-reader cho từng thẻ và khay. Level 1 giới hạn 3–5 token/câu.
9. **Tự đọc đề hỗ trợ trẻ chưa đọc thạo:** khi vào màn bài tập/flashcard, nếu công tắc "Tự đọc đề" BẬT (mặc định) → TTS đọc 1 lần hướng dẫn VN + câu đề; cho **chạm-giữ** lựa chọn để nghe trước (preview) mà không bị tính là đã chọn.
8. **Lưu chịu lỗi:** mọi truy cập storage try/catch; mất lưu không vỡ app.

---

## 8. CÁC QUYẾT ĐỊNH UX CHÍNH (tóm tắt)

- **Bản đồ mở khoá thay vì khoá cứng theo điểm:** unit kế mở khi `completion` unit trước đạt (đã hoàn thành), KHÔNG chặn trẻ theo điểm; nếu `mastery` còn thấp thì S7/S2 gợi "ôn lại" (rào mềm) thay vì khoá. Hai chỉ số `completion` (nỗ lực→sao) và `mastery` (độ nắm→% và gợi ôn) tách bạch — xem §4.7. Trong unit các hoạt động KHÔNG khoá nhau (chỉ gợi ý thứ tự).
- **1 câu/màn ở Luyện tập:** giảm tải nhận thức, dễ tập trung cho trẻ đọc chậm; thanh tiến độ dạng đốt sáng, KHÔNG đếm giờ.
- **"Sai" = cam ấm + nghe đáp án đúng + thử lại + chống kẹt sau 2 lần:** biến lỗi thành cơ hội học, không gây xấu hổ.
- **Nói tách hẳn khỏi mọi chấm điểm:** 4 nhịp nghe→nhắc→thu→nghe-lại, tự so sánh; ghi nhận nỗ lực (effort), score:null.
- **Gamification theo HOÀN THÀNH, không theo đúng-sai:** sao cho việc luyện xong; huy hiệu gắn kỹ năng để ôn đủ; mục tiêu tuần mềm + vé nghỉ phép, không streak.
- **Trang phụ huynh = đồng hành, không giám sát:** gợi ý chơi cùng 5 phút, % thành thạo, Export/Import; KHÔNG bảng xếp hạng/so sánh/điểm phát âm/đếm giờ. Cổng người-lớn **khó hơn tầm trẻ tiểu học** (nhân 2 chữ số / năm sinh / từ EN dài), không đăng nhập ở MVP; xoá hồ sơ có xác nhận 2 lớp.
- **Điểm dừng tích cực sau ~2–3 chặng:** Pi mời nghỉ với CTA "Tạm biệt Pi" (chính) + "Học thêm một chút" (phụ) — khép phiên lành mạnh, không khoá cứng, bật/tắt ở S8.
- **Linh vật Pi (cáo đom đóm) làm "người đồng hành" giọng nói tích cực**, đảm nhận khích lệ ở mọi trạng thái (đặc biệt khi sai & khi quay lại sau nghỉ); một nhân vật DUY NHẤT đồng bộ với DESIGN.md (§0).
- **Mọi đề đọc được bằng TTS + nút đọc chậm + fallback chữ;** ưu tiên `audio` nhúng cho từ/phonics khi có (tránh TTS đọc sai âm — cảnh báo sư phạm mục 13).

---

## Đã tiếp thu review (vòng P1 → đã vá trong file này)

> Chỉ liệt kê thay đổi thuộc UX_FLOWS.md (area = ux-flow / engagement / noi-dung / accessibility liên quan luồng). Các phát hiện thuộc DESIGN.md / tokens.css / base.css / BACKLOG_MVP.md do tài liệu khác xử lý.

1. **[noi-dung · cao] Chốt 1 linh vật duy nhất:** đổi toàn bộ "Ò (cú mèo) 🦉" → **Pi (cáo đom đóm) 🦊**, đồng bộ với DESIGN.md/preview. Thêm **§0 Bảng nhân vật chuẩn** làm nguồn sự thật chung (tên/loài/emoji/SVG/biến thể mặt).
2. **[ux-flow · cao] Hỗ trợ trẻ chưa đọc thạo:** thêm bất biến + công tắc S9 **"Tự đọc đề khi mở bài (BẬT mặc định)"** (TTS tự đọc hướng dẫn VN + câu đề khi vào S4/S5); thêm **chạm-giữ để nghe trước (preview)** mỗi lựa chọn ở mcq/listen.
3. **[engagement · tb] Flashcard chủ động hơn (S4):** chèn **thẻ "lật để đoán"** sau mỗi 2–3 thẻ + nút **"Mình nhớ rồi / Xem lại"** (không thành quiz, không chấm điểm).
4. **[feasibility · tb] Tách `completion` vs `mastery`:** thêm **§4.7** với công thức gợi ý; mở khoá theo `completion` (không chặn trẻ), `mastery` thấp → S7/S2 gợi "ôn lại" (rào mềm); thanh % ở S2 hiển thị `masteryPct`.
5. **[noi-dung · tb] Sửa đề mẫu W3:** copy tự nhiên ("Chọn câu đúng cho bức tranh", neo *What is this?*); giảm còn **3 lựa chọn**, mỗi nhiễu **lệch đúng 1 yếu tố** (a/an, số ít/nhiều), tránh phơi nhiều câu sai ngữ pháp toàn phần.
6. **[ux-flow · tb] Cổng phụ huynh khó hơn:** bỏ "7 + 5 = ?"; dùng nhân 2 chữ số / năm sinh người lớn / từ EN dài; **xoá hồ sơ có xác nhận 2 lớp** (S8).
7. **[engagement · tb] Điểm dừng tích cực (§4.6):** sau ~2–3 chặng, Pi mời nghỉ — CTA chính "Tạm biệt Pi", phụ "Học thêm một chút"; không khoá cứng; **bật/tắt + chỉnh ngưỡng ở S8**.
8. **[accessibility · tb] `order_words` không bắt buộc kéo-thả:** quy định **chạm-để-thêm / chạm-để-gỡ** + hỗ trợ bàn phím (Tab + Enter) + nhãn screen-reader; giới hạn **3–5 token/câu** ở Level 1.
9. **[engagement · thap] Nói (S6) có "đích" vui:** thêm mini-mục tiêu **"nói 3 câu giúp Pi gom đom đóm"**, Pi **lặp lại đáng yêu** sau khi thu, và **gợi ý tự đánh giá có hướng dẫn** (vd âm cuối /s/) — vẫn KHÔNG chấm điểm.
10. **[ux-flow · thap] Sao S7 3 mức theo nỗ lực:** 1 sao hoàn thành · 2 sao không bỏ câu nào · 3 sao tự sửa câu sai trong `reviewQueue` — không phạt đúng/sai nhưng tạo lý do cố thêm.

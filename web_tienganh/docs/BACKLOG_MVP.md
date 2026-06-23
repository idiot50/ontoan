# BACKLOG — MVP Level 1 (Web học tiếng Anh trẻ em)

> Phạm vi: **MVP Level 1** (vài unit đầu của Level 1). Mục tiêu P0–P1: chốt phạm vi để 4 luồng song song bám theo.
> Tham chiếu: `en_md/KE_HOACH_WEBSITE_TIENGANH.md` (GĐ 1, mục 4, mục 13) + `docs/CONTRACTS.md` (v1).
>
> **Mức ưu tiên:** P0 = bắt buộc cho MVP chạy được · P1 = nên có trong MVP · P2 = sau MVP (ghi nhận để khỏi quên).
>
> **Nguyên tắc nghiệm thu xuyên suốt (review sư phạm mục 13 — áp cho MỌI story):**
> - Mọi đề/từ/câu hỏi tiếng Anh **đọc được bằng TTS** (có nút loa).
> - UI tiếng Việt, nút to, ít chữ, biểu tượng kèm chữ, không phụ thuộc chỉ màu sắc (WCAG AA).
> - Phản hồi sai = **gợi ý nhẹ + luôn cho NGHE/THẤY đáp án đúng**, cho thử lại, không âm thanh tiêu cực.
> - Động lực thiên **nỗ lực–tiến bộ** (hoàn thành luyện tập), KHÔNG streak cứng, KHÔNG đếm giờ mặc định.
> - Phiên học ngắn 5–10 phút.

---

## Phạm vi MVP Level 1 (chốt)

**TRONG phạm vi:** chọn unit → học từ vựng (flashcard + TTS) → làm bài (`fill_blank` / `mcq` / `order_words`) →
Nói-không-chấm-điểm (nghe → nhắc lại → thu âm tự nghe lại) → tiến độ local + trang phụ huynh tối thiểu.
Nội dung: 2–4 unit đầu Level 1 (vocab + 3–4 điểm ngữ pháp + phonics cơ bản).

**NGOÀI phạm vi MVP (P2):** đồng bộ Firebase đầy đủ, đăng nhập phụ huynh online, đọc hiểu dài, kiểm tra unit/level chấm điểm, test xếp lớp, nhận diện giọng nói chấm phát âm, PWA cài đặt (chỉ để khung).

---

## EPIC A — Chọn unit & điều hướng

### US-A1 — Chọn unit để học  **[P0]**
**Là một** học sinh, **tôi muốn** chọn một unit từ màn hình chính, **để** bắt đầu học chủ đề mình thích.
- **Given** có danh sách unit Level 1 (đọc từ `content/level1/index.json`),
  **When** trẻ mở app, **Then** thấy các unit dạng thẻ lớn có icon + tên chủ đề **tiếng Việt** + thanh tiến độ.
- **Given** một unit, **When** trẻ chạm vào thẻ, **Then** vào màn hình unit với các hoạt động: Từ vựng, Làm bài, Nói (và Phonics nếu có).
- **Given** đề/nhãn, **When** trẻ chạm nút loa, **Then** TTS đọc tên chủ đề.

### US-A2 — Quay lại / chọn hoạt động trong unit  **[P0]**
**Là một** học sinh, **tôi muốn** thấy các hoạt động trong unit và quay lại dễ dàng, **để** không bị lạc.
- **Given** màn hình unit, **When** trẻ chọn một hoạt động rồi nhấn "Quay lại", **Then** trở về danh sách hoạt động, không mất tiến độ phiên.

---

## EPIC B — Học từ vựng (Flashcard + TTS)

### US-B1 — Flashcard từ vựng có hình, câu ngữ cảnh, âm  **[P0]**
**Là một** học sinh, **tôi muốn** xem thẻ từ có hình + nghe phát âm + thấy câu ví dụ, **để** nhớ từ trong ngữ cảnh chứ không chỉ nghĩa rời.
- **Given** một `VocabItem` (word, vi, icon, example), **When** thẻ hiển thị, **Then** thấy icon + từ EN + nghĩa VN + câu ví dụ; có nút loa đọc **từ** và nút loa đọc **câu**.
- **Given** từ có trường `audio`, **When** trẻ nghe, **Then** ưu tiên phát file audio chuẩn; nếu không có → dùng TTS.
- **Given** đang xem thẻ, **When** trẻ vuốt/nhấn "Tiếp", **Then** sang từ kế tiếp; hết bộ → nút "Luyện tập".
> Sư phạm: dạy theo CHUNK (vd "a red pen"), luôn HÌNH + CÂU + ÂM (review mục 4.1, 13 điểm 6).

### US-B2 — Nhận biết trước khi sản sinh (nghe→chọn hình, hình→chọn từ)  **[P1]**
**Là một** học sinh, **tôi muốn** chơi nghe→chọn hình và hình→chọn từ, **để** nhận biết từ trước khi phải tự nhớ.
- **Given** bộ từ đã xem, **When** vào trò nhận biết, **Then** TTS đọc 1 từ → trẻ chọn 1 trong 3–4 hình; chọn đúng → khen, sai → đánh dấu nhẹ và cho nghe lại + chỉ đáp án đúng.

---

## EPIC C — Làm bài tập (Engine sinh bài)

### US-C1 — Bài điền chỗ trống (fill_blank)  **[P0]**
**Là một** học sinh, **tôi muốn** điền dạng đúng vào chỗ trống, **để** luyện mẫu câu vừa học.
- **Given** một `GrammarPoint` có `safeZone`, **When** engine `generate({type:"fill_blank",...})`, **Then** hiện câu có `___` + chỗ nhập/chọn; có đúng 1 đáp án.
- **Given** trẻ trả lời, **When** đúng → khen + ghi tiến độ; **When** sai → hiện đáp án đúng + giải thích VN ngắn + nút nghe câu đúng, cho thử lại.

### US-C2 — Trắc nghiệm (mcq)  **[P0]**
**Là một** học sinh, **tôi muốn** chọn đáp án đúng trong nhiều lựa chọn, **để** kiểm tra hiểu biết nhanh.
- **Given** spec mcq, **When** engine sinh bài, **Then** có ≥4 lựa chọn, đúng 1 đáp án, không lựa chọn nhiễu nào tình cờ cũng đúng (bất biến §2.4).
- **Given** câu nhiễu, **When** xây dựng, **Then** nhiễu ưu tiên lấy từ lỗi điển hình người Việt (sai thì/thiếu -s/sai giới từ) qua `distractors`.

### US-C3 — Sắp xếp trật tự từ (order_words)  **[P0]**
**Là một** học sinh, **tôi muốn** kéo/chạm các thẻ từ để xếp thành câu đúng, **để** nắm trật tự câu tiếng Anh.
- **Given** spec order_words, **When** engine sinh bài, **Then** trả `tokens[]` đã xáo + `answer` là thứ tự đúng.
- **Given** trẻ xếp xong, **When** kiểm tra, **Then** đúng → khen + đọc câu bằng TTS; sai → giữ thẻ, gợi ý nhẹ, cho thử lại; sau cùng luôn được nghe câu đúng.

### US-C4 — Vùng-an-toàn cho engine (chất lượng ngôn ngữ)  **[P0, ngầm]**
**Là một** người soạn nội dung, **tôi muốn** engine chỉ ráp bài trong `safeZone`, **để** không sinh câu sai ngữ pháp cho trẻ.
- **Given** mọi tổ hợp slot biên soạn liệt kê, **When** engine ráp, **Then** câu đúng ngữ pháp (a/an, số nhiều, bất quy tắc) và có đúng 1 đáp án — KHÔNG tổ hợp tự do ngoài `slots` (CONTRACT §1.4.1, §2.4).
- **Given** seed cố định, **When** sinh lại, **Then** ra kết quả y hệt (QA test property).

---

## EPIC D — Nói (không chấm điểm)  **[P0 — tiếp thu review sư phạm]**

### US-D1 — Nghe mẫu → nhắc lại → tự thu âm nghe lại
**Là một** học sinh, **tôi muốn** nghe câu mẫu, nói nhắc lại và tự nghe lại bản thu của mình, **để** luyện nói to mà không sợ bị chấm sai.
- **Given** một câu mẫu (từ vocab/grammar), **When** trẻ nhấn "Nghe mẫu", **Then** TTS/audio đọc câu (có nút nghe chậm, nghe lại nhiều lần thoải mái).
- **Given** đã nghe mẫu, **When** trẻ nhấn "Thu âm" rồi nói, **Then** ghi âm cục bộ; nhấn "Nghe lại" → phát bản thu của trẻ cạnh nút phát mẫu để **tự so sánh**.
- **Given** hoàn thành lượt nói, **When** ghi tiến độ, **Then** lưu `skill:"speaking"`, `score:null` (KHÔNG chấm điểm), tăng `effort`. KHÔNG hiển thị "điểm phát âm".
> Sư phạm: tuyệt đối không dùng Web Speech API để báo "sai phát âm" (review mục 13, cảnh báo). Khích lệ kiểu đồng hành ("mình thử lại nhé").

---

## EPIC E — Phonics cơ bản  **[P1 — tiếp thu review sư phạm]**

### US-E1 — Nhận diện âm qua từ trọn vẹn
**Là một** học sinh, **tôi muốn** nghe/nhìn một âm rồi chọn từ có âm đó, **để** làm quen mặt chữ–âm.
- **Given** một `PhonicsBlock`, **When** chơi `phonics_pick`, **Then** trẻ nghe **từ trọn vẹn** (cat, dog) và chọn từ cùng âm trọng tâm — KHÔNG bắt TTS phát âm rời từng âm vị.
- **Given** có file `audio` âm chuẩn, **When** phát, **Then** ưu tiên audio nhúng thay vì TTS (review mục 13, điểm 2).
- **Given** UI, **When** dạy, **Then** phân biệt rõ "tên chữ" và "âm chữ"; có nút nghe lại.

---

## EPIC F — Tiến độ local & trang phụ huynh tối thiểu

### US-F1 — Lưu tiến độ cục bộ (offline-first)  **[P0]**
**Là một** học sinh, **tôi muốn** kết quả học được lưu lại, **để** lần sau thấy mình đã học tới đâu.
- **Given** hoàn thành một hoạt động, **When** `progress.save(record)`, **Then** ghi local NGAY cả khi offline; reload app vẫn còn (CONTRACT §3.5).
- **Given** quay lại danh sách unit, **When** hiển thị, **Then** mỗi unit có % thành thạo + dấu đã học (từ `progress.getMastery`).

### US-F2 — Hồ sơ con (avatar, không PII)  **[P1]**
**Là một** học sinh, **tôi muốn** chọn avatar của mình, **để** tiến độ của tôi tách khỏi anh/chị em.
- **Given** thiết bị chung, **When** chọn hồ sơ (avatar + tên gọi thân mật, KHÔNG tên thật/ngày sinh), **Then** tiến độ gắn `childId` riêng. App không thu thập PII trẻ.

### US-F3 — Trang phụ huynh tối thiểu (đồng hành, không giám sát)  **[P1]**
**Là một** phụ huynh, **tôi muốn** xem con đang học chủ đề gì và mạnh/yếu ở đâu, **để** đồng hành cùng con.
- **Given** dữ liệu tiến độ local, **When** mở trang phụ huynh, **Then** thấy: chủ đề đang học, % thành thạo theo unit/kỹ năng, **gợi ý chơi cùng con 5 phút** — KHÔNG bảng điểm khô, KHÔNG xếp hạng/so sánh giữa các con.
- **Given** mục tiêu, **When** đặt, **Then** dạng **mềm theo tuần** ("học 4 ngày/tuần") + có thể TẮT; không có streak cứng (review mục 13, điểm 5 & mục 9).
> P2: đồng bộ Firebase + đăng nhập email phụ huynh + nhiều thiết bị (khung `progress.sync()` sẵn sàng).

---

## EPIC G — Khung kỹ thuật & nền (enabler)

### US-G1 — App chạy offline thuần tĩnh  **[P0]**
**Là một** người dùng, **tôi muốn** mở app không cần mạng, **để** học mọi lúc.
- **Given** mở `index.html` (file:// hoặc server tĩnh), **When** không có mạng, **Then** app + nội dung JSON tải và chạy đầy đủ luồng học chính.

### US-G2 — TTS có nút bật/tắt, tốc độ chậm, fallback  **[P0]**
**Là một** học sinh, **tôi muốn** nghe đề và chỉnh tốc độ, **để** nghe kịp.
- **Given** trình duyệt có giọng en-GB/US, **When** nhấn loa, **Then** đọc đúng; có nút "đọc chậm".
- **Given** thiếu giọng tiếng Anh, **When** phát, **Then** hiện fallback chữ + thông báo nhẹ, không vỡ luồng.

### US-G3 — Khung PWA (chỉ scaffold cho MVP)  **[P2]**
- `manifest.json` + `sw.js` cache vỏ app; cài đặt đầy đủ để sau MVP.

---

## Ưu tiên triển khai (thứ tự gợi ý cho P2 song song)

| Thứ tự | Story | Luồng phụ trách | Mức |
|---|---|---|---|
| 1 | US-C4 vùng an toàn + US-C1/C2/C3 engine | Engine (+ QA test) | P0 |
| 1 | Vocab + 3–4 grammar (có safeZone) + phonics 2–4 unit | Nội dung | P0 |
| 2 | US-A1/A2, US-B1, US-C* render, US-G1/G2 | Frontend (mock engine/progress) | P0 |
| 2 | US-F1 local + khung US-F3 + chữ ký `sync()` | Backend/Sync | P0/P1 |
| 3 | US-D1 Nói không chấm điểm | Frontend + Nội dung | P0 |
| 4 | US-B2, US-E1, US-F2 | Frontend + Nội dung | P1 |
| 5 | US-G3 PWA, đồng bộ Firebase, đăng nhập | DevOps + Backend | P2 |

---

## Definition of Done — MVP Level 1 (cổng nghiệm thu)

- [ ] Chọn được unit, học từ vựng (flashcard + TTS), làm 3 loại bài (`fill_blank`/`mcq`/`order_words`) chạy end-to-end **offline**.
- [ ] Engine: mọi bài có đúng 1 đáp án + giải thích VN; test unit/property xanh; ráp trong `safeZone`.
- [ ] Nói-không-chấm-điểm hoạt động (nghe mẫu → thu âm → nghe lại); `score:null`.
- [ ] Tiến độ lưu local, hiển thị % thành thạo theo unit; trang phụ huynh tối thiểu (gợi ý đồng hành, mục tiêu mềm, không streak).
- [ ] Mọi đề đọc được bằng TTS; WCAG AA; nội dung GỐC (không chép nguyên văn); không thu thập PII trẻ.
- [ ] UAT sư phạm (`chuyen-gia-giao-duc-tieu-hoc`) đạt; qua `code-reviewer`; không lỗi Nghiêm trọng/Cao.

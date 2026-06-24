# Kế hoạch: Cấu trúc 5 bài lớn/level (tổng hợp cô đọng) + Hệ thống audio đa nguồn + Hoàn thành Level 2, 3

> Ngày: 2026-06-24. Tiếp nối sau khi **Level 1 đã phát hành LIVE** (`/ontoan/tienganh/`).
> Quyết định đã chốt với người dùng:
> 1. **Cấu trúc:** mỗi level = **5 BÀI LỚN**, mỗi bài lớn đủ **5 kỹ năng** (từ vựng · ngữ pháp · phonics · đọc · nói).
> 2. **Mỗi bài lớn là bản TỔNG HỢP CÔ ĐỌNG** từ nhiều bài con (unit nhỏ), **độ dài chỉ ~1–2× một unit nhỏ hiện tại** (chọn lọc cốt lõi, KHÔNG ghép nguyên).
> 3. **Một sub-agent chuyên trách** (`lesson-synthesizer`) làm việc tổng hợp bài con → bài lớn.
> 4. **Phạm vi:** áp dụng cho **CẢ 3 level** (Level 1 gom 16 unit → 5 bài lớn).
> 5. **Audio:** cho người dùng **chọn nguồn giọng đọc** — TTS trình duyệt **hoặc** Google Cloud TTS Neural **hoặc** Azure Speech Neural. *(Engine bake cụ thể: CHƯA chốt — xem §5.)*

---

## 0. Vấn đề đang gặp: "việc đọc chưa được"

Hiện app đọc bằng **Web Speech API** (`speechSynthesis`) — phụ thuộc **giọng tiếng Anh cài trong máy**. Máy/điện thoại **không có giọng EN** → im lặng. Đây là điểm yếu kiến trúc cần khắc phục bằng **audio tải sẵn (baked)**: đọc được trên **mọi** máy, chất lượng đồng đều cho trẻ, vẫn **offline** sau khi tải.

---

## 1. Cấu trúc 5 bài lớn/level (tổng hợp cô đọng)

### 1.1. Mô hình
```
Level
 └─ BÀI LỚN (5 bài / level)   ← 1 lesson cô đọng, ĐỦ 5 kỹ năng trong một mạch
      ├─ Từ vựng (chọn lọc, kèm icon + câu mẫu)
      ├─ Ngữ pháp (1 điểm cốt lõi + generator)
      ├─ Phonics (vài âm đại diện)
      ├─ Đọc (đoạn ngắn gốc + câu hỏi)
      └─ Nói (gợi ý, không chấm điểm)
```
**Bài lớn KHÔNG phải là thư mục chứa nhiều unit** — nó là **một bài học gọn** được **chắt lọc** từ ~3–4 unit nhỏ. **Ràng buộc độ dài: 1 bài lớn ≈ 1–2× một unit nhỏ hiện tại** (chọn từ/câu/âm tiêu biểu, bỏ trùng lặp & phần ít quan trọng). Bản đồ học (S2) hiển thị **5 bài lớn**; chạm 1 bài → vào thẳng mạch học 5 kỹ năng của bài đó.

> Vì bài lớn cô đọng, tổng nội dung mỗi level **gọn hơn** bản 16-unit hiện tại — dễ học hết & dễ hoàn thành cả 3 level. Các unit nhỏ gốc giữ làm **vật liệu nguồn** (và có thể giữ làm "luyện thêm" tuỳ chọn — xem §1.4).

### 1.2. Sub-agent tổng hợp (`lesson-synthesizer`)
Đã tạo `/.claude/agents/lesson-synthesizer.md`. Nhiệm vụ: đọc các unit con → **chọn lọc & gộp** thành 1 bài lớn JSON đủ 5 kỹ năng, đạt mốc độ dài 1–2× unit, khử trùng lặp, giữ controlled vocabulary, đánh dấu từ/câu cần audio. (Agent mới — cần **reload** Claude Code mới gọi được.)

### 1.3. Gom Level 1 (16 chủ đề) → 5 bài lớn (đề xuất)
| Bài lớn | Tên gợi ý | Tổng hợp từ các unit |
|---|---|---|
| **Bài 1** | Em & lớp học | Chào hỏi · Đồ dùng học tập · Đồ chơi |
| **Bài 2** | Cơ thể & con người | Cơ thể · Quần áo · Nghề nghiệp |
| **Bài 3** | Gia đình & ngôi nhà | Gia đình · Ngôi nhà · Phòng ngủ |
| **Bài 4** | Bạn bè & vui chơi | Bạn bè · Công viên · Sở thú |
| **Bài 5** | Ăn uống & khám phá | Đồ ăn · Hộp cơm · Khả năng · Bãi biển |

> Nội dung Level 1 đã QA 0 lỗi → dùng làm **vật liệu nguồn** để tổng hợp, không bỏ phí; câu/đáp án đúng được tái dùng khi phù hợp.

### 1.4. Thay đổi kỹ thuật
- **Schema bài lớn:** thêm file `content/levelX/lesson0N.json` (1 bài lớn = đủ 5 kỹ năng trong 1 file). `index.json` liệt kê 5 bài lớn (id, tên, icon/màu, % tiến độ).
- **Quyết định cần chốt:** unit nhỏ gốc → (a) **thay hẳn** bằng 5 bài lớn, hay (b) **giữ làm "luyện thêm"** sau mỗi bài lớn. (Khuyến nghị (b) nếu muốn tận dụng kho bài đã có; (a) nếu muốn app thật gọn.)
- **UI:** màn bản đồ S2 vẽ **5 thẻ bài lớn** (mascot Pi + tiến độ %); chạm → mạch học 5 kỹ năng. Kết quả/huy hiệu "Hoàn thành Bài N".
- **Tiến độ:** `progress.getMastery` tính % theo **bài lớn**.
- **Test:** cập nhật `content.schema.mjs` kiểm bài lớn đủ 5 kỹ năng + độ dài trong mốc 1–2× unit.

---

## 2. Hệ thống audio đa nguồn (sửa "đọc chưa được")

### 2.1. Nguyên tắc
- **Offline-first:** audio chất lượng cao phải chạy **không cần mạng** → dùng cách **bake (sinh sẵn file) một lần** rồi đóng gói, KHÔNG gọi API lúc chạy (gọi runtime sẽ vỡ offline + lộ API key client + tốn phí mỗi lần đọc).
- **API key chỉ dùng lúc build trên máy dev** (biến môi trường), KHÔNG bao giờ đưa lên web.

### 2.2. Kiến trúc
```
[build] bake_audio.mjs ──(Google/Azure/Piper)──► audio/<level>/<key>.mp3  +  audio-manifest.json
                                                          │
[runtime] audio.js: play(text) ─► nếu có file baked & nguồn đã chọn → phát mp3
                                   ngược lại → fallback Web Speech API (giọng máy)
```
- **`key`** = mã ổn định từ nội dung (vd hash chuỗi đã chuẩn hoá) → ổn định khi sửa nội dung khác.
- **`audio-manifest.json`**: map `text → {file, engine}` để runtime biết file nào có sẵn.
- **Lazy-load theo bài:** chỉ tải mp3 của bài đang học (không precache toàn bộ ~25MB). SW cache audio theo stale-while-revalidate.

### 2.3. "Chọn nguồn giọng" (đúng yêu cầu)
Màn Cài đặt (S9) thêm mục **Giọng đọc**:
- **Giọng máy (TTS)** — offline, miễn phí, phụ thuộc máy (mặc định fallback).
- **Giọng chuẩn — Google Neural** *(nếu đã bake bằng Google)*.
- **Giọng chuẩn — Azure Neural** *(nếu đã bake bằng Azure)*.

> Mỗi nguồn neural bake thêm ≈ 15–25MB/3 level. Bake **cả Google lẫn Azure** = gấp đôi dung lượng. Khuyến nghị: **chọn MỘT engine neural** làm "giọng chuẩn" + giữ TTS máy làm lựa chọn nhẹ. (Có thể thêm engine thứ 2 sau.)

### 2.4. Khối lượng & dung lượng (ước lượng)
- ~339 clip/level × 3 level ≈ **~1.000+ clip**. mp3 neural ~10–25KB/clip → **~15–25MB/engine** cho cả 3 level. Lazy-load theo bài → lần tải đầu mỗi bài chỉ vài trăm KB.

### 2.5. ⚠️ ĐIỀU KIỆN CẦN (quyết định của bạn)
Bake giọng **neural** cần **tài khoản + API key** Google Cloud TTS hoặc Azure Speech (có gói miễn phí: Google ~1 triệu ký tự/tháng WaveNet free; Azure ~0.5 triệu ký tự/tháng Neural free — đủ cho dự án này). 
- **Nếu CÓ key:** bake bằng Google/Azure (giọng hay nhất).
- **Nếu CHƯA có key:** dùng **Piper TTS** (offline, miễn phí, không cần key, chất lượng khá) để bake ngay → vẫn fix được "đọc chưa được" trên mọi máy; nâng cấp lên Google/Azure sau khi có key.

---

## 3. Nội dung Level 2 & Level 3 (mỗi level 3 bài)

Soạn **nội dung gốc** dựa trên blueprint giáo trình ở `en_md/` (Family & Friends 2/3 + Grammar Friends 2/3) — dùng từ vựng thông dụng + trình tự ngữ pháp (không thuộc bản quyền), tự soạn câu/bài/giải thích.

### 3.1. Level 2 (5 bài lớn)
| Bài lớn | Chủ đề | Trọng tâm ngữ pháp (mới so với L1) |
|---|---|---|
| Bài 1 | Trường lớp & thời gian biểu | Present simple (he/she + s), giới từ thời gian |
| Bài 2 | Sở thích & việc đang làm | Present continuous (be + V-ing), like/don't like + V-ing |
| Bài 3 | Đồ ăn & số lượng | some/any, How much/many, danh từ đếm/không đếm |
| Bài 4 | Nơi chốn & chỉ đường | giới từ nơi chốn, there is/are mở rộng, mệnh lệnh |
| Bài 5 | Kể chuyện & quá khứ đơn | Past simple (was/were, V-ed, động từ bất quy tắc cơ bản) |

### 3.2. Level 3 (5 bài lớn)
| Bài lớn | Chủ đề | Trọng tâm ngữ pháp |
|---|---|---|
| Bài 1 | So sánh & mô tả | Comparative/superlative, tính từ mở rộng |
| Bài 2 | Thói quen & tần suất | adverbs of frequency, present simple nâng cao |
| Bài 3 | Kế hoạch & tương lai | be going to, will, must/have to |
| Bài 4 | Việc đang & đã diễn ra | Past continuous, when/while |
| Bài 5 | Đọc hiểu & kể lại | liên từ (because/so/but), đoạn đọc dài hơn |

> Mỗi bài lớn Level 2/3 vẫn theo ràng buộc độ dài 1–2× unit nhỏ; soạn trực tiếp dạng bài lớn (hoặc soạn phần con rồi để `lesson-synthesizer` cô đọng).

> Engine cần mở rộng generator cho thì mới (present continuous, past simple, so sánh…) theo "vùng an toàn" + distractor theo lỗi điển hình của người Việt — cùng kỷ luật như Level 1.

---

## 4. Lộ trình theo giai đoạn (mỗi giai đoạn: build → review đa lăng kính → update)

### Giai đoạn A — Nền tảng (làm 1 lần, dùng cho cả 3 level) ⭐ ưu tiên
- **A1. Cấu trúc bài lớn:** schema `lesson0N.json` (đủ 5 kỹ năng) + UI bản đồ 5 bài lớn + tiến độ theo bài lớn + test.
- **A2. Hệ audio đa nguồn:** `audio.js` (chọn nguồn + fallback TTS), `build/bake_audio.mjs` (Google/Azure/Piper), `audio-manifest.json`, lazy-load + SW cache, mục "Giọng đọc" ở S9.
- **A3. Tổng hợp + áp cho Level 1:** `lesson-synthesizer` gộp 16 unit → **5 bài lớn cô đọng** (1–2× unit) → QA → **bake audio Level 1** → deploy lại. → **"đọc chưa được" được fix ngay trên bản live.**
- *Cổng:* Level 1 chạy 5 bài lớn, đọc được trên máy không có giọng EN, test xanh, render OK.

### Giai đoạn B — Level 2 (3 bài)
- B1 nội dung (3 bài) → B2 engine mở rộng (present simple/continuous, past simple) → B3 bake audio L2 → B4 QA + review sư phạm → B5 deploy `/tienganh/` (thêm Level 2 vào bản đồ).

### Giai đoạn C — Level 3 (3 bài)
- Tương tự B, với ngữ pháp Level 3.

### Giai đoạn D (tuỳ chọn, pha sau) — Firebase + trang phụ huynh
- Đồng bộ đa thiết bị, quản nhiều hồ sơ con (đã có khung trong CONTRACTS).

---

## 5. Quyết định cần bạn chốt trước khi bắt đầu CODE (hiện ĐANG DỪNG ở kế hoạch)
1. **Engine bake audio (CHƯA chốt):** đã có key **Google Cloud** / **Azure** chưa? Nếu chưa → bắt đầu bằng **Piper (offline, free)** rồi nâng cấp sau?
2. **Bao nhiêu giọng neural:** chỉ **1 giọng chuẩn** (khuyến nghị) hay cả Google + Azure?
3. **Unit nhỏ gốc:** **thay hẳn** bằng 5 bài lớn, hay **giữ làm "luyện thêm"** sau mỗi bài lớn?
4. **Thứ tự bắt đầu:** **Giai đoạn A** trước (nền tảng + tổng hợp + fix đọc Level 1) — khuyến nghị — rồi Level 2/3.

---

## 6. Ước lượng công sức (tương đối)
- Giai đoạn A: trung bình–lớn (schema + UI + pipeline audio + bake L1 + deploy).
- Mỗi level mới (B, C): lớn (nội dung 3 bài + engine + audio + QA + deploy).
- Tận dụng tối đa quy trình & agent đã có (content-author, engine, frontend, qa, devops, learning-content-reviewer).

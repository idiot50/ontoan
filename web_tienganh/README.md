# Web học tiếng Anh cho trẻ 7–10 tuổi (Level 1–3)

App **học & ôn tiếng Anh** offline cho trẻ Việt 7–10 tuổi, dựa trên mạch chương trình
**Family & Friends / Grammar Friends** (dùng làm *blueprint*, **nội dung tự soạn GỐC** —
không chép nguyên văn sách). Giao diện **tiếng Việt**, nội dung học bằng tiếng Anh, đề đọc được
bằng **TTS** (Web Speech API). Kiến trúc kế thừa 2 web học Toán hiện có (`web_toan_lop1/3`).

> Trạng thái: **P2 (MVP Level 1 CHẠY ĐƯỢC)** — frontend + engine + progress + nội dung 2 unit đã tích hợp
> thành app offline hoàn chỉnh. Luồng học chính chạy end-to-end: chọn hồ sơ → bản đồ unit → từ vựng /
> luyện tập / nói → kết quả → tiến độ + trang phụ huynh.

## Đặc điểm
- **Offline-first**, HTML/CSS/JS thuần + dữ liệu JSON (tách dữ liệu khỏi mã). Có thể nâng lên PWA.
- **TTS** đọc từ/câu/đề; nút đọc chậm, fallback chữ khi thiếu giọng.
- **Engine sinh bài** trong "vùng an toàn" (`safeZone`) do người soạn cung cấp → không sinh câu sai ngữ pháp.
- **Nói không chấm điểm**: nghe mẫu → nhắc lại → tự thu âm nghe lại (không dùng máy chấm phát âm).
- **Tiến độ offline-first** + (sau) đồng bộ Firebase + trang phụ huynh đồng hành (không streak cứng, không PII trẻ).
- Động lực thiên **nỗ lực–tiến bộ**; WCAG AA; an toàn trẻ em (không quảng cáo/link ngoài).

## Cách chạy
App là web tĩnh, không cần build.

**Cách 1 — mở trực tiếp (file://):** nhấp đúp `index.html` (Chrome/Edge). **Chạy được ngay** —
nội dung Level 1 được nhúng sẵn trong `js/content-data.js` nên không cần `fetch` JSON. Hạn chế của file://:
service worker (PWA cài đặt) **không** hoạt động; tính năng học vẫn đầy đủ.

**Cách 2 — phục vụ tĩnh (khuyến nghị để bật PWA / cài về máy):** từ thư mục `web_tienganh/`:
```bash
# Node (không cần cài gì nếu đã có Node ≥ 18)
npx serve .
# hoặc Python
python -m http.server 8000
```
Rồi mở `http://localhost:8000/`. Khi phục vụ qua HTTP/HTTPS, app **ưu tiên fetch** JSON trong `content/`
và **đăng ký service worker** (`sw.js`) để cache app shell + nội dung → cài về máy, mở offline tức thì.

> **Đồng bộ nội dung nhúng:** mỗi khi sửa file trong `content/`, chạy `node build/embed_content.mjs`
> để sinh lại `js/content-data.js` (giữ bản file:// khớp với JSON nguồn).

> **TTS:** cần trình duyệt có giọng tiếng Anh (en-GB/en-US). Thiếu giọng → app hiện dải nhắc nhẹ,
> vẫn xem chữ và học bình thường. Lần đầu có thể cần một thao tác chạm để trình duyệt cho phép phát âm.

> **Micro (mảng Nói):** lần đầu chạm "Thu âm" trình duyệt sẽ hỏi quyền micro. Từ chối cũng được —
> trẻ vẫn nghe mẫu và nói theo. Bản thu **chỉ ở trong phiên** (không lưu đĩa, không tải lên mạng).

## Tài liệu
- **`docs/CONTRACTS.md`** — 3 interface contract `v1` (Content JSON · Engine API · Progress API) + cấu trúc thư mục chuẩn. **Đọc trước khi code bất kỳ luồng nào.**
- **`docs/BACKLOG_MVP.md`** — phạm vi MVP Level 1: user story + tiêu chí nghiệm thu (Given/When/Then) + Definition of Done.
- Nền tảng kế hoạch: `../en_md/KE_HOACH_WEBSITE_TIENGANH.md` (kế hoạch + review sư phạm mục 13) và `../en_md/QUY_TRINH_PHAT_TRIEN.md` (quy trình + đội sub-agent).

## Cấu trúc (rút gọn)
```
web_tienganh/
├── index.html                 # SPA: khung header + main + template Pi/sao
├── manifest.json  sw.js       # PWA: cài về máy + cache offline (chạy khi phục vụ qua HTTP)
├── css/(tokens.css, base.css) # design tokens + component (hệ thị giác Pi)
├── js/
│   ├── app.js                 # điều hướng + render các màn S0–S9
│   ├── engine.js              # sinh bài (CONTRACT §2)
│   ├── progress.js            # tiến độ offline-first (CONTRACT §3)
│   ├── tts.js                 # bọc Web Speech API (giọng en, đọc chậm, fallback)
│   └── content-data.js        # nội dung NHÚNG cho file:// (sinh từ build/embed_content.mjs)
├── content/level1/            # index.json + unit01.json + unit02.json (CONTRACT §1)
├── assets/mascot/pi-icon.svg  # icon PWA (Pi cáo đom đóm)
├── build/embed_content.mjs    # sinh lại js/content-data.js từ content/
└── docs/(CONTRACTS, BACKLOG_MVP, ARCHITECTURE, UX_FLOWS, DESIGN).md
```

## Các màn (UX_FLOWS)
- **S0** Onboarding — chào, chọn avatar + biệt danh (không PII), tạo hồ sơ.
- **S1** Chọn hồ sơ con (nhiều bé, mỗi bé tiến độ riêng) · **S2** Bản đồ unit (thẻ + % thành thạo + mở khoá).
- **S3** Menu unit [Từ vựng · Luyện tập · Nói · Phonics].
- **S4** Flashcard (icon + từ + nghĩa + câu, lật, 2 nút loa) · **S5** Luyện tập (`fill_blank`/`mcq`/`order_words`,
  chấm + phản hồi ấm áp + chống kẹt) · **S5p** Phonics (`phonics_pick`).
- **S6** Nói — nghe mẫu → nói theo → thu âm (MediaRecorder) → tự nghe lại (KHÔNG chấm điểm, `score:null`).
- **S7** Kết quả (sao theo nỗ lực) · **S8** Phụ huynh (cổng nhân-2-chữ-số, % thành thạo, Export/Import JSON)
  · **S9** Cài đặt (tự đọc đề, âm thanh, tốc độ TTS, giọng, tương phản cao, cỡ chữ).

## Nguyên tắc đóng góp
- Nội dung **GỐC** — không chép nguyên văn lời hát/truyện/đoạn đọc/nhân vật/hình/đáp án từ sách.
- Code theo **contract `v1`**; thay đổi phá vỡ tương thích phải qua điều phối và tăng version.
- Mỗi luồng một nhánh git (`feat/content`, `feat/engine`, `feat/ui`, `feat/sync`); chỉ commit/push khi được yêu cầu.

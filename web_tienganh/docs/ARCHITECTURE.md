# ARCHITECTURE — Web học tiếng Anh trẻ em 7–10 (offline-first PWA + đồng bộ Firebase)

> **Pha P1 — Thiết kế kiến trúc & dữ liệu (ADR/spec, KHÔNG code).**
> Văn phong ADR: mỗi quyết định nêu **Quyết định — Lý do — Đánh đổi**.
> Tài liệu này thiết kế phần **LƯU TRỮ / SECURITY RULES / SYNC / PWA / CHI PHÍ** phía sau.
> **Chữ ký API** (`engine.generate`, `progress.save/getMastery/sync`) và **schema Content JSON**
> do `dieu-phoi` chốt trong `docs/CONTRACTS.md` — ở đây CHỈ tham chiếu, KHÔNG định nghĩa lại.
>
> Nguồn: `en_md/KE_HOACH_WEBSITE_TIENGANH.md`, `en_md/QUY_TRINH_PHAT_TRIEN.md`,
> kế thừa `web_toan_lop3/{index.html,sw.js,engine.js,tests/safety.spec.mjs}`,
> và bài học từ `ARCHITECTURE_REVIEW_dangnhap.md`.

---

## 0. Tóm tắt điều hành

- **App tĩnh HTML/CSS/JS thuần + PWA offline-first**, không build step, không framework — kế thừa nguyên si triết lý 2 site Toán (`web_toan_lop3` đã có `sw.js` + `manifest.webmanifest`).
- **Nguồn sự thật của tiến độ = thiết bị (localStorage/IndexedDB)**, KHÔNG phải cloud. Firebase chỉ là **lớp đồng bộ tuỳ chọn (opt-in), mặc định TẮT**. App phải chạy đủ 100% khi không có mạng và không có tài khoản.
- **Dữ liệu trẻ em tối thiểu**: trẻ KHÔNG đăng nhập, KHÔNG PII. Chỉ phụ huynh có tài khoản (email/Google). `childId` là biệt danh + id ngẫu nhiên.
- **Cảnh báo kiến trúc cốt lõi (🔴):** Firebase SDK gọi mạng qua `fetch/XHR` tới `*.googleapis.com`. Điều này **đụng trực tiếp** `safety.spec.mjs` (cấm `fetch(`, `XMLHttpRequest`, `src=https://`) và **đụng trụ cột offline-first / không bên thứ ba theo dõi**. Giải pháp bắt buộc: **self-host SDK** + **tách biệt vùng đồng bộ** + **nới safety-check có kiểm soát theo endpoint cụ thể** (xem §4.4). Không bao giờ nạp SDK từ CDN gstatic.
- **Chi phí: dư sức Firebase free-tier (Spark)** với mô hình "lưu document tổng hợp, ghi cuối phiên" (~vài read/write mỗi bé mỗi ngày). Mô hình "log từng câu" bị **loại** vì phình write và tích dữ liệu hành vi vô ích.
- **Khuyến nghị MVP:** Level 1 chạy **100% offline + localStorage + Export/Import JSON**, BỎ Firebase ở MVP. Bật sync ở giai đoạn nâng cấp (P5) khi thực sự cần đa thiết bị.

---

## 1. Tổng quan kiến trúc

### ADR-1: App tĩnh HTML/CSS/JS thuần, không build step, không framework

**Quyết định.** Một app tĩnh trong `web_tienganh/`, gồm các file cùng-origin:

```
web_tienganh/
├── index.html              # khung UI + màn hình + CSS nội tuyến (như site Toán)
├── engine.js               # generators sinh bài (classic <script>, không module bắt buộc)
├── tts.js                  # bọc Web Speech API (giọng en-GB/en-US, tốc độ chậm, fallback)
├── progress.js             # lớp lưu tiến độ offline + hàng đợi đồng bộ (Progress API §2.2)
├── sync/                   # VÙNG ĐỒNG BỘ TÁCH BIỆT (opt-in) — chỉ nạp khi bật
│   ├── firebase-app.js     #   SDK self-host (copy từ npm, KHÔNG CDN)
│   ├── firebase-auth.js
│   ├── firebase-firestore.js
│   └── sync.js             #   adapter: gọi Firebase, map ↔ Progress API
├── parent.html             # trang phụ huynh (đăng nhập + dashboard) — TÁCH file
├── content/
│   ├── index.json          # danh mục level→unit (manifest nội dung)
│   └── level1/unit01.json  # nội dung từng unit (schema ở CONTRACTS.md §4.1)
├── audio/                  # audio âm vị/phát âm chuẩn cốt lõi (phonics) — cục bộ
├── icons/                  # icon PWA (192/512/maskable/apple-touch)
├── manifest.webmanifest
└── sw.js                   # service worker (PWA, §5)
```

**Lý do.**
- Đồng bộ với codebase hiện có (2 site Toán) → tái dùng kinh nghiệm, `sw.js`, mẫu localStorage chịu lỗi, bộ test an toàn.
- Không build step = deploy thẳng GitHub Pages / hub *ontoan*, dễ bảo trì cho dự án cá nhân.
- Chạy offline thật: mọi tài nguyên cùng-origin (yêu cầu của `sw.js:40` chỉ cache same-origin).

**Đánh đổi.** Không có module bundler/tree-shaking → phải tự kỷ luật chia file rõ ràng. Firebase SDK phải tự copy về (self-host) thay vì `import` từ npm registry lúc build.

### ADR-2: Tách lớp app / engine / tts / progress / sync

**Quyết định.** Bốn lớp phụ thuộc một chiều:

```
            index.html (UI, màn hình, gamification)
                 │ gọi
   ┌─────────────┼───────────────┬─────────────────┐
   ▼             ▼               ▼                 ▼
engine.js     tts.js        progress.js      content/*.json
(sinh bài)  (Web Speech)  (lưu offline +      (dữ liệu)
                           hàng đợi sync)
                                 │ (opt-in, lazy-load)
                                 ▼
                           sync/sync.js → Firebase (self-host SDK)
```

- `engine.js`, `tts.js`, `progress.js` **không biết gì** về Firebase. `progress.js` chỉ expose Progress API (CONTRACTS §4.3); việc có đẩy lên cloud hay không là chi tiết nội bộ ẩn sau `progress.sync()`.
- `sync/` chỉ được **nạp động** (`<script>` chèn runtime) khi phụ huynh **bật đồng bộ**. App KHÔNG nạp Firebase nếu sync tắt → giữ offline-first và không gọi bên thứ ba.

**Lý do.** Cô lập rủi ro Firebase vào một vùng duy nhất; lõi học tập sạch, testable offline, và `safety.spec` áp dụng được cho lõi mà không vướng SDK.

**Đánh đổi.** Lazy-load SDK thêm một nhánh code "đã bật sync chưa". Chấp nhận được vì đổi lại lõi luôn an toàn.

---

## 2. Mô hình dữ liệu

### 2.1. Nội dung (Content JSON) — tham chiếu, không trùng lặp

- **Schema chuẩn**: `docs/CONTRACTS.md §4.1` (kế thừa mẫu `KE_HOACH §6`: `content/levelX/unitYY.json`).
- **Quan hệ phân cấp** (chỉ nêu, không định nghĩa lại trường):

```
level (1|2|3)
 └── unit (Starter + 1..15 + Review)
      ├── vocab[]     { word, vi, icon, example, audio? }   ← chunk + ngữ cảnh
      ├── grammar[]   { id, title_vi, explain_vi, examples[], generators[] }
      ├── phonics     { focus[], words[], audio? }          ← audio âm chuẩn cốt lõi
      └── reading[]   { title, text, questions[] }          ← phân tầng theo level
```

- **Đặc tính dữ liệu nội dung:** chỉ-đọc, đóng gói cùng app, **cache vĩnh viễn qua service worker** (§5). Một file/unit, có `content/index.json` làm manifest để biết danh sách level→unit mà không phải tải hết.
- **Tải lười (lazy):** chỉ fetch JSON của unit đang học (qua `fetch` cùng-origin — **được phép** vì same-origin; lưu ý mâu thuẫn safety-check ở §4.4). MVP có thể `<script>`-nhúng để tránh `fetch` hoàn toàn nếu muốn `safety.spec` xanh tuyệt đối.

> Phối hợp: `noi-dung-tieng-anh-treem` sản xuất các JSON này; kiến trúc chỉ ràng buộc **cùng-origin + cache-able + index manifest**.

### 2.2. Dữ liệu người dùng & tiến độ

Hai tầng: **(A) local — nguồn sự thật** và **(B) Firestore — bản sao đồng bộ tuỳ chọn**.

#### (A) Local (nguồn sự thật) — bố cục trong IndexedDB/localStorage

Một document JSON per-device, theo mẫu versioned key của site Toán (`toanvui_l3_v1`):

```jsonc
// key: "enkids_v1"  (localStorage) hoặc store "state" (IndexedDB)
{
  "v": 1,                          // schema version (để migrate an toàn)
  "activeChildId": "c_ab12",
  "children": {
    "c_ab12": {
      "name": "Bé Na",             // biệt danh do phụ huynh đặt — KHÔNG PII bắt buộc
      "avatar": "🦊",
      "createdTs": 1750000000000,
      // tiến độ tổng hợp theo level_unit (KHÔNG log từng câu)
      "progress": {
        "1_01": { "level":1, "unit":1,
                  "skills": {                 // mastery theo từng kỹ năng
                    "vocab":   { "score":0.8, "attempts":12, "ts":1750000111000 },
                    "grammar": { "score":0.6, "attempts":8,  "ts":1750000222000 },
                    "phonics": { "score":0.9, "attempts":5,  "ts":1750000333000 }
                  } },
        "1_02": { ... }
      },
      // hàng ôn tập (SRS đơn giản 3 mốc: mai / vài hôm / tuần sau)
      "reviewQueue": [ { "key":"1_01:grammar:what-is-this", "due":1750100000000, "box":2 } ],
      // gamification mềm (nỗ lực, không streak cứng)
      "effort": { "weekKey":"2026-W25", "daysThisWeek":3, "graceTickets":1 }
    }
  },
  "sync": { "enabled": false, "uid": null, "lastPushTs": 0, "lastPullTs": 0 },
  "outbox": [ /* hàng đợi ghi chờ đồng bộ — §3.2 */ ]
}
```

**Bản ghi tiến độ một lần làm bài** (đầu vào `progress.save(...)`) khớp đúng CONTRACTS §4.3:
`{ childId, level, unit, skill, score, attempts, ts }`.
→ `progress.save` **không append một hàng mới**, mà **gộp đơn điệu** vào `progress["<level>_<unit>"].skills[skill]` (xem hợp nhất §3.3).

#### (B) Firestore — cây đề xuất (chỉ khi sync bật)

```
parents/{uid}                                  ← doc gốc của một phụ huynh (= tài khoản)
  • email, displayName, createdTs, schemaV
  children/{childId}                           ← mỗi con một doc
    • name, avatar, createdTs
    • effort: { weekKey, daysThisWeek, graceTickets }
    progress/{level_unit}                       ← VD "1_01", "1_02"  (doc nhỏ, ghi gộp)
      • level, unit
      • skills: { vocab:{score,attempts,ts}, grammar:{...}, phonics:{...}, reading:{...} }
      • reviewKeys: [ ... ]                      ← (tuỳ chọn) phần ôn của unit này
```

**ADR-3: Document tổng hợp per `level_unit`, KHÔNG collection "attempts" log từng câu.**

**Quyết định.** Đơn vị ghi nhỏ nhất là 1 doc `progress/{level_unit}`, cập nhật **gộp** (merge) ở **cuối phiên học** (debounce), không phải mỗi câu.

**Lý do.**
- Không có use-case đọc lại từng câu; trang phụ huynh chỉ cần % thành thạo theo unit/kỹ năng.
- Tránh **hot-doc** và giới hạn **1 ghi/giây/doc** của Firestore: vì mỗi unit là doc riêng, hai unit ghi song song không đụng nhau.
- Doc luôn vài KB → an toàn dưới **giới hạn 1 MB/doc**.
- Giảm write ~10× so với log từng câu → free-tier thoải mái (§6).
- Tối thiểu hoá dữ liệu hành vi của trẻ (an toàn/COPPA).

**Đánh đổi.** Mất khả năng "xem lại từng câu bé làm sai". Chấp nhận: thay bằng `reviewQueue` (dạng bài yếu) ở client — hữu ích cho học tập, không cần lưu cloud lịch sử chi tiết.

**Vòng đời dữ liệu.** Không có log phình to. `reviewQueue` giới hạn độ dài (vd ≤ 200 mục, cắt cũ nhất). `effort` ghi đè theo tuần.

---

## 3. Offline-first & đồng bộ

### ADR-4: IndexedDB cho dữ liệu tiến độ; localStorage cho cờ/cài đặt nhỏ

**Quyết định.**
- **IndexedDB** lưu khối tiến độ chính (nhiều con × nhiều unit × reviewQueue + outbox).
- **localStorage** chỉ giữ cài đặt nhỏ, đồng bộ-đọc nhanh: cờ âm thanh, tốc độ TTS, `activeChildId`, cờ `sync.enabled` (giống `toanvui_sound` của site Toán).

**Lý do.**
- localStorage giới hạn ~5 MB, **đồng bộ (blocking)**, chỉ chứa string → ổn cho site Toán (state nhỏ) nhưng tiếng Anh có nhiều con + reviewQueue + outbox, dễ chạm trần và gây giật khi serialize lớn.
- IndexedDB: dung lượng lớn, bất đồng bộ, lưu object có cấu trúc, hợp hàng đợi (outbox).

**Đánh đổi.** IndexedDB API rườm hơn localStorage. **Giảm thiểu:** bọc trong `progress.js` một lớp mỏng (get/set/append-outbox) hoặc dùng một wrapper nhỏ tự viết (~50 dòng, không thư viện ngoài để giữ "no third-party"). **MVP có thể dùng localStorage trước** (như site Toán) nếu state Level 1 còn nhỏ, rồi migrate sang IndexedDB khi cần — `v` schema version cho phép migrate an toàn.

> Lưu ý an toàn: `safety.spec` yêu cầu **mọi truy cập storage có try/catch** (không vỡ app khi storage hỏng/đầy). Giữ đúng mẫu này cho cả IndexedDB.

### 3.2. Hàng đợi ghi khi offline (outbox)

**Quyết định.** Mọi `progress.save(...)` luôn ghi **ngay vào local** (nguồn sự thật) và đẩy một **bản tóm tắt thay đổi** vào `outbox`. `progress.sync()` (gọi khi online + sync bật) sẽ xả outbox lên Firestore rồi xoá mục đã đẩy.

- outbox lưu **delta đã gộp theo `level_unit`** (không phải từng câu) → nhiều lần save trong một phiên gộp thành 1 mục outbox/unit → 1 write/unit khi sync.
- Mỗi mục outbox có `ts` để xử lý thứ tự.

**Lý do.** App ghi điểm được khi offline; khi có mạng đẩy gọn. Debounce tự nhiên (gộp theo unit) giảm write.

**Đánh đổi.** Cần dọn outbox idempotent (đẩy 2 lần không sai) — đảm bảo bằng hợp nhất đơn điệu (§3.3).

### 3.3. Đồng bộ 2 chiều + xử lý xung đột

**ADR-5: Hợp nhất ĐƠN ĐIỆU theo trường, KHÔNG last-write-wins toàn document.**

**Bối cảnh.** Bài học từ `ARCHITECTURE_REVIEW_dangnhap.md §5`: tiến độ là **counter cộng dồn**; LWW toàn document làm **mất dữ liệu** khi 2 thiết bị cùng chỉnh (thiết bị ghi sau đè sạch tiến độ thiết bị kia).

**Quyết định.** Hợp nhất ở mức **trường con của mỗi `skill`** theo quy tắc:

| Trường | Quy tắc hợp nhất | Lý do |
|---|---|---|
| `score` (mastery 0..1) | **lấy theo `ts` lớn hơn** (LWW cấp-trường) | mastery là trạng thái mới nhất, không cộng |
| `attempts` | **max(local, remote)** | đơn điệu tăng, max chống cộng-trùng khi đẩy lại |
| `ts` | **max** | mốc thời gian mới nhất |
| `effort.daysThisWeek` | **max** trong cùng `weekKey`; khác tuần → lấy tuần mới hơn | tránh đếm trùng ngày |
| `reviewQueue` | hợp theo `key`, lấy `due/box` của `ts` mới hơn | gộp hàng ôn |

→ **Mỗi `level_unit` được merge độc lập**: pull doc remote, merge từng skill theo bảng trên, push lại. Phép merge **giao hoán & idempotent** → đẩy lại outbox không hỏng dữ liệu.

**Quy trình `sync()` (khi online + bật):**
1. **Pull** các doc `progress/*` của child (theo `lastPullTs`, chỉ lấy doc mới hơn nếu muốn tiết kiệm read).
2. **Merge** vào local theo §3.3.
3. **Push** các mục trong outbox đã merge (1 write/unit, dùng Firestore `merge:true`).
4. Cập nhật `lastPullTs/lastPushTs`, dọn outbox.

**Đánh đổi.** Phức tạp hơn LWW một chút, nhưng là **chi phí bắt buộc** để không mất tiến độ học của trẻ giữa các thiết bị. Với phạm vi "một gia đình" có thể chấp nhận **LWW cấp-doc `level_unit`** (đơn giản hơn) nếu hai thiết bị hiếm khi học cùng một unit cùng lúc — nhưng khuyến nghị merge cấp-trường vì rẻ và an toàn hơn.

### 3.4. Chế độ khách → đăng nhập (first-login merge)

**Quyết định.** Khách chơi offline tích tiến độ trong local. Khi phụ huynh đăng nhập lần đầu trên thiết bị đó:
- Cloud **rỗng** → đẩy toàn bộ local lên (tạo `children/*` + `progress/*`).
- Cloud **đã có** (đăng nhập trên máy mới) → **merge** theo §3.3 (max/LWW-trường), không đè.

**Lý do.** Không bao giờ mất dữ liệu khách đã tích; chuyển máy liền mạch.

**Đánh đổi.** Cần map `childId` local ↔ cloud. Giải pháp: `childId` sinh client (id ngẫu nhiên) và dùng làm doc id Firestore → trùng id = cùng con; nếu khác máy tạo con khác id, phụ huynh có thể gộp tay (hiếm, để sau).

---

## 4. Auth & quyền riêng tư trẻ em

### ADR-6: Chỉ phụ huynh đăng nhập; trẻ chỉ chọn hồ sơ; KHÔNG PII trẻ

**Quyết định.**
- **Đăng nhập (chỉ ở `parent.html` / khi bật sync):** Firebase Auth **Email/Password** (bắt buộc verify email) hoặc **Google**. KHÔNG đăng nhập ẩn danh cho luồng có cloud.
- **Trẻ KHÔNG đăng nhập**: ở app học, trẻ chỉ **chọn avatar/hồ sơ** đã có trong local. Không hỏi tên thật, ngày sinh, lớp, ảnh.
- **`childId`** = id ngẫu nhiên (vd `c_<random>`); `name` chỉ là **biệt danh** do phụ huynh tự đặt, không bắt buộc, mặc định gợi ý chung ("Bé 1").
- Dữ liệu lưu cloud chỉ là **số liệu học tập tổng hợp** + biệt danh + avatar emoji.

**Lý do.** Tối thiểu hoá dữ liệu, phù hợp định hướng COPPA/luật trẻ em: dữ liệu định danh trẻ ≈ 0; cha mẹ là người kiểm soát và là chủ thể tài khoản. Tránh hoàn toàn việc thu thập PII trẻ em.

**Đánh đổi.** Không cá nhân hoá theo tuổi/lớp thật. Chấp nhận — level theo **trình độ** (test xếp lớp gợi ý), không theo tuổi (đúng góp ý sư phạm).

### 4.2. Firestore Security Rules (phác)

> Nguyên tắc: **mỗi phụ huynh chỉ đọc/ghi đúng cây của mình**; mặc định từ chối tất cả.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {

    // Mọi thứ dưới parents/{uid} chỉ thuộc về chính uid đó, và phải verify email.
    match /parents/{uid} {
      allow read, write: if request.auth != null
                         && request.auth.uid == uid
                         && request.auth.token.email_verified == true;

      // con & tiến độ kế thừa quyền của parent
      match /children/{childId} {
        allow read, write: if request.auth != null
                           && request.auth.uid == uid
                           && request.auth.token.email_verified == true;

        match /progress/{levelUnit} {
          allow read, write: if request.auth != null
                             && request.auth.uid == uid
                             && request.auth.token.email_verified == true
                             // chặn doc khổng lồ (an toàn 1MB) — ví dụ ràng buộc kích thước/kiểu
                             && request.resource.data.keys().hasOnly(
                                  ['level','unit','skills','reviewKeys']);
        }
      }
    }

    // (TUỲ CHỌN) allowlist mã mời nếu muốn giới hạn nhóm học sinh:
    // match /invites/{code} { allow get: if request.auth != null; }
    // và rule trên thêm điều kiện đã "redeem" một invite hợp lệ.

    match /{document=**} { allow read, write: if false; } // default deny
  }
}
```

**Lý do.** `request.auth.uid == uid` đảm bảo cách ly tuyệt đối giữa các gia đình; `email_verified` chặn tài khoản rác; `hasOnly([...])` giữ doc đúng hình dạng/nhỏ.

**Đánh đổi.** Rules nghiêm = trải nghiệm đăng nhập có thêm bước verify email. Chấp nhận (an toàn > tiện).

### 4.3. (Tuỳ chọn) Mã mời / allowlist

**Quyết định.** Mặc định **công khai** (theo quyết định kế hoạch: giới hạn truy cập là tuỳ chọn vì bản quyền đã an toàn). Nếu muốn dành riêng nhóm học sinh: thêm collection `invites/{code}` + bước "redeem" ghi `parents/{uid}.invited=true`, và rules yêu cầu `invited==true`. Kèm `<meta name="robots" content="noindex">`.

**Đánh đổi.** Thêm bước nhập mã. Vì là tuỳ chọn, để **flag tắt mặc định**.

### ADR-7: 🔴 Tách biệt vùng đồng bộ & self-host SDK (mâu thuẫn safety.spec)

**Bối cảnh (bằng chứng).** `web_toan_lop3/tests/safety.spec.mjs` cấm cứng: `fetch(` (dòng 28), `XMLHttpRequest` (29), `WebSocket` (30), `src=https://` và `//` (38, 60–68), analytics (36). Firebase **bắt buộc** dùng `fetch/XHR` tới `*.googleapis.com` và `*.firebaseio.com`. Đây là xung đột thật, không né được nếu áp y nguyên bộ test cho file có sync.

**Quyết định.**
1. **Self-host SDK** (copy file SDK đã build vào `sync/`, KHÔNG `<script src="https://...gstatic">`). → loại vi phạm "src ngoài".
2. **Cô lập runtime mạng vào `parent.html` + `sync/`**, tách khỏi app học của trẻ. App học (`index.html`) **không chứa** `fetch/firebase` → vẫn pass `safety.spec` nguyên vẹn.
3. **Lazy-load `sync/`**: chỉ chèn `<script>` các file SDK self-host khi phụ huynh **bật đồng bộ**. Khi tắt (mặc định), app không hề chạm mạng.
4. **Bộ safety-check riêng cho vùng sync**: KHÔNG nới chung `https://`/`fetch`. Thay vào đó whitelist **endpoint cụ thể** (`firestore.googleapis.com`, `identitytoolkit.googleapis.com`, …) và bắt buộc **App Check**. Lõi học giữ test gốc; vùng sync có test riêng cho phép đúng các domain Firebase đã liệt kê.
5. **App Check + email verification + chỉ Email/Password+Google + rules kín**: `apiKey` Firebase là công khai (không phải bí mật) → kẻ lạ có thể đốt quota của bạn. App Check (reCAPTCHA/attestation) chặn lạm dụng từ ngoài app.

**Lý do.** Giữ trọn 3 trụ cột cho phần trẻ dùng; khoanh rủi ro mạng vào nơi tối thiểu (trang phụ huynh, opt-in). Tránh "nới whitelist `https://`" = tự gỡ hàng rào an toàn cho cả app.

**Đánh đổi.** Self-host SDK = phải cập nhật tay khi Firebase ra bản mới (hiếm, chấp nhận). Hai bộ safety-check. Đây là chi phí bắt buộc để vừa có sync vừa giữ an toàn — KHÔNG có viên đạn bạc.

> **Quyền riêng tư trẻ em — chốt bất biến:** App học (trẻ dùng) **không gọi mạng, không Firebase, không analytics**. Mọi liên lạc cloud chỉ xảy ra ở trang phụ huynh sau khi phụ huynh chủ động bật.

---

## 5. PWA

### ADR-8: Service worker network-first cho app shell, cache-first cho content/audio

**Quyết định.** Kế thừa `sw.js` của site Toán (network-first + fallback cache, chỉ same-origin GET — `sw.js:34–61`), điều chỉnh phạm vi cache:

- **Precache (install):** app shell — `index.html`, `parent.html`, `engine.js`, `tts.js`, `progress.js`, `manifest.webmanifest`, icons.
- **Content & audio (`content/**`, `audio/**`):** **cache-first** (chỉ-đọc, đổi hiếm) → mở offline tức thì, không phụ thuộc mạng. Tải khi học unit đó, giữ trong cache.
- **`sync/**` (Firebase SDK):** **KHÔNG precache vào shell** (giữ shell gọn, an toàn). Cache lười khi lần đầu bật sync, nếu muốn dùng offline lại; hoặc để network-first.
- **KHÔNG can thiệp** request cross-origin tới Firebase (giữ nguyên `sw.js:40` bỏ qua khác-origin) → tránh SW vô tình cache phản hồi cloud.

**Lý do.** Trẻ mở app là chạy ngay offline; nội dung học sẵn trong cache; vùng cloud không làm bẩn cache shell.

**Đánh đổi.** Cache-first content cần **chiến lược cập nhật phiên bản** (dưới).

### 5.2. Chiến lược cập nhật phiên bản

**Quyết định.**
- **Cache name có version**: `enkids-v1` (như `toanvui-lop3-v1`). Tăng version khi đổi shell/nội dung → `activate` xoá cache cũ (kế thừa `sw.js:26–32`).
- **App shell: network-first** → sửa code/nội dung đẩy lên là lần online kế tiếp tự lấy bản mới, vẫn fallback offline.
- **Content versioned trong `content/index.json`** (vd mỗi unit có `contentV`): khi tăng, client biết refetch unit đó. Đơn giản nhất cho MVP: **bump cache version** mỗi lần release nội dung.
- Hiển thị nhẹ "có bản mới, tải lại" khi `sw` có bản chờ (tuỳ chọn, không bắt buộc MVP).

**Đánh đổi.** Bump version thủ công mỗi release. Chấp nhận cho dự án nhỏ (đã làm vậy ở site Toán).

---

## 6. Chi phí (Firebase free-tier / Spark)

**Mô hình ước lượng (sync bật, theo ADR-3 ghi gộp cuối phiên):**

| Hành vi | Read | Write | Ghi chú |
|---|---|---|---|
| Mở app, pull tiến độ 1 con | ~ số unit đang học (vd 3–10 doc) | 0 | pull theo `lastPullTs` để giảm |
| Một phiên học (đụng 2–4 unit) | 0 (đã có local) | ~2–4 write (1/unit, cuối phiên) | gộp qua outbox |
| Trang phụ huynh xem dashboard | ~ số unit của các con | 0 | có thể cache local |
| **Ước/bé/ngày** | **~10 read** | **~5 write** | |

**Giới hạn Spark (miễn phí):** ~**50.000 read/ngày**, **20.000 write/ngày**, **1 GiB lưu trữ**, **10 GiB/tháng băng thông**.

→ Với **quy mô gia đình / lớp nhỏ** (vd ≤ vài trăm bé hoạt động/ngày): hàng nghìn read & write/ngày — **dưới 1–5% hạn mức free**. Lưu trữ vài KB/doc × vài unit × vài bé = **vài MB**, không đáng kể.

**Ngưỡng cần lưu ý / khi nào trả tiền:**
- Nếu **lỡ làm "log từng câu"** (đã loại) → write tăng ~10× → vẫn free ở quy mô nhỏ nhưng phí phạm; **không làm**.
- Phình khi quy mô **lớp/trường** đông (hàng nghìn bé đồng thời) → theo dõi read (dashboard phụ huynh là nguồn read lớn nhất → **cache dashboard ở local**, refetch thưa).
- Auth có hạn mức gửi email verify; quy mô nhỏ không chạm.

**Kết luận chi phí:** Free-tier **dư sức** cho mục tiêu thực tế. "Chi phí thật" không nằm ở hoá đơn mà ở **dev time + bề mặt bảo mật + độ giòn offline** khi thêm cloud → lý do càng nên để sync là **opt-in/giai đoạn sau**.

---

## 7. Rủi ro, đánh đổi & khuyến nghị MVP

### Bảng rủi ro → mức độ → giảm thiểu

| Rủi ro | Mức | Giảm thiểu | Mức KN |
|---|---|---|---|
| Firebase SDK gọi `fetch`/domain ngoài phá offline-first & đụng `safety.spec` | Cao | Self-host SDK; cô lập vùng `sync/` + `parent.html`; lazy-load; app trẻ không chạm mạng; safety-check riêng theo endpoint | 🔴 chặn |
| `apiKey` công khai → người lạ đốt quota | TB | App Check + email verification + rules kín | 🔴 chặn |
| Mất tiến độ khi đồng bộ đa thiết bị (LWW toàn doc) | Cao | Hợp nhất đơn điệu cấp-trường (max/LWW-trường), idempotent (§3.3) | 🟠 nên sửa |
| PII trẻ em / vi phạm an toàn | Cao | Trẻ không đăng nhập, không PII; chỉ số liệu tổng hợp; rules cách ly theo uid | 🔴 chặn |
| localStorage chạm trần / hỏng | TB | IndexedDB cho khối lớn; mọi truy cập storage try/catch; schema `v` để migrate | 🟠 nên sửa |
| SW cache nội dung cũ sau khi sửa | TB | Cache version + network-first shell + bump khi release | 🟡 cân nhắc |
| TTS đọc sai âm (phonics) | Cao (sư phạm) | audio âm chuẩn cốt lõi cục bộ trong `audio/`; không phó mặc TTS đọc âm rời | 🟠 (thuộc nội dung, kiến trúc chỉ đảm bảo chỗ chứa `audio/` cục bộ + cache) |
| Phạm vi 3 level quá lớn | Cao | Chia giai đoạn; MVP chỉ Level 1, offline-only | 🟠 nên sửa |
| Over-engineering sync khi chưa cần | TB | Mặc định TẮT sync; Export/Import JSON thay thế ở MVP | 🟡 cân nhắc |

### Khuyến nghị MVP (theo giai đoạn)

**MVP (Level 1) — KHÔNG Firebase, 100% offline:**
- localStorage (hoặc IndexedDB nếu state lớn) + Progress API (`save/getMastery`); `sync()` để **no-op** khi `sync.enabled=false`.
- **Export / Import JSON** (phụ huynh tự backup & chuyển máy) → đạt ~80% nhu cầu "đa thiết bị" mà KHÔNG cần cloud, giữ trọn an toàn & offline.
- Trang phụ huynh đọc tiến độ **trực tiếp từ local** (cùng máy) — chưa cần cloud.
- Service worker + manifest (PWA cài về máy).
- `safety.spec` (port từ site Toán) **xanh tuyệt đối** vì không có mạng.

**Giai đoạn nâng cấp (P5 — chỉ khi thực sự cần đa thiết bị/đa nơi):**
- Bật `sync/` self-host SDK, Auth phụ huynh, Firestore theo §2.2/§4, App Check, rules kín, merge §3.3.
- Mặc định **TẮT**; app luôn chạy đủ khi tắt.

**Khuyến nghị mạnh nhất:** đừng để "đã định dùng Firebase" quyết định kiến trúc. Tách bạch **"app học offline an toàn" (làm ngay, là lõi)** khỏi **"đồng bộ đa thiết bị" (cloud, opt-in, làm sau)**. Lõi không bao giờ phụ thuộc cloud.

---

## 8. Kết luận

**CHẤP NHẬN CÓ ĐIỀU KIỆN.**

Hướng "offline-first PWA tĩnh + Firebase đồng bộ tuỳ chọn + trang phụ huynh" là **đúng và khả thi trên Windows free-tier**, miễn tuân thủ các điều kiện chặn (🔴):

1. **App học của trẻ tuyệt đối không chạm mạng/Firebase/analytics** — cloud chỉ ở trang phụ huynh, opt-in, self-host SDK (KHÔNG CDN). Giữ `safety.spec` xanh cho lõi.
2. **Không PII trẻ; rules cách ly theo `uid` + email_verified + App Check.**
3. **Lưu document tổng hợp per `level_unit`, ghi gộp cuối phiên** — không log từng câu.
4. **Hợp nhất đa thiết bị đơn điệu cấp-trường** — không LWW toàn document.
5. **MVP chạy 100% offline + Export/Import**, Firebase để giai đoạn sau.

Nếu thiếu một trong các điều kiện trên (đặc biệt #1 và #2) → **cần thiết kế lại** vùng đó trước khi triển khai.

> **Phối hợp:** chữ ký `engine.generate(...)` và `progress.save/getMastery/sync(...)` + schema Content JSON do `dieu-phoi` chốt trong `docs/CONTRACTS.md`. Tài liệu này cam kết phần lưu trữ/rules/sync/PWA **khớp** các chữ ký đó; nếu CONTRACTS đổi chữ ký, cập nhật §2–§3 tương ứng và tăng version tài liệu.

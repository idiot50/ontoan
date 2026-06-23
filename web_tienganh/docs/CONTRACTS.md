# INTERFACE CONTRACTS — Web học tiếng Anh trẻ em (v1)

> **Trạng thái: ĐÓNG BĂNG (frozen) — version `v1`.**
> Đây là hợp đồng giao diện giữa 4 luồng song song: **Nội dung · Engine · Frontend · Backend/Sync**.
> Mỗi luồng code theo contract này mà KHÔNG cần chờ luồng khác. Mọi thay đổi phá vỡ tương thích phải
> qua `dieu-phoi-du-an-web-tienganh` duyệt và **tăng version** (`v2`…). Sửa nhỏ tương thích ngược (thêm
> trường tuỳ chọn) giữ nguyên `v1` nhưng ghi vào CHANGELOG cuối file.
>
> Tham chiếu: `en_md/KE_HOACH_WEBSITE_TIENGANH.md` (mục 6, 7) và `en_md/QUY_TRINH_PHAT_TRIEN.md` (mục 4).

---

## 0. Quy ước chung (áp cho mọi contract)

- **Mọi `id` là chuỗi `kebab-case`**, ổn định, không đổi sau khi phát hành (dùng làm khoá tiến độ).
- **Văn bản hiển thị cho người dùng (UI) là TIẾNG VIỆT**; nội dung học là tiếng Anh.
- **Mọi văn bản tiếng Anh PHẢI đọc được bằng TTS** (trường `audioText` hoặc nội dung gốc).
- **Nội dung GỐC**: không chép nguyên văn lời hát/truyện/đoạn đọc/nhân vật/hình/đáp án từ sách.
- Mã định danh trường giữ nguyên tiếng Anh (vd `word`, `vi`, `example`) để khớp toàn dự án.
- Trẻ 7–10, offline-first, HTML/CSS/JS thuần + JSON. Không thu thập PII của trẻ.

---

## 1. CONTENT JSON SCHEMA — `content/levelX/unitYY.json`

Luồng **Nội dung** sản xuất. Luồng **Engine** và **Frontend** tiêu thụ (chỉ đọc).

### 1.1. Quy ước file & tên
- Đường dẫn: `content/level<L>/unit<NN>.json` — `L` ∈ {1,2,3}; `NN` = 2 chữ số (`01`..`15`, `00` = Starter).
- Mã hoá: UTF-8, không BOM. Một file = một unit.
- Index unit của một level: `content/level<L>/index.json` (danh sách unit + thứ tự + tiêu đề VN).

### 1.2. Cấu trúc đối tượng unit (top-level)

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `schemaVersion` | string | ✅ | Cố định `"v1"`. |
| `level` | number | ✅ | 1 \| 2 \| 3. |
| `unit` | number | ✅ | Số unit (0 = Starter). |
| `topic` | string | ✅ | Chủ đề (EN), vd `"School things"`. |
| `topic_vi` | string | ✅ | Chủ đề (VN), vd `"Đồ dùng học tập"`. |
| `vocab` | VocabItem[] | ✅ | Danh sách từ vựng. |
| `grammar` | GrammarPoint[] | ✅ | Các điểm ngữ pháp (có thể rỗng `[]`). |
| `phonics` | PhonicsBlock \| null | ✅ | Khối phonics (null nếu unit không có). |
| `reading` | ReadingItem[] | ✅ | Bài đọc (có thể rỗng `[]`; L1 thường rỗng/ngắn). |

### 1.3. `VocabItem`
> Sư phạm (review mục 13): mỗi từ luôn có HÌNH + CÂU ngữ cảnh + ÂM, không chỉ nghĩa VN. Dạy theo cụm.

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `word` | string | ✅ | Từ/cụm tiếng Anh, vd `"a red pen"` hoặc `"pen"`. |
| `vi` | string | ✅ | Nghĩa tiếng Việt. |
| `icon` | string | ✅ | Emoji hoặc tên icon SVG giấy phép mở. |
| `example` | string | ✅ | Câu ngữ cảnh gốc, vd `"It's a pen."` (TTS đọc được). |
| `partOfSpeech` | string | ⬚ | `"noun"|"verb"|"adj"|"phrase"`… (gợi ý cho engine). |
| `audio` | string | ⬚ | Đường dẫn file phát âm chuẩn `assets/audio/...`; nếu thiếu → dùng TTS. |

### 1.4. `GrammarPoint`
> Sư phạm: mẫu câu trong ngữ cảnh TRƯỚC, quy tắc SAU; giải thích VN tối giản, tránh thuật ngữ.
> **Engine chỉ ráp bài trong `safeZone` (vùng an toàn)** — KHÔNG tổ hợp tự do (review mục 13, điểm 3).

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `id` | string | ✅ | `kebab-case` duy nhất trong level, vd `"what-is-this"`. |
| `title_vi` | string | ✅ | Tiêu đề VN, vd `"Cái này là gì?"`. |
| `explain_vi` | string | ✅ | Giải thích VN ngắn, không thuật ngữ. |
| `examples` | string[] | ✅ | ≥2 câu mẫu EN có ngữ cảnh (TTS đọc được). |
| `generators` | string[] | ✅ | Loại bài engine được phép sinh, vd `["fill_blank","mcq","order_words"]`. |
| `safeZone` | SafeZone | ✅ | Khuôn dữ liệu để engine ráp bài (xem 1.4.1). |

#### 1.4.1. `SafeZone` (then chốt — biên soạn cung cấp, engine ráp trong khuôn)

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `templates` | Template[] | ✅ | Mẫu câu có chỗ trống, vd `"It's {art} {noun}."`. |
| `slots` | object | ✅ | Bản đồ tên-slot → danh sách giá trị hợp lệ (đã kiểm a/an, số nhiều…). |
| `answerKey` | object | ⬚ | Quy tắc chọn đáp án đúng cho mỗi template (nếu không suy ra được tự động). |
| `distractors` | string[] | ⬚ | Câu/đáp án nhiễu **theo lỗi điển hình của người Việt** (sai thì, thiếu -s, sai giới từ). |
| `irregulars` | object | ⬚ | Bất quy tắc đi kèm (vd `{"child":"children"}`, `{"go":"went"}`). |

- `Template = { id, text, blanks?, audioText? }` — `blanks` liệt kê tên slot xuất hiện trong `text`.
- **Bất biến nội dung:** với mọi tổ hợp slot mà biên soạn liệt kê, câu ráp ra phải đúng ngữ pháp và có đúng 1 đáp án. Engine KHÔNG được tạo tổ hợp ngoài `slots`.

### 1.5. `PhonicsBlock`
> Sư phạm: phonics dạy qua TỪ TRỌN VẸN; KHÔNG bắt TTS phát âm rời từng âm vị. Ưu tiên `audio` nhúng cho âm cốt lõi.

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `focus` | string[] | ✅ | Âm/chữ trọng tâm, vd `["a","b","c","d"]` hoặc `["sh","ch","th"]`. |
| `words` | PhonicsWord[] | ✅ | Từ ví dụ chứa âm trọng tâm. |
| `audio` | string | ⬚ | Đường dẫn audio âm vị chuẩn (nếu có) `assets/audio/phonics/...`. |

- `PhonicsWord = { word, icon?, audio?, focusSound }` — `focusSound` ∈ `focus` (âm mà từ minh hoạ).

### 1.6. `ReadingItem`
> Sư phạm: controlled vocabulary (chỉ dùng từ đã/đang học); câu hỏi kèm hình + nút nghe.

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `id` | string | ✅ | `kebab-case`. |
| `title` | string | ✅ | Tiêu đề EN (gốc). |
| `title_vi` | string | ⬚ | Tiêu đề VN. |
| `text` | string | ✅ | Đoạn văn gốc (TTS đọc được; controlled vocab). |
| `questions` | ReadingQuestion[] | ✅ | Câu hỏi hiểu. |

- `ReadingQuestion = { id, q_vi, type:"truefalse"|"mcq", choices?, answer, audioText? }`
  - `truefalse`: `answer` ∈ `true|false`; `choices` không cần.
  - `mcq`: `choices: string[]` (≥3), `answer` = chỉ số (number) của đáp án đúng.

### 1.7. VÍ DỤ JSON HỢP LỆ ĐẦY ĐỦ — `content/level1/unit01.json`

```json
{
  "schemaVersion": "v1",
  "level": 1,
  "unit": 1,
  "topic": "School things",
  "topic_vi": "Đồ dùng học tập",
  "vocab": [
    { "word": "pen", "vi": "bút mực", "icon": "🖊️", "example": "It's a pen.", "partOfSpeech": "noun" },
    { "word": "book", "vi": "quyển sách", "icon": "📕", "example": "It's a book.", "partOfSpeech": "noun" },
    { "word": "apple", "vi": "quả táo", "icon": "🍎", "example": "It's an apple.", "partOfSpeech": "noun" },
    { "word": "bag", "vi": "cái cặp", "icon": "🎒", "example": "It's a bag.", "partOfSpeech": "noun" }
  ],
  "grammar": [
    {
      "id": "what-is-this",
      "title_vi": "Cái này là gì?",
      "explain_vi": "Hỏi về một đồ vật: nói \"What's this?\". Trả lời: \"It's a ...\" (hoặc \"It's an ...\" khi từ bắt đầu bằng nguyên âm).",
      "examples": ["What's this? It's a pen.", "What's this? It's an apple."],
      "generators": ["fill_blank", "mcq", "order_words"],
      "safeZone": {
        "templates": [
          { "id": "it-is-art-noun", "text": "It's {art} {noun}.", "blanks": ["art"], "audioText": "It's a pen." }
        ],
        "slots": {
          "art": ["a", "an"],
          "noun": ["pen", "book", "apple", "bag"]
        },
        "answerKey": {
          "it-is-art-noun": { "art": { "pen": "a", "book": "a", "apple": "an", "bag": "a" } }
        },
        "distractors": ["It's an pen.", "It's a apple.", "Is a pen."],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "focus": ["a", "b", "c", "d"],
    "words": [
      { "word": "apple", "icon": "🍎", "focusSound": "a" },
      { "word": "bag", "icon": "🎒", "focusSound": "b" },
      { "word": "cat", "icon": "🐱", "focusSound": "c" },
      { "word": "dog", "icon": "🐶", "focusSound": "d" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "my-bag",
      "title": "My bag",
      "title_vi": "Cái cặp của em",
      "text": "Look. It's my bag. A pen, a book and an apple.",
      "questions": [
        { "id": "q1", "q_vi": "Trong cặp có quyển sách không?", "type": "truefalse", "answer": true, "audioText": "Is there a book?" },
        { "id": "q2", "q_vi": "Đồ nào ở trong cặp?", "type": "mcq", "choices": ["a pen", "a dog", "a cat"], "answer": 0, "audioText": "What is in the bag?" }
      ]
    }
  ]
}
```

---

## 2. ENGINE API — `js/engine.js` (JS thuần, độc lập UI)

Luồng **Engine** sản xuất. **Frontend** tiêu thụ; **QA** test bằng `seed` cố định.

### 2.1. Chữ ký hàm

```js
// Sinh MỘT bài tập đã có sẵn đáp án từ một đặc tả.
// seed (tuỳ chọn): số nguyên → cùng seed + cùng spec ⇒ CÙNG kết quả (tái lập được, test được).
engine.generate(spec, seed?) // → Exercise

// Exercise (đối tượng trả về):
{
  type:      string,    // = spec.type
  prompt:    string,    // câu hỏi/đề bài hiển thị (kèm hướng dẫn VN nếu cần)
  answer:    any,       // đáp án đúng — kiểu tuỳ type (xem bảng 2.3)
  explain:   string,    // giải thích NGẮN bằng tiếng Việt (vì sao đúng)
  choices?:  string[],  // các lựa chọn (mcq, listen_choose, phonics_pick)
  audioText?: string,   // chuỗi EN để TTS đọc (listen_choose, phonics_pick, hoặc đọc câu đúng)
  tokens?:   string[]   // các thẻ từ cần sắp xếp (order_words)
}
```

### 2.2. `spec` — đầu vào (Frontend dựng từ Content JSON)

Trường chung cho mọi `type`:

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `type` | string | ✅ | Một trong 7 loại ở mục 2.3. |
| `level` | number | ✅ | 1\|2\|3. |
| `unit` | number | ✅ | Số unit. |
| `grammarId` | string | ⬚ | Trỏ tới `GrammarPoint.id` (bài ngữ pháp). |
| `grammar` | GrammarPoint | ⬚ | Đối tượng grammar đầy đủ (gồm `safeZone`) — engine ráp trong vùng an toàn. |
| `vocabPool` | VocabItem[] | ⬚ | Tập từ vựng dùng cho bài (mcq/match/listen_choose/phonics). |
| `phonics` | PhonicsBlock | ⬚ | Khối phonics (cho `phonics_pick`). |

> **Quy tắc nguồn dữ liệu:** engine CHỈ dùng dữ liệu trong `spec` (`grammar.safeZone`, `vocabPool`, `phonics`). KHÔNG tự bịa từ/câu ngoài vùng an toàn.

### 2.3. Các `type` và đặc tả riêng + dạng `answer`

| `type` | Cần trong spec | `answer` | `choices?` | Ghi chú |
|---|---|---|---|---|
| `fill_blank` | `grammar` (safeZone) | string (từ/dạng đúng điền vào) | — | `prompt` chứa chỗ trống `___`. |
| `mcq` | `grammar` hoặc `vocabPool` | number (chỉ số đáp án đúng trong `choices`) | ✅ ≥4 (1 đúng + nhiễu) | Nhiễu lấy từ `distractors` hoặc vocab khác. |
| `order_words` | `grammar` (template) | string[] (thứ tự từ đúng) | — | Trả `tokens[]` đã xáo trộn. |
| `transform` | `grammar` (safeZone) | string (câu sau biến đổi) | — | Vd khẳng định→phủ định; phải nằm trong safeZone. |
| `match` | `vocabPool` | object (bản đồ trái→phải đúng) | — | `prompt` mô tả; UI render cặp nối. |
| `listen_choose` | `vocabPool` hoặc `grammar` | number (chỉ số trong `choices`) | ✅ | `audioText` = câu/từ TTS đọc; trẻ chọn hình/từ. |
| `phonics_pick` | `phonics` | number (chỉ số trong `choices`) | ✅ | "Nghe/nhìn âm → chọn từ cùng âm"; ưu tiên `audio` nhúng nếu có. |

### 2.4. BẤT BIẾN (engine PHẢI bảo đảm — QA kiểm bằng property test)

1. **Đúng 1 đáp án.** Mỗi bài có đúng một đáp án đúng; với `mcq/listen_choose/phonics_pick`, không có lựa chọn nhiễu nào tình cờ cũng đúng.
2. **Câu hợp lệ.** Mọi câu/đề sinh ra đúng ngữ pháp (a/an, số nhiều, bất quy tắc theo `safeZone`). KHÔNG ráp tổ hợp ngoài `slots`.
3. **Tái lập.** `generate(spec, seed)` xác định (deterministic) theo `seed`.
4. **`choices` hợp lệ.** Số lựa chọn ≥ yêu cầu; phần tử duy nhất; `answer` (chỉ số) nằm trong khoảng.
5. **Có giải thích VN.** `explain` luôn không rỗng, ngắn, không thuật ngữ.
6. **TTS sẵn sàng.** Với loại nghe, `audioText` luôn có và đọc được.
7. **Không lỗi yên lặng.** Nếu `spec` thiếu dữ liệu (vd `phonics_pick` không có đủ từ) → ném lỗi rõ ràng, không trả bài hỏng.

---

## 3. PROGRESS API — `js/progress.js` (JS thuần, offline-first)

Luồng **Backend/Sync** sản xuất. **Frontend** tiêu thụ. Lưu **local trước**, đồng bộ Firebase sau.

### 3.1. Chữ ký hàm

```js
// Ghi một bản ghi kết quả: LƯU LOCAL NGAY (localStorage/IndexedDB) + đưa vào hàng đợi đồng bộ.
progress.save(record) // → Promise<void>

// Lấy % thành thạo từng unit của một hồ sơ con (đọc từ local, gộp các bản ghi).
progress.getMastery(childId) // → Promise<Mastery>

// Đẩy hàng đợi local lên Firebase + kéo về khi online. Không mạng ⇒ no-op an toàn.
progress.sync() // → Promise<SyncResult>
```

### 3.2. `record` — bản ghi kết quả (Frontend gửi)

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `childId` | string | ✅ | Hồ sơ con (do phụ huynh tạo). KHÔNG chứa PII. |
| `level` | number | ✅ | 1\|2\|3. |
| `unit` | number | ✅ | Số unit. |
| `skill` | string | ✅ | `"vocab"|"grammar"|"phonics"|"listening"|"speaking"|"reading"`. |
| `score` | number | ✅ | 0..1 (tỉ lệ đúng) **hoặc** `null` cho kỹ năng không chấm điểm (Nói). |
| `attempts` | number | ✅ | Số lần thử trong phiên. |
| `ts` | number | ✅ | Epoch ms (thời điểm hoàn thành). |
| `effort` | number | ⬚ | Số bài đã luyện (thiên động lực nỗ lực–tiến bộ). |

> **Sư phạm (review mục 13):** kỹ năng `speaking` lưu `score: null` (KHÔNG chấm điểm phát âm). Tiến độ thiên về **nỗ lực & hoàn thành** (`effort`, `attempts`), không chỉ điểm đúng.

### 3.3. `Mastery` — kết quả `getMastery`

```js
{
  childId: string,
  units: [
    { level: number, unit: number, masteryPct: number, // 0..100 (theo % đúng có trọng số)
      bySkill: { vocab: number, grammar: number, phonics: number, listening: number, reading: number },
      effort: number,        // tổng số bài đã luyện
      lastTs: number }       // lần học gần nhất
  ],
  weeklyDays: number         // số ngày học trong tuần (mục tiêu MỀM, không phải streak cứng)
}
```

### 3.4. `SyncResult`

```js
{ ok: boolean, pushed: number, pulled: number, online: boolean, error?: string }
```

### 3.5. BẤT BIẾN

1. **Local trước.** `save` ghi local thành công NGAY cả khi offline; không bao giờ mất bản ghi vì mất mạng.
2. **Idempotent.** Mỗi bản ghi có khoá `(childId, level, unit, skill, ts)`; sync lại không nhân đôi.
3. **Không PII trẻ.** API từ chối/không lưu trường ngoài schema (đặc biệt tên thật, ảnh, ngày sinh trẻ).
4. **Offline an toàn.** `sync()` khi offline trả `{ok:true, online:false}` (no-op), không ném lỗi.
5. **Không streak cứng.** `weeklyDays` là mục tiêu mềm; không có trường "streak" gây áp lực đứt chuỗi.

---

## 4. CẤU TRÚC THƯ MỤC CHUẨN — `web_tienganh/`

```
web_tienganh/
├── index.html                  # Khung UI 1 trang (SPA tĩnh), các màn hình
├── manifest.json               # PWA manifest (cài về máy)
├── sw.js                       # Service worker (cache offline)
├── css/
│   ├── tokens.css              # Design tokens (màu/typography) — designer cung cấp
│   └── app.css                 # Style màn hình/component
├── js/
│   ├── app.js                  # Điều hướng màn hình, gắn kết content+engine+progress+tts
│   ├── engine.js               # CONTRACT §2 — sinh bài tập (generators)
│   ├── tts.js                  # Bọc Web Speech API (en-GB/US, tốc độ chậm, fallback)
│   └── progress.js             # CONTRACT §3 — tiến độ local + đồng bộ Firebase
├── content/
│   ├── level1/
│   │   ├── index.json          # Danh sách + thứ tự unit của Level 1
│   │   ├── unit00.json         # Starter (CONTRACT §1)
│   │   ├── unit01.json
│   │   └── ...
│   ├── level2/
│   └── level3/
├── assets/
│   ├── icons/                  # SVG/emoji giấy phép mở
│   ├── audio/                  # (tuỳ chọn) audio phát âm chuẩn
│   │   └── phonics/            # audio âm vị/từ mẫu cốt lõi
│   └── mascot/                 # linh vật gốc
├── docs/
│   ├── CONTRACTS.md            # File này (v1)
│   └── BACKLOG_MVP.md          # User story + tiêu chí nghiệm thu MVP
├── tests/
│   ├── engine.test.*           # Test unit/property cho engine (QA)
│   └── content.schema.*        # Validate Content JSON theo schema (QA)
└── README.md
```

### 4.1. Cách dùng mock (để song song không bị chặn)
- **Frontend** chưa có engine thật → import `engine.generate` trả bài mẫu cố định (cùng chữ ký §2).
- **Frontend** chưa có backend → `progress.*` ghi vào localStorage, `sync()` là no-op (cùng chữ ký §3).
- **Engine/QA** chưa có content thật → dùng ví dụ §1.7 làm fixture.

---

## CHANGELOG

- **v1 (2026-06-22)** — Bản đóng băng đầu tiên: Content JSON, Engine API, Progress API + cấu trúc thư mục. Tiếp thu review sư phạm: `safeZone` cho engine, `speaking` không chấm điểm, mục tiêu tuần mềm (không streak), phonics ưu tiên audio nhúng.

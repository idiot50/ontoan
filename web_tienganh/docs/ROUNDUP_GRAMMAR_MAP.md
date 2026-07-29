# Bản đồ ngữ pháp — track `grammar3` (Ngữ pháp Tăng cường, 20 bài)

> **Trạng thái:** đã soạn xong **cả 20 bài** và pass test (`node tests/grammar3.test.mjs` → 453 checks).
> Đã nối vào app và xuất bản (xem §5).

---

## 1. Nguồn gốc & bản quyền (đọc trước)

Mạch 20 bài dưới đây là **syllabus ôn ngữ pháp phổ thông** cho học sinh ~9–12 tuổi: thứ tự
danh từ → đại từ → mạo từ → thì → câu phức. Trình tự này là kiến thức chung của việc dạy
tiếng Anh, xuất hiện trong hầu hết sách ôn ngữ pháp, và được dùng ở đây làm **blueprint** —
đúng cách dự án đã dùng Family & Friends cho Level 1–3 (xem `README.md`).

**Toàn bộ câu tiếng Anh, ví dụ, đáp án, câu nhiễu, bài đọc và câu hỏi trong track này là nội
dung GỐC do dự án tự soạn.** Không có câu nào chép từ sách hay đĩa CD-ROM thương mại. Không
dùng hình ảnh, âm thanh, hoạt hình hay file dữ liệu của bên thứ ba — minh hoạ dùng emoji.

Ràng buộc này KHÔNG được nới lỏng: site này công khai trên GitHub Pages và có cổng thanh
toán, nên nội dung sao chép sẽ là vi phạm bản quyền thật. Ai soạn thêm hoặc sửa nội dung sau này cũng phải tự
viết câu mới, không "chép rồi sửa vài chữ".

---

## 2. Bản đồ 20 bài

> Bảng này sinh TỪ NỘI DUNG THẬT trong `content/grammar3/` (đã soạn xong cả 20 bài),
> không phải kế hoạch. `GP` = số điểm ngữ pháp. Cột generators là hợp của mọi điểm trong bài;
> `order_words` vắng ở nhiều bài vì mẫu câu vượt 8 thẻ hoặc có thẻ trùng (§3.4), và `transform`
> chỉ có ở các điểm có cặp khẳng định↔phủ định tự nhiên (§3.7 — hiện chưa có đường vào UI).

| # | unit id | Tiêu đề VN | GP | Điểm ngữ pháp | Generators |
|---|---|---|---|---|---|
| 1 | 401 | Số nhiều & danh từ không đếm được | 3 | `plural-regular` · `plural-irregular` · `uncountable-some-much-many` | fill_blank · mcq · listen · order_words |
| 2 | 402 | Đại từ · to be · have got · can | 4 | `subject-pronouns` · `be-am-is-are` · `have-got` · `can-bare-infinitive` | fill_blank · mcq · listen · order_words · transform |
| 3 | 403 | Sở hữu & từ chỉ định | 3 | `possessive-adjectives` · `possessive-s` · `demonstratives` | fill_blank · mcq · listen · order_words |
| 4 | 404 | Mạo từ a / an / the | 3 | `a-vs-an` · `the-definite` · `no-article` | fill_blank · mcq · order_words |
| 5 | 405 | Diễn tả số lượng | 3 | `some-any` · `a-lot-of` · `a-few-a-little` | fill_blank · mcq · listen |
| 6 | 406 | Đại từ bất định | 3 | `some-any-no-body` · `thing-compounds` · `every-where` | fill_blank · mcq |
| 7 | 407 | Hiện tại đơn | 4 | `third-person-s` · `do-does-questions` · `dont-doesnt` · `frequency-adverbs` | fill_blank · mcq · order_words · listen · transform |
| 8 | 408 | Hiện tại tiếp diễn | 3 | `be-ving` · `ing-spelling` · `simple-vs-continuous` | fill_blank · mcq · order_words · transform · listen |
| 9 | 409 | Giới từ | 3 | `prep-place` · `prep-movement` · `prep-time` | fill_blank · mcq · listen |
| 10 | 410 | Quá khứ đơn | 4 | `ed-regular` · `irregular-past` · `did-questions` · `was-were` | fill_blank · mcq · transform · listen · order_words |
| 11 | 411 | Hiện tại hoàn thành | 3 | `have-has-v3` · `ever-never` · `just-already-yet` | fill_blank · mcq · transform |
| 12 | 412 | Quá khứ tiếp diễn | 3 | `was-were-ving` · `when-while` · `past-simple-vs-continuous` | fill_blank · mcq · listen |
| 13 | 413 | Tương lai | 3 | `be-going-to` · `will` · `will-vs-going-to` | fill_blank · mcq · listen · transform |
| 14 | 414 | Động từ khiếm khuyết | 4 | `must-mustnt` · `should` · `may-permission` · `have-to` | fill_blank · mcq · listen |
| 15 | 415 | Câu điều kiện | 3 | `zero-conditional` · `first-conditional` · `second-conditional` | fill_blank · mcq · listen |
| 16 | 416 | Câu hỏi | 3 | `yes-no-questions` · `wh-questions` · `question-word-order` | fill_blank · mcq · listen · transform · order_words |
| 17 | 417 | Câu bị động | 3 | `present-passive` · `past-passive` · `by-agent` | fill_blank · mcq · listen · transform |
| 18 | 418 | To V · V-ing · too/enough | 3 | `want-to-v` · `like-ving` · `too-enough` | fill_blank · mcq · listen |
| 19 | 419 | Đại từ quan hệ | 3 | `who-person` · `which-thing` · `whose-possession` | fill_blank · mcq · listen |
| 20 | 420 | Tính từ · trạng từ · so sánh | 4 | `adj-vs-adverb` · `comparative-er` · `superlative-est` · `as-as-equal` | fill_blank · mcq · listen |

**Tổng: 20 bài · 65 điểm ngữ pháp · 148 mẫu câu · 201 tổ hợp (điểm × loại bài).**
Bài 20 trùng chủ đề với `content/level3/lesson01.json` (so sánh hơn/nhất) nhưng đã đối chiếu
tự động: 0 câu tiếng Anh trùng, và bài 20 thêm `as … as` + trạng từ `-ly` + bất quy tắc
`good/better/best`. Bài 13 tương tự với `lesson03.json` (tương lai) — cũng 0 câu trùng.

---

## 3. Quy tắc soạn `safeZone` (BẮT BUỘC — rút ra từ engine)

Engine (`js/engine.js`) ráp câu từ `templates` + `slots`. Ba quy tắc dưới đây quyết định bài
có đúng một đáp án hay không; `tests/grammar3.test.mjs` kiểm tự động cả ba.

### 3.1. Mọi slot chỗ trống PHẢI do `answerKey` điều khiển

Trong `buildSentence`, nếu slot chỗ trống **không** có trong `answerKey[template.id]`, engine
**chọn ngẫu nhiên một giá trị trong slot rồi coi đó là đáp án đúng** — bài thành nhiều đáp án
và chấm sai. Vì vậy mỗi blank phải có luật, dùng `__cond` trỏ tường minh sang slot điều kiện:

```json
"templates": [
  { "id": "one-two", "text": "One {noun}, two {plural}.", "blanks": ["plural"] }
],
"slots": {
  "noun":   ["box", "city"],
  "plural": ["boxes", "cities"]
},
"answerKey": {
  "one-two": {
    "plural": { "__cond": "noun", "box": "boxes", "city": "cities" }
  }
}
```

`answerKey` phải phủ **hết** giá trị của slot điều kiện — thiếu một giá trị là engine ném lỗi
lúc chạy. Test kiểm điều này trước, nên lỗi lộ ra ở CI chứ không lộ ra trước mặt học sinh.

### 3.2. Template phải TỰ CHỨA manh mối để suy ra đáp án

Câu phải cho học sinh đủ căn cứ chọn đúng, chỉ dựa vào chính câu đó.

- ✅ `"One {noun}, two {plural}."` — số ít ở trước là manh mối.
- ✅ `"{demNear} {thing} here {beNear} mine."` — `here` báo GẦN, `thing` số ít/nhiều báo số.
- ❌ `"There are three ___ on the table."` — bất kỳ danh từ số nhiều nào cũng đúng.
- ❌ `"A giraffe is ___ than a horse."` với slot `["taller","bigger","faster"]` — cả ba đều đúng
  ngữ pháp, "đáp án đúng" chỉ là cái engine chọn ngẫu nhiên.

### 3.3. `distractors` phải LUÔN sai, và cùng chủ đề với câu đúng

`mcq`/`listen_choose` lấy nhiễu từ `distractors` (dùng chung cho cả grammar point, không theo
từng template). Hai yêu cầu:

- **Luôn sai với mọi tổ hợp slot.** Nếu một distractor tình cờ trùng câu đúng sinh ra, engine
  ném lỗi. Viết nhiễu theo **lỗi điển hình của người Việt**: `"One city, two citys."`,
  `"She have got a new bike."`, `"I need a rice."`, `"This books here are mine."`.
- **Cùng chủ đề/cùng dạng câu với câu đúng**, nếu không trẻ đoán được đáp án chỉ vì nó là
  phương án duy nhất nói về đúng chủ đề. Cần ≥3 nhiễu; nên có 6.

### 3.4. `order_words` — chỉ dùng cho câu NGẮN

Chỉ khai báo `order_words` khi **mọi** template của grammar point tạo câu ≤ 8 thẻ và
**không có thẻ trùng nhau**. Mẫu hai câu (`"My mother is at home. She is happy."`) cho 8 thẻ
với `is` lặp hai lần → trẻ không biết đặt thẻ nào vào đâu và việc chấm gây tranh cãi. Test tự
chặn cả hai trường hợp. Trong bài 1–3, `order_words` chỉ bật ở 5/10 điểm ngữ pháp vì lý do này.

### 3.5. `explain_vi` NGẮN · `teach_vi` DÀI

Engine dùng `explain_vi` làm lời giải hiện ra **sau mỗi câu trả lời**, nên nó phải là 1–2 câu
nêu đúng quy tắc (~100–200 ký tự). Phần dạy chi tiết đặt ở `teach_vi` (trường bổ sung, tương
thích ngược theo CONTRACTS §0) để UI hiện ở màn giới thiệu bài. Nhồi cả đoạn dài vào
`explain_vi` sẽ khiến trẻ phải đọc một bức tường chữ sau từng câu.

### 3.6. Đáp án KHÔNG được là chuỗi rỗng

Engine bắt `answer` phải khác rỗng, nên không thể làm bài "điền vào chỗ trống nếu KHÔNG cần
mạo từ" (đáp án = chuỗi rỗng). Với các điểm dạy "không dùng gì cả" (`no-article`), dùng
`"blanks": []` + `mcq`/`order_words` và dạy bằng cách cho trẻ chọn câu đúng giữa những câu
thừa mạo từ (`play the football`, `have a breakfast`).

### 3.7. `transform` hiện CHƯA có đường vào từ màn luyện tập

`buildSpecs()` trong `js/app.js` chỉ lấy `fill_blank`, `mcq`, `order_words` (và một `mcq` từ
vựng). Điểm ngữ pháp khai báo `transform` vẫn hợp lệ và vẫn được test kiểm, nhưng trẻ sẽ không
gặp dạng bài đó — `transform` bắt gõ lại cả câu và khớp chính xác, dự án cố tình để ngoài MVP.
Đừng dựa vào `transform` làm dạng bài chính của một điểm ngữ pháp.

### 3.8. Bài ngữ pháp: KHÔNG truyền `vocabPool` vào spec

`mcq` và `listen_choose` **ưu tiên `vocabPool` nếu có** và sẽ chuyển sang hỏi nghĩa từ, không
luyện điểm ngữ pháp nữa. Khi frontend dựng spec cho một `GrammarPoint`, chỉ truyền `grammar`:

```js
Engine.generate({ type, level, unit, grammarId: g.id, grammar: g });          // ✅ luyện ngữ pháp
Engine.generate({ type, level, unit, grammar: g, vocabPool: data.vocab });    // ❌ rơi về hỏi từ
```

`vocabPool` chỉ dùng cho bài từ vựng thuần (`mcq` hỏi nghĩa, `listen_choose` nghe-chọn-từ).
`js/app.js` đã dựng spec đúng quy ước này (`buildSpecs` tách riêng nhánh grammar và nhánh vocab).

### 3.9. Đánh số `unit`: 401–420, KHÔNG phải 1–20

`state.units` trong `js/app.js` khoá theo **unit id toàn cục** và `levelOfUnit(id)` suy THƯ MỤC
nội dung từ chính id đó. Level 1 đã dùng `unit` 0–15, nên track này phải dùng **401–420**
(`levelOfUnit` trả 4 → `folderOfLevel(4)` = `grammar3`). Trường `lesson` vẫn là 1–20 — đó là
số bài hiển thị cho trẻ. Unit "ôn tập" của track là **499** (không dùng 409 vì đó là bài 9).

---

## 4. Cấu trúc file

```
content/grammar3/
├── index.json                 # 20 bài · unit 401–420 · status: "ready" | "planned"
└── unit01.json … unit20.json  # cả 20 bài, tất cả status "ready"
```

Mỗi unit theo CONTRACTS §1 và thêm các trường tương thích ngược: `track: "grammar3"`,
`lesson`, `teach_vi` (GrammarPoint), `context_vi` (Template), `status` (index).
`phonics: null` — track này là ngữ pháp, phonics đã dạy ở Level 1–2.

Tên FILE là `unitNN.json` theo số bài (01–20), còn trường `unit` bên trong là **401–420**
(§3.9). Đừng lẫn hai thứ này.

`index.json` liệt kê 20 bài kèm `status`; test **chỉ kiểm bài `status: "ready"`**, nên khi soạn
bài mới có thể để `"planned"` và kiểm riêng bằng `--only` (§6) mà CI vẫn xanh.

---

## 5. Đã nối vào app (xong)

| Việc | File | Cách làm |
|---|---|---|
| Nhận track ngoài `level1..3` | `js/app.js` | `folderOfLevel(lv)` → `lv===4 ? 'grammar3' : 'level'+lv`; `levelOfUnit` trả 4 cho id ≥ 400 |
| Lối vào cho trẻ | `js/app.js` | Màn chọn cấp có thẻ thứ tư "Ngữ pháp Tăng cường" (20 bài, sắc `coral`) |
| Nhãn hiển thị | `js/app.js` | `levelLabel(lv)` → "Ngữ pháp" thay vì "Cấp 4" ở mọi tiêu đề/chip |
| Bản đồ 20 chặng | `js/app.js` | `lessonCountOfLevel` / `lessonIdsOfLevel`; thanh tiến độ dùng tổng số bài thật, không cứng `/5` |
| Unit ôn tập | `js/app.js` | `reviewUnitId(4)` = **499**; gộp cả 20 bài |
| Màn giới thiệu bài | `js/app.js` | Tóm tắt ngữ pháp hiện `teach_vi \|\| explain_vi` |
| Chạy được `file://` | `build/embed_content.mjs` | Thêm `grammar3` vào danh sách thư mục nhúng |
| Cache offline | `sw.js` | Bump `enkids-v6` → `v7` (app shell đổi) |
| Deploy | `.github/workflows/deploy-pages.yml` | **Không cần sửa** — workflow copy `web_tienganh/` → `_site/tienganh/`, `content/grammar3/` tự đi theo (`tests`/`build`/`docs` bị loại khỏi bản xuất bản) |

Sau khi sửa nội dung: chạy `node build/embed_content.mjs` để đồng bộ `js/content-data.js`,
rồi `node tests/run.mjs`.

### Tiến độ (progress)
`progress.save` dùng khoá `(childId, level, unit, skill)`. Track này ghi `level: 3` trong file
JSON nhưng `buildSpecs` truyền `level: levelOfUnit(unit.unit)` = **4** vào bản ghi, và `unit`
401–420 → không trùng Level 1–3. `progress.js` chỉ yêu cầu `level` là số, không giới hạn 1–3.

---

## 6. Chạy test

```bash
cd web_tienganh
node tests/grammar3.test.mjs           # kiểm schema + đơn nghĩa + sinh bài thật (40 seed)
node tests/grammar3.test.mjs --show    # in kèm bài mẫu để duyệt chất lượng bằng mắt
node tests/run.mjs                     # cả 3 bộ: engine · content level1 · grammar3
```

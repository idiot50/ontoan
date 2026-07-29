/*
 * content-data.js — Nhúng nội dung vào window.ContentData để app CHẠY ĐƯỢC trên file://
 * (fetch JSON bị chặn cross-origin trên file://). Bản sao 1:1 của content/**.json.
 * Khi phục vụ qua HTTP, app ưu tiên fetch JSON; file:// rơi về object nhúng này.
 * SINH TỰ ĐỘNG bằng build/embed_content.mjs — KHÔNG sửa tay.
 */
(function (g) {
  'use strict';
  var C = {};
  C["level1/index.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "units": [
    { "unit": 0, "file": "unit00.json", "topic": "Hello!", "topic_vi": "Chào hỏi", "icon": "👋", "order": 0 },
    { "unit": 1, "file": "unit01.json", "topic": "School things", "topic_vi": "Đồ dùng học tập", "icon": "✏️", "order": 1 },
    { "unit": 2, "file": "unit02.json", "topic": "My toys", "topic_vi": "Đồ chơi của em", "icon": "🧸", "order": 2 },
    { "unit": 3, "file": "unit03.json", "topic": "My body", "topic_vi": "Cơ thể của em", "icon": "🧍", "order": 3 },
    { "unit": 4, "file": "unit04.json", "topic": "Jobs", "topic_vi": "Nghề nghiệp", "icon": "🧑‍🏫", "order": 4 },
    { "unit": 5, "file": "unit05.json", "topic": "The park", "topic_vi": "Công viên", "icon": "🛝", "order": 5 },
    { "unit": 6, "file": "unit06.json", "topic": "My family", "topic_vi": "Gia đình của em", "icon": "👨‍👩‍👧", "order": 6 },
    { "unit": 7, "file": "unit07.json", "topic": "My clothes", "topic_vi": "Quần áo của em", "icon": "👕", "order": 7 },
    { "unit": 8, "file": "unit08.json", "topic": "My home", "topic_vi": "Ngôi nhà của em", "icon": "🏠", "order": 8 },
    { "unit": 9, "file": "unit09.json", "topic": "My lunch box", "topic_vi": "Hộp cơm trưa của em", "icon": "🍱", "order": 9 },
    { "unit": 10, "file": "unit10.json", "topic": "My friends", "topic_vi": "Bạn bè của em", "icon": "🧒", "order": 10 },
    { "unit": 11, "file": "unit11.json", "topic": "The zoo", "topic_vi": "Sở thú", "icon": "🦁", "order": 11 },
    { "unit": 12, "file": "unit12.json", "topic": "Food and drinks", "topic_vi": "Đồ ăn thức uống", "icon": "🍎", "order": 12 },
    { "unit": 13, "file": "unit13.json", "topic": "My bedroom", "topic_vi": "Phòng ngủ của em", "icon": "🛏️", "order": 13 },
    { "unit": 14, "file": "unit14.json", "topic": "Abilities", "topic_vi": "Khả năng", "icon": "🤸", "order": 14 },
    { "unit": 15, "file": "unit15.json", "topic": "The beach", "topic_vi": "Bãi biển", "icon": "🏖️", "order": 15 }
  ],
  "lessons": [
    { "lesson": 1, "unit": 101, "file": "lesson01.json", "topic_vi": "Em & lớp học",        "icon": "🎒", "pal": "sun",   "sub": "Chào hỏi · đồ dùng · đồ chơi" },
    { "lesson": 2, "unit": 102, "file": "lesson02.json", "topic_vi": "Cơ thể & con người",   "icon": "🧒", "pal": "sky",   "sub": "Cơ thể · quần áo · nghề nghiệp" },
    { "lesson": 3, "unit": 103, "file": "lesson03.json", "topic_vi": "Gia đình & ngôi nhà",  "icon": "🏠", "pal": "mint",  "sub": "Gia đình · nhà · phòng" },
    { "lesson": 4, "unit": 104, "file": "lesson04.json", "topic_vi": "Bạn bè & vui chơi",    "icon": "🐯", "pal": "coral", "sub": "Bạn bè · công viên · con vật" },
    { "lesson": 5, "unit": 105, "file": "lesson05.json", "topic_vi": "Ăn uống & khám phá",   "icon": "🍎", "pal": "grape", "sub": "Đồ ăn · hộp cơm · biển" }
  ]
};
  C["level1/unit00.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 0,
  "topic": "Hello!",
  "topic_vi": "Chào hỏi",
  "vocab": [
    { "word": "hello", "vi": "xin chào", "icon": "👋", "example": "Hello! I'm Tom.", "partOfSpeech": "phrase", "audio": "" },
    { "word": "goodbye", "vi": "tạm biệt", "icon": "🙋", "example": "Goodbye! See you.", "partOfSpeech": "phrase", "audio": "" },
    { "word": "one", "vi": "số một (1)", "icon": "1️⃣", "example": "I have one pen.", "partOfSpeech": "number", "audio": "" },
    { "word": "two", "vi": "số hai (2)", "icon": "2️⃣", "example": "I have two pens.", "partOfSpeech": "number", "audio": "" },
    { "word": "three", "vi": "số ba (3)", "icon": "3️⃣", "example": "I have three books.", "partOfSpeech": "number", "audio": "" },
    { "word": "red", "vi": "màu đỏ", "icon": "🔴", "example": "It's a red ball.", "partOfSpeech": "adj", "audio": "" },
    { "word": "blue", "vi": "màu xanh dương", "icon": "🔵", "example": "It's a blue bag.", "partOfSpeech": "adj", "audio": "" },
    { "word": "green", "vi": "màu xanh lá", "icon": "🟢", "example": "It's a green pen.", "partOfSpeech": "adj", "audio": "" },
    { "word": "yellow", "vi": "màu vàng", "icon": "🟡", "example": "It's a yellow kite.", "partOfSpeech": "adj", "audio": "" },
    { "word": "Monday", "vi": "thứ Hai", "icon": "📅", "example": "Today is Monday.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "greetings",
      "title_vi": "Chào hỏi và tạm biệt",
      "explain_vi": "Khi gặp nhau, em nói \"Hello!\" (xin chào). Khi chia tay, em nói \"Goodbye!\" (tạm biệt).",
      "examples": [
        "Hello! I'm Tom.",
        "Hello, Mai!",
        "Goodbye! See you."
      ],
      "generators": ["mcq", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "greeting-meet", "text": "Hello!", "blanks": [], "context_vi": "Câu nói khi GẶP nhau.", "audioText": "Hello!" },
          { "id": "greeting-leave", "text": "Goodbye!", "blanks": [], "context_vi": "Câu nói khi CHIA TAY.", "audioText": "Goodbye!" }
        ],
        "slots": {
          "greeting": ["Hello!", "Goodbye!"]
        },
        "answerKey": {
          "greeting-meet": { "greeting": "Hello!" },
          "greeting-leave": { "greeting": "Goodbye!" }
        },
        "distractors": [
          "Hallo!",
          "Goodbay!",
          "Good bye!",
          "Helo!"
        ],
        "irregulars": {}
      }
    },
    {
      "id": "whats-your-name",
      "title_vi": "Hỏi tên: \"What's your name?\"",
      "explain_vi": "Hỏi tên bạn: \"What's your name?\". Em trả lời: \"My name's ...\" rồi nói tên của em.",
      "examples": [
        "What's your name? My name's Tom.",
        "What's your name? My name's Mai.",
        "What's your name? My name's Anna."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "ask-name", "text": "What's your name?", "blanks": [], "context_vi": "Câu HỎI tên người khác.", "audioText": "What's your name?" },
          { "id": "answer-name", "text": "My name's {name}.", "blanks": ["name"], "context_vi": "Câu TRẢ LỜI, nói tên của em.", "audioText": "My name's Tom." }
        ],
        "slots": {
          "name": ["Tom", "Mai", "Anna", "Ben", "Lan"]
        },
        "answerKey": {},
        "distractors": [
          "What your name?",
          "What's you name?",
          "My name Tom.",
          "My name's is Tom.",
          "I name's Tom."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "how-old-are-you",
      "title_vi": "Hỏi tuổi: \"How old are you?\"",
      "explain_vi": "Hỏi tuổi bạn: \"How old are you?\". Em trả lời: \"I'm ...\" rồi nói số tuổi, ví dụ \"I'm seven.\".",
      "examples": [
        "How old are you? I'm seven.",
        "How old are you? I'm eight.",
        "How old are you? I'm nine."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "ask-age", "text": "How old are you?", "blanks": [], "context_vi": "Câu HỎI tuổi.", "audioText": "How old are you?" },
          { "id": "answer-age", "text": "I'm {age}.", "blanks": ["age"], "context_vi": "Câu TRẢ LỜI, nói số tuổi của em.", "audioText": "I'm seven." }
        ],
        "slots": {
          "age": ["six", "seven", "eight", "nine", "ten"]
        },
        "answerKey": {},
        "distractors": [
          "How old you are?",
          "How old are you.",
          "I'm seven years.",
          "I seven.",
          "I'm have seven."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["a", "b"],
    "soundLabels": {
      "a": { "ipa": "/æ/", "anchor": "apple", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"apple\" là /æ/ — đây là ÂM, không phải tên chữ \"ây\"" },
      "b": { "ipa": "/b/", "anchor": "ball", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"ball\" là /b/ — đây là ÂM, không phải tên chữ \"bi\"" }
    },
    "words": [
      { "word": "apple", "icon": "🍎", "focusSound": "a", "anchor": "apple", "audio": "" },
      { "word": "ant", "icon": "🐜", "focusSound": "a", "anchor": "apple", "audio": "" },
      { "word": "arm", "icon": "💪", "focusSound": "a", "anchor": "apple", "audio": "" },
      { "word": "ball", "icon": "⚽", "focusSound": "b", "anchor": "ball", "audio": "" },
      { "word": "bag", "icon": "🎒", "focusSound": "b", "anchor": "ball", "audio": "" },
      { "word": "bus", "icon": "🚌", "focusSound": "b", "anchor": "ball", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "hello-im-tom",
      "title": "Hello, I'm Tom",
      "title_vi": "Xin chào, mình là Tom",
      "text": "Hello! My name's Tom. I'm seven. This is my ball. It's red. Goodbye!",
      "questions": [
        { "id": "q1", "q_vi": "Bạn nhỏ tên là Tom, đúng không?", "type": "truefalse", "answer": true, "audioText": "His name is Tom." },
        { "id": "q2", "q_vi": "Tom bao nhiêu tuổi?", "type": "mcq", "choices": ["seven", "eight", "nine"], "answer": 0, "audioText": "How old is Tom?" },
        { "id": "q3", "q_vi": "Quả bóng màu gì?", "type": "mcq", "choices": ["red", "blue", "green"], "answer": 0, "audioText": "What colour is the ball?" }
      ]
    }
  ]
};
  C["level1/unit01.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 1,
  "topic": "School things",
  "topic_vi": "Đồ dùng học tập",
  "vocab": [
    { "word": "pen", "vi": "bút mực", "icon": "🖊️", "example": "It's a pen.", "partOfSpeech": "noun", "audio": "" },
    { "word": "pencil", "vi": "bút chì", "icon": "✏️", "example": "It's a pencil.", "partOfSpeech": "noun", "audio": "" },
    { "word": "book", "vi": "quyển sách", "icon": "📕", "example": "It's a book.", "partOfSpeech": "noun", "audio": "" },
    { "word": "bag", "vi": "cái cặp", "icon": "🎒", "example": "It's a bag.", "partOfSpeech": "noun", "audio": "" },
    { "word": "ruler", "vi": "cái thước", "icon": "📏", "example": "It's a ruler.", "partOfSpeech": "noun", "audio": "" },
    { "word": "rubber", "vi": "cục tẩy (gôm)", "icon": "🧽", "example": "It's a rubber.", "partOfSpeech": "noun", "audio": "" },
    { "word": "apple", "vi": "quả táo", "icon": "🍎", "example": "It's an apple.", "partOfSpeech": "noun", "audio": "" },
    { "word": "orange", "vi": "quả cam", "icon": "🍊", "example": "It's an orange.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "what-is-this",
      "title_vi": "Cái này là gì?",
      "explain_vi": "Muốn hỏi tên một đồ vật ở gần, em nói \"What's this?\". Bạn trả lời bắt đầu bằng \"It's...\" rồi nói tên đồ vật.",
      "examples": [
        "What's this? It's a pen.",
        "What's this? It's a book.",
        "What's this? It's an apple."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "it-is-noun", "text": "It's {art} {noun}.", "blanks": ["noun"], "context_vi": "Chỉ vào một đồ vật và nói tên nó.", "audioText": "It's a pen." },
          { "id": "what-is-this-answer", "text": "What's this? It's {art} {noun}.", "blanks": ["noun"], "context_vi": "Hỏi và trả lời tên một đồ vật ở gần.", "audioText": "What's this? It's a pen." }
        ],
        "slots": {
          "art": ["a", "an"],
          "noun": ["pen", "pencil", "book", "bag", "ruler", "rubber", "apple", "orange"]
        },
        "answerKey": {
          "it-is-noun": {
            "art": { "pen": "a", "pencil": "a", "book": "a", "bag": "a", "ruler": "a", "rubber": "a", "apple": "an", "orange": "an" }
          },
          "what-is-this-answer": {
            "art": { "pen": "a", "pencil": "a", "book": "a", "bag": "a", "ruler": "a", "rubber": "a", "apple": "an", "orange": "an" }
          }
        },
        "distractors": [
          "It's a apple.",
          "It's a orange.",
          "Is a pen.",
          "It's pen.",
          "What this? It's a pen.",
          "It a book."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "a-or-an",
      "title_vi": "Dùng \"a\" hay \"an\"?",
      "explain_vi": "Trước từ bắt đầu bằng nguyên âm (a, e, i, o, u) thì dùng \"an\". Các từ còn lại dùng \"a\".",
      "examples": [
        "It's a pencil.",
        "It's an apple.",
        "It's an orange."
      ],
      "generators": ["fill_blank", "mcq"],
      "safeZone": {
        "templates": [
          { "id": "choose-article", "text": "It's {art} {noun}.", "blanks": ["art"], "context_vi": "Chọn \"a\" hoặc \"an\" cho đúng với từ đứng sau.", "audioText": "It's an apple." }
        ],
        "slots": {
          "art": ["a", "an"],
          "noun": ["pen", "pencil", "book", "bag", "ruler", "rubber", "apple", "orange"]
        },
        "answerKey": {
          "choose-article": {
            "art": { "pen": "a", "pencil": "a", "book": "a", "bag": "a", "ruler": "a", "rubber": "a", "apple": "an", "orange": "an" }
          }
        },
        "distractors": [
          "It's an pen.",
          "It's an book.",
          "It's a apple.",
          "It's a orange."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["a", "b", "c", "d"],
    "soundLabels": {
      "a": { "ipa": "/æ/", "anchor": "apple", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"apple\" là /æ/ (không đọc tên chữ \"ây\")" },
      "b": { "ipa": "/b/", "anchor": "ball", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"ball\" là /b/ (không đọc tên chữ \"bi\")" },
      "c": { "ipa": "/k/", "anchor": "cat", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"cat\" là /k/ (không đọc tên chữ \"xi\")" },
      "d": { "ipa": "/d/", "anchor": "dog", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"dog\" là /d/ (không đọc tên chữ \"đi\")" }
    },
    "words": [
      { "word": "apple", "icon": "🍎", "focusSound": "a", "anchor": "apple", "audio": "" },
      { "word": "ant", "icon": "🐜", "focusSound": "a", "anchor": "apple", "audio": "" },
      { "word": "bag", "icon": "🎒", "focusSound": "b", "anchor": "ball", "audio": "" },
      { "word": "ball", "icon": "⚽", "focusSound": "b", "anchor": "ball", "audio": "" },
      { "word": "cat", "icon": "🐱", "focusSound": "c", "anchor": "cat", "audio": "" },
      { "word": "cup", "icon": "🥤", "focusSound": "c", "anchor": "cat", "audio": "" },
      { "word": "dog", "icon": "🐶", "focusSound": "d", "anchor": "dog", "audio": "" },
      { "word": "duck", "icon": "🦆", "focusSound": "d", "anchor": "dog", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "in-my-bag",
      "title": "In my bag",
      "title_vi": "Trong cặp của em",
      "text": "Look at my bag. It's a pen. It's a pencil. It's a book. It's an apple. I like my bag.",
      "questions": [
        { "id": "q1", "q_vi": "Trong cặp có một quyển sách, đúng không?", "type": "truefalse", "answer": true, "audioText": "There is a book in the bag." },
        { "id": "q2", "q_vi": "Có quả gì ở trong cặp?", "type": "mcq", "choices": ["an apple", "an orange", "a ruler"], "answer": 0, "audioText": "What is in the bag?" },
        { "id": "q3", "q_vi": "Đồ nào CÓ trong cặp?", "type": "mcq", "choices": ["a pencil", "a ruler", "an orange"], "answer": 0, "audioText": "What is in the bag?" }
      ]
    }
  ]
};
  C["level1/unit02.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 2,
  "topic": "My toys",
  "topic_vi": "Đồ chơi của em",
  "vocab": [
    { "word": "teddy", "vi": "gấu bông", "icon": "🧸", "example": "It's my teddy.", "partOfSpeech": "noun", "audio": "" },
    { "word": "ball", "vi": "quả bóng", "icon": "⚽", "example": "It's my ball.", "partOfSpeech": "noun", "audio": "" },
    { "word": "doll", "vi": "búp bê", "icon": "🪆", "example": "It's my doll.", "partOfSpeech": "noun", "audio": "" },
    { "word": "car", "vi": "ô tô đồ chơi", "icon": "🚗", "example": "It's my car.", "partOfSpeech": "noun", "audio": "" },
    { "word": "kite", "vi": "con diều", "icon": "🪁", "example": "It's my kite.", "partOfSpeech": "noun", "audio": "" },
    { "word": "robot", "vi": "rô bốt", "icon": "🤖", "example": "It's my robot.", "partOfSpeech": "noun", "audio": "" },
    { "word": "train", "vi": "tàu hỏa đồ chơi", "icon": "🚂", "example": "It's my train.", "partOfSpeech": "noun", "audio": "" },
    { "word": "plane", "vi": "máy bay đồ chơi", "icon": "✈️", "example": "It's my plane.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "my-your",
      "title_vi": "\"my\" và \"your\"",
      "explain_vi": "Đồ của em thì nói \"my\" (của em). Đồ của bạn (người em nói chuyện) thì nói \"your\" (của bạn). Đặt \"my\" hay \"your\" trước tên đồ vật.",
      "examples": [
        "It's my teddy.",
        "It's your ball.",
        "It's my car."
      ],
      "generators": ["mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "it-is-poss-noun-mine", "text": "It's {poss} {noun}.", "blanks": ["poss"], "context_vi": "Đồ này là CỦA EM (người nói).", "audioText": "It's my teddy." },
          { "id": "it-is-poss-noun-yours", "text": "It's {poss} {noun}.", "blanks": ["poss"], "context_vi": "Đồ này là CỦA BẠN (người nghe).", "audioText": "It's your ball." }
        ],
        "slots": {
          "poss": ["my", "your"],
          "noun": ["teddy", "ball", "doll", "car", "kite", "robot", "train", "plane"]
        },
        "answerKey": {
          "it-is-poss-noun-mine": { "poss": "my" },
          "it-is-poss-noun-yours": { "poss": "your" }
        },
        "distractors": [
          "It's me teddy.",
          "It's you ball.",
          "It's my the car.",
          "Is my teddy.",
          "It's mine teddy."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "is-this-your",
      "title_vi": "\"Is this your...?\" và cách trả lời",
      "explain_vi": "Hỏi xem một đồ vật có phải của bạn không: \"Is this your...?\". Nếu đúng, trả lời \"Yes, it is.\". Nếu không, trả lời \"No, it isn't.\".",
      "examples": [
        "Is this your teddy? Yes, it is.",
        "Is this your ball? No, it isn't.",
        "Is this your kite? Yes, it is."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "question-is-this-your", "text": "Is this {poss} {noun}?", "blanks": ["poss"], "context_vi": "Hỏi xem một đồ vật có phải của bạn (người nghe) không.", "audioText": "Is this your teddy?" },
          { "id": "answer-yes", "text": "Yes, it is.", "blanks": [], "context_vi": "Trả lời khi ĐÚNG là của bạn.", "audioText": "Yes, it is." },
          { "id": "answer-no", "text": "No, it isn't.", "blanks": [], "context_vi": "Trả lời khi KHÔNG phải của bạn.", "audioText": "No, it isn't." }
        ],
        "slots": {
          "poss": ["your", "my"],
          "noun": ["teddy", "ball", "doll", "car", "kite", "robot", "train", "plane"],
          "answer": ["Yes, it is.", "No, it isn't."]
        },
        "answerKey": {
          "question-is-this-your": { "poss": "your" },
          "answer-pairs": { "Yes, it is.": "No, it isn't.", "No, it isn't.": "Yes, it is." }
        },
        "distractors": [
          "Yes, it isn't.",
          "No, it is.",
          "Yes, it is not.",
          "No, it not.",
          "Is this you teddy?",
          "Is this your teddy."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["e", "f", "g", "h"],
    "soundLabels": {
      "e": { "ipa": "/e/", "anchor": "egg", "position": "initial", "say_vi": "âm /e/ như đầu từ \"egg\" (không đọc tên chữ \"i\")" },
      "f": { "ipa": "/f/", "anchor": "fish", "position": "initial", "say_vi": "âm /f/ như đầu từ \"fish\" (không đọc tên chữ \"ép\")" },
      "g": { "ipa": "/g/", "anchor": "goat", "position": "initial", "say_vi": "âm /g/ cứng như đầu từ \"goat\" (không đọc tên chữ \"giê\")" },
      "h": { "ipa": "/h/", "anchor": "hat", "position": "initial", "say_vi": "âm /h/ như đầu từ \"hat\" (không đọc tên chữ \"hát\")" }
    },
    "words": [
      { "word": "egg", "icon": "🥚", "focusSound": "e", "anchor": "egg", "audio": "" },
      { "word": "elephant", "icon": "🐘", "focusSound": "e", "anchor": "egg", "audio": "" },
      { "word": "fish", "icon": "🐟", "focusSound": "f", "anchor": "fish", "audio": "" },
      { "word": "fox", "icon": "🦊", "focusSound": "f", "anchor": "fish", "audio": "" },
      { "word": "goat", "icon": "🐐", "focusSound": "g", "anchor": "goat", "audio": "" },
      { "word": "girl", "icon": "👧", "focusSound": "g", "anchor": "goat", "audio": "" },
      { "word": "hat", "icon": "👒", "focusSound": "h", "anchor": "hat", "audio": "" },
      { "word": "hen", "icon": "🐔", "focusSound": "h", "anchor": "hat", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "my-toy-box",
      "title": "My toy box",
      "title_vi": "Hộp đồ chơi của em",
      "text": "This is my toy box. It's my teddy. It's my car. It's my kite. The doll is not my doll. It's your doll. I like my toys.",
      "questions": [
        { "id": "q1", "q_vi": "Con gấu bông là của em (người kể), đúng không?", "type": "truefalse", "answer": true, "audioText": "The teddy is my teddy." },
        { "id": "q2", "q_vi": "Búp bê là của ai?", "type": "mcq", "choices": ["your doll", "my doll", "my car"], "answer": 0, "audioText": "Whose doll is it?" },
        { "id": "q3", "q_vi": "Đồ chơi nào CÓ trong hộp?", "type": "mcq", "choices": ["a kite", "a robot", "a train"], "answer": 0, "audioText": "What is in the toy box?" }
      ]
    }
  ]
};
  C["level1/unit03.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 3,
  "topic": "My body",
  "topic_vi": "Cơ thể của em",
  "vocab": [
    { "word": "arm", "vi": "cánh tay", "icon": "💪", "example": "This is my arm.", "partOfSpeech": "noun", "audio": "" },
    { "word": "leg", "vi": "chân (cẳng chân)", "icon": "🦵", "example": "This is my leg.", "partOfSpeech": "noun", "audio": "" },
    { "word": "hand", "vi": "bàn tay", "icon": "✋", "example": "This is my hand.", "partOfSpeech": "noun", "audio": "" },
    { "word": "foot", "vi": "bàn chân", "icon": "🦶", "example": "This is my foot.", "partOfSpeech": "noun", "audio": "" },
    { "word": "eye", "vi": "mắt", "icon": "👁️", "example": "This is my eye.", "partOfSpeech": "noun", "audio": "" },
    { "word": "ear", "vi": "tai", "icon": "👂", "example": "This is my ear.", "partOfSpeech": "noun", "audio": "" },
    { "word": "nose", "vi": "mũi", "icon": "👃", "example": "This is my nose.", "partOfSpeech": "noun", "audio": "" },
    { "word": "head", "vi": "đầu", "icon": "🧑", "example": "This is my head.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "this-is-these-are",
      "title_vi": "\"This is my...\" và \"These are my...\"",
      "explain_vi": "Khi chỉ MỘT bộ phận, em nói \"This is my ...\". Khi chỉ HAI (hay nhiều), em nói \"These are my ...\" và thêm \"-s\" vào sau từ.",
      "examples": [
        "This is my nose.",
        "This is my head.",
        "These are my arms.",
        "These are my legs."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "this-is-singular", "text": "This is my {noun}.", "blanks": ["noun"], "context_vi": "Chỉ vào MỘT bộ phận trên cơ thể.", "audioText": "This is my nose." },
          { "id": "these-are-plural", "text": "These are my {noun_pl}.", "blanks": ["noun_pl"], "context_vi": "Chỉ vào HAI (hoặc nhiều) bộ phận giống nhau.", "audioText": "These are my arms." },
          { "id": "choose-this-these", "text": "{dem} my {noun_any}.", "blanks": ["dem"], "context_vi": "Chọn \"This is\" hoặc \"These are\" cho đúng với số ít/số nhiều.", "audioText": "These are my eyes." }
        ],
        "slots": {
          "noun": ["nose", "head", "arm", "leg", "hand", "foot", "eye", "ear"],
          "noun_pl": ["arms", "legs", "hands", "eyes", "ears"],
          "noun_any": ["nose", "head", "arms", "legs", "hands", "eyes", "ears", "feet"],
          "dem": ["This is", "These are"]
        },
        "answerKey": {
          "choose-this-these": {
            "dem": {
              "nose": "This is",
              "head": "This is",
              "arms": "These are",
              "legs": "These are",
              "hands": "These are",
              "eyes": "These are",
              "ears": "These are",
              "feet": "These are"
            }
          }
        },
        "distractors": [
          "This is my arms.",
          "These are my arm.",
          "This are my nose.",
          "These is my legs.",
          "This is my foots.",
          "These are my foots."
        ],
        "irregulars": { "foot": "feet" }
      }
    },
    {
      "id": "plural-s",
      "title_vi": "Số nhiều thêm \"-s\"",
      "explain_vi": "Khi có HAI hay nhiều thứ, em thêm \"-s\" vào sau từ: arm → arms, leg → legs. Riêng \"foot\" đổi đặc biệt thành \"feet\".",
      "examples": [
        "one arm, two arms",
        "one leg, two legs",
        "one foot, two feet"
      ],
      "generators": ["fill_blank", "mcq", "order_words"],
      "safeZone": {
        "templates": [
          { "id": "two-plural", "text": "two {noun_pl}", "blanks": ["noun_pl"], "context_vi": "Nói \"hai\" cái gì đó (số nhiều).", "audioText": "two arms" },
          { "id": "one-singular", "text": "one {noun}", "blanks": ["noun"], "context_vi": "Nói \"một\" cái gì đó (số ít).", "audioText": "one arm" }
        ],
        "slots": {
          "noun": ["arm", "leg", "hand", "eye", "ear", "foot"],
          "noun_pl": ["arms", "legs", "hands", "eyes", "ears", "feet"]
        },
        "answerKey": {},
        "distractors": [
          "two arm",
          "two legs.",
          "two foots",
          "two foot",
          "two eys",
          "one arms"
        ],
        "irregulars": { "foot": "feet" }
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["i", "j", "k", "l"],
    "soundLabels": {
      "i": { "ipa": "/ɪ/", "anchor": "ink", "position": "initial", "say_vi": "âm /ɪ/ như đầu từ \"ink\" (không đọc tên chữ \"ai\")" },
      "j": { "ipa": "/dʒ/", "anchor": "jam", "position": "initial", "say_vi": "âm /dʒ/ như đầu từ \"jam\" (không đọc tên chữ \"giây\")" },
      "k": { "ipa": "/k/", "anchor": "kite", "position": "initial", "say_vi": "âm /k/ như đầu từ \"kite\" (không đọc tên chữ \"cây\")" },
      "l": { "ipa": "/l/", "anchor": "lion", "position": "initial", "say_vi": "âm /l/ như đầu từ \"lion\" (không đọc tên chữ \"eo\")" }
    },
    "words": [
      { "word": "ink", "icon": "🖋️", "focusSound": "i", "anchor": "ink", "audio": "" },
      { "word": "igloo", "icon": "🛖", "focusSound": "i", "anchor": "ink", "audio": "" },
      { "word": "jam", "icon": "🍓", "focusSound": "j", "anchor": "jam", "audio": "" },
      { "word": "jug", "icon": "🫙", "focusSound": "j", "anchor": "jam", "audio": "" },
      { "word": "kite", "icon": "🪁", "focusSound": "k", "anchor": "kite", "audio": "" },
      { "word": "key", "icon": "🔑", "focusSound": "k", "anchor": "kite", "audio": "" },
      { "word": "lion", "icon": "🦁", "focusSound": "l", "anchor": "lion", "audio": "" },
      { "word": "leg", "icon": "🦵", "focusSound": "l", "anchor": "lion", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "look-at-me",
      "title": "Look at me",
      "title_vi": "Nhìn em này",
      "text": "Look at me! This is my head. This is my nose. These are my eyes. These are my ears. These are my two hands. I like my hands!",
      "questions": [
        { "id": "q1", "q_vi": "Bạn nhỏ có hai bàn tay, đúng không?", "type": "truefalse", "answer": true, "audioText": "She has two hands." },
        { "id": "q2", "q_vi": "Câu nào nói về MỘT bộ phận (số ít)?", "type": "mcq", "choices": ["This is my nose.", "These are my eyes.", "These are my ears."], "answer": 0, "audioText": "Which one is about only one part?" },
        { "id": "q3", "q_vi": "Bộ phận nào ĐƯỢC nhắc tới trong bài?", "type": "mcq", "choices": ["my ears", "my arms", "my legs"], "answer": 0, "audioText": "Which part is in the text?" }
      ]
    }
  ]
};
  C["level1/unit04.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 4,
  "topic": "Jobs",
  "topic_vi": "Nghề nghiệp",
  "vocab": [
    { "word": "teacher", "vi": "giáo viên", "icon": "🧑‍🏫", "example": "She's a teacher.", "partOfSpeech": "noun", "audio": "" },
    { "word": "doctor", "vi": "bác sĩ", "icon": "🧑‍⚕️", "example": "He's a doctor.", "partOfSpeech": "noun", "audio": "" },
    { "word": "nurse", "vi": "y tá", "icon": "💉", "example": "She's a nurse.", "partOfSpeech": "noun", "audio": "" },
    { "word": "pilot", "vi": "phi công", "icon": "🧑‍✈️", "example": "He's a pilot.", "partOfSpeech": "noun", "audio": "" },
    { "word": "farmer", "vi": "nông dân", "icon": "🧑‍🌾", "example": "He's a farmer.", "partOfSpeech": "noun", "audio": "" },
    { "word": "cook", "vi": "đầu bếp", "icon": "🧑‍🍳", "example": "She's a cook.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "he-she-is-a-job",
      "title_vi": "\"He's a...\" / \"She's a...\" (Anh ấy / Chị ấy là...)",
      "explain_vi": "Khi nói về một bạn nam, em dùng \"He's a...\" (Anh ấy là...). Khi nói về một bạn nữ, em dùng \"She's a...\" (Chị ấy là...). Rồi nói tên nghề.",
      "examples": [
        "He's a doctor.",
        "She's a teacher.",
        "He's a pilot."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "he-is-a-job", "text": "{subj}'s {art} {noun}.", "blanks": ["subj"], "context_vi": "Nói về một bạn NAM (he) làm nghề gì.", "audioText": "He's a doctor." },
          { "id": "she-is-a-job", "text": "{subj}'s {art} {noun}.", "blanks": ["subj"], "context_vi": "Nói về một bạn NỮ (she) làm nghề gì.", "audioText": "She's a teacher." }
        ],
        "slots": {
          "subj": ["He", "She"],
          "art": ["a"],
          "noun": ["teacher", "doctor", "nurse", "pilot", "farmer", "cook"]
        },
        "answerKey": {
          "he-is-a-job": { "subj": "He" },
          "she-is-a-job": { "subj": "She" }
        },
        "distractors": [
          "He's teacher.",
          "She a teacher.",
          "He's an doctor.",
          "He is a teacher .",
          "She's the teacher.",
          "He teacher."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "is-he-she-a-job",
      "title_vi": "\"Is he/she a...?\" và cách trả lời",
      "explain_vi": "Hỏi xem một người làm nghề gì đó không: \"Is he a...?\" (cho nam) hoặc \"Is she a...?\" (cho nữ). Nếu đúng, trả lời \"Yes, he is.\" / \"Yes, she is.\". Nếu sai, trả lời \"No, he isn't.\" / \"No, she isn't.\".",
      "examples": [
        "Is he a doctor? Yes, he is.",
        "Is she a teacher? Yes, she is.",
        "Is he a pilot? No, he isn't."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "question-is-he-a-job", "text": "Is {subj} {art} {noun}?", "blanks": ["subj"], "context_vi": "Hỏi xem một bạn NAM (he) có làm nghề đó không.", "audioText": "Is he a doctor?" },
          { "id": "question-is-she-a-job", "text": "Is {subj} {art} {noun}?", "blanks": ["subj"], "context_vi": "Hỏi xem một bạn NỮ (she) có làm nghề đó không.", "audioText": "Is she a teacher?" },
          { "id": "answer-yes-he", "text": "Yes, he is.", "blanks": [], "context_vi": "Trả lời khi ĐÚNG, người đó là bạn nam.", "audioText": "Yes, he is." },
          { "id": "answer-no-he", "text": "No, he isn't.", "blanks": [], "context_vi": "Trả lời khi SAI, người đó là bạn nam.", "audioText": "No, he isn't." },
          { "id": "answer-yes-she", "text": "Yes, she is.", "blanks": [], "context_vi": "Trả lời khi ĐÚNG, người đó là bạn nữ.", "audioText": "Yes, she is." },
          { "id": "answer-no-she", "text": "No, she isn't.", "blanks": [], "context_vi": "Trả lời khi SAI, người đó là bạn nữ.", "audioText": "No, she isn't." }
        ],
        "slots": {
          "subj": ["he", "she"],
          "art": ["a"],
          "noun": ["teacher", "doctor", "nurse", "pilot", "farmer", "cook"],
          "answer": ["Yes, he is.", "No, he isn't.", "Yes, she is.", "No, she isn't."]
        },
        "answerKey": {
          "question-is-he-a-job": { "subj": "he" },
          "question-is-she-a-job": { "subj": "she" },
          "answer-pairs-he": { "Yes, he is.": "No, he isn't.", "No, he isn't.": "Yes, he is." },
          "answer-pairs-she": { "Yes, she is.": "No, she isn't.", "No, she isn't.": "Yes, she is." }
        },
        "distractors": [
          "Yes, he isn't.",
          "No, he is.",
          "Yes, he is not.",
          "No, she not.",
          "Is he doctor?",
          "Is he a doctor."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["m", "n", "o", "p"],
    "soundLabels": {
      "m": { "ipa": "/m/", "anchor": "mum", "position": "initial", "say_vi": "âm /m/ như đầu từ \"mum\" (không đọc tên chữ \"em-mờ\")" },
      "n": { "ipa": "/n/", "anchor": "nurse", "position": "initial", "say_vi": "âm /n/ như đầu từ \"nurse\" (không đọc tên chữ \"en-nờ\")" },
      "o": { "ipa": "/ɒ/", "anchor": "orange", "position": "initial", "say_vi": "âm /ɒ/ như đầu từ \"orange\" (không đọc tên chữ \"âu\")" },
      "p": { "ipa": "/p/", "anchor": "pen", "position": "initial", "say_vi": "âm /p/ như đầu từ \"pen\" (không đọc tên chữ \"pi\")" }
    },
    "words": [
      { "word": "mum", "icon": "👩", "focusSound": "m", "anchor": "mum", "audio": "" },
      { "word": "map", "icon": "🗺️", "focusSound": "m", "anchor": "mum", "audio": "" },
      { "word": "nurse", "icon": "💉", "focusSound": "n", "anchor": "nurse", "audio": "" },
      { "word": "net", "icon": "🥅", "focusSound": "n", "anchor": "nurse", "audio": "" },
      { "word": "orange", "icon": "🍊", "focusSound": "o", "anchor": "orange", "audio": "" },
      { "word": "ox", "icon": "🐂", "focusSound": "o", "anchor": "orange", "audio": "" },
      { "word": "pen", "icon": "🖊️", "focusSound": "p", "anchor": "pen", "audio": "" },
      { "word": "pig", "icon": "🐷", "focusSound": "p", "anchor": "pen", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "my-family-jobs",
      "title": "My family",
      "title_vi": "Gia đình của em",
      "text": "Look at my family. This is my mum. She's a nurse. This is my dad. He's a farmer. This is my sister. She's a teacher. I like my family.",
      "questions": [
        { "id": "q1", "q_vi": "Mẹ của bạn nhỏ là y tá, đúng không?", "type": "truefalse", "answer": true, "audioText": "His mum is a nurse." },
        { "id": "q2", "q_vi": "Bố làm nghề gì?", "type": "mcq", "choices": ["a farmer", "a doctor", "a pilot"], "answer": 0, "audioText": "What is his dad?" },
        { "id": "q3", "q_vi": "Ai là giáo viên?", "type": "mcq", "choices": ["my sister", "my mum", "my dad"], "answer": 0, "audioText": "Who is a teacher?" }
      ]
    }
  ]
};
  C["level1/unit05.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 5,
  "topic": "The park",
  "topic_vi": "Công viên",
  "vocab": [
    { "word": "ball", "vi": "quả bóng", "icon": "⚽", "example": "It's a ball.", "partOfSpeech": "noun", "audio": "" },
    { "word": "kite", "vi": "con diều", "icon": "🪁", "example": "It's a kite.", "partOfSpeech": "noun", "audio": "" },
    { "word": "bike", "vi": "xe đạp", "icon": "🚲", "example": "It's a bike.", "partOfSpeech": "noun", "audio": "" },
    { "word": "slide", "vi": "cầu trượt", "icon": "🛝", "example": "It's a slide.", "partOfSpeech": "noun", "audio": "" },
    { "word": "swing", "vi": "cái xích đu", "icon": "icon:swing", "example": "It's a swing.", "partOfSpeech": "noun", "audio": "" },
    { "word": "tree", "vi": "cái cây", "icon": "🌳", "example": "It's a tree.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "where-is-the",
      "title_vi": "\"Where's the...?\" (... ở đâu?)",
      "explain_vi": "Khi muốn hỏi một đồ vật ở đâu, em nói \"Where's the...?\" rồi nói tên đồ vật. Bạn trả lời bắt đầu bằng \"It's...\" rồi nói chỗ của nó (in, on, under).",
      "examples": [
        "Where's the ball? It's under the tree.",
        "Where's the kite? It's in the tree.",
        "Where's the bike? It's on the slide."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "question-where-is", "text": "Where's the {noun}?", "blanks": ["noun"], "context_vi": "Hỏi một đồ vật ở công viên đang ở đâu.", "audioText": "Where's the ball?" }
        ],
        "slots": {
          "noun": ["ball", "kite", "bike", "slide", "swing", "tree"]
        },
        "answerKey": {},
        "distractors": [
          "Where the ball?",
          "Where's ball?",
          "Where's a ball?",
          "Where the ball is?",
          "Where's the ball.",
          "Where is the ball ?"
        ],
        "irregulars": {}
      }
    },
    {
      "id": "it-is-prep-the",
      "title_vi": "\"It's in / on / under the...\" (Nó ở trong / trên / dưới...)",
      "explain_vi": "Để nói chỗ của đồ vật, em dùng: \"in\" là Ở TRONG, \"on\" là Ở TRÊN, \"under\" là Ở DƯỚI. Nói \"It's\" + giới từ + \"the\" + tên đồ vật.",
      "examples": [
        "It's in the bag.",
        "It's on the slide.",
        "It's under the tree."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "it-is-in-the", "text": "It's {prep} the {noun}.", "blanks": ["prep"], "context_vi": "Đồ vật ở BÊN TRONG (in). Hình cho thấy nó nằm trong.", "audioText": "It's in the bag." },
          { "id": "it-is-on-the", "text": "It's {prep} the {noun}.", "blanks": ["prep"], "context_vi": "Đồ vật ở BÊN TRÊN (on). Hình cho thấy nó nằm trên mặt.", "audioText": "It's on the slide." },
          { "id": "it-is-under-the", "text": "It's {prep} the {noun}.", "blanks": ["prep"], "context_vi": "Đồ vật ở BÊN DƯỚI (under). Hình cho thấy nó nằm dưới.", "audioText": "It's under the tree." }
        ],
        "slots": {
          "prep": ["in", "on", "under"],
          "noun": ["tree", "slide", "swing", "bag", "bike"]
        },
        "answerKey": {
          "it-is-in-the": { "prep": "in" },
          "it-is-on-the": { "prep": "on" },
          "it-is-under-the": { "prep": "under" }
        },
        "distractors": [
          "It's in tree.",
          "It's on a slide.",
          "It's under tree.",
          "It in the tree.",
          "It's at the tree.",
          "It's the under tree."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["q", "r", "s", "t", "u"],
    "soundLabels": {
      "q": { "ipa": "/kw/", "anchor": "queen", "position": "initial", "say_vi": "âm /kw/ như đầu từ \"queen\" (không đọc tên chữ \"kiu\")" },
      "r": { "ipa": "/r/", "anchor": "rabbit", "position": "initial", "say_vi": "âm /r/ như đầu từ \"rabbit\" (không đọc tên chữ \"a-rờ\")" },
      "s": { "ipa": "/s/", "anchor": "sofa", "position": "initial", "say_vi": "âm /s/ như đầu từ \"sofa\" (không đọc tên chữ \"ét-sờ\")" },
      "t": { "ipa": "/t/", "anchor": "teddy", "position": "initial", "say_vi": "âm /t/ như đầu từ \"teddy\" (không đọc tên chữ \"ti\")" },
      "u": { "ipa": "/ʌ/", "anchor": "umbrella", "position": "initial", "say_vi": "âm /ʌ/ như đầu từ \"umbrella\" (không đọc tên chữ \"diu\")" }
    },
    "words": [
      { "word": "queen", "icon": "👸", "focusSound": "q", "anchor": "queen", "audio": "" },
      { "word": "quilt", "icon": "🛏️", "focusSound": "q", "anchor": "queen", "audio": "" },
      { "word": "rabbit", "icon": "🐰", "focusSound": "r", "anchor": "rabbit", "audio": "" },
      { "word": "red", "icon": "🔴", "focusSound": "r", "anchor": "rabbit", "audio": "" },
      { "word": "sofa", "icon": "🛋️", "focusSound": "s", "anchor": "sofa", "audio": "" },
      { "word": "sun", "icon": "☀️", "focusSound": "s", "anchor": "sofa", "audio": "" },
      { "word": "teddy", "icon": "🧸", "focusSound": "t", "anchor": "teddy", "audio": "" },
      { "word": "tree", "icon": "🌳", "focusSound": "t", "anchor": "teddy", "audio": "" },
      { "word": "umbrella", "icon": "☔", "focusSound": "u", "anchor": "umbrella", "audio": "" },
      { "word": "up", "icon": "⬆️", "focusSound": "u", "anchor": "umbrella", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "at-the-park",
      "title": "At the park",
      "title_vi": "Ở công viên",
      "text": "I'm at the park. Look! The kite is in the tree. My ball is under the slide. The cat is on the swing. I like the park.",
      "questions": [
        { "id": "q1", "q_vi": "Con diều ở trên cây, đúng không?", "type": "truefalse", "answer": true, "audioText": "The kite is in the tree." },
        { "id": "q2", "q_vi": "Quả bóng ở đâu?", "type": "mcq", "choices": ["under the slide", "on the slide", "in the tree"], "answer": 0, "audioText": "Where's the ball?" },
        { "id": "q3", "q_vi": "Cái gì ở trên xích đu?", "type": "mcq", "choices": ["the cat", "the ball", "the kite"], "answer": 0, "audioText": "What is on the swing?" }
      ]
    }
  ]
};
  C["level1/unit06.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 6,
  "topic": "My family",
  "topic_vi": "Gia đình của em",
  "vocab": [
    { "word": "mum", "vi": "mẹ", "icon": "👩", "example": "This is my mum.", "partOfSpeech": "noun", "audio": "" },
    { "word": "dad", "vi": "bố", "icon": "👨", "example": "This is my dad.", "partOfSpeech": "noun", "audio": "" },
    { "word": "brother", "vi": "anh trai / em trai", "icon": "👦", "example": "This is my brother.", "partOfSpeech": "noun", "audio": "" },
    { "word": "sister", "vi": "chị gái / em gái", "icon": "👧", "example": "This is my sister.", "partOfSpeech": "noun", "audio": "" },
    { "word": "grandma", "vi": "bà", "icon": "👵", "example": "This is my grandma.", "partOfSpeech": "noun", "audio": "" },
    { "word": "grandpa", "vi": "ông", "icon": "👴", "example": "This is my grandpa.", "partOfSpeech": "noun", "audio": "" },
    { "word": "baby", "vi": "em bé", "icon": "👶", "example": "This is my baby brother.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "this-is-my-family",
      "title_vi": "Giới thiệu người trong nhà: \"This is my...\"",
      "explain_vi": "Khi giới thiệu một người trong gia đình, em nói \"This is my...\" rồi nói người đó là ai (mum, dad, brother...). \"my\" nghĩa là \"của em\".",
      "examples": [
        "This is my mum.",
        "This is my dad.",
        "This is my grandma."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "this-is-my-person", "text": "This is my {person}.", "blanks": ["person"], "context_vi": "Chỉ vào một người trong nhà và giới thiệu họ là ai.", "audioText": "This is my mum." }
        ],
        "slots": {
          "person": ["mum", "dad", "brother", "sister", "grandma", "grandpa", "baby"]
        },
        "answerKey": {},
        "distractors": [
          "This is me mum.",
          "This my mum.",
          "This is a my mum.",
          "This is mum.",
          "These is my mum."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "possessive-s",
      "title_vi": "Sở hữu với 's (của ai đó)",
      "explain_vi": "Muốn nói một đồ vật là của một người, em thêm 's vào sau tên người rồi mới nói đồ vật. Ví dụ: \"Tom's bag\" nghĩa là \"cái cặp của Tom\".",
      "examples": [
        "This is Tom's bag.",
        "This is Mum's pen.",
        "This is Dad's car."
      ],
      "generators": ["fill_blank", "mcq", "order_words"],
      "safeZone": {
        "templates": [
          { "id": "this-is-owner-thing", "text": "This is {owner}'s {thing}.", "blanks": ["owner"], "context_vi": "Nói một đồ vật là của ai (thêm 's sau tên người).", "audioText": "This is Tom's bag." }
        ],
        "slots": {
          "owner": ["Tom", "Mum", "Dad", "Lan", "Nam"],
          "thing": ["bag", "pen", "book", "car", "ball"]
        },
        "answerKey": {},
        "distractors": [
          "This is Tom bag.",
          "This is bag of Tom.",
          "This is Toms bag.",
          "This is Tom's the bag.",
          "This is the Tom's bag."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["v", "w", "x", "y", "z"],
    "soundLabels": {
      "v": { "ipa": "/v/", "anchor": "van", "position": "initial", "say_vi": "âm /v/ như đầu từ \"van\" (môi trên chạm răng dưới, không đọc tên chữ \"vê\")" },
      "w": { "ipa": "/w/", "anchor": "window", "position": "initial", "say_vi": "âm /w/ như đầu từ \"window\" (chu môi tròn, không đọc tên chữ \"đắp-bồ-diu\")" },
      "x": { "ipa": "/ks/", "anchor": "box", "position": "final", "say_vi": "âm /ks/ thường ở CUỐI từ như từ \"box\" (không đọc tên chữ \"ích\")" },
      "y": { "ipa": "/j/", "anchor": "yo-yo", "position": "initial", "say_vi": "âm /j/ như đầu từ \"yo-yo\" (không đọc tên chữ \"oai\")" },
      "z": { "ipa": "/z/", "anchor": "zebra", "position": "initial", "say_vi": "âm /z/ như đầu từ \"zebra\" (kêu ù ù, không đọc tên chữ \"dét\")" }
    },
    "words": [
      { "word": "van", "icon": "🚐", "focusSound": "v", "anchor": "van", "audio": "" },
      { "word": "vet", "icon": "🩺", "focusSound": "v", "anchor": "van", "audio": "" },
      { "word": "window", "icon": "🪟", "focusSound": "w", "anchor": "window", "audio": "" },
      { "word": "web", "icon": "🕸️", "focusSound": "w", "anchor": "window", "audio": "" },
      { "word": "box", "icon": "📦", "focusSound": "x", "anchor": "box", "audio": "" },
      { "word": "six", "icon": "6️⃣", "focusSound": "x", "anchor": "box", "audio": "" },
      { "word": "yo-yo", "icon": "🪀", "focusSound": "y", "anchor": "yo-yo", "audio": "" },
      { "word": "yes", "icon": "✅", "focusSound": "y", "anchor": "yo-yo", "audio": "" },
      { "word": "zebra", "icon": "🦓", "focusSound": "z", "anchor": "zebra", "audio": "" },
      { "word": "zip", "icon": "🤐", "focusSound": "z", "anchor": "zebra", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "my-family",
      "title": "My family",
      "title_vi": "Gia đình của em",
      "text": "This is my family. This is my mum. This is my dad. This is my brother. This is my baby sister. I like my family.",
      "questions": [
        { "id": "q1", "q_vi": "Bạn nhỏ kể về gia đình của mình, đúng không?", "type": "truefalse", "answer": true, "audioText": "This is my family." },
        { "id": "q2", "q_vi": "Trong bài có nhắc đến ai?", "type": "mcq", "choices": ["my mum", "my grandma", "my grandpa"], "answer": 0, "audioText": "Who is in the family?" },
        { "id": "q3", "q_vi": "Em bé trong nhà là ai?", "type": "mcq", "choices": ["my baby sister", "my baby brother", "my dad"], "answer": 0, "audioText": "Who is the baby?" }
      ]
    }
  ]
};
  C["level1/unit07.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 7,
  "topic": "My clothes",
  "topic_vi": "Quần áo của em",
  "vocab": [
    { "word": "T-shirt", "vi": "áo phông", "icon": "👕", "example": "It's a T-shirt.", "partOfSpeech": "noun", "audio": "" },
    { "word": "trousers", "vi": "quần dài", "icon": "👖", "example": "These are trousers.", "partOfSpeech": "noun", "audio": "" },
    { "word": "dress", "vi": "váy liền", "icon": "👗", "example": "It's a dress.", "partOfSpeech": "noun", "audio": "" },
    { "word": "shoes", "vi": "đôi giày", "icon": "👟", "example": "These are shoes.", "partOfSpeech": "noun", "audio": "" },
    { "word": "socks", "vi": "đôi tất (vớ)", "icon": "🧦", "example": "These are socks.", "partOfSpeech": "noun", "audio": "" },
    { "word": "hat", "vi": "cái mũ", "icon": "👒", "example": "It's a hat.", "partOfSpeech": "noun", "audio": "" },
    { "word": "skirt", "vi": "chân váy", "icon": "👚", "example": "It's a skirt.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "his-her",
      "title_vi": "\"his\" và \"her\" (của bạn ấy)",
      "explain_vi": "Đồ của một bạn trai thì nói \"his\" (của cậu ấy). Đồ của một bạn gái thì nói \"her\" (của cô ấy). Đặt \"his\" hay \"her\" trước tên đồ vật.",
      "examples": [
        "It's his hat.",
        "It's her dress.",
        "These are his shoes."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "boy-owns-singular", "text": "It's {poss} {thing}.", "blanks": ["poss"], "context_vi": "Đồ này (1 cái) là của MỘT BẠN TRAI.", "audioText": "It's his hat." },
          { "id": "girl-owns-singular", "text": "It's {poss} {thing}.", "blanks": ["poss"], "context_vi": "Đồ này (1 cái) là của MỘT BẠN GÁI.", "audioText": "It's her dress." }
        ],
        "slots": {
          "poss": ["his", "her"],
          "thing": ["T-shirt", "dress", "hat", "skirt"]
        },
        "answerKey": {
          "boy-owns-singular": { "poss": "his" },
          "girl-owns-singular": { "poss": "her" }
        },
        "distractors": [
          "It's he hat.",
          "It's she dress.",
          "It's him hat.",
          "It's hers dress.",
          "It's his the hat."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "are-these",
      "title_vi": "\"Are these...?\" và cách trả lời",
      "explain_vi": "Với đồ vật có hai chiếc đi cùng nhau (shoes, socks, trousers) ta dùng \"these\". Hỏi: \"Are these...?\". Nếu đúng, trả lời \"Yes, they are.\". Nếu không, trả lời \"No, they aren't.\".",
      "examples": [
        "Are these shoes? Yes, they are.",
        "Are these socks? No, they aren't.",
        "Are these trousers? Yes, they are."
      ],
      "generators": ["mcq", "order_words", "listen_choose", "transform"],
      "safeZone": {
        "templates": [
          { "id": "question-are-these", "text": "Are these {plural}?", "blanks": [], "context_vi": "Hỏi xem hai chiếc đồ này là gì (đồ luôn đi thành đôi/cặp).", "audioText": "Are these shoes?" },
          { "id": "answer-yes", "text": "Yes, they are.", "blanks": [], "context_vi": "Trả lời khi ĐÚNG.", "audioText": "Yes, they are." },
          { "id": "answer-no", "text": "No, they aren't.", "blanks": [], "context_vi": "Trả lời khi KHÔNG đúng.", "audioText": "No, they aren't." }
        ],
        "slots": {
          "plural": ["shoes", "socks", "trousers"],
          "answer": ["Yes, they are.", "No, they aren't."]
        },
        "answerKey": {
          "answer-pairs": { "Yes, they are.": "No, they aren't.", "No, they aren't.": "Yes, they are." }
        },
        "distractors": [
          "Yes, they aren't.",
          "No, they are.",
          "Yes, they is.",
          "No, they not.",
          "Are this shoes?",
          "Is these shoes?"
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["sh"],
    "soundLabels": {
      "sh": { "ipa": "/ʃ/", "anchor": "shoe", "position": "initial", "say_vi": "âm /ʃ/ như đầu từ \"shoe\" (giống ra hiệu im lặng \"suỵt\", không phải âm \"s\")" }
    },
    "words": [
      { "word": "shoe", "icon": "👞", "focusSound": "sh", "anchor": "shoe", "audio": "" },
      { "word": "ship", "icon": "🚢", "focusSound": "sh", "anchor": "shoe", "audio": "" },
      { "word": "sheep", "icon": "🐑", "focusSound": "sh", "anchor": "shoe", "audio": "" },
      { "word": "shop", "icon": "🏪", "focusSound": "sh", "anchor": "shoe", "audio": "" },
      { "word": "shell", "icon": "🐚", "focusSound": "sh", "anchor": "shoe", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "my-clothes",
      "title": "My clothes",
      "title_vi": "Quần áo của em",
      "text": "Look at me. This is my hat. It's a red hat. These are my shoes. They are new shoes. This is her dress. It's a pink dress. I like my clothes.",
      "questions": [
        { "id": "q1", "q_vi": "Cái mũ của bạn nhỏ màu đỏ, đúng không?", "type": "truefalse", "answer": true, "audioText": "The hat is red." },
        { "id": "q2", "q_vi": "Đôi giày thì như thế nào?", "type": "mcq", "choices": ["new", "old", "blue"], "answer": 0, "audioText": "What about the shoes?" },
        { "id": "q3", "q_vi": "Chiếc váy liền là của ai?", "type": "mcq", "choices": ["her dress", "his dress", "my dress"], "answer": 0, "audioText": "Whose dress is it?" }
      ]
    }
  ]
};
  C["level1/unit08.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 8,
  "topic": "My home",
  "topic_vi": "Ngôi nhà của em",
  "vocab": [
    { "word": "bedroom", "vi": "phòng ngủ", "icon": "🛏️", "example": "She's in the bedroom.", "partOfSpeech": "noun", "audio": "" },
    { "word": "kitchen", "vi": "nhà bếp", "icon": "🍳", "example": "Mum is in the kitchen.", "partOfSpeech": "noun", "audio": "" },
    { "word": "bathroom", "vi": "phòng tắm", "icon": "🛁", "example": "He's in the bathroom.", "partOfSpeech": "noun", "audio": "" },
    { "word": "living room", "vi": "phòng khách", "icon": "🛋️", "example": "We are in the living room.", "partOfSpeech": "noun", "audio": "" },
    { "word": "garden", "vi": "khu vườn", "icon": "🌳", "example": "Dad is in the garden.", "partOfSpeech": "noun", "audio": "" },
    { "word": "hall", "vi": "sảnh (lối vào nhà)", "icon": "🚪", "example": "The bag is in the hall.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "is-she-in-the",
      "title_vi": "\"Is she in the…?\" và cách trả lời",
      "explain_vi": "Hỏi xem một người CÓ ở trong phòng nào không: \"Is she in the kitchen?\". Nếu đúng, trả lời \"Yes, she is.\". Nếu không, trả lời \"No, she isn't.\". Với bạn trai thì đổi \"she\" thành \"he\".",
      "examples": [
        "Is she in the kitchen? Yes, she is.",
        "Is she in the bedroom? No, she isn't.",
        "Is he in the garden? Yes, he is."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "question-is-she-in", "text": "Is {subj} in the {room}?", "blanks": ["subj"], "context_vi": "Hỏi xem người đó có ở trong phòng này không.", "audioText": "Is she in the kitchen?" },
          { "id": "answer-yes-she", "text": "Yes, {subj} is.", "blanks": ["subj"], "context_vi": "Trả lời khi người đó CÓ ở trong phòng.", "audioText": "Yes, she is." },
          { "id": "answer-no-she", "text": "No, {subj} isn't.", "blanks": ["subj"], "context_vi": "Trả lời khi người đó KHÔNG ở trong phòng.", "audioText": "No, she isn't." }
        ],
        "slots": {
          "subj": ["she", "he"],
          "room": ["bedroom", "kitchen", "bathroom", "living room", "garden", "hall"]
        },
        "answerKey": {
          "answer-pairs": { "Yes, she is.": "No, she isn't.", "No, she isn't.": "Yes, she is.", "Yes, he is.": "No, he isn't.", "No, he isn't.": "Yes, he is." }
        },
        "distractors": [
          "Yes, she isn't.",
          "No, she is.",
          "Yes, she not.",
          "No, she is not in.",
          "Is she in kitchen?",
          "Is she in the kitchen.",
          "Yes, she's."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "where-are-they",
      "title_vi": "\"Where are…?\" và \"Are they in…?\"",
      "explain_vi": "Hỏi NHIỀU người (hai người trở lên) đang ở đâu: \"Where are Mum and Dad?\". Trả lời bằng \"They're in the…\". Em cũng có thể hỏi \"Are they in the garden?\" và trả lời \"Yes, they are.\" hoặc \"No, they aren't.\".",
      "examples": [
        "Where are Mum and Dad? They're in the kitchen.",
        "Are they in the garden? Yes, they are.",
        "Are they in the bedroom? No, they aren't."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "answer-they-are-in", "text": "They're in the {room}.", "blanks": ["room"], "context_vi": "Nói nhiều người đang ở trong phòng nào.", "audioText": "They're in the kitchen." },
          { "id": "question-are-they-in", "text": "Are they in the {room}?", "blanks": ["room"], "context_vi": "Hỏi xem nhiều người có ở trong phòng này không.", "audioText": "Are they in the garden?" },
          { "id": "answer-yes-they", "text": "Yes, they are.", "blanks": [], "context_vi": "Trả lời khi họ CÓ ở trong phòng.", "audioText": "Yes, they are." },
          { "id": "answer-no-they", "text": "No, they aren't.", "blanks": [], "context_vi": "Trả lời khi họ KHÔNG ở trong phòng.", "audioText": "No, they aren't." }
        ],
        "slots": {
          "room": ["bedroom", "kitchen", "bathroom", "living room", "garden", "hall"],
          "answer": ["Yes, they are.", "No, they aren't."]
        },
        "answerKey": {
          "answer-pairs": { "Yes, they are.": "No, they aren't.", "No, they aren't.": "Yes, they are." }
        },
        "distractors": [
          "Yes, they aren't.",
          "No, they are.",
          "They're in kitchen.",
          "Where is Mum and Dad?",
          "Are they in the garden.",
          "Yes, they're.",
          "No, they not."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["ch"],
    "soundLabels": {
      "ch": { "ipa": "/tʃ/", "anchor": "chair", "position": "initial", "say_vi": "âm /tʃ/ (giống \"ch\" trong tiếng Việt) như đầu từ \"chair\" — hai chữ c và h ghép lại thành một âm" }
    },
    "words": [
      { "word": "chair", "icon": "🪑", "focusSound": "ch", "anchor": "chair", "audio": "" },
      { "word": "cheese", "icon": "🧀", "focusSound": "ch", "anchor": "chair", "audio": "" },
      { "word": "chick", "icon": "🐤", "focusSound": "ch", "anchor": "chair", "audio": "" },
      { "word": "chips", "icon": "🍟", "focusSound": "ch", "anchor": "chair", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "where-is-everyone",
      "title": "Where is everyone?",
      "title_vi": "Mọi người ở đâu?",
      "text": "This is my home. Mum is in the kitchen. Dad and Billy are in the garden. My sister is in the bedroom. The cat is in the hall. We are all at home.",
      "questions": [
        { "id": "q1", "q_vi": "Mẹ ở trong nhà bếp, đúng không?", "type": "truefalse", "answer": true, "audioText": "Mum is in the kitchen." },
        { "id": "q2", "q_vi": "Bố và Billy đang ở đâu?", "type": "mcq", "choices": ["in the garden", "in the bedroom", "in the bathroom"], "answer": 0, "audioText": "Where are Dad and Billy?" },
        { "id": "q3", "q_vi": "Con mèo ở đâu?", "type": "mcq", "choices": ["in the hall", "in the kitchen", "in the garden"], "answer": 0, "audioText": "Where is the cat?" }
      ]
    }
  ]
};
  C["level1/unit09.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 9,
  "topic": "My lunch box",
  "topic_vi": "Hộp cơm trưa của em",
  "vocab": [
    { "word": "sandwich", "vi": "bánh mì kẹp", "icon": "🥪", "example": "I've got a sandwich.", "partOfSpeech": "noun", "audio": "" },
    { "word": "apple", "vi": "quả táo", "icon": "🍎", "example": "I've got an apple.", "partOfSpeech": "noun", "audio": "" },
    { "word": "banana", "vi": "quả chuối", "icon": "🍌", "example": "I've got a banana.", "partOfSpeech": "noun", "audio": "" },
    { "word": "drink", "vi": "đồ uống", "icon": "🧃", "example": "I've got a drink.", "partOfSpeech": "noun", "audio": "" },
    { "word": "egg", "vi": "quả trứng", "icon": "🥚", "example": "I've got an egg.", "partOfSpeech": "noun", "audio": "" },
    { "word": "pear", "vi": "quả lê", "icon": "🍐", "example": "I've got a pear.", "partOfSpeech": "noun", "audio": "" },
    { "word": "biscuit", "vi": "bánh quy", "icon": "🍪", "example": "I've got a biscuit.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "ive-got",
      "title_vi": "\"I've got…\" và \"I haven't got…\"",
      "explain_vi": "Nói em CÓ một thứ gì: \"I've got…\" (em có…). Nói em KHÔNG có: \"I haven't got…\" (em không có…). \"I've got\" là cách viết gọn của \"I have got\".",
      "examples": [
        "I've got a sandwich.",
        "I've got an apple.",
        "I haven't got a drink."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "i-have-got", "text": "I've got {art} {noun}.", "blanks": ["art"], "context_vi": "Nói em CÓ một món trong hộp cơm trưa.", "audioText": "I've got a sandwich." },
          { "id": "i-havent-got", "text": "I haven't got {art} {noun}.", "blanks": ["art"], "context_vi": "Nói em KHÔNG có một món nào đó.", "audioText": "I haven't got a drink." }
        ],
        "slots": {
          "art": ["a", "an"],
          "noun": ["sandwich", "apple", "banana", "drink", "egg", "pear", "biscuit"]
        },
        "answerKey": {
          "i-have-got": {
            "art": { "sandwich": "a", "apple": "an", "banana": "a", "drink": "a", "egg": "an", "pear": "a", "biscuit": "a" }
          },
          "i-havent-got": {
            "art": { "sandwich": "a", "apple": "an", "banana": "a", "drink": "a", "egg": "an", "pear": "a", "biscuit": "a" }
          }
        },
        "distractors": [
          "I've got a apple.",
          "I've got a egg.",
          "I have got an sandwich.",
          "I haven't got a apple.",
          "I've not got a drink.",
          "I got a sandwich.",
          "I've got sandwich."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "a-or-an-food",
      "title_vi": "Dùng \"a\" hay \"an\"?",
      "explain_vi": "Trước từ bắt đầu bằng nguyên âm (a, e, i, o, u) thì dùng \"an\": an apple, an egg. Các từ còn lại dùng \"a\": a banana, a pear.",
      "examples": [
        "I've got an apple.",
        "I've got an egg.",
        "I've got a banana."
      ],
      "generators": ["fill_blank", "mcq"],
      "safeZone": {
        "templates": [
          { "id": "choose-article-food", "text": "I've got {art} {noun}.", "blanks": ["art"], "context_vi": "Chọn \"a\" hoặc \"an\" cho đúng với từ đứng sau.", "audioText": "I've got an apple." }
        ],
        "slots": {
          "art": ["a", "an"],
          "noun": ["sandwich", "apple", "banana", "drink", "egg", "pear", "biscuit"]
        },
        "answerKey": {
          "choose-article-food": {
            "art": { "sandwich": "a", "apple": "an", "banana": "a", "drink": "a", "egg": "an", "pear": "a", "biscuit": "a" }
          }
        },
        "distractors": [
          "I've got an sandwich.",
          "I've got an banana.",
          "I've got a apple.",
          "I've got a egg."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["th"],
    "soundLabels": {
      "th": { "ipa": "/θ/", "anchor": "three", "position": "initial", "say_vi": "âm /θ/ — đặt đầu lưỡi giữa hai hàm răng rồi thổi nhẹ, như đầu từ \"three\" (không đọc thành \"t\" hay \"s\")" }
    },
    "words": [
      { "word": "three", "icon": "3️⃣", "focusSound": "th", "anchor": "three", "audio": "" },
      { "word": "thumb", "icon": "👍", "focusSound": "th", "anchor": "three", "audio": "" },
      { "word": "thin", "icon": "📏", "focusSound": "th", "anchor": "three", "audio": "" },
      { "word": "think", "icon": "💭", "focusSound": "th", "anchor": "three", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "in-my-lunch-box",
      "title": "In my lunch box",
      "title_vi": "Trong hộp cơm trưa của em",
      "text": "Look at my lunch box. I've got a sandwich and an egg. I've got an apple and a pear. I've got a drink. I haven't got a biscuit today. I like my lunch.",
      "questions": [
        { "id": "q1", "q_vi": "Trong hộp có một quả táo, đúng không?", "type": "truefalse", "answer": true, "audioText": "There is an apple in the lunch box." },
        { "id": "q2", "q_vi": "Hôm nay bạn nhỏ KHÔNG có món gì?", "type": "mcq", "choices": ["a biscuit", "a sandwich", "an apple"], "answer": 0, "audioText": "What hasn't she got today?" },
        { "id": "q3", "q_vi": "Đồ uống có trong hộp không?", "type": "truefalse", "answer": true, "audioText": "She has got a drink." }
      ]
    }
  ]
};
  C["level1/unit10.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 10,
  "topic": "My friends",
  "topic_vi": "Bạn bè của em",
  "vocab": [
    { "word": "long hair", "vi": "tóc dài", "icon": "👩", "example": "She's got long hair.", "partOfSpeech": "phrase", "audio": "" },
    { "word": "short hair", "vi": "tóc ngắn", "icon": "👦", "example": "He's got short hair.", "partOfSpeech": "phrase", "audio": "" },
    { "word": "eyes", "vi": "đôi mắt", "icon": "👀", "example": "She's got big eyes.", "partOfSpeech": "noun", "audio": "" },
    { "word": "big", "vi": "to, lớn", "icon": "🐘", "example": "He's got big eyes.", "partOfSpeech": "adj", "audio": "" },
    { "word": "small", "vi": "nhỏ, bé", "icon": "🐜", "example": "She's got small eyes.", "partOfSpeech": "adj", "audio": "" },
    { "word": "tall", "vi": "cao", "icon": "📏", "example": "My friend is tall.", "partOfSpeech": "adj", "audio": "" },
    { "word": "friend", "vi": "bạn", "icon": "🧒", "example": "This is my friend.", "partOfSpeech": "noun", "audio": "" },
    { "word": "hat", "vi": "cái mũ", "icon": "🧢", "example": "He's got a hat.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "he-she-has-got",
      "title_vi": "\"He's got…\" / \"She's got…\"",
      "explain_vi": "Để nói bạn ấy CÓ gì (tóc, mắt, đồ vật), em dùng \"He's got…\" cho bạn trai và \"She's got…\" cho bạn gái. \"'s got\" nghĩa là \"has got\" (có).",
      "examples": [
        "He's got short hair.",
        "She's got long hair.",
        "She's got big eyes.",
        "He's got a hat."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "subj-has-got-thing", "text": "{subj} got {thing}.", "blanks": ["subj"], "context_vi": "Nói bạn trai (He) hay bạn gái (She) CÓ gì.", "audioText": "She's got long hair." },
          { "id": "she-has-got", "text": "She's got {thing}.", "blanks": ["thing"], "context_vi": "Tả một bạn gái: bạn ấy có gì.", "audioText": "She's got long hair." },
          { "id": "he-has-got", "text": "He's got {thing}.", "blanks": ["thing"], "context_vi": "Tả một bạn trai: bạn ấy có gì.", "audioText": "He's got short hair." }
        ],
        "slots": {
          "subj": ["He's", "She's"],
          "thing": ["long hair", "short hair", "big eyes", "small eyes", "a hat"]
        },
        "answerKey": {
          "subj-has-got-thing": { "subj_by_clue": { "boy": "He's", "girl": "She's" } }
        },
        "distractors": [
          "He's got long hairs.",
          "She have got long hair.",
          "He got short hair.",
          "She's got a eyes.",
          "He's gots a hat.",
          "She's long hair."
        ],
        "irregulars": { "have": "has", "has got (contraction)": "'s got" }
      }
    },
    {
      "id": "he-she-hasnt-got",
      "title_vi": "\"He hasn't got…\" / \"She hasn't got…\"",
      "explain_vi": "Để nói bạn ấy KHÔNG có gì, em thêm \"hasn't\" (không có): \"He hasn't got…\" / \"She hasn't got…\". Sau \"got\" vẫn nói tên thứ đó như bình thường.",
      "examples": [
        "He hasn't got long hair.",
        "She hasn't got a hat.",
        "He hasn't got small eyes."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "transform"],
      "safeZone": {
        "templates": [
          { "id": "subj-hasnt-got-thing", "text": "{subj} hasn't got {thing}.", "blanks": ["subj"], "context_vi": "Nói bạn trai (He) hay bạn gái (She) KHÔNG có gì.", "audioText": "He hasn't got long hair." },
          { "id": "she-hasnt-got", "text": "She hasn't got {thing}.", "blanks": ["thing"], "context_vi": "Tả một bạn gái: bạn ấy KHÔNG có gì.", "audioText": "She hasn't got a hat." },
          { "id": "he-hasnt-got", "text": "He hasn't got {thing}.", "blanks": ["thing"], "context_vi": "Tả một bạn trai: bạn ấy KHÔNG có gì.", "audioText": "He hasn't got long hair." }
        ],
        "slots": {
          "subj": ["He", "She"],
          "thing": ["long hair", "short hair", "big eyes", "small eyes", "a hat"]
        },
        "answerKey": {
          "subj-hasnt-got-thing": { "subj_by_clue": { "boy": "He", "girl": "She" } },
          "answer-pairs": {
            "He's got long hair.": "He hasn't got long hair.",
            "She's got a hat.": "She hasn't got a hat.",
            "He's got big eyes.": "He hasn't got big eyes.",
            "She's got short hair.": "She hasn't got short hair."
          }
        },
        "distractors": [
          "He hasn't got long hairs.",
          "She haven't got a hat.",
          "He don't got long hair.",
          "She hasn't a hat.",
          "He isn't got long hair.",
          "She not got a hat."
        ],
        "irregulars": { "hasn't got": "has not got" }
      }
    }
  ],
  "phonics": {
    "position": "medial",
    "focus": ["a"],
    "soundLabels": {
      "a": { "ipa": "/æ/", "anchor": "cat", "position": "medial", "say_vi": "âm /æ/ ngắn ở GIỮA từ như trong \"cat\" (miệng mở rộng, không đọc tên chữ \"ây\")" }
    },
    "words": [
      { "word": "cat", "icon": "🐱", "focusSound": "a", "anchor": "cat", "audio": "" },
      { "word": "man", "icon": "👨", "focusSound": "a", "anchor": "cat", "audio": "" },
      { "word": "fan", "icon": "🌀", "focusSound": "a", "anchor": "cat", "audio": "" },
      { "word": "bag", "icon": "🎒", "focusSound": "a", "anchor": "cat", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "my-friend-sam",
      "title": "My friend Sam",
      "title_vi": "Bạn Sam của em",
      "text": "This is my friend Sam. Sam is a boy. He's got short hair. He's got big eyes. He's got a hat. Sam is tall. He hasn't got long hair. I like my friend Sam.",
      "questions": [
        { "id": "q1", "q_vi": "Sam có tóc ngắn, đúng không?", "type": "truefalse", "answer": true, "audioText": "Sam has got short hair." },
        { "id": "q2", "q_vi": "Mắt của Sam thế nào?", "type": "mcq", "choices": ["big eyes", "small eyes", "long hair"], "answer": 0, "audioText": "What has Sam got?" },
        { "id": "q3", "q_vi": "Sam KHÔNG có gì?", "type": "mcq", "choices": ["long hair", "a hat", "big eyes"], "answer": 0, "audioText": "What hasn't Sam got?" }
      ]
    }
  ]
};
  C["level1/unit11.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 11,
  "topic": "The zoo",
  "topic_vi": "Sở thú",
  "vocab": [
    { "word": "lion", "vi": "con sư tử", "icon": "🦁", "example": "I like lions.", "partOfSpeech": "noun", "audio": "" },
    { "word": "monkey", "vi": "con khỉ", "icon": "🐒", "example": "I like monkeys.", "partOfSpeech": "noun", "audio": "" },
    { "word": "elephant", "vi": "con voi", "icon": "🐘", "example": "Elephants are big.", "partOfSpeech": "noun", "audio": "" },
    { "word": "snake", "vi": "con rắn", "icon": "🐍", "example": "Snakes are long.", "partOfSpeech": "noun", "audio": "" },
    { "word": "giraffe", "vi": "con hươu cao cổ", "icon": "🦒", "example": "Giraffes are tall.", "partOfSpeech": "noun", "audio": "" },
    { "word": "big", "vi": "to, lớn", "icon": "🐘", "example": "The elephant is big.", "partOfSpeech": "adj", "audio": "" },
    { "word": "little", "vi": "nhỏ bé", "icon": "🐜", "example": "The monkey is little.", "partOfSpeech": "adj", "audio": "" },
    { "word": "long", "vi": "dài", "icon": "📏", "example": "The snake is long.", "partOfSpeech": "adj", "audio": "" },
    { "word": "tall", "vi": "cao", "icon": "🦒", "example": "The giraffe is tall.", "partOfSpeech": "adj", "audio": "" }
  ],
  "grammar": [
    {
      "id": "i-like-i-dont-like",
      "title_vi": "\"I like…\" / \"I don't like…\"",
      "explain_vi": "Để nói em THÍCH con vật gì, em dùng \"I like…\". Để nói em KHÔNG thích, em dùng \"I don't like…\" (don't = do not). Khi nói chung chung, tên con vật thêm \"-s\" ở cuối (lions, monkeys).",
      "examples": [
        "I like monkeys.",
        "I don't like snakes.",
        "I like lions.",
        "I don't like elephants."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "i-likeneg-animals", "text": "I {verb} {animals}.", "blanks": ["verb"], "context_vi": "Nói em THÍCH (like) hay KHÔNG thích (don't like) con vật nào.", "audioText": "I like monkeys." },
          { "id": "i-like-animals", "text": "I like {animals}.", "blanks": ["animals"], "context_vi": "Nói tên con vật mà em thích.", "audioText": "I like lions." },
          { "id": "i-dont-like-animals", "text": "I don't like {animals}.", "blanks": ["animals"], "context_vi": "Nói tên con vật mà em không thích.", "audioText": "I don't like snakes." }
        ],
        "slots": {
          "verb": ["like", "don't like"],
          "animals": ["lions", "monkeys", "elephants", "snakes", "giraffes"]
        },
        "answerKey": {
          "i-likeneg-animals": { "verb_by_clue": { "smile": "like", "sad": "don't like" } }
        },
        "distractors": [
          "I like monkey.",
          "I no like snakes.",
          "I don't likes elephants.",
          "I am like lions.",
          "I doesn't like snakes.",
          "I don't like a monkeys."
        ],
        "irregulars": { "monkey": "monkeys", "lion": "lions" }
      }
    },
    {
      "id": "theyre-adjective",
      "title_vi": "\"They're big.\" (Chúng + tính từ)",
      "explain_vi": "Để tả nhiều con vật, em dùng \"They're…\" (They're = They are) rồi nói tính từ: big (to), little (nhỏ), long (dài), tall (cao). Tính từ KHÔNG thêm \"-s\".",
      "examples": [
        "They're big.",
        "They're tall.",
        "Elephants are big. They're big.",
        "Giraffes are tall. They're tall."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "theyre-adj", "text": "They're {adj}.", "blanks": ["adj"], "context_vi": "Tả nhiều con vật bằng một tính từ.", "audioText": "They're big." },
          { "id": "animals-are-adj", "text": "{Animals} are {adj}.", "blanks": ["adj"], "context_vi": "Nói con vật đó có tính chất gì.", "audioText": "Elephants are big." }
        ],
        "slots": {
          "adj": ["big", "little", "long", "tall"],
          "Animals": ["Elephants", "Giraffes", "Snakes", "Monkeys", "Lions"]
        },
        "answerKey": {
          "animals-are-adj": {
            "adj_by_animal": { "Elephants": "big", "Giraffes": "tall", "Snakes": "long", "Monkeys": "little", "Lions": "big" }
          }
        },
        "distractors": [
          "They're bigs.",
          "They big.",
          "They's big.",
          "They are tall tall.",
          "Elephants is big.",
          "They're a big."
        ],
        "irregulars": { "They're": "They are" }
      }
    }
  ],
  "phonics": {
    "position": "medial",
    "focus": ["e"],
    "soundLabels": {
      "e": { "ipa": "/e/", "anchor": "bed", "position": "medial", "say_vi": "âm /e/ ngắn ở GIỮA từ như trong \"bed\" (đọc gọn, không đọc tên chữ \"i\")" }
    },
    "words": [
      { "word": "bed", "icon": "🛏️", "focusSound": "e", "anchor": "bed", "audio": "" },
      { "word": "pen", "icon": "🖊️", "focusSound": "e", "anchor": "bed", "audio": "" },
      { "word": "red", "icon": "🔴", "focusSound": "e", "anchor": "bed", "audio": "" },
      { "word": "hen", "icon": "🐔", "focusSound": "e", "anchor": "bed", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "at-the-zoo",
      "title": "At the zoo",
      "title_vi": "Ở sở thú",
      "text": "I am at the zoo. I like monkeys. Monkeys are little. I like giraffes. Giraffes are tall. I don't like snakes. Snakes are long. Elephants are big. I like the zoo!",
      "questions": [
        { "id": "q1", "q_vi": "Bạn nhỏ thích khỉ, đúng không?", "type": "truefalse", "answer": true, "audioText": "I like monkeys." },
        { "id": "q2", "q_vi": "Hươu cao cổ thế nào?", "type": "mcq", "choices": ["tall", "little", "long"], "answer": 0, "audioText": "Giraffes are tall." },
        { "id": "q3", "q_vi": "Bạn nhỏ KHÔNG thích con vật nào?", "type": "mcq", "choices": ["snakes", "monkeys", "giraffes"], "answer": 0, "audioText": "I don't like snakes." }
      ]
    }
  ]
};
  C["level1/unit12.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 12,
  "topic": "Food and drinks",
  "topic_vi": "Đồ ăn thức uống",
  "vocab": [
    { "word": "rice", "vi": "cơm (gạo)", "icon": "🍚", "example": "I like rice.", "partOfSpeech": "noun", "audio": "" },
    { "word": "meat", "vi": "thịt", "icon": "🍖", "example": "I like meat.", "partOfSpeech": "noun", "audio": "" },
    { "word": "fish", "vi": "cá", "icon": "🐟", "example": "I like fish.", "partOfSpeech": "noun", "audio": "" },
    { "word": "bread", "vi": "bánh mì", "icon": "🍞", "example": "I like bread.", "partOfSpeech": "noun", "audio": "" },
    { "word": "milk", "vi": "sữa", "icon": "🥛", "example": "I like milk.", "partOfSpeech": "noun", "audio": "" },
    { "word": "juice", "vi": "nước ép", "icon": "🧃", "example": "I like juice.", "partOfSpeech": "noun", "audio": "" },
    { "word": "carrots", "vi": "(những) củ cà rốt", "icon": "🥕", "example": "I like carrots.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "do-you-like",
      "title_vi": "\"Do you like…?\" và cách trả lời",
      "explain_vi": "Hỏi xem bạn có thích một món không: \"Do you like…?\". Nếu thích, trả lời \"Yes, I do.\". Nếu không thích, trả lời \"No, I don't.\".",
      "examples": [
        "Do you like rice? Yes, I do.",
        "Do you like fish? No, I don't.",
        "Do you like milk? Yes, I do."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "question-do-you-like", "text": "Do you like {food}?", "blanks": ["food"], "context_vi": "Hỏi xem bạn (người nghe) có thích món này không.", "audioText": "Do you like rice?" },
          { "id": "answer-yes", "text": "Yes, I do.", "blanks": [], "context_vi": "Trả lời khi CÓ thích.", "audioText": "Yes, I do." },
          { "id": "answer-no", "text": "No, I don't.", "blanks": [], "context_vi": "Trả lời khi KHÔNG thích.", "audioText": "No, I don't." }
        ],
        "slots": {
          "food": ["rice", "meat", "fish", "bread", "milk", "juice", "carrots"],
          "answer": ["Yes, I do.", "No, I don't."]
        },
        "answerKey": {
          "question-do-you-like": { "food": "food" },
          "answer-pairs": { "Yes, I do.": "No, I don't.", "No, I don't.": "Yes, I do." }
        },
        "distractors": [
          "Yes, I don't.",
          "No, I do.",
          "Yes, I like.",
          "No, I not.",
          "Do you likes rice?",
          "You like rice?"
        ],
        "irregulars": {}
      }
    },
    {
      "id": "what-do-you-like",
      "title_vi": "\"What do you like?\"",
      "explain_vi": "Muốn hỏi bạn thích món gì, em nói \"What do you like?\". Bạn trả lời bắt đầu bằng \"I like…\" rồi nói tên món.",
      "examples": [
        "What do you like? I like rice.",
        "What do you like? I like juice.",
        "What do you like? I like bread."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "i-like-food", "text": "I like {food}.", "blanks": ["food"], "context_vi": "Nói tên món em thích.", "audioText": "I like rice." },
          { "id": "what-do-you-like-answer", "text": "What do you like? I like {food}.", "blanks": ["food"], "context_vi": "Hỏi và trả lời về món mình thích.", "audioText": "What do you like? I like rice." }
        ],
        "slots": {
          "food": ["rice", "meat", "fish", "bread", "milk", "juice", "carrots"]
        },
        "answerKey": {
          "i-like-food": { "food": "food" },
          "what-do-you-like-answer": { "food": "food" }
        },
        "distractors": [
          "I likes rice.",
          "I like.",
          "What you like? I like rice.",
          "What do you like? I likes rice.",
          "I am like rice."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "medial",
    "focus": ["i"],
    "soundLabels": {
      "i": { "ipa": "/ɪ/", "anchor": "pig", "position": "medial", "say_vi": "âm /ɪ/ ngắn ở GIỮA từ như trong \"pig\" (không đọc tên chữ \"ai\")" }
    },
    "words": [
      { "word": "bin", "icon": "🗑️", "focusSound": "i", "anchor": "pig", "audio": "" },
      { "word": "pin", "icon": "📌", "focusSound": "i", "anchor": "pig", "audio": "" },
      { "word": "tin", "icon": "🥫", "focusSound": "i", "anchor": "pig", "audio": "" },
      { "word": "pig", "icon": "🐷", "focusSound": "i", "anchor": "pig", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "my-lunch",
      "title": "My lunch",
      "title_vi": "Bữa trưa của em",
      "text": "This is my lunch. I like rice. I like fish. I like carrots. I don't like milk. I like juice. Yum!",
      "questions": [
        { "id": "q1", "q_vi": "Bạn nhỏ có thích cá không?", "type": "truefalse", "answer": true, "audioText": "Do you like fish?" },
        { "id": "q2", "q_vi": "Bạn nhỏ KHÔNG thích món nào?", "type": "mcq", "choices": ["milk", "rice", "fish"], "answer": 0, "audioText": "What don't you like?" },
        { "id": "q3", "q_vi": "Bạn nhỏ thích uống gì?", "type": "mcq", "choices": ["juice", "milk", "meat"], "answer": 0, "audioText": "What do you like to drink?" }
      ]
    }
  ]
};
  C["level1/unit13.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 13,
  "topic": "My bedroom",
  "topic_vi": "Phòng ngủ của em (và số 11–20)",
  "vocab": [
    { "word": "bed", "vi": "cái giường", "icon": "🛏️", "example": "It's a bed.", "partOfSpeech": "noun", "audio": "" },
    { "word": "cupboard", "vi": "cái tủ", "icon": "🚪", "example": "It's a cupboard.", "partOfSpeech": "noun", "audio": "" },
    { "word": "shelf", "vi": "cái kệ", "icon": "🗄️", "example": "It's a shelf.", "partOfSpeech": "noun", "audio": "" },
    { "word": "lamp", "vi": "cái đèn", "icon": "💡", "example": "It's a lamp.", "partOfSpeech": "noun", "audio": "" },
    { "word": "toy box", "vi": "hộp đồ chơi", "icon": "🧰", "example": "It's a toy box.", "partOfSpeech": "noun", "audio": "" },
    { "word": "eleven", "vi": "mười một (11)", "icon": "1️⃣1️⃣", "example": "There are eleven books.", "partOfSpeech": "number", "audio": "" },
    { "word": "twelve", "vi": "mười hai (12)", "icon": "1️⃣2️⃣", "example": "There are twelve pens.", "partOfSpeech": "number", "audio": "" },
    { "word": "fifteen", "vi": "mười lăm (15)", "icon": "1️⃣5️⃣", "example": "There are fifteen toys.", "partOfSpeech": "number", "audio": "" },
    { "word": "twenty", "vi": "hai mươi (20)", "icon": "2️⃣0️⃣", "example": "There are twenty pens.", "partOfSpeech": "number", "audio": "" }
  ],
  "grammar": [
    {
      "id": "theres-singular",
      "title_vi": "\"There's…\" (có một cái…)",
      "explain_vi": "Khi nói có MỘT đồ vật ở đâu đó, em dùng \"There's a…\" (viết đầy đủ là \"There is a…\"). Sau đó nói tên một đồ vật.",
      "examples": [
        "There's a bed.",
        "There's a lamp.",
        "There's a toy box."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "theres-a-noun", "text": "There's a {noun}.", "blanks": ["noun"], "context_vi": "Nói trong phòng có MỘT đồ vật.", "audioText": "There's a bed." }
        ],
        "slots": {
          "noun": ["bed", "cupboard", "shelf", "lamp", "toy box"]
        },
        "answerKey": {
          "theres-a-noun": { "noun": "noun" }
        },
        "distractors": [
          "There a bed.",
          "There's bed.",
          "There are a bed.",
          "There's a beds.",
          "Theres a bed."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "there-are-plural",
      "title_vi": "\"There are…\" (có nhiều cái…)",
      "explain_vi": "Khi nói có NHIỀU (từ 2 trở lên), em dùng \"There are…\" rồi nói số đếm và tên đồ vật ở dạng số nhiều (thêm -s).",
      "examples": [
        "There are eleven books.",
        "There are fifteen toys.",
        "There are twenty pens."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "there-are-num-noun", "text": "There are {num} {nounPlural}.", "blanks": ["nounPlural"], "context_vi": "Nói có NHIỀU đồ vật (kèm số đếm).", "audioText": "There are eleven books." }
        ],
        "slots": {
          "num": ["eleven", "twelve", "fifteen", "twenty"],
          "nounPlural": ["books", "toys", "pens", "beds", "lamps"]
        },
        "answerKey": {
          "there-are-num-noun": { "nounPlural": "nounPlural" }
        },
        "distractors": [
          "There are eleven book.",
          "There's eleven books.",
          "There is eleven books.",
          "There are eleven toy.",
          "There are a books."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "theres-vs-there-are",
      "title_vi": "Chọn \"There's\" hay \"There are\"?",
      "explain_vi": "Một cái thì dùng \"There's a…\". Nhiều cái (từ 2 trở lên) thì dùng \"There are…\" và đồ vật thêm -s.",
      "examples": [
        "There's a lamp.",
        "There are twenty pens.",
        "There's a bed."
      ],
      "generators": ["fill_blank", "mcq"],
      "safeZone": {
        "templates": [
          { "id": "choose-there-singular", "text": "{there} a {noun}.", "blanks": ["there"], "context_vi": "Chọn từ đúng khi có MỘT đồ vật.", "audioText": "There's a lamp." },
          { "id": "choose-there-plural", "text": "{there} {num} {nounPlural}.", "blanks": ["there"], "context_vi": "Chọn từ đúng khi có NHIỀU đồ vật.", "audioText": "There are twenty pens." }
        ],
        "slots": {
          "there": ["There's", "There are"],
          "noun": ["bed", "cupboard", "shelf", "lamp", "toy box"],
          "num": ["eleven", "twelve", "fifteen", "twenty"],
          "nounPlural": ["books", "toys", "pens", "beds", "lamps"]
        },
        "answerKey": {
          "choose-there-singular": { "there": "There's" },
          "choose-there-plural": { "there": "There are" }
        },
        "distractors": [
          "There are a lamp.",
          "There's twenty pens.",
          "There is twenty pens."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "medial",
    "focus": ["u"],
    "soundLabels": {
      "u": { "ipa": "/ʌ/", "anchor": "sun", "position": "medial", "say_vi": "âm /ʌ/ ngắn ở GIỮA từ như trong \"sun\" (không đọc tên chữ \"diu\")" }
    },
    "words": [
      { "word": "rug", "icon": "🧶", "focusSound": "u", "anchor": "sun", "audio": "" },
      { "word": "jug", "icon": "🏺", "focusSound": "u", "anchor": "sun", "audio": "" },
      { "word": "sun", "icon": "☀️", "focusSound": "u", "anchor": "sun", "audio": "" },
      { "word": "bus", "icon": "🚌", "focusSound": "u", "anchor": "sun", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "in-my-bedroom",
      "title": "In my bedroom",
      "title_vi": "Trong phòng ngủ của em",
      "text": "This is my bedroom. There's a bed. There's a lamp. There's a toy box. There are fifteen toys in the box. I like my bedroom.",
      "questions": [
        { "id": "q1", "q_vi": "Trong phòng có một cái giường, đúng không?", "type": "truefalse", "answer": true, "audioText": "Is there a bed?" },
        { "id": "q2", "q_vi": "Có bao nhiêu món đồ chơi trong hộp?", "type": "mcq", "choices": ["fifteen", "eleven", "twenty"], "answer": 0, "audioText": "How many toys are there?" },
        { "id": "q3", "q_vi": "Đồ nào CÓ trong phòng ngủ?", "type": "mcq", "choices": ["a lamp", "a bus", "a pig"], "answer": 0, "audioText": "What is in the bedroom?" }
      ]
    }
  ]
};
  C["level1/unit14.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 14,
  "topic": "Abilities",
  "topic_vi": "Khả năng",
  "vocab": [
    { "word": "run", "vi": "chạy", "icon": "🏃", "example": "I can run.", "partOfSpeech": "verb", "audio": "" },
    { "word": "jump", "vi": "nhảy lên", "icon": "🦘", "example": "I can jump.", "partOfSpeech": "verb", "audio": "" },
    { "word": "swim", "vi": "bơi", "icon": "🏊", "example": "I can swim.", "partOfSpeech": "verb", "audio": "" },
    { "word": "fly", "vi": "bay", "icon": "🦅", "example": "The bird can fly.", "partOfSpeech": "verb", "audio": "" },
    { "word": "climb", "vi": "leo, trèo", "icon": "🧗", "example": "I can climb.", "partOfSpeech": "verb", "audio": "" },
    { "word": "sing", "vi": "hát", "icon": "🎤", "example": "I can sing.", "partOfSpeech": "verb", "audio": "" }
  ],
  "grammar": [
    {
      "id": "can-cannot",
      "title_vi": "\"can\" và \"can't\" (làm được / không làm được)",
      "explain_vi": "Làm được việc gì thì nói \"can\" trước động từ. Không làm được thì nói \"can't\". Sau \"can\" và \"can't\" luôn giữ nguyên động từ, không thêm gì cả.",
      "examples": [
        "He can run.",
        "She can swim.",
        "He can't fly.",
        "I can sing."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "subj-can-verb", "text": "{subj} can {verb}.", "blanks": ["verb"], "context_vi": "Nói ai đó LÀM ĐƯỢC một việc.", "audioText": "He can run." },
          { "id": "subj-cannot-verb", "text": "{subj} can't {verb}.", "blanks": ["verb"], "context_vi": "Nói ai đó KHÔNG làm được một việc.", "audioText": "He can't swim." },
          { "id": "choose-can-cant", "text": "{subj} {modal} {verb}.", "blanks": ["modal"], "context_vi": "Chọn \"can\" hoặc \"can't\" cho đúng tình huống.", "audioText": "She can jump." }
        ],
        "slots": {
          "subj": ["He", "She", "I"],
          "verb": ["run", "jump", "swim", "climb", "sing"],
          "modal": ["can", "can't"]
        },
        "answerKey": {
          "subj-can-verb": { "verb": "any" },
          "subj-cannot-verb": { "verb": "any" }
        },
        "distractors": [
          "He can runs.",
          "She can swims.",
          "He cans run.",
          "He can to run.",
          "He can't to fly.",
          "He no can swim.",
          "He don't can sing."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "can-question",
      "title_vi": "Hỏi \"Can he...?\" và cách trả lời",
      "explain_vi": "Muốn hỏi ai đó có làm được việc gì không, đưa \"Can\" lên đầu câu: \"Can he swim?\". Nếu được, trả lời \"Yes, he can.\". Nếu không, trả lời \"No, he can't.\".",
      "examples": [
        "Can he swim? Yes, he can.",
        "Can she fly? No, she can't.",
        "Can he sing? Yes, he can."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "question-can-subj-verb", "text": "Can {subj} {verb}?", "blanks": ["verb"], "context_vi": "Hỏi xem ai đó có làm được việc gì không.", "audioText": "Can he swim?" },
          { "id": "answer-yes", "text": "Yes, {subj} can.", "blanks": [], "context_vi": "Trả lời khi LÀM ĐƯỢC.", "audioText": "Yes, he can." },
          { "id": "answer-no", "text": "No, {subj} can't.", "blanks": [], "context_vi": "Trả lời khi KHÔNG làm được.", "audioText": "No, he can't." }
        ],
        "slots": {
          "subj": ["he", "she"],
          "verb": ["run", "jump", "swim", "climb", "sing"],
          "answer": ["Yes, he can.", "No, he can't."]
        },
        "answerKey": {
          "question-can-subj-verb": { "verb": "any" },
          "answer-pairs": { "Yes, he can.": "No, he can't.", "No, he can't.": "Yes, he can." }
        },
        "distractors": [
          "Can he swims?",
          "He can swim?",
          "Can he to swim?",
          "Yes, he can't.",
          "No, he can.",
          "Yes, he cans.",
          "No, he no can."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "medial",
    "focus": ["o"],
    "soundLabels": {
      "o": { "ipa": "/ɒ/", "anchor": "dog", "position": "medial", "say_vi": "âm /ɒ/ ngắn ở GIỮA từ, như trong \"dog\" (miệng mở tròn, đọc nhanh, không kéo dài)" }
    },
    "words": [
      { "word": "dog", "icon": "🐶", "focusSound": "o", "anchor": "dog", "audio": "" },
      { "word": "log", "icon": "🪵", "focusSound": "o", "anchor": "dog", "audio": "" },
      { "word": "mop", "icon": "🧹", "focusSound": "o", "anchor": "dog", "audio": "" },
      { "word": "box", "icon": "📦", "focusSound": "o", "anchor": "dog", "audio": "" },
      { "word": "fox", "icon": "🦊", "focusSound": "o", "anchor": "dog", "audio": "" },
      { "word": "pot", "icon": "🍲", "focusSound": "o", "anchor": "dog", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "look-at-me",
      "title": "Look at me!",
      "title_vi": "Nhìn em này!",
      "text": "Hi! I'm Tom. I can run and I can jump. I can swim, too. I can't fly. Look at the bird. It can fly! Now your turn. Can you jump? Stand up and jump! Can you sing? I can sing. Sing with me!",
      "questions": [
        { "id": "q1", "q_vi": "Tom bơi được, đúng không?", "type": "truefalse", "answer": true, "audioText": "Tom can swim." },
        { "id": "q2", "q_vi": "Tom KHÔNG làm được việc gì?", "type": "mcq", "choices": ["fly", "run", "jump"], "answer": 0, "audioText": "What can't Tom do?" },
        { "id": "q3", "q_vi": "Con vật nào bay được trong bài?", "type": "mcq", "choices": ["the bird", "the dog", "the fox"], "answer": 0, "audioText": "What can fly?" },
        { "id": "q4", "q_vi": "Bài rủ em đứng dậy và làm gì?", "type": "mcq", "choices": ["jump", "fly", "swim"], "answer": 0, "audioText": "Stand up and jump!" }
      ]
    }
  ]
};
  C["level1/unit15.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 15,
  "topic": "The beach",
  "topic_vi": "Bãi biển",
  "vocab": [
    { "word": "sea", "vi": "biển", "icon": "🌊", "example": "Look at the sea.", "partOfSpeech": "noun", "audio": "" },
    { "word": "sand", "vi": "cát", "icon": "🏖️", "example": "It's sand.", "partOfSpeech": "noun", "audio": "" },
    { "word": "shell", "vi": "vỏ sò", "icon": "🐚", "example": "It's a shell.", "partOfSpeech": "noun", "audio": "" },
    { "word": "boat", "vi": "con thuyền", "icon": "⛵", "example": "It's a boat.", "partOfSpeech": "noun", "audio": "" },
    { "word": "fish", "vi": "con cá", "icon": "🐟", "example": "It's a fish.", "partOfSpeech": "noun", "audio": "" },
    { "word": "sun", "vi": "mặt trời", "icon": "☀️", "example": "Look at the sun.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "lets-verb",
      "title_vi": "\"Let's...\" (mình cùng làm nhé)",
      "explain_vi": "Muốn rủ ai đó cùng làm việc gì với mình, nói \"Let's\" rồi nói động từ. Sau \"Let's\" giữ nguyên động từ, không thêm gì. Ví dụ: \"Let's swim.\" nghĩa là \"Mình cùng bơi nhé\".",
      "examples": [
        "Let's swim.",
        "Let's play.",
        "Let's look at the sea.",
        "Let's run on the sand."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "lets-verb", "text": "Let's {verb}.", "blanks": ["verb"], "context_vi": "Rủ bạn CÙNG làm một việc.", "audioText": "Let's swim." },
          { "id": "lets-verb-place", "text": "Let's {verb} {place}.", "blanks": ["verb"], "context_vi": "Rủ bạn cùng làm một việc ở một nơi.", "audioText": "Let's run on the sand." }
        ],
        "slots": {
          "verb": ["swim", "play", "run", "jump", "sing"],
          "place": ["on the sand", "in the sea"]
        },
        "answerKey": {
          "lets-verb": { "verb": "any" },
          "lets-verb-place": { "verb": "any" }
        },
        "distractors": [
          "Let's swimming.",
          "Let's to swim.",
          "Let's swims.",
          "Lets swim.",
          "Let we swim.",
          "Let's we swim."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "imperatives",
      "title_vi": "Câu ra lệnh / nhắc nhở (Look! Sit down!)",
      "explain_vi": "Khi bảo ai đó làm một việc, em nói thẳng động từ ở đầu câu, không cần \"you\". Ví dụ: \"Look!\", \"Sit down.\", \"Don't run!\". Thêm \"Don't\" ở đầu để bảo ĐỪNG làm.",
      "examples": [
        "Look at the boat!",
        "Sit down, please.",
        "Don't swim now.",
        "Run to the sea!"
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "do-verb", "text": "{verb}, please.", "blanks": ["verb"], "context_vi": "Lịch sự bảo ai đó LÀM một việc.", "audioText": "Sit down, please." },
          { "id": "dont-verb", "text": "Don't {verb}.", "blanks": ["verb"], "context_vi": "Bảo ai đó ĐỪNG làm một việc.", "audioText": "Don't run." },
          { "id": "choose-do-dont", "text": "{cmd} {verb}.", "blanks": ["cmd"], "context_vi": "Chọn câu BẢO LÀM hay BẢO ĐỪNG cho đúng tình huống.", "audioText": "Don't swim." }
        ],
        "slots": {
          "verb": ["look", "run", "jump", "swim", "sing"],
          "cmd": ["Please", "Don't"]
        },
        "answerKey": {
          "do-verb": { "verb": "any" },
          "dont-verb": { "verb": "any" }
        },
        "distractors": [
          "Don't to run.",
          "Don't running.",
          "Doesn't run.",
          "No run.",
          "Not run.",
          "You don't run please."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "medial",
    "focus": ["a", "e", "i", "o", "u"],
    "soundLabels": {
      "a": { "ipa": "/æ/", "anchor": "cat", "position": "medial", "say_vi": "âm /æ/ ngắn ở GIỮA từ, như trong \"cat\"" },
      "e": { "ipa": "/e/", "anchor": "pen", "position": "medial", "say_vi": "âm /e/ ngắn ở GIỮA từ, như trong \"pen\"" },
      "i": { "ipa": "/ɪ/", "anchor": "pig", "position": "medial", "say_vi": "âm /ɪ/ ngắn ở GIỮA từ, như trong \"pig\"" },
      "o": { "ipa": "/ɒ/", "anchor": "dog", "position": "medial", "say_vi": "âm /ɒ/ ngắn ở GIỮA từ, như trong \"dog\"" },
      "u": { "ipa": "/ʌ/", "anchor": "sun", "position": "medial", "say_vi": "âm /ʌ/ ngắn ở GIỮA từ, như trong \"sun\"" }
    },
    "words": [
      { "word": "cat", "icon": "🐱", "focusSound": "a", "anchor": "cat", "audio": "" },
      { "word": "bag", "icon": "🎒", "focusSound": "a", "anchor": "cat", "audio": "" },
      { "word": "pen", "icon": "🖊️", "focusSound": "e", "anchor": "pen", "audio": "" },
      { "word": "hen", "icon": "🐔", "focusSound": "e", "anchor": "pen", "audio": "" },
      { "word": "pig", "icon": "🐷", "focusSound": "i", "anchor": "pig", "audio": "" },
      { "word": "six", "icon": "6️⃣", "focusSound": "i", "anchor": "pig", "audio": "" },
      { "word": "dog", "icon": "🐶", "focusSound": "o", "anchor": "dog", "audio": "" },
      { "word": "box", "icon": "📦", "focusSound": "o", "anchor": "dog", "audio": "" },
      { "word": "sun", "icon": "☀️", "focusSound": "u", "anchor": "sun", "audio": "" },
      { "word": "cup", "icon": "🥤", "focusSound": "u", "anchor": "sun", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "at-the-beach",
      "title": "At the beach",
      "title_vi": "Ở bãi biển",
      "text": "Look at the sea! It's a sunny day. Let's play on the sand. Look, a shell! It's my shell. Look at the boat. A fish can swim in the sea. Let's swim, too! Don't run in the sea. Sit on the sand, please.",
      "questions": [
        { "id": "q1", "q_vi": "Bạn nhỏ tìm thấy một vỏ sò trên cát, đúng không?", "type": "truefalse", "answer": true, "audioText": "There is a shell on the sand." },
        { "id": "q2", "q_vi": "Con gì bơi được ở biển?", "type": "mcq", "choices": ["a fish", "a boat", "a shell"], "answer": 0, "audioText": "What can swim in the sea?" },
        { "id": "q3", "q_vi": "Bài nhắc các bạn ĐỪNG làm gì ở biển?", "type": "mcq", "choices": ["don't run in the sea", "don't swim", "don't sit"], "answer": 0, "audioText": "What must you not do?" },
        { "id": "q4", "q_vi": "Hôm nay trời nắng, đúng không?", "type": "truefalse", "answer": true, "audioText": "It's a sunny day." },
        { "id": "q5", "q_vi": "Vỏ sò là của ai?", "type": "mcq", "choices": ["my shell", "your shell", "her shell"], "answer": 0, "audioText": "Whose shell is it?" }
      ]
    }
  ]
};
  C["level1/lesson01.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 101,
  "lesson": 1,
  "sourceUnits": ["unit00.json", "unit01.json", "unit02.json"],
  "topic": "Me and my class",
  "topic_vi": "Em & lớp học",
  "vocab": [
    { "word": "hello", "vi": "xin chào", "icon": "👋", "example": "Hello! I'm Tom.", "partOfSpeech": "phrase", "audio": "" },
    { "word": "goodbye", "vi": "tạm biệt", "icon": "🙋", "example": "Goodbye! See you.", "partOfSpeech": "phrase", "audio": "" },
    { "word": "pen", "vi": "bút mực", "icon": "🖊️", "example": "It's a pen.", "partOfSpeech": "noun", "audio": "" },
    { "word": "pencil", "vi": "bút chì", "icon": "✏️", "example": "It's a pencil.", "partOfSpeech": "noun", "audio": "" },
    { "word": "book", "vi": "quyển sách", "icon": "📕", "example": "It's a book.", "partOfSpeech": "noun", "audio": "" },
    { "word": "bag", "vi": "cái cặp", "icon": "🎒", "example": "It's my bag.", "partOfSpeech": "noun", "audio": "" },
    { "word": "ruler", "vi": "cái thước", "icon": "📏", "example": "It's a ruler.", "partOfSpeech": "noun", "audio": "" },
    { "word": "apple", "vi": "quả táo", "icon": "🍎", "example": "It's an apple.", "partOfSpeech": "noun", "audio": "" },
    { "word": "teddy", "vi": "gấu bông", "icon": "🧸", "example": "It's my teddy.", "partOfSpeech": "noun", "audio": "" },
    { "word": "ball", "vi": "quả bóng", "icon": "⚽", "example": "It's my ball.", "partOfSpeech": "noun", "audio": "" },
    { "word": "doll", "vi": "búp bê", "icon": "🪆", "example": "It's your doll.", "partOfSpeech": "noun", "audio": "" },
    { "word": "kite", "vi": "con diều", "icon": "🪁", "example": "It's my kite.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "what-is-this",
      "title_vi": "Hỏi tên đồ vật: \"What's this?\" và \"a / an\"",
      "explain_vi": "Hỏi tên một đồ vật ở gần: \"What's this?\". Em trả lời bắt đầu bằng \"It's...\" rồi nói tên đồ vật. Trước từ bắt đầu bằng nguyên âm (a, e, i, o, u) thì dùng \"an\" (ví dụ \"an apple\"); các từ còn lại dùng \"a\".",
      "examples": [
        "What's this? It's a pen.",
        "What's this? It's a book.",
        "What's this? It's an apple."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "it-is-noun", "text": "It's {art} {noun}.", "blanks": ["noun"], "context_vi": "Chỉ vào một đồ vật và nói tên nó.", "audioText": "It's a pen." },
          { "id": "what-is-this-answer", "text": "What's this? It's {art} {noun}.", "blanks": ["noun"], "context_vi": "Hỏi và trả lời tên một đồ vật ở gần.", "audioText": "What's this? It's a pen." },
          { "id": "choose-article", "text": "It's {art} {noun}.", "blanks": ["art"], "context_vi": "Chọn \"a\" hoặc \"an\" cho đúng với từ đứng sau.", "audioText": "It's an apple." }
        ],
        "slots": {
          "art": ["a", "an"],
          "noun": ["pen", "pencil", "book", "bag", "ruler", "apple", "teddy", "ball", "doll", "kite"]
        },
        "answerKey": {
          "it-is-noun": {
            "art": { "pen": "a", "pencil": "a", "book": "a", "bag": "a", "ruler": "a", "apple": "an", "teddy": "a", "ball": "a", "doll": "a", "kite": "a" }
          },
          "what-is-this-answer": {
            "art": { "pen": "a", "pencil": "a", "book": "a", "bag": "a", "ruler": "a", "apple": "an", "teddy": "a", "ball": "a", "doll": "a", "kite": "a" }
          },
          "choose-article": {
            "art": { "pen": "a", "pencil": "a", "book": "a", "bag": "a", "ruler": "a", "apple": "an", "teddy": "a", "ball": "a", "doll": "a", "kite": "a" }
          }
        },
        "distractors": [
          "It's a apple.",
          "It's an pen.",
          "It's an book.",
          "Is a pen.",
          "It's pen.",
          "What this? It's a pen."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "my-your",
      "title_vi": "\"my\" và \"your\" (của em / của bạn)",
      "explain_vi": "Đồ của em thì nói \"my\" (của em). Đồ của bạn em đang nói chuyện thì nói \"your\" (của bạn). Đặt \"my\" hay \"your\" trước tên đồ vật, ví dụ \"It's my bag.\".",
      "examples": [
        "It's my bag.",
        "It's my teddy.",
        "It's your doll."
      ],
      "generators": ["mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "it-is-poss-noun-mine", "text": "It's {poss} {noun}.", "blanks": ["poss"], "context_vi": "Đồ này là CỦA EM (người nói).", "audioText": "It's my teddy." },
          { "id": "it-is-poss-noun-yours", "text": "It's {poss} {noun}.", "blanks": ["poss"], "context_vi": "Đồ này là CỦA BẠN (người nghe).", "audioText": "It's your doll." }
        ],
        "slots": {
          "poss": ["my", "your"],
          "noun": ["bag", "pen", "book", "teddy", "ball", "doll", "kite"]
        },
        "answerKey": {
          "it-is-poss-noun-mine": { "poss": "my" },
          "it-is-poss-noun-yours": { "poss": "your" }
        },
        "distractors": [
          "It's me teddy.",
          "It's you doll.",
          "It's my the bag.",
          "Is my teddy.",
          "It's mine teddy."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["a", "b", "c", "e", "f", "k"],
    "soundLabels": {
      "a": { "ipa": "/æ/", "anchor": "apple", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"apple\" là /æ/ (không đọc tên chữ \"ây\")" },
      "b": { "ipa": "/b/", "anchor": "ball", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"ball\" là /b/ (không đọc tên chữ \"bi\")" },
      "c": { "ipa": "/k/", "anchor": "cat", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"cat\" là /k/ (không đọc tên chữ \"xi\")" },
      "e": { "ipa": "/e/", "anchor": "egg", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"egg\" là /e/ (không đọc tên chữ \"i\")" },
      "f": { "ipa": "/f/", "anchor": "fish", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"fish\" là /f/ (không đọc tên chữ \"ép\")" },
      "k": { "ipa": "/k/", "anchor": "kite", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"kite\" là /k/ (không đọc tên chữ \"kây\")" }
    },
    "words": [
      { "word": "apple", "icon": "🍎", "focusSound": "a", "anchor": "apple", "position": "initial", "audio": "" },
      { "word": "ant", "icon": "🐜", "focusSound": "a", "anchor": "apple", "position": "initial", "audio": "" },
      { "word": "ball", "icon": "⚽", "focusSound": "b", "anchor": "ball", "position": "initial", "audio": "" },
      { "word": "bag", "icon": "🎒", "focusSound": "b", "anchor": "ball", "position": "initial", "audio": "" },
      { "word": "cat", "icon": "🐱", "focusSound": "c", "anchor": "cat", "position": "initial", "audio": "" },
      { "word": "cup", "icon": "🥤", "focusSound": "c", "anchor": "cat", "position": "initial", "audio": "" },
      { "word": "egg", "icon": "🥚", "focusSound": "e", "anchor": "egg", "position": "initial", "audio": "" },
      { "word": "elephant", "icon": "🐘", "focusSound": "e", "anchor": "egg", "position": "initial", "audio": "" },
      { "word": "fish", "icon": "🐟", "focusSound": "f", "anchor": "fish", "position": "initial", "audio": "" },
      { "word": "fox", "icon": "🦊", "focusSound": "f", "anchor": "fish", "position": "initial", "audio": "" },
      { "word": "kite", "icon": "🪁", "focusSound": "k", "anchor": "kite", "position": "initial", "audio": "" },
      { "word": "key", "icon": "🔑", "focusSound": "k", "anchor": "kite", "position": "initial", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "hello-this-is-my-bag",
      "title": "Hello! This is my bag",
      "title_vi": "Xin chào! Đây là cặp của em",
      "text": "Hello! My name's Mai. This is my bag. It's my pen and my book. This is my teddy, and it's an apple, too. The doll is not my doll. It's your doll.",
      "teacherNote_vi": "Câu mở đầu \"Hello! My name's Mai.\" là phần ÔN LẠI mẫu chào hỏi từ phần khởi động (unit00). Trọng tâm MỚI của đoạn đọc là \"my / your\" và \"It's a / an...\". Đoạn rút còn 7 câu (theo . ! ?) cho vừa ngưỡng 6-8.",
      "questions": [
        { "id": "q1", "q_vi": "Bạn nhỏ tên là Mai, đúng không?", "type": "truefalse", "answer": true, "audioText": "Her name is Mai." },
        { "id": "q2", "q_vi": "Đồ nào là của Mai?", "type": "mcq", "choices": ["my teddy", "your doll", "my doll"], "answer": 0, "audioText": "What is Mai's?" },
        { "id": "q3", "q_vi": "Búp bê là của ai?", "type": "mcq", "choices": ["your doll", "my doll", "my teddy"], "answer": 0, "audioText": "Whose doll is it?" },
        { "id": "q4", "q_vi": "Có quả gì trong cặp của Mai?", "type": "mcq", "choices": ["an apple", "a ball", "a kite"], "answer": 0, "audioText": "What fruit is in the bag?" }
      ]
    }
  ],
  "speaking": [
    {
      "id": "say-hello-and-name",
      "title_vi": "Chào hỏi và giới thiệu tên",
      "prompt_vi": "Em chào và nói tên mình, rồi chào tạm biệt. Hãy điền tên thật của em vào chỗ trống nhé.",
      "sentenceFrames": [
        "Hello! My name's ___.",
        "Goodbye!"
      ],
      "audioModels": [
        "Hello! My name's Mai.",
        "Goodbye!"
      ]
    },
    {
      "id": "what-is-this-my-your",
      "title_vi": "Hỏi đồ vật và nói của ai",
      "prompt_vi": "Cầm một đồ vật lên, hỏi và tự trả lời. Sau đó nói đồ đó là của em (my) hay của bạn (your).",
      "sentenceFrames": [
        "What's this? It's a ___.",
        "It's my ___.",
        "It's your ___."
      ],
      "audioModels": [
        "What's this? It's a pen.",
        "It's my teddy.",
        "It's your doll."
      ]
    }
  ],
  "audioNotes": "Nên thu âm người thật cho: các audioModels phần speaking và audioText câu hỏi reading. Đặc biệt mẫu phonics initial /æ/ (apple, ant), /b/ (ball, bag), /k/ (cat, cup, kite, key), /e/ (egg, elephant), /f/ (fish, fox) — vì TTS dễ đọc thành TÊN CHỮ CÁI (\"ây\", \"bi\", \"xi\", \"kây\", \"i\", \"ép\") thay vì ÂM. Loa chỉ nên đọc TỪ TRỌN VẸN, không đọc rời chữ cái. Lưu ý \"kite\" và \"key\" đều bắt đầu bằng âm /k/ giống \"cat\" — gắn với vocab \"kite\" và phonics \"ball\"/\"bag\" gắn với vocab \"ball\", \"bag\". Hai câu mẫu grammar \"What's this? It's a pen.\" và \"It's my bag.\" cũng nên có audio chuẩn để bé bắt chước ngữ điệu câu hỏi và câu trả lời."
};
  C["level1/lesson02.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 102,
  "lesson": 2,
  "topic": "Body and people",
  "topic_vi": "Cơ thể & con người",
  "sourceUnits": ["unit03.json", "unit07.json", "unit04.json"],
  "vocab": [
    { "word": "head", "vi": "đầu", "icon": "🧑", "example": "This is my head.", "partOfSpeech": "noun", "audio": "" },
    { "word": "hand", "vi": "bàn tay", "icon": "✋", "example": "This is my hand.", "partOfSpeech": "noun", "audio": "" },
    { "word": "eye", "vi": "mắt", "icon": "👁️", "example": "This is my eye.", "partOfSpeech": "noun", "audio": "" },
    { "word": "leg", "vi": "chân (cẳng chân)", "icon": "🦵", "example": "This is my leg.", "partOfSpeech": "noun", "audio": "" },
    { "word": "T-shirt", "vi": "áo phông", "icon": "👕", "example": "It's a T-shirt.", "partOfSpeech": "noun", "audio": "" },
    { "word": "hat", "vi": "cái mũ", "icon": "👒", "example": "It's a hat.", "partOfSpeech": "noun", "audio": "" },
    { "word": "dress", "vi": "váy liền", "icon": "👗", "example": "It's a dress.", "partOfSpeech": "noun", "audio": "" },
    { "word": "shoes", "vi": "đôi giày", "icon": "👟", "example": "These are my shoes.", "partOfSpeech": "noun", "audio": "" },
    { "word": "teacher", "vi": "giáo viên", "icon": "🧑‍🏫", "example": "She's a teacher.", "partOfSpeech": "noun", "audio": "" },
    { "word": "doctor", "vi": "bác sĩ", "icon": "🧑‍⚕️", "example": "He's a doctor.", "partOfSpeech": "noun", "audio": "" },
    { "word": "farmer", "vi": "nông dân", "icon": "🧑‍🌾", "example": "He's a farmer.", "partOfSpeech": "noun", "audio": "" },
    { "word": "nurse", "vi": "y tá", "icon": "💉", "example": "She's a nurse.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "this-is-these-are",
      "title_vi": "\"This is my...\" và \"These are my...\"",
      "explain_vi": "Khi chỉ MỘT thứ (một bộ phận hay một món đồ), em nói \"This is my ...\". Khi có HAI hay nhiều thứ giống nhau, em nói \"These are my ...\" và thêm \"-s\" vào sau từ: hand → hands, eye → eyes. Riêng \"shoes\" (giày) luôn đi thành đôi nên luôn dùng \"These are my shoes.\".",
      "examples": [
        "This is my head.",
        "This is my hat.",
        "These are my eyes.",
        "These are my shoes."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "this-is-singular", "text": "This is my {noun}.", "blanks": ["noun"], "context_vi": "Chỉ vào MỘT thứ (một bộ phận hoặc một món đồ).", "audioText": "This is my head." },
          { "id": "these-are-plural", "text": "These are my {noun_pl}.", "blanks": ["noun_pl"], "context_vi": "Chỉ vào HAI (hoặc nhiều) thứ giống nhau.", "audioText": "These are my shoes." },
          { "id": "choose-this-these", "text": "{dem} my {noun_any}.", "blanks": ["dem"], "context_vi": "Chọn \"This is\" hoặc \"These are\" cho đúng với số ít/số nhiều.", "audioText": "These are my eyes." }
        ],
        "slots": {
          "noun": ["head", "hand", "leg", "eye", "T-shirt", "hat", "dress"],
          "noun_pl": ["hands", "legs", "eyes", "shoes"],
          "noun_any": ["head", "hand", "leg", "eye", "T-shirt", "hat", "dress", "hands", "legs", "eyes", "shoes"],
          "dem": ["This is", "These are"]
        },
        "answerKey": {
          "choose-this-these": {
            "dem": {
              "head": "This is",
              "hand": "This is",
              "leg": "This is",
              "eye": "This is",
              "T-shirt": "This is",
              "hat": "This is",
              "dress": "This is",
              "hands": "These are",
              "legs": "These are",
              "eyes": "These are",
              "shoes": "These are"
            }
          }
        },
        "distractors": [
          "This is my eyes.",
          "These are my hat.",
          "This are my head.",
          "These is my shoes.",
          "This is my hands.",
          "These are my leg."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "he-she-is-a-job",
      "title_vi": "\"He's a...\" / \"She's a...\" (nghề nghiệp)",
      "explain_vi": "Khi nói về một bạn nam làm nghề gì, em dùng \"He's a...\" (Anh ấy là...). Khi nói về một bạn nữ, em dùng \"She's a...\" (Chị ấy là...). Rồi nói tên nghề. Các tên nghề trong bài đều dùng \"a\" (a teacher, a doctor, a farmer, a nurse) vì không bắt đầu bằng nguyên âm — đây cũng là phần ôn lại \"a/an\" đã học ở bài trước.",
      "examples": [
        "He's a doctor.",
        "She's a teacher.",
        "He's a farmer.",
        "She's a nurse."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "he-is-a-job", "text": "{subj}'s {art} {noun}.", "blanks": ["subj"], "context_vi": "Nói về một bạn NAM (he) làm nghề gì.", "audioText": "He's a doctor." },
          { "id": "she-is-a-job", "text": "{subj}'s {art} {noun}.", "blanks": ["subj"], "context_vi": "Nói về một bạn NỮ (she) làm nghề gì.", "audioText": "She's a teacher." }
        ],
        "slots": {
          "subj": ["He", "She"],
          "art": ["a"],
          "noun": ["teacher", "doctor", "farmer", "nurse"]
        },
        "answerKey": {
          "he-is-a-job": { "subj": "He" },
          "she-is-a-job": { "subj": "She" }
        },
        "distractors": [
          "He's teacher.",
          "She a teacher.",
          "He's an doctor.",
          "She's the teacher.",
          "He teacher.",
          "He is a teacher ."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["sh", "h", "d"],
    "soundLabels": {
      "sh": { "ipa": "/ʃ/", "anchor": "shoe", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"shoe\" là /ʃ/ (giống ra hiệu im lặng \"suỵt\", không phải âm \"s\") — đây là âm MỚI của bài này" },
      "h": { "ipa": "/h/", "anchor": "hat", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"hat\" là /h/ (hơi thở nhẹ ra, không đọc tên chữ \"hếch\") — phần ÔN âm phụ âm đầu" },
      "d": { "ipa": "/d/", "anchor": "doctor", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"doctor\" là /d/ (đầu lưỡi chạm lợi trên rồi bật ra, không đọc tên chữ \"đi\") — ÔN lại /d/ đã học ở Bài 1 (dog)" }
    },
    "words": [
      { "word": "shoe", "icon": "👞", "focusSound": "sh", "position": "initial", "anchor": "shoe", "audio": "" },
      { "word": "shop", "icon": "🏪", "focusSound": "sh", "position": "initial", "anchor": "shoe", "audio": "" },
      { "word": "ship", "icon": "🚢", "focusSound": "sh", "position": "initial", "anchor": "shoe", "audio": "" },
      { "word": "hat", "icon": "👒", "focusSound": "h", "position": "initial", "anchor": "hat", "audio": "" },
      { "word": "hand", "icon": "✋", "focusSound": "h", "position": "initial", "anchor": "hat", "audio": "" },
      { "word": "doctor", "icon": "🧑‍⚕️", "focusSound": "d", "position": "initial", "anchor": "doctor", "audio": "" },
      { "word": "dress", "icon": "👗", "focusSound": "d", "position": "initial", "anchor": "doctor", "audio": "" }
    ],
    "audio": null,
    "reviewNote_vi": "Âm /ʃ/ (chữ \"sh\") là âm MỚI của bài này. Âm /h/ (hat, hand) và /d/ (doctor, dress) là phần ÔN lại các âm phụ âm đầu đã gặp — Bài 1 đã học /d/ với \"dog\". Nhắc bé so sánh /d/ trong \"doctor, dress\" với /d/ trong \"dog\", và phân biệt /ʃ/ \"sh\" với âm \"s\"."
  },
  "reading": [
    {
      "id": "this-is-me",
      "title": "This is me",
      "title_vi": "Đây là em",
      "text": "Look at me. This is my hat. These are my eyes. These are my shoes. This is my mum. She's a teacher. My dad is a farmer.",
      "questions": [
        { "id": "q1", "q_vi": "Bạn nhỏ có một cái mũ, đúng không?", "type": "truefalse", "answer": true, "audioText": "This is my hat." },
        { "id": "q2", "q_vi": "Mẹ của bạn nhỏ làm nghề gì?", "type": "mcq", "choices": ["a teacher", "a nurse", "a doctor"], "answer": 0, "audioText": "What is the mum?" },
        { "id": "q3", "q_vi": "Câu nào nói về NHIỀU thứ (số nhiều)?", "type": "mcq", "choices": ["These are my eyes.", "This is my head.", "This is my hat."], "answer": 0, "audioText": "Which one is about more than one?" },
        { "id": "q4", "q_vi": "Bố của bạn nhỏ là bác sĩ, đúng không?", "type": "truefalse", "answer": false, "audioText": "The dad is a doctor." }
      ]
    }
  ],
  "speaking": [
    {
      "id": "point-and-say",
      "title_vi": "Chỉ và nói về cơ thể, đồ của em",
      "prompt_vi": "Em hãy chỉ vào người mình và nói to. Dùng \"This is my ...\" khi chỉ MỘT thứ, và \"These are my ...\" khi chỉ NHIỀU thứ giống nhau. Nhớ \"shoes\" (giày) luôn đi thành đôi nên luôn dùng \"These are my shoes.\".",
      "sentenceFrames": [
        "This is my ___.",
        "These are my ___."
      ],
      "audioModels": [
        "This is my hat.",
        "This is my head.",
        "These are my eyes.",
        "These are my shoes."
      ]
    },
    {
      "id": "my-family-job",
      "title_vi": "Giới thiệu người thân và nghề của họ",
      "prompt_vi": "Em hãy giới thiệu mẹ hoặc bố của em rồi nói nghề của họ. Nói câu đầu \"This is my mum.\" hoặc \"This is my dad.\", rồi câu sau dùng \"She's a ...\" cho mẹ hoặc \"He's a ...\" cho bố.",
      "sentenceFrames": [
        "This is my mum. She's a ___.",
        "This is my dad. He's a ___."
      ],
      "audioModels": [
        "This is my mum. She's a teacher.",
        "This is my dad. He's a farmer.",
        "This is my mum. She's a nurse.",
        "This is my dad. He's a doctor."
      ]
    }
  ],
  "audioNotes": "Nên thu âm người thật cho: các câu mẫu phonics initial /ʃ/ là chữ \"sh\" (shoe, shop, ship), /h/ (hat, hand) và /d/ (doctor, dress) vì TTS hay đọc lẫn thành tên chữ cái hoặc nhầm \"sh\" với \"s\"; audioText các câu hỏi reading; các câu mẫu grammar \"This is my...\", \"These are my...\", \"He's a...\", \"She's a...\" và các audioModels phần speaking — đặc biệt cặp câu \"This is my mum. She's a teacher.\" để bé bắt chước ngữ điệu chuẩn. Lưu ý đọc \"shoes\" ở dạng số nhiều (không đọc \"a shoe\") khi nói về đi giày."
};
  C["level1/lesson03.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 103,
  "lesson": 3,
  "sourceUnits": ["unit06.json", "unit08.json", "unit13.json"],
  "topic": "My family and home",
  "topic_vi": "Gia đình & ngôi nhà",
  "vocab": [
    { "word": "mum", "vi": "mẹ", "icon": "👩", "example": "This is my mum.", "partOfSpeech": "noun", "audio": "" },
    { "word": "dad", "vi": "bố", "icon": "👨", "example": "This is my dad.", "partOfSpeech": "noun", "audio": "" },
    { "word": "brother", "vi": "anh trai / em trai", "icon": "👦", "example": "This is my brother.", "partOfSpeech": "noun", "audio": "" },
    { "word": "sister", "vi": "chị gái / em gái", "icon": "👧", "example": "This is my sister.", "partOfSpeech": "noun", "audio": "" },
    { "word": "grandma", "vi": "bà", "icon": "👵", "example": "This is my grandma.", "partOfSpeech": "noun", "audio": "" },
    { "word": "grandpa", "vi": "ông", "icon": "👴", "example": "This is my grandpa.", "partOfSpeech": "noun", "audio": "" },
    { "word": "kitchen", "vi": "nhà bếp", "icon": "🍳", "example": "Mum is in the kitchen.", "partOfSpeech": "noun", "audio": "" },
    { "word": "bathroom", "vi": "phòng tắm", "icon": "🛁", "example": "Dad is in the bathroom.", "partOfSpeech": "noun", "audio": "" },
    { "word": "garden", "vi": "khu vườn", "icon": "🌳", "example": "We are in the garden.", "partOfSpeech": "noun", "audio": "" },
    { "word": "bedroom", "vi": "phòng ngủ", "icon": "🛌", "example": "This is my bedroom.", "partOfSpeech": "noun", "audio": "" },
    { "word": "bed", "vi": "cái giường", "icon": "🛏️", "example": "It's a bed.", "partOfSpeech": "noun", "audio": "" },
    { "word": "lamp", "vi": "cái đèn", "icon": "💡", "example": "It's a lamp.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "is-he-she-in-the",
      "title_vi": "\"Is he/she in the…?\" và cách trả lời",
      "explain_vi": "Đây là mẫu chính của bài. Hỏi xem một người CÓ ở trong phòng nào không: dùng \"Is she in the…?\" cho bạn nữ và \"Is he in the…?\" cho bạn nam. Nếu đúng, trả lời \"Yes, she is.\" / \"Yes, he is.\". Nếu không, trả lời \"No, she isn't.\" / \"No, he isn't.\". Nhìn HÌNH để biết chọn he hay she.",
      "examples": [
        "Is she in the kitchen? Yes, she is.",
        "Is he in the garden? No, he isn't.",
        "Is she in the bedroom? Yes, she is.",
        "Is he in the bathroom? Yes, he is."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose", "match"],
      "safeZone": {
        "templates": [
          { "id": "question-is-in", "text": "Is {subj} in the {room}?", "blanks": ["subj"], "context_vi": "Nhìn hình rồi hỏi: bạn NỮ dùng \"she\", bạn NAM dùng \"he\".", "audioText": "Is she in the kitchen?", "clue": { "she": "👧 bạn nữ → she", "he": "👦 bạn nam → he" } },
          { "id": "answer-yes", "text": "Yes, {subj} is.", "blanks": ["subj"], "context_vi": "Trả lời khi người đó CÓ ở trong phòng.", "audioText": "Yes, she is.", "clue": { "she": "👧 bạn nữ → she", "he": "👦 bạn nam → he" } },
          { "id": "answer-no", "text": "No, {subj} isn't.", "blanks": ["subj"], "context_vi": "Trả lời khi người đó KHÔNG ở trong phòng.", "audioText": "No, she isn't.", "clue": { "she": "👧 bạn nữ → she", "he": "👦 bạn nam → he" } },
          { "id": "match-question-answer", "type": "match", "context_vi": "Nối câu HỎI với câu TRẢ LỜI đúng (đúng he/she và đúng yes/no).", "pairs": [
            { "left": "Is she in the kitchen?", "right": "Yes, she is.", "icon": "👧🍳" },
            { "left": "Is he in the garden?", "right": "No, he isn't.", "icon": "👦🌳" },
            { "left": "Is he in the bathroom?", "right": "Yes, he is.", "icon": "👦🛁" },
            { "left": "Is she in the bedroom?", "right": "No, she isn't.", "icon": "👧🛌" }
          ], "audioText": "Is she in the kitchen? Yes, she is." }
        ],
        "slots": {
          "subj": ["she", "he"],
          "room": ["kitchen", "bathroom", "garden", "bedroom"]
        },
        "answerKey": {
          "match-question-answer": {
            "Is she in the kitchen?": "Yes, she is.",
            "Is he in the garden?": "No, he isn't.",
            "Is he in the bathroom?": "Yes, he is.",
            "Is she in the bedroom?": "No, she isn't."
          }
        },
        "distractors": [
          "Yes, she isn't.",
          "No, she is.",
          "Is she in kitchen?",
          "Is she in the kitchen.",
          "Yes, she's.",
          "Yes, she not.",
          "Is he in the kitchen? Yes, she is.",
          "No, he is."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "this-is-my-person",
      "title_vi": "Ôn lại: giới thiệu người trong nhà \"This is my…\"",
      "explain_vi": "Mẫu này em đã gặp ở Bài 2 (\"This is my head.\"), ở đây chỉ ÔN nhanh. Khi giới thiệu một người trong gia đình, em nói \"This is my…\" rồi nói người đó là ai (mum, dad, brother…). \"my\" nghĩa là \"của em\". Sau khi giới thiệu, em có thể nói tiếp họ ở phòng nào.",
      "examples": [
        "This is my mum. She's in the kitchen.",
        "This is my dad. He's in the garden.",
        "This is my grandma."
      ],
      "generators": ["fill_blank", "mcq"],
      "safeZone": {
        "templates": [
          { "id": "this-is-my-person", "text": "This is my {person}.", "blanks": ["person"], "context_vi": "Chỉ vào một người trong nhà và giới thiệu họ là ai.", "audioText": "This is my mum." }
        ],
        "slots": {
          "person": ["mum", "dad", "brother", "sister", "grandma", "grandpa"]
        },
        "answerKey": {},
        "distractors": [
          "This is me mum.",
          "This my mum.",
          "This is a my mum.",
          "This is mum.",
          "These is my mum."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["g", "s", "k"],
    "soundLabels": {
      "g": { "ipa": "/g/", "anchor": "garden", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"garden\" là /g/ (gằn cổ họng, không đọc tên chữ \"gi\")" },
      "s": { "ipa": "/s/", "anchor": "sister", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"sister\" là /s/ (rít như con rắn ssss, không đọc tên chữ \"ét\")" },
      "k": { "ipa": "/k/", "anchor": "kitchen", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"kitchen\" là /k/ (bật nhẹ ở cổ họng, không đọc tên chữ \"cây\")" }
    },
    "words": [
      { "word": "garden", "icon": "🌳", "focusSound": "g", "position": "initial", "anchor": "garden", "audio": "" },
      { "word": "girl", "icon": "👧", "focusSound": "g", "position": "initial", "anchor": "garden", "audio": "" },
      { "word": "sister", "icon": "👧", "focusSound": "s", "position": "initial", "anchor": "sister", "audio": "" },
      { "word": "sun", "icon": "☀️", "focusSound": "s", "position": "initial", "anchor": "sister", "audio": "" },
      { "word": "kitchen", "icon": "🍳", "focusSound": "k", "position": "initial", "anchor": "kitchen", "audio": "" },
      { "word": "key", "icon": "🔑", "focusSound": "k", "position": "initial", "anchor": "kitchen", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "my-family-at-home",
      "title": "My family at home",
      "title_vi": "Gia đình em ở nhà",
      "text": "This is my family. Mum is in the kitchen. Dad is in the garden. My brother is in the bedroom. Is my sister in the garden? No, she isn't. She's in the bathroom. I like my family and my home.",
      "questions": [
        { "id": "q1", "q_vi": "Mẹ ở trong nhà bếp, đúng không?", "type": "truefalse", "answer": true, "audioText": "Is my mum in the kitchen?" },
        { "id": "q2", "q_vi": "Chị/em gái có ở trong vườn không?", "type": "mcq", "choices": ["No, she isn't.", "Yes, she is.", "No, he isn't."], "answer": 0, "audioText": "Is my sister in the garden?" },
        { "id": "q3", "q_vi": "Anh/em trai ở trong phòng nào?", "type": "mcq", "choices": ["the bedroom", "the kitchen", "the garden"], "answer": 0, "audioText": "Is my brother in the bedroom?" }
      ]
    }
  ],
  "speaking": [
    {
      "id": "introduce-family",
      "title_vi": "Giới thiệu người trong nhà em",
      "prompt_vi": "Em chỉ vào một người trong gia đình và nói to. Dùng mẫu ôn lại \"This is my…\" rồi nói tiếp họ ở phòng nào bằng \"She's / He's in the…\".",
      "sentenceFrames": [
        "This is my ___.",
        "She's in the ___.",
        "He's in the ___."
      ],
      "audioModels": [
        "This is my mum. She's in the kitchen.",
        "This is my dad. He's in the garden.",
        "This is my grandma. She's in the bedroom."
      ]
    },
    {
      "id": "ask-and-answer-room",
      "title_vi": "Hỏi và trả lời về phòng",
      "prompt_vi": "Em hỏi xem một người có ở trong phòng nào không, rồi tự trả lời. Dùng mẫu chính \"Is he/she in the…?\" và trả lời \"Yes, … is.\" hoặc \"No, … isn't.\". Nhớ nhìn xem là bạn nam (he) hay bạn nữ (she).",
      "sentenceFrames": [
        "Is she in the ___?",
        "Is he in the ___?",
        "Yes, she is. / No, she isn't."
      ],
      "audioModels": [
        "Is she in the kitchen? Yes, she is.",
        "Is he in the garden? No, he isn't.",
        "Is he in the bathroom? Yes, he is."
      ]
    }
  ],
  "audioNotes": "Nên thu âm người thật cho: mẫu phonics ĐẦU từ /g/ (garden, girl), /s/ (sister, sun) và /k/ (kitchen, key) — TTS hay đọc nhầm thành tên chữ cái \"gi / ét / cây\" hoặc đọc \"g\" mềm như trong \"giraffe\". Các câu mẫu grammar \"Is she in the kitchen? Yes, she is.\" và \"No, he isn't.\" nên có audio chuẩn để bé bắt chước ngữ điệu câu hỏi/câu trả lời ngắn. Cũng nên thu audioText các câu hỏi đọc hiểu. Ghi chú nội dung: 'bed' và 'lamp' là TỪ MỚI được giới thiệu lần đầu ở Bài 3 này (gốc từ unit13 — phòng ngủ), dạy bằng mẫu đã học \"It's a…\" để KHÔNG vượt i+1 (cấu trúc \"There's a…\" chưa dạy nên đã bỏ khỏi reading/speaking); Bài 4 chỉ TÁI DÙNG 'bed' trong slot giới từ (\"It's on the bed.\"), không dạy lại."
};
  C["level1/lesson04.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 104,
  "lesson": 4,
  "sourceUnits": ["unit10.json", "unit05.json", "unit11.json"],
  "topic": "Friends and fun",
  "topic_vi": "Bạn bè & vui chơi",
  "vocab": [
    { "word": "friend", "vi": "bạn", "icon": "🧒", "example": "This is my friend.", "partOfSpeech": "noun", "audio": "" },
    { "word": "park", "vi": "công viên", "icon": "🏞️", "example": "We are at the park.", "partOfSpeech": "noun", "audio": "" },
    { "word": "swing", "vi": "cái xích đu", "icon": "🛝", "example": "It's a swing.", "partOfSpeech": "noun", "audio": "" },
    { "word": "slide", "vi": "cầu trượt", "icon": "🛝", "example": "It's a slide.", "partOfSpeech": "noun", "audio": "" },
    { "word": "tree", "vi": "cái cây", "icon": "🌳", "example": "It's a tree.", "partOfSpeech": "noun", "audio": "" },
    { "word": "lion", "vi": "con sư tử", "icon": "🦁", "example": "I like lions.", "partOfSpeech": "noun", "audio": "" },
    { "word": "monkey", "vi": "con khỉ", "icon": "🐒", "example": "I like monkeys.", "partOfSpeech": "noun", "audio": "" },
    { "word": "elephant", "vi": "con voi", "icon": "🐘", "example": "Elephants are big.", "partOfSpeech": "noun", "audio": "" },
    { "word": "giraffe", "vi": "con hươu cao cổ", "icon": "🦒", "example": "Giraffes are tall.", "partOfSpeech": "noun", "audio": "" },
    { "word": "snake", "vi": "con rắn", "icon": "🐍", "example": "Snakes are long.", "partOfSpeech": "noun", "audio": "" },
    { "word": "big", "vi": "to, lớn", "icon": "🐘", "example": "The elephant is big.", "partOfSpeech": "adj", "audio": "" },
    { "word": "tall", "vi": "cao", "icon": "🦒", "example": "The giraffe is tall.", "partOfSpeech": "adj", "audio": "" },
    { "word": "long", "vi": "dài", "icon": "🐍", "example": "The snake is long.", "partOfSpeech": "adj", "audio": "" }
  ],
  "grammar": [
    {
      "id": "i-like-i-dont-like",
      "title_vi": "\"I like…\" / \"I don't like…\"",
      "explain_vi": "Để nói em THÍCH con vật gì, em dùng \"I like…\". Để nói em KHÔNG thích, em dùng \"I don't like…\" (don't = do not). Khi nói chung chung, tên con vật thêm \"-s\" ở cuối (lions, monkeys, snakes).",
      "examples": [
        "I like monkeys.",
        "I don't like lions.",
        "I like giraffes.",
        "I don't like snakes."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "i-likeneg-animals", "text": "I {verb} {animals}.", "blanks": ["verb"], "context_vi": "Nói em THÍCH (like) hay KHÔNG thích (don't like) con vật nào.", "audioText": "I like monkeys." },
          { "id": "i-like-animals", "text": "I like {animals}.", "blanks": ["animals"], "context_vi": "Nói tên con vật mà em thích.", "audioText": "I like lions." },
          { "id": "i-dont-like-animals", "text": "I don't like {animals}.", "blanks": ["animals"], "context_vi": "Nói tên con vật mà em không thích.", "audioText": "I don't like snakes." }
        ],
        "slots": {
          "verb": ["like", "don't like"],
          "animals": ["lions", "monkeys", "elephants", "giraffes", "snakes"]
        },
        "answerKey": {
          "i-likeneg-animals": { "verb_by_clue": { "smile": "like", "sad": "don't like" } }
        },
        "distractors": [
          "I like monkey.",
          "I no like lions.",
          "I don't likes elephants.",
          "I am like lions.",
          "I doesn't like lions.",
          "I don't like a monkeys."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "animals-are-adjective",
      "title_vi": "\"Elephants are big.\" (Con vật + tính từ)",
      "explain_vi": "Để tả con vật, em nói tên con vật (số nhiều) + \"are\" + tính từ: big (to), tall (cao), long (dài). Tính từ KHÔNG thêm \"-s\". Em cũng có thể dùng \"They're…\" (They're = They are) để khỏi nhắc lại tên con vật.",
      "examples": [
        "Elephants are big.",
        "Giraffes are tall.",
        "Snakes are long.",
        "They're tall."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "animals-are-adj", "text": "{Animals} are {adj}.", "blanks": ["adj"], "context_vi": "Nói con vật đó có tính chất gì (chọn big / tall / long cho đúng hình).", "audioText": "Elephants are big." },
          { "id": "the-animal-is-adj", "text": "The {animal} is {adj}.", "blanks": ["adj"], "context_vi": "Tả MỘT con vật bằng một tính từ.", "audioText": "The giraffe is tall." },
          { "id": "theyre-adj", "text": "They're {adj}.", "blanks": ["adj"], "context_vi": "Tả nhiều con vật bằng một tính từ, không nhắc lại tên.", "audioText": "They're big." }
        ],
        "slots": {
          "adj": ["big", "tall", "long"],
          "Animals": ["Elephants", "Giraffes", "Snakes", "Lions", "Monkeys"],
          "animal": ["elephant", "giraffe", "snake", "lion", "monkey"]
        },
        "answerKey": {
          "animals-are-adj": {
            "adj_by_animal": { "Elephants": "big", "Giraffes": "tall", "Snakes": "long", "Lions": "big", "Monkeys": "big" }
          },
          "the-animal-is-adj": {
            "adj_by_animal": { "elephant": "big", "giraffe": "tall", "snake": "long", "lion": "big", "monkey": "big" }
          }
        },
        "distractors": [
          "Elephants are bigs.",
          "Elephants is big.",
          "They're a big.",
          "They big.",
          "Giraffes are tall tall.",
          "The giraffe are tall."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["l", "s", "t"],
    "soundLabels": {
      "l": { "ipa": "/l/", "anchor": "lion", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"lion\" là /l/ (lưỡi chạm sau răng trên, không đọc tên chữ \"eo\")" },
      "s": { "ipa": "/s/", "anchor": "swing", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"swing\" là /s/ (xì hơi như rắn, không đọc tên chữ \"ét-sờ\")" },
      "t": { "ipa": "/t/", "anchor": "tree", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"tree\" là /t/ (bật đầu lưỡi, không đọc tên chữ \"ti\")" }
    },
    "words": [
      { "word": "lion", "icon": "🦁", "focusSound": "l", "anchor": "lion", "audio": "" },
      { "word": "leg", "icon": "🦵", "focusSound": "l", "anchor": "lion", "audio": "" },
      { "word": "swing", "icon": "🛝", "focusSound": "s", "anchor": "swing", "audio": "" },
      { "word": "slide", "icon": "🛝", "focusSound": "s", "anchor": "swing", "audio": "" },
      { "word": "tree", "icon": "🌳", "focusSound": "t", "anchor": "tree", "audio": "" },
      { "word": "tall", "icon": "🦒", "focusSound": "t", "anchor": "tree", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "fun-with-my-friend",
      "title": "Fun with my friend",
      "title_vi": "Vui chơi cùng bạn",
      "text": "This is my friend Tom. We are at the park with a big tree. We like the slide and the swing. Tom likes giraffes. They're tall. I like monkeys. I don't like lions. Lions are big!",
      "questions": [
        { "id": "q1", "q_vi": "Tom là bạn của bạn nhỏ, đúng không?", "type": "truefalse", "answer": true, "audioText": "Tom is my friend." },
        { "id": "q2", "q_vi": "Tom thích con vật nào?", "type": "mcq", "choices": ["giraffes", "lions", "monkeys"], "answer": 0, "audioText": "What does Tom like?" },
        { "id": "q3", "q_vi": "Hươu cao cổ thế nào?", "type": "mcq", "choices": ["tall", "big", "long"], "answer": 0, "audioText": "They're tall." },
        { "id": "q4", "q_vi": "Bạn nhỏ KHÔNG thích con vật nào?", "type": "mcq", "choices": ["lions", "monkeys", "giraffes"], "answer": 0, "audioText": "I don't like lions." }
      ]
    }
  ],
  "speaking": [
    {
      "id": "my-friend-and-animals",
      "title_vi": "Bạn của em và con vật em thích",
      "prompt_vi": "Em hãy giới thiệu một người bạn, rồi nói một con vật em THÍCH và một con vật em KHÔNG thích.",
      "sentenceFrames": [
        "This is my friend ___.",
        "I like ___.",
        "I don't like ___."
      ],
      "audioModels": [
        "This is my friend Tom.",
        "I like monkeys.",
        "I don't like lions."
      ]
    },
    {
      "id": "describe-animals",
      "title_vi": "Tả con vật",
      "prompt_vi": "Em hãy chọn vài con vật rồi tả chúng. Em có thể dùng \"They're…\" để khỏi nhắc lại tên con vật.",
      "sentenceFrames": [
        "___ are ___.",
        "The ___ is ___.",
        "They're ___."
      ],
      "audioModels": [
        "Giraffes are tall.",
        "The elephant is big.",
        "They're long."
      ]
    }
  ],
  "audioNotes": "Nên thu âm người thật cho: các câu mẫu phần speaking (\"This is my friend Tom.\", \"I like monkeys.\", \"I don't like lions.\", \"Giraffes are tall.\", \"The elephant is big.\", \"They're long.\"); audioText các câu hỏi reading (chú ý \"They're tall.\"); và mẫu phonics initial /l/ (lion, leg), /s/ (swing, slide), /t/ (tree, tall) vì TTS hay đọc lẫn tên chữ cái. Các câu mẫu grammar \"I don't like…\" và \"Elephants are big.\" / \"They're tall.\" cũng nên có audio chuẩn để bé bắt chước ngữ điệu (chú ý liền âm \"don't like\", \"They're\" và trọng âm tính từ)."
};
  C["level1/lesson05.json"] = {
  "schemaVersion": "v1",
  "level": 1,
  "unit": 105,
  "lesson": 5,
  "sourceUnits": ["unit12.json", "unit09.json", "unit14.json", "unit15.json"],
  "topic": "Eating and exploring",
  "topic_vi": "Ăn uống & khám phá",
  "vocab": [
    { "word": "rice", "vi": "cơm (gạo)", "icon": "🍚", "example": "I like rice.", "partOfSpeech": "noun", "audio": "" },
    { "word": "fish", "vi": "cá", "icon": "🐟", "example": "I like fish.", "partOfSpeech": "noun", "audio": "" },
    { "word": "milk", "vi": "sữa", "icon": "🥛", "example": "I like milk.", "partOfSpeech": "noun", "audio": "" },
    { "word": "juice", "vi": "nước ép", "icon": "🧃", "example": "I like juice.", "partOfSpeech": "noun", "audio": "" },
    { "word": "sandwich", "vi": "bánh mì kẹp", "icon": "🥪", "example": "I've got a sandwich.", "partOfSpeech": "noun", "audio": "" },
    { "word": "apple", "vi": "quả táo", "icon": "🍎", "example": "I've got an apple.", "partOfSpeech": "noun", "audio": "" },
    { "word": "egg", "vi": "quả trứng", "icon": "🥚", "example": "I've got an egg.", "partOfSpeech": "noun", "audio": "" },
    { "word": "banana", "vi": "quả chuối", "icon": "🍌", "example": "I've got a banana.", "partOfSpeech": "noun", "audio": "" },
    { "word": "swim", "vi": "bơi", "icon": "🏊", "example": "I can swim.", "partOfSpeech": "verb", "audio": "" },
    { "word": "jump", "vi": "nhảy lên", "icon": "🦘", "example": "I can jump.", "partOfSpeech": "verb", "audio": "" },
    { "word": "sea", "vi": "biển", "icon": "🌊", "example": "Look at the sea.", "partOfSpeech": "noun", "audio": "" },
    { "word": "shell", "vi": "vỏ sò", "icon": "🐚", "example": "It's a shell.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "like-and-do-you-like",
      "title_vi": "Ôn \"I like…\" (đã học ở Bài 4) và học hỏi \"Do you like…?\" (MỚI)",
      "explain_vi": "ÔN: \"I like…\" (nói món em thích) em đã học ở Bài 4, ở đây ta dùng lại với các món ăn. MỚI: hỏi xem bạn có thích món đó không thì nói \"Do you like…?\". Nếu thích, trả lời \"Yes, I do.\"; nếu không thích, trả lời \"No, I don't.\".",
      "examples": [
        "I like rice.",
        "I like fish.",
        "Do you like milk? Yes, I do.",
        "Do you like juice? No, I don't."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "i-like-food", "text": "I like {food}.", "blanks": ["food"], "context_vi": "Nói tên món em thích.", "audioText": "I like rice." },
          { "id": "question-do-you-like", "text": "Do you like {food}?", "blanks": ["food"], "context_vi": "Hỏi xem bạn có thích món này không.", "audioText": "Do you like milk?" },
          { "id": "answer-yes", "text": "Yes, I do.", "blanks": [], "context_vi": "Trả lời khi CÓ thích.", "audioText": "Yes, I do." },
          { "id": "answer-no", "text": "No, I don't.", "blanks": [], "context_vi": "Trả lời khi KHÔNG thích.", "audioText": "No, I don't." }
        ],
        "slots": {
          "food": ["rice", "fish", "milk", "juice", "apple", "egg", "banana"],
          "answer": ["Yes, I do.", "No, I don't."]
        },
        "answerKey": {
          "i-like-food": { "food": "food" },
          "question-do-you-like": { "food": "food" },
          "answer-pairs": { "Yes, I do.": "No, I don't.", "No, I don't.": "Yes, I do." }
        },
        "distractors": [
          "I likes rice.",
          "I like.",
          "Yes, I don't.",
          "No, I do.",
          "Do you likes fish?",
          "You like fish?"
        ],
        "irregulars": {}
      }
    },
    {
      "id": "ive-got-a-an",
      "title_vi": "Học nói \"I've got…\" (MỚI), mở rộng \"a/an\" (đã học ở Bài 1)",
      "explain_vi": "MỚI: nói em CÓ một món thì dùng \"I've got…\" rồi nói tên món (\"I've got\" là cách viết gọn của \"I have got\"). ÔN & mở rộng: cách chọn \"a\" hay \"an\" em đã học ở Bài 1 — trước từ bắt đầu bằng nguyên âm (a, e, i, o, u) dùng \"an\" (an apple, an egg); các từ còn lại dùng \"a\" (a sandwich, a banana).",
      "examples": [
        "I've got a sandwich.",
        "I've got an apple.",
        "I've got an egg.",
        "I've got a banana."
      ],
      "generators": ["fill_blank", "mcq"],
      "safeZone": {
        "templates": [
          { "id": "i-have-got", "text": "I've got {art} {noun}.", "blanks": ["art"], "context_vi": "Nói em CÓ một món, chọn \"a\" hoặc \"an\" cho đúng.", "audioText": "I've got an apple." },
          { "id": "choose-article-food", "text": "I've got {art} {noun}.", "blanks": ["art"], "context_vi": "Chọn \"a\" hoặc \"an\" cho đúng với từ đứng sau (an apple, an egg, a banana).", "audioText": "I've got an egg." }
        ],
        "slots": {
          "art": ["a", "an"],
          "noun": ["sandwich", "apple", "egg", "banana"]
        },
        "answerKey": {
          "i-have-got": {
            "art": { "sandwich": "a", "apple": "an", "egg": "an", "banana": "a" }
          },
          "choose-article-food": {
            "art": { "sandwich": "a", "apple": "an", "egg": "an", "banana": "a" }
          }
        },
        "distractors": [
          "I've got a apple.",
          "I've got a egg.",
          "I've got an sandwich.",
          "I've got an banana.",
          "I've got sandwich.",
          "I got an apple."
        ],
        "irregulars": {}
      }
    }
  ],
  "recognition": [
    {
      "id": "meet-can-cannot",
      "title_vi": "Làm quen: can / can't",
      "explain_vi": "Phần này chỉ để LÀM QUEN (nghe và chọn), em CHƯA cần tự đặt câu. Khi nghe \"can\" nghĩa là LÀM ĐƯỢC; nghe \"can't\" nghĩa là KHÔNG làm được. Em chỉ cần nghe câu mẫu rồi chọn đúng hình hoặc đúng ý.",
      "examples": [
        "I can swim.",
        "I can jump.",
        "I can't swim."
      ],
      "generators": ["listen_choose", "mcq"],
      "items": [
        { "id": "rec-can-swim", "audioText": "I can swim.", "meaning_vi": "Bạn nhỏ BƠI ĐƯỢC.", "choices_vi": ["Làm được", "Không làm được"], "answer": 0 },
        { "id": "rec-can-jump", "audioText": "I can jump.", "meaning_vi": "Bạn nhỏ NHẢY ĐƯỢC.", "choices_vi": ["Làm được", "Không làm được"], "answer": 0 },
        { "id": "rec-cannot-swim", "audioText": "I can't swim.", "meaning_vi": "Bạn nhỏ KHÔNG bơi được.", "choices_vi": ["Làm được", "Không làm được"], "answer": 1 }
      ]
    }
  ],
  "phonics": {
    "position": "mixed",
    "focus": ["i", "u", "th"],
    "soundLabels": {
      "i": { "ipa": "/ɪ/", "anchor": "pig", "position": "medial", "say_vi": "âm /ɪ/ ngắn ở GIỮA từ, như trong \"pig\" (không đọc tên chữ \"ai\")" },
      "u": { "ipa": "/ʌ/", "anchor": "sun", "position": "medial", "say_vi": "âm /ʌ/ ngắn ở GIỮA từ, như trong \"sun\" (miệng thả lỏng, đọc nhanh)" },
      "th": { "ipa": "/θ/", "anchor": "three", "position": "initial", "say_vi": "âm /θ/ ở ĐẦU từ — đặt đầu lưỡi giữa hai hàm răng rồi thổi nhẹ, như đầu từ \"three\" (không đọc thành \"t\" hay \"s\")" }
    },
    "words": [
      { "word": "fish", "icon": "🐟", "focusSound": "i", "anchor": "pig", "position": "medial", "audio": "" },
      { "word": "pig", "icon": "🐷", "focusSound": "i", "anchor": "pig", "position": "medial", "audio": "" },
      { "word": "sun", "icon": "☀️", "focusSound": "u", "anchor": "sun", "position": "medial", "audio": "" },
      { "word": "cup", "icon": "🥤", "focusSound": "u", "anchor": "sun", "position": "medial", "audio": "" },
      { "word": "duck", "icon": "🦆", "focusSound": "u", "anchor": "sun", "position": "medial", "audio": "" },
      { "word": "three", "icon": "3️⃣", "focusSound": "th", "anchor": "three", "position": "initial", "audio": "" },
      { "word": "thin", "icon": "📏", "focusSound": "th", "anchor": "three", "position": "initial", "audio": "" },
      { "word": "think", "icon": "💭", "focusSound": "th", "anchor": "three", "position": "initial", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "lunch-at-the-sea",
      "title": "Lunch at the sea",
      "title_vi": "Bữa trưa bên biển",
      "text": "Look at the sea! This is my lunch. I've got a sandwich and an apple. I like fish and rice. I don't like milk, but I like juice. I can swim and I can jump. Look, a shell by the sea!",
      "questions": [
        { "id": "q1", "q_vi": "Bạn nhỏ thích cá, đúng không?", "type": "truefalse", "answer": true, "audioText": "Do you like fish?" },
        { "id": "q2", "q_vi": "Bạn nhỏ KHÔNG thích món nào?", "type": "mcq", "choices": ["milk", "juice", "rice"], "answer": 0, "audioText": "What don't you like?" },
        { "id": "q3", "q_vi": "Bạn nhỏ làm được việc gì?", "type": "mcq", "choices": ["swim", "fly", "sing"], "answer": 0, "audioText": "What can the child do?" },
        { "id": "q4", "q_vi": "Bạn nhỏ tìm thấy gì bên biển?", "type": "mcq", "choices": ["a shell", "a fish", "a boat"], "answer": 0, "audioText": "What is by the sea?" }
      ]
    }
  ],
  "speaking": [
    {
      "id": "talk-about-food-i-like",
      "title_vi": "Em nói về món ăn em thích",
      "prompt_vi": "Nói món em thích và món em KHÔNG thích, rồi hỏi một người bạn xem bạn có thích món đó không.",
      "sentenceFrames": [
        "I like ___.",
        "I don't like ___.",
        "Do you like ___?"
      ],
      "audioModels": [
        "I like rice.",
        "I don't like milk.",
        "Do you like fish?"
      ]
    },
    {
      "id": "talk-about-what-i-have-got",
      "title_vi": "Em nói món em có trong hộp cơm",
      "prompt_vi": "Nói những món em CÓ trong hộp cơm, nhớ chọn \"a\" hay \"an\" cho đúng.",
      "sentenceFrames": [
        "I've got a ___.",
        "I've got an ___."
      ],
      "audioModels": [
        "I've got a sandwich.",
        "I've got an apple.",
        "I've got an egg.",
        "I've got a banana."
      ]
    }
  ],
  "audioNotes": "Cần thu âm người thật cho: các audioModels phần speaking; audioText câu hỏi reading; audioText các item phần recognition (\"I can swim. / I can jump. / I can't swim.\"); và đặc biệt nhóm phonics /θ/ (three, thin, think) vì TTS hay đọc nhầm \"th\" thành \"t\" hoặc \"s\" — nhớ đặt đầu lưỡi giữa hai hàm răng rồi thổi nhẹ. Hai âm nguyên âm ngắn /ɪ/ (fish, pig) và /ʌ/ (sun, cup, duck) ở GIỮA từ cũng nên có audio chuẩn để bé phân biệt với âm dài. Câu mẫu MỚI \"Do you like…? Yes, I do. / No, I don't.\" và \"I've got a/an…\" nên có audio để bé bắt chước ngữ điệu câu hỏi. Lưu ý can/can't ở bài này chỉ ở mức LÀM QUEN (nghe-chọn), audio cần đọc rõ phần phủ định \"can't\" để bé phân biệt với \"can\". Ghi chú recycling: các từ \"apple\", \"egg\", \"fish\" và mẫu \"a/an\", \"I like\" được dùng lại có chủ đích (apple/egg ở Bài 1, I like ở Bài 4) nhằm ôn tập, không phải từ/mẫu mới."
};
  C["level2/index.json"] = {
  "schemaVersion": "v1",
  "level": 2,
  "units": [],
  "lessons": [
    { "lesson": 1, "unit": 201, "file": "lesson01.json", "topic_vi": "Trường lớp & thời gian biểu", "icon": "🕐", "pal": "sun",   "sub": "Thói quen · thời gian · ngôi thứ 3 (+s)" },
    { "lesson": 2, "unit": 202, "file": "lesson02.json", "topic_vi": "Sở thích & việc đang làm",     "icon": "🎨", "pal": "sky",   "sub": "Đang làm gì (V-ing) · like/love" },
    { "lesson": 3, "unit": 203, "file": "lesson03.json", "topic_vi": "Đồ ăn & số lượng",             "icon": "🍞", "pal": "mint",  "sub": "some/any · How many?" },
    { "lesson": 4, "unit": 204, "file": "lesson04.json", "topic_vi": "Nơi chốn & chỉ đường",         "icon": "🧭", "pal": "coral", "sub": "in/on/under · there is/are · chỉ đường" },
    { "lesson": 5, "unit": 205, "file": "lesson05.json", "topic_vi": "Kể chuyện & quá khứ đơn",      "icon": "📅", "pal": "grape", "sub": "was/were · -ed · kể chuyện" }
  ]
};
  C["level2/lesson01.json"] = {
  "schemaVersion": "v1",
  "level": 2,
  "unit": 201,
  "lesson": 1,
  "topic": "School and my timetable",
  "topic_vi": "Trường lớp & thời gian biểu",
  "vocab": [
    { "word": "get up", "vi": "thức dậy", "icon": "🛌", "example": "I get up at six.", "partOfSpeech": "verb", "audio": "" },
    { "word": "have breakfast", "vi": "ăn sáng", "icon": "🥣", "example": "I have breakfast at seven.", "partOfSpeech": "verb", "audio": "" },
    { "word": "go to school", "vi": "đi học", "icon": "🏫", "example": "I go to school in the morning.", "partOfSpeech": "verb", "audio": "" },
    { "word": "read", "vi": "đọc sách", "icon": "📖", "example": "She reads a book at school.", "partOfSpeech": "verb", "audio": "" },
    { "word": "play", "vi": "chơi", "icon": "⚽", "example": "We play in the afternoon.", "partOfSpeech": "verb", "audio": "" },
    { "word": "eat lunch", "vi": "ăn trưa", "icon": "🍱", "example": "He eats lunch at twelve.", "partOfSpeech": "verb", "audio": "" },
    { "word": "do homework", "vi": "làm bài tập", "icon": "📝", "example": "I do my homework in the evening.", "partOfSpeech": "verb", "audio": "" },
    { "word": "go to bed", "vi": "đi ngủ", "icon": "🌙", "example": "He goes to bed at nine.", "partOfSpeech": "verb", "audio": "" },
    { "word": "sleep", "vi": "ngủ", "icon": "😴", "example": "The cat sleeps at night.", "partOfSpeech": "verb", "audio": "" },
    { "word": "morning", "vi": "buổi sáng", "icon": "🌅", "example": "I go to school in the morning.", "partOfSpeech": "noun", "audio": "" },
    { "word": "afternoon", "vi": "buổi chiều", "icon": "🌇", "example": "We play in the afternoon.", "partOfSpeech": "noun", "audio": "" },
    { "word": "evening", "vi": "buổi tối", "icon": "🌃", "example": "She reads in the evening.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "present-simple-routine",
      "title_vi": "Nói về thói quen hằng ngày: thêm \"s\" với he / she / it",
      "explain_vi": "Khi nói về việc em làm mỗi ngày, dùng động từ thường: \"I get up\", \"We play\", \"You read\". Nhưng khi nói về MỘT người khác (he = bạn ấy nam, she = bạn ấy nữ, it = nó), em thêm \"s\" vào sau động từ: \"He reads\", \"She plays\". Hai động từ đặc biệt: \"go\" thành \"goes\", \"have\" thành \"has\".",
      "examples": [
        "I read a book.",
        "He reads a book.",
        "She goes to school.",
        "I play football."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "i-verb", "text": "I {verbPhrase}.", "blanks": ["verbPhrase"], "context_vi": "Em nói về việc EM làm mỗi ngày. Sau \"I\" giữ nguyên động từ.", "audioText": "I get up early." },
          { "id": "he-verb-s", "text": "He {verbsPhrase}.", "blanks": ["verbsPhrase"], "context_vi": "Nói về việc bạn ấy (nam) làm. Sau \"He\" động từ phải thêm s/es.", "audioText": "He reads a book." },
          { "id": "she-verb-s", "text": "She {verbsPhrase}.", "blanks": ["verbsPhrase"], "context_vi": "Nói về việc bạn ấy (nữ) làm. Sau \"She\" động từ phải thêm s/es.", "audioText": "She goes to school." }
        ],
        "slots": {
          "verbPhrase": ["get up early", "read a book", "play football", "go to school"],
          "verbsPhrase": ["gets up early", "reads a book", "plays football", "goes to school"]
        },
        "answerKey": {},
        "distractors": [
          "He read a book.",
          "She go to school.",
          "He goe to school.",
          "I reads a book.",
          "She play football.",
          "He get up early."
        ],
        "irregulars": {
          "go": "goes",
          "have": "has"
        }
      }
    },
    {
      "id": "prepositions-time",
      "title_vi": "Giới từ thời gian: at / in / on",
      "explain_vi": "Để nói KHI NÀO làm việc gì, em dùng ba từ nhỏ. Dùng \"at\" với giờ: \"at six\", \"at night\". Dùng \"in\" với buổi trong ngày: \"in the morning\", \"in the afternoon\", \"in the evening\". Dùng \"on\" với thứ trong tuần: \"on Monday\".",
      "examples": [
        "I get up at six.",
        "She reads in the evening.",
        "We go to school on Monday."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "at-time", "text": "I get up {prep} {time}.", "blanks": ["prep"], "context_vi": "Nói giờ làm việc gì. Trước GIỜ dùng \"at\".", "audioText": "I get up at six." },
          { "id": "in-part", "text": "She reads {prep} {part}.", "blanks": ["prep"], "context_vi": "Nói buổi trong ngày. Trước \"the morning / afternoon / evening\" dùng \"in\".", "audioText": "She reads in the evening." },
          { "id": "on-day", "text": "We go to school {prep} {day}.", "blanks": ["prep"], "context_vi": "Nói thứ trong tuần. Trước tên thứ dùng \"on\".", "audioText": "We go to school on Monday." }
        ],
        "slots": {
          "prep": ["at", "in", "on"],
          "time": ["six", "seven", "eight", "night"],
          "part": ["the morning", "the afternoon", "the evening"],
          "day": ["Monday", "Friday"]
        },
        "answerKey": {
          "at-time": {
            "prep": { "six": "at", "seven": "at", "eight": "at", "night": "at" }
          },
          "in-part": {
            "prep": { "the morning": "in", "the afternoon": "in", "the evening": "in" }
          },
          "on-day": {
            "prep": { "Monday": "on", "Friday": "on" }
          }
        },
        "distractors": [
          "I get up in six.",
          "She reads at the evening.",
          "We go to school in Monday.",
          "I get up on six.",
          "She reads on the morning.",
          "We go to school at Friday."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["sl", "st", "sk", "tr"],
    "soundLabels": {
      "sl": { "ipa": "/sl/", "anchor": "sleep", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"sleep\" là /sl/ — đọc liền hai âm s và l, không tách rời" },
      "st": { "ipa": "/st/", "anchor": "star", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"star\" là /st/ — đọc liền hai âm s và t" },
      "sk": { "ipa": "/sk/", "anchor": "sky", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"sky\" là /sk/ — đọc liền hai âm s và k" },
      "tr": { "ipa": "/tr/", "anchor": "train", "position": "initial", "say_vi": "âm BẮT ĐẦU từ \"train\" là /tr/ — đọc liền hai âm t và r" }
    },
    "words": [
      { "word": "sleep", "icon": "😴", "focusSound": "sl", "anchor": "sleep", "position": "initial", "audio": "" },
      { "word": "slide", "icon": "🛝", "focusSound": "sl", "anchor": "sleep", "position": "initial", "audio": "" },
      { "word": "star", "icon": "⭐", "focusSound": "st", "anchor": "star", "position": "initial", "audio": "" },
      { "word": "stop", "icon": "🛑", "focusSound": "st", "anchor": "star", "position": "initial", "audio": "" },
      { "word": "sky", "icon": "🌌", "focusSound": "sk", "anchor": "sky", "position": "initial", "audio": "" },
      { "word": "skate", "icon": "⛸️", "focusSound": "sk", "anchor": "sky", "position": "initial", "audio": "" },
      { "word": "train", "icon": "🚆", "focusSound": "tr", "anchor": "train", "position": "initial", "audio": "" },
      { "word": "tree", "icon": "🌳", "focusSound": "tr", "anchor": "train", "position": "initial", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "tom-every-day",
      "title": "Tom's day",
      "title_vi": "Một ngày của Tom",
      "text": "Tom gets up at six in the morning. He has breakfast and goes to school. At school, he reads books and plays with his friends. He eats lunch at twelve. In the afternoon, Tom goes home. He does his homework in the evening. Then he goes to bed at nine.",
      "teacherNote_vi": "Đoạn này ôn lại các động từ thói quen ở vocab và áp dụng đúng hai điểm ngữ pháp: present simple với \"he\" (gets, has, goes, reads, plays, eats, does) và giới từ thời gian (at six, in the morning, at twelve, in the afternoon, in the evening, at nine). Đoạn 8 câu (theo . ! ?), vừa ngưỡng 6-8.",
      "questions": [
        { "id": "q1", "q_vi": "Tom thức dậy lúc sáu giờ sáng, đúng không?", "type": "truefalse", "answer": true, "audioText": "Tom gets up at six in the morning." },
        { "id": "q2", "q_vi": "Ở trường, Tom làm gì?", "type": "mcq", "choices": ["He reads and plays.", "He sleeps.", "He has breakfast."], "answer": 0, "audioText": "What does Tom do at school?" },
        { "id": "q3", "q_vi": "Tom làm bài tập khi nào?", "type": "mcq", "choices": ["in the evening", "in the morning", "at school"], "answer": 0, "audioText": "When does Tom do his homework?" },
        { "id": "q4", "q_vi": "Tom đi ngủ lúc mười giờ, đúng không?", "type": "truefalse", "answer": false, "audioText": "Tom goes to bed at nine." }
      ]
    }
  ],
  "speaking": [
    {
      "id": "my-day",
      "title_vi": "Kể một ngày của em",
      "prompt_vi": "Em kể những việc em làm mỗi ngày và mấy giờ thì làm. Điền giờ và buổi thật của em vào chỗ trống nhé.",
      "sentenceFrames": [
        "I get up at ___.",
        "I go to school in the ___.",
        "I do my homework in the ___.",
        "I go to bed at ___."
      ],
      "audioModels": [
        "I get up at seven.",
        "I go to school in the morning.",
        "I do my homework in the evening.",
        "I go to bed at nine."
      ]
    },
    {
      "id": "my-friend-day",
      "title_vi": "Kể về một ngày của bạn em",
      "prompt_vi": "Bây giờ em kể về bạn của em. Nhớ thêm \"s\" vào động từ vì là \"he\" hoặc \"she\" nhé.",
      "sentenceFrames": [
        "He gets up at ___.",
        "She goes to school in the ___.",
        "He reads a book in the ___."
      ],
      "audioModels": [
        "He gets up at six.",
        "She goes to school in the morning.",
        "He reads a book in the evening."
      ]
    }
  ],
  "audioNotes": "Cần thu âm người thật cho: tất cả audioModels phần speaking và audioText câu hỏi reading. ĐẶC BIỆT phần phonics blend phụ âm đầu /sl/ (sleep, slide), /st/ (star, stop), /sk/ (sky, skate), /tr/ (train, tree) — loa phải đọc HAI âm LIỀN NHAU (không tách thành \"s\"+\"l\" hay \"t\"+\"r\" rời, và tuyệt đối không đọc tên chữ cái). Chỉ đọc TỪ TRỌN VẸN. Các câu mẫu ngữ pháp \"He reads a book.\", \"She goes to school.\" cần audio chuẩn để bé nghe rõ âm \"s\" cuối động từ (reads /z/, goes /z/) — TTS dễ nuốt mất. Câu giới từ \"I get up at six.\", \"She reads in the evening.\", \"We go to school on Monday.\" cũng nên có audio chuẩn để bé bắt chước nhịp câu."
};
  C["level2/lesson02.json"] = {
  "schemaVersion": "v1",
  "level": 2,
  "unit": 202,
  "lesson": 2,
  "topic": "Hobbies and what we are doing now",
  "topic_vi": "Sở thích & việc đang làm",
  "vocab": [
    { "word": "running", "vi": "(đang) chạy", "icon": "🏃", "example": "Look! She's running.", "partOfSpeech": "verb", "audio": "" },
    { "word": "jumping", "vi": "(đang) nhảy lên", "icon": "🤸", "example": "The boy is jumping.", "partOfSpeech": "verb", "audio": "" },
    { "word": "painting", "vi": "(đang) vẽ tô màu", "icon": "🎨", "example": "I'm painting a big sun.", "partOfSpeech": "verb", "audio": "" },
    { "word": "singing", "vi": "(đang) hát", "icon": "🎤", "example": "We're singing a happy song.", "partOfSpeech": "verb", "audio": "" },
    { "word": "dancing", "vi": "(đang) nhảy múa", "icon": "💃", "example": "She loves dancing.", "partOfSpeech": "verb", "audio": "" },
    { "word": "reading", "vi": "(đang) đọc sách", "icon": "📖", "example": "He's reading a book.", "partOfSpeech": "verb", "audio": "" },
    { "word": "playing", "vi": "(đang) chơi", "icon": "⚽", "example": "They're playing football.", "partOfSpeech": "verb", "audio": "" },
    { "word": "swimming", "vi": "(đang) bơi", "icon": "🏊", "example": "I like swimming.", "partOfSpeech": "verb", "audio": "" },
    { "word": "drawing", "vi": "(đang) vẽ hình", "icon": "✏️", "example": "She's drawing a cat.", "partOfSpeech": "verb", "audio": "" },
    { "word": "riding", "vi": "(đang) đạp/cưỡi", "icon": "🚲", "example": "He's riding a bike.", "partOfSpeech": "verb", "audio": "" },
    { "word": "clapping", "vi": "(đang) vỗ tay", "icon": "👏", "example": "We're clapping our hands.", "partOfSpeech": "verb", "audio": "" },
    { "word": "kicking", "vi": "(đang) đá (bóng)", "icon": "🦵", "example": "Tom is kicking the ball.", "partOfSpeech": "verb", "audio": "" }
  ],
  "grammar": [
    {
      "id": "present-continuous-now",
      "title_vi": "Việc ĐANG diễn ra: \"be + V-ing\" (am / is / are + động từ-ing)",
      "explain_vi": "Khi nói một việc ĐANG xảy ra ngay lúc này, em dùng \"am / is / are\" rồi thêm động từ có đuôi \"-ing\". Với \"I\" dùng \"am\" (I'm); với \"he / she / it\" dùng \"is\" (he's, she's, it's); với \"we / you / they\" dùng \"are\" (we're, they're). Ví dụ: \"I'm running.\", \"She's painting.\", \"They're playing.\". Muốn hỏi thì nói \"What are you doing?\" rồi trả lời \"I'm ...\".",
      "examples": [
        "I'm running.",
        "She's painting.",
        "They're playing.",
        "What are you doing? I'm reading."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "i-am-ving", "text": "I'm {ving}.", "blanks": ["ving"], "context_vi": "Tự nói việc EM đang làm ngay bây giờ.", "audioText": "I'm running." },
          { "id": "she-is-ving", "text": "She's {ving}.", "blanks": ["ving"], "context_vi": "Nói việc một bạn nữ đang làm.", "audioText": "She's painting." },
          { "id": "they-are-ving", "text": "They're {ving}.", "blanks": ["ving"], "context_vi": "Nói việc nhiều người đang làm.", "audioText": "They're playing." },
          { "id": "choose-be", "text": "{subj} {be} {ving}.", "blanks": ["be"], "context_vi": "Chọn đúng \"am / is / are\" theo chủ ngữ (I → am, She/He → is, We/They → are).", "audioText": "She is dancing." }
        ],
        "slots": {
          "ving": ["running", "jumping", "painting", "singing", "dancing", "reading", "playing", "swimming", "drawing", "clapping"],
          "subj": ["I", "She", "He", "We", "They"],
          "be": ["am", "is", "are"]
        },
        "answerKey": {
          "choose-be": {
            "be": { "__cond": "subj", "I": "am", "She": "is", "He": "is", "We": "are", "They": "are" }
          }
        },
        "distractors": [
          "I'm run.",
          "She're painting.",
          "She painting.",
          "They's playing.",
          "He are reading.",
          "I running.",
          "I is running.",
          "They is playing."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "like-love-ving",
      "title_vi": "Nói sở thích: \"like / love + V-ing\"",
      "explain_vi": "Để nói em THÍCH làm gì, dùng \"like\" rồi thêm động từ có đuôi \"-ing\": \"I like reading.\". Nếu rất thích thì dùng \"love\": \"I love dancing.\". Với \"he / she\" thêm \"s\" vào like/love: \"She likes singing.\", \"He loves swimming.\".",
      "examples": [
        "I like reading.",
        "I love dancing.",
        "She likes singing.",
        "He loves swimming."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "i-like-ving", "text": "I {verb} {ving}.", "blanks": ["ving"], "context_vi": "Nói một việc EM thích làm.", "audioText": "I like reading." },
          { "id": "i-love-ving", "text": "I love {ving}.", "blanks": ["ving"], "context_vi": "Nói một việc EM rất thích.", "audioText": "I love dancing." },
          { "id": "she-likes-ving", "text": "She {verb3} {ving}.", "blanks": ["verb3"], "context_vi": "Chọn đúng dạng \"likes / loves\" cho \"she\".", "audioText": "She likes singing." }
        ],
        "slots": {
          "verb": ["like", "love"],
          "verb3": ["likes", "loves"],
          "ving": ["reading", "dancing", "singing", "swimming", "painting", "drawing", "running", "playing", "jumping", "clapping", "kicking"]
        },
        "answerKey": {},
        "distractors": [
          "I like read.",
          "She like singing.",
          "I likes dancing.",
          "She likes sing.",
          "I love to dancing.",
          "He love swimming."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "medial",
    "focus": ["ee", "oo", "dr"],
    "soundLabels": {
      "ee": { "ipa": "/iː/", "anchor": "green", "position": "medial", "say_vi": "âm dài Ở GIỮA từ \"green\" là /iː/ — kéo dài chữ \"i\" (không đọc nhanh như \"i\" ngắn)" },
      "oo": { "ipa": "/uː/", "anchor": "moon", "position": "medial", "say_vi": "âm dài Ở GIỮA từ \"moon\" là /uː/ — kéo dài chữ \"u\" (môi tròn, đọc dài)" },
      "dr": { "ipa": "/dr/", "anchor": "drum", "position": "initial", "say_vi": "âm GHÉP BẮT ĐẦU từ \"drum\" là /dr/ (đọc liền hai âm d và r, không tách rời)" }
    },
    "words": [
      { "word": "green", "icon": "🟢", "focusSound": "ee", "anchor": "green", "position": "medial", "audio": "" },
      { "word": "tree", "icon": "🌳", "focusSound": "ee", "anchor": "green", "position": "medial", "audio": "" },
      { "word": "feet", "icon": "🦶", "focusSound": "ee", "anchor": "green", "position": "medial", "audio": "" },
      { "word": "moon", "icon": "🌙", "focusSound": "oo", "anchor": "moon", "position": "medial", "audio": "" },
      { "word": "zoo", "icon": "🦁", "focusSound": "oo", "anchor": "moon", "position": "medial", "audio": "" },
      { "word": "food", "icon": "🍲", "focusSound": "oo", "anchor": "moon", "position": "medial", "audio": "" },
      { "word": "drum", "icon": "🥁", "focusSound": "dr", "anchor": "drum", "position": "initial", "audio": "" },
      { "word": "draw", "icon": "✏️", "focusSound": "dr", "anchor": "drum", "position": "initial", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "in-the-park-today",
      "title": "In the park today",
      "title_vi": "Ở công viên hôm nay",
      "text": "It's a sunny day. We are in the park. My brother is playing football with his friends. My sister is riding her bike. Mum is reading a book under a tree. I'm drawing a big green star. I love drawing! Everyone is happy today.",
      "teacherNote_vi": "Đoạn dùng present continuous (be + V-ing) cho việc đang diễn ra và một câu \"I love drawing!\" cho sở thích. Từ vựng controlled: playing, riding, reading, drawing đều có trong vocab; \"green\", \"tree\" và \"drawing\" nối với phần phonics (âm dài /iː/ trong green/tree và cụm /dr/ trong drawing). Đoạn gồm 8 câu (theo . ! ?), vừa ngưỡng 6-8.",
      "questions": [
        { "id": "q1", "q_vi": "Hôm nay trời nắng, đúng không?", "type": "truefalse", "answer": true, "audioText": "It's a sunny day." },
        { "id": "q2", "q_vi": "Anh trai đang làm gì?", "type": "mcq", "choices": ["playing football", "reading a book", "riding a bike"], "answer": 0, "audioText": "What is the brother doing?" },
        { "id": "q3", "q_vi": "Mẹ đang làm gì?", "type": "mcq", "choices": ["drawing a star", "reading a book", "riding a bike"], "answer": 1, "audioText": "What is Mum doing?" },
        { "id": "q4", "q_vi": "Bạn nhỏ (người kể) thích làm gì?", "type": "mcq", "choices": ["drawing", "swimming", "singing"], "answer": 0, "audioText": "What does the child love?" }
      ]
    }
  ],
  "speaking": [
    {
      "id": "what-are-you-doing",
      "title_vi": "Nói việc em đang làm",
      "prompt_vi": "Làm động tác (giả vờ chạy, vẽ, hát...) rồi tự hỏi và trả lời. Em hãy nói thật về việc em đang làm nhé.",
      "sentenceFrames": [
        "What are you doing?",
        "I'm ___.",
        "She's ___."
      ],
      "audioModels": [
        "What are you doing? I'm running.",
        "She's painting.",
        "They're playing."
      ]
    },
    {
      "id": "i-like-i-love",
      "title_vi": "Nói sở thích của em",
      "prompt_vi": "Nói cho cô và các bạn biết em thích và rất thích làm gì. Điền hoạt động em thật sự thích vào chỗ trống.",
      "sentenceFrames": [
        "I like ___.",
        "I love ___.",
        "My friend likes ___."
      ],
      "audioModels": [
        "I like reading.",
        "I love dancing.",
        "My friend likes swimming."
      ]
    }
  ],
  "audioNotes": "Nên thu âm người thật cho: audioModels phần speaking và audioText câu hỏi reading. ĐẶC BIỆT phonics lần này tập trung NGUYÊN ÂM DÀI Ở GIỮA: green, tree, feet (ee /iː/) và moon, zoo, food (oo /uː/) — TTS hay đọc thành nguyên âm NGẮN; loa phải kéo dài rõ /iː/, /uː/. Cụm phụ âm đầu /dr/ trong drum, draw cần đọc liền hai âm d-r, không chèn nguyên âm (tránh \"đơ-ram\"). Các động từ -ing (running, singing, swimming, drawing, clapping) cần đọc rõ đuôi /ɪŋ/. Hai câu mẫu grammar \"What are you doing? I'm running.\" và \"I love dancing.\" nên có audio chuẩn để bé bắt chước ngữ điệu câu hỏi và câu nói sở thích. Lưu ý phonics dùng position hỗn hợp: ee/oo là MEDIAL, dr là INITIAL (đã ghi position riêng ở từng từ)."
};
  C["level2/lesson03.json"] = {
  "schemaVersion": "v1",
  "level": 2,
  "unit": 203,
  "lesson": 3,
  "topic": "Food and how much",
  "topic_vi": "Đồ ăn & số lượng",
  "vocab": [
    { "word": "cheese", "vi": "phô mai", "icon": "🧀", "example": "There is some cheese.", "partOfSpeech": "noun", "audio": "" },
    { "word": "water", "vi": "nước (uống)", "icon": "💧", "example": "There is some water.", "partOfSpeech": "noun", "audio": "" },
    { "word": "banana", "vi": "quả chuối", "icon": "🍌", "example": "It's a banana.", "partOfSpeech": "noun", "audio": "" },
    { "word": "egg", "vi": "quả trứng", "icon": "🥚", "example": "It's an egg.", "partOfSpeech": "noun", "audio": "" },
    { "word": "tomato", "vi": "quả cà chua", "icon": "🍅", "example": "It's a tomato.", "partOfSpeech": "noun", "audio": "" },
    { "word": "grapes", "vi": "(chùm) nho", "icon": "🍇", "example": "There are some grapes.", "partOfSpeech": "noun", "audio": "" },
    { "word": "sandwich", "vi": "bánh mì kẹp", "icon": "🥪", "example": "It's a sandwich.", "partOfSpeech": "noun", "audio": "" },
    { "word": "biscuit", "vi": "bánh quy", "icon": "🍪", "example": "It's a biscuit.", "partOfSpeech": "noun", "audio": "" },
    { "word": "soup", "vi": "súp (canh)", "icon": "🍲", "example": "There is some soup.", "partOfSpeech": "noun", "audio": "" },
    { "word": "orange", "vi": "quả cam", "icon": "🍊", "example": "It's an orange.", "partOfSpeech": "noun", "audio": "" },
    { "word": "cake", "vi": "bánh ngọt", "icon": "🍰", "example": "There is some cake.", "partOfSpeech": "noun", "audio": "" },
    { "word": "plate", "vi": "cái đĩa", "icon": "🍽️", "example": "There is a plate.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "some-any",
      "title_vi": "\"some\" và \"any\" (có một ít / không có chút nào)",
      "explain_vi": "Khi nói có MỘT ÍT thứ gì đó mà không nói rõ số lượng, em dùng \"some\" trong câu khẳng định: \"There is some cheese.\". Khi nói KHÔNG có chút nào, em dùng \"any\" trong câu phủ định: \"There isn't any cheese.\". Mẹo nhỏ: câu CÓ thì dùng \"some\", câu KHÔNG thì dùng \"any\".",
      "examples": [
        "There is some water.",
        "There isn't any water.",
        "There are some grapes.",
        "There aren't any grapes."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "there-is-some", "text": "There is {quant} {food}.", "blanks": ["quant"], "context_vi": "Câu CÓ: trên bàn có một ít món này. Chọn từ chỉ số lượng cho đúng.", "audioText": "There is some cheese." },
          { "id": "there-isnt-any", "text": "There isn't {quant} {food}.", "blanks": ["quant"], "context_vi": "Câu KHÔNG: không có chút nào của món này. Chọn từ chỉ số lượng cho đúng.", "audioText": "There isn't any cheese." }
        ],
        "slots": {
          "quant": ["some", "any"],
          "food": ["cheese", "water", "soup", "cake"]
        },
        "answerKey": {
          "there-is-some": { "quant": "some" },
          "there-isnt-any": { "quant": "any" }
        },
        "distractors": [
          "There is any cheese.",
          "There isn't some cheese.",
          "There are some cheese.",
          "There is some a cheese.",
          "There is any cake."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "how-many",
      "title_vi": "Hỏi số lượng: \"How many...?\" và trả lời bằng số",
      "explain_vi": "Để hỏi CÓ BAO NHIÊU cái, em dùng \"How many\" + tên đồ vật ở dạng số nhiều + \"are there?\". Ví dụ: \"How many bananas are there?\". Em trả lời bắt đầu bằng \"There are\" rồi nói SỐ và tên đồ vật, ví dụ \"There are four bananas.\". Nếu chỉ có một cái thì nói \"There is one banana.\".",
      "examples": [
        "How many bananas are there? There are four bananas.",
        "How many eggs are there? There are six eggs.",
        "How many tomatoes are there? There are two tomatoes."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "how-many-question", "text": "How many {countfood} are there?", "blanks": ["countfood"], "context_vi": "Hỏi xem có bao nhiêu món này (chọn danh từ dạng SỐ NHIỀU cho đúng).", "audioText": "How many bananas are there?" },
          { "id": "there-are-number", "text": "There are {number} {countfood}.", "blanks": ["countfood"], "context_vi": "Câu trả lời. Chọn danh từ dạng SỐ NHIỀU cho đúng (số do tranh quyết định, mọi số đều đúng ngữ pháp).", "audioText": "There are four bananas." }
        ],
        "slots": {
          "countfood": ["bananas", "eggs", "tomatoes", "oranges", "sandwiches", "biscuits"],
          "number": ["two", "three", "four", "five", "six"]
        },
        "answerKey": {},
        "teacherNote_vi": "Cả hai slot 'countfood' và 'number' là slot TỰ DO: mọi danh từ số nhiều và mọi số trong slots đều cho câu ĐÚNG NGỮ PHÁP, nên không cần answerKey. fill_blank chỉ nhắm slot 'countfood' (khai báo trong blanks) — KHÔNG hỏi 'number' vì số thật phụ thuộc tranh/ngữ cảnh không có trong text.",
        "distractors": [
          "How many banana are there?",
          "How much bananas are there?",
          "There is four bananas.",
          "There are four banana.",
          "How many bananas there are?"
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "mixed",
    "focus": ["gr", "br", "fr", "ee", "oo"],
    "soundLabels": {
      "gr": { "ipa": "/gr/", "anchor": "grapes", "position": "initial", "say_vi": "âm ghép ĐẦU từ \"grapes\" là /gr/ (đọc liền /g/ và /r/, không tách rời)" },
      "br": { "ipa": "/br/", "anchor": "bread", "position": "initial", "say_vi": "âm ghép ĐẦU từ \"bread\" là /br/ (đọc liền /b/ và /r/)" },
      "fr": { "ipa": "/fr/", "anchor": "fruit", "position": "initial", "say_vi": "âm ghép ĐẦU từ \"fruit\" là /fr/ (đọc liền /f/ và /r/)" },
      "ee": { "ipa": "/iː/", "anchor": "cheese", "position": "medial", "say_vi": "nguyên âm DÀI ở GIỮA từ \"cheese\" là /iː/ — kéo dài âm \"i\", không đọc ngắn" },
      "oo": { "ipa": "/uː/", "anchor": "spoon", "position": "medial", "say_vi": "nguyên âm DÀI ở GIỮA từ \"spoon\" là /uː/ — kéo dài âm \"u\", không đọc ngắn" }
    },
    "words": [
      { "word": "grapes", "icon": "🍇", "focusSound": "gr", "anchor": "grapes", "position": "initial", "audio": "" },
      { "word": "green", "icon": "🟢", "focusSound": "gr", "anchor": "grapes", "position": "initial", "audio": "" },
      { "word": "bread", "icon": "🍞", "focusSound": "br", "anchor": "bread", "position": "initial", "audio": "" },
      { "word": "fruit", "icon": "🍓", "focusSound": "fr", "anchor": "fruit", "position": "initial", "audio": "" },
      { "word": "cheese", "icon": "🧀", "focusSound": "ee", "anchor": "cheese", "position": "medial", "audio": "" },
      { "word": "sweet", "icon": "🍬", "focusSound": "ee", "anchor": "cheese", "position": "medial", "audio": "" },
      { "word": "spoon", "icon": "🥄", "focusSound": "oo", "anchor": "spoon", "position": "medial", "audio": "" },
      { "word": "food", "icon": "🍽️", "focusSound": "oo", "anchor": "spoon", "position": "medial", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "on-the-table",
      "title": "On the table",
      "title_vi": "Trên bàn ăn",
      "text": "Look at the table. There is some cheese and some bread. There is some water, too. There are three bananas and two eggs. There aren't any tomatoes. How many grapes are there? There are six grapes. Yum, I am happy!",
      "teacherNote_vi": "Đoạn 8 câu (tính theo . ! ?). Tích hợp đủ trọng tâm: \"some\" cho danh từ không đếm (cheese, bread, water) và danh từ đếm số nhiều (grapes); \"any\" trong câu phủ định (tomatoes); và \"How many ... are there? There are ...\" với số. Câu cuối \"I am happy.\" là phần ôn nhẹ từ Level 1.",
      "questions": [
        { "id": "q1", "q_vi": "Trên bàn có phô mai, đúng không?", "type": "truefalse", "answer": true, "audioText": "Is there any cheese on the table?" },
        { "id": "q2", "q_vi": "Trên bàn KHÔNG có món nào?", "type": "mcq", "choices": ["tomatoes", "bananas", "grapes"], "answer": 0, "audioText": "What isn't there on the table?" },
        { "id": "q3", "q_vi": "Có bao nhiêu quả chuối?", "type": "mcq", "choices": ["three", "two", "six"], "answer": 0, "audioText": "How many bananas are there?" },
        { "id": "q4", "q_vi": "Có bao nhiêu chùm nho?", "type": "mcq", "choices": ["six", "two", "three"], "answer": 0, "audioText": "How many grapes are there?" }
      ]
    }
  ],
  "speaking": [
    {
      "id": "what-is-on-my-plate",
      "title_vi": "Nói có gì trên đĩa của em",
      "prompt_vi": "Nhìn vào đĩa thức ăn (thật hoặc trong tranh) và nói có gì. Dùng \"some\" cho thứ có, và \"any\" khi không có thứ gì đó. Hãy nói về đồ ăn thật của em nhé.",
      "sentenceFrames": [
        "There is some ___.",
        "There are some ___.",
        "There isn't any ___."
      ],
      "audioModels": [
        "There is some cheese.",
        "There are some grapes.",
        "There isn't any soup."
      ]
    },
    {
      "id": "how-many-on-the-table",
      "title_vi": "Hỏi và đếm số lượng",
      "prompt_vi": "Cùng một bạn, hỏi xem có bao nhiêu món trên bàn rồi đếm và trả lời bằng số. Em hỏi, bạn trả lời, rồi đổi vai.",
      "sentenceFrames": [
        "How many ___ are there?",
        "There are ___ ___."
      ],
      "audioModels": [
        "How many eggs are there?",
        "There are two eggs."
      ]
    }
  ],
  "audioNotes": "Cần thu âm người thật cho: (1) audioModels phần speaking và audioText câu hỏi reading; (2) ĐẶC BIỆT các từ phonics — BLEND ĐẦU TỪ: grapes, green (/gr/), bread (/br/), fruit (/fr/); NGUYÊN ÂM DÀI Ở GIỮA: cheese, sweet (/iː/), spoon, food (/uː/). Với blend đầu, TTS dễ tách rời hai phụ âm hoặc chèn nguyên âm vào giữa (gơ-rếp, bơ-rét); loa PHẢI đọc liền hai phụ âm. Với nguyên âm dài /iː/, /uː/, TTS dễ đọc thành âm NGẮN (chít thay vì chiiz, sun thay vì suun); cần kéo dài nguyên âm cho đúng. Luôn đọc TỪ TRỌN VẸN, không đọc rời chữ cái. (3) Hai mẫu câu trọng tâm \"There is some cheese.\" / \"There isn't any cheese.\" và cặp hỏi-đáp \"How many bananas are there? There are four bananas.\" nên có audio chuẩn để bé bắt chước ngữ điệu câu hỏi và câu trả lời. Lưu ý phát âm số nhiều: \"tomatoes\", \"sandwiches\" có thêm âm /ɪz/ hoặc /z/ — thu âm chuẩn để bé nghe đúng đuôi."
};
  C["level2/lesson04.json"] = {
  "schemaVersion": "v1",
  "level": 2,
  "unit": 204,
  "lesson": 4,
  "topic": "Places and directions",
  "topic_vi": "Nơi chốn & chỉ đường",
  "vocab": [
    { "word": "bedroom", "vi": "phòng ngủ", "icon": "🛏️", "example": "There is a bed in my bedroom.", "partOfSpeech": "noun", "audio": "" },
    { "word": "table", "vi": "cái bàn", "icon": "🪑", "example": "The lamp is on the table.", "partOfSpeech": "noun", "audio": "" },
    { "word": "shelf", "vi": "cái kệ", "icon": "📚", "example": "There are five books on the shelf.", "partOfSpeech": "noun", "audio": "" },
    { "word": "box", "vi": "cái hộp", "icon": "📦", "example": "The cat is in the box.", "partOfSpeech": "noun", "audio": "" },
    { "word": "lamp", "vi": "cái đèn", "icon": "💡", "example": "The lamp is next to the bed.", "partOfSpeech": "noun", "audio": "" },
    { "word": "clock", "vi": "cái đồng hồ", "icon": "🕐", "example": "There is a clock on the wall.", "partOfSpeech": "noun", "audio": "" },
    { "word": "park", "vi": "công viên", "icon": "🌳", "example": "There are three trees in the park.", "partOfSpeech": "noun", "audio": "" },
    { "word": "shop", "vi": "cửa hàng", "icon": "🏪", "example": "The shop is next to the park.", "partOfSpeech": "noun", "audio": "" },
    { "word": "school", "vi": "trường học", "icon": "🏫", "example": "My school is behind the park.", "partOfSpeech": "noun", "audio": "" },
    { "word": "street", "vi": "con phố", "icon": "🛣️", "example": "There are two shops on my street.", "partOfSpeech": "noun", "audio": "" },
    { "word": "bridge", "vi": "cây cầu", "icon": "🌉", "example": "Go over the bridge.", "partOfSpeech": "noun", "audio": "" },
    { "word": "tree", "vi": "cái cây", "icon": "🌲", "example": "The bird is in the tree.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "prepositions-of-place",
      "title_vi": "Giới từ chỉ nơi chốn: in / on / under / next to / behind",
      "explain_vi": "Để nói một vật ở ĐÂU, em dùng các từ chỉ vị trí: \"in\" (ở trong), \"on\" (ở trên bề mặt), \"under\" (ở dưới), \"next to\" (ở bên cạnh), \"behind\" (ở phía sau). Mẫu câu: tên đồ vật + \"is\" + từ chỉ vị trí + nơi chốn. Ví dụ: \"The cat is under the table.\".",
      "examples": [
        "The cat is in the box.",
        "The lamp is on the table.",
        "The ball is under the bed.",
        "The lamp is next to the clock.",
        "The school is behind the park."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "thing-is-prep-place-in", "text": "The {thing} is {prep} the box.", "blanks": ["prep"], "context_vi": "Đồ vật ở BÊN TRONG cái hộp.", "audioText": "The cat is in the box." },
          { "id": "thing-is-prep-place-on", "text": "The {thing} is {prep} the table.", "blanks": ["prep"], "context_vi": "Đồ vật ở TRÊN mặt bàn.", "audioText": "The lamp is on the table." },
          { "id": "thing-is-prep-place-under", "text": "The {thing} is {prep} the bed.", "blanks": ["prep"], "context_vi": "Đồ vật ở PHÍA DƯỚI giường.", "audioText": "The ball is under the bed." },
          { "id": "thing-is-prep-place-behind", "text": "The {thing} is {prep} the park.", "blanks": ["prep"], "context_vi": "Nơi chốn ở PHÍA SAU công viên.", "audioText": "The school is behind the park." },
          { "id": "thing-is-prep-place-nextto", "text": "The {thing} is {prep} the shop.", "blanks": ["prep"], "context_vi": "Nơi chốn ở BÊN CẠNH cửa hàng.", "audioText": "The school is next to the shop." }
        ],
        "slots": {
          "thing": ["cat", "lamp", "ball", "clock", "school", "shop"],
          "prep": ["in", "on", "under", "next to", "behind"]
        },
        "answerKey": {
          "thing-is-prep-place-in": { "prep": "in" },
          "thing-is-prep-place-on": { "prep": "on" },
          "thing-is-prep-place-under": { "prep": "under" },
          "thing-is-prep-place-behind": { "prep": "behind" },
          "thing-is-prep-place-nextto": { "prep": "next to" }
        },
        "distractors": [
          "The cat is on box.",
          "The cat in the box.",
          "The lamp is the table.",
          "The cat is next the shop.",
          "The school is behind park."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "there-is-there-are",
      "title_vi": "There is / There are và chỉ đường nhẹ (Go..., Turn...)",
      "explain_vi": "Khi nói có CÁI GÌ ở đâu đó: một thứ thì dùng \"There is\" (viết tắt \"There's\"); hai thứ trở lên thì dùng \"There are\". Ví dụ: \"There is a shop.\" / \"There are two shops.\". Khi chỉ đường cho ai đó, em dùng câu mệnh lệnh nhẹ nhàng, bắt đầu bằng động từ: \"Go straight.\" (đi thẳng), \"Turn left.\" (rẽ trái), \"Turn right.\" (rẽ phải).",
      "examples": [
        "There is a park on my street.",
        "There are two shops next to the school.",
        "There are three trees in the park.",
        "Go straight to the bridge.",
        "Turn left at the shop."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "there-be-singular", "text": "There {be} a {noun} on my street.", "blanks": ["be"], "context_vi": "Chỉ có MỘT thứ, nên chọn dạng số ít.", "audioText": "There is a shop on my street." },
          { "id": "there-be-plural", "text": "There {be} two {noun} on my street.", "blanks": ["be"], "context_vi": "Có HAI thứ, nên chọn dạng số nhiều.", "audioText": "There are two shops on my street." },
          { "id": "give-direction", "text": "{dir} at the {place}.", "blanks": ["dir"], "context_vi": "Chỉ đường: ghép một cách đi/rẽ vào đầu câu mệnh lệnh. Cách nào cũng đúng, miễn đứng đầu câu.", "audioText": "Turn left at the shop." }
        ],
        "slots": {
          "be": ["is", "are"],
          "noun": ["shop", "park"],
          "dir": ["Go straight", "Turn left", "Turn right"],
          "place": ["shop", "park", "school", "bridge"]
        },
        "answerKey": {
          "there-be-singular": { "be": "is" },
          "there-be-plural": { "be": "are" }
        },
        "distractors": [
          "There are a shop on my street.",
          "There is two shops on my street.",
          "There be a park on my street.",
          "Turn at the shop left.",
          "Go straight the bridge."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "initial",
    "focus": ["st", "br", "gr", "fl", "tr"],
    "soundLabels": {
      "st": { "ipa": "/st/", "anchor": "street", "position": "initial", "say_vi": "âm GHÉP đầu từ \"street\" là /st/ — đọc liền hai âm /s/ và /t/ (không tách rời, không chèn nguyên âm)" },
      "br": { "ipa": "/br/", "anchor": "bridge", "position": "initial", "say_vi": "âm GHÉP đầu từ \"bridge\" là /br/ — đọc liền hai âm /b/ và /r/" },
      "gr": { "ipa": "/gr/", "anchor": "ground", "position": "initial", "say_vi": "âm GHÉP đầu từ \"ground\" là /gr/ — đọc liền hai âm /g/ và /r/" },
      "fl": { "ipa": "/fl/", "anchor": "floor", "position": "initial", "say_vi": "âm GHÉP đầu từ \"floor\" là /fl/ — đọc liền hai âm /f/ và /l/" },
      "tr": { "ipa": "/tr/", "anchor": "tree", "position": "initial", "say_vi": "âm GHÉP đầu từ \"tree\" là /tr/ — đọc liền hai âm /t/ và /r/" }
    },
    "words": [
      { "word": "street", "icon": "🛣️", "focusSound": "st", "anchor": "street", "position": "initial", "audio": "" },
      { "word": "station", "icon": "🚉", "focusSound": "st", "anchor": "street", "position": "initial", "audio": "" },
      { "word": "bridge", "icon": "🌉", "focusSound": "br", "anchor": "bridge", "position": "initial", "audio": "" },
      { "word": "ground", "icon": "🟫", "focusSound": "gr", "anchor": "ground", "position": "initial", "audio": "" },
      { "word": "grass", "icon": "🌱", "focusSound": "gr", "anchor": "ground", "position": "initial", "audio": "" },
      { "word": "floor", "icon": "🪵", "focusSound": "fl", "anchor": "floor", "position": "initial", "audio": "" },
      { "word": "tree", "icon": "🌲", "focusSound": "tr", "anchor": "tree", "position": "initial", "audio": "" },
      { "word": "train", "icon": "🚆", "focusSound": "tr", "anchor": "tree", "position": "initial", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "my-little-town",
      "title": "My little town",
      "title_vi": "Thị trấn nhỏ của em",
      "text": "This is my street. There is a small park next to my house. There are three big trees in the park. The shop is behind the park. The school is next to the shop, too. Go straight and turn left at the park. There is a long bridge over the river.",
      "teacherNote_vi": "Đoạn 7 câu (theo dấu . ! ?). Ôn lại \"There is / There are\" và giới từ nơi chốn (next to, in, behind), lồng câu chỉ đường \"Go straight and turn left\". Các từ \"street\", \"tree\", \"bridge\" gắn với phần phonics blend đầu mới (st/tr/br). \"river\" là từ i+1 (thêm một chút mới), suy được nghĩa nhờ tranh và \"bridge\". Các từ còn lại đều trong vocab hoặc đã học ở Level 1.",
      "questions": [
        { "id": "q1", "q_vi": "Công viên ở bên cạnh nhà bạn nhỏ, đúng không?", "type": "truefalse", "answer": true, "audioText": "The park is next to the house." },
        { "id": "q2", "q_vi": "Trong công viên có mấy cái cây?", "type": "mcq", "choices": ["one tree", "two trees", "three trees"], "answer": 2, "audioText": "How many trees are there in the park?" },
        { "id": "q3", "q_vi": "Cửa hàng ở đâu?", "type": "mcq", "choices": ["behind the park", "in the park", "under the park"], "answer": 0, "audioText": "Where is the shop?" },
        { "id": "q4", "q_vi": "Khi chỉ đường, em rẽ hướng nào ở công viên?", "type": "mcq", "choices": ["turn left", "turn right", "go back"], "answer": 0, "audioText": "Which way do you turn at the park?" }
      ]
    }
  ],
  "speaking": [
    {
      "id": "where-is-it",
      "title_vi": "Nói một vật ở đâu",
      "prompt_vi": "Nhìn quanh phòng em. Chọn một đồ vật và nói nó ở đâu, dùng in / on / under / next to / behind nhé.",
      "sentenceFrames": [
        "The ___ is on the ___.",
        "The ___ is under the ___.",
        "The ___ is next to the ___."
      ],
      "audioModels": [
        "The lamp is on the table.",
        "The ball is under the bed.",
        "The clock is next to the shelf."
      ]
    },
    {
      "id": "give-me-directions",
      "title_vi": "Chỉ đường cho bạn",
      "prompt_vi": "Hãy chỉ đường cho bạn đến một nơi gần nhà em. Dùng \"There is / There are\" để tả, và \"Go straight\", \"Turn left\", \"Turn right\" để chỉ đường.",
      "sentenceFrames": [
        "There is a ___ on my street.",
        "Go straight to the ___.",
        "Turn left at the ___."
      ],
      "audioModels": [
        "There is a park on my street.",
        "Go straight to the bridge.",
        "Turn left at the shop."
      ]
    }
  ],
  "audioNotes": "Nên thu âm người thật cho các audioModels phần speaking và audioText câu hỏi reading. ĐẶC BIỆT phần phonics blend phụ âm đầu /st/ (street, station), /br/ (bridge), /gr/ (ground, grass), /fl/ (floor), /tr/ (tree, train) — TTS dễ tách rời hai phụ âm hoặc chèn nguyên âm vào giữa; loa cần đọc TỪ TRỌN VẸN với âm ghép đọc LIỀN, không tách. Các blend này khác Bài 3 (Bài 3 dùng bl/cl) và đều gắn với từ chỉ nơi chốn/thành phố nhỏ. Hai câu mẫu grammar \"There is a shop on my street.\" / \"There are two shops on my street.\" cần audio chuẩn để bé nghe rõ khác biệt is/are. Các câu chỉ đường \"Go straight.\", \"Turn left.\", \"Turn right.\" nên thu với ngữ điệu mệnh lệnh nhẹ, rõ ràng — engine luân phiên cả ba khi luyện điền chỗ trống nên cả ba đều cần audio."
};
  C["level2/lesson05.json"] = {
  "schemaVersion": "v1",
  "level": 2,
  "unit": 205,
  "lesson": 5,
  "topic": "Telling a story: my day and my trip",
  "topic_vi": "Kể chuyện & quá khứ đơn",
  "vocab": [
    { "word": "yesterday", "vi": "hôm qua", "icon": "📅", "example": "Yesterday was Sunday.", "partOfSpeech": "adverb", "audio": "" },
    { "word": "played", "vi": "đã chơi", "icon": "⚽", "example": "I played football with my friends.", "partOfSpeech": "verb", "audio": "" },
    { "word": "watched", "vi": "đã xem", "icon": "📺", "example": "We watched a film at home.", "partOfSpeech": "verb", "audio": "" },
    { "word": "went", "vi": "đã đi (đến)", "icon": "🚶", "example": "I went to the zoo with my mum.", "partOfSpeech": "verb", "audio": "" },
    { "word": "saw", "vi": "đã thấy / nhìn thấy", "icon": "👀", "example": "We saw a big lion.", "partOfSpeech": "verb", "audio": "" },
    { "word": "had", "vi": "đã có / đã ăn", "icon": "🍦", "example": "I had an ice cream at the beach.", "partOfSpeech": "verb", "audio": "" },
    { "word": "zoo", "vi": "sở thú", "icon": "🦁", "example": "The zoo was fun.", "partOfSpeech": "noun", "audio": "" },
    { "word": "beach", "vi": "bãi biển", "icon": "🏖️", "example": "We went to the beach on Saturday.", "partOfSpeech": "noun", "audio": "" },
    { "word": "park", "vi": "công viên", "icon": "🌳", "example": "I played in the park.", "partOfSpeech": "noun", "audio": "", "recycled": true, "recycledNote_vi": "Ôn lại từ Bài 2 và Bài 4 (dùng lại có chủ đích)." },
    { "word": "farm", "vi": "nông trại", "icon": "🚜", "example": "We saw cows on the farm.", "partOfSpeech": "noun", "audio": "" },
    { "word": "happy", "vi": "vui / hạnh phúc", "icon": "😊", "example": "My family was happy.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "trip", "vi": "chuyến đi chơi", "icon": "🎒", "example": "It was a great trip.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "be-past-was-were",
      "title_vi": "Quá khứ của \"to be\": was / were (đã là, đã ở)",
      "explain_vi": "Để kể chuyện đã xảy ra (hôm qua, tuần trước...), em dùng quá khứ của \"to be\". Với I, he, she, it thì dùng \"was\"; với you, we, they thì dùng \"were\". Ví dụ: \"I was happy.\" (Em đã vui), \"We were at the zoo.\" (Chúng em đã ở sở thú). Câu phủ định thêm \"not\": wasn't, weren't.",
      "examples": [
        "Yesterday I was at the park.",
        "We were happy.",
        "It was a sunny day.",
        "The lions weren't sad."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "subj-was-were-place", "text": "{subj} {be} at the {place}.", "blanks": ["be"], "context_vi": "Nói ai đó đã Ở ĐÂU hôm qua. Chọn was hay were cho đúng với chủ ngữ.", "audioText": "I was at the park." },
          { "id": "subj-was-were-adj", "text": "Yesterday {subj} {be} {adj}.", "blanks": ["be"], "context_vi": "Nói hôm qua ai đó CẢM THẤY thế nào. Chọn was hay were.", "audioText": "Yesterday we were happy." },
          { "id": "it-was-weather", "text": "It {be} a {adj} day.", "blanks": ["be"], "context_vi": "Nói về thời tiết của một ngày trong quá khứ. Với \"it\" luôn dùng was.", "audioText": "It was a sunny day." }
        ],
        "slots": {
          "subj": ["I", "He", "She", "We", "They", "You"],
          "be": ["was", "were"],
          "place": ["zoo", "beach", "park", "farm"],
          "adj": ["happy", "tired", "sunny", "great"]
        },
        "answerKey": {
          "subj-was-were-place": {
            "be": { "I": "was", "He": "was", "She": "was", "We": "were", "They": "were", "You": "were" }
          },
          "subj-was-were-adj": {
            "be": { "I": "was", "He": "was", "She": "was", "We": "were", "They": "were", "You": "were" }
          },
          "it-was-weather": {
            "be": { "happy": "was", "tired": "was", "sunny": "was", "great": "was" }
          }
        },
        "distractors": [
          "Yesterday I were happy.",
          "We was at the zoo.",
          "It were a sunny day.",
          "They was at the farm.",
          "He were tired.",
          "Yesterday we are happy."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "past-simple-verbs",
      "title_vi": "Kể việc đã làm: thêm -ed (played, watched) và động từ đặc biệt (went, saw, had)",
      "explain_vi": "Để kể việc em ĐÃ LÀM hôm qua, phần lớn động từ chỉ cần thêm \"-ed\": play → played, watch → watched. Nhưng vài động từ rất hay dùng lại ĐỔI HẲN, em học thuộc nhé: go → went (đã đi), see → saw (đã thấy), have → had (đã có/đã ăn). Dạng này dùng chung cho I, you, he, she, we, they.",
      "examples": [
        "I played football in the park.",
        "We watched a film at home.",
        "I went to the zoo.",
        "We saw a big lion.",
        "She had an ice cream."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "i-past-verb-place", "text": "I {pastverb} {place_phrase}.", "blanks": ["pastverb"], "context_vi": "Chọn dạng QUÁ KHỨ đúng của động từ để kể việc em đã làm.", "audioText": "I played in the park." },
          { "id": "we-past-verb", "text": "We {pastverb} {object}.", "blanks": ["pastverb"], "context_vi": "Chọn dạng quá khứ đúng. Nhớ: go → went, see → saw, have → had.", "audioText": "We saw a big lion." },
          { "id": "yesterday-i-went", "text": "Yesterday I {pastverb} to the {place}.", "blanks": ["pastverb"], "context_vi": "Đi ĐẾN một nơi trong quá khứ thì dùng \"went to\".", "audioText": "Yesterday I went to the beach." }
        ],
        "slots": {
          "pastverb": ["played", "watched", "went", "saw", "had"],
          "place": ["zoo", "beach", "park", "farm"],
          "place_phrase": ["in the park", "at home"],
          "object": ["a big lion", "a film", "an ice cream"]
        },
        "answerKey": {
          "i-past-verb-place": {
            "pastverb": { "in the park": "played", "at home": "watched" }
          },
          "we-past-verb": {
            "pastverb": { "a big lion": "saw", "a film": "watched", "an ice cream": "had" }
          },
          "yesterday-i-went": {
            "pastverb": { "zoo": "went", "beach": "went", "park": "went", "farm": "went" }
          }
        },
        "distractors": [
          "I goed to the zoo.",
          "We seed a big lion.",
          "She haved an ice cream.",
          "Yesterday I went the beach.",
          "I playd football.",
          "We watch a film yesterday."
        ],
        "irregulars": {
          "go": "went",
          "see": "saw",
          "have": "had",
          "play": "played",
          "watch": "watched"
        }
      }
    }
  ],
  "recognition": [
    {
      "id": "meet-past-vs-present",
      "title_vi": "Làm quen: QUÁ KHỨ hay HIỆN TẠI?",
      "explain_vi": "Phần này chỉ để LÀM QUEN (nghe và chọn), em CHƯA cần tự đặt câu. Khi nghe \"went, played, saw, had\" nghĩa là việc ĐÃ XẢY RA (quá khứ); khi nghe \"go, play, see, have\" nghĩa là việc BÂY GIỜ / hằng ngày (hiện tại). Em chỉ cần nghe câu mẫu rồi chọn xem là chuyện ĐÃ QUA hay BÂY GIỜ.",
      "examples": [
        "I went to the zoo.",
        "I go to the zoo.",
        "We played in the park.",
        "We saw a big lion."
      ],
      "generators": ["listen_choose", "mcq"],
      "items": [
        { "id": "rec-went", "audioText": "I went to the zoo.", "meaning_vi": "Bạn nhỏ ĐÃ ĐI sở thú (chuyện đã qua).", "choices_vi": ["Quá khứ (đã qua)", "Hiện tại (bây giờ)"], "answer": 0 },
        { "id": "rec-go", "audioText": "I go to the zoo.", "meaning_vi": "Bạn nhỏ hay ĐI sở thú (bây giờ / hằng ngày).", "choices_vi": ["Quá khứ (đã qua)", "Hiện tại (bây giờ)"], "answer": 1 },
        { "id": "rec-played", "audioText": "We played in the park.", "meaning_vi": "Chúng em ĐÃ CHƠI ở công viên (chuyện đã qua).", "choices_vi": ["Quá khứ (đã qua)", "Hiện tại (bây giờ)"], "answer": 0 },
        { "id": "rec-saw", "audioText": "We saw a big lion.", "meaning_vi": "Chúng em ĐÃ THẤY một con sư tử (chuyện đã qua).", "choices_vi": ["Quá khứ (đã qua)", "Hiện tại (bây giờ)"], "answer": 0 },
        { "id": "rec-have", "audioText": "I have an ice cream.", "meaning_vi": "Bạn nhỏ CÓ một que kem (bây giờ).", "choices_vi": ["Quá khứ (đã qua)", "Hiện tại (bây giờ)"], "answer": 1 },
        { "id": "rec-had", "audioText": "I had an ice cream.", "meaning_vi": "Bạn nhỏ ĐÃ ĂN một que kem (chuyện đã qua).", "choices_vi": ["Quá khứ (đã qua)", "Hiện tại (bây giờ)"], "answer": 0 }
      ]
    }
  ],
  "phonics": {
    "position": "mixed",
    "focus": ["pl", "gr", "nd"],
    "soundLabels": {
      "pl": { "ipa": "/pl/", "anchor": "play", "position": "initial", "say_vi": "âm GHÉP ĐẦU từ \"play\" là /pl/ — đọc dính p và l liền nhau, không tách rời" },
      "gr": { "ipa": "/gr/", "anchor": "grass", "position": "initial", "say_vi": "âm GHÉP ĐẦU từ \"grass\" là /gr/ — đọc dính g và r liền nhau" },
      "nd": { "ipa": "/nd/", "anchor": "sand", "position": "final", "say_vi": "âm GHÉP CUỐI từ \"sand\" là /nd/ — đọc dính n và d ở cuối từ, không thêm nguyên âm" }
    },
    "words": [
      { "word": "play", "icon": "⚽", "focusSound": "pl", "anchor": "play", "position": "initial", "audio": "" },
      { "word": "plant", "icon": "🪴", "focusSound": "pl", "anchor": "play", "position": "initial", "audio": "" },
      { "word": "grass", "icon": "🌱", "focusSound": "gr", "anchor": "grass", "position": "initial", "audio": "" },
      { "word": "green", "icon": "🟢", "focusSound": "gr", "anchor": "grass", "position": "initial", "audio": "" },
      { "word": "sand", "icon": "🏖️", "focusSound": "nd", "anchor": "sand", "position": "final", "audio": "" },
      { "word": "hand", "icon": "✋", "focusSound": "nd", "anchor": "sand", "position": "final", "audio": "" },
      { "word": "friend", "icon": "🧑‍🤝‍🧑", "focusSound": "nd", "anchor": "sand", "position": "final", "audio": "" },
      { "word": "wind", "icon": "🌬️", "focusSound": "nd", "anchor": "sand", "position": "final", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "my-trip-to-the-zoo",
      "title": "My trip to the zoo",
      "title_vi": "Chuyến đi sở thú của em",
      "text": "Yesterday was Saturday. I went to the zoo with my mum and dad. It was a sunny day. We saw a big lion and three monkeys. The monkeys were very funny. I had an ice cream, and then we played in the park. It was a great trip, and we were all happy.",
      "teacherNote_vi": "Đoạn gồm 8 câu (theo dấu . ! ?). Gói gọn trọng tâm BÀI LỚN 5: was/were (was Saturday, was sunny, were funny, were happy) + V-ed (played) + bất quy tắc (went, saw, had). Từ mới ngoài vocab chỉ thêm lion/monkeys (i+1, dễ đoán nhờ ngữ cảnh sở thú).",
      "questions": [
        { "id": "q1", "q_vi": "Bạn nhỏ đi sở thú vào hôm qua, đúng không?", "type": "truefalse", "answer": true, "audioText": "She went to the zoo yesterday." },
        { "id": "q2", "q_vi": "Hôm đó thời tiết thế nào?", "type": "mcq", "choices": ["It was sunny.", "It was rainy.", "It was windy."], "answer": 0, "audioText": "What was the weather like?" },
        { "id": "q3", "q_vi": "Bạn nhỏ đã nhìn thấy con gì ở sở thú?", "type": "mcq", "choices": ["a lion and monkeys", "a dog and a cat", "a fish and a bird"], "answer": 0, "audioText": "What did she see at the zoo?" },
        { "id": "q4", "q_vi": "Bạn nhỏ đã ăn kem ở sở thú, đúng không?", "type": "truefalse", "answer": true, "audioText": "She had an ice cream." },
        { "id": "q5", "q_vi": "Cuối cùng cả nhà cảm thấy thế nào?", "type": "mcq", "choices": ["happy", "tired", "sad"], "answer": 0, "audioText": "How did the family feel?" }
      ]
    }
  ],
  "speaking": [
    {
      "id": "tell-about-yesterday",
      "title_vi": "Kể về ngày hôm qua của em",
      "prompt_vi": "Hãy kể em đã ở đâu và cảm thấy thế nào hôm qua. Điền nơi chốn và cảm xúc thật của em vào chỗ trống. Nhớ dùng \"was\" với I nhé.",
      "sentenceFrames": [
        "Yesterday I was at the ___.",
        "It was ___.",
        "I was ___."
      ],
      "audioModels": [
        "Yesterday I was at the park.",
        "It was sunny.",
        "I was happy."
      ]
    },
    {
      "id": "tell-about-my-trip",
      "title_vi": "Kể một việc em đã làm trong chuyến đi",
      "prompt_vi": "Kể một chuyến đi hoặc một ngày vui: em đã đi đâu, đã thấy gì, đã làm gì. Dùng went, saw và played hoặc had.",
      "sentenceFrames": [
        "I went to the ___.",
        "I saw a ___.",
        "I played / had ___."
      ],
      "audioModels": [
        "I went to the zoo.",
        "I saw a big lion.",
        "I had an ice cream."
      ]
    }
  ],
  "audioNotes": "Cần thu âm người thật cho: (1) Phonics — blend phụ âm ĐẦU /pl/ (play, plant), /gr/ (grass, green) đọc dính liền; và blend phụ âm CUỐI /nd/ (sand, hand, friend, wind) — đây là blend cuối-từ mang tính TỔNG KẾT Level, TTS dễ thêm nguyên âm chen vào hoặc nuốt mất /d/ cuối, loa phải đọc TỪ TRỌN VẸN với n-d dính liền ở cuối. (2) Phần recognition 'QUÁ KHỨ hay HIỆN TẠI' — đọc rõ cặp tối thiểu để bé phân biệt: 'I went' vs 'I go', 'I had' vs 'I have', và 'We played / We saw'; đọc rõ đuôi -ed của 'played' /pleɪd/ để khác 'play'. (3) Cặp dạng đúng/sai động từ quá khứ trong examples (went, saw, had) để bé phân biệt với lỗi 'goed/seed/haved'. (4) audioModels phần speaking và audioText câu hỏi reading. Lưu ý đọc rõ đuôi -ed của 'played' /pleɪd/ và 'watched' /wɒtʃt/ (đuôi /t/ không thành 'ed' tách âm). Ghi chú recycling: từ 'park' được dùng lại có chủ đích (đã xuất hiện ở Bài 2 và Bài 4) nhằm ôn tập, không phải từ mới; các nơi chốn MỚI của bài là zoo, beach, farm."
};
  C["level3/index.json"] = {
  "schemaVersion": "v1",
  "level": 3,
  "units": [],
  "lessons": [
    { "lesson": 1, "unit": 301, "file": "lesson01.json", "topic_vi": "So sánh & mô tả",          "icon": "📏", "pal": "sun",   "sub": "so sánh hơn/nhất (-er · the -est)" },
    { "lesson": 2, "unit": 302, "file": "lesson02.json", "topic_vi": "Thói quen & tần suất",      "icon": "🔁", "pal": "sky",   "sub": "always/usually/sometimes/never" },
    { "lesson": 3, "unit": 303, "file": "lesson03.json", "topic_vi": "Kế hoạch & tương lai",      "icon": "🔮", "pal": "mint",  "sub": "be going to · will · must/have to" },
    { "lesson": 4, "unit": 304, "file": "lesson04.json", "topic_vi": "Việc đang & đã diễn ra",    "icon": "⏳", "pal": "coral", "sub": "past continuous · when/while" },
    { "lesson": 5, "unit": 305, "file": "lesson05.json", "topic_vi": "Đọc hiểu & kể lại",         "icon": "📚", "pal": "grape", "sub": "because/so/but · kể chuyện" }
  ]
};
  C["level3/lesson01.json"] = {
  "schemaVersion": "v1",
  "level": 3,
  "unit": 301,
  "lesson": 1,
  "topic": "Compare and describe",
  "topic_vi": "So sánh & mô tả",
  "vocab": [
    { "word": "big", "vi": "to, lớn", "icon": "🐘", "example": "An elephant is big.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "small", "vi": "nhỏ, bé", "icon": "🐜", "example": "An ant is small.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "tall", "vi": "cao", "icon": "🦒", "example": "A giraffe is tall.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "short", "vi": "thấp, ngắn", "icon": "📏", "example": "My pencil is short.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "long", "vi": "dài", "icon": "🐍", "example": "A snake is long.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "fast", "vi": "nhanh", "icon": "🐆", "example": "A cheetah is fast.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "slow", "vi": "chậm", "icon": "🐢", "example": "A turtle is slow.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "old", "vi": "già, cũ", "icon": "👴", "example": "My grandpa is old.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "young", "vi": "trẻ, nhỏ tuổi", "icon": "👶", "example": "My sister is young.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "river", "vi": "con sông", "icon": "🏞️", "example": "The river is very long.", "partOfSpeech": "noun", "audio": "" },
    { "word": "mountain", "vi": "ngọn núi", "icon": "⛰️", "example": "The mountain is high.", "partOfSpeech": "noun", "audio": "" },
    { "word": "building", "vi": "toà nhà", "icon": "🏢", "example": "This building is tall.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "comparative-than",
      "title_vi": "So sánh hơn: tính từ + \"-er\" và \"than\"",
      "explain_vi": "Khi em so sánh HAI vật (hoặc hai người, hai con vật), em thêm \"-er\" vào sau tính từ ngắn rồi dùng \"than\": tall → taller, long → longer. Mẫu câu: \"A giraffe is taller than a horse.\". Vài từ thay đổi một chút khi viết: \"big\" gấp đôi chữ cuối thành \"bigger\"; tính từ kết thúc bằng \"y\" như \"happy\" đổi thành \"happier\" (bài này chỉ dùng tính từ ngắn quen thuộc). Lưu ý: KHÔNG nói \"more big\", chỉ nói \"bigger\".",
      "examples": [
        "An elephant is bigger than a dog.",
        "A giraffe is taller than a horse.",
        "A turtle is slower than a cat."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "noun-be-adjer-than", "text": "{subjAnimal} is {adjerAnimal} than {objAnimal}.", "blanks": ["adjerAnimal"], "context_vi": "So sánh hai con vật: con này HƠN con kia. Tính từ đã được thêm \"-er\" sẵn, em chỉ chọn cho đúng nghĩa (con vật so về to/nhỏ/nhanh/chậm/cao).", "audioText": "A giraffe is taller than a horse." },
          { "id": "place-be-adjer-than", "text": "The {place1} is {adjerPlace} than the {place2}.", "blanks": ["adjerPlace"], "context_vi": "So sánh hai địa điểm về độ dài/rộng/cao. Nhớ có \"than\" sau tính từ so sánh hơn.", "audioText": "The river is longer than the road." }
        ],
        "slots": {
          "subjAnimal": ["A giraffe", "An elephant", "A cheetah"],
          "objAnimal": ["a horse", "a dog", "a turtle"],
          "place1": ["river", "mountain", "building"],
          "place2": ["road", "hill", "house"],
          "adjerAnimal": ["taller", "bigger", "smaller", "faster", "slower"],
          "adjerPlace": ["longer", "wider", "higher"]
        },
        "answerKey": {},
        "distractors": [
          "A giraffe is more tall than a horse.",
          "A giraffe is taller a horse.",
          "A giraffe is tallest than a horse.",
          "A giraffe is more taller than a horse.",
          "The river is more long than the road.",
          "The river is longest than the road."
        ],
        "irregulars": {
          "big": "bigger",
          "good": "better",
          "bad": "worse"
        }
      }
    },
    {
      "id": "superlative-the-est",
      "title_vi": "So sánh nhất: \"the\" + tính từ + \"-est\"",
      "explain_vi": "Khi em nói một vật là NHẤT trong cả nhóm (từ ba vật trở lên), em dùng \"the\" trước tính từ và thêm \"-est\" vào sau: tall → the tallest, long → the longest. Mẫu câu: \"The blue whale is the biggest animal.\". Luôn có \"the\" đứng trước. KHÔNG nói \"most tall\", chỉ nói \"the tallest\".",
      "examples": [
        "The blue whale is the biggest animal.",
        "The cheetah is the fastest animal.",
        "The Nile is the longest river."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "the-est-thing", "text": "{subjAnimal} is {art} {adjAnimal} animal.", "blanks": ["art"], "context_vi": "Nói con vật này là NHẤT. Trước tính từ so sánh nhất LUÔN dùng \"the\" — KHÔNG dùng \"a\".", "audioText": "The cheetah is the fastest animal." },
          { "id": "the-est-choose-form", "text": "The {placeName} is the {adjPlace} river.", "blanks": ["adjPlace"], "context_vi": "Chọn tính từ so sánh nhất đúng nghĩa. Tính từ đã thêm \"-est\" sẵn.", "audioText": "The Nile is the longest river." }
        ],
        "slots": {
          "subjAnimal": ["The cheetah", "The blue whale", "The giraffe", "The elephant"],
          "art": ["the"],
          "adjAnimal": ["fastest", "biggest", "tallest", "smallest"],
          "placeName": ["Nile", "Amazon", "Mekong"],
          "adjPlace": ["longest", "widest"]
        },
        "answerKey": {
          "the-est-thing": {
            "art": "the"
          }
        },
        "distractors": [
          "The cheetah is fastest animal.",
          "The cheetah is the most fast animal.",
          "The cheetah is a fastest animal.",
          "The cheetah is the faster animal.",
          "The Nile is the most long river.",
          "The Nile is longest river."
        ],
        "irregulars": {
          "big": "biggest",
          "good": "best",
          "bad": "worst"
        }
      }
    }
  ],
  "phonics": {
    "position": "medial",
    "focus": ["ar", "or", "oo", "ai"],
    "soundLabels": {
      "ar": { "ipa": "/ɑː/", "anchor": "car", "position": "medial", "say_vi": "âm GIỮA từ \"car\" là /ɑː/ — kéo dài như \"a\", không đọc rời chữ a và r" },
      "or": { "ipa": "/ɔː/", "anchor": "fork", "position": "medial", "say_vi": "âm GIỮA từ \"fork\" là /ɔː/ — tròn môi như \"o\", không đọc rời chữ o và r" },
      "oo": { "ipa": "/uː/", "anchor": "moon", "position": "medial", "say_vi": "âm GIỮA từ \"moon\" là /uː/ — kéo dài như \"u\", không đọc thành \"oo\" rời" },
      "ai": { "ipa": "/eɪ/", "anchor": "rain", "position": "medial", "say_vi": "âm GIỮA từ \"rain\" là /eɪ/ — như \"ây\", không đọc rời chữ a và i" }
    },
    "words": [
      { "word": "car", "icon": "🚗", "focusSound": "ar", "anchor": "car", "position": "medial", "audio": "" },
      { "word": "star", "icon": "⭐", "focusSound": "ar", "anchor": "car", "position": "medial", "audio": "" },
      { "word": "fork", "icon": "🍴", "focusSound": "or", "anchor": "fork", "position": "medial", "audio": "" },
      { "word": "horse", "icon": "🐴", "focusSound": "or", "anchor": "fork", "position": "medial", "audio": "" },
      { "word": "moon", "icon": "🌙", "focusSound": "oo", "anchor": "moon", "position": "medial", "audio": "" },
      { "word": "spoon", "icon": "🥄", "focusSound": "oo", "anchor": "moon", "position": "medial", "audio": "" },
      { "word": "rain", "icon": "🌧️", "focusSound": "ai", "anchor": "rain", "position": "medial", "audio": "" },
      { "word": "train", "icon": "🚆", "focusSound": "ai", "anchor": "rain", "position": "medial", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "the-animal-race",
      "title": "The animal race",
      "title_vi": "Cuộc thi chạy của các con vật",
      "text": "Today the animals have a race. The turtle is the slowest, but he is happy. The dog is faster than the turtle. The horse is faster than the dog. The cheetah is the fastest animal here! He runs and wins the race. The giraffe is the tallest animal, but she is not the fastest. The little ant is the smallest of all, and she cheers for her friends.",
      "gloss_vi": {
        "race": "cuộc thi chạy / cuộc đua",
        "win": "thắng, về nhất (wins = thắng)",
        "cheer": "cổ vũ, reo hò (cheers = cổ vũ)",
        "happy": "vui",
        "friends": "các bạn"
      },
      "teacherNote_vi": "Đoạn 8 câu (theo . ! ?), vừa ngưỡng 6-8. Áp dụng đúng hai điểm ngữ pháp: so sánh hơn với \"than\" (faster than the turtle, faster than the dog) và so sánh nhất với \"the\" (the slowest, the fastest, the tallest, the smallest). Ôn lại present simple đã học ở Level 2 (have, is, runs, wins, cheers). Từ mới nhẹ i+1: race, win, cheer — đã thêm gloss_vi để trẻ tự đọc đỡ tải; đoán thêm được qua ngữ cảnh.",
      "questions": [
        { "id": "q1", "q_vi": "Con rùa là con chậm nhất, đúng không?", "type": "truefalse", "answer": true, "audioText": "The turtle is the slowest animal." },
        { "id": "q2", "q_vi": "Con vật nào nhanh nhất và thắng cuộc?", "type": "mcq", "choices": ["the cheetah", "the horse", "the turtle"], "answer": 0, "audioText": "Which animal is the fastest and wins the race?" },
        { "id": "q3", "q_vi": "Con ngựa so với con chó thì thế nào?", "type": "mcq", "choices": ["The horse is faster than the dog.", "The horse is slower than the dog.", "The horse is the slowest."], "answer": 0, "audioText": "How fast is the horse compared with the dog?" },
        { "id": "q4", "q_vi": "Con vật nào nhỏ nhất?", "type": "mcq", "choices": ["the ant", "the giraffe", "the cheetah"], "answer": 0, "audioText": "Which animal is the smallest?" }
      ]
    }
  ],
  "speaking": [
    {
      "id": "compare-two-things",
      "title_vi": "So sánh hai vật (hơn)",
      "prompt_vi": "Em chọn hai con vật hoặc hai đồ vật rồi so sánh. Nhớ thêm \"-er\" và \"than\" nhé. Em có thể nói về đồ thật quanh em.",
      "sentenceFrames": [
        "A ___ is bigger than a ___.",
        "A ___ is taller than a ___.",
        "My ___ is longer than my ___."
      ],
      "audioModels": [
        "An elephant is bigger than a dog.",
        "A giraffe is taller than a horse.",
        "My pencil is longer than my pen."
      ]
    },
    {
      "id": "say-the-most",
      "title_vi": "Nói vật nào là NHẤT",
      "prompt_vi": "Em nói một vật là nhất trong nhóm. Nhớ có \"the\" và thêm \"-est\". Hãy nói về gia đình hoặc bạn của em nữa.",
      "sentenceFrames": [
        "The ___ is the fastest animal.",
        "The ___ is the tallest in my class.",
        "My ___ is the oldest in my family."
      ],
      "audioModels": [
        "The cheetah is the fastest animal.",
        "Tom is the tallest in my class.",
        "My grandpa is the oldest in my family."
      ]
    }
  ],
  "audioNotes": "Cần thu âm người thật cho: tất cả audioModels phần speaking và audioText câu hỏi reading. ĐẶC BIỆT phần phonics nguyên âm đôi / âm r ở GIỮA từ: /ɑː/ (car, star), /ɔː/ (fork, horse), /uː/ (moon, spoon), /eɪ/ (rain, train) — loa phải đọc TỪ TRỌN VẸN, không tách rời từng chữ cái (vd không đọc \"a\"+\"r\" hay \"o\"+\"o\"). Hai câu mẫu ngữ pháp \"A giraffe is taller than a horse.\" và \"The cheetah is the fastest animal.\" cần audio chuẩn để bé nghe rõ \"-er than\" và \"the ...-est\" (TTS dễ nuốt âm \"-er\"/\"-est\" hoặc đọc lẫn \"the\"). Các tính từ so sánh chia sẵn (taller, bigger, faster, longer, fastest, biggest, tallest, longest) nên có audio chuẩn để bé bắt chước đúng phần đuôi."
};
  C["level3/lesson02.json"] = {
  "schemaVersion": "v1",
  "level": 3,
  "unit": 302,
  "lesson": 2,
  "topic": "Habits and how often we do things",
  "topic_vi": "Thói quen & tần suất",
  "vocab": [
    { "word": "always", "vi": "luôn luôn (100%)", "icon": "💯", "example": "I always brush my teeth.", "partOfSpeech": "adverb", "audio": "" },
    { "word": "usually", "vi": "thường (hầu hết các lần)", "icon": "🔁", "example": "She usually walks to school.", "partOfSpeech": "adverb", "audio": "" },
    { "word": "sometimes", "vi": "thỉnh thoảng", "icon": "🤔", "example": "We sometimes play chess.", "partOfSpeech": "adverb", "audio": "" },
    { "word": "never", "vi": "không bao giờ (0%)", "icon": "🚫", "example": "He never eats fast food.", "partOfSpeech": "adverb", "audio": "" },
    { "word": "wake up", "vi": "thức dậy", "icon": "⏰", "example": "I wake up at six.", "partOfSpeech": "verb", "audio": "" },
    { "word": "brush", "vi": "đánh (răng) / chải (tóc)", "icon": "🪥", "example": "I always brush my teeth.", "partOfSpeech": "verb", "audio": "" },
    { "word": "walk", "vi": "đi bộ", "icon": "🚶", "example": "She usually walks to school.", "partOfSpeech": "verb", "audio": "" },
    { "word": "help", "vi": "giúp đỡ", "icon": "🤝", "example": "I sometimes help my mum.", "partOfSpeech": "verb", "audio": "" },
    { "word": "tidy", "vi": "dọn dẹp", "icon": "🧹", "example": "We tidy our room on Sunday.", "partOfSpeech": "verb", "audio": "" },
    { "word": "homework", "vi": "bài tập về nhà", "icon": "📚", "example": "I always do my homework.", "partOfSpeech": "noun", "audio": "" },
    { "word": "weekend", "vi": "cuối tuần", "icon": "📅", "example": "On the weekend, we visit Grandma.", "partOfSpeech": "noun", "audio": "" },
    { "word": "morning", "vi": "buổi sáng", "icon": "🌅", "example": "In the morning, I have breakfast.", "partOfSpeech": "noun", "audio": "" }
  ],
  "grammar": [
    {
      "id": "adverbs-of-frequency-position",
      "title_vi": "Trạng từ tần suất + vị trí TRƯỚC động từ thường (always / usually / sometimes / never)",
      "explain_vi": "Để nói em làm một việc THƯỜNG XUYÊN đến mức nào, em dùng trạng từ tần suất: always (luôn luôn, 100%), usually (thường), sometimes (thỉnh thoảng), never (không bao giờ, 0%). Trạng từ này đứng TRƯỚC động từ thường, ví dụ \"I always walk to school.\", \"She usually helps her mum.\". Lưu ý: \"never\" đã mang nghĩa phủ định, nên KHÔNG dùng thêm \"don't / doesn't\" với never. Đây là câu present simple nói về thói quen.",
      "examples": [
        "I always brush my teeth.",
        "We usually walk to school.",
        "I sometimes help my mum.",
        "He never eats fast food."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "i-adv-verb", "text": "I {adv} {verb} after school.", "blanks": ["adv"], "context_vi": "Đây chỉ là bài LUYỆN VỊ TRÍ trạng từ, không phải nói về bản thân em. Mọi trạng từ tần suất (kể cả \"never\") đều đúng ngữ pháp khi đứng TRƯỚC động từ thường. Ngữ cảnh trung tính: một việc em làm sau giờ học.", "audioText": "I usually play after school." },
          { "id": "we-adv-verb", "text": "We {adv} {verb2} to school.", "blanks": ["adv"], "context_vi": "Nói nhóm em đi bộ đến trường thường xuyên đến mức nào.", "audioText": "We usually walk to school." },
          { "id": "he-adv-verb3", "text": "He {adv} {verb3} his room.", "blanks": ["verb3"], "context_vi": "Chọn đúng dạng động từ cho \"he\" (thêm s): tidies. Trạng từ đã đặt sẵn trước động từ.", "audioText": "He always tidies his room." }
        ],
        "slots": {
          "adv": ["always", "usually", "sometimes", "never"],
          "verb": ["play", "read", "draw"],
          "verb2": ["walk"],
          "verb3": ["tidies"]
        },
        "answerKey": {},
        "distractors": [
          "I play always after school.",
          "I always playing after school.",
          "He never doesn't tidy his room.",
          "We walk usually to school.",
          "He always tidy his room.",
          "I read after school always.",
          "We always walks to school."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "frequency-with-be-and-doesnt",
      "title_vi": "Tần suất với \"be\" (đứng SAU) và với he/she (thêm s)",
      "explain_vi": "Có hai điểm cần nhớ. Một là: với động từ \"be\" (am / is / are), trạng từ tần suất đứng SAU \"be\", ví dụ \"She is always happy.\", \"They are usually late.\". Hai là: trong present simple, với he / she / it động từ thường thêm \"s\": \"She always walks.\", \"He usually helps.\". Còn \"never\" thì không cần \"doesn't\" vì nó đã là phủ định rồi: nói \"He never eats fast food.\".",
      "examples": [
        "She is always happy.",
        "They are usually late.",
        "She always walks to school.",
        "He sometimes helps his dad."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "subj-be-adv", "text": "{subj} {be} {adv} happy.", "blanks": ["be"], "context_vi": "Chọn đúng \"am / is / are\" theo chủ ngữ. Trạng từ tần suất đứng SAU be.", "audioText": "She is always happy." },
          { "id": "be-adv-position", "text": "She is {adv} happy.", "blanks": ["adv"], "context_vi": "Chọn một trạng từ tần suất đặt đúng chỗ SAU \"is\".", "audioText": "She is usually happy." },
          { "id": "subj3-adv-verb3", "text": "{subj3} {adv} {verb3}.", "blanks": ["verb3"], "context_vi": "Chọn đúng dạng động từ thêm s cho he/she (walks / helps).", "audioText": "She always walks." }
        ],
        "slots": {
          "subj": ["I", "She", "He", "We", "They"],
          "subj3": ["She", "He"],
          "be": ["am", "is", "are"],
          "adv": ["always", "usually", "sometimes", "never"],
          "verb3": ["walks", "helps"]
        },
        "answerKey": {
          "subj-be-adv": {
            "be": { "__cond": "subj", "I": "am", "She": "is", "He": "is", "We": "are", "They": "are" }
          }
        },
        "distractors": [
          "She always is happy.",
          "They is usually late.",
          "She walk always to school.",
          "He always walk.",
          "She is happy always.",
          "We is sometimes late.",
          "He never helps not his dad."
        ],
        "irregulars": {}
      }
    }
  ],
  "phonics": {
    "position": "medial",
    "focus": ["ar", "ai", "oa"],
    "soundLabels": {
      "ar": { "ipa": "/ɑː/", "anchor": "star", "position": "medial", "say_vi": "TIẾP TỤC CỦNG CỐ từ bài trước. âm Ở GIỮA từ \"star\" là /ɑː/ — mở miệng to, kéo dài \"a\" (giống \"aa\" trong tiếng Việt, không đọc tên chữ \"a-rờ\")" },
      "ai": { "ipa": "/eɪ/", "anchor": "rain", "position": "medial", "say_vi": "ÔN LẠI từ bài trước. âm Ở GIỮA từ \"rain\" là /eɪ/ — đọc trượt từ \"ê\" sang \"i\" (giống \"ây\"), không đọc rời \"a\" và \"i\"" },
      "oa": { "ipa": "/əʊ/", "anchor": "boat", "position": "medial", "say_vi": "ÂM MỚI. âm Ở GIỮA từ \"boat\" là /əʊ/ — đọc trượt từ \"ơ\" sang \"u\" (giống \"âu\"), không đọc thành \"o\" ngắn" }
    },
    "words": [
      { "word": "star", "icon": "⭐", "focusSound": "ar", "anchor": "star", "position": "medial", "audio": "" },
      { "word": "car", "icon": "🚗", "focusSound": "ar", "anchor": "star", "position": "medial", "audio": "" },
      { "word": "park", "icon": "🏞️", "focusSound": "ar", "anchor": "star", "position": "medial", "audio": "" },
      { "word": "rain", "icon": "🌧️", "focusSound": "ai", "anchor": "rain", "position": "medial", "audio": "" },
      { "word": "train", "icon": "🚆", "focusSound": "ai", "anchor": "rain", "position": "medial", "audio": "" },
      { "word": "boat", "icon": "⛵", "focusSound": "oa", "anchor": "boat", "position": "medial", "audio": "" },
      { "word": "goat", "icon": "🐐", "focusSound": "oa", "anchor": "boat", "position": "medial", "audio": "" },
      { "word": "coat", "icon": "🧥", "focusSound": "oa", "anchor": "boat", "position": "medial", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "my-week-and-weekend",
      "title": "My week and my weekend",
      "title_vi": "Tuần học và cuối tuần của em",
      "text": "My name is Linh. On school days, I always wake up at six in the morning. I usually walk to school with my friend Nam. After school, I always do my homework first. I sometimes help my mum in the kitchen. On the weekend, I never wake up early. We usually visit Grandma and tidy her garden. I am always happy on Saturday!",
      "teacherNote_vi": "Đoạn dùng present simple để nói thói quen, với cả bốn trạng từ tần suất (always, usually, sometimes, never) đặt ĐÚNG vị trí: TRƯỚC động từ thường (\"I always wake up\", \"I usually walk\", \"I sometimes help\", \"I never wake up\") và SAU be (\"I am always happy\"). Từ vựng controlled từ vocab: wake up, walk, homework, help, tidy, weekend, morning. \"park\" của phonics không xuất hiện ở đây nhưng \"morning\" có âm /ɔː/ gần với nhóm âm r; trọng tâm phonics ar/ai/oa luyện tách riêng. Đoạn gồm 8 câu (theo . !), vừa ngưỡng 6-8.",
      "questions": [
        { "id": "q1", "q_vi": "Bạn Linh luôn thức dậy lúc 6 giờ vào ngày đi học, đúng không?", "type": "truefalse", "answer": true, "audioText": "Linh always wakes up at six on school days." },
        { "id": "q2", "q_vi": "Linh thường đến trường bằng cách nào?", "type": "mcq", "choices": ["walks to school", "rides a bike", "goes by car"], "answer": 0, "audioText": "How does Linh usually go to school?" },
        { "id": "q3", "q_vi": "Vào cuối tuần, Linh dậy sớm thường xuyên đến mức nào?", "type": "mcq", "choices": ["never", "always", "usually"], "answer": 0, "audioText": "How often does Linh wake up early on the weekend?" },
        { "id": "q4", "q_vi": "Linh thỉnh thoảng làm gì để giúp mẹ?", "type": "mcq", "choices": ["helps in the kitchen", "tidies the garden", "walks the dog"], "answer": 0, "audioText": "What does Linh sometimes do for her mum?" },
        { "id": "q5", "q_vi": "Vào thứ Bảy, Linh cảm thấy thế nào?", "type": "mcq", "choices": ["always happy", "always tired", "sometimes sad"], "answer": 0, "audioText": "How does Linh feel on Saturday?" }
      ]
    }
  ],
  "speaking": [
    {
      "id": "talk-about-my-habits",
      "title_vi": "Nói về thói quen của em",
      "prompt_vi": "Hãy nói thật về thói quen của em: việc gì em luôn làm, thường làm, thỉnh thoảng làm, và không bao giờ làm. Nhớ đặt trạng từ TRƯỚC động từ.",
      "sentenceFrames": [
        "I always ___.",
        "I usually ___.",
        "I sometimes ___.",
        "I never ___."
      ],
      "audioModels": [
        "I always brush my teeth.",
        "I usually walk to school.",
        "I sometimes help my mum.",
        "I never eat fast food."
      ]
    },
    {
      "id": "ask-how-often",
      "title_vi": "Hỏi bạn làm việc đó thường xuyên không",
      "prompt_vi": "Hỏi một người bạn xem họ có hay làm một việc nào đó không, rồi nghe bạn trả lời bằng trạng từ tần suất. Sau đó kể lại bằng \"He/She...\" và nhớ thêm \"s\" vào động từ.",
      "sentenceFrames": [
        "Do you ___ on the weekend?",
        "She usually ___.",
        "He never ___."
      ],
      "audioModels": [
        "Do you tidy your room on the weekend?",
        "She usually helps her mum.",
        "He never wakes up late."
      ]
    }
  ],
  "audioNotes": "Nên thu âm người thật cho: audioModels phần speaking và audioText câu hỏi reading. TRỌNG TÂM phonics lần này là NGUYÊN ÂM ĐÔI / ÂM R Ở GIỮA. Trong đó \"oa\" là ÂM MỚI của bài; \"ar\" và \"ai\" là TIẾP NỐI từ lesson01 cùng Level 3 (ôn lại, củng cố). Cụ thể: star, car, park (ar /ɑː/ — mở miệng to, KHÔNG bật âm /r/ rõ kiểu Mỹ và KHÔNG đọc tên chữ \"a-rờ\"); rain, train (ai /eɪ/ — trượt ê→i, không tách rời); boat, goat, coat (oa /əʊ/ — trượt ơ→u, không đọc thành \"o\" ngắn). TTS rất hay đọc sai các nguyên âm đôi này thành nguyên âm ngắn hoặc đọc rời từng chữ, nên BẮT BUỘC cần giọng người thật. Câu mẫu grammar cần audio chuẩn để bé nghe rõ VỊ TRÍ trạng từ: \"I usually play after school.\" (trạng từ TRƯỚC động từ thường) và \"She is always happy.\" (trạng từ SAU be) — đây là điểm bé hay nhầm. Lưu ý đọc rõ đuôi -s ở \"walks\", \"helps\", \"tidies\", \"wakes\" trong các câu he/she."
};
  C["level3/lesson03.json"] = {
  "schemaVersion": "v1",
  "level": 3,
  "unit": 303,
  "lesson": 3,
  "topic": "Plans and the future",
  "topic_vi": "Kế hoạch & tương lai",
  "vocab": [
    { "word": "tomorrow", "vi": "ngày mai", "icon": "📅", "example": "Tomorrow is Saturday.", "partOfSpeech": "adverb", "audio": "" },
    { "word": "plan", "vi": "kế hoạch / dự định", "icon": "📝", "example": "I have a plan for the weekend.", "partOfSpeech": "noun", "audio": "" },
    { "word": "weekend", "vi": "cuối tuần", "icon": "🗓️", "example": "We are going to visit Grandma this weekend.", "partOfSpeech": "noun", "audio": "" },
    { "word": "visit", "vi": "đi thăm", "icon": "🏡", "example": "I am going to visit my friend.", "partOfSpeech": "verb", "audio": "" },
    { "word": "stay", "vi": "ở lại", "icon": "🏠", "example": "We will stay at home today.", "partOfSpeech": "verb", "audio": "" },
    { "word": "help", "vi": "giúp đỡ", "icon": "🤝", "example": "I will help my mum.", "partOfSpeech": "verb", "audio": "" },
    { "word": "tidy", "vi": "dọn dẹp / gọn gàng", "icon": "🧹", "example": "I have to tidy my room.", "partOfSpeech": "verb", "audio": "" },
    { "word": "picnic", "vi": "buổi dã ngoại", "icon": "🧺", "example": "We are going to have a picnic.", "partOfSpeech": "noun", "audio": "" },
    { "word": "weather", "vi": "thời tiết", "icon": "🌤️", "example": "The weather is nice today.", "partOfSpeech": "noun", "audio": "" },
    { "word": "sunny", "vi": "nắng", "icon": "☀️", "example": "It will be sunny tomorrow.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "rainy", "vi": "mưa", "icon": "🌧️", "example": "It will be rainy on Sunday.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "windy", "vi": "gió", "icon": "🌬️", "example": "It is windy, so we will fly a kite.", "partOfSpeech": "adjective", "audio": "" }
  ],
  "grammar": [
    {
      "id": "be-going-to-plans",
      "title_vi": "Nói dự định: \"be going to\" (định / sắp làm gì)",
      "explain_vi": "Khi em đã có kế hoạch hoặc dự định làm gì, em dùng \"be going to + động từ\". Nhớ chọn \"to be\" cho đúng chủ ngữ: I → am, he/she/it → is, you/we/they → are. Ví dụ: \"I am going to visit Grandma.\" (Em định đi thăm Bà), \"We are going to have a picnic.\" (Chúng em định đi dã ngoại). Sau \"going to\" luôn là động từ nguyên thể (visit, help, stay...).",
      "examples": [
        "I am going to visit my friend.",
        "We are going to have a picnic.",
        "She is going to help her mum.",
        "They are going to stay at home."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "subj-be-going-to-verb", "text": "{subj} {be} going to {verb} this weekend.", "blanks": ["be"], "context_vi": "Nói ai đó ĐỊNH làm gì cuối tuần. Chọn am/is/are cho đúng chủ ngữ.", "audioText": "I am going to visit Grandma this weekend." },
          { "id": "be-going-to-have-picnic", "text": "{subj} {be} going to have a picnic.", "blanks": ["be"], "context_vi": "Nói ai đó ĐỊNH đi dã ngoại. Chọn am/is/are cho đúng chủ ngữ.", "audioText": "We are going to have a picnic." },
          { "id": "be-going-to-pick-verb", "text": "I am going to {verb} tomorrow.", "blanks": ["verb"], "context_vi": "Chọn một động từ NGUYÊN THỂ để nói em định làm gì ngày mai.", "audioText": "I am going to help my mum tomorrow." }
        ],
        "slots": {
          "subj": ["I", "He", "She", "We", "They", "You"],
          "be": ["am", "is", "are"],
          "verb": ["visit Grandma", "help my mum", "tidy my room", "stay at home"]
        },
        "answerKey": {
          "subj-be-going-to-verb": {
            "be": { "__cond": "subj", "I": "am", "He": "is", "She": "is", "We": "are", "They": "are", "You": "are" }
          },
          "be-going-to-have-picnic": {
            "be": { "__cond": "subj", "I": "am", "He": "is", "She": "is", "We": "are", "They": "are", "You": "are" }
          }
        },
        "distractors": [
          "I is going to visit Grandma.",
          "She are going to help her mum.",
          "We is going to have a picnic.",
          "They am going to stay at home.",
          "I am going to visited Grandma.",
          "He going to tidy his room."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "will-future",
      "title_vi": "Nói về tương lai với \"will\": dự đoán & quyết định ngay (sẽ)",
      "explain_vi": "Em dùng \"will + động từ\" để nói điều SẼ xảy ra hoặc điều em quyết định làm ngay lúc nói. \"will\" dùng giống nhau cho mọi chủ ngữ (I will, he will, they will...) và sau \"will\" luôn là động từ nguyên thể. Ví dụ: \"It will be sunny tomorrow.\" (Ngày mai trời sẽ nắng), \"I will help you.\" (Em sẽ giúp bạn). Câu phủ định dùng \"will not\" hoặc viết gọn \"won't\".",
      "examples": [
        "It will be sunny tomorrow.",
        "I will help my mum.",
        "We will stay at home.",
        "It won't be rainy on Sunday."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "it-will-be-weather", "text": "It will be {weather} tomorrow.", "blanks": ["weather"], "context_vi": "Đoán thời tiết ngày mai. Chọn một từ chỉ thời tiết.", "audioText": "It will be sunny tomorrow." },
          { "id": "subj-will-verb", "text": "{subj} will {verb}.", "blanks": ["verb"], "context_vi": "Nói ai đó SẼ làm gì. Sau \"will\" là động từ nguyên thể.", "audioText": "I will help my mum." },
          { "id": "tomorrow-it-will-be", "text": "Tomorrow it will be {weather}.", "blanks": ["weather"], "context_vi": "Đoán thời tiết NGÀY MAI. \"will\" dùng giống nhau cho mọi chủ ngữ.", "audioText": "Tomorrow it will be rainy." }
        ],
        "slots": {
          "subj": ["I", "He", "She", "We", "They", "You"],
          "weather": ["sunny", "rainy", "windy"],
          "verb": ["help my mum", "stay at home", "visit Grandma", "tidy my room"]
        },
        "answerKey": {},
        "distractors": [
          "It will is sunny tomorrow.",
          "I will helps my mum.",
          "She will to stay at home.",
          "We wills visit Grandma.",
          "It will sunny tomorrow.",
          "I am will help you."
        ],
        "irregulars": {}
      }
    }
  ],
  "recognition": [
    {
      "id": "meet-must-have-to",
      "title_vi": "Làm quen: \"must\" / \"have to\" — việc PHẢI làm (bổn phận)",
      "explain_vi": "Phần này chỉ để LÀM QUEN (nghe và chọn), em CHƯA cần tự đặt câu. \"must\" và \"have to\" đều có nghĩa là PHẢI làm việc gì đó (bổn phận). Ví dụ: \"I must tidy my room.\" / \"I have to tidy my room.\" đều có nghĩa là em PHẢI dọn phòng. Em chỉ cần nghe câu rồi chọn xem đó là việc PHẢI làm (bổn phận) hay là một DỰ ĐỊNH / điều SẼ xảy ra.",
      "examples": [
        "I must tidy my room.",
        "We have to help at home.",
        "I am going to have a picnic.",
        "It will be sunny tomorrow."
      ],
      "generators": ["listen_choose", "mcq"],
      "items": [
        { "id": "rec-must-tidy", "audioText": "I must tidy my room.", "meaning_vi": "Em PHẢI dọn phòng (bổn phận).", "choices_vi": ["Việc PHẢI làm (bổn phận)", "Dự định / điều sẽ xảy ra"], "answer": 0 },
        { "id": "rec-have-to-help", "audioText": "We have to help at home.", "meaning_vi": "Chúng em PHẢI giúp việc nhà (bổn phận).", "choices_vi": ["Việc PHẢI làm (bổn phận)", "Dự định / điều sẽ xảy ra"], "answer": 0 },
        { "id": "rec-going-to-picnic", "audioText": "I am going to have a picnic.", "meaning_vi": "Em ĐỊNH đi dã ngoại (dự định).", "choices_vi": ["Việc PHẢI làm (bổn phận)", "Dự định / điều sẽ xảy ra"], "answer": 1 },
        { "id": "rec-will-sunny", "audioText": "It will be sunny tomorrow.", "meaning_vi": "Ngày mai trời SẼ nắng (điều sẽ xảy ra).", "choices_vi": ["Việc PHẢI làm (bổn phận)", "Dự định / điều sẽ xảy ra"], "answer": 1 },
        { "id": "rec-must-stay", "audioText": "It is rainy, so we must stay at home.", "meaning_vi": "Trời mưa nên chúng em PHẢI ở nhà (bổn phận).", "choices_vi": ["Việc PHẢI làm (bổn phận)", "Dự định / điều sẽ xảy ra"], "answer": 0 },
        { "id": "rec-going-to-visit", "audioText": "She is going to visit Grandma.", "meaning_vi": "Bạn ấy ĐỊNH đi thăm Bà (dự định).", "choices_vi": ["Việc PHẢI làm (bổn phận)", "Dự định / điều sẽ xảy ra"], "answer": 1 }
      ]
    }
  ],
  "phonics": {
    "position": "medial",
    "focus": ["ai", "oa", "ar", "ee"],
    "newSounds": ["ai", "oa", "ar"],
    "reviewSounds": ["ee"],
    "note_vi": "Bài lớn 3 học 3 ÂM MỚI: nguyên âm đôi /eɪ/ (ai) và /əʊ/ (oa), cùng âm-r /ɑː/ (ar). Âm /iː/ (ee) chỉ ÔN LẠI (đã làm quen ở Level 2 dạng nguyên âm dài), không tính là âm mới — để bé không phải nhớ quá nhiều âm một lúc.",
    "soundLabels": {
      "ai": { "ipa": "/eɪ/", "anchor": "rain", "position": "medial", "say_vi": "âm GIỮA từ \"rain\" là /eɪ/ — hai chữ a-i đi cùng nhau đọc thành MỘT âm \"ây\", không tách rời thành a rồi i" },
      "oa": { "ipa": "/əʊ/", "anchor": "boat", "position": "medial", "say_vi": "âm GIỮA từ \"boat\" là /əʊ/ — hai chữ o-a đi cùng nhau đọc thành MỘT âm \"âu\", không tách rời thành o rồi a" },
      "ar": { "ipa": "/ɑː/", "anchor": "park", "position": "medial", "say_vi": "âm GIỮA từ \"park\" là /ɑː/ — chữ a đứng trước r đọc thành \"a\" dài, KHÔNG đọc tên chữ r ở cuối" },
      "ee": { "ipa": "/iː/", "anchor": "week", "position": "medial", "say_vi": "ÔN LẠI: âm GIỮA từ \"week\" là /iː/ — hai chữ e-e đọc thành một âm \"i\" kéo dài (em đã gặp âm này ở Level 2)" }
    },
    "words": [
      { "word": "rain", "icon": "🌧️", "focusSound": "ai", "anchor": "rain", "position": "medial", "audio": "" },
      { "word": "train", "icon": "🚆", "focusSound": "ai", "anchor": "rain", "position": "medial", "audio": "" },
      { "word": "boat", "icon": "⛵", "focusSound": "oa", "anchor": "boat", "position": "medial", "audio": "" },
      { "word": "coat", "icon": "🧥", "focusSound": "oa", "anchor": "boat", "position": "medial", "audio": "" },
      { "word": "park", "icon": "🌳", "focusSound": "ar", "anchor": "park", "position": "medial", "audio": "" },
      { "word": "car", "icon": "🚗", "focusSound": "ar", "anchor": "park", "position": "medial", "audio": "" },
      { "word": "week", "icon": "🗓️", "focusSound": "ee", "anchor": "week", "position": "medial", "isReview": true, "audio": "" },
      { "word": "tree", "icon": "🌲", "focusSound": "ee", "anchor": "week", "position": "medial", "isReview": true, "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "our-weekend-plan",
      "title": "Our weekend plan",
      "title_vi": "Kế hoạch cuối tuần của chúng em",
      "text": "Tomorrow is Saturday, and we have a plan. The weather will be sunny, so we are going to have a picnic in the park. First, I have to tidy my room and help my mum. Then we are going to visit Grandma. My sister will bring her kite, and we will fly it together. On Sunday it will be rainy, so we are going to stay at home. It is going to be a happy weekend!",
      "teacherNote_vi": "Đoạn gồm 7 câu (theo dấu . ! ?). Gói gọn trọng tâm BÀI LỚN 3: be going to (are going to have/visit/stay, is going to be) cho dự định + will (will be sunny/rainy, will bring, will fly) cho dự đoán/quyết định + một câu have to (bổn phận, đã làm quen ở phần recognition). Ôn lại từ Level 2: in the park, at home, kite. Từ ngoài vocab chỉ thêm First/Then/together (từ nối dễ đoán, i+1).",
      "questions": [
        { "id": "q1", "q_vi": "Cả nhà có kế hoạch cho ngày mai (thứ Bảy), đúng không?", "type": "truefalse", "answer": true, "audioText": "They have a plan for Saturday." },
        { "id": "q2", "q_vi": "Thứ Bảy thời tiết sẽ thế nào?", "type": "mcq", "choices": ["It will be sunny.", "It will be rainy.", "It will be windy."], "answer": 0, "audioText": "What will the weather be like on Saturday?" },
        { "id": "q3", "q_vi": "Trước khi đi chơi, bạn nhỏ phải làm gì?", "type": "mcq", "choices": ["tidy the room and help mum", "cook dinner", "wash the car"], "answer": 0, "audioText": "What does the child have to do first?" },
        { "id": "q4", "q_vi": "Cả nhà định đi thăm ai?", "type": "mcq", "choices": ["Grandma", "a friend", "the teacher"], "answer": 0, "audioText": "Who are they going to visit?" },
        { "id": "q5", "q_vi": "Chủ nhật trời mưa thì cả nhà sẽ làm gì?", "type": "mcq", "choices": ["stay at home", "go to the beach", "fly a kite"], "answer": 0, "audioText": "What will they do on rainy Sunday?" }
      ]
    }
  ],
  "speaking": [
    {
      "id": "tell-my-weekend-plan",
      "title_vi": "Kể kế hoạch cuối tuần của em (be going to)",
      "prompt_vi": "Hãy kể em ĐỊNH làm gì cuối tuần này. Điền việc thật của em vào chỗ trống. Nhớ dùng \"I am going to\" và động từ nguyên thể nhé.",
      "sentenceFrames": [
        "This weekend I am going to ___.",
        "I am going to visit ___.",
        "We are going to ___."
      ],
      "audioModels": [
        "This weekend I am going to have a picnic.",
        "I am going to visit Grandma.",
        "We are going to stay at home."
      ]
    },
    {
      "id": "say-will-future",
      "title_vi": "Dự đoán thời tiết và việc em sẽ làm (will)",
      "prompt_vi": "Hãy đoán thời tiết ngày mai và nói một việc em SẼ làm. Dùng \"will + động từ nguyên thể\". Em có thể nói thêm em PHẢI làm gì (have to) nếu muốn.",
      "sentenceFrames": [
        "Tomorrow it will be ___.",
        "I will ___.",
        "I have to ___."
      ],
      "audioModels": [
        "Tomorrow it will be sunny.",
        "I will help my mum.",
        "I have to tidy my room."
      ]
    }
  ],
  "audioNotes": "Cần thu âm người thật cho: (1) Phonics Level 3 — bài này gọn còn 4 âm: 3 ÂM MỚI gồm nguyên âm đôi (vowel teams) /eɪ/ ai (rain, train), /əʊ/ oa (boat, coat) và âm r (r-controlled) /ɑː/ ar (park, car); cộng 1 ÂM ÔN /iː/ ee (week, tree) — đánh dấu isReview vì đã làm quen ở Level 2. (Đã bỏ /ɔː/ or 'morning' khỏi bài này cho nhẹ tải nhận thức của trẻ ~9 tuổi; để dành cho bài phonics sau.) TTS dễ tách rời 2 chữ cái (đọc 'a-i', 'o-a', 'e-e') hoặc đọc rõ tên chữ 'r' ở ar — loa PHẢI đọc TỪ TRỌN VẸN: ai/oa/ee là MỘT âm liền, ar kéo dài nguyên âm và KHÔNG bật âm 'r' rõ kiểu Mỹ-cường. (2) Cặp câu mẫu grammar để bé bắt chước ngữ điệu: 'I am going to visit Grandma.' (be going to) và 'It will be sunny tomorrow.' / 'I will help you.' (will) — đọc rõ dạng rút gọn won't ở câu phủ định nếu thu thêm. (3) Phần recognition must/have to — đọc rõ cặp 'I must tidy my room.' và 'We have to help at home.' để phân biệt với 'going to / will'. (4) audioModels phần speaking và audioText câu hỏi reading. Ghi chú recycling: 'in the park', 'at home', 'kite' dùng lại từ Level 2 có chủ đích (ôn tập); trọng tâm MỚI là cấu trúc tương lai be going to + will và bổn phận must/have to (làm quen)."
};
  C["level3/lesson04.json"] = {
  "schemaVersion": "v1",
  "level": 3,
  "unit": 304,
  "lesson": 4,
  "topic": "What was happening: yesterday's moments",
  "topic_vi": "Việc đang & đã diễn ra",
  "vocab": [
    { "word": "playing", "vi": "đang chơi", "icon": "⚽", "example": "I was playing football at four o'clock.", "partOfSpeech": "verb", "audio": "" },
    { "word": "reading", "vi": "đang đọc", "icon": "📖", "example": "She was reading a book in her room.", "partOfSpeech": "verb", "audio": "" },
    { "word": "sleeping", "vi": "đang ngủ", "icon": "😴", "example": "The cat was sleeping on the sofa.", "partOfSpeech": "verb", "audio": "" },
    { "word": "cooking", "vi": "đang nấu ăn", "icon": "🍳", "example": "Mum was cooking in the kitchen.", "partOfSpeech": "verb", "audio": "" },
    { "word": "drawing", "vi": "đang vẽ", "icon": "🖍️", "example": "We were drawing a big star.", "partOfSpeech": "verb", "audio": "" },
    { "word": "running", "vi": "đang chạy", "icon": "🏃", "example": "The dog was running in the park.", "partOfSpeech": "verb", "audio": "" },
    { "word": "raining", "vi": "trời đang mưa", "icon": "🌧️", "example": "It was raining all morning.", "partOfSpeech": "verb", "audio": "" },
    { "word": "snowing", "vi": "trời đang có tuyết", "icon": "🌨️", "example": "It was snowing at six o'clock.", "partOfSpeech": "verb", "audio": "" },
    { "word": "watching", "vi": "đang xem", "icon": "📺", "example": "They were watching TV after dinner.", "partOfSpeech": "verb", "audio": "" },
    { "word": "this morning", "vi": "sáng nay", "icon": "🌅", "example": "This morning I was eating breakfast at seven.", "partOfSpeech": "phrase", "audio": "" },
    { "word": "last night", "vi": "tối qua", "icon": "🌙", "example": "Last night we were reading a story.", "partOfSpeech": "phrase", "audio": "" },
    { "word": "at six o'clock", "vi": "lúc sáu giờ", "icon": "🕕", "example": "At six o'clock Dad was driving home.", "partOfSpeech": "phrase", "audio": "" },
    { "word": "when", "vi": "khi / lúc", "icon": "⏰", "example": "I was sleeping when the phone rang.", "partOfSpeech": "conjunction", "audio": "" }
  ],
  "grammar": [
    {
      "id": "past-continuous-was-were-ving",
      "title_vi": "Việc ĐANG diễn ra trong quá khứ: was / were + V-ing",
      "explain_vi": "Khi muốn kể một việc ĐANG XẢY RA tại một thời điểm trong quá khứ (ví dụ \"lúc sáu giờ\", \"sáng nay\"), em dùng was/were + động từ thêm \"-ing\". Với I, he, she, it dùng \"was\"; với you, we, they dùng \"were\". Ví dụ: \"I was playing football at four o'clock.\" (Lúc bốn giờ em đang chơi bóng), \"They were watching TV.\" (Họ đang xem ti vi). Khác với quá khứ đơn (đã làm xong) như \"I played\", dạng này nhấn mạnh việc ĐANG diễn ra, chưa xong.",
      "examples": [
        "I was playing football at four o'clock.",
        "She was reading a book in her room.",
        "We were drawing a big star.",
        "It was raining this morning."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "subj-be-ving-time", "text": "{subj} {be} {verbing} {time}.", "blanks": ["be"], "context_vi": "Kể một việc ĐANG diễn ra tại một thời điểm trong quá khứ. Chọn was hay were cho đúng với chủ ngữ.", "audioText": "I was playing football at four o'clock." },
          { "id": "it-was-raining", "text": "It {be} {weatherving} {time}.", "blanks": ["be"], "context_vi": "Nói trời ĐANG mưa hay đang có nắng tại một thời điểm trong quá khứ. Với \"it\" luôn dùng was.", "audioText": "It was raining this morning." },
          { "id": "clause-was-were-ving", "text": "{clause} {time}.", "blanks": ["clause"], "context_vi": "Chọn cụm chủ-ngữ + was/were + động-từ-ing ĐÚNG để kể việc đang diễn ra. Mọi cụm trong danh sách đều đúng was/were theo chủ ngữ.", "audioText": "She was reading this morning." }
        ],
        "slots": {
          "subj": ["I", "He", "She", "We", "They", "You"],
          "be": ["was", "were"],
          "verbing": ["playing", "reading", "sleeping", "cooking", "drawing", "running", "watching"],
          "weatherving": ["raining", "snowing"],
          "time": ["this morning", "last night", "at six o'clock", "at four o'clock"],
          "clause": [
            "I was playing",
            "He was reading",
            "She was cooking",
            "We were drawing",
            "They were watching",
            "You were running"
          ]
        },
        "answerKey": {
          "subj-be-ving-time": {
            "be": { "__cond": "subj", "I": "was", "He": "was", "She": "was", "We": "were", "They": "were", "You": "were" }
          },
          "it-was-raining": {
            "be": { "__cond": "weatherving", "raining": "was", "snowing": "was" }
          }
        },
        "distractors": [
          "I were playing football at four o'clock.",
          "She were reading a book in her room.",
          "We was drawing a big star.",
          "They was watching TV.",
          "It were raining this morning.",
          "I was play football at four o'clock.",
          "She was read a book this morning.",
          "He were sleeping last night."
        ],
        "irregulars": {
          "play": "playing",
          "read": "reading",
          "sleep": "sleeping",
          "cook": "cooking",
          "draw": "drawing",
          "run": "running",
          "watch": "watching"
        }
      }
    },
    {
      "id": "when-while-past-continuous",
      "title_vi": "Nối câu với \"when\" và \"while\": một việc ĐANG diễn ra thì việc khác xảy ra",
      "explain_vi": "Để kể \"em đang làm việc A thì việc B xảy ra\", em dùng was/were + V-ing cho việc ĐANG diễn ra (việc dài hơn), và quá khứ đơn cho việc xảy ra CẮT NGANG (việc ngắn). Dùng \"when\" trước việc ngắn: \"I was sleeping when the phone rang.\" (Em đang ngủ thì điện thoại reo). Dùng \"while\" trước việc đang diễn ra: \"While I was reading, my mum called me.\" (Trong khi em đang đọc, mẹ gọi em). Chú ý: việc ĐANG diễn ra vẫn cần was/were + V-ing.",
      "examples": [
        "I was sleeping when the phone rang.",
        "She was cooking when I came home.",
        "While we were playing, it started to rain.",
        "While they were watching TV, Dad arrived."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "subj-be-ving-when", "text": "{subj} {be} {verbing} when the phone rang.", "blanks": ["be"], "context_vi": "Một việc ĐANG diễn ra thì điện thoại reo (việc ngắn cắt ngang). Chọn was hay were cho việc đang diễn ra.", "audioText": "I was sleeping when the phone rang." },
          { "id": "while-clause-rain", "text": "While {clauseLower}, it started to rain.", "blanks": ["clauseLower"], "context_vi": "Trong khi ai đó ĐANG làm việc gì thì trời bắt đầu mưa. Chọn cụm chủ-ngữ + was/were + V-ing ĐÚNG (đặt giữa câu nên viết thường).", "audioText": "While we were playing, it started to rain." },
          { "id": "clause-when-dad", "text": "{clause} when Dad came home.", "blanks": ["clause"], "context_vi": "Chọn cụm chủ-ngữ + was/were + V-ing ĐÚNG cho việc đang diễn ra khi bố về nhà.", "audioText": "She was cooking when Dad came home." }
        ],
        "slots": {
          "subj": ["I", "He", "She", "We", "They", "You"],
          "be": ["was", "were"],
          "verbing": ["sleeping", "reading", "cooking", "playing", "drawing", "watching"],
          "clause": [
            "I was sleeping",
            "He was reading",
            "She was cooking",
            "We were playing",
            "They were watching",
            "You were drawing"
          ],
          "clauseLower": [
            "I was sleeping",
            "he was reading",
            "she was cooking",
            "we were playing",
            "they were watching",
            "you were drawing"
          ]
        },
        "answerKey": {
          "subj-be-ving-when": {
            "be": { "__cond": "subj", "I": "was", "He": "was", "She": "was", "We": "were", "They": "were", "You": "were" }
          }
        },
        "distractors": [
          "I were sleeping when the phone rang.",
          "She were cooking when Dad came home.",
          "While we was playing, it started to rain.",
          "While they was watching TV, Dad arrived.",
          "I was sleep when the phone rang.",
          "She was cook when Dad came home.",
          "While we were play, it started to rain.",
          "He were reading when the phone rang."
        ],
        "irregulars": {
          "ring": "rang",
          "come": "came",
          "start": "started"
        }
      }
    }
  ],
  "phonics": {
    "position": "medial",
    "focus": ["ar", "or", "oo", "ee"],
    "soundLabels": {
      "ar": { "ipa": "/ɑː/", "anchor": "star", "position": "medial", "say_vi": "âm GIỮA từ \"star\" là /ɑː/ — đọc dài \"a\" có âm r nhẹ phía sau, không đọc rời từng chữ a-r" },
      "or": { "ipa": "/ɔː/", "anchor": "fork", "position": "medial", "say_vi": "âm GIỮA từ \"fork\" là /ɔː/ — đọc tròn môi \"o\" dài, không đọc rời o-r" },
      "oo": { "ipa": "/uː/", "anchor": "moon", "position": "medial", "say_vi": "âm GIỮA từ \"moon\" là /uː/ — đọc dài \"u\", không đọc thành hai chữ o" },
      "ee": { "ipa": "/iː/", "anchor": "tree", "position": "medial", "say_vi": "âm GIỮA từ \"tree\" là /iː/ — đọc dài \"i\", không đọc thành hai chữ e" }
    },
    "words": [
      { "word": "star", "icon": "⭐", "focusSound": "ar", "anchor": "star", "position": "medial", "audio": "" },
      { "word": "car", "icon": "🚗", "focusSound": "ar", "anchor": "star", "position": "medial", "audio": "" },
      { "word": "fork", "icon": "🍴", "focusSound": "or", "anchor": "fork", "position": "medial", "audio": "" },
      { "word": "corn", "icon": "🌽", "focusSound": "or", "anchor": "fork", "position": "medial", "audio": "" },
      { "word": "moon", "icon": "🌙", "focusSound": "oo", "anchor": "moon", "position": "medial", "audio": "" },
      { "word": "spoon", "icon": "🥄", "focusSound": "oo", "anchor": "moon", "position": "medial", "audio": "" },
      { "word": "tree", "icon": "🌳", "focusSound": "ee", "anchor": "tree", "position": "medial", "audio": "" },
      { "word": "sheep", "icon": "🐑", "focusSound": "ee", "anchor": "tree", "position": "medial", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "what-we-were-doing-last-night",
      "title": "What we were doing last night",
      "title_vi": "Tối qua nhà em đang làm gì",
      "text": "Last night at eight o'clock my family was very busy. I was reading a story in my room. My little sister was sleeping in her bed. Mum was cooking dinner in the kitchen, and Dad was watching the news on TV. While we were doing all these things, it started to rain. Then the lights went off! We were all in the dark, but we were not afraid. We found a candle and sat together. It was a funny night, and we were happy.",
      "teacherNote_vi": "Đoạn 8 câu (theo dấu . ! ?). Gói trọng tâm BÀI LỚN 4: was/were + V-ing (was reading, was sleeping, was cooking, was watching, were doing) + nối câu với while + việc ngắn cắt ngang ở quá khứ đơn (it started to rain, the lights went off). Từ ngoài vocab chỉ thêm 'candle', 'dark', 'news' (i+1, dễ đoán nhờ ngữ cảnh mất điện); 'happy', 'family', 'story', 'kitchen', 'room' đã quen từ Level 1-2 (recycling). Cụm 'the lights went off' và 'candle' được chú thích ở 'glosses' để bé không hiểu sai mạch truyện MẤT ĐIỆN.",
      "glosses": [
        { "word": "the lights went off", "vi": "đèn tắt phụt (mất điện)", "icon": "💡", "note_vi": "Cả nhà mất điện nên tối thui — đây là việc ngắn cắt ngang lúc cả nhà đang bận." },
        { "word": "candle", "vi": "cây nến", "icon": "🕯️", "note_vi": "Cây nến đốt lên để có ánh sáng khi mất điện." },
        { "word": "in the dark", "vi": "trong bóng tối", "icon": "🌑", "note_vi": "Vì mất điện nên cả nhà ở trong bóng tối, nhưng không sợ." }
      ],
      "questions": [
        { "id": "q1", "q_vi": "Lúc tám giờ tối qua bạn nhỏ đang làm gì?", "type": "mcq", "choices": ["reading a story", "watching TV", "cooking dinner"], "answer": 0, "audioText": "What was the child doing at eight o'clock?" },
        { "id": "q2", "q_vi": "Em gái nhỏ đang ngủ, đúng không?", "type": "truefalse", "answer": true, "audioText": "The little sister was sleeping." },
        { "id": "q3", "q_vi": "Mẹ đang làm gì trong bếp?", "type": "mcq", "choices": ["cooking dinner", "reading a book", "sleeping"], "answer": 0, "audioText": "What was Mum doing in the kitchen?" },
        { "id": "q4", "q_vi": "Chuyện gì xảy ra trong khi cả nhà đang bận?", "type": "mcq", "choices": ["It started to rain and the lights went off.", "A friend came to visit.", "They went to the park."], "answer": 0, "audioText": "What happened while the family was busy?" },
        { "id": "q5", "q_vi": "Cả nhà có sợ hãi không?", "type": "truefalse", "answer": false, "audioText": "Were they afraid?" }
      ]
    }
  ],
  "speaking": [
    {
      "id": "say-what-i-was-doing",
      "title_vi": "Kể việc em đang làm lúc nào đó tối qua",
      "prompt_vi": "Hãy kể em ĐANG làm gì vào một thời điểm tối qua hoặc sáng nay. Điền việc thật của em vào chỗ trống. Nhớ dùng \"I was\" + động từ thêm -ing nhé.",
      "sentenceFrames": [
        "Last night I was ___.",
        "This morning I was ___.",
        "At six o'clock I was ___."
      ],
      "audioModels": [
        "Last night I was reading a story.",
        "This morning I was eating breakfast.",
        "At six o'clock I was watching TV."
      ]
    },
    {
      "id": "say-when-while-sentence",
      "title_vi": "Nối hai việc bằng \"when\" hoặc \"while\"",
      "prompt_vi": "Kể một việc em đang làm thì có việc khác xảy ra. Dùng \"when\" trước việc ngắn, hoặc \"while\" trước việc đang diễn ra. Điền việc thật của em.",
      "sentenceFrames": [
        "I was ___ when ___.",
        "While I was ___, ___.",
        "We were ___ when ___."
      ],
      "audioModels": [
        "I was sleeping when the phone rang.",
        "While I was reading, my mum called me.",
        "We were playing when it started to rain."
      ]
    }
  ],
  "audioNotes": "Cần thu âm người thật cho: (1) Phonics nguyên âm GIỮA-từ /ɑː/ (star, car), /ɔː/ (fork, corn), /uː/ (moon, spoon), /iː/ (tree, sheep) — TTS dễ đọc 'ar/or/oo/ee' rời thành từng chữ cái hoặc làm ngắn nguyên âm, loa phải đọc TỪ TRỌN VẸN, kéo dài đúng nguyên âm và âm r của /ɑː/, /ɔː/ chỉ là màu sắc nhẹ (giọng Anh-Anh không cuộn r mạnh). (2) Cặp đúng/sai để bé phân biệt was/were: 'I was playing' vs sai 'I were playing'; 'We were drawing' vs sai 'We was drawing' — đọc rõ was /wɒz/ và were /wɜː/. (3) Đọc rõ dạng V-ing đầy đủ để bé không nuốt -ing: playing, reading, sleeping, cooking, drawing, running, watching, raining, snowing. (4) Các câu nối when/while: 'I was sleeping when the phone rang.', 'While we were playing, it started to rain.' — đọc rõ ngắt câu trước/sau when, while để bé nghe ra hai mệnh đề. (5) audioModels phần speaking và audioText câu hỏi reading. Ghi chú đối lập với quá khứ đơn đã học ở Level 2 (played/went): bài này nhấn việc ĐANG diễn ra (was playing) khác việc ĐÃ XONG (played) — nên đọc một cặp 'I was playing / I played' để bé cảm nhận khác biệt."
};
  C["level3/lesson05.json"] = {
  "schemaVersion": "v1",
  "level": 3,
  "unit": 305,
  "lesson": 5,
  "topic": "Reading and retelling a story",
  "topic_vi": "Đọc hiểu & kể lại",
  "vocab": [
    { "word": "story", "vi": "câu chuyện", "icon": "📖", "example": "I read a funny story yesterday.", "partOfSpeech": "noun", "audio": "" },
    { "word": "because", "vi": "bởi vì (nói lý do)", "icon": "🔗", "example": "I was happy because we went to the beach.", "partOfSpeech": "conjunction", "audio": "" },
    { "word": "so", "vi": "vì vậy / nên (nói kết quả)", "icon": "➡️", "example": "It was hot, so we had an ice cream.", "partOfSpeech": "conjunction", "audio": "" },
    { "word": "but", "vi": "nhưng (nói ý ngược lại)", "icon": "↔️", "example": "I was tired, but I was happy.", "partOfSpeech": "conjunction", "audio": "" },
    { "word": "found", "vi": "đã tìm thấy", "icon": "🔍", "example": "She found a little cat under the tree.", "partOfSpeech": "verb", "audio": "" },
    { "word": "lost", "vi": "bị lạc / đã mất", "icon": "🧭", "example": "The dog was lost in the park.", "partOfSpeech": "verb", "audio": "" },
    { "word": "helped", "vi": "đã giúp", "icon": "🤝", "example": "My brother helped the old man.", "partOfSpeech": "verb", "audio": "" },
    { "word": "cried", "vi": "đã khóc", "icon": "😢", "example": "The baby cried all night.", "partOfSpeech": "verb", "audio": "" },
    { "word": "laughed", "vi": "đã cười", "icon": "😄", "example": "We laughed at the funny clown.", "partOfSpeech": "verb", "audio": "" },
    { "word": "scared", "vi": "sợ hãi", "icon": "😨", "example": "The little girl was scared of the dark.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "excited", "vi": "phấn khích / háo hức", "icon": "🤩", "example": "We were excited about the trip.", "partOfSpeech": "adjective", "audio": "" },
    { "word": "surprised", "vi": "ngạc nhiên", "icon": "😲", "example": "Mum was surprised by the big gift.", "partOfSpeech": "adjective", "audio": "" }
  ],
  "grammar": [
    {
      "id": "linkers-because-so-but",
      "title_vi": "Nối ý bằng \"because\", \"so\" và \"but\"",
      "explain_vi": "Để câu chuyện hay hơn, em nối hai ý lại với nhau. Dùng \"because\" (bởi vì) để nói LÝ DO: việc xảy ra TRƯỚC đứng sau \"because\" (Ví dụ: \"I was happy because we won.\" — vui vì đã thắng). Dùng \"so\" (vì vậy/nên) để nói KẾT QUẢ: lý do đứng trước, kết quả đứng sau \"so\" (Ví dụ: \"It was hot, so we had an ice cream.\"). Dùng \"but\" (nhưng) khi hai ý NGƯỢC nhau (Ví dụ: \"I was tired, but I was happy.\").",
      "examples": [
        "I was happy because we went to the zoo.",
        "It was raining, so we played at home.",
        "The film was long, but it was fun.",
        "She cried because she lost her doll."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "happy-because", "text": "I was happy {link} {goodreason}.", "blanks": ["link"], "context_vi": "Câu nói LÝ DO làm em VUI (việc tốt nằm sau chỗ trống) nên phải chọn \"because\".", "audioText": "I was happy because we went to the zoo." },
          { "id": "sad-because", "text": "She was sad {link} {badreason}.", "blanks": ["link"], "context_vi": "Câu nói LÝ DO làm bạn ấy BUỒN (việc không vui nằm sau chỗ trống) nên phải chọn \"because\".", "audioText": "She was sad because she lost her doll." },
          { "id": "result-so", "text": "It was {cause}, {link} we {action}.", "blanks": ["link"], "context_vi": "Vế đầu là nguyên nhân, vế sau là KẾT QUẢ nên phải chọn \"so\".", "audioText": "It was raining, so we played at home." },
          { "id": "contrast-but", "text": "It was {firstidea}, {link} it was {secondidea}.", "blanks": ["link"], "context_vi": "Hai ý NGƯỢC nhau (một không hay, một hay) nên phải chọn \"but\".", "audioText": "It was long, but it was fun." }
        ],
        "slots": {
          "link": ["because", "so", "but"],
          "goodreason": ["we went to the zoo", "we won the game", "we saw a film", "it was my birthday"],
          "badreason": ["she lost her doll", "the dog was lost", "it was raining", "she was ill"],
          "cause": ["raining", "hot", "very late", "sunny"],
          "action": ["played at home", "had an ice cream", "went to bed", "went to the park"],
          "firstidea": ["long", "small", "hard", "cold"],
          "secondidea": ["fun", "nice", "good", "great"]
        },
        "answerKey": {
          "happy-because": { "link": "because" },
          "sad-because": { "link": "because" },
          "result-so": { "link": "so" },
          "contrast-but": { "link": "but" }
        },
        "distractors": [
          "I was happy so we went to the zoo.",
          "It was raining, because we played at home.",
          "It was long, so it was fun but.",
          "I was happy but we went to the zoo.",
          "It was hot so but we had an ice cream.",
          "She cried so she lost her doll."
        ],
        "irregulars": {}
      }
    },
    {
      "id": "past-simple-retell",
      "title_vi": "Ôn quá khứ đơn để KỂ LẠI chuyện (V-ed và động từ bất quy tắc)",
      "explain_vi": "Khi kể lại một câu chuyện đã xảy ra, em dùng QUÁ KHỨ ĐƠN. Phần lớn động từ thêm \"-ed\": help → helped, laugh → laughed; động từ có \"y\" sau phụ âm đổi thành \"-ied\": cry → cried. Vài động từ hay dùng đổi hẳn, học thuộc nhé: find → found (đã tìm thấy), go → went (đã đi), see → saw (đã thấy), have → had (đã có/đã ăn). Dạng quá khứ dùng chung cho mọi chủ ngữ (I, she, we, they...).",
      "examples": [
        "She found a little cat in the garden.",
        "We helped the old man with his bag.",
        "The baby cried, but then it laughed.",
        "Last summer we went to the farm and saw the cows."
      ],
      "generators": ["fill_blank", "mcq", "order_words", "listen_choose"],
      "safeZone": {
        "templates": [
          { "id": "subj-found-thing", "text": "{subj} found {foundthing}.", "blanks": ["foundthing"], "context_vi": "Kể về việc TÌM THẤY một thứ gì đó (động từ \"found\" = đã tìm thấy). Mọi thứ trong danh sách đều có thể tìm thấy, nên mọi đáp án đều đúng.", "audioText": "She found a little cat." },
          { "id": "subj-helped-person", "text": "{subj} helped {person}.", "blanks": ["person"], "context_vi": "Kể về việc ĐÃ GIÚP một người (động từ \"helped\" = đã giúp). Em chỉ giúp được NGƯỜI, nên mọi đáp án trong danh sách đều là người và đều đúng.", "audioText": "We helped the old man." },
          { "id": "subj-saw-sight", "text": "{subj} saw {sight}.", "blanks": ["sight"], "context_vi": "Kể về việc ĐÃ NHÌN THẤY điều gì (động từ \"saw\" = đã thấy). Mọi thứ trong danh sách đều có thể nhìn thấy, nên mọi đáp án đều đúng.", "audioText": "He saw a big bird." },
          { "id": "yesterday-subj-wentto", "text": "Yesterday {subjLower} went to the {place}.", "blanks": ["place"], "context_vi": "Đi ĐẾN một nơi trong quá khứ dùng \"went to the...\". Chọn một nơi chốn; nơi nào cũng đúng ngữ pháp.", "audioText": "Yesterday we went to the farm." },
          { "id": "excited-because-found", "text": "I was excited because I found {foundthing}.", "blanks": ["foundthing"], "context_vi": "Vế \"because\" kể việc ĐÃ xảy ra nên dùng \"found\" (quá khứ). Người ta thường thấy VUI/HÁO HỨC khi tìm thấy đồ, nên mọi thứ tìm được đều hợp nghĩa.", "audioText": "I was excited because I found a little cat." },
          { "id": "scared-because-saw", "text": "I was scared because I saw {scarysight}.", "blanks": ["scarysight"], "context_vi": "Vế \"because\" kể việc ĐÃ xảy ra nên dùng \"saw\" (quá khứ). Người ta thấy SỢ khi nhìn thấy thứ đáng sợ, nên mọi đáp án đều là thứ đáng sợ và hợp nghĩa.", "audioText": "I was scared because I saw a big spider." }
        ],
        "slots": {
          "subj": ["I", "She", "He", "We", "They"],
          "subjLower": ["I", "she", "he", "we", "they"],
          "foundthing": ["a little cat", "an old key", "a lost ball", "an ice cream"],
          "person": ["the old man", "her friend", "the lost boy"],
          "sight": ["a big bird", "a funny film", "the new house"],
          "scarysight": ["a big spider", "a snake", "a dark cave"],
          "place": ["farm", "park", "zoo", "beach"]
        },
        "answerKey": {},
        "distractors": [
          "She finded a little cat.",
          "We helpd the old man.",
          "The baby cryed all night.",
          "Yesterday we go to the farm.",
          "I was excited because I finded a little cat.",
          "He seed a big bird.",
          "She found helped the old man."
        ],
        "irregulars": {
          "find": "found",
          "go": "went",
          "see": "saw",
          "have": "had",
          "help": "helped",
          "laugh": "laughed",
          "cry": "cried"
        }
      }
    }
  ],
  "phonics": {
    "position": "mixed",
    "focus": ["ar", "or", "oo", "ai", "oa", "ee"],
    "soundLabels": {
      "ar": { "ipa": "/ɑː/", "anchor": "car", "position": "medial", "say_vi": "âm GIỮA từ \"car\" là /ɑː/ — miệng mở to, kéo dài \"a\", không đọc tách \"a\" và \"r\"" },
      "or": { "ipa": "/ɔː/", "anchor": "fork", "position": "medial", "say_vi": "âm GIỮA từ \"fork\" là /ɔː/ — môi tròn, kéo dài \"o\", không đọc tách \"o\" và \"r\"" },
      "oo": { "ipa": "/uː/", "anchor": "moon", "position": "medial", "say_vi": "âm GIỮA từ \"moon\" là /uː/ — môi tròn nhỏ, kéo dài \"u\", không đọc thành hai chữ \"o\"" },
      "ai": { "ipa": "/eɪ/", "anchor": "rain", "position": "medial", "say_vi": "âm GIỮA từ \"rain\" là /eɪ/ — trượt từ \"ê\" sang \"i\", đọc liền một hơi" },
      "oa": { "ipa": "/əʊ/", "anchor": "boat", "position": "medial", "say_vi": "âm GIỮA từ \"boat\" là /əʊ/ — trượt từ \"ơ\" sang \"u\", đọc liền một hơi" },
      "ee": { "ipa": "/iː/", "anchor": "tree", "position": "medial", "say_vi": "âm GIỮA từ \"tree\" là /iː/ — cười nhẹ, kéo dài \"i\", không đọc thành hai chữ \"e\"" }
    },
    "words": [
      { "word": "car", "icon": "🚗", "focusSound": "ar", "anchor": "car", "position": "medial", "audio": "" },
      { "word": "star", "icon": "⭐", "focusSound": "ar", "anchor": "car", "position": "medial", "audio": "" },
      { "word": "fork", "icon": "🍴", "focusSound": "or", "anchor": "fork", "position": "medial", "audio": "" },
      { "word": "moon", "icon": "🌙", "focusSound": "oo", "anchor": "moon", "position": "medial", "audio": "" },
      { "word": "rain", "icon": "🌧️", "focusSound": "ai", "anchor": "rain", "position": "medial", "audio": "" },
      { "word": "train", "icon": "🚆", "focusSound": "ai", "anchor": "rain", "position": "medial", "audio": "" },
      { "word": "boat", "icon": "⛵", "focusSound": "oa", "anchor": "boat", "position": "medial", "audio": "" },
      { "word": "tree", "icon": "🌳", "focusSound": "ee", "anchor": "tree", "position": "medial", "audio": "" }
    ],
    "audio": null
  },
  "reading": [
    {
      "id": "the-lost-kite",
      "title": "The lost kite",
      "title_vi": "Con diều bị lạc",
      "text": "Last Sunday, Nam and his sister Lan went to the park. It was sunny, so they flew a big red kite. Lan was excited because the kite flew very high. Then the wind was strong, and the kite was lost in a tall tree. Lan was sad, but Nam had a good plan. A kind man helped them, and they found the kite. Lan laughed because she was happy again. It was a great day for Nam and Lan.",
      "glossary": [
        { "word": "flew", "vi": "đã bay (quá khứ của \"fly\")", "icon": "🪁" },
        { "word": "wind", "vi": "gió", "icon": "💨" },
        { "word": "strong", "vi": "mạnh", "icon": "💪" },
        { "word": "tall", "vi": "cao", "icon": "🌳" },
        { "word": "kind", "vi": "tốt bụng", "icon": "😊" },
        { "word": "plan", "vi": "kế hoạch / cách làm", "icon": "💡" }
      ],
      "teacherNote_vi": "Đoạn gồm 8 câu (theo dấu . ! ?), dài hơn Level 2 một chút theo yêu cầu kể lại. Gói gọn trọng tâm BÀI LỚN 5: liên từ because/so/but (so they flew; excited because; sad, but Nam; laughed because) + quá khứ đơn để kể (went, flew, was/were, helped, found, laughed). Từ mới ngoài vocab chỉ thêm flew/wind/strong/tall/kind/plan (i+1, đoán được nhờ ngữ cảnh; kite, park, sunny, wind đã gặp ở Level 1-2). Đã thêm \"glossary\" gloss_vi cho 6 từ i+1 (đặc biệt flew = quá khứ của fly, strong, kind) để hỗ trợ đọc hiểu sâu phục vụ kể lại, theo góp ý review.",
      "questions": [
        { "id": "q1", "q_vi": "Nam và Lan đã đi đâu vào Chủ nhật tuần trước?", "type": "mcq", "choices": ["to the park", "to the zoo", "to the beach"], "answer": 0, "audioText": "Where did Nam and Lan go last Sunday?" },
        { "id": "q2", "q_vi": "Vì sao Lan thấy háo hức?", "type": "mcq", "choices": ["because the kite flew very high", "because it was raining", "because she had an ice cream"], "answer": 0, "audioText": "Why was Lan excited?" },
        { "id": "q3", "q_vi": "Con diều bị làm sao?", "type": "mcq", "choices": ["It was lost in a tall tree.", "It was broken.", "It was on the boat."], "answer": 0, "audioText": "What happened to the kite?" },
        { "id": "q4", "q_vi": "Một người tốt bụng đã giúp hai bạn lấy lại con diều, đúng không?", "type": "truefalse", "answer": true, "audioText": "A kind man helped them find the kite." },
        { "id": "q5", "q_vi": "Cuối cùng Lan cảm thấy thế nào?", "type": "mcq", "choices": ["happy", "scared", "tired"], "answer": 0, "audioText": "How did Lan feel at the end?" }
      ]
    }
  ],
  "speaking": [
    {
      "id": "tell-why-i-felt",
      "title_vi": "Kể một cảm xúc của em và LÝ DO",
      "prompt_vi": "Hãy kể một lần em vui, buồn hoặc háo hức và NÓI LÝ DO bằng \"because\". Điền cảm xúc và việc đã xảy ra thật của em vào chỗ trống. Nhớ dùng động từ ở quá khứ nhé.",
      "sentenceFrames": [
        "I was ___ because I ___.",
        "It was ___, so I ___.",
        "It was ___, but it was ___."
      ],
      "audioModels": [
        "I was happy because I found my dog.",
        "It was hot, so I had an ice cream.",
        "It was hard, but it was fun."
      ]
    },
    {
      "id": "retell-a-story",
      "title_vi": "Kể lại một câu chuyện ngắn của em",
      "prompt_vi": "Hãy kể lại một câu chuyện hoặc một việc đã xảy ra với em theo ba bước: bắt đầu, chuyện gì xảy ra, kết thúc. Dùng went, saw, found, helped và liên từ because/so/but.",
      "sentenceFrames": [
        "Last weekend I went to the ___.",
        "I saw / found ___, so ___.",
        "It was ___ because ___."
      ],
      "audioModels": [
        "Last weekend I went to the park.",
        "I found a little cat, so I helped it.",
        "It was a great day because we were all happy."
      ]
    }
  ],
  "audioNotes": "Cần thu âm người thật cho: (1) Phonics Level 3 — nguyên âm đôi và âm-r ở GIỮA từ: /ɑː/ (car, star), /ɔː/ (fork), /uː/ (moon), /eɪ/ (rain, train), /əʊ/ (boat), /iː/ (tree). TTS dễ đọc tách 'a-r', 'o-r' hoặc biến /uː/, /eɪ/, /əʊ/, /iː/ thành tên chữ; loa phải đọc TỪ TRỌN VẸN, kéo dài nguyên âm liền một hơi, không tách rời chữ cái. Lưu ý phân biệt cặp dễ lẫn: 'boat' /əʊ/ khác 'moon' /uː/, 'rain' /eɪ/ khác 'tree' /iː/. (2) Câu mẫu liên từ trong grammar examples — đọc rõ chỗ nghỉ trước 'so' và 'but' (có dấu phẩy) và nối liền 'happy because', để bé nghe được ngữ điệu nối ý. (3) Các đuôi quá khứ trong vocab/examples: 'helped' /helpt/ (đuôi /t/), 'laughed' /lɑːft/ (đuôi /t/), 'cried' /kraɪd/ (đuôi /d/), 'found' /faʊnd/, 'saw' /sɔː/ — đọc rõ để bé phân biệt với lỗi 'finded/cryed/helpd/seed'. (4) audioModels phần speaking và audioText câu hỏi reading; riêng reading 'The lost kite' nên đọc chậm, ngắt câu rõ để bé theo dõi mạch kể chuyện. Ghi chú recycling: kite, park, sunny, wind, happy, sad đã gặp ở Level 1-2, dùng lại có chủ đích để ôn; trọng tâm MỚI là liên từ because/so/but và mở rộng quá khứ đơn (found, helped, cried, laughed) cùng nhóm cảm xúc (scared, excited, surprised)."
};
  C["grammar3/index.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "title_vi": "Ngữ pháp Tăng cường — 20 bài",
  "note_vi": "Mạch ngữ pháp tham chiếu syllabus ôn ngữ pháp phổ thông (xem docs/ROUNDUP_GRAMMAR_MAP.md). Toàn bộ câu, ví dụ, đáp án và câu nhiễu là nội dung GỐC do dự án tự soạn.",
  "units": [],
  "lessons": [
    {
      "lesson": 1,
      "unit": 401,
      "file": "unit01.json",
      "topic_vi": "Số nhiều & danh từ không đếm được",
      "icon": "🧺",
      "pal": "sun",
      "sub": "+s/+es · bất quy tắc · some/much/many",
      "status": "ready"
    },
    {
      "lesson": 2,
      "unit": 402,
      "file": "unit02.json",
      "topic_vi": "Đại từ · to be · have got · can",
      "icon": "🙋",
      "pal": "sky",
      "sub": "He/She/They · am/is/are · have/has got",
      "status": "ready"
    },
    {
      "lesson": 3,
      "unit": 403,
      "file": "unit03.json",
      "topic_vi": "Sở hữu & từ chỉ định",
      "icon": "👉",
      "pal": "mint",
      "sub": "my/his/her · 's · this/that/these/those",
      "status": "ready"
    },
    {
      "lesson": 4,
      "unit": 404,
      "file": "unit04.json",
      "topic_vi": "Mạo từ a / an / the",
      "icon": "🅰️",
      "pal": "coral",
      "sub": "a · an · the · không mạo từ",
      "status": "ready"
    },
    {
      "lesson": 5,
      "unit": 405,
      "file": "unit05.json",
      "topic_vi": "Diễn tả số lượng",
      "icon": "⚖️",
      "pal": "grape",
      "sub": "some/any · a lot of · a few/a little",
      "status": "ready"
    },
    {
      "lesson": 6,
      "unit": 406,
      "file": "unit06.json",
      "topic_vi": "Đại từ bất định",
      "icon": "🔍",
      "pal": "sun",
      "sub": "someone/anything/nobody/everywhere",
      "status": "ready"
    },
    {
      "lesson": 7,
      "unit": 407,
      "file": "unit07.json",
      "topic_vi": "Hiện tại đơn",
      "icon": "🔁",
      "pal": "sky",
      "sub": "thêm -s · do/does · trạng từ tần suất",
      "status": "ready"
    },
    {
      "lesson": 8,
      "unit": 408,
      "file": "unit08.json",
      "topic_vi": "Hiện tại tiếp diễn",
      "icon": "🏃",
      "pal": "mint",
      "sub": "am/is/are + V-ing · quy tắc thêm -ing",
      "status": "ready"
    },
    {
      "lesson": 9,
      "unit": 409,
      "file": "unit09.json",
      "topic_vi": "Giới từ",
      "icon": "📍",
      "pal": "coral",
      "sub": "nơi chốn · chuyển động · thời gian",
      "status": "ready"
    },
    {
      "lesson": 10,
      "unit": 410,
      "file": "unit10.json",
      "topic_vi": "Quá khứ đơn",
      "icon": "⏪",
      "pal": "grape",
      "sub": "-ed · động từ bất quy tắc · did",
      "status": "ready"
    },
    {
      "lesson": 11,
      "unit": 411,
      "file": "unit11.json",
      "topic_vi": "Hiện tại hoàn thành",
      "icon": "✅",
      "pal": "sun",
      "sub": "have/has + V3 · ever/never/just/yet",
      "status": "ready"
    },
    {
      "lesson": 12,
      "unit": 412,
      "file": "unit12.json",
      "topic_vi": "Quá khứ tiếp diễn",
      "icon": "⏳",
      "pal": "sky",
      "sub": "was/were + V-ing · when/while",
      "status": "ready"
    },
    {
      "lesson": 13,
      "unit": 413,
      "file": "unit13.json",
      "topic_vi": "Tương lai",
      "icon": "🔮",
      "pal": "mint",
      "sub": "be going to · will · phân biệt hai cách",
      "status": "ready"
    },
    {
      "lesson": 14,
      "unit": 414,
      "file": "unit14.json",
      "topic_vi": "Động từ khiếm khuyết",
      "icon": "🔑",
      "pal": "coral",
      "sub": "must/mustn't · should · may · have to",
      "status": "ready"
    },
    {
      "lesson": 15,
      "unit": 415,
      "file": "unit15.json",
      "topic_vi": "Câu điều kiện",
      "icon": "🌦️",
      "pal": "grape",
      "sub": "loại 0 · loại 1 · loại 2",
      "status": "ready"
    },
    {
      "lesson": 16,
      "unit": 416,
      "file": "unit16.json",
      "topic_vi": "Câu hỏi",
      "icon": "❓",
      "pal": "sun",
      "sub": "Yes/No · Wh- · trật tự từ",
      "status": "ready"
    },
    {
      "lesson": 17,
      "unit": 417,
      "file": "unit17.json",
      "topic_vi": "Câu bị động",
      "icon": "🔄",
      "pal": "sky",
      "sub": "be + V3 · by · hiện tại & quá khứ",
      "status": "ready"
    },
    {
      "lesson": 18,
      "unit": 418,
      "file": "unit18.json",
      "topic_vi": "To V · V-ing · too/enough",
      "icon": "🧩",
      "pal": "mint",
      "sub": "want to · like V-ing · too/enough",
      "status": "ready"
    },
    {
      "lesson": 19,
      "unit": 419,
      "file": "unit19.json",
      "topic_vi": "Đại từ quan hệ",
      "icon": "🔗",
      "pal": "coral",
      "sub": "who · which · that · whose",
      "status": "ready"
    },
    {
      "lesson": 20,
      "unit": 420,
      "file": "unit20.json",
      "topic_vi": "Tính từ · trạng từ · so sánh",
      "icon": "📊",
      "pal": "grape",
      "sub": "-ly · -er/-est · as…as",
      "status": "ready"
    }
  ]
};
  C["grammar3/unit01.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 401,
  "lesson": 1,
  "topic": "Plurals: countable and uncountable nouns",
  "topic_vi": "Số nhiều & danh từ không đếm được",
  "vocab": [
    {
      "word": "box",
      "vi": "cái hộp",
      "icon": "📦",
      "example": "There are three boxes here.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "bus",
      "vi": "xe buýt",
      "icon": "🚌",
      "example": "Two buses stop near my house.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "city",
      "vi": "thành phố",
      "icon": "🏙️",
      "example": "Viet Nam has many cities.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "tomato",
      "vi": "quả cà chua",
      "icon": "🍅",
      "example": "Mum needs four tomatoes.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "baby",
      "vi": "em bé",
      "icon": "👶",
      "example": "The babies are asleep.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "child",
      "vi": "đứa trẻ",
      "icon": "🧒",
      "example": "Six children are playing.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "tooth",
      "vi": "cái răng",
      "icon": "🦷",
      "example": "Brush your teeth every day.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "water",
      "vi": "nước",
      "icon": "💧",
      "example": "I drink some water.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "rice",
      "vi": "gạo, cơm",
      "icon": "🍚",
      "example": "We eat some rice.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "bread",
      "vi": "bánh mì",
      "icon": "🍞",
      "example": "She buys some bread.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "milk",
      "vi": "sữa",
      "icon": "🥛",
      "example": "He drinks some milk.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "money",
      "vi": "tiền",
      "icon": "💰",
      "example": "I have some money.",
      "partOfSpeech": "noun",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "plural-regular",
      "title_vi": "Số nhiều thường: thêm -s / -es / y → ies / o → oes",
      "explain_vi": "Thêm \"-s\" để nói nhiều thứ. Nhưng: kết thúc bằng s/x/ch/sh thì thêm \"-es\" (box → boxes); phụ âm + y thì đổi thành \"-ies\" (city → cities); vài từ kết thúc bằng o thì thêm \"-es\" (tomato → tomatoes).",
      "examples": [
        "One box, two boxes.",
        "One city, two cities.",
        "I have one key. My friend has two keys."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "one-two",
            "text": "One {noun}, two {plural}.",
            "blanks": [
              "plural"
            ],
            "context_vi": "Đổi danh từ ở trước sang dạng số nhiều đúng.",
            "audioText": "One box, two boxes."
          },
          {
            "id": "have-one-two",
            "text": "I have one {noun}. My friend has two {plural}.",
            "blanks": [
              "plural"
            ],
            "context_vi": "Câu sau nói về HAI thứ, nên danh từ phải ở dạng số nhiều.",
            "audioText": "I have one key. My friend has two keys."
          }
        ],
        "slots": {
          "noun": [
            "box",
            "bus",
            "city",
            "tomato",
            "baby",
            "key",
            "brush",
            "book"
          ],
          "plural": [
            "boxes",
            "buses",
            "cities",
            "tomatoes",
            "babies",
            "keys",
            "brushes",
            "books"
          ]
        },
        "answerKey": {
          "one-two": {
            "plural": {
              "__cond": "noun",
              "box": "boxes",
              "bus": "buses",
              "city": "cities",
              "tomato": "tomatoes",
              "baby": "babies",
              "key": "keys",
              "brush": "brushes",
              "book": "books"
            }
          },
          "have-one-two": {
            "plural": {
              "__cond": "noun",
              "box": "boxes",
              "bus": "buses",
              "city": "cities",
              "tomato": "tomatoes",
              "baby": "babies",
              "key": "keys",
              "brush": "brushes",
              "book": "books"
            }
          }
        },
        "distractors": [
          "One box, two boxs.",
          "One bus, two buss.",
          "One city, two citys.",
          "One tomato, two tomatos.",
          "One baby, two babys.",
          "One brush, two brushs."
        ],
        "irregulars": {}
      },
      "teach_vi": "Muốn nói NHIỀU thứ, em thêm \"-s\" vào sau danh từ: book → books. Nhưng có bốn nhóm đặc biệt: (1) từ kết thúc bằng s, x, ch, sh thì thêm \"-es\" — bus → buses, box → boxes, brush → brushes; (2) từ kết thúc bằng phụ âm + y thì đổi y thành \"-ies\" — city → cities, baby → babies; (3) vài từ kết thúc bằng o thì thêm \"-es\" — tomato → tomatoes, potato → potatoes; (4) từ kết thúc bằng nguyên âm + y thì chỉ thêm \"-s\" — key → keys, day → days."
    },
    {
      "id": "plural-irregular",
      "title_vi": "Số nhiều bất quy tắc: đổi hẳn cả từ",
      "explain_vi": "Vài danh từ đổi hẳn cả từ, không thêm \"-s\": child → children, foot → feet, mouse → mice. Riêng sheep và fish giữ nguyên.",
      "examples": [
        "One child, two children.",
        "One tooth, two teeth.",
        "I have one fish. My friend has two fish."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "irr-one-two",
            "text": "One {noun}, two {plural}.",
            "blanks": [
              "plural"
            ],
            "context_vi": "Đây là danh từ bất quy tắc — không thêm \"-s\".",
            "audioText": "One child, two children."
          },
          {
            "id": "irr-count",
            "text": "I can see one {noun} and three {plural}.",
            "blanks": [
              "plural"
            ],
            "context_vi": "Sau số 3 phải dùng dạng số nhiều bất quy tắc của danh từ đó.",
            "audioText": "I can see one child and three children."
          }
        ],
        "slots": {
          "noun": [
            "child",
            "man",
            "woman",
            "foot",
            "tooth",
            "mouse",
            "goose",
            "sheep",
            "fish"
          ],
          "plural": [
            "children",
            "men",
            "women",
            "feet",
            "teeth",
            "mice",
            "geese",
            "sheep",
            "fish"
          ]
        },
        "answerKey": {
          "irr-one-two": {
            "plural": {
              "__cond": "noun",
              "child": "children",
              "man": "men",
              "woman": "women",
              "foot": "feet",
              "tooth": "teeth",
              "mouse": "mice",
              "goose": "geese",
              "sheep": "sheep",
              "fish": "fish"
            }
          },
          "irr-count": {
            "plural": {
              "__cond": "noun",
              "child": "children",
              "man": "men",
              "woman": "women",
              "foot": "feet",
              "tooth": "teeth",
              "mouse": "mice",
              "goose": "geese",
              "sheep": "sheep",
              "fish": "fish"
            }
          }
        },
        "distractors": [
          "One child, two childs.",
          "One man, two mans.",
          "One woman, two womans.",
          "One foot, two foots.",
          "One tooth, two tooths.",
          "One mouse, two mouses."
        ],
        "irregulars": {
          "child": "children",
          "man": "men",
          "woman": "women",
          "foot": "feet",
          "tooth": "teeth",
          "mouse": "mice",
          "goose": "geese",
          "sheep": "sheep",
          "fish": "fish"
        }
      },
      "teach_vi": "Một số danh từ KHÔNG thêm \"-s\" mà đổi hẳn: child → children, man → men, woman → women, foot → feet, tooth → teeth, mouse → mice, goose → geese. Vài từ giữ nguyên không đổi gì: sheep → sheep, fish → fish. Những từ này phải học thuộc, không suy ra được bằng quy tắc."
    },
    {
      "id": "uncountable-some-much-many",
      "title_vi": "Danh từ không đếm được: some · much · many",
      "explain_vi": "Thứ không đếm được (water, rice, money) dùng \"some\", không dùng \"a\". Hỏi số lượng: không đếm được → \"much\", đếm được số nhiều → \"many\".",
      "examples": [
        "I need some rice.",
        "I need a cake.",
        "How much water do you need?",
        "How many books do you need?"
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "order_words",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "need-det",
            "text": "I need {det} {thing}.",
            "blanks": [
              "det"
            ],
            "context_vi": "Danh từ không đếm được đi với \"some\"; danh từ đếm được số ít đi với \"a\".",
            "audioText": "I need some rice."
          },
          {
            "id": "how-much-many",
            "text": "How {mm} {thing2} do you need?",
            "blanks": [
              "mm"
            ],
            "context_vi": "Hỏi số lượng: không đếm được → \"much\"; đếm được số nhiều → \"many\".",
            "audioText": "How much water do you need?"
          }
        ],
        "slots": {
          "det": [
            "some",
            "a"
          ],
          "thing": [
            "water",
            "milk",
            "rice",
            "bread",
            "money",
            "cake",
            "book",
            "pen",
            "banana"
          ],
          "mm": [
            "much",
            "many"
          ],
          "thing2": [
            "water",
            "milk",
            "rice",
            "bread",
            "money",
            "cakes",
            "books",
            "pens",
            "bananas"
          ]
        },
        "answerKey": {
          "need-det": {
            "det": {
              "__cond": "thing",
              "water": "some",
              "milk": "some",
              "rice": "some",
              "bread": "some",
              "money": "some",
              "cake": "a",
              "book": "a",
              "pen": "a",
              "banana": "a"
            }
          },
          "how-much-many": {
            "mm": {
              "__cond": "thing2",
              "water": "much",
              "milk": "much",
              "rice": "much",
              "bread": "much",
              "money": "much",
              "cakes": "many",
              "books": "many",
              "pens": "many",
              "bananas": "many"
            }
          }
        },
        "distractors": [
          "I need a rice.",
          "I need a water.",
          "I need some banana.",
          "How many water do you need?",
          "How much books do you need?",
          "How many rice do you need?"
        ],
        "irregulars": {}
      },
      "teach_vi": "Có những thứ em không đếm được từng cái một: water, milk, rice, bread, money. Chúng KHÔNG có dạng số nhiều và KHÔNG dùng \"a/an\" — em dùng \"some\": some water, some rice. Còn danh từ đếm được thì dùng \"a/an\" khi có một cái: a book, a cake. Khi hỏi số lượng: danh từ không đếm được đi với \"much\" (How much water?), danh từ đếm được số nhiều đi với \"many\" (How many books?)."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "at-the-market",
      "title": "At the market",
      "title_vi": "Ở chợ",
      "text": "Mai and her mum are at the market. Mai has a list: four tomatoes, two boxes of eggs, some rice and some milk. \"We need some bread, too,\" says Mai. Her mum smiles. \"Good. Now we have everything.\"",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Trong danh sách có bốn quả cà chua, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "There are four tomatoes on the list."
        },
        {
          "id": "q2",
          "q_vi": "Thứ nào trong danh sách là danh từ KHÔNG đếm được?",
          "type": "mcq",
          "choices": [
            "rice",
            "tomatoes",
            "boxes"
          ],
          "answer": 0,
          "audioText": "Which word is uncountable?"
        }
      ]
    }
  ]
};
  C["grammar3/unit02.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 402,
  "lesson": 2,
  "topic": "Personal pronouns, be, have got, can",
  "topic_vi": "Đại từ · to be · have got · can",
  "vocab": [
    {
      "word": "brother",
      "vi": "anh, em trai",
      "icon": "👦",
      "example": "My brother is ten years old.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "sister",
      "vi": "chị, em gái",
      "icon": "👧",
      "example": "My sister can sing well.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "parents",
      "vi": "bố mẹ",
      "icon": "👨‍👩‍👦",
      "example": "My parents are teachers.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "friend",
      "vi": "người bạn",
      "icon": "👫",
      "example": "My friend has got a new bike.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "bike",
      "vi": "xe đạp",
      "icon": "🚲",
      "example": "I have got a red bike.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "pet",
      "vi": "vật nuôi",
      "icon": "🐹",
      "example": "They have got two pets.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "garden",
      "vi": "khu vườn",
      "icon": "🌳",
      "example": "The children are in the garden.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "happy",
      "vi": "vui, hạnh phúc",
      "icon": "😀",
      "example": "She is happy today.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "hungry",
      "vi": "đói",
      "icon": "🍽️",
      "example": "We are hungry now.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "swim",
      "vi": "bơi",
      "icon": "🏊",
      "example": "I can swim very well.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "draw",
      "vi": "vẽ",
      "icon": "🎨",
      "example": "He can draw very well.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "cook",
      "vi": "nấu ăn",
      "icon": "🍳",
      "example": "My mother can cook very well.",
      "partOfSpeech": "verb",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "subject-pronouns",
      "title_vi": "Đại từ nhân xưng: He · She · We · They",
      "explain_vi": "Thay danh từ bằng đại từ cho khỏi lặp: một người nam → He, một người nữ → She, nhiều người có mình ở trong → We, nhiều người không có mình → They.",
      "examples": [
        "My brother is at home. He is happy.",
        "My sister is at home. She is happy.",
        "My parents are at home. They are happy."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "one-person-pron",
            "text": "{person} is at home. {pron} is happy.",
            "blanks": [
              "pron"
            ],
            "context_vi": "Câu nói về MỘT người — chọn đại từ khớp với người đó.",
            "audioText": "My brother is at home. He is happy."
          },
          {
            "id": "group-pron",
            "text": "{group} are at home. {pronPl} are happy.",
            "blanks": [
              "pronPl"
            ],
            "context_vi": "Câu nói về NHIỀU người. Nếu có \"and I\" thì dùng \"We\", còn lại dùng \"They\".",
            "audioText": "My parents are at home. They are happy."
          }
        ],
        "slots": {
          "person": [
            "My brother",
            "My father",
            "My uncle",
            "My sister",
            "My mother",
            "My aunt"
          ],
          "pron": [
            "He",
            "She"
          ],
          "group": [
            "My brother and I",
            "My friend and I",
            "My parents",
            "My sisters",
            "The children"
          ],
          "pronPl": [
            "We",
            "They"
          ]
        },
        "answerKey": {
          "one-person-pron": {
            "pron": {
              "__cond": "person",
              "My brother": "He",
              "My father": "He",
              "My uncle": "He",
              "My sister": "She",
              "My mother": "She",
              "My aunt": "She"
            }
          },
          "group-pron": {
            "pronPl": {
              "__cond": "group",
              "My brother and I": "We",
              "My friend and I": "We",
              "My parents": "They",
              "My sisters": "They",
              "The children": "They"
            }
          }
        },
        "distractors": [
          "My brother is at home. She is happy.",
          "My sister is at home. He is happy.",
          "My parents are at home. We are happy.",
          "My brother and I are at home. They are happy.",
          "The children are at home. It is happy.",
          "My mother is at home. They is happy."
        ],
        "irregulars": {}
      },
      "teach_vi": "Để không phải nhắc lại tên hay danh từ hai lần, em thay nó bằng đại từ. Một người nam → \"He\"; một người nữ → \"She\"; một vật/con vật → \"It\"; nhiều người mà CÓ em ở trong đó → \"We\"; nhiều người mà KHÔNG có em → \"They\". Nhớ đại từ phải khớp với danh từ đứng trước, và đại từ số nhiều đi với \"are\"."
    },
    {
      "id": "be-am-is-are",
      "title_vi": "Động từ \"to be\": am · is · are",
      "explain_vi": "\"I\" đi với am; \"He/She/It\" và một người đi với is; \"You/We/They\" và nhiều người đi với are. Phủ định thì thêm \"not\" ngay sau am/is/are.",
      "examples": [
        "I am happy today.",
        "She is happy today.",
        "They are not at school today."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "order_words",
        "listen_choose",
        "transform"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "be-affirm",
            "text": "{subj} {be} happy today.",
            "blanks": [
              "be"
            ],
            "context_vi": "Chọn dạng \"to be\" khớp với chủ ngữ.",
            "audioText": "She is happy today."
          },
          {
            "id": "be-negative",
            "text": "{subj} {be} not at school today.",
            "blanks": [
              "be"
            ],
            "context_vi": "Câu phủ định: \"not\" đứng ngay sau am/is/are.",
            "audioText": "They are not at school today."
          }
        ],
        "slots": {
          "subj": [
            "I",
            "He",
            "She",
            "You",
            "We",
            "They"
          ],
          "be": [
            "am",
            "is",
            "are"
          ]
        },
        "answerKey": {
          "be-affirm": {
            "be": {
              "__cond": "subj",
              "I": "am",
              "He": "is",
              "She": "is",
              "You": "are",
              "We": "are",
              "They": "are"
            }
          },
          "be-negative": {
            "be": {
              "__cond": "subj",
              "I": "am",
              "He": "is",
              "She": "is",
              "You": "are",
              "We": "are",
              "They": "are"
            }
          },
          "answer-pairs": {
            "I am happy today.": "I am not happy today.",
            "He is happy today.": "He is not happy today.",
            "She is happy today.": "She is not happy today.",
            "You are happy today.": "You are not happy today.",
            "We are happy today.": "We are not happy today.",
            "They are happy today.": "They are not happy today."
          }
        },
        "distractors": [
          "I is happy today.",
          "He are happy today.",
          "They is happy today.",
          "We am happy today.",
          "She are not at school today.",
          "You is not at school today."
        ],
        "irregulars": {}
      },
      "teach_vi": "\"To be\" đổi theo chủ ngữ: \"I\" đi với \"am\"; \"He / She / It\" và một người/một vật đi với \"is\"; \"You / We / They\" và nhiều người/nhiều vật đi với \"are\". Câu phủ định chỉ cần thêm \"not\" ngay sau am/is/are: I am not, he is not (he isn't), they are not (they aren't)."
    },
    {
      "id": "have-got",
      "title_vi": "\"Have got\" / \"has got\": nói về cái mình có",
      "explain_vi": "Nói về cái mình có: I/you/we/they + have got; he/she/it và một người + has got. Luôn có \"got\" đi kèm.",
      "examples": [
        "I have got a new bike.",
        "My sister has got a new bike.",
        "They have got two pets."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "order_words",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "have-got-bike",
            "text": "{owner} {hg} got a new bike.",
            "blanks": [
              "hg"
            ],
            "context_vi": "Chọn \"have\" hay \"has\" cho khớp chủ ngữ.",
            "audioText": "My sister has got a new bike."
          },
          {
            "id": "have-got-pets",
            "text": "{owner} {hg} got two pets at home.",
            "blanks": [
              "hg"
            ],
            "context_vi": "\"He / She\" và một người thì dùng \"has got\".",
            "audioText": "My brother has got two pets at home."
          }
        ],
        "slots": {
          "owner": [
            "I",
            "You",
            "We",
            "They",
            "He",
            "She",
            "My brother",
            "My parents"
          ],
          "hg": [
            "have",
            "has"
          ]
        },
        "answerKey": {
          "have-got-bike": {
            "hg": {
              "__cond": "owner",
              "I": "have",
              "You": "have",
              "We": "have",
              "They": "have",
              "He": "has",
              "She": "has",
              "My brother": "has",
              "My parents": "have"
            }
          },
          "have-got-pets": {
            "hg": {
              "__cond": "owner",
              "I": "have",
              "You": "have",
              "We": "have",
              "They": "have",
              "He": "has",
              "She": "has",
              "My brother": "has",
              "My parents": "have"
            }
          }
        },
        "distractors": [
          "She have got a new bike.",
          "I has got a new bike.",
          "My brother have got two pets at home.",
          "They has got two pets at home.",
          "He have got a new bike.",
          "We has got two pets at home."
        ],
        "irregulars": {}
      },
      "teach_vi": "Nói về thứ mình có, em dùng \"have got\". Với \"He / She / It\" hoặc một người thì đổi thành \"has got\": I have got a bike, my sister has got a bike. Câu phủ định thêm \"not\": I haven't got a bike, she hasn't got a bike. Lưu ý luôn có \"got\" đi kèm, và KHÔNG nói \"she have got\"."
    },
    {
      "id": "can-bare-infinitive",
      "title_vi": "\"Can\" + động từ nguyên mẫu",
      "explain_vi": "Sau \"can\" là động từ nguyên mẫu — không thêm \"-s\", không thêm \"to\": She can swim (không phải \"cans swim\" hay \"can to swim\").",
      "examples": [
        "My sister can swim very well.",
        "He can draw very well.",
        "They can cook very well."
      ],
      "generators": [
        "mcq",
        "order_words",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "can-do-well",
            "text": "{doer} can {verb} very well.",
            "blanks": [],
            "context_vi": "Sau \"can\" là động từ nguyên mẫu, không thêm gì.",
            "audioText": "My sister can swim very well."
          }
        ],
        "slots": {
          "doer": [
            "My sister",
            "My brother",
            "He",
            "She",
            "They",
            "We"
          ],
          "verb": [
            "swim",
            "draw",
            "cook",
            "sing",
            "dance"
          ]
        },
        "answerKey": {},
        "distractors": [
          "My sister cans swim very well.",
          "My sister can swims very well.",
          "He can to draw very well.",
          "They can cooks very well.",
          "She cans dance very well.",
          "We can to sing very well."
        ],
        "irregulars": {}
      },
      "teach_vi": "\"Can\" nghĩa là có thể / biết làm gì. Sau \"can\" luôn là động từ ở dạng nguyên mẫu, KHÔNG thêm \"-s\", KHÔNG thêm \"to\": She can swim (đúng) — She cans swim, She can swims, She can to swim (đều sai). \"Can\" giữ nguyên với mọi chủ ngữ: I can, he can, they can."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "my-family-at-home",
      "title": "At home",
      "title_vi": "Ở nhà",
      "text": "It is Sunday. My parents are in the garden. They have got a small dog. My sister is in the kitchen with my mother. She can cook noodles very well. I am in my room. I have got a new bike, but it is raining today.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Bố mẹ bạn ấy đang ở trong vườn, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "The parents are in the garden."
        },
        {
          "id": "q2",
          "q_vi": "Người chị/em gái biết làm gì rất giỏi?",
          "type": "mcq",
          "choices": [
            "cook noodles",
            "ride a bike",
            "swim in the river"
          ],
          "answer": 0,
          "audioText": "What can the sister do very well?"
        }
      ]
    }
  ]
};
  C["grammar3/unit03.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 403,
  "lesson": 3,
  "topic": "Possessives and demonstratives",
  "topic_vi": "Sở hữu & từ chỉ định",
  "vocab": [
    {
      "word": "bag",
      "vi": "cái cặp",
      "icon": "🎒",
      "example": "This bag is mine.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "book",
      "vi": "quyển sách",
      "icon": "📕",
      "example": "That book is new.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "pen",
      "vi": "cây bút",
      "icon": "🖊️",
      "example": "These pens are red.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "ruler",
      "vi": "cái thước",
      "icon": "📐",
      "example": "Is this your ruler?",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "desk",
      "vi": "cái bàn học",
      "icon": "🪑",
      "example": "Those desks are old.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "cat",
      "vi": "con mèo",
      "icon": "🐱",
      "example": "Her cat is white.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "teacher",
      "vi": "giáo viên",
      "icon": "👩‍🏫",
      "example": "The teacher's desk is big.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "parents",
      "vi": "bố mẹ",
      "icon": "👨‍👩‍👦",
      "example": "Their parents are teachers.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "mine",
      "vi": "của tôi",
      "icon": "🙋",
      "example": "This bag is mine.",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "blue",
      "vi": "màu xanh",
      "icon": "🔵",
      "example": "His bag is blue.",
      "partOfSpeech": "adj",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "possessive-adjectives",
      "title_vi": "Tính từ sở hữu: my · your · his · her · our · their",
      "explain_vi": "Tính từ sở hữu đứng trước danh từ và không đổi theo số nhiều: his bag, his bags. Một người nam → His, một người nữ → Her, nhiều người có mình → Our, còn lại → Their.",
      "examples": [
        "My brother has a new bag. His bag is blue.",
        "My sister has a new bag. Her bag is blue.",
        "My parents have new bags. Their bags are blue."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "one-owner-poss",
            "text": "{person} has a new bag. {poss} bag is blue.",
            "blanks": [
              "poss"
            ],
            "context_vi": "Người chủ là MỘT người — chọn \"his\" hoặc \"her\" cho khớp.",
            "audioText": "My sister has a new bag. Her bag is blue."
          },
          {
            "id": "group-owner-poss",
            "text": "{group} have new bags. {possPl} bags are blue.",
            "blanks": [
              "possPl"
            ],
            "context_vi": "Người chủ là NHIỀU người. Có \"and I\" thì dùng \"Our\", còn lại dùng \"Their\".",
            "audioText": "My parents have new bags. Their bags are blue."
          }
        ],
        "slots": {
          "person": [
            "My brother",
            "My father",
            "My uncle",
            "My sister",
            "My mother",
            "My aunt"
          ],
          "poss": [
            "His",
            "Her"
          ],
          "group": [
            "My parents",
            "My sisters",
            "The children",
            "My friend and I",
            "My brother and I"
          ],
          "possPl": [
            "Their",
            "Our"
          ]
        },
        "answerKey": {
          "one-owner-poss": {
            "poss": {
              "__cond": "person",
              "My brother": "His",
              "My father": "His",
              "My uncle": "His",
              "My sister": "Her",
              "My mother": "Her",
              "My aunt": "Her"
            }
          },
          "group-owner-poss": {
            "possPl": {
              "__cond": "group",
              "My parents": "Their",
              "My sisters": "Their",
              "The children": "Their",
              "My friend and I": "Our",
              "My brother and I": "Our"
            }
          }
        },
        "distractors": [
          "My brother has a new bag. Her bag is blue.",
          "My sister has a new bag. His bag is blue.",
          "My parents have new bags. Our bags are blue.",
          "My brother and I have new bags. Their bags are blue.",
          "My mother has a new bag. Their bag is blue.",
          "The children have new bags. Our bags are blue."
        ],
        "irregulars": {}
      },
      "teach_vi": "Tính từ sở hữu cho biết cái đó CỦA AI, và luôn đứng trước danh từ: my bag, his bag, their bags. Chọn theo người chủ: tôi → my; bạn → your; một người nam → his; một người nữ → her; chúng tôi (có tôi ở trong) → our; họ → their. Tính từ sở hữu KHÔNG đổi theo số nhiều: his bag và his bags đều dùng \"his\"."
    },
    {
      "id": "possessive-s",
      "title_vi": "Sở hữu cách với \"'s\"",
      "explain_vi": "Thêm \"'s\" vào sau người chủ rồi mới đến vật: Lan's bag. Thứ tự luôn là NGƯỜI + 's + VẬT.",
      "examples": [
        "This bag belongs to Lan. It is Lan's bag.",
        "I know my sister. This is my sister's cat.",
        "This desk belongs to the teacher. It is the teacher's desk."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "belongs-to-s",
            "text": "This bag belongs to {owner}. It is {ownerS} bag.",
            "blanks": [
              "ownerS"
            ],
            "context_vi": "Thêm \"'s\" vào sau người chủ.",
            "audioText": "This bag belongs to Lan. It is Lan's bag."
          },
          {
            "id": "know-owner-s",
            "text": "I know {owner}. This is {ownerS} cat.",
            "blanks": [
              "ownerS"
            ],
            "context_vi": "Con mèo thuộc về ai thì thêm \"'s\" vào sau người đó.",
            "audioText": "I know my sister. This is my sister's cat."
          }
        ],
        "slots": {
          "owner": [
            "Lan",
            "Minh",
            "my sister",
            "my brother",
            "the teacher",
            "my friend"
          ],
          "ownerS": [
            "Lan's",
            "Minh's",
            "my sister's",
            "my brother's",
            "the teacher's",
            "my friend's"
          ]
        },
        "answerKey": {
          "belongs-to-s": {
            "ownerS": {
              "__cond": "owner",
              "Lan": "Lan's",
              "Minh": "Minh's",
              "my sister": "my sister's",
              "my brother": "my brother's",
              "the teacher": "the teacher's",
              "my friend": "my friend's"
            }
          },
          "know-owner-s": {
            "ownerS": {
              "__cond": "owner",
              "Lan": "Lan's",
              "Minh": "Minh's",
              "my sister": "my sister's",
              "my brother": "my brother's",
              "the teacher": "the teacher's",
              "my friend": "my friend's"
            }
          }
        },
        "distractors": [
          "This bag belongs to Lan. It is Lan bag.",
          "This bag belongs to Lan. It is bag of Lan.",
          "I know my sister. This is my sister cat.",
          "I know Minh. This is cat of Minh.",
          "This bag belongs to Minh. It is Minhs bag.",
          "I know the teacher. This is the teacher cat."
        ],
        "irregulars": {}
      },
      "teach_vi": "Muốn nói một vật thuộc về ai, em thêm \"'s\" vào sau tên người rồi mới đến vật: Lan's bag (cái cặp của Lan), my sister's cat (con mèo của chị tôi). Thứ tự luôn là NGƯỜI + 's + VẬT. Nếu người chủ ở số nhiều đã có \"-s\" thì chỉ thêm dấu nháy: my parents' car."
    },
    {
      "id": "demonstratives",
      "title_vi": "Từ chỉ định: this · these · that · those",
      "explain_vi": "Gần + một → this, gần + nhiều → these, xa + một → that, xa + nhiều → those. \"here\" là gần, \"over there\" là xa; this/that đi với is, these/those đi với are.",
      "examples": [
        "This book here is mine.",
        "These books here are mine.",
        "That desk over there is new.",
        "Those desks over there are new."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "order_words",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "near-this-these",
            "text": "{demNear} {thing} here {beNear} mine.",
            "blanks": [
              "demNear"
            ],
            "context_vi": "\"here\" nghĩa là Ở ĐÂY (gần). Nhìn danh từ là số ít hay số nhiều để chọn this/these.",
            "audioText": "This book here is mine."
          },
          {
            "id": "far-that-those",
            "text": "{demFar} {thing} over there {beFar} new.",
            "blanks": [
              "demFar"
            ],
            "context_vi": "\"over there\" nghĩa là Ở KIA (xa). Nhìn danh từ là số ít hay số nhiều để chọn that/those.",
            "audioText": "That desk over there is new."
          }
        ],
        "slots": {
          "thing": [
            "book",
            "books",
            "pen",
            "pens",
            "bag",
            "bags",
            "ruler",
            "rulers",
            "desk",
            "desks"
          ],
          "demNear": [
            "This",
            "These"
          ],
          "demFar": [
            "That",
            "Those"
          ],
          "beNear": [
            "is",
            "are"
          ],
          "beFar": [
            "is",
            "are"
          ]
        },
        "answerKey": {
          "near-this-these": {
            "demNear": {
              "__cond": "thing",
              "book": "This",
              "books": "These",
              "pen": "This",
              "pens": "These",
              "bag": "This",
              "bags": "These",
              "ruler": "This",
              "rulers": "These",
              "desk": "This",
              "desks": "These"
            },
            "beNear": {
              "__cond": "thing",
              "book": "is",
              "books": "are",
              "pen": "is",
              "pens": "are",
              "bag": "is",
              "bags": "are",
              "ruler": "is",
              "rulers": "are",
              "desk": "is",
              "desks": "are"
            }
          },
          "far-that-those": {
            "demFar": {
              "__cond": "thing",
              "book": "That",
              "books": "Those",
              "pen": "That",
              "pens": "Those",
              "bag": "That",
              "bags": "Those",
              "ruler": "That",
              "rulers": "Those",
              "desk": "That",
              "desks": "Those"
            },
            "beFar": {
              "__cond": "thing",
              "book": "is",
              "books": "are",
              "pen": "is",
              "pens": "are",
              "bag": "is",
              "bags": "are",
              "ruler": "is",
              "rulers": "are",
              "desk": "is",
              "desks": "are"
            }
          }
        },
        "distractors": [
          "These book here is mine.",
          "This books here are mine.",
          "That books over there is new.",
          "Those desk over there are new.",
          "This pens here is mine.",
          "Those ruler over there are new."
        ],
        "irregulars": {}
      },
      "teach_vi": "Chọn theo hai điều: GẦN hay XA, và MỘT hay NHIỀU. Gần + một → \"this\"; gần + nhiều → \"these\"; xa + một → \"that\"; xa + nhiều → \"those\". Nhớ đi kèm động từ cho đúng: this/that đi với \"is\", these/those đi với \"are\". Từ \"here\" (ở đây) báo hiệu GẦN, còn \"over there\" (ở kia) báo hiệu XA."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "in-the-classroom",
      "title": "In the classroom",
      "title_vi": "Trong lớp học",
      "text": "Look at our classroom. This bag here is mine. That bag over there is Lan's. Her bag is blue and mine is green. Those desks near the window are new, but my desk is old. The teacher's desk is next to the door.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Cái cặp màu xanh dương là của Lan, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "Lan's bag is blue."
        },
        {
          "id": "q2",
          "q_vi": "Những cái bàn ở gần cửa sổ thì thế nào?",
          "type": "mcq",
          "choices": [
            "They are new.",
            "They are old.",
            "They are green."
          ],
          "answer": 0,
          "audioText": "The desks near the window are new."
        }
      ]
    }
  ]
};
  C["grammar3/unit04.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 404,
  "lesson": 4,
  "topic": "Articles: a, an, the",
  "topic_vi": "Mạo từ a / an / the",
  "vocab": [
    {
      "word": "apple",
      "vi": "quả táo",
      "icon": "🍎",
      "example": "This is an apple.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "orange",
      "vi": "quả cam",
      "icon": "🍊",
      "example": "I can see an orange.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "egg",
      "vi": "quả trứng",
      "icon": "🥚",
      "example": "I can see an egg.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "umbrella",
      "vi": "cái ô, cây dù",
      "icon": "☂️",
      "example": "I have got an umbrella.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "elephant",
      "vi": "con voi",
      "icon": "🐘",
      "example": "An elephant is very big.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "book",
      "vi": "quyển sách",
      "icon": "📕",
      "example": "This is a book.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "pen",
      "vi": "cây bút",
      "icon": "🖊️",
      "example": "I can see a pen.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "dog",
      "vi": "con chó",
      "icon": "🐶",
      "example": "I have got a dog.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "moon",
      "vi": "mặt trăng",
      "icon": "🌙",
      "example": "Look at the moon!",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "door",
      "vi": "cái cửa",
      "icon": "🚪",
      "example": "Please close the door.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "football",
      "vi": "bóng đá",
      "icon": "⚽",
      "example": "We play football after school.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "breakfast",
      "vi": "bữa sáng",
      "icon": "🥣",
      "example": "I have breakfast with my family every day.",
      "partOfSpeech": "noun",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "a-vs-an",
      "title_vi": "Mạo từ \"a\" và \"an\": chọn theo chữ đầu của danh từ",
      "explain_vi": "Danh từ đếm được số ít cần \"a\" hoặc \"an\". Từ bắt đầu bằng nguyên âm a, e, i, o, u thì dùng \"an\" (an apple); các từ còn lại dùng \"a\" (a book).",
      "examples": [
        "This is a book.",
        "This is an apple.",
        "I can see an umbrella."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "order_words"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "see-art-noun",
            "text": "I can see {art} {noun}.",
            "blanks": [
              "art"
            ],
            "context_vi": "Nhìn chữ đầu của danh từ: nguyên âm thì \"an\", phụ âm thì \"a\".",
            "audioText": "I can see an apple."
          },
          {
            "id": "this-is-art-noun",
            "text": "This is {art} {noun}.",
            "blanks": [
              "art"
            ],
            "context_vi": "Một cái thôi, nên phải có mạo từ \"a\" hoặc \"an\" trước danh từ.",
            "audioText": "This is a book."
          }
        ],
        "slots": {
          "art": [
            "a",
            "an"
          ],
          "noun": [
            "apple",
            "orange",
            "egg",
            "umbrella",
            "elephant",
            "book",
            "pen",
            "dog",
            "cat",
            "table"
          ]
        },
        "answerKey": {
          "see-art-noun": {
            "art": {
              "__cond": "noun",
              "apple": "an",
              "orange": "an",
              "egg": "an",
              "umbrella": "an",
              "elephant": "an",
              "book": "a",
              "pen": "a",
              "dog": "a",
              "cat": "a",
              "table": "a"
            }
          },
          "this-is-art-noun": {
            "art": {
              "__cond": "noun",
              "apple": "an",
              "orange": "an",
              "egg": "an",
              "umbrella": "an",
              "elephant": "an",
              "book": "a",
              "pen": "a",
              "dog": "a",
              "cat": "a",
              "table": "a"
            }
          }
        },
        "distractors": [
          "I can see a apple.",
          "I can see a egg.",
          "I can see an pen.",
          "This is a umbrella.",
          "This is an book.",
          "This is an dog."
        ],
        "irregulars": {}
      },
      "teach_vi": "Khi nói về MỘT thứ đếm được, tiếng Anh luôn cần mạo từ trước danh từ: a book, an apple. Chọn \"a\" hay \"an\" tuỳ chữ cái đầu của từ đi ngay sau: nếu là nguyên âm a, e, i, o, u thì dùng \"an\" — an apple, an orange, an egg, an umbrella, an elephant; nếu là phụ âm thì dùng \"a\" — a book, a pen, a dog, a table. Lý do là để hai nguyên âm không dính vào nhau, đọc cho dễ. Người Việt hay quên hẳn mạo từ (\"This is book\") hoặc dùng sai (\"a apple\") — hai lỗi này em cần để ý nhất."
    },
    {
      "id": "the-definite",
      "title_vi": "Mạo từ \"the\": khi cả hai đều đã biết thứ đó",
      "explain_vi": "Dùng \"the\" khi người nghe đã biết rõ thứ đó: nhắc lại lần thứ hai (a book → the book), hoặc thứ chỉ có một duy nhất như the moon, the sky.",
      "examples": [
        "I have got a book. The book is new.",
        "Look at the moon!",
        "Please close the door."
      ],
      "generators": [
        "fill_blank",
        "mcq"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "second-mention",
            "text": "I have got {art} {noun}. {def} {noun} is new.",
            "blanks": [
              "def"
            ],
            "context_vi": "Câu sau nhắc lại đúng thứ vừa nói ở câu trước — nhắc lại lần hai thì dùng mạo từ nào?",
            "audioText": "I have got a book. The book is new."
          },
          {
            "id": "look-at-unique",
            "text": "Look at {def2} {unique}!",
            "blanks": [
              "def2"
            ],
            "context_vi": "Trên trời chỉ có duy nhất một thứ đó — thứ duy nhất thì dùng mạo từ nào?",
            "audioText": "Look at the moon!"
          },
          {
            "id": "close-the-thing",
            "text": "Please close {def2} {roomthing}.",
            "blanks": [
              "def2"
            ],
            "context_vi": "Cả hai người đều biết rõ là cái nào trong phòng này — chọn mạo từ cho đúng.",
            "audioText": "Please close the door."
          }
        ],
        "slots": {
          "art": [
            "a",
            "an"
          ],
          "noun": [
            "book",
            "bike",
            "pen",
            "apple",
            "egg",
            "umbrella"
          ],
          "def": [
            "The",
            "A",
            "An"
          ],
          "def2": [
            "the",
            "a",
            "an"
          ],
          "unique": [
            "moon",
            "sky",
            "stars",
            "rainbow"
          ],
          "roomthing": [
            "door",
            "window",
            "gate",
            "fridge"
          ]
        },
        "answerKey": {
          "second-mention": {
            "def": "The",
            "art": {
              "__cond": "noun",
              "book": "a",
              "bike": "a",
              "pen": "a",
              "apple": "an",
              "egg": "an",
              "umbrella": "an"
            }
          },
          "look-at-unique": {
            "def2": "the"
          },
          "close-the-thing": {
            "def2": "the"
          }
        },
        "distractors": [
          "I have got a book. A book is new.",
          "I have got an egg. An egg is new.",
          "I have got a bike. Bike is new.",
          "Look at a moon!",
          "Look at moon!",
          "Please close door."
        ],
        "irregulars": {}
      },
      "teach_vi": "\"A / an\" dùng khi nói tới một thứ LẦN ĐẦU, người nghe chưa biết là cái nào. Sang lần thứ hai, cả hai đã biết rõ cái đó rồi thì đổi sang \"the\": I have got a book. The book is new. Ngoài ra em dùng \"the\" khi trên đời chỉ có một thứ như thế — the moon, the sun, the sky — và khi thứ đó rõ ràng trong hoàn cảnh đang nói: Please close the door (cái cửa của phòng này). Khác với \"a/an\", \"the\" dùng được cho cả số ít và số nhiều: the door, the doors."
    },
    {
      "id": "no-article",
      "title_vi": "Khi KHÔNG dùng mạo từ",
      "explain_vi": "Không dùng mạo từ trước tên môn học, môn chơi, bữa ăn và ngôn ngữ: play football, study English, have breakfast — không nói \"a football\" hay \"the breakfast\".",
      "examples": [
        "We play football after school.",
        "My brother studies English at school.",
        "I have breakfast with my family every day."
      ],
      "generators": [
        "mcq",
        "order_words"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "play-game",
            "text": "We play {game} after school.",
            "blanks": [],
            "context_vi": "Tên môn chơi đứng một mình, không có mạo từ.",
            "audioText": "We play football after school."
          },
          {
            "id": "study-subject",
            "text": "My brother studies {subject} at school.",
            "blanks": [],
            "context_vi": "Tên môn học và tên ngôn ngữ không có mạo từ.",
            "audioText": "My brother studies English at school."
          },
          {
            "id": "have-meal",
            "text": "I have {meal} with my family every day.",
            "blanks": [],
            "context_vi": "Tên bữa ăn không có mạo từ.",
            "audioText": "I have breakfast with my family every day."
          }
        ],
        "slots": {
          "game": [
            "football",
            "chess",
            "badminton",
            "volleyball",
            "tennis"
          ],
          "subject": [
            "English",
            "maths",
            "music",
            "art",
            "history"
          ],
          "meal": [
            "breakfast",
            "lunch",
            "dinner"
          ]
        },
        "answerKey": {},
        "distractors": [
          "We play the football after school.",
          "We play a chess after school.",
          "My brother studies the maths at school.",
          "My brother studies a English at school.",
          "I have a breakfast with my family every day.",
          "I have the dinner with my family every day."
        ],
        "irregulars": {}
      },
      "teach_vi": "Có những chỗ tiếng Anh KHÔNG dùng mạo từ, dù tiếng Việt vẫn nói \"môn bóng đá\", \"bữa sáng\". Bốn nhóm em cần nhớ: (1) môn chơi và môn thể thao — play football, play chess, play tennis; (2) môn học và ngôn ngữ — study English, study maths, learn music; (3) bữa ăn — have breakfast, have lunch, have dinner; (4) danh từ số nhiều hoặc không đếm được khi nói chung chung — I like apples, I drink milk. Vì vậy \"We play the football\" hay \"I have a breakfast\" đều sai."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "monday-morning",
      "title": "Monday morning",
      "title_vi": "Buổi sáng thứ Hai",
      "text": "It is Monday morning. I have breakfast at six o'clock. Then I take an umbrella and a book, and I go to school. The umbrella is new. At school we study English and maths. After school my friends and I play football in the park near my house.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Bạn ấy mang theo một cái ô, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "The child takes an umbrella."
        },
        {
          "id": "q2",
          "q_vi": "Sau giờ học các bạn ấy làm gì?",
          "type": "mcq",
          "choices": [
            "play football in the park",
            "study maths at home",
            "have breakfast at school"
          ],
          "answer": 0,
          "audioText": "What do they do after school?"
        }
      ]
    }
  ]
};
  C["grammar3/unit05.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 405,
  "lesson": 5,
  "topic": "Expressing quantity",
  "topic_vi": "Diễn tả số lượng",
  "vocab": [
    {
      "word": "water",
      "vi": "nước",
      "icon": "💧",
      "example": "I need a little water.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "milk",
      "vi": "sữa",
      "icon": "🥛",
      "example": "There is some milk in the fridge.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "juice",
      "vi": "nước ép",
      "icon": "🧃",
      "example": "I have got a lot of juice.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "bread",
      "vi": "bánh mì",
      "icon": "🍞",
      "example": "We have only a little bread left.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "rice",
      "vi": "gạo, cơm",
      "icon": "🍚",
      "example": "How much rice do you want?",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "money",
      "vi": "tiền",
      "icon": "💰",
      "example": "I have not got much money.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "sweets",
      "vi": "bánh kẹo",
      "icon": "🍬",
      "example": "I have got a few sweets in my bag.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "books",
      "vi": "những quyển sách",
      "icon": "📚",
      "example": "How many books have you got?",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "apples",
      "vi": "những quả táo",
      "icon": "🍎",
      "example": "There are some apples on the table.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "eggs",
      "vi": "những quả trứng",
      "icon": "🥚",
      "example": "We need a few eggs.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "pens",
      "vi": "những cây bút",
      "icon": "🖊️",
      "example": "I have got a lot of pens.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "fridge",
      "vi": "tủ lạnh",
      "icon": "🧊",
      "example": "The fridge is empty.",
      "partOfSpeech": "noun",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "some-any",
      "title_vi": "\"Some\" và \"any\": nói về một lượng nào đó",
      "explain_vi": "Câu khẳng định dùng \"some\"; câu phủ định (có not) và câu hỏi dùng \"any\": I have got some milk. / I have not got any milk. / Have you got any milk?",
      "examples": [
        "I have got some books in my bag.",
        "I have not got any books in my bag.",
        "Have you got any books in your bag?"
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "some-affirm",
            "text": "I have got {sa} {qnoun} in my bag.",
            "blanks": [
              "sa"
            ],
            "context_vi": "Đây là câu KHẲNG ĐỊNH (không có \"not\") — chọn \"some\" hay \"any\"?",
            "audioText": "I have got some books in my bag."
          },
          {
            "id": "any-negative",
            "text": "I have not got {sa} {qnoun} in my bag.",
            "blanks": [
              "sa"
            ],
            "context_vi": "Câu có \"not\" nên là câu PHỦ ĐỊNH — chọn \"some\" hay \"any\"?",
            "audioText": "I have not got any books in my bag."
          },
          {
            "id": "any-question",
            "text": "Have you got {sa} {qnoun} in your bag?",
            "blanks": [
              "sa"
            ],
            "context_vi": "Đây là câu HỎI (có dấu ?) — chọn \"some\" hay \"any\"?",
            "audioText": "Have you got any books in your bag?"
          }
        ],
        "slots": {
          "sa": [
            "some",
            "any"
          ],
          "qnoun": [
            "water",
            "milk",
            "bread",
            "rice",
            "sweets",
            "books",
            "apples",
            "pens"
          ]
        },
        "answerKey": {
          "some-affirm": {
            "sa": "some"
          },
          "any-negative": {
            "sa": "any"
          },
          "any-question": {
            "sa": "any"
          }
        },
        "distractors": [
          "I have got any water in my bag.",
          "I have got any books in my bag.",
          "I have not got some bread in my bag.",
          "I have not got some pens in my bag.",
          "Have you got some milk in your bag?",
          "Have you got some sweets in your bag?"
        ],
        "irregulars": {}
      },
      "teach_vi": "\"Some\" và \"any\" đều nghĩa là \"một ít / một vài\", dùng trước danh từ số nhiều (some books) hoặc danh từ không đếm được (some milk). Cách chọn rất đơn giản: câu KHẲNG ĐỊNH dùng \"some\" — I have got some sweets; câu PHỦ ĐỊNH có \"not\" dùng \"any\" — I have not got any sweets; câu HỎI cũng dùng \"any\" — Have you got any sweets? Chỉ có một ngoại lệ nhỏ em sẽ gặp sau này: khi mời hoặc xin thì vẫn nói \"some\" trong câu hỏi — Would you like some juice?"
    },
    {
      "id": "a-lot-of",
      "title_vi": "\"A lot of\" · \"much\" · \"many\": nói về lượng nhiều",
      "explain_vi": "Câu khẳng định dùng \"a lot of\" cho cả hai loại danh từ. Trong câu phủ định và câu hỏi: không đếm được → \"much\", đếm được số nhiều → \"many\".",
      "examples": [
        "I have got a lot of juice at home.",
        "I have not got much juice at home.",
        "How many books do you want?"
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "alot-affirm",
            "text": "I have got {alot} {qn} at home.",
            "blanks": [
              "alot"
            ],
            "context_vi": "Câu khẳng định nói \"nhiều\" — chọn \"a lot of\", \"much\" hay \"many\"?",
            "audioText": "I have got a lot of juice at home."
          },
          {
            "id": "not-much-many",
            "text": "I have not got {mm} {qn} at home.",
            "blanks": [
              "mm"
            ],
            "context_vi": "Câu phủ định: danh từ không đếm được → \"much\"; đếm được số nhiều → \"many\".",
            "audioText": "I have not got much juice at home."
          },
          {
            "id": "how-much-many",
            "text": "How {mm} {qn} do you want?",
            "blanks": [
              "mm"
            ],
            "context_vi": "Hỏi số lượng: không đếm được → \"much\"; đếm được số nhiều → \"many\".",
            "audioText": "How many books do you want?"
          }
        ],
        "slots": {
          "alot": [
            "a lot of",
            "much",
            "many"
          ],
          "mm": [
            "much",
            "many"
          ],
          "qn": [
            "water",
            "milk",
            "juice",
            "rice",
            "bread",
            "money",
            "books",
            "apples",
            "sweets",
            "pens"
          ]
        },
        "answerKey": {
          "alot-affirm": {
            "alot": "a lot of"
          },
          "not-much-many": {
            "mm": {
              "__cond": "qn",
              "water": "much",
              "milk": "much",
              "juice": "much",
              "rice": "much",
              "bread": "much",
              "money": "much",
              "books": "many",
              "apples": "many",
              "sweets": "many",
              "pens": "many"
            }
          },
          "how-much-many": {
            "mm": {
              "__cond": "qn",
              "water": "much",
              "milk": "much",
              "juice": "much",
              "rice": "much",
              "bread": "much",
              "money": "much",
              "books": "many",
              "apples": "many",
              "sweets": "many",
              "pens": "many"
            }
          }
        },
        "distractors": [
          "I have got a lot water at home.",
          "I have got lot of milk at home.",
          "I have not got much books at home.",
          "I have not got many rice at home.",
          "How much books do you want?",
          "How many water do you want?"
        ],
        "irregulars": {}
      },
      "teach_vi": "Muốn nói \"nhiều\", trong câu khẳng định em dùng \"a lot of\" — nó đi được với cả danh từ đếm được số nhiều (a lot of books) và danh từ không đếm được (a lot of water). Nhớ đủ ba chữ \"a lot of\", đừng bỏ \"a\" hay \"of\". Trong câu phủ định và câu hỏi, người ta thường dùng \"much\" với danh từ KHÔNG đếm được (How much water? / I have not got much water) và \"many\" với danh từ đếm được SỐ NHIỀU (How many books? / I have not got many books). Bí quyết: cứ hỏi \"thứ này đếm từng cái được không?\" — được thì many, không được thì much."
    },
    {
      "id": "a-few-a-little",
      "title_vi": "\"A few\" và \"a little\": nói về lượng ít",
      "explain_vi": "\"A few\" đi với danh từ đếm được số nhiều (a few eggs); \"a little\" đi với danh từ không đếm được (a little milk). Cả hai đều nghĩa là \"một ít\".",
      "examples": [
        "I have got a few eggs in my bag.",
        "I have got a little milk in my bag.",
        "We have only a little bread left."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "few-little-bag",
            "text": "I have got {fl} {qn2} in my bag.",
            "blanks": [
              "fl"
            ],
            "context_vi": "Đếm từng cái được → \"a few\"; không đếm được → \"a little\".",
            "audioText": "I have got a few eggs in my bag."
          },
          {
            "id": "only-few-little",
            "text": "We have only {fl} {qn2} left.",
            "blanks": [
              "fl"
            ],
            "context_vi": "Nhìn danh từ: đếm được số nhiều → \"a few\"; không đếm được → \"a little\".",
            "audioText": "We have only a little bread left."
          }
        ],
        "slots": {
          "fl": [
            "a few",
            "a little"
          ],
          "qn2": [
            "water",
            "milk",
            "bread",
            "rice",
            "money",
            "sweets",
            "books",
            "apples",
            "eggs",
            "pens"
          ]
        },
        "answerKey": {
          "few-little-bag": {
            "fl": {
              "__cond": "qn2",
              "water": "a little",
              "milk": "a little",
              "bread": "a little",
              "rice": "a little",
              "money": "a little",
              "sweets": "a few",
              "books": "a few",
              "apples": "a few",
              "eggs": "a few",
              "pens": "a few"
            }
          },
          "only-few-little": {
            "fl": {
              "__cond": "qn2",
              "water": "a little",
              "milk": "a little",
              "bread": "a little",
              "rice": "a little",
              "money": "a little",
              "sweets": "a few",
              "books": "a few",
              "apples": "a few",
              "eggs": "a few",
              "pens": "a few"
            }
          }
        },
        "distractors": [
          "I have got a few milk in my bag.",
          "I have got a little eggs in my bag.",
          "I have got a little books in my bag.",
          "We have only a little sweets left.",
          "We have only a few water left.",
          "We have only few money left."
        ],
        "irregulars": {}
      },
      "teach_vi": "\"A few\" và \"a little\" đều nghĩa là \"một ít\", nhưng dùng cho hai loại danh từ khác nhau. \"A few\" + danh từ ĐẾM ĐƯỢC SỐ NHIỀU: a few eggs, a few books, a few sweets. \"A little\" + danh từ KHÔNG ĐẾM ĐƯỢC: a little milk, a little water, a little money. Cách kiểm tra nhanh: nếu em nói được \"một quả, hai quả\" thì dùng a few; nếu phải đong bằng ly, bằng cân thì dùng a little. Đừng bỏ chữ \"a\": \"few books\" và \"little milk\" nghe như \"gần chẳng có gì\", nghĩa khác hẳn với \"a few books\" (có một ít)."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "picnic-basket",
      "title": "The picnic basket",
      "title_vi": "Giỏ đi chơi picnic",
      "text": "We are going on a picnic today. Mum looks in the fridge. There is a lot of juice, but there is only a little bread. \"Have you got any apples?\" she asks me. \"Yes, I have got a few apples and some sweets,\" I say. Mum smiles. \"Good. We do not need much rice today.\"",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Trong tủ lạnh chỉ còn một ít bánh mì, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "There is only a little bread in the fridge."
        },
        {
          "id": "q2",
          "q_vi": "Bạn ấy có bao nhiêu quả táo?",
          "type": "mcq",
          "choices": [
            "a few apples",
            "a lot of apples",
            "no apples"
          ],
          "answer": 0,
          "audioText": "How many apples has the child got?"
        }
      ]
    }
  ]
};
  C["grammar3/unit06.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 406,
  "lesson": 6,
  "topic": "Indefinite pronouns",
  "topic_vi": "Đại từ bất định",
  "vocab": [
    {
      "word": "somebody",
      "vi": "ai đó, có người",
      "icon": "🙋",
      "example": "Somebody is at the door.",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "anybody",
      "vi": "ai (trong câu phủ định, câu hỏi)",
      "icon": "🤷",
      "example": "I cannot see anybody in the garden.",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "nobody",
      "vi": "không ai cả",
      "icon": "🚷",
      "example": "Nobody is in the kitchen.",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "something",
      "vi": "cái gì đó",
      "icon": "🎁",
      "example": "I want something to eat.",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "anything",
      "vi": "cái gì (trong câu phủ định, câu hỏi)",
      "icon": "❔",
      "example": "I cannot find anything in my bag.",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "nothing",
      "vi": "không có gì cả",
      "icon": "⭕",
      "example": "There is nothing in the box.",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "everybody",
      "vi": "mọi người",
      "icon": "👨‍👩‍👧‍👦",
      "example": "Everybody in my class is happy.",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "everything",
      "vi": "mọi thứ",
      "icon": "🌈",
      "example": "Everything in my bag is new.",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "everywhere",
      "vi": "khắp mọi nơi",
      "icon": "🗺️",
      "example": "We looked for the cat everywhere.",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "garden",
      "vi": "khu vườn",
      "icon": "🌳",
      "example": "The garden is empty.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "noise",
      "vi": "tiếng động",
      "icon": "🔔",
      "example": "I can hear a noise.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "empty",
      "vi": "trống, rỗng",
      "icon": "🕳️",
      "example": "My bag is empty.",
      "partOfSpeech": "adj",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "some-any-no-body",
      "title_vi": "Nói về NGƯỜI: somebody · anybody · nobody",
      "explain_vi": "Câu khẳng định dùng \"somebody\" (có ai đó); câu phủ định có \"cannot / not\" dùng \"anybody\"; muốn nói \"không ai cả\" thì dùng \"nobody\" và bỏ \"not\" đi.",
      "examples": [
        "I can hear a noise. Somebody is knocking at the door.",
        "I cannot see anybody in the garden.",
        "The garden is empty. Nobody is there."
      ],
      "generators": [
        "fill_blank",
        "mcq"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "cannot-see-anybody",
            "text": "I cannot see {ip} in the {place}.",
            "blanks": [
              "ip"
            ],
            "context_vi": "Câu đã có \"cannot\" nên dùng \"anybody\"; thêm \"nobody\" nữa là phủ định hai lần, sai.",
            "audioText": "I cannot see anybody in the garden."
          },
          {
            "id": "empty-nobody",
            "text": "The {place} is empty. {ipCap} is there.",
            "blanks": [
              "ipCap"
            ],
            "context_vi": "Phòng trống không — chọn \"Somebody\", \"Anybody\" hay \"Nobody\" cho đúng nghĩa?",
            "audioText": "The garden is empty. Nobody is there."
          },
          {
            "id": "noise-somebody",
            "text": "I can hear a noise. {ipCap} is knocking at the {entrance}.",
            "blanks": [
              "ipCap"
            ],
            "context_vi": "Có tiếng động, và đây là câu khẳng định — chọn \"Somebody\", \"Anybody\" hay \"Nobody\"?",
            "audioText": "I can hear a noise. Somebody is knocking at the door."
          }
        ],
        "slots": {
          "ip": [
            "somebody",
            "anybody",
            "nobody"
          ],
          "ipCap": [
            "Somebody",
            "Anybody",
            "Nobody"
          ],
          "place": [
            "garden",
            "kitchen",
            "classroom",
            "park"
          ],
          "entrance": [
            "door",
            "window",
            "gate"
          ]
        },
        "answerKey": {
          "cannot-see-anybody": {
            "ip": "anybody"
          },
          "empty-nobody": {
            "ipCap": "Nobody"
          },
          "noise-somebody": {
            "ipCap": "Somebody"
          }
        },
        "distractors": [
          "I cannot see nobody in the garden.",
          "I cannot see nothing in the kitchen.",
          "The garden is empty. Nobody are there.",
          "The park is empty. Anybody is there.",
          "I can hear a noise. Anybody is knocking at the door.",
          "I can hear a noise. Somebody are knocking at the door."
        ],
        "irregulars": {}
      },
      "teach_vi": "Ba từ này đều nói về NGƯỜI mà ta không biết rõ là ai. \"Somebody\" (= someone) dùng trong câu khẳng định: Somebody is at the door — có ai đó ở ngoài cửa. \"Anybody\" (= anyone) dùng trong câu phủ định và câu hỏi: I cannot see anybody. / Can you see anybody? \"Nobody\" (= no one) tự nó đã mang nghĩa phủ định \"không ai cả\", nên câu KHÔNG được có \"not\" nữa: Nobody is there (đúng) — I cannot see nobody (sai, phủ định hai lần). Một điểm nữa rất hay quên: cả ba từ đều là SỐ ÍT, luôn đi với \"is\" chứ không phải \"are\" — Everybody is happy, Nobody is there."
    },
    {
      "id": "thing-compounds",
      "title_vi": "Nói về VẬT: something · anything · nothing",
      "explain_vi": "Câu khẳng định dùng \"something\"; câu phủ định có \"cannot / not\" dùng \"anything\"; muốn nói \"không có gì cả\" thì dùng \"nothing\" và bỏ \"not\" đi.",
      "examples": [
        "I am hungry. I want something to eat.",
        "I cannot find anything in my bag.",
        "My bag is empty. There is nothing in it."
      ],
      "generators": [
        "fill_blank",
        "mcq"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "cannot-find-anything",
            "text": "I cannot find {th} in my {place2}.",
            "blanks": [
              "th"
            ],
            "context_vi": "Câu đã có \"cannot\" nên dùng \"anything\"; thêm \"nothing\" nữa là phủ định hai lần, sai.",
            "audioText": "I cannot find anything in my bag."
          },
          {
            "id": "empty-nothing",
            "text": "My {container} is empty. There is {th} in it.",
            "blanks": [
              "th"
            ],
            "context_vi": "Chỗ đó trống không — chọn \"something\", \"anything\" hay \"nothing\"?",
            "audioText": "My bag is empty. There is nothing in it."
          },
          {
            "id": "hungry-something",
            "text": "I am {state}. I want {th} to {eatdrink}.",
            "blanks": [
              "th"
            ],
            "context_vi": "Đang đói/khát và MUỐN có, câu khẳng định — chọn \"something\", \"anything\" hay \"nothing\"?",
            "audioText": "I am hungry. I want something to eat."
          }
        ],
        "slots": {
          "th": [
            "something",
            "anything",
            "nothing"
          ],
          "container": [
            "bag",
            "box",
            "cup",
            "basket"
          ],
          "place2": [
            "bag",
            "box",
            "room",
            "pocket"
          ],
          "state": [
            "hungry",
            "thirsty"
          ],
          "eatdrink": [
            "eat",
            "drink"
          ]
        },
        "answerKey": {
          "cannot-find-anything": {
            "th": "anything"
          },
          "empty-nothing": {
            "th": "nothing"
          },
          "hungry-something": {
            "th": "something",
            "eatdrink": {
              "__cond": "state",
              "hungry": "eat",
              "thirsty": "drink"
            }
          }
        },
        "distractors": [
          "I cannot find nothing in my bag.",
          "I cannot find any thing in my bag.",
          "My box is empty. There are nothing in it.",
          "My bag is empty. There is no anything in it.",
          "I am thirsty. I want something drink.",
          "I am hungry. I want anything for eat."
        ],
        "irregulars": {}
      },
      "teach_vi": "Ba từ này nói về VẬT mà ta không nói rõ là cái gì, và chúng đi theo đúng luật của some / any / no. \"Something\" dùng trong câu khẳng định: I want something to eat. \"Anything\" dùng trong câu phủ định và câu hỏi: I cannot find anything. / Have you got anything for me? \"Nothing\" tự nó đã phủ định (= not anything), nên trong câu không có \"not\" nữa: There is nothing in it (đúng) — There is not nothing in it (sai). Nhớ viết LIỀN một từ: something, anything, nothing — viết tách thành \"some thing\", \"any thing\" là sai."
    },
    {
      "id": "every-where",
      "title_vi": "Nói về TẤT CẢ: everybody · everything · everywhere",
      "explain_vi": "\"Everybody\" = tất cả mọi người, \"everything\" = tất cả mọi thứ, \"everywhere\" = khắp mọi nơi. Everybody và everything là SỐ ÍT, luôn đi với \"is\".",
      "examples": [
        "Everybody in my class is happy today.",
        "Everything in my bag is new.",
        "We looked for the cat everywhere."
      ],
      "generators": [
        "fill_blank",
        "mcq"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "everybody-class",
            "text": "{ev} in my {group} is happy today.",
            "blanks": [
              "ev"
            ],
            "context_vi": "Câu này nói về NGƯỜI — chọn \"Everybody\", \"Everything\" hay \"Everywhere\"?",
            "audioText": "Everybody in my class is happy today."
          },
          {
            "id": "everything-bag",
            "text": "{ev} in my {container2} is new.",
            "blanks": [
              "ev"
            ],
            "context_vi": "Câu này nói về ĐỒ VẬT — chọn \"Everybody\", \"Everything\" hay \"Everywhere\"?",
            "audioText": "Everything in my bag is new."
          },
          {
            "id": "looked-everywhere",
            "text": "We looked for the {lostthing} {ev2}.",
            "blanks": [
              "ev2"
            ],
            "context_vi": "Câu này nói về NƠI đã tìm — chọn \"everywhere\", \"everybody\" hay \"everything\"?",
            "audioText": "We looked for the cat everywhere."
          },
          {
            "id": "everybody-be",
            "text": "Everybody in my family {be} at home now.",
            "blanks": [
              "be"
            ],
            "context_vi": "\"Everybody\" là số ít, nên đi với \"is\" chứ không phải \"are\".",
            "audioText": "Everybody in my family is at home now."
          }
        ],
        "slots": {
          "ev": [
            "Everybody",
            "Everything",
            "Everywhere"
          ],
          "ev2": [
            "everywhere",
            "everybody",
            "everything"
          ],
          "be": [
            "is",
            "are"
          ],
          "lostthing": [
            "cat",
            "ball",
            "key",
            "dog"
          ],
          "group": [
            "class",
            "family",
            "team"
          ],
          "container2": [
            "bag",
            "box",
            "room"
          ]
        },
        "answerKey": {
          "everybody-class": {
            "ev": "Everybody"
          },
          "everything-bag": {
            "ev": "Everything"
          },
          "looked-everywhere": {
            "ev2": "everywhere"
          },
          "everybody-be": {
            "be": "is"
          }
        },
        "distractors": [
          "Everybody in my class are happy today.",
          "Everything in my bag are new.",
          "Everywhere in my class is happy today.",
          "Everybody in my bag is new.",
          "We looked for the cat everybody.",
          "Everybody in my family are at home now."
        ],
        "irregulars": {}
      },
      "teach_vi": "Nhóm \"every-\" nói về TẤT CẢ: \"everybody\" (= everyone) là tất cả mọi người, \"everything\" là tất cả mọi thứ, \"everywhere\" là khắp mọi nơi. Chọn theo nội dung: nói về người thì everybody, nói về đồ vật thì everything, nói về địa điểm thì everywhere (và everywhere thường đứng ở cuối câu: We looked everywhere). Điều dễ sai nhất: dù nghĩa là \"tất cả\", everybody và everything vẫn là SỐ ÍT, nên đi với \"is\" và động từ thêm \"-s\": Everybody is happy (không phải \"are happy\"), Everything looks new."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "a-quiet-afternoon",
      "title": "A quiet afternoon",
      "title_vi": "Một buổi chiều yên tĩnh",
      "text": "It is very quiet at home this afternoon. Nobody is in the living room. I look in the kitchen: there is nothing on the table. Then I hear a noise in the garden. Somebody is there! It is my little brother. He is looking for his ball. We look everywhere, and at last we find it under the tree. Now everybody is happy.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Trong phòng khách không có ai cả, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "Nobody is in the living room."
        },
        {
          "id": "q2",
          "q_vi": "Ai đang ở trong vườn?",
          "type": "mcq",
          "choices": [
            "my little brother",
            "my mother",
            "nobody"
          ],
          "answer": 0,
          "audioText": "Who is in the garden?"
        }
      ]
    }
  ]
};
  C["grammar3/unit07.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 407,
  "lesson": 7,
  "topic": "Present Simple",
  "topic_vi": "Hiện tại đơn",
  "vocab": [
    {
      "word": "get up",
      "vi": "thức dậy",
      "icon": "🌅",
      "example": "I get up at six every morning.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "walk",
      "vi": "đi bộ",
      "icon": "🚶",
      "example": "My sister walks to school every day.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "study",
      "vi": "học",
      "icon": "📖",
      "example": "They study English every week.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "watch",
      "vi": "xem",
      "icon": "📺",
      "example": "We watch TV at night.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "drink",
      "vi": "uống",
      "icon": "🥛",
      "example": "My brother drinks milk every day.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "breakfast",
      "vi": "bữa sáng",
      "icon": "🍳",
      "example": "My mother eats noodles for breakfast.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "coffee",
      "vi": "cà phê",
      "icon": "☕",
      "example": "My father likes coffee.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "football",
      "vi": "bóng đá",
      "icon": "⚽",
      "example": "My brother plays football after school.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "always",
      "vi": "luôn luôn",
      "icon": "💯",
      "example": "My sister always walks to school.",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "usually",
      "vi": "thường thường",
      "icon": "🕐",
      "example": "I usually get up at six.",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "sometimes",
      "vi": "thỉnh thoảng",
      "icon": "🔄",
      "example": "We sometimes play football after school.",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "never",
      "vi": "không bao giờ",
      "icon": "🚫",
      "example": "They never watch TV at night.",
      "partOfSpeech": "adverb",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "third-person-s",
      "title_vi": "Thêm \"-s\" cho He · She · It",
      "explain_vi": "Với He / She / It hoặc MỘT người, động từ thêm \"-s\": goes, studies, plays. Với I / You / We / They hoặc nhiều người, động từ để nguyên: go, study, play.",
      "examples": [
        "My brother goes to school by bus.",
        "They go to school by bus.",
        "My sister studies English every week.",
        "We play football after school."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "order_words",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "go-by-bus",
            "text": "{subj} {goForm} to school by bus.",
            "blanks": [
              "goForm"
            ],
            "context_vi": "Chọn dạng đúng cho khớp chủ ngữ: \"go\" hay \"goes\"?",
            "audioText": "My brother goes to school by bus."
          },
          {
            "id": "study-english",
            "text": "{subj} {studyForm} English every week.",
            "blanks": [
              "studyForm"
            ],
            "context_vi": "Chọn dạng đúng cho khớp chủ ngữ: \"study\" hay \"studies\"? Nhớ quy tắc y → ies.",
            "audioText": "My sister studies English every week."
          },
          {
            "id": "play-football",
            "text": "{subj} {playForm} football after school.",
            "blanks": [
              "playForm"
            ],
            "context_vi": "Chọn dạng đúng cho khớp chủ ngữ: \"play\" hay \"plays\"?",
            "audioText": "My brother plays football after school."
          }
        ],
        "slots": {
          "subj": [
            "I",
            "You",
            "We",
            "They",
            "He",
            "She",
            "My brother",
            "My sister",
            "My friends"
          ],
          "goForm": [
            "go",
            "goes"
          ],
          "studyForm": [
            "study",
            "studies"
          ],
          "playForm": [
            "play",
            "plays"
          ]
        },
        "answerKey": {
          "go-by-bus": {
            "goForm": {
              "__cond": "subj",
              "I": "go",
              "You": "go",
              "We": "go",
              "They": "go",
              "He": "goes",
              "She": "goes",
              "My brother": "goes",
              "My sister": "goes",
              "My friends": "go"
            }
          },
          "study-english": {
            "studyForm": {
              "__cond": "subj",
              "I": "study",
              "You": "study",
              "We": "study",
              "They": "study",
              "He": "studies",
              "She": "studies",
              "My brother": "studies",
              "My sister": "studies",
              "My friends": "study"
            }
          },
          "play-football": {
            "playForm": {
              "__cond": "subj",
              "I": "play",
              "You": "play",
              "We": "play",
              "They": "play",
              "He": "plays",
              "She": "plays",
              "My brother": "plays",
              "My sister": "plays",
              "My friends": "play"
            }
          }
        },
        "distractors": [
          "My brother go to school by bus.",
          "We goes to school by bus.",
          "My sister studys English every week.",
          "He study English every week.",
          "They plays football after school.",
          "My friends plays football after school."
        ],
        "irregulars": {}
      },
      "teach_vi": "Hiện tại đơn nói về việc làm THƯỜNG XUYÊN, quen thuộc: đi học, ăn sáng, chơi bóng. Động từ chỉ đổi khi chủ ngữ là He / She / It hoặc MỘT người, MỘT vật — lúc đó thêm \"-s\": He plays, My sister walks. Có ba kiểu thêm: (1) thường chỉ thêm \"-s\" — play → plays, walk → walks; (2) động từ kết thúc bằng s, x, ch, sh, o thì thêm \"-es\" — watch → watches, go → goes, do → does; (3) động từ kết thúc bằng phụ âm + y thì đổi y thành \"-ies\" — study → studies, fly → flies. Với I / You / We / They hoặc nhiều người, động từ để NGUYÊN: I play, They walk, My friends study."
    },
    {
      "id": "do-does-questions",
      "title_vi": "Câu hỏi với Do · Does",
      "explain_vi": "Câu hỏi hiện tại đơn bắt đầu bằng Do hoặc Does. He / She / It và một người → Does; I / You / We / They và nhiều người → Do. Sau đó động từ để NGUYÊN.",
      "examples": [
        "Do you like ice cream?",
        "Does your brother like ice cream?",
        "Do your friends live in Ha Noi?",
        "Does Lan live in Ha Noi?"
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "order_words",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "q-like-ice-cream",
            "text": "{aux} {subjQ} like ice cream?",
            "blanks": [
              "aux"
            ],
            "context_vi": "Chủ ngữ một người thì mở đầu bằng \"Does\", còn lại là \"Do\".",
            "audioText": "Does your brother like ice cream?"
          },
          {
            "id": "q-live-in-hanoi",
            "text": "{aux} {subjQ} live in Ha Noi?",
            "blanks": [
              "aux"
            ],
            "context_vi": "Nhớ: sau Do/Does, động từ để nguyên — \"live\", không phải \"lives\".",
            "audioText": "Do your friends live in Ha Noi?"
          }
        ],
        "slots": {
          "subjQ": [
            "you",
            "they",
            "we",
            "he",
            "she",
            "your brother",
            "your sister",
            "your friends",
            "Nam",
            "Lan"
          ],
          "aux": [
            "Do",
            "Does"
          ]
        },
        "answerKey": {
          "q-like-ice-cream": {
            "aux": {
              "__cond": "subjQ",
              "you": "Do",
              "they": "Do",
              "we": "Do",
              "he": "Does",
              "she": "Does",
              "your brother": "Does",
              "your sister": "Does",
              "your friends": "Do",
              "Nam": "Does",
              "Lan": "Does"
            }
          },
          "q-live-in-hanoi": {
            "aux": {
              "__cond": "subjQ",
              "you": "Do",
              "they": "Do",
              "we": "Do",
              "he": "Does",
              "she": "Does",
              "your brother": "Does",
              "your sister": "Does",
              "your friends": "Do",
              "Nam": "Does",
              "Lan": "Does"
            }
          }
        },
        "distractors": [
          "Does you like ice cream?",
          "Do your brother like ice cream?",
          "Does they live in Ha Noi?",
          "Do she live in Ha Noi?",
          "Does your friends like ice cream?",
          "Does Nam likes ice cream?"
        ],
        "irregulars": {}
      },
      "teach_vi": "Muốn hỏi trong hiện tại đơn, em đặt \"Do\" hoặc \"Does\" lên đầu câu: Do you like ice cream? / Does your sister like ice cream? Cách chọn giống quy tắc thêm \"-s\": chủ ngữ là He / She / It hoặc MỘT người thì dùng \"Does\", còn I / You / We / They hoặc nhiều người thì dùng \"Do\". Điểm trẻ Việt hay sai nhất: sau \"Does\" thì động từ phải để NGUYÊN, vì chữ \"-s\" đã nhảy sang \"Does\" rồi — nói \"Does she like…?\" chứ KHÔNG nói \"Does she likes…?\". Trả lời ngắn: Yes, I do. / No, she doesn't."
    },
    {
      "id": "dont-doesnt",
      "title_vi": "Phủ định: don't · doesn't",
      "explain_vi": "Phủ định hiện tại đơn: He / She / It và một người → doesn't; I / You / We / They và nhiều người → don't. Sau don't / doesn't, động từ để NGUYÊN, không thêm \"-s\".",
      "examples": [
        "I don't like coffee.",
        "My brother doesn't like coffee.",
        "My parents don't watch TV at night.",
        "She doesn't watch TV at night."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "order_words",
        "transform",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "neg-like-coffee",
            "text": "{subjN} {neg} like coffee.",
            "blanks": [
              "neg"
            ],
            "context_vi": "Chủ ngữ một người thì dùng \"doesn't\", còn lại dùng \"don't\".",
            "audioText": "My brother doesn't like coffee."
          },
          {
            "id": "neg-watch-tv",
            "text": "{subjN} {neg} watch TV at night.",
            "blanks": [
              "neg"
            ],
            "context_vi": "Sau don't / doesn't, động từ để nguyên — \"watch\", không phải \"watches\".",
            "audioText": "My parents don't watch TV at night."
          }
        ],
        "slots": {
          "subjN": [
            "I",
            "You",
            "We",
            "They",
            "He",
            "She",
            "My brother",
            "My sister",
            "My parents"
          ],
          "neg": [
            "don't",
            "doesn't"
          ]
        },
        "answerKey": {
          "neg-like-coffee": {
            "neg": {
              "__cond": "subjN",
              "I": "don't",
              "You": "don't",
              "We": "don't",
              "They": "don't",
              "He": "doesn't",
              "She": "doesn't",
              "My brother": "doesn't",
              "My sister": "doesn't",
              "My parents": "don't"
            }
          },
          "neg-watch-tv": {
            "neg": {
              "__cond": "subjN",
              "I": "don't",
              "You": "don't",
              "We": "don't",
              "They": "don't",
              "He": "doesn't",
              "She": "doesn't",
              "My brother": "doesn't",
              "My sister": "doesn't",
              "My parents": "don't"
            }
          },
          "answer-pairs": {
            "I like coffee.": "I don't like coffee.",
            "You like coffee.": "You don't like coffee.",
            "We like coffee.": "We don't like coffee.",
            "They like coffee.": "They don't like coffee.",
            "He likes coffee.": "He doesn't like coffee.",
            "She likes coffee.": "She doesn't like coffee.",
            "My brother likes coffee.": "My brother doesn't like coffee.",
            "My parents watch TV at night.": "My parents don't watch TV at night.",
            "My sister watches TV at night.": "My sister doesn't watch TV at night.",
            "He watches TV at night.": "He doesn't watch TV at night."
          }
        },
        "distractors": [
          "He don't like coffee.",
          "I doesn't like coffee.",
          "She doesn't likes coffee.",
          "My brother don't watch TV at night.",
          "They doesn't watch TV at night.",
          "We doesn't watch TV at night."
        ],
        "irregulars": {}
      },
      "teach_vi": "Để nói KHÔNG làm việc gì trong hiện tại đơn, em thêm \"don't\" hoặc \"doesn't\" trước động từ. Chủ ngữ He / She / It hoặc MỘT người → \"doesn't\"; I / You / We / They hoặc nhiều người → \"don't\". Rất quan trọng: sau don't / doesn't thì động từ để NGUYÊN, vì chữ \"-s\" đã chuyển sang \"doesn't\" — nói \"She doesn't like coffee\" chứ KHÔNG nói \"She doesn't likes coffee\". Muốn đổi từ câu khẳng định sang phủ định, em bỏ \"-s\" của động từ rồi thêm \"doesn't\": He watches TV → He doesn't watch TV."
    },
    {
      "id": "frequency-adverbs",
      "title_vi": "Trạng từ tần suất: always · usually · sometimes · never",
      "explain_vi": "Trạng từ tần suất đứng TRƯỚC động từ thường: always (mọi ngày), usually (phần lớn các ngày), sometimes (thỉnh thoảng), never (không bao giờ).",
      "examples": [
        "My brother always walks to school, seven days a week.",
        "My sister usually eats noodles for breakfast, five or six days a week.",
        "We sometimes walk to school, one or two days a month.",
        "They never eat noodles for breakfast, not even once a year."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "freq-walk",
            "text": "{subjF} {freq} {walkForm} to school, {timePhrase}.",
            "blanks": [
              "freq"
            ],
            "context_vi": "Đọc phần sau dấu phẩy để biết bao nhiêu lần, rồi chọn trạng từ khớp.",
            "audioText": "My brother always walks to school, seven days a week."
          },
          {
            "id": "freq-breakfast",
            "text": "{subjF} {freq} {eatForm} noodles for breakfast, {timePhrase}.",
            "blanks": [
              "freq"
            ],
            "context_vi": "Phần sau dấu phẩy cho biết số lần — chọn trạng từ tần suất khớp với nó.",
            "audioText": "My sister usually eats noodles for breakfast, five or six days a week."
          }
        ],
        "slots": {
          "subjF": [
            "I",
            "You",
            "We",
            "They",
            "He",
            "She",
            "My brother",
            "My sister",
            "My friends"
          ],
          "freq": [
            "always",
            "usually",
            "sometimes",
            "never"
          ],
          "timePhrase": [
            "seven days a week",
            "five or six days a week",
            "one or two days a month",
            "not even once a year"
          ],
          "walkForm": [
            "walk",
            "walks"
          ],
          "eatForm": [
            "eat",
            "eats"
          ]
        },
        "answerKey": {
          "freq-walk": {
            "freq": {
              "__cond": "timePhrase",
              "seven days a week": "always",
              "five or six days a week": "usually",
              "one or two days a month": "sometimes",
              "not even once a year": "never"
            },
            "walkForm": {
              "__cond": "subjF",
              "I": "walk",
              "You": "walk",
              "We": "walk",
              "They": "walk",
              "He": "walks",
              "She": "walks",
              "My brother": "walks",
              "My sister": "walks",
              "My friends": "walk"
            }
          },
          "freq-breakfast": {
            "freq": {
              "__cond": "timePhrase",
              "seven days a week": "always",
              "five or six days a week": "usually",
              "one or two days a month": "sometimes",
              "not even once a year": "never"
            },
            "eatForm": {
              "__cond": "subjF",
              "I": "eat",
              "You": "eat",
              "We": "eat",
              "They": "eat",
              "He": "eats",
              "She": "eats",
              "My brother": "eats",
              "My sister": "eats",
              "My friends": "eat"
            }
          }
        },
        "distractors": [
          "My brother walks always to school, seven days a week.",
          "My sister eats always noodles for breakfast, seven days a week.",
          "They never walks to school, not even once a year.",
          "He usually walk to school, five or six days a week.",
          "We sometimes eats noodles for breakfast, one or two days a month.",
          "My friends always eats noodles for breakfast, seven days a week."
        ],
        "irregulars": {}
      },
      "teach_vi": "Trạng từ tần suất cho biết một việc xảy ra bao nhiêu lần: always (luôn luôn, gần như mọi lần) → usually (thường thường) → often (hay) → sometimes (thỉnh thoảng) → never (không bao giờ). Vị trí là điều trẻ Việt hay đặt sai: trạng từ tần suất đứng TRƯỚC động từ thường — \"She always walks to school\", KHÔNG nói \"She walks always to school\". Nhưng nếu câu có am / is / are thì trạng từ đứng SAU nó: \"He is always late\". Nhớ thêm: dù có trạng từ tần suất, động từ vẫn phải khớp chủ ngữ — She always walks, They always walk."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "nams-day",
      "title": "Nam's day",
      "title_vi": "Một ngày của Nam",
      "text": "Nam is my classmate. He gets up at six every morning. He always walks to school with his sister. Nam does not like coffee, but he drinks milk every day. His sister usually reads a book after dinner. They never watch TV at night.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Nam luôn đi bộ đến trường cùng chị/em gái, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "Nam always walks to school with his sister."
        },
        {
          "id": "q2",
          "q_vi": "Nam KHÔNG thích thứ nào?",
          "type": "mcq",
          "choices": [
            "coffee",
            "milk",
            "noodles"
          ],
          "answer": 0,
          "audioText": "What does Nam not like?"
        }
      ]
    }
  ]
};
  C["grammar3/unit08.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 408,
  "lesson": 8,
  "topic": "Present Continuous",
  "topic_vi": "Hiện tại tiếp diễn",
  "vocab": [
    {
      "word": "read",
      "vi": "đọc",
      "icon": "📖",
      "example": "My sister is reading a book now.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "run",
      "vi": "chạy",
      "icon": "🏃",
      "example": "Look! My brother is running very fast.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "swim",
      "vi": "bơi",
      "icon": "🏊",
      "example": "I am swimming in the river now.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "write",
      "vi": "viết",
      "icon": "✍️",
      "example": "She is writing a letter now.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "dance",
      "vi": "múa, nhảy",
      "icon": "💃",
      "example": "They are dancing in the garden.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "draw",
      "vi": "vẽ",
      "icon": "🎨",
      "example": "My brother is drawing a picture.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "cook",
      "vi": "nấu ăn",
      "icon": "🍳",
      "example": "My mother is cooking noodles now.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "music",
      "vi": "âm nhạc",
      "icon": "🎵",
      "example": "We are listening to music now.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "homework",
      "vi": "bài tập về nhà",
      "icon": "📝",
      "example": "He is doing his homework now.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "garden",
      "vi": "khu vườn",
      "icon": "🌳",
      "example": "The children are playing in the garden.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "now",
      "vi": "bây giờ",
      "icon": "⏰",
      "example": "My sister is singing now.",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "at the moment",
      "vi": "lúc này",
      "icon": "⌚",
      "example": "My father is reading at the moment.",
      "partOfSpeech": "phrase",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "be-ving",
      "title_vi": "am · is · are + động từ -ing",
      "explain_vi": "Hiện tại tiếp diễn = am / is / are + động từ thêm \"-ing\". I → am; He / She / It và một người → is; You / We / They và nhiều người → are.",
      "examples": [
        "I am listening to music now.",
        "My brother is listening to music now.",
        "Look! They are running very fast.",
        "My friends are running very fast."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "order_words",
        "transform",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "listen-music",
            "text": "{subjC} {be} listening to music now.",
            "blanks": [
              "be"
            ],
            "context_vi": "Chọn am / is / are cho khớp chủ ngữ; động từ đã có \"-ing\" rồi.",
            "audioText": "My brother is listening to music now."
          },
          {
            "id": "run-fast",
            "text": "Look! {subjC} {be} running very fast.",
            "blanks": [
              "be"
            ],
            "context_vi": "\"Look!\" cho biết việc đang xảy ra ngay lúc này — dùng hiện tại tiếp diễn.",
            "audioText": "Look! My sister is running very fast."
          }
        ],
        "slots": {
          "subjC": [
            "I",
            "You",
            "We",
            "They",
            "He",
            "She",
            "My brother",
            "My sister",
            "My friends"
          ],
          "be": [
            "am",
            "is",
            "are"
          ]
        },
        "answerKey": {
          "listen-music": {
            "be": {
              "__cond": "subjC",
              "I": "am",
              "You": "are",
              "We": "are",
              "They": "are",
              "He": "is",
              "She": "is",
              "My brother": "is",
              "My sister": "is",
              "My friends": "are"
            }
          },
          "run-fast": {
            "be": {
              "__cond": "subjC",
              "I": "am",
              "You": "are",
              "We": "are",
              "They": "are",
              "He": "is",
              "She": "is",
              "My brother": "is",
              "My sister": "is",
              "My friends": "are"
            }
          },
          "answer-pairs": {
            "I am listening to music now.": "I am not listening to music now.",
            "You are listening to music now.": "You are not listening to music now.",
            "We are listening to music now.": "We are not listening to music now.",
            "They are listening to music now.": "They are not listening to music now.",
            "He is listening to music now.": "He is not listening to music now.",
            "My sister is listening to music now.": "My sister is not listening to music now.",
            "She is running very fast.": "She is not running very fast.",
            "My brother is running very fast.": "My brother is not running very fast.",
            "My friends are running very fast.": "My friends are not running very fast.",
            "I am running very fast.": "I am not running very fast."
          }
        },
        "distractors": [
          "My brother are listening to music now.",
          "I is listening to music now.",
          "My friends is listening to music now.",
          "My brother is listen to music now.",
          "Look! They is running very fast.",
          "Look! He are running very fast."
        ],
        "irregulars": {}
      },
      "teach_vi": "Hiện tại tiếp diễn nói về việc ĐANG xảy ra ngay lúc này. Công thức: chủ ngữ + am / is / are + động từ thêm \"-ing\". Chọn \"to be\" như đã học: I → am; He / She / It hoặc MỘT người → is; You / We / They hoặc nhiều người → are. Hai lỗi trẻ Việt hay mắc: (1) bỏ mất am/is/are — nói \"I going to school\" thay vì \"I am going to school\"; (2) bỏ mất \"-ing\" — nói \"He is listen\" thay vì \"He is listening\". Phủ định chỉ cần thêm \"not\" ngay sau am/is/are: I am not listening, She is not running, They are not running. Những từ như now, at the moment, Look! là dấu hiệu của thì này."
    },
    {
      "id": "ing-spelling",
      "title_vi": "Cách thêm \"-ing\" cho động từ",
      "explain_vi": "Thêm \"-ing\": thường giữ nguyên (read → reading); bỏ \"e\" cuối (write → writing); gấp đôi phụ âm cuối khi trước nó là một nguyên âm ngắn (run → running).",
      "examples": [
        "My sister can swim well. She is swimming now.",
        "My sister can write well. She is writing now.",
        "I like to read. Look, I am reading now!",
        "I like to dance. Look, I am dancing now!"
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "can-well-now",
            "text": "My sister can {verbBase} well. She is {verbIng} now.",
            "blanks": [
              "verbIng"
            ],
            "context_vi": "Đổi động từ ở câu trước sang dạng \"-ing\" cho đúng chính tả.",
            "audioText": "My sister can swim well. She is swimming now."
          },
          {
            "id": "like-to-now",
            "text": "I like to {verbBase}. Look, I am {verbIng} now!",
            "blanks": [
              "verbIng"
            ],
            "context_vi": "Lấy đúng động từ ở câu trước rồi thêm \"-ing\" theo quy tắc chính tả.",
            "audioText": "I like to run. Look, I am running now!"
          }
        ],
        "slots": {
          "verbBase": [
            "swim",
            "run",
            "write",
            "dance",
            "draw",
            "play",
            "read",
            "cook"
          ],
          "verbIng": [
            "swimming",
            "running",
            "writing",
            "dancing",
            "drawing",
            "playing",
            "reading",
            "cooking"
          ]
        },
        "answerKey": {
          "can-well-now": {
            "verbIng": {
              "__cond": "verbBase",
              "swim": "swimming",
              "run": "running",
              "write": "writing",
              "dance": "dancing",
              "draw": "drawing",
              "play": "playing",
              "read": "reading",
              "cook": "cooking"
            }
          },
          "like-to-now": {
            "verbIng": {
              "__cond": "verbBase",
              "swim": "swimming",
              "run": "running",
              "write": "writing",
              "dance": "dancing",
              "draw": "drawing",
              "play": "playing",
              "read": "reading",
              "cook": "cooking"
            }
          }
        },
        "distractors": [
          "My sister can swim well. She is swiming now.",
          "My sister can run well. She is runing now.",
          "My sister can write well. She is writeing now.",
          "My sister can dance well. She is danceing now.",
          "I like to swim. Look, I am swim now!",
          "I like to run. Look, I am runing now!"
        ],
        "irregulars": {
          "swim": "swimming",
          "run": "running",
          "sit": "sitting",
          "put": "putting",
          "write": "writing",
          "dance": "dancing",
          "make": "making",
          "come": "coming"
        }
      },
      "teach_vi": "Có ba quy tắc thêm \"-ing\". (1) Phần lớn động từ chỉ thêm \"-ing\" và không đổi gì: read → reading, play → playing, cook → cooking, draw → drawing. (2) Động từ kết thúc bằng chữ \"e\" câm thì BỎ \"e\" rồi thêm \"-ing\": write → writing, dance → dancing, make → making, come → coming. (3) Động từ một âm tiết kết thúc bằng một phụ âm mà ngay trước nó là một nguyên âm ngắn thì GẤP ĐÔI phụ âm cuối: run → running, swim → swimming, sit → sitting, put → putting. Đừng viết \"swiming\", \"runing\", \"writeing\" — đó là ba lỗi chính tả phổ biến nhất."
    },
    {
      "id": "simple-vs-continuous",
      "title_vi": "Hiện tại đơn hay hiện tại tiếp diễn?",
      "explain_vi": "\"every day, every afternoon\" là việc làm thường xuyên → hiện tại đơn (plays). \"now, right now, at the moment\" là đang xảy ra → hiện tại tiếp diễn (is playing).",
      "examples": [
        "My brother plays football every day.",
        "My brother is playing football right now.",
        "Lan reads a book every afternoon.",
        "Lan is reading a book at the moment."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "which-tense-football",
            "text": "{subj3} {vfPlay} football {timeMark}.",
            "blanks": [
              "vfPlay"
            ],
            "context_vi": "Xem cụm chỉ thời gian ở cuối câu: thường xuyên → \"plays\"; đang xảy ra → \"is playing\".",
            "audioText": "My brother is playing football right now."
          },
          {
            "id": "which-tense-book",
            "text": "{subj3} {vfRead} a book {timeMark}.",
            "blanks": [
              "vfRead"
            ],
            "context_vi": "Cụm thời gian ở cuối câu cho biết chọn \"reads\" hay \"is reading\".",
            "audioText": "My sister reads a book every afternoon."
          }
        ],
        "slots": {
          "subj3": [
            "My brother",
            "My sister",
            "He",
            "She",
            "Nam",
            "Lan"
          ],
          "timeMark": [
            "every day",
            "every afternoon",
            "right now",
            "at the moment"
          ],
          "vfPlay": [
            "plays",
            "is playing"
          ],
          "vfRead": [
            "reads",
            "is reading"
          ]
        },
        "answerKey": {
          "which-tense-football": {
            "vfPlay": {
              "__cond": "timeMark",
              "every day": "plays",
              "every afternoon": "plays",
              "right now": "is playing",
              "at the moment": "is playing"
            }
          },
          "which-tense-book": {
            "vfRead": {
              "__cond": "timeMark",
              "every day": "reads",
              "every afternoon": "reads",
              "right now": "is reading",
              "at the moment": "is reading"
            }
          }
        },
        "distractors": [
          "My brother is play football every day.",
          "My brother plays football right now.",
          "My sister reading a book at the moment.",
          "My sister is read a book at the moment.",
          "Nam playing football at the moment.",
          "Lan reads a book right now."
        ],
        "irregulars": {}
      },
      "teach_vi": "Hai thì này rất dễ lẫn, nên em hãy tìm DẤU HIỆU THỜI GIAN trong câu. Nếu câu có every day, every afternoon, every week, always, usually, sometimes, never — đó là việc làm thường xuyên, dùng HIỆN TẠI ĐƠN: My brother plays football every day. Nếu câu có now, right now, at the moment, today, Look!, Listen! — đó là việc đang xảy ra ngay lúc này, dùng HIỆN TẠI TIẾP DIỄN: My brother is playing football right now. Nhớ rằng hiện tại tiếp diễn LUÔN có am/is/are đi cùng động từ \"-ing\" — thiếu một trong hai là câu sai."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "saturday-morning",
      "title": "Saturday morning",
      "title_vi": "Buổi sáng thứ Bảy",
      "text": "It is Saturday morning and my family is at home. My mother is cooking noodles in the kitchen. My father is reading a newspaper. My brother is doing his homework, but he is not writing — he is drawing a picture of a cat! I am listening to music in my room. Nobody is watching TV today.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Mẹ đang nấu mì trong nhà bếp, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "The mother is cooking noodles in the kitchen."
        },
        {
          "id": "q2",
          "q_vi": "Người anh/em trai đang làm gì?",
          "type": "mcq",
          "choices": [
            "He is drawing a picture.",
            "He is watching TV.",
            "He is cooking noodles."
          ],
          "answer": 0,
          "audioText": "What is the brother doing?"
        }
      ]
    }
  ]
};
  C["grammar3/unit09.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 409,
  "lesson": 9,
  "topic": "Prepositions of place, movement and time",
  "topic_vi": "Giới từ nơi chốn · chuyển động · thời gian",
  "vocab": [
    {
      "word": "box",
      "vi": "cái hộp",
      "icon": "📦",
      "example": "The cat is in the box.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "kitchen",
      "vi": "nhà bếp",
      "icon": "🍽️",
      "example": "My mother is in the kitchen.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "classroom",
      "vi": "lớp học",
      "icon": "🏫",
      "example": "My brother is in the classroom.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "bus",
      "vi": "xe buýt",
      "icon": "🚌",
      "example": "Nam is on the bus.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "hill",
      "vi": "đồi",
      "icon": "⛰️",
      "example": "The dog runs up the hill.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "river",
      "vi": "con sông",
      "icon": "🌊",
      "example": "The boy swims across the river.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "tunnel",
      "vi": "đường hầm",
      "icon": "🚇",
      "example": "The train goes through the tunnel.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "under",
      "vi": "ở dưới",
      "icon": "⬇️",
      "example": "The cat is under the table.",
      "partOfSpeech": "preposition",
      "audio": ""
    },
    {
      "word": "behind",
      "vi": "ở phía sau",
      "icon": "🔙",
      "example": "The cat is behind the box.",
      "partOfSpeech": "preposition",
      "audio": ""
    },
    {
      "word": "next to",
      "vi": "ở bên cạnh",
      "icon": "↔️",
      "example": "My desk is next to the door.",
      "partOfSpeech": "preposition",
      "audio": ""
    },
    {
      "word": "into",
      "vi": "vào trong",
      "icon": "🚪",
      "example": "Lan walks into the room.",
      "partOfSpeech": "preposition",
      "audio": ""
    },
    {
      "word": "night",
      "vi": "buổi tối, ban đêm",
      "icon": "🌙",
      "example": "We watch TV at night.",
      "partOfSpeech": "noun",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "prep-place",
      "title_vi": "Giới từ nơi chốn: at · in · on · under · behind · next to",
      "explain_vi": "at + home / school; in + phòng hoặc vườn (in the kitchen); on + xe buýt hoặc tàu (on the bus). Vị trí: in (trong), on (trên), under (dưới), next to (cạnh), behind (sau).",
      "examples": [
        "My brother is at home now.",
        "My sister is in the kitchen now.",
        "Nam is on the bus now.",
        "The cat is below the box, so it is under the box."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "place-at-in-on",
            "text": "{subjP} is {prepA} {placeA} now.",
            "blanks": [
              "prepA"
            ],
            "context_vi": "Ba giới từ at / in / on đi với những loại nơi khác nhau — chọn cụm đúng.",
            "audioText": "My brother is at home now."
          },
          {
            "id": "place-synonym",
            "text": "The cat is {glossB}, so it is {prepB} the box.",
            "blanks": [
              "prepB"
            ],
            "context_vi": "Đọc phần đầu câu để biết vị trí, rồi chọn giới từ có nghĩa giống hệt.",
            "audioText": "The cat is below the box, so it is under the box."
          }
        ],
        "slots": {
          "subjP": [
            "My sister",
            "My brother",
            "My mother",
            "My father",
            "Nam",
            "Lan"
          ],
          "placeA": [
            "home",
            "school",
            "the kitchen",
            "the garden",
            "the classroom",
            "the bus",
            "the train"
          ],
          "prepA": [
            "at",
            "in",
            "on"
          ],
          "glossB": [
            "inside the box",
            "on top of the box",
            "below the box",
            "beside the box",
            "at the back of the box",
            "at the front of the box"
          ],
          "prepB": [
            "in",
            "on",
            "under",
            "next to",
            "behind",
            "in front of"
          ]
        },
        "answerKey": {
          "place-at-in-on": {
            "prepA": {
              "__cond": "placeA",
              "home": "at",
              "school": "at",
              "the kitchen": "in",
              "the garden": "in",
              "the classroom": "in",
              "the bus": "on",
              "the train": "on"
            }
          },
          "place-synonym": {
            "prepB": {
              "__cond": "glossB",
              "inside the box": "in",
              "on top of the box": "on",
              "below the box": "under",
              "beside the box": "next to",
              "at the back of the box": "behind",
              "at the front of the box": "in front of"
            }
          }
        },
        "distractors": [
          "My brother is in home now.",
          "My sister is on school now.",
          "Nam is at the kitchen now.",
          "Lan is in the bus now.",
          "The cat is below the box, so it is on the box.",
          "The cat is inside the box, so it is under the box."
        ],
        "irregulars": {}
      },
      "teach_vi": "Giới từ nơi chốn cho biết một người hay một vật Ở ĐÂU. Nhóm thứ nhất là ba cụm cố định phải học thuộc: \"at\" đi với home, school, work (at home, at school); \"in\" đi với không gian có bao quanh — in the kitchen, in the garden, in the classroom, in Ha Noi; \"on\" đi với phương tiện công cộng và bề mặt — on the bus, on the train, on the wall, on the floor. Nhóm thứ hai là vị trí so với vật khác: in (ở trong), on (ở trên), under (ở dưới), next to (ở bên cạnh), behind (ở phía sau), in front of (ở phía trước), between (ở giữa hai vật). Trẻ Việt hay nói \"in home\" hoặc \"in the bus\" — hãy nhớ đúng là \"at home\" và \"on the bus\"."
    },
    {
      "id": "prep-movement",
      "title_vi": "Giới từ chuyển động: into · out of · up · down · across · through",
      "explain_vi": "Giới từ chuyển động cho biết đi theo hướng nào: into (vào trong), out of (ra khỏi), up (lên), down (xuống), across (băng qua bề mặt), through (xuyên qua bên trong).",
      "examples": [
        "First Nam is outside the room. Then he walks into the room.",
        "First Lan is inside the room. Then she walks out of the room.",
        "The dog wants to reach the top of the hill. So it runs up the hill.",
        "There is a long tunnel here. The boy goes through it to the other side."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "move-into",
            "text": "First {mover} is outside the room. Then {pronK} walks {prepInto} the room.",
            "blanks": [
              "prepInto"
            ],
            "context_vi": "Lúc đầu ở NGOÀI phòng, sau đó đi vào trong — chọn giới từ chỉ đúng hướng đó.",
            "audioText": "First Nam is outside the room. Then he walks into the room."
          },
          {
            "id": "move-out-of",
            "text": "First {mover} is inside the room. Then {pronK} walks {prepOut} the room.",
            "blanks": [
              "prepOut"
            ],
            "context_vi": "Lúc đầu ở TRONG phòng, sau đó đi ra ngoài — chọn giới từ chỉ đúng hướng đó.",
            "audioText": "First Lan is inside the room. Then she walks out of the room."
          },
          {
            "id": "move-up-down",
            "text": "{clueUD} So it runs {prepUD} the hill.",
            "blanks": [
              "prepUD"
            ],
            "context_vi": "Con chó muốn tới đâu? Lên đỉnh đồi thì \"up\", xuống chân đồi thì \"down\".",
            "audioText": "The dog wants to reach the top of the hill. So it runs up the hill."
          },
          {
            "id": "move-across-through",
            "text": "{clueAT} The boy goes {prepAT} it to the other side.",
            "blanks": [
              "prepAT"
            ],
            "context_vi": "Qua mặt sông rộng thì \"across\"; đi lọt vào bên trong đường hầm thì \"through\".",
            "audioText": "There is a wide river here. The boy goes across it to the other side."
          }
        ],
        "slots": {
          "mover": [
            "Nam",
            "Lan",
            "my brother",
            "my sister",
            "the cat",
            "the dog"
          ],
          "pronK": [
            "he",
            "she",
            "it"
          ],
          "prepInto": [
            "into",
            "out of",
            "up",
            "down"
          ],
          "prepOut": [
            "into",
            "out of",
            "up",
            "down"
          ],
          "clueUD": [
            "The dog wants to reach the top of the hill.",
            "The dog wants to reach the bottom of the hill."
          ],
          "prepUD": [
            "up",
            "down"
          ],
          "clueAT": [
            "There is a wide river here.",
            "There is a long tunnel here."
          ],
          "prepAT": [
            "across",
            "through"
          ]
        },
        "answerKey": {
          "move-into": {
            "prepInto": "into",
            "pronK": {
              "__cond": "mover",
              "Nam": "he",
              "Lan": "she",
              "my brother": "he",
              "my sister": "she",
              "the cat": "it",
              "the dog": "it"
            }
          },
          "move-out-of": {
            "prepOut": "out of",
            "pronK": {
              "__cond": "mover",
              "Nam": "he",
              "Lan": "she",
              "my brother": "he",
              "my sister": "she",
              "the cat": "it",
              "the dog": "it"
            }
          },
          "move-up-down": {
            "prepUD": {
              "__cond": "clueUD",
              "The dog wants to reach the top of the hill.": "up",
              "The dog wants to reach the bottom of the hill.": "down"
            }
          },
          "move-across-through": {
            "prepAT": {
              "__cond": "clueAT",
              "There is a wide river here.": "across",
              "There is a long tunnel here.": "through"
            }
          }
        },
        "distractors": [
          "First Nam is outside the room. Then he walks out of the room.",
          "First Lan is inside the room. Then she walks into the room.",
          "The dog wants to reach the top of the hill. So it runs down the hill.",
          "The dog wants to reach the bottom of the hill. So it runs up the hill.",
          "There is a wide river here. The boy goes through it to the other side.",
          "There is a long tunnel here. The boy goes across it to the other side."
        ],
        "irregulars": {}
      },
      "teach_vi": "Giới từ nơi chốn nói VẬT Ở ĐÂU, còn giới từ chuyển động nói VẬT ĐI THEO HƯỚNG NÀO. Hãy nhớ từng cặp ngược nhau: into (đi vào trong) ↔ out of (đi ra khỏi); up (đi lên) ↔ down (đi xuống); to (đi tới) ↔ from (đi từ). Hai từ dễ lẫn nhất là across và through: \"across\" là băng qua BỀ MẶT của cái gì đó — swim across the river, walk across the street; còn \"through\" là xuyên qua BÊN TRONG của cái gì đó — go through the tunnel, walk through the forest. Ngoài ra còn \"along\" là đi dọc theo — walk along the river, và \"over\" là vượt qua phía trên — jump over the wall."
    },
    {
      "id": "prep-time",
      "title_vi": "Giới từ thời gian: at · on · in",
      "explain_vi": "at + giờ và cụm \"at night\"; on + thứ hoặc ngày (on Monday); in + tháng, mùa, buổi trong ngày (in July, in the morning).",
      "examples": [
        "The film starts at seven o'clock.",
        "The film starts on Monday evening.",
        "We often go swimming in July.",
        "We often go swimming at night."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "time-clock-day",
            "text": "The film starts {prepT1} {timeT1}.",
            "blanks": [
              "prepT1"
            ],
            "context_vi": "Đọc cụm thời gian: đó là một GIỜ cụ thể hay một NGÀY trong tuần?",
            "audioText": "The film starts at seven o'clock."
          },
          {
            "id": "time-month-part",
            "text": "We often go swimming {prepT2} {timeT2}.",
            "blanks": [
              "prepT2"
            ],
            "context_vi": "Đọc cụm thời gian: đó là tháng, mùa, một buổi trong ngày, hay là ban đêm?",
            "audioText": "We often go swimming in the morning."
          }
        ],
        "slots": {
          "timeT1": [
            "seven o'clock",
            "half past eight",
            "Monday",
            "Friday",
            "Sunday",
            "Monday evening"
          ],
          "prepT1": [
            "at",
            "on",
            "in"
          ],
          "timeT2": [
            "July",
            "August",
            "summer",
            "the morning",
            "the afternoon",
            "the evening",
            "night"
          ],
          "prepT2": [
            "at",
            "on",
            "in"
          ]
        },
        "answerKey": {
          "time-clock-day": {
            "prepT1": {
              "__cond": "timeT1",
              "seven o'clock": "at",
              "half past eight": "at",
              "Monday": "on",
              "Friday": "on",
              "Sunday": "on",
              "Monday evening": "on"
            }
          },
          "time-month-part": {
            "prepT2": {
              "__cond": "timeT2",
              "July": "in",
              "August": "in",
              "summer": "in",
              "the morning": "in",
              "the afternoon": "in",
              "the evening": "in",
              "night": "at"
            }
          }
        },
        "distractors": [
          "The film starts in seven o'clock.",
          "The film starts at Monday.",
          "The film starts in Monday evening.",
          "We often go swimming on July.",
          "We often go swimming in night.",
          "We often go swimming at the morning."
        ],
        "irregulars": {}
      },
      "teach_vi": "Ba giới từ thời gian đi từ hẹp đến rộng. \"at\" dùng cho một ĐIỂM thời gian: at seven o'clock, at half past eight, at midday — và hai cụm đặc biệt phải học thuộc là at night, at the weekend. \"on\" dùng cho một NGÀY cụ thể: on Monday, on Sunday morning, on 2 September, on my birthday. \"in\" dùng cho một KHOẢNG dài: in July, in summer, in 2026, và cho các buổi trong ngày — in the morning, in the afternoon, in the evening. Hãy để ý điểm bẫy: buổi sáng, trưa, chiều dùng \"in\" nhưng ban đêm lại dùng \"at\" — in the morning nhưng at night."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "the-way-to-school",
      "title": "The way to school",
      "title_vi": "Đường đến trường",
      "text": "My school is on Nguyen Trai Street. Lessons start at seven o'clock in the morning. On Monday we always have English. My classroom is on the second floor, next to the library. After school I walk down the hill and across a small bridge to get home. In July we do not go to school.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Giờ học bắt đầu lúc bảy giờ sáng, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "Lessons start at seven o'clock in the morning."
        },
        {
          "id": "q2",
          "q_vi": "Lớp học của bạn ấy ở đâu?",
          "type": "mcq",
          "choices": [
            "on the second floor",
            "under the library",
            "in the garden"
          ],
          "answer": 0,
          "audioText": "Where is the classroom?"
        }
      ]
    }
  ]
};
  C["grammar3/unit10.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 410,
  "lesson": 10,
  "topic": "Past Simple",
  "topic_vi": "Quá khứ đơn",
  "vocab": [
    {
      "word": "yesterday",
      "vi": "hôm qua",
      "icon": "📅",
      "example": "I played football yesterday.",
      "partOfSpeech": "adv",
      "audio": ""
    },
    {
      "word": "play",
      "vi": "chơi",
      "icon": "⚽",
      "example": "We played in the park yesterday.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "study",
      "vi": "học",
      "icon": "📖",
      "example": "She studied English last night.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "clean",
      "vi": "dọn dẹp",
      "icon": "🧹",
      "example": "I cleaned my room yesterday.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "jog",
      "vi": "chạy bộ",
      "icon": "🏃",
      "example": "My father jogged in the park.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "go",
      "vi": "đi",
      "icon": "🚶",
      "example": "We went to the market yesterday.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "eat",
      "vi": "ăn",
      "icon": "🍜",
      "example": "I ate noodles for lunch.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "see",
      "vi": "thấy, nhìn thấy",
      "icon": "👀",
      "example": "I saw a big bird yesterday.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "buy",
      "vi": "mua",
      "icon": "🛒",
      "example": "My mother bought some bread.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "write",
      "vi": "viết",
      "icon": "✍️",
      "example": "He wrote a letter last week.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "sleep",
      "vi": "ngủ",
      "icon": "😴",
      "example": "I slept at home last night.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "sing",
      "vi": "hát",
      "icon": "🎤",
      "example": "Lan sang a nice song.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "market",
      "vi": "cái chợ",
      "icon": "🏪",
      "example": "We went to the market yesterday.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "late",
      "vi": "muộn, trễ",
      "icon": "⏰",
      "example": "Nam was late for school yesterday.",
      "partOfSpeech": "adj",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "ed-regular",
      "title_vi": "Quá khứ có quy tắc: thêm -ed",
      "explain_vi": "Việc đã xảy ra rồi thì thêm \"-ed\": play → played. Từ kết thúc bằng \"e\" chỉ thêm \"-d\"; phụ âm + y đổi thành \"-ied\"; nguyên âm ngắn + 1 phụ âm thì gấp đôi phụ âm.",
      "examples": [
        "I play every day. Yesterday I played, too.",
        "I study every day. Yesterday I studied, too.",
        "Today I do not jog, but yesterday I jogged."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "transform"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "ed-every-day",
            "text": "I {base} every day. Yesterday I {past}, too.",
            "blanks": [
              "past"
            ],
            "context_vi": "Câu sau nói về HÔM QUA, nên động từ ở trước phải chuyển sang dạng quá khứ.",
            "audioText": "I play every day. Yesterday I played, too."
          },
          {
            "id": "ed-not-today",
            "text": "Today I do not {base}, but yesterday I {past}.",
            "blanks": [
              "past"
            ],
            "context_vi": "Sau \"do not\" động từ giữ nguyên mẫu; phần nói về hôm qua phải ở quá khứ.",
            "audioText": "Today I do not dance, but yesterday I danced."
          }
        ],
        "slots": {
          "base": [
            "play",
            "cook",
            "clean",
            "walk",
            "dance",
            "smile",
            "study",
            "hurry",
            "jog",
            "chat"
          ],
          "past": [
            "played",
            "cooked",
            "cleaned",
            "walked",
            "danced",
            "smiled",
            "studied",
            "hurried",
            "jogged",
            "chatted"
          ]
        },
        "answerKey": {
          "ed-every-day": {
            "past": {
              "__cond": "base",
              "play": "played",
              "cook": "cooked",
              "clean": "cleaned",
              "walk": "walked",
              "dance": "danced",
              "smile": "smiled",
              "study": "studied",
              "hurry": "hurried",
              "jog": "jogged",
              "chat": "chatted"
            }
          },
          "ed-not-today": {
            "past": {
              "__cond": "base",
              "play": "played",
              "cook": "cooked",
              "clean": "cleaned",
              "walk": "walked",
              "dance": "danced",
              "smile": "smiled",
              "study": "studied",
              "hurry": "hurried",
              "jog": "jogged",
              "chat": "chatted"
            }
          },
          "answer-pairs": {
            "I played football yesterday.": "I did not play football yesterday.",
            "I cooked dinner yesterday.": "I did not cook dinner yesterday.",
            "I studied English yesterday.": "I did not study English yesterday.",
            "I cleaned my room yesterday.": "I did not clean my room yesterday.",
            "I walked to school yesterday.": "I did not walk to school yesterday.",
            "I danced at the party yesterday.": "I did not dance at the party yesterday.",
            "I jogged in the park yesterday.": "I did not jog in the park yesterday.",
            "I chatted with my friend yesterday.": "I did not chat with my friend yesterday."
          },
          "transform-explain": {
            "I played football yesterday.": "Phủ định ở quá khứ dùng \"did not\" + động từ NGUYÊN MẪU: played → did not play.",
            "I cooked dinner yesterday.": "Phủ định ở quá khứ dùng \"did not\" + động từ NGUYÊN MẪU: cooked → did not cook.",
            "I studied English yesterday.": "Phủ định ở quá khứ dùng \"did not\" + động từ NGUYÊN MẪU: studied → did not study.",
            "I cleaned my room yesterday.": "Phủ định ở quá khứ dùng \"did not\" + động từ NGUYÊN MẪU: cleaned → did not clean.",
            "I walked to school yesterday.": "Phủ định ở quá khứ dùng \"did not\" + động từ NGUYÊN MẪU: walked → did not walk.",
            "I danced at the party yesterday.": "Phủ định ở quá khứ dùng \"did not\" + động từ NGUYÊN MẪU: danced → did not dance.",
            "I jogged in the park yesterday.": "Phủ định ở quá khứ dùng \"did not\" + động từ NGUYÊN MẪU: jogged → did not jog.",
            "I chatted with my friend yesterday.": "Phủ định ở quá khứ dùng \"did not\" + động từ NGUYÊN MẪU: chatted → did not chat."
          }
        },
        "distractors": [
          "I play every day. Yesterday I playd, too.",
          "I study every day. Yesterday I studyed, too.",
          "I dance every day. Yesterday I danceed, too.",
          "I jog every day. Yesterday I joged, too.",
          "Today I do not walk, but yesterday I walk.",
          "Today I do not chat, but yesterday I chated.",
          "Today I do not study, but yesterday I studyed.",
          "Today I do not hurry, but yesterday I hurryed."
        ],
        "irregulars": {}
      },
      "teach_vi": "Khi kể một việc ĐÃ XONG trong quá khứ, em đổi động từ sang dạng quá khứ. Với động từ có quy tắc, em chỉ cần thêm \"-ed\": play → played, cook → cooked, walk → walked. Có bốn nhóm cần để ý: (1) từ đã kết thúc bằng \"e\" thì chỉ thêm \"-d\" — dance → danced, smile → smiled; (2) phụ âm + y thì đổi y thành \"-ied\" — study → studied, hurry → hurried; (3) từ ngắn có nguyên âm ngắn + một phụ âm cuối thì gấp đôi phụ âm rồi mới thêm \"-ed\" — jog → jogged, chat → chatted, stop → stopped; (4) nguyên âm + y thì chỉ thêm \"-ed\" — play → played. Dấu hiệu nhận ra quá khứ trong câu: yesterday, last night, last week, two days ago. Khi câu đã có \"did not\" thì động từ trở lại dạng NGUYÊN MẪU: I did not play (không phải \"did not played\")."
    },
    {
      "id": "irregular-past",
      "title_vi": "Động từ bất quy tắc ở quá khứ",
      "explain_vi": "Nhiều động từ không thêm \"-ed\" mà đổi hẳn cả từ: see → saw, eat → ate, buy → bought, write → wrote. Những từ này phải học thuộc.",
      "examples": [
        "I see it every day. Yesterday I saw it, too.",
        "I buy it every day. Yesterday I bought it, too.",
        "Yesterday I wrote it, but today I do not write it."
      ],
      "generators": [
        "fill_blank",
        "mcq"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "irr-every-day",
            "text": "I {base} it every day. Yesterday I {past} it, too.",
            "blanks": [
              "past"
            ],
            "context_vi": "Đây là động từ bất quy tắc — không thêm \"-ed\", phải đổi cả từ.",
            "audioText": "I see it every day. Yesterday I saw it, too."
          },
          {
            "id": "irr-yesterday-but",
            "text": "Yesterday I {past} it, but today I do not {base} it.",
            "blanks": [
              "past"
            ],
            "context_vi": "Động từ nguyên mẫu ở cuối câu là manh mối — hãy đổi nó sang dạng quá khứ bất quy tắc.",
            "audioText": "Yesterday I ate it, but today I do not eat it."
          }
        ],
        "slots": {
          "base": [
            "see",
            "eat",
            "buy",
            "write",
            "make",
            "take",
            "do",
            "find",
            "drink",
            "get"
          ],
          "past": [
            "saw",
            "ate",
            "bought",
            "wrote",
            "made",
            "took",
            "did",
            "found",
            "drank",
            "got"
          ]
        },
        "answerKey": {
          "irr-every-day": {
            "past": {
              "__cond": "base",
              "see": "saw",
              "eat": "ate",
              "buy": "bought",
              "write": "wrote",
              "make": "made",
              "take": "took",
              "do": "did",
              "find": "found",
              "drink": "drank",
              "get": "got"
            }
          },
          "irr-yesterday-but": {
            "past": {
              "__cond": "base",
              "see": "saw",
              "eat": "ate",
              "buy": "bought",
              "write": "wrote",
              "make": "made",
              "take": "took",
              "do": "did",
              "find": "found",
              "drink": "drank",
              "get": "got"
            }
          }
        },
        "distractors": [
          "I see it every day. Yesterday I seed it, too.",
          "I eat it every day. Yesterday I eated it, too.",
          "I buy it every day. Yesterday I buyed it, too.",
          "I write it every day. Yesterday I writed it, too.",
          "Yesterday I taked it, but today I do not take it.",
          "Yesterday I drinked it, but today I do not drink it.",
          "Yesterday I seed it, but today I do not see it.",
          "Yesterday I finded it, but today I do not find it."
        ],
        "irregulars": {
          "see": "saw",
          "eat": "ate",
          "buy": "bought",
          "write": "wrote",
          "make": "made",
          "take": "took",
          "do": "did",
          "find": "found",
          "drink": "drank",
          "get": "got",
          "go": "went",
          "have": "had",
          "sing": "sang",
          "sleep": "slept",
          "read": "read"
        }
      },
      "teach_vi": "Có một nhóm động từ rất hay dùng KHÔNG chịu thêm \"-ed\" — chúng đổi hẳn cả từ. Em cần học thuộc theo cặp: see → saw, eat → ate, buy → bought, write → wrote, make → made, take → took, do → did, find → found, drink → drank, get → got, go → went, have → had, sing → sang, sleep → slept. Vài từ đặc biệt giữ nguyên chữ viết: read → read (nhưng đọc khác nhau), cut → cut, put → put. Mẹo học: mỗi ngày học 3 cặp và tự đặt một câu với \"yesterday\". Lưu ý: khi câu đã có \"did not\" thì dùng lại NGUYÊN MẪU — I did not see it (không phải \"did not saw\")."
    },
    {
      "id": "did-questions",
      "title_vi": "Câu hỏi quá khứ với \"Did\"",
      "explain_vi": "Hỏi về quá khứ: \"Did\" + chủ ngữ + động từ NGUYÊN MẪU. Vì \"did\" đã mang nghĩa quá khứ nên động từ chính không đổi. Khi trả lời mới dùng dạng quá khứ.",
      "examples": [
        "I stayed at home yesterday. Did you stay at home yesterday?",
        "Did you cook at home last night? Yes, I cooked at home last night.",
        "Did you sing at home last night? Yes, I sang at home last night."
      ],
      "generators": [
        "fill_blank",
        "mcq"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "did-question",
            "text": "I {pastQ} at home yesterday. Did you {baseQ} at home yesterday?",
            "blanks": [
              "baseQ"
            ],
            "context_vi": "Sau \"Did you\" động từ trở lại NGUYÊN MẪU, không thêm -ed và không đổi bất quy tắc.",
            "audioText": "I stayed at home yesterday. Did you stay at home yesterday?"
          },
          {
            "id": "did-short-answer",
            "text": "Did you {baseQ} at home last night? Yes, I {pastQ} at home last night.",
            "blanks": [
              "pastQ"
            ],
            "context_vi": "Câu trả lời không còn \"did\" nữa, nên động từ phải chuyển sang dạng quá khứ.",
            "audioText": "Did you cook at home last night? Yes, I cooked at home last night."
          }
        ],
        "slots": {
          "pastQ": [
            "stayed",
            "cooked",
            "studied",
            "worked",
            "slept",
            "played",
            "ate",
            "sang"
          ],
          "baseQ": [
            "stay",
            "cook",
            "study",
            "work",
            "sleep",
            "play",
            "eat",
            "sing"
          ]
        },
        "answerKey": {
          "did-question": {
            "baseQ": {
              "__cond": "pastQ",
              "stayed": "stay",
              "cooked": "cook",
              "studied": "study",
              "worked": "work",
              "slept": "sleep",
              "played": "play",
              "ate": "eat",
              "sang": "sing"
            }
          },
          "did-short-answer": {
            "pastQ": {
              "__cond": "baseQ",
              "stay": "stayed",
              "cook": "cooked",
              "study": "studied",
              "work": "worked",
              "sleep": "slept",
              "play": "played",
              "eat": "ate",
              "sing": "sang"
            }
          }
        },
        "distractors": [
          "I stayed at home yesterday. Did you stayed at home yesterday?",
          "I played at home yesterday. Did you played at home yesterday?",
          "I ate at home yesterday. Did you ate at home yesterday?",
          "Did you cook at home last night? Yes, I cook at home last night.",
          "Did you sing at home last night? Yes, I singed at home last night.",
          "Did you study at home last night? Yes, I studyed at home last night."
        ],
        "irregulars": {}
      },
      "teach_vi": "Muốn hỏi về một việc trong quá khứ, em đặt \"Did\" lên đầu: Did you play football yesterday? Điều quan trọng nhất: \"did\" đã mang nghĩa quá khứ rồi, nên động từ chính TRỞ LẠI NGUYÊN MẪU — Did you play? (không phải \"Did you played?\"), Did you eat? (không phải \"Did you ate?\"). Trả lời ngắn: Yes, I did. / No, I did not (didn't). Nếu trả lời dài, câu không còn \"did\" nữa nên động từ phải quay lại dạng quá khứ: Yes, I played football yesterday. \"Did\" dùng cho mọi chủ ngữ: Did I…? Did he…? Did they…? — không bao giờ có \"Dids\"."
    },
    {
      "id": "was-were",
      "title_vi": "\"Was\" và \"were\": quá khứ của to be",
      "explain_vi": "\"Was\" và \"were\" là dạng quá khứ của \"to be\": I / he / she / it và MỘT người → was; you / we / they và NHIỀU người → were. Phủ định thêm \"not\" ngay sau.",
      "examples": [
        "I was at school yesterday.",
        "My parents were at school yesterday.",
        "She was not at home last night."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose",
        "order_words",
        "transform"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "was-were-school",
            "text": "{subj} {bw} at school yesterday.",
            "blanks": [
              "bw"
            ],
            "context_vi": "Nhìn chủ ngữ để chọn \"was\" hay \"were\".",
            "audioText": "My sister was at school yesterday."
          },
          {
            "id": "was-were-not-home",
            "text": "{subj} {bw} not at home last night.",
            "blanks": [
              "bw"
            ],
            "context_vi": "Câu phủ định: \"not\" đứng ngay sau was/were, chủ ngữ vẫn quyết định chọn was hay were.",
            "audioText": "They were not at home last night."
          }
        ],
        "slots": {
          "subj": [
            "I",
            "He",
            "She",
            "You",
            "We",
            "They",
            "My brother",
            "My sister",
            "My parents",
            "The children"
          ],
          "bw": [
            "was",
            "were"
          ]
        },
        "answerKey": {
          "was-were-school": {
            "bw": {
              "__cond": "subj",
              "I": "was",
              "He": "was",
              "She": "was",
              "You": "were",
              "We": "were",
              "They": "were",
              "My brother": "was",
              "My sister": "was",
              "My parents": "were",
              "The children": "were"
            }
          },
          "was-were-not-home": {
            "bw": {
              "__cond": "subj",
              "I": "was",
              "He": "was",
              "She": "was",
              "You": "were",
              "We": "were",
              "They": "were",
              "My brother": "was",
              "My sister": "was",
              "My parents": "were",
              "The children": "were"
            }
          },
          "answer-pairs": {
            "I was at school yesterday.": "I was not at school yesterday.",
            "He was at school yesterday.": "He was not at school yesterday.",
            "She was at school yesterday.": "She was not at school yesterday.",
            "You were at school yesterday.": "You were not at school yesterday.",
            "We were at school yesterday.": "We were not at school yesterday.",
            "They were at school yesterday.": "They were not at school yesterday.",
            "My brother was at school yesterday.": "My brother was not at school yesterday.",
            "My parents were at school yesterday.": "My parents were not at school yesterday."
          },
          "transform-explain": {
            "I was at school yesterday.": "Câu có \"was\" thì phủ định chỉ cần thêm \"not\" ngay sau: was → was not (wasn't).",
            "He was at school yesterday.": "Câu có \"was\" thì phủ định chỉ cần thêm \"not\" ngay sau: was → was not (wasn't).",
            "She was at school yesterday.": "Câu có \"was\" thì phủ định chỉ cần thêm \"not\" ngay sau: was → was not (wasn't).",
            "You were at school yesterday.": "Câu có \"were\" thì phủ định chỉ cần thêm \"not\" ngay sau: were → were not (weren't).",
            "We were at school yesterday.": "Câu có \"were\" thì phủ định chỉ cần thêm \"not\" ngay sau: were → were not (weren't).",
            "They were at school yesterday.": "Câu có \"were\" thì phủ định chỉ cần thêm \"not\" ngay sau: were → were not (weren't).",
            "My brother was at school yesterday.": "\"My brother\" là MỘT người nên dùng \"was\"; phủ định là \"was not\".",
            "My parents were at school yesterday.": "\"My parents\" là NHIỀU người nên dùng \"were\"; phủ định là \"were not\"."
          }
        },
        "distractors": [
          "They was at school yesterday.",
          "I were at school yesterday.",
          "My brother were at school yesterday.",
          "The children was at school yesterday.",
          "She were not at home last night.",
          "We was not at home last night.",
          "My parents was not at home last night.",
          "I were not at home last night."
        ],
        "irregulars": {}
      },
      "teach_vi": "\"To be\" ở quá khứ chỉ có hai dạng, dễ hơn hiện tại nhiều: \"was\" và \"were\". Dùng \"was\" với I, he, she, it và với MỘT người hay một vật (my brother was, the cat was). Dùng \"were\" với you, we, they và với NHIỀU người hay nhiều vật (my parents were, the children were). Câu phủ định chỉ cần thêm \"not\" ngay sau: I was not (wasn't) tired, they were not (weren't) at home. Câu hỏi thì đảo lên trước: Were you at school yesterday? — Yes, I was. / No, I wasn't. Lỗi hay gặp: \"They was…\" và \"I were…\" — nhớ was đi với MỘT, were đi với NHIỀU (và với you)."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "last-sunday",
      "title": "Last Sunday",
      "title_vi": "Chủ nhật tuần trước",
      "text": "Last Sunday my family went to the market. My mother bought some bread and a big fish. I saw a small dog near the gate, so I played with it for ten minutes. Then we walked home together. My father cooked lunch and we ate noodles. In the evening I studied English for one hour. I did not watch TV, but I was very happy.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Mẹ của bạn ấy đã mua bánh mì, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "My mother bought some bread."
        },
        {
          "id": "q2",
          "q_vi": "Buổi tối bạn ấy đã làm gì?",
          "type": "mcq",
          "choices": [
            "studied English",
            "watched TV",
            "cooked lunch"
          ],
          "answer": 0,
          "audioText": "What did the child do in the evening?"
        }
      ]
    }
  ]
};
  C["grammar3/unit11.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 411,
  "lesson": 11,
  "topic": "Present Perfect",
  "topic_vi": "Hiện tại hoàn thành",
  "vocab": [
    {
      "word": "already",
      "vi": "đã ... rồi",
      "icon": "✔️",
      "example": "I have already eaten lunch.",
      "partOfSpeech": "adv",
      "audio": ""
    },
    {
      "word": "yet",
      "vi": "chưa (trong câu phủ định, câu hỏi)",
      "icon": "❓",
      "example": "I have not eaten lunch yet.",
      "partOfSpeech": "adv",
      "audio": ""
    },
    {
      "word": "just",
      "vi": "vừa mới",
      "icon": "⏱️",
      "example": "She has just come home.",
      "partOfSpeech": "adv",
      "audio": ""
    },
    {
      "word": "ever",
      "vi": "từng, bao giờ",
      "icon": "🌍",
      "example": "Have you ever eaten sushi?",
      "partOfSpeech": "adv",
      "audio": ""
    },
    {
      "word": "never",
      "vi": "chưa bao giờ",
      "icon": "🚫",
      "example": "I have never been to Sa Pa.",
      "partOfSpeech": "adv",
      "audio": ""
    },
    {
      "word": "finish",
      "vi": "làm xong, hoàn thành",
      "icon": "🏁",
      "example": "He has finished his homework.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "homework",
      "vi": "bài tập về nhà",
      "icon": "📝",
      "example": "My homework is easy today.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "lose",
      "vi": "mất, làm mất",
      "icon": "🔑",
      "example": "I have lost my key.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "sushi",
      "vi": "món sushi",
      "icon": "🍣",
      "example": "Have you ever eaten sushi?",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "pizza",
      "vi": "bánh pizza",
      "icon": "🍕",
      "example": "I have never eaten pizza.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "clean",
      "vi": "dọn dẹp",
      "icon": "🧹",
      "example": "Lan has just cleaned her room.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "milk",
      "vi": "sữa",
      "icon": "🥛",
      "example": "I have already bought some milk.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "breakfast",
      "vi": "bữa sáng",
      "icon": "🥣",
      "example": "Nam has not eaten breakfast yet.",
      "partOfSpeech": "noun",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "have-has-v3",
      "title_vi": "\"Have / has\" + động từ dạng thứ ba (V3)",
      "explain_vi": "Nói việc đã xong mà còn liên quan tới bây giờ: I / you / we / they + have + V3; he / she / it và MỘT người + has + V3. Động từ luôn ở dạng thứ ba (V3).",
      "examples": [
        "I have finished the homework.",
        "My sister has finished the homework.",
        "I want to eat it, but I have already eaten it."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "transform"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "hh-finished",
            "text": "{subj} {hh} finished the homework.",
            "blanks": [
              "hh"
            ],
            "context_vi": "Nhìn chủ ngữ để chọn \"have\" hay \"has\".",
            "audioText": "My sister has finished the homework."
          },
          {
            "id": "hh-v3-already",
            "text": "I want to {base} it, but I have already {v3} it.",
            "blanks": [
              "v3"
            ],
            "context_vi": "Động từ nguyên mẫu sau \"want to\" là manh mối — hãy đổi nó sang dạng thứ ba (V3).",
            "audioText": "I want to eat it, but I have already eaten it."
          }
        ],
        "slots": {
          "subj": [
            "I",
            "You",
            "We",
            "They",
            "He",
            "She",
            "My brother",
            "My sister",
            "My parents",
            "The children"
          ],
          "hh": [
            "have",
            "has"
          ],
          "base": [
            "eat",
            "see",
            "do",
            "write",
            "take",
            "make",
            "buy",
            "finish",
            "clean",
            "read"
          ],
          "v3": [
            "eaten",
            "seen",
            "done",
            "written",
            "taken",
            "made",
            "bought",
            "finished",
            "cleaned",
            "read"
          ]
        },
        "answerKey": {
          "hh-finished": {
            "hh": {
              "__cond": "subj",
              "I": "have",
              "You": "have",
              "We": "have",
              "They": "have",
              "He": "has",
              "She": "has",
              "My brother": "has",
              "My sister": "has",
              "My parents": "have",
              "The children": "have"
            }
          },
          "hh-v3-already": {
            "v3": {
              "__cond": "base",
              "eat": "eaten",
              "see": "seen",
              "do": "done",
              "write": "written",
              "take": "taken",
              "make": "made",
              "buy": "bought",
              "finish": "finished",
              "clean": "cleaned",
              "read": "read"
            }
          },
          "answer-pairs": {
            "I have finished the homework.": "I have not finished the homework.",
            "You have finished the homework.": "You have not finished the homework.",
            "We have finished the homework.": "We have not finished the homework.",
            "They have finished the homework.": "They have not finished the homework.",
            "He has finished the homework.": "He has not finished the homework.",
            "She has finished the homework.": "She has not finished the homework.",
            "My brother has finished the homework.": "My brother has not finished the homework.",
            "My parents have finished the homework.": "My parents have not finished the homework."
          },
          "transform-explain": {
            "I have finished the homework.": "Phủ định chỉ cần thêm \"not\" ngay sau \"have\": have finished → have not (haven't) finished.",
            "You have finished the homework.": "Phủ định chỉ cần thêm \"not\" ngay sau \"have\": have finished → have not (haven't) finished.",
            "We have finished the homework.": "Phủ định chỉ cần thêm \"not\" ngay sau \"have\": have finished → have not (haven't) finished.",
            "They have finished the homework.": "Phủ định chỉ cần thêm \"not\" ngay sau \"have\": have finished → have not (haven't) finished.",
            "He has finished the homework.": "Phủ định chỉ cần thêm \"not\" ngay sau \"has\": has finished → has not (hasn't) finished.",
            "She has finished the homework.": "Phủ định chỉ cần thêm \"not\" ngay sau \"has\": has finished → has not (hasn't) finished.",
            "My brother has finished the homework.": "\"My brother\" là MỘT người nên dùng \"has\"; phủ định là \"has not finished\".",
            "My parents have finished the homework.": "\"My parents\" là NHIỀU người nên dùng \"have\"; phủ định là \"have not finished\"."
          }
        },
        "distractors": [
          "She have finished the homework.",
          "My brother have finished the homework.",
          "They has finished the homework.",
          "I has finished the homework.",
          "I want to eat it, but I have already ate it.",
          "I want to write it, but I have already wrote it.",
          "I want to see it, but I have already saw it.",
          "I want to do it, but I have already did it."
        ],
        "irregulars": {
          "eat": "eaten",
          "see": "seen",
          "do": "done",
          "write": "written",
          "take": "taken",
          "make": "made",
          "buy": "bought",
          "read": "read",
          "go": "gone",
          "be": "been",
          "lose": "lost",
          "come": "come"
        }
      },
      "teach_vi": "Thì hiện tại hoàn thành nối QUÁ KHỨ với BÂY GIỜ: việc đã xong nhưng kết quả vẫn còn đến lúc này. Công thức: have / has + V3. Dùng \"have\" với I, you, we, they và nhiều người; dùng \"has\" với he, she, it và MỘT người: I have finished, my sister has finished. V3 (dạng thứ ba) của động từ có quy tắc giống dạng quá khứ, chỉ thêm \"-ed\": finish → finished, clean → cleaned. Nhưng nhiều động từ bất quy tắc có V3 riêng, phải học thuộc: eat → eaten, see → seen, do → done, write → written, take → taken, go → gone, be → been, lose → lost. Phủ định thêm \"not\" ngay sau have/has: I have not (haven't) finished, she has not (hasn't) finished. Lỗi hay gặp của người Việt: \"She have finished\" và \"I have saw it\" — nhớ has đi với MỘT người, và sau have/has luôn là V3."
    },
    {
      "id": "ever-never",
      "title_vi": "\"Ever\" và \"never\": kinh nghiệm đã từng / chưa từng",
      "explain_vi": "Hỏi ai đã từng làm gì chưa: Have you EVER…? Trả lời rằng chưa bao giờ: I have NEVER… \"Never\" đã mang nghĩa phủ định nên không cần thêm \"not\".",
      "examples": [
        "Have you ever eaten pizza? No, I have never eaten pizza.",
        "Have you ever eaten sushi? No, I have never eaten sushi.",
        "I have never been to Sa Pa, but I want to go there one day."
      ],
      "generators": [
        "fill_blank",
        "mcq"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "ever-question",
            "text": "Have you {ev} eaten {food}? No, I have {nev} eaten {food}.",
            "blanks": [
              "ev",
              "nev"
            ],
            "context_vi": "Trong CÂU HỎI dùng \"ever\"; trong câu trả lời \"No, I have …\" dùng \"never\".",
            "audioText": "Have you ever eaten pizza? No, I have never eaten pizza."
          },
          {
            "id": "never-been",
            "text": "I have {nev} been to {place}, but I want to go there one day.",
            "blanks": [
              "nev"
            ],
            "context_vi": "\"Nhưng tôi muốn đi\" cho biết người nói CHƯA BAO GIỜ đến đó.",
            "audioText": "I have never been to Sa Pa, but I want to go there one day."
          }
        ],
        "slots": {
          "ev": [
            "ever",
            "never"
          ],
          "nev": [
            "ever",
            "never"
          ],
          "food": [
            "sushi",
            "pizza",
            "noodles",
            "cheese",
            "corn",
            "fish"
          ],
          "place": [
            "Ha Noi",
            "Hue",
            "Da Nang",
            "Sa Pa",
            "Can Tho",
            "Nha Trang"
          ]
        },
        "answerKey": {
          "ever-question": {
            "ev": "ever",
            "nev": "never"
          },
          "never-been": {
            "nev": "never"
          }
        },
        "distractors": [
          "Have you ever eat pizza? No, I have never eaten pizza.",
          "Have you ever eaten sushi? No, I have ever eaten sushi.",
          "Have you never eaten noodles? No, I have ever eaten noodles.",
          "I have ever been to Ha Noi, but I want to go there one day.",
          "I have never went to Hue, but I want to go there one day.",
          "Have you ever ate cheese? No, I have never ate cheese.",
          "I have not never been to Da Nang, but I want to go there one day.",
          "I have never be to Nha Trang, but I want to go there one day."
        ],
        "irregulars": {}
      },
      "teach_vi": "Khi muốn hỏi bạn mình đã TỪNG làm việc gì đó trong đời chưa, em dùng \"ever\" và đặt nó giữa chủ ngữ với V3: Have you ever eaten sushi? Have you ever been to Ha Noi? Khi trả lời rằng CHƯA BAO GIỜ, em dùng \"never\" ở đúng chỗ đó: I have never eaten sushi. I have never been to Ha Noi. Điều quan trọng: \"never\" đã mang nghĩa phủ định sẵn, nên KHÔNG viết \"I have not never…\" và cũng không viết \"I have never not…\". Còn \"ever\" thì hầu như chỉ xuất hiện trong câu hỏi — đừng dùng \"ever\" trong câu kể. Nếu đã từng làm rồi thì trả lời: Yes, I have. / Yes, I have eaten sushi once."
    },
    {
      "id": "just-already-yet",
      "title_vi": "\"Just\" · \"already\" · \"yet\"",
      "explain_vi": "\"Just\" = vừa mới xong; \"already\" = đã xong rồi (câu khẳng định); \"yet\" = chưa, chỉ dùng trong câu phủ định hoặc câu hỏi và đứng ở CUỐI câu.",
      "examples": [
        "I have not eaten breakfast yet.",
        "Have you cleaned your room yet?",
        "Nam finished his lunch a minute ago. He has just finished it.",
        "You do not need to buy milk. I have already bought it."
      ],
      "generators": [
        "fill_blank",
        "mcq"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "yet-not",
            "text": "I have not {myThing} {jay}.",
            "blanks": [
              "jay"
            ],
            "context_vi": "Câu PHỦ ĐỊNH (\"have not\") — chọn \"just\", \"already\" hay \"yet\"?",
            "audioText": "I have not eaten breakfast yet."
          },
          {
            "id": "yet-question",
            "text": "Have you {yourThing} {jay}?",
            "blanks": [
              "jay"
            ],
            "context_vi": "Đây là câu HỎI — chọn \"just\", \"already\" hay \"yet\"?",
            "audioText": "Have you cleaned your room yet?"
          },
          {
            "id": "just-minute",
            "text": "Nam finished his lunch a minute ago. He has {jay} finished it.",
            "blanks": [
              "jay"
            ],
            "context_vi": "\"A minute ago\" nghĩa là mới cách đây một phút — chọn \"just\", \"already\" hay \"yet\"?",
            "audioText": "Nam finished his lunch a minute ago. He has just finished it."
          },
          {
            "id": "just-bus",
            "text": "The bus arrived a minute ago. It has {jay} arrived.",
            "blanks": [
              "jay"
            ],
            "context_vi": "Việc vừa xảy ra cách đây một phút — chọn \"just\", \"already\" hay \"yet\"?",
            "audioText": "The bus arrived a minute ago. It has just arrived."
          },
          {
            "id": "already-no-need",
            "text": "You do not need to buy milk. I have {jay} bought it.",
            "blanks": [
              "jay"
            ],
            "context_vi": "\"Không cần mua nữa\" vì việc ĐÃ XONG RỒI — chọn \"just\", \"already\" hay \"yet\"?",
            "audioText": "You do not need to buy milk. I have already bought it."
          },
          {
            "id": "already-news",
            "text": "You do not need to tell me the news. I have {jay} heard it.",
            "blanks": [
              "jay"
            ],
            "context_vi": "\"Không cần kể nữa\" vì tôi ĐÃ nghe RỒI — chọn \"just\", \"already\" hay \"yet\"?",
            "audioText": "You do not need to tell me the news. I have already heard it."
          }
        ],
        "slots": {
          "jay": [
            "just",
            "already",
            "yet"
          ],
          "myThing": [
            "eaten breakfast",
            "done my homework",
            "cleaned my room",
            "washed my hands",
            "read the book",
            "found my key"
          ],
          "yourThing": [
            "cleaned your room",
            "done your homework",
            "eaten your lunch",
            "washed your hands",
            "read the book",
            "found your key"
          ]
        },
        "answerKey": {
          "yet-not": {
            "jay": "yet"
          },
          "yet-question": {
            "jay": "yet"
          },
          "just-minute": {
            "jay": "just"
          },
          "just-bus": {
            "jay": "just"
          },
          "already-no-need": {
            "jay": "already"
          },
          "already-news": {
            "jay": "already"
          }
        },
        "distractors": [
          "I have not eaten breakfast already.",
          "I have not done my homework just.",
          "Have you cleaned your room just?",
          "Have you already washed your hands yet?",
          "Nam finished his lunch a minute ago. He has yet finished it.",
          "Nam finished his lunch a minute ago. He has just finish it.",
          "The bus arrived a minute ago. It has yet arrived.",
          "You do not need to buy milk. I have yet bought it.",
          "You do not need to buy milk. I have already buy it.",
          "You do not need to tell me the news. I have heard it yet."
        ],
        "irregulars": {}
      },
      "teach_vi": "Ba từ này đi cùng have/has + V3 và mỗi từ có một chỗ đứng riêng. \"Just\" = vừa mới, việc xong cách đây rất ít phút; nó đứng GIỮA have/has và V3: She has just come home. \"Already\" = đã ... rồi, dùng trong câu khẳng định, cũng đứng giữa have/has và V3: I have already bought the milk. \"Yet\" = chưa, chỉ dùng trong câu PHỦ ĐỊNH và câu HỎI, và luôn đứng ở CUỐI câu: I have not finished my homework yet. Have you finished your homework yet? Nhớ hai điều: đừng dùng \"yet\" trong câu khẳng định, và đừng đặt \"already\" hay \"just\" ở cuối câu. Sau have/has luôn là V3, không phải nguyên mẫu."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "sunday-morning",
      "title": "Sunday morning",
      "title_vi": "Sáng chủ nhật",
      "text": "It is nine o'clock on Sunday. Lan has already cleaned her room and she has just finished her breakfast. Her brother Nam has not got up yet. Their mother is not happy. \"Nam, have you ever tidied your room?\" she asks. Nam smiles. He has never tidied it, but today he wants to try.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Lan đã dọn phòng xong rồi, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "Lan has already cleaned her room."
        },
        {
          "id": "q2",
          "q_vi": "Nam đã ngủ dậy chưa?",
          "type": "mcq",
          "choices": [
            "He has not got up yet.",
            "He has already got up.",
            "He has just got up."
          ],
          "answer": 0,
          "audioText": "Has Nam got up yet?"
        }
      ]
    }
  ]
};
  C["grammar3/unit12.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 412,
  "lesson": 12,
  "topic": "Past Continuous",
  "topic_vi": "Quá khứ tiếp diễn",
  "vocab": [
    {
      "word": "while",
      "vi": "trong khi",
      "icon": "⏳",
      "example": "While I was reading, the phone rang.",
      "partOfSpeech": "conjunction",
      "audio": ""
    },
    {
      "word": "when",
      "vi": "khi, lúc",
      "icon": "🔔",
      "example": "When the bell rang, we were playing.",
      "partOfSpeech": "conjunction",
      "audio": ""
    },
    {
      "word": "ring",
      "vi": "reo, rung",
      "icon": "📞",
      "example": "The phone rang at seven o'clock.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "watch",
      "vi": "xem",
      "icon": "📺",
      "example": "I was watching TV last night.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "sleep",
      "vi": "ngủ",
      "icon": "😴",
      "example": "She was not sleeping at nine o'clock.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "run",
      "vi": "chạy",
      "icon": "🏃",
      "example": "The children were running in the yard.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "swim",
      "vi": "bơi",
      "icon": "🏊",
      "example": "We were swimming in the river.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "read",
      "vi": "đọc",
      "icon": "📖",
      "example": "I was reading in my room.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "dinner",
      "vi": "bữa tối",
      "icon": "🍽️",
      "example": "Lan ate her dinner in ten minutes.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "homework",
      "vi": "bài tập về nhà",
      "icon": "📝",
      "example": "I was doing my homework at eight.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "yard",
      "vi": "cái sân",
      "icon": "🏫",
      "example": "We were playing in the yard.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "suddenly",
      "vi": "bỗng nhiên",
      "icon": "⚡",
      "example": "Suddenly the lights went out.",
      "partOfSpeech": "adv",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "was-were-ving",
      "title_vi": "\"Was / were\" + V-ing",
      "explain_vi": "Kể việc đang diễn ra tại một lúc trong quá khứ: was / were + V-ing. Dùng \"was\" với I, he, she, it và MỘT người; dùng \"were\" với you, we, they và NHIỀU người.",
      "examples": [
        "My brother was watching TV at seven o'clock last night.",
        "My parents were watching TV at seven o'clock last night.",
        "I like to swim, and yesterday at five I was swimming."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "cont-tv",
            "text": "{subj} {bw} watching TV at seven o'clock last night.",
            "blanks": [
              "bw"
            ],
            "context_vi": "Nhìn chủ ngữ để chọn \"was\" hay \"were\".",
            "audioText": "My brother was watching TV at seven o'clock last night."
          },
          {
            "id": "cont-not-sleeping",
            "text": "{subj} {bw} not sleeping at nine o'clock last night.",
            "blanks": [
              "bw"
            ],
            "context_vi": "Câu phủ định: \"not\" đứng giữa was/were và V-ing.",
            "audioText": "They were not sleeping at nine o'clock last night."
          },
          {
            "id": "ing-spelling",
            "text": "I like to {base}, and yesterday at five I was {ving}.",
            "blanks": [
              "ving"
            ],
            "context_vi": "Động từ nguyên mẫu sau \"like to\" là manh mối — hãy thêm \"-ing\" cho đúng quy tắc.",
            "audioText": "I like to swim, and yesterday at five I was swimming."
          }
        ],
        "slots": {
          "subj": [
            "I",
            "He",
            "She",
            "You",
            "We",
            "They",
            "My brother",
            "My sister",
            "My parents",
            "The children"
          ],
          "bw": [
            "was",
            "were"
          ],
          "base": [
            "run",
            "swim",
            "jog",
            "write",
            "ride",
            "dance",
            "play",
            "study",
            "read",
            "cook"
          ],
          "ving": [
            "running",
            "swimming",
            "jogging",
            "writing",
            "riding",
            "dancing",
            "playing",
            "studying",
            "reading",
            "cooking"
          ]
        },
        "answerKey": {
          "cont-tv": {
            "bw": {
              "__cond": "subj",
              "I": "was",
              "He": "was",
              "She": "was",
              "You": "were",
              "We": "were",
              "They": "were",
              "My brother": "was",
              "My sister": "was",
              "My parents": "were",
              "The children": "were"
            }
          },
          "cont-not-sleeping": {
            "bw": {
              "__cond": "subj",
              "I": "was",
              "He": "was",
              "She": "was",
              "You": "were",
              "We": "were",
              "They": "were",
              "My brother": "was",
              "My sister": "was",
              "My parents": "were",
              "The children": "were"
            }
          },
          "ing-spelling": {
            "ving": {
              "__cond": "base",
              "run": "running",
              "swim": "swimming",
              "jog": "jogging",
              "write": "writing",
              "ride": "riding",
              "dance": "dancing",
              "play": "playing",
              "study": "studying",
              "read": "reading",
              "cook": "cooking"
            }
          }
        },
        "distractors": [
          "They was watching TV at seven o'clock last night.",
          "I were watching TV at seven o'clock last night.",
          "My brother were watching TV at seven o'clock last night.",
          "The children was watching TV at seven o'clock last night.",
          "She were not sleeping at nine o'clock last night.",
          "We was not sleeping at nine o'clock last night.",
          "I like to run, and yesterday at five I was runing.",
          "I like to swim, and yesterday at five I was swiming.",
          "I like to write, and yesterday at five I was writeing.",
          "I like to dance, and yesterday at five I was danceing."
        ],
        "irregulars": {}
      },
      "teach_vi": "Quá khứ tiếp diễn kể một việc ĐANG diễn ra tại một thời điểm trong quá khứ. Công thức: was / were + V-ing. Chọn was hay were giống hệt như đã học ở bài Quá khứ đơn: \"was\" đi với I, he, she, it và MỘT người (my brother was playing); \"were\" đi với you, we, they và NHIỀU người (my parents were playing). Câu phủ định đặt \"not\" ở giữa: I was not (wasn't) sleeping, they were not (weren't) sleeping. Cách thêm \"-ing\": thường chỉ thêm \"-ing\" (play → playing, study → studying); nếu từ kết thúc bằng \"e\" thì bỏ \"e\" rồi thêm \"-ing\" (write → writing, ride → riding, dance → dancing); nếu từ ngắn có nguyên âm ngắn + một phụ âm cuối thì gấp đôi phụ âm (run → running, swim → swimming, jog → jogging). Dấu hiệu thường gặp: at seven o'clock last night, at that moment, all morning yesterday."
    },
    {
      "id": "when-while",
      "title_vi": "\"When\" và \"while\": nối hai việc trong quá khứ",
      "explain_vi": "\"While\" đi với việc DÀI đang diễn ra (was/were + V-ing); \"when\" đi với việc NGẮN xảy ra và cắt ngang (quá khứ đơn). Hãy xem động từ ngay sau nó để chọn.",
      "examples": [
        "While I was reading in my room, the phone rang.",
        "When the phone rang, I was reading in my room.",
        "While I was studying in my room, the phone rang."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "while-long",
            "text": "{ww} I was {ving} in my room, the phone rang.",
            "blanks": [
              "ww"
            ],
            "context_vi": "Ngay sau chỗ trống là việc DÀI (was + V-ing) — chọn \"When\" hay \"While\"?",
            "audioText": "While I was reading in my room, the phone rang."
          },
          {
            "id": "when-short",
            "text": "{ww} the phone rang, I was {ving} in my room.",
            "blanks": [
              "ww"
            ],
            "context_vi": "Ngay sau chỗ trống là việc NGẮN ở quá khứ đơn — chọn \"When\" hay \"While\"?",
            "audioText": "When the phone rang, I was reading in my room."
          }
        ],
        "slots": {
          "ww": [
            "When",
            "While"
          ],
          "ving": [
            "reading",
            "writing",
            "studying",
            "drawing",
            "singing",
            "sleeping"
          ]
        },
        "answerKey": {
          "while-long": {
            "ww": "While"
          },
          "when-short": {
            "ww": "When"
          }
        },
        "distractors": [
          "While I was read in my room, the phone rang.",
          "While I reading in my room, the phone rang.",
          "While I was studying in my room, the phone ringed.",
          "When the phone rang, I was read in my room.",
          "When the phone rang, I were reading in my room.",
          "When the phone ringed, I was writing in my room."
        ],
        "irregulars": {}
      },
      "teach_vi": "Trong một câu kể quá khứ thường có hai việc: một việc DÀI đang diễn ra và một việc NGẮN xảy ra chen vào. Việc DÀI dùng quá khứ tiếp diễn (was / were + V-ing) và đi với \"while\"; việc NGẮN dùng quá khứ đơn và đi với \"when\". Ví dụ: While I was reading, the phone rang. — hoặc đảo lại: When the phone rang, I was reading. Hai câu này nghĩa giống nhau, chỉ khác thứ tự. Mẹo làm bài: em nhìn động từ đứng NGAY SAU chỗ trống. Nếu đó là \"was / were + V-ing\" thì điền \"While\"; nếu đó là một động từ quá khứ đơn ngắn (rang, came, went) thì điền \"When\". Khi mệnh đề phụ đứng trước thì có dấu phẩy ở giữa hai mệnh đề."
    },
    {
      "id": "past-simple-vs-continuous",
      "title_vi": "Quá khứ đơn hay quá khứ tiếp diễn?",
      "explain_vi": "Việc đang diễn ra, bị cắt ngang hoặc đi sau \"while\" → quá khứ tiếp diễn. Việc xảy ra một cái rồi xong, hoặc làm hết trong khoảng thời gian → quá khứ đơn.",
      "examples": [
        "While I was doing my homework, my mother came in.",
        "I was watching TV when the phone rang.",
        "Yesterday Lan ate her dinner in ten minutes."
      ],
      "generators": [
        "fill_blank",
        "mcq"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "while-doing",
            "text": "While I {formDo} my homework, {who} came in.",
            "blanks": [
              "formDo"
            ],
            "context_vi": "Sau \"While\" là việc DÀI đang diễn ra, nên dùng quá khứ tiếp diễn.",
            "audioText": "While I was doing my homework, my mother came in."
          },
          {
            "id": "while-cooking",
            "text": "While my mother {formCook} dinner, I set the table.",
            "blanks": [
              "formCook"
            ],
            "context_vi": "Sau \"While\" là việc DÀI (nấu bữa tối), nên dùng quá khứ tiếp diễn.",
            "audioText": "While my mother was cooking dinner, I set the table."
          },
          {
            "id": "when-rang",
            "text": "I was {actVing} when the phone {formRing}.",
            "blanks": [
              "formRing"
            ],
            "context_vi": "Điện thoại reo là việc NGẮN cắt ngang việc đang làm, nên dùng quá khứ đơn.",
            "audioText": "I was watching TV when the phone rang."
          },
          {
            "id": "when-came",
            "text": "We were playing in the yard when the teacher {formCome}.",
            "blanks": [
              "formCome"
            ],
            "context_vi": "Cô giáo đến là việc NGẮN cắt ngang việc đang chơi, nên dùng quá khứ đơn.",
            "audioText": "We were playing in the yard when the teacher came."
          },
          {
            "id": "in-ten-minutes",
            "text": "Yesterday Lan {formEat} her {meal} in ten minutes.",
            "blanks": [
              "formEat"
            ],
            "context_vi": "\"In ten minutes\" cho biết việc đã LÀM XONG trong mười phút, nên dùng quá khứ đơn.",
            "audioText": "Yesterday Lan ate her dinner in ten minutes."
          }
        ],
        "slots": {
          "formDo": [
            "was doing",
            "did"
          ],
          "formCook": [
            "was cooking",
            "cooked"
          ],
          "formRing": [
            "rang",
            "was ringing"
          ],
          "formCome": [
            "came",
            "was coming"
          ],
          "formEat": [
            "ate",
            "was eating"
          ],
          "who": [
            "my mother",
            "my father",
            "my sister",
            "my brother",
            "my teacher"
          ],
          "actVing": [
            "watching TV",
            "reading a book",
            "doing my homework",
            "eating dinner",
            "drawing a picture"
          ],
          "meal": [
            "dinner",
            "lunch",
            "breakfast",
            "soup",
            "noodles"
          ]
        },
        "answerKey": {
          "while-doing": {
            "formDo": "was doing"
          },
          "while-cooking": {
            "formCook": "was cooking"
          },
          "when-rang": {
            "formRing": "rang"
          },
          "when-came": {
            "formCome": "came"
          },
          "in-ten-minutes": {
            "formEat": "ate"
          }
        },
        "distractors": [
          "While I did my homework, my mother came in.",
          "While I was do my homework, my mother came in.",
          "While my mother cooked dinner, I set the table.",
          "While my mother was cook dinner, I set the table.",
          "I was watching TV when the phone was ringing.",
          "I was reading a book when the phone was ringing.",
          "We were playing in the yard when the teacher was coming.",
          "We were playing in the yard when the teacher comed.",
          "Yesterday Lan was eating her dinner in ten minutes.",
          "Yesterday Lan was ate her soup in ten minutes."
        ],
        "irregulars": {}
      },
      "teach_vi": "Hai thì này hay đi cùng nhau trong một câu, nên em cần biết chọn thì nào. Dùng QUÁ KHỨ TIẾP DIỄN (was/were + V-ing) khi việc đó KÉO DÀI, đang giữa dòng, thường bị việc khác cắt ngang, hoặc đứng sau \"while\": While I was doing my homework, my mother came in. Dùng QUÁ KHỨ ĐƠN khi việc xảy ra MỘT CÁI rồi xong ngay, khi nó cắt ngang việc dài (thường đi với \"when\"), hoặc khi việc được làm hết trong một khoảng thời gian: The phone rang. / Lan ate her dinner in ten minutes. Mẹo nhớ: việc dài là \"cái nền\", việc ngắn là \"cái chen vào\". Cụm \"in ten minutes\" (làm xong trong mười phút) luôn đi với quá khứ đơn, còn \"at eight o'clock last night\" (đúng lúc đó đang làm) thì đi với quá khứ tiếp diễn."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "a-rainy-afternoon",
      "title": "A rainy afternoon",
      "title_vi": "Một buổi chiều mưa",
      "text": "Yesterday afternoon it was raining. My sister was reading a book in her room and I was doing my homework at my desk. My mother was cooking in the kitchen. Suddenly the lights went out! While we were looking for a candle, my father came home. He was laughing, because he was very wet.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Lúc đó chị/em gái đang đọc sách, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "My sister was reading a book."
        },
        {
          "id": "q2",
          "q_vi": "Bố về nhà lúc mọi người đang làm gì?",
          "type": "mcq",
          "choices": [
            "looking for a candle",
            "watching TV",
            "eating dinner"
          ],
          "answer": 0,
          "audioText": "What were they doing when father came home?"
        }
      ]
    }
  ]
};
  C["grammar3/unit13.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 413,
  "lesson": 13,
  "topic": "The future: be going to, will",
  "topic_vi": "Tương lai: be going to · will",
  "vocab": [
    {
      "word": "kite",
      "vi": "cái diều",
      "icon": "🪁",
      "example": "I will bring a big kite to the field tomorrow.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "field",
      "vi": "cánh đồng, sân bãi",
      "icon": "🌾",
      "example": "We will play football in the field.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "poster",
      "vi": "tấm áp phích",
      "icon": "🖼️",
      "example": "Our class is going to paint a poster.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "guitar",
      "vi": "đàn ghi-ta",
      "icon": "🎸",
      "example": "My cousin is going to learn the guitar.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "museum",
      "vi": "viện bảo tàng",
      "icon": "🏛️",
      "example": "We are going to visit the science museum.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "ticket",
      "vi": "vé",
      "icon": "🎫",
      "example": "I bought the tickets last week.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "club",
      "vi": "câu lạc bộ",
      "icon": "♟️",
      "example": "Our class is going to join the chess club.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "heavy",
      "vi": "nặng",
      "icon": "🏋️",
      "example": "That bag is very heavy.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "decide",
      "vi": "quyết định",
      "icon": "🤔",
      "example": "First we decide, then we make a plan.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "bake",
      "vi": "nướng bánh",
      "icon": "🍰",
      "example": "We are going to bake a cake.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "plant",
      "vi": "trồng cây",
      "icon": "🌱",
      "example": "They are going to plant a tree.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "pack",
      "vi": "xếp đồ vào túi",
      "icon": "🎒",
      "example": "My bag is already packed.",
      "partOfSpeech": "verb",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "be-going-to",
      "title_vi": "\"be going to\": kế hoạch đã định trước",
      "explain_vi": "Kế hoạch ĐÃ ĐỊNH trước thì dùng \"be going to + động từ nguyên mẫu\". Chọn am/is/are cho khớp chủ ngữ; phủ định thêm \"not\" ngay sau am/is/are.",
      "examples": [
        "I am going to bake a cake next Saturday.",
        "My cousin is going to paint a poster next Saturday.",
        "We are not going to plant a tree next Saturday."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose",
        "transform"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "plan-affirm",
            "text": "{planner} {be} going to {plan} next Saturday.",
            "blanks": [
              "be"
            ],
            "context_vi": "Nói kế hoạch đã định cho thứ Bảy tới. Chọn am/is/are cho khớp chủ ngữ.",
            "audioText": "My cousin is going to paint a poster next Saturday."
          },
          {
            "id": "plan-negative",
            "text": "{planner} {be} not going to {plan} next Saturday.",
            "blanks": [
              "be"
            ],
            "context_vi": "Câu phủ định: \"not\" đứng ngay sau am/is/are, trước \"going to\".",
            "audioText": "We are not going to plant a tree next Saturday."
          }
        ],
        "slots": {
          "planner": [
            "I",
            "You",
            "We",
            "My cousin",
            "My neighbours",
            "Our class"
          ],
          "be": [
            "am",
            "is",
            "are"
          ],
          "plan": [
            "bake a cake",
            "paint a poster",
            "plant a tree",
            "learn the guitar",
            "join the chess club"
          ]
        },
        "answerKey": {
          "plan-affirm": {
            "be": {
              "__cond": "planner",
              "I": "am",
              "You": "are",
              "We": "are",
              "My cousin": "is",
              "My neighbours": "are",
              "Our class": "is"
            }
          },
          "plan-negative": {
            "be": {
              "__cond": "planner",
              "I": "am",
              "You": "are",
              "We": "are",
              "My cousin": "is",
              "My neighbours": "are",
              "Our class": "is"
            }
          },
          "answer-pairs": {
            "I am going to bake a cake next Saturday.": "I am not going to bake a cake next Saturday.",
            "You are going to learn the guitar next Saturday.": "You are not going to learn the guitar next Saturday.",
            "We are going to plant a tree next Saturday.": "We are not going to plant a tree next Saturday.",
            "My cousin is going to paint a poster next Saturday.": "My cousin is not going to paint a poster next Saturday.",
            "My neighbours are going to plant a tree next Saturday.": "My neighbours are not going to plant a tree next Saturday.",
            "Our class is going to join the chess club next Saturday.": "Our class is not going to join the chess club next Saturday."
          }
        },
        "distractors": [
          "I is going to bake a cake next Saturday.",
          "My cousin are going to paint a poster next Saturday.",
          "We is going to plant a tree next Saturday.",
          "My cousin going to learn the guitar next Saturday.",
          "Our class is going to bakes a cake next Saturday.",
          "You are going bake a cake next Saturday."
        ],
        "irregulars": {}
      },
      "teach_vi": "Khi em đã BÀN TRƯỚC, đã chuẩn bị, đã ghi vào sổ — nói bằng \"be going to\". Công thức: chủ ngữ + am/is/are + going to + động từ nguyên mẫu. Chọn \"to be\" theo chủ ngữ: I → am; He/She/It và MỘT người → is; You/We/They và NHIỀU người → are. Ví dụ: \"I am going to bake a cake next Saturday.\" (Thứ Bảy tới em định nướng bánh). Sau \"going to\" luôn là động từ nguyên mẫu, KHÔNG thêm \"-s\", KHÔNG chia thì: nói \"is going to bake\", không nói \"is going to bakes\" hay \"is going to baked\". Hai lỗi hay gặp nữa: bỏ mất \"to\" (\"is going bake\" ✗) và bỏ mất am/is/are (\"My cousin going to paint\" ✗). Muốn nói KHÔNG định làm, em chỉ cần thêm \"not\" ngay sau am/is/are: \"We are not going to plant a tree.\""
    },
    {
      "id": "will",
      "title_vi": "\"will\": quyết định tức thì & dự đoán",
      "explain_vi": "\"will\" giữ nguyên với mọi chủ ngữ và sau nó là động từ nguyên mẫu (will bring — không \"wills\", không \"will to\"). Phủ định: will not = won't.",
      "examples": [
        "I will bring a big kite to the field tomorrow.",
        "My cousin will play football tomorrow because the field is dry.",
        "We won't play football tomorrow because the ball is broken."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose",
        "transform"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "will-same-for-all",
            "text": "{doer} {wl} bring a big kite to the field tomorrow.",
            "blanks": [
              "wl"
            ],
            "context_vi": "\"will\" giữ nguyên với mọi chủ ngữ, không bao giờ thêm \"-s\" — chọn \"will\" hay \"wills\"?",
            "audioText": "My cousin will bring a big kite to the field tomorrow."
          },
          {
            "id": "will-or-wont",
            "text": "{doer} {wl2} play football tomorrow because {reason}.",
            "blanks": [
              "wl2"
            ],
            "context_vi": "Đọc lí do ở cuối câu: thuận lợi thì dùng \"will\", trở ngại thì dùng \"won't\".",
            "audioText": "We won't play football tomorrow because the ball is broken."
          }
        ],
        "slots": {
          "doer": [
            "I",
            "You",
            "We",
            "My cousin",
            "My neighbours",
            "Our class"
          ],
          "wl": [
            "will",
            "wills"
          ],
          "wl2": [
            "will",
            "won't"
          ],
          "reason": [
            "the field is dry",
            "the field is closed",
            "everyone is free",
            "the ball is broken"
          ]
        },
        "answerKey": {
          "will-same-for-all": {
            "wl": {
              "__cond": "doer",
              "I": "will",
              "You": "will",
              "We": "will",
              "My cousin": "will",
              "My neighbours": "will",
              "Our class": "will"
            }
          },
          "will-or-wont": {
            "wl2": {
              "__cond": "reason",
              "the field is dry": "will",
              "the field is closed": "won't",
              "everyone is free": "will",
              "the ball is broken": "won't"
            }
          },
          "answer-pairs": {
            "I will bring a big kite to the field tomorrow.": "I won't bring a big kite to the field tomorrow.",
            "We will bring a big kite to the field tomorrow.": "We won't bring a big kite to the field tomorrow.",
            "You will find the answer in this book.": "You won't find the answer in this book.",
            "My cousin will play football tomorrow.": "My cousin won't play football tomorrow.",
            "Our class will play football tomorrow.": "Our class won't play football tomorrow.",
            "My neighbours will paint the old gate.": "My neighbours won't paint the old gate."
          }
        },
        "distractors": [
          "My cousin wills bring a big kite to the field tomorrow.",
          "We will brings a big kite to the field tomorrow.",
          "I will to bring a big kite to the field tomorrow.",
          "Our class will played football tomorrow because the field is dry.",
          "My neighbours won't plays football tomorrow because the ball is broken.",
          "You will play football tomorrow because the ball is broken."
        ],
        "irregulars": {}
      },
      "teach_vi": "\"will\" dùng cho hai việc: (1) điều em QUYẾT ĐỊNH NGAY lúc đang nói — \"That bag is heavy. I will carry it for you.\"; (2) điều em ĐOÁN sẽ xảy ra — \"Our class will win the match.\" Điểm dễ nhất của \"will\": nó giữ nguyên với MỌI chủ ngữ — I will, you will, she will, they will — không bao giờ có \"wills\". Sau \"will\" là động từ nguyên mẫu, KHÔNG thêm \"to\" và KHÔNG thêm \"-s\": \"He will play\" (đúng) — \"He will to play\", \"He will plays\", \"He will played\" (đều sai). Phủ định là \"will not\", nói gọn thành \"won't\": \"We won't play football tomorrow.\" Nhớ sau \"won't\" cũng là động từ nguyên mẫu, không phải \"won't plays\"."
    },
    {
      "id": "will-vs-going-to",
      "title_vi": "Phân biệt \"will\" và \"be going to\"",
      "explain_vi": "Vừa nghĩ ra, quyết định ngay lúc nói → dùng \"will\". Kế hoạch đã bàn, đã chuẩn bị từ trước → dùng \"be going to\".",
      "examples": [
        "Look, that bag is very heavy. I will carry it for you right now.",
        "My bag is already packed. I am going to travel to Da Lat next weekend.",
        "I bought the tickets last week. I am going to visit the science museum next weekend."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "sudden-decision",
            "text": "{cueNow} I {ff} {helpAct} right now.",
            "blanks": [
              "ff"
            ],
            "context_vi": "Đọc câu đầu: đây là việc vừa nghĩ ra hay kế hoạch đã định? Rồi chọn dạng tương lai đúng.",
            "audioText": "Look, that bag is very heavy. I will carry it for you right now."
          },
          {
            "id": "made-a-plan",
            "text": "{cuePlan} I {ff} {planAct} next weekend.",
            "blanks": [
              "ff"
            ],
            "context_vi": "Đọc câu đầu: đây là việc vừa nghĩ ra hay kế hoạch đã định? Rồi chọn dạng tương lai đúng.",
            "audioText": "My bag is already packed. I am going to travel to Da Lat next weekend."
          }
        ],
        "slots": {
          "cueNow": [
            "Look, that bag is very heavy.",
            "Oh no, the milk is on the floor.",
            "Wait, the door is still open."
          ],
          "cuePlan": [
            "I bought the tickets last week.",
            "My bag is already packed.",
            "I wrote my plan in my notebook on Monday."
          ],
          "ff": [
            "will",
            "am going to"
          ],
          "helpAct": [
            "carry it for you",
            "clean it up",
            "close it"
          ],
          "planAct": [
            "visit the science museum",
            "travel to Da Lat",
            "join the swimming class"
          ]
        },
        "answerKey": {
          "sudden-decision": {
            "ff": "will",
            "helpAct": {
              "__cond": "cueNow",
              "Look, that bag is very heavy.": "carry it for you",
              "Oh no, the milk is on the floor.": "clean it up",
              "Wait, the door is still open.": "close it"
            }
          },
          "made-a-plan": {
            "ff": "am going to",
            "planAct": {
              "__cond": "cuePlan",
              "I bought the tickets last week.": "visit the science museum",
              "My bag is already packed.": "travel to Da Lat",
              "I wrote my plan in my notebook on Monday.": "join the swimming class"
            }
          }
        },
        "distractors": [
          "Look, that bag is very heavy. I am going to carry it for you right now.",
          "My bag is already packed. I will travel to Da Lat next weekend.",
          "Look, that bag is very heavy. I will to carry it for you right now.",
          "I bought the tickets last week. I going to visit the science museum next weekend.",
          "Wait, the door is still open. I will closing it right now.",
          "My bag is already packed. I am going travel to Da Lat next weekend."
        ],
        "irregulars": {}
      },
      "teach_vi": "Hai cách nói tương lai này KHÔNG thay thế nhau được. Em nhìn vào MANH MỐI trong câu trước: nếu việc đó VỪA XẢY RA và em phản ứng ngay — thấy cái túi nặng, thấy sữa đổ, thấy cửa còn mở — thì đó là quyết định tức thì, dùng \"will\": \"Oh no, the milk is on the floor. I will clean it up right now.\" Còn nếu câu trước cho thấy em ĐÃ CHUẨN BỊ TỪ TRƯỚC — đã mua vé, đã xếp xong túi, đã ghi kế hoạch vào sổ — thì đó là kế hoạch đã định, dùng \"be going to\": \"I bought the tickets last week. I am going to visit the science museum next weekend.\" Mẹo nhớ: \"will\" = nghĩ ra LÚC NÓI; \"be going to\" = nghĩ ra TRƯỚC KHI NÓI. Riêng khi đoán tương lai dựa vào cảm nhận của mình thì dùng \"will\" (\"I think our team will win\")."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "our-class-plan",
      "title": "Our class plan",
      "title_vi": "Kế hoạch của lớp em",
      "text": "Our class has a big plan. Next Saturday we are going to visit the science museum in the city. Nam bought the tickets last week, so everything is ready. I am going to bring my camera, and Mai is going to bring her notebook. Our teacher thinks the weather will be fine. Oh, look at the sky! It is grey now. I will put my raincoat in my bag.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Bạn Nam đã mua vé từ tuần trước, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "Nam bought the tickets last week."
        },
        {
          "id": "q2",
          "q_vi": "Vì sao bạn nhỏ nói \"I will put my raincoat in my bag\" chứ không nói \"I am going to\"?",
          "type": "mcq",
          "choices": [
            "Vì bạn ấy vừa nhìn thấy trời xám và quyết định NGAY lúc đó",
            "Vì bạn ấy đã lên kế hoạch mang áo mưa từ tuần trước",
            "Vì cô giáo đã yêu cầu cả lớp mang áo mưa"
          ],
          "answer": 0,
          "audioText": "Why does the child say \"I will put my raincoat in my bag\"?"
        }
      ]
    }
  ]
};
  C["grammar3/unit14.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 414,
  "lesson": 14,
  "topic": "Modal verbs: must, should, may, have to",
  "topic_vi": "Động từ khiếm khuyết: must · should · may · have to",
  "vocab": [
    {
      "word": "helmet",
      "vi": "mũ bảo hiểm",
      "icon": "⛑️",
      "example": "You have to wear a helmet on the bike.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "hospital",
      "vi": "bệnh viện",
      "icon": "🏥",
      "example": "This is a hospital, so you must be quiet.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "library",
      "vi": "thư viện",
      "icon": "📚",
      "example": "The library is open now.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "rule",
      "vi": "quy định, nội quy",
      "icon": "📋",
      "example": "Our school has clear rules.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "cough",
      "vi": "cơn ho",
      "icon": "😷",
      "example": "You have a bad cough.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "bench",
      "vi": "băng ghế",
      "icon": "🪑",
      "example": "You may not sit on the bench.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "gate",
      "vi": "cái cổng",
      "icon": "🚪",
      "example": "The garden gate is locked.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "practice",
      "vi": "buổi luyện tập",
      "icon": "🏃",
      "example": "You must join the practice.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "quiet",
      "vi": "yên lặng",
      "icon": "🤫",
      "example": "You must be quiet in here.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "dirty",
      "vi": "bẩn",
      "icon": "🧼",
      "example": "Your hands are dirty.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "wet",
      "vi": "ướt",
      "icon": "💦",
      "example": "The floor is wet.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "borrow",
      "vi": "mượn",
      "icon": "📖",
      "example": "You may borrow two books.",
      "partOfSpeech": "verb",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "must-mustnt",
      "title_vi": "\"must\" / \"mustn't\": phải làm · không được làm",
      "explain_vi": "\"must\" = phải làm; \"mustn't\" = không được làm (bị cấm). Sau must/mustn't luôn là động từ nguyên mẫu — không thêm \"to\", không thêm \"-s\".",
      "examples": [
        "The traffic light is red. You must stop your bike.",
        "This is a hospital. You mustn't shout in here.",
        "You mustn't touch the wall because the paint is still wet."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "rule-then-must",
            "text": "{sit} You {modal} {act}.",
            "blanks": [
              "modal"
            ],
            "context_vi": "Đọc tình huống ở câu đầu: việc này BẮT BUỘC làm hay BỊ CẤM làm?",
            "audioText": "The traffic light is red. You must stop your bike."
          },
          {
            "id": "must-because",
            "text": "You {modal2} {act3} because {reason}.",
            "blanks": [
              "modal2"
            ],
            "context_vi": "Lí do ở cuối câu cho biết đây là việc phải làm hay việc bị cấm.",
            "audioText": "You mustn't touch the wall because the paint is still wet."
          }
        ],
        "slots": {
          "sit": [
            "The traffic light is red.",
            "This is a hospital.",
            "The floor is wet.",
            "The bus leaves at six.",
            "This water is dirty.",
            "The test is tomorrow."
          ],
          "modal": [
            "must",
            "mustn't"
          ],
          "act": [
            "stop your bike",
            "shout in here",
            "run in the hall",
            "be at the stop before six",
            "drink it",
            "study tonight"
          ],
          "modal2": [
            "must",
            "mustn't"
          ],
          "act3": [
            "come early",
            "touch the wall",
            "walk on the lake",
            "join the practice"
          ],
          "reason": [
            "the museum closes at five",
            "the paint is still wet",
            "the ice is very thin",
            "our team needs you"
          ]
        },
        "answerKey": {
          "rule-then-must": {
            "modal": {
              "__cond": "sit",
              "The traffic light is red.": "must",
              "This is a hospital.": "mustn't",
              "The floor is wet.": "mustn't",
              "The bus leaves at six.": "must",
              "This water is dirty.": "mustn't",
              "The test is tomorrow.": "must"
            },
            "act": {
              "__cond": "sit",
              "The traffic light is red.": "stop your bike",
              "This is a hospital.": "shout in here",
              "The floor is wet.": "run in the hall",
              "The bus leaves at six.": "be at the stop before six",
              "This water is dirty.": "drink it",
              "The test is tomorrow.": "study tonight"
            }
          },
          "must-because": {
            "modal2": {
              "__cond": "reason",
              "the museum closes at five": "must",
              "the paint is still wet": "mustn't",
              "the ice is very thin": "mustn't",
              "our team needs you": "must"
            },
            "act3": {
              "__cond": "reason",
              "the museum closes at five": "come early",
              "the paint is still wet": "touch the wall",
              "the ice is very thin": "walk on the lake",
              "our team needs you": "join the practice"
            }
          }
        },
        "distractors": [
          "The traffic light is red. You must to stop your bike.",
          "This is a hospital. You mustn't to shout in here.",
          "The floor is wet. You must not runs in the hall.",
          "The test is tomorrow. You musts study tonight.",
          "You mustn't touching the wall because the paint is still wet.",
          "The traffic light is red. You mustn't stop your bike."
        ],
        "irregulars": {}
      },
      "teach_vi": "\"must\" nói việc BẮT BUỘC phải làm, thường là điều người nói thấy rất quan trọng: \"The test is tomorrow. You must study tonight.\" Còn \"mustn't\" (viết đầy đủ là \"must not\") KHÔNG có nghĩa \"không cần\" mà có nghĩa CẤM — tuyệt đối không được làm: \"The floor is wet. You mustn't run in the hall.\" Cả hai đều giữ nguyên với mọi chủ ngữ (I must, she must, they must — không bao giờ \"musts\"), và sau chúng luôn là động từ nguyên mẫu: \"You must stop\" (đúng) — \"You must to stop\", \"You must stops\", \"You mustn't touching\" (đều sai). Khi làm bài, em hãy đọc kĩ tình huống: đèn đỏ, xe buýt sắp chạy, hôm sau có bài kiểm tra → việc phải làm (must); bệnh viện, sàn ướt, nước bẩn, sơn còn ướt → việc bị cấm (mustn't)."
    },
    {
      "id": "should",
      "title_vi": "\"should\" / \"shouldn't\": nên · không nên (lời khuyên)",
      "explain_vi": "\"should\" = nên, \"shouldn't\" = không nên — dùng để khuyên. Sau should là động từ nguyên mẫu: you should rest (không \"should to rest\").",
      "examples": [
        "You have a bad cough. You should drink warm water.",
        "It is very late. You shouldn't watch another film.",
        "That river is very deep. I think you shouldn't swim there alone."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "problem-advice",
            "text": "{problem} You {sh} {advice}.",
            "blanks": [
              "sh"
            ],
            "context_vi": "Đọc vấn đề ở câu đầu: việc này NÊN làm hay KHÔNG NÊN làm?",
            "audioText": "You have a bad cough. You should drink warm water."
          },
          {
            "id": "i-think-advice",
            "text": "{problem2} I think you {sh2} {advice2}.",
            "blanks": [
              "sh2"
            ],
            "context_vi": "\"I think\" làm lời khuyên nhẹ hơn. Vẫn phải chọn should hay shouldn't cho khớp tình huống.",
            "audioText": "That river is very deep. I think you shouldn't swim there alone."
          }
        ],
        "slots": {
          "problem": [
            "You have a bad cough.",
            "Your eyes are tired.",
            "It is very late.",
            "The soup is too hot.",
            "You have a test on Monday.",
            "Your hands are dirty."
          ],
          "sh": [
            "should",
            "shouldn't"
          ],
          "advice": [
            "drink warm water",
            "rest for ten minutes",
            "watch another film",
            "eat it now",
            "start early",
            "touch the bread"
          ],
          "problem2": [
            "Your bike makes a strange noise.",
            "This film is scary for small children.",
            "You forgot your homework again.",
            "That river is very deep."
          ],
          "sh2": [
            "should",
            "shouldn't"
          ],
          "advice2": [
            "check the wheels",
            "show it to your little sister",
            "write a list every evening",
            "swim there alone"
          ]
        },
        "answerKey": {
          "problem-advice": {
            "sh": {
              "__cond": "problem",
              "You have a bad cough.": "should",
              "Your eyes are tired.": "should",
              "It is very late.": "shouldn't",
              "The soup is too hot.": "shouldn't",
              "You have a test on Monday.": "should",
              "Your hands are dirty.": "shouldn't"
            },
            "advice": {
              "__cond": "problem",
              "You have a bad cough.": "drink warm water",
              "Your eyes are tired.": "rest for ten minutes",
              "It is very late.": "watch another film",
              "The soup is too hot.": "eat it now",
              "You have a test on Monday.": "start early",
              "Your hands are dirty.": "touch the bread"
            }
          },
          "i-think-advice": {
            "sh2": {
              "__cond": "problem2",
              "Your bike makes a strange noise.": "should",
              "This film is scary for small children.": "shouldn't",
              "You forgot your homework again.": "should",
              "That river is very deep.": "shouldn't"
            },
            "advice2": {
              "__cond": "problem2",
              "Your bike makes a strange noise.": "check the wheels",
              "This film is scary for small children.": "show it to your little sister",
              "You forgot your homework again.": "write a list every evening",
              "That river is very deep.": "swim there alone"
            }
          }
        },
        "distractors": [
          "You have a bad cough. You should to drink warm water.",
          "Your eyes are tired. You shoulds rest for ten minutes.",
          "It is very late. You should not watching another film.",
          "That river is very deep. I think you should swim there alone.",
          "Your hands are dirty. You should touch the bread.",
          "You forgot your homework again. I think you shouldn't write a list every evening."
        ],
        "irregulars": {}
      },
      "teach_vi": "\"should\" là lời KHUYÊN, nhẹ hơn \"must\" nhiều: \"must\" là bắt buộc, còn \"should\" chỉ là \"nên thế thì tốt hơn\". Ví dụ: \"Your eyes are tired. You should rest for ten minutes.\" Ngược lại, \"shouldn't\" (= should not) là \"không nên\": \"It is very late. You shouldn't watch another film.\" Giống must, \"should\" giữ nguyên với mọi chủ ngữ (I should, he should, they should — không có \"shoulds\") và sau nó là động từ nguyên mẫu: \"You should rest\" (đúng) — \"You should to rest\", \"You should resting\" (sai). Người Việt hay thêm \"I think\" ở đầu cho lịch sự: \"I think you should check the wheels.\" — cấu trúc bên trong vẫn y như cũ."
    },
    {
      "id": "may-permission",
      "title_vi": "\"may\" / \"may not\": được phép · không được phép",
      "explain_vi": "\"may\" = được phép; \"may not\" = không được phép. Sau \"may\" là động từ nguyên mẫu, không thêm \"to\" và không thêm \"-s\".",
      "examples": [
        "The library is open now, so you may borrow two books.",
        "This box is not yours, so you may not open it.",
        "You may have a small cake because you finished your dinner."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "may-cue",
            "text": "{cue}, so you {perm} {act}.",
            "blanks": [
              "perm"
            ],
            "context_vi": "Vế đầu cho biết em CÓ được phép hay KHÔNG được phép làm việc đó.",
            "audioText": "The library is open now, so you may borrow two books."
          },
          {
            "id": "may-because",
            "text": "You {perm2} {act2} because {reason2}.",
            "blanks": [
              "perm2"
            ],
            "context_vi": "Lí do ở cuối câu cho biết chọn \"may\" hay \"may not\".",
            "audioText": "You may not talk in the room because the exam has started."
          }
        ],
        "slots": {
          "cue": [
            "The library is open now",
            "This box is not yours",
            "Your name is on the list",
            "The garden gate is locked",
            "Your homework is finished"
          ],
          "perm": [
            "may",
            "may not"
          ],
          "act": [
            "borrow two books",
            "open it",
            "join the trip",
            "play outside today",
            "watch one cartoon"
          ],
          "perm2": [
            "may",
            "may not"
          ],
          "act2": [
            "talk in the room",
            "stay until seven",
            "sit on the bench",
            "have a small cake"
          ],
          "reason2": [
            "the exam has started",
            "your parents said yes",
            "the paint is fresh",
            "you finished your dinner"
          ]
        },
        "answerKey": {
          "may-cue": {
            "perm": {
              "__cond": "cue",
              "The library is open now": "may",
              "This box is not yours": "may not",
              "Your name is on the list": "may",
              "The garden gate is locked": "may not",
              "Your homework is finished": "may"
            },
            "act": {
              "__cond": "cue",
              "The library is open now": "borrow two books",
              "This box is not yours": "open it",
              "Your name is on the list": "join the trip",
              "The garden gate is locked": "play outside today",
              "Your homework is finished": "watch one cartoon"
            }
          },
          "may-because": {
            "perm2": {
              "__cond": "reason2",
              "the exam has started": "may not",
              "your parents said yes": "may",
              "the paint is fresh": "may not",
              "you finished your dinner": "may"
            },
            "act2": {
              "__cond": "reason2",
              "the exam has started": "talk in the room",
              "your parents said yes": "stay until seven",
              "the paint is fresh": "sit on the bench",
              "you finished your dinner": "have a small cake"
            }
          }
        },
        "distractors": [
          "The library is open now, so you may to borrow two books.",
          "This box is not yours, so you may not to open it.",
          "Your name is on the list, so you mays join the trip.",
          "This box is not yours, so you may open it.",
          "You may talk in the room because the exam has started.",
          "The garden gate is locked, so you may play outside today."
        ],
        "irregulars": {}
      },
      "teach_vi": "\"may\" nói về SỰ CHO PHÉP. Khi người lớn cho phép em làm gì, họ nói: \"You may watch one cartoon.\" Khi không cho phép, họ nói \"may not\": \"You may not sit on the bench because the paint is fresh.\" Em cũng dùng \"May I …?\" để XIN PHÉP một cách lịch sự: \"May I borrow this book, please?\" — trả lời là \"Yes, you may.\" hoặc \"No, you may not.\" Sau \"may\" luôn là động từ nguyên mẫu, không thêm \"to\", không thêm \"-s\": \"you may open\" (đúng) — \"you may to open\", \"you mays open\" (sai). Phân biệt nhanh: \"must\" là bắt buộc, \"should\" là nên, còn \"may\" là được phép."
    },
    {
      "id": "have-to",
      "title_vi": "\"have to\" / \"has to\": phải làm theo quy định",
      "explain_vi": "\"have to\" = phải (do quy định bên ngoài). He/She và một người dùng \"has to\". Phủ định \"don't / doesn't have to\" nghĩa là KHÔNG CẦN.",
      "examples": [
        "My cousin has to wear a helmet on the bike.",
        "We have to wear a helmet on the bike.",
        "My sister doesn't have to go to school on Sunday."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "have-has-to",
            "text": "{doer} {ht} to wear a helmet on the bike.",
            "blanks": [
              "ht"
            ],
            "context_vi": "Chọn \"have\" hay \"has\" cho khớp chủ ngữ.",
            "audioText": "My cousin has to wear a helmet on the bike."
          },
          {
            "id": "not-have-to",
            "text": "{doer} {dht} have to go to school on Sunday.",
            "blanks": [
              "dht"
            ],
            "context_vi": "Câu phủ định: chọn \"don't\" hay \"doesn't\" cho khớp chủ ngữ. Nghĩa là KHÔNG CẦN.",
            "audioText": "My sister doesn't have to go to school on Sunday."
          }
        ],
        "slots": {
          "doer": [
            "I",
            "You",
            "We",
            "They",
            "My cousin",
            "My sister",
            "The children",
            "My friend Nam"
          ],
          "ht": [
            "have",
            "has"
          ],
          "dht": [
            "don't",
            "doesn't"
          ]
        },
        "answerKey": {
          "have-has-to": {
            "ht": {
              "__cond": "doer",
              "I": "have",
              "You": "have",
              "We": "have",
              "They": "have",
              "My cousin": "has",
              "My sister": "has",
              "The children": "have",
              "My friend Nam": "has"
            }
          },
          "not-have-to": {
            "dht": {
              "__cond": "doer",
              "I": "don't",
              "You": "don't",
              "We": "don't",
              "They": "don't",
              "My cousin": "doesn't",
              "My sister": "doesn't",
              "The children": "don't",
              "My friend Nam": "doesn't"
            }
          }
        },
        "distractors": [
          "My cousin have to wear a helmet on the bike.",
          "I has to wear a helmet on the bike.",
          "The children has to wear a helmet on the bike.",
          "My sister don't have to go to school on Sunday.",
          "We doesn't have to go to school on Sunday.",
          "My friend Nam have to wear a helmet on the bike."
        ],
        "irregulars": {}
      },
      "teach_vi": "\"have to\" cũng nghĩa là PHẢI, nhưng bắt buộc đến từ BÊN NGOÀI: luật giao thông, nội quy trường, lời bố mẹ. \"You have to wear a helmet on the bike.\" (Luật quy định thế). Khác với \"must\" (không đổi hình), \"have to\" ĐỔI theo chủ ngữ giống động từ thường: I/You/We/They + have to; He/She/It và MỘT người + has to — \"My cousin has to wear a helmet.\" Câu phủ định dùng don't / doesn't: \"We don't have to go to school on Sunday.\", \"My sister doesn't have to go to school on Sunday.\" Chú ý điểm rất dễ sai: \"don't have to\" = KHÔNG CẦN (không bắt buộc), khác hoàn toàn với \"mustn't\" = KHÔNG ĐƯỢC (bị cấm). Chủ nhật không cần đi học ≠ Chủ nhật bị cấm đi học."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "rules-at-the-pool",
      "title": "Rules at the swimming pool",
      "title_vi": "Nội quy ở bể bơi",
      "text": "Here are the rules at our swimming pool. You must take a shower before you swim. You mustn't run beside the water, because the floor is wet. Small children have to swim with an adult. You may borrow a swimming ring at the desk, but you have to give it back. When you feel cold, you should get out and dry yourself. On Monday the pool is closed, so you don't have to bring your towel on that day.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Ở bể bơi, em KHÔNG ĐƯỢC chạy cạnh mép nước, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "You mustn't run beside the water."
        },
        {
          "id": "q2",
          "q_vi": "Trẻ nhỏ phải bơi cùng ai?",
          "type": "mcq",
          "choices": [
            "cùng một người lớn",
            "cùng một bạn cùng lớp",
            "bơi một mình cũng được"
          ],
          "answer": 0,
          "audioText": "Small children have to swim with an adult."
        }
      ]
    }
  ]
};
  C["grammar3/unit15.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 415,
  "lesson": 15,
  "topic": "Conditionals: zero, first and second",
  "topic_vi": "Câu điều kiện: loại 0 · loại 1 · loại 2",
  "vocab": [
    {
      "word": "ice",
      "vi": "băng, đá lạnh",
      "icon": "🧊",
      "example": "If you heat ice, it melts.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "melt",
      "vi": "tan chảy",
      "icon": "💧",
      "example": "Ice melts in the sun.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "sink",
      "vi": "chìm xuống",
      "icon": "⬇️",
      "example": "A stone sinks in water.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "grow",
      "vi": "trồng, mọc lên",
      "icon": "🌱",
      "example": "I would grow tomatoes if I had a garden.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "island",
      "vi": "hòn đảo",
      "icon": "🏝️",
      "example": "I would sail to that island.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "wing",
      "vi": "cái cánh",
      "icon": "🪽",
      "example": "A bird has two wings.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "telescope",
      "vi": "kính viễn vọng",
      "icon": "🔭",
      "example": "I would buy a big telescope.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "mountain",
      "vi": "núi",
      "icon": "⛰️",
      "example": "I would fly over the mountains.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "snail",
      "vi": "con ốc sên",
      "icon": "🐌",
      "example": "If you touch a snail, it hides.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "lamp",
      "vi": "cái đèn",
      "icon": "💡",
      "example": "The lamp turns on if you press this button.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "dinosaur",
      "vi": "con khủng long",
      "icon": "🦕",
      "example": "I would run away fast if I met a dinosaur.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "pilot",
      "vi": "phi công",
      "icon": "🧑‍✈️",
      "example": "I would fly a big plane if I were a pilot.",
      "partOfSpeech": "noun",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "zero-conditional",
      "title_vi": "Điều kiện loại 0: điều LUÔN đúng",
      "explain_vi": "Điều luôn đúng: If + hiện tại đơn, hiện tại đơn. Cả hai vế đều KHÔNG dùng \"will\". Chủ ngữ số ít thì động từ thêm \"-s\": it melts.",
      "examples": [
        "If you heat ice, it melts.",
        "Plants die if you forget to water them.",
        "The lamp turns on if you press this button."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "zero-if-result",
            "text": "If you {action}, it {vb}.",
            "blanks": [
              "vb"
            ],
            "context_vi": "Điều luôn đúng — vế sau dùng hiện tại đơn. Chủ ngữ \"it\" nên động từ thêm \"-s\".",
            "audioText": "If you heat ice, it melts."
          },
          {
            "id": "zero-result-first",
            "text": "{topic} {vb2} if you {action3}.",
            "blanks": [
              "vb2"
            ],
            "context_vi": "Vế chính đứng trước, vế \"if\" đứng sau (không cần dấu phẩy). Nhìn chủ ngữ số ít hay số nhiều để thêm \"-s\".",
            "audioText": "The lamp turns on if you press this button."
          }
        ],
        "slots": {
          "action": [
            "heat ice",
            "drop a stone in water",
            "put a plant in the dark",
            "press the doorbell",
            "leave milk in the sun",
            "touch a snail"
          ],
          "vb": [
            "melts",
            "sinks",
            "dies",
            "rings",
            "goes bad",
            "hides"
          ],
          "topic": [
            "The ice",
            "The lamp",
            "Plants",
            "The salt",
            "Snails"
          ],
          "vb2": [
            "melts",
            "turns on",
            "die",
            "disappears",
            "hide"
          ],
          "action3": [
            "put it in the sun",
            "press this button",
            "forget to water them",
            "add it to warm water",
            "touch them"
          ]
        },
        "answerKey": {
          "zero-if-result": {
            "vb": {
              "__cond": "action",
              "heat ice": "melts",
              "drop a stone in water": "sinks",
              "put a plant in the dark": "dies",
              "press the doorbell": "rings",
              "leave milk in the sun": "goes bad",
              "touch a snail": "hides"
            }
          },
          "zero-result-first": {
            "vb2": {
              "__cond": "topic",
              "The ice": "melts",
              "The lamp": "turns on",
              "Plants": "die",
              "The salt": "disappears",
              "Snails": "hide"
            },
            "action3": {
              "__cond": "topic",
              "The ice": "put it in the sun",
              "The lamp": "press this button",
              "Plants": "forget to water them",
              "The salt": "add it to warm water",
              "Snails": "touch them"
            }
          }
        },
        "distractors": [
          "If you heat ice, it will melts.",
          "If you heat ice, it melt.",
          "If you will heat ice, it melts.",
          "If you press the doorbell, it will rings.",
          "Plants dies if you forget to water them.",
          "The ice melt if you put it in the sun."
        ],
        "irregulars": {}
      },
      "teach_vi": "Điều kiện loại 0 nói về điều LÚC NÀO CŨNG ĐÚNG: quy luật tự nhiên, thói quen, cách một cái máy hoạt động. Công thức rất dễ: If + hiện tại đơn, hiện tại đơn. Ví dụ: \"If you heat ice, it melts.\" (Cứ làm nóng đá là nó tan). Hai vế có thể đổi chỗ; khi vế \"if\" đứng SAU thì không cần dấu phẩy: \"Plants die if you forget to water them.\" Điều quan trọng nhất phải nhớ: loại 0 KHÔNG dùng \"will\" ở vế nào cả — nói \"it melts\", không nói \"it will melt\" hay \"it will melts\". Và đừng quên quy tắc hiện tại đơn: chủ ngữ số ít thì động từ thêm \"-s\" (the lamp turns on, the salt disappears), chủ ngữ số nhiều thì giữ nguyên (plants die, snails hide)."
    },
    {
      "id": "first-conditional",
      "title_vi": "Điều kiện loại 1: việc CÓ THỂ xảy ra",
      "explain_vi": "Việc có thể xảy ra: If + hiện tại đơn, will + động từ nguyên mẫu. Sau \"if\" KHÔNG dùng will; vế chính dùng will hoặc won't.",
      "examples": [
        "If you leave now, you will catch the early bus.",
        "If the sun shines tomorrow, we will fly our kites in the field.",
        "If the rain does not stop, we won't play outside today."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "first-if-present",
            "text": "If you {vb} now, you will {act}.",
            "blanks": [
              "vb"
            ],
            "context_vi": "Sau \"if\" dùng HIỆN TẠI ĐƠN, không dùng \"will\". Chọn động từ khớp với kết quả ở vế sau.",
            "audioText": "If you leave now, you will catch the early bus."
          },
          {
            "id": "first-will-or-wont",
            "text": "If {cond}, we {wl} {act2}.",
            "blanks": [
              "wl"
            ],
            "context_vi": "Đọc vế \"if\": thuận lợi thì vế chính dùng \"will\", trở ngại thì dùng \"won't\".",
            "audioText": "If the rain does not stop, we won't play outside today."
          }
        ],
        "slots": {
          "vb": [
            "leave",
            "start",
            "rest",
            "listen"
          ],
          "act": [
            "catch the early bus",
            "finish before dinner",
            "feel much better",
            "hear the whole story"
          ],
          "cond": [
            "the sun shines tomorrow",
            "the rain does not stop",
            "everyone comes early",
            "the bus breaks down"
          ],
          "wl": [
            "will",
            "won't"
          ],
          "act2": [
            "fly our kites in the field",
            "play outside today",
            "start the game at eight",
            "arrive before ten"
          ]
        },
        "answerKey": {
          "first-if-present": {
            "vb": {
              "__cond": "act",
              "catch the early bus": "leave",
              "finish before dinner": "start",
              "feel much better": "rest",
              "hear the whole story": "listen"
            }
          },
          "first-will-or-wont": {
            "wl": {
              "__cond": "cond",
              "the sun shines tomorrow": "will",
              "the rain does not stop": "won't",
              "everyone comes early": "will",
              "the bus breaks down": "won't"
            },
            "act2": {
              "__cond": "cond",
              "the sun shines tomorrow": "fly our kites in the field",
              "the rain does not stop": "play outside today",
              "everyone comes early": "start the game at eight",
              "the bus breaks down": "arrive before ten"
            }
          }
        },
        "distractors": [
          "If you will leave now, you will catch the early bus.",
          "If you leave now, you catch the early bus.",
          "If you rest now, you will feels much better.",
          "If the sun shines tomorrow, we will flies our kites in the field.",
          "If the rain will not stop, we won't play outside today.",
          "If everyone comes early, we will to start the game at eight."
        ],
        "irregulars": {}
      },
      "teach_vi": "Điều kiện loại 1 nói về việc THẬT SỰ CÓ THỂ xảy ra trong tương lai: ngày mai có thể mưa, xe buýt có thể đến muộn. Công thức: If + hiện tại đơn, will + động từ nguyên mẫu. Ví dụ: \"If you leave now, you will catch the early bus.\" (Nếu em đi bây giờ, em sẽ kịp chuyến xe sớm). Lỗi số một của người Việt là đưa \"will\" vào sau \"if\" — vì tiếng Việt nói \"nếu trời SẼ mưa\". Tiếng Anh KHÔNG như vậy: \"If it rains tomorrow…\" (đúng) — \"If it will rain tomorrow…\" (sai). Vế chính thì bắt buộc phải có \"will\", hoặc \"won't\" nếu kết quả là điều không xảy ra: \"If the rain does not stop, we won't play outside today.\" Sau will/won't luôn là động từ nguyên mẫu, không thêm \"-s\", không thêm \"to\"."
    },
    {
      "id": "second-conditional",
      "title_vi": "Điều kiện loại 2: điều TƯỞNG TƯỢNG",
      "explain_vi": "Điều tưởng tượng, không thật: If + quá khứ đơn, would + động từ nguyên mẫu. Với \"I\" thường dùng \"were\": If I were a bird, I would fly.",
      "examples": [
        "If I were a bird, I would fly over the mountains.",
        "If I had one million dong, I would buy a big telescope.",
        "I would grow tomatoes if I had a garden."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "second-if-past",
            "text": "If I {vb} {thing}, I would {act}.",
            "blanks": [
              "vb"
            ],
            "context_vi": "Điều tưởng tượng: sau \"if\" dùng QUÁ KHỨ ĐƠN. Có danh từ thì dùng \"had\", còn miêu tả \"là gì / thế nào\" thì dùng \"were\".",
            "audioText": "If I were a bird, I would fly over the mountains."
          },
          {
            "id": "second-would-first",
            "text": "I would {vb4} if I {cond2}.",
            "blanks": [
              "vb4"
            ],
            "context_vi": "Sau \"would\" là động từ NGUYÊN MẪU. Chọn việc khớp với điều tưởng tượng ở vế \"if\".",
            "audioText": "I would grow tomatoes if I had a garden."
          }
        ],
        "slots": {
          "vb": [
            "had",
            "were"
          ],
          "thing": [
            "a small boat",
            "a bird",
            "one million dong",
            "taller",
            "wings"
          ],
          "act": [
            "sail to that island",
            "fly over the mountains",
            "buy a big telescope",
            "reach the top shelf",
            "fly to school every day"
          ],
          "vb4": [
            "grow tomatoes",
            "fly a big plane",
            "look at the moon",
            "swim every morning",
            "run away fast"
          ],
          "cond2": [
            "had a garden",
            "were a pilot",
            "had a telescope",
            "lived near the sea",
            "met a dinosaur"
          ]
        },
        "answerKey": {
          "second-if-past": {
            "vb": {
              "__cond": "thing",
              "a small boat": "had",
              "a bird": "were",
              "one million dong": "had",
              "taller": "were",
              "wings": "had"
            },
            "act": {
              "__cond": "thing",
              "a small boat": "sail to that island",
              "a bird": "fly over the mountains",
              "one million dong": "buy a big telescope",
              "taller": "reach the top shelf",
              "wings": "fly to school every day"
            }
          },
          "second-would-first": {
            "vb4": {
              "__cond": "cond2",
              "had a garden": "grow tomatoes",
              "were a pilot": "fly a big plane",
              "had a telescope": "look at the moon",
              "lived near the sea": "swim every morning",
              "met a dinosaur": "run away fast"
            }
          }
        },
        "distractors": [
          "If I had a small boat, I will sail to that island.",
          "If I have a small boat, I would sail to that island.",
          "If I were a bird, I would to fly over the mountains.",
          "If I had wings, I would flies to school every day.",
          "I would grow tomatoes if I have a garden.",
          "I would swimming every morning if I lived near the sea."
        ],
        "irregulars": {}
      },
      "teach_vi": "Điều kiện loại 2 dùng để MƠ MỘNG, tưởng tượng điều không có thật: em không phải con chim, em không có một triệu đồng. Công thức: If + quá khứ đơn, would + động từ nguyên mẫu. Ví dụ: \"If I had wings, I would fly to school every day.\" (Nếu em có cánh, em sẽ bay đến trường mỗi ngày). Dùng \"quá khứ\" ở đây KHÔNG có nghĩa là chuyện đã qua — nó chỉ là dấu hiệu cho biết \"đây là chuyện tưởng tượng\". Một điểm đặc biệt: với động từ \"to be\", câu tưởng tượng thường dùng \"were\" cho MỌI chủ ngữ, kể cả \"I\" và \"he\": \"If I were a bird…\", \"If he were taller…\" Vế chính dùng \"would\" (không phải \"will\") và sau \"would\" là động từ nguyên mẫu: \"I would fly\" (đúng) — \"I would to fly\", \"I would flies\" (sai). So sánh nhanh: \"If it rains, I will stay home.\" (có thể xảy ra thật) ≠ \"If I lived on the moon, I would see the Earth every night.\" (chỉ tưởng tượng)."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "if-i-had-wings",
      "title": "If I had wings",
      "title_vi": "Nếu em có cánh",
      "text": "In our science lesson we talk about water. If you heat ice, it melts. If you heat water for a long time, steam comes out of the pot. Then our teacher asks a funny question: \"What will you do if it rains at the weekend?\" Mai says, \"If it rains, I will read my new book at home.\" Then she smiles and adds, \"But if I had wings, I would fly above the clouds and find the sun!\"",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Nếu em làm nóng nước thật lâu thì có hơi nước bay ra khỏi nồi, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "If you heat water for a long time, steam comes out of the pot."
        },
        {
          "id": "q2",
          "q_vi": "Câu \"If I had wings, I would fly above the clouds\" của bạn Mai nói về điều gì?",
          "type": "mcq",
          "choices": [
            "Một điều tưởng tượng, không có thật",
            "Một việc chắc chắn sẽ xảy ra cuối tuần",
            "Một quy luật khoa học luôn đúng"
          ],
          "answer": 0,
          "audioText": "If I had wings, I would fly above the clouds."
        }
      ]
    }
  ]
};
  C["grammar3/unit16.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 416,
  "lesson": 16,
  "topic": "Questions: yes/no questions and wh-questions",
  "topic_vi": "Câu hỏi",
  "vocab": [
    {
      "word": "who",
      "vi": "ai (hỏi về người)",
      "icon": "🙋",
      "example": "Who is your teacher?",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "what",
      "vi": "cái gì (hỏi về vật, việc)",
      "icon": "❓",
      "example": "What is in your bag?",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "where",
      "vi": "ở đâu (hỏi về nơi chốn)",
      "icon": "📍",
      "example": "Where is Mai now?",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "when",
      "vi": "khi nào (hỏi về thời gian)",
      "icon": "⏰",
      "example": "When do you go to school?",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "why",
      "vi": "vì sao (hỏi lí do)",
      "icon": "🤔",
      "example": "Why are you late?",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "how",
      "vi": "bằng cách nào, thế nào",
      "icon": "🧭",
      "example": "How do you go to school?",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "how old",
      "vi": "bao nhiêu tuổi",
      "icon": "🎂",
      "example": "How old is your brother?",
      "partOfSpeech": "phrase",
      "audio": ""
    },
    {
      "word": "how many",
      "vi": "bao nhiêu (đếm được)",
      "icon": "🔢",
      "example": "How many pens do you have?",
      "partOfSpeech": "phrase",
      "audio": ""
    },
    {
      "word": "teacher",
      "vi": "giáo viên",
      "icon": "👩‍🏫",
      "example": "Miss Lan is my teacher.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "football",
      "vi": "môn bóng đá",
      "icon": "⚽",
      "example": "Do you play football?",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "apple",
      "vi": "quả táo",
      "icon": "🍎",
      "example": "I eat an apple every day.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "late",
      "vi": "muộn, trễ",
      "icon": "⏱️",
      "example": "Am I late today?",
      "partOfSpeech": "adj",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "yes-no-questions",
      "title_vi": "Câu hỏi Yes/No: Do · Does · Am · Is · Are",
      "explain_vi": "Câu hỏi Yes/No mở đầu bằng trợ động từ: he/she và một người dùng \"Does\", còn I/you/we/they và nhiều người dùng \"Do\". Với \"to be\" thì đưa am/is/are lên trước chủ ngữ.",
      "examples": [
        "Does she read books?",
        "Do you play football?",
        "Is my brother happy today?",
        "Am I late today?"
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose",
        "transform"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "do-does-q",
            "text": "{aux} {subj} {vp}?",
            "blanks": [
              "aux"
            ],
            "context_vi": "Nhìn chủ ngữ: he/she/một người → Does; I/you/we/they/nhiều người → Do.",
            "audioText": "Does she read books?"
          },
          {
            "id": "be-q",
            "text": "{be} {subj2} {adj} today?",
            "blanks": [
              "be"
            ],
            "context_vi": "Câu hỏi với \"to be\": am/is/are đứng TRƯỚC chủ ngữ và phải khớp chủ ngữ.",
            "audioText": "Is my brother happy today?"
          }
        ],
        "slots": {
          "aux": [
            "Do",
            "Does"
          ],
          "subj": [
            "you",
            "we",
            "they",
            "he",
            "she",
            "my brother",
            "my sister",
            "the children"
          ],
          "vp": [
            "like apples",
            "play football",
            "read books",
            "watch TV",
            "eat rice",
            "want a new bike"
          ],
          "be": [
            "Am",
            "Is",
            "Are"
          ],
          "subj2": [
            "I",
            "you",
            "we",
            "they",
            "he",
            "she",
            "my brother",
            "my parents"
          ],
          "adj": [
            "happy",
            "hungry",
            "tired",
            "late",
            "busy"
          ]
        },
        "answerKey": {
          "do-does-q": {
            "aux": {
              "__cond": "subj",
              "you": "Do",
              "we": "Do",
              "they": "Do",
              "he": "Does",
              "she": "Does",
              "my brother": "Does",
              "my sister": "Does",
              "the children": "Do"
            }
          },
          "be-q": {
            "be": {
              "__cond": "subj2",
              "I": "Am",
              "you": "Are",
              "we": "Are",
              "they": "Are",
              "he": "Is",
              "she": "Is",
              "my brother": "Is",
              "my parents": "Are"
            }
          },
          "answer-pairs": {
            "Yes, he is.": "No, he isn't.",
            "Yes, she is.": "No, she isn't.",
            "Yes, they are.": "No, they aren't.",
            "Yes, I am.": "No, I am not.",
            "Yes, I do.": "No, I don't.",
            "Yes, we do.": "No, we don't.",
            "Yes, he does.": "No, he doesn't.",
            "No, she isn't.": "Yes, she is.",
            "No, they aren't.": "Yes, they are.",
            "No, I don't.": "Yes, I do.",
            "No, she doesn't.": "Yes, she does."
          }
        },
        "distractors": [
          "Does you like apples?",
          "Do she read books?",
          "Does he likes apples?",
          "Is you happy today?",
          "Are she tired today?",
          "Do you are hungry today?"
        ],
        "irregulars": {}
      },
      "teach_vi": "Câu hỏi Yes/No là câu hỏi mà người ta trả lời bằng \"Yes\" hoặc \"No\". Có hai kiểu. (1) Với động từ thường, em đặt Do/Does lên đầu câu, rồi đến chủ ngữ, rồi đến động từ nguyên mẫu: \"Do you play football?\", \"Does she read books?\". Chọn Does khi chủ ngữ là he/she/it hoặc MỘT người; chọn Do với I/you/we/they hoặc NHIỀU người. Nhớ: sau Do/Does, động từ KHÔNG thêm \"-s\" — nói \"Does she like...\", không nói \"Does she likes...\". (2) Với động từ \"to be\", em không cần Do/Does, chỉ cần đưa am/is/are lên trước chủ ngữ: \"Is my brother happy today?\", \"Are they hungry?\", \"Am I late?\". Câu trả lời ngắn thì lặp lại đúng trợ động từ đã dùng: \"Yes, I do.\" / \"No, I don't.\" / \"Yes, she is.\" / \"No, she isn't.\""
    },
    {
      "id": "wh-questions",
      "title_vi": "Câu hỏi với từ hỏi: Who · What · Where · When · Why · How",
      "explain_vi": "Từ hỏi đứng đầu câu: người → Who, vật/việc → What, nơi → Where, lúc → When, lí do → Why, cách → How. Nhìn câu trả lời là biết phải hỏi bằng từ nào.",
      "examples": [
        "Who is your teacher? Miss Lan is my teacher.",
        "Where is Mai now? She is in the garden.",
        "How old is your brother? He is ten years old."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "wh-word-answer",
            "text": "{wh} {tail}",
            "blanks": [
              "wh"
            ],
            "context_vi": "Đọc câu trả lời ở sau: nó cho em biết phải hỏi bằng từ hỏi nào.",
            "audioText": "Who is your teacher? Miss Lan is my teacher."
          },
          {
            "id": "wh-how-family",
            "text": "{whHow} {tailHow}",
            "blanks": [
              "whHow"
            ],
            "context_vi": "Hỏi tuổi → How old; hỏi số lượng đếm được → How many; hỏi giá hoặc thứ không đếm được → How much.",
            "audioText": "How old is your brother? He is ten years old."
          }
        ],
        "slots": {
          "wh": [
            "Who",
            "What",
            "Where",
            "When",
            "Why",
            "How"
          ],
          "tail": [
            "is your teacher? Miss Lan is my teacher.",
            "is that boy? He is my brother.",
            "is in your bag? A new book is in my bag.",
            "do you want? I want a red pen.",
            "is Mai now? She is in the garden.",
            "are my shoes? They are under the bed.",
            "do you go to school? I go to school at seven o'clock.",
            "does the film start? It starts at eight o'clock.",
            "is she happy? Because she has a new bike.",
            "are you late? Because my bike is broken.",
            "do you go to school? I go to school by bike.",
            "is your mother? She is fine, thank you."
          ],
          "whHow": [
            "How old",
            "How many",
            "How much"
          ],
          "tailHow": [
            "is your brother? He is ten years old.",
            "are you? I am eleven years old.",
            "pens do you have? I have five pens.",
            "children are in your class? There are thirty children.",
            "is this book? It is fifty thousand dong.",
            "water do you drink every day? I drink two litres."
          ]
        },
        "answerKey": {
          "wh-word-answer": {
            "wh": {
              "__cond": "tail",
              "is your teacher? Miss Lan is my teacher.": "Who",
              "is that boy? He is my brother.": "Who",
              "is in your bag? A new book is in my bag.": "What",
              "do you want? I want a red pen.": "What",
              "is Mai now? She is in the garden.": "Where",
              "are my shoes? They are under the bed.": "Where",
              "do you go to school? I go to school at seven o'clock.": "When",
              "does the film start? It starts at eight o'clock.": "When",
              "is she happy? Because she has a new bike.": "Why",
              "are you late? Because my bike is broken.": "Why",
              "do you go to school? I go to school by bike.": "How",
              "is your mother? She is fine, thank you.": "How"
            }
          },
          "wh-how-family": {
            "whHow": {
              "__cond": "tailHow",
              "is your brother? He is ten years old.": "How old",
              "are you? I am eleven years old.": "How old",
              "pens do you have? I have five pens.": "How many",
              "children are in your class? There are thirty children.": "How many",
              "is this book? It is fifty thousand dong.": "How much",
              "water do you drink every day? I drink two litres.": "How much"
            }
          }
        },
        "distractors": [
          "What is your teacher? Miss Lan is my teacher.",
          "Who is in your bag? A new book is in my bag.",
          "Where do you go to school? I go to school at seven o'clock.",
          "When is she happy? Because she has a new bike.",
          "How many is your brother? He is ten years old.",
          "How old pens do you have? I have five pens."
        ],
        "irregulars": {}
      },
      "teach_vi": "Khi em muốn biết một thông tin cụ thể, em dùng TỪ HỎI đặt ở ĐẦU câu. Who hỏi về người (\"Who is your teacher?\"), What hỏi về vật hoặc việc (\"What is in your bag?\"), Where hỏi về nơi chốn (\"Where is Mai?\"), When hỏi về thời gian (\"When do you go to school?\"), Why hỏi lí do — câu trả lời thường bắt đầu bằng \"Because…\", và How hỏi về cách thức (\"How do you go to school? I go by bike.\"). Ngoài ra có nhóm \"How + từ khác\": How old (bao nhiêu tuổi), How many (bao nhiêu — với danh từ đếm được số nhiều), How much (bao nhiêu tiền, hoặc với danh từ không đếm được). Mẹo làm bài: đọc CÂU TRẢ LỜI trước, thấy nói về người thì hỏi Who, nói về chỗ thì hỏi Where, nói về giờ thì hỏi When."
    },
    {
      "id": "question-word-order",
      "title_vi": "Trật tự từ trong câu hỏi",
      "explain_vi": "Trong câu hỏi, trợ động từ (Do/Does/Is/Are) đứng TRƯỚC chủ ngữ, rồi mới đến phần còn lại. Không nói \"You do like apples?\" hay \"Where you are going?\".",
      "examples": [
        "Do you like apples?",
        "Does my sister want a new bike?",
        "Are they in the garden?"
      ],
      "generators": [
        "order_words",
        "mcq"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "wo-aux-q",
            "text": "{aux} {subj} {vp}?",
            "blanks": [],
            "context_vi": "Thứ tự: Do/Does + chủ ngữ + động từ nguyên mẫu + phần còn lại + dấu hỏi.",
            "audioText": "Do you like apples?"
          },
          {
            "id": "wo-be-q",
            "text": "{be} {subj2} {compl}?",
            "blanks": [],
            "context_vi": "Thứ tự: Is/Are + chủ ngữ + phần còn lại + dấu hỏi.",
            "audioText": "Are they in the garden?"
          }
        ],
        "slots": {
          "aux": [
            "Do",
            "Does"
          ],
          "subj": [
            "you",
            "he",
            "she",
            "they",
            "we",
            "the children"
          ],
          "vp": [
            "like apples",
            "play football",
            "read books",
            "watch TV",
            "eat rice",
            "want a new bike"
          ],
          "be": [
            "Is",
            "Are"
          ],
          "subj2": [
            "she",
            "he",
            "they",
            "you",
            "we"
          ],
          "compl": [
            "at home",
            "in the garden",
            "hungry now",
            "ready for school",
            "in the classroom"
          ]
        },
        "answerKey": {
          "wo-aux-q": {
            "aux": {
              "__cond": "subj",
              "you": "Do",
              "he": "Does",
              "she": "Does",
              "they": "Do",
              "we": "Do",
              "the children": "Do"
            }
          },
          "wo-be-q": {
            "be": {
              "__cond": "subj2",
              "she": "Is",
              "he": "Is",
              "they": "Are",
              "you": "Are",
              "we": "Are"
            }
          }
        },
        "distractors": [
          "Do like you apples?",
          "Play you football?",
          "You do watch TV?",
          "Are hungry you now?",
          "Is at home she?",
          "Where you are going?"
        ],
        "irregulars": {}
      },
      "teach_vi": "Tiếng Việt hỏi bằng cách thêm từ ở cuối câu (\"Bạn thích táo không?\"), nên nhiều bạn viết sai thành \"You like apples?\". Tiếng Anh thì phải ĐẢO trợ động từ lên trước chủ ngữ. Công thức 1: Do/Does + chủ ngữ + động từ nguyên mẫu + …? → \"Do you like apples?\", \"Does she read books?\". Công thức 2: Am/Is/Are + chủ ngữ + …? → \"Are they in the garden?\", \"Is she at home?\". Nếu câu có từ hỏi thì từ hỏi đứng trước cùng, rồi mới đến trợ động từ: \"Where are you going?\" (KHÔNG phải \"Where you are going?\"). Và đừng quên dấu hỏi \"?\" ở cuối câu."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "the-new-boy",
      "title": "The new boy",
      "title_vi": "Cậu bạn mới",
      "text": "Nam is a new boy in my class. \"Where are you from?\" I ask him. \"I am from Hue,\" he says. \"How do you go to school?\" \"I go by bike. Do you play football?\" \"Yes, I do,\" I say. Now Nam is my new friend.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Nam đến trường bằng xe đạp, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "Nam goes to school by bike."
        },
        {
          "id": "q2",
          "q_vi": "Nam đến từ thành phố nào?",
          "type": "mcq",
          "choices": [
            "Hue",
            "Ha Noi",
            "Da Nang"
          ],
          "answer": 0,
          "audioText": "Where is Nam from?"
        }
      ]
    }
  ]
};
  C["grammar3/unit17.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 417,
  "lesson": 17,
  "topic": "The passive voice: be + past participle",
  "topic_vi": "Câu bị động",
  "vocab": [
    {
      "word": "clean",
      "vi": "làm sạch, dọn",
      "icon": "🧽",
      "example": "The room is cleaned every day.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "wash",
      "vi": "rửa, giặt",
      "icon": "🧼",
      "example": "The dishes are washed after dinner.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "build",
      "vi": "xây",
      "icon": "🏗️",
      "example": "The school was built in 1990.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "make",
      "vi": "làm, chế biến",
      "icon": "🍰",
      "example": "The cake is made at home.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "find",
      "vi": "tìm thấy",
      "icon": "🔎",
      "example": "The keys were found in the garden.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "break",
      "vi": "làm vỡ, làm hỏng",
      "icon": "💥",
      "example": "The window was broken by Nam.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "write",
      "vi": "viết",
      "icon": "✍️",
      "example": "This letter was written by my sister.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "paint",
      "vi": "sơn, vẽ màu",
      "icon": "🎨",
      "example": "This window was painted by my brother.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "letter",
      "vi": "bức thư",
      "icon": "✉️",
      "example": "This letter was sent by my father.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "window",
      "vi": "cửa sổ",
      "icon": "🪟",
      "example": "The window was cleaned by my mother.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "bridge",
      "vi": "cây cầu",
      "icon": "🌉",
      "example": "The bridge was built in 2020.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "floor",
      "vi": "sàn nhà",
      "icon": "🧹",
      "example": "The floor is cleaned every day.",
      "partOfSpeech": "noun",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "present-passive",
      "title_vi": "Bị động hiện tại: is / are + V3",
      "explain_vi": "Khi không cần nói ai làm, em dùng bị động: chủ ngữ số ít → \"is\" + V3, chủ ngữ số nhiều → \"are\" + V3. Ví dụ: The room is cleaned. The windows are cleaned.",
      "examples": [
        "The room is cleaned every day.",
        "The windows are cleaned every day.",
        "The cake is made at home.",
        "The noodles are made at home."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose",
        "transform"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "pres-pass-clean",
            "text": "The {place} {be} cleaned every day.",
            "blanks": [
              "be"
            ],
            "context_vi": "Nhìn danh từ: số ít → is, số nhiều → are. Sau đó luôn là V3 \"cleaned\".",
            "audioText": "The room is cleaned every day."
          },
          {
            "id": "pres-pass-make",
            "text": "{food} {be2} made at home.",
            "blanks": [
              "be2"
            ],
            "context_vi": "Món ăn số ít đi với \"is made\", số nhiều đi với \"are made\".",
            "audioText": "The cake is made at home."
          }
        ],
        "slots": {
          "place": [
            "room",
            "kitchen",
            "classroom",
            "floor",
            "rooms",
            "windows",
            "desks",
            "tables"
          ],
          "be": [
            "is",
            "are"
          ],
          "food": [
            "The cake",
            "The bread",
            "The soup",
            "The cakes",
            "The noodles",
            "The sandwiches"
          ],
          "be2": [
            "is",
            "are"
          ]
        },
        "answerKey": {
          "pres-pass-clean": {
            "be": {
              "__cond": "place",
              "room": "is",
              "kitchen": "is",
              "classroom": "is",
              "floor": "is",
              "rooms": "are",
              "windows": "are",
              "desks": "are",
              "tables": "are"
            }
          },
          "pres-pass-make": {
            "be2": {
              "__cond": "food",
              "The cake": "is",
              "The bread": "is",
              "The soup": "is",
              "The cakes": "are",
              "The noodles": "are",
              "The sandwiches": "are"
            }
          },
          "answer-pairs": {
            "The room is cleaned every day.": "The room is not cleaned every day.",
            "The windows are cleaned every day.": "The windows are not cleaned every day.",
            "The cake is made at home.": "The cake is not made at home.",
            "The noodles are made at home.": "The noodles are not made at home.",
            "The floor is not cleaned every day.": "The floor is cleaned every day.",
            "The desks are not cleaned every day.": "The desks are cleaned every day.",
            "The bread is not made at home.": "The bread is made at home.",
            "The sandwiches are not made at home.": "The sandwiches are made at home."
          }
        },
        "distractors": [
          "The room are cleaned every day.",
          "The windows is cleaned every day.",
          "The room cleaned every day.",
          "The cake is make at home.",
          "The cakes is made at home.",
          "The bread are made at home."
        ],
        "irregulars": {}
      },
      "teach_vi": "Bình thường em nói ai làm gì: \"My mother cleans the room.\" Nhưng nhiều khi điều quan trọng là CÁI GÌ ĐƯỢC LÀM, còn ai làm thì không cần nhắc. Lúc đó em dùng câu bị động: đưa vật lên làm chủ ngữ, rồi dùng is/are + V3 (dạng thứ ba của động từ): \"The room is cleaned every day.\" Chọn is khi chủ ngữ số ít, chọn are khi chủ ngữ số nhiều: \"The window is cleaned.\" — \"The windows are cleaned.\" Hai lỗi hay gặp: (1) quên \"be\" — nói \"The room cleaned every day\" là sai; (2) quên đổi sang V3 — nói \"The cake is make at home\" là sai, phải là \"is made\". Muốn nói phủ định thì thêm \"not\" ngay sau is/are: \"The room is not cleaned every day.\""
    },
    {
      "id": "past-passive",
      "title_vi": "Bị động quá khứ: was / were + V3",
      "explain_vi": "Việc đã xảy ra rồi thì dùng \"was\" + V3 với chủ ngữ số ít và \"were\" + V3 với chủ ngữ số nhiều: The school was built. The houses were built.",
      "examples": [
        "The school was built in 1990.",
        "The houses were built in 2020.",
        "The keys were found in the garden.",
        "The ball was found in the garden."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "past-pass-build",
            "text": "The {building} {beP} built in 2020.",
            "blanks": [
              "beP"
            ],
            "context_vi": "Chuyện đã xong: số ít → was built, số nhiều → were built.",
            "audioText": "The school was built in 2020."
          },
          {
            "id": "past-pass-find",
            "text": "The {lost} {beP2} found in the garden.",
            "blanks": [
              "beP2"
            ],
            "context_vi": "Nhìn danh từ số ít hay số nhiều để chọn was hay were, sau đó là V3 \"found\".",
            "audioText": "The keys were found in the garden."
          }
        ],
        "slots": {
          "building": [
            "school",
            "house",
            "bridge",
            "library",
            "houses",
            "shops",
            "bridges"
          ],
          "beP": [
            "was",
            "were"
          ],
          "lost": [
            "ball",
            "key",
            "kite",
            "pen",
            "keys",
            "toys",
            "books"
          ],
          "beP2": [
            "was",
            "were"
          ]
        },
        "answerKey": {
          "past-pass-build": {
            "beP": {
              "__cond": "building",
              "school": "was",
              "house": "was",
              "bridge": "was",
              "library": "was",
              "houses": "were",
              "shops": "were",
              "bridges": "were"
            }
          },
          "past-pass-find": {
            "beP2": {
              "__cond": "lost",
              "ball": "was",
              "key": "was",
              "kite": "was",
              "pen": "was",
              "keys": "were",
              "toys": "were",
              "books": "were"
            }
          }
        },
        "distractors": [
          "The school were built in 2020.",
          "The houses was built in 2020.",
          "The school was build in 2020.",
          "The keys was found in the garden.",
          "The ball were found in the garden.",
          "The toys were find in the garden."
        ],
        "irregulars": {}
      },
      "teach_vi": "Khi việc đã xảy ra trong quá khứ, câu bị động dùng was/were + V3. Chọn \"was\" cho chủ ngữ số ít (\"The bridge was built in 2020.\") và \"were\" cho chủ ngữ số nhiều (\"The houses were built in 2020.\"). Cách nhớ: was/were chính là dạng quá khứ của is/are, nên em chỉ cần đổi is → was, are → were, phần V3 giữ nguyên. Nhớ giữ đúng V3: build → built, find → found, break → broken, write → written. Nói \"The school was build\" là sai vì \"build\" chưa phải V3."
    },
    {
      "id": "by-agent",
      "title_vi": "Nói ai làm việc đó: \"by + người\"",
      "explain_vi": "Muốn nói rõ AI làm việc đó, em thêm \"by + người\" ở cuối câu bị động: This window was broken by Nam. Động từ vẫn phải ở dạng V3.",
      "examples": [
        "My mother cleaned this window. This window was cleaned by my mother.",
        "Nam broke this window. This window was broken by Nam.",
        "My sister wrote this letter. This letter was written by my sister."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "by-letter",
            "text": "{doer} {vPastL} this letter. This letter was {v3L} by {agent}.",
            "blanks": [
              "v3L",
              "agent"
            ],
            "context_vi": "Câu đầu cho biết ai làm và làm gì. Câu bị động dùng V3 rồi thêm \"by + người đó\".",
            "audioText": "My sister wrote this letter. This letter was written by my sister."
          },
          {
            "id": "by-window",
            "text": "{doer} {vPastW} this window. This window was {v3W} by {agent}.",
            "blanks": [
              "v3W",
              "agent"
            ],
            "context_vi": "Đổi động từ ở câu đầu sang dạng V3, rồi cho người làm đứng sau \"by\".",
            "audioText": "Nam broke this window. This window was broken by Nam."
          }
        ],
        "slots": {
          "doer": [
            "My mother",
            "My father",
            "My sister",
            "My brother",
            "Miss Lan",
            "Nam",
            "Minh"
          ],
          "agent": [
            "my mother",
            "my father",
            "my sister",
            "my brother",
            "Miss Lan",
            "Nam",
            "Minh"
          ],
          "vPastL": [
            "wrote",
            "found",
            "sent"
          ],
          "v3L": [
            "written",
            "found",
            "sent"
          ],
          "vPastW": [
            "broke",
            "cleaned",
            "painted"
          ],
          "v3W": [
            "broken",
            "cleaned",
            "painted"
          ]
        },
        "answerKey": {
          "by-letter": {
            "v3L": {
              "__cond": "vPastL",
              "wrote": "written",
              "found": "found",
              "sent": "sent"
            },
            "agent": {
              "__cond": "doer",
              "My mother": "my mother",
              "My father": "my father",
              "My sister": "my sister",
              "My brother": "my brother",
              "Miss Lan": "Miss Lan",
              "Nam": "Nam",
              "Minh": "Minh"
            }
          },
          "by-window": {
            "v3W": {
              "__cond": "vPastW",
              "broke": "broken",
              "cleaned": "cleaned",
              "painted": "painted"
            },
            "agent": {
              "__cond": "doer",
              "My mother": "my mother",
              "My father": "my father",
              "My sister": "my sister",
              "My brother": "my brother",
              "Miss Lan": "Miss Lan",
              "Nam": "Nam",
              "Minh": "Minh"
            }
          }
        },
        "distractors": [
          "Nam broke this window. This window was broke by Nam.",
          "Nam broke this window. This window was broken from Nam.",
          "My sister wrote this letter. This letter was write by my sister.",
          "My sister wrote this letter. This letter was written from my sister.",
          "My mother cleaned this window. This window cleaned by my mother.",
          "My father sent this letter. This letter was send by my father."
        ],
        "irregulars": {
          "write": "written",
          "break": "broken",
          "find": "found",
          "send": "sent",
          "build": "built",
          "make": "made"
        }
      },
      "teach_vi": "Câu bị động thường không nhắc ai làm, nhưng nếu người làm là thông tin quan trọng thì em thêm \"by + người\" vào cuối câu: \"This window was broken by Nam.\" Cách đổi từ câu chủ động sang bị động: lấy tân ngữ (vật bị tác động) lên làm chủ ngữ → thêm was/were (hoặc is/are) → đổi động từ sang V3 → cuối cùng thêm \"by\" và người làm. Ví dụ: \"My sister wrote this letter.\" → \"This letter was written by my sister.\" Hai lỗi hay gặp: dùng \"from\" thay cho \"by\" (sai), và quên đổi sang V3 — nói \"was broke\" thay vì \"was broken\" (sai). Nhớ vài V3 bất quy tắc: write → written, break → broken, find → found, send → sent."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "our-old-school",
      "title": "Our old school",
      "title_vi": "Ngôi trường cũ của chúng em",
      "text": "Our school is old. It was built in 1990. Every morning the classrooms are cleaned by two workers. Last week a new tree was planted in the garden. The tree was given to our school by Miss Lan's family. Now our garden is very beautiful.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Trường được xây năm 1990, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "The school was built in 1990."
        },
        {
          "id": "q2",
          "q_vi": "Ai tặng cây mới cho trường?",
          "type": "mcq",
          "choices": [
            "Miss Lan's family",
            "Two workers",
            "The children of class 5"
          ],
          "answer": 0,
          "audioText": "Who gave the new tree to the school?"
        }
      ]
    }
  ]
};
  C["grammar3/unit18.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 418,
  "lesson": 18,
  "topic": "Infinitive, -ing form and too / enough",
  "topic_vi": "To V · V-ing · too/enough",
  "vocab": [
    {
      "word": "want",
      "vi": "muốn",
      "icon": "🙋",
      "example": "I want to read a new book.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "need",
      "vi": "cần",
      "icon": "🆘",
      "example": "My hands are dirty. I need to wash them.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "enjoy",
      "vi": "thích thú, thấy vui khi làm",
      "icon": "😊",
      "example": "I enjoy riding my bike every day.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "swim",
      "vi": "bơi",
      "icon": "🏊",
      "example": "I like swimming in the sea.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "draw",
      "vi": "vẽ",
      "icon": "🎨",
      "example": "My sister likes drawing pictures.",
      "partOfSpeech": "verb",
      "audio": ""
    },
    {
      "word": "heavy",
      "vi": "nặng",
      "icon": "🪨",
      "example": "This box is too heavy for me.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "light",
      "vi": "nhẹ",
      "icon": "🎈",
      "example": "This bag is light enough for a child.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "hot",
      "vi": "nóng",
      "icon": "☕",
      "example": "The tea is too hot to drink.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "high",
      "vi": "cao",
      "icon": "🗄️",
      "example": "The shelf is too high for me.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "money",
      "vi": "tiền",
      "icon": "💰",
      "example": "I have enough money to buy this book.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "egg",
      "vi": "quả trứng",
      "icon": "🥚",
      "example": "I need six eggs to make a cake.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "guitar",
      "vi": "đàn ghi-ta",
      "icon": "🎸",
      "example": "I enjoy playing the guitar.",
      "partOfSpeech": "noun",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "want-to-v",
      "title_vi": "want / need + to + động từ",
      "explain_vi": "Sau \"want\" và \"need\" phải có \"to\" rồi mới đến động từ nguyên mẫu: I want to read. Không nói \"I want read\" hay \"I want reading\".",
      "examples": [
        "I love books. I want to read now.",
        "I am very hungry. I need to eat something.",
        "My hands are dirty. I need to wash them."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "want-to-clue",
            "text": "I love {hobby}. I want {toV} now.",
            "blanks": [
              "toV"
            ],
            "context_vi": "Câu đầu cho biết em thích gì. Sau \"want\" nhớ có \"to\" + động từ nguyên mẫu.",
            "audioText": "I love books. I want to read now."
          },
          {
            "id": "need-to-clue",
            "text": "{problem} I need {toV2}.",
            "blanks": [
              "toV2"
            ],
            "context_vi": "Đọc vấn đề ở câu đầu để biết cần làm gì. Sau \"need\" cũng phải có \"to\".",
            "audioText": "My hands are dirty. I need to wash them."
          }
        ],
        "slots": {
          "hobby": [
            "books",
            "football",
            "music",
            "cakes",
            "the sea",
            "pictures"
          ],
          "toV": [
            "to read",
            "to play football",
            "to listen to music",
            "to eat a cake",
            "to swim",
            "to draw"
          ],
          "problem": [
            "My hands are dirty.",
            "I am very hungry.",
            "I am very tired.",
            "My room is dirty.",
            "My hair is too long."
          ],
          "toV2": [
            "to wash them",
            "to eat something",
            "to sleep",
            "to clean it",
            "to cut it"
          ]
        },
        "answerKey": {
          "want-to-clue": {
            "toV": {
              "__cond": "hobby",
              "books": "to read",
              "football": "to play football",
              "music": "to listen to music",
              "cakes": "to eat a cake",
              "the sea": "to swim",
              "pictures": "to draw"
            }
          },
          "need-to-clue": {
            "toV2": {
              "__cond": "problem",
              "My hands are dirty.": "to wash them",
              "I am very hungry.": "to eat something",
              "I am very tired.": "to sleep",
              "My room is dirty.": "to clean it",
              "My hair is too long.": "to cut it"
            }
          }
        },
        "distractors": [
          "I love books. I want read now.",
          "I love books. I want reading now.",
          "I love football. I want to playing football now.",
          "I am very hungry. I need eat something.",
          "I am very tired. I need to sleeping.",
          "My room is dirty. I need clean it."
        ],
        "irregulars": {}
      },
      "teach_vi": "Có những động từ mà sau nó phải dùng \"to + động từ nguyên mẫu\". Hai từ em gặp nhiều nhất là want (muốn) và need (cần): \"I want to read a book.\", \"I need to wash my hands.\" Người Việt hay dịch từng chữ nên viết thành \"I want read\" (thiếu \"to\") hoặc \"I want reading\" (dùng sai dạng) — cả hai đều sai. Cùng nhóm này còn có: would like to, hope to, try to, decide to. Nếu câu có chủ ngữ khác thì chỉ đổi want/need cho khớp chủ ngữ, phần \"to + V\" giữ nguyên: \"She wants to read.\", \"They want to read.\""
    },
    {
      "id": "like-ving",
      "title_vi": "like / enjoy + động từ thêm -ing",
      "explain_vi": "Sau \"like\", \"love\" và \"enjoy\" thì động từ thêm \"-ing\": I like swimming. Không nói \"I like to swimming\" hay \"I enjoy swim\".",
      "examples": [
        "I have a new bike. I enjoy riding it every day.",
        "I am at the swimming pool. I like swimming here.",
        "I have many books. I enjoy reading them every day."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "enjoy-ving-thing",
            "text": "I have {thing}. I enjoy {ving} every day.",
            "blanks": [
              "ving"
            ],
            "context_vi": "Câu đầu cho biết em có gì. Sau \"enjoy\", động từ luôn thêm \"-ing\".",
            "audioText": "I have a new bike. I enjoy riding it every day."
          },
          {
            "id": "like-ving-place",
            "text": "{place} I like {ving4} here.",
            "blanks": [
              "ving4"
            ],
            "context_vi": "Nơi em đang ở cho biết em làm gì. Sau \"like\", động từ thêm \"-ing\".",
            "audioText": "I am at the swimming pool. I like swimming here."
          }
        ],
        "slots": {
          "thing": [
            "a new bike",
            "many books",
            "a football",
            "a guitar",
            "a camera",
            "a big garden"
          ],
          "ving": [
            "riding it",
            "reading them",
            "playing football",
            "playing it",
            "taking photos",
            "planting flowers"
          ],
          "place": [
            "I am at the swimming pool.",
            "I am in the library.",
            "I am in the kitchen with my mother.",
            "I am in the music room.",
            "I am on the football field.",
            "I am in the art room."
          ],
          "ving4": [
            "swimming",
            "reading books",
            "cooking",
            "singing",
            "playing football",
            "drawing"
          ]
        },
        "answerKey": {
          "enjoy-ving-thing": {
            "ving": {
              "__cond": "thing",
              "a new bike": "riding it",
              "many books": "reading them",
              "a football": "playing football",
              "a guitar": "playing it",
              "a camera": "taking photos",
              "a big garden": "planting flowers"
            }
          },
          "like-ving-place": {
            "ving4": {
              "__cond": "place",
              "I am at the swimming pool.": "swimming",
              "I am in the library.": "reading books",
              "I am in the kitchen with my mother.": "cooking",
              "I am in the music room.": "singing",
              "I am on the football field.": "playing football",
              "I am in the art room.": "drawing"
            }
          }
        },
        "distractors": [
          "I have a new bike. I enjoy to ride it every day.",
          "I have many books. I enjoy read them every day.",
          "I am at the swimming pool. I like to swimming here.",
          "I am in the library. I like read books here.",
          "I have a camera. I enjoy to taking photos every day.",
          "I am in the art room. I like to drawing here."
        ],
        "irregulars": {}
      },
      "teach_vi": "Nhóm động từ nói về SỞ THÍCH — like, love, enjoy, hate — thì động từ đi sau phải thêm \"-ing\": \"I like swimming.\", \"I enjoy reading books.\", \"She loves drawing.\" Riêng \"enjoy\" thì BẮT BUỘC dùng \"-ing\", không bao giờ dùng \"to\": nói \"I enjoy to swim\" là sai. Quy tắc thêm \"-ing\": thường chỉ thêm \"-ing\" (read → reading); nếu từ kết thúc bằng \"e\" thì bỏ \"e\" (ride → riding, take → taking); nếu là một âm và kết thúc bằng nguyên âm + phụ âm thì gấp đôi phụ âm (swim → swimming, run → running). Lỗi hay gặp nhất của người Việt là trộn hai kiểu lại: \"I like to swimming\" — sai, phải chọn một là \"I like swimming\" hoặc \"I like to swim\"."
    },
    {
      "id": "too-enough",
      "title_vi": "too (quá) và enough (đủ)",
      "explain_vi": "\"too\" đứng TRƯỚC tính từ và mang nghĩa quá mức nên KHÔNG làm được: too heavy. \"enough\" đứng SAU tính từ và nghĩa là đủ để làm được: light enough.",
      "examples": [
        "I can't lift this box. It is too heavy.",
        "I can lift this box. It is light enough.",
        "I need six eggs to make a cake. I have four eggs. That is not enough."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "too-or-enough",
            "text": "{res} It is {te}.",
            "blanks": [
              "te"
            ],
            "context_vi": "KHÔNG làm được → too + tính từ. LÀM ĐƯỢC → tính từ + enough.",
            "audioText": "I can't lift this box. It is too heavy."
          },
          {
            "id": "enough-eggs",
            "text": "I need six eggs to make a cake. I have {num} eggs. That is {teB}.",
            "blanks": [
              "teB"
            ],
            "context_vi": "So số trứng em có với số trứng em cần: bằng hoặc nhiều hơn → enough; ít hơn → not enough.",
            "audioText": "I need six eggs to make a cake. I have four eggs. That is not enough."
          }
        ],
        "slots": {
          "res": [
            "I can't lift this box.",
            "I can lift this box.",
            "I can't drink this tea.",
            "I can drink this tea.",
            "I can't reach the shelf.",
            "I can reach the shelf."
          ],
          "te": [
            "too heavy",
            "light enough",
            "too hot",
            "cool enough",
            "too high",
            "low enough"
          ],
          "num": [
            "ten",
            "eight",
            "six",
            "four",
            "three",
            "two"
          ],
          "teB": [
            "enough",
            "not enough"
          ]
        },
        "answerKey": {
          "too-or-enough": {
            "te": {
              "__cond": "res",
              "I can't lift this box.": "too heavy",
              "I can lift this box.": "light enough",
              "I can't drink this tea.": "too hot",
              "I can drink this tea.": "cool enough",
              "I can't reach the shelf.": "too high",
              "I can reach the shelf.": "low enough"
            }
          },
          "enough-eggs": {
            "teB": {
              "__cond": "num",
              "ten": "enough",
              "eight": "enough",
              "six": "enough",
              "four": "not enough",
              "three": "not enough",
              "two": "not enough"
            }
          }
        },
        "distractors": [
          "I can't lift this box. It is enough heavy.",
          "I can lift this box. It is enough light.",
          "I can't drink this tea. It is hot too.",
          "I can reach the shelf. It is enough low.",
          "I need six eggs to make a cake. I have four eggs. That is enough not.",
          "I can't lift this box. It is too heavy enough."
        ],
        "irregulars": {}
      },
      "teach_vi": "Hai từ này nói về mức độ nhưng đứng ở hai chỗ khác nhau. \"too\" nghĩa là QUÁ (quá mức nên không làm được) và đứng TRƯỚC tính từ: \"The box is too heavy. I can't lift it.\", \"The tea is too hot to drink.\" Còn \"enough\" nghĩa là ĐỦ (đủ nên làm được) và đứng SAU tính từ: \"The box is light enough. I can lift it.\", \"He is tall enough to reach the shelf.\" Lưu ý vị trí — nói \"enough heavy\" là sai, phải là \"heavy enough\". Khi \"enough\" đi với DANH TỪ thì nó lại đứng TRƯỚC danh từ: \"I have enough money.\", \"I don't have enough eggs.\" Muốn nói thiếu thì dùng \"not enough\": \"Four eggs is not enough.\""
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "mai-makes-a-cake",
      "title": "Mai makes a cake",
      "title_vi": "Mai làm bánh",
      "text": "Mai wants to be a cook one day. She enjoys making cakes with her mother. Today she needs six eggs, but she has only two. That is not enough. \"Don't worry,\" says her mother. \"The shop is not too far. We can walk there together.\"",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Mai đã có đủ sáu quả trứng, đúng không?",
          "type": "truefalse",
          "answer": false,
          "audioText": "Mai has only two eggs. That is not enough."
        },
        {
          "id": "q2",
          "q_vi": "Mai thích làm việc gì cùng mẹ?",
          "type": "mcq",
          "choices": [
            "making cakes",
            "playing football",
            "reading books"
          ],
          "answer": 0,
          "audioText": "What does Mai enjoy doing with her mother?"
        }
      ]
    }
  ]
};
  C["grammar3/unit19.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 419,
  "lesson": 19,
  "topic": "Relative pronouns: who, which, whose",
  "topic_vi": "Đại từ quan hệ",
  "vocab": [
    {
      "word": "who",
      "vi": "người mà (dùng cho NGƯỜI)",
      "icon": "🙋",
      "example": "The man who helped me is my uncle.",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "which",
      "vi": "cái mà (dùng cho VẬT, CON VẬT)",
      "icon": "📦",
      "example": "The box which is red is mine.",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "whose",
      "vi": "của người mà (chỉ sự sở hữu)",
      "icon": "🔑",
      "example": "I know a girl whose bike is new.",
      "partOfSpeech": "pronoun",
      "audio": ""
    },
    {
      "word": "neighbour",
      "vi": "người láng giềng",
      "icon": "🏘️",
      "example": "My neighbour has a big dog.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "doctor",
      "vi": "bác sĩ",
      "icon": "👩‍⚕️",
      "example": "The doctor who helped me was very kind.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "nurse",
      "vi": "điều dưỡng, y sĩ",
      "icon": "🧑‍⚕️",
      "example": "I know a nurse who works at night.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "robot",
      "vi": "người máy",
      "icon": "🤖",
      "example": "This is the robot which cleans our house.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "photo",
      "vi": "bức ảnh",
      "icon": "📷",
      "example": "Look at the photo which is on the wall.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "kite",
      "vi": "con diều",
      "icon": "🪁",
      "example": "The kite which we made is very big.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "guitar",
      "vi": "đàn ghi-ta",
      "icon": "🎸",
      "example": "I know a girl who plays the guitar.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "clock",
      "vi": "cái đồng hồ",
      "icon": "⏰",
      "example": "The clock which is on the wall is new.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "race",
      "vi": "cuộc thi chạy",
      "icon": "🏁",
      "example": "I saw the boy who won the race.",
      "partOfSpeech": "noun",
      "audio": ""
    },
    {
      "word": "famous",
      "vi": "nổi tiếng",
      "icon": "⭐",
      "example": "I know a boy whose father is famous.",
      "partOfSpeech": "adj",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "who-person",
      "title_vi": "\"who\" — nối lại khi nói về NGƯỜI",
      "explain_vi": "Nói thêm về một NGƯỜI thì dùng \"who\"; nói thêm về con vật hay đồ vật thì dùng \"which\". Hãy nhìn danh từ đứng ngay TRƯỚC chỗ trống để chọn.",
      "examples": [
        "This is the woman who helped me yesterday.",
        "This is the dog which helped me yesterday.",
        "I saw the boy who won the race last week."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "person-helped",
            "text": "This is the {being} {rel} helped me yesterday.",
            "blanks": [
              "rel"
            ],
            "context_vi": "Nhìn danh từ ngay trước chỗ trống: người → who, con vật hay đồ vật → which",
            "audioText": "This is the woman who helped me yesterday."
          },
          {
            "id": "person-won-race",
            "text": "I saw the {being} {rel} won the race last week.",
            "blanks": [
              "rel"
            ],
            "context_vi": "Bài này chỉ dùng who hoặc which; người → who, con vật hay đồ vật → which",
            "audioText": "I saw the boy who won the race last week."
          }
        ],
        "slots": {
          "being": [
            "man",
            "woman",
            "boy",
            "girl",
            "teacher",
            "nurse",
            "dog",
            "robot"
          ],
          "rel": [
            "who",
            "which"
          ]
        },
        "answerKey": {
          "person-helped": {
            "rel": {
              "__cond": "being",
              "man": "who",
              "woman": "who",
              "boy": "who",
              "girl": "who",
              "teacher": "who",
              "nurse": "who",
              "dog": "which",
              "robot": "which"
            }
          },
          "person-won-race": {
            "rel": {
              "__cond": "being",
              "man": "who",
              "woman": "who",
              "boy": "who",
              "girl": "who",
              "teacher": "who",
              "nurse": "who",
              "dog": "which",
              "robot": "which"
            }
          }
        },
        "distractors": [
          "This is the man which helped me yesterday.",
          "This is the teacher which helped me yesterday.",
          "I saw the girl which won the race last week.",
          "I saw the nurse which won the race last week.",
          "This is the woman who she helped me yesterday.",
          "I saw the boy who he won the race last week."
        ],
        "irregulars": {}
      },
      "teach_vi": "Khi em muốn nói thêm về một người hay một vật mà không phải bắt đầu câu mới, em dùng đại từ quan hệ để NỐI hai câu lại. Ví dụ: \"This is the woman.\" + \"She helped me.\" → \"This is the woman who helped me.\" Cách chọn rất dễ: danh từ đứng ngay TRƯỚC chỗ nối là NGƯỜI thì dùng \"who\" (the boy who won the race), là CON VẬT hay ĐỒ VẬT thì dùng \"which\" (the dog which won the race). Đại từ quan hệ luôn đứng NGAY SAU danh từ nó nhắc lại, và nó đã thay cho \"he / she / it\" rồi nên em KHÔNG viết thêm chủ ngữ nữa: nói \"the woman who helped me\", không nói \"the woman who she helped me\". (Người lớn còn dùng \"that\" thay cho who/which, nhưng bài này em chỉ luyện who và which cho thật chắc.)"
    },
    {
      "id": "which-thing",
      "title_vi": "\"which\" — nối lại khi nói về ĐỒ VẬT",
      "explain_vi": "Danh từ trước chỗ trống là đồ vật → dùng \"which\"; là người → dùng \"who\". Đại từ quan hệ luôn đứng ngay sau danh từ mà nó nhắc lại.",
      "examples": [
        "The bike which I saw at the shop was very nice.",
        "The woman who I saw at the shop was very nice.",
        "Look at the cake which is in this photo."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "thing-at-shop",
            "text": "The {item} {rel2} I saw at the shop was very nice.",
            "blanks": [
              "rel2"
            ],
            "context_vi": "Đồ vật → which, người → who. Nhìn danh từ ngay trước chỗ trống",
            "audioText": "The bike which I saw at the shop was very nice."
          },
          {
            "id": "thing-in-photo",
            "text": "Look at the {item} {rel2} is in this photo.",
            "blanks": [
              "rel2"
            ],
            "context_vi": "Chọn which cho đồ vật, who cho người; chỉ dùng hai từ này",
            "audioText": "Look at the cake which is in this photo."
          }
        ],
        "slots": {
          "item": [
            "bike",
            "kite",
            "dress",
            "cake",
            "clock",
            "hat",
            "man",
            "woman",
            "girl"
          ],
          "rel2": [
            "which",
            "who"
          ]
        },
        "answerKey": {
          "thing-at-shop": {
            "rel2": {
              "__cond": "item",
              "bike": "which",
              "kite": "which",
              "dress": "which",
              "cake": "which",
              "clock": "which",
              "hat": "which",
              "man": "who",
              "woman": "who",
              "girl": "who"
            }
          },
          "thing-in-photo": {
            "rel2": {
              "__cond": "item",
              "bike": "which",
              "kite": "which",
              "dress": "which",
              "cake": "which",
              "clock": "which",
              "hat": "which",
              "man": "who",
              "woman": "who",
              "girl": "who"
            }
          }
        },
        "distractors": [
          "The bike who I saw at the shop was very nice.",
          "The clock who I saw at the shop was very nice.",
          "Look at the kite who is in this photo.",
          "Look at the hat who is in this photo.",
          "The dress which I saw it at the shop was very nice.",
          "Look at the girl who she is in this photo."
        ],
        "irregulars": {}
      },
      "teach_vi": "\"which\" dùng để nói thêm về ĐỒ VẬT hoặc CON VẬT: \"The kite which we made is very big.\" Còn với NGƯỜI thì em đổi sang \"who\": \"The girl who made this kite is my sister.\" Hai lỗi các bạn hay mắc: (1) dùng \"who\" cho đồ vật — sai: \"the bike who I saw\", đúng: \"the bike which I saw\"; (2) viết thêm \"it / he / she\" sau đại từ quan hệ — sai: \"the dress which I saw it\", đúng: \"the dress which I saw\", vì \"which\" đã thay cho \"it\" rồi. Mẹo nhỏ: chỉ tay vào danh từ ngay trước chỗ trống rồi tự hỏi \"cái này là người hay là vật?\" — có câu trả lời là chọn được ngay."
    },
    {
      "id": "whose-possession",
      "title_vi": "\"whose\" — nói cái đó CỦA AI",
      "explain_vi": "Sau \"whose\" là một DANH TỪ vì nó nói về cái thuộc về ai (a boy whose father...). Sau \"who\" là một ĐỘNG TỪ (a boy who plays...). Nhìn chữ ngay sau chỗ trống.",
      "examples": [
        "I know a boy whose father is famous.",
        "I know a girl whose sister is famous.",
        "I know a girl who plays the guitar very well."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "whose-family-famous",
            "text": "I know a {person} {rel3} {family} is famous.",
            "blanks": [
              "rel3"
            ],
            "context_vi": "Ngay sau chỗ trống là một DANH TỪ chỉ người trong gia đình, nên đây là câu nói về sở hữu",
            "audioText": "I know a boy whose father is famous."
          },
          {
            "id": "who-does-talent",
            "text": "I know a {person} {rel3} {talent}.",
            "blanks": [
              "rel3"
            ],
            "context_vi": "Ngay sau chỗ trống là một ĐỘNG TỪ chỉ việc bạn ấy làm, không phải danh từ sở hữu",
            "audioText": "I know a girl who plays the guitar very well."
          }
        ],
        "slots": {
          "person": [
            "boy",
            "girl",
            "man",
            "woman",
            "student",
            "teacher"
          ],
          "family": [
            "father",
            "mother",
            "brother",
            "sister",
            "uncle",
            "aunt"
          ],
          "talent": [
            "plays the guitar very well",
            "draws beautiful pictures",
            "swims every morning",
            "sings in our school band"
          ],
          "rel3": [
            "whose",
            "who",
            "which"
          ]
        },
        "answerKey": {
          "whose-family-famous": {
            "rel3": {
              "__cond": "family",
              "father": "whose",
              "mother": "whose",
              "brother": "whose",
              "sister": "whose",
              "uncle": "whose",
              "aunt": "whose"
            }
          },
          "who-does-talent": {
            "rel3": {
              "__cond": "talent",
              "plays the guitar very well": "who",
              "draws beautiful pictures": "who",
              "swims every morning": "who",
              "sings in our school band": "who"
            }
          }
        },
        "distractors": [
          "I know a boy who father is famous.",
          "I know a girl who mother is famous.",
          "I know a man which uncle is famous.",
          "I know a boy whose plays the guitar very well.",
          "I know a girl whose sings in our school band.",
          "I know a boy whose his father is famous."
        ],
        "irregulars": {}
      },
      "teach_vi": "\"whose\" nghĩa là \"của người ấy\". Em dùng nó khi muốn nói một thứ THUỘC VỀ ai: \"I know a girl. Her bike is new.\" → \"I know a girl whose bike is new.\" Dấu hiệu nhận ra rất rõ: ngay sau \"whose\" luôn là một DANH TỪ (whose father, whose bike, whose dog), còn ngay sau \"who\" luôn là một ĐỘNG TỪ (who swims, who plays, who won). Vì \"whose\" đã mang nghĩa sở hữu nên em KHÔNG viết thêm his / her nữa: nói \"a boy whose father is famous\", không nói \"a boy whose his father is famous\". Và đừng dùng \"who\" thay cho \"whose\": \"a boy who father is famous\" là sai."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "the-people-i-know",
      "title": "The people I know",
      "title_vi": "Những người mà em biết",
      "text": "The woman who lives next door is a doctor. She has a big dog which barks every morning. My best friend is a boy whose father works at the same hospital. He has a new kite which we fly in the park on Sunday. The photo which is on my desk shows all of us together.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Người phụ nữ ở nhà bên cạnh là bác sĩ, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "The woman who lives next door is a doctor."
        },
        {
          "id": "q2",
          "q_vi": "Con chó làm gì mỗi buổi sáng?",
          "type": "mcq",
          "choices": [
            "It barks every morning.",
            "It flies the kite every morning.",
            "It sleeps in the park every morning."
          ],
          "answer": 0,
          "audioText": "What does the dog do every morning?"
        }
      ]
    }
  ]
};
  C["grammar3/unit20.json"] = {
  "schemaVersion": "v1",
  "track": "grammar3",
  "level": 3,
  "unit": 420,
  "lesson": 20,
  "topic": "Adjectives, adverbs and comparisons",
  "topic_vi": "Tính từ · trạng từ · so sánh",
  "vocab": [
    {
      "word": "quick",
      "vi": "nhanh (tính từ)",
      "icon": "⚡",
      "example": "My brother is a quick runner.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "quickly",
      "vi": "một cách nhanh nhẹn (trạng từ)",
      "icon": "🏃",
      "example": "He runs quickly.",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "careful",
      "vi": "cẩn thận (tính từ)",
      "icon": "🧐",
      "example": "Lan is a careful writer.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "carefully",
      "vi": "một cách cẩn thận (trạng từ)",
      "icon": "✍️",
      "example": "She writes carefully.",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "good",
      "vi": "tốt, giỏi (tính từ)",
      "icon": "👍",
      "example": "This drawing is good.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "well",
      "vi": "một cách giỏi (trạng từ của good)",
      "icon": "🎶",
      "example": "My sister sings well.",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "fast",
      "vi": "nhanh (tính từ và trạng từ viết giống nhau)",
      "icon": "🚀",
      "example": "Nam runs fast.",
      "partOfSpeech": "adj/adverb",
      "audio": ""
    },
    {
      "word": "badly",
      "vi": "một cách tệ (trạng từ của bad)",
      "icon": "😖",
      "example": "Our team played badly last week.",
      "partOfSpeech": "adverb",
      "audio": ""
    },
    {
      "word": "better",
      "vi": "tốt hơn (so sánh hơn của good)",
      "icon": "⬆️",
      "example": "Tomorrow will be better than today.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "worse",
      "vi": "tệ hơn (so sánh hơn của bad)",
      "icon": "⬇️",
      "example": "My old bike is worse than my new one.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "the best",
      "vi": "tốt nhất, giỏi nhất",
      "icon": "🏆",
      "example": "Nam is the best player in our class.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "the worst",
      "vi": "tệ nhất",
      "icon": "💥",
      "example": "That was the worst test of the year.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "windy",
      "vi": "có nhiều gió",
      "icon": "🌬️",
      "example": "Today is windy.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "funny",
      "vi": "hài, vui nhộn",
      "icon": "😂",
      "example": "This book is funny.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "heavy",
      "vi": "nặng",
      "icon": "🧱",
      "example": "My school bag is heavy.",
      "partOfSpeech": "adj",
      "audio": ""
    },
    {
      "word": "as … as",
      "vi": "bằng … như (so sánh bằng)",
      "icon": "⚖️",
      "example": "This pen is as long as that pen.",
      "partOfSpeech": "phrase",
      "audio": ""
    }
  ],
  "grammar": [
    {
      "id": "adj-vs-adverb",
      "title_vi": "Tính từ hay trạng từ: quick ↔ quickly · good ↔ well",
      "explain_vi": "Tính từ tả người hay vật và đi sau \"be\" (is quick). Trạng từ tả hành động và đi sau động từ thường (runs quickly). Nhớ hai từ lạ: good → well, fast → fast.",
      "examples": [
        "My brother is a quick runner. He runs quickly.",
        "My brother is a fast runner. He runs fast.",
        "My sister sings well. Her voice is very good."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "runner-adv",
            "text": "My brother is a {adj} runner. He runs {adv}.",
            "blanks": [
              "adv"
            ],
            "context_vi": "Chỗ trống đứng sau động từ thường \"runs\", nên cần TRẠNG TỪ của tính từ ở câu trước",
            "audioText": "My brother is a quick runner. He runs quickly."
          },
          {
            "id": "singer-adj",
            "text": "My sister sings {adv2}. Her voice is very {adj2}.",
            "blanks": [
              "adj2"
            ],
            "context_vi": "Chỗ trống đứng sau \"is\", nên cần TÍNH TỪ ứng với trạng từ ở câu trước",
            "audioText": "My sister sings well. Her voice is very good."
          }
        ],
        "slots": {
          "adj": [
            "quick",
            "slow",
            "careful",
            "good",
            "bad",
            "fast"
          ],
          "adv": [
            "quickly",
            "slowly",
            "carefully",
            "well",
            "badly",
            "fast"
          ],
          "adv2": [
            "well",
            "sadly",
            "beautifully",
            "quietly",
            "loudly"
          ],
          "adj2": [
            "good",
            "sad",
            "beautiful",
            "quiet",
            "loud"
          ]
        },
        "answerKey": {
          "runner-adv": {
            "adv": {
              "__cond": "adj",
              "quick": "quickly",
              "slow": "slowly",
              "careful": "carefully",
              "good": "well",
              "bad": "badly",
              "fast": "fast"
            }
          },
          "singer-adj": {
            "adj2": {
              "__cond": "adv2",
              "well": "good",
              "sadly": "sad",
              "beautifully": "beautiful",
              "quietly": "quiet",
              "loudly": "loud"
            }
          }
        },
        "distractors": [
          "My brother is a quick runner. He runs quick.",
          "My brother is a good runner. He runs good.",
          "My brother is a fast runner. He runs fastly.",
          "My sister sings good. Her voice is very good.",
          "My sister sings beautifully. Her voice is very beautifully.",
          "My sister sings quiet. Her voice is very quietly."
        ],
        "irregulars": {
          "good": "well",
          "bad": "badly",
          "fast": "fast"
        }
      },
      "teach_vi": "Tính từ (adjective) tả NGƯỜI hoặc VẬT, nên nó đứng trước danh từ (a quick runner) hoặc đứng sau \"be\" (He is quick). Trạng từ (adverb) tả HÀNH ĐỘNG, nên nó đứng sau động từ thường (He runs quickly). Cách tạo trạng từ: thường chỉ thêm \"-ly\" — quick → quickly, slow → slowly, careful → carefully, loud → loudly; nếu tính từ kết thúc bằng phụ âm + y thì đổi thành \"-ily\" — happy → happily, easy → easily. Có hai từ đặc biệt phải học thuộc: good → well (không có \"goodly\") và fast → fast (không có \"fastly\"). Mẹo kiểm tra: nhìn chữ ngay TRƯỚC chỗ trống — nếu là is / am / are thì điền tính từ, nếu là một động từ hành động (runs, sings, works) thì điền trạng từ."
    },
    {
      "id": "comparative-er",
      "title_vi": "So sánh hơn: \"-er\" + \"than\", chính tả và bất quy tắc better / worse",
      "explain_vi": "So sánh hai thứ: thêm \"-er\" rồi dùng \"than\" (colder than). y → ier (windy → windier), gấp đôi phụ âm cuối (hot → hotter). Bất quy tắc: good → better, bad → worse.",
      "examples": [
        "My first drawing was good. My second drawing was better than my first one.",
        "My first drawing was bad. My second drawing was worse than my first one.",
        "Today is windy. Tomorrow will be windier than today."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "drawing-er",
            "text": "My first drawing was {adj1}. My second drawing was {adj1er} than my first one.",
            "blanks": [
              "adj1er"
            ],
            "context_vi": "Đổi tính từ ở câu trước sang dạng so sánh hơn; sau nó đã có \"than\" sẵn",
            "audioText": "My first drawing was good. My second drawing was better than my first one."
          },
          {
            "id": "weather-er",
            "text": "Today is {adj2w}. Tomorrow will be {adj2wer} than today.",
            "blanks": [
              "adj2wer"
            ],
            "context_vi": "Đổi tính từ chỉ thời tiết ở câu trước sang dạng so sánh hơn cho đúng chính tả",
            "audioText": "Today is windy. Tomorrow will be windier than today."
          }
        ],
        "slots": {
          "adj1": [
            "good",
            "bad",
            "big",
            "small",
            "pretty",
            "funny"
          ],
          "adj1er": [
            "better",
            "worse",
            "bigger",
            "smaller",
            "prettier",
            "funnier"
          ],
          "adj2w": [
            "hot",
            "cold",
            "wet",
            "windy",
            "sunny",
            "good",
            "bad"
          ],
          "adj2wer": [
            "hotter",
            "colder",
            "wetter",
            "windier",
            "sunnier",
            "better",
            "worse"
          ]
        },
        "answerKey": {
          "drawing-er": {
            "adj1er": {
              "__cond": "adj1",
              "good": "better",
              "bad": "worse",
              "big": "bigger",
              "small": "smaller",
              "pretty": "prettier",
              "funny": "funnier"
            }
          },
          "weather-er": {
            "adj2wer": {
              "__cond": "adj2w",
              "hot": "hotter",
              "cold": "colder",
              "wet": "wetter",
              "windy": "windier",
              "sunny": "sunnier",
              "good": "better",
              "bad": "worse"
            }
          }
        },
        "distractors": [
          "My first drawing was good. My second drawing was gooder than my first one.",
          "My first drawing was pretty. My second drawing was prettyer than my first one.",
          "My first drawing was big. My second drawing was more big than my first one.",
          "Today is hot. Tomorrow will be more hot than today.",
          "Today is good. Tomorrow will be more better than today.",
          "Today is windy. Tomorrow will be windyer than today."
        ],
        "irregulars": {
          "good": "better",
          "bad": "worse",
          "hot": "hotter",
          "wet": "wetter",
          "windy": "windier",
          "sunny": "sunnier"
        }
      },
      "teach_vi": "Khi so sánh HAI thứ, em thêm \"-er\" vào tính từ ngắn rồi dùng \"than\": cold → colder than, small → smaller than. Ba điều về chính tả: (1) tính từ kết thúc bằng phụ âm + y thì đổi y thành \"-ier\" — windy → windier, sunny → sunnier, pretty → prettier, funny → funnier; (2) tính từ một âm tiết kết thúc bằng một nguyên âm + một phụ âm thì gấp đôi phụ âm cuối — hot → hotter, wet → wetter, big → bigger; (3) hai tính từ bất quy tắc phải học thuộc — good → better, bad → worse. Lưu ý lỗi hay gặp: KHÔNG nói \"more cold\", \"more hot\" với tính từ ngắn, cũng KHÔNG nói \"gooder\", \"more better\" hay \"badder\". Và luôn nhớ có \"than\" khi so sánh với thứ kia."
    },
    {
      "id": "superlative-est",
      "title_vi": "So sánh nhất: \"the\" + \"-est\", và bất quy tắc the best / the worst",
      "explain_vi": "Nhất trong cả nhóm thì dùng \"the\" + \"-est\" (the oldest). y → iest, gấp đôi phụ âm cuối. Bất quy tắc: good → the best, bad → the worst. Không nói \"the most old\".",
      "examples": [
        "This book is funny. It is the funniest book in our library.",
        "This book is good. It is the best book in our library.",
        "That test was bad. It was the worst test of the year."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "book-est",
            "text": "This book is {adjB}. It is the {adjBest} book in our library.",
            "blanks": [
              "adjBest"
            ],
            "context_vi": "Đổi tính từ ở câu trước sang dạng so sánh nhất; chữ \"the\" đã có sẵn trước chỗ trống",
            "audioText": "This book is funny. It is the funniest book in our library."
          },
          {
            "id": "test-est",
            "text": "That test was {adjT}. It was the {adjTest} test of the year.",
            "blanks": [
              "adjTest"
            ],
            "context_vi": "So sánh nhất trong cả năm — đổi tính từ ở câu trước sang dạng có \"-est\"",
            "audioText": "That test was easy. It was the easiest test of the year."
          }
        ],
        "slots": {
          "adjB": [
            "funny",
            "good",
            "bad",
            "old",
            "big",
            "thin"
          ],
          "adjBest": [
            "funniest",
            "best",
            "worst",
            "oldest",
            "biggest",
            "thinnest"
          ],
          "adjT": [
            "easy",
            "hard",
            "long",
            "short",
            "good",
            "bad"
          ],
          "adjTest": [
            "easiest",
            "hardest",
            "longest",
            "shortest",
            "best",
            "worst"
          ]
        },
        "answerKey": {
          "book-est": {
            "adjBest": {
              "__cond": "adjB",
              "funny": "funniest",
              "good": "best",
              "bad": "worst",
              "old": "oldest",
              "big": "biggest",
              "thin": "thinnest"
            }
          },
          "test-est": {
            "adjTest": {
              "__cond": "adjT",
              "easy": "easiest",
              "hard": "hardest",
              "long": "longest",
              "short": "shortest",
              "good": "best",
              "bad": "worst"
            }
          }
        },
        "distractors": [
          "This book is funny. It is the funnyest book in our library.",
          "This book is good. It is the goodest book in our library.",
          "This book is old. It is the most old book in our library.",
          "That test was easy. It was the most easy test of the year.",
          "That test was bad. It was the baddest test of the year.",
          "That test was long. It was longest test of the year."
        ],
        "irregulars": {
          "good": "best",
          "bad": "worst",
          "big": "biggest",
          "thin": "thinnest",
          "funny": "funniest",
          "easy": "easiest"
        }
      },
      "teach_vi": "Khi một thứ là NHẤT trong cả nhóm (từ ba thứ trở lên), em dùng \"the\" + tính từ + \"-est\": old → the oldest, long → the longest. Chính tả giống bên so sánh hơn: phụ âm + y đổi thành \"-iest\" (funny → the funniest, easy → the easiest); một âm tiết có một nguyên âm + một phụ âm thì gấp đôi phụ âm cuối (big → the biggest, thin → the thinnest); bất quy tắc là good → the best và bad → the worst. Hai lỗi hay gặp: BỎ QUÊN chữ \"the\" (\"It was longest test\" — sai), và dùng \"the most\" với tính từ ngắn (\"the most old\", \"the most easy\" — sai). Sau tính từ so sánh nhất em thường nói rõ phạm vi: in our library, in our class, of the year."
    },
    {
      "id": "as-as-equal",
      "title_vi": "So sánh bằng: \"as … as\" và \"not as … as\"",
      "explain_vi": "Bằng nhau thì dùng \"as + tính từ GỐC + as\" (as tall as). Không bằng thì thêm \"not\": not as tall as. Tuyệt đối không nói \"as taller as\" hay \"as tallest as\".",
      "examples": [
        "My red pen is not longer than my blue pen. It is exactly as long as my blue pen.",
        "My red pen is not better than my blue pen. It is exactly as good as my blue pen.",
        "Minh is taller than Nam. So Nam is not as tall as Minh."
      ],
      "generators": [
        "fill_blank",
        "mcq",
        "listen_choose"
      ],
      "safeZone": {
        "templates": [
          {
            "id": "as-as-pen",
            "text": "My red pen is not {adjC} than my blue pen. It is exactly as {adjCbase} as my blue pen.",
            "blanks": [
              "adjCbase"
            ],
            "context_vi": "Hai cây bút bằng nhau — giữa \"as … as\" phải là tính từ GỐC, không thêm \"-er\"",
            "audioText": "My red pen is not longer than my blue pen. It is exactly as long as my blue pen."
          },
          {
            "id": "not-as-as-friends",
            "text": "Minh is {adjD} than Nam. So Nam is not as {adjDbase} as Minh.",
            "blanks": [
              "adjDbase"
            ],
            "context_vi": "Nam kém hơn nên dùng \"not as … as\"; giữa hai chữ \"as\" là tính từ GỐC",
            "audioText": "Minh is taller than Nam. So Nam is not as tall as Minh."
          }
        ],
        "slots": {
          "adjC": [
            "longer",
            "bigger",
            "heavier",
            "better",
            "newer",
            "cheaper"
          ],
          "adjCbase": [
            "long",
            "big",
            "heavy",
            "good",
            "new",
            "cheap"
          ],
          "adjD": [
            "taller",
            "older",
            "faster",
            "stronger",
            "younger",
            "shorter"
          ],
          "adjDbase": [
            "tall",
            "old",
            "fast",
            "strong",
            "young",
            "short"
          ]
        },
        "answerKey": {
          "as-as-pen": {
            "adjCbase": {
              "__cond": "adjC",
              "longer": "long",
              "bigger": "big",
              "heavier": "heavy",
              "better": "good",
              "newer": "new",
              "cheaper": "cheap"
            }
          },
          "not-as-as-friends": {
            "adjDbase": {
              "__cond": "adjD",
              "taller": "tall",
              "older": "old",
              "faster": "fast",
              "stronger": "strong",
              "younger": "young",
              "shorter": "short"
            }
          }
        },
        "distractors": [
          "My red pen is not longer than my blue pen. It is exactly as longer as my blue pen.",
          "My red pen is not bigger than my blue pen. It is exactly as bigger as my blue pen.",
          "My red pen is not better than my blue pen. It is exactly as best as my blue pen.",
          "Minh is taller than Nam. So Nam is not as taller as Minh.",
          "Minh is faster than Nam. So Nam is not as fastest as Minh.",
          "Minh is older than Nam. So Nam is not as older as Minh."
        ],
        "irregulars": {
          "better": "good",
          "worse": "bad"
        }
      },
      "teach_vi": "Khi hai thứ BẰNG NHAU, em không dùng \"-er\" nữa mà dùng \"as … as\" với tính từ ở dạng GỐC: \"This pen is as long as that pen.\" (dài bằng nhau). Muốn nói KHÔNG bằng thì thêm \"not\": \"Nam is not as tall as Minh.\" (Nam không cao bằng Minh — nghĩa là Minh cao hơn). Ba lỗi rất hay gặp: \"as taller as\", \"as tallest as\", \"as more tall as\" — tất cả đều SAI, giữa hai chữ \"as\" chỉ được đặt tính từ gốc: as tall as, as good as, as heavy as. Mẹo nhớ: \"-er … than\" là hơn kém, còn \"as … as\" là bằng nhau; hai mẫu này không bao giờ trộn vào nhau."
    }
  ],
  "phonics": null,
  "reading": [
    {
      "id": "our-sports-day",
      "title": "Our sports day",
      "title_vi": "Ngày hội thể thao của chúng em",
      "text": "Last Saturday was our sports day. The weather was good on Saturday, but on Sunday it was even better. Nam runs very fast, and he runs faster than me. Minh is not as fast as Nam, but he jumps well. My jump was the longest of the day! Lan draws carefully, so she made the nicest poster in our class.",
      "questions": [
        {
          "id": "q1",
          "q_vi": "Nam chạy nhanh hơn bạn kể chuyện, đúng không?",
          "type": "truefalse",
          "answer": true,
          "audioText": "Nam runs faster than me."
        },
        {
          "id": "q2",
          "q_vi": "Cú nhảy của bạn kể chuyện thì thế nào?",
          "type": "mcq",
          "choices": [
            "It was the longest of the day.",
            "It was the shortest of the day.",
            "It was as short as Nam's jump."
          ],
          "answer": 0,
          "audioText": "My jump was the longest of the day."
        }
      ]
    }
  ]
};
  g.ContentData = C;
  if (typeof module !== 'undefined' && module.exports) module.exports = C;
})(typeof window !== 'undefined' ? window : this);

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
  g.ContentData = C;
  if (typeof module !== 'undefined' && module.exports) module.exports = C;
})(typeof window !== 'undefined' ? window : this);

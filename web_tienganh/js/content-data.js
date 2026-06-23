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
  g.ContentData = C;
  if (typeof module !== 'undefined' && module.exports) module.exports = C;
})(typeof window !== 'undefined' ? window : this);

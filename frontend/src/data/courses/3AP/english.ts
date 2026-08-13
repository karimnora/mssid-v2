import { CourseLesson } from '../../../types';

// 6 leçon(s) — english / 3AP
export const ENGLISH_3AP: CourseLesson[] = [
// ==========================================
// 🇬🇧 اللغة الإنجليزية (ENGLISH) - 3AP
// Trimestre 1
// ==========================================
{
    id: 'english-3ap-u1-greetings-alphabet',
    grade: '3AP',
    subject: 'english',
    trimester: 1,
    domainAr: 'English Language - Listening, Speaking & Alphabet Phonics',
    sequenceAr: 'Unit 1 - Sequence 1: Hello & Welcome (Greetings & Alphabet)',
    categoryAr: 'اللغة الإنجليزية - التحايا والحروف (A-Z)',
    titleAr: 'UNIT 1 (S1) : GREETINGS, INTRODUCTIONS & THE ENGLISH ALPHABET (A TO Z)',
    summaryAr: 'In 3AP, Algerian primary pupils learn English for the very first time! This sequence introduces greetings (Hello, Good morning, Goodbye), asking names ("What\'s your name?"), basic phonics, and the 26 letters of the English alphabet.',
    objectiveAr: 'Greet peers and teachers in English, introduce oneself ("My name is..."), ask others their name, and pronounce the 26 alphabet letters.',
    objectivesAr: [
        'أُحَيِّي زُمَلاَئِي وَمُعَلِّمِي بِالإِنْجِلِيزِيَّةِ.',
        'أُقَدِّمُ نَفْسِي وَأَسْأَلُ عَنِ اسْمِ الآخَرِينَ.',
        'أَتَعَرَّفُ عَلَى الحُرُوفِ الأَبْجَدِيَّةِ الإِنْجِلِيزِيَّةِ الـ 26.',
    ],
    detailedCourse: {
        introAr: 'أول ما نتعلمه في أي لغة جديدة هو كيف نُحَيِّي الآخرين ونُقدّم أنفسنا؛ ونتعرّف أيضاً على حروف الأبجدية الإنجليزية الـ 26.',
        vocabulary: [
            { termAr: 'Hello / Hi (مرحباً)', definitionAr: 'كلمتان للترحيب عند لقاء شخص.' },
            { termAr: 'Vowels (الحروف المتحركة)', definitionAr: 'الحروف الخمسة A, E, I, O, U التي يُبنى عليها نطق الكلمات.' },
        ],
        visualizationHintAr: 'غنِّ أغنية الأبجدية الإنجليزية (ABC Song) بصوت عالٍ، ولاحظ الحروف الخمسة المتحركة بين الـ 26.',
        commonMistakes: [
            { mistakeAr: 'الخلط بين "What is your name?" و"How old are you?".', correctionAr: 'السؤال الأول عن الاسم، والثاني عن العمر — كل سؤال له إجابة مختلفة تماماً.' },
        ],
        takeawayAr: 'Hello/Hi للترحيب، Goodbye للوداع. My name is... للتقديم. 26 حرفاً إنجليزياً منها 5 حروف متحركة: A, E, I, O, U.',
    },
    keyFormulas: [
        { labelAr: 'صيغة التقديم', formulaAr: 'My name is + [Name]' },
    ],
    discoveryAr: 'Listen to the conversation between Yassine and Fennec (our Algerian mascot):\n- Fennec: "Hello! What is your name?"\n- Yassine: "Hi! My name is Yassine. I am 8 years old. What is your name?"\n- Fennec: "I am Fennec! Nice to meet you, Yassine!"\n- Yassine: "Nice to meet you too, Fennec! Goodbye!"',
    rulesAr: [
      'Greetings: Hello / Hi (أهلاً / مرحباً) | Good morning (صباح الخير) | Good afternoon (مساء الخير) | Goodbye / Bye (إلى اللقاء).',
      'Asking Name: "What is your name?" (ما اسمك؟) ➔ "My name is [Name]" or "I am [Name]".',
      'Asking Age: "How old are you?" (كم عمرك؟) ➔ "I am 8 years old" (عمري 8 سنوات).',
      'Polite Expressions: "Nice to meet you!" (سررت بلقائك) | "Please" (من فضلك) | "Thank you" (شكراً).',
      'The English Alphabet (26 letters):\n- 5 Vowels (حروف الفول): A, E, I, O, U.\n- 21 Consonants: B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z.',
      'Phonics Examples: /a/ as in Apple 🍎, /b/ as in Book 📘, /c/ as in Cat 🐱.'
    ],
    interactiveTool: 'english_lab',
    examplesAr: [
      {
        problem: 'How do you reply when someone says "Nice to meet you"?',
        solution: '"Nice to meet you too!" (سررت بلقائك أيضاً!)'
      },
      {
        problem: 'How do you introduce yourself if your name is Amina?',
        solution: '"Hello! My name is Amina."'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-en3ap-greetings-1',
        level: 1,
        levelLabelAr: '🟢 Level 1 — Easy',
        problemAr: 'How do you say "صباح الخير" in English?',
        hintsAr: ['Starts with "Good..."'],
        solutionAr: 'Good morning!',
        detailedCorrectionAr: 'Well done! 🎉 "Good morning" means صباح الخير in English.',
        xpReward: 10
      },
      {
        id: 'ex2-en3ap-greetings-2',
        level: 2,
        levelLabelAr: '🟡 Level 2 — Medium',
        problemAr: 'Complete the sentence: "What ..... your name? - My name is Yassine."',
        hintsAr: ['Verb to be for singular: is or are?'],
        solutionAr: 'is',
        detailedCorrectionAr: 'Awesome! ✨ We say "What IS your name?".',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-en3ap-u1s1',
      type: 'quiz_flash',
      titleAr: '🎮 The Alphabet & Greetings Challenge',
      instructionsAr: 'Select the correct English greeting or letter!',
      items: [
        { questionOrPromptAr: 'How do you say "إلى اللقاء" in English?', correctAnswerAr: 'Goodbye!', optionsAr: ['Goodbye!', 'Hello!', 'Please'], explanationAr: 'Goodbye means إلى اللقاء.' },
        { questionOrPromptAr: 'Which letter is a VOWEL (حرف متحرك) ?', correctAnswerAr: 'Letter A', optionsAr: ['Letter A', 'Letter B', 'Letter D'], explanationAr: 'A, E, I, O, U are vowels.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-u1s1',
        questionAr: 'How do you ask someone for their name in English?',
        options: [
          { id: 'a', textAr: 'What is your name?', isCorrect: true, explanationAr: 'Correct! "What is your name?" is the exact English question.' },
          { id: 'b', textAr: 'How old are you?', isCorrect: false }
        ]
      }
    ]
},

{
    id: 'english-3ap-u1-family-friends-numbers',
    grade: '3AP',
    subject: 'english',
    trimester: 1,
    domainAr: 'English Language - Vocabulary, Speaking & Counting',
    sequenceAr: 'Unit 1 - Sequence 2: My Family, Friends & Numbers 1-10',
    categoryAr: 'اللغة الإنجليزية - العائلة والأرقام من 1 إلى 10',
    titleAr: 'UNIT 1 (S2) : MY FAMILY, FRIENDS & NUMBERS 1 TO 10',
    summaryAr: 'Pupils learn vocabulary for family members (father, mother, brother, sister, grandfather, grandmother), introducing family ("This is my father"), and counting from 1 to 10 in English.',
    objectiveAr: 'Identify family relations in English, introduce family members or friends, and count objects from 1 to 10.',
    objectivesAr: [
        'أُسَمِّي أَفْرَادَ عَائِلَتِي بِالإِنْجِلِيزِيَّةِ.',
        'أَعُدُّ مِنْ 1 إِلَى 10 بِالإِنْجِلِيزِيَّةِ.',
    ],
    detailedCourse: {
        introAr: 'لتقديم عائلتنا بالإنجليزية نستعمل "This is my..."، ونحتاج أيضاً لمعرفة الأرقام من 1 إلى 10 لعدّ الأشياء من حولنا.',
        vocabulary: [
            { termAr: 'This is my... (هذا/هذه...)', definitionAr: 'عبارة لتقديم فرد من العائلة أو صديق.' },
            { termAr: 'Plural -s (جمع بإضافة s)', definitionAr: 'قاعدة إضافة "s" لتحويل الاسم من المفرد إلى الجمع في الإنجليزية.' },
        ],
        visualizationHintAr: 'قدّم كل فرد من عائلتك بجملة "This is my..." ثم عُدّ عدد أفراد عائلتك بالإنجليزية.',
        commonMistakes: [
            { mistakeAr: 'نسيان إضافة "s" لجمع الأسماء.', correctionAr: 'لجمع أغلب الأسماء الإنجليزية نضيف "s" فقط في آخر الكلمة: book → books.' },
        ],
        takeawayAr: 'This is my father/mother/brother/sister لتقديم العائلة. الأرقام 1-10: One, Two, Three... Ten. الجمع: نضيف s.',
    },
    keyFormulas: [
        { labelAr: 'قاعدة الجمع', formulaAr: 'اسم مفرد + s = جمع (book → books)' },
    ],
    discoveryAr: 'In Yassine\'s house:\n- "Look! This is my father Ali. This is my mother Karima."\n- "This is my brother Merouane and my sister Amina."\n- "How many candles on the birthday cake? Let\'s count: 1, 2, 3, 4, 5, 6, 7, 8! Eight candles!"',
    rulesAr: [
      'Family Members:\n- Father / Dad (أب)\n- Mother / Mom (أم)\n- Brother (أخ)\n- Sister (أخت)\n- Grandfather / Grandpa (جد)\n- Grandmother / Grandma (جدة).',
      'Introducing Family/Friends: "This is my father" (هذا أبي) | "This is my friend Akram" (هذا صديقي أكرم).',
      'Numbers 1 to 10:\n- 1 (One), 2 (Two), 3 (Three), 4 (Four), 5 (Five)\n- 6 (Six), 7 (Seven), 8 (Eight), 9 (Nine), 10 (Ten).',
      'Plural Nouns Rule: To make a noun plural, add "s" (ex: 1 book ➔ 2 books | 1 apple ➔ 3 apples).'
    ],
    interactiveTool: 'english_lab',
    examplesAr: [
      {
        problem: 'How do you say "هذه أمي" in English?',
        solution: '"This is my mother" or "This is my mom."'
      },
      {
        problem: 'Count 5 fingers on one hand in English:',
        solution: 'One, Two, Three, Four, Five (5 fingers).'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-en3ap-fam-1',
        level: 1,
        levelLabelAr: '🟢 Level 1 — Easy',
        problemAr: 'What is the English word for "أخت" ?',
        hintsAr: ['Starts with letter S'],
        solutionAr: 'Sister',
        detailedCorrectionAr: 'Great job! 👏 "Sister" means أخت in English.',
        xpReward: 10
      },
      {
        id: 'ex2-en3ap-num-2',
        level: 2,
        levelLabelAr: '🟡 Level 2 — Medium',
        problemAr: 'What number comes after Seven (7) in English?',
        hintsAr: ['Seven, ...'],
        solutionAr: 'Eight (8)',
        detailedCorrectionAr: 'Awesome! 🎯 1, 2, 3, 4, 5, 6, 7, 8 (Eight).',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-en3ap-u1s2',
      type: 'speed_calc',
      titleAr: '🎮 Family & Numbers Speed Game',
      instructionsAr: 'Match the English number or family word with its translation!',
      items: [
        { questionOrPromptAr: 'Number 5 in English:', correctAnswerAr: 'Five', optionsAr: ['Five', 'Three', 'Ten'], explanationAr: '5 is Five.' },
        { questionOrPromptAr: 'How do you say "جد" in English?', correctAnswerAr: 'Grandfather', optionsAr: ['Grandfather', 'Brother', 'Father'], explanationAr: 'Grandfather means جد.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-u1s2',
        questionAr: 'How do you introduce your brother in English?',
        options: [
          { id: 'a', textAr: 'This is my brother.', isCorrect: true, explanationAr: 'Correct! "This is my brother" introduces your brother.' },
          { id: 'b', textAr: 'This is my sister.', isCorrect: false }
        ]
      }
    ]
},

// ==========================================
// Trimestre 2
// ==========================================
{
    id: 'english-3ap-u2-school-objects-commands',
    grade: '3AP',
    subject: 'english',
    trimester: 2,
    domainAr: 'English Language - Classroom Vocabulary & Commands',
    sequenceAr: 'Unit 2 - Sequence 1: My School Objects & Classroom Commands',
    categoryAr: 'اللغة الإنجليزية - الأدوات المدرسية وأوامر القسم',
    titleAr: 'UNIT 2 (S1) : MY SCHOOL OBJECTS & CLASSROOM COMMANDS',
    summaryAr: 'Pupils discover classroom supplies (book, notebook, pen, pencil, eraser, ruler, schoolbag, pencil case, sharpener) and learn to follow English classroom instructions given by the teacher.',
    objectiveAr: 'Name classroom objects, ask "What is this? - It is a...", and respond correctly to basic classroom commands.',
    objectivesAr: [
        'أُسَمِّي أَدَوَاتِي المَدْرَسِيَّةَ بِالإِنْجِلِيزِيَّةِ.',
        'أَسْتَعْمِلُ "a" أَوْ "an" حَسَبَ الحَرْفِ الأَوَّلِ لِلْكَلِمَةِ.',
        'أَفْهَمُ وَأُطَبِّقُ أَوَامِرَ القِسْمِ الأَسَاسِيَّةَ.',
    ],
    detailedCourse: {
        introAr: 'في القسم، نحتاج إلى معرفة أسماء أدواتنا المدرسية، وفهم أوامر المعلم البسيطة، ومعرفة متى نستعمل "a" ومتى نستعمل "an".',
        vocabulary: [
            { termAr: 'a / an', definitionAr: 'أداة نكرة: "a" قبل صوت ساكن، و"an" قبل صوت متحرك (a book / an eraser).' },
            { termAr: 'Classroom commands', definitionAr: 'أوامر يستعملها المعلم في القسم مثل Listen! Look! Stand up!' },
        ],
        visualizationHintAr: 'افتح محفظتك واسأل زميلك "What is this?" عن كل أداة، مستعملاً "It is a..." أو "It is an...".',
        commonMistakes: [
            { mistakeAr: 'استعمال "a" قبل كلمة تبدأ بصوت متحرك.', correctionAr: 'قبل الأصوات المتحركة (A, E, I, O, U) نستعمل "an" وليس "a": an eraser, an apple.' },
        ],
        takeawayAr: 'a + صوت ساكن (a book)، an + صوت متحرك (an eraser). What is this? — It is a/an... لأوامر القسم: Listen! Look! Stand up! Sit down!',
    },
    keyFormulas: [
        { labelAr: 'استعمال a/an', formulaAr: 'a + صوت ساكن | an + صوت متحرك (A,E,I,O,U)' },
    ],
    discoveryAr: 'In the 3AP English classroom:\n- Teacher: "Good morning class! Stand up please! Sit down please!"\n- Teacher: "Open your books! Look at the board and listen!"\n- Yassine: "What is this?" - Amina: "It is a green pencil case!"',
    rulesAr: [
      'Classroom Commands (أوامر القسم):\n- Listen! (إستمع)\n- Look! (أنظر)\n- Read! (إقرأ)\n- Write! (إكتب)\n- Draw! (إرسم)\n- Speak! (تكلم)\n- Stand up! (قف)\n- Sit down! (إجلس)\n- Be quiet! (إلتزم الهدوء).',
      'School Supplies Vocabulary:\n- Book (كتاب)\n- Notebook (كراس)\n- Pen (قلم حبر)\n- Pencil (قلم رصاص)\n- Eraser / Rubber (ممحاة)\n- Ruler (مسطرة)\n- Pencil case (مقلمة)\n- Schoolbag / Bag (محفظة)\n- Sharpener (برّاية).',
      'Demonstrative Questions: "What is this?" (ما هذا؟) ➔ "It is a pen" (إنه قلم حبر).',
      'Indefinite Articles (a / an):\n- Use "a" before consonant sounds (ex: a book, a pen, a ruler).\n- Use "an" before vowel sounds A, E, I, O, U (ex: an eraser, an apple).'
    ],
    interactiveTool: 'english_lab',
    examplesAr: [
      {
        problem: 'Which article should you use before "eraser"? (a / an)',
        solution: '"an eraser" (because eraser starts with the vowel E).'
      },
      {
        problem: 'Translate the teacher\'s command: "Open your book!"',
        solution: 'إفتح كتابك!'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-en3ap-sch-1',
        level: 1,
        levelLabelAr: '🟢 Level 1 — Easy',
        problemAr: 'Which English word means "ممحاة" ?',
        hintsAr: ['Starts with letter E'],
        solutionAr: 'Eraser (or Rubber)',
        detailedCorrectionAr: 'Bravo! 👏 Eraser or Rubber means ممحاة in English.',
        xpReward: 10
      },
      {
        id: 'ex2-en3ap-sch-2',
        level: 2,
        levelLabelAr: '🟡 Level 2 — Medium',
        problemAr: 'Which classroom command means "قف من فضلك" ?',
        hintsAr: ['Stand ...'],
        solutionAr: 'Stand up please!',
        detailedCorrectionAr: 'Excellent! 🎯 "Stand up" means قف.',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-en3ap-u2s1',
      type: 'association',
      titleAr: '🎮 Schoolbag Sorting Game',
      instructionsAr: 'Match the English school object to its Arabic translation!',
      items: [
        { questionOrPromptAr: 'Pen', correctAnswerAr: 'قلم حبر', optionsAr: ['قلم حبر', 'كتاب', 'مسطرة'], explanationAr: 'Pen means قلم حبر.' },
        { questionOrPromptAr: 'Schoolbag', correctAnswerAr: 'محفظة', optionsAr: ['محفظة', 'مقلمة', 'كراس'], explanationAr: 'Schoolbag means محفظة.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-u2s1',
        questionAr: 'What is the correct English sentence for "ما هذا؟ إنه كراس."',
        options: [
          { id: 'a', textAr: 'What is this? It is a notebook.', isCorrect: true, explanationAr: 'Correct! "notebook" means كراس.' },
          { id: 'b', textAr: 'What is this? It is a book.', isCorrect: false }
        ]
      }
    ]
},

{
    id: 'english-3ap-u3-colors-shapes-home',
    grade: '3AP',
    subject: 'english',
    trimester: 2,
    domainAr: 'English Language - Colors, Shapes & House Vocabulary',
    sequenceAr: 'Unit 3 - Sequence 1: Colors, Shapes & My Home',
    categoryAr: 'اللغة الإنجليزية - الألوان والأشكال والمنزل',
    titleAr: 'UNIT 3 : COLORS, SHAPES & MY HOME (ROOMS & PREPOSITIONS IN / ON / UNDER)',
    summaryAr: 'Pupils explore colors (red, blue, yellow, green, orange, purple, pink, black, white, brown), geometric shapes, house rooms (living room, bedroom, kitchen, bathroom, garden) and prepositions of location (in, on, under, next to).',
    objectiveAr: 'Describe items with colors and shapes, name home rooms, and locate objects using prepositions of place.',
    objectivesAr: [
        'أُسَمِّي الأَلْوَانَ الأَسَاسِيَّةَ بِالإِنْجِلِيزِيَّةِ.',
        'أُحَدِّدُ مَكَانَ شَيْءٍ بِاسْتِعْمَالِ in/on/under.',
    ],
    detailedCourse: {
        introAr: 'لوصف الأشياء نستعمل الألوان والأشكال، ولتحديد مكانها بدقة نستعمل حروف الجر in (داخل)، on (فوق)، وunder (تحت).',
        vocabulary: [
            { termAr: 'Prepositions of place', definitionAr: 'كلمات صغيرة تحدد مكان شيء: in (داخل)، on (فوق)، under (تحت)، next to (بجانب).' },
        ],
        visualizationHintAr: 'انظر حولك في الغرفة وصف مكان 3 أشياء باستعمال in، on، وunder.',
        commonMistakes: [
            { mistakeAr: 'الخلط بين "in" و"on".', correctionAr: '"in" تعني داخل شيء مغلق (in the bag)، بينما "on" تعني فوق سطح (on the table).' },
        ],
        takeawayAr: 'الألوان الأساسية: red, blue, yellow, green... الأشكال: circle, square, triangle, star. حروف الجر: in (داخل)، on (فوق)، under (تحت).',
    },
    keyFormulas: [
        { labelAr: 'حروف الجر المكانية', formulaAr: 'in (في) | on (على) | under (تحت) | next to (بجانب)' },
    ],
    discoveryAr: 'In Yassine\'s house:\n- "Welcome to my home! This is the living room."\n- "Where is the cat?" - "The cat is UNDER the table!"\n- "What color is the Algerian Flag? It is GREEN, WHITE, and RED 🇩🇿."',
    rulesAr: [
      'Colors Vocabulary:\n- Red (أحمر), Blue (أزرق), Yellow (أصفر)\n- Green (أخضر), Orange (برتقالي), Purple (بنفسجي)\n- Pink (وردي), Black (أسود), White (أبيض), Brown (بني).',
      'Geometric Shapes:\n- Circle (دائرة)\n- Square (مربع)\n- Triangle (مثلث)\n- Star (نجمة).',
      'Rooms of the House:\n- Living room (غرفة الضيوف)\n- Bedroom (غرفة النوم)\n- Kitchen (المطبخ)\n- Bathroom (الحمام)\n- Garden (الحديقة).',
      'Prepositions of Place (حروف الجر المكانية):\n- IN (في / بداخل) : ex: The book is in the bag.\n- ON (على / فوق) : ex: The pen is on the desk.\n- UNDER (تحت) : ex: The ball is under the bed.\n- NEXT TO (بجانب) : ex: The chair is next to the table.'
    ],
    interactiveTool: 'english_lab',
    examplesAr: [
      {
        problem: 'Translate: "القط في المطبخ"',
        solution: '"The cat is in the kitchen."'
      },
      {
        problem: 'What colors are on the Algerian Flag? 🇩🇿',
        solution: 'Green, White, and Red.'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-en3ap-col-1',
        level: 1,
        levelLabelAr: '🟢 Level 1 — Easy',
        problemAr: 'What color is grass in English?',
        hintsAr: ['Grass is أخضر in Arabic'],
        solutionAr: 'Green',
        detailedCorrectionAr: 'Well done! 🌿 Grass is Green.',
        xpReward: 10
      },
      {
        id: 'ex2-en3ap-prep-2',
        level: 2,
        levelLabelAr: '🟡 Level 2 — Medium',
        problemAr: 'Choose the correct preposition: "The ball is ..... the table" (تحت الطاولة).',
        hintsAr: ['In, On or Under?'],
        solutionAr: 'under',
        detailedCorrectionAr: 'Awesome! 🎯 Under means تحت.',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-en3ap-u3s1',
      type: 'quiz_flash',
      titleAr: '🎮 Colors & House Prepositions Challenge',
      instructionsAr: 'Find the correct English room or preposition!',
      items: [
        { questionOrPromptAr: 'Where do we sleep at home?', correctAnswerAr: 'In the bedroom', optionsAr: ['In the bedroom', 'In the kitchen', 'In the bathroom'], explanationAr: 'We sleep in the bedroom.' },
        { questionOrPromptAr: 'What color is milk in English?', correctAnswerAr: 'White', optionsAr: ['White', 'Black', 'Blue'], explanationAr: 'Milk is White.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-u3s1',
        questionAr: 'Which preposition means "على / فوق" in English?',
        options: [
          { id: 'a', textAr: 'ON', isCorrect: true, explanationAr: 'Correct! ON means على or فوق.' },
          { id: 'b', textAr: 'UNDER', isCorrect: false }
        ]
      }
    ]
},

// ==========================================
// Trimestre 3
// ==========================================
{
    id: 'english-3ap-u4-toys-pets-preferences',
    grade: '3AP',
    subject: 'english',
    trimester: 3,
    domainAr: 'English Language - Toys, Animals & Expressing Preferences',
    sequenceAr: 'Unit 4 - Sequence 1: My Toys, Pets & Expressing Likes',
    categoryAr: 'اللغة الإنجليزية - الألعاب والحيوانات الأليفة والتفضيلات',
    titleAr: 'UNIT 4 : MY TOYS, PETS & EXPRESSING LIKES ("I LIKE...", "I HAVE...")',
    summaryAr: 'Pupils learn vocabulary for favorite toys (ball, doll, robot, car, bike, kite, teddy bear) and domestic pets (cat, dog, bird, fish, rabbit, turtle). They learn to express ownership ("I have a...") and personal preferences ("I like cats", "I don\'t like dogs").',
    objectiveAr: 'Talk about personal toys, identify pets, and express likes/dislikes in English.',
    objectivesAr: [
        'أُسَمِّي أَلْعَابِي وَالحَيَوَانَاتِ الأَلِيفَةَ بِالإِنْجِلِيزِيَّةِ.',
        'أُعَبِّرُ عَنِ التَّفْضِيلِ بِـ "I like" وَ"I don\'t like".',
    ],
    detailedCourse: {
        introAr: '"I have" تعبّر عن الملكية، بينما "I like/I don\'t like" تعبّر عمّا نحبه أو لا نحبه.',
        vocabulary: [
            { termAr: 'I have a... (عندي...)', definitionAr: 'عبارة تعبّر عن امتلاك شيء.' },
            { termAr: 'I like / I don\'t like', definitionAr: 'عبارتان للتعبير عن الإعجاب أو عدمه.' },
        ],
        visualizationHintAr: 'اكتب قائمة بألعابك المفضلة وحيواناتك الأليفة المفضلة باستعمال "I have" و"I like".',
        commonMistakes: [
            { mistakeAr: 'الخلط بين "I have" و"I like".', correctionAr: '"I have" تعني الامتلاك (عندي)، و"I like" تعني الإعجاب (أحب) — لا يمكن استبدال إحداهما بالأخرى.' },
        ],
        takeawayAr: 'I have a [toy/pet] للملكية. I like.../I don\'t like... للتفضيل. Toys: ball, doll, robot. Pets: cat, dog, bird, fish.',
    },
    keyFormulas: [
        { labelAr: 'التعبير عن التفضيل', formulaAr: 'I like + [Noun] | I don\'t like + [Noun]' },
    ],
    discoveryAr: 'In the playroom:\n- Yassine: "I have a red car and a blue ball! What is your favorite toy, Amina?"\n- Amina: "My favorite toy is my teddy bear 🧸! I love pets too. I like cats 🐱!"\n- Yassine: "I like birds 🐦, but I don\'t like frogs 🐸!"',
    rulesAr: [
      'Toys Vocabulary:\n- Ball (كرة)\n- Doll (دمية)\n- Robot (روبوت)\n- Car (سيارة)\n- Bike (دراجة)\n- Kite (طائرة ورقية)\n- Teddy bear (دب لعبة).',
      'Pets & Animals Vocabulary:\n- Cat (قط)\n- Dog (كلب)\n- Bird (عصفور)\n- Fish (سمكة)\n- Rabbit (أرنب)\n- Turtle (سلحفاة).',
      'Expressing Ownership: "I have a [Toy/Pet]" (عندي / أمتلك...). Example: "I have a red car" (عندي سيارة حمراء).',
      'Expressing Likes & Dislikes:\n- "I like [Noun]" (أنا أحب...). Example: "I like cats."\n- "I don\'t like [Noun]" (أنا لا أحب...). Example: "I don\'t like dogs."\n- "My favorite toy is [Toy]" (لعبتي المفضلة هي...).'
    ],
    interactiveTool: 'english_lab',
    examplesAr: [
      {
        problem: 'How do you say "أنا أحب الأرانب" in English?',
        solution: '"I like rabbits."'
      },
      {
        problem: 'How do you say "عندي دراجة زرقاء" in English?',
        solution: '"I have a blue bike."'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-en3ap-toys-1',
        level: 1,
        levelLabelAr: '🟢 Level 1 — Easy',
        problemAr: 'What is the English word for "قط" ?',
        hintsAr: ['Starts with letter C'],
        solutionAr: 'Cat',
        detailedCorrectionAr: 'Well done! 🐱 "Cat" means قط in English.',
        xpReward: 10
      },
      {
        id: 'ex2-en3ap-like-2',
        level: 2,
        levelLabelAr: '🟡 Level 2 — Medium',
        problemAr: 'Complete with "like" or "don\'t like": "I ..... spiders! They scare me!" (أنا لا أحب)',
        hintsAr: ['Form for negative preference'],
        solutionAr: "don't like",
        detailedCorrectionAr: 'Great job! 👏 "I don\'t like spiders" means أنا لا أحب العنكبوت.',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-en3ap-u4s1',
      type: 'association',
      titleAr: '🎮 Toys & Pets Memory Matching',
      instructionsAr: 'Match the English toy or pet to its Arabic translation!',
      items: [
        { questionOrPromptAr: 'Teddy bear', correctAnswerAr: 'دب لعبة', optionsAr: ['دب لعبة', 'سيارة', 'طائرة'], explanationAr: 'Teddy bear means دب لعبة.' },
        { questionOrPromptAr: 'Rabbit', correctAnswerAr: 'أرنب', optionsAr: ['أرنب', 'سمكة', 'كلب'], explanationAr: 'Rabbit means أرنب.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-u4s1',
        questionAr: 'How do you say "لعبتي المفضلة هي الكرة" in English?',
        options: [
          { id: 'a', textAr: 'My favorite toy is the ball.', isCorrect: true, explanationAr: 'Correct! "My favorite toy is..." expresses your favorite toy.' },
          { id: 'b', textAr: 'I don\'t like balls.', isCorrect: false }
        ]
      }
    ]
},

{
    id: 'english-3ap-u5-body-parts-review',
    grade: '3AP',
    subject: 'english',
    trimester: 3,
    domainAr: 'English Language - Body Parts & Annual 3AP Synthesis',
    sequenceAr: 'Unit 5 - Sequence 1: My Body Parts & Annual 3AP English Synthesis',
    categoryAr: 'اللغة الإنجليزية - أعضاء الجسم والمراجعة السنوية الشاملة',
    titleAr: 'UNIT 5 : MY BODY PARTS & ANNUAL 3AP ENGLISH SYNTHESIS',
    summaryAr: 'In this final unit, pupils learn human body parts (head, face, eyes, ears, nose, mouth, hair, hands, legs, feet), numbers 11 to 20, adjectives of size (big/small, long/short), and complete a comprehensive review of all 3AP English skills.',
    objectiveAr: 'Name body parts, count 11-20, use descriptive adjectives, and demonstrate full mastery of 3AP English curriculum.',
    objectivesAr: [
        'أُسَمِّي أَعْضَاءَ جِسْمِي بِالإِنْجِلِيزِيَّةِ.',
        'أَعُدُّ مِنْ 11 إِلَى 20 بِالإِنْجِلِيزِيَّةِ.',
        'أُرَاجِعُ كُلَّ مَا تَعَلَّمْتُهُ خِلاَلَ السَّنَةِ.',
    ],
    detailedCourse: {
        introAr: 'هذه آخر وحدة في السنة، نتعرف فيها على أعضاء الجسم والأرقام حتى 20، ونراجع كل ما تعلمناه هذه السنة في الإنجليزية.',
        vocabulary: [
            { termAr: 'Body parts', definitionAr: 'مفردات أعضاء الجسم: head, face, eyes, ears, nose, mouth, hands, legs.' },
            { termAr: 'Antonyms (الأضداد)', definitionAr: 'كلمات متضادة في المعنى: big ↔ small, long ↔ short.' },
        ],
        visualizationHintAr: 'العب لعبة "المعلم يقول" (Simon Says): "Touch your head!"، "Touch your nose!" مع صديق.',
        commonMistakes: [
            { mistakeAr: 'الخلط بين الأعداد المفردة (13-19) وأعداد العشرات (30-90) بسبب تشابه النطق.', correctionAr: 'الأعداد thirteen (13) وthirty (30) تبدو متشابهة، يجب الانتباه للنهاية: -teen للآحاد، -ty للعشرات.' },
        ],
        takeawayAr: 'أعضاء الجسم: head, eyes, ears, nose, mouth, hands, legs, feet. الأرقام 11-20: eleven إلى twenty. الأضداد: big/small, long/short.',
    },
    keyFormulas: [
        { labelAr: 'الأعداد 11-20', formulaAr: 'Eleven, Twelve, Thirteen... Twenty' },
    ],
    discoveryAr: 'Teacher leads the "Simon Says" game:\n- Teacher: "Touch your head! Touch your nose! Open your eyes!"\n- Pupils: "I have two eyes 👀, two ears 👂, one nose 👃, and one mouth 👄!"\n- Teacher: "Let\'s count from 11 to 20: Eleven, Twelve, Thirteen, Fourteen, Fifteen, Sixteen, Seventeen, Eighteen, Nineteen, Twenty!"',
    rulesAr: [
      'Body Parts Vocabulary:\n- Head (رأس)\n- Face (وجه)\n- Eyes (عينان)\n- Ears (أذنان)\n- Nose (أنف)\n- Mouth (فم)\n- Hair (شعر)\n- Hands (يدان)\n- Arms (ذراعان)\n- Legs (ساقان)\n- Feet (قدمان)\n- Fingers (أصابع اليد).',
      'Numbers 11 to 20:\n- 11 (Eleven), 12 (Twelve), 13 (Thirteen), 14 (Fourteen), 15 (Fifteen)\n- 16 (Sixteen), 17 (Seventeen), 18 (Eighteen), 19 (Nineteen), 20 (Twenty).',
      'Descriptive Adjectives & Antonyms:\n- Big (كبير) ↔ Small (صغير)\n- Long (طويل) ↔ Short (قصير)\n- Example: "A big dog with small ears" | "Long hair".',
      'Annual 3AP Synthesis Checklist:\n1) Greet & introduce myself\n2) Name family, friends, school objects, colors, shapes, house rooms, toys, pets & body parts\n3) Count 1 to 20\n4) Follow classroom commands.'
    ],
    interactiveTool: 'english_lab',
    examplesAr: [
      {
        problem: 'Count how many eyes and ears you have in English:',
        solution: 'I have two (2) eyes and two (2) ears.'
      },
      {
        problem: 'What is the opposite of "Big" in English?',
        solution: '"Small" (صغير).'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-en3ap-body-1',
        level: 1,
        levelLabelAr: '🟢 Level 1 — Easy',
        problemAr: 'What is the English word for "أنف" ?',
        hintsAr: ['Starts with letter N'],
        solutionAr: 'Nose',
        detailedCorrectionAr: 'Bravo! 👃 "Nose" means أنف in English.',
        xpReward: 10
      },
      {
        id: 'ex2-en3ap-num11-2',
        level: 2,
        levelLabelAr: '🟡 Level 2 — Medium',
        problemAr: 'What number is "Fifteen" in figures?',
        hintsAr: ['Between 14 and 16'],
        solutionAr: '15',
        detailedCorrectionAr: 'Awesome! 🎯 Fifteen = 15.',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-en3ap-u5s1',
      type: 'quiz_flash',
      titleAr: '🎮 Annual 3AP English Master Quiz',
      instructionsAr: 'Test your English skills across all 3AP units!',
      items: [
        { questionOrPromptAr: 'Touch your ..... (رأس)', correctAnswerAr: 'head', optionsAr: ['head', 'hand', 'foot'], explanationAr: 'Head means رأس.' },
        { questionOrPromptAr: 'Number 12 in English word is:', correctAnswerAr: 'Twelve', optionsAr: ['Twelve', 'Twenty', 'Ten'], explanationAr: '12 is Twelve.' }
      ],
      xpReward: 25
    },
    quiz: [
      {
        id: 'q1-u5s1',
        questionAr: 'Which phrase correctly describes a elephant in English?',
        options: [
          { id: 'a', textAr: 'A big animal with big ears.', isCorrect: true, explanationAr: 'Correct! An elephant is a big animal with big ears.' },
          { id: 'b', textAr: 'A small bird with a book.', isCorrect: false }
        ]
      }
    ]
},
];

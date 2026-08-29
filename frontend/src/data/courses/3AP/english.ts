import { CourseLesson } from '../../../types';

// 8 leçon(s) — english / 3AP
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
      'The English Alphabet (26 letters):\n- 5 Vowels (حروف العلة): A, E, I, O, U.\n- 21 Consonants: B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z.',
      'Phonics Examples: /a/ as in Apple 🍎, /b/ as in Book 📘, /c/ as in Cat 🐱.'
    ],
    interactiveTool: 'english_dialogue_lab',
    languageInteractive: {
        type: 'dialogue_scenario',
        titleAr: 'Hello! What is your name?',
        introAr: 'First English year: greetings and the alphabet — no present continuous.',
        turns: [
            {
                promptAr: 'You meet Fennec in the morning. What do you say?',
                lineAr: 'Fennec: « … ! What is your name? »',
                choices: [
                    { textAr: 'Hello', isCorrect: true, feedbackAr: 'Yes! Hello / Hi to greet someone.' },
                    { textAr: 'I am running', isCorrect: false, feedbackAr: 'Present continuous is not a 3AP target.' },
                ],
            },
            {
                promptAr: 'How do you say your name?',
                lineAr: 'You: « … Yassine. »',
                choices: [
                    { textAr: 'My name is', isCorrect: true, feedbackAr: 'My name is + name. Or: I am Yassine.' },
                    { textAr: 'I will be', isCorrect: false, feedbackAr: 'Will is for later years, not 3AP Unit 1.' },
                ],
            },
        ],
    },
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
          { id: 'b', textAr: 'How old are you?', isCorrect: false, explanationAr: 'Incorrect. "How old are you?" asks about age, not about someone\'s name.' },
          { id: 'c', textAr: 'Nice to meet you!', isCorrect: false, explanationAr: 'Incorrect. "Nice to meet you!" is a polite expression used after meeting someone, not a question asking for a name.' }
        ]
      },
      {
        id: 'q2-u1s1',
        questionAr: 'Which of these letters is one of the 5 English vowels?',
        options: [
          { id: 'a', textAr: 'E', isCorrect: true, explanationAr: 'Correct! E is one of the 5 vowels: A, E, I, O, U.' },
          { id: 'b', textAr: 'B', isCorrect: false, explanationAr: 'Incorrect. B is a consonant, not one of the 5 vowels (A, E, I, O, U).' },
          { id: 'c', textAr: 'T', isCorrect: false, explanationAr: 'Incorrect. T is a consonant, not one of the 5 vowels (A, E, I, O, U).' }
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
    interactiveTool: 'english_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'My family and numbers 1–10',
        introAr: 'Tap a word: family or a number.',
        terms: [
            { termAr: 'mother', meaningAr: 'أمي — mum / mother.', exampleAr: 'This is my mother.' },
            { termAr: 'father', meaningAr: 'أبي — dad / father.', exampleAr: 'This is my father.' },
            { termAr: 'one', meaningAr: 'العدد 1.', exampleAr: 'I have one sister.' },
            { termAr: 'ten', meaningAr: 'العدد 10.', exampleAr: 'I can count to ten.' },
        ],
    },
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
          { id: 'b', textAr: 'This is my sister.', isCorrect: false, explanationAr: 'Incorrect. "This is my sister" introduces a sister, not a brother.' },
          { id: 'c', textAr: 'This is my father.', isCorrect: false, explanationAr: 'Incorrect. "This is my father" introduces your father, not your brother.' }
        ]
      },
      {
        id: 'q2-u1s2',
        questionAr: 'What is the English word for the number "9"?',
        options: [
          { id: 'a', textAr: 'Nine', isCorrect: true, explanationAr: 'Correct! 9 is "Nine" in English.' },
          { id: 'b', textAr: 'Ten', isCorrect: false, explanationAr: 'Incorrect. "Ten" is the number 10, not 9.' },
          { id: 'c', textAr: 'Six', isCorrect: false, explanationAr: 'Incorrect. "Six" is the number 6, not 9.' }
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
    interactiveTool: 'english_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'School objects and classroom talk',
        introAr: 'Objects and simple commands: Sit down, Open your book.',
        terms: [
            { termAr: 'a book', meaningAr: 'كتاب.', exampleAr: 'Open your book, please.' },
            { termAr: 'a pencil', meaningAr: 'قلم رصاص.', exampleAr: 'This is my pencil.' },
            { termAr: 'Sit down', meaningAr: 'أمر بسيط في القسم.', exampleAr: 'Sit down, please.' },
            { termAr: 'Stand up', meaningAr: 'أمر بسيط في القسم.', exampleAr: 'Stand up, please.' },
        ],
    },
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
          { id: 'b', textAr: 'What is this? It is a book.', isCorrect: false, explanationAr: 'Incorrect. "Book" means كتاب, not كراس (notebook) — the correct word is "notebook".' },
          { id: 'c', textAr: 'What is this? It is a pencil.', isCorrect: false, explanationAr: 'Incorrect. "Pencil" means قلم رصاص, not كراس (notebook).' }
        ]
      },
      {
        id: 'q2-u2s1',
        questionAr: 'Which article is correct: "..... eraser" ?',
        options: [
          { id: 'a', textAr: 'an', isCorrect: true, explanationAr: 'Correct! We use "an" before vowel sounds, like the E in "eraser".' },
          { id: 'b', textAr: 'a', isCorrect: false, explanationAr: 'Incorrect. "Eraser" starts with the vowel sound E, so we must use "an", not "a".' },
          { id: 'c', textAr: 'the', isCorrect: false, explanationAr: 'Incorrect. "The" is a definite article used for a specific, already-known object, not for introducing a new object with "What is this?".' }
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
    interactiveTool: 'english_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Colors, shapes and my home',
        introAr: 'in / on / under + rooms of the house.',
        terms: [
            { termAr: 'red', meaningAr: 'أحمر.', exampleAr: 'The apple is red.' },
            { termAr: 'a circle', meaningAr: 'دائرة.', exampleAr: 'This shape is a circle.' },
            { termAr: 'kitchen', meaningAr: 'المطبخ.', exampleAr: 'Mum is in the kitchen.' },
            { termAr: 'under', meaningAr: 'تحت.', exampleAr: 'The cat is under the table.' },
        ],
    },
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
          { id: 'b', textAr: 'UNDER', isCorrect: false, explanationAr: 'Incorrect. UNDER means تحت, not على/فوق.' },
          { id: 'c', textAr: 'IN', isCorrect: false, explanationAr: 'Incorrect. IN means في or داخل (inside), not على/فوق (on top).' }
        ]
      },
      {
        id: 'q2-u3s1',
        questionAr: 'Which geometric shape has three sides?',
        options: [
          { id: 'a', textAr: 'Triangle', isCorrect: true, explanationAr: 'Correct! A triangle (مثلث) has three sides.' },
          { id: 'b', textAr: 'Square', isCorrect: false, explanationAr: 'Incorrect. A square (مربع) has four sides, not three.' },
          { id: 'c', textAr: 'Circle', isCorrect: false, explanationAr: 'Incorrect. A circle (دائرة) has no straight sides at all.' }
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
    interactiveTool: 'english_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Toys, pets and I like…',
        introAr: 'I like / I have — no continuous tense.',
        terms: [
            { termAr: 'a ball', meaningAr: 'كرة.', exampleAr: 'I have a ball.' },
            { termAr: 'a cat', meaningAr: 'قط.', exampleAr: 'I like my cat.' },
            { termAr: 'I like', meaningAr: 'أحبّ.', exampleAr: 'I like football.' },
            { termAr: 'I have', meaningAr: 'لديّ.', exampleAr: 'I have two toys.' },
        ],
    },
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
          { id: 'b', textAr: 'I don\'t like balls.', isCorrect: false, explanationAr: 'Incorrect. This sentence expresses dislike for balls, which is the opposite of saying it is your favorite toy.' },
          { id: 'c', textAr: 'I have a ball.', isCorrect: false, explanationAr: 'Incorrect. "I have a ball" expresses ownership, not that it is your favorite toy.' }
        ]
      },
      {
        id: 'q2-u4s1',
        questionAr: 'What is the English word for "أرنب"?',
        options: [
          { id: 'a', textAr: 'Rabbit', isCorrect: true, explanationAr: 'Correct! "Rabbit" means أرنب in English.' },
          { id: 'b', textAr: 'Turtle', isCorrect: false, explanationAr: 'Incorrect. "Turtle" means سلحفاة, not أرنب.' },
          { id: 'c', textAr: 'Bird', isCorrect: false, explanationAr: 'Incorrect. "Bird" means عصفور, not أرنب.' }
        ]
      }
    ]
},

{
    id: 'english-3ap-u4-numbers-counting',
    grade: '3AP',
    subject: 'english',
    trimester: 3,
    domainAr: 'English Language - Numbers & Counting',
    sequenceAr: 'Unit 4 - Sequence 2: Counting My Things (Numbers 11-15)',
    categoryAr: 'اللغة الإنجليزية - الأرقام من 11 إلى 15',
    titleAr: 'UNIT 4 (S2) : COUNTING MY THINGS (NUMBERS 11 TO 15)',
    summaryAr: 'Pupils learn numbers 11 to 15 in English (eleven to fifteen) and use them to count everyday objects like toys, books, and pencils, with the structure "How many...are there? - There are...".',
    objectiveAr: 'Count from 11 to 15 in English and use "How many...are there?" to count objects.',
    objectivesAr: [
        'أَعُدُّ مِنْ 11 إِلَى 15 بِالإِنْجِلِيزِيَّةِ.',
        'أَسْتَعْمِلُ "How many...are there?" لِعَدِّ الأَشْيَاءِ.',
    ],
    detailedCourse: {
        introAr: 'بعد أن تعلمنا العد من 1 إلى 10، نتعلم اليوم أرقاماً جديدة من 11 إلى 15 لنعدّ بها أشياءنا اليومية مثل الألعاب والأقلام.',
        vocabulary: [
            { termAr: 'How many...are there?', definitionAr: 'سؤال نستعمله لمعرفة عدد الأشياء: "كم عدد...؟"' },
            { termAr: 'There are...', definitionAr: 'عبارة نجيب بها عن السؤال بعدد الأشياء الموجودة.' },
        ],
        visualizationHintAr: 'اجمع 12 قلماً أو لعبة أمام طفلك واسأله "How many pencils are there?" وساعده على العد بالإنجليزية حتى الجواب.',
        commonMistakes: [
            { mistakeAr: 'نطق "eleven" و"twelve" كأنهما تتبعان نفس قاعدة "-teen".', correctionAr: 'eleven (11) وtwelve (12) كلمتان خاصتان، لا تتبعان قاعدة "-teen" كباقي الأعداد من 13 إلى 19.' },
        ],
        takeawayAr: 'Numbers 11-15: eleven, twelve, thirteen, fourteen, fifteen. How many...are there? - There are [number]...',
    },
    keyFormulas: [
        { labelAr: 'السؤال عن العدد', formulaAr: 'How many [things] are there? ➔ There are [number] [things].' },
    ],
    discoveryAr: 'In the toy box:\n- "How many toys are there?" - "Let\'s count: Eleven, Twelve, Thirteen... There are thirteen toys!"\n- "How many pencils are there in your bag?" - "There are fifteen pencils!"',
    rulesAr: [
      'Numbers 11 to 15:\n- 11 (Eleven), 12 (Twelve), 13 (Thirteen), 14 (Fourteen), 15 (Fifteen).',
      'Asking "How many": "How many [plural noun] are there?" (كم عدد...؟) ➔ "There are [number] [plural noun]." (يوجد كذا...).',
      'Example: "How many toys are there?" - "There are twelve toys."'
    ],
    interactiveTool: 'english_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Numbers 11 to 15',
        introAr: 'Count things at home and at school.',
        terms: [
            { termAr: 'eleven', meaningAr: '11.', exampleAr: 'I have eleven pencils.' },
            { termAr: 'twelve', meaningAr: '12.', exampleAr: 'There are twelve eggs in a carton.' },
            { termAr: 'fifteen', meaningAr: '15.', exampleAr: 'I can count to fifteen.' },
            { termAr: 'How many?', meaningAr: 'كم؟', exampleAr: 'How many books? Five books.' },
        ],
    },
    examplesAr: [
      {
        problem: 'How do you say "13" in English?',
        solution: '"Thirteen."'
      },
      {
        problem: 'How do you ask "كم عدد الألعاب الموجودة؟" in English?',
        solution: '"How many toys are there?"'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-en3ap-num11-15-1',
        level: 1,
        levelLabelAr: '🟢 Level 1 — Easy',
        problemAr: 'What number comes right after "Ten (10)" in English?',
        hintsAr: ['A special word, not "ten-one"'],
        solutionAr: 'Eleven (11)',
        detailedCorrectionAr: 'Great! 👏 Eleven (11) comes after Ten.',
        xpReward: 10
      },
      {
        id: 'ex2-en3ap-num11-15-2',
        level: 2,
        levelLabelAr: '🟡 Level 2 — Medium',
        problemAr: 'How do you say "14" in English?',
        hintsAr: ['Between thirteen and fifteen'],
        solutionAr: 'Fourteen',
        detailedCorrectionAr: 'Awesome! 🎯 14 = Fourteen.',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-en3ap-u4-num11-15',
      type: 'speed_calc',
      titleAr: '🎮 Counting Challenge (11-15)',
      instructionsAr: 'Match the number with its English word!',
      items: [
        { questionOrPromptAr: 'Number 12 in English:', correctAnswerAr: 'Twelve', optionsAr: ['Twelve', 'Twenty', 'Two'], explanationAr: '12 is Twelve.' },
        { questionOrPromptAr: 'Number 15 in English:', correctAnswerAr: 'Fifteen', optionsAr: ['Fifteen', 'Fifty', 'Five'], explanationAr: '15 is Fifteen.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-num11-15',
        questionAr: 'How do you say "11" in English?',
        options: [
          { id: 'a', textAr: 'Eleven', isCorrect: true, explanationAr: 'Correct! 11 is "Eleven".' },
          { id: 'b', textAr: 'Ten-one', isCorrect: false, explanationAr: '"Eleven" is a special word, not "ten-one".' },
          { id: 'c', textAr: 'Twelve', isCorrect: false, explanationAr: '"Twelve" is 12, not 11.' },
        ]
      },
      {
        id: 'q2-num11-15',
        questionAr: 'Complete: "How many pencils ......?" (كم عدد الأقلام الموجودة؟)',
        options: [
          { id: 'a', textAr: 'are there', isCorrect: true, explanationAr: 'Correct! "How many pencils are there?" is the right question.' },
          { id: 'b', textAr: 'is there', isCorrect: false, explanationAr: '"pencils" is plural, so we use "are", not "is".' },
        ]
      }
    ]
},

{
    id: 'english-3ap-u4-food-drinks',
    grade: '3AP',
    subject: 'english',
    trimester: 3,
    domainAr: 'English Language - Food & Drinks Vocabulary',
    sequenceAr: 'Unit 4 - Sequence 3: Food & Drinks',
    categoryAr: 'اللغة الإنجليزية - الطعام والشراب',
    titleAr: 'UNIT 4 (S3) : FOOD & DRINKS ("I LIKE APPLES", "I DON\'T LIKE MILK")',
    summaryAr: 'Pupils learn vocabulary for common food (apple, banana, bread, rice, chicken, egg, cheese) and drinks (water, milk, juice, tea), and practice expressing likes and dislikes about food with "I like" and "I don\'t like".',
    objectiveAr: 'Name common food and drinks, and express food preferences using "I like" / "I don\'t like".',
    objectivesAr: [
        'أُسَمِّي أَطْعِمَةً وَمَشْرُوبَاتٍ شَائِعَةً بِالإِنْجِلِيزِيَّةِ.',
        'أُعَبِّرُ عَنْ تَفْضِيلِي الغِذَائِيِّ بِـ "I like" وَ"I don\'t like".',
    ],
    detailedCourse: {
        introAr: 'نتعلم اليوم أسماء بعض الأطعمة والمشروبات المألوفة، ونتدرب على التعبير عمّا نحبه وما لا نحبه من الطعام بالإنجليزية.',
        vocabulary: [
            { termAr: 'Food (الطعام)', definitionAr: 'كل ما نأكله، مثل apple, bread, rice, chicken, egg.' },
            { termAr: 'Drinks (المشروبات)', definitionAr: 'كل ما نشربه، مثل water, milk, juice, tea.' },
        ],
        visualizationHintAr: 'اصنع مع طفلك قائمة بأطعمة يحبها وأخرى لا يحبها، واطلب منه قول كل واحدة بجملة "I like..." أو "I don\'t like...".',
        commonMistakes: [
            { mistakeAr: 'استعمال "I have" بدل "I like" للتعبير عن التفضيل الغذائي.', correctionAr: '"I have" تعني الامتلاك، بينما "I like" تعني الإعجاب بطعم شيء — لا تبديل بينهما عند الحديث عن الأذواق.' },
        ],
        takeawayAr: 'Food: apple, banana, bread, rice, chicken, egg, cheese. Drinks: water, milk, juice, tea. I like.../I don\'t like... للتعبير عن التفضيل الغذائي.',
    },
    keyFormulas: [
        { labelAr: 'Expressing food preference', formulaAr: 'I like + [food/drink] | I don\'t like + [food/drink]' },
    ],
    discoveryAr: 'At the table:\n- "What do you like to eat, Amina?" - "I like apples and bread! I don\'t like fish."\n- "What do you like to drink?" - "I like milk and juice. I don\'t like tea."',
    rulesAr: [
      'Food Vocabulary: apple (تفاحة), banana (موزة), bread (خبز), rice (أرز), chicken (دجاج), egg (بيضة), cheese (جبن).',
      'Drinks Vocabulary: water (ماء), milk (حليب), juice (عصير), tea (شاي).',
      'Expressing Preferences: "I like [food/drink]" (أحب...) | "I don\'t like [food/drink]" (لا أحب...).',
      'Asking About Preferences: "Do you like apples?" (هل تحب التفاح؟) ➔ "Yes, I do." (نعم) أو "No, I don\'t." (لا).'
    ],
    interactiveTool: 'english_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Food and drinks',
        introAr: 'I like apples. I don\'t like milk.',
        terms: [
            { termAr: 'an apple', meaningAr: 'تفاحة.', exampleAr: 'I like apples.' },
            { termAr: 'milk', meaningAr: 'حليب.', exampleAr: 'I don\'t like milk.' },
            { termAr: 'bread', meaningAr: 'خبز.', exampleAr: 'I eat bread.' },
            { termAr: 'water', meaningAr: 'ماء.', exampleAr: 'I drink water.' },
        ],
    },
    examplesAr: [
      {
        problem: 'How do you say "أنا أحب التفاح" in English?',
        solution: '"I like apples."'
      },
      {
        problem: 'How do you say "أنا لا أحب الحليب" in English?',
        solution: '"I don\'t like milk."'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-en3ap-food-1',
        level: 1,
        levelLabelAr: '🟢 Level 1 — Easy',
        problemAr: 'What is the English word for "خبز" ?',
        hintsAr: ['Starts with letter B'],
        solutionAr: 'Bread',
        detailedCorrectionAr: 'Well done! 🍞 "Bread" means خبز in English.',
        xpReward: 10
      },
      {
        id: 'ex2-en3ap-food-2',
        level: 2,
        levelLabelAr: '🟡 Level 2 — Medium',
        problemAr: 'Complete: "Do you like fish? - No, I ....." (لا، لا أحب)',
        hintsAr: ['Negative short answer'],
        solutionAr: "don't",
        detailedCorrectionAr: 'Great job! 👏 "No, I don\'t" is the correct negative short answer.',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-en3ap-u4s3',
      type: 'association',
      titleAr: '🎮 Food & Drinks Matching Game',
      instructionsAr: 'Match the English food or drink word to its Arabic translation!',
      items: [
        { questionOrPromptAr: 'Chicken', correctAnswerAr: 'دجاج', optionsAr: ['دجاج', 'جبن', 'أرز'], explanationAr: 'Chicken means دجاج.' },
        { questionOrPromptAr: 'Juice', correctAnswerAr: 'عصير', optionsAr: ['عصير', 'ماء', 'حليب'], explanationAr: 'Juice means عصير.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-u4s3',
        questionAr: 'How do you say "أنا لا أحب الحليب" in English?',
        options: [
          { id: 'a', textAr: "I don't like milk.", isCorrect: true, explanationAr: 'Correct! "I don\'t like milk" is the right negative sentence.' },
          { id: 'b', textAr: 'I like milk.', isCorrect: false, explanationAr: 'Incorrect. "I like milk" expresses that you DO like milk, which is the opposite meaning.' },
          { id: 'c', textAr: 'I have milk.', isCorrect: false, explanationAr: 'Incorrect. "I have milk" expresses possession, not a dislike for milk.' }
        ]
      },
      {
        id: 'q2-u4s3',
        questionAr: 'What is the English word for "تفاحة"?',
        options: [
          { id: 'a', textAr: 'Apple', isCorrect: true, explanationAr: 'Correct! "Apple" means تفاحة in English.' },
          { id: 'b', textAr: 'Banana', isCorrect: false, explanationAr: 'Incorrect. "Banana" means موزة, not تفاحة.' },
          { id: 'c', textAr: 'Bread', isCorrect: false, explanationAr: 'Incorrect. "Bread" means خبز, not تفاحة.' }
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
    summaryAr: 'In this final unit, pupils learn human body parts (head, face, eyes, ears, nose, mouth, hair, hands, legs, feet), numbers 16 to 20 (continuing from 11-15 learned earlier), adjectives of size (big/small, long/short), and complete a comprehensive review of all 3AP English skills.',
    objectiveAr: 'Name body parts, count 16-20, use descriptive adjectives, and demonstrate full mastery of 3AP English curriculum.',
    objectivesAr: [
        'أُسَمِّي أَعْضَاءَ جِسْمِي بِالإِنْجِلِيزِيَّةِ.',
        'أَعُدُّ مِنْ 16 إِلَى 20 بِالإِنْجِلِيزِيَّةِ (بَعْدَ أَنْ تَعَلَّمْتُ 11 إِلَى 15 سَابِقاً).',
        'أُرَاجِعُ كُلَّ مَا تَعَلَّمْتُهُ خِلاَلَ السَّنَةِ.',
    ],
    detailedCourse: {
        introAr: 'هذه آخر وحدة في السنة، نتعرف فيها على أعضاء الجسم ونُكمل العدّ من حيث توقفنا حتى 20، ونراجع كل ما تعلمناه هذه السنة في الإنجليزية.',
        vocabulary: [
            { termAr: 'Body parts', definitionAr: 'مفردات أعضاء الجسم: head, face, eyes, ears, nose, mouth, hands, legs.' },
            { termAr: 'Antonyms (الأضداد)', definitionAr: 'كلمات متضادة في المعنى: big ↔ small, long ↔ short.' },
        ],
        visualizationHintAr: 'العب لعبة "المعلم يقول" (Simon Says): "Touch your head!"، "Touch your nose!" مع صديق.',
        commonMistakes: [
            { mistakeAr: 'الخلط بين الأعداد المفردة (16-19) وأعداد العشرات (60-90) بسبب تشابه النطق.', correctionAr: 'الأعداد sixteen (16) وsixty (60) تبدو متشابهة، يجب الانتباه للنهاية: -teen للآحاد، -ty للعشرات.' },
        ],
        takeawayAr: 'أعضاء الجسم: head, eyes, ears, nose, mouth, hands, legs, feet. الأرقام 16-20: sixteen إلى twenty (تكملة 11-15). الأضداد: big/small, long/short.',
    },
    keyFormulas: [
        { labelAr: 'الأعداد 16-20', formulaAr: 'Sixteen, Seventeen, Eighteen, Nineteen, Twenty' },
    ],
    discoveryAr: 'Teacher leads the "Simon Says" game:\n- Teacher: "Touch your head! Touch your nose! Open your eyes!"\n- Pupils: "I have two eyes 👀, two ears 👂, one nose 👃, and one mouth 👄!"\n- Teacher: "We know 11 to 15 already. Let\'s continue: Sixteen, Seventeen, Eighteen, Nineteen, Twenty!"',
    rulesAr: [
      'Body Parts Vocabulary:\n- Head (رأس)\n- Face (وجه)\n- Eyes (عينان)\n- Ears (أذنان)\n- Nose (أنف)\n- Mouth (فم)\n- Hair (شعر)\n- Hands (يدان)\n- Arms (ذراعان)\n- Legs (ساقان)\n- Feet (قدمان)\n- Fingers (أصابع اليد).',
      'Numbers 16 to 20 (تكملة الأرقام 11-15 التي تعلمناها سابقاً):\n- 16 (Sixteen), 17 (Seventeen), 18 (Eighteen), 19 (Nineteen), 20 (Twenty).',
      'Descriptive Adjectives & Antonyms:\n- Big (كبير) ↔ Small (صغير)\n- Long (طويل) ↔ Short (قصير)\n- Example: "A big dog with small ears" | "Long hair".',
      'Annual 3AP Synthesis Checklist:\n1) Greet & introduce myself\n2) Name family, friends, school objects, colors, shapes, house rooms, toys, pets & body parts\n3) Count 1 to 20\n4) Follow classroom commands.'
    ],
    interactiveTool: 'english_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'My body',
        introAr: 'Head, hand, leg — 3AP body words, then a short review.',
        terms: [
            { termAr: 'head', meaningAr: 'رأس.', exampleAr: 'This is my head.' },
            { termAr: 'hand', meaningAr: 'يد.', exampleAr: 'I have two hands.' },
            { termAr: 'leg', meaningAr: 'رجل.', exampleAr: 'I have two legs.' },
            { termAr: 'eye', meaningAr: 'عين.', exampleAr: 'I have two eyes.' },
        ],
    },
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
        id: 'ex2-en3ap-num16-2',
        level: 2,
        levelLabelAr: '🟡 Level 2 — Medium',
        problemAr: 'What number is "Seventeen" in figures?',
        hintsAr: ['Between 16 and 18'],
        solutionAr: '17',
        detailedCorrectionAr: 'Awesome! 🎯 Seventeen = 17.',
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
        { questionOrPromptAr: 'Number 18 in English word is:', correctAnswerAr: 'Eighteen', optionsAr: ['Eighteen', 'Twelve', 'Eighty'], explanationAr: '18 is Eighteen.' }
      ],
      xpReward: 25
    },
    quiz: [
      {
        id: 'q1-u5s1',
        questionAr: 'Which phrase correctly describes a elephant in English?',
        options: [
          { id: 'a', textAr: 'A big animal with big ears.', isCorrect: true, explanationAr: 'Correct! An elephant is a big animal with big ears.' },
          { id: 'b', textAr: 'A small bird with a book.', isCorrect: false, explanationAr: 'Incorrect. This describes a small bird, not a big animal like an elephant.' },
          { id: 'c', textAr: 'A small animal with a long tail.', isCorrect: false, explanationAr: 'Incorrect. An elephant is described as big, not small — this description does not match an elephant.' }
        ]
      },
      {
        id: 'q2-u5s1',
        questionAr: 'What is the English word for the number "19"?',
        options: [
          { id: 'a', textAr: 'Nineteen', isCorrect: true, explanationAr: 'Correct! 19 is "Nineteen" in English.' },
          { id: 'b', textAr: 'Ninety', isCorrect: false, explanationAr: 'Incorrect. "Ninety" is 90, not 19 — be careful not to confuse "-teen" numbers with "-ty" numbers.' },
          { id: 'c', textAr: 'Nine', isCorrect: false, explanationAr: 'Incorrect. "Nine" is 9, not 19.' }
        ]
      }
    ]
},
];

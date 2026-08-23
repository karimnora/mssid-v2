import { CourseLesson } from '../../../types';

// 7 leçon(s) — english / 4AP
export const ENGLISH_4AP: CourseLesson[] = [
// ==========================================
// 17. ENGLISH LANGUAGE - 4AP (اللغة الإنجليزية - السنة الرابعة ابتدائي الجيل الثاني)
// ==========================================
{
    id: 'english-4ap-unit1-family-friends',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 1: Family & Friends',
    trimester: 1,
    objectivesAr: [
        'أُقدّم نفسي بالإنجليزية (الاسم، العمر، البلد).',
        'أستعمل الضمائر الشخصية وصفات الملكية بشكل صحيح.',
        'أُسمّي أفراد عائلتي بالإنجليزية.',
    ],
    detailedCourse: {
        introAr: 'لتقديم نفسك وعائلتك بالإنجليزية، تحتاج إلى الضمائر الشخصية (I, He, She...) وصفات الملكية المرافقة لها (My, His, Her...) — كل ضمير له صفة ملكية خاصة به.',
        vocabulary: [
            { termAr: 'Personal pronouns', definitionAr: 'الضمائر الشخصية: I (أنا)، You (أنتَ/أنتِ)، He (هو)، She (هي).' },
            { termAr: 'Possessive adjectives', definitionAr: 'صفات الملكية المرافقة: My (لي)، Your (لكَ)، His (له)، Her (لها).' },
        ],
        visualizationHintAr: 'ارسم شجرة عائلتك واكتب تحت كل شخص جملة تبدأ بـ "This is my..." متبوعة بجملة تصفه بـ "His/Her name is...".',
        commonMistakes: [
            { mistakeAr: 'الخلط بين His و Her.', correctionAr: '"His" تُستعمل للمذكر (له)، و"Her" للمؤنث (لها) — يجب معرفة جنس الشخص المتحدث عنه أولاً.' },
        ],
        takeawayAr: 'كل ضمير شخصي له صفة ملكية مرافقة: I → My, He → His, She → Her. نستعملها للتعريف بأنفسنا وبأفراد عائلتنا.',
    },
    titleAr: 'Unit 1: Me, My Family & My Friends (التعريف بالنفس، العائلة والضمائر)',
    summaryAr: `يتعلم تلميذ السنة الرابعة ابتدائي (4AP) كيفية التقديم الذاتي باللغة الإنجليزية (الاسم، العمر، البلد)، والتعريف بأفراد العائلة والأصدقاء باستخدام الضمائر الشخصية (I, You, He, She) وصفات الملكية (My, Your, His, Her)، والتعرف على الأرقام حتى 20.`,
    rulesAr: [
        'Greetings & Introductions: Hello / Hi! My name is [Name]. I am 9 years old. I am from Algeria. Nice to meet you!',
        'Family Members: father (dad), mother (mum), brother, sister, grandfather, grandmother, uncle, aunt.',
        'Personal Pronouns: I (أنا), You (أنتَ/أنتِ), He (هو للمذكر), She (هي للمؤنث), It (هو/هي لغير العاقل).',
        'Possessive Adjectives: My (لي), Your (لكَ/لكِ), His (له للمذكر), Her (لها للمؤنث). Example: "This is my father. His name is Yacine."',
        'Phonics & Sound /h/ & /f/: Sound /h/ as in (Hello, House, Hand) and /f/ as in (Father, Family, Five).'
    ],
    keyFormulas: [
        { labelAr: 'التعريف بالفرد من العائلة', formulaAr: 'This is my [father/mother]. His/Her name is [Name].' },
        { labelAr: 'السؤال عن الاسم والعمر', formulaAr: 'What\'s your name? / How old are you?' }
    ],
    examplesAr: [
        {
            problem: 'Dialogue & Family Tree (الحوار والتعريف بالعائلة):\nRead and complete the dialogue between Amine and his new friend Jack:\nAmine: "Hello! My name ......... Amine. What\'s ......... name?"\nJack: "Hi! My name is Jack. How old are you?"\nAmine: "I ......... 9 years old. This is ......... sister. ......... name is Meriem."',
            solution: 'Completed Dialogue:\nAmine: "Hello! My name is Amine. What\'s your name?"\nJack: "Hi! My name is Jack. How old are you?"\nAmine: "I am 9 years old. This is my sister. Her name is Meriem."'
        }
    ],
    interactiveTool: 'english_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'Choose the correct possessive adjective: "This is my mother. ...... name is Amina."',
            options: [
                { id: 'a', textAr: 'Her', isCorrect: true, explanationAr: 'Correct! "Her" is used for female singular possessive (Her name = اسمها).' },
                { id: 'b', textAr: 'His', isCorrect: false },
                { id: 'c', textAr: 'My', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Which pronoun replaces "My brother" ?',
            options: [
                { id: 'a', textAr: 'He', isCorrect: true, explanationAr: 'Excellent! "He" is the male singular personal pronoun (هو).' },
                { id: 'b', textAr: 'She', isCorrect: false },
                { id: 'c', textAr: 'It', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'english-4ap-unit1-jobs-occupations',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 1: Family & Friends',
    trimester: 1,
    objectivesAr: [
        'أُسمّي مهناً شائعة بالإنجليزية.',
        'أسأل عن مهنة شخص بـ "What does he/she do?"',
        'أُجيب بتركيب "He/She is a/an [job]."',
    ],
    detailedCourse: {
        introAr: 'بعد أن تعلمنا التعريف بأفراد عائلتنا، نتعلم اليوم كيف نتحدث عن مهنة كل واحد منهم بالإنجليزية.',
        vocabulary: [
            { termAr: 'Occupation / Job', definitionAr: 'المهنة، العمل الذي يمارسه شخص لكسب رزقه.' },
            { termAr: 'a / an + job', definitionAr: 'نستعمل "a" قبل مهنة تبدأ بصوت ساكن، و"an" قبل مهنة تبدأ بصوت متحرك.' },
        ],
        visualizationHintAr: 'ارسم مع طفلك جدولاً بأفراد العائلة ومهنة كل واحد منهم، واكتبا معاً جملة "He/She is a/an..." لكل شخص.',
        commonMistakes: [
            { mistakeAr: 'نسيان "a" أو "an" قبل اسم المهنة.', correctionAr: 'في الإنجليزية، نضع دائماً "a" أو "an" قبل اسم المهنة: "She is a teacher"، وليس "She is teacher".' },
        ],
        takeawayAr: 'نسأل عن المهنة بـ "What does he/she do?" ونجيب بـ "He/She is a/an [job]." نستعمل "an" قبل الأصوات المتحركة مثل "an engineer".',
    },
    titleAr: 'Unit 1 (bis): What Does Your Father Do? - Jobs & Occupations',
    summaryAr: `يتعلم التلميذ أسماء المهن الشائعة (Teacher, Doctor, Policeman, Pilot, Engineer) ويستعمل تركيب "He/She is a/an..." للتعبير عن مهنة فرد من عائلته والسؤال عنها.`,
    rulesAr: [
        'Common Jobs: teacher (معلم), doctor (طبيب), policeman/policewoman (شرطي), pilot (طيار), farmer (فلاح), engineer (مهندس), nurse (ممرضة), baker (خباز).',
        'Asking about a job: "What does your father do?" ➔ "He is a doctor."',
        'Using a/an: نستعمل "a" قبل صوت ساكن (a teacher, a doctor)، و"an" قبل صوت متحرك (an engineer, an artist).',
        'Describing what a job does: "A teacher teaches students." "A doctor helps sick people." "A pilot flies planes."'
    ],
    keyFormulas: [
        { labelAr: 'السؤال عن المهنة', formulaAr: 'What does he/she do? ➔ He/She is a/an [job].' },
        { labelAr: 'قاعدة a/an', formulaAr: 'a + صوت ساكن (a nurse) | an + صوت متحرك (an engineer)' }
    ],
    examplesAr: [
        {
            problem: 'How do you say "أمي طبيبة" in English?',
            solution: '"My mother is a doctor."'
        },
        {
            problem: 'Which article (a/an) goes before "engineer"?',
            solution: '"an engineer" (لأن engineer يبدأ بصوت متحرك /e/).'
        }
    ],
    interactiveTool: 'english_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'What does a teacher do?',
            options: [
                { id: 'a', textAr: 'A teacher teaches students.', isCorrect: true, explanationAr: 'Correct! Teachers work to teach students at school.' },
                { id: 'b', textAr: 'A teacher flies planes.', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Choose the correct article: "My uncle is ...... pilot."',
            options: [
                { id: 'a', textAr: 'a', isCorrect: true, explanationAr: 'Correct! "pilot" starts with a consonant sound, so we use "a".' },
                { id: 'b', textAr: 'an', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'english-4ap-unit2-school-classroom',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 2: School & Classroom',
    trimester: 1,
    objectivesAr: [
        'أُسمّي الأدوات المدرسية بالإنجليزية.',
        'أفهم وأُطبّق الأوامر الصفية الشائعة.',
        'أستعمل حروف الجر in / on / under لتحديد مكان شيء.',
    ],
    detailedCourse: {
        introAr: 'داخل القسم، نستعمل كلمات كثيرة يومياً: أسماء الأدوات المدرسية، أوامر المعلم، وحروف جر صغيرة تساعدنا على تحديد أين يوجد كل شيء بالضبط.',
        vocabulary: [
            { termAr: 'Prepositions of place', definitionAr: 'حروف جر المكان: in (في/داخل)، on (على/فوق)، under (تحت).' },
            { termAr: 'Classroom commands', definitionAr: 'الأوامر التي يستعملها المعلم في القسم: Stand up! Sit down! Listen!' },
        ],
        visualizationHintAr: 'انظر إلى طاولتك الآن وصف مكان 3 أشياء عليها باستعمال in / on / under، مثل: "The pencil is on the table."',
        commonMistakes: [
            { mistakeAr: 'الخلط بين in و on عند وصف مكان شيء.', correctionAr: '"in" تعني داخل شيء مغلق (in the bag)، بينما "on" تعني فوق سطح (on the table) — الفرق مهم جداً في المعنى.' },
        ],
        takeawayAr: 'حروف جر المكان الثلاثة: in (داخل)، on (فوق)، under (تحت) — تساعدنا على وصف مكان أي غرض مدرسي بدقة.',
    },
    titleAr: 'Unit 2: My School & My Classroom (الأدوات المدرسية، الأوامر الصفية وحروف الجر)',
    summaryAr: `يتعرف التلميذ على تسميات الأدوات المدرسية (pen, pencil, book, ruler, rubber)، وأجزاء المدرسة، والأوامر الصفية التي يوجهها المعلم (Listen, Stand up, Sit down, Read, Write)، إضافة إلى حروف الجر الأساسية (in, on, under).`,
    rulesAr: [
        'School Supplies: a book, a notebook, a pen, a pencil, a ruler, a rubber (eraser), a pencil case, a school bag, a desk, a board.',
        'Classroom Commands (الأوامر الصفية): Stand up! Sit down! Listen! Look at the board! Raise your hand! Open your book! Write!',
        'Prepositions of Place (حروف الجر): in (في/داخل), on (على/فوق), under (تحت). Example: "The pen is on the desk. The ruler is in the pencil case."',
        'Days of the Week: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.',
        'Phonics & Sound /b/ & /p/: Sound /b/ (Book, Bag, Board) vs Sound /p/ (Pen, Pencil, Paper).'
    ],
    keyFormulas: [
        { labelAr: 'السؤال عن مكان الشيء', formulaAr: 'Where is the [object]? ➔ It is in / on / under the [place].' },
        { labelAr: 'الأمر الصفي المباشر', formulaAr: '[Verb] + your [object]! (e.g. Open your book!)' }
    ],
    examplesAr: [
        {
            problem: 'Classroom Situation (تحديد موقع الأشياء في القسم):\nLook at the classroom picture and complete with (in, on, under):\n1) The book is ......... the desk.\n2) The ruler is ......... the pencil case.\n3) The school bag is ......... the chair.',
            solution: '1) The book is on the desk. (الكتاب فوق المكتب)\n2) The ruler is in the pencil case. (المسطرة داخل الململمة)\n3) The school bag is under the chair. (المحفظة تحت الكرسي)'
        }
    ],
    interactiveTool: 'english_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'What is the correct classroom command for "افتح كتابك" ?',
            options: [
                { id: 'a', textAr: 'Open your book!', isCorrect: true, explanationAr: 'Great! "Open your book!" means افتح كتابك.' },
                { id: 'b', textAr: 'Close your book!', isCorrect: false },
                { id: 'c', textAr: 'Raise your hand!', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Complete the sentence: "The pencil is ...... the table" (القلم فوق الطاولة).',
            options: [
                { id: 'a', textAr: 'on', isCorrect: true, explanationAr: 'Correct! "on" means فوق / على الأسقف والمكاتب.' },
                { id: 'b', textAr: 'in', isCorrect: false },
                { id: 'c', textAr: 'under', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'english-4ap-unit2-basic-time-routines',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 2: My Daily Routine',
    trimester: 1,
    objectivesAr: [
        'أَسْأَلُ عَنِ الوَقْتِ وَأُجِيبُ بِـ "It\'s ... o\'clock".',
        'أَصِفُ رُوتِينِي اليَوْمِيَّ بِأَفْعَالٍ بَسِيطَةٍ فِي الحَاضِرِ.',
    ],
    detailedCourse: {
        introAr: 'لمعرفة الوقت بالإنجليزية نسأل "What time is it?" ونجيب بـ "It\'s ... o\'clock". ولوصف يومنا نستعمل أفعالاً بسيطة مثل wake up وgo to school.',
        vocabulary: [
            { termAr: 'What time is it?', definitionAr: 'سؤال عن الوقت الحالي، الإجابة عليه تكون بصيغة "It\'s ... o\'clock".' },
            { termAr: 'Daily routine', definitionAr: 'الأنشطة التي نقوم بها كل يوم بنفس الترتيب تقريباً، مثل الاستيقاظ والذهاب للمدرسة.' },
        ],
        visualizationHintAr: 'ارسم ساعة بعقارب متحركة مع طفلك واطلب منه قول الوقت بالإنجليزية "It\'s ... o\'clock" لأوقات مختلفة من يومه.',
        commonMistakes: [
            { mistakeAr: 'نسيان "o\'clock" عند الإجابة عن السؤال عن الوقت.', correctionAr: 'الإجابة الكاملة يجب أن تحتوي "o\'clock" بعد الرقم: "It\'s seven o\'clock"، وليس "It\'s seven" فقط.' },
        ],
        takeawayAr: 'What time is it? - It\'s [number] o\'clock. Daily routine: wake up, get up, eat breakfast, go to school, go to bed.',
    },
    titleAr: 'Unit 2: What Time Is It? My Daily Routine (Telling the Hour with o\'clock)',
    summaryAr: `Pupils learn to ask and tell the time using "What time is it? - It's ... o'clock", and to describe their daily routine with simple present verbs (wake up, get up, eat breakfast, go to school, go to bed) — the foundation for reading half-past and quarter-past times in the next lesson.`,
    rulesAr: [
      'Asking the Time: "What time is it?" (كم الساعة؟) ➔ "It\'s [number] o\'clock" (الساعة كذا تماماً).',
      'Daily Routine Verbs: wake up (أستيقظ), get up (أنهض), eat breakfast (أتناول الفطور), go to school (أذهب إلى المدرسة), do homework (أُنجز واجباتي), go to bed (أخلد إلى النوم).',
      'Structure with Time: "I [verb] at [time] o\'clock." Example: "I wake up at seven o\'clock." "I go to bed at nine o\'clock."',
      'Order of the Day: morning (الصباح) ➔ afternoon (بعد الظهر) ➔ evening (المساء) ➔ night (الليل).'
    ],
    keyFormulas: [
        { labelAr: 'Telling the time', formulaAr: 'It\'s + [number] + o\'clock' },
    ],
    examplesAr: [
      {
        problem: 'How do you ask "كم الساعة؟" in English?',
        solution: '"What time is it?"'
      },
      {
        problem: 'How do you say "أذهب إلى المدرسة الساعة الثامنة" in English?',
        solution: '"I go to school at eight o\'clock."'
      }
    ],
    interactiveTool: 'english_lab',
    progressiveExercises: [
      {
        id: 'ex1-en4ap-time-1',
        level: 1,
        levelLabelAr: '🟢 Level 1 — Easy',
        problemAr: 'How do you say "أستيقظ" in English?',
        hintsAr: ['Two words: wake ...'],
        solutionAr: 'Wake up',
        detailedCorrectionAr: 'Well done! 🌅 "Wake up" means أستيقظ.',
        xpReward: 10
      },
      {
        id: 'ex2-en4ap-time-2',
        level: 2,
        levelLabelAr: '🟡 Level 2 — Medium',
        problemAr: 'Complete: "It\'s eight ....." (الساعة الثامنة تماماً)',
        hintsAr: ['A word that always follows the hour number'],
        solutionAr: "o'clock",
        detailedCorrectionAr: 'Awesome! 🎯 "It\'s eight o\'clock" means الساعة الثامنة تماماً.',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-en4ap-time-routines',
      type: 'association',
      titleAr: '🎮 My Day Time Challenge',
      instructionsAr: 'Match the daily activity to its correct time expression!',
      items: [
        { questionOrPromptAr: 'I ..... at seven o\'clock in the morning.', correctAnswerAr: 'wake up', optionsAr: ['wake up', 'go to bed', 'eat dinner'], explanationAr: 'We wake up in the morning.' },
        { questionOrPromptAr: 'I ..... at nine o\'clock at night.', correctAnswerAr: 'go to bed', optionsAr: ['go to bed', 'wake up', 'go to school'], explanationAr: 'We go to bed at night.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-time-routines',
        questionAr: 'What is the correct answer to "What time is it?" when the clock shows 7:00?',
        options: [
          { id: 'a', textAr: 'It\'s seven o\'clock.', isCorrect: true, explanationAr: 'Correct! "It\'s seven o\'clock" is the right way to tell the time.' },
          { id: 'b', textAr: 'It\'s seven.', isCorrect: false, explanationAr: 'A full answer must include "o\'clock" after the number.' },
          { id: 'c', textAr: 'It\'s seven minutes.', isCorrect: false, explanationAr: '"o\'clock" means the exact hour, not minutes.' },
        ]
      },
      {
        id: 'q2-time-routines',
        questionAr: 'Which verb means "أذهب إلى المدرسة" ?',
        options: [
          { id: 'a', textAr: 'go to school', isCorrect: true, explanationAr: 'Correct! "go to school" means أذهب إلى المدرسة.' },
          { id: 'b', textAr: 'go to bed', isCorrect: false, explanationAr: '"go to bed" means أخلد إلى النوم, not أذهب إلى المدرسة.' },
        ]
      }
    ]
},

{
    id: 'english-4ap-unit2-telling-time',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 2: School & Classroom',
    trimester: 1,
    objectivesAr: [
        'أسأل عن الوقت بـ "What time is it?" وأجيب بصيغة o\'clock.',
        'أقرأ الوقت بصيغة "half past" (والنصف).',
        'أقرأ الوقت بصيغتي "quarter past" و"quarter to" (والربع، وإلا ربع).',
    ],
    detailedCourse: {
        introAr: 'بعد أن تعلمنا قول الساعة الكاملة (o\'clock)، نتعلم اليوم قراءة أوقات أكثر دقة: النصف بعد الساعة، والربع بعد أو قبل الساعة.',
        vocabulary: [
            { termAr: 'Half past', definitionAr: 'تعني "والنصف"، أي 30 دقيقة بعد الساعة (half past 7 = 7:30).' },
            { termAr: 'Quarter past / Quarter to', definitionAr: '"quarter past" تعني والربع (15 دقيقة بعد)، و"quarter to" تعني إلا ربع (15 دقيقة قبل الساعة التالية).' },
        ],
        visualizationHintAr: 'ارسم ساعة كبيرة بعقارب، وحرّك العقرب الكبير إلى 6 (half past)، ثم إلى 3 (quarter past)، ثم إلى 9 (quarter to) لتوضيح كل حالة.',
        commonMistakes: [
            { mistakeAr: 'الخلط بين "quarter past" و"quarter to".', correctionAr: '"quarter past" تعني 15 دقيقة بعد الساعة الحالية، بينما "quarter to" تعني 15 دقيقة قبل الساعة التالية.' },
        ],
        takeawayAr: '"half past [hour]" = والنصف. "quarter past [hour]" = والربع. "quarter to [next hour]" = إلا ربع.',
    },
    titleAr: 'Unit 2 (bis): What Time Is It? - Telling Time (Half Past, Quarter Past/To)',
    summaryAr: `يتعلم التلميذ قراءة الوقت بالإنجليزية بدقة أكبر بعد الساعات الكاملة: الساعة والنصف (half past)، والربع بعد وقبل الساعة (quarter past / quarter to).`,
    rulesAr: [
        'Asking the time: "What time is it?" ➔ "It\'s [time]."',
        'Half past: يعني 30 دقيقة بعد الساعة. مثال: 7:30 = "half past seven."',
        'Quarter past: يعني 15 دقيقة بعد الساعة. مثال: 7:15 = "quarter past seven."',
        'Quarter to: يعني 15 دقيقة قبل الساعة التالية. مثال: 7:45 = "quarter to eight" (وليس quarter to seven).'
    ],
    keyFormulas: [
        { labelAr: 'Half past', formulaAr: 'half past + [الساعة الحالية] = XX:30' },
        { labelAr: 'Quarter to', formulaAr: 'quarter to + [الساعة التالية] = XX:45' }
    ],
    examplesAr: [
        {
            problem: 'How do you say 8:30 in English?',
            solution: '"half past eight" (النصف بعد الساعة الثامنة).'
        },
        {
            problem: 'How do you say 8:45 in English?',
            solution: '"quarter to nine" (إلا ربع على التاسعة، وليس "quarter to eight").'
        }
    ],
    interactiveTool: 'english_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'What time is "quarter past four"?',
            options: [
                { id: 'a', textAr: '4:15', isCorrect: true, explanationAr: 'Correct! "quarter past four" means 15 minutes after 4 o\'clock.' },
                { id: 'b', textAr: '4:45', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'How do you say 9:30 in English?',
            options: [
                { id: 'a', textAr: 'half past nine', isCorrect: true, explanationAr: 'Correct! "half past nine" means 30 minutes after 9 o\'clock.' },
                { id: 'b', textAr: 'quarter past nine', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'english-4ap-unit3-home-rooms',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 3: My Home & Rooms',
    trimester: 1,
    objectivesAr: [
        'أُسمّي غرف المنزل والأثاث بالإنجليزية.',
        'أستعمل There is / There are بشكل صحيح حسب العدد.',
    ],
    detailedCourse: {
        introAr: '"There is" و "There are" تعنيان "يوجد" بالعربية، لكن الاختيار بينهما يعتمد على عدد الأشياء التي نتحدث عنها: واحد أم أكثر من واحد.',
        vocabulary: [
            { termAr: 'There is', definitionAr: 'تُستعمل مع الاسم المفرد: There is a bed (يوجد سرير واحد).' },
            { termAr: 'There are', definitionAr: 'تُستعمل مع الاسم الجمع: There are two chairs (يوجد كرسيان).' },
        ],
        visualizationHintAr: 'انظر إلى غرفتك وعُدّ الأشياء الموجودة فيها: كل شيء واحد يبدأ بـ "There is"، وكل مجموعة أشياء تبدأ بـ "There are".',
        commonMistakes: [
            { mistakeAr: 'استعمال "There is" مع اسم جمع.', correctionAr: 'إذا كان العدد أكبر من واحد، يجب استعمال "There are" وليس "There is"، حتى لو نسينا ذلك أحياناً في الحديث السريع.' },
        ],
        takeawayAr: '"There is" + اسم مفرد، "There are" + اسم جمع — نختار حسب عدد الأشياء التي نصفها.',
    },
    titleAr: 'Unit 3: My Home & My Room (أجزاء المنزل، الأثاث، وقاعدتي There is / There are)',
    summaryAr: `يتعلم التلميذ مفردات المنزل وأركانه (bedroom, kitchen, living room, bathroom, garden) والأثاث المنزلي، مع التمكن من التعبير عن الوجود باستخدام "There is" للمفرد و "There are" للجمع.`,
    rulesAr: [
        'Rooms of the House: bedroom (غرفة النوم), kitchen (المطبخ), living room (غرفة المعيشة), bathroom (الحمام), dining room (غرفة الطعام), garden (الحديقة).',
        'House Furniture: bed, chair, table, sofa, TV, fridge, wardrobe, lamp.',
        'There is vs There are: "There is" + Singular noun (يوجد للمفرد - e.g. There is a bed in my bedroom). "There are" + Plural noun (يوجد للجمع - e.g. There are two chairs in the kitchen).',
        'Locating Rooms: "Where is mum? - She is in the kitchen." "Where is dad? - He is in the garden."',
        'Phonics & Sound /θ/ (th): as in (Three, Thirty, Thank you, Bath, Bathroom).'
    ],
    keyFormulas: [
        { labelAr: 'التعبير عن الوجود المفرد والجمع', formulaAr: 'There is a [singular]  |  There are [number] [plural]' },
        { labelAr: 'السؤال عن مكان الشخص في المنزل', formulaAr: 'Where is [person]? ➔ He / She is in the [room].' }
    ],
    examplesAr: [
        {
            problem: 'House Description (وصف أركان المنزل):\nFill in the blanks with (There is / There are):\n1) ......... a big sofa in the living room.\n2) ......... three chairs around the kitchen table.\n3) ......... a comfortable bed in my bedroom.',
            solution: '1) There is a big sofa in the living room.\n2) There are three chairs around the kitchen table.\n3) There is a comfortable bed in my bedroom.'
        }
    ],
    interactiveTool: 'english_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'Choose the correct option: "...... two beds in the children\'s room."',
            options: [
                { id: 'a', textAr: 'There are', isCorrect: true, explanationAr: 'Bravo! "two beds" is plural (جمع), so we use "There are".' },
                { id: 'b', textAr: 'There is', isCorrect: false },
                { id: 'c', textAr: 'It is', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Where do we cook food in the house?',
            options: [
                { id: 'a', textAr: 'In the kitchen', isCorrect: true, explanationAr: 'Correct! The kitchen (المطبخ) is where we prepare and cook meals.' },
                { id: 'b', textAr: 'In the bathroom', isCorrect: false },
                { id: 'c', textAr: 'In the bedroom', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'english-4ap-unit4-food-meals',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 4: Food & Meals',
    trimester: 2,
    objectivesAr: [
        'أُسمّي الأطعمة والمشروبات بالإنجليزية.',
        'أُميّز بين الأكل الصحي وغير الصحي.',
        'أُعبّر عن تفضيلاتي الغذائية بـ I like / I don\'t like.',
    ],
    detailedCourse: {
        introAr: 'للتعبير عما نحب وما لا نحب من الطعام بالإنجليزية، نستعمل عبارتين بسيطتين جداً: "I like" و "I don\'t like"، متبوعتين باسم الطعام.',
        vocabulary: [
            { termAr: 'I like / I don\'t like', definitionAr: 'أنا أحب / أنا لا أحب — للتعبير عن التفضيل الغذائي.' },
            { termAr: 'Healthy food', definitionAr: 'الطعام الصحي المفيد للجسم (فواكه، خضروات، حليب).' },
        ],
        visualizationHintAr: 'اكتب قائمتين: "I like..." و"I don\'t like..." واملأهما بأطعمة حقيقية تحبها أو لا تحبها.',
        commonMistakes: [
            { mistakeAr: 'نسيان "don\'t" عند التعبير عن عدم الإعجاب.', correctionAr: 'الجملة السلبية تحتاج دائماً إلى "don\'t": "I don\'t like soda"، وليس "I not like soda".' },
        ],
        takeawayAr: '"I like [food]" للتعبير عن الإعجاب، و"I don\'t like [food]" لعكسه؛ والطعام الصحي يشمل الفواكه والخضروات والحليب.',
    },
    titleAr: 'Unit 4: Food, Drinks & Meals (الأطعمة، المشروبات، والتعبير عن التفضيل I like / I don\'t like)',
    summaryAr: `يتعرف التلميذ على أسماء الأطعمة والمشروبات والفواكه والخضروات، والتمييز بين الأكل الصحي والغير صحي (Healthy vs Unhealthy food)، والتعبير عن الذوق والتفضيل باستخدام "I like" و "I don't like" و "I want".`,
    rulesAr: [
        'Food & Drinks Vocabulary: bread, milk, cheese, eggs, meat, chicken, rice, soup, water, juice, tea, apple, banana, dates (التمر), couscous (الكسكسي الجزائرية).',
        'Healthy vs Unhealthy Food: Healthy (apples, milk, salad, carrots, water) vs Unhealthy (candies, soda, chips, chocolate).',
        'Expressing Likes & Dislikes: "I like [food]" (أنا أحب) / "I don\'t like [food]" (أنا لا أحب). Example: "I like dates and milk. I don\'t like soda."',
        'Polite Requests with "I want": "Can I have some water, please? - Yes, here you are. / I want an apple, please."',
        'Phonics & Sound /ch/ & /sh/: Sound /ch/ as in (Chicken, Cheese, Chocolate) and Sound /sh/ as in (Fish, Dish, Shop).'
    ],
    keyFormulas: [
        { labelAr: 'التعبير عن الإعجاب بالأكل', formulaAr: 'I like [food]  |  I don\'t like [food]' },
        { labelAr: 'الطلب المؤدب', formulaAr: 'Can I have some [food/drink], please?' }
    ],
    examplesAr: [
        {
            problem: 'Healthy Eating Habits (حوار التغذية الصحية):\nComplete the dialogue between Lamine and his mother at dinner:\nLamine: "Mum, I am hungry. Can I have some ........., please?"\nMum: "Here you are, Lamine. Drink your ......... too, it is good for your health."\nLamine: "Thank you, Mum! I like healthy food."',
            solution: 'Lamine: "Mum, I am hungry. Can I have some couscous, please?"\nMum: "Here you are, Lamine. Drink your milk too, it is good for your health."\nLamine: "Thank you, Mum! I like healthy food."'
        }
    ],
    interactiveTool: 'english_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'Which of the following is a healthy food choice (طعام صحي) ?',
            options: [
                { id: 'a', textAr: 'Fresh apples and salad', isCorrect: true, explanationAr: 'Great! Apples and fresh salad are rich in vitamins and healthy.' },
                { id: 'b', textAr: 'Sodas and excessive candies', isCorrect: false },
                { id: 'c', textAr: 'Potato chips every day', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'How do you say "أنا لا أحب Soda" in English ?',
            options: [
                { id: 'a', textAr: 'I don\'t like soda.', isCorrect: true, explanationAr: 'Correct! "I don\'t like" expresses negative preference (لا أحب).' },
                { id: 'b', textAr: 'I like soda.', isCorrect: false },
                { id: 'c', textAr: 'I have soda.', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'english-4ap-unit5-pets-animals',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 5: Pets & Animals',
    trimester: 2,
    objectivesAr: [
        'أُسمّي الحيوانات الأليفة وأجزاء جسمها بالإنجليزية.',
        'أستعمل has got لوصف خصائص الحيوان.',
        'أستعمل can / cannot للتعبير عن قدرات الحيوان.',
    ],
    detailedCourse: {
        introAr: 'لوصف حيوان بالإنجليزية، نستعمل "has got" لأجزاء جسمه (له...)، و"can/cannot" لما يستطيع أو لا يستطيع فعله.',
        vocabulary: [
            { termAr: 'has got', definitionAr: 'يملك/له — تُستعمل لوصف أجزاء جسم الحيوان: It has got a tail (له ذيل).' },
            { termAr: 'can / cannot', definitionAr: 'يستطيع / لا يستطيع — تُستعمل للتعبير عن قدرات الحيوان: A bird can fly.' },
        ],
        visualizationHintAr: 'اختر حيواناً أليفاً تعرفه واكتب جملتين عنه: واحدة بـ "has got" (تصف جسمه) وواحدة بـ "can" (تصف ما يستطيع فعله).',
        commonMistakes: [
            { mistakeAr: 'استعمال "have got" بدل "has got" مع حيوان مفرد.', correctionAr: 'مع ضمير مفرد غائب (it) نستعمل "has got" وليس "have got": "The cat has got soft fur".' },
        ],
        takeawayAr: '"has got" لوصف أجزاء جسم الحيوان، و"can/cannot" لوصف قدراته: A bird can fly but cannot swim.',
    },
    titleAr: 'Unit 5: Pets & Farm Animals (الحيوانات الأليفة، أجزاء جسم الحيوان، وقاعدتي Has got / Can)',
    summaryAr: `يتعلم التلميذ أسماء الحيوانات الأليفة وحيوانات المزرعة (cat, dog, bird, rabbit, cow, sheep, horse)، التعبير عن ملكيتها ووصف أجزاء أجسادها باستخدام "has got" والتعبير عن قدراتها الحركية بـ "can / cannot".`,
    rulesAr: [
        'Pets & Farm Animals: cat, dog, rabbit, bird, goldfish, cow, sheep, goat, horse, hen (دجاجة), duck.',
        'Animal Body Parts: tail (ذيل), fur (فراء/فرْو), feathers (ريش), ears, paws (أقدام الحيوان), beak (منقار), wings (أجنحة).',
        'Describing Animals with "Has got": "The cat has got soft fur and four paws." "The bird has got two wings and a beak."',
        'Expressing Abilities with "Can / Cannot": "A bird can fly, but it cannot swim." "A fish can swim, but it cannot run." "A rabbit can jump."',
        'Phonics & Sound /r/ & /l/: Sound /r/ (Rabbit, Red, Run) and Sound /l/ (Lion, Leg, Little).'
    ],
    keyFormulas: [
        { labelAr: 'الوصف بملكية أجزاء الجسم', formulaAr: 'It has got [a tail / soft fur / two wings]' },
        { labelAr: 'التعبير عن القدرة والعجز', formulaAr: 'It can [fly / swim / run]  |  It cannot [walk]' }
    ],
    examplesAr: [
        {
            problem: 'Animal Riddles (لغز معرفة الحيوان):\nRead the riddle and guess the pet:\n"I am small. I have got long ears, soft white fur, and a small tail. I can jump very fast and I like carrots. What am I?"',
            solution: 'Answer: You are a rabbit! (الأرنب له أذنان طويلتان، فرْو أبيض، يستطيع القفز ويحب الجزر).'
        }
    ],
    interactiveTool: 'english_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'Complete the sentence: "A bird has got two wings, so it ...... fly."',
            options: [
                { id: 'a', textAr: 'can', isCorrect: true, explanationAr: 'Bravo! Birds have wings so they CAN (تستطيع) fly in the sky.' },
                { id: 'b', textAr: 'cannot', isCorrect: false },
                { id: 'c', textAr: 'is', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Which animal body part means "فراء ناعم" in English ?',
            options: [
                { id: 'a', textAr: 'Soft fur', isCorrect: true, explanationAr: 'Correct! "fur" means فراء/فرْو الحيوان.' },
                { id: 'b', textAr: 'Long beak', isCorrect: false },
                { id: 'c', textAr: 'Two wings', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'english-4ap-unit6-hobbies-games',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 6: Games & Hobbies',
    trimester: 3,
    objectivesAr: [
        'أُعبّر عن هواياتي المفضلة بالإنجليزية.',
        'أعدّ من 1 إلى 50 وأكتب الأعداد بالحروف.',
        'أطرح سؤالاً عن الكمية باستعمال How many...؟',
    ],
    detailedCourse: {
        introAr: 'للحديث عن هواياتنا وعدد الأشياء التي نملكها، نحتاج إلى معرفة الأعداد حتى 50 وطريقة طرح سؤال عن الكمية بـ "How many...?".',
        vocabulary: [
            { termAr: 'How many...?', definitionAr: 'كم عدد...؟ — تُستعمل للسؤال عن كمية أشياء قابلة للعد.' },
            { termAr: 'My favorite hobby is...', definitionAr: 'هوايتي المفضلة هي... — للتعبير عن نشاط نحبه.' },
        ],
        visualizationHintAr: 'عُدّ عدداً من الأغراض حولك (كتب، أقلام) واكتب السؤال والجواب: "How many books are there? There are [عدد] books."',
        commonMistakes: [
            { mistakeAr: 'كتابة الأعداد المركبة بدون شرطة (hyphen).', correctionAr: 'الأعداد بين 21 و99 (غير المضاعفات العشرية) تُكتب بشرطة: "twenty-five" وليس "twenty five".' },
        ],
        takeawayAr: '"How many...?" للسؤال عن الكمية، والأعداد المركبة (21-99) تُكتب بشرطة مثل "thirty-four".',
    },
    titleAr: 'Unit 6: Games, Hobbies & Numbers 1-50 (الهوايات، الألعاب الشائعة والأرقام حتى 50)',
    summaryAr: `يتعلم التلميذ التعبير عن الهوايات والألعاب الرياضية والترفيهية (play football, ride a bike, draw, read, play video games)، واستخدام الأرقام حتى 50 لحساب الأشياء وطرح السؤال "How many...?".`,
    rulesAr: [
        'Games & Hobbies: playing football, riding a bicycle, swimming, drawing, reading books, playing chess, listening to music.',
        'Numbers 1 to 50: 10 (ten), 20 (twenty), 30 (thirty), 40 (forty), 50 (fifty). Counting: 21 (twenty-one), 35 (thirty-five), 42 (forty-two)...',
        'Asking About Quantity with "How many...?": "How many balls have you got? - I have got three balls." "How many books are there? - There are fifteen books."',
        'Expressing Hobbies with "I like + Verb-ing": "My favorite hobby is drawing. I like playing football with my friends on Friday."',
        'Phonics & Sound /w/ & /v/: Sound /w/ (Water, White, Wednesday) and Sound /v/ (Video games, Very, Eleven).'
    ],
    keyFormulas: [
        { labelAr: 'السؤال عن العدد والكمية', formulaAr: 'How many [plural objects] are there / have you got?' },
        { labelAr: 'التعبير عن الهواية المفضلة', formulaAr: 'My favorite hobby is [drawing / playing football]' }
    ],
    examplesAr: [
        {
            problem: 'Counting & Hobbies Survey (إحصاء الهوايات والأعداد):\nLook at the sports club inventory and answer the questions:\n1) How many footballs are there? (There are 25 footballs).\n2) Write the number 25 in words in English.\n3) What is your favorite sports activity?',
            solution: '1) There are twenty-five footballs.\n2) 25 = twenty-five.\n3) My favorite sports activity is playing football and riding my bicycle.'
        }
    ],
    interactiveTool: 'english_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'How do you write the number "34" in words in English ?',
            options: [
                { id: 'a', textAr: 'thirty-four', isCorrect: true, explanationAr: 'Great! 30 = thirty, 4 = four, so 34 = thirty-four.' },
                { id: 'b', textAr: 'forty-three', isCorrect: false },
                { id: 'c', textAr: 'thirteen-four', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Choose the correct question: "...... books are there on the shelf?"',
            options: [
                { id: 'a', textAr: 'How many', isCorrect: true, explanationAr: 'Correct! "How many" is used to ask about countable quantities (كم عدد).' },
                { id: 'b', textAr: 'How old', isCorrect: false },
                { id: 'c', textAr: 'Where is', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'english-4ap-unit6-present-continuous',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 6: Games & Hobbies',
    trimester: 3,
    objectivesAr: [
        'أُميّز بين المضارع البسيط (I play) والمضارع المستمر (I am playing).',
        'أستعمل صيغة am/is/are + verb-ing لوصف فعل يحدث الآن.',
        'أستعمل كلمات دلالية مثل "now" و"every day" للتمييز بين الزمنين.',
    ],
    detailedCourse: {
        introAr: 'نستعمل المضارع البسيط للحديث عن عادة نقوم بها دائماً (I play football every day)، والمضارع المستمر للحديث عن فعل يحدث الآن بالضبط (I am playing football now).',
        vocabulary: [
            { termAr: 'Present Simple', definitionAr: 'زمن يُستعمل للعادات والحقائق الثابتة، الفعل يبقى في صورته الأساسية (أو +s مع he/she/it).' },
            { termAr: 'Present Continuous', definitionAr: 'زمن يُستعمل لفعل يحدث الآن، يتكون من am/is/are + الفعل + ing.' },
        ],
        visualizationHintAr: 'ارسم ساعة كبيرة بجانب كلمة "NOW" لتمثل المضارع المستمر، وشمساً تشرق كل يوم بجانب كلمة "EVERY DAY" لتمثل المضارع البسيط.',
        commonMistakes: [
            { mistakeAr: 'نسيان إضافة "-ing" للفعل في المضارع المستمر.', correctionAr: 'يجب دائماً إضافة "-ing" للفعل بعد am/is/are: "I am playing"، وليس "I am play".' },
        ],
        takeawayAr: 'Present Simple = عادة متكررة (I play every day). Present Continuous = فعل يحدث الآن (I am playing now) = am/is/are + verb-ing.',
    },
    titleAr: 'Unit 6 (bis): What Are You Doing? - Present Simple vs Present Continuous',
    summaryAr: `يتعلم التلميذ الفرق بين المضارع البسيط (للعادات المتكررة) والمضارع المستمر (للأفعال التي تحدث الآن بالضبط)، ويستعمل صيغة am/is/are + verb-ing بشكل صحيح.`,
    rulesAr: [
        'Present Simple (المضارع البسيط): يُستعمل للعادات والحقائق الثابتة. الفعل يبقى بصورته الأساسية مع I/You/We/They، ونضيف "-s" مع He/She/It. مثال: "I play football every day."',
        'Present Continuous (المضارع المستمر): يُستعمل لفعل يحدث الآن بالضبط. التركيب: am/is/are + الفعل + ing. مثال: "I am playing football now."',
        'اختيار الفعل المساعد: I ➔ am, He/She/It ➔ is, You/We/They ➔ are.',
        'كلمات دلالية: Present Simple (every day, always, usually) | Present Continuous (now, at the moment, look!).'
    ],
    keyFormulas: [
        { labelAr: 'تركيب المضارع المستمر', formulaAr: 'am/is/are + verb + ing' },
        { labelAr: 'الفعل المساعد المناسب', formulaAr: 'I→am | He/She/It→is | You/We/They→are' }
    ],
    examplesAr: [
        {
            problem: 'Complete: "Look! The children ...... (play) football in the garden now."',
            solution: '"Look! The children are playing football in the garden now." (are + playing, لأن الفعل يحدث الآن).'
        },
        {
            problem: 'Complete: "I ...... (read) a book every night before sleeping." (Present Simple)',
            solution: '"I read a book every night before sleeping." (نستعمل صيغة الفعل الأساسية مع I في المضارع البسيط).'
        }
    ],
    interactiveTool: 'english_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'Choose the correct sentence for an action happening right now:',
            options: [
                { id: 'a', textAr: 'She is drawing a picture now.', isCorrect: true, explanationAr: 'Correct! "is drawing" (Present Continuous) describes an action happening right now.' },
                { id: 'b', textAr: 'She draws a picture now.', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Which word signals the Present Simple tense?',
            options: [
                { id: 'a', textAr: 'every day', isCorrect: true, explanationAr: 'Correct! "every day" signals a habit, so we use the Present Simple.' },
                { id: 'b', textAr: 'now', isCorrect: false }
            ]
        }
    ]
},
];

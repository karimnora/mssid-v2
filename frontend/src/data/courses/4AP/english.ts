import { CourseLesson } from '../../../types';

// 6 leçon(s) — english / 4AP
export const ENGLISH_4AP: CourseLesson[] = [
// ==========================================
// 17. ENGLISH LANGUAGE - 4AP (اللغة الإنجليزية - السنة الرابعة ابتدائي الجيل الثاني)
// ==========================================
{
    id: 'english-4ap-unit1-family-friends',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 1: Family & Friends',
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
    id: 'english-4ap-unit2-school-classroom',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 2: School & Classroom',
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
    id: 'english-4ap-unit3-home-rooms',
    grade: '4AP',
    subject: 'english',
    categoryAr: 'Unit 3: My Home & Rooms',
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
];

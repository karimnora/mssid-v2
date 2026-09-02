import { CourseLesson } from '../../../types';

const SOURCE_NOTE =
  'Original Mssid DZ units for 5AP English (الجيل الثاني): future with will / going to, and giving directions. Existing travel/holidays lessons are unchanged.';

export const ENGLISH_5AP_WILL_DIRECTIONS: CourseLesson[] = [
  {
    id: 'english-5ap-unit8-will-going-to',
    grade: '5AP',
    subject: 'english',
    categoryAr: 'Unit 8: Future with will and going to',
    unitAr: 'Unit 8: Future with will and going to',
    trimester: 3,
    difficultyTier: 2,
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE,
    objectivesAr: [
      'I use will for a decision or a promise about the future.',
      'I use going to for a plan already decided.',
      'I write short sentences about holidays in Algeria in the future.',
    ],
    missionTitleAr: '🧳 Mission: Next holiday in Algeria',
    missionIntroAr: 'Yasmine plans a trip. Help her choose will or going to.',
    titleAr: 'Unit 8: Future with will / going to (العطل في الجزائر)',
    summaryAr:
      'Will = قرار أو وعد الآن. Going to = خطة جاهزة. أمثلة: We will visit Tlemcen. We are going to swim in Jijel.',
    detailedCourse: {
      introAr: 'للحديث عن الغد والعطل نستعمل will أو going to. ليستا نفس الشيء تماماً.',
      vocabulary: [
        { termAr: 'will + verbe', definitionAr: 'قرار سريع أو وعد: I will help you.' },
        { termAr: 'be going to + verbe', definitionAr: 'خطة مُعدّة: I am going to visit Oran.' },
        { termAr: 'tomorrow / next week', definitionAr: 'مؤشرات المستقبل: غداً، الأسبوع القادم.' },
      ],
      visualizationHintAr: 'Going to = تذكرة قطار اشتريتها. Will = جواب فوري: OK, I will come!',
      commonMistakes: [
        {
          mistakeAr: 'I will to visit Algiers.',
          correctionAr: 'After will: verbe de base without to. I will visit Algiers.',
        },
        {
          mistakeAr: 'I going to swim.',
          correctionAr: 'Need am/is/are: I am going to swim.',
        },
      ],
      takeawayAr: 'will + V | am/is/are going to + V. Holidays in Algeria: Tlemcen, Jijel, Ghardaïa…',
    },
    rulesAr: [
      'Will + base verb: I/you/he/she/we/they will visit. (will + الفعل الأصلي، بدون to)',
      'Going to: I am / he is / we are going to + verb. (be + going to + الفعل، لخطة مُعدّة مسبقاً)',
      'Will: promise or instant decision. Going to: plan already made. (will = وعد أو قرار فوري، going to = خطة جاهزة)',
      'Time words: tomorrow, next Friday, next summer. (غداً، الجمعة القادمة، الصيف القادم)',
    ],
    interactiveTool: 'english_dialogue_lab',
    languageInteractive: {
      type: 'dialogue_scenario',
      titleAr: 'Planning a trip',
      introAr: 'Choose the correct future form.',
      turns: [
        {
          promptAr: 'Yasmine a déjà acheté les billets pour Tlemcen.',
          lineAr: 'Karim: "What are your plans?"',
          choices: [
            {
              textAr: 'Yasmine: "I am going to visit Tlemcen."',
              isCorrect: true,
              feedbackAr: 'Correct — a plan already decided uses going to.',
            },
            {
              textAr: 'Yasmine: "I will to visit Tlemcen."',
              isCorrect: false,
              feedbackAr: 'No « to » after will. And here the plan is ready → going to.',
            },
          ],
        },
        {
          promptAr: 'Karim décide maintenant d\'aider.',
          lineAr: 'Yasmine: "This bag is heavy!"',
          choices: [
            {
              textAr: 'Karim: "I will help you."',
              isCorrect: true,
              feedbackAr: 'Instant decision → will.',
            },
            {
              textAr: 'Karim: "I am going to help you yesterday."',
              isCorrect: false,
              feedbackAr: 'Yesterday is the past. Future needs will / going to without yesterday.',
            },
          ],
        },
      ],
    },
    examplesAr: [
      {
        problem: 'Complete: Next summer we ______ (swim) in Jijel. (plan already made)',
        solution: 'We are going to swim in Jijel.',
      },
    ],
    progressiveExercises: [
      {
        id: 'english-5ap-will-ex1',
        level: 1,
        levelLabelAr: '🔍 Discover',
        type: 'qcm',
        problemAr: 'Choose: « I ______ you. » (promise)',
        hintsAr: ['A promise uses will.'],
        options: [
          { id: 'a', textAr: 'will help', isCorrect: true },
          { id: 'b', textAr: 'helped', isCorrect: false },
          { id: 'c', textAr: 'will to help', isCorrect: false },
        ],
        solutionAr: 'will help',
        detailedCorrectionAr: 'Promise → will + verb.',
        xpReward: 10,
      },
      {
        id: 'english-5ap-will-ex2',
        level: 2,
        levelLabelAr: '✏️ Practice',
        type: 'fill_blank',
        problemAr: 'She ______ going to visit Ghardaïa. (am/is/are)',
        hintsAr: ['She → is'],
        fillBlankAnswerAr: 'is',
        solutionAr: 'is',
        detailedCorrectionAr: 'She is going to visit Ghardaïa.',
        xpReward: 15,
      },
      {
        id: 'english-5ap-will-ex3',
        level: 3,
        levelLabelAr: '🎯 Master',
        type: 'true_false',
        problemAr: '« We will visit » and « We are going to visit » are both about the future. (True or false?)',
        hintsAr: ['Both talk about later, with a small difference of meaning.'],
        options: [
          { id: 'true', textAr: 'True', isCorrect: true },
          { id: 'false', textAr: 'False', isCorrect: false },
        ],
        solutionAr: 'True',
        detailedCorrectionAr: 'Both are future; going to = plan, will = decision/promise.',
        xpReward: 20,
      },
    ],
    educationalGame: {
      id: 'english-5ap-will-game',
      type: 'association',
      titleAr: 'will or going to?',
      instructionsAr: 'Pick the best form.',
      items: [
        { questionOrPromptAr: 'A promise: I ___ call you.', correctAnswerAr: 'will', optionsAr: ['will', 'going to'] },
        { questionOrPromptAr: 'Tickets already bought: We ___ travel to Oran.', correctAnswerAr: 'are going to', optionsAr: ['will', 'are going to'] },
      ],
      xpReward: 25,
    },
    quiz: [
      {
        id: 'q1-en5ap-will',
        questionAr: 'Correct sentence:',
        options: [
          { id: 'a', textAr: 'I will visit Algiers.', isCorrect: true, explanationAr: 'will + verb, no « to ».' },
          { id: 'b', textAr: 'I will to visit Algiers.', isCorrect: false },
          { id: 'c', textAr: 'I will visiting Algiers.', isCorrect: false },
        ],
      },
      {
        id: 'q2-en5ap-will',
        questionAr: 'They ______ going to swim.',
        options: [
          { id: 'a', textAr: 'are', isCorrect: true, explanationAr: 'they are going to…' },
          { id: 'b', textAr: 'is', isCorrect: false },
          { id: 'c', textAr: 'am', isCorrect: false },
        ],
      },
      {
        id: 'q3-en5ap-will',
        questionAr: 'Instant decision when the phone rings:',
        options: [
          { id: 'a', textAr: 'I will answer it.', isCorrect: true, explanationAr: 'Decision now → will.' },
          { id: 'b', textAr: 'I answered it tomorrow.', isCorrect: false },
          { id: 'c', textAr: 'I am going to answered it.', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'english-5ap-unit9-giving-directions',
    grade: '5AP',
    subject: 'english',
    categoryAr: 'Unit 9: Giving directions',
    unitAr: 'Unit 9: Giving directions',
    trimester: 3,
    difficultyTier: 2,
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE,
    objectivesAr: [
      'I use left, right, straight on to give directions.',
      'I ask: How do I get to…? / Where is…?',
      'I follow a short itinerary in an Algerian city (post office, school, mosque).',
    ],
    missionTitleAr: '🗺️ Mission: Find the Grande Poste',
    missionIntroAr: 'A tourist is lost in Algiers. Give clear directions.',
    titleAr: 'Unit 9: Giving directions (left / right / straight)',
    summaryAr:
      'Turn left, turn right, go straight on, it is opposite / next to / between. Question: How do I get to the mosque?',
    detailedCourse: {
      introAr: 'في الشارع نساعد الضيف: يسار، يمين، مباشرة.',
      vocabulary: [
        { termAr: 'turn left', definitionAr: 'انعطف يساراً.' },
        { termAr: 'turn right', definitionAr: 'انعطف يميناً.' },
        { termAr: 'go straight on', definitionAr: 'سر مباشرة.' },
        { termAr: 'opposite / next to', definitionAr: 'مقابل / بجانب.' },
      ],
      visualizationHintAr: 'مدّ يدك اليسرى = left، اليمنى = right، أمامك = straight.',
      commonMistakes: [
        {
          mistakeAr: 'Confondre left et right.',
          correctionAr: 'Left = يسار (the hand you write with if you are left-handed is left!). Right = يمين.',
        },
        {
          mistakeAr: 'Go to straight.',
          correctionAr: 'Go straight on. No « to » before straight.',
        },
      ],
      takeawayAr: 'How do I get to…? Turn left / right. Go straight on. It is next to / opposite.',
    },
    rulesAr: [
      'Ask: How do I get to the school? / Where is the mosque? (كيف أصل إلى...؟ / أين يقع...؟)',
      'Move: turn left, turn right, go straight on, take the first street on the left. (انعطف يساراً، انعطف يميناً، سِر مباشرة، خذ أول شارع على اليسار)',
      'Place: next to, opposite, between, on the corner. (بجانب، مقابل، بين، عند الزاوية)',
      'Polite: Excuse me… Thank you. (عفواً... شكراً)',
    ],
    interactiveTool: 'english_dialogue_lab',
    languageInteractive: {
      type: 'dialogue_scenario',
      titleAr: 'Lost in Algiers',
      introAr: 'Help the tourist.',
      turns: [
        {
          promptAr: 'Le touriste cherche la Grande Poste.',
          lineAr: 'Tourist: "Excuse me, how do I get to the Grande Poste?"',
          choices: [
            {
              textAr: 'You: "Go straight on, then turn left. It is opposite the square."',
              isCorrect: true,
              feedbackAr: 'Clear directions: straight + left + opposite.',
            },
            {
              textAr: 'You: "Go to straight and turn the left yesterday."',
              isCorrect: false,
              feedbackAr: 'Say go straight on and turn left — no yesterday.',
            },
          ],
        },
        {
          promptAr: 'Le touriste confirme le côté.',
          lineAr: 'Tourist: "Left or right?"',
          choices: [
            {
              textAr: 'You: "Turn left. The mosque is next to the school."',
              isCorrect: true,
              feedbackAr: 'Left + next to: correct preposition.',
            },
            {
              textAr: 'You: "Turn the left. The mosque is in the school."',
              isCorrect: false,
              feedbackAr: 'Turn left (no « the »). Next to, not in the school.',
            },
          ],
        },
      ],
    },
    examplesAr: [
      {
        problem: 'Give directions from the school gate to the mosque across the street.',
        solution: 'Go straight on. Turn right. The mosque is opposite the school.',
      },
    ],
    progressiveExercises: [
      {
        id: 'english-5ap-dir-ex1',
        level: 1,
        levelLabelAr: '🔍 Discover',
        type: 'qcm',
        problemAr: '« يسار » in English is:',
        hintsAr: ['The opposite of right.'],
        options: [
          { id: 'a', textAr: 'left', isCorrect: true },
          { id: 'b', textAr: 'right', isCorrect: false },
          { id: 'c', textAr: 'straight', isCorrect: false },
        ],
        solutionAr: 'left',
        detailedCorrectionAr: 'left = يسار, right = يمين.',
        xpReward: 10,
      },
      {
        id: 'english-5ap-dir-ex2',
        level: 2,
        levelLabelAr: '✏️ Practice',
        type: 'fill_blank',
        problemAr: 'Go ______ on. (straight)',
        hintsAr: ['Two words: straight on'],
        fillBlankAnswerAr: 'straight',
        solutionAr: 'straight',
        detailedCorrectionAr: 'Go straight on.',
        xpReward: 15,
      },
      {
        id: 'english-5ap-dir-ex3',
        level: 3,
        levelLabelAr: '🎯 Master',
        type: 'matching',
        problemAr: 'Match the place words:',
        hintsAr: ['opposite = facing'],
        matchingPairsAr: [
          { leftAr: 'next to', rightAr: 'بجانب' },
          { leftAr: 'opposite', rightAr: 'مقابل' },
          { leftAr: 'turn right', rightAr: 'انعطف يميناً' },
        ],
        solutionAr: 'next to = بجانب | opposite = مقابل | turn right = انعطف يميناً',
        detailedCorrectionAr: 'Three useful direction phrases.',
        xpReward: 20,
      },
    ],
    educationalGame: {
      id: 'english-5ap-dir-game',
      type: 'association',
      titleAr: 'Which way?',
      instructionsAr: 'Choose the matching direction.',
      items: [
        { questionOrPromptAr: 'يمين', correctAnswerAr: 'right', optionsAr: ['left', 'right', 'straight'] },
        { questionOrPromptAr: 'مباشرة', correctAnswerAr: 'straight on', optionsAr: ['turn back', 'straight on', 'sit down'] },
      ],
      xpReward: 25,
    },
    quiz: [
      {
        id: 'q1-en5ap-dir',
        questionAr: 'How do I get to the mosque?',
        options: [
          { id: 'a', textAr: 'Go straight on and turn left.', isCorrect: true, explanationAr: 'A complete direction uses move + turn.' },
          { id: 'b', textAr: 'I am a mosque.', isCorrect: false },
          { id: 'c', textAr: 'It was yesterday.', isCorrect: false },
        ],
      },
      {
        id: 'q2-en5ap-dir',
        questionAr: 'The post office is ______ the bank. (facing it)',
        options: [
          { id: 'a', textAr: 'opposite', isCorrect: true, explanationAr: 'opposite = مقابل.' },
          { id: 'b', textAr: 'under', isCorrect: false },
          { id: 'c', textAr: 'will', isCorrect: false },
        ],
      },
      {
        id: 'q3-en5ap-dir',
        questionAr: 'Turn ______ (يسار).',
        options: [
          { id: 'a', textAr: 'left', isCorrect: true, explanationAr: 'left = يسار.' },
          { id: 'b', textAr: 'right', isCorrect: false },
          { id: 'c', textAr: 'straight the left', isCorrect: false },
        ],
      },
    ],
  },
];

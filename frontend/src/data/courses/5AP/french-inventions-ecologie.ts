import { CourseLesson } from '../../../types';

const SOURCE_NOTE =
  "Complément pédagogique original Mssid DZ pour le Projet 3 officiel 5AP (inventions et écologie). Le projet patrimoine existant n'est pas modifié.";

export const FRENCH_5AP_INVENTIONS: CourseLesson[] = [
  {
    id: 'french-5ap-projet3-inventions-ecologie',
    grade: '5AP',
    subject: 'french',
    categoryAr: 'Projet 3 : Inventions et écologie',
    unitAr: 'Projet 3 : Inventions et écologie',
    trimester: 3,
    difficultyTier: 3,
    contentSource: 'complementary',
    sourceType: 'original_authoring',
    confidenceLevel: 'medium',
    sourceNoteAr: SOURCE_NOTE,
    objectivesAr: [
      "Je nomme des inventions utiles et des gestes pour protéger l'environnement.",
      'Je conjugue le futur simple pour parler d\'un projet écologique.',
      "Je rédige un court paragraphe cadré (invention + geste écologique en Algérie).",
    ],
    missionTitleAr: '🌱 Mission : Inventeur écolo',
    missionIntroAr:
      'Ta classe prépare une exposition : une invention qui aide la planète. Tu présentes le projet au futur simple.',
    titleAr: 'Projet 3 (complément officiel) : Inventions et écologie — vocabulaire, futur simple, production écrite',
    summaryAr:
      "L'élève découvre le lexique des inventions et de l'écologie (recycler, trier, éolienne, solaire), conjugue au futur simple, et rédige un petit texte sur un geste écologique en Algérie (tri à l'école, énergie solaire au Sahara).",
    detailedCourse: {
      introAr:
        "Inventer, c'est trouver une idée nouvelle. L'écologie, c'est protéger la nature. En 5AP, on relie les deux : quelles inventions aident la planète ?",
      vocabulary: [
        { termAr: 'une invention', definitionAr: 'Une idée nouvelle transformée en objet ou en technique utile.' },
        { termAr: 'recycler', definitionAr: 'Transformer un déchet pour le réutiliser (papier, plastique, verre).' },
        { termAr: 'une éolienne', definitionAr: 'Une machine qui produit de l\'électricité grâce au vent.' },
        { termAr: "l'énergie solaire", definitionAr: 'Électricité produite grâce au soleil (panneaux au Sahara, à Adrar…).' },
      ],
      visualizationHintAr: 'Imagine trois poubelles à l\'école : papier, plastique, reste. Trier, c\'est déjà inventer un geste pour demain.',
      commonMistakes: [
        {
          mistakeAr: 'Écrire « Je visiterai » sans « e » : Je visitrai.',
          correctionAr: 'Au futur des verbes en -er : radical + -rai, -ras, -ra… Je visiterai, nous protégerons.',
        },
        {
          mistakeAr: 'Confondre « polluer » et « protéger ».',
          correctionAr: 'Polluer = salir. Protéger = garder propre. On trie pour protéger, pas pour polluer.',
        },
      ],
      takeawayAr:
        'Invention + écologie : je nomme, je conjugue au futur, je rédige 4 phrases (quoi / où en Algérie / demain / pourquoi).',
    },
    progressiveWorkedExamples: [
      {
        tier: 1,
        labelAr: 'Exemple 1 — Je découvre',
        problem: 'Quel verbe décrit « remettre le papier dans la poubelle papier » ?',
        stepsAr: ['C\'est un geste de tri.'],
        solution: 'Trier / recycler le papier.',
      },
      {
        tier: 4,
        labelAr: 'Exemple 4 — Situation réelle',
        problem: 'À Adrar, des panneaux solaires éclairent un village. Écris une phrase au futur avec « nous ».',
        stepsAr: ['Nous + futur de « utiliser ».'],
        solution: 'Nous utiliserons l\'énergie solaire pour éclairer l\'école.',
        isRealLife: true,
      },
    ],
    rulesAr: [
      'Lexique — Inventions : une invention, inventer, un inventeur, utile, nouveau / nouvelle.',
      'Lexique — Écologie : recycler, trier, polluer, protéger, l\'environnement, une éolienne, un panneau solaire.',
      'Conjugaison — Futur simple (1er groupe) : je trierai, tu trieras, il/elle triera, nous trierons, vous trierez, ils/elles trieront.',
      'Production écrite cadrée : 1) Je présente l\'invention. 2) J\'indique le lieu en Algérie. 3) Je dis ce que nous ferons. 4) J\'explique pourquoi.',
    ],
    interactiveTool: 'french_dialogue_lab',
    languageInteractive: {
      type: 'vocabulary_explorer',
      titleAr: 'Le coin des inventions vertes',
      introAr: 'Clique sur chaque mot.',
      terms: [
        { termAr: 'recycler', meaningAr: 'إعادة تدوير النفايات.', exampleAr: 'Nous recyclerons le papier de la classe.' },
        { termAr: 'une éolienne', meaningAr: 'آلة تنتج الكهرباء بالرياح.', exampleAr: 'L\'éolienne tournera près du village.' },
        { termAr: 'trier', meaningAr: 'فرز النفايات.', exampleAr: 'Demain, nous trierons le plastique et le verre.' },
        { termAr: 'protéger', meaningAr: 'حماية الطبيعة.', exampleAr: 'Nous protégerons le parc national.' },
      ],
    },
    keyFormulas: [
      { labelAr: 'Futur 1er groupe', formulaAr: 'radical + -rai, -ras, -ra, -rons, -rez, -ront' },
    ],
    examplesAr: [
      {
        problem:
          'Production écrite (4 phrases) :\nPrésente une invention écologique pour ton école en Algérie. Utilise le futur simple.',
        solution:
          "Notre invention est un bac de tri dans la cour. À Alger, nous placerons trois poubelles colorées. Les élèves trieront le papier et le plastique chaque midi. Ainsi, nous protégerons notre environnement.",
      },
    ],
    progressiveExercises: [
      {
        id: 'french-5ap-inventions-ex1',
        level: 1,
        levelLabelAr: '🔍 Je découvre',
        type: 'qcm',
        problemAr: '« Recycler » signifie :',
        hintsAr: ['Pense aux déchets qui redeviennent utiles.'],
        options: [
          { id: 'a', textAr: 'transformer un déchet pour le réutiliser', isCorrect: true },
          { id: 'b', textAr: 'jeter tout par terre', isCorrect: false },
          { id: 'c', textAr: 'inventer un animal', isCorrect: false },
        ],
        solutionAr: 'transformer un déchet pour le réutiliser',
        detailedCorrectionAr: 'Recycler = donner une nouvelle vie au papier, plastique, verre.',
        xpReward: 10,
      },
      {
        id: 'french-5ap-inventions-ex2',
        level: 2,
        levelLabelAr: '✏️ Je m\'entraîne',
        type: 'fill_blank',
        problemAr: 'Complète au futur : « Nous ...... l\'école. » (protéger)',
        hintsAr: ['nous + -rons'],
        fillBlankAnswerAr: 'protégerons',
        solutionAr: 'protégerons',
        detailedCorrectionAr: 'Nous protégerons l\'école.',
        xpReward: 15,
      },
      {
        id: 'french-5ap-inventions-ex3',
        level: 3,
        levelLabelAr: '🎯 Je maîtrise',
        type: 'qcm',
        problemAr: 'Quelle phrase est au futur simple ?',
        hintsAr: ['Cherche la terminaison -ra / -rons.'],
        options: [
          { id: 'a', textAr: 'Ils trieront les bouteilles.', isCorrect: true },
          { id: 'b', textAr: 'Ils trient les bouteilles.', isCorrect: false },
          { id: 'c', textAr: 'Ils ont trié les bouteilles.', isCorrect: false },
        ],
        solutionAr: 'Ils trieront les bouteilles.',
        detailedCorrectionAr: 'trieront = futur. trient = présent. ont trié = passé composé.',
        xpReward: 20,
      },
    ],
    educationalGame: {
      id: 'french-5ap-inventions-game',
      type: 'association',
      titleAr: 'Invention ou geste écolo ?',
      instructionsAr: 'Associe chaque idée à la bonne famille.',
      items: [
        { questionOrPromptAr: 'le panneau solaire', correctAnswerAr: 'invention / énergie', optionsAr: ['invention / énergie', 'pollution'] },
        { questionOrPromptAr: 'trier le plastique', correctAnswerAr: 'geste écologique', optionsAr: ['geste écologique', 'pollution'] },
        { questionOrPromptAr: 'jeter les papiers dans la rue', correctAnswerAr: 'pollution', optionsAr: ['geste écologique', 'pollution'] },
      ],
      xpReward: 25,
    },
    quiz: [
      {
        id: 'q1-fr5ap-inventions',
        questionAr: 'Au futur, « nous recycler » devient :',
        options: [
          { id: 'a', textAr: 'nous recyclerons', isCorrect: true, explanationAr: 'nous + radical + -rons.' },
          { id: 'b', textAr: 'nous recyclons', isCorrect: false },
          { id: 'c', textAr: 'nous avons recyclé', isCorrect: false },
        ],
      },
      {
        id: 'q2-fr5ap-inventions',
        questionAr: 'Une éolienne produit de l\'électricité grâce :',
        options: [
          { id: 'a', textAr: 'au vent', isCorrect: true, explanationAr: 'L\'éolienne tourne avec le vent.' },
          { id: 'b', textAr: 'au pétrole uniquement', isCorrect: false },
          { id: 'c', textAr: 'à la neige', isCorrect: false },
        ],
      },
      {
        id: 'q3-fr5ap-inventions',
        questionAr: 'Quel geste protège l\'environnement à l\'école ?',
        options: [
          { id: 'a', textAr: 'Trier le papier et le plastique', isCorrect: true, explanationAr: 'Le tri réduit les déchets.' },
          { id: 'b', textAr: 'Jeter tout dans une seule poubelle par terre', isCorrect: false },
          { id: 'c', textAr: 'Casser les arbres de la cour', isCorrect: false },
        ],
      },
    ],
  },
];

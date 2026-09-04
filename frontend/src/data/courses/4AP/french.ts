import { CourseLesson } from '../../../types';

// 20 leçon(s) — french / 4AP
// MEN 2026-2027 curriculum change (CLAUDE.md § 2.B): French now starts in 4AP instead of 3AP.
// Lessons below are ordered: former-3AP beginner sequences (T1-T2) first, then the pre-existing
// 4AP grammar sequences (renumbered T2-T3 to make room) — see project_men_2026_2027_curriculum_change memory.
export const FRENCH_4AP: CourseLesson[] = [
// ==========================================
// 🇫🇷 اللغة الفرنسية (FRANÇAIS) - 4AP (Trimestre 1) — Projet 1 : Vive l'école !
// ==========================================
{
    id: 'french-3ap-p1-seq1-greetings-letters',
    grade: '4AP',
    subject: 'french',
    trimester: 1,
    domainAr: 'Langue Française - Projet 1: Vive l\'école !',
    sequenceAr: 'Séquence 1: Bonjour ! Je m\'appelle...',
    categoryAr: 'اللغة الفرنسية - الحروف والتقديم',
    titleAr: 'P1-S1 : BONJOUR ! JE M\'APPELLE... (GRAPHÈMES a / i, m / n ET SALUTATIONS)',
    summaryAr: 'Découverte des premiers mots de salutation, de la présentation personnelle (Je m\'appelle...), du tracé cursive et de la combinatoire des premières voyelles (a, i) et consonnes (m, n).',
    objectiveAr: 'Se présenter spontanément en français, associer la graphie et la phonie des lettres A/I/M/N et former des syllabes simples (ma, mi, na, ni).',
    objectivesAr: [
        'Je sais me présenter avec "Je m\'appelle...".',
        'Je reconnais et je trace les lettres a, i, m, n.',
        'Je forme des syllabes simples (ma, mi, na, ni).',
    ],
    detailedCourse: {
        introAr: 'Pour commencer à parler français, on apprend d\'abord à se saluer et à se présenter, tout en découvrant les premières lettres et les premières syllabes.',
        vocabulary: [
            { termAr: 'Se présenter', definitionAr: 'Dire son prénom avec la formule "Je m\'appelle..." pour que les autres nous connaissent.' },
            { termAr: 'La combinatoire', definitionAr: 'Assembler une consonne et une voyelle pour former une syllabe (m + a = ma).' },
        ],
        visualizationHintAr: 'Entraîne-toi à te présenter devant un miroir : "Bonjour ! Je m\'appelle..." puis "Au revoir !"',
        commonMistakes: [
            { mistakeAr: 'Confondre "Bonjour" et "Au revoir".', correctionAr: '"Bonjour" se dit en arrivant, "Au revoir" se dit en partant — ce sont deux moments opposés.' },
        ],
        takeawayAr: 'Je m\'appelle [Prénom] pour se présenter. Voyelles a/i, consonnes m/n. Combinatoire : m+a=ma, n+i=ni.',
    },
    keyFormulas: [
        { labelAr: 'Formule de présentation', formulaAr: 'Je m\'appelle + [Prénom]' },
    ],
    discoveryAr: 'Écoute le dialogue entre Amina et Yassine :\n- "Bonjour ! Je m\'appelle Amina. Et toi ?"\n- "Salut ! Moi c\'est Yassine. Au revoir Amina !"\n- "Au revoir Yassine !"',
    rulesAr: [
      'Les Formules de Salutation : Bonjour ! (صباح الخير / أهلاً), Salut ! (مرحباً), Au revoir ! (إلى اللقاء).',
      'Se présenter : "Je m\'appelle [Prénom]" (مثال: Je m\'appelle Amina).',
      'Les Voyelles A / I : la lettre "a" (comme dans *ananas*, *ami*) et la lettre "i" (comme dans *image*, *nid*).',
      'Les Consonnes M / N : "m" (comme dans *maman*) et "n" (comme dans *nid*).',
      'La Combinatoire (Consonne + Voyelle) : m + a = MA | m + i = MI | n + a = NA | n + i = NI.'
    ],
    interactiveTool: 'french_dialogue_lab',
    languageInteractive: {
        type: 'dialogue_scenario',
        titleAr: 'Bonjour ! Je me présente',
        introAr: 'Choisis la bonne réplique. Pas de conjugaison : seulement les salutations de 3AP.',
        turns: [
            {
                promptAr: 'Tu arrives en classe le matin. Que dis-tu ?',
                lineAr: 'Amina : « … ! Je m\'appelle Amina. »',
                choices: [
                    { textAr: 'Bonjour', isCorrect: true, feedbackAr: 'Oui ! « Bonjour » se dit en arrivant.' },
                    { textAr: 'Au revoir', isCorrect: false, feedbackAr: '« Au revoir » se dit en partant, pas en arrivant.' },
                ],
            },
            {
                promptAr: 'Yassine te demande ton prénom. Tu réponds :',
                lineAr: 'Yassine : « Et toi ? »',
                choices: [
                    { textAr: 'Je m\'appelle…', isCorrect: true, feedbackAr: 'Formule de présentation de 3AP : Je m\'appelle + prénom.' },
                    { textAr: 'J\'étais…', isCorrect: false, feedbackAr: 'L\'imparfait n\'est pas au programme de 3AP.' },
                ],
            },
        ],
    },
    examplesAr: [
      {
        problem: 'Lit la syllabe formée : N + I = ?',
        solution: 'NI (comme dans le mot "Nid").'
      },
      {
        problem: 'Complète : "Bonjour ! ..... Yassine."',
        solution: 'Je m\'appelle (Bonjour ! Je m\'appelle Yassine).'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-fr3ap-p1s1-1',
        level: 1,
        levelLabelAr: '🟢 Niveau 1 — Facile',
        problemAr: 'Quelle est la voyelle dans le prénom "AMINA" ?',
        hintsAr: ['Regarde la première et la dernière lettre du prénom'],
        solutionAr: 'A et I',
        detailedCorrectionAr: 'Bravo ! 👏 Le prénom A-M-I-N-A contient les voyelles A et I.',
        xpReward: 10
      },
      {
        id: 'ex2-fr3ap-p1s1-2',
        level: 2,
        levelLabelAr: '🟡 Niveau 2 — Moyen',
        problemAr: 'Assemble les lettres pour former le mot câlin de la famille : M + A + M + A + N = ?',
        hintsAr: ['La personne la plus chère dans la famille'],
        solutionAr: 'MAMAN',
        detailedCorrectionAr: 'Excellent ! ✨ M-A-M-A-N forme le mot "Maman".',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-fr3ap-p1s1',
      type: 'quiz_flash',
      titleAr: '🎮 Le Labo des Syllabes (MA, MI, NA, NI)',
      instructionsAr: 'Trouve la bonne syllabe pour compléter le mot !',
      items: [
        { questionOrPromptAr: '.....MAN (Syllabe manquante)', correctAnswerAr: 'MA', optionsAr: ['MA', 'NI', 'PA'], explanationAr: 'MA + MAN = MAMAN.' },
        { questionOrPromptAr: 'A.....NA (Syllabe manquante)', correctAnswerAr: 'MI', optionsAr: ['MI', 'NA', 'MO'], explanationAr: 'A + MI + NA = AMINA.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-p1s1',
        questionAr: 'Comment dit-on "إلى اللقاء" en français ?',
        options: [
          { id: 'a', textAr: 'Au revoir !', isCorrect: true, explanationAr: 'Exactement ! Au revoir signifie إلى اللقاء.' },
          { id: 'b', textAr: 'Bonjour !', isCorrect: false, explanationAr: 'Bonjour veut dire "صباح الخير / أهلاً", on le dit en arrivant, pas en partant.' },
          { id: 'c', textAr: 'Salut !', isCorrect: false, explanationAr: 'Salut veut dire "مرحباً", c\'est aussi un mot pour arriver, pas pour partir.' }
        ]
      },
      {
        id: 'q2-p1s1',
        questionAr: 'Quelle syllabe forme-t-on avec N + I ?',
        options: [
          { id: 'a', textAr: 'NI', isCorrect: true, explanationAr: 'Exact ! N + I = NI, comme dans le mot "Nid".' },
          { id: 'b', textAr: 'NA', isCorrect: false, explanationAr: 'NA se forme avec N + A, pas avec N + I.' },
          { id: 'c', textAr: 'MI', isCorrect: false, explanationAr: 'MI se forme avec la consonne M, pas avec la consonne N.' }
        ]
      }
    ]
},

{
    id: 'french-3ap-p1-seq2-class-letters',
    grade: '4AP',
    subject: 'french',
    trimester: 1,
    domainAr: 'Langue Française - Projet 1: Vive l\'école !',
    sequenceAr: 'Séquence 2: En classe !',
    categoryAr: 'اللغة الفرنسية - أدوات المدرسة والحروف',
    titleAr: 'P1-S2 : EN CLASSE ! (FOURNITURES SCOLAIRES, ARTICLES LE/LA/UN/UNE & GRAPHÈMES o / u, t / d)',
    summaryAr: 'Apprentissage du vocabulaire des fournitures scolaires, emploi correct des articles masculin/féminin (un/une, le/la) et étude des graphèmes O / U et T / D.',
    objectiveAr: 'Nommer les affaires de classe, utiliser le genre des noms (masculin/féminin) et lire les syllabes avec t/d et o/u.',
    objectivesAr: [
        'Je nomme les fournitures scolaires en français.',
        'J\'utilise le bon article (un/une, le/la) selon le genre du nom.',
    ],
    detailedCourse: {
        introAr: 'En français, chaque nom a un genre : masculin (un/le) ou féminin (une/la). Il faut apprendre le genre de chaque objet en même temps que son nom.',
        vocabulary: [
            { termAr: 'Le genre (masculin/féminin)', definitionAr: 'Catégorie grammaticale du nom qui détermine l\'article à utiliser (un/le pour masculin, une/la pour féminin).' },
        ],
        visualizationHintAr: 'Range ton cartable et nomme chaque objet avec son article : "un stylo", "une règle", "un cahier", "une trousse".',
        commonMistakes: [
            { mistakeAr: 'Utiliser "un" pour un nom féminin ou l\'inverse.', correctionAr: 'Le genre d\'un nom en français doit être appris par cœur avec le mot lui-même, il n\'y a pas toujours de règle logique.' },
        ],
        takeawayAr: 'Masculin : un/le (un stylo). Féminin : une/la (une règle). Combinatoire : t+o=to, d+u=du.',
    },
    keyFormulas: [
        { labelAr: 'Les articles', formulaAr: 'un/le = masculin | une/la = féminin' },
    ],
    discoveryAr: 'Dans le cartable d\'Anis :\n- "Qu\'est-ce que c\'est ?" - "C\'est un stylo, une règle, un cahier et une trousse !"',
    rulesAr: [
      'Le Masculin : On utilise UN ou LE (ex: un stylo, le cartable, un livre).',
      'Le Féminin : On utilise UNE ou LA (ex: une règle, la trousse, une gomme).',
      'Les Voyelles O / U : "o" (comme dans *moto*, *stylo*) et "u" (comme dans *tutu*, *jus*).',
      'Les Consonnes T / D : "t" (comme dans *table*, *trousse*) et "d" (comme dans *date*, *ardoise*).',
      'La Combinatoire : t + o = TO | t + u = TU | d + o = DO | d + u = DU.'
    ],
    interactiveTool: 'french_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Dans mon cartable',
        introAr: 'Clique sur chaque mot : article + objet de classe (un / une).',
        terms: [
            { termAr: 'un stylo', meaningAr: 'Masculin : un / le stylo.', exampleAr: 'C\'est un stylo bleu.' },
            { termAr: 'une règle', meaningAr: 'Féminin : une / la règle.', exampleAr: 'J\'ai une règle dans ma trousse.' },
            { termAr: 'un cahier', meaningAr: 'Masculin : un cahier.', exampleAr: 'Ouvre ton cahier, s\'il te plaît.' },
            { termAr: 'une gomme', meaningAr: 'Féminin : une gomme.', exampleAr: 'Passe-moi une gomme.' },
        ],
    },
    examplesAr: [
      {
        problem: 'Complète avec l\'article indéfini (un/une) : "..... trousse"',
        solution: 'Une trousse (Féminin).'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-fr3ap-p1s2-1',
        level: 1,
        levelLabelAr: '🟢 Niveau 1 — Facile',
        problemAr: 'Mets l\'article qui convient devant "cahier" : (Le) ou (La) ?',
        hintsAr: ['Cahier est un nom masculin'],
        solutionAr: 'Le cahier',
        detailedCorrectionAr: 'Bravo ! 👏 Cahier est masculin, donc on dit "Le cahier".',
        xpReward: 10
      },
      {
        id: 'ex2-fr3ap-p1s2-2',
        level: 2,
        levelLabelAr: '🟡 Niveau 2 — Moyen',
        problemAr: 'Lit la syllabe suivante : D + O = ?',
        hintsAr: ['Consonne D + voyelle O'],
        solutionAr: 'DO (comme dans la note de musique Do)',
        detailedCorrectionAr: 'Parfait ! 🎯 D + O se lit "DO".',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-fr3ap-p1s2',
      type: 'association',
      titleAr: '🎮 Tri Cartable : Masculin (Un/Le) ou Féminin (Une/La)',
      instructionsAr: 'Classe chaque objet scolaire dans son genre correct !',
      items: [
        { questionOrPromptAr: 'Stylo', correctAnswerAr: 'Masculin (Un / Le)', optionsAr: ['Masculin (Un / Le)', 'Féminin (Une / La)'], explanationAr: 'Un stylo est un nom masculin.' },
        { questionOrPromptAr: 'Gomme', correctAnswerAr: 'Féminin (Une / La)', optionsAr: ['Masculin (Un / Le)', 'Féminin (Une / La)'], explanationAr: 'Une gomme est un nom féminin.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-p1s2',
        questionAr: 'Lequel de ces mots contient la voyelle "U" ?',
        options: [
          { id: 'a', textAr: 'Trousse (ou) / Livre', isCorrect: false, explanationAr: 'Trousse contient le son "ou" et Livre n\'a pas de U — cherche plutôt du côté de Jus et Plume.' },
          { id: 'b', textAr: 'Jus (u) / Plume', isCorrect: true, explanationAr: 'Exactement ! Jus et Plume contiennent la voyelle U.' },
          { id: 'c', textAr: 'Stylo (o) / Cahier', isCorrect: false, explanationAr: 'Stylo contient la voyelle O et Cahier n\'a pas de U non plus.' }
        ]
      },
      {
        id: 'q2-p1s2',
        questionAr: 'Quel article utilise-t-on devant le mot "trousse" ?',
        options: [
          { id: 'a', textAr: 'Une', isCorrect: true, explanationAr: 'Bravo ! Trousse est un nom féminin, on dit "une trousse".' },
          { id: 'b', textAr: 'Un', isCorrect: false, explanationAr: '"Un" s\'utilise devant un nom masculin, or trousse est féminin.' },
          { id: 'c', textAr: 'Le', isCorrect: false, explanationAr: '"Le" est l\'article défini masculin ; pour trousse (féminin) on dit "la trousse", pas "le".' }
        ]
      }
    ]
},

{
    id: 'french-3ap-p1-seq3-friend-letters',
    grade: '4AP',
    subject: 'french',
    trimester: 1,
    domainAr: 'Langue Française - Projet 1: Vive l\'école !',
    sequenceAr: 'Séquence 3: C\'est mon ami(e) !',
    categoryAr: 'اللغة الفرنسية - الأصدقاء والألوان',
    titleAr: 'P1-S3 : C\'EST MON AMI ! (COULEURS, LA PHRASE SIMPLE & GRAPHÈMES e / é, p / b)',
    summaryAr: 'Apprendre à présenter un ami ou une amie, exprimer les couleurs fondamentales, construire une phrase simple et différencier les sons P et B.',
    objectiveAr: 'Formuler la phrase simple "C\'est...", connaître les couleurs (rouge, bleu, vert, jaune) et ne plus confondre /p/ et /b/.',
    objectivesAr: [
        'Je présente un ami ou une amie avec "C\'est...".',
        'Je nomme les couleurs de base en français.',
        'Je distingue les sons /p/ et /b/.',
    ],
    detailedCourse: {
        introAr: 'Pour présenter quelqu\'un, on utilise "C\'est...". Il faut aussi accorder "ami" au féminin ("amie") quand on parle d\'une fille.',
        vocabulary: [
            { termAr: 'C\'est / Voici', definitionAr: 'Expressions pour présenter une personne ou montrer quelque chose.' },
            { termAr: 'un ami / une amie', definitionAr: 'Le mot change au féminin par l\'ajout d\'un "e" muet à la fin.' },
        ],
        visualizationHintAr: 'Présente un camarade de classe à voix haute : "C\'est [prénom], c\'est mon ami/mon amie."',
        commonMistakes: [
            { mistakeAr: 'Confondre les sons /p/ et /b/ à l\'oral.', correctionAr: '/p/ est un son sourd (pas de vibration dans la gorge), /b/ est un son sonore (avec vibration) — pose ta main sur ta gorge pour sentir la différence.' },
        ],
        takeawayAr: 'C\'est + prénom pour présenter. un ami (garçon) / une amie (fille). Couleurs : rouge, bleu, vert, jaune. Sons p/b à distinguer.',
    },
    keyFormulas: [
        { labelAr: 'Présenter quelqu\'un', formulaAr: 'C\'est + [Prénom], c\'est mon ami(e)' },
    ],
    discoveryAr: 'Dans la cour de récréation :\n- "Regarde ! C\'est Yassine, c\'est mon ami. Il a un ballon rouge."\n- "C\'est Lina, c\'est mon amie. Elle a un sac bleu."',
    rulesAr: [
      'Présenter quelqu\'un : "C\'est [Prénom]" ou "Voici [Prénom]".',
      'Ami vs Amie : un ami (garçon ♂️) / une amie (fille ♀️).',
      'Les Couleurs de base : Rouge (أحمر), Bleu (أزرق), Vert (أخضر), Jaune (أصفر), Blanc (أبيض), Noir (أسود).',
      'Les voyelles E / É : "e" (comme dans *le*, *petit*) et "é" avec accent aigu (comme dans *école*, *vélos*).',
      'Les consonnes P / B : "p" (son sourd : *papa*, *pomme*) et "b" (son sonore : *banane*, *bus*).'
    ],
    interactiveTool: 'french_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Mon ami, mon amie, les couleurs',
        introAr: 'Présenter un camarade et nommer une couleur.',
        terms: [
            { termAr: 'un ami', meaningAr: 'Garçon : c\'est mon ami.', exampleAr: 'C\'est Yassine, c\'est mon ami.' },
            { termAr: 'une amie', meaningAr: 'Fille : c\'est mon amie.', exampleAr: 'C\'est Lina, c\'est mon amie.' },
            { termAr: 'rouge', meaningAr: 'Couleur : أحمر.', exampleAr: 'Le ballon est rouge.' },
            { termAr: 'bleu', meaningAr: 'Couleur : أزرق.', exampleAr: 'Le sac est bleu.' },
        ],
    },
    examplesAr: [
      {
        problem: 'Distingue P et B : "un [ ... ]allon" ?',
        solution: 'un Ballon (avec la lettre B).'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-fr3ap-p1s3-1',
        level: 1,
        levelLabelAr: '🟢 Niveau 1 — Facile',
        problemAr: 'Comment écrit-on "صديقة" au féminin en français ?',
        hintsAr: ['On ajoute un "e" muet à la fin du mot "ami"'],
        solutionAr: 'Une amie',
        detailedCorrectionAr: 'Bravo ! 👏 Un ami (masculin) ➔ Une amie (féminin).',
        xpReward: 10
      },
      {
        id: 'ex2-fr3ap-p1s3-2',
        level: 2,
        levelLabelAr: '🟡 Niveau 2 — Moyen',
        problemAr: 'Complète la phrase : "Le drapeau algérien est vert, blanc et ....."',
        hintsAr: ['La couleur du croissant et de l\'étoile 🇩🇿'],
        solutionAr: 'Rouge',
        detailedCorrectionAr: 'Magnifique ! 🇩🇿 Vert, blanc et rouge !',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-fr3ap-p1s3',
      type: 'quiz_flash',
      titleAr: '🎮 Chasse aux sons : P ou B ?',
      instructionsAr: 'Choisis la bonne lettre pour compléter le mot !',
      items: [
        { questionOrPromptAr: '.....A PA (Lettre P ou B ?)', correctAnswerAr: 'P', optionsAr: ['P', 'B'], explanationAr: 'P-A-P-A = Papa.' },
        { questionOrPromptAr: '.....A NA NE (Lettre P ou B ?)', correctAnswerAr: 'B', optionsAr: ['B', 'P'], explanationAr: 'B-A-N-A-N-E = Banane.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-p1s3',
        questionAr: 'Laquelle de ces phrases présente correctement une amie ?',
        options: [
          { id: 'a', textAr: 'C\'est Lina, c\'est mon amie.', isCorrect: true, explanationAr: 'Parfait ! C\'est la formule exacte pour présenter une amie.' },
          { id: 'b', textAr: 'C\'est Lina, c\'est mon ami.', isCorrect: false, explanationAr: 'Lina est une fille, il faut donc dire "amie" (féminin) et non "ami" (masculin).' },
          { id: 'c', textAr: 'C\'est Lina, c\'est mon amis.', isCorrect: false, explanationAr: '"Amis" est un pluriel ; pour parler d\'une seule amie on écrit "amie" au singulier.' }
        ]
      },
      {
        id: 'q2-p1s3',
        questionAr: 'Comment dit-on "أزرق" en français ?',
        options: [
          { id: 'a', textAr: 'Bleu', isCorrect: true, explanationAr: 'Exact ! Bleu veut dire أزرق.' },
          { id: 'b', textAr: 'Vert', isCorrect: false, explanationAr: 'Vert veut dire أخضر, pas أزرق.' },
          { id: 'c', textAr: 'Jaune', isCorrect: false, explanationAr: 'Jaune veut dire أصفر, pas أزرق.' }
        ]
      }
    ]
},

// ==========================================
// Trimestre 1 (suite) — Projet 2 : En famille !
// ==========================================
{
    id: 'french-3ap-p2-seq1-family-letters',
    grade: '4AP',
    subject: 'french',
    trimester: 1,
    domainAr: 'Langue Française - Projet 2: En famille !',
    sequenceAr: 'Séquence 1: Voici ma famille !',
    categoryAr: 'اللغة الفرنسية - العائلة والضمائر',
    titleAr: 'P2-S1 : VOICI MA FAMILLE ! (LES MEMBRES, PRONOMS IL / ELLE & GRAPHÈMES l / r, f / v)',
    summaryAr: 'Présentation des membres de la famille, utilisation des pronoms sujets IL / ELLE, pluriel avec LES / DES et étude des graphèmes L / R et F / V.',
    objectiveAr: 'Nommer la famille (père, mère, frère, sœur), remplacer un nom par il/elle et lire correctement l/r et f/v.',
    objectivesAr: [
        'Je nomme les membres de ma famille en français.',
        'Je remplace un nom par le pronom IL ou ELLE selon son genre.',
    ],
    detailedCourse: {
        introAr: 'Pour ne pas répéter un nom plusieurs fois, on le remplace par un pronom : IL pour un nom masculin, ELLE pour un nom féminin.',
        vocabulary: [
            { termAr: 'IL / ELLE', definitionAr: 'Pronoms qui remplacent un nom singulier : IL pour masculin, ELLE pour féminin.' },
        ],
        visualizationHintAr: 'Dessine ton arbre familial et écris une phrase pour chaque personne avec "Il est..." ou "Elle est...".',
        commonMistakes: [
            { mistakeAr: 'Utiliser IL pour un nom féminin.', correctionAr: 'Le pronom doit toujours correspondre au genre du nom qu\'il remplace : ma mère → elle, mon père → il.' },
        ],
        takeawayAr: 'IL remplace un nom masculin, ELLE remplace un nom féminin. Famille : le père, la mère, le frère, la sœur.',
    },
    keyFormulas: [
        { labelAr: 'Les pronoms sujets', formulaAr: 'IL (masculin) | ELLE (féminin)' },
    ],
    discoveryAr: 'Voici la famille de Yassine :\n- "Voici mon père Ali. Il est ingénieur."\n- "Voici ma mère Karima. Elle est médecin."\n- "Voici mon frère Reda et ma sœur Sarah."',
    rulesAr: [
      'Vocabulaire de la Famille : le père (الأب), la mère (الأم), le frère (الأخ), la sœur (الأخت), le grand-père (الجد), la grand-mère (الجدة).',
      'Pronoms Personnels Sujets :\n- IL (هو) : remplace un nom masculin singulier (ex: Mon père ➔ Il).\n- ELLE (هي) : remplace un nom féminin singulier (ex: Ma mère ➔ Elle).',
      'Le Pluriel : DES ou LES (ex: des livres, les enfants).',
      'Les Consonnes L / R : "l" (*lune*, *lire*) et "r" (*radio*, *rue*).',
      'Les Consonnes F / V : "f" (*fille*, *fleur*) et "v" (*vélo*, *vache*).'
    ],
    interactiveTool: 'french_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Voici ma famille',
        introAr: 'IL pour un garçon, ELLE pour une fille.',
        terms: [
            { termAr: 'le père', meaningAr: 'On le remplace par IL.', exampleAr: 'Voici mon père. Il est ingénieur.' },
            { termAr: 'la mère', meaningAr: 'On la remplace par ELLE.', exampleAr: 'Voici ma mère. Elle est médecin.' },
            { termAr: 'le frère', meaningAr: 'Masculin : IL.', exampleAr: 'Mon frère s\'appelle Reda. Il a 6 ans.' },
            { termAr: 'la sœur', meaningAr: 'Féminin : ELLE.', exampleAr: 'Ma sœur s\'appelle Sarah. Elle a 10 ans.' },
        ],
    },
    examplesAr: [
      {
        problem: 'Remplace "Mon frère" par un pronom : "Mon frère joue au ballon."',
        solution: 'Il joue au ballon.'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-fr3ap-p2s1-1',
        level: 1,
        levelLabelAr: '🟢 Niveau 1 — Facile',
        problemAr: 'Complète avec (Il) ou (Elle) : "Maman prépare le gâteau. ..... est dans la cuisine."',
        hintsAr: ['Maman est un nom féminin'],
        solutionAr: 'Elle',
        detailedCorrectionAr: 'Bravo ! 👏 Maman est féminin, donc on utilise "Elle".',
        xpReward: 10
      },
      {
        id: 'ex2-fr3ap-p2s1-2',
        level: 2,
        levelLabelAr: '🟡 Niveau 2 — Moyen',
        problemAr: 'Lit la combinaison : F + A = ? et V + A = ?',
        hintsAr: ['FA comme dans Farine, VA comme dans Vache'],
        solutionAr: 'FA et VA',
        detailedCorrectionAr: 'Excellent ! ✨ F+A = FA, V+A = VA.',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-fr3ap-p2s1',
      type: 'association',
      titleAr: '🎮 Jeu des Pronoms : IL ou ELLE ?',
      instructionsAr: 'Associe chaque personnage au bon pronom !',
      items: [
        { questionOrPromptAr: 'Le père', correctAnswerAr: 'IL', optionsAr: ['IL', 'ELLE'], explanationAr: 'Le père est masculin ➔ IL.' },
        { questionOrPromptAr: 'La sœur', correctAnswerAr: 'ELLE', optionsAr: ['IL', 'ELLE'], explanationAr: 'La sœur est féminin ➔ ELLE.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-p2s1',
        questionAr: 'Comment dit-on "الجد" en français ?',
        options: [
          { id: 'a', textAr: 'Le grand-père', isCorrect: true, explanationAr: 'Exact ! Le grand-père veut dire الجد.' },
          { id: 'b', textAr: 'Le frère', isCorrect: false, explanationAr: 'Le frère veut dire الأخ, pas الجد.' },
          { id: 'c', textAr: 'La grand-mère', isCorrect: false, explanationAr: 'La grand-mère veut dire الجدة (féminin), pas الجد (masculin).' }
        ]
      },
      {
        id: 'q2-p2s1',
        questionAr: 'Quel pronom remplace "Ma mère" dans la phrase "Ma mère est médecin" ?',
        options: [
          { id: 'a', textAr: 'Elle', isCorrect: true, explanationAr: 'Bravo ! Ma mère est un nom féminin, on le remplace par ELLE.' },
          { id: 'b', textAr: 'Il', isCorrect: false, explanationAr: 'IL remplace un nom masculin ; "ma mère" est féminin, il faut donc utiliser ELLE.' },
          { id: 'c', textAr: 'Ils', isCorrect: false, explanationAr: '"Ils" est un pronom pluriel ; ma mère est une seule personne, donc on utilise ELLE au singulier.' }
        ]
      }
    ]
},

{
    id: 'french-3ap-p2-seq1b-jobs-seasons',
    grade: '4AP',
    subject: 'french',
    trimester: 1,
    domainAr: 'Langue Française - Projet 2: En famille !',
    sequenceAr: 'Séquence 1 bis: Les métiers de ma famille et les saisons',
    categoryAr: 'اللغة الفرنسية - المهن والفصول',
    titleAr: 'LES MÉTIERS DE MA FAMILLE ET LES SAISONS DE L\'ANNÉE',
    summaryAr: 'Découverte du vocabulaire des métiers pour décrire la profession des membres de la famille (Il est médecin, Elle est enseignante), et des quatre saisons de l\'année avec leurs caractéristiques.',
    objectiveAr: 'Nommer quelques métiers courants et les quatre saisons, et utiliser le verbe être pour décrire une profession.',
    objectivesAr: [
        'Je nomme le métier d\'un membre de ma famille avec "Il est / Elle est [métier]".',
        'Je nomme les quatre saisons de l\'année dans l\'ordre.',
        'Je décris le temps qu\'il fait à chaque saison.',
    ],
    detailedCourse: {
        introAr: 'Chaque personne dans ta famille a peut-être un métier, et chaque année passe par quatre saisons différentes. Apprenons à en parler en français !',
        vocabulary: [
            { termAr: 'Le métier', definitionAr: 'Le travail qu\'une personne exerce pour vivre, comme médecin ou enseignant.' },
            { termAr: 'La saison', definitionAr: 'Une des quatre périodes de l\'année : printemps, été, automne, hiver.' },
        ],
        visualizationHintAr: 'Demande à ton enfant le métier de chaque membre de la famille et fais-le répondre avec "Il est..." ou "Elle est...".',
        commonMistakes: [
            { mistakeAr: 'Oublier d\'accorder le métier au féminin pour une femme.', correctionAr: 'Certains métiers changent au féminin (un boulanger/une boulangère), d\'autres restent identiques (un médecin/une médecin) — il faut les apprendre au cas par cas.' },
        ],
        takeawayAr: 'Il est / Elle est + [métier] pour décrire une profession. Les 4 saisons dans l\'ordre : le printemps, l\'été, l\'automne, l\'hiver.',
    },
    keyFormulas: [
        { labelAr: 'Décrire un métier', formulaAr: 'Il est / Elle est + [métier] (sans article)' },
    ],
    discoveryAr: 'Chez Sarah :\n- "Mon père est médecin, il soigne les gens."\n- "Ma mère est enseignante, elle travaille à l\'école."\n- "En été il fait chaud, mais en hiver il fait froid !"',
    rulesAr: [
      'Les Métiers courants : médecin (طبيب), enseignant(e) (معلّم/ة), ingénieur (مهندس), boulanger/boulangère (خبّاز), agriculteur (فلاح), policier (شرطي).',
      'Décrire un métier : "Il est [métier]" ou "Elle est [métier]" — sans article devant le nom du métier (ex: Il est médecin, pas "Il est un médecin").',
      'Les Quatre Saisons : le printemps (الربيع), l\'été (الصيف), l\'automne (الخريف), l\'hiver (الشتاء).',
      'Décrire le temps par saison : "En été, il fait chaud." "En hiver, il fait froid." "Au printemps, il fait doux." "En automne, il pleut souvent."'
    ],
    interactiveTool: 'french_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Métiers et saisons',
        introAr: 'Il est / Elle est + métier. Les quatre saisons.',
        terms: [
            { termAr: 'médecin', meaningAr: 'Elle est médecin.', exampleAr: 'Ma mère est médecin.' },
            { termAr: 'enseignant', meaningAr: 'Il est enseignant.', exampleAr: 'Mon oncle est enseignant.' },
            { termAr: 'l\'été', meaningAr: 'Saison chaude.', exampleAr: 'En été, il fait très chaud.' },
            { termAr: 'l\'hiver', meaningAr: 'Saison froide.', exampleAr: 'En hiver, il fait froid.' },
        ],
    },
    examplesAr: [
      {
        problem: 'Complète : "Ma mère travaille à l\'hôpital, elle est ....."',
        solution: 'Elle est médecin (ou infirmière).'
      },
      {
        problem: 'Quelle saison vient juste après l\'été ?',
        solution: 'L\'automne (printemps ➔ été ➔ automne ➔ hiver).'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-fr3ap-p2s1b-1',
        level: 1,
        levelLabelAr: '🟢 Niveau 1 — Facile',
        problemAr: 'Comment dit-on "معلّمة" en français, au féminin ?',
        hintsAr: ['Le métier de celle qui enseigne à l\'école'],
        solutionAr: 'Enseignante',
        detailedCorrectionAr: 'Bravo ! 👏 Enseignante est le féminin de enseignant.',
        xpReward: 10
      },
      {
        id: 'ex2-fr3ap-p2s1b-2',
        level: 2,
        levelLabelAr: '🟡 Niveau 2 — Moyen',
        problemAr: 'Range les quatre saisons dans l\'ordre, en commençant par le printemps.',
        hintsAr: ['printemps ➔ ... ➔ ... ➔ hiver'],
        solutionAr: 'Le printemps, l\'été, l\'automne, l\'hiver',
        detailedCorrectionAr: 'Excellent ! ✨ C\'est l\'ordre exact des quatre saisons.',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-fr3ap-p2s1b',
      type: 'association',
      titleAr: '🎮 Jeu des Métiers et des Saisons',
      instructionsAr: 'Associe chaque description au bon métier ou à la bonne saison !',
      items: [
        { questionOrPromptAr: 'Il soigne les malades à l\'hôpital', correctAnswerAr: 'Il est médecin', optionsAr: ['Il est médecin', 'Il est boulanger', 'Il est policier'], explanationAr: 'Le médecin soigne les malades.' },
        { questionOrPromptAr: 'Il fait très chaud, on va à la plage', correctAnswerAr: 'L\'été', optionsAr: ['L\'été', 'L\'hiver', 'L\'automne'], explanationAr: 'L\'été est la saison la plus chaude.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-p2s1b',
        questionAr: 'Quelle saison vient juste avant le printemps ?',
        options: [
          { id: 'a', textAr: 'L\'hiver', isCorrect: true, explanationAr: 'Exactement ! L\'ordre est : hiver ➔ printemps ➔ été ➔ automne ➔ hiver.' },
          { id: 'b', textAr: 'L\'été', isCorrect: false, explanationAr: 'L\'été vient après le printemps, pas avant.' },
          { id: 'c', textAr: 'L\'automne', isCorrect: false, explanationAr: 'L\'automne vient juste avant l\'hiver, pas avant le printemps.' }
        ]
      },
      {
        id: 'q2-p2s1b',
        questionAr: 'Comment dit-on correctement le métier de médecin pour un homme ?',
        options: [
          { id: 'a', textAr: 'Il est médecin', isCorrect: true, explanationAr: 'Bravo ! On dit "Il est médecin", sans article devant le métier.' },
          { id: 'b', textAr: 'Il est un médecin', isCorrect: false, explanationAr: 'On n\'utilise pas d\'article devant le métier : on dit "Il est médecin", pas "Il est un médecin".' },
          { id: 'c', textAr: 'Elle est médecin', isCorrect: false, explanationAr: '"Elle" s\'utilise pour une femme ; ici on parle d\'un homme, donc on dit "Il est médecin".' }
        ]
      }
    ]
},

{
    id: 'french-3ap-p2-seq2-numbers-age',
    grade: '4AP',
    subject: 'french',
    trimester: 1,
    domainAr: 'Langue Française - Projet 2: En famille !',
    sequenceAr: 'Séquence 2: Tu as quel âge ?',
    categoryAr: 'اللغة الفرنسية - الأرقام والسن',
    titleAr: 'P2-S2 : TU AS QUEL ÂGE ? (NOMBRES 1 À 10, VERBE AVOIR & GRAPHÈMES s / z, c / g)',
    summaryAr: 'Apprendre à compter de 1 à 10 en français, poser et répondre à la question de l\'âge avec le verbe AVOIR (J\'ai 8 ans) et maîtriser la prononciation s/z et c/g.',
    objectiveAr: 'Compter jusqu\'à 10, conjuguer le verbe avoir au présent (J\'ai, Tu as, Il/Elle a) et lire les lettres C et G.',
    objectivesAr: [
        'Je compte de 1 à 10 en français.',
        'Je conjugue le verbe AVOIR au présent pour dire mon âge.',
    ],
    detailedCourse: {
        introAr: 'Le verbe AVOIR sert à dire son âge en français : "J\'ai [nombre] ans". Il faut bien connaître les nombres de 1 à 10 pour répondre.',
        vocabulary: [
            { termAr: 'Le verbe AVOIR', definitionAr: 'Verbe utilisé pour exprimer la possession ou l\'âge : J\'ai, Tu as, Il/Elle a.' },
        ],
        visualizationHintAr: 'Compte tes doigts un par un en disant les nombres à voix haute : un, deux, trois...',
        commonMistakes: [
            { mistakeAr: 'Dire "Je suis 8 ans" au lieu de "J\'ai 8 ans".', correctionAr: 'En français, l\'âge s\'exprime avec le verbe AVOIR et non ÊTRE : "J\'ai 8 ans", jamais "Je suis 8 ans".' },
        ],
        takeawayAr: 'J\'ai [nombre] ans pour dire son âge. Nombres 1 à 10 : un, deux, trois... dix. C se prononce /k/ ou /s/, G se prononce /g/ ou /ʒ/.',
    },
    keyFormulas: [
        { labelAr: 'Exprimer l\'âge', formulaAr: 'J\'ai + [nombre] + ans' },
    ],
    discoveryAr: 'Dans la fête d\'anniversaire :\n- "Joyeux anniversaire Yassine ! Tu as quel âge aujourd\'hui ?"\n- "J\'ai 8 ans ! Regarde, il y a 8 bougies sur le gâteau !"',
    rulesAr: [
      'Les Nombres de 1 à 10 : 1 (un), 2 (deux), 3 (trois), 4 (quatre), 5 (cinq), 6 (six), 7 (sept), 8 (huit), 9 (neuf), 10 (dix).',
      'Expression de l\'âge : "J\'ai [Nombre] ans" (ex: J\'ai 8 ans).',
      'Le Verbe AVOIR au présent : J\'ai (عندي) | Tu as (عندك) | Il a / Elle a (عنده / عندها).',
      'Les sons S / Z : "s" (*sac*, *stylo*) et "z" (*zéro*, *zèbre*). Note : entre deux voyelles, "s" se prononce /z/ (*maison*).',
      'La lettre C : prononcée /k/ devant a, o, u (*cahier*, *coq*) et /s/ devant e, i (*cerise*, *ciel*).',
      'La lettre G : prononcée /g/ devant a, o, u (*gâteau*, *gomme*) et /ʒ/ devant e, i (*giraf*, *gilet*).'
    ],
    interactiveTool: 'french_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Quel âge as-tu ?',
        introAr: 'Nombres 1 à 10 et verbe avoir au présent (j\'ai).',
        terms: [
            { termAr: 'j\'ai', meaningAr: 'Verbe avoir, je.', exampleAr: 'J\'ai huit ans.' },
            { termAr: 'tu as', meaningAr: 'Verbe avoir, tu.', exampleAr: 'Tu as quel âge ?' },
            { termAr: 'huit', meaningAr: 'Le nombre 8.', exampleAr: 'J\'ai huit crayons.' },
            { termAr: 'dix', meaningAr: 'Le nombre 10.', exampleAr: 'Nous avons dix doigts.' },
        ],
    },
    examplesAr: [
      {
        problem: 'Conjugue le verbe Avoir : "Tu (avoir) quel âge ?"',
        solution: 'Tu as quel âge ?'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-fr3ap-p2s2-1',
        level: 1,
        levelLabelAr: '🟢 Niveau 1 — Facile',
        problemAr: 'Écris en chiffres le nombre français "SEPT" :',
        hintsAr: ['Le nombre entre 6 et 8'],
        solutionAr: '7',
        detailedCorrectionAr: 'Bravo ! 👏 Sept = 7.',
        xpReward: 10
      },
      {
        id: 'ex2-fr3ap-p2s2-2',
        level: 2,
        levelLabelAr: '🟡 Niveau 2 — Moyen',
        problemAr: 'Complète avec la bonne forme du verbe AVOIR : "Mina ..... 8 ans."',
        hintsAr: ['Mina c\'est le pronom Elle (Elle a)'],
        solutionAr: 'a',
        detailedCorrectionAr: 'Parfait ! 🎯 Mina a 8 ans.',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-fr3ap-p2s2',
      type: 'speed_calc',
      titleAr: '🎮 Défi Compte Rapide 1 à 10 en Français',
      instructionsAr: 'Trouve le nom du chiffre en français !',
      items: [
        { questionOrPromptAr: 'Chiffre 5 en français :', correctAnswerAr: 'Cinq', optionsAr: ['Cinq', 'Quatre', 'Six'], explanationAr: '5 s\'écrit Cinq.' },
        { questionOrPromptAr: 'Chiffre 8 en français :', correctAnswerAr: 'Huit', optionsAr: ['Huit', 'Dix', 'Sept'], explanationAr: '8 s\'écrit Huit.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-p2s2',
        questionAr: 'Comment prononce-t-on la lettre C dans le mot "CAHIER" ?',
        options: [
          { id: 'a', textAr: 'Le son /K/ (comme K)', isCorrect: true, explanationAr: 'Exactement ! Devant "A", la lettre C se prononce /K/.' },
          { id: 'b', textAr: 'Le son /S/ (comme S)', isCorrect: false, explanationAr: 'Le son /S/ s\'entend seulement quand C est devant E ou I (comme dans "cerise"), pas devant A.' },
          { id: 'c', textAr: 'Le son /G/ (comme G)', isCorrect: false, explanationAr: 'La lettre C ne se prononce jamais /G/ ; devant A elle se prononce /K/.' }
        ]
      },
      {
        id: 'q2-p2s2',
        questionAr: 'Comment dit-on "عندي 8 سنوات" en français ?',
        options: [
          { id: 'a', textAr: 'J\'ai 8 ans', isCorrect: true, explanationAr: 'Bravo ! On utilise le verbe AVOIR pour dire son âge : J\'ai 8 ans.' },
          { id: 'b', textAr: 'Je suis 8 ans', isCorrect: false, explanationAr: 'On ne dit jamais "Je suis" pour l\'âge ; il faut utiliser le verbe AVOIR : "J\'ai 8 ans".' },
          { id: 'c', textAr: 'Tu as 8 ans', isCorrect: false, explanationAr: '"Tu as" s\'utilise pour parler à quelqu\'un d\'autre ; pour parler de soi-même on dit "J\'ai 8 ans".' }
        ]
      }
    ]
},

{
    id: 'french-3ap-p2-seq3-home-sounds',
    grade: '4AP',
    subject: 'french',
    trimester: 1,
    domainAr: 'Langue Française - Projet 2: En famille !',
    sequenceAr: 'Séquence 3: Dans ma maison',
    categoryAr: 'اللغة الفرنسية - المنزل والأصوات المركبة',
    titleAr: 'P2-S3 : DANS MA MAISON (PIÈCES, PRÉPOSITIONS DANS/SUR/SOUS & SONS CH/J, OU/ON)',
    summaryAr: 'Vocabulaire de la maison et de ses pièces, emploi des prépositions de position (dans, sur, sous) et lecture des sons composés CH / J et OU / ON.',
    objectiveAr: 'Nommer les pièces de la maison, situer des objets dans l\'espace et lire des mots avec ch, j, ou, on.',
    objectivesAr: [
        'Je nomme les pièces de la maison en français.',
        'Je situe un objet avec dans/sur/sous.',
    ],
    detailedCourse: {
        introAr: 'Les prépositions de lieu (dans, sur, sous) nous permettent de dire précisément où se trouve un objet ou une personne dans la maison.',
        vocabulary: [
            { termAr: 'Préposition de lieu', definitionAr: 'Petit mot qui précise la position d\'un objet : dans (à l\'intérieur), sur (au-dessus), sous (en dessous).' },
        ],
        visualizationHintAr: 'Cache un objet dans ta chambre et décris sa position à un camarade avec "dans", "sur" ou "sous".',
        commonMistakes: [
            { mistakeAr: 'Confondre "dans" et "sur".', correctionAr: '"Dans" veut dire à l\'intérieur (le livre est dans le sac), "sur" veut dire au-dessus (le livre est sur la table).' },
        ],
        takeawayAr: 'Dans = à l\'intérieur, Sur = au-dessus, Sous = en dessous. Pièces : la chambre, le salon, la cuisine, la salle de bain.',
    },
    keyFormulas: [
        { labelAr: 'Les prépositions de lieu', formulaAr: 'dans (في) | sur (على) | sous (تحت)' },
    ],
    discoveryAr: 'Bienvenue chez Amina :\n- "Voici notre maison ! Il y a un grand salon, une cuisine et deux chambres."\n- "Où est le chat ?" - "Il est sous la table dans le salon !"',
    rulesAr: [
      'Les Pièces de la maison : la chambre (غرفة النوم), le salon (غرفة الضيوف), la cuisine (المطبخ), la salle de bain (الحمام), le jardin (الحديقة).',
      'Les Prépositions de Lieu :\n- DANS (في) : ex: Le lit est dans la chambre.\n- SUR (على) : ex: Le livre est sur la table.\n- SOUS (تحت) : ex: Le chat est sous la chaise.',
      'Sons composés CH / J : "ch" (*chat*, *chambre*) et "j" (*jardin*, *jupe*).',
      'Sons composés OU / ON : "ou" (*loup*, *poupée*) et "on" (*maison*, *ballon*).'
    ],
    interactiveTool: 'french_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Dans ma maison',
        introAr: 'Pièces et prépositions : dans, sur, sous.',
        terms: [
            { termAr: 'la cuisine', meaningAr: 'On y prépare les repas.', exampleAr: 'Maman est dans la cuisine.' },
            { termAr: 'la chambre', meaningAr: 'On y dort.', exampleAr: 'Le lit est dans la chambre.' },
            { termAr: 'sur', meaningAr: 'Préposition : فوق.', exampleAr: 'Le livre est sur la table.' },
            { termAr: 'sous', meaningAr: 'Préposition : تحت.', exampleAr: 'Le chat est sous la chaise.' },
        ],
    },
    examplesAr: [
      {
        problem: 'Où dort-on dans la maison ?',
        solution: 'Dans la chambre (sur le lit).'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-fr3ap-p2s3-1',
        level: 1,
        levelLabelAr: '🟢 Niveau 1 — Facile',
        problemAr: 'Complète avec la bonne préposition : "Le cahier est ..... la table." (على)',
        hintsAr: ['Sur veut dire على'],
        solutionAr: 'sur',
        detailedCorrectionAr: 'Bravo ! 👏 Le cahier est SUR la table.',
        xpReward: 10
      },
      {
        id: 'ex2-fr3ap-p2s3-2',
        level: 2,
        levelLabelAr: '🟡 Niveau 2 — Moyen',
        problemAr: 'Lit le mot formé avec le son OU : L + OU + P = ?',
        hintsAr: ['Un animal sauvage des contes'],
        solutionAr: 'LOUP',
        detailedCorrectionAr: 'Excellent ! 🐺 L-OU-P forme le mot "Loup".',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-fr3ap-p2s3',
      type: 'association',
      titleAr: '🎮 Quiz Pièces de la Maison & Prépositions',
      instructionsAr: 'Trouve l\'emplacement ou le nom de la pièce !',
      items: [
        { questionOrPromptAr: 'Où Maman prépare-t-elle le repas ?', correctAnswerAr: 'Dans la cuisine', optionsAr: ['Dans la cuisine', 'Dans la salle de bain', 'Dans le jardin'], explanationAr: 'On cuisine dans la cuisine.' },
        { questionOrPromptAr: 'Le chat est ..... le lit (تحت)', correctAnswerAr: 'sous', optionsAr: ['sous', 'sur', 'dans'], explanationAr: 'Sous signifie تحت.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-p2s3',
        questionAr: 'Quel son composé entend-on dans le mot "MAISON" ?',
        options: [
          { id: 'a', textAr: 'Le son ON', isCorrect: true, explanationAr: 'Exactement ! Mais-ON contient le son composé ON.' },
          { id: 'b', textAr: 'Le son OU', isCorrect: false, explanationAr: 'Le son OU ne se trouve pas dans "maison" ; on entend plutôt le son ON à la fin du mot.' },
          { id: 'c', textAr: 'Le son CH', isCorrect: false, explanationAr: 'Il n\'y a pas de lettres CH dans "maison", donc pas de son CH.' }
        ]
      },
      {
        id: 'q2-p2s3',
        questionAr: 'Quelle préposition signifie "تحت" (en dessous) ?',
        options: [
          { id: 'a', textAr: 'Sous', isCorrect: true, explanationAr: 'Exact ! "Sous" veut dire تحت (en dessous).' },
          { id: 'b', textAr: 'Sur', isCorrect: false, explanationAr: '"Sur" veut dire على (au-dessus), pas تحت.' },
          { id: 'c', textAr: 'Dans', isCorrect: false, explanationAr: '"Dans" veut dire في (à l\'intérieur), pas تحت.' }
        ]
      }
    ]
},

// ==========================================
// Trimestre 2 — Projet 3 : Tu as un animal ?
// ==========================================
{
    id: 'french-3ap-p3-seq1-animals-sounds',
    grade: '4AP',
    subject: 'french',
    trimester: 2,
    domainAr: 'Langue Française - Projet 3: Tu as un animal ?',
    sequenceAr: 'Séquence 1: Les animaux domestiques',
    categoryAr: 'اللغة الفرنسية - الحيوانات الأليفة وفعل الكينونة',
    titleAr: 'P3-S1 : LES ANIMAUX DOMESTIQUES (VERBE ÊTRE & VOYELLES NASALES an / en, in / ain)',
    summaryAr: 'Vocabulaire des animaux familiers, verbe ÊTRE au présent (Je suis, Tu es, Il/Elle est), adjectifs de couleur et de taille, et étude des sons nasaux AN/EN et IN.',
    objectiveAr: 'Décrire son animal préféré avec le verbe être et les adjectifs (petit/grand, noir/blanc) et lire les sons nasaux.',
    objectivesAr: [
        'Je nomme les animaux domestiques en français.',
        'Je conjugue le verbe ÊTRE au présent pour décrire un animal.',
    ],
    detailedCourse: {
        introAr: 'Le verbe ÊTRE nous permet de décrire un animal (sa taille, sa couleur) : "Il est petit", "Elle est noire".',
        vocabulary: [
            { termAr: 'Le verbe ÊTRE', definitionAr: 'Verbe utilisé pour décrire une qualité ou un état : Je suis, Tu es, Il/Elle est.' },
        ],
        visualizationHintAr: 'Décris ton animal préféré (réel ou imaginaire) avec 3 phrases utilisant le verbe être : "Il est...", "Il a...".',
        commonMistakes: [
            { mistakeAr: 'Confondre le verbe ÊTRE et le verbe AVOIR.', correctionAr: 'ÊTRE décrit une qualité (Il est petit), AVOIR exprime la possession (J\'ai un chat) — ce sont deux verbes différents.' },
        ],
        takeawayAr: 'Je suis, Tu es, Il/Elle est (verbe ÊTRE). Animaux : le chat, le chien, le lapin, l\'oiseau. Sons nasaux : an/en, in/ain.',
    },
    keyFormulas: [
        { labelAr: 'Le verbe ÊTRE au présent', formulaAr: 'Je suis | Tu es | Il/Elle est' },
    ],
    discoveryAr: 'Dans le jardin d\'Anis :\n- "Tu as un animal Anis ?" - "Oui, j\'ai un petit chat blanc ! Il est très mignon."\n- "Et toi Lina ?" - "Moi j\'ai un chien noir. Il est grand."',
    rulesAr: [
      'Les Animaux domestiques : le chat (القط), le chien (الكلب), le lapin (الأرنب), l\'oiseau (العصفور), le poisson (السمكة).',
      'Le Verbe ÊTRE au présent : Je suis (أنا أكون) | Tu es (أنت تكون) | Il est / Elle est (هو يكون / هي تكون).',
      'Les Adjectifs Qualificatifs simples : petit (صغير) / grand (كبير), beau (جميل), mignon (لطيف).',
      'Les Voyelles Nasales AN / EN : "an" (*maman*, *pantalon*) et "en" (*enfant*, *dent*).',
      'Les Voyelles Nasales IN / AIN : "in" (*lapin*, *jardin*) et "ain" (*train*, *main*).'
    ],
    interactiveTool: 'french_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Les animaux de la maison',
        introAr: 'Animaux domestiques et verbe être au présent.',
        terms: [
            { termAr: 'le chat', meaningAr: 'Animal domestique.', exampleAr: 'Le chat est petit.' },
            { termAr: 'le chien', meaningAr: 'Animal domestique.', exampleAr: 'Le chien est fidèle.' },
            { termAr: 'la poule', meaningAr: 'Animal de la ferme.', exampleAr: 'La poule est dans le jardin.' },
            { termAr: 'il est', meaningAr: 'Verbe être, il.', exampleAr: 'Le chat est noir.' },
        ],
    },
    examplesAr: [
      {
        problem: 'Complète avec le verbe ÊTRE : "Le chat ..... petit."',
        solution: 'est (Le chat est petit).'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-fr3ap-p3s1-1',
        level: 1,
        levelLabelAr: '🟢 Niveau 1 — Facile',
        problemAr: 'Quel animal dit "Miaou" en français ?',
        hintsAr: ['Un animal domestique à moustaches'],
        solutionAr: 'Le chat',
        detailedCorrectionAr: 'Bravo ! 👏 Le chat fait miaou.',
        xpReward: 10
      },
      {
        id: 'ex2-fr3ap-p3s1-2',
        level: 2,
        levelLabelAr: '🟡 Niveau 2 — Moyen',
        problemAr: 'Lit le mot avec le son nasal IN : L + A + P + IN = ?',
        hintsAr: ['Un petit animal qui aime les carottes 🥕'],
        solutionAr: 'LAPIN',
        detailedCorrectionAr: 'Parfait ! 🐰 L-A-P-IN forme le mot "Lapin".',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-fr3ap-p3s1',
      type: 'quiz_flash',
      titleAr: '🎮 Jeu des Animaux et des Adjectifs',
      instructionsAr: 'Trouve l\'adjectif ou le nom d\'animal correct !',
      items: [
        { questionOrPromptAr: 'Mon chat est ..... (أبيض)', correctAnswerAr: 'blanc', optionsAr: ['blanc', 'noir', 'rouge'], explanationAr: 'Blanc veut dire أبيض.' },
        { questionOrPromptAr: 'Il ..... un petit lapin (Verbe ÊTRE : هو يكون)', correctAnswerAr: 'est', optionsAr: ['est', 'a', 'suis'], explanationAr: 'Il est (Verbe Être).' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-p3s1',
        questionAr: 'Comment conjugue-t-on le verbe ÊTRE avec "Je" ?',
        options: [
          { id: 'a', textAr: 'Je suis', isCorrect: true, explanationAr: 'Exactement ! On dit : Je suis.' },
          { id: 'b', textAr: 'J\'ai', isCorrect: false, explanationAr: '"J\'ai" est la conjugaison du verbe AVOIR, pas du verbe ÊTRE.' },
          { id: 'c', textAr: 'Tu es', isCorrect: false, explanationAr: '"Tu es" se conjugue avec "Tu" ; avec "Je" on dit "Je suis".' }
        ]
      },
      {
        id: 'q2-p3s1',
        questionAr: 'Quel mot contient le son nasal "IN" ?',
        options: [
          { id: 'a', textAr: 'Lapin', isCorrect: true, explanationAr: 'Bravo ! Lapin contient le son nasal IN.' },
          { id: 'b', textAr: 'Maman', isCorrect: false, explanationAr: 'Maman contient le son nasal AN, pas IN.' },
          { id: 'c', textAr: 'Enfant', isCorrect: false, explanationAr: 'Enfant contient les sons EN et AN, pas IN.' }
        ]
      }
    ]
},

// ==========================================
// Trimestre 2 (suite) — Projet 4 : Qu'est-ce qu'on mange ?
// ==========================================
{
    id: 'french-3ap-p4-seq1-meals-verbs',
    grade: '4AP',
    subject: 'french',
    trimester: 2,
    domainAr: 'Langue Française - Projet 4: Qu\'est-ce qu\'on mange ?',
    sequenceAr: 'Séquence 1: Les repas et les aliments',
    categoryAr: 'اللغة الفرنسية - التغذية وفعلي MANGER و BOIRE',
    titleAr: 'P4-S1 : LES REPAS DE LA JOURNÉE (ALIMENTS, VERBES MANGER/BOIRE & SONS au / eau)',
    summaryAr: 'Vocabulaire des repas de la journée et des aliments de base, conjugaison des verbes MANGER et BOIRE au présent, et étude des sons AU/EAU.',
    objectiveAr: 'Nommer les repas et aliments principaux, utiliser les verbes manger et boire au présent, et lire les sons au/eau.',
    objectivesAr: [
        'Je nomme les 3 repas de la journée et des aliments simples en français.',
        'Je conjugue MANGER et BOIRE au présent (Je, Tu, Il/Elle).',
        'Je lis des mots contenant les sons au/eau.',
    ],
    detailedCourse: {
        introAr: 'Chaque jour, on prend 3 repas principaux : le petit-déjeuner le matin, le déjeuner à midi, et le dîner le soir. Pour en parler, on utilise les verbes MANGER et BOIRE.',
        vocabulary: [
            { termAr: 'Le verbe MANGER', definitionAr: 'Verbe du 1er groupe : Je mange, Tu manges, Il/Elle mange.' },
            { termAr: 'Le verbe BOIRE', definitionAr: 'Verbe irrégulier : Je bois, Tu bois, Il/Elle boit.' },
        ],
        visualizationHintAr: 'Décris ton petit-déjeuner d\'aujourd\'hui avec une phrase : "Je mange..." et "Je bois...".',
        commonMistakes: [
            { mistakeAr: 'Dire "Je manges" au lieu de "Je mange".', correctionAr: 'Avec "Je", le verbe MANGER (1er groupe) se termine par -e : Je mange (pas de S).' },
        ],
        takeawayAr: 'Les 3 repas : le petit-déjeuner, le déjeuner, le dîner. Je mange, Tu manges, Il/Elle mange. Je bois, Tu bois, Il/Elle boit. Sons : au/eau se lisent /o/.',
    },
    keyFormulas: [
        { labelAr: 'MANGER au présent', formulaAr: 'Je mange | Tu manges | Il/Elle mange' },
        { labelAr: 'BOIRE au présent', formulaAr: 'Je bois | Tu bois | Il/Elle boit' },
    ],
    discoveryAr: 'Le matin chez Sarah :\n- "Sarah, qu\'est-ce que tu manges au petit-déjeuner ?" - "Je mange du pain et je bois du lait chaud !"\n- "Et à midi ?" - "Au déjeuner, je mange du riz avec de la viande."',
    rulesAr: [
      'Les 3 repas de la journée : le petit-déjeuner (وجبة الفطور), le déjeuner (وجبة الغداء), le dîner (وجبة العشاء).',
      'Les Aliments de base : le pain (الخبز), le lait (الحليب), le riz (الأرز), la viande (اللحم), le poisson (السمك), les œufs (البيض), le fromage (الجبن).',
      'Le Verbe MANGER au présent (1er groupe) : Je mange | Tu manges | Il mange / Elle mange.',
      'Le Verbe BOIRE au présent (irrégulier) : Je bois | Tu bois | Il boit / Elle boit.',
      'Les Sons AU / EAU : "au" (*chaud*, *jaune*) et "eau" (*eau*, *gâteau*) se lisent tous les deux /o/.'
    ],
    interactiveTool: 'french_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Les repas de la journée',
        introAr: 'Manger / boire au présent, aliments du petit-déjeuner.',
        terms: [
            { termAr: 'le petit-déjeuner', meaningAr: 'Premier repas du matin.', exampleAr: 'Je prends le petit-déjeuner à 7 heures.' },
            { termAr: 'je mange', meaningAr: 'Verbe manger, je (1er groupe).', exampleAr: 'Je mange du pain.' },
            { termAr: 'je bois', meaningAr: 'Verbe boire, je.', exampleAr: 'Je bois du lait.' },
            { termAr: 'le déjeuner', meaningAr: 'Repas de midi.', exampleAr: 'À midi, c\'est le déjeuner.' },
        ],
    },
    examplesAr: [
      {
        problem: 'Complète avec le verbe MANGER : "Le matin, je ..... du pain."',
        solution: 'mange (Le matin, je mange du pain).'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-fr3ap-p4s1-1',
        level: 1,
        levelLabelAr: '🟢 Niveau 1 — Facile',
        problemAr: 'Quel repas prend-on le matin ?',
        hintsAr: ['Premier repas de la journée'],
        solutionAr: 'Le petit-déjeuner',
        detailedCorrectionAr: 'Bravo ! 👏 On prend le petit-déjeuner le matin.',
        xpReward: 10
      },
      {
        id: 'ex2-fr3ap-p4s1-2',
        level: 2,
        levelLabelAr: '🟡 Niveau 2 — Moyen',
        problemAr: 'Lit le mot avec le son EAU : G + Â + T + EAU = ?',
        hintsAr: ['Un dessert sucré qu\'on mange à l\'anniversaire 🎂'],
        solutionAr: 'GÂTEAU',
        detailedCorrectionAr: 'Délicieux ! 🎂 G-Â-T-EAU forme le mot "Gâteau".',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-fr3ap-p4s1',
      type: 'quiz_flash',
      titleAr: '🎮 Jeu des Repas et des Aliments',
      instructionsAr: 'Trouve le bon mot ou la bonne conjugaison !',
      items: [
        { questionOrPromptAr: 'Je ..... du lait (Verbe BOIRE)', correctAnswerAr: 'bois', optionsAr: ['bois', 'boit', 'manges'], explanationAr: 'Avec "Je", on dit : Je bois.' },
        { questionOrPromptAr: 'Le repas du soir s\'appelle...', correctAnswerAr: 'le dîner', optionsAr: ['le dîner', 'le déjeuner', 'le petit-déjeuner'], explanationAr: 'Le repas du soir est le dîner.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-p4s1',
        questionAr: 'Comment conjugue-t-on le verbe MANGER avec "Tu" ?',
        options: [
          { id: 'a', textAr: 'Tu manges', isCorrect: true, explanationAr: 'Exactement ! On dit : Tu manges (avec un S).' },
          { id: 'b', textAr: 'Tu mange', isCorrect: false, explanationAr: 'Avec "Tu", il faut ajouter un S : Tu manges.' },
          { id: 'c', textAr: 'Tu manger', isCorrect: false, explanationAr: 'C\'est l\'infinitif ; il faut conjuguer : Tu manges.' },
        ]
      },
      {
        id: 'q2-p4s1',
        questionAr: 'Quel repas prend-on à midi ?',
        options: [
          { id: 'a', textAr: 'Le déjeuner', isCorrect: true, explanationAr: 'Bravo ! Le déjeuner se prend à midi.' },
          { id: 'b', textAr: 'Le dîner', isCorrect: false, explanationAr: 'Le dîner se prend le soir, pas à midi.' },
        ]
      }
    ]
},

{
    id: 'french-3ap-p4-seq2-hunger-quantities',
    grade: '4AP',
    subject: 'french',
    trimester: 2,
    domainAr: 'Langue Française - Projet 4: Qu\'est-ce qu\'on mange ?',
    sequenceAr: 'Séquence 2: Au marché et les petites quantités',
    categoryAr: 'اللغة الفرنسية - الجوع والعطش والكميات البسيطة',
    titleAr: 'P4-S2 : AU MARCHÉ (J\'AI FAIM / J\'AI SOIF, PETITES QUANTITÉS & SON qu)',
    summaryAr: 'Expressions J\'ai faim / J\'ai soif, vocabulaire des fruits et légumes au marché, petites quantités (un peu de, beaucoup de) et étude du son QU.',
    objectiveAr: 'Exprimer la faim et la soif, utiliser des quantités simples, et lire des mots avec le son QU.',
    objectivesAr: [
        'J\'exprime la faim et la soif avec "J\'ai faim" / "J\'ai soif".',
        'J\'utilise des quantités simples : un peu de, beaucoup de.',
        'Je lis des mots contenant le son QU.',
    ],
    detailedCourse: {
        introAr: 'Au marché, on achète les aliments pour la maison. Pour dire qu\'on a besoin de manger ou de boire, on dit "J\'ai faim" ou "J\'ai soif" — avec le verbe AVOIR, pas ÊTRE.',
        vocabulary: [
            { termAr: 'J\'ai faim / J\'ai soif', definitionAr: 'Expressions avec le verbe AVOIR pour dire qu\'on a besoin de manger ou de boire.' },
            { termAr: 'Un peu de / Beaucoup de', definitionAr: 'Expressions de quantité : un peu de (كمية قليلة) et beaucoup de (كمية كبيرة).' },
        ],
        visualizationHintAr: 'Imagine que tu es au marché avec ta maman : nomme 3 fruits et 3 légumes que tu voudrais acheter, en français.',
        commonMistakes: [
            { mistakeAr: 'Dire "Je suis faim" au lieu de "J\'ai faim".', correctionAr: 'En français, la faim et la soif utilisent le verbe AVOIR : "J\'ai faim", jamais "Je suis faim".' },
        ],
        takeawayAr: 'J\'ai faim / J\'ai soif (verbe AVOIR). Un peu de.../Beaucoup de... pour les quantités. Le son QU se lit /k/ (quatre, coq).',
    },
    keyFormulas: [
        { labelAr: 'Exprimer la faim et la soif', formulaAr: 'J\'ai faim (أنا جائع) | J\'ai soif (أنا عطشان)' },
    ],
    discoveryAr: 'Au marché avec Grand-mère :\n- "Grand-mère, j\'ai faim !" - "Alors prenons des fruits : un peu de raisin et beaucoup de pommes !"\n- "Et j\'ai soif aussi !" - "On achète de l\'eau fraîche."',
    rulesAr: [
      'Exprimer la faim et la soif avec AVOIR : J\'ai faim (أنا جائع) | J\'ai soif (أنا عطشان) | Il/Elle a faim, Il/Elle a soif.',
      'Fruits et légumes du marché : le raisin (العنب), la carotte (الجزر), la pomme de terre (البطاطا), l\'oignon (البصل), la banane (الموز).',
      'Les Quantités simples : un peu de... (قليل من) / beaucoup de... (كثير من). Exemple : "Un peu de sucre" / "Beaucoup de légumes".',
      'Le Son QU : se lit toujours /k/, jamais /kw/ (*quatre*, *coq* — ici avec un C, mais même son /k/).'
    ],
    interactiveTool: 'french_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Au marché',
        introAr: 'J\'ai faim / j\'ai soif et petites quantités.',
        terms: [
            { termAr: 'j\'ai faim', meaningAr: 'Je veux manger.', exampleAr: 'J\'ai faim ! Je voudrais du pain.' },
            { termAr: 'j\'ai soif', meaningAr: 'Je veux boire.', exampleAr: 'J\'ai soif. Je bois de l\'eau.' },
            { termAr: 'un peu de', meaningAr: 'Petite quantité.', exampleAr: 'Un peu de fromage, s\'il te plaît.' },
            { termAr: 'le marché', meaningAr: 'On y achète fruits et légumes.', exampleAr: 'Nous allons au marché le vendredi.' },
        ],
    },
    examplesAr: [
      {
        problem: 'Comment dit-on "أنا جائع" en français ?',
        solution: 'J\'ai faim.'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-fr3ap-p4s2-1',
        level: 1,
        levelLabelAr: '🟢 Niveau 1 — Facile',
        problemAr: 'Comment dit-on qu\'on a besoin de boire, en français ?',
        hintsAr: ['J\'ai + un mot qui veut dire "envie de boire"'],
        solutionAr: 'J\'ai soif',
        detailedCorrectionAr: 'Bravo ! 👏 On dit "J\'ai soif" pour exprimer le besoin de boire.',
        xpReward: 10
      },
      {
        id: 'ex2-fr3ap-p4s2-2',
        level: 2,
        levelLabelAr: '🟡 Niveau 2 — Moyen',
        problemAr: 'Lit le mot avec le son QU : Q + U + A + T + R + E = ?',
        hintsAr: ['Le chiffre après trois'],
        solutionAr: 'QUATRE',
        detailedCorrectionAr: 'Parfait ! 🔢 Q-U-A-T-R-E forme le mot "Quatre".',
        xpReward: 15
      }
    ],
    educationalGame: {
      id: 'game-fr3ap-p4s2',
      type: 'association',
      titleAr: '🎮 Jeu du Marché : Faim, Soif et Quantités',
      instructionsAr: 'Associe chaque situation à la bonne expression !',
      items: [
        { questionOrPromptAr: 'Tu veux boire de l\'eau (Comment le dire ?)', correctAnswerAr: 'J\'ai soif', optionsAr: ['J\'ai soif', 'J\'ai faim', 'Je suis fatigué'], explanationAr: 'On dit "J\'ai soif" pour exprimer le besoin de boire.' },
        { questionOrPromptAr: 'Beaucoup de... (Quantité)', correctAnswerAr: 'كثير من', optionsAr: ['كثير من', 'قليل من', 'لا شيء'], explanationAr: '"Beaucoup de" veut dire كثير من.' }
      ],
      xpReward: 20
    },
    quiz: [
      {
        id: 'q1-p4s2',
        questionAr: 'Quelle expression utilise-t-on pour dire qu\'on a besoin de manger ?',
        options: [
          { id: 'a', textAr: 'J\'ai faim', isCorrect: true, explanationAr: 'Exactement ! "J\'ai faim" exprime le besoin de manger.' },
          { id: 'b', textAr: 'Je suis faim', isCorrect: false, explanationAr: 'On utilise le verbe AVOIR, pas ÊTRE : "J\'ai faim".' },
          { id: 'c', textAr: 'J\'ai soif', isCorrect: false, explanationAr: '"J\'ai soif" exprime le besoin de boire, pas de manger.' },
        ]
      },
      {
        id: 'q2-p4s2',
        questionAr: 'Quel son entend-on dans le mot "QUATRE" ?',
        options: [
          { id: 'a', textAr: 'Le son /k/', isCorrect: true, explanationAr: 'Bravo ! QU se lit toujours /k/.' },
          { id: 'b', textAr: 'Le son /g/', isCorrect: false, explanationAr: 'QU ne se lit jamais /g/, toujours /k/.' },
        ]
      }
    ]
},

{
    id: 'french-3ap-p3-seq2-garden-reading',
    grade: '4AP',
    subject: 'french',
    trimester: 2,
    domainAr: 'Langue Française - Projet 3: Tu as un animal ?',
    sequenceAr: 'Séquence 2: Au jardin et lecture combinatoire',
    categoryAr: 'اللغة الفرنسية - القراءة والقواعد العامة',
    titleAr: 'P3-S2 : AU JARDIN & LECTURE COMBINATOIRE (FRUITS, EXPRESSION DES GOÛTS & SONS oi, ou, gn, ill)',
    summaryAr: 'Vocabulaire du jardin, des fruits et légumes, expression des goûts (J\'aime / Je n\'aime pas), maîtrise des sons complexes (oi, gn, ill) et entraînement à la lecture fluide de petits textes.',
    objectiveAr: 'Exprimer ses préférences culinaires, lire de courtes phrases en combinando consonnes et voyelles, et réussir le bilan annuel de 3AP.',
    objectivesAr: [
        'Je nomme des fruits et légumes en français.',
        'J\'exprime mes goûts avec "J\'aime" / "Je n\'aime pas".',
        'Je lis des mots contenant les sons oi, gn, ill.',
    ],
    detailedCourse: {
        introAr: 'Pour parler de ce qu\'on aime manger, on utilise "J\'aime..." ou "Je n\'aime pas...". Cette leçon est aussi l\'occasion de réviser tous les sons complexes appris cette année.',
        vocabulary: [
            { termAr: 'J\'aime / Je n\'aime pas', definitionAr: 'Expressions pour dire ce qu\'on apprécie ou non.' },
            { termAr: 'La lecture combinatoire', definitionAr: 'Méthode de lecture qui assemble consonnes et voyelles pour former des syllabes, puis des mots.' },
        ],
        visualizationHintAr: 'Fais la liste de 3 fruits que tu aimes et 3 que tu n\'aimes pas, en français.',
        commonMistakes: [
            { mistakeAr: 'Oublier "ne...pas" complet dans la phrase négative.', correctionAr: 'La négation complète est "Je n\'aime pas", avec "ne" (n\') avant le verbe et "pas" après.' },
        ],
        takeawayAr: 'J\'aime.../Je n\'aime pas... pour exprimer ses goûts. Sons complexes : oi (/wa/), gn (/ɲ/), ill (/ij/). Règle d\'or : consonne + voyelle = syllabe.',
    },
    keyFormulas: [
        { labelAr: 'Règle de la lecture combinatoire', formulaAr: 'Consonne + Voyelle = Syllabe ➔ Syllabes = Mot' },
    ],
    discoveryAr: 'Dans le potager de Grand-père :\n- "J\'aime les pommes rouges et les bananes douces."\n- "Je n\'aime pas les oignons, mais j\'adore les tomates du jardin !"',
    rulesAr: [
      'Les Fruits et Légumes : la pomme (التفاحة), la banane (الموزة), l\'orange (البرتقالة), la tomate (الطماطم), la carotte (الجزر).',
      'Exprimer ses goûts : "J\'aime..." (أنا أحب...) / "Je n\'aime pas..." (أنا لا أحب...).',
      'Les Sons Complexes :\n- "oi" se lit /wa/ (*oiseau*, *poisson*).\n- "gn" se lit /ɲ/ (*agneau*, *montagne*).\n- "ill" se lit /ij/ (*fille*, *papillon*).',
      'La Règle d\'or de la Lecture Combinatoire : Consonne + Voyelle = Syllabe (ex: p + a = pa), Syllabes assemblées = Mot (ex: pa + pa = papa), Mots assemblés = Phrase.'
    ],
    interactiveTool: 'french_dialogue_lab',
    languageInteractive: {
        type: 'vocabulary_explorer',
        titleAr: 'Au jardin',
        introAr: 'Fruits et goûts : j\'aime / je n\'aime pas.',
        terms: [
            { termAr: 'la pomme', meaningAr: 'Fruit.', exampleAr: 'J\'aime la pomme.' },
            { termAr: 'l\'orange', meaningAr: 'Fruit.', exampleAr: 'Je mange une orange.' },
            { termAr: 'j\'aime', meaningAr: 'Exprimer un goût positif.', exampleAr: 'J\'aime les dattes.' },
            { termAr: 'je n\'aime pas', meaningAr: 'Exprimer un goût négatif.', exampleAr: 'Je n\'aime pas le citron.' },
        ],
    },
    examplesAr: [
      {
        problem: 'Lit le son complexe dans "POISSON" :',
        solution: 'P - OI - SS - ON (/Pwa-sõ/).'
      }
    ],
    progressiveExercises: [
      {
        id: 'ex1-fr3ap-p3s2-1',
        level: 1,
        levelLabelAr: '🟢 Niveau 1 — Facile',
        problemAr: 'Comment dit-on "أنا أحب التفاح" en français ?',
        hintsAr: ['J\'aime + les pommes'],
        solutionAr: 'J\'aime les pommes',
        detailedCorrectionAr: 'Bravo ! 👏 On dit : "J\'aime les pommes".',
        xpReward: 10
      },
      {
        id: 'ex2-fr3ap-p3s2-2',
        level: 2,
        levelLabelAr: '🟡 Niveau 2 — Moyen',
        problemAr: 'Lit le mot avec le son ILL : P + A + P + ILL + ON = ?',
        hintsAr: ['Un bel insecte volant coloré dans le jardin 🦋'],
        solutionAr: 'PAPILLON',
        detailedCorrectionAr: 'Magnifique ! 🦋 P-A-P-ILL-ON forme le mot "Papillon".',
        xpReward: 20
      }
    ],
    educationalGame: {
      id: 'game-fr3ap-p3s2',
      type: 'association',
      titleAr: '🎮 Grand Bilan Français 3AP : Mots et Sons',
      instructionsAr: 'Associe chaque mot à son image ou son son !',
      items: [
        { questionOrPromptAr: 'Oiseau (Quel son ?)', correctAnswerAr: 'Le son OI (/wa/)', optionsAr: ['Le son OI (/wa/)', 'Le son ON', 'Le son IN'], explanationAr: 'Oiseau contient le son OI.' },
        { questionOrPromptAr: 'Papillon (Quel son ?)', correctAnswerAr: 'Le son ILL (/ij/)', optionsAr: ['Le son ILL (/ij/)', 'Le son CH', 'Le son OU'], explanationAr: 'Papillon contient le son ILL.' }
      ],
      xpReward: 25
    },
    quiz: [
      {
        id: 'q1-p3s2',
        questionAr: 'Quelle est la forme négative pour exprimer qu\'on n\'aime pas quelque chose ?',
        options: [
          { id: 'a', textAr: 'Je n\'aime pas...', isCorrect: true, explanationAr: 'Bravo ! "Je n\'aime pas..." est la formule négative.' },
          { id: 'b', textAr: 'J\'aime...', isCorrect: false, explanationAr: '"J\'aime..." est la forme affirmative (positive), pas négative.' },
          { id: 'c', textAr: 'Je n\'aime...', isCorrect: false, explanationAr: 'Il manque le mot "pas" à la fin ; la négation complète est "Je n\'aime pas...".' }
        ]
      },
      {
        id: 'q2-p3s2',
        questionAr: 'Comment se lit le son "OI" dans le mot "OISEAU" ?',
        options: [
          { id: 'a', textAr: '/wa/', isCorrect: true, explanationAr: 'Exact ! Le son OI se lit /wa/, comme dans oiseau et poisson.' },
          { id: 'b', textAr: '/ɲ/', isCorrect: false, explanationAr: 'Le son /ɲ/ correspond à "GN" (comme dans agneau), pas à "OI".' },
          { id: 'c', textAr: '/ij/', isCorrect: false, explanationAr: 'Le son /ij/ correspond à "ILL" (comme dans papillon), pas à "OI".' }
        ]
      }
    ]
},

// ==========================================
// 16. FRANÇAIS - 4AP (اللغة الفرنسية - السنة الرابعة ابتدائي الجيل الثاني)
// ==========================================
{
    id: 'french-4ap-projet1-seq1-presentation-famille',
    grade: '4AP',
    subject: 'french',
    trimester: 2,
    categoryAr: 'Projet 1 : C\'est notre quartier ! - Séquence 1',
    titleAr: 'Projet 1 - Séquence 1 : « Salut ! Je m\'appelle Mouloud » - Se présenter, la famille, le verbe Être/Avoir & les articles',
    summaryAr: `Dans cette première séquence du Projet 1 (4AP), l'élève apprend à se présenter (nom, prénom, âge) et présenter les membres de sa famille. Il étudie les formules de salutation, les articles définis/indéfinis et la conjugaison des auxiliaires Être et Avoir au présent.`,
    objectivesAr: [
        'Je sais me présenter et présenter les membres de ma famille.',
        'Je sais utiliser les articles définis et indéfinis correctement.',
        'Je sais conjuguer Être et Avoir au présent.',
    ],
    detailedCourse: {
        introAr: 'Pour se présenter, on utilise toujours les verbes Être et Avoir : "Je suis..." pour dire qui on est, et "J\'ai..." pour dire son âge ou ce qu\'on possède. Ce sont deux verbes essentiels à bien connaître.',
        vocabulary: [
            { termAr: 'Article défini', definitionAr: 'le, la, l\', les — désigne une personne ou chose précise déjà connue.' },
            { termAr: 'Article indéfini', definitionAr: 'un, une, des — désigne une personne ou chose non précisée.' },
        ],
        visualizationHintAr: 'Dessine ton arbre familial avec les prénoms de chaque membre, puis écris une phrase pour chacun avec "Il/Elle est..." ou "Il/Elle a...".',
        commonMistakes: [
            { mistakeAr: 'Confondre "es" et "est" en conjuguant Être.', correctionAr: '"Tu es" (avec Tu) s\'écrit avec un "s", alors que "Il/Elle est" s\'écrit avec un "t" — ce sont deux formes différentes du même verbe.' },
        ],
        takeawayAr: 'Être : je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont. Avoir : j\'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont.',
    },
    rulesAr: [
        'Vocabulaire - Les salutations et la famille : Bonjour, Salut, Au revoir, Merci, S\'il vous plaît. Les membres de la famille : le père, la mère, le frère, la sœur, le grand-père, la grand-mère.',
        'Grammaire - Les articles définis et indéfinis : Articles définis (le, la, l\', les) désignent une personne ou chose précise (ex: le frère). Articles indéfinis (un, une, des) désignent une personne ou chose non précise (ex: un voisin).',
        'Conjugaison - L\'auxiliaire Être au présent de l\'indicatif : Je suis, Tu es, Il/Elle est, Nous sommes, Vous êtes, Ils/Elles sont. (Exemple : "Je suis un élève de 4AP").',
        'Conjugaison - L\'auxiliaire Avoir au présent de l\'indicatif : J\'ai, Tu as, Il/Elle a, Nous avons, Vous avez, Ils/Elles ont. (Exemple : "J\'ai 9 ans et j\'ai un frère").',
        'Orthographe - Le genre des noms : Masculin (un/le) ➔ Féminin (une/la). Exemple : un ami ➔ une amie.'
    ],
    keyFormulas: [
        { labelAr: 'Conjugaison du verbe Être au présent', formulaAr: 'je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont' },
        { labelAr: 'Conjugaison du verbe Avoir au présent', formulaAr: 'j\'ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont' }
    ],
    examplesAr: [
        {
            problem: 'Production écrite (Carte d\'identité / Présentation) :\nRédige une courte carte de présentation pour te présenter et présenter ta famille.',
            solution: 'Bonjour ! Je m\'appelle Mouloud. J\'ai 9 ans et je suis élève en 4ème Année Primaire. Voici ma famille : mon père s\'appelle Yacine, ma mère s\'appelle Amina. J\'ai un frère et une sœur.'
        }
    ],
    interactiveTool: 'french_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'Quelle est la forme correcte du verbe "Être" au présent dans la phrase : "Nous ...... des élèves de 4AP" ?',
            options: [
                { id: 'a', textAr: 'sommes', isCorrect: true, explanationAr: 'Bravo ! Avec le sujet "Nous", la forme du verbe être au présent est "sommes" (Nous sommes).' },
                { id: 'b', textAr: 'êtes', isCorrect: false },
                { id: 'c', textAr: 'sont', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Quel est l\'article indéfini féminin correct à placer devant "soeur" ?',
            options: [
                { id: 'a', textAr: 'une', isCorrect: true, explanationAr: 'Excellente réponse ! "sœur" est un nom féminin singulier, on utilise l\'article indéfini "une" (une sœur).' },
                { id: 'b', textAr: 'un', isCorrect: false },
                { id: 'c', textAr: 'des', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'french-4ap-projet1-seq2-maison-quartier',
    grade: '4AP',
    subject: 'french',
    trimester: 2,
    categoryAr: 'Projet 1 : C\'est notre quartier ! - Séquence 2',
    titleAr: 'Projet 1 - Séquence 2 : « Où habites-tu ? » - La maison, le quartier, les verbes du 1er groupe & le sujet (GNS/GV)',
    summaryAr: `L'élève apprend à décrire sa maison, localiser son logement dans le quartier en utilisant les prépositions de lieu (près de, loin de, en face de, à côté de), identifier le Groupe Nominal Sujet (GNS) et le Groupe Verbal (GV) dans une phrase simple, et conjuguer les verbes du 1er groupe au présent.`,
    objectivesAr: [
        'Je sais décrire ma maison et localiser mon quartier avec des indicateurs de lieu.',
        'Je sais identifier le GNS et le GV dans une phrase simple.',
        'Je sais conjuguer un verbe du 1er groupe (-er) au présent.',
    ],
    detailedCourse: {
        introAr: 'Une phrase simple se compose toujours d\'un sujet (GNS) et d\'un verbe (GV). Le GNS répond à la question "qui fait l\'action ?", le GV décrit l\'action.',
        vocabulary: [
            { termAr: 'GNS (Groupe Nominal Sujet)', definitionAr: 'La personne ou la chose qui fait l\'action. Répond à la question "qui ?" avant le verbe. Exemple : "Amine (GNS) joue dans le jardin".' },
            { termAr: 'GV (Groupe Verbal)', definitionAr: 'Le verbe et ce qu\'il dit de l\'action. Exemple : "Amine joue dans le jardin (GV)".' },
        ],
        visualizationHintAr: 'Dans une phrase, cherche d\'abord le verbe, puis pose la question "qui fait l\'action ?" juste avant lui : la réponse est le GNS. Tout le reste, à partir du verbe, forme le GV.',
        commonMistakes: [
            { mistakeAr: 'Confondre le GNS avec le premier mot de la phrase.', correctionAr: 'Le GNS n\'est pas toujours le premier mot : il faut chercher qui fait vraiment l\'action du verbe.' },
        ],
        takeawayAr: 'La phrase simple = GNS (qui fait l\'action) + GV (le verbe et ce qu\'il décrit).',
    },
    rulesAr: [
        'Vocabulaire - La maison et le quartier : La maison (le salon, la chambre, la cuisine, le jardin, la salle de bain). Le quartier (la rue, l\'avenue, l\'école, la pharmacie, le stade, la boulangerie).',
        'Vocabulaire - Les indicateurs de lieu : près de, loin de, en face de, à côté de, dans. (Exemple : "J\'habite près de l\'école").',
        'Grammaire - La structure de la phrase simple : La phrase se compose d\'un Groupe Nominal Sujet (GNS) et d\'un Groupe Verbal (GV). Exemple : "Mouloud (GNS) habite dans un beau quartier (GV)".',
        'Conjugaison - Les verbes du 1er groupe (-er) au présent : habiter, trouver, visiter. Les terminaisons sont : -e, -es, -e, -ons, -ez, -ent.',
        'Orthographe - Le pluriel des noms simples : On ajoute généralement un "-s" au pluriel. Exemple : un voisin ➔ des voisins.'
    ],
    keyFormulas: [
        { labelAr: 'Structure de la phrase simple', formulaAr: 'GNS (Sujet) + GV (Verbe + Complément)' },
        { labelAr: 'Terminaisons du 1er groupe (-er) au présent', formulaAr: '-e, -es, -e, -ons, -ez, -ent' }
    ],
    examplesAr: [
        {
            problem: 'Production écrite (Indiquer son adresse et décrire son quartier) :\nComplète le texte suivant pour décrire où tu habites à partir des mots : (près de, maison, quartier, grande).\n« J\'habite dans une .................. . Elle se trouve dans un grand .................. . Ma maison est .................. l\'école. Elle a une .................. porte verte. »',
            solution: '« J\'habite dans une maison. Elle se trouve dans un grand quartier. Ma maison est près de l\'école. Elle a une grande porte verte. »'
        }
    ],
    interactiveTool: 'french_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'Quelle est la conjugaison correcte du verbe "habiter" avec le sujet "Tu" au présent ?',
            options: [
                { id: 'a', textAr: 'Tu habites près du stade.', isCorrect: true, explanationAr: 'Parfait ! Au présent, les verbes du 1er groupe prennent la terminaison "-es" avec "Tu".' },
                { id: 'b', textAr: 'Tu habite près du stade.', isCorrect: false },
                { id: 'c', textAr: 'Tu habitez près du stade.', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Dans la phrase "Amine dessine une belle maison", quel est le Groupe Nominal Sujet (GNS) ?',
            options: [
                { id: 'a', textAr: 'Amine', isCorrect: true, explanationAr: 'Très bien ! "Amine" est le sujet qui fait l\'action de dessiner (GNS).' },
                { id: 'b', textAr: 'dessine une belle maison', isCorrect: false },
                { id: 'c', textAr: 'une belle maison', isCorrect: false }
            ]
        },
        {
            id: 'q3',
            questionAr: 'Dans la phrase "Le chat dort sur le tapis", quel est le Groupe Verbal (GV) ?',
            options: [
                { id: 'a', textAr: 'dort sur le tapis', isCorrect: true, explanationAr: 'Exactement ! "dort sur le tapis" décrit l\'action : c\'est le GV.' },
                { id: 'b', textAr: 'Le chat', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'french-4ap-projet1-seq2-prepositions-lieu',
    grade: '4AP',
    subject: 'french',
    trimester: 2,
    categoryAr: 'Projet 1 : C\'est notre quartier ! - Séquence 2',
    titleAr: 'Projet 1 - Séquence 2 (bis) : Les prépositions de lieu (dans, sur, sous, devant, derrière)',
    summaryAr: 'L\'élève localise des objets et des lieux du quartier avec les prépositions de lieu essentielles du programme 4AP — sans pronoms COD (5AP).',
    objectivesAr: [
        'Je sais utiliser dans, sur, sous, devant, derrière pour situer un objet.',
        'Je sais poser la question « Où est... ? » et y répondre.',
        'Je décris la position d\'un lieu dans le quartier.',
    ],
    detailedCourse: {
        introAr: 'Pour dire où se trouve quelque chose, on utilise des prépositions de lieu simples : dans, sur, sous, devant, derrière.',
        vocabulary: [
            { termAr: 'Préposition de lieu', definitionAr: 'Petit mot qui indique la position (dans = داخل, sur = فوق, sous = تحت, devant = أمام, derrière = وراء).' },
        ],
        visualizationHintAr: 'Dessine ta chambre et place trois objets avec dans, sur et sous.',
        commonMistakes: [
            { mistakeAr: 'Confondre sur et sous.', correctionAr: 'sur = au-dessus, sous = en dessous.' },
        ],
        takeawayAr: 'Où est le livre ? — Il est sur la table. / Il est dans le cartable. / Il est sous le lit.',
    },
    rulesAr: [
        'dans (dans la classe)',
        'sur (sur le bureau)',
        'sous (sous la chaise)',
        'devant (devant l\'école)',
        'derrière (derrière la maison)',
        'Question: « Où est + nom ? » — Réponse: « Il/Elle est + préposition + nom. »',
    ],
    keyFormulas: [
        { labelAr: 'Question de lieu', formulaAr: 'Où est le cartable ?' },
        { labelAr: 'Réponse', formulaAr: 'Il est dans le cartable.' },
    ],
    examplesAr: [
        { problem: 'Complète: « Le chat est ...... le lit. » (sous)', solution: '« Le chat est sous le lit. »' },
        { problem: 'Complète: « Le stylo est ...... la trousse. » (dans)', solution: '« Le stylo est dans la trousse. »' },
    ],
    interactiveTool: 'french_lab',
    quiz: [
        { id: 'q1', questionAr: 'Quelle préposition pour « تحت » ?', options: [{ id: 'a', textAr: 'sous', isCorrect: true, explanationAr: 'sous = تحت.' }, { id: 'b', textAr: 'sur', isCorrect: false }] },
        { id: 'q2', questionAr: '« Où est... ? » sert à ....', options: [{ id: 'a', textAr: 'demander un lieu', isCorrect: true, explanationAr: 'سؤال عن المكان.' }, { id: 'b', textAr: 'demander l\'heure', isCorrect: false }] },
    ],
},

{
    id: 'french-4ap-projet2-seq1-anniversaire-fete',
    grade: '4AP',
    subject: 'french',
    trimester: 3,
    categoryAr: 'Projet 2 : C\'est un grand événement ! - Séquence 1',
    titleAr: 'Projet 2 - Séquence 1 : « Bon anniversaire ! » - Les fêtes familiales, la phrase négative & la lettre g/c',
    summaryAr: `Dans ce projet consacré aux fêtes et célébrations, l'élève apprend à exprimer la préparation d'un anniversaire, rédiger une carte d'invitation, utiliser la forme négative (ne ... pas) et maîtriser la conjugaison du verbe Faire au présent.`,
    objectivesAr: [
        'Je sais rédiger une carte d\'invitation pour une fête.',
        'Je sais transformer une phrase affirmative en phrase négative.',
        'Je sais conjuguer le verbe Faire au présent.',
    ],
    detailedCourse: {
        introAr: 'Pour dire qu\'une action ne se fait pas, on utilise la forme négative : on encadre le verbe avec "ne" et "pas". C\'est très utile pour parler de ce qu\'on ne fait pas pendant une fête, par exemple.',
        vocabulary: [
            { termAr: 'La forme négative', definitionAr: 'Structure qui exprime le contraire d\'une affirmation, formée avec "ne ... pas" autour du verbe.' },
        ],
        visualizationHintAr: 'Imagine deux mains qui encadrent le verbe : la main gauche tient "ne", la main droite tient "pas" — le verbe reste toujours entre les deux.',
        commonMistakes: [
            { mistakeAr: 'Oublier le "ne" et ne garder que "pas".', correctionAr: 'La négation complète a besoin des deux mots : "ne" avant le verbe et "pas" après (Je ne mange pas), même à l\'oral où le "ne" est parfois moins entendu.' },
        ],
        takeawayAr: 'La phrase négative = Sujet + ne (n\') + Verbe + pas + Complément. Le verbe Faire : je fais, tu fais, il/elle fait, nous faisons, vous faites, ils/elles font.',
    },
    rulesAr: [
        'Vocabulaire - Champ lexical de la fête : le gâteau d\'anniversaire, les bougies, les cadeaux, les jus, la musique, inviter les amis, fêter, souffler.',
        'Grammaire - La phrase négative : Pour transformer une phrase affirmative en phrase négative, on encadre le verbe par "ne ... pas" (ou "n\'... pas" devant une voyelle). Exemple : "Je mange le gâteau" ➔ "Je ne mange pas le gâteau".',
        'Conjugaison - Le verbe "Faire" au présent de l\'indicatif : Je fais, Tu fais, Il/Elle fait, Nous faisons, Vous faites, Ils/Elles font. (Exemple : "Maman fait un délicieux gâteau").',
        'Orthographe - La valeur de la lettre g : "g" se prononce [g] devant a, o, u (gâteau, gare) et [ʒ] devant e, i, y (bougie, gilet).'
    ],
    keyFormulas: [
        { labelAr: 'Règle de la forme négative', formulaAr: 'Sujet + ne (n\') + Verbe + pas + Complément' },
        { labelAr: 'Conjugaison du verbe Faire au présent', formulaAr: 'je fais, tu fais, il/elle fait, nous faisons, vous faites, ils/elles font' }
    ],
    examplesAr: [
        {
            problem: 'Production écrite (Rédiger une carte d\'invitation) :\nRédige une carte d\'invitation pour ton ami Yacine pour ton anniversaire.',
            solution: 'Cher Yacine,\nJe t\'invite à mon anniversaire le samedi 15 octobre à 15h00 chez moi à la maison. Nous allons manger du gâteau et jouer ensemble. Viens vite !\nTon ami, Amine.'
        }
    ],
    interactiveTool: 'french_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'Quelle est la forme négative correcte de la phrase : "Le garçon mange les friandises" ?',
            options: [
                { id: 'a', textAr: 'Le garçon ne mange pas les friandises.', isCorrect: true, explanationAr: 'Bravo ! Le verbe "mange" est bien encadré par "ne" et "pas".' },
                { id: 'b', textAr: 'Le garçon pas mange les friandises.', isCorrect: false },
                { id: 'c', textAr: 'Le garçon ne pas mange les friandises.', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Comment se prononce la lettre "g" dans le mot "bougie" ?',
            options: [
                { id: 'a', textAr: 'Elle se prononce [ʒ] (comme le j) car elle est devant la lettre "i"', isCorrect: true, explanationAr: 'Exactement ! Devant e, i et y, la lettre g fait le son [ʒ].' },
                { id: 'b', textAr: 'Elle se prononce [g] (comme gare)', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'french-4ap-projet2-seq2-fetes-nationales-possessifs',
    grade: '4AP',
    subject: 'french',
    trimester: 3,
    categoryAr: 'Projet 2 : C\'est un grand événement ! - Séquence 2',
    titleAr: 'Projet 2 - Séquence 2 : « Bonne année ! / C\'est la fête ! » - Fêtes nationales, adjectifs possessifs/démonstratifs & verbe Aller',
    summaryAr: `L'élève découvre le vocabulaire des fêtes nationales et religieuses en Algérie (L'Aïd, Le Mouloud, Yennayer, le 1er Novembre). Il étudie les adjectifs possessifs (mon, ma, mes), démonstratifs (ce, cet, cette, ces) et le verbe Aller au présent.`,
    objectivesAr: [
        'Je connais les principales fêtes nationales et religieuses algériennes.',
        'Je sais utiliser les adjectifs possessifs et démonstratifs.',
        'Je sais conjuguer le verbe Aller au présent.',
    ],
    detailedCourse: {
        introAr: 'Les adjectifs possessifs montrent à qui appartient une chose (mon, ta, ses...), et les adjectifs démonstratifs montrent qu\'on désigne une chose précise (ce, cette, ces...).',
        vocabulary: [
            { termAr: 'Adjectif possessif', definitionAr: 'Mot placé avant un nom pour indiquer à qui il appartient (mon, ta, ses).' },
            { termAr: 'Adjectif démonstratif', definitionAr: 'Mot placé avant un nom pour désigner une chose précise qu\'on montre (ce, cette, ces).' },
        ],
        visualizationHintAr: 'Pointe du doigt un objet dans la classe en disant "cette table" ou "ce livre" — c\'est exactement le rôle de l\'adjectif démonstratif : montrer.',
        commonMistakes: [
            { mistakeAr: 'Utiliser "ce" devant un nom masculin qui commence par une voyelle.', correctionAr: 'Devant une voyelle ou un h muet, "ce" devient "cet" pour faciliter la prononciation (cet arbre, et non "ce arbre").' },
        ],
        takeawayAr: 'Possessifs : mon/ma/mes, ton/ta/tes, son/sa/ses. Démonstratifs : ce (masc.), cet (masc. + voyelle), cette (fém.), ces (pluriel). Aller : je vais, tu vas, il/elle va, nous allons, vous allez, ils/elles vont.',
    },
    rulesAr: [
        'Vocabulaire - Les fêtes nationales et religieuses : L\'Aïd El Fitr, le Mouloud, Yennayer (le nouvel an amazigh), la fête de l\'indépendance (5 Juillet).',
        'Grammaire - Les adjectifs possessifs : mon/ma/mes (à moi), ton/ta/tes (à toi), son/sa/ses (à lui/elle). Exemple : "Je mets mon beau costume pour l\'Aïd".',
        'Grammaire - Les adjectifs démonstratifs : ce (masculin : ce gâteau), cet (masculin devant voyelle : cet arbre), cette (féminin : cette fête), ces (pluriel : ces cadeaux).',
        'Conjugaison - Le verbe "Aller" au présent de l\'indicatif : Je vais, Tu vas, Il/Elle va, Nous allons, Vous allez, Ils/Elles vont. (Exemple : "Nous allons chez grand-père pour la fête").',
        'Orthographe - Le féminin des adjectifs qualificatifs simples : grand ➔ grande, petit ➔ petite, beau ➔ belle, blanc ➔ blanche.'
    ],
    keyFormulas: [
        { labelAr: 'Conjugaison du verbe Aller au présent', formulaAr: 'je vais, tu vas, il/elle va, nous allons, vous allez, ils/elles vont' },
        { labelAr: 'Emploi des démonstratifs', formulaAr: 'ce (m.), cet (m. + voyelle), cette (f.), ces (pluriel)' }
    ],
    examplesAr: [
        {
            problem: 'Production écrite (Raconter une journée de fête) :\nRaconte en 3 à 4 phrases comment tu pases la fête de l\'Aïd en famille.',
            solution: 'Le jour de l\'Aïd, je me réveille tôt. Je mets mes beaux vêtements neufs. Je vais à la mosquée avec mon père. Ensuite, nous rendons visite à notre grand-mère pour lui souhaiter une bonne fête.'
        }
    ],
    interactiveTool: 'french_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'Quel adjectif démonstratif faut-il mettre devant le mot "fête" dans la phrase : "...... fête est magnifique" ?',
            options: [
                { id: 'a', textAr: 'Cette', isCorrect: true, explanationAr: 'Bravo ! "fête" est un nom féminin singulier, on utilise l\'adjectif démonstratif "Cette".' },
                { id: 'b', textAr: 'Ce', isCorrect: false },
                { id: 'c', textAr: 'Cet', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Quelle est la conjugaison du verbe "Aller" au présent avec "Ils" ?',
            options: [
                { id: 'a', textAr: 'Ils vont à la foire.', isCorrect: true, explanationAr: 'Excellente réponse ! Avec "ils/elles", le verbe aller fait "vont" (Ils vont).' },
                { id: 'b', textAr: 'Ils allez à la foire.', isCorrect: false },
                { id: 'c', textAr: 'Ils allons à la foire.', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'french-4ap-projet2-adjectifs-qualificatifs',
    grade: '4AP',
    subject: 'french',
    trimester: 3,
    categoryAr: 'Projet 2 : C\'est un grand événement ! - Séquence 2',
    titleAr: 'Projet 2 - Séquence 2 (bis) : Les adjectifs qualificatifs (grand/grande, beau/belle)',
    summaryAr: 'L\'élève accorde l\'adjectif qualificatif avec le nom (genre et nombre) pour décrire une fête ou un événement — programme 4AP, sans futur simple (5AP).',
    objectivesAr: [
        'Je sais accorder un adjectif qualificatif en genre et en nombre.',
        'Je sais former le féminin des adjectifs courants (grand/grande, beau/belle).',
        'Je décris une fête avec des adjectifs.',
    ],
    detailedCourse: {
        introAr: 'L\'adjectif qualificatif décrit le nom et s\'accorde avec lui : un grand gâteau, une grande fête, des beaux cadeaux.',
        vocabulary: [
            { termAr: 'Adjectif qualificatif', definitionAr: 'Mot qui décrit une qualité du nom (grand, petit, beau...).' },
        ],
        visualizationHintAr: 'Classe les adjectifs en masculin/féminin : grand → grande, petit → petite.',
        commonMistakes: [
            { mistakeAr: 'Oublier l\'accord au féminin.', correctionAr: 'On ajoute souvent -e au masculin : grand → grande.' },
        ],
        takeawayAr: 'Adjectif + nom accordés : un beau gâteau, une belle fête, des grands cadeaux.',
    },
    rulesAr: [
        'Accord en genre : grand (m.) → grande (f.)',
        'Accord en nombre : grand → grands (m.pl.), grande → grandes (f.pl.)',
        'Adjectifs irréguliers : beau/belle, blanc/blanche, nouveau/nouvelle',
        'Place : l\'adjectif épithète est généralement après le nom (un gâteau délicieux).',
    ],
    keyFormulas: [
        { labelAr: 'Féminin simple', formulaAr: 'grand → grande, petit → petite' },
        { labelAr: 'Pluriel', formulaAr: 'grand → grands / grandes' },
    ],
    examplesAr: [
        { problem: 'Accorde: « une ...... (beau) fête »', solution: '« une belle fête »' },
        { problem: 'Accorde: « des ...... (grand) cadeaux »', solution: '« des grands cadeaux »' },
    ],
    interactiveTool: 'french_lab',
    quiz: [
        { id: 'q1', questionAr: 'Féminin de « grand » ?', options: [{ id: 'a', textAr: 'grande', isCorrect: true, explanationAr: 'grand → grande.' }, { id: 'b', textAr: 'grand', isCorrect: false }] },
        { id: 'q2', questionAr: '« une belle fête » — belle accordé avec ....', options: [{ id: 'a', textAr: 'fête (féminin)', isCorrect: true, explanationAr: 'Accord au féminin.' }, { id: 'b', textAr: 'fête (masculin)', isCorrect: false }] },
    ],
},

{
    id: 'french-4ap-projet3-seq1-animaux-domestiques',
    grade: '4AP',
    subject: 'french',
    trimester: 3,
    categoryAr: 'Projet 3 : À la mer / Dans la nature - Séquence 1',
    titleAr: 'Projet 3 - Séquence 1 : « Quel beau paysage ! » - Les animaux domestiques, verbes du 2ème groupe & adjectif épithète',
    summaryAr: `Dans le Projet 3 dédié à la nature et aux animaux, l'élève apprend à décrire un animal domestique (le chat, le chien, le lapin) et les parties de son corps, identifier l'adjectif qualificatif épithète et conjuguer les verbes du 2ème groupe (-ir) au présent.`,
    objectivesAr: [
        'Je sais décrire un animal domestique et ses parties du corps.',
        'Je sais reconnaître un adjectif qualificatif épithète.',
        'Je sais conjuguer un verbe du 2ème groupe au présent.',
    ],
    detailedCourse: {
        introAr: 'L\'adjectif épithète est collé directement au nom qu\'il décrit, sans verbe entre les deux, ce qui le distingue de l\'adjectif attribut (relié par le verbe être).',
        vocabulary: [
            { termAr: 'Adjectif épithète', definitionAr: 'Adjectif placé directement à côté du nom qu\'il qualifie, sans verbe entre eux.' },
        ],
        visualizationHintAr: 'Compare "un petit chat" (épithète, collé au nom) et "Le chat est petit" (attribut, séparé par le verbe être) pour bien voir la différence.',
        commonMistakes: [
            { mistakeAr: 'Confondre "a" (verbe avoir) et "à" (préposition).', correctionAr: 'Remplace le mot par "avait" : si la phrase garde son sens, c\'est "a" sans accent ; sinon, c\'est "à" avec accent.' },
        ],
        takeawayAr: 'L\'adjectif épithète est collé au nom (un petit chat). Verbes du 2ème groupe au présent : -is, -is, -it, -issons, -issez, -issent.',
    },
    rulesAr: [
        'Vocabulaire - Les animaux domestiques : le chat, le chien, le lapin, le mouton, la vache. Les parties du corps : les poils, la queue, les moustaches, les pattes, les oreilles, le bec.',
        'Grammaire - L\'adjectif qualificatif épithète : L\'adjectif est épithète lorsqu\'il est placé directement à côté du nom qu\'il qualifie. Exemple : "Un petit chat blanc".',
        'Conjugaison - Les verbes du 2ème groupe (-ir) au présent : finir, choisir, grandir. Les terminaisons sont : -is, -is, -it, -issons, -issez, -issent. (Exemple : "Le chiot grandit vite").',
        'Orthographe - Homophones grammaticaux : "a" (verbe avoir) / "à" (préposition avec accent) ; "est" (verbe être) / "et" (mot de liaison).'
    ],
    keyFormulas: [
        { labelAr: 'Terminaisons du 2ème groupe (-ir) au présent', formulaAr: '-is, -is, -it, -issons, -issez, -issent' },
        { labelAr: 'Astuce pour a / à', formulaAr: 'Si on peut remplacer par "avait", c\'est "a" sans accent' }
    ],
    examplesAr: [
        {
            problem: 'Production écrite (Portrait d\'un animal domestique) :\nRédige un court texte pour décrire ton animal domestique préféré (exemple : le chat).',
            solution: 'Mon animal préféré est le chat. C\'est un animal domestique très mignon. Il a des poils doux, de petites oreilles et de longues moustaches. Il aime boire du lait et jouer dans le jardin.'
        }
    ],
    interactiveTool: 'french_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'Quelle est la conjugaison correcte du verbe "finir" (2ème groupe) avec le sujet "Nous" au présent ?',
            options: [
                { id: 'a', textAr: 'Nous finissons notre travail.', isCorrect: true, explanationAr: 'Bravo ! Les verbes du 2ème groupe font "-issons" avec la personne "Nous" au présent.' },
                { id: 'b', textAr: 'Nous finisons notre travail.', isCorrect: false },
                { id: 'c', textAr: 'Nous finissez notre travail.', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Complète la phrase par le bon homophone : "Yacine ...... allé à la ferme de son grand-père."',
            options: [
                { id: 'a', textAr: 'est', isCorrect: true, explanationAr: 'Très bien ! "est" est le verbe être (on peut dire : Yacine était allé).' },
                { id: 'b', textAr: 'et', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'french-4ap-projet3-seq2-environnement-imperatif',
    grade: '4AP',
    subject: 'french',
    trimester: 3,
    categoryAr: 'Projet 3 : À la mer / Dans la nature - Séquence 2',
    titleAr: 'Projet 3 - Séquence 2 : « Protégeons notre environnement ! » - La propreté, la phrase impérative & les consignes',
    summaryAr: `Sensibilisation à la protection de l'environnement et de l'école. L'élève apprend à utiliser la phrase impérative pour donner des consignes et conseils de propreté, et étudie les sons de la lettre s ([s] et [z]).`,
    objectivesAr: [
        'Je sais utiliser la phrase impérative pour donner une consigne.',
        'Je sais conjuguer un verbe à l\'impératif présent.',
        'Je distingue les deux sons de la lettre "s".',
    ],
    detailedCourse: {
        introAr: 'La phrase impérative sert à donner un ordre, un conseil ou une consigne, sans dire le sujet. On l\'utilise beaucoup pour protéger notre environnement : "Ne jette pas !", "Nettoie !".',
        vocabulary: [
            { termAr: 'L\'impératif', definitionAr: 'Mode verbal utilisé sans sujet exprimé pour donner un ordre, un conseil ou une consigne.' },
        ],
        visualizationHintAr: 'Imagine une affiche de sensibilisation dans la cour de l\'école avec des phrases courtes et fortes comme "Respecte la nature !" — c\'est exactement le rôle de l\'impératif.',
        commonMistakes: [
            { mistakeAr: 'Ajouter un "s" au verbe du 1er groupe à la 2ème personne du singulier de l\'impératif.', correctionAr: 'Les verbes en -er perdent leur "s" final à l\'impératif avec "tu" : on écrit "Nettoie !" et non "Nettoies !".' },
        ],
        takeawayAr: 'La phrase impérative se conjugue sans sujet à 3 personnes (tu, nous, vous). La lettre "s" seule entre deux voyelles se prononce [z] ; "ss" se prononce [s].',
    },
    rulesAr: [
        'Vocabulaire - La propreté et la nature : la poubelle, nettoyer, jeter les ordures, la cour de l\'école, les fleurs, les arbres, la mer, la plage, la propreté.',
        'Grammaire - La phrase impérative : Elle sert à donner un ordre, une consigne ou un conseil. Elle se termine souvent par un point d\'exclamation (!). Exemple : "Ne jette pas les ordures par terre !"',
        'Conjugaison - L\'impératif présent : S\'utilise sans sujet exprimé à 3 personnes (2ème pers. singulier, 1ère et 2ème pers. pluriel). Exemple : Nettoie ! / Nettoyons ! / Nettoyez !',
        'Orthographe - La lettre "s" : Un seul "s" entre deux voyelles se prononce [z] (une maison, une valise). Deux "s" ("ss") se prononcent [s] (la classe, une tasse).'
    ],
    keyFormulas: [
        { labelAr: 'Structure de la phrase impérative', formulaAr: 'Verbe à l\'impératif (sans sujet) + Complément + !' },
        { labelAr: 'Règle de prononciation du s', formulaAr: 'voyelle + s + voyelle = [z]  |  voyelle + ss + voyelle = [s]' }
    ],
    examplesAr: [
        {
            problem: 'Production écrite (Affiche de sensibilisation) :\nRédige 3 consignes impératives simples pour garder la cour de ton école propre.',
            solution: 'Pour garder notre école propre :\n1. Jette les ordures dans la poubelle !\n2. Ne casse pas les branches des arbres !\n3. Arrose les jolies fleurs du jardin !'
        }
    ],
    interactiveTool: 'french_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'Quelle phrase est une phrase impérative donnant une consigne de propreté ?',
            options: [
                { id: 'a', textAr: 'Nettoyez la cour de l\'école !', isCorrect: true, explanationAr: 'Bravo ! C\'est une phrase impérative qui donne un ordre/consigne de propreté sans sujet exprimé.' },
                { id: 'b', textAr: 'Les élèves nettoient la cour.', isCorrect: false },
                { id: 'c', textAr: 'Pourquoi nettoyez-vous la cour ?', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Pourquoi le mot "maison" se prononce-t-il avec le son [z] ?',
            options: [
                { id: 'a', textAr: 'Parce que la lettre "s" est placée seule entre deux voyelles (a et o)', isCorrect: true, explanationAr: 'Exactement ! La lettre "s" unique entre deux voyelles se prononce [z].' },
                { id: 'b', textAr: 'Parce qu\'il y a deux "ss"', isCorrect: false }
            ]
        }
    ]
},

{
    id: 'french-4ap-projet3-homophones',
    grade: '4AP',
    subject: 'french',
    trimester: 3,
    categoryAr: 'Projet 3 : À la mer / Dans la nature - Séquence 2',
    titleAr: 'Projet 3 - Séquence 2 (bis) : Les homophones grammaticaux fréquents (a/à, et/est, son/sont, on/ont)',
    summaryAr: `Révision systématique des homophones grammaticaux les plus fréquents en français : a/à, et/est, son/sont, on/ont, avec des astuces simples pour ne plus les confondre à l'écrit.`,
    objectivesAr: [
        'Je sais distinguer "a" (verbe avoir) et "à" (préposition).',
        'Je sais distinguer "et" (mot de liaison) et "est" (verbe être).',
        'Je sais distinguer "son/sont" et "on/ont".',
    ],
    detailedCourse: {
        introAr: 'Certains mots se prononcent exactement pareil mais s\'écrivent différemment et n\'ont pas le même sens : on les appelle des homophones. Pour bien écrire, il existe des astuces simples pour chacun.',
        vocabulary: [
            { termAr: 'Homophone', definitionAr: 'Mot qui se prononce comme un autre mais qui s\'écrit différemment et a un sens différent.' },
        ],
        visualizationHintAr: 'Pour chaque paire d\'homophones, entraîne-toi à remplacer le mot par "avait" (pour a/à) ou "étaient" (pour son/sont) pour vérifier laquelle des deux orthographes garde un sens.',
        commonMistakes: [
            { mistakeAr: 'Confondre les homophones sans vérifier avec l\'astuce de remplacement.', correctionAr: 'Pour chaque homophone, il existe une astuce de remplacement fiable ; il faut prendre l\'habitude de toujours vérifier avant d\'écrire.' },
        ],
        takeawayAr: '"a" (avoir, remplace par "avait") / "à" (préposition). "et" (liaison) / "est" (être, remplace par "était"). "son" (possessif) / "sont" (être, remplace par "étaient"). "on" (pronom) / "ont" (avoir, remplace par "avaient").',
    },
    rulesAr: [
        'a / à : "a" est le verbe avoir (il a un chat), on peut le remplacer par "avait". "à" est une préposition (il va à l\'école), on ne peut pas la remplacer par "avait".',
        'et / est : "et" relie deux mots ou groupes (le chat et le chien), on peut le remplacer par "et puis". "est" est le verbe être (il est content), on peut le remplacer par "était".',
        'son / sont : "son" est un adjectif possessif devant un nom (son livre), on peut le remplacer par "mon". "sont" est le verbe être au pluriel (ils sont contents), on peut le remplacer par "étaient".',
        'on / ont : "on" est un pronom sujet (on joue), on peut le remplacer par "il". "ont" est le verbe avoir au pluriel (ils ont un ballon), on peut le remplacer par "avaient".'
    ],
    keyFormulas: [
        { labelAr: 'Astuces de remplacement', formulaAr: 'a→avait | à≠avait | est→était | et≠était | sont→étaient | son≠étaient | ont→avaient | on≠avaient' }
    ],
    examplesAr: [
        {
            problem: 'Complète : « Le chat ...... des moustaches longues. » (a/à)',
            solution: '« Le chat a des moustaches longues. » (on peut dire "avait", donc c\'est "a" sans accent).'
        },
        {
            problem: 'Complète : « Les enfants ...... contents d\'aller à la plage. » (son/sont)',
            solution: '« Les enfants sont contents d\'aller à la plage. » (on peut dire "étaient", donc c\'est "sont", verbe être).'
        }
    ],
    interactiveTool: 'french_lab',
    quiz: [
        {
            id: 'q1',
            questionAr: 'Complète : « Ils ...... un beau jardin. » (on/ont)',
            options: [
                { id: 'a', textAr: 'ont', isCorrect: true, explanationAr: 'Correct ! On peut dire "Ils avaient un beau jardin", donc c\'est le verbe avoir "ont".' },
                { id: 'b', textAr: 'on', isCorrect: false }
            ]
        },
        {
            id: 'q2',
            questionAr: 'Quelle astuce permet de vérifier si on doit écrire "est" ou "et" ?',
            options: [
                { id: 'a', textAr: 'Remplacer le mot par "était"', isCorrect: true, explanationAr: 'Exactement ! Si "était" garde un sens, c\'est "est" (verbe être).' },
                { id: 'b', textAr: 'Remplacer le mot par "avait"', isCorrect: false }
            ]
        }
    ]
},
];

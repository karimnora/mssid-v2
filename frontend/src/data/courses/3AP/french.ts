import { CourseLesson } from '../../../types';

// 8 leçon(s) — french / 3AP
export const FRENCH_3AP: CourseLesson[] = [
// ==========================================
// 🇫🇷 اللغة الفرنسية (FRANÇAIS) - 3AP
// Trimestre 1 — Projet 1 : Vive l'école !
// ==========================================
{
    id: 'french-3ap-p1-seq1-greetings-letters',
    grade: '3AP',
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
    interactiveTool: 'french_lab',
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
          { id: 'b', textAr: 'Bonjour !', isCorrect: false }
        ]
      }
    ]
},

{
    id: 'french-3ap-p1-seq2-class-letters',
    grade: '3AP',
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
    interactiveTool: 'french_lab',
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
          { id: 'a', textAr: 'Trousse (ou) / Livre', isCorrect: false },
          { id: 'b', textAr: 'Jus (u) / Plume', isCorrect: true, explanationAr: 'Exactement ! Jus et Plume contiennent la voyelle U.' }
        ]
      }
    ]
},

{
    id: 'french-3ap-p1-seq3-friend-letters',
    grade: '3AP',
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
    interactiveTool: 'french_lab',
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
          { id: 'b', textAr: 'C\'est Lina, c\'est mon ami.', isCorrect: false }
        ]
      }
    ]
},

// ==========================================
// Trimestre 2 — Projet 2 : En famille !
// ==========================================
{
    id: 'french-3ap-p2-seq1-family-letters',
    grade: '3AP',
    subject: 'french',
    trimester: 2,
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
    interactiveTool: 'french_lab',
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
          { id: 'b', textAr: 'Le frère', isCorrect: false }
        ]
      }
    ]
},

{
    id: 'french-3ap-p2-seq1b-jobs-seasons',
    grade: '3AP',
    subject: 'french',
    trimester: 2,
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
    interactiveTool: 'french_lab',
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
          { id: 'b', textAr: 'L\'été', isCorrect: false }
        ]
      }
    ]
},

{
    id: 'french-3ap-p2-seq2-numbers-age',
    grade: '3AP',
    subject: 'french',
    trimester: 2,
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
    interactiveTool: 'french_lab',
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
          { id: 'b', textAr: 'Le son /S/ (comme S)', isCorrect: false }
        ]
      }
    ]
},

{
    id: 'french-3ap-p2-seq3-home-sounds',
    grade: '3AP',
    subject: 'french',
    trimester: 2,
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
    interactiveTool: 'french_lab',
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
          { id: 'b', textAr: 'Le son OU', isCorrect: false }
        ]
      }
    ]
},

// ==========================================
// Trimestre 3 — Projet 3 : Tu as un animal ?
// ==========================================
{
    id: 'french-3ap-p3-seq1-animals-sounds',
    grade: '3AP',
    subject: 'french',
    trimester: 3,
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
    interactiveTool: 'french_lab',
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
          { id: 'b', textAr: 'J\'ai', isCorrect: false }
        ]
      }
    ]
},

{
    id: 'french-3ap-p3-seq2-garden-reading',
    grade: '3AP',
    subject: 'french',
    trimester: 3,
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
    interactiveTool: 'french_lab',
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
          { id: 'b', textAr: 'J\'aime...', isCorrect: false }
        ]
      }
    ]
},
];

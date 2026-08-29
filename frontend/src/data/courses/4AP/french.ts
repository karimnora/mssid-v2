import { CourseLesson } from '../../../types';

// 9 leçon(s) — french / 4AP
export const FRENCH_4AP: CourseLesson[] = [
// ==========================================
// 16. FRANÇAIS - 4AP (اللغة الفرنسية - السنة الرابعة ابتدائي الجيل الثاني)
// ==========================================
{
    id: 'french-4ap-projet1-seq1-presentation-famille',
    grade: '4AP',
    subject: 'french',
    trimester: 1,
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
    trimester: 1,
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
    trimester: 1,
    categoryAr: 'Projet 1 : C\'est notre quartier ! - Séquence 2',
    titleAr: 'Projet 1 - Séquence 2 (bis) : Les prépositions de lieu (dans, sur, sous, devant, derrière)',
    summaryAr: 'L\'élève localise des objets et des lieux du quartier avec les prépositions de lieu essentielles du programme 4AP — sans pronoms COD (5AP).',
    objectivesAr: [
        'Je sais utiliser dans, sur, sous, devant, derrière pour situer un objet.',
        'Je sais poser la question « Où est... ? » et y répondre.',
        'Je décris la position d\'un lieu dans le quartier.',
    ],
    detailedCourse: {
        introAr: 'Pour dire où se trouve quelque chose, on utilise des prépositions de lieu simples : dans (داخل), sur (فوق), sous (تحت), devant (أمام), derrière (وراء).',
        vocabulary: [
            { termAr: 'Préposition de lieu', definitionAr: 'Petit mot qui indique la position (dans, sur, sous...).' },
        ],
        visualizationHintAr: 'Dessine ta chambre et place trois objets avec dans, sur et sous.',
        commonMistakes: [
            { mistakeAr: 'Confondre sur et sous.', correctionAr: 'sur = au-dessus, sous = en dessous.' },
        ],
        takeawayAr: 'Où est le livre ? — Il est sur la table. / Il est dans le cartable. / Il est sous le lit.',
    },
    rulesAr: [
        'dans = داخل (dans la classe)',
        'sur = فوق (sur le bureau)',
        'sous = تحت (sous la chaise)',
        'devant = أمام (devant l\'école)',
        'derrière = وراء (derrière la maison)',
        'Question: « Où est + nom ? » — Réponse: « Il/Elle est + préposition + nom. »',
    ],
    keyFormulas: [
        { labelAr: 'Question de lieu', formulaAr: 'Où est le cartable ?' },
        { labelAr: 'Réponse', formulaAr: 'Il est dans le cartable.' },
    ],
    examplesAr: [
        { problem: 'Complète: « Le chat est ...... le lit. » (sous)', solution: '« Le chat est sous le lit. »' },
        { problem: 'Traduis: « الكتاب فوق المكتب »', solution: '« Le livre est sur le bureau. »' },
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
    trimester: 2,
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
    trimester: 2,
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
    trimester: 2,
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

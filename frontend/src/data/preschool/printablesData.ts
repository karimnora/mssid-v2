import { PreschoolLanguage } from './types';

// "أوراق للطباعة" — Printable take-home worksheets (Mode Éveil, 3-5 ans).
// Original content authored in the spirit of standard "petite section" pedagogy (graphisme,
// pré-lecture/pré-écriture, dénombrement, discrimination visuelle, motricité fine, coloriage) —
// not copied from any specific external worksheet source. Renders via PreschoolPrintablesModal
// using the same `.printable-sheet` A4 print CSS as RevisionSheetViewer / PrintableWorksheetsGeneratorModal.

export type PrintableCategory = 'graphisme' | 'lettres' | 'chiffres' | 'logique' | 'motricite' | 'coloriage';

export type PrintableWorksheetKind =
  | 'line_trace'
  | 'letter_trace'
  | 'count_and_color'
  | 'match_pairs'
  | 'odd_one_out'
  | 'cut_along_lines'
  | 'coloring_page';

export interface TracePathRow {
  d: string;
  startIcon: string;
  endIcon: string;
}

export interface TraceGlyphRow {
  glyph: string;
  repeatCount: number;
}

export interface CountRow {
  icon: string;
  count: number;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface OddOneOutSet {
  items: string[];
  oddIndex: number;
}

export interface PrintableWorksheet {
  id: string;
  category: PrintableCategory;
  kind: PrintableWorksheetKind;
  headerIcon: string;
  titleI18n: Record<PreschoolLanguage, string>;
  instructionI18n: Record<PreschoolLanguage, string>;

  tracePaths?: TracePathRow[];
  traceRows?: TraceGlyphRow[];
  countRows?: CountRow[];
  matchPairs?: MatchPair[];
  oddOneOutSets?: OddOneOutSet[];
  cutShapes?: string[];
  coloringShapeId?: 'house' | 'star_crescent' | 'sun' | 'flower' | 'fish' | 'boat' | 'camel' | 'mosque' | 'olive';
}

export const PRINTABLE_CATEGORY_LABELS: Record<PrintableCategory, Record<PreschoolLanguage, string>> = {
  graphisme: { ar: 'تَمَارِين الخَطّ وَالحَرَكَة', fr: 'Graphisme et pré-écriture', en: 'Pre-writing lines' },
  lettres: { ar: 'تَتَبُّع الحُرُوف', fr: 'Traçage des lettres', en: 'Letter tracing' },
  chiffres: { ar: 'تَتَبُّع الأَرْقَام', fr: 'Traçage des chiffres', en: 'Number tracing' },
  logique: { ar: 'العَدّ وَالمَنْطِق', fr: 'Dénombrement et logique', en: 'Counting and logic' },
  motricite: { ar: 'المَهَارَات اليَدَوِيَّة', fr: 'Motricité fine', en: 'Little hands' },
  coloriage: { ar: 'تَلْوِين حُرّ', fr: 'Coloriage', en: 'Coloring' },
};

export const PRINTABLE_WORKSHEETS: PrintableWorksheet[] = [
  // ---------- GRAPHISME (pre-writing motor lines) ----------
  {
    id: 'graph-straight-line',
    category: 'graphisme',
    kind: 'line_trace',
    headerIcon: '📏',
    titleI18n: { ar: 'الخَطُّ المُسْتَقِيمُ', fr: 'La Ligne Droite', en: 'The Straight Line' },
    instructionI18n: {
      ar: 'تتبّع الخط المستقيم بقلمك من الحيوان إلى بيته.',
      fr: 'Trace la ligne droite avec ton crayon, de l\'animal jusqu\'à sa maison.',
      en: 'Trace the straight line with your pencil, from the animal to its home.',
    },
    tracePaths: [
      { d: 'M 20 50 L 780 50', startIcon: '🐰', endIcon: '🥕' },
      { d: 'M 20 50 L 780 50', startIcon: '🐱', endIcon: '🧶' },
      { d: 'M 20 50 L 780 50', startIcon: '🐶', endIcon: '🦴' },
      { d: 'M 20 50 L 780 50', startIcon: '🐝', endIcon: '🌸' },
    ],
  },
  {
    id: 'graph-zigzag-line',
    category: 'graphisme',
    kind: 'line_trace',
    headerIcon: '⚡',
    titleI18n: { ar: 'الخَطُّ المُتَعَرِّجُ', fr: 'La Ligne en Zigzag', en: 'The Zigzag Line' },
    instructionI18n: {
      ar: 'تتبّع الخط المتعرج بهدوء من البداية إلى النهاية.',
      fr: 'Trace la ligne en zigzag tout doucement, du début à la fin.',
      en: 'Trace the zigzag line slowly, from start to end.',
    },
    tracePaths: [
      { d: 'M 20 70 L 140 20 L 260 70 L 380 20 L 500 70 L 620 20 L 780 70', startIcon: '🐐', endIcon: '⛰️' },
      { d: 'M 20 70 L 140 20 L 260 70 L 380 20 L 500 70 L 620 20 L 780 70', startIcon: '🦎', endIcon: '🌵' },
      { d: 'M 20 70 L 140 20 L 260 70 L 380 20 L 500 70 L 620 20 L 780 70', startIcon: '🐿️', endIcon: '🌰' },
    ],
  },
  {
    id: 'graph-wavy-line',
    category: 'graphisme',
    kind: 'line_trace',
    headerIcon: '🌊',
    titleI18n: { ar: 'الخَطُّ المُتَمَوِّجُ', fr: 'La Ligne Ondulée', en: 'The Wavy Line' },
    instructionI18n: {
      ar: 'تتبّع الموجة الهادئة بإصبعك أولاً ثم بقلمك.',
      fr: 'Trace la vague tranquille d\'abord avec le doigt puis avec le crayon.',
      en: 'Trace the gentle wave first with your finger, then with your pencil.',
    },
    tracePaths: [
      { d: 'M 20 50 Q 150 10, 280 50 T 540 50 T 780 50', startIcon: '🐳', endIcon: '🏝️' },
      { d: 'M 20 50 Q 150 10, 280 50 T 540 50 T 780 50', startIcon: '🐠', endIcon: '🐚' },
      { d: 'M 20 50 Q 150 10, 280 50 T 540 50 T 780 50', startIcon: '⛵', endIcon: '⚓' },
    ],
  },
  {
    id: 'graph-loops',
    category: 'graphisme',
    kind: 'line_trace',
    headerIcon: '🌀',
    titleI18n: { ar: 'الحَلَقَاتُ الدَّائِرِيَّةُ', fr: 'Les Boucles', en: 'The Loops' },
    instructionI18n: {
      ar: 'حرّك يدك في حلقات صغيرة متتالية — تمرين مهم قبل تعلم الكتابة.',
      fr: 'Fais tourner ta main en petites boucles — un exercice important avant l\'écriture.',
      en: 'Move your hand in small connected loops — an important exercise before writing.',
    },
    tracePaths: [
      { d: 'M 20 50 C 60 10, 100 90, 140 50 C 180 10, 220 90, 260 50 C 300 10, 340 90, 380 50 C 420 10, 460 90, 500 50 C 540 10, 580 90, 620 50 C 660 10, 700 90, 740 50', startIcon: '🦋', endIcon: '🌼' },
      { d: 'M 20 50 C 60 10, 100 90, 140 50 C 180 10, 220 90, 260 50 C 300 10, 340 90, 380 50 C 420 10, 460 90, 500 50 C 540 10, 580 90, 620 50 C 660 10, 700 90, 740 50', startIcon: '🐦', endIcon: '🪺' },
    ],
  },

  // ---------- LETTRES ----------
  {
    id: 'letter-trace-alif',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الأَلِفِ (أ)', fr: 'Traçage de la lettre أ (Alif)', en: 'Tracing the letter أ (Alif)' },
    instructionI18n: {
      ar: 'مرّر إصبعك ثم قلمك على الحرف المرسوم بخط خفيف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace over the outlined letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'أ', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-baa',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ البَاءِ (ب)', fr: 'Traçage de la lettre ب (Ba)', en: 'Tracing the letter ب (Ba)' },
    instructionI18n: {
      ar: 'مرّر إصبعك ثم قلمك على الحرف المرسوم بخط خفيف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace over the outlined letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ب', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-jeem',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الجِيمِ (ج)', fr: 'Traçage de la lettre ج (Jeem)', en: 'Tracing the letter ج (Jeem)' },
    instructionI18n: {
      ar: 'مرّر إصبعك ثم قلمك على الحرف المرسوم بخط خفيف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace over the outlined letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ج', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-meem',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ المِيمِ (م)', fr: 'Traçage de la lettre م (Mim)', en: 'Tracing the letter م (Mim)' },
    instructionI18n: {
      ar: 'مرّر إصبعك ثم قلمك على الحرف المرسوم بخط خفيف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace over the outlined letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'م', repeatCount: 6 }],
  },

  // ---------- CHIFFRES ----------
  {
    id: 'numbers-trace-0-to-4',
    category: 'chiffres',
    kind: 'letter_trace',
    headerIcon: '🔢',
    titleI18n: { ar: 'تَتَبُّعُ الأَرْقَامِ (0 - 4)', fr: 'Traçage des Chiffres (0 à 4)', en: 'Tracing Numbers (0 to 4)' },
    instructionI18n: {
      ar: 'تتبّع كل رقم بقلمك، صفاً بعد صف، من 0 إلى 4.',
      fr: 'Trace chaque chiffre au crayon, ligne après ligne, de 0 à 4.',
      en: 'Trace each number with your pencil, row after row, from 0 to 4.',
    },
    traceRows: [
      { glyph: '0', repeatCount: 5 },
      { glyph: '1', repeatCount: 5 },
      { glyph: '2', repeatCount: 5 },
      { glyph: '3', repeatCount: 5 },
      { glyph: '4', repeatCount: 5 },
    ],
  },
  {
    id: 'numbers-trace-5-to-9',
    category: 'chiffres',
    kind: 'letter_trace',
    headerIcon: '🔢',
    titleI18n: { ar: 'تَتَبُّعُ الأَرْقَامِ (5 - 9)', fr: 'Traçage des Chiffres (5 à 9)', en: 'Tracing Numbers (5 to 9)' },
    instructionI18n: {
      ar: 'تتبّع كل رقم بقلمك، صفاً بعد صف، من 5 إلى 9.',
      fr: 'Trace chaque chiffre au crayon, ligne après ligne, de 5 à 9.',
      en: 'Trace each number with your pencil, row after row, from 5 to 9.',
    },
    traceRows: [
      { glyph: '5', repeatCount: 5 },
      { glyph: '6', repeatCount: 5 },
      { glyph: '7', repeatCount: 5 },
      { glyph: '8', repeatCount: 5 },
      { glyph: '9', repeatCount: 5 },
    ],
  },

  // ---------- LOGIQUE (dénombrement, discrimination) ----------
  {
    id: 'logic-count-and-color',
    category: 'logique',
    kind: 'count_and_color',
    headerIcon: '🍎',
    titleI18n: { ar: 'عُدَّ وَلَوِّنْ', fr: 'Compte et Colorie', en: 'Count and Color' },
    instructionI18n: {
      ar: 'عُدَّ العناصر في كل صف واكتب العدد في المربع، ثم لوّنها.',
      fr: 'Compte les éléments de chaque ligne, écris le nombre dans la case, puis colorie-les.',
      en: 'Count the items in each row, write the number in the box, then color them in.',
    },
    countRows: [
      { icon: '🍎', count: 3 },
      { icon: '⭐', count: 5 },
      { icon: '🦋', count: 2 },
      { icon: '🐟', count: 4 },
    ],
  },
  {
    id: 'logic-odd-one-out',
    category: 'logique',
    kind: 'odd_one_out',
    headerIcon: '🔍',
    titleI18n: { ar: 'أَوْجِدِ المُخْتَلِفَ', fr: 'Trouve l\'Intrus', en: 'Find the Odd One Out' },
    instructionI18n: {
      ar: 'ضع دائرة حول الشكل المختلف عن بقية أصدقائه في كل صف.',
      fr: 'Entoure l\'élément qui est différent des autres dans chaque ligne.',
      en: 'Circle the one item that is different from the others in each row.',
    },
    oddOneOutSets: [
      { items: ['🍎', '🍎', '🍎', '🍊', '🍎'], oddIndex: 3 },
      { items: ['⚪', '⚪', '🟦', '⚪', '⚪'], oddIndex: 2 },
      { items: ['🐱', '🐱', '🐱', '🐱', '🐶'], oddIndex: 4 },
      { items: ['🌟', '🌟', '🌟', '❤️', '🌟'], oddIndex: 3 },
    ],
  },
  {
    id: 'logic-match-pairs',
    category: 'logique',
    kind: 'match_pairs',
    headerIcon: '🔗',
    titleI18n: { ar: 'صِلْ كُلَّ عُنْصُرٍ بِنَظِيرِهِ', fr: 'Relie Chaque Élément à sa Paire', en: 'Match Each Item to Its Pair' },
    instructionI18n: {
      ar: 'اسحب خطاً بقلمك من كل عنصر في العمود الأيمن إلى نظيره في العمود الأيسر.',
      fr: 'Trace un trait au crayon entre chaque élément de la colonne de droite et sa paire à gauche.',
      en: 'Draw a line with your pencil between each item on the right and its match on the left.',
    },
    matchPairs: [
      { left: '🐄', right: '🥛' },
      { left: '🐝', right: '🍯' },
      { left: '🐔', right: '🥚' },
      { left: '🐑', right: '🧶' },
    ],
  },

  // ---------- MOTRICITÉ FINE (découpage) ----------
  {
    id: 'motor-cut-shapes',
    category: 'motricite',
    kind: 'cut_along_lines',
    headerIcon: '✂️',
    titleI18n: { ar: 'قُصَّ الأَشْكَالَ', fr: 'Découpe les Formes', en: 'Cut Out the Shapes' },
    instructionI18n: {
      ar: 'استعمل مقصاً آمناً (بمساعدة الكبار) وقص كل شكل على طول الخط المنقّط.',
      fr: 'Avec des ciseaux à bouts ronds (et un adulte), découpe chaque forme le long du trait pointillé.',
      en: 'With safety scissors (and an adult), cut out each shape along the dotted line.',
    },
    cutShapes: ['⚪', '🟦', '🔺', '⭐', '❤️', '🔷'],
  },

  // ---------- COLORIAGE ----------
  {
    id: 'coloring-house',
    category: 'coloriage',
    kind: 'coloring_page',
    headerIcon: '🏠',
    titleI18n: { ar: 'لَوِّنْ البَيْتَ الصَّغِيرَ', fr: 'Colorie la Petite Maison', en: 'Color the Little House' },
    instructionI18n: {
      ar: 'لوّن الرسمة بالألوان التي تحبها.',
      fr: 'Colorie le dessin avec tes couleurs préférées.',
      en: 'Color the drawing with your favorite colors.',
    },
    coloringShapeId: 'house',
  },
  {
    id: 'coloring-star-crescent',
    category: 'coloriage',
    kind: 'coloring_page',
    headerIcon: '⭐',
    titleI18n: { ar: 'لَوِّنِ الهِلَالَ وَالنَّجْمَةَ', fr: 'Colorie le Croissant et l\'Étoile', en: 'Color the Crescent and Star' },
    instructionI18n: {
      ar: 'رمز جميل من علم بلادنا الجزائر — لوّنه بالأخضر والأحمر.',
      fr: 'Un joli symbole de notre drapeau algérien — colorie-le en vert et rouge.',
      en: 'A pretty symbol from our Algerian flag — color it green and red.',
    },
    coloringShapeId: 'star_crescent',
  },
  {
    id: 'coloring-sun',
    category: 'coloriage',
    kind: 'coloring_page',
    headerIcon: '☀️',
    titleI18n: { ar: 'لَوِّنِ الشَّمْسَ المُشْرِقَةَ', fr: 'Colorie le Soleil Brillant', en: 'Color the Bright Sun' },
    instructionI18n: {
      ar: 'لوّن الرسمة بالألوان التي تحبها.',
      fr: 'Colorie le dessin avec tes couleurs préférées.',
      en: 'Color the drawing with your favorite colors.',
    },
    coloringShapeId: 'sun',
  },
  {
    id: 'graph-vertical-rain',
    category: 'graphisme',
    kind: 'line_trace',
    headerIcon: '🌧️',
    titleI18n: { ar: 'الخُطُوطُ العَمُودِيَّةُ — المَطَر', fr: 'Les Lignes Verticales — La Pluie', en: 'Vertical Lines — Rain' },
    instructionI18n: {
      ar: 'أَنْزِلِ القَطَرَاتِ مِنَ الغَيْمَةِ إِلَى الأَرْضِ.',
      fr: 'Fais descendre les gouttes du nuage jusqu’au sol.',
      en: 'Bring the raindrops down from the cloud to the ground.',
    },
    tracePaths: [
      { d: 'M 70 12 L 70 88 M 190 12 L 190 88 M 310 12 L 310 88 M 430 12 L 430 88 M 550 12 L 550 88 M 670 12 L 670 88', startIcon: '☁️', endIcon: '🌱' },
      { d: 'M 70 12 L 70 88 M 190 12 L 190 88 M 310 12 L 310 88 M 430 12 L 430 88 M 550 12 L 550 88 M 670 12 L 670 88', startIcon: '☁️', endIcon: '🌷' },
      { d: 'M 70 12 L 70 88 M 190 12 L 190 88 M 310 12 L 310 88 M 430 12 L 430 88 M 550 12 L 550 88 M 670 12 L 670 88', startIcon: '☁️', endIcon: '🏡' },
      { d: 'M 70 12 L 70 88 M 190 12 L 190 88 M 310 12 L 310 88 M 430 12 L 430 88 M 550 12 L 550 88 M 670 12 L 670 88', startIcon: '☁️', endIcon: '🦆' },
    ],
  },
  {
    id: 'graph-spiral-snail',
    category: 'graphisme',
    kind: 'line_trace',
    headerIcon: '🐌',
    titleI18n: { ar: 'الحَلَزُونُ — الخَطُّ اللَّولَبِي', fr: 'L’Escargot — La Spirale', en: 'The Snail — Spiral' },
    instructionI18n: {
      ar: 'تَتَبَّعِ اللَّولَبَ بِبُطْءٍ مِنَ الخَارِجِ إِلَى الدَّاخِل.',
      fr: 'Trace la spirale tout doucement, du dehors vers le dedans.',
      en: 'Trace the spiral slowly, from the outside in.',
    },
    tracePaths: [
      { d: 'M 30 50 C 120 8, 280 8, 370 50 C 440 88, 280 96, 210 62 C 150 32, 310 24, 390 50 C 450 72, 320 80, 260 58 C 220 44, 320 42, 360 54', startIcon: '🐌', endIcon: '🥬' },
      { d: 'M 30 50 C 120 8, 280 8, 370 50 C 440 88, 280 96, 210 62 C 150 32, 310 24, 390 50 C 450 72, 320 80, 260 58 C 220 44, 320 42, 360 54', startIcon: '🐛', endIcon: '🍃' },
    ],
  },
  {
    id: 'graph-farm-path',
    category: 'graphisme',
    kind: 'line_trace',
    headerIcon: '🐄',
    titleI18n: { ar: 'طَرِيقُ المَزْرَعَة', fr: 'Le Chemin de la Ferme', en: 'The Farm Path' },
    instructionI18n: {
      ar: 'أَوْصِلْ كُلَّ حَيَوَانٍ إِلَى بَيْتِهِ عَلَى الخَطِّ المُنَقَّط.',
      fr: 'Amène chaque animal chez lui en suivant le pointillé.',
      en: 'Take each animal home along the dotted line.',
    },
    tracePaths: [
      { d: 'M 20 50 Q 150 10, 280 50 T 540 50 T 780 50', startIcon: '🐑', endIcon: '🏠' },
      { d: 'M 20 70 L 140 20 L 260 70 L 380 20 L 500 70 L 620 20 L 780 70', startIcon: '🐐', endIcon: '🫒' },
      { d: 'M 20 50 L 780 50', startIcon: '🐔', endIcon: '🪺' },
      { d: 'M 20 50 Q 150 90, 280 50 T 540 50 T 780 50', startIcon: '🦆', endIcon: '💧' },
    ],
  },
  {
    id: 'graph-shapes',
    category: 'graphisme',
    kind: 'letter_trace',
    headerIcon: '⬜',
    titleI18n: { ar: 'الأَشْكَالُ الأُولَى', fr: 'Les Premières Formes', en: 'First Shapes' },
    instructionI18n: {
      ar: 'تَتَبَّعِ الدَّائِرَةَ ثُمَّ المُرَبَّعَ ثُمَّ المُثَلَّث.',
      fr: 'Trace le cercle, puis le carré, puis le triangle.',
      en: 'Trace the circle, then the square, then the triangle.',
    },
    traceRows: [
      { glyph: '○', repeatCount: 5 },
      { glyph: '□', repeatCount: 5 },
      { glyph: '△', repeatCount: 5 },
    ],
  },
  {
    id: 'letter-trace-taa',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ التَّاءِ (ت)', fr: 'Traçage de la lettre ت (Taa)', en: 'Tracing the letter ت (Taa)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ت', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-dal',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الدَّالِ (د)', fr: 'Traçage de la lettre د (Dal)', en: 'Tracing the letter د (Dal)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'د', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-seen',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ السِّينِ (س)', fr: 'Traçage de la lettre س (Seen)', en: 'Tracing the letter س (Seen)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'س', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-waw',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الوَاوِ (و)', fr: 'Traçage de la lettre و (Waw)', en: 'Tracing the letter و (Waw)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'و', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-yaa',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ اليَاءِ (ي)', fr: 'Traçage de la lettre ي (Yaa)', en: 'Tracing the letter ي (Yaa)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ي', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-noon',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ النُّونِ (ن)', fr: 'Traçage de la lettre ن (Noon)', en: 'Tracing the letter ن (Noon)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ن', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-latin-vowels',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: 'Aa',
    titleI18n: { ar: 'الحَرَكَاتُ اللَّاتِينِيَّة (A I O U)', fr: 'Voyelles latines A I O U', en: 'Latin vowels A I O U' },
    instructionI18n: {
      ar: 'تَتَبَّعِ الحُرُوفَ اللَّاتِينِيَّة الكَبِيرَة: A ثُمَّ I ثُمَّ O ثُمَّ U.',
      fr: 'Trace les grandes lettres : A, puis I, puis O, puis U.',
      en: 'Trace the capital letters: A, then I, then O, then U.',
    },
    traceRows: [
      { glyph: 'A', repeatCount: 5 },
      { glyph: 'I', repeatCount: 5 },
      { glyph: 'O', repeatCount: 5 },
      { glyph: 'U', repeatCount: 5 },
    ],
  },
  {
    id: 'letter-trace-latin-ms',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: 'Mm',
    titleI18n: { ar: 'الحَرْفَان M و S', fr: 'Les lettres M et S', en: 'The letters M and S' },
    instructionI18n: {
      ar: 'تَتَبَّع M ثُمَّ S — حَرْفَانِ سَهْلَانِ لِليَد.',
      fr: 'Trace M puis S — deux lettres faciles pour la main.',
      en: 'Trace M then S — two easy letters for the hand.',
    },
    traceRows: [
      { glyph: 'M', repeatCount: 5 },
      { glyph: 'S', repeatCount: 5 },
    ],
  },
  {
    id: 'numbers-trace-1-to-5-big',
    category: 'chiffres',
    kind: 'letter_trace',
    headerIcon: '1️⃣',
    titleI18n: { ar: 'الأَرْقَامُ الكَبِيرَة 1 إِلَى 5', fr: 'Grands chiffres 1 à 5', en: 'Big numbers 1 to 5' },
    instructionI18n: {
      ar: 'تَتَبَّعْ كُلَّ رَقْمٍ الكَبِيرِ بِقَلَمِكَ.',
      fr: 'Trace chaque grand chiffre avec ton crayon.',
      en: 'Trace each big number with your pencil.',
    },
    traceRows: [
      { glyph: '1', repeatCount: 4 },
      { glyph: '2', repeatCount: 4 },
      { glyph: '3', repeatCount: 4 },
      { glyph: '4', repeatCount: 4 },
      { glyph: '5', repeatCount: 4 },
    ],
  },
  {
    id: 'logic-count-farm',
    category: 'logique',
    kind: 'count_and_color',
    headerIcon: '🐄',
    titleI18n: { ar: 'عُدَّ حَيَوَانَاتِ المَزْرَعَة', fr: 'Compte les Animaux de la Ferme', en: 'Count the Farm Animals' },
    instructionI18n: {
      ar: 'عُدَّ الحَيَوَانَاتِ وَاكْتُبِ العَدَدَ فِي المُرَبَّع، ثُمَّ لَوِّنْهَا.',
      fr: 'Compte les animaux, écris le nombre, puis colorie-les.',
      en: 'Count the animals, write the number, then color them.',
    },
    countRows: [
      { icon: '🐑', count: 2 },
      { icon: '🐔', count: 4 },
      { icon: '🐄', count: 1 },
      { icon: '🦆', count: 3 },
    ],
  },
  {
    id: 'logic-count-oasis',
    category: 'logique',
    kind: 'count_and_color',
    headerIcon: '🌴',
    titleI18n: { ar: 'عُدَّ ثِمَارَ الوَاحَة', fr: 'Compte les Fruits de l’Oasis', en: 'Count the Oasis Fruits' },
    instructionI18n: {
      ar: 'عُدَّ التَّمْرَ وَالزَّيْتُونَ وَاكْتُبِ العَدَد.',
      fr: 'Compte les dattes et les olives, puis écris le nombre.',
      en: 'Count the dates and olives, then write the number.',
    },
    countRows: [
      { icon: '🌴', count: 2 },
      { icon: '🫒', count: 5 },
      { icon: '🍋', count: 3 },
      { icon: '🍊', count: 4 },
    ],
  },
  {
    id: 'logic-odd-shapes',
    category: 'logique',
    kind: 'odd_one_out',
    headerIcon: '🔺',
    titleI18n: { ar: 'الشَّكْلُ المُخْتَلِف', fr: 'La Forme Intruse', en: 'The Odd Shape' },
    instructionI18n: {
      ar: 'ضَعْ دَائِرَةً حَوْلَ الشَّكْلِ المُخْتَلِف فِي كُلِّ صَفّ.',
      fr: 'Entoure la forme différente dans chaque ligne.',
      en: 'Circle the different shape in each row.',
    },
    oddOneOutSets: [
      { items: ['🔵', '🔵', '🔵', '🔺', '🔵'], oddIndex: 3 },
      { items: ['⭐', '⭐', '❤️', '⭐', '⭐'], oddIndex: 2 },
      { items: ['🟩', '🟩', '🟩', '🟩', '🟧'], oddIndex: 4 },
      { items: ['🟡', '⬜', '🟡', '🟡', '🟡'], oddIndex: 1 },
    ],
  },
  {
    id: 'logic-odd-algeria',
    category: 'logique',
    kind: 'odd_one_out',
    headerIcon: '🇩🇿',
    titleI18n: { ar: 'مَنْ لَيْسَ مِنَ المَزْرَعَة؟', fr: 'Qui n’est pas de la ferme ?', en: 'Who is not from the farm?' },
    instructionI18n: {
      ar: 'ضَعْ دَائِرَةً حَوْلَ مَنْ لَا يَعِيشُ فِي المَزْرَعَة.',
      fr: 'Entoure celui qui ne vit pas à la ferme.',
      en: 'Circle the one that does not live on the farm.',
    },
    oddOneOutSets: [
      { items: ['🐄', '🐑', '🐔', '🦁', '🐐'], oddIndex: 3 },
      { items: ['🦆', '🐴', '🐶', '🐠', '🐱'], oddIndex: 3 },
      { items: ['🍎', '🍊', '🍋', '🚗', '🍉'], oddIndex: 3 },
      { items: ['☀️', '🌧️', '☁️', '🎈', '❄️'], oddIndex: 3 },
    ],
  },
  {
    id: 'logic-match-algeria',
    category: 'logique',
    kind: 'match_pairs',
    headerIcon: '🏜️',
    titleI18n: { ar: 'صِلْ بِلَادَنَا', fr: 'Relie Notre Pays', en: 'Match Our Country' },
    instructionI18n: {
      ar: 'صِلْ كُلَّ شَيْءٍ بِمَكَانِهِ: الصَّحْرَاء، البَحْر، المَزْرَعَة.',
      fr: 'Relie chaque chose à son lieu : désert, mer, ferme.',
      en: 'Match each thing to its place: desert, sea, farm.',
    },
    matchPairs: [
      { left: '🐪', right: '🏜️' },
      { left: '⛵', right: '🌊' },
      { left: '🐑', right: '🌾' },
      { left: '🐟', right: '🐠' },
    ],
  },
  {
    id: 'logic-match-home',
    category: 'logique',
    kind: 'match_pairs',
    headerIcon: '🏠',
    titleI18n: { ar: 'صِلْ أَشْيَاءَ البَيْت', fr: 'Relie les Objets de la Maison', en: 'Match Home Objects' },
    instructionI18n: {
      ar: 'صِلْ كُلَّ شَيْءٍ بِمَا يُنَاسِبُهُ.',
      fr: 'Relie chaque objet à ce qui va avec.',
      en: 'Match each object with what belongs with it.',
    },
    matchPairs: [
      { left: '🛏️', right: '🌙' },
      { left: '🥄', right: '🍲' },
      { left: '🪥', right: '😁' },
      { left: '🚿', right: '💧' },
    ],
  },
  {
    id: 'logic-match-numbers',
    category: 'logique',
    kind: 'match_pairs',
    headerIcon: '🔢',
    titleI18n: { ar: 'صِلِ الرَّقْمَ بِالكَمِّيَّة', fr: 'Relie le Chiffre à la Quantité', en: 'Match Number to Quantity' },
    instructionI18n: {
      ar: 'صِلْ كُلَّ رَقْمٍ بِعَدَدِ الفَوَاكِهِ المُنَاسِب.',
      fr: 'Relie chaque chiffre au bon nombre de fruits.',
      en: 'Match each number to the right amount of fruit.',
    },
    matchPairs: [
      { left: '1', right: '🍎' },
      { left: '2', right: '🍊🍊' },
      { left: '3', right: '🍋🍋🍋' },
      { left: '4', right: '🫒🫒🫒🫒' },
    ],
  },
  {
    id: 'motor-cut-fruit',
    category: 'motricite',
    kind: 'cut_along_lines',
    headerIcon: '🍎',
    titleI18n: { ar: 'قُصَّ الفَوَاكِه', fr: 'Découpe les Fruits', en: 'Cut Out the Fruits' },
    instructionI18n: {
      ar: 'بِمِقَصٍّ آمِن وَمَعَ الكِبَار، قُصَّ كُلَّ فَاكِهَة عَلَى الخَطِّ المُنَقَّط.',
      fr: 'Avec des ciseaux ronds et un adulte, découpe chaque fruit.',
      en: 'With safety scissors and an adult, cut out each fruit.',
    },
    cutShapes: ['🍎', '🍊', '🍋', '🍉', '🍇', '🫒'],
  },
  {
    id: 'motor-cut-farm',
    category: 'motricite',
    kind: 'cut_along_lines',
    headerIcon: '🐔',
    titleI18n: { ar: 'قُصَّ حَيَوَانَاتِ المَزْرَعَة', fr: 'Découpe les Animaux', en: 'Cut Out the Animals' },
    instructionI18n: {
      ar: 'قُصَّ الحَيَوَانَاتِ ثُمَّ أَلْصِقْهَا عَلَى وَرَقَةٍ أُخْرَى.',
      fr: 'Découpe les animaux puis colle-les sur une autre feuille.',
      en: 'Cut out the animals then glue them on another sheet.',
    },
    cutShapes: ['🐄', '🐑', '🐔', '🦆', '🐐', '🐴'],
  },
  {
    id: 'coloring-flower',
    category: 'coloriage',
    kind: 'coloring_page',
    headerIcon: '🌸',
    titleI18n: { ar: 'لَوِّنِ الزَّهْرَة', fr: 'Colorie la Fleur', en: 'Color the Flower' },
    instructionI18n: {
      ar: 'لَوِّنِ الزَّهْرَةَ كَمَا تُحِبّ.',
      fr: 'Colorie la fleur comme tu aimes.',
      en: 'Color the flower however you like.',
    },
    coloringShapeId: 'flower',
  },
  {
    id: 'coloring-fish',
    category: 'coloriage',
    kind: 'coloring_page',
    headerIcon: '🐟',
    titleI18n: { ar: 'لَوِّنِ السَّمَكَة', fr: 'Colorie le Poisson', en: 'Color the Fish' },
    instructionI18n: {
      ar: 'لَوِّنِ السَّمَكَةَ وَالفُقَّاعَات.',
      fr: 'Colorie le poisson et les bulles.',
      en: 'Color the fish and the bubbles.',
    },
    coloringShapeId: 'fish',
  },
  {
    id: 'coloring-boat',
    category: 'coloriage',
    kind: 'coloring_page',
    headerIcon: '⛵',
    titleI18n: { ar: 'لَوِّنِ القَارِب', fr: 'Colorie le Bateau', en: 'Color the Boat' },
    instructionI18n: {
      ar: 'لَوِّنِ القَارِبَ عَلَى البَحْر.',
      fr: 'Colorie le bateau sur la mer.',
      en: 'Color the boat on the sea.',
    },
    coloringShapeId: 'boat',
  },
  {
    id: 'coloring-camel',
    category: 'coloriage',
    kind: 'coloring_page',
    headerIcon: '🐪',
    titleI18n: { ar: 'لَوِّنِ الجَمَل', fr: 'Colorie le Dromadaire', en: 'Color the Camel' },
    instructionI18n: {
      ar: 'جَمَلُ الصَّحْرَاء — لَوِّنْهُ بِاللَّوْنِ الذَّهَبِي.',
      fr: 'Le dromadaire du Sahara — colorie-le en doré.',
      en: 'The Sahara camel — color it gold.',
    },
    coloringShapeId: 'camel',
  },
  {
    id: 'coloring-mosque',
    category: 'coloriage',
    kind: 'coloring_page',
    headerIcon: '🕌',
    titleI18n: { ar: 'لَوِّنِ المَسْجِد', fr: 'Colorie la Mosquée', en: 'Color the Mosque' },
    instructionI18n: {
      ar: 'لَوِّنِ القُبَّةَ وَالمِئْذَنَة.',
      fr: 'Colorie le dôme et le minaret.',
      en: 'Color the dome and the minaret.',
    },
    coloringShapeId: 'mosque',
  },
  {
    id: 'coloring-olive',
    category: 'coloriage',
    kind: 'coloring_page',
    headerIcon: '🫒',
    titleI18n: { ar: 'لَوِّنْ شَجَرَةَ الزَّيْتُون', fr: 'Colorie l’Olivier', en: 'Color the Olive Tree' },
    instructionI18n: {
      ar: 'شَجَرَةُ الزَّيْتُونِ الجَزَائِرِيَّة — لَوِّنِ الأَوْرَاقَ خَضْرَاء.',
      fr: 'L’olivier d’Algérie — colorie les feuilles en vert.',
      en: 'The Algerian olive tree — color the leaves green.',
    },
    coloringShapeId: 'olive',
  },
];

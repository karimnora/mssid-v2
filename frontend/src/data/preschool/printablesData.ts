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
  coloringShapeId?: 'house' | 'star_crescent' | 'sun' | 'flower' | 'fish' | 'boat';
}

export const PRINTABLE_CATEGORY_LABELS: Record<PrintableCategory, Record<PreschoolLanguage, string>> = {
  graphisme: { ar: 'تمارين الخط والحركة', fr: 'Graphisme & Pré-écriture', en: 'Pre-Writing Lines' },
  lettres: { ar: 'تتبع الحروف', fr: 'Traçage des Lettres', en: 'Letter Tracing' },
  chiffres: { ar: 'تتبع الأرقام', fr: 'Traçage des Chiffres', en: 'Number Tracing' },
  logique: { ar: 'العد والمنطق', fr: 'Dénombrement & Logique', en: 'Counting & Logic' },
  motricite: { ar: 'المهارات اليدوية', fr: 'Motricité Fine', en: 'Fine Motor Skills' },
  coloriage: { ar: 'تلوين حر', fr: 'Coloriage', en: 'Coloring' },
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
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الأَلِفِ (أ)', fr: 'Traçage de la Lettre A', en: 'Tracing the Letter A' },
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
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ البَاءِ (ب)', fr: 'Traçage de la Lettre B', en: 'Tracing the Letter B' },
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
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الجِيمِ (ج)', fr: 'Traçage de la Lettre J', en: 'Tracing the Letter J' },
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
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ المِيمِ (م)', fr: 'Traçage de la Lettre M', en: 'Tracing the Letter M' },
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
];

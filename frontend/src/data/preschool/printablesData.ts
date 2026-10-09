import { ColoringArtId } from './coloringArt';
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
  | 'coloring_page'
  | 'story_order';

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
  coloringShapeId?: ColoringArtId;
  glyphPicture?: string;
  glyphPictureI18n?: Record<PreschoolLanguage, string>;
  glyphWord?: Record<PreschoolLanguage, string>;
  storyFrames?: { asset: string; caption: Record<PreschoolLanguage, string> }[];
}

/** Letter worksheets teach the selected alphabet, not just translated instructions. */
export function isWorksheetAvailableInLanguage(sheet: PrintableWorksheet, language: PreschoolLanguage): boolean {
  if (sheet.category !== 'lettres') return true;
  const glyphs = (sheet.traceRows ?? []).map(row => row.glyph).join('');
  return language === 'ar'
    ? /\p{Script=Arabic}/u.test(glyphs) && !/[A-Za-z]/.test(glyphs)
    : /[A-Za-z]/.test(glyphs) && !/\p{Script=Arabic}/u.test(glyphs);
}

export function getPrintableWorksheets(language: PreschoolLanguage): PrintableWorksheet[] {
  return PRINTABLE_WORKSHEETS.filter(sheet => isWorksheetAvailableInLanguage(sheet, language));
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
  {
    id: 'numbers-trace-10',
    category: 'chiffres',
    kind: 'letter_trace',
    headerIcon: '🔟',
    titleI18n: { ar: 'تَتَبُّعُ الرَّقْمِ 10', fr: 'Traçage du Chiffre 10', en: 'Tracing the Number 10' },
    instructionI18n: {
      ar: 'تتبّع الرقم 10 بقلمك، صفاً بعد صف.',
      fr: 'Trace le nombre 10 au crayon, ligne après ligne.',
      en: 'Trace the number 10 with your pencil, row after row.',
    },
    traceRows: [
      { glyph: '10', repeatCount: 6 },
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
  // The remaining 14 letters below complete the exact 24-letter set taught interactively in
  // lettersModule.ts (ح خ ذ ه are deliberately never a target there, and stay absent here too).
  {
    id: 'letter-trace-thaa',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الثَّاءِ (ث)', fr: 'Traçage de la lettre ث (Thaa)', en: 'Tracing the letter ث (Thaa)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ث', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-raa',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الرَّاءِ (ر)', fr: 'Traçage de la lettre ر (Raa)', en: 'Tracing the letter ر (Raa)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ر', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-zay',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الزَّايِ (ز)', fr: 'Traçage de la lettre ز (Zay)', en: 'Tracing the letter ز (Zay)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ز', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-sheen',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الشِّينِ (ش)', fr: 'Traçage de la lettre ش (Sheen)', en: 'Tracing the letter ش (Sheen)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ش', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-sad',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الصَّادِ (ص)', fr: 'Traçage de la lettre ص (Sad)', en: 'Tracing the letter ص (Sad)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ص', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-dad',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الضَّادِ (ض)', fr: 'Traçage de la lettre ض (Dad)', en: 'Tracing the letter ض (Dad)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ض', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-taa2',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الطَّاءِ (ط)', fr: 'Traçage de la lettre ط (Taa)', en: 'Tracing the letter ط (Taa)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ط', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-za',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الظَّاءِ (ظ)', fr: 'Traçage de la lettre ظ (Zaa)', en: 'Tracing the letter ظ (Zaa)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ظ', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-ayn',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ العَيْنِ (ع)', fr: 'Traçage de la lettre ع (Ayn)', en: 'Tracing the letter ع (Ayn)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ع', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-ghayn',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الغَيْنِ (غ)', fr: 'Traçage de la lettre غ (Ghayn)', en: 'Tracing the letter غ (Ghayn)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'غ', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-faa',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الفَاءِ (ف)', fr: 'Traçage de la lettre ف (Faa)', en: 'Tracing the letter ف (Faa)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ف', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-qaf',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ القَافِ (ق)', fr: 'Traçage de la lettre ق (Qaf)', en: 'Tracing the letter ق (Qaf)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ق', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-kaf',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ الكَافِ (ك)', fr: 'Traçage de la lettre ك (Kaf)', en: 'Tracing the letter ك (Kaf)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ك', repeatCount: 6 }],
  },
  {
    id: 'letter-trace-lam',
    category: 'lettres',
    kind: 'letter_trace',
    headerIcon: '🔤',
    titleI18n: { ar: 'تَتَبُّعُ حَرْفِ اللَّامِ (ل)', fr: 'Traçage de la lettre ل (Lam)', en: 'Tracing the letter ل (Lam)' },
    instructionI18n: {
      ar: 'مَرِّر إِصْبَعَكَ ثُمَّ قَلَمَكَ عَلَى الحَرْف.',
      fr: 'Passe ton doigt puis ton crayon sur la lettre en pointillés.',
      en: 'Trace the letter with your finger, then your pencil.',
    },
    traceRows: [{ glyph: 'ل', repeatCount: 6 }],
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
    id: 'numbers-trace-6-to-10-big',
    category: 'chiffres',
    kind: 'letter_trace',
    headerIcon: '🔟',
    titleI18n: { ar: 'الأَرْقَامُ الكَبِيرَة 6 إِلَى 10', fr: 'Grands chiffres 6 à 10', en: 'Big numbers 6 to 10' },
    instructionI18n: {
      ar: 'تَتَبَّعْ كُلَّ رَقْمٍ الكَبِيرِ بِقَلَمِكَ.',
      fr: 'Trace chaque grand chiffre avec ton crayon.',
      en: 'Trace each big number with your pencil.',
    },
    traceRows: [
      { glyph: '6', repeatCount: 4 },
      { glyph: '7', repeatCount: 4 },
      { glyph: '8', repeatCount: 4 },
      { glyph: '9', repeatCount: 4 },
      { glyph: '10', repeatCount: 4 },
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
      { items: ['🟩', '🟩', '🟩', '🟩', '🔺'], oddIndex: 4 },
      { items: ['⚪', '🟦', '⚪', '⚪', '⚪'], oddIndex: 1 },
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
{
  "id": "letter-trace-haa",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "ح",
  "titleI18n": {
    "ar": "أتتبّع الحرف ح",
    "fr": "Je trace la lettre arabe ح",
    "en": "I trace Arabic ح"
  },
  "instructionI18n": {
    "ar": "أتتبّع النموذج، ثم أجرّب الكتابة وحدي.",
    "fr": "Suis le modèle, puis essaie sur les lignes sans modèle.",
    "en": "Follow the model, then try the empty lines."
  },
  "traceRows": [
    {
      "glyph": "ح",
      "repeatCount": 6
    }
  ],
  "glyphPicture": "🥛",
  "glyphWord": {
    "ar": "حليب",
    "fr": "حليب — lait",
    "en": "حليب — milk"
  }
},
{
  "id": "letter-trace-khaa",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "خ",
  "titleI18n": {
    "ar": "أتتبّع الحرف خ",
    "fr": "Je trace la lettre arabe خ",
    "en": "I trace Arabic خ"
  },
  "instructionI18n": {
    "ar": "أتتبّع النموذج، ثم أجرّب الكتابة وحدي.",
    "fr": "Suis le modèle, puis essaie sur les lignes sans modèle.",
    "en": "Follow the model, then try the empty lines."
  },
  "traceRows": [
    {
      "glyph": "خ",
      "repeatCount": 6
    }
  ],
  "glyphPicture": "🍞",
  "glyphWord": {
    "ar": "خبز",
    "fr": "خبز — pain",
    "en": "خبز — bread"
  }
},
{
  "id": "letter-trace-thal",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "ذ",
  "titleI18n": {
    "ar": "أتتبّع الحرف ذ",
    "fr": "Je trace la lettre arabe ذ",
    "en": "I trace Arabic ذ"
  },
  "instructionI18n": {
    "ar": "أتتبّع النموذج، ثم أجرّب الكتابة وحدي.",
    "fr": "Suis le modèle, puis essaie sur les lignes sans modèle.",
    "en": "Follow the model, then try the empty lines."
  },
  "traceRows": [
    {
      "glyph": "ذ",
      "repeatCount": 6
    }
  ],
  "glyphPicture": "🌽",
  "glyphWord": {
    "ar": "ذرة",
    "fr": "ذرة — maïs",
    "en": "ذرة — corn"
  }
},
{
  "id": "letter-trace-haa-round",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "ه",
  "titleI18n": {
    "ar": "أتتبّع الحرف ه",
    "fr": "Je trace la lettre arabe ه",
    "en": "I trace Arabic ه"
  },
  "instructionI18n": {
    "ar": "أتتبّع النموذج، ثم أجرّب الكتابة وحدي.",
    "fr": "Suis le modèle, puis essaie sur les lignes sans modèle.",
    "en": "Follow the model, then try the empty lines."
  },
  "traceRows": [
    {
      "glyph": "ه",
      "repeatCount": 6
    }
  ],
  "glyphPicture": "🌙",
  "glyphWord": {
    "ar": "هلال",
    "fr": "هلال — croissant de lune",
    "en": "هلال — crescent moon"
  }
},
{
  "id": "letter-latin-a",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "A",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني A",
    "fr": "Je trace A — Ananas",
    "en": "I trace A — Apple"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "A",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🍍",
    "fr": "🍍",
    "en": "🍎"
  },
  "glyphWord": {
    "ar": "Ananas",
    "fr": "Ananas",
    "en": "Apple"
  }
},
{
  "id": "letter-latin-b",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "B",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني B",
    "fr": "Je trace B — Ballon",
    "en": "I trace B — Ball"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "B",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🎈",
    "fr": "🎈",
    "en": "⚽"
  },
  "glyphWord": {
    "ar": "Ballon",
    "fr": "Ballon",
    "en": "Ball"
  }
},
{
  "id": "letter-latin-c",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "C",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني C",
    "fr": "Je trace C — Chat",
    "en": "I trace C — Cat"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "C",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🐱",
    "fr": "🐱",
    "en": "🐱"
  },
  "glyphWord": {
    "ar": "Chat",
    "fr": "Chat",
    "en": "Cat"
  }
},
{
  "id": "letter-latin-d",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "D",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني D",
    "fr": "Je trace D — Dinosaure",
    "en": "I trace D — Dinosaur"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "D",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🦕",
    "fr": "🦕",
    "en": "🦕"
  },
  "glyphWord": {
    "ar": "Dinosaure",
    "fr": "Dinosaure",
    "en": "Dinosaur"
  }
},
{
  "id": "letter-latin-e",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "E",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني E",
    "fr": "Je trace E — Éléphant",
    "en": "I trace E — Elephant"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "E",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🐘",
    "fr": "🐘",
    "en": "🐘"
  },
  "glyphWord": {
    "ar": "Éléphant",
    "fr": "Éléphant",
    "en": "Elephant"
  }
},
{
  "id": "letter-latin-f",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "F",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني F",
    "fr": "Je trace F — Fraise",
    "en": "I trace F — Fish"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "F",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🍓",
    "fr": "🍓",
    "en": "🐟"
  },
  "glyphWord": {
    "ar": "Fraise",
    "fr": "Fraise",
    "en": "Fish"
  }
},
{
  "id": "letter-latin-g",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "G",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني G",
    "fr": "Je trace G — Grenouille",
    "en": "I trace G — Goat"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "G",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🐸",
    "fr": "🐸",
    "en": "🐐"
  },
  "glyphWord": {
    "ar": "Grenouille",
    "fr": "Grenouille",
    "en": "Goat"
  }
},
{
  "id": "letter-latin-h",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "H",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني H",
    "fr": "Je trace H — Hibou",
    "en": "I trace H — Horse"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "H",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🦉",
    "fr": "🦉",
    "en": "🐴"
  },
  "glyphWord": {
    "ar": "Hibou",
    "fr": "Hibou",
    "en": "Horse"
  }
},
{
  "id": "letter-latin-i",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "I",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني I",
    "fr": "Je trace I — Île",
    "en": "I trace I — Island"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "I",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🏝️",
    "fr": "🏝️",
    "en": "🏝️"
  },
  "glyphWord": {
    "ar": "Île",
    "fr": "Île",
    "en": "Island"
  }
},
{
  "id": "letter-latin-j",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "J",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني J",
    "fr": "Je trace J — Jardin",
    "en": "I trace J — Juice"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "J",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "art:garden",
    "fr": "art:garden",
    "en": "🧃"
  },
  "glyphWord": {
    "ar": "Jardin",
    "fr": "Jardin",
    "en": "Juice"
  }
},
{
  "id": "letter-latin-k",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "K",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني K",
    "fr": "Je trace K — Koala",
    "en": "I trace K — Koala"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "K",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🐨",
    "fr": "🐨",
    "en": "🐨"
  },
  "glyphWord": {
    "ar": "Koala",
    "fr": "Koala",
    "en": "Koala"
  }
},
{
  "id": "letter-latin-l",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "L",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني L",
    "fr": "Je trace L — Lion",
    "en": "I trace L — Lion"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "L",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🦁",
    "fr": "🦁",
    "en": "🦁"
  },
  "glyphWord": {
    "ar": "Lion",
    "fr": "Lion",
    "en": "Lion"
  }
},
{
  "id": "letter-latin-m",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "M",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني M",
    "fr": "Je trace M — Maison",
    "en": "I trace M — Moon"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "M",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🏠",
    "fr": "🏠",
    "en": "🌙"
  },
  "glyphWord": {
    "ar": "Maison",
    "fr": "Maison",
    "en": "Moon"
  }
},
{
  "id": "letter-latin-n",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "N",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني N",
    "fr": "Je trace N — Nuage",
    "en": "I trace N — Nest"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "N",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "☁️",
    "fr": "☁️",
    "en": "🪺"
  },
  "glyphWord": {
    "ar": "Nuage",
    "fr": "Nuage",
    "en": "Nest"
  }
},
{
  "id": "letter-latin-o",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "O",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني O",
    "fr": "Je trace O — Orange",
    "en": "I trace O — Orange"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "O",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🍊",
    "fr": "🍊",
    "en": "🍊"
  },
  "glyphWord": {
    "ar": "Orange",
    "fr": "Orange",
    "en": "Orange"
  }
},
{
  "id": "letter-latin-p",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "P",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني P",
    "fr": "Je trace P — Poisson",
    "en": "I trace P — Penguin"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "P",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🐟",
    "fr": "🐟",
    "en": "🐧"
  },
  "glyphWord": {
    "ar": "Poisson",
    "fr": "Poisson",
    "en": "Penguin"
  }
},
{
  "id": "letter-latin-q",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "Q",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني Q",
    "fr": "Je trace Q — Quatre",
    "en": "I trace Q — Queen"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "Q",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "4️⃣",
    "fr": "4️⃣",
    "en": "👑"
  },
  "glyphWord": {
    "ar": "Quatre",
    "fr": "Quatre",
    "en": "Queen"
  }
},
{
  "id": "letter-latin-r",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "R",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني R",
    "fr": "Je trace R — Rose",
    "en": "I trace R — Rose"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "R",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🌹",
    "fr": "🌹",
    "en": "🌹"
  },
  "glyphWord": {
    "ar": "Rose",
    "fr": "Rose",
    "en": "Rose"
  }
},
{
  "id": "letter-latin-s",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "S",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني S",
    "fr": "Je trace S — Soleil",
    "en": "I trace S — Sun"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "S",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "☀️",
    "fr": "☀️",
    "en": "☀️"
  },
  "glyphWord": {
    "ar": "Soleil",
    "fr": "Soleil",
    "en": "Sun"
  }
},
{
  "id": "letter-latin-t",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "T",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني T",
    "fr": "Je trace T — Tortue",
    "en": "I trace T — Turtle"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "T",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🐢",
    "fr": "🐢",
    "en": "🐢"
  },
  "glyphWord": {
    "ar": "Tortue",
    "fr": "Tortue",
    "en": "Turtle"
  }
},
{
  "id": "letter-latin-u",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "U",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني U",
    "fr": "Je trace U — Usine",
    "en": "I trace U — Umbrella"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "U",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🏭",
    "fr": "🏭",
    "en": "☂️"
  },
  "glyphWord": {
    "ar": "Usine",
    "fr": "Usine",
    "en": "Umbrella"
  }
},
{
  "id": "letter-latin-v",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "V",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني V",
    "fr": "Je trace V — Voiture",
    "en": "I trace V — Violin"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "V",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🚗",
    "fr": "🚗",
    "en": "🎻"
  },
  "glyphWord": {
    "ar": "Voiture",
    "fr": "Voiture",
    "en": "Violin"
  }
},
{
  "id": "letter-latin-w",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "W",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني W",
    "fr": "Je trace W — Wagon",
    "en": "I trace W — Whale"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "W",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🚃",
    "fr": "🚃",
    "en": "🐳"
  },
  "glyphWord": {
    "ar": "Wagon",
    "fr": "Wagon",
    "en": "Whale"
  }
},
{
  "id": "letter-latin-x",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "X",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني X",
    "fr": "Je trace X — Xylophone",
    "en": "I trace X — Xylophone"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "X",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "art:xylophone",
    "fr": "art:xylophone",
    "en": "art:xylophone"
  },
  "glyphWord": {
    "ar": "Xylophone",
    "fr": "Xylophone",
    "en": "Xylophone"
  }
},
{
  "id": "letter-latin-y",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "Y",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني Y",
    "fr": "Je trace Y — Yo-yo",
    "en": "I trace Y — Yo-yo"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "Y",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🪀",
    "fr": "🪀",
    "en": "🪀"
  },
  "glyphWord": {
    "ar": "Yo-yo",
    "fr": "Yo-yo",
    "en": "Yo-yo"
  }
},
{
  "id": "letter-latin-z",
  "category": "lettres",
  "kind": "letter_trace",
  "headerIcon": "Z",
  "titleI18n": {
    "ar": "أتتبّع الحرف اللاتيني Z",
    "fr": "Je trace Z — Zèbre",
    "en": "I trace Z — Zebra"
  },
  "instructionI18n": {
    "ar": "أتتبّع الحرف الكبير، ثم أجرّب وحدي.",
    "fr": "Observe la lettre et l’image. Trace, puis essaie sans modèle.",
    "en": "Look at the letter and picture. Trace, then try on your own."
  },
  "traceRows": [
    {
      "glyph": "Z",
      "repeatCount": 6
    }
  ],
  "glyphPictureI18n": {
    "ar": "🦓",
    "fr": "🦓",
    "en": "🦓"
  },
  "glyphWord": {
    "ar": "Zèbre",
    "fr": "Zèbre",
    "en": "Zebra"
  }
},
{
  "id": "quantity-0",
  "category": "chiffres",
  "kind": "count_and_color",
  "headerIcon": "0",
  "titleI18n": {
    "ar": "أعدّ وأكتب: 0",
    "fr": "Je compte et j’écris : 0",
    "en": "I count and write: 0"
  },
  "instructionI18n": {
    "ar": "أعدّ الأشكال واكتب العدد في المربع، ثم أتتبّع النموذج.",
    "fr": "Compte chaque collection et écris le nombre dans la case. Termine par le tracé.",
    "en": "Count each group and write its number. Then trace the model."
  },
  "countRows": [
    {
      "icon": "🍎",
      "count": 0
    },
    {
      "icon": "⭐",
      "count": 0
    },
    {
      "icon": "🐟",
      "count": 1
    }
  ],
  "traceRows": [
    {
      "glyph": "0",
      "repeatCount": 5
    }
  ]
},
{
  "id": "quantity-1",
  "category": "chiffres",
  "kind": "count_and_color",
  "headerIcon": "1",
  "titleI18n": {
    "ar": "أعدّ وأكتب: 1",
    "fr": "Je compte et j’écris : 1",
    "en": "I count and write: 1"
  },
  "instructionI18n": {
    "ar": "أعدّ الأشكال واكتب العدد في المربع، ثم أتتبّع النموذج.",
    "fr": "Compte chaque collection et écris le nombre dans la case. Termine par le tracé.",
    "en": "Count each group and write its number. Then trace the model."
  },
  "countRows": [
    {
      "icon": "🍎",
      "count": 1
    },
    {
      "icon": "⭐",
      "count": 0
    },
    {
      "icon": "🐟",
      "count": 2
    }
  ],
  "traceRows": [
    {
      "glyph": "1",
      "repeatCount": 5
    }
  ]
},
{
  "id": "quantity-2",
  "category": "chiffres",
  "kind": "count_and_color",
  "headerIcon": "2",
  "titleI18n": {
    "ar": "أعدّ وأكتب: 2",
    "fr": "Je compte et j’écris : 2",
    "en": "I count and write: 2"
  },
  "instructionI18n": {
    "ar": "أعدّ الأشكال واكتب العدد في المربع، ثم أتتبّع النموذج.",
    "fr": "Compte chaque collection et écris le nombre dans la case. Termine par le tracé.",
    "en": "Count each group and write its number. Then trace the model."
  },
  "countRows": [
    {
      "icon": "🍎",
      "count": 2
    },
    {
      "icon": "⭐",
      "count": 1
    },
    {
      "icon": "🐟",
      "count": 3
    }
  ],
  "traceRows": [
    {
      "glyph": "2",
      "repeatCount": 5
    }
  ]
},
{
  "id": "quantity-3",
  "category": "chiffres",
  "kind": "count_and_color",
  "headerIcon": "3",
  "titleI18n": {
    "ar": "أعدّ وأكتب: 3",
    "fr": "Je compte et j’écris : 3",
    "en": "I count and write: 3"
  },
  "instructionI18n": {
    "ar": "أعدّ الأشكال واكتب العدد في المربع، ثم أتتبّع النموذج.",
    "fr": "Compte chaque collection et écris le nombre dans la case. Termine par le tracé.",
    "en": "Count each group and write its number. Then trace the model."
  },
  "countRows": [
    {
      "icon": "🍎",
      "count": 3
    },
    {
      "icon": "⭐",
      "count": 2
    },
    {
      "icon": "🐟",
      "count": 4
    }
  ],
  "traceRows": [
    {
      "glyph": "3",
      "repeatCount": 5
    }
  ]
},
{
  "id": "quantity-4",
  "category": "chiffres",
  "kind": "count_and_color",
  "headerIcon": "4",
  "titleI18n": {
    "ar": "أعدّ وأكتب: 4",
    "fr": "Je compte et j’écris : 4",
    "en": "I count and write: 4"
  },
  "instructionI18n": {
    "ar": "أعدّ الأشكال واكتب العدد في المربع، ثم أتتبّع النموذج.",
    "fr": "Compte chaque collection et écris le nombre dans la case. Termine par le tracé.",
    "en": "Count each group and write its number. Then trace the model."
  },
  "countRows": [
    {
      "icon": "🍎",
      "count": 4
    },
    {
      "icon": "⭐",
      "count": 3
    },
    {
      "icon": "🐟",
      "count": 5
    }
  ],
  "traceRows": [
    {
      "glyph": "4",
      "repeatCount": 5
    }
  ]
},
{
  "id": "quantity-5",
  "category": "chiffres",
  "kind": "count_and_color",
  "headerIcon": "5",
  "titleI18n": {
    "ar": "أعدّ وأكتب: 5",
    "fr": "Je compte et j’écris : 5",
    "en": "I count and write: 5"
  },
  "instructionI18n": {
    "ar": "أعدّ الأشكال واكتب العدد في المربع، ثم أتتبّع النموذج.",
    "fr": "Compte chaque collection et écris le nombre dans la case. Termine par le tracé.",
    "en": "Count each group and write its number. Then trace the model."
  },
  "countRows": [
    {
      "icon": "🍎",
      "count": 5
    },
    {
      "icon": "⭐",
      "count": 4
    },
    {
      "icon": "🐟",
      "count": 6
    }
  ],
  "traceRows": [
    {
      "glyph": "5",
      "repeatCount": 5
    }
  ]
},
{
  "id": "quantity-6",
  "category": "chiffres",
  "kind": "count_and_color",
  "headerIcon": "6",
  "titleI18n": {
    "ar": "أعدّ وأكتب: 6",
    "fr": "Je compte et j’écris : 6",
    "en": "I count and write: 6"
  },
  "instructionI18n": {
    "ar": "أعدّ الأشكال واكتب العدد في المربع، ثم أتتبّع النموذج.",
    "fr": "Compte chaque collection et écris le nombre dans la case. Termine par le tracé.",
    "en": "Count each group and write its number. Then trace the model."
  },
  "countRows": [
    {
      "icon": "🍎",
      "count": 6
    },
    {
      "icon": "⭐",
      "count": 5
    },
    {
      "icon": "🐟",
      "count": 7
    }
  ],
  "traceRows": [
    {
      "glyph": "6",
      "repeatCount": 5
    }
  ]
},
{
  "id": "quantity-7",
  "category": "chiffres",
  "kind": "count_and_color",
  "headerIcon": "7",
  "titleI18n": {
    "ar": "أعدّ وأكتب: 7",
    "fr": "Je compte et j’écris : 7",
    "en": "I count and write: 7"
  },
  "instructionI18n": {
    "ar": "أعدّ الأشكال واكتب العدد في المربع، ثم أتتبّع النموذج.",
    "fr": "Compte chaque collection et écris le nombre dans la case. Termine par le tracé.",
    "en": "Count each group and write its number. Then trace the model."
  },
  "countRows": [
    {
      "icon": "🍎",
      "count": 7
    },
    {
      "icon": "⭐",
      "count": 6
    },
    {
      "icon": "🐟",
      "count": 8
    }
  ],
  "traceRows": [
    {
      "glyph": "7",
      "repeatCount": 5
    }
  ]
},
{
  "id": "quantity-8",
  "category": "chiffres",
  "kind": "count_and_color",
  "headerIcon": "8",
  "titleI18n": {
    "ar": "أعدّ وأكتب: 8",
    "fr": "Je compte et j’écris : 8",
    "en": "I count and write: 8"
  },
  "instructionI18n": {
    "ar": "أعدّ الأشكال واكتب العدد في المربع، ثم أتتبّع النموذج.",
    "fr": "Compte chaque collection et écris le nombre dans la case. Termine par le tracé.",
    "en": "Count each group and write its number. Then trace the model."
  },
  "countRows": [
    {
      "icon": "🍎",
      "count": 8
    },
    {
      "icon": "⭐",
      "count": 7
    },
    {
      "icon": "🐟",
      "count": 9
    }
  ],
  "traceRows": [
    {
      "glyph": "8",
      "repeatCount": 5
    }
  ]
},
{
  "id": "quantity-9",
  "category": "chiffres",
  "kind": "count_and_color",
  "headerIcon": "9",
  "titleI18n": {
    "ar": "أعدّ وأكتب: 9",
    "fr": "Je compte et j’écris : 9",
    "en": "I count and write: 9"
  },
  "instructionI18n": {
    "ar": "أعدّ الأشكال واكتب العدد في المربع، ثم أتتبّع النموذج.",
    "fr": "Compte chaque collection et écris le nombre dans la case. Termine par le tracé.",
    "en": "Count each group and write its number. Then trace the model."
  },
  "countRows": [
    {
      "icon": "🍎",
      "count": 9
    },
    {
      "icon": "⭐",
      "count": 8
    },
    {
      "icon": "🐟",
      "count": 10
    }
  ],
  "traceRows": [
    {
      "glyph": "9",
      "repeatCount": 5
    }
  ]
},
{
  "id": "quantity-10",
  "category": "chiffres",
  "kind": "count_and_color",
  "headerIcon": "10",
  "titleI18n": {
    "ar": "أعدّ وأكتب: 10",
    "fr": "Je compte et j’écris : 10",
    "en": "I count and write: 10"
  },
  "instructionI18n": {
    "ar": "أعدّ الأشكال واكتب العدد في المربع، ثم أتتبّع النموذج.",
    "fr": "Compte chaque collection et écris le nombre dans la case. Termine par le tracé.",
    "en": "Count each group and write its number. Then trace the model."
  },
  "countRows": [
    {
      "icon": "🍎",
      "count": 10
    },
    {
      "icon": "⭐",
      "count": 9
    },
    {
      "icon": "🐟",
      "count": 10
    }
  ],
  "traceRows": [
    {
      "glyph": "10",
      "repeatCount": 5
    }
  ]
},
{
  "id": "story-print-meal",
  "category": "logique",
  "kind": "story_order",
  "headerIcon": "📖",
  "titleI18n": {
    "ar": "أرتّب وأحكي قصة",
    "fr": "Je remets l’histoire dans l’ordre",
    "en": "I put the story in order"
  },
  "instructionI18n": {
    "ar": "أقصّ البطاقات مع شخص بالغ، ثم ألصقها بالترتيب وأحكي القصة.",
    "fr": "Découpe avec un adulte. Colle les images dans l’ordre, puis raconte.",
    "en": "Cut with a grown-up. Paste the pictures in order, then tell the story."
  },
  "storyFrames": [
    {
      "asset": "🍽️",
      "caption": {
        "fr": "Faim",
        "ar": "جوع",
        "en": "Hungry"
      }
    },
    {
      "asset": "🍲",
      "caption": {
        "fr": "Repas",
        "ar": "وجبة",
        "en": "Meal"
      }
    },
    {
      "asset": "face:happy",
      "caption": {
        "fr": "Content",
        "ar": "سعيد",
        "en": "Happy"
      }
    }
  ]
},
{
  "id": "story-print-hands",
  "category": "logique",
  "kind": "story_order",
  "headerIcon": "📖",
  "titleI18n": {
    "ar": "أرتّب وأحكي قصة",
    "fr": "Je remets l’histoire dans l’ordre",
    "en": "I put the story in order"
  },
  "instructionI18n": {
    "ar": "أقصّ البطاقات مع شخص بالغ، ثم ألصقها بالترتيب وأحكي القصة.",
    "fr": "Découpe avec un adulte. Colle les images dans l’ordre, puis raconte.",
    "en": "Cut with a grown-up. Paste the pictures in order, then tell the story."
  },
  "storyFrames": [
    {
      "asset": "art:hands_dirty",
      "caption": {
        "fr": "Mains sales",
        "ar": "يدان متسختان",
        "en": "Dirty hands"
      }
    },
    {
      "asset": "art:soap",
      "caption": {
        "fr": "Savon",
        "ar": "صابون",
        "en": "Soap"
      }
    },
    {
      "asset": "art:hands_clean",
      "caption": {
        "fr": "Mains propres",
        "ar": "يدان نظيفتان",
        "en": "Clean hands"
      }
    }
  ]
},
{
  "id": "story-print-day",
  "category": "logique",
  "kind": "story_order",
  "headerIcon": "📖",
  "titleI18n": {
    "ar": "أرتّب وأحكي قصة",
    "fr": "Je remets l’histoire dans l’ordre",
    "en": "I put the story in order"
  },
  "instructionI18n": {
    "ar": "أقصّ البطاقات مع شخص بالغ، ثم ألصقها بالترتيب وأحكي القصة.",
    "fr": "Découpe avec un adulte. Colle les images dans l’ordre, puis raconte.",
    "en": "Cut with a grown-up. Paste the pictures in order, then tell the story."
  },
  "storyFrames": [
    {
      "asset": "🌅",
      "caption": {
        "fr": "Réveil",
        "ar": "أستيقظ",
        "en": "Wake up"
      }
    },
    {
      "asset": "🏫",
      "caption": {
        "fr": "École",
        "ar": "المدرسة",
        "en": "School"
      }
    },
    {
      "asset": "🏠",
      "caption": {
        "fr": "Maison",
        "ar": "البيت",
        "en": "Home"
      }
    }
  ]
},
{
  "id": "logic-paper-positions",
  "category": "logique",
  "kind": "odd_one_out",
  "headerIcon": "🔎",
  "titleI18n": {
    "fr": "Je reconnais les positions",
    "ar": "ألاحظ المكان",
    "en": "I notice positions"
  },
  "instructionI18n": {
    "fr": "Entoure l’image différente. Explique ce qui change à un adulte.",
    "ar": "أحيط الصورة المختلفة وأشرح الفرق لشخص بالغ.",
    "en": "Circle the different picture and explain what changes."
  },
  "oddOneOutSets": [
    {
      "items": [
        "scene:above",
        "scene:above",
        "scene:below",
        "scene:above"
      ],
      "oddIndex": 2
    },
    {
      "items": [
        "scene:above",
        "scene:below",
        "scene:above",
        "scene:above"
      ],
      "oddIndex": 1
    },
    {
      "items": [
        "scene:below",
        "scene:above",
        "scene:above",
        "scene:above"
      ],
      "oddIndex": 0
    }
  ]
},
{
  "id": "logic-paper-containers",
  "category": "logique",
  "kind": "odd_one_out",
  "headerIcon": "🔎",
  "titleI18n": {
    "fr": "Dedans ou dehors ?",
    "ar": "داخل أم خارج؟",
    "en": "Inside or outside?"
  },
  "instructionI18n": {
    "fr": "Entoure l’image différente. Explique ce qui change à un adulte.",
    "ar": "أحيط الصورة المختلفة وأشرح الفرق لشخص بالغ.",
    "en": "Circle the different picture and explain what changes."
  },
  "oddOneOutSets": [
    {
      "items": [
        "scene:inside",
        "scene:outside",
        "scene:inside",
        "scene:inside"
      ],
      "oddIndex": 1
    },
    {
      "items": [
        "scene:inside",
        "scene:inside",
        "scene:outside",
        "scene:inside"
      ],
      "oddIndex": 2
    },
    {
      "items": [
        "scene:outside",
        "scene:inside",
        "scene:inside",
        "scene:inside"
      ],
      "oddIndex": 0
    }
  ]
},
{
  "id": "logic-paper-emotions",
  "category": "logique",
  "kind": "odd_one_out",
  "headerIcon": "🔎",
  "titleI18n": {
    "fr": "Je reconnais les expressions",
    "ar": "ألاحظ تعابير الوجه",
    "en": "I notice expressions"
  },
  "instructionI18n": {
    "fr": "Entoure l’image différente. Explique ce qui change à un adulte.",
    "ar": "أحيط الصورة المختلفة وأشرح الفرق لشخص بالغ.",
    "en": "Circle the different picture and explain what changes."
  },
  "oddOneOutSets": [
    {
      "items": [
        "face:happy",
        "face:happy",
        "face:sad",
        "face:happy"
      ],
      "oddIndex": 2
    },
    {
      "items": [
        "face:happy",
        "face:sad",
        "face:happy",
        "face:happy"
      ],
      "oddIndex": 1
    },
    {
      "items": [
        "face:sad",
        "face:happy",
        "face:happy",
        "face:happy"
      ],
      "oddIndex": 0
    }
  ]
},
{
  "id": "coloring-fennec",
  "category": "coloriage",
  "kind": "coloring_page",
  "headerIcon": "🖍️",
  "titleI18n": {
    "fr": "Le Fennec du Sahara",
    "ar": "فنك الصحراء",
    "en": "Sahara Fennec"
  },
  "instructionI18n": {
    "fr": "Colorie les grandes zones et ajoute ton décor.",
    "ar": "ألوّن المساحات وأضيف زينة من خيالي.",
    "en": "Color the large areas and add your own scenery."
  },
  "coloringShapeId": "fennec"
},
{
  "id": "coloring-flag_dz",
  "category": "coloriage",
  "kind": "coloring_page",
  "headerIcon": "🖍️",
  "titleI18n": {
    "fr": "Le Drapeau algérien",
    "ar": "العلم الجزائري",
    "en": "Algerian Flag"
  },
  "instructionI18n": {
    "fr": "Colorie la moitié gauche en vert, le croissant et l’étoile en rouge. Garde la moitié droite blanche.",
    "ar": "ألوّن النصف الأيسر بالأخضر والهلال والنجمة بالأحمر، وأترك النصف الأيمن أبيض.",
    "en": "Color the left half green and the crescent and star red. Leave the right half white."
  },
  "coloringShapeId": "flag_dz"
},
{
  "id": "coloring-palm",
  "category": "coloriage",
  "kind": "coloring_page",
  "headerIcon": "🖍️",
  "titleI18n": {
    "fr": "Le Palmier de l’oasis",
    "ar": "نخلة الواحة",
    "en": "Oasis Palm Tree"
  },
  "instructionI18n": {
    "fr": "Colorie les grandes zones et ajoute ton décor.",
    "ar": "ألوّن المساحات وأضيف زينة من خيالي.",
    "en": "Color the large areas and add your own scenery."
  },
  "coloringShapeId": "palm"
}
];

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  PenTool,
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  Award,
  ArrowRight,
  ArrowLeft,
  Printer,
  Eye,
  Hand,
  Trophy,
  Layers,
  Palette,
  Undo2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Star,
  Check,
  RefreshCw,
} from 'lucide-react';
import { PrimaryGrade } from '../types';

interface TouchWritingStudioProps {
  grade?: PrimaryGrade;
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

export type WritingLanguage = 'ar' | 'fr' | 'en' | 'ber';
export type BoardTheme = 'seyes' | 'blackboard' | 'wood' | 'neon';
export type PedagogicalStep = 'watch' | 'guide' | 'challenge';

interface LetterData {
  id: string;
  char: string;
  name: string;
  phonics: string;
  exampleWord: string;
  exampleTranslation: string;
  icon: string;
  strokeHintAr: string;
  strokeHintFr: string;
  strokesSvg: string[]; // SVG path for each stroke in sequence
  dots: { x: number; y: number; order: number }[]; // Key control points (0-300 coordinates)
  direction: 'rtl' | 'ltr';
}

// -------------------------------------------------------------
// CURRICULUM LETTERS & NUMBERS DATA
// -------------------------------------------------------------

// 1. ARABIC (1AP & 2AP) - All 28 Letters & Official Numbers
const ARABIC_ITEMS: LetterData[] = [
  {
    id: 'ar_alif',
    char: 'أ',
    name: 'أَلِف',
    phonics: '/ʔa/ أَ',
    exampleWord: 'أَسَدٌ',
    exampleTranslation: 'Lion (أَسَد)',
    icon: '🦁',
    strokeHintAr: 'ارسم خطاً عمودياً مستقيماً من الأعلى إلى الأسفل (1)، ثم ارسم الهمزة كشكل نصف دائري فوقه (2).',
    strokeHintFr: 'Trace une ligne verticale de haut en bas (1), puis ajoute la hamza au-dessus (2).',
    strokesSvg: ['M 150, 70 L 150, 210', 'M 160, 45 C 160, 35 140, 35 140, 45 L 160, 55'],
    dots: [{ x: 150, y: 70, order: 1 }, { x: 150, y: 140, order: 2 }, { x: 150, y: 210, order: 3 }, { x: 155, y: 45, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_baa',
    char: 'ب',
    name: 'بَاء',
    phonics: '/b/ بَ',
    exampleWord: 'بَابٌ',
    exampleTranslation: 'Porte (بَاب)',
    icon: '🚪',
    strokeHintAr: 'انزل من اليمين نحو سطر الكتابة (1)، ثم اتجه أفقياً نحو اليسار واصعد قليلاً (2)، وضع النقطة في الأسفل (3).',
    strokeHintFr: 'Descends de droite vers la ligne (1), va vers la gauche puis remonte (2), place le point en dessous (3).',
    strokesSvg: ['M 215, 140 C 215, 175 190, 180 150, 180 C 110, 180 85, 175 85, 140', 'M 150, 205 L 150, 207'],
    dots: [{ x: 215, y: 140, order: 1 }, { x: 180, y: 180, order: 2 }, { x: 120, y: 180, order: 3 }, { x: 85, y: 140, order: 4 }, { x: 150, y: 205, order: 5 }],
    direction: 'rtl',
  },
  {
    id: 'ar_taa',
    char: 'ت',
    name: 'تَاء',
    phonics: '/t/ تَ',
    exampleWord: 'تَمْرٌ',
    exampleTranslation: 'Dattes de Biskra (تَمْر)',
    icon: '🌴',
    strokeHintAr: 'ارسم الصحن مثل الباء تماماً (1)، ثم ضع نقطتين متجاورتين في الأعلى (2 و 3).',
    strokeHintFr: 'Trace la cuvette comme la lettre Baa (1), puis place deux points au-dessus (2).',
    strokesSvg: ['M 215, 140 C 215, 175 190, 180 150, 180 C 110, 180 85, 175 85, 140', 'M 140, 125 L 140, 127', 'M 160, 125 L 160, 127'],
    dots: [{ x: 215, y: 140, order: 1 }, { x: 150, y: 180, order: 2 }, { x: 85, y: 140, order: 3 }, { x: 140, y: 125, order: 4 }, { x: 160, y: 125, order: 5 }],
    direction: 'rtl',
  },
  {
    id: 'ar_thaa',
    char: 'ث',
    name: 'ثَاء',
    phonics: '/θ/ ثَ',
    exampleWord: 'ثَعْلَبٌ',
    exampleTranslation: 'Renard / Fennec (ثَعْلَب)',
    icon: '🦊',
    strokeHintAr: 'ارسم الصحن على السطر (1)، ثم ضع ثلاث نقاط في الأعلى على شكل مثلث (2، 3، 4).',
    strokeHintFr: 'Trace la cuvette (1), puis place trois points en triangle au-dessus (2).',
    strokesSvg: ['M 215, 140 C 215, 175 190, 180 150, 180 C 110, 180 85, 175 85, 140', 'M 140, 125 L 140, 127', 'M 160, 125 L 160, 127', 'M 150, 110 L 150, 112'],
    dots: [{ x: 215, y: 140, order: 1 }, { x: 150, y: 180, order: 2 }, { x: 85, y: 140, order: 3 }, { x: 150, y: 110, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_jeem',
    char: 'ج',
    name: 'جِيم',
    phonics: '/dʒ/ جَ',
    exampleWord: 'جَمَلٌ',
    exampleTranslation: 'Dromadaire du Sahara (جَمَل)',
    icon: '🐪',
    strokeHintAr: 'ارسم الرأس الموجي المائل من اليسار لليمين (1)، ثم انزل بنصف دائرة كبرى للأسفل (2) وضع نقطة في الوسط (3).',
    strokeHintFr: 'Trace le chapeau ondulé (1), puis descends en formant un grand ventre (2) avec un point au milieu (3).',
    strokesSvg: ['M 110, 100 C 140, 90 170, 90 200, 100', 'M 200, 100 C 210, 140 180, 200 130, 200 C 90, 200 80, 170 85, 150', 'M 145, 150 L 145, 152'],
    dots: [{ x: 110, y: 100, order: 1 }, { x: 200, y: 100, order: 2 }, { x: 180, y: 160, order: 3 }, { x: 130, y: 200, order: 4 }, { x: 145, y: 150, order: 5 }],
    direction: 'rtl',
  },
  {
    id: 'ar_haa',
    char: 'ح',
    name: 'حَاء',
    phonics: '/ħ/ حَ',
    exampleWord: 'حَلِيبٌ',
    exampleTranslation: 'Lait frais (حَلِيب)',
    icon: '🥛',
    strokeHintAr: 'ارسم الرأس الموجي (1)، ثم استدر بنصف دائرة كبرى للبطن دون نقاط (2).',
    strokeHintFr: 'Trace le chapeau ondulé (1), puis descends en grand ventre sans aucun point (2).',
    strokesSvg: ['M 110, 100 C 140, 90 170, 90 200, 100', 'M 200, 100 C 210, 140 180, 200 130, 200 C 90, 200 80, 170 85, 150'],
    dots: [{ x: 110, y: 100, order: 1 }, { x: 200, y: 100, order: 2 }, { x: 180, y: 160, order: 3 }, { x: 130, y: 200, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_khaa',
    char: 'خ',
    name: 'خَاء',
    phonics: '/x/ خَ',
    exampleWord: 'خُبْزٌ',
    exampleTranslation: 'Pain traditionnel (خُبْز)',
    icon: '🥖',
    strokeHintAr: 'ارسم الرأس والبطن (1 و 2)، ثم ضع نقطة فوق الرأس في الأعلى (3).',
    strokeHintFr: 'Trace le chapeau et le ventre (1, 2), puis place un point au-dessus (3).',
    strokesSvg: ['M 110, 100 C 140, 90 170, 90 200, 100', 'M 200, 100 C 210, 140 180, 200 130, 200 C 90, 200 80, 170 85, 150', 'M 155, 75 L 155, 77'],
    dots: [{ x: 110, y: 100, order: 1 }, { x: 200, y: 100, order: 2 }, { x: 130, y: 200, order: 3 }, { x: 155, y: 75, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_daal',
    char: 'د',
    name: 'دَال',
    phonics: '/d/ دَ',
    exampleWord: 'دِيدُو',
    exampleTranslation: 'Didou le fennec (دِيدُو)',
    icon: '🦊',
    strokeHintAr: 'انزل بميلان لطيف نحو سطر الكتابة (1)، ثم امتد أفقياً على السطر نحو اليسار (2).',
    strokeHintFr: 'Descends en biais vers la ligne (1), puis trace horizontalement vers la gauche (2).',
    strokesSvg: ['M 180, 110 C 170, 150 150, 175 140, 175 L 100, 175'],
    dots: [{ x: 180, y: 110, order: 1 }, { x: 140, y: 175, order: 2 }, { x: 100, y: 175, order: 3 }],
    direction: 'rtl',
  },
  {
    id: 'ar_dhaal',
    char: 'ذ',
    name: 'ذَال',
    phonics: '/ð/ ذَ',
    exampleWord: 'ذُرَةٌ',
    exampleTranslation: 'Maïs doré (ذُرَة)',
    icon: '🌽',
    strokeHintAr: 'ارسم الدال بميلان وامتداد أفقي (1)، ثم ضع نقطة واحدة فوقه (2).',
    strokeHintFr: 'Trace la lettre Daal (1), puis place un point au-dessus (2).',
    strokesSvg: ['M 180, 110 C 170, 150 150, 175 140, 175 L 100, 175', 'M 160, 90 L 160, 92'],
    dots: [{ x: 180, y: 110, order: 1 }, { x: 100, y: 175, order: 2 }, { x: 160, y: 90, order: 3 }],
    direction: 'rtl',
  },
  {
    id: 'ar_raa',
    char: 'ر',
    name: 'رَاء',
    phonics: '/r/ رَ',
    exampleWord: 'رَمْلٌ',
    exampleTranslation: 'Sable doré (رَمْل)',
    icon: '🏜️',
    strokeHintAr: 'سن صغير فوق السطر (1)، ثم انزلاق قوسي كالهلال تحت سطر الكتابة (2).',
    strokeHintFr: 'Petite encoche au-dessus de la ligne (1), puis glisse en arc de cercle sous la ligne (2).',
    strokesSvg: ['M 175, 135 L 165, 155 C 155, 185 130, 205 105, 205'],
    dots: [{ x: 175, y: 135, order: 1 }, { x: 165, y: 155, order: 2 }, { x: 140, y: 190, order: 3 }, { x: 105, y: 205, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_zay',
    char: 'ز',
    name: 'زَاي',
    phonics: '/z/ زَ',
    exampleWord: 'زَيْتُونٌ',
    exampleTranslation: 'Olives de Kabylie (زَيْتُون)',
    icon: '🫒',
    strokeHintAr: 'ارسم الراء المنزلقة تحت السطر (1)، ثم ضع نقطة فوقها في الأعلى (2).',
    strokeHintFr: 'Trace la lettre Raa glissante (1), puis ajoute un point au-dessus (2).',
    strokesSvg: ['M 175, 135 L 165, 155 C 155, 185 130, 205 105, 205', 'M 170, 115 L 170, 117'],
    dots: [{ x: 175, y: 135, order: 1 }, { x: 105, y: 205, order: 2 }, { x: 170, y: 115, order: 3 }],
    direction: 'rtl',
  },
  {
    id: 'ar_seen',
    char: 'س',
    name: 'سِين',
    phonics: '/s/ سَ',
    exampleWord: 'سَمَكٌ',
    exampleTranslation: 'Poisson de Méditerranée (سَمَك)',
    icon: '🐟',
    strokeHintAr: 'ارسم الأسنان الثلاثة الصغيرة على السطر (1 و 2)، ثم انزل بكأس نصف دائري عميق تحت السطر (3).',
    strokeHintFr: 'Trace les deux petites dents sur la ligne (1, 2), puis descends avec la grande coupe (3).',
    strokesSvg: ['M 210, 140 C 205, 160 190, 160 185, 140', 'M 185, 140 C 180, 160 165, 160 160, 140', 'M 160, 140 C 160, 190 120, 205 95, 185 C 80, 165 90, 145 95, 145'],
    dots: [{ x: 210, y: 140, order: 1 }, { x: 185, y: 140, order: 2 }, { x: 160, y: 140, order: 3 }, { x: 130, y: 200, order: 4 }, { x: 95, y: 160, order: 5 }],
    direction: 'rtl',
  },
  {
    id: 'ar_sheen',
    char: 'ش',
    name: 'شِين',
    phonics: '/ʃ/ شَ',
    exampleWord: 'شَمْسٌ',
    exampleTranslation: 'Soleil d’Algérie (شَمْس)',
    icon: '☀️',
    strokeHintAr: 'ارسم السين بأسنانها وكأسها (1)، ثم ضع ثلاث نقاط فوقها كمثلث (2).',
    strokeHintFr: 'Trace la lettre Seen (1), puis ajoute 3 points en triangle au-dessus (2).',
    strokesSvg: ['M 210, 140 C 205, 160 190, 160 185, 140', 'M 185, 140 C 180, 160 165, 160 160, 140', 'M 160, 140 C 160, 190 120, 205 95, 185', 'M 175, 120 L 175, 122', 'M 195, 120 L 195, 122', 'M 185, 105 L 185, 107'],
    dots: [{ x: 210, y: 140, order: 1 }, { x: 185, y: 140, order: 2 }, { x: 160, y: 140, order: 3 }, { x: 95, y: 185, order: 4 }, { x: 185, y: 105, order: 5 }],
    direction: 'rtl',
  },
  {
    id: 'ar_saad',
    char: 'ص',
    name: 'صَاد',
    phonics: '/sˤ/ صَ',
    exampleWord: 'صَقْرٌ',
    exampleTranslation: 'Faucon royal (صَقْر)',
    icon: '🦅',
    strokeHintAr: 'اصعد ببيضة مائلة للأعلى يميناً ثم عد للسطر وسن صغيرة (1)، ثم انزل بكأس الصاد العميقة (2).',
    strokeHintFr: 'Trace la boucle ovale puis la petite dent (1), et descends en grand bol (2).',
    strokesSvg: ['M 160, 165 C 160, 135 210, 135 210, 165 L 140, 165 L 140, 150 L 140, 165', 'M 140, 165 C 140, 205 90, 205 90, 165'],
    dots: [{ x: 160, y: 165, order: 1 }, { x: 200, y: 140, order: 2 }, { x: 140, y: 150, order: 3 }, { x: 90, y: 180, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_daad',
    char: 'ض',
    name: 'ضَاد',
    phonics: '/dˤ/ ضَ',
    exampleWord: 'ضِفْدَعٌ',
    exampleTranslation: 'Grenouille (ضِفْدَع)',
    icon: '🐸',
    strokeHintAr: 'ارسم الصاد تماماً (1)، ثم ضع نقطة واحدة فوق الرأس البيضاوي (2).',
    strokeHintFr: 'Trace la lettre Saad (1), puis place un point au-dessus (2).',
    strokesSvg: ['M 160, 165 C 160, 135 210, 135 210, 165 L 140, 165 L 140, 150 L 140, 165', 'M 140, 165 C 140, 205 90, 205 90, 165', 'M 180, 125 L 180, 127'],
    dots: [{ x: 160, y: 165, order: 1 }, { x: 140, y: 150, order: 2 }, { x: 90, y: 180, order: 3 }, { x: 180, y: 125, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_taa_emph',
    char: 'ط',
    name: 'طَاء',
    phonics: '/tˤ/ طَ',
    exampleWord: 'طَمَاطِمُ',
    exampleTranslation: 'Tomates (طَمَاطِم)',
    icon: '🍅',
    strokeHintAr: 'ارسم البيضة المستقرة على السطر (1)، ثم انزل بألف عمودية قائمة على مؤخرتها (2).',
    strokeHintFr: 'Trace la boucle ovale (1), puis fais descendre une hampe verticale droite dessus (2).',
    strokesSvg: ['M 140, 165 C 140, 135 200, 135 200, 165 L 110, 165', 'M 185, 80 L 185, 165'],
    dots: [{ x: 140, y: 165, order: 1 }, { x: 190, y: 140, order: 2 }, { x: 110, y: 165, order: 3 }, { x: 185, y: 80, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_zaa_emph',
    char: 'ظ',
    name: 'ظَاء',
    phonics: '/ðˤ/ ظَ',
    exampleWord: 'ظَرْفٌ',
    exampleTranslation: 'Enveloppe / Lettre (ظَرْف)',
    icon: '✉️',
    strokeHintAr: 'ارسم الطاء مع عصاها القائمة (1 و 2)، ثم ضع نقطة بجوار العصا في الأعلى (3).',
    strokeHintFr: 'Trace la lettre Taa emphatique (1, 2), puis ajoute un point en haut à droite (3).',
    strokesSvg: ['M 140, 165 C 140, 135 200, 135 200, 165 L 110, 165', 'M 185, 80 L 185, 165', 'M 165, 95 L 165, 97'],
    dots: [{ x: 140, y: 165, order: 1 }, { x: 110, y: 165, order: 2 }, { x: 185, y: 80, order: 3 }, { x: 165, y: 95, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_ayn',
    char: 'ع',
    name: 'عَيْن',
    phonics: '/ʕ/ عَ',
    exampleWord: 'عَسَلٌ',
    exampleTranslation: 'Miel pur (عَسَل)',
    icon: '🍯',
    strokeHintAr: 'ارسم نصف دائرة علوية كالهلال المفتوح لليمين (1)، ثم انزل ببطن واسع دائري تحت السطر (2).',
    strokeHintFr: 'Trace un petit croissant au-dessus de la ligne (1), puis un grand ventre rond en dessous (2).',
    strokesSvg: ['M 150, 135 C 180, 115 180, 95 150, 95 C 130, 95 125, 110 130, 135', 'M 130, 135 C 190, 145 190, 205 130, 205 C 90, 205 85, 175 90, 160'],
    dots: [{ x: 150, y: 95, order: 1 }, { x: 130, y: 135, order: 2 }, { x: 180, y: 175, order: 3 }, { x: 110, y: 200, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_ghayn',
    char: 'غ',
    name: 'غَيْن',
    phonics: '/ɣ/ غَ',
    exampleWord: 'غَزَالٌ',
    exampleTranslation: 'Gazelle du désert (غَزَال)',
    icon: '🦌',
    strokeHintAr: 'ارسم العين برأسها وبطنها (1 و 2)، ثم ضع نقطة فوق الرأس (3).',
    strokeHintFr: 'Trace la lettre Ayn (1, 2), puis ajoute un point au-dessus (3).',
    strokesSvg: ['M 150, 135 C 180, 115 180, 95 150, 95 C 130, 95 125, 110 130, 135', 'M 130, 135 C 190, 145 190, 205 130, 205 C 90, 205 85, 175 90, 160', 'M 160, 80 L 160, 82'],
    dots: [{ x: 150, y: 95, order: 1 }, { x: 130, y: 135, order: 2 }, { x: 110, y: 200, order: 3 }, { x: 160, y: 80, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_faa',
    char: 'ف',
    name: 'فَاء',
    phonics: '/f/ فَ',
    exampleWord: 'فَرَاشَةٌ',
    exampleTranslation: 'Papillon multicolore (فَرَاشَة)',
    icon: '🦋',
    strokeHintAr: 'ارسم حلقة دائرية برأس مرفوع على عنق قصير (1)، ثم اتجه أفقياً كصحن الباء (2) وضع نقطة فوقه (3).',
    strokeHintFr: 'Fais une petite boucle ronde sur un col (1), étire la cuvette sur la ligne (2), et place un point (3).',
    strokesSvg: ['M 190, 145 C 190, 125 170, 125 170, 145 C 170, 155 190, 155 190, 145 L 180, 165 C 180, 175 140, 175 100, 175 L 100, 150', 'M 180, 115 L 180, 117'],
    dots: [{ x: 180, y: 135, order: 1 }, { x: 180, y: 165, order: 2 }, { x: 100, y: 165, order: 3 }, { x: 180, y: 115, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_qaaf',
    char: 'ق',
    name: 'قَاف',
    phonics: '/q/ قَ',
    exampleWord: 'قَمَرٌ',
    exampleTranslation: 'Lune brillante (قَمَر)',
    icon: '🌙',
    strokeHintAr: 'ارسم الرأس الدائري (1)، ثم انزل بكأس عميق تحت السطر كحرف النون (2) مع نقطتين في الأعلى (3).',
    strokeHintFr: 'Trace la boucle ronde (1), descends en bol profond sous la ligne (2), et mets deux points (3).',
    strokesSvg: ['M 190, 135 C 190, 120 170, 120 170, 135 C 170, 145 190, 145 190, 135 L 180, 150 C 180, 195 120, 205 95, 175', 'M 170, 105 L 170, 107', 'M 190, 105 L 190, 107'],
    dots: [{ x: 180, y: 130, order: 1 }, { x: 180, y: 160, order: 2 }, { x: 95, y: 175, order: 3 }, { x: 170, y: 105, order: 4 }, { x: 190, y: 105, order: 5 }],
    direction: 'rtl',
  },
  {
    id: 'ar_kaaf',
    char: 'ك',
    name: 'كَاف',
    phonics: '/k/ كَ',
    exampleWord: 'كِتَابٌ',
    exampleTranslation: 'Livre scolaire (كِتَاب)',
    icon: '📚',
    strokeHintAr: 'انزل بألف طويلة مائلة قليلاً للسطر (1)، ثم امتد أفقياً واصعد بسن خفيفة (2)، وضع الكاف الصغيرة بالداخل (3).',
    strokeHintFr: 'Descends une longue hampe (1), va vers la gauche (2), puis trace la petite boucle interne (3).',
    strokesSvg: ['M 180, 75 L 180, 170 L 110, 170 L 110, 150', 'M 150, 135 C 155, 125 140, 125 140, 135 L 155, 145'],
    dots: [{ x: 180, y: 75, order: 1 }, { x: 180, y: 170, order: 2 }, { x: 110, y: 170, order: 3 }, { x: 145, y: 135, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_laam',
    char: 'ل',
    name: 'لَام',
    phonics: '/l/ لَ',
    exampleWord: 'لَيْمُونٌ',
    exampleTranslation: 'Citron jaune (لَيْمُون)',
    icon: '🍋',
    strokeHintAr: 'انزل بألف طويلة مستقيمة (1)، ثم استدر بنصف دائرة كعكاز المظلة تحت السطر واصعد قليلاً (2).',
    strokeHintFr: 'Descends une longue ligne droite (1), puis arrondis en forme de canne sous la ligne (2).',
    strokesSvg: ['M 175, 75 L 175, 160 C 175, 200 120, 200 110, 165'],
    dots: [{ x: 175, y: 75, order: 1 }, { x: 175, y: 160, order: 2 }, { x: 145, y: 200, order: 3 }, { x: 110, y: 165, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_meem',
    char: 'م',
    name: 'مِيم',
    phonics: '/m/ مَ',
    exampleWord: 'مَسِيدٌ',
    exampleTranslation: 'Mssid / École (مَسِيد)',
    icon: '🏫',
    strokeHintAr: 'ارسم رأس الميم الدائري فوق السطر (1)، ثم اتجه يساراً وانزل بالذيل عمودياً تحت السطر (2).',
    strokeHintFr: 'Trace la tête ronde au-dessus de la ligne (1), puis descends droit sous la ligne (2).',
    strokesSvg: ['M 175, 140 C 175, 125 155, 125 155, 140 C 155, 155 175, 155 175, 140 L 130, 140 L 130, 210'],
    dots: [{ x: 175, y: 140, order: 1 }, { x: 155, y: 130, order: 2 }, { x: 130, y: 140, order: 3 }, { x: 130, y: 210, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_noon',
    char: 'ن',
    name: 'نُون',
    phonics: '/n/ نَ',
    exampleWord: 'نَخْلَةٌ',
    exampleTranslation: 'Palmier majestueux (نَخْلَة)',
    icon: '🌴',
    strokeHintAr: 'انزل بكأس نصف دائري عميق تحت سطر الكتابة (1)، ثم ضع نقطة واحدة في وسطه من الأعلى (2).',
    strokeHintFr: 'Trace un grand bol rond sous la ligne (1), puis place un point au centre (2).',
    strokesSvg: ['M 190, 140 C 190, 200 110, 200 110, 140', 'M 150, 145 L 150, 147'],
    dots: [{ x: 190, y: 140, order: 1 }, { x: 150, y: 200, order: 2 }, { x: 110, y: 140, order: 3 }, { x: 150, y: 145, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_haa_round',
    char: 'هـ',
    name: 'هَاء',
    phonics: '/h/ هَ',
    exampleWord: 'هِلَالٌ',
    exampleTranslation: 'Croissant lunaire (هِلَال)',
    icon: '🌙',
    strokeHintAr: 'ارسم نصف دائرة كبرى (1)، وبداخلها دائرة صغيرة تدور وتخرج على السطر نحو اليسار (2).',
    strokeHintFr: 'Trace une grande boucle avec un petit rond à l\'intérieur qui repart à gauche (1, 2).',
    strokesSvg: ['M 190, 165 C 190, 120 135, 120 135, 165 L 110, 165', 'M 170, 150 C 170, 135 150, 135 150, 150 C 150, 165 170, 165 170, 150'],
    dots: [{ x: 190, y: 165, order: 1 }, { x: 160, y: 125, order: 2 }, { x: 150, y: 150, order: 3 }, { x: 110, y: 165, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_waaw',
    char: 'و',
    name: 'وَاو',
    phonics: '/w/ وَ',
    exampleWord: 'وَرْدَةٌ',
    exampleTranslation: 'Rose parfumée (وَرْدَة)',
    icon: '🌹',
    strokeHintAr: 'ارسم رأساً دائرياً صغيراً فوق السطر (1)، ثم انزلق بجسم مقوس تحت السطر كالراء (2).',
    strokeHintFr: 'Fais une petite tête ronde au-dessus (1), puis glisse en courbe sous la ligne (2).',
    strokesSvg: ['M 175, 140 C 175, 125 155, 125 155, 140 C 155, 150 175, 150 175, 140 L 160, 165 C 150, 190 120, 205 100, 205'],
    dots: [{ x: 175, y: 140, order: 1 }, { x: 155, y: 130, order: 2 }, { x: 140, y: 185, order: 3 }, { x: 100, y: 205, order: 4 }],
    direction: 'rtl',
  },
  {
    id: 'ar_yaa',
    char: 'ي',
    name: 'يَاء',
    phonics: '/j/ يَ',
    exampleWord: 'يَدٌ',
    exampleTranslation: 'Main (يَد)',
    icon: '✋',
    strokeHintAr: 'ارسم الرأس المقوس كالبطة فوق السطر (1)، ثم بطناً واسعاً تحت السطر (2) ونقطتين في الأسفل (3).',
    strokeHintFr: 'Trace la tête en col de cygne (1), le grand ventre en dessous (2) avec deux points (3).',
    strokesSvg: ['M 180, 130 C 180, 115 155, 115 155, 135 C 155, 155 185, 155 175, 180 C 165, 205 115, 205 105, 175', 'M 135, 220 L 135, 222', 'M 155, 220 L 155, 222'],
    dots: [{ x: 180, y: 120, order: 1 }, { x: 155, y: 140, order: 2 }, { x: 140, y: 200, order: 3 }, { x: 105, y: 175, order: 4 }, { x: 145, y: 220, order: 5 }],
    direction: 'rtl',
  },
  // Arabic Numerals 0 to 9
  {
    id: 'num_0',
    char: '0',
    name: 'صِفْر (0)',
    phonics: '/sˤifr/ 0',
    exampleWord: 'صِفْرٌ ⭕',
    exampleTranslation: 'Zéro',
    icon: '⭕',
    strokeHintAr: 'ارسم نقطة أو دائرة بيضاوية مغلقة (1).',
    strokeHintFr: 'Trace un ovale fermé (1).',
    strokesSvg: ['M 150, 110 C 170, 110 170, 180 150, 180 C 130, 180 130, 110 150, 110 Z'],
    dots: [{ x: 150, y: 110, order: 1 }, { x: 170, y: 145, order: 2 }, { x: 150, y: 180, order: 3 }, { x: 130, y: 145, order: 4 }],
    direction: 'ltr',
  },
  {
    id: 'num_1',
    char: '1',
    name: 'وَاحِد (1)',
    phonics: '/waː.ħid/ 1',
    exampleWord: 'وَطَنٌ وَاحِدٌ 🇩🇿',
    exampleTranslation: 'Une seule patrie',
    icon: '🇩🇿',
    strokeHintAr: 'اصعد بميلان صغير لقمة الرأس (1)، ثم انزل بخط عمودي مستقيم نحو القاعدة (2).',
    strokeHintFr: 'Monte en diagonale vers le sommet (1), puis descends bien droit jusqu\'en bas (2).',
    strokesSvg: ['M 120, 95 L 150, 75 L 150, 210'],
    dots: [{ x: 120, y: 95, order: 1 }, { x: 150, y: 75, order: 2 }, { x: 150, y: 210, order: 3 }],
    direction: 'ltr',
  },
  {
    id: 'num_2',
    char: '2',
    name: 'اِثْنَان (2)',
    phonics: '/iθ.naːn/ 2',
    exampleWord: 'عَيْنَانِ اثْنَتَانِ 👁️',
    exampleTranslation: 'Deux yeux',
    icon: '✌️',
    strokeHintAr: 'قوس علوي من اليسار لليمين (1)، ثم انحدار مائل لليسار (2)، ثم خط أفقي على السطر (3).',
    strokeHintFr: 'Arc supérieur (1), descente oblique (2), puis base horizontale (3).',
    strokesSvg: ['M 120, 110 C 120, 75 180, 75 180, 115 C 180, 155 120, 185 120, 205 L 180, 205'],
    dots: [{ x: 120, y: 110, order: 1 }, { x: 150, y: 75, order: 2 }, { x: 180, y: 115, order: 3 }, { x: 120, y: 205, order: 4 }, { x: 180, y: 205, order: 5 }],
    direction: 'ltr',
  },
  {
    id: 'num_5',
    char: '5',
    name: 'خَمْسَة (5)',
    phonics: '/xam.sah/ 5',
    exampleWord: 'خَمْسَةُ أَرَكَانٍ',
    exampleTranslation: 'Cinq piliers',
    icon: '⭐',
    strokeHintAr: 'ارسم خطاً أفقياً علوياً (1)، ثم خطاً قصيراً للأسفل (2)، ثم قبة دائرية واسعة (3).',
    strokeHintFr: 'Ligne horizontale en haut (1), petite descente (2), puis grand demi-cercle (3).',
    strokesSvg: ['M 175, 75 L 135, 75 L 130, 130 C 145, 120 175, 125 175, 165 C 175, 205 130, 205 115, 190'],
    dots: [{ x: 175, y: 75, order: 1 }, { x: 135, y: 75, order: 2 }, { x: 130, y: 130, order: 3 }, { x: 175, y: 165, order: 4 }, { x: 115, y: 190, order: 5 }],
    direction: 'ltr',
  },
];

// 2. FRENCH CURSIVE (3AP) - Seyès Interlines Progression
const FRENCH_ITEMS: LetterData[] = [
  {
    id: 'fr_a',
    char: 'a',
    name: 'Lettre a (cursive)',
    phonics: '/a/ comme Ananas',
    exampleWord: 'ami',
    exampleTranslation: 'صديق مخلص',
    icon: '🤝',
    strokeHintAr: 'ابدأ بالدائرة من الأعلى نحو اليسار على السطر (1)، ثم انزل بخط عمودي مع سن صغير للربط (2).',
    strokeHintFr: 'Trace le rond en tournant vers la gauche sur 1 interligne (1), puis la canne qui descend (2).',
    strokesSvg: ['M 170, 130 C 150, 120 120, 135 120, 160 C 120, 185 150, 190 170, 175', 'M 170, 130 L 170, 180 C 170, 185 180, 185 185, 180'],
    dots: [{ x: 170, y: 130, order: 1 }, { x: 120, y: 160, order: 2 }, { x: 150, y: 190, order: 3 }, { x: 170, y: 130, order: 4 }, { x: 170, y: 180, order: 5 }],
    direction: 'ltr',
  },
  {
    id: 'fr_l',
    char: 'l',
    name: 'Lettre l (grande boucle)',
    phonics: '/l/ comme Livre',
    exampleWord: 'livre',
    exampleTranslation: 'كتاب القراءة',
    icon: '📖',
    strokeHintAr: 'اصعد بلفة مائلة واسعة حتى السطر الثالث العلوي (+3) (1)، ثم انزل مستقيماً مع خطاف الربط (2).',
    strokeHintFr: 'Monte en boucle jusqu\'au 3e interligne (+3) (1), puis descends tout droit jusqu\'à la ligne (2).',
    strokesSvg: ['M 115, 180 C 135, 160 160, 80 155, 60 C 150, 50 140, 60 135, 90 L 135, 175 C 135, 185 150, 185 160, 180'],
    dots: [{ x: 115, y: 180, order: 1 }, { x: 155, y: 60, order: 2 }, { x: 135, y: 120, order: 3 }, { x: 135, y: 180, order: 4 }, { x: 160, y: 180, order: 5 }],
    direction: 'ltr',
  },
  {
    id: 'fr_m',
    char: 'm',
    name: 'Lettre m (trois ponts)',
    phonics: '/m/ comme Maman',
    exampleWord: 'maman',
    exampleTranslation: 'الأم الحنونة',
    icon: '🤱',
    strokeHintAr: 'ارسم ثلاثة جسور متتالية متناسقة الارتفاع (1 interligne) ثم اختم بذراع الوصل.',
    strokeHintFr: 'Trace 3 ponts réguliers qui touchent le 1er interligne (1, 2, 3) avec une petite canne.',
    strokesSvg: ['M 100, 150 C 105, 130 120, 130 125, 150 L 125, 180 M 125, 150 C 130, 130 145, 130 150, 150 L 150, 180 M 150, 150 C 155, 130 170, 130 175, 150 L 175, 178 C 175, 185 185, 185 190, 180'],
    dots: [{ x: 100, y: 150, order: 1 }, { x: 125, y: 130, order: 2 }, { x: 125, y: 180, order: 3 }, { x: 150, y: 130, order: 4 }, { x: 175, y: 130, order: 5 }, { x: 190, y: 180, order: 6 }],
    direction: 'ltr',
  },
  {
    id: 'fr_p',
    char: 'p',
    name: 'Lettre p (jambage bas -2)',
    phonics: '/p/ comme Papillon',
    exampleWord: 'porte',
    exampleTranslation: 'باب المدرسة',
    icon: '🦋',
    strokeHintAr: 'اصعد بخط مائل للسطر الأول (1)، ثم انزل مستقيماً لخطين تحت السطر (-2) (2)، ثم ارسم القوس الصغير (3).',
    strokeHintFr: 'Monte comme un 1 (1), descends tout droit 2 lignes en bas (-2) (2), puis fais un pont (3).',
    strokesSvg: ['M 115, 160 L 135, 130 L 135, 230 M 135, 145 C 145, 130 170, 130 170, 155 C 170, 175 145, 180 135, 180 C 145, 180 160, 180 175, 180'],
    dots: [{ x: 115, y: 160, order: 1 }, { x: 135, y: 130, order: 2 }, { x: 135, y: 230, order: 3 }, { x: 170, y: 155, order: 4 }, { x: 175, y: 180, order: 5 }],
    direction: 'ltr',
  },
  {
    id: 'fr_e_accent',
    char: 'é',
    name: 'Lettre é (accent aigu)',
    phonics: '/e/ comme École',
    exampleWord: 'école',
    exampleTranslation: 'مدرسة النجاح',
    icon: '🏫',
    strokeHintAr: 'ارسم حلقة حرف e في السطر الأول (1)، ثم ضع الشدّة المائلة من اليمين نحو اليسار (2).',
    strokeHintFr: 'Fais la petite boucle du "e" (1), puis ajoute l\'accent aigu qui monte de gauche à droite (2).',
    strokesSvg: ['M 120, 160 L 170, 160 C 170, 135 130, 135 125, 160 C 120, 185 160, 185 175, 175', 'M 155, 110 L 140, 125'],
    dots: [{ x: 120, y: 160, order: 1 }, { x: 150, y: 135, order: 2 }, { x: 125, y: 160, order: 3 }, { x: 175, y: 175, order: 4 }, { x: 155, y: 110, order: 5 }],
    direction: 'ltr',
  },
];

// 3. ENGLISH SCRIPT & PHONICS (4AP & 5AP)
const ENGLISH_ITEMS: LetterData[] = [
  {
    id: 'en_A',
    char: 'A',
    name: 'Capital A (Print)',
    phonics: '/æ/ like Apple',
    exampleWord: 'Apple',
    exampleTranslation: 'تفاحة حمراء لديدو 🍎',
    icon: '🍎',
    strokeHintAr: 'انزل بميلان من القمة لليسار (1)، ثم من القمة لليمين (2)، ثم ارسم الجسر في المنتصف (3).',
    strokeHintFr: 'Trace la barre oblique gauche (1), la droite (2), puis le pont au milieu (3).',
    strokesSvg: ['M 150, 60 L 105, 200', 'M 150, 60 L 195, 200', 'M 120, 145 L 180, 145'],
    dots: [{ x: 150, y: 60, order: 1 }, { x: 105, y: 200, order: 2 }, { x: 150, y: 60, order: 3 }, { x: 195, y: 200, order: 4 }, { x: 120, y: 145, order: 5 }, { x: 180, y: 145, order: 6 }],
    direction: 'ltr',
  },
  {
    id: 'en_b',
    char: 'b',
    name: 'Lower-case b (Print)',
    phonics: '/b/ like Book',
    exampleWord: 'Book',
    exampleTranslation: 'كتاب الإنجليزية 📘',
    icon: '📘',
    strokeHintAr: 'انزل بخط مستقيم طويل من الأعلى للأسفل (1)، ثم ارسم الدائرة المكتملة إلى اليمين (2).',
    strokeHintFr: 'Ligne droite de haut en bas (1), puis le ventre rond vers la droite (2).',
    strokesSvg: ['M 120, 60 L 120, 200', 'M 120, 140 C 145, 125 180, 135 180, 165 C 180, 195 145, 205 120, 195'],
    dots: [{ x: 120, y: 60, order: 1 }, { x: 120, y: 200, order: 2 }, { x: 120, y: 140, order: 3 }, { x: 180, y: 165, order: 4 }, { x: 120, y: 195, order: 5 }],
    direction: 'ltr',
  },
  {
    id: 'en_s',
    char: 'S',
    name: 'Letter S (Curve)',
    phonics: '/s/ like Sun',
    exampleWord: 'Sun',
    exampleTranslation: 'شمس الواحات الساطعة ☀️',
    icon: '☀️',
    strokeHintAr: 'انعطف يساراً ثم اعبر لليمين ثم انعطف يساراً كحركة الثعبان الرشيقة.',
    strokeHintFr: 'Tourne à gauche en haut, croise à droite, puis tourne à gauche en bas comme un serpent.',
    strokesSvg: ['M 175, 90 C 160, 65 125, 65 125, 95 C 125, 130 175, 135 175, 170 C 175, 205 125, 205 115, 180'],
    dots: [{ x: 175, y: 90, order: 1 }, { x: 125, y: 80, order: 2 }, { x: 150, y: 130, order: 3 }, { x: 175, y: 170, order: 4 }, { x: 115, y: 180, order: 5 }],
    direction: 'ltr',
  },
];

// 4. TAMAZIGHT TIFINAGH (4AP & 5AP)
const TAMAZIGHT_ITEMS: LetterData[] = [
  {
    id: 'ber_yaz',
    char: 'ⵣ',
    name: 'Yaz (ⵣ - Amazigh)',
    phonics: '/z/ Amaziɣ',
    exampleWord: 'Amaziɣ',
    exampleTranslation: 'الإنسان الحر الأصيل',
    icon: 'ⵣ',
    strokeHintAr: 'خط عمودي في الوسط (1)، ثم هلال علوي مرفوع للسماء (2)، ثم هلال سفلي راسخ في الأرض (3).',
    strokeHintFr: 'Ligne verticale au centre (1), demi-cercle haut vers le ciel (2), demi-cercle bas (3).',
    strokesSvg: ['M 150, 50 L 150, 210', 'M 90, 80 Q 150, 110 210, 80', 'M 90, 180 Q 150, 150 210, 180'],
    dots: [{ x: 150, y: 50, order: 1 }, { x: 150, y: 210, order: 2 }, { x: 90, y: 80, order: 3 }, { x: 210, y: 80, order: 4 }, { x: 90, y: 180, order: 5 }, { x: 210, y: 180, order: 6 }],
    direction: 'ltr',
  },
  {
    id: 'ber_yar',
    char: 'ⵔ',
    name: 'Yar (ⵔ - Cercle)',
    phonics: '/r/ Argaz',
    exampleWord: 'Argaz',
    exampleTranslation: 'الرجل الحكيم (ⵔ)',
    icon: '🧔',
    strokeHintAr: 'ارسم دائرة هندسية تامة ومغلقة بحركة انسيابية من الأعلى إلى الأسفل.',
    strokeHintFr: 'Trace un cercle géométrique parfait et fermé de haut en bas.',
    strokesSvg: ['M 150, 60 A 70,70 0 1,0 150,200 A 70,70 0 1,0 150,60'],
    dots: [{ x: 150, y: 60, order: 1 }, { x: 80, y: 130, order: 2 }, { x: 150, y: 200, order: 3 }, { x: 220, y: 130, order: 4 }],
    direction: 'ltr',
  },
];

export const TouchWritingStudio: React.FC<TouchWritingStudioProps> = ({
  grade = '3AP',
  onReward,
  onBack,
}) => {
  // Determine initial language tab based on user's current grade
  const getDefaultLanguage = (): WritingLanguage => {
    if (grade === '1AP' || grade === '2AP') return 'ar';
    if (grade === '3AP') return 'fr';
    if (grade === '4AP' || grade === '5AP') return 'en';
    return 'ar';
  };

  const [activeLang, setActiveLang] = useState<WritingLanguage>(getDefaultLanguage());
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('seyes');
  const [pedagogicalStep, setPedagogicalStep] = useState<PedagogicalStep>('guide');
  const [selectedItemId, setSelectedItemId] = useState<string>('ar_alif');
  const [inkColor, setInkColor] = useState<string>('#2563EB'); // Royal Blue
  const [brushSize, setBrushSize] = useState<number>(10);
  const [isHandLeft, setIsHandLeft] = useState<boolean>(false);
  const [isDemoAnimating, setIsDemoAnimating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{ score: number; passed: boolean; messageAr: string } | null>(null);

  // Canvas Drawing Refs & State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokeCount, setStrokeCount] = useState<number>(0);
  const [collectedPoints, setCollectedPoints] = useState<{ x: number; y: number }[]>([]);

  // Get active item list
  const getItemsForLang = (): LetterData[] => {
    switch (activeLang) {
      case 'ar':
        return ARABIC_ITEMS;
      case 'fr':
        return FRENCH_ITEMS;
      case 'en':
        return ENGLISH_ITEMS;
      case 'ber':
        return TAMAZIGHT_ITEMS;
      default:
        return ARABIC_ITEMS;
    }
  };

  const currentItems = getItemsForLang();
  const currentItem = currentItems.find((item) => item.id === selectedItemId) || currentItems[0];

  // Sync selected item when language changes
  useEffect(() => {
    const items = getItemsForLang();
    if (items.length > 0 && !items.some((i) => i.id === selectedItemId)) {
      setSelectedItemId(items[0].id);
    }
    clearCanvas();
  }, [activeLang]);

  // Audio / Sound helper
  const playSoundEffect = (type: 'chalk' | 'ink' | 'fanfare' | 'click' | 'whoosh') => {
    if (typeof window === 'undefined' || !window.AudioContext) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'fanfare') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'chalk') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch {
      // Audio silent fallback
    }
  };

  const speakItem = (item: LetterData) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      let textToSpeak = `${item.name}. ${item.phonics}. ${item.exampleWord}.`;
      let voiceLang = 'ar-SA';
      if (activeLang === 'fr') {
        textToSpeak = `${item.name}. Son ${item.phonics}. Exemple : ${item.exampleWord}.`;
        voiceLang = 'fr-FR';
      } else if (activeLang === 'en') {
        textToSpeak = `${item.name}. Sound ${item.phonics}. Like in ${item.exampleWord}.`;
        voiceLang = 'en-US';
      }
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.85;
      utterance.lang = voiceLang;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech error
    }
  };

  // -------------------------------------------------------------
  // CANVAS DRAWING & COORDINATES ENGINE
  // -------------------------------------------------------------
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeCount(0);
    setCollectedPoints([]);
    setValidationResult(null);
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (pedagogicalStep === 'watch') return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = boardTheme === 'blackboard' ? '#FFFFFF' : inkColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setCollectedPoints((prev) => [...prev, { x, y }]);
    setStrokeCount((s) => s + 1);
  };

  const handleDrawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || pedagogicalStep === 'watch') return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getCanvasCoords(e);

    ctx.lineTo(x, y);
    ctx.stroke();
    setCollectedPoints((prev) => [...prev, { x, y }]);
  };

  const handleStopDraw = () => {
    setIsDrawing(false);
  };

  // -------------------------------------------------------------
  // PEDAGOGICAL EVALUATION & VALIDATION ALGORITHM
  // -------------------------------------------------------------
  const validateWriting = () => {
    if (collectedPoints.length < 15) {
      setValidationResult({
        score: 20,
        passed: false,
        messageAr: 'حاول رسم الحرف بالكامل على المسار للحصول على الدنانير والتقييم الممتاز !',
      });
      playSoundEffect('click');
      return;
    }

    // Check hit rate on expected target dots
    const targetDots = currentItem.dots;
    let hitCount = 0;
    const radiusTolerance = 45; // Pixel tolerance on 300x260 grid

    targetDots.forEach((dot) => {
      // Scale dot to canvas 600x400
      const scaledTargetX = (dot.x / 300) * 600;
      const scaledTargetY = (dot.y / 260) * 400;

      const isHit = collectedPoints.some((pt) => {
        const dx = pt.x - scaledTargetX;
        const dy = pt.y - scaledTargetY;
        return Math.sqrt(dx * dx + dy * dy) <= radiusTolerance;
      });

      if (isHit) hitCount++;
    });

    const accuracyScore = Math.min(100, Math.round((hitCount / targetDots.length) * 100));

    if (accuracyScore >= 60) {
      playSoundEffect('fanfare');
      setValidationResult({
        score: accuracyScore,
        passed: true,
        messageAr: `مُمْتَازٌ يَا بَطَل ! 🌟 دِقَّةُ خَطِّكَ هِيَ ${accuracyScore}٪ مَعَ مُرَاعَاةِ السَّطْرِ وَالسِّيَاس.`,
      });
      if (onReward) onReward(15, 20);
    } else {
      playSoundEffect('click');
      setValidationResult({
        score: accuracyScore,
        passed: false,
        messageAr: `جَيِّد ! نِسْبَةُ التَّطَابُقِ ${accuracyScore}٪. حَاوِلْ مَرَّةً أُخْرَى لِجَعْلِ الخَطِّ أَكْثَرَ انْسِيَابِيَّةً.`,
      });
    }
  };

  // Trigger Animated Demo in "Watch" mode
  const startDemoAnimation = () => {
    setIsDemoAnimating(true);
    clearCanvas();
    speakItem(currentItem);
    setTimeout(() => {
      setIsDemoAnimating(false);
    }, 3500);
  };

  // Generate printable PDF/A4 worksheet for offline practice
  const handlePrintWorksheet = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="${currentItem.direction === 'rtl' ? 'rtl' : 'ltr'}" lang="${activeLang}">
      <head>
        <title>ورقة تدريب الخط - مسيد الجزائر (${currentItem.char})</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #1e293b; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 8px; margin-bottom: 15px; }
          .title { font-size: 20px; font-weight: bold; color: #1e3a8a; }
          .meta { font-size: 12px; color: #64748b; }
          .letter-hero { display: flex; align-items: center; justify-content: space-around; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px; margin-bottom: 20px; }
          .big-char { font-size: 64px; font-weight: bold; color: #2563eb; }
          .seyes-line { height: 40px; border-bottom: 2px solid #2563eb; position: relative; margin-bottom: 25px; }
          .seyes-interline { border-bottom: 1px dashed #93c5fd; height: 10px; }
          .guide-char { position: absolute; top: -10px; font-size: 36px; color: #cbd5e1; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">🇩🇿 مَسِيدُ الجَزَائِر - وَرَقَةُ نَشَاطِ الخَطِّ وَالكِتَابَةِ</div>
            <div class="meta">المستوى : ${grade} • الحرف المستهدف : ${currentItem.name} (${currentItem.char})</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 13px; font-weight: bold;">اسم التلميذ(ة) : ...........................</div>
            <div style="font-size: 11px; color: #64748b;">التاريخ : ${new Date().toLocaleDateString('fr-DZ')}</div>
          </div>
        </div>

        <div class="letter-hero">
          <div class="big-char">${currentItem.char}</div>
          <div>
            <div style="font-size: 16px; font-weight: bold;">${currentItem.name} (${currentItem.phonics})</div>
            <div style="font-size: 13px; color: #475569;">الكلمة النموذجية : <strong>${currentItem.exampleWord}</strong> (${currentItem.exampleTranslation})</div>
          </div>
          <div style="font-size: 40px;">${currentItem.icon}</div>
        </div>

        <h4 style="margin: 10px 0; color: #1e3a8a;">1. تَدَرَّبْ عَلَى كِتَابَةِ الحَرْفِ مَعَ احْتِرَامِ السَّطْرِ وَالأَسْنَانِ (Lignes Seyès) :</h4>
        
        ${Array.from({ length: 6 }).map((_, idx) => `
          <div class="seyes-line">
            <div class="seyes-interline"></div>
            <div class="seyes-interline"></div>
            <div class="seyes-interline"></div>
            <span class="guide-char" style="${currentItem.direction === 'rtl' ? 'right: 10px;' : 'left: 10px;'}">${currentItem.char}</span>
            <span class="guide-char" style="${currentItem.direction === 'rtl' ? 'right: 120px;' : 'left: 120px;'} opacity: 0.4;">${currentItem.char}</span>
            <span class="guide-char" style="${currentItem.direction === 'rtl' ? 'right: 240px;' : 'left: 240px;'} opacity: 0.2;">${currentItem.char}</span>
          </div>
        `).join('')}

        <div style="margin-top: 30px; padding: 12px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; font-size: 12px;">
          <strong>💡 إرشادات المعلم ديدو :</strong> ${currentItem.strokeHintAr}
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  // INK PALETTE PRESETS
  const INK_PRESETS = [
    { name: 'حبر مدرسي أزرق', color: '#2563EB' },
    { name: 'أخضر جرجرة وزمرد', color: '#059669' },
    { name: 'أحمر مرجان بني يني', color: '#DC2626' },
    { name: 'أوكر رمال تيميمون', color: '#D97706' },
    { name: 'حبر أسود صمغ تقليدي', color: '#0F172A' },
  ];

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
              <span>✍️</span>
              <span>مَرْسَمُ الخَطِّ وَالكِتَابَةِ اللَّمْسِيَّةِ (Touch Writing Studio)</span>
              <span>•</span>
              <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-md font-mono">{grade}</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-2">
              <span>تَعَلَّمْ رَسْمَ الحُرُوفِ وَالأَرْقَامِ بِاللَّمْسِ وَالسِّيَاس</span>
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              تدرج بيداغوجي مطابق للمنهاج الجزائري: الحروف والأرقام العربية (1AP-2AP)، والفرنسية الكورسيف (3AP)، والإنجليزية والرمز التيفيناغي (4AP-5AP).
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={handlePrintWorksheet}
              className="px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="طباعة ورقة نشاط جاهزة للتدريب بالقلم على الورق"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">طباعة ورقة A4</span>
            </button>

            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>العودة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Language / Curriculum Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[var(--app-card-bg)] p-2 rounded-2xl border border-[var(--app-card-border)] shadow-xs">
        <button
          onClick={() => {
            setActiveLang('ar');
            playSoundEffect('click');
          }}
          className={`py-3 px-2 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeLang === 'ar'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <span>🇩🇿</span>
          <span className="truncate">العربية والأرقام (1AP & 2AP)</span>
        </button>

        <button
          onClick={() => {
            setActiveLang('fr');
            playSoundEffect('click');
          }}
          className={`py-3 px-2 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeLang === 'fr'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <span>🇫🇷</span>
          <span className="truncate">Français Cursive (3AP)</span>
        </button>

        <button
          onClick={() => {
            setActiveLang('en');
            playSoundEffect('click');
          }}
          className={`py-3 px-2 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeLang === 'en'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <span>🇬🇧</span>
          <span className="truncate">English Script (4AP & 5AP)</span>
        </button>

        <button
          onClick={() => {
            setActiveLang('ber');
            playSoundEffect('click');
          }}
          className={`py-3 px-2 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeLang === 'ber'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card-subtle)]'
          }`}
        >
          <span>ⵣ</span>
          <span className="truncate">التيفيناغ (Tamazight)</span>
        </button>
      </div>

      {/* Main Studio Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Canvas & Interactive Board (8 Cols) */}
        <div className="lg:col-span-8 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-5 space-y-4 flex flex-col justify-between shadow-xs">
          {/* Top Board Toolbar: 3 Steps + Themes + Handedness */}
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[var(--app-card-border)]">
            {/* 3 Pedagogical Steps (Watch -> Guide -> Challenge) */}
            <div className="flex items-center gap-1.5 bg-[var(--app-card-subtle)] p-1 rounded-2xl border border-[var(--app-card-border)]">
              <button
                onClick={() => {
                  setPedagogicalStep('watch');
                  startDemoAnimation();
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 cursor-pointer ${
                  pedagogicalStep === 'watch'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>1. انْظُرْ وَتَعَلَّمْ</span>
              </button>

              <button
                onClick={() => {
                  setPedagogicalStep('guide');
                  clearCanvas();
                  playSoundEffect('click');
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 cursor-pointer ${
                  pedagogicalStep === 'guide'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span>2. اكْتُبْ مَعِي</span>
              </button>

              <button
                onClick={() => {
                  setPedagogicalStep('challenge');
                  clearCanvas();
                  playSoundEffect('click');
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 cursor-pointer ${
                  pedagogicalStep === 'challenge'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>3. أَنَا بَطَلُ الخَطِّ</span>
              </button>
            </div>

            {/* Board Background Chooser */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[var(--app-text-muted)] font-bold hidden sm:inline">اللوحة :</span>
              <button
                onClick={() => setBoardTheme('seyes')}
                className={`p-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  boardTheme === 'seyes' ? 'bg-blue-50 border-blue-400 text-blue-800 ring-2 ring-blue-300' : 'bg-[var(--app-card-subtle)] border-transparent'
                }`}
                title="كراس السياس المدرسي"
              >
                📋 كراس
              </button>
              <button
                onClick={() => setBoardTheme('blackboard')}
                className={`p-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  boardTheme === 'blackboard' ? 'bg-slate-900 border-slate-700 text-white ring-2 ring-slate-400' : 'bg-[var(--app-card-subtle)] border-transparent'
                }`}
                title="لوحة الطباشير السوداء"
              >
                🖤 طباشير
              </button>
              <button
                onClick={() => setBoardTheme('wood')}
                className={`p-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  boardTheme === 'wood' ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-300' : 'bg-[var(--app-card-subtle)] border-transparent'
                }`}
                title="اللوح الخشبي التقليدي للمسيد"
              >
                🪵 لوح خشبي
              </button>
            </div>
          </div>

          {/* Interactive Writing Canvas Container */}
          <div
            className={`relative w-full aspect-[16/11] sm:aspect-[16/10] rounded-3xl border-2 overflow-hidden flex items-center justify-center touch-none transition-all ${
              boardTheme === 'seyes'
                ? 'bg-[#FDFEFE] border-blue-200 shadow-inner'
                : boardTheme === 'blackboard'
                ? 'bg-[#1E293B] border-slate-700 shadow-2xl'
                : 'bg-[#FDF6E2] border-amber-400 shadow-inner'
            }`}
          >
            {/* Background Seyès Lined Grid (If Seyès theme selected) */}
            {boardTheme === 'seyes' && (
              <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                {/* Vertical Margin Line (Red/Pink in Algerian notebooks) */}
                <line x1="70" y1="0" x2="70" y2="400" stroke="#F87171" strokeWidth="2" />
                {/* Horizontal Base Writing Lines and Seyès Interlines */}
                {[80, 160, 240, 320].map((baseY) => (
                  <g key={baseY}>
                    {/* Main thick purple base line */}
                    <line x1="0" y1={baseY} x2="600" y2={baseY} stroke="#3B82F6" strokeWidth="2.5" />
                    {/* Interlines (+1, +2, +3, -1, -2) */}
                    <line x1="0" y1={baseY - 20} x2="600" y2={baseY - 20} stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1={baseY - 40} x2="600" y2={baseY - 40} stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1={baseY - 60} x2="600" y2={baseY - 60} stroke="#93C5FD" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1={baseY + 20} x2="600" y2={baseY + 20} stroke="#BFDBFE" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="0" y1={baseY + 40} x2="600" y2={baseY + 40} stroke="#BFDBFE" strokeWidth="1" strokeDasharray="3 3" />
                  </g>
                ))}
              </svg>
            )}

            {/* Blackboard guidelines */}
            {boardTheme === 'blackboard' && (
              <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full pointer-events-none opacity-25">
                <line x1="40" y1="200" x2="560" y2="200" stroke="#FFFFFF" strokeWidth="2" />
                <line x1="40" y1="120" x2="560" y2="120" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6 6" />
                <line x1="40" y1="280" x2="560" y2="280" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6 6" />
              </svg>
            )}

            {/* Wood Board Texture Overlay */}
            {boardTheme === 'wood' && (
              <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:16px_16px]" />
            )}

            {/* Guided Path Outline (Rendered in 'Watch' & 'Guide' Modes) */}
            {pedagogicalStep !== 'challenge' && (
              <svg viewBox="0 0 300 260" className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                {currentItem.strokesSvg.map((pathStr, sIdx) => (
                  <path
                    key={sIdx}
                    d={pathStr}
                    fill="none"
                    stroke={boardTheme === 'blackboard' ? '#94A3B8' : '#2563EB'}
                    strokeWidth="20"
                    strokeDasharray={pedagogicalStep === 'guide' ? '6 8' : 'none'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isDemoAnimating ? 'animate-pulse' : ''}
                  />
                ))}

                {/* Numbered Directional Dots */}
                {currentItem.dots.map((dot) => (
                  <g key={dot.order}>
                    <circle cx={dot.x} cy={dot.y} r="10" fill="#EF4444" />
                    <text
                      x={dot.x}
                      y={dot.y + 4}
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {dot.order}
                    </text>
                  </g>
                ))}
              </svg>
            )}

            {/* Challenge Mode: Watermark in corner */}
            {pedagogicalStep === 'challenge' && (
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-slate-700 flex items-center gap-2 select-none pointer-events-none opacity-60">
                <span className="text-3xl font-black text-blue-600">{currentItem.char}</span>
                <div className="text-[10px] font-bold">
                  <div>النموذج المطلوب</div>
                  <div className="text-slate-500">{currentItem.name}</div>
                </div>
              </div>
            )}

            {/* Actual Interactive HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              onMouseDown={handleStartDraw}
              onMouseMove={handleDrawMove}
              onMouseUp={handleStopDraw}
              onMouseLeave={handleStopDraw}
              onTouchStart={handleStartDraw}
              onTouchMove={handleDrawMove}
              onTouchEnd={handleStopDraw}
              className="absolute inset-0 w-full h-full cursor-crosshair z-10"
            />
          </div>

          {/* Bottom Control Bar: Colors, Eraser, Clear, Validate */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            {/* Ink Palette */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[var(--app-text-muted)] hidden sm:inline">الحبر :</span>
              {INK_PRESETS.map((ink) => (
                <button
                  key={ink.color}
                  onClick={() => {
                    setInkColor(ink.color);
                    playSoundEffect('click');
                  }}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 shadow-xs ${
                    inkColor === ink.color ? 'scale-125 border-white ring-2 ring-blue-500' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: ink.color }}
                  title={ink.name}
                />
              ))}
            </div>

            {/* Brush Size Picker */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setBrushSize(6)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  brushSize === 6 ? 'bg-blue-600 text-white' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
                }`}
              >
                رفيع
              </button>
              <button
                onClick={() => setBrushSize(12)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  brushSize === 12 ? 'bg-blue-600 text-white' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
                }`}
              >
                عادي
              </button>
              <button
                onClick={() => setBrushSize(20)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  brushSize === 20 ? 'bg-blue-600 text-white' : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)]'
                }`}
              >
                عريض
              </button>
            </div>

            {/* Actions: Clear, Speak, Validate */}
            <div className="flex items-center gap-2">
              <button
                onClick={clearCanvas}
                className="px-3 py-2 rounded-xl bg-[var(--app-card-subtle)] hover:bg-slate-200/60 text-[var(--app-text)] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="مسح اللوحة"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">مسح</span>
              </button>

              <button
                onClick={() => speakItem(currentItem)}
                className="p-2 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-all cursor-pointer"
                title="نطق الحرف والصوت"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={validateWriting}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تحقق من الخط (+15 🪙)</span>
              </button>
            </div>
          </div>

          {/* Validation Feedback Card */}
          {validationResult && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 animate-fade-in ${
                validationResult.passed
                  ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-800 border border-amber-500/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <span>{validationResult.messageAr}</span>
              </div>

              {validationResult.passed && (
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-black shrink-0">
                  +15 دج 🪙
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Character Selection & Pedagogical Instructions (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Letter Big Highlight Card */}
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-5 text-center space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--app-text-muted)]">
              <span>الحرف المستهدف</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-[10px]">
                {currentItem.phonics}
              </span>
            </div>

            <div className="text-6xl sm:text-7xl font-black text-blue-600 dark:text-blue-400 py-1">
              {currentItem.char}
            </div>

            <div className="text-sm font-black text-[var(--app-text)] flex items-center justify-center gap-1.5">
              <span>{currentItem.name}</span>
            </div>

            {/* Illustrated Example Word */}
            <div className="p-3 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentItem.icon}</span>
                <div className="text-right">
                  <div className="font-bold text-[var(--app-text)]">{currentItem.exampleWord}</div>
                  <div className="text-[10px] text-[var(--app-text-muted)]">{currentItem.exampleTranslation}</div>
                </div>
              </div>

              <button
                onClick={() => speakItem(currentItem)}
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer shadow-xs"
                title="استمع للنطق"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pedagogical Stroke Hint */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-right text-xs space-y-1">
              <div className="font-black text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <span>💡 اتجاه وحركة القلم :</span>
              </div>
              <p className="text-[11px] text-[var(--app-text-muted)] leading-relaxed">
                {currentItem.strokeHintAr}
              </p>
            </div>
          </div>

          {/* Grid of Letters to Choose */}
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-black text-[var(--app-text)]">
              <span>اختر حرفاً أو رقماً للتمرين :</span>
              <span className="text-[10px] text-[var(--app-text-muted)]">({currentItems.length} عناصر)</span>
            </div>

            <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
              {currentItems.map((item) => {
                const isSelected = selectedItemId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItemId(item.id);
                      clearCanvas();
                      playSoundEffect('click');
                      speakItem(item);
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105 ring-2 ring-blue-300'
                        : 'bg-[var(--app-card-subtle)] text-[var(--app-text)] border-[var(--app-card-border)] hover:bg-blue-50/50 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-xl font-black">{item.char}</span>
                    <span className="text-[9px] font-bold opacity-80 truncate w-full">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

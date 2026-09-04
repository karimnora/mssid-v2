import type { PrimaryGrade } from '../../types';
import type { TabId } from './shared';
import { stripArabicTashkeel } from '../../utils/textFormatter';

/** 1AP only: picture-first sheet. 2AP stays on the compact (not preschool) viewer. */
export const isPlayful1AP = (grade?: PrimaryGrade | string) => grade === '1AP';

/** 1AP/2AP: no French in the UI per program (French starts 3AP) — strip Latin glosses like "(Trimestre 1)". */
export const isFrenchFreeGrade = (grade?: PrimaryGrade | string) => grade === '1AP' || grade === '2AP';

export type Playful1APStep = {
  id: TabId;
  labelAr: string;
};

/** Look → dedicated lab (when the lesson has one) → play → answer. No summary tab, no exam sheet. */
export function buildPlayful1APSteps(
  lesson: {
    progressiveExercises?: unknown[] | null;
    quiz: unknown[];
  },
  options?: { hasInteractive?: boolean },
): Playful1APStep[] {
  const steps: Playful1APStep[] = [{ id: 'explanation', labelAr: 'أَنْظُرُ' }];
  if (options?.hasInteractive) {
    steps.push({ id: 'interactive', labelAr: 'الأداة التفاعلية المخصصة' });
  }
  if (lesson.progressiveExercises && lesson.progressiveExercises.length > 0) {
    steps.push({ id: 'practice', labelAr: 'أَلْعَبُ' });
  }
  if (lesson.quiz.length > 0) {
    steps.push({ id: 'quiz', labelAr: 'أُجِيبُ' });
  }
  return steps;
}

/** Drop "(Devant)", "(Haut / Bas)" — 1AP reads Arabic, not French glosses. */
export function stripLatinGlosses(text: string): string {
  return text.replace(/\s*\([^)]*[A-Za-zÀ-ÿ][^)]*\)/g, '').replace(/\s{2,}/g, ' ').trim();
}

const EMOJI_RE = /\p{Extended_Pictographic}(?:\uFE0F)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F)?)*/u;

const FALLBACK_EMOJI: Array<[RegExp, string]> = [
  // Spatial & Geometrical concepts
  [/فَوْق|فوق/, '☝️'],
  [/تَحْت|تحت/, '👇'],
  [/أَمَام|امام|أمام/, '👀'],
  [/وَرَاء|وراء|خلف/, '🔙'],
  [/بَيْن|بين/, '↔️'],
  [/أَعْلَى|أعلى/, '⬆️'],
  [/أَسْفَل|أسفل/, '⬇️'],
  [/مُرَبَّع|مربع/, '⬜'],
  [/دَائِرَة|دائرة/, '⭕'],
  [/مُثَلَّث|مثلث/, '🔺'],
  [/مُسْتَطِيل|مستطيل/, '▬'],
  // 1AP Core animals & nature
  [/نَحْل|نحل/, '🐝'],
  [/نَمْل|نمل/, '🐜'],
  [/مَوْز|موز/, '🍌'],
  [/لَيْمُون|ليمون/, '🍋'],
  [/رُمَّان|رمان/, '🍎'],
  [/تُفَّاح|تفاح/, '🍎'],
  [/تَمْر|تمر|نَخْل|نخل/, '🌴'],
  // Word-boundary anchored (unlike most entries above): "بط" as a bare substring match also fires
  // inside unrelated words like "روابط" (connectors) or "ضبط" (discipline), showing a duck 🦆 next
  // to grammar/classroom-rules content that has nothing to do with ducks.
  [/(?:^|\P{L})(?:بَطَّ|بطة|بط)(?:\P{L}|$)/u, '🦆'],
  [/أَرْنَب|أرنب/, '🐰'],
  [/أَسَد|أسد/, '🦁'],
  [/ثَعْلَب|ثعلب/, '🦊'],
  // Anchored: bare "دب" also fires inside "أدب"/"مؤدب" (etiquette/polite), unrelated to bears.
  [/(?:^|\P{L})(?:دُبّ|دب)(?:\P{L}|$)/u, '🐻'],
  [/ذُبَاب|ذباب/, '🪰'],
  [/ذِئْب|ذئب/, '🐺'],
  [/سَمَك|سمك/, '🐟'],
  [/شَمْس|شمس/, '☀️'],
  [/قَمَر|قمر|هِلاَل|هلال/, '🌙'],
  [/نَجْم|نجم/, '⭐'],
  [/عِنَب|عنب/, '🍇'],
  [/غُرَاب|غراب/, '🐦‍⬛'],
  [/فِيل|فيل/, '🐘'],
  [/فَرَاش|فراش/, '🦋'],
  // Anchored: bare "قط"/"هر" also fire inside "قطعة" (piece), "قطار" (train), "زهرة" (flower —
  // which has its own, correct 🌸 entry further below that this was silently shadowing), "شهر"
  // (month), "ظهر" (back/noon) — none of which are about cats.
  [/(?:^|\P{L})(?:قِطّ|قطة|قط|هر)(?:\P{L}|$)/u, '🐱'],
  [/كَلْب|كلب/, '🐕'],
  [/حِصَان|حصان/, '🐴'],
  [/زَرَاف|زرافة/, '🦒'],
  [/طَيْر|طائر|عُصْفُور|عصفور/, '🐦'],
  [/جَمَل|جمل/, '🐪'],
  [/شَجَر|شجر|غَاب|غابة/, '🌳'],
  [/وَرْد|ورد|زَهْر|زهرة|يَاسَمِين|ياسمين/, '🌸'],
  // School, arts & play
  [/كِتَاب|كتاب|قِصَّة|قصة|حِكَايَة|حكاية/, '📖'],
  [/قَلَم|قلم|طَبَاشِير|طباشير|كِتَابَة|كتابة|خَطّ|خط/, '✏️'],
  [/رَسْم|رسم|أَلْوَان|ألوان|تَلْوِين|تلوين/, '🎨'],
  [/مُوسِيق|موسيقى|أَغَان|أغاني|إِيقَاع|إيقاع|نَشِيد|نشيد/, '🎵'],
  [/كُرَة|كرة|مَلْعَب|ملعب|لَعِبَ|نلعب|ألعب/, '⚽'],
  [/لُعْبَة|لعبة|دُمْيَة|دمية/, '🧸'],
  // Daily life, senses & values
  [/مَسْجِد|مسجد|صَلاَة|صلاة|أَذَان|أذان/, '🕌'],
  [/مَاء|ماء|نَظَاف|نظافة|وُضُوء|وضوء|صَابُون|صابون|غَسْل|غسل/, '🧼'],
  [/عَلَم|علم|وَطَن|وطن|جَزَائِر|جزائر/, '🇩🇿'],
  [/سَيَّار|سيارة/, '🚗'],
  [/بَاب|باب/, '🚪'],
  // Anchored: bare "بيت" also fires inside "بيتزا" (pizza, itself used in another lesson's example),
  // showing a house 🏠 for a food question.
  [/(?:^|\P{L})(?:بَيْت|بيت|مَنْزِل|منزل|دَار|دار)(?:\P{L}|$)/u, '🏠'],
  [/عَيْن|عين|رُؤْيَة|رؤية|بَصَر|بصر|أَرَى|أرى|نَرَى|نرى/, '👀'],
  [/أُذُن|أذن|سَمْع|سمع|أَسْمَع|أسمع|اسْتَمِع|استمع|نَسْتَمِع|نستمع/, '👂'],
  [/أَنْف|أنف|شَمّ|شم|أَشُمّ|أشم/, '👃'],
  [/لِسَان|لسان|ذَوْق|ذوق|أَتَذَوَّق|أتذوق|طَعْم|طعم/, '👅'],
  [/يَد|يد|أَصَابِع|أصابع|لَمْس|لمس/, '✋'],
  [/مُعَلِّم|معلم|أُسْتَاذ|أستاذ|مَدْرَس|مدرسة|قِسْم|قسم/, '🏫'],
  [/تَحِيَّة|تحية|سَلاَم|سلام|أُحَيِّي|أحيي/, '👋'],
  [/احْتِرَام|احترام|تَعَاوُن|تعاون|مُشَارَك|مشاركة/, '🤝'],
  [/عَائِل|عائلة|أُسْرَة|أسرة|أَب|أب|أُمّ|أم|وَالِد|والد/, '👨‍👩‍👧'],
];

const DEFAULT_TILES = ['⭐', '🎈', '🌈', '🌸', '🐱', '⚽', '🌙', '🍀'];

export type PlayfulSnippet = {
  emoji: string;
  headline: string;
  whisper: string;
  speak: string;
  letterVisual: string | null;
};

/** Trim to at most `maxLen` chars without cutting the last word in half. */
function cutAtWordBoundary(text: string, maxLen: number, minKeep: number): string {
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > minKeep ? cut.slice(0, lastSpace) : cut).trim();
}

function shortenWhisper(text: string): string {
  const noParens = text.replace(/\([^)]*\)/g, '').replace(/\s{2,}/g, ' ').trim();
  return cutAtWordBoundary(noParens, 42, 16);
}

/**
 * Picture + short word for a 6-year-old. TTS reads only this snippet, never the whole lesson.
 * `siblingEmoji` (e.g. the emoji already resolved for a paired problem/solution) is tried before
 * falling back to an arbitrary DEFAULT_TILES pick, so a bare answer like "3 تفاحات" (no emoji of
 * its own) reuses the 🍎 from "كم عدد التفاحات؟ 🍎🍎🍎" instead of showing an unrelated 🍀.
 */
export function parsePlayfulSnippet(raw: string, fallbackIndex = 0, siblingEmoji?: string): PlayfulSnippet {
  const cleaned = stripLatinGlosses(raw);
  const emojiMatch = cleaned.match(EMOJI_RE);
  const withoutEmoji = cleaned
    .replace(/\p{Extended_Pictographic}(?:\uFE0F)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F)?)*/gu, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  let headline: string;
  let whisper: string;
  const colonIdx = withoutEmoji.indexOf(':');
  if (colonIdx > 0 && colonIdx < 28) {
    headline = withoutEmoji.slice(0, colonIdx).trim();
    whisper = shortenWhisper(withoutEmoji.slice(colonIdx + 1).trim());
  } else {
    const q = withoutEmoji.search(/[؟?]/);
    if (q >= 0 && q < 48) {
      headline = withoutEmoji.slice(0, q + 1).trim();
      whisper = shortenWhisper(withoutEmoji.slice(q + 1).trim());
    } else {
      const period = withoutEmoji.search(/[.]/);
      if (period > 0 && period < 36) {
        headline = withoutEmoji.slice(0, period).trim();
        whisper = shortenWhisper(withoutEmoji.slice(period + 1).trim());
      } else if (withoutEmoji.length > 36) {
        headline = cutAtWordBoundary(withoutEmoji, 28, 12);
        whisper = shortenWhisper(withoutEmoji.slice(headline.length).trim());
      } else {
        headline = withoutEmoji;
        whisper = '';
      }
    }
  }

  const strippedCleaned = stripArabicTashkeel(cleaned);
  const strippedHeadline = stripArabicTashkeel(headline);

  let letterVisual: string | null = null;

  // Harakat & phonetic markings ("comme en haut" - display authentic Arabic letter/mark instead of unrelated emojis)
  const isTanweenFath = /(?:^|\P{L})(?:تنوين.*فتح|فتحتان)(?:\P{L}|$)/u.test(strippedHeadline) || /(?:^|\P{L})(?:تنوين.*فتح|فتحتان)(?:\P{L}|$)/u.test(strippedCleaned);
  const isTanweenDamm = /(?:^|\P{L})(?:تنوين.*ضم|ضمتان)(?:\P{L}|$)/u.test(strippedHeadline) || /(?:^|\P{L})(?:تنوين.*ضم|ضمتان)(?:\P{L}|$)/u.test(strippedCleaned);
  const isTanweenKasr = /(?:^|\P{L})(?:تنوين.*كسر|كسرتان)(?:\P{L}|$)/u.test(strippedHeadline) || /(?:^|\P{L})(?:تنوين.*كسر|كسرتان)(?:\P{L}|$)/u.test(strippedCleaned);
  const isFatha = /(?:^|\P{L})(?:ال)?(?:فتحة|فتح)(?:\P{L}|$)/u.test(strippedHeadline) || (/(?:^|\P{L})(?:ال)?(?:فتحة|فتح)(?:\P{L}|$)/u.test(strippedCleaned) && /حركة|حركات|تشكيل|فوق/.test(strippedCleaned));
  const isDamma = /(?:^|\P{L})(?:ال)?(?:ضمة|ضم)(?:\P{L}|$)/u.test(strippedHeadline) || (/(?:^|\P{L})(?:ال)?(?:ضمة|ضم)(?:\P{L}|$)/u.test(strippedCleaned) && /حركة|حركات|تشكيل|فوق/.test(strippedCleaned));
  const isKasra = /(?:^|\P{L})(?:ال)?(?:كسرة|كسر)(?:\P{L}|$)/u.test(strippedHeadline) || (/(?:^|\P{L})(?:ال)?(?:كسرة|كسر)(?:\P{L}|$)/u.test(strippedCleaned) && /حركة|حركات|تشكيل|تحت/.test(strippedCleaned));
  const isSukun = /(?:^|\P{L})(?:ال)?(?:سكون|ساكن)(?:\P{L}|$)/u.test(strippedHeadline) || (/(?:^|\P{L})(?:ال)?(?:سكون|ساكن)(?:\P{L}|$)/u.test(strippedCleaned) && /حركة|حركات|تشكيل|فوق/.test(strippedCleaned));
  const isShaddah = /(?:^|\P{L})(?:ال)?(?:شدة|شدّة|مشدد)(?:\P{L}|$)/u.test(strippedHeadline);
  const isMaddAlif = /مد.*ألف|مد بالألف/.test(strippedHeadline) || /مد.*ألف|مد بالألف/.test(strippedCleaned);
  const isMaddWaw = /مد.*واو|مد بالواو/.test(strippedHeadline) || /مد.*واو|مد بالواو/.test(strippedCleaned);
  const isMaddYaa = /مد.*ياء|مد بالياء/.test(strippedHeadline) || /مد.*ياء|مد بالياء/.test(strippedCleaned);

  if (isTanweenFath) {
    letterVisual = 'ـً';
  } else if (isTanweenDamm) {
    letterVisual = 'ـٌ';
  } else if (isTanweenKasr) {
    letterVisual = 'ـٍ';
  } else if (isFatha) {
    letterVisual = 'بَ';
  } else if (isDamma) {
    letterVisual = 'بُ';
  } else if (isKasra) {
    letterVisual = 'بِ';
  } else if (isSukun) {
    letterVisual = 'بْ';
  } else if (isShaddah) {
    letterVisual = 'ـّ';
  } else if (isMaddAlif) {
    letterVisual = 'بَا';
  } else if (isMaddWaw) {
    letterVisual = 'بُو';
  } else if (isMaddYaa) {
    letterVisual = 'بِي';
  } else {
    // If the headline is 1-2 Arabic letters (e.g. بَ or بْ or أ), keep its authentic display
    const lettersOnly = strippedHeadline.replace(/[\s\u0670\u0640]/g, '');
    if (/^[\u0621-\u064A]{1,2}$/.test(lettersOnly)) {
      letterVisual = headline.trim();
    }
  }

  // 1AP Arabic Letter & Phonetic symbol detection (display authentic Arabic letter rather than unrelated emojis)
  if (!letterVisual) {
    // 1. Single letter with or without harakat at start of headline, e.g. "نَ (حرف النون)" or "بَ (حرف الباء)"
    const startLetterMatch = headline.match(/^([أ-ي][\u064B-\u0652\u0670]?)(?:\s*\(.*|\s*[—\-:.]|$)/);
    if (startLetterMatch && startLetterMatch[1]) {
      letterVisual = startLetterMatch[1];
    }
  }

  if (!letterVisual) {
    // 2. "حرف المِيمِ (م)" or "حرف الباء (ب)" or "حرف (أ)"
    const namedLetterMatch = cleaned.match(/حرف\s+[^\s)(]+\s*\(([أ-ي][\u064B-\u0652\u0670]?)\)/) ||
                             cleaned.match(/حرف\s*\(([أ-ي][\u064B-\u0652\u0670]?)\)/);
    if (namedLetterMatch && namedLetterMatch[1]) {
      letterVisual = namedLetterMatch[1];
    }
  }

  if (!letterVisual) {
    // 3. Connected letter forms: بـ or ـبـ or ـب or تـ or ـتـ or ـت
    const connectedMatch = cleaned.match(/(ـ?[أ-ي]ـ?ـ)/);
    if (connectedMatch && connectedMatch[1]) {
      letterVisual = connectedMatch[1];
    }
  }

  if (!letterVisual) {
    // 4. Special cases: Hamza "ء", "الصَّادُ ص", "ط أم ظ", "حرف الثاء (ث)"
    if (strippedHeadline.includes('همزة') || strippedCleaned.includes('همزة')) {
      letterVisual = 'ء';
    } else if (/ط\s*أم\s*ظ/.test(strippedCleaned)) {
      letterVisual = 'ط / ظ';
    } else if (/صاد.*ص/.test(strippedCleaned)) {
      letterVisual = 'ص';
    } else if (/ضاد.*ض/.test(strippedCleaned)) {
      letterVisual = 'ض';
    } else if (/طاء.*ط/.test(strippedCleaned)) {
      letterVisual = 'ط';
    } else if (/ظاء.*ظ/.test(strippedCleaned)) {
      letterVisual = 'ظ';
    } else if (strippedCleaned.includes('حرف الثاء') || strippedCleaned.includes('لحرف الثاء')) {
      letterVisual = 'ث';
    } else if (strippedCleaned.includes('حرف القاف') || strippedCleaned.includes('لحرف القاف')) {
      letterVisual = 'ق';
    } else if (strippedCleaned.includes('حرف الفاء') || strippedCleaned.includes('لحرف الفاء')) {
      letterVisual = 'ف';
    }
  }

  let emoji = emojiMatch?.[0] ?? '';
  if (!emoji && !letterVisual) {
    const mapped = FALLBACK_EMOJI.find(([re]) => re.test(headline) || re.test(cleaned));
    emoji = mapped?.[1] ?? siblingEmoji ?? DEFAULT_TILES[fallbackIndex % DEFAULT_TILES.length];
  }

  const speak = [headline, whisper].filter(Boolean).join('. ');
  return { emoji, headline, whisper, speak, letterVisual };
}

/** Split a long discovery/example into tap-sized lines (each gets its own audio). */
export function splitPlayfulLines(raw: string): string[] {
  const cleaned = stripLatinGlosses(raw).trim();
  if (!cleaned) return [];
  const parts = cleaned.split(/(?<=[؟?!])\s+/).map((p) => p.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [cleaned];
}

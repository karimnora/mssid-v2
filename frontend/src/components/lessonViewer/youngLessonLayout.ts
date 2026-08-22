import type { PrimaryGrade } from '../../types';
import type { TabId } from './shared';

/** 1AP only: picture-first sheet. 2AP stays on the compact (not preschool) viewer. */
export const isPlayful1AP = (grade?: PrimaryGrade | string) => grade === '1AP';

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
  [/فَتْح|فتحة/, '🍋'],
  [/ضَمّ|ضمة/, '🌙'],
  [/كَسْر|كسرة/, '⬇️'],
  [/سُكُون|سكون/, '⭕'],
  [/فَوْق|فوق/, '☝️'],
  [/تَحْت|تحت/, '👇'],
  [/أَمَام|امام|أمام/, '👀'],
  [/وَرَاء|وراء/, '🔙'],
  [/بَيْن|بين/, '↔️'],
  [/أَعْلَى|أعلى/, '⬆️'],
  [/أَسْفَل|أسفل/, '⬇️'],
  [/مُرَبَّع|مربع/, '⬜'],
  [/دَائِرَة|دائرة/, '⭕'],
  [/مُثَلَّث|مثلث/, '🔺'],
  [/مُسْتَطِيل|مستطيل/, '▬'],
];

const DEFAULT_TILES = ['⭐', '🎈', '🌈', '🌸', '🐱', '⚽', '🌙', '🍀'];

export type PlayfulSnippet = {
  emoji: string;
  headline: string;
  whisper: string;
  speak: string;
  letterVisual: string | null;
};

function shortenWhisper(text: string): string {
  const noParens = text.replace(/\([^)]*\)/g, '').replace(/\s{2,}/g, ' ').trim();
  if (noParens.length <= 42) return noParens;
  const cut = noParens.slice(0, 42);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 16 ? cut.slice(0, lastSpace) : cut).trim();
}

/** Picture + short word for a 6-year-old. TTS reads only this snippet, never the whole lesson. */
export function parsePlayfulSnippet(raw: string, fallbackIndex = 0): PlayfulSnippet {
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
        headline = withoutEmoji.slice(0, 28).trim();
        whisper = shortenWhisper(withoutEmoji.slice(28).trim());
      } else {
        headline = withoutEmoji;
        whisper = '';
      }
    }
  }

  let emoji = emojiMatch?.[0] ?? '';
  if (!emoji) {
    const mapped = FALLBACK_EMOJI.find(([re]) => re.test(headline) || re.test(cleaned));
    emoji = mapped?.[1] ?? DEFAULT_TILES[fallbackIndex % DEFAULT_TILES.length];
  }

  const lettersOnly = headline.replace(/[\s\u064B-\u0652\u0670\u0640]/g, '');
  const letterVisual = /^[\u0621-\u064A]{1,2}$/.test(lettersOnly) ? lettersOnly : null;

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

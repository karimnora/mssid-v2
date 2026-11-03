import type { CourseLesson, PrimaryGrade, SubjectId } from '../types';

/**
 * « مساعدي » question bank: every quiz question and progressive exercise of the published catalog,
 * with its prepared answer. No generative AI — the answer shown is exactly what the lesson author wrote.
 */
export interface MusaidiItem {
  id: string;
  lessonId: string;
  grade: PrimaryGrade;
  subject: SubjectId;
  trimester?: 1 | 2 | 3;
  kind: 'quiz' | 'exercise';
  questionAr: string;
  /** Free help: never contains the answer. */
  hintsAr: string[];
  /** Behind the daily quota for free accounts. */
  answerAr: string;
  stepsAr: string[];
  operationsAr?: string;
  irabTableAr?: { wordAr: string; analysisAr: string }[];
}

const clean = (value?: string | null) => (value ?? '').trim();
const revealsAnswer = (label: string) => /الحل|الجواب|الإجابة/.test(label);
const splitSteps = (text: string) =>
  text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

export function buildMusaidiBank(lessons: CourseLesson[]): MusaidiItem[] {
  const items: MusaidiItem[] = [];
  for (const lesson of lessons) {
    const base = { lessonId: lesson.id, grade: lesson.grade, subject: lesson.subject, trimester: lesson.trimester };
    for (const q of lesson.quiz ?? []) {
      const correct = q.options.find((o) => o.isCorrect);
      if (!clean(q.questionAr) || !correct || !clean(correct.textAr)) continue;
      items.push({
        ...base,
        id: `${lesson.id}:quiz:${q.id}`,
        kind: 'quiz',
        questionAr: clean(q.questionAr),
        hintsAr: clean(q.hintAr) ? [clean(q.hintAr)] : [],
        answerAr: clean(correct.textAr),
        stepsAr: clean(correct.explanationAr) ? [clean(correct.explanationAr)] : [],
      });
    }
    for (const ex of lesson.progressiveExercises ?? []) {
      const answer = clean(ex.solutionAr);
      if (!clean(ex.problemAr) || !answer) continue;
      const hints = ex.progressiveHints?.length
        ? ex.progressiveHints.filter((h) => !revealsAnswer(h.labelAr)).map((h) => clean(h.contentAr))
        : (ex.hintsAr ?? []).map(clean);
      items.push({
        ...base,
        id: `${lesson.id}:exercise:${ex.id}`,
        kind: 'exercise',
        questionAr: clean(ex.problemAr),
        hintsAr: hints.filter((h) => h && h !== answer).slice(0, 2),
        answerAr: answer,
        stepsAr: splitSteps(clean(ex.detailedCorrectionAr)).filter((s) => s !== answer),
        operationsAr: clean(ex.operationsAr) || undefined,
        irabTableAr: ex.irabTableAr?.length ? ex.irabTableAr : undefined,
      });
    }
  }
  return items;
}

/** Arabic search ignores harakat, tatweel and alef/ya/ta-marbuta spelling variants. */
export function normalizeArabic(text: string): string {
  return text
    .replace(/[ً-ْٰـ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .toLowerCase()
    .trim();
}

export function searchMusaidi(items: MusaidiItem[], query: string): MusaidiItem[] {
  const words = normalizeArabic(query).split(/\s+/).filter(Boolean);
  if (!words.length) return items;
  return items.filter((item) => {
    const haystack = normalizeArabic(item.questionAr);
    return words.every((w) => haystack.includes(w));
  });
}

export const MUSAIDI_FREE_DAILY_CORRECTIONS = 3;

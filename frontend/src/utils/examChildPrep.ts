import { ExamExercise, SubjectId } from '../types';

export const EXAM_SUBJECT_EMOJI: Record<string, string> = {
  math: '📐',
  arabic: '📖',
  science: '🧪',
  french: '🇫🇷',
  english: '🇬🇧',
  history_geo: '🌍',
  islamic: '🕌',
  civics: '⚖️',
};

export function getChildPrepHint(ex: ExamExercise): string {
  return ex.childPrepHintAr ?? 'اقرأ السؤال ببطء مع وليّ أمرك، ثم فكّر قبل الإجابة.';
}

export function getExamSubjectEmoji(subject: SubjectId): string {
  return EXAM_SUBJECT_EMOJI[subject] ?? '📝';
}

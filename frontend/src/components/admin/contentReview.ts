import type { ContentSource, CourseLesson } from '../../types';

export type ReviewStatus = ContentSource | 'unspecified';
export const REVIEW_LABELS: Record<ReviewStatus, string> = {
  official_verified: 'متحقق منه رسمياً',
  corroborated: 'مدعوم بمصادر ثانوية',
  complementary: 'محتوى تكميلي',
  needs_verification: 'يحتاج إلى تحقق',
  unspecified: 'حالة غير محددة',
};
export const reviewStatus = (lesson: CourseLesson): ReviewStatus => lesson.contentSource ?? 'unspecified';
const normalize = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, '').toLowerCase();

/** Structural checks are review prompts, never a claim of pedagogical correctness. */
export function reviewIssues(lesson: CourseLesson): string[] {
  const issues: string[] = [];
  if (!lesson.contentSource) issues.push('حالة المراجعة غير محددة');
  if (!lesson.sourceNoteAr?.trim() && !lesson.sourceReference?.trim()) issues.push('مصدر أو ملاحظة المراجعة غير موثقة');
  if (lesson.contentSource === 'official_verified' && (lesson.sourceType !== 'ministry_official' || !lesson.sourceReference?.trim())) {
    issues.push('التحقق الرسمي يحتاج إلى مرجع رسمي موثق');
  }
  lesson.quiz.forEach((question, index) => {
    const correct = question.options.filter(option => option.isCorrect);
    if (!question.questionAr.trim() || question.options.length < 2 || correct.length !== 1 || question.options.some(option => !option.textAr.trim())) {
      issues.push(`السؤال ${index + 1}: راجع النص والاختيارات والإجابة الصحيحة`);
    }
  });
  return issues;
}

export interface ReviewFilters { query: string; grade: string; subject: string; trimester: string; status: string; needsAttention: boolean }
export function filterReviewLessons(lessons: CourseLesson[], filters: ReviewFilters): CourseLesson[] {
  const query = normalize(filters.query.trim());
  return lessons.filter(lesson => {
    if (filters.grade && lesson.grade !== filters.grade) return false;
    if (filters.subject && lesson.subject !== filters.subject) return false;
    // Missing trimester stays explicit; it is never silently assigned to T1.
    if (filters.trimester && String(lesson.trimester ?? 'unspecified') !== filters.trimester) return false;
    if (filters.status && reviewStatus(lesson) !== filters.status) return false;
    if (filters.needsAttention && lesson.contentSource !== 'needs_verification' && lesson.contentSource && reviewIssues(lesson).length === 0) return false;
    return !query || normalize([lesson.id, lesson.titleAr, lesson.summaryAr, lesson.subject, lesson.sourceReference, lesson.sourceNoteAr].join(' ')).includes(query);
  });
}

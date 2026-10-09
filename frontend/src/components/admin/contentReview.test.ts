import { describe, expect, it } from 'vitest';
import type { CourseLesson } from '../../types';
import { filterReviewLessons, reviewIssues, reviewStatus, ReviewFilters } from './contentReview';

const base: CourseLesson = {
  id: 'sample', grade: '1AP', subject: 'math', categoryAr: 'حساب', titleAr: 'الأَعْدَادُ',
  summaryAr: 'Numération', rulesAr: ['قاعدة'], quiz: [], sourceNoteAr: 'تأليف أصلي', contentSource: 'complementary',
};
const filters: ReviewFilters = { query: '', grade: '', subject: '', trimester: '', status: '', needsAttention: false };

describe('Content review catalog', () => {
  it('keeps missing provenance and trimester explicit, without promoting the lesson', () => {
    const lesson = { ...base, contentSource: undefined };
    expect(reviewStatus(lesson)).toBe('unspecified');
    expect(filterReviewLessons([lesson], { ...filters, trimester: '1' })).toEqual([]);
    expect(filterReviewLessons([lesson], { ...filters, trimester: 'unspecified', status: 'unspecified' })).toEqual([lesson]);
  });
  it('combines filters and searches Arabic diacritics, French accents and identifiers', () => {
    const lessons = [base, { ...base, id: 'other', grade: '5AP' as const }];
    expect(filterReviewLessons(lessons, { ...filters, query: 'الاعداد', grade: '1AP', subject: 'math' })).toEqual([base]);
    expect(filterReviewLessons(lessons, { ...filters, query: 'numeration', grade: '1AP' })).toEqual([base]);
    expect(filterReviewLessons(lessons, { ...filters, query: 'OTHER' })).toEqual([lessons[1]]);
  });
  it('surfaces malformed QCM and unsupported official claims without rewriting content', () => {
    const lesson: CourseLesson = { ...base, contentSource: 'official_verified', quiz: [{ id: 'q', questionAr: 'سؤال', options: [{ id: 'a', textAr: 'أ', isCorrect: true }, { id: 'b', textAr: 'ب', isCorrect: true }] }] };
    const before = JSON.stringify(lesson);
    expect(reviewIssues(lesson)).toHaveLength(2);
    expect(filterReviewLessons([lesson, base], { ...filters, needsAttention: true })).toEqual([lesson]);
    expect(JSON.stringify(lesson)).toBe(before);
  });
  it('includes lessons awaiting review even when their structural fields are complete', () => {
    const lesson = { ...base, contentSource: 'needs_verification' as const };
    expect(reviewIssues(lesson)).toEqual([]);
    expect(filterReviewLessons([lesson, base], { ...filters, needsAttention: true })).toEqual([lesson]);
  });
});

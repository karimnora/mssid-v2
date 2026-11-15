import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { CourseSelectionView } from './CourseSelectionView';
import { LocaleProvider } from '../context/LocaleContext';
import { CourseLesson, SubjectInfo } from '../types';
import { setStoredLocale } from '../localePreference';
import { speakText } from '../utils/speech';

const voices = vi.hoisted(() => ({ languages: ['ar-SA', 'fr-FR', 'en-US'] as string[] }));
vi.mock('../utils/speech', async importOriginal => ({
  ...await importOriginal<typeof import('../utils/speech')>(),
  useVoiceAvailable: (lang: string) => voices.languages.includes(lang),
  speakText: vi.fn().mockResolvedValue(undefined),
}));

const mockSubjects: SubjectInfo[] = [
  {
    id: 'math',
    nameAr: 'الرياضيات',
    nameFr: 'Mathématiques',
    description: 'دروس الرياضيات',
    icon: '📐',
    color: '#3B82F6',
    bgLight: 'bg-blue-50 text-blue-900 border-blue-200',
  },
];

const mockLessons: CourseLesson[] = [
  {
    id: 'math-t1-1',
    subject: 'math',
    grade: '5AP',
    trimester: 1,
    categoryAr: 'الرياضيات',
    titleAr: 'الأعداد الطبيعية 1',
    summaryAr: 'ملخص الدرس الأول',
    rulesAr: [],
    quiz: [],
  },
  {
    id: 'math-t1-2',
    subject: 'math',
    grade: '5AP',
    trimester: 1,
    categoryAr: 'الرياضيات',
    titleAr: 'الجمع والطرح',
    summaryAr: 'ملخص الدرس الثاني',
    rulesAr: [],
    quiz: [],
  },
  {
    id: 'math-t2-1',
    subject: 'math',
    grade: '5AP',
    trimester: 2,
    categoryAr: 'الرياضيات',
    titleAr: 'الكسور 1',
    summaryAr: 'ملخص درس الكسور',
    rulesAr: [],
    quiz: [],
  },
  {
    id: 'math-t3-1',
    subject: 'math',
    grade: '5AP',
    trimester: 3,
    categoryAr: 'الرياضيات',
    titleAr: 'التناسبية والنسب المئوية',
    summaryAr: 'ملخص درس التناسبية',
    rulesAr: [],
    quiz: [],
  },
];

describe('CourseSelectionView Trimester Animations & Display', () => {
  beforeEach(() => { setStoredLocale('ar'); voices.languages = ['ar-SA', 'fr-FR', 'en-US']; });
  afterEach(() => { setStoredLocale('ar'); voices.languages = ['ar-SA', 'fr-FR', 'en-US']; });
  it('hides unavailable 3AP titles and reads English titles with an English voice in a French interface', async () => {
    setStoredLocale('fr');
    const subject: SubjectInfo = { ...mockSubjects[0], id: 'english', nameAr: 'الإنجليزية', nameFr: 'Anglais' };
    const lesson: CourseLesson = { ...mockLessons[0], id: 'english-test', grade: '3AP', subject: 'english', titleAr: 'My school' };
    voices.languages = ['fr-FR'];
    const view = render(<LocaleProvider><CourseSelectionView grade="3AP" courseSubjects={[subject]}
      allCourseLessons={[lesson]} completedLessonIds={[]} onSelectLesson={vi.fn()} onGoHome={vi.fn()} initialSubjectId="english" /></LocaleProvider>);
    fireEvent.click(within(screen.getByRole('group')).getByRole('button', { name: /Trimestre 1/ }));
    expect(document.querySelector('[data-tap-speak="lesson-english-test"]')).toBeNull();
    view.unmount();
    voices.languages = ['en-US'];
    render(<LocaleProvider><CourseSelectionView grade="3AP" courseSubjects={[subject]}
      allCourseLessons={[lesson]} completedLessonIds={[]} onSelectLesson={vi.fn()} onGoHome={vi.fn()} initialSubjectId="english" /></LocaleProvider>);
    fireEvent.click(within(screen.getByRole('group')).getByRole('button', { name: /Trimestre 1/ }));
    await act(async () => fireEvent.click(document.querySelector('[data-tap-speak="lesson-english-test"]')!));
    expect(speakText).toHaveBeenCalledWith('My school', 'en-US', 0.85);
    voices.languages = ['ar-SA', 'fr-FR', 'en-US'];
    setStoredLocale('ar');
  });
  it('suggests the first unfinished accessible lesson, without changing completion', () => {
    const onSelectLesson = vi.fn();
    render(<LocaleProvider><CourseSelectionView grade="5AP" courseSubjects={mockSubjects}
      allCourseLessons={mockLessons} completedLessonIds={['math-t1-1']} onSelectLesson={onSelectLesson}
      onGoHome={vi.fn()} initialSubjectId="math" /></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: /الفصل الأول/ })!);
    fireEvent.click(document.querySelector('[data-course-start]')!);
    expect(onSelectLesson).toHaveBeenCalledWith(mockLessons[1]);
    expect(document.querySelector('[data-suggested] [data-lesson-id="math-t1-2"]')).toBeTruthy();
    expect(document.querySelectorAll('[data-completed]')).toHaveLength(1);
  });

  it('keeps an unavailable lesson out of the suggestion while its existing opening action remains usable', () => {
    const onSelectLesson = vi.fn();
    render(<LocaleProvider><CourseSelectionView grade="5AP" courseSubjects={mockSubjects}
      allCourseLessons={mockLessons} completedLessonIds={[]} onSelectLesson={onSelectLesson}
      isLessonLocked={lesson => lesson.id === 'math-t1-1'} onGoHome={vi.fn()} initialSubjectId="math" /></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: /الفصل الأول/ })!);
    fireEvent.click(document.querySelector('[data-course-start]')!);
    expect(onSelectLesson).toHaveBeenLastCalledWith(mockLessons[1]);
    fireEvent.click(screen.getByRole('button', { name: 'الأعداد الطبيعية 1' }));
    expect(onSelectLesson).toHaveBeenLastCalledWith(mockLessons[0]);
  });

  it('lets the header back button return from a subject to the subject list', () => {
    const backRef: { current: (() => void) | null } = { current: null };
    render(
      <LocaleProvider>
        <CourseSelectionView
          grade="5AP"
          courseSubjects={mockSubjects}
          allCourseLessons={mockLessons}
          completedLessonIds={[]}
          onSelectLesson={vi.fn()}
          onGoHome={vi.fn()}
          initialSubjectId="math"
          onSubjectStepBackChange={(action) => { backRef.current = action; }}
        />
      </LocaleProvider>
    );
    expect(backRef.current).toBeTypeOf('function');
    act(() => { backRef.current?.(); });
    expect(screen.queryByText('الأعداد الطبيعية 1')).not.toBeInTheDocument();
    expect(screen.getByText('الرياضيات')).toBeInTheDocument();
  });

  it('renders trimester tabs (1, 2, 3) and switches courses with animation', async () => {
    const onSelectLesson = vi.fn();
    render(
      <LocaleProvider>
        <CourseSelectionView
          grade="5AP"
          courseSubjects={mockSubjects}
          allCourseLessons={mockLessons}
          completedLessonIds={['math-t1-1']}
          onSelectLesson={onSelectLesson}
          onGoHome={vi.fn()}
          initialSubjectId="math"
        />
      </LocaleProvider>
    );

    // Should see tabs for all 3 trimesters
    expect(screen.getAllByText(/الفصل الأول/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/الفصل الثاني/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/الفصل الثالث/).length).toBeGreaterThan(0);

    // Click Trimester 1 tab button
    const t1Btn = screen.getByRole('button', { name: /الفصل الأول/ });
    expect(t1Btn).toBeTruthy();
    if (t1Btn) fireEvent.click(t1Btn);

    // Verify Trimester 1 lessons are shown
    expect(screen.getByRole('button', { name: 'الأعداد الطبيعية 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'الجمع والطرح' })).toBeInTheDocument();

    // Switch to Trimester 2
    const t2Btn = screen.getByRole('button', { name: /الفصل الثاني/ });
    expect(t2Btn).toBeTruthy();
    if (t2Btn) fireEvent.click(t2Btn);

    // Verify Trimester 2 lesson is displayed
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'الكسور 1' })).toBeInTheDocument();
    });

    // Switch to Trimester 3
    const t3Btn = screen.getByRole('button', { name: /الفصل الثالث/ });
    expect(t3Btn).toBeTruthy();
    if (t3Btn) fireEvent.click(t3Btn);

    // Verify Trimester 3 lesson is displayed
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'التناسبية والنسب المئوية' })).toBeInTheDocument();
    });
  });
});

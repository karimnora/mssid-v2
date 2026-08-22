import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CourseSelectionView } from './CourseSelectionView';
import { LocaleProvider } from '../context/LocaleContext';
import { CourseLesson, SubjectInfo } from '../types';

const mathSubject: SubjectInfo = {
  id: 'math',
  nameAr: 'الرياضيات',
  nameFr: 'Mathématiques',
  icon: 'Calculator',
  color: 'from-amber-500 to-emerald-600',
  bgLight: 'bg-amber-50',
  description: 'math',
  category: 'course',
};

const lesson = (id: string, titleAr: string): CourseLesson => ({
  id,
  grade: '1AP',
  subject: 'math',
  trimester: 1,
  categoryAr: 'الرياضيات',
  titleAr,
  summaryAr: 'ملخص طويل لا يجب أن يظهر في 1AP',
  rulesAr: ['قاعدة'],
  quiz: [{ id: 'q', questionAr: '؟', options: [{ id: 'a', textAr: 'نعم', isCorrect: true, explanationAr: 'لأن' }] }],
});

const lessons1ap: CourseLesson[] = [lesson('math-1ap-a', 'الأعداد'), lesson('math-1ap-b', 'المقارنة')];

const renderCourses = (grade: '1AP' | '5AP', completed: string[] = []) =>
  render(
    <LocaleProvider>
      <CourseSelectionView
        grade={grade}
        courseSubjects={[mathSubject]}
        allCourseLessons={
          grade === '5AP'
            ? lessons1ap.map((l) => ({ ...l, grade: '5AP' }))
            : lessons1ap
        }
        completedLessonIds={completed}
        onSelectLesson={vi.fn()}
        onGoHome={vi.fn()}
      />
    </LocaleProvider>
  );

describe('CourseSelectionView', () => {
  it('opens 1AP as a compact subject picker without a Lucide twin icon', async () => {
    renderCourses('1AP');
    expect(document.querySelector('[data-course-layout="compact"]')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /الرياضيات/ }));
    expect(document.querySelector('[data-trimester-tab="1"]')?.textContent).toContain('الفصل 1');
    expect(screen.queryByText(/Trimestre 1/)).not.toBeInTheDocument();
    expect(screen.queryByText(/ملخص طويل/)).not.toBeInTheDocument();
    expect(screen.queryByText(/أسئلة/)).not.toBeInTheDocument();
  });

  it('shows a single next-lesson CTA on 1AP for the first unfinished course', async () => {
    const onSelectLesson = vi.fn();
    render(
      <LocaleProvider>
        <CourseSelectionView
          grade="1AP"
          courseSubjects={[mathSubject]}
          allCourseLessons={lessons1ap}
          completedLessonIds={['math-1ap-a']}
          onSelectLesson={onSelectLesson}
          onGoHome={vi.fn()}
        />
      </LocaleProvider>
    );
    await userEvent.click(screen.getByRole('button', { name: /الرياضيات/ }));
    const cta = document.querySelector('[data-next-lesson-cta="math-1ap-b"]');
    expect(cta).toBeTruthy();
    await userEvent.click(cta as HTMLElement);
    expect(onSelectLesson).toHaveBeenCalledWith(expect.objectContaining({ id: 'math-1ap-b' }));
  });

  it('keeps a fuller layout from 5AP', async () => {
    renderCourses('5AP');
    expect(document.querySelector('[data-course-layout="full"]')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /الرياضيات/ }));
    expect(screen.getByText(/Trimestre 1|الفصل الأول/)).toBeInTheDocument();
  });
});

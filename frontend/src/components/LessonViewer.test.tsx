import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CourseLesson } from '../types';
import { LessonViewer } from './LessonViewer';
import { LocaleProvider } from '../context/LocaleContext';

const lesson: CourseLesson = {
  id: 'math-1ap-t1-spatial-relations',
  grade: '1AP',
  subject: 'math',
  categoryAr: 'فضاء',
  titleAr: 'الفَضَاءُ 🔺',
  summaryAr: 'فوق وتحت',
  discoveryAr: 'أين يوجد المصباح؟',
  sourceNoteAr: 'محتوى بيداغوجي أصلي أعدّته مَسِيد DZ.',
  objectivesAr: [
    'أُمَيِّزُ بَيْنَ "فَوْقَ" وَ "تَحْتَ".',
    'أَقُولُ «بَيْنَ» عِنْدَمَا يَكُونُ الشَّيْءُ فِي الوَسَطِ.',
  ],
  rulesAr: ['فَوْقَ: الشيء في الأعلى.', 'تَحْتَ: الشيء في الأسفل.'],
  examplesAr: [{ problem: 'أين تجلس القطة؟', solution: 'فوق الكرسي.' }],
  quiz: [],
  progressiveExercises: [],
};

const renderViewer = () =>
  render(
    <LocaleProvider>
      <LessonViewer
        lesson={lesson}
        onBack={vi.fn()}
        onCompleteQuiz={vi.fn()}
      />
    </LocaleProvider>,
  );

describe('LessonViewer — 1AP parent info panel', () => {
  it('offers the parent-info toggle when the lesson has objectives even without a source note', () => {
    renderViewer();
    expect(screen.getByText('معلومة لولي الأمر')).toBeInTheDocument();
  });

  it('shows the learning objectives to a parent who opens the panel, not just the sourcing note', () => {
    renderViewer();
    fireEvent.click(screen.getByText('معلومة لولي الأمر'));
    expect(screen.getByText('سيتعلم طفلك في هذا الدرس:')).toBeInTheDocument();
    expect(screen.getByText(/أُمَيِّزُ بَيْنَ/)).toBeInTheDocument();
    expect(screen.getByText(/مَسِيد DZ/)).toBeInTheDocument();
  });

  it('does not turn the title snippet into a second, redundant tap-to-speak zone', () => {
    const { container } = renderViewer();
    const heroTitle = container.querySelector('[data-lesson-hero="1ap"] h1');
    expect(heroTitle).toBeTruthy();
    expect(heroTitle?.closest('button')).toBeNull();
  });
});

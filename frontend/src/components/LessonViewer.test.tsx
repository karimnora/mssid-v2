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

describe('LessonViewer — 2AP sticky footer clearance', () => {
  it('reserves bottom padding so the sticky next-step footer does not cover lesson content', () => {
    const lesson2ap: CourseLesson = {
      ...lesson,
      id: 'math-2ap-sample',
      grade: '2AP',
      titleAr: 'الأعداد',
      quiz: [{ id: 'q1', questionAr: 'سؤال', options: [{ id: 'a', textAr: 'نعم', isCorrect: true }] }],
    };

    const { container } = render(
      <LocaleProvider>
        <LessonViewer lesson={lesson2ap} onBack={vi.fn()} onCompleteQuiz={vi.fn()} />
      </LocaleProvider>,
    );

    const contentPanel = container.querySelector('.pb-28');
    expect(contentPanel).toBeTruthy();
    expect(document.querySelector('[data-lesson-footer="compact"]')).toBeTruthy();
  });
});

describe('LessonViewer — printable revision sheet', () => {
  it('exposes the revision-sheet print entry on 1AP (compact grade)', () => {
    renderViewer();
    expect(document.querySelector('[data-lesson-print="true"]')).toBeTruthy();
  });

  it('opens a printable-sheet fiche when the print button is clicked', () => {
    renderViewer();
    fireEvent.click(document.querySelector('[data-lesson-print="true"]') as HTMLElement);
    expect(document.querySelector('.printable-sheet')).toBeTruthy();
    expect(screen.getAllByText(/فيشة مراجعة/).length).toBeGreaterThan(0);
  });
});

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

describe('LessonViewer — 3AP max 4 steps', () => {
  it('caps the 3AP step strip at four tabs even when the lesson has extra stages', () => {
    const lesson3ap: CourseLesson = {
      ...lesson,
      id: 'math-3ap-sample',
      grade: '3AP',
      titleAr: 'الضرب',
      quiz: [{ id: 'q1', questionAr: 'سؤال', options: [{ id: 'a', textAr: 'نعم', isCorrect: true }] }],
      progressiveExercises: [
        {
          id: 'ex1',
          level: 1,
          levelLabelAr: 'أكتشف',
          problemAr: '2×3',
          hintsAr: [],
          solutionAr: '6',
          detailedCorrectionAr: '2+2+2',
          xpReward: 5,
        },
      ],
      evaluationExercises: [
        {
          id: 'ev1',
          level: 4,
          levelLabelAr: 'أتحدى',
          problemAr: '4×5',
          hintsAr: [],
          solutionAr: '20',
          detailedCorrectionAr: '20',
          xpReward: 8,
        },
      ],
    };

    const { container } = render(
      <LocaleProvider>
        <LessonViewer lesson={lesson3ap} grade="3AP" onBack={vi.fn()} onCompleteQuiz={vi.fn()} />
      </LocaleProvider>,
    );

    const strip = container.querySelector('[data-lesson-step-count]');
    expect(strip).toBeTruthy();
    expect(Number(strip?.getAttribute('data-lesson-step-count'))).toBeLessThanOrEqual(4);
  });
});

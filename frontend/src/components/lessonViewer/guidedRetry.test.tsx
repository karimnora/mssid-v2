import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import type { CourseLesson, ProgressiveExercise } from '../../types';
import { PracticeExerciseCard } from '../PracticeExerciseCard';
import { LessonPracticePanel } from './LessonPracticePanel';
import { useLessonPractice } from './useLessonPractice';
import { getPracticeHints } from './practiceAssessment';

vi.mock('../preschool/usePreschoolAudio', () => ({ playGentleNudge: vi.fn(), playSuccessChime: vi.fn() }));
const exercise: ProgressiveExercise = {
  id: 'retry-test', level: 2, levelLabelAr: 'أتدرب', type: 'calculation', problemAr: 'احسب 12 × 4',
  hintsAr: ['اجمع 12 أربع مرات.'], calculationAnswer: 48, solutionAr: '48', detailedCorrectionAr: 'التصحيح الكامل: 12 × 4 = 48', xpReward: 15,
};
const props = {
  renderArabicText: (text: string | null | undefined) => text ?? '', answer: 'bad', onAnswerChange: vi.fn(),
  isChecked: true, isCorrect: false, canCheck: true, onCheck: vi.fn(), onReset: vi.fn(),
  matchingRightOrder: [0, 1], matchingConnections: { 0: 0, 1: 0 }, matchingSelectedLeft: null,
  onMatchingSelectLeft: vi.fn(), onConnectMatching: vi.fn(), onDisconnectMatching: vi.fn(),
  orderingShuffled: [0, 1], orderingSelection: [1, 0], onToggleOrderingItem: vi.fn(), retryFirst: true,
};

describe('retry before correction in ordinary practice', () => {
  it.each(['calculation', 'fill_blank', 'qcm', 'true_false', 'matching', 'ordering'] as const)('allows a meaningful retry for %s without leaking the answer', type => {
    const ex: ProgressiveExercise = { ...exercise, type, fillBlankAnswerAr: '48',
      options: [{ id: 'good', textAr: '48', isCorrect: true }, { id: 'bad', textAr: '40', isCorrect: false }],
      matchingPairsAr: [{ leftAr: 'أ', rightAr: 'ب' }, { leftAr: 'ج', rightAr: 'د' }], orderedItemsAr: ['أ', 'ب'],
    };
    const { container, rerender } = render(<PracticeExerciseCard {...props} ex={ex} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText(/التصحيح الكامل/)).not.toBeInTheDocument();
    expect(container.querySelector('.lucide-circle-check')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'حاول مرة أخرى' }));
    rerender(<PracticeExerciseCard {...props} ex={ex} isChecked={false} />);
    expect(screen.getByText(/اجمع 12 أربع مرات/)).toBeInTheDocument();
    rerender(<PracticeExerciseCard {...props} ex={ex} />);
    expect(screen.getByText(/التصحيح الكامل/)).toBeInTheDocument();
  });

  it('does not withhold the correction for a missing or stock hint', () => {
    const ex = { ...exercise, hintsAr: ['فَكِّرْ جَيِّداً قَبْلَ الإِجَابَةِ.'] };
    expect(getPracticeHints(ex)).toEqual([]);
    render(<PracticeExerciseCard {...props} ex={ex} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText(/التصحيح الكامل/)).toBeInTheDocument();
  });

  it('retains all concrete legacy hints in their authored order', () => {
    expect(getPracticeHints({ hintsAr: ['فكّر جيداً قبل الإجابة.', 'اجمع 12 أربع مرات.', 'ابدأ بـ 12 + 12.'] })
      .map(hint => hint.contentAr)).toEqual(['اجمع 12 أربع مرات.', 'ابدأ بـ 12 + 12.']);
  });

  it('enables the actual practice panel and awards only the successful answer once', () => {
    const reward = vi.fn();
    const lesson: CourseLesson = { id: 'ordinary-retry-lesson', grade: '4AP', subject: 'math', categoryAr: '', titleAr: '', summaryAr: '', rulesAr: [], quiz: [], progressiveExercises: [exercise] };
    function Harness() {
      const practice = useLessonPractice(lesson, reward);
      return <LessonPracticePanel lesson={lesson} practice={practice} renderArabicText={props.renderArabicText}
        gameAnswers={{}} onSelectGameOption={vi.fn()} onResetGame={vi.fn()} />;
    }
    render(<Harness />);
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '40' } });
    fireEvent.click(screen.getByRole('button', { name: 'تحقق من الإجابة' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(reward).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'حاول مرة أخرى' }));
    expect(screen.getByRole('spinbutton')).toHaveValue(null);
    expect(screen.getByText(/اجمع 12 أربع مرات/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '48' } });
    fireEvent.click(screen.getByRole('button', { name: 'تحقق من الإجابة' }));
    expect(reward).toHaveBeenCalledWith(lesson.id, 15);
    fireEvent.click(screen.getByRole('button', { name: 'أعيد التمرين' }));
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '48' } });
    fireEvent.click(screen.getByRole('button', { name: 'تحقق من الإجابة' }));
    expect(reward).toHaveBeenCalledTimes(1);
  });
});

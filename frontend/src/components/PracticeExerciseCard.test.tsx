import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PracticeExerciseCard } from './PracticeExerciseCard';
import { ProgressiveExercise } from '../types';

const baseEx: ProgressiveExercise = {
  id: 'ex1',
  level: 2,
  levelLabelAr: 'أتدرب',
  type: 'calculation',
  problemAr: 'احسب 12 × 4',
  hintsAr: [],
  calculationAnswer: 48,
  solutionAr: '48',
  detailedCorrectionAr: '12 × 4 = 48',
  xpReward: 15,
};

it('isolates subtraction in an Arabic hint so its operands cannot reverse', () => {
  const ex: ProgressiveExercise = { ...baseEx, hintsAr: ['أحسب 23 − 20 = 3، ثم أتحقق.'] };
  render(<PracticeExerciseCard {...cardProps} ex={ex} isChecked={false} />);
  fireEvent.click(screen.getByRole('button', { name: /أحتاج مساعدة/ }));
  expect(screen.getByText(/أحسب/).textContent).toContain('\u206623 − 20 = 3\u2069');
});

const cardProps = {
  renderArabicText: (t: string | undefined | null) => t || '',
  answer: 48 as string | number | undefined,
  onAnswerChange: vi.fn(),
  isChecked: true,
  isCorrect: true,
  canCheck: false,
  onCheck: vi.fn(),
  onReset: vi.fn(),
  matchingRightOrder: [] as number[],
  matchingConnections: {} as Record<number, number>,
  matchingSelectedLeft: null as number | null,
  onMatchingSelectLeft: vi.fn(),
  onConnectMatching: vi.fn(),
  onDisconnectMatching: vi.fn(),
  orderingShuffled: [] as number[],
  orderingSelection: [] as number[],
  onToggleOrderingItem: vi.fn(),
};

describe('PracticeExerciseCard official layouts', () => {
  it('labels guided practice as a correction to consult without success or XP', () => {
    const ex = { ...baseEx, type: undefined };
    const onCheck = vi.fn();
    const { rerender } = render(<PracticeExerciseCard {...cardProps} ex={ex} isChecked={false} onCheck={onCheck} canCheck />);
    fireEvent.click(screen.getByRole('button', { name: 'أرى التصحيح' }));
    expect(onCheck).toHaveBeenCalledWith(ex);
    expect(screen.queryByText(/XP/)).not.toBeInTheDocument();
    rerender(<PracticeExerciseCard {...cardProps} ex={ex} isCorrect={false} />);
    expect(screen.getByText('📖 التصحيح للمراجعة: قارن حلك بالشرح.')).toBeInTheDocument();
    expect(screen.queryByText(/إجابة صحيحة/)).not.toBeInTheDocument();
    expect(screen.queryByText(/ليست هذه الإجابة/)).not.toBeInTheDocument();
  });

  it('renders the shuffled QCM order and preserves choice IDs across rerenders', () => {
    const ex: ProgressiveExercise = { ...baseEx, type: 'qcm', options: [
      { id: 'a', textAr: '48', isCorrect: true }, { id: 'b', textAr: '40', isCorrect: false },
    ] };
    const onAnswerChange = vi.fn();
    const optionOrder = ['b', 'a'];
    const { rerender } = render(<PracticeExerciseCard {...cardProps} ex={ex} isChecked={false} optionOrder={optionOrder} onAnswerChange={onAnswerChange} />);
    expect(screen.getAllByRole('button').slice(0, 2).map(button => button.textContent)).toEqual(['40', '48']);
    fireEvent.click(screen.getByRole('button', { name: '48' }));
    expect(onAnswerChange).toHaveBeenCalledWith(ex.id, 'a');
    rerender(<PracticeExerciseCard {...cardProps} ex={ex} isChecked={false} optionOrder={optionOrder} answer="a" />);
    expect(screen.getAllByRole('button').slice(0, 2).map(button => button.textContent)).toEqual(['40', '48']);
  });

  it('shows exchanged identical matching targets as correct on each item', () => {
    const ex: ProgressiveExercise = { ...baseEx, type: 'matching', matchingPairsAr: [
      { leftAr: 'بنت', rightAr: 'مفتوحة' }, { leftAr: 'معلمات', rightAr: 'مفتوحة' },
    ] };
    render(<PracticeExerciseCard {...cardProps} ex={ex} matchingConnections={{ 0: 1, 1: 0 }} />);
    expect(screen.getByRole('button', { name: 'بنت' }).querySelector('.lucide-circle-check')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'معلمات' }).querySelector('.lucide-circle-check')).not.toBeNull();
    expect(document.querySelector('.lucide-circle-x')).toBeNull();
  });

  it('renders two-column math correction when operationsAr is set', () => {
    render(
      <PracticeExerciseCard
        {...cardProps}
        ex={{ ...baseEx, operationsAr: '  12\n×  4\n----\n  48' }}
      />,
    );

    expect(document.querySelector('[data-math-worked-example="two-column"]')).not.toBeNull();
    expect(document.querySelector('[data-math-column="operations"]')?.textContent).toContain('العمليات');
    expect(document.querySelector('[data-math-column="solution"]')?.textContent).toContain('الحل / الأجوبة');
  });

  it('renders الكلمة / إعرابها after check when irabTableAr is set', () => {
    render(
      <PracticeExerciseCard
        {...cardProps}
        ex={{
          ...baseEx,
          type: 'qcm',
          irabTableAr: [
            { wordAr: 'الجَزَائِرُ', analysisAr: 'فَاعِلٌ مَرْفُوعٌ' },
          ],
        }}
      />,
    );

    expect(document.querySelector('[data-irab-table]')).not.toBeNull();
    expect(screen.getByText('الكَلِمَةُ')).toBeInTheDocument();
    expect(screen.getByText('الجَزَائِرُ')).toBeInTheDocument();
  });
});

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

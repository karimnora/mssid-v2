import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChallengesArena } from './ChallengesArena';
import { LocaleProvider } from '../context/LocaleContext';
import { CHALLENGES_DATA } from '../data/challengesData';

vi.mock('./preschool/usePreschoolAudio', () => ({
  playSuccessChime: vi.fn(),
  playGentleNudge: vi.fn(),
}));

const renderArena = (grade: '1AP' | '2AP' | '3AP' | '5AP') =>
  render(
    <LocaleProvider>
      <ChallengesArena grade={grade} onChallengeComplete={vi.fn()} />
    </LocaleProvider>
  );

describe('ChallengesArena', () => {
  it('lists 1AP challenges and hides the arcade games tab', () => {
    renderArena('1AP');
    expect(document.querySelector('[data-challenges-layout="young"]')).toBeTruthy();
    expect(screen.queryByText('ألعاب الترويح')).not.toBeInTheDocument();
    // Displayed set rotates daily (seeded by date) instead of always the same first 3, so assert
    // membership in the 1AP pool rather than a specific fixed challenge.
    const oneApIds = new Set(CHALLENGES_DATA.filter((c) => c.grade === '1AP').map((c) => c.id));
    const cards = document.querySelectorAll('[data-challenge-id]');
    expect(cards.length).toBe(3);
    cards.forEach((card) => {
      expect(oneApIds.has(card.getAttribute('data-challenge-id')!)).toBe(true);
    });
  });

  it('lists 2AP challenges', () => {
    renderArena('2AP');
    const twoApIds = new Set(CHALLENGES_DATA.filter((c) => c.grade === '2AP').map((c) => c.id));
    const cards = document.querySelectorAll('[data-challenge-id]');
    expect(cards.length).toBe(3);
    cards.forEach((card) => {
      expect(twoApIds.has(card.getAttribute('data-challenge-id')!)).toBe(true);
    });
    expect(screen.queryByText('ألعاب الترويح')).not.toBeInTheDocument();
    expect(screen.queryByText('التحدي الكبير للفصل')).not.toBeInTheDocument();
  });

  it('lists 3AP islamic and civics challenges including today’s lesson pack', () => {
    renderArena('3AP');
    expect(screen.getByText('سباق أركان الإسلام والوضوء')).toBeInTheDocument();
    expect(screen.getByText('قواعد المدرسة ورموز الجزائر')).toBeInTheDocument();
    expect(screen.getAllByText('تدريب اليوم: التربية الإسلامية').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'التربية الإسلامية' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'التربية المدنية' })).toBeInTheDocument();
  });
});

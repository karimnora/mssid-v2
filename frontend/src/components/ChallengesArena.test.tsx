import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChallengesArena } from './ChallengesArena';
import { LocaleProvider } from '../context/LocaleContext';
import { CHALLENGES_DATA } from '../data/challengesData';

const renderArena = (grade: '1AP' | '2AP' | '5AP') =>
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
    const first = CHALLENGES_DATA.find((c) => c.grade === '1AP');
    expect(first).toBeTruthy();
    expect(screen.getByText(first!.titleAr)).toBeInTheDocument();
  });

  it('lists 2AP challenges', () => {
    renderArena('2AP');
    const first = CHALLENGES_DATA.find((c) => c.grade === '2AP');
    expect(first).toBeTruthy();
    expect(screen.getByText(first!.titleAr)).toBeInTheDocument();
    expect(screen.queryByText('ألعاب الترويح')).not.toBeInTheDocument();
  });
});

import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { LocaleProvider } from '../../context/LocaleContext';
import { setStoredLocale } from '../../localePreference';
import { ImmersiveLabShell, QuizBlock } from './ImmersiveLabShell';

vi.mock('../../utils/speech', () => ({ speakText: vi.fn(() => Promise.resolve()), stopSpeech: vi.fn() }));

beforeEach(() => setStoredLocale('fr'));
afterEach(() => cleanup());

const shell = (stars: number) => (
  <LocaleProvider>
    <ImmersiveLabShell badge="B" title="Souk" intro="Achète et rends la monnaie." tabs={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]} activeTab="b" onTab={() => undefined} stars={stars}>
      <p>contenu</p>
    </ImmersiveLabShell>
  </LocaleProvider>
);

describe('ImmersiveLabShell (« monde de jeu »)', () => {
  it('lets Didou read the intro aloud and marks the open tab', () => {
    render(shell(0));
    expect(screen.getByRole('button', { name: 'Écouter Didou' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-current', 'step');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('cheers only when a new star is earned', () => {
    const { rerender } = render(shell(0));
    rerender(shell(1));
    expect(screen.getByRole('status')).toHaveTextContent('Nouvelle étoile !');
    expect(document.querySelector('[data-lab-stars]')).toHaveAttribute('data-lab-stars', '1');
  });

  it('quiz answers expose candy states', () => {
    render(
      <LocaleProvider>
        <QuizBlock questionAr="س" optionsAr={['أ', 'ب']} correctAr="أ" picked="ب" onPick={() => undefined} />
      </LocaleProvider>,
    );
    const states = [...document.querySelectorAll('[data-quiz-option]')].map((el) => el.getAttribute('data-quiz-option'));
    expect(states).toEqual(['correct', 'retry']);
    expect(document.querySelector('[data-quiz-feedback]')).toHaveAttribute('data-quiz-feedback', 'retry');
  });
});

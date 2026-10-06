import React from 'react';
import { afterEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';
import { WilayasExplorer } from './WilayasExplorer';

// jsdom doesn't implement SpeechSynthesisUtterance — answering a quiz question triggers a real
// speakText() call (see utils/speech.ts) since voiceReading defaults to on.
class MockSpeechSynthesisUtterance {
  lang = '';
  rate = 1;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(public text: string) {}
}
(globalThis as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

afterEach(() => {
  setStoredLocale('ar');
  localStorage.removeItem('mssid_locale_preference');
  setStoredLocale('ar');
});

const renderLab = () =>
  render(
    <LocaleProvider>
      <WilayasExplorer />
    </LocaleProvider>,
  );

// Regression tests for the quiz-options display bug: showing the target wilaya's own name inside
// the answer options let a child solve "what is wilaya X's number?" by pattern-matching text instead
// of actually knowing the number, and showing nameAr + capitalAr together was pure redundant noise
// for the many wilayas whose capital shares the wilaya's name (e.g. بجاية / بجاية).
describe('WilayasExplorer — quiz options only reveal what the question actually tests', () => {
  // Scoped to the quiz answer buttons' own classes (p-4/rounded-2xl/border-2) rather than the
  // ".grid.grid-cols-2" wrapper, which the top tab-navigation bar also matches
  // (grid grid-cols-2 sm:grid-cols-4) and would otherwise get clicked by mistake.
  const getOptionButtons = (container: HTMLElement) =>
    Array.from(container.querySelectorAll<HTMLButtonElement>('button.p-4.rounded-2xl.border-2'));

  it('questionType 0 ("what is the wilaya\'s number?") never prints the wilaya name in the options', () => {
    const { container } = renderLab();
    fireEvent.click(screen.getByText('🏆 مسابقة وألغاز الولايات'));

    // quizIndex starts at 0, so WILAYAS_LIST[0] (أدرار) is always the first target and
    // questionType = 0 % 4 = 0 deterministically.
    expect(screen.getByText('ما هو رقم ولاية', { exact: false })).toBeInTheDocument();

    // The wilaya name should appear exactly once — inside the question — never again in an option.
    expect(screen.getAllByText('أدرار')).toHaveLength(1);

    const optionButtons = getOptionButtons(container);
    expect(optionButtons.length).toBe(4);
    optionButtons.forEach((b) => {
      expect(b.textContent).toMatch(/^الولاية \(\d+\)$/);
    });
  });

  it('questionType 2 ("what is the capital?") shows only capital names — never the wilaya name a second time', () => {
    const { container } = renderLab();
    fireEvent.click(screen.getByText('🏆 مسابقة وألغاز الولايات'));

    // Advance quizIndex from 0 to 2 (questionType 2 % 4 = 2) by answering + clicking "next" twice.
    for (let i = 0; i < 2; i++) {
      fireEvent.click(getOptionButtons(container)[0]);
      fireEvent.click(screen.getByText('السؤال التالي ➡️'));
    }

    expect(screen.getByText('ما هي عاصمة', { exact: false })).toBeInTheDocument();

    const optionButtons = getOptionButtons(container);
    expect(optionButtons.length).toBe(4);
    // Every option shows exactly one line of text (the capital name) — no wilaya-name duplicate line.
    optionButtons.forEach((b) => {
      expect(b.querySelectorAll('span').length).toBe(1);
    });
  });
});

describe('WilayasExplorer — next/prev by official number', () => {
  it('steps from Alger 16 to 17 without using the list', () => {
    renderLab();
    expect(document.querySelector('[data-wilaya-step]')?.textContent).toContain('16');
    fireEvent.click(document.querySelector('[data-wilaya-next]') as HTMLElement);
    expect(document.querySelector('[data-wilaya-step]')?.textContent).toContain('17');
    expect(document.querySelector('#wilaya-detail-panel h2')?.textContent).toContain('الجلفة');
  });
});

import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LocaleProvider } from '../../context/LocaleContext';
import { setStoredLocale } from '../../localePreference';
import { SoukLab } from './SoukLab';

const spoken: string[] = [];
vi.mock('../../utils/speech', () => ({
  speakText: vi.fn((text: string) => {
    spoken.push(text);
    return Promise.resolve();
  }),
  stopSpeech: vi.fn(),
}));

const el = (selector: string) => document.querySelector(selector) as HTMLElement;
const lastSpoken = () => spoken[spoken.length - 1] ?? '';

beforeEach(() => {
  spoken.length = 0;
  setStoredLocale('ar');
});

describe('SoukLab — guided by Didou', () => {
  it('Didou reads the shopping list as soon as the souk opens', () => {
    render(<SoukLab grade="1AP" />, { wrapper: LocaleProvider });
    expect(lastSpoken()).toContain('قَائِمَةُ مُشْتَرَيَاتِ اليَوْمِ');
    expect(el('[data-souk-list-item="bread"]')).toHaveAttribute('data-got', 'false');
  });

  it('an item that is not on the list is never added: Didou explains, no error', () => {
    render(<SoukLab grade="1AP" />, { wrapper: LocaleProvider });
    fireEvent.click(el('[data-souk-stall="milk"]'));
    expect(el('[data-souk-total]')).toHaveAttribute('data-souk-total', '0');
    expect(lastSpoken()).toContain('لَيْسَ فِي قَائِمَةِ اليَوْمِ');
  });

  it('buys bread, pays 100 DA, gets a hint on a wrong change, then earns one star for 50 DA', () => {
    const onReward = vi.fn();
    render(<SoukLab grade="1AP" onReward={onReward} />, { wrapper: LocaleProvider });

    fireEvent.click(el('[data-souk-stall="bread"]'));
    expect(el('[data-souk-list-item="bread"]')).toHaveAttribute('data-got', 'true');
    expect(lastSpoken()).toContain('المَجْمُوعُ 50');

    fireEvent.click(el('[data-souk-cash="100"]'));
    expect(el('[data-souk-given]')).toHaveAttribute('data-souk-given', '100');
    fireEvent.click(el('[data-souk-pay="true"]'));
    expect(lastSpoken()).toContain('دَفَعْتَ 100');

    fireEvent.click(el('[data-souk-change="60"]'));
    expect(lastSpoken()).toContain('100 نَاقِص 50');
    expect(onReward).not.toHaveBeenCalled();

    fireEvent.click(el('[data-souk-change="50"]'));
    expect(el('.souk-win')).toHaveTextContent('البَاقِي: 50 دج');
    expect(screen.getByText(/نَجْمَةٌ جَدِيدَةٌ/)).toBeInTheDocument();
    expect(onReward).toHaveBeenCalledTimes(1);
    expect(el('[data-souk-next="true"]')).toBeInTheDocument();
  });

  it('not enough money: Didou says how much is missing, and a piece can be taken back', () => {
    render(<SoukLab grade="1AP" />, { wrapper: LocaleProvider });
    fireEvent.click(el('[data-souk-stall="bread"]'));
    fireEvent.click(el('[data-souk-pay="true"]'));
    expect(lastSpoken()).toContain('يَنْقُصُكَ 50');
    fireEvent.click(el('[data-souk-cash="50"]'));
    expect(el('[data-souk-given]')).toHaveAttribute('data-souk-given', '50');
    fireEvent.click(screen.getByRole('button', { name: /لِتَسْتَرْجِعَهَا — 50/ }));
    expect(el('[data-souk-given]')).toHaveAttribute('data-souk-given', '0');
  });
});

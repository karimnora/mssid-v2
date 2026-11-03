import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { LocaleProvider } from '../../context/LocaleContext';
import { setStoredLocale } from '../../localePreference';
import { WorldFlagsLab } from './WorldFlagsLab';

const spoken: string[] = [];
vi.mock('../../utils/speech', () => ({
  speakText: vi.fn((text: string) => {
    spoken.push(text);
    return Promise.resolve();
  }),
  stopSpeech: vi.fn(),
}));

const el = (selector: string) => document.querySelector(selector) as HTMLElement;
const last = () => spoken[spoken.length - 1] ?? '';

beforeEach(() => {
  spoken.length = 0;
  setStoredLocale('ar');
});

describe('WorldFlagsLab — Didou tells each country', () => {
  it('tapping a flag makes Didou read its name, capital and fact aloud', () => {
    render(<WorldFlagsLab />, { wrapper: LocaleProvider });
    expect(last()).toContain('اُنْقُرْ عَلَى عَلَمٍ');
    fireEvent.click(el('[data-flag-country="tn"]'));
    expect(last()).toContain('تُونِسُ');
    expect(last()).toContain('العَاصِمَةُ');
    expect(el('[data-flag-selected]')).toHaveAttribute('data-flag-selected', 'tn');
  });

  it('« أين العلم؟ »: Algeria first; a wrong flag gets a gentle hint and no star, the right one is named', () => {
    const onReward = vi.fn();
    render(<WorldFlagsLab onReward={onReward} />, { wrapper: LocaleProvider });
    fireEvent.click(document.querySelectorAll('[data-lab-tab]')[1] as HTMLElement);
    expect(el('[data-flag-round]')).toHaveAttribute('data-flag-round', 'dz');
    expect(last()).toContain('أَيْنَ عَلَمُ الجَزَائِرُ');

    const wrong = [...document.querySelectorAll('[data-flag-option]')].find((b) => b.getAttribute('data-flag-option') !== 'dz') as HTMLElement;
    fireEvent.click(wrong);
    expect(wrong).toHaveAttribute('data-state', 'retry');
    expect(last()).toContain('حَاوِلْ مَرَّةً أُخْرَى');

    fireEvent.click(el('[data-flag-option="dz"]'));
    expect(el('[data-flag-option="dz"]')).toHaveAttribute('data-state', 'correct');
    expect(last()).toContain('أَحْسَنْتَ');
    // Found after a miss: no star.
    expect(onReward).not.toHaveBeenCalled();
    expect(el('[data-flag-next="true"]')).toBeInTheDocument();
  });

  it('a flag found at the first try earns one star', () => {
    const onReward = vi.fn();
    render(<WorldFlagsLab onReward={onReward} />, { wrapper: LocaleProvider });
    fireEvent.click(document.querySelectorAll('[data-lab-tab]')[1] as HTMLElement);
    fireEvent.click(el('[data-flag-option="dz"]'));
    expect(onReward).toHaveBeenCalledTimes(1);
    expect(el('[data-lab-stars]')).toHaveAttribute('data-lab-stars', '1');
  });
});

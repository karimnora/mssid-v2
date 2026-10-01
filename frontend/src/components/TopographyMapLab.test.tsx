import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';
import { TopographyMapLab } from './TopographyMapLab';
import { ALGERIA_MAP_CITIES, ALGERIA_OUTLINE_PATH } from '../data/algeriaMapOutline';

afterEach(() => {
  setStoredLocale('ar');
  localStorage.removeItem('mssid_locale_preference');
  setStoredLocale('ar');
});

const renderLab = () =>
  render(
    <LocaleProvider>
      <TopographyMapLab />
    </LocaleProvider>,
  );

describe('TopographyMapLab', () => {
  it('uses a geographic Algeria outline with the Tindouf western border', () => {
    expect(ALGERIA_OUTLINE_PATH.length).toBeGreaterThan(3000);
    expect(ALGERIA_OUTLINE_PATH).toContain('51.5');
    expect(ALGERIA_MAP_CITIES.map((city) => city.name)).toEqual(['وهران', 'الجزائر', 'قسنطينة', 'تمنراست']);
  });

  it('selects a region from the Algeria map and updates the detail panel', () => {
    renderLab();
    fireEvent.click(document.querySelector('[data-map-region="sahara"]')!);
    expect(screen.getByRole('heading', { name: /الصَّحْرَاءُ الكُبْرَى/ })).toBeInTheDocument();
  });

  it('keeps the north-south bars in sync with the map', () => {
    renderLab();
    fireEvent.click(document.querySelector('[data-section-region="high_plateaus"]')!);
    expect(screen.getByRole('heading', { name: /الهِضَابُ العُلْيَا/ })).toBeInTheDocument();
    expect(document.querySelector('[data-map-region="high_plateaus"]')).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not reveal the correct quiz option after a wrong pick', () => {
    renderLab();
    const rainfallQuestion = screen.getByText('أَيْنَ نَجِدُ أَعْلَى نِسْبَةِ أَمْطَارٍ فِي الجَزَائِرِ؟').parentElement as HTMLElement;
    fireEvent.click(within(rainfallQuestion).getByRole('button', { name: /الصَّحْرَاءُ/ }));
    const tellBtn = within(rainfallQuestion).getByRole('button', { name: /التَّلُّ/ });
    const saharaBtn = within(rainfallQuestion).getByRole('button', { name: /الصَّحْرَاءُ/ });
    expect(tellBtn.className).not.toContain('bg-emerald-100');
    expect(saharaBtn.className).toContain('border-[var(--brand-coral)]');
    fireEvent.click(tellBtn);
    expect(tellBtn.className).toContain('bg-emerald-100');
  });

  it('follows the app locale for chrome while keeping region names in Arabic', () => {
    setStoredLocale('fr');
    renderLab();
    expect(screen.getByRole('heading', { name: /Du littoral au Sahara/ })).toBeInTheDocument();
    expect(screen.getByText(/Teste tes connaissances/)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /التَّلُّ/ }).length).toBeGreaterThan(0);
    expect(screen.queryByText(/La formule de la vitesse/)).not.toBeInTheDocument();
  });
});

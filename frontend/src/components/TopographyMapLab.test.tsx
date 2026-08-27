import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { LocaleProvider } from '../context/LocaleContext';
import { TopographyMapLab } from './TopographyMapLab';
import { ALGERIA_MAP_CITIES, ALGERIA_OUTLINE_PATH } from '../data/algeriaMapOutline';

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
});

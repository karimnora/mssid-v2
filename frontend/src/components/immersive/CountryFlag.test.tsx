import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { CountryFlag } from './CountryFlag';

describe('CountryFlag', () => {
  it('draws the official Algerian green, white and red', () => {
    const { container } = render(<CountryFlag countryId="dz" />);
    const svg = container.querySelector('[data-country-flag="dz"] svg');
    expect(svg?.innerHTML).toContain('#006233');
    expect(svg?.innerHTML).toContain('#D21034');
    expect(svg?.innerHTML).toContain('#FFFFFF');
  });

  it('keeps a pentagram on the Moroccan flag instead of a filled star', () => {
    const { container } = render(<CountryFlag countryId="ma" />);
    expect(container.querySelector('polygon')?.getAttribute('fill')).toBe('none');
    expect(container.querySelector('polygon')?.getAttribute('stroke')).toBe('#006233');
  });

  it('draws the Sahrawi flag with a red crescent and star, not only Palestine bars', () => {
    const { container } = render(<CountryFlag countryId="eh" />);
    const svg = container.querySelector('[data-country-flag="eh"] svg');
    expect(svg?.innerHTML).toContain('#CE1126');
    expect(svg?.innerHTML).toContain('#007229');
    expect(container.querySelector('polygon')?.getAttribute('fill')).toBe('#CE1126');
    expect(container.querySelector('mask')).not.toBeNull();
  });

  it('uses mask and clip ids that every Android WebView can resolve (React 19 ids are sanitized)', () => {
    const { container } = render(<CountryFlag countryId="dz" />);
    const ids = [...container.querySelectorAll('[id]')].map((node) => node.id);
    expect(ids.length).toBeGreaterThan(0);
    ids.forEach((id) => expect(id).toMatch(/^[A-Za-z0-9_-]+$/));
  });
});

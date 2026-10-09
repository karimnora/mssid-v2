import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { getPrintableWorksheets, PRINTABLE_WORKSHEETS } from '../../data/preschool/printablesData';
import { PreschoolWorksheet } from './PreschoolWorksheet';

describe('preschool paper content', () => {
  it.each(['ar', 'fr', 'en'] as const)('prints the site address and fills tracing pages in %s', language => {
    for (const sheet of getPrintableWorksheets(language).filter(sheet => sheet.kind === 'letter_trace')) {
      const { container, unmount } = render(<PreschoolWorksheet sheet={sheet} language={language} />);
      expect(container.querySelectorAll('.paper-writing-row').length, sheet.id).toBeGreaterThanOrEqual(8);
      expect(container.querySelectorAll('.paper-trace').length, sheet.id).toBeGreaterThanOrEqual(35);
      expect(container.querySelectorAll('.paper-empty')).toHaveLength(24);
      expect(container.querySelector('.paper-draw-space')).toBeNull();
      expect(container.querySelector('.paper-footer a')?.textContent).toBe('mssid-dz.com');
      expect(container.querySelector('.paper-footer a')?.getAttribute('href')).toBe('https://mssid-dz.com');
      unmount();
    }
  });

  it('prevents direct printing of an Arabic letter sheet in French', () => {
    const sheet = PRINTABLE_WORKSHEETS.find(sheet => sheet.id === 'letter-trace-alif')!;
    const { container } = render(<PreschoolWorksheet sheet={sheet} language="fr" />);
    expect(container).toBeEmptyDOMElement();
  });

  it.each(['ar', 'fr', 'en'] as const)('keeps the brand visible on all available %s worksheets', language => {
    for (const sheet of getPrintableWorksheets(language)) {
      const { container, unmount } = render(<PreschoolWorksheet sheet={sheet} language={language} />);
      expect(container.querySelector('.paper-footer a')?.textContent, sheet.id).toBe('mssid-dz.com');
      unmount();
    }
  });
});

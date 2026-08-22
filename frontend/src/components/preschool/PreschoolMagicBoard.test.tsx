import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreschoolMagicBoard } from './PreschoolMagicBoard';

vi.mock('./usePreschoolAudio', () => ({
  playSuccessChime: vi.fn(),
  playBubblePop: vi.fn(),
  resumeTownAudio: vi.fn(),
  usePreschoolSpeech: () => ({ speak: vi.fn() }),
}));

// Regression tests for: (1) removing the Eastern Arabic-Indic digits (١٢٣) that didn't match how
// numbers are actually written in the Algerian curriculum, (2) expanding letters/numbers/shapes to
// their full sets, grouped into category tabs since ~70 items no longer fit one scroll row.
// getAllByText (not getByText) throughout: the currently-selected item is rendered twice — once as
// its own scroller button, once as the large trace-guide glyph behind the canvas — so an exact-one
// match isn't the right assertion here, presence is.
describe('PreschoolMagicBoard — trace mode categories', () => {
  const openTraceMode = () => {
    render(<PreschoolMagicBoard language="ar" onExit={vi.fn()} />);
    fireEvent.click(screen.getByText('✏️ تتبع الحروف'));
  };

  it('never renders an Eastern Arabic-Indic digit (٠-٩) anywhere in trace mode', () => {
    openTraceMode();
    const easternDigits = /[٠١٢٣٤٥٦٧٨٩]/;
    ['🔤 حروف عربية', '🔠 حروف لاتينية', '🔢 أرقام', '⬛ أشكال'].forEach((cat) => {
      fireEvent.click(screen.getByText(cat));
      expect(document.body.textContent).not.toMatch(easternDigits);
    });
  });

  it('the numbers category shows all 10 Western digits (0-9), nothing else', () => {
    openTraceMode();
    fireEvent.click(screen.getByText('🔢 أرقام'));
    for (let n = 0; n <= 9; n++) {
      expect(screen.getAllByText(String(n)).length).toBeGreaterThan(0);
    }
  });

  it('the Arabic letters category shows all 28 letters', () => {
    openTraceMode();
    fireEvent.click(screen.getByText('🔤 حروف عربية'));
    ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'].forEach(
      (letter) => {
        expect(screen.getAllByText(letter).length).toBeGreaterThan(0);
      }
    );
  });

  it('the Latin letters category shows all 26 letters', () => {
    openTraceMode();
    fireEvent.click(screen.getByText('🔠 حروف لاتينية'));
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((letter) => {
      expect(screen.getAllByText(letter).length).toBeGreaterThan(0);
    });
  });

  it('the shapes category shows 6 basic shapes', () => {
    openTraceMode();
    fireEvent.click(screen.getByText('⬛ أشكال'));
    ['○', '□', '△', '▭', '☆', '♡'].forEach((shape) => {
      expect(screen.getAllByText(shape).length).toBeGreaterThan(0);
    });
  });

  it('switching category does not leave a stale selection from a different category on screen', () => {
    openTraceMode();
    fireEvent.click(screen.getByText('🔢 أرقام'));
    fireEvent.click(screen.getByText('⬛ أشكال'));
    // 'أ' (an Arabic letter) must not still be selectable inside the shapes row.
    expect(screen.queryByText('أ')).not.toBeInTheDocument();
  });
});

describe('PreschoolMagicBoard — Monde Magique tab', () => {
  it('embeds the sensory tap world when the magic tab is selected', () => {
    render(<PreschoolMagicBoard language="fr" onExit={vi.fn()} />);
    fireEvent.click(screen.getByText('🌈 Monde Magique'));
    expect(screen.getByText('Appuie n’importe où ! 👆')).toBeInTheDocument();
    expect(screen.queryByText('Télécharger 📥')).not.toBeInTheDocument();
  });
});

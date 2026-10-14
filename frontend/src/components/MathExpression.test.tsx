import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderTextWithMath } from './MathExpression';
import { LRI, PDI } from '../utils/textFormatter';

describe('shared math display', () => {
  it.each(['(120 × 3) ÷ 4 = 90', '48 − 23 = 25', '٣ × ٢ = ٦', '12 x 3 = 36', '5 * 2 = 10'])
    ('keeps the complete calculation isolated in RTL: %s', formula => {
      const { container } = render(<p dir="rtl">الحل: {renderTextWithMath(formula)}</p>);
      expect(container.textContent).toBe(`الحل: ${LRI}${formula}${PDI}`);
      // No indivisible inline-block: a long formula can wrap on a narrow mobile screen.
      expect(container.querySelector('span')).toBeNull();
    });
  it('preserves surrounding prose and a plain number', () => {
    expect(renderTextWithMath('التمرين 3')).toBe('التمرين 3');
    expect(renderTextWithMath(null)).toBeNull();
  });
});

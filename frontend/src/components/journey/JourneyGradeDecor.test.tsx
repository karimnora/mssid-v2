import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { GradeDecor, hasGradeDecor } from './JourneyGradeDecor';
import { JOURNEYS } from '../../data/journey/journeyWorlds';

describe('grade decor of Didou’s maps', () => {
  it('gives 2AP to 5AP their own light and landmarks in every world, and leaves 1AP as it is', () => {
    expect(hasGradeDecor('1AP')).toBe(false);
    for (const grade of ['2AP', '3AP', '4AP', '5AP'] as const) {
      expect(hasGradeDecor(grade)).toBe(true);
      for (const world of JOURNEYS[grade]!) {
        const { container, unmount } = render(<svg><GradeDecor grade={grade} world={world.id} /></svg>);
        const decor = container.querySelector(`[data-grade-decor="${grade}:${world.id}"]`);
        expect(decor, `${grade} ${world.id}`).toBeTruthy();
        expect(decor!.querySelectorAll('path, rect, circle, ellipse, text').length, `${grade} ${world.id}`).toBeGreaterThanOrEqual(4);
        unmount();
      }
    }
  });

  it('writes numbers and formulas left to right, Arabic words right to left', () => {
    const { container } = render(<svg><GradeDecor grade="3AP" world="sahara" /><GradeDecor grade="3AP" world="tassili" /></svg>);
    const texts = [...container.querySelectorAll('text')];
    expect(texts.find((t) => t.textContent === '3 × 4 = 12')?.getAttribute('direction')).toBe('ltr');
    expect(texts.find((t) => t.textContent === 'مَتَى؟')?.getAttribute('direction')).toBe('rtl');
  });
});

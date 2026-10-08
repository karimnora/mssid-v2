import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { PreschoolMemoryCards } from './PreschoolMemoryCards';
import { ALGERIA_MODULE } from '../../data/preschool/algeriaModule';

vi.mock('./usePreschoolAudio', () => ({
  playSuccessChime: vi.fn(),
  playGentleNudge: vi.fn(),
}));

vi.mock('motion/react', () => {
  const React = require('react');
  const el = (tag: string) =>
    React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
      const { animate, initial, transition, whileHover, whileTap, ...rest } = props;
      void animate; void initial; void transition; void whileHover; void whileTap;
      return React.createElement(tag, { ...rest, ref });
    });
  return {
    motion: { div: el('div'), button: el('button') },
  };
});

describe('PreschoolMemoryCards flags', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('paints the Algerian flag as SVG when a pair is face-up', () => {
    const activity = ALGERIA_MODULE.activities.find((a) => a.id === 'algeria-memory')!;
    const { container } = render(<PreschoolMemoryCards activity={activity} onComplete={vi.fn()} />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(6);
    fireEvent.click(buttons[0]);
    expect(container.querySelector('svg[data-flag="DZ"]')).toBeTruthy();
  });
});

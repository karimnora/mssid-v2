import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreschoolTapChoice } from './PreschoolTapChoice';
import { NUMBERS_MODULE_0_TO_10 } from '../../data/preschool/numbersModule';
import { COLORS_MODULE } from '../../data/preschool/colorsModule';

vi.mock('./usePreschoolAudio', () => ({
  playSuccessChime: vi.fn(),
  playGentleNudge: vi.fn(),
}));

vi.mock('motion/react', () => {
  const React = require('react');
  const skip = (_props: Record<string, unknown>, ref: unknown) => ref;
  const el = (tag: string) =>
    React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
      const { animate, initial, transition, whileHover, whileTap, ...rest } = props;
      void animate; void initial; void transition; void whileHover; void whileTap; void skip;
      return React.createElement(tag, { ...rest, ref });
    });
  return {
    motion: { div: el('div'), button: el('button') },
  };
});

const activity = NUMBERS_MODULE_0_TO_10.activities[0];

describe('PreschoolTapChoice', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls onComplete only after the correct choice', () => {
    const onComplete = vi.fn();
    render(<PreschoolTapChoice activity={activity} language="fr" onComplete={onComplete} />);

    fireEvent.click(screen.getByLabelText('1'));
    vi.advanceTimersByTime(1000);
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('0'));
    vi.advanceTimersByTime(900);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('shows a real blue disc in the blue color activity', () => {
    const blue = COLORS_MODULE.activities.find((a) => a.id === 'colors-blue-sea')!;
    render(<PreschoolTapChoice activity={blue} language="ar" onComplete={vi.fn()} />);
    expect(document.querySelector('svg[data-color-dot="blue"]')).toBeTruthy();
  });
});

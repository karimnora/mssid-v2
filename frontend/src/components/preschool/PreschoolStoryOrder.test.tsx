import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { PreschoolStoryOrder } from './PreschoolStoryOrder';
import { STORIES_MODULE } from '../../data/preschool/storiesModule';

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
  return { motion: { div: el('div'), button: el('button') } };
});

describe('PreschoolStoryOrder', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('completes only when the three pictures are tapped in story order', () => {
    const onComplete = vi.fn();
    const activity = STORIES_MODULE.activities[0];
    render(<PreschoolStoryOrder activity={activity} language="fr" onComplete={onComplete} />);

    fireEvent.click(screen.getByLabelText('Content'));
    act(() => { vi.advanceTimersByTime(500); });
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText('Faim'));
    fireEvent.click(screen.getByLabelText('Couscous'));
    fireEvent.click(screen.getByLabelText('Content'));
    act(() => { vi.advanceTimersByTime(800); });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});

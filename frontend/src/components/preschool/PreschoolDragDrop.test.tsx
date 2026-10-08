import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { PreschoolDragDrop } from './PreschoolDragDrop';
import { NUMBERS_MODULE_0_TO_5 } from '../../data/preschool/numbersModule';

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

function dropApple(index: number) {
  const tray = screen.getAllByRole('button');
  const item = tray[index];
  fireEvent.pointerDown(item, { clientX: 10, clientY: 300, pointerId: index + 1 });
  fireEvent.pointerUp(item, { clientX: 80, clientY: 80, pointerId: index + 1 });
}

describe('PreschoolDragDrop give-among extras', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('completes after exactly three of five apples, not after emptying the tray', () => {
    const onComplete = vi.fn();
    const activity = NUMBERS_MODULE_0_TO_5.activities.find((a) => a.id === 'num-3')!;
    const { container } = render(<PreschoolDragDrop activity={activity} onComplete={onComplete} />);
    const zone = container.querySelector('.border-dashed') as HTMLElement;
    zone.getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 200, bottom: 200, width: 200, height: 200, x: 0, y: 0, toJSON: () => {} });

    dropApple(0);
    dropApple(0);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onComplete).not.toHaveBeenCalled();

    dropApple(0);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});

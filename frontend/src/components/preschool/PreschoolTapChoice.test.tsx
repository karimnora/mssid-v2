import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreschoolTapChoice } from './PreschoolTapChoice';
import { NUMBERS_MODULE_0_TO_10 } from '../../data/preschool/numbersModule';
import { COLORS_MODULE } from '../../data/preschool/colorsModule';
import { ALGERIA_MODULE } from '../../data/preschool/algeriaModule';
import { LOGIC_SPATIAL_MODULE } from '../../data/preschool/logicSpatialModule';

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

  it('paints real flags in Le Drapeau Algérien, not ISO letters', () => {
    const flag = ALGERIA_MODULE.activities.find((a) => a.id === 'algeria-flag-color')!;
    render(<PreschoolTapChoice activity={flag} language="fr" onComplete={vi.fn()} />);
    expect(document.querySelector('svg[data-flag="DZ"]')).toBeTruthy();
    expect(document.querySelector('svg[data-flag="JP"]')).toBeTruthy();
    expect(document.querySelector('svg[data-flag="BR"]')).toBeTruthy();
    expect(screen.queryByText('DZ')).toBeNull();
    expect(screen.queryByText('JP')).toBeNull();
    expect(screen.queryByText('BR')).toBeNull();
  });

  it('draws front/behind as a side-view scene, not a vertical emoji stack', () => {
    const frontBehind = LOGIC_SPATIAL_MODULE.activities.find((a) => a.id === 'logic-front-behind')!;
    const { container } = render(
      <PreschoolTapChoice activity={frontBehind} language="fr" onComplete={vi.fn()} />,
    );
    expect(container.querySelector('[data-spatial-scene="front"]')).toBeTruthy();
    expect(container.querySelector('[data-spatial-scene="behind"]')).toBeTruthy();
    expect(container.querySelector('[data-spatial-scene="front"] .flex-col')).toBeNull();
    expect(container.querySelector('[data-spatial-scene="behind"] .flex-col')).toBeNull();
  });

  it('shows the same ball inside an open box and beside it', () => {
    const inout = LOGIC_SPATIAL_MODULE.activities.find((a) => a.id === 'logic-inside-outside')!;
    const { container } = render(
      <PreschoolTapChoice activity={inout} language="fr" onComplete={vi.fn()} />,
    );
    expect(inout.interactionType).toBe('tap_choice');
    expect(container.querySelector('[data-spatial-scene="inside"]')).toBeTruthy();
    expect(container.querySelector('[data-spatial-scene="outside"]')).toBeTruthy();
    expect(screen.getByLabelText('Dedans')).toBeInTheDocument();
    expect(screen.getByLabelText('Dehors')).toBeInTheDocument();
  });
});

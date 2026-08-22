import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreschoolListenTap } from './PreschoolListenTap';
import { CALENDAR_MODULE } from '../../data/preschool/calendarModule';

const speak = vi.fn();

vi.mock('./usePreschoolAudio', () => ({
  playSuccessChime: vi.fn(),
  playGentleNudge: vi.fn(),
  usePreschoolSpeech: () => ({ speak, stop: vi.fn(), hasVoice: true }),
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

describe('PreschoolListenTap', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    speak.mockClear();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('speaks each day name and completes after every card is heard', () => {
    const onComplete = vi.fn();
    const days = CALENDAR_MODULE.activities.find((a) => a.id === 'calendar-days')!;
    render(<PreschoolListenTap activity={days} language="fr" onComplete={onComplete} />);

    fireEvent.click(screen.getByLabelText('Dimanche'));
    expect(speak).toHaveBeenCalledWith('Dimanche');
    vi.advanceTimersByTime(1000);
    expect(onComplete).not.toHaveBeenCalled();

    for (const name of ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']) {
      fireEvent.click(screen.getByLabelText(name));
    }
    vi.advanceTimersByTime(900);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});

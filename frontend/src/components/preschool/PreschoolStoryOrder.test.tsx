import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { PreschoolStoryOrder } from './PreschoolStoryOrder';
import { STORIES_MODULE } from '../../data/preschool/storiesModule';

vi.mock('./usePreschoolAudio', () => ({
  playSuccessChime: vi.fn(),
  playGentleNudge: vi.fn(),
  usePreschoolSpeech: () => ({ speak: vi.fn(), stop: vi.fn(), hasVoice: true }),
}));

vi.mock('../../hooks/useVoiceEcho', () => ({
  useVoiceEcho: () => ({
    phase: 'unsupported',
    failed: false,
    start: vi.fn(),
    stop: vi.fn(),
    play: vi.fn(),
    reset: vi.fn(),
  }),
  voiceEchoSupported: () => false,
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
    expect(onComplete).not.toHaveBeenCalled();
    expect(document.querySelector('[data-preschool-story="retell"]')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: "C'est dit !" }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('hides the mic when recording is unsupported', () => {
    const activity = STORIES_MODULE.activities[0];
    render(<PreschoolStoryOrder activity={activity} language="fr" onComplete={vi.fn()} />);
    fireEvent.click(screen.getByLabelText('Faim'));
    fireEvent.click(screen.getByLabelText('Couscous'));
    fireEvent.click(screen.getByLabelText('Content'));
    act(() => { vi.advanceTimersByTime(800); });
    expect(document.querySelector('[data-preschool-story="record"]')).toBeNull();
    expect(screen.getByRole('button', { name: "C'est dit !" })).toBeInTheDocument();
  });
  it('offers a model and keeps successful steps after an incorrect choice', () => {
    const activity = STORIES_MODULE.activities[0];
    const { container } = render(<PreschoolStoryOrder activity={activity} language="fr" onComplete={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: '👀 Voir l’histoire' }));
    expect(container.querySelector('[data-story-model]')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Faim'));
    fireEvent.click(screen.getByLabelText('Content'));
    act(() => { vi.advanceTimersByTime(500); });
    fireEvent.click(screen.getByLabelText('Couscous'));
    fireEvent.click(screen.getByLabelText('Content'));
    act(() => { vi.advanceTimersByTime(800); });
    expect(container.querySelector('[data-preschool-story="retell"]')).toBeTruthy();
  });

});

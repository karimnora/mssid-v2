import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreschoolActivityPlayer } from './PreschoolActivityPlayer';
import { NUMBERS_MODULE_0_TO_10 } from '../../data/preschool/numbersModule';
import { LETTERS_MODULE_START } from '../../data/preschool/lettersModule';

const speak = vi.fn();

vi.mock('./usePreschoolAudio', () => ({
  usePreschoolSpeech: () => ({ speak, stop: vi.fn(), hasVoice: true }),
  usePreschoolMute: () => ({ muted: false, toggle: vi.fn(), setMuted: vi.fn() }),
  playSuccessChime: vi.fn(),
  playGentleNudge: vi.fn(),
}));

const activity = NUMBERS_MODULE_0_TO_10.activities[0];
const traceB = LETTERS_MODULE_START.activities.find((item) => item.id === 'letters-trace-baa')!;

vi.mock('./PreschoolTrace', () => ({
  PreschoolTrace: ({ onComplete }: { onComplete: (quality?: string) => void }) => (
    <button type="button" onClick={() => onComplete('tried')}>J’ai essayé</button>
  ),
}));

describe('PreschoolActivityPlayer — skip vs complete', () => {
  it('Passer advances without calling onComplete', () => {
    const onComplete = vi.fn();
    const onSkip = vi.fn();
    render(
      <PreschoolActivityPlayer
        activity={activity}
        language="fr"
        hasNext
        onComplete={onComplete}
        onSkip={onSkip}
        onExit={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByText('Passer'));
    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('replays the prompt once if the child has not touched anything', () => {
    vi.useFakeTimers();
    speak.mockClear();
    render(
      <PreschoolActivityPlayer
        activity={activity}
        language="fr"
        hasNext
        onComplete={vi.fn()}
        onSkip={vi.fn()}
        onExit={vi.fn()}
      />,
    );
    vi.advanceTimersByTime(400);
    expect(speak).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(8000);
    expect(speak).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('does not congratulate a failed try as if the letter was written', () => {
    vi.useFakeTimers();
    speak.mockClear();
    const onComplete = vi.fn();
    render(
      <PreschoolActivityPlayer
        activity={traceB}
        language="fr"
        hasNext
        onComplete={onComplete}
        onSkip={vi.fn()}
        onExit={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText('J’ai essayé'));
    expect(speak).toHaveBeenCalledWith('Bravo d’avoir essayé. On peut recommencer.');
    expect(speak.mock.calls.some((call) => String(call[0]).includes('Tu as écrit'))).toBe(false);
    vi.advanceTimersByTime(1300);
    expect(onComplete).toHaveBeenCalledWith('tried');
    vi.useRealTimers();
  });
});

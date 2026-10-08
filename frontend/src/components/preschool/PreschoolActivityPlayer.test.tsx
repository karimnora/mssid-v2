import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreschoolActivityPlayer } from './PreschoolActivityPlayer';
import { NUMBERS_MODULE_0_TO_10 } from '../../data/preschool/numbersModule';

const speak = vi.fn();

vi.mock('./usePreschoolAudio', () => ({
  usePreschoolSpeech: () => ({ speak, stop: vi.fn(), hasVoice: true }),
  usePreschoolMute: () => ({ muted: false, toggle: vi.fn(), setMuted: vi.fn() }),
  playSuccessChime: vi.fn(),
  playGentleNudge: vi.fn(),
}));

const activity = NUMBERS_MODULE_0_TO_10.activities[0];

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
});

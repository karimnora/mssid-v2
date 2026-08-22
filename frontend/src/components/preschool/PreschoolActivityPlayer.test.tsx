import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreschoolActivityPlayer } from './PreschoolActivityPlayer';
import { NUMBERS_MODULE_0_TO_10 } from '../../data/preschool/numbersModule';

vi.mock('./usePreschoolAudio', () => ({
  usePreschoolSpeech: () => ({ speak: vi.fn(), stop: vi.fn(), hasVoice: true }),
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
});

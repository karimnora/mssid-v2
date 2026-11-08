import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
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
    <><button type="button" onClick={() => onComplete('tried')}>J’ai essayé</button>
      <button type="button" onClick={() => onComplete('wrote')}>J’ai écrit</button></>
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

  it('lets the recorded reward finish before advancing', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const recordedActivity = {
      ...LETTERS_MODULE_START.activities[0],
      echoWord: undefined,
      i18n: {
        ...LETTERS_MODULE_START.activities[0].i18n,
        fr: { ...LETTERS_MODULE_START.activities[0].i18n.fr, successAudioDurationMs: 4000 },
      },
    };
    render(<PreschoolActivityPlayer activity={recordedActivity} language="fr" hasNext
      onComplete={onComplete} onSkip={vi.fn()} onExit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'A' }));
    act(() => vi.advanceTimersByTime(2000));
    expect(onComplete).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(2600));
    expect(onComplete).toHaveBeenCalledWith('done');
    vi.useRealTimers();
  });

  it('does not congratulate a failed try as if the letter was written', () => {
    vi.useFakeTimers();
    speak.mockClear();
    const onComplete = vi.fn();
    const onAttempt = vi.fn();
    render(
      <PreschoolActivityPlayer
        activity={traceB}
        language="fr"
        hasNext
        onComplete={onComplete}
        onAttempt={onAttempt}
        onSkip={vi.fn()}
        onExit={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText('J’ai essayé'));
    expect(speak).toHaveBeenCalledWith('Bravo d’avoir essayé. On peut recommencer.');
    expect(speak.mock.calls.some((call) => String(call[0]).includes('Tu as écrit'))).toBe(false);
    vi.advanceTimersByTime(1300);
    expect(onAttempt).toHaveBeenCalledWith('tried');
    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Tu peux continuer à tracer ou recommencer.');
    fireEvent.click(screen.getByText('J’ai écrit'));
    fireEvent.click(screen.getByText('J’ai écrit'));
    act(() => vi.advanceTimersByTime(10_000));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('explored');
    vi.useRealTimers();
  });

  it('ignores the previous activity widget after navigating to a new one', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const props = { language: 'fr' as const, hasNext: true, onComplete, onSkip: vi.fn(), onExit: vi.fn() };
    const { rerender, unmount } = render(<PreschoolActivityPlayer activity={traceB} {...props} />);
    const retiredButton = screen.getByText('J’ai écrit');
    fireEvent.click(retiredButton);
    rerender(<PreschoolActivityPlayer activity={activity} {...props} />);
    act(() => vi.advanceTimersByTime(10_000));
    expect(onComplete).not.toHaveBeenCalled();
    unmount();
    act(() => vi.advanceTimersByTime(10_000));
    expect(onComplete).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
  it('reports helped after an incorrect choice followed by the right answer', async () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    const onAttempt = vi.fn();
    const item = { ...activity, echoWord: undefined };
    render(<PreschoolActivityPlayer activity={item} language="fr" hasNext onComplete={onComplete} onAttempt={onAttempt} onSkip={vi.fn()} onExit={vi.fn()} />);
    const choices = item.visualAssets.choices!;
    const label = (correct: boolean) => choices.find(choice => choice.isCorrect === correct)!.asset;
    fireEvent.click(screen.getByRole('button', { name: label(false) }));
    await act(async () => { await Promise.resolve(); });
    expect(onAttempt).toHaveBeenCalledWith('tried');
    act(() => vi.advanceTimersByTime(600));
    fireEvent.click(screen.getByRole('button', { name: label(true) }));
    act(() => vi.advanceTimersByTime(20000));
    expect(onComplete).toHaveBeenCalledWith('done_helped');
    vi.useRealTimers();
  });

});

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SpeedMathDuelGame } from './SpeedMathDuelGame';

vi.mock('../preschool/usePreschoolAudio', () => ({
  playSuccessChime: vi.fn(), playGentleNudge: vi.fn(), playModuleCompleteFanfare: vi.fn(),
}));
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function wrongAnswer(container: HTMLElement) {
  const equation = container.textContent!.match(/(\d+)\s*([+-])\s*(\d+)\s*=/)!;
  const answer = equation[2] === '+' ? Number(equation[1]) + Number(equation[3]) : Number(equation[1]) - Number(equation[3]);
  const option = screen.getAllByRole('button', { name: /^\d+$/ }).find(button => Number(button.textContent) !== answer)!;
  fireEvent.click(option);
}

describe('math duel delayed result', () => {
  it('does not award a result after the child leaves during final feedback', () => {
    const onComplete = vi.fn();
    const { container, unmount } = render(<SpeedMathDuelGame grade="1AP" onComplete={onComplete} />);
    wrongAnswer(container); act(() => vi.advanceTimersByTime(600));
    wrongAnswer(container); act(() => vi.advanceTimersByTime(600));
    wrongAnswer(container); unmount();
    act(() => vi.advanceTimersByTime(2000));
    expect(onComplete).not.toHaveBeenCalled();
  });
  it('awards once if time runs out during final feedback', () => {
    const onComplete = vi.fn();
    const { container } = render(<SpeedMathDuelGame grade="1AP" onComplete={onComplete} />);
    wrongAnswer(container); act(() => vi.advanceTimersByTime(600));
    wrongAnswer(container); act(() => vi.advanceTimersByTime(73_800));
    wrongAnswer(container); act(() => vi.advanceTimersByTime(2000));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});

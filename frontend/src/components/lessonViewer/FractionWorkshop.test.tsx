import { FRACTION_LINES } from './fractionJourneyContent';
import { pilotVoiceFor } from './villagePilotVoices';
import React from 'react';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FractionWorkshop } from './FractionWorkshop';
import { useFractionJourney } from './useFractionJourney';
const setup = () => renderHook(() => useFractionJourney(vi.fn()));
describe('linear fraction journey', () => {
  it('fills the actual touched part and forms one whole after five equal parts', () => {
    const { result } = setup();
    act(() => result.current.togglePart(4));
    expect(result.current.answer.parts).toEqual([4]);
    for (const part of [0, 1, 2, 3]) act(() => result.current.togglePart(part));
    expect(result.current.answer).toMatchObject({
      whole: 1,
      rest: 0,
      parts: [],
    });
    act(() => result.current.takePart(-1));
    expect(result.current.answer).toMatchObject({ whole: 0, rest: 4 });
  });
  it('conserves the seventeen available parts through tap and +/- alternatives', () => {
    const { result } = setup();
    for (let i = 0; i < 22; i++) act(() => result.current.takePart(1));
    expect(result.current.answer).toMatchObject({ whole: 3, rest: 2 });
    act(() => result.current.changeWhole(1));
    expect(result.current.answer.whole).toBe(3);
    act(() => result.current.changeWhole(-1));
    act(() => result.current.changeWhole(1));
    act(() => result.current.check());
    expect(result.current.learn.decompose).toMatchObject({
      completed: true,
      helped: false,
    });
  });
  it('blocks skipping, preserves help after returning and keeps retries constructive', () => {
    const { result } = setup();
    act(() => result.current.next());
    expect(result.current.step).toBe(0);
    act(() => result.current.check());
    expect(result.current.feedback).toBe('retry');
    act(() => result.current.revealHint());
    for (let i = 0; i < 3; i++) act(() => result.current.changeWhole(1));
    for (let i = 0; i < 2; i++) act(() => result.current.takePart(1));
    act(() => result.current.check());
    act(() => result.current.next());
    expect(result.current.step).toBe(1);
    act(() => result.current.previous());
    expect(result.current.answer).toMatchObject({ whole: 3, rest: 2 });
    expect(result.current.learn.decompose).toMatchObject({
      helped: true,
      attempts: 2,
    });
  });
  it('opens the lab only after the three discovery missions, then the explanation', () => {
    const speak = vi.fn();
    const { result } = renderHook(() => useFractionJourney(speak));
    for (let step = 0; step < 6; step++) {
      expect(result.current.step).toBe(step);
      if (step % 3 === 0) {
        for (let i = 0; i < (step < 3 ? 3 : 2); i++)
          act(() => result.current.changeWhole(1));
        for (let i = 0; i < (step < 3 ? 2 : 1); i++)
          act(() => result.current.takePart(1));
      } else if (step % 3 === 1)
        act(() => result.current.update({ lower: step < 3 ? 3 : 2 }));
      else act(() => result.current.update({ factor: step < 3 ? 5 : 2 }));
      act(() => result.current.check());
      act(() => result.current.next());
    }
    expect(result.current.stage.key).toBe('explain');
    expect(result.current.finished).toBe(false);
    act(() => result.current.explain(false));
    expect(result.current.finished).toBe(false);
    act(() => result.current.explain(true));
    expect(result.current.transfer.explain).toMatchObject({
      completed: true,
      helped: true,
    });
    act(() => result.current.newChallenge());
    expect(result.current.numerator).toBe(14);
    expect(result.current.denominator).toBe(4);
    expect(result.current.step).toBe(0);
    expect(result.current.answer.whole).toBe(0);
    expect(result.current.transfer).toEqual({});
    expect(speak.mock.calls.some((c) => c[1].includes('مختبر'))).toBe(true);
  });
  it('offers direct touches and no dropdowns or parallel mission tabs', () => {
    function Harness() {
      const j = useFractionJourney(vi.fn());
      return <FractionWorkshop journey={j} />;
    }
    const view = render(<Harness />);
    expect(view.container.querySelector('select')).toBeNull();
    expect(view.container.querySelector('[data-fraction-mission]')).toBeNull();
    const available = () => view.container.querySelectorAll('[data-loose-part="available"]').length;
    expect(available()).toBe(17);
    expect(view.container.querySelectorAll('.fraction-whole')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: 'جزء 5' }));
    expect(available()).toBe(16);
    expect(
      view.container.querySelector('[data-fraction-part="4"]')
    ).toHaveAttribute('aria-pressed', 'true');
    for (const part of [1, 2, 3, 4])
      fireEvent.click(screen.getByRole('button', { name: 'جزء ' + part }));
    expect(view.container.querySelectorAll('[data-return-whole]')).toHaveLength(
      1
    );
    expect(available()).toBe(12);
    fireEvent.click(view.container.querySelector('[data-return-whole]')!);
    expect(available()).toBe(17);
    expect(view.container.querySelectorAll('.fraction-whole')).toHaveLength(0);
  });
});

it('has recorded Nova guidance for every workshop announcement', () => {
  for (const line of Object.values(FRACTION_LINES))
    expect(pilotVoiceFor(line)).toEqual(expect.any(String));
});

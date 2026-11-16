import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { PreschoolDragDrop } from './PreschoolDragDrop';
import { NUMBERS_MODULE_0_TO_5 } from '../../data/preschool/numbersModule';

vi.mock('./usePreschoolAudio', () => ({
  playSuccessChime: vi.fn(),
  playGentleNudge: vi.fn(),
  usePreschoolSpeech: () => ({ speak: vi.fn(), stop: vi.fn(), hasVoice: true }),
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

const doneName = "J'ai fini";

function dropApple(index: number) {
  const tray = screen.getAllByLabelText('🍎');
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
    const { container } = render(<PreschoolDragDrop activity={activity} language="fr" onComplete={onComplete} />);
    const zone = container.querySelector('.border-dashed') as HTMLElement;
    zone.getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 200, bottom: 200, width: 200, height: 200, x: 0, y: 0, toJSON: () => {} });

    dropApple(0);
    dropApple(0);
    fireEvent.click(screen.getByRole('button', { name: doneName }));
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onComplete).not.toHaveBeenCalled();

    dropApple(0);
    expect(screen.getByText('3', { selector: 'bdi' })).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: doneName }));
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.getAllByLabelText('🍎')).toHaveLength(2);
  });

  it('does not auto-complete when the target count is reached', () => {
    const onComplete = vi.fn();
    const activity = NUMBERS_MODULE_0_TO_5.activities.find((a) => a.id === 'num-3')!;
    const { container } = render(<PreschoolDragDrop activity={activity} language="fr" onComplete={onComplete} />);
    const zone = container.querySelector('.border-dashed') as HTMLElement;
    zone.getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 200, bottom: 200, width: 200, height: 200, x: 0, y: 0, toJSON: () => {} });

    dropApple(0);
    dropApple(0);
    dropApple(0);
    expect(screen.getByText('3', { selector: 'bdi' })).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(1200); });
    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: doneName })).toBeInTheDocument();
  });

  it('returns a basket item to the tray and nudges if done too soon', () => {
    const onComplete = vi.fn();
    const activity = NUMBERS_MODULE_0_TO_5.activities.find((a) => a.id === 'num-3')!;
    const { container } = render(<PreschoolDragDrop activity={activity} language="fr" onComplete={onComplete} />);
    const zone = container.querySelector('.border-dashed') as HTMLElement;
    zone.getBoundingClientRect = () =>
      ({ left: 0, top: 0, right: 200, bottom: 200, width: 200, height: 200, x: 0, y: 0, toJSON: () => {} });

    dropApple(0);
    dropApple(0);
    dropApple(0);
    expect(screen.getAllByLabelText('🍎 basket')).toHaveLength(3);

    fireEvent.click(screen.getAllByLabelText('🍎 basket')[0]);
    expect(screen.getAllByLabelText('🍎 basket')).toHaveLength(2);
    expect(screen.getAllByLabelText('🍎')).toHaveLength(3);

    fireEvent.click(screen.getByRole('button', { name: doneName }));
    expect(screen.getByText('Pas encore ! Compte encore')).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('shows the Arabic done label when language is ar', () => {
    const activity = NUMBERS_MODULE_0_TO_5.activities.find((a) => a.id === 'num-3')!;
    render(<PreschoolDragDrop activity={activity} language="ar" onComplete={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'أَنْهَيْتُ' })).toBeInTheDocument();
  });
  it('allows tapping or keyboard activation without dragging', () => {
    const activity = NUMBERS_MODULE_0_TO_5.activities.find(a => a.id === 'num-3-guided')!;
    const { container } = render(<PreschoolDragDrop activity={activity} language="fr" onComplete={vi.fn()} />);
    expect(container.querySelectorAll('[data-quantity-guide] > span')).toHaveLength(3);
    fireEvent.click(screen.getAllByLabelText('🍎')[0]);
    fireEvent.keyDown(screen.getAllByLabelText('🍎')[0], { key: 'Enter' });
    fireEvent.keyDown(screen.getAllByLabelText('🍎')[0], { key: ' ' });
    expect(screen.getByText('3 / 3')).toBeInTheDocument();
    fireEvent.click(screen.getAllByLabelText('🍎')[0]);
    expect(screen.getAllByLabelText('🍎 basket')).toHaveLength(3);
  });

  it('without help, hides the target and lets the child put too many before checking', () => {
    const onComplete = vi.fn();
    const activity = NUMBERS_MODULE_0_TO_5.activities.find(a => a.id === 'num-3')!;
    const { container } = render(<PreschoolDragDrop activity={activity} language="fr" onComplete={onComplete} />);
    expect(container.querySelector('[data-quantity-guide]')).toBeNull();
    for (let i = 0; i < 4; i++) fireEvent.click(screen.getAllByLabelText('🍎')[0]);
    // Four apples are accepted and the counter does not reveal the expected number.
    expect(screen.getAllByLabelText('🍎 basket')).toHaveLength(4);
    expect(screen.queryByText(/ \/ 3$/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: doneName }));
    expect(screen.getByText('Pas encore ! Compte encore')).toBeInTheDocument();
    fireEvent.click(screen.getAllByLabelText('🍎 basket')[0]);
    fireEvent.click(screen.getByRole('button', { name: doneName }));
    act(() => { vi.advanceTimersByTime(1000); });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PreschoolActivityPlayer } from './PreschoolActivityPlayer';
import { PreschoolTrace } from './PreschoolTrace';
import { LETTERS_MODULE_START } from '../../data/preschool/lettersModule';

vi.mock('./usePreschoolAudio', () => ({
  usePreschoolSpeech: () => ({ speak: vi.fn(), stop: vi.fn(), hasVoice: true }),
  usePreschoolMute: () => ({ muted: false, toggle: vi.fn() }),
  playSuccessChime: vi.fn(), playGentleNudge: vi.fn(),
}));
const activity = LETTERS_MODULE_START.activities.find(item => item.id === 'letters-trace-baa')!;

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('PointerEvent', MouseEvent);
  // A missing device font may prevent rasterization; a drawn attempt must still be safe.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function draw(container: HTMLElement) {
  const svg = container.querySelector('svg[width="260"]')!;
  vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({ x: 0, y: 0, left: 0, top: 0, right: 260, bottom: 260, width: 260, height: 260, toJSON: () => ({}) });
  fireEvent.pointerDown(svg, { clientX: 40, clientY: 100, pointerId: 1 });
  fireEvent.pointerMove(svg, { clientX: 110, clientY: 100, pointerId: 1 });
  fireEvent.pointerUp(svg, { clientX: 110, clientY: 100, pointerId: 1 });
  return svg.querySelector('polyline')!.getAttribute('points');
}

describe('tracing attempts remain in the activity', () => {
  it.each(['ar', 'fr', 'en'] as const)('%s keeps the actual strokes after I tried without success or exit', language => {
    const onComplete = vi.fn(); const onAttempt = vi.fn(); const onExit = vi.fn();
    const { container } = render(<PreschoolActivityPlayer activity={activity} language={language} hasNext
      onComplete={onComplete} onAttempt={onAttempt} onExit={onExit} onSkip={vi.fn()} />);
    const points = draw(container);
    fireEvent.click(screen.getByRole('button', { name: language === 'ar' ? 'جَرَّبْتُ' : language === 'fr' ? 'J’ai essayé' : 'I tried' }));
    act(() => vi.advanceTimersByTime(5000));
    expect(onAttempt).toHaveBeenCalledExactlyOnceWith('tried');
    expect(onComplete).not.toHaveBeenCalled();
    expect(onExit).not.toHaveBeenCalled();
    expect(container.querySelector('svg[width="260"] polyline')!.getAttribute('points')).toBe(points);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  it('cancels a tracing result if the child leaves before the feedback delay ends', () => {
    const onComplete = vi.fn();
    const { container, unmount } = render(<PreschoolTrace activity={activity} language="fr" onComplete={onComplete} />);
    draw(container);
    fireEvent.click(screen.getByRole('button', { name: 'J’ai essayé' }));
    unmount();
    act(() => vi.advanceTimersByTime(5000));
    expect(onComplete).not.toHaveBeenCalled();
  });
});

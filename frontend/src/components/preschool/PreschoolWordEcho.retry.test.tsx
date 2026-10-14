import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
const start = vi.fn(); const stop = vi.fn();
vi.mock('../../hooks/useVoiceEcho', () => ({ useVoiceEcho: () => ({ phase: 'denied', failed: false, start, stop, play: vi.fn() }) }));
vi.mock('./usePreschoolAudio', () => ({ usePreschoolSpeech: () => ({ speak: vi.fn(), stop }) }));
import { PreschoolWordEcho } from './PreschoolWordEcho';
afterEach(() => vi.clearAllMocks());
describe('preschool microphone retry', () => {
  it.each([['ar', 'أَعِدْ مُحَاوَلَةَ المِيكْرُوفُون'], ['fr', 'Réessayer le micro'], ['en', 'Retry microphone']] as const)('keeps retry explicit and optional in %s', (language, label) => {
    const onDone = vi.fn();
    render(<PreschoolWordEcho language={language} word="test" picture="🐱" onDone={onDone} />);
    expect(start).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: label }));
    expect(start).toHaveBeenCalledTimes(1); expect(onDone).not.toHaveBeenCalled();
    expect(document.querySelector('[data-preschool-echo="done"]')).toBeTruthy();
  });
});

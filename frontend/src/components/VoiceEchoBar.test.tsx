import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { VoiceEchoPhase } from '../hooks/useVoiceEcho';

const echo = {
  phase: 'idle' as VoiceEchoPhase,
  failed: false,
  start: vi.fn(),
  stop: vi.fn(),
  play: vi.fn(),
  reset: vi.fn(),
  pausePlayback: vi.fn(),
};

vi.mock('../hooks/useVoiceEcho', () => ({
  useVoiceEcho: () => echo,
  voiceEchoSupported: () => true,
}));

const speakText = vi.fn().mockResolvedValue(undefined);
const stopSpeech = vi.fn();

vi.mock('../utils/speech', () => ({
  speakText: (...args: unknown[]) => speakText(...args),
  stopSpeech: (...args: unknown[]) => stopSpeech(...args),
}));

import { VoiceEchoBar } from './VoiceEchoBar';

describe('VoiceEchoBar', () => {
  beforeEach(() => {
    echo.phase = 'idle';
    echo.failed = false;
    echo.start.mockClear();
    echo.stop.mockClear();
    echo.play.mockClear();
    echo.reset.mockClear();
    speakText.mockClear();
    stopSpeech.mockClear();
  });

  it('plays the model then starts recording after stopping TTS', () => {
    render(<VoiceEchoBar modelText="قَلَم" language="ar" />);
    fireEvent.click(screen.getByRole('button', { name: 'أسمع النموذج' }));
    expect(speakText).toHaveBeenCalledWith('قَلَم', 'ar-SA', 0.85);

    fireEvent.click(screen.getByRole('button', { name: 'أقول' }));
    expect(stopSpeech).toHaveBeenCalled();
    expect(echo.start).toHaveBeenCalled();
  });

  it('keeps listen when the mic is missing, without a record button', () => {
    echo.phase = 'unsupported';
    render(<VoiceEchoBar modelText="chat" language="fr" />);
    expect(screen.getByRole('button', { name: "J'écoute" })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Je parle' })).not.toBeInTheDocument();
    expect(screen.getByText(/micro indisponible/i)).toBeInTheDocument();
  });

  it('renders nothing when the model is empty', () => {
    const { container } = render(<VoiceEchoBar modelText="   " language="en" />);
    expect(container.querySelector('[data-voice-echo="bar"]')).toBeNull();
  });

  it.each([['fr', 'Réessayer le micro'], ['en', 'Retry microphone'], ['ar', 'أعد محاولة الميكروفون']] as const)('allows an explicit retry after denial in %s', (language, label) => {
    echo.phase = 'denied';
    render(<VoiceEchoBar modelText="test" language={language} />);
    expect(echo.start).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: label }));
    expect(echo.start).toHaveBeenCalledTimes(1);
    expect(stopSpeech).toHaveBeenCalled();
  });

  it('cancels the parent sequence before listening, recording and replaying', () => {
    echo.phase = 'ready';
    const cancelParent = vi.fn();
    render(<VoiceEchoBar modelText="ship" language="en" onBeforeAction={cancelParent} />);
    fireEvent.click(screen.getByRole('button', { name: 'Listen' }));
    fireEvent.click(screen.getByRole('button', { name: 'I speak' }));
    fireEvent.click(screen.getByRole('button', { name: 'My voice' }));
    expect(cancelParent).toHaveBeenCalledTimes(3);
    expect(cancelParent.mock.invocationCallOrder[2]).toBeLessThan(echo.play.mock.invocationCallOrder[0]);
  });
});

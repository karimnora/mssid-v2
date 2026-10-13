import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TextToSpeechButton } from './TextToSpeechButton';
import { LocaleProvider } from '../context/LocaleContext';
import { setFeatureFlagOverride, resetFeatureFlagOverride } from '../featureFlags';

const voice = vi.hoisted(() => ({ speakText: vi.fn(), stopSpeech: vi.fn(), pauseSpeech: vi.fn(), resumeSpeech: vi.fn() }));
vi.mock('../utils/speech', () => voice);
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => true } }));

beforeEach(() => {
  Object.values(voice).forEach(mock => mock.mockReset());
  voice.speakText.mockReturnValue(new Promise<void>(() => {}));
  setFeatureFlagOverride('voiceReading', true);
});
afterEach(() => resetFeatureFlagOverride('voiceReading'));

describe('Android voice controls', () => {
  it('stops native speech instead of displaying a nonfunctional browser pause', () => {
    render(<LocaleProvider><TextToSpeechButton text="مرحبا" /></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'تشغيل' }));
    fireEvent.click(screen.getByRole('button', { name: 'إيقاف' }));
    expect(voice.stopSpeech).toHaveBeenCalled();
    expect(voice.pauseSpeech).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'تشغيل' })).toBeInTheDocument();
  });

  it('does not let an old completion clear the state of a newer reading', async () => {
    let finishOld!: () => void;
    voice.speakText.mockImplementationOnce(() => new Promise<void>(resolve => { finishOld = resolve; }));
    const view = render(<LocaleProvider><TextToSpeechButton text="مرحبا" /></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'تشغيل' }));
    view.rerender(<LocaleProvider><TextToSpeechButton text="نص آخر" /></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'تشغيل' }));
    await act(async () => finishOld());
    expect(screen.queryByRole('button', { name: 'تشغيل' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'إيقاف' })).toBeInTheDocument();
    view.unmount();
    expect(voice.stopSpeech).toHaveBeenCalled();
  });
});

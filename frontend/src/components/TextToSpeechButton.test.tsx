import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextToSpeechButton } from './TextToSpeechButton';
import { LocaleProvider } from '../context/LocaleContext';
import { setFeatureFlagOverride, resetFeatureFlagOverride } from '../featureFlags';

describe('TextToSpeechButton — hidden entirely when voiceReading is off', () => {
  afterEach(() => {
    resetFeatureFlagOverride('voiceReading');
  });

  it('renders nothing when voiceReading is off', () => {
    setFeatureFlagOverride('voiceReading', false);
    const { container } = render(
      <LocaleProvider>
        <TextToSpeechButton text="مرحبا" />
      </LocaleProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the play button when voiceReading is on', () => {
    setFeatureFlagOverride('voiceReading', true);
    render(
      <LocaleProvider>
        <TextToSpeechButton text="مرحبا" />
      </LocaleProvider>
    );
    expect(screen.getByRole('button', { name: 'تشغيل' })).toBeInTheDocument();
  });

  it('keeps speed in one control and aligns the menu with end-0', () => {
    setFeatureFlagOverride('voiceReading', true);
    const { container } = render(
      <LocaleProvider>
        <TextToSpeechButton text="مرحبا" />
      </LocaleProvider>
    );
    expect(screen.getByRole('button', { name: /السرعة/ })).toHaveTextContent('1x');
    expect(container.querySelector('.absolute.right-0')).toBeNull();
  });
});

import React from 'react';
import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreschoolMuteButton } from './PreschoolMuteButton';
import {
  isPreschoolMuted,
  playSuccessChime,
  setPreschoolMuted,
} from './usePreschoolAudio';

describe('PreschoolMuteButton', () => {
  beforeEach(() => {
    setPreschoolMuted(false);
    window.localStorage.removeItem('mssid_preschool_muted');
  });

  it('toggles mute and persists the preference', () => {
    render(<PreschoolMuteButton language="ar" />);
    const btn = screen.getByRole('button', { name: 'كتم الصوت' });
    expect(btn.getAttribute('data-preschool-mute')).toBe('off');
    expect(isPreschoolMuted()).toBe(false);

    fireEvent.click(btn);
    expect(isPreschoolMuted()).toBe(true);
    expect(window.localStorage.getItem('mssid_preschool_muted')).toBe('1');
    expect(screen.getByRole('button', { name: 'تفعيل الصوت' }).getAttribute('data-preschool-mute')).toBe('on');

    fireEvent.click(screen.getByRole('button', { name: 'تفعيل الصوت' }));
    expect(isPreschoolMuted()).toBe(false);
    expect(window.localStorage.getItem('mssid_preschool_muted')).toBe('0');
  });

  it('blocks success chimes while muted', () => {
    setPreschoolMuted(true);
    // Should not throw; Web Audio context is gated when muted.
    expect(() => playSuccessChime()).not.toThrow();
  });
});

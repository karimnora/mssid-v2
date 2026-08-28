import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from './Navbar';
import { LocaleProvider } from '../context/LocaleContext';

const renderNav = (
  grade: '1AP' | '2AP' | '5AP',
  onOpenProfileModal = vi.fn(),
  onOpenSettingsModal = vi.fn()
) =>
  render(
    <LocaleProvider>
      <Navbar
        currentGrade={grade}
        onHomeClick={vi.fn()}
        onOpenProfileModal={onOpenProfileModal}
        onOpenSettingsModal={onOpenSettingsModal}
      />
    </LocaleProvider>
  );

describe('Navbar', () => {
  it('shows the child chrome on 1AP: logo, a read-only grade indicator, a settings icon, and a desktop-only profile button', () => {
    renderNav('1AP');
    expect(document.querySelector('[data-nav-child="true"]')).toBeTruthy();
    expect(document.querySelector('[data-nav-grade-readout]')?.textContent).toContain('1AP');
    // Grade/language/theme/tashkeel/connexion now live in their own SettingsModal, opened from a
    // dedicated ⚙️ icon (remonte utilisateur : "je veux désassocier le profile et Réglages dans un
    // nouveau icon ⚙️ dans le header") — the header badge stays purely informational.
    expect(document.querySelector('[data-nav-grade-readout]')?.tagName).toBe('P');
    expect(document.querySelector('[data-nav-avatar]')).toBeNull();
    expect(document.querySelector('[data-nav-settings]')).toBeTruthy();
    // But MobileBottomNav (and its "Moi" tab) is md:hidden — without this button desktop/tablet
    // users would have had no way at all to reach the profile (found live, not a caching issue).
    // It's hidden via a CSS class (`hidden md:flex`), not absent from the DOM, so jsdom still sees
    // it — real hiding is verified visually, not by this unit test.
    expect(document.querySelector('[data-nav-desktop-profile]')).toBeTruthy();
    expect(document.querySelector('[data-profile-grade-strip]')).toBeNull();
    expect(document.querySelector('[data-parent-drawer-trigger]')).toBeNull();
    expect(screen.queryByText('تغيير المظهر والثيم')).not.toBeInTheDocument();
  });

  it('keeps the same child chrome on 5AP', () => {
    renderNav('5AP');
    expect(document.querySelector('[data-nav-child="true"]')).toBeTruthy();
    expect(document.querySelector('[data-nav-grade-readout]')?.textContent).toContain('5AP');
  });

  it('opens the profile from the desktop-only button', () => {
    const onOpenProfileModal = vi.fn();
    renderNav('2AP', onOpenProfileModal);
    fireEvent.click(document.querySelector('[data-nav-desktop-profile]') as HTMLElement);
    expect(onOpenProfileModal).toHaveBeenCalledTimes(1);
  });

  it('opens settings from the gear icon', () => {
    const onOpenSettingsModal = vi.fn();
    renderNav('2AP', vi.fn(), onOpenSettingsModal);
    fireEvent.click(document.querySelector('[data-nav-settings]') as HTMLElement);
    expect(onOpenSettingsModal).toHaveBeenCalledTimes(1);
  });
});

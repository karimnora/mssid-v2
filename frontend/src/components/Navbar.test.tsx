import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from './Navbar';
import { LocaleProvider } from '../context/LocaleContext';
import { createFreshGuestProfile } from '../hooks/useUserProgress';

const renderNav = (grade: '1AP' | '2AP' | '5AP', onOpenProfileModal = vi.fn()) =>
  render(
    <LocaleProvider>
      <Navbar
        currentGrade={grade}
        userProfile={createFreshGuestProfile(grade)}
        authUser={null}
        onOpenProfileModal={onOpenProfileModal}
        onHomeClick={vi.fn()}
      />
    </LocaleProvider>
  );

describe('Navbar', () => {
  it('shows the child chrome on 1AP: logo, grade readout, avatar', () => {
    renderNav('1AP');
    expect(document.querySelector('[data-nav-child="true"]')).toBeTruthy();
    expect(document.querySelector('[data-nav-grade-readout]')?.textContent).toContain('1AP');
    expect(document.querySelector('[data-nav-avatar]')).toBeTruthy();
    expect(document.querySelector('[data-nav-grade-strip]')).toBeNull();
    expect(document.querySelector('[data-parent-drawer-trigger]')).toBeNull();
    expect(screen.queryByText('تغيير المظهر والثيم')).not.toBeInTheDocument();
  });

  it('keeps the same child chrome on 5AP', () => {
    renderNav('5AP');
    expect(document.querySelector('[data-nav-child="true"]')).toBeTruthy();
    expect(document.querySelector('[data-nav-grade-readout]')?.textContent).toContain('5AP');
  });

  it('opens the profile from the avatar, not a parent drawer', () => {
    const onOpenProfileModal = vi.fn();
    renderNav('2AP', onOpenProfileModal);
    fireEvent.click(document.querySelector('[data-nav-avatar]') as HTMLElement);
    expect(onOpenProfileModal).toHaveBeenCalledTimes(1);
  });

  // Regression: the grade readout used to be a plain <p>, with no way to change grade or
  // language without already knowing to tap the avatar first. Tapping the grade badge now also
  // opens the profile (where the grade picker and LanguageSwitcher live) — a second, more
  // discoverable entry point to the same place, not a new separate menu.
  it('also opens the profile from the grade badge', () => {
    const onOpenProfileModal = vi.fn();
    renderNav('2AP', onOpenProfileModal);
    fireEvent.click(document.querySelector('[data-nav-grade-readout]') as HTMLElement);
    expect(onOpenProfileModal).toHaveBeenCalledTimes(1);
  });
});

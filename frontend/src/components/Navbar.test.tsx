import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from './Navbar';
import { LocaleProvider } from '../context/LocaleContext';

const renderNav = (grade: '1AP' | '2AP' | '5AP', onOpenProfileModal = vi.fn()) =>
  render(
    <LocaleProvider>
      <Navbar currentGrade={grade} onHomeClick={vi.fn()} onOpenProfileModal={onOpenProfileModal} />
    </LocaleProvider>
  );

describe('Navbar', () => {
  it('shows the child chrome on 1AP: logo, a read-only grade indicator, and a desktop-only profile button', () => {
    renderNav('1AP');
    expect(document.querySelector('[data-nav-child="true"]')).toBeTruthy();
    expect(document.querySelector('[data-nav-grade-readout]')?.textContent).toContain('1AP');
    // Grade + language change now live in the profile (reachable via the bottom nav's "Moi" tab
    // on phones, where they sit right at the top since Phase 193) — the header badge stays purely
    // informational so it doesn't duplicate that same destination on mobile (remonte utilisateur :
    // "انا et le grade de haut ont la meme choses ... je veux pas qu'il soit redondant").
    expect(document.querySelector('[data-nav-grade-readout]')?.tagName).toBe('P');
    expect(document.querySelector('[data-nav-avatar]')).toBeNull();
    // But MobileBottomNav (and its "Moi" tab) is md:hidden — without this button desktop/tablet
    // users would have had no way at all to reach the profile (found live, not a caching issue).
    // It's hidden via a CSS class (`hidden md:flex`), not absent from the DOM, so jsdom still sees
    // it — real hiding is verified visually, not by this unit test.
    expect(document.querySelector('[data-nav-desktop-profile]')).toBeTruthy();
    expect(document.querySelector('[data-nav-grade-strip]')).toBeNull();
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
});

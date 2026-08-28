import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from './Navbar';
import { LocaleProvider } from '../context/LocaleContext';

const renderNav = (grade: '1AP' | '2AP' | '5AP', onOpenProfileModal = vi.fn()) =>
  render(
    <LocaleProvider>
      <Navbar
        currentGrade={grade}
        onOpenProfileModal={onOpenProfileModal}
        onHomeClick={vi.fn()}
      />
    </LocaleProvider>
  );

describe('Navbar', () => {
  it('shows the child chrome on 1AP: logo and grade readout, no separate avatar or drawer', () => {
    renderNav('1AP');
    expect(document.querySelector('[data-nav-child="true"]')).toBeTruthy();
    expect(document.querySelector('[data-nav-grade-readout]')?.textContent).toContain('1AP');
    // Dropped (revue utilisateur : "ces trois icones font exactement la meme chose") — the top
    // avatar duplicated the grade badge and the bottom nav's "Moi" tab, all opening the same
    // profile modal. Only the grade badge remains in the header.
    expect(document.querySelector('[data-nav-avatar]')).toBeNull();
    expect(document.querySelector('[data-nav-grade-strip]')).toBeNull();
    expect(document.querySelector('[data-parent-drawer-trigger]')).toBeNull();
    expect(screen.queryByText('تغيير المظهر والثيم')).not.toBeInTheDocument();
  });

  it('keeps the same child chrome on 5AP', () => {
    renderNav('5AP');
    expect(document.querySelector('[data-nav-child="true"]')).toBeTruthy();
    expect(document.querySelector('[data-nav-grade-readout]')?.textContent).toContain('5AP');
  });

  it('opens the profile from the grade badge, not a parent drawer', () => {
    const onOpenProfileModal = vi.fn();
    renderNav('2AP', onOpenProfileModal);
    fireEvent.click(document.querySelector('[data-nav-grade-readout]') as HTMLElement);
    expect(onOpenProfileModal).toHaveBeenCalledTimes(1);
  });
});

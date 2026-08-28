import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';
import { LocaleProvider } from '../context/LocaleContext';

const renderNav = (grade: '1AP' | '2AP' | '5AP') =>
  render(
    <LocaleProvider>
      <Navbar currentGrade={grade} onHomeClick={vi.fn()} />
    </LocaleProvider>
  );

describe('Navbar', () => {
  it('shows the child chrome on 1AP: logo and a read-only grade indicator', () => {
    renderNav('1AP');
    expect(document.querySelector('[data-nav-child="true"]')).toBeTruthy();
    expect(document.querySelector('[data-nav-grade-readout]')?.textContent).toContain('1AP');
    // Grade + language change now live in the profile (reachable via the bottom nav's "Moi" tab,
    // where they sit right at the top since Phase 193) — the header badge is purely informational
    // so it doesn't duplicate that same destination (remonte utilisateur : "انا et le grade de
    // haut ont la meme choses ... je veux pas qu'il soit redondant").
    expect(document.querySelector('[data-nav-grade-readout]')?.tagName).toBe('P');
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
});

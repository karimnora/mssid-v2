import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from './Navbar';
import { LocaleProvider } from '../context/LocaleContext';

const renderNav = (
  grade: '1AP' | '2AP' | '5AP',
  onOpenProfileModal = vi.fn(),
  onOpenSettingsModal = vi.fn(),
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
  it('shows the child chrome on 1AP: logo, a read-only grade indicator, a settings icon, and the profile button', () => {
    renderNav('1AP');
    expect(document.querySelector('[data-nav-child="true"]')).toBeTruthy();
    expect(document.querySelector('[data-nav-grade-readout]')?.textContent).toContain('1AP');
    expect(document.querySelector('[data-nav-grade-readout]')?.tagName).toBe('P');
    expect(document.querySelector('[data-nav-avatar]')).toBeNull();
    expect(document.querySelector('[data-nav-settings]')).toBeTruthy();
    expect(document.querySelector('[data-nav-profile]')).toBeTruthy();
    expect(document.querySelector('[data-nav-exams]')).toBeNull();
    expect(document.querySelector('[data-nav-challenges]')).toBeNull();
    expect(document.querySelector('[data-profile-grade-strip]')).toBeNull();
    expect(document.querySelector('[data-parent-drawer-trigger]')).toBeNull();
    expect(screen.queryByText('تغيير المظهر والثيم')).not.toBeInTheDocument();
  });

  it('keeps the same child chrome on 5AP', () => {
    renderNav('5AP');
    expect(document.querySelector('[data-nav-child="true"]')).toBeTruthy();
    expect(document.querySelector('[data-nav-grade-readout]')?.textContent).toContain('5AP');
  });

  it('opens the profile from the header button', () => {
    const onOpenProfileModal = vi.fn();
    renderNav('2AP', onOpenProfileModal);
    fireEvent.click(document.querySelector('[data-nav-profile]') as HTMLElement);
    expect(onOpenProfileModal).toHaveBeenCalledTimes(1);
  });

  it('opens settings from the gear icon', () => {
    const onOpenSettingsModal = vi.fn();
    renderNav('2AP', vi.fn(), onOpenSettingsModal);
    fireEvent.click(document.querySelector('[data-nav-settings]') as HTMLElement);
    expect(onOpenSettingsModal).toHaveBeenCalledTimes(1);
  });

  it('opens the assess screen from the desktop header button', () => {
    const onOpenAssess = vi.fn();
    render(
      <LocaleProvider>
        <Navbar
          currentGrade="5AP"
          onHomeClick={vi.fn()}
          onOpenProfileModal={vi.fn()}
          onOpenSettingsModal={vi.fn()}
          onOpenAssess={onOpenAssess}
        />
      </LocaleProvider>,
    );
    fireEvent.click(document.querySelector('[data-nav-assess]') as HTMLElement);
    expect(onOpenAssess).toHaveBeenCalledTimes(1);
  });
});

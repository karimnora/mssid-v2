import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from './Navbar';
import { LocaleProvider } from '../context/LocaleContext';
import { createFreshGuestProfile } from '../hooks/useUserProgress';

const renderNav = (grade: '1AP' | '5AP') =>
  render(
    <LocaleProvider>
      <Navbar
        currentGrade={grade}
        onGradeChange={vi.fn()}
        userProfile={createFreshGuestProfile(grade)}
        authUser={null}
        onOpenAuthModal={vi.fn()}
        onLogout={vi.fn()}
        onOpenAiTutor={vi.fn()}
        onOpenProfileModal={vi.fn()}
        onOpenPreschool={vi.fn()}
        onHomeClick={vi.fn()}
      />
    </LocaleProvider>
  );

describe('Navbar child chrome', () => {
  it('keeps home and grade chips on 1AP and hides preschool from the child bar', () => {
    renderNav('1AP');
    expect(document.querySelector('[data-nav-child="true"]')).toBeTruthy();
    expect(document.querySelector('[data-parent-drawer-trigger]')).toBeTruthy();
    expect(screen.getByText('الرئيسية')).toBeInTheDocument();
    expect(screen.queryByText('التحضيري')).not.toBeInTheDocument();
  });

  it('keeps the adult chrome from 5AP', () => {
    renderNav('5AP');
    expect(document.querySelector('[data-nav-child="false"]')).toBeTruthy();
  });
});

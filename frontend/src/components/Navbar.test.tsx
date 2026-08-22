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

describe('Navbar', () => {
  it('uses the full chrome on 1AP', () => {
    renderNav('1AP');
    expect(document.querySelector('[data-nav-child="false"]')).toBeTruthy();
    expect(screen.getByText('الرئيسية')).toBeInTheDocument();
  });

  it('keeps the adult chrome from 5AP', () => {
    renderNav('5AP');
    expect(document.querySelector('[data-nav-child="false"]')).toBeTruthy();
  });
});

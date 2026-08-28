import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
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

  it('shows all grade levels in the nav strip without horizontal scroll', () => {
    renderNav('5AP');
    const strip = document.querySelector('[data-nav-grade-strip]');
    expect(strip).toBeTruthy();
    expect(strip?.className).toMatch(/grid-cols-6/);
    expect(strip?.className).not.toMatch(/overflow-x-auto/);

    const stripScope = within(strip as HTMLElement);
    ['1AP', '2AP', '3AP', '4AP', '5AP'].forEach((grade) => {
      expect(stripScope.getByText(grade)).toBeInTheDocument();
    });

    const preschool = document.querySelector('[data-nav-preschool="true"]');
    expect(preschool).toBeTruthy();
    expect(preschool?.getAttribute('aria-label')).toBeTruthy();
    expect(preschool?.textContent).toContain('🦊');
  });

  it('asks a parent before changing the school year', () => {
    const onGradeChange = vi.fn();
    render(
      <LocaleProvider>
        <Navbar
          currentGrade="1AP"
          onGradeChange={onGradeChange}
          userProfile={createFreshGuestProfile('1AP')}
          authUser={null}
          onOpenAuthModal={vi.fn()}
          onLogout={vi.fn()}
          onOpenAiTutor={vi.fn()}
          onOpenProfileModal={vi.fn()}
          onOpenPreschool={vi.fn()}
          onHomeClick={vi.fn()}
        />
      </LocaleProvider>,
    );

    const strip = document.querySelector('[data-nav-grade-strip]') as HTMLElement;
    fireEvent.click(within(strip).getByText('5AP'));
    expect(screen.getByText('بوابة الوالدين')).toBeInTheDocument();
    expect(onGradeChange).not.toHaveBeenCalled();

    const prompt = screen.getByText(/^\d+ \+ \d+ = \?$/);
    const [a, b] = prompt.textContent!.match(/\d+/g)!.map(Number);
    fireEvent.change(screen.getByPlaceholderText('اكتب الناتج هنا'), { target: { value: String(a + b) } });
    fireEvent.click(screen.getByRole('button', { name: 'متابعة' }));
    expect(onGradeChange).toHaveBeenCalledWith('5AP');
  });
});

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MobileBottomNav } from './MobileBottomNav';
import { LocaleProvider } from '../context/LocaleContext';

const renderNav = (grade: '1AP' | '5AP') =>
  render(
    <LocaleProvider>
      <MobileBottomNav
        grade={grade}
        selectedSubject="math"
        activeTab="home"
        onSelectTab={vi.fn()}
        onOpenAiTutor={vi.fn()}
        onOpenProfile={vi.fn()}
        onClearSelectedLesson={vi.fn()}
      />
    </LocaleProvider>
  );

describe('MobileBottomNav', () => {
  it('shows four tabs plus the AI tutor button on 1AP: home, courses, play, me', () => {
    renderNav('1AP');
    expect(document.querySelector('[data-nav-compact="true"]')).toBeTruthy();
    expect(screen.getByText('الرئيسية')).toBeInTheDocument();
    expect(screen.getByText('الدروس')).toBeInTheDocument();
    expect(screen.getByText('أَلْعَبُ')).toBeInTheDocument();
    expect(screen.getByText('أَنَا')).toBeInTheDocument();
    expect(screen.queryByText('التمارين')).not.toBeInTheDocument();
    expect(screen.getByTitle('المعلم الذكي بالذكاء الاصطناعي')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'المعلم الذكي بالذكاء الاصطناعي' })).toBeInTheDocument();
  });

  it('hides the AI tutor fox when showAiTutor is false', () => {
    render(
      <LocaleProvider>
        <MobileBottomNav
          grade="5AP"
          selectedSubject="math"
          activeTab="home"
          onSelectTab={vi.fn()}
          onOpenAiTutor={vi.fn()}
          onOpenProfile={vi.fn()}
          onClearSelectedLesson={vi.fn()}
          showAiTutor={false}
        />
      </LocaleProvider>,
    );
    expect(screen.queryByTitle('المعلم الذكي بالذكاء الاصطناعي')).not.toBeInTheDocument();
  });

  it('calls onOpenAiTutor when the center fox button is tapped', () => {
    const onOpenAiTutor = vi.fn();
    render(
      <LocaleProvider>
        <MobileBottomNav
          grade="5AP"
          selectedSubject="math"
          activeTab="home"
          onSelectTab={vi.fn()}
          onOpenAiTutor={onOpenAiTutor}
          onOpenProfile={vi.fn()}
          onClearSelectedLesson={vi.fn()}
        />
      </LocaleProvider>,
    );
    screen.getByTitle('المعلم الذكي بالذكاء الاصطناعي').click();
    expect(onOpenAiTutor).toHaveBeenCalledTimes(1);
  });

  it('marks the Accueil tab as current on the home screen', () => {
    renderNav('5AP');
    expect(screen.getByRole('button', { name: 'الرئيسية' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'الدروس' })).not.toHaveAttribute('aria-current');
  });

  it('marks the Lessons tab as current when that tab is active', () => {
    render(
      <LocaleProvider>
        <MobileBottomNav
          grade="5AP"
          selectedSubject="math"
          activeTab="courses"
          onSelectTab={vi.fn()}
          onOpenAiTutor={vi.fn()}
          onOpenProfile={vi.fn()}
          onClearSelectedLesson={vi.fn()}
        />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'الدروس' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'الرئيسية' })).not.toHaveAttribute('aria-current');
  });

  it('marks Moi as current when the profile is open', () => {
    render(
      <LocaleProvider>
        <MobileBottomNav
          grade="5AP"
          selectedSubject="math"
          activeTab="home"
          onSelectTab={vi.fn()}
          onOpenAiTutor={vi.fn()}
          onOpenProfile={vi.fn()}
          onClearSelectedLesson={vi.fn()}
          profileOpen
        />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'الملف' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'الرئيسية' })).not.toHaveAttribute('aria-current');
  });

  it('does not mark الدروس as current on the exams view', () => {
    render(
      <LocaleProvider>
        <MobileBottomNav
          grade="5AP"
          selectedSubject="exams"
          activeTab="exercises"
          onSelectTab={vi.fn()}
          onOpenAiTutor={vi.fn()}
          onOpenProfile={vi.fn()}
          onClearSelectedLesson={vi.fn()}
        />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'الدروس' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: 'الرئيسية' })).not.toHaveAttribute('aria-current');
  });
});

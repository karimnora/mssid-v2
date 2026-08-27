import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { HomeView } from './HomeView';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';

const renderHome = (
  grade: '1AP' | '2AP' | '5AP',
  extras?: Partial<React.ComponentProps<typeof HomeView>>,
) =>
  render(
    <LocaleProvider>
      <HomeView
        grade={grade}
        authUser={null}
        userName=""
        onSelectPole={vi.fn()}
        onOpenPreschool={vi.fn()}
        onOpenMathLab={vi.fn()}
        {...extras}
      />
    </LocaleProvider>
  );

describe('HomeView', () => {
  beforeEach(() => {
    setStoredLocale('ar');
  });

  afterEach(() => {
    setStoredLocale('ar');
  });

  it('shows the four poles on 1AP like 3AP–5AP', () => {
    renderHome('1AP');
    expect(document.querySelector('[data-home-layout="full"]')).toBeTruthy();
    expect(document.querySelector('[data-home-poles="kids"]')).toBeTruthy();
    expect(document.querySelector('[data-home-layout="young"]')).toBeNull();
    expect(screen.getByText(/مراجعة الدروس/)).toBeInTheDocument();
    expect(screen.getByText(/دروس الرياضيات/)).toBeInTheDocument();
    expect(screen.getByText(/اللغة العربية/)).toBeInTheDocument();
    expect(screen.getAllByText(/الرياضيات/).length).toBeGreaterThan(0);
    expect(screen.getByText(/ساحة التحديات/)).toBeInTheDocument();
    expect(screen.getByText(/بنك الامتحانات/)).toBeInTheDocument();
    expect(screen.getByText(/المختبرات والأدوات/)).toBeInTheDocument();
    expect(document.querySelector('[data-pole-icon="courses"]')).toBeTruthy();
    expect(document.querySelector('[data-pole-icon="challenges"]')).toBeTruthy();
    expect(document.querySelector('[data-pole-icon="exams"]')).toBeTruthy();
    expect(document.querySelector('[data-pole-icon="labs"]')).toBeTruthy();
  });

  it('opens math lessons from the continue CTA', () => {
    const onSelectSubject = vi.fn();
    renderHome('5AP', { onSelectSubject });
    fireEvent.click(screen.getByRole('button', { name: /دروس الرياضيات/ }));
    expect(onSelectSubject).toHaveBeenCalledWith('math');
  });

  it('shows the math lab shortcut instead of Tamazight', () => {
    renderHome('5AP');
    expect(screen.getByText('الرياضيات والحساب')).toBeInTheDocument();
    expect(screen.queryByText(/الأمازيغية/)).toBeNull();
    expect(screen.queryByText(/تيفيناغ/)).toBeNull();
  });

  it('shows the four poles on 2AP', () => {
    renderHome('2AP');
    expect(document.querySelector('[data-home-layout="full"]')).toBeTruthy();
    expect(screen.getByText(/ساحة التحديات/)).toBeInTheDocument();
    expect(screen.getByText(/المختبرات والأدوات/)).toBeInTheDocument();
  });

  it('keeps the four poles on 5AP', () => {
    renderHome('5AP');
    expect(document.querySelector('[data-home-layout="full"]')).toBeTruthy();
    expect(screen.getByText(/ساحة التحديات/)).toBeInTheDocument();
    expect(screen.getByText(/بنك الامتحانات/)).toBeInTheDocument();
  });

  it('shows the preschool card fully in French without a crushed row', () => {
    setStoredLocale('fr');
    renderHome('1AP');
    expect(screen.getByText(/Le coin des petits avec Didou/)).toBeInTheDocument();
    expect(screen.getByText('Entrer')).toBeInTheDocument();
    expect(screen.queryByText(/Braem/)).toBeNull();
  });
});

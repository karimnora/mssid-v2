import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeView } from './HomeView';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';

const renderHome = (grade: '1AP' | '2AP' | '5AP') =>
  render(
    <LocaleProvider>
      <HomeView
        grade={grade}
        authUser={null}
        userName=""
        onSelectPole={vi.fn()}
        onOpenPreschool={vi.fn()}
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
    expect(screen.getByText(/ساحة التحديات/)).toBeInTheDocument();
    expect(screen.getByText(/بنك الامتحانات/)).toBeInTheDocument();
    expect(screen.getByText(/المختبرات والأدوات/)).toBeInTheDocument();
    expect(document.querySelector('[data-pole-icon="courses"]')).toBeTruthy();
    expect(document.querySelector('[data-pole-icon="challenges"]')).toBeTruthy();
    expect(document.querySelector('[data-pole-icon="exams"]')).toBeTruthy();
    expect(document.querySelector('[data-pole-icon="labs"]')).toBeTruthy();
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

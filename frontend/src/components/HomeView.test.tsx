import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeView } from './HomeView';
import { LocaleProvider } from '../context/LocaleContext';

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
  it('shows the four poles on 1AP like 3AP–5AP', () => {
    renderHome('1AP');
    expect(document.querySelector('[data-home-layout="full"]')).toBeTruthy();
    expect(document.querySelector('[data-home-layout="young"]')).toBeNull();
    expect(screen.getByText(/مراجعة الدروس/)).toBeInTheDocument();
    expect(screen.getByText(/ساحة التحديات/)).toBeInTheDocument();
    expect(screen.getByText(/بنك الامتحانات/)).toBeInTheDocument();
    expect(screen.getByText(/المختبرات والأدوات/)).toBeInTheDocument();
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
});

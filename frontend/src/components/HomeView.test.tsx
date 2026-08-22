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

describe('HomeView young grades', () => {
  it('shows a single courses CTA on 1AP and hides the four poles', () => {
    renderHome('1AP');
    expect(document.querySelector('[data-home-layout="young"]')).toBeTruthy();
    expect(screen.getByRole('button', { name: /مراجعة الدروس/ })).toBeInTheDocument();
    expect(screen.queryByText(/ساحة التحديات/)).not.toBeInTheDocument();
    expect(screen.queryByText(/بنك الامتحانات/)).not.toBeInTheDocument();
    expect(screen.queryByText('v2.0 PWA')).not.toBeInTheDocument();
  });

  it('keeps the four poles on 5AP', () => {
    renderHome('5AP');
    expect(document.querySelector('[data-home-layout="full"]')).toBeTruthy();
    expect(screen.getByText(/ساحة التحديات/)).toBeInTheDocument();
    expect(screen.getByText(/بنك الامتحانات/)).toBeInTheDocument();
  });
});

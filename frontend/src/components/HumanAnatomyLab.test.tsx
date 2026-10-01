import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';
import { HumanAnatomyLab } from './HumanAnatomyLab';

afterEach(() => {
  setStoredLocale('ar');
  localStorage.removeItem('mssid_locale_preference');
  setStoredLocale('ar');
});

const renderLab = () =>
  render(
    <LocaleProvider>
      <HumanAnatomyLab grade="5AP" />
    </LocaleProvider>,
  );

describe('HumanAnatomyLab locale', () => {
  it('defaults chrome to Arabic and keeps organ names in Arabic', () => {
    renderLab();
    expect(screen.getByRole('heading', { name: /الجهاز الهضمي والجهاز التنفسي/ })).toBeInTheDocument();
    expect(screen.getAllByText(/الفَمُ/).length).toBeGreaterThan(0);
  });

  it('follows the app locale for chrome while keeping organ names in Arabic', () => {
    setStoredLocale('fr');
    renderLab();
    expect(screen.getByRole('heading', { name: /système digestif et le système respiratoire/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Système digestif/ })).toBeInTheDocument();
    expect(screen.getAllByText(/الفَمُ/).length).toBeGreaterThan(0);
  });
});

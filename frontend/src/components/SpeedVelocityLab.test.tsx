import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';
import { SpeedVelocityLab } from './SpeedVelocityLab';

afterEach(() => {
  setStoredLocale('ar');
  localStorage.removeItem('mssid_locale_preference');
  setStoredLocale('ar');
});

const renderLab = (grade: '1AP' | '5AP' = '5AP') =>
  render(
    <LocaleProvider>
      <SpeedVelocityLab grade={grade} />
    </LocaleProvider>,
  );

describe('SpeedVelocityLab locale', () => {
  it('has no in-lab language button and defaults chrome to Arabic', () => {
    renderLab();
    expect(screen.queryByRole('button', { name: /Français|العربية/ })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /مُخْتَبَرُ السُّرْعَة/ })).toBeInTheDocument();
    expect(document.querySelector('[data-lab-instrument]')).toHaveAttribute('dir', 'rtl');
  });

  it('follows the app locale for chrome while keeping quiz and vehicle names in Arabic', () => {
    setStoredLocale('fr');
    renderLab();
    expect(screen.getByRole('heading', { name: /Labo de vitesse/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Course urbaine/ })).toBeInTheDocument();
    expect(document.querySelector('[data-lab-instrument]')).toHaveAttribute('dir', 'ltr');
    expect(screen.getAllByText(/حَافِلَةُ النَّقْلِ المَدْرَسِي/).length).toBeGreaterThan(0);
    expect(screen.queryByText('Bus Scolaire')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Quiz/ }));
    expect(screen.getByText(/قَانُونُ حِسَابِ السُّرْعَةِ المُتَوَسِّطَةِ/)).toBeInTheDocument();
    expect(screen.queryByText(/La formule de la vitesse moyenne/)).not.toBeInTheDocument();
  });

  it('does not reveal the correct quiz option after a wrong pick', () => {
    renderLab();
    fireEvent.click(screen.getByRole('button', { name: /تَحَدِّي السُّرْعَة/ }));
    const question = screen.getByText(/قَانُونُ حِسَابِ السُّرْعَةِ المُتَوَسِّطَةِ/).parentElement as HTMLElement;
    fireEvent.click(within(question).getByRole('button', { name: 'v = d × t' }));
    const wrong = within(question).getByRole('button', { name: 'v = d × t' });
    const correct = within(question).getByRole('button', { name: /v = d \/ t/ });
    expect(wrong.className).toContain('border-rose-500');
    expect(correct.className).not.toContain('border-emerald-500');
    fireEvent.click(correct);
    expect(correct.className).toContain('border-emerald-500');
  });
});

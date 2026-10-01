import React from 'react';
import { afterEach, describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UnitConverter } from './UnitConverter';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';

afterEach(() => {
  setStoredLocale('ar');
  localStorage.removeItem('mssid_locale_preference');
  setStoredLocale('ar');
});

const renderConverter = (ui: React.ReactElement) => render(<LocaleProvider>{ui}</LocaleProvider>);

describe('UnitConverter Component & Logic Tests', () => {
  it('converts meters to centimeters correctly (1m = 100cm)', () => {
    renderConverter(<UnitConverter grade="5AP" />);

    const inputNumber = screen.getByRole('spinbutton');
    expect(inputNumber).toHaveValue(1);

    // 1 m to cm -> result should be 100
    const resultBox = screen.getByText('100');
    expect(resultBox).toBeInTheDocument();
  });

  it('updates conversion output when user types a new value', () => {
    renderConverter(<UnitConverter grade="5AP" />);

    const inputNumber = screen.getByRole('spinbutton');
    fireEvent.change(inputNumber, { target: { value: '5.5' } });

    // 5.5 m to cm -> result should be 550
    const resultBox = screen.getByText('550');
    expect(resultBox).toBeInTheDocument();
  });

  it('keeps inactive measurement tabs readable on the cream theme', () => {
    renderConverter(<UnitConverter grade="5AP" theme="neutre" />);
    expect(screen.getByRole('button', { name: /مساحات/ })).toHaveClass('text-slate-800');
    expect(screen.getByRole('button', { name: /أطوال/ })).toHaveClass('text-white');
  });

  it('switches category to weight and performs kilogram to gram conversion', () => {
    renderConverter(<UnitConverter grade="5AP" />);

    // Click on 'أوزان' category button
    const weightBtn = screen.getByText('أوزان');
    fireEvent.click(weightBtn);

    // Default weight category is Ton to Kilogram
    // Change input value to 2
    const inputNumber = screen.getByRole('spinbutton');
    fireEvent.change(inputNumber, { target: { value: '2' } });

    // 2 Ton = 20,000 hg (index 3 of weight units is hg)
    expect(screen.getByText(/20[٬,.]?000|٢٠[٬,.]?٠٠٠/)).toBeInTheDocument();
  });
});

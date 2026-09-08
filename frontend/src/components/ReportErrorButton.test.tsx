import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReportErrorButton } from './ReportErrorButton';
import { LocaleProvider } from '../context/LocaleContext';

describe('ReportErrorButton', () => {
  it('calls onReport with the given context label when clicked', () => {
    const onReport = vi.fn();
    render(
      <LocaleProvider>
        <ReportErrorButton contextLabel="Examen 5AP Maths T2 — Question 3" onReport={onReport} />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onReport).toHaveBeenCalledWith('Examen 5AP Maths T2 — Question 3');
  });
});

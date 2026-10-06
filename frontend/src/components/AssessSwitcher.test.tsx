import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { AssessSwitcher } from './AssessSwitcher';
import { LocaleProvider } from '../context/LocaleContext';

describe('AssessSwitcher', () => {
  it('switches between exams and challenges without a hub hop', () => {
    const onOpenExams = vi.fn();
    const onOpenChallenges = vi.fn();
    render(
      <LocaleProvider>
        <AssessSwitcher active="exams" onOpenExams={onOpenExams} onOpenChallenges={onOpenChallenges} />
      </LocaleProvider>,
    );
    expect(document.querySelector('[data-assess-switcher]')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'امتحانات' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'تحديات' })).not.toHaveAttribute('aria-current');
    fireEvent.click(screen.getByRole('button', { name: 'تحديات' }));
    expect(onOpenChallenges).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: 'امتحانات' }));
    expect(onOpenExams).toHaveBeenCalledTimes(1);
  });
});

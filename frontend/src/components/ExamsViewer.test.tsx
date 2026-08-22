import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExamsViewer } from './ExamsViewer';
import { LocaleProvider } from '../context/LocaleContext';

const renderExams = (grade: '2AP' | '5AP') =>
  render(
    <LocaleProvider>
      <ExamsViewer grade={grade} onOpenCourses={vi.fn()} />
    </LocaleProvider>
  );

describe('ExamsViewer young funnel', () => {
  it('shows one next-exam CTA on 2AP after picking a subject', async () => {
    renderExams('2AP');
    expect(document.querySelector('[data-exam-layout="funnel"]')).toBeTruthy();
    await userEvent.click(document.querySelector('[data-exam-subject="math"]') as HTMLElement);
    expect(document.querySelector('[data-next-exam-cta]')).toBeTruthy();
    expect(screen.queryByText('فتح ورقة الامتحان')).not.toBeInTheDocument();
    expect(screen.queryByText('جميع الفصول')).not.toBeInTheDocument();
  });

  it('hides timer and print on a 2AP paper', async () => {
    renderExams('2AP');
    await userEvent.click(document.querySelector('[data-exam-subject="math"]') as HTMLElement);
    const cta = document.querySelector('[data-next-exam-cta]') as HTMLElement;
    await userEvent.click(cta);
    expect(screen.queryByText('طباعة')).not.toBeInTheDocument();
    expect(screen.queryByText(/إظهار كافة الحلول/)).not.toBeInTheDocument();
  });
});

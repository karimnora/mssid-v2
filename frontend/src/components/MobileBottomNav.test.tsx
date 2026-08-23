import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MobileBottomNav } from './MobileBottomNav';
import { LocaleProvider } from '../context/LocaleContext';

const renderNav = (grade: '1AP' | '5AP') =>
  render(
    <LocaleProvider>
      <MobileBottomNav
        grade={grade}
        selectedSubject="math"
        activeTab="home"
        onSelectTab={vi.fn()}
        onOpenAiTutor={vi.fn()}
        onOpenProfile={vi.fn()}
        onClearSelectedLesson={vi.fn()}
      />
    </LocaleProvider>
  );

describe('MobileBottomNav', () => {
  it('shows exams and AI tutor on 1AP like 5AP', () => {
    renderNav('1AP');
    expect(document.querySelector('[data-nav-compact="false"]')).toBeTruthy();
    expect(screen.getByText('الرئيسية')).toBeInTheDocument();
    expect(screen.getByText('الدروس')).toBeInTheDocument();
    expect(screen.getByText('المختبرات')).toBeInTheDocument();
    expect(screen.getByText('التمارين')).toBeInTheDocument();
    expect(screen.getByTitle('المعلم الذكي بالذكاء الاصطناعي')).toBeInTheDocument();
    expect(screen.getByText('الملف')).toBeInTheDocument();
  });

  it('shows the AI tutor and exams tab from 5AP', () => {
    renderNav('5AP');
    expect(document.querySelector('[data-nav-compact="false"]')).toBeTruthy();
    expect(screen.getByTitle('المعلم الذكي بالذكاء الاصطناعي')).toBeInTheDocument();
    expect(screen.getByText('التمارين')).toBeInTheDocument();
  });
});

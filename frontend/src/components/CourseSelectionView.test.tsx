import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CourseSelectionView } from './CourseSelectionView';
import { LocaleProvider } from '../context/LocaleContext';
import { CourseLesson, SubjectInfo } from '../types';

const mockSubjects: SubjectInfo[] = [
  {
    id: 'math',
    nameAr: 'الرياضيات',
    nameFr: 'Mathématiques',
    description: 'دروس الرياضيات',
    icon: '📐',
    color: '#3B82F6',
  },
];

const mockLessons: CourseLesson[] = [
  {
    id: 'math-t1-1',
    subject: 'math',
    grade: '5AP',
    trimester: 1,
    titleAr: 'الأعداد الطبيعية 1',
    titleFr: 'Nombres naturels 1',
    steps: [],
  },
  {
    id: 'math-t1-2',
    subject: 'math',
    grade: '5AP',
    trimester: 1,
    titleAr: 'الجمع والطرح',
    titleFr: 'Addition et soustraction',
    steps: [],
  },
  {
    id: 'math-t2-1',
    subject: 'math',
    grade: '5AP',
    trimester: 2,
    titleAr: 'الكسور 1',
    titleFr: 'Fractions 1',
    steps: [],
  },
  {
    id: 'math-t3-1',
    subject: 'math',
    grade: '5AP',
    trimester: 3,
    titleAr: 'التناسبية والنسب المئوية',
    titleFr: 'Proportionnalité',
    steps: [],
  },
];

describe('CourseSelectionView Trimester Animations & Display', () => {
  it('renders trimester tabs (1, 2, 3) and switches courses with animation', async () => {
    const onSelectLesson = vi.fn();
    render(
      <LocaleProvider>
        <CourseSelectionView
          grade="5AP"
          courseSubjects={mockSubjects}
          allCourseLessons={mockLessons}
          completedLessonIds={['math-t1-1']}
          onSelectLesson={onSelectLesson}
          onGoHome={vi.fn()}
          initialSubjectId="math"
        />
      </LocaleProvider>
    );

    // Should see tabs for all 3 trimesters
    expect(screen.getAllByText(/الفصل الأول/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/الفصل الثاني/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/الفصل الثالث/).length).toBeGreaterThan(0);

    // Click Trimester 1 tab button
    const t1Btn = screen.getByText(/Trimestre 1/).closest('button');
    expect(t1Btn).toBeTruthy();
    if (t1Btn) fireEvent.click(t1Btn);

    // Verify Trimester 1 lessons are shown
    expect(screen.getByText('الأعداد الطبيعية 1')).toBeInTheDocument();
    expect(screen.getByText('الجمع والطرح')).toBeInTheDocument();

    // Switch to Trimester 2
    const t2Btn = screen.getByText(/Trimestre 2/).closest('button');
    expect(t2Btn).toBeTruthy();
    if (t2Btn) fireEvent.click(t2Btn);

    // Verify Trimester 2 lesson is displayed
    await waitFor(() => {
      expect(screen.getByText('الكسور 1')).toBeInTheDocument();
    });

    // Switch to Trimester 3
    const t3Btn = screen.getByText(/Trimestre 3/).closest('button');
    expect(t3Btn).toBeTruthy();
    if (t3Btn) fireEvent.click(t3Btn);

    // Verify Trimester 3 lesson is displayed
    await waitFor(() => {
      expect(screen.getByText('التناسبية والنسب المئوية')).toBeInTheDocument();
    });
  });
});

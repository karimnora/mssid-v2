import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArabicCanvasInteractive } from './ArabicCanvasInteractive';
import { CourseLesson } from '../types';

const harakatLesson = {
  id: 'arabic-1ap-t1-harakat',
  grade: '1AP',
  subject: 'arabic',
  categoryAr: 'حركات',
  titleAr: 'أَتَعَرَّفُ عَلَى الحَرَكَاتِ',
  summaryAr: '',
  rulesAr: [],
  quiz: [],
} as CourseLesson;

describe('ArabicCanvasInteractive 1AP tashkil', () => {
  it('opens the harakat lesson on tashkil, not iʿrāb', () => {
    render(<ArabicCanvasInteractive lesson={harakatLesson} grade="1AP" />);
    expect(document.querySelector('[data-arabic-tool="tashkil"]')).toBeTruthy();
    expect(screen.getByText(/ضَعِ الفَتْحَةَ/)).toBeInTheDocument();
    expect(screen.queryByText(/محلل الإعراب/)).not.toBeInTheDocument();
  });

  it('places a fatha on bāʾ when the child taps the right mark', () => {
    render(<ArabicCanvasInteractive lesson={harakatLesson} grade="1AP" />);
    fireEvent.click(screen.getByRole('button', { name: /فَتْحَةٌ/ }));
    expect(screen.getByText(/أَحْسَنْتَ/)).toBeInTheDocument();
  });
});

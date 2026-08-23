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

describe('ArabicCanvasInteractive per-lesson sentences', () => {
  it('opens 2AP shadda on tashkil, not the 5AP soldiers iʿrāb', () => {
    render(
      <ArabicCanvasInteractive
        lesson={{ ...harakatLesson, id: 'arabic-2ap-t1-shadda', grade: '2AP' }}
        grade="2AP"
      />,
    );
    expect(document.querySelector('[data-arabic-tool="tashkil"]')).toBeTruthy();
    expect(screen.queryByText(/يُدَافِعُ الجُنُودُ/)).not.toBeInTheDocument();
  });

  it('uses the 4AP lesson sentence, not the generic library phrase', () => {
    render(
      <ArabicCanvasInteractive
        lesson={{ ...harakatLesson, id: 'arabic-4ap-fail-maf3ul-irab', grade: '4AP' }}
        grade="4AP"
      />,
    );
    expect(screen.getByText(/زَرَعَ الفَلَّاحُ القَمْحَ/)).toBeInTheDocument();
    expect(screen.queryByText(/يَقْرَأُ الطَّالِبُ المَاهِرُ/)).not.toBeInTheDocument();
  });
});

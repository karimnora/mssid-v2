import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IrabTable, irabAnalysisHeaderForGrade } from './IrabTable';

describe('IrabTable', () => {
  it('renders الكلمة / إعرابها rows', () => {
    render(
      <IrabTable
        rows={[
          { wordAr: 'يَغْرِسُ', analysisAr: 'فعل مضارع مرفوع' },
          { wordAr: 'الفَلَّاحُ', analysisAr: 'فاعل مرفوع' },
        ]}
      />,
    );

    const table = document.querySelector('[data-irab-table]');
    expect(table).not.toBeNull();
    expect(screen.getByText('الكَلِمَةُ')).toBeInTheDocument();
    expect(screen.getByText('إِعْرَابُهَا')).toBeInTheDocument();
    expect(screen.getByText('يَغْرِسُ')).toBeInTheDocument();
    expect(screen.getByText('فاعل مرفوع')).toBeInTheDocument();
  });

  it('uses a 3AP role header instead of case-mark iʿrāb', () => {
    expect(irabAnalysisHeaderForGrade('3AP')).toBe('دَوْرُهَا فِي الجُمْلَةِ');
    expect(irabAnalysisHeaderForGrade('4AP')).toBe('إِعْرَابُهَا');
  });
});

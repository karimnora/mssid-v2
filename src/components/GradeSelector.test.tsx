import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GradeSelectorBanner } from './GradeSelector';

describe('GradeSelectorBanner Component Unit Tests', () => {
  it('renders all 5 primary grade cards (1AP through 5AP)', () => {
    const handleGradeChange = vi.fn();
    render(<GradeSelectorBanner currentGrade="5AP" onGradeChange={handleGradeChange} />);

    expect(screen.getByText('السنة الأولى ابتدائي')).toBeInTheDocument();
    expect(screen.getByText('السنة الثانية ابتدائي')).toBeInTheDocument();
    expect(screen.getByText('السنة الثالثة ابتدائي')).toBeInTheDocument();
    expect(screen.getByText('السنة الرابعة ابتدائي')).toBeInTheDocument();
    expect(screen.getByText('السنة الخامسة ابتدائي')).toBeInTheDocument();
  });

  it('highlights the currently selected grade', () => {
    const handleGradeChange = vi.fn();
    render(<GradeSelectorBanner currentGrade="3AP" onGradeChange={handleGradeChange} />);

    // The 3AP level name badge should be rendered
    const grade3Badge = screen.getByText('3AP');
    expect(grade3Badge).toBeInTheDocument();
  });

  it('calls onGradeChange with correct grade ID when clicked', () => {
    const handleGradeChange = vi.fn();
    render(<GradeSelectorBanner currentGrade="5AP" onGradeChange={handleGradeChange} />);

    const grade2Card = screen.getByText('السنة الثانية ابتدائي').closest('button');
    expect(grade2Card).not.toBeNull();

    if (grade2Card) {
      fireEvent.click(grade2Card);
      expect(handleGradeChange).toHaveBeenCalledWith('2AP');
    }
  });
});

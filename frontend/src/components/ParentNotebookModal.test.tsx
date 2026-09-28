import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ParentNotebookModal } from './ParentNotebookModal';
import { LocaleProvider } from '../context/LocaleContext';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
import { recordLessonSuccess } from '../utils/competenceProgress';

const renderNotebook = (ui: React.ReactElement) => render(<LocaleProvider>{ui}</LocaleProvider>);

describe('ParentNotebookModal', () => {
  it('explains the empty catalogue when the child grade has no mapped competences', () => {
    renderNotebook(
      <ParentNotebookModal
        isOpen
        onClose={vi.fn()}
        userProfile={createFreshGuestProfile('5AP')}
        onReviewLesson={vi.fn()}
      />,
    );
    expect(screen.getByRole('dialog', { name: 'دفتر المتابعة' })).toBeInTheDocument();
    expect(screen.getByText(/يغطي حالياً كفاءات رياضيات السنة الأولى/)).toBeInTheDocument();
  });

  it('launches the last successful lesson when the parent taps review', () => {
    const onReviewLesson = vi.fn();
    const userProfile = recordLessonSuccess(
      createFreshGuestProfile('1AP'),
      'math-1ap-t1-spatial-relations',
      '2026-09-28T21:00:00.000Z',
    );
    renderNotebook(
      <ParentNotebookModal isOpen onClose={vi.fn()} userProfile={userProfile} onReviewLesson={onReviewLesson} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'مراجعة' }));
    expect(onReviewLesson).toHaveBeenCalledWith('math-1ap-t1-spatial-relations');
  });

  it('starts the first mapped lesson for a competence that has not been worked yet', () => {
    const onReviewLesson = vi.fn();
    renderNotebook(
      <ParentNotebookModal
        isOpen
        onClose={vi.fn()}
        userProfile={createFreshGuestProfile('1AP')}
        onReviewLesson={onReviewLesson}
      />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'ابدأ' })[0]);
    expect(onReviewLesson).toHaveBeenCalledWith('math-1ap-t1-spatial-relations');
  });
});

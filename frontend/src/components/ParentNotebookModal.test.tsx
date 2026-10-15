import { springBootApi } from '../services/springBootApi';
import { COMPETENCE_CAHIERS } from '../../content-authoring/competenceCahiers';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ParentNotebookModal } from './ParentNotebookModal';
import { LocaleProvider } from '../context/LocaleContext';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
import { recordLessonFailure, recordLessonSuccess } from '../utils/competenceProgress';

vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ authUser: { id: 7, role: 'ROLE_PREMIUM' } }) }));
vi.mock('../hooks/useCahierAccess', () => ({ useCahierAccess: () => ({ authUser: { id: 7 }, access: { premium: true, unlockedIds: [] }, refresh: vi.fn() }) }));

const renderNotebook = (ui: React.ReactElement) => render(<LocaleProvider>{ui}</LocaleProvider>);

describe('ParentNotebookModal', () => {
  it('explains the empty catalogue when the child grade has no mapped competences', () => {
    renderNotebook(
      <ParentNotebookModal
        isOpen
        onClose={vi.fn()}
        userProfile={createFreshGuestProfile('3AP')}
        onReviewLesson={vi.fn()}
      />,
    );
    expect(screen.getByRole('dialog', { name: 'دفتر المتابعة' })).toBeInTheDocument();
    expect(screen.getByText(/رياضيات 1 و2 و5 وعربية 1 و5/)).toBeInTheDocument();
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

  it('lists a missed competence under review and launches that lesson', () => {
    const onReviewLesson = vi.fn();
    const userProfile = recordLessonFailure(
      createFreshGuestProfile('1AP'),
      'math-1ap-t1-spatial-relations',
      '2026-09-28T22:00:00.000Z',
    );
    renderNotebook(
      <ParentNotebookModal isOpen onClose={vi.fn()} userProfile={userProfile} onReviewLesson={onReviewLesson} />,
    );

    expect(screen.getByText('للتأكيد')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'مراجعة' }));
    expect(onReviewLesson).toHaveBeenCalledWith('math-1ap-t1-spatial-relations');
  });

  it('opens the mapped lesson revision sheet from a competence print action', async () => {
    const userProfile = recordLessonFailure(
      createFreshGuestProfile('1AP'),
      'math-1ap-t1-spatial-relations',
      '2026-09-28T22:00:00.000Z',
    );
    renderNotebook(
      <ParentNotebookModal isOpen onClose={vi.fn()} userProfile={userProfile} onReviewLesson={vi.fn()} />,
    );

    vi.spyOn(springBootApi,'getCahierContent').mockResolvedValue({status:200,data:COMPETENCE_CAHIERS[0]});
    fireEvent.click(document.querySelector('[data-notebook-print="math-1ap-c-spatial-position"]') as HTMLElement);
    await waitFor(() => expect(document.querySelector('.printable-sheet')).toBeTruthy());
    expect(screen.getByText(/كُرَّاسُ الكَفَاءَةِ/)).toBeInTheDocument();
  });

  it('starts tomorrow from the week plan with the missed lesson first', () => {
    const onReviewLesson = vi.fn();
    const userProfile = recordLessonFailure(
      createFreshGuestProfile('1AP'),
      'math-1ap-t1-spatial-relations',
      '2026-09-28T22:00:00.000Z',
    );
    renderNotebook(
      <ParentNotebookModal isOpen onClose={vi.fn()} userProfile={userProfile} onReviewLesson={onReviewLesson} />,
    );

    expect(screen.getByText('خطة هذا الأسبوع')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'ابدأ حصة الغد' }));
    expect(onReviewLesson).toHaveBeenCalledWith('math-1ap-t1-spatial-relations');
  });

  it('copies the weekly recap for the other parent', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    renderNotebook(
      <ParentNotebookModal
        isOpen
        onClose={vi.fn()}
        userProfile={createFreshGuestProfile('1AP')}
        onReviewLesson={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'نسخ الملخص للأب أو الأم' }));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(writeText.mock.calls[0][0]).toContain('دفتر مسيد');
    expect(writeText.mock.calls[0][0]).toContain('تلميذ مَسِيد');
    expect(screen.getByText('تم نسخ الملخص')).toBeInTheDocument();
  });
});

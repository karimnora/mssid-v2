import React from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ParentNotebookModal } from './ParentNotebookModal';
import { LocaleProvider } from '../context/LocaleContext';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
import { drawWeeklyReportCard } from '../utils/weeklyReport';
import { sharePlainText } from '../utils/shareContent';

vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ authUser: { id: 7, role: 'ROLE_PREMIUM' } }) }));
vi.mock('../utils/weeklyReport', async importOriginal => ({
  ...await importOriginal<typeof import('../utils/weeklyReport')>(), drawWeeklyReportCard: vi.fn(),
}));
vi.mock('../utils/shareContent', () => ({ shareImageBlob: vi.fn(), sharePlainText: vi.fn().mockResolvedValue('shared') }));
vi.mock('./examPlan/ExamPlanPanel', () => ({ ExamPlanPanel: () => null }));
vi.mock('./ParentVillageReports', () => ({ ParentVillageReports: () => null }));
vi.mock('./musaidi/MusaidiParentSummary', () => ({ MusaidiParentSummary: () => null }));
vi.mock('./family/FamilyParentSummary', () => ({ FamilyParentSummary: () => null }));
const props = { onClose: vi.fn(), onReviewLesson: vi.fn() };
const profile = (name: string) => ({ ...createFreshGuestProfile('5AP'), name });
const ui = (name: string, isOpen = true) => <LocaleProvider><ParentNotebookModal {...props} isOpen={isOpen} userProfile={profile(name)} /></LocaleProvider>;
const button = () => screen.getByRole('button', { name: /شارك حصيلة الأسبوع/ });
afterEach(() => vi.clearAllMocks());

describe('real notebook export lifecycle', () => {
  it('uses text fallback and restores the button when the image is unavailable', async () => {
    vi.mocked(drawWeeklyReportCard).mockResolvedValue(null);
    render(ui('Demo Amine'));
    fireEvent.click(button());
    await waitFor(() => expect(sharePlainText).toHaveBeenCalledWith(expect.stringContaining('Demo Amine')));
    expect(await screen.findByRole('button', { name: /تمت مشاركة الحصيلة/ })).toBeEnabled();
  });
  it.each(['child', 'close'] as const)('does not start sharing an obsolete report after %s changes', async change => {
    let finish!: (blob: Blob | null) => void;
    vi.mocked(drawWeeklyReportCard).mockImplementation(() => new Promise(resolve => { finish = resolve; }));
    const view = render(ui('Demo Amine'));
    fireEvent.click(button());
    view.rerender(change === 'child' ? ui('Demo Lina') : ui('Demo Amine', false));
    await act(async () => finish(null));
    expect(sharePlainText).not.toHaveBeenCalled();
    if (change === 'child') expect(button()).toBeEnabled();
  });
  it('shows a recoverable message when sharing fails', async () => {
    vi.mocked(drawWeeklyReportCard).mockRejectedValue(new Error('Canvas unavailable'));
    render(ui('Demo Amine'));
    fireEvent.click(button());
    expect(await screen.findByRole('alert')).toHaveTextContent('تعذّرت المشاركة');
    expect(button()).toBeEnabled();
  });
});

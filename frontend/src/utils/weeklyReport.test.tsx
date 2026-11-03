import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { buildWeeklyReport, formatWeeklyReportText } from './weeklyReport';
import { buildParentNotebook, buildWeeklyPlan, recordLessonFailure, recordLessonSuccess } from './competenceProgress';
import { createFreshGuestProfile } from '../hooks/useUserProgress';
import { PLAY_STORE_URL } from './appPlatform';
import { ParentNotebookModal } from '../components/ParentNotebookModal';
import { LocaleProvider } from '../context/LocaleContext';
import { sharePlainText, shareImageBlob } from './shareContent';

vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ authUser: { id: 7, role: 'ROLE_PREMIUM' } }) }));
vi.mock('./shareContent', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./shareContent')>()),
  sharePlainText: vi.fn(() => Promise.resolve('shared')),
  shareImageBlob: vi.fn(() => Promise.resolve('shared')),
}));
vi.mock('../hooks/useCahierAccess', () => ({ useCahierAccess: () => ({ authUser: { id: 7 }, access: { premium: true, unlockedIds: [] }, refresh: vi.fn() }) }));

const now = new Date('2026-11-03T18:00:00Z');
const profile = () => {
  let p = { ...createFreshGuestProfile('1AP'), name: 'أمين' };
  p = recordLessonSuccess(p, 'math-1ap-t1-spatial-relations', '2026-11-01T17:00:00.000Z');
  p = recordLessonSuccess(p, 'math-1ap-t1-numbers-0-5', '2026-11-02T17:00:00.000Z');
  p = recordLessonFailure(p, 'arabic-1ap-t1-harakat', '2026-11-02T18:00:00.000Z');
  p = recordLessonSuccess(p, 'math-1ap-t1-shapes-colors', '2026-10-01T17:00:00.000Z'); // older than a week
  return p;
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('weekly parent report', () => {
  it('summarises only this week, newest first, with what to review next', () => {
    const notebook = buildParentNotebook(profile(), '1AP');
    const report = buildWeeklyReport(notebook, buildWeeklyPlan(notebook, now), now);
    expect(report.childName).toBe('أمين');
    expect(report.fromDate).toBe('2026-10-27');
    expect(report.toDate).toBe('2026-11-03');
    expect(report.weekSessions).toBe(3);
    expect(report.weekSuccesses).toBe(2);
    expect(report.successes.length).toBeGreaterThan(0);
    expect(report.successes.length).toBeLessThanOrEqual(3);
    expect(report.toReview.length).toBeGreaterThan(0);
    expect(report.next?.minutes).toBeGreaterThan(0);
  });

  it('writes a WhatsApp message in Arabic and French with the store link', () => {
    const notebook = buildParentNotebook(profile(), '1AP');
    const report = buildWeeklyReport(notebook, buildWeeklyPlan(notebook, now), now);
    const ar = formatWeeklyReportText(report, 'ar');
    expect(ar).toContain('حصيلة الأسبوع — أمين (1AP)');
    expect(ar).toContain('3 حصة، منها 2 ناجحة');
    expect(ar).toContain('للمراجعة');
    expect(ar).toContain(PLAY_STORE_URL);
    const fr = formatWeeklyReportText(report, 'fr');
    expect(fr).toContain('Bilan de la semaine');
    expect(fr).toMatch(/À revoir/);
    expect(ar + fr).not.toMatch(/\d\s*DA|دج|prix|paiement/i);
  });

  it('handles a week without any session', () => {
    const notebook = buildParentNotebook(createFreshGuestProfile('2AP'), '2AP');
    const report = buildWeeklyReport(notebook, buildWeeklyPlan(notebook, now), now);
    expect(report.weekSessions).toBe(0);
    expect(formatWeeklyReportText(report, 'fr')).toContain('0 séance(s)');
  });

  it('shares from the parent notebook, falling back to text when no image can be drawn (jsdom)', async () => {
    const shareText = vi.mocked(sharePlainText);
    shareText.mockClear();
    // The global test setup fakes a canvas whose toBlob never calls back: force the text fallback path.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    render(<LocaleProvider><ParentNotebookModal isOpen onClose={vi.fn()} userProfile={profile()} onReviewLesson={vi.fn()} /></LocaleProvider>);
    fireEvent.click(screen.getByRole('button', { name: /شارك حصيلة الأسبوع/ }));
    await waitFor(() => expect(shareText).toHaveBeenCalledOnce());
    expect(shareText.mock.calls[0][0]).toContain('حصيلة الأسبوع');
    expect(await screen.findByRole('button', { name: /تمت مشاركة الحصيلة/ })).toBeInTheDocument();
    expect(vi.mocked(shareImageBlob)).not.toHaveBeenCalled();
  });
});

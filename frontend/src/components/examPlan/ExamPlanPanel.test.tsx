import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ExamPlanPanel } from './ExamPlanPanel';
import { createFreshGuestProfile } from '../../hooks/useUserProgress';
import { buildParentNotebook, recordPracticeResult } from '../../utils/competenceProgress';

vi.mock('../PremiumOffer', () => ({ PremiumOffer: () => <div data-testid="premium-offer" /> }));

const NOW = new Date(2026, 10, 4, 18, 0);
const notebook = () => {
  let profile = { ...createFreshGuestProfile('5AP'), name: 'أمين' };
  profile = recordPracticeResult(profile, 'arabic-5ap-tamyiz', { outcome: 'fail', exerciseId: 'arabic-5ap-tamyiz-eval3' }, NOW.toISOString());
  return buildParentNotebook(profile, '5AP');
};

describe('ExamPlanPanel', () => {
  beforeEach(() => window.localStorage.clear());

  it('shows the first two days free and keeps the rest for Premium, with a neutral message', async () => {
    render(<ExamPlanPanel notebook={notebook()} storageKey="k" locale="ar" premium={false} onReviewLesson={vi.fn()} onPrint={vi.fn()} now={NOW} />);
    const days = await screen.findAllByText(/اليَوْمُ \d+/, undefined, { timeout: 20000 });
    expect(days).toHaveLength(10);
    expect(screen.getAllByText('مُتَاحٌ لِحِسَابَاتِ العَائِلَةِ المُمَيَّزَةِ.')).toHaveLength(8);
    expect(screen.getByTestId('premium-offer')).toBeTruthy();
  }, 30000);

  it('opens the lesson, the catch-up sheet and the mock paper, and remembers the chosen date', async () => {
    const onReviewLesson = vi.fn();
    const onPrint = vi.fn();
    const onOpenExam = vi.fn();
    const { container } = render(
      <ExamPlanPanel notebook={notebook()} storageKey="k2" locale="ar" premium onReviewLesson={onReviewLesson} onPrint={onPrint} onOpenExam={onOpenExam} now={NOW} />,
    );
    await screen.findAllByText(/اليَوْمُ \d+/, undefined, { timeout: 20000 });
    fireEvent.click(screen.getAllByText('▶ رَاجِعِ الدَّرْسَ')[0]);
    expect(onReviewLesson).toHaveBeenCalledWith('arabic-5ap-tamyiz');
    fireEvent.click(container.querySelector('[data-exam-plan-print="ar-5ap-c-tamyiz"]')!);
    expect(onPrint).toHaveBeenCalledWith('arabic-5ap-tamyiz', expect.any(String), 'ar-5ap-c-tamyiz');
    fireEvent.click(container.querySelector('[data-exam-plan-open]')!);
    expect(onOpenExam).toHaveBeenCalledTimes(1);

    fireEvent.change(container.querySelector('[data-exam-plan-date]')!, { target: { value: '2026-11-08' } });
    expect(JSON.parse(window.localStorage.getItem('k2')!).examDate).toBe('2026-11-08');
    expect(await screen.findAllByText(/اليَوْمُ \d+/)).toHaveLength(4);
  }, 30000);
});

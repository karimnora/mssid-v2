import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AnalyticsModule } from './AnalyticsModule';
import { springBootApi } from '../../services/springBootApi';

// Every numeric field is deliberately distinct across the whole fixture so `getByText` on a single
// value can never accidentally match a different stat card rendered elsewhere on the page.
const baseOverview = {
  totalUsers: 110,
  roleDistribution: { ROLE_FREE: 100, ROLE_PREMIUM: 10 },
  gradeDistribution: { '5AP': 110 },
  // Non-empty on purpose: an absent/empty wilayaDistribution would make the wilaya DistributionCard
  // fall into the same "لا توجد بيانات بعد." empty state as topCompletedLessons below, and the two
  // identical strings would collide in the "nothing completed yet" test's findByText.
  wilayaDistribution: { '16': 44, '31': 15, UNKNOWN: 5 },
  totalXp: 12000,
  averageXp: 1200,
  averageLevel: 220,
  averageStreakDays: 330,
  totalCompletedLessons: 440,
  totalCompletedExams: 550,
  totalCompletedChallenges: 660,
  totalBadgesUnlocked: 770,
  newUsersLast7Days: 17,
  newUsersLast30Days: 37,
  dailyActiveUsers: 71,
  weeklyActiveUsers: 81,
  monthlyActiveUsers: 91,
  retentionRate7Days: 33.33,
  retentionRate30Days: 66.67,
  // Counts deliberately outside 1-10 so they can never collide with the card's own 1-10 rank badges.
  topCompletedLessons: { 'math-5ap-numbers': 55, 'arabic-5ap-grammar': 22 },
  payments: {
    totalReceipts: 12,
    receiptsByStatus: { APPROVED: 1, PENDING_VERIFICATION: 1 },
    receiptsByMethod: { BARIDIMOB: 2 },
    totalAmountDzdApproved: 15000,
    totalAmountDzdPending: 20000,
  },
};

describe('AnalyticsModule — active users, retention, and top lessons', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders DAU/WAU/MAU and rolling retention rates from the overview payload', async () => {
    vi.spyOn(springBootApi, 'getAdminStatsOverview').mockResolvedValue({ data: baseOverview } as any);

    render(<AnalyticsModule />);

    expect(await screen.findByText('71')).toBeInTheDocument(); // dailyActiveUsers
    expect(screen.getByText('81')).toBeInTheDocument(); // weeklyActiveUsers
    expect(screen.getByText('91')).toBeInTheDocument(); // monthlyActiveUsers
    expect(screen.getByText('33.3%')).toBeInTheDocument(); // retentionRate7Days
    expect(screen.getByText('66.7%')).toBeInTheDocument(); // retentionRate30Days
  });

  it('shows the top completed lessons ranked by count, falling back to the raw id when it matches no real lesson', async () => {
    vi.spyOn(springBootApi, 'getAdminStatsOverview').mockResolvedValue({ data: baseOverview } as any);

    render(<AnalyticsModule />);

    // These fixture ids don't exist in the real catalog, so the card must fall back to the raw id
    // rather than rendering blank — this is the same fallback a genuinely-deleted/renamed lesson
    // id would hit in production.
    await waitFor(() => {
      expect(screen.getByText('math-5ap-numbers')).toBeInTheDocument();
    });
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText('arabic-5ap-grammar')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
  });

  it('shows an empty-state message instead of a blank list when nothing has been completed yet', async () => {
    vi.spyOn(springBootApi, 'getAdminStatsOverview').mockResolvedValue({
      data: { ...baseOverview, topCompletedLessons: {} },
    } as any);

    render(<AnalyticsModule />);

    expect(await screen.findByText('لا توجد بيانات بعد.')).toBeInTheDocument();
  });
});

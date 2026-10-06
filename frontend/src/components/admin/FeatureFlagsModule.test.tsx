import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FeatureFlagsModule } from './FeatureFlagsModule';
import { springBootApi } from '../../services/springBootApi';
import { setFeatureFlagOverride, resetFeatureFlagOverride, isFlagOverridden, getFeatureFlags } from '../../featureFlags';

// Regression test for the bug report: toggling enableTrimesterPaywall alone (or enablePayments
// alone) has zero visible effect anywhere in the app, since isLessonLocked requires BOTH to be true
// (see trimesterAccess.ts). Without this UI, an admin testing one flag at a time sees "nothing
// happened" with no explanation. These tests cover the dormant-state indicator that now surfaces why.
describe('FeatureFlagsModule — enableTrimesterPaywall dependency on enablePayments', () => {
  beforeEach(() => {
    vi.spyOn(springBootApi, 'updateFeatureFlag').mockResolvedValue({ data: {} } as any);
    vi.spyOn(springBootApi, 'deleteFeatureFlagOverride').mockResolvedValue({ data: {} } as any);
    vi.spyOn(springBootApi, 'getAndroidRelease').mockResolvedValue({
      data: { latestVersionCode: 8, minVersionCode: 0 },
      status: 200,
    } as any);
  });

  afterEach(() => {
    resetFeatureFlagOverride('enablePayments');
    resetFeatureFlagOverride('enableTrimesterPaywall');
    vi.restoreAllMocks();
  });

  it('flags the trimester paywall as having no effect when enablePayments is off', () => {
    setFeatureFlagOverride('enablePayments', false);
    setFeatureFlagOverride('enableTrimesterPaywall', true);

    render(<FeatureFlagsModule />);

    expect(screen.getByText('⏸️ بلا تأثير حالياً')).toBeInTheDocument();
    expect(screen.getByText(/يتطلب تفعيل «المدفوعات والاشتراكات» أولاً/)).toBeInTheDocument();
  });

  it('clears the dormant indicator once enablePayments is also on', () => {
    setFeatureFlagOverride('enablePayments', true);
    setFeatureFlagOverride('enableTrimesterPaywall', true);

    render(<FeatureFlagsModule />);

    expect(screen.queryByText('⏸️ بلا تأثير حالياً')).not.toBeInTheDocument();
  });

  it('does not flag the trimester paywall as dormant while it is itself off', () => {
    setFeatureFlagOverride('enablePayments', false);
    setFeatureFlagOverride('enableTrimesterPaywall', false);

    render(<FeatureFlagsModule />);

    expect(screen.queryByText('⏸️ بلا تأثير حالياً')).not.toBeInTheDocument();
  });

  it('does not offer unused preschool or exam kill switches', () => {
    render(<FeatureFlagsModule />);
    expect(screen.queryByText(/وضع التحضيري/)).not.toBeInTheDocument();
    expect(screen.queryByText(/قسم الامتحانات الرسمية/)).not.toBeInTheDocument();
  });
});

// Regression test for the external review finding: toggling a flag was purely optimistic — if the
// PUT/DELETE against the server failed (network error or non-admin 403), the local override was
// never reverted, so the flag stayed silently flipped in that one browser forever. A failed sync
// must instead roll back to the last server-confirmed state and say why (review externe #6).
describe('FeatureFlagsModule — rollback on failed server sync', () => {
  beforeEach(() => {
    vi.spyOn(springBootApi, 'getAndroidRelease').mockResolvedValue({
      data: { latestVersionCode: 8, minVersionCode: 0 },
      status: 200,
    } as any);
  });

  afterEach(() => {
    resetFeatureFlagOverride('enablePrintablePDFs');
    vi.restoreAllMocks();
  });

  it('reverts an optimistic toggle when the server rejects the update, and warns', async () => {
    vi.spyOn(springBootApi, 'updateFeatureFlag').mockResolvedValue({ error: 'forbidden' } as any);
    const wasEnabled = getFeatureFlags().enablePrintablePDFs;

    render(<FeatureFlagsModule />);
    // enablePayments, enableTrimesterPaywall, enablePrintablePDFs = 3rd core switch.
    const toggle = screen.getAllByRole('switch')[2];
    expect(toggle.getAttribute('aria-checked')).toBe(String(wasEnabled));

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-checked')).toBe(String(!wasEnabled)); // optimistic flip

    await waitFor(() => expect(toggle.getAttribute('aria-checked')).toBe(String(wasEnabled))); // rolled back
    expect(isFlagOverridden('enablePrintablePDFs')).toBe(false);
    expect(await screen.findByText(/تعذّرت مزامنة هذا التعديل/)).toBeInTheDocument();
  });

  it('reverts a failed reset back to the previous override instead of leaving it cleared', async () => {
    setFeatureFlagOverride('enablePrintablePDFs', true);
    vi.spyOn(springBootApi, 'deleteFeatureFlagOverride').mockResolvedValue({ error: 'network' } as any);

    render(<FeatureFlagsModule />);
    const toggle = screen.getAllByRole('switch')[2];
    const resetButton = screen.getByTitle('إعادة الضبط الافتراضي');

    fireEvent.click(resetButton);

    await waitFor(() => expect(isFlagOverridden('enablePrintablePDFs')).toBe(true));
    expect(toggle.getAttribute('aria-checked')).toBe('true');
    expect(await screen.findByText(/تعذّرت مزامنة هذا التعديل/)).toBeInTheDocument();
  });
});

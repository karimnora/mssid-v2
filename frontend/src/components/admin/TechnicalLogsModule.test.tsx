import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TechnicalLogsModule } from './TechnicalLogsModule';
import { springBootApi } from '../../services/springBootApi';

const failedEmailEntry = {
  id: 9,
  actorEmail: 'younes@mssid.dz',
  actionType: 'EMAIL_SEND',
  targetType: 'EMAIL',
  targetId: 'رمز التحقق',
  details: "app.resend.api-key n'est pas configurée — envoi ignoré",
  outcome: 'FAILURE',
  createdAt: '2026-08-17T23:16:16',
};

describe('TechnicalLogsModule — event log filtering', () => {
  beforeEach(() => {
    vi.spyOn(springBootApi, 'getAdminStatsOverview').mockResolvedValue({ data: {} } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads the unfiltered log on mount', async () => {
    const auditSpy = vi.spyOn(springBootApi, 'getAdminAuditLog').mockResolvedValue({ data: [failedEmailEntry] } as any);

    render(<TechnicalLogsModule />);

    await waitFor(() => {
      expect(auditSpy).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100, actionType: undefined, outcome: undefined, actorEmail: undefined })
      );
    });
    expect(await screen.findByText(/app.resend.api-key/)).toBeInTheDocument();
  });

  // Regression test for the exact scenario that prompted this feature: an admin needs to filter down
  // to "why didn't the confirmation email send" instead of scrolling through every event.
  it('applying actionType + outcome filters calls the API with those params', async () => {
    const auditSpy = vi.spyOn(springBootApi, 'getAdminAuditLog').mockResolvedValue({ data: [] } as any);

    render(<TechnicalLogsModule />);
    await waitFor(() => expect(auditSpy).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByDisplayValue('كل أنواع الأحداث'), { target: { value: 'EMAIL_SEND' } });
    fireEvent.change(screen.getByDisplayValue('كل النتائج'), { target: { value: 'FAILURE' } });
    fireEvent.click(screen.getByRole('button', { name: /تطبيق الفلترة/ }));

    await waitFor(() => {
      expect(auditSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ actionType: 'EMAIL_SEND', outcome: 'FAILURE' })
      );
    });
  });

  it('shows a red "فشل" badge for a FAILURE row and a green "نجاح" badge for a SUCCESS row', async () => {
    vi.spyOn(springBootApi, 'getAdminAuditLog').mockResolvedValue({
      data: [failedEmailEntry, { ...failedEmailEntry, id: 10, actionType: 'USER_REGISTERED', outcome: 'SUCCESS', details: 'grade=3AP' }],
    } as any);

    render(<TechnicalLogsModule />);

    expect(await screen.findByText('❌ فشل')).toBeInTheDocument();
    expect(await screen.findByText('✅ نجاح')).toBeInTheDocument();
  });

  it('resetting filters clears them and reloads the unfiltered log', async () => {
    const auditSpy = vi.spyOn(springBootApi, 'getAdminAuditLog').mockResolvedValue({ data: [] } as any);

    render(<TechnicalLogsModule />);
    await waitFor(() => expect(auditSpy).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByDisplayValue('كل أنواع الأحداث'), { target: { value: 'EMAIL_SEND' } });
    fireEvent.click(screen.getByRole('button', { name: /تطبيق الفلترة/ }));
    await waitFor(() => expect(auditSpy).toHaveBeenCalledTimes(2));

    fireEvent.click(screen.getByRole('button', { name: /إلغاء الفلترة/ }));

    await waitFor(() => {
      expect(auditSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({ actionType: undefined, outcome: undefined, actorEmail: undefined })
      );
    });
  });
});

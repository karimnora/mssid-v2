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
    vi.spyOn(springBootApi, 'getAdminInfraQuotas').mockResolvedValue({
      data: {
        fetchedAt: '2026-08-28T08:00:00Z',
        resend: { provider: 'resend', status: 'not_configured', meters: [] },
        neon: { provider: 'neon', status: 'not_configured', meters: [] },
        render: { provider: 'render', status: 'not_configured', meters: [] },
      },
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads the unfiltered log on mount', async () => {
    const auditSpy = vi.spyOn(springBootApi, 'getAdminAuditLog').mockResolvedValue({ data: [failedEmailEntry] } as any);

    render(<TechnicalLogsModule />);

    await waitFor(() => {
      expect(auditSpy).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100, actionType: undefined, outcome: undefined, actorEmail: undefined, excludeActionType: 'GOOGLE_LOGIN' })
      );
    });
    expect(await screen.findByText('تعذّر إرسال البريد: خدمة البريد غير معدّة')).toBeInTheDocument();
    expect(screen.queryByText(/app.resend.api-key/)).not.toBeInTheDocument();
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
        expect.objectContaining({ actionType: 'EMAIL_SEND', outcome: 'FAILURE', excludeActionType: undefined })
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

  it('lets the admin expand raw technical details when the friendly sentence replaced them', async () => {
    vi.spyOn(springBootApi, 'getAdminAuditLog').mockResolvedValue({ data: [failedEmailEntry] } as any);
    render(<TechnicalLogsModule />);
    expect(await screen.findByText('تعذّر إرسال البريد: خدمة البريد غير معدّة')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'عرض التفاصيل التقنية' }));
    expect(screen.getByText(/app.resend.api-key/)).toBeInTheDocument();
  });

  // Regression: AuthService.java emits GOOGLE_LINK_REJECTED/GOOGLE_REGISTERED/GOOGLE_LOGIN
  // (see the native Google Sign-In flow) but ACTION_LABELS_AR used to lack all three, so an admin
  // would see the raw English action type instead of an Arabic label for any Google-auth event.
  it('shows an Arabic label (not the raw action type) for Google-auth events', async () => {
    vi.spyOn(springBootApi, 'getAdminAuditLog').mockResolvedValue({
      data: [
        { ...failedEmailEntry, id: 11, actionType: 'GOOGLE_REGISTERED', outcome: 'SUCCESS', details: 'provider=GOOGLE' },
        { ...failedEmailEntry, id: 12, actionType: 'GOOGLE_LOGIN', outcome: 'SUCCESS', details: 'provider=GOOGLE' },
        { ...failedEmailEntry, id: 13, actionType: 'GOOGLE_LINK_REJECTED', outcome: 'FAILURE', details: 'already linked' },
      ],
    } as any);

    render(<TechnicalLogsModule />);

    await screen.findByText('إنشاء حساب عبر Google');
    // Each label also appears once in the filter <select>'s options, so at least 2 matches
    // (table row + dropdown option) confirms the table itself rendered the Arabic label.
    expect(screen.getAllByText('إنشاء حساب عبر Google').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('تسجيل الدخول عبر Google').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('رفض ربط حساب Google بحساب موجود').length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByText('GOOGLE_REGISTERED')).not.toBeInTheDocument();
    expect(screen.queryByText('GOOGLE_LOGIN')).not.toBeInTheDocument();
    expect(screen.queryByText('GOOGLE_LINK_REJECTED')).not.toBeInTheDocument();
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
        expect.objectContaining({ actionType: undefined, outcome: undefined, actorEmail: undefined, excludeActionType: 'GOOGLE_LOGIN' })
      );
    });
  });
});

describe('TechnicalLogsModule — infra quotas', () => {
  beforeEach(() => {
    vi.spyOn(springBootApi, 'getAdminStatsOverview').mockResolvedValue({ data: {} } as any);
    vi.spyOn(springBootApi, 'getAdminAuditLog').mockResolvedValue({ data: [] } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows remaining Resend emails and Neon CU-hours from GET /v1/admin/infra/quotas', async () => {
    vi.spyOn(springBootApi, 'getAdminInfraQuotas').mockResolvedValue({
      data: {
        fetchedAt: '2026-08-28T08:00:00Z',
        resend: {
          provider: 'resend',
          status: 'ok',
          dashboardUrl: 'https://resend.com/settings/usage',
          meters: [{ id: 'emails_daily', label: "E-mails aujourd'hui", used: 12, limit: 100, unit: 'emails' }],
        },
        neon: {
          provider: 'neon',
          status: 'ok',
          meters: [{ id: 'compute_cu_hours', label: 'Compute Neon (CU-h / mois)', used: 40, limit: 100, unit: 'CU-h' }],
        },
        render: { provider: 'render', status: 'not_configured', meters: [] },
      },
    } as any);

    render(<TechnicalLogsModule />);

    expect(await screen.findByText(/متبقي 88 \/ 100 emails/)).toBeInTheDocument();
    expect(screen.getByText(/متبقي 60 \/ 100 CU-h/)).toBeInTheDocument();
    expect(screen.getByText(/غير متاحة حالياً/)).toBeInTheDocument();
  });
});

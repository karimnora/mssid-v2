import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

const api = vi.hoisted(() => ({
  redeemActivationCode: vi.fn(),
  fetchCurrentUser: vi.fn(),
  getActivationBatches: vi.fn(),
  generateActivationCodes: vi.fn(),
  revokeActivationBatch: vi.fn(),
}));
const platform = vi.hoisted(() => ({ web: true }));
vi.mock('../services/springBootApi', () => ({ springBootApi: api }));
vi.mock('../utils/paymentPlatform', () => ({ canUseWebCheckout: () => platform.web }));
vi.mock('../services/authProfile', () => ({ mapAuthProfile: (value: unknown) => value }));
vi.mock('../services/authService', () => ({ AuthService: { hydrateCurrentUser: vi.fn((u: unknown) => u) } }));
vi.mock('../context/LocaleContext', () => ({ useLocaleContext: () => ({ locale: 'ar' }) }));

import { ActivationCodeForm } from './ActivationCodeForm';
import { ActivationCodesModule } from './admin/ActivationCodesModule';

describe('ActivationCodeForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    platform.web = true;
  });

  it('is never shown in the Android app', () => {
    platform.web = false;
    const { container } = render(<ActivationCodeForm />);
    expect(container.innerHTML).toBe('');
  });

  it('redeems a code, refreshes the account and tells until when Premium runs', async () => {
    api.redeemActivationCode.mockResolvedValue({ data: { planId: 'P12M', months: 12, endDate: '2027-11-05' }, status: 200 });
    api.fetchCurrentUser.mockResolvedValue({ data: { id: 1, role: 'ROLE_PREMIUM' }, status: 200 });
    const onRedeemed = vi.fn();
    render(<ActivationCodeForm onRedeemed={onRedeemed} />);
    fireEvent.change(screen.getByPlaceholderText('MSD-XXXX-XXXX'), { target: { value: 'msd-4k7p-9xq2' } });
    fireEvent.click(screen.getByRole('button', { name: 'فعّل' }));
    expect(await screen.findByRole('status')).toHaveTextContent('مفعّل حتى');
    expect(api.redeemActivationCode).toHaveBeenCalledWith('MSD-4K7P-9XQ2');
    expect(onRedeemed).toHaveBeenCalledWith({ id: 1, role: 'ROLE_PREMIUM' });
  });

  it('shows the server message when the code is refused, and the wait after too many tries', async () => {
    api.redeemActivationCode.mockResolvedValueOnce({ error: 'هذا الكود استُعمل بالكامل.', status: 400 });
    render(<ActivationCodeForm />);
    fireEvent.change(screen.getByPlaceholderText('MSD-XXXX-XXXX'), { target: { value: 'MSD-AAAA-BBBB' } });
    fireEvent.click(screen.getByRole('button', { name: 'فعّل' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('استُعمل بالكامل');

    api.redeemActivationCode.mockResolvedValueOnce({ error: 'x', status: 429 });
    fireEvent.click(screen.getByRole('button', { name: 'فعّل' }));
    expect(await screen.findByText(/15 دقيقة/)).toBeTruthy();
  });
});

describe('ActivationCodesModule (admin)', () => {
  it('generates a class licence batch and shows the printable cards', async () => {
    api.getActivationBatches.mockResolvedValue({ data: [], status: 200 });
    api.generateActivationCodes.mockResolvedValue({ data: { codes: ['MSD-AAAA-BBBB', 'MSD-CCCC-DDDD'] }, status: 200 });
    const { container } = render(<ActivationCodesModule />);
    fireEvent.change(container.querySelector('select')!, { target: { value: 'SCHOOL' } });
    fireEvent.change(screen.getByPlaceholderText(/مكتبة النور/), { target: { value: 'مدرسة الفتح — 5AP أ' } });
    fireEvent.click(screen.getByRole('button', { name: 'أنشئ الأكواد' }));
    expect(await screen.findByText('MSD-AAAA-BBBB')).toBeTruthy();
    expect(api.generateActivationCodes).toHaveBeenCalledWith(expect.objectContaining({ kind: 'SCHOOL', seats: 1, label: 'مدرسة الفتح — 5AP أ' }));
    expect(container.querySelectorAll('[data-generated-codes] .font-mono')).toHaveLength(2);
  });
});

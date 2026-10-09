import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AnalyticsPeriod } from './AnalyticsPeriod';
import { springBootApi } from '../../services/springBootApi';

function response(from: string, to: string, registrations = 2) {
  return { status: 200, data: { from, to, timezone: 'UTC', days: Array.from({ length: (Date.parse(to) - Date.parse(from)) / 86400000 + 1 }, (_, i) => ({
    date: new Date(Date.parse(from) + i * 86400000).toISOString().slice(0, 10), registrations: i === 0 ? registrations : 0,
    submittedReceipts: 0, approvedSubmittedAmountDzd: 0, pendingSubmittedAmountDzd: 0,
  })) } };
}
afterEach(() => vi.restoreAllMocks());
describe('AnalyticsPeriod', () => {
  it('uses the latest requested period even if an older request arrives later', async () => {
    const requests: { from: string; to: string; resolve: (value: unknown) => void }[] = [];
    vi.spyOn(springBootApi, 'getAdminStatsPeriod').mockImplementation((from, to) => new Promise(resolve => requests.push({ from, to, resolve })) as any);
    render(<AnalyticsPeriod />);
    expect(screen.getByRole('button', { name: 'CSV الفترة / période' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: '7 أيام / jours' }));
    const newest = requests[1];
    newest.resolve(response(newest.from, newest.to, 3));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('3 تسجيل جديد'));
    requests[0].resolve(response(requests[0].from, requests[0].to, 99));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('3 تسجيل جديد'));
    expect(screen.getByRole('status')).not.toHaveTextContent('99');
  });
  it('rejects a reversed date range before calling the server and removes old export data', async () => {
    const api = vi.spyOn(springBootApi, 'getAdminStatsPeriod').mockImplementation(async (from, to) => response(from, to));
    render(<AnalyticsPeriod />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'CSV الفترة / période' })).toBeEnabled());
    fireEvent.change(screen.getByLabelText('من / Du'), { target: { value: '2025-02-02' } });
    fireEvent.change(screen.getByLabelText('إلى / Au'), { target: { value: '2025-02-01' } });
    fireEvent.click(screen.getByRole('button', { name: 'عرض الفترة / Appliquer' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('اختر تاريخ بداية ونهاية صالحين');
    expect(api).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'CSV الفترة / période' })).toBeDisabled();
  });
  it('shows a recoverable error for a missing endpoint instead of reporting zero activity', async () => {
    vi.spyOn(springBootApi, 'getAdminStatsPeriod').mockResolvedValue({ error: '404' } as any);
    render(<AnalyticsPeriod />);
    expect(await screen.findByRole('alert')).toHaveTextContent('تحقق من تحديث الخادم');
    expect(screen.queryByText(/0 تسجيل جديد/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CSV الفترة / période' })).toBeDisabled();
  });
});

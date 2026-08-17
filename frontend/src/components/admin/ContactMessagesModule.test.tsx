import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactMessagesModule } from './ContactMessagesModule';
import { springBootApi } from '../../services/springBootApi';

const messages = [
  {
    id: 1,
    name: 'يونس الجزائري',
    email: 'younes@mssid.dz',
    type: 'bug',
    message: 'زر تسجيل الدخول لا يعمل على هاتفي.',
    submittedAt: '2026-08-17 10:00',
  },
  {
    id: 2,
    name: 'أمينة بن جامع',
    email: 'amina@mssid.dz',
    type: 'suggestion',
    message: 'أقترح إضافة المزيد من تمارين الرياضيات.',
    submittedAt: '2026-08-16 09:00',
  },
];

// Regression coverage for the audit finding: ContactController's submissions had no read path
// anywhere in the app — this module is the fix, so verify it actually surfaces real data (and
// degrades honestly, not silently) rather than just existing.
describe('ContactMessagesModule', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads and displays submitted contact messages', async () => {
    vi.spyOn(springBootApi, 'getContactMessages').mockResolvedValue({ status: 200, data: messages });

    render(<ContactMessagesModule />);

    await waitFor(() => {
      expect(screen.getByText('يونس الجزائري')).toBeInTheDocument();
      expect(screen.getByText('أمينة بن جامع')).toBeInTheDocument();
      expect(screen.getByText('زر تسجيل الدخول لا يعمل على هاتفي.')).toBeInTheDocument();
    });
  });

  it('filters messages by type', async () => {
    vi.spyOn(springBootApi, 'getContactMessages').mockResolvedValue({ status: 200, data: messages });
    render(<ContactMessagesModule />);
    await screen.findByText('يونس الجزائري');

    fireEvent.click(screen.getByRole('button', { name: 'اقتراح' }));

    expect(screen.queryByText('يونس الجزائري')).not.toBeInTheDocument();
    expect(screen.getByText('أمينة بن جامع')).toBeInTheDocument();
  });

  it('filters messages by search query (name, email, or message text)', async () => {
    vi.spyOn(springBootApi, 'getContactMessages').mockResolvedValue({ status: 200, data: messages });
    render(<ContactMessagesModule />);
    await screen.findByText('يونس الجزائري');

    fireEvent.change(screen.getByPlaceholderText(/بحث بالاسم أو البريد الإلكتروني/), {
      target: { value: 'رياضيات' },
    });

    expect(screen.queryByText('يونس الجزائري')).not.toBeInTheDocument();
    expect(screen.getByText('أمينة بن جامع')).toBeInTheDocument();
  });

  it('shows an honest error message when the backend call fails, not an empty state', async () => {
    vi.spyOn(springBootApi, 'getContactMessages').mockResolvedValue({
      status: 500,
      error: 'Erreur serveur (500)',
    });

    render(<ContactMessagesModule />);

    await waitFor(() => {
      expect(screen.getByText('Erreur serveur (500)')).toBeInTheDocument();
    });
    expect(screen.queryByText('لا توجد رسائل تواصل بهذه المعايير.')).not.toBeInTheDocument();
  });

  it('shows an empty state (not an error) when there are genuinely no messages yet', async () => {
    vi.spyOn(springBootApi, 'getContactMessages').mockResolvedValue({ status: 200, data: [] });

    render(<ContactMessagesModule />);

    await waitFor(() => {
      expect(screen.getByText('لا توجد رسائل تواصل بهذه المعايير.')).toBeInTheDocument();
    });
  });
});

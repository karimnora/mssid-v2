import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminReceiptsManager } from './AdminReceiptsManager';
import { AuthService } from '../services/authService';

describe('AdminReceiptsManager Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders payment receipts list and status filter tabs', () => {
    render(<AdminReceiptsManager isOpen={true} onClose={vi.fn()} onReceiptUpdated={vi.fn()} />);

    expect(screen.getByText(/لوحة تحكم المشرف/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /جميع الوصولات/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /قيد الانتظار/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /المقبولة/i })).toBeInTheDocument();
  });

  it('filters receipts by status when filter buttons are clicked', () => {
    render(<AdminReceiptsManager isOpen={true} onClose={vi.fn()} onReceiptUpdated={vi.fn()} />);

    const pendingBtn = screen.getByRole('button', { name: /قيد الانتظار/i });
    fireEvent.click(pendingBtn);

    // Only PENDING_VERIFICATION items should be visible
    expect(screen.getByText('PENDING_VERIFICATION')).toBeInTheDocument();
    expect(screen.queryByText('APPROVED')).not.toBeInTheDocument();
  });

  it('displays receipt preview and allows approving receipt (Happy Path)', () => {
    const handleUpdated = vi.fn();
    render(<AdminReceiptsManager isOpen={true} onClose={vi.fn()} onReceiptUpdated={handleUpdated} />);

    // Click on pending receipt for user 'أحمد التلميذ'
    const pendingItem = screen.getByText('أحمد التلميذ').closest('div');
    if (pendingItem) {
      fireEvent.click(pendingItem);
    }

    // Check preview title
    expect(screen.getByText(/تفاصيل معالجة وصل الدفع/i)).toBeInTheDocument();

    // Click Approve button
    const approveBtn = screen.getByRole('button', { name: /المصادقة وتفعيل اشتراك ROLE_PREMIUM/i });
    fireEvent.click(approveBtn);

    expect(handleUpdated).toHaveBeenCalled();
  });

  it('allows rejecting a receipt with a custom rejection reason', () => {
    const handleUpdated = vi.fn();
    render(<AdminReceiptsManager isOpen={true} onClose={vi.fn()} onReceiptUpdated={handleUpdated} />);

    // Click on pending receipt
    const pendingItem = screen.getByText('أحمد التلميذ').closest('div');
    if (pendingItem) {
      fireEvent.click(pendingItem);
    }

    // Type custom rejection reason
    const reasonInput = screen.getByPlaceholderText('سبب الرفض...');
    fireEvent.change(reasonInput, { target: { value: 'صورة الحوالة منتهية الصلاحية' } });

    // Click Reject button
    const rejectBtn = screen.getByRole('button', { name: /رفض الوصل/i });
    fireEvent.click(rejectBtn);

    expect(handleUpdated).toHaveBeenCalled();
  });
});

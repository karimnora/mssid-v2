import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactModal } from './ContactModal';
import { LocaleProvider } from '../context/LocaleContext';

const renderModal = (prefillMessage: string | null) =>
  render(
    <LocaleProvider>
      <ContactModal isOpen onClose={vi.fn()} prefillMessage={prefillMessage} />
    </LocaleProvider>,
  );

describe('ContactModal — pre-filled error report', () => {
  it('pre-fills the message and selects "bug" as the type when opened via a report-error trigger', () => {
    renderModal('⚠️ خطأ في: الدرس: الجملة الاسمية (4AP)\n\nوصف الخطأ:\n');

    const textarea = screen.getByPlaceholderText('اكتب اقتراحك أو استفسارك هنا...') as HTMLTextAreaElement;
    expect(textarea.value).toContain('الجملة الاسمية (4AP)');

    const bugTypeButton = screen.getByText('🐞 الإبلاغ عن مشكلة');
    expect(bugTypeButton.className).toContain('bg-emerald-600');
  });

  it('leaves the message empty and defaults to "suggestion" when opened normally (no prefill)', () => {
    renderModal(null);

    const textarea = screen.getByPlaceholderText('اكتب اقتراحك أو استفسارك هنا...') as HTMLTextAreaElement;
    expect(textarea.value).toBe('');

    const suggestionButton = screen.getByText('💡 اقتراح');
    expect(suggestionButton.className).toContain('bg-emerald-600');
  });
});

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, within, screen } from '@testing-library/react';
import { SettingsModal } from './SettingsModal';
import { LocaleProvider } from '../context/LocaleContext';

const renderModal = (ui: React.ReactElement) => render(<LocaleProvider>{ui}</LocaleProvider>);

describe('SettingsModal', () => {
  it('shows the app version without the internal build number', () => {
    renderModal(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        tashkeelEnabled={false}
        onToggleTashkeel={vi.fn()}
      />
    );
    expect(screen.getByText(new RegExp(__APP_VERSION__.replaceAll('.', '\\.')))).toBeInTheDocument();
    expect(screen.queryByText(/build|البناء/i)).not.toBeInTheDocument();
  });

  it('lets a parent change the school year, then closes so the change is visibly confirmed', () => {
    const onGradeChange = vi.fn();
    const onClose = vi.fn();
    renderModal(
      <SettingsModal
        isOpen={true}
        onClose={onClose}
        tashkeelEnabled={false}
        onToggleTashkeel={vi.fn()}
        currentGrade="1AP"
        onGradeChange={onGradeChange}
      />
    );
    const strip = document.querySelector('[data-profile-grade-strip]') as HTMLElement;
    fireEvent.click(within(strip).getByText('السنة الخامسة'));
    expect(onGradeChange).toHaveBeenCalledWith('5AP');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows admin console entry for ROLE_ADMIN users', () => {
    const onOpenAdminConsole = vi.fn();
    renderModal(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        tashkeelEnabled={false}
        onToggleTashkeel={vi.fn()}
        authUser={{
          id: 1,
          email: 'admin@mssid.dz',
          nom: 'Admin',
          role: 'ROLE_ADMIN',
          emailVerified: true,
        }}
        onOpenAdminConsole={onOpenAdminConsole}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /لوحة تحكم الإدارة|Tableau de bord d'administration/i }));
    expect(onOpenAdminConsole).toHaveBeenCalledTimes(1);
  });

  it('names the close button for screen readers', () => {
    renderModal(
      <SettingsModal
        isOpen={true}
        onClose={vi.fn()}
        tashkeelEnabled={false}
        onToggleTashkeel={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: 'إغلاق' })).toBeInTheDocument();
  });
});

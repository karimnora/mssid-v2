import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileModal } from './ProfileModal';
import { AuthService } from '../services/authService';
import { AuthUser } from '../types/auth';
import { UserProfile } from '../types';
import { LocaleProvider } from '../context/LocaleContext';

const renderModal = (ui: React.ReactElement) => render(<LocaleProvider>{ui}</LocaleProvider>);

const baseUserProfile: UserProfile = {
  name: 'يونس',
  grade: '5AP',
  avatar: '🎓',
  xp: 120,
  level: 2,
  streakDays: 3,
  lastActiveDate: '2026-08-17',
  completedLessonIds: [],
  completedExamIds: [],
  completedChallengeIds: [],
  completedGameIds: [],
  completedLabIds: [],
  quizFullyValidatedLessonIds: [],
  badges: [],
  badgeUnlockedAt: {},
  quizScores: {},
};

const baseAuthUser: AuthUser = {
  id: 1,
  nom: 'يونس',
  email: 'younes@mssid.dz',
  role: 'ROLE_FREE',
  emailVerified: false,
};

describe('ProfileModal email verification reminder', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the discreet verification card when the account email is unverified', () => {
    renderModal(
      <ProfileModal
        isOpen={true}
        onClose={vi.fn()}
        userProfile={baseUserProfile}
        authUser={baseAuthUser}
        onResetProgress={vi.fn()}
      />
    );

    expect(screen.getByText('قم بتأكيد بريدك الإلكتروني')).toBeInTheDocument();
  });

  it('does not show the verification card once the account email is verified', () => {
    renderModal(
      <ProfileModal
        isOpen={true}
        onClose={vi.fn()}
        userProfile={baseUserProfile}
        authUser={{ ...baseAuthUser, emailVerified: true }}
        onResetProgress={vi.fn()}
      />
    );

    expect(screen.queryByText('قم بتأكيد بريدك الإلكتروني')).not.toBeInTheDocument();
  });

  it('submits the 6-digit code via AuthService.verifyEmailCode and shows a success message', async () => {
    const verifySpy = vi
      .spyOn(AuthService, 'verifyEmailCode')
      .mockResolvedValue({ success: true, message: 'تم تأكيد البريد الإلكتروني بنجاح.' });

    renderModal(
      <ProfileModal
        isOpen={true}
        onClose={vi.fn()}
        userProfile={baseUserProfile}
        authUser={baseAuthUser}
        onResetProgress={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('123456');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'تأكيد' }));

    await waitFor(() => {
      expect(verifySpy).toHaveBeenCalledWith('123456');
      expect(screen.getByText('تم تأكيد البريد الإلكتروني بنجاح.')).toBeInTheDocument();
    });
  });

  it('shows an error message when the code is wrong', async () => {
    vi.spyOn(AuthService, 'verifyEmailCode').mockResolvedValue({
      success: false,
      message: 'الرمز غير صحيح أو منتهي الصلاحية.',
    });

    renderModal(
      <ProfileModal
        isOpen={true}
        onClose={vi.fn()}
        userProfile={baseUserProfile}
        authUser={baseAuthUser}
        onResetProgress={vi.fn()}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: '000000' } });
    fireEvent.click(screen.getByRole('button', { name: 'تأكيد' }));

    await waitFor(() => {
      expect(screen.getByText('الرمز غير صحيح أو منتهي الصلاحية.')).toBeInTheDocument();
    });
  });

  it('disables the confirm button until 6 digits are entered', () => {
    renderModal(
      <ProfileModal
        isOpen={true}
        onClose={vi.fn()}
        userProfile={baseUserProfile}
        authUser={baseAuthUser}
        onResetProgress={vi.fn()}
      />
    );

    const button = screen.getByRole('button', { name: 'تأكيد' });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: '123' } });
    expect(button).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('123456'), { target: { value: '123456' } });
    expect(button).not.toBeDisabled();
  });

  it('calls AuthService.resendVerificationCode and starts the cooldown on resend click', async () => {
    const resendSpy = vi
      .spyOn(AuthService, 'resendVerificationCode')
      .mockResolvedValue({ success: true, message: 'تم إرسال رمز جديد.' });

    renderModal(
      <ProfileModal
        isOpen={true}
        onClose={vi.fn()}
        userProfile={baseUserProfile}
        authUser={baseAuthUser}
        onResetProgress={vi.fn()}
      />
    );

    const resendButton = screen.getByRole('button', { name: /لم يصلك الرمز؟ إعادة الإرسال/ });
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(resendSpy).toHaveBeenCalled();
    });

    expect(screen.getByRole('button', { name: /إعادة الإرسال بعد \d+ ثانية/ })).toBeDisabled();
  });
});

describe('ProfileModal progress reset', () => {
  it('opens the parent gate before resetting progress', () => {
    const onResetProgress = vi.fn();
    renderModal(
      <ProfileModal
        isOpen={true}
        onClose={vi.fn()}
        userProfile={baseUserProfile}
        authUser={baseAuthUser}
        onResetProgress={onResetProgress}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'إعادة تعيين التقدم' }));
    expect(onResetProgress).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog', { name: 'بوابة الوالدين' })).toBeInTheDocument();
  });
});

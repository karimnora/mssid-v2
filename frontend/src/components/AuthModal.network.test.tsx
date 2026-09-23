import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { AuthModal } from './AuthModal';
import { AuthService } from '../services/authService';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); setStoredLocale('ar'); });

it('explains a slow login, preserves input and allows an explicit retry after failure', async () => {
  vi.useFakeTimers(); setStoredLocale('fr');
  let finish!: (value: Awaited<ReturnType<typeof AuthService.loginAsync>>) => void;
  const login = vi.spyOn(AuthService, 'loginAsync').mockReturnValue(new Promise((resolve) => { finish = resolve; }));
  render(<LocaleProvider><AuthModal isOpen onClose={vi.fn()} onAuthSuccess={vi.fn()} /></LocaleProvider>);
  fireEvent.change(screen.getByPlaceholderText('example@mssid.dz'), { target: { value: 'parent@example.com' } });
  const password = screen.getByPlaceholderText('••••••••');
  fireEvent.change(password, { target: { value: 'test-password' } });
  fireEvent.submit(password.closest('form')!);
  await act(async () => { await vi.advanceTimersByTimeAsync(8000); });
  expect(screen.getByRole('status')).toHaveTextContent('Le serveur met du temps');
  fireEvent.submit(password.closest('form')!);
  expect(login).toHaveBeenCalledTimes(1);
  await act(async () => finish({ user: null, error: 'Connexion interrompue.' }));
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(screen.getByPlaceholderText('example@mssid.dz')).toHaveValue('parent@example.com');
  expect(password).toHaveValue('test-password');
  login.mockResolvedValue({ user: null, error: 'Connexion interrompue.' });
  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Réessayer' })));
  expect(login).toHaveBeenCalledTimes(2);
});

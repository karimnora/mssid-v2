import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { FirstStepsModal, pendingFirstSteps } from './FirstStepsModal';
import { LocaleProvider } from '../../context/LocaleContext';
import { setStoredLocale } from '../../localePreference';
import { springBootApi } from '../../services/springBootApi';
import { AuthService } from '../../services/authService';
import { mapAuthProfile } from '../../services/authProfile';
import type { AuthUser } from '../../types/auth';

vi.mock('../../utils/speech', () => ({ speakText: vi.fn(() => Promise.resolve()), stopSpeech: vi.fn() }));

const user: AuthUser = { id: 9, nom: 'Amine', email: 'famille@gmail.com', role: 'ROLE_FREE', gradeSet: false, parentEmailSet: false };
const show = (props: Partial<React.ComponentProps<typeof FirstStepsModal>> = {}) => {
  const onChooseGrade = vi.fn();
  const onDone = vi.fn();
  render(
    <FirstStepsModal user={user} needGrade needParent journeyAvailable onChooseGrade={onChooseGrade} onDone={onDone} {...props} />,
    { wrapper: LocaleProvider },
  );
  return { onChooseGrade, onDone };
};

beforeEach(() => {
  localStorage.clear();
  setStoredLocale('fr');
  AuthService.setCurrentUser(user);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  AuthService.setCurrentUser(null);
});

describe('pendingFirstSteps', () => {
  const day = new Date('2026-11-03T10:00:00Z');
  it('asks only what the server reports missing', () => {
    expect(pendingFirstSteps(user, false, day)).toEqual({ grade: true, parent: true });
    expect(pendingFirstSteps({ ...user, gradeSet: true, parentEmailSet: true }, false, day)).toEqual({ grade: false, parent: false });
    expect(pendingFirstSteps({ ...user, gradeSet: undefined, parentEmailSet: undefined }, false, day)).toEqual({ grade: false, parent: false });
    expect(pendingFirstSteps(null, false, day)).toEqual({ grade: false, parent: false });
  });
  it('skips the grade when a child profile is active (each child has its own grade)', () => {
    expect(pendingFirstSteps(user, true, day).grade).toBe(false);
  });
  it('maps the server flags without inventing them', () => {
    expect(mapAuthProfile({ id: 1, gradeSet: false, parentEmailSet: true })).toMatchObject({ gradeSet: false, parentEmailSet: true });
    expect(mapAuthProfile({ id: 1 }).gradeSet).toBeUndefined();
  });
});

describe('FirstStepsModal', () => {
  it('grade → parent e-mail → start the Didou journey in 1AP', async () => {
    const put = vi.spyOn(springBootApi, 'updateParentEmail').mockResolvedValue({ status: 200, data: {} });
    const { onChooseGrade, onDone } = show();
    expect(screen.getByText('Étape 1 sur 2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /1re année/ }));
    expect(onChooseGrade).toHaveBeenCalledWith('1AP');
    expect(pendingFirstSteps(user, false).grade).toBe(false);
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Recevoir le bilan' }));
    await waitFor(() => expect(put).toHaveBeenCalledWith('famille@gmail.com'));
    expect(AuthService.getCurrentUser()?.parentEmailSet).toBe(true);
    fireEvent.click(await screen.findByRole('button', { name: 'Partir avec Didou' }));
    expect(onDone).toHaveBeenCalledWith({ journey: true, grade: '1AP' });
  });

  it('checks the address before calling the server, and survives a server error', async () => {
    const put = vi.spyOn(springBootApi, 'updateParentEmail').mockResolvedValue({ status: 503, error: 'offline' });
    show({ needGrade: false });
    fireEvent.change(screen.getByLabelText('E-mail du parent'), { target: { value: 'pas-un-email' } });
    fireEvent.click(screen.getByRole('button', { name: 'Recevoir le bilan' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Vérifiez');
    expect(put).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('E-mail du parent'), { target: { value: 'maman@exemple.dz' } });
    fireEvent.click(screen.getByRole('button', { name: 'Recevoir le bilan' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Enregistrement impossible');
    expect(AuthService.getCurrentUser()?.parentEmailSet).toBe(false);
  });

  it('“Plus tard” postpones the parent step until tomorrow', () => {
    const { onDone } = show({ needGrade: false, user: { ...user, grade: '3AP' } });
    fireEvent.click(screen.getByRole('button', { name: 'Plus tard' }));
    expect(pendingFirstSteps(user, false).parent).toBe(false);
    expect(pendingFirstSteps(user, false, new Date(Date.now() + 36 * 3600 * 1000)).parent).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Commencer' }));
    expect(onDone).toHaveBeenCalledWith({ journey: false, grade: '3AP' });
  });

  it('only offers the journey in 1AP when the map is available', () => {
    const { onDone } = show({ needParent: false, journeyAvailable: false });
    fireEvent.click(screen.getByRole('button', { name: /1re année/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Commencer' }));
    expect(onDone).toHaveBeenCalledWith({ journey: false, grade: '1AP' });
  });

  it('speaks Arabic and lays out right-to-left', () => {
    setStoredLocale('ar');
    show();
    expect(screen.getByRole('dialog')).toHaveAttribute('dir', 'rtl');
    expect(screen.getByText('في أي قسم تدرس؟')).toBeInTheDocument();
  });
});

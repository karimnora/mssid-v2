import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within, act, waitFor } from '@testing-library/react';
import { Capacitor } from '@capacitor/core';
import { MusaidiPanel } from './MusaidiPanel';
import { LocaleProvider } from '../../context/LocaleContext';
import { setStoredLocale } from '../../localePreference';
import type { CourseLesson } from '../../types';

vi.mock('../../utils/speech', () => ({ speakText: vi.fn(() => Promise.resolve()), stopSpeech: vi.fn() }));
let role: string | undefined;
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ authUser: role ? { id: 5, nom: 'P', email: 'p@test.invalid', role } : null, isAuthLoading: false }),
}));
// Server quota (MusaidiQuotaService): null = unreachable, so the device counter is used.
let server: { opened: string[] } | null = null;
vi.mock('../../services/springBootApi', () => ({
  springBootApi: {
    getMusaidiToday: vi.fn(async () => (server ? { status: 200, data: { allowed: true, premium: false, limit: 3, remaining: 3 - server.opened.length, opened: server.opened, day: 'd' } } : { status: 0 })),
    openMusaidi: vi.fn(async (id: string) => {
      if (!server) return { status: 0 };
      const allowed = server.opened.includes(id) || server.opened.length < 3;
      if (allowed && !server.opened.includes(id)) server.opened = [...server.opened, id];
      return { status: 200, data: { allowed, premium: false, limit: 3, remaining: 3 - server.opened.length, opened: server.opened, day: 'd' } };
    }),
  },
}));

const q = (n: number) => ({
  id: `q${n}`,
  questionAr: `كم يساوي ${n} + 1 ؟`,
  hintAr: `ابدأ من ${n} وأضف واحداً`,
  options: [
    { id: 'a', textAr: `${n + 1}`, isCorrect: true, explanationAr: `${n} + 1 = ${n + 1}` },
    { id: 'b', textAr: `${n + 2}`, isCorrect: false },
  ],
});
const lesson = (id: string, subject: 'math' | 'arabic', trimester: 1 | 2, quiz: ReturnType<typeof q>[]) =>
  ({ id, grade: '1AP', subject, trimester, titleAr: `درس ${id}`, categoryAr: '', summaryAr: '', rulesAr: ['نضيف واحداً فنحصل على العدد الموالي'], quiz }) as unknown as CourseLesson;
const courses = [
  lesson('m1', 'math', 1, [q(1), q(2), q(3)]),
  lesson('m2', 'math', 2, [q(4), q(5)]),
  lesson('a1', 'arabic', 1, [{ ...q(9), questionAr: 'ما الحرف الأول في كلمة بَيْت ؟' }]),
];
const show = (props: Partial<React.ComponentProps<typeof MusaidiPanel>> = {}) =>
  render(<MusaidiPanel grade="1AP" courses={courses} onClose={vi.fn()} {...props} />, { wrapper: LocaleProvider });
const openQuestion = (text: RegExp) => fireEvent.click(screen.getByRole('button', { name: text }));
const reveal = () => act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Voir la correction détaillée' })); });
const back = () => fireEvent.click(screen.getByRole('button', { name: /Autres questions/ }));

beforeEach(() => {
  localStorage.clear();
  setStoredLocale('fr');
  role = undefined;
  server = null;
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('« مساعدي » panel', () => {
  it('filters by subject, trimester and lesson, and searches without harakat', () => {
    show();
    expect(screen.getAllByRole('button', { name: /كم يساوي/ })).toHaveLength(5);
    fireEvent.change(screen.getByLabelText('Trimestre'), { target: { value: '2' } });
    expect(screen.getAllByRole('button', { name: /كم يساوي/ })).toHaveLength(2);
    fireEvent.change(screen.getByLabelText('Matière'), { target: { value: 'arabic' } });
    fireEvent.change(screen.getByLabelText('Trimestre'), { target: { value: 'all' } });
    fireEvent.change(screen.getByLabelText('Chercher une question'), { target: { value: 'بَيْت' } });
    expect(screen.getByRole('button', { name: /الحرف الأول/ })).toBeInTheDocument();
  });

  it('gives hint and rule for free, then counts 3 detailed corrections per day', async () => {
    show();
    openQuestion(/كم يساوي 1 \+/);
    fireEvent.click(screen.getByRole('button', { name: 'Un indice' }));
    expect(screen.getByText(/ابدأ من 1/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'La règle' }));
    expect(screen.getByText(/العدد الموالي/)).toBeInTheDocument();
    expect(screen.queryByText(/Réponse/)).not.toBeInTheDocument();
    await reveal();
    expect(within(screen.getByRole('region', { name: 'Correction' })).getByText('1 + 1 = 2')).toBeInTheDocument();
    back();
    openQuestion(/كم يساوي 2 \+/); await reveal(); back();
    openQuestion(/كم يساوي 3 \+/); await reveal(); back();
    expect(screen.getByText(/0 correction\(s\) détaillée\(s\) restante\(s\)/)).toBeInTheDocument();
    openQuestion(/كم يساوي 4 \+/); await reveal();
    expect(screen.getByRole('alert')).toHaveTextContent('reviennent demain');
    expect(screen.queryByRole('region', { name: 'Correction' })).not.toBeInTheDocument();
    back();
    openQuestion(/كم يساوي 1 \+/);
    expect(screen.getByRole('region', { name: 'Correction' })).toBeInTheDocument();
  });

  it('keeps the limit message neutral in the native app', async () => {
    vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
    show();
    for (const n of [1, 2, 3]) { openQuestion(new RegExp(`كم يساوي ${n} \\+`)); await reveal(); back(); }
    openQuestion(/كم يساوي 4 \+/); await reveal();
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Famille Premium n’ont pas de limite');
    expect(alert.textContent).not.toMatch(/ouvre|DA|دج|payer|abonnez/i);
  });

  it('never limits a Premium family', async () => {
    role = 'ROLE_PREMIUM';
    show();
    for (const n of [1, 2, 3, 4, 5]) { openQuestion(new RegExp(`كم يساوي ${n} \\+`)); await reveal(); expect(screen.getByRole('region', { name: 'Correction' })).toBeInTheDocument(); back(); }
    expect(screen.queryByText(/restante/)).not.toBeInTheDocument();
  });

  it('a signed-in free account follows the server count, even on a freshly reset phone', async () => {
    role = 'ROLE_FREE';
    server = { opened: ['m1:quiz:q1', 'm1:quiz:q2', 'm1:quiz:q3'] };
    show();
    await waitFor(() => expect(screen.getByText(/0 correction\(s\) détaillée\(s\) restante\(s\)/)).toBeInTheDocument());
    openQuestion(/كم يساوي 4 \+/); await reveal();
    expect(screen.getByRole('alert')).toHaveTextContent('reviennent demain');
    back();
    // Already opened today (on another device): shown again for free, no button to press.
    openQuestion(/كم يساوي 2 \+/);
    expect(screen.getByRole('region', { name: 'Correction' })).toBeInTheDocument();
  });

  it('opens on the current lesson and links back to it', () => {
    const review = vi.fn(), close = vi.fn();
    show({ lesson: courses[1], onReviewLesson: review, onClose: close });
    expect(screen.getByLabelText('Leçon')).toHaveValue('m2');
    openQuestion(/كم يساوي 4 \+/);
    fireEvent.click(screen.getByRole('button', { name: /Revoir la leçon/ }));
    expect(close).toHaveBeenCalledOnce();
    expect(review).toHaveBeenCalledWith('m2');
  });

  it('waits for the catalog', () => {
    show({ courses: null });
    expect(screen.getByRole('status')).toHaveTextContent('Préparation des questions');
  });
});

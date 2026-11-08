import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within, act, waitFor } from '@testing-library/react';
import { setActiveProgressOwner } from '../../utils/progressOwner';
import { readMusaidiHelp } from '../../utils/musaidiHistory';
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
const openQuestion = (pattern: RegExp) => {
  const text = new RegExp('^(?:Correction vue)?' + pattern.source);
  if (!screen.queryByRole('button', { name: text })) {
    if (screen.queryByRole('button', { name: 'Autres matières' })) fireEvent.click(screen.getByRole('button', { name: 'Autres matières' }));
    fireEvent.click(screen.getByRole('button', { name: 'Mathématiques' }));
    const id = /[45]/.test(text.source) ? 'm2' : 'm1';
    if (!screen.queryByRole('button', { name: `درس ${id}` })) fireEvent.click(screen.getByRole('button', { name: 'Autres leçons' }));
    fireEvent.click(screen.getByRole('button', { name: `درس ${id}` }));
  }
  fireEvent.click(screen.getByRole('button', { name: text }));
};
const reveal = () => act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Voir la correction détaillée' })); });
const back = () => fireEvent.click(screen.getByRole('button', { name: /Autres questions/ }));

beforeEach(() => {
  setActiveProgressOwner();
  localStorage.clear();
  setStoredLocale('fr');
  role = undefined;
  server = null;
});
afterEach(() => {
  cleanup();
  setActiveProgressOwner();
  vi.restoreAllMocks();
});

describe('« مساعدي » panel', () => {
  it('offers a three tap path with no grade switch or selects', () => {
    show();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '2AP' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Mathématiques' }));
    fireEvent.click(screen.getByRole('button', { name: 'درس m1' }));
    fireEvent.click(screen.getByRole('button', { name: /^كم يساوي 1/ }));
    expect(screen.getByRole('button', { name: 'Un indice' })).toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('keeps a foreign grade lesson out of the active grade', () => {
    show({ lesson: { ...courses[0], grade: '5AP' } });
    expect(screen.queryByRole('button', { name: /^كم يساوي/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mathématiques' })).toBeInTheDocument();
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
    expect(screen.getByRole('status')).toHaveTextContent(/0 correction\(s\) détaillée\(s\) restante\(s\)/);
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
    show({ lesson: courses[1] });
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/0 correction\(s\) détaillée\(s\) restante\(s\)/));
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
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    openQuestion(/كم يساوي 4 \+/);
    fireEvent.click(screen.getByRole('button', { name: /Revoir la leçon/ }));
    expect(close).toHaveBeenCalledOnce();
    expect(review).toHaveBeenCalledWith('m2');
  });

  it('searches in 5AP and resets the open question when the grade changes', () => {
    const older = courses.map(l => ({ ...l, grade: '5AP' as const }));
    const view = show({ grade: '5AP', courses: older, lesson: older[2] });
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'بيت' } });
    expect(screen.getByRole('button', {name:/^ما الحرف/})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name:/^ما الحرف/}));
    view.rerender(<MusaidiPanel grade="1AP" courses={courses} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', {name:'La règle'})).not.toBeInTheDocument();
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name:'Mathématiques'})).toBeInTheDocument();
  });

  it('reveals Premium corrections by step, then records the twin with help', async () => {
    role='ROLE_PREMIUM';
    const actual = {...courses[0],id:'math-1ap-t2-addition-concept'};
    const result=vi.fn();
    show({courses:[actual],lesson:actual,onPracticeResult:result});
    openQuestion(/كم يساوي 1 \+/);await reveal();
    expect(screen.queryByText('1 + 1 = 2')).not.toBeInTheDocument();
    expect(screen.queryByRole('region',{name:'Question jumelle'})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Essayer l’étape suivante'}));
    expect(screen.getByRole('textbox',{name:/Ton essai/})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Révéler l’étape'}));
    expect(screen.getByText('1 + 1 = 2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Révéler l’étape'}));
    const twin=screen.getByRole('region',{name:'Question jumelle'});
    fireEvent.click(within(twin).getByRole('button',{name:'3'}));
    expect(result).toHaveBeenCalledWith(actual.id,expect.objectContaining({outcome:'success',helped:true,competenceId:'math-1ap-c-addition'}));
  });

  it('counts help once per question opening and clears the view across sibling profiles', () => {
    setActiveProgressOwner(5,1);
    const view=show({lesson:courses[0]});openQuestion(/كم يساوي 1 \+/);
    fireEvent.click(screen.getByRole('button',{name:'Un indice'}));
    fireEvent.click(screen.getByRole('button',{name:'La règle'}));
    expect(readMusaidiHelp('user:5:child:1')[0].count).toBe(1);
    act(()=>setActiveProgressOwner(5,2));
    view.rerender(<MusaidiPanel grade="1AP" courses={courses} lesson={courses[0]} onClose={vi.fn()} />);
    expect(screen.queryByText(/ابدأ من 1/)).not.toBeInTheDocument();
    expect(readMusaidiHelp('user:5:child:2')).toEqual([]);
  });

  it('shows only real Premium difficulties and revisions from the requested trimester', () => {
    role='ROLE_PREMIUM';
    const actual={...courses[0],id:'math-5ap-fractions',grade:'5AP' as const};
    const profile={grade:'5AP',competenceStats:{'math-5ap-c-fractions':{attempts:1,successes:0,lastOutcome:'fail',lastAt:new Date().toISOString(),lastLessonId:actual.id}}} as unknown as import('../../types').UserProfile;
    const view=show({grade:'5AP',courses:[actual],userProfile:profile,countdown:{trimester:2,daysLeft:5,examDate:'2026-12-01'}});
    expect(screen.getByRole('region',{name:'Didou te propose'})).toHaveTextContent(/Une erreur à retravailler/);
    expect(screen.queryByRole('region',{name:'Révision avant les compositions'})).not.toBeInTheDocument();
    view.rerender(<MusaidiPanel grade="5AP" courses={[actual]} userProfile={profile} countdown={{trimester:1,daysLeft:5,examDate:'2026-12-01'}} onClose={vi.fn()}/>);
    expect(screen.getByRole('region',{name:'Révision avant les compositions'})).toBeInTheDocument();
    view.rerender(<MusaidiPanel grade="5AP" courses={[actual]} userProfile={{...profile,competenceStats:{}}} onClose={vi.fn()}/>);
    expect(screen.queryByRole('region',{name:'Didou te propose'})).not.toBeInTheDocument();
  });

  it('keeps suggestions on the help home and off another lesson being browsed', () => {
    role='ROLE_PREMIUM';
    const actual={...courses[0],id:'math-5ap-fractions',grade:'5AP' as const};
    const profile={grade:'5AP',competenceStats:{'math-5ap-c-fractions':{attempts:1,successes:0,lastOutcome:'fail',lastAt:new Date().toISOString(),lastLessonId:actual.id}}} as unknown as import('../../types').UserProfile;
    const view=show({grade:'5AP',courses:[actual],userProfile:profile});
    expect(screen.getByRole('region',{name:'Didou te propose'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Mathématiques'}));
    expect(screen.queryByRole('region',{name:'Didou te propose'})).not.toBeInTheDocument();
    view.unmount();
    show({grade:'5AP',courses:[actual],userProfile:profile,lesson:actual});
    expect(screen.getByRole('region',{name:'Didou te propose'})).toBeInTheDocument();
  });

  it('does not repeat the free lesson list as suggestions when opened from that lesson', () => {
    show({lesson:courses[0]});
    expect(screen.queryByRole('region',{name:'Didou te propose'})).not.toBeInTheDocument();
    expect(screen.getAllByRole('button',{name:/^كم يساوي 1 \+/})).toHaveLength(1);
  });

  it('waits for the catalog', () => {
    show({ courses: null });
    expect(screen.getByRole('status')).toHaveTextContent('Préparation des questions');
  });
});

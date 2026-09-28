import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { HomeView } from './HomeView';
import { LocaleProvider } from '../context/LocaleContext';
import { setStoredLocale } from '../localePreference';

const voiceAvailable = vi.hoisted(() => ({ value: true as boolean | null }));
vi.mock('../utils/speech', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/speech')>();
  return {
    ...actual,
    useVoiceAvailable: () => voiceAvailable.value,
  };
});

const renderHome = (
  grade: '1AP' | '2AP' | '5AP',
  extras?: Partial<React.ComponentProps<typeof HomeView>>,
) =>
  render(
    <LocaleProvider>
      <HomeView
        grade={grade}
        authUser={null}
        userName=""
        onSelectPole={vi.fn()}
        onOpenPreschool={vi.fn()}
        onOpenMathLab={vi.fn()}
        {...extras}
      />
    </LocaleProvider>
  );

describe('HomeView', () => {
  beforeEach(() => {
    setStoredLocale('ar');
    voiceAvailable.value = true;
  });

  afterEach(() => {
    setStoredLocale('ar');
  });

  it('shows the four poles on 1AP like 3AP–5AP', () => {
    renderHome('1AP');
    expect(document.querySelector('[data-home-layout="full"]')).toBeTruthy();
    expect(document.querySelector('[data-home-poles="kids"]')).toBeTruthy();
    expect(document.querySelector('[data-home-layout="young"]')).toBeNull();
    expect(screen.getByText(/مراجعة الدروس/)).toBeInTheDocument();
    expect(screen.getByText(/استكشف الرياضيات/)).toBeInTheDocument();
    expect(screen.getByText(/اللغة العربية/)).toBeInTheDocument();
    expect(screen.getAllByText(/الرياضيات/).length).toBeGreaterThan(0);
    expect(screen.getByText(/ساحة التحديات/)).toBeInTheDocument();
    expect(screen.getByText(/بنك الامتحانات/)).toBeInTheDocument();
    // 1AP has no formal trimester exams (see CLAUDE.md curriculum notes) — the card itself (not the
    // section header, which stays generic) shows a lighter "in-lesson practice" framing instead of
    // the exam-bank card used from 2AP up.
    expect(screen.getByText(/تمارين صغيرة/)).toBeInTheDocument();
    expect(screen.getByText(/المختبرات والأدوات/)).toBeInTheDocument();
    expect(document.querySelector('[data-pole-icon="courses"]')).toBeTruthy();
    expect(document.querySelector('[data-pole-icon="challenges"]')).toBeTruthy();
    expect(document.querySelector('[data-pole-icon="exams"]')).toBeTruthy();
    expect(document.querySelector('[data-pole-icon="labs"]')).toBeTruthy();
  });

  // Regression test: HomeView used to silently send 1AP's exam-bank "See all" link and card
  // straight to the courses pole instead of the exams pole — bypassing ExamsViewer's own friendly
  // empty state ("1AP : évaluation continue, pas d'examens officiels" + a button to open courses),
  // which is exactly what should be shown instead of a confusing unexplained redirect.
  it('opens the real exams pole for 1AP (not a silent courses redirect)', () => {
    const onSelectPole = vi.fn();
    renderHome('1AP', { onSelectPole });

    const examsPoleCard = document.querySelector('[data-pole="exams"]');
    expect(examsPoleCard).toBeTruthy();
    fireEvent.click(examsPoleCard as Element);

    expect(onSelectPole).not.toHaveBeenCalledWith('courses');
    expect(onSelectPole).toHaveBeenCalledWith('exams');
  });

  it('opens math lessons from the explicitly labeled math CTA', () => {
    const onSelectSubject = vi.fn();
    renderHome('5AP', { onSelectSubject });
    fireEvent.click(screen.getByRole('button', { name: /استكشف الرياضيات/ }));
    expect(onSelectSubject).toHaveBeenCalledWith('math');
  });

  it('labels the welcome offer and currency accurately for guests', () => {
    setStoredLocale('fr');
    renderHome('5AP', { goldCoins: 42 });
    expect(screen.getByText(/choisis une activité pour apprendre/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /42 pièces/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explorer les maths/ })).toBeInTheDocument();
  });

  it('shows the math lab shortcut instead of Tamazight', () => {
    renderHome('5AP');
    expect(screen.getByText('الرياضيات والحساب')).toBeInTheDocument();
    expect(screen.queryByText(/الأمازيغية/)).toBeNull();
    expect(screen.queryByText(/تيفيناغ/)).toBeNull();
  });

  it('shows the four poles on 2AP', () => {
    renderHome('2AP');
    expect(document.querySelector('[data-home-layout="full"]')).toBeTruthy();
    expect(screen.getByText(/ساحة التحديات/)).toBeInTheDocument();
    expect(screen.getByText(/المختبرات والأدوات/)).toBeInTheDocument();
  });

  it('keeps the four poles on 5AP', () => {
    renderHome('5AP');
    expect(document.querySelector('[data-home-layout="full"]')).toBeTruthy();
    expect(screen.getByText(/ساحة التحديات/)).toBeInTheDocument();
    expect(screen.getByText(/بنك الامتحانات/)).toBeInTheDocument();
  });

  it('shows the preschool card fully in French without a crushed row', () => {
    setStoredLocale('fr');
    renderHome('1AP');
    expect(screen.getByText(/Le coin des petits avec Didou/)).toBeInTheDocument();
    expect(screen.getByText('Entrer')).toBeInTheDocument();
    expect(screen.queryByText(/Braem/)).toBeNull();
  });

  it('warns 1AP–3AP when no matching TTS voice is installed, not 5AP', () => {
    voiceAvailable.value = false;
    const young = renderHome('1AP');
    expect(screen.getByText(/القراءة الصوتية غير متوفرة/)).toBeInTheDocument();
    young.unmount();
    renderHome('5AP');
    expect(screen.queryByText(/القراءة الصوتية غير متوفرة/)).not.toBeInTheDocument();
  });
});

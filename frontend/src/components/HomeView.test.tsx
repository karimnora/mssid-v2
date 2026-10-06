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

  it('shows Didou, courses and labs on 1AP — exams live in the assess tab', () => {
    renderHome('1AP');
    expect(document.querySelector('[data-home-layout="full"]')).toBeTruthy();
    expect(document.querySelector('[data-home-poles="kids"]')).toBeTruthy();
    expect(document.querySelector('[data-home-layout="young"]')).toBeNull();
    expect(screen.getByText(/مراجعة الدروس/)).toBeInTheDocument();
    expect(screen.getByText(/استكشف الرياضيات/)).toBeInTheDocument();
    expect(screen.getByText(/اللغة العربية/)).toBeInTheDocument();
    expect(screen.getAllByText(/الرياضيات/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/ساحة التحديات/)).not.toBeInTheDocument();
    expect(screen.queryByText(/بنك الامتحانات/)).not.toBeInTheDocument();
    expect(screen.getByText(/المختبرات والأدوات/)).toBeInTheDocument();
    expect(document.querySelector('[data-pole-icon="courses"]')).toBeTruthy();
    expect(document.querySelector('[data-pole="exams"]')).toBeNull();
    expect(document.querySelector('[data-pole="challenges"]')).toBeNull();
    expect(document.querySelector('[data-pole-icon="labs"]')).toBeTruthy();
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

  it('shows courses and labs on 2AP without exam cards', () => {
    renderHome('2AP');
    expect(document.querySelector('[data-home-layout="full"]')).toBeTruthy();
    expect(screen.queryByText(/ساحة التحديات/)).not.toBeInTheDocument();
    expect(screen.getByText(/المختبرات والأدوات/)).toBeInTheDocument();
  });

  it('keeps the home poles without exams on 5AP', () => {
    renderHome('5AP');
    expect(document.querySelector('[data-home-layout="full"]')).toBeTruthy();
    expect(screen.queryByText(/ساحة التحديات/)).not.toBeInTheDocument();
    expect(screen.queryByText(/بنك الامتحانات/)).not.toBeInTheDocument();
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

  it('names the XP bar as progress toward the next level, not school mastery', () => {
    renderHome('5AP', { xp: 99, level: 1 });
    expect(screen.getByText('نحو المستوى التالي: 99٪')).toBeInTheDocument();
  });

  it('wraps the bar at 100 XP without sounding like school progress dropped', () => {
    renderHome('5AP', { xp: 100, level: 2 });
    expect(screen.getByText('نحو المستوى التالي: 0٪')).toBeInTheDocument();
    expect(screen.getByText(/المستوى 2/)).toBeInTheDocument();
  });

  it('offers resume of the last activity without hiding subject cards', () => {
    const onResumeActivity = vi.fn();
    renderHome('5AP', { lastActivityTitle: 'الفضاء', onResumeActivity });
    fireEvent.click(screen.getByRole('button', { name: /متابعة: الفضاء/ }));
    expect(onResumeActivity).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/اللغة العربية/)).toBeInTheDocument();
    expect(screen.getByText(/مراجعة الدروس/)).toBeInTheDocument();
  });
});

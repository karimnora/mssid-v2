import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import { JourneyScreen, type JourneyScreenProps } from './JourneyScreen';
import { LocaleProvider } from '../../context/LocaleContext';
import { setStoredLocale } from '../../localePreference';
import { createFreshGuestProfile } from '../../hooks/useUserProgress';
import { journeyForGrade } from '../../data/journey/journeyWorlds';
import { buildStations } from '../../utils/journeyProgress';
import { FREE_JOURNEY_WORLDS } from '../../access/entitlements';
import { OBJECT_ART } from '../world/worldArt';
import type { CourseLesson } from '../../types';

let role: string | undefined;
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ authUser: role ? { id: 7, role } : null }) }));
vi.mock('../../utils/speech', () => ({ stopSpeech: vi.fn(), speakText: vi.fn().mockResolvedValue(undefined) }));
// Keep the actual village, map, entitlement checks and locked-game sheet. The lesson body is outside this test's scope.
vi.mock('../LessonViewer', () => ({ LessonViewer: ({ lesson }: { lesson: CourseLesson }) => <div data-opened-lesson={lesson.id} /> }));

const worlds = journeyForGrade('5AP')!;
const stations = buildStations(worlds);
const courses = [...new Set(worlds.flatMap(world => [...world.lessonIds]))].map(id => ({
  id, grade: '5AP', subject: 'math', titleAr: 'درس تجريبي', quiz: [],
})) as CourseLesson[];
const layoutMethods = ['getTotalLength', 'getPointAtLength', 'scrollTo'] as const;
let originalLayout: Array<PropertyDescriptor | undefined>;
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('mssid_journey_sound', 'off');
  setStoredLocale('ar');
  role = 'ROLE_FREE';
  vi.useFakeTimers();
  vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);
  // JSDOM has no SVG geometry or scrolling; only layout is substituted, never the access policy.
  originalLayout = layoutMethods.map(method => Object.getOwnPropertyDescriptor(method === 'scrollTo' ? HTMLElement.prototype : SVGElement.prototype, method));
  Object.defineProperty(SVGElement.prototype, 'getTotalLength', { configurable: true, value: () => 6 });
  Object.defineProperty(SVGElement.prototype, 'getPointAtLength', { configurable: true, value: () => ({ x: 0, y: 0 }) });
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: vi.fn() });
});
afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.restoreAllMocks();
  layoutMethods.forEach((method, index) => {
    const prototype = method === 'scrollTo' ? HTMLElement.prototype : SVGElement.prototype;
    if (originalLayout[index]) Object.defineProperty(prototype, method, originalLayout[index]!);
    else Reflect.deleteProperty(prototype, method);
  });
});

function mount() {
  const props: JourneyScreenProps = {
    grade: '5AP', courses, userProfile: createFreshGuestProfile('5AP'),
    onExit: vi.fn(), onOpenCourses: vi.fn(), onOpenStories: vi.fn(), onOpenMath: vi.fn(),
    onOpenLabs: vi.fn(), onOpenGames: vi.fn(), onOpenExams: vi.fn(), onOpenParents: vi.fn(),
    isLessonLocked: vi.fn(() => false), onLessonLocked: vi.fn(), onCompleteQuiz: vi.fn(),
    onQuizFullyValidated: vi.fn(), onQuizMiss: vi.fn(), onPracticeResult: vi.fn(),
  };
  const view = render(<JourneyScreen {...props} />, { wrapper: LocaleProvider });
  return { ...view, props };
}
function openMap() {
  fireEvent.click(document.querySelector('[data-home-lessons]')!);
  fireEvent.click(document.querySelector('[data-home-map]')!);
}
function expectNoPrice() {
  expect(document.body.textContent).not.toMatch(/\d\s*(?:DA|DZD)\b|دج|BaridiMob|CCP|payer|acheter|الدفع|شراء/i);
}

it.each(['ROLE_FREE', undefined])('shows the real connected village and free destinations for %s', (sessionRole) => {
  role = sessionRole;
  const { props } = mount();
  expect(document.querySelector('[data-home-connected="true"]')).toBeInTheDocument();
  expect(document.querySelector('[data-home-grade="5AP"]')).toBeInTheDocument();
  for (const place of ['stories', 'workshop', 'games']) {
    fireEvent.click(document.querySelector(`[data-home-place="${place}"]`)!);
    fireEvent.click(document.querySelector('[data-home-enter]')!);
  }
  expect(props.onOpenStories).toHaveBeenCalledOnce();
  expect(props.onOpenLabs).toHaveBeenCalledOnce();
  expect(props.onOpenGames).toHaveBeenCalledOnce();
  expectNoPrice();
});

it('keeps the first two worlds free and later worlds and games behind golden locks', () => {
  const { props } = mount();
  openMap();
  stations.forEach((station, index) => {
    const node = document.querySelector(`[data-station="${index}"]`)!;
    if (station.worldIndex < FREE_JOURNEY_WORLDS) expect(node).not.toHaveAttribute('data-state', 'premium');
    else expect(node).toHaveAttribute('data-state', 'premium');
  });
  const lockedGames = document.querySelectorAll('[data-game-station][data-open="false"]');
  expect(lockedGames.length).toBeGreaterThan(0);
  for (const game of lockedGames) {
    expect(game.querySelector('[data-game-premium-lock]')).toHaveAttribute('href', OBJECT_ART.lock);
    expect(game.querySelector('[data-game-premium-lock]')).toHaveClass('j-premium-lock');
  }
  expect(document.querySelector('[data-game-station][data-open="true"] [data-game-premium-lock]')).toBeNull();
  const premium = document.querySelector('[data-station][data-state="premium"]')!;
  expect(premium.querySelector('image')).toHaveAttribute('href', OBJECT_ART.lock);
  expect(premium.querySelector('image')).toHaveClass('j-premium-lock');
  expect(document.querySelector('[data-station][data-state="locked"] .j-premium-lock')).toBeNull();
  fireEvent.keyDown(premium, { key: 'Enter' });
  expect(document.querySelector('[data-premium-offer-entry]')).toBeInTheDocument();
  expect(document.querySelector('[data-opened-lesson]')).toBeNull();
  expect(props.onCompleteQuiz).not.toHaveBeenCalled();
  expectNoPrice();
});

it('opens the free game and keeps a Premium game locked without granting levels', () => {
  mount();
  openMap();
  fireEvent.keyDown(document.querySelector('[data-game-station][data-open="false"]')!, { key: 'Enter' });
  expect(document.querySelector('.gs-locked-note')).toBeInTheDocument();
  expect(document.querySelector('[data-gs-level]')).toBeNull();
  expectNoPrice();
  fireEvent.click(document.querySelector('[data-gs-free]')!);
  expect(document.querySelector('.gs-locked-note')).toBeNull();
  expect(document.querySelectorAll('[data-gs-level]').length).toBeGreaterThan(0);
  expectNoPrice();
});

it.each(['ROLE_PREMIUM', 'ROLE_ADMIN'])('keeps Premium worlds and games available for %s', (sessionRole) => {
  role = sessionRole;
  mount();
  openMap();
  expect(document.querySelector('[data-station][data-state="premium"]')).toBeNull();
  expect(document.querySelector('[data-game-station][data-open="false"]')).toBeNull();
  expect(document.querySelector('[data-game-premium-lock]')).toBeNull();
  expectNoPrice();
});

it('opens the first free lesson from the village map with no Premium grant', async () => {
  mount();
  openMap();
  await act(async () => { fireEvent.keyDown(document.querySelector('[data-station="0"][data-state="open"]')!, { key: 'Enter' }); });
  fireEvent.click(screen.getByRole('button', { name: 'نعم' }));
  fireEvent.click(screen.getByRole('button', { name: 'هيّا!' }));
  expect(document.querySelector('[data-opened-lesson]')).toHaveAttribute('data-opened-lesson', stations[0].lessonId);
  expectNoPrice();
});

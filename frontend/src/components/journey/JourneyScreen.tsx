import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PracticeResult } from '../../utils/competenceProgress';
import { journeyForGrade } from '../../data/journey/journeyWorlds';
import { useLocaleContext } from '../../context/LocaleContext';
import type { CourseLesson, PrimaryGrade, UserProfile } from '../../types';
import { speakText, stopSpeech } from '../../utils/speech';
import {
  buildStations,
  loadJourneyMemory,
  saveJourneyMemory,
  starsForLesson,
  stationStates,
} from '../../utils/journeyProgress';
import { LessonViewer } from '../LessonViewer';
import { JourneyMap, type JourneyMemoryState } from './JourneyMap';
import { createJourneySfx } from './JourneyRibbon';
import { PlanetHub } from './PlanetHub';
import { useAuth } from '../../context/AuthContext';
import { canAccess, FREE_JOURNEY_WORLDS } from '../../access/entitlements';
import { PremiumOffer } from '../PremiumOffer';
import type { PlanetShelfGroup } from './PlanetShelf';
import './journey.css';

export interface JourneyScreenProps {
  grade: PrimaryGrade;
  /** Published catalog (already filtered by curriculumReviewGate); null while it loads. */
  courses: CourseLesson[] | null;
  /** Open straight on the map (free home shortcut): « back » then returns to the app. */
  startOn?: 'hub' | 'map';
  userProfile: UserProfile;
  onExit: () => void;
  /** Premium planet home: the classic home's entries, shown on the planet as « كل الأنشطة ». */
  shelfGroups?: PlanetShelfGroup[];
  exitLabel?: string;
  onOpenCourses: () => void;
  onOpenLabs: () => void;
  onOpenParents: () => void;
  isLessonLocked: (lesson: CourseLesson) => boolean;
  onLessonLocked: (lesson: CourseLesson) => void;
  onCompleteQuiz: (lessonId: string, earnedXp: number) => void;
  onQuizFullyValidated: (lessonId: string) => void;
  onQuizMiss: (lessonId: string, competenceId?: string) => void;
  onPracticeResult?: (lessonId: string, result: PracticeResult) => void;
  onReportError?: (contextLabel: string) => void;
}

const SOUND_KEY = 'mssid_journey_sound';

const BACKGROUND_STARS = (() => {
  let s = 11;
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  return Array.from({ length: 140 }, () => ({ x: rnd() * 100, y: rnd() * 100, r: rnd() < 0.08 ? 0.28 : 0.08 + rnd() * 0.14, o: 0.35 + rnd() * 0.6 }));
})();

/**
 * « Kawkab Didou »: the V2 game-world entry. Planet hub → journey map → real catalog lesson
 * (LessonViewer with the app's own progress callbacks, so the quiz rules, XP and parent notebook
 * behave exactly as in the courses section).
 */
export function JourneyScreen(props: JourneyScreenProps) {
  const { grade, courses, userProfile, onExit, onOpenCourses, onOpenLabs, onOpenParents, isLessonLocked, onLessonLocked, onCompleteQuiz, onQuizFullyValidated, onQuizMiss, onPracticeResult, onReportError, startOn = 'hub', shelfGroups, exitLabel } = props;
  const { locale } = useLocaleContext();
  const { authUser } = useAuth();
  const allWorlds = canAccess('journeyAllWorlds', authUser?.role);
  const worlds = journeyForGrade(grade);
  const [screen, setScreen] = useState<'hub' | 'map' | 'lesson'>(startOn);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [memory, setMemory] = useState<JourneyMemoryState>(() => loadJourneyMemory(grade));
  const [sound, setSound] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(SOUND_KEY) !== 'off';
    } catch {
      return true;
    }
  });
  const soundRef = useRef(sound);
  soundRef.current = sound;
  const sfx = useMemo(() => createJourneySfx(() => soundRef.current), []);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    setMemory(loadJourneyMemory(grade));
  }, [grade]);

  useEffect(() => {
    let timer: number;
    const loop = () => {
      timer = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 220);
        loop();
      }, 2600 + Math.random() * 2600);
    };
    loop();
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => () => stopSpeech(), []);

  const say = useCallback(
    (text: string) => {
      if (!soundRef.current) return;
      void speakText(text, locale === 'ar' ? 'ar-SA' : 'fr-FR').catch(() => {});
    },
    [locale],
  );

  const changeMemory = useCallback(
    (next: JourneyMemoryState) => {
      setMemory(next);
      saveJourneyMemory(grade, next);
    },
    [grade],
  );

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    try {
      window.localStorage.setItem(SOUND_KEY, next ? 'on' : 'off');
    } catch {
      /* ignore */
    }
    if (!next) stopSpeech();
  };

  const stations = useMemo(() => (worlds ? buildStations(worlds) : []), [worlds]);
  const lessonsById = useMemo(() => new Map((courses ?? []).map((l) => [l.id, l])), [courses]);
  const states = useMemo(() => {
    if (!worlds) return [];
    return stationStates(
      stations,
      worlds,
      new Set(userProfile.quizFullyValidatedLessonIds),
      new Set(memory.claimed),
      new Set(lessonsById.keys()),
      allWorlds ? null : FREE_JOURNEY_WORLDS,
    );
  }, [worlds, stations, userProfile.quizFullyValidatedLessonIds, memory.claimed, lessonsById, allWorlds]);
  const stars = useMemo(
    () => stations.map((s, i) => (states[i] !== 'done' ? 0 : s.kind === 'treasure' ? 3 : starsForLesson(userProfile.lessonSessions, s.lessonId!))),
    [stations, states, userProfile.lessonSessions],
  );
  const totalStars = stars.reduce((a, b) => a + b, 0);
  const lessonTitles = useMemo(() => {
    const titles: Record<string, string> = {};
    stations.forEach((s) => {
      if (s.lessonId) titles[s.lessonId] = lessonsById.get(s.lessonId)?.titleAr ?? '';
    });
    return titles;
  }, [stations, lessonsById]);

  const startLesson = (stationIndex: number) => {
    const id = stations[stationIndex].lessonId;
    const lesson = id ? lessonsById.get(id) : undefined;
    if (!lesson) return;
    if (isLessonLocked(lesson)) {
      onLessonLocked(lesson);
      return;
    }
    stopSpeech();
    setLessonId(lesson.id);
    setScreen('lesson');
  };

  const claimTreasure = (worldIndex: number) => {
    if (!worlds) return;
    const id = worlds[worldIndex].id;
    if (memory.claimed.includes(id)) return;
    changeMemory({ ...memory, claimed: [...memory.claimed, id] });
  };

  const lesson = lessonId ? lessonsById.get(lessonId) : undefined;
  const userName = userProfile.name || (locale === 'ar' ? 'بطل' : 'Champion');

  return (
    <div className="journey-root" data-blink={blink} dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
      {screen !== 'lesson' && (
        <svg className="journey-stars" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {BACKGROUND_STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
          ))}
        </svg>
      )}

      {screen === 'hub' && (
        <PlanetHub
          locale={locale}
          userName={userName}
          totalStars={totalStars}
          coins={userProfile.goldCoins ?? 0}
          worlds={worlds}
          claimedWorldIds={memory.claimed}
          sound={sound}
          onToggleSound={toggleSound}
          onOpenMap={() => setScreen('map')}
          onOpenCourses={onOpenCourses}
          onOpenLabs={onOpenLabs}
          onOpenParents={onOpenParents}
          onExit={onExit}
          say={say}
          sfx={sfx}
          shelfGroups={shelfGroups}
          exitLabel={exitLabel}
        />
      )}

      {screen === 'map' && worlds && (
        courses ? (
          <JourneyMap
            grade={grade}
            worlds={worlds}
            stations={stations}
            states={states}
            stars={stars}
            lessonTitles={lessonTitles}
            locale={locale}
            memory={memory}
            onMemoryChange={changeMemory}
            onStartLesson={startLesson}
            onClaimTreasure={claimTreasure}
            onBack={() => (startOn === 'map' ? onExit() : setScreen('hub'))}
            say={say}
            sfx={sfx}
            totalStars={totalStars}
            coins={userProfile.goldCoins ?? 0}
            premiumExtra={<PremiumOffer />}
          />
        ) : (
          <div className="journey-loading" role="status">{locale === 'ar' ? 'ديدو يحضّر الخريطة…' : 'Didou prépare la carte…'}</div>
        )
      )}

      {screen === 'lesson' && lesson && (
        <div className="journey-lesson">
          <div className="journey-lesson-inner">
            <LessonViewer
              lesson={lesson}
              onBack={() => setScreen('map')}
              onHomeClick={() => setScreen('map')}
              onCompleteQuiz={onCompleteQuiz}
              quizAlreadyValidated={userProfile.quizFullyValidatedLessonIds.includes(lesson.id)}
              onQuizFullyValidated={onQuizFullyValidated}
              onQuizMiss={onQuizMiss}
              onPracticeResult={onPracticeResult}
              grade={grade}
              subjectId={lesson.subject}
              tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
              onReportError={onReportError}
            />
          </div>
        </div>
      )}
    </div>
  );
}

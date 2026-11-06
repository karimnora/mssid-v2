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
import { JourneyMap, type JourneyGameStation, type JourneyMemoryState } from './JourneyMap';
import { GameStationSheet } from './GameStationSheet';
import { canOpenPack, gameStationsForJourney, type GamePack } from '../../data/games';
import { readPackLevels } from '../games/learning/LearningGameEntry';
import { createJourneySfx } from './JourneyRibbon';
import { PlanetHub } from './PlanetHub';
import { VILLAGE_MATH_PILOT, villageLessonConfig } from '../lessonViewer/villageLessonConfig';
import { pilotVoiceFor } from '../lessonViewer/villagePilotVoices';
import { connectedHomeProgress } from '../home/connectedHomeProgress';
import { DidouVillageHome } from '../home/DidouVillageHome';
import { useAuth } from '../../context/AuthContext';
import { canAccess, FREE_JOURNEY_WORLDS } from '../../access/entitlements';
import { PremiumOffer } from '../PremiumOffer';
import type { PlanetShelfGroup } from './PlanetShelf';
import { JourneyLessonStage } from './JourneyLessonStage';
import { SPACE_ART, WORLD_DECOR } from '../world/worldArt';
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
  /** « مهمة اليوم » and the J-15 plan button, shown under Didou's bubble on the planet. */
  mission?: { voiceParts?: string[]; say: string; cta: string | null; onStart: () => void } | null;
  examPlanCta?: { label: string; daysLeft: number; onOpen: () => void } | null;
  onOpenCourses: () => void;
  onOpenStories: () => void;
  onOpenMath: () => void;
  onOpenLabs: () => void;
  onOpenGames: () => void;
  onOpenExams: () => void;
  onOpenParents: () => void;
  isLessonLocked: (lesson: CourseLesson) => boolean;
  onLessonLocked: (lesson: CourseLesson) => void;
  onCompleteQuiz: (lessonId: string, earnedXp: number) => void;
  onQuizFullyValidated: (lessonId: string) => void;
  onQuizMiss: (lessonId: string, competenceId?: string) => void;
  onPracticeResult?: (lessonId: string, result: PracticeResult) => void;
  onReportError?: (contextLabel: string) => void;
  /** XP of a learning game, given once when all its levels are solved (same rule as the Challenges shelf). */
  onGameXp?: (packId: string, xp: number) => void;
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
  const { grade, courses, userProfile, onExit, onOpenCourses, onOpenStories, onOpenMath, onOpenLabs, onOpenGames, onOpenExams, onOpenParents, isLessonLocked, onLessonLocked, onCompleteQuiz, onQuizFullyValidated, onQuizMiss, onPracticeResult, onReportError, onGameXp, startOn = 'hub', shelfGroups, exitLabel, mission, examPlanCta } = props;
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

  useEffect(() => {
    setMemory(loadJourneyMemory(grade));
  }, [grade]);

  useEffect(() => () => stopSpeech(), []);

  const say = useCallback(
    (text: string) => {
      if (!soundRef.current) return;
      void speakText(text, locale === 'ar' ? 'ar-SA' : 'fr-FR', .9, 1, {preferredRecording:locale === 'ar' ? pilotVoiceFor(text) : undefined}).catch(() => {});
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

  // Bonus game stops: one learning-game pack each, the free one in the first world.
  const premiumGames = canAccess('learningGames', authUser?.role);
  const gamePlacements = useMemo(() => (worlds ? gameStationsForJourney(grade, worlds.map((w) => w.lessonIds)) : []), [worlds, grade]);
  const [openGame, setOpenGame] = useState<number | null>(null);
  const [gameTick, setGameTick] = useState(0);
  const gameStations = useMemo<JourneyGameStation[]>(
    () =>
      gamePlacements.map(({ pack, worldIndex }) => {
        const levels = readPackLevels(pack.id);
        return {
          worldIndex,
          emoji: pack.theme.emoji,
          title: pack.titleAr,
          open: canOpenPack(pack, premiumGames),
          free: Boolean(pack.free),
          stars: pack.rounds.reduce((sum, r) => sum + (levels[r.id] ?? 0), 0),
          maxStars: pack.rounds.length * 3,
        };
      }),
    // gameTick: re-read the stars kept on the device after a game sheet closes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gamePlacements, premiumGames, gameTick],
  );
  const freeGame = gamePlacements.findIndex((g) => g.pack.free);
  const openedGame: GamePack | undefined = openGame != null ? gamePlacements[openGame]?.pack : undefined;
  const allTitles = useMemo(() => {
    const titles: Record<string, string> = {};
    lessonsById.forEach((l, id) => {
      titles[id] = l.titleAr;
    });
    return titles;
  }, [lessonsById]);
  const closeGame = () => {
    stopSpeech();
    setOpenGame(null);
    setGameTick((t) => t + 1);
  };

  const lesson = lessonId ? lessonsById.get(lessonId) : undefined;
  const lessonWorld = lesson && worlds ? worlds.find((w) => w.lessonIds.includes(lesson.id)) : undefined;
  const userName = userProfile.name || (locale === 'ar' ? 'بطل' : 'Champion');

  return (
    <div className="journey-root" dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
      {screen === 'hub' && (
        <div
          className="journey-space"
          aria-hidden="true"
          style={{ ['--space-l' as string]: `url(${SPACE_ART.landscape})`, ['--space-p' as string]: `url(${SPACE_ART.portrait})` }}
        />
      )}
      {screen !== 'lesson' && (
        <svg className="journey-stars" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {BACKGROUND_STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
          ))}
        </svg>
      )}

      {screen === 'hub' && locale === 'ar' && (
        <DidouVillageHome connection={{
          grade, name: userName, sound, onToggleSound: toggleSound, onStopSpeech: stopSpeech,
          ...connectedHomeProgress(grade, courses, userProfile.quizFullyValidatedLessonIds),
          onExit, onOpenCourses, onOpenStories, onOpenMath, onOpenLabs, onOpenGames, onOpenExams,
          onOpenPilot: grade === "5AP" && lessonsById.has(VILLAGE_MATH_PILOT) ? () => {const pilot=lessonsById.get(VILLAGE_MATH_PILOT)!;if(isLessonLocked(pilot)){onLessonLocked(pilot);return;}stopSpeech();setLessonId(pilot.id);setScreen("lesson");} : undefined,
          onOpenMap: worlds ? () => setScreen('map') : null,
          onContinue: courses && worlds && states.includes('open') ? () => {
            const index = states.indexOf('open');
            if (stations[index]?.kind === 'lesson') startLesson(index);
            else setScreen('map');
          } : null,
          nextTitle: courses && worlds ? lessonTitles[stations[states.indexOf('open')]?.lessonId ?? ''] || null : null,
          shelfGroups: shelfGroups ?? [], mission, examPlanCta,
        }}/>
      )}
      {screen === 'hub' && locale !== 'ar' && (
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
          mission={mission}
          examPlanCta={examPlanCta}
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
            gameStations={gameStations}
            onOpenGame={setOpenGame}
          />
        ) : (
          <div className="journey-loading" role="status">{locale === 'ar' ? 'ديدو يحضّر الخريطة…' : 'Didou prépare la carte…'}</div>
        )
      )}

      {screen === 'map' && openedGame && (
        <GameStationSheet
          key={openedGame.id}
          pack={openedGame}
          open={canOpenPack(openedGame, premiumGames)}
          lessonTitles={allTitles}
          onClose={closeGame}
          onPlayFree={freeGame >= 0 && freeGame !== openGame ? () => setOpenGame(freeGame) : undefined}
          freeTitle={freeGame >= 0 ? gamePlacements[freeGame].pack.titleAr : undefined}
          onPracticeResult={onPracticeResult}
          onEarnXp={(pack, xp) => onGameXp?.(pack.id, xp)}
          say={locale === 'ar' ? say : undefined}
        />
      )}

      {screen === 'lesson' && lesson && (() => {
        const viewer = (
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
        );
        // A journey lesson opens in its world's painted decor; the cream page stays for a lesson found outside the map.
        return locale === 'ar' && villageLessonConfig(lesson) ? viewer : lessonWorld ? (
          <JourneyLessonStage key={lesson.id} worldId={lessonWorld.id} decor={WORLD_DECOR[lessonWorld.id]} locale={locale} lessonTitle={lesson.titleAr} say={say}>
            {viewer}
          </JourneyLessonStage>
        ) : (
          <div className="journey-lesson">
            <div className="journey-lesson-inner">{viewer}</div>
          </div>
        );
      })()}
    </div>
  );
}

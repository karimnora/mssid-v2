import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { PrimaryGrade, SubjectId, CourseLesson, UserProfile, Badge as BadgeInfo, SubjectInfo } from './types';
import { AuthService } from './services/authService';
import { useAuth } from './context/AuthContext';
import { useLocaleContext } from './context/LocaleContext';
import { SUBJECTS_LIST, COURSE_SUBJECTS_LIST, INTERACTIVE_LABS_LIST, OFFICIAL_EXAMS_LIST, CHALLENGES_TAB_LIST, SPECIAL_TOOLS_AND_EXAMS_LIST, isToolAvailableForGrade, isSubjectFeatureEnabled } from './data/subjectsData';
import { COURSES_DATA } from './data/coursesData';
import { CourseSelectionView } from './components/CourseSelectionView';
import { LessonViewer } from './components/LessonViewer';
import { ExamsViewer } from './components/ExamsViewer';
import { ChallengesArena } from './components/ChallengesArena';
import { ToolsHubView } from './components/ToolsHubView';
import { GlobalBackButton, BackNavigationState } from './components/GlobalBackButton';
import { incrementDailyObjective } from './utils/dailyObjective';
import { applyBadgeEvaluation } from './utils/badgeEngine';
import { BadgeUnlockToast } from './components/BadgeUnlockToast';
import { AiTutorModal } from './components/AiTutorModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';
import { AuthWallModal } from './components/AuthWallModal';
import { EmailVerificationPopup } from './components/EmailVerificationPopup';
import { HomeView, HomePoleId } from './components/HomeView';
import { MobileAppSimulator } from './components/MobileAppSimulator';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsOfServiceModal } from './components/TermsOfServiceModal';
import { Navbar, HeaderTheme } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { SeoHead } from './components/SeoHead';
import { SubscriptionPaywall } from './components/SubscriptionPaywall';
import { LoadingFallback } from './components/LoadingFallback';
import { AppRatingPrompt } from './components/AppRatingPrompt';
import { ContactModal } from './components/ContactModal';
import { useFeatureFlag } from './hooks/useFeatureFlag';
import { springBootApi } from './services/springBootApi';

// R2.1 — code splitting: heavy interactive tools, the CMS back-office and the Mode Éveil
// sub-app are all opt-in surfaces most students never open in a given session, so they're loaded
// on demand instead of inflating the initial bundle. All are named exports, hence the `.then()`
// remap to the { default } shape React.lazy expects.
const SorobanInteractive = lazy(() => import('./components/SorobanInteractive').then((m) => ({ default: m.SorobanInteractive })));
const ElectricityLabInteractive = lazy(() => import('./components/ElectricityLabInteractive').then((m) => ({ default: m.ElectricityLabInteractive })));
const UnitConverter = lazy(() => import('./components/UnitConverter').then((m) => ({ default: m.UnitConverter })));
const GeometryVisualizer = lazy(() => import('./components/GeometryVisualizer').then((m) => ({ default: m.GeometryVisualizer })));
const EducationalCalculator = lazy(() => import('./components/EducationalCalculator').then((m) => ({ default: m.EducationalCalculator })));
const ArabicConjugator = lazy(() => import('./components/ArabicConjugator').then((m) => ({ default: m.ArabicConjugator })));
const FrenchLanguageLab = lazy(() => import('./components/FrenchLanguageLab').then((m) => ({ default: m.FrenchLanguageLab })));
const EnglishLanguageLab = lazy(() => import('./components/EnglishLanguageLab').then((m) => ({ default: m.EnglishLanguageLab })));
const MultiplicationTableInteractive = lazy(() => import('./components/MultiplicationTableInteractive').then((m) => ({ default: m.MultiplicationTableInteractive })));
const AlgerianCurrencyMarket = lazy(() => import('./components/AlgerianCurrencyMarket').then((m) => ({ default: m.AlgerianCurrencyMarket })));
const WilayasExplorer = lazy(() => import('./components/WilayasExplorer').then((m) => ({ default: m.WilayasExplorer })));
const AlgerianHistoryMuseum = lazy(() => import('./components/AlgerianHistoryMuseum').then((m) => ({ default: m.AlgerianHistoryMuseum })));
const ScienceExperimentLab = lazy(() => import('./components/ScienceExperimentLab').then((m) => ({ default: m.ScienceExperimentLab })));
const TamazightLabInteractive = lazy(() => import('./components/TamazightLabInteractive').then((m) => ({ default: m.TamazightLabInteractive })));
const TamazightCurriculumViewer = lazy(() => import('./components/TamazightCurriculumViewer').then((m) => ({ default: m.TamazightCurriculumViewer })));
const TouchWritingStudio = lazy(() => import('./components/TouchWritingStudio').then((m) => ({ default: m.TouchWritingStudio })));
const PrimaryMathLabInteractive = lazy(() => import('./components/PrimaryMathLabInteractive').then((m) => ({ default: m.PrimaryMathLabInteractive })));
const PrimaryDiscoveryLabInteractive = lazy(() => import('./components/PrimaryDiscoveryLabInteractive').then((m) => ({ default: m.PrimaryDiscoveryLabInteractive })));
const FrenchProjectsLabInteractive = lazy(() => import('./components/FrenchProjectsLabInteractive').then((m) => ({ default: m.FrenchProjectsLabInteractive })));
const EnglishAudioDialoguesLab = lazy(() => import('./components/EnglishAudioDialoguesLab').then((m) => ({ default: m.EnglishAudioDialoguesLab })));
const HumanAnatomyLab = lazy(() => import('./components/HumanAnatomyLab').then((m) => ({ default: m.HumanAnatomyLab })));
const EarthCyclesLab = lazy(() => import('./components/EarthCyclesLab').then((m) => ({ default: m.EarthCyclesLab })));
const FractionsDecimalsLab = lazy(() => import('./components/FractionsDecimalsLab').then((m) => ({ default: m.FractionsDecimalsLab })));
const AreaPerimeterGridLab = lazy(() => import('./components/AreaPerimeterGridLab').then((m) => ({ default: m.AreaPerimeterGridLab })));
const ClockTrainerLab = lazy(() => import('./components/ClockTrainerLab').then((m) => ({ default: m.ClockTrainerLab })));
const SyllableStudioLab = lazy(() => import('./components/SyllableStudioLab').then((m) => ({ default: m.SyllableStudioLab })));
const SpeedReadingLab = lazy(() => import('./components/SpeedReadingLab').then((m) => ({ default: m.SpeedReadingLab })));
const TopographyMapLab = lazy(() => import('./components/TopographyMapLab').then((m) => ({ default: m.TopographyMapLab })));
const DidouDressingRoomModal = lazy(() => import('./components/DidouDressingRoomModal').then((m) => ({ default: m.DidouDressingRoomModal })));
const HomeworkPinModal = lazy(() => import('./components/HomeworkPinModal').then((m) => ({ default: m.HomeworkPinModal })));
const PrintableWorksheetsGeneratorModal = lazy(() => import('./components/PrintableWorksheetsGeneratorModal').then((m) => ({ default: m.PrintableWorksheetsGeneratorModal })));
const OfflinePacksManagerModal = lazy(() => import('./components/OfflinePacksManagerModal').then((m) => ({ default: m.OfflinePacksManagerModal })));
const PreschoolApp = lazy(() => import('./components/preschool/PreschoolApp').then((m) => ({ default: m.PreschoolApp })));
const AdminConsoleView = lazy(() => import('./components/admin/AdminConsoleView').then((m) => ({ default: m.AdminConsoleView })));
import { useGuestLimits, MAX_GUEST_LESSONS } from './hooks/useGuestLimits';
import { isLessonLocked as isLessonLockedCheck } from './utils/trimesterAccess';
import { Card, Badge, XPProgressBar } from './components/ui';
import {
  BookOpen,
  Calculator,
  Grid,
  Award,
  FlaskConical,
  Compass,
  Heart,
  Languages,
  Sparkles,
  Globe,
  Zap,
  Trophy,
  Store,
  MapPin,
  Shield,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Calculator,
  BookOpen,
  Grid,
  Award,
  FlaskConical,
  Zap,
  Compass,
  Heart,
  Languages,
  Sparkles,
  Globe,
  Trophy,
  Store,
  MapPin,
  Shield,
};

const THEME_STORAGE_KEY = 'mssid_theme';
const VALID_GRADES: PrimaryGrade[] = ['1AP', '2AP', '3AP', '4AP', '5AP'];

/** Back-fills fields added after a profile was first saved to localStorage, and updates the daily streak. */
function normalizeUserProfile(raw: UserProfile): UserProfile {
  const profile: UserProfile = {
    ...raw,
    completedExamIds: raw.completedExamIds || [],
    completedChallengeIds: raw.completedChallengeIds || [],
    quizFullyValidatedLessonIds: raw.quizFullyValidatedLessonIds || [],
    badgeUnlockedAt: raw.badgeUnlockedAt || {},
  };

  const today = new Date().toISOString().slice(0, 10);
  const lastActive = profile.lastActiveDate ? profile.lastActiveDate.slice(0, 10) : null;
  if (lastActive === today) return profile;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  return {
    ...profile,
    streakDays: lastActive === yesterday ? profile.streakDays + 1 : 1,
    lastActiveDate: today,
  };
}

/**
 * A genuine "clean slate" profile — every progress field zeroed, not just a subset. Used on logout
 * so the next guest/user never sees the previous account's XP/lessons/badges/streak/quiz history.
 * Keeps the grade the app was already browsing (not the account's), since that's app-level context
 * rather than personal progress.
 */
function createFreshGuestProfile(currentGrade: PrimaryGrade): UserProfile {
  return {
    name: 'تلميذ مَسِيد',
    grade: currentGrade,
    avatar: '🎓',
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    completedLessonIds: [],
    completedExamIds: [],
    completedChallengeIds: [],
    quizFullyValidatedLessonIds: [],
    badges: [],
    badgeUnlockedAt: {},
    quizScores: {},
    tashkeelEnabled: false,
  };
}

export default function App() {
  const [grade, setGrade] = useState<PrimaryGrade>('5AP');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('math');
  const [selectedTrimester, setSelectedTrimester] = useState<number | 'all'>('all');
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [mainCategory, setMainCategory] = useState<'courses' | 'labs' | 'exams' | 'challenges'>('courses');
  const [mobileTab, setMobileTab] = useState<'home' | 'courses' | 'exercises' | 'games'>('home');

  // Phase 2: landing dashboard shown before a pole is picked (see HomeView.tsx).
  const [isHomeActive, setIsHomeActive] = useState(true);

  // Mode Découverte: guest lesson-view counter (localStorage, no PII) + the "Bravo champion" wall
  // shown once a non-authenticated visitor tries to open a 4th distinct lesson.
  const guestLimits = useGuestLimits();
  const [isAuthWallOpen, setIsAuthWallOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('login');

  // SEC-05: identity comes from AuthContext (hydrated from the cookie-authenticated
  // GET /api/v1/users/me on boot — see main.tsx's <AuthProvider>), never from localStorage.
  const { authUser } = useAuth();
  const { direction } = useLocaleContext();

  // Account-level grade persistence: an authenticated user's saved grade (picked at registration,
  // or changed later — see Navbar's onGradeChange below) becomes the default on every login/reload
  // instead of silently resetting to '5AP'. Guests keep today's behavior (local-only, resets on
  // reload) since there is no account to persist to.
  useEffect(() => {
    if (authUser?.grade && VALID_GRADES.includes(authUser.grade as PrimaryGrade)) {
      setGrade(authUser.grade as PrimaryGrade);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.grade]);

  const enablePreschoolModule = useFeatureFlag('enablePreschoolModule');
  const enableExamSection = useFeatureFlag('enableExamSection');

  // Subject/tool catalog entries tagged with a `featureFlag` (see subjectsData.ts) are hidden from
  // every picker (course subjects, tools hub) when their flag is off — subscribing to each flag here
  // is what makes App.tsx re-render and recompute visibleCourseSubjects/availableLabsForGrade below
  // the instant an admin toggles one, with no reload needed.
  const tamazightFlag = useFeatureFlag('tamazight');
  const educationalCalculatorFlag = useFeatureFlag('educationalCalculator');
  const writingLabFlag = useFeatureFlag('writingLab');
  const advancedLabsFlag = useFeatureFlag('advancedLabs');
  const isSubjectVisible = (s: SubjectInfo): boolean =>
    isSubjectFeatureEnabled(s, {
      tamazight: tamazightFlag,
      educationalCalculator: educationalCalculatorFlag,
      writingLab: writingLabFlag,
      advancedLabs: advancedLabsFlag,
    });
  const visibleCourseSubjects = COURSE_SUBJECTS_LIST.filter((s) => isToolAvailableForGrade(s, grade) && isSubjectVisible(s));

  // SEC-07 / Trimester paywall: Trimester 1 is always free, everywhere, regardless of this flag —
  // only T2/T3 are ever gated, and only once enableTrimesterPaywall is switched on (off by default
  // during the pre-launch content review phase, see featureFlags.ts).
  const enableTrimesterPaywall = useFeatureFlag('enableTrimesterPaywall');
  const enablePaymentsFlag = useFeatureFlag('enablePayments');
  const isLessonLocked = (lesson: CourseLesson): boolean =>
    isLessonLockedCheck(lesson, {
      enablePayments: enablePaymentsFlag,
      enableTrimesterPaywall,
      userRole: authUser?.role,
    });
  const [lockedLesson, setLockedLesson] = useState<CourseLesson | null>(null);

  const handleSelectSubject = (subject: SubjectId) => {
    setSelectedSubject(subject);
    setSelectedLesson(null);
    if (INTERACTIVE_LABS_LIST.some((s) => s.id === subject)) {
      setMainCategory('labs');
      setMobileTab('games');
    } else if (OFFICIAL_EXAMS_LIST.some((s) => s.id === subject)) {
      setMainCategory('exams');
      setMobileTab('exercises');
    } else if (CHALLENGES_TAB_LIST.some((s) => s.id === subject)) {
      setMainCategory('challenges');
      setMobileTab('exercises');
    } else {
      setMainCategory('courses');
      setMobileTab('courses');
    }
  };

  const handleMobileTab = (tab: 'home' | 'courses' | 'exercises' | 'games') => {
    setMobileTab(tab);
    setSelectedLesson(null);
    if (tab === 'home') {
      setIsHomeActive(true);
      return;
    }
    setIsHomeActive(false);
    if (tab === 'courses') {
      setMainCategory('courses');
      setSelectedSubject('math');
    } else if (tab === 'exercises') {
      setMainCategory('exams');
      setSelectedSubject('exams');
    } else if (tab === 'games') {
      setMainCategory('labs');
      setSelectedSubject('arabic_conjugator');
    }
  };

  // A HomeView pole click mirrors the MAIN_CATEGORY_TABS click logic further below, just also
  // dismissing the dashboard.
  const handleSelectPole = (pole: HomePoleId) => {
    setMainCategory(pole);
    setIsHomeActive(false);
    setSelectedLesson(null);
    if (pole === 'courses' && !COURSE_SUBJECTS_LIST.some((s) => s.id === selectedSubject)) {
      setSelectedSubject('math');
    } else if (pole === 'labs' && !INTERACTIVE_LABS_LIST.some((s) => s.id === selectedSubject)) {
      setSelectedSubject('arabic_conjugator');
    } else if (pole === 'exams') {
      setSelectedSubject('exams');
    } else if (pole === 'challenges') {
      setSelectedSubject('challenges');
    }
  };

  // Unlimited discovery access for Trimester 1: guests and free accounts can browse and open every
  // T1 lesson without lock-outs. T2/T3 go through isLessonLocked first (see enableTrimesterPaywall)
  // — this single choke point also covers LessonViewer's prev/next navigation, which is wired to
  // this same handler via its onSelectLesson prop.
  const handleSelectLesson = (lesson: CourseLesson) => {
    if (isLessonLocked(lesson)) {
      setLockedLesson(lesson);
      return;
    }
    if (!authUser) {
      guestLimits.recordLessonView(lesson.id);
    }
    // CourseSelectionView manages its own internal subject/trimester step state — keep App.tsx's
    // selectedSubject in sync so LessonViewer's subjectId prop and currentLessons (its prev/next
    // navigation list) always reflect whatever lesson is actually open.
    setSelectedSubject(lesson.subject);
    setSelectedLesson(lesson);
    setIsHomeActive(false);
  };

  // View state: Student App vs Back Office Admin Console
  const [isAdminConsoleActive, setIsAdminConsoleActive] = useState(false);

  // "Mode Éveil" (préscolaire 3-5 ans) — fully isolated sub-app (own data model under
  // data/preschool/, own localStorage keys), entered/exited the same way as the CMS below. Never
  // touches PrimaryGrade/CourseLesson/userProfile.
  const [isPreschoolActive, setIsPreschoolActive] = useState(false);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEmailVerifyPopupOpen, setIsEmailVerifyPopupOpen] = useState(false);
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDressingRoomOpen, setIsDressingRoomOpen] = useState(false);
  const [isHomeworkPinOpen, setIsHomeworkPinOpen] = useState(false);
  const [isPrintablesOpen, setIsPrintablesOpen] = useState(false);
  const [isOfflinePacksOpen, setIsOfflinePacksOpen] = useState(false);
  // Bumped (never reset) after a genuine success moment — a fully-validated quiz or a newly unlocked
  // badge — so AppRatingPrompt knows when it's a good time to ask, without owning that logic itself.
  const [ratingPromptTrigger, setRatingPromptTrigger] = useState(0);
  const [headerTheme, setHeaderTheme] = useState<HeaderTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'neutre' || saved === 'light' || saved === 'dark') return saved;
    }
    return 'neutre';
  });

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, headerTheme);
  }, [headerTheme]);

  // User Profile State in LocalStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mssid_user_profile');
    if (saved) {
      try {
        return normalizeUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse user profile:', e);
      }
    }
    return normalizeUserProfile({
      name: 'التلميذ المجتهد',
      grade: '5AP',
      avatar: '🇩🇿',
      xp: 140,
      level: 2,
      streakDays: 3,
      lastActiveDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      completedLessonIds: ['math-5ap-numbers'],
      completedExamIds: [],
      completedChallengeIds: [],
      quizFullyValidatedLessonIds: [],
      badges: ['b_welcome', 'b_math_star'],
      badgeUnlockedAt: {},
      quizScores: { 'math-5ap-numbers': 30 },
      tashkeelEnabled: false,
    });
  });

  // Badges freshly earned since the last check — queued for a celebratory toast (see BadgeUnlockToast).
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<BadgeInfo[]>([]);

  // Re-evaluates the whole badge catalog whenever a badge-relevant metric changes. Pure/idempotent —
  // safe to run on every such change, and correctly unlocks retroactively if the catalog grows later.
  useEffect(() => {
    const { profile: updated, newlyUnlocked } = applyBadgeEvaluation(userProfile);
    if (newlyUnlocked.length > 0) {
      setUserProfile(updated);
      setNewlyUnlockedBadges((prev) => [...prev, ...newlyUnlocked]);
      // AuthService.syncBadges updates the in-memory auth singleton directly — authUser (from
      // useAuth()) reflects it automatically via the pub/sub subscription, no manual sync needed.
      AuthService.syncBadges(updated.badges, updated.badgeUnlockedAt);
      setRatingPromptTrigger((t) => t + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userProfile.xp,
    userProfile.streakDays,
    userProfile.completedLessonIds.length,
    userProfile.completedExamIds.length,
    userProfile.completedChallengeIds.length,
  ]);

  // SEC-05: the old boot-time AuthService.fetchProfileFromDbAsync() effect that used to live here is
  // gone — AuthContext's <AuthProvider> already fetches the fresh profile from /api/v1/users/me on
  // boot and publishes it through authUser, which the effect below already reacts to.
  useEffect(() => {
    if (authUser) {
      const xp = authUser.score !== undefined ? authUser.score : (authUser.xp !== undefined ? authUser.xp : 140);
      const level = authUser.level !== undefined ? authUser.level : Math.floor(xp / 100) + 1;
      setUserProfile((prev) => ({
        ...prev,
        name: authUser.nom || prev.name,
        xp: xp,
        level: level,
        streakDays: authUser.streakDays || prev.streakDays,
        completedLessonIds: authUser.completedLessonIds || prev.completedLessonIds,
        completedExamIds: authUser.completedExamIds && authUser.completedExamIds.length > 0 ? authUser.completedExamIds : prev.completedExamIds,
        completedChallengeIds: authUser.completedChallengeIds && authUser.completedChallengeIds.length > 0 ? authUser.completedChallengeIds : prev.completedChallengeIds,
        badges: authUser.badges && authUser.badges.length > 0 ? authUser.badges : prev.badges,
        badgeUnlockedAt: { ...authUser.badgeUnlockedAt, ...prev.badgeUnlockedAt },
        quizScores: authUser.quizScores || prev.quizScores,
        tashkeelEnabled: authUser.tashkeelEnabled ?? prev.tashkeelEnabled,
        goldCoins: authUser.goldCoins ?? prev.goldCoins,
        avatarConfig: authUser.avatarConfig ?? prev.avatarConfig,
      }));
    }
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem('mssid_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  /**
   * Flips a lesson's quiz to "fully validated" the first time every question in it has been
   * answered correctly at least once — from then on, LessonViewer caps XP per question at 5
   * instead of 15 (any replay, whether via the in-place shuffle-retry button or by leaving and
   * reopening the lesson), so XP can't be farmed by repeating an already-passed quiz.
   */
  const handleQuizFullyValidated = (lessonId: string) => {
    setUserProfile((prev) =>
      prev.quizFullyValidatedLessonIds.includes(lessonId)
        ? prev
        : { ...prev, quizFullyValidatedLessonIds: [...prev.quizFullyValidatedLessonIds, lessonId] }
    );
    setRatingPromptTrigger((t) => t + 1);
  };

  const handleCompleteQuiz = (lessonId: string, earnedXp: number) => {
    AuthService.addScore(earnedXp, lessonId);
    incrementDailyObjective();

    setUserProfile((prev) => {
      const alreadyCompleted = prev.completedLessonIds.includes(lessonId);
      const newCompleted = alreadyCompleted ? prev.completedLessonIds : [...prev.completedLessonIds, lessonId];
      const newXp = prev.xp + earnedXp;
      const newLevel = Math.floor(newXp / 100) + 1;

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedLessonIds: newCompleted,
        quizScores: {
          ...prev.quizScores,
          [lessonId]: (prev.quizScores[lessonId] || 0) + earnedXp,
        },
      };
    });
  };

  /** ExamsViewer has no auto-grading — completion is a self-report ("✅ أنهيت هذا الامتحان"), rewarded with a flat XP bonus. */
  const handleCompleteExam = (examId: string) => {
    AuthService.addExamXp(examId, 50);
    incrementDailyObjective();

    setUserProfile((prev) => {
      if (prev.completedExamIds.includes(examId)) return prev;
      return {
        ...prev,
        xp: prev.xp + 50,
        level: Math.floor((prev.xp + 50) / 100) + 1,
        completedExamIds: [...prev.completedExamIds, examId],
      };
    });
  };

  /** ChallengesArena computes its own XP total per run — this persists it into the global profile and syncs it to the backend. */
  const handleCompleteChallenge = (challengeId: string, earnedXp: number) => {
    AuthService.addChallengeXp(challengeId, earnedXp);
    incrementDailyObjective();

    setUserProfile((prev) => ({
      ...prev,
      xp: prev.xp + earnedXp,
      level: Math.floor((prev.xp + earnedXp) / 100) + 1,
      completedChallengeIds: prev.completedChallengeIds.includes(challengeId)
        ? prev.completedChallengeIds
        : [...prev.completedChallengeIds, challengeId],
    }));
  };

  /**
   * Shared `onReward` handler for every "labo interactif" (marché algérien, musée, sciences,
   * écriture, tamazight...) — they all award gold coins (spendable in Didou Studio) and XP
   * independently, with no formula tying one to the other (deliberately: XP is the serious
   * pedagogical progression metric, gold coins are a separate cosmetic-shop currency — see
   * AuthUser.goldCoins' doc comment). Also pushes the new gold-coin balance to the backend so it
   * survives a device change instead of living only in localStorage.
   */
  const handleLabReward = (coins: number, xp: number) => {
    const newCoins = (userProfile.goldCoins || 150) + coins;
    setUserProfile((prev) => ({
      ...prev,
      goldCoins: newCoins,
      xp: prev.xp + xp,
    }));
    if (authUser) AuthService.syncGoldCoinsAndAvatar(newCoins, userProfile.avatarConfig);
  };

  const handleResetProgress = () => {
    if (window.confirm('هل أنت تأكد من إعادة ضبط التقدم والنقاط؟')) {
      const freshProfile: UserProfile = {
        name: userProfile.name || 'التلميذ المجتهد',
        grade: '5AP',
        avatar: '🇩🇿',
        xp: 0,
        level: 1,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().slice(0, 10),
        completedLessonIds: [],
        completedExamIds: [],
        completedChallengeIds: [],
        quizFullyValidatedLessonIds: [],
        badges: [],
        badgeUnlockedAt: {},
        quizScores: {},
        tashkeelEnabled: userProfile.tashkeelEnabled ?? false,
      };
      setUserProfile(freshProfile);
      setIsProfileModalOpen(false);
    }
  };

  const handleUpdateProfileName = (newName: string) => {
    setUserProfile((prev) => {
      const updated = { ...prev, name: newName };
      localStorage.setItem('mssid_user_profile', JSON.stringify(updated));
      return updated;
    });

    if (authUser) {
      // AuthService.setCurrentUser publishes to the pub/sub singleton — authUser (via useAuth())
      // reflects the new name immediately, no manual setAuthUser needed.
      AuthService.setCurrentUser({ ...authUser, nom: newName });
      AuthService.updateProfileAsync(newName).catch(() => {});
    }
  };

  const handleUpdateProfileAvatar = (newAvatar: string) => {
    setUserProfile((prev) => {
      const updated = { ...prev, avatar: newAvatar };
      localStorage.setItem('mssid_user_profile', JSON.stringify(updated));
      return updated;
    });
    if (authUser) {
      AuthService.setCurrentUser({ ...authUser, avatar: newAvatar });
    }
  };

  const handleRefreshProfileFromDb = async () => {
    // fetchProfileFromDbAsync() already calls AuthService.setCurrentUser internally, which the
    // [authUser] effect above reacts to and cascades into userProfile — nothing else to do here.
    await AuthService.fetchProfileFromDbAsync();
  };

  // Filter lessons by grade, subject, and trimester
  const currentLessons = COURSES_DATA.filter(
    (l) => l.subject === selectedSubject &&
      (l.grade === grade || selectedSubject === 'soroban') &&
      (selectedTrimester === 'all' || l.trimester === selectedTrimester)
  );

  const xpIntoLevel = userProfile.xp % 100;

  // Tools become relevant from the grade they first appear in onward (e.g. a soroban/geometry tool
  // introduced at 3AP stays visible for 3AP/4AP/5AP, but is hidden while browsing 1AP/2AP).
  const availableLabsForGrade = INTERACTIVE_LABS_LIST.filter((tool) => isToolAvailableForGrade(tool, grade) && isSubjectVisible(tool));

  const ALL_MAIN_CATEGORY_TABS: { id: 'courses' | 'labs' | 'exams' | 'challenges'; icon: React.ReactNode; labelAr: string; countLabelAr: string }[] = [
    { id: 'courses', icon: <BookOpen className="w-4 h-4" />, labelAr: '📚 الدروس والمواد التعليمية', countLabelAr: `${visibleCourseSubjects.length} مواد` },
    { id: 'labs', icon: <Zap className="w-4 h-4" />, labelAr: '⚡ المختبرات والأدوات التفاعلية', countLabelAr: `${availableLabsForGrade.length} أدوات` },
    { id: 'exams', icon: <Award className="w-4 h-4" />, labelAr: '📜 بنك مواضيع الامتحانات', countLabelAr: `${OFFICIAL_EXAMS_LIST.length} بنك` },
    { id: 'challenges', icon: <Trophy className="w-4 h-4" />, labelAr: '🏆 نادي التحديات والمسابقات', countLabelAr: `${CHALLENGES_TAB_LIST.length} تحدي` },
  ];
  const MAIN_CATEGORY_TABS = ALL_MAIN_CATEGORY_TABS.filter((tab) => tab.id !== 'exams' || enableExamSection);

  // --------------------------------------------------------------------------
  // Global Unified Kid-Friendly Back Navigation Logic & Browser History Integration
  // --------------------------------------------------------------------------
  const getSubjectNameAr = (subjId: SubjectId): string => {
    const found = COURSE_SUBJECTS_LIST.find((s) => s.id === subjId) || INTERACTIVE_LABS_LIST.find((s) => s.id === subjId);
    return found ? found.nameAr : 'المادة';
  };

  const navState: BackNavigationState = useMemo(() => {
    // 1. Modals & Special Fullscreen Overlays
    if (isAdminConsoleActive) {
      return {
        canGoBack: true,
        destinationLabelAr: 'تطبيق التلميذ 🎓',
        destinationType: 'home',
        onBack: () => setIsAdminConsoleActive(false),
      };
    }
    if (isPreschoolActive) {
      return {
        canGoBack: true,
        destinationLabelAr: 'منصة الابتدائي 🎒',
        destinationType: 'home',
        onBack: () => setIsPreschoolActive(false),
      };
    }
    if (isDressingRoomOpen) {
      return {
        canGoBack: true,
        destinationLabelAr: 'العودة للتطبيق ↩️',
        destinationType: 'custom',
        onBack: () => setIsDressingRoomOpen(false),
      };
    }
    if (isHomeworkPinOpen) {
      return {
        canGoBack: true,
        destinationLabelAr: 'العودة للتطبيق ↩️',
        destinationType: 'custom',
        onBack: () => setIsHomeworkPinOpen(false),
      };
    }
    if (isPrintablesOpen) {
      return {
        canGoBack: true,
        destinationLabelAr: 'العودة للتطبيق ↩️',
        destinationType: 'custom',
        onBack: () => setIsPrintablesOpen(false),
      };
    }
    if (isOfflinePacksOpen) {
      return {
        canGoBack: true,
        destinationLabelAr: 'العودة للتطبيق ↩️',
        destinationType: 'custom',
        onBack: () => setIsOfflinePacksOpen(false),
      };
    }
    if (isAiModalOpen) {
      return {
        canGoBack: true,
        destinationLabelAr: 'العودة للتطبيق ↩️',
        destinationType: 'custom',
        onBack: () => setIsAiModalOpen(false),
      };
    }
    if (isProfileModalOpen) {
      return {
        canGoBack: true,
        destinationLabelAr: 'العودة للتطبيق ↩️',
        destinationType: 'custom',
        onBack: () => setIsProfileModalOpen(false),
      };
    }

    // 2. Inside a Lesson
    if (selectedLesson) {
      return {
        canGoBack: true,
        destinationLabelAr: `دروس ${getSubjectNameAr(selectedSubject)} 📚`,
        destinationType: 'courses',
        onBack: () => setSelectedLesson(null),
        requireConfirmation: false,
      };
    }

    // 3. Inside Labs / Tools View (active tool open)
    if (!isHomeActive && mainCategory === 'labs' && selectedSubject !== 'algerian_market') {
      return {
        canGoBack: true,
        destinationLabelAr: 'فهرس الأدوات والمختبرات ⚡',
        destinationType: 'labs',
        onBack: () => setSelectedSubject('algerian_market'),
      };
    }

    // 4. Inside Courses selection, Exams, or Challenges
    if (!isHomeActive) {
      return {
        canGoBack: true,
        destinationLabelAr: 'الصفحة الرئيسية 🏠',
        destinationType: 'home',
        onBack: () => {
          setIsHomeActive(true);
          setSelectedLesson(null);
        },
      };
    }

    // 5. At Root Home Dashboard
    return {
      canGoBack: false,
      destinationLabelAr: '',
      destinationType: 'home',
      onBack: () => {},
    };
  }, [
    isAdminConsoleActive,
    isPreschoolActive,
    isDressingRoomOpen,
    isHomeworkPinOpen,
    isPrintablesOpen,
    isOfflinePacksOpen,
    isAiModalOpen,
    isProfileModalOpen,
    selectedLesson,
    selectedSubject,
    isHomeActive,
    mainCategory,
  ]);

  // Sync state to browser history so back button on devices works naturally
  useEffect(() => {
    const currentState = {
      isHomeActive,
      mainCategory,
      selectedSubject,
      selectedLessonId: selectedLesson?.id || null,
      isPreschoolActive,
      isAdminConsoleActive,
    };
    window.history.pushState(currentState, '');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        const s = event.state;
        setIsPreschoolActive(Boolean(s.isPreschoolActive));
        setIsAdminConsoleActive(Boolean(s.isAdminConsoleActive));
        setIsHomeActive(s.isHomeActive !== undefined ? s.isHomeActive : true);
        if (s.mainCategory) setMainCategory(s.mainCategory);
        if (s.selectedSubject) setSelectedSubject(s.selectedSubject);
        if (s.selectedLessonId) {
          const l = COURSES_DATA.find((item) => item.id === s.selectedLessonId);
          // A back/forward navigation must not restore straight into a locked T2/T3 lesson — route
          // through the same gate as a fresh selection (isLessonLocked is declared above, in scope).
          setSelectedLesson(l && !isLessonLocked(l) ? l : null);
        } else {
          setSelectedLesson(null);
        }
      } else {
        setIsHomeActive(true);
        setSelectedLesson(null);
        setIsPreschoolActive(false);
        setIsAdminConsoleActive(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isHomeActive, mainCategory, selectedSubject, selectedLesson?.id, isPreschoolActive, isAdminConsoleActive]);

  if (isAdminConsoleActive) {
    return (
      <Suspense fallback={<LoadingFallback label="جاري تحميل لوحة تحكم الإدارة..." minHeight="100vh" />}>
        <AdminConsoleView onExitAdminConsole={() => setIsAdminConsoleActive(false)} />
      </Suspense>
    );
  }

  if (isPreschoolActive) {
    return (
      <Suspense fallback={<LoadingFallback label="جاري تحميل وضع التحضيري..." minHeight="100vh" />}>
        <PreschoolApp onExit={() => setIsPreschoolActive(false)} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen font-sans antialiased selection:bg-purple-500 selection:text-white pb-20 md:pb-8 transition-colors duration-300 bg-[var(--app-bg)] text-[var(--app-text)]" dir={direction}>

      {/* PWA Mobile Install Banner for Android & iOS */}
      <SeoHead />
      <PwaInstallBanner />

      {/* 1. NAVBAR — theme-aware header (Kit UI v1) */}
      <Navbar
        currentGrade={grade}
        onGradeChange={(g) => {
          setGrade(g);
          setSelectedLesson(null);
          // Deliberate account preference (unlike the auto-follow in the post-auth-redirect and
          // MobileAppSimulator paths) — persist it so it's still the default on next login/reload.
          // No-op for guests (see AuthService.updateGrade).
          if (authUser) AuthService.updateGrade(g);
          // A tool tied to a higher minGrade than the newly selected grade would otherwise stay
          // "open" even though its tab is now hidden — fall back to the first tool still available.
          const currentTool = INTERACTIVE_LABS_LIST.find((s) => s.id === selectedSubject);
          if (currentTool && !isToolAvailableForGrade(currentTool, g)) {
            const fallback = INTERACTIVE_LABS_LIST.find((s) => isToolAvailableForGrade(s, g));
            if (fallback) setSelectedSubject(fallback.id);
          }
        }}
        userProfile={userProfile}
        authUser={authUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          // AuthService.logout() already clears the in-memory singleton (authUser follows via
          // useAuth()) and asks the server to drop the HttpOnly cookie — see authService.ts.
          AuthService.logout();
          // Full reset — the previous partial reset (name/xp/level/completedLessonIds only) left
          // badges, streak, exam/challenge completions and quiz scores visibly stuck on screen.
          localStorage.removeItem('mssid_user_profile');
          setUserProfile(() => createFreshGuestProfile(grade));
        }}
        onOpenAiTutor={() => setIsAiModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onOpenMobileSimulator={() => setIsMobileSimulatorOpen(true)}
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        onOpenTermsOfService={() => setIsTermsModalOpen(true)}
        onOpenAdminConsole={() => setIsAdminConsoleActive(true)}
        onOpenPreschool={() => setIsPreschoolActive(true)}
        onHomeClick={() => {
          setSelectedLesson(null);
          setIsHomeActive(true);
        }}
        currentTheme={headerTheme}
        onThemeChange={(t) => setHeaderTheme(t)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-28 md:pb-6 space-y-6">
        {isHomeActive ? (
          <HomeView
            authUser={authUser}
            userName={userProfile.name}
            goldCoins={userProfile.goldCoins || 150}
            onSelectPole={handleSelectPole}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenPreschool={() => setIsPreschoolActive(true)}
            onOpenMarket={() => {
              setMainCategory('labs');
              setSelectedSubject('algerian_market');
              setIsHomeActive(false);
            }}
            onOpenWilayas={() => {
              setMainCategory('labs');
              setSelectedSubject('wilayas_map');
              setIsHomeActive(false);
            }}
            onOpenHistoryMuseum={() => {
              setMainCategory('labs');
              setSelectedSubject('history_museum');
              setIsHomeActive(false);
            }}
            onOpenScienceLab={() => {
              setMainCategory('labs');
              setSelectedSubject('science_lab');
              setIsHomeActive(false);
            }}
            onOpenTamazightLab={() => {
              setMainCategory('labs');
              setSelectedSubject('tamazight_lab');
              setIsHomeActive(false);
            }}
            onOpenTamazightCurriculum={() => {
              setMainCategory('labs');
              setSelectedSubject('tamazight_curriculum');
              setIsHomeActive(false);
            }}
            onOpenTouchWriting={() => {
              setMainCategory('labs');
              setSelectedSubject('touch_writing');
              setIsHomeActive(false);
            }}
            onOpenDressingRoom={() => setIsDressingRoomOpen(true)}
            onOpenHomeworkPin={() => setIsHomeworkPinOpen(true)}
            onOpenPrintables={() => setIsPrintablesOpen(true)}
            onOpenOfflinePacks={() => setIsOfflinePacksOpen(true)}
          />
        ) : (
        <>
        {/* Sub-Subject Selector */}
        <div className="space-y-4">
          {mainCategory === 'labs' ? (
            <ToolsHubView
              grade={grade}
              tools={availableLabsForGrade}
              selectedToolId={selectedSubject}
              onSelectTool={handleSelectSubject}
            />
          ) : mainCategory !== 'courses' && (
            <div className="border rounded-3xl p-3 shadow-xs flex items-center gap-2 overflow-x-auto transition-colors duration-300 bg-[var(--app-card-bg)] border-[var(--app-card-border)]">
              {(mainCategory === 'exams' ? OFFICIAL_EXAMS_LIST : CHALLENGES_TAB_LIST).map((subj) => {
                const IconComp = ICON_MAP[subj.icon] || BookOpen;
                const isSelected = selectedSubject === subj.id;
                const activeClass = mainCategory === 'exams' ? 'bg-[var(--brand-blue)] text-white' : 'bg-[var(--brand-coral)] text-white';
                return (
                  <motion.button
                    key={subj.id}
                    onClick={() => handleSelectSubject(subj.id)}
                    whileTap={{ scale: 0.96 }}
                    className={`min-h-12 flex items-center gap-2 px-4 py-3 rounded-2xl transition-colors cursor-pointer whitespace-nowrap text-xs font-bold shrink-0 ${
                      isSelected ? `${activeClass} font-black shadow-md` : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{subj.nameAr}</span>
                  </motion.button>
                );
              })}
            </div>
          )}

        </div>

        {/* Selected View Rendering. Courses get their own guided Matière → Trimestre → Liste flow
            (CourseSelectionView) instead of the shared tool/exam/challenge ternary below — but once
            a lesson is actually open, LessonViewer takes over regardless of mainCategory. */}
        {mainCategory === 'courses' && !selectedLesson ? (
          <CourseSelectionView
            grade={grade}
            courseSubjects={visibleCourseSubjects}
            allCourseLessons={COURSES_DATA}
            completedLessonIds={userProfile.completedLessonIds}
            onSelectLesson={handleSelectLesson}
            isLessonLocked={isLessonLocked}
            onGoHome={() => {
              setSelectedLesson(null);
              setIsHomeActive(true);
            }}
          />
        ) : (
        <div id="active-interactive-tool-section" className="scroll-mt-24 transition-all duration-300 relative">
          {/* Active Lab Header Notice with attention pulse & quick back button */}
          {mainCategory === 'labs' && (
            <motion.div
              key={`tool-header-${selectedSubject}`}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3.5 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border-2 border-amber-400/40 rounded-2xl flex items-center justify-between flex-wrap gap-2 shadow-xs ring-4 ring-amber-400/15"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm shadow-xs animate-bounce">
                  🎯
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[var(--app-text)]">
                      {INTERACTIVE_LABS_LIST.find((t) => t.id === selectedSubject)?.nameAr || 'المختبر التفاعلي'}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      جاهزة للتجربة والتعلم ✨
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--app-text-muted)]">
                    تم فتح هذه الأداة بنجاح، استمتع بالتجربة التفاعلية!
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const hub = document.getElementById('tools-hub-container');
                  if (hub) {
                    hub.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] shadow-xs transition-all cursor-pointer hover:scale-105"
              >
                <span>⬆️ اختيار أداة أخرى</span>
              </button>
            </motion.div>
          )}

          <Suspense fallback={<LoadingFallback label="جاري تحميل الأداة التفاعلية..." />}>
            {selectedSubject === 'algerian_market' ? (
              <AlgerianCurrencyMarket
                grade={grade}
                goldCoins={userProfile.goldCoins || 150}
                onBack={() => setIsHomeActive(true)}
                // Coins only here — this lab already awards its own XP directly via
                // AuthService.addScore() at each correct answer (see AlgerianCurrencyMarket.tsx).
                // A second, ad-hoc "+coins/2 XP" bonus used to double-count XP for the same action.
                onEarnCoins={(amount) => handleLabReward(amount, 0)}
              />
            ) : selectedSubject === 'wilayas_map' ? (
              <WilayasExplorer
                grade={grade}
                onBack={() => setIsHomeActive(true)}
                onReward={handleLabReward}
              />
            ) : selectedSubject === 'history_museum' ? (
              <AlgerianHistoryMuseum
                grade={grade}
                onBack={() => setIsHomeActive(true)}
                onReward={handleLabReward}
              />
            ) : selectedSubject === 'science_lab' ? (
              <ScienceExperimentLab
                grade={grade}
                onBack={() => setIsHomeActive(true)}
                onReward={handleLabReward}
              />
            ) : selectedSubject === 'tamazight_lab' ? (
              <TamazightLabInteractive
                grade={grade}
                onBack={() => setIsHomeActive(true)}
                onReward={handleLabReward}
              />
            ) : selectedSubject === 'tamazight_curriculum' ? (
              <TamazightCurriculumViewer
                grade={grade}
                onOpenLab={() => setSelectedSubject('tamazight_lab')}
                onBack={() => setIsHomeActive(true)}
                onReward={handleLabReward}
              />
            ) : selectedSubject === 'touch_writing' ? (
              <TouchWritingStudio
                grade={grade}
                onBack={() => setIsHomeActive(true)}
                onReward={handleLabReward}
              />
            ) : selectedSubject === 'primary_math_ops' ? (
              <PrimaryMathLabInteractive
                grade={grade}
                onBack={() => setIsHomeActive(true)}
                onReward={handleLabReward}
              />
            ) : selectedSubject === 'primary_discovery' ? (
              <PrimaryDiscoveryLabInteractive
                grade={grade}
                onBack={() => setIsHomeActive(true)}
                onReward={handleLabReward}
              />
            ) : selectedSubject === 'french_projects' ? (
              <FrenchProjectsLabInteractive
                grade={grade}
                onBack={() => setIsHomeActive(true)}
                onReward={handleLabReward}
              />
            ) : selectedSubject === 'english_audio_dialogues' ? (
              <EnglishAudioDialoguesLab
                grade={grade}
                onBack={() => setIsHomeActive(true)}
                onReward={handleLabReward}
              />
            ) : selectedSubject === 'arabic_conjugator' ? (
              <ArabicConjugator grade={grade} />
            ) : selectedSubject === 'french_lab' ? (
              <FrenchLanguageLab grade={grade} />
            ) : selectedSubject === 'english_lab' ? (
              <EnglishLanguageLab grade={grade} />
            ) : selectedSubject === 'educational_calculator' ? (
              <EducationalCalculator />
            ) : selectedSubject === 'soroban' ? (
              <SorobanInteractive grade={grade} />
            ) : selectedSubject === 'electricity' ? (
              <ElectricityLabInteractive />
            ) : selectedSubject === 'geometry' ? (
              <GeometryVisualizer grade={grade} theme={headerTheme} />
            ) : selectedSubject === 'converter' ? (
              <UnitConverter grade={grade} theme={headerTheme} />
            ) : selectedSubject === 'multiplication' ? (
              <MultiplicationTableInteractive grade={grade} />
            ) : selectedSubject === 'human_anatomy' ? (
              <HumanAnatomyLab grade={grade} onBack={() => setIsHomeActive(true)} onReward={handleLabReward} />
            ) : selectedSubject === 'earth_cycles' ? (
              <EarthCyclesLab grade={grade} onBack={() => setIsHomeActive(true)} onReward={handleLabReward} />
            ) : selectedSubject === 'fractions_lab' ? (
              <FractionsDecimalsLab grade={grade} onBack={() => setIsHomeActive(true)} onReward={handleLabReward} />
            ) : selectedSubject === 'area_grid' ? (
              <AreaPerimeterGridLab grade={grade} onBack={() => setIsHomeActive(true)} onReward={handleLabReward} />
            ) : selectedSubject === 'clock_trainer' ? (
              <ClockTrainerLab grade={grade} onBack={() => setIsHomeActive(true)} onReward={handleLabReward} />
            ) : selectedSubject === 'syllable_studio' ? (
              <SyllableStudioLab grade={grade} onBack={() => setIsHomeActive(true)} onReward={handleLabReward} />
            ) : selectedSubject === 'speed_reading' ? (
              <SpeedReadingLab grade={grade} onBack={() => setIsHomeActive(true)} onReward={handleLabReward} />
            ) : selectedSubject === 'topography_map' ? (
              <TopographyMapLab grade={grade} onBack={() => setIsHomeActive(true)} onReward={handleLabReward} />
            ) : selectedSubject === 'exams' ? (
              <ExamsViewer
                grade={grade}
                tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
                completedExamIds={userProfile.completedExamIds}
                onExamComplete={handleCompleteExam}
              />
            ) : selectedSubject === 'challenges' ? (
              <ChallengesArena
                grade={grade}
                tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
                onChallengeComplete={handleCompleteChallenge}
              />
            ) : selectedLesson ? (
              <LessonViewer
                lesson={selectedLesson}
                allLessons={currentLessons}
                onSelectLesson={handleSelectLesson}
                onBack={() => setSelectedLesson(null)}
                onCompleteQuiz={handleCompleteQuiz}
                quizAlreadyValidated={userProfile.quizFullyValidatedLessonIds.includes(selectedLesson.id)}
                onQuizFullyValidated={handleQuizFullyValidated}
                grade={grade}
                subjectId={selectedSubject}
                trimester={selectedTrimester}
                tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
                onHomeClick={() => {
                  setSelectedLesson(null);
                  setMainCategory('courses');
                }}
              />
            ) : null}
          </Suspense>
        </div>
        )}
        </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-6 mt-12 transition-colors duration-300 bg-[var(--app-footer-bg)] border-t border-[var(--app-card-border)] text-[var(--app-text-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--app-text)]">مَسِيد Mssid DZ</span>
            <span className="opacity-75">• المنهاج الرسمي لوزارة التربية الوطنية الجزائرية</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAiModalOpen(true)} className="hover:text-[var(--brand-amber)] cursor-pointer">
              المعلم مسيد
            </button>
            <button onClick={() => setIsContactModalOpen(true)} className="hover:text-[var(--brand-emerald)] cursor-pointer">
              تواصل معنا
            </button>
          </div>
        </div>
      </footer>

      {/* ALL MODALS */}
      <AiTutorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        grade={grade}
      />

      <BadgeUnlockToast
        queue={newlyUnlockedBadges}
        onDismiss={() => setNewlyUnlockedBadges((prev) => prev.slice(1))}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        authUser={authUser}
        tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
        onToggleTashkeel={(next) => {
          setUserProfile((prev) => ({ ...prev, tashkeelEnabled: next }));
        }}
        onResetProgress={handleResetProgress}
        onUpdateName={handleUpdateProfileName}
        onUpdateAvatar={handleUpdateProfileAvatar}
        onRefreshFromDb={handleRefreshProfileFromDb}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        authUser={authUser}
      />

      <AppRatingPrompt
        trigger={ratingPromptTrigger}
        onOpenContact={() => setIsContactModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalInitialMode}
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        onOpenTermsOfService={() => setIsTermsModalOpen(true)}
        onAuthSuccess={() => {
          // AuthService.loginAsync/registerAsync already call setCurrentUser internally — authUser
          // (via useAuth()) updates on its own the moment login succeeds. Read AuthService directly
          // here rather than the authUser closed over by this callback: React hasn't re-rendered yet
          // at this exact point, so that closure variable can still be one render behind.
          const freshUser = AuthService.getCurrentUser();
          if (freshUser && !freshUser.emailVerified) {
            setIsEmailVerifyPopupOpen(true);
          }

          // Phase 2 — intelligent post-auth redirect: restore whatever the guest was trying to reach
          // when AuthWallModal interrupted them (see handleSelectLesson).
          const raw = sessionStorage.getItem('redirect_after_auth');
          if (!raw) return;
          sessionStorage.removeItem('redirect_after_auth');
          try {
            const target = JSON.parse(raw);
            if (target?.type === 'lesson' && target.lessonId) {
              const lesson = COURSES_DATA.find((l) => l.id === target.lessonId);
              if (lesson) {
                setGrade(lesson.grade);
                setMainCategory('courses');
                setSelectedSubject(lesson.subject);
                setSelectedLesson(lesson);
                setIsHomeActive(false);
              }
            }
          } catch {
            // Ignore malformed/stale redirect payloads — worst case the user just lands on the dashboard.
          }
        }}
      />

      {authUser && (
        <EmailVerificationPopup
          isOpen={isEmailVerifyPopupOpen}
          onClose={() => setIsEmailVerifyPopupOpen(false)}
          email={authUser.email}
        />
      )}

      <AuthWallModal
        isOpen={isAuthWallOpen}
        onClose={() => setIsAuthWallOpen(false)}
        onCreateAccount={() => {
          setAuthModalInitialMode('register');
          setIsAuthWallOpen(false);
          setIsAuthModalOpen(true);
        }}
        onLogin={() => {
          setAuthModalInitialMode('login');
          setIsAuthWallOpen(false);
          setIsAuthModalOpen(true);
        }}
        viewedCount={guestLimits.viewedCount}
        maxCount={MAX_GUEST_LESSONS}
      />

      <MobileAppSimulator
        isOpen={isMobileSimulatorOpen}
        onClose={() => setIsMobileSimulatorOpen(false)}
        currentGrade={grade}
        onGradeChange={(newGrade) => setGrade(newGrade)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      <Suspense fallback={null}>
        {isDressingRoomOpen && (
          <DidouDressingRoomModal
            isOpen={isDressingRoomOpen}
            onClose={() => setIsDressingRoomOpen(false)}
            userProfile={userProfile}
            onUpdateProfile={(updated) => setUserProfile(updated)}
          />
        )}

        {isHomeworkPinOpen && (
          <HomeworkPinModal
            isOpen={isHomeworkPinOpen}
            onClose={() => setIsHomeworkPinOpen(false)}
            currentGrade={grade}
            onStartHomework={(hw) => {
              setIsHomeworkPinOpen(false);
              setMainCategory('courses');
              setSelectedSubject(hw.subject);
              setIsHomeActive(false);
            }}
          />
        )}

        {isPrintablesOpen && (
          <PrintableWorksheetsGeneratorModal
            isOpen={isPrintablesOpen}
            onClose={() => setIsPrintablesOpen(false)}
            defaultGrade={grade}
          />
        )}

        {isOfflinePacksOpen && (
          <OfflinePacksManagerModal
            isOpen={isOfflinePacksOpen}
            onClose={() => setIsOfflinePacksOpen(false)}
          />
        )}
      </Suspense>

      {lockedLesson && (
        <SubscriptionPaywall
          user={authUser}
          title={`افتح دروس الفصل ${lockedLesson.trimester === 3 ? 'الثالث' : 'الثاني'} — ${lockedLesson.titleAr}`}
          onClose={() => setLockedLesson(null)}
          onSuccessUpgrade={() => {
            const lesson = lockedLesson;
            setLockedLesson(null);
            // AuthService already updated the shared auth singleton (see SubscriptionPaywall /
            // AuthService.verifyReceipt) — useAuth() reflects ROLE_PREMIUM immediately, so re-running
            // handleSelectLesson right away opens the lesson the user was originally trying to reach.
            handleSelectLesson(lesson);
          }}
        />
      )}

      {/* Dedicated Native Mobile Bottom Navigation Bar for Mobile Viewport Users */}
      <MobileBottomNav
        selectedSubject={selectedSubject}
        activeTab={mobileTab}
        onSelectTab={handleMobileTab}
        onClearSelectedLesson={() => setSelectedLesson(null)}
        onOpenAiTutor={() => setIsAiModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        theme={headerTheme}
      />
    </div>
  );
}

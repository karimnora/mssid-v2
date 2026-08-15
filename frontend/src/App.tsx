import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { PrimaryGrade, SubjectId, CourseLesson, UserProfile, Badge as BadgeInfo } from './types';
import { AuthService } from './services/authService';
import { useAuth } from './context/AuthContext';
import { SUBJECTS_LIST, COURSE_SUBJECTS_LIST, INTERACTIVE_LABS_LIST, OFFICIAL_EXAMS_LIST, CHALLENGES_TAB_LIST, SPECIAL_TOOLS_AND_EXAMS_LIST, isToolAvailableForGrade } from './data/subjectsData';
import { COURSES_DATA } from './data/coursesData';
import { CourseSelectionView } from './components/CourseSelectionView';
import { LessonViewer } from './components/LessonViewer';
import { ExamsViewer } from './components/ExamsViewer';
import { ChallengesArena } from './components/ChallengesArena';
import { ToolsHubView } from './components/ToolsHubView';
import { incrementDailyObjective } from './utils/dailyObjective';
import { applyBadgeEvaluation } from './utils/badgeEngine';
import { BadgeUnlockToast } from './components/BadgeUnlockToast';
import { AiTutorModal } from './components/AiTutorModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';
import { AuthWallModal } from './components/AuthWallModal';
import { HomeView, HomePoleId } from './components/HomeView';
import { MobileAppSimulator } from './components/MobileAppSimulator';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { Navbar, HeaderTheme } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { SeoHead } from './components/SeoHead';
import { PricingModal } from './components/PricingModal';
import { AdBanner } from './components/AdBanner';
import { LoadingFallback } from './components/LoadingFallback';
import { AppRatingPrompt } from './components/AppRatingPrompt';
import { ContactModal } from './components/ContactModal';
import { isFeatureEnabled } from './featureFlags';
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
const DidouDressingRoomModal = lazy(() => import('./components/DidouDressingRoomModal').then((m) => ({ default: m.DidouDressingRoomModal })));
const HomeworkPinModal = lazy(() => import('./components/HomeworkPinModal').then((m) => ({ default: m.HomeworkPinModal })));
const PrintableWorksheetsGeneratorModal = lazy(() => import('./components/PrintableWorksheetsGeneratorModal').then((m) => ({ default: m.PrintableWorksheetsGeneratorModal })));
const OfflinePacksManagerModal = lazy(() => import('./components/OfflinePacksManagerModal').then((m) => ({ default: m.OfflinePacksManagerModal })));
const PreschoolApp = lazy(() => import('./components/preschool/PreschoolApp').then((m) => ({ default: m.PreschoolApp })));
const AdminConsoleView = lazy(() => import('./components/admin/AdminConsoleView').then((m) => ({ default: m.AdminConsoleView })));
import { useGuestLimits, MAX_GUEST_LESSONS } from './hooks/useGuestLimits';
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
  Shield
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

  const enablePreschoolModule = useFeatureFlag('enablePreschoolModule');
  const enableExamSection = useFeatureFlag('enableExamSection');

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

  // Mode Découverte gate: every forward lesson selection (lesson-grid card, or "next lesson" inside
  // LessonViewer) goes through here. Once authUser exists the limit never applies again — even a
  // guest who used up all 3 slots gets full access again immediately after creating an account.
  const handleSelectLesson = (lesson: CourseLesson) => {
    if (!authUser && !guestLimits.canAccessLesson(lesson.id)) {
      sessionStorage.setItem('redirect_after_auth', JSON.stringify({ type: 'lesson', lessonId: lesson.id }));
      setIsAuthWallOpen(true);
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
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
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
      }));
    }
  }, [authUser]);

  useEffect(() => {
    localStorage.setItem('mssid_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

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
  const availableLabsForGrade = INTERACTIVE_LABS_LIST.filter((tool) => isToolAvailableForGrade(tool, grade));

  const ALL_MAIN_CATEGORY_TABS: { id: 'courses' | 'labs' | 'exams' | 'challenges'; icon: React.ReactNode; labelAr: string; countLabelAr: string }[] = [
    { id: 'courses', icon: <BookOpen className="w-4 h-4" />, labelAr: '📚 الدروس والمواد التعليمية', countLabelAr: `${COURSE_SUBJECTS_LIST.length} مواد` },
    { id: 'labs', icon: <Zap className="w-4 h-4" />, labelAr: '⚡ المختبرات والأدوات التفاعلية', countLabelAr: `${availableLabsForGrade.length} أدوات` },
    { id: 'exams', icon: <Award className="w-4 h-4" />, labelAr: '📜 الامتحانات الرسمية (5AP)', countLabelAr: `${OFFICIAL_EXAMS_LIST.length} بنك` },
    { id: 'challenges', icon: <Trophy className="w-4 h-4" />, labelAr: '🏆 نادي التحديات والمسابقات', countLabelAr: `${CHALLENGES_TAB_LIST.length} تحدي` },
  ];
  const MAIN_CATEGORY_TABS = ALL_MAIN_CATEGORY_TABS.filter((tab) => tab.id !== 'exams' || enableExamSection);

  return (
    <div className="min-h-screen font-sans dir-rtl antialiased selection:bg-purple-500 selection:text-white pb-20 md:pb-8 transition-colors duration-300 bg-[var(--app-bg)] text-[var(--app-text)]" dir="rtl">

      {/* PWA Mobile Install Banner for Android & iOS */}
      <SeoHead />
      <PwaInstallBanner />
      <AdBanner
        showAds={isFeatureEnabled('SHOW_ADS')}
        userRole={authUser?.role}
        onUpgradeClick={() => setIsPricingModalOpen(true)}
      />

      {/* 1. NAVBAR — theme-aware header (Kit UI v1) */}
      <Navbar
        currentGrade={grade}
        onGradeChange={(g) => {
          setGrade(g);
          setSelectedLesson(null);
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
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
        onOpenMobileSimulator={() => setIsMobileSimulatorOpen(true)}
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        onOpenAdminConsole={() => setIsAdminConsoleActive(true)}
        onOpenPreschool={() => setIsPreschoolActive(true)}
        onOpenHomeworkPin={() => setIsHomeworkPinOpen(true)}
        onOpenOfflinePacks={() => setIsOfflinePacksOpen(true)}
        onOpenPrintables={() => setIsPrintablesOpen(true)}
        onOpenDressingRoom={() => setIsDressingRoomOpen(true)}
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
            guestViewedCount={guestLimits.viewedCount}
            guestRemaining={guestLimits.remaining}
            maxGuestLessons={MAX_GUEST_LESSONS}
            goldCoins={userProfile.goldCoins || 150}
            onSelectPole={handleSelectPole}
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
        {/* Isolated Category Switcher & Sub-Subject Selector */}
        <div className="space-y-4">
          <Card padding="none" className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--app-text-muted)]">مرحباً بك في منصة مَسِيد</p>
              <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[var(--app-text)]">تعلم، جرّب، وارتقِ بالمرح!</h1>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="xp">⭐ تجربة ممتعة للأطفال</Badge>
                <Badge variant="info">🎯 واجهة آمنة وسهلة الاستخدام</Badge>
                {enablePreschoolModule && (
                  <button
                    onClick={() => setIsPreschoolActive(true)}
                    className="min-h-9 px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm cursor-pointer hover:brightness-105 transition-all"
                  >
                    🦊 وضع التحضيري (3-5 سنوات)
                  </button>
                )}
              </div>
              {/* Live XP progress toward next level — Kit UI v1 */}
              <div className="w-full sm:w-56">
                <XPProgressBar currentXp={xpIntoLevel} maxXp={100} level={userProfile.level} />
              </div>
            </div>
          </Card>

          {/* Main Category Header Tabs — shared sliding highlight (Framer Motion layoutId) */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="p-1.5 rounded-2xl border flex items-center gap-2 flex-wrap bg-[var(--app-card-bg)] border-[var(--app-card-border)] shadow-sm">
              {MAIN_CATEGORY_TABS.map((tab) => {
                const isActive = mainCategory === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => {
                      setMainCategory(tab.id);
                      if (tab.id === 'courses' && !COURSE_SUBJECTS_LIST.some((s) => s.id === selectedSubject)) {
                        setSelectedSubject('math');
                      } else if (tab.id === 'labs' && !INTERACTIVE_LABS_LIST.some((s) => s.id === selectedSubject)) {
                        setSelectedSubject('algerian_market');
                      } else if (tab.id === 'exams') {
                        setSelectedSubject('exams');
                      } else if (tab.id === 'challenges') {
                        setSelectedSubject('challenges');
                      }
                      setSelectedLesson(null);
                    }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative min-h-12 px-4 py-2.5 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-2 ${
                      isActive ? 'text-white' : 'text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="main-category-active"
                        className={`absolute inset-0 rounded-xl shadow-md ${
                          tab.id === 'courses' ? 'bg-[var(--brand-emerald)]' : tab.id === 'labs' ? 'bg-[var(--brand-amber)]' : tab.id === 'exams' ? 'bg-[var(--brand-blue)]' : 'bg-[var(--brand-coral)]'
                        }`}
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      {tab.icon}
                      <span>{tab.labelAr}</span>
                      <span dir="ltr" className="bg-black/15 text-[10px] px-2 py-0.5 rounded-full font-mono">
                        {tab.countLabelAr}
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="text-xs font-bold">
              {mainCategory === 'courses' ? (
                <Badge variant="success">🎓 الدروس والبرامج البيداغوجية الرسمية ({grade})</Badge>
              ) : mainCategory === 'labs' ? (
                <Badge variant="xp">🧪 الأدوات والمختبرات وتصريف الأفعال المستقلة</Badge>
              ) : mainCategory === 'exams' ? (
                <Badge variant="info">📜 بنك مواضيع امتحانات شهادة التعليم الابتدائي 5AP مع الحلول</Badge>
              ) : (
                <Badge variant="danger">🏆 تحديات مؤقتة وألعاب سريعة لكسب نقاط الخبرة</Badge>
              )}
            </div>
          </div>

          {/* Sub-Subject Selector — courses uses CourseSelectionView's own guided Matière → Trimestre →
              Liste flow below; labs uses the card-based ToolsHubView; exams/challenges keep the plain
              bar (a single entry each — the real subject/trimester navigation lives inside those views). */}
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
            courseSubjects={COURSE_SUBJECTS_LIST}
            allCourseLessons={COURSES_DATA}
            completedLessonIds={userProfile.completedLessonIds}
            onSelectLesson={handleSelectLesson}
            onGoHome={() => {
              setSelectedLesson(null);
              setIsHomeActive(true);
            }}
          />
        ) : (
        <Suspense fallback={<LoadingFallback label="جاري تحميل الأداة التفاعلية..." />}>
          {selectedSubject === 'algerian_market' ? (
            <AlgerianCurrencyMarket
              grade={grade}
              goldCoins={userProfile.goldCoins || 150}
              onBack={() => setIsHomeActive(true)}
              onEarnCoins={(amount) => {
                setUserProfile((prev) => ({
                  ...prev,
                  goldCoins: (prev.goldCoins || 150) + amount,
                  xp: prev.xp + Math.floor(amount / 2),
                }));
              }}
            />
          ) : selectedSubject === 'wilayas_map' ? (
            <WilayasExplorer
              grade={grade}
              onBack={() => setIsHomeActive(true)}
              onReward={(coins, xp) => {
                setUserProfile((prev) => ({
                  ...prev,
                  goldCoins: (prev.goldCoins || 150) + coins,
                  xp: prev.xp + xp,
                }));
              }}
            />
          ) : selectedSubject === 'history_museum' ? (
            <AlgerianHistoryMuseum
              grade={grade}
              onBack={() => setIsHomeActive(true)}
              onReward={(coins, xp) => {
                setUserProfile((prev) => ({
                  ...prev,
                  goldCoins: (prev.goldCoins || 150) + coins,
                  xp: prev.xp + xp,
                }));
              }}
            />
          ) : selectedSubject === 'science_lab' ? (
            <ScienceExperimentLab
              grade={grade}
              onBack={() => setIsHomeActive(true)}
              onReward={(coins, xp) => {
                setUserProfile((prev) => ({
                  ...prev,
                  goldCoins: (prev.goldCoins || 150) + coins,
                  xp: prev.xp + xp,
                }));
              }}
            />
          ) : selectedSubject === 'tamazight_lab' ? (
            <TamazightLabInteractive
              grade={grade}
              onBack={() => setIsHomeActive(true)}
              onReward={(coins, xp) => {
                setUserProfile((prev) => ({
                  ...prev,
                  goldCoins: (prev.goldCoins || 150) + coins,
                  xp: prev.xp + xp,
                }));
              }}
            />
          ) : selectedSubject === 'tamazight_curriculum' ? (
            <TamazightCurriculumViewer
              grade={grade}
              onOpenLab={() => setSelectedSubject('tamazight_lab')}
              onBack={() => setIsHomeActive(true)}
              onReward={(coins, xp) => {
                setUserProfile((prev) => ({
                  ...prev,
                  goldCoins: (prev.goldCoins || 150) + coins,
                  xp: prev.xp + xp,
                }));
              }}
            />
          ) : selectedSubject === 'touch_writing' ? (
            <TouchWritingStudio
              grade={grade}
              onBack={() => setIsHomeActive(true)}
              onReward={(coins, xp) => {
                setUserProfile((prev) => ({
                  ...prev,
                  goldCoins: (prev.goldCoins || 150) + coins,
                  xp: prev.xp + xp,
                }));
              }}
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
        onAuthSuccess={() => {
          // AuthService.loginAsync/registerAsync already call setCurrentUser internally — authUser
          // (via useAuth()) updates on its own the moment login succeeds.
          //
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
            currentGrade={grade}
          />
        )}

        {isOfflinePacksOpen && (
          <OfflinePacksManagerModal
            isOpen={isOfflinePacksOpen}
            onClose={() => setIsOfflinePacksOpen(false)}
          />
        )}
      </Suspense>

      {isFeatureEnabled('enablePayments') && (
        <PricingModal
          isOpen={isPricingModalOpen}
          onClose={() => setIsPricingModalOpen(false)}
          onRequestCheckout={(providerName, paymentMethod, amountDzd) => {
            return springBootApi.createCheckout({
              paymentMethod,
              amountDzd,
              providerName,
              transactionRef: `CHG-${Date.now()}`,
              returnUrl: window.location.href,
            });
          }}
          currentUser={authUser}
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

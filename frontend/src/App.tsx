import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PrimaryGrade, SubjectId, CourseLesson, UserProfile, Badge as BadgeInfo } from './types';
import { AuthUser } from './types/auth';
import { AuthService } from './services/authService';
import { SUBJECTS_LIST, COURSE_SUBJECTS_LIST, INTERACTIVE_LABS_LIST, OFFICIAL_EXAMS_LIST, CHALLENGES_TAB_LIST, SPECIAL_TOOLS_AND_EXAMS_LIST, isToolAvailableForGrade } from './data/subjectsData';
import { COURSES_DATA } from './data/coursesData';
import { CourseBreadcrumb } from './components/CourseBreadcrumb';
import { LessonViewer } from './components/LessonViewer';
import { ExamsViewer } from './components/ExamsViewer';
import { ChallengesArena } from './components/ChallengesArena';
import { SorobanInteractive } from './components/SorobanInteractive';
import { ElectricityLabInteractive } from './components/ElectricityLabInteractive';
import { UnitConverter } from './components/UnitConverter';
import { GeometryVisualizer } from './components/GeometryVisualizer';
import { EducationalCalculator } from './components/EducationalCalculator';
import { ArabicConjugator } from './components/ArabicConjugator';
import { FrenchLanguageLab } from './components/FrenchLanguageLab';
import { EnglishLanguageLab } from './components/EnglishLanguageLab';
import { MultiplicationTableInteractive } from './components/MultiplicationTableInteractive';
import { incrementDailyObjective } from './utils/dailyObjective';
import { applyBadgeEvaluation } from './utils/badgeEngine';
import { BadgeUnlockToast } from './components/BadgeUnlockToast';
import { AiTutorModal } from './components/AiTutorModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';
import { AdminReceiptsManager } from './components/AdminReceiptsManager';
import { CmsMainView } from './components/cms/CmsMainView';
import { MobileAppSimulator } from './components/MobileAppSimulator';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { Navbar, HeaderTheme } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { SeoHead } from './components/SeoHead';
import { PricingModal } from './components/PricingModal';
import { AdBanner } from './components/AdBanner';
import { isFeatureEnabled } from './featureFlags';
import { springBootApi } from './services/springBootApi';
import { Button, Card, Badge, XPProgressBar } from './components/ui';
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
  ChevronLeft,
  Zap,
  Trophy
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

export default function App() {
  const [grade, setGrade] = useState<PrimaryGrade>('5AP');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('math');
  const [selectedTrimester, setSelectedTrimester] = useState<number | 'all'>('all');
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [mainCategory, setMainCategory] = useState<'courses' | 'labs' | 'exams' | 'challenges'>('courses');
  const [mobileTab, setMobileTab] = useState<'home' | 'courses' | 'exercises' | 'games'>('home');

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
    if (tab === 'home' || tab === 'courses') {
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

  // View state: Student App vs Back Office CMS
  const [isCmsActive, setIsCmsActive] = useState(false);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminReceiptsModalOpen, setIsAdminReceiptsModalOpen] = useState(false);
  const [isMobileSimulatorOpen, setIsMobileSimulatorOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
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

  // Current Auth User
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => AuthService.getCurrentUser());

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
      const updatedAuth = AuthService.syncBadges(updated.badges, updated.badgeUnlockedAt);
      if (updatedAuth) setAuthUser(updatedAuth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userProfile.xp,
    userProfile.streakDays,
    userProfile.completedLessonIds.length,
    userProfile.completedExamIds.length,
    userProfile.completedChallengeIds.length,
  ]);

  useEffect(() => {
    AuthService.fetchProfileFromDbAsync().then((fetched) => {
      if (fetched) {
        setAuthUser(fetched);
        const xp = fetched.score !== undefined ? fetched.score : (fetched.xp !== undefined ? fetched.xp : 140);
        const level = fetched.level !== undefined ? fetched.level : Math.floor(xp / 100) + 1;
        setUserProfile((prev) => ({
          ...prev,
          name: fetched.nom || prev.name,
          xp: xp,
          level: level,
          streakDays: fetched.streakDays || prev.streakDays,
          completedLessonIds: fetched.completedLessonIds || prev.completedLessonIds,
          completedExamIds: fetched.completedExamIds && fetched.completedExamIds.length > 0 ? fetched.completedExamIds : prev.completedExamIds,
          completedChallengeIds: fetched.completedChallengeIds && fetched.completedChallengeIds.length > 0 ? fetched.completedChallengeIds : prev.completedChallengeIds,
          badges: fetched.badges && fetched.badges.length > 0 ? fetched.badges : prev.badges,
          badgeUnlockedAt: { ...fetched.badgeUnlockedAt, ...prev.badgeUnlockedAt },
          quizScores: fetched.quizScores || prev.quizScores,
          tashkeelEnabled: fetched.tashkeelEnabled ?? prev.tashkeelEnabled,
        }));
      }
    });
  }, []);

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

  if (isCmsActive) {
    return <CmsMainView onExitCms={() => setIsCmsActive(false)} />;
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
  };

  const handleCompleteQuiz = (lessonId: string, earnedXp: number) => {
    const updatedAuth = AuthService.addScore(earnedXp, lessonId);
    if (updatedAuth) {
      setAuthUser(updatedAuth);
    }
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
    const updatedAuth = AuthService.addExamXp(examId, 50);
    if (updatedAuth) setAuthUser(updatedAuth);
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
    const updatedAuth = AuthService.addChallengeXp(challengeId, earnedXp);
    if (updatedAuth) setAuthUser(updatedAuth);
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
      const updatedAuth = { ...authUser, nom: newName };
      AuthService.setCurrentUser(updatedAuth);
      setAuthUser(updatedAuth);
      AuthService.updateProfileAsync(newName).catch(() => {});
    }
  };

  const handleRefreshProfileFromDb = async () => {
    const fetched = await AuthService.fetchProfileFromDbAsync();
    if (fetched) {
      setAuthUser(fetched);
      const xp = fetched.score !== undefined ? fetched.score : (fetched.xp !== undefined ? fetched.xp : 140);
      const level = fetched.level !== undefined ? fetched.level : Math.floor(xp / 100) + 1;
      setUserProfile((prev) => ({
        ...prev,
        name: fetched.nom || prev.name,
        xp: xp,
        level: level,
        streakDays: fetched.streakDays || prev.streakDays,
        completedLessonIds: fetched.completedLessonIds || prev.completedLessonIds,
        completedExamIds: fetched.completedExamIds && fetched.completedExamIds.length > 0 ? fetched.completedExamIds : prev.completedExamIds,
        completedChallengeIds: fetched.completedChallengeIds && fetched.completedChallengeIds.length > 0 ? fetched.completedChallengeIds : prev.completedChallengeIds,
        badges: fetched.badges && fetched.badges.length > 0 ? fetched.badges : prev.badges,
        badgeUnlockedAt: { ...fetched.badgeUnlockedAt, ...prev.badgeUnlockedAt },
        tashkeelEnabled: fetched.tashkeelEnabled ?? prev.tashkeelEnabled,
      }));
    }
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

  const MAIN_CATEGORY_TABS: { id: 'courses' | 'labs' | 'exams' | 'challenges'; icon: React.ReactNode; labelAr: string; countLabelAr: string }[] = [
    { id: 'courses', icon: <BookOpen className="w-4 h-4" />, labelAr: '📚 الدروس والمواد التعليمية', countLabelAr: `${COURSE_SUBJECTS_LIST.length} مواد` },
    { id: 'labs', icon: <Zap className="w-4 h-4" />, labelAr: '⚡ المختبرات والأدوات التفاعلية', countLabelAr: `${availableLabsForGrade.length} أدوات` },
    { id: 'exams', icon: <Award className="w-4 h-4" />, labelAr: '📜 الامتحانات الرسمية (5AP)', countLabelAr: `${OFFICIAL_EXAMS_LIST.length} بنك` },
    { id: 'challenges', icon: <Trophy className="w-4 h-4" />, labelAr: '🏆 نادي التحديات والمسابقات', countLabelAr: `${CHALLENGES_TAB_LIST.length} تحدي` },
  ];

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
          AuthService.logout();
          setAuthUser(null);
          setUserProfile((prev) => ({
            ...prev,
            name: 'تلميذ مَسِيد',
            xp: 0,
            level: 1,
            completedLessonIds: [],
          }));
        }}
        onOpenAdminReceiptsModal={() => setIsAdminReceiptsModalOpen(true)}
        onOpenAiTutor={() => setIsAiModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenPricingModal={() => setIsPricingModalOpen(true)}
        onOpenMobileSimulator={() => setIsMobileSimulatorOpen(true)}
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        onOpenCms={() => setIsCmsActive(true)}
        onHomeClick={() => setSelectedLesson(null)}
        currentTheme={headerTheme}
        onThemeChange={(t) => setHeaderTheme(t)}
      />

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-28 md:pb-6 space-y-6">

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
                        setSelectedSubject('arabic_conjugator');
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

          {/* Sub-Subject Selector Tabs Bar */}
          <div className="border rounded-3xl p-3 shadow-xs flex items-center gap-2 overflow-x-auto transition-colors duration-300 bg-[var(--app-card-bg)] border-[var(--app-card-border)]">
            {(mainCategory === 'courses'
              ? COURSE_SUBJECTS_LIST
              : mainCategory === 'labs'
              ? availableLabsForGrade
              : mainCategory === 'exams'
              ? OFFICIAL_EXAMS_LIST
              : CHALLENGES_TAB_LIST
            ).map((subj) => {
              const IconComp = ICON_MAP[subj.icon] || BookOpen;
              const isSelected = selectedSubject === subj.id;
              const activeClass =
                mainCategory === 'labs'
                  ? 'bg-[var(--brand-amber)] text-slate-950'
                  : mainCategory === 'exams'
                  ? 'bg-[var(--brand-blue)] text-white'
                  : mainCategory === 'challenges'
                  ? 'bg-[var(--brand-coral)] text-white'
                  : 'bg-[var(--brand-emerald)] text-white';
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

        </div>

        {/* Selected View Rendering */}
        <div>
          {selectedSubject === 'arabic_conjugator' ? (
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
              tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
              completedExamIds={userProfile.completedExamIds}
              onExamComplete={handleCompleteExam}
            />
          ) : selectedSubject === 'challenges' ? (
            <ChallengesArena
              tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
              onChallengeComplete={handleCompleteChallenge}
            />
          ) : selectedLesson ? (
            <LessonViewer
              lesson={selectedLesson}
              allLessons={currentLessons}
              onSelectLesson={(lesson) => setSelectedLesson(lesson)}
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
          ) : (
            /* Lessons Cards Grid */
            <div className="space-y-6">
              {/* Course Breadcrumb */}
              <CourseBreadcrumb
                grade={grade}
                subjectId={selectedSubject}
                trimester={selectedTrimester}
                tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
                onHomeClick={() => {
                  setSelectedLesson(null);
                  setMainCategory('courses');
                }}
                onSubjectClick={() => setSelectedLesson(null)}
                onTrimesterClick={(t) => setSelectedTrimester(t)}
              />

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-black font-sans text-[var(--app-text)]">
                    دروس ومحتوى مادة {SUBJECTS_LIST.find((s) => s.id === selectedSubject)?.nameAr} - {grade}
                  </h2>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5">
                    برنامج وزارة التربية الوطنية الجزائرية (1AP - 5AP)
                  </p>
                </div>
                <Badge variant="info">عدد الدروس: {currentLessons.length}</Badge>
              </div>

              {/* Trimester Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
                <span className="text-[var(--app-text-muted)] shrink-0">تصفية حسب الفصل:</span>
                {([
                  { id: 'all' as const, labelAr: '🌟 جميع الفصول' },
                  { id: 1 as const, labelAr: '1️⃣ الفصل الأول' },
                  { id: 2 as const, labelAr: '2️⃣ الفصل الثاني' },
                  { id: 3 as const, labelAr: '3️⃣ الفصل الثالث' },
                ]).map((t) => (
                  <motion.button
                    key={String(t.id)}
                    onClick={() => setSelectedTrimester(t.id)}
                    whileTap={{ scale: 0.95 }}
                    className={`min-h-10 px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer shrink-0 ${
                      selectedTrimester === t.id
                        ? 'bg-[var(--brand-blue)] text-white border-[var(--brand-blue-dark)] shadow-xs'
                        : 'bg-[var(--brand-blue)]/10 text-[var(--brand-blue-dark)] border-[var(--brand-blue)]/25 hover:bg-[var(--brand-blue)]/15'
                    }`}
                  >
                    {t.labelAr}
                  </motion.button>
                ))}
              </div>

              {currentLessons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence mode="popLayout">
                    {currentLessons.map((lesson, i) => {
                      const isCompleted = userProfile.completedLessonIds.includes(lesson.id);
                      return (
                        <motion.div
                          key={lesson.id}
                          layout
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25, delay: Math.min(i, 8) * 0.03 }}
                        >
                          <Card interactive className="p-5 space-y-4 h-full" onClick={() => setSelectedLesson(lesson)}>
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Badge variant="info">{lesson.categoryAr}</Badge>
                                {lesson.trimester && (
                                  <Badge variant="xp">الفصل {lesson.trimester}</Badge>
                                )}
                              </div>
                              {isCompleted && (
                                <Badge variant="success">✓ مكتمل</Badge>
                              )}
                            </div>

                            <div>
                              <h3 className="text-base font-extrabold font-sans text-[var(--app-text)]">{lesson.titleAr}</h3>
                              <p className="text-xs text-[var(--app-text-muted)] mt-1 line-clamp-2 leading-relaxed">
                                {lesson.summaryAr}
                              </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-[var(--app-card-border)] text-xs font-bold text-[var(--brand-blue-dark)]">
                              <span>بدء الدورة والتمارين التفاعلية</span>
                              <ChevronLeft className="w-4 h-4" />
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                <Card padding="none" className="p-12 text-center space-y-3">
                  <BookOpen className="w-12 h-12 opacity-40 mx-auto text-[var(--app-text-muted)]" />
                  <h3 className="text-base font-extrabold text-[var(--app-text)]">لا توجد دروس حالياً لهذه المرحلة الحالية</h3>
                  <p className="text-xs text-[var(--app-text-muted)] max-w-md mx-auto">
                    يمكنك تجربة دروس الرياضيات، الحساب الذهني بالسوروبان، أو خوض امتحانات شهادة التعليم الابتدائي (5AP) حالياً.
                  </p>
                  <Button variant="primary" size="sm" onClick={() => handleSelectSubject('math')}>
                    الانتقال لدروس الرياضيات
                  </Button>
                </Card>
              )}

              {/* Tools Section Bottom Bar */}
              <Card padding="none" className="p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span dir="ltr" className="text-[10px] font-mono text-[var(--brand-amber-dark)] block uppercase tracking-wider">INTERACTIVE MATH SUITE</span>
                    <h3 className="text-base font-extrabold font-sans text-[var(--app-text)]">الأدوات التفاعلية للمرحلة الابتدائية</h3>
                  </div>
                  <span className="text-xs text-[var(--app-text-muted)]">سريعة الاستجابة وبدون حماية أو تشفير خارجي</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UnitConverter theme={headerTheme} />
                  <GeometryVisualizer theme={headerTheme} />
                </div>
              </Card>

            </div>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 mt-12 transition-colors duration-300 bg-[var(--app-footer-bg)] border-t border-[var(--app-card-border)] text-[var(--app-text-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--app-text)]">مَسِيد Mssid DZ</span>
            <span className="opacity-75">• المنهاج الرسمي لوزارة التربية الوطنية الجزائرية (Spring Boot Architecture)</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAiModalOpen(true)} className="hover:text-[var(--brand-amber)] cursor-pointer">
              المعلم مسيد (Gemini AI)
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
        onRefreshFromDb={handleRefreshProfileFromDb}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setAuthUser(user)}
      />

      <AdminReceiptsManager
        isOpen={isAdminReceiptsModalOpen}
        onClose={() => setIsAdminReceiptsModalOpen(false)}
        onReceiptUpdated={() => setAuthUser(AuthService.getCurrentUser())}
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

      {isFeatureEnabled('SHOW_PAYMENT') && (
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

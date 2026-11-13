import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { Capacitor } from '@capacitor/core';
import { CourseLesson, SubjectId, SubjectInfo } from './types';
import { AuthService } from './services/authService';
import { useAuth } from './context/AuthContext';
import { useLocaleContext } from './context/LocaleContext';
import {
  COURSE_SUBJECTS_LIST,
  INTERACTIVE_LABS_LIST,
  OFFICIAL_EXAMS_LIST,
  CHALLENGES_TAB_LIST,
  isToolAvailableForGrade,
  isSubjectFeatureEnabled,
} from './data/subjectsData';
import { CourseSelectionView } from './components/CourseSelectionView';
import { HomeView } from './components/HomeView';
import { DidouVirtualCompanion } from './components/DidouVirtualCompanion';
import { getDidouEnergyAfterTreat } from './utils/didouCompanion';
import { Navbar, HeaderTheme } from './components/Navbar';
import { AssessSwitcher } from './components/AssessSwitcher';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { AndroidUpdateBanner } from './components/AndroidUpdateBanner';
import { SeoHead } from './components/SeoHead';
import { LoadingFallback } from './components/LoadingFallback';
import { ActiveWorkspace } from './components/ActiveWorkspace';
import { AppModals } from './components/AppModals';
import { AuthModal } from './components/AuthModal';
import { EmailVerificationPopup } from './components/EmailVerificationPopup';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsOfServiceModal } from './components/TermsOfServiceModal';
import { ToolsHubView } from './components/ToolsHubView';
import { useFeatureFlag } from './hooks/useFeatureFlag';
import { useAppNavigation } from './hooks/useAppNavigation';
import { ActivityExitProvider, useActivityExit } from './context/ActivityExitContext';
import { useUserProgress } from './hooks/useUserProgress';
import { useAppModals } from './hooks/useAppModals';
import { isLessonLocked as isLessonLockedCheck } from './utils/trimesterAccess';
import { isLabFreeForGuest, isLessonFreeForGuest } from './utils/guestAccess';
import { isLabSubjectId } from './navigation/appLocation';
import { lastActivityTitle, readLastActivity, writeLastActivity } from './utils/lastActivity';
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

const PreschoolApp = lazy(() => import('./components/preschool/PreschoolApp').then((m) => ({ default: m.PreschoolApp })));
const AdminConsoleView = lazy(() => import('./components/admin/AdminConsoleView').then((m) => ({ default: m.AdminConsoleView })));

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
const THEME_MANUAL_KEY = 'mssid_theme_manual';

export default function App() {
  return <ActivityExitProvider><AppContent /></ActivityExitProvider>;
}

function AppContent() {
  const { requestLeave } = useActivityExit();
  const { authUser, isAuthLoading } = useAuth();
  const { direction, t, locale } = useLocaleContext();
  const modals = useAppModals();
  const progress = useUserProgress({ authUser });

  const selectedTrimester: number | 'all' = 'all';
  const [lockedLesson, setLockedLesson] = useState<CourseLesson | null>(null);
  // Whether the user has manually picked a theme (vs. following the OS/browser preference).
  // Plain state (not a ref) so the "تلقائي" toggle's highlighted state re-renders correctly —
  // see the matchMedia effect further down, which only reacts to system changes while this is
  // false, and the onThemeAuto handler below, which is the UI's only way back to auto-follow
  // once a manual pick has been made (remonte utilisateur : aucune echappatoire dans le menu
  // pour revenir en mode automatique apres un choix manuel, meme accidentel).
  const [themeIsManual, setThemeIsManual] = useState<boolean>(
    typeof window !== 'undefined' && window.localStorage.getItem(THEME_MANUAL_KEY) === 'true'
  );
  const [headerTheme, setHeaderTheme] = useState<HeaderTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      const manual = window.localStorage.getItem(THEME_MANUAL_KEY) === 'true';
      if (manual && (saved === 'neutre' || saved === 'light' || saved === 'dark')) {
        return saved;
      }
      if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'neutre';
  });
  const [courseEntrySubject, setCourseEntrySubject] = useState<SubjectId | null>(null);
  const courseStepBackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, headerTheme);
  }, [headerTheme]);

  // Follow the OS/browser dark-mode preference live (e.g. a phone's battery-saver mode flipping
  // to dark) whenever not manually overridden — remonte utilisateur : le footer restait clair
  // quand le mode economie d'energie du telephone passait en sombre.
  useEffect(() => {
    if (themeIsManual || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setHeaderTheme(e.matches ? 'dark' : 'neutre');
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [themeIsManual]);

  const handleThemeAuto = () => {
    setThemeIsManual(false);
    window.localStorage.removeItem(THEME_MANUAL_KEY);
    const isDark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setHeaderTheme(isDark ? 'dark' : 'neutre');
  };

  const tamazightFlag = useFeatureFlag('tamazight');
  const educationalCalculatorFlag = useFeatureFlag('educationalCalculator');
  const writingLabFlag = useFeatureFlag('writingLab');
  const advancedLabsFlag = useFeatureFlag('advancedLabs');
  const enableTrimesterPaywall = useFeatureFlag('enableTrimesterPaywall');
  const enablePaymentsFlag = useFeatureFlag('enablePayments');
  const curriculumReviewGate = useFeatureFlag('curriculumReviewGate');
  const enableAITutor = useFeatureFlag('enableAITutor');

  const isSubjectVisible = (s: SubjectInfo): boolean =>
    isSubjectFeatureEnabled(s, {
      tamazight: tamazightFlag,
      educationalCalculator: educationalCalculatorFlag,
      writingLab: writingLabFlag,
      advancedLabs: advancedLabsFlag,
    });

  // The full lesson catalog (~4.6 MB) is dynamically imported rather than a top-level `import`,
  // so a visitor's first paint (home screen, no course content needed there) never waits on it.
  // Kicked off right after mount — not gated on the user navigating into "الدروس" — so it's very
  // likely already resolved by the time they actually get there; courseSelectionView/
  // ActiveWorkspace show a loading state below for the rare case it isn't yet. Declared before
  // isLessonLocked below since the guest-preview check needs it to find a lesson's siblings.
  const [coursesData, setCoursesData] = useState<CourseLesson[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    import('./data/coursesData').then((m) => {
      if (!cancelled) setCoursesData(m.COURSES_DATA);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Once enabled by an administrator, this release gate keeps unverified content out of the
  // learner catalog. It is deliberately stricter than a visual warning.
  const publishableCourses = (coursesData ?? []).filter(
    (lesson) => !curriculumReviewGate || lesson.contentSource === 'official_verified'
  );

  const isGuest = !authUser;

  // Guest gate: no account yet → only the first lesson of each subject is open (isLessonLocked),
  // and any other lock reason (the dormant trimester paywall) is moot for a guest since they'd be
  // blocked here first anyway — onLessonLocked below always routes a guest to the login modal
  // rather than the payment paywall, since "create an account" is the actionable first step.
  const isLessonLocked = (lesson: CourseLesson): boolean => {
    if (isGuest && !isLessonFreeForGuest(lesson, publishableCourses)) return true;
    return isLessonLockedCheck(lesson, {
      enablePayments: enablePaymentsFlag,
      enableTrimesterPaywall,
      userRole: authUser?.role,
    });
  };

  const onLessonLocked = (lesson: CourseLesson) => {
    if (isGuest) {
      modals.openAuth('register', 'أنشئ حساباً مجانياً (يستغرق دقيقة واحدة فقط) لمتابعة هذا الدرس ومشاهدة كل الدروس الأخرى مجاناً. 🎁');
      return;
    }
    setLockedLesson(lesson);
  };

  const nav = useAppNavigation({
    isLessonLocked,
    accountGrade: authUser?.grade,
    onLessonLocked,
    isGuest,
    isLabFreeForGuest,
    onGuestBlocked: () => modals.openAuth('register','هذا المحتوى (اختبار، تحدٍّ، أو أداة) مخصص للأعضاء المسجلين فقط. أنشئ حساباً مجانياً لفتحه! 🔓'),
  });

  // /admin is reachable by URL alone (see appLocation.ts's plain 'admin' route), so this must never
  // assume a visitor who lands there is staff. The backend already refuses non-admin writes (see
  // FeatureFlagController/AdminController's @PreAuthorize("hasRole('ADMIN')")), but the console UI
  // itself was still rendering for anyone who typed /admin — kick non-admins back out (revue externe
  // #6). Waits on isAuthLoading so a real admin refreshing the page mid-session-hydration isn't
  // bounced before their role has even loaded.
  useEffect(() => {
    if (nav.isAdminConsoleActive && !isAuthLoading && authUser?.role !== 'ROLE_ADMIN') {
      nav.setIsAdminConsoleActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.isAdminConsoleActive, isAuthLoading, authUser?.role]);

  const visibleCourseSubjects = COURSE_SUBJECTS_LIST.filter((s) =>
    isToolAvailableForGrade(s, nav.grade) &&
    isSubjectVisible(s) &&
    publishableCourses.some((lesson) => lesson.grade === nav.grade && lesson.subject === s.id)
  );
  const availableLabsForGrade = INTERACTIVE_LABS_LIST.filter((tool) => isToolAvailableForGrade(tool, nav.grade) && isSubjectVisible(tool));
  const currentLessons = publishableCourses.filter(
    (l) => l.subject === nav.selectedSubject &&
      (l.grade === nav.grade || nav.selectedSubject === 'soroban') &&
      (selectedTrimester === 'all' || l.trimester === selectedTrimester)
  );

  const openAiTutor = () => {
    if (!enableAITutor) return;
    if (!authUser) {
      modals.openAuth('register', 'المعلّم الذكي متاح للأعضاء المسجلين فقط. أنشئ حساباً مجانياً لتبدأ معه! 🦊');
      return;
    }
    modals.setIsAiModalOpen(true);
  };

  /** Ouvre un lab en plein écran (catalogue fermé). */
  const openLabFocused = (toolId: SubjectId) => {
    requestLeave(() => {
      nav.setLabsCatalogOpen(false);
      nav.openLab(toolId);
    });
  };

  /** Onglet / pôle « المختبرات » → liste des labs, pas un lab auto. */
  const openLabsCatalog = () => {
    nav.setLabsCatalogOpen(true);
  };

  useEffect(() => {
    const lesson = nav.selectedLesson;
    if (!lesson) return;
    writeLastActivity({
      kind: 'lesson',
      lessonId: lesson.id,
      subject: lesson.subject,
      grade: lesson.grade,
      titleAr: lesson.titleAr,
    });
  }, [nav.selectedLesson]);

  useEffect(() => {
    if (nav.isHomeActive || nav.mainCategory !== 'labs' || nav.labsCatalogOpen) return;
    const tool = INTERACTIVE_LABS_LIST.find((item) => item.id === nav.selectedSubject);
    if (!tool) return;
    writeLastActivity({
      kind: 'lab',
      toolId: tool.id,
      grade: nav.grade,
      titleAr: tool.nameAr,
      titleFr: tool.nameFr,
    });
  }, [nav.isHomeActive, nav.mainCategory, nav.labsCatalogOpen, nav.selectedSubject, nav.grade]);

  const storedActivity = readLastActivity();
  const resumeActivity = storedActivity && storedActivity.grade === nav.grade ? storedActivity : null;

  const handleResumeActivity = () => {
    const activity = readLastActivity();
    if (!activity || activity.grade !== nav.grade) return;
    if (activity.kind === 'lab') {
      openLabFocused(activity.toolId);
      return;
    }
    const lesson = (coursesData ?? []).find((item) => item.id === activity.lessonId);
    if (lesson) nav.handleSelectLesson(lesson);
  };

  const handlePrimaryBack = () => {
    if (nav.mainCategory === 'courses' && !nav.selectedLesson && courseStepBackRef.current) {
      courseStepBackRef.current();
      return;
    }
    if (nav.selectedLesson) setCourseEntrySubject(nav.selectedLesson.subject);
    nav.goBack();
  };

  const handleFeedDidou = (treatId: string, energyBonus: number, xpBonus: number, cost: number) => {
    progress.setUserProfile((prev) => {
      const currentCoins = prev.goldCoins ?? 150;
      if (currentCoins < cost) return prev;
      const currentConfig = prev.avatarConfig || {
        species: 'fennec',
        activeOutfit: 'default',
        unlockedOutfits: ['default'],
        happinessLevel: 80,
        energy: 80,
        mood: 'happy',
        currentStage: 1,
        totalTreatsGiven: 0,
        wisdomPoints: 0,
      };
      // DidouVirtualCompanion / DidouDressingRoomModal both read `energy` (not `energyLevel`) for
      // the energy bar — keep writing the field they actually display.
      const newEnergy = getDidouEnergyAfterTreat(currentConfig, energyBonus);
      const newHappiness = Math.min(100, (currentConfig.happinessLevel ?? 80) + Math.round(energyBonus / 2));
      const newCoins = Math.max(0, currentCoins - cost);
      const newXp = prev.xp + xpBonus;
      const updatedConfig = {
        ...currentConfig,
        energy: newEnergy,
        happinessLevel: newHappiness,
        mood: 'happy' as const,
        totalTreatsGiven: (currentConfig.totalTreatsGiven || 0) + 1,
        lastFedAt: new Date().toISOString(),
      };
      const updated = {
        ...prev,
        goldCoins: newCoins,
        xp: newXp,
        level: Math.floor(newXp / 100) + 1,
        avatarConfig: updatedConfig,
      };
      localStorage.setItem('mssid_user_profile', JSON.stringify(updated));
      void AuthService.syncGoldCoinsAndAvatar(newCoins, updatedConfig);
      return updated;
    });
  };

  if (nav.isAdminConsoleActive) {
    if (isAuthLoading) {
      return <LoadingFallback label={t('navigation', 'loadingAdminConsole')} minHeight="100vh" />;
    }
    if (authUser?.role !== 'ROLE_ADMIN') {
      // Non-admin on /admin: render nothing while the effect above flips isAdminConsoleActive off
      // on the next tick, rather than ever mounting the console (and its lazy chunk) for them.
      return null;
    }
    return (
      <Suspense fallback={<LoadingFallback label={t('navigation', 'loadingAdminConsole')} minHeight="100vh" />}>
        <AdminConsoleView onExitAdminConsole={() => nav.setIsAdminConsoleActive(false)} />
      </Suspense>
    );
  }

  if (nav.isPreschoolActive) {
    return (
      <>
        <AndroidUpdateBanner />
        <Suspense fallback={<LoadingFallback label={t('navigation', 'loadingPreschool')} minHeight="100vh" />}>
          <PreschoolApp
            onExit={() => requestLeave(() => { nav.setIsPreschoolActive(false); nav.goHome(); })}
            onOpenAuth={(mode, reason) => modals.openAuth(mode, reason)}
            isAuthModalOpen={modals.isAuthModalOpen}
          />
        </Suspense>
        <AuthModal
          isOpen={modals.isAuthModalOpen}
          onClose={() => modals.setIsAuthModalOpen(false)}
          initialMode={modals.authModalInitialMode}
          contextMessage={modals.authModalReason}
          onOpenPrivacyPolicy={() => modals.setIsPrivacyModalOpen(true)}
          onOpenTermsOfService={() => modals.setIsTermsModalOpen(true)}
          onAuthSuccess={() => {
            const freshUser = AuthService.getCurrentUser();
            if (freshUser && !freshUser.emailVerified) {
              modals.setIsEmailVerifyPopupOpen(true);
            }
          }}
        />
        {authUser && (
          <EmailVerificationPopup
            isOpen={modals.isEmailVerifyPopupOpen}
            onClose={() => modals.setIsEmailVerifyPopupOpen(false)}
            email={authUser.email}
          />
        )}
        <PrivacyPolicyModal
          isOpen={modals.isPrivacyModalOpen}
          onClose={() => modals.setIsPrivacyModalOpen(false)}
        />
        <TermsOfServiceModal
          isOpen={modals.isTermsModalOpen}
          onClose={() => modals.setIsTermsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen print:min-h-0 font-sans antialiased selection:bg-[var(--brand-emerald)] selection:text-white pb-[calc(5rem+env(safe-area-inset-bottom))] print:pb-0 md:pb-8 transition-colors duration-300 bg-[var(--app-bg)] text-[var(--app-text)]" dir={direction}>
      <SeoHead />
      <PwaInstallBanner enabled={nav.isHomeActive} />
      <AndroidUpdateBanner />

      <Navbar
        currentGrade={nav.grade}
        onHomeClick={nav.goHome}
        onBackClick={nav.isHomeActive ? undefined : handlePrimaryBack}
        currentTheme={headerTheme}
        onOpenProfileModal={() => modals.setIsProfileModalOpen(true)}
        onOpenSettingsModal={() => modals.setIsSettingsModalOpen(true)}
        onOpenAssess={() => nav.handleSelectPole('exams')}
        avatar={progress.userProfile.avatar}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-28 md:pb-6 space-y-6">
        {nav.isHomeActive ? (
          <HomeView
            grade={nav.grade}
            authUser={authUser}
            userName={progress.userProfile.name}
            goldCoins={progress.userProfile.goldCoins ?? 150}
            xp={progress.userProfile.xp}
            level={progress.userProfile.level}
            avatarConfig={progress.userProfile.avatarConfig || authUser?.avatarConfig}
            courseSubjects={visibleCourseSubjects}
            isLoadingCourses={coursesData === null}
            onSelectPole={(pole) => {
              setCourseEntrySubject(null);
              nav.handleSelectPole(pole);
              if (pole === 'labs') openLabsCatalog();
            }}
            onSelectSubject={(subject) => {
              setCourseEntrySubject(subject);
              nav.handleSelectSubject(subject);
            }}
            onOpenAuthModal={() => modals.openAuth('login')}
            onOpenPreschool={() => nav.setIsPreschoolActive(true)}
            onOpenMarket={() => openLabFocused('algerian_market')}
            onOpenWilayas={() => openLabFocused('wilayas_map')}
            onOpenHistoryMuseum={() => openLabFocused('history_museum')}
            onOpenScienceLab={() => openLabFocused('science_lab')}
            onOpenMathLab={() => openLabFocused('primary_math_ops')}
            onOpenTamazightCurriculum={() => openLabFocused('tamazight_curriculum')}
            onOpenTouchWriting={() => openLabFocused('touch_writing')}
            onOpenDressingRoom={() => modals.setIsDressingRoomOpen(true)}
            onOpenHomeworkPin={() => modals.setIsHomeworkPinOpen(true)}
            onOpenPrintables={() => modals.setIsPrintablesOpen(true)}
            onOpenHonorCertificates={() => modals.setIsHonorCertificatesOpen(true)}
            onOpenOfflinePacks={() => modals.setIsOfflinePacksOpen(true)}
            onFeedDidou={handleFeedDidou}
            lastActivityTitle={resumeActivity ? lastActivityTitle(resumeActivity, locale) : null}
            onResumeActivity={resumeActivity ? handleResumeActivity : undefined}
          />
        ) : (
          <>
            <div className="space-y-4">
              {nav.mainCategory === 'labs' ? (
                <ToolsHubView
                  grade={nav.grade}
                  tools={availableLabsForGrade}
                  selectedToolId={nav.selectedSubject}
                  catalogOpen={nav.labsCatalogOpen}
                  onCatalogOpenChange={nav.setLabsCatalogOpen}
                  onSelectTool={nav.handleSelectSubject}
                />
              ) : nav.mainCategory !== 'courses' && (
                <>
                {(nav.mainCategory === 'exams' || nav.mainCategory === 'challenges') && (
                  <AssessSwitcher
                    active={nav.mainCategory}
                    onOpenExams={() => nav.handleSelectPole('exams')}
                    onOpenChallenges={() => nav.handleSelectPole('challenges')}
                  />
                )}
                <div className="border rounded-3xl p-3 shadow-xs flex items-center gap-2 overflow-x-auto transition-colors duration-300 bg-[var(--app-card-bg)] border-[var(--app-card-border)]">
                  {(nav.mainCategory === 'exams' ? OFFICIAL_EXAMS_LIST : CHALLENGES_TAB_LIST).map((subj) => {
                      const IconComp = ICON_MAP[subj.icon] || BookOpen;
                      const isSelected = nav.selectedSubject === subj.id;
                      const activeClass = nav.mainCategory === 'exams' ? 'bg-[var(--brand-blue)] text-white' : 'bg-[var(--brand-amber)] text-amber-950';
                      return (
                        <motion.button
                          key={subj.id}
                          onClick={() => nav.handleSelectSubject(subj.id)}
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
                </>
              )}
            </div>

            {coursesData === null && nav.mainCategory === 'courses' ? (
              <LoadingFallback label={t('navigation', 'loadingCourses')} minHeight="50vh" />
            ) : nav.mainCategory === 'courses' && !nav.selectedLesson ? (
              <CourseSelectionView
                grade={nav.grade}
                courseSubjects={visibleCourseSubjects}
                allCourseLessons={publishableCourses}
                completedLessonIds={progress.userProfile.completedLessonIds}
                onSelectLesson={(lesson) => {
                  setCourseEntrySubject(lesson.subject);
                  nav.handleSelectLesson(lesson);
                }}
                isLessonLocked={isLessonLocked}
                onGoHome={nav.goHome}
                initialSubjectId={courseEntrySubject}
                onSubjectStepBackChange={(action) => { courseStepBackRef.current = action; }}
              />
            ) : nav.mainCategory === 'labs' && (!isLabSubjectId(nav.selectedSubject) || nav.labsCatalogOpen) ? null : (
              <ActiveWorkspace
                key={`${nav.selectedSubject}:${nav.grade}:${nav.selectedLesson?.id ?? ''}`}
                grade={nav.grade}
                selectedSubject={nav.selectedSubject}
                selectedLesson={nav.selectedLesson}
                currentLessons={currentLessons}
                selectedTrimester={selectedTrimester}
                mainCategory={nav.mainCategory}
                headerTheme={headerTheme}
                userProfile={progress.userProfile}
                onSelectLesson={nav.handleSelectLesson}
                onClearLesson={handlePrimaryBack}
                onBackToCourses={() => {
                  requestLeave(() => {
                    nav.setSelectedLesson(null);
                    nav.setMainCategory('courses');
                  });
                }}
                onBackToLabsCatalog={handlePrimaryBack}
                onOpenLab={openLabFocused}
                onCompleteQuiz={progress.handleCompleteQuiz}
                onQuizFullyValidated={progress.handleQuizFullyValidated}
                onExamComplete={progress.handleCompleteExam}
                onChallengeComplete={progress.handleCompleteChallenge}
                onVisitLab={progress.handleVisitLab}
                onLabReward={progress.handleLabReward}
                onEarnCoins={(amount) => progress.handleLabReward(amount, 0)}
                onReportError={modals.openErrorReport}
              />
            )}

            {/* FLOATING COMPANION BUTTON WHEN OUTSIDE HOME — hidden during exams and the challenges
                arena: an exam needs an uncluttered, focused screen, and inside challenges Didou is
                already the on-screen hero of the boss-battle game, so a second floating Didou would
                just be visual noise (and the arena's own timed sub-games deserve the same focus as
                an exam). Unmounting here also means its audio/timeout cleanup runs on every exit
                instead of the companion silently running in the background on every other screen. */}
            {nav.selectedSubject !== 'exams' && nav.selectedSubject !== 'challenges' && (
              <DidouVirtualCompanion
                avatarConfig={progress.userProfile.avatarConfig || authUser?.avatarConfig}
                goldCoins={progress.userProfile.goldCoins ?? 150}
                xp={progress.userProfile.xp}
                level={progress.userProfile.level}
                userName={progress.userProfile.name}
                onOpenDressingRoom={() => modals.setIsDressingRoomOpen(true)}
                onFeed={handleFeedDidou}
                isFloating={true}
              />
            )}

            {/* Desktop/web AI tutor entry point — the only other trigger is the fox button inside
                MobileBottomNav, whose whole nav is `md:hidden`, so without this the AI tutor was
                completely unreachable on a browser wide enough to hide that nav (any real desktop
                visit, not just the Android app). Same exams/challenges exclusion as Didou above. */}
            {enableAITutor && nav.selectedSubject !== 'exams' && nav.selectedSubject !== 'challenges' && (
              <button
                type="button"
                onClick={openAiTutor}
                title={t('navigation', 'aiTutor')}
                aria-label={t('navigation', 'aiTutor')}
                className="hidden md:flex fixed bottom-6 end-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--kids-sun-1)] to-[var(--kids-coral-2)] text-white items-center justify-center text-3xl shadow-xl border-4 border-[var(--app-footer-bg)] cursor-pointer hover:scale-105 transition-transform"
              >
                <span aria-hidden>🦊</span>
              </button>
            )}
          </>
        )}
      </main>

      <footer className="py-6 mt-12 transition-colors duration-300 bg-[var(--app-footer-bg)] border-t border-[var(--app-card-border)] text-[var(--app-text-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[var(--app-text)]">{t('navigation', 'footerBrandName')}</span>
            <span>{t('navigation', 'footerCurriculumLine')}</span>
            <span>{t('navigation', 'footerCopyright', { year: new Date().getFullYear() })}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => modals.setIsContactModalOpen(true)} className="hover:text-[var(--brand-emerald)] cursor-pointer">
              {t('navigation', 'contactUs')}
            </button>
            {/* Native app -> link back to the web version; web -> link to the Play Store listing. */}
            {Capacitor.isNativePlatform() ? (
              <a href="https://mssid-dz.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--brand-blue)] cursor-pointer">
                {t('navigation', 'footerWebVersionLink')}
              </a>
            ) : (
              <a href="https://play.google.com/store/apps/details?id=dz.mssid.app" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--brand-blue)] cursor-pointer">
                {t('navigation', 'footerPlayStoreLink')}
              </a>
            )}
            <span className="w-px h-4 bg-[var(--app-card-border)]" aria-hidden="true" />
            <a
              href="https://www.facebook.com/mssid.dz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="hover:text-[#1877F2] transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@mssid.dz"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              title="TikTok"
              className="hover:text-[#000000] dark:hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>

      <AppModals
        modals={modals}
        grade={nav.grade}
        userProfile={progress.userProfile}
        setUserProfile={progress.setUserProfile}
        authUser={authUser}
        newlyUnlockedBadges={progress.newlyUnlockedBadges}
        onDismissBadge={() => progress.setNewlyUnlockedBadges((prev) => prev.slice(1))}
        ratingPromptTrigger={progress.ratingPromptTrigger}
        allowRatingPrompt={nav.isHomeActive}
        lockedLesson={lockedLesson}
        onCloseLockedLesson={() => setLockedLesson(null)}
        onSelectLesson={nav.handleSelectLesson}
        onRestoreLesson={(lesson) => {
          requestLeave(() => {
            nav.setGrade(lesson.grade);
            nav.handleSelectLesson(lesson);
          });
        }}
        onStartHomework={(subject) => {
          requestLeave(() => {
            nav.setMainCategory('courses');
            nav.setSelectedSubject(subject);
            nav.setIsHomeActive(false);
          });
        }}
        onGradeChange={(g) => {
          requestLeave(() => {
            nav.handleGradeChange(g);
            if (authUser) AuthService.updateGrade(g);
          });
        }}
        onOpenAuthModal={() => modals.openAuth('login')}
        onEnterPreschool={() => nav.setIsPreschoolActive(true)}
        onLogout={() => {
          AuthService.logout();
          progress.handleLogoutProgressReset(nav.grade);
        }}
        onOpenAdminConsole={() => nav.setIsAdminConsoleActive(true)}
        onOpenContactModal={() => modals.setIsContactModalOpen(true)}
        onOpenPrivacyPolicy={() => modals.setIsPrivacyModalOpen(true)}
        onOpenTermsOfService={() => modals.setIsTermsModalOpen(true)}
        currentTheme={headerTheme}
        onThemeChange={(t) => {
          setThemeIsManual(true);
          window.localStorage.setItem(THEME_MANUAL_KEY, 'true');
          setHeaderTheme(t);
        }}
        isThemeAuto={!themeIsManual}
        onThemeAuto={handleThemeAuto}
        onResetProgress={progress.handleResetProgress}
        onUpdateName={progress.handleUpdateProfileName}
        onUpdateAvatar={progress.handleUpdateProfileAvatar}
        onRefreshFromDb={progress.handleRefreshProfileFromDb}
      />

      <MobileBottomNav
        grade={nav.grade}
        selectedSubject={nav.selectedSubject}
        activeTab={nav.mobileTab}
        onSelectTab={(tab) => {
          requestLeave(() => {
            nav.handleMobileTab(tab);
            if (tab === 'games') openLabsCatalog();
          });
        }}
        onClearSelectedLesson={() => nav.setSelectedLesson(null)}
        onOpenAiTutor={openAiTutor}
        showAiTutor={enableAITutor}
      />
    </div>
  );
}

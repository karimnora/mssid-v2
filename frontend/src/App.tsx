import React, { useState, useEffect, Suspense, lazy } from 'react';
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
import { Navbar, HeaderTheme } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { SeoHead } from './components/SeoHead';
import { LoadingFallback } from './components/LoadingFallback';
import { ActiveWorkspace } from './components/ActiveWorkspace';
import { AppModals } from './components/AppModals';
import { ToolsHubView } from './components/ToolsHubView';
import { useFeatureFlag } from './hooks/useFeatureFlag';
import { useAppNavigation } from './hooks/useAppNavigation';
import { useUserProgress } from './hooks/useUserProgress';
import { useAppModals } from './hooks/useAppModals';
import { isLessonLocked as isLessonLockedCheck } from './utils/trimesterAccess';
import { isLabSubjectId } from './navigation/appLocation';
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
  const { authUser, isAuthLoading } = useAuth();
  const { direction, t } = useLocaleContext();
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
  /** P0 labs : catalogue masqué tant qu'un lab est ouvert (1 carte = 1 écran). */
  const [labsCatalogOpen, setLabsCatalogOpen] = useState(false);

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

  const isSubjectVisible = (s: SubjectInfo): boolean =>
    isSubjectFeatureEnabled(s, {
      tamazight: tamazightFlag,
      educationalCalculator: educationalCalculatorFlag,
      writingLab: writingLabFlag,
      advancedLabs: advancedLabsFlag,
    });

  const isLessonLocked = (lesson: CourseLesson): boolean =>
    isLessonLockedCheck(lesson, {
      enablePayments: enablePaymentsFlag,
      enableTrimesterPaywall,
      userRole: authUser?.role,
    });

  const nav = useAppNavigation({
    isLessonLocked,
    accountGrade: authUser?.grade,
    onLessonLocked: setLockedLesson,
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

  // The full lesson catalog (~4.6 MB) is dynamically imported rather than a top-level `import`,
  // so a visitor's first paint (home screen, no course content needed there) never waits on it.
  // Kicked off right after mount — not gated on the user navigating into "الدروس" — so it's very
  // likely already resolved by the time they actually get there; courseSelectionView/
  // ActiveWorkspace show a loading state below for the rare case it isn't yet.
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

  const visibleCourseSubjects = COURSE_SUBJECTS_LIST.filter((s) => isToolAvailableForGrade(s, nav.grade) && isSubjectVisible(s));
  const availableLabsForGrade = INTERACTIVE_LABS_LIST.filter((tool) => isToolAvailableForGrade(tool, nav.grade) && isSubjectVisible(tool));
  const currentLessons = (coursesData ?? []).filter(
    (l) => l.subject === nav.selectedSubject &&
      (l.grade === nav.grade || nav.selectedSubject === 'soroban') &&
      (selectedTrimester === 'all' || l.trimester === selectedTrimester)
  );

  const openAiTutor = () => {
    if (!authUser) {
      modals.openAuth('login');
      return;
    }
    modals.setIsAiModalOpen(true);
  };

  /** Ouvre un lab en plein écran (catalogue fermé). */
  const openLabFocused = (toolId: SubjectId) => {
    setLabsCatalogOpen(false);
    nav.openLab(toolId);
  };

  /** Onglet / pôle « المختبرات » → liste des labs, pas un lab auto. */
  const openLabsCatalog = () => {
    setLabsCatalogOpen(true);
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
      <Suspense fallback={<LoadingFallback label={t('navigation', 'loadingPreschool')} minHeight="100vh" />}>
        <PreschoolApp onExit={() => { nav.setIsPreschoolActive(false); nav.goHome(); }} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen font-sans antialiased selection:bg-purple-500 selection:text-white pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-8 transition-colors duration-300 bg-[var(--app-bg)] text-[var(--app-text)]" dir={direction}>
      <SeoHead />
      <PwaInstallBanner />

      <Navbar
        currentGrade={nav.grade}
        onGradeChange={(g) => {
          nav.handleGradeChange(g);
          if (authUser) AuthService.updateGrade(g);
        }}
        userProfile={progress.userProfile}
        authUser={authUser}
        onOpenAuthModal={() => modals.openAuth('login')}
        onLogout={() => {
          AuthService.logout();
          progress.handleLogoutProgressReset(nav.grade);
        }}
        onOpenAiTutor={openAiTutor}
        onOpenProfileModal={() => modals.setIsProfileModalOpen(true)}
        onOpenContactModal={() => modals.setIsContactModalOpen(true)}
        /* Web-only marketing preview ("here's what the app looks like on a phone") — nonsensical
           inside the native app itself, where the user already is the app. */
        onOpenMobileSimulator={Capacitor.isNativePlatform() ? undefined : () => modals.setIsMobileSimulatorOpen(true)}
        onOpenPrivacyPolicy={() => modals.setIsPrivacyModalOpen(true)}
        onOpenTermsOfService={() => modals.setIsTermsModalOpen(true)}
        onOpenAdminConsole={() => nav.setIsAdminConsoleActive(true)}
        onOpenPreschool={() => nav.setIsPreschoolActive(true)}
        onHomeClick={nav.goHome}
        currentTheme={headerTheme}
        onThemeChange={(t) => {
          setThemeIsManual(true);
          window.localStorage.setItem(THEME_MANUAL_KEY, 'true');
          setHeaderTheme(t);
        }}
        isThemeAuto={!themeIsManual}
        onThemeAuto={handleThemeAuto}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-28 md:pb-6 space-y-6">
        {nav.isHomeActive ? (
          <HomeView
            grade={nav.grade}
            authUser={authUser}
            userName={progress.userProfile.name}
            goldCoins={progress.userProfile.goldCoins || 150}
            onSelectPole={(pole) => {
              nav.handleSelectPole(pole);
              if (pole === 'labs') openLabsCatalog();
            }}
            onOpenAuthModal={() => modals.openAuth('login')}
            onOpenPreschool={() => nav.setIsPreschoolActive(true)}
            onOpenMarket={() => openLabFocused('algerian_market')}
            onOpenWilayas={() => openLabFocused('wilayas_map')}
            onOpenHistoryMuseum={() => openLabFocused('history_museum')}
            onOpenScienceLab={() => openLabFocused('science_lab')}
            onOpenTamazightLab={() => openLabFocused('tamazight_lab')}
            onOpenTamazightCurriculum={() => openLabFocused('tamazight_curriculum')}
            onOpenTouchWriting={() => openLabFocused('touch_writing')}
            onOpenDressingRoom={() => modals.setIsDressingRoomOpen(true)}
            onOpenHomeworkPin={() => modals.setIsHomeworkPinOpen(true)}
            onOpenPrintables={() => modals.setIsPrintablesOpen(true)}
            onOpenOfflinePacks={() => modals.setIsOfflinePacksOpen(true)}
          />
        ) : (
          <>
            <div className="space-y-4">
              {nav.mainCategory === 'labs' ? (
                <ToolsHubView
                  grade={nav.grade}
                  tools={availableLabsForGrade}
                  selectedToolId={nav.selectedSubject}
                  catalogOpen={labsCatalogOpen}
                  onCatalogOpenChange={setLabsCatalogOpen}
                  onSelectTool={nav.handleSelectSubject}
                />
              ) : nav.mainCategory !== 'courses' && (
                <div className="border rounded-3xl p-3 shadow-xs flex items-center gap-2 overflow-x-auto transition-colors duration-300 bg-[var(--app-card-bg)] border-[var(--app-card-border)]">
                  {(nav.mainCategory === 'exams' ? OFFICIAL_EXAMS_LIST : CHALLENGES_TAB_LIST).map((subj) => {
                      const IconComp = ICON_MAP[subj.icon] || BookOpen;
                      const isSelected = nav.selectedSubject === subj.id;
                      const activeClass = nav.mainCategory === 'exams' ? 'bg-[var(--brand-blue)] text-white' : 'bg-[var(--brand-coral)] text-white';
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
              )}
            </div>

            {coursesData === null && nav.mainCategory === 'courses' ? (
              <LoadingFallback label={t('navigation', 'loadingCourses')} minHeight="50vh" />
            ) : nav.mainCategory === 'courses' && !nav.selectedLesson ? (
              <CourseSelectionView
                grade={nav.grade}
                courseSubjects={visibleCourseSubjects}
                allCourseLessons={coursesData ?? []}
                completedLessonIds={progress.userProfile.completedLessonIds}
                onSelectLesson={nav.handleSelectLesson}
                isLessonLocked={isLessonLocked}
                onGoHome={nav.goHome}
              />
            ) : nav.mainCategory === 'labs' && (!isLabSubjectId(nav.selectedSubject) || labsCatalogOpen) ? null : (
              <ActiveWorkspace
                grade={nav.grade}
                selectedSubject={nav.selectedSubject}
                selectedLesson={nav.selectedLesson}
                currentLessons={currentLessons}
                selectedTrimester={selectedTrimester}
                mainCategory={nav.mainCategory}
                headerTheme={headerTheme}
                userProfile={progress.userProfile}
                onSelectLesson={nav.handleSelectLesson}
                onClearLesson={() => nav.setSelectedLesson(null)}
                onBackToCourses={() => {
                  nav.setSelectedLesson(null);
                  nav.setMainCategory('courses');
                }}
                onGoHome={nav.goHome}
                onOpenLab={openLabFocused}
                onCompleteQuiz={progress.handleCompleteQuiz}
                onQuizFullyValidated={progress.handleQuizFullyValidated}
                onExamComplete={progress.handleCompleteExam}
                onChallengeComplete={progress.handleCompleteChallenge}
                onVisitLab={progress.handleVisitLab}
                onLabReward={progress.handleLabReward}
                onEarnCoins={(amount) => progress.handleLabReward(amount, 0)}
                onShowLabCatalog={openLabsCatalog}
              />
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
            <button onClick={openAiTutor} className="hover:text-[var(--brand-amber)] cursor-pointer">
              {t('navigation', 'footerAiTutorLink')}
            </button>
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
        lockedLesson={lockedLesson}
        onCloseLockedLesson={() => setLockedLesson(null)}
        onSelectLesson={nav.handleSelectLesson}
        onRestoreLesson={(lesson) => {
          nav.setGrade(lesson.grade);
          nav.handleSelectLesson(lesson);
        }}
        onStartHomework={(subject) => {
          nav.setMainCategory('courses');
          nav.setSelectedSubject(subject);
          nav.setIsHomeActive(false);
        }}
        onGradeChange={(g) => nav.setGrade(g)}
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
          nav.handleMobileTab(tab);
          if (tab === 'games') openLabsCatalog();
        }}
        onClearSelectedLesson={() => nav.setSelectedLesson(null)}
        onOpenAiTutor={openAiTutor}
        onOpenProfile={() => modals.setIsProfileModalOpen(true)}
        theme={headerTheme}
      />
    </div>
  );
}

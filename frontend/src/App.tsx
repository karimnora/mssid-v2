import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { CourseLesson, SubjectInfo } from './types';
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
import { COURSES_DATA } from './data/coursesData';
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

export default function App() {
  const { authUser } = useAuth();
  const { direction, t } = useLocaleContext();
  const modals = useAppModals();
  const progress = useUserProgress({ authUser });

  const selectedTrimester: number | 'all' = 'all';
  const [lockedLesson, setLockedLesson] = useState<CourseLesson | null>(null);
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

  const visibleCourseSubjects = COURSE_SUBJECTS_LIST.filter((s) => isToolAvailableForGrade(s, nav.grade) && isSubjectVisible(s));
  const availableLabsForGrade = INTERACTIVE_LABS_LIST.filter((tool) => isToolAvailableForGrade(tool, nav.grade) && isSubjectVisible(tool));
  const currentLessons = COURSES_DATA.filter(
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

  if (nav.isAdminConsoleActive) {
    return (
      <Suspense fallback={<LoadingFallback label={t('navigation', 'loadingAdminConsole')} minHeight="100vh" />}>
        <AdminConsoleView onExitAdminConsole={() => nav.setIsAdminConsoleActive(false)} />
      </Suspense>
    );
  }

  if (nav.isPreschoolActive) {
    return (
      <Suspense fallback={<LoadingFallback label={t('navigation', 'loadingPreschool')} minHeight="100vh" />}>
        <PreschoolApp onExit={() => nav.setIsPreschoolActive(false)} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen font-sans antialiased selection:bg-purple-500 selection:text-white pb-20 md:pb-8 transition-colors duration-300 bg-[var(--app-bg)] text-[var(--app-text)]" dir={direction}>
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
        onOpenMobileSimulator={() => modals.setIsMobileSimulatorOpen(true)}
        onOpenPrivacyPolicy={() => modals.setIsPrivacyModalOpen(true)}
        onOpenTermsOfService={() => modals.setIsTermsModalOpen(true)}
        onOpenAdminConsole={() => nav.setIsAdminConsoleActive(true)}
        onOpenPreschool={() => nav.setIsPreschoolActive(true)}
        onHomeClick={nav.goHome}
        currentTheme={headerTheme}
        onThemeChange={(t) => setHeaderTheme(t)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-28 md:pb-6 space-y-6">
        {nav.isHomeActive ? (
          <HomeView
            grade={nav.grade}
            authUser={authUser}
            userName={progress.userProfile.name}
            goldCoins={progress.userProfile.goldCoins || 150}
            onSelectPole={nav.handleSelectPole}
            onOpenAuthModal={() => modals.openAuth('login')}
            onOpenPreschool={() => nav.setIsPreschoolActive(true)}
            onOpenMarket={() => nav.openLab('algerian_market')}
            onOpenWilayas={() => nav.openLab('wilayas_map')}
            onOpenHistoryMuseum={() => nav.openLab('history_museum')}
            onOpenScienceLab={() => nav.openLab('science_lab')}
            onOpenTamazightLab={() => nav.openLab('tamazight_lab')}
            onOpenTamazightCurriculum={() => nav.openLab('tamazight_curriculum')}
            onOpenTouchWriting={() => nav.openLab('touch_writing')}
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

            {nav.mainCategory === 'courses' && !nav.selectedLesson ? (
              <CourseSelectionView
                grade={nav.grade}
                courseSubjects={visibleCourseSubjects}
                allCourseLessons={COURSES_DATA}
                completedLessonIds={progress.userProfile.completedLessonIds}
                onSelectLesson={nav.handleSelectLesson}
                isLessonLocked={isLessonLocked}
                onGoHome={nav.goHome}
              />
            ) : (
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
                onOpenLab={nav.openLab}
                onCompleteQuiz={progress.handleCompleteQuiz}
                onQuizFullyValidated={progress.handleQuizFullyValidated}
                onExamComplete={progress.handleCompleteExam}
                onChallengeComplete={progress.handleCompleteChallenge}
                onGameComplete={progress.handleCompleteGame}
                onVisitLab={progress.handleVisitLab}
                onLabReward={progress.handleLabReward}
                onEarnCoins={(amount) => progress.handleLabReward(amount, 0)}
              />
            )}
          </>
        )}
      </main>

      <footer className="py-6 mt-12 transition-colors duration-300 bg-[var(--app-footer-bg)] border-t border-[var(--app-card-border)] text-[var(--app-text-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--app-text)]">{t('navigation', 'footerBrandName')}</span>
            <span className="opacity-75">{t('navigation', 'footerCurriculumLine')}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={openAiTutor} className="hover:text-[var(--brand-amber)] cursor-pointer">
              {t('navigation', 'footerAiTutorLink')}
            </button>
            <button onClick={() => modals.setIsContactModalOpen(true)} className="hover:text-[var(--brand-emerald)] cursor-pointer">
              {t('navigation', 'contactUs')}
            </button>
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
        onSelectTab={nav.handleMobileTab}
        onClearSelectedLesson={() => nav.setSelectedLesson(null)}
        onOpenAiTutor={openAiTutor}
        onOpenProfile={() => modals.setIsProfileModalOpen(true)}
        theme={headerTheme}
      />
    </div>
  );
}

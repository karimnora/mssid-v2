import { useCallback, useEffect, useRef, useState } from 'react';
import { useActivityExit } from '../context/ActivityExitContext';
import { CourseLesson, PrimaryGrade, SubjectId } from '../types';
import {
  CHALLENGES_TAB_LIST,
  COURSE_SUBJECTS_LIST,
  INTERACTIVE_LABS_LIST,
  OFFICIAL_EXAMS_LIST,
  isToolAvailableForGrade,
} from '../data/subjectsData';
import { HomePoleId } from '../components/HomeView';
import {
  AppView,
  MainCategory,
  MobileTab,
  VALID_GRADES,
  isValidGrade,
  mobileTabForView,
  parseAppLocation,
  persistGrade,
  readStoredGrade,
  toAppHref,
  viewFromNavState,
} from '../navigation/appLocation';

export type { MainCategory, MobileTab };

/** First lab shown when opening the pole — must exist at that grade (conjugueur = 3AP+). */
export function defaultLabForGrade(grade: PrimaryGrade): SubjectId {
  if (grade === '1AP' || grade === '2AP') return 'primary_math_ops';
  return 'arabic_conjugator';
}

/** Same labs entry as 3AP–5AP: open a grade-safe lab (conjugueur stays 3AP+). */
export function labsEntrySubjectForGrade(grade: PrimaryGrade): SubjectId {
  return defaultLabForGrade(grade);
}

function labAvailableForGrade(toolId: SubjectId, grade: PrimaryGrade): boolean {
  const tool = INTERACTIVE_LABS_LIST.find((item) => item.id === toolId);
  return Boolean(tool && isToolAvailableForGrade(tool, grade));
}

function labOrFallback(toolId: SubjectId | undefined, grade: PrimaryGrade): SubjectId {
  if (toolId && labAvailableForGrade(toolId, grade)) return toolId;
  return labsEntrySubjectForGrade(grade);
}

type HistoryNavState = {
  mssidHistoryIndex?: number;
  isHomeActive: boolean;
  mainCategory: MainCategory;
  selectedSubject: SubjectId;
  selectedLessonId: string | null;
  isPreschoolActive: boolean;
  isAdminConsoleActive: boolean;
  grade: PrimaryGrade;
  labsCatalogOpen: boolean;
};

function readBootLocation(): { view: AppView; grade: PrimaryGrade } {
  if (typeof window === 'undefined') {
    return { view: { name: 'home' }, grade: '1AP' };
  }
  const parsed = parseAppLocation(window.location.pathname, window.location.search);
  return { view: parsed.view, grade: parsed.grade ?? readStoredGrade() ?? '1AP' };
}

// Dynamically imported (not a top-level `import`) so the ~4.6 MB lesson catalog isn't part of the
// bundle every visitor has to load before first paint just to support the rare case of opening the
// app on a deep link straight into one lesson, or restoring one via browser back/forward.
async function lessonFromId(lessonId: string | null): Promise<CourseLesson | null> {
  if (!lessonId) return null;
  const { COURSES_DATA } = await import('../data/coursesData');
  return COURSES_DATA.find((item) => item.id === lessonId) ?? null;
}

export function useAppNavigation(options: {
  isLessonLocked: (lesson: CourseLesson) => boolean;
  accountGrade?: string;
  onLessonLocked?: (lesson: CourseLesson) => void;
  /** No account yet: browsing stays open, but only a couple of labs are actually openable —
      everything else (other labs, all exams, all challenges) redirects to onGuestBlocked. */
  isGuest?: boolean;
  isLabFreeForGuest?: (toolId: SubjectId) => boolean;
  onGuestBlocked?: () => void;
}) {
  const exitGuard = useActivityExit();
  const guarded = <Args extends unknown[]>(action: (...args: Args) => void) =>
    (...args: Args) => exitGuard.requestLeave(() => action(...args));
  const historyIndexRef = useRef<number>(window.history.state?.mssidHistoryIndex ?? 0);
  const restoringHistoryRef = useRef<(() => void) | null>(null);
  const approvedHistoryRef = useRef(false);
  const {
    isLessonLocked,
    accountGrade,
    onLessonLocked,
    isGuest = false,
    isLabFreeForGuest = () => false,
    onGuestBlocked,
  } = options;
  const boot = readBootLocation();

  const [grade, setGrade] = useState<PrimaryGrade>(boot.grade);
  // Booting straight onto a lesson deep link starts on the 'math' placeholder subject and no
  // selected lesson — see the effect below, which resolves the real lesson asynchronously (the
  // catalog lookup it needs is now a dynamic import, not part of the initial bundle).
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(() => {
    if (boot.view.name === 'labs') return labOrFallback(boot.view.toolId, boot.grade);
    if (boot.view.name === 'exams') return 'exams';
    if (boot.view.name === 'challenges') return 'challenges';
    return 'math';
  });
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [mainCategory, setMainCategory] = useState<MainCategory>(() => {
    if (boot.view.name === 'labs') return 'labs';
    if (boot.view.name === 'exams') return 'exams';
    if (boot.view.name === 'challenges') return 'challenges';
    return 'courses';
  });
  const [isHomeActive, setIsHomeActive] = useState(boot.view.name === 'home');
  const [isAdminConsoleActive, setIsAdminConsoleActive] = useState(boot.view.name === 'admin');
  const [isPreschoolActive, setIsPreschoolActive] = useState(boot.view.name === 'eveil');
  // P0 labs: catalog hidden as long as a lab is open (1 card = 1 screen). Tracked here (not as a
  // plain App.tsx useState) and pushed/restored alongside the rest of HistoryNavState below — it
  // used to live outside the history-tracked state entirely, so browser/hardware back navigation
  // would restore selectedSubject correctly but leave this stuck on its last value, landing the
  // user back inside some lab instead of the catalog they came from.
  const [labsCatalogOpen, setLabsCatalogOpen] = useState(false);

  const skipNextPushRef = useRef(true);
  const replaceNextNavigationRef = useRef(false);
  const lastPathRef = useRef(typeof window !== 'undefined' ? window.location.pathname : '/');
  const isLessonLockedRef = useRef(isLessonLocked);
  isLessonLockedRef.current = isLessonLocked;

  // Resolves a boot-time lesson deep link once the catalog's dynamic import lands — runs once,
  // after first paint, so opening the app on a shared lesson link briefly shows the default view
  // before snapping to the right lesson instead of blocking the initial render on it.
  useEffect(() => {
    if (boot.view.name !== 'lesson') return;
    let cancelled = false;
    lessonFromId(boot.view.lessonId).then((lesson) => {
      if (cancelled || !lesson || isLessonLockedRef.current(lesson)) return;
      setSelectedSubject(lesson.subject);
      setSelectedLesson(lesson);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (accountGrade && isValidGrade(accountGrade)) {
      setGrade(accountGrade);
      persistGrade(accountGrade);
    }
  }, [accountGrade]);

  const applyHistoryState = useCallback((state: HistoryNavState | null) => {
    skipNextPushRef.current = true;
    if (!state) {
      setIsHomeActive(true);
      setSelectedLesson(null);
      setIsPreschoolActive(false);
      setIsAdminConsoleActive(false);
      setLabsCatalogOpen(false);
      return;
    }
    setIsPreschoolActive(Boolean(state.isPreschoolActive));
    setIsAdminConsoleActive(Boolean(state.isAdminConsoleActive));
    setIsHomeActive(state.isHomeActive !== undefined ? state.isHomeActive : true);
    setLabsCatalogOpen(Boolean(state.labsCatalogOpen));
    if (state.mainCategory) setMainCategory(state.mainCategory);
    if (state.selectedSubject) setSelectedSubject(state.selectedSubject);
    if (state.grade && isValidGrade(state.grade)) setGrade(state.grade);
    if (state.selectedLessonId) {
      lessonFromId(state.selectedLessonId).then((lesson) => {
        setSelectedLesson(lesson && !isLessonLockedRef.current(lesson) ? lesson : null);
      });
    } else {
      setSelectedLesson(null);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (restoringHistoryRef.current) {
        const afterRestore = restoringHistoryRef.current;
        restoringHistoryRef.current = null;
        afterRestore();
        return;
      }
      const state = (event.state as HistoryNavState | null) ?? null;
      const nextIndex = state?.mssidHistoryIndex ?? historyIndexRef.current - 1;
      if (!approvedHistoryRef.current && exitGuard.hasPendingWork()) {
        const delta = historyIndexRef.current - nextIndex;
        if (delta !== 0) {
          // Restore the current entry before asking, so Continue preserves both screen and URL.
          restoringHistoryRef.current = () => exitGuard.requestLeave(() => {
            approvedHistoryRef.current = true;
            window.history.go(-delta);
          });
          window.history.go(delta);
          return;
        }
      }
      approvedHistoryRef.current = false;
      historyIndexRef.current = nextIndex;
      applyHistoryState(state);
    };
    const allowNativeHistory = () => { approvedHistoryRef.current = true; };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('mssid:allow-history-once', allowNativeHistory);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('mssid:allow-history-once', allowNativeHistory);
    };
  }, [applyHistoryState, exitGuard]);

  useEffect(() => {
    const view = viewFromNavState({
      isAdminConsoleActive,
      isPreschoolActive,
      isHomeActive,
      selectedLessonId: selectedLesson?.id ?? null,
      mainCategory,
      selectedSubject,
    });
    const href = toAppHref(view, grade);
    const historyState: HistoryNavState = {
      mssidHistoryIndex: historyIndexRef.current,
      isHomeActive,
      mainCategory,
      selectedSubject,
      selectedLessonId: selectedLesson?.id ?? null,
      isPreschoolActive,
      isAdminConsoleActive,
      grade,
      labsCatalogOpen,
    };

    if (skipNextPushRef.current) {
      skipNextPushRef.current = false;
      window.history.replaceState(historyState, '', href);
      lastPathRef.current = view.name === 'home' ? '/' : href.split('?')[0];
      return;
    }

    const nextPath = href.split('?')[0];
    const pathChanged = nextPath !== lastPathRef.current;
    lastPathRef.current = nextPath;
    if (replaceNextNavigationRef.current) {
      replaceNextNavigationRef.current = false;
      window.history.replaceState(historyState, '', href);
    } else if (pathChanged) {
      historyIndexRef.current += 1;
      historyState.mssidHistoryIndex = historyIndexRef.current;
      window.history.pushState(historyState, '', href);
    } else {
      window.history.replaceState(historyState, '', href);
    }
  }, [
    isHomeActive,
    mainCategory,
    selectedSubject,
    selectedLesson?.id,
    isPreschoolActive,
    isAdminConsoleActive,
    grade,
    labsCatalogOpen,
  ]);

  const handleSelectSubject = (subject: SubjectId) => {
    if (isGuest) {
      const isLab = INTERACTIVE_LABS_LIST.some((s) => s.id === subject);
      const isExam = OFFICIAL_EXAMS_LIST.some((s) => s.id === subject);
      const isChallenge = CHALLENGES_TAB_LIST.some((s) => s.id === subject);
      if ((isLab && !isLabFreeForGuest(subject)) || isExam || isChallenge) {
        onGuestBlocked?.();
        return;
      }
    }
    setSelectedSubject(subject);
    setSelectedLesson(null);
    if (INTERACTIVE_LABS_LIST.some((s) => s.id === subject)) {
      setMainCategory('labs');
      setIsHomeActive(false);
    } else if (OFFICIAL_EXAMS_LIST.some((s) => s.id === subject)) {
      setMainCategory('exams');
      setIsHomeActive(false);
    } else if (CHALLENGES_TAB_LIST.some((s) => s.id === subject)) {
      setMainCategory('challenges');
      setIsHomeActive(false);
    } else {
      setMainCategory('courses');
      setIsHomeActive(false);
    }
  };

  const handleMobileTab = (tab: MobileTab) => {
    if (isGuest && tab === 'exercises') {
      onGuestBlocked?.();
      return;
    }
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
      setSelectedSubject(labsEntrySubjectForGrade(grade));
    }
  };

  const handleSelectPole = (pole: HomePoleId) => {
    if (isGuest && (pole === 'exams' || pole === 'challenges')) {
      onGuestBlocked?.();
      return;
    }
    setMainCategory(pole);
    setIsHomeActive(false);
    setSelectedLesson(null);
    if (pole === 'courses' && !COURSE_SUBJECTS_LIST.some((s) => s.id === selectedSubject)) {
      setSelectedSubject('math');
    } else if (pole === 'labs') {
      setSelectedSubject(labsEntrySubjectForGrade(grade));
    } else if (pole === 'exams') {
      setSelectedSubject('exams');
    } else if (pole === 'challenges') {
      setSelectedSubject('challenges');
    }
  };

  const handleSelectLesson = (lesson: CourseLesson) => {
    if (isLessonLocked(lesson)) {
      onLessonLocked?.(lesson);
      return;
    }
    setSelectedSubject(lesson.subject);
    setSelectedLesson(lesson);
    setMainCategory('courses');
    setIsHomeActive(false);
  };

  const goHome = () => {
    setSelectedLesson(null);
    setIsHomeActive(true);
  };

  /** Return to the parent screen even when the app was opened directly on a lesson URL. */
  const goBack = () => {
    replaceNextNavigationRef.current = true;
    if (selectedLesson) {
      setSelectedLesson(null);
    } else if (mainCategory === 'labs' && !labsCatalogOpen) {
      setLabsCatalogOpen(true);
    } else {
      goHome();
    }
  };

  const openLab = (toolId: SubjectId) => {
    if (isGuest && !isLabFreeForGuest(toolId)) {
      onGuestBlocked?.();
      return;
    }
    setMainCategory('labs');
    setSelectedSubject(toolId);
    setSelectedLesson(null);
    setIsHomeActive(false);
  };

  const handleGradeChange = (next: PrimaryGrade) => {
    setGrade(next);
    persistGrade(next);
    setSelectedLesson(null);
    const currentTool = INTERACTIVE_LABS_LIST.find((s) => s.id === selectedSubject);
    if (currentTool && !isToolAvailableForGrade(currentTool, next)) {
      setSelectedSubject(labsEntrySubjectForGrade(next));
    }
  };

  const mobileTab = mobileTabForView(
    viewFromNavState({
      isAdminConsoleActive,
      isPreschoolActive,
      isHomeActive,
      selectedLessonId: selectedLesson?.id ?? null,
      mainCategory,
      selectedSubject,
    }),
  );

  return {
    grade,
    setGrade: guarded(setGrade),
    handleGradeChange: guarded(handleGradeChange),
    selectedSubject,
    setSelectedSubject: guarded(setSelectedSubject),
    selectedLesson,
    setSelectedLesson: guarded(setSelectedLesson),
    mainCategory,
    setMainCategory: guarded(setMainCategory),
    mobileTab,
    isHomeActive,
    setIsHomeActive: guarded(setIsHomeActive),
    isAdminConsoleActive,
    setIsAdminConsoleActive: guarded(setIsAdminConsoleActive),
    isPreschoolActive,
    setIsPreschoolActive: guarded(setIsPreschoolActive),
    labsCatalogOpen,
    setLabsCatalogOpen: guarded(setLabsCatalogOpen),
    handleSelectSubject: guarded(handleSelectSubject),
    handleMobileTab: guarded(handleMobileTab),
    handleSelectPole: guarded(handleSelectPole),
    handleSelectLesson: guarded(handleSelectLesson),
    goHome: guarded(goHome),
    goBack: guarded(goBack),
    openLab: guarded(openLab),
    validGrades: VALID_GRADES,
  };
}

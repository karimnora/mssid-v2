import { useCallback, useEffect, useRef, useState } from 'react';
import { CourseLesson, PrimaryGrade, SubjectId } from '../types';
import { COURSES_DATA } from '../data/coursesData';
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
  isHomeActive: boolean;
  mainCategory: MainCategory;
  selectedSubject: SubjectId;
  selectedLessonId: string | null;
  isPreschoolActive: boolean;
  isAdminConsoleActive: boolean;
  grade: PrimaryGrade;
};

function readBootLocation(): { view: AppView; grade: PrimaryGrade } {
  if (typeof window === 'undefined') {
    return { view: { name: 'home' }, grade: '5AP' };
  }
  const parsed = parseAppLocation(window.location.pathname, window.location.search);
  return { view: parsed.view, grade: parsed.grade ?? '5AP' };
}

function lessonFromId(lessonId: string | null): CourseLesson | null {
  if (!lessonId) return null;
  return COURSES_DATA.find((item) => item.id === lessonId) ?? null;
}

export function useAppNavigation(options: {
  isLessonLocked: (lesson: CourseLesson) => boolean;
  accountGrade?: string;
  onLessonLocked?: (lesson: CourseLesson) => void;
}) {
  const { isLessonLocked, accountGrade, onLessonLocked } = options;
  const boot = readBootLocation();

  const [grade, setGrade] = useState<PrimaryGrade>(boot.grade);
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(() => {
    if (boot.view.name === 'labs') return labOrFallback(boot.view.toolId, boot.grade);
    if (boot.view.name === 'exams') return 'exams';
    if (boot.view.name === 'challenges') return 'challenges';
    if (boot.view.name === 'lesson') {
      return lessonFromId(boot.view.lessonId)?.subject ?? 'math';
    }
    return 'math';
  });
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(() => {
    if (boot.view.name !== 'lesson') return null;
    const lesson = lessonFromId(boot.view.lessonId);
    return lesson && !isLessonLocked(lesson) ? lesson : null;
  });
  const [mainCategory, setMainCategory] = useState<MainCategory>(() => {
    if (boot.view.name === 'labs') return 'labs';
    if (boot.view.name === 'exams') return 'exams';
    if (boot.view.name === 'challenges') return 'challenges';
    return 'courses';
  });
  const [mobileTab, setMobileTab] = useState<MobileTab>(() => mobileTabForView(boot.view));
  const [isHomeActive, setIsHomeActive] = useState(boot.view.name === 'home');
  const [isAdminConsoleActive, setIsAdminConsoleActive] = useState(boot.view.name === 'admin');
  const [isPreschoolActive, setIsPreschoolActive] = useState(boot.view.name === 'eveil');

  const skipNextPushRef = useRef(true);
  const lastPathRef = useRef(typeof window !== 'undefined' ? window.location.pathname : '/');
  const isLessonLockedRef = useRef(isLessonLocked);
  isLessonLockedRef.current = isLessonLocked;

  useEffect(() => {
    if (accountGrade && isValidGrade(accountGrade)) {
      setGrade(accountGrade);
    }
  }, [accountGrade]);

  const applyHistoryState = useCallback((state: HistoryNavState | null) => {
    skipNextPushRef.current = true;
    if (!state) {
      setIsHomeActive(true);
      setSelectedLesson(null);
      setIsPreschoolActive(false);
      setIsAdminConsoleActive(false);
      setMobileTab('home');
      return;
    }
    setIsPreschoolActive(Boolean(state.isPreschoolActive));
    setIsAdminConsoleActive(Boolean(state.isAdminConsoleActive));
    setIsHomeActive(state.isHomeActive !== undefined ? state.isHomeActive : true);
    if (state.mainCategory) setMainCategory(state.mainCategory);
    if (state.selectedSubject) setSelectedSubject(state.selectedSubject);
    if (state.grade && isValidGrade(state.grade)) setGrade(state.grade);
    if (state.selectedLessonId) {
      const lesson = lessonFromId(state.selectedLessonId);
      setSelectedLesson(lesson && !isLessonLockedRef.current(lesson) ? lesson : null);
    } else {
      setSelectedLesson(null);
    }
    const view = viewFromNavState({
      isAdminConsoleActive: Boolean(state.isAdminConsoleActive),
      isPreschoolActive: Boolean(state.isPreschoolActive),
      isHomeActive: state.isHomeActive !== undefined ? state.isHomeActive : true,
      selectedLessonId: state.selectedLessonId,
      mainCategory: state.mainCategory ?? 'courses',
      selectedSubject: state.selectedSubject ?? 'math',
    });
    setMobileTab(mobileTabForView(view));
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      applyHistoryState((event.state as HistoryNavState | null) ?? null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applyHistoryState]);

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
      isHomeActive,
      mainCategory,
      selectedSubject,
      selectedLessonId: selectedLesson?.id ?? null,
      isPreschoolActive,
      isAdminConsoleActive,
      grade,
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
    if (pathChanged) {
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
  ]);

  const handleSelectSubject = (subject: SubjectId) => {
    setSelectedSubject(subject);
    setSelectedLesson(null);
    if (INTERACTIVE_LABS_LIST.some((s) => s.id === subject)) {
      setMainCategory('labs');
      setMobileTab('games');
      setIsHomeActive(false);
    } else if (OFFICIAL_EXAMS_LIST.some((s) => s.id === subject)) {
      setMainCategory('exams');
      setMobileTab('exercises');
      setIsHomeActive(false);
    } else if (CHALLENGES_TAB_LIST.some((s) => s.id === subject)) {
      setMainCategory('challenges');
      setMobileTab('exercises');
      setIsHomeActive(false);
    } else {
      setMainCategory('courses');
      setMobileTab('courses');
      setIsHomeActive(false);
    }
  };

  const handleMobileTab = (tab: MobileTab) => {
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
      setSelectedSubject(labsEntrySubjectForGrade(grade));
    }
  };

  const handleSelectPole = (pole: HomePoleId) => {
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
    setMobileTab('courses');
  };

  const goHome = () => {
    setSelectedLesson(null);
    setIsHomeActive(true);
    setMobileTab('home');
  };

  const openLab = (toolId: SubjectId) => {
    setMainCategory('labs');
    setSelectedSubject(toolId);
    setSelectedLesson(null);
    setIsHomeActive(false);
    setMobileTab('games');
  };

  const handleGradeChange = (next: PrimaryGrade) => {
    setGrade(next);
    setSelectedLesson(null);
    const currentTool = INTERACTIVE_LABS_LIST.find((s) => s.id === selectedSubject);
    if (currentTool && !isToolAvailableForGrade(currentTool, next)) {
      setSelectedSubject(labsEntrySubjectForGrade(next));
    }
  };

  return {
    grade,
    setGrade,
    handleGradeChange,
    selectedSubject,
    setSelectedSubject,
    selectedLesson,
    setSelectedLesson,
    mainCategory,
    setMainCategory,
    mobileTab,
    isHomeActive,
    setIsHomeActive,
    isAdminConsoleActive,
    setIsAdminConsoleActive,
    isPreschoolActive,
    setIsPreschoolActive,
    handleSelectSubject,
    handleMobileTab,
    handleSelectPole,
    handleSelectLesson,
    goHome,
    openLab,
    validGrades: VALID_GRADES,
  };
}

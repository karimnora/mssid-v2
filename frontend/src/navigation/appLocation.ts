import { PrimaryGrade, SubjectId } from '../types';
import { INTERACTIVE_LABS_LIST } from '../data/subjectsData';

export const VALID_GRADES: PrimaryGrade[] = ['1AP', '2AP', '3AP', '4AP', '5AP'];

/** Last grade the visitor picked — used when the URL has no `?g=` so a guest never boots on 5AP. */
export const GRADE_STORAGE_KEY = 'mssid_grade';

export function readStoredGrade(): PrimaryGrade | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = window.localStorage.getItem(GRADE_STORAGE_KEY);
    return isValidGrade(saved) ? saved : null;
  } catch {
    return null;
  }
}

export function persistGrade(grade: PrimaryGrade): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(GRADE_STORAGE_KEY, grade);
  } catch {
    // Quota / private mode — navigation still works from URL and in-memory state.
  }
}

const LAB_IDS = new Set<string>(INTERACTIVE_LABS_LIST.map((lab) => lab.id));

/** Safe lesson-id pattern — matches the server ProgressGuard allow-list. */
const LESSON_ID_RE = /^[a-z0-9][a-z0-9_-]{0,80}$/;

export type AppView =
  | { name: 'home' }
  | { name: 'eveil' }
  | { name: 'admin' }
  | { name: 'courses' }
  | { name: 'lesson'; lessonId: string }
  | { name: 'labs'; toolId?: SubjectId }
  | { name: 'exams' }
  | { name: 'challenges' };

export type MainCategory = 'courses' | 'labs' | 'exams' | 'challenges';
export type MobileTab = 'home' | 'courses' | 'exercises' | 'games';

export type ParsedAppLocation = {
  view: AppView;
  grade: PrimaryGrade | null;
};

export function isValidGrade(value: string | null | undefined): value is PrimaryGrade {
  return !!value && (VALID_GRADES as string[]).includes(value);
}

export function isLabSubjectId(value: string): value is SubjectId {
  return LAB_IDS.has(value);
}

export function isSafeLessonId(value: string): boolean {
  return LESSON_ID_RE.test(value);
}

/**
 * Reads the current browser location into a typed view.
 * Unknown paths fall back to home so a stale bookmark never blank-screens the app.
 */
export function parseAppLocation(pathname: string, search = ''): ParsedAppLocation {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const rawGrade = params.get('g');
  const grade = isValidGrade(rawGrade) ? rawGrade : null;

  const parts = pathname.split('/').filter(Boolean);
  const head = parts[0];

  if (!head) return { view: { name: 'home' }, grade };
  if (head === 'eveil' || head === 'preschool' || head === 'creche') {
    return { view: { name: 'eveil' }, grade };
  }
  if (head === 'admin') return { view: { name: 'admin' }, grade };
  if (head === 'courses') return { view: { name: 'courses' }, grade };
  if (head === 'exams' || head === 'assess') return { view: { name: 'exams' }, grade };
  if (head === 'challenges') return { view: { name: 'challenges' }, grade };

  if (head === 'lesson') {
    const lessonId = parts[1];
    if (lessonId && isSafeLessonId(lessonId)) {
      return { view: { name: 'lesson', lessonId }, grade };
    }
    return { view: { name: 'courses' }, grade };
  }

  if (head === 'labs') {
    const toolId = parts[1];
    if (toolId && isLabSubjectId(toolId)) {
      return { view: { name: 'labs', toolId }, grade };
    }
    return { view: { name: 'labs' }, grade };
  }

  return { view: { name: 'home' }, grade };
}

export function serializeAppLocation(view: AppView, grade: PrimaryGrade): { pathname: string; search: string } {
  let pathname = '/';
  switch (view.name) {
    case 'home':
      pathname = '/';
      break;
    case 'eveil':
      pathname = '/eveil';
      break;
    case 'admin':
      pathname = '/admin';
      break;
    case 'courses':
      pathname = '/courses';
      break;
    case 'exams':
      pathname = '/exams';
      break;
    case 'challenges':
      pathname = '/challenges';
      break;
    case 'lesson':
      pathname = `/lesson/${view.lessonId}`;
      break;
    case 'labs':
      pathname = view.toolId ? `/labs/${view.toolId}` : '/labs';
      break;
  }
  return { pathname, search: `?g=${grade}` };
}

export function toAppHref(view: AppView, grade: PrimaryGrade): string {
  const { pathname, search } = serializeAppLocation(view, grade);
  return `${pathname}${search}`;
}

export function viewFromNavState(state: {
  isAdminConsoleActive: boolean;
  isPreschoolActive: boolean;
  isHomeActive: boolean;
  selectedLessonId: string | null;
  mainCategory: MainCategory;
  selectedSubject: SubjectId;
}): AppView {
  if (state.isAdminConsoleActive) return { name: 'admin' };
  if (state.isPreschoolActive) return { name: 'eveil' };
  if (state.isHomeActive) return { name: 'home' };
  if (state.selectedLessonId) return { name: 'lesson', lessonId: state.selectedLessonId };
  if (state.mainCategory === 'labs') {
    return isLabSubjectId(state.selectedSubject)
      ? { name: 'labs', toolId: state.selectedSubject }
      : { name: 'labs' };
  }
  if (state.mainCategory === 'exams') return { name: 'exams' };
  if (state.mainCategory === 'challenges') return { name: 'challenges' };
  return { name: 'courses' };
}

export function mobileTabForView(view: AppView): MobileTab {
  switch (view.name) {
    case 'home':
    case 'eveil':
    case 'admin':
      return 'home';
    case 'courses':
    case 'lesson':
      return 'courses';
    case 'exams':
    case 'challenges':
      return 'exercises';
    case 'labs':
      return 'games';
  }
}

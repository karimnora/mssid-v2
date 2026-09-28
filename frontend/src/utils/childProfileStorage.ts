import { isValidGrade, type PrimaryGrade } from '../navigation/appLocation';

export const GUEST_PROFILE_KEY = 'mssid_user_profile';
export const ACTIVE_CHILD_KEY = 'mssid_active_child_id';

export type ChildGrade = PrimaryGrade | 'PRESCHOOL';

export interface ChildProfile {
  id: number;
  displayName: string;
  grade: string;
  avatar?: string | null;
}

export type ChildSelection =
  | { type: 'child'; id: number }
  | { type: 'account' };

export function profileStorageKey(childId: number | null | undefined): string {
  return childId == null ? GUEST_PROFILE_KEY : `mssid_user_profile_child_${childId}`;
}

export function primaryGradeForChild(grade: string): PrimaryGrade {
  return isValidGrade(grade) ? grade : '1AP';
}

export function isPreschoolGrade(grade: string): boolean {
  return grade === 'PRESCHOOL';
}

export function readChildSelection(): ChildSelection | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ACTIVE_CHILD_KEY);
    if (!raw) return null;
    if (raw === 'account') return { type: 'account' };
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? { type: 'child', id } : null;
  } catch {
    return null;
  }
}

export function persistChildSelection(selection: ChildSelection | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (selection == null) {
      window.localStorage.removeItem(ACTIVE_CHILD_KEY);
      return;
    }
    window.localStorage.setItem(
      ACTIVE_CHILD_KEY,
      selection.type === 'account' ? 'account' : String(selection.id),
    );
  } catch {
    // private mode
  }
}

export function clearChildSelection(): void {
  persistChildSelection(null);
}

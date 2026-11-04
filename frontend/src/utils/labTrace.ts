import { useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import type { PrimaryGrade } from '../types';
import { familyStorageKey, type TaskOutcome } from './familyLearning';
import { getActiveProgressOwner } from './progressOwner';
import { labResultId, type ImmersiveLabId } from '../data/immersive/labTraceCatalog';

export { LAB_TRACE, labResultId, immersiveResultIds, immersiveResultLabels, type ImmersiveLabId } from '../data/immersive/labTraceCatalog';

/**
 * Immersive labs → parent notebook (V2). Every lab follows the same loop: Didou explains, the child
 * acts, a mistake is explained, the child tries again, and the LAST try of each activity is kept as
 * an observation in the family results (« آخر 7 أيام » of FamilyParentSummary, synced across devices
 * by useLearningSnapshot). A miss records « to review »; the success that follows records « with
 * help »; a first-try success records « alone ». Never a grade — the same wording as the workshops.
 */
const SNAPSHOT_EVENT = 'mssid-learning-snapshot';

/** Writes one observation next to the others of the family scope, then lets the sync pick it up. */
export function recordLabOutcome(owner: string, grade: PrimaryGrade, id: string, outcome: TaskOutcome, at = new Date().toISOString()) {
  const key = familyStorageKey(owner, grade);
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? '{}');
    const all = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, { completedAt?: string }>) : {};
    const firstDone = all[id]?.completedAt;
    const completedAt = firstDone ?? (outcome === 'review' ? undefined : at);
    all[id] = { outcome, at, ...(completedAt ? { completedAt } : {}) } as never;
    window.localStorage.setItem(key, JSON.stringify(all));
  } catch {
    return; // private mode: nothing to keep
  }
  window.dispatchEvent(new CustomEvent(SNAPSHOT_EVENT, { detail: key }));
}

/** Same owner rule as FamilyParentSummary: the active child of this account, else the account. */
export function familyOwner(accountId: number | undefined): string {
  const account = accountId !== undefined ? `user:${accountId}` : 'guest';
  const active = getActiveProgressOwner();
  return active === account || active.startsWith(`${account}:child:`) ? active : account;
}

export function useLabTrace(lab: ImmersiveLabId, grade: PrimaryGrade) {
  const { authUser } = useAuth();
  const accountId = authUser?.id;
  // Activities missed since their last success, during this visit of the lab.
  const missed = useRef(new Set<string>());
  return useMemo(() => {
    const write = (activity: string, outcome: TaskOutcome) => recordLabOutcome(familyOwner(accountId), grade, labResultId(lab, activity), outcome);
    return {
      miss(activity: string) {
        if (missed.current.has(activity)) return;
        missed.current.add(activity);
        write(activity, 'review');
      },
      success(activity: string) {
        const helped = missed.current.delete(activity);
        write(activity, helped ? 'helped' : 'independent');
      },
    };
  }, [accountId, grade, lab]);
}

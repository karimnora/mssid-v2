import { progressStorage } from '../../utils/ownerStorage';
import type { ParentNotebookRow } from '../../utils/competenceProgress';

export interface CemCheck {
  promptAr: string;
  choices: string[];
  correctIndex: number;
  competenceId?: string;
}

export interface CemPaperExercise {
  titleAr: string;
  points: number;
  contentAr: string;
  solutionAr: string;
  operationsAr?: string;
  check: CemCheck;
}

export interface CemPaper {
  id: string;
  subjectAr: string;
  durationMinutes: number;
  totalPoints: number;
  competenceIds: string[];
  exercises: CemPaperExercise[];
  problem: CemPaperExercise;
}

import previews from './cemPreviews.json' with { type: 'json' };
export type CemPaperPreview=Omit<CemPaper,'problem'> & {problem:null};
export const CEM_PAPERS=previews as CemPaperPreview[];

export function cemErrorRows(rows: ParentNotebookRow[]): ParentNotebookRow[] {
  return rows.filter((row) => row.status === 'review' && (row.competenceId.startsWith('math-5ap') || row.competenceId.startsWith('ar-5ap')));
}

export function paperById(id: string): CemPaperPreview | undefined {
  return CEM_PAPERS.find((paper) => paper.id === id);
}

const CEM_REWARD_KEY = 'mssid.cemRewarded';

export function loadCemRewarded(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = progressStorage().getItem(CEM_REWARD_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

/** Returns true only the first time this exercise is marked rewarded. */
export function markCemRewarded(key: string): boolean {
  const prev = loadCemRewarded();
  if (prev.includes(key)) return false;
  if (typeof localStorage !== 'undefined') {
    progressStorage().setItem(CEM_REWARD_KEY, JSON.stringify([...prev, key]));
  }
  return true;
}

import { createContext, useContext } from 'react';
import type { PreschoolActivity, PreschoolPlayQuality } from '../../data/preschool/types';

export const PreschoolEvidence = createContext<() => void>(() => {});
export const usePreschoolEvidence = () => useContext(PreschoolEvidence);

/** Completion is distinct from a checked answer: free exploration cannot prove autonomy. */
export function resolvedPlayQuality(activity: PreschoolActivity, quality: PreschoolPlayQuality, assisted: boolean): PreschoolPlayQuality {
  if (quality !== 'done' && quality !== 'wrote') return quality;
  const unassessed = ['creative_extra', 'coloring', 'quran_listen', 'find_path', 'maze', 'trace'].includes(activity.interactionType)
    || (activity.interactionType === 'listen_tap' && !activity.visualAssets.listenCorrectId);
  if (unassessed) return 'explored';
  return assisted ? 'done_helped' : 'done';
}

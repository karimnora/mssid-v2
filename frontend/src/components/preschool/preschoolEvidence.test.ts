import { describe, expect, it } from 'vitest';
import { PRESCHOOL_MODULES } from '../../data/preschool';
import { isPlaySuccess } from '../../data/preschool/types';
import { resolvedPlayQuality } from './preschoolEvidence';

const activities = PRESCHOOL_MODULES.flatMap(module => module.activities);
const types = [...new Set(activities.map(activity => activity.interactionType))];
describe('preschool assessment across all 15 mechanics', () => {
  it('covers every mechanic actually present in the catalog', () => expect(types).toHaveLength(15));
  it.each(types)('%s distinguishes checked answers from participation', type => {
    for (const activity of activities.filter(item => item.interactionType === type)) {
      const unassessed = ['creative_extra', 'coloring', 'quran_listen', 'find_path', 'maze', 'trace'].includes(type)
        || type === 'listen_tap' && !activity.visualAssets.listenCorrectId;
      expect(resolvedPlayQuality(activity, 'done', false)).toBe(unassessed ? 'explored' : 'done');
      expect(resolvedPlayQuality(activity, 'done', true)).toBe(unassessed ? 'explored' : 'done_helped');
      expect(resolvedPlayQuality(activity, 'tried', true)).toBe('tried');
    }
  });
  it('keeps helped completion and participation eligible for progression, never a failed try', () => {
    expect(isPlaySuccess('done_helped')).toBe(true);
    expect(isPlaySuccess('explored')).toBe(true);
    expect(isPlaySuccess('tried')).toBe(false);
    expect(isPlaySuccess('helped')).toBe(false);
  });
});

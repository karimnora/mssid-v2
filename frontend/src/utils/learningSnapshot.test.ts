import {describe,it,expect} from 'vitest';
import {cleanLearningResults,mergeLearningResults,sameLearningResults} from './learningSnapshot';
describe('learning snapshot merge',()=>{
 it('keeps newest outcome, first completion and independent activities',()=>{
  const old=cleanLearningResults({a:{outcome:'independent',at:'2026-10-10T10:00:00Z'}}),next=cleanLearningResults({a:{outcome:'review',at:'2026-10-11T10:00:00Z'},b:{outcome:'helped',at:'2026-10-11T10:00:00Z'}});
  const merged=mergeLearningResults(old,next);expect(merged.a.outcome).toBe('review');expect(merged.a.completedAt).toBe(old.a.at);expect(Object.keys(merged)).toHaveLength(2);expect(sameLearningResults(mergeLearningResults(merged,old),merged)).toBe(true);
 });
 it('rejects malformed entries without treating untried work as failure',()=>{expect(cleanLearningResults({a:{outcome:'premium',at:'2026-10-10'},b:{outcome:'review',at:'broken'}})).toEqual({});});
});

import {it,expect} from 'vitest';
import {familyParentSummary} from './familyParentSummary';
import {ENRICHMENT_MODULES} from '../data/family/enrichmentContent';
it('uses seven-day latest observations, excludes other grades and deduplicates next workshops',()=>{
 const modules=ENRICHMENT_MODULES.filter(m=>m.grade==='2AP'),at='2026-10-15T10:00:00Z';
 const results={[modules[0].tasks[0].id]:{outcome:'review' as const,at},[modules[0].tasks[1].id]:{outcome:'helped' as const,at},[modules[1].tasks[0].id]:{outcome:'independent' as const,at},[ENRICHMENT_MODULES.find(m=>m.grade==='3AP')!.tasks[0].id]:{outcome:'review' as const,at}};
 const summary=familyParentSummary('2AP',results,Date.parse('2026-10-16T10:00:00Z'));expect(summary.independent).toBe(1);expect(summary.helped).toBe(1);expect(summary.review).toBe(1);expect(summary.next).toHaveLength(1);expect(familyParentSummary('2AP',results,Date.parse('2026-10-30T10:00:00Z')).week).toHaveLength(0);
});

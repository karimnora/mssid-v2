import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {COMPETENCE_CAHIERS as full} from '../../../content-authoring/competenceCahiers';
import {COMPETENCE_CAHIERS as publicData} from './competenceCahiers';
import {CEM_PAPERS as fullPapers} from '../../../content-authoring/cemPrep';
import {CEM_PAPERS as publicPapers} from '../immersive/cemPrep';
it('exports complete server documents but only the promised public previews',()=>{
 expect(JSON.parse(readFileSync('../backend/src/main/resources/cahier-content.json','utf8'))).toEqual(full);
 expect(JSON.parse(readFileSync('../backend/src/main/resources/cem-content.json','utf8'))).toEqual(fullPapers);
 for(const preview of publicData){expect(preview.exercises).toHaveLength(1);expect(preview.versoAr).toEqual([]);}
 expect(publicPapers[0].exercises).toHaveLength(1);expect(publicPapers.slice(1).every(p=>p.exercises.length===0&&!p.problem)).toBe(true);
});

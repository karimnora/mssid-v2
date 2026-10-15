import {writeFileSync} from 'node:fs';
import {COMPETENCE_CAHIERS} from '../content-authoring/competenceCahiers';
writeFileSync('../backend/src/main/resources/cahier-content.json',JSON.stringify(COMPETENCE_CAHIERS,null,2)+'\n');
writeFileSync('src/data/cahiers/cahierPreviews.json',JSON.stringify(COMPETENCE_CAHIERS.map(c=>({...c,exercises:c.exercises.slice(0,1),versoAr:[]})),null,2)+'\n');

import {CEM_PAPERS} from '../content-authoring/cemPrep';
writeFileSync('../backend/src/main/resources/cem-content.json',JSON.stringify(CEM_PAPERS,null,2)+'\n');
writeFileSync('src/data/immersive/cemPreviews.json',JSON.stringify(CEM_PAPERS.map((c,i)=>({...c,exercises:i===0?c.exercises.slice(0,1):[],problem:null})),null,2)+'\n');

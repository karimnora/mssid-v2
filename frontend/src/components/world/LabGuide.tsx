import React from 'react';
import type { SubjectId } from '../../types';
import { LAB_GUIDE_HINTS } from '../../data/labGuideHints';
import { DidouRibbon } from './DidouRibbon';
import { useTranslation } from '../../hooks/useTranslation';

// These labs already render a live Didou guide through ImmersiveLabShell.
const NATIVE_GUIDE = new Set(['wudu_lab','salat_lab','mosque_adab_lab','road_code_lab','souk_lab','world_flags_lab','cem_prep_lab','cahiers_lab']);
export function LabGuide({ subject }: { subject: SubjectId }) {
 const t = useTranslation('labsImmersive');
 if (NATIVE_GUIDE.has(subject)) return null;
 const hint = LAB_GUIDE_HINTS[subject];
 if (!hint) return null;
 return <div className="lab-catalog-guide" data-lab-guide={subject}>
   <DidouRibbon text={hint} lang="ar" listenLabel={t('listenDidou')} />
 </div>;
}

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ImmersiveLabShell } from '../immersive/ImmersiveLabShell';
import { CompetenceCahierSheet } from './CompetenceCahierSheet';
import { cahiersForGrade, type CompetenceCahier } from '../../data/cahiers/competenceCahiers';
import { FamilyLearningStudio } from '../family/FamilyLearningStudio';
import { FAMILY_GRADES } from '../../utils/familyLearning';
import type { PrimaryGrade, UserProfile } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

import { useCahierAccess } from '../../hooks/useCahierAccess';
import { CahierQuotaNotice } from './CahierQuotaNotice';

interface CompetenceCahierLabProps {
  grade: PrimaryGrade;
  onBack?: () => void;
  profile?: UserProfile;
}

export const CompetenceCahierLab: React.FC<CompetenceCahierLabProps> = ({ grade, onBack, profile }) => {
  const t = useTranslation('labsImmersive');
  const { access } = useCahierAccess();
  const gradeTabs = useMemo(
    () => FAMILY_GRADES.map((item) => ({ id: item, label: item })),
    [],
  );
  const [viewGrade, setViewGrade] = useState<PrimaryGrade>(
    () => FAMILY_GRADES.includes(grade) ? grade : '1AP',
  );
  const [open, setOpen] = useState<CompetenceCahier | null>(null);
  const cahiers = useMemo(() => cahiersForGrade(viewGrade), [viewGrade]);

  return (
    <ImmersiveLabShell
      badge={t('cahierBadge')}
      title={t('cahierTitle')}
      intro={t('cahierIntro')}
      tabs={gradeTabs}
      activeTab={viewGrade}
      onTab={(id) => setViewGrade(id as PrimaryGrade)}
      onBack={onBack}
    >
      <FamilyLearningStudio grade={viewGrade} profile={profile} />
      {access && <CahierQuotaNotice access={access} />}
      <section className="space-y-2">
        {cahiers.length === 0 ? (
          <p className="rounded-[24px] border-2 border-[#E7E2D7] bg-white p-4 text-sm font-extrabold">{t('cahierEmpty')}</p>
        ) : (
          cahiers.map((cahier) => (
          <motion.button
            key={cahier.competenceId}
            type="button"
            whileTap={{ scale: 0.98 }}
            data-cahier={cahier.competenceId}
            onClick={() => setOpen(cahier)}
            className="w-full text-start rounded-[24px] border-2 border-[#E7E2D7] bg-white p-4 cursor-pointer"
          >
            <p className="text-[11px] font-extrabold text-[var(--kids-muted)]">{cahier.domainAr}</p>
            <p className="text-sm font-extrabold text-[var(--kids-ink)] leading-relaxed">{cahier.titleAr}</p>
          </motion.button>
          ))
        )}
      </section>
      {open && <CompetenceCahierSheet cahier={open} onClose={() => setOpen(null)} />}
    </ImmersiveLabShell>
  );
};

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ImmersiveLabShell } from '../immersive/ImmersiveLabShell';
import { CompetenceCahierSheet } from './CompetenceCahierSheet';
import { cahiersForGrade, type CompetenceCahier } from '../../data/cahiers/competenceCahiers';
import { VALID_GRADES } from '../../navigation/appLocation';
import type { PrimaryGrade } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface CompetenceCahierLabProps {
  grade: PrimaryGrade;
  onBack?: () => void;
}

export const CompetenceCahierLab: React.FC<CompetenceCahierLabProps> = ({ grade, onBack }) => {
  const t = useTranslation('labsImmersive');
  const gradeTabs = useMemo(
    () => VALID_GRADES.filter((item) => cahiersForGrade(item).length > 0).map((item) => ({ id: item, label: item })),
    [],
  );
  const [viewGrade, setViewGrade] = useState<PrimaryGrade>(
    () => (cahiersForGrade(grade).length > 0 ? grade : (gradeTabs[0]?.id as PrimaryGrade) ?? '1AP'),
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

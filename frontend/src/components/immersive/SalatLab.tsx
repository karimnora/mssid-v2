import { salatPrayerNarration } from '../../data/immersive/salat';
import { FiniteLabQuiz } from '../FiniteLabQuiz';
import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ImmersiveLabShell } from './ImmersiveLabShell';
import { useTranslation } from '../../hooks/useTranslation';
import { playSoftMiss, playSoftSuccess, speakArSafe } from '../../utils/immersiveFeedback';
import { useLabTrace } from '../../utils/labTrace';
import type { PrimaryGrade } from '../../types';
import {
  isSalatPostureCorrect,
  SALAT_POSTURES,
  SALAT_PRAYERS,
  SALAT_QUIZ,
  type SalatPrayer,
} from '../../data/immersive/salat';

import takbirArt from '../../assets/labs/salat/takbir.webp';
import qiyamArt from '../../assets/labs/salat/qiyam.webp';
import rukuArt from '../../assets/labs/salat/ruku.webp';
import raiseArt from '../../assets/labs/salat/raise.webp';
import sujudArt from '../../assets/labs/salat/sujud.webp';
import jalsaArt from '../../assets/labs/salat/jalsa.webp';
import sujud2Art from '../../assets/labs/salat/sujud2.webp';
import './salatLab.css';
const POSTURE_ART: Record<string, string> = { takbir: takbirArt, qiyam: qiyamArt, ruku: rukuArt, raise: raiseArt, sujud: sujudArt, jalsa: jalsaArt, sujud2: sujud2Art };

interface SalatLabProps {
  /** The child's grade: the notebook keeps the observation in that year's summary. */
  grade?: PrimaryGrade;
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
}

export const SalatLab: React.FC<SalatLabProps> = ({ grade = '2AP', onBack, onReward }) => {
  const t = useTranslation('labsImmersive');
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState('day');
  const [selected, setSelected] = useState<SalatPrayer>(SALAT_PRAYERS[0]);
  const [posture, setPosture] = useState(0);
  const [stars, setStars] = useState(0);
  const trace = useLabTrace('salat_lab', grade);
  const shownPosture = SALAT_POSTURES[Math.min(posture, SALAT_POSTURES.length - 1)];

  const reward = () => {
    playSoftSuccess();
    setStars((n) => n + 1);
    onReward?.(5, 12);
  };

  const tapPosture = (id: string) => {
    if (!isSalatPostureCorrect(posture, id)) {
      playSoftMiss();
      trace.miss('rakah');
      return;
    }
    const step = SALAT_POSTURES[posture];
    speakArSafe(step.descAr);
    const next = posture + 1;
    setPosture(next);
    if (next >= SALAT_POSTURES.length) {
      trace.success('rakah');
      reward();
    }
    else playSoftSuccess();
  };

  return (
    <div className="salat-lab">
    <ImmersiveLabShell
      badge={t('salatBadge')}
      title={t('salatTitle')}
      intro={t('salatIntro')}
      guideText={tab === 'rakah' ? (posture < SALAT_POSTURES.length ? shownPosture.descAr : t('salatRakahDone')) : tab === 'day' ? salatPrayerNarration(selected) : t('salatIntro')}
      tabs={[
        { id: 'day', label: t('salatTabDay') },
        { id: 'rakah', label: t('salatTabRakah') },
        { id: 'quiz', label: t('salatTabQuiz') },
      ]}
      activeTab={tab}
      onTab={setTab}
      stars={stars}
      onBack={onBack}
    >
      {tab === 'day' && (
        <section className="space-y-3">
          <div
            className="salat-day rounded-[28px] border-2 border-[#E7E2D7] p-5 text-white"
            data-salat-time={selected.id}
          >
            <span key={selected.id} className="salat-day-light" style={{ background: selected.sky }} aria-hidden="true" />
            <span className="salat-orb" aria-hidden="true" />
            <h2 className="text-2xl font-extrabold mt-2 drop-shadow-sm">{selected.nameAr}</h2>
            <p className="text-sm font-bold mt-1 drop-shadow-sm">{selected.timeAr}</p>
            <p className="text-sm font-extrabold mt-3">{t('salatRakahs', { count: selected.rakahs })}</p>
            <div className="flex gap-1.5 mt-3">
              {Array.from({ length: selected.rakahs }, (_, i) => (
                <span key={i} className="h-3 w-8 rounded-full bg-white/90" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SALAT_PRAYERS.map((prayer) => (
              <motion.button
                key={prayer.id}
                type="button"
                whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                data-salat-prayer={prayer.id}
                onClick={() => {
                  setSelected(prayer);
                  speakArSafe(salatPrayerNarration(prayer));
                }}
                className={`hit-target rounded-2xl border-2 px-2 text-xs font-extrabold cursor-pointer ${
                  selected.id === prayer.id
                    ? 'bg-[var(--brand-emerald)] text-white border-[#006B40]'
                    : 'bg-white text-[var(--kids-ink)] border-[#E7E2D7]'
                }`}
              >
                {prayer.icon} {prayer.nameAr.replace('صَلَاةُ ', '')}
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {tab === 'rakah' && (
        <section className="rounded-3xl border-2 border-[#E7E2D7] bg-white p-4 space-y-3">
          {posture >= SALAT_POSTURES.length ? (
            <p className="text-base font-extrabold text-[var(--brand-emerald)] text-center py-4">{t('salatRakahDone')}</p>
          ) : (
            <div className="rounded-2xl bg-[#FFF8E7] border-2 border-[#E7E2D7] p-3">
              <p className="text-base font-extrabold text-[var(--kids-ink)]">{SALAT_POSTURES[posture].titleAr}</p>
              <p className="text-sm font-bold text-[var(--kids-muted)] leading-relaxed">{SALAT_POSTURES[posture].descAr}</p>
            </div>
          )}
          <div className="salat-stage" data-salat-scene={shownPosture.id} aria-hidden="true">
            <img key={shownPosture.id} src={POSTURE_ART[shownPosture.id]} alt="" className="salat-figure" draggable={false} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SALAT_POSTURES.map((step, index) => (
              <motion.button
                key={step.id}
                type="button"
                whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                data-salat-posture={step.id}
                disabled={index < posture}
                onClick={() => tapPosture(step.id)}
                className={`hit-target w-full flex items-center gap-2 rounded-2xl border-2 px-3 py-2 text-sm font-extrabold cursor-pointer ${
                  index < posture
                    ? 'bg-[#ECFDF5] border-[#008751] text-[#065F46]'
                    : index === posture
                      ? 'bg-white border-[var(--brand-amber)] text-[var(--kids-ink)]'
                      : 'bg-[#FFFBF0] border-[#E7E2D7] text-[var(--kids-ink)]'
                }`}
              >
                <img src={POSTURE_ART[step.id]} alt="" aria-hidden="true" className="salat-choice-art" loading="lazy" draggable={false} />
                <span>{step.titleAr}</span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {tab === 'quiz' && (
        <FiniteLabQuiz questions={SALAT_QUIZ} onAnswer={(correct, firstCorrect) => {
          if (correct) trace.success('quiz');
          else trace.miss('quiz');
          if (firstCorrect) reward();
        }} />
      )}
    </ImmersiveLabShell>
    </div>
  );
};

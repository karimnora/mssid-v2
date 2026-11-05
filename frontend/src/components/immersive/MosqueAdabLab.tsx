import { LabQuizSession } from '../LabQuizSession';
import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import mosqueArt from '../../assets/labs/salat/backdrop-landscape.webp';
import { ImmersiveLabShell } from './ImmersiveLabShell';
import { useTranslation } from '../../hooks/useTranslation';
import { playSoftMiss, playSoftSuccess, speakArSafe } from '../../utils/immersiveFeedback';
import { useLabTrace } from '../../utils/labTrace';
import type { PrimaryGrade } from '../../types';
import { isMosqueAnswerCorrect, MOSQUE_SCENES, type MosqueChoice } from '../../data/immersive/mosqueAdab';

interface MosqueAdabLabProps {
  /** The child's grade: the notebook keeps the observation in that year's summary. */
  grade?: PrimaryGrade;
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
}

export const MosqueAdabLab: React.FC<MosqueAdabLabProps> = ({ grade = '2AP', onBack, onReward }) => {
  const t = useTranslation('labsImmersive');
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<MosqueChoice | null>(null);
  const [stars, setStars] = useState(0);
  const trace = useLabTrace('mosque_adab_lab', grade);
  const scene = MOSQUE_SCENES[Math.min(index, MOSQUE_SCENES.length - 1)];

  const choose = (choice: MosqueChoice) => {
    if (picked) return;
    const ok = isMosqueAnswerCorrect(scene.id, choice);
    setPicked(choice);
    if (ok) {
      trace.success('adab');
      playSoftSuccess();
      setStars((n) => n + 1);
      onReward?.(5, 12);
      speakArSafe(scene.options.find((option) => option.id === choice)?.labelAr ?? '');
    } else {
      trace.miss('adab');
      playSoftMiss();
    }
  };

  return (
    <ImmersiveLabShell
      badge={t('mosqueBadge')}
      title={t('mosqueTitle')}
      intro={t('mosqueIntro')}
      guideText={scene.promptAr}
      tabs={[{ id: 'adab', label: t('mosqueTitle') }]}
      activeTab="adab"
      onTab={() => undefined}
      stars={stars}
      onBack={onBack}
    >
      <LabQuizSession complete={index >= MOSQUE_SCENES.length} score={stars} total={MOSQUE_SCENES.length} onRestart={() => { setIndex(0); setStars(0); setPicked(null); }}>
<section className="rounded-3xl border-2 border-[#E7E2D7] bg-white overflow-hidden">
        <img src={mosqueArt} alt="" aria-hidden="true" className="w-full h-52 sm:h-72 object-cover" draggable={false} />
        <div className="p-4 space-y-3">
          <p className="text-xs font-extrabold text-[var(--brand-emerald)]">{scene.titleAr}</p>
          <p className="text-base font-extrabold text-[var(--kids-ink)] leading-relaxed">{scene.promptAr}</p>
          <div className="grid gap-2">
            {scene.options.map((option) => {
              const chosen = picked === option.id;
              const ok = option.id === scene.correct;
              const tone = !picked
                ? 'bg-[#FFFBF0] border-[#E7E2D7]'
                : ok
                  ? 'bg-[#ECFDF5] border-[#008751] text-[#065F46]'
                  : chosen
                    ? 'bg-[#FFF8E7] border-[#E7E2D7]'
                    : 'bg-white border-[#E7E2D7] text-[var(--kids-muted)]';
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                  data-mosque-option={option.id}
                  data-quiz-option={!picked ? 'idle' : ok ? 'correct' : chosen ? 'retry' : 'muted'}
                  disabled={!!picked}
                  onClick={() => choose(option.id)}
                  className={`hit-target w-full rounded-2xl border-2 px-4 text-sm font-extrabold cursor-pointer text-[var(--kids-ink)] ${tone}`}
                >
                  {option.labelAr}
                </motion.button>
              );
            })}
          </div>
          {picked && (
            <motion.button
              type="button"
              whileTap={reduceMotion ? undefined : { scale: 0.95 }}
              data-primary-cta="lab-next"
              onClick={() => {
                setPicked(null);
                setIndex((n) => Math.min(n + 1, MOSQUE_SCENES.length));
              }}
              className="hit-target w-full rounded-2xl bg-[var(--brand-emerald)] text-white text-sm font-extrabold cursor-pointer"
            >
              {t('next')}
            </motion.button>
          )}
        </div>
      </section>
</LabQuizSession>
    </ImmersiveLabShell>
  );
};

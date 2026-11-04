import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<MosqueChoice | null>(null);
  const [stars, setStars] = useState(0);
  const trace = useLabTrace('mosque_adab_lab', grade);
  const scene = MOSQUE_SCENES[index];

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
      tabs={[{ id: 'adab', label: t('mosqueTitle') }]}
      activeTab="adab"
      onTab={() => undefined}
      stars={stars}
      onBack={onBack}
    >
      <section className="rounded-3xl border-2 border-[#E7E2D7] bg-white overflow-hidden">
        <div className="h-36 bg-[linear-gradient(180deg,#1E3A5F_0%,#008751_70%,#FDE68A_100%)] relative">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-24 bg-white/95 rounded-t-[40px] border-x-4 border-t-4 border-[#E7E2D7]" />
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#008751]" />
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-2 h-8 bg-[#F59E0B]" />
          <div className="absolute top-4 right-6 text-2xl" aria-hidden>🌙</div>
        </div>
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
                  whileTap={{ scale: 0.95 }}
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
              whileTap={{ scale: 0.95 }}
              data-primary-cta="lab-next"
              onClick={() => {
                setPicked(null);
                setIndex((n) => (n + 1) % MOSQUE_SCENES.length);
              }}
              className="hit-target w-full rounded-2xl bg-[var(--brand-emerald)] text-white text-sm font-extrabold cursor-pointer"
            >
              {t('next')}
            </motion.button>
          )}
        </div>
      </section>
    </ImmersiveLabShell>
  );
};

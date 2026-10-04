import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ImmersiveLabShell, QuizBlock } from './ImmersiveLabShell';
import { useTranslation } from '../../hooks/useTranslation';
import { playSoftMiss, playSoftSuccess, speakArSafe } from '../../utils/immersiveFeedback';
import {
  isSalatPostureCorrect,
  SALAT_POSTURES,
  SALAT_PRAYERS,
  SALAT_QUIZ,
  type SalatPrayer,
} from '../../data/immersive/salat';

interface SalatLabProps {
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
}

export const SalatLab: React.FC<SalatLabProps> = ({ onBack, onReward }) => {
  const t = useTranslation('labsImmersive');
  const [tab, setTab] = useState('day');
  const [selected, setSelected] = useState<SalatPrayer>(SALAT_PRAYERS[0]);
  const [posture, setPosture] = useState(0);
  const [quiz, setQuiz] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [stars, setStars] = useState(0);

  const reward = () => {
    playSoftSuccess();
    setStars((n) => n + 1);
    onReward?.(5, 12);
  };

  const tapPosture = (id: string) => {
    if (!isSalatPostureCorrect(posture, id)) {
      playSoftMiss();
      return;
    }
    const step = SALAT_POSTURES[posture];
    speakArSafe(step.descAr);
    const next = posture + 1;
    setPosture(next);
    if (next >= SALAT_POSTURES.length) reward();
    else playSoftSuccess();
  };

  return (
    <ImmersiveLabShell
      badge={t('salatBadge')}
      title={t('salatTitle')}
      intro={t('salatIntro')}
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
            className="rounded-[28px] border-2 border-[#E7E2D7] p-5 min-h-[160px] text-white"
            style={{ background: selected.sky }}
          >
            <p className="text-3xl" aria-hidden>{selected.icon}</p>
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
                whileTap={{ scale: 0.95 }}
                data-salat-prayer={prayer.id}
                onClick={() => {
                  setSelected(prayer);
                  speakArSafe(`${prayer.nameAr}. ${prayer.timeAr}. ${prayer.rakahs} ركعات.`);
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
          <div className="grid gap-2">
            {SALAT_POSTURES.map((step, index) => (
              <motion.button
                key={step.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                data-salat-posture={step.id}
                disabled={index < posture}
                onClick={() => tapPosture(step.id)}
                className={`hit-target w-full rounded-2xl border-2 px-4 text-sm font-extrabold cursor-pointer ${
                  index < posture
                    ? 'bg-[#ECFDF5] border-[#008751] text-[#065F46]'
                    : index === posture
                      ? 'bg-white border-[var(--brand-amber)] text-[var(--kids-ink)]'
                      : 'bg-[#FFFBF0] border-[#E7E2D7] text-[var(--kids-ink)]'
                }`}
              >
                {step.titleAr}
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {tab === 'quiz' && (
        <QuizBlock
          questionAr={SALAT_QUIZ[quiz].questionAr}
          optionsAr={SALAT_QUIZ[quiz].optionsAr}
          correctAr={SALAT_QUIZ[quiz].correctAr}
          picked={picked}
          onPick={(option, ok) => {
            setPicked(option);
            if (ok) {
              reward();
              window.setTimeout(() => {
                setQuiz((n) => (n + 1) % SALAT_QUIZ.length);
                setPicked(null);
              }, 700);
            }
          }}
        />
      )}
    </ImmersiveLabShell>
  );
};

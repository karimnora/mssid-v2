import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ImmersiveLabShell } from './ImmersiveLabShell';
import { useTranslation } from '../../hooks/useTranslation';
import { playSoftMiss, playSoftSuccess, speakArSafe } from '../../utils/immersiveFeedback';
import { useLabTrace } from '../../utils/labTrace';
import {
  isRoadAnswerCorrect,
  nextCrossingStep,
  roadScenesForGrade,
  type CrossingStep,
  type RoadAction,
} from '../../data/immersive/roadCode';
import type { PrimaryGrade } from '../../types';

interface RoadCodeLabProps {
  grade?: PrimaryGrade;
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
}

export const RoadCodeLab: React.FC<RoadCodeLabProps> = ({ grade = '2AP', onBack, onReward }) => {
  const t = useTranslation('labsImmersive');
  const scenes = useMemo(() => roadScenesForGrade(grade), [grade]);
  const [tab, setTab] = useState('scenes');
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<RoadAction | null>(null);
  const [crossing, setCrossing] = useState<CrossingStep[]>([]);
  const [stars, setStars] = useState(0);
  const trace = useLabTrace('road_code_lab', grade);
  const scene = scenes[index] ?? scenes[0];

  const reward = () => {
    playSoftSuccess();
    setStars((n) => n + 1);
    onReward?.(5, 12);
  };

  const choose = (action: RoadAction) => {
    if (!scene || picked) return;
    const ok = isRoadAnswerCorrect(scene.id, action);
    setPicked(action);
    if (ok) {
      trace.success('scenes');
      speakArSafe(scene.options.find((option) => option.id === action)?.labelAr ?? '');
      reward();
    } else {
      trace.miss('scenes');
      playSoftMiss();
    }
  };

  const tapCross = (step: CrossingStep) => {
    const expected = nextCrossingStep(crossing);
    if (expected !== step) {
      playSoftMiss();
      trace.miss('cross');
      setCrossing([]);
      return;
    }
    const next = [...crossing, step];
    setCrossing(next);
    if (nextCrossingStep(next) === 'done') {
      trace.success('cross');
      reward();
    }
    else playSoftSuccess();
  };

  return (
    <ImmersiveLabShell
      badge={t('roadBadge')}
      title={t('roadTitle')}
      intro={t('roadIntro')}
      tabs={[
        { id: 'scenes', label: t('roadTabScenes') },
        { id: 'cross', label: t('roadTabCross') },
      ]}
      activeTab={tab}
      onTab={setTab}
      stars={stars}
      onBack={onBack}
    >
      {tab === 'scenes' && scene && (
        <section className="rounded-3xl border-2 border-[#E7E2D7] bg-white overflow-hidden">
          <div className="relative h-40 bg-[linear-gradient(180deg,#7DD3FC_0%,#FEF3C7_55%,#86EFAC_100%)]">
            <div className="absolute bottom-8 inset-x-0 h-10 bg-[#64748B]" />
            <div className="absolute bottom-[52px] inset-x-8 h-2 bg-[#FDE68A] opacity-80" />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-3 bg-white" />
            <div className="absolute top-4 right-6 w-8 rounded-lg bg-[#0f172a] p-1 space-y-1">
              <span className={`block h-4 rounded-full ${scene.id === 'red' ? 'bg-[#C42A23]' : 'bg-[#7F1D1D]'}`} />
              <span className="block h-4 rounded-full bg-[#854D0E]" />
              <span className={`block h-4 rounded-full ${scene.id === 'green' ? 'bg-[#008751]' : 'bg-[#14532D]'}`} />
            </div>
            <div className="absolute bottom-16 left-8 text-3xl" aria-hidden>🚸</div>
            <div className="absolute bottom-14 right-16 text-3xl" aria-hidden>🚕</div>
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
                    data-road-option={option.id}
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
                onClick={() => {
                  setPicked(null);
                  setIndex((n) => (n + 1) % scenes.length);
                }}
                className="hit-target w-full rounded-2xl bg-[var(--brand-emerald)] text-white text-sm font-extrabold cursor-pointer"
              >
                {t('next')}
              </motion.button>
            )}
          </div>
        </section>
      )}

      {tab === 'cross' && (
        <section className="rounded-3xl border-2 border-[#E7E2D7] bg-white p-4 space-y-3">
          <div className="h-32 rounded-2xl bg-[linear-gradient(180deg,#7DD3FC,#FEF3C7)] relative overflow-hidden">
            <div className="absolute bottom-6 inset-x-0 h-8 bg-[#64748B]" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-28 h-3 bg-white" />
            <motion.div
              className="absolute bottom-10 text-3xl"
              animate={{ right: crossing.includes('cross') ? '18%' : '70%' }}
              transition={{ type: 'spring', stiffness: 80 }}
            >
              🧒
            </motion.div>
          </div>
          {nextCrossingStep(crossing) === 'done' ? (
            <p className="text-base font-extrabold text-[var(--brand-emerald)] text-center">{t('roadCrossDone')}</p>
          ) : (
            <div className="grid gap-2">
              <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => tapCross('left')} className="hit-target rounded-2xl bg-white border-2 border-[#E7E2D7] text-sm font-extrabold cursor-pointer">
                {t('roadLookLeft')}
              </motion.button>
              <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => tapCross('right')} className="hit-target rounded-2xl bg-white border-2 border-[#E7E2D7] text-sm font-extrabold cursor-pointer">
                {t('roadLookRight')}
              </motion.button>
              <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => tapCross('cross')} className="hit-target rounded-2xl bg-[var(--brand-emerald)] text-white text-sm font-extrabold cursor-pointer">
                {t('roadCross')}
              </motion.button>
            </div>
          )}
        </section>
      )}
    </ImmersiveLabShell>
  );
};

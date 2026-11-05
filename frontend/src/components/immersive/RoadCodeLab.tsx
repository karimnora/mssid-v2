import { LabQuizSession } from '../LabQuizSession';
import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import pedestrianRed from '../../assets/labs/road/pedestrian-red.webp';
import pedestrianGreen from '../../assets/labs/road/pedestrian-green.webp';
import childWalking from '../../assets/labs/road/child-walking.webp';
import childLooking from '../../assets/labs/road/child-looking.webp';
import busArt from '../../assets/labs/road/bus.webp';
import guardArt from '../../assets/labs/road/guard.webp';
import elderArt from '../../assets/labs/road/elder.webp';
import './roadCodeLab.css';
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
  const reduceMotion = useReducedMotion();
  const scenes = useMemo(() => roadScenesForGrade(grade), [grade]);
  const [tab, setTab] = useState('scenes');
  const [index, setIndex] = useState(0);
  const [sceneScore, setSceneScore] = useState(0);
  const [picked, setPicked] = useState<RoadAction | null>(null);
  const [crossing, setCrossing] = useState<CrossingStep[]>([]);
  const [crossMiss, setCrossMiss] = useState(false);
  const [stars, setStars] = useState(0);
  const trace = useLabTrace('road_code_lab', grade);
  const scene = scenes[Math.min(index, scenes.length - 1)];

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
      setSceneScore(value => value + 1);
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
      setCrossMiss(true);
      return;
    }
    setCrossMiss(false);
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
      guideText={tab === 'scenes' ? scene?.promptAr : nextCrossingStep(crossing) === 'left' ? t('roadLookLeft') : nextCrossingStep(crossing) === 'right' ? t('roadLookRight') : nextCrossingStep(crossing) === 'cross' ? t('roadCross') : t('roadCrossDone')}
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
        <LabQuizSession complete={index >= scenes.length} score={sceneScore} total={scenes.length} onRestart={() => { setIndex(0); setSceneScore(0); setPicked(null); }}>
<section className="rounded-3xl border-2 border-[#E7E2D7] bg-white overflow-hidden">
          <div className="road-art-scene" data-road-scene={scene.id} aria-hidden="true">
            {(scene.id === 'red' || scene.id === 'green') && <div className="road-light">
              <img src={pedestrianRed} alt="" className={scene.id === 'red' ? 'is-on' : ''} />
              <img src={pedestrianGreen} alt="" className={scene.id === 'green' ? 'is-on' : ''} />
            </div>}
            <img src={scene.id === 'bus' ? elderArt : childLooking} alt="" className="road-child road-safety-look" />
            {(scene.id === 'school' || scene.id === 'bus') && <img src={busArt} alt="" className="road-bus" />}
            {scene.id === 'school' && <img src={guardArt} alt="" className="road-guard" />}
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
                    whileTap={reduceMotion ? undefined : { scale: 0.95 }}
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
                whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                onClick={() => {
                  setPicked(null);
                  setIndex((n) => Math.min(n + 1, scenes.length));
                }}
                className="hit-target w-full rounded-2xl bg-[var(--brand-emerald)] text-white text-sm font-extrabold cursor-pointer"
              >
                {t('next')}
              </motion.button>
            )}
          </div>
        </section>
</LabQuizSession>
      )}

      {tab === 'cross' && (
        <section className="rounded-3xl border-2 border-[#E7E2D7] bg-white p-4 space-y-3">
          <div className="road-art-scene road-cross-scene" aria-hidden="true">
            <motion.div className="road-cross-child" animate={{ y: crossing.includes('cross') ? -90 : 0, opacity: crossing.includes('cross') ? .75 : 1 }} transition={{ duration: reduceMotion ? 0 : 1 }}>
              <img src={crossing.includes('cross') ? childWalking : childLooking} alt="" />
            </motion.div>
          </div>
          {crossMiss && <p role="status" className="rounded-2xl bg-amber-50 p-3 font-bold text-slate-800">{t('keepProgressRetry')}</p>}
          {nextCrossingStep(crossing) === 'done' ? (
            <p className="text-base font-extrabold text-[var(--brand-emerald)] text-center">{t('roadCrossDone')}</p>
          ) : (
            <div className="grid gap-2">
              <motion.button type="button" whileTap={reduceMotion ? undefined : { scale: 0.95 }} onClick={() => tapCross('left')} className="hit-target rounded-2xl bg-white border-2 border-[#E7E2D7] text-sm font-extrabold cursor-pointer">
                {t('roadLookLeft')}
              </motion.button>
              <motion.button type="button" whileTap={reduceMotion ? undefined : { scale: 0.95 }} onClick={() => tapCross('right')} className="hit-target rounded-2xl bg-white border-2 border-[#E7E2D7] text-sm font-extrabold cursor-pointer">
                {t('roadLookRight')}
              </motion.button>
              <motion.button type="button" whileTap={reduceMotion ? undefined : { scale: 0.95 }} onClick={() => tapCross('cross')} className="hit-target rounded-2xl bg-[var(--brand-emerald)] text-white text-sm font-extrabold cursor-pointer">
                {t('roadCross')}
              </motion.button>
            </div>
          )}
        </section>
      )}
    </ImmersiveLabShell>
  );
};

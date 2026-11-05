import { FiniteLabQuiz } from '../FiniteLabQuiz';
import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ImmersiveLabShell } from './ImmersiveLabShell';
import { useTranslation } from '../../hooks/useTranslation';
import { playSoftMiss, playSoftSuccess, speakArSafe } from '../../utils/immersiveFeedback';
import { useLabTrace } from '../../utils/labTrace';
import type { PrimaryGrade } from '../../types';
import { isWuduTargetCorrect, WUDU_QUIZ, WUDU_STEPS, wuduStepAt, type WuduStep } from '../../data/immersive/wudu';

import childFront from '../../assets/labs/wudu/child-front.webp';
import intentionArt from '../../assets/labs/wudu/intention.webp';
import handsArt from '../../assets/labs/wudu/hands.webp';
import mouthArt from '../../assets/labs/wudu/mouth.webp';
import faceArt from '../../assets/labs/wudu/face.webp';
import armsArt from '../../assets/labs/wudu/arms.webp';
import headArt from '../../assets/labs/wudu/head.webp';
import feetArt from '../../assets/labs/wudu/feet.webp';
import './wuduLab.css';

const STEP_ART: Record<WuduStep['target'], string> = {
  niyyah: intentionArt, hands: handsArt, mouth: mouthArt,
  face: faceArt, arms: armsArt, head: headArt, feet: feetArt,
};

interface WuduLabProps {
  /** The child's grade: the notebook keeps the observation in that year's summary. */
  grade?: PrimaryGrade;
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
}

const TARGETS: { id: WuduStep['target']; cx: string; cy: string; label: string }[] = [
  { id: 'niyyah', cx: '50%', cy: '8%', label: 'بِسْمِ اللهِ' },
  { id: 'head', cx: '18%', cy: '22%', label: 'الرَّأْسُ' },
  { id: 'face', cx: '82%', cy: '34%', label: 'الوَجْهُ' },
  { id: 'mouth', cx: '18%', cy: '41%', label: 'الفَمُ' },
  { id: 'hands', cx: '22%', cy: '58%', label: 'الكَفَّانِ' },
  { id: 'arms', cx: '78%', cy: '58%', label: 'الذِّرَاعَانِ' },
  { id: 'feet', cx: '50%', cy: '88%', label: 'القَدَمَانِ' },
];

export const WuduLab: React.FC<WuduLabProps> = ({ grade = '2AP', onBack, onReward }) => {
  const t = useTranslation('labsImmersive');
  const reduceMotion = useReducedMotion();
  const [tab, setTab] = useState('wash');
  const [done, setDone] = useState(0);
  const [miss, setMiss] = useState(false);
  const [orderPick, setOrderPick] = useState<string[]>([]);
  const [orderMiss, setOrderMiss] = useState(false);
  const [stars, setStars] = useState(0);
  const trace = useLabTrace('wudu_lab', grade);

  const current = wuduStepAt(done);
  const shuffled = useMemo(
    () => [...WUDU_STEPS].sort((a, b) => a.titleAr.localeCompare(b.titleAr, 'ar')),
    [],
  );

  const reward = () => {
    playSoftSuccess();
    setStars((n) => n + 1);
    onReward?.(5, 12);
  };

  const tapTarget = (target: WuduStep['target']) => {
    if (!current) return;
    if (!isWuduTargetCorrect(done, target)) {
      playSoftMiss();
      trace.miss('wash');
      setMiss(true);
      return;
    }
    setMiss(false);
    speakArSafe(current.descAr);
    const next = done + 1;
    setDone(next);
    if (next >= WUDU_STEPS.length) {
      trace.success('wash');
      reward();
    }
  };

  const tapOrder = (id: string) => {
    if (orderPick.includes(id)) return;
    const expected = WUDU_STEPS[orderPick.length]?.id;
    if (id !== expected) {
      playSoftMiss();
      trace.miss('order');
      setOrderMiss(true);
      return;
    }
    setOrderMiss(false);
    const next = [...orderPick, id];
    setOrderPick(next);
    if (next.length === WUDU_STEPS.length) {
      trace.success('order');
      reward();
    }
    else playSoftSuccess();
  };

  return (
    <div className="wudu-lab">
    <ImmersiveLabShell
      badge={t('wuduBadge')}
      title={t('wuduTitle')}
      intro={t('wuduIntro')}
      guideText={tab === 'order' ? (WUDU_STEPS[orderPick.length]?.descAr ?? t('wuduDone')) : current ? current.descAr : t('wuduDone')}
      tabs={[
        { id: 'wash', label: t('wuduTabWash') },
        { id: 'order', label: t('wuduTabOrder') },
        { id: 'quiz', label: t('wuduTabQuiz') },
      ]}
      activeTab={tab}
      onTab={setTab}
      stars={stars}
      onBack={onBack}
    >
      {tab === 'wash' && (
        <section className="rounded-3xl border-2 border-[#E7E2D7] bg-white p-4 space-y-4">
          {current ? (
            <div className="rounded-2xl bg-[#FFF8E7] border-2 border-[#E7E2D7] p-3 space-y-1">
              <p className="text-xs font-extrabold text-[var(--brand-emerald)]">{t('wuduNow')}</p>
              <p className="text-base font-extrabold text-[var(--kids-ink)]">{current.titleAr}</p>
              <p className="text-sm font-bold text-[var(--kids-muted)] leading-relaxed">{current.descAr}</p>
              {miss && <p className="text-sm font-extrabold text-[var(--kids-ink)]">{t('wuduTapHint')}</p>}
            </div>
          ) : (
            <p className="text-base font-extrabold text-[var(--brand-emerald)] text-center py-3">{t('wuduDone')}</p>
          )}

          <div className="wudu-scene" data-wudu-scene data-complete={!current}>
            <div className="wudu-child-frame" aria-hidden="true">
              <img src={childFront} alt="" className="wudu-child" draggable={false} />
            </div>
            {done > 1 && WUDU_STEPS[done - 1]?.target !== 'head' && (
              <span key={done} className="wudu-water" data-water-target={WUDU_STEPS[done - 1]?.target} aria-hidden="true">
                <i /><i /><i />
              </span>
            )}
            {TARGETS.map((spot) => {
              const washed = WUDU_STEPS.findIndex((step) => step.target === spot.id) < done;
              const active = current?.target === spot.id;
              return (
                <motion.button
                  key={spot.id}
                  type="button"
                  whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                  data-wudu-target={spot.id}
                  data-active={active}
                  aria-current={active ? 'step' : undefined}
                  onClick={() => tapTarget(spot.id)}
                  style={{ left: spot.cx, top: spot.cy }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[72px] min-h-[60px] rounded-2xl px-2 text-[11px] font-extrabold cursor-pointer border-2 ${
                    washed
                      ? 'bg-[#008751] text-white border-[#006B40]'
                      : active
                        ? 'bg-white text-[var(--kids-ink)] border-[var(--brand-amber)] shadow-md'
                        : 'bg-white/90 text-[var(--kids-ink)] border-[#E7E2D7]'
                  }`}
                >
                  {spot.label}
                </motion.button>
              );
            })}
          </div>

          <div className="flex justify-center gap-1.5" aria-hidden>
            {WUDU_STEPS.map((step, index) => (
              <span
                key={step.id}
                className={`h-2.5 w-2.5 rounded-full ${index < done ? 'bg-[var(--brand-emerald)]' : 'bg-[#E7E2D7]'}`}
              />
            ))}
          </div>
        </section>
      )}

      {tab === 'order' && (
        <section className="rounded-3xl border-2 border-[#E7E2D7] bg-white p-4 space-y-3">
          <p className="text-sm font-bold text-[var(--kids-muted)]">
            {orderPick.length}/{WUDU_STEPS.length}
          </p>
          {orderMiss && <p role="status" className="rounded-2xl bg-amber-50 p-3 font-bold text-slate-800">{t('keepProgressRetry')}</p>}
          <div className="grid gap-2">
            {shuffled.map((step) => (
              <motion.button
                key={step.id}
                type="button"
                whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                onClick={() => tapOrder(step.id)}
                className={`hit-target w-full flex items-center gap-3 rounded-2xl border-2 px-4 py-2 text-sm font-extrabold cursor-pointer ${
                  orderPick.includes(step.id)
                    ? 'bg-[#ECFDF5] border-[#008751] text-[#065F46]'
                    : 'bg-[#FFFBF0] border-[#E7E2D7] text-[var(--kids-ink)]'
                }`}
              >
                <img src={STEP_ART[step.target]} alt="" aria-hidden="true" className="wudu-order-art" loading="lazy" draggable={false} />
                <span>{step.titleAr}</span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {tab === 'quiz' && (
        <FiniteLabQuiz questions={WUDU_QUIZ} onAnswer={(correct, firstCorrect) => {
          if (correct) trace.success('quiz');
          else trace.miss('quiz');
          if (firstCorrect) reward();
        }} />
      )}
    </ImmersiveLabShell>
    </div>
  );
};

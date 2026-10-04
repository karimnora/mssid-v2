import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ImmersiveLabShell } from './ImmersiveLabShell';
import { useTranslation } from '../../hooks/useTranslation';
import { playSoftMiss, playSoftSuccess, speakArSafe } from '../../utils/immersiveFeedback';
import {
  basketTotal,
  missionComplete,
  SOUK_CASH,
  SOUK_STALLS,
  soukChange,
  soukMissionForGrade,
  stallById,
  tenderSum,
} from '../../data/immersive/souk';
import type { PrimaryGrade } from '../../types';

interface SoukLabProps {
  grade?: PrimaryGrade;
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
}

export const SoukLab: React.FC<SoukLabProps> = ({ grade = '1AP', onBack, onReward }) => {
  const t = useTranslation('labsImmersive');
  const mission = useMemo(() => soukMissionForGrade(grade), [grade]);
  const [activeStall, setActiveStall] = useState<string | null>(null);
  const [basket, setBasket] = useState<string[]>([]);
  const [tender, setTender] = useState<number[]>([]);
  const [paid, setPaid] = useState(false);
  const [stars, setStars] = useState(0);

  const total = basketTotal(basket);
  const given = tenderSum(tender);
  const change = soukChange(total, given);
  const stall = activeStall ? stallById(activeStall) : undefined;

  const addItem = (id: string) => {
    if (basket.includes(id)) return;
    setBasket((prev) => [...prev, id]);
    setPaid(false);
    setTender([]);
    playSoftSuccess();
    const item = stallById(id);
    if (item) speakArSafe(`${item.itemAr}. ${item.priceDzd} دينار.`);
  };

  const pay = () => {
    if (total === 0 || change === null) {
      playSoftMiss();
      setPaid(true);
      return;
    }
    setPaid(true);
    playSoftSuccess();
    if (missionComplete(mission, basket)) {
      setStars((n) => n + 1);
      onReward?.(8, 20);
    }
  };

  return (
    <ImmersiveLabShell
      badge={t('soukBadge')}
      title={t('soukTitle')}
      intro={t('soukIntro')}
      tabs={[{ id: 'street', label: t('soukTitle') }]}
      activeTab="street"
      onTab={() => undefined}
      stars={stars}
      onBack={onBack}
    >
      <p className="rounded-2xl bg-[#FFF8E7] border-2 border-[#E7E2D7] p-3 text-sm font-extrabold text-[var(--kids-ink)] leading-relaxed">
        {mission.briefAr}
      </p>

      <div className="relative rounded-[28px] border-2 border-[#E7E2D7] overflow-hidden bg-[linear-gradient(180deg,#7DD3FC_0%,#FDE68A_38%,#F59E0B_38%,#F59E0B_42%,#D6D3D1_42%,#D6D3D1_100%)] p-3 pt-8">
        <div className="absolute top-3 right-4 text-2xl" aria-hidden>☀️</div>
        <div className="grid grid-cols-2 gap-2">
          {SOUK_STALLS.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              data-souk-stall={item.id}
              onClick={() => setActiveStall(item.id)}
              className={`min-h-[96px] rounded-2xl border-2 px-3 py-2 text-start cursor-pointer ${
                activeStall === item.id ? 'border-[#008751] bg-white' : 'border-[#E7E2D7] bg-white/95'
              }`}
            >
              <span className="block h-2 w-full rounded-full mb-2" style={{ background: item.accent }} />
              <p className="text-sm font-extrabold text-[var(--kids-ink)]">{item.nameAr}</p>
              <p className="text-[11px] font-bold text-[var(--kids-muted)]">{item.sellerAr}</p>
              <p className="text-xs font-extrabold text-[var(--brand-emerald)] mt-1">{item.priceDzd} دج</p>
            </motion.button>
          ))}
        </div>
      </div>

      {stall && (
        <section className="rounded-3xl border-2 border-[#E7E2D7] bg-white p-4 space-y-3">
          <p className="text-base font-extrabold text-[var(--kids-ink)]">{stall.itemAr}</p>
          <p className="text-sm font-bold text-[var(--kids-muted)]">{stall.sellerAr} — {stall.priceDzd} دج</p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            data-souk-add={stall.id}
            onClick={() => addItem(stall.id)}
            className="hit-target w-full rounded-2xl bg-[var(--brand-emerald)] text-white text-sm font-extrabold cursor-pointer"
          >
            {t('soukAdd')}
          </motion.button>
        </section>
      )}

      <section className="rounded-3xl border-2 border-[#E7E2D7] bg-white p-4 space-y-3">
        <p className="text-xs font-extrabold text-[var(--kids-muted)]">{t('soukBasket')}</p>
        <p className="text-sm font-extrabold text-[var(--kids-ink)]">
          {basket.length === 0 ? '—' : basket.map((id) => stallById(id)?.itemAr).join(' · ')}
        </p>
        <p className="text-sm font-extrabold text-[var(--brand-emerald)]">{t('soukNeed', { amount: total })}</p>
        <p className="text-xs font-extrabold text-[var(--kids-muted)]">{t('soukWallet')}</p>
        <div className="flex flex-wrap gap-2">
          {SOUK_CASH.filter((value) => mission.wallet.includes(value) || tender.includes(value)).map((value) => (
            <motion.button
              key={value}
              type="button"
              whileTap={{ scale: 0.95 }}
              data-souk-cash={value}
              onClick={() => {
                setPaid(false);
                setTender((prev) => [...prev, value]);
              }}
              className="hit-target min-w-[72px] rounded-2xl bg-[#FFF8E7] border-2 border-[#E7E2D7] text-sm font-extrabold text-[var(--kids-ink)] cursor-pointer"
            >
              {value} دج
            </motion.button>
          ))}
        </div>
        <p className="text-sm font-extrabold">{t('soukTender', { amount: given })}</p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          data-souk-pay="true"
          onClick={pay}
          className="hit-target w-full rounded-2xl bg-[var(--brand-emerald)] text-white text-sm font-extrabold cursor-pointer"
        >
          {t('soukPay')}
        </motion.button>
        {paid && change !== null && (
          <p className="text-sm font-extrabold text-[var(--brand-emerald)]">
            {t('soukChange', { amount: change })}
            {missionComplete(mission, basket) ? ` — ${t('soukMissionOk')}` : ''}
          </p>
        )}
        {paid && change === null && (
          <p className="text-sm font-extrabold text-[var(--kids-ink)]">{t('soukNotEnough')}</p>
        )}
      </section>
    </ImmersiveLabShell>
  );
};

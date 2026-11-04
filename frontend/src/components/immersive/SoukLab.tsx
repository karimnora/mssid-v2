import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ImmersiveLabShell } from './ImmersiveLabShell';
import { SoukItemArt, DinarPiece } from './SoukArt';
import { DidouGuide, type DidouMood } from './DidouGuide';
import { useTranslation } from '../../hooks/useTranslation';
import { useLocaleContext } from '../../context/LocaleContext';
import { speakText } from '../../utils/speech';
import { playCoin, playPop, playRegister, playSoftMiss } from '../../utils/immersiveFeedback';
import { useLabTrace } from '../../utils/labTrace';
import {
  basketTotal,
  SOUK_STALLS,
  soukChange,
  soukChangeChoices,
  soukMissionsForGrade,
  stallById,
  tenderSum,
} from '../../data/immersive/souk';
import type { PrimaryGrade } from '../../types';
import './souk.css';

interface SoukLabProps {
  grade?: PrimaryGrade;
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
}

type Step = 'shop' | 'pay' | 'change' | 'done';
type Mood = DidouMood;

const AWNINGS: Record<string, [string, string]> = {
  bread: ['#F59E0B', '#FEF3C7'],
  milk: ['#2563EB', '#DBEAFE'],
  dates: ['#B45309', '#FFEDD5'],
  veg: ['#15803D', '#DCFCE7'],
};

/**
 * « سوق الحي »: a guided shopping trip. Didou reads every step aloud (shopping list, total,
 * missing money, the change), each tap answers with a sound, and a wrong answer only earns a
 * gentle hint — never a red error.
 */
export const SoukLab: React.FC<SoukLabProps> = ({ grade = '1AP', onBack, onReward }) => {
  const t = useTranslation('labsImmersive');
  const { locale } = useLocaleContext();
  const missions = useMemo(() => soukMissionsForGrade(grade), [grade]);
  const [missionIndex, setMissionIndex] = useState(0);
  const [basket, setBasket] = useState<string[]>([]);
  const [tender, setTender] = useState<number[]>([]); // indexes in mission.wallet
  const [step, setStep] = useState<Step>('shop');
  const [pickedChange, setPickedChange] = useState<number | null>(null);
  const [doneMissions, setDoneMissions] = useState<string[]>([]);
  const [stars, setStars] = useState(0);
  const trace = useLabTrace('souk_lab', grade);
  const [line, setLine] = useState('');
  const [mood, setMood] = useState<Mood>('talk');
  const [shake, setShake] = useState<string | null>(null);
  const payRef = useRef<HTMLElement>(null);

  const mission = missions[missionIndex] ?? missions[0];
  const total = basketTotal(basket);
  const given = tenderSum(tender.map((i) => mission.wallet[i]));
  const change = soukChange(total, given);
  const choices = useMemo(() => (change === null ? [] : soukChangeChoices(change)), [change]);
  const lastMission = missionIndex >= missions.length - 1;

  const say = (text: string, nextMood: Mood = 'talk') => {
    setLine(text);
    setMood(nextMood);
    try {
      void speakText(text, locale === 'fr' ? 'fr-FR' : 'ar-SA').catch(() => undefined);
    } catch {
      /* no speech engine */
    }
  };

  // Didou welcomes each new mission.
  useEffect(() => {
    say(`${t('soukDidouHello')} ${mission.briefAr}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission.id]);

  useEffect(() => {
    if (step === 'pay' || step === 'change') payRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  }, [step]);

  const buy = (id: string) => {
    if (step !== 'shop') return;
    const item = stallById(id);
    if (!item) return;
    if (!mission.stallIds.includes(id)) {
      playSoftMiss();
      trace.miss('street');
      setShake(id);
      window.setTimeout(() => setShake(null), 500);
      say(t('soukDidouNotOnList'), 'think');
      return;
    }
    if (basket.includes(id)) {
      say(t('soukDidouAlready'), 'think');
      return;
    }
    const next = [...basket, id];
    setBasket(next);
    playPop();
    const bought = t('soukDidouBought', { item: item.itemAr, price: item.priceDzd });
    if (mission.stallIds.every((needed) => next.includes(needed))) {
      setStep('pay');
      say(`${bought} ${t('soukDidouPay', { total: basketTotal(next) })}`, 'happy');
    } else {
      say(bought, 'happy');
    }
  };

  const putMoney = (index: number) => {
    if (step !== 'pay' || tender.includes(index)) return;
    setTender((prev) => [...prev, index]);
    playCoin();
  };

  const takeBack = (index: number) => {
    if (step !== 'pay') return;
    setTender((prev) => prev.filter((i) => i !== index));
    playPop();
  };

  const pay = () => {
    if (step !== 'pay') return;
    if (change === null) {
      playSoftMiss();
      trace.miss('street');
      say(t('soukDidouMissing', { amount: total - given }), 'think');
      return;
    }
    setPickedChange(null);
    setStep('change');
    say(t('soukDidouAskChange', { given }));
  };

  const chooseChange = (amount: number) => {
    if (step !== 'change' || change === null) return;
    setPickedChange(amount);
    if (amount !== change) {
      playSoftMiss();
      trace.miss('street');
      say(t('soukDidouHint', { given, total }), 'think');
      return;
    }
    playRegister();
    setStep('done');
    trace.success('street');
    const win = t('soukDidouWin', { change });
    say(lastMission ? `${win} ${t('soukDidouAllDone')}` : win, 'happy');
    if (doneMissions.includes(mission.id)) return;
    setDoneMissions((prev) => [...prev, mission.id]);
    setStars((n) => n + 1);
    onReward?.(8, 20);
  };

  const nextMission = () => {
    setMissionIndex((index) => Math.min(index + 1, missions.length - 1));
    setBasket([]);
    setTender([]);
    setPickedChange(null);
    setStep('shop');
  };

  // Didou's bubble follows the current step: above the stalls while shopping, on top of the till after.
  const guide = (
    <DidouGuide line={line} mood={mood} lang={locale === 'fr' ? 'fr' : 'ar'} listenLabel={t('listenDidou')} onReplay={() => say(line, mood)} />
  );

  return (
    <ImmersiveLabShell
      badge={t('soukBadge')}
      title={t('soukTitle')}
      intro={t('soukIntro')}
      tabs={[{ id: 'street', label: t('soukMissionIndex', { current: missionIndex + 1, total: missions.length }) }]}
      activeTab="street"
      onTab={() => undefined}
      stars={stars}
      onBack={onBack}
    >
      {step === 'shop' && guide}

      {/* Shopping list. */}
      <section className="souk-list" aria-label={t('soukList')}>
        <p className="souk-list-title">{t('soukList')}</p>
        <ul>
          {mission.stallIds.map((id) => {
            const item = stallById(id);
            const got = basket.includes(id);
            return (
              <li key={id} data-souk-list-item={id} data-got={got ? 'true' : 'false'}>
                <SoukItemArt id={id} size={40} />
                <span>{item?.itemAr}</span>
                <span className="souk-check" aria-hidden="true">{got ? '✓' : ''}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* The street: tap a stall to buy. */}
      <section className="souk-street" data-step={step}>
        <div className="souk-sun" aria-hidden="true" />
        <div className="souk-stalls">
          {SOUK_STALLS.map((item) => {
            const [awning, cloth] = AWNINGS[item.id] ?? ['#64748B', '#F1F5F9'];
            const inBasket = basket.includes(item.id);
            return (
              <motion.button
                key={item.id}
                type="button"
                data-souk-stall={item.id}
                onClick={() => buy(item.id)}
                whileTap={{ scale: 0.94 }}
                animate={shake === item.id ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                transition={{ duration: 0.45 }}
                disabled={step !== 'shop'}
                className="souk-stall"
                style={{ ['--awning' as string]: awning, ['--cloth' as string]: cloth } as React.CSSProperties}
                aria-label={`${item.nameAr} — ${item.itemAr} — ${item.priceDzd} دج`}
              >
                <span className="souk-awning" aria-hidden="true" />
                <span className="souk-stall-name">{item.nameAr}</span>
                <motion.span
                  className="souk-goods"
                  animate={inBasket ? { scale: [1, 1.25, 0.9], opacity: 0.35 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <SoukItemArt id={item.id} size={64} />
                </motion.span>
                <span className="souk-price" dir="rtl">{item.priceDzd} دج</span>
                <span className="souk-seller">{item.sellerAr}</span>
              </motion.button>
            );
          })}
        </div>
        <div className="souk-basket" aria-label={t('soukBasket')}>
          <span className="souk-basket-icon" aria-hidden="true">🧺</span>
          <div className="souk-basket-items">
            <AnimatePresence>
              {basket.map((id) => (
                <motion.span key={id} initial={{ y: -60, scale: 0.4, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 16 }}>
                  <SoukItemArt id={id} size={40} />
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <span className="souk-total" dir="rtl" data-souk-total={total}>{t('soukNeed', { amount: total })}</span>
        </div>
      </section>

      {/* Paying: wallet, counter, then the change. */}
      {step !== 'shop' && (
        <section ref={payRef} className="souk-pay" data-souk-step={step}>
          {guide}
          <p className="souk-pay-title">{t('soukWallet')}</p>
          <div className="souk-money">
            {mission.wallet.map((value, index) => (
              <motion.button
                key={`w${index}`}
                type="button"
                data-souk-cash={value}
                whileTap={{ scale: 0.9 }}
                disabled={step !== 'pay' || tender.includes(index)}
                onClick={() => putMoney(index)}
                className="souk-piece"
                aria-label={`${value} دج`}
                style={{ opacity: tender.includes(index) ? 0.25 : 1 }}
              >
                <DinarPiece value={value} />
              </motion.button>
            ))}
          </div>

          <p className="souk-pay-title">{t('soukCounter')}</p>
          <div className="souk-counter" data-souk-given={given}>
            <AnimatePresence>
              {tender.map((index) => (
                <motion.button
                  key={`t${index}`}
                  type="button"
                  initial={{ y: -50, opacity: 0, rotate: -20 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -30, opacity: 0 }}
                  onClick={() => takeBack(index)}
                  disabled={step !== 'pay'}
                  className="souk-piece"
                  aria-label={`${t('soukTakeBack')} — ${mission.wallet[index]} دج`}
                >
                  <DinarPiece value={mission.wallet[index]} size={52} />
                </motion.button>
              ))}
            </AnimatePresence>
            <span className="souk-given" dir="rtl">{t('soukTender', { amount: given })}</span>
          </div>

          {step === 'pay' && (
            <motion.button type="button" data-souk-pay="true" data-primary-cta="souk-pay" whileTap={{ scale: 0.95 }} onClick={pay} className="souk-cta">
              {t('soukPay')}
            </motion.button>
          )}

          {(step === 'change' || step === 'done') && change !== null && (
            <div className="souk-change">
              <p className="souk-pay-title">{t('soukAskChange')}</p>
              <div className="souk-change-choices">
                {choices.map((amount) => (
                  <motion.button
                    key={amount}
                    type="button"
                    data-souk-change={amount}
                    data-quiz-option={step === 'done' ? (amount === change ? 'correct' : 'muted') : pickedChange === amount ? 'retry' : 'idle'}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => chooseChange(amount)}
                    disabled={step === 'done'}
                    className="souk-change-choice"
                  >
                    <span dir="rtl">{amount} دج</span>
                  </motion.button>
                ))}
              </div>
              {step === 'done' && (
                <p className="souk-win" role="status">{t('soukChange', { amount: change })} — {t('soukMissionOk')}</p>
              )}
            </div>
          )}

          {step === 'done' && !lastMission && (
            <motion.button type="button" data-souk-next="true" data-primary-cta="souk-next" whileTap={{ scale: 0.95 }} onClick={nextMission} className="souk-cta">
              {t('soukNextMission')}
            </motion.button>
          )}
        </section>
      )}
    </ImmersiveLabShell>
  );
};

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ImmersiveLabShell } from './ImmersiveLabShell';
import { CountryFlag } from './CountryFlag';
import { DidouGuide, type DidouMood } from './DidouGuide';
import { useTranslation } from '../../hooks/useTranslation';
import { useLocaleContext } from '../../context/LocaleContext';
import { speakText } from '../../utils/speech';
import { playPop, playRegister, playSoftMiss } from '../../utils/immersiveFeedback';
import {
  countriesByRegion,
  countryById,
  flagRound,
  flagRoundOrder,
  MAGHREB_LAYOUT,
  WORLD_COUNTRIES,
  type WorldCountry,
} from '../../data/immersive/worldFlags';
import './worldFlags.css';

interface WorldFlagsLabProps {
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
}

function CountryTile({ country, selected, featured, onSelect }: { country: WorldCountry; selected: boolean; featured?: boolean; onSelect: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      data-flag-country={country.id}
      aria-pressed={selected}
      onClick={onSelect}
      className={`flags-tile ${featured ? 'is-featured' : ''}`}
    >
      <CountryFlag countryId={country.id} className="w-full aspect-[3/2]" />
      <p dir="rtl" className="flags-tile-name">{country.nameAr}</p>
    </motion.button>
  );
}

/**
 * « خريطة البلدان والأعلام »: Didou tells the story of each country aloud (name, capital, a fact),
 * the chosen flag waves, and « أين العلم؟ » asks the child to find a flag among four.
 */
export const WorldFlagsLab: React.FC<WorldFlagsLabProps> = ({ onBack, onReward }) => {
  const t = useTranslation('labsImmersive');
  const { locale } = useLocaleContext();
  const lang = locale === 'fr' ? 'fr' : 'ar';
  const [tab, setTab] = useState('map');
  const [selected, setSelected] = useState(WORLD_COUNTRIES[0]);
  const [stars, setStars] = useState(0);
  const [line, setLine] = useState('');
  const [mood, setMood] = useState<DidouMood>('talk');

  const order = useMemo(() => flagRoundOrder(), []);
  const [roundIndex, setRoundIndex] = useState(0);
  const round = useMemo(() => flagRound(order[roundIndex % order.length]), [order, roundIndex]);
  const [missed, setMissed] = useState<string[]>([]);
  const [found, setFound] = useState(false);

  const say = (text: string, nextMood: DidouMood = 'talk', voice: 'ar' | 'fr' = lang) => {
    setLine(text);
    setMood(nextMood);
    try {
      void speakText(text, voice === 'fr' ? 'fr-FR' : 'ar-SA').catch(() => undefined);
    } catch {
      /* no speech engine */
    }
  };

  // Country names, capitals and facts are written in Arabic: Didou reads them with the Arabic voice.
  const tellCountry = (country: WorldCountry) =>
    say(t('flagsDidouCountry', { name: country.nameAr, capital: country.capitalAr, fact: country.factAr }), 'happy', 'ar');

  useEffect(() => {
    if (tab === 'map') say(t('flagsDidouHello'));
    else say(t('flagsDidouFind', { name: round.target.nameAr }), 'talk', 'ar');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, round.target.id]);

  const openCountry = (country: WorldCountry) => {
    setSelected(country);
    playPop();
    tellCountry(country);
  };

  const pickFlag = (country: WorldCountry) => {
    if (found) return;
    if (country.id !== round.target.id) {
      playSoftMiss();
      setMissed((prev) => (prev.includes(country.id) ? prev : [...prev, country.id]));
      say(t('flagsDidouWrong', { name: country.nameAr }), 'think', 'ar');
      return;
    }
    playRegister();
    setFound(true);
    say(t('flagsDidouRight', { name: country.nameAr }), 'happy', 'ar');
    // A star only for a flag found at the first try: guessing all four earns nothing.
    if (missed.length === 0) {
      setStars((n) => n + 1);
      onReward?.(5, 12);
    }
  };

  const nextRound = () => {
    setRoundIndex((n) => n + 1);
    setMissed([]);
    setFound(false);
  };

  const regionLabel = selected.region === 'maghreb' ? t('flagsMaghreb') : selected.region === 'sahel' ? t('flagsSahel') : t('flagsMashriq');
  const guide = <DidouGuide line={line} mood={mood} lang={lang} listenLabel={t('listenDidou')} onReplay={() => say(line, mood, /[؀-ۿ]/.test(line) ? 'ar' : lang)} />;

  return (
    <ImmersiveLabShell
      badge={t('flagsBadge')}
      title={t('flagsTitle')}
      intro={t('flagsIntro')}
      tabs={[
        { id: 'map', label: t('flagsTabMap') },
        { id: 'quiz', label: t('flagsTabQuiz') },
      ]}
      activeTab={tab}
      onTab={setTab}
      stars={stars}
      onBack={onBack}
    >
      {guide}

      {tab === 'map' && (
        <section className="space-y-4">
          <article className="flags-stage" data-flag-selected={selected.id}>
            <div className="flags-pole" aria-hidden="true" />
            <motion.div key={selected.id} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="flags-waving">
              <CountryFlag countryId={selected.id} className="w-full aspect-[3/2]" />
            </motion.div>
            <div className="flags-card">
              <p className="flags-region">{regionLabel}</p>
              <h2 className="flags-name">{selected.nameAr}</h2>
              <p className="flags-capital">{t('flagsCapital')} {selected.capitalAr}</p>
              <p className="flags-fact">{selected.factAr}</p>
            </div>
          </article>

          <article className="flags-region-box">
            <p className="flags-region-title">{t('flagsMaghreb')}</p>
            <div dir="ltr" className="grid grid-cols-3 gap-2">
              {MAGHREB_LAYOUT.map((id, index) => {
                if (!id) return <div key={`empty-${index}`} />;
                const country = countryById(id);
                if (!country) return <div key={id} />;
                return <CountryTile key={id} country={country} selected={selected.id === id} featured={id === 'dz'} onSelect={() => openCountry(country)} />;
              })}
            </div>
          </article>

          <article className="flags-region-box">
            <p className="flags-region-title">{t('flagsSahel')}</p>
            <div className="grid grid-cols-2 gap-2">
              {countriesByRegion('sahel').map((country) => (
                <CountryTile key={country.id} country={country} selected={selected.id === country.id} onSelect={() => openCountry(country)} />
              ))}
            </div>
          </article>

          <article className="flags-region-box">
            <p className="flags-region-title">{t('flagsMashriq')}</p>
            <div className="grid grid-cols-3 gap-2">
              {countriesByRegion('mashriq').map((country) => (
                <CountryTile key={country.id} country={country} selected={selected.id === country.id} onSelect={() => openCountry(country)} />
              ))}
            </div>
          </article>
        </section>
      )}

      {tab === 'quiz' && (
        <section className="flags-quiz" data-flag-round={round.target.id}>
          <p className="flags-quiz-question" dir="rtl">{t('flagsDidouFind', { name: round.target.nameAr })}</p>
          <div className="flags-quiz-grid">
            {round.options.map((country) => {
              const state = found ? (country.id === round.target.id ? 'correct' : 'muted') : missed.includes(country.id) ? 'retry' : 'idle';
              return (
                <motion.button
                  key={country.id}
                  type="button"
                  whileTap={{ scale: 0.93 }}
                  animate={state === 'retry' ? { x: [0, -6, 6, -3, 3, 0] } : state === 'correct' ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 0.45 }}
                  data-flag-option={country.id}
                  data-state={state}
                  onClick={() => pickFlag(country)}
                  disabled={found || state === 'retry'}
                  className="flags-option"
                  aria-label={found || state === 'retry' ? country.nameAr : `${t('flagsTabQuiz')} ${round.options.indexOf(country) + 1}`}
                >
                  <CountryFlag countryId={country.id} className="w-full aspect-[3/2]" />
                  {(found || state === 'retry') && <span className="flags-option-name" dir="rtl">{country.nameAr}</span>}
                </motion.button>
              );
            })}
          </div>
          {found && (
            <motion.button type="button" data-flag-next="true" data-primary-cta="flags-next" whileTap={{ scale: 0.95 }} onClick={nextRound} className="flags-next">
              {t('next')}
            </motion.button>
          )}
        </section>
      )}
    </ImmersiveLabShell>
  );
};

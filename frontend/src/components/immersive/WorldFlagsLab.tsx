import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ImmersiveLabShell, QuizBlock } from './ImmersiveLabShell';
import { CountryFlag } from './CountryFlag';
import { useTranslation } from '../../hooks/useTranslation';
import { playSoftSuccess, speakArSafe } from '../../utils/immersiveFeedback';
import {
  countriesByRegion,
  countryById,
  FLAG_QUIZ,
  MAGHREB_LAYOUT,
  WORLD_COUNTRIES,
  type WorldCountry,
} from '../../data/immersive/worldFlags';

interface WorldFlagsLabProps {
  onBack?: () => void;
  onReward?: (coins: number, xp: number) => void;
}

function CountryTile({
  country,
  selected,
  featured,
  onSelect,
}: {
  country: WorldCountry;
  selected: boolean;
  featured?: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      data-flag-country={country.id}
      onClick={onSelect}
      className={`w-full rounded-2xl border-2 p-2 text-center cursor-pointer ${
        selected
          ? 'border-[#008751] bg-white shadow-sm'
          : 'border-[#E7E2D7] bg-white'
      } ${featured ? 'p-2.5' : ''}`}
    >
      <CountryFlag countryId={country.id} className="w-full aspect-[3/2]" />
      <p dir="rtl" className="mt-1.5 text-[11px] font-extrabold text-[var(--kids-ink)] leading-tight">{country.nameAr}</p>
    </motion.button>
  );
}

export const WorldFlagsLab: React.FC<WorldFlagsLabProps> = ({ onBack, onReward }) => {
  const t = useTranslation('labsImmersive');
  const [tab, setTab] = useState('map');
  const [selected, setSelected] = useState(WORLD_COUNTRIES[0]);
  const [quiz, setQuiz] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [stars, setStars] = useState(0);

  const openCountry = (country: WorldCountry) => {
    setSelected(country);
    speakArSafe(`${country.nameAr}. العاصمة ${country.capitalAr}.`);
  };

  const regionLabel =
    selected.region === 'maghreb' ? t('flagsMaghreb') : selected.region === 'sahel' ? t('flagsSahel') : t('flagsMashriq');

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
      {tab === 'map' && (
        <section className="space-y-4">
          <article className="rounded-[28px] border-2 border-[#E7E2D7] bg-white overflow-hidden">
            <div className="bg-[#FFF8E7] px-5 pt-5 pb-4">
              <div className="mx-auto w-full max-w-[300px]">
                <CountryFlag countryId={selected.id} className="w-full aspect-[3/2] shadow-md" />
              </div>
            </div>
            <div className="p-5 space-y-2">
              <p className="text-[11px] font-extrabold text-[var(--kids-muted)]">{regionLabel}</p>
              <h2 className="text-2xl font-extrabold text-[var(--kids-ink)] leading-tight">{selected.nameAr}</h2>
              <p className="text-sm font-extrabold text-[#008751]">
                {t('flagsCapital')} {selected.capitalAr}
              </p>
              <p className="text-[15px] font-bold text-[var(--kids-ink)] leading-relaxed">{selected.factAr}</p>
            </div>
          </article>

          <article className="rounded-[28px] border-2 border-[#E7E2D7] bg-[#FFFBF0] p-4 space-y-3">
            <p className="text-xs font-extrabold text-[var(--kids-muted)]">{t('flagsMaghreb')}</p>
            <div className="relative overflow-hidden rounded-3xl border border-[#E7E2D7] bg-[#F3EFE4]">
              <div className="h-9 bg-[#E4EEF2]" aria-hidden />
              <div dir="ltr" className="grid grid-cols-3 gap-2 p-3">
                {MAGHREB_LAYOUT.map((id, index) => {
                  if (!id) return <div key={`empty-${index}`} />;
                  const country = countryById(id);
                  if (!country) return <div key={id} />;
                  return (
                    <CountryTile
                      key={id}
                      country={country}
                      selected={selected.id === id}
                      featured={id === 'dz'}
                      onSelect={() => openCountry(country)}
                    />
                  );
                })}
              </div>
            </div>
          </article>

          <article className="space-y-2">
            <p className="text-xs font-extrabold text-[var(--kids-muted)]">{t('flagsSahel')}</p>
            <div className="grid grid-cols-2 gap-2">
              {countriesByRegion('sahel').map((country) => (
                <CountryTile
                  key={country.id}
                  country={country}
                  selected={selected.id === country.id}
                  onSelect={() => openCountry(country)}
                />
              ))}
            </div>
          </article>

          <article className="space-y-2">
            <p className="text-xs font-extrabold text-[var(--kids-muted)]">{t('flagsMashriq')}</p>
            <div className="grid grid-cols-3 gap-2">
              {countriesByRegion('mashriq').map((country) => (
                <CountryTile
                  key={country.id}
                  country={country}
                  selected={selected.id === country.id}
                  onSelect={() => openCountry(country)}
                />
              ))}
            </div>
          </article>
        </section>
      )}

      {tab === 'quiz' && (
        <QuizBlock
          questionAr={FLAG_QUIZ[quiz].questionAr}
          optionsAr={FLAG_QUIZ[quiz].optionsAr}
          correctAr={FLAG_QUIZ[quiz].correctAr}
          picked={picked}
          onPick={(option, ok) => {
            setPicked(option);
            if (ok) {
              playSoftSuccess();
              setStars((n) => n + 1);
              onReward?.(5, 12);
              window.setTimeout(() => {
                setQuiz((n) => (n + 1) % FLAG_QUIZ.length);
                setPicked(null);
              }, 700);
            }
          }}
        />
      )}
    </ImmersiveLabShell>
  );
};

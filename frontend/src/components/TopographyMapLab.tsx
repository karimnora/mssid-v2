import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';
import {
  ALGERIA_MAP_BANDS,
  ALGERIA_MAP_CITIES,
  ALGERIA_MAP_SEA,
  ALGERIA_MAP_VIEWBOX,
  ALGERIA_OUTLINE_PATH,
} from '../data/algeriaMapOutline';

interface TopographyMapLabProps {
  onReward?: (coins: number, xp: number) => void;
  onBack?: () => void;
}

interface ReliefRegion {
  id: string;
  nameAr: string;
  shortAr: string;
  icon: string;
  reliefAr: string;
  climateAr: string;
  rainfallAr: string;
  vegetationAr: string;
  heightPct: number;
  color: string;
  fill: string;
  fillSelected: string;
}

const REGION_LABELS: Record<string, { x: number; y: number; size: number }> = {
  tell: { x: 250, y: 82, size: 11 },
  high_plateaus: { x: 248, y: 114, size: 11 },
  saharan_atlas: { x: 240, y: 152, size: 11 },
  sahara: { x: 248, y: 300, size: 16 },
};

const REGIONS: ReliefRegion[] = [
  {
    id: 'tell',
    nameAr: 'التَّلُّ (المُنَاطِقُ السَّاحِلِيَّةُ)',
    shortAr: 'التَّلُّ',
    icon: '🏔️🌊',
    reliefAr: 'جِبَالٌ سَاحِلِيَّةٌ وَسُهُولٌ خِصْبَةٌ عَلَى البَحْرِ الأَبْيَضِ المُتَوَسِّطِ.',
    climateAr: 'مُعْتَدِلٌ رَطْبٌ (مَتَوَسِّطِيٌّ)',
    rainfallAr: 'عَالِيَةٌ 🌧️',
    vegetationAr: '🌳🍇 غَابَاتٌ وَبَسَاتِينُ',
    heightPct: 45,
    color: 'from-emerald-600 to-teal-700',
    fill: '#0f766e',
    fillSelected: '#008751',
  },
  {
    id: 'high_plateaus',
    nameAr: 'الهِضَابُ العُلْيَا',
    shortAr: 'الهِضَابُ العُلْيَا',
    icon: '⛰️',
    reliefAr: 'سُهُولٌ مُرْتَفِعَةٌ وَشُطُوطٌ مِلْحِيَّةٌ بَيْنَ سِلْسِلَتَيِ الأَطْلَسِ.',
    climateAr: 'قَارِّيٌّ: صَيْفٌ حَارٌّ وَشِتَاءٌ بَارِدٌ',
    rainfallAr: 'مُتَوَسِّطَةٌ ⛅',
    vegetationAr: '🌾 حَلْفَاءُ وَمَرَاعٍ',
    heightPct: 60,
    color: 'from-amber-600 to-yellow-700',
    fill: '#b45309',
    fillSelected: '#d97706',
  },
  {
    id: 'saharan_atlas',
    nameAr: 'الأَطْلَسُ الصَّحْرَاوِيُّ',
    shortAr: 'الأَطْلَسُ الصَّحْرَاوِيُّ',
    icon: '🏞️',
    reliefAr: 'سِلْسِلَةٌ جَبَلِيَّةٌ تَفْصِلُ الهِضَابَ العُلْيَا عَنِ الصَّحْرَاءِ.',
    climateAr: 'بَارِدٌ شِتَاءً، جَافٌّ صَيْفاً',
    rainfallAr: 'ضَعِيفَةٌ 🌤️',
    vegetationAr: '🌲 غَابَاتٌ جَبَلِيَّةٌ قَلِيلَةٌ',
    heightPct: 75,
    color: 'from-orange-600 to-amber-800',
    fill: '#9a3412',
    fillSelected: '#ea580c',
  },
  {
    id: 'sahara',
    nameAr: 'الصَّحْرَاءُ الكُبْرَى',
    shortAr: 'الصَّحْرَاءُ',
    icon: '🏜️',
    reliefAr: 'كُثْبَانٌ رَمْلِيَّةٌ (العِرْقُ) وَهِضَابٌ صَخْرِيَّةٌ (الطَّاسِيلِي وَالهَقَّارُ).',
    climateAr: 'صَحْرَاوِيٌّ: حَارٌّ جِدّاً نَهَاراً وَبَارِدٌ لَيْلاً',
    rainfallAr: 'نَادِرَةٌ جِدّاً ☀️',
    vegetationAr: '🌴 وَاحَاتُ النَّخِيلِ فَقَطْ',
    heightPct: 20,
    color: 'from-rose-600 to-red-800',
    fill: '#9f1239',
    fillSelected: '#c42a23',
  },
];

const QUIZ_QUESTIONS = [
  { id: 1, qAr: 'أَيْنَ نَجِدُ أَعْلَى نِسْبَةِ أَمْطَارٍ فِي الجَزَائِرِ؟', correct: 'tell', options: ['tell', 'sahara', 'high_plateaus'] },
  { id: 2, qAr: 'أَيْنَ تَقَعُ وَاحَاتُ النَّخِيلِ؟', correct: 'sahara', options: ['sahara', 'tell', 'saharan_atlas'] },
  { id: 3, qAr: 'أَيْنَ نَجِدُ الشُّطُوطَ المِلْحِيَّةَ؟', correct: 'high_plateaus', options: ['high_plateaus', 'tell', 'sahara'] },
];

const selectRegionFromKeyboard = (event: React.KeyboardEvent, onSelect: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onSelect();
  }
};

const AlgeriaReliefMap: React.FC<{
  selectedId: string;
  onSelect: (id: string) => void;
  seaLabel: string;
}> = ({ selectedId, onSelect, seaLabel }) => {
  return (
    <svg
      viewBox={ALGERIA_MAP_VIEWBOX}
      className="w-full max-w-[380px] h-auto"
      role="group"
      aria-label="خريطة تضاريس الجزائر — اختر منطقة"
    >
      <defs>
        <clipPath id="algeria-relief-clip">
          <path d={ALGERIA_OUTLINE_PATH} />
        </clipPath>
        {REGIONS.map((region) => (
          <linearGradient key={region.id} id={`topo-fill-${region.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={region.fillSelected} />
            <stop offset="100%" stopColor={region.fill} />
          </linearGradient>
        ))}
      </defs>

      <rect x={ALGERIA_MAP_SEA.x0} y="8" width={ALGERIA_MAP_SEA.x1 - ALGERIA_MAP_SEA.x0} height={ALGERIA_MAP_SEA.y1 - 8} rx="28" fill="#7dd3fc" />
      <path
        d={`M${ALGERIA_MAP_SEA.x0 + 16} 30 C${ALGERIA_MAP_SEA.x0 + 70} 18 ${ALGERIA_MAP_SEA.x1 - 70} 18 ${ALGERIA_MAP_SEA.x1 - 16} 30`}
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.55"
      />
      <text x={(ALGERIA_MAP_SEA.x0 + ALGERIA_MAP_SEA.x1) / 2} y="26" textAnchor="middle" fill="#0c4a6e" fontSize="11" fontWeight="800">
        {seaLabel}
      </text>

      <g clipPath="url(#algeria-relief-clip)">
        {REGIONS.map((region) => {
          const band = ALGERIA_MAP_BANDS[region.id];
          const isSelected = selectedId === region.id;
          return (
            <path
              key={region.id}
              d={`M0 ${band.y0} H470 V${band.y1} H0 Z`}
              fill={`url(#topo-fill-${region.id})`}
              opacity={isSelected ? 1 : 0.78}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={region.nameAr}
              data-map-region={region.id}
              onClick={() => onSelect(region.id)}
              onKeyDown={(event) => selectRegionFromKeyboard(event, () => onSelect(region.id))}
            />
          );
        })}
      </g>

      {REGIONS.map((region) => {
        const band = ALGERIA_MAP_BANDS[region.id];
        if (selectedId !== region.id) return null;
        return (
          <g key={`ring-${region.id}`} clipPath="url(#algeria-relief-clip)" pointerEvents="none">
            <path
              d={`M0 ${band.y0} H470 V${band.y1} H0 Z`}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="5"
            />
          </g>
        );
      })}

      <path
        d={ALGERIA_OUTLINE_PATH}
        fill="none"
        stroke="#0f172a"
        strokeWidth="2.2"
        strokeLinejoin="round"
        pointerEvents="none"
      />

      {REGIONS.map((region) => {
        const label = REGION_LABELS[region.id];
        return (
          <text
            key={`label-${region.id}`}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            fill="#fff"
            fontSize={label.size}
            fontWeight="800"
            style={{ paintOrder: 'stroke', stroke: 'rgba(15,23,42,0.35)', strokeWidth: 3 }}
            pointerEvents="none"
          >
            {region.shortAr}
          </text>
        );
      })}

      {ALGERIA_MAP_CITIES.map((city) => {
        const below = city.name === 'تمنراست' || city.name === 'الجزائر';
        return (
          <g key={city.name} pointerEvents="none">
            <circle cx={city.x} cy={city.y} r={selectedId === city.region ? 5 : 3.5} fill="#fff" stroke="#0f172a" strokeWidth="1.4" />
            <text
              x={city.name === 'وهران' ? city.x - 7 : below ? city.x : city.x + 8}
              y={below ? city.y + 16 : city.y + 4}
              textAnchor={city.name === 'وهران' ? 'end' : below ? 'middle' : 'start'}
              fill="#0f172a"
              fontSize="9"
              fontWeight="800"
            >
              {city.name}
            </text>
          </g>
        );
      })}

      <g transform="translate(438, 72)" pointerEvents="none">
        <polygon points="0,-14 9,8 -9,8" fill="#008751" />
        <text y="22" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="800">
          شمال
        </text>
      </g>
    </svg>
  );
};

export const TopographyMapLab: React.FC<TopographyMapLabProps> = ({ onReward, onBack }) => {
  const t = useTranslation('labsSocial');
  const [selectedId, setSelectedId] = useState<string>('tell');
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const selected = REGIONS.find((r) => r.id === selectedId) || REGIONS[0];

  const handleAnswer = (qId: number, optId: string, correct: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: true }));
    if (optId === correct) onReward?.(5, 15);
  };

  return (
    <div className="space-y-6 dir-rtl max-w-5xl mx-auto" dir="rtl">
      <div className="bg-gradient-to-r from-orange-700 via-red-800 to-rose-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-orange-600/40 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="العودة للأدوات"
              className="shrink-0 w-11 h-11 flex items-center justify-center bg-white/15 hover:bg-white/25 text-white rounded-2xl border border-white/30 shadow-sm cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div className="space-y-2 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{t('topographyBadge')}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black font-sans">{t('topographyTitle')}</h1>
            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed max-w-3xl">
              {t('topographyIntro')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-5 sm:p-8 shadow-sm space-y-4">
        <p className="text-xs font-black text-[var(--app-text-muted)] text-center">
          {t('topographyMapInstruction')}
        </p>
        <div dir="ltr" className="rounded-3xl bg-[#FFF8E7] border border-[var(--app-card-border)] px-2 pt-2 pb-2 flex justify-center">
          <AlgeriaReliefMap selectedId={selectedId} onSelect={setSelectedId} seaLabel={t('topographySeaLabel')} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {REGIONS.map((region) => {
            const isSelected = selectedId === region.id;
            return (
              <motion.button
                key={region.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedId(region.id)}
                aria-pressed={isSelected}
                aria-label={region.nameAr}
                data-map-legend={region.id}
                className={`min-h-[var(--hit)] rounded-2xl border-2 px-2 py-2 text-[11px] font-black leading-tight cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-[#FFF8E7] text-[var(--app-text)] shadow-md'
                    : 'border-[var(--app-card-border)] bg-[var(--app-card-bg)] text-[var(--app-text-muted)]'
                }`}
              >
                <span className="mx-1 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: region.fillSelected }} />
                {region.shortAr}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <p className="text-xs font-black text-[var(--app-text-muted)] text-center">
          {t('topographyCrossSectionLabel')}
        </p>
        <p className="text-xs font-black text-[var(--app-text-muted)] text-center">
          {t('topographyInstructionBar')}
        </p>
        {/* dir="ltr": REGIONS is ordered north→south (Tell...Sahara) to match the relief map above
            (also forced dir="ltr" for the same reason) — without it, the page's ambient RTL flips
            the visual order of these flex/grid items to south→north, contradicting the map. */}
        <div dir="ltr" className="flex items-end gap-2 h-40 sm:h-48">
          {REGIONS.map((region) => {
            const isSelected = selectedId === region.id;
            return (
              <motion.button
                key={region.id}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedId(region.id)}
                aria-pressed={isSelected}
                aria-label={region.nameAr}
                data-section-region={region.id}
                className={`flex-1 min-h-[var(--hit)] rounded-t-2xl bg-gradient-to-t ${region.color} text-white flex flex-col items-center justify-end pb-3 gap-1 cursor-pointer relative ${
                  isSelected ? 'ring-4 ring-amber-300 ring-offset-2 shadow-xl z-10' : 'opacity-90'
                }`}
                style={{ height: `${region.heightPct}%` }}
              >
                <span className="text-2xl">{region.icon}</span>
              </motion.button>
            );
          })}
        </div>
        <div dir="ltr" className="grid grid-cols-4 gap-2">
          {REGIONS.map((region) => (
            <p key={region.id} className="text-[10px] sm:text-[11px] font-black text-center text-[var(--app-text-muted)] leading-tight">
              {region.nameAr}
            </p>
          ))}
        </div>
      </div>

      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-[var(--app-text)] flex items-center gap-2">
          <span className="text-2xl">{selected.icon}</span> {selected.nameAr}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)]">
            <p className="text-[10px] font-black text-[var(--app-text-muted)] mb-1">{t('topographyReliefLabel')}</p>
            <p className="text-xs font-bold text-[var(--app-text)] leading-relaxed">{selected.reliefAr}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)]">
            <p className="text-[10px] font-black text-[var(--app-text-muted)] mb-1">{t('topographyClimateLabel')}</p>
            <p className="text-xs font-bold text-[var(--app-text)] leading-relaxed">{selected.climateAr}</p>
            <p className="text-xs font-black text-sky-700 mt-1">{selected.rainfallAr}</p>
          </div>
          <div className="p-3 rounded-2xl bg-[var(--app-card-subtle)] border border-[var(--app-card-border)]">
            <p className="text-[10px] font-black text-[var(--app-text-muted)] mb-1">{t('topographyVegetationLabel')}</p>
            <p className="text-xs font-bold text-[var(--app-text)] leading-relaxed">{selected.vegetationAr}</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-[var(--app-text)]">{t('topographyQuizHeading')}</h3>
        {QUIZ_QUESTIONS.map((q) => {
          const isAnswered = !!answers[q.id];
          return (
            <div key={q.id} className="p-4 rounded-2xl border border-[var(--app-card-border)] bg-[var(--app-card-subtle)] space-y-3">
              <p className="text-xs sm:text-sm font-black text-[var(--app-text)]">{q.qAr}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {q.options.map((optId) => {
                  const isCorrect = optId === q.correct;
                  const opt = REGIONS.find((r) => r.id === optId)!;
                  return (
                    <button
                      key={optId}
                      type="button"
                      onClick={() => !isAnswered && handleAnswer(q.id, optId, q.correct)}
                      className={`p-2.5 min-h-[var(--hit)] rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isAnswered
                          ? isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-black'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                          : 'bg-[var(--app-card-bg)] text-[var(--app-text)] border-[var(--app-card-border)]'
                      }`}
                    >
                      {opt.icon} {opt.nameAr}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

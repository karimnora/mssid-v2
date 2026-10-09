import React, { useMemo, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { ALL_SHORT_SURAHS, type SurahBand } from '../data/quranShortSurahsCatalog';
import { QuranMemorizePlayer } from './QuranMemorizePlayer';

type BandFilter = SurahBand | 'all';

const BANDS: { id: BandFilter; label: string }[] = [
  { id: 'all', label: 'الكل' },
  { id: 'preschool', label: 'التحضيري' },
  { id: '1AP', label: '1AP' },
  { id: '2AP', label: '2AP' },
  { id: '3AP', label: '3AP' },
  { id: '4AP', label: '4AP' },
  { id: '5AP', label: '5AP' },
];

function surahsForBand(id: BandFilter) {
  if (id === 'all') return ALL_SHORT_SURAHS;
  return ALL_SHORT_SURAHS.filter((s) => s.bands.includes(id));
}

export const QuranLabInteractive: React.FC = () => {
  const [band, setBand] = useState<BandFilter>('preschool');
  const list = useMemo(() => surahsForBand(band), [band]);
  const [activeId, setActiveId] = useState(list[0]?.id ?? 'fatiha');
  const current = list.find((s) => s.id === activeId) ?? list[0];

  return (
    <div className="kids-pole rounded-[28px] p-4 sm:p-6 space-y-5" dir="rtl" data-lab-instrument>
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl">
          <BookOpen className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-lg font-black text-amber-300">مختبر السور القصيرة</h2>
          <p className="text-xs font-bold text-emerald-800 mt-0.5">تلاوة ورش، آيةً آيةً، مع بسملة قبل كل سورة</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {BANDS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => {
              setBand(b.id);
              const next = surahsForBand(b.id)[0];
              if (next) setActiveId(next.id);
            }}
            className={`px-4 min-h-12 rounded-2xl text-xs font-black cursor-pointer shrink-0 border ${
              band === b.id ? 'bg-amber-500 text-slate-950 border-amber-300' : 'bg-emerald-900 text-emerald-200 border-emerald-800'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {list.map((s) => (
          <button
            key={s.id}
            type="button"
            data-quran-lab-surah={s.id}
            onClick={() => setActiveId(s.id)}
            className={`px-4 min-h-12 rounded-2xl text-xs font-black cursor-pointer shrink-0 border ${
              current?.id === s.id ? 'bg-emerald-500 text-slate-950 border-emerald-300' : 'bg-slate-900 text-slate-200 border-slate-700'
            }`}
          >
            {s.emoji} {s.nameAr}
          </button>
        ))}
      </div>

      {current && <QuranMemorizePlayer key={current.id} verses={current.verses} variant="lab" />}
    </div>
  );
};

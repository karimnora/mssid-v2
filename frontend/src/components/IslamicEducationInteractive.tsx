import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Heart,
  Sparkles,
  Compass,
  Star,
  Clock,
} from 'lucide-react';
import type { IslamicInteractiveConfig, IslamicQuranExplorer, IslamicQuranVerseItem } from '../types';
import { QuranMemorizePlayer } from './QuranMemorizePlayer';

interface IslamicInteractiveProps {
  config: IslamicInteractiveConfig;
}

/* ==========================================
   PER-LESSON CONFIG-DRIVEN VIEWS
   Rendered when the lesson supplies `islamicInteractive` — shows only the
   single tool relevant to THAT lesson's content, not a fixed 4-tab set.
   ========================================== */
function groupVersesBySurah(verses: IslamicQuranVerseItem[]) {
  const order: string[] = [];
  const map = new Map<string, IslamicQuranVerseItem[]>();
  verses.forEach((v) => {
    if (!map.has(v.surahAr)) {
      order.push(v.surahAr);
      map.set(v.surahAr, []);
    }
    map.get(v.surahAr)!.push(v);
  });
  return order.map((nameAr) => ({ nameAr, verses: map.get(nameAr)! }));
}

/** Full surah on screen. Warsh recitation, spoken basmala, optional mic echo. */
const QuranExplorerView: React.FC<{ config: IslamicQuranExplorer }> = ({ config }) => {
  const surahs = useMemo(() => groupVersesBySurah(config.verses), [config.verses]);
  const [surahIdx, setSurahIdx] = useState(0);
  const current = surahs[Math.min(surahIdx, surahs.length - 1)];

  if (!current) return null;

  return (
    <div className="space-y-4 min-w-0" data-islamic-tool="quran-explorer">
      {surahs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {surahs.map((s, idx) => (
            <button
              key={s.nameAr}
              type="button"
              onClick={() => setSurahIdx(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 border min-h-12 ${
                surahIdx === idx
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md'
                  : 'bg-emerald-900 text-emerald-200 border-emerald-800'
              }`}
            >
              {s.nameAr}
            </button>
          ))}
        </div>
      )}
      <QuranMemorizePlayer key={current.nameAr} verses={current.verses} variant="lab" />
    </div>
  );
};

const ConfiguredIslamicTool: React.FC<{ config: IslamicInteractiveConfig }> = ({ config }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  // Switching to a lesson whose config.steps/scenarios array is shorter than the previous one's,
  // while deep into it, left activeIdx pointing past the new array — crashes config.steps[activeIdx]
  // (meme classe de bug que LessonExplanationView, remonte utilisateur : ecran d'erreur intermittent).
  useEffect(() => {
    setActiveIdx(0);
  }, [config]);

  const headerIcon =
    config.type === 'quran_explorer' ? <BookOpen className="w-6 h-6 text-amber-400" /> :
    config.type === 'ritual_steps' ? <Compass className="w-6 h-6 text-amber-400" /> :
    config.type === 'concept_cards' ? <Star className="w-6 h-6 text-amber-400" /> :
    config.type === 'ethics_scenario' ? <Heart className="w-6 h-6 text-amber-400" /> :
    <Clock className="w-6 h-6 text-amber-400" />;

  return (
    <div className="bg-emerald-950 text-white rounded-3xl p-4 sm:p-6 border border-emerald-800 shadow-2xl space-y-6 dir-rtl min-w-0" dir="rtl">
      <div className="flex items-center gap-3 border-b border-emerald-800 pb-4">
        <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/30">
          {headerIcon}
        </div>
        <div>
          <h2 className="text-lg font-black text-amber-300">{config.titleAr}</h2>
          {'introAr' in config && config.introAr && (
            <p className="text-xs text-emerald-200 mt-1">{config.introAr}</p>
          )}
        </div>
      </div>

      {config.type === 'quran_explorer' && <QuranExplorerView config={config} />}

      {config.type === 'ritual_steps' && (
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {config.steps.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setActiveIdx(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 border flex items-center gap-2 ${
                  activeIdx === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
                    : 'bg-emerald-900 text-emerald-200 border-emerald-800 hover:bg-emerald-850'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.step}. {s.titleAr}</span>
              </button>
            ))}
          </div>
          <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-800 space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
              <span className="text-4xl p-3 bg-emerald-950 rounded-2xl border border-emerald-800">{config.steps[activeIdx].icon}</span>
              <div>
                <h3 className="text-lg font-black text-amber-300">{config.steps[activeIdx].titleAr}</h3>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold inline-block mt-1">
                  {config.steps[activeIdx].tagAr}
                </span>
              </div>
            </div>
            <p className="text-sm font-bold text-slate-200 leading-relaxed bg-emerald-950 p-4 rounded-2xl border border-emerald-800">
              {config.steps[activeIdx].descAr}
            </p>
          </div>
        </div>
      )}

      {config.type === 'concept_cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.concepts.map((c, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer space-y-2 ${
                activeIdx === idx
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl ring-2 ring-amber-400 scale-[1.02]'
                  : 'bg-emerald-900/80 text-emerald-100 border-emerald-800 hover:bg-emerald-850'
              }`}
            >
              <div className="text-sm font-black">{c.nameAr}</div>
              <div className={`text-xs leading-relaxed ${activeIdx === idx ? 'text-slate-900 font-bold' : 'text-emerald-300'}`}>
                {c.descAr}
              </div>
            </button>
          ))}
        </div>
      )}

      {config.type === 'ethics_scenario' && (() => {
        const scenario = config.scenarios[activeIdx];
        return (
          <div className="space-y-6">
            {config.scenarios.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {config.scenarios.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 border ${
                      activeIdx === idx
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
                        : 'bg-emerald-900 text-emerald-200 border-emerald-800 hover:bg-emerald-850'
                    }`}
                  >
                    وضعية {idx + 1}
                  </button>
                ))}
              </div>
            )}
            <EthicsScenarioView scenario={scenario} />
          </div>
        );
      })()}

      {config.type === 'timeline' && (
        <div className="space-y-4">
          {config.events.map((ev, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-slate-950 p-5 rounded-3xl border border-emerald-800">
              <span className="text-3xl p-3 bg-emerald-950 rounded-2xl border border-emerald-800 shrink-0">{ev.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-sm font-black text-amber-300">{ev.titleAr}</h3>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[11px] font-bold">
                    {ev.dateAr}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{ev.descAr}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EthicsScenarioView: React.FC<{ scenario: { titleAr: string; situationAr: string; options: { textAr: string; isCorrect: boolean; feedbackAr: string }[] } }> = ({ scenario }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  return (
    <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-800 space-y-4">
      <h3 className="text-base font-black text-amber-300">✨ {scenario.titleAr}</h3>
      <p className="text-sm font-bold text-slate-200 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 leading-relaxed">
        {scenario.situationAr}
      </p>
      <div className="space-y-3">
        {scenario.options.map((opt, oIdx) => (
          <button
            key={oIdx}
            onClick={() => setSelectedOption(oIdx)}
            className={`w-full p-4 rounded-2xl border text-right text-xs font-bold transition-all cursor-pointer ${
              selectedOption === oIdx
                ? opt.isCorrect
                  ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400'
                  : 'bg-rose-950 border-rose-500 text-rose-200'
                : 'bg-emerald-900/80 border-emerald-800 text-emerald-100 hover:bg-emerald-850'
            }`}
          >
            {opt.textAr}
          </button>
        ))}
      </div>
      {selectedOption !== null && (
        <div className="p-4 bg-emerald-900 border border-emerald-600 rounded-2xl text-xs text-emerald-100 font-bold leading-relaxed animate-in fade-in duration-300">
          {scenario.options[selectedOption].feedbackAr}
        </div>
      )}
    </div>
  );
};

export const IslamicEducationInteractive: React.FC<IslamicInteractiveProps> = ({ config }) => (
  <ConfiguredIslamicTool config={config} />
);

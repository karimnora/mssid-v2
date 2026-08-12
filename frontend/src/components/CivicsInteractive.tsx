import React, { useState } from 'react';
import {
  Landmark,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import type { CivicsInteractiveConfig } from '../types';

interface CivicsInteractiveProps {
  config: CivicsInteractiveConfig;
}

/* ==========================================
   PER-LESSON CONFIG-DRIVEN VIEWS
   Rendered when the lesson supplies `civicsInteractive` — shows only the
   single tool relevant to THAT lesson's content, not a fixed grade-wide set.
   ========================================== */
const ConfiguredCivicsTool: React.FC<{ config: CivicsInteractiveConfig }> = ({ config }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const headerIcon =
    config.type === 'institution_cards' ? <Landmark className="w-6 h-6 text-amber-400" /> :
    <ShieldAlert className="w-6 h-6 text-amber-400" />;

  return (
    <div className="bg-blue-950 text-white rounded-3xl p-6 border border-blue-800 shadow-2xl space-y-6 dir-rtl" dir="rtl">
      <div className="flex items-center gap-3 border-b border-blue-800 pb-4">
        <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/30">
          {headerIcon}
        </div>
        <div>
          <h2 className="text-lg font-black text-amber-300">{config.titleAr}</h2>
          {config.introAr && (
            <p className="text-xs text-blue-200 mt-1">{config.introAr}</p>
          )}
        </div>
      </div>

      {config.type === 'institution_cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {config.cards.map((c, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`w-full p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3 ${
                  activeIdx === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl font-black scale-[1.01]'
                    : 'bg-blue-900/80 border-blue-800 text-blue-100 hover:bg-blue-850 text-sm font-bold'
                }`}
              >
                <span className="text-2xl shrink-0">{c.iconEmoji}</span>
                <span>{c.nameAr}</span>
              </button>
            ))}
          </div>
          <div className="bg-slate-950 p-6 rounded-3xl border border-blue-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <span className="text-3xl">{config.cards[activeIdx].iconEmoji}</span>
              <h3 className="text-base font-black text-amber-300">{config.cards[activeIdx].nameAr}</h3>
            </div>
            <div className="p-4 bg-blue-950 rounded-2xl border border-blue-800 space-y-2">
              <div className="text-xs font-black text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>الدور:</span>
              </div>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">{config.cards[activeIdx].roleAr}</p>
            </div>
            <div className="p-4 bg-blue-950 rounded-2xl border border-blue-800 space-y-2">
              <div className="text-xs font-black text-emerald-400">💡 تفاصيل مفيدة:</div>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">{config.cards[activeIdx].detailsAr}</p>
            </div>
          </div>
        </div>
      )}

      {config.type === 'civic_scenario' && (() => {
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
                        : 'bg-blue-900 text-blue-200 border-blue-800 hover:bg-blue-850'
                    }`}
                  >
                    وضعية {idx + 1}
                  </button>
                ))}
              </div>
            )}
            <CivicScenarioView scenario={scenario} />
          </div>
        );
      })()}
    </div>
  );
};

const CivicScenarioView: React.FC<{ scenario: { titleAr: string; situationAr: string; choices: { textAr: string; isCorrect: boolean; feedbackAr: string }[] } }> = ({ scenario }) => {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  return (
    <div className="bg-slate-950 p-6 rounded-3xl border border-blue-800 space-y-4">
      <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5" />
        <span>{scenario.titleAr}</span>
      </h3>
      <p className="text-sm font-bold text-slate-200 bg-blue-950 p-4 rounded-2xl border border-blue-800 leading-relaxed">
        {scenario.situationAr}
      </p>
      <div className="space-y-3">
        {scenario.choices.map((choice, cIdx) => (
          <button
            key={cIdx}
            onClick={() => setSelectedChoice(cIdx)}
            className={`w-full p-4 rounded-2xl border text-right text-xs font-bold transition-all cursor-pointer ${
              selectedChoice === cIdx
                ? choice.isCorrect
                  ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400'
                  : 'bg-rose-950 border-rose-500 text-rose-200'
                : 'bg-blue-900/80 border-blue-800 text-blue-100 hover:bg-blue-850'
            }`}
          >
            {choice.textAr}
          </button>
        ))}
      </div>
      {selectedChoice !== null && (
        <div className="p-4 bg-blue-900 border border-blue-600 rounded-2xl text-xs text-blue-100 font-bold leading-relaxed animate-in fade-in duration-300">
          {scenario.choices[selectedChoice].feedbackAr}
        </div>
      )}
    </div>
  );
};

export const CivicsInteractive: React.FC<CivicsInteractiveProps> = ({ config }) => (
  <ConfiguredCivicsTool config={config} />
);

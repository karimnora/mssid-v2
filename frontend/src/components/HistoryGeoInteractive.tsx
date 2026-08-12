import React, { useState } from 'react';
import {
  Clock,
  Map,
  Scroll,
  Leaf,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import type { HistoryGeoInteractiveConfig } from '../types';

interface HistoryGeoProps {
  config: HistoryGeoInteractiveConfig;
}

/* ==========================================
   PER-LESSON CONFIG-DRIVEN VIEWS
   Rendered when the lesson supplies `historyGeoInteractive` — shows only the
   single module relevant to THAT lesson's content, not a fixed grade-wide set.
   ========================================== */
const ConfiguredHistoryGeoTool: React.FC<{ config: HistoryGeoInteractiveConfig }> = ({ config }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const headerIcon =
    config.type === 'timeline_map' ? <Clock className="w-6 h-6 text-amber-400" /> :
    config.type === 'region_explorer' ? <Map className="w-6 h-6 text-amber-400" /> :
    config.type === 'archaeology_sources' ? <Scroll className="w-6 h-6 text-amber-400" /> :
    config.type === 'climate_vegetation_matching' ? <Leaf className="w-6 h-6 text-amber-400" /> :
    <ShieldAlert className="w-6 h-6 text-amber-400" />;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6 dir-rtl" dir="rtl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/30">
          {headerIcon}
        </div>
        <div>
          <h2 className="text-lg font-black text-amber-300">{config.titleAr}</h2>
          {config.introAr && (
            <p className="text-xs text-slate-400 mt-1">{config.introAr}</p>
          )}
        </div>
      </div>

      {config.type === 'timeline_map' && (
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {config.events.map((ev, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 border flex items-center gap-2 ${
                  activeIdx === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <span className="font-mono">{ev.year}</span>
              </button>
            ))}
          </div>
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <h3 className="text-base font-black text-amber-300">{config.events[activeIdx].labelAr}</h3>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-bold">
                {config.events[activeIdx].year}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-200 leading-relaxed bg-slate-900 p-4 rounded-2xl border border-slate-800">
              {config.events[activeIdx].detailsAr}
            </p>
            {config.events[activeIdx].region && (
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                <Map className="w-3.5 h-3.5" />
                <span>المنطقة: {config.events[activeIdx].region}</span>
              </div>
            )}
          </div>
          {config.mapOverlay && (
            <div className="p-3 bg-slate-800/70 rounded-2xl border border-slate-700 text-[11px] text-slate-400 flex items-start gap-2">
              <Map className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{config.mapOverlay}</span>
            </div>
          )}
        </div>
      )}

      {config.type === 'region_explorer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {config.regions.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => setActiveIdx(idx)}
                className={`w-full p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                  activeIdx === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl font-black scale-[1.01]'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700 text-sm font-bold'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{r.nameAr}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeIdx === idx ? 'bg-slate-950/20' : 'bg-slate-950/60 text-amber-300'}`}>
                    {r.areaRange}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-300">{config.regions[activeIdx].nameAr}</h3>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-bold">
                {config.regions[activeIdx].areaRange}
              </span>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>الخصائص الجغرافية:</span>
              </div>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">{config.regions[activeIdx].characteristics}</p>
            </div>
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs font-black text-sky-400">🌡️ المناخ:</div>
              <p className="text-sm font-bold text-slate-200 leading-relaxed">{config.regions[activeIdx].climate}</p>
            </div>
          </div>
        </div>
      )}

      {config.type === 'archaeology_sources' && (
        <div className="space-y-4">
          {config.sources.map((s) => (
            <div key={s.id} className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-black text-amber-300 flex items-center gap-2">
                  <Scroll className="w-4 h-4 text-amber-400" />
                  <span>{s.titleAr}</span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-full text-[11px] font-bold">
                    {sourceTypeLabelAr(s.type)}
                  </span>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[11px] font-mono font-bold">
                    {s.period}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-2xl border border-slate-800">
                {s.descriptionAr}
              </p>
            </div>
          ))}
        </div>
      )}

      {config.type === 'climate_vegetation_matching' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {config.zones.map((z, idx) => (
            <div key={idx} className="p-5 rounded-3xl border border-slate-700 bg-slate-800/80 space-y-3">
              <h3 className="text-sm font-black text-amber-300">{z.zoneAr}</h3>
              <div className="flex items-center gap-2 text-xs text-sky-300 font-bold">
                <span>🌧️</span>
                <span>{z.rainfall}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-black text-emerald-400">🌿 الغطاء النباتي:</div>
                <p className="text-xs text-slate-200 leading-relaxed">{z.floraAr}</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-black text-orange-400">🦎 الحياة الحيوانية:</div>
                <p className="text-xs text-slate-200 leading-relaxed">{z.faunaAr}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {config.type === 'eco_citizen_scenario' && (() => {
        const scenario = config.hazardScenarios[activeIdx];
        return (
          <div className="space-y-6">
            {config.hazardScenarios.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {config.hazardScenarios.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 border ${
                      activeIdx === idx
                        ? 'bg-rose-600 text-white border-rose-300 shadow-md scale-[1.02]'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    خطر {idx + 1}
                  </button>
                ))}
              </div>
            )}
            <HazardScenarioView scenario={scenario} />
          </div>
        );
      })()}
    </div>
  );
};

const sourceTypeLabelAr = (type: 'document' | 'monument' | 'testimony' | 'artifact' | 'map'): string => {
  switch (type) {
    case 'document': return 'وثيقة';
    case 'monument': return 'أثر/معلم';
    case 'testimony': return 'شهادة';
    case 'artifact': return 'قطعة أثرية';
    case 'map': return 'خريطة';
    default: return 'مصدر';
  }
};

const HazardScenarioView: React.FC<{ scenario: { hazardAr: string; choices: { textAr: string; isCorrect: boolean; feedbackAr: string }[] } }> = ({ scenario }) => {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  return (
    <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
      <h3 className="text-base font-black text-rose-300 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5" />
        <span>{scenario.hazardAr}</span>
      </h3>
      <div className="space-y-3">
        {scenario.choices.map((choice, cIdx) => (
          <button
            key={cIdx}
            onClick={() => setSelectedChoice(cIdx)}
            className={`w-full p-4 rounded-2xl border text-right text-xs font-bold transition-all cursor-pointer ${
              selectedChoice === cIdx
                ? choice.isCorrect
                  ? 'bg-emerald-600 text-white border-emerald-300 ring-2 ring-emerald-400'
                  : 'bg-rose-950 border-rose-500 text-rose-200'
                : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {choice.textAr}
          </button>
        ))}
      </div>
      {selectedChoice !== null && (
        <div className="p-4 bg-slate-800 border border-slate-600 rounded-2xl text-xs text-slate-100 font-bold leading-relaxed animate-in fade-in duration-300">
          {scenario.choices[selectedChoice].feedbackAr}
        </div>
      )}
    </div>
  );
};

export const HistoryGeoInteractive: React.FC<HistoryGeoProps> = ({ config }) => (
  <ConfiguredHistoryGeoTool config={config} />
);

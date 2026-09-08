import React, { useState } from 'react';
import {
  Hash,
  Shapes,
  Lightbulb,
  BarChart3,
  Sparkles,
  PencilLine,
  Grid3x3,
  Boxes
} from 'lucide-react';
import type { MathInteractiveConfig, MathCountingItem, MathPlaceValueItem } from '../types';
import { MultiplicationGroupsVisual } from './lessonViewer/MultiplicationGroupsVisual';
import { MathWorkedExample } from './lessonViewer/MathWorkedExample';

interface MathInteractiveProps {
  config: MathInteractiveConfig;
}

/* ==========================================
   PER-LESSON CONFIG-DRIVEN VIEWS
   Rendered when the lesson supplies `mathInteractive` — shows only the
   single module relevant to THAT lesson's content, not a fixed grade-wide set.
   ========================================== */
const ConfiguredMathTool: React.FC<{ config: MathInteractiveConfig }> = ({ config }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const headerIcon = config.themeEmoji ? (
    <span className="text-2xl leading-none" aria-hidden="true">{config.themeEmoji}</span>
  ) : (
    config.type === 'number_cards' ? <Hash className="w-6 h-6 text-amber-400" /> :
    config.type === 'shape_explorer' ? <Shapes className="w-6 h-6 text-amber-400" /> :
    config.type === 'word_problem_scenario' ? <Lightbulb className="w-6 h-6 text-amber-400" /> :
    config.type === 'written_operation' ? <PencilLine className="w-6 h-6 text-amber-400" /> :
    config.type === 'visual_counting' ? <Grid3x3 className="w-6 h-6 text-amber-400" /> :
    config.type === 'place_value_blocks' ? <Boxes className="w-6 h-6 text-amber-400" /> :
    <BarChart3 className="w-6 h-6 text-amber-400" />
  );

  return (
    <div className="bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-800 shadow-2xl space-y-6 dir-rtl" dir="rtl">
      <div className="flex items-center gap-3 border-b border-emerald-800 pb-4">
        <div className="p-3 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/30">
          {headerIcon}
        </div>
        <div>
          <h2 className="text-lg font-black text-amber-300">{config.titleAr}</h2>
          {config.introAr && (
            <p className="text-xs text-emerald-200 mt-1">{config.introAr}</p>
          )}
        </div>
      </div>

      {config.type === 'number_cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {config.cards.map((c, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`w-full p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                  activeIdx === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl font-black scale-[1.01]'
                    : 'bg-emerald-900/80 border-emerald-800 text-emerald-100 hover:bg-emerald-850 text-sm font-bold'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{c.labelAr}</span>
                  <span dir="ltr" className={`text-xs font-mono px-2 py-0.5 rounded-full ${activeIdx === idx ? 'bg-slate-950/20' : 'bg-slate-950/60 text-amber-300'}`}>
                    {c.valueDisplay}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-amber-300">{config.cards[activeIdx].labelAr}</h3>
              <span dir="ltr" className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-bold">
                {config.cards[activeIdx].valueDisplay}
              </span>
            </div>
            {config.cards[activeIdx].multiplicationVisual && (
              <MultiplicationGroupsVisual {...config.cards[activeIdx].multiplicationVisual!} compact />
            )}
            <p className="text-sm font-bold text-slate-200 leading-relaxed bg-emerald-950 p-4 rounded-2xl border border-emerald-800">
              {config.cards[activeIdx].explanationAr}
            </p>
          </div>
        </div>
      )}

      {config.type === 'shape_explorer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {config.shapes.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setActiveIdx(idx)}
                className={`w-full p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3 ${
                  activeIdx === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl font-black scale-[1.01]'
                    : 'bg-emerald-900/80 border-emerald-800 text-emerald-100 hover:bg-emerald-850 text-sm font-bold'
                }`}
              >
                <span className="text-2xl shrink-0">{s.visualHint}</span>
                <span>{s.nameAr}</span>
              </button>
            ))}
          </div>
          <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <span className="text-3xl">{config.shapes[activeIdx].visualHint}</span>
              <h3 className="text-base font-black text-amber-300">{config.shapes[activeIdx].nameAr}</h3>
            </div>
            <div className="p-4 bg-emerald-950 rounded-2xl border border-emerald-800 space-y-2">
              <div className="text-xs font-black text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>الخصائص:</span>
              </div>
              <ul className="text-sm font-bold text-slate-200 leading-relaxed list-disc pr-4 space-y-1">
                {config.shapes[activeIdx].propertiesAr.map((p, pIdx) => (
                  <li key={pIdx}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {config.type === 'word_problem_scenario' && (() => {
        const problem = config.problems[activeIdx];
        return (
          <div className="space-y-6">
            {config.problems.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {config.problems.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`hit-target px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 border ${
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
            <WordProblemView problem={problem} />
          </div>
        );
      })()}

      {config.type === 'data_matching' && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-emerald-800">
            {config.rows.map((row, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between gap-3 px-4 py-3 ${
                  idx % 2 === 0 ? 'bg-emerald-900/60' : 'bg-slate-950'
                }`}
              >
                <span className="text-sm font-black text-amber-200">{row.labelAr}</span>
                <span dir="ltr" className="text-sm font-mono font-bold text-emerald-100">{row.valueAr}</span>
              </div>
            ))}
          </div>
          <p className="text-sm font-bold text-slate-200 leading-relaxed bg-emerald-950 p-4 rounded-2xl border border-emerald-800">
            {config.insightAr}
          </p>
        </div>
      )}

      {config.type === 'written_operation' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {config.operations.map((op, idx) => (
              <button
                key={op.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`hit-target px-4 py-2.5 rounded-2xl border text-xs font-black cursor-pointer ${
                  activeIdx === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl'
                    : 'bg-emerald-900/80 border-emerald-800 text-emerald-100'
                }`}
              >
                {op.labelAr}
              </button>
            ))}
          </div>
          {config.operations[activeIdx] && (
            <MathWorkedExample
              tone="dark"
              operationsAr={config.operations[activeIdx].operationsAr}
              solution={config.operations[activeIdx].solutionAr}
            />
          )}
        </div>
      )}

      {config.type === 'visual_counting' && <VisualCountingView items={config.items} />}

      {config.type === 'place_value_blocks' && (
        <PlaceValueBlocksView items={config.items} activeIdx={activeIdx} onSelect={setActiveIdx} />
      )}
    </div>
  );
};

const VisualCountingView: React.FC<{ items: MathCountingItem[] }> = ({ items }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const item = items[activeIdx];
  const selected = answers[item.id];

  return (
    <div className="space-y-6">
      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {items.map((it, idx) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`hit-target px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 border ${
                activeIdx === idx
                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-[1.02]'
                  : answers[it.id] !== undefined
                    ? 'bg-emerald-700/60 text-emerald-100 border-emerald-600'
                    : 'bg-emerald-900 text-emerald-200 border-emerald-800 hover:bg-emerald-850'
              }`}
            >
              {it.labelAr}
            </button>
          ))}
        </div>
      )}

      <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-800 space-y-5">
        <p className="text-sm font-bold text-amber-200 text-center">{item.labelAr}</p>
        <div className="flex flex-wrap justify-center gap-3 bg-emerald-950 p-6 rounded-2xl border border-emerald-800 min-h-[100px] items-center">
          {Array.from({ length: item.count }).map((_, i) => (
            <span key={i} className="text-4xl leading-none">{item.emoji}</span>
          ))}
          {item.count === 0 && <span className="text-xs font-bold text-emerald-500">فارغ 📭</span>}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {item.choices.map((choice) => {
            const isSelected = selected === choice;
            const isCorrectChoice = choice === item.count;
            return (
              <button
                key={choice}
                type="button"
                onClick={() => setAnswers((prev) => ({ ...prev, [item.id]: choice }))}
                className={`min-h-[60px] rounded-2xl border text-2xl font-black font-mono transition-all cursor-pointer ${
                  isSelected
                    ? isCorrectChoice
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl scale-[1.03]'
                      : 'bg-rose-950 border-rose-500 text-rose-200'
                    : 'bg-emerald-900/80 border-emerald-800 text-emerald-100 hover:bg-emerald-850'
                }`}
              >
                {choice}
              </button>
            );
          })}
        </div>
        {selected !== undefined && (
          <p
            className={`text-center text-sm font-bold rounded-2xl p-3 border ${
              selected === item.count
                ? 'bg-emerald-900 border-emerald-600 text-emerald-100'
                : 'bg-slate-900 border-slate-700 text-slate-200'
            }`}
          >
            {selected === item.count ? 'أحسنت! 🎉' : `عُدَّ مرّة أخرى... الجواب الصحيح هو ${item.count}`}
          </p>
        )}
      </div>
    </div>
  );
};

const PlaceValueBlocksView: React.FC<{ items: MathPlaceValueItem[]; activeIdx: number; onSelect: (idx: number) => void }> = ({
  items,
  activeIdx,
  onSelect,
}) => {
  const item = items[activeIdx] ?? items[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        {items.map((it, idx) => (
          <button
            key={it.id}
            type="button"
            onClick={() => onSelect(idx)}
            className={`w-full p-4 rounded-2xl border text-right transition-all cursor-pointer ${
              activeIdx === idx
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xl font-black scale-[1.01]'
                : 'bg-emerald-900/80 border-emerald-800 text-emerald-100 hover:bg-emerald-850 text-sm font-bold'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{it.labelAr}</span>
              <span dir="ltr" className={`text-xs font-mono px-2 py-0.5 rounded-full ${activeIdx === idx ? 'bg-slate-950/20' : 'bg-slate-950/60 text-amber-300'}`}>
                {it.value}
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-black text-amber-300">{item.labelAr}</h3>
          <span dir="ltr" className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-bold">
            {item.value}
          </span>
        </div>
        <div className="space-y-3">
          {!!item.hundreds && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-cyan-400">المئات</span>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: item.hundreds }).map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-lg bg-cyan-500/80 border border-cyan-300 flex items-center justify-center text-[10px] font-black text-slate-950">
                    100
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black text-cyan-400">العشرات</span>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: item.tens }).map((_, i) => (
                <div key={i} className="w-8 h-10 rounded-lg bg-amber-500/80 border border-amber-300 flex items-center justify-center text-[10px] font-black text-slate-950">
                  10
                </div>
              ))}
              {item.tens === 0 && <span className="text-xs font-bold text-emerald-500">لا عشرات</span>}
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-[11px] font-black text-cyan-400">الوحدات</span>
            <div className="flex flex-wrap gap-1.5 items-center">
              {Array.from({ length: item.units }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-emerald-400 border border-emerald-200" />
              ))}
              {item.units === 0 && <span className="text-xs font-bold text-emerald-500">لا وحدات</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WordProblemView: React.FC<{ problem: { situationAr: string; choices: { textAr: string; isCorrect: boolean; feedbackAr: string }[] } }> = ({ problem }) => {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  return (
    <div className="bg-slate-950 p-6 rounded-3xl border border-emerald-800 space-y-4">
      <p className="text-sm font-bold text-slate-200 bg-emerald-950 p-4 rounded-2xl border border-emerald-800 leading-relaxed">
        {problem.situationAr}
      </p>
      <div className="space-y-3">
        {problem.choices.map((choice, cIdx) => (
          <button
            key={cIdx}
            onClick={() => setSelectedChoice(cIdx)}
            className={`w-full p-4 rounded-2xl border text-right text-xs font-bold transition-all cursor-pointer ${
              selectedChoice === cIdx
                ? choice.isCorrect
                  ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400'
                  : 'bg-rose-950 border-rose-500 text-rose-200'
                : 'bg-emerald-900/80 border-emerald-800 text-emerald-100 hover:bg-emerald-850'
            }`}
          >
            {choice.textAr}
          </button>
        ))}
      </div>
      {selectedChoice !== null && (
        <div className="p-4 bg-emerald-900 border border-emerald-600 rounded-2xl text-xs text-emerald-100 font-bold leading-relaxed animate-in fade-in duration-300">
          {problem.choices[selectedChoice].feedbackAr}
        </div>
      )}
    </div>
  );
};

export const MathInteractive: React.FC<MathInteractiveProps> = ({ config }) => (
  <ConfiguredMathTool config={config} />
);

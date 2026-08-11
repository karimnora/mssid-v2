import React, { useState } from 'react';
import { HelpCircle, Eye, Lightbulb, FlaskConical, Sparkles, Brain, Gamepad2 } from 'lucide-react';
import { ScientificInquiry } from '../types';

interface ScientificInquiryFlowProps {
  inquiry: ScientificInquiry;
  renderArabicText: (text: string | undefined | null) => string;
  hasSimulation: boolean;
  onGoToSimulation: () => void;
}

// The "démarche scientifique" for sciences lessons: question → observation → hypothesis (never
// graded — a real hypothesis can be wrong, that's the point) → experiment → result → explanation.
// Reuses the lesson's existing gameplay_simulation for the "experiment" step instead of building a
// second one; lessons without a simulation show the experiment/result as guided observation data.
export const ScientificInquiryFlow: React.FC<ScientificInquiryFlowProps> = ({
  inquiry,
  renderArabicText,
  hasSimulation,
  onGoToSimulation,
}) => {
  const [hypothesisId, setHypothesisId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const chosenHypothesis = inquiry.hypothesisOptions.find((h) => h.id === hypothesisId);

  return (
    <div className="bg-gradient-to-br from-sky-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 border border-sky-800/60 shadow-md space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-sky-500/20 text-sky-300 rounded-xl border border-sky-500/30">
          <FlaskConical className="w-5 h-5" />
        </div>
        <h3 className="font-extrabold text-base text-white">المنهج العلمي: أستكشف بنفسي</h3>
      </div>

      {/* ❓ Question */}
      <div className="bg-slate-950/50 border border-sky-900/60 rounded-2xl p-4 space-y-1.5">
        <span className="flex items-center gap-1.5 text-xs font-black text-sky-300">
          <HelpCircle className="w-4 h-4" /> ❓ أطرح سؤالاً
        </span>
        <p className="text-sm font-bold text-white leading-relaxed">{renderArabicText(inquiry.questionAr)}</p>
      </div>

      {/* 👀 Observation */}
      <div className="bg-slate-950/50 border border-sky-900/60 rounded-2xl p-4 space-y-1.5">
        <span className="flex items-center gap-1.5 text-xs font-black text-amber-300">
          <Eye className="w-4 h-4" /> 👀 ألاحظ
        </span>
        <p className="text-sm text-slate-100 leading-relaxed">{renderArabicText(inquiry.observationAr)}</p>
      </div>

      {/* 💭 Hypothesis — a genuine prediction, never graded right/wrong */}
      <div className="bg-slate-950/50 border border-sky-900/60 rounded-2xl p-4 space-y-2.5">
        <span className="flex items-center gap-1.5 text-xs font-black text-fuchsia-300">
          <Lightbulb className="w-4 h-4" /> 💭 أضع فرضية
        </span>
        <p className="text-xs text-slate-300">{renderArabicText(inquiry.hypothesisPromptAr)}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {inquiry.hypothesisOptions.map((opt) => {
            const isSelected = hypothesisId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setHypothesisId(opt.id)}
                disabled={revealed}
                className={`text-right p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-100'
                    : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                } disabled:cursor-not-allowed`}
              >
                {renderArabicText(opt.textAr)}
              </button>
            );
          })}
        </div>
        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            disabled={!hypothesisId}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
          >
            <FlaskConical className="w-4 h-4" />
            <span>🧪 أُجري التجربة الآن!</span>
          </button>
        )}
      </div>

      {revealed && (
        <div className="space-y-3 animate-in fade-in duration-300">
          {chosenHypothesis && (
            <p className="text-[11px] text-slate-400 bg-white/5 rounded-xl p-2.5">
              💭 فرضيتي كانت: <span className="text-fuchsia-300 font-bold">{renderArabicText(chosenHypothesis.textAr)}</span> — لنرَ ماذا يحدث فعلاً!
            </p>
          )}

          {/* 🧪 Experiment */}
          <div className="bg-slate-950/50 border border-sky-900/60 rounded-2xl p-4 space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-black text-sky-300">
              <FlaskConical className="w-4 h-4" /> 🧪 التجربة
            </span>
            <p className="text-sm text-slate-100 leading-relaxed">{renderArabicText(inquiry.experimentAr)}</p>
            {hasSimulation && (
              <button
                onClick={onGoToSimulation}
                className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-indigo-300 hover:text-indigo-200 cursor-pointer"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>جرّب التجربة بنفسك في المختبر التفاعلي ⬅</span>
              </button>
            )}
          </div>

          {/* 🔬 Result */}
          <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-2xl p-4 space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-black text-emerald-300">
              <Sparkles className="w-4 h-4" /> 🔬 النتيجة
            </span>
            <p className="text-sm text-emerald-100 leading-relaxed font-bold">{renderArabicText(inquiry.resultAr)}</p>
          </div>

          {/* 🧠 Explanation */}
          <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-4 space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-black text-amber-300">
              <Brain className="w-4 h-4" /> 🧠 أُفسّر
            </span>
            <p className="text-sm text-amber-100 leading-relaxed">{renderArabicText(inquiry.explanationAr)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

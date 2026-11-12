import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { ProgressiveExercise } from '../types';
import { renderTextWithMath } from './MathExpression';
import { IrabTable } from './lessonViewer/IrabTable';
import { MathWorkedExample } from './lessonViewer/MathWorkedExample';
import { formatEducationalText, latinTextDir } from '../utils/textFormatter';
import { MultiplicationGroupsVisual } from './lessonViewer/MultiplicationGroupsVisual';
import { shuffleOptions } from './lessonViewer/shared';
import { getPracticeHints, isGuidedPractice, isMatchingPairCorrect } from './lessonViewer/practiceAssessment';

interface PracticeExerciseCardProps {
  ex: ProgressiveExercise;
  renderArabicText: (text: string | undefined | null) => string;
  answer: string | number | undefined;
  onAnswerChange: (exId: string, value: string | number) => void;
  isChecked: boolean;
  isCorrect: boolean;
  canCheck: boolean;
  onCheck: (ex: ProgressiveExercise) => void;
  onReset: (ex: ProgressiveExercise) => void;
  matchingRightOrder: number[];
  matchingConnections: Record<number, number>;
  matchingSelectedLeft: number | null;
  onMatchingSelectLeft: (exId: string, leftIdx: number | null) => void;
  onConnectMatching: (exId: string, leftIdx: number, rightIdx: number) => void;
  onDisconnectMatching: (exId: string, leftIdx: number) => void;
  orderingShuffled: number[];
  orderingSelection: number[];
  onToggleOrderingItem: (exId: string, originalIdx: number) => void;
  playful?: boolean;
  leadAudio?: React.ReactNode;
  optionOrder?: string[];
  /** With a concrete hint, a first miss offers a retry before the complete correction. */
  retryFirst?: boolean;
}

// A single practice/evaluation exercise, self-contained: renders the right interaction widget for
// its `type`, tracks progressive hint reveals locally, and reports check/reset via callbacks so the
// parent (LessonViewer) keeps a single source of truth for scoring/XP. Reused identically by both
// the "أتدرب" (tiered practice) and "التقييم النهائي" (final evaluation) sections.
//
// React.memo + exId-taking callback props (rather than the old per-exercise curried closures) are
// what make this memoization actually pay off — see LessonViewer.tsx's stable useCallback handlers.
// Without both halves, a keystroke in one exercise's fill_blank input still re-renders every card.
export const PracticeExerciseCard: React.FC<PracticeExerciseCardProps> = React.memo(({
  ex,
  renderArabicText,
  answer,
  onAnswerChange,
  isChecked,
  isCorrect,
  canCheck,
  onCheck,
  onReset,
  matchingRightOrder,
  matchingConnections,
  matchingSelectedLeft,
  onMatchingSelectLeft,
  onConnectMatching,
  onDisconnectMatching,
  orderingShuffled,
  orderingSelection,
  onToggleOrderingItem,
  playful = false,
  leadAudio,
  optionOrder,
  retryFirst = false,
}) => {
  const isGuided = isGuidedPractice(ex);
  const displayOptions = useMemo(() => {
    const options = ex.options || [];
    if (ex.type !== 'qcm') return options;
    if (optionOrder?.length === options.length) {
      const ordered = optionOrder.map((id) => options.find((option) => option.id === id));
      if (ordered.every((option) => option !== undefined)) return ordered;
    }
    return shuffleOptions(options);
  }, [ex.options, ex.type, optionOrder]);
  // Grammar choices can differ only by their vowel marks (المُعَلِّمَاتِ / المُعَلِّمَاتَ). With vocalisation
  // switched off they would collapse into identical buttons, so those options always keep their marks.
  const optionsNeedMarks = useMemo(() => {
    const options = ex.options || [];
    return new Set(options.map((option) => renderArabicText(option.textAr))).size !== options.length;
  }, [ex.options, renderArabicText]);
  const setAnswer = (value: string | number) => onAnswerChange(ex.id, value);
  const setMatchingSelectedLeft = (leftIdx: number | null) => onMatchingSelectLeft(ex.id, leftIdx);
  const connectMatching = (leftIdx: number, rightIdx: number) => onConnectMatching(ex.id, leftIdx, rightIdx);
  const disconnectMatching = (leftIdx: number) => onDisconnectMatching(ex.id, leftIdx);
  const toggleOrderingItem = (originalIdx: number) => onToggleOrderingItem(ex.id, originalIdx);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [failedTries, setFailedTries] = useState(0);
  const hints = getPracticeHints(ex);
  const maxHints = hints.length;
  // Showing the answer after one slip lets a child copy it; hold it back once, then explain fully.
  const holdCorrection = retryFirst && maxHints > 0 && !isGuided && isChecked && !isCorrect && failedTries === 0;
  const showAssessment = isChecked && !holdCorrection;
  const misconception = ex.misconceptionsAr?.find((item) => answer !== '' && Number(answer) === item.answer);

  // A number/operator expression (e.g. "630 ÷ 10") has no Arabic anchor character, so inside an
  // RTL container the bidi algorithm can visually reorder its tokens (630÷10 → renders as 10÷630) —
  // misleading for non-commutative operations. Isolate such text in an explicit LTR span.
  const renderCell = (text: string | undefined | null) => {
    const value = renderArabicText(text);
    if (value && !/[؀-ۿ]/.test(value)) {
      return <span dir="ltr">{value}</span>;
    }
    return value;
  };

  return (
    <div className="exercise-surface border rounded-3xl p-4 sm:p-5 space-y-3 shadow-xs min-w-0 overflow-x-hidden">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm font-extrabold text-[var(--brand-amber-dark)] bg-[var(--brand-amber)]/15 border border-[var(--brand-amber)]/30 px-3 py-1 rounded-full">
          {playful ? (ex.level === 1 ? 'أَلْعَبُ' : ex.level === 2 ? 'أُحَاوِلُ' : 'أَرْبِطُ') : ex.levelLabelAr}
        </span>
        {!playful && !isGuided && <span className="text-[10px] font-bold text-slate-500">+{ex.xpReward} XP</span>}
      </div>

      <div className="flex items-start gap-2 type-quiz text-slate-900">
        {leadAudio}
        <p dir={latinTextDir(ex.problemAr)} className={`whitespace-pre-line min-w-0 flex-1 ${playful ? 'text-lg font-black leading-snug' : ''}`}>
          {renderTextWithMath(renderArabicText(ex.problemAr))}
        </p>
      </div>

      {ex.multiplicationVisual && (
        <MultiplicationGroupsVisual {...ex.multiplicationVisual} compact />
      )}

      {/* QCM / True-False */}
      {(ex.type === 'qcm' || ex.type === 'true_false') && ex.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {displayOptions.map((opt) => {
            const isSelected = answer === opt.id;
            let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
            if (showAssessment) {
              if (opt.isCorrect && !holdCorrection) style = 'bg-[var(--brand-emerald)]/15 border-[var(--brand-emerald)] text-[var(--brand-emerald-dark)] font-bold';
              else if (isSelected) style = 'bg-[var(--brand-coral)]/15 border-[var(--brand-coral)] text-[var(--brand-coral-dark)]';
              else style = 'bg-slate-50 border-slate-100 text-slate-600';
            } else if (isSelected) {
              style = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold';
            }
            return (
              <button
                key={opt.id}
                disabled={isChecked}
                onClick={() => setAnswer(opt.id)}
                dir={latinTextDir(opt.textAr)}
                className={`text-start p-3 min-h-[var(--hit)] rounded-xl border type-quiz transition-all cursor-pointer flex items-center justify-between gap-2 min-w-0 ${style}`}
              >
                <span className="min-w-0 break-words">{renderTextWithMath(optionsNeedMarks ? opt.textAr : renderArabicText(opt.textAr))}</span>
                {isChecked && opt.isCorrect && !holdCorrection && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {isChecked && isSelected && !opt.isCorrect && <XCircle className="w-4 h-4 text-[var(--brand-coral)] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Fill in the blank */}
      {ex.type === 'fill_blank' && (
        <input
          type="text"
          aria-label={renderArabicText(ex.problemAr)}
          disabled={isChecked}
          value={String(answer ?? '')}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="اكتب إجابتك هنا..."
          className="w-full min-h-[52px] rounded-xl border border-slate-300 px-3 py-2.5 text-base font-bold text-slate-900 disabled:bg-slate-50"
        />
      )}

      {/* Calculation */}
      {ex.type === 'calculation' && (
        <input
          type="number"
          aria-label={renderArabicText(ex.problemAr)}
          disabled={isChecked}
          value={answer ?? ''}
          onChange={(e) => setAnswer(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="اكتب الناتج..."
          inputMode="numeric"
          className="w-full min-h-[52px] rounded-xl border border-slate-300 px-3 py-2.5 text-lg font-bold text-slate-900 disabled:bg-slate-50"
          dir="ltr"
        />
      )}

      {/* Matching: tap a left item, then a right item, to connect them */}
      {ex.type === 'matching' && ex.matchingPairsAr && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">اضغط على عنصر من العمود الأيمن ثم على مقابله في العمود الأيسر لتربطهما:</p>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 min-w-0">
            <div className="space-y-2">
              {ex.matchingPairsAr.map((pair, leftIdx) => {
                const isConnected = matchingConnections[leftIdx] !== undefined;
                const isSelected = matchingSelectedLeft === leftIdx;
                const isRight = showAssessment && isMatchingPairCorrect(ex, leftIdx, matchingConnections[leftIdx]);
                const isWrong = showAssessment && isConnected && !isRight;
                let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                if (showAssessment) style = isRight ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : isWrong ? 'bg-rose-50 border-rose-400 text-rose-900' : 'bg-slate-50 border-slate-100 text-slate-600';
                else if (isSelected) style = 'bg-indigo-100 border-indigo-500 text-indigo-900 font-bold';
                else if (isConnected) style = 'bg-emerald-50 border-emerald-300 text-emerald-800';
                return (
                  <button
                    key={leftIdx}
                    disabled={isChecked}
                    onClick={() => (isConnected ? disconnectMatching(leftIdx) : setMatchingSelectedLeft(leftIdx))}
                    className={`w-full min-w-0 text-right p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-1 ${style}`}
                  >
                    <span className="min-w-0 break-words">{renderCell(pair.leftAr)}</span>
                    {isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {isWrong && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2">
              {(matchingRightOrder.length ? matchingRightOrder : ex.matchingPairsAr.map((_, i) => i)).map((rightIdx) => {
                const connectedLeftIdx = Object.entries(matchingConnections).find(([, r]) => r === rightIdx)?.[0];
                const isUsed = connectedLeftIdx !== undefined;
                return (
                  <button
                    key={rightIdx}
                    disabled={isChecked || isUsed}
                    onClick={() => {
                      if (matchingSelectedLeft === null || matchingSelectedLeft === undefined) return;
                      connectMatching(matchingSelectedLeft, rightIdx);
                    }}
                    className={`w-full min-w-0 text-right p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer break-words ${
                      isUsed ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-white border-slate-200 hover:bg-indigo-50 hover:border-indigo-300'
                    }`}
                  >
                    {renderCell(ex.matchingPairsAr![rightIdx].rightAr)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Ordering: tap items in the order believed correct; numbered badges; tap again to undo */}
      {ex.type === 'ordering' && ex.orderedItemsAr && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">اضغط على العناصر بالترتيب الصحيح (اضغط مرة أخرى للتراجع):</p>
          <div className="flex flex-wrap gap-2">
            {(orderingShuffled.length ? orderingShuffled : ex.orderedItemsAr.map((_, i) => i)).map((originalIdx) => {
              const position = orderingSelection.indexOf(originalIdx);
              const isSelected = position !== -1;
              const isRightPlace = showAssessment && position === originalIdx;
              const isWrongPlace = showAssessment && isSelected && position !== originalIdx;
              let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
              if (showAssessment) style = isRightPlace ? 'bg-emerald-50 border-emerald-400 text-emerald-900' : isWrongPlace ? 'bg-rose-50 border-rose-400 text-rose-900' : 'bg-slate-50 border-slate-100 text-slate-600';
              else if (isSelected) style = 'bg-indigo-600 border-indigo-700 text-white font-bold';
              return (
                <button
                  key={originalIdx}
                  disabled={isChecked}
                  onClick={() => toggleOrderingItem(originalIdx)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${style}`}
                >
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-black/10 text-[10px] flex items-center justify-center shrink-0">
                      {position + 1}
                    </span>
                  )}
                  <span>{renderCell(ex.orderedItemsAr![originalIdx])}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* short_answer / untyped: simple reveal-based practice */}
      {isGuided && !isChecked && (
        <p className="text-xs text-slate-500">فكّر في الحل، ثم اضغط "أرى التصحيح" لتقارن حلك بالشرح.</p>
      )}

      {/* Progressive scaffolded help: one step revealed per click, never the full answer up front */}
      {!isChecked && maxHints > 0 && (
        <div className="space-y-1.5">
          {Array.from({ length: hintsRevealed }).map((_, i) => (
            <p key={i} dir={latinTextDir(hints[i].contentAr)} className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl p-2.5">
              💡 {renderArabicText(hints[i].labelAr)}: {renderTextWithMath(renderArabicText(hints[i].contentAr))}
            </p>
          ))}
          {hintsRevealed < maxHints && (
            <button
              onClick={() => setHintsRevealed((n) => n + 1)}
              className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{hintsRevealed === 0 ? 'أحتاج مساعدة' : 'مساعدة إضافية'} ({hintsRevealed}/{maxHints})</span>
            </button>
          )}
        </div>
      )}

      {holdCorrection && (
        <p role="status" className="text-sm font-bold p-3 rounded-xl border leading-relaxed bg-amber-50 border-amber-200 text-amber-900">
          🤔 {misconception
            ? renderTextWithMath(renderArabicText(misconception.feedbackAr))
            : 'ليست هذه بعد. لا بأس!'}{' '}
          اضغط «حاول مرة أخرى»: سأعطيك مساعدة صغيرة.
        </p>
      )}

      {isChecked && !holdCorrection && (
        <div
          className={`text-sm p-3 rounded-xl border leading-relaxed ${
            isGuided ? 'bg-sky-50 border-sky-200 text-sky-900' : isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <span className="font-black block mb-1">
            {isGuided ? '📖 التصحيح للمراجعة: قارن حلك بالشرح.' : isCorrect ? '✅ أحسنت! إجابة صحيحة.' : `💡 ليست هذه الإجابة، لا بأس! إليك الشرح لتتعلم منه:`}
          </span>
          {ex.irabTableAr && ex.irabTableAr.length > 0 ? (
            <div className="space-y-2">
              <p className="whitespace-pre-line">{renderArabicText(ex.detailedCorrectionAr)}</p>
              <IrabTable rows={ex.irabTableAr} />
            </div>
          ) : ex.operationsAr ? (
            <MathWorkedExample
              solution={ex.detailedCorrectionAr}
              operationsAr={ex.operationsAr}
              renderArabicText={renderArabicText}
              tone="light"
            />
          ) : (
            <span dir={latinTextDir(ex.detailedCorrectionAr)} className="block whitespace-pre-line">{formatEducationalText(renderArabicText(ex.detailedCorrectionAr))}</span>
          )}
        </div>
      )}

      {!isChecked ? (
        <button
          onClick={() => onCheck(ex)}
          disabled={!canCheck}
          className="hit-target w-full sm:w-auto bg-[var(--brand-emerald)] hover:bg-[var(--brand-emerald-dark)] disabled:opacity-40 disabled:cursor-not-allowed text-white text-base font-extrabold px-5 rounded-2xl cursor-pointer"
        >
          {isGuided ? 'أرى التصحيح' : 'تحقق من الإجابة'}
        </button>
      ) : (
        <button
          onClick={() => {
            const missed = !isGuided && !isCorrect;
            if (missed) setFailedTries((n) => n + 1);
            // In a guided mission the next hint appears by itself, so the retry is never a blind guess.
            setHintsRevealed(retryFirst && missed ? Math.min(failedTries + 1, maxHints) : 0);
            onReset(ex);
          }}
          className={!isGuided && !isCorrect
            ? 'hit-target w-full sm:w-auto bg-amber-200 hover:bg-amber-300 text-amber-950 text-base font-extrabold px-5 rounded-2xl cursor-pointer'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-all'}
        >
          {isGuided ? 'أفكّر من جديد' : isCorrect ? 'أعيد التمرين' : 'حاول مرة أخرى'}
        </button>
      )}
    </div>
  );
});

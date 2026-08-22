import React from 'react';
import { CourseLesson } from '../../types';
import { Badge } from '../ui';
import { Sparkles } from 'lucide-react';
import { PRACTICE_TIERS } from './shared';
import { BoundPracticeCard, PracticeBindings } from './practiceBindings';

interface LessonPracticePanelProps {
  lesson: CourseLesson;
  practice: PracticeBindings;
  renderArabicText: (text: string | undefined | null) => string;
  gameAnswers: Record<number, string>;
  onSelectGameOption: (itemIndex: number, optionAr: string) => void;
  onResetGame: () => void;
}

export const LessonPracticePanel: React.FC<LessonPracticePanelProps> = ({
  lesson,
  practice,
  renderArabicText,
  gameAnswers,
  onSelectGameOption,
  onResetGame,
}) => (
  <div className="space-y-6">
    {PRACTICE_TIERS.map((tier) => {
      const tierExercises = (lesson.progressiveExercises || []).filter((ex) => ex.level === tier.level);
      if (tierExercises.length === 0) return null;
      return (
        <div key={tier.level} className="space-y-3">
          <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-2">
            <span className="text-lg">{tier.icon}</span>
            <h3 className="font-black text-sm text-[var(--app-text)]">{tier.titleAr}</h3>
            <span className="text-[10px] font-bold text-[var(--app-text-muted)]">({tierExercises.length})</span>
          </div>
          <div className="space-y-4">
            {tierExercises.map((ex) => (
              <BoundPracticeCard key={ex.id} ex={ex} practice={practice} renderArabicText={renderArabicText} />
            ))}
          </div>
        </div>
      );
    })}

    {lesson.educationalGame && (
      <div className="bg-gradient-to-r from-purple-950 to-slate-900 text-white rounded-3xl p-5 space-y-3 border border-purple-800/50">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-black text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>🏆 التحدي: {renderArabicText(lesson.educationalGame.titleAr)}</span>
          </h3>
          <Badge variant="xp"><span dir="ltr">+{lesson.educationalGame.xpReward} XP</span></Badge>
        </div>
        <p className="text-xs text-purple-200">{renderArabicText(lesson.educationalGame.instructionsAr)}</p>
        <div className="space-y-2">
          {lesson.educationalGame.items.map((item, i) => {
            const selected = gameAnswers[i];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === item.correctAnswerAr;
            return (
              <div key={i} className="bg-slate-950/60 border border-purple-900/50 rounded-xl p-3 text-xs space-y-2">
                <p className="font-bold mb-1.5">{renderArabicText(item.questionOrPromptAr)}</p>
                {item.optionsAr && (
                  <div className="flex gap-2 flex-wrap">
                    {item.optionsAr.map((optAr) => {
                      const isThisCorrect = optAr === item.correctAnswerAr;
                      const isThisSelected = selected === optAr;
                      let style = 'bg-white/10 text-purple-100 hover:bg-white/20 cursor-pointer';
                      if (isAnswered) {
                        style = isThisCorrect
                          ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 font-bold'
                          : isThisSelected
                          ? 'bg-rose-500/25 text-rose-200 border border-rose-400/50'
                          : 'bg-white/5 text-purple-300/60';
                      }
                      return (
                        <button
                          key={optAr}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => onSelectGameOption(i, optAr)}
                          className={`px-2.5 py-1 rounded-lg transition-colors ${style}`}
                        >
                          {renderArabicText(optAr)}
                        </button>
                      );
                    })}
                  </div>
                )}
                {isAnswered && item.explanationAr && (
                  <p className={`text-[11px] ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {isCorrect ? '✅ ' : '💡 '}{renderArabicText(item.explanationAr)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        {Object.keys(gameAnswers).length === lesson.educationalGame.items.length && (
          <button
            type="button"
            onClick={onResetGame}
            className="text-[11px] font-bold text-purple-200 hover:text-white underline cursor-pointer"
          >
            إعادة المحاولة 🔄
          </button>
        )}
      </div>
    )}
  </div>
);

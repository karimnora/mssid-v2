import React from 'react';
import { CourseLesson } from '../../types';
import { Badge } from '../ui';
import { Sparkles } from 'lucide-react';
import { PRACTICE_TIERS } from './shared';
import { BoundPracticeCard, PracticeBindings } from './practiceBindings';
import { TapSpeakButton } from './TapSpeakButton';

interface LessonPracticePanelProps {
  lesson: CourseLesson;
  practice: PracticeBindings;
  renderArabicText: (text: string | undefined | null) => string;
  gameAnswers: Record<number, string>;
  onSelectGameOption: (itemIndex: number, optionAr: string) => void;
  onResetGame: () => void;
  playful?: boolean;
  speakingKey?: string | null;
  onSpeak?: (key: string, text: string) => void;
}

export const LessonPracticePanel: React.FC<LessonPracticePanelProps> = ({
  lesson,
  practice,
  renderArabicText,
  gameAnswers,
  onSelectGameOption,
  onResetGame,
  playful = false,
  speakingKey = null,
  onSpeak,
}) => (
  <div className="space-y-6">
    {PRACTICE_TIERS.map((tier) => {
      const tierExercises = (lesson.progressiveExercises || []).filter((ex) => ex.level === tier.level);
      if (tierExercises.length === 0) return null;
      return (
        <div key={tier.level} className="space-y-3">
          <div className="flex items-center gap-2 border-b border-[var(--app-card-border)] pb-2">
            <span className="text-lg">{tier.icon}</span>
            <h3 className="font-black text-sm text-[var(--app-text)]">{playful ? (tier.level === 1 ? 'أَلْعَبُ' : tier.level === 2 ? 'أُحَاوِلُ' : 'أَرْبِطُ') : tier.titleAr}</h3>
            <span className="text-[10px] font-bold text-[var(--app-text-muted)]">({tierExercises.length})</span>
          </div>
          <div className="space-y-4">
            {tierExercises.map((ex) => (
              <BoundPracticeCard
                key={ex.id}
                ex={ex}
                practice={practice}
                renderArabicText={renderArabicText}
                playful={playful}
                leadAudio={
                  onSpeak ? (
                    <TapSpeakButton
                      snippetKey={`practice-${ex.id}`}
                      text={ex.problemAr}
                      speakingKey={speakingKey}
                      onSpeak={onSpeak}
                      size={playful ? 'lg' : 'md'}
                    />
                  ) : undefined
                }
              />
            ))}
          </div>
        </div>
      );
    })}

    {lesson.educationalGame && (
      <div
        className={playful
          ? 'bg-violet-50 border border-violet-100 text-[#1E293B] rounded-3xl p-5 space-y-3'
          : 'text-white rounded-3xl p-5 space-y-3 border border-purple-800/50'
        }
        style={playful ? undefined : { backgroundImage: 'linear-gradient(to right, #3b0764, #0f172a)' }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-black text-sm flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${playful ? 'text-amber-500' : 'text-amber-300'}`} />
            <span>{playful ? renderArabicText(lesson.educationalGame.titleAr) : `🏆 التحدي: ${renderArabicText(lesson.educationalGame.titleAr)}`}</span>
          </h3>
          {!playful && <Badge variant="xp"><span dir="ltr">+{lesson.educationalGame.xpReward} XP</span></Badge>}
        </div>
        <p className={`flex items-center gap-2 ${playful ? 'text-sm text-slate-600' : 'text-xs text-purple-200'}`}>
          {playful && onSpeak && lesson.educationalGame.instructionsAr && (
            <TapSpeakButton
              snippetKey="game-instructions"
              text={lesson.educationalGame.instructionsAr}
              speakingKey={speakingKey}
              onSpeak={onSpeak}
              size="lg"
            />
          )}
          <span>{renderArabicText(lesson.educationalGame.instructionsAr)}</span>
        </p>
        <div className="space-y-2">
          {lesson.educationalGame.items.map((item, i) => {
            const selected = gameAnswers[i];
            const isAnswered = selected !== undefined;
            const isCorrect = selected === item.correctAnswerAr;
            return (
              <div key={i} className={playful
                ? 'bg-white border border-violet-100 rounded-2xl p-4 text-base space-y-2'
                : 'bg-slate-950/60 border border-purple-900/50 rounded-xl p-3 text-xs space-y-2'
              }>
                <p className="font-bold mb-1.5 flex items-center gap-2 min-w-0">
                  {onSpeak && (
                    <TapSpeakButton
                      snippetKey={`game-${i}`}
                      text={item.questionOrPromptAr}
                      speakingKey={speakingKey}
                      onSpeak={onSpeak}
                    />
                  )}
                  <span className="min-w-0 break-words">{renderArabicText(item.questionOrPromptAr)}</span>
                </p>
                {item.optionsAr && (
                  <div className="flex gap-2 flex-wrap">
                    {item.optionsAr.map((optAr) => {
                      const isThisCorrect = optAr === item.correctAnswerAr;
                      const isThisSelected = selected === optAr;
                      let style = playful
                        ? 'bg-sky-50 text-[#1E293B] hover:bg-sky-100 cursor-pointer border border-sky-100'
                        : 'bg-white/10 text-purple-100 hover:bg-white/20 cursor-pointer';
                      if (isCorrect) {
                        style = isThisCorrect
                          ? playful
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold'
                            : 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 font-bold'
                          : playful
                            ? 'bg-slate-50 text-slate-400'
                            : 'bg-white/5 text-purple-300/60';
                      } else if (isThisSelected) {
                        style = playful
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-amber-500/25 text-amber-200 border border-amber-400/50';
                      }
                      return (
                        <div key={optAr} className="flex items-center gap-1 min-w-0">
                          {playful && onSpeak && (
                            <TapSpeakButton
                              snippetKey={`game-${i}-opt-${optAr}`}
                              text={optAr}
                              speakingKey={speakingKey}
                              onSpeak={onSpeak}
                            />
                          )}
                        <button
                          type="button"
                          disabled={isCorrect}
                          onClick={() => onSelectGameOption(i, optAr)}
                          className={`px-3 py-2 rounded-2xl transition-colors min-h-12 ${style}`}
                        >
                          {renderArabicText(optAr)}
                        </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {isAnswered && item.explanationAr && (
                  <p className={`text-sm ${isCorrect ? (playful ? 'text-emerald-700' : 'text-emerald-300') : (playful ? 'text-amber-800' : 'text-amber-300')}`}>
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
            className={playful ? 'text-sm font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer' : 'text-[11px] font-bold text-purple-200 hover:text-white underline cursor-pointer'}
          >
            إعادة المحاولة 🔄
          </button>
        )}
      </div>
    )}
  </div>
);

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CourseLesson } from '../../types';
import { Button, Card, XPProgressBar } from '../ui';
import { Trophy, Award, Shuffle, RotateCcw, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { ConfettiBurst } from './ConfettiBurst';
import { tabTransition } from './shared';
import { TapSpeakButton } from './TapSpeakButton';

interface LessonQuizPanelProps {
  lesson: CourseLesson;
  shuffledQuiz: CourseLesson['quiz'];
  selectedAnswers: Record<string, string>;
  recentAnswerId: string | null;
  renderArabicText: (text: string | undefined | null) => string;
  onSelectOption: (questionId: string, optionId: string) => void;
  onShuffle: () => void;
  onReset: () => void;
  playful?: boolean;
  speakingKey?: string | null;
  onSpeak?: (key: string, text: string) => void;
  nextLessonTitle?: string;
  onContinueNext?: () => void;
}

export const LessonQuizPanel: React.FC<LessonQuizPanelProps> = ({
  lesson,
  shuffledQuiz,
  selectedAnswers,
  recentAnswerId,
  renderArabicText,
  onSelectOption,
  onShuffle,
  onReset,
  playful = false,
  speakingKey = null,
  onSpeak,
  nextLessonTitle,
  onContinueNext,
}) => {
  const activeQuiz = shuffledQuiz.length > 0 ? shuffledQuiz : lesson.quiz;
  const totalQuestions = activeQuiz.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const optionLetters = ['أ', 'ب', 'ج', 'د', 'هـ'];

  let correctCount = 0;
  activeQuiz.forEach((q) => {
    const selected = selectedAnswers[q.id];
    const correctOpt = q.options.find((o) => o.isCorrect);
    if (selected && correctOpt && selected === correctOpt.id) {
      correctCount++;
    }
  });

  const quizComplete = totalQuestions > 0 && answeredCount === totalQuestions;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return (
    <Card padding="none" className="p-4 sm:p-6 space-y-6 overflow-x-hidden">
      <div className="flex items-center justify-between border-b border-[var(--app-card-border)] pb-4 flex-wrap gap-3">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-[var(--app-text)] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[var(--brand-amber)]" />
            <span>{playful ? 'هَيَّا نَلْعَبُ!' : 'الاختبار التفاعلي المتقدم'}</span>
          </h3>
          {!playful && (
          <p className="text-xs text-[var(--app-text-muted)]">
            كل سؤال يُصحَّح فور اختيار إجابته — خيار الإجابات مخلّط عشوائياً لضمان الفهم الحقيقي
          </p>
          )}
        </div>

        {!playful && (
        <Button variant="outline" size="sm" icon={<Shuffle className="w-3.5 h-3.5 text-[var(--brand-blue)]" />} disabled={quizComplete} onClick={onShuffle} title="إعادة خلط أماكن الإجابات عشوائياً">
          خلط الخيارات 🎲
        </Button>
        )}
      </div>

      {!playful && <XPProgressBar currentXp={correctCount * 15} maxXp={totalQuestions * 15} showLabel />}

      <AnimatePresence>
        {quizComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className={
              playful
                ? 'bg-emerald-50 border border-emerald-100 rounded-3xl p-4 sm:p-5 space-y-4 shadow-sm'
                : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-800/80 space-y-4 shadow-md'
            }
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={playful
                  ? 'p-3 bg-amber-100 text-amber-600 rounded-2xl shrink-0'
                  : 'p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30'
                }>
                  <Award className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <h4 className={`font-extrabold text-base flex items-center gap-2 flex-wrap ${playful ? 'text-[#1E293B]' : 'text-white'}`}>
                    <span>{playful ? 'أَحْسَنْتَ!' : 'نتيجة الاختبار:'}</span>
                    <span dir="ltr" className={`font-mono font-black text-xl ${playful ? 'text-emerald-700' : 'text-amber-300'}`}>{scorePercentage}%</span>
                  </h4>
                  {!playful && (
                  <p className="text-xs text-slate-300">
                    {scorePercentage === 100
                      ? '🏆 إجابات ممتازة ومثالية! لقد أتقنت درس اليوم بنجاح كامل.'
                      : scorePercentage >= 70
                      ? '🌟 أداء رائع ومتميز! استمر على هذا المستوى القوي.'
                      : scorePercentage >= 50
                      ? '👍 نتيجة جيدة! يمكنك مراجعة الإجابات أدناه للوصول إلى 100%.'
                      : '💡 تحتاج إلى مراجعة بسيطة للدرس وإعادة الاختبار لترسيخ المفاهيم.'}
                  </p>
                  )}
                </div>
              </div>

              {!playful && (
              <Button variant="accent" size="sm" icon={<RotateCcw className="w-4 h-4" />} onClick={onReset}>
                إعادة الاختبار وخلط الخيارات 🔄
              </Button>
              )}
            </div>

            {playful && onContinueNext && (
              <div className="space-y-2">
                {nextLessonTitle ? (
                  <p className="text-center text-xs font-bold text-slate-500 line-clamp-1">{nextLessonTitle}</p>
                ) : null}
                <motion.button
                  type="button"
                  data-primary-cta="quiz-next-lesson"
                  onClick={onContinueNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base px-6 py-3.5 rounded-3xl shadow-md cursor-pointer min-h-12"
                >
                  {nextLessonTitle ? 'الدَّرْسُ التَّالِي' : 'قَائِمَةُ الدُّرُوسِ'}
                </motion.button>
                <button
                  type="button"
                  onClick={onReset}
                  className="w-full text-xs font-bold text-slate-500 py-2 cursor-pointer"
                >
                  أُعِيدُ
                </button>
              </div>
            )}

            {!playful && (
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-indigo-900/80 text-center text-xs">
              <div className="bg-indigo-950/70 p-2.5 rounded-xl border border-indigo-800/60">
                <span className="text-slate-400 block text-[10px] font-bold">إجابات صحيحة</span>
                <span className="text-emerald-400 font-black text-sm">{correctCount}</span>
              </div>
              <div className="bg-indigo-950/70 p-2.5 rounded-xl border border-indigo-800/60">
                <span className="text-slate-400 block text-[10px] font-bold">إجابات خاطئة</span>
                <span className="text-rose-400 font-black text-sm">{totalQuestions - correctCount}</span>
              </div>
              <div className="bg-indigo-950/70 p-2.5 rounded-xl border border-indigo-800/60">
                <span className="text-slate-400 block text-[10px] font-bold">النقاط المكتسبة</span>
                <span dir="ltr" className="text-amber-300 font-black text-sm">+{correctCount * 15} XP</span>
              </div>
            </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {activeQuiz.map((q, qIdx) => {
          const selected = selectedAnswers[q.id];
          const isAnswered = selected !== undefined;
          const correctOpt = q.options.find((o) => o.isCorrect);
          const isUserCorrect = !!selected && !!correctOpt && selected === correctOpt.id;

          return (
            <div
              key={q.id}
              className={`p-3 sm:p-5 rounded-2xl border transition-colors space-y-4 min-w-0 ${
                isAnswered
                  ? isUserCorrect
                    ? 'border-[var(--brand-emerald)]/40 bg-[var(--brand-emerald)]/5'
                    : 'border-[var(--brand-coral)]/40 bg-[var(--brand-coral)]/5'
                  : 'border-[var(--app-card-border)] bg-[var(--app-card-bg)]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 type-quiz text-[var(--app-text)] min-w-0">
                  {onSpeak && (
                    <TapSpeakButton
                      snippetKey={`quiz-${q.id}`}
                      text={q.questionAr}
                      speakingKey={speakingKey}
                      onSpeak={onSpeak}
                      size={playful ? 'lg' : 'md'}
                    />
                  )}
                  {!playful && (
                  <span className="w-12 h-12 rounded-xl bg-[var(--brand-blue)] text-white text-base font-bold flex items-center justify-center shrink-0">
                    {qIdx + 1}
                  </span>
                  )}
                  <span className={`min-w-0 break-words ${playful ? 'text-lg font-black leading-snug' : ''}`}>{q.questionAr}</span>
                </div>

                {isAnswered && (
                  <span className="relative shrink-0">
                    {isUserCorrect && recentAnswerId === q.id && <ConfettiBurst />}
                    <motion.span
                      key={`badge-${q.id}`}
                      initial={isUserCorrect ? { scale: 0, rotate: -10, opacity: 0 } : { x: 0 }}
                      animate={isUserCorrect ? { scale: 1, rotate: 0, opacity: 1 } : { x: [0, -8, 8, -6, 6, -3, 3, 0] }}
                      transition={isUserCorrect ? { type: 'spring', stiffness: 500, damping: 15 } : { duration: 0.5 }}
                      className={`text-[11px] font-black px-3 py-1 rounded-full border flex items-center gap-1 ${
                        isUserCorrect
                          ? 'bg-[var(--brand-emerald)]/15 text-[var(--brand-emerald-dark)] border-[var(--brand-emerald)]/40'
                          : 'bg-[var(--brand-coral)]/15 text-[var(--brand-coral-dark)] border-[var(--brand-coral)]/40'
                      }`}
                    >
                      {isUserCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>إجابة صحيحة</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>إجابة خاطئة</span>
                        </>
                      )}
                    </motion.span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt, optIdx) => {
                  const isOptSelected = selected === opt.id;
                  let btnStyle = 'bg-[var(--app-card-bg)] border-[var(--app-card-border)] hover:border-[var(--brand-blue)]/50 text-[var(--app-text)]';

                  if (isAnswered) {
                    if (opt.isCorrect) {
                      btnStyle = 'bg-[var(--brand-emerald)]/15 border-[var(--brand-emerald)] text-[var(--brand-emerald-dark)] font-extrabold shadow-xs';
                    } else if (isOptSelected && !opt.isCorrect) {
                      btnStyle = 'bg-[var(--brand-coral)]/15 border-[var(--brand-coral)] text-[var(--brand-coral-dark)] font-bold';
                    } else {
                      btnStyle = 'bg-[var(--app-card-bg)] border-[var(--app-card-border)] text-[var(--app-text-muted)] opacity-60';
                    }
                  }

                  return (
                    <div key={opt.id} className="flex items-center gap-2 min-w-0">
                      {playful && onSpeak && (
                        <TapSpeakButton
                          snippetKey={`quiz-${q.id}-opt-${opt.id}`}
                          text={opt.textAr}
                          speakingKey={speakingKey}
                          onSpeak={onSpeak}
                        />
                      )}
                    <button
                      onClick={() => onSelectOption(q.id, opt.id)}
                      disabled={isAnswered}
                      className={`flex-1 min-w-0 min-h-12 text-right p-3 sm:p-3.5 rounded-xl border type-quiz transition-all flex items-center justify-between gap-2 ${
                        isAnswered ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'
                      } ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center shrink-0 border ${
                            isAnswered && opt.isCorrect
                              ? 'bg-[var(--brand-emerald)] text-white border-[var(--brand-emerald-dark)]'
                              : isOptSelected
                              ? 'bg-[var(--brand-blue)] text-white border-[var(--brand-blue-dark)]'
                              : 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border-[var(--app-card-border)]'
                          }`}
                        >
                          {optionLetters[optIdx] || optIdx + 1}
                        </span>
                        <span className="min-w-0 break-words">{renderArabicText(opt.textAr)}</span>
                      </div>

                      {isAnswered && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-[var(--brand-emerald)] shrink-0" />
                      )}
                      {isAnswered && isOptSelected && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-[var(--brand-coral)] shrink-0" />
                      )}
                    </button>
                    </div>
                  );
                })}
              </div>

              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={tabTransition}
                    className="bg-[var(--app-card-bg)] p-3.5 rounded-xl border border-[var(--app-card-border)] text-xs text-[var(--app-text)] space-y-1 font-sans leading-relaxed overflow-hidden"
                  >
                    <span className="font-extrabold text-[var(--brand-blue-dark)] block flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-[var(--brand-amber)]" />
                      {onSpeak && (
                        <TapSpeakButton
                          snippetKey={`quiz-${q.id}-why`}
                          text={
                            q.options.find((o) => o.isCorrect)?.explanationAr ||
                            q.options.find((o) => o.id === selected)?.explanationAr ||
                            ''
                          }
                          speakingKey={speakingKey}
                          onSpeak={onSpeak}
                          size="md"
                        />
                      )}
                      <span>{playful ? 'لِمَاذَا؟' : 'التفسير والشرح العلمي للحل:'}</span>
                    </span>
                    <p className="text-[var(--app-text)] font-medium">
                      {renderArabicText(
                        q.options.find((o) => o.isCorrect)?.explanationAr ||
                          q.options.find((o) => o.id === selected)?.explanationAr ||
                          'الإجابة الصحيحة تم اختيارها استناداً لقاعدة الدرس الذهبية.',
                      )}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {!quizComplete ? (
        <div className="text-xs font-bold text-[var(--app-text-muted)] bg-[var(--app-card-subtle)] p-3.5 rounded-xl border border-[var(--app-card-border)] text-center">
          <span dir="ltr">{answeredCount} / {totalQuestions}</span>
          {playful
            ? totalQuestions <= 1
              ? ' اِخْتَرْ جَوَاباً'
              : ' أَسْئِلَة'
            : ' أسئلة أُجيب عنها — تابع الإجابة لرؤية تقدمك مباشرة'}
        </div>
      ) : playful ? null : (
        <div className="flex items-center gap-2 text-[var(--brand-emerald-dark)] font-bold text-xs bg-[var(--brand-emerald)]/10 p-3.5 rounded-xl border border-[var(--brand-emerald)]/30 w-full justify-between flex-wrap">
          <span>تهانينا! تم احتساب النقاط وإضافتها إلى رصيدك الدراسي.</span>
          <Button variant="outline" size="sm" onClick={onReset}>
            إعادة الاختبار بخلط جديد 🎲
          </Button>
        </div>
      )}
    </Card>
  );
};

import React, { useEffect, useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CourseLesson, PrimaryGrade, SubjectId } from '../types';
import { CourseBreadcrumb } from './CourseBreadcrumb';
import { LessonExplanationView } from './LessonExplanationView';
import { RevisionSheetViewer } from './RevisionSheetViewer';
import { LoadingFallback } from './LoadingFallback';
import { renderTextWithMath } from './MathExpression';
import { Button, Card, Badge } from './ui';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { stripArabicTashkeel } from '../utils/textFormatter';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  Gamepad2,
  Glasses,
  Trophy,
  ClipboardCheck,
  Printer,
  Lock,
  Info,
  Target,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import { TabId, LessonStep, tabTransition } from './lessonViewer/shared';
import { usePremiumLessonContent } from './lessonViewer/usePremiumLessonContent';
import { useLessonSpeech } from './lessonViewer/useLessonSpeech';
import { useLessonPractice } from './lessonViewer/useLessonPractice';
import { useLessonQuiz } from './lessonViewer/useLessonQuiz';
import { LessonInteractiveTools, hasRenderableInteractiveTool } from './lessonViewer/LessonInteractiveTools';
import { LessonPracticePanel } from './lessonViewer/LessonPracticePanel';
import { LessonEvaluationPanel } from './lessonViewer/LessonEvaluationPanel';
import { LessonQuizPanel } from './lessonViewer/LessonQuizPanel';
import { LessonContentPanel } from './lessonViewer/LessonContentPanel';
import { LessonStepFooter } from './lessonViewer/LessonStepFooter';

const ScienceLabSimulation = lazy(() => import('./ScienceLabSimulation').then((m) => ({ default: m.ScienceLabSimulation })));

interface LessonViewerProps {
  lesson: CourseLesson;
  allLessons?: CourseLesson[];
  onSelectLesson?: (lesson: CourseLesson) => void;
  onBack: () => void;
  onCompleteQuiz: (lessonId: string, score: number) => void;
  quizAlreadyValidated?: boolean;
  onQuizFullyValidated?: (lessonId: string) => void;
  grade?: PrimaryGrade;
  subjectId?: SubjectId;
  trimester?: number | 'all';
  onHomeClick?: () => void;
  tashkeelEnabled?: boolean;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson: lessonProp,
  allLessons = [],
  onSelectLesson,
  onBack,
  onCompleteQuiz,
  quizAlreadyValidated = false,
  onQuizFullyValidated,
  grade = lessonProp.grade,
  subjectId = lessonProp.subject,
  trimester,
  onHomeClick,
  tashkeelEnabled = true,
}) => {
  const t = useTranslation('courses');
  const { direction } = useLocaleContext();
  const { lesson, premiumFetchState } = usePremiumLessonContent(lessonProp);
  const speech = useLessonSpeech(lesson, grade);
  const practice = useLessonPractice(lesson, onCompleteQuiz);
  const quiz = useLessonQuiz({ lesson, quizAlreadyValidated, onCompleteQuiz, onQuizFullyValidated });

  const currentIndex = allLessons.length > 0 ? allLessons.findIndex((l) => l.id === lesson.id) : -1;
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const [activeTab, setActiveTab] = useState<TabId>('explanation');
  const [selectedExampleTier, setSelectedExampleTier] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [showRevisionSheet, setShowRevisionSheet] = useState(false);
  const [showParentInfo, setShowParentInfo] = useState(false);
  const enablePrintablePDFs = useFeatureFlag('enablePrintablePDFs');
  const showInteractive = hasRenderableInteractiveTool(lesson);

  useEffect(() => {
    setActiveTab('explanation');
    setSelectedExampleTier(1);
    setShowParentInfo(false);
    setShowRevisionSheet(false);
  }, [lesson.id]);

  const renderArabicText = (text: string | undefined | null): string => {
    if (!text) return '';
    return tashkeelEnabled ? text : stripArabicTashkeel(text);
  };

  const renderArabicMath = (text: string | undefined | null): React.ReactNode => {
    return renderTextWithMath(renderArabicText(text));
  };

  const availableSteps = React.useMemo(() => {
    const steps: LessonStep[] = [
      {
        id: 'explanation',
        labelAr: 'شرح الدرس والتطبيقات',
        icon: <Glasses className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-blue)] text-white ring-2 ring-blue-400',
        badgeColor: 'from-blue-600 to-indigo-600',
      },
      {
        id: 'content',
        labelAr: 'الملخص والقواعد',
        icon: <BookOpen className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-emerald)] text-white ring-2 ring-emerald-400',
        badgeColor: 'from-emerald-600 to-teal-700',
      },
    ];

    if (showInteractive) {
      steps.push({
        id: 'interactive',
        labelAr: 'الأداة التفاعلية المخصصة',
        icon: <Sparkles className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-amber)] text-slate-950 ring-2 ring-amber-400',
        badgeColor: 'from-amber-500 to-orange-600',
      });
    }

    if (lesson.progressiveExercises && lesson.progressiveExercises.length > 0) {
      steps.push({
        id: 'practice',
        labelAr: `أتدرب (${lesson.progressiveExercises.length})`,
        icon: <Award className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-amber)] text-slate-950 ring-2 ring-amber-400',
        badgeColor: 'from-amber-500 to-yellow-600',
      });
    }

    if (lesson.gameplay_simulation) {
      steps.push({
        id: 'gameplay',
        labelAr: 'لعبة المحاكاة التفاعلية',
        icon: <Gamepad2 className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-blue)] text-white ring-2 ring-sky-400',
        badgeColor: 'from-purple-600 to-indigo-600',
      });
    }

    if (practice.evaluationExercises.length > 0) {
      steps.push({
        id: 'evaluation',
        labelAr: `التقييم النهائي (${practice.evaluationExercises.length})`,
        icon: <ClipboardCheck className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-coral)] text-white ring-2 ring-rose-400',
        badgeColor: 'from-rose-500 to-pink-600',
      });
    }

    if (lesson.quiz.length > 0) {
      steps.push({
        id: 'quiz',
        labelAr: `الاختبار التفاعلي (${lesson.quiz.length})`,
        icon: <Trophy className="w-4 h-4" />,
        activeClass: 'bg-[var(--brand-emerald)] text-white ring-2 ring-emerald-400',
        badgeColor: 'from-emerald-500 to-teal-600',
      });
    }

    return steps;
  }, [showInteractive, lesson.progressiveExercises, lesson.gameplay_simulation, practice.evaluationExercises.length, lesson.quiz.length]);

  const currentStepIndex = Math.max(0, availableSteps.findIndex((s) => s.id === activeTab));
  const isLastStep = currentStepIndex >= availableSteps.length - 1;
  const nextStep = !isLastStep ? availableSteps[currentStepIndex + 1] : null;
  const prevStep = currentStepIndex > 0 ? availableSteps[currentStepIndex - 1] : null;

  const goToStep = (index: number) => {
    const clamped = Math.max(0, Math.min(availableSteps.length - 1, index));
    if (availableSteps[clamped]) {
      setActiveTab(availableSteps[clamped].id);
      setTimeout(() => {
        const topEl = document.getElementById('lesson-active-step-container');
        if (topEl) {
          topEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  if (lessonProp.premiumContentPending && premiumFetchState !== 'done') {
    return (
      <div className="space-y-6" dir={direction}>
        <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />} onClick={onBack}>
          {t('lessonsListButton')}
        </Button>
        {premiumFetchState === 'loading' && <LoadingFallback label={t('loadingLessonContent')} />}
        {premiumFetchState === 'forbidden' && (
          <Card padding="lg" className="text-center space-y-4">
            <Lock className="w-10 h-10 mx-auto text-[var(--brand-amber)]" />
            <h2 className="text-base font-black text-[var(--app-text)]">{renderArabicText(lesson.titleAr)}</h2>
            <p className="text-sm text-[var(--app-text-muted)] max-w-md mx-auto">
              {t('premiumForbiddenText')}
            </p>
            <Button variant="ghost" size="sm" onClick={onBack}>
              {t('backToLessonsListButton')}
            </Button>
          </Card>
        )}
        {premiumFetchState === 'error' && (
          <Card padding="lg" className="text-center space-y-4">
            <p className="text-sm text-[var(--app-text-muted)]">{t('loadFailedText')}</p>
            <Button variant="outline" size="sm" onClick={onBack}>
              {t('backToLessonsListButton')}
            </Button>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      <CourseBreadcrumb
        grade={grade}
        subjectId={subjectId}
        trimester={trimester}
        currentLesson={lesson}
        onHomeClick={() => {
          if (onHomeClick) onHomeClick();
          else onBack();
        }}
        onSubjectClick={onBack}
      />

      <Card padding="none" className="flex items-center justify-between flex-wrap gap-3 p-3.5">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<ArrowRight className="w-4 h-4" />} onClick={onBack}>
            قائمة الدروس
          </Button>

          {allLessons.length > 0 && currentIndex >= 0 && (
            <Badge variant="info">
              <span dir="ltr">{currentIndex + 1} / {allLessons.length}</span>
              <span>الدرس</span>
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {enablePrintablePDFs && (
            <Button
              variant="outline"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
              onClick={() => setShowRevisionSheet(true)}
              title="فيشة مراجعة قابلة للطباعة"
            >
              <span className="hidden sm:inline">فيشة المراجعة</span>
              <span className="sm:hidden">📄</span>
            </Button>
          )}

          {allLessons.length > 1 && (
            <>
              <Button
                variant="outline"
                size="md"
                icon={<ChevronRight className="w-4 h-4" />}
                disabled={!previousLesson}
                onClick={() => previousLesson && onSelectLesson?.(previousLesson)}
                title={previousLesson ? `الدرس السابق: ${renderArabicText(previousLesson.titleAr)}` : 'لا يوجد درس سابق'}
              >
                <span className="hidden sm:inline">الدرس السابق</span>
                <span className="sm:hidden">السابق</span>
              </Button>

              <Button
                variant={isLastStep ? 'info' : 'outline'}
                size="md"
                icon={isLastStep ? <ChevronLeft className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                iconPosition="end"
                disabled={!nextLesson || !isLastStep}
                onClick={() => isLastStep && nextLesson && onSelectLesson?.(nextLesson)}
                title={
                  !isLastStep
                    ? 'أكمل جميع مراحل هذا الدرس للتمكن من الانتقال للدرس التالي 🔒'
                    : nextLesson
                    ? `الدرس التالي: ${renderArabicText(nextLesson.titleAr)}`
                    : 'لا يوجد درس تالي'
                }
              >
                <span className="hidden sm:inline">الدرس التالي</span>
                <span className="sm:hidden">التالي</span>
              </Button>
            </>
          )}
        </div>
      </Card>

      {showRevisionSheet && (
        <RevisionSheetViewer lesson={lesson} onClose={() => setShowRevisionSheet(false)} tashkeelEnabled={tashkeelEnabled} />
      )}

      {speech.isYoungGrade && (
        <button
          onClick={speech.handleToggleSpeech}
          className={`w-full min-h-16 rounded-3xl flex items-center justify-center gap-3 text-lg sm:text-xl font-black shadow-lg transition-all cursor-pointer active:scale-[0.98] ${
            speech.isSpeaking
              ? 'bg-[var(--brand-coral)] text-white animate-pulse'
              : 'bg-[var(--brand-amber)] text-slate-950 hover:brightness-105'
          }`}
        >
          <span className="text-2xl">{speech.isSpeaking ? '⏹️' : '🔊'}</span>
          <span>{speech.isSpeaking ? 'إيقاف الاستماع' : 'إستمع للدرس'}</span>
        </button>
      )}

      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <BookOpen className="w-4 h-4" />
              {lesson.contentSource === 'official_verified' && <span>✅ محتوى مطابق لبرنامج رسمي موثّق</span>}
              {lesson.contentSource === 'corroborated' && <span className="text-sky-300">🔎 محتوى مُرجَّح (تمت مقارنته بمصدر ثانوي غير رسمي)</span>}
              {lesson.contentSource === 'complementary' && <span className="text-amber-300">✨ محتوى تربوي تكميلي أصلي (مسيد DZ)</span>}
              {(lesson.contentSource === 'needs_verification' || !lesson.contentSource) && (
                <span className="text-slate-400">⚠️ محتوى بحاجة إلى تحقق (المصدر غير مؤكد بعد)</span>
              )}
            </div>
            {lesson.difficultyTier && (
              <Badge variant="xp">
                {'⭐'.repeat(lesson.difficultyTier)} {lesson.difficultyTier === 1 ? 'سهل' : lesson.difficultyTier === 2 ? 'متوسط' : 'متقدم'}
              </Badge>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black mb-3">{renderArabicText(lesson.titleAr)}</h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            {renderArabicMath(lesson.summaryAr)}
          </p>
          {lesson.sourceNoteAr && (
            <div className="mt-3 border-t border-white/10 pt-2">
              <button
                onClick={() => setShowParentInfo((v) => !v)}
                aria-expanded={showParentInfo}
                className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>معلومة لولي الأمر</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showParentInfo ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {showParentInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-slate-400 text-[10px] leading-relaxed max-w-3xl pt-2">
                      {renderArabicMath(lesson.sourceNoteAr)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {lesson.missionTitleAr && (
        <div className="bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-emerald)] text-white rounded-3xl p-5 shadow-md">
          <h2 className="font-black text-base sm:text-lg mb-1">{renderArabicText(lesson.missionTitleAr)}</h2>
          {lesson.missionIntroAr && <p className="text-xs sm:text-sm text-white/90 leading-relaxed">{renderArabicText(lesson.missionIntroAr)}</p>}
        </div>
      )}

      {lesson.objectivesAr && lesson.objectivesAr.length > 0 && (
        <Card padding="none" className="p-5">
          <h3 className="font-extrabold text-sm text-[var(--app-text)] flex items-center gap-2 mb-2.5">
            <Target className="w-4 h-4 text-[var(--brand-blue)]" />
            <span>في نهاية هذا الدرس، سأكون قادراً على:</span>
          </h3>
          <ul className="space-y-1.5">
            {lesson.objectivesAr.map((obj, i) => (
              <li key={i} className="text-xs sm:text-sm text-[var(--app-text-muted)] flex items-start gap-2">
                <span className="text-[var(--brand-blue)] shrink-0">◆</span>
                <span>{renderArabicMath(obj)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div id="lesson-active-step-container" className="scroll-mt-20 bg-[var(--app-card-bg)] border-2 border-[var(--app-card-border)] rounded-3xl p-3.5 sm:p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
              {currentStepIndex + 1}
            </span>
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-[var(--app-text-muted)] block">
                مراحل الدرس خطوة بخطوة 🎯
              </span>
              <h2 className="text-xs sm:text-sm font-black text-[var(--app-text)]">
                {availableSteps[currentStepIndex]?.labelAr || 'مرحلة الدرس'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[var(--brand-emerald-dark)] bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
              الخطوة <span dir="ltr">{currentStepIndex + 1} / {availableSteps.length}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap items-center gap-2 pt-1">
          {availableSteps.map((step, idx) => {
            const isActive = step.id === activeTab;
            const isCompleted = idx < currentStepIndex;
            return (
              <button
                key={step.id}
                onClick={() => goToStep(idx)}
                className={`flex items-center justify-between gap-2 min-h-12 px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                  isActive
                    ? `${step.activeClass} shadow-md scale-[1.02]`
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
                    : 'bg-[var(--app-card-subtle)] border-[var(--app-card-border)] text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="shrink-0">{isCompleted ? '✅' : step.icon}</span>
                  <span className="truncate">{step.labelAr}</span>
                </div>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isActive ? 'bg-white/25 text-white' : isCompleted ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-black/5 dark:bg-white/10'
                }`}>
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={tabTransition}
        >
          {activeTab === 'explanation' && (
            <LessonExplanationView
              lesson={lesson}
              tashkeelEnabled={tashkeelEnabled}
              availableSteps={availableSteps}
              activeStepId={activeTab}
              onSelectStep={(stepId) => setActiveTab(stepId as TabId)}
            />
          )}

          {activeTab === 'gameplay' && lesson.gameplay_simulation && (
            <Suspense fallback={<LoadingFallback label="جاري تحميل المحاكاة..." />}>
              <ScienceLabSimulation gameplay={lesson.gameplay_simulation} grade={lesson.grade} />
            </Suspense>
          )}

          {activeTab === 'practice' && lesson.progressiveExercises && (
            <LessonPracticePanel
              lesson={lesson}
              practice={practice}
              renderArabicText={renderArabicText}
              gameAnswers={quiz.gameAnswers}
              onSelectGameOption={quiz.handleSelectGameOption}
              onResetGame={() => quiz.setGameAnswers({})}
            />
          )}

          {activeTab === 'content' && (
            <LessonContentPanel
              lesson={lesson}
              renderArabicText={renderArabicText}
              renderSpeakButton={speech.renderSpeakButton}
              selectedExampleTier={selectedExampleTier}
              onSelectExampleTier={setSelectedExampleTier}
              visibleSolutions={quiz.visibleSolutions}
              onToggleSolution={(index) =>
                quiz.setVisibleSolutions((prev) => ({ ...prev, [index]: !prev[index] }))
              }
              onGoToSimulation={() => setActiveTab('gameplay')}
            />
          )}

          {activeTab === 'interactive' && showInteractive && (
            <LessonInteractiveTools lesson={lesson} />
          )}

          {activeTab === 'evaluation' && practice.evaluationExercises.length > 0 && (
            <LessonEvaluationPanel
              lesson={lesson}
              practice={practice}
              renderArabicText={renderArabicText}
            />
          )}

          {activeTab === 'quiz' && lesson.quiz.length > 0 && (
            <LessonQuizPanel
              lesson={lesson}
              shuffledQuiz={quiz.shuffledQuiz}
              selectedAnswers={quiz.selectedAnswers}
              recentAnswerId={quiz.recentAnswerId}
              renderArabicText={renderArabicText}
              onSelectOption={quiz.handleSelectOption}
              onShuffle={quiz.initializeShuffledQuiz}
              onReset={quiz.handleResetQuiz}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <LessonStepFooter
        availableSteps={availableSteps}
        currentStepIndex={currentStepIndex}
        isLastStep={isLastStep}
        nextStep={nextStep}
        prevStep={prevStep}
        previousLesson={previousLesson}
        nextLesson={nextLesson}
        renderArabicText={renderArabicText}
        onGoToStep={goToStep}
        onSelectLesson={onSelectLesson}
        onBack={onBack}
      />
    </div>
  );
};

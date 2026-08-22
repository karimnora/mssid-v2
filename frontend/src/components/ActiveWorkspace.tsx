import React, { Suspense, lazy, useEffect } from 'react';
import { motion } from 'motion/react';
import { CourseLesson, PrimaryGrade, SubjectId, UserProfile } from '../types';
import { INTERACTIVE_LABS_LIST } from '../data/subjectsData';
import { LessonViewer } from './LessonViewer';
import { ExamsViewer } from './ExamsViewer';
import { LoadingFallback } from './LoadingFallback';
import { HeaderTheme } from './Navbar';
import { isLabSubjectId, MainCategory } from '../navigation/appLocation';
import { useTranslation } from '../hooks/useTranslation';

const SorobanInteractive = lazy(() => import('./SorobanInteractive').then((m) => ({ default: m.SorobanInteractive })));
const ElectricityLabInteractive = lazy(() => import('./ElectricityLabInteractive').then((m) => ({ default: m.ElectricityLabInteractive })));
const UnitConverter = lazy(() => import('./UnitConverter').then((m) => ({ default: m.UnitConverter })));
const GeometryVisualizer = lazy(() => import('./GeometryVisualizer').then((m) => ({ default: m.GeometryVisualizer })));
const EducationalCalculator = lazy(() => import('./EducationalCalculator').then((m) => ({ default: m.EducationalCalculator })));
const ArabicConjugator = lazy(() => import('./ArabicConjugator').then((m) => ({ default: m.ArabicConjugator })));
const FrenchLanguageLab = lazy(() => import('./FrenchLanguageLab').then((m) => ({ default: m.FrenchLanguageLab })));
const EnglishLanguageLab = lazy(() => import('./EnglishLanguageLab').then((m) => ({ default: m.EnglishLanguageLab })));
const MultiplicationTableInteractive = lazy(() => import('./MultiplicationTableInteractive').then((m) => ({ default: m.MultiplicationTableInteractive })));
const AlgerianCurrencyMarket = lazy(() => import('./AlgerianCurrencyMarket').then((m) => ({ default: m.AlgerianCurrencyMarket })));
const WilayasExplorer = lazy(() => import('./WilayasExplorer').then((m) => ({ default: m.WilayasExplorer })));
const AlgerianHistoryMuseum = lazy(() => import('./AlgerianHistoryMuseum').then((m) => ({ default: m.AlgerianHistoryMuseum })));
const ScienceExperimentLab = lazy(() => import('./ScienceExperimentLab').then((m) => ({ default: m.ScienceExperimentLab })));
const TamazightLabInteractive = lazy(() => import('./TamazightLabInteractive').then((m) => ({ default: m.TamazightLabInteractive })));
const TamazightCurriculumViewer = lazy(() => import('./TamazightCurriculumViewer').then((m) => ({ default: m.TamazightCurriculumViewer })));
const TouchWritingStudio = lazy(() => import('./TouchWritingStudio').then((m) => ({ default: m.TouchWritingStudio })));
const PrimaryMathLabInteractive = lazy(() => import('./PrimaryMathLabInteractive').then((m) => ({ default: m.PrimaryMathLabInteractive })));
const PrimaryDiscoveryLabInteractive = lazy(() => import('./PrimaryDiscoveryLabInteractive').then((m) => ({ default: m.PrimaryDiscoveryLabInteractive })));
const FrenchProjectsLabInteractive = lazy(() => import('./FrenchProjectsLabInteractive').then((m) => ({ default: m.FrenchProjectsLabInteractive })));
const EnglishAudioDialoguesLab = lazy(() => import('./EnglishAudioDialoguesLab').then((m) => ({ default: m.EnglishAudioDialoguesLab })));
const HumanAnatomyLab = lazy(() => import('./HumanAnatomyLab').then((m) => ({ default: m.HumanAnatomyLab })));
const EarthCyclesLab = lazy(() => import('./EarthCyclesLab').then((m) => ({ default: m.EarthCyclesLab })));
const FractionsDecimalsLab = lazy(() => import('./FractionsDecimalsLab').then((m) => ({ default: m.FractionsDecimalsLab })));
const AreaPerimeterGridLab = lazy(() => import('./AreaPerimeterGridLab').then((m) => ({ default: m.AreaPerimeterGridLab })));
const ClockTrainerLab = lazy(() => import('./ClockTrainerLab').then((m) => ({ default: m.ClockTrainerLab })));
const SyllableStudioLab = lazy(() => import('./SyllableStudioLab').then((m) => ({ default: m.SyllableStudioLab })));
const SpeedReadingLab = lazy(() => import('./SpeedReadingLab').then((m) => ({ default: m.SpeedReadingLab })));
const TopographyMapLab = lazy(() => import('./TopographyMapLab').then((m) => ({ default: m.TopographyMapLab })));
const ChallengesArena = lazy(() => import('./ChallengesArena').then((m) => ({ default: m.ChallengesArena })));

interface ActiveWorkspaceProps {
  grade: PrimaryGrade;
  selectedSubject: SubjectId;
  selectedLesson: CourseLesson | null;
  currentLessons: CourseLesson[];
  selectedTrimester: number | 'all';
  mainCategory: MainCategory;
  headerTheme: HeaderTheme;
  userProfile: UserProfile;
  onSelectLesson: (lesson: CourseLesson) => void;
  onClearLesson: () => void;
  onBackToCourses: () => void;
  onGoHome: () => void;
  onOpenLab: (toolId: SubjectId) => void;
  onCompleteQuiz: (lessonId: string, score: number) => void;
  onQuizFullyValidated: (lessonId: string) => void;
  onExamComplete: (examId: string) => void;
  onChallengeComplete: (challengeId: string, earnedXp: number) => void;
  onGameComplete: (gameId: string, earnedXp: number) => void;
  onVisitLab: (labId: string) => void;
  onLabReward: (coins: number, xp: number) => void;
  onEarnCoins: (amount: number) => void;
}

export const ActiveWorkspace: React.FC<ActiveWorkspaceProps> = ({
  grade,
  selectedSubject,
  selectedLesson,
  currentLessons,
  selectedTrimester,
  mainCategory,
  headerTheme,
  userProfile,
  onSelectLesson,
  onClearLesson,
  onBackToCourses,
  onGoHome,
  onOpenLab,
  onCompleteQuiz,
  onQuizFullyValidated,
  onExamComplete,
  onChallengeComplete,
  onGameComplete,
  onVisitLab,
  onLabReward,
  onEarnCoins,
}) => {
  const t = useTranslation('navigation');

  useEffect(() => {
    if (isLabSubjectId(selectedSubject)) {
      onVisitLab(selectedSubject);
    }
  }, [selectedSubject, onVisitLab]);

  return (
  <div id="active-interactive-tool-section" className="scroll-mt-24 transition-all duration-300 relative">
    {mainCategory === 'labs' && (
      <motion.div
        key={`tool-header-${selectedSubject}`}
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-4 p-3.5 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 border-2 border-amber-400/40 rounded-2xl flex items-center justify-between flex-wrap gap-2 shadow-xs ring-4 ring-amber-400/15"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm shadow-xs animate-bounce">
            🎯
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[var(--app-text)]">
                {INTERACTIVE_LABS_LIST.find((lab) => lab.id === selectedSubject)?.nameAr || t('fallbackLabName')}
              </span>
              <span className="bg-emerald-500/20 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                {t('labReadyHint')}
              </span>
            </div>
            <p className="text-[11px] text-[var(--app-text-muted)]">
              {t('labOpenedToast')}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const hub = document.getElementById('tools-hub-container');
            if (hub) {
              hub.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-[var(--app-card-bg)] text-[var(--app-text)] hover:bg-[var(--app-card-subtle)] border border-[var(--app-card-border)] shadow-xs transition-all cursor-pointer hover:scale-105"
        >
          <span>{t('chooseAnotherTool')}</span>
        </button>
      </motion.div>
    )}

      <Suspense fallback={<LoadingFallback label={t('loadingInteractiveTool')} />}>
      {selectedSubject === 'algerian_market' ? (
        <AlgerianCurrencyMarket
          grade={grade}
          goldCoins={userProfile.goldCoins || 150}
          onBack={onGoHome}
          onEarnCoins={onEarnCoins}
        />
      ) : selectedSubject === 'wilayas_map' ? (
        <WilayasExplorer grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'history_museum' ? (
        <AlgerianHistoryMuseum grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'science_lab' ? (
        <ScienceExperimentLab grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'tamazight_lab' ? (
        <TamazightLabInteractive grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'tamazight_curriculum' ? (
        <TamazightCurriculumViewer
          grade={grade}
          onOpenLab={() => onOpenLab('tamazight_lab')}
          onBack={onGoHome}
          onReward={onLabReward}
        />
      ) : selectedSubject === 'touch_writing' ? (
        <TouchWritingStudio grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'primary_math_ops' ? (
        <PrimaryMathLabInteractive grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'primary_discovery' ? (
        <PrimaryDiscoveryLabInteractive grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'french_projects' ? (
        <FrenchProjectsLabInteractive grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'english_audio_dialogues' ? (
        <EnglishAudioDialoguesLab grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'arabic_conjugator' ? (
        <ArabicConjugator grade={grade} />
      ) : selectedSubject === 'french_lab' ? (
        <FrenchLanguageLab grade={grade} />
      ) : selectedSubject === 'english_lab' ? (
        <EnglishLanguageLab grade={grade} />
      ) : selectedSubject === 'educational_calculator' ? (
        <EducationalCalculator />
      ) : selectedSubject === 'soroban' ? (
        <SorobanInteractive grade={grade} />
      ) : selectedSubject === 'electricity' ? (
        <ElectricityLabInteractive />
      ) : selectedSubject === 'geometry' ? (
        <GeometryVisualizer grade={grade} theme={headerTheme} />
      ) : selectedSubject === 'converter' ? (
        <UnitConverter grade={grade} theme={headerTheme} />
      ) : selectedSubject === 'multiplication' ? (
        <MultiplicationTableInteractive grade={grade} />
      ) : selectedSubject === 'human_anatomy' ? (
        <HumanAnatomyLab grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'earth_cycles' ? (
        <EarthCyclesLab grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'fractions_lab' ? (
        <FractionsDecimalsLab grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'area_grid' ? (
        <AreaPerimeterGridLab grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'clock_trainer' ? (
        <ClockTrainerLab grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'syllable_studio' ? (
        <SyllableStudioLab grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'speed_reading' ? (
        <SpeedReadingLab grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'topography_map' ? (
        <TopographyMapLab grade={grade} onBack={onGoHome} onReward={onLabReward} />
      ) : selectedSubject === 'exams' ? (
        <ExamsViewer
          grade={grade}
          tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
          completedExamIds={userProfile.completedExamIds}
          onExamComplete={onExamComplete}
          onOpenCourses={onBackToCourses}
        />
      ) : selectedSubject === 'challenges' ? (
        <ChallengesArena
          grade={grade}
          tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
          onChallengeComplete={onChallengeComplete}
          userXp={userProfile.xp}
          userBadges={userProfile.badges}
          completedGameIds={userProfile.completedGameIds ?? []}
          onGameComplete={onGameComplete}
        />
      ) : selectedLesson ? (
        <LessonViewer
          lesson={selectedLesson}
          allLessons={currentLessons}
          onSelectLesson={onSelectLesson}
          onBack={onClearLesson}
          onCompleteQuiz={onCompleteQuiz}
          quizAlreadyValidated={userProfile.quizFullyValidatedLessonIds.includes(selectedLesson.id)}
          onQuizFullyValidated={onQuizFullyValidated}
          grade={grade}
          subjectId={selectedSubject}
          trimester={selectedTrimester}
          tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
          onHomeClick={onBackToCourses}
        />
      ) : null}
    </Suspense>
  </div>
  );
};

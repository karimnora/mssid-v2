import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useActivityExitGuard } from '../context/ActivityExitContext';
import { CourseLesson, PrimaryGrade, SubjectId, UserProfile } from '../types';
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
const SpeedVelocityLab = lazy(() => import('./SpeedVelocityLab').then((m) => ({ default: m.SpeedVelocityLab })));
const QuranLabInteractive = lazy(() => import('./QuranLabInteractive').then((m) => ({ default: m.QuranLabInteractive })));
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
  onBackToLabsCatalog: () => void;
  onOpenLab: (toolId: SubjectId) => void;
  onCompleteQuiz: (lessonId: string, score: number) => void;
  onQuizFullyValidated: (lessonId: string) => void;
  onQuizMiss?: (lessonId: string) => void;
  onExamComplete: (examId: string) => void;
  onChallengeComplete: (challengeId: string, earnedXp: number) => void;
  onVisitLab: (labId: string) => void;
  onLabReward: (coins: number, xp: number) => void;
  onEarnCoins: (amount: number) => void;
  /** Opens the contact form pre-filled to report an error on an exam corrigé or a lesson. */
  onReportError: (contextLabel: string) => void;
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
  onBackToLabsCatalog,
  onOpenLab,
  onCompleteQuiz,
  onQuizFullyValidated,
  onQuizMiss,
  onExamComplete,
  onChallengeComplete,
  onVisitLab,
  onLabReward: publishLabReward,
  onEarnCoins,
  onReportError,
}) => {
  const t = useTranslation('navigation');

  useEffect(() => {
    if (isLabSubjectId(selectedSubject)) {
      onVisitLab(selectedSubject);
    }
  }, [selectedSubject, onVisitLab]);

  const labOpen = isLabSubjectId(selectedSubject);
  const [workingLab, setWorkingLab] = useState<string | null>(null);
  useActivityExitGuard(labOpen && workingLab === `${selectedSubject}:${grade}`);
  const onLabReward = (coins: number, xp: number) => {
    setWorkingLab(null);
    publishLabReward(coins, xp);
  };

  return (
  <div id="active-interactive-tool-section" className="scroll-mt-24 transition-all duration-300 relative">
      <Suspense fallback={<LoadingFallback label={t('loadingInteractiveTool')} />}>
      <div
        data-lab-shell={labOpen ? 'true' : undefined}
        onClickCapture={event => {
          if (labOpen && event.target instanceof Element && !event.target.closest('[data-activity-navigation]') && event.target.closest('button, input, select, canvas, [role="button"]')) setWorkingLab(`${selectedSubject}:${grade}`);
        }}
        onChange={() => { if (labOpen) setWorkingLab(`${selectedSubject}:${grade}`); }}
        onPointerDown={event => {
          if (labOpen && event.target instanceof Element && !event.target.closest('[data-activity-navigation]') && event.target.closest('canvas, svg:not(.lucide)')) setWorkingLab(`${selectedSubject}:${grade}`);
        }}
        className={labOpen ? 'lab-interior kids-pole overflow-x-hidden overflow-y-visible rounded-[28px]' : undefined}
      >
      {labOpen && <div className="kids-hero-band" />}
      {selectedSubject === 'algerian_market' ? (
        <AlgerianCurrencyMarket
          grade={grade}
          goldCoins={userProfile.goldCoins || 150}
          onBack={onBackToLabsCatalog}
          onEarnCoins={onEarnCoins}
        />
      ) : selectedSubject === 'wilayas_map' ? (
        <WilayasExplorer onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'history_museum' ? (
        <AlgerianHistoryMuseum grade={grade} onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'science_lab' ? (
        <ScienceExperimentLab grade={grade} onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'tamazight_lab' ? (
        <TamazightLabInteractive grade={grade} onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'tamazight_curriculum' ? (
        <TamazightCurriculumViewer
          grade={grade}
          onOpenLab={() => onOpenLab('tamazight_lab')}
          onBack={onBackToLabsCatalog}
          onReward={onLabReward}
        />
      ) : selectedSubject === 'touch_writing' ? (
        <TouchWritingStudio grade={grade} onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'primary_math_ops' ? (
        <PrimaryMathLabInteractive grade={grade} onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'primary_discovery' ? (
        <PrimaryDiscoveryLabInteractive onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'french_projects' ? (
        <FrenchProjectsLabInteractive grade={grade} onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'english_audio_dialogues' ? (
        <EnglishAudioDialoguesLab grade={grade} onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'arabic_conjugator' ? (
        <ArabicConjugator />
      ) : selectedSubject === 'french_lab' ? (
        <FrenchLanguageLab grade={grade} />
      ) : selectedSubject === 'english_lab' ? (
        <EnglishLanguageLab grade={grade} />
      ) : selectedSubject === 'educational_calculator' ? (
        <EducationalCalculator grade={grade} />
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
        <HumanAnatomyLab grade={grade} onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'earth_cycles' ? (
        <EarthCyclesLab onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'fractions_lab' ? (
        <FractionsDecimalsLab grade={grade} onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'area_grid' ? (
        <AreaPerimeterGridLab onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'clock_trainer' ? (
        <ClockTrainerLab grade={grade} onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'syllable_studio' ? (
        <SyllableStudioLab grade={grade} onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'speed_reading' ? (
        <SpeedReadingLab onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'topography_map' ? (
        <TopographyMapLab onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'speed_lab' ? (
        <SpeedVelocityLab grade={grade} onBack={onBackToLabsCatalog} onReward={onLabReward} />
      ) : selectedSubject === 'quran_lab' ? (
        <QuranLabInteractive />
      ) : selectedSubject === 'exams' ? (
        <ExamsViewer
          grade={grade}
          tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
          completedExamIds={userProfile.completedExamIds}
          onExamComplete={onExamComplete}
          onOpenCourses={onBackToCourses}
          onOpenLesson={onSelectLesson}
          onReportError={onReportError}
        />
      ) : selectedSubject === 'challenges' ? (
        <ChallengesArena
          grade={grade}
          tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
          onChallengeComplete={onChallengeComplete}
          completedChallengeIds={userProfile.completedChallengeIds ?? []}
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
          onQuizMiss={onQuizMiss}
          grade={grade}
          subjectId={selectedSubject}
          trimester={selectedTrimester}
          tashkeelEnabled={userProfile.tashkeelEnabled ?? false}
          onHomeClick={onBackToCourses}
          onReportError={onReportError}
        />
      ) : null}
      </div>
    </Suspense>
  </div>
  );
};

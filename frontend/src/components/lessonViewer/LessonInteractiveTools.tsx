import React, { Suspense, lazy } from 'react';
import { CourseLesson } from '../../types';
import { LoadingFallback } from '../LoadingFallback';

const ArabicCanvasInteractive = lazy(() => import('../ArabicCanvasInteractive').then((m) => ({ default: m.ArabicCanvasInteractive })));
const SorobanInteractive = lazy(() => import('../SorobanInteractive').then((m) => ({ default: m.SorobanInteractive })));
const UnitConverter = lazy(() => import('../UnitConverter').then((m) => ({ default: m.UnitConverter })));
const GeometryVisualizer = lazy(() => import('../GeometryVisualizer').then((m) => ({ default: m.GeometryVisualizer })));
const ScienceLabSimulation = lazy(() => import('../ScienceLabSimulation').then((m) => ({ default: m.ScienceLabSimulation })));
const ArabicConjugator = lazy(() => import('../ArabicConjugator').then((m) => ({ default: m.ArabicConjugator })));
const MultiplicationTableInteractive = lazy(() => import('../MultiplicationTableInteractive').then((m) => ({ default: m.MultiplicationTableInteractive })));
const FrenchLanguageLab = lazy(() => import('../FrenchLanguageLab').then((m) => ({ default: m.FrenchLanguageLab })));
const EnglishLanguageLab = lazy(() => import('../EnglishLanguageLab').then((m) => ({ default: m.EnglishLanguageLab })));
const HistoryGeoInteractive = lazy(() => import('../HistoryGeoInteractive').then((m) => ({ default: m.HistoryGeoInteractive })));
const IslamicEducationInteractive = lazy(() => import('../IslamicEducationInteractive').then((m) => ({ default: m.IslamicEducationInteractive })));
const CivicsInteractive = lazy(() => import('../CivicsInteractive').then((m) => ({ default: m.CivicsInteractive })));
const MathInteractive = lazy(() => import('../MathInteractive').then((m) => ({ default: m.MathInteractive })));
const LanguageLabInteractive = lazy(() => import('../LanguageLabInteractive').then((m) => ({ default: m.LanguageLabInteractive })));

export function hasRenderableInteractiveTool(lesson: CourseLesson): boolean {
  const effectiveTool = lesson.interactiveTool;
  const toolRequiresConfig: Partial<Record<string, boolean>> = {
    science_lab: !!lesson.gameplay_simulation,
    math_lab: !!lesson.mathInteractive,
    islamic_lab: !!lesson.islamicInteractive,
    civics_lab: !!lesson.civicsInteractive,
    history_geo_lab: !!lesson.historyGeoInteractive,
    french_dialogue_lab: !!lesson.languageInteractive,
    english_dialogue_lab: !!lesson.languageInteractive,
  };
  return !!effectiveTool && (toolRequiresConfig[effectiveTool] ?? true);
}

export const LessonInteractiveTools: React.FC<{ lesson: CourseLesson }> = ({ lesson }) => {
  const effectiveTool = lesson.interactiveTool;
  return (
    <Suspense fallback={<LoadingFallback label="جاري تحميل الأداة التفاعلية..." />}>
      <div className="space-y-4">
        {effectiveTool === 'arabic_canvas' && <ArabicCanvasInteractive lesson={lesson} grade={lesson.grade} />}
        {effectiveTool === 'soroban' && <SorobanInteractive grade={lesson.grade} />}
        {effectiveTool === 'unit_converter' && <UnitConverter grade={lesson.grade} />}
        {effectiveTool === 'geometry_visualizer' && <GeometryVisualizer grade={lesson.grade} />}
        {effectiveTool === 'science_lab' && lesson.gameplay_simulation && (
          <ScienceLabSimulation gameplay={lesson.gameplay_simulation} grade={lesson.grade} />
        )}
        {effectiveTool === 'arabic_conjugator' && <ArabicConjugator grade={lesson.grade} />}
        {effectiveTool === 'multiplication_table' && <MultiplicationTableInteractive grade={lesson.grade} />}
        {effectiveTool === 'french_lab' && <FrenchLanguageLab grade={lesson.grade} />}
        {effectiveTool === 'english_lab' && <EnglishLanguageLab grade={lesson.grade} />}
        {effectiveTool === 'history_geo_lab' && lesson.historyGeoInteractive && <HistoryGeoInteractive config={lesson.historyGeoInteractive} />}
        {effectiveTool === 'islamic_lab' && lesson.islamicInteractive && <IslamicEducationInteractive config={lesson.islamicInteractive} />}
        {effectiveTool === 'civics_lab' && lesson.civicsInteractive && <CivicsInteractive config={lesson.civicsInteractive} />}
        {effectiveTool === 'math_lab' && lesson.mathInteractive && <MathInteractive config={lesson.mathInteractive} />}
        {effectiveTool === 'french_dialogue_lab' && lesson.languageInteractive && <LanguageLabInteractive config={lesson.languageInteractive} subject="french" />}
        {effectiveTool === 'english_dialogue_lab' && lesson.languageInteractive && <LanguageLabInteractive config={lesson.languageInteractive} subject="english" />}
      </div>
    </Suspense>
  );
};

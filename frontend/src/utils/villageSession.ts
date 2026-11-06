import type { FractionObservations } from '../components/lessonViewer/fractionJourneyContent';
import type { PrimaryGrade } from '../types';
export interface VillageSessionSummary {
  id: string;
  title: string;
  grade: PrimaryGrade;
  learn: FractionObservations;
  transfer: FractionObservations;
  examples?: string[];
  alone: number;
  helped: number;
  needs: number;
  quizCorrect: number;
  quizTotal: number;
  next: 'interactive' | 'practice' | 'quiz';
}

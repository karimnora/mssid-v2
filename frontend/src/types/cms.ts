import type { PrimaryGrade, SubjectId } from './index';
export type { PrimaryGrade, SubjectId };

export type CmsRole = 'admin' | 'teacher' | 'reviewer' | 'viewer';

export type CmsPermission =
  | 'manage_curriculum'
  | 'edit_content'
  | 'review_content'
  | 'validate_content'
  | 'publish_content'
  | 'manage_media'
  | 'import_documents'
  | 'ai_generate'
  | 'view_analytics';

export interface CmsUser {
  id: string;
  name: string;
  email: string;
  role: CmsRole;
  avatar: string;
  department: string;
}

export interface PedagogicalCompetency {
  id: string;
  code: string; // e.g. "COMP-MATH-5AP-01"
  descriptionAr: string;
  domainAr: string; // e.g. "الأعداد والحساب", "الهندسة والفضاء"
}

export interface PedagogicalObjective {
  id: string;
  descriptionAr: string;
  bloomTaxonomyLevel?: 'knowledge' | 'comprehension' | 'application' | 'analysis';
}

export interface CmsSubLesson {
  id: string;
  titleAr: string;
  order: number;
  objectives: PedagogicalObjective[];
  contentAr: string;
}

export interface CmsChapter {
  id: string;
  grade: PrimaryGrade;
  subject: SubjectId;
  code: string;
  titleAr: string;
  order: number;
  competencies: PedagogicalCompetency[];
  subLessons: CmsSubLesson[];
}

export interface CmsCurriculumProgram {
  id: string;
  country: string; // "الجزائر"
  schoolSystem: string; // "المنهاج الوطني لوزارة التربية الوطنية"
  academicYear: string; // "2025/2026"
  grade: PrimaryGrade;
  subject: SubjectId;
  chapters: CmsChapter[];
  updatedAt: string;
}

export interface CmsCourseItem {
  id: string;
  chapterId: string;
  grade: PrimaryGrade;
  subject: SubjectId;
  titleAr: string;
  titleFr?: string;
  summaryAr: string;
  bodyHtmlContent: string; // Rich text / HTML
  rulesAr: string[];
  keyFormulas?: { labelAr: string; formulaAr: string }[];
  mediaUrls: string[]; // Images, Audio, Videos
  attachments: { name: string; url: string; size: string }[];
  interactiveTool?: 'soroban' | 'unit_converter' | 'geometry_visualizer' | 'multiplication_table';
  isHidden?: boolean;
  authorName: string;
  updatedAt: string;
}

export type ExerciseType =
  | 'qcm'
  | 'true_false'
  | 'fill_blanks'
  | 'drag_drop'
  | 'matching'
  | 'calculation'
  | 'free_response';

export type ExerciseDifficulty = 'easy' | 'medium' | 'hard';

export interface MatchingPair {
  leftTextAr: string;
  rightTextAr: string;
}

export interface CmsExercise {
  id: string;
  courseId?: string;
  chapterId: string;
  grade: PrimaryGrade;
  subject: SubjectId;
  titleAr: string;
  type: ExerciseType;
  difficulty: ExerciseDifficulty;
  estimatedMinutes: number;
  pointsXp: number;
  questionAr: string;
  options?: { id: string; textAr: string; isCorrect: boolean; explanationAr?: string }[];
  fillBlanksTextAr?: string; // e.g. "حجم المكعب يساوي [الضلع] × [الضلع] × [الضلع]"
  matchingPairs?: MatchingPair[];
  correctSolutionAr: string;
  stepByStepExplanationAr: string;
  competencyCode?: string;
  updatedAt: string;
}

export interface CmsExamSpec {
  id: string;
  grade: PrimaryGrade;
  subject: SubjectId;
  year: number;
  sessionAr: string;
  titleAr: string;
  durationMinutes: number;
  totalPoints: number;
  passingScore: number;
  exerciseIds: string[];
  autoGradingEnabled: boolean;
  authorName: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'video' | 'audio' | 'illustration';
  url: string;
  sizeFormatted: string;
  uploadedAt: string;
  tags: string[];
}

export interface DocumentImportSession {
  id: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'markdown' | 'json' | 'csv';
  fileSizeBytes: number;
  extractedTextPreview: string;
  detectedGrade: PrimaryGrade;
  detectedSubject: SubjectId;
  detectedChapters: {
    titleAr: string;
    competenciesAr: string[];
    lessonsAr: string[];
  }[];
  status: 'uploaded' | 'analyzing' | 'preview' | 'committed';
  createdAt: string;
}

export interface CmsAnalyticsStats {
  totalCourses: number;
  totalExercises: number;
  totalExams: number;
  totalMediaAssets: number;
  publishedRatio: number;
  activeStudentsCount: number;
  averagePassRatePercent: number;
  averageTimeSpentMinutes: number;
  dailyActiveUsers: number;
  totalSignups: number;
  preschoolSessionsCount: number;
  gradeDistribution: Record<PrimaryGrade, number>;
  topConsultedLessons: { titleAr: string; views: number; subject: SubjectId }[];
}

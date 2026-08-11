export type PrimaryGrade = '1AP' | '2AP' | '3AP' | '4AP' | '5AP';

export type SubjectId =
  | 'math'
  | 'arabic'
  | 'soroban'
  | 'exams'
  | 'science'
  | 'electricity'
  | 'history_geo'
  | 'islamic'
  | 'civics'
  | 'french'
  | 'english'
  | 'arabic_conjugator'
  | 'french_lab'
  | 'english_lab'
  | 'educational_calculator'
  | 'writing_response'
  | 'geometry'
  | 'converter'
  | 'multiplication';

export interface SubjectInfo {
  id: SubjectId;
  nameAr: string;
  nameFr: string;
  icon: string;
  color: string;
  bgLight: string;
  description: string;
  category?: 'course' | 'tool' | 'exam';
}

export interface QuizOption {
  id: string;
  textAr: string;
  isCorrect: boolean;
  explanationAr?: string;
}

export interface QuizQuestion {
  id: string;
  questionAr: string;
  options: QuizOption[];
  hintAr?: string;
}

export interface KeyFormula {
  labelAr: string;
  formulaAr: string;
  noteAr?: string;
}

export type GameplayModuleType = 'circuit_builder' | 'safety_roleplay' | 'lever_balance' | 'mixtures_lab';

export interface CircuitComponent {
  id: string;
  nameAr: string;
  nameFr: string;
  type: 'battery' | 'wire' | 'bulb' | 'switch' | 'insulator' | 'conductor';
  icon?: string;
  isInsulator?: boolean;
}

export interface CircuitCombination {
  id: string;
  titleAr: string;
  titleFr: string;
  components: string[];
  switchState?: 'open' | 'closed';
  success: boolean;
  bulbLit: boolean;
  messageAr: string;
  messageFr: string;
  explanationAr: string;
  explanationFr: string;
}

export interface CircuitGameplay {
  type: 'circuit_builder';
  titleAr: string;
  titleFr: string;
  instructionsAr: string;
  instructionsFr: string;
  availableComponents: CircuitComponent[];
  combinations: CircuitCombination[];
}

export interface SafetyChoice {
  id: string;
  textAr: string;
  textFr: string;
  isSafe: boolean;
  statusLabelAr: string;
  statusLabelFr: string;
  resultMessageAr: string;
  resultMessageFr: string;
}

export interface SafetyRoleplayGameplay {
  type: 'safety_roleplay';
  sceneTitleAr: string;
  sceneTitleFr: string;
  sceneDescriptionAr: string;
  sceneDescriptionFr: string;
  choices: SafetyChoice[];
}

export interface LeverChoice {
  positionId: 'near_load' | 'middle' | 'far_from_load';
  positionLabelAr: string;
  positionLabelFr: string;
  effortNeededAr: string;
  effortNeededFr: string;
  success: boolean;
  resultTitleAr: string;
  resultTitleFr: string;
  explanationAr: string;
  explanationFr: string;
}

export interface LeverGameplay {
  type: 'lever_balance';
  titleAr: string;
  titleFr: string;
  challengeAr: string;
  challengeFr: string;
  loadWeightKg: number;
  positions: LeverChoice[];
}

export interface SeparationMethod {
  id: 'filtration' | 'evaporation' | 'magnet' | 'decantation';
  nameAr: string;
  nameFr: string;
  isCorrect: boolean;
  resultTitleAr: string;
  resultTitleFr: string;
  animationState: string;
  explanationAr: string;
  explanationFr: string;
}

export interface MixtureRecipe {
  id: string;
  ingredient1Ar: string;
  ingredient1Fr: string;
  ingredient2Ar: string;
  ingredient2Fr: string;
  mixtureTypeAr: string;
  mixtureTypeFr: string;
  availableMethods: SeparationMethod[];
}

export interface MixtureGameplay {
  type: 'mixtures_lab';
  titleAr: string;
  titleFr: string;
  instructionsAr: string;
  instructionsFr: string;
  mixtures: MixtureRecipe[];
}

export type GameplaySimulation =
  | CircuitGameplay
  | SafetyRoleplayGameplay
  | LeverGameplay
  | MixtureGameplay;

export type PedagogicalLevel = 1 | 2 | 3 | 4 | 5;

export interface ProgressiveExercise {
  id: string;
  level: PedagogicalLevel;
  levelLabelAr: string;
  problemAr: string;
  hintsAr: string[];
  solutionAr: string;
  detailedCorrectionAr: string;
  xpReward: number;
}

export interface EducationalGameItem {
  questionOrPromptAr: string;
  correctAnswerAr: string;
  optionsAr?: string[];
  explanationAr?: string;
}

export interface EducationalGame {
  id: string;
  type: 'quiz_flash' | 'memory' | 'association' | 'puzzle' | 'speed_calc' | 'word_scramble' | 'soroban_challenge';
  titleAr: string;
  instructionsAr: string;
  items: EducationalGameItem[];
  xpReward: number;
}

export interface TrimesterEvaluation {
  trimester: 1 | 2 | 3;
  titleAr: string;
  summaryAr: string;
  totalPoints: number;
  competenciesTestedAr: string[];
  exercises: {
    titleAr: string;
    points: number;
    questionAr: string;
    options?: string[];
    solutionAr: string;
    explanationAr: string;
  }[];
}

export interface CourseLesson {
  id: string;
  grade: PrimaryGrade;
  subject: SubjectId;
  categoryAr: string;
  titleAr: string;
  summaryAr: string;
  rulesAr: string[];
  keyFormulas?: KeyFormula[];
  examplesAr?: { problem: string; solution: string }[];
  interactiveTool?: 'soroban' | 'unit_converter' | 'geometry_visualizer' | 'multiplication_table' | 'arabic_conjugator' | 'science_lab' | 'french_lab' | 'english_lab' | 'history_geo_lab' | 'islamic_lab' | 'arabic_canvas';
  gameplay_simulation?: GameplaySimulation;
  quiz: QuizQuestion[];
  trimester?: 1 | 2 | 3;
  domainAr?: string;
  sequenceAr?: string;
  objectiveAr?: string;
  discoveryAr?: string;
  guidedExampleAr?: { problem: string; hint: string; solution: string };
  progressiveExercises?: ProgressiveExercise[];
  educationalGame?: EducationalGame;
  trimesterEvaluation?: TrimesterEvaluation;
}

export interface ExamExercise {
  titleAr: string;
  points: number;
  contentAr: string;
  solutionAr: string;
}

export interface OfficialExam {
  id: string;
  year: number;
  titleAr: string;
  sessionAr: string;
  subject: SubjectId;
  grade: PrimaryGrade;
  durationMinutes: number;
  totalPoints: number;
  exercises: ExamExercise[];
  problemExercise: ExamExercise;
}

export interface Badge {
  id: string;
  titleAr: string;
  descriptionAr: string;
  icon: string;
  category: 'math' | 'soroban' | 'arabic' | 'exams' | 'streak' | 'french' | 'english' | 'history_geo' | 'science' | 'islamic';
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  grade: PrimaryGrade;
  avatar: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  badges: string[];
  quizScores: Record<string, number>;
  tashkeelEnabled?: boolean;
}

export interface SorobanExercise {
  id: string;
  numbers: number[];
  operation: '+' | '-' | 'mixed';
  speedMs: number;
  expectedSum: number;
}

import { DidouAvatarConfig } from './ecosystem';
import { FeatureFlagName } from '../featureFlags';

export type Language = 'ar' | 'fr' | 'en' | 'ber';

export type PrimaryGrade = '1AP' | '2AP' | '3AP' | '4AP' | '5AP';

export type SubjectId =
  | 'math'
  | 'arabic'
  | 'tamazight'
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
  | 'tamazight_lab'
  | 'tamazight_curriculum'
  | 'educational_calculator'
  | 'geometry'
  | 'converter'
  | 'multiplication'
  | 'challenges'
  | 'algerian_market'
  | 'wilayas_map'
  | 'history_museum'
  | 'touch_writing'
  | 'science_lab'
  | 'primary_math_ops'
  | 'primary_discovery'
  | 'french_projects'
  | 'english_audio_dialogues'
  | 'human_anatomy'
  | 'earth_cycles'
  | 'fractions_lab'
  | 'area_grid'
  | 'clock_trainer'
  | 'syllable_studio'
  | 'speed_reading'
  | 'topography_map';

export interface SubjectInfo {
  id: SubjectId;
  nameAr: string;
  nameFr: string;
  icon: string;
  color: string;
  bgLight: string;
  description: string;
  category?: 'course' | 'tool' | 'exam' | 'challenge';
  /** Earliest grade this makes sense for (tools only) — hides it while browsing an earlier grade. Omit for grade-agnostic tools. */
  minGrade?: PrimaryGrade;
  /** Gates this entry's visibility on a feature flag (see App.tsx's isSubjectVisible). Omit if always visible. */
  featureFlag?: FeatureFlagName;
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

export type GameplayModuleType = 'circuit_builder' | 'safety_roleplay' | 'mixtures_lab' | 'process_stages' | 'matching_lab';

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

// Extra science gameplay module types (consolidation round 3) — covers biology/earth-science lessons
// that don't fit circuit/safety/mixture shapes. `Fr` fields are optional here (unlike the 3 types
// above, where they're required) to avoid doubling authoring effort across 9 lessons.
export interface ProcessStageItem {
  step: number;
  titleAr: string;
  descAr: string;
  icon: string; // single emoji
}
export interface ProcessStagesGameplay {
  type: 'process_stages';
  titleAr: string;
  titleFr?: string;
  instructionsAr: string;
  instructionsFr?: string;
  stages: ProcessStageItem[];
}

export interface ScienceMatchPair {
  leftAr: string;
  rightAr: string;
  explanationAr: string;
}
export interface MatchingLabGameplay {
  type: 'matching_lab';
  titleAr: string;
  titleFr?: string;
  instructionsAr: string;
  instructionsFr?: string;
  pairs: ScienceMatchPair[];
}

export type GameplaySimulation =
  | CircuitGameplay
  | SafetyRoleplayGameplay
  | MixtureGameplay
  | ProcessStagesGameplay
  | MatchingLabGameplay;

export type PedagogicalLevel = 1 | 2 | 3 | 4 | 5;

// Exercise type variety (Phase 7) — 'type' is optional so existing authored exercises
// (which predate this field) keep working, rendered as a free-text reveal-answer exercise by default.
export type ExerciseType = 'qcm' | 'true_false' | 'fill_blank' | 'matching' | 'ordering' | 'calculation' | 'short_answer';

// One step of scaffolded help, revealed one at a time (not dumped all at once) when a child
// struggles: petit indice → rappel de la règle → exemple similaire → explication → réponse détaillée.
export interface ProgressiveHint {
  labelAr: string; // e.g. "تلميح صغير", "تذكير بالقاعدة", "مثال مشابه", "شرح", "الحل التفصيلي"
  contentAr: string;
}

export interface ProgressiveExercise {
  id: string;
  level: PedagogicalLevel; // reused as the 4-tier grouping: 1=أكتشف 2=أتدرب 3=أتقن 4=أتحدى (5 reserved for optional extra challenge)
  levelLabelAr: string;
  type?: ExerciseType;
  problemAr: string;
  hintsAr: string[]; // legacy single-shot hint list — kept for backward compatibility with existing lessons
  progressiveHints?: ProgressiveHint[]; // richer sequential scaffolding; used instead of hintsAr when present
  // Type-specific answer data — only the field matching `type` is used; all optional for backward compatibility.
  options?: { id: string; textAr: string; isCorrect: boolean }[]; // qcm / true_false
  matchingPairsAr?: { leftAr: string; rightAr: string }[]; // matching
  orderedItemsAr?: string[]; // ordering — correct order, top to bottom
  fillBlankAnswerAr?: string; // fill_blank — expected text answer (compared loosely, trimmed)
  calculationAnswer?: number; // calculation — exact numeric expected answer
  solutionAr: string;
  detailedCorrectionAr: string;
  /** Math only: posed operations for the official two-column correction (العمليات | الحل). */
  operationsAr?: string;
  /** Arabic grammar only: official الكلمة / إعرابها table shown after check. */
  irabTableAr?: { wordAr: string; analysisAr: string }[];
  xpReward: number;
}

// --- "Cours détaillé" depth expansion (consolidation round 2) ---
export interface VocabularyTerm {
  termAr: string;
  definitionAr: string;
}

export interface CommonMistake {
  mistakeAr: string;
  correctionAr: string;
}

export interface DetailedCourse {
  introAr: string; // très courte intro, langage simple
  vocabulary?: VocabularyTerm[]; // mots importants à retenir
  visualizationHintAr?: string; // idée d'illustration/visualisation pour l'enfant
  commonMistakes?: CommonMistake[];
  takeawayAr: string; // synthèse "À retenir"
}

// 5-tier worked example progression: découverte → application → réflexion → situation concrète → défi.
// Distinct from the simpler pre-existing `examplesAr` (kept for backward compatibility).
export interface ProgressiveWorkedExample {
  tier: 1 | 2 | 3 | 4 | 5;
  labelAr: string; // e.g. "مثال 1 — اكتشف"
  problem: string;
  stepsAr?: string[]; // optional step-by-step breakdown
  solution: string;
  /** Math only: posed operations for the official two-column layout. */
  operationsAr?: string;
  isRealLife?: boolean; // marks the "situation concrète du quotidien" example (tier 4 by convention)
}

// Démarche scientifique expérimentale (sciences 5AP+): question → observation → hypothèse →
// expérience → résultat → explication. Distinct from `detailedCourse` (which still carries the
// vocabulary/"à retenir" synthesis) and from `gameplay_simulation` (which the `experimentAr` step
// points to/reuses when a lesson already has one, instead of duplicating it).
export interface ScientificHypothesisOption {
  id: string;
  textAr: string; // a plausible-sounding prediction — never graded right/wrong, just compared to the real result
}

export interface ScientificInquiry {
  questionAr: string; // ❓ Je me pose une question
  observationAr: string; // 👀 J'observe — ce qu'on te donne à voir avant d'émettre une hypothèse
  hypothesisPromptAr: string; // 💭 consigne invitant à prédire (jamais la réponse elle-même)
  hypothesisOptions: ScientificHypothesisOption[]; // 2-3 prédictions possibles, non notées
  experimentAr: string; // 🧪 ce qu'on manipule/observe réellement (peut renvoyer vers le labo existant)
  resultAr: string; // 🔬 le résultat réel observé
  explanationAr: string; // 🧠 pourquoi ce résultat, en langage simple
}

// Islamic Education interactive tool (islamic_lab) — per-lesson configuration so the shared
// component renders content specific to THAT lesson instead of a fixed grade-wide hardcoded set.
// Lessons without this field fall back to the component's legacy grade-based rendering.
export interface IslamicQuranVerseItem {
  surahAr: string;
  verseAr: string;
  meaningAr: string;
}
export interface IslamicQuranExplorer {
  type: 'quran_explorer';
  titleAr: string;
  introAr: string;
  verses: IslamicQuranVerseItem[];
}

export interface IslamicRitualStep {
  step: number;
  titleAr: string;
  descAr: string;
  tagAr: string;
  icon: string; // single emoji
}
export interface IslamicRitualSteps {
  type: 'ritual_steps';
  titleAr: string;
  introAr: string;
  steps: IslamicRitualStep[];
}

export interface IslamicConceptCard {
  nameAr: string;
  descAr: string;
}
export interface IslamicConceptCards {
  type: 'concept_cards';
  titleAr: string;
  introAr: string;
  concepts: IslamicConceptCard[];
}

export interface IslamicEthicsOption {
  textAr: string;
  isCorrect: boolean;
  feedbackAr: string;
}
export interface IslamicEthicsScenarioItem {
  id: string;
  titleAr: string;
  situationAr: string;
  options: IslamicEthicsOption[];
}
export interface IslamicEthicsScenario {
  type: 'ethics_scenario';
  titleAr: string;
  introAr: string;
  scenarios: IslamicEthicsScenarioItem[];
}

export interface IslamicTimelineEvent {
  dateAr: string;
  titleAr: string;
  descAr: string;
  icon: string; // single emoji
}
export interface IslamicTimeline {
  type: 'timeline';
  titleAr: string;
  introAr: string;
  events: IslamicTimelineEvent[];
}

export type IslamicInteractiveConfig =
  | IslamicQuranExplorer
  | IslamicRitualSteps
  | IslamicConceptCards
  | IslamicEthicsScenario
  | IslamicTimeline;

// History-Geography interactive tool (history_geo_lab) — per-lesson configuration, mirroring the
// Islamic Education pattern: the shared component renders exactly one typed module per lesson
// instead of a fixed grade-wide hardcoded set.
export interface HistoryGeoTimelineEvent {
  year: string; // kept as a string to allow suffixes/ranges, e.g. "1954 م" or "1830 - 1847 م"
  labelAr: string;
  detailsAr: string;
  region?: string; // optional geographic anchor, e.g. "الأوراس", "منطقة القبائل"
}
export interface HistoryGeoTimelineMap {
  type: 'timeline_map';
  titleAr: string;
  introAr: string;
  events: HistoryGeoTimelineEvent[];
  mapOverlay?: string; // short Arabic caption describing what the accompanying map highlights
}

export interface HistoryGeoRegion {
  id: string;
  nameAr: string;
  areaRange: string; // e.g. "~4 إلى 5% من المساحة الإجمالية"
  characteristics: string;
  climate: string;
}
export interface HistoryGeoRegionExplorer {
  type: 'region_explorer';
  titleAr: string;
  introAr: string;
  regions: HistoryGeoRegion[];
}

export interface HistoryGeoSource {
  id: string;
  type: 'document' | 'monument' | 'testimony' | 'artifact' | 'map';
  titleAr: string;
  descriptionAr: string;
  period: string;
}
export interface HistoryGeoArchaeologySources {
  type: 'archaeology_sources';
  titleAr: string;
  introAr: string;
  sources: HistoryGeoSource[];
}

export interface HistoryGeoClimateZone {
  zoneAr: string;
  rainfall: string;
  floraAr: string;
  faunaAr: string;
}
export interface HistoryGeoClimateVegetationMatching {
  type: 'climate_vegetation_matching';
  titleAr: string;
  introAr: string;
  zones: HistoryGeoClimateZone[];
}

export interface HistoryGeoHazardChoice {
  textAr: string;
  isCorrect: boolean;
  feedbackAr: string;
}
export interface HistoryGeoHazardScenario {
  hazardAr: string;
  choices: HistoryGeoHazardChoice[];
}
export interface HistoryGeoEcoCitizenScenario {
  type: 'eco_citizen_scenario';
  titleAr: string;
  introAr: string;
  hazardScenarios: HistoryGeoHazardScenario[];
}

export type HistoryGeoInteractiveConfig =
  | HistoryGeoTimelineMap
  | HistoryGeoRegionExplorer
  | HistoryGeoArchaeologySources
  | HistoryGeoClimateVegetationMatching
  | HistoryGeoEcoCitizenScenario;

// Civics interactive tool (civics_lab) — per-lesson configuration, same pattern as History-Geo/Islamic:
// the shared component renders exactly one typed module per lesson.
export interface CivicsInstitutionCard {
  nameAr: string;
  iconEmoji: string;
  roleAr: string;
  detailsAr: string;
}
export interface CivicsInstitutionCards {
  type: 'institution_cards';
  titleAr: string;
  introAr: string;
  cards: CivicsInstitutionCard[];
}

export interface CivicsScenarioChoice {
  textAr: string;
  isCorrect: boolean;
  feedbackAr: string;
}
export interface CivicsScenarioItem {
  id: string;
  titleAr: string;
  situationAr: string;
  choices: CivicsScenarioChoice[];
}
export interface CivicsScenario {
  type: 'civic_scenario';
  titleAr: string;
  introAr: string;
  scenarios: CivicsScenarioItem[];
}

export type CivicsInteractiveConfig = CivicsInstitutionCards | CivicsScenario;

// Math interactive tool (math_lab) — per-lesson configuration, same pattern.
export interface MathNumberCard {
  labelAr: string;
  valueDisplay: string;
  explanationAr: string;
}
export interface MathNumberCards {
  type: 'number_cards';
  titleAr: string;
  introAr: string;
  cards: MathNumberCard[];
}

export interface MathShapeItem {
  id: string;
  nameAr: string;
  propertiesAr: string[];
  visualHint: string; // short emoji/glyph cue standing in for a drawing
}
export interface MathShapeExplorer {
  type: 'shape_explorer';
  titleAr: string;
  introAr: string;
  shapes: MathShapeItem[];
}

export interface MathWordProblemChoice {
  textAr: string;
  isCorrect: boolean;
  feedbackAr: string;
}
export interface MathWordProblemItem {
  id: string;
  situationAr: string;
  choices: MathWordProblemChoice[];
}
export interface MathWordProblemScenario {
  type: 'word_problem_scenario';
  titleAr: string;
  introAr: string;
  problems: MathWordProblemItem[];
}

export interface MathDataRow {
  labelAr: string;
  valueAr: string;
}
export interface MathDataMatching {
  type: 'data_matching';
  titleAr: string;
  introAr: string;
  rows: MathDataRow[];
  insightAr: string;
}

export interface MathWrittenOpItem {
  id: string;
  labelAr: string;
  operationsAr: string;
  solutionAr: string;
}
export interface MathWrittenOperation {
  type: 'written_operation';
  titleAr: string;
  introAr: string;
  operations: MathWrittenOpItem[];
}

export type MathInteractiveConfig =
  | MathNumberCards
  | MathShapeExplorer
  | MathWordProblemScenario
  | MathDataMatching
  | MathWrittenOperation;

// Language interactive tool (french_dialogue_lab / english_dialogue_lab) — shared between French and
// English 5AP (small lesson counts, very similar nature). Content-language convention unchanged despite
// the `Ar` suffix: French-lesson fields are written in French, English-lesson fields in English with
// Arabic glosses — same convention already used for the rest of those lessons' fields.
export interface LanguageVocabTerm {
  termAr: string;
  meaningAr: string;
  exampleAr: string;
}
export interface LanguageVocabExplorer {
  type: 'vocabulary_explorer';
  titleAr: string;
  introAr: string;
  terms: LanguageVocabTerm[];
}

export interface LanguageDialogueChoice {
  textAr: string;
  isCorrect: boolean;
  feedbackAr: string;
}
export interface LanguageDialogueTurn {
  promptAr: string;
  lineAr: string;
  choices: LanguageDialogueChoice[];
}
export interface LanguageDialogueScenario {
  type: 'dialogue_scenario';
  titleAr: string;
  introAr: string;
  turns: LanguageDialogueTurn[];
}

export type LanguageInteractiveConfig = LanguageVocabExplorer | LanguageDialogueScenario;

// Content provenance (Phase 7 + consolidation) — every lesson should be explicit about how
// confident we are in its curricular placement (grade/subject/trimester/unit), NOT necessarily
// about whether its prose/exercises are copied verbatim from a ministry document (they never are —
// see sourceType). Four honest states, deliberately not collapsed into a binary official/complementary:
//   - 'official_verified': placement confirmed against an identifiable official MEN document.
//   - 'corroborated': cross-checked against an independent secondary source (e.g. DzExams) that is
//     NOT itself an official curriculum authority — never auto-promote this to 'official_verified'.
//   - 'complementary': original MSSID DZ pedagogical authoring/enrichment, not claiming curricular sourcing.
//   - 'needs_verification': no reliable signal exists yet (this is the honest default — do not guess).
// Absent on legacy lessons authored before this field existed — treat those as 'needs_verification'
// when rendering, not 'complementary' (we don't actually know their provenance either).
export type ContentSource = 'official_verified' | 'corroborated' | 'complementary' | 'needs_verification';

export type SourceType = 'ministry_official' | 'secondary_corroboration' | 'original_authoring';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

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
  // `operationsAr` is optional and math-specific: when present, LessonContentPanel/LessonExplanationView
  // render the official Algerian 2-column layout (العمليات right, الحل/الأجوبة left) instead of a
  // single flat solution paragraph — see CLAUDE.md's "Structure des Problèmes Mathématiques".
  examplesAr?: { problem: string; solution: string; operationsAr?: string }[];
  // Arabic grammar only: the official Algerian two-column إعراب table — الكلمة (word) on one side,
  // إعرابها (its grammatical analysis) on the other — see CLAUDE.md's "Module I'rab" layout rule.
  // Rendered by LessonContentPanel as a dedicated RTL table, distinct from the free-text rulesAr prose.
  irabTableAr?: { wordAr: string; analysisAr: string }[];
  interactiveTool?: 'soroban' | 'unit_converter' | 'geometry_visualizer' | 'multiplication_table' | 'arabic_conjugator' | 'science_lab' | 'touch_writing' | 'tamazight_lab' | 'french_lab' | 'english_lab' | 'history_geo_lab' | 'islamic_lab' | 'arabic_canvas' | 'civics_lab' | 'math_lab' | 'french_dialogue_lab' | 'english_dialogue_lab' | 'clock_trainer';
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
  unitAr?: string; // formal "unité" grouping (broader than domainAr's chapter-level grouping)
  difficultyTier?: 1 | 2 | 3; // overall lesson difficulty: ⭐ / ⭐⭐ / ⭐⭐⭐
  contentSource?: ContentSource;
  sourceNoteAr?: string; // human-readable Arabic note explaining how the content was verified/corroborated/authored (= "verificationNote")
  sourceType?: SourceType;
  sourceReference?: string; // e.g. a document name or the corroborating platform/URL — not a claim of official authority by itself
  confidenceLevel?: ConfidenceLevel;

  // --- Pedagogical depth expansion (consolidation round 2) ---
  objectivesAr?: string[]; // "À la fin de cette leçon, je sais : ..." — shown at the start AND revisited as a self-check after the evaluation
  missionTitleAr?: string; // creative narrative wrapper, e.g. "🏰 مهمة كنز الأعداد" — presentation only, never implies a new official notion
  missionIntroAr?: string; // short in-character framing text for the mission/scenario
  detailedCourse?: DetailedCourse;
  progressiveWorkedExamples?: ProgressiveWorkedExample[]; // the 5-tier example progression
  evaluationExercises?: ProgressiveExercise[]; // richer final "évaluation" (mixed types, reuses the exercise engine) — shown alongside/instead of the plain `quiz`
  scientificInquiry?: ScientificInquiry; // sciences only: the question→observation→hypothesis→experiment→result démarche
  islamicInteractive?: IslamicInteractiveConfig; // islamic education only: per-lesson content for the islamic_lab tool
  historyGeoInteractive?: HistoryGeoInteractiveConfig; // history/geography only: per-lesson content for the history_geo_lab tool
  civicsInteractive?: CivicsInteractiveConfig; // civics only: per-lesson content for the civics_lab tool
  mathInteractive?: MathInteractiveConfig; // math only: per-lesson content for the math_lab tool
  languageInteractive?: LanguageInteractiveConfig; // french/english only: per-lesson content for the french_dialogue_lab / english_dialogue_lab tool

  // T2/T3 server-side content gate. true means this object is a "shell": only catalog metadata is
  // bundled, and rulesAr/quiz are empty placeholders — LessonViewer fetches the real content from
  // GET /api/v1/courses/premium-lessons/{id}. While payment flags are off, that endpoint is open;
  // once both flags are on it is PREMIUM/ADMIN only. Absent/false = fully bundled. Currently unused
  // in the 5AP math catalog (math-5ap-division is inlined); kept for a later paid window.
  premiumContentPending?: boolean;
}

export interface ExamExercise {
  titleAr: string;
  points: number;
  contentAr: string;
  solutionAr: string;
  /** Math papers: posed operations for the official notebook columns (العمليات | الحل). */
  operationsAr?: string;
  /** Lesson to open after the corrigé — one notion, not the whole paper. */
  relatedLessonId?: string;
}

/** How the paper is used in class — mirrors DzExams folders, without copying their files. */
export type ExamKind = 'devoir' | 'composition' | 'bep' | 'acquis';

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
  trimester?: 1 | 2 | 3;
  /** Defaults via getExamKind() when omitted. */
  kind?: ExamKind;
  contentSource?: ContentSource;
  sourceNoteAr?: string;
  /** Lesson ids in our catalog to revise before this paper. */
  relatedLessonIds?: string[];
}

// Challenges Arena — standalone timed mini-games/challenges bank (browsable independently of
// lessons, mirroring the OFFICIAL_EXAMS_DATA pattern). Reuses the EducationalGameItem question shape.
export interface ChallengeItem {
  questionOrPromptAr: string;
  correctAnswerAr: string;
  optionsAr?: string[];
  explanationAr?: string;
}

export interface Challenge {
  id: string;
  subject: SubjectId;
  grade: PrimaryGrade;
  titleAr: string;
  descriptionAr: string;
  difficulty: 'easy' | 'medium' | 'hard';
  format: 'quiz_flash' | 'speed_calc' | 'memory' | 'word_scramble' | 'boss_mix';
  timeLimitSeconds?: number;
  xpReward: number;
  items: ChallengeItem[];
}

// Data-driven unlock condition for a Badge — evaluated by utils/badgeEngine.ts against
// the live UserProfile, so unlocking a badge never requires a hardcoded per-badge trigger.
export type BadgeCriteria =
  | { type: 'first_login' }
  | { type: 'lessons_completed_subject'; subject: SubjectId; count: number }
  | { type: 'lessons_completed_total'; count: number }
  | { type: 'streak_days'; days: number }
  | { type: 'xp_total'; xp: number }
  | { type: 'exam_completed_count'; count: number }
  | { type: 'challenge_completed_count'; count: number }
  | { type: 'game_completed_count'; count: number }
  | { type: 'lab_visited'; labId: SubjectId };

export interface Badge {
  id: string;
  titleAr: string;
  descriptionAr: string;
  icon: string;
  category: 'math' | 'soroban' | 'arabic' | 'tamazight' | 'exams' | 'streak' | 'french' | 'english' | 'history_geo' | 'science' | 'islamic' | 'civics' | 'challenges' | 'games' | 'general';
  criteria: BadgeCriteria;
}

export interface UserProfile {
  name: string;
  grade: PrimaryGrade;
  avatar: string;
  xp: number;
  goldCoins?: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  completedExamIds: string[];
  completedChallengeIds: string[];
  completedGameIds: string[];
  /** Labs the child has actually opened (e.g. Algerian currency market). */
  completedLabIds: string[];
  /** Lessons whose quiz has been fully answered correctly at least once — governs the reduced-XP-on-replay rule. */
  quizFullyValidatedLessonIds: string[];
  badges: string[];
  badgeUnlockedAt: Record<string, string>;
  quizScores: Record<string, number>;
  tashkeelEnabled?: boolean;
  dailyScreenTimeLimitMinutes?: number;
  avatarConfig?: DidouAvatarConfig;
}

export interface SorobanExercise {
  id: string;
  numbers: number[];
  operation: '+' | '-' | 'mixed';
  speedMs: number;
  expectedSum: number;
}

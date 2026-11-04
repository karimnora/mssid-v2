import type { PrimaryGrade, SubjectId } from '../../types';

/**
 * « مهمة ديدو » — hand-written immersive lessons (V2 Premium, first mission of each subject free).
 * A mission is a short story played scene by scene: Didou speaks every line aloud, the child
 * manipulates, and every wrong answer gets its own explanation (« whyAr »), never a bare « faux ».
 */

/** Didou opens the story: the problem of the day, in an Algerian setting. */
export interface StoryScene {
  kind: 'story';
  id: string;
  sayAr: string;
  /** Lesson id whose drawing (lessonViewer/illustrations) illustrates the scene, or a 3D icon. */
  artLessonId?: string;
  emoji?: string;
}

/** The rule, built one step at a time: the child taps « next » for each step. */
export interface ExplainScene {
  kind: 'explain';
  id: string;
  sayAr: string;
  steps: { sayAr: string; showAr: string; tone?: 'blue' | 'green' | 'orange' | 'violet' }[];
}

interface ItemBase {
  id: string;
  /** What Didou says to set the task. */
  sayAr: string;
  /** Short written task under Didou. */
  promptAr: string;
  /** Second wrong try: a nudge towards the method, not the answer. */
  hintAr: string;
  /** Said when it is right. */
  successAr: string;
  /** Counts towards the stars of the final challenge. */
  challenge?: boolean;
}

export interface ChooseItem extends ItemBase {
  kind: 'choose';
  options: { id: string; textAr: string; correct?: boolean; whyAr?: string }[];
}

export interface NumericItem extends ItemBase {
  kind: 'numeric';
  answer: number;
  unitAr?: string;
  /** Typical wrong answers and the explanation for each. */
  mistakes?: { value: number; whyAr: string }[];
  /** Said for any other wrong number. */
  wrongAr: string;
}

export interface SortItem extends ItemBase {
  kind: 'sort';
  bins: { id: string; labelAr: string }[];
  cards: { id: string; textAr: string; bin: string; whyAr: string }[];
}

/** Tap each word of a sentence and give its role (الإعراب): one chip per role. */
export interface TagItem extends ItemBase {
  kind: 'tag';
  roles: string[];
  words: { textAr: string; role: string; whyAr: string }[];
}

/** Make groups of `size` out of `total` objects by tapping « fill a box »: division made concrete. */
export interface GroupItem extends ItemBase {
  kind: 'group';
  total: number;
  size: number;
  unitEmoji: string;
  boxLabelAr: string;
  /** Then the child types how many boxes and how many left over. */
  boxesAnswer: number;
  restAnswer: number;
}

export type MissionItem = ChooseItem | NumericItem | SortItem | TagItem | GroupItem;

/** Memo card at the end, printed in the notebook too. */
export interface RecapScene {
  kind: 'recap';
  id: string;
  sayAr: string;
  pointsAr: string[];
}

export type MissionScene = StoryScene | ExplainScene | MissionItem | RecapScene;

export interface Mission {
  id: string;
  lessonId: string;
  grade: PrimaryGrade;
  subject: SubjectId;
  titleAr: string;
  /** One mission per subject is open to free accounts. */
  free?: boolean;
  /** XP given once at the end. */
  xp: number;
  scenes: MissionScene[];
}

export const isItem = (scene: MissionScene): scene is MissionItem =>
  scene.kind === 'choose' || scene.kind === 'numeric' || scene.kind === 'sort' || scene.kind === 'tag' || scene.kind === 'group';

import type { PrimaryGrade, SubjectId } from '../../types';

/**
 * « ألعاب ديدو التعليمية » — V2 learning games (docs/v2-jeux-catalogue.md).
 * A pack is a short adventure in an Algerian place: a story, five levels played with one engine
 * (easy → expert, every level open: the child may skip ahead), and a memo card. Didou speaks every
 * line and explains every wrong move (« whyAr »), never a bare « faux ». Each level (« round » in
 * the code) belongs to a real catalog lesson so results reach the parent notebook.
 */
export type GameEngine = 'memory' | 'sort' | 'order' | 'maze';

/** Primary grades, plus `PRE` for preschool (3-5 years, shown in the preschool games hub). */
export type GameGrade = PrimaryGrade | 'PRE';

interface RoundBase {
  id: string;
  /** Catalog lesson this round practises (parent notebook + competence stats). Preschool: a `PRESCHOOL_MODULES` id. */
  lessonId: string;
  titleAr: string;
  /** What Didou says when the round opens. */
  sayAr: string;
  /** Said with the explanation from the second miss of the round on. */
  hintAr: string;
  /** Said when the round is solved. */
  successAr: string;
  /**
   * Warm-up level: the help is there from the start (a short peek at the memory cards, the dates on
   * the timeline). Only the first level of a pack uses it.
   */
  easy?: boolean;
}

/** Flip two cards, find the twins: two ways of writing the same value. */
export interface MemoryRound extends RoundBase {
  kind: 'memory';
  pairs: {
    id: string;
    a: string;
    b: string;
    /** The common value, said when two different cards are flipped (« ½ = 0,5 and … »). */
    valueAr: string;
    /** Said when the twins are found: why they are equal. */
    linkAr: string;
  }[];
  /**
   * Said when two different cards are flipped. `{a}`/`{b}` are the cards, `{va}`/`{vb}` their
   * `valueAr`. Default: « «a» تساوي va، و«b» تساوي vb » (numbers).
   */
  mismatchAr?: string;
}

/** Tap a card, then the right basket. */
export interface SortRound extends RoundBase {
  kind: 'sort';
  bins: { id: string; labelAr: string }[];
  cards: { id: string; textAr: string; bin: string; whyAr: string }[];
}

/** Tap the cards in order to fill the line (timeline, smallest → largest…). */
export interface OrderRound extends RoundBase {
  kind: 'order';
  /** Shown above the line, e.g. « من الأقدم إلى الأحدث ». */
  directionAr: string;
  /** Said for a card tapped too early. `{card}` and `{key}` are replaced. */
  wrongAr: string;
  cards: { id: string; textAr: string; emoji: string; keyAr: string; rank: number }[];
}

/** A stone of the maze. Wrong stones (`ok: false`) always carry their explanation (checked by a test). */
export interface MazeCell {
  t: string;
  ok: boolean;
  whyAr?: string;
}

/** Walk Didou from the first stone to the treasure, only on the stones that follow the rule. */
export interface MazeRound extends RoundBase {
  kind: 'maze';
  ruleAr: string;
  /** Rows in reading order (RTL: the first cell is on the right). Start = [0][0], treasure = last cell. */
  grid: MazeCell[][];
  /** Expert level: stones stay hidden in fog until Didou stands next to them. */
  fog?: boolean;
}

export type GameRound = MemoryRound | SortRound | OrderRound | MazeRound;

export interface GamePack {
  /** Exact id, e.g. `game-5ap-memory-fractions`. */
  id: string;
  grade: GameGrade;
  subject: SubjectId;
  engine: GameEngine;
  titleAr: string;
  /** One line on the card. */
  taglineAr: string;
  /** The first pack of each grade is open to free accounts (checked by a test). */
  free?: boolean;
  /**
   * Young readers (preschool, 1AP): bigger targets, and every card or stone is read aloud when
   * tapped. Cards written « emoji word » are drawn as a picture above its word.
   */
  young?: boolean;
  /**
   * Foreign-language packs (3AP → 5AP English and French): the cards are read aloud in this
   * language when tapped and drawn left-to-right; Didou keeps explaining in Arabic.
   */
  cardLang?: 'fr' | 'en';
  /** XP given once, the first time every level of the pack has been solved. */
  xp: number;
  theme: {
    /** Background of the full-screen game. */
    sky: string;
    /** Decorative skyline (emoji), drawn at the bottom of the scene. */
    scenery: string[];
    emoji: string;
  };
  /** Didou opens the adventure. */
  storyAr: string;
  /** The levels, from the easiest to the hardest (checked by a test: boards only grow). */
  rounds: GameRound[];
  /** Memo card at the end. */
  recapAr: string[];
}

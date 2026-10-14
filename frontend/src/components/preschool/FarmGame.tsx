import { useActivityExitGuard } from '../../context/ActivityExitContext';
/**
 * FarmGame.tsx — « À la Ferme » : même moteur qu’En Ville (Phaser, chemins 2.5D).
 * Chemins fermés (clôture : on reste dessus) et ouverts (fourches, impasses à éviter).
 * Voies larges, vitesse lente, D-pad mobile — pour 3-5 ans.
 */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { motion } from 'motion/react';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';
import {
  playFarmStart,
  playFenceBump,
  playPondSplash,
  playSheepBaa,
  playSuccessChime,
  resumeTownAudio,
  setFarmMoving,
  stopMotionAudio,
  usePreschoolSpeech,
  type FarmWalker,
} from './usePreschoolAudio';

export interface FarmGameProps {
  onExit?: () => void;
  language?: 'ar' | 'fr' | 'en';
}

type Dir = 'up' | 'down' | 'left' | 'right';
type PathMode = 'closed' | 'open';

interface PathSeg { x: number; y: number; w: number; h: number }
interface Patrol { y: number; minX: number; maxX: number; speed: number; emoji?: string }
interface DeadEnd {
  x: number; y: number;
  emoji: string;
  hintAr: string; hintFr: string; hintEn: string;
}

interface FarmMap {
  segs: PathSeg[];
  start: { x: number; y: number };
  goal: { x: number; y: number };
  trees: { x: number; y: number }[];
  hay: { x: number; y: number }[];
  deadEnds: DeadEnd[];
  patrols: Patrol[];
  friends: { x: number; y: number; emoji: string }[];
  goalEmoji: string;
  showBarn: boolean;
}

interface FarmLevelCfg {
  walker: FarmWalker;
  walkerEmoji: string;
  mode: PathMode;
  speed: number;
  timerSecs: number | null;
  map: FarmMap;
  finishAr: string;
  finishFr: string;
  finishEn: string;
  missionAr: string;
  missionFr: string;
  missionEn: string;
}

const W = 800, H = 500;

// 1. Lapin — L fermé, un seul virage
const MAP_RABBIT: FarmMap = {
  segs: [
    { x: 40,  y: 70,  w: 710, h: 110 },
    { x: 640, y: 70,  w: 110, h: 370 },
  ],
  start: { x: 95, y: 125 },
  goal: { x: 695, y: 400 },
  trees: [{ x: 220, y: 260 }, { x: 380, y: 280 }, { x: 200, y: 430 }],
  hay: [{ x: 500, y: 250 }],
  deadEnds: [],
  patrols: [],
  friends: [{ x: 300, y: 250, emoji: '🐥' }, { x: 520, y: 400, emoji: '🐔' }],
  goalEmoji: '🥕',
  showBarn: false,
};

// 2. Poussin — C fermé jusqu’à maman
const MAP_CHICK: FarmMap = {
  segs: [
    { x: 40,  y: 40,  w: 720, h: 110 },
    { x: 40,  y: 40,  w: 110, h: 380 },
    { x: 40,  y: 330, w: 440, h: 110 },
  ],
  start: { x: 700, y: 95 },
  goal: { x: 400, y: 385 },
  trees: [{ x: 250, y: 200 }, { x: 420, y: 190 }, { x: 580, y: 220 }, { x: 700, y: 280 }],
  hay: [{ x: 560, y: 400 }],
  deadEnds: [],
  patrols: [],
  friends: [],
  goalEmoji: '🐓',
  showBarn: false,
};

// 3. Mouton — U ouvert (on peut aller dans l’herbe, plus lent)
const MAP_SHEEP: FarmMap = {
  segs: [
    { x: 50,  y: 40,  w: 700, h: 110 },
    { x: 640, y: 40,  w: 110, h: 400 },
    { x: 50,  y: 330, w: 700, h: 110 },
  ],
  start: { x: 110, y: 95 },
  goal: { x: 110, y: 385 },
  trees: [{ x: 280, y: 220 }, { x: 430, y: 230 }, { x: 340, y: 250 }],
  hay: [{ x: 520, y: 230 }],
  deadEnds: [],
  patrols: [],
  friends: [{ x: 200, y: 430, emoji: '🐑' }, { x: 500, y: 230, emoji: '🐄' }],
  goalEmoji: '🏠',
  showBarn: true,
};

// 4. Tracteur — fourche ouverte : bassin à gauche, foin à droite
const MAP_TRACTOR: FarmMap = {
  segs: [
    { x: 40,  y: 40,  w: 720, h: 120 },
    { x: 70,  y: 40,  w: 120, h: 420 },
    { x: 610, y: 40,  w: 120, h: 420 },
  ],
  start: { x: 400, y: 100 },
  goal: { x: 670, y: 400 },
  trees: [{ x: 300, y: 260 }, { x: 480, y: 280 }],
  hay: [{ x: 400, y: 400 }],
  deadEnds: [{
    x: 130, y: 400, emoji: '💧',
    hintAr: 'البركة! ليس من هنا', hintFr: 'Le bassin ! Pas par là', hintEn: 'The pond! Not this way',
  }],
  patrols: [],
  friends: [],
  goalEmoji: '🌾',
  showBarn: false,
};

// 5. Chèvre — S ouvert + impasse épouvantail
const MAP_GOAT: FarmMap = {
  segs: [
    { x: 40,  y: 36,  w: 720, h: 110 },
    { x: 650, y: 36,  w: 110, h: 230 },
    { x: 40,  y: 160, w: 720, h: 110 },
    { x: 40,  y: 160, w: 110, h: 230 },
    { x: 40,  y: 350, w: 720, h: 110 },
    { x: 345, y: 160, w: 110, h: 145 },
  ],
  start: { x: 95, y: 90 },
  goal: { x: 700, y: 405 },
  trees: [{ x: 220, y: 300 }, { x: 520, y: 90 }],
  hay: [{ x: 240, y: 90 }],
  deadEnds: [{
    x: 400, y: 280, emoji: '🎃',
    hintAr: 'الفزاعة! ارجع', hintFr: 'L’épouvantail ! Reviens', hintEn: 'Scarecrow! Go back',
  }],
  patrols: [],
  friends: [],
  goalEmoji: '🫒',
  showBarn: false,
};

// 6. Cheval — labyrinthe fermé, une impasse
const MAP_HORSE: FarmMap = {
  segs: [
    { x: 40,  y: 36,  w: 530, h: 110 },
    { x: 180, y: 36,  w: 110, h: 250 },
    { x: 460, y: 36,  w: 110, h: 430 },
    { x: 40,  y: 356, w: 720, h: 110 },
  ],
  start: { x: 95, y: 90 },
  goal: { x: 700, y: 410 },
  trees: [{ x: 140, y: 230 }, { x: 340, y: 230 }, { x: 620, y: 180 }],
  hay: [{ x: 680, y: 90 }],
  deadEnds: [{
    x: 235, y: 250, emoji: '🚧',
    hintAr: 'مسدود! يميناً', hintFr: 'Cul-de-sac ! Va à droite', hintEn: 'Dead end! Go right',
  }],
  patrols: [],
  friends: [],
  goalEmoji: '🪣',
  showBarn: false,
};

// 7. Poule — labyrinthe : trois sorties, le nid au milieu
const MAP_HEN: FarmMap = {
  segs: [
    { x: 40,  y: 360, w: 720, h: 110 },
    { x: 40,  y: 180, w: 110, h: 290 },
    { x: 340, y: 40,  w: 110, h: 430 },
    { x: 640, y: 40,  w: 110, h: 430 },
  ],
  start: { x: 95, y: 415 },
  goal: { x: 395, y: 95 },
  trees: [{ x: 250, y: 240 }, { x: 520, y: 240 }],
  hay: [],
  deadEnds: [
    {
      x: 95, y: 200, emoji: '🥬',
      hintAr: 'الخضار! ليس العش', hintFr: 'Le potager ! Pas le nid', hintEn: 'The garden! Not the nest',
    },
    {
      x: 695, y: 95, emoji: '🪹',
      hintAr: 'عش فارغ! في الوسط', hintFr: 'Nid vide ! Au milieu', hintEn: 'Empty nest! Go middle',
    },
  ],
  patrols: [],
  friends: [],
  goalEmoji: '🪺',
  showBarn: false,
};

// 8. Vache — serpent ouvert + moutons qui traversent
const MAP_COW: FarmMap = {
  segs: [
    { x: 40,  y: 36,  w: 500, h: 110 },
    { x: 430, y: 36,  w: 110, h: 250 },
    { x: 40,  y: 176, w: 500, h: 110 },
    { x: 40,  y: 176, w: 110, h: 290 },
    { x: 40,  y: 356, w: 720, h: 110 },
    { x: 430, y: 176, w: 330, h: 110 },
  ],
  start: { x: 95, y: 90 },
  goal: { x: 95, y: 410 },
  trees: [{ x: 250, y: 300 }, { x: 620, y: 90 }],
  hay: [{ x: 720, y: 250 }],
  deadEnds: [{
    x: 700, y: 230, emoji: '🌾',
    hintAr: 'التبن! الحليب يساراً', hintFr: 'Le foin ! Le lait est à gauche', hintEn: 'Hay! Milk is to the left',
  }],
  patrols: [{ y: 410, minX: 260, maxX: 520, speed: 28 }],
  friends: [{ x: 300, y: 90, emoji: '🐔' }, { x: 560, y: 300, emoji: '🐑' }],
  goalEmoji: '🥛',
  showBarn: true,
};

// 9. Canard — C fermé jusqu’à la mare
const MAP_DUCK: FarmMap = {
  segs: [
    { x: 40,  y: 40,  w: 720, h: 110 },
    { x: 40,  y: 40,  w: 110, h: 400 },
    { x: 40,  y: 330, w: 400, h: 110 },
  ],
  start: { x: 700, y: 95 },
  goal: { x: 360, y: 385 },
  trees: [{ x: 280, y: 200 }, { x: 500, y: 220 }, { x: 650, y: 280 }],
  hay: [{ x: 560, y: 400 }],
  deadEnds: [],
  patrols: [],
  friends: [{ x: 250, y: 250, emoji: '🐸' }, { x: 620, y: 180, emoji: '🐥' }],
  goalEmoji: '💧',
  showBarn: false,
};

// 10. Chat — fourche : poisson à gauche, pelote à droite
const MAP_CAT: FarmMap = {
  segs: [
    { x: 40,  y: 40,  w: 720, h: 120 },
    { x: 70,  y: 40,  w: 120, h: 420 },
    { x: 600, y: 40,  w: 120, h: 420 },
  ],
  start: { x: 400, y: 100 },
  goal: { x: 130, y: 400 },
  trees: [{ x: 300, y: 260 }, { x: 480, y: 280 }],
  hay: [{ x: 400, y: 400 }],
  deadEnds: [{
    x: 660, y: 400, emoji: '🧶',
    hintAr: 'الكُرَة! السَّمَكَة يَسَاراً', hintFr: 'La pelote ! Le poisson est à gauche', hintEn: 'Yarn! The fish is to the left',
  }],
  patrols: [{ y: 100, minX: 180, maxX: 520, speed: 32, emoji: '🐭' }],
  friends: [{ x: 400, y: 250, emoji: '🐄' }, { x: 250, y: 420, emoji: '🐔' }],
  goalEmoji: '🐟',
  showBarn: false,
};

// 11. Chien — labyrinthe fermé jusqu’à l’os
const MAP_DOG: FarmMap = {
  segs: [
    { x: 40,  y: 36,  w: 720, h: 110 },
    { x: 40,  y: 36,  w: 110, h: 250 },
    { x: 40,  y: 176, w: 500, h: 110 },
    { x: 430, y: 176, w: 110, h: 280 },
    { x: 430, y: 356, w: 330, h: 110 },
  ],
  start: { x: 700, y: 90 },
  goal: { x: 700, y: 410 },
  trees: [{ x: 250, y: 320 }, { x: 620, y: 230 }],
  hay: [{ x: 280, y: 90 }],
  deadEnds: [{
    x: 95, y: 230, emoji: '🐱',
    hintAr: 'القِطَّة نَائِمَة! يَمِيناً', hintFr: 'Le chat dort ! Va à droite', hintEn: 'The cat is sleeping! Go right',
  }],
  patrols: [{ y: 90, minX: 200, maxX: 520, speed: 30, emoji: '🐔' }],
  friends: [{ x: 180, y: 400, emoji: '🐑' }, { x: 680, y: 250, emoji: '🐄' }],
  goalEmoji: '🦴',
  showBarn: false,
};

// 12. Âne — S ouvert vers le foin (ferme algérienne)
const MAP_DONKEY: FarmMap = {
  segs: [
    { x: 40,  y: 36,  w: 720, h: 110 },
    { x: 650, y: 36,  w: 110, h: 230 },
    { x: 40,  y: 160, w: 720, h: 110 },
    { x: 40,  y: 160, w: 110, h: 290 },
    { x: 40,  y: 350, w: 720, h: 110 },
  ],
  start: { x: 95, y: 90 },
  goal: { x: 700, y: 405 },
  trees: [{ x: 240, y: 300 }, { x: 500, y: 90 }],
  hay: [{ x: 240, y: 90 }],
  deadEnds: [{
    x: 400, y: 215, emoji: '🌵',
    hintAr: 'الصَّبَّار! اِتْبَعِ الدَّرْب', hintFr: 'Le cactus ! Reste sur le sentier', hintEn: 'Cactus! Stay on the path',
  }],
  patrols: [{ y: 405, minX: 200, maxX: 500, speed: 26, emoji: '🐐' }],
  friends: [{ x: 300, y: 90, emoji: '🐑' }, { x: 520, y: 300, emoji: '🐔' }, { x: 180, y: 280, emoji: '🐄' }],
  goalEmoji: '🌾',
  showBarn: true,
};

// 13. Coq — trois chemins, le poulailler au milieu
const MAP_ROOSTER: FarmMap = {
  segs: [
    { x: 40,  y: 360, w: 720, h: 110 },
    { x: 40,  y: 40,  w: 110, h: 430 },
    { x: 340, y: 40,  w: 110, h: 430 },
    { x: 640, y: 40,  w: 110, h: 430 },
  ],
  start: { x: 400, y: 415 },
  goal: { x: 395, y: 95 },
  trees: [{ x: 250, y: 240 }, { x: 520, y: 240 }],
  hay: [],
  deadEnds: [
    {
      x: 95, y: 95, emoji: '🌙',
      hintAr: 'اللَّيْل! الحَظِيرَة فِي الوَسَط', hintFr: 'La nuit ! Le poulailler est au milieu', hintEn: 'Night! The coop is in the middle',
    },
    {
      x: 695, y: 95, emoji: '🥚',
      hintAr: 'بَيْضَة! الحَظِيرَة فِي الوَسَط', hintFr: 'Un œuf ! Le poulailler est au milieu', hintEn: 'An egg! The coop is in the middle',
    },
  ],
  patrols: [{ y: 415, minX: 180, maxX: 620, speed: 34, emoji: '🐥' }],
  friends: [{ x: 250, y: 400, emoji: '🐔' }, { x: 550, y: 400, emoji: '🐔' }],
  goalEmoji: '🏠',
  showBarn: true,
};

// 14. Abeille — labyrinthe ouvert vers le tournesol
const MAP_BEE: FarmMap = {
  segs: [
    { x: 40,  y: 36,  w: 500, h: 110 },
    { x: 430, y: 36,  w: 110, h: 250 },
    { x: 40,  y: 176, w: 500, h: 110 },
    { x: 40,  y: 176, w: 110, h: 290 },
    { x: 40,  y: 356, w: 720, h: 110 },
    { x: 640, y: 176, w: 110, h: 290 },
  ],
  start: { x: 95, y: 90 },
  goal: { x: 695, y: 230 },
  trees: [{ x: 250, y: 300 }, { x: 500, y: 300 }],
  hay: [{ x: 280, y: 90 }],
  deadEnds: [{
    x: 95, y: 410, emoji: '🕸️',
    hintAr: 'العَنْكَبُوت! اِصْعَدْ يَمِيناً', hintFr: 'L’araignée ! Monte à droite', hintEn: 'Spider! Go up, then right',
  }],
  patrols: [{ y: 90, minX: 200, maxX: 400, speed: 36, emoji: '🦋' }],
  friends: [{ x: 180, y: 250, emoji: '🌸' }, { x: 560, y: 90, emoji: '🌼' }, { x: 400, y: 420, emoji: '🐄' }],
  goalEmoji: '🌻',
  showBarn: false,
};

const LEVELS: FarmLevelCfg[] = [
  { walker: 'rabbit',  walkerEmoji: '🐰', mode: 'closed', speed: 115, timerSecs: null, map: MAP_RABBIT,
    finishAr: '🥕 الجزرة', finishFr: '🥕 Carotte', finishEn: '🥕 Carrot',
    missionAr: 'أَوْصِلِ الأَرْنَبَ إِلَى الجَزَرَة!', missionFr: 'Amène le lapin jusqu’à la carotte !', missionEn: 'Take the rabbit to the carrot!' },
  { walker: 'chick',   walkerEmoji: '🐥', mode: 'closed', speed: 120, timerSecs: null, map: MAP_CHICK,
    finishAr: '🐓 أمي', finishFr: '🐓 Maman', finishEn: '🐓 Mum',
    missionAr: 'أَعِدِ الكَتْكُوتَ إِلَى أُمِّهِ!', missionFr: 'Ramène le poussin à sa maman !', missionEn: 'Take the chick back to mum!' },
  { walker: 'sheep',   walkerEmoji: '🐑', mode: 'open', speed: 125, timerSecs: null, map: MAP_SHEEP,
    finishAr: '🏠 الحظيرة', finishFr: '🏠 Bergerie', finishEn: '🏠 Barn',
    missionAr: 'أَعِدِ الخَرُوفَ إِلَى الحَظِيرَة!', missionFr: 'Ramène le mouton à la bergerie !', missionEn: 'Take the sheep to the barn!' },
  { walker: 'tractor', walkerEmoji: '🚜', mode: 'open', speed: 130, timerSecs: null, map: MAP_TRACTOR,
    finishAr: '🌾 التبن', finishFr: '🌾 Foin', finishEn: '🌾 Hay',
    missionAr: 'خُذِ الجَرَّارَ نَحْوَ التِّبْنِ، لَا البِرْكَة!', missionFr: 'Amène le tracteur au foin — pas au bassin !', missionEn: 'Drive the tractor to the hay — not the pond!' },
  { walker: 'goat',    walkerEmoji: '🐐', mode: 'open', speed: 135, timerSecs: null, map: MAP_GOAT,
    finishAr: '🫒 الزيتون', finishFr: '🫒 Olivier', finishEn: '🫒 Olive',
    missionAr: 'أَوْصِلِ المَاعِزَ إِلَى الزَّيْتُون!', missionFr: 'Amène la chèvre jusqu’à l’olivier !', missionEn: 'Take the goat to the olive tree!' },
  { walker: 'horse',   walkerEmoji: '🐴', mode: 'closed', speed: 130, timerSecs: null, map: MAP_HORSE,
    finishAr: '🪣 الماء', finishFr: '🪣 Abreuvoir', finishEn: '🪣 Trough',
    missionAr: 'أَوْصِلِ الحِصَانَ إِلَى الماء!', missionFr: 'Amène le cheval à l’abreuvoir !', missionEn: 'Take the horse to the water!' },
  { walker: 'hen',     walkerEmoji: '🐔', mode: 'open', speed: 125, timerSecs: null, map: MAP_HEN,
    finishAr: '🪺 العش', finishFr: '🪺 Nid', finishEn: '🪺 Nest',
    missionAr: 'أَوْصِلِ الدَّجَاجَةَ إِلَى العُشِّ (فِي الوَسَط)!', missionFr: 'Amène la poule au nid — au milieu !', missionEn: 'Take the hen to the nest — in the middle!' },
  { walker: 'cow',     walkerEmoji: '🐄', mode: 'open', speed: 140, timerSecs: 90, map: MAP_COW,
    finishAr: '🥛 الحليب', finishFr: '🥛 Lait', finishEn: '🥛 Milk',
    missionAr: 'أَوْصِلِ البَقَرَةَ إِلَى الحَلِيب! (يَسَاراً)', missionFr: 'Amène la vache au lait — à gauche !', missionEn: 'Take the cow to the milk — go left!' },
  { walker: 'duck',    walkerEmoji: '🦆', mode: 'closed', speed: 120, timerSecs: null, map: MAP_DUCK,
    finishAr: '💧 البِرْكَة', finishFr: '💧 Mare', finishEn: '💧 Pond',
    missionAr: 'أَوْصِلِ البَطَّةَ إِلَى البِرْكَة!', missionFr: 'Amène le canard jusqu’à la mare !', missionEn: 'Take the duck to the pond!' },
  { walker: 'cat',     walkerEmoji: '🐱', mode: 'open', speed: 130, timerSecs: null, map: MAP_CAT,
    finishAr: '🐟 السَّمَكَة', finishFr: '🐟 Poisson', finishEn: '🐟 Fish',
    missionAr: 'أَوْصِلِ القِطَّةَ إِلَى السَّمَكَة، لَا الكُرَة!', missionFr: 'Amène le chat au poisson — pas à la pelote !', missionEn: 'Take the cat to the fish — not the yarn!' },
  { walker: 'dog',     walkerEmoji: '🐶', mode: 'closed', speed: 130, timerSecs: null, map: MAP_DOG,
    finishAr: '🦴 العَظْمَة', finishFr: '🦴 Os', finishEn: '🦴 Bone',
    missionAr: 'أَوْصِلِ الكَلْبَ إِلَى العَظْمَة!', missionFr: 'Amène le chien jusqu’à l’os !', missionEn: 'Take the dog to the bone!' },
  { walker: 'donkey',  walkerEmoji: '🫏', mode: 'open', speed: 125, timerSecs: null, map: MAP_DONKEY,
    finishAr: '🌾 التِّبْن', finishFr: '🌾 Foin', finishEn: '🌾 Hay',
    missionAr: 'أَوْصِلِ الحِمَارَ إِلَى التِّبْن!', missionFr: 'Amène l’âne jusqu’au foin !', missionEn: 'Take the donkey to the hay!' },
  { walker: 'rooster', walkerEmoji: '🐓', mode: 'open', speed: 135, timerSecs: null, map: MAP_ROOSTER,
    finishAr: '🏠 الحَظِيرَة', finishFr: '🏠 Poulailler', finishEn: '🏠 Coop',
    missionAr: 'أَوْصِلِ الدِّيكَ إِلَى الحَظِيرَة (فِي الوَسَط)!', missionFr: 'Amène le coq au poulailler — au milieu !', missionEn: 'Take the rooster to the coop — in the middle!' },
  { walker: 'bee',     walkerEmoji: '🐝', mode: 'open', speed: 145, timerSecs: 80, map: MAP_BEE,
    finishAr: '🌻 دَوَّار الشَّمْس', finishFr: '🌻 Tournesol', finishEn: '🌻 Sunflower',
    missionAr: 'أَوْصِلِ النَّحْلَةَ إِلَى الزَّهْرَة! لَا العَنْكَبُوت', missionFr: 'Amène l’abeille à la fleur — pas l’araignée !', missionEn: 'Take the bee to the flower — not the spider!' },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🐰', diffLabel: '⭐',
    titleAr: 'الأرنب والجزر', titleFr: 'Lapin → carotte', titleEn: 'Rabbit → carrot',
    descAr: 'أوصل الأرنب إلى الجزرة', descFr: 'Amène le lapin à la carotte', descEn: 'Take the rabbit to the carrot',
    gradient: 'from-orange-300 to-amber-500' },
  { level: 2, emoji: '🐥', diffLabel: '⭐',
    titleAr: 'الكَتْكُوت وأمه', titleFr: 'Poussin → maman', titleEn: 'Chick → mum',
    descAr: 'أعد الكتكوت إلى أمه', descFr: 'Ramène le poussin à sa maman', descEn: 'Take the chick back to mum',
    gradient: 'from-yellow-300 to-orange-400' },
  { level: 3, emoji: '🐑', diffLabel: '⭐',
    titleAr: 'الخروف والحظيرة', titleFr: 'Mouton → bergerie', titleEn: 'Sheep → barn',
    descAr: 'أعد الخروف إلى الحظيرة', descFr: 'Ramène le mouton à la bergerie', descEn: 'Take the sheep to the barn',
    gradient: 'from-stone-300 to-stone-500' },
  { level: 4, emoji: '🚜', diffLabel: '⭐⭐',
    titleAr: 'الجرار والتبن', titleFr: 'Tracteur → foin', titleEn: 'Tractor → hay',
    descAr: 'إلى التبن، ليس البركة', descFr: 'Vers le foin, pas le bassin', descEn: 'To the hay, not the pond',
    gradient: 'from-lime-400 to-green-600' },
  { level: 5, emoji: '🐐', diffLabel: '⭐⭐',
    titleAr: 'الماعز والزيتون', titleFr: 'Chèvre → olivier', titleEn: 'Goat → olive',
    descAr: 'أوصل الماعز إلى الزيتون', descFr: 'Amène la chèvre à l’olivier', descEn: 'Take the goat to the olive tree',
    gradient: 'from-amber-400 to-orange-500' },
  { level: 6, emoji: '🐴', diffLabel: '⭐⭐',
    titleAr: 'الحصان والماء', titleFr: 'Cheval → eau', titleEn: 'Horse → water',
    descAr: 'أوصل الحصان إلى الماء', descFr: 'Amène le cheval à l’abreuvoir', descEn: 'Take the horse to the water',
    gradient: 'from-amber-600 to-stone-700' },
  { level: 7, emoji: '🐔', diffLabel: '⭐⭐⭐',
    titleAr: 'الدجاجة والعش', titleFr: 'Poule → nid', titleEn: 'Hen → nest',
    descAr: 'العش في الوسط', descFr: 'Le nid est au milieu', descEn: 'The nest is in the middle',
    gradient: 'from-rose-400 to-orange-500' },
  { level: 8, emoji: '🐄', diffLabel: '⭐⭐⭐',
    titleAr: 'البقرة والحليب', titleFr: 'Vache → lait', titleEn: 'Cow → milk',
    descAr: 'الحليب يساراً، ليس التبن', descFr: 'Le lait est à gauche, pas le foin', descEn: 'Milk is to the left, not the hay',
    gradient: 'from-rose-400 to-pink-600' },
  { level: 9, emoji: '🦆', diffLabel: '⭐⭐',
    titleAr: 'البطة والبركة', titleFr: 'Canard → mare', titleEn: 'Duck → pond',
    descAr: 'أوصل البطة إلى البركة', descFr: 'Amène le canard à la mare', descEn: 'Take the duck to the pond',
    gradient: 'from-sky-400 to-teal-500' },
  { level: 10, emoji: '🐱', diffLabel: '⭐⭐',
    titleAr: 'القطة والسمكة', titleFr: 'Chat → poisson', titleEn: 'Cat → fish',
    descAr: 'إلى السمكة، ليس الكرة', descFr: 'Vers le poisson, pas la pelote', descEn: 'To the fish, not the yarn',
    gradient: 'from-violet-400 to-purple-600' },
  { level: 11, emoji: '🐶', diffLabel: '⭐⭐',
    titleAr: 'الكلب والعظمة', titleFr: 'Chien → os', titleEn: 'Dog → bone',
    descAr: 'أوصل الكلب إلى العظمة', descFr: 'Amène le chien à l’os', descEn: 'Take the dog to the bone',
    gradient: 'from-amber-500 to-orange-700' },
  { level: 12, emoji: '🫏', diffLabel: '⭐⭐⭐',
    titleAr: 'الحمار والتبن', titleFr: 'Âne → foin', titleEn: 'Donkey → hay',
    descAr: 'أوصل الحمار إلى التبن', descFr: 'Amène l’âne au foin', descEn: 'Take the donkey to the hay',
    gradient: 'from-stone-400 to-neutral-600' },
  { level: 13, emoji: '🐓', diffLabel: '⭐⭐⭐',
    titleAr: 'الديك والحظيرة', titleFr: 'Coq → poulailler', titleEn: 'Rooster → coop',
    descAr: 'الحظيرة في الوسط', descFr: 'Le poulailler est au milieu', descEn: 'The coop is in the middle',
    gradient: 'from-red-400 to-rose-600' },
  { level: 14, emoji: '🐝', diffLabel: '🏆',
    titleAr: 'النحلة والزهرة', titleFr: 'Abeille → fleur', titleEn: 'Bee → flower',
    descAr: 'إلى الزهرة، ليس العنكبوت', descFr: 'Vers la fleur, pas l’araignée', descEn: 'To the flower, not the spider',
    gradient: 'from-yellow-400 to-amber-500' },
];

function isOnPath(px: number, py: number, map: FarmMap): boolean {
  return map.segs.some(s => px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h);
}

function makeWalkerTexture(scene: Phaser.Scene, key: string, walker: FarmWalker) {
  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.18);
  g.fillEllipse(32, 50, 44, 10);

  if (walker === 'tractor') {
    g.fillStyle(0x4d7c0f); g.fillRoundedRect(8, 16, 48, 22, 5);
    g.fillStyle(0x65a30d); g.fillRoundedRect(28, 4, 26, 18, 4);
    g.fillStyle(0x7dd3fc, 0.8); g.fillRect(34, 8, 14, 10);
    g.fillStyle(0x1e293b); g.fillCircle(16, 40, 12); g.fillCircle(50, 40, 9);
    g.fillStyle(0x94a3b8); g.fillCircle(16, 40, 5); g.fillCircle(50, 40, 4);
    g.fillStyle(0xfacc15); g.fillRect(4, 22, 6, 6);
  } else if (walker === 'rabbit') {
    g.fillStyle(0xf8fafc); g.fillEllipse(22, 8, 8, 22); g.fillEllipse(34, 8, 8, 22);
    g.fillStyle(0xfce7f3); g.fillEllipse(22, 10, 4, 12); g.fillEllipse(34, 10, 4, 12);
    g.fillStyle(0xf8fafc); g.fillCircle(28, 32, 16);
    g.fillStyle(0x1e293b); g.fillCircle(22, 30, 2.5); g.fillCircle(34, 30, 2.5);
    g.fillStyle(0xf9a8d4); g.fillCircle(28, 36, 3);
  } else if (walker === 'chick') {
    g.fillStyle(0xfacc15); g.fillCircle(30, 30, 16);
    g.fillStyle(0xfde047); g.fillCircle(30, 18, 10);
    g.fillStyle(0x1e293b); g.fillCircle(27, 16, 2); g.fillCircle(33, 16, 2);
    g.fillStyle(0xf97316); g.fillTriangle(30, 18, 38, 20, 30, 24);
  } else if (walker === 'sheep') {
    g.fillStyle(0xf8fafc); g.fillCircle(18, 30, 12); g.fillCircle(32, 22, 14); g.fillCircle(46, 30, 12); g.fillCircle(32, 36, 13);
    g.fillStyle(0x1e293b); g.fillCircle(48, 22, 8);
    g.fillStyle(0xf8fafc); g.fillCircle(50, 20, 3); g.fillCircle(54, 22, 2);
  } else if (walker === 'goat') {
    g.fillStyle(0xd6d3d1); g.fillEllipse(32, 32, 36, 22);
    g.fillStyle(0xa8a29e); g.fillCircle(50, 22, 10);
    g.fillStyle(0x78716c); g.fillTriangle(46, 10, 50, 4, 52, 12); g.fillTriangle(54, 10, 58, 4, 56, 12);
    g.fillStyle(0x1e293b); g.fillCircle(52, 20, 2);
  } else if (walker === 'horse') {
    g.fillStyle(0x92400e); g.fillEllipse(30, 32, 38, 22);
    g.fillStyle(0x78350f); g.fillCircle(50, 20, 11);
    g.fillStyle(0x451a03); g.fillRect(48, 6, 5, 12);
    g.fillStyle(0x1e293b); g.fillCircle(54, 18, 2);
    g.fillStyle(0xfbbf24); g.fillRect(8, 24, 8, 14);
  } else if (walker === 'hen') {
    g.fillStyle(0xf8fafc); g.fillEllipse(30, 32, 32, 22);
    g.fillStyle(0xfacc15); g.fillCircle(46, 22, 10);
    g.fillStyle(0xdc2626); g.fillTriangle(44, 10, 48, 4, 52, 10);
    g.fillStyle(0xf97316); g.fillTriangle(50, 22, 60, 24, 50, 28);
    g.fillStyle(0x1e293b); g.fillCircle(48, 20, 2);
  } else if (walker === 'duck') {
    g.fillStyle(0xf8fafc); g.fillEllipse(30, 34, 34, 20);
    g.fillStyle(0xfacc15); g.fillCircle(48, 24, 10);
    g.fillStyle(0xf97316); g.fillEllipse(58, 26, 14, 6);
    g.fillStyle(0x1e293b); g.fillCircle(50, 22, 2);
    g.fillStyle(0x22c55e); g.fillEllipse(18, 28, 10, 6);
  } else if (walker === 'cat') {
    g.fillStyle(0xf97316); g.fillEllipse(32, 34, 32, 22);
    g.fillStyle(0xfb923c); g.fillCircle(44, 22, 12);
    g.fillStyle(0xf97316); g.fillTriangle(36, 14, 40, 4, 44, 14); g.fillTriangle(48, 14, 54, 4, 56, 14);
    g.fillStyle(0x1e293b); g.fillCircle(42, 20, 2); g.fillCircle(50, 20, 2);
    g.fillStyle(0xf9a8d4); g.fillTriangle(46, 24, 52, 26, 46, 28);
  } else if (walker === 'dog') {
    g.fillStyle(0xb45309); g.fillEllipse(30, 34, 34, 20);
    g.fillStyle(0x92400e); g.fillCircle(46, 22, 11);
    g.fillStyle(0x78350f); g.fillEllipse(38, 18, 10, 16); g.fillEllipse(54, 18, 10, 16);
    g.fillStyle(0x1e293b); g.fillCircle(44, 20, 2); g.fillCircle(50, 20, 2);
    g.fillStyle(0xf9a8d4); g.fillEllipse(48, 28, 5, 3);
  } else if (walker === 'donkey') {
    g.fillStyle(0xa8a29e); g.fillEllipse(30, 34, 36, 20);
    g.fillStyle(0x78716c); g.fillCircle(48, 22, 10);
    g.fillStyle(0x57534e); g.fillEllipse(42, 8, 6, 18); g.fillEllipse(54, 8, 6, 18);
    g.fillStyle(0x1e293b); g.fillCircle(50, 20, 2);
    g.fillStyle(0xf5f5f4); g.fillRect(8, 28, 8, 12);
  } else if (walker === 'rooster') {
    g.fillStyle(0xf97316); g.fillEllipse(30, 34, 30, 20);
    g.fillStyle(0xfacc15); g.fillCircle(46, 22, 10);
    g.fillStyle(0xdc2626); g.fillTriangle(42, 8, 48, 0, 54, 10);
    g.fillStyle(0xf97316); g.fillTriangle(52, 22, 62, 24, 52, 28);
    g.fillStyle(0x7c3aed); g.fillEllipse(14, 28, 12, 10);
    g.fillStyle(0x1e293b); g.fillCircle(48, 20, 2);
  } else if (walker === 'bee') {
    g.fillStyle(0xfacc15); g.fillEllipse(32, 30, 28, 18);
    g.fillStyle(0x1e293b); g.fillRect(22, 22, 5, 16); g.fillRect(32, 22, 5, 16); g.fillRect(42, 22, 5, 16);
    g.fillStyle(0xe0f2fe, 0.85); g.fillEllipse(20, 16, 14, 10); g.fillEllipse(44, 16, 14, 10);
    g.fillStyle(0x1e293b); g.fillCircle(48, 28, 2);
  } else {
    g.fillStyle(0xf8fafc); g.fillEllipse(32, 32, 40, 24);
    g.fillStyle(0x1e293b); g.fillEllipse(22, 30, 10, 8); g.fillEllipse(40, 36, 12, 8);
    g.fillStyle(0x1e293b); g.fillCircle(50, 22, 9);
    g.fillStyle(0xf8fafc); g.fillCircle(52, 20, 2.5);
    g.fillStyle(0xf9a8d4); g.fillEllipse(54, 26, 6, 4);
  }

  g.generateTexture(key, 64, 56);
  g.destroy();
}

function drawTree(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0x000000, 0.12); g.fillEllipse(x + 4, y + 22, 28, 10);
  g.fillStyle(0x92400e); g.fillRect(x - 5, y, 10, 26);
  g.fillStyle(0x166534); g.fillCircle(x, y - 6, 18);
  g.fillStyle(0x22c55e); g.fillCircle(x - 10, y, 12); g.fillCircle(x + 11, y, 12);
  g.fillStyle(0x4ade80); g.fillCircle(x, y - 12, 8);
}

function drawHay(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0x000000, 0.12); g.fillEllipse(x, y + 14, 36, 10);
  g.fillStyle(0xeab308); g.fillRoundedRect(x - 18, y - 10, 36, 22, 6);
  g.fillStyle(0xfacc15); g.fillRoundedRect(x - 16, y - 14, 32, 10, 4);
  g.lineStyle(1.5, 0xca8a04, 0.6);
  g.beginPath(); g.moveTo(x - 14, y - 2); g.lineTo(x + 14, y - 2); g.strokePath();
}

function drawBarn(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0x000000, 0.15); g.fillEllipse(x, y + 28, 70, 12);
  g.fillStyle(0xb91c1c); g.fillRect(x - 36, y - 8, 72, 42);
  g.fillStyle(0x7f1d1d); g.fillTriangle(x - 42, y - 8, x + 42, y - 8, x, y - 42);
  g.fillStyle(0xfef3c7); g.fillRect(x - 10, y + 8, 20, 26);
  g.fillStyle(0x92400e); g.fillRect(x - 10, y + 20, 20, 4);
  g.fillStyle(0x7dd3fc, 0.75); g.fillRect(x - 28, y + 2, 12, 10); g.fillRect(x + 16, y + 2, 12, 10);
}

function drawPond(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0x0284c7, 0.85); g.fillEllipse(x, y, 52, 34);
  g.fillStyle(0x38bdf8, 0.55); g.fillEllipse(x - 6, y - 4, 24, 14);
}

function drawSun(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0xfde047, 0.35); g.fillCircle(x, y, 38);
  g.fillStyle(0xfacc15); g.fillCircle(x, y, 22);
  g.fillStyle(0xfef08a); g.fillCircle(x - 5, y - 5, 8);
}

function drawCloud(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0xffffff, 0.92);
  g.fillCircle(x, y, 16); g.fillCircle(x + 18, y + 2, 14); g.fillCircle(x - 16, y + 4, 12);
  g.fillEllipse(x + 2, y + 10, 48, 16);
}

function drawFlower(g: Phaser.GameObjects.Graphics, x: number, y: number, color: number) {
  g.fillStyle(0x166534); g.fillRect(x - 1, y, 3, 10);
  g.fillStyle(color);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    g.fillCircle(x + Math.cos(a) * 5, y + Math.sin(a) * 5, 4);
  }
  g.fillStyle(0xfacc15); g.fillCircle(x, y, 3);
}

function drawGoalPad(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0xf59e0b, 0.35); g.fillEllipse(x, y + 8, 88, 40);
  g.fillStyle(0xfef08a, 0.9); g.fillEllipse(x, y + 6, 70, 30);
  g.lineStyle(4, 0xf59e0b, 0.95); g.strokeEllipse(x, y + 6, 70, 30);
}

function drawDirtPath(g: Phaser.GameObjects.Graphics, map: FarmMap, closed: boolean) {
  g.fillStyle(0x6b4f2a, 0.55);
  for (const s of map.segs) g.fillRoundedRect(s.x + 5, s.y + 8, s.w, s.h, 18);
  g.fillStyle(closed ? 0xb45309 : 0xc4a574);
  for (const s of map.segs) g.fillRoundedRect(s.x, s.y, s.w, s.h, 18);
  g.fillStyle(0xe8d5a3, 0.45);
  for (const s of map.segs) {
    if (s.w > s.h) g.fillRoundedRect(s.x + 10, s.y + s.h * 0.28, s.w - 20, s.h * 0.28, 8);
    else g.fillRoundedRect(s.x + s.w * 0.28, s.y + 10, s.w * 0.28, s.h - 20, 8);
  }
  g.fillStyle(0x78716c, 0.35);
  for (const s of map.segs) {
    for (let i = 0; i < 5; i++) {
      const px = s.x + 16 + ((i * 47 + s.y) % Math.max(20, s.w - 28));
      const py = s.y + 14 + ((i * 31 + s.x) % Math.max(16, s.h - 24));
      g.fillCircle(px, py, 2.5);
    }
  }

  if (!closed) return;
  g.fillStyle(0x78350f);
  for (const s of map.segs) {
    const step = 28;
    if (s.w > s.h) {
      for (let x = s.x + 8; x < s.x + s.w - 8; x += step) {
        g.fillRect(x, s.y - 10, 5, 14);
        g.fillRect(x, s.y + s.h - 4, 5, 14);
      }
      g.fillStyle(0xa16207);
      g.fillRect(s.x + 4, s.y - 8, s.w - 8, 4);
      g.fillRect(s.x + 4, s.y + s.h, s.w - 8, 4);
      g.fillStyle(0x78350f);
    } else {
      for (let y = s.y + 8; y < s.y + s.h - 8; y += step) {
        g.fillRect(s.x - 10, y, 14, 5);
        g.fillRect(s.x + s.w - 4, y, 14, 5);
      }
      g.fillStyle(0xa16207);
      g.fillRect(s.x - 8, s.y + 4, 4, s.h - 8);
      g.fillRect(s.x + s.w, s.y + 4, 4, s.h - 8);
      g.fillStyle(0x78350f);
    }
  }
}

export const FarmGame: React.FC<FarmGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('farm', 14);
  const unlockedCap = (stars[8] ?? 0) > 0 ? Math.max(maxUnlocked, 9) : maxUnlocked;
  const [phase, setPhase] = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);
  const requestLeave = useActivityExitGuard(phase === 'play', language);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const ctrl = useRef<Record<Dir, boolean>>({ up: false, down: false, left: false, right: false });
  const onWinRef = useRef<(s: number) => void>(() => {});
  const onLoseRef = useRef<() => void>(() => {});

  const { speak } = usePreschoolSpeech(language);
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;
  const cfgPlay = LEVELS[activeLevel - 1];
  const mission = t(cfgPlay.missionAr, cfgPlay.missionFr, cfgPlay.missionEn);

  onWinRef.current = (s: number) => {
    completeLevel(activeLevel, s);
    setPhase('select');
  };
  onLoseRef.current = () => setPhase('select');

  useEffect(() => {
    if (phase !== 'play') return;
    const timer = window.setTimeout(() => speak(mission), 350);
    return () => window.clearTimeout(timer);
  }, [phase, activeLevel, mission, speak]);

  useEffect(() => {
    if (phase !== 'play' || !containerRef.current) return;

    const cfg = LEVELS[activeLevel - 1];
    const map = cfg.map;
    const ctrlRef = ctrl;

    const labels = {
      win:    t('🎉 أحسنت! بطل المزرعة! 🏆', '🎉 Bravo ! Champion de la ferme ! 🏆', '🎉 Farm champion! 🏆'),
      finish: t(cfg.finishAr, cfg.finishFr, cfg.finishEn),
      timeUp: t('⏰ انتهى الوقت! 😅', '⏰ Temps écoulé ! 😅', '⏰ Time’s up! 😅'),
      fence:  t('الطريق المسيَّج!', 'Reste sur le sentier !', 'Stay on the path!'),
      grass:  t('العشب بطيء', 'L’herbe est plus lente', 'Grass is slower'),
      cross:  t('حَيَوَان يَعْبُر!', 'Un animal traverse !', 'An animal is crossing!'),
    };

    class FarmScene extends Phaser.Scene {
      private walker!: Phaser.Physics.Arcade.Sprite;
      private keys?: Phaser.Types.Input.Keyboard.CursorKeys;
      private done = false;
      private timerSecs: number;
      private timerText: Phaser.GameObjects.Text | null = null;
      private timerEvent: Phaser.Time.TimerEvent | null = null;
      private lastPath = { x: map.start.x, y: map.start.y };
      private bumpCd = 0;
      private wasMoving = false;
      private movers: { obj: Phaser.GameObjects.Text; dir: number; p: Patrol }[] = [];

      constructor() {
        super({ key: 'FarmScene' });
        this.timerSecs = cfg.timerSecs ?? 0;
      }

      create() {
        const bg = this.add.graphics();
        bg.fillStyle(0x7dd3fc); bg.fillRect(0, 0, W, 110);
        bg.fillStyle(0x86efac); bg.fillRect(0, 90, W, H - 90);
        bg.fillStyle(0x4ade80, 0.4);
        for (let gx = 16; gx < W; gx += 28)
          for (let gy = 110; gy < H; gy += 28)
            if ((Math.floor(gx / 28) + Math.floor(gy / 28)) % 3 === 0)
              bg.fillCircle(gx, gy, 8);
        bg.fillStyle(0xa3e635, 0.3);
        for (let gx = 30; gx < W; gx += 52)
          for (let gy = 130; gy < H; gy += 44)
            bg.fillEllipse(gx, gy, 16, 7);

        drawSun(bg, 70, 42);
        drawCloud(bg, 220, 38);
        drawCloud(bg, 520, 28);
        drawCloud(bg, 720, 48);
        [
          { x: 160, y: 260, c: 0xf472b6 }, { x: 300, y: 300, c: 0xfbbf24 },
          { x: 480, y: 270, c: 0xf97316 }, { x: 620, y: 320, c: 0xa78bfa },
          { x: 240, y: 440, c: 0xf472b6 }, { x: 540, y: 450, c: 0xfbbf24 },
        ].forEach((f) => drawFlower(bg, f.x, f.y, f.c));

        const pathG = this.add.graphics();
        drawDirtPath(pathG, map, cfg.mode === 'closed');

        const dG = this.add.graphics();
        map.trees.forEach((p) => drawTree(dG, p.x, p.y));
        map.hay.forEach((p) => drawHay(dG, p.x, p.y));
        if (map.showBarn) {
          const side = map.goal.x > 400 ? -78 : 78;
          drawBarn(dG, map.goal.x + side, map.goal.y - 8);
        }

        map.deadEnds.forEach((d) => {
          if (d.emoji === '💧') drawPond(dG, d.x, d.y);
          this.add.text(d.x, d.y, d.emoji, { fontSize: '36px' }).setOrigin(0.5).setDepth(4);
        });
        map.friends.forEach((f) => {
          this.add.text(f.x, f.y, f.emoji, { fontSize: '32px' }).setOrigin(0.5).setDepth(4);
        });
        if (map.goalEmoji === '💧') drawPond(dG, map.goal.x, map.goal.y);

        const gx = map.goal.x, gy = map.goal.y;
        drawGoalPad(dG, gx, gy);
        const here = this.add.circle(gx, gy + 6, 38, 0xfacc15, 0.25).setDepth(3);
        this.tweens.add({ targets: here, scaleX: 1.25, scaleY: 1.25, alpha: 0.08, yoyo: true, repeat: -1, duration: 700 });

        const sx = map.start.x, sy = map.start.y;
        dG.fillStyle(0xfef3c7); dG.fillRoundedRect(sx - 22, sy - 26, 44, 28, 6);
        dG.fillStyle(0x92400e); dG.fillRect(sx - 24, sy - 30, 48, 6);
        dG.fillStyle(0xb91c1c); dG.fillRect(sx - 6, sy - 14, 12, 16);
        this.add.text(sx, sy + 20, t('هنا نبدأ', 'On part ici', 'Start here'), {
          fontSize: '13px', color: '#14532d', fontStyle: 'bold',
          backgroundColor: '#ecfccb', padding: { x: 6, y: 3 },
        }).setOrigin(0.5);

        const starTxt = this.add.text(gx, gy - 52, map.goalEmoji, { fontSize: '52px' }).setOrigin(0.5).setDepth(5);
        this.tweens.add({ targets: starTxt, y: gy - 66, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });
        this.add.text(gx, gy + 28, t('هنا! ', 'Ici ! ', 'Here! ') + labels.finish, {
          fontSize: '15px', color: '#422006', fontStyle: 'bold',
          backgroundColor: '#fef08a', padding: { x: 8, y: 4 },
        }).setOrigin(0.5).setDepth(5);

        makeWalkerTexture(this, 'farm_walker', cfg.walker);
        this.walker = this.physics.add.sprite(map.start.x, map.start.y, 'farm_walker');
        this.walker.setCollideWorldBounds(true).setDepth(6).setOrigin(0.5, 0.5);

        map.patrols.forEach((p) => {
          const txt = this.add.text(p.minX, p.y, p.emoji ?? '🐑', { fontSize: '36px' }).setOrigin(0.5).setDepth(5);
          this.movers.push({ obj: txt, dir: 1, p });
        });

        if (this.input.keyboard) this.keys = this.input.keyboard.createCursorKeys();

        this.add.text(16, 12, t(`م${activeLevel}`, `N${activeLevel}`, `L${activeLevel}`), {
          fontSize: '16px', color: '#14532d', fontStyle: 'bold',
          backgroundColor: '#ffffffcc', padding: { x: 8, y: 4 },
        }).setOrigin(0, 0).setDepth(10);

        if (cfg.timerSecs !== null) {
          this.timerText = this.add.text(W - 14, 12, `⏱️ ${this.timerSecs}s`, {
            fontSize: '18px', color: '#fef08a', fontStyle: 'bold',
            backgroundColor: '#14532d', padding: { x: 8, y: 4 },
          }).setOrigin(1, 0).setDepth(11);

          this.timerEvent = this.time.addEvent({
            delay: 1000, loop: true,
            callback: () => {
              if (this.done) return;
              this.timerSecs--;
              if (this.timerText) {
                this.timerText.setText(`⏱️ ${this.timerSecs}s`);
                if (this.timerSecs <= 10) this.timerText.setColor('#f87171');
              }
              if (this.timerSecs <= 0) {
                this.done = true;
                stopMotionAudio();
                this.walker.setVelocity(0);
                this.cameras.main.flash(400, 255, 80, 80);
                const p = this.add.graphics().setDepth(30);
                p.fillStyle(0x14532d, 0.94); p.fillRoundedRect(160, 185, 480, 120, 20);
                p.lineStyle(3, 0xf87171); p.strokeRoundedRect(160, 185, 480, 120, 20);
                this.add.text(400, 245, labels.timeUp, {
                  fontSize: '28px', color: '#fca5a5', fontStyle: 'bold',
                }).setOrigin(0.5).setDepth(31);
                this.time.delayedCall(1800, () => onLoseRef.current());
              }
            },
          });
        }
      }

      private bumpHint(msg: string, sfx?: 'fence' | 'pond' | 'sheep' | 'grass') {
        if (this.time.now < this.bumpCd) return;
        this.bumpCd = this.time.now + 900;
        if (sfx === 'fence') playFenceBump();
        else if (sfx === 'pond') playPondSplash();
        else if (sfx === 'sheep') playSheepBaa();
        const tip = this.add.text(this.walker.x, this.walker.y - 42, msg, {
          fontSize: '14px', color: '#fef08a', fontStyle: 'bold',
          backgroundColor: '#14532d', padding: { x: 6, y: 3 },
        }).setOrigin(0.5).setDepth(20);
        this.tweens.add({ targets: tip, y: tip.y - 28, alpha: 0, duration: 800, onComplete: () => tip.destroy() });
      }

      private celebrate() {
        this.done = true;
        stopMotionAudio();
        if (this.timerEvent) this.timerEvent.destroy();
        this.walker.setVelocity(0);
        playSuccessChime();

        let earnedStars = 3;
        if (cfg.timerSecs !== null) {
          earnedStars = this.timerSecs > cfg.timerSecs * 0.5 ? 3
                      : this.timerSecs > cfg.timerSecs * 0.2 ? 2
                      : 1;
        }

        this.cameras.main.flash(700, 255, 240, 0);
        ['🎉', '⭐', map.goalEmoji, '✨', '🐄', '🥳'].forEach((em, i) => {
          this.time.delayedCall(i * 110, () => {
            const tx = this.add.text(
              Phaser.Math.Between(150, 650), Phaser.Math.Between(150, 370), em, { fontSize: '38px' },
            ).setDepth(32).setAlpha(0);
            this.tweens.add({
              targets: tx, alpha: 1, y: tx.y - 130, duration: 1600, ease: 'Quad.easeOut',
              onComplete: () => { this.tweens.add({ targets: tx, alpha: 0, duration: 600 }); },
            });
          });
        });

        const starsStr = '★'.repeat(earnedStars) + '☆'.repeat(3 - earnedStars);
        const panel = this.add.graphics().setDepth(30);
        panel.fillStyle(0x14532d, 0.94); panel.fillRoundedRect(140, 175, 520, 145, 22);
        panel.lineStyle(3, 0xfbbf24); panel.strokeRoundedRect(140, 175, 520, 145, 22);

        const wt = this.add.text(400, 230, labels.win, {
          fontSize: '26px', color: '#fef08a', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(31).setScale(0.2);
        this.tweens.add({ targets: wt, scaleX: 1, scaleY: 1, duration: 480, ease: 'Back.easeOut' });

        this.time.delayedCall(550, () => {
          const st = this.add.text(400, 285, starsStr, { fontSize: '34px', color: '#fbbf24' })
            .setOrigin(0.5).setDepth(32).setScale(0.2);
          this.tweens.add({ targets: st, scaleX: 1, scaleY: 1, duration: 400, ease: 'Back.easeOut' });
        });

        this.time.delayedCall(2200, () => onWinRef.current(earnedStars));
      }

      update(_time: number, delta: number) {
        if (this.done) { this.walker.setVelocity(0); stopMotionAudio(); return; }

        const U = this.keys?.up.isDown    || ctrlRef.current.up;
        const D = this.keys?.down.isDown  || ctrlRef.current.down;
        const L = this.keys?.left.isDown  || ctrlRef.current.left;
        const R = this.keys?.right.isDown || ctrlRef.current.right;
        const moving = !!(U || D || L || R);
        if (moving) {
          if (!this.wasMoving) playFarmStart(cfg.walker);
          setFarmMoving(cfg.walker, true);
        } else {
          setFarmMoving(cfg.walker, false);
        }
        this.wasMoving = moving;

        const onPath = isOnPath(this.walker.x, this.walker.y, map);
        if (onPath) this.lastPath = { x: this.walker.x, y: this.walker.y };

        if (!onPath && cfg.mode === 'closed') {
          this.walker.setPosition(this.lastPath.x, this.lastPath.y);
          this.walker.setVelocity(0);
          this.bumpHint(labels.fence, 'fence');
          return;
        }

        const speed = !onPath ? 42 : cfg.speed;
        if (moving && !onPath) this.bumpHint(labels.grass, 'grass');

        this.walker.setVelocity(0);
        if (L) { this.walker.setVelocityX(-speed); this.walker.setFlipX(true); }
        else if (R) { this.walker.setVelocityX(speed); this.walker.setFlipX(false); }
        if (U) this.walker.setVelocityY(-speed);
        else if (D) this.walker.setVelocityY(speed);

        map.deadEnds.forEach((d) => {
          if (Phaser.Math.Distance.Between(this.walker.x, this.walker.y, d.x, d.y) < 42) {
            this.walker.x += this.walker.x > d.x ? 10 : -10;
            this.walker.y += this.walker.y > d.y ? 8 : -8;
            this.bumpHint(t(d.hintAr, d.hintFr, d.hintEn), d.emoji === '💧' ? 'pond' : 'fence');
          }
        });

        const dt = delta / 1000;
        this.movers.forEach((m) => {
          m.obj.x += m.dir * m.p.speed * dt;
          if (m.obj.x > m.p.maxX || m.obj.x < m.p.minX) m.dir *= -1;
          if (Phaser.Math.Distance.Between(this.walker.x, this.walker.y, m.obj.x, m.obj.y) < 30) {
            this.walker.x += this.walker.x > m.obj.x ? 8 : -8;
            this.bumpHint(labels.cross, 'sheep');
          }
        });

        if (Phaser.Math.Distance.Between(this.walker.x, this.walker.y, map.goal.x, map.goal.y) < 44) {
          this.celebrate();
        }
      }
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: W, height: H,
      transparent: false,
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: [FarmScene],
    });

    return () => { stopMotionAudio(); gameRef.current?.destroy(true); };
  }, [phase, activeLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  const dBtn = (icon: string, dir: Dir) => (
    <motion.button
      key={dir}
      whileTap={{ scale: 0.9 }}
      className="w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-2xl bg-lime-500 hover:bg-lime-400 active:bg-lime-600
                 text-3xl flex items-center justify-center select-none border-2 border-lime-300
                 shadow-md shadow-lime-700/20 cursor-pointer touch-none"
      onPointerDown={e => { e.preventDefault(); resumeTownAudio(); ctrl.current[dir] = true; }}
      onPointerUp={e => { e.preventDefault(); ctrl.current[dir] = false; }}
      onPointerLeave={e => { e.preventDefault(); ctrl.current[dir] = false; }}
    >
      {icon}
    </motion.button>
  );

  if (phase === 'select') {
    return (
      <LevelSelectScreen
        gameTitle={t('فِي المَزْرَعَة', 'À la ferme', 'On the farm')}
        gameIcon="🐄"
        language={language}
        onExit={onExit ?? (() => {})}
        onSelectLevel={lvl => { setLevel(lvl); setPhase('play'); }}
        levels={LEVEL_DEFS.map(d => ({
          ...d,
          unlocked: d.level <= unlockedCap,
          earnedStars: stars[d.level] ?? 0,
        }))}
      />
    );
  }

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="preschool-safe-top relative flex flex-col items-center gap-4 bg-[#F8F9FA] p-4 sm:p-6 rounded-3xl min-h-screen justify-center"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => requestLeave(() => setPhase('select'))}
        className="absolute top-4 start-4 z-10 bg-white hover:bg-amber-50 text-slate-800 font-black
                   px-4 py-2 rounded-2xl shadow-md border-2 border-amber-200 cursor-pointer
                   flex items-center gap-2 text-sm"
      >
        🚪 {t('خروج', 'Retour', 'Back')}
      </motion.button>

      <div className="flex items-center justify-center gap-3 mt-12 sm:mt-2 max-w-xl px-14">
        <p className="text-3xl shrink-0">{cfgPlay.walkerEmoji} <span className="text-amber-500">→</span> {cfgPlay.map.goalEmoji}</p>
        <p className="text-base sm:text-lg font-black text-slate-800 text-center leading-snug">{mission}</p>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => { resumeTownAudio(); speak(mission); }}
          className="min-h-12 min-w-12 shrink-0 rounded-2xl bg-white shadow-md border-2 border-lime-300 text-2xl"
          aria-label={t('استمع', 'Écouter', 'Listen')}
        >
          🔊
        </motion.button>
      </div>

      <div
        ref={containerRef}
        className="w-full max-w-4xl aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border-4 border-amber-300"
      />

      <div className="flex flex-col items-center gap-2" dir="ltr">
        <div className="flex justify-center">{dBtn('⬆️', 'up')}</div>
        <div className="flex gap-2 items-center">
          {dBtn('⬅️', 'left')}
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-200" />
          {dBtn('➡️', 'right')}
        </div>
        <div className="flex justify-center">{dBtn('⬇️', 'down')}</div>
      </div>
    </div>
  );
};

export default FarmGame;

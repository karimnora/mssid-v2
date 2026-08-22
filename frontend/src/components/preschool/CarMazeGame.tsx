/**
 * CarMazeGame.tsx — « En Ville » pour 3-5 ans.
 * Un seul jeu, 10 parcours : vélo, taxi, moto, train — chemins et sons différents.
 * (piste verte lente, asphalte, virages rapides, rails d'où on ne sort pas).
 */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { motion } from 'motion/react';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';
import {
  playCatMeow,
  playPotholeThud,
  playSheepBaa,
  playSuccessChime,
  playVehicleStart,
  resumeTownAudio,
  setTownMoving,
  stopMotionAudio,
  type TownVehicleKind,
} from './usePreschoolAudio';

export interface CarMazeGameProps {
  onExit?: () => void;
  language?: 'ar' | 'fr' | 'en';
}

type Dir = 'up' | 'down' | 'left' | 'right';
type Vehicle = 'bike' | 'car' | 'moto' | 'train' | 'taxi';
type Track = 'bike' | 'road' | 'rail';

interface RoadSeg { x: number; y: number; w: number; h: number }
interface RoadCircle { x: number; y: number; r: number; innerR: number }
interface Patrol {
  kind: 'taxi' | 'sheep' | 'cat';
  y: number;
  minX: number;
  maxX: number;
  speed: number;
}

interface DeadEnd {
  x: number; y: number;
  emoji: string;
  hintAr: string; hintFr: string; hintEn: string;
}

interface LevelMap {
  segs: RoadSeg[];
  circles: RoadCircle[];
  start: { x: number; y: number };
  goal: { x: number; y: number };
  potholes: { x: number; y: number }[];
  parkedTaxi: { x: number; y: number; angle: number } | null;
  patrols: Patrol[];
  palms: { x: number; y: number }[];
  deadEnds: DeadEnd[];
  goalEmoji: string;
}

interface CarLevelCfg {
  vehicle: Vehicle;
  track: Track;
  speed: number;
  timerSecs: number | null;
  map: LevelMap;
  finishAr: string;
  finishFr: string;
  finishEn: string;
}

// 1. Vélo — un seul virage (L), piste verte, lent
const MAP_BIKE: LevelMap = {
  segs: [
    { x: 40,  y: 70,  w: 710, h: 95 },
    { x: 655, y: 70,  w: 95,  h: 360 },
  ],
  circles: [],
  start: { x: 90, y: 117 },
  goal: { x: 702, y: 390 },
  potholes: [],
  parkedTaxi: null,
  patrols: [],
  palms: [{ x: 220, y: 250 }, { x: 380, y: 280 }, { x: 520, y: 250 }, { x: 200, y: 430 }],
  deadEnds: [],
  goalEmoji: '🏫',
};

// 2. Voiture — tour du quartier (U)
const MAP_CAR_U: LevelMap = {
  segs: [
    { x: 50,  y: 50,  w: 700, h: 100 },
    { x: 650, y: 50,  w: 100, h: 380 },
    { x: 50,  y: 330, w: 700, h: 100 },
  ],
  circles: [],
  start: { x: 105, y: 100 },
  goal: { x: 105, y: 380 },
  potholes: [],
  parkedTaxi: null,
  patrols: [],
  palms: [{ x: 280, y: 220 }, { x: 420, y: 220 }, { x: 350, y: 250 }],
  deadEnds: [],
  goalEmoji: '🏠',
};

// 5. Magasin — labyrinthe simple : une fausse descente
const MAP_SHOP_MAZE: LevelMap = {
  segs: [
    { x: 40,  y: 40,  w: 720, h: 110 },
    { x: 270, y: 40,  w: 110, h: 250 },
    { x: 650, y: 40,  w: 110, h: 410 },
  ],
  circles: [],
  start: { x: 90, y: 95 },
  goal: { x: 705, y: 405 },
  potholes: [],
  parkedTaxi: null,
  patrols: [],
  palms: [{ x: 180, y: 280 }, { x: 430, y: 280 }, { x: 430, y: 420 }],
  deadEnds: [{
    x: 325, y: 250, emoji: '🚧',
    hintAr: 'مسدود! ليس من هنا', hintFr: 'Cul-de-sac ! Pas par là', hintEn: 'Dead end! Not this way',
  }],
  goalEmoji: '🏪',
};

// 4. Taxi — rond-point relié (4 branches + anneau). L'ancien anneau extérieur n'entrait pas dans le dôme.
const MAP_ROUND: LevelMap = {
  segs: [
    { x: 30,  y: 200, w: 290, h: 100 },
    { x: 480, y: 200, w: 290, h: 100 },
    { x: 280, y: 200, w: 240, h: 100 },
    { x: 350, y: 30,  w: 100, h: 200 },
    { x: 350, y: 270, w: 100, h: 200 },
  ],
  circles: [{ x: 400, y: 250, r: 115, innerR: 36 }],
  start: { x: 90, y: 250 },
  goal: { x: 710, y: 250 },
  potholes: [{ x: 400, y: 80 }, { x: 400, y: 420 }],
  parkedTaxi: null,
  patrols: [],
  palms: [{ x: 180, y: 80 }, { x: 620, y: 80 }, { x: 180, y: 420 }, { x: 620, y: 420 }],
  deadEnds: [],
  goalEmoji: '📚',
};

// 5. Train — rails en U jusqu'à la gare (hors rails = bloqué)
const MAP_TRAIN: LevelMap = {
  segs: [
    { x: 50,  y: 200, w: 700, h: 90 },
    { x: 660, y: 70,  w: 90,  h: 220 },
    { x: 200, y: 70,  w: 550, h: 90 },
  ],
  circles: [],
  start: { x: 100, y: 245 },
  goal: { x: 250, y: 115 },
  potholes: [],
  parkedTaxi: null,
  patrols: [],
  palms: [{ x: 120, y: 80 }, { x: 120, y: 380 }, { x: 420, y: 360 }, { x: 560, y: 360 }],
  deadEnds: [],
  goalEmoji: '🚉',
};

// 10. École — petit quartier (2 fourches) + moutons
const MAP_SCHOOL_MAZE: LevelMap = {
  segs: [
    { x: 40,  y: 36,  w: 430, h: 110 },
    { x: 40,  y: 36,  w: 110, h: 270 },
    { x: 40,  y: 196, w: 720, h: 110 },
    { x: 360, y: 36,  w: 110, h: 430 },
    { x: 360, y: 356, w: 400, h: 110 },
    { x: 650, y: 196, w: 110, h: 270 },
    { x: 200, y: 196, w: 110, h: 200 },
  ],
  circles: [],
  start: { x: 90, y: 90 },
  goal: { x: 705, y: 410 },
  potholes: [{ x: 250, y: 90 }],
  parkedTaxi: null,
  patrols: [{ kind: 'sheep', y: 410, minX: 430, maxX: 600, speed: 28 }],
  palms: [{ x: 220, y: 140 }, { x: 520, y: 140 }, { x: 180, y: 430 }],
  deadEnds: [{
    x: 255, y: 360, emoji: '🚧',
    hintAr: 'مسدود! ارجع', hintFr: 'Cul-de-sac ! Reviens', hintEn: 'Dead end! Go back',
  }],
  goalEmoji: '🏫',
};

const MAP_BIKE_PARK: LevelMap = {
  segs: [
    { x: 40,  y: 50,  w: 720, h: 100 },
    { x: 40,  y: 50,  w: 100, h: 360 },
    { x: 40,  y: 330, w: 430, h: 100 },
  ],
  circles: [],
  start: { x: 700, y: 100 },
  goal: { x: 400, y: 380 },
  potholes: [],
  parkedTaxi: null,
  patrols: [],
  palms: [{ x: 250, y: 200 }, { x: 400, y: 200 }, { x: 550, y: 200 }, { x: 700, y: 280 }],
  deadEnds: [],
  goalEmoji: '🌳',
};

// 6. Clinique — labyrinthe : fausse descente puis le bon couloir
const MAP_CLINIC_MAZE: LevelMap = {
  segs: [
    { x: 40,  y: 36,  w: 530, h: 110 },
    { x: 180, y: 36,  w: 110, h: 250 },
    { x: 460, y: 36,  w: 110, h: 430 },
    { x: 40,  y: 356, w: 720, h: 110 },
  ],
  circles: [],
  start: { x: 90, y: 90 },
  goal: { x: 705, y: 410 },
  potholes: [{ x: 235, y: 90 }],
  parkedTaxi: null,
  patrols: [],
  palms: [{ x: 140, y: 230 }, { x: 340, y: 230 }, { x: 620, y: 180 }],
  deadEnds: [{
    x: 235, y: 250, emoji: '🚧',
    hintAr: 'مسدود! واصل يميناً', hintFr: 'Cul-de-sac ! Continue à droite', hintEn: 'Dead end! Keep going right',
  }],
  goalEmoji: '🏥',
};

// 8. Marché — rails avec une fausse branche
const MAP_MARKET_RAIL: LevelMap = {
  segs: [
    { x: 40,  y: 360, w: 720, h: 110 },
    { x: 200, y: 150, w: 110, h: 320 },
    { x: 650, y: 40,  w: 110, h: 430 },
    { x: 380, y: 40,  w: 380, h: 110 },
  ],
  circles: [],
  start: { x: 90, y: 415 },
  goal: { x: 430, y: 95 },
  potholes: [],
  parkedTaxi: null,
  patrols: [],
  palms: [{ x: 120, y: 220 }, { x: 400, y: 250 }, { x: 560, y: 250 }],
  deadEnds: [{
    x: 255, y: 175, emoji: '🚧',
    hintAr: 'سكة مسدودة!', hintFr: 'Voie fermée !', hintEn: 'Track closed!',
  }],
  goalEmoji: '🛒',
};

// 9. Maison — labyrinthe taxi : deux rues fausses
const MAP_HOME_MAZE: LevelMap = {
  segs: [
    { x: 40,  y: 196, w: 720, h: 110 },
    { x: 180, y: 40,  w: 110, h: 266 },
    { x: 470, y: 196, w: 110, h: 264 },
    { x: 650, y: 40,  w: 110, h: 266 },
  ],
  circles: [],
  start: { x: 90, y: 250 },
  goal: { x: 525, y: 415 },
  potholes: [],
  parkedTaxi: null,
  patrols: [{ kind: 'cat', y: 250, minX: 280, maxX: 420, speed: 40 }],
  palms: [{ x: 320, y: 80 }, { x: 320, y: 400 }, { x: 600, y: 400 }],
  deadEnds: [
    {
      x: 235, y: 70, emoji: '🅿️',
      hintAr: 'موقف! ليس البيت', hintFr: 'Parking ! Pas la maison', hintEn: 'Parking! Not the house',
    },
    {
      x: 705, y: 70, emoji: '🚧',
      hintAr: 'مسدود!', hintFr: 'Cul-de-sac !', hintEn: 'Dead end!',
    },
  ],
  goalEmoji: '🏠',
};

const LEVELS: CarLevelCfg[] = [
  { vehicle: 'bike',  track: 'bike', speed: 130, timerSecs: null, map: MAP_BIKE,        finishAr: '🏫 المدرسة',     finishFr: '🏫 École',         finishEn: '🏫 School' },
  { vehicle: 'bike',  track: 'bike', speed: 140, timerSecs: null, map: MAP_BIKE_PARK,   finishAr: '🌳 الحديقة',     finishFr: '🌳 Parc',          finishEn: '🌳 Park' },
  { vehicle: 'car',   track: 'road', speed: 165, timerSecs: null, map: MAP_CAR_U,       finishAr: '🏠 البيت',       finishFr: '🏠 Maison',        finishEn: '🏠 Home' },
  { vehicle: 'taxi',  track: 'road', speed: 175, timerSecs: 90,   map: MAP_ROUND,       finishAr: '📚 المكتبة',     finishFr: '📚 Bibliothèque',  finishEn: '📚 Library' },
  { vehicle: 'moto',  track: 'road', speed: 185, timerSecs: null, map: MAP_SHOP_MAZE,   finishAr: '🏪 المتجر',      finishFr: '🏪 Magasin',       finishEn: '🏪 Shop' },
  { vehicle: 'moto',  track: 'road', speed: 190, timerSecs: null, map: MAP_CLINIC_MAZE, finishAr: '🏥 العيادة',     finishFr: '🏥 Clinique',      finishEn: '🏥 Clinic' },
  { vehicle: 'train', track: 'rail', speed: 150, timerSecs: 90,   map: MAP_TRAIN,       finishAr: '🚉 المحطة',      finishFr: '🚉 Gare',          finishEn: '🚉 Station' },
  { vehicle: 'train', track: 'rail', speed: 155, timerSecs: 90,   map: MAP_MARKET_RAIL, finishAr: '🛒 السوق',       finishFr: '🛒 Marché',        finishEn: '🛒 Market' },
  { vehicle: 'taxi',  track: 'road', speed: 175, timerSecs: null, map: MAP_HOME_MAZE,   finishAr: '🏠 البيت',       finishFr: '🏠 Maison',        finishEn: '🏠 Home' },
  { vehicle: 'car',   track: 'road', speed: 180, timerSecs: 90,   map: MAP_SCHOOL_MAZE, finishAr: '🏫 المدرسة',     finishFr: '🏫 École',         finishEn: '🏫 School' },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🚲', diffLabel: '⭐',
    titleAr: 'الدراجة – المدرسة', titleFr: 'Vélo – L\'école', titleEn: 'Bike – School',
    descAr:  'درب أخضر، منعطف واحد', descFr: 'Piste verte, un seul virage', descEn: 'Green lane, one turn',
    gradient: 'from-emerald-400 to-green-600' },
  { level: 2, emoji: '🚲', diffLabel: '⭐',
    titleAr: 'الدراجة – الحديقة', titleFr: 'Vélo – Le parc', titleEn: 'Bike – The park',
    descAr:  'مسار على شكل حرف C', descFr: 'Une piste en C jusqu\'aux arbres', descEn: 'A C-shaped path to the trees',
    gradient: 'from-lime-400 to-emerald-600' },
  { level: 3, emoji: '🚗', diffLabel: '⭐',
    titleAr: 'السيارة – البيت', titleFr: 'Voiture – La maison', titleEn: 'Car – Home',
    descAr:  'دُر حول الحي حتى البيت', descFr: 'Le tour du quartier jusqu\'à la maison', descEn: 'Around the block to home',
    gradient: 'from-blue-500 to-indigo-600' },
  { level: 4, emoji: '🚕', diffLabel: '⭐⭐',
    titleAr: 'التاكسي – المكتبة', titleFr: 'Taxi – La bibliothèque', titleEn: 'Taxi – The library',
    descAr:  'اخرج من الدوار نحو المكتبة', descFr: 'Sors du rond-point vers la bibliothèque', descEn: 'Exit the roundabout to the library',
    gradient: 'from-yellow-400 to-amber-500' },
  { level: 5, emoji: '🏍️', diffLabel: '⭐⭐',
    titleAr: 'المتجر – متاهة', titleFr: 'Magasin – Labyrinthe', titleEn: 'Shop – Maze',
    descAr:  'لا تأخذ الطريق المسدود', descFr: 'Évite le cul-de-sac, trouve le magasin', descEn: 'Skip the dead end, find the shop',
    gradient: 'from-orange-400 to-rose-500' },
  { level: 6, emoji: '🏍️', diffLabel: '⭐⭐',
    titleAr: 'العيادة – متاهة', titleFr: 'Clinique – Labyrinthe', titleEn: 'Clinic – Maze',
    descAr:  'اختر الطريق الصحيح', descFr: 'Choisis le bon couloir', descEn: 'Pick the right corridor',
    gradient: 'from-rose-500 to-red-600' },
  { level: 7, emoji: '🚂', diffLabel: '⭐⭐⭐',
    titleAr: 'القطار – المحطة', titleFr: 'Train – La gare', titleEn: 'Train – Station',
    descAr:  'ابق على السكة', descFr: 'Reste sur les rails', descEn: 'Stay on the rails',
    gradient: 'from-slate-500 to-zinc-700' },
  { level: 8, emoji: '🚂', diffLabel: '⭐⭐⭐',
    titleAr: 'القطار – السوق', titleFr: 'Train – Le marché', titleEn: 'Train – The market',
    descAr:  'سكتان: واحدة مسدودة', descFr: 'Deux voies, une seule mène au marché', descEn: 'Two tracks, one leads to the market',
    gradient: 'from-zinc-600 to-slate-800' },
  { level: 9, emoji: '🚕', diffLabel: '⭐⭐⭐',
    titleAr: 'التاكسي – إلى البيت', titleFr: 'Taxi – Rentrer à la maison', titleEn: 'Taxi – Go home',
    descAr:  'شارعان مسدودان، البيت في الأسفل', descFr: 'Deux rues fermées, la maison en bas', descEn: 'Two closed streets, home is down',
    gradient: 'from-amber-400 to-yellow-500' },
  { level: 10, emoji: '🏫', diffLabel: '🏆',
    titleAr: 'التحدي – المدرسة', titleFr: 'Défi – L\'école', titleEn: 'Challenge – School',
    descAr:  'حي صغير، خرفان في الطريق', descFr: 'Un petit quartier, des moutons sur la route', descEn: 'A little neighborhood with sheep',
    gradient: 'from-amber-500 to-orange-600' },
];

function isOnRoad(px: number, py: number, map: LevelMap): boolean {
  if (map.segs.some(s => px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h)) return true;
  return map.circles.some((c) => {
    const d = Math.hypot(px - c.x, py - c.y);
    return d <= c.r && d >= c.innerR;
  });
}

function makeCarTexture(scene: Phaser.Scene, key: string, body: number) {
  const cg = scene.add.graphics();
  cg.fillStyle(0x000000, 0.15); cg.fillEllipse(32, 44, 54, 10);
  cg.fillStyle(body); cg.fillRoundedRect(5, 11, 54, 22, 8);
  cg.fillStyle(0x7dd3fc); cg.fillRoundedRect(19, 4, 26, 16, 5);
  cg.lineStyle(1.5, 0x0ea5e9, 0.9); cg.strokeRoundedRect(19, 4, 26, 16, 5);
  cg.lineStyle(1.5, 0xfca5a5, 0.5); cg.beginPath(); cg.moveTo(32, 11); cg.lineTo(32, 33); cg.strokePath();
  cg.lineStyle(0, 0, 0);
  cg.fillStyle(0x1e293b); cg.fillCircle(16, 33, 10); cg.fillCircle(48, 33, 10);
  cg.fillStyle(0xe2e8f0); cg.fillCircle(16, 33, 5);  cg.fillCircle(48, 33, 5);
  cg.fillStyle(0xfef08a); cg.fillEllipse(59, 16, 8, 5); cg.fillEllipse(59, 26, 8, 5);
  cg.fillStyle(0xff6b6b); cg.fillRect(4, 15, 5, 4); cg.fillRect(4, 23, 5, 4);
  cg.fillStyle(0xfbbf24); cg.fillRect(1, 10, 3, 22); cg.fillRect(60, 10, 3, 22);
  cg.generateTexture(key, 64, 46);
  cg.destroy();
}

function makeBikeTexture(scene: Phaser.Scene, key: string) {
  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.12); g.fillEllipse(32, 42, 40, 8);
  g.lineStyle(3, 0x1e293b); g.strokeCircle(16, 32, 11); g.strokeCircle(48, 32, 11);
  g.lineStyle(3, 0x22c55e);
  g.beginPath(); g.moveTo(16, 32); g.lineTo(30, 18); g.lineTo(46, 18); g.lineTo(48, 32); g.strokePath();
  g.beginPath(); g.moveTo(30, 18); g.lineTo(30, 32); g.lineTo(16, 32); g.strokePath();
  g.lineStyle(3, 0x166534); g.beginPath(); g.moveTo(46, 18); g.lineTo(54, 10); g.strokePath();
  g.fillStyle(0xf97316); g.fillCircle(30, 12, 6);
  g.generateTexture(key, 64, 46);
  g.destroy();
}

function makeMotoTexture(scene: Phaser.Scene, key: string) {
  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.15); g.fillEllipse(32, 42, 48, 8);
  g.fillStyle(0x1e293b); g.fillCircle(16, 34, 9); g.fillCircle(50, 34, 9);
  g.fillStyle(0x94a3b8); g.fillCircle(16, 34, 4); g.fillCircle(50, 34, 4);
  g.fillStyle(0xf97316); g.fillRoundedRect(14, 16, 38, 14, 6);
  g.fillStyle(0x0f172a); g.fillTriangle(44, 16, 58, 12, 56, 22);
  g.fillStyle(0xfef08a); g.fillCircle(50, 14, 4);
  g.fillStyle(0x7dd3fc); g.fillCircle(28, 12, 7);
  g.generateTexture(key, 64, 46);
  g.destroy();
}

function makeTrainTexture(scene: Phaser.Scene, key: string) {
  const g = scene.add.graphics();
  g.fillStyle(0x000000, 0.15); g.fillEllipse(40, 44, 70, 8);
  g.fillStyle(0xdc2626); g.fillRoundedRect(4, 10, 72, 26, 6);
  g.fillStyle(0xfef08a); g.fillRect(62, 14, 10, 10);
  g.fillStyle(0x7dd3fc); g.fillRect(12, 14, 16, 12); g.fillRect(32, 14, 16, 12);
  g.fillStyle(0x1e293b); g.fillCircle(18, 38, 8); g.fillCircle(40, 38, 8); g.fillCircle(62, 38, 8);
  g.fillStyle(0x94a3b8); g.fillCircle(18, 38, 3); g.fillCircle(40, 38, 3); g.fillCircle(62, 38, 3);
  g.fillStyle(0x334155); g.fillRect(8, 2, 10, 10);
  g.fillStyle(0x94a3b8); g.fillCircle(13, 0, 5);
  g.generateTexture(key, 80, 48);
  g.destroy();
}

function drawAlgerianFlag(g: Phaser.GameObjects.Graphics, x: number, y: number, w = 28, h = 18) {
  g.fillStyle(0x006233); g.fillRect(x, y, w / 2, h);
  g.fillStyle(0xffffff); g.fillRect(x + w / 2, y, w / 2, h);
  g.lineStyle(1, 0x111827, 0.5); g.strokeRect(x, y, w, h);
  g.fillStyle(0xd21034);
  g.fillCircle(x + w / 2 + 1, y + h / 2, 5);
  g.fillStyle(0xffffff);
  g.fillCircle(x + w / 2 + 3, y + h / 2, 3.5);
}

function drawSchool(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0x000000, 0.12); g.fillEllipse(x, y + 28, 70, 12);
  g.fillStyle(0xfef3c7); g.fillRect(x - 32, y - 8, 64, 40);
  g.fillStyle(0xdc2626); g.fillTriangle(x - 38, y - 8, x + 38, y - 8, x, y - 40);
  g.fillStyle(0x7dd3fc); g.fillRect(x - 22, y + 2, 12, 12); g.fillRect(x + 10, y + 2, 12, 12);
  g.fillStyle(0x92400e); g.fillRect(x - 8, y + 10, 16, 22);
  drawAlgerianFlag(g, x + 18, y - 52, 18, 12);
  g.fillStyle(0x44403c); g.fillRect(x + 18, y - 52, 2, 28);
}

function drawLibrary(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0x000000, 0.12); g.fillEllipse(x, y + 28, 72, 12);
  g.fillStyle(0x1e3a8a); g.fillRect(x - 34, y - 12, 68, 46);
  g.fillStyle(0xfef3c7); g.fillRect(x - 34, y - 20, 68, 10);
  g.fillStyle(0xfbbf24); g.fillRect(x - 24, y, 8, 18);
  g.fillStyle(0xef4444); g.fillRect(x - 14, y, 8, 18);
  g.fillStyle(0x22c55e); g.fillRect(x - 4, y, 8, 18);
  g.fillStyle(0x7dd3fc); g.fillRect(x + 12, y - 4, 14, 12);
  g.fillStyle(0x92400e); g.fillRect(x + 8, y + 14, 16, 20);
}

function drawHouse(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0x000000, 0.12); g.fillEllipse(x, y + 26, 64, 12);
  g.fillStyle(0xfef3c7); g.fillRect(x - 28, y - 6, 56, 36);
  g.fillStyle(0xb91c1c); g.fillTriangle(x - 34, y - 6, x + 34, y - 6, x, y - 38);
  g.fillStyle(0x7dd3fc); g.fillRect(x - 16, y + 2, 12, 12);
  g.fillStyle(0x92400e); g.fillRect(x + 4, y + 6, 14, 24);
}

function drawClinic(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0x000000, 0.12); g.fillEllipse(x, y + 28, 68, 12);
  g.fillStyle(0xf8fafc); g.fillRect(x - 30, y - 10, 60, 44);
  g.fillStyle(0xef4444); g.fillRect(x - 6, y, 12, 28); g.fillRect(x - 16, y + 8, 32, 12);
  g.fillStyle(0x7dd3fc); g.fillRect(x - 22, y + 6, 10, 10);
}

function drawShop(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0x000000, 0.12); g.fillEllipse(x, y + 26, 66, 12);
  g.fillStyle(0xfef3c7); g.fillRect(x - 28, y - 2, 56, 34);
  g.fillStyle(0xf97316); g.fillRect(x - 32, y - 16, 64, 16);
  g.fillStyle(0x92400e); g.fillRect(x - 8, y + 10, 16, 22);
}

function drawMarket(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0x000000, 0.12); g.fillEllipse(x, y + 22, 62, 10);
  g.fillStyle(0xfbbf24); g.fillTriangle(x - 30, y + 6, x + 30, y + 6, x, y - 26);
  g.fillStyle(0x92400e); g.fillRect(x - 24, y + 6, 48, 18);
  g.fillStyle(0xef4444); g.fillCircle(x - 8, y + 14, 4);
  g.fillStyle(0x22c55e); g.fillCircle(x + 8, y + 14, 4);
}

function drawStation(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0x000000, 0.12); g.fillEllipse(x, y + 26, 70, 12);
  g.fillStyle(0x475569); g.fillRect(x - 32, y - 8, 64, 40);
  g.fillStyle(0xfbbf24); g.fillRect(x - 32, y - 16, 64, 10);
  g.fillStyle(0x7dd3fc); g.fillRect(x - 20, y + 2, 14, 12); g.fillRect(x + 6, y + 2, 14, 12);
  g.fillStyle(0x1e293b); g.fillRect(x - 8, y + 12, 16, 20);
}

function drawGoalBuilding(g: Phaser.GameObjects.Graphics, emoji: string, gx: number, gy: number) {
  const x = gx > 560 ? gx - 82 : gx < 240 ? gx + 82 : gx + (gy > 280 ? 0 : 70);
  const y = (gx > 240 && gx < 560) ? (gy > 280 ? gy - 72 : gy + 58) : gy - 8;
  if (emoji === '🏫') drawSchool(g, x, y);
  else if (emoji === '📚') drawLibrary(g, x, y);
  else if (emoji === '🏠') drawHouse(g, x, y);
  else if (emoji === '🏥') drawClinic(g, x, y);
  else if (emoji === '🏪') drawShop(g, x, y);
  else if (emoji === '🛒') drawMarket(g, x, y);
  else if (emoji === '🚉') drawStation(g, x, y);
}

function drawTrack(rG: Phaser.GameObjects.Graphics, map: LevelMap, track: Track) {
  const fill = track === 'bike' ? 0x4ade80 : track === 'rail' ? 0x78716c : 0x57534e;
  rG.fillStyle(fill);
  for (const s of map.segs) rG.fillRoundedRect(s.x, s.y, s.w, s.h, 12);
  for (const c of map.circles) {
    rG.fillStyle(0x57534e); rG.fillCircle(c.x, c.y, c.r);
    rG.fillStyle(0x86efac); rG.fillCircle(c.x, c.y, c.innerR);
  }

  if (track === 'rail') {
    rG.lineStyle(4, 0x1e293b, 0.95);
    rG.beginPath();
    for (const s of map.segs) {
      if (s.w > s.h) {
        const y1 = s.y + s.h * 0.35, y2 = s.y + s.h * 0.65;
        rG.moveTo(s.x + 8, y1); rG.lineTo(s.x + s.w - 8, y1);
        rG.moveTo(s.x + 8, y2); rG.lineTo(s.x + s.w - 8, y2);
      } else {
        const x1 = s.x + s.w * 0.35, x2 = s.x + s.w * 0.65;
        rG.moveTo(x1, s.y + 8); rG.lineTo(x1, s.y + s.h - 8);
        rG.moveTo(x2, s.y + 8); rG.lineTo(x2, s.y + s.h - 8);
      }
    }
    rG.strokePath();
    rG.fillStyle(0x92400e, 0.7);
    for (const s of map.segs) {
      if (s.w > s.h) {
        for (let x = s.x + 12; x < s.x + s.w - 12; x += 22) rG.fillRect(x, s.y + 10, 8, s.h - 20);
      } else {
        for (let y = s.y + 12; y < s.y + s.h - 12; y += 22) rG.fillRect(s.x + 10, y, s.w - 20, 8);
      }
    }
    return;
  }

  const dash = track === 'bike' ? 0xffffff : 0xfbbf24;
  rG.lineStyle(3, dash, track === 'bike' ? 0.85 : 0.55);
  rG.beginPath();
  for (const s of map.segs) {
    if (s.w > s.h) {
      const y = s.y + s.h / 2;
      for (let x = s.x + 16; x < s.x + s.w - 16; x += 44) {
        rG.moveTo(x, y); rG.lineTo(x + 22, y);
      }
    } else {
      const x = s.x + s.w / 2;
      for (let y = s.y + 16; y < s.y + s.h - 16; y += 44) {
        rG.moveTo(x, y); rG.lineTo(x, y + 22);
      }
    }
  }
  rG.strokePath();
}

export const CarMazeGame: React.FC<CarMazeGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('car_maze', 10);
  const unlocked = Math.min(10, Math.max(maxUnlocked, stars[3] ? 4 : 1, stars[6] ? 7 : 1));
  const [phase, setPhase]       = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef      = useRef<Phaser.Game | null>(null);
  const ctrl         = useRef<Record<Dir, boolean>>({ up: false, down: false, left: false, right: false });
  const onWinRef     = useRef<(s: number) => void>(() => {});
  const onLoseRef    = useRef<() => void>(() => {});

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  onWinRef.current = (s: number) => {
    completeLevel(activeLevel, s);
    setPhase('select');
  };
  onLoseRef.current = () => setPhase('select');

  useEffect(() => {
    if (phase !== 'play' || !containerRef.current) return;

    const cfg = LEVELS[activeLevel - 1];
    const map = cfg.map;
    const ctrlRef = ctrl;
    const W = 800, H = 500;

    const labels = {
      win:    t('🎉 أحسنت! بطل! 🏆', '🎉 Bravo ! Champion ! 🏆', '🎉 You did it! 🏆'),
      start:  t('🚪 ابدأ',    '🚪 Départ',  '🚪 Start'),
      finish: t(cfg.finishAr, cfg.finishFr, cfg.finishEn),
      timeUp: t('⏰ انتهى الوقت! 😅', '⏰ Temps écoulé ! 😅', '⏰ Time\'s up! 😅'),
      hole:   t('أوبا! حفرة!', 'Oups ! Nid-de-poule !', 'Oops! Pothole!'),
      taxi:   t('بيب بيب! تاكسي!', 'Bip bip ! Taxi !', 'Beep beep! Taxi!'),
      sheep:  t('خروف يعبر!', 'Mouton qui traverse !', 'Sheep crossing!'),
      cat:    t('قطة!', 'Un chat !', 'A cat!'),
      rails:  t('على السكة!', 'Sur les rails !', 'On the rails!'),
    };

    class RoadScene extends Phaser.Scene {
      private car!: Phaser.Physics.Arcade.Sprite;
      private keys?: Phaser.Types.Input.Keyboard.CursorKeys;
      private done = false;
      private timerSecs: number;
      private timerText: Phaser.GameObjects.Text | null = null;
      private timerEvent: Phaser.Time.TimerEvent | null = null;
      private slowUntil = 0;
      private hitHoles = new Set<number>();
      private movers: { obj: Phaser.GameObjects.GameObject & { x: number; y: number; setFlipX?: (v: boolean) => void }; dir: number; p: Patrol }[] = [];
      private parked?: Phaser.GameObjects.Image;
      private lastRoad = { x: map.start.x, y: map.start.y };
      private bumpCd = 0;
      private wasMoving = false;

      constructor() {
        super({ key: 'RoadScene' });
        this.timerSecs = cfg.timerSecs ?? 0;
      }

      create() {
        const bgG = this.add.graphics();
        bgG.fillStyle(cfg.track === 'bike' ? 0xa7f3d0 : cfg.track === 'rail' ? 0xcbd5e1 : 0xc4a574);
        bgG.fillRect(0, 0, W, H);
        bgG.fillStyle(0xb8956a, 0.35);
        for (let gx = 18; gx < W; gx += 28)
          for (let gy = 18; gy < H; gy += 28)
            if ((Math.floor(gx / 28) + Math.floor(gy / 28)) % 4 === 0)
              bgG.fillCircle(gx, gy, 7);

        const rG = this.add.graphics();
        drawTrack(rG, map, cfg.track);

        for (const c of map.circles) {
          rG.fillStyle(0x38bdf8, 0.85); rG.fillCircle(c.x, c.y, Math.max(8, c.innerR - 8));
          drawAlgerianFlag(rG, c.x - 10, c.y - 28, 22, 14);
          rG.fillStyle(0x78716c); rG.fillRect(c.x - 1, c.y - 28, 2, 28);
        }

        const holeG = this.add.graphics().setDepth(2);
        map.potholes.forEach((p) => {
          holeG.fillStyle(0x1c1917, 0.88); holeG.fillEllipse(p.x, p.y, 34, 22);
          holeG.fillStyle(0x44403c, 0.7); holeG.fillEllipse(p.x - 3, p.y - 2, 16, 10);
        });

        const dG = this.add.graphics();
        const palm = (tx: number, ty: number) => {
          dG.fillStyle(0x92400e); dG.fillRect(tx - 4, ty - 8, 8, 28);
          dG.fillStyle(0x166534);
          for (let i = 0; i < 6; i++) {
            const a = -Math.PI / 2 + (i - 2.5) * 0.45;
            dG.fillTriangle(tx, ty - 10, tx + Math.cos(a) * 22, ty - 10 + Math.sin(a) * 16, tx + Math.cos(a + 0.3) * 10, ty - 8);
          }
          dG.fillStyle(0x4ade80); dG.fillCircle(tx, ty - 12, 6);
        };
        map.palms.forEach((p) => palm(p.x, p.y));

        drawGoalBuilding(dG, map.goalEmoji, map.goal.x, map.goal.y);
        map.deadEnds.forEach((d) => {
          this.add.text(d.x, d.y, d.emoji, { fontSize: '34px' }).setOrigin(0.5).setDepth(4);
        });
        drawAlgerianFlag(dG, map.start.x + 36, map.start.y - 58, 26, 16);
        dG.fillStyle(0x44403c); dG.fillRect(map.start.x + 36, map.start.y - 58, 2, 36);

        const sx = map.start.x, sy = map.start.y;
        dG.fillStyle(0xf8fafc); dG.fillRect(sx - 26, sy - 28, 52, 34);
        dG.fillStyle(0xd6d3d1); dG.fillRect(sx - 28, sy - 34, 56, 8);
        dG.fillStyle(0x1d4ed8); dG.fillRect(sx - 8, sy - 12, 16, 18);
        dG.fillStyle(0x7dd3fc); dG.fillRect(sx - 20, sy - 20, 10, 10); dG.fillRect(sx + 10, sy - 20, 10, 10);
        this.add.text(sx, sy + 16, labels.start, {
          fontSize: '12px', color: '#1e3a8a', fontStyle: 'bold',
          backgroundColor: '#e0f2fe', padding: { x: 5, y: 2 },
        }).setOrigin(0.5);

        const gx = map.goal.x, gy = map.goal.y;
        const starTxt = this.add.text(gx, gy - 44, map.goalEmoji, { fontSize: '40px' }).setOrigin(0.5).setDepth(4);
        this.tweens.add({ targets: starTxt, y: gy - 58, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });
        this.add.text(gx, gy + 16, labels.finish, {
          fontSize: '12px', color: '#fef9c3', fontStyle: 'bold',
          backgroundColor: '#14532d', padding: { x: 5, y: 2 },
        }).setOrigin(0.5);

        if (cfg.vehicle === 'bike') makeBikeTexture(this, 'player_tex');
        else if (cfg.vehicle === 'moto') makeMotoTexture(this, 'player_tex');
        else if (cfg.vehicle === 'train') makeTrainTexture(this, 'player_tex');
        else if (cfg.vehicle === 'taxi') makeCarTexture(this, 'player_tex', 0xfacc15);
        else makeCarTexture(this, 'player_tex', 0xef4444);
        makeCarTexture(this, 'taxi_tex', 0xfacc15);

        this.car = this.physics.add.sprite(map.start.x, map.start.y, 'player_tex');
        this.car.setCollideWorldBounds(true).setDepth(6).setOrigin(0.5, 0.5);

        if (map.parkedTaxi) {
          this.parked = this.add.image(map.parkedTaxi.x, map.parkedTaxi.y, 'taxi_tex').setDepth(5).setAngle(map.parkedTaxi.angle);
          this.add.text(map.parkedTaxi.x, map.parkedTaxi.y - 28, 'TAXI', {
            fontSize: '10px', color: '#111827', fontStyle: 'bold', backgroundColor: '#facc15', padding: { x: 3, y: 1 },
          }).setOrigin(0.5).setDepth(5);
        }

        map.patrols.forEach((p) => {
          if (p.kind === 'taxi') {
            const img = this.add.image(p.minX, p.y, 'taxi_tex').setDepth(5);
            this.movers.push({ obj: img, dir: 1, p });
          } else {
            const em = p.kind === 'sheep' ? '🐑' : '🐱';
            const txt = this.add.text(p.minX, p.y, em, { fontSize: '36px' }).setOrigin(0.5).setDepth(5);
            this.movers.push({ obj: txt, dir: 1, p });
          }
        });

        if (this.input.keyboard) this.keys = this.input.keyboard.createCursorKeys();

        const vLabel = cfg.vehicle === 'bike' ? '🚲' : cfg.vehicle === 'moto' ? '🏍️' : cfg.vehicle === 'train' ? '🚂' : cfg.vehicle === 'taxi' ? '🚕' : '🚗';
        this.add.text(W / 2, 14,
          `${vLabel}  ${t(`م${activeLevel}`, `N${activeLevel}`, `L${activeLevel}`)}`, {
          fontSize: '16px', color: '#fef08a', fontStyle: 'bold',
          backgroundColor: '#0f172a', padding: { x: 10, y: 4 },
        }).setOrigin(0.5, 0).setDepth(10);

        if (cfg.timerSecs !== null) {
          this.timerText = this.add.text(W - 14, 14, `⏱️ ${this.timerSecs}s`, {
            fontSize: '18px', color: '#fef08a', fontStyle: 'bold',
            backgroundColor: '#0f172a', padding: { x: 8, y: 4 },
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
                this.car.setVelocity(0);
                this.cameras.main.flash(400, 255, 80, 80);
                const p = this.add.graphics().setDepth(30);
                p.fillStyle(0x0f172a, 0.92); p.fillRoundedRect(160, 185, 480, 120, 20);
                p.lineStyle(3, 0xf87171); p.strokeRoundedRect(160, 185, 480, 120, 20);
                this.add.text(400, 245, labels.timeUp, {
                  fontSize: '28px', color: '#f87171', fontStyle: 'bold',
                }).setOrigin(0.5).setDepth(31);
                this.time.delayedCall(1800, () => onLoseRef.current());
              }
            },
          });
        }
      }

      private bumpHint(msg: string, sfx?: 'thud' | 'sheep' | 'cat' | 'honk' | 'rails') {
        if (this.time.now < this.bumpCd) return;
        this.bumpCd = this.time.now + 900;
        if (sfx === 'thud') playPotholeThud();
        else if (sfx === 'sheep') playSheepBaa();
        else if (sfx === 'cat') playCatMeow();
        else if (sfx === 'honk' || sfx === 'rails') playVehicleStart(sfx === 'rails' ? 'train' : 'taxi');
        const tip = this.add.text(this.car.x, this.car.y - 42, msg, {
          fontSize: '14px', color: '#fef08a', fontStyle: 'bold',
          backgroundColor: '#0f172a', padding: { x: 6, y: 3 },
        }).setOrigin(0.5).setDepth(20);
        this.tweens.add({ targets: tip, y: tip.y - 28, alpha: 0, duration: 800, onComplete: () => tip.destroy() });
      }

      private celebrate() {
        this.done = true;
        stopMotionAudio();
        if (this.timerEvent) this.timerEvent.destroy();
        this.car.setVelocity(0);
        playSuccessChime();

        let earnedStars = 3;
        if (cfg.timerSecs !== null) {
          earnedStars = this.timerSecs > cfg.timerSecs * 0.5 ? 3
                      : this.timerSecs > cfg.timerSecs * 0.2 ? 2
                      : 1;
        }

        this.cameras.main.flash(700, 255, 240, 0);
        ['🎉', '⭐', map.goalEmoji, '✨', '🇩🇿', '🥳'].forEach((em, i) => {
          this.time.delayedCall(i * 110, () => {
            const tx = this.add.text(
              Phaser.Math.Between(150, 650), Phaser.Math.Between(150, 370), em, { fontSize: '38px' }
            ).setDepth(32).setAlpha(0);
            this.tweens.add({ targets: tx, alpha: 1, y: tx.y - 130, duration: 1600, ease: 'Quad.easeOut',
              onComplete: () => { this.tweens.add({ targets: tx, alpha: 0, duration: 600 }); } });
          });
        });

        const starsStr = '★'.repeat(earnedStars) + '☆'.repeat(3 - earnedStars);
        const panel = this.add.graphics().setDepth(30);
        panel.fillStyle(0x0f172a, 0.94); panel.fillRoundedRect(140, 175, 520, 145, 22);
        panel.lineStyle(3, 0xfbbf24); panel.strokeRoundedRect(140, 175, 520, 145, 22);

        const wt = this.add.text(400, 230, labels.win, {
          fontSize: '28px', color: '#fef08a', fontStyle: 'bold',
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
        if (this.done) { this.car.setVelocity(0); stopMotionAudio(); return; }

        const U = this.keys?.up.isDown    || ctrlRef.current.up;
        const D = this.keys?.down.isDown  || ctrlRef.current.down;
        const L = this.keys?.left.isDown  || ctrlRef.current.left;
        const R = this.keys?.right.isDown || ctrlRef.current.right;
        const moving = !!(U || D || L || R);
        if (moving) {
          if (!this.wasMoving) playVehicleStart(cfg.vehicle as TownVehicleKind);
          setTownMoving(cfg.vehicle as TownVehicleKind, true);
        } else {
          setTownMoving(cfg.vehicle as TownVehicleKind, false);
        }
        this.wasMoving = moving;

        const onRoad = isOnRoad(this.car.x, this.car.y, map);
        if (onRoad) this.lastRoad = { x: this.car.x, y: this.car.y };

        if (!onRoad && cfg.vehicle === 'train') {
          this.car.setPosition(this.lastRoad.x, this.lastRoad.y);
          this.car.setVelocity(0);
          this.bumpHint(labels.rails, 'rails');
          return;
        }

        const slowed = this.time.now < this.slowUntil;
        const offSpeed = cfg.vehicle === 'moto' ? 22 : cfg.vehicle === 'bike' ? 48 : 38;
        const speed  = !onRoad ? offSpeed : slowed ? cfg.speed * 0.45 : cfg.speed;

        this.car.setVelocity(0);
        if (L) { this.car.setVelocityX(-speed); this.car.setAngle(180); }
        else if (R) { this.car.setVelocityX(speed); this.car.setAngle(0); }
        if (U) { this.car.setVelocityY(-speed); this.car.setAngle(-90); }
        else if (D) { this.car.setVelocityY(speed); this.car.setAngle(90); }

        if (!onRoad && (U || D || L || R)) {
          this.car.setAngle(this.car.angle + (Math.random() - 0.5) * 6);
        }

        map.potholes.forEach((p, i) => {
          if (this.hitHoles.has(i)) return;
          if (Phaser.Math.Distance.Between(this.car.x, this.car.y, p.x, p.y) < 22) {
            this.hitHoles.add(i);
            this.slowUntil = this.time.now + 650;
            this.cameras.main.shake(180, 0.006);
            this.tweens.add({ targets: this.car, y: this.car.y - 10, yoyo: true, duration: 120 });
            this.bumpHint(labels.hole, 'thud');
          }
        });

        map.deadEnds.forEach((d) => {
          if (Phaser.Math.Distance.Between(this.car.x, this.car.y, d.x, d.y) < 40) {
            this.car.x += this.car.x > d.x ? 10 : -10;
            this.car.y += this.car.y > d.y ? 8 : -8;
            this.bumpHint(t(d.hintAr, d.hintFr, d.hintEn), 'thud');
          }
        });

        const dt = delta / 1000;
        this.movers.forEach((m) => {
          m.obj.x += m.dir * m.p.speed * dt;
          if (m.obj.x > m.p.maxX || m.obj.x < m.p.minX) m.dir *= -1;
          m.obj.setFlipX?.(m.dir < 0);
          const hitR = m.p.kind === 'taxi' ? 32 : 28;
          if (Phaser.Math.Distance.Between(this.car.x, this.car.y, m.obj.x, m.obj.y) < hitR) {
            this.slowUntil = this.time.now + 400;
            this.car.x += this.car.x > m.obj.x ? 8 : -8;
            this.bumpHint(
              m.p.kind === 'taxi' ? labels.taxi : m.p.kind === 'sheep' ? labels.sheep : labels.cat,
              m.p.kind === 'taxi' ? 'honk' : m.p.kind === 'sheep' ? 'sheep' : 'cat',
            );
          }
        });

        if (this.parked && Phaser.Math.Distance.Between(this.car.x, this.car.y, this.parked.x, this.parked.y) < 38) {
          this.slowUntil = this.time.now + 400;
          this.car.x += this.car.x > this.parked.x ? 8 : -8;
          this.bumpHint(labels.taxi, 'honk');
        }

        if (Phaser.Math.Distance.Between(this.car.x, this.car.y, map.goal.x, map.goal.y) < 44) {
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
      scene: [RoadScene],
    });

    return () => { stopMotionAudio(); gameRef.current?.destroy(true); };
  }, [phase, activeLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  const dBtn = (icon: string, dir: Dir) => (
    <motion.button
      key={dir}
      whileTap={{ scale: 0.9 }}
      className="w-16 h-16 rounded-2xl bg-indigo-800/90 hover:bg-indigo-700 active:bg-indigo-600
                 text-3xl flex items-center justify-center select-none border-2 border-indigo-500/50
                 shadow-lg shadow-indigo-900/50 cursor-pointer touch-none"
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
        gameTitle={t('فِي المَدِينَة', 'En ville', 'In town')}
        gameIcon="🚦"
        language={language}
        onExit={onExit ?? (() => {})}
        onSelectLevel={lvl => { setLevel(lvl); setPhase('play'); }}
        levels={LEVEL_DEFS.map(d => ({
          ...d,
          unlocked: d.level <= unlocked,
          earnedStars: stars[d.level] ?? 0,
        }))}
      />
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-5 bg-slate-950 p-4 sm:p-6 rounded-3xl min-h-screen justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPhase('select')}
        className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white text-slate-900 font-black
                   px-4 py-2 rounded-2xl shadow-lg border-2 border-amber-300 cursor-pointer
                   flex items-center gap-2 text-sm"
      >
        🚪 {t('خروج', 'Retour', 'Back')}
      </motion.button>

      <div
        ref={containerRef}
        className="w-full max-w-4xl aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400"
      />

      <div className="flex flex-col items-center gap-2" dir="ltr">
        <div className="flex justify-center">{dBtn('⬆️', 'up')}</div>
        <div className="flex gap-2 items-center">
          {dBtn('⬅️', 'left')}
          <div className="w-16 h-16 rounded-2xl bg-slate-800/40 border-2 border-slate-700/30" />
          {dBtn('➡️', 'right')}
        </div>
        <div className="flex justify-center">{dBtn('⬇️', 'down')}</div>
      </div>

      <p className="text-xs text-slate-500 font-bold">
        {t('🎮 استخدم أسهم لوحة المفاتيح أو الأزرار أعلاه',
           '🎮 Flèches clavier ou boutons ci-dessus',
           '🎮 Arrow keys or buttons above')}
      </p>
    </div>
  );
};

export default CarMazeGame;

/**
 * CarMazeGame.tsx  —  Jeu de voiture pour 3-5 ans
 * 3 parcours vraiment différents : L1 quartier calme, L2 rond-point + nids-de-poule + taxi jaune,
 * L3 labyrinthe avec moutons qui traversent (scène de rue algérienne).
 */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';

export interface CarMazeGameProps {
  onExit?: () => void;
  language?: 'ar' | 'fr' | 'en';
}

type Dir = 'up' | 'down' | 'left' | 'right';

interface RoadSeg { x: number; y: number; w: number; h: number }
interface RoadCircle { x: number; y: number; r: number; innerR: number }
interface LevelMap {
  segs: RoadSeg[];
  circles: RoadCircle[];
  start: { x: number; y: number };
  goal: { x: number; y: number };
  potholes: { x: number; y: number }[];
  parkedTaxi: { x: number; y: number; angle: number } | null;
  movingTaxi: { y: number; minX: number; maxX: number; speed: number } | null;
  sheep: { y: number; minX: number; maxX: number; speed: number } | null;
}

interface CarLevelCfg {
  speed: number;
  timerSecs: number | null;
  map: LevelMap;
}

const MAP_L1: LevelMap = {
  segs: [
    { x: 50,  y: 50,  w: 700, h: 110 },
    { x: 640, y: 50,  w: 110, h: 400 },
    { x: 50,  y: 340, w: 700, h: 110 },
  ],
  circles: [],
  start: { x: 105, y: 105 },
  goal: { x: 105, y: 395 },
  potholes: [],
  parkedTaxi: null,
  movingTaxi: null,
  sheep: null,
};

const MAP_L2: LevelMap = {
  segs: [
    { x: 40,  y: 40,  w: 720, h: 90 },
    { x: 670, y: 40,  w: 90,  h: 420 },
    { x: 40,  y: 370, w: 720, h: 90 },
    { x: 40,  y: 40,  w: 90,  h: 420 },
    { x: 310, y: 210, w: 180, h: 80 },
    { x: 360, y: 160, w: 80,  h: 180 },
  ],
  circles: [{ x: 400, y: 250, r: 92, innerR: 28 }],
  start: { x: 85, y: 85 },
  goal: { x: 715, y: 415 },
  potholes: [
    { x: 260, y: 85 },
    { x: 520, y: 85 },
    { x: 715, y: 220 },
    { x: 400, y: 415 },
  ],
  parkedTaxi: { x: 715, y: 180, angle: 90 },
  movingTaxi: null,
  sheep: null,
};

const MAP_L3: LevelMap = {
  segs: [
    { x: 40,  y: 40,  w: 520, h: 90 },
    { x: 470, y: 40,  w: 90,  h: 180 },
    { x: 180, y: 160, w: 380, h: 90 },
    { x: 180, y: 160, w: 90,  h: 200 },
    { x: 180, y: 280, w: 540, h: 90 },
    { x: 640, y: 280, w: 90,  h: 180 },
    { x: 40,  y: 370, w: 690, h: 90 },
  ],
  circles: [],
  start: { x: 90, y: 85 },
  goal: { x: 90, y: 415 },
  potholes: [
    { x: 280, y: 85 },
    { x: 400, y: 205 },
    { x: 520, y: 325 },
    { x: 360, y: 415 },
  ],
  parkedTaxi: null,
  movingTaxi: { y: 205, minX: 230, maxX: 520, speed: 70 },
  sheep: { y: 415, minX: 180, maxX: 580, speed: 40 },
};

const LEVELS: CarLevelCfg[] = [
  { speed: 165, timerSecs: null, map: MAP_L1 },
  { speed: 185, timerSecs: 90,   map: MAP_L2 },
  { speed: 210, timerSecs: 70,   map: MAP_L3 },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🏠', diffLabel: '⭐',
    titleAr: 'سهل – جولة في الحي', titleFr: 'Facile – Tour du quartier', titleEn: 'Easy – Neighborhood ride',
    descAr:  'قُد بهدوء حتى المسجد', descFr: 'Conduis jusqu\'à la mosquée', descEn: 'Drive calmly to the mosque',
    gradient: 'from-blue-500 to-indigo-600' },
  { level: 2, emoji: '🚕', diffLabel: '⭐⭐',
    titleAr: 'متوسط – احذر الحفر!', titleFr: 'Moyen – Nids-de-poule !', titleEn: 'Medium – Watch the potholes!',
    descAr:  'روند بوان وحفر وتاكسي أصفر', descFr: 'Rond-point, nids-de-poule et taxi jaune', descEn: 'Roundabout, potholes and yellow taxi',
    gradient: 'from-indigo-500 to-violet-600' },
  { level: 3, emoji: '🐑', diffLabel: '🏆',
    titleAr: 'التحدي – الخرفان تعبر!', titleFr: 'Défi – Les moutons traversent !', titleEn: 'Challenge – Sheep crossing!',
    descAr:  'تاكسي يتحرك وخرفان في الطريق', descFr: 'Taxi en mouvement et moutons sur la route', descEn: 'Moving taxi and sheep on the road',
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

function drawAlgerianFlag(g: Phaser.GameObjects.Graphics, x: number, y: number, w = 28, h = 18) {
  g.fillStyle(0x006233); g.fillRect(x, y, w / 2, h);
  g.fillStyle(0xffffff); g.fillRect(x + w / 2, y, w / 2, h);
  g.lineStyle(1, 0x111827, 0.5); g.strokeRect(x, y, w, h);
  g.fillStyle(0xd21034);
  g.fillCircle(x + w / 2 + 1, y + h / 2, 5);
  g.fillStyle(0xffffff);
  g.fillCircle(x + w / 2 + 3, y + h / 2, 3.5);
}

function drawMosque(g: Phaser.GameObjects.Graphics, x: number, y: number) {
  g.fillStyle(0xfef3c7); g.fillRect(x - 28, y - 18, 56, 36);
  g.fillStyle(0xd6b36a); g.fillRect(x - 28, y + 14, 56, 6);
  g.fillStyle(0x16a34a); g.fillCircle(x, y - 22, 18);
  g.fillStyle(0xfef3c7); g.fillRect(x + 18, y - 48, 8, 42);
  g.fillStyle(0x16a34a); g.fillTriangle(x + 16, y - 48, x + 28, y - 48, x + 22, y - 60);
  g.fillStyle(0x92400e); g.fillRect(x - 8, y - 4, 16, 24);
  g.fillStyle(0x7dd3fc, 0.7); g.fillCircle(x - 16, y - 2, 5); g.fillCircle(x + 16, y - 2, 5);
}

export const CarMazeGame: React.FC<CarMazeGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('car_maze', 3);
  const [phase, setPhase]       = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef      = useRef<Phaser.Game | null>(null);
  const ctrl         = useRef<Record<Dir, boolean>>({ up: false, down: false, left: false, right: false });
  const onWinRef     = useRef<(s: number) => void>(() => {});

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  onWinRef.current = (s: number) => {
    completeLevel(activeLevel, s);
    setPhase('select');
  };

  useEffect(() => {
    if (phase !== 'play' || !containerRef.current) return;

    const cfg = LEVELS[activeLevel - 1];
    const map = cfg.map;
    const ctrlRef = ctrl;
    const W = 800, H = 500;

    const labels = {
      win:    t('🎉 أحسنت! بطل! 🏆', '🎉 Bravo ! Champion ! 🏆', '🎉 You did it! 🏆'),
      start:  t('🏠 ابدأ',    '🏠 Départ',  '🏠 Start'),
      finish: t('🕌 المسجد', '🕌 Mosquée', '🕌 Mosque'),
      timeUp: t('⏰ انتهى الوقت! 😅', '⏰ Temps écoulé ! 😅', '⏰ Time\'s up! 😅'),
      hole:   t('أوبا! حفرة!', 'Oups ! Nid-de-poule !', 'Oops! Pothole!'),
      taxi:   t('بيب بيب! تاكسي!', 'Bip bip ! Taxi !', 'Beep beep! Taxi!'),
      sheep:  t('خروف يعبر!', 'Mouton qui traverse !', 'Sheep crossing!'),
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
      private taxi?: Phaser.GameObjects.Image;
      private taxiDir = 1;
      private sheep?: Phaser.GameObjects.Text;
      private sheepDir = 1;
      private bumpCd = 0;

      constructor() {
        super({ key: 'RoadScene' });
        this.timerSecs = cfg.timerSecs ?? 0;
      }

      create() {
        // Dusty Algerian sidewalk + palms instead of a generic lawn
        const bgG = this.add.graphics();
        bgG.fillStyle(0xc4a574);
        bgG.fillRect(0, 0, W, H);
        bgG.fillStyle(0xb8956a, 0.45);
        for (let gx = 18; gx < W; gx += 28)
          for (let gy = 18; gy < H; gy += 28)
            if ((Math.floor(gx / 28) + Math.floor(gy / 28)) % 4 === 0)
              bgG.fillCircle(gx, gy, 7);

        const rG = this.add.graphics();
        rG.fillStyle(0x57534e);
        for (const s of map.segs) rG.fillRoundedRect(s.x, s.y, s.w, s.h, 12);
        for (const c of map.circles) {
          rG.fillStyle(0x57534e); rG.fillCircle(c.x, c.y, c.r);
          rG.fillStyle(0x86efac); rG.fillCircle(c.x, c.y, c.innerR);
        }
        rG.lineStyle(3, 0xfbbf24, 0.55);
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

        // Roundabout fountain + mini flag
        for (const c of map.circles) {
          rG.fillStyle(0x38bdf8, 0.85); rG.fillCircle(c.x, c.y, Math.max(8, c.innerR - 8));
          drawAlgerianFlag(rG, c.x - 10, c.y - 28, 22, 14);
          rG.fillStyle(0x78716c); rG.fillRect(c.x - 1, c.y - 28, 2, 28);
        }

        // Potholes — the classic Algerian street gag
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
        [[150, 230], [310, 230], [490, 230], [150, 20], [430, 18], [760, 20], [760, 478], [430, 478], [200, 478]].forEach(([tx, ty]) => palm(tx, ty));

        drawMosque(dG, map.goal.x + (activeLevel === 2 ? -70 : 70), map.goal.y - 10);
        drawAlgerianFlag(dG, map.start.x + 36, map.start.y - 58, 26, 16);
        dG.fillStyle(0x44403c); dG.fillRect(map.start.x + 36, map.start.y - 58, 2, 36);

        // White house with blue shutters at the start
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
        const starTxt = this.add.text(gx, gy - 44, '🕌', { fontSize: '40px' }).setOrigin(0.5).setDepth(4);
        this.tweens.add({ targets: starTxt, y: gy - 58, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });
        this.add.text(gx, gy + 16, labels.finish, {
          fontSize: '12px', color: '#fef9c3', fontStyle: 'bold',
          backgroundColor: '#14532d', padding: { x: 5, y: 2 },
        }).setOrigin(0.5);

        makeCarTexture(this, 'car_tex', 0xef4444);
        makeCarTexture(this, 'taxi_tex', 0xfacc15);

        this.car = this.physics.add.sprite(map.start.x, map.start.y, 'car_tex');
        this.car.setCollideWorldBounds(true).setDepth(6).setOrigin(0.5, 0.5);

        if (map.parkedTaxi) {
          const tx = this.add.image(map.parkedTaxi.x, map.parkedTaxi.y, 'taxi_tex').setDepth(5).setAngle(map.parkedTaxi.angle);
          this.taxi = tx;
          this.add.text(map.parkedTaxi.x, map.parkedTaxi.y - 28, 'TAXI', {
            fontSize: '10px', color: '#111827', fontStyle: 'bold', backgroundColor: '#facc15', padding: { x: 3, y: 1 },
          }).setOrigin(0.5).setDepth(5);
        }
        if (map.movingTaxi) {
          this.taxi = this.add.image(map.movingTaxi.minX, map.movingTaxi.y, 'taxi_tex').setDepth(5);
        }
        if (map.sheep) {
          this.sheep = this.add.text(map.sheep.minX, map.sheep.y, '🐑', { fontSize: '36px' }).setOrigin(0.5).setDepth(5);
        }

        if (this.input.keyboard) this.keys = this.input.keyboard.createCursorKeys();

        this.add.text(W / 2, 14,
          t(`م${activeLevel}`, `N${activeLevel}`, `L${activeLevel}`), {
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
                this.car.setVelocity(0);
                this.cameras.main.flash(400, 255, 80, 80);
                const p = this.add.graphics().setDepth(30);
                p.fillStyle(0x0f172a, 0.92); p.fillRoundedRect(160, 185, 480, 120, 20);
                p.lineStyle(3, 0xf87171); p.strokeRoundedRect(160, 185, 480, 120, 20);
                this.add.text(400, 245, labels.timeUp, {
                  fontSize: '28px', color: '#f87171', fontStyle: 'bold',
                }).setOrigin(0.5).setDepth(31);
                this.time.delayedCall(1800, () => onWinRef.current(1));
              }
            },
          });
        }
      }

      private bumpHint(msg: string) {
        if (this.time.now < this.bumpCd) return;
        this.bumpCd = this.time.now + 900;
        const tip = this.add.text(this.car.x, this.car.y - 42, msg, {
          fontSize: '14px', color: '#fef08a', fontStyle: 'bold',
          backgroundColor: '#0f172a', padding: { x: 6, y: 3 },
        }).setOrigin(0.5).setDepth(20);
        this.tweens.add({ targets: tip, y: tip.y - 28, alpha: 0, duration: 800, onComplete: () => tip.destroy() });
      }

      private celebrate() {
        this.done = true;
        if (this.timerEvent) this.timerEvent.destroy();
        this.car.setVelocity(0);

        let earnedStars = 3;
        if (cfg.timerSecs !== null) {
          earnedStars = this.timerSecs > cfg.timerSecs * 0.5 ? 3
                      : this.timerSecs > cfg.timerSecs * 0.2 ? 2
                      : 1;
        }

        this.cameras.main.flash(700, 255, 240, 0);
        ['🎉', '⭐', '🚕', '🕌', '✨', '🇩🇿', '🥳', '🐑'].forEach((em, i) => {
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
        if (this.done) { this.car.setVelocity(0); return; }

        const onRoad = isOnRoad(this.car.x, this.car.y, map);
        const slowed = this.time.now < this.slowUntil;
        const speed  = !onRoad ? 38 : slowed ? cfg.speed * 0.45 : cfg.speed;

        const U = this.keys?.up.isDown    || ctrlRef.current.up;
        const D = this.keys?.down.isDown  || ctrlRef.current.down;
        const L = this.keys?.left.isDown  || ctrlRef.current.left;
        const R = this.keys?.right.isDown || ctrlRef.current.right;

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
            this.bumpHint(labels.hole);
          }
        });

        const dt = delta / 1000;
        if (this.taxi && map.movingTaxi) {
          this.taxi.x += this.taxiDir * map.movingTaxi.speed * dt;
          if (this.taxi.x > map.movingTaxi.maxX || this.taxi.x < map.movingTaxi.minX) this.taxiDir *= -1;
          this.taxi.setFlipX(this.taxiDir < 0);
        }
        if (this.taxi && Phaser.Math.Distance.Between(this.car.x, this.car.y, this.taxi.x, this.taxi.y) < 38) {
          this.slowUntil = this.time.now + 400;
          this.car.x += this.car.x > this.taxi.x ? 8 : -8;
          this.bumpHint(labels.taxi);
        }
        if (this.sheep && map.sheep) {
          this.sheep.x += this.sheepDir * map.sheep.speed * dt;
          if (this.sheep.x > map.sheep.maxX || this.sheep.x < map.sheep.minX) this.sheepDir *= -1;
          this.sheep.setFlipX(this.sheepDir < 0);
          if (Phaser.Math.Distance.Between(this.car.x, this.car.y, this.sheep.x, this.sheep.y) < 36) {
            this.slowUntil = this.time.now + 500;
            this.bumpHint(labels.sheep);
          }
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

    return () => { gameRef.current?.destroy(true); };
  }, [phase, activeLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  const dBtn = (icon: string, dir: Dir) => (
    <button
      key={dir}
      className="w-16 h-16 rounded-2xl bg-indigo-800/90 hover:bg-indigo-700 active:scale-90 active:bg-indigo-600
                 text-3xl flex items-center justify-center select-none border-2 border-indigo-500/50
                 shadow-lg shadow-indigo-900/50 cursor-pointer touch-none transition-all duration-75"
      onPointerDown={e => { e.preventDefault(); ctrl.current[dir] = true; }}
      onPointerUp={e => { e.preventDefault(); ctrl.current[dir] = false; }}
      onPointerLeave={e => { e.preventDefault(); ctrl.current[dir] = false; }}
    >
      {icon}
    </button>
  );

  if (phase === 'select') {
    return (
      <LevelSelectScreen
        gameTitle={t('سيارة في المدينة', 'Voiture en Ville', 'City Car Drive')}
        gameIcon="🚗"
        language={language}
        onExit={onExit ?? (() => {})}
        onSelectLevel={lvl => { setLevel(lvl); setPhase('play'); }}
        levels={LEVEL_DEFS.map(d => ({
          ...d,
          unlocked: d.level <= maxUnlocked,
          earnedStars: stars[d.level] ?? 0,
        }))}
      />
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-5 bg-slate-950 p-4 sm:p-6 rounded-3xl min-h-screen justify-center">
      <button
        onClick={() => setPhase('select')}
        className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white text-slate-900 font-black
                   px-4 py-2 rounded-2xl shadow-lg border-2 border-amber-300 cursor-pointer
                   flex items-center gap-2 text-sm transition-all"
      >
        🚪 {t('خروج', 'Retour', 'Back')}
      </button>

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

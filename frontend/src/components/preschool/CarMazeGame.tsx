/**
 * CarMazeGame.tsx  —  Jeu de voiture pour 3-5 ans
 * 3 niveaux : L1 promenade libre, L2 contre-la-montre 90 s, L3 défi 55 s.
 * Utilise le même système LevelSelectScreen + useLevelProgress que les autres mini-jeux.
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

// ─── Level configs ────────────────────────────────────────────────────────────
interface CarLevelCfg {
  speed: number;
  timerSecs: number | null;
}
const LEVELS: CarLevelCfg[] = [
  { speed: 165, timerSecs: null },
  { speed: 205, timerSecs: 90  },
  { speed: 240, timerSecs: 55  },
];
const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🚗', diffLabel: '⭐',
    titleAr: 'سهل – قيادة حرة',           titleFr: 'Facile – Conduite libre',           titleEn: 'Easy – Free Drive',
    descAr:  'قُد بهدوء حتى تصل للنجمة', descFr:  'Conduis calmement jusqu\'à l\'étoile', descEn: 'Drive calmly to the star',
    gradient: 'from-blue-500 to-indigo-600' },
  { level: 2, emoji: '🚗💨', diffLabel: '⭐⭐',
    titleAr: 'متوسط – 90 ثانية',           titleFr: 'Moyen – 90 secondes',                titleEn: 'Medium – 90 seconds',
    descAr:  'سيارة أسرع والوقت ينفد!',   descFr:  'Voiture rapide, le temps presse !',   descEn: 'Faster car, time is ticking!',
    gradient: 'from-indigo-500 to-violet-600' },
  { level: 3, emoji: '🏆', diffLabel: '🏆',
    titleAr: 'التحدي – 55 ثانية!',         titleFr: 'Défi – 55 secondes !',               titleEn: 'Challenge – 55 seconds!',
    descAr:  'أسرع سيارة! اكسر الرقم القياسي', descFr: 'Voiture rapide, bats le record !', descEn: 'Fast car, beat the record!',
    gradient: 'from-amber-500 to-orange-600' },
];

// ─── Road layout ─────────────────────────────────────────────────────────────
const ROAD_SEGS = [
  { x: 50,  y: 50,  w: 700, h: 110 },
  { x: 640, y: 50,  w: 110, h: 400 },
  { x: 50,  y: 340, w: 700, h: 110 },
] as const;

const START = { x: 105, y: 105 };
const GOAL  = { x: 105, y: 395 };

function isOnRoad(px: number, py: number): boolean {
  return ROAD_SEGS.some(s => px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h);
}

// ─────────────────────────────────────────────────────────────────────────────
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

    const cfg    = LEVELS[activeLevel - 1];
    const ctrlRef = ctrl;
    const W = 800, H = 500;

    const labels = {
      win:    t('🎉 أحسنت! بطل! 🏆', '🎉 Bravo ! Champion ! 🏆', '🎉 You did it! 🏆'),
      start:  t('🏠 ابدأ',    '🏠 Départ',  '🏠 Start'),
      finish: t('⭐ الوصول', '⭐ Arrivée', '⭐ Finish'),
      timeUp: t('⏰ انتهى الوقت! 😅', '⏰ Temps écoulé ! 😅', '⏰ Time\'s up! 😅'),
    };

    class RoadScene extends Phaser.Scene {
      private car!: Phaser.Physics.Arcade.Sprite;
      private keys?: Phaser.Types.Input.Keyboard.CursorKeys;
      private done = false;
      private timerSecs: number;
      private timerText: Phaser.GameObjects.Text | null = null;
      private timerEvent: Phaser.Time.TimerEvent | null = null;

      constructor() {
        super({ key: 'RoadScene' });
        this.timerSecs = cfg.timerSecs ?? 0;
      }

      preload() {}

      create() {
        // ── 1. Grass background ────────────────────────────────────────────
        const bgG = this.add.graphics();
        bgG.fillStyle(0x4ade80);
        bgG.fillRect(0, 0, W, H);
        bgG.fillStyle(0x22c55e, 0.35);
        for (let gx = 20; gx < W; gx += 30)
          for (let gy = 20; gy < H; gy += 30)
            if ((Math.floor(gx / 30) + Math.floor(gy / 30)) % 3 === 0)
              bgG.fillCircle(gx, gy, 10);

        // ── 2. Road base ──────────────────────────────────────────────────
        const rG = this.add.graphics();
        rG.fillStyle(0x64748b);
        for (const s of ROAD_SEGS) rG.fillRect(s.x, s.y, s.w, s.h);
        rG.lineStyle(4, 0x374151, 0.9);
        for (const s of ROAD_SEGS) rG.strokeRect(s.x, s.y, s.w, s.h);
        rG.lineStyle(5, 0xffffff, 0.65);
        const dash = (x1: number, y1: number, x2: number, y2: number) => {
          rG.beginPath(); rG.moveTo(x1, y1); rG.lineTo(x2, y2); rG.strokePath();
        };
        for (let x = 80; x < 740; x += 46) dash(x, 105, x + 28, 105);
        for (let y = 80; y < 445; y += 46) dash(695, y, 695, y + 28);
        for (let x = 80; x < 730; x += 46) dash(x, 395, x + 28, 395);
        rG.lineStyle(3, 0xfbbf24, 0.3);
        rG.strokeRect(56, 56, 688, 98); rG.strokeRect(646, 56, 98, 388); rG.strokeRect(56, 346, 688, 98);

        // ── 3. Direction arrows ───────────────────────────────────────────
        const aG = this.add.graphics();
        aG.fillStyle(0xffffff, 0.38);
        const arw = (ax: number, ay: number, d: 'r' | 'l' | 'd') => {
          const s = 14;
          if (d === 'r') aG.fillTriangle(ax + s, ay, ax - s, ay - s, ax - s, ay + s);
          if (d === 'l') aG.fillTriangle(ax - s, ay, ax + s, ay - s, ax + s, ay + s);
          if (d === 'd') aG.fillTriangle(ax, ay + s, ax - s, ay - s, ax + s, ay - s);
        };
        [220, 390, 555].forEach(ax => arw(ax, 105, 'r'));
        [200, 310].forEach(ay => arw(695, ay, 'd'));
        [560, 385, 210].forEach(ax => arw(ax, 395, 'l'));

        // ── 4. Trees & decoration ─────────────────────────────────────────
        const dG = this.add.graphics();
        const tree = (tx: number, ty: number) => {
          dG.fillStyle(0x92400e); dG.fillRect(tx - 5, ty, 10, 22);
          dG.fillStyle(0x14532d); dG.fillCircle(tx, ty - 5, 20);
          dG.fillStyle(0x86efac); dG.fillCircle(tx + 3, ty - 16, 9);
        };
        [[145, 248], [300, 255], [455, 252], [580, 252], [310, 27], [530, 24], [730, 24], [730, 472], [420, 478], [170, 475], [580, 476]].forEach(([tx, ty]) => tree(tx, ty));
        [[200, 272], [380, 270], [290, 31], [440, 31], [200, 464], [460, 464]].forEach(([fx, fy]) => {
          dG.fillStyle(0xfbbf24); dG.fillCircle(fx, fy, 6);
          dG.fillStyle(0xfef9c3); dG.fillCircle(fx, fy, 3);
        });
        dG.fillStyle(0xf8fafc, 0.65);
        [[580, 260], [270, 30]].forEach(([cx, cy]) => {
          dG.fillCircle(cx, cy, 18); dG.fillCircle(cx + 20, cy - 6, 14); dG.fillCircle(cx - 16, cy - 4, 12);
        });

        // ── 5. Start house ────────────────────────────────────────────────
        const hG = this.add.graphics();
        const sx = START.x, sy = START.y;
        hG.fillStyle(0xdc2626); hG.fillTriangle(sx, sy - 54, sx - 32, sy - 22, sx + 32, sy - 22);
        hG.fillStyle(0x9a3412); hG.fillRect(sx + 12, sy - 64, 9, 22);
        hG.fillStyle(0xfef3c7); hG.fillRect(sx - 26, sy - 22, 52, 30);
        hG.fillStyle(0x92400e); hG.fillRect(sx - 9, sy - 10, 15, 18);
        hG.fillStyle(0x7dd3fc); hG.fillRect(sx + 6, sy - 18, 11, 10);
        this.add.text(sx, sy + 12, labels.start, {
          fontSize: '12px', color: '#1e3a8a', fontStyle: 'bold',
          backgroundColor: '#e0f2fe', padding: { x: 5, y: 2 },
        }).setOrigin(0.5);

        // ── 6. Goal animated star ─────────────────────────────────────────
        const gx = GOAL.x, gy = GOAL.y;
        const starTxt = this.add.text(gx, gy - 40, '⭐', { fontSize: '46px' }).setOrigin(0.5).setDepth(4);
        this.tweens.add({ targets: starTxt, y: gy - 56, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: starTxt, angle: 14, yoyo: true, repeat: -1, duration: 1150 });
        const ring = this.add.graphics().setDepth(3);
        ring.lineStyle(2, 0xfbbf24, 0.4); ring.strokeCircle(gx, gy - 44, 30);
        this.tweens.add({ targets: ring, scaleX: 1.4, scaleY: 1.4, alpha: 0, yoyo: true, repeat: -1, duration: 1300 });
        this.add.text(gx, gy + 14, labels.finish, {
          fontSize: '12px', color: '#fbbf24', fontStyle: 'bold',
          backgroundColor: '#1c1917', padding: { x: 5, y: 2 },
        }).setOrigin(0.5);

        // ── 7. Car texture ────────────────────────────────────────────────
        const cg = this.add.graphics();
        cg.fillStyle(0x000000, 0.15); cg.fillEllipse(32, 44, 54, 10);
        cg.fillStyle(0xef4444); cg.fillRoundedRect(5, 11, 54, 22, 8);
        cg.fillStyle(0x7dd3fc); cg.fillRoundedRect(19, 4, 26, 16, 5);
        cg.lineStyle(1.5, 0x0ea5e9, 0.9); cg.strokeRoundedRect(19, 4, 26, 16, 5);
        cg.lineStyle(1.5, 0xfca5a5, 0.5); cg.beginPath(); cg.moveTo(32, 11); cg.lineTo(32, 33); cg.strokePath();
        cg.lineStyle(0, 0, 0);
        cg.fillStyle(0x1e293b); cg.fillCircle(16, 33, 10); cg.fillCircle(48, 33, 10);
        cg.fillStyle(0xe2e8f0); cg.fillCircle(16, 33, 5);  cg.fillCircle(48, 33, 5);
        cg.fillStyle(0x94a3b8); cg.fillCircle(16, 33, 2);  cg.fillCircle(48, 33, 2);
        cg.fillStyle(0xfef08a); cg.fillEllipse(59, 16, 8, 5); cg.fillEllipse(59, 26, 8, 5);
        cg.fillStyle(0xff6b6b); cg.fillRect(4, 15, 5, 4); cg.fillRect(4, 23, 5, 4);
        cg.fillStyle(0xfbbf24); cg.fillRect(1, 10, 3, 22); cg.fillRect(60, 10, 3, 22);
        cg.generateTexture('car_tex', 64, 46);
        cg.destroy();

        // ── 8. Player sprite ──────────────────────────────────────────────
        this.car = this.physics.add.sprite(START.x, START.y, 'car_tex');
        this.car.setCollideWorldBounds(true).setDepth(6).setOrigin(0.5, 0.5);

        // ── 9. Keyboard ───────────────────────────────────────────────────
        if (this.input.keyboard) this.keys = this.input.keyboard.createCursorKeys();

        // ── 10. Level indicator ───────────────────────────────────────────
        this.add.text(W / 2, 14,
          t(`م${activeLevel}`, `N${activeLevel}`, `L${activeLevel}`), {
          fontSize: '16px', color: '#fef08a', fontStyle: 'bold',
          backgroundColor: '#0f172a', padding: { x: 10, y: 4 },
        }).setOrigin(0.5, 0).setDepth(10);

        // ── 11. Timer (levels 2 & 3) ──────────────────────────────────────
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

      // ─── Victory ────────────────────────────────────────────────────────
      private celebrate() {
        this.done = true;
        if (this.timerEvent) this.timerEvent.destroy();
        this.car.setVelocity(0);

        // Stars based on remaining time (for timed levels)
        let earnedStars = 3;
        if (cfg.timerSecs !== null) {
          earnedStars = this.timerSecs > cfg.timerSecs * 0.5 ? 3
                      : this.timerSecs > cfg.timerSecs * 0.2 ? 2
                      : 1;
        }

        this.cameras.main.flash(700, 255, 240, 0);
        ['🎉', '⭐', '🌟', '🏆', '✨', '🎊', '🥳', '🌈'].forEach((em, i) => {
          this.time.delayedCall(i * 110, () => {
            const tx = this.add.text(
              Phaser.Math.Between(150, 650), Phaser.Math.Between(150, 370), em, { fontSize: '38px' }
            ).setDepth(32).setAlpha(0);
            this.tweens.add({ targets: tx, alpha: 1, y: tx.y - 130, duration: 1600, ease: 'Quad.easeOut',
              onComplete: () => { this.tweens.add({ targets: tx, alpha: 0, duration: 600 }); } });
          });
        });

        // Stars row display
        const starsStr = '★'.repeat(earnedStars) + '☆'.repeat(3 - earnedStars);
        const panel = this.add.graphics().setDepth(30);
        panel.fillStyle(0x0f172a, 0.94); panel.fillRoundedRect(140, 175, 520, 145, 22);
        panel.lineStyle(3, 0xfbbf24); panel.strokeRoundedRect(140, 175, 520, 145, 22);

        const wt = this.add.text(400, 230, labels.win, {
          fontSize: '28px', color: '#fef08a', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(31).setScale(0.2);
        this.tweens.add({ targets: wt, scaleX: 1, scaleY: 1, duration: 480, ease: 'Back.easeOut' });

        this.add.text(400, 285, starsStr, {
          fontSize: '34px', color: earnedStars === 3 ? '#fbbf24' : '#94a3b8',
        }).setOrigin(0.5).setDepth(31).setAlpha(0).setScale(0.3);
        this.time.delayedCall(550, () => {
          const st = this.add.text(400, 285, starsStr, { fontSize: '34px', color: '#fbbf24' })
            .setOrigin(0.5).setDepth(32).setScale(0.2);
          this.tweens.add({ targets: st, scaleX: 1, scaleY: 1, duration: 400, ease: 'Back.easeOut' });
        });

        this.time.delayedCall(2200, () => onWinRef.current(earnedStars));
      }

      // ─── Game loop ────────────────────────────────────────────────────────
      update() {
        if (this.done) { this.car.setVelocity(0); return; }

        const onRoad = isOnRoad(this.car.x, this.car.y);
        const speed  = onRoad ? cfg.speed : 38;

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

        if (Phaser.Math.Distance.Between(this.car.x, this.car.y, GOAL.x, GOAL.y) < 44) {
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

  // ─── D-pad button ─────────────────────────────────────────────────────────
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

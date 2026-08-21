/**
 * CarMazeGame.tsx  —  Jeu de voiture pour 3-5 ans
 *
 * Design pédagogique :
 *  • Circuit en U dessiné programmatiquement (pas d'images externes)
 *  • Voiture 2D dessinée en Phaser Graphics → texture
 *  • Flèches directionnelles sur la route pour guider l'enfant
 *  • Pénalité de vitesse hors-route (douce, non bloquante)
 *  • D-pad React en HTML sous le canvas (gros boutons tactiles)
 *  • Célébration animée à l'arrivée
 */

import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export interface CarMazeGameProps {
  onExit?: () => void;
  language?: 'ar' | 'fr' | 'en';
}

type Dir = 'up' | 'down' | 'left' | 'right';

// ─── Road layout ────────────────────────────────────────────────────────────
//  Canvas 800×500 — U-shape track
//
//    ┌──→──→──→──→──→──→──→──→──→──→──┐
//    │  (top road y=50..160)           │
//    [start]                           │ (right road x=640..750)
//                                      │
//    [goal] ←──←──←──←──←──←──←──←──┘
//           (bottom road y=340..450)
//
const ROAD_SEGS = [
  { x: 50,  y: 50,  w: 700, h: 110 }, // top    — center y=105
  { x: 640, y: 50,  w: 110, h: 400 }, // right  — center x=695
  { x: 50,  y: 340, w: 700, h: 110 }, // bottom — center y=395
] as const;

const START = { x: 105, y: 105 };
const GOAL  = { x: 105, y: 395 };

function isOnRoad(px: number, py: number): boolean {
  return ROAD_SEGS.some(s => px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h);
}

// ─────────────────────────────────────────────────────────────────────────────
export const CarMazeGame: React.FC<CarMazeGameProps> = ({ onExit, language = 'fr' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef      = useRef<Phaser.Game | null>(null);
  // Shared control state between React (buttons) and Phaser (update loop)
  const ctrl = useRef<Record<Dir, boolean>>({ up: false, down: false, left: false, right: false });

  useEffect(() => {
    if (!containerRef.current) return;

    const ctrlRef = ctrl; // capture ref in closure

    const labels = {
      win:    language === 'ar' ? '🎉 أحسنت! بطل! 🏆'
            : language === 'fr' ? '🎉 Bravo ! Champion ! 🏆'
            : '🎉 You did it! 🏆',
      start:  language === 'ar' ? '🏠 ابدأ'   : '🏠 Départ',
      finish: language === 'ar' ? '⭐ الوصول' : '⭐ Arrivée',
    };

    // ─── Phaser scene ────────────────────────────────────────────────────────
    class RoadScene extends Phaser.Scene {
      private car!:  Phaser.Physics.Arcade.Sprite;
      private keys?: Phaser.Types.Input.Keyboard.CursorKeys;
      private done = false;

      constructor() { super({ key: 'RoadScene' }); }
      preload() {}

      create() {
        const W = 800, H = 500;

        // ── 1. Grass background ─────────────────────────────────────────────
        const bgG = this.add.graphics();
        bgG.fillStyle(0x4ade80);
        bgG.fillRect(0, 0, W, H);
        // Texture spots
        bgG.fillStyle(0x22c55e, 0.35);
        for (let gx = 20; gx < W; gx += 30)
          for (let gy = 20; gy < H; gy += 30)
            if ((Math.floor(gx / 30) + Math.floor(gy / 30)) % 3 === 0)
              bgG.fillCircle(gx, gy, 10);

        // ── 2. Road base ─────────────────────────────────────────────────────
        const rG = this.add.graphics();
        rG.fillStyle(0x64748b);
        for (const s of ROAD_SEGS) rG.fillRect(s.x, s.y, s.w, s.h);

        // Sidewalk borders
        rG.lineStyle(4, 0x374151, 0.9);
        for (const s of ROAD_SEGS) rG.strokeRect(s.x, s.y, s.w, s.h);

        // Centre dashes (white)
        rG.lineStyle(5, 0xffffff, 0.65);
        const dash = (x1: number, y1: number, x2: number, y2: number) => {
          rG.beginPath(); rG.moveTo(x1, y1); rG.lineTo(x2, y2); rG.strokePath();
        };
        // Top road  y=105
        for (let x = 80; x < 740; x += 46) dash(x, 105, x + 28, 105);
        // Right road  x=695
        for (let y = 80; y < 445; y += 46) dash(695, y, 695, y + 28);
        // Bottom road  y=395
        for (let x = 80; x < 730; x += 46) dash(x, 395, x + 28, 395);

        // Curb highlights (lighter strip at edges)
        rG.lineStyle(3, 0xfbbf24, 0.3);
        rG.strokeRect(50 + 6, 50 + 6, 700 - 12, 110 - 12);
        rG.strokeRect(640 + 6, 50 + 6, 110 - 12, 400 - 12);
        rG.strokeRect(50 + 6, 340 + 6, 700 - 12, 110 - 12);

        // ── 3. Direction arrows ─────────────────────────────────────────────
        const aG = this.add.graphics();
        aG.fillStyle(0xffffff, 0.38);
        const arw = (ax: number, ay: number, d: 'r' | 'l' | 'd') => {
          const s = 14;
          if (d === 'r')  aG.fillTriangle(ax + s, ay, ax - s, ay - s, ax - s, ay + s);
          if (d === 'l')  aG.fillTriangle(ax - s, ay, ax + s, ay - s, ax + s, ay + s);
          if (d === 'd')  aG.fillTriangle(ax, ay + s, ax - s, ay - s, ax + s, ay - s);
        };
        [220, 390, 555].forEach(ax => arw(ax, 105, 'r')); // top → right
        [200, 310].forEach(ay => arw(695, ay, 'd'));        // right ↓ down
        [560, 385, 210].forEach(ax => arw(ax, 395, 'l'));  // bottom ← left

        // ── 4. Trees & flowers (in grass only) ─────────────────────────────
        const dG = this.add.graphics();
        const tree = (tx: number, ty: number, scale = 1) => {
          dG.fillStyle(0x92400e);
          dG.fillRect(tx - 5 * scale, ty, 10 * scale, 22 * scale);
          dG.fillStyle(0x14532d);
          dG.fillCircle(tx, ty - 5 * scale, 20 * scale);
          dG.fillStyle(0x166534);
          dG.fillCircle(tx - 4 * scale, ty - 10 * scale, 15 * scale);
          dG.fillStyle(0x86efac);
          dG.fillCircle(tx + 3 * scale, ty - 16 * scale, 9 * scale);
        };
        // Grass zones: center (x=50-640, y=160-340), corners, bottom strip
        [
          [145, 248], [300, 255], [455, 252], [580, 252],
          [310, 27],  [530, 24],  [730, 24],  [730, 472],
          [420, 478], [170, 475], [580, 476],
        ].forEach(([tx, ty]) => tree(tx, ty));

        // Flowers
        [[200, 272], [380, 270], [290, 31], [440, 31], [200, 464], [460, 464]].forEach(([fx, fy]) => {
          dG.fillStyle(0xfbbf24); dG.fillCircle(fx, fy, 6);
          dG.fillStyle(0xfef9c3); dG.fillCircle(fx, fy, 3);
        });
        // Clouds
        const cloud = (cx2: number, cy2: number) => {
          dG.fillStyle(0xf8fafc, 0.65);
          dG.fillCircle(cx2, cy2, 18); dG.fillCircle(cx2 + 20, cy2 - 6, 14); dG.fillCircle(cx2 - 16, cy2 - 4, 12);
        };
        cloud(580, 260); cloud(270, 30);

        // ── 5. Start: house ─────────────────────────────────────────────────
        const hG = this.add.graphics();
        const sx = START.x, sy = START.y;
        hG.fillStyle(0xdc2626); // roof
        hG.fillTriangle(sx, sy - 54, sx - 32, sy - 22, sx + 32, sy - 22);
        hG.fillStyle(0x9a3412); // chimney
        hG.fillRect(sx + 12, sy - 64, 9, 22);
        hG.fillStyle(0xfef3c7); // wall
        hG.fillRect(sx - 26, sy - 22, 52, 30);
        hG.fillStyle(0x92400e); // door
        hG.fillRect(sx - 9, sy - 10, 15, 18);
        hG.fillStyle(0x7dd3fc); // window
        hG.fillRect(sx + 6, sy - 18, 11, 10);
        this.add.text(sx + 24, sy - 66, '💨', { fontSize: '13px' }).setOrigin(0.5);
        this.add.text(sx, sy + 12, labels.start, {
          fontSize: '12px', color: '#1e3a8a', fontStyle: 'bold',
          backgroundColor: '#e0f2fe', padding: { x: 5, y: 2 },
        }).setOrigin(0.5);

        // ── 6. Goal: animated star ──────────────────────────────────────────
        const gx = GOAL.x, gy = GOAL.y;
        const starTxt = this.add.text(gx, gy - 40, '⭐', { fontSize: '46px' }).setOrigin(0.5).setDepth(4);
        this.tweens.add({ targets: starTxt, y: gy - 56, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: starTxt, angle: 14, yoyo: true, repeat: -1, duration: 1150 });
        // Sparkle ring
        const ring = this.add.graphics().setDepth(3);
        ring.lineStyle(2, 0xfbbf24, 0.4); ring.strokeCircle(gx, gy - 44, 30);
        this.tweens.add({ targets: ring, scaleX: 1.4, scaleY: 1.4, alpha: 0, yoyo: true, repeat: -1, duration: 1300 });
        this.add.text(gx, gy + 14, labels.finish, {
          fontSize: '12px', color: '#fbbf24', fontStyle: 'bold',
          backgroundColor: '#1c1917', padding: { x: 5, y: 2 },
        }).setOrigin(0.5);

        // ── 7. Car texture (programmatic — faces RIGHT at angle 0°) ────────
        const cg = this.add.graphics();
        // Shadow
        cg.fillStyle(0x000000, 0.15); cg.fillEllipse(32, 44, 54, 10);
        // Body
        cg.fillStyle(0xef4444); cg.fillRoundedRect(5, 11, 54, 22, 8);
        // Roof / cabin glass
        cg.fillStyle(0x7dd3fc); cg.fillRoundedRect(19, 4, 26, 16, 5);
        cg.lineStyle(1.5, 0x0ea5e9, 0.9); cg.strokeRoundedRect(19, 4, 26, 16, 5);
        // Door line
        cg.lineStyle(1.5, 0xfca5a5, 0.5); cg.beginPath(); cg.moveTo(32, 11); cg.lineTo(32, 33); cg.strokePath();
        cg.lineStyle(0, 0, 0);
        // Wheels
        cg.fillStyle(0x1e293b); cg.fillCircle(16, 33, 10); cg.fillCircle(48, 33, 10);
        cg.fillStyle(0xe2e8f0); cg.fillCircle(16, 33, 5);  cg.fillCircle(48, 33, 5);
        cg.fillStyle(0x94a3b8); cg.fillCircle(16, 33, 2);  cg.fillCircle(48, 33, 2);
        // Headlights (right side = front)
        cg.fillStyle(0xfef08a); cg.fillEllipse(59, 16, 8, 5); cg.fillEllipse(59, 26, 8, 5);
        // Taillights (left = back)
        cg.fillStyle(0xff6b6b); cg.fillRect(4, 15, 5, 4); cg.fillRect(4, 23, 5, 4);
        // Bumpers
        cg.fillStyle(0xfbbf24); cg.fillRect(1, 10, 3, 22); cg.fillRect(60, 10, 3, 22);
        cg.generateTexture('car_tex', 64, 46);
        cg.destroy();

        // ── 8. Player sprite ────────────────────────────────────────────────
        this.car = this.physics.add.sprite(START.x, START.y, 'car_tex');
        this.car.setCollideWorldBounds(true).setDepth(6).setOrigin(0.5, 0.5);

        // ── 9. Keyboard ─────────────────────────────────────────────────────
        if (this.input.keyboard) this.keys = this.input.keyboard.createCursorKeys();
      }

      // ─── Victory ──────────────────────────────────────────────────────────
      private celebrate() {
        this.done = true;
        this.car.setVelocity(0);
        this.cameras.main.flash(700, 255, 240, 0);

        // Floating emojis
        ['🎉', '⭐', '🌟', '🏆', '✨', '🎊', '🥳', '🌈'].forEach((em, i) => {
          this.time.delayedCall(i * 110, () => {
            const tx = this.add.text(
              Phaser.Math.Between(150, 650),
              Phaser.Math.Between(150, 370),
              em, { fontSize: '38px' }
            ).setDepth(32).setAlpha(0);
            this.tweens.add({
              targets: tx, alpha: 1, y: tx.y - 130,
              duration: 1600, ease: 'Quad.easeOut',
              onComplete: () => { this.tweens.add({ targets: tx, alpha: 0, duration: 600 }); },
            });
          });
        });

        // Win panel
        const panel = this.add.graphics().setDepth(30);
        panel.fillStyle(0x0f172a, 0.92); panel.fillRoundedRect(160, 180, 480, 130, 20);
        panel.lineStyle(3, 0xfbbf24);    panel.strokeRoundedRect(160, 180, 480, 130, 20);

        const wt = this.add.text(400, 245, labels.win, {
          fontSize: '32px', color: '#fef08a', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(31).setScale(0.2);
        this.tweens.add({ targets: wt, scaleX: 1, scaleY: 1, duration: 480, ease: 'Back.easeOut' });
        this.tweens.add({ targets: wt, angle: 4, yoyo: true, repeat: -1, duration: 520, delay: 550 });
      }

      // ─── Game loop ────────────────────────────────────────────────────────
      update() {
        if (this.done) { this.car.setVelocity(0); return; }

        const onRoad = isOnRoad(this.car.x, this.car.y);
        const speed  = onRoad ? 185 : 38; // strong off-road penalty

        const U = this.keys?.up.isDown    || ctrlRef.current.up;
        const D = this.keys?.down.isDown  || ctrlRef.current.down;
        const L = this.keys?.left.isDown  || ctrlRef.current.left;
        const R = this.keys?.right.isDown || ctrlRef.current.right;

        this.car.setVelocity(0);
        if (L) { this.car.setVelocityX(-speed); this.car.setAngle(180); }
        else if (R) { this.car.setVelocityX(speed);  this.car.setAngle(0); }
        if (U) { this.car.setVelocityY(-speed); this.car.setAngle(-90); }
        else if (D) { this.car.setVelocityY(speed);  this.car.setAngle(90); }

        // Off-road visual: slight jitter on car
        if (!onRoad && (U || D || L || R)) {
          this.car.setAngle(this.car.angle + (Math.random() - 0.5) * 6);
        }

        // Goal reached?
        if (Phaser.Math.Distance.Between(this.car.x, this.car.y, GOAL.x, GOAL.y) < 44) {
          this.celebrate();
        }
      }
    }

    // ─── Launch game ──────────────────────────────────────────────────────
    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800, height: 500,
      transparent: false,
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: [RoadScene],
    });

    return () => { gameRef.current?.destroy(true); };
  }, [language]);

  // ─── D-pad button ──────────────────────────────────────────────────────────
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

  return (
    <div className="relative flex flex-col items-center gap-5 bg-slate-950 p-4 sm:p-6 rounded-3xl min-h-screen justify-center">
      {/* Exit button */}
      {onExit && (
        <button
          onClick={onExit}
          className="absolute top-4 left-4 z-10 bg-white/90 hover:bg-white text-slate-900 font-black
                     px-4 py-2 rounded-2xl shadow-lg border-2 border-amber-300 cursor-pointer
                     flex items-center gap-2 text-sm transition-all"
        >
          🚪 {language === 'ar' ? 'خروج' : language === 'fr' ? 'Retour' : 'Back'}
        </button>
      )}

      {/* Phaser canvas */}
      <div
        ref={containerRef}
        className="w-full max-w-4xl aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400"
      />

      {/* D-pad — outside the canvas, full React HTML, touch-friendly */}
      <div className="flex flex-col items-center gap-2" dir="ltr">
        {/* Up */}
        <div className="flex justify-center">{dBtn('⬆️', 'up')}</div>
        {/* Middle row */}
        <div className="flex gap-2 items-center">
          {dBtn('⬅️', 'left')}
          <div className="w-16 h-16 rounded-2xl bg-slate-800/40 border-2 border-slate-700/30" />
          {dBtn('➡️', 'right')}
        </div>
        {/* Down */}
        <div className="flex justify-center">{dBtn('⬇️', 'down')}</div>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-slate-500 font-bold">
        {language === 'ar'
          ? '🎮 استخدم أسهم لوحة المفاتيح أو الأزرار أعلاه'
          : language === 'fr'
          ? '🎮 Flèches clavier ou boutons ci-dessus'
          : '🎮 Arrow keys or buttons above'}
      </p>
    </div>
  );
};

export default CarMazeGame;

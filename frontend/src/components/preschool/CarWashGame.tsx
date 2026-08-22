/**
 * CarWashGame.tsx
 * Scratch-off car wash for ages 3–5 (Phaser 4).
 *
 * Phaser 4 buffers draw/erase until `.render()` — without it the mud never
 * comes off. RenderTexture also defaults to origin 0.5, which used to put the
 * dirt overlay in the wrong corner. Win is based on actually cleaning the car,
 * not on counting pointer-move events.
 */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { motion } from 'motion/react';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';

export interface CarWashGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

interface LevelCfg {
  mudAlpha: number;
  splotches: number;
  cleanRatio: number;
  hasTimer: boolean;
  timerSecs: number;
  brushR: number;
}
const LEVELS: LevelCfg[] = [
  { mudAlpha: 0.78, splotches:  8, cleanRatio: 0.62, hasTimer: false, timerSecs:  0, brushR: 40 },
  { mudAlpha: 0.86, splotches: 12, cleanRatio: 0.70, hasTimer: false, timerSecs:  0, brushR: 36 },
  { mudAlpha: 0.92, splotches: 16, cleanRatio: 0.75, hasTimer: true,  timerSecs: 90, brushR: 32 },
  { mudAlpha: 0.96, splotches: 22, cleanRatio: 0.80, hasTimer: true,  timerSecs: 60, brushR: 28 },
];
const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🧽', diffLabel: '⭐',
    titleAr: 'طين خفيف',      titleFr: 'Boue légère',       titleEn: 'Light mud',
    descAr:  'سهل الإزالة',   descFr:  'Facile à enlever',  descEn:  'Easy to remove',
    gradient: 'from-cyan-400 to-sky-500' },
  { level: 2, emoji: '💧', diffLabel: '⭐⭐',
    titleAr: 'طين أكثر',     titleFr: 'Plus de boue',       titleEn: 'More mud',
    descAr:  'مزيد من الفرك', descFr:  'Il faut frotter plus', descEn: 'Scrub more',
    gradient: 'from-sky-400 to-blue-500' },
  { level: 3, emoji: '⏱️', diffLabel: '⭐⭐⭐',
    titleAr: 'مع عداد الوقت – 90 ث', titleFr: 'Avec minuteur – 90 s', titleEn: 'With timer – 90 s',
    descAr:  'طين كثير والوقت ينفد',  descFr:  'Beaucoup de boue, le temps presse', descEn: 'Lots of mud, time running',
    gradient: 'from-blue-500 to-indigo-600' },
  { level: 4, emoji: '🏆', diffLabel: '🏆',
    titleAr: 'التحدي – 60 ث فقط!',      titleFr: 'Défi – 60 s seulement !',  titleEn: 'Challenge – only 60 s!',
    descAr:  'فرك سريع وقوي لتفوز',    descFr:  'Frotte vite et fort pour gagner', descEn: 'Scrub fast and hard to win',
    gradient: 'from-indigo-600 to-violet-700' },
];

const W = 640;
const H = 420;
const CELL = 28;
const CAR = { x: 160, y: 125, w: 330, h: 175 };

export const CarWashGame: React.FC<CarWashGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('car_wash', 4);
  const [phase, setPhase]       = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef      = useRef<Phaser.Game | null>(null);
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
    const cols = Math.ceil(CAR.w / CELL);
    const rows = Math.ceil(CAR.h / CELL);
    const totalCells = cols * rows;
    const needCells = Math.ceil(totalCells * cfg.cleanRatio);
    const brushSize = cfg.brushR * 2;

    const labels = {
      progress: t('نظافة', 'Propreté', 'Clean'),
      hint:     t('افرك الطين على السيارة!', 'Frotte la boue sur la voiture !', 'Scrub the mud on the car!'),
      win:      t('🌟 السيارة تلمع! 🌟', '🌟 La voiture brille ! 🌟', '🌟 Sparkling clean! 🌟'),
      lvl:      t(`المستوى ${activeLevel}`, `Niveau ${activeLevel}`, `Level ${activeLevel}`),
      timeUp:   t('انتهى الوقت! 😅', 'Temps écoulé ! 😅', 'Time\'s up! 😅'),
    };

    class Scene extends Phaser.Scene {
      private dirt!: Phaser.GameObjects.RenderTexture;
      private sponge!: Phaser.GameObjects.Container;
      private progressBar!: Phaser.GameObjects.Graphics;
      private progressText!: Phaser.GameObjects.Text;
      private timerText: Phaser.GameObjects.Text | null = null;
      private timerEvent: Phaser.Time.TimerEvent | null = null;
      private timerSecs = cfg.timerSecs;
      private done = false;
      private last: { x: number; y: number } | null = null;
      private cleaned = new Set<string>();

      constructor() { super('CW'); }

      create() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xbae6fd, 0xbae6fd, 0xfde68a, 0xfbbf24, 1);
        bg.fillRect(0, 0, W, H);
        const gnd = this.add.graphics();
        gnd.fillStyle(0x94a3b8); gnd.fillRect(0, H - 30, W, 30);
        gnd.fillStyle(0xcbd5e1); gnd.fillRect(0, H - 30, W, 8);

        const car = this.add.graphics().setDepth(1);
        const cx = W / 2, cy = H / 2 + 10;
        car.fillStyle(0xef4444); car.fillRoundedRect(cx - 155, cy - 30, 310, 75, 16);
        car.fillStyle(0xdc2626); car.fillRoundedRect(cx - 100, cy - 80, 200, 60, 14);
        car.fillStyle(0x7dd3fc, 0.9); car.fillRoundedRect(cx - 88, cy - 72, 78, 46, 8);
        car.fillStyle(0x7dd3fc, 0.9); car.fillRoundedRect(cx + 14, cy - 72, 78, 46, 8);
        car.lineStyle(2, 0x1e40af); car.strokeRoundedRect(cx - 88, cy - 72, 78, 46, 8);
        car.strokeRoundedRect(cx + 14, cy - 72, 78, 46, 8);
        car.fillStyle(0x1e293b); car.fillCircle(cx - 95, cy + 55, 30); car.fillCircle(cx + 95, cy + 55, 30);
        car.fillStyle(0x94a3b8); car.fillCircle(cx - 95, cy + 55, 18); car.fillCircle(cx + 95, cy + 55, 18);
        car.fillStyle(0x1e293b); car.fillCircle(cx - 95, cy + 55, 6);  car.fillCircle(cx + 95, cy + 55, 6);
        car.fillStyle(0xfef08a); car.fillRoundedRect(cx + 140, cy - 25, 20, 14, 5);
        car.fillStyle(0xfca5a5); car.fillRoundedRect(cx - 160, cy - 20, 14, 20, 5);
        car.lineStyle(2, 0xb91c1c, 0.5);
        car.beginPath(); car.moveTo(cx - 2, cy - 28); car.lineTo(cx - 2, cy + 44); car.strokePath();
        car.fillStyle(0xffffff, 0.14); car.fillRoundedRect(cx - 120, cy - 24, 240, 12, 6);

        const brushKey = `cw-brush-${cfg.brushR}`;
        if (!this.textures.exists(brushKey)) {
          const pad = 4;
          const size = brushSize + pad * 2;
          const dt = this.textures.addDynamicTexture(brushKey, size, size);
          const blob = this.add.circle(size / 2, size / 2, cfg.brushR, 0xffffff);
          dt.draw(blob);
          dt.render();
          blob.destroy();
        }

        this.dirt = this.add.renderTexture(0, 0, W, H).setOrigin(0, 0).setDepth(3);
        this.dirt.fill(0x6b4c2a, cfg.mudAlpha, CAR.x, CAR.y, CAR.w, CAR.h);

        const sg = this.add.graphics();
        sg.fillStyle(0x78350f, 0.75);
        for (let i = 0; i < cfg.splotches; i++) {
          sg.fillCircle(
            Phaser.Math.Between(CAR.x + 30, CAR.x + CAR.w - 30),
            Phaser.Math.Between(CAR.y + 24, CAR.y + CAR.h - 24),
            Phaser.Math.Between(18, 36),
          );
        }
        this.dirt.draw(sg);
        sg.destroy();
        this.dirt.render();

        const spongeGfx = this.add.graphics();
        spongeGfx.fillStyle(0xfde68a); spongeGfx.fillRoundedRect(-cfg.brushR, -cfg.brushR * 0.75, brushSize, cfg.brushR * 1.5, 12);
        spongeGfx.fillStyle(0xfbbf24, 0.45);
        for (let i = 0; i < 5; i++) spongeGfx.fillCircle(-cfg.brushR + 14 + i * 12, -4, 5);
        spongeGfx.lineStyle(3, 0xd97706); spongeGfx.strokeRoundedRect(-cfg.brushR, -cfg.brushR * 0.75, brushSize, cfg.brushR * 1.5, 12);
        this.sponge = this.add.container(0, 0, [spongeGfx]).setDepth(8).setAlpha(0);

        this.progressBar = this.add.graphics().setDepth(10);
        this.progressText = this.add.text(W / 2, 12, `${labels.lvl}  |  ${labels.progress}: 0%`, {
          fontSize: '16px', color: '#fef08a', fontStyle: 'bold',
          backgroundColor: '#0f172a', padding: { x: 12, y: 5 },
        }).setOrigin(0.5, 0).setDepth(11);
        this.add.text(W / 2, H - 8, labels.hint, {
          fontSize: '13px', color: '#1e3a8a', fontStyle: 'bold',
        }).setOrigin(0.5, 1).setDepth(10);
        this.drawBar(0);

        if (cfg.hasTimer) {
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
              if (this.timerSecs <= 0) this.fail();
            },
          });
        }

        this.input.on('pointermove', (ptr: Phaser.Input.Pointer) => {
          this.sponge.setPosition(ptr.x, ptr.y).setAlpha(1);
          if (ptr.isDown && !this.done) this.scrub(ptr.x, ptr.y);
        });
        this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
          this.sponge.setPosition(ptr.x, ptr.y).setAlpha(1);
          this.last = null;
          if (!this.done) this.scrub(ptr.x, ptr.y);
        });
        this.input.on('pointerup', () => { this.last = null; });
        this.input.on('pointerout', () => {
          this.last = null;
          this.sponge.setAlpha(0);
        });
      }

      private stampBrush(x: number, y: number) {
        this.dirt.erase(`cw-brush-${cfg.brushR}`, x - cfg.brushR - 4, y - cfg.brushR - 4);
        this.dirt.render();

        const minC = Math.max(0, Math.floor((x - cfg.brushR - CAR.x) / CELL));
        const maxC = Math.min(cols - 1, Math.floor((x + cfg.brushR - CAR.x) / CELL));
        const minR = Math.max(0, Math.floor((y - cfg.brushR - CAR.y) / CELL));
        const maxR = Math.min(rows - 1, Math.floor((y + cfg.brushR - CAR.y) / CELL));
        for (let c = minC; c <= maxC; c++) {
          for (let r = minR; r <= maxR; r++) {
            const cx = CAR.x + c * CELL + CELL / 2;
            const cy = CAR.y + r * CELL + CELL / 2;
            if (Math.hypot(cx - x, cy - y) <= cfg.brushR + CELL * 0.4) {
              this.cleaned.add(`${c},${r}`);
            }
          }
        }
      }

      scrub(x: number, y: number) {
        if (this.last) {
          const dist = Math.hypot(x - this.last.x, y - this.last.y);
          const steps = Math.max(1, Math.ceil(dist / 14));
          for (let i = 1; i <= steps; i++) {
            const k = i / steps;
            this.stampBrush(this.last.x + (x - this.last.x) * k, this.last.y + (y - this.last.y) * k);
          }
        } else {
          this.stampBrush(x, y);
        }
        this.last = { x, y };

        const pct = Math.min(100, Math.round((this.cleaned.size / needCells) * 100));
        this.progressText.setText(`${labels.lvl}  |  ${labels.progress}: ${pct}%`);
        this.drawBar(Math.min(1, this.cleaned.size / needCells));
        if (this.cleaned.size >= needCells) this.celebrate();
      }

      drawBar(ratio: number) {
        const bw = 200, bh = 14, bx = W / 2 - bw / 2, by = 44;
        this.progressBar.clear();
        this.progressBar.fillStyle(0x1e293b, 0.7); this.progressBar.fillRoundedRect(bx, by, bw, bh, 7);
        if (ratio > 0) {
          this.progressBar.fillStyle(ratio >= 1 ? 0xfbbf24 : 0x4ade80);
          this.progressBar.fillRoundedRect(bx, by, bw * ratio, bh, 7);
        }
        this.progressBar.lineStyle(1.5, 0x94a3b8); this.progressBar.strokeRoundedRect(bx, by, bw, bh, 7);
      }

      fail() {
        if (this.done) return;
        this.done = true;
        if (this.timerEvent) this.timerEvent.destroy();
        this.cameras.main.flash(400, 255, 80, 80);
        const p = this.add.graphics().setDepth(18);
        p.fillStyle(0x0f172a, 0.92); p.fillRoundedRect(W / 2 - 200, H / 2 - 50, 400, 100, 18);
        this.add.text(W / 2, H / 2, labels.timeUp, { fontSize: '26px', color: '#f87171', fontStyle: 'bold' })
          .setOrigin(0.5).setDepth(19);
        this.time.delayedCall(1600, () => onLoseRef.current());
      }

      celebrate() {
        if (this.done) return;
        this.done = true;
        if (this.timerEvent) this.timerEvent.destroy();

        let earnedStars = 3;
        if (cfg.hasTimer) {
          earnedStars = this.timerSecs > cfg.timerSecs * 0.5 ? 3 : this.timerSecs > cfg.timerSecs * 0.25 ? 2 : 1;
        }

        this.tweens.add({ targets: this.dirt, alpha: 0, duration: 700 });
        this.cameras.main.flash(500, 200, 255, 150);

        for (let i = 0; i < 18; i++) {
          this.time.delayedCall(i * 80, () => {
            const sx = Phaser.Math.Between(60, W - 60), sy = Phaser.Math.Between(60, H - 60);
            const s = this.add.text(sx, sy, '✨', { fontSize: '22px' }).setDepth(15).setAlpha(0);
            this.tweens.add({ targets: s, alpha: 1, scaleX: 1.5, scaleY: 1.5, duration: 300,
              yoyo: true, onComplete: () => s.destroy() });
          });
        }
        const p = this.add.graphics().setDepth(20);
        p.fillStyle(0x0f172a, 0.92); p.fillRoundedRect(W / 2 - 220, H / 2 - 65, 440, 130, 20);
        p.lineStyle(3, 0x22d3ee); p.strokeRoundedRect(W / 2 - 220, H / 2 - 65, 440, 130, 20);
        const wt = this.add.text(W / 2, H / 2, labels.win, {
          fontSize: '26px', color: '#e0f2fe', fontStyle: 'bold', align: 'center',
          wordWrap: { width: 400 },
        }).setOrigin(0.5).setDepth(21).setScale(0.2);
        this.tweens.add({ targets: wt, scaleX: 1, scaleY: 1, duration: 500, ease: 'Back.easeOut',
          onComplete: () => { this.time.delayedCall(1400, () => onWinRef.current(earnedStars)); },
        });
      }
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO, parent: containerRef.current, width: W, height: H,
      backgroundColor: '#0f172a',
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      input: { activePointers: 1 },
      scene: [Scene],
    });
    return () => { gameRef.current?.destroy(true); gameRef.current = null; };
  }, [phase, activeLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'select') {
    return (
      <LevelSelectScreen
        gameTitle={t('اِغْسِلِ السَّيَّارَة', 'Lave la voiture', 'Wash the car')}
        gameIcon="🧼"
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
    <div className="flex flex-col items-center gap-4 bg-slate-950 p-3 sm:p-4 min-h-screen justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setPhase('select')}
        className="self-start bg-white/90 hover:bg-white text-slate-900 font-black px-4 py-2 rounded-2xl shadow-lg border-2 border-cyan-300 cursor-pointer text-sm"
      >
        🚪 {t('خروج', 'Retour', 'Back')}
      </motion.button>
      <div
        ref={containerRef}
        className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border-4 border-cyan-400 touch-none"
        style={{ aspectRatio: '16/10' }}
      />
    </div>
  );
};

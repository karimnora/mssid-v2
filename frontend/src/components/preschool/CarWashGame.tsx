/**
 * CarWashGame.tsx
 * 4 niveaux : boue plus épaisse, plus de taches, minuteur niveaux 3 & 4.
 * Responsive : canvas Phaser Scale.FIT dans conteneur CSS 16/10.
 */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';

export interface CarWashGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

interface LevelCfg {
  winStrokes: number;
  mudAlpha: number;
  splotches: number;
  hasTimer: boolean;
  timerSecs: number;
}
const LEVELS: LevelCfg[] = [
  { winStrokes:  60, mudAlpha: 0.74, splotches:  6, hasTimer: false, timerSecs:  0 },
  { winStrokes:  90, mudAlpha: 0.85, splotches: 10, hasTimer: false, timerSecs:  0 },
  { winStrokes: 120, mudAlpha: 0.92, splotches: 16, hasTimer: true,  timerSecs: 90 },
  { winStrokes: 150, mudAlpha: 0.97, splotches: 24, hasTimer: true,  timerSecs: 60 },
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

export const CarWashGame: React.FC<CarWashGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('car_wash', 4);
  const [phase, setPhase]       = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef      = useRef<Phaser.Game | null>(null);
  const onWinRef     = useRef<(s: number) => void>(() => {});

  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  onWinRef.current = (s: number) => {
    completeLevel(activeLevel, s);
    setPhase('select');
  };

  useEffect(() => {
    if (phase !== 'play' || !containerRef.current) return;
    const W = 640, H = 420;
    const cfg = LEVELS[activeLevel - 1];

    const labels = {
      progress: t('نظافة', 'Propreté', 'Clean'),
      hint:     t('افرك الطين!', 'Frotte la boue !', 'Scrub the mud!'),
      win:      t('🌟 السيارة تلمع! 🌟', '🌟 La voiture brille ! 🌟', '🌟 Sparkling clean! 🌟'),
      lvl:      t(`المستوى ${activeLevel}`, `Niveau ${activeLevel}`, `Level ${activeLevel}`),
      timeUp:   t('انتهى الوقت! 😅', 'Temps écoulé ! 😅', 'Time\'s up! 😅'),
    };

    class Scene extends Phaser.Scene {
      private dirt!: Phaser.GameObjects.RenderTexture;
      private eraser!: Phaser.GameObjects.Graphics;
      private sponge!: Phaser.GameObjects.Graphics;
      private progressBar!: Phaser.GameObjects.Graphics;
      private progressText!: Phaser.GameObjects.Text;
      private timerText!: Phaser.GameObjects.Text | null;
      private strokes = 0;
      private done = false;
      private timerSecs: number;
      private timerEvent: Phaser.Time.TimerEvent | null = null;

      constructor() { super('CW'); this.timerSecs = cfg.timerSecs; this.timerEvent = null; this.timerText = null; }

      create() {
        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xbae6fd, 0xbae6fd, 0xfde68a, 0xfbbf24, 1);
        bg.fillRect(0, 0, W, H);
        const gnd = this.add.graphics();
        gnd.fillStyle(0x94a3b8); gnd.fillRect(0, H - 30, W, 30);
        gnd.fillStyle(0xcbd5e1); gnd.fillRect(0, H - 30, W, 8);

        // ── Clean car (depth 1) ───────────────────────────────────────────
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

        // ── Mud overlay RenderTexture (depth 3) ──────────────────────────
        this.dirt = this.add.renderTexture(0, 0, W, H).setDepth(3);
        this.dirt.fill(0x6b4c2a, cfg.mudAlpha);

        // Mud splotches
        const sg = this.add.graphics();
        sg.fillStyle(0x78350f, 0.6);
        for (let i = 0; i < cfg.splotches; i++) {
          sg.fillCircle(
            Phaser.Math.Between(50, W - 50),
            Phaser.Math.Between(40, H - 60),
            Phaser.Math.Between(25, 55),
          );
        }
        this.dirt.draw(sg, 0, 0); sg.destroy();

        // Drip splotches
        const drips = this.add.graphics().fillStyle(0x57330f, 0.55);
        for (let i = 0; i < cfg.splotches * 2; i++) {
          drips.fillEllipse(Phaser.Math.Between(40, W - 40), Phaser.Math.Between(40, H - 40), 7, 16);
        }
        this.dirt.draw(drips, 0, 0); drips.destroy();

        // ── Eraser graphic (sponge shape) ─────────────────────────────────
        this.eraser = this.add.graphics();
        this.eraser.fillStyle(0xffffff);
        this.eraser.fillRoundedRect(0, 0, 56, 42, 10);

        // ── Sponge cursor ─────────────────────────────────────────────────
        this.sponge = this.add.graphics().setDepth(8).setAlpha(0);
        this.sponge.fillStyle(0xfde68a); this.sponge.fillRoundedRect(-28, -21, 56, 42, 10);
        this.sponge.fillStyle(0xfbbf24, 0.4);
        for (let i = 0; i < 5; i++) this.sponge.fillCircle(-14 + i * 8, -4, 5);
        for (let i = 0; i < 4; i++) this.sponge.fillCircle(-10 + i * 8, 7, 4);
        this.sponge.lineStyle(2, 0xd97706); this.sponge.strokeRoundedRect(-28, -21, 56, 42, 10);

        // ── Progress bar ─────────────────────────────────────────────────
        this.progressBar = this.add.graphics().setDepth(10);
        this.progressText = this.add.text(W / 2, 12, `${labels.lvl}  |  ${labels.progress}: 0%`, {
          fontSize: '16px', color: '#fef08a', fontStyle: 'bold',
          backgroundColor: '#0f172a', padding: { x: 12, y: 5 },
        }).setOrigin(0.5, 0).setDepth(11);
        this.add.text(W / 2, H - 8, labels.hint, {
          fontSize: '12px', color: '#1e3a8a', fontStyle: 'bold',
        }).setOrigin(0.5, 1).setDepth(10);
        this.drawBar(0);

        // ── Timer ─────────────────────────────────────────────────────────
        if (cfg.hasTimer) {
          this.timerText = this.add.text(W - 14, 14,
            `⏱️ ${this.timerSecs}s`, {
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
                this.cameras.main.flash(400, 255, 80, 80);
                const p = this.add.graphics().setDepth(18);
                p.fillStyle(0x0f172a, 0.92); p.fillRoundedRect(W / 2 - 200, H / 2 - 50, 400, 100, 18);
                this.add.text(W / 2, H / 2, labels.timeUp, { fontSize: '26px', color: '#f87171', fontStyle: 'bold' })
                  .setOrigin(0.5).setDepth(19);
                this.time.delayedCall(1800, () => onWinRef.current(1));
              }
            },
          });
        }

        // ── Input ─────────────────────────────────────────────────────────
        this.input.on('pointermove', (ptr: Phaser.Input.Pointer) => {
          this.sponge.setPosition(ptr.x, ptr.y).setAlpha(1);
          if (ptr.isDown && !this.done) this.scrub(ptr.x, ptr.y);
        });
        this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
          if (!this.done) this.scrub(ptr.x, ptr.y);
        });
        this.input.on('pointerout', () => this.sponge.setAlpha(0));
      }

      scrub(x: number, y: number) {
        this.dirt.erase(this.eraser, x - 28, y - 21);
        this.strokes = Math.min(this.strokes + 1, cfg.winStrokes);
        const pct = Math.round((this.strokes / cfg.winStrokes) * 100);
        this.progressText.setText(`${labels.lvl}  |  ${labels.progress}: ${pct}%`);
        this.drawBar(this.strokes / cfg.winStrokes);
        if (this.strokes >= cfg.winStrokes) this.celebrate();
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

      celebrate() {
        if (this.done) return;
        this.done = true;
        if (this.timerEvent) this.timerEvent.destroy();

        // Compute stars: more time left = more stars
        let earnedStars = 3;
        if (cfg.hasTimer) {
          earnedStars = this.timerSecs > cfg.timerSecs * 0.5 ? 3 : this.timerSecs > cfg.timerSecs * 0.25 ? 2 : 1;
        }

        this.tweens.add({ targets: this.dirt, alpha: 0, duration: 800 });
        this.cameras.main.flash(600, 200, 255, 150);

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
          onComplete: () => { this.time.delayedCall(1500, () => onWinRef.current(earnedStars)); },
        });
      }

      update() {}
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO, parent: containerRef.current, width: W, height: H,
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: [Scene],
    });
    return () => { gameRef.current?.destroy(true); };
  }, [phase, activeLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'select') {
    return (
      <LevelSelectScreen
        gameTitle={t('اغسل السيارة', 'Lave la Voiture', 'Car Wash Fun')}
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
      <button onClick={() => setPhase('select')}
        className="self-start bg-white/90 hover:bg-white text-slate-900 font-black px-4 py-2 rounded-2xl shadow-lg border-2 border-cyan-300 cursor-pointer text-sm">
        🚪 {t('خروج', 'Retour', 'Back')}
      </button>
      <div ref={containerRef}
        className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border-4 border-cyan-400"
        style={{ aspectRatio: '16/10' }} />
    </div>
  );
};

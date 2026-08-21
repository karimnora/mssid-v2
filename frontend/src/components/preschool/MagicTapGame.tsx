/**
 * MagicTapGame.tsx
 * "ديدو الساحر / Dido le Magicien" — Phaser tap-anywhere magic show.
 * Tap anywhere on screen → burst of themed emoji particles fly from the tap point.
 * No wrong answer possible — pure sensory & motor exploration.
 * 4 thematic levels: Night Stars / Butterfly Garden / Ocean World / Big Party.
 */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';

export interface MagicTapGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

interface MagicCfg {
  bgColor: number;
  bgEmojis: string[];
  tapEmojis: string[];
  winTaps: number;
  particleCount: number;
  themeColor: number; // golden bar color
}

const LEVELS: MagicCfg[] = [
  {
    bgColor: 0x0F172A,
    bgEmojis:  ['⭐','🌟','💫','🌙','🌌','✨'],
    tapEmojis: ['⭐','🌟','💫','✨','🌙','🪐','🌌','☄️'],
    winTaps: 12, particleCount: 7, themeColor: 0xFDE68A,
  },
  {
    bgColor: 0x064E3B,
    bgEmojis:  ['🌸','🍀','🌺','🦋','🌼'],
    tapEmojis: ['🦋','🐝','🌸','🌺','🌼','🌻','🍀','🌈','🐞'],
    winTaps: 16, particleCount: 8, themeColor: 0x6EE7B7,
  },
  {
    bgColor: 0x0C4A6E,
    bgEmojis:  ['🐠','🐡','🦑','🐙','🌊'],
    tapEmojis: ['🐠','🐡','🐬','🦈','⭐','🌊','🦀','🦞','🐚','🐋'],
    winTaps: 20, particleCount: 9, themeColor: 0x7DD3FC,
  },
  {
    bgColor: 0x1E1B4B,
    bgEmojis:  ['🎊','🎉','🏆','🦄','🎆'],
    tapEmojis: ['🎉','🎊','🏆','🌟','🦄','🎈','💥','🎆','🥳','🎁','🎵','💎'],
    winTaps: 25, particleCount: 11, themeColor: 0xC4B5FD,
  },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '⭐', diffLabel: '⭐',
    titleAr: 'نجوم اللَّيل',           titleFr: 'Étoiles de Nuit',        titleEn: 'Night Stars',
    descAr:  'اِلمَسِ اللَّيلَ لِيَتَلَألَأ!', descFr:  'Touche pour faire briller les étoiles!', descEn: 'Tap to make the stars shine!',
    gradient: 'from-indigo-600 to-violet-700' },
  { level: 2, emoji: '🦋', diffLabel: '⭐⭐',
    titleAr: 'حَدِيقَةُ الفَرَاشَات',       titleFr: 'Jardin des Papillons',     titleEn: 'Butterfly Garden',
    descAr:  'اِلمَسِ الحَدِيقَةَ لِيَطِيرَ!', descFr:  'Touche pour faire voler!',  descEn: 'Tap to make them fly!',
    gradient: 'from-emerald-500 to-teal-600' },
  { level: 3, emoji: '🐠', diffLabel: '⭐⭐⭐',
    titleAr: 'عَالَمُ البِحَار',           titleFr: 'Monde Marin',               titleEn: 'Ocean World',
    descAr:  'اِلمَسِ المَاءَ وَشَاهِد!',  descFr:  'Touche l\'eau et observe!',  descEn: 'Tap the water and watch!',
    gradient: 'from-blue-500 to-cyan-600' },
  { level: 4, emoji: '🎉', diffLabel: '🏆',
    titleAr: 'الحَفْلَةُ الكَبِيرَة!',     titleFr: 'Grande Fête!',              titleEn: 'Big Party!',
    descAr:  'تَحَدِّي الفَرَح!',          descFr:  'Défi de la joie!',           descEn: 'The joy challenge!',
    gradient: 'from-violet-600 to-fuchsia-700' },
];

// ── Web Audio ──────────────────────────────────────────────────────────────────
function makeMagicSound(ctx: AudioContext) {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    const t0 = ctx.currentTime + i * 0.07;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.25, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
    osc.start(t0); osc.stop(t0 + 0.2);
  });
}

function makeWinSound(ctx: AudioContext) {
  [523, 659, 784, 880, 1047, 1318].forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'triangle';
    const t0 = ctx.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0.35, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.25);
    osc.start(t0); osc.stop(t0 + 0.28);
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export const MagicTapGame: React.FC<MagicTapGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('magic_tap', 4);
  const [phase, setPhase]       = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef      = useRef<Phaser.Game | null>(null);
  const onWinRef     = useRef<(s: number) => void>(() => {});
  const audioCtxRef  = useRef<AudioContext | null>(null);

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
      tapHint: t(
        '✨ اِلْمَسِ الشَّاشَةَ وَشَاهِدِ السِّحْر! ✨',
        '✨ Touche l\'écran et vois la magie! ✨',
        '✨ Tap the screen and see the magic! ✨'
      ),
      win: t('🎉 سِحْرٌ رَائِع! أَحْسَنْت! 🏆', '🎉 Magie parfaite ! Bravo ! 🏆', '🎉 Magical! Well done! 🏆'),
      lvl: t(`المستوى ${activeLevel}`, `Niveau ${activeLevel}`, `Level ${activeLevel}`),
      progress: (n: number, tot: number) =>
        t(`${n} / ${tot} ✨`, `${n} / ${tot} ✨`, `${n} / ${tot} ✨`),
    };

    class MagicScene extends Phaser.Scene {
      private taps = 0;
      private done = false;
      private progressFill!: Phaser.GameObjects.Graphics;
      private countText!: Phaser.GameObjects.Text;

      preload() {}

      create() {
        // ── Themed background ──────────────────────────────────────────────
        const bg = this.add.graphics();
        bg.fillStyle(cfg.bgColor);
        bg.fillRect(0, 0, W, H);

        // Subtle vignette
        const vig = this.add.graphics();
        vig.fillStyle(0x000000, 0.35);
        vig.fillRect(0, 0, W, H);

        // Animated background decorations
        cfg.bgEmojis.forEach((emoji, i) => {
          const x = Phaser.Math.Between(30, W - 30);
          const y = Phaser.Math.Between(60, H - 60);
          const scale = Phaser.Math.FloatBetween(0.7, 1.6);
          const txt = this.add.text(x, y, emoji, { fontSize: '22px' })
            .setOrigin(0.5).setAlpha(0.22).setScale(scale);
          this.tweens.add({
            targets: txt,
            y: y - Phaser.Math.Between(14, 28),
            duration: Phaser.Math.Between(1800, 3200),
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            delay: i * 280,
          });
        });

        // ── Progress bar ───────────────────────────────────────────────────
        const barH = 20, barX = 20, barY = 14, barW = W - 40;
        const barBg = this.add.graphics();
        barBg.fillStyle(0xffffff, 0.15);
        barBg.fillRoundedRect(barX, barY, barW, barH, 10);

        this.progressFill = this.add.graphics();
        this.progressFill.fillStyle(cfg.themeColor, 1);
        this.progressFill.fillRoundedRect(barX, barY, 0, barH, 10);

        this.countText = this.add.text(W / 2, barY + barH / 2, labels.progress(0, cfg.winTaps), {
          fontSize: '13px', color: '#ffffff', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(2);

        // Level label
        this.add.text(barX + 4, barY + barH / 2, labels.lvl, {
          fontSize: '12px', color: '#ffffffbb',
        }).setOrigin(0, 0.5).setDepth(2);

        // ── Tap hint text (pulsing) ────────────────────────────────────────
        const hint = this.add.text(W / 2, H - 32, labels.tapHint, {
          fontSize: '17px', color: '#ffffff', fontStyle: 'bold', align: 'center',
        }).setOrigin(0.5);
        this.tweens.add({
          targets: hint, alpha: 0.3,
          duration: 750, yoyo: true, repeat: -1,
        });

        // ── "Magic wand" cursor icon that follows the pointer ──────────────
        const wand = this.add.text(0, 0, '🪄', { fontSize: '28px' }).setOrigin(0.5).setAlpha(0);
        this.input.on('pointermove', (ptr: Phaser.Input.Pointer) => {
          wand.setPosition(ptr.x - 6, ptr.y - 6).setAlpha(0.7);
        });
        this.input.on('pointerout', () => wand.setAlpha(0));

        // ── Main tap handler ──────────────────────────────────────────────
        this.input.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
          if (this.done) return;
          this.fireMagic(ptr.x, ptr.y);
        });
      }

      fireMagic(x: number, y: number) {
        // Ripple ring
        const ripple = this.add.graphics();
        ripple.lineStyle(3, cfg.themeColor, 0.8);
        ripple.strokeCircle(x, y, 18);
        this.tweens.add({
          targets: ripple, scaleX: 5, scaleY: 5, alpha: 0,
          duration: 500, ease: 'Power2',
          onComplete: () => ripple.destroy(),
        });

        // Emoji particle burst
        const count = cfg.particleCount + Phaser.Math.Between(-2, 2);
        for (let i = 0; i < count; i++) {
          const emoji = cfg.tapEmojis[Phaser.Math.Between(0, cfg.tapEmojis.length - 1)];
          const fontSize = Phaser.Math.Between(20, 40);
          const txt = this.add.text(x, y, emoji, { fontSize: `${fontSize}px` })
            .setOrigin(0.5).setDepth(5);

          const spreadAngle = (i / count) * 360 + Phaser.Math.Between(-25, 25);
          const dist = Phaser.Math.Between(55, 175);
          const tx = x + Math.cos(Phaser.Math.DegToRad(spreadAngle)) * dist;
          const ty = y + Math.sin(Phaser.Math.DegToRad(spreadAngle)) * dist;

          this.tweens.add({
            targets: txt, x: tx, y: ty,
            scaleX: 0, scaleY: 0, alpha: 0,
            duration: Phaser.Math.Between(700, 1400), ease: 'Power2.easeOut',
            onComplete: () => txt.destroy(),
          });
        }

        // Sound
        try {
          if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
          makeMagicSound(audioCtxRef.current);
        } catch { /* silence */ }

        this.taps++;
        this.updateProgress();

        if (this.taps >= cfg.winTaps) {
          this.done = true;
          this.time.delayedCall(300, () => this.celebrate());
        }
      }

      updateProgress() {
        this.progressFill.clear();
        const barX = 20, barY = 14, barW = W - 40, barH = 20;
        const filled = Math.min(this.taps / cfg.winTaps, 1) * barW;
        this.progressFill.fillStyle(cfg.themeColor, 1);
        this.progressFill.fillRoundedRect(barX, barY, filled, barH, 10);
        this.countText.setText(labels.progress(this.taps, cfg.winTaps));
      }

      celebrate() {
        // Full-screen burst
        for (let i = 0; i < 30; i++) {
          const emoji = Phaser.Utils.Array.GetRandom([
            ...cfg.tapEmojis, '🎉', '🏆', '⭐', '🌟',
          ]);
          const txt = this.add.text(W / 2, H / 2, emoji, { fontSize: `${Phaser.Math.Between(22, 42)}px` })
            .setOrigin(0.5).setDepth(6);
          const angle = Phaser.Math.Between(0, 360);
          const dist = Phaser.Math.Between(90, 280);
          this.tweens.add({
            targets: txt,
            x: W / 2 + Math.cos(Phaser.Math.DegToRad(angle)) * dist,
            y: H / 2 + Math.sin(Phaser.Math.DegToRad(angle)) * dist,
            scaleX: 0, scaleY: 0, alpha: 0,
            duration: Phaser.Math.Between(900, 1600), ease: 'Power2',
            onComplete: () => txt.destroy(),
          });
        }

        try {
          if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
          makeWinSound(audioCtxRef.current);
        } catch { /* silence */ }

        // Win panel
        this.time.delayedCall(300, () => {
          const panel = this.add.graphics().setDepth(10);
          panel.fillStyle(0x000000, 0.75);
          panel.fillRoundedRect(W / 2 - 175, H / 2 - 80, 350, 160, 24);

          this.add.text(W / 2, H / 2 - 40, labels.win, {
            fontSize: '20px', color: '#ffffff', fontStyle: 'bold', align: 'center', wordWrap: { width: 320 },
          }).setOrigin(0.5).setDepth(11);

          const starsText = this.add.text(W / 2, H / 2 + 20, '⭐⭐⭐', {
            fontSize: '38px', align: 'center',
          }).setOrigin(0.5).setDepth(11).setScale(0.2);
          this.tweens.add({ targets: starsText, scaleX: 1, scaleY: 1, duration: 400, ease: 'Back.easeOut' });

          this.time.delayedCall(2400, () => onWinRef.current(3));
        });
      }
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: W, height: H,
      parent: containerRef.current,
      backgroundColor: `#${cfg.bgColor.toString(16).padStart(6, '0')}`,
      scene: MagicScene,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    });
    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, [phase, activeLevel]);

  // ── Level select phase ────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <LevelSelectScreen
        gameTitle={t('دِيدُو السَّاحِر', 'Dido le Magicien', 'Dido the Magician')}
        gameIcon="🪄"
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
    <div className="flex flex-col items-center bg-slate-950 min-h-screen w-full">
      {/* Back button */}
      <button
        onClick={() => { gameRef.current?.destroy(true); setPhase('select'); }}
        className="self-start m-3 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-2xl
                   font-bold text-sm backdrop-blur-sm transition-all active:scale-95 border border-white/20"
      >
        ◀ {t('رجوع', 'Retour', 'Back')}
      </button>
      {/* Phaser canvas host */}
      <div
        ref={containerRef}
        className="w-full max-w-2xl"
        style={{ aspectRatio: '640/420' }}
      />
    </div>
  );
};

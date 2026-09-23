/**
 * LittleFisherGame.tsx — « Le Petit Pêcheur »
 * Poissons qui nagent : on les touche. Les algues, non.
 */
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { motion } from 'motion/react';
import { LevelSelectScreen, LevelDef } from './LevelSelectScreen';
import { useLevelProgress } from './useLevelProgress';
import {
  playBubblePop,
  playGentleNudge,
  playSuccessChime,
  resumeTownAudio,
  usePreschoolSpeech,
} from './usePreschoolAudio';

export interface LittleFisherGameProps { onExit?: () => void; language?: 'ar' | 'fr' | 'en'; }

interface LevelCfg {
  spawnDelay: number;
  minSpeed: number; maxSpeed: number;
  winCount: number;
  fish: string[];
  seaweedChance: number;
  fontSize: number;
  emoji: string;
  missionAr: string; missionFr: string; missionEn: string;
}

const LEVELS: LevelCfg[] = [
  { spawnDelay: 1400, minSpeed: 40, maxSpeed: 70, winCount: 6, fish: ['🐠'], seaweedChance: 0, fontSize: 44, emoji: '🐠',
    missionAr: 'اِلْمِسِ السَّمَكَ! سَمَكٌ كَبِيرٌ وَبَطِيء',
    missionFr: 'Touche les poissons ! Gros et lents',
    missionEn: 'Tap the fish! Big and slow' },
  { spawnDelay: 1200, minSpeed: 50, maxSpeed: 90, winCount: 8, fish: ['🐠', '🐟'], seaweedChance: 0, fontSize: 42, emoji: '🐟',
    missionAr: 'سَمَكَانِ! اِلْتَقِطْهُمَا',
    missionFr: 'Deux poissons ! Attrape-les',
    missionEn: 'Two kinds of fish! Catch them' },
  { spawnDelay: 1050, minSpeed: 60, maxSpeed: 105, winCount: 10, fish: ['🐠', '🐟', '🐡'], seaweedChance: 0, fontSize: 40, emoji: '🐡',
    missionAr: 'اِلْتَقِطِ السَّمَكَةَ الْمُنْتَفِخَة أَيْضاً!',
    missionFr: 'Attrape aussi le poisson-globe !',
    missionEn: 'Catch the pufferfish too!' },
  { spawnDelay: 950, minSpeed: 70, maxSpeed: 120, winCount: 10, fish: ['🐠', '🐟', '🐚'], seaweedChance: 0, fontSize: 38, emoji: '🐚',
    missionAr: 'اِلْتَقِطِ السَّمَكَ وَالصَّدَف!',
    missionFr: 'Attrape les poissons et les coquillages !',
    missionEn: 'Catch the fish and the shells!' },
  { spawnDelay: 900, minSpeed: 80, maxSpeed: 130, winCount: 12, fish: ['🐠', '🐟', '🐡'], seaweedChance: 0.22, fontSize: 36, emoji: '🌿',
    missionAr: 'السَّمَكُ نَعَمْ، الطُّحْلُبُ لَا!',
    missionFr: 'Le poisson oui, l’algue non !',
    missionEn: 'Fish yes, seaweed no!' },
  { spawnDelay: 800, minSpeed: 90, maxSpeed: 150, winCount: 12, fish: ['🐠', '🐟', '🐡', '🦀'], seaweedChance: 0.25, fontSize: 34, emoji: '🦀',
    missionAr: 'اِلْتَقِطِ السَّرَطَان أَيْضاً! أَسْرِعْ!',
    missionFr: 'Attrape aussi le crabe ! Plus vite !',
    missionEn: 'Catch the crab too! Faster!' },
  { spawnDelay: 720, minSpeed: 100, maxSpeed: 170, winCount: 14, fish: ['🐠', '🐟', '🐡', '🐚'], seaweedChance: 0.3, fontSize: 32, emoji: '🪸',
    missionAr: 'كَثِيرٌ مِنَ الطُّحْلُب! اِنْتَبِه',
    missionFr: 'Beaucoup d’algues ! Attention',
    missionEn: 'Lots of seaweed! Be careful' },
  { spawnDelay: 640, minSpeed: 110, maxSpeed: 190, winCount: 14, fish: ['🐠', '🐟', '🐡', '🐚', '🦀', '🐋'], seaweedChance: 0.28, fontSize: 32, emoji: '⛵',
    missionAr: 'مِينَاءُ الصَّيْد! اِمْلَإِ السَّلَّة',
    missionFr: 'Le port ! Remplis le panier',
    missionEn: 'The harbour! Fill the basket' },
];

const LEVEL_DEFS: Omit<LevelDef, 'unlocked' | 'earnedStars'>[] = [
  { level: 1, emoji: '🐠', diffLabel: '⭐',
    titleAr: 'سمك كبير', titleFr: 'Gros poissons', titleEn: 'Big fish',
    descAr: 'بطيء وسهل', descFr: 'Lents et faciles', descEn: 'Slow and easy',
    gradient: 'from-sky-400 to-cyan-500' },
  { level: 2, emoji: '🐟', diffLabel: '⭐',
    titleAr: 'سمكتان', titleFr: 'Deux poissons', titleEn: 'Two fish',
    descAr: 'أنواع أكثر', descFr: 'Plus d’espèces', descEn: 'More kinds',
    gradient: 'from-cyan-400 to-teal-500' },
  { level: 3, emoji: '🐡', diffLabel: '⭐⭐',
    titleAr: 'السمكة المنتفخة', titleFr: 'Le poisson-globe', titleEn: 'Pufferfish',
    descAr: 'ثلاثة أسماك', descFr: 'Trois poissons', descEn: 'Three fish',
    gradient: 'from-teal-400 to-emerald-500' },
  { level: 4, emoji: '🐚', diffLabel: '⭐⭐',
    titleAr: 'الصدف', titleFr: 'Coquillages', titleEn: 'Shells',
    descAr: 'سمك وصدف', descFr: 'Poissons et coquillages', descEn: 'Fish and shells',
    gradient: 'from-amber-300 to-sky-500' },
  { level: 5, emoji: '🌿', diffLabel: '⭐⭐',
    titleAr: 'ليس الطحلب', titleFr: 'Pas l’algue !', titleEn: 'Not the seaweed!',
    descAr: 'السمك نعم، الطحلب لا', descFr: 'Poisson oui, algue non', descEn: 'Fish yes, seaweed no',
    gradient: 'from-lime-500 to-teal-600' },
  { level: 6, emoji: '🦀', diffLabel: '⭐⭐⭐',
    titleAr: 'السرطان', titleFr: 'Le crabe', titleEn: 'The crab',
    descAr: 'أسرع', descFr: 'Plus rapide', descEn: 'Faster',
    gradient: 'from-orange-400 to-rose-500' },
  { level: 7, emoji: '🪸', diffLabel: '⭐⭐⭐',
    titleAr: 'الشعاب', titleFr: 'Le récif', titleEn: 'The reef',
    descAr: 'كثير من الطحلب', descFr: 'Beaucoup d’algues', descEn: 'Lots of seaweed',
    gradient: 'from-cyan-600 to-indigo-600' },
  { level: 8, emoji: '⛵', diffLabel: '🏆',
    titleAr: 'الميناء', titleFr: 'Le port', titleEn: 'The harbour',
    descAr: 'املأ السلة', descFr: 'Remplis le panier', descEn: 'Fill the basket',
    gradient: 'from-sky-500 to-blue-700' },
];

export const LittleFisherGame: React.FC<LittleFisherGameProps> = ({ onExit, language = 'fr' }) => {
  const { maxUnlocked, stars, completeLevel } = useLevelProgress('little_fisher', 8);
  const [phase, setPhase] = useState<'select' | 'play'>('select');
  const [activeLevel, setLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const onWinRef = useRef<(s: number) => void>(() => {});

  const { speak } = usePreschoolSpeech(language);
  const t = (ar: string, fr: string, en: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;
  const cfgPlay = LEVELS[activeLevel - 1];
  const mission = t(cfgPlay.missionAr, cfgPlay.missionFr, cfgPlay.missionEn);

  onWinRef.current = (s: number) => {
    completeLevel(activeLevel, s);
    setPhase('select');
  };

  useEffect(() => {
    if (phase !== 'play') return;
    const timer = window.setTimeout(() => speak(mission), 350);
    return () => window.clearTimeout(timer);
  }, [phase, activeLevel, mission, speak]);

  useEffect(() => {
    if (phase !== 'play' || !containerRef.current) return;
    const W = 800, H = 500;
    const cfg = LEVELS[activeLevel - 1];

    const labels = {
      score: t('صيد', 'Prises', 'Catch'),
      tap: t('👆 اِلْمِسِ السَّمَكَ', '👆 Touche le poisson', '👆 Tap the fish'),
      win: t('🎉 صَيَّادٌ مَاهِر!', '🎉 Bravo le pêcheur !', '🎉 Super fisher!'),
      seaweed: t('🌿 طُحْلُب!', '🌿 Algue !', '🌿 Seaweed!'),
      lvl: t(`م${activeLevel}`, `N${activeLevel}`, `L${activeLevel}`),
    };

    class Scene extends Phaser.Scene {
      private score = 0;
      private misses = 0;
      private done = false;
      private scoreTxt!: Phaser.GameObjects.Text;

      constructor() { super('Fish'); }

      create() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x7dd3fc, 0x7dd3fc, 0x0369a1, 0x0e7490, 1);
        bg.fillRect(0, 0, W, H);

        this.add.circle(90, 48, 30, 0xfde047, 0.9);
        this.add.circle(90, 48, 44, 0xfacc15, 0.25);

        const sand = this.add.graphics();
        sand.fillStyle(0xfde68a, 0.95);
        sand.fillEllipse(W / 2, H + 10, W + 80, 90);
        sand.fillStyle(0xfcd34d, 0.5);
        sand.fillEllipse(180, H - 8, 120, 28);
        sand.fillEllipse(620, H - 6, 140, 24);

        this.add.text(80, H - 42, '⛵', { fontSize: '48px' }).setDepth(2);
        this.add.text(W - 90, H - 36, '🏖️', { fontSize: '36px' }).setDepth(2);

        [[160, 70], [420, 50], [680, 80]].forEach(([cx, cy]) => {
          const cg = this.add.graphics().fillStyle(0xffffff, 0.55);
          cg.fillCircle(cx, cy, 18); cg.fillCircle(cx + 22, cy - 6, 14);
          cg.fillCircle(cx - 16, cy - 3, 12);
        });

        this.scoreTxt = this.add.text(W / 2, 12, `${labels.lvl}  ·  ${labels.score}: 0 / ${cfg.winCount}`, {
          fontSize: '18px', color: '#0f172a', fontStyle: 'bold',
          backgroundColor: '#ffffffcc', padding: { x: 12, y: 6 },
        }).setOrigin(0.5, 0).setDepth(10);

        this.add.text(W / 2, H - 8, labels.tap, {
          fontSize: '14px', color: '#0f172a', fontStyle: 'bold',
        }).setOrigin(0.5, 1).setDepth(10);

        this.time.addEvent({ delay: cfg.spawnDelay, loop: true, callback: () => { if (!this.done) this.spawn(); } });
        this.time.delayedCall(160, () => { if (!this.done) this.spawn(); });
        this.time.delayedCall(500, () => { if (!this.done) this.spawn(); });
      }

      spawn() {
        const isWeed = cfg.seaweedChance > 0 && Math.random() < cfg.seaweedChance;
        const emoji = isWeed ? (Math.random() < 0.5 ? '🌿' : '🪸') : Phaser.Math.RND.pick(cfg.fish);
        const fromLeft = Math.random() < 0.5;
        const x = fromLeft ? -40 : W + 40;
        const y = Phaser.Math.Between(90, H - 90);
        const speed = Phaser.Math.Between(cfg.minSpeed, cfg.maxSpeed) * (fromLeft ? 1 : -1);

        const t = this.add.text(x, y, emoji, { fontSize: `${cfg.fontSize}px` })
          .setOrigin(0.5)
          .setDepth(5)
          .setInteractive({ useHandCursor: true });
        (t as Phaser.GameObjects.Text & { isWeed?: boolean }).isWeed = isWeed;
        // 🐠🐟 face left in emoji fonts — flip only when swimming to the right.
        if (fromLeft) t.setFlipX(true);

        this.tweens.add({
          targets: t,
          y: y + Phaser.Math.Between(12, 28),
          duration: Phaser.Math.Between(700, 1200),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

        this.tweens.add({
          targets: t,
          x: fromLeft ? W + 50 : -50,
          duration: (W + 100) / Math.abs(speed) * 1000,
          ease: 'Linear',
          onComplete: () => { if (t.active) t.destroy(); },
        });

        t.on('pointerdown', () => {
          if (this.done || !t.active) return;
          this.catch(t as Phaser.GameObjects.Text & { isWeed?: boolean });
        });
      }

      catch(item: Phaser.GameObjects.Text & { isWeed?: boolean }) {
        const { x, y } = item;
        const weed = !!item.isWeed;
        item.destroy();
        if (weed) {
          this.misses++;
          playGentleNudge();
          this.cameras.main.shake(180, 0.008);
          const tx = this.add.text(x, y - 8, labels.seaweed, {
            fontSize: '18px', color: '#166534', fontStyle: 'bold',
          }).setOrigin(0.5).setDepth(12);
          this.tweens.add({ targets: tx, y: y - 50, alpha: 0, duration: 700, onComplete: () => tx.destroy() });
          return;
        }
        this.score++;
        this.scoreTxt.setText(`${labels.lvl}  ·  ${labels.score}: ${this.score} / ${cfg.winCount}`);
        playBubblePop();
        const star = this.add.text(x, y, '⭐', { fontSize: '24px' }).setOrigin(0.5).setDepth(9);
        this.tweens.add({ targets: star, y: y - 48, alpha: 0, duration: 650, onComplete: () => star.destroy() });
        if (this.score >= cfg.winCount) this.celebrate();
      }

      celebrate() {
        this.done = true;
        playSuccessChime();
        const earnedStars = this.misses === 0 ? 3 : this.misses <= 2 ? 2 : 1;
        this.cameras.main.flash(500, 180, 230, 255);
        ['🎉', '🐠', '🐟', '⛵', '⭐', '🥳'].forEach((em, i) => {
          this.time.delayedCall(i * 110, () => {
            const tx = this.add.text(Phaser.Math.Between(80, W - 80), Phaser.Math.Between(80, H - 80), em, { fontSize: '36px' })
              .setDepth(20).setAlpha(0);
            this.tweens.add({
              targets: tx, alpha: 1, y: tx.y - 100, duration: 1300,
              onComplete: () => this.tweens.add({ targets: tx, alpha: 0, duration: 400 }),
            });
          });
        });
        const starsStr = '★'.repeat(earnedStars) + '☆'.repeat(3 - earnedStars);
        const p = this.add.graphics().setDepth(18);
        p.fillStyle(0x0e7490, 0.94); p.fillRoundedRect(W / 2 - 220, H / 2 - 70, 440, 140, 22);
        p.lineStyle(3, 0x7dd3fc); p.strokeRoundedRect(W / 2 - 220, H / 2 - 70, 440, 140, 22);
        const wt = this.add.text(W / 2, H / 2 - 18, labels.win, {
          fontSize: '24px', color: '#ecfeff', fontStyle: 'bold',
        }).setOrigin(0.5).setDepth(19).setScale(0.2);
        this.tweens.add({
          targets: wt, scaleX: 1, scaleY: 1, duration: 450, ease: 'Back.easeOut',
          onComplete: () => {
            this.add.text(W / 2, H / 2 + 32, starsStr, { fontSize: '32px', color: '#fde047' }).setOrigin(0.5).setDepth(19);
            this.time.delayedCall(1600, () => onWinRef.current(earnedStars));
          },
        });
      }
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
        gameTitle={t('الصَّيَّادُ الصَّغِير', 'Le petit pêcheur', 'The little fisherman')}
        gameIcon="🎣"
        language={language}
        onExit={onExit ?? (() => {})}
        onSelectLevel={(lvl) => { setLevel(lvl); setPhase('play'); }}
        levels={LEVEL_DEFS.map((d) => ({
          ...d,
          unlocked: d.level <= maxUnlocked,
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
        onClick={() => setPhase('select')}
        className="absolute top-4 start-4 z-10 bg-white hover:bg-sky-50 text-slate-800 font-black
                   px-4 py-2 rounded-2xl shadow-md border-2 border-sky-200 cursor-pointer
                   flex items-center gap-2 text-sm"
      >
        🚪 {t('خروج', 'Retour', 'Back')}
      </motion.button>

      <div className="flex items-center justify-center gap-3 mt-12 sm:mt-2 max-w-xl px-14">
        <p className="text-3xl shrink-0">{cfgPlay.emoji}</p>
        <p className="text-base sm:text-lg font-black text-slate-800 text-center leading-snug">{mission}</p>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => { resumeTownAudio(); speak(mission); }}
          className="min-h-12 min-w-12 shrink-0 rounded-2xl bg-white shadow-md border-2 border-sky-300 text-2xl"
          aria-label={t('استمع', 'Écouter', 'Listen')}
        >
          🔊
        </motion.button>
      </div>

      <div
        ref={containerRef}
        className="w-full max-w-4xl aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border-4 border-sky-300"
      />
    </div>
  );
};

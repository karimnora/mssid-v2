/**
 * DidouVirtualCompanion.tsx — الرفيق الافتراضي التفاعلي ديدو (Le Compagnon Virtuel Évolutif)
 * Mascotte vivante et interactive pour fidéliser l'enfant (1AP - 5AP) :
 * - Choix de l'espèce : Fennec des Sables 🦊 ou Aiglon de l'Atlas 🦅
 * - 3 Stades d'évolution selon le niveau / XP de l'élève (Bébé 🐾 -> Écolier 🎒 -> Grand Sage 👑)
 * - Système d'humeur & d'énergie (0-100%) avec friandises algériennes (Dattes de Biskra, Lait, Miel de Djurdjura)
 * - Dialogues motivants vocaux (Arabe / Français) avec synthèse sonore WebAudio
 * - Réactions interactives aux caresses et clics (Sauts, cœurs flottants, ronronnement)
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Utensils, MessageCircle, Shirt, Volume2, Award, Zap, Smile } from 'lucide-react';
import { DidouAvatarConfig, DidouPetSpecies, DidouMood, DidouOutfitId } from '../types/ecosystem';
import { DIDOU_OUTFITS_LIST, DIDOU_TREATS_LIST, DIDOU_DIALOGUES_AR, DIDOU_DIALOGUES_FR } from '../data/outfitsData';
import { speakText, stopSpeech } from '../utils/speech';
import { useLocaleContext } from '../context/LocaleContext';
import { Didou3DAvatar } from './Didou3DAvatar';
import { getDidouEnergy, getDidouFriendshipLevel, getDidouStage } from '../utils/didouCompanion';

export interface DidouVirtualCompanionProps {
  avatarConfig?: DidouAvatarConfig;
  goldCoins?: number;
  xp?: number;
  level?: number;
  userName?: string;
  isFloating?: boolean;
  onOpenDressingRoom?: () => void;
  onFeed?: (treatId: string, energyGained: number, xpGained: number, costCoins: number) => void;
  onPat?: () => void;
  onUpdateConfig?: (config: DidouAvatarConfig) => void;
}

export const DidouVirtualCompanion: React.FC<DidouVirtualCompanionProps> = ({
  avatarConfig,
  goldCoins = 150,
  xp = 0,
  level = 1,
  userName,
  isFloating = false,
  onOpenDressingRoom,
  onFeed,
  onPat,
  onUpdateConfig,
}) => {
  const { locale, direction } = useLocaleContext();
  const isFrench = locale === 'fr';

  const species: DidouPetSpecies = avatarConfig?.species || 'fennec';
  const activeOutfitId = avatarConfig?.activeOutfit || 'default';
  const energy = getDidouEnergy(avatarConfig);
  const friendshipLevel = getDidouFriendshipLevel(avatarConfig);

  const [currentMood, setCurrentMood] = useState<DidouMood>(
    energy < 30 ? 'hungry' : (avatarConfig?.mood || 'happy')
  );
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showTreatsMenu, setShowTreatsMenu] = useState<boolean>(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isPettingAnimation, setIsPettingAnimation] = useState<boolean>(false);

  const [isEatingAnim, setIsEatingAnim] = useState<boolean>(false);
  const [eatingFoodIcon, setEatingFoodIcon] = useState<string>('🌴');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const pendingTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Tracked setTimeout: pet/feed animations schedule several staggered timeouts (up to 7s out for
  // the speech bubble). The floating companion mounts/unmounts as the user navigates between
  // views, so without tracking + clearing these on unmount they keep firing setState against a
  // gone component and can flip mood/speech state on whatever remounts next with the same instance.
  const trackedTimeout = (fn: () => void, delay: number) => {
    const id = setTimeout(() => {
      pendingTimeoutsRef.current = pendingTimeoutsRef.current.filter((t) => t !== id);
      fn();
    }, delay);
    pendingTimeoutsRef.current.push(id);
    return id;
  };

  // Release the audio hardware/resources and cancel any pending animation timeouts on unmount
  // (the floating companion mounts/unmounts as the user navigates between views) — otherwise every
  // visit leaves an open AudioContext and zombie timers behind.
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {});
      pendingTimeoutsRef.current.forEach((id) => clearTimeout(id));
      pendingTimeoutsRef.current = [];
    };
  }, []);

  // Active outfit
  const currentOutfit = DIDOU_OUTFITS_LIST.find((o) => o.id === activeOutfitId) || DIDOU_OUTFITS_LIST[0];

  // Evolution Stage
  const userLevel = level || Math.floor(xp / 100) + 1;
  const stageInfo = getDidouStage(userLevel);

  // Sound Synth
  const playSound = (type: 'purr' | 'munch' | 'sparkle' | 'cheer') => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      if (type === 'purr') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.2);
      } else if (type === 'munch') {
        [400, 520, 640].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.1, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.07);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.07);
        });
      } else if (type === 'sparkle') {
        [587.33, 739.99, 880, 1174.66].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.07);
          gain.gain.setValueAtTime(0.15, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.2);
        });
      } else if (type === 'cheer') {
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + i * 0.09);
          gain.gain.setValueAtTime(0.15, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.25);
        });
      }
    } catch {
      // Audio fallback
    }
  };

  // Pet / Click Didou
  const handlePet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPettingAnimation(true);
    setCurrentMood('celebrating');
    playSound('purr');

    const newHeart = {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 40,
      y: -20 - Math.random() * 30,
    };
    setFloatingHearts((prev) => [...prev.slice(-4), newHeart]);

    trackedTimeout(() => {
      setIsPettingAnimation(false);
      setCurrentMood(energy < 30 ? 'hungry' : 'happy');
    }, 1200);

    // Random Speech encouragement
    triggerRandomDialogue();

    if (onPat) onPat();
  };

  const triggerRandomDialogue = () => {
    const list = isFrench ? DIDOU_DIALOGUES_FR : DIDOU_DIALOGUES_AR;
    const randomLine = list[Math.floor(Math.random() * list.length)];
    setSpeechBubble(randomLine);
    setIsSpeaking(true);

    const langCode = isFrench ? 'fr-FR' : 'ar-SA';
    void speakText(randomLine, langCode, 0.95).then(() => {
      setIsSpeaking(false);
    });

    trackedTimeout(() => {
      setSpeechBubble(null);
    }, 7000);
  };

  // Feed Didou
  const handleFeedTreat = (treat: typeof DIDOU_TREATS_LIST[0]) => {
    if (goldCoins < treat.priceGoldCoins) {
      const msg = isFrench
        ? `Il te manque ${treat.priceGoldCoins - goldCoins} pièces d'or ! Résous des exercices pour en gagner 🪙`
        : `رصيدك غير كافٍ! تحتاج ${treat.priceGoldCoins - goldCoins} دينار إضافي. حل بعض التمارين لكسبها 🪙`;
      setSpeechBubble(msg);
      playSound('purr');
      return;
    }

    setEatingFoodIcon(treat.icon);
    setIsEatingAnim(true);
    setCurrentMood('celebrating');
    playSound('munch');

    trackedTimeout(() => {
      playSound('sparkle');
    }, 400);

    trackedTimeout(() => {
      setIsEatingAnim(false);
      setCurrentMood('happy');
    }, 2200);

    const happyMsg = isFrench
      ? `Miam ! Délicieux ${treat.nameFr} ! +${treat.energyBonus}% d'énergie ⚡`
      : `يممم! ما ألذ ${treat.nameAr}! زادت طاقتي بنسبة +${treat.energyBonus}% ⚡`;
    setSpeechBubble(happyMsg);
    trackedTimeout(() => setSpeechBubble(null), 5000);

    setShowTreatsMenu(false);

    if (onFeed) {
      onFeed(treat.id, treat.energyBonus, treat.xpBonus, treat.priceGoldCoins);
    }
  };

  const mainEmoji = species === 'eagle' ? '🦅' : '🦊';

  // Floating Pill vs Embedded Dashboard Card
  if (isFloating) {
    return (
      <div className="relative inline-block select-none" dir={direction}>
        {/* SPEECH BUBBLE */}
        <AnimatePresence>
          {speechBubble && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              className="absolute bottom-full mb-3 start-1/2 -translate-x-1/2 w-64 max-w-[80vw] bg-white text-slate-900 rounded-2xl p-3 shadow-2xl border-2 border-amber-400 z-50 text-xs font-bold leading-relaxed text-center"
            >
              <div className="absolute -bottom-2 start-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-amber-400 rotate-45" />
              <p className="text-amber-950 font-extrabold">{speechBubble}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING HEARTS */}
        {floatingHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, y: h.y - 40, scale: 1.4 }}
            transition={{ duration: 1.2 }}
            className="absolute top-0 start-1/2 pointer-events-none text-rose-500 text-lg z-50"
          >
            ❤️
          </motion.div>
        ))}

        {/* FLOATING COMPANION BUTTON */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handlePet}
            className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 p-0.5 shadow-xl border-2 border-white cursor-pointer group"
            title={isFrench ? 'Ton compagnon Didou' : 'صديقك ديدو'}
          >
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
              {/* Energy Ring Indicator */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `conic-gradient(#10b981 ${energy}%, transparent ${energy}% 100%)`,
                }}
              />
              <span className={`text-2xl transition-transform ${isPettingAnimation ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>
                {mainEmoji}
              </span>
              <span className="absolute bottom-0.5 end-0.5 text-xs">
                {currentOutfit.icon}
              </span>
              {stageInfo.stage === 3 && (
                <span className="absolute -top-1 start-1/2 -translate-x-1/2 text-[10px] animate-bounce">
                  👑
                </span>
              )}
            </div>
          </motion.button>

          {/* Quick Actions (Snack / Wardrobe) */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setShowTreatsMenu(!showTreatsMenu)}
              className="w-7 h-7 rounded-xl bg-amber-500 hover:bg-amber-400 text-white flex items-center justify-center text-xs shadow-md border border-white active:scale-95"
              title={isFrench ? 'Nourrir Didou' : 'إطعام ديدو'}
            >
              🍎
            </button>
            {onOpenDressingRoom && (
              <button
                onClick={onOpenDressingRoom}
                className="w-7 h-7 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center text-xs shadow-md border border-white active:scale-95"
                title={isFrench ? 'Garde-robe de Didou' : 'خزانة ملابس ديدو'}
              >
                👗
              </button>
            )}
          </div>
        </div>

        {/* TREATS POPUP */}
        <AnimatePresence>
          {showTreatsMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              className="absolute bottom-full mb-2 start-0 bg-slate-900 border-2 border-amber-400 rounded-2xl p-3 shadow-2xl z-50 w-72"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-black text-amber-300">
                  {isFrench ? 'Nourrir Didou (Énergie)' : 'أطعم ديدو (طاقة + XP)'}
                </span>
                <span className="text-xs text-amber-400 font-bold">🪙 {goldCoins}</span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {DIDOU_TREATS_LIST.map((treat) => (
                  <button
                    key={treat.id}
                    onClick={() => handleFeedTreat(treat)}
                    className="w-full p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-start flex items-center justify-between text-xs transition-all active:scale-95"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{treat.icon}</span>
                      <div>
                        <div className="font-extrabold text-slate-200">{isFrench ? treat.nameFr : treat.nameAr}</div>
                        <div className="text-[10px] text-emerald-400 font-bold">+{treat.energyBonus}% ⚡ | +{treat.xpBonus} XP</div>
                      </div>
                    </div>
                    <span className="font-mono text-amber-400 font-bold">🪙 {treat.priceGoldCoins}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // EMBEDDED DASHBOARD COMPACT & RICH HERO CARD
  return (
    <div
      data-companion-card
      className="w-full bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 border-2 border-amber-400/40 rounded-3xl p-4 sm:p-5 text-slate-900 dark:text-slate-100 shadow-xl relative overflow-hidden backdrop-blur-sm"
      dir={direction}
    >
      {/* Background Subtle Pattern */}
      <div className="absolute top-2 end-3 text-5xl sm:text-6xl opacity-10 pointer-events-none select-none">
        {stageInfo.stage === 3 ? '👑' : stageInfo.stage === 2 ? '🎓' : '🐾'}
      </div>

      {/* SPEECH BUBBLE MODAL / CALLOUT */}
      <AnimatePresence>
        {speechBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="mb-4 bg-white dark:bg-slate-900 text-amber-950 dark:text-amber-200 border-2 border-amber-400 rounded-2xl p-3.5 shadow-lg flex items-center justify-between gap-3 text-xs sm:text-sm font-bold"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl animate-bounce">💬</span>
              <p className="leading-snug">{speechBubble}</p>
            </div>
            <button
              onClick={() => { stopSpeech(); setSpeechBubble(null); }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div data-companion-layout className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* LEFT / AVATAR WITH STAGES & MOOD */}
        <div className="flex items-center gap-4 min-w-0 w-full">
          <div className="relative">
            {/* FLOATING HEARTS ON CLICK */}
            {floatingHearts.map((h) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 1, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, y: h.y - 40, scale: 1.4 }}
                transition={{ duration: 1.2 }}
                className="absolute -top-2 start-1/2 pointer-events-none text-rose-500 text-xl z-50"
              >
                ❤️
              </motion.div>
            ))}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePet}
              className="cursor-pointer"
            >
              <Didou3DAvatar
                species={species}
                outfitId={activeOutfitId}
                mood={isPettingAnimation ? 'celebrating' : isEatingAnim ? 'celebrating' : currentMood}
                isEating={isEatingAnim}
                eatingFoodIcon={eatingFoodIcon}
                size="md"
              />
            </motion.div>
          </div>

          {/* PET INFO & ENERGY GAUGE */}
          <div data-companion-info className="space-y-1 text-start min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-amber-900 dark:text-amber-300">
                {isFrench ? `Didou (${species === 'eagle' ? 'Aiglon' : 'Fennec'})` : `صديقك ديدو (${species === 'eagle' ? 'عقاب الأطلس' : 'الفنك الذكي'})`}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40">
                {isFrench ? stageInfo.nameFr : stageInfo.nameAr}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
              {isFrench
                ? `Niveau d'amitié : ${friendshipLevel}/10 ⭐ • Zèle : ${currentOutfit.nameFr}`
                : `مستوى الصداقة: ${friendshipLevel}/10 ⭐ • الزي: ${currentOutfit.nameAr}`}
            </p>

            {/* ENERGY BAR */}
            <div data-companion-energy className="flex items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                ⚡ {isFrench ? 'Énergie :' : 'الطاقة :'}
              </span>
              <div className="w-28 sm:w-36 h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300 dark:border-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    energy > 60
                      ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                      : energy > 30
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                      : 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse'
                  }`}
                  style={{ width: `${energy}%` }}
                />
              </div>
              <span className="text-xs font-mono font-black text-slate-700 dark:text-slate-300">{energy}%</span>
            </div>
          </div>
        </div>

        {/* RIGHT / ACTION BUTTONS */}
        <div data-companion-actions className="flex items-center gap-2 flex-wrap">
          {/* Pet / Talk Button */}
          <button
            onClick={triggerRandomDialogue}
            className="px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-950 dark:text-amber-300 border border-amber-300 dark:border-slate-700 text-xs font-extrabold shadow-sm active:scale-95 flex items-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 text-amber-500" />
            <span>{isFrench ? 'Parler à Didou' : 'تحدث مع ديدو'}</span>
          </button>

          {/* Feed Button */}
          <button
            onClick={() => setShowTreatsMenu(!showTreatsMenu)}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-xs font-extrabold shadow-md active:scale-95 flex items-center gap-1.5"
          >
            <Utensils className="w-4 h-4" />
            <span>{isFrench ? 'Nourrir (Dattes/Lait)' : 'إطعام ديدو 🌴'}</span>
          </button>

          {/* Wardrobe Button */}
          {onOpenDressingRoom && (
            <button
              onClick={onOpenDressingRoom}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-extrabold shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Shirt className="w-4 h-4" />
              <span>{isFrench ? 'Studio & Garde-robe' : 'الأزياء والتخصيص 👗'}</span>
            </button>
          )}
        </div>
      </div>

      {/* TREATS POPUP DRAWER IN HERO */}
      <AnimatePresence>
        {showTreatsMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-amber-400/30 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-amber-900 dark:text-amber-300">
                {isFrench ? 'Délices algériens pour recharger Didou :' : 'خيرات الجزائر لتغذية ديدو وزيادة طاقته:'}
              </span>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                🪙 {goldCoins} {isFrench ? 'pièces' : 'دينار ذهبي'}
              </span>
            </div>

            <div data-companion-treats className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {DIDOU_TREATS_LIST.map((treat) => (
                <button
                  key={treat.id}
                  onClick={() => handleFeedTreat(treat)}
                  className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 border border-amber-200 dark:border-slate-800 text-start flex flex-col justify-between gap-1 shadow-sm transition-all active:scale-95"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{treat.icon}</span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {isFrench ? treat.nameFr : treat.nameAr}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-emerald-600 dark:text-emerald-400">+{treat.energyBonus}% ⚡</span>
                    <span className="text-amber-600 dark:text-amber-400 font-mono">🪙 {treat.priceGoldCoins}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

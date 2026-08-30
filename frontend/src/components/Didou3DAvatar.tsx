import React from 'react';
import { motion } from 'motion/react';
import { DidouOutfitId, DidouPetSpecies } from '../types/ecosystem';

export interface Didou3DAvatarProps {
  species?: DidouPetSpecies;
  outfitId?: DidouOutfitId;
  mood?: 'happy' | 'thinking' | 'celebrating' | 'hungry' | 'curious' | 'encouraging' | 'proud' | 'sleepy' | 'studying';
  isEating?: boolean;
  eatingFoodIcon?: string;
  isChangingOutfit?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const Didou3DAvatar: React.FC<Didou3DAvatarProps> = ({
  species = 'fennec',
  outfitId = 'default',
  mood = 'happy',
  isEating = false,
  eatingFoodIcon = '🌴',
  isChangingOutfit = false,
  size = 'lg',
  className = '',
  onClick,
}) => {
  const isEagle = species === 'eagle';

  // Size mapping
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48 sm:w-56 sm:h-56',
  }[size];

  // Outfit specific visual characteristics
  const outfitVisuals: Record<DidouOutfitId, {
    capeColor?: string;
    hat?: string;
    torsoColor?: string;
    accessoryEmoji?: string;
    glowColor?: string;
    headband?: string;
  }> = {
    default: {
      torsoColor: '#f97316',
      capeColor: 'transparent',
    },
    cheche_sahara: {
      headband: '#0284c7',
      accessoryEmoji: '🧣',
      torsoColor: '#0ea5e9',
      glowColor: 'rgba(14, 165, 233, 0.4)',
    },
    burnous_traditionnel: {
      capeColor: '#fef08a',
      accessoryEmoji: '✨',
      torsoColor: '#facc15',
      glowColor: 'rgba(250, 204, 21, 0.4)',
    },
    robe_kabyle: {
      capeColor: '#dc2626',
      headband: '#ea580c',
      accessoryEmoji: '🪡',
      torsoColor: '#e11d48',
      glowColor: 'rgba(225, 29, 72, 0.4)',
    },
    maillot_verts_dz: {
      torsoColor: '#16a34a',
      accessoryEmoji: '⚽',
      headband: '#22c55e',
      glowColor: 'rgba(34, 197, 94, 0.4)',
    },
    tarbouche_casbah: {
      hat: '🎩',
      torsoColor: '#991b1b',
      accessoryEmoji: '⚜️',
      glowColor: 'rgba(185, 28, 28, 0.4)',
    },
    chapeau_diplome: {
      hat: '🎓',
      torsoColor: '#7c3aed',
      accessoryEmoji: '📜',
      glowColor: 'rgba(124, 58, 237, 0.4)',
    },
    astronaute_dz: {
      torsoColor: '#e2e8f0',
      accessoryEmoji: '🚀',
      hat: '🧑‍🚀',
      glowColor: 'rgba(168, 85, 247, 0.5)',
    },
    docteur_savant: {
      torsoColor: '#f8fafc',
      accessoryEmoji: '🩺',
      hat: '🥽',
      glowColor: 'rgba(56, 189, 248, 0.4)',
    },
    chevalier_numidie: {
      torsoColor: '#b45309',
      headband: '#78350f',
      accessoryEmoji: '🛡️',
      glowColor: 'rgba(180, 83, 9, 0.4)',
    },
    pilote_aerien: {
      torsoColor: '#2563eb',
      accessoryEmoji: '✈️',
      hat: '🧢',
      glowColor: 'rgba(37, 99, 235, 0.4)',
    },
  };

  const outfit = outfitVisuals[outfitId] || outfitVisuals.default;

  return (
    <div
      onClick={onClick}
      className={`relative select-none flex items-center justify-center ${sizeClasses} ${className} cursor-pointer group`}
      style={{ perspective: '800px' }}
    >
      {/* 3D Dynamic Shadow Base */}
      <motion.div
        animate={{
          scale: isEating ? [1, 1.2, 1] : mood === 'celebrating' ? [1, 0.7, 1] : [1, 1.08, 1],
          opacity: mood === 'celebrating' ? [0.6, 0.2, 0.6] : [0.5, 0.7, 0.5],
        }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute -bottom-2 w-3/4 h-4 bg-slate-900/60 dark:bg-black/80 rounded-full blur-md"
      />

      {/* 3D Glowing Ambient Halo */}
      <motion.div
        animate={{
          scale: [0.95, 1.05, 0.95],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full blur-xl pointer-events-none"
        style={{ backgroundColor: outfit.glowColor || 'rgba(245, 158, 11, 0.3)' }}
      />

      {/* 3D Main Animated Character Container */}
      <motion.div
        animate={
          isChangingOutfit
            ? { rotateY: [0, 360], scale: [1, 1.15, 1] }
            : isEating
            ? { y: [0, 4, -2, 4, 0], rotateZ: [-3, 3, -3] }
            : mood === 'celebrating'
            ? { y: [0, -20, 0], rotateZ: [-8, 8, -8], rotateX: [10, -5, 10] }
            : mood === 'hungry'
            ? { y: [0, 3, 0], rotateZ: [-4, -4, -4] }
            : { y: [0, -6, 0], rotateZ: [-1, 1, -1] }
        }
        transition={
          isChangingOutfit
            ? { duration: 0.8, ease: 'easeInOut' }
            : isEating
            ? { repeat: Infinity, duration: 0.6 }
            : mood === 'celebrating'
            ? { repeat: Infinity, duration: 0.8, ease: 'easeInOut' }
            : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
        }
        className="relative w-full h-full flex flex-col items-center justify-center [transform-style:preserve-3d]"
      >
        {/* === EATING PARTICLES EFFECT === */}
        {isEating && (
          <div className="absolute -top-3 inset-x-0 flex justify-center items-center pointer-events-none z-30">
            <motion.div
              initial={{ scale: 0.2, y: 10, opacity: 0 }}
              animate={{ scale: [0.5, 1.2, 0], y: [-5, -25], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="text-2xl"
            >
              {eatingFoodIcon}
            </motion.div>
            <motion.div
              initial={{ scale: 0.2, x: 10, opacity: 0 }}
              animate={{ scale: [0.2, 1, 0], x: [10, 25], y: [-5, -15], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.7, delay: 0.2 }}
              className="text-sm"
            >
              ✨
            </motion.div>
            <motion.div
              initial={{ scale: 0.2, x: -10, opacity: 0 }}
              animate={{ scale: [0.2, 1, 0], x: [-10, -25], y: [-5, -15], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.7, delay: 0.4 }}
              className="text-sm"
            >
              ⭐
            </motion.div>
          </div>
        )}

        {/* === 3D CHARACTER SVG CRAFTED VECTOR === */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_12px_16px_rgba(0,0,0,0.35)]"
        >
          <defs>
            {/* 3D Metallic & Fur Gradients */}
            <radialGradient id="fennecHeadGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="55%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>

            <radialGradient id="fennecEarGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffedd5" />
              <stop offset="50%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#f97316" />
            </radialGradient>

            <radialGradient id="fennecEarInner" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="100%" stopColor="#f43f5e" />
            </radialGradient>

            <radialGradient id="eagleHeadGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </radialGradient>

            <radialGradient id="eagleBeakGrad" cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>

            <linearGradient id="dzGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>

            <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>

            <filter id="soft3dShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* 1. TAIL / BACK WINGS (Behind Body) */}
          {!isEagle ? (
            <motion.path
              d="M 140 140 Q 185 130 180 85 Q 165 95 150 115 Z"
              fill="url(#fennecHeadGrad)"
              filter="url(#soft3dShadow)"
              animate={{ rotate: isEating ? [0, 8, -5, 0] : [0, 12, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              style={{ transformOrigin: '140px 140px' }}
            />
          ) : (
            <g>
              <path d="M 40 120 Q 20 140 30 160 Q 60 150 70 130 Z" fill="#78350f" />
              <path d="M 160 120 Q 180 140 170 160 Q 140 150 130 130 Z" fill="#78350f" />
            </g>
          )}

          {/* 2. HUGE 3D FENNEC EARS (OR EAGLE TUFTS) */}
          {!isEagle && (
            <g>
              {/* Left Big Ear */}
              <motion.g
                animate={{ rotateZ: mood === 'curious' ? [-4, 6, -4] : [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ transformOrigin: '70px 85px' }}
              >
                <path
                  d="M 65 85 Q 15 15 45 10 Q 80 20 85 75 Z"
                  fill="url(#fennecEarGrad)"
                  filter="url(#soft3dShadow)"
                />
                <path
                  d="M 62 80 Q 25 25 48 20 Q 72 30 78 72 Z"
                  fill="url(#fennecEarInner)"
                  opacity="0.85"
                />
                {/* Ear Fur Highlights */}
                <path d="M 65 75 Q 70 65 66 55" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              </motion.g>

              {/* Right Big Ear */}
              <motion.g
                animate={{ rotateZ: mood === 'curious' ? [4, -6, 4] : [2, -2, 2] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                style={{ transformOrigin: '130px 85px' }}
              >
                <path
                  d="M 135 85 Q 185 15 155 10 Q 120 20 115 75 Z"
                  fill="url(#fennecEarGrad)"
                  filter="url(#soft3dShadow)"
                />
                <path
                  d="M 138 80 Q 175 25 152 20 Q 128 30 122 72 Z"
                  fill="url(#fennecEarInner)"
                  opacity="0.85"
                />
                {/* Ear Fur Highlights */}
                <path d="M 135 75 Q 130 65 134 55" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
              </motion.g>
            </g>
          )}

          {/* 3. BODY / CAPE / OUTFIT */}
          <g filter="url(#soft3dShadow)">
            {/* Base Body Torso */}
            <path
              d="M 70 120 Q 100 110 130 120 Q 145 165 100 175 Q 55 165 70 120 Z"
              fill={outfit.torsoColor || '#fb923c'}
            />

            {/* Traditional Burnous / Cape Layer */}
            {outfit.capeColor && outfit.capeColor !== 'transparent' && (
              <path
                d="M 65 122 Q 100 115 135 122 Q 150 170 100 180 Q 50 170 65 122 Z"
                fill={outfit.capeColor}
                opacity="0.95"
                stroke="#d97706"
                strokeWidth="1.5"
              />
            )}

            {/* Belly Fluff */}
            <path
              d="M 85 128 Q 100 120 115 128 Q 120 155 100 162 Q 80 155 85 128 Z"
              fill="#fff7ed"
              opacity="0.8"
            />
          </g>

          {/* 4. 3D ROUND HEAD */}
          <g filter="url(#soft3dShadow)">
            <circle
              cx="100"
              cy="95"
              r="44"
              fill={isEagle ? 'url(#eagleHeadGrad)' : 'url(#fennecHeadGrad)'}
            />

            {/* Cheeks / White Face Accents */}
            {!isEagle ? (
              <>
                <ellipse cx="78" cy="105" rx="16" ry="12" fill="#ffffff" opacity="0.9" />
                <ellipse cx="122" cy="105" rx="16" ry="12" fill="#ffffff" opacity="0.9" />
                {/* Cute Rosy Cheeks */}
                <ellipse cx="74" cy="104" rx="7" ry="5" fill="#fb7185" opacity="0.6" />
                <ellipse cx="126" cy="104" rx="7" ry="5" fill="#fb7185" opacity="0.6" />
              </>
            ) : (
              <>
                <ellipse cx="76" cy="102" rx="12" ry="8" fill="#ffffff" opacity="0.85" />
                <ellipse cx="124" cy="102" rx="12" ry="8" fill="#ffffff" opacity="0.85" />
              </>
            )}
          </g>

          {/* 5. 3D EYES (Animated & Expressive) */}
          <g>
            {/* Left Eye */}
            <g>
              <ellipse cx="80" cy="88" rx="8.5" ry="11" fill="#1e1b4b" />
              {/* Eye Catchlights (3D Glass Shine) */}
              <circle cx="77" cy="84" r="3.8" fill="#ffffff" />
              <circle cx="83" cy="92" r="1.6" fill="#ffffff" />
            </g>

            {/* Right Eye */}
            <g>
              <ellipse cx="120" cy="88" rx="8.5" ry="11" fill="#1e1b4b" />
              {/* Eye Catchlights (3D Glass Shine) */}
              <circle cx="117" cy="84" r="3.8" fill="#ffffff" />
              <circle cx="123" cy="92" r="1.6" fill="#ffffff" />
            </g>

            {/* Happy Closed Eye Arcs on Eating / Celebrating */}
            {(isEating || mood === 'celebrating') && (
              <g stroke="#1e1b4b" strokeWidth="3.5" strokeLinecap="round" fill="none">
                <path d="M 72 88 Q 80 80 88 88" />
                <path d="M 112 88 Q 120 80 128 88" />
              </g>
            )}
          </g>

          {/* 6. SNOUT, NOSE & MOUTH */}
          {!isEagle ? (
            <g>
              {/* Little 3D Nose */}
              <path
                d="M 96 98 Q 100 95 104 98 Q 100 103 96 98 Z"
                fill="#0f172a"
              />
              <circle cx="98.5" cy="97.5" r="1" fill="#ffffff" opacity="0.7" />

              {/* Mouth with Chew / Smile */}
              {isEating ? (
                <ellipse cx="100" cy="107" rx="5" ry="4" fill="#991b1b" stroke="#0f172a" strokeWidth="1.5" />
              ) : (
                <path
                  d="M 93 103 Q 100 108 107 103"
                  stroke="#0f172a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>
          ) : (
            /* 3D Eagle Golden Beak */
            <g filter="url(#soft3dShadow)">
              <path
                d="M 92 92 Q 100 88 108 92 Q 106 112 100 116 Q 94 112 92 92 Z"
                fill="url(#eagleBeakGrad)"
                stroke="#a16207"
                strokeWidth="1.5"
              />
              <circle cx="96" cy="94" r="1.2" fill="#451a03" />
              <circle cx="104" cy="94" r="1.2" fill="#451a03" />
            </g>
          )}

          {/* 7. HEADWEAR / CHÈCHE / ACCESSORIES (Over Head) */}
          {outfit.headband && (
            <g filter="url(#soft3dShadow)">
              <path
                d="M 60 76 Q 100 62 140 76 Q 142 86 100 74 Q 58 86 60 76 Z"
                fill={outfit.headband}
                stroke="#0369a1"
                strokeWidth="1.5"
              />
              {/* Chèche drape tail */}
              <path
                d="M 60 76 Q 50 95 55 125 Q 65 128 66 95 Z"
                fill={outfit.headband}
                opacity="0.9"
              />
            </g>
          )}

          {/* Paws Resting in Front */}
          <g filter="url(#soft3dShadow)">
            <ellipse cx="80" cy="148" rx="8" ry="6" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.5" />
            <ellipse cx="120" cy="148" rx="8" ry="6" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.5" />
          </g>
        </svg>

        {/* 3D Floating Hat or Equipment Emoji */}
        {outfit.hat && (
          <div className="absolute -top-4 inset-x-0 flex justify-center text-3xl pointer-events-none filter drop-shadow-lg">
            {outfit.hat}
          </div>
        )}

        {/* 3D Floating Companion Accessory Badge */}
        {outfit.accessoryEmoji && (
          <motion.div
            animate={{ rotate: [-8, 8, -8], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute bottom-1 end-1 bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-xl border-2 border-amber-400 text-lg sm:text-xl pointer-events-none"
          >
            {outfit.accessoryEmoji}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { PreschoolActivity, PreschoolChoice, PreschoolLanguage, PreschoolSpatialScene } from '../../data/preschool/types';
import { playSuccessChime, playGentleNudge } from './usePreschoolAudio';
import { localizeGlyph, activityPicture } from './preschoolGlyphs';
import { PreschoolAsset } from './PreschoolAsset';

interface PreschoolTapChoiceProps {
  activity: PreschoolActivity;
  language: PreschoolLanguage;
  onComplete: () => void;
}

function shuffleChoices(list: PreschoolChoice[]): PreschoolChoice[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const spring = { type: 'spring' as const, stiffness: 420, damping: 22 };

/** Open carton drawn from the side — not the 📦 emoji, which reads as a closed lid from above. */
function SideBox({ className = '', children }: { className?: string; children?: React.ReactNode }) {
  return (
    <span
      className={`relative block w-[2.6rem] h-[2.45rem] border-[3.5px] border-t-0 border-[#92400E] bg-amber-100 rounded-b-lg ${className}`}
    >
      <span className="absolute -top-[5px] -left-[3.5px] w-[5px] h-2 rounded-t-sm bg-[#92400E]" />
      <span className="absolute -top-[5px] -right-[3.5px] w-[5px] h-2 rounded-t-sm bg-[#92400E]" />
      {children}
    </span>
  );
}

/** Side-view wall/crate sitting on the ground (depth = left/right, never up/down). */
function SideWall({ className = '' }: { className?: string }) {
  return (
    <span className={`relative block w-[2.2rem] h-[2.55rem] rounded-sm border-[3px] border-[#78350F] bg-[#D97706] ${className}`}>
      <span className="absolute inset-y-0 right-0 w-[7px] bg-[#B45309]" />
      <span className="absolute -top-[5px] -left-[3px] -right-[3px] h-[7px] rounded-sm bg-[#B45309] border-[3px] border-[#78350F]" />
    </span>
  );
}

/**
 * Same object, two real places.
 * Front/behind: SIDE VIEW on a ground line (nearer = left, farther = right) with occlusion — not a vertical stack.
 * Inside/outside: the same object once IN an open carton, once BESIDE it.
 */
function SpatialSceneCard({ scene }: { scene: PreschoolSpatialScene }) {
  const { kind, object } = scene;
  return (
    <span
      className="relative block w-[7.75rem] h-[5rem]"
      dir="ltr"
      data-spatial-scene={kind}
      aria-hidden="true"
    >
      <span className="absolute bottom-[5px] left-1 right-1 h-[3px] rounded-full bg-amber-400" />
      {kind === 'front' && (
        <>
          <span className="absolute bottom-[7px] left-[42%] z-10">
            <SideWall />
          </span>
          <span className="absolute bottom-[6px] left-[8%] z-20 leading-none">
            <PreschoolAsset asset={object} size={36} textClassName="text-[2rem] leading-none" />
          </span>
        </>
      )}
      {kind === 'behind' && (
        <>
          <span className="absolute bottom-[6px] left-[44%] z-10 leading-none">
            <PreschoolAsset asset={object} size={32} textClassName="text-[1.7rem] leading-none" />
          </span>
          <span className="absolute bottom-[7px] left-[22%] z-20">
            <SideWall />
          </span>
        </>
      )}
      {kind === 'inside' && (
        <span className="absolute bottom-[7px] left-1/2 -translate-x-1/2">
          <SideBox className="overflow-hidden">
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 leading-none">
              <PreschoolAsset asset={object} size={22} textClassName="text-xl leading-none" />
            </span>
          </SideBox>
        </span>
      )}
      {kind === 'outside' && (
        <>
          <span className="absolute bottom-[7px] left-[12%]">
            <SideBox />
          </span>
          <span className="absolute bottom-[6px] right-[8%] leading-none">
            <PreschoolAsset asset={object} size={28} textClassName="text-[1.65rem] leading-none" />
          </span>
        </>
      )}
    </span>
  );
}

export const PreschoolTapChoice: React.FC<PreschoolTapChoiceProps> = ({ activity, language, onComplete }) => {
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [choices, setChoices] = useState<PreschoolChoice[]>([]);
  const localizedChoices = activity.i18n[language].choices ?? activity.visualAssets.choices ?? [];

  useEffect(() => {
    setSolved(false);
    setWrongId(null);
    setChoices(shuffleChoices(localizedChoices));
  }, [activity.id, language]);

  const handleTap = (choiceId: string, isCorrect: boolean) => {
    if (solved) return;
    if (isCorrect) {
      setSolved(true);
      playSuccessChime();
      // Short enough just to let the correct choice's own green highlight register before
      // PreschoolActivityPlayer's celebration overlay covers the screen — the celebration overlay
      // already provides its own (longer) pause before advancing, so this no longer needs to.
      setTimeout(onComplete, 350);
    } else {
      playGentleNudge();
      setWrongId(choiceId);
      setTimeout(() => setWrongId(null), 500);
    }
  };

  const prompt = activityPicture(activity, language);

  return (
    <div className="flex flex-col items-center gap-10 px-2">
      <motion.div
        key={activity.id}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring}
        className="w-36 h-36 sm:w-40 sm:h-40 rounded-[2rem] bg-white shadow-md border-4 border-amber-100
                   flex items-center justify-center"
      >
        <span className="select-none" aria-hidden="true">
          <PreschoolAsset
            asset={prompt}
            size={112}
            textClassName="text-7xl sm:text-8xl leading-none"
          />
        </span>
      </motion.div>

      <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
        {choices.map((choice) => {
          const glyph = localizeGlyph(choice.asset, language);
          const caption = choice.label?.[language];
          const isWin = solved && choice.isCorrect;
          const isWrong = wrongId === choice.id;

          return (
            <motion.button
              key={choice.id}
              onClick={() => handleTap(choice.id, choice.isCorrect)}
              animate={isWrong ? { x: [0, -10, 10, -10, 0] } : isWin ? { scale: [1, 1.18, 1] } : { scale: 1 }}
              transition={isWrong ? { duration: 0.4 } : spring}
              whileHover={solved ? undefined : { scale: 1.05 }}
              whileTap={solved ? undefined : { scale: 0.95 }}
              disabled={solved}
              aria-label={caption ?? glyph}
              className={`${choice.scene
                ? 'min-h-[8.5rem] min-w-[9.5rem] w-[9.5rem] py-2 flex-col gap-0.5'
                : caption
                ? 'min-h-28 min-w-28 w-28 sm:min-h-32 sm:w-32 py-2 flex-col gap-0.5'
                : 'min-h-24 min-w-24 w-24 h-24 sm:w-28 sm:h-28'}
                          rounded-3xl flex items-center justify-center
                          shadow-lg border-4 cursor-pointer select-none
                          ${isWin
                            ? 'bg-emerald-400 border-emerald-600'
                            : isWrong
                              ? 'bg-rose-100 border-rose-400'
                              : 'bg-white border-amber-200 hover:border-amber-400'}`}
            >
              {choice.scene ? (
                <SpatialSceneCard scene={choice.scene} />
              ) : choice.stack && choice.stack.length > 0 ? (
                <span className="flex flex-col items-center leading-none gap-0.5" aria-hidden="true">
                  {choice.stack.map((piece, i) => (
                    <PreschoolAsset
                      key={`${choice.id}-${i}`}
                      asset={piece}
                      size={caption ? 36 : 44}
                      textClassName="text-3xl sm:text-4xl leading-none"
                    />
                  ))}
                </span>
              ) : (
              <PreschoolAsset
                asset={glyph}
                size={caption ? 48 : 64}
                textClassName={`font-black text-orange-900 leading-none ${glyph.length > 1 ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'}`}
              />
              )}
              {caption && (
                <span className="text-[10px] sm:text-[11px] font-black text-[#1E293B] leading-tight text-center px-1">
                  {caption}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

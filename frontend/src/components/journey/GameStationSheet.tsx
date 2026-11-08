import { useProgressOwner } from '../../utils/ownerStorage';
import { getActiveProgressOwner } from '../../utils/progressOwner';
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GAME_PACKS, type GamePack } from '../../data/games';
import type { PracticeResult } from '../../utils/competenceProgress';
import { ENGINE_LABEL_AR, usePackLevels } from '../games/learning/LearningGameEntry';
import { LearningGamePlayer, LEVEL_TIER_AR, suggestedLevel, tierIndex } from '../games/learning/LearningGamePlayer';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { PremiumOffer } from '../PremiumOffer';
import '../games/learning/learningGames.css';
import './gameStation.css';

const PICTURES = /[\p{Extended_Pictographic}\u200d\uFE0F]/gu;
const GRADES_WITH_GAMES = new Set(GAME_PACKS.map((p) => p.grade)).size;
const LEVELS_IN_ALL = GAME_PACKS.reduce((sum, p) => sum + p.rounds.length, 0);

interface GameStationSheetProps {
  pack: GamePack;
  /** False for a Premium pack on a free account: neutral message, no price (Android app rule). */
  open: boolean;
  /** Lesson titles of the catalog, to say which lessons the game reviews. */
  lessonTitles: Readonly<Record<string, string>>;
  onClose: () => void;
  /** Locked sheet: jump to the grade's free game station instead. */
  onPlayFree?: () => void;
  freeTitle?: string;
  onPracticeResult?: (lessonId: string, result: PracticeResult) => void;
  onEarnXp?: (pack: GamePack, xp: number) => void;
  say?: (text: string) => void;
}

/**
 * Bottom sheet of a game station on Didou's map: what the game reviews, its ten levels with their
 * stars and the suggested one, then the 3D player. Arabic only, like the games themselves.
 */
export function GameStationSheet({ pack, open, lessonTitles, onClose, onPlayFree, freeTitle, onPracticeResult, onEarnXp, say }: GameStationSheetProps) {
  const owner = useProgressOwner();
  const { levels, solveLevel } = usePackLevels(pack, onEarnXp);
  const [playing, setPlaying] = useState<number | null>(null);
  useEffect(() => { setPlaying(null); }, [owner]);
  const suggested = suggestedLevel(pack, levels);
  const got = pack.rounds.reduce((sum, r) => sum + (levels[r.id] ?? 0), 0);
  // Catalog titles often carry pictures (« أ ب ت ث 🍍… »): the sheet keeps only their words.
  const reviewed = [...new Set(pack.rounds.map((r) => lessonTitles[r.lessonId]?.replace(PICTURES, '').replace(/\s+/g, ' ').trim()))].filter(Boolean).slice(0, 3);
  const pick = pack.rounds[suggested];

  useEffect(() => {
    say?.(open ? `${pack.titleAr}. ${pack.taglineAr}` : 'هَذِهِ اللُّعْبَةُ مُتَاحَةٌ لِحِسَابَاتِ العَائِلَةِ المُمَيَّزَةِ.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pack.id, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && playing == null && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, playing]);

  return (
    <>
      <div className="gs-backdrop" onClick={onClose} aria-hidden="true" />
      <motion.section
        className="gs-sheet"
        data-game-sheet={pack.id}
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label={pack.titleAr}
        dir="rtl"
        lang="ar"
        style={{ background: pack.theme.sky }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      >
        <span className="gs-grip" aria-hidden="true" />
        <ModalCloseButton onClose={onClose} tone="dark" className="gs-close" />
        <header className="gs-head">
          <span className="gs-icon" aria-hidden="true">
            <span>{pack.theme.emoji}</span>
            {!open && <span className="gs-icon-lock"><LockGlyph /></span>}
          </span>
          <div className="min-w-0 flex-1">
            <p className="gs-tags">
              <span>{ENGINE_LABEL_AR[pack.engine]}</span>
              <span><b dir="ltr">{pack.rounds.length}</b> مُسْتَوَيَاتٍ</span>
              {pack.free ? <span className="gs-tag-free">مَجَّانِيَّةٌ</span> : !open && <span className="gs-tag-premium">حِسَابُ العَائِلَةِ</span>}
            </p>
            <h2 className="gs-title">{pack.titleAr}</h2>
            <p className="gs-tagline">{pack.taglineAr}</p>
          </div>
        </header>

        {open ? (
          <>
            {reviewed.length > 0 && (
              <p className="gs-reviews">
                <b>تُرَاجِعُ:</b> {reviewed.join(' · ')}
              </p>
            )}
            <ol className="gs-levels" aria-label={`⭐ ${got} / ${pack.rounds.length * 3}`}>
              {pack.rounds.map((r, i) => {
                const s = levels[r.id] ?? 0;
                const last = i === pack.rounds.length - 1;
                return (
                  <li key={r.id}>
                    <motion.button
                      type="button"
                      data-gs-level={i}
                      data-state={s ? 'done' : i === suggested ? 'now' : 'todo'}
                      data-tier={tierIndex(i, pack.rounds.length)}
                      data-boss={last ? '' : undefined}
                      whileTap={{ scale: 0.9, y: 3 }}
                      onClick={() => setPlaying(i)}
                      aria-label={`المُسْتَوَى ${i + 1}: ${r.titleAr} — ${LEVEL_TIER_AR[tierIndex(i, pack.rounds.length)]}${s ? ` — ${s} / 3` : ''}`}
                    >
                      {last && <span className="gs-crown" aria-hidden="true">👑</span>}
                      <b dir="ltr">{i + 1}</b>
                      <small aria-hidden="true">{[0, 1, 2].map((k) => <span key={k} className={k < s ? '' : 'off'}>★</span>)}</small>
                    </motion.button>
                  </li>
                );
              })}
            </ol>
            <div className="gs-next">
              <span className="gs-next-tier" data-tier={tierIndex(suggested, pack.rounds.length)}>{LEVEL_TIER_AR[tierIndex(suggested, pack.rounds.length)]}</span>
              <p>
                المُسْتَوَى المُقْتَرَحُ <b dir="ltr">{suggested + 1}</b> · {pick.titleAr}
              </p>
              <span className="gs-xp" dir="ltr">+{pack.xp} XP</span>
            </div>
            <motion.button type="button" data-gs-play className="gs-play" whileTap={{ scale: 0.96, y: 3 }} onClick={() => setPlaying(suggested)}>
              ▶ {levels[pick.id] ? 'اِلْعَبِ' : 'اِبْدَأِ'} المُسْتَوَى {suggested + 1}
            </motion.button>
          </>
        ) : (
          <>
            <div className="gs-preview" aria-hidden="true">
              <div className="gs-preview-blur">
                {Array.from({ length: 8 }, (_, i) => <span key={i} />)}
              </div>
              <p>{pack.storyAr}</p>
            </div>
            <div className="gs-locked-note" role="status">
              <p className="gs-locked-main">هَذِهِ اللُّعْبَةُ مُتَاحَةٌ لِحِسَابَاتِ العَائِلَةِ المُمَيَّزَةِ.</p>
              <p>
                اللُّعْبَةُ الأُولَى مِنْ كُلِّ مُسْتَوًى دِرَاسِيٍّ مَجَّانِيَّةٌ{freeTitle ? `: ${freeTitle}` : ''}.
              </p>
            </div>
            <ul className="gs-stats">
              <li><b dir="ltr">{GAME_PACKS.length}</b><span>لُعْبَةً</span></li>
              <li><b dir="ltr">{LEVELS_IN_ALL}</b><span>مُسْتَوًى</span></li>
              <li><b dir="ltr">{GRADES_WITH_GAMES}</b><span>مُسْتَوَيَاتٍ دِرَاسِيَّةٍ</span></li>
            </ul>
            <div className="gs-offer"><PremiumOffer /></div>
            {onPlayFree && (
              <button type="button" data-gs-free className="gs-free" onClick={onPlayFree}>
                اِلْعَبِ اللُّعْبَةَ المَجَّانِيَّةَ
              </button>
            )}
          </>
        )}
      </motion.section>
      {playing != null && (
        <LearningGamePlayer
          pack={pack}
          best={levels}
          startLevel={playing}
          onExit={() => setPlaying(null)}
          onResult={(lessonId, result) => { if (getActiveProgressOwner() === owner) onPracticeResult?.(lessonId, result); }}
          onLevelSolved={solveLevel}
        />
      )}
    </>
  );
}

function LockGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

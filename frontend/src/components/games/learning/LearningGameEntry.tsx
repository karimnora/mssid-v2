import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { GamePack, GameEngine, GameGrade } from '../../../data/games/types';
import { canOpenPack, packsForGrade } from '../../../data/games';
import type { PracticeResult } from '../../../utils/competenceProgress';
import { useAuth } from '../../../context/AuthContext';
import { canAccess } from '../../../access/entitlements';
import { PremiumOffer } from '../../PremiumOffer';
import { LearningGamePlayer } from './LearningGamePlayer';
import './learningGames.css';

const STORE_KEY = 'mssid_learning_games_v1';
/**
 * Per pack: best stars of each level, and whether the pack XP was given. Lot 1 stored a single
 * `stars` for the whole pack; it is ignored now, but its `xpGiven` is kept so XP is never given twice.
 */
type PackProgress = { levels?: Record<string, number>; xpGiven?: boolean; stars?: number };
type Store = Record<string, PackProgress>;

function readStore(): Store {
  try {
    return JSON.parse(window.localStorage.getItem(STORE_KEY) ?? '{}') as Store;
  } catch {
    return {};
  }
}
function writeStore(store: Store) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    /* private mode */
  }
}

/** Records a solved level; returns the new progress and whether the pack XP is due now. */
export function recordLevel(pack: GamePack, progress: PackProgress | undefined, roundId: string, stars: number): { progress: PackProgress; giveXp: boolean } {
  const levels = { ...(progress?.levels ?? {}), [roundId]: Math.max(progress?.levels?.[roundId] ?? 0, stars) };
  const complete = pack.rounds.every((r) => (levels[r.id] ?? 0) > 0);
  const giveXp = complete && !progress?.xpGiven;
  return { progress: { levels, xpGiven: Boolean(progress?.xpGiven) || complete }, giveXp };
}

/** Best stars per level id of a pack, as kept on the device (journey map badges). */
export function readPackLevels(packId: string): Record<string, number> {
  return readStore()[packId]?.levels ?? {};
}

/** Best stars per level of a pack, kept on the device; `solveLevel` records one and gives the XP once. */
export function usePackLevels(pack: GamePack, onEarnXp?: (pack: GamePack, xp: number) => void) {
  const [levels, setLevels] = useState<Record<string, number>>(() => readStore()[pack.id]?.levels ?? {});
  useEffect(() => setLevels(readStore()[pack.id]?.levels ?? {}), [pack.id]);
  const solveLevel = (roundId: string, stars: number) => {
    const store = readStore();
    const { progress, giveXp } = recordLevel(pack, store[pack.id], roundId, stars);
    store[pack.id] = progress;
    writeStore(store);
    setLevels(progress.levels ?? {});
    if (giveXp) onEarnXp?.(pack, pack.xp);
  };
  return { levels, solveLevel };
}

export const ENGINE_LABEL_AR: Record<GameEngine, string> = {
  memory: '🃏 لُعْبَةُ الذَّاكِرَةِ',
  sort: '🧺 صَنِّفْ',
  order: '📅 رَتِّبْ',
  maze: '🧭 المَتَاهَةُ',
};

interface EntryProps {
  pack: GamePack;
  onPracticeResult?: (lessonId: string, result: PracticeResult) => void;
  /** XP of the pack, given once — the first time every level has been solved. */
  onEarnXp?: (pack: GamePack, xp: number) => void;
  /** Lesson page: open the game directly on the first level of this lesson. */
  focusLessonId?: string;
}

/**
 * Card of one learning game. Free accounts open the pack flagged `free` (one per grade); the others
 * show the neutral Premium message (no price in the Android app). Stars per level kept on the device.
 */
export const LearningGameEntry: React.FC<EntryProps> = ({ pack, onPracticeResult, onEarnXp, focusLessonId }) => {
  const { authUser } = useAuth();
  const open = canOpenPack(pack, canAccess('learningGames', authUser?.role));
  const [playing, setPlaying] = useState(false);
  const [locked, setLocked] = useState(false);
  const { levels, solveLevel } = usePackLevels(pack, onEarnXp);
  const focusLevel = focusLessonId ? pack.rounds.findIndex((r) => r.lessonId === focusLessonId) : -1;

  const done = pack.rounds.filter((r) => levels[r.id]).length;
  const total = pack.rounds.reduce((sum, r) => sum + (levels[r.id] ?? 0), 0);

  return (
    <>
      <motion.article
        data-learning-game-entry={pack.id}
        initial={{ opacity: 0, y: 18, rotateX: -20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        whileHover={{ y: -4, rotateX: 4 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{ background: pack.theme.sky, transformPerspective: 900 }}
        className="lg-entry"
        dir="rtl"
      >
        <span className="lg-entry-shine" aria-hidden="true" />
        <div className="flex items-center gap-3">
          <motion.span className="lg-entry-emoji" aria-hidden="true" animate={{ y: [0, -5, 0], rotateY: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
            {pack.theme.emoji}
          </motion.span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap gap-1">
              <span className="lg-entry-tag">{ENGINE_LABEL_AR[pack.engine]}</span>
              <span className="lg-entry-tag">🪜 {pack.rounds.length} مُسْتَوَيَاتٍ</span>
              {pack.free && <span className="lg-entry-tag">مَجَّانِيَّةٌ</span>}
            </p>
            <h3 className="text-base font-black leading-snug mt-1">{pack.titleAr}</h3>
            <p className="text-xs font-bold text-white/90 leading-relaxed">{pack.taglineAr}</p>
          </div>
        </div>
        <ol className="lg-entry-levels" aria-label={`${done} / ${pack.rounds.length} مُسْتَوَيَاتٍ · ⭐ ${total} / ${pack.rounds.length * 3}`}>
          {pack.rounds.map((r, i) => (
            <li key={r.id} data-state={levels[r.id] ? 'done' : 'todo'} data-focus={i === focusLevel ? '' : undefined}>
              <span>{i + 1}</span>
              {levels[r.id] ? <small aria-hidden="true">{'★'.repeat(levels[r.id])}</small> : null}
            </li>
          ))}
        </ol>
        <button type="button" data-lg-play onClick={() => (open ? setPlaying(true) : setLocked(true))} className="lg-entry-play">
          {open ? (done > 0 ? `▶ تَابِعْ · ⭐ ${total} / ${pack.rounds.length * 3}` : '▶ اِلْعَبْ مَعَ دِيدُو') : '🔒 اِلْعَبْ مَعَ دِيدُو'}
        </button>
        {locked && (
          <div className="mt-3 rounded-2xl bg-white/95 text-slate-900 p-3 space-y-2" role="status">
            <p className="text-sm font-extrabold">هَذِهِ اللُّعْبَةُ مُتَاحَةٌ لِحِسَابَاتِ العَائِلَةِ المُمَيَّزَةِ. اللُّعْبَةُ الأُولَى مِنْ كُلِّ مُسْتَوًى دِرَاسِيٍّ مَجَّانِيَّةٌ.</p>
            <PremiumOffer />
          </div>
        )}
      </motion.article>
      {playing && (
        <LearningGamePlayer
          pack={pack}
          best={levels}
          startLevel={focusLevel >= 0 ? focusLevel : undefined}
          onExit={() => setPlaying(false)}
          onResult={(lessonId, result) => onPracticeResult?.(lessonId, result)}
          onLevelSolved={solveLevel}
        />
      )}
    </>
  );
};

/** « ألعاب ديدو التعليمية » shelf for a grade (Challenges space). Renders nothing for a grade without packs yet. */
export const LearningGamesShelf: React.FC<{ grade: GameGrade } & Omit<EntryProps, 'pack' | 'focusLessonId'>> = ({ grade, ...entryProps }) => {
  const packs = packsForGrade(grade);
  if (!packs.length) return null;
  return (
    <section className="space-y-3" dir="rtl" data-learning-games-shelf={grade}>
      <div>
        <h2 className="text-lg font-black">🎮 أَلْعَابُ دِيدُو التَّعْلِيمِيَّةُ</h2>
        <p className="text-xs font-bold text-[var(--app-text-muted)]">مُغَامَرَاتٌ فِي الجَزَائِرِ بِعَشَرَةِ مُسْتَوَيَاتٍ: دِيدُو يَشْرَحُ كُلَّ خَطَأٍ، وَالنَّتَائِجُ تَصِلُ إِلَى دَفْتَرِ الوَلِيِّ.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {packs.map((pack) => <LearningGameEntry key={pack.id} pack={pack} {...entryProps} />)}
      </div>
    </section>
  );
};

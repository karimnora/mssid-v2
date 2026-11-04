import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { GamePack, GameEngine } from '../../../data/games/types';
import { canOpenPack, packsForGrade } from '../../../data/games';
import type { PrimaryGrade } from '../../../types';
import type { PracticeResult } from '../../../utils/competenceProgress';
import { useAuth } from '../../../context/AuthContext';
import { canAccess } from '../../../access/entitlements';
import { PremiumOffer } from '../../PremiumOffer';
import { LearningGamePlayer } from './LearningGamePlayer';
import './learningGames.css';

const STORE_KEY = 'mssid_learning_games_v1';
type Store = Record<string, { stars: number; xpGiven: boolean }>;

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

export const ENGINE_LABEL_AR: Record<GameEngine, string> = {
  memory: '🃏 لُعْبَةُ الذَّاكِرَةِ',
  sort: '🧺 صَنِّفْ',
  order: '📅 رَتِّبْ',
  maze: '🧭 المَتَاهَةُ',
};

interface EntryProps {
  pack: GamePack;
  onPracticeResult?: (lessonId: string, result: PracticeResult) => void;
  /** XP of the pack, given once — the first time it is finished. */
  onEarnXp?: (pack: GamePack, xp: number) => void;
}

/**
 * Card of one learning game. Free accounts open the pack flagged `free` (one per grade); the others
 * show the neutral Premium message (no price in the Android app). Best stars kept on the device.
 */
export const LearningGameEntry: React.FC<EntryProps> = ({ pack, onPracticeResult, onEarnXp }) => {
  const { authUser } = useAuth();
  const open = canOpenPack(pack, canAccess('learningGames', authUser?.role));
  const [playing, setPlaying] = useState(false);
  const [locked, setLocked] = useState(false);
  const [best, setBest] = useState(() => readStore()[pack.id]?.stars ?? 0);

  const finish = (stars: number) => {
    const store = readStore();
    const entry = store[pack.id] ?? { stars: 0, xpGiven: false };
    if (!entry.xpGiven) onEarnXp?.(pack, pack.xp);
    store[pack.id] = { stars: Math.max(entry.stars, stars), xpGiven: true };
    writeStore(store);
    setBest(store[pack.id].stars);
  };

  return (
    <>
      <motion.article
        data-learning-game-entry={pack.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg-entry"
        style={{ background: pack.theme.sky }}
        dir="rtl"
      >
        <div className="flex items-center gap-3">
          <span className="lg-entry-emoji" aria-hidden="true">{pack.theme.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap gap-1">
              <span className="lg-entry-tag">{ENGINE_LABEL_AR[pack.engine]}</span>
              {pack.free && <span className="lg-entry-tag">مَجَّانِيَّةٌ</span>}
            </p>
            <h3 className="text-base font-black leading-snug mt-1">{pack.titleAr}</h3>
            <p className="text-xs font-bold text-white/90 leading-relaxed">{pack.taglineAr}</p>
          </div>
          {best > 0 && <span className="text-lg shrink-0" aria-label={`${best} / 3`}>{'⭐'.repeat(best)}</span>}
        </div>
        <button type="button" data-lg-play onClick={() => (open ? setPlaying(true) : setLocked(true))} className="lg-entry-play">
          {open ? (best > 0 ? '🔁 أَعِدِ اللُّعْبَةَ' : '▶ اِلْعَبْ مَعَ دِيدُو') : '🔒 اِلْعَبْ مَعَ دِيدُو'}
        </button>
        {locked && (
          <div className="mt-3 rounded-2xl bg-white/95 text-slate-900 p-3 space-y-2" role="status">
            <p className="text-sm font-extrabold">هَذِهِ اللُّعْبَةُ مُتَاحَةٌ لِحِسَابَاتِ العَائِلَةِ المُمَيَّزَةِ. اللُّعْبَةُ الأُولَى مِنْ كُلِّ مُسْتَوًى مَجَّانِيَّةٌ.</p>
            <PremiumOffer />
          </div>
        )}
      </motion.article>
      {playing && (
        <LearningGamePlayer
          pack={pack}
          onExit={() => setPlaying(false)}
          onResult={(lessonId, result) => onPracticeResult?.(lessonId, result)}
          onFinish={finish}
        />
      )}
    </>
  );
};

/** « ألعاب ديدو التعليمية » shelf for a grade (Challenges space). Renders nothing for a grade without packs yet. */
export const LearningGamesShelf: React.FC<{ grade: PrimaryGrade } & Omit<EntryProps, 'pack'>> = ({ grade, ...entryProps }) => {
  const packs = packsForGrade(grade);
  if (!packs.length) return null;
  return (
    <section className="space-y-3" dir="rtl" data-learning-games-shelf={grade}>
      <div>
        <h2 className="text-lg font-black">🎮 أَلْعَابُ دِيدُو التَّعْلِيمِيَّةُ</h2>
        <p className="text-xs font-bold text-[var(--app-text-muted)]">مُغَامَرَاتٌ فِي الجَزَائِرِ: دِيدُو يَشْرَحُ كُلَّ خَطَأٍ، وَالنَّتَائِجُ تَصِلُ إِلَى دَفْتَرِ الوَلِيِّ.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {packs.map((pack) => <LearningGameEntry key={pack.id} pack={pack} {...entryProps} />)}
      </div>
    </section>
  );
};

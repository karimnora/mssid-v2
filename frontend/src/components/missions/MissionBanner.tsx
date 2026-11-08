import { progressStorage, useProgressOwner } from '../../utils/ownerStorage';
import { getActiveProgressOwner } from '../../utils/progressOwner';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import type { Mission } from '../../data/missions/types';
import { canOpenMission } from '../../data/missions';
import { useAuth } from '../../context/AuthContext';
import { canAccess } from '../../access/entitlements';
import type { PracticeResult } from '../../utils/competenceProgress';
import { MissionPlayer } from './MissionPlayer';
import { PremiumOffer } from '../PremiumOffer';
import { DidouPortrait } from '../world/DidouPortrait';

const STORE_KEY = 'mssid_missions_v1';
type Store = Record<string, { stars: number; xpGiven: boolean }>;

function readStore(owner?: string): Store {
  try {
    const value = JSON.parse(progressStorage(owner).getItem(STORE_KEY) ?? '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Store : {};
  } catch {
    return {};
  }
}
function writeStore(store: Store, owner: string) {
  try {
    progressStorage(owner).setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    /* private mode */
  }
}

/**
 * Lesson entry of « مهمة ديدو ». Free accounts open the mission flagged `free` (one per subject);
 * the others show the neutral Premium message (no price in the Android app). XP once, best stars kept.
 */
export const MissionBanner: React.FC<{
  mission: Mission;
  onPracticeResult?: (lessonId: string, result: PracticeResult) => void;
  onCompleteQuiz?: (lessonId: string, xp: number) => void;
}> = ({ mission, onPracticeResult, onCompleteQuiz }) => {
  const owner = useProgressOwner();
  const { authUser } = useAuth();
  const open = canOpenMission(mission, canAccess('immersiveMissions', authUser?.role));
  const [playing, setPlaying] = useState(false);
  const [locked, setLocked] = useState(false);
  const [best, setBest] = useState(() => readStore()[mission.id]?.stars ?? 0);

  useEffect(() => { setBest(readStore(owner)[mission.id]?.stars ?? 0); setPlaying(false); }, [owner, mission.id]);

  const finish = (stars: number) => {
    if (getActiveProgressOwner() !== owner) return;
    const store = readStore(owner);
    const entry = store[mission.id] ?? { stars: 0, xpGiven: false };
    if (!entry.xpGiven) onCompleteQuiz?.(mission.lessonId, mission.xp);
    store[mission.id] = { stars: Math.max(entry.stars, stars), xpGiven: true };
    writeStore(store, owner);
    setBest(store[mission.id].stars);
  };

  return (
    <>
      <motion.section
        data-mission-banner={mission.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[26px] p-4 text-white mb-4 shadow-[0_8px_0_rgba(8,12,52,0.35)]"
        style={{ background: mission.subject === 'arabic' ? 'linear-gradient(135deg,#059669,#065f46)' : 'linear-gradient(135deg,#2563eb,#312e81)' }}
      >
        <div className="flex items-center gap-3">
          <DidouPortrait size={64} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold text-white/80">🦊 مُهِمَّةُ دِيدُو التَّفَاعُلِيَّةُ{mission.free ? ' · مَجَّانِيَّةٌ' : ''}</p>
            <h3 className="text-base font-black leading-snug">{mission.titleAr}</h3>
            <p className="text-xs font-bold text-white/85">قِصَّةٌ، تَجْرِبَةٌ بِيَدِكَ، وَدِيدُو يَشْرَحُ كُلَّ خَطَأٍ</p>
          </div>
          {best > 0 && <span className="text-lg shrink-0" aria-label={`${best} / 3`}>{'⭐'.repeat(best)}</span>}
        </div>
        <button
          type="button"
          data-mission-start
          onClick={() => (open ? setPlaying(true) : setLocked(true))}
          className="mt-3 w-full min-h-[56px] rounded-2xl bg-[#ffd23f] text-[#3b2300] font-black text-base shadow-[0_5px_0_#b77900] active:translate-y-1"
        >
          {open ? (best > 0 ? '🔁 أَعِدِ المُهِمَّةَ' : '▶ ابْدَأِ المُهِمَّةَ') : '🔒 ابْدَأِ المُهِمَّةَ'}
        </button>
        {locked && (
          <div className="mt-3 rounded-2xl bg-white/95 text-slate-900 p-3 space-y-2" role="status">
            <p className="text-sm font-extrabold">مُتَاحٌ لِحِسَابَاتِ العَائِلَةِ المُمَيَّزَةِ.</p>
            <PremiumOffer />
          </div>
        )}
      </motion.section>
      {playing && (
        <MissionPlayer
          mission={mission}
          onExit={() => setPlaying(false)}
          onResult={(result) => { if (getActiveProgressOwner() === owner) onPracticeResult?.(mission.lessonId, result); }}
          onFinish={finish}
        />
      )}
    </>
  );
};

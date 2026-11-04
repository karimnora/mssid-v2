import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import type { ChooseItem, GroupItem, Mission, MissionItem, NumericItem, SortItem, TagItem } from '../../data/missions/types';
import { isItem } from '../../data/missions/types';
import { DidouGuide, type DidouMood } from '../immersive/DidouGuide';
import { ModalCloseButton } from '../ui/ModalCloseButton';
import { LESSON_ILLUSTRATIONS } from '../lessonViewer/illustrations';
import { speakText, stopSpeech } from '../../utils/speech';
import { playPop, playSoftMiss, playSoftSuccess } from '../../utils/immersiveFeedback';
import { parseChildNumber } from '../../utils/childNumber';
import type { PracticeResult } from '../../utils/competenceProgress';
import { Box3d, CoachStrip, Date3d, HintLadder, MissionIsland, StarBurst, TreasureEnd, type IslandStop } from './MissionQuest';
import './mission.css';

/** What a widget reports: a miss (first one only goes to the notebook) or the solution. */
type Report = { kind: 'miss'; whyAr: string } | { kind: 'solved' };

const SUBJECT_SKY: Record<string, string> = {
  math: 'linear-gradient(160deg, #1d4ed8 0%, #312e81 55%, #0b1240 100%)',
  arabic: 'linear-gradient(160deg, #047857 0%, #064e3b 55%, #022c22 100%)',
};

function say(line: string) {
  try {
    void speakText(line, 'ar-SA').catch(() => undefined);
  } catch {
    /* no speech engine (jsdom, some WebViews) */
  }
}

/**
 * « مهمة ديدو »: a hand-written immersive lesson played scene by scene. Didou speaks each line,
 * reacts to every wrong answer with its own explanation, then gives a hint; the final challenge
 * earns up to 3 stars. Results go to the parent notebook (alone / with help) like any exercise.
 */
export const MissionPlayer: React.FC<{
  mission: Mission;
  onExit: () => void;
  onResult?: (result: PracticeResult) => void;
  onFinish?: (stars: number) => void;
}> = ({ mission, onExit, onResult, onFinish }) => {
  const [index, setIndex] = useState(0);
  const [line, setLine] = useState(mission.scenes[0].sayAr);
  const [mood, setMood] = useState<DidouMood>('talk');
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(1);
  const misses = useRef<Record<string, number>>({});
  const [firstTry, setFirstTry] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  // Coach (maquette C): right answers in a row, help ladder rungs opened, a burst on each success.
  const [streak, setStreak] = useState(0);
  const [rungs, setRungs] = useState(0);
  const hinted = useRef<Record<string, boolean>>({});
  const [burst, setBurst] = useState(0);
  const scene = mission.scenes[index];
  const challengeIds = useMemo(() => mission.scenes.filter((s) => isItem(s) && s.challenge).map((s) => s.id), [mission]);
  const stars = Math.min(3, challengeIds.filter((id) => firstTry[id]).length);

  useEffect(() => {
    say(line);
  }, [line]);
  useEffect(() => () => stopSpeech(), []);

  useEffect(() => {
    setSolved(false);
    setRungs(0);
    setRevealed(1);
    setMood('talk');
    setLine(scene.kind === 'explain' ? `${scene.sayAr} ${scene.steps[0].sayAr}` : scene.sayAr);
  }, [scene]);

  const report = (item: MissionItem, r: Report) => {
    const exerciseId = `${mission.id}:${item.id}`;
    if (r.kind === 'miss') {
      const n = (misses.current[item.id] ?? 0) + 1;
      misses.current[item.id] = n;
      playSoftMiss();
      setMood('think');
      setLine(n >= 2 ? `${r.whyAr} ${item.hintAr}` : r.whyAr);
      if (n >= 2) setRungs((open) => Math.max(open, 1));
      setStreak(0);
      if (n === 1) onResult?.({ outcome: 'fail', exerciseId });
      return;
    }
    const clean = !misses.current[item.id] && !hinted.current[item.id];
    setStreak((s) => (clean ? s + 1 : 0));
    setBurst((b) => b + 1);
    setFirstTry((prev) => ({ ...prev, [item.id]: clean }));
    playSoftSuccess();
    setMood('happy');
    setLine(item.successAr);
    setSolved(true);
    onResult?.({ outcome: 'success', helped: !clean, exerciseId });
  };

  // Explain scenes: the same button reveals each step, then moves on. Items: only once solved.
  const canGoOn = scene.kind === 'story' || scene.kind === 'recap' || scene.kind === 'explain' || solved;
  const next = () => {
    playPop();
    if (scene.kind === 'explain' && revealed < scene.steps.length) {
      setRevealed(revealed + 1);
      setLine(scene.steps[revealed].sayAr);
      return;
    }
    if (index + 1 < mission.scenes.length) setIndex(index + 1);
    else {
      setFinished(true);
      setMood('happy');
      setLine(stars === 3 ? 'ثَلَاثُ نُجُومٍ! أَنْتَ بَطَلُ المُهِمَّةِ.' : 'أَنْهَيْتَ المُهِمَّةَ! أَعِدْهَا لِتَرْبَحَ كُلَّ النُّجُومِ.');
      onFinish?.(stars);
    }
  };

  const stops: IslandStop[] = mission.scenes.map((s, i) => ({
    id: s.id,
    state: finished || i < index ? 'done' : i === index ? 'now' : 'todo',
    challenge: isItem(s) && Boolean(s.challenge),
    clean: isItem(s) && s.id in firstTry ? firstTry[s.id] : undefined,
  }));

  const Art = scene.kind === 'story' && scene.artLessonId ? LESSON_ILLUSTRATIONS[scene.artLessonId] : undefined;

  return createPortal(
    <div className="mission-player fixed inset-0 z-[65] overflow-y-auto" dir="rtl" style={{ background: SUBJECT_SKY[mission.subject] ?? SUBJECT_SKY.math }} data-mission={mission.id} role="dialog" aria-modal="true" aria-label={mission.titleAr}>
      <div className="mission-stars-bg" aria-hidden="true" />
      <div className="relative max-w-xl mx-auto px-4 pt-4 pb-32 space-y-4">
        <header className="flex items-center justify-between gap-3">
          <ModalCloseButton onClose={onExit} tone="dark" />
          <div className="min-w-0 text-center">
            <p className="text-[11px] font-extrabold text-white/70">🦊 مُهِمَّةُ دِيدُو</p>
            <h1 className="text-base font-black text-white leading-tight">{mission.titleAr}</h1>
          </div>
          <span className="w-12" />
        </header>
        <MissionIsland stops={stops} finished={finished} didouMood={mood === 'think' ? 'think' : 'happy'} />
        <CoachStrip streak={streak} stars={stars} />

        <DidouGuide line={line} mood={mood} lang="ar" listenLabel="اسْتَمِعْ إِلَى دِيدُو" onReplay={() => say(line)} />

        <AnimatePresence mode="wait">
          <motion.section
            key={finished ? 'end' : scene.id}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="mission-card"
            data-scene={finished ? 'end' : scene.kind}
          >
            <StarBurst burst={burst} />
            {finished ? (
              <EndCard stars={stars} xp={mission.xp} onReplay={() => { misses.current = {}; hinted.current = {}; setFirstTry({}); setStreak(0); setFinished(false); setIndex(0); setLine(mission.scenes[0].sayAr); }} onExit={onExit} />
            ) : scene.kind === 'story' ? (
              Art ? <figure className="lesson-illustration"><Art /></figure> : <p className="text-6xl text-center">{scene.emoji ?? '🦊'}</p>
            ) : scene.kind === 'explain' ? (
              <ol className="space-y-2">
                {scene.steps.slice(0, revealed).map((step, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`mission-step tone-${step.tone ?? 'blue'}`}>
                    {step.showAr}
                  </motion.li>
                ))}
              </ol>
            ) : scene.kind === 'recap' ? (
              <div className="mission-recap space-y-2" data-mission-recap>
                <p className="text-sm font-black text-[#92400e]">📌 بِطَاقَةُ الذَّاكِرَةِ</p>
                {scene.pointsAr.map((p) => <p key={p} className="mission-recap-point">✓ {p}</p>)}
              </div>
            ) : (
              <>
                <ItemWidget key={scene.id} item={scene} onReport={(r) => report(scene, r)} />
                {!solved && (
                  <HintLadder
                    rungs={ladderFor(scene)}
                    opened={rungs}
                    onOpen={(n) => {
                      playPop();
                      hinted.current[scene.id] = true;
                      setRungs(n);
                      setMood('think');
                      setLine(ladderFor(scene)[n - 1].text);
                    }}
                  />
                )}
              </>
            )}
          </motion.section>
        </AnimatePresence>
      </div>

      {!finished && (
        <div className="fixed inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/40 to-transparent">
          <div className="max-w-xl mx-auto">
            <motion.button
              type="button"
              data-mission-next
              disabled={!canGoOn}
              onClick={next}
              whileTap={{ scale: 0.95 }}
              className="mission-next w-full"
            >
              {scene.kind === 'explain' && revealed < scene.steps.length ? 'الخُطْوَةُ التَّالِيَةُ ←' : index + 1 < mission.scenes.length ? 'التَّالِي ←' : 'أَنْهِ المُهِمَّةَ ⭐'}
            </motion.button>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
};

function EndCard({ stars, xp, onReplay, onExit }: { stars: number; xp: number; onReplay: () => void; onExit: () => void }) {
  return (
    <div className="text-center space-y-4" data-mission-end={stars}>
      <TreasureEnd stars={stars} xp={xp} />
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={onReplay} className="mission-secondary">🔁 أَعِدِ المُهِمَّةَ</button>
        <button type="button" onClick={onExit} className="mission-next">✓ أَنْهَيْتُ</button>
      </div>
    </div>
  );
}

/** The help ladder of an item: the hint, then the worked example and the steps when the mission has them. */
function ladderFor(item: MissionItem): { label: string; text: string }[] {
  const rungs = [{ label: 'فِكْرَةٌ', text: item.hintAr }];
  if (item.exampleAr) rungs.push({ label: 'مِثَالٌ', text: item.exampleAr });
  if (item.stepsAr?.length) rungs.push({ label: 'خُطْوَةً بِخُطْوَةٍ', text: item.stepsAr.join(' ← ') });
  return rungs;
}

function ItemWidget({ item, onReport }: { item: MissionItem; onReport: (r: Report) => void }) {
  switch (item.kind) {
    case 'choose':
      return <ChooseWidget item={item} onReport={onReport} />;
    case 'numeric':
      return <NumericWidget item={item} onReport={onReport} />;
    case 'sort':
      return <SortWidget item={item} onReport={onReport} />;
    case 'tag':
      return <TagWidget item={item} onReport={onReport} />;
    case 'group':
      return <GroupWidget item={item} onReport={onReport} />;
  }
}

function Prompt({ text }: { text: string }) {
  return <p className="mission-prompt">{text}</p>;
}

function ChooseWidget({ item, onReport }: { item: ChooseItem; onReport: (r: Report) => void }) {
  const [wrong, setWrong] = useState<string[]>([]);
  const [done, setDone] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      <Prompt text={item.promptAr} />
      <div className="grid gap-2">
        {item.options.map((option) => {
          const state = done === option.id ? 'right' : wrong.includes(option.id) ? 'wrong' : 'idle';
          return (
            <motion.button
              key={option.id}
              type="button"
              data-mission-option={state}
              disabled={done !== null || state === 'wrong'}
              animate={state === 'wrong' ? { x: [0, -8, 8, -4, 0] } : state === 'right' ? { scale: [1, 1.06, 1] } : {}}
              onClick={() => {
                if (option.correct) {
                  setDone(option.id);
                  onReport({ kind: 'solved' });
                } else {
                  setWrong((w) => [...w, option.id]);
                  onReport({ kind: 'miss', whyAr: option.whyAr ?? item.hintAr });
                }
              }}
              className={`mission-option ${state}`}
            >
              {option.textAr}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function NumericWidget({ item, onReport }: { item: NumericItem; onReport: (r: Report) => void }) {
  const [value, setValue] = useState('');
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(0);
  const check = () => {
    const n = parseChildNumber(value);
    if (n === null) return;
    if (Math.abs(n - item.answer) < 1e-9) {
      setDone(true);
      onReport({ kind: 'solved' });
      return;
    }
    setShake((s) => s + 1);
    const known = item.mistakes?.find((m) => Math.abs(m.value - n) < 1e-9);
    onReport({ kind: 'miss', whyAr: known?.whyAr ?? item.wrongAr });
  };
  return (
    <div className="space-y-3">
      <Prompt text={item.promptAr} />
      <motion.div key={shake} animate={shake ? { x: [0, -8, 8, -4, 0] } : {}} className="flex gap-2 items-center">
        <input
          data-mission-input
          inputMode="decimal"
          dir="ltr"
          value={value}
          disabled={done}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          className={`mission-input ${done ? 'right' : ''}`}
          aria-label={item.promptAr}
        />
        {item.unitAr && <span className="font-black text-slate-700">{item.unitAr}</span>}
      </motion.div>
      {!done && <button type="button" data-mission-check onClick={check} disabled={!value.trim()} className="mission-check">تَحَقَّقْ</button>}
    </div>
  );
}

function SortWidget({ item, onReport }: { item: SortItem; onReport: (r: Report) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [shake, setShake] = useState<string | null>(null);
  const drop = (binId: string) => {
    const card = item.cards.find((c) => c.id === picked);
    if (!card) return;
    if (card.bin !== binId) {
      setShake(card.id);
      onReport({ kind: 'miss', whyAr: card.whyAr });
      return;
    }
    playPop();
    const next = { ...placed, [card.id]: binId };
    setPlaced(next);
    setPicked(null);
    if (Object.keys(next).length === item.cards.length) onReport({ kind: 'solved' });
  };
  return (
    <div className="space-y-3">
      <Prompt text={item.promptAr} />
      <div className="flex flex-wrap gap-2 justify-center min-h-[52px]">
        {item.cards.filter((c) => !placed[c.id]).map((card) => (
          <motion.button
            key={card.id}
            type="button"
            data-mission-card={card.id}
            animate={shake === card.id ? { x: [0, -8, 8, -4, 0] } : picked === card.id ? { y: -6 } : { y: 0 }}
            onAnimationComplete={() => shake === card.id && setShake(null)}
            onClick={() => setPicked(card.id)}
            dir="auto"
            className={`mission-chip ${picked === card.id ? 'picked' : ''}`}
          >
            {card.textAr}
          </motion.button>
        ))}
      </div>
      <div className={`grid gap-2 ${item.bins.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {item.bins.map((bin) => (
          <button key={bin.id} type="button" data-mission-bin={bin.id} onClick={() => drop(bin.id)} disabled={!picked} className="mission-bin">
            <span className="mission-bin-label">{bin.labelAr}</span>
            {item.cards.filter((c) => placed[c.id] === bin.id).map((c) => <span key={c.id} dir="auto" className="mission-chip placed">{c.textAr}</span>)}
          </button>
        ))}
      </div>
      {picked && <p className="text-xs font-bold text-slate-600 text-center">اُنْقُرِ السَّلَّةَ المُنَاسِبَةَ</p>}
    </div>
  );
}

const ROLE_TONE = ['blue', 'green', 'orange', 'violet'];

function TagWidget({ item, onReport }: { item: TagItem; onReport: (r: Report) => void }) {
  const [active, setActive] = useState<number | null>(0);
  const [tags, setTags] = useState<Record<number, string>>({});
  const choose = (role: string) => {
    if (active === null) return;
    const word = item.words[active];
    if (word.role !== role) {
      onReport({ kind: 'miss', whyAr: word.whyAr });
      return;
    }
    playPop();
    const next = { ...tags, [active]: role };
    setTags(next);
    const left = item.words.findIndex((_, i) => !next[i]);
    setActive(left === -1 ? null : left);
    if (left === -1) onReport({ kind: 'solved' });
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center" dir="rtl">
        {item.words.map((word, i) => {
          const role = tags[i];
          const tone = role ? ROLE_TONE[item.roles.indexOf(role)] : undefined;
          return (
            <button key={i} type="button" data-mission-word={i} onClick={() => !role && setActive(i)} className={`mission-word ${active === i ? 'active' : ''} ${tone ? `tone-${tone}` : ''}`}>
              <span className="mission-word-text">{word.textAr}</span>
              <span className="mission-word-role">{role ?? '؟'}</span>
            </button>
          );
        })}
      </div>
      {active !== null && (
        <div className="flex flex-wrap gap-2 justify-center">
          {item.roles.map((role, i) => (
            <button key={role} type="button" data-mission-role={role} onClick={() => choose(role)} className={`mission-role tone-${ROLE_TONE[i]}`}>{role}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupWidget({ item, onReport }: { item: GroupItem; onReport: (r: Report) => void }) {
  const [boxes, setBoxes] = useState(0);
  const [boxValue, setBoxValue] = useState('');
  const [restValue, setRestValue] = useState('');
  const [done, setDone] = useState(false);
  const left = item.total - boxes * item.size;
  const full = left < item.size;
  const shown = Math.min(left, 36);
  const check = () => {
    const b = parseChildNumber(boxValue);
    const r = parseChildNumber(restValue);
    if (b === item.boxesAnswer && r === item.restAnswer) {
      setDone(true);
      onReport({ kind: 'solved' });
    } else if (b !== item.boxesAnswer) {
      onReport({ kind: 'miss', whyAr: `عُدَّ العُلَبَ المَمْلُوءَةَ جَيِّداً: مَلَأْتَ ${boxes} عُلْبَةً.` });
    } else {
      onReport({ kind: 'miss', whyAr: `انْظُرْ إِلَى مَا بَقِيَ خَارِجَ العُلَبِ: ${left}.` });
    }
  };
  return (
    <div className="space-y-3">
      <Prompt text={item.promptAr} />
      <div className="mission-heap" aria-label={`${left}`}>
        <span className="mission-heap-count">{left}</span>
        <div className="flex flex-wrap gap-0.5 justify-center">
          {Array.from({ length: shown }, (_, i) => (item.unitArt === 'date' ? <Date3d key={i} /> : <span key={i} className="text-lg leading-none">{item.unitEmoji}</span>))}
          {left > shown && <span className="text-sm font-black text-slate-500">+{left - shown}</span>}
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center min-h-[40px]">
        {Array.from({ length: boxes }, (_, i) => (
          <motion.span key={i} initial={{ scale: 0, y: -30, rotate: -20 }} animate={{ scale: 1, y: 0, rotate: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 14 }} className="mission-box3d"><Box3d label={item.size} /></motion.span>
        ))}
      </div>
      {!full ? (
        <button type="button" data-mission-fill onClick={() => { playPop(); setBoxes(boxes + 1); }} className="mission-check">📦 {item.boxLabelAr} ({item.size})</button>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-black text-center text-[#92400e]">لَمْ يَعُدِ البَاقِي يَكْفِي لِعُلْبَةٍ أُخْرَى!</p>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold text-slate-700">عَدَدُ العُلَبِ
              <input data-mission-boxes inputMode="numeric" dir="ltr" value={boxValue} disabled={done} onChange={(e) => setBoxValue(e.target.value)} className="mission-input" />
            </label>
            <label className="text-xs font-bold text-slate-700">البَاقِي
              <input data-mission-rest inputMode="numeric" dir="ltr" value={restValue} disabled={done} onChange={(e) => setRestValue(e.target.value)} className="mission-input" />
            </label>
          </div>
          {!done && <button type="button" data-mission-check onClick={check} disabled={!boxValue.trim() || !restValue.trim()} className="mission-check">تَحَقَّقْ</button>}
        </div>
      )}
    </div>
  );
}

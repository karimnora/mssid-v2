import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { PreschoolLanguage, PreschoolPlayQuality } from '../../data/preschool/types';
import { PRESCHOOL_MODULES } from '../../data/preschool';
import { PreschoolLanguagePicker } from './PreschoolLanguagePicker';
import { PreschoolModulePicker, type PreschoolHubView, type PreschoolLearnGroupId } from './PreschoolModulePicker';
import { PreschoolPathView } from './PreschoolPathView';
import { PreschoolActivityPlayer } from './PreschoolActivityPlayer';
import { PreschoolMagicBoard } from './PreschoolMagicBoard';
import { PreschoolXylophone } from './PreschoolXylophone';
import { PreschoolSoundBox } from './PreschoolSoundBox';
import { GamesHub } from './GamesHub';
import { localDateKey, useDailyChallenge } from './useDailyChallenge';
import { usePreschoolBadges } from './usePreschoolBadges';
import { PreschoolBadgeToast } from './PreschoolBadgeToast';
import { PreschoolModuleCompleteOverlay } from './PreschoolModuleCompleteOverlay';
import { playModuleCompleteFanfare } from './usePreschoolAudio';
import { PreschoolParentBilan } from './PreschoolParentBilan';
import {
  appendEvent,
  challengeStorageKey,
  loadActiveChildId,
  loadChildSlots,
  loadEvents,
  loadProgress,
  PreschoolChildId,
  saveActiveChildId,
  saveProgress,
  summarizeBilan,
  todayPlayIds,
} from './preschoolProgress';

interface PreschoolAppProps {
  onExit: () => void;
}

export type PreschoolSpecialTool = 'board' | 'xylophone' | 'soundbox' | 'games';

const LANGUAGE_STORAGE_KEY = 'mssid_preschool_language';

function loadStoredLanguage(): PreschoolLanguage | null {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return saved === 'ar' || saved === 'fr' || saved === 'en' ? saved : null;
}

// Top-level shell for Mode Éveil (Preschool Hub).
// Owns all navigation state and wires together: daily challenges, badge system,
// module-complete overlay, and the main activity/path/picker flow.
export const PreschoolApp: React.FC<PreschoolAppProps> = ({ onExit }) => {
  const [language, setLanguage]         = useState<PreschoolLanguage | null>(() => loadStoredLanguage());
  const [childId, setChildId] = useState<PreschoolChildId>(() => loadActiveChildId());
  const [childSlots, setChildSlots] = useState(() => loadChildSlots());
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>(() => loadProgress(loadActiveChildId()));
  const [playEvents, setPlayEvents] = useState(() => loadEvents(loadActiveChildId()));
  const [showParentBilan, setShowParentBilan] = useState(false);
  const [activeModuleId, setActiveModuleId]   = useState<string | null>(null);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [activeSpecialTool, setActiveSpecialTool] = useState<PreschoolSpecialTool | null>(null);
  const [pickerView, setPickerView] = useState<PreschoolHubView>('home');
  const [learnGroup, setLearnGroup] = useState<PreschoolLearnGroupId | null>(null);
  const [moduleCompleteOverlay, setModuleCompleteOverlay] = useState<typeof PRESCHOOL_MODULES[number] | null>(null);

  // Derived completedByModule map — used by badges & module picker
  const completedByModule: Record<string, number> = {};
  PRESCHOOL_MODULES.forEach((m) => {
    completedByModule[m.id] = m.activities.filter((a) => completedActivityIds.includes(a.id)).length;
  });

  const todayIds = useMemo(() => todayPlayIds(playEvents), [playEvents]);

  const dailyChallenge = useDailyChallenge(
    PRESCHOOL_MODULES,
    todayIds,
    language ?? 'fr',
    challengeStorageKey(childId),
  );

  const { queue: badgeQueue, dismissBadge } = usePreschoolBadges({
    completedActivityIds,
    completedByModule,
    streak: dailyChallenge.streak,
  });

  const handleNavigateToActivity = useCallback((moduleId: string, activityId: string) => {
    setActiveModuleId(moduleId);
    setActiveActivityId(activityId);
  }, []);

  const switchChild = useCallback((id: PreschoolChildId) => {
    saveActiveChildId(id);
    setChildId(id);
    setCompletedActivityIds(loadProgress(id));
    setPlayEvents(loadEvents(id));
    setShowParentBilan(false);
  }, []);

  useEffect(() => {
    if (language) window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    saveProgress(childId, completedActivityIds);
  }, [childId, completedActivityIds]);

  // ── Language picker (first launch) ───────────────────────────────────────
  if (!language) return <PreschoolLanguagePicker onSelect={setLanguage} />;

  // ── Special creative tools & games ───────────────────────────────────────
  if (activeSpecialTool === 'board') {
    return <PreschoolMagicBoard language={language} onSelectLanguage={setLanguage} onExit={() => setActiveSpecialTool(null)} />;
  }
  if (activeSpecialTool === 'xylophone') {
    return <PreschoolXylophone language={language} onSelectLanguage={setLanguage} onExit={() => setActiveSpecialTool(null)} />;
  }
  if (activeSpecialTool === 'soundbox') {
    return <PreschoolSoundBox language={language} onSelectLanguage={setLanguage} onExit={() => setActiveSpecialTool(null)} />;
  }
  if (activeSpecialTool === 'games') {
    return <GamesHub language={language} onExit={() => setActiveSpecialTool(null)} />;
  }

  // ── Activity player ───────────────────────────────────────────────────────
  const activeModule   = PRESCHOOL_MODULES.find((m) => m.id === activeModuleId) || null;
  const activeActivity = activeModule?.activities.find((a) => a.id === activeActivityId) || null;

  if (activeModule && activeActivity) {
    return (
      <>
        <PreschoolActivityPlayer
          activity={activeActivity}
          language={language}
          onExit={() => setActiveActivityId(null)}
          hasNext={
            activeModule.activities.findIndex((a) => a.id === activeActivity.id)
            < activeModule.activities.length - 1
          }
          onSkip={() => {
            const idx = activeModule.activities.findIndex((a) => a.id === activeActivity.id);
            const nextActivity = activeModule.activities[idx + 1] ?? null;
            setPlayEvents(appendEvent(childId, {
              activityId: activeActivity.id,
              date: localDateKey(),
              quality: 'helped',
            }));
            setActiveActivityId(nextActivity ? nextActivity.id : null);
          }}
          onComplete={(quality?: PreschoolPlayQuality) => {
            const idx = activeModule.activities.findIndex((a) => a.id === activeActivity.id);
            const nextActivity = activeModule.activities[idx + 1] ?? null;

            setPlayEvents(appendEvent(childId, {
              activityId: activeActivity.id,
              date: localDateKey(),
              quality: quality ?? 'done',
            }));

            setCompletedActivityIds((prev) => {
              if (prev.includes(activeActivity.id)) return prev;
              const next = [...prev, activeActivity.id];
              const ids  = activeModule.activities.map((a) => a.id);
              const justCompleted = ids.every((id) => next.includes(id))
                                 && !ids.every((id) => prev.includes(id));
              if (justCompleted) {
                playModuleCompleteFanfare();
                setModuleCompleteOverlay(activeModule);
              }
              return next;
            });

            setActiveActivityId(nextActivity ? nextActivity.id : null);
          }}
        />

        <PreschoolBadgeToast
          badge={badgeQueue[0] ?? null}
          language={language}
          onDismiss={dismissBadge}
        />
      </>
    );
  }

  // ── Module path ───────────────────────────────────────────────────────────
  if (activeModule) {
    return (
      <>
        <PreschoolPathView
          module={activeModule}
          language={language}
          completedActivityIds={completedActivityIds}
          onSelectStep={setActiveActivityId}
          onExit={() => setActiveModuleId(null)}
        />

        <AnimatePresence>
          {moduleCompleteOverlay && (
            <PreschoolModuleCompleteOverlay
              module={moduleCompleteOverlay}
              language={language}
              onClose={() => setModuleCompleteOverlay(null)}
            />
          )}
        </AnimatePresence>

        <PreschoolBadgeToast
          badge={badgeQueue[0] ?? null}
          language={language}
          onDismiss={dismissBadge}
        />
      </>
    );
  }

  // ── Module picker (home screen) ───────────────────────────────────────────
  return (
    <>
      <PreschoolModulePicker
        modules={PRESCHOOL_MODULES}
        language={language}
        completedByModule={completedByModule}
        onSelectModule={setActiveModuleId}
        onSelectSpecialTool={setActiveSpecialTool}
        onSelectLanguage={setLanguage}
        onResetLanguage={() => setLanguage(null)}
        onExit={onExit}
        dailyChallenge={{
          items: dailyChallenge.challengeItems,
          completedIds: dailyChallenge.completedIds,
          streak: dailyChallenge.streak,
        }}
        onNavigateToActivity={handleNavigateToActivity}
        view={pickerView}
        onViewChange={setPickerView}
        learnGroup={learnGroup}
        onLearnGroupChange={setLearnGroup}
        onOpenParentBilan={() => setShowParentBilan(true)}
      />

      {showParentBilan && (
        <PreschoolParentBilan
          language={language}
          rows={summarizeBilan(playEvents, PRESCHOOL_MODULES, language)}
          slots={childSlots}
          activeChildId={childId}
          onSelectChild={switchChild}
          onClose={() => setShowParentBilan(false)}
          onSlotsChanged={() => setChildSlots(loadChildSlots())}
        />
      )}

      <PreschoolBadgeToast
        badge={badgeQueue[0] ?? null}
        language={language}
        onDismiss={dismissBadge}
      />
    </>
  );
};

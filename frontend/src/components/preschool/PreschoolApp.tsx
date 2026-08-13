import React, { useEffect, useState } from 'react';
import { PreschoolLanguage } from '../../data/preschool/types';
import { PRESCHOOL_MODULES } from '../../data/preschool';
import { PreschoolLanguagePicker } from './PreschoolLanguagePicker';
import { PreschoolModulePicker } from './PreschoolModulePicker';
import { PreschoolPathView } from './PreschoolPathView';
import { PreschoolActivityPlayer } from './PreschoolActivityPlayer';
import { playModuleCompleteFanfare } from './usePreschoolAudio';

interface PreschoolAppProps {
  onExit: () => void;
}

const LANGUAGE_STORAGE_KEY = 'mssid_preschool_language';
const PROGRESS_STORAGE_KEY = 'mssid_preschool_progress';

function loadStoredLanguage(): PreschoolLanguage | null {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return saved === 'ar' || saved === 'fr' || saved === 'en' ? saved : null;
}

function loadStoredProgress(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch {
    return [];
  }
}

// Top-level shell for Mode Éveil — entirely self-contained state (language + completed steps across
// every module), stored under its own localStorage keys, never touching mssid_user_profile or the
// primary XP/badge system.
// Flow: language picker (once) → module hub (pick a game) → skill path → one activity at a time → back to path/hub.
export const PreschoolApp: React.FC<PreschoolAppProps> = ({ onExit }) => {
  const [language, setLanguage] = useState<PreschoolLanguage | null>(() => loadStoredLanguage());
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>(() => loadStoredProgress());
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);

  useEffect(() => {
    if (language) window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(completedActivityIds));
  }, [completedActivityIds]);

  if (!language) {
    return <PreschoolLanguagePicker onSelect={setLanguage} />;
  }

  const activeModule = PRESCHOOL_MODULES.find((m) => m.id === activeModuleId) || null;
  const activeActivity = activeModule?.activities.find((a) => a.id === activeActivityId) || null;

  if (activeModule && activeActivity) {
    return (
      <PreschoolActivityPlayer
        activity={activeActivity}
        language={language}
        onExit={() => setActiveActivityId(null)}
        onComplete={() => {
          setCompletedActivityIds((prev) => {
            if (prev.includes(activeActivity.id)) return prev;
            const next = [...prev, activeActivity.id];
            const moduleActivityIds = activeModule.activities.map((a) => a.id);
            const moduleFullyDone = moduleActivityIds.every((id) => next.includes(id));
            if (moduleFullyDone) playModuleCompleteFanfare();
            return next;
          });
          setActiveActivityId(null);
        }}
      />
    );
  }

  if (activeModule) {
    return (
      <PreschoolPathView
        module={activeModule}
        language={language}
        completedActivityIds={completedActivityIds}
        onSelectStep={setActiveActivityId}
        onExit={() => setActiveModuleId(null)}
      />
    );
  }

  const completedByModule: Record<string, number> = {};
  PRESCHOOL_MODULES.forEach((m) => {
    completedByModule[m.id] = m.activities.filter((a) => completedActivityIds.includes(a.id)).length;
  });

  return (
    <PreschoolModulePicker
      modules={PRESCHOOL_MODULES}
      language={language}
      completedByModule={completedByModule}
      onSelectModule={setActiveModuleId}
      onExit={onExit}
    />
  );
};

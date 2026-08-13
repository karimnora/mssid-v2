import React, { useEffect, useState } from 'react';
import { PreschoolLanguage } from '../../data/preschool/types';
import { PRESCHOOL_MODULES } from '../../data/preschool';
import { PreschoolLanguagePicker } from './PreschoolLanguagePicker';
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

// Top-level shell for Mode Éveil — entirely self-contained state (language + completed steps),
// stored under its own localStorage keys, never touching mssid_user_profile or the primary XP/badge
// system. Flow: language picker (once) → skill path → one activity at a time → back to path.
export const PreschoolApp: React.FC<PreschoolAppProps> = ({ onExit }) => {
  const [language, setLanguage] = useState<PreschoolLanguage | null>(() => loadStoredLanguage());
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>(() => loadStoredProgress());
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);

  const module = PRESCHOOL_MODULES[0]; // MVP pilot: a single "numbers 0-10" module

  useEffect(() => {
    if (language) window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(completedActivityIds));
  }, [completedActivityIds]);

  if (!language) {
    return <PreschoolLanguagePicker onSelect={setLanguage} />;
  }

  const activeActivity = module.activities.find((a) => a.id === activeActivityId) || null;

  if (activeActivity) {
    return (
      <PreschoolActivityPlayer
        activity={activeActivity}
        language={language}
        onExit={() => setActiveActivityId(null)}
        onComplete={() => {
          setCompletedActivityIds((prev) => {
            if (prev.includes(activeActivity.id)) return prev;
            const next = [...prev, activeActivity.id];
            if (next.length === module.activities.length) playModuleCompleteFanfare();
            return next;
          });
          setActiveActivityId(null);
        }}
      />
    );
  }

  return (
    <PreschoolPathView
      module={module}
      language={language}
      completedActivityIds={completedActivityIds}
      onSelectStep={setActiveActivityId}
      onExit={onExit}
    />
  );
};

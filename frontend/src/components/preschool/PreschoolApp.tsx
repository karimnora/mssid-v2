import React, { useEffect, useState } from 'react';
import { PreschoolLanguage } from '../../data/preschool/types';
import { PRESCHOOL_MODULES } from '../../data/preschool';
import { PreschoolLanguagePicker } from './PreschoolLanguagePicker';
import { PreschoolModulePicker } from './PreschoolModulePicker';
import { PreschoolPathView } from './PreschoolPathView';
import { PreschoolActivityPlayer } from './PreschoolActivityPlayer';
import { PreschoolMagicBoard } from './PreschoolMagicBoard';
import { PreschoolXylophone } from './PreschoolXylophone';
import { PreschoolSoundBox } from './PreschoolSoundBox';
import { GamesHub }   from './GamesHub'; // Hub centralisant tous les mini-jeux
import { playModuleCompleteFanfare } from './usePreschoolAudio';

interface PreschoolAppProps {
  onExit: () => void;
}

// Ajout du module 'games' ici
export type PreschoolSpecialTool = 'board' | 'xylophone' | 'soundbox' | 'games';

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

// Top-level shell for Mode Éveil (Preschool Hub)
export const PreschoolApp: React.FC<PreschoolAppProps> = ({ onExit }) => {
  const [language, setLanguage] = useState<PreschoolLanguage | null>(() => loadStoredLanguage());
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>(() => loadStoredProgress());
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [activeSpecialTool, setActiveSpecialTool] = useState<PreschoolSpecialTool | null>(null);

  useEffect(() => {
    if (language) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(completedActivityIds));
  }, [completedActivityIds]);

  // Initial startup language choice if not yet selected
  if (!language) {
    return <PreschoolLanguagePicker onSelect={setLanguage} />;
  }

  // Handle special creative tools & games
  if (activeSpecialTool === 'board') {
    return (
      <PreschoolMagicBoard
        language={language}
        onSelectLanguage={setLanguage}
        onExit={() => setActiveSpecialTool(null)}
      />
    );
  }

  if (activeSpecialTool === 'xylophone') {
    return (
      <PreschoolXylophone
        language={language}
        onSelectLanguage={setLanguage}
        onExit={() => setActiveSpecialTool(null)}
      />
    );
  }

  if (activeSpecialTool === 'soundbox') {
    return (
      <PreschoolSoundBox
        language={language}
        onSelectLanguage={setLanguage}
        onExit={() => setActiveSpecialTool(null)}
      />
    );
  }

  // Hub Jeux — regroupe tous les mini-jeux
  if (activeSpecialTool === 'games') {
    return (
      <GamesHub
        language={language}
        onExit={() => setActiveSpecialTool(null)}
      />
    );
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
      onSelectSpecialTool={setActiveSpecialTool}
      onSelectLanguage={setLanguage}
      onResetLanguage={() => setLanguage(null)}
      onExit={onExit}
    />
  );
};
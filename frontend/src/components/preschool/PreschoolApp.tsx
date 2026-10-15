import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { isPlaySuccess, PreschoolLanguage, PreschoolPlayQuality } from '../../data/preschool/types';
import { PRESCHOOL_MODULES } from '../../data/preschool';
import { useAuth } from '../../context/AuthContext';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';
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
  adoptGuestProgressIfEmpty,
  appendEvent,
  challengeStorageKey,
  firstNameOf,
  loadEvents,
  loadProgress,
  loadSingleChildName,
  moduleProgressRows,
  progressOwnerId,
  saveProgress,
  saveSingleChildName,
  suggestNextActivity,
  summarizeBilan,
  todayPlayIds,
} from './preschoolProgress';

interface PreschoolAppProps {
  onExit: () => void;
  onOpenAuth?: (mode: 'login' | 'register', reason: string | null) => void;
  isAuthModalOpen?: boolean;
}

const PreschoolGardenMission = React.lazy(() => import('./PreschoolGardenMission').then(module => ({ default: module.PreschoolGardenMission })));
export type PreschoolSpecialTool = 'board' | 'xylophone' | 'soundbox' | 'games' | 'garden';

const LANGUAGE_STORAGE_KEY = 'mssid_preschool_language';

function loadStoredLanguage(): PreschoolLanguage | null {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return saved === 'ar' || saved === 'fr' || saved === 'en' ? saved : null;
}

function parentAuthReason(language: PreschoolLanguage): string {
  if (language === 'ar') return 'لِمُتَابَعَةِ مَا فَعَلَهُ طِفْلُكَ حَقًّا، سَجِّلِ الدُّخُولَ أَوْ أَنْشِئْ حِسَابًا مَجَّانِيًّا.';
  if (language === 'fr') return 'Pour voir ce que votre enfant a vraiment fait, connectez-vous ou créez un compte gratuit.';
  return 'To see what your child really did, sign in or create a free account.';
}

// Top-level shell for Mode Éveil (Preschool Hub).
export const PreschoolApp: React.FC<PreschoolAppProps> = ({
  onExit,
  onOpenAuth,
  isAuthModalOpen = false,
}) => {
  const { authUser } = useAuth();
  const parentBilanEnabled = useFeatureFlag('preschoolParentBilan');
  const ownerId = progressOwnerId(authUser?.id);
  const skipSaveRef = useRef(true);

  const [loadedOwnerId, setLoadedOwnerId] = useState(ownerId);
  const [language, setLanguage] = useState<PreschoolLanguage | null>(() => loadStoredLanguage());
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>(() => loadProgress(ownerId));
  const [playEvents, setPlayEvents] = useState(() => loadEvents(ownerId));
  const [childName, setChildName] = useState(() => loadSingleChildName(ownerId) || firstNameOf(authUser?.nom));
  const [showParentBilan, setShowParentBilan] = useState(false);
  const [awaitingParentAuth, setAwaitingParentAuth] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [activeSpecialTool, setActiveSpecialTool] = useState<PreschoolSpecialTool | null>(null);
  const [pickerView, setPickerView] = useState<PreschoolHubView>('home');
  const [learnGroup, setLearnGroup] = useState<PreschoolLearnGroupId | null>(null);
  const [moduleCompleteOverlay, setModuleCompleteOverlay] = useState<typeof PRESCHOOL_MODULES[number] | null>(null);

  const completedByModule: Record<string, number> = {};
  PRESCHOOL_MODULES.forEach((m) => {
    completedByModule[m.id] = m.activities.filter((a) => completedActivityIds.includes(a.id)).length;
  });

  const todayIds = useMemo(() => loadedOwnerId === ownerId ? todayPlayIds(playEvents) : [], [playEvents, loadedOwnerId, ownerId]);

  const dailyChallenge = useDailyChallenge(
    PRESCHOOL_MODULES,
    todayIds,
    language ?? 'fr',
    challengeStorageKey(ownerId),
  );

  const { queue: badgeQueue, dismissBadge } = usePreschoolBadges({
    ownerId,
    completedActivityIds,
    completedByModule,
    streak: dailyChallenge.streak,
  });

  const handleNavigateToActivity = useCallback((moduleId: string, activityId: string) => {
    setActiveModuleId(moduleId);
    setActiveActivityId(activityId);
  }, []);

  useEffect(() => {
    if (language) window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    if (authUser?.id) adoptGuestProgressIfEmpty(authUser.id);
    skipSaveRef.current = true;
    setCompletedActivityIds(loadProgress(ownerId));
    setPlayEvents(loadEvents(ownerId));
    setLoadedOwnerId(ownerId);
    setChildName(loadSingleChildName(ownerId) || firstNameOf(authUser?.nom));
  }, [ownerId, authUser?.id, authUser?.nom]);

  useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    saveProgress(ownerId, completedActivityIds);
  }, [ownerId, completedActivityIds]);

  useEffect(() => {
    if (!parentBilanEnabled) {
      setShowParentBilan(false);
      setAwaitingParentAuth(false);
    }
  }, [parentBilanEnabled]);

  useEffect(() => {
    if (!parentBilanEnabled || !awaitingParentAuth) return;
    if (authUser) {
      setAwaitingParentAuth(false);
      setShowParentBilan(true);
    }
  }, [authUser, awaitingParentAuth, parentBilanEnabled]);

  useEffect(() => {
    if (!isAuthModalOpen && awaitingParentAuth && !authUser) {
      setAwaitingParentAuth(false);
    }
  }, [isAuthModalOpen, awaitingParentAuth, authUser]);

  const handleParentUnlock = useCallback(() => {
    if (!parentBilanEnabled) return;
    if (authUser) {
      setShowParentBilan(true);
      return;
    }
    if (onOpenAuth && language) {
      setAwaitingParentAuth(true);
      onOpenAuth('login', parentAuthReason(language));
      return;
    }
    setShowParentBilan(true);
  }, [authUser, language, onOpenAuth, parentBilanEnabled]);

  const lastActivityId = playEvents[playEvents.length - 1]?.activityId ?? null;
  const nextStepHint = language
    ? suggestNextActivity(PRESCHOOL_MODULES, completedActivityIds, lastActivityId)
    : null;
  const nextStep = nextStepHint && language
    ? {
        title: PRESCHOOL_MODULES.find((m) => m.id === nextStepHint.moduleId)
          ?.activities.find((a) => a.id === nextStepHint.activityId)?.i18n[language].title ?? nextStepHint.activityId,
        moduleTitle: PRESCHOOL_MODULES.find((m) => m.id === nextStepHint.moduleId)?.titleI18n[language] ?? '',
      }
    : null;

  if (!language) return <PreschoolLanguagePicker onSelect={setLanguage} />;

  if (activeSpecialTool === 'garden') {
    return <React.Suspense fallback={<p role="status">{language === 'ar' ? 'نفتح الحديقة…' : language === 'en' ? 'Opening the garden…' : 'Ouverture du jardin…'}</p>}><PreschoolGardenMission language={language} onExit={() => setActiveSpecialTool(null)}/></React.Suspense>;
  }
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

  const activeModule = PRESCHOOL_MODULES.find((m) => m.id === activeModuleId) || null;
  const activeActivity = activeModule?.activities.find((a) => a.id === activeActivityId) || null;

  if (activeModule && activeActivity) {
    return (
      <>
        <PreschoolActivityPlayer
          activity={activeActivity}
          language={language}
          onAttempt={quality => {
            setPlayEvents(appendEvent(ownerId, {
              activityId: activeActivity.id,
              date: localDateKey(),
              quality,
            }));
          }}
          onExit={() => setActiveActivityId(null)}
          hasNext={
            activeModule.activities.findIndex((a) => a.id === activeActivity.id)
            < activeModule.activities.length - 1
          }
          onSkip={() => {
            const idx = activeModule.activities.findIndex((a) => a.id === activeActivity.id);
            const nextActivity = activeModule.activities[idx + 1] ?? null;
            setPlayEvents(appendEvent(ownerId, {
              activityId: activeActivity.id,
              date: localDateKey(),
              quality: 'skipped',
            }));
            setActiveActivityId(nextActivity ? nextActivity.id : null);
          }}
          onComplete={(quality?: PreschoolPlayQuality) => {
            const resolved = quality ?? 'done';
            setPlayEvents(appendEvent(ownerId, {
              activityId: activeActivity.id,
              date: localDateKey(),
              quality: resolved,
            }));

            if (!isPlaySuccess(resolved)) {
              return;
            }

            const idx = activeModule.activities.findIndex((a) => a.id === activeActivity.id);
            const nextActivity = activeModule.activities[idx + 1] ?? null;

            setCompletedActivityIds((prev) => {
              if (prev.includes(activeActivity.id)) return prev;
              const next = [...prev, activeActivity.id];
              const ids = activeModule.activities.map((a) => a.id);
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
        onOpenParentBilan={parentBilanEnabled ? handleParentUnlock : undefined}
      />

      {parentBilanEnabled && showParentBilan && (
        <PreschoolParentBilan
          language={language}
          childName={childName}
          accountEmail={authUser?.email}
          todayCount={todayIds.length}
          streak={dailyChallenge.streak}
          completedCount={completedActivityIds.length}
          modules={moduleProgressRows(PRESCHOOL_MODULES, completedActivityIds, language)}
          nextStep={nextStep}
          rows={summarizeBilan(playEvents, PRESCHOOL_MODULES, language)}
          onSaveName={(name) => {
            saveSingleChildName(ownerId, name);
            setChildName(name.trim().slice(0, 24));
          }}
          onPlayNext={nextStepHint ? () => {
            setShowParentBilan(false);
            handleNavigateToActivity(nextStepHint.moduleId, nextStepHint.activityId);
          } : undefined}
          onClose={() => setShowParentBilan(false)}
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

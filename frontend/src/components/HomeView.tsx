import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { AuthUser } from '../types/auth';
import { PrimaryGrade, SubjectId, SubjectInfo } from '../types';
import { DidouAvatarConfig } from '../types/ecosystem';
import { COURSE_SUBJECTS_LIST, isToolAvailableForGrade } from '../data/subjectsData';
import { DIDOU_OUTFITS_LIST } from '../data/outfitsData';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import { LabsPoleIcon } from './HomePoleIcons';
import { TapSpeakButton } from './lessonViewer/TapSpeakButton';
import { speakText, stopSpeech, useVoiceAvailable } from '../utils/speech';
import { VoiceUnavailableBanner } from './VoiceUnavailableBanner';
import { DidouVirtualCompanion } from './DidouVirtualCompanion';
import { SubjectIllustratedCard } from './SubjectIllustratedCard';
import { CardBlobBackdrop } from './CardBlobBackdrop';
import { DidouRibbon } from './world/DidouRibbon';

export type HomePoleId = 'courses' | 'labs' | 'exams' | 'challenges';

interface HomeViewProps {
  grade: PrimaryGrade;
  authUser: AuthUser | null;
  userName: string;
  guestViewedCount?: number;
  guestRemaining?: number;
  maxGuestLessons?: number;
  goldCoins?: number;
  xp?: number;
  level?: number;
  avatarConfig?: DidouAvatarConfig;
  courseSubjects?: SubjectInfo[];
  onSelectPole: (pole: HomePoleId) => void;
  onSelectSubject?: (subject: SubjectId) => void;
  onOpenAuthModal?: () => void;
  onOpenPreschool?: () => void;
  onOpenMarket?: () => void;
  onOpenWilayas?: () => void;
  onOpenHistoryMuseum?: () => void;
  onOpenScienceLab?: () => void;
  onOpenMathLab?: () => void;
  onOpenTamazightCurriculum?: () => void;
  onOpenTouchWriting?: () => void;
  onOpenDressingRoom?: () => void;
  onOpenHomeworkPin?: () => void;
  onOpenPrintables?: () => void;
  onOpenHonorCertificates?: () => void;
  onOpenOfflinePacks?: () => void;
  onFeedDidou?: (treatId: string, energyBonus: number, xpBonus: number, cost: number) => void;
  lastActivityTitle?: string | null;
  onResumeActivity?: () => void;
  /** V2 « Kawkab Didou » entry; omitted when the didouJourney flag is off. */
  onOpenJourney?: () => void;
  /** V2 « monde de jeu » design: Didou's ribbon on top of the home screen. */
  worldDesign?: boolean;
}

const SUBJECT_ORDER: SubjectId[] = [
  'arabic',
  'math',
  'french',
  'science',
  'islamic',
  'history_geo',
  'civics',
  'english',
];

const SUBJECT_EMOJI: Partial<Record<SubjectId, string>> = {
  arabic: '📗',
  math: '📐',
  french: '🇫🇷',
  science: '🧪',
  islamic: '🕌',
  history_geo: '🧭',
  civics: '⚖️',
  english: '🇬🇧',
};

const SUBJECT_CARD: Partial<Record<SubjectId, string>> = {
  arabic: 'kids-card-arabe',
  math: 'kids-card-maths',
  french: 'kids-card-francais',
  science: 'kids-card-sciences',
  islamic: 'kids-card-islamique',
  history_geo: 'kids-card-histoire',
  civics: 'kids-card-civics',
  english: 'kids-card-english',
};

const GRADE_NAV_KEY: Record<PrimaryGrade, 'grade1APFull' | 'grade2APFull' | 'grade3APFull' | 'grade4APFull' | 'grade5APFull'> = {
  '1AP': 'grade1APFull',
  '2AP': 'grade2APFull',
  '3AP': 'grade3APFull',
  '4AP': 'grade4APFull',
  '5AP': 'grade5APFull',
};

const spring = { type: 'spring' as const, stiffness: 400, damping: 22 };
const VISIBLE_SUBJECTS = 4;

const homeSubjectGridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
    },
  },
};

const homeSubjectItemVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 340,
      damping: 24,
      mass: 0.8,
    },
  },
};

export const HomeView: React.FC<HomeViewProps> = ({
  grade,
  authUser,
  userName,
  goldCoins = 150,
  xp = 0,
  level,
  avatarConfig,
  courseSubjects,
  onSelectPole,
  onSelectSubject,
  onOpenAuthModal,
  onOpenPreschool,
  onOpenWilayas,
  onOpenMathLab,
  onOpenDressingRoom,
  onOpenHonorCertificates,
  onFeedDidou,
  lastActivityTitle,
  onResumeActivity,
  onOpenJourney,
  worldDesign = false,
}) => {
  const isGuest = !authUser;
  const isYoung = grade === '1AP' || grade === '2AP';
  const t = useTranslation('home');
  const tNav = useTranslation('navigation');
  const { direction, locale } = useLocaleContext();

  const activeSpecies = avatarConfig?.species || 'fennec';
  const activeOutfitId = avatarConfig?.activeOutfit || 'default';
  const activeOutfit = DIDOU_OUTFITS_LIST.find((o) => o.id === activeOutfitId) || DIDOU_OUTFITS_LIST[0];
  const petEmoji = activeSpecies === 'eagle' ? '🦅' : '🦊';

  // 1AP-3AP: same audio guidance level as CourseSelectionView — this is the very first screen a
  // fragile reader lands on, so it needs a listen button at least as much as the screens after it.
  const showAudio = grade === '1AP' || grade === '2AP' || grade === '3AP';
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const speechLang = locale === 'fr' ? 'fr-FR' : 'ar-SA';
  const voiceAvailable = useVoiceAvailable(speechLang);
  useEffect(() => stopSpeech, []);
  const handleSpeak = (key: string, text: string) => {
    if (speakingKey === key) {
      stopSpeech();
      setSpeakingKey(null);
      return;
    }
    setSpeakingKey(key);
    void speakText(text, speechLang, 0.85).then(() => {
      setSpeakingKey((prev) => (prev === key ? null : prev));
    });
  };

  const displayLevel = level ?? Math.floor(xp / 100) + 1;
  const progressPercent = xp % 100;

  const subjects = useMemo(() => {
    const source = (courseSubjects ?? COURSE_SUBJECTS_LIST).filter(
      (subject) => isToolAvailableForGrade(subject, grade) && !subject.featureFlag,
    );
    return [...source].sort(
      (a, b) => SUBJECT_ORDER.indexOf(a.id) - SUBJECT_ORDER.indexOf(b.id),
    );
  }, [courseSubjects, grade]);

  const visibleSubjects = subjects.slice(0, VISIBLE_SUBJECTS);
  const preschoolBlock = onOpenPreschool ? (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      transition={spring}
      onClick={onOpenPreschool}
      className="kids-pop kids-card-presco w-full relative overflow-hidden rounded-[22px] p-4 text-white cursor-pointer text-start"
    >
      <CardBlobBackdrop />
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold bg-white/25 inline-block px-2.5 py-0.5 rounded-full mb-1">
            {t('preschoolFeatureBadge')}
          </p>
          <h2 className="text-[15px] font-extrabold leading-snug">{t('preschoolFeatureTitle')}</h2>
          <p className="text-[11.5px] font-medium text-white/90 mt-0.5">{t('preschoolFeatureDesc')}</p>
          <span className="mt-2 hit-target inline-flex items-center justify-center bg-white text-amber-950 px-4 rounded-2xl font-extrabold text-sm">
            {t('preschoolFeatureCta')}
          </span>
        </div>
        <div className="w-[46px] h-[46px] rounded-2xl bg-white/25 text-[23px] flex items-center justify-center shrink-0">
          🎈
        </div>
      </div>
    </motion.button>
  ) : null;

  const openSubject = (subjectId: SubjectId) => {
    if (onSelectSubject) onSelectSubject(subjectId);
    else onSelectPole('courses');
  };

  return (
    <div className="space-y-5" dir={direction} data-home-layout="full" data-home-grade={grade} data-home-poles="kids">
      <VoiceUnavailableBanner visible={showAudio && voiceAvailable === false} />
      {worldDesign && <DidouRibbon text={t('worldDidouHome')} lang={locale === 'fr' ? 'fr' : 'ar'} listenLabel={t('worldDidouListen')} />}
      <section className="kids-hero kids-pop-soft relative overflow-hidden rounded-[30px] p-5 text-white lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:items-center lg:gap-x-8 lg:py-4">
        <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-bold text-white/90">{t('systemBadge')}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-[22px] font-black leading-snug">
                {isGuest ? t('welcomeGuest') : t('welcomeUser', { name: userName || t('guestFallbackName') })}
              </h1>
              {showAudio && (
                <TapSpeakButton
                  snippetKey="home-welcome"
                  text={isGuest ? t('welcomeGuest') : t('welcomeUser', { name: userName || t('guestFallbackName') })}
                  speakingKey={speakingKey}
                  onSpeak={handleSpeak}
                  size="lg"
                />
              )}
            </div>
            <p className="text-[13px] font-medium text-white/90 leading-relaxed mt-1">
              {t('heroGradeLine', { grade: tNav(GRADE_NAV_KEY[grade]) })}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenDressingRoom}
            disabled={!onOpenDressingRoom}
            className="w-16 h-16 rounded-[20px] bg-white/20 hover:bg-white/30 flex items-center justify-center text-3xl shrink-0 disabled:cursor-default relative group cursor-pointer transition-transform active:scale-95"
            aria-label={t('dressingRoomLabel')}
            title="خزانة وتخصيص ديدو"
          >
            <span>{petEmoji}</span>
            <span className="absolute bottom-1 end-1 text-sm bg-black/40 rounded-lg px-1">
              {activeOutfit.icon}
            </span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-start mt-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-[13px] font-extrabold bg-white/20">
            ⭐ {t('levelPill', { level: displayLevel })}
          </span>
          <button
            type="button"
            onClick={onOpenDressingRoom}
            disabled={!onOpenDressingRoom}
            className="hit-target inline-flex items-center gap-1.5 rounded-2xl px-3.5 text-[13px] font-extrabold bg-gradient-to-l from-[var(--kids-sun-1)] to-[var(--kids-sun-2)] text-amber-950 disabled:cursor-default"
          >
            🪙 {goldCoins} {t('coinsLabel')}
          </button>
        </div>
        </div>

        <div className="min-w-0">
        <motion.button
          type="button"
          data-pole="courses"
          data-home-resume={lastActivityTitle && onResumeActivity ? 'true' : undefined}
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={() => {
            if (lastActivityTitle && onResumeActivity) onResumeActivity();
            else openSubject('math');
          }}
          className="kids-pop hit-target mt-3.5 lg:mt-0 w-full rounded-[18px] bg-white text-emerald-700 font-extrabold text-[14.5px] flex items-center justify-center gap-2"
        >
          <span data-pole-icon="courses" hidden />
          {lastActivityTitle && onResumeActivity
            ? t('heroResumeCta', { title: lastActivityTitle })
            : t('heroContinueCta')}
        </motion.button>

        <div className="mt-3.5 h-2 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-l from-[var(--kids-sun-1)] to-[var(--kids-sun-2)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11.5px] text-white/85 mt-1.5">{t('heroProgressLabel', { percent: progressPercent })}</p>
        </div>
      </section>

      {onOpenJourney && (
        <motion.button
          type="button"
          data-home-journey="true"
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={onOpenJourney}
          className="kids-pop hit-target w-full rounded-[22px] p-4 flex items-center gap-4 text-start text-white overflow-hidden"
          style={{ background: 'radial-gradient(ellipse 90% 140% at 20% 50%, #1d5bd8 0%, #0c2a8c 55%, #081a5c 100%)', minHeight: 88 }}
        >
          <span aria-hidden="true" className="shrink-0 grid place-items-center rounded-full" style={{ width: 64, height: 64, background: 'radial-gradient(circle at 38% 32%, #bfeaff 0%, #4fb0ff 30%, #1d6fe8 70%)', boxShadow: '0 0 18px rgba(110,190,255,.7)' }}>
            <svg viewBox="0 0 24 24" width="30" height="30"><path d="M7 4.5l13 7.5-13 7.5z" fill="#fff" /></svg>
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-black leading-tight">{t('journeyCardTitle')}</span>
            <span className="block text-[13px] font-bold text-white/85 leading-snug">{t('journeyCardSubtitle')}</span>
          </span>
        </motion.button>
      )}

      {/* VIRTUAL COMPANION EMBEDDED CARD */}
      <DidouVirtualCompanion
        avatarConfig={avatarConfig}
        goldCoins={goldCoins}
        xp={xp}
        level={displayLevel}
        userName={userName}
        onOpenDressingRoom={onOpenDressingRoom}
        onFeed={onFeedDidou}
      />

      {isGuest && (
        <div className="rounded-[20px] p-3.5 bg-[var(--app-card-bg)] border-2 border-[var(--app-card-subtle)] kids-pop-soft flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-[var(--app-text-muted)] leading-relaxed">
            {t('guestBannerSubtitle')}
          </p>
          {onOpenAuthModal && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              transition={spring}
              onClick={onOpenAuthModal}
              className="hit-target shrink-0 bg-emerald-700 text-white px-4 rounded-[14px] font-extrabold text-xs sm:text-sm"
            >
              {t('guestSignupCta')}
            </motion.button>
          )}
        </div>
      )}

      {isYoung && preschoolBlock}

      <section>
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => onSelectPole('courses')}
            className="hit-target text-[12.5px] font-bold text-[var(--app-text)]"
          >
            {t('sectionViewAll')}
          </button>
          <div className="flex items-center gap-1.5">
            {showAudio && (
              <TapSpeakButton
                snippetKey="home-pole-courses"
                text={t('poleCoursesTitle')}
                speakingKey={speakingKey}
                onSpeak={handleSpeak}
              />
            )}
            <h2 className="text-[17px] font-extrabold text-[var(--app-text)]">{t('poleCoursesTitle')} 📚</h2>
          </div>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          variants={homeSubjectGridVariants}
          initial="hidden"
          animate="show"
        >
          {visibleSubjects.map((subject) => (
            <motion.div key={subject.id} variants={homeSubjectItemVariants} className="h-full">
              <SubjectIllustratedCard
                id={subject.id}
                nameAr={subject.nameAr}
                nameFr={subject.nameFr}
                data-subject-card={subject.id}
                onClick={() => openSubject(subject.id)}
                showAudio={showAudio}
                speakingKey={speakingKey}
                onSpeak={handleSpeak}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            data-pole="labs"
            onClick={() => onSelectPole('labs')}
            className="hit-target text-[12.5px] font-bold text-[var(--app-text)]"
          >
            <span data-pole-icon="labs" className="inline-flex align-middle me-1" aria-hidden>
              <LabsPoleIcon className="w-4 h-4" />
            </span>
            {t('sectionViewAll')}
          </button>
          <div className="flex items-center gap-1.5">
            {showAudio && (
              <TapSpeakButton
                snippetKey="home-pole-labs"
                text={t('poleLabsTitle')}
                speakingKey={speakingKey}
                onSpeak={handleSpeak}
              />
            )}
            <h2 className="text-[17px] font-extrabold text-[var(--app-text)]">{t('poleLabsTitle')} 🔬</h2>
          </div>
        </div>
        {onOpenWilayas && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={onOpenWilayas}
            className="kids-pop kids-card-wilayas relative overflow-hidden w-full rounded-[22px] p-4 text-white text-start flex items-center justify-between gap-3 mb-3"
          >
            <CardBlobBackdrop />
            <div className="relative z-10 min-w-0">
              <h3 className="text-[15px] font-extrabold">{t('labWilayasTitle')}</h3>
              {!isYoung && <p className="text-[11.5px] text-white/90 mt-0.5">{t('labWilayasDesc')}</p>}
            </div>
            <span className="relative z-10 w-[46px] h-[46px] rounded-2xl bg-white/25 flex items-center justify-center text-[22px] shrink-0">🇩🇿</span>
          </motion.button>
        )}
        {onOpenMathLab && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={onOpenMathLab}
            className="kids-pop kids-card-maths relative overflow-hidden w-full rounded-[22px] p-4 text-white text-start flex items-center justify-between gap-3 mb-3"
          >
            <CardBlobBackdrop />
            <div className="relative z-10 min-w-0">
              <h3 className="text-[15px] font-extrabold">{t('labMathTitle')}</h3>
              {!isYoung && <p className="text-[11.5px] text-white/90 mt-0.5">{t('labMathDesc')}</p>}
            </div>
            <span className="relative z-10 w-[46px] h-[46px] rounded-2xl bg-white/25 flex items-center justify-center text-[22px] shrink-0">📐</span>
          </motion.button>
        )}
        {onOpenHonorCertificates && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={onOpenHonorCertificates}
            className="kids-pop bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 relative overflow-hidden w-full rounded-[22px] p-4 text-amber-950 text-start flex items-center justify-between gap-3 shadow-md border-2 border-amber-300"
          >
            <CardBlobBackdrop />
            <div className="relative z-10 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[15px] font-black">استوديو لوحات الشرف والشهادات الرسمية 📜</h3>
                <span className="text-[10px] bg-amber-950 text-amber-200 px-2 py-0.5 rounded-full font-black">A4</span>
              </div>
              <p className="text-[11.5px] text-amber-900 font-bold mt-0.5">
                توليد وطباعة شهادات التقدير، الامتياز وفارس الحساب بأسماء تلاميذك
              </p>
            </div>
            <span className="relative z-10 w-[46px] h-[46px] rounded-2xl bg-amber-950/20 flex items-center justify-center text-[24px] shrink-0">
              🏆
            </span>
          </motion.button>
        )}
      </section>

      {!isYoung && preschoolBlock}
    </div>
  );
};

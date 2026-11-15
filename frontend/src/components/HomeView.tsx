import React, { useEffect, useMemo, useState } from 'react';
import { Icon3d } from './art3d/Icon3d';
import { motion, MotionConfig, useReducedMotion } from 'motion/react';
import { AuthUser } from '../types/auth';
import { PrimaryGrade, SubjectId, SubjectInfo } from '../types';
import { DidouAvatarConfig } from '../types/ecosystem';
import { COURSE_SUBJECTS_LIST, isToolAvailableForGrade } from '../data/subjectsData';
import { DIDOU_OUTFITS_LIST } from '../data/outfitsData';
import { useTranslation } from '../hooks/useTranslation';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { useLocaleContext } from '../context/LocaleContext';
import { LabsPoleIcon } from './HomePoleIcons';
import { TapSpeakButton } from './lessonViewer/TapSpeakButton';
import { speakText, stopSpeech, useVoiceAvailable } from '../utils/speech';
import { VoiceUnavailableBanner } from './VoiceUnavailableBanner';
import { DidouVirtualCompanion } from './DidouVirtualCompanion';
import { SubjectIllustratedCard } from './SubjectIllustratedCard';
import { CardBlobBackdrop } from './CardBlobBackdrop';
import { DidouRibbon } from './world/DidouRibbon';
import didouGreeting from '../assets/v2-reused/didou-greet.webp';
import villageLandscape from '../assets/v2-reused/village-landscape.webp';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

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
  isLoadingCourses?: boolean;
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
  isLoadingCourses = false,
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
  const reduceMotion = useReducedMotion();

  const activeSpecies = avatarConfig?.species || 'fennec';
  const activeOutfitId = avatarConfig?.activeOutfit || 'default';
  const activeOutfit = DIDOU_OUTFITS_LIST.find((o) => o.id === activeOutfitId) || DIDOU_OUTFITS_LIST[0];
  const petEmoji = activeSpecies === 'eagle' ? '🦅' : '🦊';

  // 1AP-3AP: same audio guidance level as CourseSelectionView — this is the very first screen a
  // fragile reader lands on, so it needs a listen button at least as much as the screens after it.
  const audioGrade = grade === '1AP' || grade === '2AP' || grade === '3AP';
  const voiceReading = useFeatureFlag('voiceReading');
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const speechLang = locale === 'fr' ? 'fr-FR' : 'ar-SA';
  const voiceAvailable = useVoiceAvailable(speechLang);
  const arabicVoiceAvailable = useVoiceAvailable('ar-SA');
  const showAudio = audioGrade && voiceReading && (grade !== '3AP' || voiceAvailable === true);
  const showSubjectAudio = audioGrade && voiceReading && (grade !== '3AP' || arabicVoiceAvailable === true);
  useEffect(() => stopSpeech, []);
  const handleSpeak = (key: string, text: string) => {
    if (!voiceReading) return;
    if (speakingKey === key) {
      stopSpeech();
      setSpeakingKey(null);
      return;
    }
    setSpeakingKey(key);
    void speakText(text, key.startsWith('subject-') ? 'ar-SA' : speechLang, 0.85).then(() => {
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
      (a, b) => {
        const aIndex = SUBJECT_ORDER.indexOf(a.id);
        const bIndex = SUBJECT_ORDER.indexOf(b.id);
        return (aIndex < 0 ? SUBJECT_ORDER.length : aIndex) - (bIndex < 0 ? SUBJECT_ORDER.length : bIndex);
      },
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
        <span className="icon3d-float relative z-10 w-[64px] h-[64px] shrink-0 grid place-items-center"><Icon3d name="balloons" className="w-[60px] h-[60px] drop-shadow-[0_6px_6px_rgba(8,12,52,0.35)]" /></span>
      </div>
    </motion.button>
  ) : null;

  const openSubject = (subjectId: SubjectId) => {
    if (onSelectSubject) onSelectSubject(subjectId);
    else onSelectPole('courses');
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="home-learning-space space-y-5" dir={direction} data-home-layout="full" data-home-grade={grade} data-home-poles="kids">
      <VoiceUnavailableBanner visible={audioGrade && voiceReading && (voiceAvailable === false || arabicVoiceAvailable === false)} />
      {worldDesign && <DidouRibbon text={t('worldDidouHome')} lang={locale === 'fr' ? 'fr' : 'ar'} listenLabel={t('worldDidouListen')} />}
      <section className="home-welcome home-hero" aria-labelledby="home-welcome-heading">
        <img src={villageLandscape} alt="" width={1500} height={844} fetchPriority="high" decoding="async" className="home-village-scene" />
        <div className="home-hero-shade" aria-hidden="true" />
        <div className="home-hero-badges">
          <span className="home-grade-badge"><BookOpen size={16} aria-hidden="true" />{grade}</span>
          <span className="home-today-label"><Sparkles size={16} aria-hidden="true" />{t('todayTitle')}</span>
          {showAudio && <TapSpeakButton snippetKey="home-welcome" text={isGuest ? t('welcomeGuest') : t('welcomeUser', { name: userName || t('guestFallbackName') })} speakingKey={speakingKey} onSpeak={handleSpeak} />}
        </div>
        <div className="home-hero-body">
          <div className="home-hero-copy">
            <div className="home-welcome-heading-row">
              <h1 id="home-welcome-heading" className="home-welcome-title">{isGuest ? t('welcomeGuest') : t('welcomeUser', { name: userName || t('guestFallbackName') })}</h1>
            </div>
            <p className="home-hero-description">{t('heroGradeLine', { grade: tNav(GRADE_NAV_KEY[grade]) })}</p>
          </div>
          <button type="button" onClick={onOpenDressingRoom} disabled={!onOpenDressingRoom}
            className="home-hero-didou" aria-label={t('dressingRoomLabel')}
            data-didou-greeting={activeSpecies === 'fennec' && activeOutfitId === 'default' ? 'true' : undefined}>
            {activeSpecies === 'fennec' && activeOutfitId === 'default'
              ? <img src={didouGreeting} alt="" width={160} height={192} decoding="async" />
              : <span className="home-hero-custom-pet" aria-hidden="true">{petEmoji}<small>{activeOutfit.icon}</small></span>}
          </button>
          <motion.button type="button" data-pole="courses" data-home-resume={lastActivityTitle && onResumeActivity ? 'true' : undefined}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }} transition={spring}
            onClick={() => { if (lastActivityTitle && onResumeActivity) onResumeActivity(); else openSubject('math'); }}
            className="home-primary-action">
            <span data-pole-icon="courses" hidden />
            <span>{lastActivityTitle && onResumeActivity ? t('heroResumeCta', { title: lastActivityTitle }) : t('heroContinueCta')}</span>
            <ArrowRight className="home-action-arrow" size={22} aria-hidden="true" />
          </motion.button>
        </div>
        <div className="home-hero-footer">
          <div className="home-hero-stats">
            <span className="home-stat">⭐ {t('levelPill', { level: displayLevel })}</span>
            <button type="button" onClick={onOpenDressingRoom} disabled={!onOpenDressingRoom} className="home-stat home-coins">🪙 {goldCoins} {t('coinsLabel')}</button>
          </div>
          <div className="home-level-progress">
            <p>{t('heroProgressLabel', { percent: progressPercent })}</p>
            <div className="home-progress-track" role="progressbar" aria-label={t('heroProgressLabel', { percent: progressPercent })} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}>
              <div className="home-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
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
          <span aria-hidden="true" className="icon3d-float shrink-0 relative grid place-items-center" style={{ width: 72, height: 72 }}>
            <Icon3d name="planet" className="w-[72px] h-[72px] drop-shadow-[0_0_14px_rgba(129,140,248,0.75)]" />
            <span className="absolute -bottom-1 -end-1 grid place-items-center w-7 h-7 rounded-full bg-[#ffd23f] shadow-[0_3px_0_#b77900]"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M7 4.5l13 7.5-13 7.5z" fill="#13206b" /></svg></span>
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-black leading-tight">{t('journeyCardTitle')}</span>
            <span className="block text-[13px] font-bold text-white/85 leading-snug">{t('journeyCardSubtitle')}</span>
          </span>
        </motion.button>
      )}

      <div className="home-content-grid">
      <div className="home-course-column">
      <section className="min-w-0" aria-labelledby="home-subjects-heading">
        <div className="home-section-heading">
          <button
            type="button"
            onClick={() => onSelectPole('courses')}
            className="home-section-link"
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
            <h2 id="home-subjects-heading" className="text-[17px] font-extrabold text-[var(--app-text)]">{t('poleCoursesTitle')} 📚</h2>
          </div>
        </div>
        {isLoadingCourses ? <div className="home-subject-loading" role="status">
          <span className="sr-only">{t('subjectsLoading')}</span>
          {[0, 1, 2, 3].map(index => <div key={index} aria-hidden="true"><span /><span /></div>)}
        </div> : <motion.div
          className="home-subject-grid"
          variants={homeSubjectGridVariants}
          initial={false}
          animate="show"
        >
          {visibleSubjects.map((subject) => (
            <motion.div key={subject.id} variants={homeSubjectItemVariants} className="h-full">
              <SubjectIllustratedCard
                id={subject.id}
                className="home-subject-card"
                nameAr={subject.nameAr}
                nameFr={subject.nameFr}
                data-subject-card={subject.id}
                onClick={() => openSubject(subject.id)}
                showAudio={showSubjectAudio}
                speakingKey={speakingKey}
                onSpeak={handleSpeak}
              />
            </motion.div>
          ))}
        </motion.div>}
        {!isLoadingCourses && visibleSubjects.length === 0 && <p className="text-sm text-[var(--app-text-muted)]">{t('subjectsUnavailable')}</p>}
      </section>

      {isYoung && preschoolBlock}
      </div>
      <aside className="home-companion-column">
      <DidouVirtualCompanion
        avatarConfig={avatarConfig}
        goldCoins={goldCoins}
        xp={xp}
        level={displayLevel}
        userName={userName}
        onOpenDressingRoom={onOpenDressingRoom}
        onFeed={onFeedDidou}
      />

      </aside>
      </div>
      {isGuest && (
        <div className="home-guest-banner">
          <p className="text-xs font-medium text-[var(--app-text-muted)] leading-relaxed">{t('guestBannerSubtitle')}</p>
          {onOpenAuthModal && (
            <motion.button type="button" whileTap={reduceMotion ? undefined : { scale: 0.95 }} transition={spring} onClick={onOpenAuthModal} className="hit-target shrink-0 bg-emerald-700 text-white px-4 rounded-[14px] font-extrabold text-xs sm:text-sm">
              {t('guestSignupCta')}
            </motion.button>
          )}
        </div>
      )}


      <section className="home-labs" aria-labelledby="home-labs-heading">
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
            <h2 id="home-labs-heading" className="text-[17px] font-extrabold text-[var(--app-text)]">{t('poleLabsTitle')} 🔬</h2>
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
            <span className="icon3d-float relative z-10 w-[64px] h-[64px] shrink-0 grid place-items-center"><Icon3d name="algeria" className="w-[60px] h-[60px] drop-shadow-[0_6px_6px_rgba(8,12,52,0.35)]" /></span>
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
            <span className="icon3d-float relative z-10 w-[64px] h-[64px] shrink-0 grid place-items-center"><Icon3d name="geometry" className="w-[60px] h-[60px] drop-shadow-[0_6px_6px_rgba(8,12,52,0.35)]" /></span>
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
            <span className="icon3d-float relative z-10 w-[64px] h-[64px] shrink-0 grid place-items-center"><Icon3d name="trophy" className="w-[60px] h-[60px] drop-shadow-[0_6px_6px_rgba(8,12,52,0.35)]" /></span>
          </motion.button>
        )}
      </section>

      {!isYoung && preschoolBlock}
    </div>
    </MotionConfig>
  );
};

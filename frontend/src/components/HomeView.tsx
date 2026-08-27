import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { AuthUser } from '../types/auth';
import { PrimaryGrade, SubjectId, SubjectInfo } from '../types';
import { COURSE_SUBJECTS_LIST, isToolAvailableForGrade } from '../data/subjectsData';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import {
  ChallengesPoleIcon,
  ExamsPoleIcon,
  LabsPoleIcon,
} from './HomePoleIcons';

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
  onOpenOfflinePacks?: () => void;
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

export const HomeView: React.FC<HomeViewProps> = ({
  grade,
  authUser,
  userName,
  goldCoins = 150,
  xp = 0,
  level,
  courseSubjects,
  onSelectPole,
  onSelectSubject,
  onOpenAuthModal,
  onOpenPreschool,
  onOpenWilayas,
  onOpenMathLab,
  onOpenDressingRoom,
}) => {
  const isGuest = !authUser;
  const isYoung = grade === '1AP' || grade === '2AP';
  const t = useTranslation('home');
  const tNav = useTranslation('navigation');
  const { direction, locale } = useLocaleContext();
  const [showAllSubjects, setShowAllSubjects] = useState(false);

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

  const visibleSubjects = showAllSubjects ? subjects : subjects.slice(0, VISIBLE_SUBJECTS);
  const preschoolBlock = onOpenPreschool ? (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      transition={spring}
      onClick={onOpenPreschool}
      className="kids-pop kids-card-presco w-full relative overflow-hidden rounded-[22px] p-4 text-white cursor-pointer text-start"
    >
      <div className="flex items-center justify-between gap-3">
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
      <section className="kids-hero kids-pop-soft relative overflow-hidden rounded-[30px] p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-bold text-white/90">{t('systemBadge')}</p>
            <h1 className="text-[22px] font-black leading-snug mt-0.5">
              {isGuest ? t('welcomeGuest') : t('welcomeUser', { name: userName || t('guestFallbackName') })}
            </h1>
            <p className="text-[13px] font-medium text-white/90 leading-relaxed mt-1">
              {t('heroGradeLine', { grade: tNav(GRADE_NAV_KEY[grade]) })}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenDressingRoom}
            disabled={!onOpenDressingRoom}
            className="w-16 h-16 rounded-[20px] bg-white/20 flex items-center justify-center text-4xl shrink-0 disabled:cursor-default"
            aria-label={t('dressingRoomLabel')}
          >
            🦊
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
            🦊 {goldCoins} {t('coinsLabel')}
          </button>
        </div>

        <motion.button
          type="button"
          data-pole="courses"
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={() => openSubject('math')}
          className="kids-pop hit-target mt-3.5 w-full rounded-[18px] bg-white text-[var(--kids-grass-2)] font-extrabold text-[14.5px] flex items-center justify-center gap-2"
        >
          <span data-pole-icon="courses" hidden />
          {t('heroContinueCta')}
        </motion.button>

        <div className="mt-3.5 h-2 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-l from-[var(--kids-sun-1)] to-[var(--kids-sun-2)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11.5px] text-white/85 mt-1.5">{t('heroProgressLabel', { percent: progressPercent })}</p>
      </section>

      {isGuest && (
        <div className="rounded-[20px] p-3.5 bg-[var(--app-card-bg)] border-2 border-[var(--app-card-subtle)] kids-pop-soft flex items-center justify-between gap-3">
          <p className="text-xs font-medium text-[var(--kids-muted)] leading-relaxed">
            {t('guestBannerSubtitle')}
          </p>
          {onOpenAuthModal && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              transition={spring}
              onClick={onOpenAuthModal}
              className="hit-target shrink-0 bg-[var(--kids-grass-2)] text-white px-4 rounded-[14px] font-extrabold text-xs sm:text-sm"
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
            className="text-[12.5px] font-bold text-[var(--kids-grass-2)]"
          >
            {t('sectionViewAll')}
          </button>
          <h2 className="text-[17px] font-extrabold text-[var(--kids-ink)]">{t('poleCoursesTitle')} 📚</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {visibleSubjects.map((subject) => (
            <motion.button
              key={subject.id}
              type="button"
              data-subject-card={subject.id}
              whileTap={{ scale: 0.95 }}
              transition={spring}
              onClick={() => openSubject(subject.id)}
              className={`kids-pop relative overflow-hidden rounded-3xl p-4 pt-16 text-white text-start min-h-[136px] flex flex-col justify-end ${SUBJECT_CARD[subject.id] ?? 'kids-card-arabe'}`}
            >
              <span className="absolute top-3.5 end-3.5 w-[42px] h-[42px] rounded-[14px] bg-white/25 flex items-center justify-center text-[22px]">
                {SUBJECT_EMOJI[subject.id] ?? '📘'}
              </span>
              <h3 className="text-[15.5px] font-extrabold leading-snug">
                {locale === 'fr' ? subject.nameFr : subject.nameAr}
              </h3>
              <p className="text-[11.5px] text-white/90 mt-0.5">{t('openSubjectHint')}</p>
            </motion.button>
          ))}
        </div>
        {subjects.length > VISIBLE_SUBJECTS && !showAllSubjects && (
          <div className="text-center mt-2.5">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              transition={spring}
              onClick={() => setShowAllSubjects(true)}
              className="hit-target inline-flex items-center px-4 rounded-2xl text-[13px] font-extrabold text-[var(--kids-grass-2)] bg-white border-2 border-dashed border-[var(--kids-grass-1)]"
            >
              {t('showMoreSubjects')}
            </motion.button>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => onSelectPole('exams')}
            className="text-[12.5px] font-bold text-[var(--kids-grass-2)]"
          >
            {t('sectionViewAll')}
          </button>
          <h2 className="text-[17px] font-extrabold text-[var(--kids-ink)]">{t('poleExamsTitle')} 📝</h2>
        </div>
        <motion.button
          type="button"
          data-pole="exams"
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={() => onSelectPole('exams')}
          className="kids-pop kids-card-examens relative w-full rounded-[22px] p-4 text-white text-start flex items-center justify-between gap-3 mb-3"
        >
          {grade === '5AP' && (
            <span className="absolute -top-2 end-3.5 bg-gradient-to-l from-[var(--kids-sun-1)] to-[var(--kids-sun-2)] text-amber-950 text-[11px] font-extrabold px-3 py-1 rounded-xl shadow-[0_3px_0_rgba(0,0,0,0.12)]">
              {t('examPopularBadge')}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-[15px] font-extrabold">{grade === '5AP' ? t('examBemTitle') : t('examTrimesterTitle')}</h3>
            <p className="text-[11.5px] text-white/90 mt-0.5">{grade === '5AP' ? t('examBemDesc') : t('examTrimesterDesc')}</p>
          </div>
          <span data-pole-icon="exams" className="w-[46px] h-[46px] rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
            <ExamsPoleIcon className="w-8 h-8" />
          </span>
        </motion.button>
        <motion.button
          type="button"
          data-pole="challenges"
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={() => onSelectPole('challenges')}
          className="kids-pop kids-card-defis w-full rounded-[22px] p-4 text-white text-start flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <h3 className="text-[15px] font-extrabold">{t('poleChallengesTitle')}</h3>
            <p className="text-[11.5px] text-white/90 mt-0.5">{t('poleChallengesDesc')}</p>
          </div>
          <span data-pole-icon="challenges" className="w-[46px] h-[46px] rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
            <ChallengesPoleIcon className="w-8 h-8" />
          </span>
        </motion.button>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            data-pole="labs"
            onClick={() => onSelectPole('labs')}
            className="text-[12.5px] font-bold text-[var(--kids-grass-2)]"
          >
            <span data-pole-icon="labs" className="inline-flex align-middle me-1" aria-hidden>
              <LabsPoleIcon className="w-4 h-4" />
            </span>
            {t('sectionViewAll')}
          </button>
          <h2 className="text-[17px] font-extrabold text-[var(--kids-ink)]">{t('poleLabsTitle')} 🔬</h2>
        </div>
        {onOpenWilayas && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={onOpenWilayas}
            className="kids-pop kids-card-wilayas w-full rounded-[22px] p-4 text-white text-start flex items-center justify-between gap-3 mb-3"
          >
            <div className="min-w-0">
              <h3 className="text-[15px] font-extrabold">{t('labWilayasTitle')}</h3>
              <p className="text-[11.5px] text-white/90 mt-0.5">{t('labWilayasDesc')}</p>
            </div>
            <span className="w-[46px] h-[46px] rounded-2xl bg-white/25 flex items-center justify-center text-[22px] shrink-0">🇩🇿</span>
          </motion.button>
        )}
        {onOpenMathLab && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            transition={spring}
            onClick={onOpenMathLab}
            className="kids-pop kids-card-maths w-full rounded-[22px] p-4 text-white text-start flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <h3 className="text-[15px] font-extrabold">{t('labMathTitle')}</h3>
              <p className="text-[11.5px] text-white/90 mt-0.5">{t('labMathDesc')}</p>
            </div>
            <span className="w-[46px] h-[46px] rounded-2xl bg-white/25 flex items-center justify-center text-[22px] shrink-0">📐</span>
          </motion.button>
        )}
      </section>

      {!isYoung && preschoolBlock}
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { AuthUser } from '../types/auth';
import { PrimaryGrade } from '../types';
import { ShieldCheck, UserCircle2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';
import {
  ChallengesPoleIcon,
  CoursesPoleIcon,
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
  onSelectPole: (pole: HomePoleId) => void;
  onOpenAuthModal?: () => void;
  onOpenPreschool?: () => void;
  onOpenMarket?: () => void;
  onOpenWilayas?: () => void;
  onOpenHistoryMuseum?: () => void;
  onOpenScienceLab?: () => void;
  onOpenTamazightLab?: () => void;
  onOpenTamazightCurriculum?: () => void;
  onOpenTouchWriting?: () => void;
  onOpenDressingRoom?: () => void;
  onOpenHomeworkPin?: () => void;
  onOpenPrintables?: () => void;
  onOpenOfflinePacks?: () => void;
}

const POLES: {
  id: HomePoleId;
  icon: React.ReactNode;
  titleKey: 'poleCoursesTitle' | 'poleChallengesTitle' | 'poleExamsTitle' | 'poleLabsTitle';
  descKey: 'poleCoursesDesc' | 'poleChallengesDesc' | 'poleExamsDesc' | 'poleLabsDesc';
  gradient: string;
}[] = [
  {
    id: 'courses',
    icon: <CoursesPoleIcon />,
    titleKey: 'poleCoursesTitle',
    descKey: 'poleCoursesDesc',
    gradient: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'challenges',
    icon: <ChallengesPoleIcon />,
    titleKey: 'poleChallengesTitle',
    descKey: 'poleChallengesDesc',
    gradient: 'from-rose-500 to-amber-600',
  },
  {
    id: 'exams',
    icon: <ExamsPoleIcon />,
    titleKey: 'poleExamsTitle',
    descKey: 'poleExamsDesc',
    gradient: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'labs',
    icon: <LabsPoleIcon />,
    titleKey: 'poleLabsTitle',
    descKey: 'poleLabsDesc',
    gradient: 'from-amber-500 to-emerald-600',
  },
];

const spring = { type: 'spring' as const, stiffness: 400, damping: 22 };

export const HomeView: React.FC<HomeViewProps> = ({
  grade,
  authUser,
  userName,
  goldCoins = 150,
  onSelectPole,
  onOpenAuthModal,
  onOpenPreschool,
  onOpenDressingRoom,
}) => {
  const isGuest = !authUser;
  const t = useTranslation('home');
  const { direction } = useLocaleContext();

  return (
    <div className="space-y-6" dir={direction} data-home-layout="full" data-home-grade={grade} data-home-poles="kids">
      <div className="rounded-3xl p-4 sm:p-8 bg-gradient-to-l from-[var(--brand-emerald)] via-teal-700 to-[var(--brand-blue)] text-white shadow-xl space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold text-white/80">{t('systemBadge')}</p>
            <h1 className="text-xl sm:text-3xl font-black">
              {isGuest ? t('welcomeGuest') : t('welcomeUser', { name: userName || t('guestFallbackName') })}
            </h1>
            <p className="text-sm sm:text-lg font-medium text-white/85">{t('platformTagline')}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenDressingRoom && (
              <button
                onClick={onOpenDressingRoom}
                className="hit-target flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3.5 rounded-2xl text-sm font-extrabold cursor-pointer border border-white/25"
              >
                <span>{t('dressingRoomLabel')}</span>
                <span dir="ltr" className="bg-amber-950/20 px-1.5 py-0.5 rounded-md text-xs font-black">
                  🪙 {goldCoins}
                </span>
              </button>
            )}

            <span
              className={`hit-target flex items-center gap-1.5 px-3.5 rounded-2xl text-sm font-extrabold ${
                isGuest ? 'bg-white/20 text-white border border-white/30' : 'bg-emerald-500/80 text-white'
              }`}
            >
              {isGuest ? <UserCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isGuest ? t('guestModeLabel') : t('connectedLabel')}</span>
            </span>
          </div>
        </div>

        {isGuest && (
          <div className="rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 bg-white/15 border border-white/20">
            <div className="space-y-0.5">
              <p className="font-extrabold text-sm sm:text-lg">{t('guestBannerTitle')}</p>
              <p className="text-xs sm:text-sm font-medium text-white/85">{t('guestBannerSubtitle')}</p>
            </div>
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="hit-target shrink-0 bg-white hover:bg-amber-50 text-emerald-900 px-5 rounded-2xl font-extrabold text-sm sm:text-base cursor-pointer"
              >
                {t('guestSignupCta')}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {POLES.map((pole) => (
          <motion.button
            key={pole.id}
            type="button"
            data-pole={pole.id}
            onClick={() => onSelectPole(pole.id)}
            whileTap={{ scale: 0.95 }}
            transition={spring}
            className={`relative overflow-hidden rounded-3xl p-4 sm:p-6 text-start text-white shadow-md cursor-pointer bg-gradient-to-br ${pole.gradient}`}
          >
            <div
              data-pole-icon={pole.id}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white flex items-center justify-center mb-2 sm:mb-3"
            >
              {pole.icon}
            </div>
            <h3 className="text-sm sm:text-lg font-extrabold">{t(pole.titleKey)}</h3>
            <p className="text-xs sm:text-lg text-white/85 mt-1">{t(pole.descKey)}</p>
          </motion.button>
        ))}
      </div>

      {onOpenPreschool && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          transition={spring}
          onClick={onOpenPreschool}
          className="w-full relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl cursor-pointer text-start border-2 border-amber-300/40"
        >
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-3xl bg-white/20 text-3xl flex items-center justify-center shrink-0 border border-white/30">
                🦊
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-bold bg-white/25 inline-block px-2.5 py-0.5 rounded-full">
                  {t('preschoolFeatureBadge')}
                </p>
                <h2 className="text-lg font-extrabold leading-snug">{t('preschoolFeatureTitle')}</h2>
                <p className="text-sm font-medium text-white/90">{t('preschoolFeatureDesc')}</p>
              </div>
            </div>
            <span className="hit-target w-full inline-flex items-center justify-center bg-white text-orange-950 px-4 rounded-2xl font-extrabold text-sm">
              {t('preschoolFeatureCta')}
            </span>
          </div>
          <div className="absolute -bottom-6 -start-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </motion.button>
      )}
    </div>
  );
};

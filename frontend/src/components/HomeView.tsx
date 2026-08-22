import React from 'react';
import { motion } from 'motion/react';
import { AuthUser } from '../types/auth';
import { PrimaryGrade } from '../types';
import { BookOpen, Trophy, Award, Zap, ShieldCheck, UserCircle2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useLocaleContext } from '../context/LocaleContext';

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

const POLES: { id: HomePoleId; icon: React.ReactNode; titleKey: 'poleCoursesTitle' | 'poleChallengesTitle' | 'poleExamsTitle' | 'poleLabsTitle'; descKey: 'poleCoursesDesc' | 'poleChallengesDesc' | 'poleExamsDesc' | 'poleLabsDesc'; gradient: string }[] = [
  { id: 'courses', icon: <BookOpen className="w-7 h-7" />, titleKey: 'poleCoursesTitle', descKey: 'poleCoursesDesc', gradient: 'from-emerald-600 to-teal-700' },
  { id: 'challenges', icon: <Trophy className="w-7 h-7" />, titleKey: 'poleChallengesTitle', descKey: 'poleChallengesDesc', gradient: 'from-rose-500 to-amber-600' },
  { id: 'exams', icon: <Award className="w-7 h-7" />, titleKey: 'poleExamsTitle', descKey: 'poleExamsDesc', gradient: 'from-blue-600 to-indigo-700' },
  { id: 'labs', icon: <Zap className="w-7 h-7" />, titleKey: 'poleLabsTitle', descKey: 'poleLabsDesc', gradient: 'from-amber-500 to-emerald-600' },
];

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
    <div className="space-y-6" dir={direction} data-home-layout="full" data-home-grade={grade}>
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-l from-[var(--brand-emerald)] via-teal-700 to-[var(--brand-blue)] text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/80 font-black">{t('systemBadge')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {isGuest ? t('welcomeGuest') : t('welcomeUser', { name: userName || t('guestFallbackName') })}
            </h1>
            <p className="text-xs text-white/80 font-medium">{t('platformTagline')}</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenDressingRoom && (
              <button
                onClick={onOpenDressingRoom}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3.5 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer border border-white/25"
              >
                <span>{t('dressingRoomLabel')}</span>
                <span className="bg-amber-950/20 px-1.5 py-0.5 rounded-md text-[11px]">🪙 {goldCoins}</span>
              </button>
            )}

            <span
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black ${
                isGuest ? 'bg-white/20 text-white border border-white/30' : 'bg-emerald-500/80 text-white'
              }`}
            >
              {isGuest ? <UserCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isGuest ? t('guestModeLabel') : t('connectedLabel')}</span>
            </span>
          </div>
        </div>

        {isGuest && (
          <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-400/20 rounded-xl border border-amber-300/30 text-amber-300 shrink-0 text-lg">
                💡
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-white text-xs sm:text-sm">{t('guestBannerTitle')}</p>
                <p className="text-white/85 text-[11px]">{t('guestBannerSubtitle')}</p>
              </div>
            </div>
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="shrink-0 bg-white hover:bg-amber-50 text-emerald-900 px-4 py-2 rounded-xl font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                {t('guestSignupCta')}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {POLES.map((pole) => (
          <motion.button
            key={pole.id}
            onClick={() => onSelectPole(pole.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className={`relative overflow-hidden rounded-3xl p-6 text-start text-white shadow-md cursor-pointer bg-gradient-to-br ${pole.gradient}`}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
              {pole.icon}
            </div>
            <h3 className="text-lg font-black">{t(pole.titleKey)}</h3>
            <p className="text-xs text-white/85 mt-1">{t(pole.descKey)}</p>
          </motion.button>
        ))}
      </div>

      {onOpenPreschool && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          onClick={onOpenPreschool}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl cursor-pointer border-2 border-amber-300/40"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0 border border-white/30">
                🦊
              </div>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/25 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                    {t('preschoolFeatureBadge')}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black">
                  {t('preschoolFeatureTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-white/90 font-bold max-w-xl">
                  {t('preschoolFeatureDesc')}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPreschool();
              }}
              className="shrink-0 bg-white hover:bg-amber-50 text-orange-950 px-6 py-3.5 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer border border-amber-200"
            >
              <span>{t('preschoolFeatureCta')}</span>
            </button>
          </div>

          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute top-0 right-1/3 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        </motion.div>
      )}
    </div>
  );
};

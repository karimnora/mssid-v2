import React from 'react';
import { motion } from 'motion/react';
import { AuthUser } from '../types/auth';
import { PrimaryGrade, HomePoleId } from '../types';
import { ShieldCheck, UserCircle2 } from 'lucide-react';
import { HeaderTheme } from './Navbar';
import { PrimaryDashboard } from './PrimaryDashboard';

export type { HomePoleId };

interface HomeViewProps {
  authUser: AuthUser | null;
  userName: string;
  guestViewedCount?: number;
  guestRemaining?: number;
  maxGuestLessons?: number;
  goldCoins?: number;
  grade?: PrimaryGrade;
  onGradeChange?: (g: PrimaryGrade) => void;
  xp?: number;
  streak?: number;
  badgesUnlocked?: number;
  completedLessonIds?: string[];
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
  theme?: HeaderTheme;
}

export const HomeView: React.FC<HomeViewProps> = ({
  authUser,
  userName,
  goldCoins = 150,
  grade = '5AP',
  onGradeChange,
  xp = 0,
  streak = 0,
  badgesUnlocked = 0,
  completedLessonIds = [],
  onSelectPole,
  onOpenAuthModal,
  onOpenPreschool,
  onOpenDressingRoom,
  theme = 'neutre',
}) => {
  const isGuest = !authUser;
  const isColorful = theme === 'neutre';

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      {/* Welcome Header — colorful emerald / sky banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-l from-emerald-500 via-teal-500 to-sky-500 text-white shadow-lg space-y-4 border-b-4 border-b-emerald-800">
        <div className="pointer-events-none absolute -top-10 -left-8 w-36 h-36 rounded-full bg-yellow-300/30 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-6 w-40 h-40 rounded-full bg-fuchsia-400/25 blur-2xl" />

        <div className="relative flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.15em] text-emerald-50 font-bold">المنظومة التعليمية الجزائرية 🇩🇿</span>
              <span className="bg-white/20 text-white border border-white/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">v2.0 PWA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-sm">
              {isGuest ? 'أهلاً بك أيها البطل في مَسِيد الجزائري 👋' : `أهلاً بك يا ${userName || 'بطل'} في مَسِيد 👋`}
            </h1>
            <p className="text-xs text-emerald-50 font-medium">المنصة الشاملة من التعليم التحضيري (براعم) حتى السنة الخامسة ابتدائي</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenDressingRoom && (
              <button
                onClick={onOpenDressingRoom}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-white/30 min-h-[44px] backdrop-blur-sm"
              >
                <span>🦊 خزانة ديدو</span>
                <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded-md text-[11px] font-extrabold">🪙 {goldCoins}</span>
              </button>
            )}

            <span
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border min-h-[44px] backdrop-blur-sm ${
                isGuest
                  ? 'bg-white/15 text-white border-white/25'
                  : 'bg-lime-300 text-emerald-950 border-lime-200'
              }`}
            >
              {isGuest ? <UserCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isGuest ? 'وضع التصفح الحر (ضيف)' : 'متصل'}</span>
            </span>
          </div>
        </div>

        {isGuest && (
          <div className="relative bg-white/15 backdrop-blur-sm rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border border-white/25">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-400 rounded-xl text-amber-950 shrink-0 text-lg">
                💡
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-white text-xs sm:text-sm">تصفح مجاني وغير محدود لجميع الدروس والمختبرات!</p>
                <p className="text-emerald-50 text-[11px]">سجّل حسابك في أي وقت لحفظ تقدمك، نقاطك (XP) وأوسمتك بأمان عند العودة.</p>
              </div>
            </div>
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="shrink-0 bg-amber-400 hover:bg-amber-300 text-amber-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md border-b-4 border-b-amber-600 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer min-h-[44px]"
              >
                تسجيل الدخول / إنشاء حساب مجاني 🚀
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dedicated Preschool & Toddler Feature Card (Éveil 3-5 ans) */}
      {onOpenPreschool && (
        <motion.div
          whileHover={{ scale: 1.005, y: -2 }}
          whileTap={{ scale: 0.995, y: 2 }}
          onClick={onOpenPreschool}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-l from-amber-400 via-orange-400 to-rose-500 text-white shadow-lg cursor-pointer border-b-4 border-b-orange-700"
        >
          <div className="pointer-events-none absolute -top-8 left-10 w-28 h-28 rounded-full bg-yellow-200/50 blur-xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-4 w-32 h-32 rounded-full bg-pink-300/40 blur-xl" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/25 border border-white/40 flex items-center justify-center text-3xl sm:text-4xl shrink-0 shadow-inner">
                🦊
              </div>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/25 text-white border border-white/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    👶 براعم التحضيري (3 - 5 سنوات)
                  </span>
                  <span className="bg-fuchsia-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ألعاب تفاعلية & أصوات
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-sm">
                  ركن الإيقاظ والتعليم التحضيري 🎈
                </h2>
                <p className="text-xs sm:text-sm text-orange-50 font-medium max-w-xl">
                  سفينة الحروف، قطاف الأرقام، الألوان والفنون، أصدقاء الحيوانات، وألغاز المتاهات الممتعة والمبسطة للطفل!
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPreschool();
              }}
              className="shrink-0 bg-white hover:bg-yellow-100 text-orange-700 px-6 py-3.5 rounded-2xl font-black text-sm shadow-md border-b-4 border-b-orange-200 active:translate-y-0.5 active:border-b-2 transition-all flex items-center gap-2 cursor-pointer min-h-[48px]"
            >
              <span>دخول ركن التحضيري</span>
              <span className="text-lg">🚀</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Primary School Dashboard (1AP–5AP) */}
      <PrimaryDashboard
        grade={grade}
        onGradeChange={onGradeChange ?? (() => {})}
        onSelectPole={onSelectPole}
        xp={xp}
        streak={streak}
        goldCoins={goldCoins}
        badgesUnlocked={badgesUnlocked}
        completedLessonIds={completedLessonIds}
        colorful={isColorful}
      />
    </div>
  );
};

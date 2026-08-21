import React from 'react';
import { motion } from 'framer-motion';
import { AuthUser } from '../types/auth';
import { BookOpen, Trophy, Award, Zap, ShieldCheck, UserCircle2 } from 'lucide-react';

export type HomePoleId = 'courses' | 'labs' | 'exams' | 'challenges';

interface HomeViewProps {
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

const POLES: { id: HomePoleId; icon: React.ReactNode; titleAr: string; descAr: string; gradient: string }[] = [
  { 
    id: 'courses', 
    icon: <BookOpen className="w-7 h-7" />, 
    titleAr: 'مراجعة الدروس', 
    descAr: 'دروس منهجك الدراسي حسب المستوى', 
    gradient: 'from-emerald-900 via-teal-900 to-slate-900' 
  },
  { 
    id: 'challenges', 
    icon: <Trophy className="w-7 h-7" />, 
    titleAr: 'ساحة التحديات', 
    descAr: 'تحديات سريعة واكسب نقاط الخبرة والدنانير', 
    gradient: 'from-amber-900 via-orange-950 to-slate-900' 
  },
  { 
    id: 'exams', 
    icon: <Award className="w-7 h-7" />, 
    titleAr: 'بنك الامتحانات والاختبارات', 
    descAr: 'مواضيع الفصول ونهاية المرحلة مع الحلول النموذجية مجاناً', 
    gradient: 'from-blue-950 via-indigo-950 to-slate-900' 
  },
  { 
    id: 'labs', 
    icon: <Zap className="w-7 h-7" />, 
    titleAr: 'المختبرات والأدوات', 
    descAr: 'سوق الدنانير، الـ 58 ولاية، متحف التاريخ، والتجارب العلمية', 
    gradient: 'from-teal-950 via-slate-900 to-indigo-950' 
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  authUser,
  userName,
  goldCoins = 150,
  onSelectPole,
  onOpenAuthModal,
  onOpenPreschool,
  onOpenDressingRoom,
}) => {
  const isGuest = !authUser;

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      {/* Welcome Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-l from-slate-900 via-emerald-950 to-teal-950 text-slate-100 shadow-lg space-y-4 border border-emerald-900/40">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.15em] text-emerald-300/80 font-bold">المنظومة التعليمية الجزائرية 🇩🇿</span>
              <span className="bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full">v2.0 PWA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isGuest ? 'أهلاً بك أيها البطل في مَسِيد الجزائري 👋' : `أهلاً بك يا ${userName || 'بطل'} في مَسِيد 👋`}
            </h1>
            <p className="text-xs text-slate-300 font-medium">المنصة الشاملة من التعليم التحضيري (براعم) حتى السنة الخامسة ابتدائي</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenDressingRoom && (
              <button
                onClick={onOpenDressingRoom}
                className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-slate-700/60"
              >
                <span>🦊 خزانة ديدو</span>
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md text-[11px] font-extrabold">🪙 {goldCoins}</span>
              </button>
            )}

            <span
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border ${
                isGuest 
                  ? 'bg-slate-800/60 text-slate-300 border-slate-700/50' 
                  : 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50'
              }`}
            >
              {isGuest ? <UserCircle2 className="w-4 h-4 text-slate-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              <span>{isGuest ? 'وضع التصفح الحر (ضيف)' : 'متصل'}</span>
            </span>
          </div>
        </div>

        {isGuest && (
          <div className="bg-slate-900/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400 shrink-0 text-lg">
                💡
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-200 text-xs sm:text-sm">تصفح مجاني وغير محدود لجميع الدروس والمختبرات!</p>
                <p className="text-slate-400 text-[11px]">سجّل حسابك في أي وقت لحفظ تقدمك، نقاطك (XP) وأوسمتك بأمان عند العودة.</p>
              </div>
            </div>
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
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
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          onClick={onOpenPreschool}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 text-slate-100 shadow-md cursor-pointer border border-amber-900/40"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
                🦊
              </div>
              <div className="space-y-1 text-right">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    👶 براعم التحضيري (3 - 5 سنوات)
                  </span>
                  <span className="bg-slate-800 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-700">
                    ألعاب تفاعلية & أصوات
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  ركن الإيقاظ والتعليم التحضيري 🎈
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
                  سفينة الحروف، قطاف الأرقام، الألوان والفنون، أصدقاء الحيوانات، وألغاز المتاهات الممتعة والمبسطة للطفل!
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPreschool();
              }}
              className="shrink-0 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3.5 rounded-2xl font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>دخول ركن التحضيري</span>
              <span className="text-lg">🚀</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* 4 Primary Orientation Poles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {POLES.map((pole) => (
          <motion.button
            key={pole.id}
            onClick={() => onSelectPole(pole.id)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`relative overflow-hidden rounded-3xl p-6 text-right text-slate-100 shadow-md cursor-pointer border border-slate-800 bg-gradient-to-br ${pole.gradient}`}
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-center mb-3">
              {pole.icon}
            </div>
            <h3 className="text-lg font-black text-white">{pole.titleAr}</h3>
            <p className="text-xs text-slate-300 mt-1 font-medium">{pole.descAr}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import { motion } from 'motion/react';
import { AuthUser } from '../types/auth';
import { BookOpen, Trophy, Award, Zap, ShieldCheck, UserCircle2, Store, MapPin, KeyRound, Printer, Download, Sparkles, Shield, FlaskConical } from 'lucide-react';

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
  { id: 'courses', icon: <BookOpen className="w-7 h-7" />, titleAr: 'مراجعة الدروس', descAr: 'دروس منهجك الدراسي حسب المستوى', gradient: 'from-emerald-600 to-teal-700' },
  { id: 'challenges', icon: <Trophy className="w-7 h-7" />, titleAr: 'ساحة التحديات', descAr: 'تحديات سريعة واكسب نقاط الخبرة والدنانير', gradient: 'from-rose-500 to-amber-600' },
  { id: 'exams', icon: <Award className="w-7 h-7" />, titleAr: 'بنك الامتحانات والاختبارات', descAr: 'مواضيع الفصول ونهاية المرحلة مع الحلول النموذجية مجاناً', gradient: 'from-blue-600 to-indigo-700' },
  { id: 'labs', icon: <Zap className="w-7 h-7" />, titleAr: 'المختبرات والأدوات', descAr: 'سوق الدنانير، الـ 58 ولاية، متحف التاريخ، والتجارب العلمية', gradient: 'from-amber-500 to-emerald-600' },
];

export const HomeView: React.FC<HomeViewProps> = ({
  authUser,
  userName,
  goldCoins = 150,
  onSelectPole,
  onOpenAuthModal,
  onOpenPreschool,
  onOpenMarket,
  onOpenWilayas,
  onOpenHistoryMuseum,
  onOpenScienceLab,
  onOpenTamazightLab,
  onOpenTamazightCurriculum,
  onOpenTouchWriting,
  onOpenDressingRoom,
  onOpenHomeworkPin,
  onOpenPrintables,
  onOpenOfflinePacks,
}) => {
  const isGuest = !authUser;

  return (
    <div className="space-y-6 dir-rtl" dir="rtl">
      {/* Welcome Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-l from-[var(--brand-emerald)] via-teal-700 to-[var(--brand-blue)] text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-white/80 font-black">المنظومة التعليمية الجزائرية 🇩🇿</span>
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">v2.0 PWA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {isGuest ? 'أهلاً بك أيها البطل في مَسِيد الجزائري 👋' : `أهلاً بك يا ${userName || 'بطل'} في مَسِيد 👋`}
            </h1>
            <p className="text-xs text-white/80 font-medium">المنصة الشاملة من التعليم التحضيري (براعم) حتى السنة الخامسة ابتدائي</p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDressingRoom && (
              <button
                onClick={onOpenDressingRoom}
                className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3.5 py-2 rounded-2xl text-xs font-black shadow-md hover:bg-amber-300 transition-all cursor-pointer"
              >
                <span>🦊 خزانة ديدو</span>
                <span className="bg-amber-950/20 px-1.5 py-0.5 rounded-md text-[11px]">🪙 {goldCoins}</span>
              </button>
            )}

            <span
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black ${
                isGuest ? 'bg-white/20 text-white border border-white/30' : 'bg-emerald-500/80 text-white'
              }`}
            >
              {isGuest ? <UserCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isGuest ? 'وضع التصفح الحر (ضيف)' : 'متصل'}</span>
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
                <p className="font-bold text-white text-xs sm:text-sm">تصفح مجاني وغير محدود لجميع الدروس والمختبرات!</p>
                <p className="text-white/85 text-[11px]">سجّل حسابك في أي وقت لحفظ تقدمك، نقاطك (XP) وأوسمتك بأمان عند العودة.</p>
              </div>
            </div>
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="shrink-0 bg-white hover:bg-amber-50 text-emerald-900 px-4 py-2 rounded-xl font-black text-xs shadow-md active:scale-95 transition-all cursor-pointer"
              >
                تسجيل الدخول / إنشاء حساب مجاني 🚀
              </button>
            )}
          </div>
        )}
      </div>

      {/* 4 Primary Orientation Poles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {POLES.map((pole) => (
          <motion.button
            key={pole.id}
            onClick={() => onSelectPole(pole.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden rounded-3xl p-6 text-right text-white shadow-md cursor-pointer bg-gradient-to-br ${pole.gradient}`}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
              {pole.icon}
            </div>
            <h3 className="text-lg font-black">{pole.titleAr}</h3>
            <p className="text-xs text-white/85 mt-1">{pole.descAr}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

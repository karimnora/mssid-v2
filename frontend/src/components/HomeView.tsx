import React from 'react';
import { motion } from 'motion/react';
import { AuthUser } from '../types/auth';
import { BookOpen, Trophy, Award, Zap, ShieldCheck, UserCircle2 } from 'lucide-react';

export type HomePoleId = 'courses' | 'labs' | 'exams' | 'challenges';

interface HomeViewProps {
  authUser: AuthUser | null;
  userName: string;
  guestViewedCount: number;
  guestRemaining: number;
  maxGuestLessons: number;
  onSelectPole: (pole: HomePoleId) => void;
}

const POLES: { id: HomePoleId; icon: React.ReactNode; titleAr: string; descAr: string; gradient: string }[] = [
  { id: 'courses', icon: <BookOpen className="w-7 h-7" />, titleAr: 'مراجعة الدروس', descAr: 'دروس منهجك الدراسي حسب المستوى', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'challenges', icon: <Trophy className="w-7 h-7" />, titleAr: 'ساحة التحديات', descAr: 'تحديات سريعة واكسب نقاط الخبرة', gradient: 'from-rose-500 to-orange-500' },
  { id: 'exams', icon: <Award className="w-7 h-7" />, titleAr: 'الامتحانات الرسمية', descAr: 'مواضيع شهادة التعليم الابتدائي', gradient: 'from-blue-500 to-indigo-500' },
  { id: 'labs', icon: <Zap className="w-7 h-7" />, titleAr: 'الأدوات التفاعلية', descAr: 'مختبرات ومحاكيات تعليمية ممتعة', gradient: 'from-amber-500 to-yellow-500' },
];

// Landing dashboard shown before the student picks a pole (replaces the old plain hero-card +
// tab-bar as the very first thing rendered). Purely presentational/orientation — no data fetching
// of its own, everything comes from App.tsx (authUser via AuthContext, guest usage via
// useGuestLimits).
export const HomeView: React.FC<HomeViewProps> = ({
  authUser,
  userName,
  guestViewedCount,
  guestRemaining,
  maxGuestLessons,
  onSelectPole,
}) => {
  const isGuest = !authUser;
  const progressPercent = Math.min(100, (guestViewedCount / maxGuestLessons) * 100);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-l from-[var(--brand-emerald)] to-[var(--brand-blue)] text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">مرحباً بك في منصة مَسِيد</p>
            <h1 className="text-2xl sm:text-3xl font-black">
              {isGuest ? 'أهلاً بك أيها الضيف 👋' : `أهلاً بك ${userName || 'يا بطل'} 👋`}
            </h1>
          </div>
          <span
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black ${
              isGuest ? 'bg-amber-400/90 text-slate-900' : 'bg-white/20 text-white border border-white/30'
            }`}
          >
            {isGuest ? <UserCircle2 className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
            <span>{isGuest ? '🔓 وضع الضيف' : '✅ متصل'}</span>
          </span>
        </div>

        {isGuest && (
          <div className="bg-white/15 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>🎁 تجربتك المجانية: {guestViewedCount} / {maxGuestLessons} دروس مستهلكة</span>
              <span>{guestRemaining} متبقية</span>
            </div>
            <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4 Orientation Poles */}
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

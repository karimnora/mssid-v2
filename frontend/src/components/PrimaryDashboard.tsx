/**
 * PrimaryDashboard.tsx
 * Gamified hub for primary school students (1AP–5AP).
 * Punchy Kahoot / Duolingo colors on theme-aware surfaces.
 */
import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Trophy, Award, FlaskConical, Zap, Flame, Star } from 'lucide-react';
import { PrimaryGrade, HomePoleId } from '../types';
import { XPProgressBar } from './ui/XPProgressBar';

interface PrimaryDashboardProps {
  grade: PrimaryGrade;
  onGradeChange: (g: PrimaryGrade) => void;
  onSelectPole: (pole: HomePoleId) => void;
  xp?: number;
  streak?: number;
  goldCoins?: number;
  badgesUnlocked?: number;
  completedLessonIds?: string[];
  colorful?: boolean;
}

const GRADE_CONFIG: Record<PrimaryGrade, {
  label: string;
  nameAr: string;
  emoji: string;
  activeBg: string;
  ring: string;
  inactiveBg: string;
  inactiveBorder: string;
  inactiveText: string;
}> = {
  '1AP': {
    label: '1AP', nameAr: 'السنة الأولى', emoji: '🌱',
    activeBg: 'bg-amber-500', ring: 'ring-amber-300',
    inactiveBg: 'bg-amber-100', inactiveBorder: 'border-amber-300', inactiveText: 'text-amber-800',
  },
  '2AP': {
    label: '2AP', nameAr: 'السنة الثانية', emoji: '🌿',
    activeBg: 'bg-emerald-500', ring: 'ring-emerald-300',
    inactiveBg: 'bg-emerald-100', inactiveBorder: 'border-emerald-300', inactiveText: 'text-emerald-800',
  },
  '3AP': {
    label: '3AP', nameAr: 'السنة الثالثة', emoji: '🌊',
    activeBg: 'bg-sky-500', ring: 'ring-sky-300',
    inactiveBg: 'bg-sky-100', inactiveBorder: 'border-sky-300', inactiveText: 'text-sky-800',
  },
  '4AP': {
    label: '4AP', nameAr: 'السنة الرابعة', emoji: '⭐',
    activeBg: 'bg-indigo-500', ring: 'ring-indigo-300',
    inactiveBg: 'bg-indigo-100', inactiveBorder: 'border-indigo-300', inactiveText: 'text-indigo-800',
  },
  '5AP': {
    label: '5AP', nameAr: 'السنة الخامسة', emoji: '🏆',
    activeBg: 'bg-rose-500', ring: 'ring-rose-300',
    inactiveBg: 'bg-rose-100', inactiveBorder: 'border-rose-300', inactiveText: 'text-rose-800',
  },
};

const GRADES: PrimaryGrade[] = ['1AP', '2AP', '3AP', '4AP', '5AP'];

interface QuestCard {
  id: HomePoleId;
  icon: React.FC<{ className?: string }>;
  titleAr: string;
  descAr: string;
  cardBg: string;
  accentBorderB: string;
  iconWrap: string;
  badgeLabel: (completedCount: number) => string;
}

const QUESTS: QuestCard[] = [
  {
    id: 'courses',
    icon: BookOpen,
    titleAr: 'مراجعة الدروس',
    descAr: 'دروس منهجك الرسمي بملخصات وتمارين',
    cardBg: 'bg-emerald-50',
    accentBorderB: 'border-b-emerald-500',
    iconWrap: 'bg-emerald-500 text-white',
    badgeLabel: (n) => n > 0 ? `${n} درس ✓` : 'ابدأ التعلم',
  },
  {
    id: 'challenges',
    icon: Trophy,
    titleAr: 'ساحة التحديات',
    descAr: 'تحديات سريعة واكسب نقاط الخبرة والدنانير',
    cardBg: 'bg-amber-50',
    accentBorderB: 'border-b-amber-500',
    iconWrap: 'bg-amber-500 text-white',
    badgeLabel: () => '+ 50 XP',
  },
  {
    id: 'exams',
    icon: Award,
    titleAr: 'بنك الامتحانات',
    descAr: 'مواضيع الفصول ونهاية المرحلة مع الحلول',
    cardBg: 'bg-indigo-50',
    accentBorderB: 'border-b-indigo-500',
    iconWrap: 'bg-indigo-500 text-white',
    badgeLabel: () => 'حلول نموذجية',
  },
  {
    id: 'labs',
    icon: FlaskConical,
    titleAr: 'المختبرات والأدوات',
    descAr: 'تجارب علمية وأدوات تفاعلية ومختبرات ذكية',
    cardBg: 'bg-violet-50',
    accentBorderB: 'border-b-violet-500',
    iconWrap: 'bg-violet-500 text-white',
    badgeLabel: () => '15+ أداة',
  },
];

export const PrimaryDashboard: React.FC<PrimaryDashboardProps> = ({
  grade,
  onGradeChange,
  onSelectPole,
  xp = 0,
  streak = 0,
  goldCoins = 0,
  badgesUnlocked = 0,
  completedLessonIds = [],
  colorful = true,
}) => {
  const xpIntoLevel = xp % 100;
  const level = Math.floor(xp / 100) + 1;

  return (
    <div className="space-y-5" dir="rtl">

      <div className="flex items-center gap-3">
        <div className="h-5 w-1.5 rounded-full bg-gradient-to-b from-emerald-400 to-sky-500" />
        <h2 className="text-base font-black text-[var(--app-text)] tracking-tight">
          المرحلة الابتدائية (1AP – 5AP)
        </h2>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide">
        {GRADES.map((g) => {
          const conf = GRADE_CONFIG[g];
          const isActive = grade === g;
          return (
            <motion.button
              key={g}
              onClick={() => onGradeChange(g)}
              whileTap={{ scale: 0.93 }}
              className={`snap-start shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl
                          font-black text-sm border-2 transition-all cursor-pointer min-h-[44px]
                          ${isActive
                            ? `${conf.activeBg} border-transparent text-white shadow-lg ring-2 ${conf.ring} ring-offset-2 ring-offset-[var(--app-bg)]`
                            : `${conf.inactiveBg} ${conf.inactiveBorder} ${conf.inactiveText}`}`}
            >
              <span className="text-base">{conf.emoji}</span>
              <div className="text-right">
                <div className="leading-none">{conf.label}</div>
                <div className={`text-[10px] font-medium leading-none mt-0.5 ${isActive ? 'text-white/85' : 'opacity-80'}`}>
                  {conf.nameAr}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className={`rounded-2xl p-4 space-y-3 ${
        colorful
          ? 'bg-gradient-to-l from-amber-100 via-orange-50 to-rose-100 border-2 border-amber-200 border-b-4 border-b-amber-400'
          : 'bg-[var(--app-card-bg)] border border-[var(--app-card-border)] border-b-4 border-b-amber-400'
      }`}>
        <XPProgressBar
          currentXp={xpIntoLevel}
          maxXp={100}
          level={level}
          showLabel
        />

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 bg-orange-100 rounded-xl px-2 py-2.5 border-2 border-orange-200">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-base font-black text-orange-600">{streak}</span>
            </div>
            <span className="text-[10px] font-bold text-orange-700/80">يوم متتالي</span>
          </div>

          <div className="flex flex-col items-center gap-1 bg-amber-100 rounded-xl px-2 py-2.5 border-2 border-amber-200">
            <div className="flex items-center gap-1">
              <span className="text-base">🪙</span>
              <span className="text-base font-black text-amber-700">{goldCoins}</span>
            </div>
            <span className="text-[10px] font-bold text-amber-700/80">دينار</span>
          </div>

          <div className="flex flex-col items-center gap-1 bg-violet-100 rounded-xl px-2 py-2.5 border-2 border-violet-200">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-violet-500" />
              <span className="text-base font-black text-violet-600">{badgesUnlocked}</span>
            </div>
            <span className="text-[10px] font-bold text-violet-700/80">وسام</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {QUESTS.map((q, i) => {
          const Icon = q.icon;
          return (
            <motion.button
              key={q.id}
              onClick={() => onSelectPole(q.id)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 24 }}
              whileHover={{ translateY: -3 }}
              whileTap={{ scale: 0.96, translateY: 2 }}
              className={`relative flex flex-col items-start justify-between text-right
                          ${colorful ? q.cardBg : 'bg-[var(--app-card-bg)]'}
                          border-2 border-transparent border-b-4 ${q.accentBorderB}
                          rounded-2xl p-4 min-h-[148px]
                          cursor-pointer shadow-sm hover:shadow-md overflow-hidden`}
            >
              <div className={`w-11 h-11 rounded-xl ${q.iconWrap} flex items-center justify-center mb-3 shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1 w-full">
                <p className={`text-sm font-black leading-tight ${colorful ? 'text-slate-800' : 'text-[var(--app-text)]'}`}>{q.titleAr}</p>
                <p className={`text-[11px] mt-1 leading-snug line-clamp-2 ${colorful ? 'text-slate-600' : 'text-[var(--app-text-muted)]'}`}>{q.descAr}</p>
              </div>

              <div className={`mt-3 self-end inline-flex items-center gap-1 ${q.iconWrap}
                               text-[10px] font-black px-2.5 py-1 rounded-full`}>
                <Zap className="w-3 h-3" />
                <span>{q.badgeLabel(completedLessonIds.length)}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {completedLessonIds.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectPole('courses')}
          className="w-full flex items-center justify-between bg-gradient-to-l from-emerald-400 to-teal-500
                     rounded-2xl px-4 py-3.5 cursor-pointer group min-h-[52px] shadow-md
                     border-b-4 border-b-emerald-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/25 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-white">متابعة التعلم</p>
              <p className="text-[10px] text-emerald-50 font-medium">
                {completedLessonIds.length} درس مكتمل حتى الآن
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-white group-hover:gap-2.5 transition-all">
            <span className="text-xs font-black">استمر</span>
            <span className="text-base">◄</span>
          </div>
        </motion.button>
      )}
    </div>
  );
};

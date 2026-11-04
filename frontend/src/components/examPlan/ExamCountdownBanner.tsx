import React from 'react';
import { motion } from 'motion/react';
import { Icon3d } from '../art3d/Icon3d';
import { inDaysAr, inDaysFr, type ExamCountdown } from '../../utils/examCountdown';

/**
 * J-15 banner (admin flag `examCountdown`): « the compositions start in N days — the 10-day plan is
 * ready ». Opens the parent notebook, where the plan lives (free: 2 days, Premium: the 10). Calm
 * colours, no red: it is a reminder, not an alarm.
 */
export const ExamCountdownBanner: React.FC<{
  countdown: ExamCountdown;
  locale: string;
  onOpenPlan: () => void;
  onDismiss: () => void;
}> = ({ countdown, locale, onOpenPlan, onDismiss }) => {
  const ar = locale === 'ar';
  const when = ar ? inDaysAr(countdown.daysLeft) : inDaysFr(countdown.daysLeft);
  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      dir={ar ? 'rtl' : 'ltr'}
      data-exam-countdown={countdown.daysLeft}
      aria-label={ar ? 'العدّ التنازلي للاختبارات' : 'Compte à rebours des compositions'}
      className="rounded-[22px] p-4 flex flex-col sm:flex-row sm:items-center gap-3 text-white shadow-lg"
      style={{ background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 55%, #a855f7 100%)' }}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="relative shrink-0 w-[64px] h-[64px] grid place-items-center">
          <Icon3d name="clock" className="w-[60px] h-[60px] drop-shadow-[0_6px_6px_rgba(20,8,60,0.4)]" />
          <span className="absolute -bottom-1 -end-1 min-w-[30px] h-[30px] px-1.5 rounded-full bg-[#ffd23f] text-[#3b1d00] text-sm font-black grid place-items-center shadow">
            {countdown.daysLeft}
          </span>
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-extrabold leading-snug">
            {ar ? `اختبارات الفصل ${countdown.trimester} تبدأ ${when}` : `Les compositions du trimestre ${countdown.trimester} commencent ${when}`}
          </p>
          <p className="text-[12.5px] font-bold text-white/90 mt-0.5">
            {ar ? 'خطة مراجعة 10 أيام جاهزة، مبنية على أخطاء طفلك.' : 'Un plan de révision de 10 jours est prêt, construit sur les erreurs de votre enfant.'}
          </p>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onOpenPlan}
          data-exam-countdown-open=""
          className="hit-target flex-1 sm:flex-none px-5 rounded-2xl bg-white text-[#4c1d95] text-sm font-black cursor-pointer shadow"
        >
          {ar ? 'افتح خطة المراجعة' : 'Ouvrir le plan'}
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onDismiss}
          className="hit-target px-4 rounded-2xl bg-white/15 border-2 border-white/30 text-white text-sm font-extrabold cursor-pointer"
        >
          {ar ? 'لاحقاً' : 'Plus tard'}
        </motion.button>
      </div>
    </motion.section>
  );
};

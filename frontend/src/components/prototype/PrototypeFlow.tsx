import React, { useState } from 'react';
import { motion } from 'motion/react';
import { speakArSafe } from '../../utils/immersiveFeedback';
import type { PrimaryGrade, UserProfile } from '../../types';
import { buildParentNotebook, buildWeeklyPlan } from '../../utils/competenceProgress';

type ProtoScreen = 'preschool' | 'primary' | 'exercise' | 'recap' | 'parent';

interface PrototypeFlowProps {
  screen?: string;
  grade: PrimaryGrade;
  userProfile: UserProfile;
  onExit: () => void;
}

const SCREENS: ProtoScreen[] = ['preschool', 'primary', 'exercise', 'recap', 'parent'];

function isScreen(value: string | undefined): value is ProtoScreen {
  return !!value && (SCREENS as string[]).includes(value);
}

export const PrototypeFlow: React.FC<PrototypeFlowProps> = ({ screen, grade, userProfile, onExit }) => {
  const [step, setStep] = useState<ProtoScreen>(isScreen(screen) ? screen : 'preschool');
  const [picked, setPicked] = useState<string | null>(null);
  const notebook = buildParentNotebook(userProfile, grade);
  const plan = buildWeeklyPlan(notebook);
  const ok = picked === '24.95';

  const go = (next: ProtoScreen) => {
    setStep(next);
    window.history.replaceState(null, '', `/prototype/${next}?g=${grade}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0] text-[#0f172a] p-4 sm:p-6" dir="rtl">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-extrabold text-slate-500">نَمُوذَجُ V2 — غَيْرُ ظَاهِرٍ فِي القَائِمَةِ</p>
          <button type="button" onClick={onExit} className="hit-target px-4 rounded-2xl border-2 border-[#E7E2D7] bg-white text-sm font-extrabold cursor-pointer">
            خُرُوج
          </button>
        </div>

        {step === 'preschool' && (
          <section className="space-y-3">
            <h1 className="text-2xl font-black leading-tight">دِيدُو مَعَ الصِّغَارِ</h1>
            <p className="text-sm font-bold text-slate-600">ثَلَاثَةُ اخْتِيَارَاتٍ فَقَطْ. اِضْغَطِ المُكَبِّرَ لِتَسْمَعَ.</p>
            {[
              { id: 'play', label: 'أَلْعَبُ مَعَ دِيدُو', audio: 'هَيَّا نَلْعَبُ مَعَ دِيدُو' },
              { id: 'print', label: 'أَوْرَاقٌ لِلطِّبَاعَةِ', audio: 'أَوْرَاقٌ لِلطِّبَاعَةِ' },
              { id: 'next', label: 'أَذْهَبُ إِلَى الاِبْتِدَائِيِّ', audio: 'نَذْهَبُ إِلَى الاِبْتِدَائِيِّ' },
            ].map((item) => (
              <div key={item.id} className="flex gap-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => speakArSafe(item.audio)}
                  className="h-[72px] w-[72px] rounded-3xl border-2 border-[#E7E2D7] bg-white text-xl font-extrabold cursor-pointer"
                  aria-label="استمع"
                >
                  🔊
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => go(item.id === 'next' ? 'primary' : 'preschool')}
                  className="flex-1 min-h-[72px] rounded-3xl bg-[#008751] text-white text-lg font-extrabold cursor-pointer"
                >
                  {item.label}
                </motion.button>
              </div>
            ))}
          </section>
        )}

        {step === 'primary' && (
          <section className="space-y-3">
            <h1 className="text-2xl font-black leading-tight">مَرْحَباً {userProfile.name}</h1>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => go('exercise')}
              className="w-full min-h-[56px] rounded-3xl bg-[#008751] text-white text-lg font-extrabold cursor-pointer"
            >
              أُوَاصِلُ مَعَ دِيدُو
            </motion.button>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'courses', label: 'المَوَادُّ' },
                { id: 'exams', label: 'الاِمْتِحَانَاتُ' },
                { id: 'labs', label: 'المُخْتَبَرَاتُ' },
                { id: 'challenges', label: 'التَّحَدِّيَاتُ' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go('exercise')}
                  className="min-h-[56px] rounded-3xl border-2 border-[#E7E2D7] bg-white text-sm font-extrabold cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 'exercise' && (
          <section className="space-y-4 rounded-[28px] border-2 border-[#E7E2D7] bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl font-extrabold leading-tight">أَنْجِزْ مَعَ مُحَاذَاةِ الفَاصِلَةِ</h1>
              <button
                type="button"
                onClick={() => speakArSafe('أَنْجِزْ سَبْعَةً وَعِشْرِينَ فَاصِلَة ثَمَانِيَة زَائِد سِتَّة فَاصِلَة خَمْسَة وَأَرْبَعِينَ نَاقِص تِسْعَة فَاصِلَة ثَلَاثَة')}
                className="h-12 w-12 rounded-2xl border-2 border-[#E7E2D7] bg-[#FFF8E7] cursor-pointer"
                aria-label="استمع إلى السؤال"
              >
                🔊
              </button>
            </div>
            <p className="text-lg font-extrabold" dir="ltr">27.8 + 6.45 − 9.3</p>
            <div dir="rtl" className="grid grid-cols-2 gap-2 text-xs font-extrabold">
              <div className="rounded-2xl bg-[#FFF8E7] p-3">الحَلُّ / الأَجْوِبَةُ</div>
              <div className="rounded-2xl bg-white border-2 border-[#E7E2D7] p-3">العَمَلِيَّاتُ</div>
            </div>
            {['24.95', '34.25', '46.95'].map((option) => (
              <motion.button
                key={option}
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={() => setPicked(option)}
                className={`w-full min-h-[48px] rounded-2xl border-2 text-base font-extrabold cursor-pointer ${
                  picked === option ? 'border-[#008751] bg-[#ECFDF5]' : 'border-[#E7E2D7] bg-white'
                }`}
              >
                {option}
              </motion.button>
            ))}
            {picked && (
              <p className="text-sm font-bold leading-relaxed">
                {ok ? 'أَحْسَنْتَ. 27.80 + 6.45 = 34.25 ثُمَّ 34.25 − 9.30 = 24.95.' : 'أَعِدِ الجَمْعَ أَوَّلاً، ثُمَّ اطْرَحْ.'}
              </p>
            )}
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => go('recap')}
              className="w-full min-h-[52px] rounded-3xl bg-[#008751] text-white font-extrabold cursor-pointer"
            >
              أُنْهِي الحِصَّةَ
            </motion.button>
          </section>
        )}

        {step === 'recap' && (
          <section className="space-y-3 rounded-[28px] border-2 border-[#E7E2D7] bg-white p-5">
            <h1 className="text-2xl font-black">أَحْسَنْتَ اليَوْمَ</h1>
            <p className="text-sm font-bold leading-relaxed">دِيدُو فَخُورٌ بِكَ. لَا بَأْسَ إِنْ أَخْطَأْتَ: نُعِيدُ بِهُدُوءٍ.</p>
            <p className="text-sm font-extrabold text-[#008751]">{ok ? 'نَجَاحٌ فِي العَشْرِيَّاتِ.' : 'نُرَاجِعُ الجَمْعَ ثُمَّ الطَّرْحَ.'}</p>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => go('parent')}
              className="w-full min-h-[52px] rounded-3xl bg-[#008751] text-white font-extrabold cursor-pointer"
            >
              دَفْتَرُ الأَبِ وَالأُمِّ
            </motion.button>
          </section>
        )}

        {step === 'parent' && (
          <section className="space-y-3 rounded-[28px] border-2 border-[#E7E2D7] bg-white p-5">
            <h1 className="text-2xl font-black">دَفْتَرُ المُتَابَعَةِ</h1>
            <p className="text-sm font-bold text-slate-600">{notebook.childName} · {grade}</p>
            <p className="text-sm font-extrabold">غَداً ({plan.minutes} د): {plan.next ? plan.next.labelAr : 'لَا حِصَّةَ مُسَجَّلَةً'}</p>
            <p className="text-xs font-bold text-slate-500">لِلمُرَاجَعَةِ: {notebook.review.length} · نَجَاحَاتُ الأُسْبُوعِ: {plan.weekSuccesses}</p>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => go('preschool')}
              className="w-full min-h-[52px] rounded-3xl bg-[#008751] text-white font-extrabold cursor-pointer"
            >
              أُعِيدُ المَسَارَ
            </motion.button>
          </section>
        )}
      </div>
    </div>
  );
};

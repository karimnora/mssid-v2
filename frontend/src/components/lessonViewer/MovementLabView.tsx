import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MovementLabGameplay } from '../../types';

interface MovementLabViewProps {
  gameplay: MovementLabGameplay;
  grade?: string;
}

export const MovementLabView: React.FC<MovementLabViewProps> = ({ gameplay, grade = '1AP' }) => {
  const playful = grade === '1AP';
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = gameplay.actions.find((a) => a.id === activeId);

  return (
    <div
      className={
        playful
          ? 'rounded-3xl border border-emerald-100 bg-emerald-50/80 p-5 space-y-4'
          : 'kids-pole rounded-[28px] p-6 space-y-4'
      }
      dir="rtl"
      data-movement-lab
    >
      <div className="text-center space-y-1">
        <h3 className={`font-black ${playful ? 'text-lg text-slate-900' : 'text-base text-amber-300'}`}>
          {gameplay.titleAr}
        </h3>
        <p className={`text-sm font-bold ${playful ? 'text-slate-600' : 'text-slate-300'}`}>{gameplay.instructionsAr}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {gameplay.actions.map((action) => (
          <motion.button
            key={action.id}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveId(action.id)}
            className={`min-h-[4.5rem] rounded-3xl border-2 flex flex-col items-center justify-center gap-1 px-2 py-3 cursor-pointer transition-colors ${
              activeId === action.id
                ? 'border-emerald-500 bg-white shadow-md'
                : playful
                ? 'border-[#E7E2D7] bg-white hover:bg-emerald-50'
                : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <span className="text-3xl leading-none" aria-hidden="true">
              {action.emoji}
            </span>
            <span className={`text-sm font-black ${playful ? 'text-slate-900' : 'text-emerald-100'}`}>{action.labelAr}</span>
          </motion.button>
        ))}
      </div>

      {active && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl px-4 py-3 text-center text-sm font-bold ${
            playful ? 'bg-amber-50 border border-amber-200 text-amber-950' : 'bg-emerald-950 border border-emerald-800 text-emerald-100'
          }`}
        >
          {active.feedbackAr}
        </motion.div>
      )}
    </div>
  );
};

import React from 'react';
import { MultiplicationVisualDemo } from '../../types';

export function buildRepeatedAdditionSum(groups: number, perGroup: number): string {
  if (groups <= 0 || perGroup <= 0) return '0';
  return Array.from({ length: groups }, () => String(perGroup)).join(' + ');
}

interface MultiplicationGroupsVisualProps extends MultiplicationVisualDemo {
  compact?: boolean;
}

export const MultiplicationGroupsVisual: React.FC<MultiplicationGroupsVisualProps> = ({
  groups,
  perGroup,
  itemEmoji = '⭐',
  captionAr,
  compact = false,
}) => {
  if (groups <= 0 || perGroup <= 0) return null;

  const total = groups * perGroup;
  const sumExpr = buildRepeatedAdditionSum(groups, perGroup);
  const emojiSize = compact ? 'text-xl' : 'text-2xl sm:text-3xl';

  return (
    <div
      className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4 space-y-3"
      dir="rtl"
      data-multiplication-visual
    >
      <div className="space-y-2">
        {Array.from({ length: groups }, (_, row) => (
          <div
            key={row}
            className={`flex flex-wrap gap-1 justify-center items-center bg-white rounded-2xl border border-emerald-100 ${
              compact ? 'px-2 py-1.5 min-h-10' : 'px-3 py-2 min-h-12'
            }`}
          >
            {Array.from({ length: perGroup }, (_, col) => (
              <span key={col} className={emojiSize} aria-hidden="true">
                {itemEmoji}
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="text-center text-sm sm:text-base font-black text-emerald-800" dir="ltr">
        {groups} × {perGroup} = {sumExpr} = {total}
      </p>
      {captionAr ? (
        <p className="text-xs sm:text-sm font-bold text-slate-600 text-center leading-relaxed">{captionAr}</p>
      ) : null}
    </div>
  );
};

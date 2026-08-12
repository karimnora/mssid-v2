import React from 'react';
import { motion } from 'motion/react';

export interface XPProgressBarProps {
  /** XP earned within the current level. */
  currentXp: number;
  /** XP required to complete the current level. Defaults to 100. */
  maxXp?: number;
  level?: number;
  showLabel?: boolean;
  className?: string;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({
  currentXp,
  maxXp = 100,
  level,
  showLabel = true,
  className = '',
}) => {
  const pct = Math.max(0, Math.min(100, (currentXp / maxXp) * 100));

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-bold text-[var(--app-text-muted)]">
          {level !== undefined && (
            <span className="text-[var(--brand-amber-dark)] font-black">المستوى {level}</span>
          )}
          {/* Isolated LTR span: prevents the bidi algorithm from reordering the digits/slash when this renders inside an RTL container. */}
          <span dir="ltr">{currentXp} / {maxXp} XP</span>
        </div>
      )}
      <div className="h-3 rounded-full bg-[var(--app-card-subtle)] overflow-hidden border border-[var(--app-card-border)]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--brand-amber)] to-[var(--brand-amber-dark)]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
};

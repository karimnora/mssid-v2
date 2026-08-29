import React from 'react';
import { motion } from 'motion/react';

export type BadgeVariant = 'xp' | 'success' | 'info' | 'danger' | 'neutral';

export interface BadgeProps {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  /** Mixing digits with a Latin abbreviation (e.g. "+50 XP")? Wrap it in `<span dir="ltr">` to keep reading order stable inside RTL pages. */
  children: React.ReactNode;
  /** Play a spring pop-in — use for a badge that just got unlocked, not for static labels. */
  pop?: boolean;
  className?: string;
  /** Native tooltip — use when `children` can be truncated (e.g. paired with a `truncate` className) so the full text stays reachable on hover. */
  title?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  xp: 'bg-[var(--brand-amber)]/15 text-[var(--brand-amber-dark)] border-[var(--brand-amber)]/40',
  success: 'bg-[var(--brand-emerald)]/15 text-[var(--brand-emerald-dark)] border-[var(--brand-emerald)]/40',
  info: 'bg-[var(--brand-blue)]/15 text-[var(--brand-blue-dark)] border-[var(--brand-blue)]/40',
  danger: 'bg-[var(--brand-coral)]/15 text-[var(--brand-coral-dark)] border-[var(--brand-coral)]/40',
  neutral: 'bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border-[var(--app-card-border)]',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', icon, children, pop = false, className = '', title }) => {
  const pill = (
    <span
      title={title}
      className={[
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-extrabold whitespace-nowrap',
        VARIANT_STYLES[variant],
        className,
      ].join(' ')}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      {children}
    </span>
  );

  if (!pop) return pill;

  return (
    <motion.span
      initial={{ scale: 0, rotate: -8, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      className="inline-block"
    >
      {pill}
    </motion.span>
  );
};

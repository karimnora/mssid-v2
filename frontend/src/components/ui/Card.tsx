import React from 'react';
import { motion } from 'motion/react';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

// Same framer-motion event-handler conflict as ButtonProps (see Button.tsx) — motion.div below
// redefines onAnimationStart/onDrag* with its own signatures.
export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  /** Adds hover-lift + tap-press feedback — use when the whole card is a click target. */
  interactive?: boolean;
  padding?: CardPadding;
  children: React.ReactNode;
}

const PADDING_STYLES: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

/**
 * Theme-aware surface. Reads its colors from the `--app-card-*` CSS custom
 * properties set per `.theme-neutre` / `.theme-light` / `.theme-dark` class on
 * the document root, so it repaints automatically on theme change with no
 * `theme` prop to thread through — unlike the app's older components.
 */
export const Card: React.FC<CardProps> = ({
  interactive = false,
  padding = 'md',
  className = '',
  children,
  ...divProps
}) => (
  <motion.div
    whileHover={interactive ? { y: -4, boxShadow: '0 16px 28px -12px rgba(0,0,0,0.22)' } : undefined}
    whileTap={interactive ? { y: -1, scale: 0.99 } : undefined}
    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    className={[
      'rounded-3xl border shadow-md bg-[var(--app-card-bg)] border-[var(--app-card-border)] text-[var(--app-text)]',
      interactive ? 'cursor-pointer' : '',
      PADDING_STYLES[padding],
      className,
    ].join(' ')}
    {...divProps}
  >
    {children}
  </motion.div>
);

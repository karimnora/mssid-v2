import React from 'react';
import { motion } from 'motion/react';
import { useLocaleContext } from '../../context/LocaleContext';

export type ButtonVariant = 'primary' | 'accent' | 'info' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

// framer-motion's <motion.button> redefines onAnimationStart/onDrag* with its own animation-related
// signatures, which conflict with the plain DOM event handler types on ButtonHTMLAttributes — omit
// them here so spreading ...buttonProps onto motion.button below doesn't collide with motion's props.
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  /** Visual style. 'primary' = emerald (main CTA), 'accent' = amber (XP/rewards), 'info' = blue, 'danger' = coral. */
  variant?: ButtonVariant;
  /** Controls height (min 40/48/56px — 'md' and 'lg' meet the 48px touch-target minimum). */
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
  loading?: boolean;
  /**
   * If the label mixes digits with a Latin abbreviation (e.g. "+15 XP") and
   * renders inside an RTL page, wrap that fragment in `<span dir="ltr">` —
   * otherwise the Unicode bidi algorithm can reorder the digits/letters.
   */
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--brand-emerald)] hover:bg-[var(--brand-emerald-dark)] text-white border-[var(--brand-emerald-dark)]',
  accent: 'bg-[var(--brand-amber)] hover:bg-amber-400 text-amber-950 border-[var(--brand-amber-dark)]',
  info: 'bg-[var(--brand-blue)] hover:bg-[var(--brand-blue-dark)] text-white border-[var(--brand-blue-dark)]',
  danger: 'bg-[var(--brand-coral)] hover:bg-[var(--brand-coral-dark)] text-white border-[var(--brand-coral-dark)]',
  ghost: 'bg-transparent hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border-transparent',
  outline: 'bg-transparent hover:bg-[var(--app-card-subtle)] text-[var(--app-text)] border-[var(--app-card-border)]',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-4 text-sm rounded-xl gap-1.5',
  md: 'min-h-[48px] px-5 text-base rounded-2xl gap-2',
  lg: 'min-h-[56px] px-7 text-lg rounded-3xl gap-2.5',
};

/**
 * Duolingo-style "physical" button: flat top face + solid bottom border that
 * reads as depth. Pressing it drives the face down toward the border via
 * spring physics instead of a CSS :active rule, so it feels alive on touch.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  children,
  ...buttonProps
}) => {
  const { direction } = useLocaleContext();
  const isDisabled = disabled || loading;

  return (
    <motion.button
      dir={direction}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { y: -1 }}
      whileTap={isDisabled ? undefined : { y: 3 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={[
        'inline-flex items-center justify-center border-b-4 font-extrabold cursor-pointer select-none',
        'transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...buttonProps}
    >
      {loading ? (
        <motion.span
          aria-hidden="true"
          className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
        />
      ) : (
        <>
          {icon && iconPosition === 'start' && <span className="shrink-0 flex items-center">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'end' && <span className="shrink-0 flex items-center">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};

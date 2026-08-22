import React from 'react';

interface PoleIconProps {
  className?: string;
}

/** Livre ouvert — révision des cours. */
export const CoursesPoleIcon: React.FC<PoleIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
    <path d="M8 16c10 0 18 4 24 8v30c-6-4-14-8-24-8V16Z" fill="#006b40" />
    <path d="M56 16c-10 0-18 4-24 8v30c6-4 14-8 24-8V16Z" fill="#008751" />
    <path d="M32 24v30" stroke="#FFF8E7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 26c6 1 12 4 16 6M14 34c6 1 12 4 16 6M14 42c5 1 10 3 14 5" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 26c-6 1-12 4-16 6M50 34c-6 1-12 4-16 6M50 42c-5 1-10 3-14 5" stroke="#D1FAE5" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 16c10 0 18 4 24 8C38 20 46 16 56 16" stroke="#065F46" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

/** Coupe — arène des défis. */
export const ChallengesPoleIcon: React.FC<PoleIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
    <path d="M18 12h28v10c0 10-6 16-14 16s-14-6-14-16V12Z" fill="#F59E0B" />
    <path d="M22 16h20v6c0 7-4 11-10 11s-10-4-10-11v-6Z" fill="#FDE68A" />
    <path d="M46 16h8c0 8-4 12-8 14" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
    <path d="M18 16h-8c0 8 4 12 8 14" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
    <rect x="28" y="38" width="8" height="8" rx="1" fill="#D97706" />
    <path d="M20 54h24l-3-8H23z" fill="#F59E0B" />
    <path d="M32 8 34.2 12.8 39.5 13.4 35.5 16.8 36.6 22 32 19.2 27.4 22 28.5 16.8 24.5 13.4 29.8 12.8Z" fill="#FBBF24" />
  </svg>
);

/** Copie + crayon — banque d'examens. */
export const ExamsPoleIcon: React.FC<PoleIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
    <rect x="14" y="10" width="28" height="38" rx="5" fill="#FFFFFF" stroke="#1D4ED8" strokeWidth="2.5" />
    <rect x="20" y="8" width="16" height="7" rx="3" fill="#2563EB" />
    <path d="M20 24h16M20 30h14M20 36h12" stroke="#93C5FD" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M20 44 24 48l10-12" stroke="#008751" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M42 34 54 22l4 4-12 12-5 1z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M52 24 56 28" stroke="#FFF8E7" strokeWidth="1.4" />
  </svg>
);

/** Fiole — labs et expériences. */
export const LabsPoleIcon: React.FC<PoleIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
    <path d="M26 8h12v10l10 22a12 12 0 1 1-32 0L26 18V8Z" fill="#14B8A6" />
    <path d="M20 40a12 12 0 0 0 24 4c-6 2-14-2-20-8-2 1-3.5 2.5-4 4Z" fill="#0F766E" />
    <rect x="24" y="6" width="16" height="6" rx="3" fill="#0F766E" />
    <circle cx="28" cy="38" r="2.4" fill="#99F6E4" />
    <circle cx="36" cy="33" r="1.8" fill="#CCFBF1" />
    <circle cx="44" cy="16" r="3" fill="#FDE68A" />
    <circle cx="50" cy="22" r="2" fill="#FDE68A" />
  </svg>
);

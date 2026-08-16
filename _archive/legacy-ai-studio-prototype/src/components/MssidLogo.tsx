import React from 'react';

interface MssidLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const MssidLogo: React.FC<MssidLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const dimensions = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-0.5 shadow-md shadow-emerald-950/20 ring-1 ring-emerald-400/30 ${dimensions} ${className}`}
    >
      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
        {/* Background Subtle Geometric Pattern Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-15 text-emerald-400"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <polygon points="50,5 95,50 50,95 5,50" />
          <polygon points="50,20 80,50 50,80 20,50" />
          <circle cx="50" cy="50" r="40" strokeDasharray="2 2" />
        </svg>

        {/* Main Clean Vector SVG Symbol */}
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4/5 h-4/5 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        >
          <defs>
            <linearGradient id="bookCoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="whitePageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>
          </defs>

          {/* Open Book Wings (Left & Right Pages) */}
          <path
            d="M 8,42 Q 20,38 32,44 Q 44,38 56,42 L 56,22 Q 44,18 32,24 Q 20,18 8,22 Z"
            fill="url(#bookCoverGrad)"
            stroke="#34d399"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          <path
            d="M 11,39.5 Q 21.5,36 31,41.5 L 31,23.5 Q 21.5,18 11,21.5 Z"
            fill="url(#whitePageGrad)"
          />

          <path
            d="M 53,39.5 Q 42.5,36 33,41.5 L 33,23.5 Q 42.5,18 53,21.5 Z"
            fill="url(#whitePageGrad)"
          />

          {/* Book Spine Center Line */}
          <line x1="32" y1="23" x2="32" y2="44" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />

          {/* Calligraphic Arabic Letter 'م' (Meem) in Gold on the Spine */}
          <path
            d="M 32 18 C 29 18 28 20 29.5 21.5 C 31 23 33 22 32 20.5 C 31.5 19.8 30.5 19.5 32 19.5 C 34 19.5 34.5 22 34.5 25 L 34.5 28"
            stroke="url(#goldGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sparkle 1 (AI Sparkle top right) */}
          <path
            d="M 46 8 L 47.5 12 L 51.5 13.5 L 47.5 15 L 46 19 L 44.5 15 L 40.5 13.5 L 44.5 12 Z"
            fill="url(#goldGrad)"
          />

          {/* Sparkle 2 (Small Sparkle top left) */}
          <path
            d="M 18 10 L 19 12.5 L 21.5 13.5 L 19 14.5 L 18 17 L 17 14.5 L 14.5 13.5 L 17 12.5 Z"
            fill="#34d399"
          />

          {/* Rays of Light beneath the book */}
          <path d="M 22 48 L 18 53" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 32 49 L 32 55" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 42 48 L 46 53" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

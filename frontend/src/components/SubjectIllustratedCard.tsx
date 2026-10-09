import React from 'react';
import { motion } from 'motion/react';
import { SubjectId, PrimaryGrade } from '../types';
import { useLocaleContext } from '../context/LocaleContext';
import { CheckCircle2, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { TapSpeakButton } from './lessonViewer/TapSpeakButton';
import { isFrenchFreeGrade } from './lessonViewer/youngLessonLayout';

export interface SubjectIllustratedCardProps {
  id: SubjectId;
  nameAr: string;
  nameFr: string;
  grade?: PrimaryGrade;
  totalLessons?: number;
  completedLessons?: number;
  isLocked?: boolean;
  onClick: () => void;
  showAudio?: boolean;
  speakingKey?: string | null;
  onSpeak?: (key: string, text: string) => void;
  className?: string;
  'data-subject-card'?: string;
}

// Visual theme configurations per subject inspired by the Schoolmouv illustrated banner design
interface SubjectVisualTheme {
  primaryGradient: string;
  blobColor: string;
  accentBg: string;
  badgeBg: string;
  badgeText: string;
  textColor: string;
  hoverBorder: string;
}

const SUBJECT_THEMES: Record<string, SubjectVisualTheme> = {
  french: {
    primaryGradient: 'from-fuchsia-500 to-purple-600',
    blobColor: '#A855F7',
    accentBg: 'bg-purple-50 dark:bg-purple-950/40',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/60',
    badgeText: 'text-purple-800 dark:text-purple-200',
    textColor: 'text-purple-900 dark:text-purple-100',
    hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-600',
  },
  history_geo: {
    primaryGradient: 'from-amber-400 to-orange-600',
    blobColor: '#F59E0B',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-200',
    textColor: 'text-amber-900 dark:text-amber-100',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-600',
  },
  math: {
    primaryGradient: 'from-sky-400 to-blue-600',
    blobColor: '#0284C7',
    accentBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/60',
    badgeText: 'text-sky-800 dark:text-sky-200',
    textColor: 'text-sky-900 dark:text-sky-100',
    hoverBorder: 'hover:border-sky-300 dark:hover:border-sky-600',
  },
  science: {
    primaryGradient: 'from-emerald-400 to-teal-600',
    blobColor: '#10B981',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    textColor: 'text-emerald-900 dark:text-emerald-100',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-600',
  },
  civics: {
    primaryGradient: 'from-orange-400 to-amber-600',
    blobColor: '#F97316',
    accentBg: 'bg-orange-50 dark:bg-orange-950/40',
    badgeBg: 'bg-orange-100 dark:bg-orange-900/60',
    badgeText: 'text-orange-800 dark:text-orange-200',
    textColor: 'text-orange-900 dark:text-orange-100',
    hoverBorder: 'hover:border-orange-300 dark:hover:border-orange-600',
  },
  english: {
    primaryGradient: 'from-violet-500 to-indigo-600',
    blobColor: '#8B5CF6',
    accentBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60',
    badgeText: 'text-indigo-800 dark:text-indigo-200',
    textColor: 'text-indigo-900 dark:text-indigo-100',
    hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-600',
  },
  arabic: {
    primaryGradient: 'from-emerald-500 to-green-700',
    blobColor: '#059669',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    textColor: 'text-emerald-900 dark:text-emerald-100',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-600',
  },
  islamic: {
    primaryGradient: 'from-emerald-600 to-amber-600',
    blobColor: '#047857',
    accentBg: 'bg-green-50 dark:bg-green-950/40',
    badgeBg: 'bg-green-100 dark:bg-green-900/60',
    badgeText: 'text-green-800 dark:text-green-200',
    textColor: 'text-green-900 dark:text-green-100',
    hoverBorder: 'hover:border-green-300 dark:hover:border-green-600',
  },
  tamazight: {
    primaryGradient: 'from-teal-500 to-amber-600',
    blobColor: '#0D9488',
    accentBg: 'bg-teal-50 dark:bg-teal-950/40',
    badgeBg: 'bg-teal-100 dark:bg-teal-900/60',
    badgeText: 'text-teal-800 dark:text-teal-200',
    textColor: 'text-teal-900 dark:text-teal-100',
    hoverBorder: 'hover:border-teal-300 dark:hover:border-teal-600',
  },
  art: {
    primaryGradient: 'from-rose-400 to-amber-500',
    blobColor: '#FB7185',
    accentBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/60',
    badgeText: 'text-rose-800 dark:text-rose-200',
    textColor: 'text-rose-900 dark:text-rose-100',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-600',
  },
  // Fallback for tools / secondary items
  algerian_market: {
    primaryGradient: 'from-amber-500 to-yellow-600',
    blobColor: '#D97706',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-200',
    textColor: 'text-amber-900 dark:text-amber-100',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-600',
  },
  wilayas_map: {
    primaryGradient: 'from-emerald-500 to-teal-700',
    blobColor: '#059669',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    textColor: 'text-emerald-900 dark:text-emerald-100',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-600',
  },
  soroban: {
    primaryGradient: 'from-amber-400 to-red-500',
    blobColor: '#F59E0B',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-200',
    textColor: 'text-amber-900 dark:text-amber-100',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-600',
  },
  exam_5ap: {
    primaryGradient: 'from-purple-500 to-indigo-700',
    blobColor: '#7C3AED',
    accentBg: 'bg-purple-50 dark:bg-purple-950/40',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/60',
    badgeText: 'text-purple-800 dark:text-purple-200',
    textColor: 'text-purple-900 dark:text-purple-100',
    hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-600',
  },
  devoir_1ap: {
    primaryGradient: 'from-sky-400 to-emerald-500',
    blobColor: '#0EA5E9',
    accentBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/60',
    badgeText: 'text-sky-800 dark:text-sky-200',
    textColor: 'text-sky-900 dark:text-sky-100',
    hoverBorder: 'hover:border-sky-300 dark:hover:border-sky-600',
  },
  devoir_2ap: {
    primaryGradient: 'from-emerald-400 to-cyan-600',
    blobColor: '#10B981',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    textColor: 'text-emerald-900 dark:text-emerald-100',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-600',
  },
  devoir_3ap: {
    primaryGradient: 'from-amber-400 to-orange-600',
    blobColor: '#F59E0B',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-200',
    textColor: 'text-amber-900 dark:text-amber-100',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-600',
  },
  devoir_4ap: {
    primaryGradient: 'from-indigo-400 to-purple-600',
    blobColor: '#6366F1',
    accentBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60',
    badgeText: 'text-indigo-800 dark:text-indigo-200',
    textColor: 'text-indigo-900 dark:text-indigo-100',
    hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-600',
  },
  devoir_5ap: {
    primaryGradient: 'from-rose-400 to-purple-600',
    blobColor: '#F43F5E',
    accentBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/60',
    badgeText: 'text-rose-800 dark:text-rose-200',
    textColor: 'text-rose-900 dark:text-rose-100',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-600',
  },
  algerian_museum: {
    primaryGradient: 'from-amber-500 to-stone-700',
    blobColor: '#B45309',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-200',
    textColor: 'text-amber-900 dark:text-amber-100',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-600',
  },
  electricity_lab: {
    primaryGradient: 'from-yellow-400 to-amber-600',
    blobColor: '#EAB308',
    accentBg: 'bg-yellow-50 dark:bg-yellow-950/40',
    badgeBg: 'bg-yellow-100 dark:bg-yellow-900/60',
    badgeText: 'text-yellow-800 dark:text-yellow-200',
    textColor: 'text-yellow-900 dark:text-yellow-100',
    hoverBorder: 'hover:border-yellow-300 dark:hover:border-yellow-600',
  },
  unit_converter: {
    primaryGradient: 'from-cyan-400 to-blue-600',
    blobColor: '#06B6D4',
    accentBg: 'bg-cyan-50 dark:bg-cyan-950/40',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-900/60',
    badgeText: 'text-cyan-800 dark:text-cyan-200',
    textColor: 'text-cyan-900 dark:text-cyan-100',
    hoverBorder: 'hover:border-cyan-300 dark:hover:border-cyan-600',
  },
  geometry_lab: {
    primaryGradient: 'from-blue-400 to-indigo-600',
    blobColor: '#3B82F6',
    accentBg: 'bg-blue-50 dark:bg-blue-950/40',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/60',
    badgeText: 'text-blue-800 dark:text-blue-200',
    textColor: 'text-blue-900 dark:text-blue-100',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-600',
  },
  arabic_conjugator: {
    primaryGradient: 'from-emerald-400 to-teal-600',
    blobColor: '#10B981',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    textColor: 'text-emerald-900 dark:text-emerald-100',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-600',
  },
  french_lab: {
    primaryGradient: 'from-purple-400 to-fuchsia-600',
    blobColor: '#C084FC',
    accentBg: 'bg-purple-50 dark:bg-purple-950/40',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/60',
    badgeText: 'text-purple-800 dark:text-purple-200',
    textColor: 'text-purple-900 dark:text-purple-100',
    hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-600',
  },
  english_lab: {
    primaryGradient: 'from-indigo-400 to-blue-600',
    blobColor: '#6366F1',
    accentBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60',
    badgeText: 'text-indigo-800 dark:text-indigo-200',
    textColor: 'text-indigo-900 dark:text-indigo-100',
    hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-600',
  },
  multiplication_lab: {
    primaryGradient: 'from-amber-400 to-orange-500',
    blobColor: '#F59E0B',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-200',
    textColor: 'text-amber-900 dark:text-amber-100',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-600',
  },
  arabic_canvas: {
    primaryGradient: 'from-teal-400 to-emerald-600',
    blobColor: '#14B8A6',
    accentBg: 'bg-teal-50 dark:bg-teal-950/40',
    badgeBg: 'bg-teal-100 dark:bg-teal-900/60',
    badgeText: 'text-teal-800 dark:text-teal-200',
    textColor: 'text-teal-900 dark:text-teal-100',
    hoverBorder: 'hover:border-teal-300 dark:hover:border-teal-600',
  },
  science_reactor: {
    primaryGradient: 'from-cyan-400 to-emerald-600',
    blobColor: '#06B6D4',
    accentBg: 'bg-cyan-50 dark:bg-cyan-950/40',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-900/60',
    badgeText: 'text-cyan-800 dark:text-cyan-200',
    textColor: 'text-cyan-900 dark:text-cyan-100',
    hoverBorder: 'hover:border-cyan-300 dark:hover:border-cyan-600',
  },
  topography_map: {
    primaryGradient: 'from-amber-500 to-emerald-700',
    blobColor: '#D97706',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-200',
    textColor: 'text-amber-900 dark:text-amber-100',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-600',
  },
  tamazight_lab: {
    primaryGradient: 'from-emerald-400 to-teal-600',
    blobColor: '#10B981',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    textColor: 'text-emerald-900 dark:text-emerald-100',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-600',
  },
  clock_trainer: {
    primaryGradient: 'from-sky-400 to-indigo-600',
    blobColor: '#0EA5E9',
    accentBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/60',
    badgeText: 'text-sky-800 dark:text-sky-200',
    textColor: 'text-sky-900 dark:text-sky-100',
    hoverBorder: 'hover:border-sky-300 dark:hover:border-sky-600',
  },
  fractions_decimals: {
    primaryGradient: 'from-amber-400 to-blue-500',
    blobColor: '#F59E0B',
    accentBg: 'bg-amber-50 dark:bg-amber-950/40',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
    badgeText: 'text-amber-800 dark:text-amber-200',
    textColor: 'text-amber-900 dark:text-amber-100',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-600',
  },
  area_perimeter: {
    primaryGradient: 'from-blue-400 to-cyan-500',
    blobColor: '#3B82F6',
    accentBg: 'bg-blue-50 dark:bg-blue-950/40',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/60',
    badgeText: 'text-blue-800 dark:text-blue-200',
    textColor: 'text-blue-900 dark:text-blue-100',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-600',
  },
  human_anatomy: {
    primaryGradient: 'from-rose-400 to-red-600',
    blobColor: '#F43F5E',
    accentBg: 'bg-rose-50 dark:bg-rose-950/40',
    badgeBg: 'bg-rose-100 dark:bg-rose-900/60',
    badgeText: 'text-rose-800 dark:text-rose-200',
    textColor: 'text-rose-900 dark:text-rose-100',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-600',
  },
  earth_cycles: {
    primaryGradient: 'from-teal-400 to-blue-600',
    blobColor: '#14B8A6',
    accentBg: 'bg-teal-50 dark:bg-teal-950/40',
    badgeBg: 'bg-teal-100 dark:bg-teal-900/60',
    badgeText: 'text-teal-800 dark:text-teal-200',
    textColor: 'text-teal-900 dark:text-teal-100',
    hoverBorder: 'hover:border-teal-300 dark:hover:border-teal-600',
  },
  circuit_builder: {
    primaryGradient: 'from-yellow-400 to-amber-600',
    blobColor: '#EAB308',
    accentBg: 'bg-yellow-50 dark:bg-yellow-950/40',
    badgeBg: 'bg-yellow-100 dark:bg-yellow-900/60',
    badgeText: 'text-yellow-800 dark:text-yellow-200',
    textColor: 'text-yellow-900 dark:text-yellow-100',
    hoverBorder: 'hover:border-yellow-300 dark:hover:border-yellow-600',
  },
  speed_velocity: {
    primaryGradient: 'from-orange-400 to-red-600',
    blobColor: '#FB923C',
    accentBg: 'bg-orange-50 dark:bg-orange-950/40',
    badgeBg: 'bg-orange-100 dark:bg-orange-900/60',
    badgeText: 'text-orange-800 dark:text-orange-200',
    textColor: 'text-orange-900 dark:text-orange-100',
    hoverBorder: 'hover:border-orange-300 dark:hover:border-orange-600',
  },
  primary_math_lab: {
    primaryGradient: 'from-sky-400 to-blue-600',
    blobColor: '#38BDF8',
    accentBg: 'bg-sky-50 dark:bg-sky-950/40',
    badgeBg: 'bg-sky-100 dark:bg-sky-900/60',
    badgeText: 'text-sky-800 dark:text-sky-200',
    textColor: 'text-sky-900 dark:text-sky-100',
    hoverBorder: 'hover:border-sky-300 dark:hover:border-sky-600',
  },
  primary_discovery_lab: {
    primaryGradient: 'from-emerald-400 to-teal-600',
    blobColor: '#34D399',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
    badgeText: 'text-emerald-800 dark:text-emerald-200',
    textColor: 'text-emerald-900 dark:text-emerald-100',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-600',
  },
  arcade_games: {
    primaryGradient: 'from-purple-500 to-pink-500',
    blobColor: '#A855F7',
    accentBg: 'bg-purple-50 dark:bg-purple-950/40',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/60',
    badgeText: 'text-purple-800 dark:text-purple-200',
    textColor: 'text-purple-900 dark:text-purple-100',
    hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-600',
  },
};

/**
 * Rich, themed SVG vector illustration component matching the Schoolmouv style.
 * Designed with curved organic blobs, vivid accent layers, and iconic subject artifacts.
 */
export const SubjectVectorIllustration: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case 'french':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Organic background shapes */}
          <path d="M160 30C160 75 120 120 70 120C35 120 10 100 0 85L0 0L160 0V30Z" fill="#7E22CE" fillOpacity="0.85" />
          <path d="M160 60C140 100 95 118 60 110C35 104 20 85 45 50C70 15 130 5 160 60Z" fill="#EC4899" fillOpacity="0.9" />
          <circle cx="135" cy="25" r="14" fill="#F472B6" />
          {/* Stylized Quill Feather */}
          <g transform="translate(45, 10) rotate(18)">
            <path
              d="M35 5C45 25 55 60 10 95C25 80 40 55 35 5Z"
              fill="#C084FC"
            />
            <path
              d="M35 5C20 30 15 65 10 95C22 75 30 45 35 5Z"
              fill="#E9D5FF"
            />
            {/* Feather spine */}
            <path d="M35 5Q26 55 5 105" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            {/* Feather cuts */}
            <path d="M28 25L38 20M24 42L36 38M19 60L30 56" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          {/* Ink droplets and playful zigzags */}
          <path d="M25 75L35 70L40 78L50 72" stroke="#FDF4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="28" cy="90" r="3.5" fill="#FDF4FF" />
          <circle cx="42" cy="100" r="2.5" fill="#E879F9" />
        </svg>
      );

    case 'history_geo':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Warm terracotta / golden backdrop */}
          <path d="M160 25C160 80 115 120 60 120C25 120 5 95 0 75L0 0L160 0V25Z" fill="#D97706" fillOpacity="0.85" />
          <circle cx="125" cy="75" r="45" fill="#F59E0B" />
          <path d="M60 115C95 115 130 90 145 60C160 30 135 10 110 30C85 50 25 115 60 115Z" fill="#FDE047" fillOpacity="0.85" />
          {/* Numidian/Antique warrior crest & helmet */}
          <g transform="translate(60, 15)">
            {/* Helmet Crest / Plume */}
            <path d="M25 15C32 2 52 0 65 12C60 22 55 30 35 25Z" fill="#EF4444" />
            <path d="M30 18C40 5 58 4 68 15" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
            {/* Golden Helmet body */}
            <path d="M15 32C15 22 26 18 42 20C58 22 62 35 60 48C58 60 48 64 35 64C22 64 15 52 15 32Z" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
            {/* Visor & cheek guard */}
            <path d="M18 35H48V42C48 45 42 47 38 47H18V35Z" fill="#FEF3C7" stroke="#78350F" strokeWidth="1.5" />
            <path d="M28 47V62C28 66 38 66 38 62V47" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
            {/* Antique Round Shield */}
            <circle cx="10" cy="55" r="18" fill="#EA580C" stroke="#FEF3C7" strokeWidth="2.5" />
            <circle cx="10" cy="55" r="11" fill="#78350F" />
            <path d="M10 44V66M-1 55H21" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* Sunburst dots */}
          <circle cx="25" cy="40" r="3" fill="#FEF08A" />
          <circle cx="38" cy="22" r="2" fill="#FEF08A" />
        </svg>
      );

    case 'math':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cyan/Electric blue curves */}
          <path d="M160 20C160 75 110 120 55 120C20 120 5 95 0 75L0 0L160 0V20Z" fill="#0284C7" fillOpacity="0.9" />
          <circle cx="120" cy="65" r="48" fill="#38BDF8" fillOpacity="0.9" />
          <path d="M45 105C80 115 130 95 145 60C160 25 120 5 90 25C60 45 10 95 45 105Z" fill="#67E8F9" fillOpacity="0.75" />
          {/* Stylized Modern Calculator */}
          <g transform="translate(68, 12) rotate(6)">
            {/* Calculator Body */}
            <rect x="0" y="0" width="56" height="78" rx="14" fill="#0369A1" stroke="#E0F2FE" strokeWidth="2.5" />
            {/* Screen */}
            <rect x="8" y="8" width="40" height="20" rx="6" fill="#BAE6FD" />
            <text x="38" y="23" fontFamily="sans-serif" fontSize="12" fontWeight="bold" fill="#0369A1" textAnchor="end">123</text>
            {/* Keypad Buttons */}
            <rect x="8" y="34" width="10" height="8" rx="3" fill="#E0F2FE" />
            <rect x="23" y="34" width="10" height="8" rx="3" fill="#E0F2FE" />
            <rect x="38" y="34" width="10" height="8" rx="3" fill="#38BDF8" />

            <rect x="8" y="46" width="10" height="8" rx="3" fill="#E0F2FE" />
            <rect x="23" y="46" width="10" height="8" rx="3" fill="#E0F2FE" />
            <rect x="38" y="46" width="10" height="8" rx="3" fill="#38BDF8" />

            <rect x="8" y="58" width="10" height="8" rx="3" fill="#E0F2FE" />
            <rect x="23" y="58" width="10" height="8" rx="3" fill="#F59E0B" />
            <rect x="38" y="58" width="10" height="8" rx="3" fill="#0284C7" />
          </g>
          {/* Floating Math Symbols */}
          <g transform="translate(25, 45)">
            <path d="M5 15L15 5M5 5L15 15" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M5 32H18M5 38H18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="35" cy="18" r="4" fill="#FEF08A" />
          </g>
        </svg>
      );

    case 'science':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emerald / Teal deep organic curves */}
          <path d="M160 30C160 85 115 120 65 120C30 120 10 95 0 80L0 0L160 0V30Z" fill="#047857" fillOpacity="0.85" />
          <circle cx="115" cy="65" r="46" fill="#10B981" />
          <path d="M60 110C95 115 135 90 148 55C160 20 125 5 95 25C65 45 25 105 60 110Z" fill="#34D399" fillOpacity="0.8" />
          {/* Stylized Nautilus / Nature Spiral & Conical Flask */}
          <g transform="translate(68, 14)">
            {/* Glowing Nautilus shell */}
            <path
              d="M38 10C55 10 68 24 68 40C68 56 54 68 36 68C22 68 12 58 12 44C12 32 20 24 32 24C40 24 46 30 46 38C46 44 42 48 36 48"
              fill="none"
              stroke="#A7F3D0"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M38 10C55 10 68 24 68 40C68 56 54 68 36 68C22 68 12 58 12 44C12 32 20 24 32 24C40 24 46 30 46 38C46 44 42 48 36 48"
              fill="none"
              stroke="#065F46"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            {/* Chemistry bubbles */}
            <circle cx="15" cy="18" r="5" fill="#6EE7B7" stroke="#065F46" strokeWidth="1.5" />
            <circle cx="28" cy="8" r="3.5" fill="#A7F3D0" />
            <circle cx="58" cy="62" r="4" fill="#D1FAE5" />
          </g>
          {/* Leaves/Plant elements */}
          <g transform="translate(30, 48) rotate(-15)">
            <path d="M10 30C5 18 15 5 30 0C32 15 25 28 10 30Z" fill="#6EE7B7" stroke="#047857" strokeWidth="1.5" />
            <path d="M10 30C20 18 30 10 30 0" stroke="#047857" strokeWidth="1.5" />
          </g>
        </svg>
      );

    case 'civics':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Warm amber & bright sunburst background */}
          <path d="M160 25C160 80 115 120 60 120C25 120 5 95 0 75L0 0L160 0V25Z" fill="#EA580C" fillOpacity="0.85" />
          <circle cx="120" cy="70" r="46" fill="#F59E0B" />
          <path d="M50 110C85 118 130 92 144 58C158 24 125 5 95 24C65 43 15 102 50 110Z" fill="#FDE047" fillOpacity="0.85" />
          {/* Scales of Justice (Balance) */}
          <g transform="translate(62, 16)">
            {/* Center Pillar */}
            <path d="M38 12V68" stroke="#9A3412" strokeWidth="4" strokeLinecap="round" />
            <path d="M38 12V68" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
            {/* Top Beam */}
            <path d="M12 25C25 22 51 22 64 25" stroke="#9A3412" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M12 25C25 22 51 22 64 25" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
            {/* Central finial ball */}
            <circle cx="38" cy="12" r="5" fill="#FDE047" stroke="#9A3412" strokeWidth="1.5" />
            {/* Left Pan and cords */}
            <path d="M14 26L7 45M14 26L21 45" stroke="#78350F" strokeWidth="1.5" />
            <path d="M5 45C5 52 23 52 23 45Z" fill="#EA580C" stroke="#78350F" strokeWidth="1.5" />
            {/* Right Pan and cords */}
            <path d="M62 26L55 45M62 26L69 45" stroke="#78350F" strokeWidth="1.5" />
            <path d="M53 45C53 52 71 52 71 45Z" fill="#EA580C" stroke="#78350F" strokeWidth="1.5" />
            {/* Sturdy base */}
            <path d="M22 68H54C54 64 48 60 38 60C28 60 22 64 22 68Z" fill="#9A3412" stroke="#FEF3C7" strokeWidth="1" />
          </g>
          {/* Sparkling dots */}
          <circle cx="28" cy="35" r="3" fill="#FFF" />
          <circle cx="45" cy="20" r="2" fill="#FFF" />
        </svg>
      );

    case 'english':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Deep Royal Purple & Indigo */}
          <path d="M160 25C160 80 110 120 55 120C20 120 5 95 0 75L0 0L160 0V25Z" fill="#581C87" fillOpacity="0.85" />
          <circle cx="120" cy="65" r="45" fill="#9333EA" />
          <path d="M45 110C80 115 130 90 145 55C160 20 120 5 90 25C60 45 10 105 45 110Z" fill="#C084FC" fillOpacity="0.8" />
          {/* Royal Jeweled Crown */}
          <g transform="translate(62, 22) rotate(-6)">
            {/* Crown Base */}
            <rect x="8" y="44" width="54" height="12" rx="4" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            {/* Velvet cap behind peaks */}
            <path d="M14 44C14 26 56 26 56 44Z" fill="#BE185D" />
            {/* Golden Peaks */}
            <path
              d="M10 44L14 25L26 36L35 15L44 36L56 25L60 44Z"
              fill="#FBBF24"
              stroke="#78350F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Jewel Pearls on peaks */}
            <circle cx="14" cy="25" r="3" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
            <circle cx="35" cy="15" r="4" fill="#38BDF8" stroke="#78350F" strokeWidth="1" />
            <circle cx="56" cy="25" r="3" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
            {/* Base gemstones */}
            <circle cx="18" cy="50" r="2.5" fill="#EF4444" />
            <circle cx="35" cy="50" r="3" fill="#3B82F6" />
            <circle cx="52" cy="50" r="2.5" fill="#10B981" />
          </g>
          {/* Sparkling stars */}
          <g transform="translate(25, 30)">
            <path d="M10 0L12 6L18 8L12 10L10 16L8 10L2 8L8 6Z" fill="#FDE047" />
          </g>
          <circle cx="35" cy="65" r="2.5" fill="#FFFFFF" />
        </svg>
      );

    case 'arabic':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Emerald and Golden Heritage curves */}
          <path d="M160 25C160 80 115 120 60 120C25 120 5 95 0 75L0 0L160 0V25Z" fill="#047857" fillOpacity="0.85" />
          <circle cx="120" cy="70" r="46" fill="#10B981" />
          <path d="M50 110C85 118 130 92 144 58C158 24 125 5 95 24C65 43 15 102 50 110Z" fill="#6EE7B7" fillOpacity="0.8" />
          {/* Arabic Calligraphy & Ancient Scroll */}
          <g transform="translate(62, 14)">
            {/* Parchment Scroll */}
            <rect x="10" y="8" width="52" height="66" rx="8" fill="#FEF3C7" stroke="#B45309" strokeWidth="2" />
            {/* Scroll decorative lines */}
            <line x1="18" y1="20" x2="54" y2="20" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="18" y1="30" x2="48" y2="30" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="40" x2="52" y2="40" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="50" x2="42" y2="50" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            {/* Large Calligraphic Letter 'ض' or 'أ' emblem */}
            <circle cx="36" cy="58" r="8" fill="#047857" />
            <path d="M36 53V63M32 55H40" stroke="#FEF3C7" strokeWidth="1.5" strokeLinecap="round" />
            {/* Traditional Bamboo Qalam Pen */}
            <g transform="translate(0, 10) rotate(-35)">
              <rect x="0" y="0" width="8" height="50" rx="3" fill="#92400E" stroke="#451A03" strokeWidth="1" />
              <path d="M0 50L4 62L8 50Z" fill="#451A03" />
            </g>
          </g>
          <circle cx="28" cy="35" r="3" fill="#FEF08A" />
        </svg>
      );

    case 'islamic':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Deep Emerald & Radiant Gold */}
          <path d="M160 25C160 80 115 120 60 120C25 120 5 95 0 75L0 0L160 0V25Z" fill="#065F46" fillOpacity="0.85" />
          <circle cx="120" cy="70" r="46" fill="#047857" />
          <path d="M50 110C85 118 130 92 144 58C158 24 125 5 95 24C65 43 15 102 50 110Z" fill="#F59E0B" fillOpacity="0.8" />
          {/* Crescent Moon & Radiant Lantern / Mosque dome */}
          <g transform="translate(64, 12)">
            {/* Crescent Moon */}
            <path
              d="M48 6C35 6 24 17 24 30C24 43 35 54 48 54C42 54 34 46 34 30C34 14 42 6 48 6Z"
              fill="#FDE047"
              stroke="#B45309"
              strokeWidth="1.5"
            />
            {/* Mosque Dome Silhouette */}
            <path
              d="M12 58C12 40 28 32 38 25C48 32 64 40 64 58H12Z"
              fill="#10B981"
              stroke="#064E3B"
              strokeWidth="2"
            />
            <circle cx="38" cy="22" r="3" fill="#FDE047" />
            <path d="M38 18V25" stroke="#FDE047" strokeWidth="2" />
            {/* Arabic geometric arches */}
            <path d="M28 58C28 50 38 46 38 58" fill="#FEF3C7" stroke="#064E3B" strokeWidth="1.5" />
            <path d="M48 58C48 50 58 46 58 58" fill="#FEF3C7" stroke="#064E3B" strokeWidth="1.5" />
          </g>
          {/* Radiant sparkles */}
          <circle cx="32" cy="26" r="3" fill="#FEF08A" />
          <circle cx="48" cy="40" r="2" fill="#FEF08A" />
        </svg>
      );

    case 'tamazight':
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Warm Berber Ochre & Mediterranean Azure */}
          <path d="M160 25C160 80 115 120 60 120C25 120 5 95 0 75L0 0L160 0V25Z" fill="#0D9488" fillOpacity="0.85" />
          <circle cx="120" cy="70" r="46" fill="#F59E0B" />
          <path d="M50 110C85 118 130 92 144 58C158 24 125 5 95 24C65 43 15 102 50 110Z" fill="#2DD4BF" fillOpacity="0.8" />
          {/* Berber Yaz Symbol (ⵣ) on Traditional Medallion */}
          <g transform="translate(68, 14)">
            <circle cx="36" cy="38" r="30" fill="#FEF3C7" stroke="#B45309" strokeWidth="3" />
            <circle cx="36" cy="38" r="25" fill="#EA580C" />
            {/* Yaz Symbol (ⵣ) */}
            <g transform="translate(20, 22)">
              <path d="M16 4V28M4 6C4 16 16 16 16 16C16 16 28 16 28 6M4 26C4 16 16 16 16 16C16 16 28 16 28 26" stroke="#FEF3C7" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
          {/* Traditional Berber geometric diamonds */}
          <g transform="translate(25, 40)">
            <polygon points="10,0 20,10 10,20 0,10" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />
          </g>
        </svg>
      );

    case 'art':
    default:
      return (
        <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rainbow splash / Creative coral & magenta */}
          <path d="M160 25C160 80 115 120 60 120C25 120 5 95 0 75L0 0L160 0V25Z" fill="#E11D48" fillOpacity="0.8" />
          <circle cx="120" cy="70" r="46" fill="#F43F5E" />
          <path d="M50 110C85 118 130 92 144 58C158 24 125 5 95 24C65 43 15 102 50 110Z" fill="#FB7185" fillOpacity="0.75" />
          {/* Artist Wooden Palette & Brush */}
          <g transform="translate(60, 16)">
            {/* Palette */}
            <path
              d="M10 38C10 18 28 8 48 8C68 8 74 24 74 38C74 54 58 68 40 68C26 68 20 58 12 56C8 54 10 44 10 38Z"
              fill="#FDE68A"
              stroke="#B45309"
              strokeWidth="2"
            />
            {/* Thumb hole */}
            <ellipse cx="22" cy="48" rx="4.5" ry="6" fill="#F43F5E" />
            {/* Color paint dots */}
            <circle cx="32" cy="18" r="4.5" fill="#3B82F6" />
            <circle cx="48" cy="18" r="4.5" fill="#10B981" />
            <circle cx="62" cy="28" r="4.5" fill="#EF4444" />
            <circle cx="60" cy="45" r="4.5" fill="#8B5CF6" />
            {/* Paintbrush */}
            <g transform="translate(30, 20) rotate(45)">
              <rect x="0" y="0" width="6" height="35" rx="3" fill="#78350F" />
              <rect x="0" y="32" width="6" height="8" fill="#CBD5E1" />
              <path d="M0 40C0 46 6 46 6 40Z" fill="#3B82F6" />
            </g>
          </g>
          <circle cx="30" cy="30" r="3" fill="#FFFFFF" />
        </svg>
      );
  }
};

export const SubjectIllustratedCard: React.FC<SubjectIllustratedCardProps> = ({
  id,
  nameAr,
  nameFr,
  totalLessons,
  completedLessons = 0,
  isLocked = false,
  onClick,
  showAudio = false,
  speakingKey = null,
  onSpeak,
  className = '',
  'data-subject-card': dataSubjectCard,
  grade,
}) => {
  const { direction, locale } = useLocaleContext();
  const theme = SUBJECT_THEMES[id] || SUBJECT_THEMES.french;
  const isRtl = direction === 'rtl';

  const isFrenchFree = grade ? isFrenchFreeGrade(grade) : false;
  const displayName = locale === 'fr' && !isFrenchFree ? nameFr : nameAr;
  const secondaryName = isFrenchFree
    ? grade === '1AP'
      ? 'السنة الأولى ابتدائي 🌟'
      : ''
    : locale === 'fr'
      ? nameAr
      : nameFr;

  const progressPercent =
    totalLessons && totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0;
  const isFullyCompleted = totalLessons !== undefined && totalLessons > 0 && completedLessons >= totalLessons;

  return (
    <motion.div
      data-subject-card={dataSubjectCard ?? id}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className={`group relative overflow-hidden rounded-[22px] bg-white dark:bg-slate-900 border-2 border-[#EFE9DF] dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md ${theme.hoverBorder} transition-all duration-200 flex items-stretch min-h-[96px] sm:min-h-[110px] ${className}`}
    >
      {/* Top accent line matching LessonIllustratedCard */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-20"
        style={{ backgroundColor: theme.blobColor }}
        aria-hidden="true"
      />
      {showAudio && onSpeak && (
        <div className="absolute top-1/2 -translate-y-1/2 start-4 z-20">
          <TapSpeakButton
            snippetKey={`subject-${id}`}
            text={nameAr}
            speakingKey={speakingKey}
            onSpeak={onSpeak}
            label={locale === 'fr' ? `Écouter ${displayName}` : `استمع إلى ${displayName}`}
          />
        </div>
      )}
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className="relative flex w-full items-stretch min-w-0 text-start cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-blue-600"
      >
      {/* TEXT SIDE */}
      <div
        data-subject-text=""
        className={`flex-1 pt-4 pb-4 pe-4 sm:pt-5 sm:pb-5 sm:pe-5 flex flex-col justify-center gap-1.5 min-w-0 z-10 ${
          showAudio && onSpeak ? 'ps-[76px]' : 'ps-4 sm:ps-5'
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-snug truncate">
            {displayName}
          </h3>

          {isLocked && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300">
              <Lock className="w-2.5 h-2.5" />
              <span>مقفول</span>
            </span>
          )}

          {isFullyCompleted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{locale === 'fr' ? 'Terminé' : 'مكتمل'}</span>
            </span>
          )}
        </div>

        {/* Secondary subtitle / lesson count */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 flex-wrap">
          {secondaryName && <span>{secondaryName}</span>}
          {totalLessons !== undefined && totalLessons > 0 && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${theme.badgeBg} ${theme.badgeText}`}>
                {locale === 'fr' ? `${totalLessons} leçons` : `${totalLessons} دروس`}
              </span>
            </>
          )}
        </div>

        {/* Optional Progress Mini-Bar */}
        {totalLessons !== undefined && totalLessons > 0 && completedLessons > 0 && !isFullyCompleted && (
          <div className="w-full max-w-[160px] sm:max-w-[200px] mt-0.5">
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${theme.primaryGradient} transition-all duration-300 rounded-full`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              {locale === 'fr'
                ? `${completedLessons}/${totalLessons} complétées`
                : `${completedLessons} من ${totalLessons} منجزة`}
            </span>
          </div>
        )}
      </div>

      {/* ILLUSTRATION SIDE (Right in LTR, Left in RTL) */}
      <div
        className={`w-28 sm:w-40 md:w-48 relative overflow-hidden flex items-center justify-center shrink-0 select-none ${
          isRtl ? 'order-first' : 'order-last'
        }`}
      >
        <SubjectVectorIllustration id={id} />
      </div>

      {/* Subtle chevron indicator */}
      <div className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400 dark:text-slate-500 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block">
        {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </div>
      </motion.button>
    </motion.div>
  );
};

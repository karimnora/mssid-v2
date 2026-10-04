import type { PrimaryGrade } from '../../types';

export interface SoukStall {
  id: string;
  nameAr: string;
  sellerAr: string;
  itemAr: string;
  priceDzd: number;
  accent: string;
}

export const SOUK_STALLS: SoukStall[] = [
  { id: 'bread', nameAr: 'الخَبَّازُ', sellerAr: 'العَمّ بَلْقَاسِم', itemAr: 'خُبْزُ الدَّارِ', priceDzd: 50, accent: '#C4A574' },
  { id: 'milk', nameAr: 'لَبَّنُ الحَيِّ', sellerAr: 'الخَالَة فَاطِمَة', itemAr: 'كِيسُ حَلِيبٍ', priceDzd: 25, accent: '#93C5FD' },
  { id: 'dates', nameAr: 'التَّمَّارُ', sellerAr: 'سِي مُحَمَّد', itemAr: 'عُلْبَةُ دَقْلَةِ نُورٍ', priceDzd: 150, accent: '#D97706' },
  { id: 'veg', nameAr: 'الخُضَرِيُّ', sellerAr: 'لَلاَّ زِينَب', itemAr: 'طَمَاطِمُ (1 كلغ)', priceDzd: 80, accent: '#008751' },
];

export const SOUK_CASH = [5, 10, 20, 50, 100, 200, 500] as const;

export interface SoukMission {
  id: string;
  briefAr: string;
  stallIds: string[];
  wallet: number[];
}

export const SOUK_MISSIONS: SoukMission[] = [
  { id: 'bread-only', briefAr: 'اِشْتَرِ خُبْزَةً وَاحِدَةً. اِحْسُبِ البَاقِي بِنَفْسِكَ.', stallIds: ['bread'], wallet: [50, 100] },
  { id: 'bread-milk', briefAr: 'اِشْتَرِ خُبْزاً وَكِيسَ حَلِيبٍ. الحِسَابُ دُونَ أَنْ يَتَجَاوَزَ 100 دج.', stallIds: ['bread', 'milk'], wallet: [100, 20, 5] },
  { id: 'dates-bread', briefAr: 'اِشْتَرِ تَمْراً وَخُبْزاً لِلعَائِلَةِ، ثُمَّ احْسُبِ البَاقِي.', stallIds: ['dates', 'bread'], wallet: [200, 50] },
  { id: 'veg-milk', briefAr: 'اِشْتَرِ طَمَاطِمَ وَحَلِيباً. كَمْ يَبْقَى إِذَا دَفَعْتَ 200 دج؟', stallIds: ['veg', 'milk'], wallet: [200, 20] },
  { id: 'family-bag', briefAr: 'اِشْتَرِ تَمْراً وَخُبْزاً وَطَمَاطِمَ. اِحْسُبِ البَاقِي بَعْدَ دَفْعِ 500 دج.', stallIds: ['dates', 'bread', 'veg'], wallet: [500, 100] },
];

export function soukMissionsForGrade(grade: PrimaryGrade): SoukMission[] {
  if (grade === '1AP') return SOUK_MISSIONS.slice(0, 2);
  if (grade === '2AP') return SOUK_MISSIONS.slice(0, 3);
  return SOUK_MISSIONS;
}

export function soukMissionForGrade(grade: PrimaryGrade): SoukMission {
  return soukMissionsForGrade(grade)[0];
}

export function stallById(id: string): SoukStall | undefined {
  return SOUK_STALLS.find((stall) => stall.id === id);
}

export function basketTotal(ids: string[]): number {
  return ids.reduce((sum, id) => sum + (stallById(id)?.priceDzd ?? 0), 0);
}

export function tenderSum(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

export function soukChange(total: number, tender: number): number | null {
  if (tender < total) return null;
  return tender - total;
}

export function soukChangeChoices(change: number): number[] {
  const extras = [change + 10, Math.max(0, change - 20), change + 50].filter((value) => value !== change);
  const unique = [change, ...extras].filter((value, index, list) => list.indexOf(value) === index);
  return unique.slice(0, 3).sort((a, b) => a - b);
}

export function missionComplete(mission: SoukMission, bought: string[]): boolean {
  const needed = [...mission.stallIds].sort();
  const got = [...new Set(bought)].sort();
  return needed.length === got.length && needed.every((id, index) => id === got[index]);
}

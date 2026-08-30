import { PrimaryGrade, SubjectId } from './index';

export type DidouOutfitId =
  | 'default'
  | 'burnous_traditionnel'
  | 'cheche_sahara'
  | 'robe_kabyle'
  | 'maillot_verts_dz'
  | 'tarbouche_casbah'
  | 'chapeau_diplome'
  | 'astronaute_dz'
  | 'docteur_savant'
  | 'chevalier_numidie'
  | 'pilote_aerien';

export type DidouPetSpecies = 'fennec' | 'eagle';

export type DidouMood = 'happy' | 'proud' | 'thinking' | 'celebrating' | 'hungry' | 'sleepy' | 'studying';

export interface DidouTreatItem {
  id: string;
  nameAr: string;
  nameFr: string;
  icon: string;
  energyBonus: number;
  xpBonus: number;
  priceGoldCoins: number;
  descriptionAr: string;
  descriptionFr: string;
  originWilayaAr: string;
}

export interface DidouOutfitItem {
  id: DidouOutfitId;
  nameAr: string;
  nameFr: string;
  descriptionAr: string;
  category: 'clothing' | 'headwear';
  priceGoldCoins: number;
  icon: string;
  accentColor: string;
  badgeRequired?: string;
}

export interface DidouAvatarConfig {
  species?: DidouPetSpecies;
  activeOutfit: DidouOutfitId;
  unlockedOutfits: DidouOutfitId[];
  mood?: DidouMood;
  energy?: number; // 0 - 100
  energyLevel?: number; // 0 - 100
  happinessLevel?: number; // 0 - 100
  friendshipLevel?: number; // 1 - 10
  friendshipXp?: number;
  fedCount?: number;
  totalTreatsGiven?: number;
  patCount?: number;
  currentStage?: number;
  wisdomPoints?: number;
  lastFedTimestamp?: number;
  lastFedAt?: string;
  customName?: string;
}

export interface HomeworkAssignment {
  id: string;
  pinCode: string;
  teacherId: number;
  teacherName?: string;
  title: string;
  targetGrade: PrimaryGrade;
  subject: SubjectId;
  exerciseIds: string[];
  lessonIds?: string[];
  createdAt: string;
  dueDate?: string;
  descriptionAr?: string;
}

export interface LessonPack {
  id: string;
  grade: PrimaryGrade | 'BARAEM';
  subject: string;
  term: 1 | 2 | 3;
  version: number;
  sizeBytes: number;
  sizeMb: number;
  titleAr: string;
  titleFr: string;
  descriptionAr: string;
  lessonsCount: number;
  updatedAt: string;
  isDownloaded?: boolean;
}

export interface OfflineSyncItem {
  id: string;
  userId: number;
  exerciseId: string;
  score: number;
  coinsEarned: number;
  clientTimestamp: string;
  synced?: boolean;
}

export interface WilayaInfo {
  code: number;
  codeStr: string; // e.g. "01", "16", "58"
  nameAr: string;
  nameFr: string;
  capitalAr: string;
  region: 'north' | 'high_plateaus' | 'sahara';
  regionAr: string;
  famousForAr: string;
  icon: string;
  monumentAr?: string;
  specialtyAr?: string;
  natureAr?: string;
  postalPrefix?: string;
  mapPosition?: { xPercent: number; yPercent: number };
  historyFactAr?: string;
  clues?: string[];
  stageGroup?: 'coastal' | 'tell' | 'plateaus' | 'oasis' | 'deep_sahara' | 'new_10';
}

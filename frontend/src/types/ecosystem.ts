import { PrimaryGrade, SubjectId } from './index';

export type DidouOutfitId =
  | 'default'
  | 'burnous_traditionnel'
  | 'cheche_sahara'
  | 'robe_kabyle'
  | 'maillot_verts_dz'
  | 'tarbouche_casbah'
  | 'chapeau_diplome';

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
  activeOutfit: DidouOutfitId;
  unlockedOutfits: DidouOutfitId[];
  mood?: 'happy' | 'proud' | 'thinking' | 'celebrating';
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
}

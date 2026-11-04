import type { UserRole } from '../types/auth';

/**
 * SINGLE SOURCE OF TRUTH for what is free and what is paid in V2.
 *
 * Every Premium or quota gate in the app must name its feature here and ask `canAccess` /
 * `isPremiumRole`, never compare roles itself. The free/paid table in docs/v2-gratuit-payant.md is
 * generated from this registry (`renderEntitlementsTable`) and a test keeps both in sync.
 *
 * Tiers:
 * - free:    open to everyone, no limit.
 * - quota:   free with a limit (`freeAllowance`), unlimited with Premium.
 * - premium: Family Premium only (a free preview may exist, described in `freeAllowance`).
 *
 * `enforcedBy` says where the rule really holds: 'server' gates cannot be bypassed by editing the
 * app; 'client' gates only hide content that is still shipped in the app bundle.
 */
export type Tier = 'free' | 'quota' | 'premium';
export type Enforcement = 'client' | 'server' | 'client+server';

export interface Entitlement {
  tier: Tier;
  labelFr: string;
  labelAr: string;
  freeAllowance?: string;
  enforcedBy: Enforcement;
  /** Where the gate lives (for audits). */
  gates: string[];
}

export const PREMIUM_ROLES: readonly UserRole[] = ['ROLE_PREMIUM', 'ROLE_ADMIN'];

/** Didou journey: the first two worlds (Sahara, Casbah) are free, worlds 3 to 8 are Premium. */
export const FREE_JOURNEY_WORLDS = 2;

export const ENTITLEMENTS = {
  // ——— Free, always ———
  courseLessons: { tier: 'free', labelFr: 'Cours, exercices et quiz des 3 trimestres (V1)', labelAr: 'دروس وتمارين واختبارات الفصول الثلاثة (V1)', enforcedBy: 'client', gates: ['utils/trimesterAccess.ts (paywall trimestriel désactivé en V2)'] },
  v1Printables: { tier: 'free', labelFr: 'Fiches imprimables V1', labelAr: 'مطبوعات V1', enforcedBy: 'client', gates: [] },
  preschool: { tier: 'free', labelFr: 'Mode Éveil (préscolaire)', labelAr: 'التحضيري', enforcedBy: 'client', gates: [] },
  labs: { tier: 'free', labelFr: 'Laboratoires interactifs du catalogue', labelAr: 'المختبرات التفاعلية', enforcedBy: 'client', gates: [] },
  examsV1: { tier: 'free', labelFr: 'Examens V1 avec corrigés', labelAr: 'امتحانات V1 مع الحلول', enforcedBy: 'client', gates: [] },
  journeyFreeWorlds: { tier: 'free', labelFr: `Carte de Didou : mondes 1 à ${FREE_JOURNEY_WORLDS} (Sahara, Casbah)`, labelAr: 'خريطة ديدو: العالمان الأول والثاني', enforcedBy: 'client', gates: ['components/journey/JourneyScreen.tsx'] },
  musaidiHints: { tier: 'free', labelFr: '« مساعدي » : toutes les questions, indices et règle de la leçon', labelAr: 'مساعدي: كل الأسئلة والتلميحات وقاعدة الدرس', enforcedBy: 'client', gates: [] },
  guidedMethod: { tier: 'free', labelFr: 'Méthode guidée (maths 1AP–2AP)', labelAr: 'الطريقة الموجّهة (رياضيات 1AP–2AP)', enforcedBy: 'client', gates: [] },
  parentNotebookBasic: { tier: 'free', labelFr: 'Carnet parent : résumé et prochaine révision', labelAr: 'دفتر الولي: ملخص والمراجعة التالية', enforcedBy: 'client', gates: [] },
  firstSteps: { tier: 'free', labelFr: 'Démarrage guidé et e-mail du parent', labelAr: 'خطوتان للبدء', enforcedBy: 'client', gates: [] },

  // ——— Free with a limit ———
  musaidiCorrections: { tier: 'quota', labelFr: '« مساعدي » : corrections détaillées pas à pas', labelAr: 'مساعدي: التصحيح المفصّل', freeAllowance: '3 par jour et par compte', enforcedBy: 'client+server', gates: ['components/musaidi/MusaidiPanel.tsx', 'utils/musaidiQuota.ts', 'backend MusaidiQuotaService'] },
  competenceCahiers: { tier: 'quota', labelFr: 'Cahiers de compétence V2 (recto, corrigé)', labelAr: 'كراسات الكفاءات V2', freeAllowance: '3 nouveaux cahiers par semaine pour la famille ; aperçu d’un exercice', enforcedBy: 'client+server', gates: ['components/cahiers/CompetenceCahierSheet.tsx', 'backend CahierAccessService'] },

  // ——— Family Premium ———
  journeyAllWorlds: { tier: 'premium', labelFr: `Carte de Didou : mondes ${FREE_JOURNEY_WORLDS + 1} à 8 et leurs médailles`, labelAr: 'خريطة ديدو: العوالم من 3 إلى 8', enforcedBy: 'client', gates: ['components/journey/JourneyScreen.tsx', 'utils/journeyProgress.ts'] },
  parentNotebookDetail: { tier: 'premium', labelFr: 'Carnet parent détaillé : compétences, historique, plan de la semaine', labelAr: 'دفتر الولي المفصّل', freeAllowance: 'résumé et prochaine révision', enforcedBy: 'client', gates: ['components/ParentNotebookModal.tsx'] },
  weeklyReportShare: { tier: 'premium', labelFr: 'Bilan de la semaine partageable (WhatsApp)', labelAr: 'حصيلة الأسبوع للمشاركة', enforcedBy: 'client', gates: ['components/ParentNotebookModal.tsx'] },
  cemPrep: { tier: 'premium', labelFr: 'Préparation au collège (5AP)', labelAr: 'التحضير للمتوسطة', freeAllowance: 'premier exercice du premier sujet', enforcedBy: 'client', gates: ['components/immersive/CemPrepLab.tsx'] },
  familyStudio: { tier: 'premium', labelFr: 'Studio famille : vacances, rentrée, révisions avant évaluation', labelAr: 'استوديو العائلة', freeAllowance: 'un exercice par séance', enforcedBy: 'client', gates: ['components/family/FamilyLearningStudio.tsx (droit Premium lu sur le serveur, contenu livré dans l’app)'] },
  familyWorkshops: { tier: 'premium', labelFr: 'Ateliers et laboratoires Premium (mosaïque, aventures, labos)', labelAr: 'ورشات ومختبرات Premium', freeAllowance: 'première mission de chaque atelier', enforcedBy: 'client', gates: ['components/family/*', 'components/garden/GardenMission.tsx', 'components/market/MarketMission.tsx'] },
  preschoolMissions: { tier: 'premium', labelFr: 'Missions jardin et marché du préscolaire', labelAr: 'مهمتا الحديقة والسوق (التحضيري)', freeAllowance: 'séance découverte', enforcedBy: 'client', gates: ['components/preschool/PreschoolGardenMission.tsx', 'components/preschool/PreschoolMarketMission.tsx'] },
  immersiveMissions: { tier: 'premium', labelFr: 'Missions de Didou : cours immersifs et interactifs, Didou explique chaque erreur', labelAr: 'مهمات ديدو التفاعلية', freeAllowance: 'la première mission de chaque matière', enforcedBy: 'client', gates: ['components/missions/MissionBanner.tsx', 'data/missions (free)'] },
  learningGames: { tier: 'premium', labelFr: 'Jeux éducatifs de Didou (memory, classer, ordonner, labyrinthe)', labelAr: 'ألعاب ديدو التعليمية', freeAllowance: 'le premier jeu de chaque niveau', enforcedBy: 'client', gates: ['components/games/learning/LearningGameEntry.tsx', 'data/games (free)'] },
  examPlan: { tier: 'premium', labelFr: 'Plan « 10 jours avant la composition » construit sur les erreurs de l’enfant', labelAr: 'خطة المراجعة قبل الاختبار', freeAllowance: 'les 2 premiers jours du plan', enforcedBy: 'client', gates: ['components/examPlan/ExamPlanPanel.tsx'] },
  examPapers: { tier: 'premium', labelFr: 'Sujets d’examen protégés (PDF)', labelAr: 'مواضيع الامتحانات المحمية', enforcedBy: 'server', gates: ['backend ExamController @PreAuthorize PREMIUM/ADMIN'] },
} as const satisfies Record<string, Entitlement>;

export type Feature = keyof typeof ENTITLEMENTS;

export function isPremiumRole(role?: string | null): boolean {
  return !!role && (PREMIUM_ROLES as readonly string[]).includes(role);
}

/**
 * Full access to a feature. 'free' → always; 'quota' and 'premium' → only Premium roles
 * (quota features remain usable within `freeAllowance`, counted by their own module).
 */
export function canAccess(feature: Feature, role?: string | null): boolean {
  return ENTITLEMENTS[feature].tier === 'free' || isPremiumRole(role);
}

const TIER_FR: Record<Tier, string> = { free: 'Gratuit', quota: 'Gratuit avec limite', premium: 'Premium Famille' };
const ENFORCED_FR: Record<Enforcement, string> = { client: 'app', server: 'serveur', 'client+server': 'app + serveur' };

/** Markdown table for docs/v2-gratuit-payant.md (kept in sync by entitlements.test.ts). */
export function renderEntitlementsTable(): string {
  const rows = (Object.entries(ENTITLEMENTS) as [Feature, Entitlement][]).map(
    ([key, e]) => `| ${e.labelFr} | ${TIER_FR[e.tier]} | ${e.freeAllowance ?? (e.tier === 'free' ? 'sans limite' : '—')} | ${ENFORCED_FR[e.enforcedBy]} | \`${key}\` |`,
  );
  return ['| Fonction | Accès | Part gratuite | Appliqué par | Clé |', '|---|---|---|---|---|', ...rows].join('\n');
}

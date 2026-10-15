import { ADVENTURE_THEMES, type AdventureTheme } from './themedAdventures';
import type { PrimaryGrade } from '../../types';
import type { Bilingual } from './familyContent';

export type PremiumLab = 'market' | 'story' | 'science';
export const PREMIUM_LAB_JOURNEYS: Record<PremiumLab, { title: Bilingual; goal: Bilingual; steps: Bilingual[]; transfer: Bilingual }> = {
  market: {
    title: { fr: 'Le marché de Didou', ar: 'سوق ديدو' },
    goal: { fr: 'Compter, calculer, vérifier', ar: 'أعدّ وأحسب وأتحقّق' },
    steps: [{ fr: 'Préparer le panier', ar: 'أحضّر السلة' }, { fr: 'Trouver le prix', ar: 'أحسب الثمن' }, { fr: 'Vérifier la monnaie', ar: 'أتحقّق من الباقي' }],
    transfer: { fr: 'Avec des pièces factices, invente un autre achat et vérifie : achats + monnaie = paiement.', ar: 'استعمل نقوداً وهمية واختر مشتريات أخرى. تحقّق: الثمن + الباقي = المبلغ المدفوع.' },
  },
  story: {
    title: { fr: 'L’aventure du lecteur', ar: 'مغامرة القارئ' },
    goal: { fr: 'Lire, trouver un indice, expliquer', ar: 'أقرأ وأجد دليلاً وأشرح' },
    steps: [{ fr: 'Trouver une information', ar: 'أجد معلومة' }, { fr: 'Relier les indices', ar: 'أربط الأدلة' }, { fr: 'Expliquer son choix', ar: 'أشرح اختياري' }],
    transfer: { fr: 'Raconte le récit à un proche. Montre une phrase qui prouve une de tes réponses.', ar: 'احكِ القصة لقريب وأشر إلى جملة تدعم إحدى إجاباتك.' },
  },
  science: {
    title: { fr: 'L’atelier des ombres', ar: 'ورشة الظلال' },
    goal: { fr: 'Prédire, expérimenter, comparer', ar: 'أتوقّع وأجرّب وأقارن' },
    steps: [{ fr: 'Faire monter la lumière', ar: 'أرفع الضوء' }, { fr: 'Agrandir le poteau', ar: 'أزيد ارتفاع العمود' }, { fr: 'Vérifier sur un nouvel essai', ar: 'أتحقّق بتجربة أخرى' }],
    transfer: { fr: 'Avec un adulte et une lampe, compare les ombres de deux objets. Garde la lampe à la même place.', ar: 'مع شخص بالغ ومصباح، قارن ظلّي جسمين مع إبقاء المصباح في المكان نفسه.' },
  },
};
export const premiumLabResultId = (grade: PrimaryGrade, lab: PremiumLab, step: number, theme: AdventureTheme = 'oasis') => 'adventure:' + grade + ':' + (theme === 'oasis' ? '' : theme + ':') + lab + ':' + step;
export const premiumLabResultIds = (grade: PrimaryGrade) => ADVENTURE_THEMES.flatMap(theme => (Object.keys(PREMIUM_LAB_JOURNEYS) as PremiumLab[])
  .flatMap(lab => PREMIUM_LAB_JOURNEYS[lab].steps.map((_, step) => premiumLabResultId(grade, lab, step, theme.id))));

export function marketAmounts(grade: PrimaryGrade, theme: AdventureTheme = 'oasis') {
  const index = ['1AP', '2AP', '3AP', '4AP', '5AP'].indexOf(grade);
  const price = (theme === 'garden' ? [2, 15, 75, 160, 450] : theme === 'library' ? [3, 20, 90, 250, 600] : [5, 25, 125, 240, 1250])[index];
  const quantity = (theme === 'garden' ? [3, 4, 3, 4, 6] : theme === 'library' ? [2, 3, 5, 3, 4] : [2, 3, 4, 5, 3])[index];
  const payment = (theme === 'garden' ? [10, 100, 500, 1000, 5000] : theme === 'library' ? [10, 100, 500, 1000, 5000] : [20, 100, 1000, 2000, 5000])[index];
  return { price, quantity, payment, total: price * quantity, change: payment - price * quantity };
}

/** One variable changes per experiment. Geometry and numeric measures share the same model. */
export const SHADOW_EXPERIMENTS = [
  { before: { angle: 30, height: 20 }, after: { angle: 60, height: 20 }, prediction: 'shorter' },
  { before: { angle: 60, height: 20 }, after: { angle: 60, height: 40 }, prediction: 'longer' },
  { before: { angle: 60, height: 40 }, after: { angle: 70, height: 40 }, prediction: 'shorter' },
] as const;
export const shadowLength = (height: number, angle: number) => height / Math.tan(angle * Math.PI / 180);

export const shadowExperiments = (theme: AdventureTheme = 'oasis') => SHADOW_EXPERIMENTS.map(experiment => ({ ...experiment, before: { ...experiment.before, height: experiment.before.height * (theme === 'garden' ? 0.75 : theme === 'library' ? 1.25 : 1) }, after: { ...experiment.after, height: experiment.after.height * (theme === 'garden' ? 0.75 : theme === 'library' ? 1.25 : 1) } }));

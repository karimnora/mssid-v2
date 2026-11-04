/** Activities of the immersive labs that leave a trace in the parent summary (utils/labTrace.ts). */
export type ImmersiveLabId = 'souk_lab' | 'world_flags_lab' | 'wudu_lab' | 'salat_lab' | 'mosque_adab_lab' | 'road_code_lab';

type Title = { ar: string; fr: string };

export const LAB_TRACE: Record<ImmersiveLabId, Record<string, Title>> = {
  souk_lab: { street: { ar: 'سوق ديدو: الشراء والدفع وحساب الباقي', fr: 'Le souk de Didou : acheter, payer, rendre la monnaie' } },
  world_flags_lab: { quiz: { ar: 'أعلام العالم: التعرّف على العلم', fr: 'Drapeaux du monde : reconnaître le drapeau' } },
  wudu_lab: {
    wash: { ar: 'الوضوء: أعضاء الوضوء', fr: 'Les ablutions : les parties à laver' },
    order: { ar: 'الوضوء: ترتيب الخطوات', fr: 'Les ablutions : l’ordre des étapes' },
    quiz: { ar: 'الوضوء: أسئلة', fr: 'Les ablutions : questions' },
  },
  salat_lab: {
    rakah: { ar: 'الصلاة: حركات الركعة', fr: 'La prière : les gestes de la rak‘a' },
    quiz: { ar: 'الصلاة: أسئلة', fr: 'La prière : questions' },
  },
  mosque_adab_lab: { adab: { ar: 'آداب المسجد', fr: 'Le bon comportement à la mosquée' } },
  road_code_lab: {
    scenes: { ar: 'السلامة المرورية: ماذا أفعل؟', fr: 'Sécurité routière : que faire ?' },
    cross: { ar: 'السلامة المرورية: أعبر الطريق', fr: 'Sécurité routière : traverser la route' },
  },
};

export function labResultId(lab: ImmersiveLabId, activity: string): string {
  return `immersive:${lab}:${activity}`;
}

export function immersiveResultIds(): string[] {
  return (Object.keys(LAB_TRACE) as ImmersiveLabId[]).flatMap((lab) => Object.keys(LAB_TRACE[lab]).map((a) => labResultId(lab, a)));
}

/** id → title and the lab to reopen, for the parent summary. */
export function immersiveResultLabels(): Map<string, { title: Title; moduleId: string }> {
  return new Map(
    (Object.keys(LAB_TRACE) as ImmersiveLabId[]).flatMap((lab) =>
      Object.entries(LAB_TRACE[lab]).map(([a, title]) => [labResultId(lab, a), { title, moduleId: `immersive:${lab}` }] as const),
    ),
  );
}

export type FractionObservation = {
  completed: boolean;
  helped: boolean;
  attempts: number;
};
export type FractionObservations = Partial<
  Record<'decompose' | 'bound' | 'equivalent' | 'explain', FractionObservation>
>;
export const FRACTION_LINES = {
  decompose: 'كوّن أعدادًا صحيحة، ثم عدّ الأجزاء الباقية.',
  bound: 'ضع الكسر بين عددين صحيحين متتاليين.',
  equivalent: 'قسّم كل جزء بالتساوي. تتغيّر الأعداد وتبقى المساحة نفسها.',
  explain: 'الآن أشرح فكرتي. لماذا تبقى الكمية نفسها؟',
  retry: 'انظر إلى الرسم وجرّب مرة أخرى. يمكنك طلب تلميح.',
  success: 'أحسنت! الرسم والعملية يعبّران عن الكمية نفسها.',
  lab: 'في مختبر الحديقة، أطبّق ما تعلّمته على كسور جديدة.',
} as const;

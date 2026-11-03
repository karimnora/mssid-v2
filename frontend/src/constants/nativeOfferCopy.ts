/**
 * Premium wording shown in the native Android app (Google Play consumption-only model).
 * It may say that a feature belongs to Family Premium accounts, never how, where or for how much
 * to get one: no price, no "discover/subscribe", no receipt, no link. Guarded by
 * NativeNoPaymentWording.test.tsx.
 */
export const NATIVE_OFFER_COPY = {
  studio: {
    fr: 'Un exercice offert par séance. Les séances complètes, les corrigés et les impressions du programme sont disponibles pour les comptes Famille Premium. Les fiches gratuites de la V1 et vos cahiers débloqués restent disponibles.',
    ar: 'تمرين مجاني في كل جلسة. الجلسات الكاملة والتصحيح وطباعة البرنامج متاحة لحسابات العائلة المميزة. تبقى مطبوعات V1 وكراساتك المفتوحة متاحة.',
  },
  musaidiLimit: {
    fr: 'Tu as utilisé tes 3 corrections détaillées d’aujourd’hui. Elles reviennent demain. Les indices et la règle restent libres. Les comptes Famille Premium n’ont pas de limite.',
    ar: 'استعملت تصحيحاتك المفصّلة الثلاثة لهذا اليوم، وتعود غداً. تبقى التلميحات وقاعدة الدرس متاحة. حسابات العائلة المميزة بلا حد.',
  },
  enrichment: {
    fr: 'Tu peux rejouer ce défi. Les trois défis suivants de cet atelier sont réservés aux comptes Famille Premium.',
    ar: 'يمكنك إعادة هذا التحدي. التحديات الثلاثة التالية في الورشة متاحة لحسابات العائلة المميزة.',
  },
} as const;

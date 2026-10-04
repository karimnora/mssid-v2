import type { subscription as subscriptionAr } from '../ar/subscription';

export const subscription: typeof subscriptionAr = {
  defaultTitle: 'Révisions guidées, carnet parent et fiches ciblées',
  loginRequiredError: 'Veuillez vous connecter d’abord pour envoyer le reçu de paiement',
  genericSubmitError: 'Impossible d’envoyer le reçu. Vérifiez votre connexion et réessayez.',

  exclusiveBadge: 'Profondeur supplémentaire pour les abonnés',
  headerSubtitle:
    'Révisions courtes à partir des difficultés observées, un carnet lisible pour le parent, et des fiches A4 ciblées. Durée : 12 mois à partir de la validation, pas « l’année scolaire ».',

  freePlanTitle: 'Gratuit',
  freePlanFeature1: '✓ Cours des trois trimestres déjà publiés et leurs exercices',
  freePlanFeature2: '✓ Boucle complète : activité, retour utile, recommandation, puis révision',
  freePlanFeature3: '✓ Carnet limité aux compétences enregistrées (maths 1, 2 et 5 ; arabe 1 et 5)',
  freePlanFeature4: '✗ Suivi plus fin, cahiers A4 et sac de préparation au collège',

  premiumPlanTitle: 'Abonnement annuel pour une famille',
  premiumPlanFeature1: '✓ Carnet plus clair : travaillé, réussite observée, à confirmer',
  premiumPlanFeature2: '✓ Cahiers de compétence A4 corrigés et préparation au passage au collège',
  premiumPlanFeature3: '✓ Assistant pédagogique avec quota quotidien — pas illimité',
  premiumPlanPrice: '💰 Prix : {price} DA pour 12 mois à partir de la validation',

  receiptSubmittedTitle: 'Le reçu a été envoyé et attend une vérification manuelle',
  receiptNumberLabel: 'N° du reçu :',
  statusLabel: 'Statut :',
  pendingStatus: 'En attente de vérification',
  verificationNotePrefix: 'Vérification manuelle des reçus',
  verificationNoteBold: 'BaridiMob / Edahabia / CCP',
  verificationNoteSuffix:
    'sous 24 à 48 heures. Un refus est expliqué. Écris au support si le délai dépasse. L’activation n’est pas automatique.',

  devTestLabel: 'Test développeur (environnement de développement seulement) :',
  devApproveButton: 'Confirmer le reçu tout de suite en développement',

  formTitle: 'Envoyer un reçu de virement — ce n’est pas un paiement carte dans l’application',
  paymentMethodBaridimob: '📱 BaridiMob',
  paymentMethodEdahabia: '💳 Reçu Edahabia',
  paymentMethodCcp: '🏛️ Reçu CCP',

  accountInfoLabel: 'Montant demandé ({price} DA) — 12 mois à partir de la validation :',
  baridimobTag: 'Reçu',
  ccpNotePrefix: 'Le paiement n’est pas encore ouvert à la vente générale.',
  accountNameLabel: 'Nom commercial :',
  accountPendingNote:
    'Les coordonnées postales seront communiquées à l’ouverture de la bêta payante. Aucun RIB d’essai n’est affiché ici.',
  edahabiaMethodNote:
    'Choisir « Edahabia » signifie joindre un reçu de virement, pas payer par carte dans l’application.',
  receiptRequiredError: 'Joins d’abord la photo réelle du reçu depuis l’appareil.',
  supportNote: 'Support : écran Contact de l’application après un refus ou un délai dépassé.',

  transactionRefLabel: 'Numéro de référence ou de transaction (reçu) :',
  transactionRefPlaceholder: 'Exemple : BM-2026-987456123',

  amountLabel: 'Montant transféré :',
  amountValue: '{price} DA (abonnement de 12 mois à partir de la validation)',

  receiptImageLabel: 'Photo du reçu depuis l’appareil :',
  uploadReceiptButton: 'Téléverser l’image du reçu depuis l’appareil',
  receiptPreviewLabel: 'Aperçu du reçu joint',
  receiptEmptyLabel: 'Aucun reçu joint pour l’instant',

  submittingButton: 'Envoi du reçu en cours...',
  submitButton: 'Envoyer le reçu de paiement',
};

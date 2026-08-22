import type { subscription as subscriptionAr } from '../ar/subscription';

export const subscription: typeof subscriptionAr = {
  defaultTitle: 'Débloquer la correction officielle et l’explication détaillée',
  loginRequiredError: 'Veuillez vous connecter d’abord pour envoyer le reçu de paiement',
  genericSubmitError: 'Impossible d’envoyer le reçu. Vérifiez votre connexion et réessayez.',

  exclusiveBadge: 'Contenu exclusif aux abonnés (mssid dz Premium)',
  headerSubtitle:
    'Obtiens la correction type détaillée étape par étape pour tous les examens du certificat de fin d’études primaires en Algérie, ainsi que l’assistant pédagogique intelligent.',

  freePlanTitle: 'Abonnement gratuit (ROLE_FREE)',
  freePlanFeature1: '✓ Parcourir les cours et résumés gratuits',
  freePlanFeature2: '✓ Faire les exercices et exercices interactifs',
  freePlanFeature3: '✗ Corrections officielles et solutions types verrouillées',
  freePlanFeature4: '✗ Fichiers PDF imprimables verrouillés',

  premiumPlanTitle: 'Abonnement annuel mssid dz (ROLE_PREMIUM)',
  premiumPlanFeature1: '✓ Débloquer toutes les solutions et corrections officielles',
  premiumPlanFeature2: '✓ Possibilité de télécharger et imprimer les sujets d’examen',
  premiumPlanFeature3: '✓ Assistant pédagogique intelligent illimité',
  premiumPlanPrice: '💰 Prix : {price} DA / pour l’année scolaire complète',

  receiptSubmittedTitle: 'Le reçu de paiement a été envoyé avec succès et est en cours de vérification',
  receiptNumberLabel: 'N° du reçu :',
  statusLabel: 'Statut :',
  pendingStatus: 'PENDING_VERIFICATION (en attente)',
  verificationNotePrefix: 'Les virements postaux via',
  verificationNoteBold: 'BaridiMob / CCP',
  verificationNoteSuffix: 'sont généralement vérifiés sous peu. Ton compte sera activé automatiquement après authentification.',

  devTestLabel: 'Test rapide développeur (DEV ONLY) :',
  devApproveButton: 'Confirmer le reçu immédiatement et activer ROLE_PREMIUM',

  formTitle: 'Envoyer le reçu de paiement via BaridiMob, la carte Edahabia ou CCP',
  paymentMethodBaridimob: '📱 BaridiMob',
  paymentMethodEdahabia: '💳 Carte Edahabia',
  paymentMethodCcp: '🏛️ Compte courant postal CCP',

  accountInfoLabel: 'Informations du compte postal pour le virement ({price} DA) :',
  baridimobTag: 'BaridiMob',
  ccpNotePrefix: 'Ou le compte courant postal CCP :',
  accountNameLabel: 'Nom du compte :',

  transactionRefLabel: 'Numéro de référence ou de transaction (reçu) :',
  transactionRefPlaceholder: 'Exemple : BM-2026-987456123',

  amountLabel: 'Montant transféré :',
  amountValue: '{price} DZD (frais d’abonnement annuel)',

  receiptImageLabel: 'Image du reçu de paiement (Reçu de Paiement) :',
  uploadReceiptButton: 'Téléverser l’image du reçu depuis l’appareil',
  receiptPreviewLabel: 'Aperçu du reçu joint',

  submittingButton: 'Envoi du reçu en cours...',
  submitButton: 'Envoyer le reçu de paiement et activer (ROLE_PREMIUM)',
};

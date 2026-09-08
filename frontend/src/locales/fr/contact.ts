import type { contact as contactAr } from '../ar/contact';

export const contact: typeof contactAr = {
  typeSuggestion: '💡 Suggestion',
  typeBug: '🐞 Signaler un problème',
  typeConcern: '⚠️ Question ou préoccupation',

  modalTitle: 'Nous contacter',
  modalSubtitle: 'Tes suggestions et remarques nous aident à améliorer مَسِيد DZ',

  successTitle: 'Merci ! Ton message a été envoyé avec succès.',
  successDesc: 'Nous l’examinerons dans les plus brefs délais.',
  closeButton: 'Fermer',

  nameLabel: 'Nom',
  namePlaceholder: 'Ton nom complet',
  emailLabel: 'Adresse e-mail (ou celle d’un parent)',
  messageTypeLabel: 'Type de message',
  messageLabel: 'Ton message',
  messagePlaceholder: 'Écris ta suggestion ou ta question ici...',

  errorMessage: 'Impossible d’envoyer le message. Vérifie ta connexion Internet et réessaie.',
  sendButton: 'Envoyer le message',

  reportErrorButton: 'Signaler une erreur',
};

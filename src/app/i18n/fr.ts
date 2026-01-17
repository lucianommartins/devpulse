// DevPulse Localization - French (fr)
// Traductions naturelles pour le français

import { LocaleStrings } from './en';

export const fr: LocaleStrings = {
  // Commun
  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    add: 'Ajouter',
    loading: 'Chargement...',
    saving: 'Enregistrement...',
    validating: 'Validation...',
    error: 'Erreur',
    success: 'Succès',
    required: 'obligatoire',
    optional: 'optionnel',
    enable: 'Activer',
    disable: 'Désactiver',
    edit: 'Modifier',
    delete: 'Supprimer',
    image: 'Image',
    video: 'Vidéo',
  },

  // Authentification
  auth: {
    signIn: 'Se connecter avec Google',
    signOut: 'Se déconnecter',
    signingIn: 'Connexion...',
    domainRestriction: '⚠️ Accès restreint aux emails @google.com',
    authError: 'Échec de l\'authentification',
    notAuthenticated: 'Utilisateur non authentifié',
  },

  // Paramètres
  settings: {
    title: '⚙️ Paramètres',
    description: 'Configurez vos clés API pour utiliser DevPulse. Les clés sont stockées de manière sécurisée et liées à votre compte.',
    geminiApiKey: '🔑 Clé API Gemini',
    geminiHint: 'Obtenir sur',
    geminiLinkText: 'Google AI Studio',
    twitterBearerToken: '🐦 Token Twitter',
    twitterHint: 'Obtenir sur',
    twitterHintSuffix: '. Sans ce token, les sources Twitter seront désactivées.',
    twitterLinkText: 'Portail Développeurs Twitter',
    savedSuccess: '✅ Paramètres enregistrés !',
    saveError: 'Erreur lors de l\'enregistrement',
    geminiInvalid: 'Gemini : Clé API invalide',
    geminiValidationError: 'Gemini : Échec de la validation',
    twitterInvalid: 'Twitter : Token invalide',
    twitterValidationError: 'Twitter : Échec de la validation',
    language: 'Langue',
  },

  // Barre Latérale
  sidebar: {
    timeWindow: 'PÉRIODE',
    sources: 'SOURCES',
    addSource: 'Ajouter une source',
    editSource: 'Modifier la Source',
    newSource: 'Nouvelle Source',
    noSources: 'Aucune source ajoutée.',
    noSourcesHint: 'Cliquez sur + pour en ajouter.',
    enableAll: 'Tout activer',
    syncSources: 'Synchroniser',
    syncing: 'Synchronisation...',
    feedNamePlaceholder: 'Nom du flux',
    feedUrlPlaceholder: '@utilisateur ou URL',
    typeTwitter: 'Twitter/X',
    typeRss: 'Flux RSS',
    typeBlog: 'Blog (scraping)',
    howItWorks: 'Comment ça marche',
    howStep1: 'Synchronise les données de vos sources',
    howStep2: 'Sélectionnez les mises à jour intéressantes',
    howStep3: 'Génère un thread optimisé pour l\'engagement',
    showOnlyThis: 'Afficher uniquement cette source',
    editSource2: 'Modifier la source',
    removeSource: 'Supprimer la source',
  },

  // Panneau de Flux
  feed: {
    loadedItems: 'éléments chargés',
    markIrrelevant: 'Marquer comme non pertinent',
    noItems: 'Aucun élément pour l\'instant',
    noItemsHint: 'Synchronisez vos sources pour voir du contenu ici.',
    selectToGenerate: 'Sélectionnez des éléments et cliquez sur Générer Thread',
    hideUsedItems: 'Masquer les éléments utilisés',
    minutesAgo: 'min',
    hoursAgo: 'h',
    alsoIn: 'Aussi dans :',
  },

  // Panneau de Thread
  thread: {
    title: 'Générateur de Thread',
    noThread: 'Aucun thread généré',
    selectItems: 'Sélectionnez des éléments du flux et cliquez sur Générer',
    generateThread: '✨ Générer Thread',
    generating: 'Génération...',
    generatingViral: 'Création d\'un thread optimisé...',
    generatingHint: 'Analyse du contenu et création de tweets optimisés',
    regenerate: 'Régénérer',
    copyToClipboard: 'Copier',
    copied: 'Copié !',
    tweet: 'Tweet',
    addMedia: 'Ajouter un média',
    generatingImage: 'Génération de l\'image...',
    generatingVideo: 'Génération de la vidéo...',
    generatingVideoMinutes: 'Génération de la vidéo (cela peut prendre quelques minutes)...',
    generatingVideoProgress: 'Génération de la vidéo...',
    videoSuccess: 'Vidéo générée avec succès !',
    startingVideo: 'Démarrage de la génération vidéo...',
    urlContext: 'URLs supplémentaires pour contexte',
    urlPlaceholder: 'Collez les URLs ici, une par ligne',
    urlHint: 'Les URLs supplémentaires seront utilisées pour enrichir le thread',
    regenerateMedia: 'Régénérer le média',
    generate: 'Générer',
  },

  // Média
  media: {
    generatingImage: 'Génération de l\'image...',
    generatingVideo: 'Génération de la vidéo...',
  },

  // Erreurs
  errors: {
    geminiKeyRequired: 'Clé API Gemini non configurée. Configurez-la dans ⚙️ Paramètres.',
    twitterTokenRequired: 'Token Twitter non configuré. Configurez-le dans ⚙️ Paramètres.',
    networkError: 'Erreur de connexion. Vérifiez votre internet.',
    unknownError: 'Une erreur inattendue s\'est produite.',
  },

  // En-tête
  header: {
    poweredBy: 'Propulsé par Gemini 3.0 Flash',
    settings: 'Paramètres',
  },

  // Connexion
  login: {
    welcome: 'Bienvenue sur',
    appName: 'DevPulse',
    tagline: 'Transformez votre contenu en threads Twitter viraux',
    feature1Title: 'Multi-sources',
    feature1Desc: 'Agrégez Twitter, RSS et blogs',
    feature2Title: 'IA Avancée',
    feature2Desc: 'Générez des threads avec Gemini 3',
    feature3Title: 'Médias Visuels',
    feature3Desc: 'Créez images et vidéos avec l\'IA',
  },
};

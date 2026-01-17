// DevPulse Localization - German (de)
// Natürliche deutsche Übersetzungen

import { LocaleStrings } from './en';

export const de: LocaleStrings = {
  // Allgemein
  common: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    close: 'Schließen',
    add: 'Hinzufügen',
    loading: 'Wird geladen...',
    saving: 'Wird gespeichert...',
    validating: 'Wird validiert...',
    error: 'Fehler',
    success: 'Erfolg',
    required: 'erforderlich',
    optional: 'optional',
    enable: 'Aktivieren',
    disable: 'Deaktivieren',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    image: 'Bild',
    video: 'Video',
  },

  // Authentifizierung
  auth: {
    signIn: 'Mit Google anmelden',
    signOut: 'Abmelden',
    signingIn: 'Anmeldung läuft...',
    domainRestriction: '⚠️ Zugang nur für @google.com E-Mails',
    authError: 'Authentifizierung fehlgeschlagen',
    notAuthenticated: 'Benutzer nicht authentifiziert',
  },

  // Einstellungen
  settings: {
    title: '⚙️ Einstellungen',
    description: 'Konfigurieren Sie Ihre API-Schlüssel für DevPulse. Die Schlüssel werden sicher gespeichert und mit Ihrem Konto verknüpft.',
    geminiApiKey: '🔑 Gemini API-Schlüssel',
    geminiHint: 'Erhalten Sie ihn unter',
    geminiLinkText: 'Google AI Studio',
    twitterBearerToken: '🐦 Twitter Token',
    twitterHint: 'Erhalten Sie ihn unter',
    twitterHintSuffix: '. Ohne diesen Token werden Twitter-Quellen deaktiviert.',
    twitterLinkText: 'Twitter Developer Portal',
    savedSuccess: '✅ Einstellungen gespeichert!',
    saveError: 'Fehler beim Speichern',
    geminiInvalid: 'Gemini: Ungültiger API-Schlüssel',
    geminiValidationError: 'Gemini: Validierung fehlgeschlagen',
    twitterInvalid: 'Twitter: Ungültiges Token',
    twitterValidationError: 'Twitter: Validierung fehlgeschlagen',
    language: 'Sprache',
  },

  // Seitenleiste
  sidebar: {
    timeWindow: 'ZEITRAUM',
    sources: 'QUELLEN',
    addSource: 'Quelle hinzufügen',
    editSource: 'Quelle bearbeiten',
    newSource: 'Neue Quelle',
    noSources: 'Keine Quellen hinzugefügt.',
    noSourcesHint: 'Klicken Sie auf +, um eine hinzuzufügen.',
    enableAll: 'Alle aktivieren',
    syncSources: 'Synchronisieren',
    syncing: 'Synchronisierung...',
    feedNamePlaceholder: 'Feed-Name',
    feedUrlPlaceholder: '@Benutzername oder URL',
    typeTwitter: 'Twitter/X',
    typeRss: 'RSS-Feed',
    typeBlog: 'Blog (Scraping)',
    howItWorks: 'So funktioniert es',
    howStep1: 'Synchronisiert Daten aus Ihren Quellen',
    howStep2: 'Wählen Sie interessante Updates aus',
    howStep3: 'Generiert einen engagementoptimierten Thread',
    showOnlyThis: 'Nur diese Quelle anzeigen',
    editSource2: 'Quelle bearbeiten',
    removeSource: 'Quelle entfernen',
  },

  // Feed-Panel
  feed: {
    loadedItems: 'Elemente geladen',
    markIrrelevant: 'Als irrelevant markieren',
    noItems: 'Noch keine Elemente',
    noItemsHint: 'Synchronisieren Sie Ihre Quellen, um hier Inhalte zu sehen.',
    selectToGenerate: 'Wählen Sie Elemente aus und klicken Sie auf Thread generieren',
    hideUsedItems: 'Verwendete Elemente ausblenden',
    minutesAgo: 'Min.',
    hoursAgo: 'Std.',
    alsoIn: 'Auch in:',
  },

  // Thread-Panel
  thread: {
    title: 'Thread-Generator',
    noThread: 'Kein Thread generiert',
    selectItems: 'Wählen Sie Elemente aus dem Feed und klicken Sie auf Generieren',
    generateThread: '✨ Thread generieren',
    generating: 'Wird generiert...',
    generatingViral: 'Optimierter Thread wird erstellt...',
    generatingHint: 'Inhalt wird analysiert und optimierte Tweets werden erstellt',
    regenerate: 'Neu generieren',
    copyToClipboard: 'Kopieren',
    copied: 'Kopiert!',
    tweet: 'Tweet',
    addMedia: 'Medium hinzufügen',
    generatingImage: 'Bild wird generiert...',
    generatingVideo: 'Video wird generiert...',
    generatingVideoMinutes: 'Video wird generiert (kann einige Minuten dauern)...',
    generatingVideoProgress: 'Video wird generiert...',
    videoSuccess: 'Video erfolgreich generiert!',
    startingVideo: 'Videogenerierung wird gestartet...',
    urlContext: 'Zusätzliche URLs für Kontext',
    urlPlaceholder: 'URLs hier einfügen, eine pro Zeile',
    urlHint: 'Zusätzliche URLs werden verwendet, um den Thread zu bereichern',
    regenerateMedia: 'Medium neu generieren',
    generate: 'Generieren',
  },

  // Medien
  media: {
    generatingImage: 'Bild wird generiert...',
    generatingVideo: 'Video wird generiert...',
  },

  // Fehler
  errors: {
    geminiKeyRequired: 'Gemini API-Schlüssel nicht konfiguriert. Konfigurieren Sie ihn in ⚙️ Einstellungen.',
    twitterTokenRequired: 'Twitter Token nicht konfiguriert. Konfigurieren Sie es in ⚙️ Einstellungen.',
    networkError: 'Verbindungsfehler. Überprüfen Sie Ihre Internetverbindung.',
    unknownError: 'Ein unerwarteter Fehler ist aufgetreten.',
  },

  // Kopfzeile
  header: {
    poweredBy: 'Powered by Gemini 3.0 Flash',
    settings: 'Einstellungen',
  },

  // Anmeldung
  login: {
    welcome: 'Willkommen bei',
    appName: 'DevPulse',
    tagline: 'Verwandeln Sie Inhalte in ansprechende Twitter-Threads',
    feature1Title: 'Multi-Quellen',
    feature1Desc: 'Aggregieren Sie Twitter, RSS und Blogs',
    feature2Title: 'Fortschrittliche KI',
    feature2Desc: 'Generieren Sie Threads mit Gemini 3',
    feature3Title: 'Visuelle Medien',
    feature3Desc: 'Erstellen Sie Bilder und Videos mit KI',
  },
};

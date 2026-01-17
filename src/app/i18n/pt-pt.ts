// DevPulse Localization - European Portuguese (pt-PT)
// Traduções naturais para português de Portugal

import { LocaleStrings } from './en';

export const ptPT: LocaleStrings = {
  // Comum
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Fechar',
    add: 'Adicionar',
    loading: 'A carregar...',
    saving: 'A guardar...',
    validating: 'A validar...',
    error: 'Erro',
    success: 'Sucesso',
    required: 'obrigatório',
    optional: 'opcional',
    enable: 'Ativar',
    disable: 'Desativar',
    edit: 'Editar',
    delete: 'Eliminar',
    image: 'Imagem',
    video: 'Vídeo',
  },

  // Autenticação
  auth: {
    signIn: 'Iniciar sessão com Google',
    signOut: 'Terminar sessão',
    signingIn: 'A iniciar sessão...',
    domainRestriction: '⚠️ Acesso restrito a emails @google.com',
    authError: 'Falha na autenticação',
    notAuthenticated: 'Utilizador não autenticado',
  },

  // Definições
  settings: {
    title: '⚙️ Definições',
    description: 'Configure as suas chaves de API para utilizar o DevPulse. As chaves são armazenadas de forma segura e associadas à sua conta.',
    geminiApiKey: '🔑 Chave da API Gemini',
    geminiHint: 'Obtenha em',
    geminiLinkText: 'Google AI Studio',
    twitterBearerToken: '🐦 Token do Twitter',
    twitterHint: 'Obtenha em',
    twitterHintSuffix: '. Sem este token, as fontes do Twitter ficam desativadas.',
    twitterLinkText: 'Portal de Programadores do Twitter',
    savedSuccess: '✅ Definições guardadas!',
    saveError: 'Erro ao guardar definições',
    geminiInvalid: 'Gemini: Chave de API inválida',
    geminiValidationError: 'Gemini: Falha na validação',
    twitterInvalid: 'Twitter: Token inválido',
    twitterValidationError: 'Twitter: Falha na validação',
    language: 'Idioma',
  },

  // Barra Lateral
  sidebar: {
    timeWindow: 'PERÍODO',
    sources: 'FONTES',
    addSource: 'Adicionar fonte',
    editSource: 'Editar Fonte',
    newSource: 'Nova Fonte',
    noSources: 'Nenhuma fonte adicionada.',
    noSourcesHint: 'Clique no + para adicionar.',
    enableAll: 'Ativar todas',
    syncSources: 'Sincronizar',
    syncing: 'A sincronizar...',
    feedNamePlaceholder: 'Nome do feed',
    feedUrlPlaceholder: '@utilizador ou URL',
    typeTwitter: 'Twitter/X',
    typeRss: 'Feed RSS',
    typeBlog: 'Blogue (scraping)',
    howItWorks: 'Como funciona',
    howStep1: 'Sincroniza dados das suas fontes',
    howStep2: 'Selecione as atualizações interessantes',
    howStep3: 'Gera uma thread otimizada para envolvimento',
    showOnlyThis: 'Mostrar apenas esta fonte',
    editSource2: 'Editar fonte',
    removeSource: 'Remover fonte',
  },

  // Painel de Feed
  feed: {
    loadedItems: 'itens carregados',
    markIrrelevant: 'Marcar como irrelevante',
    noItems: 'Sem itens ainda',
    noItemsHint: 'Sincronize as suas fontes para ver conteúdo aqui.',
    selectToGenerate: 'Selecione itens e clique em Gerar Thread',
    hideUsedItems: 'Ocultar itens utilizados',
    minutesAgo: 'min atrás',
    hoursAgo: 'h atrás',
    alsoIn: 'Também em:',
  },

  // Painel de Thread
  thread: {
    title: 'Gerador de Thread',
    noThread: 'Nenhuma thread gerada',
    selectItems: 'Selecione itens do feed e clique em Gerar',
    generateThread: '✨ Gerar Thread',
    generating: 'A gerar...',
    generatingViral: 'A criar thread otimizada...',
    generatingHint: 'A analisar conteúdo e a criar tweets otimizados',
    regenerate: 'Regenerar',
    copyToClipboard: 'Copiar',
    copied: 'Copiado!',
    tweet: 'Tweet',
    addMedia: 'Adicionar multimédia',
    generatingImage: 'A gerar imagem...',
    generatingVideo: 'A gerar vídeo...',
    generatingVideoMinutes: 'A gerar vídeo (pode demorar alguns minutos)...',
    generatingVideoProgress: 'A gerar vídeo...',
    videoSuccess: 'Vídeo gerado com sucesso!',
    startingVideo: 'A iniciar geração do vídeo...',
    urlContext: 'URLs adicionais para contexto',
    urlPlaceholder: 'Cole URLs aqui, um por linha',
    urlHint: 'URLs adicionais serão utilizados para enriquecer a thread',
    regenerateMedia: 'Regenerar multimédia',
    generate: 'Gerar',
  },

  // Multimédia
  media: {
    generatingImage: 'A gerar imagem...',
    generatingVideo: 'A gerar vídeo...',
  },

  // Erros
  errors: {
    geminiKeyRequired: 'Chave da API Gemini não configurada. Configure em ⚙️ Definições.',
    twitterTokenRequired: 'Token do Twitter não configurado. Configure em ⚙️ Definições.',
    networkError: 'Erro de ligação. Verifique a sua internet.',
    unknownError: 'Ocorreu um erro inesperado.',
  },

  // Cabeçalho
  header: {
    poweredBy: 'Powered by Gemini 3.0 Flash',
    settings: 'Definições',
  },

  // Início de Sessão
  login: {
    welcome: 'Bem-vindo ao',
    appName: 'DevPulse',
    tagline: 'Transforme conteúdo em threads virais para o Twitter',
    feature1Title: 'Multi-fonte',
    feature1Desc: 'Agregue Twitter, RSS e blogues',
    feature2Title: 'IA Avançada',
    feature2Desc: 'Gere threads com Gemini 3',
    feature3Title: 'Multimédia',
    feature3Desc: 'Crie imagens e vídeos com IA',
  },
};

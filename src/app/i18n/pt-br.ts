// DevPulse Localization - Brazilian Portuguese (pt-BR)
// Traduções naturais para português brasileiro

import { LocaleStrings } from './en';

export const ptBR: LocaleStrings = {
  // Comum
  common: {
    save: 'Salvar',
    cancel: 'Cancelar',
    close: 'Fechar',
    add: 'Adicionar',
    loading: 'Carregando...',
    saving: 'Salvando...',
    validating: 'Validando...',
    error: 'Erro',
    success: 'Sucesso',
    required: 'obrigatório',
    optional: 'opcional',
    enable: 'Ativar',
    disable: 'Desativar',
    edit: 'Editar',
    delete: 'Excluir',
    image: 'Imagem',
    video: 'Vídeo',
  },

  // Autenticação
  auth: {
    signIn: 'Entrar com Google',
    signOut: 'Sair',
    signingIn: 'Entrando...',
    domainRestriction: '⚠️ Acesso restrito a emails @google.com',
    authError: 'Falha na autenticação',
    notAuthenticated: 'Usuário não autenticado',
  },

  // Configurações
  settings: {
    title: '⚙️ Configurações',
    description: 'Configure suas chaves de API para usar o DevPulse. As chaves são armazenadas de forma segura e vinculadas à sua conta.',
    geminiApiKey: '🔑 Chave da API Gemini',
    geminiHint: 'Obtenha em',
    geminiLinkText: 'Google AI Studio',
    twitterBearerToken: '🐦 Token do Twitter',
    twitterHint: 'Obtenha em',
    twitterHintSuffix: '. Sem esse token, fontes do Twitter ficam desabilitadas.',
    twitterLinkText: 'Portal de Desenvolvedores do Twitter',
    savedSuccess: '✅ Configurações salvas!',
    saveError: 'Erro ao salvar configurações',
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
    syncing: 'Sincronizando...',
    feedNamePlaceholder: 'Nome do feed',
    feedUrlPlaceholder: '@usuario ou URL',
    typeTwitter: 'Twitter/X',
    typeRss: 'Feed RSS',
    typeBlog: 'Blog (scraping)',
    howItWorks: 'Como funciona',
    howStep1: 'Sincroniza dados das suas fontes',
    howStep2: 'Selecione as atualizações interessantes',
    howStep3: 'Gera uma thread otimizada para engajamento',
    showOnlyThis: 'Mostrar apenas esta fonte',
    editSource2: 'Editar fonte',
    removeSource: 'Remover fonte',
  },

  // Painel de Feed
  feed: {
    loadedItems: 'itens carregados',
    markIrrelevant: 'Marcar como irrelevante',
    noItems: 'Nenhum item ainda',
    noItemsHint: 'Sincronize suas fontes para ver conteúdo aqui.',
    selectToGenerate: 'Selecione itens e clique em Gerar Thread',
    hideUsedItems: 'Ocultar itens usados',
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
    generating: 'Gerando...',
    generatingViral: 'Criando thread otimizada...',
    generatingHint: 'Analisando conteúdo e criando tweets otimizados',
    regenerate: 'Regenerar',
    copyToClipboard: 'Copiar',
    copied: 'Copiado!',
    tweet: 'Tweet',
    addMedia: 'Adicionar mídia',
    generatingImage: 'Gerando imagem...',
    generatingVideo: 'Gerando vídeo...',
    generatingVideoMinutes: 'Gerando vídeo (pode levar alguns minutos)...',
    generatingVideoProgress: 'Gerando vídeo...',
    videoSuccess: 'Vídeo gerado com sucesso!',
    startingVideo: 'Iniciando geração do vídeo...',
    urlContext: 'URLs adicionais para contexto',
    urlPlaceholder: 'Cole URLs aqui, uma por linha',
    urlHint: 'URLs adicionais serão usadas para enriquecer a thread',
    regenerateMedia: 'Regenerar mídia',
    generate: 'Gerar',
  },

  // Mídia
  media: {
    generatingImage: 'Gerando imagem...',
    generatingVideo: 'Gerando vídeo...',
  },

  // Erros
  errors: {
    geminiKeyRequired: 'Chave da API Gemini não configurada. Configure em ⚙️ Configurações.',
    twitterTokenRequired: 'Token do Twitter não configurado. Configure em ⚙️ Configurações.',
    networkError: 'Erro de conexão. Verifique sua internet.',
    unknownError: 'Ocorreu um erro inesperado.',
  },

  // Cabeçalho
  header: {
    poweredBy: 'Powered by Gemini 3.0 Flash',
    settings: 'Configurações',
  },

  // Login
  login: {
    welcome: 'Bem-vindo ao',
    appName: 'DevPulse',
    tagline: 'Transforme conteúdo em threads virais para o Twitter',
    feature1Title: 'Multi-fonte',
    feature1Desc: 'Agregue Twitter, RSS e blogs',
    feature2Title: 'IA Avançada',
    feature2Desc: 'Gere threads com Gemini 3',
    feature3Title: 'Mídia Visual',
    feature3Desc: 'Crie imagens e vídeos com IA',
  },
};

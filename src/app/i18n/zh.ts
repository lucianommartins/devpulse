// DevPulse Localization - Simplified Chinese (zh)
// 简体中文翻译

import { LocaleStrings } from './en';

export const zh: LocaleStrings = {
  // 通用
  common: {
    save: '保存',
    cancel: '取消',
    close: '关闭',
    add: '添加',
    loading: '加载中...',
    saving: '保存中...',
    validating: '验证中...',
    error: '错误',
    success: '成功',
    required: '必填',
    optional: '可选',
    enable: '启用',
    disable: '禁用',
    edit: '编辑',
    delete: '删除',
    image: '图片',
    video: '视频',
  },

  // 认证
  auth: {
    signIn: '使用 Google 登录',
    signOut: '退出登录',
    signingIn: '登录中...',
    domainRestriction: '⚠️ 仅限 @google.com 邮箱访问',
    authError: '认证失败',
    notAuthenticated: '用户未认证',
  },

  // 设置
  settings: {
    title: '⚙️ 设置',
    description: '配置您的 API 密钥以使用 DevPulse。密钥将安全存储并与您的账户关联。',
    geminiApiKey: '🔑 Gemini API 密钥',
    geminiHint: '在此获取',
    geminiLinkText: 'Google AI Studio',
    twitterBearerToken: '🐦 Twitter 令牌',
    twitterHint: '在此获取',
    twitterHintSuffix: '。无此令牌将禁用 Twitter 来源。',
    twitterLinkText: 'Twitter 开发者门户',
    savedSuccess: '✅ 设置已保存！',
    saveError: '保存设置失败',
    geminiInvalid: 'Gemini：API 密钥无效',
    geminiValidationError: 'Gemini：验证失败',
    twitterInvalid: 'Twitter：令牌无效',
    twitterValidationError: 'Twitter：验证失败',
    language: '语言',
  },

  // 侧边栏
  sidebar: {
    timeWindow: '时间范围',
    sources: '来源',
    addSource: '添加来源',
    editSource: '编辑来源',
    newSource: '新建来源',
    noSources: '暂无来源',
    noSourcesHint: '点击 + 添加来源',
    enableAll: '全部启用',
    syncSources: '同步',
    syncing: '同步中...',
    feedNamePlaceholder: '订阅名称',
    feedUrlPlaceholder: '@用户名或网址',
    typeTwitter: 'Twitter/X',
    typeRss: 'RSS 订阅',
    typeBlog: '博客（抓取）',
    howItWorks: '使用说明',
    howStep1: '从您的来源同步数据',
    howStep2: '选择感兴趣的更新',
    howStep3: '生成病毒式传播的推文串',
    showOnlyThis: '仅显示此来源',
    editSource2: '编辑来源',
    removeSource: '移除来源',
  },

  // 信息流面板
  feed: {
    loadedItems: '条已加载',
    markIrrelevant: '标记为不相关',
    noItems: '暂无内容',
    noItemsHint: '同步您的来源以在此查看内容',
    selectToGenerate: '选择项目并点击生成推文串',
    hideUsedItems: '隐藏已使用项目',
    minutesAgo: '分钟前',
    hoursAgo: '小时前',
    alsoIn: '同时在：',
  },

  // 推文串面板
  thread: {
    title: '推文串生成器',
    noThread: '尚未生成推文串',
    selectItems: '从信息流中选择项目并点击生成',
    generateThread: '✨ 生成推文串',
    generating: '生成中...',
    generatingViral: '正在创建优化推文串...',
    generatingHint: '正在分析内容并创建优化推文',
    regenerate: '重新生成',
    copyToClipboard: '复制',
    copied: '已复制！',
    tweet: '推文',
    addMedia: '添加媒体',
    generatingImage: '生成图片中...',
    generatingVideo: '生成视频中...',
    generatingVideoMinutes: '生成视频中（可能需要几分钟）...',
    generatingVideoProgress: '生成视频中...',
    videoSuccess: '视频生成成功！',
    startingVideo: '开始生成视频...',
    urlContext: '补充网址作为上下文',
    urlPlaceholder: '在此粘贴网址，每行一个',
    urlHint: '补充网址将用于丰富推文串内容',
    regenerateMedia: '重新生成媒体',
    generate: '生成',
  },

  // 媒体
  media: {
    generatingImage: '生成图片中...',
    generatingVideo: '生成视频中...',
  },

  // 错误
  errors: {
    geminiKeyRequired: 'Gemini API 密钥未配置。请在 ⚙️ 设置中配置。',
    twitterTokenRequired: 'Twitter 令牌未配置。请在 ⚙️ 设置中配置。',
    networkError: '网络错误。请检查您的网络连接。',
    unknownError: '发生意外错误。',
  },

  // 页头
  header: {
    poweredBy: '由 Gemini 3.0 Flash 驱动',
    settings: '设置',
  },

  // 登录
  login: {
    welcome: '欢迎使用',
    appName: 'DevPulse',
    tagline: '将内容转化为病毒式 Twitter 推文串',
    feature1Title: '多来源',
    feature1Desc: '聚合 Twitter、RSS 和博客',
    feature2Title: 'AI 驱动',
    feature2Desc: '使用 Gemini 3 生成推文串',
    feature3Title: '视觉媒体',
    feature3Desc: '用 AI 创建图片和视频',
  },
};

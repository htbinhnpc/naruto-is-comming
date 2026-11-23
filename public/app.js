const STATUS_META = {
  new: { label: 'Chưa đăng nhập', className: 'badge-new' },
  active: { label: 'Hoạt động', className: 'badge-active' },
  error: { label: 'Lỗi', className: 'badge-error' },
  disabled: { label: 'Đã tắt', className: 'badge-disabled' },
};

const LEVEL_META = {
  success: { label: 'Thành công', className: 'log-level-success' },
  info: { label: 'Thông tin', className: 'log-level-info' },
  warn: { label: 'Cảnh báo', className: 'log-level-warn' },
  error: { label: 'Lỗi', className: 'log-level-error' },
};

const ACTION_LABELS = {
  'account.create': 'Thêm tài khoản',
  'account.update': 'Sửa tài khoản',
  'account.delete': 'Xóa tài khoản',
  'account.toggle': 'Bật/tắt tài khoản',
  'account.auto': 'Auto',
  'session.login': 'Đăng nhập',
  'session.logout': 'Đăng xuất',
  'session.sync': 'Đồng bộ',
  'daily.claim': 'Nhận thưởng',
  'daily.claim_all': 'Nhận tất cả',
  'team.apply': 'Đội hình',
  'bag.use_item': 'Dùng vật phẩm',
  'bag.team': 'Đổi ninja',
  'bag.equip': 'Trang bị',
  'gacha.draw': 'Quay ninja',
  'craftment.upgrade': 'Nâng cấp',
  'story.run': 'Cốt truyện',
  'story.item': 'Dùng vật phẩm',
  'training.cave': 'Động huấn luyện',
  'training.ultimate': 'Thử thách tối thượng',
  'training.ultimate_claim': 'Nhận thưởng Ultimate',
  'boss.beast': 'Vĩ Thú',
  'boss.guild': 'Guild Boss',
  'pvp.rank': 'Đấu Rank',
  'pvp.plunder': 'Cướp vàng',
};

const ELEMENT_META = {
  1: { name: 'Hỏa', icon: '/assets/attribute/1.png' },
  2: { name: 'Phong', icon: '/assets/attribute/2.png' },
  3: { name: 'Thủy', icon: '/assets/attribute/3.png' },
  4: { name: 'Lôi', icon: '/assets/attribute/4.png' },
  5: { name: 'Thổ', icon: '/assets/attribute/5.png' },
};

const TIER_META = {
  0: { name: 'Thường', className: '' },
  1: { name: 'Super', className: 'tier-super' },
  2: { name: 'Kage', className: 'tier-kage' },
};

const ROLE_META = {
  atk: { name: 'Công', className: 'role-atk' },
  def: { name: 'Thủ', className: 'role-def' },
};

const ICONS = {
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="3.4"/><path d="M4.8 20c.7-3.6 3.6-5.6 7.2-5.6s6.5 2 7.2 5.6"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.2-2.8 7.3-7 9-4.2-1.7-7-4.8-7-9V6z"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
  coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 7.5v9M9.5 9.5h5M9.5 14.5h5"/></svg>',
  gem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M7 3h10l4 6-9 12L3 9z"/><path d="M3 9h18M12 21L8 9l3-6M12 21l4-12-3-6"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3M12 13v5M8 21h8M9.5 18h5"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v5h-5"/></svg>',
  dots: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/></svg>',
  login: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h5v16h-5"/><path d="M10 8l4 4-4 4M14 12H4"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4H5v16h5"/><path d="M14 8l4 4-4 4M18 12H8"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="9" width="17" height="11" rx="2"/><path d="M3 13h18M12 9v11M12 9C9 9 6.5 8 6.5 5.8 6.5 4.2 7.8 3 9.3 3 11.4 3 12 6 12 9zM12 9c3 0 5.5-1 5.5-3.2C17.5 4.2 16.2 3 14.7 3 12.6 3 12 6 12 9z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.5l3.5 2"/></svg>',
  tasks: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5h11M9 12h11M9 19h11"/><path d="M4 5l1.3 1.3L7.5 4M4 12l1.3 1.3L7.5 11M4 19l1.3 1.3L7.5 18"/></svg>',
  wheel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2"/><path d="M12 3.5v5M12 15.5v5M3.5 12h5M15.5 12h5M6 6l3.2 3.2M14.8 14.8L18 18M18 6l-3.2 3.2M9.2 14.8L6 18"/></svg>',
  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 6v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-6z"/><path d="M9 8v1M9 12v1M9 16v1"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3.5l2.7 5.5 6 .9-4.35 4.25 1.03 6-5.38-2.83L6.6 20.2l1.03-6L3.3 9.9l6-.9z"/></svg>',
  paw: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="15.5" rx="5" ry="4"/><circle cx="6" cy="10" r="1.8"/><circle cx="10" cy="6.6" r="1.8"/><circle cx="14" cy="6.6" r="1.8"/><circle cx="18" cy="10" r="1.8"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-4v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3v-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3.1V3h4v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1H21v4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5L2.8 19.5h18.4z"/><path d="M12 9v5M12 17h.01"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M14 7l5 5-5 5"/></svg>',
  max: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  hammer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4.5l5 5M4 20l4.5-1 10-10-3.5-3.5-10 10z"/><path d="M13 7l4 4"/></svg>',
};

const state = {
  view: 'accounts',
  accountId: null,
  accounts: [],
  stats: { total: 0, new: 0, active: 0, error: 0, disabled: 0, auto: 0 },
  query: '',
  status: 'all',
  editingId: null,
  deletingId: null,
  pending: new Map(),
  daily: {
    accountId: null,
    data: null,
    loadedAt: 0,
    loading: false,
    loadingAccountId: null,
    error: null,
    pendingFeature: null,
    claimingAll: false,
    lastBatch: null,
  },
  dashboard: {
    accountId: null,
    data: null,
    loadedAt: 0,
    loading: false,
    loadingAccountId: null,
    error: null,
  },
  logs: {
    items: [],
    total: 0,
    offset: 0,
    loading: false,
    loaded: false,
    accountId: 'all',
    level: '',
  },
  team: {
    accountId: null,
    data: null,
    loadedAt: 0,
    loading: false,
    loadingAccountId: null,
    error: null,
    mode: 'atk',
    plan: null,
    planLoading: false,
    applying: false,
    lastResult: null,
  },
  bag: {
    accountId: null,
    data: null,
    loadedAt: 0,
    loading: false,
    loadingAccountId: null,
    error: null,
    tab: 'ninja',
    busy: false,
    action: null,
  },
  craftment: {
    type: 'ninja',
    mode: 'safe',
    maxSteps: 20,
    selectedFuel: new Set(),
    data: null,
    fuelData: null,
    targetId: null,
    loadedAt: 0,
    loading: false,
    loadingFuel: false,
    error: null,
    running: false,
    result: null,
    confirm: null,
  },
  gacha: {
    accountId: null,
    data: null,
    loadedAt: 0,
    loading: false,
    loadingAccountId: null,
    error: null,
    running: false,
    result: null,
    confirm: null,
  },
  training: {
    accountId: null,
    tab: 'story',
    story: null,
    data: null,
    loadedAt: 0,
    loading: false,
    loadingAccountId: null,
    error: null,
    storyMode: 'farm',
    storyScid: 0,
    storyMaxRuns: '0',
    storyUseItems: false,
    suggestMode: 'exp',
    dungeonCave: 1,
    dungeonMode: 1,
    dungeonTier: 0,
    dungeonStageNo: 0,
    dungeonMaxRuns: '0',
    ultimateMode: 1,
    ultimateStar: 1,
    ultimateMaxRuns: '0',
    running: false,
    abort: false,
    confirm: null,
    storyResult: null,
    dungeonResult: null,
    ultimateResult: null,
  },
  boss: {
    accountId: null,
    loading: false,
    error: null,
    data: null,
    readAtMs: 0,
    running: false,
    abort: false,
    mode: null,
    progress: null,
    beastResult: null,
    guildResult: null,
    confirm: null,
  },
  pvp: {
    accountId: null,
    loading: false,
    error: null,
    data: null,
    readAtMs: 0,
    running: false,
    abort: false,
    mode: null,
    plan: null,
    progress: null,
    rankResult: null,
    plunderResult: null,
    confirm: null,
  },
  advisor: {
    data: null,
    loading: false,
    scanning: false,
    error: null,
    accountId: null,
    loadedAt: 0,
  },
  bot: {
    data: null,
    loading: false,
    saving: false,
    busy: false,
    error: null,
    loadedAt: 0,
    timer: null,
    dirty: false,
  },
};

const els = {
  views: {
    accounts: document.getElementById('view-accounts'),
    dashboard: document.getElementById('view-dashboard'),
    daily: document.getElementById('view-daily'),
    training: document.getElementById('view-training'),
    boss: document.getElementById('view-boss'),
    pvp: document.getElementById('view-pvp'),
    team: document.getElementById('view-team'),
    bag: document.getElementById('view-bag'),
    gacha: document.getElementById('view-gacha'),
    craftment: document.getElementById('view-craftment'),
    logs: document.getElementById('view-logs'),
    advisor: document.getElementById('view-advisor'),
    bot: document.getElementById('view-bot'),
  },
  navItems: [...document.querySelectorAll('.nav-item[data-view]')],
  globalAccountBar: document.getElementById('globalAccountBar'),
  grid: document.getElementById('accountGrid'),
  empty: document.getElementById('emptyState'),
  emptyTitle: document.getElementById('emptyTitle'),
  emptyText: document.getElementById('emptyText'),
  search: document.getElementById('search'),
  filters: document.getElementById('filters'),
  resultCount: document.getElementById('resultCount'),
  statTotal: document.getElementById('statTotal'),
  statActive: document.getElementById('statActive'),
  statAuto: document.getElementById('statAuto'),
  statNew: document.getElementById('statNew'),
  statProblem: document.getElementById('statProblem'),
  sideTotal: document.getElementById('sideTotal'),
  accountDialog: document.getElementById('accountDialog'),
  accountForm: document.getElementById('accountForm'),
  dialogTitle: document.getElementById('dialogTitle'),
  passwordLabel: document.getElementById('passwordLabel'),
  passwordHint: document.getElementById('passwordHint'),
  formError: document.getElementById('formError'),
  btnSave: document.getElementById('btnSave'),
  confirmDialog: document.getElementById('confirmDialog'),
  confirmText: document.getElementById('confirmText'),
  toasts: document.getElementById('toasts'),
  dailySynced: document.getElementById('dailySynced'),
  dailySummary: document.getElementById('dailySummary'),
  dailyList: document.getElementById('dailyList'),
  dailyEmpty: document.getElementById('dailyEmpty'),
  dailyEmptyTitle: document.getElementById('dailyEmptyTitle'),
  dailyEmptyText: document.getElementById('dailyEmptyText'),
  dailyFoot: document.getElementById('dailyFoot'),
  btnDailyRefresh: document.getElementById('btnDailyRefresh'),
  btnClaimAll: document.getElementById('btnClaimAll'),
  dashboardSynced: document.getElementById('dashboardSynced'),
  dashboardBody: document.getElementById('dashboardBody'),
  dashboardEmpty: document.getElementById('dashboardEmpty'),
  dashboardEmptyTitle: document.getElementById('dashboardEmptyTitle'),
  dashboardEmptyText: document.getElementById('dashboardEmptyText'),
  dashboardFoot: document.getElementById('dashboardFoot'),
  btnDashboardRefresh: document.getElementById('btnDashboardRefresh'),
  logLevel: document.getElementById('logLevel'),
  logCount: document.getElementById('logCount'),
  logList: document.getElementById('logList'),
  logEmpty: document.getElementById('logEmpty'),
  logFoot: document.getElementById('logFoot'),
  btnLogRefresh: document.getElementById('btnLogRefresh'),
  btnLogMore: document.getElementById('btnLogMore'),
  teamMode: document.getElementById('teamMode'),
  teamSynced: document.getElementById('teamSynced'),
  teamSummary: document.getElementById('teamSummary'),
  teamSlots: document.getElementById('teamSlots'),
  teamEmpty: document.getElementById('teamEmpty'),
  teamEmptyTitle: document.getElementById('teamEmptyTitle'),
  teamEmptyText: document.getElementById('teamEmptyText'),
  teamPlan: document.getElementById('teamPlan'),
  teamFoot: document.getElementById('teamFoot'),
  btnTeamRefresh: document.getElementById('btnTeamRefresh'),
  btnStrongest: document.getElementById('btnStrongest'),
  ninjaDialog: document.getElementById('ninjaDialog'),
  ninjaDialogTitle: document.getElementById('ninjaDialogTitle'),
  ninjaDetail: document.getElementById('ninjaDetail'),
  teamApplyDialog: document.getElementById('teamApplyDialog'),
  teamApplyText: document.getElementById('teamApplyText'),
  btnConfirmTeamApply: document.getElementById('btnConfirmTeamApply'),
  bagTabs: document.getElementById('bagTabs'),
  bagSynced: document.getElementById('bagSynced'),
  bagCurrency: document.getElementById('bagCurrency'),
  bagGrid: document.getElementById('bagGrid'),
  bagEmpty: document.getElementById('bagEmpty'),
  bagEmptyTitle: document.getElementById('bagEmptyTitle'),
  bagEmptyText: document.getElementById('bagEmptyText'),
  bagFoot: document.getElementById('bagFoot'),
  btnBagRefresh: document.getElementById('btnBagRefresh'),
  bagActionDialog: document.getElementById('bagActionDialog'),
  bagActionTitle: document.getElementById('bagActionTitle'),
  bagActionBody: document.getElementById('bagActionBody'),
  btnBagActionConfirm: document.getElementById('btnBagActionConfirm'),
  btnCraftRefresh: document.getElementById('btnCraftRefresh'),
  craftTabs: document.getElementById('craftTabs'),
  craftSynced: document.getElementById('craftSynced'),
  craftSummary: document.getElementById('craftSummary'),
  craftTargets: document.getElementById('craftTargets'),
  craftDetail: document.getElementById('craftDetail'),
  craftEmpty: document.getElementById('craftEmpty'),
  craftEmptyTitle: document.getElementById('craftEmptyTitle'),
  craftEmptyText: document.getElementById('craftEmptyText'),
  craftFoot: document.getElementById('craftFoot'),
  craftConfirmDialog: document.getElementById('craftConfirmDialog'),
  craftConfirmBody: document.getElementById('craftConfirmBody'),
  btnCraftConfirm: document.getElementById('btnCraftConfirm'),
  btnGachaRefresh: document.getElementById('btnGachaRefresh'),
  gachaSynced: document.getElementById('gachaSynced'),
  gachaSummary: document.getElementById('gachaSummary'),
  gachaForm: document.getElementById('gachaForm'),
  gachaDraws: document.getElementById('gachaDraws'),
  gachaAfford: document.getElementById('gachaAfford'),
  btnGachaDraw: document.getElementById('btnGachaDraw'),
  gachaResults: document.getElementById('gachaResults'),
  gachaEmpty: document.getElementById('gachaEmpty'),
  gachaEmptyTitle: document.getElementById('gachaEmptyTitle'),
  gachaEmptyText: document.getElementById('gachaEmptyText'),
  gachaFoot: document.getElementById('gachaFoot'),
  gachaConfirmDialog: document.getElementById('gachaConfirmDialog'),
  gachaConfirmBody: document.getElementById('gachaConfirmBody'),
  btnGachaConfirm: document.getElementById('btnGachaConfirm'),
  btnTrainingRefresh: document.getElementById('btnTrainingRefresh'),
  trainingTabs: document.getElementById('trainingTabs'),
  trainingSynced: document.getElementById('trainingSynced'),
  trainingStory: document.getElementById('trainingStory'),
  trainingDungeon: document.getElementById('trainingDungeon'),
  trainingUltimate: document.getElementById('trainingUltimate'),
  trainingEmpty: document.getElementById('trainingEmpty'),
  trainingEmptyTitle: document.getElementById('trainingEmptyTitle'),
  trainingEmptyText: document.getElementById('trainingEmptyText'),
  trainingFoot: document.getElementById('trainingFoot'),
  trainingConfirmDialog: document.getElementById('trainingConfirmDialog'),
  trainingConfirmTitle: document.getElementById('trainingConfirmTitle'),
  trainingConfirmBody: document.getElementById('trainingConfirmBody'),
  btnTrainingConfirm: document.getElementById('btnTrainingConfirm'),
  btnBossRefresh: document.getElementById('btnBossRefresh'),
  bossSynced: document.getElementById('bossSynced'),
  bossSummary: document.getElementById('bossSummary'),
  bossEmpty: document.getElementById('bossEmpty'),
  bossEmptyTitle: document.getElementById('bossEmptyTitle'),
  bossEmptyText: document.getElementById('bossEmptyText'),
  bossLoading: document.getElementById('bossLoading'),
  bossError: document.getElementById('bossError'),
  bossState: document.getElementById('bossState'),
  bossFoot: document.getElementById('bossFoot'),
  bossBeastCard: document.getElementById('bossBeastCard'),
  bossBeastEmpty: document.getElementById('bossBeastEmpty'),
  bossBeastContent: document.getElementById('bossBeastContent'),
  bossBeastPortrait: document.getElementById('bossBeastPortrait'),
  bossBeastName: document.getElementById('bossBeastName'),
  bossBeastStatus: document.getElementById('bossBeastStatus'),
  bossBeastMeta: document.getElementById('bossBeastMeta'),
  bossBeastCountdown: document.getElementById('bossBeastCountdown'),
  bossBeastHp: document.getElementById('bossBeastHp'),
  bossBeastHpBar: document.getElementById('bossBeastHpBar'),
  bossBeastStats: document.getElementById('bossBeastStats'),
  bossBeastDirection: document.getElementById('bossBeastDirection'),
  bossBeastHits: document.getElementById('bossBeastHits'),
  bossBeastRun: document.getElementById('bossBeastRun'),
  bossBeastStop: document.getElementById('bossBeastStop'),
  bossBeastProgress: document.getElementById('bossBeastProgress'),
  bossBeastProgressLabel: document.getElementById('bossBeastProgressLabel'),
  bossBeastProgressNext: document.getElementById('bossBeastProgressNext'),
  bossBeastProgressBar: document.getElementById('bossBeastProgressBar'),
  bossBeastProgressHint: document.getElementById('bossBeastProgressHint'),
  bossBeastResult: document.getElementById('bossBeastResult'),
  bossBeastRank: document.getElementById('bossBeastRank'),
  bossGuildCard: document.getElementById('bossGuildCard'),
  bossGuildEmpty: document.getElementById('bossGuildEmpty'),
  bossGuildEmptyTitle: document.getElementById('bossGuildEmptyTitle'),
  bossGuildEmptyText: document.getElementById('bossGuildEmptyText'),
  bossGuildContent: document.getElementById('bossGuildContent'),
  bossGuildPortrait: document.getElementById('bossGuildPortrait'),
  bossGuildName: document.getElementById('bossGuildName'),
  bossGuildStatus: document.getElementById('bossGuildStatus'),
  bossGuildMeta: document.getElementById('bossGuildMeta'),
  bossGuildHp: document.getElementById('bossGuildHp'),
  bossGuildHpBar: document.getElementById('bossGuildHpBar'),
  bossGuildStats: document.getElementById('bossGuildStats'),
  bossGuildRewards: document.getElementById('bossGuildRewards'),
  bossGuildHits: document.getElementById('bossGuildHits'),
  bossGuildRun: document.getElementById('bossGuildRun'),
  bossGuildStop: document.getElementById('bossGuildStop'),
  bossGuildProgress: document.getElementById('bossGuildProgress'),
  bossGuildProgressLabel: document.getElementById('bossGuildProgressLabel'),
  bossGuildProgressNext: document.getElementById('bossGuildProgressNext'),
  bossGuildProgressBar: document.getElementById('bossGuildProgressBar'),
  bossGuildProgressHint: document.getElementById('bossGuildProgressHint'),
  bossGuildResult: document.getElementById('bossGuildResult'),
  bossGuildRank: document.getElementById('bossGuildRank'),
  bossConfirmDialog: document.getElementById('bossConfirmDialog'),
  bossConfirmTitle: document.getElementById('bossConfirmTitle'),
  bossConfirmBody: document.getElementById('bossConfirmBody'),
  btnBossConfirm: document.getElementById('btnBossConfirm'),
  btnPvpRefresh: document.getElementById('btnPvpRefresh'),
  pvpSynced: document.getElementById('pvpSynced'),
  pvpSummary: document.getElementById('pvpSummary'),
  pvpEmpty: document.getElementById('pvpEmpty'),
  pvpEmptyTitle: document.getElementById('pvpEmptyTitle'),
  pvpEmptyText: document.getElementById('pvpEmptyText'),
  pvpLoading: document.getElementById('pvpLoading'),
  pvpError: document.getElementById('pvpError'),
  pvpState: document.getElementById('pvpState'),
  pvpFoot: document.getElementById('pvpFoot'),
  pvpRankCard: document.getElementById('pvpRankCard'),
  pvpRankOwn: document.getElementById('pvpRankOwn'),
  pvpRankBattles: document.getElementById('pvpRankBattles'),
  pvpRankPlan: document.getElementById('pvpRankPlan'),
  pvpRankStop: document.getElementById('pvpRankStop'),
  pvpRankProgress: document.getElementById('pvpRankProgress'),
  pvpRankProgressLabel: document.getElementById('pvpRankProgressLabel'),
  pvpRankProgressNext: document.getElementById('pvpRankProgressNext'),
  pvpRankProgressBar: document.getElementById('pvpRankProgressBar'),
  pvpRankProgressHint: document.getElementById('pvpRankProgressHint'),
  pvpRankResult: document.getElementById('pvpRankResult'),
  pvpRankList: document.getElementById('pvpRankList'),
  pvpPlunderCard: document.getElementById('pvpPlunderCard'),
  pvpPlunderOwn: document.getElementById('pvpPlunderOwn'),
  pvpPlunderBattles: document.getElementById('pvpPlunderBattles'),
  pvpPlunderPlan: document.getElementById('pvpPlunderPlan'),
  pvpPlunderStop: document.getElementById('pvpPlunderStop'),
  pvpPlunderProgress: document.getElementById('pvpPlunderProgress'),
  pvpPlunderProgressLabel: document.getElementById('pvpPlunderProgressLabel'),
  pvpPlunderProgressNext: document.getElementById('pvpPlunderProgressNext'),
  pvpPlunderProgressBar: document.getElementById('pvpPlunderProgressBar'),
  pvpPlunderProgressHint: document.getElementById('pvpPlunderProgressHint'),
  pvpPlunderResult: document.getElementById('pvpPlunderResult'),
  pvpPlunderList: document.getElementById('pvpPlunderList'),
  pvpConfirmDialog: document.getElementById('pvpConfirmDialog'),
  pvpConfirmTitle: document.getElementById('pvpConfirmTitle'),
  pvpConfirmBody: document.getElementById('pvpConfirmBody'),
  btnPvpConfirm: document.getElementById('btnPvpConfirm'),
  advisorSynced: document.getElementById('advisorSynced'),
  advisorSummary: document.getElementById('advisorSummary'),
  advisorEmpty: document.getElementById('advisorEmpty'),
  advisorEmptyTitle: document.getElementById('advisorEmptyTitle'),
  advisorEmptyText: document.getElementById('advisorEmptyText'),
  advisorLoading: document.getElementById('advisorLoading'),
  advisorError: document.getElementById('advisorError'),
  advisorList: document.getElementById('advisorList'),
  advisorFoot: document.getElementById('advisorFoot'),
  btnAdvisorScan: document.getElementById('btnAdvisorScan'),
  btnAdvisorScanAll: document.getElementById('btnAdvisorScanAll'),
  botStatus: document.getElementById('botStatus'),
  botHero: document.getElementById('botHero'),
  botSummary: document.getElementById('botSummary'),
  botDryRun: document.getElementById('botDryRun'),
  botInterval: document.getElementById('botInterval'),
  botMaxActions: document.getElementById('botMaxActions'),
  botAllowDaily: document.getElementById('botAllowDaily'),
  botAllowStory: document.getElementById('botAllowStory'),
  botAllowBoss: document.getElementById('botAllowBoss'),
  botAllowPvp: document.getElementById('botAllowPvp'),
  botStoryRuns: document.getElementById('botStoryRuns'),
  botPvpBattles: document.getElementById('botPvpBattles'),
  botAccounts: document.getElementById('botAccounts'),
  botEligible: document.getElementById('botEligible'),
  botEvents: document.getElementById('botEvents'),
  btnBotStart: document.getElementById('btnBotStart'),
  btnBotStop: document.getElementById('btnBotStop'),
  btnBotRefresh: document.getElementById('btnBotRefresh'),
  btnBotTick: document.getElementById('btnBotTick'),
  fields: {
    username: document.getElementById('fUsername'),
    password: document.getElementById('fPassword'),
    server: document.getElementById('fServer'),
    characterName: document.getElementById('fCharacter'),
    label: document.getElementById('fLabel'),
  },
};

const numberFormatter = new Intl.NumberFormat('vi-VN');
const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'short',
  timeStyle: 'short',
});

function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'style') node.style.cssText = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else if (value !== undefined && value !== null) node.setAttribute(key, value);
  }
  for (const child of [].concat(children)) {
    if (child === null || child === undefined) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

function icon(name, className = '') {
  const span = el('span', { class: `ico ${className}`.trim(), 'aria-hidden': 'true' });
  span.innerHTML = ICONS[name] || '';
  return span;
}

function formatNumber(value) {
  return value === null || value === undefined ? '—' : numberFormatter.format(value);
}

function formatDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date);
}

function toast(message, type = 'success') {
  const node = el('div', { class: `toast ${type}`, text: message });
  els.toasts.append(node);
  setTimeout(() => {
    node.style.opacity = '0';
    node.style.transition = 'opacity .2s ease';
    setTimeout(() => node.remove(), 220);
  }, 3600);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (response.status === 204) return null;

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error || `Yêu cầu thất bại (${response.status}).`);
  }
  return payload;
}

/* ------------------------------ Views ------------------------------ */

function switchView(name, { updateHash = true } = {}) {
  if (!els.views[name]) return;
  const changed = state.view !== name;
  state.view = name;

  for (const [key, node] of Object.entries(els.views)) {
    node.hidden = key !== name;
  }

  for (const item of els.navItems) {
    const active = item.dataset.view === name;
    item.classList.toggle('active', active);
    if (active) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  }

  if (updateHash) {
    const next = name === 'accounts' ? window.location.pathname : `#${name}`;
    window.history.replaceState(null, '', next);
  }

  if (name === 'boss') startBossTicker();
  else stopBossTicker();

  if (name === 'bot') startBotPolling();
  else stopBotPolling();

  if (name === 'daily') {
    loadDaily();
  } else if (name === 'training') {
    loadTraining();
  } else if (name === 'boss') {
    loadBoss();
  } else if (name === 'pvp') {
    loadPvp();
  } else if (name === 'advisor') {
    loadAdvisor();
  } else if (name === 'bot') {
    loadBot();
  } else if (name === 'dashboard') {
    loadDashboard();
  } else if (name === 'team') {
    loadTeam();
  } else if (name === 'bag') {
    loadBag();
  } else if (name === 'gacha') {
    loadGacha();
  } else if (name === 'craftment') {
    loadCraft();
  } else if (name === 'logs') {
    loadLogs({ reset: true });
  } else if (name === 'accounts' && changed) {
    loadAccounts();
  }
}

/* ------------------------------ Accounts ------------------------------ */

let loadSeq = 0;

async function loadAccounts() {
  const seq = ++loadSeq;

  try {
    const data = await api('/api/accounts');
    if (seq !== loadSeq) return;

    state.accounts = data.accounts;
    state.stats = data.stats;
    syncAccountSelects();
    render();
  } catch (error) {
    if (seq === loadSeq) toast(error.message, 'error');
  }
}

function visibleAccounts() {
  const needle = state.query.trim().toLowerCase();
  return state.accounts.filter((account) => {
    if (state.status !== 'all' && account.status !== state.status) return false;
    if (!needle) return true;
    return [
      account.username,
      account.label,
      account.characterName,
      account.guildName,
      account.server,
    ].some((value) => String(value ?? '').toLowerCase().includes(needle));
  });
}

function render() {
  renderStats();
  renderCards();
}

function renderStats() {
  const { stats } = state;
  els.statTotal.textContent = stats.total;
  els.statActive.textContent = stats.active;
  els.statAuto.textContent = stats.auto;
  els.statNew.textContent = stats.new;
  els.statProblem.textContent = stats.error + stats.disabled;
  els.sideTotal.textContent = stats.total;
}

function renderCards() {
  els.grid.replaceChildren();

  const accounts = visibleAccounts();
  els.resultCount.textContent =
    accounts.length === state.accounts.length
      ? `${accounts.length} tài khoản`
      : `${accounts.length}/${state.accounts.length} tài khoản`;
  els.empty.hidden = accounts.length > 0;

  if (accounts.length === 0) {
    const filtering = Boolean(state.query) || state.status !== 'all';
    els.emptyTitle.textContent = filtering
      ? 'Không tìm thấy tài khoản phù hợp'
      : 'Chưa có tài khoản nào';
    els.emptyText.textContent = filtering
      ? 'Thử từ khóa khác hoặc bỏ bộ lọc trạng thái.'
      : 'Thêm tài khoản đầu tiên để bắt đầu quản lý và chạy bot.';
    document.getElementById('btnEmptyAdd').hidden = filtering;
    return;
  }

  for (const account of accounts) {
    els.grid.append(renderCard(account));
  }
}

function renderCard(account) {
  const meta = STATUS_META[account.status] || STATUS_META.new;
  const pending = state.pending.get(account.id) || null;
  const isActive = account.status === 'active';
  const canAuto = isActive && account.enabled;

  const card = el('article', {
    class: `account-card${account.enabled ? '' : ' is-disabled'}${
      state.accountId === account.id ? ' is-selected' : ''
    }`,
    dataset: { status: account.status, accountId: String(account.id) },
  });

  card.addEventListener('click', (event) => {
    if (event.target.closest('button, details, summary, input, a')) return;
    selectAccount(account.id);
  });

  const menu = el('details', { class: 'card-menu' });
  menu.append(
    el('summary', { title: 'Thao tác khác', 'aria-label': 'Thao tác khác' }, [icon('dots')]),
  );
  const menuList = el('div', { class: 'menu-list' }, [
    menuButton('Sửa tài khoản', () => openEdit(account), menu),
    menuButton(account.enabled ? 'Tắt tài khoản' : 'Bật tài khoản', () => toggleAccount(account), menu),
    menuButton('Xóa tài khoản', () => openDelete(account), menu, 'danger'),
  ]);
  menu.append(menuList);

  const subParts = [account.label, account.server].filter(Boolean);

  card.append(
    el('div', { class: 'card-top' }, [
      el('div', { class: 'avatar', 'aria-hidden': 'true' }, [
        (account.characterName || account.username || '?').trim().charAt(0),
      ]),
      el('div', { class: 'card-identity' }, [
        el('div', { class: 'card-name-row' }, [
          el('strong', { text: account.username, title: account.username }),
          el('span', { class: `badge ${meta.className}`, text: meta.label }),
        ]),
        el('small', {
          class: 'card-sub',
          text: subParts.join(' · '),
          title: subParts.join(' · '),
        }),
      ]),
      menu,
    ]),
    el('div', { class: 'card-character' }, [
      el('div', { class: 'char-line' }, [
        icon('user'),
        el('span', {
          class: 'char-name',
          text: account.characterName || 'Chưa có nhân vật',
          title: account.characterName || '',
        }),
        el('span', {
          class: 'lv-badge',
          text: account.level === null || account.level === undefined ? 'Lv —' : `Lv ${account.level}`,
        }),
      ]),
      el('div', { class: 'guild-line' }, [
        icon('shield'),
        el('span', {
          text: account.guildName ? `Guild: ${account.guildName}` : 'Chưa có guild',
          title: account.guildName || '',
        }),
      ]),
    ]),
    el('div', { class: 'card-stats' }, [
      statCell('bolt', 'power', 'Lực chiến', formatNumber(account.power)),
      statCell('coin', 'gold', 'Vàng', formatNumber(account.gold)),
      statCell('gem', 'gem', 'Kim cương', formatNumber(account.diamond)),
      statCell('trophy', 'rank', 'Top BXH', account.rankNo ? `#${account.rankNo}` : '—'),
    ]),
    renderAutoRow(account, pending, canAuto, isActive),
  );

  if (account.lastError) {
    card.append(
      el('div', {
        class: 'card-error',
        text: account.lastError,
        title: account.lastError,
      }),
    );
  }

  card.append(renderCardFooter(account, pending, isActive));
  return card;
}

function statCell(iconName, iconClass, label, value) {
  return el('div', { class: 'stat-cell' }, [
    el('span', { class: 'stat-head' }, [icon(iconName, iconClass), label]),
    el('strong', { text: value, title: value }),
  ]);
}

function renderAutoRow(account, pending, canAuto, isActive) {
  const autoPending = pending === 'auto';
  const switchButton = el('button', {
    class: 'switch',
    type: 'button',
    role: 'switch',
    'aria-checked': String(account.autoEnabled),
    'aria-label': `Bật/tắt auto cho ${account.username}`,
    title: canAuto
      ? 'Bật/tắt chạy tự động'
      : 'Cần đăng nhập tài khoản trước khi bật auto',
  });
  switchButton.disabled = !canAuto || Boolean(pending);
  switchButton.addEventListener('click', () => toggleAuto(account, !account.autoEnabled));

  let stateText = 'Cần đăng nhập';
  if (isActive) stateText = account.autoEnabled ? 'Đang bật' : 'Đang tắt';
  if (autoPending) stateText = 'Đang lưu…';

  return el('div', { class: 'auto-row' }, [
    el('div', { class: 'auto-label' }, [
      el('span', { class: 'auto-title' }, [icon('bolt'), 'Tự động']),
      el('small', { text: 'Bật/tắt chạy auto cho tài khoản này' }),
    ]),
    el('span', {
      class: `auto-state${account.autoEnabled && isActive ? ' on' : ''}`,
      text: stateText,
    }),
    switchButton,
  ]);
}

function renderCardFooter(account, pending, isActive) {
  const syncTime = account.lastSyncAt || account.lastLoginAt;
  const syncText = syncTime ? `Đồng bộ: ${formatDate(syncTime)}` : 'Chưa đồng bộ thông tin';

  const actions = el('div', { class: 'foot-actions' });

  if (pending === 'login' || pending === 'logout') {
    const button = el('button', { class: 'btn btn-ghost btn-sm', type: 'button' }, [
      el('span', { class: 'spinner' }),
      pending === 'login' ? 'Đang đăng nhập…' : 'Đang đăng xuất…',
    ]);
    button.disabled = true;
    actions.append(button);
  } else if (isActive) {
    actions.append(
      el('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: () => logout(account) }, [
        icon('logout'),
        'Đăng xuất',
      ]),
    );

    const syncButton = el('button', {
      class: 'btn btn-ghost btn-sm btn-icon',
      type: 'button',
      title: 'Đồng bộ thông tin nhân vật',
      'aria-label': 'Đồng bộ thông tin nhân vật',
      onclick: () => sync(account),
    }, [pending === 'sync' ? el('span', { class: 'spinner' }) : icon('refresh')]);
    syncButton.disabled = pending === 'sync';
    actions.append(syncButton);
  } else {
    const loginButton = el('button', {
      class: 'btn btn-primary btn-sm',
      type: 'button',
      onclick: () => login(account),
    }, [icon('login'), 'Đăng nhập']);
    loginButton.disabled = !account.enabled;
    if (!account.enabled) loginButton.title = 'Tài khoản đang tắt';
    actions.append(loginButton);
  }

  const chosen = state.accountId === account.id;
  const chooseButton = el('button', {
    class: `btn btn-sm ${chosen ? 'btn-primary' : 'btn-ghost'}`,
    type: 'button',
    title: chosen ? 'Tài khoản đang dùng' : 'Dùng tài khoản này ở mọi tab',
    onclick: (event) => {
      event.stopPropagation();
      selectAccount(account.id);
    },
  }, [icon('check'), chosen ? 'Đang dùng' : 'Chọn']);
  actions.prepend(chooseButton);

  return el('footer', { class: 'card-foot' }, [
    el('span', { class: 'sync-time', text: syncText, title: syncText }),
    actions,
  ]);
}

function invalidateAccountData(id) {
  if (state.accountId !== id) return;
  for (const key of [
    'daily',
    'dashboard',
    'team',
    'bag',
    'gacha',
    'craftment',
    'training',
    'boss',
    'pvp',
    'advisor',
  ]) {
    if (state[key]) {
      state[key].data = null;
      state[key].loadedAt = 0;
      if ('readAtMs' in state[key]) state[key].readAtMs = 0;
    }
  }
  state.training.story = null;
}

function selectAccount(id) {
  if (state.accountId === id) return;
  state.accountId = id;
  invalidateAccountData(id);
  syncAccountSelects();
  const account = selectedAccount();
  toast(`Đang dùng: ${account?.characterName || account?.username || id}`, 'success');
  reloadCurrentView();
}

function menuButton(label, handler, menu, className = '') {
  const button = el('button', { type: 'button', class: className, text: label });
  button.addEventListener('click', () => {
    menu.open = false;
    handler();
  });
  return button;
}

function setPending(id, kind) {
  if (kind) state.pending.set(id, kind);
  else state.pending.delete(id);
  render();
}

async function runAction(account, kind, path, successMessage, options = {}) {
  if (state.pending.has(account.id)) return null;

  setPending(account.id, kind);
  try {
    const data = await api(path, {
      method: 'POST',
      body: JSON.stringify(options.body ?? {}),
    });
    if (successMessage) toast(successMessage);
    return data;
  } catch (error) {
    toast(error.message, 'error');
    return null;
  } finally {
    state.pending.delete(account.id);
    await loadAccounts();
  }
}

function login(account) {
  return runAction(
    account,
    'login',
    `/api/accounts/${account.id}/login`,
    null,
  ).then((data) => {
    if (data?.account) {
      const name = data.account.characterName || data.account.username;
      toast(`Đã đăng nhập ${name}.`);
      invalidateAccountData(account.id);
    }
  });
}

function logout(account) {
  return runAction(
    account,
    'logout',
    `/api/accounts/${account.id}/logout`,
    `Đã đăng xuất ${account.username}.`,
  ).then(() => {
    invalidateAccountData(account.id);
  });
}

function sync(account) {
  return runAction(
    account,
    'sync',
    `/api/accounts/${account.id}/sync`,
    'Đã cập nhật thông tin nhân vật.',
  );
}

function toggleAuto(account, enabled) {
  return runAction(
    account,
    'auto',
    `/api/accounts/${account.id}/auto`,
    enabled ? 'Đã bật auto.' : 'Đã tắt auto.',
    { body: { enabled } },
  );
}

async function toggleAccount(account) {
  try {
    await api(`/api/accounts/${account.id}/toggle`, {
      method: 'POST',
      body: JSON.stringify({ enabled: !account.enabled }),
    });
    toast(account.enabled ? 'Đã tắt tài khoản.' : 'Đã bật tài khoản.');
    invalidateAccountData(account.id);
    await loadAccounts();
  } catch (error) {
    toast(error.message, 'error');
  }
}

/* ------------------------------ Daily ------------------------------ */

function selectedAccount() {
  if (state.accountId === null || state.accountId === undefined) return null;
  return state.accounts.find((account) => account.id === state.accountId) || null;
}

function syncAccountSelects() {
  const accounts = state.accounts;
  if (!accounts.some((account) => account.id === state.accountId)) {
    const preferred =
      accounts.find(
        (account) =>
          account.enabled &&
          account.status === 'active' &&
          account.hasSession !== false,
      ) ||
      accounts.find((account) => account.enabled) ||
      accounts[0] ||
      null;
    state.accountId = preferred ? preferred.id : null;
  }

  // Tat ca tab doc chung mot tai khoan. Doi tai khoan o tab "Tai khoan".
  renderGlobalAccountBar();
  for (const card of els.grid.querySelectorAll('.account-card')) {
    card.classList.toggle(
      'is-selected',
      Number(card.dataset.accountId) === state.accountId,
    );
  }
}

function renderGlobalAccountBar() {
  const bar = els.globalAccountBar;
  if (!bar) return;
  const accounts = state.accounts;
  bar.replaceChildren();
  if (accounts.length === 0) {
    bar.hidden = true;
    return;
  }
  bar.hidden = false;

  const account = selectedAccount();

  const label = el('div', { class: 'tan-label' }, [
    el('small', { text: 'Tài khoản đang dùng' }),
    el('span', { class: 'tan-dot', 'aria-hidden': 'true' }),
  ]);

  const select = el('select', {
    class: 'tan-select',
    'aria-label': 'Chọn tài khoản dùng chung cho mọi tab',
  });
  if (!account) {
    select.append(el('option', { value: '', text: '— Chọn tài khoản —' }));
  }
  for (const item of accounts) {
    const loggedIn = item.status === 'active' && item.hasSession !== false;
    const stateText = !item.enabled
      ? 'đang tắt'
      : loggedIn
        ? 'đã đăng nhập'
        : item.status === 'error'
          ? 'lỗi phiên'
          : 'chưa đăng nhập';
    const option = el('option', {
      value: String(item.id),
      text: `${item.username} · ${item.characterName || 'chưa có nhân vật'} (${stateText})`,
    });
    if (item.id === state.accountId) option.selected = true;
    select.append(option);
  }
  select.addEventListener('change', () => {
    const id = Number(select.value);
    if (Number.isFinite(id) && id > 0) selectAccount(id);
  });
  if (account) select.value = String(account.id);

  const identity = account
    ? el('div', { class: 'gab-identity' }, [
        el('strong', { text: account.characterName || account.username }),
        el('small', { text: account.username }),
      ])
    : el('div', { class: 'gab-identity' }, [
        el('strong', { text: 'Chưa chọn tài khoản' }),
        el('small', { text: 'Chọn một tài khoản để dùng cho mọi tab' }),
      ]);

  const statusChip = account
    ? el('span', {
        class: `gab-chip tan-status ${
          account.status === 'active' && account.hasSession !== false
            ? 'is-active'
            : 'is-offline'
        }`,
        text:
          account.status === 'active' && account.hasSession !== false
            ? 'Đã đăng nhập'
            : account.enabled
              ? account.status === 'error'
                ? 'Lỗi phiên'
                : 'Chưa đăng nhập'
              : 'Đang tắt',
      })
    : null;

  const chips = el('div', { class: 'gab-chips' }, [
    statusChip,
    account ? el('span', { class: 'gab-chip' }, [icon('star'), 'Lv ' + (account.level ?? '—')]) : null,
    account ? el('span', { class: 'gab-chip' }, [icon('bolt'), formatNumber(account.power)]) : null,
    account ? el('span', { class: 'gab-chip' }, [icon('coin'), formatNumber(account.gold)]) : null,
  ]);

  const manage = el('button', {
    class: 'btn btn-ghost btn-sm gab-change',
    type: 'button',
    title: 'Quản lý / thêm tài khoản',
    onclick: () => switchView('accounts'),
  }, [icon('settings'), 'Quản lý']);

  bar.append(label, select, identity, chips, manage);
}

function reloadCurrentView() {
  const view = state.view;
  if (view === 'dashboard') loadDashboard({ force: true });
  else if (view === 'daily') loadDaily({ force: true });
  else if (view === 'training') loadTraining({ force: true });
  else if (view === 'boss') loadBoss({ force: true });
  else if (view === 'pvp') loadPvp({ force: true });
  else if (view === 'team') loadTeam({ force: true });
  else if (view === 'bag') loadBag({ force: true });
  else if (view === 'gacha') loadGacha({ force: true });
  else if (view === 'craftment') loadCraft({ force: true });
  else if (view === 'advisor') loadAdvisor({ force: true });
  else if (view === 'logs') loadLogs({ reset: true });
  else if (view === 'bot') loadBot();
  else if (view === 'accounts') renderCards();
}
function selectedDashboardAccount() {
  return selectedAccount();
}

let dashboardSeq = 0;

async function loadDashboard({ force = false } = {}) {
  const account = selectedDashboardAccount();
  const usable = Boolean(account && account.enabled && account.status === 'active');

  if (!usable) {
    dashboardSeq += 1;
    state.dashboard.loading = false;
    state.dashboard.loadingAccountId = null;
    state.dashboard.data = null;
    state.dashboard.error = null;
    renderDashboard();
    return;
  }

  const fresh =
    state.dashboard.data &&
    state.dashboard.data.accountId === account.id &&
    Date.now() - state.dashboard.loadedAt < 60_000;
  if (!force && fresh && !state.dashboard.loading) {
    renderDashboard();
    return;
  }

  if (
    !force &&
    state.dashboard.loading &&
    state.dashboard.loadingAccountId === account.id
  ) {
    return;
  }

  const seq = ++dashboardSeq;
  state.dashboard.loading = true;
  state.dashboard.loadingAccountId = account.id;
  state.dashboard.error = null;
  renderDashboard();

  try {
    const data = await api(`/api/accounts/${account.id}/dashboard`);
    if (seq !== dashboardSeq) return;

    state.dashboard.data = {
      ...data.state,
      accountId: account.id,
      account: data.account,
    };
    state.dashboard.loadedAt = Date.now();
  } catch (error) {
    if (seq !== dashboardSeq) return;

    state.dashboard.error = error.message;
    state.dashboard.data = null;
    if (/đăng nhập|đang tắt/i.test(error.message)) {
      await loadAccounts();
    }
  } finally {
    if (seq === dashboardSeq) {
      state.dashboard.loading = false;
      state.dashboard.loadingAccountId = null;
      renderDashboard();
    }
  }
}

function formatDuration(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  if (total < 60) return `${total}s`;
  const minutes = Math.floor(total / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  if (hours < 24) return restMinutes ? `${hours}h ${restMinutes}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  const restHours = hours % 24;
  return restHours ? `${days}d ${restHours}h` : `${days}d`;
}

function dashRiskLabel(risk) {
  if (risk === 'medium') return 'Trung bình';
  if (risk === 'high') return 'Cao';
  return 'Thấp';
}

function dashKpi({ label, value, sub, barPct = null, tone = 'accent' }) {
  const children = [
    el('span', { class: 'dash-kpi-label', text: label }),
    el('strong', { class: 'dash-kpi-value', text: value }),
    sub ? el('span', { class: 'dash-kpi-sub', text: sub }) : null,
  ];
  if (barPct !== null && barPct !== undefined) {
    const width = Math.max(0, Math.min(100, Number(barPct) || 0));
    children.push(
      el('div', { class: 'dash-bar' }, [
        el('span', {
          class: `dash-bar-fill ${tone}`,
          style: `width:${width}%`,
        }),
      ]),
    );
  }
  return el('article', { class: 'dash-kpi' }, children);
}

function dashPanel(title, subtitle, body, className = '') {
  return el('section', { class: `dash-panel ${className}`.trim() }, [
    el('div', { class: 'dash-panel-head' }, [
      el('div', {}, [
        el('h2', { text: title }),
        subtitle ? el('p', { text: subtitle }) : null,
      ]),
    ]),
    el('div', { class: 'dash-panel-body' }, body),
  ]);
}

function dashMini(label, value, sub) {
  return el('div', { class: 'dash-mini' }, [
    el('span', { class: 'dash-mini-label', text: label }),
    el('strong', { class: 'dash-mini-value', text: value }),
    el('small', { class: 'dash-mini-sub', text: sub }),
  ]);
}

function renderDashboardSuggestions(data) {
  if (!data.suggestions.length) {
    return [
      el('div', {
        class: 'dash-empty-note',
        text: 'Không có việc gấp. Tiếp tục farm hoặc nghỉ.',
      }),
    ];
  }

  return data.suggestions.map((item) => {
    const canOpen = Boolean(item.targetView && els.views[item.targetView]);
    const action = canOpen
      ? el('button', {
          class: 'btn btn-ghost btn-sm',
          type: 'button',
          text: item.actionLabel || 'Mở',
        })
      : item.targetView
        ? el('span', { class: 'dash-soon', text: 'Sắp có' })
        : null;
    if (canOpen) {
      action.addEventListener('click', () => switchView(item.targetView));
    }

    return el('div', { class: 'dash-suggestion' }, [
      el('div', { class: 'dash-suggestion-main' }, [
        el('div', { class: 'dash-suggestion-title' }, [
          el('strong', { text: item.title }),
          el('span', {
            class: `dash-risk ${item.risk}`,
            text: dashRiskLabel(item.risk),
          }),
        ]),
        el('p', { text: item.detail }),
      ]),
      action,
    ]);
  });
}

function renderDashboardSchedule(data) {
  const now = Date.now();
  return data.schedule.map((row) => {
    const startsAt = Number(row.startsAt) || 0;
    const endsAt = Number(row.endsAt) || 0;
    let status = row.status;
    let label = '';

    if (now < startsAt) {
      status = 'upcoming';
      label = `Còn ${formatDuration((startsAt - now) / 1000)}`;
    } else if (now < endsAt) {
      status = 'open';
      label = `Đang mở · còn ${formatDuration((endsAt - now) / 1000)}`;
    } else {
      status = 'past';
      label = 'Đã qua';
    }

    return el('div', { class: `dash-schedule-row ${status}` }, [
      el('span', { class: 'dash-schedule-time', text: row.time }),
      el('div', { class: 'dash-schedule-main' }, [
        el('strong', { text: row.label }),
        el('small', { text: row.note }),
      ]),
      el('span', { class: `dash-status-pill ${status}`, text: label }),
    ]);
  });
}

function renderDashboardStatus(data) {
  const { ultimate, training, guild, boss, daily } = data;
  const ultimateLine = (entry) => {
    if (!entry) return 'Chưa có dữ liệu';
    const pending = entry.pendingBuff
      ? 'buff chờ'
      : entry.pendingReward
        ? 'reward chờ'
        : 'sẵn sàng';
    return `${entry.runsLeft} lượt · ${pending}`;
  };

  const minis = el('div', { class: 'dash-mini-grid' }, [
    dashMini(
      'Ultimate · Công',
      ultimate.atk ? `Stage ${ultimate.atk.nextStage}` : '—',
      ultimateLine(ultimate.atk),
    ),
    dashMini(
      'Ultimate · Thủ',
      ultimate.def ? `Stage ${ultimate.def.nextStage}` : '—',
      ultimateLine(ultimate.def),
    ),
    dashMini(
      'Boss vĩ thú',
      boss ? boss.beastName : '—',
      boss
        ? boss.eventOpen
          ? boss.defeated
            ? 'Đã bị hạ trong phiên này'
            : `Đang mở · ${formatNumber(boss.hp)}/${formatNumber(boss.maxHp)} HP`
          : `Mở sau ${formatDuration(boss.secondsToOpen)}`
        : 'Chưa có dữ liệu',
    ),
    dashMini(
      'Guild',
      guild.hasGuild ? `${guild.name} · Lv${guild.level}` : 'Chưa có guild',
      guild.boss
        ? `${guild.boss.hitsLeft}/${guild.boss.hitsPerDay} hit · ${formatNumber(guild.boss.hp)} HP`
        : 'Chưa có guild boss',
    ),
  ]);

  const caveChips = el(
    'div',
    { class: 'dash-chip-row' },
    training.caves.map((cave) =>
      el('span', { class: `dash-chip ${cave.open ? 'open' : ''}`.trim() }, [
        el('b', { text: cave.name }),
        el('span', {
          text: cave.open
            ? `${cave.runsLeftAtk + cave.runsLeftDef} lượt`
            : 'đóng',
        }),
      ]),
    ),
  );

  const milestoneMax = Number(daily.nextMilestone) || 0;
  const milestonePct =
    milestoneMax > 0
      ? Math.max(0, Math.min(100, Math.round((daily.todaySpent / milestoneMax) * 100)))
      : 0;
  const milestone = el('div', { class: 'dash-milestone' }, [
    el('div', { class: 'dash-milestone-head' }, [
      el('strong', { text: 'Mốc Kim cương' }),
      el('span', {
        text:
          daily.nextMilestone === null
            ? '—'
            : `${formatNumber(daily.todaySpent)}/${formatNumber(daily.nextMilestone)}`,
      }),
    ]),
    el('div', { class: 'dash-bar' }, [
      el('span', {
        class: 'dash-bar-fill accent',
        style: `width:${milestonePct}%`,
      }),
    ]),
    el('small', {
      text:
        daily.nextMilestone === null || daily.nextMilestone === undefined
          ? 'Chưa có dữ liệu mốc Kim cương.'
          : daily.milestoneRemaining > 0
            ? `Còn ${formatNumber(daily.milestoneRemaining)} Kim cương`
            : 'Sẵn sàng nhận thưởng mốc',
    }),
  ]);

  const keys = daily.keys
    ? el('div', { class: 'dash-chip-row' }, [
        el('span', { class: 'dash-chip' }, [
          el('b', { text: 'Chìa Đồng' }),
          el('span', { text: formatNumber(daily.keys.bronze) }),
        ]),
        el('span', { class: 'dash-chip' }, [
          el('b', { text: 'Chìa Bạc' }),
          el('span', { text: formatNumber(daily.keys.silver) }),
        ]),
        el('span', { class: 'dash-chip' }, [
          el('b', { text: 'Chìa Vàng' }),
          el('span', { text: formatNumber(daily.keys.gold) }),
        ]),
      ])
    : null;

  return [
    minis,
    el('div', { class: 'dash-subhead', text: 'Huấn luyện hôm nay' }),
    caveChips,
    milestone,
    keys ? el('div', { class: 'dash-subhead', text: 'Chìa khóa' }) : null,
    keys,
  ];
}

function renderDashboardAlerts(data) {
  if (!data.alerts.length) {
    return [el('div', { class: 'dash-empty-note', text: 'Không có cảnh báo.' })];
  }

  return data.alerts.map((alert) =>
    el('div', { class: `dash-alert ${alert.level}` }, [
      el('span', { class: 'dash-alert-dot', 'aria-hidden': 'true' }),
      el('div', {}, [
        el('strong', { text: alert.title }),
        el('p', { text: alert.detail }),
      ]),
    ]),
  );
}

function renderDashboard() {
  const account = selectedDashboardAccount();
  const { data, loading, error } = state.dashboard;

  els.dashboardBody.replaceChildren();
  els.dashboardEmpty.hidden = true;
  els.dashboardSynced.textContent = '';
  els.dashboardFoot.textContent = 'Chọn tài khoản để xem tổng quan.';

  if (!account) {
    els.dashboardEmpty.hidden = false;
    els.dashboardEmptyTitle.textContent = 'Chưa có tài khoản';
    els.dashboardEmptyText.textContent =
      'Thêm và đăng nhập một tài khoản để xem tổng quan.';
    return;
  }

  els.dashboardSynced.textContent = data?.fetchedAt
    ? `Cập nhật: ${formatDate(data.fetchedAt)}`
    : '';

  if (!account.enabled || account.status !== 'active') {
    const message = !account.enabled
      ? 'Tài khoản đang tắt. Hãy bật lại và đăng nhập để xem tổng quan.'
      : 'Tài khoản chưa đăng nhập. Hãy đăng nhập để xem tổng quan.';
    els.dashboardEmpty.hidden = false;
    els.dashboardEmptyTitle.textContent = 'Cần đăng nhập';
    els.dashboardEmptyText.textContent = message;
    els.dashboardFoot.textContent = message;
    return;
  }

  if (loading && !data) {
    els.dashboardBody.append(
      el('div', { class: 'daily-loading' }, [
        el('span', { class: 'spinner' }),
        'Đang đọc tổng quan từ game…',
      ]),
    );
    els.dashboardFoot.textContent = 'Đang tải dữ liệu tổng quan.';
    return;
  }

  if (error) {
    const retry = el('button', {
      class: 'btn btn-ghost btn-sm',
      type: 'button',
      text: 'Thử lại',
    });
    retry.addEventListener('click', () => loadDashboard({ force: true }));
    els.dashboardBody.append(
      el('div', { class: 'notice notice-error' }, [
        el('div', { class: 'notice-body' }, [
          el('strong', { text: 'Không đọc được tổng quan' }),
          el('small', { text: error }),
        ]),
        retry,
      ]),
    );
    els.dashboardFoot.textContent = 'Kiểm tra kết nối hoặc đăng nhập lại tài khoản.';
    return;
  }

  if (!data) {
    els.dashboardBody.append(
      el('div', { class: 'daily-loading' }, ['Chưa có dữ liệu tổng quan.']),
    );
    return;
  }

  const { player, stamina, currency, progress, daily } = data;

  const kpis = el('div', { class: 'dash-kpis' }, [
    dashKpi({
      label: 'Cấp độ',
      value: `Lv ${player.level}`,
      sub: `${formatNumber(player.exp)}/${formatNumber(player.expMax)} EXP · ${formatNumber(player.power)} lực chiến`,
      barPct: player.expPct,
      tone: 'accent',
    }),
    dashKpi({
      label: 'Năng lượng / BP',
      value: `${formatNumber(stamina.energy)}/${formatNumber(stamina.energyMax)}`,
      sub: `BP ${formatNumber(stamina.bp)}/${formatNumber(stamina.bpMax)} · đã dùng ${formatNumber(stamina.energyUsed)} Energy hôm nay`,
      barPct: stamina.energyPct,
      tone:
        stamina.energyPct >= 90 || stamina.energyPct <= 10 ? 'warn' : 'ok',
    }),
    dashKpi({
      label: 'Tài nguyên',
      value: `${formatNumber(currency.diamond)} Kim cương`,
      sub: `${formatNumber(currency.gold)} vàng · VIP ${player.vip}`,
    }),
    dashKpi({
      label: 'Tiến trình',
      value: `Ch.${progress.chapter}-${progress.stageNo}`,
      sub: `Rank ${player.rankNo ?? '—'} · ${player.slots} slot · ${daily.missionsReady} nhiệm vụ sẵn sàng`,
    }),
  ]);

  const grid = el('div', { class: 'dash-grid' }, [
    dashPanel(
      'Việc nên làm hôm nay',
      `${data.suggestions.length} gợi ý`,
      renderDashboardSuggestions(data),
      'dash-panel-suggestions',
    ),
    dashPanel(
      'Lịch hôm nay (UTC+7)',
      'Reset · boss · World War · Chakra Tree',
      renderDashboardSchedule(data),
      'dash-panel-schedule',
    ),
    dashPanel(
      'Trạng thái hệ thống',
      'Ultimate · huấn luyện · guild · boss',
      renderDashboardStatus(data),
      'dash-panel-status',
    ),
    dashPanel(
      'Cảnh báo',
      data.alerts.length ? `${data.alerts.length} mục` : 'Không có',
      renderDashboardAlerts(data),
      'dash-panel-alerts',
    ),
  ]);

  els.dashboardBody.append(kpis, grid);
  els.dashboardFoot.textContent = `Đọc lúc ${formatDate(data.fetchedAt)} · ${player.name} · Lv${player.level}`;
}

function selectedDailyAccount() {
  return selectedAccount();
}

let dailySeq = 0;

async function loadDaily({ force = false } = {}) {
  const account = selectedDailyAccount();
  const usable = Boolean(account && account.enabled && account.status === 'active');

  if (!usable) {
    dailySeq += 1;
    state.daily.loading = false;
    state.daily.loadingAccountId = null;
    state.daily.data = null;
    state.daily.error = null;
    renderDaily();
    return;
  }

  const fresh =
    state.daily.data &&
    state.daily.data.accountId === account.id &&
    Date.now() - state.daily.loadedAt < 120_000;
  if (!force && fresh && !state.daily.loading) {
    renderDaily();
    return;
  }

  if (
    !force &&
    state.daily.loading &&
    state.daily.loadingAccountId === account.id
  ) {
    return;
  }

  const seq = ++dailySeq;
  state.daily.loading = true;
  state.daily.loadingAccountId = account.id;
  state.daily.error = null;
  renderDaily();

  try {
    const data = await api(`/api/accounts/${account.id}/daily`);
    if (seq !== dailySeq) return;

    state.daily.data = { ...data, accountId: account.id };
    state.daily.loadedAt = Date.now();
  } catch (error) {
    if (seq !== dailySeq) return;

    state.daily.error = error.message;
    state.daily.data = null;
    if (/đăng nhập|đang tắt/i.test(error.message)) {
      await loadAccounts();
    }
  } finally {
    if (seq === dailySeq) {
      state.daily.loading = false;
      state.daily.loadingAccountId = null;
      renderDaily();
    }
  }
}

function renderDaily() {
  const account = selectedDailyAccount();
  const { loading, data, error, pendingFeature, claimingAll, lastBatch } = state.daily;

  els.dailyList.replaceChildren();
  els.dailyEmpty.hidden = true;
  els.dailySummary.hidden = true;
  els.btnClaimAll.disabled = true;
  els.btnClaimAll.textContent = 'Nhận tất cả';

  if (!account) {
    els.dailySynced.textContent = '';
    els.dailyEmpty.hidden = false;
    els.dailyEmptyTitle.textContent = 'Chưa có tài khoản';
    els.dailyEmptyText.textContent = 'Thêm và đăng nhập một tài khoản để xem hoạt động daily.';
    els.dailyFoot.textContent = 'Chọn tài khoản để xem trạng thái nhận thưởng.';
    return;
  }

  els.dailySynced.textContent = data?.syncedAt
    ? `Đồng bộ: ${formatDate(data.syncedAt)}`
    : '';

  if (!account.enabled || account.status !== 'active') {
    const message = !account.enabled
      ? 'Tài khoản đang tắt. Hãy bật lại và đăng nhập để nhận thưởng daily.'
      : 'Tài khoản chưa đăng nhập. Hãy đăng nhập để nhận thưởng daily.';
    els.dailyEmpty.hidden = false;
    els.dailyEmptyTitle.textContent = 'Cần đăng nhập';
    els.dailyEmptyText.textContent = message;
    els.dailyFoot.textContent = message;
    return;
  }

  if (loading && !data) {
    els.dailyList.append(
      el('div', { class: 'daily-loading' }, [
        el('span', { class: 'spinner' }),
        'Đang đọc trạng thái từ game…',
      ]),
    );
    els.dailyFoot.textContent = 'Đang tải trạng thái nhận thưởng.';
    return;
  }

  if (error) {
    const retry = el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Thử lại' });
    retry.addEventListener('click', () => loadDaily({ force: true }));
    els.dailyList.append(
      el('div', { class: 'notice notice-error' }, [
        el('div', { class: 'notice-body' }, [
          el('strong', { text: 'Không đọc được trạng thái daily' }),
          el('small', { text: error }),
        ]),
        retry,
      ]),
    );
    els.dailyFoot.textContent = 'Kiểm tra kết nối hoặc đăng nhập lại tài khoản.';
    return;
  }

  if (!data) {
    els.dailyList.append(
      el('div', { class: 'daily-loading' }, ['Chưa có dữ liệu daily.']),
    );
    return;
  }

  const available = data.features.filter((feature) => feature.available);
  const summaryParts = [`${available.length} mục có thể nhận`];
  if (lastBatch) {
    summaryParts.push(`Lần trước: nhận ${lastBatch.okCount}/${lastBatch.total} mục`);
  }

  els.dailySummary.hidden = false;
  els.dailySummary.replaceChildren(
    el('span', { class: 'daily-summary-dot', 'aria-hidden': 'true' }),
    el('span', { text: summaryParts.join(' · ') }),
  );

  els.btnClaimAll.disabled =
    available.length === 0 || loading || claimingAll || Boolean(pendingFeature);
  els.btnClaimAll.textContent = claimingAll ? 'Đang nhận…' : 'Nhận tất cả';

  for (const feature of data.features) {
    els.dailyList.append(renderDailyItem(feature));
  }

  els.dailyFoot.textContent = `Đã kiểm tra ${data.features.length} hoạt động. Mỗi mục được kiểm tra lại ngay trước khi nhận.`;
}

function renderDailyItem(feature) {
  const { pendingFeature, claimingAll, loading } = state.daily;
  const pending = pendingFeature === feature.id;
  const disabled = !feature.available || loading || claimingAll || Boolean(pendingFeature);

  const button = el('button', {
    class: `btn btn-sm ${feature.available ? 'btn-primary' : 'btn-ghost'}`,
    type: 'button',
  });
  if (pending) {
    button.append(el('span', { class: 'spinner' }), 'Đang nhận…');
  } else if (feature.available) {
    button.append('Nhận');
  } else {
    button.append('Không có');
  }
  button.disabled = disabled;
  button.addEventListener('click', () => claimFeature(feature));

  const countBadge = feature.count
    ? el('span', { class: 'daily-count', text: String(feature.count) })
    : null;

  return el('article', {
    class: 'daily-item',
    dataset: { available: String(feature.available) },
  }, [
    el('span', { class: 'daily-icon' }, [icon(feature.icon || 'gift')]),
    el('div', { class: 'daily-info' }, [
      el('div', { class: 'daily-title' }, [
        el('strong', { text: feature.name }),
        countBadge,
      ]),
      el('small', {
        class: 'daily-detail',
        text: feature.detail || feature.description || '',
        title: feature.detail || feature.description || '',
      }),
    ]),
    button,
  ]);
}

async function claimFeature(feature) {
  const account = selectedDailyAccount();
  if (!account) return;
  if (state.daily.pendingFeature || state.daily.claimingAll) return;

  state.daily.pendingFeature = feature.id;
  state.daily.lastBatch = null;
  renderDaily();

  try {
    const data = await api(`/api/accounts/${account.id}/daily/claim`, {
      method: 'POST',
      body: JSON.stringify({ feature: feature.id }),
    });
    const result = data.result;
    toast(result.message, result.ok ? 'success' : result.skipped ? 'info' : 'error');
    await loadDaily({ force: true });
  } catch (error) {
    toast(error.message, 'error');
    await loadAccounts();
    await loadDaily({ force: true });
  } finally {
    state.daily.pendingFeature = null;
    renderDaily();
  }
}

async function claimAllDaily() {
  const account = selectedDailyAccount();
  if (!account) return;
  if (state.daily.claimingAll || state.daily.pendingFeature) return;

  state.daily.claimingAll = true;
  state.daily.lastBatch = null;
  renderDaily();

  try {
    const data = await api(`/api/accounts/${account.id}/daily/claim-all`, {
      method: 'POST',
      body: '{}',
    });
    const results = data.results || [];
    const okCount = results.filter((result) => result.ok).length;
    state.daily.lastBatch = { okCount, total: results.length };

    const type = okCount === results.length ? 'success' : okCount > 0 ? 'info' : 'error';
    toast(`Đã nhận ${okCount}/${results.length} mục daily.`, type);

    const firstFailure = results.find((result) => !result.ok && !result.skipped);
    if (firstFailure) {
      toast(`${firstFailure.name}: ${firstFailure.message}`, 'warn');
    }

    await loadDaily({ force: true });
  } catch (error) {
    toast(error.message, 'error');
    await loadAccounts();
    await loadDaily({ force: true });
  } finally {
    state.daily.claimingAll = false;
    renderDaily();
  }
}

/* ------------------------------ Logs ------------------------------ */

let logSeq = 0;

async function loadLogs({ reset = false } = {}) {
  const seq = ++logSeq;

  if (reset) {
    state.logs.items = [];
    state.logs.total = 0;
    state.logs.offset = 0;
    state.logs.loaded = false;
  }

  state.logs.loading = true;
  renderLogs();

  try {
    const params = new URLSearchParams({
      limit: '50',
      offset: String(state.logs.offset),
    });
    if (state.logs.accountId !== 'all') {
      params.set('accountId', String(state.logs.accountId));
    }
    if (state.logs.level) params.set('level', state.logs.level);

    const data = await api(`/api/logs?${params.toString()}`);
    if (seq !== logSeq) return;

    state.logs.items.push(...data.logs);
    state.logs.total = data.total;
    state.logs.offset = state.logs.items.length;
    state.logs.loaded = true;
  } catch (error) {
    if (seq !== logSeq) return;
    toast(error.message, 'error');
  } finally {
    if (seq === logSeq) {
      state.logs.loading = false;
      renderLogs();
    }
  }
}

function renderLogs() {
  const { items, total, loading, loaded } = state.logs;

  els.logList.replaceChildren();
  els.logEmpty.hidden = items.length > 0 || loading || !loaded;
  els.logCount.textContent = loaded ? `${total} bản ghi` : '';
  els.btnLogMore.hidden = !loaded || items.length >= total;

  if (loading && items.length === 0) {
    els.logList.append(
      el('div', { class: 'daily-loading' }, [
        el('span', { class: 'spinner' }),
        'Đang tải nhật ký…',
      ]),
    );
    els.logFoot.textContent = 'Đang tải nhật ký.';
    return;
  }

  for (const log of items) {
    els.logList.append(renderLogItem(log));
  }

  if (loaded) {
    els.logFoot.textContent =
      items.length === 0
        ? 'Chưa có bản ghi nào.'
        : `Đang hiển thị ${items.length}/${total} bản ghi.`;
  } else {
    els.logFoot.textContent = 'Chưa có bản ghi nào.';
  }
}

function renderLogItem(log) {
  const level = LEVEL_META[log.level] || LEVEL_META.info;
  const action = ACTION_LABELS[log.action] || log.action;
  const time = formatDate(log.createdAt) || '';

  return el('article', { class: 'log-item' }, [
    el('span', { class: `log-mark ${level.className}`, 'aria-hidden': 'true' }),
    el('div', { class: 'log-body' }, [
      el('div', { class: 'log-head' }, [
        el('strong', { text: action }),
        log.username ? el('span', { class: 'log-user', text: log.username }) : null,
        el('time', { class: 'log-time', text: time }),
      ]),
      el('p', { text: log.message }),
    ]),
    el('span', { class: `log-badge ${level.className}`, text: level.label }),
  ]);
}

/* ------------------------------ Team ------------------------------ */

function selectedTeamAccount() {
  return selectedAccount();
}

let teamSeq = 0;

async function loadTeam({ force = false } = {}) {
  const account = selectedTeamAccount();
  const usable = Boolean(account && account.enabled && account.status === 'active');

  if (!usable) {
    teamSeq += 1;
    state.team.loading = false;
    state.team.loadingAccountId = null;
    state.team.data = null;
    state.team.error = null;
    state.team.plan = null;
    renderTeam();
    return;
  }

  const fresh =
    state.team.data &&
    state.team.data.accountId === account.id &&
    Date.now() - state.team.loadedAt < 60_000;
  if (!force && fresh && !state.team.loading) {
    renderTeam();
    return;
  }

  if (
    !force &&
    state.team.loading &&
    state.team.loadingAccountId === account.id
  ) {
    return;
  }

  const seq = ++teamSeq;
  state.team.loading = true;
  state.team.loadingAccountId = account.id;
  state.team.error = null;
  renderTeam();

  try {
    const data = await api(`/api/accounts/${account.id}/team`);
    if (seq !== teamSeq) return;

    state.team.data = { ...data.state, accountId: account.id };
    state.team.loadedAt = Date.now();
  } catch (error) {
    if (seq !== teamSeq) return;

    state.team.error = error.message;
    state.team.data = null;
    if (/đăng nhập|đang tắt/i.test(error.message)) {
      await loadAccounts();
    }
  } finally {
    if (seq === teamSeq) {
      state.team.loading = false;
      state.team.loadingAccountId = null;
      renderTeam();
    }
  }
}

function starImage(star) {
  const value = Number(star) || 0;
  if (value >= 1 && value <= 5) {
    return el('img', {
      class: 'star-img',
      src: `/assets/star/${value}.png`,
      alt: `${value} sao`,
      title: `${value} sao`,
      loading: 'lazy',
    });
  }
  return el('span', { text: value > 0 ? `${value} sao` : '—' });
}

function elementBadge(attribute) {
  const meta = ELEMENT_META[attribute];
  if (!meta) return el('span', { class: 'mini-badge', text: 'Không rõ hệ' });
  return el('span', { class: 'mini-badge' }, [
    el('img', { src: meta.icon, alt: meta.name, loading: 'lazy' }),
    meta.name,
  ]);
}

function tierBadge(tier) {
  const meta = TIER_META[tier];
  if (!meta || Number(tier) === 0) return null;
  return el('span', {
    class: `mini-badge ${meta.className}`.trim(),
    text: meta.name,
  });
}

function roleBadge(role) {
  const meta = ROLE_META[role] || ROLE_META.atk;
  return el('span', {
    class: `mini-badge ${meta.className}`,
    text: meta.name,
  });
}

function ninjaBadges(ninja) {
  const badges = el('div', { class: 'slot-badges' }, [
    elementBadge(ninja.attribute),
    roleBadge(ninja.role),
  ]);
  const tier = tierBadge(ninja.tier);
  if (tier) badges.append(tier);
  const activeBonds = (ninja.bonds || []).filter((bond) => bond.active).length;
  if (activeBonds > 0) {
    badges.append(
      el('span', { class: 'mini-badge', text: `${activeBonds} bond` }),
    );
  }
  return badges;
}

function renderTeamSummary(data) {
  const cells = [
    ['Lực chiến', formatNumber(data.teamPower), 'P3TeamPower'],
    ['Atk đội', formatNumber(data.battle?.atkSum), 'tổng Atk'],
    ['Def đội', formatNumber(data.battle?.defSum), 'tổng Def'],
    ['Slot mở', `${data.unlockedSlots}/10`, `cấp ${data.playerLevel}`],
    ['Bond active', formatNumber(data.activeBondCount), 'trong đội hiện tại'],
    ['Ninja sở hữu', formatNumber(data.ninjas?.length || 0), 'đã đọc được chỉ số'],
  ];

  els.teamSummary.replaceChildren();
  for (const [label, value, note] of cells) {
    els.teamSummary.append(
      el('div', { class: 'summary-cell' }, [
        el('span', { text: label }),
        el('strong', { text: value }),
        el('small', { text: note }),
      ]),
    );
  }
  els.teamSummary.hidden = false;
}

function renderSlotCard(slot) {
  const card = el('article', { class: 'slot-card' });
  const top = el('div', { class: 'slot-top' }, [
    el('span', { class: 'slot-num' }, [el('b', { text: String(slot.slot) }), 'Slot']),
  ]);

  if (slot.ninja) {
    top.append(roleBadge(slot.ninja.role));
  }
  if (slot.slot === 10) {
    top.append(el('span', { class: 'mini-badge', text: 'Dự bị' }));
  }
  card.append(top);

  if (!slot.unlocked) {
    card.classList.add('locked');
    card.append(
      el('div', { class: 'slot-lock' }, [
        el('span', { text: 'Chưa mở' }),
        el('span', {}, [el('b', { text: `Lv ${slot.unlockLevel}` })]),
      ]),
    );
    return card;
  }

  if (!slot.ninja) {
    card.classList.add('empty');
    card.append(
      el('div', { class: 'slot-empty-mark' }, [
        el('span', { text: 'Slot trống' }),
        el('span', { class: 'empty-note', text: 'Chưa xếp ninja' }),
      ]),
    );
    return card;
  }

  const ninja = slot.ninja;
  card.classList.add('filled');
  card.dataset.ninjaId = String(ninja.id);

  const avatar = el('div', { class: 'ninja-avatar', dataset: { element: String(ninja.attribute || '') } }, [
    ninja.icon
      ? el('img', {
          src: ninja.icon,
          alt: ninja.name,
          loading: 'lazy',
        })
      : el('span', { class: 'empty-note', text: '?' }),
  ]);

  const ident = el('div', { class: 'slot-ident' }, [
    el('h3', { class: 'slot-name', text: ninja.name, title: ninja.name }),
    el('div', { class: 'slot-sub' }, [
      el('span', { text: `Lv ${ninja.level}` }),
      starImage(ninja.star),
    ]),
    ninjaBadges(ninja),
  ]);

  card.append(el('div', { class: 'slot-main' }, [avatar, ident]));

  card.append(
    el('div', { class: 'slot-stats' }, [
      el('div', { class: 'slot-stat' }, [
        el('span', { text: 'Lực chiến' }),
        el('b', { text: formatNumber(ninja.power) }),
      ]),
      el('div', { class: 'slot-stat' }, [
        el('span', { text: 'Công' }),
        el('b', { text: formatNumber(ninja.totalAtk) }),
      ]),
      el('div', { class: 'slot-stat' }, [
        el('span', { text: 'Thủ' }),
        el('b', { text: formatNumber(ninja.totalDef) }),
      ]),
    ]),
  );

  const equipRow = el('div', { class: 'slot-equip' });
  for (const item of [ninja.weapon, ninja.armor]) {
    if (!item) continue;
    equipRow.append(
      el('span', { class: 'equip-chip', title: `${item.name} · Lv ${item.lv ?? '—'}` }, [
        item.icon
          ? el('img', { src: item.icon, alt: item.name, loading: 'lazy' })
          : null,
        el('span', { text: item.name }),
      ]),
    );
  }
  if (equipRow.childNodes.length > 0) card.append(equipRow);

  card.addEventListener('click', () => openNinjaDetail(ninja));
  return card;
}

function renderTeam() {
  const account = selectedTeamAccount();
  const { data, loading, error, plan, planLoading, applying } = state.team;

  els.teamSlots.replaceChildren();
  els.teamPlan.replaceChildren();
  els.teamPlan.hidden = true;
  els.teamSummary.hidden = true;
  els.teamEmpty.hidden = true;
  els.btnStrongest.disabled = true;
  els.btnStrongest.textContent = planLoading ? 'Đang tính…' : 'Dùng đội hình mạnh nhất';
  els.btnTeamRefresh.disabled = loading;

  if (!account) {
    els.teamSynced.textContent = '';
    els.teamEmpty.hidden = false;
    els.teamEmptyTitle.textContent = 'Chưa có tài khoản';
    els.teamEmptyText.textContent = 'Thêm và đăng nhập một tài khoản để xem đội hình.';
    els.teamFoot.textContent = 'Chọn tài khoản để xem đội hình.';
    return;
  }

  els.teamSynced.textContent = data?.readAt
    ? `Đồng bộ: ${formatDate(data.readAt)}`
    : '';

  if (!account.enabled || account.status !== 'active') {
    els.teamEmpty.hidden = false;
    els.teamEmptyTitle.textContent = !account.enabled
      ? 'Tài khoản đang tắt'
      : 'Chưa đăng nhập';
    els.teamEmptyText.textContent = !account.enabled
      ? 'Bật lại tài khoản và đăng nhập để xem đội hình.'
      : 'Đăng nhập tài khoản để đọc đội hình từ game.';
    els.teamFoot.textContent = 'Cần tài khoản đang hoạt động.';
    return;
  }

  if (loading && !data) {
    els.teamEmpty.hidden = false;
    els.teamEmptyTitle.textContent = 'Đang tải đội hình…';
    els.teamEmptyText.textContent = 'Đang đọc slot, ninja, bond và trang bị từ server game.';
    els.teamFoot.textContent = 'Vui lòng chờ trong giây lát.';
    return;
  }

  if (error) {
    els.teamEmpty.hidden = false;
    els.teamEmptyTitle.textContent = 'Không đọc được đội hình';
    els.teamEmptyText.textContent = error;
    els.teamFoot.textContent = 'Thử làm mới hoặc đăng nhập lại.';
    return;
  }

  if (!data) {
    els.teamEmpty.hidden = false;
    els.teamEmptyTitle.textContent = 'Chưa có dữ liệu';
    els.teamEmptyText.textContent = 'Bấm Làm mới để tải đội hình.';
    return;
  }

  renderTeamSummary(data);
  for (const slot of data.slots) {
    els.teamSlots.append(renderSlotCard(slot));
  }

  const filled = data.slots.filter((slot) => slot.ninja).length;
  const unlocked = data.slots.filter((slot) => slot.unlocked).length;
  els.teamFoot.textContent = `${filled}/${unlocked} slot đang dùng · ${data.equipment?.length || 0} trang bị · ${data.activeBondCount} bond active.`;

  els.btnStrongest.disabled = planLoading || applying || unlocked === 0;
  if (plan) renderTeamPlan(plan);
}

function openNinjaDetail(ninja) {
  els.ninjaDialogTitle.textContent = ninja.name;

  const hero = el('div', { class: 'ninja-hero' }, [
    ninja.art || ninja.icon
      ? el('img', {
          class: 'ninja-hero-art',
          src: ninja.art || ninja.icon,
          alt: ninja.name,
        })
      : null,
    el('div', { class: 'ninja-hero-info' }, [
      el('h3', { text: ninja.name }),
      el('div', { class: 'slot-sub' }, [
        el('span', { text: `Lv ${ninja.level}` }),
        starImage(ninja.star),
        el('span', { text: ninja.inTeam ? `Slot ${ninja.teamSlot}` : 'Ngoài đội' }),
      ]),
      ninjaBadges(ninja),
    ]),
  ]);

  const stats = [
    ['Lực chiến', formatNumber(ninja.power), 'tổng Công + Thủ'],
    ['Công', formatNumber(ninja.totalAtk), `gốc ${formatNumber(ninja.atk)}`],
    ['Thủ', formatNumber(ninja.totalDef), `gốc ${formatNumber(ninja.def)}`],
    ['Công trang bị', formatNumber(ninja.equipAtk), 'cộng thẳng'],
    ['Thủ trang bị', formatNumber(ninja.equipDef), 'cộng thẳng'],
    ['Bond Công', `${ninja.bondAtkPct || 0}%`, 'nhân vào Công gốc'],
    ['Bond Thủ', `${ninja.bondDefPct || 0}%`, 'nhân vào Thủ gốc'],
    ['Sao / Ascend', `${ninja.star} / ${ninja.ascend}`, 'tiến hoá'],
  ];

  const grid = el('div', { class: 'detail-grid' });
  for (const [label, value, note] of stats) {
    grid.append(
      el('div', { class: 'detail-stat' }, [
        el('span', { text: label }),
        label === 'Sao / Ascend'
          ? el('b', { class: 'detail-stars' }, [
              starImage(ninja.star),
              ` / ${ninja.ascend}`,
            ])
          : el('b', { text: value }),
        el('small', { text: note }),
      ]),
    );
  }

  const equipmentSection = el('div', { class: 'detail-section' }, [
    el('h4', { text: 'Trang bị' }),
  ]);
  const equipmentList = el('div', { class: 'detail-list' });
  for (const item of ninja.equipment || []) {
    equipmentList.append(
      el('div', { class: 'detail-item' }, [
        item.icon
          ? el('img', { src: item.icon, alt: item.name, loading: 'lazy' })
          : null,
        el('div', { class: 'detail-item-body' }, [
          el('strong', {}, [
            item.name,
            el('span', {
              class: 'bond-type',
            }, [
              `${item.typeName} · Lv ${item.lv ?? '—'} · `,
              starImage(item.star),
            ]),
          ]),
          el('p', {
            text: `Atk +${formatNumber(item.atk)} · Def +${formatNumber(item.def)}`,
          }),
        ]),
      ]),
    );
  }
  if (equipmentList.childNodes.length === 0) {
    equipmentList.append(
      el('p', { class: 'empty-note', text: 'Chưa mặc trang bị.' }),
    );
  }
  equipmentSection.append(equipmentList);

  const bondsSection = el('div', { class: 'detail-section' }, [
    el('h4', { text: 'Bond' }),
  ]);
  const bondList = el('div', { class: 'detail-list' });
  for (const bond of ninja.bonds || []) {
    const typeName =
      bond.type === 1 ? 'Đồng đội' : bond.type === 2 ? 'Trang bị' : bond.type === 3 ? 'Triệu hồi' : 'Khác';
    bondList.append(
      el('div', { class: 'detail-item' }, [
        el('div', { class: 'detail-item-body' }, [
          el('strong', {}, [
            bond.name,
            el('span', { class: `bond-state${bond.active ? ' on' : ''}`, text: bond.active ? 'Đang bật' : 'Chưa bật' }),
            el('span', { class: 'bond-type', text: typeName }),
          ]),
          el('p', { text: bond.infoVi || bond.info || '' }),
        ]),
      ]),
    );
  }
  if (bondList.childNodes.length === 0) {
    bondList.append(
      el('p', {
        class: 'empty-note',
        text: 'Chưa có dữ liệu bond. Game chỉ trả bond cho ninja đang nằm trong đội.',
      }),
    );
  }
  bondsSection.append(bondList);

  const skillsSection = el('div', { class: 'detail-section' }, [
    el('h4', { text: 'Kỹ năng' }),
  ]);
  const skillList = el('div', { class: 'detail-list' });
  for (const skill of ninja.skills || []) {
    skillList.append(
      el('div', { class: 'detail-item' }, [
        skill.icon
          ? el('img', { src: skill.icon, alt: skill.name, loading: 'lazy' })
          : null,
        el('div', { class: 'detail-item-body' }, [
          el('strong', {}, [
            skill.name || `Kỹ năng ${skill.id}`,
            skill.tier
              ? el('span', { class: 'bond-type', text: `Hạng ${skill.tier}` })
              : null,
          ]),
          skill.info ? el('p', { text: skill.info }) : null,
        ]),
      ]),
    );
  }
  if (skillList.childNodes.length === 0) {
    skillList.append(
      el('p', { class: 'empty-note', text: 'Chưa có dữ liệu kỹ năng.' }),
    );
  }
  skillsSection.append(skillList);

  els.ninjaDetail.replaceChildren(hero, grid, equipmentSection, bondsSection, skillsSection);
  if (!els.ninjaDialog.open) els.ninjaDialog.showModal();
}

function renderTeamPlan(plan) {
  const modeName = plan.mode === 'def' ? 'Thủ' : 'Công';
  const head = el('div', { class: 'plan-head' }, [
    el('div', {}, [
      el('h3', { text: `Đề xuất đội hình ưu tiên ${modeName}` }),
      el('p', {
        text: `${plan.ninjaCount} ninja · ${plan.bondCount} bond · Atk ${formatNumber(plan.atkSum)} · Def ${formatNumber(plan.defSum)} · Lực chiến ${formatNumber(plan.power)}`,
      }),
    ]),
  ]);

  const actions = el('div', { class: 'plan-actions' });
  const applyButton = el('button', {
    class: 'btn btn-primary',
    type: 'button',
    text: state.team.applying ? 'Đang áp dụng…' : 'Áp dụng đội hình',
  });
  applyButton.disabled = state.team.applying;
  applyButton.addEventListener('click', () => {
    els.teamApplyText.textContent = `Áp dụng ${plan.ninjaCount} ninja theo hướng ${modeName}, kèm ${plan.ninjaCount * 2} lượt mặc trang bị tối ưu?`;
    els.teamApplyDialog.showModal();
  });
  const clearButton = el('button', {
    class: 'btn btn-ghost',
    type: 'button',
    text: 'Bỏ đề xuất',
  });
  clearButton.addEventListener('click', () => {
    state.team.plan = null;
    renderTeam();
  });
  actions.append(applyButton, clearButton);
  head.append(actions);

  const list = el('div', { class: 'plan-list' });
  for (const entry of plan.slots) {
    const ninja = entry.ninja;
    list.append(
      el('div', { class: 'plan-row' }, [
        el('span', { class: 'slot-num' }, [el('b', { text: String(entry.slot) })]),
        el('div', { class: 'plan-name' }, [
          ninja.icon
            ? el('img', { src: ninja.icon, alt: ninja.name, loading: 'lazy' })
            : null,
          el('div', {}, [
            el('strong', { text: ninja.name }),
            el('small', {
              text: `Lv ${ninja.level} · ${ELEMENT_META[ninja.attribute]?.name || '—'} · ${ninja.bonds.filter((bond) => bond.active).length} bond`,
            }),
          ]),
        ]),
        el('div', { class: 'plan-stats' }, [
          el('span', {}, ['Công ', el('b', { text: formatNumber(ninja.totalAtk) })]),
          el('span', {}, ['Thủ ', el('b', { text: formatNumber(ninja.totalDef) })]),
          el('span', {}, ['LC ', el('b', { text: formatNumber(ninja.power) })]),
        ]),
      ]),
    );
  }

  const warnings = el('div', { class: 'plan-warnings' });
  for (const warning of plan.warnings || []) {
    warnings.append(el('p', { text: warning }));
  }

  els.teamPlan.replaceChildren(head, list);
  if ((plan.warnings || []).length > 0) els.teamPlan.append(warnings);
  els.teamPlan.hidden = false;
}

async function requestStrongestPlan() {
  const account = selectedTeamAccount();
  if (!account || state.team.planLoading || state.team.applying) return;

  state.team.planLoading = true;
  state.team.error = null;
  renderTeam();

  try {
    const data = await api(`/api/accounts/${account.id}/team/plan`, {
      method: 'POST',
      body: JSON.stringify({ mode: state.team.mode }),
    });
    state.team.plan = data.plan;
    const modeName = data.plan.mode === 'def' ? 'Thủ' : 'Công';
    toast(`Đã tạo đề xuất đội hình ưu tiên ${modeName}.`, 'info');
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    state.team.planLoading = false;
    renderTeam();
  }
}

async function doApplyTeam() {
  const account = selectedTeamAccount();
  const plan = state.team.plan;
  if (!account || !plan || state.team.applying) return;

  state.team.applying = true;
  renderTeam();

  try {
    const data = await api(`/api/accounts/${account.id}/team/apply`, {
      method: 'POST',
      body: JSON.stringify({ mode: plan.mode, confirm: true }),
    });

    state.team.data = { ...data.state, accountId: account.id };
    state.team.loadedAt = Date.now();
    state.team.plan = null;
    state.team.lastResult = {
      steps: data.steps?.length || 0,
      ok: data.steps?.filter((step) => step.ok).length || 0,
      errors: data.errors || [],
    };

    if (data.errors?.length > 0) {
      toast(
        `Áp dụng xong nhưng có ${data.errors.length} bước lỗi. Xem chi tiết trong Nhật ký.`,
        'warn',
      );
    } else {
      toast(
        `Đã áp dụng đội hình: ${data.plan.ninjaCount} ninja, ${data.plan.bondCount} bond.`,
        'success',
      );
    }
    await loadAccounts();
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    state.team.applying = false;
    renderTeam();
  }
}

/* ------------------------------ Bag ------------------------------ */

function selectedBagAccount() {
  return selectedAccount();
}

let bagSeq = 0;

async function loadBag({ force = false } = {}) {
  const account = selectedBagAccount();
  const usable = Boolean(account && account.enabled && account.status === 'active');

  if (!usable) {
    bagSeq += 1;
    state.bag.loading = false;
    state.bag.loadingAccountId = null;
    state.bag.data = null;
    state.bag.error = null;
    renderBag();
    return;
  }

  const fresh =
    state.bag.data &&
    state.bag.data.accountId === account.id &&
    Date.now() - state.bag.loadedAt < 60_000;
  if (!force && fresh && !state.bag.loading) {
    renderBag();
    return;
  }

  if (!force && state.bag.loading && state.bag.loadingAccountId === account.id) {
    return;
  }

  const seq = ++bagSeq;
  state.bag.loading = true;
  state.bag.loadingAccountId = account.id;
  state.bag.error = null;
  renderBag();

  try {
    const data = await api(`/api/accounts/${account.id}/bag`);
    if (seq !== bagSeq) return;

    state.bag.data = { ...data.state, accountId: account.id };
    state.bag.loadedAt = Date.now();
  } catch (error) {
    if (seq !== bagSeq) return;

    state.bag.error = error.message;
    state.bag.data = null;
    if (/đăng nhập|đang tắt/i.test(error.message)) {
      await loadAccounts();
    }
  } finally {
    if (seq === bagSeq) {
      state.bag.loading = false;
      state.bag.loadingAccountId = null;
      renderBag();
    }
  }
}

function safeImage(src, alt, className = '', options = {}) {
  if (!src) return null;
  const img = el('img', {
    src,
    alt,
    class: className || undefined,
    loading: 'lazy',
    ...options,
  });
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
  return img;
}

function bagTag(text, className = '') {
  return el('span', { class: `bag-tag ${className}`.trim() }, [
    text?.nodeType ? text : String(text ?? ''),
  ]);
}

function renderBagCurrency(currency) {
  const cells = [
    ['Vàng', currency?.gold],
    ['Kim cương', currency?.diamond],
    ['Năng lượng', currency?.energy],
    ['BP', currency?.bp],
  ].filter(([, value]) => value !== null && value !== undefined);

  els.bagCurrency.replaceChildren();
  if (cells.length === 0) {
    els.bagCurrency.hidden = true;
    return;
  }
  for (const [label, value] of cells) {
    els.bagCurrency.append(
      el('span', { class: 'currency-chip' }, [
        el('span', { text: label }),
        formatNumber(value),
      ]),
    );
  }
  els.bagCurrency.hidden = false;
}

function bagNinjaCard(ninja) {
  const card = el('article', {
    class: `bag-card${ninja.inTeam ? ' in-team' : ''}`,
  });

  const avatar = el('div', { class: 'bag-icon' }, [
    safeImage(ninja.icon, ninja.name),
    !ninja.icon ? el('span', { class: 'empty-note', text: '?' }) : null,
  ]);

  const ident = el('div', { class: 'bag-ident' }, [
    el('h3', { class: 'bag-name', text: ninja.name, title: ninja.name }),
    el('div', { class: 'bag-sub' }, [
      el('span', { text: `Lv ${ninja.level}` }),
      starImage(ninja.star),
    ]),
    el('div', { class: 'bag-tags' }, [
      elementBadge(ninja.attribute),
      roleBadge(ninja.role),
      ninja.inTeam
        ? bagTag(`Trong đội · Slot ${ninja.teamSlot}`, 'team')
        : bagTag('Ngoài đội'),
    ]),
  ]);

  card.append(el('div', { class: 'bag-card-head' }, [avatar, ident]));

  card.append(
    el('div', { class: 'bag-stats' }, [
      el('div', { class: 'bag-stat' }, [
        el('span', { text: 'Công' }),
        el('b', { text: formatNumber(ninja.totalAtk) }),
      ]),
      el('div', { class: 'bag-stat' }, [
        el('span', { text: 'Thủ' }),
        el('b', { text: formatNumber(ninja.totalDef) }),
      ]),
      el('div', { class: 'bag-stat' }, [
        el('span', { text: 'Lực chiến' }),
        el('b', { text: formatNumber(ninja.power) }),
      ]),
      el('div', { class: 'bag-stat' }, [
        el('span', { text: 'Bond' }),
        el('b', { text: formatNumber((ninja.bonds || []).filter((bond) => bond.active).length) }),
      ]),
    ]),
  );

  const actions = el('div', { class: 'bag-card-actions' });
  const detail = el('button', {
    class: 'btn btn-ghost',
    type: 'button',
    text: 'Chi tiết',
  });
  detail.addEventListener('click', () => openNinjaDetail(ninja));
  actions.append(detail);

  const move = el('button', {
    class: 'btn btn-ghost',
    type: 'button',
    text: ninja.inTeam ? 'Đổi chỗ' : 'Xếp đội',
  });
  move.disabled = state.bag.busy;
  move.addEventListener('click', () =>
    ninja.inTeam ? openBagNinjaSwap(ninja) : openBagNinjaSet(ninja),
  );
  actions.append(move);

  card.append(actions);
  return card;
}

function bagEquipmentCard(item) {
  const card = el('article', {
    class: `bag-card${item.equippedBy ? ' equipped' : ''}`,
  });

  const icon = el('div', { class: 'bag-icon equip' }, [
    safeImage(item.icon, item.name),
    !item.icon ? el('span', { class: 'empty-note', text: '?' }) : null,
  ]);

  const ident = el('div', { class: 'bag-ident' }, [
    el('h3', { class: 'bag-name', text: item.name2 || item.name, title: item.name2 || item.name }),
    el('div', { class: 'bag-sub' }, [
      el('span', { text: item.typeName }),
      el('span', { text: `Lv ${item.lv ?? '—'}` }),
      starImage(item.star),
    ]),
    el('div', { class: 'bag-tags' }, [
      item.equippedBy
        ? bagTag(`Đang mặc · ${item.equippedNinjaName || `Ninja ${item.equippedBy}`}`, 'on')
        : bagTag('Trong kho'),
      item.equippedSlot ? bagTag(`Slot ${item.equippedSlot}`) : null,
      !item.statsKnown ? bagTag('Chỉ số ước lượng') : null,
    ]),
  ]);

  card.append(el('div', { class: 'bag-card-head' }, [icon, ident]));

  card.append(
    el('div', { class: 'bag-stats' }, [
      el('div', { class: 'bag-stat' }, [
        el('span', { text: 'Công' }),
        el('b', { text: `+${formatNumber(item.atk)}` }),
      ]),
      el('div', { class: 'bag-stat' }, [
        el('span', { text: 'Thủ' }),
        el('b', { text: `+${formatNumber(item.def)}` }),
      ]),
    ]),
  );

  const actions = el('div', { class: 'bag-card-actions' });
  const equipButton = el('button', {
    class: 'btn btn-ghost',
    type: 'button',
    text: item.equippedBy ? 'Chuyển slot' : 'Mặc',
  });
  equipButton.disabled = state.bag.busy;
  equipButton.addEventListener('click', () => openBagEquip(item));
  actions.append(equipButton);

  if (item.equippedBy) {
    const removeButton = el('button', {
      class: 'btn btn-ghost',
      type: 'button',
      text: 'Tháo',
    });
    removeButton.disabled = state.bag.busy;
    removeButton.addEventListener('click', () => openBagUnequip(item));
    actions.append(removeButton);
  }

  card.append(actions);
  return card;
}

function useTypeLabel(useType) {
  if (useType === 1) return 'Vàng';
  if (useType === 2) return 'Kim cương';
  if (useType === 3) return 'Năng lượng';
  if (useType === 4) return 'BP';
  if (useType === 5) return 'Trứng ninja';
  if (useType === 6) return 'Trứng trang bị';
  return 'Vật phẩm';
}

function bagItemCard(item) {
  const card = el('article', { class: 'bag-card' });
  const icon = el('div', { class: 'bag-icon item' }, [
    safeImage(item.icon, item.name),
    !item.icon ? el('span', { class: 'empty-note', text: '?' }) : null,
  ]);

  const ident = el('div', { class: 'bag-ident' }, [
    el('h3', { class: 'bag-name', text: item.name, title: item.name }),
    el('div', { class: 'bag-sub' }, [
      el('span', { text: useTypeLabel(item.useType) }),
      el('span', { text: `×${formatNumber(item.quantity)}` }),
    ]),
    el('div', { class: 'bag-tags' }, [
      bagTag(`Còn ${formatNumber(item.quantity)}`),
      item.source === 'gem' ? bagTag('Ngọc') : null,
    ]),
  ]);

  card.append(el('div', { class: 'bag-card-head' }, [icon, ident]));

  const maxQty = Math.min(Math.max(1, Number(item.quantity) || 1), 99);
  const qty = el('div', { class: 'bag-qty' }, [
    el('label', { text: 'SL' }),
    el('input', {
      type: 'number',
      min: '1',
      max: String(maxQty),
      value: '1',
      inputmode: 'numeric',
      'aria-label': `Số lượng ${item.name}`,
    }),
  ]);
  const input = qty.querySelector('input');
  const maxButton = el('button', {
    class: 'btn btn-ghost btn-sm max-btn',
    type: 'button',
    title: `Dùng tối đa ${maxQty}`,
    onclick: () => {
      input.value = String(maxQty);
    },
  }, [icon('max'), 'Max']);
  qty.append(maxButton);

  const useButton = el('button', {
    class: 'btn btn-primary',
    type: 'button',
  }, [icon('play'), 'Dùng']);
  useButton.disabled = state.bag.busy || !item.id;
  useButton.addEventListener('click', () => {
    const raw = Number(input.value) || 1;
    const quantity = Math.min(
      Math.max(1, Math.trunc(raw)),
      Math.max(1, Number(item.quantity) || 1),
    );
    input.value = String(quantity);
    openBagUseItem(item, quantity);
  });
  qty.append(useButton);

  card.append(qty);
  return card;
}

function bagGemCard(gem) {
  const card = el('article', { class: 'bag-card' });

  const icon = el('div', { class: 'bag-icon item' }, [
    safeImage(gem.icon, gem.name),
    !gem.icon ? el('span', { class: 'empty-note', text: '◆' }) : null,
  ]);

  const ident = el('div', { class: 'bag-ident' }, [
    el('h3', { class: 'bag-name', text: gem.name, title: gem.name }),
    el('div', { class: 'bag-sub' }, [
      el('span', { text: 'Ngọc' }),
      el('span', { text: `×${formatNumber(gem.quantity)}` }),
    ]),
    el('div', { class: 'bag-tags' }, [
      bagTag(`Còn ${formatNumber(gem.quantity)}`),
      gem.star ? bagTag(starImage(gem.star)) : null,
    ]),
  ]);

  card.append(el('div', { class: 'bag-card-head' }, [icon, ident]));
  return card;
}

function renderBag() {
  const account = selectedBagAccount();
  const { data, loading, error, tab, busy } = state.bag;

  els.bagGrid.replaceChildren();
  els.bagCurrency.replaceChildren();
  els.bagCurrency.hidden = true;
  els.bagEmpty.hidden = true;
  els.btnBagRefresh.disabled = loading || busy;
  els.bagSynced.textContent = data?.readAt ? `Đồng bộ: ${formatDate(data.readAt)}` : '';

  for (const button of els.bagTabs.querySelectorAll('.mode-btn')) {
    button.classList.toggle('active', button.dataset.tab === tab);
  }

  if (!account) {
    els.bagEmpty.hidden = false;
    els.bagEmptyTitle.textContent = 'Chưa có tài khoản';
    els.bagEmptyText.textContent = 'Thêm và đăng nhập một tài khoản để xem túi đồ.';
    els.bagFoot.textContent = 'Chọn tài khoản để xem túi đồ.';
    return;
  }

  if (!account.enabled || account.status !== 'active') {
    els.bagEmpty.hidden = false;
    els.bagEmptyTitle.textContent = !account.enabled
      ? 'Tài khoản đang tắt'
      : 'Chưa đăng nhập';
    els.bagEmptyText.textContent = !account.enabled
      ? 'Bật lại tài khoản và đăng nhập để xem túi đồ.'
      : 'Đăng nhập tài khoản để đọc túi đồ từ game.';
    els.bagFoot.textContent = 'Cần tài khoản đang hoạt động.';
    return;
  }

  if (loading && !data) {
    els.bagEmpty.hidden = false;
    els.bagEmptyTitle.textContent = 'Đang tải túi đồ…';
    els.bagEmptyText.textContent = 'Đang đọc ninja, trang bị và vật phẩm từ server game.';
    els.bagFoot.textContent = 'Vui lòng chờ trong giây lát.';
    return;
  }

  if (error) {
    els.bagEmpty.hidden = false;
    els.bagEmptyTitle.textContent = 'Không đọc được túi đồ';
    els.bagEmptyText.textContent = error;
    els.bagFoot.textContent = 'Thử làm mới hoặc đăng nhập lại.';
    return;
  }

  if (!data) {
    els.bagEmpty.hidden = false;
    els.bagEmptyTitle.textContent = 'Chưa có dữ liệu';
    els.bagEmptyText.textContent = 'Bấm Làm mới để tải túi đồ.';
    return;
  }

  renderBagCurrency(data.currency);

  const list =
    tab === 'ninja'
      ? data.ninjas
      : tab === 'equipment'
        ? data.equipment
        : tab === 'gems'
          ? data.gems
          : (data.items || []).filter((entry) => entry.source === 'item');

  if (!list || list.length === 0) {
    els.bagEmpty.hidden = false;
    if (tab === 'items') {
      els.bagEmptyTitle.textContent = 'Không có vật phẩm';
      els.bagEmptyText.textContent =
        'Server game không trả về vật phẩm nào trong túi, hoặc túi đang trống.';
    } else if (tab === 'equipment') {
      els.bagEmptyTitle.textContent = 'Không có trang bị';
      els.bagEmptyText.textContent = 'Chưa đọc được trang bị nào từ tài khoản này.';
    } else if (tab === 'gems') {
      els.bagEmptyTitle.textContent = 'Không có ngọc';
      els.bagEmptyText.textContent = 'Chưa đọc được ngọc nào từ tài khoản này.';
    } else {
      els.bagEmptyTitle.textContent = 'Không có ninja';
      els.bagEmptyText.textContent = 'Chưa đọc được ninja sở hữu từ tài khoản này.';
    }
  } else {
    for (const entry of list) {
      if (tab === 'ninja') els.bagGrid.append(bagNinjaCard(entry));
      else if (tab === 'equipment') els.bagGrid.append(bagEquipmentCard(entry));
      else if (tab === 'gems') els.bagGrid.append(bagGemCard(entry));
      else els.bagGrid.append(bagItemCard(entry));
    }
  }

  const counts = data.counts || {};
  els.bagFoot.textContent = `${formatNumber(counts.ninjas || 0)} ninja · ${formatNumber(counts.equipment || 0)} trang bị (${formatNumber(counts.equipped || 0)} đang mặc) · ${formatNumber(counts.items || 0)} vật phẩm.`;
}

function openBagAction({ title, confirmText, body, disabled = false, request, message }) {
  state.bag.action = { request, message };
  els.bagActionTitle.textContent = title;
  els.btnBagActionConfirm.textContent = confirmText || 'Xác nhận';
  els.btnBagActionConfirm.disabled = disabled;
  els.bagActionBody.replaceChildren(...body.filter(Boolean));
  if (!els.bagActionDialog.open) els.bagActionDialog.showModal();
}

function bagSlotPicker(data, { requireNinja = false, currentSlot = null } = {}) {
  const list = el('div', { class: 'bag-dialog-list' });
  const options = [];
  const selected = { slot: null };

  for (const slot of data.slots) {
    if (!slot.unlocked) continue;
    if (requireNinja && !slot.ninja) continue;

    const label = el('span', { text: `Slot ${slot.slot}` });
    const note = el('b', {
      text: slot.ninja ? slot.ninja.name : 'Trống',
    });
    const button = el(
      'button',
      {
        class: `bag-slot-option${slot.slot === currentSlot ? ' selected' : ''}`,
        type: 'button',
      },
      [label, note],
    );
    button.disabled = slot.slot === currentSlot;
    button.addEventListener('click', () => {
      selected.slot = slot.slot;
      for (const option of options) option.classList.remove('selected');
      button.classList.add('selected');
      els.btnBagActionConfirm.disabled = false;
    });
    options.push(button);
    list.append(button);
  }

  return {
    list,
    selected,
    hasSlots: options.some((option) => !option.disabled),
  };
}

function openBagNinjaSet(ninja) {
  const data = state.bag.data;
  const picker = bagSlotPicker(data);
  if (!picker.hasSlots) {
    toast('Không có slot đội hình nào đang mở.', 'warn');
    return;
  }

  openBagAction({
    title: `Xếp ${ninja.name} vào đội`,
    confirmText: 'Xếp vào slot',
    disabled: true,
    body: [
      el('p', {
        class: 'bag-dialog-note',
        text: 'Chọn slot muốn xếp ninja. Nếu ninja đang ở slot khác, game sẽ chuyển ninja sang slot mới.',
      }),
      picker.list,
    ],
    request: (account) =>
      api(`/api/accounts/${account.id}/bag/team`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'set',
          slot: picker.selected.slot,
          ninjaId: ninja.id,
        }),
      }),
    message: () => `Đã xếp ${ninja.name} vào slot ${picker.selected.slot}.`,
  });
}

function openBagNinjaSwap(ninja) {
  const data = state.bag.data;
  const picker = bagSlotPicker(data, { currentSlot: ninja.teamSlot });
  if (!picker.hasSlots) {
    toast('Không còn slot nào khác để đổi chỗ.', 'warn');
    return;
  }

  openBagAction({
    title: `Đổi chỗ ${ninja.name}`,
    confirmText: 'Đổi chỗ',
    disabled: true,
    body: [
      el('p', {
        class: 'bag-dialog-note',
        text: `Chọn slot muốn đổi với slot ${ninja.teamSlot}. Ninja ở hai slot sẽ hoán đổi vị trí.`,
      }),
      picker.list,
    ],
    request: (account) =>
      api(`/api/accounts/${account.id}/bag/team`, {
        method: 'POST',
        body: JSON.stringify({
          action: 'swap',
          slotA: ninja.teamSlot,
          slotB: picker.selected.slot,
        }),
      }),
    message: () => `Đã đổi chỗ slot ${ninja.teamSlot} và ${picker.selected.slot}.`,
  });
}

function openBagEquip(item) {
  const data = state.bag.data;
  const picker = bagSlotPicker(data, {
    requireNinja: true,
    currentSlot: item.equippedBy ? item.equippedSlot : null,
  });
  if (!picker.hasSlots) {
    toast('Không còn ninja nào khác để mặc trang bị này.', 'warn');
    return;
  }

  openBagAction({
    title: `${item.equippedBy ? 'Chuyển' : 'Mặc'} ${item.name2 || item.name}`,
    confirmText: item.equippedBy ? 'Chuyển slot' : 'Mặc',
    disabled: true,
    body: [
      el('p', {
        class: 'bag-dialog-note',
        text: `Chọn ninja sẽ mặc ${item.typeName.toLowerCase()} này. Trang bị cùng loại đang mặc sẽ được thay ra.`,
      }),
      picker.list,
    ],
    request: (account) =>
      api(`/api/accounts/${account.id}/bag/equip`, {
        method: 'POST',
        body: JSON.stringify({
          slot: picker.selected.slot,
          equipId: item.id,
          equipSlot: item.type,
        }),
      }),
    message: () => `Đã mặc ${item.name} cho slot ${picker.selected.slot}.`,
  });
}

function openBagUnequip(item) {
  openBagAction({
    title: `Tháo ${item.name2 || item.name}`,
    confirmText: 'Tháo',
    body: [
      el('p', {
        class: 'bag-dialog-note',
        text: `Tháo ${item.typeName.toLowerCase()} khỏi slot ${item.equippedSlot}? Trang bị sẽ trở về kho.`,
      }),
    ],
    request: (account) =>
      api(`/api/accounts/${account.id}/bag/equip`, {
        method: 'POST',
        body: JSON.stringify({
          slot: item.equippedSlot,
          equipId: 0,
          equipSlot: item.type,
        }),
      }),
    message: () => `Đã tháo ${item.name}.`,
  });
}

function openBagUseItem(item, quantity) {
  const egg = item.useType === 5 || item.useType === 6;
  openBagAction({
    title: `Dùng ${item.name}`,
    confirmText: 'Dùng',
    body: [
      el('p', {
        class: 'bag-dialog-note',
        text: egg
          ? `Mở ${quantity} ${item.name}? Kết quả sẽ hiện trong thông báo và Nhật ký.`
          : `Dùng ${quantity} ${item.name}? Thao tác không thể hoàn tác.`,
      }),
    ],
    request: (account) =>
      api(`/api/accounts/${account.id}/bag/use-item`, {
        method: 'POST',
        body: JSON.stringify({ item: item.id, quantity }),
      }),
    message: (payload) => (payload.messages || []).join(' ') || 'Đã dùng vật phẩm.',
  });
}

async function runBagAction(action) {
  const account = selectedBagAccount();
  if (!account || state.bag.busy) return;

  state.bag.busy = true;
  renderBag();

  try {
    const payload = await action.request(account);
    if (payload?.state) {
      state.bag.data = { ...payload.state, accountId: account.id };
      state.bag.loadedAt = Date.now();
      state.team.data = null;
      state.team.loadedAt = 0;
    }
    toast(action.message(payload), payload?.ok === false ? 'warn' : 'success');
    await loadAccounts();
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    state.bag.busy = false;
    renderBag();
  }
}

/* ------------------------------ Craftment ------------------------------ */

let craftSeq = 0;
let craftFuelSeq = 0;

function craftTypeLabel(type) {
  return type === 'equip' ? 'Trang bị' : 'Ninja';
}

async function loadCraft({ force = false } = {}) {
  const account = selectedAccount();
  const usable = Boolean(account && account.enabled && account.status === 'active');

  if (!usable) {
    craftSeq += 1;
    state.craftment.loading = false;
    state.craftment.error = null;
    state.craftment.data = null;
    state.craftment.fuelData = null;
    renderCraft();
    return;
  }
  if (state.craftment.running && !force) {
    renderCraft();
    return;
  }

  const craft = state.craftment;
  const fresh =
    craft.data &&
    craft.data.accountId === account.id &&
    craft.data.type === craft.type &&
    Date.now() - craft.loadedAt < 60_000;
  if (!force && fresh && !craft.loading) {
    renderCraft();
    return;
  }
  if (!force && craft.loading && craft.data?.accountId === account.id) return;

  const seq = ++craftSeq;
  craft.loading = true;
  craft.error = null;
  renderCraft();

  try {
    const payload = await api(
      `/api/accounts/${account.id}/craftment?type=${craft.type}`,
    );
    if (seq !== craftSeq) return;
    craft.data = { ...payload.state, accountId: account.id };
    craft.loadedAt = Date.now();

    const targetIds = (craft.data.targets || []).map((target) => target.id);
    if (!targetIds.includes(craft.targetId)) {
      craft.targetId = targetIds[0] ?? null;
      craft.fuelData = null;
      craft.result = null;
    }
    if (craft.targetId) await loadCraftFuel(craft.targetId);
    else renderCraft();
  } catch (error) {
    if (seq !== craftSeq) return;
    craft.error = error.message;
    craft.data = null;
    toast(error.message, 'error');
  } finally {
    if (seq === craftSeq) {
      craft.loading = false;
      renderCraft();
    }
  }
}

async function loadCraftFuel(targetId) {
  const account = selectedAccount();
  if (!account) return;
  const craft = state.craftment;
  const seq = ++craftFuelSeq;
  craft.targetId = targetId;
  craft.loadingFuel = true;
  craft.fuelData = null;
  craft.selectedFuel = new Set();
  renderCraft();

  try {
    const payload = await api(
      `/api/accounts/${account.id}/craftment/fuel?type=${craft.type}&targetId=${targetId}`,
    );
    if (seq !== craftFuelSeq) return;
    craft.fuelData = { ...payload.state, accountId: account.id };
  } catch (error) {
    if (seq === craftFuelSeq) toast(error.message, 'error');
  } finally {
    if (seq === craftFuelSeq) {
      craft.loadingFuel = false;
      renderCraft();
    }
  }
}

function craftChip(label, value, tone = '') {
  return el('span', { class: `train-chip ${tone}`.trim() }, [
    el('b', { text: String(value) }),
    el('span', { text: label }),
  ]);
}

function craftCard(item, selected, onPick) {
  const card = el('button', {
    class: `craft-card${selected ? ' selected' : ''}`,
    type: 'button',
    onclick: onPick,
  });
  if (item.img) {
    const img = el('img', { class: 'craft-card-img', src: item.img, alt: '' });
    img.addEventListener('error', () => img.remove());
    card.append(img);
  }
  card.append(
    ...[
      el('strong', { text: item.name }),
      el('span', { class: 'craft-card-meta' }, [
        starImage(item.star),
        `Lv ${item.level ?? '?'}`,
      ]),
      item.equipped
        ? el('span', { class: 'craft-card-tag', text: 'Đang có' })
        : null,
    ].filter(Boolean),
  );
  return card;
}

function renderCraft() {
  const craft = state.craftment;
  const account = selectedAccount();
  els.btnCraftRefresh.disabled = craft.loading || craft.running;

  for (const button of els.craftTabs.querySelectorAll('.mode-btn')) {
    button.classList.toggle('active', button.dataset.type === craft.type);
  }
  els.craftSummary.replaceChildren();
  els.craftTargets.replaceChildren();
  els.craftDetail.replaceChildren();
  els.craftEmpty.hidden = true;
  els.craftSynced.textContent = craft.data?.readAt
    ? `Đồng bộ: ${formatDate(craft.data.readAt)}`
    : craft.loading
      ? 'Đang tải…'
      : '';

  if (!account || !account.enabled || account.status !== 'active') {
    els.craftEmpty.hidden = false;
    els.craftEmptyTitle.textContent = !account
      ? 'Chưa có tài khoản'
      : !account.enabled
        ? 'Tài khoản đang tắt'
        : 'Chưa đăng nhập';
    els.craftEmptyText.textContent = 'Chọn tài khoản trong tab Tài khoản, đăng nhập rồi quay lại đây.';
    els.craftFoot.textContent = 'Cần tài khoản đang hoạt động.';
    return;
  }
  if (craft.error && !craft.data) {
    els.craftEmpty.hidden = false;
    els.craftEmptyTitle.textContent = 'Không tải được dữ liệu';
    els.craftEmptyText.textContent = craft.error;
    els.craftFoot.textContent = 'Bấm Làm mới để thử lại.';
    return;
  }
  if (!craft.data) {
    els.craftEmpty.hidden = false;
    els.craftEmptyTitle.textContent = 'Đang tải…';
    els.craftEmptyText.textContent = 'Đang đọc ninja / trang bị từ server game.';
    return;
  }

  const targets = craft.data.targets || [];
  els.craftSummary.append(
    craftChip('Cấp nhân vật', `Lv ${craft.data.playerLevel ?? '—'}`),
    craftChip('Vàng', formatNumber(craft.data.gold), 'good'),
    craftChip('Mục tiêu', targets.length),
  );

  if (targets.length === 0) {
    els.craftEmpty.hidden = false;
    els.craftEmptyTitle.textContent = `Không có ${craftTypeLabel(craft.type)} để nâng`;
    els.craftEmptyText.textContent = 'Tài khoản chưa có ninja / trang bị nào.';
    return;
  }

  for (const target of targets) {
    els.craftTargets.append(
      craftCard(target, target.id === craft.targetId, () =>
        loadCraftFuel(target.id),
      ),
    );
  }

  renderCraftDetail();
  els.craftFoot.textContent = `${account.characterName || account.username} · Chế độ An toàn bỏ qua nguyên liệu có giá trị.`;
}

function renderCraftDetail() {
  const craft = state.craftment;
  const target = (craft.data.targets || []).find((item) => item.id === craft.targetId);
  if (!target) return;

  const head = el('div', { class: 'craft-detail-head' }, [
    target.img
      ? el('img', {
          class: 'craft-detail-img',
          src: target.img,
          alt: '',
          onerror: (e) => { e.target.style.display = 'none'; },
        })
      : null,
    el('div', {}, [
      el('strong', { text: target.name }),
      el('small', {}, [
        starImage(target.star),
        `Lv ${target.level ?? '?'} · EXP ${formatNumber(target.exp ?? 0)}`,
      ]),
    ]),
  ]);
  els.craftDetail.append(head);

  const modeRow = el('div', { class: 'craft-modes' });
  const modes = [
    ['safe', 'An toàn', 'Chỉ nguyên liệu thường'],
    ['all', 'Tất cả', 'Gồm cả nguyên liệu có giá trị'],
    ['custom', 'Thủ công', 'Tự chọn nguyên liệu'],
  ];
  if (!['safe', 'all', 'custom'].includes(craft.mode)) craft.mode = 'safe';
  for (const [mode, label, title] of modes) {
    modeRow.append(
      el('button', {
        class: `mode-btn${craft.mode === mode ? ' active' : ''}`,
        type: 'button',
        title,
        text: label,
        onclick: () => {
          craft.mode = mode;
          renderCraftDetail();
        },
      }),
    );
  }
  els.craftDetail.append(modeRow);

  const stepInput = el('input', {
    id: 'craftMaxSteps',
    type: 'number',
    min: '1',
    max: '100',
    step: '1',
    value: String(craft.maxSteps || 20),
    inputmode: 'numeric',
  });
  stepInput.addEventListener('input', () => {
    const value = Math.trunc(Number(stepInput.value) || 1);
    craft.maxSteps = Math.min(100, Math.max(1, value));
  });
  const fuel = craft.fuelData?.fuel || [];
  const autoIds = craft.fuelData?.autoIds || [];
  const maxButton = el('button', {
    class: 'btn btn-ghost btn-sm max-btn',
    type: 'button',
    title: 'Dùng số nguyên liệu lớn nhất',
    onclick: () => {
      stepInput.value = String(Math.min(100, Math.max(1, autoIds.length)));
      stepInput.dispatchEvent(new Event('input', { bubbles: true }));
    },
  }, [icon('max'), 'Max']);

  els.craftDetail.append(
    el('div', { class: 'craft-control' }, [
      el('label', { class: 'train-field' }, [
        el('span', { text: 'Số nguyên liệu' }),
        el('div', { class: 'input-with-max' }, [stepInput, maxButton]),
        el('small', {
          text: craft.loadingFuel
            ? 'Đang đọc nguyên liệu…'
            : `Server gợi ý ${autoIds.length} nguyên liệu.`,
        }),
      ]),
    ]),
  );

  if (craft.loadingFuel) {
    els.craftDetail.append(
      el('div', { class: 'daily-loading' }, [el('span', { class: 'spinner' }), 'Đang đọc nguyên liệu…']),
    );
    return;
  }

  const safeCount = (craft.fuelData?.safeIds || []).length;
  const valuableCount = fuel.filter((item) => item.valuable).length;
  els.craftDetail.append(
    el('div', { class: 'train-chips craft-fuel-chips' }, [
      craftChip('Nguyên liệu', fuel.length),
      craftChip('An toàn', safeCount, 'good'),
      craftChip('Có giá trị', valuableCount, valuableCount ? 'warn' : ''),
      craftChip('Tổng EXP', formatNumber(craft.fuelData?.totalFuelExp ?? 0), 'accent'),
    ]),
  );

  if (craft.mode === 'custom') {
    if (!craft.selectedFuel) craft.selectedFuel = new Set();
    const list = el('div', { class: 'craft-fuel-list' });
    for (const item of fuel.slice(0, 60)) {
      const checked = craft.selectedFuel.has(item.id);
      const box = el('input', { type: 'checkbox' });
      box.checked = checked;
      box.addEventListener('change', () => {
        if (box.checked) craft.selectedFuel.add(item.id);
        else craft.selectedFuel.delete(item.id);
      });
      list.append(
        el('label', { class: `craft-fuel-row${item.valuable ? ' valuable' : ''}` }, [
          box,
          item.img ? el('img', { src: item.img, alt: '' }) : null,
          el('span', { text: item.name }),
          el('small', {}, [
            starImage(item.star),
            `+${item.exp} EXP`,
          ]),
          item.valuable ? el('span', { class: 'craft-card-tag', text: 'Có giá trị' }) : null,
        ]),
      );
    }
    els.craftDetail.append(list);
  }

  const runButton = el('button', {
    class: 'btn btn-primary craft-run',
    type: 'button',
    disabled: craft.running || fuel.length === 0,
  }, [icon('hammer'), 'Nâng cấp']);
  runButton.addEventListener('click', openCraftConfirm);
  els.craftDetail.append(runButton);

  if (craft.result && craft.result.targetId === craft.targetId) {
    const r = craft.result;
    els.craftDetail.append(
      el('div', { class: 'train-chips craft-result' }, [
        craftChip('Đã nâng', `${r.fuelUsed}/${r.steps.length}`, r.fuelUsed ? 'good' : 'bad'),
        craftChip(
          'Level',
          `${r.before?.level ?? '?'} → ${r.after?.level ?? '?'}`,
          'accent',
        ),
        craftChip('EXP', `+${formatNumber(r.gainedExp)}`),
        craftChip(
          'Trạng thái',
          r.stopReason ? 'Đã dừng' : 'Đã hoàn thành',
          r.stopReason ? 'warn' : 'good',
        ),
      ]),
    );
  }
}

function openCraftConfirm() {
  const craft = state.craftment;
  const account = selectedAccount();
  if (!account || !craft.data || !craft.targetId) return;
  const target = (craft.data.targets || []).find((item) => item.id === craft.targetId);
  if (!target) return;

  const steps = Math.min(100, Math.max(1, Number(craft.maxSteps) || 20));
  const mode = craft.mode || 'safe';
  if (mode === 'custom' && !(craft.selectedFuel?.size > 0)) {
    toast('Chọn ít nhất một nguyên liệu.', 'error');
    return;
  }
  craft.confirm = { steps, mode, fired: false };

  const lines = [
    ['Tài khoản', account.characterName || account.username],
    ['Mục tiêu', `${craftTypeLabel(craft.type)} ${target.name} (Lv ${target.level ?? '?'})`],
    ['Chế độ', mode === 'safe' ? 'An toàn' : mode === 'all' ? 'Tất cả' : 'Thủ công'],
    ['Số nguyên liệu', steps],
  ];
  const list = el('dl', { style: 'display:flex;flex-direction:column;gap:9px;margin:0' });
  for (const [label, value] of lines) {
    list.append(
      el('div', { style: 'display:flex;justify-content:space-between;gap:16px' }, [
        el('dt', { class: 'hint', text: label }),
        el('dd', { style: 'margin:0;text-align:right', text: String(value) }),
      ]),
    );
  }
  els.craftConfirmBody.replaceChildren(list);
  els.craftConfirmDialog.returnValue = '';
  if (!els.craftConfirmDialog.open) els.craftConfirmDialog.showModal();
}

async function requestCraftUpgrade() {
  const craft = state.craftment;
  const account = selectedAccount();
  if (!account || craft.running) return;

  craft.running = true;
  craft.result = null;
  renderCraft();

  try {
    const payload = await api(`/api/accounts/${account.id}/craftment/upgrade`, {
      method: 'POST',
      body: JSON.stringify({
        confirm: true,
        type: craft.type,
        targetId: craft.targetId,
        mode: craft.mode || 'safe',
        maxSteps: Math.min(100, Math.max(1, Number(craft.maxSteps) || 20)),
        fuelIds: craft.mode === 'custom' ? [...(craft.selectedFuel || [])] : [],
      }),
    });
    const r = payload.result;
    craft.result = { ...r, accountId: account.id };
    toast(
      `Nâng cấp: ${r.fuelUsed}/${r.steps.length} nguyên liệu · Lv ${r.before?.level ?? '?'} → ${r.after?.level ?? '?'}` +
        (r.stopReason ? ` · ${r.stopReason}` : ''),
      r.fuelUsed > 0 ? 'success' : 'warn',
    );
    await loadAccounts();
    await loadCraft({ force: true });
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    craft.running = false;
    renderCraft();
  }
}

/* ------------------------------ Gacha ------------------------------ */

let gachaSeq = 0;

function selectedGachaAccount() {
  return selectedAccount();
}

function gachaStopLabel(reason) {
  const labels = {
    'insufficient-gold': 'Hết Vàng cho vòng tốt nhất',
    rejected: 'Server từ chối lượt quay',
    'api-error': 'Lỗi kết nối tới server game',
  };
  if (!reason) return 'Hoàn tất';
  return labels[reason] || String(reason);
}

async function loadGacha({ force = false } = {}) {
  const account = selectedGachaAccount();
  const usable = Boolean(account && account.enabled && account.status === 'active');

  if (!usable) {
    gachaSeq += 1;
    state.gacha.loading = false;
    state.gacha.loadingAccountId = null;
    state.gacha.error = null;
    state.gacha.data = null;
    renderGacha();
    return;
  }

  if (state.gacha.running && !force) {
    renderGacha();
    return;
  }

  const fresh =
    state.gacha.data &&
    state.gacha.data.accountId === account.id &&
    Date.now() - state.gacha.loadedAt < 60_000;
  if (!force && fresh && !state.gacha.loading) {
    renderGacha();
    return;
  }
  if (!force && state.gacha.loading && state.gacha.loadingAccountId === account.id) {
    return;
  }

  const seq = ++gachaSeq;
  state.gacha.loading = true;
  state.gacha.loadingAccountId = account.id;
  state.gacha.error = null;
  renderGacha();

  try {
    const payload = await api(`/api/accounts/${account.id}/gacha`);
    if (seq !== gachaSeq) return;
    state.gacha.data = { ...payload.state, accountId: account.id };
    state.gacha.loadedAt = Date.now();
  } catch (error) {
    if (seq !== gachaSeq) return;
    state.gacha.error = error.message;
    state.gacha.data = null;
    toast(error.message, 'error');
    if (/đăng nhập|đang tắt/i.test(error.message)) {
      await loadAccounts();
      renderGacha();
    }
  } finally {
    if (seq === gachaSeq) {
      state.gacha.loading = false;
      state.gacha.loadingAccountId = null;
      renderGacha();
    }
  }
}

function gachaChip(label, value, tone = '') {
  return el('span', { class: `train-chip ${tone}`.trim() }, [
    el('b', {}, [value?.nodeType ? value : String(value)]),
    el('span', { text: label }),
  ]);
}

function renderGacha() {
  const account = selectedGachaAccount();
  const { data, loading, error, running, result } = state.gacha;

  els.gachaEmpty.hidden = true;
  els.gachaResults.replaceChildren();
  els.gachaSummary.replaceChildren();
  els.btnGachaRefresh.disabled = loading || running;
  els.btnGachaDraw.disabled = loading || running;

  els.gachaSynced.textContent = loading
    ? 'Đang tải…'
    : data?.readAt
      ? `Đồng bộ: ${formatDate(data.readAt)}`
      : '';

  if (!account) {
    els.gachaEmpty.hidden = false;
    els.gachaEmptyTitle.textContent = 'Chưa có tài khoản';
    els.gachaEmptyText.textContent = 'Thêm và đăng nhập một tài khoản để quay ninja.';
    els.gachaFoot.textContent = 'Chọn tài khoản để quay ninja.';
    els.gachaAfford.textContent = '';
    return;
  }

  if (!account.enabled || account.status !== 'active') {
    els.gachaEmpty.hidden = false;
    els.gachaEmptyTitle.textContent = !account.enabled ? 'Tài khoản đang tắt' : 'Chưa đăng nhập';
    els.gachaEmptyText.textContent = !account.enabled
      ? 'Bật lại tài khoản và đăng nhập để quay ninja.'
      : 'Đăng nhập tài khoản để đọc số Vàng từ game.';
    els.gachaFoot.textContent = 'Cần tài khoản đang hoạt động.';
    els.gachaAfford.textContent = '';
    return;
  }

  if (error && !data) {
    els.gachaEmpty.hidden = false;
    els.gachaEmptyTitle.textContent = 'Không tải được dữ liệu';
    els.gachaEmptyText.textContent = error;
    els.gachaFoot.textContent = 'Kiểm tra kết nối rồi bấm Làm mới.';
    els.gachaAfford.textContent = '';
    return;
  }

  const gold = data?.gold;
  const cost = data?.cost ?? 80000;
  const affordable = data?.affordable;
  const bestTier = data?.bestTier;

  if (data) {
    els.gachaSummary.append(
      gachaChip('Vòng tốt nhất', `btn ${bestTier?.btn ?? 4} · 3–5 sao`, 'accent'),
      gachaChip('Giá / lượt', formatNumber(cost)),
      gachaChip('Vàng hiện có', formatNumber(gold), 'good'),
      gachaChip(
        'Có thể quay',
        affordable === null ? '—' : formatNumber(affordable),
        affordable > 0 ? 'good' : 'bad',
      ),
    );
  }

  if (affordable !== null) {
    els.gachaAfford.textContent = affordable > 0
      ? `Đủ Vàng cho ${formatNumber(affordable)} lượt ở vòng tốt nhất.`
      : 'Không đủ Vàng cho vòng tốt nhất.';
  } else {
    els.gachaAfford.textContent = loading ? 'Đang đọc số Vàng…' : '';
  }

  if (result && result.accountId === account.id) {
    renderGachaResult(result);
  }

  const name = account.characterName || account.username;
  els.gachaFoot.textContent = `${name} · Luôn quay vòng tốt nhất (btn 4) · Không tiêu Kim cương.`;
}

function renderGachaResult(result) {
  els.gachaResults.append(
    el('div', { class: 'train-chips gacha-result-head' }, [
      gachaChip(
        'Hoàn tất',
        `${result.completed}/${result.requested}`,
        result.completed > 0 ? 'good' : 'bad',
      ),
      gachaChip('Cao nhất', starImage(result.bestStars), result.bestStars >= 4 ? 'accent' : ''),
      gachaChip('Vàng đã tiêu', formatNumber(result.goldSpent ?? 0)),
      gachaChip(
        'Kết quả',
        gachaStopLabel(result.stopReason),
        result.stopReason ? 'warn' : 'good',
      ),
    ]),
  );

  const grid = el('div', { class: 'gacha-grid' });
  for (const entry of result.results || []) {
    const card = el('div', { class: `gacha-card${entry.ok ? '' : ' gacha-card-fail'}` });
    if (entry.ok && entry.img) {
      const img = el('img', {
        class: 'gacha-card-img',
        src: entry.img,
        alt: '',
        loading: 'lazy',
      });
      img.addEventListener('error', () => img.remove());
      card.append(img);
    }
    card.append(
      el('span', { class: 'gacha-card-draw', text: `#${entry.draw}` }),
      el('strong', { class: 'gacha-card-star' }, [
        entry.ok ? starImage(entry.star) : 'Lỗi',
      ]),
      el('small', {
        class: 'gacha-card-meta',
        text: entry.ok
          ? entry.name || `ninja #${entry.ninja ?? '?'}`
          : entry.error || 'Không thành công',
      }),
    );
    grid.append(card);
  }
  els.gachaResults.append(grid);
}

function openGachaConfirm() {
  const account = selectedGachaAccount();
  const data = state.gacha.data;
  if (!account || !data || state.gacha.running) return;

  const draws = Number(els.gachaDraws.value);
  if (!Number.isInteger(draws) || draws < 1 || draws > 100) {
    toast('Nhập số lượt từ 1 đến 100.', 'error');
    return;
  }
  if (data.affordable !== null && data.affordable < 1) {
    toast('Không đủ Vàng cho vòng tốt nhất.', 'error');
    return;
  }

  const cost = data.cost ?? 80000;
  const planned = Math.min(draws, data.affordable ?? draws);
  state.gacha.confirm = { draws, fired: false };

  const list = el('dl', { style: 'display:flex;flex-direction:column;gap:9px;margin:0' });
  const lines = [
    { label: 'Tài khoản', value: account.characterName || account.username },
    { label: 'Vòng quay', value: `btn ${data.bestTier?.btn ?? 4} · 3–5 sao (tốt nhất)` },
    {
      label: 'Số lượt',
      value: `${draws} lượt${planned < draws ? ` (dự kiến quay ${planned})` : ''}`,
    },
    {
      label: 'Vàng dự kiến',
      value: `${formatNumber(cost)} × ${planned} = ${formatNumber(cost * planned)}`,
      tone: 'warn',
    },
  ];
  for (const line of lines) {
    list.append(
      el('div', { style: 'display:flex;justify-content:space-between;gap:16px' }, [
        el('dt', { class: 'hint', text: line.label }),
        el('dd', {
          style: `margin:0;text-align:right${line.tone === 'warn' ? ';color:var(--yellow)' : ''}`,
          text: String(line.value),
        }),
      ]),
    );
  }
  els.gachaConfirmBody.replaceChildren(list);
  els.gachaConfirmDialog.returnValue = '';
  if (!els.gachaConfirmDialog.open) els.gachaConfirmDialog.showModal();
}

async function requestGachaDraw(draws) {
  const account = selectedGachaAccount();
  if (!account || state.gacha.running) return;

  state.gacha.running = true;
  state.gacha.result = null;
  renderGacha();

  try {
    const payload = await api(`/api/accounts/${account.id}/gacha/draw`, {
      method: 'POST',
      body: JSON.stringify({ confirm: true, draws }),
    });
    const r = payload.result;
    state.gacha.result = { ...r, accountId: account.id };
    toast(
      `Quay ninja: ${r.completed}/${r.requested} lượt, cao nhất ${r.bestStars} sao` +
        (r.stopReason ? ` · ${gachaStopLabel(r.stopReason)}` : ''),
      r.completed > 0 ? 'success' : 'warn',
    );
    await loadAccounts();
    await loadGacha({ force: true });
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    state.gacha.running = false;
    renderGacha();
  }
}

/* ------------------------------ Training ------------------------------ */

function resetTrainingData() {
  trainingSeq += 1;
  state.training.loading = false;
  state.training.loadingAccountId = null;
  state.training.story = null;
  state.training.data = null;
  state.training.loadedAt = 0;
  state.training.error = null;
  state.training.storyResult = null;
  state.training.dungeonResult = null;
  state.training.ultimateResult = null;
  state.training.storyScid = 0;
  state.training.storyUseItems = false;
  state.training.dungeonCave = 1;
  state.training.dungeonMode = 1;
  state.training.dungeonTier = 0;
  state.training.dungeonStageNo = 0;
}

function selectedTrainingAccount() {
  return selectedAccount();
}

let trainingSeq = 0;

async function loadTraining({ force = false } = {}) {
  const account = selectedTrainingAccount();
  const usable = Boolean(account && account.enabled && account.status === 'active');

  if (!usable) {
    trainingSeq += 1;
    state.training.loading = false;
    state.training.loadingAccountId = null;
    state.training.error = null;
    renderTraining();
    return;
  }

  if (state.training.running && !force) {
    renderTraining();
    return;
  }

  const tab = state.training.tab;
  const source = tab === 'story' ? state.training.story : state.training.data;
  const fresh =
    source &&
    source.accountId === account.id &&
    Date.now() - state.training.loadedAt < 60_000;
  if (!force && fresh && !state.training.loading) {
    renderTraining();
    return;
  }

  if (
    !force &&
    state.training.loading &&
    state.training.loadingAccountId === account.id
  ) {
    return;
  }

  const seq = ++trainingSeq;
  state.training.loading = true;
  state.training.loadingAccountId = account.id;
  state.training.error = null;
  renderTraining();

  const path =
    tab === 'story'
      ? `/api/accounts/${account.id}/story`
      : `/api/accounts/${account.id}/training`;

  try {
    const payload = await api(path);
    if (seq !== trainingSeq) return;

    if (tab === 'story') {
      state.training.story = { ...payload.state, accountId: account.id };
    } else {
      state.training.data = { ...payload.state, accountId: account.id };
    }
    state.training.loadedAt = Date.now();
  } catch (error) {
    if (seq !== trainingSeq) return;

    state.training.error = error.message;
    if (tab === 'story') state.training.story = null;
    else state.training.data = null;
    toast(error.message, 'error');
    if (/đăng nhập|đang tắt/i.test(error.message)) {
      await loadAccounts();
      renderTraining();
    }
  } finally {
    if (seq === trainingSeq) {
      state.training.loading = false;
      state.training.loadingAccountId = null;
      renderTraining();
    }
  }
}

function renderTraining() {
  const account = selectedTrainingAccount();
  const { tab, loading, running, error, story, data } = state.training;
  const source = tab === 'story' ? story : data;

  renderTrainingTabs();

  els.trainingEmpty.hidden = true;
  els.btnTrainingRefresh.disabled = loading || running;

  if (!account) {
    els.trainingSynced.textContent = '';
    els.trainingStory.replaceChildren();
    els.trainingDungeon.replaceChildren();
    els.trainingUltimate.replaceChildren();
    els.trainingStory.hidden = true;
    els.trainingDungeon.hidden = true;
    els.trainingUltimate.hidden = true;
    els.trainingEmpty.hidden = false;
    els.trainingEmptyTitle.textContent = 'Chưa có tài khoản';
    els.trainingEmptyText.textContent =
      'Thêm và đăng nhập một tài khoản để dùng tab Huấn luyện.';
    els.trainingFoot.textContent = 'Chọn tài khoản để xem huấn luyện.';
    return;
  }

  if (!account.enabled || account.status !== 'active') {
    els.trainingSynced.textContent = '';
    els.trainingStory.replaceChildren();
    els.trainingDungeon.replaceChildren();
    els.trainingUltimate.replaceChildren();
    els.trainingStory.hidden = true;
    els.trainingDungeon.hidden = true;
    els.trainingUltimate.hidden = true;
    els.trainingEmpty.hidden = false;
    els.trainingEmptyTitle.textContent = !account.enabled
      ? 'Tài khoản đang tắt'
      : 'Chưa đăng nhập';
    els.trainingEmptyText.textContent = !account.enabled
      ? 'Bật lại tài khoản và đăng nhập để dùng tab Huấn luyện.'
      : 'Đăng nhập tài khoản để đọc dữ liệu huấn luyện từ game.';
    els.trainingFoot.textContent = 'Cần tài khoản đang hoạt động.';
    return;
  }

  els.trainingSynced.textContent = loading
    ? 'Đang tải…'
    : source?.readAt
      ? `Đồng bộ: ${formatDate(source.readAt)}`
      : '';

  if (tab === 'story') renderStory();
  else if (tab === 'dungeon') renderDungeon();
  else renderUltimate();

  if (error && !source) {
    els.trainingFoot.textContent = 'Không tải được dữ liệu. Kiểm tra kết nối rồi thử lại.';
    return;
  }

  if (loading && !source) {
    els.trainingFoot.textContent = 'Đang tải dữ liệu huấn luyện…';
    return;
  }

  const name = account.characterName || account.username;
  const readLabel = source?.readAt ? `Đọc lúc ${formatDate(source.readAt)}` : 'Chưa có dữ liệu';
  els.trainingFoot.textContent = `${name} · ${readLabel} · Không tiêu Kim cương, không mua lượt.`;
}

function renderTrainingTabs() {
  const tab = state.training.tab;
  for (const button of els.trainingTabs.querySelectorAll('.train-tab')) {
    const active = button.dataset.tab === tab;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  }
  els.trainingStory.hidden = tab !== 'story';
  els.trainingDungeon.hidden = tab !== 'dungeon';
  els.trainingUltimate.hidden = tab !== 'ultimate';
}

function renderTrainingLoading(panel, text) {
  panel.replaceChildren(
    el('div', { class: 'daily-loading' }, [el('span', { class: 'spinner' }), text]),
  );
}

function renderTrainingError(panel) {
  const retry = el('button', {
    class: 'btn btn-ghost btn-sm',
    type: 'button',
    text: 'Thử lại',
  });
  retry.addEventListener('click', () => loadTraining({ force: true }));
  panel.replaceChildren(
    el('div', { class: 'notice notice-error' }, [
      el('div', { class: 'notice-body' }, [
        el('strong', { text: 'Không tải được dữ liệu huấn luyện' }),
        el('small', { text: state.training.error || 'Lỗi không xác định.' }),
      ]),
      retry,
    ]),
  );
}

function trainChip(label, value, tone = '') {
  return el('span', { class: `train-chip ${tone}`.trim() }, [
    el('b', { text: String(value) }),
    el('span', { text: label }),
  ]);
}

function trainField(label, control, hint) {
  return el('label', { class: 'train-field' }, [
    el('span', { text: label }),
    control,
    hint ? el('small', { text: hint }) : null,
  ]);
}

function trainModeButton(label, active, dataset) {
  const button = el('button', {
    class: `mode-btn${active ? ' active' : ''}`,
    type: 'button',
    text: label,
  });
  for (const [key, value] of Object.entries(dataset)) button.dataset[key] = value;
  return button;
}

function trainGain(value) {
  if (value === null || value === undefined) return '—';
  return `+${formatNumber(value)}`;
}

function trainResultBadge(win) {
  if (win === true) return el('span', { class: 'train-badge win', text: 'Thắng' });
  if (win === false) return el('span', { class: 'train-badge loss', text: 'Thua' });
  return el('span', { class: 'train-badge unknown', text: 'Chưa rõ' });
}

function stopReasonLabel(reason) {
  const labels = {
    'max-runs': 'Đã đạt giới hạn số trận',
    energy: 'Hết năng lượng',
    loss: 'Thua trận',
    locked: 'Stage đang khóa',
    'no-ninja': 'Chưa có đội hình',
    'item-cap': 'Đã đạt giới hạn dùng vật phẩm hôm nay',
    'no-items': 'Không còn vật phẩm hồi năng lượng',
    'item-error': 'Lỗi khi dùng vật phẩm',
    'item-no-effect': 'Vật phẩm không hồi năng lượng',
    'stage-missing': 'Không tìm thấy stage',
    'bad-stage': 'Stage không hợp lệ',
    unverified: 'Không xác thực được kết quả trận',
    'progress-stalled': 'Cốt truyện không tiến thêm',
    'no-run': 'Hết lượt',
    closed: 'Động đang đóng',
    'low-level': 'Chưa đủ cấp — hãy tăng Level nhân vật',
    pending: 'Cần nhận buff/thưởng trước',
    'bad-param': 'Tham số không hợp lệ',
  };
  if (!reason) return 'Hoàn tất';
  if (labels[reason]) return labels[reason];
  if (String(reason).startsWith('error:')) return `Lỗi: ${String(reason).slice(6)}`;
  return String(reason);
}

function storySourceLabel(source) {
  if (source === 'measured') return 'Đo thực tế';
  if (source === 'reference') return 'Tham khảo';
  if (source === 'catalog') return 'Danh mục';
  if (source === 'current') return 'Hiện tại';
  return source || '—';
}

function parseCaveStageValue(value) {
  const parts = String(value || '').split(':');
  return {
    tier: Math.max(0, Math.trunc(Number(parts[0]) || 0)),
    stageNo: Math.max(0, Math.trunc(Number(parts[1]) || 0)),
  };
}

function requestTrainingStop() {
  if (!state.training.running) return;
  state.training.abort = true;
  toast('Sẽ dừng sau lượt hiện tại.', 'info');
}

function openTrainingConfirm({ title, lines = [], confirmLabel = 'Chạy', onConfirm }) {
  state.training.confirm = {
    onConfirm,
    fired: false,
  };

  els.trainingConfirmTitle.textContent = title || 'Xác nhận';
  els.btnTrainingConfirm.textContent = confirmLabel || 'Chạy';

  const list = el('dl', {
    style: 'display:flex;flex-direction:column;gap:9px;margin:0',
  });
  for (const line of lines) {
    if (!line) continue;
    const tone =
      line.tone === 'warn'
        ? 'color:var(--yellow)'
        : line.tone === 'bad'
          ? 'color:var(--red)'
          : line.tone === 'good'
            ? 'color:var(--green)'
            : 'color:var(--text)';
    list.append(
      el('div', {
        style:
          'display:flex;gap:12px;justify-content:space-between;align-items:baseline;flex-wrap:wrap',
      }, [
        el('dt', {
          style: 'color:var(--muted);font-size:12px;flex:0 0 auto',
          text: line.label || '',
        }),
        el('dd', {
          style: `margin:0;font-size:12.5px;font-weight:600;text-align:right;flex:1 1 55%;overflow-wrap:anywhere;${tone}`,
          text: line.value === null || line.value === undefined ? '—' : String(line.value),
        }),
      ]),
    );
  }

  els.trainingConfirmBody.replaceChildren(list);
  els.trainingConfirmDialog.returnValue = '';
  if (!els.trainingConfirmDialog.open) els.trainingConfirmDialog.showModal();
}

/* ------------------------------ Training · Story ------------------------------ */

function renderStory() {
  els.trainingStory.replaceChildren();
  const { story, loading, error } = state.training;

  if (loading && !story) {
    renderTrainingLoading(els.trainingStory, 'Đang đọc cốt truyện từ game…');
    return;
  }
  if (error && !story) {
    renderTrainingError(els.trainingStory);
    return;
  }
  if (!story) {
    els.trainingStory.append(
      el('div', { class: 'daily-loading', text: 'Chưa có dữ liệu cốt truyện.' }),
    );
    return;
  }

  const progress = story.progress || {};
  const vitals = story.vitals || {};
  const energyItems = story.energyItems || [];
  const energyLabel =
    Number(vitals.energyLimit) > 0
      ? `Năng lượng · item ${formatNumber(vitals.energyUsed)}/${formatNumber(vitals.energyLimit)}`
      : 'Năng lượng';

  const chips = el('div', { class: 'train-chips' }, [
    trainChip(
      `Tiến độ · Scid ${formatNumber(progress.scid)}`,
      `Ch.${progress.chapter}-${progress.stageNo}`,
      'accent',
    ),
    trainChip(energyLabel, `${formatNumber(vitals.energy)}/${formatNumber(vitals.energyMax)}`),
    trainChip('Vàng', formatNumber(vitals.gold)),
    trainChip('Cấp', `Lv ${vitals.level}`),
    trainChip('EXP', `${formatNumber(vitals.exp)}/${formatNumber(vitals.expMax)}`),
    trainChip('Lực chiến', formatNumber(vitals.power)),
  ]);

  const modeSwitch = el('div', { class: 'mode-switch' }, [
    trainModeButton('Cày lại', state.training.storyMode === 'farm', { storyMode: 'farm' }),
    trainModeButton('Đẩy cốt truyện', state.training.storyMode === 'push', { storyMode: 'push' }),
  ]);
  modeSwitch.addEventListener('click', (event) => {
    if (state.training.running) return;
    const button = event.target.closest('[data-story-mode]');
    if (!button) return;
    const mode = button.dataset.storyMode === 'push' ? 'push' : 'farm';
    if (state.training.storyMode === mode) return;
    state.training.storyMode = mode;
    renderStory();
  });

  const cleared = (story.stages || []).filter((stage) => stage.scid < progress.scid);
  let selectedScid = Math.trunc(Number(state.training.storyScid) || 0);
  if (!cleared.some((stage) => stage.scid === selectedScid)) {
    const best = story.suggestions?.exp?.[0] || null;
    if (best && cleared.some((stage) => stage.scid === best.scid)) {
      selectedScid = best.scid;
    } else if (cleared.length > 0) {
      selectedScid = cleared[cleared.length - 1].scid;
    } else {
      selectedScid = 0;
    }
    state.training.storyScid = selectedScid;
  }

  let stageControl;
  if (state.training.storyMode === 'farm') {
    const select = el('select', { id: 'storyStage' });
    if (cleared.length === 0) {
      select.append(el('option', { value: '', text: 'Chưa có stage đã qua' }));
      select.disabled = true;
    } else {
      for (const stage of cleared) {
        const boss = stage.isBoss ? ' · Boss' : '';
        select.append(
          el('option', {
            value: String(stage.scid),
            text: `Ch.${stage.chapter}-${stage.stageNo} · ${formatNumber(stage.energy)} NL · ${formatNumber(stage.exp)} EXP · ${formatNumber(stage.gold)} vàng${boss}`,
          }),
        );
      }
      select.value = String(selectedScid);
      select.disabled = state.training.running;
    }
    select.addEventListener('change', () => {
      state.training.storyScid = Math.trunc(Number(select.value) || 0);
    });
    stageControl = trainField(
      'Stage cày lại',
      select,
      'Chỉ hiện các stage đã qua. Chế độ đẩy cốt truyện bỏ qua lựa chọn này.',
    );
  } else {
    const current =
      (story.stages || []).find((stage) => stage.scid === progress.scid) ||
      story.suggestions?.current ||
      null;
    const currentChapter = current ? current.chapter : progress.chapter;
    const currentStageNo = current ? current.stageNo : progress.stageNo;
    stageControl = el('div', { class: 'train-note' }, [
      el('strong', {
        text: `Stage hiện tại: Ch.${currentChapter}-${currentStageNo}`,
      }),
      el('div', {
        text: current
          ? `NL ${formatNumber(current.energy)} · ${formatNumber(current.exp)} EXP · ${formatNumber(current.gold)} vàng`
          : 'Chưa đọc được thông tin stage hiện tại.',
      }),
      el('div', { text: 'Tự động chạy stage hiện tại; dừng nếu không tiến được.' }),
    ]);
  }

  const maxRunsInput = el('input', {
    id: 'storyMaxRuns',
    type: 'number',
    min: '0',
    step: '1',
    inputmode: 'numeric',
    value: String(state.training.storyMaxRuns),
  });
  maxRunsInput.disabled = state.training.running;
  maxRunsInput.addEventListener('input', () => {
    state.training.storyMaxRuns = maxRunsInput.value;
  });

  if (energyItems.length === 0) state.training.storyUseItems = false;
  const useItemsInput = el('input', { id: 'storyUseItems', type: 'checkbox' });
  useItemsInput.checked = Boolean(state.training.storyUseItems);
  useItemsInput.disabled = energyItems.length === 0 || state.training.running;
  useItemsInput.addEventListener('change', () => {
    state.training.storyUseItems = useItemsInput.checked;
  });

  const itemsText =
    energyItems.length === 0
      ? 'Không có vật phẩm hồi năng lượng trong túi.'
      : energyItems
          .map((item) => {
            const gain =
              Number.isFinite(item.knownGain) && item.knownGain > 0
                ? ` (+${formatNumber(item.knownGain)})`
                : '';
            return `${item.name} ×${formatNumber(item.quantity)}${gain}`;
          })
          .join(' · ');

  const itemsRow = el('div', { class: 'train-inline' }, [
    el('label', {}, [useItemsInput, 'Dùng vật phẩm hồi NL']),
    el('span', { text: itemsText }),
  ]);

  const runButton = el('button', {
    id: 'storyRun',
    class: 'btn btn-primary',
    type: 'button',
    text: state.training.running ? 'Đang chạy…' : 'Xem trước & chạy',
  });
  runButton.disabled =
    state.training.running ||
    (state.training.storyMode === 'farm' && cleared.length === 0);
  runButton.addEventListener('click', runStoryBatch);

  const actions = el('div', { class: 'train-actions' }, [runButton]);
  if (state.training.running) {
    const stopButton = el('button', {
      id: 'storyStop',
      class: 'btn btn-ghost train-stop',
      type: 'button',
      text: 'Dừng sau lượt hiện tại',
    });
    stopButton.addEventListener('click', requestTrainingStop);
    actions.append(stopButton);
  }

  const formCard = el('section', { class: 'train-card' }, [
    el('div', { class: 'train-card-head' }, [
      el('div', {}, [
        el('h3', { text: 'Chạy cốt truyện' }),
        el('p', {
          text: 'Mỗi lượt server chạy tối đa 5 trận. Tự dừng khi thua, hết năng lượng, hết vật phẩm hoặc gặp lỗi.',
        }),
      ]),
    ]),
    el('div', { class: 'train-card-body' }, [
      el('div', { class: 'train-form' }, [
        modeSwitch,
        stageControl,
        trainField('Số trận tối đa', maxRunsInput, '0 = không giới hạn.'),
        el('div', { class: 'train-field' }, [
          el('span', { text: 'Vật phẩm hồi năng lượng' }),
          itemsRow,
          el('small', {
            text: 'Chỉ dùng vật phẩm hồi năng lượng có sẵn trong túi.',
          }),
        ]),
        actions,
      ]),
    ]),
  ]);

  const grid = el('div', { class: 'train-grid' }, [
    formCard,
    renderStorySuggestions(),
  ]);

  els.trainingStory.append(chips, grid);
  const resultCard = renderStoryResult();
  if (resultCard) els.trainingStory.append(resultCard);
}

function renderStorySuggestions() {
  const story = state.training.story;
  const mode = state.training.suggestMode;
  const list = (story?.suggestions?.[mode] || []).slice(0, 3);
  const warnings = story?.suggestions?.warnings || [];

  const switchNode = el('div', { class: 'mode-switch' }, [
    trainModeButton('EXP', mode === 'exp', { suggest: 'exp' }),
    trainModeButton('Vàng', mode === 'gold', { suggest: 'gold' }),
    trainModeButton('Cân bằng', mode === 'balanced', { suggest: 'balanced' }),
  ]);
  switchNode.addEventListener('click', (event) => {
    const button = event.target.closest('[data-suggest]');
    if (!button) return;
    const next = button.dataset.suggest;
    if (next !== 'exp' && next !== 'gold' && next !== 'balanced') return;
    if (state.training.suggestMode === next) return;
    state.training.suggestMode = next;
    renderStory();
  });

  const body = [];
  if (list.length === 0) {
    body.push(
      el('div', { class: 'train-empty-note', text: 'Chưa có gợi ý stage đã qua.' }),
    );
  } else {
    body.push(
      el('div', { class: 'train-suggest-grid' }, list.map((item, index) => {
        const badges = el('div', { class: 'train-elements' }, [
          el('span', {
            class: `train-source ${item.source || ''}`.trim(),
            text: storySourceLabel(item.source),
          }),
          item.isBoss ? el('span', { class: 'train-badge boss', text: 'Boss' }) : null,
        ]);

        const stats = el('div', { class: 'train-suggest-stats' }, [
          el('span', {}, [el('b', { text: item.expPerEnergy ?? '—' }), ' EXP/NL']),
          el('span', {}, [el('b', { text: item.goldPerEnergy ?? '—' }), ' vàng/NL']),
          el('span', {}, [el('b', { text: formatNumber(item.energy) }), ' NL']),
          item.winRate === null || item.winRate === undefined
            ? null
            : el('span', {}, [
                el('b', { text: `${Math.round(item.winRate * 100)}%` }),
                ' thắng',
              ]),
        ]);

        const card = el(
          'article',
          { class: `train-suggest${index === 0 ? ' best' : ''}` },
          [
            el('div', { class: 'train-suggest-head' }, [
              el('div', { class: 'train-suggest-title' }, [
                el('strong', { text: `Ch.${item.chapter}-${item.stageNo}` }),
                el('small', { text: `Scid ${item.scid}` }),
              ]),
              badges,
            ]),
            stats,
          ],
        );

        if (state.training.storyMode === 'farm') {
          const choose = el('button', {
            class: 'btn btn-ghost',
            type: 'button',
            text: 'Chọn stage này',
          });
          choose.disabled = state.training.running;
          choose.addEventListener('click', () => {
            state.training.storyScid = item.scid;
            renderStory();
          });
          card.append(choose);
        }

        return card;
      })),
    );
  }

  if (warnings.length > 0) {
    body.push(
      el('div', {
        class: 'train-note warn',
        text: `Đã loại ${formatNumber(warnings.length)} stage có vàng/NL bất thường khỏi gợi ý.`,
      }),
    );
  }

  return el('section', { class: 'train-card' }, [
    el('div', { class: 'train-card-head' }, [
      el('div', {}, [
        el('h3', { text: 'Gợi ý stage' }),
        el('p', { text: 'Xếp theo hiệu quả EXP/NL, vàng/NL hoặc cân bằng.' }),
      ]),
      switchNode,
    ]),
    el('div', { class: 'train-card-body' }, body),
  ]);
}

function renderStoryResult() {
  const result = state.training.storyResult;
  if (!result && !state.training.running) return null;

  const head = el('div', { class: 'train-result-head' }, [
    el('div', {}, [
      el('h3', { text: 'Kết quả cốt truyện' }),
      el('p', {
        text: result
          ? `${result.mode === 'push' ? 'Đẩy cốt truyện' : 'Cày lại'} · ${stopReasonLabel(result.stopReason)} · ${formatNumber(result.summary?.runs)} trận · ${formatNumber(result.summary?.wins)} thắng`
          : 'Đang chạy…',
      }),
    ]),
    result
      ? el('span', {
          class: 'train-badge',
          text: `${formatNumber(result.chunks)} lượt gọi`,
        })
      : null,
  ]);

  const card = el('section', { class: 'train-result' }, [head]);

  if (state.training.running) {
    card.append(
      el('div', { class: 'train-result-foot' }, [
        el('div', {
          class: 'train-progress indeterminate',
          style: 'flex:1 1 160px;min-width:120px',
        }, [el('span', { class: 'train-progress-bar' })]),
        el('span', {
          text: result
            ? `Đang chạy · ${formatNumber(result.chunks)} lượt gọi · ${formatNumber(result.summary?.runs)} trận`
            : 'Đang chạy…',
        }),
      ]),
    );
  }

  if (!result) return card;

  const battles = result.battles || [];
  const visible = battles.slice(-40);
  const offset = battles.length - visible.length;
  const rows = el('div', { class: 'train-result-rows' });

  for (let index = 0; index < visible.length; index += 1) {
    const battle = visible[index];
    const stateClass =
      battle.win === true ? 'win' : battle.win === false ? 'loss' : 'unknown';
    rows.append(
      el('div', { class: `train-result-row ${stateClass}` }, [
        el('b', {
          text: `#${offset + index + 1} Ch.${battle.chapter}-${battle.stageNo}`,
        }),
        el('span', { text: `${trainGain(battle.expGained)} EXP` }),
        el('span', { text: `${trainGain(battle.goldGained)} vàng` }),
        el('span', { text: `NL còn ${formatNumber(battle.energyAfter)}` }),
        trainResultBadge(battle.win),
      ]),
    );
  }

  if (battles.length === 0) {
    rows.append(
      el('div', {
        class: 'train-result-row unknown',
        text: 'Chưa có trận nào được ghi nhận.',
      }),
    );
  }
  card.append(rows);

  if (offset > 0) {
    card.append(
      el('div', {
        class: 'train-result-foot',
        text: `Hiển thị ${formatNumber(visible.length)}/${formatNumber(battles.length)} trận gần nhất.`,
      }),
    );
  }

  const items = result.itemsUsed || [];
  const itemsText =
    items.length === 0
      ? 'Không dùng vật phẩm.'
      : items
          .map((item) => {
            const gain = item.gained ? ` (+${formatNumber(item.gained)})` : '';
            return `${item.name} ×${formatNumber(item.quantity)}${gain}`;
          })
          .join(' · ');
  const summary = result.summary || {};

  card.append(
    el('div', { class: 'train-result-foot' }, [
      el('div', { class: 'train-chips' }, [
        trainChip('trận', formatNumber(summary.runs)),
        trainChip('thắng', formatNumber(summary.wins), 'good'),
        trainChip('EXP', formatNumber(summary.exp), 'accent'),
        trainChip('vàng', formatNumber(summary.gold)),
        trainChip('NL đã dùng', formatNumber(summary.energySpent)),
        trainChip('vật phẩm', formatNumber(summary.itemsUsed)),
      ]),
      el('span', { text: `Vật phẩm: ${itemsText}` }),
    ]),
  );

  return card;
}

function runStoryBatch() {
  const account = selectedTrainingAccount();
  const story = state.training.story;
  if (!account || !story || state.training.running) return;

  const mode = state.training.storyMode === 'push' ? 'push' : 'farm';
  const maxRuns = Math.max(0, Math.trunc(Number(state.training.storyMaxRuns) || 0));
  const useEnergyItems =
    Boolean(state.training.storyUseItems) && (story.energyItems || []).length > 0;
  let scid = 0;

  if (mode === 'farm') {
    scid = Math.trunc(Number(state.training.storyScid) || 0);
    if (!(scid > 0) || scid >= story.progress.scid) {
      toast('Chọn một stage đã qua để cày lại.', 'warn');
      return;
    }
  }

  const stage =
    mode === 'push'
      ? (story.stages || []).find(
          (entry) => entry.scid === story.progress.scid,
        ) ||
        story.suggestions?.current ||
        null
      : (story.stages || []).find((entry) => entry.scid === scid) || null;

  const stageText = stage
    ? `Ch.${stage.chapter}-${stage.stageNo} · ${formatNumber(stage.energy)} NL · ${formatNumber(stage.exp)} EXP · ${formatNumber(stage.gold)} vàng`
    : `Ch.${story.progress.chapter}-${story.progress.stageNo}`;
  const itemsText =
    useEnergyItems && (story.energyItems || []).length > 0
      ? `Bật · ${story.energyItems.map((item) => `${item.name} ×${formatNumber(item.quantity)}`).join(', ')}`
      : 'Tắt';

  openTrainingConfirm({
    title: 'Xác nhận chạy cốt truyện',
    lines: [
      { label: 'Chế độ', value: mode === 'push' ? 'Đẩy cốt truyện' : 'Cày lại' },
      { label: 'Stage', value: stageText },
      {
        label: 'Số trận tối đa',
        value: maxRuns === 0 ? 'Không giới hạn' : formatNumber(maxRuns),
      },
      {
        label: 'Năng lượng hiện tại',
        value: `${formatNumber(story.vitals.energy)}/${formatNumber(story.vitals.energyMax)}`,
      },
      { label: 'Vật phẩm hồi NL', value: itemsText },
      {
        label: 'Lưu ý',
        value: 'Tự dừng khi thua, hết năng lượng, hết vật phẩm hoặc gặp lỗi.',
        tone: 'warn',
      },
    ],
    confirmLabel: 'Chạy',
    onConfirm: () =>
      executeStoryBatch({
        accountId: account.id,
        mode,
        scid,
        maxRuns,
        useEnergyItems,
      }),
  });
}

function mergeStoryChunks(previous, result) {
  const base = previous || {
    mode: result.mode,
    chunks: 0,
    battles: [],
    itemsUsed: [],
    summary: {
      runs: 0,
      wins: 0,
      losses: 0,
      exp: 0,
      gold: 0,
      levelUps: 0,
      energySpent: 0,
      itemsUsed: 0,
      itemEnergy: 0,
    },
  };
  const summary = { ...base.summary };
  for (const key of [
    'runs',
    'wins',
    'losses',
    'exp',
    'gold',
    'levelUps',
    'energySpent',
    'itemsUsed',
    'itemEnergy',
  ]) {
    summary[key] = (Number(summary[key]) || 0) + (Number(result.summary?.[key]) || 0);
  }

  return {
    mode: result.mode || base.mode,
    chunks: base.chunks + 1,
    battles: [...base.battles, ...(result.battles || [])],
    itemsUsed: [...base.itemsUsed, ...(result.itemsUsed || [])],
    summary,
    stopReason: result.stopReason || null,
    hasMore: Boolean(result.hasMore),
    state: result.state || base.state || null,
  };
}

async function executeStoryBatch({ accountId, mode, scid, maxRuns, useEnergyItems }) {
  const training = state.training;
  if (training.running) return;

  training.running = true;
  training.abort = false;
  training.error = null;
  training.storyResult = null;
  renderTraining();

  let remaining = maxRuns;
  let chunks = 0;

  try {
    while (chunks < 100) {
      const payload = await api(`/api/accounts/${accountId}/story/run`, {
        method: 'POST',
        body: JSON.stringify({
          confirm: true,
          mode,
          scid,
          maxRuns: remaining,
          useEnergyItems,
        }),
      });
      const result = payload.result;
      chunks += 1;

      training.storyResult = mergeStoryChunks(training.storyResult, result);

      if (training.story && result.state) {
        training.story.vitals = {
          ...training.story.vitals,
          energy: result.state.energy,
          energyMax: result.state.energyMax,
          energyUsed: result.state.energyUsed,
          energyLimit: result.state.energyLimit,
          gold: result.state.gold,
          diamond: result.state.diamond,
          level: result.state.level,
          exp: result.state.exp,
          expMax: result.state.expMax,
        };
        if (result.state.progress) training.story.progress = result.state.progress;
      }

      renderTraining();

      if (maxRuns > 0) {
        remaining = Math.max(0, remaining - (Number(result.summary?.runs) || 0));
      }

      if (training.abort) break;
      if (result.stopReason) break;
      if (result.hasMore !== true) break;
      if (maxRuns > 0 && remaining === 0) break;
    }

    const final = training.storyResult;
    if (final) {
      const type =
        final.stopReason && final.stopReason !== 'max-runs' ? 'warn' : 'success';
      toast(
        `Cốt truyện: ${formatNumber(final.summary.runs)} trận, ${formatNumber(final.summary.wins)} thắng, ${trainGain(final.summary.exp)} EXP, ${trainGain(final.summary.gold)} vàng.`,
        type,
      );
    }
    if (training.abort) toast('Đã dừng sau lượt hiện tại.', 'info');
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    training.running = false;
    training.abort = false;
    renderTraining();
  }
}

/* ------------------------------ Training · Dungeon ------------------------------ */

function renderDungeon() {
  els.trainingDungeon.replaceChildren();
  const { data, loading, error } = state.training;

  if (loading && !data) {
    renderTrainingLoading(els.trainingDungeon, 'Đang đọc động huấn luyện từ game…');
    return;
  }
  if (error && !data) {
    renderTrainingError(els.trainingDungeon);
    return;
  }
  if (!data) {
    els.trainingDungeon.append(
      el('div', { class: 'daily-loading', text: 'Chưa có dữ liệu động huấn luyện.' }),
    );
    return;
  }

  els.trainingDungeon.append(
    el('div', { class: 'train-note' }, [
      el('strong', { text: 'Động huấn luyện' }),
      el('div', {
        text: 'Mỗi ngày 3 lượt Công + 3 lượt Thủ mỗi động. Chỉ chạy động đang mở.',
      }),
    ]),
  );

  if (state.training.running) {
    const stopButton = el('button', {
      id: 'dungeonStop',
      class: 'btn btn-ghost train-stop',
      type: 'button',
      text: 'Dừng sau lượt hiện tại',
    });
    stopButton.addEventListener('click', requestTrainingStop);
    els.trainingDungeon.append(
      el('div', { class: 'train-actions' }, [
        stopButton,
        el('div', {
          class: 'train-progress indeterminate',
          style: 'flex:1 1 160px;min-width:120px',
        }, [el('span', { class: 'train-progress-bar' })]),
      ]),
    );
  }

  const caves = data.caves || [];
  if (caves.length === 0) {
    els.trainingDungeon.append(
      el('div', { class: 'daily-loading', text: 'Không đọc được động huấn luyện nào.' }),
    );
    return;
  }

  const grid = el('div', { class: 'train-cave-grid' });
  for (const cave of caves) grid.append(renderCaveCard(cave));
  els.trainingDungeon.append(grid);

  const resultCard = renderDungeonResult();
  if (resultCard) els.trainingDungeon.append(resultCard);
}

function renderCaveCard(cave) {
  const selected = state.training.dungeonCave === cave.cave;
  const card = el('article', { class: `train-cave${cave.open ? '' : ' closed'}` });
  if (selected) card.style.borderColor = 'rgba(255, 122, 26, 0.45)';

  const elements = el(
    'div',
    { class: 'train-elements' },
    (cave.elements || []).map((name) =>
      el('span', { class: 'train-element', text: name }),
    ),
  );

  card.append(
    el('div', { class: 'train-cave-head' }, [
      el('div', {}, [
        el('h3', { text: cave.name }),
        el('p', { text: cave.openDays ? `Mở: ${cave.openDays}` : '' }),
      ]),
      el('span', {
        class: `train-badge ${cave.open ? 'open' : 'closed'}`,
        text: cave.open ? 'Đang mở' : 'Đóng hôm nay',
      }),
    ]),
  );

  card.append(
    el('div', { class: 'train-cave-meta' }, [
      elements,
      cave.eligible
        ? el('span', { class: 'train-badge good', text: 'Đủ điều kiện' })
        : null,
    ]),
  );

  card.append(
    el('div', { class: 'train-cave-runs' }, [
      el('span', {}, [
        el('b', {
          text: `Công ${formatNumber(cave.runsLeftAtk)}/${formatNumber(cave.runsMaxMode)}`,
        }),
      ]),
      el('span', { text: '·' }),
      el('span', {}, [
        el('b', {
          text: `Thủ ${formatNumber(cave.runsLeftDef)}/${formatNumber(cave.runsMaxMode)}`,
        }),
      ]),
    ]),
  );

  card.append(
    el('p', {
      class: 'train-note',
      text: `Sai hệ: -${formatNumber(cave.debuffPct)}% · Super -${formatNumber(cave.debuffPctSuper)}% · Kage -${formatNumber(cave.debuffPctKage)}%`,
    }),
  );

  if (!cave.open) {
    card.append(
      el('p', { class: 'train-note', text: 'Động này đóng hôm nay, không thể chạy.' }),
    );
    return card;
  }

  if (!cave.eligible) {
    card.append(
      el('p', {
        class: 'train-note warn',
        text: 'Chưa đủ điều kiện mở tầng (LowLevel).',
      }),
    );
    const disabledRun = el('button', {
      class: 'btn btn-primary',
      type: 'button',
      text: 'Xem trước & chạy',
      dataset: { caveRun: '' },
    });
    disabledRun.disabled = true;
    card.append(el('div', { class: 'train-cave-form' }, [disabledRun]));
    return card;
  }

  const stages = (cave.stages || []).filter((stage) => stage.runnable);
  let mode = selected && state.training.dungeonMode === 2 ? 2 : 1;
  let activeStage = selected
    ? stages.find(
        (stage) =>
          stage.tier === state.training.dungeonTier &&
          stage.stageNo === state.training.dungeonStageNo,
      ) || null
    : null;
  if (!activeStage) activeStage = stages[0] || null;
  if (selected && activeStage) {
    state.training.dungeonTier = activeStage.tier;
    state.training.dungeonStageNo = activeStage.stageNo;
  }

  const modeSwitch = el('div', { class: 'mode-switch' }, [
    trainModeButton('Công', mode === 1, { caveMode: '1' }),
    trainModeButton('Thủ', mode === 2, { caveMode: '2' }),
  ]);

  const stageSelect = el('select', { dataset: { caveStage: '' } });
  for (const stage of stages) {
    stageSelect.append(
      el('option', {
        value: `${stage.tier}:${stage.stageNo}`,
        text: `${stage.name} · ${formatNumber(stage.gold)} vàng`,
      }),
    );
  }
  if (activeStage) stageSelect.value = `${activeStage.tier}:${activeStage.stageNo}`;
  stageSelect.disabled = state.training.running || stages.length === 0;
  stageSelect.addEventListener('change', () => {
    const parsed = parseCaveStageValue(stageSelect.value);
    state.training.dungeonCave = cave.cave;
    state.training.dungeonTier = parsed.tier;
    state.training.dungeonStageNo = parsed.stageNo;
  });

  modeSwitch.addEventListener('click', (event) => {
    if (state.training.running) return;
    const button = event.target.closest('[data-cave-mode]');
    if (!button) return;
    const next = button.dataset.caveMode === '2' ? 2 : 1;
    const parsed = parseCaveStageValue(stageSelect.value);
    state.training.dungeonCave = cave.cave;
    state.training.dungeonMode = next;
    state.training.dungeonTier = parsed.tier;
    state.training.dungeonStageNo = parsed.stageNo;
    mode = next;
    for (const item of modeSwitch.querySelectorAll('.mode-btn')) {
      item.classList.toggle('active', item === button);
    }
    runButton.disabled =
      state.training.running ||
      stages.length === 0 ||
      (mode === 1 ? cave.runsLeftAtk <= 0 : cave.runsLeftDef <= 0);
  });

  const maxInput = el('input', {
    type: 'number',
    min: '0',
    step: '1',
    inputmode: 'numeric',
    value: String(selected ? state.training.dungeonMaxRuns : '0'),
    dataset: { caveMaxruns: '' },
  });
  maxInput.disabled = state.training.running;
  maxInput.addEventListener('input', () => {
    state.training.dungeonCave = cave.cave;
    state.training.dungeonMaxRuns = maxInput.value;
  });

  const runButton = el('button', {
    class: 'btn btn-primary',
    type: 'button',
    text: state.training.running ? 'Đang chạy…' : 'Xem trước & chạy',
    dataset: { caveRun: '' },
  });
  runButton.disabled =
    state.training.running ||
    stages.length === 0 ||
    (mode === 1 ? cave.runsLeftAtk <= 0 : cave.runsLeftDef <= 0);
  runButton.addEventListener('click', () => {
    const parsed = parseCaveStageValue(stageSelect.value);
    runCaveBatch(cave, {
      mode,
      tier: parsed.tier,
      stageNo: parsed.stageNo,
      maxRuns: Math.max(0, Math.trunc(Number(maxInput.value) || 0)),
    });
  });

  card.append(
    el('div', { class: 'train-cave-form' }, [
      modeSwitch,
      trainField('Tầng', stageSelect),
      trainField('Số trận tối đa', maxInput, '0 = không giới hạn.'),
      runButton,
    ]),
  );

  card.addEventListener('click', (event) => {
    if (event.target.closest('button, input, select, label')) return;
    if (state.training.dungeonCave === cave.cave) return;
    state.training.dungeonCave = cave.cave;
    renderDungeon();
  });

  return card;
}

function renderDungeonResult() {
  const result = state.training.dungeonResult;
  if (!result) return null;

  const head = el('div', { class: 'train-result-head' }, [
    el('div', {}, [
      el('h3', { text: 'Kết quả động huấn luyện' }),
      el('p', {
        text: `Động ${result.caveName || result.cave} · ${result.mode === 2 ? 'Thủ' : 'Công'} · ${stopReasonLabel(result.stopReason)} · ${formatNumber(result.summary?.runs)} trận · ${formatNumber(result.summary?.wins)} thắng`,
      }),
    ]),
  ]);

  const card = el('section', { class: 'train-result' }, [head]);
  const battles = result.battles || [];
  const rows = el('div', { class: 'train-result-rows' });

  for (let index = 0; index < battles.length; index += 1) {
    const battle = battles[index];
    const stateClass =
      battle.win === true ? 'win' : battle.win === false ? 'loss' : 'unknown';
    rows.append(
      el('div', { class: `train-result-row ${stateClass}` }, [
        el('b', { text: `#${index + 1} Tầng ${battle.tier}-${battle.stageNo}` }),
        el('span', { text: `${trainGain(battle.gold)} vàng` }),
        battle.itemQty
          ? el('span', { text: `Vật phẩm ×${formatNumber(battle.itemQty)}` })
          : null,
        trainResultBadge(battle.win),
      ]),
    );
  }

  if (battles.length === 0) {
    rows.append(
      el('div', {
        class: 'train-result-row unknown',
        text: 'Chưa có trận nào được ghi nhận.',
      }),
    );
  }
  card.append(rows);

  const summary = result.summary || {};
  card.append(
    el('div', { class: 'train-result-foot' }, [
      el('div', { class: 'train-chips' }, [
        trainChip('trận', formatNumber(summary.runs)),
        trainChip('thắng', formatNumber(summary.wins), 'good'),
        trainChip('vàng', formatNumber(summary.gold), 'accent'),
        trainChip('vật phẩm', formatNumber(summary.items)),
      ]),
    ]),
  );

  return card;
}

function runCaveBatch(cave, { mode = 1, tier = 0, stageNo = 0, maxRuns = 0 } = {}) {
  const account = selectedTrainingAccount();
  if (!account || !cave || state.training.running) return;

  if (!cave.open) {
    toast('Động này đang đóng hôm nay.', 'warn');
    return;
  }
  if (!cave.eligible) {
    toast('Chưa đủ điều kiện mở tầng của động này.', 'warn');
    return;
  }

  const runMode = Number(mode) === 2 ? 2 : 1;
  const left = runMode === 2 ? cave.runsLeftDef : cave.runsLeftAtk;
  if (left <= 0) {
    toast('Đã hết lượt cho chế độ này.', 'warn');
    return;
  }

  const stage =
    (cave.stages || []).find(
      (entry) => entry.tier === tier && entry.stageNo === stageNo,
    ) || null;
  if (!stage) {
    toast('Chọn tầng huấn luyện hợp lệ.', 'warn');
    return;
  }
  const stageText = `${stage.name} · ${formatNumber(stage.gold)} vàng`;

  openTrainingConfirm({
    title: 'Xác nhận chạy động huấn luyện',
    lines: [
      { label: 'Động', value: cave.name },
      { label: 'Chế độ', value: runMode === 2 ? 'Thủ' : 'Công' },
      { label: 'Tầng', value: stageText },
      {
        label: 'Số trận tối đa',
        value: maxRuns === 0 ? 'Không giới hạn' : formatNumber(maxRuns),
      },
      { label: 'Lượt còn lại', value: formatNumber(left) },
      {
        label: 'Lưu ý',
        value: 'Chỉ chạy khi động đang mở. Tự dừng khi thua hoặc hết lượt.',
        tone: 'warn',
      },
    ],
    confirmLabel: 'Chạy',
    onConfirm: () =>
      executeCaveBatch({
        accountId: account.id,
        cave,
        mode: runMode,
        tier,
        stageNo,
        maxRuns,
      }),
  });
}

async function executeCaveBatch({ accountId, cave, mode, tier, stageNo, maxRuns }) {
  const training = state.training;
  if (training.running) return;

  training.running = true;
  training.abort = false;
  training.error = null;
  training.dungeonResult = null;
  renderTraining();

  try {
    const payload = await api(`/api/accounts/${accountId}/training/caves/run`, {
      method: 'POST',
      body: JSON.stringify({
        confirm: true,
        cave: cave.cave,
        mode,
        tier,
        stageNo,
        maxRuns,
      }),
    });
    const result = payload.result;
    training.dungeonResult = {
      ...result,
      caveName: cave.name,
      caveId: cave.cave,
    };

    if (training.data && result.state?.caves) {
      training.data.caves = result.state.caves;
      training.data.readAt = new Date().toISOString();
    }

    const type =
      result.stopReason && result.stopReason !== 'no-run' ? 'warn' : 'success';
    toast(
      `Động ${cave.name}: ${formatNumber(result.summary?.runs)} trận, ${formatNumber(result.summary?.wins)} thắng, ${trainGain(result.summary?.gold)} vàng.`,
      type,
    );
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    training.running = false;
    training.abort = false;
    renderTraining();
  }
}

/* ------------------------------ Training · Ultimate ------------------------------ */

function renderUltimate() {
  els.trainingUltimate.replaceChildren();
  const { data, loading, error } = state.training;

  if (loading && !data) {
    renderTrainingLoading(els.trainingUltimate, 'Đang đọc Thử thách tối thượng từ game…');
    return;
  }
  if (error && !data) {
    renderTrainingError(els.trainingUltimate);
    return;
  }
  if (!data) {
    els.trainingUltimate.append(
      el('div', {
        class: 'daily-loading',
        text: 'Chưa có dữ liệu Thử thách tối thượng.',
      }),
    );
    return;
  }

  const ultimate = data.ultimate || {};
  const mode = state.training.ultimateMode === 2 ? 2 : 1;
  const status = mode === 2 ? ultimate.def : ultimate.atk;
  const starMax =
    status && status.starMax > 0 ? status.starMax : Math.max(1, status?.stars || 1);
  let star = Math.trunc(Number(state.training.ultimateStar) || 1);
  if (star < 1) star = 1;
  if (star > starMax) star = starMax;
  state.training.ultimateStar = star;

  els.trainingUltimate.append(
    el('div', { class: 'train-note' }, [
      el('strong', { text: 'Thử thách tối thượng' }),
      el('div', {
        text: 'Chọn chế độ Công hoặc Thủ. Tự dừng khi thua, hết lượt hoặc có buff/thưởng chờ nhận.',
      }),
    ]),
  );

  els.trainingUltimate.append(
    el('div', { class: 'train-ult-grid' }, [
      renderUltimateCard(1, ultimate.atk, ultimate.buffsAtk || []),
      renderUltimateCard(2, ultimate.def, ultimate.buffsDef || []),
    ]),
  );

  if (state.training.running) {
    const stopButton = el('button', {
      id: 'ultimateStop',
      class: 'btn btn-ghost train-stop',
      type: 'button',
      text: 'Dừng sau lượt hiện tại',
    });
    stopButton.addEventListener('click', requestTrainingStop);
    els.trainingUltimate.append(
      el('div', { class: 'train-actions' }, [
        stopButton,
        el('div', {
          class: 'train-progress indeterminate',
          style: 'flex:1 1 160px;min-width:120px',
        }, [el('span', { class: 'train-progress-bar' })]),
      ]),
    );
  }

  const modeSwitch = el('div', { class: 'mode-switch' }, [
    trainModeButton('Công', mode === 1, { ultMode: '1' }),
    trainModeButton('Thủ', mode === 2, { ultMode: '2' }),
  ]);
  modeSwitch.addEventListener('click', (event) => {
    if (state.training.running) return;
    const button = event.target.closest('[data-ult-mode]');
    if (!button) return;
    const next = button.dataset.ultMode === '2' ? 2 : 1;
    if (state.training.ultimateMode === next) return;
    state.training.ultimateMode = next;
    renderUltimate();
  });

  const starInput = el('input', {
    id: 'ultimateStar',
    type: 'number',
    min: '1',
    max: String(starMax),
    step: '1',
    inputmode: 'numeric',
    value: String(star),
  });
  starInput.disabled = state.training.running || !status;
  starInput.addEventListener('input', () => {
    state.training.ultimateStar = starInput.value;
  });

  const maxRunsInput = el('input', {
    id: 'ultimateMaxRuns',
    type: 'number',
    min: '0',
    step: '1',
    inputmode: 'numeric',
    value: String(state.training.ultimateMaxRuns),
  });
  maxRunsInput.disabled = state.training.running;
  maxRunsInput.addEventListener('input', () => {
    state.training.ultimateMaxRuns = maxRunsInput.value;
  });

  const blocked = Boolean(
    !status ||
      status.runsLeft <= 0 ||
      status.pendingBuff ||
      status.pendingReward,
  );
  const runButton = el('button', {
    id: 'ultimateRun',
    class: 'btn btn-primary',
    type: 'button',
    text: state.training.running ? 'Đang chạy…' : 'Xem trước & chạy',
  });
  runButton.disabled = state.training.running || blocked;
  runButton.addEventListener('click', runUltimateBatch);

  const actions = el('div', { class: 'train-actions' }, [runButton]);

  let noteText = '';
  if (!status) {
    noteText = 'Chưa đọc được trạng thái chế độ này.';
  } else if (status.pendingBuff || status.pendingReward) {
    noteText = 'Cần nhận buff/thưởng đang chờ trước khi chạy tiếp.';
  } else if (status.runsLeft <= 0) {
    noteText = 'Đã hết lượt cho chế độ này.';
  } else {
    noteText = `Còn ${formatNumber(status.runsLeft)} lượt. Server tự dừng khi hết lượt hoặc gặp buff/thưởng chờ.`;
  }

  els.trainingUltimate.append(
    el('section', { class: 'train-card' }, [
      el('div', { class: 'train-card-head' }, [
        el('div', {}, [
          el('h3', { text: 'Chạy Thử thách tối thượng' }),
          el('p', { text: 'Mỗi lần chạy là một yêu cầu; server xử lý tối đa số lượt còn lại.' }),
        ]),
      ]),
      el('div', { class: 'train-card-body' }, [
        el('div', { class: 'train-form' }, [
          modeSwitch,
          trainField('Số sao', starInput, `Tối đa ${formatNumber(starMax)} sao.`),
          trainField('Số trận tối đa', maxRunsInput, '0 = không giới hạn.'),
          el('p', { class: 'train-note', text: noteText }),
          actions,
        ]),
      ]),
    ]),
  );

  const resultCard = renderUltimateResult();
  if (resultCard) els.trainingUltimate.append(resultCard);
}

function renderUltimateCard(mode, status, buffs) {
  const active = state.training.ultimateMode === mode;
  const label = mode === 1 ? 'Công' : 'Thủ';
  const card = el('article', { class: `train-ult${active ? ' active' : ''}` });

  card.addEventListener('click', (event) => {
    if (event.target.closest('button, input, select, label')) return;
    if (state.training.ultimateMode === mode) return;
    state.training.ultimateMode = mode;
    renderUltimate();
  });

  if (!status) {
    card.append(
      el('div', { class: 'train-ult-head' }, [
        el('div', {}, [
          el('h3', { text: `Ultimate · ${label}` }),
          el('p', { text: 'Chưa có dữ liệu' }),
        ]),
      ]),
    );
    return card;
  }

  card.append(
    el('div', { class: 'train-ult-head' }, [
      el('div', {}, [
        el('h3', { text: `Ultimate · ${label}` }),
        el('p', {
          text: `Tầng ${formatNumber(status.stage)} → kế tiếp ${formatNumber(status.nextStage)} · ${formatNumber(status.runsLeft)} lượt`,
        }),
      ]),
      el('span', {
        class: `train-badge ${status.runsLeft > 0 ? 'good' : 'bad'}`,
        text: status.runsLeft > 0 ? `${formatNumber(status.runsLeft)} lượt` : 'Hết lượt',
      }),
    ]),
  );

  card.append(
    el('div', { class: 'train-ult-stats' }, [
      el('span', {}, [
        'Sao',
        el('b', {
          text: `${formatNumber(status.starEarned)}/${formatNumber(status.starMax)}`,
        }),
      ]),
      el('span', {}, ['Max tầng', el('b', { text: formatNumber(status.maxStage) })]),
      el('span', {}, [
        'Hạng',
        el('b', {
          text: `${formatNumber(status.myRank)}/${formatNumber(status.myCount)}`,
        }),
      ]),
      el('span', {}, ['Đã thắng', el('b', { text: formatNumber(status.stagesWon) })]),
    ]),
  );

  const pending = [];
  if (status.pendingBuff) {
    pending.push(el('span', { class: 'train-pending', text: 'Buff chờ nhận' }));
    pending.push(trainClaimButton('buff', mode, 'Nhận buff'));
  }
  if (status.pendingReward) {
    pending.push(el('span', { class: 'train-pending', text: 'Thưởng chờ nhận' }));
    pending.push(trainClaimButton('reward', mode, 'Nhận thưởng'));
  }
  if (pending.length > 0) {
    card.append(el('div', { class: 'train-inline' }, pending));
  }

  if (buffs.length > 0) {
    card.append(
      el(
        'div',
        { class: 'train-elements' },
        buffs.map((buff) =>
          el('span', {
            class: 'train-element',
            text: `${buff.name || 'Buff'} Lv${buff.level ?? '—'} +${buff.value ?? '—'}%`,
          }),
        ),
      ),
    );
  }

  return card;
}

function trainClaimButton(kind, mode, text) {
  const button = el('button', {
    class: 'btn btn-ghost btn-sm',
    type: 'button',
    text,
  });
  button.dataset.ultClaim = kind;
  button.disabled = state.training.running;
  button.addEventListener('click', () => claimUltimate(kind, mode));
  return button;
}

function renderUltimateResult() {
  const result = state.training.ultimateResult;
  if (!result) return null;

  const head = el('div', { class: 'train-result-head' }, [
    el('div', {}, [
      el('h3', { text: 'Kết quả Thử thách tối thượng' }),
      el('p', {
        text: `${result.mode === 2 ? 'Thủ' : 'Công'} · ${stopReasonLabel(result.stopReason)} · ${formatNumber(result.summary?.runs)} trận · ${formatNumber(result.summary?.wins)} thắng`,
      }),
    ]),
  ]);

  const card = el('section', { class: 'train-result' }, [head]);
  const battles = result.battles || [];
  const rows = el('div', { class: 'train-result-rows' });

  for (let index = 0; index < battles.length; index += 1) {
    const battle = battles[index];
    const stateClass =
      battle.win === true ? 'win' : battle.win === false ? 'loss' : 'unknown';
    rows.append(
      el('div', { class: `train-result-row ${stateClass}` }, [
        el('b', { text: `#${index + 1} Tầng ${battle.stageNo}` }),
        el('span', { class: 'train-stars' }, [starImage(battle.star)]),
        el('span', { text: `${trainGain(battle.gold)} vàng` }),
        el('span', { text: `Tầng sau ${formatNumber(battle.stageAfter)}` }),
        battle.pendingBuff
          ? el('span', { class: 'train-badge warn', text: 'Buff chờ' })
          : null,
        battle.pendingReward
          ? el('span', { class: 'train-badge warn', text: 'Thưởng chờ' })
          : null,
        trainResultBadge(battle.win),
      ]),
    );
  }

  if (battles.length === 0) {
    rows.append(
      el('div', {
        class: 'train-result-row unknown',
        text: 'Chưa có trận nào được ghi nhận.',
      }),
    );
  }
  card.append(rows);

  const summary = result.summary || {};
  card.append(
    el('div', { class: 'train-result-foot' }, [
      el('div', { class: 'train-chips' }, [
        trainChip('trận', formatNumber(summary.runs)),
        trainChip('thắng', formatNumber(summary.wins), 'good'),
        trainChip('vàng', formatNumber(summary.gold), 'accent'),
        trainChip('chờ nhận', formatNumber(summary.pending), 'warn'),
      ]),
    ]),
  );

  return card;
}

function runUltimateBatch() {
  const account = selectedTrainingAccount();
  const data = state.training.data;
  if (!account || !data || state.training.running) return;

  const mode = state.training.ultimateMode === 2 ? 2 : 1;
  const ultimate = data.ultimate || {};
  const status = mode === 2 ? ultimate.def : ultimate.atk;

  if (!status) {
    toast('Chưa đọc được trạng thái Thử thách tối thượng.', 'warn');
    return;
  }
  if (status.pendingBuff || status.pendingReward) {
    toast('Cần nhận buff/thưởng đang chờ trước khi chạy tiếp.', 'warn');
    return;
  }
  if (status.runsLeft <= 0) {
    toast('Đã hết lượt Thử thách tối thượng cho chế độ này.', 'warn');
    return;
  }

  const starMax =
    status.starMax > 0 ? status.starMax : Math.max(1, status.stars || 1);
  const star = Math.min(
    starMax,
    Math.max(1, Math.trunc(Number(state.training.ultimateStar) || 1)),
  );
  const maxRuns = Math.max(
    0,
    Math.trunc(Number(state.training.ultimateMaxRuns) || 0),
  );
  state.training.ultimateStar = star;

  openTrainingConfirm({
    title: 'Xác nhận chạy Thử thách tối thượng',
    lines: [
      { label: 'Chế độ', value: mode === 1 ? 'Công' : 'Thủ' },
      {
        label: 'Tầng hiện tại',
        value: `${formatNumber(status.stage)} → kế tiếp ${formatNumber(status.nextStage)}`,
      },
      { label: 'Số sao', value: `${formatNumber(star)}/${formatNumber(starMax)}` },
      {
        label: 'Số trận tối đa',
        value: maxRuns === 0 ? 'Không giới hạn' : formatNumber(maxRuns),
      },
      { label: 'Lượt còn lại', value: formatNumber(status.runsLeft) },
      {
        label: 'Lưu ý',
        value: 'Tự dừng khi thua, hết lượt hoặc có buff/thưởng chờ nhận.',
        tone: 'warn',
      },
    ],
    confirmLabel: 'Chạy',
    onConfirm: () =>
      executeUltimateBatch({ accountId: account.id, mode, maxRuns, star }),
  });
}

async function executeUltimateBatch({ accountId, mode, maxRuns, star }) {
  const training = state.training;
  if (training.running) return;

  training.running = true;
  training.abort = false;
  training.error = null;
  training.ultimateResult = null;
  renderTraining();

  try {
    const payload = await api(
      `/api/accounts/${accountId}/training/ultimate/run`,
      {
        method: 'POST',
        body: JSON.stringify({ confirm: true, mode, maxRuns, star }),
      },
    );
    const result = payload.result;
    training.ultimateResult = { ...result, mode };

    if (training.data?.ultimate) {
      const key = mode === 2 ? 'def' : 'atk';
      const buffKey = mode === 2 ? 'buffsDef' : 'buffsAtk';
      if (result.state?.status) training.data.ultimate[key] = result.state.status;
      training.data.ultimate[buffKey] = result.state?.buffs || [];
      training.data.readAt = new Date().toISOString();
    }

    const type =
      result.stopReason && result.stopReason !== 'no-run' ? 'warn' : 'success';
    toast(
      `Ultimate ${mode === 1 ? 'Công' : 'Thủ'}: ${formatNumber(result.summary?.runs)} trận, ${formatNumber(result.summary?.wins)} thắng, ${trainGain(result.summary?.gold)} vàng.`,
      type,
    );
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    training.running = false;
    training.abort = false;
    renderTraining();
  }
}

function claimUltimate(kind, mode) {
  const account = selectedTrainingAccount();
  if (!account || state.training.running) return;

  const claimKind = kind === 'buff' ? 'buff' : 'reward';
  const modeValue = Number(mode) === 2 ? 2 : 1;
  const kindLabel = claimKind === 'buff' ? 'buff' : 'thưởng';
  const modeLabel = modeValue === 1 ? 'Công' : 'Thủ';

  openTrainingConfirm({
    title: `Nhận ${kindLabel} Ultimate ${modeLabel}`,
    lines: [
      { label: 'Chế độ', value: modeLabel },
      { label: 'Loại', value: claimKind === 'buff' ? 'Buff' : 'Thưởng' },
      {
        label: 'Lưu ý',
        value: 'Chỉ nhận phần đang chờ, không tiêu Kim cương hay mua lượt.',
        tone: 'warn',
      },
    ],
    confirmLabel: 'Nhận',
    onConfirm: () =>
      executeUltimateClaim({ accountId: account.id, mode: modeValue, kind: claimKind }),
  });
}

async function executeUltimateClaim({ accountId, mode, kind }) {
  const training = state.training;
  if (training.running) return;

  training.running = true;
  training.abort = false;
  training.error = null;
  renderTraining();

  try {
    const payload = await api(
      `/api/accounts/${accountId}/training/ultimate/claim`,
      {
        method: 'POST',
        body: JSON.stringify({ confirm: true, mode, kind }),
      },
    );
    const result = payload.result;
    const kindLabel = kind === 'buff' ? 'buff' : 'thưởng';
    const modeLabel = mode === 1 ? 'Công' : 'Thủ';

    if (result?.ok) {
      toast(`Đã nhận ${kindLabel} Ultimate ${modeLabel}.`, 'success');
    } else {
      toast(`Không có ${kindLabel} Ultimate để nhận.`, 'warn');
    }

    await loadTraining({ force: true });
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    training.running = false;
    training.abort = false;
    renderTraining();
  }
}

/* ------------------------------ Training · Events ------------------------------ */

els.btnTrainingRefresh.addEventListener('click', () =>
  loadTraining({ force: true }),
);


els.trainingTabs.addEventListener('click', (event) => {
  const button = event.target.closest('.train-tab');
  if (!button) return;
  const tab = button.dataset.tab;
  if (tab !== 'story' && tab !== 'dungeon' && tab !== 'ultimate') return;
  if (state.training.tab === tab) return;

  state.training.tab = tab;
  state.training.error = null;
  renderTraining();

  const source = tab === 'story' ? state.training.story : state.training.data;
  if (!source) loadTraining({ force: true });
});

els.trainingConfirmDialog.addEventListener('close', () => {
  const pending = state.training.confirm;
  state.training.confirm = null;
  if (!pending || pending.fired) return;
  if (els.trainingConfirmDialog.returnValue !== 'confirm') return;

  pending.fired = true;
  const run = pending.onConfirm;
  if (typeof run !== 'function') return;

  Promise.resolve()
    .then(run)
    .catch((error) => toast(error.message, 'error'));
});

/* ------------------------------ Boss ------------------------------ */

let bossSeq = 0;
let bossTicker = null;
let bossReloadAt = 0;

function resetBossData() {
  bossSeq += 1;
  state.boss.loading = false;
  state.boss.error = null;
  state.boss.data = null;
  state.boss.readAtMs = 0;
  state.boss.progress = null;
  state.boss.beastResult = null;
  state.boss.guildResult = null;
  state.boss.confirm = null;
  if (!state.boss.running) state.boss.mode = null;
}

function selectedBossAccount() {
  return selectedAccount();
}

async function loadBoss({ force = false } = {}) {
  const account = selectedBossAccount();
  const usable = Boolean(
    account &&
      account.enabled &&
      account.status === 'active' &&
      account.hasSession !== false,
  );
  const boss = state.boss;

  if (!usable) {
    bossSeq += 1;
    boss.loading = false;
    boss.error = null;
    boss.data = null;
    boss.readAtMs = 0;
    renderBoss();
    return;
  }

  if (boss.running && !force) {
    renderBoss();
    return;
  }

  const fresh = boss.data && Date.now() - boss.readAtMs < 60_000;
  if (!force && fresh && !boss.loading) {
    renderBoss();
    return;
  }

  if (!force && boss.loading) return;

  const seq = ++bossSeq;
  boss.loading = true;
  boss.error = null;
  renderBoss();

  try {
    const payload = await api(`/api/accounts/${account.id}/boss`);
    if (seq !== bossSeq) return;

    boss.data = { ...payload.state, accountId: account.id };
    boss.readAtMs = Date.now();
  } catch (error) {
    if (seq !== bossSeq) return;

    boss.error = error.message;
    boss.data = null;
    boss.readAtMs = 0;
    toast(error.message, 'error');
    if (/đăng nhập|đang tắt/i.test(error.message)) {
      await loadAccounts();
    }
  } finally {
    if (seq === bossSeq) {
      boss.loading = false;
      renderBoss();
    }
  }
}

function renderBoss() {
  const boss = state.boss;
  const account = selectedBossAccount();
  const data = boss.data;

  els.btnBossRefresh.disabled = boss.loading || boss.running;

  els.bossEmpty.hidden = true;
  els.bossLoading.hidden = true;
  els.bossError.hidden = true;
  els.bossState.hidden = true;
  els.bossSummary.hidden = true;
  els.bossSynced.textContent = '';

  if (!account) {
    els.bossEmpty.hidden = false;
    els.bossEmptyTitle.textContent = 'Chưa có tài khoản';
    els.bossEmptyText.textContent =
      'Thêm và đăng nhập một tài khoản để dùng tab Boss.';
    els.bossFoot.textContent = 'Chọn tài khoản để xem boss.';
    return;
  }

  if (
    !account.enabled ||
    account.status !== 'active' ||
    account.hasSession === false
  ) {
    els.bossEmpty.hidden = false;
    els.bossEmptyTitle.textContent = !account.enabled
      ? 'Tài khoản đang tắt'
      : 'Chưa đăng nhập';
    els.bossEmptyText.textContent = !account.enabled
      ? 'Bật lại tài khoản và đăng nhập để dùng tab Boss.'
      : 'Đăng nhập tài khoản để đọc dữ liệu boss từ game.';
    els.bossFoot.textContent = 'Cần tài khoản đang hoạt động.';
    return;
  }

  els.bossSynced.textContent = boss.loading
    ? 'Đang tải…'
    : data?.readAt
      ? `Đồng bộ: ${formatDate(data.readAt)}`
      : '';

  if (data) renderBossSummary(data);

  if (boss.loading && !data) {
    els.bossLoading.hidden = false;
    els.bossFoot.textContent = 'Đang tải dữ liệu boss…';
    return;
  }

  if (boss.error && !data) {
    renderBossError();
    els.bossFoot.textContent =
      'Không tải được dữ liệu. Kiểm tra kết nối rồi thử lại.';
    return;
  }

  if (!data) {
    els.bossLoading.hidden = false;
    els.bossFoot.textContent = 'Chưa có dữ liệu boss.';
    return;
  }

  els.bossState.hidden = false;
  renderBossBeastCard(data.beast);
  renderBossGuildCard(data.guild);
  updateBossCountdowns();

  const name = account.characterName || account.username;
  const readLabel = data.readAt
    ? `Đọc lúc ${formatDate(data.readAt)}`
    : 'Chưa có dữ liệu';
  els.bossFoot.textContent = `${name} · ${readLabel} · Mỗi hit một request, không tiêu Kim cương.`;
}

function renderBossSummary(data) {
  const player = data?.player || {};
  const guild = data?.guild || {};
  els.bossSummary.replaceChildren(
    bossChip('Cấp', `Lv ${formatNumber(player.level)}`),
    bossChip('Vàng', formatNumber(player.gold)),
    bossChip('Kim cương', formatNumber(player.diamond)),
    bossChip(
      'Guild',
      guild.hasGuild ? guild.guildName || 'Có guild' : 'Chưa có guild',
      guild.hasGuild ? '' : 'warn',
    ),
  );
  els.bossSummary.hidden = false;
}

function renderBossError() {
  const retry = el('button', {
    class: 'btn btn-ghost btn-sm',
    type: 'button',
    text: 'Thử lại',
  });
  retry.addEventListener('click', () => loadBoss({ force: true }));
  els.bossError.replaceChildren(
    el('div', { class: 'notice notice-error' }, [
      el('div', { class: 'notice-body' }, [
        el('strong', { text: 'Không tải được dữ liệu boss' }),
        el('small', { text: state.boss.error || 'Lỗi không xác định.' }),
      ]),
      retry,
    ]),
  );
  els.bossError.hidden = false;
}

function bossChip(label, value, tone = '') {
  return el('span', { class: `boss-chip ${tone}`.trim() }, [
    el('b', { text: String(value) }),
    el('span', { text: label }),
  ]);
}

function bossStatusBadge(node, text, tone) {
  node.className = `boss-badge ${tone}`.trim();
  node.textContent = text;
}

function bossPawMark() {
  return icon('paw', 'boss-paw');
}

function renderBossPortrait(container, boss) {
  container.replaceChildren();
  const fallback = boss?.ninjaImage || null;
  const source = boss?.image || fallback;
  if (!source) {
    container.append(bossPawMark());
    return;
  }

  const img = el('img', {
    src: source,
    alt: boss?.beastName || 'Boss',
    loading: 'lazy',
  });
  let usedFallback = false;
  img.addEventListener('error', () => {
    if (!usedFallback && fallback && img.getAttribute('src') !== fallback) {
      usedFallback = true;
      img.src = fallback;
      return;
    }
    container.replaceChildren(bossPawMark());
  });
  container.append(img);
}

function bossClampPct(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function renderBossBeastCard(beast) {
  const boss = state.boss;
  const hasBeast = Boolean(beast);

  els.bossBeastEmpty.hidden = hasBeast;
  els.bossBeastContent.hidden = !hasBeast;

  if (!hasBeast) {
    els.bossBeastStop.hidden = true;
    renderBossProgress('beast');
    renderBossResult('beast');
    return;
  }

  renderBossPortrait(els.bossBeastPortrait, beast);
  els.bossBeastName.textContent = beast.beastName || 'Vĩ Thú';

  const tier = beast.tierName || (beast.tier ? `Tier ${beast.tier}` : '');
  const windowText = `${beast.startText || '—'}–${beast.endText || '—'}`;
  els.bossBeastMeta.textContent = [tier, windowText].filter(Boolean).join(' · ');

  if (beast.defeated) bossStatusBadge(els.bossBeastStatus, 'Đã bị hạ', 'defeated');
  else if (beast.eventOpen) bossStatusBadge(els.bossBeastStatus, 'Đang mở', 'open');
  else bossStatusBadge(els.bossBeastStatus, 'Đã đóng', 'closed');

  els.bossBeastHp.textContent = `${formatNumber(beast.hp)} / ${formatNumber(beast.maxHp)} · ${formatNumber(beast.hpPct)}%`;
  els.bossBeastHpBar.style.width = `${bossClampPct(beast.hpPct)}%`;

  const cooldown = Number(beast.cooldownRemain) || 0;
  els.bossBeastStats.replaceChildren(
    bossChip('Sát thương', formatNumber(beast.dame), 'accent'),
    bossChip('Hạng', beast.myRank > 0 ? `#${formatNumber(beast.myRank)}` : '—'),
    bossChip('Fame', formatNumber(beast.fame)),
    bossChip(
      'Cooldown',
      cooldown > 0 ? formatDuration(cooldown) : 'Sẵn sàng',
      cooldown > 0 ? 'warn' : 'good',
    ),
  );

  const directionText =
    beast.direction === 'atk'
      ? 'Hệ Công'
      : beast.direction === 'def'
        ? 'Hệ Thủ'
        : 'Chưa rõ';
  const directionTone =
    beast.direction === 'atk' ? 'atk' : beast.direction === 'def' ? 'def' : 'unknown';
  els.bossBeastDirection.className = `boss-direction ${directionTone}`;
  els.bossBeastDirection.textContent = beast.directionUncertain
    ? `${directionText} · chưa xác nhận`
    : directionText;

  els.bossBeastRun.disabled =
    !beast.eventOpen || beast.defeated || boss.running || cooldown > 0;
  els.bossBeastStop.hidden = !(boss.running && boss.mode === 'beast');

  renderBossProgress('beast');
  renderBossResult('beast');
  renderBossRank(els.bossBeastRank, beast.rank, { withLineup: true });
}

function formatBossRewards(value) {
  return String(value || '')
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [name, quantity] = part.split('|').map((piece) => piece.trim());
      if (!quantity) return name;
      const count = Number(quantity);
      return `${name} ×${Number.isFinite(count) ? formatNumber(count) : quantity}`;
    })
    .join(' · ');
}

function bossRewardText(boss) {
  const parts = [
    `+${formatNumber(boss.expPerHit)} EXP guild · +${formatNumber(boss.contribPerHit)} điểm cống hiến mỗi hit`,
  ];
  const killReward = formatBossRewards(boss.killReward);
  if (killReward) parts.push(`Hạ boss: ${killReward}`);
  const rank1Reward = formatBossRewards(boss.rank1Reward);
  if (rank1Reward) parts.push(`Hạng 1: ${rank1Reward}`);
  return parts.join(' · ');
}

function renderBossGuildCard(guild) {
  const boss = state.boss;
  const guildInfo = guild || {};
  const guildBoss = guildInfo.boss || null;

  if (!guildInfo.hasGuild) {
    els.bossGuildEmpty.hidden = false;
    els.bossGuildContent.hidden = true;
    els.bossGuildEmptyTitle.textContent = 'Chưa có guild';
    els.bossGuildEmptyText.textContent =
      'Guild Boss chỉ mở khi tài khoản đã vào guild.';
    els.bossGuildStop.hidden = true;
    return;
  }

  if (!guildBoss) {
    els.bossGuildEmpty.hidden = false;
    els.bossGuildContent.hidden = true;
    els.bossGuildEmptyTitle.textContent = 'Chưa đọc được Guild Boss.';
    els.bossGuildEmptyText.textContent =
      'Game chưa trả về dữ liệu Guild Boss. Thử làm mới sau.';
    els.bossGuildStop.hidden = true;
    return;
  }

  els.bossGuildEmpty.hidden = true;
  els.bossGuildContent.hidden = false;

  renderBossPortrait(els.bossGuildPortrait, guildBoss);
  els.bossGuildName.textContent = guildBoss.beastName || 'Guild Boss';

  const guildName = guildInfo.guildName || 'Guild';
  const guildLv = guildInfo.guildLv ?? guildBoss.guildLv;
  els.bossGuildMeta.textContent = `${guildName} · Lv ${guildLv ?? '—'}`;

  if (guildBoss.killed) bossStatusBadge(els.bossGuildStatus, 'Đã bị hạ', 'defeated');
  else bossStatusBadge(els.bossGuildStatus, 'Đang mở', 'open');

  els.bossGuildHp.textContent = `${formatNumber(guildBoss.hp)} / ${formatNumber(guildBoss.maxHp)} · ${formatNumber(guildBoss.hpPct)}%`;
  els.bossGuildHpBar.style.width = `${bossClampPct(guildBoss.hpPct)}%`;

  const cooldown = Number(guildBoss.cooldownRemain) || 0;
  const hitsLeft = Math.max(0, Number(guildBoss.hitsLeft) || 0);
  const resetChip = el('span', { class: 'boss-chip' }, [
    el('b', {
      text: formatDuration(guildBoss.secondsToReset),
      'data-boss-countdown': 'guild-reset',
    }),
    el('span', { text: 'Reset' }),
  ]);

  els.bossGuildStats.replaceChildren(
    bossChip(
      'Lượt còn',
      `${formatNumber(hitsLeft)}/${formatNumber(guildBoss.hitsPerDay)}`,
      hitsLeft > 0 ? 'good' : 'warn',
    ),
    bossChip('Sát thương', formatNumber(guildBoss.dame), 'accent'),
    bossChip('Hạng', guildBoss.myRank > 0 ? `#${formatNumber(guildBoss.myRank)}` : '—'),
    bossChip(
      'Cooldown',
      cooldown > 0 ? formatDuration(cooldown) : 'Sẵn sàng',
      cooldown > 0 ? 'warn' : 'good',
    ),
    resetChip,
  );

  els.bossGuildRewards.textContent = bossRewardText(guildBoss);

  els.bossGuildHits.max = String(Math.max(1, hitsLeft));
  if (!boss.running) {
    const selected = Math.trunc(Number(els.bossGuildHits.value) || 1);
    if (selected > Math.max(1, hitsLeft)) {
      els.bossGuildHits.value = String(Math.max(1, hitsLeft));
    }
  }

  els.bossGuildRun.disabled =
    guildBoss.killed || hitsLeft <= 0 || boss.running || cooldown > 0;
  els.bossGuildStop.hidden = !(boss.running && boss.mode === 'guild');

  renderBossProgress('guild');
  renderBossResult('guild');
  renderBossRank(els.bossGuildRank, guildInfo.rank, { withLineup: false });
}

function bossStopReasonLabel(reason) {
  const labels = {
    closed: 'Cửa sổ boss đã đóng',
    defeated: 'Boss đã bị hạ trong phiên này',
    killed: 'Boss đã bị hạ',
    cooldown: 'Đang hồi cooldown',
    'no-guild': 'Chưa có guild',
    'no-hits': 'Đã hết lượt đánh',
    'window-ending': 'Cửa sổ sắp đóng',
    unverified: 'Không xác thực được sát thương',
    'user-stop': 'Đã dừng theo yêu cầu',
  };
  if (!reason) return 'Hoàn tất';
  if (labels[reason]) return labels[reason];
  if (String(reason).startsWith('error:')) return String(reason).slice(6);
  return String(reason);
}

function renderBossRank(container, rows, { withLineup = false } = {}) {
  container.replaceChildren();
  if (!Array.isArray(rows) || rows.length === 0) {
    container.append(
      el('div', { class: 'boss-rank-empty', text: 'Chưa có dữ liệu xếp hạng.' }),
    );
    return;
  }

  const headRow = el('tr', {}, [
    el('th', { text: 'Hạng' }),
    el('th', { text: 'Người chơi' }),
    el('th', { text: 'Lv' }),
    el('th', { text: 'Sát thương' }),
    el('th', { text: 'Hit' }),
    withLineup ? el('th', { text: 'Đội hình' }) : null,
  ]);

  const tbody = el('tbody');
  for (const row of rows) {
    const tr = el('tr', { class: row.isMe ? 'is-me' : '' });
    tr.append(
      el('td', { class: 'boss-rank-no', text: `#${formatNumber(row.rankNo)}` }),
      el('td', { class: 'boss-rank-name', text: row.name || '—' }),
      el('td', { class: 'boss-rank-lv', text: `Lv ${formatNumber(row.level)}` }),
      el('td', { class: 'boss-num', text: formatNumber(row.dame) }),
      el('td', { class: 'boss-num', text: formatNumber(row.hits) }),
    );

    if (withLineup) {
      const lineup = el('td', { class: 'boss-lineup' });
      const ninjas = Array.isArray(row.ninjas) ? row.ninjas.slice(0, 5) : [];
      if (ninjas.length === 0) {
        lineup.textContent = '—';
      } else {
        for (const ninja of ninjas) {
          const avatar = el('img', {
            src: ninja.image,
            alt: '',
            loading: 'lazy',
            class: 'boss-avatar',
          });
          avatar.addEventListener('error', () => {
            avatar.style.display = 'none';
          });
          lineup.append(avatar);
        }
      }
      tr.append(lineup);
    }

    tbody.append(tr);
  }

  const table = el('table', { class: 'boss-table' }, [
    el('thead', {}, [headRow]),
    tbody,
  ]);
  container.append(table);
}

function renderBossResult(mode) {
  const node = mode === 'beast' ? els.bossBeastResult : els.bossGuildResult;
  const result = mode === 'beast' ? state.boss.beastResult : state.boss.guildResult;

  node.hidden = !result;
  if (!result) {
    node.replaceChildren();
    return;
  }

  const hits = result.hits || [];
  const summary = result.summary || {};
  const stop = bossStopReasonLabel(result.stopReason);

  const head = el('div', { class: 'boss-result-head' }, [
    el('div', {}, [
      el('h4', {
        text: mode === 'beast' ? 'Kết quả Vĩ Thú' : 'Kết quả Guild Boss',
      }),
      el('p', {
        text: `${stop} · ${formatNumber(summary.hits)} hit`,
      }),
    ]),
    el('span', { class: 'boss-badge', text: `${formatNumber(summary.hits)} hit` }),
  ]);

  const chips = el('div', { class: 'boss-chips boss-result-chips' }, [
    bossChip('Hit', formatNumber(summary.hits), 'accent'),
    bossChip('Sát thương', formatNumber(summary.dame), 'good'),
    bossChip('Dừng', stop, result.stopReason ? 'warn' : ''),
  ]);

  const rows = el('div', { class: 'boss-result-rows' });
  const visible = hits.slice(-40);
  const offset = hits.length - visible.length;

  for (let index = 0; index < visible.length; index += 1) {
    const hit = visible[index];
    const parts = [
      `+${formatNumber(hit.dame)} sát thương`,
      `HP ${formatNumber(hit.hp)}/${formatNumber(hit.maxHp)}`,
      `CD ${formatDuration(hit.cooldownRemain)}`,
    ];
    if (mode === 'guild') parts.push(`còn ${formatNumber(hit.hitsLeft)} lượt`);

    rows.append(
      el('div', { class: 'boss-result-row' }, [
        el('b', { text: `#${offset + index + 1}` }),
        ...parts.map((text) => el('span', { text })),
      ]),
    );
  }

  if (hits.length === 0) {
    rows.append(
      el('div', {
        class: 'boss-result-row boss-result-empty',
        text: 'Chưa có hit nào được ghi nhận.',
      }),
    );
  }

  node.replaceChildren(head, chips, rows);

  if (offset > 0) {
    node.append(
      el('div', {
        class: 'boss-result-foot',
        text: `Hiển thị ${formatNumber(visible.length)}/${formatNumber(hits.length)} hit gần nhất.`,
      }),
    );
  }
}

function renderBossProgress(mode) {
  const boss = state.boss;
  const node = mode === 'beast' ? els.bossBeastProgress : els.bossGuildProgress;
  const label = mode === 'beast' ? els.bossBeastProgressLabel : els.bossGuildProgressLabel;
  const next = mode === 'beast' ? els.bossBeastProgressNext : els.bossGuildProgressNext;
  const bar = mode === 'beast' ? els.bossBeastProgressBar : els.bossGuildProgressBar;
  const hint = mode === 'beast' ? els.bossBeastProgressHint : els.bossGuildProgressHint;

  const active = boss.running && boss.mode === mode && boss.progress;
  node.hidden = !active;
  if (!active) return;

  const progress = boss.progress;
  label.textContent = `Hit ${formatNumber(progress.current)}/${formatNumber(progress.total)}`;

  const remaining = progress.nextAtMs
    ? Math.max(0, (progress.nextAtMs - Date.now()) / 1000)
    : 0;
  next.textContent = boss.abort
    ? 'Đang dừng…'
    : progress.nextAtMs && remaining > 0
      ? `Hit kế tiếp sau ${formatDuration(remaining)}`
      : 'Đang gửi hit…';
  hint.textContent = boss.abort
    ? 'Sẽ dừng sau hit hiện tại.'
    : 'Bấm Dừng để dừng sau hit hiện tại.';

  const percent =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
  bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
}

function updateBossProgressDisplays() {
  renderBossProgress('beast');
  renderBossProgress('guild');
}

function startBossTicker() {
  if (bossTicker) return;
  bossTicker = setInterval(updateBossCountdowns, 1000);
}

function stopBossTicker() {
  if (!bossTicker) return;
  clearInterval(bossTicker);
  bossTicker = null;
}

function updateBossCountdowns() {
  if (state.view !== 'boss') return;

  const boss = state.boss;
  const data = boss.data;
  if (!data) return;

  const elapsed = boss.readAtMs
    ? Math.max(0, (Date.now() - boss.readAtMs) / 1000)
    : 0;
  let expired = false;

  const beast = data.beast;
  if (beast) {
    const windowSec = Number(
      beast.eventOpen ? beast.secondsToClose : beast.secondsToOpen,
    ) || 0;
    if (beast.eventOpen) {
      const remain = Math.max(0, windowSec - elapsed);
      els.bossBeastCountdown.textContent = `Còn ${formatDuration(remain)}`;
      if (windowSec > 0 && remain <= 0) expired = true;
    } else {
      const remain = Math.max(0, windowSec - elapsed);
      els.bossBeastCountdown.textContent = `Mở sau ${formatDuration(remain)}${
        beast.isTomorrow ? ' · ngày mai' : ''
      }`;
      if (windowSec > 0 && remain <= 0) expired = true;
    }

    const cooldown = Number(beast.cooldownRemain) || 0;
    if (
      beast.eventOpen &&
      !beast.defeated &&
      cooldown > 0 &&
      elapsed >= cooldown
    ) {
      expired = true;
    }
  }

  const guildBoss = data.guild?.boss;
  if (guildBoss) {
    const resetSec = Number(guildBoss.secondsToReset) || 0;
    const remain = Math.max(0, resetSec - elapsed);
    const resetNode = els.bossGuildStats.querySelector(
      '[data-boss-countdown="guild-reset"]',
    );
    if (resetNode) resetNode.textContent = formatDuration(remain);
    if (resetSec > 0 && remain <= 0) expired = true;

    const cooldown = Number(guildBoss.cooldownRemain) || 0;
    if (
      !guildBoss.killed &&
      guildBoss.hitsLeft > 0 &&
      cooldown > 0 &&
      elapsed >= cooldown
    ) {
      expired = true;
    }
  }

  updateBossProgressDisplays();

  if (expired && !boss.loading && !boss.running) {
    const now = Date.now();
    if (now - bossReloadAt >= 3000) {
      bossReloadAt = now;
      loadBoss({ force: true });
    }
  }
}

function bossWait(ms) {
  return new Promise((resolve) => {
    const started = Date.now();
    const step = () => {
      const remaining = ms - (Date.now() - started);
      if (state.boss.abort || remaining <= 0) {
        resolve();
        return;
      }
      setTimeout(step, Math.min(250, remaining));
    };
    step();
  });
}

function clampBossHits(value, max) {
  const limit = Math.max(1, Math.trunc(Number(max) || 1));
  const hits = Math.trunc(Number(value) || 1);
  return Math.min(limit, Math.max(1, hits));
}

function runBossBatch(mode) {
  const boss = state.boss;
  const account = selectedBossAccount();
  const data = boss.data;
  if (!account || !data || boss.running) return;

  if (mode === 'beast') {
    const beast = data.beast;
    if (!beast) {
      toast('Chưa đọc được dữ liệu Vĩ Thú.', 'warn');
      return;
    }
    if (!beast.eventOpen) {
      toast('Cửa sổ Vĩ Thú đang đóng.', 'warn');
      return;
    }
    if (beast.defeated) {
      toast('Vĩ Thú đã bị hạ.', 'warn');
      return;
    }
    if ((Number(beast.cooldownRemain) || 0) > 0) {
      toast('Vĩ Thú đang hồi cooldown.', 'warn');
      return;
    }

    const hits = clampBossHits(els.bossBeastHits.value, 50);
    const cooldownSec = Number(beast.cooldownSec) || 20;
    const totalWait = Math.max(0, hits - 1) * cooldownSec;

    openBossConfirm({
      title: 'Xác nhận đánh Vĩ Thú',
      lines: [
        {
          label: 'Boss',
          value: `${beast.beastName || 'Vĩ Thú'} · HP ${formatNumber(beast.hp)}/${formatNumber(beast.maxHp)}`,
        },
        { label: 'Số hit', value: formatNumber(hits) },
        {
          label: 'Chờ tối đa',
          value:
            totalWait > 0
              ? `${formatDuration(totalWait)} (${formatNumber(hits - 1)} × ${formatDuration(cooldownSec)})`
              : 'Không cần chờ',
        },
        {
          label: 'Lưu ý',
          value:
            'Boss dùng chung HP với server và ảnh hưởng tới người chơi khác. Không tiêu Kim cương.',
          tone: 'warn',
        },
      ],
      onConfirm: () => executeBossBatch({ accountId: account.id, mode: 'beast', hits }),
    });
    return;
  }

  const guild = data.guild;
  const guildBoss = guild?.boss;
  if (!guild?.hasGuild) {
    toast('Chưa có guild.', 'warn');
    return;
  }
  if (!guildBoss) {
    toast('Chưa đọc được Guild Boss.', 'warn');
    return;
  }
  if (guildBoss.killed) {
    toast('Guild Boss đã bị hạ.', 'warn');
    return;
  }

  const hitsLeft = Math.max(0, Number(guildBoss.hitsLeft) || 0);
  if (hitsLeft <= 0) {
    toast('Đã hết lượt đánh Guild Boss.', 'warn');
    return;
  }
  if ((Number(guildBoss.cooldownRemain) || 0) > 0) {
    toast('Guild Boss đang hồi cooldown.', 'warn');
    return;
  }

  const hits = clampBossHits(els.bossGuildHits.value, hitsLeft);
  const cooldownSec = Number(guildBoss.cooldownSec) || 0;
  const totalWait = Math.max(0, hits - 1) * cooldownSec;

  openBossConfirm({
    title: 'Xác nhận đánh Guild Boss',
    lines: [
      {
        label: 'Boss',
        value: `${guildBoss.beastName || 'Guild Boss'} · HP ${formatNumber(guildBoss.hp)}/${formatNumber(guildBoss.maxHp)}`,
      },
      {
        label: 'Số hit',
        value: `${formatNumber(hits)} / còn ${formatNumber(hitsLeft)} lượt`,
      },
      {
        label: 'Chờ tối đa',
        value:
          totalWait > 0
            ? `${formatDuration(totalWait)} (${formatNumber(hits - 1)} × ${formatDuration(cooldownSec)})`
            : 'Không cần chờ',
      },
      {
        label: 'Lưu ý',
        value:
          'Boss dùng chung HP với server và ảnh hưởng tới người chơi khác. Không tiêu Kim cương.',
        tone: 'warn',
      },
      {
        label: 'Guild Boss',
        value:
          'Guild Boss không tính thắng/thua; xác thực bằng sát thương và lượt còn lại.',
        tone: 'warn',
      },
    ],
    onConfirm: () => executeBossBatch({ accountId: account.id, mode: 'guild', hits }),
  });
}

function openBossConfirm({ title, lines = [], onConfirm }) {
  state.boss.confirm = {
    onConfirm,
    fired: false,
  };

  els.bossConfirmTitle.textContent = title || 'Xác nhận';
  els.btnBossConfirm.textContent = 'Đánh';

  const list = el('dl', { class: 'boss-confirm-list' });
  for (const line of lines) {
    if (!line) continue;
    const tone =
      line.tone === 'warn'
        ? 'warn'
        : line.tone === 'bad'
          ? 'bad'
          : line.tone === 'good'
            ? 'good'
            : '';
    list.append(
      el('div', { class: `boss-confirm-row ${tone}`.trim() }, [
        el('dt', { text: line.label || '' }),
        el('dd', {
          text: line.value === null || line.value === undefined ? '—' : String(line.value),
        }),
      ]),
    );
  }

  els.bossConfirmBody.replaceChildren(list);
  els.bossConfirmDialog.returnValue = '';
  if (!els.bossConfirmDialog.open) els.bossConfirmDialog.showModal();
}

async function executeBossBatch({ accountId, mode, hits }) {
  const boss = state.boss;
  if (boss.running) return;

  boss.running = true;
  boss.abort = false;
  boss.mode = mode;
  boss.error = null;
  boss.progress = { current: 1, total: hits, nextAtMs: 0, cooldownRemain: 0 };
  if (mode === 'beast') {
    boss.beastResult = { hits: [], summary: { hits: 0, dame: 0 }, stopReason: null };
  } else {
    boss.guildResult = { hits: [], summary: { hits: 0, dame: 0 }, stopReason: null };
  }
  renderBoss();

  let stopReason = null;

  try {
    for (let index = 0; index < hits; index += 1) {
      if (boss.abort) {
        stopReason = 'user-stop';
        break;
      }

      boss.progress.current = index + 1;
      boss.progress.nextAtMs = 0;
      boss.progress.cooldownRemain = 0;
      renderBoss();

      const payload = await api(`/api/accounts/${accountId}/boss/${mode}/hit`, {
        method: 'POST',
        body: JSON.stringify({ confirm: true }),
      });
      const result = payload?.result || {};
      const list = mode === 'beast' ? boss.beastResult : boss.guildResult;

      if (result.hit) {
        list.hits.push(result.hit);
        list.summary.hits += 1;
        list.summary.dame += Number(result.hit.dame) || 0;
      }

      if (mode === 'beast') {
        if (result.state && boss.data?.beast) {
          boss.data.beast = { ...boss.data.beast, ...result.state };
        }
      } else {
        if (result.guild && boss.data?.guild) {
          boss.data.guild = {
            ...boss.data.guild,
            ...result.guild,
            boss: boss.data.guild.boss,
            rank: boss.data.guild.rank,
          };
        }
        if (result.state && boss.data?.guild?.boss) {
          boss.data.guild.boss = { ...boss.data.guild.boss, ...result.state };
        }
      }
      boss.readAtMs = Date.now();

      if (result.stopReason) {
        stopReason = result.stopReason;
      } else if (!result.ok) {
        stopReason = result.error ? `error:${result.error}` : 'error:unknown';
      }
      if (stopReason) {
        list.stopReason = stopReason;
        renderBoss();
        break;
      }

      if (boss.abort) {
        stopReason = 'user-stop';
        list.stopReason = stopReason;
        renderBoss();
        break;
      }

      if (index + 1 >= hits) break;

      const currentBoss =
        mode === 'beast' ? boss.data?.beast : boss.data?.guild?.boss;
      const cooldownRemain =
        Number(
          result.hit?.cooldownRemain ??
            result.state?.cooldownRemain ??
            currentBoss?.cooldownRemain ??
            0,
        ) || 0;
      const fallbackSec =
        mode === 'beast'
          ? Number(boss.data?.beast?.cooldownSec) || 20
          : Number(boss.data?.guild?.boss?.cooldownSec) || 0;
      const base = cooldownRemain > 0 ? cooldownRemain : fallbackSec;
      const waitMs = Math.max(
        1000,
        base * 1000 + (250 + Math.random() * 500),
      );

      boss.progress.current = index + 1;
      boss.progress.nextAtMs = Date.now() + waitMs;
      boss.progress.cooldownRemain = cooldownRemain;
      renderBoss();

      await bossWait(waitMs);

      if (boss.abort) {
        stopReason = 'user-stop';
        list.stopReason = stopReason;
        renderBoss();
        break;
      }
    }

    if (boss.abort && !stopReason) {
      stopReason = 'user-stop';
      const list = mode === 'beast' ? boss.beastResult : boss.guildResult;
      list.stopReason = stopReason;
    }

    const list = mode === 'beast' ? boss.beastResult : boss.guildResult;
    if (stopReason) list.stopReason = stopReason;

    const type = stopReason && stopReason !== 'user-stop' ? 'warn' : 'success';
    if (mode === 'beast') {
      toast(
        `Vĩ Thú: ${formatNumber(list.summary.hits)} hit, ${formatNumber(list.summary.dame)} sát thương.`,
        type,
      );
    } else {
      const left = Number(boss.data?.guild?.boss?.hitsLeft) || 0;
      toast(
        `Guild Boss: ${formatNumber(list.summary.hits)} hit, ${formatNumber(list.summary.dame)} sát thương, còn ${formatNumber(left)} lượt.`,
        type,
      );
    }
    if (stopReason === 'user-stop') toast('Đã dừng theo yêu cầu.', 'info');
  } catch (error) {
    const list = mode === 'beast' ? boss.beastResult : boss.guildResult;
    if (list && !list.stopReason) list.stopReason = `error:${error.message}`;
    toast(error.message, 'error');
  } finally {
    boss.running = false;
    boss.abort = false;
    boss.progress = null;
    boss.mode = null;
    renderBoss();
  }

  const account = selectedBossAccount();
  if (account && account.id === accountId) await loadBoss({ force: true });
}

function requestBossStop() {
  if (!state.boss.running) return;
  state.boss.abort = true;
  toast('Sẽ dừng sau hit hiện tại.', 'info');
  renderBoss();
}

/* ------------------------------ Boss · Events ------------------------------ */

els.btnBossRefresh.addEventListener('click', () => loadBoss({ force: true }));


els.bossBeastRun.addEventListener('click', () => runBossBatch('beast'));
els.bossGuildRun.addEventListener('click', () => runBossBatch('guild'));
els.bossBeastStop.addEventListener('click', requestBossStop);
els.bossGuildStop.addEventListener('click', requestBossStop);

els.bossConfirmDialog.addEventListener('close', () => {
  const pending = state.boss.confirm;
  state.boss.confirm = null;
  if (!pending || pending.fired) return;
  if (els.bossConfirmDialog.returnValue !== 'confirm') return;

  pending.fired = true;
  const run = pending.onConfirm;
  if (typeof run !== 'function') return;

  Promise.resolve()
    .then(run)
    .catch((error) => toast(error.message, 'error'));
});

/* ------------------------------ PvP ------------------------------ */

let pvpSeq = 0;
let pvpPlanMode = null;

function resetPvpData() {
  pvpSeq += 1;
  pvpPlanMode = null;
  state.pvp.loading = false;
  state.pvp.error = null;
  state.pvp.data = null;
  state.pvp.readAtMs = 0;
  state.pvp.plan = null;
  state.pvp.progress = null;
  state.pvp.rankResult = null;
  state.pvp.plunderResult = null;
  state.pvp.confirm = null;
  if (!state.pvp.running) state.pvp.mode = null;
}

function selectedPvpAccount() {
  return selectedAccount();
}

async function loadPvp({ force = false } = {}) {
  const account = selectedPvpAccount();
  const usable = Boolean(
    account &&
      account.enabled &&
      account.status === 'active' &&
      account.hasSession !== false,
  );
  const pvp = state.pvp;

  if (!usable) {
    pvpSeq += 1;
    pvp.loading = false;
    pvp.error = null;
    pvp.data = null;
    pvp.readAtMs = 0;
    renderPvp();
    return;
  }

  if (pvp.running && !force) {
    renderPvp();
    return;
  }

  const fresh = pvp.data && Date.now() - pvp.readAtMs < 60_000;
  if (!force && fresh && !pvp.loading) {
    renderPvp();
    return;
  }

  if (!force && pvp.loading) return;

  const seq = ++pvpSeq;
  pvp.loading = true;
  pvp.error = null;
  renderPvp();

  try {
    const payload = await api(`/api/accounts/${account.id}/pvp`);
    if (seq !== pvpSeq) return;

    pvp.data = { ...payload.state, accountId: account.id };
    pvp.readAtMs = Date.now();
  } catch (error) {
    if (seq !== pvpSeq) return;

    pvp.error = error.message;
    pvp.data = null;
    pvp.readAtMs = 0;
    toast(error.message, 'error');
    if (/đăng nhập|đang tắt/i.test(error.message)) {
      await loadAccounts();
    }
  } finally {
    if (seq === pvpSeq) {
      pvp.loading = false;
      renderPvp();
    }
  }
}

function renderPvp() {
  const pvp = state.pvp;
  const account = selectedPvpAccount();
  const data = pvp.data;

  els.btnPvpRefresh.disabled = pvp.loading || pvp.running;

  els.pvpEmpty.hidden = true;
  els.pvpLoading.hidden = true;
  els.pvpError.hidden = true;
  els.pvpState.hidden = true;
  els.pvpSummary.hidden = true;
  els.pvpSynced.textContent = '';

  if (!account) {
    els.pvpEmpty.hidden = false;
    els.pvpEmptyTitle.textContent = 'Chưa có tài khoản';
    els.pvpEmptyText.textContent =
      'Thêm và đăng nhập một tài khoản để dùng tab PvP.';
    els.pvpFoot.textContent = 'Chọn tài khoản để xem PvP.';
    return;
  }

  if (
    !account.enabled ||
    account.status !== 'active' ||
    account.hasSession === false
  ) {
    els.pvpEmpty.hidden = false;
    els.pvpEmptyTitle.textContent = !account.enabled
      ? 'Tài khoản đang tắt'
      : 'Chưa đăng nhập';
    els.pvpEmptyText.textContent = !account.enabled
      ? 'Bật lại tài khoản và đăng nhập để dùng tab PvP.'
      : 'Đăng nhập tài khoản để đọc dữ liệu PvP từ game.';
    els.pvpFoot.textContent = 'Cần tài khoản đang hoạt động.';
    return;
  }

  els.pvpSynced.textContent = pvp.loading
    ? 'Đang tải…'
    : data?.readAt
      ? `Đồng bộ: ${formatDate(data.readAt)}`
      : '';

  if (data) renderPvpSummary(data);

  if (pvp.loading && !data) {
    els.pvpLoading.hidden = false;
    els.pvpFoot.textContent = 'Đang tải dữ liệu PvP…';
    return;
  }

  if (pvp.error && !data) {
    renderPvpError();
    els.pvpFoot.textContent =
      'Không tải được dữ liệu. Kiểm tra kết nối rồi thử lại.';
    return;
  }

  if (!data) {
    els.pvpLoading.hidden = false;
    els.pvpFoot.textContent = 'Chưa có dữ liệu PvP.';
    return;
  }

  els.pvpState.hidden = false;
  renderPvpRankCard(data);
  renderPvpPlunderCard(data);

  const name = account.characterName || account.username;
  const readLabel = data.readAt
    ? `Đọc lúc ${formatDate(data.readAt)}`
    : 'Chưa có dữ liệu';
  els.pvpFoot.textContent = `${name} · ${readLabel} · Mỗi trận một request, không tiêu Kim cương.`;
}

function renderPvpSummary(data) {
  const player = data?.player || {};
  const ownPower = data?.ownPower;
  const ownRank = data?.rank?.ownRank ?? null;

  els.pvpSummary.replaceChildren(
    pvpChip(
      'BP',
      `${formatNumber(player.bp)}/${formatNumber(player.bpMax)}`,
      player.bp > 0 ? '' : 'bad',
    ),
    pvpChip('Vàng', formatNumber(player.gold)),
    pvpChip('Kim cương', formatNumber(player.diamond)),
    pvpChip(
      'Lực chiến',
      ownPower === null || ownPower === undefined ? 'Chưa xác định' : formatNumber(ownPower),
      ownPower === null || ownPower === undefined ? 'warn' : '',
    ),
    pvpChip(
      'Hạng',
      ownRank === null ? 'Chưa xác định' : `#${formatNumber(ownRank)}`,
      ownRank === null ? 'warn' : '',
    ),
  );
  els.pvpSummary.hidden = false;
}

function renderPvpError() {
  const retry = el('button', {
    class: 'btn btn-ghost btn-sm',
    type: 'button',
    text: 'Thử lại',
  });
  retry.addEventListener('click', () => loadPvp({ force: true }));
  els.pvpError.replaceChildren(
    el('div', { class: 'notice notice-error' }, [
      el('div', { class: 'notice-body' }, [
        el('strong', { text: 'Không tải được dữ liệu PvP' }),
        el('small', { text: state.pvp.error || 'Lỗi không xác định.' }),
      ]),
      retry,
    ]),
  );
  els.pvpError.hidden = false;
}

function pvpChip(label, value, tone = '') {
  return el('span', { class: `pvp-chip ${tone}`.trim() }, [
    el('b', { text: String(value) }),
    el('span', { text: label }),
  ]);
}

function pvpStopReasonLabel(reason) {
  const labels = {
    'no-bp': 'Đã hết BP',
    'no-target': 'Không còn đối thủ hợp lệ',
    'no-gold': 'Không cướp được vàng',
    'no-candidates': 'Không có đối thủ lực chiến thấp hơn',
    'no-rank': 'Chưa xác định được hạng',
    'unknown-power': 'Không đọc được lực chiến đối thủ',
    stronger: 'Đối thủ lực chiến cao hơn',
    loss: 'Thua trận',
    unverified: 'Không xác thực được kết quả',
    locked: 'Đối thủ đang khoá',
    'low-level': 'Chưa đủ cấp — hãy tăng Level nhân vật rồi thử lại',
    'no-ninja': 'Không có đội hình hợp lệ',
    'user-stop': 'Đã dừng theo yêu cầu',
    complete: 'Hoàn tất',
  };
  if (!reason) return 'Hoàn tất';
  if (labels[reason]) return labels[reason];
  if (String(reason).startsWith('error:')) return String(reason).slice(6);
  return String(reason);
}

function pvpPowerText(value) {
  return value === null || value === undefined ? '—' : formatNumber(value);
}

function pvpLineup(images) {
  const wrap = el('span', { class: 'pvp-lineup' });
  const list = (Array.isArray(images) ? images : []).filter(Boolean).slice(0, 3);
  if (list.length === 0) {
    wrap.textContent = '—';
    return wrap;
  }

  for (const source of list) {
    const img = el('img', {
      src: source,
      alt: '',
      loading: 'lazy',
      class: 'pvp-avatar',
    });
    img.addEventListener('error', () => img.remove());
    wrap.append(img);
  }
  return wrap;
}

function pvpPowerCell(row) {
  const cell = el('td', { class: 'pvp-num pvp-power-cell' }, [
    el('span', { class: 'pvp-power', text: pvpPowerText(row.power) }),
  ]);
  if (row.stronger) {
    cell.append(el('span', { class: 'pvp-stronger-badge', text: 'Mạnh hơn' }));
  }
  return cell;
}

function pvpRowClass(row) {
  return [
    row.isMe ? 'is-me' : '',
    row.stronger ? 'stronger' : '',
    row.lastBattle === 'win' ? 'won' : '',
    row.lastBattle === 'loss' ? 'lost' : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function renderPvpRankCard(data) {
  const pvp = state.pvp;
  const ownRank = data?.rank?.ownRank ?? null;
  const ownPower = data?.ownPower;

  els.pvpRankOwn.textContent = `Hạng của bạn: ${
    ownRank === null ? 'Chưa xác định' : `#${formatNumber(ownRank)}`
  } · Lực chiến: ${
    ownPower === null || ownPower === undefined
      ? 'Chưa xác định'
      : formatNumber(ownPower)
  }`;

  els.pvpRankPlan.disabled =
    pvp.running || pvpPlanMode === 'rank' || !data;
  els.pvpRankBattles.disabled = pvp.running;
  els.pvpRankStop.hidden = !(pvp.running && pvp.mode === 'rank');

  renderPvpProgress('rank');
  renderPvpResult('rank');
  renderPvpRankList(data?.rank?.list || []);
}

function renderPvpPlunderCard(data) {
  const pvp = state.pvp;
  const ownPower = data?.ownPower;

  els.pvpPlunderOwn.textContent = `Lực chiến của bạn: ${
    ownPower === null || ownPower === undefined
      ? 'Chưa xác định'
      : formatNumber(ownPower)
  }`;

  els.pvpPlunderPlan.disabled =
    pvp.running || pvpPlanMode === 'plunder' || !data;
  els.pvpPlunderBattles.disabled = pvp.running;
  els.pvpPlunderStop.hidden = !(pvp.running && pvp.mode === 'plunder');

  renderPvpProgress('plunder');
  renderPvpResult('plunder');
  renderPvpPlunderList(data?.plunder?.groups || []);
}

function renderPvpRankList(rows) {
  els.pvpRankList.replaceChildren();
  if (!Array.isArray(rows) || rows.length === 0) {
    els.pvpRankList.append(
      el('div', { class: 'pvp-list-empty', text: 'Chưa có dữ liệu xếp hạng.' }),
    );
    return;
  }

  const tbody = el('tbody');
  for (const row of rows) {
    const tr = el('tr', { class: pvpRowClass(row) });
    const nameCell = el('td', { class: 'pvp-name' }, [
      el('span', { text: row.name || '—' }),
    ]);
    if (row.isMe) nameCell.append(el('span', { class: 'pvp-me-badge', text: 'Bạn' }));

    tr.append(
      el('td', { class: 'pvp-rank-no', text: `#${formatNumber(row.rankNo)}` }),
      nameCell,
      el('td', { class: 'pvp-lv', text: `Lv ${formatNumber(row.level)}` }),
      pvpPowerCell(row),
      el('td', { class: 'pvp-lineup-cell' }, [pvpLineup(row.images)]),
    );
    tbody.append(tr);
  }

  els.pvpRankList.append(
    el('table', { class: 'pvp-table' }, [
      el('thead', {}, [
        el('tr', {}, [
          el('th', { text: 'Hạng' }),
          el('th', { text: 'Người chơi' }),
          el('th', { text: 'Lv' }),
          el('th', { text: 'Lực chiến' }),
          el('th', { text: 'Đội hình' }),
        ]),
      ]),
      tbody,
    ]),
  );
}

function renderPvpPlunderList(groups) {
  els.pvpPlunderList.replaceChildren();
  const filled = (Array.isArray(groups) ? groups : []).filter(
    (group) => Array.isArray(group?.targets) && group.targets.length > 0,
  );

  if (filled.length === 0) {
    els.pvpPlunderList.append(
      el('div', { class: 'pvp-list-empty', text: 'Chưa có mục tiêu cướp vàng.' }),
    );
    return;
  }

  const multiple = filled.length > 1;
  for (const group of filled) {
    const wrap = el('div', { class: 'pvp-group' });
    if (multiple) {
      wrap.append(
        el('div', {
          class: 'pvp-group-head',
          text: `Nhóm ${formatNumber(group.grp)}`,
        }),
      );
    }

    const tbody = el('tbody');
    for (const row of group.targets) {
      const tr = el('tr', { class: pvpRowClass(row) });
      tr.append(
        el('td', { class: 'pvp-name', text: row.name || '—' }),
        el('td', { class: 'pvp-lv', text: `Lv ${formatNumber(row.level)}` }),
        el('td', { class: 'pvp-num', text: formatNumber(row.gold) }),
        pvpPowerCell(row),
        el('td', { class: 'pvp-lineup-cell' }, [pvpLineup(row.images)]),
      );
      tbody.append(tr);
    }

    wrap.append(
      el('table', { class: 'pvp-table' }, [
        el('thead', {}, [
          el('tr', {}, [
            el('th', { text: 'Người chơi' }),
            el('th', { text: 'Lv' }),
            el('th', { text: 'Vàng' }),
            el('th', { text: 'Lực chiến' }),
            el('th', { text: 'Đội hình' }),
          ]),
        ]),
        tbody,
      ]),
    );
    els.pvpPlunderList.append(wrap);
  }
}

function renderPvpProgress(mode) {
  const pvp = state.pvp;
  const node = mode === 'rank' ? els.pvpRankProgress : els.pvpPlunderProgress;
  const label =
    mode === 'rank' ? els.pvpRankProgressLabel : els.pvpPlunderProgressLabel;
  const next =
    mode === 'rank' ? els.pvpRankProgressNext : els.pvpPlunderProgressNext;
  const bar =
    mode === 'rank' ? els.pvpRankProgressBar : els.pvpPlunderProgressBar;
  const hint =
    mode === 'rank' ? els.pvpRankProgressHint : els.pvpPlunderProgressHint;

  const active = pvp.running && pvp.mode === mode && pvp.progress;
  node.hidden = !active;
  if (!active) return;

  const progress = pvp.progress;
  const target = progress.targetName ? ` · ${progress.targetName}` : '';
  label.textContent = `Trận ${formatNumber(progress.current)}/${formatNumber(progress.total)}${target}`;
  next.textContent = pvp.abort ? 'Đang dừng…' : 'Đang gửi trận…';
  hint.textContent = pvp.abort
    ? 'Sẽ dừng sau trận hiện tại.'
    : 'Bấm Dừng để dừng sau trận hiện tại.';

  const percent =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;
  bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
}

function renderPvpResult(mode) {
  const node = mode === 'rank' ? els.pvpRankResult : els.pvpPlunderResult;
  const result =
    mode === 'rank' ? state.pvp.rankResult : state.pvp.plunderResult;

  node.hidden = !result;
  if (!result) {
    node.replaceChildren();
    return;
  }

  const battles = result.battles || [];
  const summary = result.summary || {};
  const stop = pvpStopReasonLabel(result.stopReason);

  const head = el('div', { class: 'pvp-result-head' }, [
    el('div', {}, [
      el('h4', {
        text: mode === 'rank' ? 'Kết quả Đấu Rank' : 'Kết quả Cướp vàng',
      }),
      el('p', {
        text: `${stop} · ${formatNumber(summary.total)} trận`,
      }),
    ]),
    el('span', { class: 'pvp-badge', text: stop }),
  ]);

  const chips = el('div', { class: 'pvp-chips pvp-result-chips' }, [
    pvpChip('Trận', formatNumber(summary.total), 'accent'),
    pvpChip('Thắng', formatNumber(summary.wins), 'good'),
    pvpChip('Thua', formatNumber(summary.losses), 'bad'),
    pvpChip('Dừng', stop, result.stopReason ? 'warn' : ''),
    mode === 'plunder'
      ? pvpChip('Vàng', `+${formatNumber(summary.gold)}`, 'good')
      : null,
  ]);

  const rows = el('div', { class: 'pvp-result-rows' });
  const visible = battles.slice(-40);
  const offset = battles.length - visible.length;

  for (let index = 0; index < visible.length; index += 1) {
    const battle = visible[index];
    const targetPower = pvpPowerText(battle.targetPower);
    const ownPower = pvpPowerText(battle.ownPower);
    const tone =
      battle.win === true
        ? 'win'
        : battle.win === false
          ? 'loss'
          : battle.skipReason
            ? 'skip'
            : '';
    const tag =
      battle.win === true ? 'Thắng' : battle.win === false ? 'Thua' : 'Chưa rõ';

    const parts = [
      el('span', { text: `LC ${targetPower} < ${ownPower}` }),
      el('span', { class: `pvp-result-tag ${tone}`.trim(), text: tag }),
      el('span', { text: `+${formatNumber(battle.expGained || 0)} EXP` }),
    ];
    if (mode === 'plunder') {
      parts.push(
        el('span', { text: `+${formatNumber(battle.goldWon || 0)} vàng` }),
      );
    }
    if (battle.skipReason) {
      parts.push(
        el('span', {
          class: 'pvp-result-skip',
          text: `Bỏ qua: ${pvpStopReasonLabel(battle.skipReason)}`,
        }),
      );
    }

    rows.append(
      el('div', { class: `pvp-result-row ${tone}`.trim() }, [
        el('b', {
          text: `#${offset + index + 1} ${battle.targetName || '—'}`,
        }),
        ...parts,
      ]),
    );
  }

  if (battles.length === 0) {
    rows.append(
      el('div', {
        class: 'pvp-result-row pvp-result-empty',
        text: 'Chưa có trận nào được ghi nhận.',
      }),
    );
  }

  node.replaceChildren(head, chips, rows);

  if (offset > 0) {
    node.append(
      el('div', {
        class: 'pvp-result-foot',
        text: `Hiển thị ${formatNumber(visible.length)}/${formatNumber(battles.length)} trận gần nhất.`,
      }),
    );
  }
}

function clampPvpBattles(value, max) {
  const limit = Math.max(1, Math.trunc(Number(max) || 1));
  const battles = Math.trunc(Number(value) || 1);
  return Math.min(limit, Math.max(1, battles));
}

function applyPvpPlanPowers(mode, plan) {
  const data = state.pvp.data;
  if (!data || !plan) return;

  const all = [...(plan.candidates || []), ...(plan.skipped || [])];

  if (mode === 'rank') {
    const rows = data.rank?.list || [];
    for (const row of rows) {
      row.stronger = false;
      row.lastBattle = null;
    }
    for (const item of all) {
      const row = rows.find(
        (candidate) =>
          (item.userId !== null && candidate.userId === item.userId) ||
          candidate.rankNo === item.rankNo,
      );
      if (!row) continue;
      row.power = item.power ?? null;
      row.stronger = item.reason === 'stronger';
    }
    if ('ownPower' in plan) data.ownPower = plan.ownPower;
    if ('ownRank' in plan && data.rank) data.rank.ownRank = plan.ownRank;
    return;
  }

  const targets = (data.plunder?.groups || []).flatMap(
    (group) => group.targets || [],
  );
  for (const target of targets) {
    target.stronger = false;
    target.lastBattle = null;
  }
  for (const item of all) {
    const target = targets.find((candidate) => candidate.userId === item.userId);
    if (!target) continue;
    target.power = item.power ?? null;
    target.stronger = item.reason === 'stronger';
  }
  if ('ownPower' in plan) data.ownPower = plan.ownPower;
}

function pvpConfirmRow(label, value, tone = '') {
  return el('div', { class: `pvp-confirm-row ${tone}`.trim() }, [
    el('dt', { text: label || '' }),
    el('dd', {
      text: value === null || value === undefined ? '—' : String(value),
    }),
  ]);
}

function openPvpConfirm({ mode, plan, onConfirm }) {
  state.pvp.confirm = {
    onConfirm,
    fired: false,
  };

  const isRank = mode === 'rank';
  const ownPower = plan?.ownPower;
  const candidates = plan?.candidates || [];
  const skipped = plan?.skipped || [];

  els.pvpConfirmTitle.textContent = isRank
    ? 'Xác nhận Đấu Rank'
    : 'Xác nhận Cướp vàng';
  els.btnPvpConfirm.textContent = 'Đánh';

  const summary = el('dl', { class: 'pvp-confirm-list' }, [
    pvpConfirmRow('Số trận', formatNumber(candidates.length)),
    pvpConfirmRow(
      'Lực chiến của bạn',
      ownPower === null || ownPower === undefined
        ? 'Chưa xác định'
        : formatNumber(ownPower),
    ),
  ]);

  const targets = el('div', { class: 'pvp-confirm-targets' });
  for (const candidate of candidates) {
    const parts = [];
    if (isRank) parts.push(`#${formatNumber(candidate.rankNo)}`);
    parts.push(`Lv ${formatNumber(candidate.level)}`);
    parts.push(
      `lực chiến ${pvpPowerText(candidate.power)} < ${pvpPowerText(ownPower)}`,
    );
    if (!isRank) parts.push(`${formatNumber(candidate.gold)} vàng`);
    targets.append(
      el('div', { class: 'pvp-confirm-target' }, [
        el('b', { text: candidate.name || '—' }),
        el('span', { text: parts.join(' · ') }),
      ]),
    );
  }

  const notes = el('div', { class: 'pvp-confirm-notes' }, [
    el('p', {
      class: 'pvp-confirm-skip',
      text: `Bỏ qua ${formatNumber(skipped.length)} đối thủ lực chiến cao hơn hoặc chưa rõ lực chiến.`,
    }),
    el('p', {
      class: 'pvp-confirm-warn',
      text: 'PvP ảnh hưởng tới người chơi khác. Không tiêu Kim cương.',
    }),
    isRank
      ? null
      : el('p', {
          class: 'pvp-confirm-extra',
          text: 'Thắng lấy tối đa 20.000 vàng; tối đa 60.000 vàng/người/ngày.',
        }),
  ]);

  els.pvpConfirmBody.replaceChildren(summary, targets, notes);
  els.pvpConfirmDialog.returnValue = '';
  if (!els.pvpConfirmDialog.open) els.pvpConfirmDialog.showModal();
}

async function requestPvpPlan(mode) {
  const pvp = state.pvp;
  if (pvp.running || pvpPlanMode) return;

  const account = selectedPvpAccount();
  const usable = Boolean(
    account &&
      account.enabled &&
      account.status === 'active' &&
      account.hasSession !== false,
  );
  if (!usable) {
    toast('Cần tài khoản đang hoạt động.', 'warn');
    return;
  }
  if (!pvp.data) {
    toast('Chưa có dữ liệu PvP.', 'warn');
    return;
  }

  const isRank = mode === 'rank';
  const input = isRank ? els.pvpRankBattles : els.pvpPlunderBattles;
  const battles = clampPvpBattles(input.value, isRank ? 5 : 10);
  input.value = String(battles);

  pvpPlanMode = mode;
  renderPvp();

  try {
    const payload = await api(`/api/accounts/${account.id}/pvp/${mode}/plan`, {
      method: 'POST',
      body: JSON.stringify({ battles }),
    });
    if (state.accountId !== account.id) return;

    const plan = payload?.plan;
    if (!plan) throw new Error('Không đọc được kế hoạch PvP.');

    applyPvpPlanPowers(mode, plan);
    pvp.plan = { mode, ...plan };

    if (!plan.ok) {
      if (plan.stopReason === 'low-level') {
        const lv = pvp.data?.player?.level ?? account.level ?? '?';
        toast(
          `PvP chưa mở cho nhân vật Lv ${lv}. Hãy đẩy cốt truyện / nhận cấp rồi thử lại.`,
          'error',
        );
      } else {
        toast(
          pvpStopReasonLabel(plan.stopReason) || 'Không có đối thủ hợp lệ',
          'warn',
        );
      }
      renderPvp();
      return;
    }

    openPvpConfirm({
      mode,
      plan,
      onConfirm: () => executePvpBatch({ accountId: account.id, mode, plan }),
    });
    renderPvp();
  } catch (error) {
    toast(error.message, 'error');
    renderPvp();
  } finally {
    if (pvpPlanMode === mode) pvpPlanMode = null;
    renderPvp();
  }
}

function markPvpBattleRows(mode, battle) {
  if (!battle) return;
  const outcome =
    battle.win === true ? 'win' : battle.win === false ? 'loss' : null;

  if (mode === 'rank') {
    const rows = state.pvp.data?.rank?.list || [];
    const row = rows.find(
      (candidate) =>
        (battle.targetUserId !== null &&
          candidate.userId === battle.targetUserId) ||
        candidate.rankNo === battle.targetRankNo,
    );
    if (row) row.lastBattle = outcome;
    return;
  }

  const targets = (state.pvp.data?.plunder?.groups || []).flatMap(
    (group) => group.targets || [],
  );
  const target = targets.find(
    (candidate) => candidate.userId === battle.targetUserId,
  );
  if (!target) return;
  target.lastBattle = outcome;
  if (outcome === 'win') target.wins = (Number(target.wins) || 0) + 1;
}

function pvpWait(ms) {
  return new Promise((resolve) => {
    const started = Date.now();
    const step = () => {
      const remaining = ms - (Date.now() - started);
      if (state.pvp.abort || remaining <= 0) {
        resolve();
        return;
      }
      setTimeout(step, Math.min(150, remaining));
    };
    step();
  });
}

async function executePvpBatch({ accountId, mode, plan }) {
  const pvp = state.pvp;
  if (pvp.running) return;

  const candidates = [...(plan?.candidates || [])];
  const result = {
    battles: [],
    summary: { total: 0, wins: 0, losses: 0, gold: 0 },
    stopReason: null,
  };
  if (mode === 'rank') pvp.rankResult = result;
  else pvp.plunderResult = result;

  pvp.running = true;
  pvp.abort = false;
  pvp.mode = mode;
  pvp.error = null;
  pvp.progress = {
    current: 1,
    total: candidates.length,
    targetName: candidates[0]?.name || '',
  };
  renderPvp();

  let stopReason = null;
  let bestRank = null;

  try {
    for (let index = 0; index < candidates.length; index += 1) {
      if (pvp.abort) {
        stopReason = 'user-stop';
        break;
      }

      const candidate = candidates[index];
      pvp.progress.current = index + 1;
      pvp.progress.targetName = candidate.name || '';
      renderPvp();

      const body =
        mode === 'rank'
          ? {
              confirm: true,
              targetRankNo: candidate.rankNo,
              targetUserId: candidate.userId,
              targetName: candidate.name,
            }
          : {
              confirm: true,
              targetUserId: candidate.userId,
              targetName: candidate.name,
            };

      const payload = await api(
        `/api/accounts/${accountId}/pvp/${mode}/battle`,
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
      );
      const outcome = payload?.result || {};
      const battle = outcome.battle;
      const reason =
        outcome.stopReason ||
        (outcome.error ? `error:${outcome.error}` : 'error:unknown');
      const skipAllowed =
        mode === 'plunder' && (reason === 'no-gold' || reason === 'no-target');

      if (battle) {
        battle.skipReason = skipAllowed ? reason : null;
        result.battles.push(battle);
        result.summary.total += 1;
        if (battle.win === true) result.summary.wins += 1;
        else if (battle.win === false) result.summary.losses += 1;
        if (mode === 'plunder' && battle.win === true) {
          result.summary.gold += Number(battle.goldWon) || 0;
        }
        if (mode === 'rank' && battle.win === true) {
          const rank = state.pvp.data?.rank;
          if (rank && Number.isFinite(battle.targetRankNo)) {
            rank.ownRank =
              rank.ownRank === null || rank.ownRank === undefined
                ? battle.targetRankNo
                : Math.min(rank.ownRank, battle.targetRankNo);
            bestRank =
              bestRank === null
                ? rank.ownRank
                : Math.min(bestRank, rank.ownRank);
          }
        }
        markPvpBattleRows(mode, battle);
      } else if (skipAllowed) {
        result.battles.push({
          mode,
          targetUserId: candidate.userId,
          targetRankNo: candidate.rankNo ?? null,
          targetName: candidate.name || '',
          targetPower: candidate.power ?? null,
          ownPower: plan?.ownPower ?? null,
          win: null,
          expGained: 0,
          skipReason: reason,
        });
        result.summary.total += 1;
      }

      if (!outcome.ok) {
        if (skipAllowed) {
          renderPvp();
          if (index + 1 < candidates.length) {
            await pvpWait(250 + Math.random() * 150);
          }
          continue;
        }
        stopReason = reason;
        break;
      }

      if (pvp.abort) {
        stopReason = 'user-stop';
        break;
      }

      if (index + 1 < candidates.length) {
        renderPvp();
        await pvpWait(250 + Math.random() * 150);
        if (pvp.abort) {
          stopReason = 'user-stop';
          break;
        }
      }
    }

    if (pvp.abort && !stopReason) stopReason = 'user-stop';
  } catch (error) {
    stopReason = `error:${error.message}`;
    toast(error.message, 'error');
  } finally {
    result.stopReason = stopReason;
    pvp.running = false;
    pvp.abort = false;
    pvp.progress = null;
    pvp.mode = null;
    renderPvp();
  }

  const account = selectedPvpAccount();
  if (account && account.id === accountId) await loadPvp({ force: true });

  if (mode === 'rank' && bestRank !== null && state.pvp.data?.rank) {
    const current = state.pvp.data.rank.ownRank;
    state.pvp.data.rank.ownRank =
      current === null || current === undefined
        ? bestRank
        : Math.min(current, bestRank);
    renderPvp();
  }

  const summary = result.summary;
  const type =
    stopReason && stopReason !== 'user-stop' ? 'warn' : 'success';
  if (mode === 'rank') {
    toast(
      `Đấu Rank: ${formatNumber(summary.total)} trận, ${formatNumber(summary.wins)} thắng, ${formatNumber(summary.losses)} thua.`,
      type,
    );
  } else {
    toast(
      `Cướp vàng: ${formatNumber(summary.total)} trận, ${formatNumber(summary.wins)} thắng, +${formatNumber(summary.gold)} vàng.`,
      type,
    );
  }
  if (stopReason === 'user-stop') toast('Đã dừng theo yêu cầu.', 'info');
}

function requestPvpStop() {
  if (!state.pvp.running) return;
  state.pvp.abort = true;
  toast('Sẽ dừng sau trận hiện tại.', 'info');
  renderPvp();
}

/* ------------------------------ PvP · Events ------------------------------ */

els.btnPvpRefresh.addEventListener('click', () => loadPvp({ force: true }));


els.pvpRankPlan.addEventListener('click', () => requestPvpPlan('rank'));
els.pvpPlunderPlan.addEventListener('click', () => requestPvpPlan('plunder'));
els.pvpRankStop.addEventListener('click', requestPvpStop);
els.pvpPlunderStop.addEventListener('click', requestPvpStop);

els.pvpConfirmDialog.addEventListener('close', () => {
  const pending = state.pvp.confirm;
  state.pvp.confirm = null;
  if (!pending || pending.fired) return;
  if (els.pvpConfirmDialog.returnValue !== 'confirm') return;

  pending.fired = true;
  const run = pending.onConfirm;
  if (typeof run !== 'function') return;

  Promise.resolve()
    .then(run)
    .catch((error) => toast(error.message, 'error'));
});

/* ------------------------------ Account form ------------------------------ */

function resetForm() {
  els.accountForm.reset();
  els.fields.server.value = 'S1';
  els.formError.hidden = true;
  els.formError.textContent = '';
  els.fields.password.type = 'password';
  document.getElementById('togglePassword').textContent = 'Hiện';
}

function openAdd() {
  switchView('accounts');
  state.editingId = null;
  resetForm();
  els.dialogTitle.textContent = 'Thêm tài khoản';
  els.passwordLabel.innerHTML = 'Mật khẩu <b>*</b>';
  els.passwordHint.hidden = true;
  els.fields.password.required = true;
  els.fields.password.placeholder = 'Nhập mật khẩu game';
  els.btnSave.textContent = 'Lưu tài khoản';
  els.accountDialog.showModal();
  els.fields.username.focus();
}

function openEdit(account) {
  state.editingId = account.id;
  resetForm();
  els.dialogTitle.textContent = 'Sửa tài khoản';
  els.passwordLabel.textContent = 'Mật khẩu mới';
  els.passwordHint.hidden = false;
  els.passwordHint.textContent = 'Để trống nếu không đổi. Đổi mật khẩu sẽ đăng xuất phiên hiện tại.';
  els.fields.password.required = false;
  els.fields.password.placeholder = 'Để trống nếu không đổi';
  els.fields.username.value = account.username;
  els.fields.server.value = account.server || 'S1';
  els.fields.characterName.value = account.characterName || '';
  els.fields.label.value = account.label || '';
  els.btnSave.textContent = 'Lưu thay đổi';
  els.accountDialog.showModal();
  els.fields.username.focus();
}

function openDelete(account) {
  state.deletingId = account.id;
  els.confirmText.textContent = `Xóa tài khoản “${account.username}” khỏi danh sách? Thao tác này không thể hoàn tác.`;
  els.confirmDialog.showModal();
}

async function deleteAccount() {
  const id = state.deletingId;
  if (!id) return;

  try {
    await api(`/api/accounts/${id}`, { method: 'DELETE' });
    toast('Đã xóa tài khoản.');
    invalidateAccountData(id);
    if (state.accountId === id) state.accountId = null;
    await loadAccounts();
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    state.deletingId = null;
  }
}

async function submitAccount(event) {
  event.preventDefault();
  els.formError.hidden = true;

  const username = els.fields.username.value.trim();
  const password = els.fields.password.value;
  const isEdit = state.editingId !== null;

  if (!username) {
    showFormError('Vui lòng nhập tên đăng nhập.');
    return;
  }
  if (!isEdit && !password) {
    showFormError('Vui lòng nhập mật khẩu.');
    return;
  }

  const body = {
    username,
    server: els.fields.server.value.trim() || 'S1',
    characterName: els.fields.characterName.value.trim(),
    label: els.fields.label.value.trim(),
  };
  if (password) body.password = password;

  els.btnSave.disabled = true;
  els.btnSave.textContent = 'Đang lưu…';

  try {
    if (isEdit) {
      await api(`/api/accounts/${state.editingId}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      toast('Đã cập nhật tài khoản.');
    } else {
      await api('/api/accounts', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      toast('Đã thêm tài khoản mới.');
    }
    els.accountDialog.close();
    await loadAccounts();
  } catch (error) {
    showFormError(error.message);
  } finally {
    els.btnSave.disabled = false;
    els.btnSave.textContent = isEdit ? 'Lưu thay đổi' : 'Lưu tài khoản';
  }
}

function showFormError(message) {
  els.formError.textContent = message;
  els.formError.hidden = false;
}

/* ------------------------------ Events ------------------------------ */

let searchTimer = null;

els.search.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.query = els.search.value.trim();
    render();
  }, 120);
});

els.filters.addEventListener('click', (event) => {
  const chip = event.target.closest('.chip');
  if (!chip) return;
  state.status = chip.dataset.status;
  for (const item of els.filters.querySelectorAll('.chip')) {
    item.classList.toggle('active', item === chip);
  }
  render();
});

for (const item of els.navItems) {
  item.addEventListener('click', () => switchView(item.dataset.view));
}


els.btnDashboardRefresh.addEventListener('click', () =>
  loadDashboard({ force: true }),
);


els.btnDailyRefresh.addEventListener('click', () => loadDaily({ force: true }));
els.btnClaimAll.addEventListener('click', claimAllDaily);


els.teamMode.addEventListener('click', (event) => {
  const button = event.target.closest('.mode-btn');
  if (!button) return;
  const mode = button.dataset.mode === 'def' ? 'def' : 'atk';
  if (state.team.mode === mode) return;
  state.team.mode = mode;
  state.team.plan = null;
  for (const item of els.teamMode.querySelectorAll('.mode-btn')) {
    item.classList.toggle('active', item === button);
  }
  renderTeam();
});

els.btnTeamRefresh.addEventListener('click', () => loadTeam({ force: true }));
els.btnStrongest.addEventListener('click', requestStrongestPlan);

els.teamApplyDialog.addEventListener('close', () => {
  if (els.teamApplyDialog.returnValue === 'confirm') {
    doApplyTeam();
  }
});


els.btnCraftRefresh.addEventListener('click', () => loadCraft({ force: true }));

els.craftTabs.addEventListener('click', (event) => {
  const button = event.target.closest('.mode-btn');
  if (!button) return;
  const type = button.dataset.type === 'equip' ? 'equip' : 'ninja';
  if (state.craftment.type === type) return;
  state.craftment.type = type;
  state.craftment.targetId = null;
  state.craftment.fuelData = null;
  state.craftment.result = null;
  state.craftment.data = null;
  state.craftment.loadedAt = 0;
  renderCraft();
  loadCraft({ force: true });
});

els.craftConfirmDialog.addEventListener('close', () => {
  const pending = state.craftment.confirm;
  state.craftment.confirm = null;
  if (!pending || pending.fired) return;
  if (els.craftConfirmDialog.returnValue !== 'confirm') return;
  pending.fired = true;
  requestCraftUpgrade();
});

els.btnGachaRefresh.addEventListener('click', () => loadGacha({ force: true }));


els.btnGachaDraw.addEventListener('click', openGachaConfirm);

els.gachaDraws.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') openGachaConfirm();
});

els.gachaConfirmDialog.addEventListener('close', () => {
  const pending = state.gacha.confirm;
  state.gacha.confirm = null;
  if (!pending || pending.fired) return;
  if (els.gachaConfirmDialog.returnValue !== 'confirm') return;
  pending.fired = true;
  requestGachaDraw(pending.draws);
});

els.bagTabs.addEventListener('click', (event) => {
  const button = event.target.closest('.mode-btn');
  if (!button) return;
  const tab = button.dataset.tab;
  if (tab !== 'ninja' && tab !== 'equipment' && tab !== 'items' && tab !== 'gems') return;
  if (state.bag.tab === tab) return;
  state.bag.tab = tab;
  renderBag();
});

els.btnBagRefresh.addEventListener('click', () => loadBag({ force: true }));

els.bagActionDialog.addEventListener('close', () => {
  const action = state.bag.action;
  state.bag.action = null;
  if (els.bagActionDialog.returnValue === 'confirm' && action) {
    runBagAction(action);
  }
});


els.logLevel.addEventListener('change', () => {
  state.logs.level = els.logLevel.value;
  loadLogs({ reset: true });
});

els.btnLogRefresh.addEventListener('click', () => loadLogs({ reset: true }));
els.btnLogMore.addEventListener('click', () => loadLogs());

document.getElementById('btnAdd').addEventListener('click', openAdd);
document.getElementById('btnEmptyAdd').addEventListener('click', openAdd);
els.accountForm.addEventListener('submit', submitAccount);

for (const button of document.querySelectorAll('[data-close]')) {
  button.addEventListener('click', () => button.closest('dialog').close());
}

for (const dialog of document.querySelectorAll('dialog')) {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

document.getElementById('togglePassword').addEventListener('click', (event) => {
  const input = els.fields.password;
  const reveal = input.type === 'password';
  input.type = reveal ? 'text' : 'password';
  event.currentTarget.textContent = reveal ? 'Ẩn' : 'Hiện';
});

document.addEventListener('click', (event) => {
  for (const menu of document.querySelectorAll('.card-menu[open]')) {
    if (!menu.contains(event.target)) menu.close();
  }
});

els.confirmDialog.addEventListener('close', () => {
  if (els.confirmDialog.returnValue === 'confirm') {
    deleteAccount();
  } else {
    state.deletingId = null;
  }
});

/* ------------------------------ Advisor ------------------------------ */

const ACCOUNT_VIEW_KEYS = {
  dashboard: 'dashboard',
  daily: 'daily',
  training: 'training',
  boss: 'boss',
  pvp: 'pvp',
  team: 'team',
  bag: 'bag',
};

function focusAccountView(view, accountId) {
  state.accountId = accountId;
  syncAccountSelects();
  switchView(view);
}

function syncAdvisorSelect() {
  state.advisor.data = null;
  state.advisor.loadedAt = 0;
}

function advisorStateLabel(entry) {
  if (entry.state === 'unavailable') return 'Không dùng được';
  if (entry.state === 'never') return 'Chưa quét';
  if (entry.stale) return 'Dữ liệu cũ';
  return 'Đã quét';
}

function advisorStateClass(entry) {
  if (entry.state === 'unavailable') return 'off';
  if (entry.state === 'never') return 'never';
  return entry.stale ? 'stale' : 'ready';
}

function renderAdvisorCard(entry) {
  const account = entry.account;
  const name = account.characterName || account.username;
  const meta = [
    account.username,
    account.level ? `Lv ${account.level}` : null,
    account.power ? `LC ${formatNumber(account.power)}` : null,
    account.autoEnabled ? 'Auto bật' : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const body = [];

  if (entry.state === 'unavailable') {
    body.push(el('p', { class: 'advisor-note', text: entry.reason }));
  } else if (entry.state === 'never') {
    body.push(
      el('div', { class: 'advisor-note-row' }, [
        el('p', { class: 'advisor-note', text: entry.reason }),
        (() => {
          const button = el('button', {
            class: 'btn btn-ghost btn-sm',
            type: 'button',
            text: 'Quét ngay',
          });
          button.addEventListener('click', () => scanAdvisorFor(account.id));
          return button;
        })(),
      ]),
    );
  } else if (entry.advice.length === 0) {
    body.push(el('p', { class: 'advisor-note', text: 'Không có việc gấp. Tiếp tục farm hoặc nghỉ.' }));
  } else {
    body.push(
      el(
        'div',
        { class: 'advisor-advice' },
        entry.advice.map((item) => {
          const canOpen = Boolean(item.targetView && els.views[item.targetView]);
          const action = canOpen
            ? el('button', {
                class: 'btn btn-ghost btn-sm',
                type: 'button',
                text: item.actionLabel || 'Mở',
              })
            : null;
          if (action) {
            action.addEventListener('click', () =>
              focusAccountView(item.targetView, account.id),
            );
          }

          return el('div', { class: 'advisor-item' }, [
            el('span', { class: 'advisor-priority', text: String(item.priority) }),
            el('div', { class: 'advisor-item-main' }, [
              el('div', { class: 'advisor-item-title' }, [
                el('strong', { text: item.title }),
                el('span', {
                  class: `dash-risk ${item.risk}`,
                  text: dashRiskLabel(item.risk),
                }),
              ]),
              el('p', { text: item.detail }),
            ]),
            action,
          ]);
        }),
      ),
    );
  }

  if (entry.alerts.length > 0) {
    body.push(
      el(
        'div',
        { class: 'advisor-alerts' },
        entry.alerts.slice(0, 4).map((alert) =>
          el('span', { class: `advisor-alert ${alert.level}`, title: alert.detail }, [
            el('b', { text: alert.title }),
          ]),
        ),
      ),
    );
  }

  const foot = el('footer', { class: 'advisor-card-foot' }, [
    el('span', {
      text:
        entry.scannedAt && entry.ageSeconds !== null
          ? `Quét ${formatDuration(entry.ageSeconds)} trước`
          : 'Chưa có dữ liệu',
    }),
    (() => {
      const button = el('button', {
        class: 'btn btn-ghost btn-sm',
        type: 'button',
        text: entry.state === 'never' ? 'Quét' : 'Quét lại',
      });
      button.disabled = state.advisor.scanning;
      button.addEventListener('click', () => scanAdvisorFor(account.id));
      return button;
    })(),
  ]);

  return el('article', { class: 'advisor-card' }, [
    el('header', { class: 'advisor-card-head' }, [
      el('div', { class: 'advisor-ident' }, [
        el('h3', { text: name }),
        el('p', { text: meta }),
      ]),
      el('span', {
        class: `advisor-state ${advisorStateClass(entry)}`,
        text: advisorStateLabel(entry),
      }),
    ]),
    el('div', { class: 'advisor-card-body' }, body),
    foot,
  ]);
}

function renderAdvisor() {
  const { data, loading, scanning, error } = state.advisor;
  syncAdvisorSelect();

  els.advisorSummary.hidden = true;
  els.advisorEmpty.hidden = true;
  els.advisorLoading.hidden = !(loading || scanning);
  els.advisorError.hidden = true;
  els.advisorError.replaceChildren();
  els.advisorList.replaceChildren();
  els.advisorSynced.textContent = data?.generatedAt
    ? `Cập nhật: ${formatDate(data.generatedAt)}`
    : '';

  els.btnAdvisorScan.disabled = scanning;
  els.btnAdvisorScanAll.disabled = scanning;
  els.btnAdvisorScan.textContent = scanning ? 'Đang quét…' : 'Quét tài khoản';
  els.btnAdvisorScanAll.textContent = scanning ? 'Đang quét…' : 'Quét tất cả';

  if (error) {
    els.advisorError.hidden = false;
    els.advisorError.append(
      el('div', { class: 'notice notice-error' }, [el('p', { text: error })]),
    );
  }

  if (!data || data.accounts.length === 0) {
    els.advisorEmpty.hidden = false;
    if (error) {
      els.advisorEmptyTitle.textContent = 'Không tải được Cố vấn';
      els.advisorEmptyText.textContent = 'Kiểm tra kết nối tới server rồi thử lại.';
    } else if (state.accounts.length > 0) {
      els.advisorEmptyTitle.textContent = 'Chưa quét tài khoản';
      els.advisorEmptyText.textContent =
        'Bấm “Quét tất cả” hoặc chọn một tài khoản để nhận gợi ý.';
    } else {
      els.advisorEmptyTitle.textContent = 'Chưa có tài khoản';
      els.advisorEmptyText.textContent =
        'Thêm và đăng nhập một tài khoản để nhận gợi ý việc nên làm.';
    }
    els.advisorFoot.textContent =
      'Cố vấn chỉ đọc trạng thái game, không gửi lệnh thay đổi.';
    return;
  }

  const { totals } = data;
  els.advisorSummary.hidden = false;
  els.advisorSummary.replaceChildren(
    ...[
      ['Cần xử lý', totals.needsAction, 'tài khoản'],
      ['Đã quét', totals.scanned, `${totals.accounts} tài khoản`],
      ['Dữ liệu cũ', totals.stale, 'quá 10 phút'],
      ['Cảnh báo', totals.alerts, 'mục'],
      ['Có thể nhận', totals.claimsReady, 'phần thưởng'],
    ].map(([label, value, sub]) =>
      el('div', { class: 'advisor-chip' }, [
        el('span', { text: label }),
        el('strong', { text: formatNumber(value) }),
        el('small', { text: sub }),
      ]),
    ),
  );

  els.advisorList.append(
    ...data.accounts
      .slice()
      .sort((a, b) => {
        const rank = (entry) =>
          entry.state === 'ready' ? (entry.advice.length > 0 ? 0 : 2) : 1;
        return rank(a) - rank(b);
      })
      .map(renderAdvisorCard),
  );

  const active = data.accounts.filter(
    (entry) => entry.account.enabled && entry.account.status === 'active',
  ).length;
  els.advisorFoot.textContent =
    active === 0
      ? 'Không có tài khoản nào đang đăng nhập để quét.'
      : `${active} tài khoản đang đăng nhập · dữ liệu quá 10 phút sẽ được đánh dấu cũ.`;
}

async function loadAdvisor({ force = false } = {}) {
  const fresh = state.advisor.data && Date.now() - state.advisor.loadedAt < 30_000;
  if (!force && fresh) {
    renderAdvisor();
    return;
  }

  state.advisor.loading = true;
  renderAdvisor();

  try {
    const data = await api('/api/advisor');
    state.advisor.data = data;
    state.advisor.loadedAt = Date.now();
    state.advisor.error = null;
  } catch (error) {
    state.advisor.error = error.message;
  } finally {
    state.advisor.loading = false;
    renderAdvisor();
  }
}

async function scanAdvisor({ all = false } = {}) {
  if (state.advisor.scanning) return;

  if (!all && !state.accountId) {
    toast('Chọn tài khoản trong tab Tài khoản để quét.', 'error');
    return;
  }

  state.advisor.scanning = true;
  state.advisor.error = null;
  renderAdvisor();

  try {
    const body = all
      ? { force: true }
      : { accountIds: [state.accountId], force: true };
    const data = await api('/api/advisor/scan', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    state.advisor.data = data;
    state.advisor.loadedAt = Date.now();

    const failed = (data.results || []).filter((result) => !result.ok);
    if (failed.length > 0) {
      toast(`Quét xong, ${failed.length} tài khoản lỗi.`, 'warn');
    } else {
      toast(`Đã quét ${(data.results || []).length} tài khoản.`, 'success');
    }

    await loadAccounts();
  } catch (error) {
    state.advisor.error = error.message;
    toast(error.message, 'error');
  } finally {
    state.advisor.scanning = false;
    renderAdvisor();
  }
}

function scanAdvisorFor(accountId) {
  state.accountId = accountId;
  syncAccountSelects();
  scanAdvisor();
}

/* -------------------------------- Bot -------------------------------- */

function botSettingsFromForm() {
  return {
    dryRun: els.botDryRun.checked,
    intervalSeconds: Number(els.botInterval.value) || 300,
    maxActions: Number(els.botMaxActions.value) || 1,
    allowDaily: els.botAllowDaily.checked,
    allowStory: els.botAllowStory.checked,
    allowBoss: els.botAllowBoss.checked,
    allowPvp: els.botAllowPvp.checked,
    storyRunsPerDay: Number(els.botStoryRuns.value) || 0,
    pvpBattlesPerDay: Number(els.botPvpBattles.value) || 0,
  };
}

function applyBotSettings(settings) {
  if (!settings) return;
  els.botDryRun.checked = Boolean(settings.dryRun);
  els.botAllowDaily.checked = Boolean(settings.allowDaily);
  els.botAllowStory.checked = Boolean(settings.allowStory);
  els.botAllowBoss.checked = Boolean(settings.allowBoss);
  els.botAllowPvp.checked = Boolean(settings.allowPvp);

  const setValue = (node, value) => {
    if (document.activeElement !== node) node.value = String(value);
  };
  setValue(els.botInterval, settings.intervalSeconds);
  setValue(els.botMaxActions, settings.maxActions);
  setValue(els.botStoryRuns, settings.storyRunsPerDay);
  setValue(els.botPvpBattles, settings.pvpBattlesPerDay);
}

function botCountdown(seconds) {
  const value = Math.max(0, Number(seconds) || 0);
  if (value === 0) return 'ngay bây giờ';
  return `sau ${formatDuration(value)}`;
}

function renderBotAccount(entry) {
  const account = entry.account;
  const name = account.characterName || account.username;

  let stateLabel = 'Chờ';
  let stateClass = 'idle';
  if (!entry.eligible) {
    stateLabel = !account.enabled
      ? 'Đang tắt'
      : !account.autoEnabled
        ? 'Auto tắt'
        : 'Chưa đăng nhập';
    stateClass = 'off';
  } else if (entry.suspended) {
    stateLabel = 'Tạm treo';
    stateClass = 'error';
  } else if (entry.busy) {
    stateLabel = 'Đang chạy';
    stateClass = 'running';
  } else if (entry.lastError) {
    stateLabel = 'Lỗi gần nhất';
    stateClass = 'error';
  }

  const counters = entry.counters || {};
  const detail = entry.lastResult
    ? entry.lastResult
    : entry.eligible
      ? `Lần tới ${botCountdown(entry.dueInSeconds)}`
      : 'Bật Auto và đăng nhập để bot chạy tài khoản này.';

  const chosen = state.accountId === account.id;
  const select = el('button', {
    class: `btn btn-sm ${chosen ? 'btn-primary' : 'btn-ghost'} bot-account-select`,
    type: 'button',
    title: chosen ? 'Đang dùng' : 'Chọn tài khoản này ở mọi tab',
    onclick: () => selectAccount(account.id),
  }, [icon(chosen ? 'check' : 'arrow'), chosen ? 'Đang dùng' : 'Chọn']);

  return el('div', { class: `bot-account ${entry.eligible ? 'eligible' : ''}` }, [
    el('div', { class: 'bot-account-avatar', 'aria-hidden': 'true' }, [
      name.trim().charAt(0).toUpperCase(),
    ]),
    el('div', { class: 'bot-account-main' }, [
      el('div', { class: 'bot-account-title' }, [
        el('strong', { text: name }),
        el('span', { class: `bot-pill ${stateClass}`, text: stateLabel }),
      ]),
      el('small', {
        text: [
          account.username,
          account.level ? `Lv ${account.level}` : null,
          account.power ? `LC ${formatNumber(account.power)}` : null,
          entry.lastRunAt ? `chạy ${formatDate(entry.lastRunAt)}` : null,
        ]
          .filter(Boolean)
          .join(' · '),
      }),
      el('p', { class: 'bot-account-detail', text: detail }),
      el('div', { class: 'bot-account-counters' }, [
        el('span', { title: 'Hành động hôm nay' }, [icon('bolt'), `HĐ ${counters.actions || 0}`]),
        el('span', { title: 'Daily đã nhận' }, [icon('gift'), `Daily ${counters.claims || 0}`]),
        el('span', { title: 'Trận cốt truyện' }, [icon('tasks'), `Story ${counters.storyRuns || 0}`]),
        el('span', { title: 'Hit boss' }, [icon('star'), `Boss ${counters.bossHits || 0}`]),
        el('span', { title: 'Trận PvP' }, [icon('trophy'), `PvP ${counters.pvpBattles || 0}`]),
      ]),
    ]),
    select,
  ]);
}

function renderBot() {
  const { data, loading, error, busy } = state.bot;

  if (!data) {
    els.botStatus.className = 'bot-status stopped';
    els.botStatus.textContent = loading ? 'Đang tải…' : 'Đã dừng';
    els.botSummary.replaceChildren();
    els.botAccounts.replaceChildren(
      el('div', { class: 'bot-empty', text: loading ? 'Đang tải trạng thái bot…' : 'Chưa có dữ liệu.' }),
    );
    els.botEvents.replaceChildren();
    els.botEligible.textContent = '';
    if (error) {
      els.botSummary.append(
        el('div', { class: 'notice notice-error' }, [el('p', { text: error })]),
      );
    }
    return;
  }

  const running = Boolean(data.running);
  els.botStatus.className = `bot-status ${running ? 'running' : 'stopped'}`;
  els.botStatus.textContent = running ? 'Đang chạy' : 'Đã dừng';
  els.btnBotStart.hidden = running;
  els.btnBotStop.hidden = !running;
  els.btnBotStart.disabled = busy;
  els.btnBotStop.disabled = busy;
  els.btnBotTick.disabled = busy || data.ticking;
  els.botHero.classList.toggle('is-running', running);

  if (!state.bot.dirty) applyBotSettings(data.settings);

  const totals = data.totals || {};
  els.botSummary.replaceChildren(
    el('div', { class: 'bot-summary-grid' }, [
      ['Tài khoản đủ điều kiện', totals.eligible ?? 0, `${totals.accounts ?? 0} tài khoản`],
      ['Hành động hôm nay', totals.actionsToday ?? 0, 'trên mọi tài khoản'],
      ['Đang treo', totals.suspended ?? 0, 'lỗi liên tiếp'],
      ['Lần chạy cuối', data.lastTickAt ? formatDate(data.lastTickAt) : '—', 'vòng quét gần nhất'],
    ].map(([label, value, sub]) =>
      el('div', { class: 'bot-kpi' }, [
        el('span', { text: label }),
        el('strong', { text: typeof value === 'number' ? formatNumber(value) : value }),
        el('small', { text: sub }),
      ]),
    )),
  );

  if (error) {
    els.botSummary.append(
      el('div', { class: 'notice notice-error' }, [el('p', { text: error })]),
    );
  }

  els.botEligible.textContent = `${totals.eligible ?? 0}/${totals.accounts ?? 0} đủ điều kiện`;
  els.botAccounts.replaceChildren(
    ...(data.accounts || []).map(renderBotAccount),
  );
  if (!data.accounts || data.accounts.length === 0) {
    els.botAccounts.append(
      el('div', { class: 'bot-empty', text: 'Chưa có tài khoản nào.' }),
    );
  }

  const events = data.events || [];
  els.botEvents.replaceChildren(
    ...events.map((event) =>
      el('div', { class: `bot-event ${event.level}` }, [
        el('span', { class: 'bot-event-time', text: formatDate(event.at) }),
        el('p', { text: event.message }),
      ]),
    ),
  );
  if (events.length === 0) {
    els.botEvents.append(
      el('div', { class: 'bot-empty', text: 'Chưa có hoạt động. Bật bot để bắt đầu.' }),
    );
  }
}

async function loadBot({ silent = false } = {}) {
  if (!silent) {
    state.bot.loading = true;
    renderBot();
  }

  try {
    const data = await api('/api/engine');
    state.bot.data = data;
    state.bot.loadedAt = Date.now();
    state.bot.error = null;
  } catch (error) {
    state.bot.error = error.message;
  } finally {
    state.bot.loading = false;
    renderBot();
  }
}

function startBotPolling() {
  if (state.bot.timer) return;
  state.bot.timer = setInterval(() => {
    if (state.view === 'bot') loadBot({ silent: true });
  }, 5000);
}

function stopBotPolling() {
  if (!state.bot.timer) return;
  clearInterval(state.bot.timer);
  state.bot.timer = null;
}

let botSaveTimer = null;

function queueBotSettingsSave() {
  state.bot.dirty = true;
  clearTimeout(botSaveTimer);
  botSaveTimer = setTimeout(saveBotSettings, 600);
}

async function saveBotSettings() {
  if (state.bot.saving) {
    queueBotSettingsSave();
    return;
  }
  state.bot.saving = true;
  try {
    const data = await api('/api/engine/settings', {
      method: 'PATCH',
      body: JSON.stringify({
        ...botSettingsFromForm(),
        confirm: true,
      }),
    });
    state.bot.data = data.state;
    state.bot.dirty = false;
    renderBot();
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    state.bot.saving = false;
  }
}

async function startBot() {
  if (state.bot.busy) return;
  state.bot.busy = true;
  renderBot();
  try {
    const data = await api('/api/engine/start', {
      method: 'POST',
      body: JSON.stringify({ settings: botSettingsFromForm(), confirm: true }),
    });
    state.bot.data = data;
    state.bot.dirty = false;
    toast('Bot đã bắt đầu chạy.', 'success');
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    state.bot.busy = false;
    renderBot();
  }
}

async function stopBot() {
  if (state.bot.busy) return;
  state.bot.busy = true;
  renderBot();
  try {
    const data = await api('/api/engine/stop', { method: 'POST' });
    state.bot.data = data;
    toast('Bot đã dừng.', 'info');
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    state.bot.busy = false;
    renderBot();
  }
}

async function tickBot() {
  if (state.bot.busy) return;
  state.bot.busy = true;
  renderBot();
  try {
    const data = await api('/api/engine/tick', {
      method: 'POST',
      body: JSON.stringify({ confirm: true }),
    });
    state.bot.data = data.state;
    const actions = (data.result?.results || []).reduce(
      (sum, item) => sum + (item.actions?.length || 0),
      0,
    );
    toast(
      actions > 0
        ? `Đã chạy 1 vòng: ${actions} hành động.`
        : 'Đã chạy 1 vòng: không có hành động nào.',
      actions > 0 ? 'success' : 'info',
    );
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    state.bot.busy = false;
    renderBot();
  }
}


els.btnAdvisorScan.addEventListener('click', () => scanAdvisor());
els.btnAdvisorScanAll.addEventListener('click', () => scanAdvisor({ all: true }));

els.btnBotStart.addEventListener('click', startBot);
els.btnBotStop.addEventListener('click', stopBot);
els.btnBotRefresh.addEventListener('click', () => loadBot());
els.btnBotTick.addEventListener('click', tickBot);

for (const node of [
  els.botDryRun,
  els.botInterval,
  els.botMaxActions,
  els.botAllowDaily,
  els.botAllowStory,
  els.botAllowBoss,
  els.botAllowPvp,
  els.botStoryRuns,
  els.botPvpBattles,
]) {
  node.addEventListener('input', queueBotSettingsSave);
  node.addEventListener('change', queueBotSettingsSave);
}

/* ------------------------------ Max buttons ------------------------------ */

function attachMaxButtons() {
  const specs = [
    { id: 'gachaDraws', max: () => state.gacha.data?.affordable ?? 100 },
    { id: 'bossBeastHits', max: () => 50 },
    { id: 'bossGuildHits', max: () => Number(els.bossGuildHits?.max) || 1 },
    { id: 'pvpRankBattles', max: () => 5 },
    { id: 'pvpPlunderBattles', max: () => 10 },
  ];
  for (const { id, max } of specs) {
    const input = document.getElementById(id);
    if (!input || input.dataset.maxAttached) continue;
    const button = el('button', {
      class: 'btn btn-ghost btn-sm max-btn',
      type: 'button',
      title: 'Nhập số lượng lớn nhất',
      onclick: () => {
        input.value = String(Math.max(1, Math.floor(max())));
        input.dispatchEvent(new Event('input', { bubbles: true }));
      },
    }, [icon('max'), 'Max']);
    const wrap = el('div', { class: 'input-with-max' });
    input.parentNode.insertBefore(wrap, input);
    wrap.append(input, button);
    input.dataset.maxAttached = '1';
  }
}

/* ------------------------------ Boot ------------------------------ */

setInterval(() => {
  if (
    state.view === 'dashboard' &&
    state.dashboard.data &&
    !state.dashboard.loading
  ) {
    renderDashboard();
  }
}, 30_000);

async function boot() {
  attachMaxButtons();
  await loadAccounts();

  const hash = window.location.hash.slice(1);
  if (
    hash === 'dashboard' ||
    hash === 'daily' ||
    hash === 'training' ||
    hash === 'boss' ||
    hash === 'pvp' ||
    hash === 'team' ||
    hash === 'bag' ||
    hash === 'gacha' ||
    hash === 'craftment' ||
    hash === 'logs' ||
    hash === 'advisor' ||
    hash === 'bot'
  ) {
    switchView(hash, { updateHash: false });
  } else if (hash === 'add') {
    openAdd();
  }
}

boot();

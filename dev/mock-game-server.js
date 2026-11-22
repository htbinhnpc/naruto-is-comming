import http from 'node:http';

/**
 * Mock toi gian cua API Naruto Is Coming, chi de thu dang nhap / dong bo /
 * nhan thuong daily ma khong goi server that. Khong dung cho production.
 *
 *   node dev/mock-game-server.js
 *   GAME_API_BASE=http://127.0.0.1:4001 npm start
 */
const PORT = Number(process.env.MOCK_PORT || 4001);

const tokens = new Set();

const PROFILE = {
  id: 287,
  name: 'Naruto Uzumaki',
  level: 26,
  gold: 1234567,
  diamond: 2500,
  power: 18420,
  guild: 'Konoha',
  rank: 12,
};

function createDailyState() {
  return {
    mail: 2,
    loginGift: true,
    online: true,
    checkinDone: false,
    missions: [
      {
        Id: 107,
        Period: 1,
        Name: 'Mission: Plot 3 times',
        Action: 'plot',
        GoScene: 'Plot',
        Count: 0,
        Target: 3,
        Pct: 0,
        State: 0,
        RewardName: 'Rainbow Pill',
        RewardQty: 10,
      },
      {
        Id: 108,
        Period: 1,
        Name: 'Mission: Daily check-in',
        Action: 'checkin',
        GoScene: 'Gift',
        Count: 0,
        Target: 1,
        Pct: 0,
        State: 0,
        RewardName: 'Vàng',
        RewardQty: 5000,
      },
      {
        Id: 109,
        Period: 1,
        Name: 'Mission: Training 1 time',
        Action: 'train',
        GoScene: 'Train',
        Count: 0,
        Target: 1,
        Pct: 0,
        State: 0,
        RewardName: 'BP',
        RewardQty: 20,
      },
      {
        Id: 110,
        Period: 1,
        Name: 'Mission: Ultimate 2 times',
        Action: 'ultimate',
        GoScene: 'Ultimate',
        Count: 0,
        Target: 2,
        Pct: 0,
        State: 0,
        RewardName: 'Gold bag',
        RewardQty: 1,
      },
      {
        Id: 111,
        Period: 1,
        Name: 'Mission: Fight Boss 1 time',
        Action: 'boss',
        GoScene: 'Boss',
        Count: 0,
        Target: 1,
        Pct: 0,
        State: 0,
        RewardName: 'Fame',
        RewardQty: 50,
      },
      {
        Id: 112,
        Period: 1,
        Name: 'Mission: Spin Turnplate 1 time',
        Action: 'turnplate',
        GoScene: 'Turnplate',
        Count: 0,
        Target: 1,
        Pct: 0,
        State: 0,
        RewardName: 'Vàng',
        RewardQty: 1000,
      },
      {
        Id: 113,
        Period: 1,
        Name: 'Mission: Plunder 3 times',
        Action: 'plunder',
        GoScene: 'Plunder',
        Count: 0,
        Target: 3,
        Pct: 0,
        State: 0,
        RewardName: 'Gold bag',
        RewardQty: 1,
      },
      {
        Id: 114,
        Period: 1,
        Name: 'Mission: Upgrade equipment 1 time',
        Action: 'upgrade-equip',
        GoScene: 'Bag',
        Count: 0,
        Target: 1,
        Pct: 0,
        State: 0,
        RewardName: 'Rainbow Pill',
        RewardQty: 5,
      },
      {
        Id: 115,
        Period: 1,
        Name: 'Mission: Recharge 1 time',
        Action: 'recharge',
        GoScene: 'Shop',
        Count: 0,
        Target: 1,
        Pct: 0,
        State: 0,
        RewardName: 'Diamond',
        RewardQty: 100,
      },
      {
        Id: 116,
        Period: 2,
        Name: 'Mission: Plot 10 times',
        Action: 'plot',
        GoScene: 'Plot',
        Count: 0,
        Target: 10,
        Pct: 0,
        State: 0,
        RewardName: 'Rainbow Pill',
        RewardQty: 20,
      },
      {
        Id: 117,
        Period: 1,
        Name: 'Mission: Ultimate 2 times',
        Action: 'ultimate',
        GoScene: 'Ultimate',
        Count: 2,
        Target: 2,
        Pct: 100,
        State: 1,
        RewardName: 'Gold bag',
        RewardQty: 1,
      },
    ],
    turnplateFree: 2,
    scratchFree: 1,
    levelGiftClaimed: [],
    diamondMilestoneClaimed: false,
    nextMilestone: 3000,
  };
}

let daily = createDailyState();

function bumpMission(action, amount = 1) {
  const wanted = String(action || '').toLowerCase();
  const touched = [];

  for (const mission of daily.missions) {
    if (mission.State !== 0) continue;
    if (String(mission.Action || '').toLowerCase() !== wanted) continue;

    const target = Math.max(0, Number(mission.Target) || 0);
    const next = Math.min(target, (Number(mission.Count) || 0) + amount);
    mission.Count = next;
    mission.Pct = target > 0 ? Math.round((next / target) * 100) : 100;
    if (target > 0 && next >= target) mission.State = 1;
    touched.push(mission.Id);
  }

  return touched;
}

/* ------------------------------ Mock state ------------------------------ */

const MOCK_VITALS_DEFAULT = {
  level: 26,
  exp: 640,
  expMax: 1200,
  gold: 1234567,
  diamond: 2500,
  energy: 140,
  energyMax: 180,
  energyUsed: 0,
  energyLimit: 15,
  bp: 8,
  bpMax: 10,
};

let mockVitals = { ...MOCK_VITALS_DEFAULT };
const mockUpgradeLv = new Map();

function resetMockVitals() {
  mockVitals = { ...MOCK_VITALS_DEFAULT };
  mockUpgradeLv.clear();
}

function buildStoryCatalog() {
  const stages = [];
  let scid = 1;
  for (let task = 1; task <= 6; task += 1) {
    for (let offset = 0; offset < 2; offset += 1) {
      const chapter = (task - 1) * 2 + offset + 1;
      for (let stageNo = 1; stageNo <= 5; stageNo += 1) {
        const energy = [6, 10, 15, 20, 25][stageNo - 1];
        let exp = energy * 4;
        let gold = energy * 150;
        if (chapter === 1 && stageNo === 3) exp = 192;
        if (chapter === 1 && stageNo === 4) exp = 208;
        if (chapter === 2 && stageNo === 3) gold = 165;
        stages.push({
          Chapter: chapter,
          ChapterName: `Chapter ${chapter}`,
          ChapterNameVi: `Chương ${chapter}`,
          Scid: scid,
          StageNo: stageNo,
          Info: `Story stage ${scid}`,
          InfoVi: `Mô tả cốt truyện stage ${scid}.`,
          Energy: energy,
          Exp: exp,
          Gold: gold,
          IsBoss: stageNo === 5,
          Task: task,
        });
        scid += 1;
      }
    }
  }
  return stages;
}

const MOCK_STORY_STAGES = buildStoryCatalog();
const MOCK_STORY_BY_ID = new Map(MOCK_STORY_STAGES.map((stage) => [stage.Scid, stage]));

let mockProgress = { Scid: 13, Task: 2, Chapter: 4, StageNo: 3, MaxScid: 60 };
let mockStoryBattleSeq = 1000;
const mockBattleLogs = new Map();

function resetMockStory() {
  mockProgress = { Scid: 13, Task: 2, Chapter: 4, StageNo: 3, MaxScid: 60 };
  mockStoryBattleSeq = 1000;
  mockBattleLogs.clear();
}

const MOCK_TRAIN_DEFAULT = {
  1: { usedAtk: 1, usedDef: 0 },
  2: { usedAtk: 0, usedDef: 0 },
  3: { usedAtk: 0, usedDef: 0 },
};

let mockTrain = JSON.parse(JSON.stringify(MOCK_TRAIN_DEFAULT));

function resetMockTrain() {
  mockTrain = JSON.parse(JSON.stringify(MOCK_TRAIN_DEFAULT));
}

const MOCK_ULTIMATE_DEFAULT = {
  1: {
    runsLeft: 2,
    stage: 3,
    nextStage: 4,
    star: 1,
    starEarned: 1,
    starMax: 9,
    maxStage: 10,
    stagesWon: 3,
    pendingBuff: 0,
    pendingReward: 0,
    myRank: 7,
    myCount: 12,
  },
  2: {
    runsLeft: 2,
    stage: 2,
    nextStage: 3,
    star: 0,
    starEarned: 0,
    starMax: 6,
    maxStage: 10,
    stagesWon: 2,
    pendingBuff: 0,
    pendingReward: 0,
    myRank: 9,
    myCount: 12,
  },
};

let mockUltimate = JSON.parse(JSON.stringify(MOCK_ULTIMATE_DEFAULT));

function resetMockUltimate() {
  mockUltimate = JSON.parse(JSON.stringify(MOCK_ULTIMATE_DEFAULT));
}

/* ------------------------------- Boss state ------------------------------ */

const MOCK_BEAST_DEFAULT = {
  eventOpen: 0,
  defeated: 0,
  hp: 150000000,
  maxHp: 150000000,
  dame: 0,
  myRank: 0,
  cooldownUntil: 0,
  secondsToOpen: 3600,
  secondsToClose: 7200,
};

const MOCK_GUILD_BOSS_DEFAULT = {
  killed: 0,
  hp: 82000000,
  maxHp: 100000000,
  hitsPerDay: 3,
  hitsUsed: 1,
  cooldownUntil: 0,
  dame: 1800000,
  myRank: 4,
};

let mockBeast = JSON.parse(JSON.stringify(MOCK_BEAST_DEFAULT));
let mockGuildBoss = JSON.parse(JSON.stringify(MOCK_GUILD_BOSS_DEFAULT));

function resetMockBoss() {
  mockBeast = JSON.parse(JSON.stringify(MOCK_BEAST_DEFAULT));
  mockGuildBoss = JSON.parse(JSON.stringify(MOCK_GUILD_BOSS_DEFAULT));
}

// Mock cooldown counts down from a timestamp so multi-hit batches can be tested.
const MOCK_BOSS_COOLDOWN_MS = 2000;

function mockCooldownRemain(entity) {
  if (!entity.cooldownUntil) return 0;
  return Math.max(0, Math.ceil((entity.cooldownUntil - Date.now()) / 1000));
}

function applyBossScenario(scenario) {
  mockBeast = JSON.parse(JSON.stringify(MOCK_BEAST_DEFAULT));
  mockGuildBoss = JSON.parse(JSON.stringify(MOCK_GUILD_BOSS_DEFAULT));

  if (scenario === 'boss-open') {
    mockBeast.eventOpen = 1;
    mockBeast.hp = 60000000;
    mockBeast.secondsToOpen = 0;
    mockBeast.secondsToClose = 1200;
  } else if (scenario === 'boss-defeated') {
    mockBeast.eventOpen = 1;
    mockBeast.defeated = 1;
    mockBeast.hp = 0;
    mockBeast.dame = 2500000;
    mockBeast.myRank = 1;
    mockBeast.secondsToOpen = 0;
    mockBeast.secondsToClose = 1200;
  } else if (scenario === 'boss-closed') {
    mockBeast.eventOpen = 0;
  } else if (scenario === 'boss-cooldown') {
    mockBeast.eventOpen = 1;
    mockBeast.hp = 60000000;
    mockBeast.cooldownUntil = Date.now() + 17000;
    mockBeast.secondsToOpen = 0;
    mockBeast.secondsToClose = 1200;
  } else if (scenario === 'boss-killed') {
    mockBeast.eventOpen = 1;
    mockBeast.hp = 1000;
    mockBeast.secondsToOpen = 0;
    mockBeast.secondsToClose = 1200;
  }

  if (scenario === 'guild-cooldown') {
    mockGuildBoss.cooldownUntil = Date.now() + 17000;
  } else if (scenario === 'guild-killed') {
    mockGuildBoss.killed = 1;
    mockGuildBoss.hp = 0;
  } else if (scenario === 'guild-no-hits') {
    mockGuildBoss.hitsUsed = mockGuildBoss.hitsPerDay;
  }
}

/* ------------------------------- PvP state ------------------------------- */

function pvpTeamFields() {
  return {
    Img1: 'ninja/110',
    Img2: 'ninja/174',
    Img3: 'ninja/89',
    Star1: 5,
    Star2: 5,
    Star3: 4,
    Tier1: 1,
    Tier2: 0,
    Tier3: 0,
    Attr1: 1,
    Attr2: 2,
    Attr3: 4,
  };
}

// [RankNo, UserId, Name, Lv, Power]
const MOCK_PVP_RANKS = [
  [2, 502, 'Hokage', 30, 3500],
  [3, 503, 'Itachi', 31, 9000],
  [4, 504, 'Kakashi', 29, 3000],
  [5, 505, 'Sakura', 28, 4000],
  [6, 506, 'Sasuke', 27, 7000],
  [7, 507, 'Naruto', 27, 4500],
  [8, 508, 'Hinata', 26, 6200],
  [9, 509, 'Shikamaru', 25, 5000],
  [10, 510, 'Rock Lee', 24, 5500],
  [11, 511, 'Gaara', 23, 8000],
].map(([RankNo, UserId, Name, Lv, Power]) => ({
  RankNo,
  UserId,
  Name,
  Lv,
  Power,
  ...pvpTeamFields(),
}));

// [UserId, Name, Lv, Power, Gold]
const MOCK_PVP_PLUNDER = [
  [601, 'Orochimaru', 28, 9000, 500000],
  [602, 'Tsunade', 27, 5000, 400000],
  [603, 'Jiraiya', 26, 4500, 300000],
  [604, 'Pain', 30, 6000, 900000],
  [605, 'Konan', 25, 3000, 100000],
  [606, 'Kabuto', 24, 5500, 800000],
  [607, 'Deidara', 27, 6200, 700000],
  [608, 'Sasori', 26, 4000, 600000],
  [609, 'Hidan', 23, 3500, 200000],
  [610, 'Kakuzu', 22, 5000, 90000],
].map(([UserId, Name, Lv, Power, Gold]) => ({
  Grp: 1,
  UserId,
  Name,
  Lv,
  Power,
  Gold,
  ...pvpTeamFields(),
}));

function buildPvpVisitRows(power) {
  const base = Math.floor(power / 5);
  const rest = power - base * 5;
  return Array.from({ length: 5 }, (_, index) => ({
    Slot: index + 1,
    NinjaId: 9000 + index,
    Ninja: 200 + index,
    NinjaImg: `ninja/${200 + index}`,
    TotalAtk: base + (index === 0 ? rest : 0),
    TotalDef: 0,
  }));
}

function findPvpTarget(userId) {
  return [...MOCK_PVP_RANKS, ...MOCK_PVP_PLUNDER].find(
    (row) => row.UserId === Number(userId),
  );
}

function pvpTargetPower(target) {
  if (!target) return null;
  return mockScenario === 'pvp-stronger' ? target.Power + 20000 : target.Power;
}

/* --------------------------- Dashboard fixtures --------------------------- */

const DASHBOARD_SCENARIOS = new Set([
  'default',
  'noguild',
  'boss-open',
  'boss-defeated',
  'ultimate-pending',
  'story-loss',
  'story-wall',
  'cave-closed',
  'cave-lowlevel',
  'cave-loss',
  'ultimate-loss',
  'boss-closed',
  'boss-cooldown',
  'boss-killed',
  'guild-boss',
  'no-guild',
  'guild-cooldown',
  'guild-killed',
  'guild-no-hits',
  'pvp-loss',
  'pvp-no-bp',
  'pvp-no-target',
  'pvp-no-gold',
  'pvp-unverified',
  'pvp-stronger',
]);

let mockScenario = DASHBOARD_SCENARIOS.has(process.env.MOCK_SCENARIO)
  ? process.env.MOCK_SCENARIO
  : 'default';

function resetDashboardScenario() {
  mockScenario = 'default';
}

/* ------------------------------ Team / bag ------------------------------ */

const MOCK_ROSTER = [
  { Id: 43028, Ninja: 110, Name: 'Minato Namikaze', Img: 'ninja/110', Lv: 20, Star: 5, Attribute: 2, Tier: 0, Atk: 646, Def: 500 },
  { Id: 39651, Ninja: 89, Name: 'Kushina Uzumaki', Img: 'ninja/89', Lv: 6, Star: 4, Attribute: 1, Tier: 0, Atk: 266, Def: 195 },
  { Id: 31366, Ninja: 21, Name: 'Naruto Uzumaki', Img: 'ninja/21', Lv: 5, Star: 4, Attribute: 2, Tier: 0, Atk: 240, Def: 178 },
  { Id: 39648, Ninja: 77, Name: 'Yamato', Img: 'ninja/77', Lv: 13, Star: 4, Attribute: 5, Tier: 0, Atk: 364, Def: 273 },
  { Id: 39965, Ninja: 174, Name: 'Gamabunta', Img: 'ninja/174', Lv: 1, Star: 5, Attribute: 1, Tier: 0, Atk: 182, Def: 238 },
  { Id: 39555, Ninja: 168, Name: 'Juin-Jugo', Img: 'ninja/168', Lv: 6, Star: 5, Attribute: 4, Tier: 0, Atk: 300, Def: 260 },
  { Id: 40001, Ninja: 200, Name: 'Kage Test', Img: 'ninja/200', Lv: 30, Star: 5, Attribute: 3, Tier: 2, Atk: 800, Def: 700 },
];

const MOCK_EQUIP = [
  { Id: 10442, Type: 1, Img: 'equip/61', Name: 'Seven-Star Sword', Name2: 'Kiếm Thất Tinh', Lv: 3, Star: 5, Atk: 247, Def: 0 },
  { Id: 10438, Type: 1, Img: 'equip/36', Name: 'Blastsword', Name2: 'Kiếm Nổ', Lv: 1, Star: 4, Atk: 186, Def: 0 },
  { Id: 10439, Type: 1, Img: 'equip/39', Name: 'Golden Canopy Rope', Name2: 'Dây Kim Giao', Lv: 1, Star: 4, Atk: 150, Def: 0 },
  { Id: 10440, Type: 1, Img: 'equip/44', Name: 'Thunderswords', Name2: 'Song Kiếm Sấm', Lv: 1, Star: 4, Atk: 183, Def: 0 },
  { Id: 10441, Type: 1, Img: 'equip/45', Name: 'Twinsword', Name2: 'Song Kiếm', Lv: 1, Star: 4, Atk: 180, Def: 0 },
  { Id: 10460, Type: 1, Img: 'equip/61', Name: 'Kage Blade', Name2: 'Kiếm Kage', Lv: 1, Star: 5, Atk: 300, Def: 0 },
  { Id: 10452, Type: 2, Img: 'equip/96', Name: 'Hokage Robe', Name2: 'Áo Choàng Hokage', Lv: 1, Star: 5, Atk: 283, Def: 410 },
  { Id: 10450, Type: 2, Img: 'equip/52', Name: 'Dark Boots', Name2: 'Giày Bóng Tối', Lv: 1, Star: 4, Atk: 0, Def: 185 },
  { Id: 10451, Type: 2, Img: 'equip/56', Name: 'Jonin Boots', Name2: 'Giày Thượng Nhẫn', Lv: 1, Star: 4, Atk: 0, Def: 160 },
  { Id: 10448, Type: 2, Img: 'equip/31', Name: 'Cloud Boots', Name2: 'Giày Mây', Lv: 1, Star: 3, Atk: 0, Def: 105 },
  { Id: 10449, Type: 2, Img: 'equip/32', Name: 'Golden Armguard', Name2: 'Hộ Tay Vàng', Lv: 1, Star: 3, Atk: 0, Def: 90 },
  { Id: 10461, Type: 2, Img: 'equip/96', Name: 'Kage Robe', Name2: 'Áo Kage', Lv: 1, Star: 5, Atk: 0, Def: 460 },
];

const MOCK_ITEMS = [
  { Id: 49, Name: '100 Diamond', Name2: '100 Kim Cương', Img: 'item/49', Quantity: 12, UseType: 2, Gain: 100 },
  { Id: 13, Name: 'Sushi', Name2: 'Sushi', Img: 'item/13', Quantity: 4, UseType: 3, Gain: 60 },
  { Id: 7, Name: 'Ramen', Name2: 'Mì Ramen', Img: 'item/7', Quantity: 2, UseType: 3, Gain: 20 },
  { Id: 27, Name: 'Rainbow Pill', Name2: 'Bánh Cầu Vồng', Img: 'item/27', Quantity: 10, UseType: 0 },
  { Id: 1, Name: 'Ninja Egg', Name2: 'Trứng Ninja', Img: 'item/1', Quantity: 3, UseType: 5 },
];

function resetMockItems() {
  for (const item of MOCK_ITEMS) {
    if (item.Id === 49) item.Quantity = 12;
    else if (item.Id === 13) item.Quantity = 4;
    else if (item.Id === 7) item.Quantity = 2;
    else if (item.Id === 27) item.Quantity = 10;
    else if (item.Id === 1) item.Quantity = 3;
  }
}

const MOCK_BONDS = {
  43028: [
    { id: 30012, name: 'Hero And Beauty', type: 1, stat: 'atk', percent: 40, partners: ['Kushina Uzumaki'] },
    { id: 30009, name: 'Inheritor Of Hokage', type: 1, stat: 'atk', percent: 45, partners: ['Tobirama Senju', 'Hiruzen Sarutobi'] },
  ],
  39651: [
    { id: 30140, name: 'The Beautiful Red Hair', type: 1, stat: 'atk', percent: 40, partners: ['Minato Namikaze'] },
    { id: 30142, name: 'Sustenance Of Heart', type: 1, stat: 'atk', percent: 30, partners: ['Naruto Uzumaki'] },
    { id: 30143, name: 'Dark-kage Jacket', type: 2, stat: 'atk', percent: 35, partners: ['Áo Khoác Hắc Kage'] },
  ],
  31366: [
    { id: 30209, name: 'My Family', type: 1, stat: 'atk', percent: 40, partners: ['Minato Namikaze', 'Kushina Uzumaki'] },
    { id: 30141, name: 'Nine-Tails Jinchuriki', type: 3, stat: 'atk', percent: 30, partners: [] },
  ],
  39648: [
    { id: 30101, name: 'Assist In Training', type: 1, stat: 'atk', percent: 35, partners: ['Naruto Uzumaki'] },
  ],
  39965: [
    { id: 30427, name: 'The Contract of Summoning', type: 1, stat: 'def', percent: 40, partners: ['Jiraya'] },
  ],
  39555: [],
  40001: [
    { id: 30999, name: 'Kage Bond', type: 1, stat: 'def', percent: 30, partners: ['Minato Namikaze'] },
  ],
};

let mockTeam = {
  slots: new Map([
    [1, 43028],
    [2, 39965],
    [3, 39651],
    [4, 39648],
    [5, 31366],
  ]),
  weapons: new Map([
    [1, 10442],
    [2, 10441],
    [3, 10440],
    [4, 10439],
    [5, 10438],
  ]),
  armors: new Map([
    [1, 10452],
    [2, 10451],
    [3, 10450],
    [4, 10449],
    [5, 10448],
  ]),
};

function resetMockTeam() {
  mockTeam = {
    slots: new Map([
      [1, 43028],
      [2, 39965],
      [3, 39651],
      [4, 39648],
      [5, 31366],
    ]),
    weapons: new Map([
      [1, 10442],
      [2, 10441],
      [3, 10440],
      [4, 10439],
      [5, 10438],
    ]),
    armors: new Map([
      [1, 10452],
      [2, 10451],
      [3, 10450],
      [4, 10449],
      [5, 10448],
    ]),
  };
}

function rosterById(id) {
  return MOCK_ROSTER.find((ninja) => ninja.Id === id) || null;
}

function equipById(id) {
  return MOCK_EQUIP.find((item) => item.Id === id) || null;
}

function teamNames() {
  return new Set(
    [...mockTeam.slots.values()]
      .map((id) => rosterById(id)?.Name)
      .filter(Boolean)
      .map((name) => name.toLowerCase()),
  );
}

function equippedNames() {
  const names = new Set();
  for (const id of [...mockTeam.weapons.values(), ...mockTeam.armors.values()]) {
    const item = equipById(id);
    if (item) names.add(item.Name.toLowerCase());
  }
  return names;
}

function bondState(ninjaId) {
  const names = teamNames();
  const equips = equippedNames();
  return (MOCK_BONDS[ninjaId] || []).map((bond) => {
    let active = false;
    if (bond.type === 1) {
      active =
        bond.partners.length > 0 &&
        bond.partners.every((name) => names.has(name.toLowerCase()));
    } else if (bond.type === 2) {
      active = bond.partners.some((name) => equips.has(name.toLowerCase()));
    }
    const partnerText = bond.partners.map((name) => `<${name}>`).join(',');
    const statText = bond.stat === 'atk' ? 'Công' : 'Thủ';
    return {
      ...bond,
      active,
      info:
        bond.type === 2
          ? `Equips ${partnerText} to increase ${bond.stat === 'atk' ? 'Attack' : 'Defense'} by ${bond.percent}%`
          : `With ${partnerText} together go into battle, increases ${bond.stat === 'atk' ? 'Attack' : 'Defense'} by ${bond.percent}%`,
      infoVi:
        bond.type === 2
          ? `Trang bị ${partnerText}, tăng ${statText} ${bond.percent}%`
          : `Cùng ra trận với ${partnerText}, tăng ${statText} ${bond.percent}%`,
    };
  });
}

function teamRow(slot) {
  const ninjaId = mockTeam.slots.get(slot);
  const ninja = ninjaId ? rosterById(ninjaId) : null;
  const base = {
    Slot: slot,
    NinjaId: null,
    Ninja: null,
    NinjaName: null,
    NinjaImg: null,
    Star: null,
    Ascend: null,
    Lv: null,
    LvExp: null,
    Attribute: null,
    Tier: null,
    Beast: null,
    Atk: null,
    Def: null,
    Skill1: null,
    Skill1Name: null,
    Skill1Img: null,
    Skill1Tier: null,
    Skill1TierImg: null,
    Skill1Info: null,
    Skill1InfoVi: null,
    Skill2: null,
    Skill2Name: null,
    Skill2Img: null,
    Skill2Tier: null,
    Skill2TierImg: null,
    Skill2Info: null,
    Skill2InfoVi: null,
    Bond1: null,
    Bond1Name: null,
    Bond1Info: null,
    Bond1Info2: null,
    Bond1Active: null,
    Bond2: null,
    Bond2Name: null,
    Bond2Info: null,
    Bond2Info2: null,
    Bond2Active: null,
    Bond3: null,
    Bond3Name: null,
    Bond3Info: null,
    Bond3Info2: null,
    Bond3Active: null,
    Bond4: null,
    Bond4Name: null,
    Bond4Info: null,
    Bond4Info2: null,
    Bond4Active: null,
    EquipAtkId: null,
    EquipAtkName: null,
    EquipAtkImg: null,
    EquipAtkLv: null,
    EquipAtkStar: null,
    EquipAtkAtk: null,
    EquipAtkDef: null,
    EquipDefId: null,
    EquipDefName: null,
    EquipDefImg: null,
    EquipDefLv: null,
    EquipDefStar: null,
    EquipDefAtk: null,
    EquipDefDef: null,
    TotalAtk: null,
    TotalDef: null,
    Bond1Type: null,
    Bond2Type: null,
    Bond3Type: null,
    Bond4Type: null,
  };
  if (!ninja) return base;

  const bonds = bondState(ninja.Id);
  let bondAtk = 0;
  let bondDef = 0;
  for (const bond of bonds) {
    if (!bond.active) continue;
    if (bond.stat === 'atk') bondAtk += bond.percent;
    else bondDef += bond.percent;
  }

  const weapon = equipById(mockTeam.weapons.get(slot));
  const armor = equipById(mockTeam.armors.get(slot));
  const equipAtk = (weapon?.Atk || 0) + (armor?.Atk || 0);
  const equipDef = (weapon?.Def || 0) + (armor?.Def || 0);

  return {
    ...base,
    NinjaId: ninja.Id,
    Ninja: ninja.Ninja,
    NinjaName: ninja.Name,
    NinjaImg: ninja.Img,
    Star: ninja.Star,
    Ascend: 0,
    Lv: ninja.Lv,
    LvExp: 0,
    Attribute: ninja.Attribute,
    Tier: ninja.Tier,
    Atk: ninja.Atk,
    Def: ninja.Def,
    Skill1: 50004,
    Skill1Name: 'Flying Raijin',
    Skill1Img: 'skill/5',
    Skill1Tier: 'A',
    Skill1TierImg: 'skill/icon/A',
    Skill1Info: 'Teleport strike.',
    Skill1InfoVi: 'Đòn đánh dịch chuyển tức thời.',
    Skill2: 50005,
    Skill2Name: 'Rasengan',
    Skill2Img: 'skill/6',
    Skill2Tier: 'B',
    Skill2TierImg: 'skill/icon/B',
    Skill2Info: 'Spinning chakra sphere.',
    Skill2InfoVi: 'Cầu chakra xoáy.',
    Bond1: bonds[0]?.id ?? null,
    Bond1Name: bonds[0]?.name ?? null,
    Bond1Info: bonds[0]?.info ?? null,
    Bond1Info2: bonds[0]?.infoVi ?? null,
    Bond1Active: bonds[0]?.active ?? null,
    Bond2: bonds[1]?.id ?? null,
    Bond2Name: bonds[1]?.name ?? null,
    Bond2Info: bonds[1]?.info ?? null,
    Bond2Info2: bonds[1]?.infoVi ?? null,
    Bond2Active: bonds[1]?.active ?? null,
    Bond3: bonds[2]?.id ?? null,
    Bond3Name: bonds[2]?.name ?? null,
    Bond3Info: bonds[2]?.info ?? null,
    Bond3Info2: bonds[2]?.infoVi ?? null,
    Bond3Active: bonds[2]?.active ?? null,
    Bond4: bonds[3]?.id ?? null,
    Bond4Name: bonds[3]?.name ?? null,
    Bond4Info: bonds[3]?.info ?? null,
    Bond4Info2: bonds[3]?.infoVi ?? null,
    Bond4Active: bonds[3]?.active ?? null,
    Bond1Type: bonds[0]?.type ?? null,
    Bond2Type: bonds[1]?.type ?? null,
    Bond3Type: bonds[2]?.type ?? null,
    Bond4Type: bonds[3]?.type ?? null,
    EquipAtkId: weapon?.Id ?? null,
    EquipAtkName: weapon?.Name ?? null,
    EquipAtkImg: weapon?.Img ?? null,
    EquipAtkLv: weapon?.Lv ?? null,
    EquipAtkStar: weapon?.Star ?? null,
    EquipAtkAtk: weapon?.Atk ?? null,
    EquipAtkDef: weapon?.Def ?? null,
    EquipDefId: armor?.Id ?? null,
    EquipDefName: armor?.Name ?? null,
    EquipDefImg: armor?.Img ?? null,
    EquipDefLv: armor?.Lv ?? null,
    EquipDefStar: armor?.Star ?? null,
    EquipDefAtk: armor?.Atk ?? null,
    EquipDefDef: armor?.Def ?? null,
    TotalAtk: Math.round(ninja.Atk * (1 + bondAtk / 100)) + equipAtk,
    TotalDef: Math.round(ninja.Def * (1 + bondDef / 100)) + equipDef,
  };
}

function teamRows() {
  return Array.from({ length: 13 }, (_, index) => teamRow(index + 1));
}

function teamPower() {
  return teamRows()
    .filter((row) => row.NinjaId)
    .reduce((sum, row) => sum + (row.TotalAtk || 0) + (row.TotalDef || 0), 0);
}


function json(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(text);
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function param(sql, name) {
  const match = sql.match(
    new RegExp(`@${name}\\s*=\\s*(N?'(?:[^']|'')*'|[^,\\s]+)`, 'i'),
  );
  if (!match) return null;

  const raw = match[1].trim();
  if (raw.toUpperCase() === 'NULL') return null;
  if (/^N?'/.test(raw)) {
    return raw.replace(/^N?'/, '').replace(/'$/, '').replace(/''/g, "'");
  }
  const number = Number(raw);
  return Number.isFinite(number) ? number : raw;
}

function runProcedure(sql) {
  // Craftment: nang cap ninja / trang bi bang fuel.
  if (
    sql.includes('P3NinjaUpgradePicker') ||
    sql.includes('P3EquipUpgradePicker')
  ) {
    const isNinja = sql.includes('Ninja');
    const source = isNinja ? MOCK_ROSTER : MOCK_EQUIP;
    return source.map((item) => {
      const key = `${isNinja ? 'ninja' : 'equip'}:${item.Id}`;
      return {
        Id: item.Id,
        Img: item.Img,
        Name: item.Name,
        Name2: item.Name2 || null,
        Star: item.Star,
        Lv: mockUpgradeLv.get(key) ?? item.Lv ?? 1,
        LvExp: 0,
        IsEquip: true,
        Attribute: item.Attribute || null,
      };
    });
  }

  if (
    sql.includes('P3NinjaUpgradeFuel') ||
    sql.includes('P3EquipUpgradeFuel')
  ) {
    const isNinja = sql.includes('Ninja');
    const excludeId = Number(param(sql, 'ExcludeId'));
    const source = isNinja ? MOCK_ROSTER : MOCK_EQUIP;
    const rows = source
      .filter((item) => item.Id !== excludeId)
      .map((item, index) => ({
        Id: item.Id,
        Img: item.Img,
        Name: item.Name,
        Name2: item.Name2 || null,
        Star: item.Star,
        Lv: item.Lv || 1,
        LvExp: item.Star,
        FuelExp: item.Star,
        Valuable: index % 5 === 0 ? 1 : 0,
        NeedConfirm: 0,
        TotalCount: source.length - 1,
      }));
    return rows;
  }

  if (
    sql.includes('P3NinjaUpgradeAuto') ||
    sql.includes('P3EquipUpgradeAuto')
  ) {
    const isNinja = sql.includes('Ninja');
    const excludeId = Number(param(sql, 'TargetId'));
    const source = isNinja ? MOCK_ROSTER : MOCK_EQUIP;
    return source
      .filter((item) => item.Id !== excludeId && (item.Star || 5) <= 4)
      .map((item) => ({ Id: item.Id, FuelExp: item.Star, Star: item.Star }));
  }

  if (sql.includes('P1NinjaUpgrade') || sql.includes('P1EquipUpgrade')) {
    const isNinja = sql.includes('Ninja');
    const targetId = Number(param(sql, 'Id'));
    const fuel = String(param(sql, 'FuelIds') || '')
      .split(',')
      .map((id) => Number(id.trim()))
      .filter(Boolean);
    const key = `${isNinja ? 'ninja' : 'equip'}:${targetId}`;
    const source = isNinja ? MOCK_ROSTER : MOCK_EQUIP;
    const base = source.find((item) => item.Id === targetId);
    if (!base || fuel.length === 0) {
      return { Result: 0, Lv: null, LvExp: null, Gained: null, Wasted: null };
    }
    const gained = fuel.reduce((sum, id) => {
      const item = source.find((entry) => entry.Id === id);
      return sum + (item?.Star || 1);
    }, 0);
    const nextLv = (mockUpgradeLv.get(key) ?? base.Lv ?? 1) + 1;
    mockUpgradeLv.set(key, Math.min(nextLv, mockVitals.level));
    return {
      Result: 1,
      Lv: mockUpgradeLv.get(key),
      LvExp: gained,
      Gained: gained,
      Wasted: 0,
    };
  }

  if (sql.includes('P2Info')) {
    return { Id: PROFILE.id, Name: PROFILE.name, Lv: PROFILE.level };
  }

  if (sql.includes('P4MainLoad')) {
    return {
      Name: PROFILE.name,
      Lv: mockVitals.level,
      LvExp: mockVitals.exp,
      LvFullExp: mockVitals.expMax,
      Gold: mockVitals.gold,
      Diamond: mockVitals.diamond,
      Energy: mockVitals.energy,
      EnergyCap: mockVitals.energyMax,
      BP: mockVitals.bp,
      BpCap: mockVitals.bpMax,
      UnlockedSlots: 5,
      Vip: 0,
      ScratchFreeAvailable: daily.scratchFree ? 1 : 0,
      GiftDayUnclaimedCount: daily.loginGift ? 1 : 0,
      GiftUnclaimedCount: 0,
      DiamondUnclaimedCount: 0,
      TurnplateFreeCount: daily.turnplateFree,
      ChakraTreeOpen: 1,
      ChakraTreeSeconds: 0,
      Notice: 'Beast Boss: 12:00-13:00 and 19:00-21:00 daily',
    };
  }

  if (sql.includes('P4StaminaStatus')) {
    return {
      Vip: 0,
      Energy: mockVitals.energy,
      EnergyMax: mockVitals.energyMax,
      BP: mockVitals.bp,
      BpMax: mockVitals.bpMax,
      EnergyUsed: mockVitals.energyUsed,
      EnergyLimit: mockVitals.energyLimit,
      BpUsed: 2,
      BpLimit: 2,
    };
  }

  if (sql.includes('P2StageProgress')) {
    return { ...mockProgress };
  }

  if (sql.includes('P3StageList')) {
    const task = Number(param(sql, 'Task')) || 0;
    return MOCK_STORY_STAGES.filter((stage) => !task || stage.Task === task).map(
      (stage) => ({
        Chapter: stage.Chapter,
        ChapterName: stage.ChapterName,
        ChapterNameVi: stage.ChapterNameVi,
        Scid: stage.Scid,
        StageNo: stage.StageNo,
        Info: stage.Info,
        InfoVi: stage.InfoVi,
        Energy: stage.Energy,
        Exp: stage.Exp,
        Gold: stage.Gold,
        IsBoss: stage.IsBoss,
      }),
    );
  }

  if (sql.includes('P3TrainStageList')) {
    const cave = Number(param(sql, 'Cave')) || 0;
    if (mockScenario === 'cave-lowlevel' || mockScenario === 'cave-closed') return [];
    if (cave !== 1) return [];
    return [
      { Tier: 0, StageNo: 0, Name: 'Tầng 0', Gold: 1200, ItemId: 55, ItemQty: 1 },
      { Tier: 0, StageNo: 1, Name: 'Tầng 1', Gold: 1500, ItemId: 55, ItemQty: 1 },
      { Tier: 0, StageNo: 2, Name: 'Tầng 2', Gold: 1800, ItemId: 56, ItemQty: 1 },
    ];
  }

  if (sql.includes('P3UltimateBuffList')) {
    return [
      { Id: 1, Name: 'Attack Boost', Name2: 'Tăng Công', Type: 'atk', Lv: 1, Value: 10 },
      { Id: 2, Name: 'Defense Boost', Name2: 'Tăng Thủ', Type: 'def', Lv: 1, Value: 10 },
    ];
  }

  if (sql.includes('P1UltimateBuyBuff')) {
    const mode = Number(param(sql, 'Mode')) || 1;
    if (!mockUltimate[mode]?.pendingBuff) return { Result: 3 };
    mockUltimate[mode].pendingBuff = 0;
    return { Result: 1 };
  }

  if (sql.includes('P2UltimateClaim')) {
    const mode = Number(param(sql, 'Mode')) || 1;
    const state = mockUltimate[mode];
    if (!state?.pendingReward) {
      return { Result: 0, Item: 0, Qty: 0, StageNo: state?.stage ?? 0 };
    }
    state.pendingReward = 0;
    return {
      Result: 1,
      Item: 10,
      Qty: 1,
      Name: 'Gold bag',
      Img: 'item/10',
      StageNo: state.stage,
    };
  }

  if (sql.includes('P4TrainStatus')) {
    const allClosed = mockScenario === 'cave-closed';
    return [
      {
        Cave: 1,
        Name: 'Toad Cave',
        Name0: 'Động Cóc',
        Info: 'Open Mon/Thu/Sun',
        Info0: 'Mở Thứ 2, 5, CN',
        OpenDays: '1,4,0',
        Img: 'train/1',
        AttrMask: 0,
        DebuffPct: 50,
        DebuffPctSuper: 30,
        DebuffPctKage: 10,
        ItemId: 49,
        IsOpen: allClosed ? 0 : 1,
        RunsUsed: mockTrain[1].usedAtk + mockTrain[1].usedDef,
        RunsMax: 6,
        RunsUsedAtk: mockTrain[1].usedAtk,
        RunsUsedDef: mockTrain[1].usedDef,
        RunsMaxMode: 3,
      },
      {
        Cave: 2,
        Name: 'Snake Cave',
        Name0: 'Động Rắn',
        Info: 'Open Tue/Fri/Sun',
        Info0: 'Mở Thứ 3, 6, CN',
        OpenDays: '2,5,0',
        Img: 'train/2',
        AttrMask: 0,
        DebuffPct: 50,
        DebuffPctSuper: 30,
        DebuffPctKage: 10,
        ItemId: 49,
        IsOpen: 0,
        RunsUsed: mockTrain[2].usedAtk + mockTrain[2].usedDef,
        RunsMax: 6,
        RunsUsedAtk: mockTrain[2].usedAtk,
        RunsUsedDef: mockTrain[2].usedDef,
        RunsMaxMode: 3,
      },
      {
        Cave: 3,
        Name: 'Snail Cave',
        Name0: 'Động Ốc Sên',
        Info: 'Open Wed/Sat/Sun',
        Info0: 'Mở Thứ 4, 7, CN',
        OpenDays: '3,6,0',
        Img: 'train/3',
        AttrMask: 0,
        DebuffPct: 50,
        DebuffPctSuper: 30,
        DebuffPctKage: 10,
        ItemId: 49,
        IsOpen: 0,
        RunsUsed: mockTrain[3].usedAtk + mockTrain[3].usedDef,
        RunsMax: 6,
        RunsUsedAtk: mockTrain[3].usedAtk,
        RunsUsedDef: mockTrain[3].usedDef,
        RunsMaxMode: 3,
      },
    ];
  }

  if (sql.includes('P4UltimateStatus')) {
    const mode = Number(param(sql, 'Mode')) || 1;
    const state = mockUltimate[mode] || mockUltimate[1];
    const pending = mockScenario === 'ultimate-pending';
    return {
      RunsLeft: pending ? 0 : state.runsLeft,
      Mode: mode,
      StageNo: state.stage,
      NextStage: state.nextStage,
      InRun: 0,
      OtherMode: mode === 1 ? 2 : 1,
      OtherModeStage: mockUltimate[mode === 1 ? 2 : 1].stage,
      Star: state.star,
      StarEarned: state.starEarned,
      StarMax: state.starMax,
      MaxStage: state.maxStage,
      StagesWon: state.stagesWon,
      Gold: 5000,
      Diamond: 10,
      PendingBuff: pending ? 1 : state.pendingBuff,
      PendingReward: pending ? 1 : state.pendingReward,
      MyRank: state.myRank,
      MyCount: state.myCount,
      BuffAtk: 10,
      BuffDef: 10,
      BuffChance: 5,
      BuffEnemyAtk: 5,
      BuffEnemyDef: 5,
      BuffEnemyChance: 3,
    };
  }

  if (sql.includes('P2BossInfo')) {
    return {
      Result: 1,
      EventOpen: mockBeast.eventOpen,
      Defeated: mockBeast.defeated,
      Session: 1,
      Tier: 3,
      TierName: 'Weekend Noon',
      BeastIndex: 9,
      BeastNinja: 1009,
      BeastName: 'Kurama',
      BeastImg: 'ninja/1009',
      BeastAtkOrDef: 1,
      HP: mockBeast.hp,
      MaxHP: mockBeast.maxHp,
      StartText: '12:00',
      EndText: '13:00',
      SecondsToOpen: mockBeast.secondsToOpen,
      SecondsToClose: mockBeast.secondsToClose,
      IsTomorrow: 0,
      Fame: mockBeast.dame > 0 ? 30 : 0,
      Dame: mockBeast.dame,
      MyRank: mockBeast.myRank,
      CooldownRemain: mockCooldownRemain(mockBeast),
    };
  }

  if (sql.includes('P3BossFightRank')) {
    return [
      {
        RankNo: 1,
        Name: 'Shelby',
        Lv: 31,
        Dame: 3273428,
        Hits: 170,
        IsMe: 0,
        Ninjas: '150,165,167,164,166',
      },
      {
        RankNo: 2,
        Name: 'npc',
        Lv: 41,
        Dame: 580973,
        Hits: 3,
        IsMe: 0,
        Ninjas: '146,142,145,143,144',
      },
      {
        RankNo: 3,
        Name: PROFILE.name,
        Lv: PROFILE.level,
        Dame: mockBeast.dame,
        Hits: mockBeast.dame > 0 ? 1 : 0,
        IsMe: 1,
        Ninjas: '21,89,110,168,174',
      },
    ];
  }

  if (sql.includes('P3TeamPower')) {
    return { Power: teamPower() };
  }

  if (sql.includes('P2MyGuildInfo')) {
    if (mockScenario === 'noguild' || mockScenario === 'no-guild') {
      return {
        GuildId: null,
        IsLeader: 0,
        GuildName: null,
        GuildLv: null,
        Role: 0,
      };
    }
    return {
      GuildId: 7,
      IsLeader: 0,
      GuildName: PROFILE.guild,
      GuildLv: 3,
      Role: 0,
    };
  }

  if (sql.includes('P2GuildBossInfo')) {
    if (mockScenario === 'noguild' || mockScenario === 'no-guild') {
      return { Result: 0, GuildLv: 0, BeastName: null, HP: 0, MaxHP: 0 };
    }
    return {
      Result: 1,
      GuildLv: 3,
      BeastIndex: 5,
      BeastNinja: 1005,
      BeastName: 'Jubi',
      BeastImg: 'ninja/1005',
      HP: mockGuildBoss.hp,
      MaxHP: mockGuildBoss.maxHp,
      Killed: mockGuildBoss.killed,
      HitsPerDay: mockGuildBoss.hitsPerDay,
      HitsUsed: mockGuildBoss.hitsUsed,
      CooldownSec: 60,
      CooldownRemain: mockCooldownRemain(mockGuildBoss),
      Dame: mockGuildBoss.dame,
      MyRank: mockGuildBoss.myRank,
      ExpPerHit: 120,
      ContribPerHit: 30,
      ExpKill: 5000,
      SecondsToReset: 43200,
      KillReward: 'Gold chest|1;Ninja Soul|3',
      Rank1Reward: 'Ninja Soul|10',
    };
  }

  if (sql.includes('P3GuildBossRank')) {
    if (mockScenario === 'noguild' || mockScenario === 'no-guild') return [];
    return [
      {
        RankNo: 1,
        UserId: 12,
        Name: 'Shelby',
        Lv: 31,
        Dame: 4200000,
        Hits: 3,
        IsMe: 0,
      },
      {
        RankNo: 2,
        UserId: 44,
        Name: 'npc',
        Lv: 41,
        Dame: 2600000,
        Hits: 2,
        IsMe: 0,
      },
      {
        RankNo: 3,
        UserId: PROFILE.id,
        Name: PROFILE.name,
        Lv: PROFILE.level,
        Dame: mockGuildBoss.dame,
        Hits: mockGuildBoss.hitsUsed,
        IsMe: 1,
      },
    ];
  }

  if (sql.includes('P2KeyStatus')) {
    return {
      Result: 1,
      Bronze: 14,
      Silver: 2,
      Gold: 0,
      MultBronze: 1,
      MultSilver: 1,
      MultGold: 1,
    };
  }

  if (sql.includes('P2RankTop20')) {
    return Array.from({ length: 20 }, (_, index) => {
      const rankNo = index + 1;
      const known = MOCK_PVP_RANKS.find((row) => row.RankNo === rankNo);
      return {
        RankNo: rankNo,
        UserId: known ? known.UserId : 700 + rankNo,
        IsBot: known ? 0 : 1,
        Name: known ? known.Name : `Top ${rankNo}`,
        Lv: known ? known.Lv : 20,
        Vip: 0,
      };
    });
  }

  if (sql.includes('P2RankList')) {
    return MOCK_PVP_RANKS.map((row) => ({
      RankNo: row.RankNo,
      UserId: row.UserId,
      IsBot: 0,
      Name: row.Name,
      Lv: row.Lv,
      Img1: row.Img1,
      Img2: row.Img2,
      Img3: row.Img3,
      Star1: row.Star1,
      Star2: row.Star2,
      Star3: row.Star3,
      Tier1: row.Tier1,
      Tier2: row.Tier2,
      Tier3: row.Tier3,
      Attr1: row.Attr1,
      Attr2: row.Attr2,
      Attr3: row.Attr3,
    }));
  }

  if (sql.includes('P2PlunderTop20')) {
    return [
      { UserId: 30, Name: 'smile', TotalGold: 789840, Vip: 10 },
      { UserId: 162, Name: 'chubedan', TotalGold: 720000, Vip: 8 },
    ];
  }

  const visitMatch = sql.match(/P3TeamVisit\s+@TargetUserId\s*=\s*(\d+)/i);
  if (visitMatch) {
    const target = findPvpTarget(Number(visitMatch[1]));
    const power = pvpTargetPower(target);
    return power === null ? [] : buildPvpVisitRows(power);
  }

  if (/dbo\.P3Team(?:\s|$)/.test(sql)) {
    return teamRows();
  }

  if (sql.includes('P3TeamNinjaList')) {
    return MOCK_ROSTER.map((ninja) => ({
      Id: ninja.Id,
      Img: ninja.Img,
      Name: ninja.Name,
      IsEquip: [...mockTeam.slots.values()].includes(ninja.Id),
      Lv: ninja.Lv,
      Ascend: 0,
      Attribute: ninja.Attribute,
      Tier: ninja.Tier,
      Star: ninja.Star,
    }));
  }

  if (sql.includes('P3NinjaAttributePicker')) {
    return MOCK_ROSTER.map((ninja) => ({
      Id: ninja.Id,
      Img: ninja.Img,
      Name: ninja.Name,
      Star: ninja.Star,
      Lv: ninja.Lv,
      LvExp: 0,
      Attribute: ninja.Attribute,
      Tier: ninja.Tier,
      Ascend: 0,
      IsEquip: [...mockTeam.slots.values()].includes(ninja.Id),
      Atk: ninja.Atk,
      Def: ninja.Def,
      NextAtk: ninja.Atk,
      NextDef: ninja.Def,
    }));
  }

  if (sql.includes('P3SlotUnlock')) {
    return [
      { Slots: 1, Lv: 1 },
      { Slots: 2, Lv: 1 },
      { Slots: 3, Lv: 1 },
      { Slots: 4, Lv: 10 },
      { Slots: 5, Lv: 20 },
      { Slots: 6, Lv: 30 },
      { Slots: 7, Lv: 45 },
      { Slots: 8, Lv: 60 },
      { Slots: 9, Lv: 75 },
      { Slots: 10, Lv: 90 },
    ];
  }

  if (sql.includes('P2BattleTeamStat')) {
    const rows = teamRows().filter((row) => row.NinjaId);
    return {
      AtkSum: rows.reduce((sum, row) => sum + (row.TotalAtk || 0), 0),
      DefSum: rows.reduce((sum, row) => sum + (row.TotalDef || 0), 0),
    };
  }

  if (sql.includes('P3TeamEquipList')) {
    const type = Number(param(sql, 'EquipType'));
    const equippedIds = new Set([
      ...mockTeam.weapons.values(),
      ...mockTeam.armors.values(),
    ]);
    return MOCK_EQUIP.filter((item) => item.Type === type).map((item) => ({
      Id: item.Id,
      Img: item.Img,
      Name: item.Name,
      Name2: item.Name2,
      IsEquip: equippedIds.has(item.Id),
      Lv: item.Lv,
      Star: item.Star,
    }));
  }

  if (sql.includes('P4BagItem')) {
    return [
      {
        Gold: mockVitals.gold,
        Diamond: mockVitals.diamond,
        Energy: mockVitals.energy,
        BP: mockVitals.bp,
      },
      ...MOCK_ITEMS.filter((item) => item.Quantity > 0).map((item) => ({
        Id: item.Id,
        Name: item.Name,
        Name2: item.Name2,
        Img: item.Img,
        Quantity: item.Quantity,
        UseType: item.UseType,
      })),
    ];
  }

  if (
    sql.includes('P4BagEquipStack') ||
    sql.includes('P4BagNinjaStack') ||
    sql.includes('P4BagGem')
  ) {
    return [
      {
        Gold: mockVitals.gold,
        Diamond: mockVitals.diamond,
        Energy: mockVitals.energy,
        BP: mockVitals.bp,
      },
    ];
  }

  if (sql.includes('P1TeamSetNinja')) {
    const slot = Number(param(sql, 'Slot'));
    const ninjaId = Number(param(sql, 'NinjaId'));
    if (!slot || !rosterById(ninjaId)) return [{ Result: '0' }];
    for (const [otherSlot, otherId] of mockTeam.slots.entries()) {
      if (otherId === ninjaId && otherSlot !== slot) {
        mockTeam.slots.delete(otherSlot);
      }
    }
    mockTeam.slots.set(slot, ninjaId);
    return [{ Result: '1' }];
  }

  if (sql.includes('P1TeamSetEquip')) {
    const slot = Number(param(sql, 'Slot'));
    const equipId = Number(param(sql, 'EquipId'));
    const equipSlot = Number(param(sql, 'EquipSlot'));
    if (!slot || !equipSlot) return [{ Result: '0' }];

    const map = equipSlot === 1 ? mockTeam.weapons : mockTeam.armors;
    for (const [otherSlot, otherId] of map.entries()) {
      if (otherId === equipId && otherSlot !== slot) {
        map.delete(otherSlot);
      }
    }
    if (!equipId) map.delete(slot);
    else if (equipById(equipId)) map.set(slot, equipId);
    else return [{ Result: '0' }];
    return [{ Result: '1' }];
  }

  if (sql.includes('P1TeamSwap')) {
    const slotA = Number(param(sql, 'SlotA'));
    const slotB = Number(param(sql, 'SlotB'));
    const a = mockTeam.slots.get(slotA);
    const b = mockTeam.slots.get(slotB);
    if (a) mockTeam.slots.set(slotB, a);
    else mockTeam.slots.delete(slotB);
    if (b) mockTeam.slots.set(slotA, b);
    else mockTeam.slots.delete(slotA);
    return [{ Result: '1' }];
  }

  /* ------------------------------ Daily ------------------------------ */

  if (sql.includes('P1MailHasGift')) {
    return { value: daily.mail > 0 ? '1' : '0' };
  }

  if (sql.includes('P4Mail')) {
    return [
      { MailId: 1, Title: 'Quà Alpha', Claimed: daily.mail >= 1 ? 0 : 1 },
      { MailId: 2, Title: 'Quà đăng nhập', Claimed: daily.mail >= 2 ? 0 : 1 },
      { MailId: 3, Title: 'Thông báo', Claimed: 1 },
    ];
  }

  if (sql.includes('P1MailClaimAll')) {
    const count = daily.mail;
    daily.mail = 0;
    return { Result: 1, Count: count };
  }

  if (sql.includes('P0GiftDayCheckIn')) {
    if (daily.checkinDone) return { Result: 0, P0GiftDayCheckIn: 0 };
    daily.checkinDone = true;
    bumpMission('checkin');
    return { Result: 1, P0GiftDayCheckIn: 1 };
  }

  if (sql.includes('P3GiftDay')) {
    return Array.from({ length: 7 }, (_, index) => {
      const day = index + 1;
      const ready = day === 7 && daily.loginGift;
      return {
        Day: day,
        Unlocked: ready ? 1 : 0,
        Claimed: 0,
        Diamond: PROFILE.diamond,
        Today: 7,
        WeekStartText: '15/11/2026',
        WeekEndText: '21/11/2026',
        GiftType: 5,
        Gift: 5,
        Quantity: 1,
        GiftImg: 'item/49',
        GiftName: 'Trứng ninja 5★',
      };
    });
  }

  if (sql.includes('P1GiftDayClaim')) {
    const day = Number(param(sql, 'Day'));
    if (!daily.loginGift || day !== 7) return { Result: 0 };
    daily.loginGift = false;
    return { Result: 1 };
  }

  if (sql.includes('P3GiftTimeStatus')) {
    return {
      Minutes: 0,
      Claimed: daily.online ? 0 : 1,
      CanClaim: daily.online ? 1 : 0,
    };
  }

  if (sql.includes('P3GiftTimeClaim')) {
    if (!daily.online) return { Result: 0 };
    daily.online = false;
    return { Result: 1, Gold: 5000 };
  }

  if (sql.includes('P3MissionList')) {
    return daily.missions.map((mission) => ({ ...mission }));
  }

  if (sql.includes('P1MissionClaim2')) {
    const missionId = Number(param(sql, 'MissionId'));
    const mission = daily.missions.find((item) => item.Id === missionId);
    if (!mission || mission.State !== 1) return { Result: 0 };
    mission.State = 2;
    return {
      Result: 1,
      Item: 27,
      Name: mission.RewardName,
      Img: 'item/27',
      Quantity: mission.RewardQty,
      GiftType: 0,
    };
  }

  if (sql.includes('P2TurnplateStatus')) {
    return { FreeCount: daily.turnplateFree, Cost: 350 };
  }

  if (sql.includes('P1TurnplateSpin')) {
    const times = Number(param(sql, 'Times')) || 1;
    if (times > daily.turnplateFree) return { Result: 0 };
    daily.turnplateFree -= times;
    bumpMission('turnplate', times);
    return { Result: 1, Name: 'Vàng', Quantity: 1000 * times };
  }

  if (sql.includes('P2Scratch')) {
    return { FreeAvailable: daily.scratchFree ? 1 : 0, Diamond: PROFILE.diamond };
  }

  if (sql.includes('P1Scratch')) {
    if (!daily.scratchFree) return { Result: 0 };
    daily.scratchFree = 0;
    return {
      Result: 1,
      WinTier: 0,
      WinDiamond: 5,
      IsFree: true,
      NewDiamond: PROFILE.diamond + 5,
      Pos: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    };
  }

  if (sql.includes('P4DiamondSpending')) {
    return {
      TodaySpent: 3000,
      NextMilestone: daily.nextMilestone,
      Remaining: daily.nextMilestone ? Math.max(daily.nextMilestone - 3000, 0) : 0,
      SecondsLeft: 30000,
    };
  }

  if (sql.includes('P1DiamondSpendingClaim')) {
    const milestone = Number(param(sql, 'Milestone'));
    if (daily.diamondMilestoneClaimed && milestone === 3000) return { Result: 4 };
    if (milestone !== 3000) return { Result: 3 };
    daily.diamondMilestoneClaimed = true;
    daily.nextMilestone = 6000;
    return { Result: 1 };
  }

  if (sql.includes('P3Gift')) {
    return Array.from({ length: 24 }, (_, index) => {
      const tier = index + 1;
      return {
        Tier: tier,
        Lv: tier * 5,
        Unlocked: tier <= 5 ? 1 : 0,
        Claimed: daily.levelGiftClaimed.includes(tier) ? 1 : 0,
        Item1: 49,
        Qty1: 1,
        Img1: 'item/49',
        Star1: 5,
        Item2: 0,
        Qty2: 0,
        Img2: '',
        Star2: 0,
        Item3: 0,
        Qty3: 0,
        Img3: '',
        Star3: 0,
      };
    });
  }

  if (sql.includes('P1GiftClaim')) {
    const tier = Number(param(sql, 'Tier'));
    if (tier < 1 || tier > 5 || daily.levelGiftClaimed.includes(tier)) {
      return { Result: 0 };
    }
    daily.levelGiftClaimed.push(tier);
    return { Result: 1 };
  }

  return null;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const body = req.method === 'POST' ? await readBody(req) : {};

  if (url.pathname === '/api/api/version') {
    return json(res, 200, { version: '26.11.21' });
  }

  if (url.pathname === '/api/api/session/login') {
    if (!body.uname || !body.password || body.password === 'wrong') {
      return json(res, 200, { result: '0' });
    }
    daily = createDailyState();
    resetMockTeam();
    resetMockItems();
    resetMockVitals();
    resetMockStory();
    resetMockTrain();
    resetMockUltimate();
    resetMockBoss();
    resetDashboardScenario();
    const token = `mock.${body.uname}.${Date.now()}`;
    tokens.add(token);
    return json(res, 200, { result: '1', token, askContact: false });
  }

  if (url.pathname === '/api/mock/reset') {
    daily = createDailyState();
    resetMockTeam();
    resetMockItems();
    resetMockVitals();
    resetMockStory();
    resetMockTrain();
    resetMockUltimate();
    resetMockBoss();
    resetDashboardScenario();
    return json(res, 200, { ok: true, scenario: mockScenario });
  }

  if (url.pathname === '/api/mock/scenario') {
    const scenario = String(body.scenario || 'default');
    if (!DASHBOARD_SCENARIOS.has(scenario)) {
      return json(res, 400, { error: 'unknown scenario' });
    }
    mockScenario = scenario;
    applyBossScenario(scenario);
    if (scenario === 'ultimate-pending') {
      for (const mode of [1, 2]) {
        mockUltimate[mode].pendingBuff = 1;
        mockUltimate[mode].pendingReward = 1;
      }
    } else {
      for (const mode of [1, 2]) {
        mockUltimate[mode].pendingBuff = 0;
        mockUltimate[mode].pendingReward = 0;
      }
    }
    return json(res, 200, { scenario });
  }

  if (url.pathname === '/api/health') {
    return json(res, 200, {});
  }

  if (!url.pathname.startsWith('/api1/')) {
    return json(res, 404, {});
  }

  const token = req.headers['x-session-token'];
  if (!token || !tokens.has(token)) {
    res.writeHead(401, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Invalid or missing session token.');
  }

  if (url.pathname === '/api1/api/session/select-server') {
    return json(res, 200, { result: String(PROFILE.id) });
  }

  if (url.pathname === '/api1/api/session/logout') {
    tokens.delete(token);
    res.writeHead(200);
    return res.end();
  }

  if (url.pathname === '/api1/api/ping') {
    res.writeHead(204);
    return res.end();
  }

  if (url.pathname === '/api1/api/reward/use-item') {
    const itemId = Number(body.item);
    const quantity = Math.max(1, Number(body.quantity) || 1);
    const item = MOCK_ITEMS.find((entry) => entry.Id === itemId);
    if (!item || item.Quantity <= 0) {
      return json(res, 200, [{ Result: 0 }]);
    }
    const used = Math.min(quantity, item.Quantity);
    item.Quantity -= used;
    if (item.UseType === 1) {
      const gained = used * item.Gain;
      mockVitals.gold += gained;
      return json(res, 200, [
        { Result: 1, UseType: 1, Gained: gained, Quantity: used },
      ]);
    }
    if (item.UseType === 2) {
      const gained = used * item.Gain;
      mockVitals.diamond += gained;
      return json(res, 200, [
        { Result: 1, UseType: 2, Gained: gained, Quantity: used },
      ]);
    }
    if (item.UseType === 3) {
      if (
        mockVitals.energy >= mockVitals.energyMax ||
        mockVitals.energyUsed >= mockVitals.energyLimit
      ) {
        item.Quantity += used;
        return json(res, 200, [
          {
            Result: 6,
            UseType: 3,
            UsedToday: mockVitals.energyUsed,
            PerDay: mockVitals.energyLimit,
          },
        ]);
      }
      const wanted = used * item.Gain;
      const before = mockVitals.energy;
      mockVitals.energy = Math.min(mockVitals.energyMax, before + wanted);
      const gained = mockVitals.energy - before;
      mockVitals.energyUsed += used;
      return json(res, 200, [
        {
          Result: 1,
          UseType: 3,
          Gained: gained,
          Quantity: used,
          UsedToday: mockVitals.energyUsed,
          PerDay: mockVitals.energyLimit,
        },
      ]);
    }
    if (item.UseType === 5) {
      return json(res, 200, [
        { Result: 2, Name: 'Minato Namikaze', Img: 'ninja/110', Quantity: used, Star: 5 },
      ]);
    }
    return json(res, 200, [{ Result: 1, Quantity: used }]);
  }

  if (url.pathname === '/api1/api/reward/house-draw') {
    const btn = Math.min(Math.max(Number(body.btn) || 1, 1), 4);
    const costs = { 1: 1000, 2: 5000, 3: 30000, 4: 80000 };
    const cost = costs[btn] ?? costs[1];
    if (mockVitals.gold < cost) {
      return json(res, 200, {
        Result: 0,
        NextBtn: btn,
        Ninja: 0,
        Gold: mockVitals.gold,
        Star: 0,
      });
    }
    mockVitals.gold -= cost;
    const ninja = 100 + Math.floor(Math.random() * 60);
    const star =
      btn === 4 ? 3 + Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 5);
    return json(res, 200, {
      Result: 1,
      NextBtn: Math.min(4, btn + 1),
      Ninja: ninja,
      Gold: mockVitals.gold,
      Star: star,
    });
  }

  if (url.pathname === '/api1/api/battle') {
    const opponentId = Number(body.opponentId);
    if (mockScenario === 'story-wall' && opponentId === mockProgress.Scid) {
      return json(res, 200, { Id: null, Error: 'Locked' });
    }
    const stage = MOCK_STORY_BY_ID.get(opponentId);
    if (!stage) {
      return json(res, 200, { Id: null, Error: 'NotFound' });
    }
    if (opponentId > mockProgress.Scid) {
      return json(res, 200, { Id: null, Error: 'Locked' });
    }
    if (mockVitals.energy < stage.Energy) {
      return json(res, 200, { Id: null, Error: 'NoEnergy' });
    }

    mockVitals.energy -= stage.Energy;
    const firstClear = opponentId === mockProgress.Scid;
    const win = mockScenario !== 'story-loss';
    let expGained = 0;
    let levelUp = 0;

    if (win) {
      expGained = firstClear ? stage.Exp : Math.round(stage.Exp * 0.8);
      mockVitals.gold += stage.Gold;
      mockVitals.exp += expGained;
      while (mockVitals.exp >= mockVitals.expMax) {
        mockVitals.exp -= mockVitals.expMax;
        mockVitals.level += 1;
        mockVitals.expMax = Math.round(mockVitals.expMax * 1.1);
        levelUp += 1;
      }
      if (firstClear) {
        const next = MOCK_STORY_BY_ID.get(opponentId + 1);
        mockProgress = next
          ? {
              Scid: next.Scid,
              Task: next.Task,
              Chapter: next.Chapter,
              StageNo: next.StageNo,
              MaxScid: 60,
            }
          : { ...mockProgress, Scid: opponentId + 1 };
      }
      bumpMission('plot');
    }

    const id = ++mockStoryBattleSeq;
    mockBattleLogs.set(id, {
      Result: 1,
      Id: id,
      CreatedAt: new Date().toISOString(),
      MeTeam: 1,
      Win: win,
      BattleLog: 'mock',
    });
    return json(res, 200, {
      Id: id,
      Error: null,
      KeyItem: 0,
      KeyName: null,
      KeyImg: null,
      LevelUp: levelUp,
      ExpGained: expGained,
    });
  }

  if (url.pathname === '/api1/api/battle/plunder-list') {
    return json(
      res,
      200,
      [
        MOCK_PVP_PLUNDER.map((row) => ({
          Grp: row.Grp,
          UserId: row.UserId,
          Name: row.Name,
          Lv: row.Lv,
          Gold: row.Gold,
          Img1: row.Img1,
          Img2: row.Img2,
          Img3: row.Img3,
          Star1: row.Star1,
          Star2: row.Star2,
          Star3: row.Star3,
          Tier1: row.Tier1,
          Tier2: row.Tier2,
          Tier3: row.Tier3,
          Attr1: row.Attr1,
          Attr2: row.Attr2,
          Attr3: row.Attr3,
        })),
        [],
      ],
    );
  }

  if (url.pathname === '/api1/api/battle/rank') {
    if (mockScenario === 'pvp-no-bp') {
      return json(res, 200, { Id: null, Error: 'NoBP' });
    }
    if (mockScenario === 'pvp-no-target') {
      return json(res, 200, { Id: null, Error: 'NoTarget' });
    }

    const targetRankNo = Number(body.targetRankNo);
    const target = MOCK_PVP_RANKS.find((row) => row.RankNo === targetRankNo);
    if (!target) {
      return json(res, 200, { Id: null, Error: 'NoTarget' });
    }

    mockVitals.bp = Math.max(0, mockVitals.bp - 1);
    const win = mockScenario !== 'pvp-loss';
    const id = ++mockStoryBattleSeq;
    if (mockScenario !== 'pvp-unverified') {
      mockBattleLogs.set(id, {
        Result: 1,
        Id: id,
        CreatedAt: new Date().toISOString(),
        MeTeam: 1,
        Win: win,
        BattleLog: 'mock-pvp-rank',
      });
    }

    return json(res, 200, {
      Id: id,
      Error: null,
      KeyItem: 0,
      KeyName: null,
      KeyImg: null,
      LevelUp: 0,
      ExpGained: win ? 25 : 0,
    });
  }

  if (url.pathname === '/api1/api/battle/plunder') {
    if (mockScenario === 'pvp-no-bp') {
      return json(res, 200, { Id: null, Error: 'NoBP' });
    }
    if (mockScenario === 'pvp-no-gold') {
      return json(res, 200, { Id: null, Error: 'NoGold' });
    }

    const target = findPvpTarget(body.targetUserId);
    if (!target) {
      return json(res, 200, { Id: null, Error: 'NoTarget' });
    }

    mockVitals.bp = Math.max(0, mockVitals.bp - 1);
    const win = mockScenario !== 'pvp-loss';
    const goldWon = win ? Math.min(20000, target.Gold) : 0;
    if (goldWon > 0) {
      mockVitals.gold += goldWon;
      target.Gold = Math.max(0, target.Gold - goldWon);
    }
    if (win) bumpMission('plunder');

    const id = ++mockStoryBattleSeq;
    if (mockScenario !== 'pvp-unverified') {
      mockBattleLogs.set(id, {
        Result: 1,
        Id: id,
        CreatedAt: new Date().toISOString(),
        MeTeam: 1,
        Win: win,
        BattleLog: 'mock-pvp-plunder',
      });
    }

    return json(res, 200, {
      Id: id,
      Error: null,
      KeyItem: 0,
      KeyName: null,
      KeyImg: null,
      LevelUp: 0,
      ExpGained: win ? 10 : 0,
      GoldWon: goldWon,
    });
  }

  if (url.pathname === '/api1/api/battle/9vs9/log') {
    const id = Number(body.id);
    const log = id
      ? mockBattleLogs.get(id)
      : [...mockBattleLogs.values()][mockBattleLogs.size - 1];
    return json(
      res,
      200,
      log || {
        Result: 0,
        Id: 0,
        CreatedAt: '',
        MeTeam: 1,
        Win: false,
        BattleLog: '',
      },
    );
  }

  if (url.pathname === '/api1/api/battle/train') {
    const cave = Number(body.cave);
    const mode = Number(body.mode) === 2 ? 2 : 1;
    const tier = Number(body.tier) || 0;
    const stageNo = Number(body.stageNo) || 0;

    if (mockScenario === 'cave-closed') {
      return json(res, 200, { Result: 3, Error: 'Closed', Id: null });
    }
    if (mockScenario === 'cave-lowlevel') {
      return json(res, 200, { Result: 4, Error: 'LowLevel', Id: null });
    }
    if (cave !== 1) {
      return json(res, 200, { Result: 3, Error: 'Closed', Id: null });
    }

    const state = mockTrain[cave];
    const used = mode === 1 ? state.usedAtk : state.usedDef;
    if (used >= 3) {
      return json(res, 200, { Result: 2, Error: 'NoRun', Id: null });
    }

    if (mode === 1) state.usedAtk += 1;
    else state.usedDef += 1;

    const win = mockScenario !== 'cave-loss';
    if (win) mockVitals.gold += 1200;
    if (win) bumpMission('train');

    const id = ++mockStoryBattleSeq;
    mockBattleLogs.set(id, {
      Result: 1,
      Id: id,
      CreatedAt: new Date().toISOString(),
      MeTeam: 1,
      Win: win,
      BattleLog: 'mock',
    });

    return json(res, 200, {
      Result: 1,
      Id: id,
      Error: null,
      Win: win ? 1 : 0,
      Gold: win ? 1200 : 0,
      ItemId: 55,
      ItemQty: win ? 1 : 0,
      MaxStage: 2,
      Tier: tier,
      StageNo: stageNo,
    });
  }

  if (url.pathname === '/api1/api/battle/ultimate') {
    const mode = Number(body.mode) === 2 ? 2 : 1;
    const star = Math.max(1, Number(body.star) || 1);
    const state = mockUltimate[mode];

    if (!state) {
      return json(res, 200, { Result: 0, Error: 'BadParam', Id: null });
    }
    if (
      mockScenario === 'ultimate-pending' ||
      state.pendingBuff ||
      state.pendingReward
    ) {
      return json(res, 200, { Result: 3, Error: 'Pending', Id: null });
    }
    if (state.runsLeft <= 0) {
      return json(res, 200, { Result: 2, Error: 'NoRun', Id: null });
    }

    state.runsLeft -= 1;
    const win = mockScenario !== 'ultimate-loss';
    let gold = 0;

    if (win) {
      gold = 35 + state.stage * 5;
      mockVitals.gold += gold;
      state.stage = state.nextStage;
      state.nextStage = state.stage + 1;
      state.stagesWon += 1;
      state.starEarned += star;
      state.starMax = state.stage * 3;
      if (state.stage % 3 === 0) state.pendingBuff = 1;
      if (state.stage % 5 === 0) state.pendingReward = 1;
    } else {
      state.stage = 1;
      state.nextStage = 2;
    }
    if (win) bumpMission('ultimate');

    const id = ++mockStoryBattleSeq;
    mockBattleLogs.set(id, {
      Result: 1,
      Id: id,
      CreatedAt: new Date().toISOString(),
      MeTeam: 1,
      Win: win,
      BattleLog: 'mock',
    });

    return json(res, 200, {
      Result: 1,
      Id: id,
      Error: null,
      StageNo: state.stage,
      Star: star,
      Gold: gold,
    });
  }

  if (url.pathname === '/api1/api/battle/boss') {
    if (!mockBeast.eventOpen) {
      return json(res, 200, { Result: 4, Error: 'Closed', Id: null });
    }
    if (mockBeast.defeated) {
      return json(res, 200, { Result: 5, Error: 'Defeated', Id: null, HP: 0 });
    }
    if (mockCooldownRemain(mockBeast) > 0) {
      return json(res, 200, {
        Result: 2,
        Error: 'Cooldown',
        Id: null,
        CooldownRemain: mockCooldownRemain(mockBeast),
      });
    }

    const dame = 1200000;
    mockBeast.hp = Math.max(0, mockBeast.hp - dame);
    mockBeast.dame += dame;
    mockBeast.myRank = 1;
    mockBeast.cooldownUntil = Date.now() + MOCK_BOSS_COOLDOWN_MS;
    if (mockBeast.hp <= 0) mockBeast.defeated = 1;
    bumpMission('boss');

    const id = ++mockStoryBattleSeq;
    mockBattleLogs.set(id, {
      Result: 1,
      Id: id,
      CreatedAt: new Date().toISOString(),
      MeTeam: 1,
      Win: true,
      BattleLog: 'mock-boss',
    });

    return json(res, 200, {
      Result: 1,
      Id: id,
      Error: null,
      CooldownRemain: mockCooldownRemain(mockBeast),
      Dame: dame,
      HP: mockBeast.hp,
      MaxHP: mockBeast.maxHp,
      Fame: 30,
      FameGain: 10,
      LastHit: 1,
      Drops: '',
      GiftItem: 0,
      GiftQty: 0,
      GiftName: '',
      GiftImg: '',
    });
  }

  if (url.pathname === '/api1/api/battle/guildboss') {
    if (mockScenario === 'noguild' || mockScenario === 'no-guild') {
      return json(res, 200, { Result: 4, Error: 'NoGuild', Id: null });
    }
    if (mockGuildBoss.killed) {
      return json(res, 200, { Result: 5, Error: 'Killed', Id: null, HP: 0 });
    }
    if (mockGuildBoss.hitsUsed >= mockGuildBoss.hitsPerDay) {
      return json(res, 200, { Result: 3, Error: 'NoHits', Id: null });
    }
    if (mockCooldownRemain(mockGuildBoss) > 0) {
      return json(res, 200, {
        Result: 2,
        Error: 'Cooldown',
        Id: null,
        CooldownRemain: mockCooldownRemain(mockGuildBoss),
        HitsLeft: mockGuildBoss.hitsPerDay - mockGuildBoss.hitsUsed,
      });
    }

    const dame = 4020;
    mockGuildBoss.hp = Math.max(0, mockGuildBoss.hp - dame);
    mockGuildBoss.dame += dame;
    mockGuildBoss.hitsUsed += 1;
    mockGuildBoss.cooldownUntil = Date.now() + MOCK_BOSS_COOLDOWN_MS;
    if (mockGuildBoss.hp <= 0) mockGuildBoss.killed = 1;
    bumpMission('boss');

    const id = ++mockStoryBattleSeq;
    mockBattleLogs.set(id, {
      Result: 1,
      Id: id,
      CreatedAt: new Date().toISOString(),
      MeTeam: 1,
      Win: false,
      BattleLog: 'mock-guild-boss',
    });

    return json(res, 200, {
      Result: 1,
      Id: id,
      Error: null,
      CooldownRemain: mockCooldownRemain(mockGuildBoss),
      HitsLeft: Math.max(0, mockGuildBoss.hitsPerDay - mockGuildBoss.hitsUsed),
      Dame: dame,
      HP: mockGuildBoss.hp,
      MaxHP: mockGuildBoss.maxHp,
      Killed: mockGuildBoss.killed,
      Drops: '',
      GuildExp: 20,
      Contribution: 20,
      GuildLv: 3,
      LevelUp: 0,
    });
  }

  const sqlMatch = url.pathname.match(/^\/api1\/api\/sql\/(table|row|scalar|dataset|nonquery)$/);
  if (sqlMatch) {
    const kind = sqlMatch[1];
    const data = runProcedure(String(body.sql || ''));

    if (kind === 'nonquery') {
      res.writeHead(200);
      return res.end();
    }
    if (kind === 'row') {
      const row = Array.isArray(data) ? data[0] ?? null : data;
      return json(res, 200, row);
    }
    if (kind === 'table') {
      return json(res, 200, Array.isArray(data) ? data : data ? [data] : []);
    }
    if (kind === 'scalar') {
      const row = Array.isArray(data) ? data[0] : data;
      const value = row ? Object.values(row)[0] : null;
      return json(res, 200, { value: value === null ? null : String(value) });
    }
    if (kind === 'dataset') {
      return json(res, 200, [Array.isArray(data) ? data : data ? [data] : []]);
    }
  }

  return json(res, 404, {});
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mock game API: http://127.0.0.1:${PORT}`);
});

import { setTimeout as delay } from 'node:timers/promises';
import { isFatalGameError } from './client.js';

/**
 * Doc trang thai tong quan cua mot tai khoan.
 *
 * Tab nay chi doc, khong goi bat ky lenh thay doi nao. Du lieu duoc gom tu:
 *  - P4MainLoad / P4StaminaStatus : cap, EXP, tien te, Energy/BP, qua chua nhan.
 *  - P3TeamPower                  : luc chien hien tai.
 *  - P2StageProgress              : tien do story.
 *  - P4TrainStatus                : 3 cave, cave mo, luot da dung.
 *  - P4UltimateStatus @Mode=1/2   : Thử thách tối thượng Cong/Thu.
 *  - P2BossInfo                   : boss vi thu, cua so, HP, cooldown.
 *  - P2MyGuildInfo / P2GuildBossInfo : guild va guild boss.
 *  - P3MissionList / P4Mail       : so muc co the nhan.
 *  - P4DiamondSpending            : moc tieu Kim cuong trong ngay.
 *  - P2KeyStatus                  : so chia khoa.
 */

const READ_GAP_MS = 120;
const TIMEZONE_OFFSET_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const SLOT_LEVELS = [1, 1, 1, 10, 20, 30, 45, 60, 75, 90];

const CAVE_ELEMENTS = {
  1: ['Thổ', 'Hỏa'],
  2: ['Lôi', 'Phong'],
  3: ['Thủy', 'Kage'],
};

function num(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function asRows(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return [value];
  return [];
}

function asRow(value) {
  if (Array.isArray(value)) return value[0] || null;
  return value && typeof value === 'object' ? value : null;
}

function pct(value, max) {
  const current = num(value) ?? 0;
  const total = num(max) ?? 0;
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / total) * 100)));
}

function assetUrl(path) {
  const text = String(path || '').trim();
  if (!text) return null;
  if (text.startsWith('/')) return text;
  const parts = text.split('/');
  if (parts.length < 2) return null;
  return `/assets/${parts[0]}/${parts[parts.length - 1]}.png`;
}

async function readProcedure(game, token, procedure, kind = 'row', params = {}) {
  try {
    return await game.sql(token, procedure, kind, params);
  } catch (error) {
    if (isFatalGameError(error)) throw error;
    return null;
  }
}

function isUnclaimedMail(row) {
  if (!row || typeof row !== 'object') return false;
  if (row.Claimed !== undefined) return num(row.Claimed) === 0;
  if (row.IsClaim !== undefined) return num(row.IsClaim) === 0;
  return false;
}

function normalizeUltimate(row) {
  if (!row) return null;
  return {
    mode: num(row.Mode),
    stage: num(row.StageNo) ?? 0,
    nextStage: num(row.NextStage) ?? 1,
    runsLeft: num(row.RunsLeft) ?? 0,
    inRun: num(row.InRun) === 1,
    stars: num(row.Star) ?? 0,
    starEarned: num(row.StarEarned) ?? 0,
    starMax: num(row.StarMax) ?? 0,
    maxStage: num(row.MaxStage) ?? 0,
    stagesWon: num(row.StagesWon) ?? 0,
    pendingBuff: num(row.PendingBuff) === 1,
    pendingReward: num(row.PendingReward) === 1,
    myRank: num(row.MyRank) ?? 0,
    myCount: num(row.MyCount) ?? 0,
  };
}

function normalizeBoss(row) {
  if (!row) return null;
  const hp = num(row.HP) ?? 0;
  const maxHp = num(row.MaxHP) ?? 0;
  const directionCode = num(row.BeastAtkOrDef);
  return {
    result: num(row.Result),
    eventOpen: num(row.EventOpen) === 1,
    defeated: num(row.Defeated) === 1,
    session: num(row.Session),
    tierName: row.TierName || '',
    beastName: row.BeastName || 'Boss',
    beastImg: assetUrl(row.BeastImg),
    // api.md ghi chu mapping 1/2 la Cong/Thu nhung chua xac nhan tuyet doi.
    direction: directionCode === 1 ? 'atk' : directionCode === 2 ? 'def' : null,
    directionUncertain: true,
    hp,
    maxHp,
    hpPct: pct(hp, maxHp),
    startText: row.StartText || '',
    endText: row.EndText || '',
    secondsToOpen: num(row.SecondsToOpen) ?? 0,
    secondsToClose: num(row.SecondsToClose) ?? 0,
    isTomorrow: num(row.IsTomorrow) === 1,
    fame: num(row.Fame) ?? 0,
    dame: num(row.Dame) ?? 0,
    myRank: num(row.MyRank) ?? 0,
    cooldownRemain: num(row.CooldownRemain) ?? 0,
  };
}

function normalizeGuildBoss(row) {
  if (!row || num(row.Result) === 0) return null;
  const hp = num(row.HP) ?? 0;
  const maxHp = num(row.MaxHP) ?? 0;
  const hitsPerDay = num(row.HitsPerDay) ?? 0;
  const hitsUsed = num(row.HitsUsed) ?? 0;
  return {
    result: num(row.Result),
    beastName: row.BeastName || null,
    beastImg: assetUrl(row.BeastImg),
    hp,
    maxHp,
    hpPct: pct(hp, maxHp),
    killed: num(row.Killed) === 1,
    hitsPerDay,
    hitsUsed,
    hitsLeft: Math.max(0, hitsPerDay - hitsUsed),
    cooldownSec: num(row.CooldownSec) ?? 0,
    cooldownRemain: num(row.CooldownRemain) ?? 0,
    dame: num(row.Dame) ?? 0,
    myRank: num(row.MyRank) ?? 0,
    expPerHit: num(row.ExpPerHit) ?? 0,
    contribPerHit: num(row.ContribPerHit) ?? 0,
  };
}

/* --------------------------- Time helpers --------------------------- */

function utc7TodayAt(now, hour, minute) {
  const local = new Date(now + TIMEZONE_OFFSET_MS);
  return Date.UTC(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate(),
    hour - 7,
    minute,
    0,
    0,
  );
}

function nextUtc7At(now, hour, minute) {
  let value = utc7TodayAt(now, hour, minute);
  if (value <= now) value += DAY_MS;
  return value;
}

function makeWindow(now, id, label, time, startHour, startMinute, endHour, endMinute, note) {
  const startsAt = utc7TodayAt(now, startHour, startMinute);
  const endsAt = utc7TodayAt(now, endHour, endMinute);
  let status = 'upcoming';
  if (now >= endsAt) status = 'past';
  else if (now >= startsAt) status = 'open';
  return {
    id,
    label,
    time,
    note,
    startsAt,
    endsAt,
    status,
    secondsToStart: Math.max(0, Math.round((startsAt - now) / 1000)),
    secondsToEnd: Math.max(0, Math.round((endsAt - now) / 1000)),
  };
}

function buildSchedule(now, { boss, main }) {
  const nextReset = nextUtc7At(now, 0, 0);
  const schedule = [
    {
      id: 'reset',
      label: 'Reset ngày kế tiếp',
      time: '00:00',
      note: 'Nhiệm vụ, lượt chơi và daily làm mới.',
      startsAt: nextReset,
      endsAt: nextReset + 60_000,
      status: 'upcoming',
      secondsToStart: Math.max(0, Math.round((nextReset - now) / 1000)),
      secondsToEnd: Math.max(0, Math.round((nextReset + 60_000 - now) / 1000)),
    },
    makeWindow(
      now,
      'boss-noon',
      'Boss trưa',
      '12:00–13:00',
      12,
      0,
      13,
      0,
      'Miễn phí · 20 giây cooldown.',
    ),
    makeWindow(
      now,
      'boss-night',
      'Boss tối',
      '19:00–21:00',
      19,
      0,
      21,
      0,
      'Miễn phí · 20 giây cooldown.',
    ),
    makeWindow(
      now,
      'world-war',
      'World War',
      '17:50–18:00',
      17,
      50,
      18,
      0,
      'Top 20 mới được đăng ký.',
    ),
    makeWindow(
      now,
      'chakra-tree',
      'Chakra Tree',
      '21:00–23:50',
      21,
      0,
      23,
      50,
      'Chốt đóng góp 21:00, thư thưởng 23:50.',
    ),
  ];

  if (boss?.eventOpen) {
    const targetId =
      now < utc7TodayAt(now, 16, 0) ? 'boss-noon' : 'boss-night';
    const target = schedule.find((row) => row.id === targetId);
    if (target) {
      target.status = 'open';
      target.secondsToEnd = boss.secondsToClose || target.secondsToEnd;
      target.note = boss.defeated
        ? 'Boss đã bị hạ trong phiên này.'
        : 'Boss đang mở · 20 giây cooldown.';
    }
  }

  if (num(main.ChakraTreeOpen) !== 1) {
    const target = schedule.find((row) => row.id === 'chakra-tree');
    if (target) target.note = 'Sự kiện đang đóng.';
  }

  return schedule.sort((a, b) => a.startsAt - b.startsAt);
}

/* --------------------------- Suggestions --------------------------- */

function buildSuggestions({
  player,
  stamina,
  daily,
  training,
  ultimate,
  boss,
  guild,
  milestone,
}) {
  const items = [];
  const add = (priority, title, detail, options = {}) => {
    items.push({
      priority,
      title,
      detail,
      risk: options.risk || 'low',
      targetView: options.targetView || null,
      actionLabel: options.actionLabel || null,
    });
  };

  if (daily.missionsReady > 0) {
    add(
      1,
      `Nhận ${daily.missionsReady} nhiệm vụ`,
      'Có nhiệm vụ đã hoàn thành và đang chờ nhận thưởng.',
      { targetView: 'daily', actionLabel: 'Mở Daily' },
    );
  }

  if (daily.mailUnread > 0) {
    add(
      2,
      `Mở ${daily.mailUnread} thư`,
      'Hộp thư đang có quà chưa nhận.',
      { targetView: 'daily', actionLabel: 'Mở Daily' },
    );
  }

  const giftTotal =
    daily.giftDayUnclaimed + daily.giftUnclaimed + daily.diamondUnclaimed;
  if (giftTotal > 0) {
    add(
      3,
      `Nhận ${giftTotal} quà`,
      'Quà đăng nhập, quà cấp độ hoặc mốc Kim cương chưa nhận.',
      { targetView: 'daily', actionLabel: 'Mở Daily' },
    );
  }

  if (milestone.remaining === 0 && milestone.nextMilestone) {
    add(
      2,
      `Nhận thưởng mốc ${milestone.nextMilestone} Kim cương`,
      `Đã tiêu ${milestone.todaySpent} Kim cương hôm nay.`,
      { targetView: 'daily', actionLabel: 'Mở Daily' },
    );
  }

  if (daily.scratchFree) {
    add(
      4,
      'Cào thẻ miễn phí',
      'Lượt cào miễn phí trong ngày chưa dùng.',
      { targetView: 'daily', actionLabel: 'Mở Daily' },
    );
  }

  if (stamina.energyPct >= 90 && stamina.energyMax > 0) {
    add(
      5,
      'Dùng bớt Energy',
      `${stamina.energy}/${stamina.energyMax} Energy, sắp đầy và sẽ lãng phí nếu để qua.`,
      { risk: 'low' },
    );
  }

  const openRuns = training.openCaves.reduce(
    (sum, cave) => sum + cave.runsLeftAtk + cave.runsLeftDef,
    0,
  );
  if (openRuns > 0) {
    add(
      3,
      `Huấn luyện: còn ${openRuns} lượt`,
      `${training.openCaves.map((cave) => cave.name).join(', ')} đang mở hôm nay.`,
      { risk: 'medium', targetView: 'training', actionLabel: 'Mở Huấn luyện' },
    );
  }

  if (ultimate.atk?.pendingBuff || ultimate.atk?.pendingReward) {
    add(
      2,
      'Ultimate Công đang chờ xử lý',
      'Cần nhận buff/reward trước khi đánh trận tiếp theo.',
      { risk: 'medium', targetView: 'training', actionLabel: 'Mở Huấn luyện' },
    );
  }
  if (ultimate.def?.pendingBuff || ultimate.def?.pendingReward) {
    add(
      2,
      'Ultimate Thủ đang chờ xử lý',
      'Cần nhận buff/reward trước khi đánh trận tiếp theo.',
      { risk: 'medium', targetView: 'training', actionLabel: 'Mở Huấn luyện' },
    );
  }

  if (boss?.eventOpen && !boss.defeated) {
    add(
      1,
      `Đánh boss ${boss.beastName}`,
      `${boss.hpPct}% HP còn lại · ${boss.cooldownRemain > 0 ? `chờ ${boss.cooldownRemain}s` : 'sẵn sàng'}.`,
      { risk: 'medium', targetView: 'boss', actionLabel: 'Mở Boss' },
    );
  }

  if (!guild.hasGuild) {
    add(
      5,
      'Tìm guild',
      'Chưa có guild nên guild boss và quà guild đang bị khoá.',
      { risk: 'low' },
    );
  }

  if (player.nextSlot) {
    add(
      6,
      `Hướng tới slot ${player.nextSlot.number}`,
      `Cần Lv${player.nextSlot.level}, hiện tại Lv${player.level}.`,
      { risk: 'low' },
    );
  }

  return items
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5)
    .map(({ priority, ...item }) => item);
}

function buildAlerts({ player, stamina, daily, ultimate, boss, guild, milestone }) {
  const alerts = [];
  const add = (level, title, detail) => alerts.push({ level, title, detail });

  if (stamina.energyMax > 0 && stamina.energyPct >= 90) {
    add(
      'warn',
      'Energy sắp đầy',
      `${stamina.energy}/${stamina.energyMax}. Dùng bớt để tránh lãng phí.`,
    );
  } else if (stamina.energyMax > 0 && stamina.energyPct <= 10) {
    add(
      'info',
      'Energy sắp cạn',
      `${stamina.energy}/${stamina.energyMax}. Cân nhắc nhận Energy miễn phí hoặc chờ hồi.`,
    );
  }

  if (stamina.bpMax > 0 && stamina.bpPct >= 90) {
    add('info', 'BP sắp đầy', `${stamina.bp}/${stamina.bpMax}. Cân nhắc dùng cho PvP.`);
  }

  if (
    ultimate.atk?.pendingBuff ||
    ultimate.atk?.pendingReward ||
    ultimate.def?.pendingBuff ||
    ultimate.def?.pendingReward
  ) {
    add(
      'warn',
      'Ultimate đang chờ xử lý',
      'Có buff hoặc reward chưa nhận, trận tiếp theo sẽ bị chặn.',
    );
  }

  if (boss?.eventOpen && boss.defeated) {
    add('info', 'Boss đã bị hạ', 'Phiên này đã xong, chờ phiên tiếp theo.');
  }

  if (!guild.hasGuild) {
    add('info', 'Chưa có guild', 'Guild boss và quà guild đang bị khoá.');
  }

  if (milestone.remaining === 0 && milestone.nextMilestone) {
    add(
      'success',
      'Đã đạt mốc Kim cương',
      `Mốc ${milestone.nextMilestone} đã sẵn sàng nhận.`,
    );
  }

  if (player.nextSlot && player.level >= player.nextSlot.level - 2) {
    add(
      'info',
      `Sắp mở slot ${player.nextSlot.number}`,
      `Cần Lv${player.nextSlot.level}, hiện tại Lv${player.level}.`,
    );
  }

  return alerts.slice(0, 6);
}

/* --------------------------- Main reader --------------------------- */

export async function readDashboardState(game, token, { account = {} } = {}) {
  const mainRow = asRow(await readProcedure(game, token, 'P4MainLoad', 'row'));
  await delay(READ_GAP_MS);

  const infoRow = asRow(await readProcedure(game, token, 'P2Info', 'row'));
  await delay(READ_GAP_MS);

  const staminaRow = asRow(
    await readProcedure(game, token, 'P4StaminaStatus', 'row'),
  );
  await delay(READ_GAP_MS);

  const powerRow = asRow(await readProcedure(game, token, 'P3TeamPower', 'row'));
  await delay(READ_GAP_MS);

  const stageRow = asRow(await readProcedure(game, token, 'P2StageProgress', 'row'));
  await delay(READ_GAP_MS);

  const trainRows = asRows(
    await readProcedure(game, token, 'P4TrainStatus', 'table'),
  );
  await delay(READ_GAP_MS);

  const ultimateAtkRow = asRow(
    await readProcedure(game, token, 'P4UltimateStatus', 'row', { Mode: 1 }),
  );
  await delay(READ_GAP_MS);

  const ultimateDefRow = asRow(
    await readProcedure(game, token, 'P4UltimateStatus', 'row', { Mode: 2 }),
  );
  await delay(READ_GAP_MS);

  const bossRow = asRow(await readProcedure(game, token, 'P2BossInfo', 'row'));
  await delay(READ_GAP_MS);

  const guildRow = asRow(await readProcedure(game, token, 'P2MyGuildInfo', 'row'));
  await delay(READ_GAP_MS);

  const guildId = num(guildRow?.GuildId);
  const guildBossRow = guildId
    ? asRow(await readProcedure(game, token, 'P2GuildBossInfo', 'row'))
    : null;
  if (guildId) await delay(READ_GAP_MS);

  const missionRows = asRows(
    await readProcedure(game, token, 'P3MissionList', 'table'),
  );
  await delay(READ_GAP_MS);

  const mailRows = asRows(await readProcedure(game, token, 'P4Mail', 'table'));
  await delay(READ_GAP_MS);

  const milestoneRow = asRow(
    await readProcedure(game, token, 'P4DiamondSpending', 'row'),
  );
  await delay(READ_GAP_MS);

  const keyRow = asRow(await readProcedure(game, token, 'P2KeyStatus', 'row'));

  const main = mainRow || {};
  const stamina = staminaRow || {};
  const milestone = milestoneRow || {};
  const now = Date.now();

  const level = num(main.Lv) ?? num(account.level) ?? 1;
  const exp = num(main.LvExp) ?? 0;
  const expMax = num(main.LvFullExp) ?? 0;
  const gold = num(main.Gold) ?? num(account.gold) ?? 0;
  const diamond = num(main.Diamond) ?? num(account.diamond) ?? 0;
  const energy = num(main.Energy) ?? num(stamina.Energy) ?? 0;
  const energyMax = num(main.EnergyCap) ?? num(stamina.EnergyMax) ?? 0;
  const bp = num(main.BP) ?? num(stamina.BP) ?? 0;
  const bpMax = num(main.BpCap) ?? num(stamina.BpMax) ?? 0;
  const power = num(powerRow?.Power) ?? num(account.power) ?? 0;
  const slots = num(main.UnlockedSlots) ?? 0;
  const vip = num(main.Vip) ?? num(stamina.Vip) ?? 0;

  const nextSlot =
    slots > 0 && slots < SLOT_LEVELS.length
      ? { number: slots + 1, level: SLOT_LEVELS[slots] }
      : null;

  const player = {
    name:
      main.Name ||
      infoRow?.Name ||
      account.characterName ||
      account.username ||
      '',
    characterId: num(infoRow?.Id),
    level,
    exp,
    expMax,
    expPct: pct(exp, expMax),
    power,
    slots,
    vip,
    rankNo: num(account.rankNo),
    nextSlot,
  };

  const staminaState = {
    energy,
    energyMax,
    energyPct: pct(energy, energyMax),
    energyUsed: num(stamina.EnergyUsed) ?? 0,
    energyLimit: num(stamina.EnergyLimit) ?? 0,
    bp,
    bpMax,
    bpPct: pct(bp, bpMax),
    bpUsed: num(stamina.BpUsed) ?? 0,
    bpLimit: num(stamina.BpLimit) ?? 0,
  };

  const progress = {
    scid: num(stageRow?.Scid) ?? 0,
    task: num(stageRow?.Task) ?? 0,
    chapter: num(stageRow?.Chapter) ?? 0,
    stageNo: num(stageRow?.StageNo) ?? 0,
    maxScid: num(stageRow?.MaxScid) ?? 0,
  };

  const missionsReady = missionRows.filter((row) => num(row.State) === 1).length;
  const mailUnread = mailRows.filter(isUnclaimedMail).length;
  const nextMilestone = num(milestone.NextMilestone);
  const remaining = num(milestone.Remaining);

  const daily = {
    missionsReady,
    missionsTotal: missionRows.length,
    mailUnread,
    giftDayUnclaimed: num(main.GiftDayUnclaimedCount) ?? 0,
    giftUnclaimed: num(main.GiftUnclaimedCount) ?? 0,
    diamondUnclaimed: num(main.DiamondUnclaimedCount) ?? 0,
    scratchFree: num(main.ScratchFreeAvailable) === 1,
    turnplateFree: num(main.TurnplateFreeCount) ?? 0,
    todaySpent: num(milestone.TodaySpent) ?? 0,
    nextMilestone,
    milestoneRemaining: remaining,
    milestoneSecondsLeft: num(milestone.SecondsLeft) ?? 0,
    keys: keyRow
      ? {
          bronze: num(keyRow.Bronze) ?? 0,
          silver: num(keyRow.Silver) ?? 0,
          gold: num(keyRow.Gold) ?? 0,
          multBronze: num(keyRow.MultBronze) ?? 0,
          multSilver: num(keyRow.MultSilver) ?? 0,
          multGold: num(keyRow.MultGold) ?? 0,
        }
      : null,
  };

  const caves = trainRows.map((row) => {
    const cave = num(row.Cave);
    const runsMaxMode = num(row.RunsMaxMode) ?? 3;
    const usedAtk = num(row.RunsUsedAtk) ?? 0;
    const usedDef = num(row.RunsUsedDef) ?? 0;
    return {
      cave,
      name: row.Name0 || row.Name || `Động ${cave}`,
      nameEn: row.Name || null,
      open: num(row.IsOpen) === 1,
      openDays: row.OpenDays || '',
      elements: CAVE_ELEMENTS[cave] || [],
      note: row.Info0 || row.Info || '',
      runsUsed: num(row.RunsUsed) ?? 0,
      runsMax: num(row.RunsMax) ?? 6,
      runsMaxMode,
      runsUsedAtk: usedAtk,
      runsUsedDef: usedDef,
      runsLeftAtk: Math.max(0, runsMaxMode - usedAtk),
      runsLeftDef: Math.max(0, runsMaxMode - usedDef),
      debuffPct: num(row.DebuffPct) ?? 50,
      debuffPctSuper: num(row.DebuffPctSuper) ?? 30,
      debuffPctKage: num(row.DebuffPctKage) ?? 10,
      itemId: num(row.ItemId),
    };
  });

  const training = {
    caves,
    openCaves: caves.filter((cave) => cave.open),
  };

  const ultimate = {
    atk: normalizeUltimate(ultimateAtkRow),
    def: normalizeUltimate(ultimateDefRow),
  };

  const boss = normalizeBoss(bossRow);

  const guild = {
    hasGuild: Boolean(guildId),
    name: guildRow?.GuildName || null,
    level: num(guildRow?.GuildLv) ?? 0,
    role: num(guildRow?.Role) ?? 0,
    isLeader: num(guildRow?.IsLeader) === 1,
    boss: guildId ? normalizeGuildBoss(guildBossRow) : null,
  };

  const milestoneState = {
    todaySpent: daily.todaySpent,
    nextMilestone,
    remaining,
    secondsLeft: daily.milestoneSecondsLeft,
  };

  const alerts = buildAlerts({
    player,
    stamina: staminaState,
    daily,
    ultimate,
    boss,
    guild,
    milestone: milestoneState,
  });

  const suggestions = buildSuggestions({
    player,
    stamina: staminaState,
    daily,
    training,
    ultimate,
    boss,
    guild,
    milestone: milestoneState,
  });

  const schedule = buildSchedule(now, { boss, main });

  return {
    accountId: num(account.id),
    fetchedAt: new Date(now).toISOString(),
    serverNow: new Date(now).toISOString(),
    timezone: 'UTC+7',
    player,
    currency: { gold, diamond },
    stamina: staminaState,
    progress,
    daily,
    training,
    ultimate,
    boss,
    guild,
    alerts,
    suggestions,
    schedule,
  };
}

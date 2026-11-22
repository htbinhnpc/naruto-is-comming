import { setTimeout as delay } from 'node:timers/promises';

import { isFatalGameError } from './client.js';

/**
 * Doc trang thai va danh Vĩ Thú / Guild Boss.
 *
 * An toan:
 *  - Moi lan chi danh 1 hit, khong giu request dai.
 *  - Khong tieu Kim cuong, khong mua luot.
 *  - Chi danh khi cua so mo, boss chua bi ha, con luot va het cooldown.
 *  - Xac thuc hit bang Dame/HP/HitsLeft, khong dung Win.
 */

const READ_GAP_MS = 130;
const BEAST_COOLDOWN_SEC = 20;
const WINDOW_ENDING_MARGIN_SEC = 5;

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
  if (Array.isArray(value)) return value[0] ?? null;
  return value && typeof value === 'object' ? value : null;
}

function pct(value, max) {
  const current = num(value) ?? 0;
  const total = num(max) ?? 0;
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / total) * 100)));
}

function assetId(path) {
  const text = String(path || '').trim();
  if (!text) return null;
  const parts = text.split('/');
  return parts[parts.length - 1] || null;
}

function ninjaImage(path) {
  const id = assetId(path);
  return id ? `/assets/ninja/${id}.png` : null;
}

function imageUrl(folder, path) {
  const id = assetId(path);
  return id ? `/assets/${folder}/${id}.png` : null;
}

function beastImage(beastIndex, path) {
  const index = num(beastIndex);
  if (Number.isInteger(index) && index >= 1 && index <= 10) {
    return `/assets/beast/head_${index}.png`;
  }
  return ninjaImage(path);
}

async function readProcedure(game, token, procedure, kind = 'row', params = {}) {
  try {
    return await game.sql(token, procedure, kind, params);
  } catch (error) {
    if (isFatalGameError(error)) throw error;
    return null;
  }
}

function parseNinjaIds(value) {
  return String(value || '')
    .split(',')
    .map((part) => num(part.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);
}

function normalizeBeastRank(row) {
  if (!row) return null;
  const ninjas = parseNinjaIds(row.Ninjas);
  return {
    rankNo: num(row.RankNo) ?? 0,
    name: row.Name || '—',
    level: num(row.Lv) ?? 0,
    dame: num(row.Dame) ?? 0,
    hits: num(row.Hits) ?? 0,
    isMe: num(row.IsMe) === 1,
    ninjas: ninjas.map((id) => ({ id, image: `/assets/ninja-head/${id}.png` })),
  };
}

function normalizeGuildRank(row) {
  if (!row) return null;
  return {
    rankNo: num(row.RankNo) ?? 0,
    userId: num(row.UserId),
    name: row.Name || '—',
    level: num(row.Lv) ?? 0,
    dame: num(row.Dame) ?? 0,
    hits: num(row.Hits) ?? 0,
    isMe: num(row.IsMe) === 1,
  };
}

function normalizeBeast(row) {
  if (!row) return null;
  const hp = num(row.HP) ?? 0;
  const maxHp = num(row.MaxHP) ?? 0;
  const directionCode = num(row.BeastAtkOrDef);
  return {
    result: num(row.Result),
    eventOpen: num(row.EventOpen) === 1,
    defeated: num(row.Defeated) === 1,
    session: num(row.Session),
    tier: num(row.Tier),
    tierName: row.TierName || '',
    beastIndex: num(row.BeastIndex),
    beastNinja: num(row.BeastNinja),
    beastName: row.BeastName || 'Vĩ Thú',
    image: beastImage(row.BeastIndex, row.BeastImg),
    ninjaImage: ninjaImage(row.BeastImg),
    // api.md ghi chu 1/2 la Cong/Thu nhung chua xac nhan tuyet doi.
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
    cooldownSec: BEAST_COOLDOWN_SEC,
  };
}

function normalizeGuildBoss(row) {
  if (!row) return null;
  const result = num(row.Result);
  if (result === 0) return null;

  const hp = num(row.HP) ?? 0;
  const maxHp = num(row.MaxHP) ?? 0;
  const hitsPerDay = num(row.HitsPerDay) ?? 0;
  const hitsUsed = num(row.HitsUsed) ?? 0;

  return {
    result,
    guildLv: num(row.GuildLv) ?? 0,
    beastIndex: num(row.BeastIndex),
    beastNinja: num(row.BeastNinja),
    beastName: row.BeastName || 'Guild Boss',
    image: beastImage(row.BeastIndex, row.BeastImg),
    ninjaImage: ninjaImage(row.BeastImg),
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
    expKill: num(row.ExpKill) ?? 0,
    secondsToReset: num(row.SecondsToReset) ?? 0,
    killReward: row.KillReward || '',
    rank1Reward: row.Rank1Reward || '',
  };
}

async function readBeast(game, token) {
  const row = asRow(await readProcedure(game, token, 'P2BossInfo', 'row'));
  return normalizeBeast(row);
}

async function readGuild(game, token) {
  const guildRow = asRow(await readProcedure(game, token, 'P2MyGuildInfo', 'row'));
  await delay(READ_GAP_MS);

  const guildId = num(guildRow?.GuildId);
  return {
    guildId,
    guildName: guildRow?.GuildName || null,
    guildLv: num(guildRow?.GuildLv),
    isLeader: num(guildRow?.IsLeader) === 1,
    role: num(guildRow?.Role),
    hasGuild: Boolean(guildId),
  };
}

async function readGuildBoss(game, token, guildInfo, { withRank = true } = {}) {
  if (!guildInfo.hasGuild) {
    return { boss: null, rank: [] };
  }

  const bossRow = asRow(await readProcedure(game, token, 'P2GuildBossInfo', 'row'));
  await delay(READ_GAP_MS);

  const boss = normalizeGuildBoss(bossRow);
  if (!boss) return { boss: null, rank: [] };

  if (!withRank) return { boss, rank: [] };

  const rankRows = asRows(
    await readProcedure(game, token, 'P3GuildBossRank', 'table'),
  );

  return {
    boss,
    rank: rankRows.map(normalizeGuildRank).filter(Boolean),
  };
}

export async function readBossState(game, token) {
  const main = asRow(await readProcedure(game, token, 'P4MainLoad', 'row'));
  await delay(READ_GAP_MS);

  const beast = await readBeast(game, token);
  await delay(READ_GAP_MS);

  const beastRankRows = asRows(
    await readProcedure(game, token, 'P3BossFightRank', 'table'),
  );

  const guildInfo = await readGuild(game, token);
  const guildBoss = await readGuildBoss(game, token, guildInfo);

  return {
    player: {
      level: num(main?.Lv) ?? 0,
      gold: num(main?.Gold) ?? 0,
      diamond: num(main?.Diamond) ?? 0,
      energy: num(main?.Energy) ?? 0,
      energyMax: num(main?.EnergyCap) ?? 0,
    },
    beast: beast
      ? {
          ...beast,
          rank: beastRankRows.map(normalizeBeastRank).filter(Boolean),
        }
      : null,
    guild: {
      ...guildInfo,
      boss: guildBoss.boss,
      rank: guildBoss.rank,
    },
    readAt: new Date().toISOString(),
  };
}

function mapBeastError(error) {
  const map = {
    Closed: 'closed',
    Defeated: 'defeated',
    Cooldown: 'cooldown',
  };
  return map[error] || `error:${error || 'unknown'}`;
}

function mapGuildError(error) {
  const map = {
    NoGuild: 'no-guild',
    NoHits: 'no-hits',
    Killed: 'killed',
    Cooldown: 'cooldown',
  };
  return map[error] || `error:${error || 'unknown'}`;
}

function beastStopReason(response) {
  const result = num(response?.Result);
  const error = response?.Error || null;

  if (result !== 1) return mapBeastError(error);
  return null;
}

function guildStopReason(response) {
  const result = num(response?.Result);
  const error = response?.Error || null;

  if (result !== 1) return mapGuildError(error);
  return null;
}

function giftFromResponse(response) {
  const itemId = num(response?.GiftItem);
  if (!itemId || itemId <= 0) return null;
  return {
    itemId,
    quantity: num(response?.GiftQty) ?? 0,
    name: response?.GiftName || null,
    image: response?.GiftImg ? imageUrl('item', response.GiftImg) : null,
  };
}

export async function hitBeastBoss(game, token) {
  const before = await readBeast(game, token);
  if (!before) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'error:state',
      state: null,
      hit: null,
    };
  }
  if (!before.eventOpen) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'closed',
      state: before,
      hit: null,
    };
  }
  if (before.defeated) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'defeated',
      state: before,
      hit: null,
    };
  }
  if (before.cooldownRemain > 0) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'cooldown',
      state: before,
      hit: null,
    };
  }

  const response = await game.beastBattle(token);
  const code = num(response?.Result);
  const error = response?.Error || null;

  if (code !== 1) {
    const after = await readBeast(game, token);
    return {
      ok: false,
      code,
      error,
      stopReason: beastStopReason(response),
      state: after || before,
      hit: null,
    };
  }

  const dame = num(response?.Dame) ?? 0;
  const hpAfterHit = num(response?.HP);
  const hpDropped = hpAfterHit !== null && hpAfterHit < before.hp;

  if (dame <= 0 && !hpDropped) {
    const after = await readBeast(game, token);
    return {
      ok: false,
      code,
      error,
      stopReason: 'unverified',
      state: after || before,
      hit: null,
    };
  }

  const after = await readBeast(game, token);
  const state = after || before;

  let stopReason = null;
  if (state?.defeated || (num(response?.HP) ?? 1) <= 0) {
    stopReason = 'killed';
  } else if (
    state?.eventOpen &&
    state.secondsToClose > 0 &&
    state.secondsToClose <= state.cooldownRemain + WINDOW_ENDING_MARGIN_SEC
  ) {
    stopReason = 'window-ending';
  }

  return {
    ok: true,
    code,
    error,
    stopReason,
    state,
    hit: {
      dame,
      hp: hpAfterHit ?? state?.hp ?? 0,
      maxHp: num(response?.MaxHP) ?? state?.maxHp ?? 0,
      cooldownRemain: num(response?.CooldownRemain) ?? state?.cooldownRemain ?? 0,
      fame: num(response?.Fame) ?? state?.fame ?? 0,
      fameGain: num(response?.FameGain) ?? 0,
      lastHit: num(response?.LastHit),
      battleId: num(response?.Id),
      drops: response?.Drops || '',
      gift: giftFromResponse(response),
    },
  };
}

export async function hitGuildBoss(game, token) {
  const guildInfo = await readGuild(game, token);
  if (!guildInfo.hasGuild) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'no-guild',
      guild: guildInfo,
      state: null,
      hit: null,
    };
  }

  const before = await readGuildBoss(game, token, guildInfo, { withRank: false });
  const boss = before.boss;
  if (!boss) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'no-guild',
      guild: guildInfo,
      state: null,
      hit: null,
    };
  }
  if (boss.killed) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'killed',
      guild: guildInfo,
      state: boss,
      hit: null,
    };
  }
  if (boss.hitsLeft <= 0) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'no-hits',
      guild: guildInfo,
      state: boss,
      hit: null,
    };
  }
  if (boss.cooldownRemain > 0) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'cooldown',
      guild: guildInfo,
      state: boss,
      hit: null,
    };
  }

  const response = await game.guildBossBattle(token);
  const code = num(response?.Result);
  const error = response?.Error || null;

  if (code !== 1) {
    const after = await readGuildBoss(game, token, guildInfo, { withRank: false });
    return {
      ok: false,
      code,
      error,
      stopReason: guildStopReason(response),
      guild: guildInfo,
      state: after.boss || boss,
      hit: null,
    };
  }

  const dame = num(response?.Dame) ?? 0;
  const hitsLeft = num(response?.HitsLeft);
  const hpAfterHit = num(response?.HP);
  const hitsDropped = hitsLeft !== null && hitsLeft < boss.hitsLeft;
  const hpDropped = hpAfterHit !== null && hpAfterHit < boss.hp;

  if (dame <= 0 || (!hitsDropped && !hpDropped)) {
    const after = await readGuildBoss(game, token, guildInfo, { withRank: false });
    return {
      ok: false,
      code,
      error,
      stopReason: 'unverified',
      guild: guildInfo,
      state: after.boss || boss,
      hit: null,
    };
  }

  const after = await readGuildBoss(game, token, guildInfo, { withRank: false });
  const state = after.boss || boss;

  let stopReason = null;
  if (state?.killed || num(response?.Killed) === 1) {
    stopReason = 'killed';
  } else if (state?.hitsLeft <= 0) {
    stopReason = 'no-hits';
  }

  return {
    ok: true,
    code,
    error,
    stopReason,
    guild: guildInfo,
    state,
    hit: {
      dame,
      hp: hpAfterHit ?? state?.hp ?? 0,
      maxHp: num(response?.MaxHP) ?? state?.maxHp ?? 0,
      hitsLeft: hitsLeft ?? state?.hitsLeft ?? 0,
      cooldownRemain: num(response?.CooldownRemain) ?? state?.cooldownRemain ?? 0,
      killed: num(response?.Killed) === 1 || Boolean(state?.killed),
      drops: response?.Drops || '',
      guildExp: num(response?.GuildExp) ?? 0,
      contribution: num(response?.Contribution) ?? 0,
      guildLv: num(response?.GuildLv) ?? state?.guildLv ?? 0,
      levelUp: num(response?.LevelUp) === 1,
      battleId: num(response?.Id),
    },
  };
}

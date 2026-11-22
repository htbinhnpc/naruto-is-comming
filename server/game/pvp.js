import { setTimeout as delay } from 'node:timers/promises';

import { isFatalGameError } from './client.js';

/**
 * Doc trang thai PvP (Dau Rank + Cuop vang) va danh tung tran.
 *
 * An toan:
 *  - Moi request chi danh 1 tran, khong giu request dai.
 *  - Chi chon doi thu co lực chiến thap hon minh (scout qua P3TeamVisit).
 *  - Khong mua BP bang Kim cuong, khong tieu Kim cuong.
 *  - Xac thuc thang/thua bang /battle/9vs9/log (Win).
 */

const READ_GAP_MS = 130;
const POWER_CACHE_MS = 5 * 60 * 1000;
const RANK_MAX_BATTLES = 5;
const PLUNDER_MAX_BATTLES = 10;
const MAX_BATTLES = 10;
const PLUNDER_WINS_PER_TARGET = 3;

const powerCache = new Map();
const ownPowerCache = new Map();
const OWN_POWER_CACHE_MS = 15 * 1000;

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

function assetId(path) {
  const text = String(path || '').trim();
  if (!text) return null;
  const parts = text.split('/');
  return parts[parts.length - 1] || null;
}

function imageUrl(folder, path) {
  const id = assetId(path);
  return id ? `/assets/${folder}/${id}.png` : null;
}

function clampBattles(value, max = MAX_BATTLES) {
  const battles = Math.trunc(num(value) ?? 1);
  return Math.min(max, Math.max(1, battles));
}

async function readProcedure(game, token, procedure, kind = 'row', params = {}) {
  try {
    return await game.sql(token, procedure, kind, params);
  } catch (error) {
    if (isFatalGameError(error)) throw error;
    return null;
  }
}

function cacheKey(accountId, userId) {
  return `${accountId}:${userId}`;
}

function cachedPower(accountId, userId) {
  const entry = powerCache.get(cacheKey(accountId, userId));
  if (!entry) return null;
  if (Date.now() - entry.at > POWER_CACHE_MS) {
    powerCache.delete(cacheKey(accountId, userId));
    return null;
  }
  return entry.power;
}

function rememberPower(accountId, userId, power) {
  if (power === null || power === undefined) return;
  powerCache.set(cacheKey(accountId, userId), { power, at: Date.now() });
}

async function readOwnPower(game, token, accountId) {
  const entry = ownPowerCache.get(accountId);
  if (entry && Date.now() - entry.at < OWN_POWER_CACHE_MS) return entry.power;

  const row = asRow(await readProcedure(game, token, 'P3TeamPower'));
  const power = num(row?.Power);
  if (power !== null) ownPowerCache.set(accountId, { power, at: Date.now() });
  return power;
}

/** Lực chiến của một đội = tổng (TotalAtk + TotalDef) các slot có ninja. */
async function scoutPower(game, token, accountId, userId) {
  const id = num(userId);
  if (!Number.isInteger(id) || id <= 0) return null;

  const cached = cachedPower(accountId, id);
  if (cached !== null) return cached;

  const rows = asRows(
    await readProcedure(game, token, 'P3TeamVisit', 'table', { TargetUserId: id }),
  );
  const filled = rows.filter((row) => num(row?.NinjaId) !== null);
  if (filled.length === 0) return null;

  const power = filled.reduce(
    (sum, row) => sum + (num(row.TotalAtk) ?? 0) + (num(row.TotalDef) ?? 0),
    0,
  );
  rememberPower(accountId, id, power);
  return power;
}

function normalizeTeamImages(row) {
  return [row.Img1, row.Img2, row.Img3].map((path) => imageUrl('ninja-head', path));
}

function normalizeRankRow(row, { withTeam = true } = {}) {
  if (!row) return null;
  return {
    rankNo: num(row.RankNo) ?? 0,
    userId: num(row.UserId),
    isBot: num(row.IsBot) === 1,
    name: row.Name || '—',
    level: num(row.Lv) ?? 0,
    vip: num(row.Vip) ?? 0,
    images: withTeam ? normalizeTeamImages(row) : [],
    stars: withTeam ? [num(row.Star1), num(row.Star2), num(row.Star3)] : [],
    tiers: withTeam ? [num(row.Tier1), num(row.Tier2), num(row.Tier3)] : [],
    attrs: withTeam ? [num(row.Attr1), num(row.Attr2), num(row.Attr3)] : [],
    power: cachedPower(row.__accountId, row.UserId),
    isMe: Boolean(row.__isMe),
  };
}

function normalizePlunderTarget(row) {
  if (!row) return null;
  return {
    grp: num(row.Grp) ?? 1,
    userId: num(row.UserId),
    name: row.Name || '—',
    level: num(row.Lv) ?? 0,
    gold: num(row.Gold) ?? 0,
    images: normalizeTeamImages(row),
    stars: [num(row.Star1), num(row.Star2), num(row.Star3)],
    tiers: [num(row.Tier1), num(row.Tier2), num(row.Tier3)],
    attrs: [num(row.Attr1), num(row.Attr2), num(row.Attr3)],
    power: cachedPower(row.__accountId, row.UserId),
  };
}

function findOwnRank(rows, ownId, ownName) {
  for (const row of rows) {
    if (ownId !== null && num(row.UserId) === ownId) return num(row.RankNo);
    if (ownName && String(row.Name || '').trim() === ownName) return num(row.RankNo);
  }
  return null;
}

/** P2RankList la danh sach cac hang phia tren; neu khong co chinh minh thi suy ra hang ke tiep. */
function inferOwnRank(rows, ownId, ownName) {
  const direct = findOwnRank(rows, ownId, ownName);
  if (direct !== null) return direct;
  const rankNos = rows.map((row) => num(row.RankNo)).filter((value) => value !== null);
  if (rankNos.length === 0) return null;
  return Math.max(...rankNos) + 1;
}

function playerFrom(main, stamina) {
  return {
    name: main?.Name ? String(main.Name) : '',
    level: num(main?.Lv) ?? 0,
    gold: num(main?.Gold) ?? 0,
    diamond: num(main?.Diamond) ?? 0,
    bp: num(stamina?.BP ?? main?.BP) ?? 0,
    bpMax: num(stamina?.BpMax ?? main?.BpCap) ?? 0,
    bpUsed: num(stamina?.BpUsed) ?? 0,
    bpLimit: num(stamina?.BpLimit) ?? 0,
  };
}

async function readCore(game, token, accountId) {
  const info = asRow(await readProcedure(game, token, 'P2Info'));
  await delay(READ_GAP_MS);
  const main = asRow(await readProcedure(game, token, 'P4MainLoad'));
  await delay(READ_GAP_MS);
  const stamina = asRow(await readProcedure(game, token, 'P4StaminaStatus'));
  await delay(READ_GAP_MS);
  const ownPower = await readOwnPower(game, token, accountId);

  const ownId = num(info?.Id);
  const ownName = String(main?.Name || info?.Name || '').trim();

  return {
    ownId,
    ownName,
    ownPower,
    player: playerFrom(main, stamina),
    info,
  };
}

async function readRankRows(game, token, accountId, ownId, ownName) {
  const rows = asRows(await readProcedure(game, token, 'P2RankList', 'table'));
  await delay(READ_GAP_MS);
  const top = asRows(await readProcedure(game, token, 'P2RankTop20', 'table'));

  const mark = (row) => ({
    ...row,
    __accountId: accountId,
    __isMe:
      (ownId !== null && num(row.UserId) === ownId) ||
      (ownName && String(row.Name || '').trim() === ownName),
  });

  const list = rows.map((row) => normalizeRankRow(mark(row))).filter(Boolean);
  const topList = top.map((row) => normalizeRankRow(mark(row), { withTeam: false })).filter(Boolean);
  const ownRank = inferOwnRank(rows, ownId, ownName);

  return { list, top: topList, ownRank };
}

async function readPlunder(game, token, accountId) {
  // plunder-list tra ve mang long: [ [target,...], [target,...] ].
  const payload = await game.plunderList(token);
  await delay(READ_GAP_MS);
  const topRows = asRows(
    await readProcedure(game, token, 'P2PlunderTop20', 'table'),
  );

  const groups = asRows(payload).map((group, index) => {
    const rows = Array.isArray(group)
      ? group
      : asRows(group?.Rows ?? group?.Targets ?? group?.List ?? group);
    return {
      grp: num(group?.Grp) ?? index + 1,
      targets: rows
        .map((row) => normalizePlunderTarget({ ...row, __accountId: accountId }))
        .filter(Boolean),
    };
  });

  const top = topRows.map((row) => ({
    userId: num(row.UserId),
    name: row.Name || '—',
    totalGold: num(row.TotalGold) ?? 0,
    vip: num(row.Vip) ?? 0,
  }));

  return { groups, top };
}

export async function readPvpState(game, token, { accountId }) {
  const core = await readCore(game, token, accountId);
  const rank = await readRankRows(game, token, accountId, core.ownId, core.ownName);
  const plunder = await readPlunder(game, token, accountId);

  return {
    player: core.player,
    ownPower: core.ownPower,
    rank,
    plunder,
    readAt: new Date().toISOString(),
  };
}

async function scanRankCandidates(game, token, accountId, core, rank, battles) {
  const ownRank = rank.ownRank;
  const ownPower = core.ownPower;

  const rows = rank.list
    .filter((row) => row.userId !== null && row.userId !== core.ownId)
    .filter((row) => (ownRank === null ? true : row.rankNo < ownRank))
    .sort((a, b) => b.rankNo - a.rankNo);

  const candidates = [];
  const skipped = [];

  for (const row of rows) {
    if (candidates.length >= battles) break;
    const power = await scoutPower(game, token, accountId, row.userId);
    await delay(READ_GAP_MS);
    row.power = power;

    if (power === null) {
      skipped.push({ ...row, reason: 'unknown-power' });
      continue;
    }
    if (ownPower === null || power >= ownPower) {
      skipped.push({ ...row, reason: 'stronger' });
      continue;
    }
    candidates.push({ ...row, reason: null });
  }

  return { candidates, skipped, ownRank, ownPower };
}

export async function planRankBattles(game, token, { accountId, battles }) {
  const limit = clampBattles(battles, RANK_MAX_BATTLES);
  const core = await readCore(game, token, accountId);
  const rank = await readRankRows(game, token, accountId, core.ownId, core.ownName);

  if (core.player.bp <= 0) {
    return {
      ok: false,
      stopReason: 'no-bp',
      ownRank: rank.ownRank,
      ownPower: core.ownPower,
      bp: core.player.bp,
      candidates: [],
      skipped: [],
    };
  }

  if (core.ownPower === null) {
    return {
      ok: false,
      stopReason: 'unknown-power',
      ownRank: rank.ownRank,
      ownPower: null,
      bp: core.player.bp,
      candidates: [],
      skipped: [],
    };
  }

  const plan = await scanRankCandidates(game, token, accountId, core, rank, limit);
  const maxBattles = Math.min(limit, core.player.bp, plan.candidates.length);
  const candidates = plan.candidates.slice(0, maxBattles);

  return {
    ok: candidates.length > 0,
    stopReason:
      candidates.length === 0
        ? rank.ownRank === null
          ? 'no-rank'
          : 'no-candidates'
        : null,
    ownRank: rank.ownRank,
    ownPower: core.ownPower,
    bp: core.player.bp,
    candidates,
    skipped: plan.skipped,
  };
}

export async function planPlunderBattles(game, token, { accountId, battles }) {
  const limit = clampBattles(battles, PLUNDER_MAX_BATTLES);
  const core = await readCore(game, token, accountId);
  const plunder = await readPlunder(game, token, accountId);

  if (core.player.bp <= 0) {
    return {
      ok: false,
      stopReason: 'no-bp',
      ownPower: core.ownPower,
      bp: core.player.bp,
      candidates: [],
      skipped: [],
    };
  }

  if (core.ownPower === null) {
    return {
      ok: false,
      stopReason: 'unknown-power',
      ownPower: null,
      bp: core.player.bp,
      candidates: [],
      skipped: [],
    };
  }

  const targets = plunder.groups
    .flatMap((group) => group.targets)
    .filter((target) => target.userId !== null)
    .sort((a, b) => b.gold - a.gold);

  const candidates = [];
  const skipped = [];

  for (const target of targets) {
    if (candidates.length >= limit) break;
    const power = await scoutPower(game, token, accountId, target.userId);
    await delay(READ_GAP_MS);
    target.power = power;

    if (power === null) {
      skipped.push({ ...target, reason: 'unknown-power' });
      continue;
    }
    if (power >= core.ownPower) {
      skipped.push({ ...target, reason: 'stronger' });
      continue;
    }
    candidates.push({ ...target, reason: null, wins: 0 });
  }

  const maxBattles = Math.min(limit, core.player.bp, candidates.length);
  const planned = candidates.slice(0, maxBattles);

  return {
    ok: planned.length > 0,
    stopReason: planned.length === 0 ? 'no-candidates' : null,
    ownPower: core.ownPower,
    bp: core.player.bp,
    candidates: planned,
    skipped,
  };
}

function mapBattleError(error) {
  const text = String(error || '').trim();
  if (!text) return null;
  const lower = text.toLowerCase();
  if (lower === 'nobp') return 'no-bp';
  if (lower === 'notarget') return 'no-target';
  if (lower === 'nogold') return 'no-gold';
  if (lower === 'locked') return 'low-level';
  if (lower === 'lowlevel' || lower.includes('low level')) return 'low-level';
  if (lower === 'noninja') return 'no-ninja';
  return `error:${text}`;
}

async function verifyBattle(game, token, id) {
  try {
    const log = asRow(await game.battleLog(token, id));
    if (!log || num(log.Result) !== 1) return null;
    return num(log.Win) === 1 || log.Win === true;
  } catch (error) {
    if (isFatalGameError(error)) throw error;
    return null;
  }
}

async function runBattle(game, token, accountId, { targetRankNo, targetUserId, targetName, mode }) {
  const ownPower = await readOwnPower(game, token, accountId);
  const targetPower = await scoutPower(game, token, accountId, targetUserId);

  if (ownPower === null || targetPower === null) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'unknown-power',
      battle: {
        mode,
        targetUserId: num(targetUserId),
        targetRankNo: num(targetRankNo),
        targetName: targetName || '',
        targetPower,
        ownPower,
      },
    };
  }

  if (targetPower >= ownPower) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'stronger',
      battle: {
        mode,
        targetUserId: num(targetUserId),
        targetRankNo: num(targetRankNo),
        targetName: targetName || '',
        targetPower,
        ownPower,
      },
    };
  }

  const payload = mode === 'rank'
    ? await game.rankBattle(token, targetRankNo)
    : await game.plunderBattle(token, targetUserId);

  const errorText = payload?.Error || null;
  const id = num(payload?.Id);

  if (errorText) {
    return {
      ok: false,
      code: null,
      error: errorText,
      stopReason: mapBattleError(errorText),
      battle: {
        mode,
        id: null,
        targetUserId: num(targetUserId),
        targetRankNo: num(targetRankNo),
        targetName: targetName || '',
        targetPower,
        ownPower,
      },
    };
  }

  if (id === null) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'unverified',
      battle: {
        mode,
        id: null,
        targetUserId: num(targetUserId),
        targetRankNo: num(targetRankNo),
        targetName: targetName || '',
        targetPower,
        ownPower,
      },
    };
  }

  const win = await verifyBattle(game, token, id);
  if (win === null) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'unverified',
      battle: {
        mode,
        id,
        win: null,
        expGained: num(payload?.ExpGained) ?? 0,
        levelUp: num(payload?.LevelUp) ?? 0,
        keyItem: num(payload?.KeyItem) ?? 0,
        keyName: payload?.KeyName || null,
        targetUserId: num(targetUserId),
        targetRankNo: num(targetRankNo),
        targetName: targetName || '',
        targetPower,
        ownPower,
      },
    };
  }

  return {
    ok: win,
    code: null,
    error: null,
    stopReason: win ? null : 'loss',
    battle: {
      mode,
      id,
      win,
      expGained: num(payload?.ExpGained) ?? 0,
      levelUp: num(payload?.LevelUp) ?? 0,
      keyItem: num(payload?.KeyItem) ?? 0,
      keyName: payload?.KeyName || null,
      goldWon: num(payload?.GoldWon),
      targetUserId: num(targetUserId),
      targetRankNo: num(targetRankNo),
      targetName: targetName || '',
      targetPower,
      ownPower,
    },
  };
}

async function resolveRankTarget(game, token, targetRankNo, expectedUserId) {
  const rows = asRows(await readProcedure(game, token, 'P2RankList', 'table'));
  const row = rows.find((item) => num(item.RankNo) === targetRankNo);
  if (!row) return null;
  const userId = num(row.UserId);
  if (userId === null) return null;
  // Hang co the doi chu sau mot tran thang; khong danh nham nguoi khac.
  if (expectedUserId !== null && userId !== expectedUserId) return null;
  return { userId, name: row.Name || '', rankNo: targetRankNo };
}

async function resolvePlunderTarget(game, token, targetUserId) {
  const payload = await game.plunderList(token);
  const rows = asRows(payload).flatMap((group) =>
    Array.isArray(group) ? group : asRows(group?.Rows ?? group?.Targets ?? group?.List ?? group),
  );
  const row = rows.find((item) => num(item.UserId) === targetUserId);
  if (!row) return null;
  return { userId: targetUserId, name: row.Name || '' };
}

export async function battleRank(game, token, { accountId, targetRankNo, targetUserId }) {
  const rankNo = num(targetRankNo);
  if (!Number.isInteger(rankNo) || rankNo <= 0) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'no-target',
      battle: null,
    };
  }

  const target = await resolveRankTarget(game, token, rankNo, num(targetUserId));
  if (!target) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'no-target',
      battle: {
        mode: 'rank',
        targetRankNo: rankNo,
        targetUserId: null,
        targetName: '',
        targetPower: null,
        ownPower: null,
      },
    };
  }

  return runBattle(game, token, accountId, {
    mode: 'rank',
    targetRankNo: rankNo,
    targetUserId: target.userId,
    targetName: target.name,
  });
}

export async function battlePlunder(game, token, { accountId, targetUserId }) {
  const userId = num(targetUserId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'no-target',
      battle: null,
    };
  }

  const target = await resolvePlunderTarget(game, token, userId);
  if (!target) {
    return {
      ok: false,
      code: null,
      error: null,
      stopReason: 'no-target',
      battle: {
        mode: 'plunder',
        targetUserId: userId,
        targetName: '',
        targetPower: null,
        ownPower: null,
      },
    };
  }

  return runBattle(game, token, accountId, {
    mode: 'plunder',
    targetUserId: userId,
    targetName: target.name,
  });
}

export const PVP_LIMITS = {
  MAX_BATTLES,
  PLUNDER_WINS_PER_TARGET,
};

import { setTimeout as delay } from 'node:timers/promises';

import { GameApiError, isFatalGameError } from './client.js';

/**
 * Doc va chay cot truyen.
 *
 * An toan:
 *  - Khong mua Energy, khong tieu Kim cuong.
 *  - Chi dung vat pham hoi Energy co san trong tui (UseType = 3).
 *  - Moi tran deu xac thuc thang/thua bang /battle/9vs9/log.
 *  - maxRuns = 0 nghia la khong gioi han, chi dung khi het Energy / item / gap loi.
 */

const CATALOG_TTL_MS = 10 * 60 * 1000;
const READ_GAP_MS = 130;
const RUN_GAP_MS = 350;
const CHUNK_RUNS = 5;
const MAX_CHUNK_RUNS = 10;
const KNOWN_ENERGY_GAINS = new Map([
  [13, 60],
  [7, 20],
]);

// So do thuc te tu tai lieu gameplay (tai khoan thu nghiem), chi de goi y
// truoc khi tai khoan hien tai co mau do rieng.
const REFERENCE_EXP_PER_ENERGY = new Map([
  [4, 16.6],
  [149, 2.6],
]);

let catalogCache = null;
let catalogCachedAt = 0;

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

async function readProcedure(game, token, procedure, kind = 'row', params = {}) {
  try {
    return await game.sql(token, procedure, kind, params);
  } catch (error) {
    if (isFatalGameError(error)) throw error;
    return null;
  }
}

function normalizeStage(row, task) {
  const scid = num(row?.Scid);
  if (!scid) return null;

  const chapter = num(row?.Chapter) ?? 0;
  const stageNo = num(row?.StageNo) ?? 0;

  return {
    scid,
    task,
    chapter,
    chapterName: row?.ChapterNameVi || row?.ChapterName || `Chương ${chapter}`,
    chapterNameEn: row?.ChapterName || null,
    stageNo,
    info: row?.InfoVi || row?.Info || '',
    energy: Math.max(0, num(row?.Energy) ?? 0),
    exp: Math.max(0, num(row?.Exp) ?? 0),
    gold: Math.max(0, num(row?.Gold) ?? 0),
    isBoss: num(row?.IsBoss) === 1,
  };
}

export async function loadStoryCatalog(game, token, { force = false } = {}) {
  if (!force && catalogCache && Date.now() - catalogCachedAt < CATALOG_TTL_MS) {
    return catalogCache;
  }

  const stages = [];
  for (let task = 1; task <= 6; task += 1) {
    const rows = await readProcedure(game, token, 'P3StageList', 'table', { Task: task });
    if (!Array.isArray(rows)) {
      throw new GameApiError('Không đọc được danh sách cốt truyện.', {
        statusCode: 502,
        code: 'STORY_CATALOG',
      });
    }
    for (const row of rows) {
      const stage = normalizeStage(row, task);
      if (stage) stages.push(stage);
    }
    if (task < 6) await delay(READ_GAP_MS);
  }

  stages.sort((a, b) => a.scid - b.scid);
  catalogCache = stages;
  catalogCachedAt = Date.now();
  return stages;
}

function normalizeProgress(row) {
  return {
    scid: num(row?.Scid) ?? 0,
    task: num(row?.Task) ?? 0,
    chapter: num(row?.Chapter) ?? 0,
    stageNo: num(row?.StageNo) ?? 0,
    maxScid: num(row?.MaxScid) ?? 0,
  };
}

async function readProgress(game, token) {
  const row = asRow(await readProcedure(game, token, 'P2StageProgress', 'row'));
  return normalizeProgress(row);
}

async function readVitals(game, token) {
  const main = asRow(await readProcedure(game, token, 'P4MainLoad', 'row'));
  await delay(READ_GAP_MS);
  const stamina = asRow(await readProcedure(game, token, 'P4StaminaStatus', 'row'));

  return {
    level: num(main?.Lv) ?? 0,
    exp: num(main?.LvExp) ?? 0,
    expMax: num(main?.LvFullExp) ?? 0,
    gold: num(main?.Gold) ?? 0,
    diamond: num(main?.Diamond) ?? 0,
    energy: num(main?.Energy) ?? num(stamina?.Energy) ?? 0,
    energyMax: num(main?.EnergyCap) ?? num(stamina?.EnergyMax) ?? 0,
    energyUsed: num(stamina?.EnergyUsed) ?? 0,
    energyLimit: num(stamina?.EnergyLimit) ?? 0,
    bp: num(main?.BP) ?? num(stamina?.BP) ?? 0,
    bpMax: num(main?.BpCap) ?? num(stamina?.BpMax) ?? 0,
  };
}

function normalizeEnergyItem(row) {
  const id = num(row?.Id ?? row?.Item ?? row?.ItemId);
  const quantity = num(row?.Quantity ?? row?.Qty);
  if (!id || !quantity || quantity <= 0) return null;

  return {
    id,
    name: row?.Name2 || row?.Name || `Vật phẩm ${id}`,
    nameEn: row?.Name || null,
    img: row?.Img || null,
    icon: row?.Img ? `/assets/item/${String(row.Img).split('/').pop()}.png` : null,
    quantity,
    knownGain: KNOWN_ENERGY_GAINS.get(id) ?? num(row?.Gain),
  };
}

async function readBagItemRows(game, token) {
  if (typeof game.sqlDataset === 'function') {
    try {
      const sets = await game.sqlDataset(token, 'P4BagItem');
      if (Array.isArray(sets)) {
        return sets.flatMap((set) => asRows(set));
      }
      return asRows(sets);
    } catch (error) {
      if (isFatalGameError(error)) throw error;
    }
  }
  return asRows(await readProcedure(game, token, 'P4BagItem', 'table'));
}

async function readEnergyItems(game, token) {
  const rows = await readBagItemRows(game, token);
  return rows
    .filter((row) => num(row?.UseType) === 3)
    .map(normalizeEnergyItem)
    .filter(Boolean);
}

function goldPerEnergy(stage) {
  return stage.energy > 0 ? stage.gold / stage.energy : 0;
}

function expPerEnergy(stage) {
  return stage.energy > 0 ? stage.exp / stage.energy : 0;
}

function isSaneGold(stage) {
  const ratio = goldPerEnergy(stage);
  return ratio >= 120 && ratio <= 180;
}

function stageSummary(stage, { source, expRate, goldRate, samples = 0, winRate = null }) {
  return {
    scid: stage.scid,
    task: stage.task,
    chapter: stage.chapter,
    chapterName: stage.chapterName,
    stageNo: stage.stageNo,
    energy: stage.energy,
    exp: stage.exp,
    gold: stage.gold,
    isBoss: stage.isBoss,
    source,
    samples,
    expPerEnergy: expRate === null ? null : Number(expRate.toFixed(2)),
    goldPerEnergy: goldRate === null ? null : Number(goldRate.toFixed(2)),
    winRate: winRate === null ? null : Number(winRate.toFixed(2)),
  };
}

export function buildStorySuggestions({ stages, progress, stageStats = [] }) {
  const currentScid = progress?.scid ?? 0;
  const cleared = stages.filter((stage) => stage.scid < currentScid);
  const current = stages.find((stage) => stage.scid === currentScid) || null;

  const statsByScid = new Map();
  for (const row of stageStats) {
    const scid = num(row?.scid);
    if (!scid) continue;
    statsByScid.set(scid, row);
  }

  const measured = [];
  for (const stage of cleared) {
    const stats = statsByScid.get(stage.scid);
    const energySum = num(stats?.energySum) ?? 0;
    const expSum = num(stats?.expSum) ?? 0;
    const runs = num(stats?.runs) ?? 0;
    const wins = num(stats?.wins) ?? 0;

    if (runs > 0 && energySum > 0 && expSum > 0) {
      measured.push(
        stageSummary(stage, {
          source: 'measured',
          expRate: expSum / energySum,
          goldRate: goldPerEnergy(stage),
          samples: runs,
          winRate: runs > 0 ? wins / runs : null,
        }),
      );
      continue;
    }

    const reference = REFERENCE_EXP_PER_ENERGY.get(stage.scid);
    if (reference) {
      measured.push(
        stageSummary(stage, {
          source: 'reference',
          expRate: reference,
          goldRate: goldPerEnergy(stage),
          samples: 1,
        }),
      );
    }
  }

  measured.sort((a, b) => (b.expPerEnergy ?? 0) - (a.expPerEnergy ?? 0));

  const measuredIds = new Set(measured.map((item) => item.scid));
  const catalogExp = cleared
    .filter((stage) => !measuredIds.has(stage.scid) && isSaneGold(stage))
    .map((stage) =>
      stageSummary(stage, {
        source: 'catalog',
        expRate: expPerEnergy(stage),
        goldRate: goldPerEnergy(stage),
      }),
    )
    .sort((a, b) => (b.expPerEnergy ?? 0) - (a.expPerEnergy ?? 0));

  const exp = [...measured, ...catalogExp].slice(0, 3);

  const gold = cleared
    .filter(isSaneGold)
    .sort((a, b) => b.scid - a.scid)
    .slice(0, 3)
    .map((stage) =>
      stageSummary(stage, {
        source: 'catalog',
        expRate: expPerEnergy(stage),
        goldRate: goldPerEnergy(stage),
      }),
    );

  const maxExp = Math.max(1, ...[...measured, ...catalogExp].map((item) => item.expPerEnergy ?? 0));
  const balanced = [...measured, ...catalogExp]
    .map((item) => {
      const expScore = (item.expPerEnergy ?? 0) / maxExp;
      const goldScore = Math.min(1, (item.goldPerEnergy ?? 0) / 180);
      return { ...item, score: expScore * 0.6 + goldScore * 0.4 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const warnings = cleared
    .filter((stage) => !isSaneGold(stage))
    .slice(0, 6)
    .map((stage) => ({
      scid: stage.scid,
      chapter: stage.chapter,
      stageNo: stage.stageNo,
      reason: 'gold-outlier',
      goldPerEnergy: Number(goldPerEnergy(stage).toFixed(2)),
    }));

  return {
    current: current
      ? stageSummary(current, {
          source: 'current',
          expRate: expPerEnergy(current),
          goldRate: goldPerEnergy(current),
        })
      : null,
    exp,
    gold,
    balanced,
    warnings,
  };
}

export async function readStoryState(game, token, { stageStats = [] } = {}) {
  const progress = await readProgress(game, token);
  await delay(READ_GAP_MS);

  const vitals = await readVitals(game, token);
  await delay(READ_GAP_MS);

  const energyItems = await readEnergyItems(game, token);
  await delay(READ_GAP_MS);

  const powerRow = asRow(await readProcedure(game, token, 'P3TeamPower', 'row'));
  const power = num(powerRow?.Power) ?? num(powerRow?.TeamPower) ?? null;

  const stages = await loadStoryCatalog(game, token);
  const suggestions = buildStorySuggestions({ stages, progress, stageStats });

  return {
    progress,
    vitals: { ...vitals, power },
    energyItems,
    stages,
    suggestions,
    readAt: new Date().toISOString(),
  };
}

function mapBattleError(error) {
  const map = {
    NoEnergy: 'energy',
    Locked: 'locked',
    NoNinja: 'no-ninja',
    Closed: 'closed',
    BadParam: 'bad-param',
  };
  return map[error] || `error:${error || 'unknown'}`;
}

function computeExpGain(before, after) {
  if (after.level === before.level) {
    return Math.max(0, after.exp - before.exp);
  }
  if (after.level === before.level + 1) {
    const remaining = Math.max(0, before.expMax - before.exp);
    return remaining + Math.max(0, after.exp);
  }
  return null;
}

async function waitBattleLog(game, token, id) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const log = asRow(await game.battleLog(token, id));
    if (log && num(log.Result) === 1) return log;
    if (attempt < 2) await delay(250);
  }
  return null;
}

function chooseEnergyItem(items, deficit) {
  const known = items
    .filter((item) => Number.isFinite(item.knownGain) && item.knownGain > 0)
    .sort((a, b) => a.knownGain - b.knownGain);

  const covers = known.find((item) => item.knownGain >= deficit);
  if (covers) return covers;
  if (known.length > 0) return known[known.length - 1];
  return items[0] || null;
}

async function refillEnergy({ game, token, vitals, cost, items, itemsUsed }) {
  let current = vitals;
  let available = items;
  const used = [];

  while (current.energy < cost) {
    if (current.energyLimit > 0 && current.energyUsed >= current.energyLimit) {
      return { ok: false, reason: 'item-cap', vitals: current, itemsUsed: used };
    }

    if (!available.length) {
      available = await readEnergyItems(game, token);
      if (!available.length) {
        return { ok: false, reason: 'no-items', vitals: current, itemsUsed: used };
      }
    }

    const deficit = cost - current.energy;
    const item = chooseEnergyItem(available, deficit);
    if (!item) {
      return { ok: false, reason: 'no-items', vitals: current, itemsUsed: used };
    }

    const beforeEnergy = current.energy;
    const response = await game.useItem(token, item.id, 1);
    const row = Array.isArray(response) ? response[0] : response;
    const result = num(row?.Result);

    if (result === 6) {
      return { ok: false, reason: 'item-cap', vitals: current, itemsUsed: used };
    }
    if (result !== 1) {
      return { ok: false, reason: 'item-error', vitals: current, itemsUsed: used };
    }

    const gained = num(row?.Gained) ?? 0;
    const quantity = num(row?.Quantity) ?? 1;
    used.push({
      id: item.id,
      name: item.name,
      quantity,
      gained,
    });
    itemsUsed.push(used[used.length - 1]);

    available = await readEnergyItems(game, token);
    current = await readVitals(game, token);

    if (current.energy <= beforeEnergy && gained <= 0) {
      return { ok: false, reason: 'item-no-effect', vitals: current, itemsUsed: used };
    }
  }

  return { ok: true, vitals: current, itemsUsed: used };
}

function stagePayload(stage) {
  if (!stage) return null;
  return {
    scid: stage.scid,
    task: stage.task,
    chapter: stage.chapter,
    chapterName: stage.chapterName,
    stageNo: stage.stageNo,
    energy: stage.energy,
    exp: stage.exp,
    gold: stage.gold,
    isBoss: stage.isBoss,
  };
}

export async function runStoryBatch(
  game,
  token,
  { mode = 'farm', scid = 0, maxRuns = 0, useEnergyItems = false, chunkRuns = CHUNK_RUNS } = {},
) {
  const normalizedMode = mode === 'push' ? 'push' : 'farm';
  const runLimit = Math.max(0, Math.trunc(Number(maxRuns) || 0));
  const chunkLimit = Math.min(
    MAX_CHUNK_RUNS,
    Math.max(1, Math.trunc(Number(chunkRuns) || CHUNK_RUNS)),
  );

  const stages = await loadStoryCatalog(game, token);
  let progress = await readProgress(game, token);
  await delay(READ_GAP_MS);

  let vitals = await readVitals(game, token);
  await delay(READ_GAP_MS);

  let energyItems = await readEnergyItems(game, token);

  let fixedStage = null;
  if (normalizedMode === 'farm') {
    const wanted = Math.trunc(Number(scid) || 0);
    if (wanted <= 0 || wanted >= progress.scid) {
      throw new GameApiError('Chỉ có thể cày lại stage đã qua.', {
        statusCode: 400,
        code: 'STORY_STAGE',
      });
    }
    fixedStage = stages.find((stage) => stage.scid === wanted) || null;
    if (!fixedStage) {
      throw new GameApiError('Không tìm thấy stage đã chọn.', {
        statusCode: 400,
        code: 'STORY_STAGE',
      });
    }
  } else if (!stages.some((stage) => stage.scid === progress.scid)) {
    throw new GameApiError('Không đọc được stage hiện tại của cốt truyện.', {
      statusCode: 502,
      code: 'STORY_STAGE',
    });
  }

  const battles = [];
  const itemsUsed = [];
  const samples = [];
  const startVitals = vitals;
  let stopReason = null;

  for (let index = 0; index < chunkLimit; index += 1) {
    if (runLimit > 0 && battles.length >= runLimit) {
      stopReason = 'max-runs';
      break;
    }

    let stage = fixedStage;
    if (normalizedMode === 'push') {
      stage = stages.find((entry) => entry.scid === progress.scid) || null;
      if (!stage) {
        stopReason = 'stage-missing';
        break;
      }
    }
    if (!stage) {
      stopReason = 'stage-missing';
      break;
    }

    const cost = stage.energy;
    if (cost <= 0) {
      stopReason = 'bad-stage';
      break;
    }

    if (vitals.energy < cost) {
      if (!useEnergyItems) {
        stopReason = 'energy';
        break;
      }
      const refill = await refillEnergy({
        game,
        token,
        vitals,
        cost,
        items: energyItems,
        itemsUsed,
      });
      vitals = refill.vitals;
      if (!refill.ok) {
        stopReason = refill.reason;
        break;
      }
      energyItems = await readEnergyItems(game, token);
    }

    const response = await game.battle(token, {
      opponentId: stage.scid,
      isBot: true,
    });
    const battleId = num(response?.Id);

    if (!battleId) {
      stopReason = mapBattleError(response?.Error);
      break;
    }

    const log = await waitBattleLog(game, token, battleId);
    if (!log) {
      battles.push({
        index: battles.length + 1,
        scid: stage.scid,
        chapter: stage.chapter,
        stageNo: stage.stageNo,
        win: null,
        error: 'unverified',
        battleId,
      });
      stopReason = 'unverified';
      break;
    }

    const win = log.Win === true || num(log.Win) === 1;
    const before = vitals;
    const after = await readVitals(game, token);
    const expGain = computeExpGain(before, after);
    const goldGain = Math.max(0, after.gold - before.gold);

    battles.push({
      index: battles.length + 1,
      scid: stage.scid,
      chapter: stage.chapter,
      stageNo: stage.stageNo,
      energy: cost,
      win,
      expGained: expGain,
      goldGained: goldGain,
      levelUp: Math.max(0, after.level - before.level),
      energyAfter: after.energy,
      battleId,
    });

    if (expGain !== null) {
      samples.push({
        scid: stage.scid,
        energy: cost,
        exp: expGain,
        gold: goldGain,
        won: win,
      });
    }

    vitals = after;

    if (!win) {
      stopReason = 'loss';
      break;
    }

    if (normalizedMode === 'push') {
      const nextProgress = await readProgress(game, token);
      if (nextProgress.scid <= progress.scid) {
        stopReason = 'progress-stalled';
        break;
      }
      progress = nextProgress;
    }

    if (runLimit > 0 && battles.length >= runLimit) {
      stopReason = 'max-runs';
      break;
    }

    if (index < chunkLimit - 1) await delay(RUN_GAP_MS);
  }

  const nextStage =
    normalizedMode === 'push'
      ? stages.find((stage) => stage.scid === progress.scid) || null
      : fixedStage;
  const nextCost = nextStage?.energy ?? Infinity;
  const canRefill =
    useEnergyItems &&
    (vitals.energyLimit <= 0 || vitals.energyUsed < vitals.energyLimit) &&
    energyItems.length > 0;
  const hasMore =
    !stopReason &&
    battles.length >= chunkLimit &&
    (runLimit === 0 || battles.length < runLimit) &&
    (vitals.energy >= nextCost || canRefill);

  const wins = battles.filter((battle) => battle.win === true).length;
  const summary = {
    runs: battles.length,
    wins,
    losses: battles.filter((battle) => battle.win === false).length,
    exp: battles.reduce((sum, battle) => sum + (battle.expGained ?? 0), 0),
    gold: battles.reduce((sum, battle) => sum + (battle.goldGained ?? 0), 0),
    levelUps: Math.max(0, vitals.level - startVitals.level),
    energySpent: battles.reduce((sum, battle) => sum + (battle.energy ?? 0), 0),
    itemsUsed: itemsUsed.length,
    itemEnergy: itemsUsed.reduce((sum, item) => sum + (item.gained ?? 0), 0),
  };

  return {
    mode: normalizedMode,
    battles,
    itemsUsed,
    samples,
    state: {
      energy: vitals.energy,
      energyMax: vitals.energyMax,
      energyUsed: vitals.energyUsed,
      energyLimit: vitals.energyLimit,
      gold: vitals.gold,
      diamond: vitals.diamond,
      level: vitals.level,
      exp: vitals.exp,
      expMax: vitals.expMax,
      progress,
      stage: stagePayload(nextStage),
    },
    hasMore,
    stopReason,
    summary,
  };
}

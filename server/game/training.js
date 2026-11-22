import { setTimeout as delay } from 'node:timers/promises';

import { GameApiError, isFatalGameError } from './client.js';

/**
 * Doc va chay dong huan luyen + Thu thach toi thuong.
 *
 * An toan:
 *  - Khong mua luot, khong tieu Kim cuong.
 *  - Chi chay khi cave dang mo va con luot.
 *  - Doc lai P4TrainStatus / P4UltimateStatus sau moi tran.
 *  - Dung ngay khi thua, het luot, gap Pending hoac loi.
 */

const READ_GAP_MS = 130;
const RUN_GAP_MS = 350;

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

function normalizeCave(row) {
  const cave = num(row?.Cave);
  if (!cave) return null;

  const runsMaxMode = Math.max(0, num(row?.RunsMaxMode) ?? 3);
  const usedAtk = Math.max(0, num(row?.RunsUsedAtk) ?? 0);
  const usedDef = Math.max(0, num(row?.RunsUsedDef) ?? 0);

  return {
    cave,
    name: row?.Name0 || row?.Name || `Động ${cave}`,
    nameEn: row?.Name || null,
    info: row?.Info0 || row?.Info || '',
    openDays: row?.OpenDays || '',
    img: row?.Img || null,
    icon: row?.Img ? `/assets/train/${String(row.Img).split('/').pop()}.png` : null,
    elements: CAVE_ELEMENTS[cave] || [],
    open: num(row?.IsOpen) === 1,
    runsUsed: Math.max(0, num(row?.RunsUsed) ?? 0),
    runsMax: Math.max(0, num(row?.RunsMax) ?? 6),
    runsMaxMode,
    runsUsedAtk: usedAtk,
    runsUsedDef: usedDef,
    runsLeftAtk: Math.max(0, runsMaxMode - usedAtk),
    runsLeftDef: Math.max(0, runsMaxMode - usedDef),
    debuffPct: num(row?.DebuffPct) ?? 50,
    debuffPctSuper: num(row?.DebuffPctSuper) ?? 30,
    debuffPctKage: num(row?.DebuffPctKage) ?? 10,
    itemId: num(row?.ItemId),
  };
}

function normalizeCaveStage(row) {
  const tier = num(row?.Tier ?? row?.Level ?? row?.TierNo);
  const stageNo = num(row?.StageNo ?? row?.Stage ?? row?.No);
  const gold = num(row?.Gold ?? row?.RewardGold);
  const itemId = num(row?.ItemId ?? row?.RewardItem);
  const itemQty = num(row?.ItemQty ?? row?.RewardQty ?? row?.Qty);

  return {
    tier: tier ?? 0,
    stageNo: stageNo ?? 0,
    name: row?.Name2 || row?.Name || `Tầng ${stageNo ?? '?'}`,
    gold,
    itemId,
    itemQty,
    runnable: Number.isInteger(tier) && Number.isInteger(stageNo),
  };
}

function normalizeUltimate(row) {
  if (!row) return null;
  return {
    mode: num(row.Mode) ?? 0,
    stage: Math.max(0, num(row.StageNo) ?? 0),
    nextStage: Math.max(1, num(row.NextStage) ?? 1),
    runsLeft: Math.max(0, num(row.RunsLeft) ?? 0),
    inRun: num(row.InRun) === 1,
    stars: Math.max(0, num(row.Star) ?? 0),
    starEarned: Math.max(0, num(row.StarEarned) ?? 0),
    starMax: Math.max(0, num(row.StarMax) ?? 0),
    maxStage: Math.max(0, num(row.MaxStage) ?? 0),
    stagesWon: Math.max(0, num(row.StagesWon) ?? 0),
    pendingBuff: num(row.PendingBuff) === 1,
    pendingReward: num(row.PendingReward) === 1,
    myRank: Math.max(0, num(row.MyRank) ?? 0),
    myCount: Math.max(0, num(row.MyCount) ?? 0),
  };
}

function normalizeBuff(row) {
  if (!row || typeof row !== 'object') return null;
  return {
    id: num(row.Id ?? row.BuffId),
    name: row.Name2 || row.Name || row.BuffName || null,
    stat: row.Stat || row.Type || null,
    level: num(row.Lv ?? row.Level),
    value: num(row.Value ?? row.Pct),
    raw: row,
  };
}

async function readCaves(game, token) {
  const rows = asRows(await readProcedure(game, token, 'P4TrainStatus', 'table'));
  const caves = rows.map(normalizeCave).filter(Boolean);

  for (const cave of caves) {
    if (!cave.open) {
      cave.stages = [];
      cave.eligible = false;
      continue;
    }

    const stageRows = asRows(
      await readProcedure(game, token, 'P3TrainStageList', 'table', { Cave: cave.cave }),
    );
    cave.stages = stageRows.map(normalizeCaveStage).filter(Boolean);
    cave.eligible = cave.stages.length > 0;
    await delay(READ_GAP_MS);
  }

  return caves;
}

/** Doc nhanh danh sach dong huan luyen (khong keo theo Ultimate). */
export async function readTrainingCaves(game, token) {
  return readCaves(game, token);
}

async function readUltimateMode(game, token, mode) {
  const status = asRow(
    await readProcedure(game, token, 'P4UltimateStatus', 'row', { Mode: mode }),
  );
  await delay(READ_GAP_MS);

  const buffRows = asRows(
    await readProcedure(game, token, 'P3UltimateBuffList', 'table', { Mode: mode }),
  );
  await delay(READ_GAP_MS);

  return {
    status: normalizeUltimate(status),
    buffs: buffRows.map(normalizeBuff).filter(Boolean),
  };
}

export async function readTrainingState(game, token) {
  const main = asRow(await readProcedure(game, token, 'P4MainLoad', 'row'));
  await delay(READ_GAP_MS);

  const caves = await readCaves(game, token);
  const atk = await readUltimateMode(game, token, 1);
  const def = await readUltimateMode(game, token, 2);

  return {
    player: {
      level: num(main?.Lv) ?? 0,
      energy: num(main?.Energy) ?? 0,
      energyMax: num(main?.EnergyCap) ?? 0,
      gold: num(main?.Gold) ?? 0,
      diamond: num(main?.Diamond) ?? 0,
    },
    caves,
    ultimate: {
      atk: atk.status,
      def: def.status,
      buffsAtk: atk.buffs,
      buffsDef: def.buffs,
    },
    readAt: new Date().toISOString(),
  };
}

function mapTrainError(error) {
  const map = {
    NoRun: 'no-run',
    Closed: 'closed',
    LowLevel: 'low-level',
    BadParam: 'bad-param',
  };
  return map[error] || `error:${error || 'unknown'}`;
}

function mapUltimateError(error) {
  const map = {
    NoRun: 'no-run',
    Pending: 'pending',
    LowLevel: 'low-level',
    BadParam: 'bad-param',
  };
  return map[error] || `error:${error || 'unknown'}`;
}

export async function runCaveBatch(
  game,
  token,
  { cave = 0, mode = 1, tier = 0, stageNo = 0, maxRuns = 0 } = {},
) {
  const caveId = Math.trunc(Number(cave) || 0);
  const runMode = Number(mode) === 2 ? 2 : 1;
  const tierValue = Math.trunc(Number(tier) || 0);
  const stageValue = Math.trunc(Number(stageNo) || 0);
  const runLimit = Math.max(0, Math.trunc(Number(maxRuns) || 0));

  if (caveId < 1 || caveId > 3) {
    throw new GameApiError('Động không hợp lệ.', { statusCode: 400, code: 'TRAIN_CAVE' });
  }
  if (tierValue < 0 || stageValue < 0) {
    throw new GameApiError('Tầng huấn luyện không hợp lệ.', {
      statusCode: 400,
      code: 'TRAIN_STAGE',
    });
  }

  let caves = await readCaves(game, token);
  let target = caves.find((entry) => entry.cave === caveId);
  if (!target) {
    throw new GameApiError('Không tìm thấy động đã chọn.', {
      statusCode: 400,
      code: 'TRAIN_CAVE',
    });
  }
  if (!target.open) {
    throw new GameApiError('Động này đang đóng hôm nay.', {
      statusCode: 400,
      code: 'TRAIN_CLOSED',
    });
  }

  const used = runMode === 1 ? target.runsUsedAtk : target.runsUsedDef;
  const left = Math.max(0, target.runsMaxMode - used);
  if (left <= 0) {
    throw new GameApiError('Đã hết lượt huấn luyện cho chế độ này.', {
      statusCode: 400,
      code: 'TRAIN_NO_RUN',
    });
  }

  const limit = runLimit === 0 ? left : Math.min(runLimit, left);
  const battles = [];
  let stopReason = null;

  for (let index = 0; index < limit; index += 1) {
    const response = await game.trainBattle(token, {
      cave: caveId,
      tier: tierValue,
      mode: runMode,
      stageNo: stageValue,
    });
    const result = num(response?.Result);
    const error = response?.Error || null;

    if (result !== 1) {
      stopReason = mapTrainError(error);
      break;
    }

    const win = num(response?.Win) === 1;
    battles.push({
      index: battles.length + 1,
      tier: tierValue,
      stageNo: stageValue,
      win,
      gold: num(response?.Gold) ?? 0,
      itemId: num(response?.ItemId),
      itemQty: num(response?.ItemQty) ?? 0,
      battleId: num(response?.Id),
      maxStage: num(response?.MaxStage),
    });

    caves = await readCaves(game, token);
    target = caves.find((entry) => entry.cave === caveId) || target;

    if (!win) {
      stopReason = 'loss';
      break;
    }

    if (index < limit - 1) await delay(RUN_GAP_MS);
  }

  const usedAfter = runMode === 1 ? target.runsUsedAtk : target.runsUsedDef;
  if (!stopReason && usedAfter >= target.runsMaxMode) stopReason = 'no-run';

  return {
    cave: caveId,
    mode: runMode,
    battles,
    state: { caves },
    hasMore: false,
    stopReason,
    summary: {
      runs: battles.length,
      wins: battles.filter((battle) => battle.win).length,
      losses: battles.filter((battle) => !battle.win).length,
      gold: battles.reduce((sum, battle) => sum + (battle.gold ?? 0), 0),
      items: battles.reduce((sum, battle) => sum + (battle.itemQty ?? 0), 0),
    },
  };
}

export async function runUltimateBatch(
  game,
  token,
  { mode = 1, maxRuns = 0, star = 1 } = {},
) {
  const runMode = Number(mode) === 2 ? 2 : 1;
  const runLimit = Math.max(0, Math.trunc(Number(maxRuns) || 0));

  let data = await readUltimateMode(game, token, runMode);
  let status = data.status;
  if (!status) {
    throw new GameApiError('Không đọc được trạng thái Thử thách tối thượng.', {
      statusCode: 502,
      code: 'ULTIMATE_STATE',
    });
  }
  if (status.pendingBuff || status.pendingReward) {
    throw new GameApiError('Cần nhận buff/reward đang chờ trước khi chạy tiếp.', {
      statusCode: 400,
      code: 'ULTIMATE_PENDING',
    });
  }
  if (status.runsLeft <= 0) {
    throw new GameApiError('Đã hết lượt Thử thách tối thượng cho chế độ này.', {
      statusCode: 400,
      code: 'ULTIMATE_NO_RUN',
    });
  }

  const maxStar = status.starMax > 0 ? status.starMax : Math.max(1, status.stars);
  const starValue = Math.min(maxStar, Math.max(1, Math.trunc(Number(star) || 1)));
  const limit = runLimit === 0 ? status.runsLeft : Math.min(runLimit, status.runsLeft);
  const battles = [];
  let stopReason = null;

  for (let index = 0; index < limit; index += 1) {
    const stageNo = status.nextStage || status.stage + 1;
    if (!stageNo || stageNo <= 0) {
      stopReason = 'stage-missing';
      break;
    }

    const response = await game.ultimateBattle(token, {
      mode: runMode,
      stageNo,
      star: starValue,
    });
    const result = num(response?.Result);
    const error = response?.Error || null;

    if (result !== 1) {
      stopReason = mapUltimateError(error);
      break;
    }

    const battleId = num(response?.Id);
    let win = null;
    if (battleId) {
      const log = asRow(await game.battleLog(token, battleId));
      win = log ? log.Win === true || num(log.Win) === 1 : null;
    }

    data = await readUltimateMode(game, token, runMode);
    status = data.status;

    battles.push({
      index: battles.length + 1,
      stageNo,
      star: starValue,
      win,
      gold: num(response?.Gold) ?? 0,
      battleId,
      stageAfter: status?.stage ?? stageNo,
      pendingBuff: Boolean(status?.pendingBuff),
      pendingReward: Boolean(status?.pendingReward),
    });

    if (win === null) {
      stopReason = 'unverified';
      break;
    }
    if (!win) {
      stopReason = 'loss';
      break;
    }
    if (status?.pendingBuff || status?.pendingReward) {
      stopReason = 'pending';
      break;
    }
    if (!status || status.runsLeft <= 0) {
      stopReason = 'no-run';
      break;
    }

    if (index < limit - 1) await delay(RUN_GAP_MS);
  }

  return {
    mode: runMode,
    battles,
    state: {
      status,
      buffs: data.buffs,
    },
    hasMore: false,
    stopReason,
    summary: {
      runs: battles.length,
      wins: battles.filter((battle) => battle.win).length,
      losses: battles.filter((battle) => battle.win === false).length,
      gold: battles.reduce((sum, battle) => sum + (battle.gold ?? 0), 0),
      pending: battles.filter(
        (battle) => battle.pendingBuff || battle.pendingReward,
      ).length,
    },
  };
}

export async function claimUltimate(game, token, { mode = 1, kind = 'reward' } = {}) {
  const runMode = Number(mode) === 2 ? 2 : 1;
  const claimKind = kind === 'buff' ? 'buff' : 'reward';

  const response =
    claimKind === 'buff'
      ? await game.sql(token, 'P1UltimateBuyBuff', 'row', { Mode: runMode })
      : await game.sql(token, 'P2UltimateClaim', 'row', { Mode: runMode });

  await delay(READ_GAP_MS);
  const data = await readUltimateMode(game, token, runMode);

  const result = asRow(response);
  const code = num(result?.Result);
  const ok = claimKind === 'buff' ? code === 1 : code === 1;

  return {
    kind: claimKind,
    mode: runMode,
    ok,
    code,
    response: result,
    state: {
      status: data.status,
      buffs: data.buffs,
    },
  };
}

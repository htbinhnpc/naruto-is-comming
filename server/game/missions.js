import { setTimeout as delay } from 'node:timers/promises';

import { isFatalGameError } from './client.js';
import { runStoryBatch } from './story.js';
import { battlePlunder, planPlunderBattles } from './pvp.js';
import {
  claimUltimate,
  readTrainingCaves,
  runCaveBatch,
  runUltimateBatch,
} from './training.js';
import { hitBeastBoss, hitGuildBoss } from './boss.js';

/**
 * Doc va tu hoan thanh nhiem vu hang ngay.
 *
 * Nguyen tac:
 *  - Khong doan "5 tran cot truyen": moi nhiem vu tu khai bao Action / ten /
 *    Count / Target / Pct, module doc roi quyet dinh can lam gi va bao nhieu.
 *  - Chi chay cac hanh dong an toan, khong tieu Kim cuong, khong nap tien.
 *  - Nhiem vu nao khong hieu ro (hoac can nap/upgrade ton vat pham) thi bo qua
 *    va ghi ly do, khong doan bua.
 *  - Sau moi loai hanh dong, doc lai P3MissionList de xac nhan tien do thuc te.
 */

const READ_GAP_MS = 150;
const MAX_RUNS_PER_TASK = 10;
const MAX_TASKS_PER_CALL = 6;

/** Cac loai nhiem vu bot duoc phep tu lam. */
const SAFE_KINDS = new Set([
  'checkin',
  'story',
  'levelup',
  'plunder',
  'ultimate',
  'train',
  'boss',
  'turnplate',
]);

const KIND_LABELS = {
  checkin: 'điểm danh',
  story: 'đi cốt truyện',
  levelup: 'lên cấp (đi cốt truyện)',
  plunder: 'cướp vàng',
  ultimate: 'Thử thách tối thượng',
  train: 'huấn luyện',
  boss: 'đánh boss',
  turnplate: 'quay vòng quay miễn phí',
  upgrade_ninja: 'nâng cấp ninja',
  upgrade_equipment: 'nâng cấp trang bị',
  recharge: 'nạp tiền',
  unknown: 'không rõ',
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

/** Bo dau tieng Viet de so khop ten nhiem vu on dinh hon. */
function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function goalFromName(name) {
  const text = normalizeText(name);
  const match =
    text.match(/(\d+)\s*(lan|tran|times?|days?|ngay)/) ||
    text.match(/(?:to|len cap|cap do)\s*(\d+)/);
  return match ? Number(match[1]) : null;
}

function missionPeriod(row) {
  const period = num(row?.Period);
  // Mock cu va mot so ban ghi co the khong tra Period; coi la nhiem vu ngay.
  return period === null || period === 0 ? 1 : period;
}

/**
 * Tien do cua nhiem vu.
 *
 * P3MissionList tra Count / Target / Pct. Thu tu y nghia cua Count va Target
 * chua duoc tai lieu hoa ro rang, nen dung ca hai theo huong an toan:
 *   goal = max(Count, Target), done = min(Count, Target)
 * Neu Pct co mat thi uu tien Pct de tinh tien do.
 */
export function missionProgress(row) {
  const state = num(row?.State) ?? 0;
  const count = num(row?.Count);
  const target = num(row?.Target);
  const pct = num(row?.Pct);

  let goal = null;
  let done = null;

  if (count !== null && target !== null) {
    goal = Math.max(count, target);
    done = Math.min(count, target);
  } else if (target !== null) {
    goal = target;
    done = count ?? 0;
  } else if (count !== null) {
    goal = count;
    done = 0;
  }

  if (goal === null) goal = goalFromName(row?.Name);

  if (goal !== null && goal > 0 && pct !== null) {
    done = Math.round((Math.min(100, Math.max(0, pct)) / 100) * goal);
  }

  const ready = state === 1;
  const claimed = state === 2 || state === 3;
  const remaining =
    ready || claimed
      ? 0
      : goal === null || goal <= 0
        ? 1
        : Math.max(0, goal - (done ?? 0));

  return {
    goal,
    done,
    pct,
    remaining,
    state,
    ready,
    claimed,
  };
}

/** Xac dinh loai hanh dong can lam tu Action / ten / GoScene. */
export function classifyMission(row) {
  const action = normalizeText(row?.Action);
  const scene = normalizeText(row?.GoScene);
  const name = normalizeText(row?.Name);
  const text = `${action} ${scene} ${name}`;

  if (/recharge|nap tien|top ?up/.test(text)) return 'recharge';
  if (/upgrade.*(equip|trang bi)|(equip|trang bi).*upgrade/.test(text)) {
    return 'upgrade_equipment';
  }
  if (/upgrade.*(ninja|nhan vat)|(ninja|nhan vat).*upgrade|nang cap ninja/.test(text)) {
    return 'upgrade_ninja';
  }
  if (/check[ _-]?in|diem danh/.test(text)) return 'checkin';
  if (/turnplate|vong quay|spin/.test(text)) return 'turnplate';
  if (/ultimate|toi thuong/.test(text)) return 'ultimate';
  if (/plunder|cuop/.test(text)) return 'plunder';
  if (/boss/.test(text)) return 'boss';
  if (/train|huan luyen/.test(text)) return 'train';
  if (/level[ _-]?up|len cap|cap do/.test(text)) return 'levelup';
  if (/plot|cot truyen|story/.test(text)) return 'story';
  if (/atk.*def|cong.*thu/.test(text)) return 'unknown';

  return 'unknown';
}

export function normalizeMission(row) {
  const id = num(row?.Id);
  if (id === null) return null;

  const progress = missionProgress(row);
  const kind = classifyMission(row);

  return {
    id,
    period: missionPeriod(row),
    name: row?.Name || `Nhiệm vụ ${id}`,
    action: row?.Action || null,
    goScene: row?.GoScene || null,
    kind,
    kindLabel: KIND_LABELS[kind] || kind,
    safe: SAFE_KINDS.has(kind),
    reward: row?.RewardName || null,
    rewardQty: num(row?.RewardQty),
    ...progress,
  };
}

function compactMission(mission) {
  return {
    id: mission.id,
    name: mission.name,
    kind: mission.kind,
    period: mission.period,
    goal: mission.goal,
    done: mission.done,
    remaining: mission.remaining,
    state: mission.state,
    reward: mission.reward,
  };
}

/**
 * Doc danh sach nhiem vu va chia thanh:
 *  - missions: tat ca nhiem vu da chuan hoa
 *  - actionable: nhiem vu dang lam duoc va bot duoc phep lam
 *  - skipped: nhiem vu bi bo qua kem ly do
 */
export function analyzeMissions(rows, { allowKinds = null, periods = [1, 2, 3] } = {}) {
  const missions = asRows(rows).map(normalizeMission).filter(Boolean);
  const actionable = [];
  const skipped = [];

  for (const mission of missions) {
    if (mission.claimed) continue;
    if (mission.ready) continue;
    if (!periods.includes(mission.period)) continue;
    if (mission.remaining <= 0) continue;

    if (!mission.safe) {
      skipped.push({ ...compactMission(mission), reason: 'unsafe' });
      continue;
    }
    if (allowKinds && !allowKinds.has(mission.kind)) {
      skipped.push({ ...compactMission(mission), reason: 'disabled' });
      continue;
    }

    actionable.push(mission);
  }

  return { missions, actionable, skipped };
}

/**
 * Gop cac nhiem vu cung loai thanh mot tac vu. Vi du hai nhiem vu "Plot 10"
 * va "Plot 50" chi can chay mot loat tran voi so tran lon nhat con thieu.
 */
export function groupMissionTasks(actionable) {
  const groups = new Map();

  for (const mission of actionable) {
    const key = `${mission.kind}:${mission.period}`;
    const current = groups.get(key);
    if (!current) {
      groups.set(key, {
        key,
        kind: mission.kind,
        period: mission.period,
        label: KIND_LABELS[mission.kind] || mission.kind,
        remaining: mission.remaining,
        goal: mission.goal,
        missions: [compactMission(mission)],
      });
      continue;
    }

    current.remaining = Math.max(current.remaining, mission.remaining);
    current.goal = Math.max(current.goal ?? 0, mission.goal ?? 0);
    current.missions.push(compactMission(mission));
  }

  // Uu tien nhiem vu ngay (Period 1), roi moi den tuan/thang.
  return [...groups.values()].sort(
    (a, b) => (a.period ?? 0) - (b.period ?? 0) || a.remaining - b.remaining,
  );
}

export async function readMissionRows(game, token) {
  try {
    return asRows(await game.sql(token, 'P3MissionList', 'table'));
  } catch (error) {
    if (isFatalGameError(error)) throw error;
    return [];
  }
}

async function runCheckin(game, token) {
  const response = await game.sql(token, 'P0GiftDayCheckIn', 'row');
  const result = asRow(response);
  const code =
    num(result?.Result) ??
    num(result?.P0GiftDayCheckIn) ??
    (Object.values(result || {}).find((value) => num(value) !== null) ?? null);
  const ok = code === null ? true : code !== 0;

  return {
    ok,
    runs: ok ? 1 : 0,
    stopReason: ok ? null : 'already-checked',
    message: ok ? 'Điểm danh xong.' : 'Hôm nay đã điểm danh.',
  };
}

async function runStory(game, token, { maxRuns }) {
  const target = Math.max(1, Math.min(MAX_RUNS_PER_TASK, maxRuns));
  let runs = 0;
  let wins = 0;
  let stopReason = null;

  // runStoryBatch chi chay mot chunk (toi da 5 tran), nen lap tiep cho du
  // so tran nhiem vu can, dung lai khi het Energy / gap tuong / loi.
  while (runs < target) {
    const batch = await runStoryBatch(game, token, {
      mode: 'push',
      maxRuns: target - runs,
    });
    const batchRuns = batch.summary?.runs || 0;
    runs += batchRuns;
    wins += batch.summary?.wins || 0;

    if (batchRuns === 0) {
      stopReason = batch.stopReason || 'no-run';
      break;
    }
    if (!batch.hasMore) {
      stopReason = batch.stopReason || 'done';
      break;
    }
    await delay(READ_GAP_MS);
  }

  // Neu day cot truyen bi tuong/da thua, cay lai stage da qua de hoan thanh
  // nhiem vu "Plot N lan" thay vi bo do.
  const wallReasons = new Set([
    'progress-stalled',
    'loss',
    'unverified',
    'bad-stage',
    'stage-missing',
    'locked',
  ]);
  if (runs < target && wallReasons.has(stopReason)) {
    try {
      const progress = asRow(await game.sql(token, 'P2StageProgress', 'row'));
      const scid = num(progress?.Scid);
      if (scid && scid > 1) {
        const farm = await runStoryBatch(game, token, {
          mode: 'farm',
          scid: scid - 1,
          maxRuns: target - runs,
        });
        const farmRuns = farm.summary?.runs || 0;
        runs += farmRuns;
        wins += farm.summary?.wins || 0;
        if (farmRuns > 0) stopReason = farm.stopReason || null;
      }
    } catch (error) {
      if (isFatalGameError(error)) throw error;
    }
  }

  return {
    ok: runs > 0,
    runs,
    wins,
    stopReason,
    message:
      runs > 0
        ? `Cốt truyện: ${runs} trận (${wins} thắng).`
        : `Không đi được cốt truyện${stopReason ? ` (${stopReason})` : ''}.`,
  };
}

async function runPlunder(game, token, { accountId, maxRuns }) {
  if (!accountId) {
    return {
      ok: false,
      runs: 0,
      stopReason: 'missing-account',
      message: 'Thiếu accountId để cướp vàng.',
    };
  }

  const plan = await planPlunderBattles(game, token, {
    accountId,
    battles: Math.max(1, Math.min(MAX_RUNS_PER_TASK, maxRuns)),
  });

  if (!plan.ok) {
    return {
      ok: false,
      runs: 0,
      stopReason: plan.stopReason || 'no-target',
      message: `Không có mục tiêu cướp vàng (${plan.stopReason || 'no-target'}).`,
    };
  }

  let attempts = 0;
  let wins = 0;
  let stopReason = null;

  for (const target of plan.candidates) {
    if (attempts >= maxRuns) break;

    const result = await battlePlunder(game, token, {
      accountId,
      targetUserId: target.userId,
    });
    attempts += 1;
    if (result.ok) wins += 1;

    if (!result.ok) {
      stopReason = result.stopReason || 'battle-failed';
      if (['no-bp', 'no-target', 'no-gold'].includes(stopReason)) break;
    }

    if (attempts < maxRuns) await delay(READ_GAP_MS + 60);
  }

  return {
    ok: attempts > 0,
    runs: attempts,
    wins,
    stopReason,
    message:
      attempts > 0
        ? `Cướp vàng: ${attempts} trận (${wins} thắng).`
        : 'Không đánh được trận cướp vàng nào.',
  };
}

async function runUltimate(game, token, { maxRuns }) {
  let runs = 0;
  let stopReason = null;

  for (const mode of [1, 2]) {
    if (runs >= maxRuns) break;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const batch = await runUltimateBatch(game, token, {
          mode,
          maxRuns: Math.max(1, Math.min(MAX_RUNS_PER_TASK, maxRuns - runs)),
        });
        runs += batch.summary?.runs || 0;
        if (batch.stopReason) stopReason = batch.stopReason;
        break;
      } catch (error) {
        if (isFatalGameError(error)) throw error;

        // Ultimate chan tiep khi co buff/reward cho; nhan roi thu lai mot lan.
        if (error.code === 'ULTIMATE_PENDING' && attempt === 0) {
          await claimUltimate(game, token, { mode, kind: 'buff' });
          await claimUltimate(game, token, { mode, kind: 'reward' });
          continue;
        }

        stopReason = error.code || error.message;
        break;
      }
    }
  }

  return {
    ok: runs > 0,
    runs,
    stopReason: runs > 0 ? stopReason : stopReason || 'no-run',
    message:
      runs > 0
        ? `Thử thách tối thượng: ${runs} trận.`
        : `Không chạy được Thử thách tối thượng (${stopReason || 'no-run'}).`,
  };
}

async function runTraining(game, token, { maxRuns }) {
  const caves = await readTrainingCaves(game, token);
  const usable = caves.filter(
    (entry) =>
      entry.open &&
      (entry.stages || []).some((stage) => stage.runnable) &&
      (entry.runsLeftAtk > 0 || entry.runsLeftDef > 0),
  );
  const cave =
    usable.find((entry) => entry.runsLeftAtk > 0) ||
    usable.find((entry) => entry.runsLeftDef > 0);

  if (!cave) {
    return {
      ok: false,
      runs: 0,
      stopReason: 'no-run',
      message: 'Hết lượt huấn luyện hôm nay.',
    };
  }

  const mode = cave.runsLeftAtk > 0 ? 1 : 2;
  const stage = [...(cave.stages || [])].reverse().find((entry) => entry.runnable);

  const batch = await runCaveBatch(game, token, {
    cave: cave.cave,
    mode,
    tier: stage?.tier ?? 0,
    stageNo: stage?.stageNo ?? 0,
    maxRuns: Math.max(1, Math.min(MAX_RUNS_PER_TASK, maxRuns)),
  });
  const runs = batch.summary?.runs || 0;

  return {
    ok: runs > 0,
    runs,
    stopReason: batch.stopReason || (runs === 0 ? 'no-run' : null),
    message:
      runs > 0
        ? `Huấn luyện: ${runs} trận (${batch.summary?.wins || 0} thắng).`
        : `Không chạy được huấn luyện (${batch.stopReason || 'no-run'}).`,
  };
}

async function runBoss(game, token) {
  const beast = await hitBeastBoss(game, token);
  if (beast.ok) {
    return {
      ok: true,
      runs: 1,
      stopReason: null,
      message: `Vĩ Thú: 1 hit · ${beast.hit?.damage ?? 0} sát thương.`,
    };
  }

  const guild = await hitGuildBoss(game, token);
  if (guild.ok) {
    return {
      ok: true,
      runs: 1,
      stopReason: null,
      message: `Guild Boss: 1 hit · ${guild.hit?.damage ?? 0} sát thương.`,
    };
  }

  return {
    ok: false,
    runs: 0,
    stopReason: beast.stopReason || guild.stopReason || 'unavailable',
    message: `Boss chưa đánh được (${beast.stopReason || guild.stopReason || 'unavailable'}).`,
  };
}

async function runTurnplate(game, token, { maxRuns }) {
  const status = asRow(await game.sql(token, 'P2TurnplateStatus', 'row'));
  const free = num(status?.FreeCount) ?? 0;
  if (free <= 0) {
    return {
      ok: false,
      runs: 0,
      stopReason: 'no-free-spin',
      message: 'Không còn lượt quay miễn phí.',
    };
  }

  const times = Math.max(1, Math.min(free, maxRuns));
  const result = asRow(
    await game.sql(token, 'P1TurnplateSpin', 'row', { Times: times }),
  );
  const ok = (num(result?.Result) ?? 0) !== 0;

  return {
    ok,
    runs: ok ? times : 0,
    stopReason: ok ? null : 'spin-failed',
    message: ok
      ? `Vòng quay: ${times} lượt miễn phí.`
      : 'Không quay được vòng quay miễn phí.',
  };
}

async function runMissionTask(game, token, task, options) {
  switch (task.kind) {
    case 'checkin':
      return runCheckin(game, token);
    case 'story':
    case 'levelup':
      return runStory(game, token, options);
    case 'plunder':
      return runPlunder(game, token, options);
    case 'ultimate':
      return runUltimate(game, token, options);
    case 'train':
      return runTraining(game, token, options);
    case 'boss':
      return runBoss(game, token, options);
    case 'turnplate':
      return runTurnplate(game, token, options);
    default:
      return {
        ok: false,
        runs: 0,
        stopReason: 'unsupported',
        message: `Chưa hỗ trợ nhiệm vụ ${task.kind}.`,
      };
  }
}

function budgetFor(kind, budgets) {
  if (kind === 'story' || kind === 'levelup') return budgets.story;
  if (kind === 'plunder') return budgets.plunder;
  return undefined;
}

/**
 * Tu dong hoan thanh cac nhiem vu dang lam duoc.
 *
 * @param {object} game
 * @param {string} token
 * @param {object} options
 * @param {number} [options.accountId]
 * @param {boolean} [options.dryRun]
 * @param {Set<string>|null} [options.allowKinds]
 * @param {number} [options.maxTasks]
 * @param {number} [options.maxRunsPerTask]
 * @param {{story?: number, plunder?: number}} [options.budgets]
 */
export async function completeMissions(
  game,
  token,
  {
    accountId = null,
    dryRun = false,
    allowKinds = null,
    maxTasks = MAX_TASKS_PER_CALL,
    maxRunsPerTask = MAX_RUNS_PER_TASK,
    budgets = {},
  } = {},
) {
  const initialRows = await readMissionRows(game, token);
  const initial = analyzeMissions(initialRows, { allowKinds });
  const tasks = groupMissionTasks(initial.actionable);

  const summary = {
    readAt: new Date().toISOString(),
    total: initial.missions.length,
    actionable: initial.actionable.map(compactMission),
    skipped: initial.skipped,
    tasks: [],
    dryRun,
  };

  if (dryRun) {
    summary.planned = [];
    for (const task of tasks) {
      const budget = budgetFor(task.kind, budgets);
      if (budget !== undefined && budget <= 0) {
        summary.skipped.push({
          kind: task.kind,
          name: task.label,
          reason: 'budget',
          remaining: task.remaining,
        });
        continue;
      }
      summary.planned.push({
        kind: task.kind,
        label: task.label,
        remaining: task.remaining,
        missions: task.missions,
      });
    }
    return summary;
  }

  let rows = initialRows;
  let ran = 0;

  for (const task of tasks) {
    if (ran >= maxTasks) break;

    const latest = analyzeMissions(rows, { allowKinds });
    const live = groupMissionTasks(latest.actionable).find(
      (entry) => entry.key === task.key,
    );
    if (!live) continue;

    const budget = budgetFor(live.kind, budgets);
    const limit = Math.max(
      0,
      Math.min(
        maxRunsPerTask,
        live.remaining,
        budget === undefined ? maxRunsPerTask : budget,
      ),
    );

    if (limit <= 0) {
      summary.skipped.push({
        kind: live.kind,
        name: live.label,
        reason: 'budget',
        remaining: live.remaining,
      });
      continue;
    }

    let result;
    try {
      result = await runMissionTask(game, token, live, {
        accountId,
        maxRuns: limit,
      });
    } catch (error) {
      if (isFatalGameError(error)) throw error;
      result = {
        ok: false,
        runs: 0,
        stopReason: error.code || 'error',
        message: error.message,
      };
    }

    rows = await readMissionRows(game, token);
    const after = analyzeMissions(rows, { allowKinds });
    const sameKind = after.actionable.filter(
      (mission) => mission.kind === live.kind && mission.period === live.period,
    );
    const remainingAfter =
      sameKind.length === 0
        ? 0
        : Math.min(...sameKind.map((mission) => mission.remaining));
    const progressed = remainingAfter < live.remaining;

    summary.tasks.push({
      kind: live.kind,
      period: live.period,
      label: live.label,
      need: live.remaining,
      runs: result.runs || 0,
      wins: result.wins ?? null,
      ok: Boolean(result.ok),
      progressed,
      stopReason: result.stopReason || null,
      message: result.message,
      remainingAfter,
    });

    ran += 1;
    await delay(READ_GAP_MS);
  }

  const final = analyzeMissions(rows, { allowKinds });
  summary.after = final.actionable.map(compactMission);
  summary.remaining = final.actionable.length;

  const skipped = new Map();
  for (const entry of [...summary.skipped, ...final.skipped]) {
    const key = `${entry.id ?? entry.kind}:${entry.reason}`;
    if (!skipped.has(key)) skipped.set(key, entry);
  }
  summary.skipped = [...skipped.values()];

  return summary;
}

export function describeMissionSummary(summary) {
  if (!summary) return 'Không đọc được nhiệm vụ.';

  const parts = [];
  if (summary.tasks?.length) {
    const done = summary.tasks.filter((task) => task.progressed).length;
    const runs = summary.tasks.reduce((sum, task) => sum + (task.runs || 0), 0);
    parts.push(
      `${done}/${summary.tasks.length} nhóm nhiệm vụ tiến triển (${runs} lượt hành động)`,
    );
  }
  if (summary.remaining > 0) parts.push(`còn ${summary.remaining} nhiệm vụ`);
  if (summary.skipped?.length) parts.push(`${summary.skipped.length} mục bỏ qua`);

  return parts.length > 0 ? parts.join(', ') : 'Không có nhiệm vụ cần làm.';
}

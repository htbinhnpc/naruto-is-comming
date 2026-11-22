import { claimAllDaily } from './daily.js';
import { completeMissions, describeMissionSummary } from './missions.js';
import { runStoryBatch } from './story.js';
import { hitBeastBoss, hitGuildBoss } from './boss.js';
import { battleRank, planRankBattles } from './pvp.js';
import { readAdvisorAccount } from './advisor.js';
import { formatRunLog } from './runlog.js';

/**
 * Bot engine: vong lap don gian, tuan tu, co ngan sach.
 *
 * - Chi tac dong tai khoan dang bat Auto, dang active va con phien.
 * - Mac dinh dry-run: chi doc va bao viec se lam, khong goi lenh thay doi.
 * - Moi chu ky chay toi da `maxActions` hanh dong, moi hanh dong cach nhau
 *   mot khoang nghi de giam tai server.
 * - Loi lien tiep 5 lan se treo tai khoan do, khong retry mu quang.
 */

const TICK_MS = 5000;
const MAX_EVENTS = 80;
const MAX_FAILURES = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function jitter(ms, spread = 0.25) {
  const delta = ms * spread;
  return Math.max(1000, Math.round(ms - delta + Math.random() * delta * 2));
}

function dayKey(date = new Date()) {
  const shifted = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
}

function newCounters() {
  return {
    day: dayKey(),
    actions: 0,
    claims: 0,
    missionActions: 0,
    storyRuns: 0,
    pvpBattles: 0,
    bossHits: 0,
  };
}

function newRuntime() {
  return {
    nextAt: 0,
    lastRunAt: null,
    lastAction: null,
    lastResult: null,
    lastError: null,
    failures: 0,
    suspended: false,
    cycles: 0,
    busy: false,
    due: { daily: 0, story: 0, boss: 0, pvp: 0 },
    counters: newCounters(),
  };
}

export function createEngine({ store, game, withAccountLock, withSession }) {
  const runtime = {
    running: false,
    ticking: false,
    startedAt: null,
    lastTickAt: null,
    timer: null,
    accounts: new Map(),
    events: [],
  };

  function pushEvent({ accountId = null, username = '', action, level = 'info', message, meta = null }) {
    const text = String(message || '');
    // Moi log deu co 4 dong: Tien trinh / Cost / Gain / Trang thai.
    const normalized = text.includes('Tiến trình:')
      ? text
      : formatRunLog({
          done: level === 'error' ? 0 : 1,
          total: 1,
          gain: level === 'error' ? [] : [text],
          stopReason: level === 'error' ? text : null,
        });
    const event = {
      at: new Date().toISOString(),
      accountId,
      username,
      action,
      level,
      message: normalized,
    };
    runtime.events.unshift(event);
    if (runtime.events.length > MAX_EVENTS) runtime.events.length = MAX_EVENTS;

    try {
      store.addLog({
        accountId,
        username,
        action,
        level,
        message: normalized,
        meta,
      });
    } catch {
      // Nhat ky khong duoc lam hong vong lap bot.
    }
    return event;
  }

  function accountRuntime(id) {
    const key = Number(id);
    let rt = runtime.accounts.get(key);
    if (!rt) {
      rt = newRuntime();
      runtime.accounts.set(key, rt);
    }
    if (rt.counters.day !== dayKey()) rt.counters = newCounters();
    return rt;
  }

  function eligibleAccounts() {
    return store
      .listAccounts()
      .filter(
        (account) =>
          account.enabled &&
          account.status === 'active' &&
          account.hasSession &&
          account.autoEnabled,
      );
  }

  function dueIn(rt) {
    return Math.max(0, Math.round((rt.nextAt - Date.now()) / 1000));
  }

  function snapshot() {
    const settings = store.getEngineSettings();
    const accounts = store.listAccounts().map((account) => {
      const rt = accountRuntime(account.id);
      return {
        account,
        eligible: Boolean(
          account.enabled &&
            account.status === 'active' &&
            account.hasSession &&
            account.autoEnabled,
        ),
        suspended: rt.suspended,
        busy: rt.busy,
        cycles: rt.cycles,
        lastRunAt: rt.lastRunAt,
        lastAction: rt.lastAction,
        lastResult: rt.lastResult,
        lastError: rt.lastError,
        failures: rt.failures,
        dueInSeconds: dueIn(rt),
        counters: rt.counters,
      };
    });

    const eligible = accounts.filter((entry) => entry.eligible);
    const actionsToday = accounts.reduce((sum, entry) => sum + entry.counters.actions, 0);
    const errorsToday = accounts.filter((entry) => entry.lastError).length;

    return {
      running: runtime.running,
      ticking: runtime.ticking,
      startedAt: runtime.startedAt,
      lastTickAt: runtime.lastTickAt,
      settings,
      totals: {
        accounts: accounts.length,
        eligible: eligible.length,
        suspended: eligible.filter((entry) => entry.suspended).length,
        actionsToday,
        errorsToday,
      },
      accounts,
      events: runtime.events,
    };
  }

  function missionAllowKinds(settings) {
    const kinds = new Set([
      'checkin',
      'story',
      'levelup',
      'ultimate',
      'train',
      'boss',
      'turnplate',
    ]);
    // Cướp vàng là hành động PvP; chỉ bật khi người dùng đã bật PvP.
    if (settings.allowPvp) kinds.add('plunder');
    return kinds;
  }

  function missionBudgets(settings, rt) {
    return {
      story: Math.max(0, settings.storyRunsPerDay - rt.counters.storyRuns),
      plunder: Math.max(0, settings.pvpBattlesPerDay - rt.counters.pvpBattles),
    };
  }

  function applyMissionCounters(rt, missionRun) {
    for (const task of missionRun.tasks || []) {
      if (task.kind === 'story' || task.kind === 'levelup') {
        rt.counters.storyRuns += task.runs || 0;
      } else if (task.kind === 'plunder') {
        rt.counters.pvpBattles += task.runs || 0;
      } else if (task.kind === 'boss') {
        rt.counters.bossHits += task.runs || 0;
      }
      rt.counters.missionActions += 1;
    }
  }

  async function runDaily(token, account, settings, rt) {
    const missionRun = await completeMissions(game, token, {
      accountId: account.id,
      allowKinds: missionAllowKinds(settings),
      budgets: missionBudgets(settings, rt),
      maxTasks: 6,
      maxRunsPerTask: 10,
    });
    applyMissionCounters(rt, missionRun);

    const results = await claimAllDaily(game, token);
    const claimed = results.filter((result) => result.ok);
    const failed = results.filter((result) => !result.ok && !result.skipped);

    rt.due.daily = Date.now() + 30 * 60 * 1000;

    const missionText =
      (missionRun.tasks?.length || 0) > 0
        ? `Nhiệm vụ: ${describeMissionSummary(missionRun)}.`
        : '';

    if (claimed.length === 0) {
      return missionText
        ? {
            name: 'daily',
            level: missionRun.tasks.some((task) => task.progressed) ? 'success' : 'warn',
            message: `Daily: ${missionText}`,
            meta: { mission: missionRun },
          }
        : null;
    }

    rt.counters.claims += claimed.length;
    const names = claimed.map((result) => result.name).join(', ');
    return {
      name: 'daily',
      level: failed.length > 0 ? 'warn' : 'success',
      message: `Daily: ${missionText} Nhận ${claimed.length} mục (${names})${
        failed.length > 0 ? ` · ${failed.length} mục lỗi` : ''
      }.`,
      meta: { mission: missionRun, claimed: claimed.length, failed: failed.length },
    };
  }

  async function runStory(token, account, settings, rt) {
    const remaining = settings.storyRunsPerDay - rt.counters.storyRuns;
    if (remaining <= 0) {
      rt.due.story = Date.now() + 30 * 60 * 1000;
      return null;
    }

    const maxRuns = Math.min(5, remaining);
    const result = await runStoryBatch(game, token, { mode: 'push', maxRuns });
    const runs = result.summary?.runs || 0;
    rt.counters.storyRuns += runs;
    rt.due.story = Date.now() + 15 * 60 * 1000;

    if (runs === 0) return null;

    const stopReason = result.stopReason;
    const level =
      stopReason === 'loss' || stopReason === 'unverified' || stopReason === 'progress-stalled'
        ? 'warn'
        : 'success';

    return {
      name: 'story',
      level,
      message: `Cốt truyện: ${runs} trận, ${result.summary.wins} thắng, +${result.summary.exp} EXP, +${result.summary.gold} vàng${
        stopReason ? ` · dừng (${stopReason})` : ''
      }.`,
      meta: { runs, stopReason, summary: result.summary },
    };
  }

  async function runBoss(token, account, settings, rt) {
    const beast = await hitBeastBoss(game, token);
    if (beast.ok) {
      rt.counters.bossHits += 1;
      rt.due.boss = Date.now() + 5 * 60 * 1000;
      return {
        name: 'boss',
        level: 'success',
        message: `Vĩ Thú: đánh 1 hit · ${beast.hit?.damage ?? 0} sát thương.`,
        meta: { hit: beast.hit },
      };
    }

    const guild = await hitGuildBoss(game, token);
    if (guild.ok) {
      rt.counters.bossHits += 1;
      rt.due.boss = Date.now() + 5 * 60 * 1000;
      return {
        name: 'boss',
        level: 'success',
        message: `Guild Boss: đánh 1 hit · ${guild.hit?.damage ?? 0} sát thương.`,
        meta: { hit: guild.hit },
      };
    }

    const cooldown = Math.max(
      Number(beast.state?.cooldownRemain) || 0,
      Number(guild.state?.cooldownRemain) || 0,
    );
    rt.due.boss = Date.now() + Math.max(5 * 60 * 1000, cooldown * 1000);
    return null;
  }

  async function runPvp(token, account, settings, rt) {
    if (rt.counters.pvpBattles >= settings.pvpBattlesPerDay) {
      rt.due.pvp = Date.now() + 60 * 60 * 1000;
      return null;
    }

    const plan = await planRankBattles(game, token, {
      accountId: account.id,
      battles: 1,
    });
    rt.due.pvp = Date.now() + 20 * 60 * 1000;

    const target = plan.candidates?.[0];
    if (!plan.ok || !target) return null;

    const result = await battleRank(game, token, {
      accountId: account.id,
      targetRankNo: target.rankNo,
      targetUserId: target.userId,
    });
    rt.counters.pvpBattles += 1;

    return {
      name: 'pvp',
      level: result.ok ? 'success' : 'warn',
      message: `Đấu Rank ${target.name}: ${result.ok ? 'thắng' : 'dừng'}${
        result.stopReason ? ` (${result.stopReason})` : ''
      } · lực chiến ${target.power ?? '?'}.`,
      meta: { battle: result.battle, stopReason: result.stopReason },
    };
  }

  async function runCycle(account, token, settings, rt) {
    if (settings.dryRun) {
      const missionPlan = await completeMissions(game, token, {
        accountId: account.id,
        dryRun: true,
        allowKinds: missionAllowKinds(settings),
        budgets: missionBudgets(settings, rt),
      });
      const { data } = await readAdvisorAccount(game, token, account);
      const first = data.suggestions?.[0];
      const actions = [];

      if (missionPlan.planned?.length) {
        const detail = missionPlan.planned
          .slice(0, 4)
          .map((task) => `${task.label} còn ${task.remaining}`)
          .join('; ');
        actions.push({
          name: 'dry-run-mission',
          level: 'info',
          message: `Dry-run: sẽ hoàn thành ${missionPlan.planned.length} nhóm nhiệm vụ — ${detail}.`,
          meta: { mission: missionPlan },
        });
      }

      if (first) {
        actions.push({
          name: 'dry-run',
          level: 'info',
          message: `Dry-run: sẽ ${first.title} — ${first.detail}`,
        });
      }

      if (actions.length === 0) {
        return {
          actions: [],
          message: 'Không có việc cần làm.',
        };
      }

      return {
        actions,
        message: actions.map((action) => action.message).join(' '),
      };
    }

    const actions = [];
    const now = Date.now();

    const ladder = [
      ['daily', settings.allowDaily, runDaily],
      ['story', settings.allowStory, runStory],
      ['boss', settings.allowBoss, runBoss],
      ['pvp', settings.allowPvp, runPvp],
    ];

    for (const [name, allowed, runner] of ladder) {
      if (actions.length >= settings.maxActions) break;
      if (!allowed || rt.due[name] > now) continue;

      try {
        const action = await runner(token, account, settings, rt);
        if (action) actions.push(action);
      } catch (error) {
        rt.due[name] = Date.now() + 15 * 60 * 1000;
        throw error;
      }

      if (actions.length < settings.maxActions) await sleep(jitter(600));
    }

    return {
      actions,
      message:
        actions.length > 0
          ? actions.map((action) => action.message).join(' ')
          : 'Không có hành động nào đến hạn.',
    };
  }

  async function runAccount(account, { force = false } = {}) {
    const rt = accountRuntime(account.id);
    if (rt.busy) return { skipped: true, reason: 'busy' };
    if (!force && (rt.suspended || Date.now() < rt.nextAt)) {
      return { skipped: true, reason: rt.suspended ? 'suspended' : 'not-due' };
    }

    rt.busy = true;
    if (force) rt.suspended = false;

    try {
      const settings = store.getEngineSettings();
      const outcome = await withAccountLock(account.id, () =>
        withSession(store, game, account.id, (token) =>
          runCycle(account, token, settings, rt),
        ),
      );

      rt.cycles += 1;
      rt.lastRunAt = new Date().toISOString();
      rt.lastError = null;
      rt.failures = 0;
      rt.counters.actions += outcome.actions.length;
      rt.lastAction = outcome.actions.map((action) => action.name).join(', ') || null;
      rt.lastResult = outcome.message;

      for (const action of outcome.actions) {
        pushEvent({
          accountId: account.id,
          username: account.username,
          action: `engine.${action.name}`,
          level: action.level || 'info',
          message: action.message,
          meta: action.meta || null,
        });
      }

      rt.nextAt = Date.now() + jitter(settings.intervalSeconds * 1000);
      return { ok: true, actions: outcome.actions };
    } catch (error) {
      rt.failures += 1;
      rt.lastError = error.message;
      rt.lastRunAt = new Date().toISOString();
      rt.nextAt = Date.now() + Math.min(30 * 60 * 1000, 60 * 1000 * 2 ** rt.failures);

      if (rt.failures >= MAX_FAILURES) {
        rt.suspended = true;
        pushEvent({
          accountId: account.id,
          username: account.username,
          action: 'engine.suspended',
          level: 'error',
          message: `Tạm dừng bot cho ${account.username}: lỗi ${rt.failures} lần liên tiếp (${error.message}).`,
        });
      } else {
        pushEvent({
          accountId: account.id,
          username: account.username,
          action: 'engine.error',
          level: 'error',
          message: `Lỗi chu kỳ ${account.username}: ${error.message}`,
        });
      }

      return { ok: false, error: error.message };
    } finally {
      rt.busy = false;
    }
  }

  async function tick({ force = false } = {}) {
    if (runtime.ticking) return { skipped: true, reason: 'ticking' };
    if (!runtime.running && !force) return { skipped: true, reason: 'stopped' };

    runtime.ticking = true;
    const results = [];

    try {
      const accounts = eligibleAccounts();
      for (const account of accounts) {
        if (!runtime.running && !force) break;
        const rt = accountRuntime(account.id);
        if (!force && (rt.suspended || Date.now() < rt.nextAt)) continue;

        results.push({ accountId: account.id, ...(await runAccount(account, { force })) });
        await sleep(jitter(800, 0.4));
      }

      runtime.lastTickAt = new Date().toISOString();
      return { ok: true, accounts: accounts.length, results };
    } finally {
      runtime.ticking = false;
    }
  }

  function ensureTimer() {
    if (runtime.timer) return;
    runtime.timer = setInterval(() => {
      tick().catch((error) => {
        pushEvent({
          action: 'engine.error',
          level: 'error',
          message: `Lỗi vòng lặp bot: ${error.message}`,
        });
      });
    }, TICK_MS);
    if (typeof runtime.timer.unref === 'function') runtime.timer.unref();
  }

  function start({ settings } = {}) {
    if (settings) store.updateEngineSettings(settings);
    if (!runtime.running) {
      runtime.running = true;
      runtime.startedAt = new Date().toISOString();
      pushEvent({
        action: 'engine.start',
        level: 'success',
        message: `Bot bắt đầu chạy (${store.getEngineSettings().dryRun ? 'dry-run' : 'thật'}).`,
      });
    }
    ensureTimer();
    tick().catch(() => {});
    return snapshot();
  }

  function stop() {
    if (runtime.running) {
      runtime.running = false;
      pushEvent({
        action: 'engine.stop',
        level: 'info',
        message: 'Bot đã dừng.',
      });
    }
    if (runtime.timer) {
      clearInterval(runtime.timer);
      runtime.timer = null;
    }
    return snapshot();
  }

  function updateSettings(patch) {
    const settings = store.updateEngineSettings(patch);
    return settings;
  }

  return {
    start,
    stop,
    tick,
    runAccount,
    updateSettings,
    snapshot,
    get running() {
      return runtime.running;
    },
  };
}

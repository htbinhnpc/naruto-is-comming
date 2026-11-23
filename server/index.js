import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

import { config } from './config.js';
import { createSecretBox } from './secret-box.js';
import { createStore } from './db.js';
import { createGameClient } from './game/client.js';
import {
  loginAccount,
  logoutAccount,
  syncAccount,
  withSession,
} from './game/service.js';
import {
  claimAllDaily,
  claimDailyFeature,
  getDailyStatus,
} from './game/daily.js';
import {
  analyzeMissions,
  groupMissionTasks,
  readMissionRows,
} from './game/missions.js';
import {
  applyTeamPlan,
  buildStrongestPlan,
  readTeamState,
} from './game/team.js';
import {
  describeUseResults,
  readBagState,
} from './game/bag.js';
import {
  readGachaState,
  runGachaBatch,
} from './game/gacha.js';
import {
  readCraftFuel,
  readCraftState,
  runCraftBatch,
} from './game/craftment.js';
import { readDashboardState } from './game/dashboard.js';
import { buildAdvisorSnapshot, readAdvisorAccount } from './game/advisor.js';
import { createEngine } from './game/engine.js';
import { readStoryState, runStoryBatch } from './game/story.js';
import {
  claimUltimate,
  readTrainingState,
  runCaveBatch,
  runUltimateBatch,
} from './game/training.js';
import { hitBeastBoss, hitGuildBoss, readBossState } from './game/boss.js';
import {
  battlePlunder,
  battleRank,
  planPlunderBattles,
  planRankBattles,
  readPvpState,
} from './game/pvp.js';
import { formatRunLog, joinParts, stopReasonText } from './game/runlog.js';
import { readJsonBody, sendError, sendJson, sendNoContent } from './http.js';

const secretBox = createSecretBox(config.dataDir);
const store = createStore({ dataDir: config.dataDir, secretBox });
const game = createGameClient(config.game);

// Chan 2 thao tac nang chay chen nhau tren cung tai khoan.
const busyAccounts = new Set();
let advisorScanning = false;

async function withAccountLock(id, task) {
  // Cac tab deu doc chung mot tai khoan. Thay vi tra 409 ngay khi mot request
  // khac dang chay, cho toi da 8 giay de request truoc hoan tat.
  const deadline = Date.now() + 8000;
  while (busyAccounts.has(id)) {
    if (Date.now() >= deadline) {
      const error = new Error('Tài khoản đang được xử lý, vui lòng chờ.');
      error.statusCode = 409;
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  busyAccounts.add(id);
  try {
    return await task();
  } finally {
    busyAccounts.delete(id);
  }
}

function logEvent(accountId, action, level, message, meta = null, usernameOverride = null) {
  let username = usernameOverride;
  if (username === null && accountId !== null) {
    username = store.getAccount(accountId)?.username ?? '';
  }
  store.addLog({
    accountId,
    username: username || '',
    action,
    level,
    message,
    meta,
  });
}

const engine = createEngine({ store, game, withAccountLock, withSession });

function runLog({ done, total, cost = [], gain = [], stopReason = null }) {
  return formatRunLog({ done, total, cost, gain, stopReason });
}

function logDailyResult(accountId, result, extra = {}) {
  const level = result.ok ? 'success' : result.skipped ? 'info' : 'warn';
  logEvent(
    accountId,
    'daily.claim',
    level,
    runLog({
      done: result.ok || result.skipped ? 1 : 0,
      total: 1,
      gain: result.ok && result.message ? [result.message] : [],
      stopReason: result.ok || result.skipped ? null : result.message || 'error',
    }),
    { feature: result.feature, ...extra },
  );
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'",
};

async function serveStatic(req, res, pathname) {
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(config.publicDir, relative);

  if (!filePath.startsWith(config.publicDir + path.sep)) {
    return sendJson(res, 403, { error: 'Không có quyền truy cập.' });
  }

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      ...SECURITY_HEADERS,
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Content-Length': data.length,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=60',
    });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      return sendJson(res, 404, { error: 'Không tìm thấy trang.' });
    }
    throw error;
  }
}

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('ID tài khoản không hợp lệ.');
    error.statusCode = 400;
    throw error;
  }
  return id;
}

function requireActiveAccount(account) {
  if (!account.enabled) {
    const error = new Error('Tài khoản đang tắt, không thể nhận thưởng daily.');
    error.statusCode = 400;
    throw error;
  }
  if (account.status !== 'active' || !account.hasSession) {
    const error = new Error('Cần đăng nhập tài khoản trước khi nhận thưởng daily.');
    error.statusCode = 400;
    throw error;
  }
}

function requireTeamAccount(account) {
  if (!account.enabled) {
    const error = new Error('Tài khoản đang tắt, không thể xem đội hình.');
    error.statusCode = 400;
    throw error;
  }
  if (account.status !== 'active' || !account.hasSession) {
    const error = new Error('Cần đăng nhập tài khoản trước khi xem đội hình.');
    error.statusCode = 400;
    throw error;
  }
}

function requireBagAccount(account) {
  if (!account.enabled) {
    const error = new Error('Tài khoản đang tắt, không thể xem túi đồ.');
    error.statusCode = 400;
    throw error;
  }
  if (account.status !== 'active' || !account.hasSession) {
    const error = new Error('Cần đăng nhập tài khoản trước khi xem túi đồ.');
    error.statusCode = 400;
    throw error;
  }
}

function requireCraftAccount(account) {
  if (!account.enabled) {
    const error = new Error('Tài khoản đang tắt, không thể nâng cấp.');
    error.statusCode = 400;
    throw error;
  }
  if (account.status !== 'active' || !account.hasSession) {
    const error = new Error('Cần đăng nhập tài khoản trước khi nâng cấp.');
    error.statusCode = 400;
    throw error;
  }
}

function requireGachaAccount(account) {
  if (!account.enabled) {
    const error = new Error('Tài khoản đang tắt, không thể quay ninja.');
    error.statusCode = 400;
    throw error;
  }
  if (account.status !== 'active' || !account.hasSession) {
    const error = new Error('Cần đăng nhập tài khoản trước khi quay ninja.');
    error.statusCode = 400;
    throw error;
  }
}

function requireDashboardAccount(account) {
  if (!account.enabled) {
    const error = new Error('Tài khoản đang tắt, không thể xem tổng quan.');
    error.statusCode = 400;
    throw error;
  }
  if (account.status !== 'active' || !account.hasSession) {
    const error = new Error('Cần đăng nhập tài khoản trước khi xem tổng quan.');
    error.statusCode = 400;
    throw error;
  }
}

function requireTrainingAccount(account) {
  if (!account.enabled) {
    const error = new Error('Tài khoản đang tắt, không thể dùng tab Huấn luyện.');
    error.statusCode = 400;
    throw error;
  }
  if (account.status !== 'active' || !account.hasSession) {
    const error = new Error('Cần đăng nhập tài khoản trước khi dùng tab Huấn luyện.');
    error.statusCode = 400;
    throw error;
  }
}

function requireBossAccount(account) {
  if (!account.enabled) {
    const error = new Error('Tài khoản đang tắt, không thể dùng tab Boss.');
    error.statusCode = 400;
    throw error;
  }
  if (account.status !== 'active' || !account.hasSession) {
    const error = new Error('Cần đăng nhập tài khoản trước khi dùng tab Boss.');
    error.statusCode = 400;
    throw error;
  }
}

function requirePvpAccount(account) {
  if (!account.enabled) {
    const error = new Error('Tài khoản đang tắt, không thể dùng tab PvP.');
    error.statusCode = 400;
    throw error;
  }
  if (account.status !== 'active' || !account.hasSession) {
    const error = new Error('Cần đăng nhập tài khoản trước khi dùng tab PvP.');
    error.statusCode = 400;
    throw error;
  }
}

function requireConfirm(body, message) {
  if (body.confirm !== true) {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }
}

function toInt(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : fallback;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('vi-VN');
}

async function handleApi(req, res, url) {
  const { pathname, searchParams } = url;

  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, time: new Date().toISOString() });
  }

  if (pathname === '/api/advisor' && req.method === 'GET') {
    return sendJson(res, 200, {
      ...buildAdvisorSnapshot(store.listAccounts()),
      scanning: advisorScanning,
    });
  }

  if (pathname === '/api/advisor/scan' && req.method === 'POST') {
    if (advisorScanning) {
      return sendJson(res, 409, { error: 'Đang quét cố vấn, vui lòng chờ.' });
    }

    const body = await readJsonBody(req, config.maxBodyBytes);
    const force = body.force !== false;
    const wanted = Array.isArray(body.accountIds)
      ? new Set(body.accountIds.map((id) => toInt(id, 0)))
      : null;

    const targets = store
      .listAccounts()
      .filter(
        (account) =>
          account.enabled &&
          account.status === 'active' &&
          account.hasSession &&
          (!wanted || wanted.has(account.id)),
      );

    advisorScanning = true;
    const results = [];

    try {
      for (const account of targets) {
        try {
          const entry = await withAccountLock(account.id, () =>
            withSession(store, game, account.id, (token) =>
              readAdvisorAccount(game, token, account, { force }),
            ),
          );
          results.push({ accountId: account.id, ok: true, cached: entry.cached });
          logEvent(
            account.id,
            'advisor.scan',
            'info',
            runLog({ done: 1, total: 1, gain: [`Đã quét ${account.username}`] }),
          );
        } catch (error) {
          results.push({ accountId: account.id, ok: false, error: error.message });
          logEvent(
            account.id,
            'advisor.scan',
            'warn',
            runLog({ done: 0, total: 1, stopReason: error.message }),
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 400));
      }
    } finally {
      advisorScanning = false;
    }

    return sendJson(res, 200, {
      ...buildAdvisorSnapshot(store.listAccounts()),
      scanning: false,
      results,
    });
  }

  if (pathname === '/api/engine' && req.method === 'GET') {
    return sendJson(res, 200, engine.snapshot());
  }

  if (pathname === '/api/engine/start' && req.method === 'POST') {
    const body = await readJsonBody(req, config.maxBodyBytes);
    requireConfirm(body, 'Cần xác nhận trước khi bật bot.');
    const state = engine.start({ settings: body.settings });
    return sendJson(res, 200, state);
  }

  if (pathname === '/api/engine/stop' && req.method === 'POST') {
    return sendJson(res, 200, engine.stop());
  }

  if (
    pathname === '/api/engine/settings' &&
    (req.method === 'POST' || req.method === 'PATCH')
  ) {
    const body = await readJsonBody(req, config.maxBodyBytes);
    if (body.dryRun === false) {
      requireConfirm(body, 'Cần xác nhận trước khi tắt dry-run.');
    }
    const settings = engine.updateSettings(body);
    logEvent(null, 'engine.settings', 'info', runLog({ done: 1, total: 1, gain: ['Cấu hình bot đã lưu'] }), settings);
    return sendJson(res, 200, { settings, state: engine.snapshot() });
  }

  if (pathname === '/api/engine/tick' && req.method === 'POST') {
    const body = await readJsonBody(req, config.maxBodyBytes);
    if (!store.getEngineSettings().dryRun) {
      requireConfirm(body, 'Cần xác nhận trước khi chạy bot ở chế độ thật.');
    }
    const result = await engine.tick({ force: true });
    return sendJson(res, 200, { result, state: engine.snapshot() });
  }

  if (pathname === '/api/accounts/stats' && req.method === 'GET') {
    return sendJson(res, 200, store.stats());
  }

  if (pathname === '/api/logs' && req.method === 'GET') {
    const limit = Math.min(Math.max(Number(searchParams.get('limit') || 100), 1), 500);
    const offset = Math.max(Number(searchParams.get('offset') || 0), 0);
    const accountParam = searchParams.get('accountId');
    const level = searchParams.get('level') || '';

    const data = store.listLogs({
      limit,
      offset,
      accountId:
        accountParam && accountParam !== 'all' ? parseId(accountParam) : null,
      level: ['success', 'info', 'warn', 'error'].includes(level) ? level : '',
    });
    return sendJson(res, 200, data);
  }

  if (pathname === '/api/accounts') {
    if (req.method === 'GET') {
      const accounts = store.listAccounts({
        q: searchParams.get('q') || '',
        status: searchParams.get('status') || '',
      });
      return sendJson(res, 200, {
        accounts,
        stats: store.stats(),
      });
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      const account = store.createAccount(body);
      logEvent(
        account.id,
        'account.create',
        'success',
        runLog({ done: 1, total: 1, gain: [`Thêm tài khoản ${account.username}`] }),
      );
      return sendJson(res, 201, { account });
    }
  }

  const dailyMatch = pathname.match(
    /^\/api\/accounts\/(\d+)\/daily(?:\/(claim-all|claim))?$/,
  );
  if (dailyMatch) {
    const id = parseId(dailyMatch[1]);
    const action = dailyMatch[2];
    const account = store.getAccount(id);
    if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
    requireActiveAccount(account);

    if (!action && req.method === 'GET') {
      const data = await withAccountLock(id, () =>
        withSession(store, game, id, (token) => getDailyStatus(game, token)),
      );
      return sendJson(res, 200, {
        ...data,
        account: store.getAccount(id),
      });
    }

    if (action === 'claim' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      const feature = String(body.feature || '').trim();

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, (token) =>
            claimDailyFeature(game, token, feature),
          ),
        );
        logDailyResult(id, result);
        return sendJson(res, 200, {
          result,
          account: store.getAccount(id),
        });
      } catch (error) {
        logEvent(id, 'daily.claim', 'error', runLog({ done: 0, total: 1, stopReason: error.message }), { feature });
        throw error;
      }
    }

    if (action === 'claim-all' && req.method === 'POST') {
      try {
        const results = await withAccountLock(id, () =>
          withSession(store, game, id, (token) => claimAllDaily(game, token)),
        );
        for (const result of results) {
          logDailyResult(id, result, { batch: true });
        }

        const okCount = results.filter((result) => result.ok).length;
        logEvent(
          id,
          'daily.claim_all',
          okCount > 0 ? 'success' : 'warn',
          runLog({
            done: okCount,
            total: results.length,
            gain: results.filter((result) => result.ok).map((result) => result.name),
            stopReason: okCount === results.length ? null : 'still-pending',
          }),
          { okCount },
        );

        return sendJson(res, 200, {
          results,
          account: store.getAccount(id),
        });
      } catch (error) {
        logEvent(id, 'daily.claim_all', 'error', runLog({ done: 0, total: 1, stopReason: error.message }));
        throw error;
      }
    }
  }

  const missionsMatch = pathname.match(/^\/api\/accounts\/(\d+)\/missions$/);
  if (missionsMatch && req.method === 'GET') {
    const id = parseId(missionsMatch[1]);
    const account = store.getAccount(id);
    if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
    requireActiveAccount(account);

    const rows = await withAccountLock(id, () =>
      withSession(store, game, id, (token) => readMissionRows(game, token)),
    );
    const analysis = analyzeMissions(rows);

    return sendJson(res, 200, {
      account: store.getAccount(id),
      total: analysis.missions.length,
      missions: analysis.missions,
      actionable: analysis.actionable,
      skipped: analysis.skipped,
      tasks: groupMissionTasks(analysis.actionable),
    });
  }

  const dashboardMatch = pathname.match(/^\/api\/accounts\/(\d+)\/dashboard$/);
  if (dashboardMatch) {
    const id = parseId(dashboardMatch[1]);
    const account = store.getAccount(id);
    if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
    requireDashboardAccount(account);

    if (req.method === 'GET') {
      const state = await withAccountLock(id, () =>
        withSession(store, game, id, (token) =>
          readDashboardState(game, token, { account }),
        ),
      );
      return sendJson(res, 200, { state, account: store.getAccount(id) });
    }
  }

  const storyMatch = pathname.match(
    /^\/api\/accounts\/(\d+)\/story(?:\/run)?$/,
  );
  if (storyMatch) {
    const id = parseId(storyMatch[1]);
    const isRun = pathname.endsWith('/run');
    const account = store.getAccount(id);
    if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
    requireTrainingAccount(account);

    if (!isRun && req.method === 'GET') {
      const state = await withAccountLock(id, () =>
        withSession(store, game, id, (token) =>
          readStoryState(game, token, {
            stageStats: store.getStoryStageStats(id),
          }),
        ),
      );
      return sendJson(res, 200, { state, account: store.getAccount(id) });
    }

    if (isRun && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      requireConfirm(body, 'Cần xác nhận trước khi chạy cốt truyện.');

      const mode = body.mode === 'push' ? 'push' : 'farm';
      const scid = Math.max(0, toInt(body.scid));
      const maxRuns = Math.max(0, toInt(body.maxRuns));
      const useEnergyItems = Boolean(body.useEnergyItems);

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, (token) =>
            runStoryBatch(game, token, {
              mode,
              scid,
              maxRuns,
              useEnergyItems,
            }),
          ),
        );

        for (const sample of result.samples) {
          store.recordStoryRun(id, sample);
        }

        const cost = [];
        if (result.summary.energySpent) cost.push(`Energy: ${formatNumber(result.summary.energySpent)}`);
        for (const item of result.itemsUsed) {
          cost.push(`${item.name || `item ${item.id}`}: ${item.quantity}`);
        }
        const gain = [
          result.summary.exp ? `Exp: ${formatNumber(result.summary.exp)}` : null,
          result.summary.gold ? `Gold: ${formatNumber(result.summary.gold)}` : null,
          result.summary.wins ? `Thắng: ${result.summary.wins}/${result.summary.runs}` : null,
          result.summary.levelUps ? `Lv+: ${result.summary.levelUps}` : null,
        ].filter(Boolean);

        logEvent(
          id,
          'story.run',
          result.summary.wins > 0 ? 'success' : 'warn',
          runLog({
            done: result.summary.runs,
            total: maxRuns || result.summary.runs,
            cost,
            gain,
            stopReason: result.stopReason,
          }),
          { stopReason: result.stopReason },
        );

        return sendJson(res, 200, {
          result,
          account: store.getAccount(id),
        });
      } catch (error) {
        logEvent(id, 'story.run', 'error', runLog({ done: 0, total: 1, stopReason: error.message }), {
          mode,
          scid,
          maxRuns,
          useEnergyItems,
        });
        throw error;
      }
    }
  }

  const trainingMatch = pathname.match(
    /^\/api\/accounts\/(\d+)\/training(?:\/(caves\/run|ultimate\/run|ultimate\/claim))?$/,
  );
  if (trainingMatch) {
    const id = parseId(trainingMatch[1]);
    const action = trainingMatch[2];
    const account = store.getAccount(id);
    if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
    requireTrainingAccount(account);

    if (!action && req.method === 'GET') {
      const state = await withAccountLock(id, () =>
        withSession(store, game, id, (token) => readTrainingState(game, token)),
      );
      return sendJson(res, 200, { state, account: store.getAccount(id) });
    }

    if (action === 'caves/run' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      requireConfirm(body, 'Cần xác nhận trước khi chạy động huấn luyện.');

      const cave = toInt(body.cave);
      const mode = toInt(body.mode) === 2 ? 2 : 1;
      const tier = Math.max(0, toInt(body.tier));
      const stageNo = Math.max(0, toInt(body.stageNo));
      const maxRuns = Math.max(0, toInt(body.maxRuns));

      if (cave < 1 || cave > 3) {
        return sendJson(res, 400, { error: 'Động không hợp lệ.' });
      }

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, (token) =>
            runCaveBatch(game, token, { cave, mode, tier, stageNo, maxRuns }),
          ),
        );

        logEvent(
          id,
          'training.cave',
          result.summary.wins > 0 ? 'success' : 'warn',
          runLog({
            done: result.summary.runs,
            total: maxRuns || result.summary.runs,
            gain: [
              `Thắng: ${result.summary.wins}/${result.summary.runs}`,
              result.summary.gold ? `Gold: ${formatNumber(result.summary.gold)}` : null,
              result.summary.items ? `Vật phẩm: ${result.summary.items}` : null,
            ].filter(Boolean),
            stopReason: result.stopReason,
          }),
          { stopReason: result.stopReason },
        );

        return sendJson(res, 200, { result, account: store.getAccount(id) });
      } catch (error) {
        logEvent(id, 'training.cave', 'error', runLog({ done: 0, total: 1, stopReason: error.message }), {
          cave,
          mode,
          tier,
          stageNo,
          maxRuns,
        });
        throw error;
      }
    }

    if (action === 'ultimate/run' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      requireConfirm(body, 'Cần xác nhận trước khi chạy Thử thách tối thượng.');

      const mode = toInt(body.mode) === 2 ? 2 : 1;
      const maxRuns = Math.max(0, toInt(body.maxRuns));
      const star = Math.max(1, toInt(body.star, 1));

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, (token) =>
            runUltimateBatch(game, token, { mode, maxRuns, star }),
          ),
        );

        logEvent(
          id,
          'training.ultimate',
          result.summary.wins > 0 ? 'success' : 'warn',
          runLog({
            done: result.summary.runs,
            total: maxRuns || result.summary.runs,
            gain: [
              `Thắng: ${result.summary.wins}/${result.summary.runs}`,
              result.summary.gold ? `Gold: ${formatNumber(result.summary.gold)}` : null,
            ].filter(Boolean),
            stopReason: result.stopReason,
          }),
          { stopReason: result.stopReason },
        );

        return sendJson(res, 200, { result, account: store.getAccount(id) });
      } catch (error) {
        logEvent(id, 'training.ultimate', 'error', runLog({ done: 0, total: 1, stopReason: error.message }), {
          mode,
          maxRuns,
          star,
        });
        throw error;
      }
    }

    if (action === 'ultimate/claim' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      requireConfirm(body, 'Cần xác nhận trước khi nhận thưởng Ultimate.');

      const mode = toInt(body.mode) === 2 ? 2 : 1;
      const kind = body.kind === 'buff' ? 'buff' : 'reward';

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, (token) =>
            claimUltimate(game, token, { mode, kind }),
          ),
        );

        logEvent(
          id,
          'training.ultimate_claim',
          result.ok ? 'success' : 'warn',
          runLog({
            done: result.ok ? 1 : 0,
            total: 1,
            gain: result.ok ? [`${kind === 'buff' ? 'Buff' : 'Thưởng'} Ultimate ${mode === 1 ? 'Công' : 'Thủ'}`] : [],
            stopReason: result.ok ? null : 'no-reward',
          }),
          { mode, kind },
        );

        return sendJson(res, 200, { result, account: store.getAccount(id) });
      } catch (error) {
        logEvent(id, 'training.ultimate_claim', 'error', runLog({ done: 0, total: 1, stopReason: error.message }), {
          mode,
          kind,
        });
        throw error;
      }
    }
  }

  const bossMatch = pathname.match(
    /^\/api\/accounts\/(\d+)\/boss(?:\/(beast|guild)\/hit)?$/,
  );
  if (bossMatch) {
    const id = parseId(bossMatch[1]);
    const action = bossMatch[2];
    const account = store.getAccount(id);
    if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
    requireBossAccount(account);

    if (!action && req.method === 'GET') {
      const state = await withAccountLock(id, () =>
        withSession(store, game, id, (token) => readBossState(game, token)),
      );
      return sendJson(res, 200, { state, account: store.getAccount(id) });
    }

    if (action === 'beast' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      requireConfirm(body, 'Cần xác nhận trước khi đánh Vĩ Thú.');

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, (token) => hitBeastBoss(game, token)),
        );

        const level = result.ok
          ? 'success'
          : ['closed', 'defeated', 'killed', 'cooldown', 'window-ending'].includes(
                result.stopReason,
              )
            ? 'info'
            : 'warn';
        const message = runLog({
          done: result.ok ? 1 : 0,
          total: 1,
          gain: result.ok
            ? [
                `${result.state?.beastName || 'Vĩ Thú'}: ${formatNumber(result.hit?.dame)} dmg`,
                `HP ${formatNumber(result.hit?.hp)}/${formatNumber(result.hit?.maxHp)}`,
              ]
            : [],
          stopReason: result.stopReason || (result.ok ? null : 'error:state'),
        });
        logEvent(id, 'boss.beast', level, message, { stopReason: result.stopReason });

        return sendJson(res, 200, { result, account: store.getAccount(id) });
      } catch (error) {
        logEvent(id, 'boss.beast', 'error', runLog({ done: 0, total: 1, stopReason: error.message }));
        throw error;
      }
    }

    if (action === 'guild' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      requireConfirm(body, 'Cần xác nhận trước khi đánh Guild Boss.');

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, (token) => hitGuildBoss(game, token)),
        );

        const level = result.ok
          ? 'success'
          : ['no-guild', 'no-hits', 'killed', 'cooldown'].includes(result.stopReason)
            ? 'info'
            : 'warn';
        const message = runLog({
          done: result.ok ? 1 : 0,
          total: 1,
          gain: result.ok
            ? [
                `${result.state?.beastName || 'Guild Boss'}: ${formatNumber(result.hit?.dame)} dmg`,
                `Còn ${formatNumber(result.hit?.hitsLeft)} lượt`,
              ]
            : [],
          stopReason: result.stopReason || (result.ok ? null : 'error:state'),
        });
        logEvent(id, 'boss.guild', level, message, { stopReason: result.stopReason });

        return sendJson(res, 200, { result, account: store.getAccount(id) });
      } catch (error) {
        logEvent(id, 'boss.guild', 'error', runLog({ done: 0, total: 1, stopReason: error.message }));
        throw error;
      }
    }
  }

  const pvpMatch = pathname.match(
    /^\/api\/accounts\/(\d+)\/pvp(?:\/(rank|plunder)\/(plan|battle))?$/,
  );
  if (pvpMatch) {
    const id = parseId(pvpMatch[1]);
    const mode = pvpMatch[2];
    const action = pvpMatch[3];
    const account = store.getAccount(id);
    if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
    requirePvpAccount(account);

    if (!mode && req.method === 'GET') {
      const state = await withAccountLock(id, () =>
        withSession(store, game, id, (token) =>
          readPvpState(game, token, { accountId: id }),
        ),
      );
      return sendJson(res, 200, { state, account: store.getAccount(id) });
    }

    if (mode && action === 'plan' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      const battles = toInt(body.battles, 1);
      const plan =
        mode === 'rank'
          ? await withAccountLock(id, () =>
              withSession(store, game, id, (token) =>
                planRankBattles(game, token, { accountId: id, battles }),
              ),
            )
          : await withAccountLock(id, () =>
              withSession(store, game, id, (token) =>
                planPlunderBattles(game, token, { accountId: id, battles }),
              ),
            );
      return sendJson(res, 200, { plan });
    }

    if (mode && action === 'battle' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      requireConfirm(
        body,
        mode === 'rank'
          ? 'Cần xác nhận trước khi đánh Đấu Rank.'
          : 'Cần xác nhận trước khi Cướp vàng.',
      );

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, (token) =>
            mode === 'rank'
              ? battleRank(game, token, {
                  accountId: id,
                  targetRankNo: body.targetRankNo,
                  targetUserId: body.targetUserId,
                })
              : battlePlunder(game, token, {
                  accountId: id,
                  targetUserId: body.targetUserId,
                }),
          ),
        );

        const actionName = mode === 'rank' ? 'pvp.rank' : 'pvp.plunder';
        const target = result.battle?.targetName || 'đối thủ';

        const level = result.ok
          ? 'success'
          : ['no-bp', 'no-target', 'no-gold', 'no-candidates', 'low-level'].includes(
                result.stopReason,
              )
            ? 'info'
            : 'warn';
        const gain = result.ok
          ? [
              mode === 'rank'
                ? `Hạng: ${formatNumber(result.battle?.targetRankNo)}`
                : result.battle?.goldWon
                  ? `Gold: +${formatNumber(result.battle.goldWon)}`
                  : `Thắng ${target}`,
            ]
          : [];
        logEvent(
          id,
          actionName,
          level,
          runLog({
            done: result.ok ? 1 : 0,
            total: 1,
            cost: ['BP: 1'],
            gain,
            stopReason: result.stopReason || (result.ok ? null : result.error || 'error:state'),
          }),
          { stopReason: result.stopReason },
        );

        return sendJson(res, 200, { result, account: store.getAccount(id) });
      } catch (error) {
        logEvent(id, mode === 'rank' ? 'pvp.rank' : 'pvp.plunder', 'error', runLog({ done: 0, total: 1, stopReason: error.message }));
        throw error;
      }
    }
  }

  const teamMatch = pathname.match(
    /^\/api\/accounts\/(\d+)\/team(?:\/(plan|apply))?$/,
  );
  if (teamMatch) {
    const id = parseId(teamMatch[1]);
    const action = teamMatch[2];
    const account = store.getAccount(id);
    if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
    requireTeamAccount(account);

    if (!action && req.method === 'GET') {
      const state = await withAccountLock(id, () =>
        withSession(store, game, id, (token) =>
          readTeamState(game, token, { playerLevel: account.level }),
        ),
      );
      return sendJson(res, 200, {
        state,
        account: store.getAccount(id),
      });
    }

    if (action === 'plan' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      const mode = body.mode === 'def' ? 'def' : 'atk';

      const state = await withAccountLock(id, () =>
        withSession(store, game, id, (token) =>
          readTeamState(game, token, { playerLevel: account.level }),
        ),
      );
      const plan = buildStrongestPlan(state, { mode });
      return sendJson(res, 200, { plan });
    }

    if (action === 'apply' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      if (body.confirm !== true) {
        return sendJson(res, 400, {
          error: 'Cần xác nhận trước khi áp dụng đội hình.',
        });
      }
      const mode = body.mode === 'def' ? 'def' : 'atk';

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, async (token) => {
            const before = await readTeamState(game, token, {
              playerLevel: account.level,
            });
            const plan = buildStrongestPlan(before, { mode });
            if (plan.ninjaCount === 0) {
              return { plan, before, after: before, steps: [], errors: [] };
            }
            const applied = await applyTeamPlan(game, token, plan, {
              state: before,
            });
            const after = await readTeamState(game, token, {
              playerLevel: account.level,
            });
            return { plan, before, after, ...applied };
          }),
        );

        const okSteps = result.steps.filter((step) => step.ok).length;
        logEvent(
          id,
          'team.apply',
          result.errors.length === 0 ? 'success' : 'warn',
          runLog({
            done: okSteps,
            total: result.steps.length,
            gain: [`${mode === 'atk' ? 'Công' : 'Thủ'}: ${result.plan.ninjaCount} ninja, ${result.plan.bondCount} bond`],
            stopReason: result.errors.length ? result.errors.slice(0, 2).join(' | ') : null,
          }),
          { stepCount: result.steps.length, okSteps },
        );

        return sendJson(res, 200, {
          plan: result.plan,
          steps: result.steps,
          errors: result.errors,
          state: result.after,
          account: store.getAccount(id),
        });
      } catch (error) {
        logEvent(id, 'team.apply', 'error', runLog({ done: 0, total: 1, stopReason: error.message }), { mode });
        throw error;
      }
    }
  }

  const guildMatch = pathname.match(
    /^\/api\/accounts\/(\d+)\/guild(?:\/(create|join|accept|leave|requests))?$/,
  );
  if (guildMatch) {
    const id = parseId(guildMatch[1]);
    const action = guildMatch[2];
    const account = store.getAccount(id);
    if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });

    if (!action && req.method === 'GET') {
      const data = await withAccountLock(id, () =>
        withSession(store, game, id, async (token) => ({
          info: await game.guildInfo(token),
          list: await game.guildList(token),
          requests: await game.guildRequests(token),
        })),
      );
      return sendJson(res, 200, { ...data, account: store.getAccount(id) });
    }

    const known = ['create', 'join', 'accept', 'leave', 'requests'];
    if (!known.includes(action)) {
      return sendJson(res, 404, { error: 'Hành động guild không hợp lệ.' });
    }
    if (req.method !== 'POST') {
      return sendJson(res, 405, { error: 'Phương thức không hợp lệ.' });
    }

    const body = await readJsonBody(req, config.maxBodyBytes);
    requireConfirm(body, 'Cần xác nhận trước khi thay đổi guild.');
    const name = action === 'create' ? String(body.name ?? '').trim().slice(0, 40) : '';
    const guildId = toInt(body.guildId);
    const targetUserId = toInt(body.targetUserId);

    if (action === 'create' && !name) {
      return sendJson(res, 400, { error: 'Cần tên guild.' });
    }
    if (action === 'join' && guildId <= 0) {
      return sendJson(res, 400, { error: 'Cần GuildId hợp lệ.' });
    }
    if (action === 'accept' && targetUserId <= 0) {
      return sendJson(res, 400, { error: 'Cần TargetUserId hợp lệ.' });
    }

    try {
      const result = await withAccountLock(id, () =>
        withSession(store, game, id, async (token) => {
          let response;
          if (action === 'create') response = await game.guildCreate(token, name);
          else if (action === 'join') response = await game.guildJoin(token, guildId);
          else if (action === 'accept') response = await game.guildAccept(token, targetUserId);
          else if (action === 'leave') response = await game.guildLeave(token);
          else response = await game.guildRequests(token);

          const info = await game.guildInfo(token);
          return { response, info };
        }),
      );

      const row = Array.isArray(result.response) ? result.response[0] : result.response;
      const ok = action === 'requests' || Number(row?.Result) === 1;
      logEvent(
        id,
        `guild.${action}`,
        ok ? 'success' : 'warn',
        runLog({ done: ok ? 1 : 0, total: 1, gain: [`Guild ${action}`], stopReason: ok ? null : JSON.stringify(result.response).slice(0, 200) }),
        { action, name, guildId, targetUserId, response: result.response },
      );

      return sendJson(res, 200, {
        result,
        account: store.getAccount(id),
      });
    } catch (error) {
      logEvent(id, `guild.${action}`, 'error', runLog({ done: 0, total: 1, stopReason: error.message }), {
        action,
        name,
        guildId,
        targetUserId,
      });
      throw error;
    }
  }

  const craftMatch = pathname.match(
    /^\/api\/accounts\/(\d+)\/craftment(?:\/(fuel|upgrade))?$/,
  );
  if (craftMatch) {
    const id = parseId(craftMatch[1]);
    const action = craftMatch[2];
    const account = store.getAccount(id);
    if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
    requireCraftAccount(account);
    const type = searchParams.get('type') === 'equip' ? 'equip' : 'ninja';

    if (!action && req.method === 'GET') {
      const state = await withAccountLock(id, () =>
        withSession(store, game, id, (token) => readCraftState(game, token, { type })),
      );
      return sendJson(res, 200, { state, account: store.getAccount(id) });
    }

    if (action === 'fuel' && req.method === 'GET') {
      const targetId = toInt(searchParams.get('targetId'));
      if (!targetId) {
        return sendJson(res, 400, { error: 'Thiếu targetId.' });
      }
      const state = await withAccountLock(id, () =>
        withSession(store, game, id, (token) =>
          readCraftFuel(game, token, { type, targetId }),
        ),
      );
      return sendJson(res, 200, { state, account: store.getAccount(id) });
    }

    if (action === 'upgrade' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      requireConfirm(body, 'Cần xác nhận trước khi nâng cấp.');

      const upgradeType = body.type === 'equip' ? 'equip' : 'ninja';
      const targetId = toInt(body.targetId);
      if (!targetId) return sendJson(res, 400, { error: 'Thiếu mục tiêu nâng cấp.' });
      const mode = ['safe', 'all', 'custom'].includes(body.mode) ? body.mode : 'safe';
      const maxSteps = Math.min(Math.max(toInt(body.maxSteps, 20), 1), 100);
      const fuelIds = Array.isArray(body.fuelIds) ? body.fuelIds : [];

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, (token) =>
            runCraftBatch(game, token, {
              type: upgradeType,
              targetId,
              mode,
              maxSteps,
              fuelIds,
            }),
          ),
        );

        const label = upgradeType === 'equip' ? 'Trang bị' : 'Ninja';
        const targetName =
          result.after?.name || result.before?.name || `#${targetId}`;
        logEvent(
          id,
          'craftment.upgrade',
          result.fuelUsed > 0 ? 'success' : 'warn',
          runLog({
            done: result.fuelUsed,
            total: result.steps.length,
            cost: [`Fuel: ${result.fuelUsed}`, `Chế độ: ${mode}`],
            gain: [
              `${label} ${targetName}`,
              `Lv ${result.before?.level ?? '?'} → ${result.after?.level ?? '?'}`,
              `EXP +${formatNumber(result.gainedExp)}`,
            ],
            stopReason: result.stopReason,
          }),
          { type: upgradeType, targetId, mode, maxSteps },
        );

        return sendJson(res, 200, { result, account: store.getAccount(id) });
      } catch (error) {
        logEvent(id, 'craftment.upgrade', 'error', runLog({
          done: 0,
          total: 1,
          stopReason: error.message,
        }), { type: upgradeType, targetId });
        throw error;
      }
    }
  }

  const gachaMatch = pathname.match(/^\/api\/accounts\/(\d+)\/gacha(?:\/draw)?$/);
  if (gachaMatch) {
    const id = parseId(gachaMatch[1]);
    const isDraw = pathname.endsWith('/draw');
    const account = store.getAccount(id);
    if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
    requireGachaAccount(account);

    if (!isDraw && req.method === 'GET') {
      const state = await withAccountLock(id, () =>
        withSession(store, game, id, (token) => readGachaState(game, token)),
      );
      return sendJson(res, 200, { state, account: store.getAccount(id) });
    }

    if (isDraw && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      requireConfirm(body, 'Cần xác nhận trước khi quay ninja.');
      const draws = Math.min(Math.max(toInt(body.draws, 1), 1), 100);

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, (token) => runGachaBatch(game, token, { draws })),
        );

        logEvent(
          id,
          'gacha.draw',
          result.completed > 0 ? 'success' : 'warn',
          runLog({
            done: result.completed,
            total: result.requested,
            cost: [`Gold: ${formatNumber(result.goldSpent ?? 0)}`, `Vòng: btn ${result.tier.btn} (3–5 sao)`],
            gain: result.results
              .filter((entry) => entry.ok)
              .map((entry) =>
                `${entry.name || `ninja #${entry.ninja}`} ${entry.star ?? '?'} sao`,
              ),
            stopReason: result.stopReason,
          }),
          { stopReason: result.stopReason },
        );

        return sendJson(res, 200, { result, account: store.getAccount(id) });
      } catch (error) {
        logEvent(id, 'gacha.draw', 'error', runLog({ done: 0, total: 1, stopReason: error.message }), { draws });
        throw error;
      }
    }
  }

  const bagMatch = pathname.match(
    /^\/api\/accounts\/(\d+)\/bag(?:\/(use-item|team|equip))?$/,
  );
  if (bagMatch) {
    const id = parseId(bagMatch[1]);
    const action = bagMatch[2];
    const account = store.getAccount(id);
    if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
    requireBagAccount(account);

    if (!action && req.method === 'GET') {
      const state = await withAccountLock(id, () =>
        withSession(store, game, id, (token) =>
          readBagState(game, token, { playerLevel: account.level }),
        ),
      );
      return sendJson(res, 200, { state, account: store.getAccount(id) });
    }

    if (action === 'use-item' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      const item = Number(body.item);
      const quantity = Math.min(Math.max(Number(body.quantity) || 1, 1), 99);
      if (!Number.isInteger(item) || item <= 0) {
        return sendJson(res, 400, { error: 'Vật phẩm không hợp lệ.' });
      }

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, async (token) => {
            const used = await game.useItem(token, item, quantity);
            const state = await readBagState(game, token, {
              playerLevel: account.level,
            });
            return { used, state };
          }),
        );
        const messages = describeUseResults(result.used);
        const ok = (Array.isArray(result.used) ? result.used : [result.used]).some(
          (row) => Number(row?.Result) === 1 || Number(row?.Result) === 2,
        );
        logEvent(
          id,
          'bag.use_item',
          ok ? 'success' : 'warn',
          runLog({
            done: ok ? quantity : 0,
            total: quantity,
            cost: [`Item ${item}: ${quantity}`],
            gain: messages,
            stopReason: ok ? null : messages.join(' | '),
          }),
          { item, quantity },
        );
        return sendJson(res, 200, {
          ok,
          results: result.used,
          messages,
          state: result.state,
          account: store.getAccount(id),
        });
      } catch (error) {
        logEvent(id, 'bag.use_item', 'error', runLog({ done: 0, total: 1, stopReason: error.message }), { item, quantity });
        throw error;
      }
    }

    if (action === 'team' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      const mode = body.action === 'swap' ? 'swap' : 'set';
      const slot = Number(body.slot);
      const ninjaId = Number(body.ninjaId);
      const slotA = Number(body.slotA);
      const slotB = Number(body.slotB);

      if (mode === 'set' && (!Number.isInteger(slot) || slot < 1 || slot > 10)) {
        return sendJson(res, 400, { error: 'Slot không hợp lệ.' });
      }
      if (mode === 'set' && (!Number.isInteger(ninjaId) || ninjaId <= 0)) {
        return sendJson(res, 400, { error: 'Ninja không hợp lệ.' });
      }
      if (
        mode === 'swap' &&
        (!Number.isInteger(slotA) ||
          !Number.isInteger(slotB) ||
          slotA < 1 ||
          slotB < 1 ||
          slotA > 10 ||
          slotB > 10 ||
          slotA === slotB)
      ) {
        return sendJson(res, 400, { error: 'Cặp slot đổi chỗ không hợp lệ.' });
      }

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, async (token) => {
            const response =
              mode === 'swap'
                ? await game.sql(token, 'P1TeamSwap', 'table', {
                    SlotA: slotA,
                    SlotB: slotB,
                  })
                : await game.sql(token, 'P1TeamSetNinja', 'table', {
                    Slot: slot,
                    NinjaId: ninjaId,
                  });
            const state = await readBagState(game, token, {
              playerLevel: account.level,
            });
            return { response, state };
          }),
        );

        const ok = Array.isArray(result.response)
          ? result.response.some(
              (row) => String(row?.Result) === '1' || row?.Result === 1,
            )
          : false;
        logEvent(
          id,
          'bag.team',
          ok ? 'success' : 'warn',
          runLog({
            done: ok ? 1 : 0,
            total: 1,
            gain: [
              mode === 'swap'
                ? `Đổi slot ${slotA} ↔ ${slotB}`
                : `Ninja #${ninjaId} → slot ${slot}`,
            ],
            stopReason: ok ? null : 'rejected',
          }),
          { mode, slot, ninjaId },
        );

        return sendJson(res, 200, {
          ok,
          response: result.response,
          state: result.state,
          account: store.getAccount(id),
        });
      } catch (error) {
        logEvent(id, 'bag.team', 'error', runLog({ done: 0, total: 1, stopReason: error.message }), {
          mode,
          slot,
          ninjaId,
          slotA,
          slotB,
        });
        throw error;
      }
    }

    if (action === 'equip' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      const slot = Number(body.slot);
      const equipId = Number(body.equipId);
      const equipSlot = Number(body.equipSlot);

      if (!Number.isInteger(slot) || slot < 1 || slot > 10) {
        return sendJson(res, 400, { error: 'Slot không hợp lệ.' });
      }
      if (equipSlot !== 1 && equipSlot !== 2) {
        return sendJson(res, 400, { error: 'Loại trang bị không hợp lệ.' });
      }
      if (!Number.isInteger(equipId) || equipId < 0) {
        return sendJson(res, 400, { error: 'Trang bị không hợp lệ.' });
      }

      try {
        const result = await withAccountLock(id, () =>
          withSession(store, game, id, async (token) => {
            const response = await game.sql(token, 'P1TeamSetEquip', 'table', {
              Slot: slot,
              EquipId: equipId,
              EquipSlot: equipSlot,
            });
            const state = await readBagState(game, token, {
              playerLevel: account.level,
            });
            return { response, state };
          }),
        );

        const ok = Array.isArray(result.response)
          ? result.response.some(
              (row) => String(row?.Result) === '1' || row?.Result === 1,
            )
          : false;
        logEvent(
          id,
          'bag.equip',
          ok ? 'success' : 'warn',
          runLog({
            done: ok ? 1 : 0,
            total: 1,
            gain: [
              equipId === 0
                ? `Tháo slot ${slot} (loại ${equipSlot})`
                : `Trang bị #${equipId} → slot ${slot}`,
            ],
            stopReason: ok ? null : 'rejected',
          }),
          { slot, equipId, equipSlot },
        );

        return sendJson(res, 200, {
          ok,
          response: result.response,
          state: result.state,
          account: store.getAccount(id),
        });
      } catch (error) {
        logEvent(id, 'bag.equip', 'error', runLog({ done: 0, total: 1, stopReason: error.message }), {
          slot,
          equipId,
          equipSlot,
        });
        throw error;
      }
    }
  }

  const match = pathname.match(
    /^\/api\/accounts\/(\d+)(?:\/(toggle|auto|login|logout|sync))?$/,
  );
  if (match) {
    const id = parseId(match[1]);
    const action = match[2];

    if (action === 'toggle' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      const account = store.toggleAccount(id, body.enabled);
      if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
      logEvent(
        id,
        'account.toggle',
        account.enabled ? 'success' : 'warn',
        runLog({ done: 1, total: 1, gain: [account.enabled ? 'Bật tài khoản' : 'Tắt tài khoản'] }),
      );
      return sendJson(res, 200, { account });
    }

    if (action === 'auto' && req.method === 'POST') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      try {
        const account = store.setAuto(id, body.enabled);
        if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
        logEvent(
          id,
          'account.auto',
          account.autoEnabled ? 'success' : 'info',
          runLog({ done: 1, total: 1, gain: [account.autoEnabled ? 'Bật Auto' : 'Tắt Auto'] }),
        );
        return sendJson(res, 200, { account });
      } catch (error) {
        logEvent(id, 'account.auto', 'warn', runLog({ done: 0, total: 1, stopReason: error.message }));
        throw error;
      }
    }

    if (action === 'login' && req.method === 'POST') {
      try {
        const account = await withAccountLock(id, () =>
          loginAccount(store, game, id),
        );
        logEvent(
          id,
          'session.login',
          'success',
          runLog({ done: 1, total: 1, gain: [`Đăng nhập ${account.characterName || account.username}`] }),
          { characterId: account.characterId },
        );
        return sendJson(res, 200, { account });
      } catch (error) {
        logEvent(id, 'session.login', 'error', runLog({ done: 0, total: 1, stopReason: error.message }));
        throw error;
      }
    }

    if (action === 'logout' && req.method === 'POST') {
      try {
        const account = await withAccountLock(id, () =>
          logoutAccount(store, game, id),
        );
        if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
        logEvent(id, 'session.logout', 'info', runLog({ done: 1, total: 1, gain: ['Đăng xuất'] }));
        return sendJson(res, 200, { account });
      } catch (error) {
        logEvent(id, 'session.logout', 'error', runLog({ done: 0, total: 1, stopReason: error.message }));
        throw error;
      }
    }

    if (action === 'sync' && req.method === 'POST') {
      try {
        const account = await withAccountLock(id, () =>
          syncAccount(store, game, id),
        );
        logEvent(
          id,
          'session.sync',
          'success',
          runLog({ done: 1, total: 1, gain: [`Đồng bộ ${account.characterName || account.username}`] }),
        );
        return sendJson(res, 200, { account });
      } catch (error) {
        logEvent(id, 'session.sync', 'error', runLog({ done: 0, total: 1, stopReason: error.message }));
        throw error;
      }
    }

    if (!action && req.method === 'PATCH') {
      const body = await readJsonBody(req, config.maxBodyBytes);
      const account = store.updateAccount(id, body);
      if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
      logEvent(
        id,
        'account.update',
        'info',
        runLog({ done: 1, total: 1, gain: [`Cập nhật ${account.username}`] }),
        { passwordChanged: Boolean(body.password) },
      );
      return sendJson(res, 200, { account });
    }

    if (!action && req.method === 'DELETE') {
      const account = store.getAccount(id);
      if (!account) return sendJson(res, 404, { error: 'Không tìm thấy tài khoản.' });
      store.deleteAccount(id);
      logEvent(
        null,
        'account.delete',
        'warn',
        runLog({ done: 1, total: 1, gain: [`Xóa ${account.username}`] }),
        { deletedAccountId: account.id },
        account.username,
      );
      return sendNoContent(res);
    }
  }

  return sendJson(res, 404, { error: 'Không tìm thấy API.' });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  try {
    if (url.pathname.startsWith('/api/')) {
      return await handleApi(req, res, url);
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      return await serveStatic(req, res, decodeURIComponent(url.pathname));
    }

    return sendJson(res, 405, { error: 'Phương thức không được hỗ trợ.' });
  } catch (error) {
    return sendError(res, error);
  }
});

server.listen(config.port, config.host, () => {
  console.log(`Naruto Bot đang chạy tại http://${config.host}:${config.port}`);
  console.log(`Dữ liệu: ${config.dataDir}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => {
      store.close();
      process.exit(0);
    });
  });
}

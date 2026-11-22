import { readDashboardState } from './dashboard.js';

/**
 * Co van: doc tong quan cua tung tai khoan (chi doc) va bien no thanh
 * danh sach viec nen lam theo thu tu uu tien. Ket qua duoc cache de tab
 * khong phai quet lai game moi lan mo.
 */

export const ADVISOR_TTL_MS = 10 * 60 * 1000;

const cache = new Map();

function pruneCache(accounts) {
  if (cache.size <= 50) return;
  const keep = new Set(accounts.map((account) => account.id));
  for (const id of cache.keys()) {
    if (!keep.has(id)) cache.delete(id);
  }
}

export function getAdvisorCache(accountId) {
  return cache.get(Number(accountId)) || null;
}

export function clearAdvisorCache(accountId) {
  if (accountId === undefined) cache.clear();
  else cache.delete(Number(accountId));
}

function describeUnavailable(account) {
  if (!account.enabled) return 'Tài khoản đang tắt.';
  if (account.status !== 'active' || !account.hasSession) {
    return 'Tài khoản chưa đăng nhập.';
  }
  return null;
}

function adviceFromDashboard(state) {
  return (state.suggestions || []).map((item, index) => ({
    priority: index + 1,
    title: item.title,
    detail: item.detail,
    risk: item.risk || 'low',
    targetView: item.targetView || null,
    actionLabel: item.actionLabel || null,
  }));
}

function countsFromDashboard(state) {
  const daily = state.daily || {};
  const boss = state.boss || {};
  const ultimate = state.ultimate || {};
  return {
    claimsReady:
      (daily.missionsReady || 0) +
      (daily.mailUnread || 0) +
      (daily.giftDayUnclaimed || 0) +
      (daily.giftUnclaimed || 0) +
      (daily.diamondUnclaimed || 0) +
      (daily.scratchFree ? 1 : 0),
    bossOpen: Boolean(boss.eventOpen && !boss.defeated),
    ultimatePending: Boolean(
      ultimate.atk?.pendingBuff ||
        ultimate.atk?.pendingReward ||
        ultimate.def?.pendingBuff ||
        ultimate.def?.pendingReward,
    ),
    energyPct: state.stamina?.energyPct ?? 0,
    bpPct: state.stamina?.bpPct ?? 0,
  };
}

function buildEntry(account, cached, now) {
  const unavailable = describeUnavailable(account);

  if (unavailable) {
    return {
      account,
      state: 'unavailable',
      reason: unavailable,
      scannedAt: cached ? new Date(cached.scannedAt).toISOString() : null,
      ageSeconds: cached ? Math.round((now - cached.scannedAt) / 1000) : null,
      stale: false,
      advice: [],
      alerts: [],
      counts: null,
      player: null,
      currency: null,
      stamina: null,
    };
  }

  if (!cached) {
    return {
      account,
      state: 'never',
      reason: 'Chưa quét tài khoản này.',
      scannedAt: null,
      ageSeconds: null,
      stale: false,
      advice: [],
      alerts: [],
      counts: null,
      player: null,
      currency: null,
      stamina: null,
    };
  }

  const ageMs = Math.max(0, now - cached.scannedAt);
  const data = cached.data;

  return {
    account,
    state: 'ready',
    reason: null,
    scannedAt: new Date(cached.scannedAt).toISOString(),
    ageSeconds: Math.round(ageMs / 1000),
    stale: ageMs > ADVISOR_TTL_MS,
    advice: adviceFromDashboard(data),
    alerts: data.alerts || [],
    counts: countsFromDashboard(data),
    player: data.player || null,
    currency: data.currency || null,
    stamina: data.stamina || null,
  };
}

export function buildAdvisorSnapshot(accounts, { now = Date.now() } = {}) {
  pruneCache(accounts);

  const entries = accounts.map((account) =>
    buildEntry(account, getAdvisorCache(account.id), now),
  );

  const totals = {
    accounts: entries.length,
    active: entries.filter(
      (entry) => entry.account.enabled && entry.account.status === 'active',
    ).length,
    scanned: entries.filter((entry) => entry.state === 'ready').length,
    stale: entries.filter((entry) => entry.stale).length,
    needsAction: entries.filter((entry) => entry.advice.length > 0).length,
    alerts: entries.reduce((sum, entry) => sum + entry.alerts.length, 0),
    claimsReady: entries.reduce(
      (sum, entry) => sum + (entry.counts?.claimsReady || 0),
      0,
    ),
    bossOpen: entries.filter((entry) => entry.counts?.bossOpen).length,
  };

  return {
    generatedAt: new Date(now).toISOString(),
    ttlSeconds: Math.round(ADVISOR_TTL_MS / 1000),
    totals,
    accounts: entries,
  };
}

/**
 * Doc lai mot tai khoan. Tra ve cache neu con han, tru khi force = true.
 */
export async function readAdvisorAccount(game, token, account, { force = false } = {}) {
  const cached = getAdvisorCache(account.id);
  if (!force && cached && Date.now() - cached.scannedAt < ADVISOR_TTL_MS) {
    return { cached: true, scannedAt: cached.scannedAt, data: cached.data };
  }

  const data = await readDashboardState(game, token, { account });
  const scannedAt = Date.now();
  cache.set(Number(account.id), { data, scannedAt });
  return { cached: false, scannedAt, data };
}

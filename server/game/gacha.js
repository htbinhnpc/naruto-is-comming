import { setTimeout as delay } from 'node:timers/promises';

import { isFatalGameError } from './client.js';

/**
 * Quay ninja (Recruit Hall / house-draw).
 *
 * api.md: btn 1/2/3/4 = 1.000 / 5.000 / 30.000 / 80.000 Vàng.
 * Vòng 80.000 (btn 4) là vòng duy nhất đảm bảo ra ninja 3-5 sao, nên tool
 * luôn quay vòng này. Không tiêu Kim cương, không mua lượt.
 */

const DRAW_GAP_MS = 250;

export const HOUSE_DRAW_TIERS = [
  { btn: 1, cost: 1000, label: '1.000 Vàng', note: '1 sao+' },
  { btn: 2, cost: 5000, label: '5.000 Vàng', note: '1 sao+' },
  { btn: 3, cost: 30000, label: '30.000 Vàng', note: '1 sao+' },
  { btn: 4, cost: 80000, label: '80.000 Vàng', note: '3–5 sao', best: true },
];

export const BEST_DRAW_TIER =
  HOUSE_DRAW_TIERS.find((tier) => tier.best) || HOUSE_DRAW_TIERS[HOUSE_DRAW_TIERS.length - 1];

function num(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function asRow(value) {
  if (Array.isArray(value)) return value[0] || null;
  if (value && typeof value === 'object') return value;
  return null;
}

async function readGold(game, token) {
  try {
    const main = asRow(await game.sql(token, 'P4MainLoad', 'row'));
    return num(main?.Gold);
  } catch (error) {
    if (isFatalGameError(error)) throw error;
    return null;
  }
}

/** Map template id -> tên ninja từ danh sách ninja đang có (Img = ninja/<id>). */
async function readNinjaNames(game, token) {
  const names = new Map();
  try {
    const rows = await game.sql(token, 'P3TeamNinjaList', 'table');
    for (const row of Array.isArray(rows) ? rows : []) {
      const id = num(String(row?.Img || '').split('/').pop());
      if (id && row?.Name) names.set(id, String(row.Name));
    }
  } catch (error) {
    if (isFatalGameError(error)) throw error;
  }
  return names;
}

/** Đọc Vàng hiện tại và số lượt có thể quay ở vòng tốt nhất. */
export async function readGachaState(game, token) {
  const gold = await readGold(game, token);
  const cost = BEST_DRAW_TIER.cost;
  const affordable = gold === null ? null : Math.max(0, Math.floor(gold / cost));

  return {
    gold,
    cost,
    bestTier: BEST_DRAW_TIER,
    tiers: HOUSE_DRAW_TIERS,
    affordable,
    canDraw: affordable !== null && affordable >= 1,
    readAt: new Date().toISOString(),
  };
}

/**
 * Quay liên tiếp số lượt yêu cầu, luôn dùng vòng tốt nhất (btn 4).
 * Dừng sớm và trả stopReason khi hết Vàng hoặc server từ chối.
 */
export async function runGachaBatch(game, token, { draws = 1, onStep } = {}) {
  const target = Math.trunc(num(draws) ?? 0);
  if (target < 1) {
    const error = new Error('Số lượt quay phải ít nhất là 1.');
    error.statusCode = 400;
    throw error;
  }

  const tier = BEST_DRAW_TIER;
  const results = [];
  let goldStart = await readGold(game, token);
  let goldEnd = goldStart;
  let stopReason = null;

  for (let draw = 1; draw <= target; draw += 1) {
    let payload;
    try {
      payload = await game.houseDraw(token, tier.btn);
    } catch (error) {
      if (isFatalGameError(error)) throw error;
      stopReason = 'api-error';
      const entry = {
        draw,
        btn: tier.btn,
        cost: tier.cost,
        ok: false,
        error: error.message,
      };
      results.push(entry);
      if (typeof onStep === 'function') onStep(entry);
      break;
    }

    const row = asRow(payload) || {};
    const result = num(row.Result);
    const gold = num(row.Gold);
    const ninja = num(row.Ninja);
    const entry = {
      draw,
      btn: tier.btn,
      cost: tier.cost,
      ok: result === 1,
      result,
      ninja,
      star: num(row.Star),
      gold,
      nextBtn: num(row.NextBtn),
      img: ninja ? `/assets/ninja/${ninja}.png` : null,
    };

    if (!entry.ok) {
      // Game trả Result 0 hoặc 2 khi không đủ Vàng / vòng chưa sẵn sàng.
      const insufficient = result === 0 || result === 2;
      entry.error = insufficient
        ? 'Không đủ Vàng cho vòng tốt nhất.'
        : 'Server không thực hiện lượt quay.';
      stopReason = insufficient ? 'insufficient-gold' : 'rejected';
    } else {
      goldEnd = gold ?? goldEnd;
    }

    results.push(entry);
    if (typeof onStep === 'function') onStep(entry);
    if (!entry.ok) break;
    await delay(DRAW_GAP_MS);
  }

  const names = await readNinjaNames(game, token);
  for (const entry of results) {
    if (entry.ok && entry.ninja) entry.name = names.get(entry.ninja) || null;
  }

  const wins = results.filter((entry) => entry.ok);
  const goldSpent =
    goldStart !== null && goldStart !== undefined && goldEnd !== null && goldEnd !== undefined
      ? goldStart - goldEnd
      : null;

  return {
    tier,
    requested: target,
    completed: wins.length,
    results,
    stopReason,
    goldStart,
    goldEnd,
    goldSpent,
    bestStars: wins.reduce((max, entry) => Math.max(max, entry.star ?? 0), 0),
    readAt: new Date().toISOString(),
  };
}

export function describeDraw(entry) {
  if (!entry) return '';
  if (!entry.ok) return `Lượt ${entry.draw}: ${entry.error || 'Không thành công.'}`;
  const label = entry.name
    ? `${entry.name} (#${entry.ninja ?? '?'})`
    : `ninja #${entry.ninja ?? '?'}`;
  return `Lượt ${entry.draw}: ${label} ${entry.star ?? '?'} sao`;
}

export function describeStopReason(reason) {
  const labels = {
    'insufficient-gold': 'Hết Vàng cho vòng tốt nhất',
    rejected: 'Server từ chối lượt quay',
    'api-error': 'Lỗi kết nối tới server game',
  };
  if (!reason) return 'Hoàn tất';
  return labels[reason] || String(reason);
}

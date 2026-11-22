import { isFatalGameError } from './client.js';
import { ValidationError } from '../db.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const pause = () => sleep(70 + Math.floor(Math.random() * 60));

/**
 * Cac muc co the nhan trong tab Daily.
 * Moi muc gom: doc trang thai (read) va nhan (claim).
 * Nguyen tac an toan: khong bao gio tieu Kim cuong.
 */
const FEATURES = [
  {
    id: 'mail',
    name: 'Thư',
    description: 'Nhận toàn bộ quà đang có trong hộp thư',
    icon: 'mail',
    read: readMail,
    claim: claimMail,
  },
  {
    id: 'login',
    name: 'Thưởng đăng nhập',
    description: 'Quà đăng nhập 7 ngày trong tuần',
    icon: 'gift',
    read: readLoginGift,
    claim: claimLoginGift,
  },
  {
    id: 'online',
    name: 'Thưởng online',
    description: 'Thưởng theo thời gian online trong ngày',
    icon: 'clock',
    read: readOnlineGift,
    claim: claimOnlineGift,
  },
  {
    id: 'mission',
    name: 'Thưởng nhiệm vụ',
    description: 'Các nhiệm vụ ngày / tuần / tháng đã hoàn thành',
    icon: 'tasks',
    read: readMissions,
    claim: claimMissions,
  },
  {
    id: 'turnplate',
    name: 'Vòng quay miễn phí',
    description: 'Dùng hết lượt quay miễn phí, không quay tốn Kim cương',
    icon: 'wheel',
    read: readTurnplate,
    claim: claimTurnplate,
  },
  {
    id: 'scratch',
    name: 'Cào thẻ miễn phí',
    description: 'Cào thẻ miễn phí trong ngày',
    icon: 'ticket',
    read: readScratch,
    claim: claimScratch,
  },
  {
    id: 'levelGift',
    name: 'Quà cấp độ',
    description: 'Các mốc quà cấp độ đã mở nhưng chưa nhận',
    icon: 'star',
    read: readLevelGifts,
    claim: claimLevelGifts,
  },
  {
    id: 'diamond',
    name: 'Mốc tiêu Kim cương',
    description: 'Nhận thưởng mốc chi tiêu Kim cương trong ngày',
    icon: 'gem',
    read: readDiamondMilestone,
    claim: claimDiamondMilestone,
  },
];

export async function getDailyStatus(game, token) {
  const features = await collectStatus({ game, token });
  return {
    syncedAt: new Date().toISOString(),
    features: features.map(toPublicFeature),
  };
}

export async function claimDailyFeature(game, token, featureId) {
  const feature = FEATURES.find((item) => item.id === featureId);
  if (!feature) {
    throw new ValidationError('Tính năng nhận thưởng không hợp lệ.');
  }

  const ctx = { game, token };
  const status = await feature.read(ctx);
  if (!status.available) {
    return {
      feature: feature.id,
      name: feature.name,
      ok: false,
      skipped: true,
      message: status.detail,
    };
  }

  const result = await feature.claim(ctx, status);
  return { feature: feature.id, name: feature.name, ...result };
}

export async function claimAllDaily(game, token) {
  const features = await collectStatus({ game, token });
  const results = [];

  for (const feature of features) {
    if (!feature.available) {
      results.push({
        feature: feature.id,
        name: feature.name,
        ok: false,
        skipped: true,
        message: feature.detail,
      });
      continue;
    }

    try {
      const result = await feature.claim({ game, token }, feature);
      results.push({ feature: feature.id, name: feature.name, ...result });
    } catch (error) {
      if (isFatalGameError(error)) throw error;
      results.push({
        feature: feature.id,
        name: feature.name,
        ok: false,
        message: error.message,
      });
    }

    await sleep(130 + Math.floor(Math.random() * 80));
  }

  return results;
}

async function collectStatus(ctx) {
  const features = [];

  for (const feature of FEATURES) {
    try {
      const status = await feature.read(ctx);
      features.push({ ...feature, ...status });
    } catch (error) {
      if (isFatalGameError(error)) throw error;
      features.push({
        ...feature,
        available: false,
        detail: 'Không đọc được trạng thái',
        error: true,
      });
    }
    await pause();
  }

  return features;
}

function toPublicFeature(feature) {
  return {
    id: feature.id,
    name: feature.name,
    description: feature.description,
    icon: feature.icon,
    available: Boolean(feature.available),
    count: feature.count ?? null,
    detail: feature.detail,
  };
}

async function optionalSql(ctx, procedure, kind = 'row', params = {}) {
  try {
    return await ctx.game.sql(ctx.token, procedure, kind, params);
  } catch (error) {
    if (isFatalGameError(error)) throw error;
    return null;
  }
}

/* ------------------------------ Readers ------------------------------ */

async function readMail(ctx) {
  const flag = await optionalSql(ctx, 'P1MailHasGift', 'scalar');

  if (flag && flag.value !== undefined && flag.value !== null) {
    const has = String(flag.value) === '1';
    return {
      available: has,
      detail: has ? 'Có thư chưa nhận' : 'Không có thư mới',
    };
  }

  const rows = asRows(await optionalSql(ctx, 'P4Mail', 'table'));
  const unclaimed = rows.filter(isUnclaimedMail).length;
  return {
    available: unclaimed > 0,
    count: unclaimed || null,
    detail: unclaimed > 0 ? `${unclaimed} thư chưa nhận` : 'Không có thư mới',
  };
}

async function readLoginGift(ctx) {
  const rows = asRows(await optionalSql(ctx, 'P3GiftDay', 'table'));
  const today = num(rows[0]?.Today);
  const unclaimed = rows.filter(
    (row) => num(row.Unlocked) === 1 && num(row.Claimed) === 0,
  );
  // Uu tien dung ngay Today; neu server khong tra Today thi lay muc dau tien.
  const ready =
    unclaimed.find((row) => today === null || num(row.Day) === today) ||
    unclaimed[0];

  if (!ready) {
    return { available: false, detail: 'Chưa có quà đăng nhập hôm nay' };
  }

  // Theo api.md, @Day cua P1GiftDayClaim la gia tri Today, khong phai Day.
  const labelDay = num(ready.Day) ?? num(ready.Today);
  const claimDay = num(ready.Today) ?? num(ready.Day);
  if (claimDay === null) {
    return { available: false, detail: 'Không đọc được ngày nhận quà' };
  }

  const reward = ready.GiftName
    ? `${ready.GiftName}${num(ready.Quantity) ? ` ×${ready.Quantity}` : ''}`
    : 'quà đăng nhập';

  return {
    available: true,
    count: 1,
    detail: `Ngày ${labelDay ?? claimDay}: ${reward}`,
    params: { Day: claimDay },
  };
}

async function readOnlineGift(ctx) {
  const status = await optionalSql(ctx, 'P3GiftTimeStatus', 'row', { Minutes: 0 });

  if (status) {
    const claimed = num(status.Claimed);
    const granted = num(status.Granted);
    const canClaim = num(status.CanClaim) ?? num(status.Available);
    if (claimed === 1 || granted === 1 || canClaim === 0) {
      return { available: false, detail: 'Đã nhận thưởng online' };
    }

    const minute = num(status.Minute);
    const reward = status.Name
      ? `${status.Name}${num(status.Quantity) ? ` ×${status.Quantity}` : ''}`
      : 'thưởng online';
    return {
      available: true,
      detail:
        minute !== null ? `Mốc ${minute} phút: ${reward}` : 'Có thưởng online đang chờ',
    };
  }

  return {
    available: true,
    detail: 'Nhận thưởng theo thời gian online',
  };
}

async function readMissions(ctx) {
  const rows = asRows(await optionalSql(ctx, 'P3MissionList', 'table'));
  const ready = rows
    .filter((row) => num(row.State) === 1 && num(row.Id) !== null)
    .slice(0, 30);

  return {
    available: ready.length > 0,
    count: ready.length,
    detail:
      ready.length > 0
        ? `${ready.length} nhiệm vụ có thưởng`
        : 'Không có nhiệm vụ nào để nhận',
    items: ready.map((row) => ({
      id: num(row.Id),
      name: row.Name || `Nhiệm vụ ${row.Id}`,
      reward: row.RewardName || null,
      qty: num(row.RewardQty),
    })),
  };
}

async function readTurnplate(ctx) {
  const main = ctx.main ?? (await optionalSql(ctx, 'P4MainLoad', 'row'));
  const free = num(main?.TurnplateFreeCount);

  if (free === null) {
    return {
      available: false,
      detail: 'Không đọc được lượt quay miễn phí',
    };
  }

  return {
    available: free > 0,
    count: free,
    detail:
      free > 0 ? `${free} lượt quay miễn phí` : 'Không có lượt quay miễn phí',
    params: { times: Math.min(free, 10) },
  };
}

async function readScratch(ctx) {
  const row = await optionalSql(ctx, 'P2Scratch', 'row');
  const free = num(row?.FreeAvailable);

  if (free === null) {
    return {
      available: false,
      detail: 'Không đọc được lượt cào miễn phí',
    };
  }

  return {
    available: free === 1,
    count: free === 1 ? 1 : 0,
    detail:
      free === 1
        ? '1 lượt cào miễn phí'
        : 'Đã dùng lượt cào miễn phí hôm nay',
  };
}

async function readLevelGifts(ctx) {
  const rows = asRows(await optionalSql(ctx, 'P3Gift', 'table'));
  const ready = rows
    .filter(
      (row) =>
        num(row.Unlocked) === 1 &&
        num(row.Claimed) === 0 &&
        num(row.Tier) !== null,
    )
    .slice(0, 24);

  return {
    available: ready.length > 0,
    count: ready.length,
    detail:
      ready.length > 0
        ? `${ready.length} mốc quà chưa nhận`
        : 'Không có quà cấp độ',
    params: { tiers: ready.map((row) => num(row.Tier)) },
  };
}

async function readDiamondMilestone(ctx) {
  const row = await optionalSql(ctx, 'P4DiamondSpending', 'row');
  if (!row) {
    return {
      available: false,
      detail: 'Không đọc được mốc tiêu Kim cương',
    };
  }

  const spent = num(row.TodaySpent) ?? 0;
  const next = num(row.NextMilestone);
  const available = next !== null && next > 0 && spent >= next;

  return {
    available,
    count: available ? 1 : 0,
    detail: available
      ? `Đạt mốc ${next} KC (đã tiêu ${spent})`
      : `Chưa đạt mốc tiếp theo (${spent}/${next ?? '—'} KC)`,
    params: { milestone: next },
  };
}

/* ------------------------------ Claims ------------------------------ */

async function claimMail(ctx) {
  const result = await ctx.game.sql(ctx.token, 'P1MailClaimAll', 'row');
  if (!isOk(result)) {
    return fail('Không nhận được thư.');
  }
  return ok('Đã nhận toàn bộ thư.');
}

async function claimLoginGift(ctx, status) {
  const result = await ctx.game.sql(ctx.token, 'P1GiftDayClaim', 'row', {
    Day: status.params.Day,
  });
  if (!isOk(result)) {
    return fail('Không nhận được quà đăng nhập.');
  }
  return ok(`Đã nhận quà đăng nhập (${status.detail}).`);
}

async function claimOnlineGift(ctx) {
  const result = await ctx.game.sql(ctx.token, 'P3GiftTimeClaim', 'row');
  if (!isOk(result)) {
    return fail('Chưa đủ thời gian online hoặc đã nhận rồi.');
  }
  return ok(describeReward(result) || 'Đã nhận thưởng online.');
}

async function claimMissions(ctx, status) {
  const items = status.items ?? [];
  if (items.length === 0) {
    return fail('Không có nhiệm vụ nào để nhận.');
  }

  let claimed = 0;
  let lastError = null;

  for (const item of items) {
    try {
      const result = await ctx.game.sql(ctx.token, 'P1MissionClaim2', 'row', {
        MissionId: item.id,
      });
      if (isOk(result)) {
        claimed += 1;
      } else {
        lastError = `Nhiệm vụ ${item.id} bị từ chối.`;
      }
    } catch (error) {
      if (isFatalGameError(error)) throw error;
      lastError = error.message;
    }
    await sleep(110 + Math.floor(Math.random() * 60));
  }

  if (claimed === 0) {
    return fail(lastError || 'Không nhận được nhiệm vụ nào.');
  }

  const suffix = claimed < items.length ? ` (${items.length - claimed} lỗi)` : '';
  return ok(`Đã nhận ${claimed}/${items.length} nhiệm vụ${suffix}.`);
}

async function claimTurnplate(ctx, status) {
  const times = num(status.params?.times) ?? 0;
  if (times <= 0) {
    return fail('Không có lượt quay miễn phí.');
  }

  const result = await ctx.game.sql(ctx.token, 'P1TurnplateSpin', 'row', {
    Times: times,
  });
  if (!isOk(result)) {
    return fail('Không quay được vòng quay miễn phí.');
  }

  const reward = describeReward(result);
  return ok(
    reward
      ? `Đã quay ${times} lượt: ${reward}.`
      : `Đã quay ${times} lượt miễn phí.`,
  );
}

async function claimScratch(ctx, status) {
  // Doc lai de chac chan van con luot mien phi truoc khi cao.
  const fresh = await readScratch(ctx);
  if (!fresh.available) {
    return fail(fresh.detail);
  }

  const result = await ctx.game.sql(ctx.token, 'P1Scratch', 'row');
  if (!isOk(result)) {
    return fail('Không cào được thẻ miễn phí.');
  }

  const win = num(result?.WinDiamond) ?? 0;
  return ok(
    win > 0
      ? `Cào thẻ miễn phí: thắng ${win} Kim cương.`
      : 'Đã cào thẻ miễn phí (không trúng).',
  );
}

async function claimLevelGifts(ctx, status) {
  const tiers = status.params?.tiers ?? [];
  if (tiers.length === 0) {
    return fail('Không có quà cấp độ để nhận.');
  }

  let claimed = 0;
  let lastError = null;

  for (const tier of tiers) {
    try {
      const result = await ctx.game.sql(ctx.token, 'P1GiftClaim', 'row', {
        Tier: tier,
      });
      if (isOk(result)) {
        claimed += 1;
      } else {
        lastError = `Mốc ${tier} bị từ chối.`;
      }
    } catch (error) {
      if (isFatalGameError(error)) throw error;
      lastError = error.message;
    }
    await sleep(100 + Math.floor(Math.random() * 50));
  }

  if (claimed === 0) {
    return fail(lastError || 'Không nhận được quà cấp độ nào.');
  }

  return ok(`Đã nhận ${claimed}/${tiers.length} mốc quà cấp độ.`);
}

async function claimDiamondMilestone(ctx, status) {
  const milestone = num(status.params?.milestone);
  if (milestone === null) {
    return fail('Không đọc được mốc Kim cương.');
  }

  const result = await ctx.game.sql(
    ctx.token,
    'P1DiamondSpendingClaim',
    'row',
    { Milestone: milestone },
  );
  const code = resultCode(result);

  if (code === 1 || code === null) {
    return ok(`Đã nhận thưởng mốc ${milestone} Kim cương.`);
  }
  if (code === 3) {
    return fail('Chưa đạt mốc chi tiêu này.');
  }
  if (code === 4) {
    return fail('Mốc này đã nhận rồi.');
  }
  return fail('Không nhận được thưởng mốc Kim cương.');
}

/* ------------------------------ Helpers ------------------------------ */

function ok(message) {
  return { ok: true, message };
}

function fail(message) {
  return { ok: false, message };
}

function asRows(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') return [data];
  return [];
}

function num(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function resultCode(payload) {
  const row = Array.isArray(payload) ? payload[0] : payload;
  if (!row || typeof row !== 'object') return null;
  if (row.Result !== undefined) return num(row.Result);
  if (row.result !== undefined) return num(row.result);
  return null;
}

function isOk(payload) {
  const code = resultCode(payload);
  return code === null || code === 1;
}

function describeReward(payload) {
  const row = Array.isArray(payload) ? payload[0] : payload;
  if (!row || typeof row !== 'object') return '';

  const parts = [];
  if (row.Name) {
    parts.push(`${row.Name}${num(row.Quantity) ? ` ×${row.Quantity}` : ''}`);
  }
  if (num(row.WinDiamond) > 0) parts.push(`${row.WinDiamond} Kim cương`);
  if (num(row.Diamond) > 0) parts.push(`${row.Diamond} Kim cương`);
  if (num(row.Gold) > 0) parts.push(`${row.Gold} vàng`);
  if (num(row.Energy) > 0) parts.push(`${row.Energy} năng lượng`);
  if (num(row.BP) > 0) parts.push(`${row.BP} BP`);

  return parts.join(', ');
}

function isUnclaimedMail(row) {
  if (!row || typeof row !== 'object') return false;
  if (row.Claimed !== undefined) return num(row.Claimed) === 0;
  if (row.IsClaim !== undefined) return num(row.IsClaim) === 0;
  if (row.State !== undefined) return num(row.State) === 1;
  if (row.IsGift !== undefined) return num(row.IsGift) === 1;
  return false;
}

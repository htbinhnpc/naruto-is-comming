import { setTimeout as delay } from 'node:timers/promises';

import { isFatalGameError } from './client.js';

/**
 * Craftment: nang cap ninja / trang bi bang cach "an" (feed) ninja/gear khac.
 *
 * P1NinjaUpgrade / P1EquipUpgrade can @Id (target) + @FuelIds = N'id,id,...'.
 * P3*UpgradeAuto tra danh sach fuel duoc server de xuat, da sap xep theo FuelExp.
 * P3*UpgradeFuel co them Valuable / NeedConfirm de tranh an nhan quan trong.
 */

const STEP_GAP_MS = 180;
const DEFAULT_MAX_STEPS = 20;
const MAX_STEPS = 100;

const TYPES = {
  ninja: {
    label: 'ninja',
    picker: 'P3NinjaUpgradePicker',
    fuel: 'P3NinjaUpgradeFuel',
    auto: 'P3NinjaUpgradeAuto',
    upgrade: 'P1NinjaUpgrade',
    folder: 'ninja',
  },
  equip: {
    label: 'trang bị',
    picker: 'P3EquipUpgradePicker',
    fuel: 'P3EquipUpgradeFuel',
    auto: 'P3EquipUpgradeAuto',
    upgrade: 'P1EquipUpgrade',
    folder: 'equip',
  },
};

function configFor(type) {
  return TYPES[type === 'equip' ? 'equip' : 'ninja'];
}

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

async function read(game, token, procedure, kind, params = {}) {
  try {
    return await game.sql(token, procedure, kind, params);
  } catch (error) {
    if (isFatalGameError(error)) throw error;
    return null;
  }
}

function imageUrl(folder, img) {
  const text = String(img || '').trim();
  if (!text) return null;
  const id = text.split('/').pop();
  return id ? `/assets/${folder}/${id}.png` : null;
}

function normalizeTarget(row, cfg) {
  return {
    id: num(row.Id),
    name: row.Name2 || row.Name || '?',
    name2: row.Name2 || null,
    star: num(row.Star),
    level: num(row.Lv),
    exp: num(row.LvExp),
    equipped: Boolean(row.IsEquip),
    attribute: num(row.Attribute),
    img: imageUrl(cfg.folder, row.Img),
  };
}

function normalizeFuel(row, cfg) {
  const valuable = num(row.Valuable) === 1;
  const needConfirm = num(row.NeedConfirm) === 1;
  return {
    id: num(row.Id),
    name: row.Name2 || row.Name || '?',
    star: num(row.Star),
    level: num(row.Lv),
    exp: num(row.FuelExp ?? row.LvExp) ?? 0,
    valuable,
    needConfirm,
    safe: !valuable && !needConfirm,
    img: imageUrl(cfg.folder, row.Img),
  };
}

/** Danh sach muc tieu co the nang cap + Vang / Level nhan vat. */
export async function readCraftState(game, token, { type = 'ninja' } = {}) {
  const cfg = configFor(type);
  const targets = asRows(await read(game, token, cfg.picker, 'table')).map((row) =>
    normalizeTarget(row, cfg),
  );
  const main = asRow(await read(game, token, 'P4MainLoad', 'row'));

  return {
    type: cfg.label === 'ninja' ? 'ninja' : 'equip',
    targets,
    playerLevel: num(main?.Lv),
    gold: num(main?.Gold),
    readAt: new Date().toISOString(),
  };
}

function asRow(value) {
  if (Array.isArray(value)) return value[0] || null;
  if (value && typeof value === 'object') return value;
  return null;
}

/** Fuel cua 1 muc tieu + danh sach fuel server goi y (auto). */
export async function readCraftFuel(game, token, { type = 'ninja', targetId } = {}) {
  const cfg = configFor(type);
  const id = num(targetId);
  if (!id) {
    const error = new Error('Chọn ninja hoặc trang bị cần nâng cấp.');
    error.statusCode = 400;
    throw error;
  }

  const rows = asRows(
    await read(game, token, cfg.fuel, 'table', { ExcludeId: id }),
  );
  const autoRows = asRows(
    await read(game, token, cfg.auto, 'table', { TargetId: id }),
  );
  const fuel = rows.map((row) => normalizeFuel(row, cfg));
  const autoIds = autoRows.map((row) => num(row.Id)).filter(Boolean);
  const byId = new Map(fuel.map((entry) => [entry.id, entry]));

  return {
    type: cfg.label === 'ninja' ? 'ninja' : 'equip',
    targetId: id,
    fuel,
    autoIds,
    safeIds: autoIds.filter((fuelId) => byId.get(fuelId)?.safe),
    totalFuelExp: fuel.reduce((sum, entry) => sum + entry.exp, 0),
    readAt: new Date().toISOString(),
  };
}

/**
 * An fuel vao target, moi lan 1 mon de dung o nguong cap.
 * mode = safe | all | custom (custom can fuelIds).
 */
export async function runCraftBatch(
  game,
  token,
  { type = 'ninja', targetId, mode = 'safe', maxSteps = DEFAULT_MAX_STEPS, fuelIds = [], onStep } = {},
) {
  const typeKey = type === 'equip' ? 'equip' : 'ninja';
  const cfg = configFor(typeKey);
  const id = num(targetId);
  if (!id) {
    const error = new Error('Chọn ninja hoặc trang bị cần nâng cấp.');
    error.statusCode = 400;
    throw error;
  }

  const limit = Math.min(
    MAX_STEPS,
    Math.max(1, Math.trunc(num(maxSteps) ?? DEFAULT_MAX_STEPS)),
  );
  const chosenMode = ['safe', 'all', 'custom'].includes(mode) ? mode : 'safe';
  const { autoIds, safeIds, fuel } = await readCraftFuel(game, token, {
    type: typeKey,
    targetId: id,
  });

  let ids;
  if (chosenMode === 'safe') ids = safeIds;
  else if (chosenMode === 'all') ids = autoIds;
  else {
    const allowed = new Set(fuel.map((entry) => entry.id));
    ids = (Array.isArray(fuelIds) ? fuelIds : [])
      .map(num)
      .filter((fuelId) => allowed.has(fuelId));
  }
  ids = ids.slice(0, limit);
  if (ids.length === 0) {
    return {
      type: typeKey,
      targetId: id,
      mode: chosenMode,
      steps: [],
      fuelUsed: 0,
      before: null,
      after: null,
      stopReason: 'no-fuel',
      gainedExp: 0,
      wastedExp: 0,
      readAt: new Date().toISOString(),
    };
  }

  const targets = asRows(await read(game, token, cfg.picker, 'table'));
  const before = targets.find((row) => num(row.Id) === id)
    ? normalizeTarget(targets.find((row) => num(row.Id) === id), cfg)
    : null;

  const steps = [];
  let gainedExp = 0;
  let wastedExp = 0;
  let stopReason = null;
  let after = before;

  for (const fuelId of ids) {
    let payload;
    try {
      payload = await game.sql(token, cfg.upgrade, 'table', {
        Id: id,
        FuelIds: String(fuelId),
      });
    } catch (error) {
      if (isFatalGameError(error)) throw error;
      stopReason = 'api-error';
      steps.push({ fuelId, ok: false, error: error.message });
      break;
    }

    const row = asRow(payload) || {};
    const result = num(row.Result);
    const currentExp = num(row.LvExp);
    const prevExp = after?.exp ?? null;
    // P1EquipUpgrade khong tra Gained -> tinh theo delta LvExp.
    const fallbackGain =
      prevExp !== null && currentExp !== null && currentExp > prevExp
        ? currentExp - prevExp
        : 0;
    const entry = {
      fuelId,
      ok: result === 1,
      result,
      level: num(row.Lv),
      exp: currentExp,
      gained: num(row.Gained) ?? fallbackGain,
      wasted: num(row.Wasted) ?? 0,
    };
    if (!entry.ok) {
      entry.error = 'Server không nâng cấp được (có thể đã đạt cấp tối đa).';
      stopReason = 'level-cap';
    } else {
      gainedExp += entry.gained;
      wastedExp += entry.wasted;
      after = {
        ...(after || {}),
        id,
        level: entry.level ?? after?.level ?? null,
        exp: entry.exp ?? after?.exp ?? null,
      };
      // Wasted > 0: thừa EXP do chạm trần level -> dung ngay.
      if (entry.wasted > 0) stopReason = 'level-cap';
    }
    steps.push(entry);
    if (typeof onStep === 'function') onStep(entry);
    if (stopReason) break;
    await delay(STEP_GAP_MS);
  }

  return {
    type: typeKey,
    targetId: id,
    mode: chosenMode,
    steps,
    before,
    after,
    stopReason,
    gainedExp,
    wastedExp,
    fuelUsed: steps.filter((step) => step.ok).length,
    readAt: new Date().toISOString(),
  };
}

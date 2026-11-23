import { setTimeout as delay } from 'node:timers/promises';
import { isFatalGameError } from './client.js';
import { readTeamState } from './team.js';

/**
 * Doc tui do tu cac procedure P4Bag*.
 *
 * Luu y: khi tui trong, server chi tra ve mot dong header gom
 * Gold/Diamond/Energy/BP. Vi vay phan lon noi dung cua tab nay den tu
 * P3TeamNinjaList / P3NinjaAttributePicker / P3TeamEquipList.
 */

const READ_GAP_MS = 130;

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

function imageUrl(folder, path) {
  const text = String(path || '').trim();
  if (!text) return null;
  const id = text.split('/').pop();
  return id ? `/assets/${folder}/${id}.png` : null;
}

async function readProcedure(game, token, procedure, kind = 'table', params = {}) {
  try {
    return await game.sql(token, procedure, kind, params);
  } catch (error) {
    if (isFatalGameError(error)) throw error;
    return null;
  }
}

function isCurrencyHeader(row) {
  return (
    row &&
    typeof row === 'object' &&
    !row.Item &&
    !row.ItemId &&
    !row.Id &&
    !row.Name &&
    (row.Gold !== undefined ||
      row.Diamond !== undefined ||
      row.Energy !== undefined ||
      row.BP !== undefined)
  );
}

function parseStack(row, source) {
  const id = num(
    row.Item ?? row.ItemId ?? row.Id ?? row.Equip ?? row.Ninja ?? row.Gift ?? row.GiftItem,
  );
  const name =
    row.Name ||
    row.Name2 ||
    row.ItemName ||
    row.GiftName ||
    row.Title ||
    null;
  const img = row.Img || row.GiftImg || row.ItemImg || null;
  const quantity = num(
    row.Quantity ?? row.Qty ?? row.Count ?? row.Cnt ?? row.Stack ?? row.Num ?? row.GiftQty,
  );

  if (!id && !name) return null;

  return {
    id,
    name: name || `Vật phẩm ${id ?? ''}`.trim(),
    img,
    icon: imageUrl('item', img),
    quantity: quantity ?? 1,
    useType: num(row.UseType ?? row.Type),
    star: num(row.Star),
    source,
    raw: row,
  };
}

function parseRows(rows, source) {
  const result = [];
  for (const row of rows) {
    if (!row || typeof row !== 'object' || isCurrencyHeader(row)) continue;
    const parsed = parseStack(row, source);
    if (parsed) result.push(parsed);
  }
  return result;
}

function findHeader(rows) {
  for (const row of rows) {
    if (isCurrencyHeader(row)) return row;
  }
  return null;
}

/**
 * P4Bag* tra 2 result set: set 0 la header Gold/Diamond/Energy/BP,
 * set 1 moi la danh sach that. sql/table chi doc set 0 nen phai dung dataset.
 */
async function readBagRows(game, token, procedure) {
  if (typeof game.sqlDataset === 'function') {
    try {
      const sets = await game.sqlDataset(token, procedure);
      if (Array.isArray(sets)) return sets.flatMap((set) => asRows(set));
      return asRows(sets);
    } catch (error) {
      if (isFatalGameError(error)) throw error;
    }
  }
  return asRows(await readProcedure(game, token, procedure, 'table'));
}

/** Doc toan bo tui do + doi hinh de biet mon nao dang duoc mac. */
export async function readBagState(game, token, { playerLevel = 1 } = {}) {
  const team = await readTeamState(game, token, { playerLevel });

  const itemRows = await readBagRows(game, token, 'P4BagItem');
  await delay(READ_GAP_MS);

  const equipStackRows = await readBagRows(game, token, 'P4BagEquipStack');
  await delay(READ_GAP_MS);

  const ninjaStackRows = await readBagRows(game, token, 'P4BagNinjaStack');
  await delay(READ_GAP_MS);

  const gemRows = await readBagRows(game, token, 'P4BagGem');

  const header =
    findHeader(itemRows) ||
    findHeader(equipStackRows) ||
    findHeader(ninjaStackRows) ||
    findHeader(gemRows);

  const currency = {
    gold: num(header?.Gold),
    diamond: num(header?.Diamond),
    energy: num(header?.Energy),
    bp: num(header?.BP),
  };

  const ninjaById = new Map(team.ninjas.map((ninja) => [ninja.id, ninja]));

  const equipment = team.equipment.map((item) => ({
    ...item,
    equippedNinjaName: item.equippedBy
      ? ninjaById.get(item.equippedBy)?.name || null
      : null,
  }));

  // Ninja/equip stack khong phai "vat pham" — de rieng de khong hien sai tab.
  const items = parseRows(itemRows, 'item');
  const ninjaStacks = parseRows(ninjaStackRows, 'ninja-stack');
  const equipStacks = parseRows(equipStackRows, 'equip-stack');

  const gems = parseRows(gemRows, 'gem');

  const counts = {
    ninjas: team.ninjas.length,
    equipment: equipment.length,
    equipped: equipment.filter((item) => item.equippedBy).length,
    items: items.length,
    gems: gems.length,
  };

  return {
    playerLevel: team.playerLevel,
    slots: team.slots,
    ninjas: team.ninjas,
    equipment,
    items,
    ninjaStacks,
    equipStacks,
    gems,
    currency,
    counts,
    teamPower: team.teamPower,
    readAt: new Date().toISOString(),
  };
}

export function describeUseResults(results) {
  const rows = Array.isArray(results) ? results : [results];
  const messages = [];

  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const result = Number(row.Result);
    if (result === 2) {
      messages.push(
        `Mở được ${row.Name || row.Name2 || 'vật phẩm'}${row.Star ? ` ${row.Star} sao` : ''}.`,
      );
    } else if (result === 6) {
      messages.push('Không dùng được: đã đạt giới hạn ngày hoặc trạng thái không phù hợp.');
    } else if (result === 1) {
      if (row.Gained !== undefined && row.Gained !== null) {
        const gained = Number(row.Gained);
        const label =
          row.UseType === 2
            ? 'Kim cương'
            : row.UseType === 3
              ? 'Năng lượng'
              : row.UseType === 4
                ? 'BP'
                : 'Vàng';
        messages.push(`Nhận ${gained} ${label}.`);
      } else {
        messages.push('Đã dùng vật phẩm.');
      }
    } else {
      messages.push('Server không thực hiện thao tác (Result 0).');
    }
  }

  return messages.length > 0 ? messages : ['Không có phản hồi từ server.'];
}

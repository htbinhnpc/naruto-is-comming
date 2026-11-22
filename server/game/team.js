import { setTimeout as delay } from 'node:timers/promises';
import { isFatalGameError } from './client.js';

/**
 * Doc va tinh toan doi hinh tu API SQL cua game.
 *
 * Nguon du lieu:
 *  - P3Team              : 13 dong slot, kem chi so tong, bond, trang bi cua tung ninja.
 *  - P3TeamNinjaList     : danh sach ninja so huu (khong co chi so).
 *  - P3NinjaAttributePicker @Mode=0 : chi so Atk/Def cua toan bo ninja so huu.
 *  - P3SlotUnlock        : cap mo khoa cua 10 slot.
 *  - P3TeamPower         : luc chien doi hinh.
 *  - P2BattleTeamStat    : tong Atk/Def cua doi hinh.
 *  - P3TeamEquipList     : kho trang bi theo loai (1 = vu khi, 2 = giap).
 *
 * Luu y: chi ninja dang nam trong doi moi co du lieu bond. Vi vay phan
 * "doi hinh manh nhat" chi co the uu tien bond da biet; cac ninja ngoai doi
 * duoc tinh theo chi so va trang bi.
 */

export const UI_SLOT_COUNT = 10;

export const ELEMENT_META = {
  1: { key: 'fire', name: 'Hỏa', icon: '/assets/attribute/1.png' },
  2: { key: 'wind', name: 'Phong', icon: '/assets/attribute/2.png' },
  3: { key: 'water', name: 'Thủy', icon: '/assets/attribute/3.png' },
  4: { key: 'lightning', name: 'Lôi', icon: '/assets/attribute/4.png' },
  5: { key: 'earth', name: 'Thổ', icon: '/assets/attribute/5.png' },
};

export const TIER_META = {
  0: { key: 'normal', name: 'Thường' },
  1: { key: 'super', name: 'Super' },
  2: { key: 'kage', name: 'Kage' },
};

export const ROLE_META = {
  atk: { key: 'atk', name: 'Công' },
  def: { key: 'def', name: 'Thủ' },
};

const READ_GAP_MS = 130;
const MUTATE_GAP_MS = 380;
const MAX_CANDIDATES = 20;
const MAX_COMBINATIONS = 260000;

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

function lower(value) {
  return String(value || '').trim().toLowerCase();
}

function assetId(path) {
  const text = String(path || '').trim();
  if (!text) return null;
  const parts = text.split('/');
  return parts[parts.length - 1] || null;
}

function imageUrl(folder, path) {
  const id = assetId(path);
  return id ? `/assets/${folder}/${id}.png` : null;
}

function skillTierUrl(path) {
  const id = assetId(path);
  return id ? `/assets/skill-tier/${id}.png` : null;
}

async function readProcedure(game, token, procedure, kind, params) {
  try {
    return await game.sql(token, procedure, kind, params);
  } catch (error) {
    if (isFatalGameError(error)) throw error;
    return null;
  }
}

/** Tach thong tin bond tu cau mo ta tieng Viet/Anh. */
export function parseBondText(infoVi, infoEn) {
  const vi = String(infoVi || '');
  const en = String(infoEn || '');
  const text = vi || en;

  const partners = [...text.matchAll(/<([^>]+)>/g)]
    .map((match) => match[1].trim())
    .filter(Boolean);

  let stat = null;
  if (/tăng\s+công/i.test(vi) || /increases?\s+attack/i.test(en)) stat = 'atk';
  else if (/tăng\s+thủ/i.test(vi) || /increases?\s+defen[cs]e/i.test(en)) stat = 'def';

  const percentMatch = text.match(/(\d+(?:[.,]\d+)?)\s*%/);
  const percent = percentMatch ? Number(percentMatch[1].replace(',', '.')) : 0;

  let kind = 'other';
  if (/cùng ra trận|together go into battle/i.test(text)) kind = 'team';
  else if (/trang bị|equips?\s*</i.test(text)) kind = 'equip';
  else if (/triệu hồi|summons?/i.test(text)) kind = 'beast';

  return { partners, stat, percent, kind };
}

function parseBonds(row) {
  const bonds = [];
  for (let index = 1; index <= 4; index += 1) {
    const id = num(row[`Bond${index}`]);
    if (!id) continue;
    const info = row[`Bond${index}Info`] || null;
    const infoVi = row[`Bond${index}Info2`] || info;
    const parsed = parseBondText(infoVi, info);
    bonds.push({
      id,
      name: row[`Bond${index}Name`] || `Bond ${id}`,
      info,
      infoVi,
      active: Boolean(row[`Bond${index}Active`]),
      type: num(row[`Bond${index}Type`]),
      stat: parsed.stat,
      percent: parsed.percent,
      kind: parsed.kind,
      partners: parsed.partners,
    });
  }
  return bonds;
}

function bondTypeName(type) {
  if (type === 1) return 'Đồng đội';
  if (type === 2) return 'Trang bị';
  if (type === 3) return 'Triệu hồi';
  return 'Khác';
}

function equipmentFromTeamRow(row) {
  const items = [];
  for (const slot of [
    { type: 1, prefix: 'EquipAtk' },
    { type: 2, prefix: 'EquipDef' },
  ]) {
    const id = num(row[`${slot.prefix}Id`]);
    if (!id) continue;
    const img = row[`${slot.prefix}Img`] || null;
    items.push({
      id,
      type: slot.type,
      typeName: slot.type === 1 ? 'Vũ khí' : 'Giáp',
      img,
      icon: imageUrl('equip', img),
      name: row[`${slot.prefix}Name`] || `Trang bị ${id}`,
      name2: row[`${slot.prefix}Name2`] || null,
      lv: num(row[`${slot.prefix}Lv`]),
      star: num(row[`${slot.prefix}Star`]),
      atk: num(row[`${slot.prefix}Atk`]) || 0,
      def: num(row[`${slot.prefix}Def`]) || 0,
      equippedBy: num(row.NinjaId),
      equippedSlot: num(row.Slot),
      statsKnown: true,
    });
  }
  return items;
}

/** Uoc luong chi so cho trang bi chua tung duoc mac (API khong tra Atk/Def). */
function estimateEquipStats(item) {
  const star = Math.max(1, Math.min(6, item.star || 1));
  if (item.type === 1) {
    const atk = { 1: 60, 2: 110, 3: 150, 4: 180, 5: 250, 6: 300 }[star] || 150;
    return { atk, def: 0 };
  }
  const def = { 1: 70, 2: 100, 3: 135, 4: 190, 5: 410, 6: 480 }[star] || 135;
  return { atk: 0, def };
}

export function buildEquipmentCatalog(teamRows, weaponRows, armorRows) {
  const catalog = new Map();

  for (const row of teamRows) {
    for (const item of equipmentFromTeamRow(row)) {
      catalog.set(item.id, { ...catalog.get(item.id), ...item });
    }
  }

  for (const [type, rows] of [
    [1, weaponRows],
    [2, armorRows],
  ]) {
    for (const row of rows) {
      const id = num(row.Id);
      if (!id) continue;
      const known = catalog.get(id);
      const base = {
        id,
        type,
        typeName: type === 1 ? 'Vũ khí' : 'Giáp',
        img: row.Img || known?.img || null,
        icon: imageUrl('equip', row.Img || known?.img),
        name: row.Name || known?.name || `Trang bị ${id}`,
        name2: row.Name2 || known?.name2 || null,
        lv: num(row.Lv) ?? known?.lv ?? null,
        star: num(row.Star) ?? known?.star ?? null,
        equippedBy: known?.equippedBy ?? null,
        equippedSlot: known?.equippedSlot ?? null,
        statsKnown: Boolean(known),
      };
      const estimated = known ? {} : estimateEquipStats(base);
      catalog.set(id, {
        ...base,
        atk: known?.atk ?? estimated.atk ?? 0,
        def: known?.def ?? estimated.def ?? 0,
      });
    }
  }

  return [...catalog.values()];
}

function computeBondTotals(ninja, selectedNames, equippedNames) {
  let atkPct = 0;
  let defPct = 0;
  const bonds = [];

  for (const bond of ninja.bonds) {
    let active = false;
    if (bond.type === 1) {
      active =
        bond.partners.length > 0 &&
        bond.partners.every((name) => selectedNames.has(lower(name)));
    } else if (bond.type === 2) {
      active = Boolean(bond.partners[0] && equippedNames.has(lower(bond.partners[0])));
    } else if (bond.type === 3) {
      active = bond.active;
    }

    if (active && bond.stat === 'atk') atkPct += bond.percent;
    if (active && bond.stat === 'def') defPct += bond.percent;
    bonds.push({ ...bond, active });
  }

  return { atkPct, defPct, bonds };
}

function estimateTotals(ninja, atkPct, defPct, weapon, armor) {
  const equipAtk = (weapon?.atk || 0) + (armor?.atk || 0);
  const equipDef = (weapon?.def || 0) + (armor?.def || 0);
  const totalAtk = Math.round(ninja.atk * (1 + atkPct / 100)) + equipAtk;
  const totalDef = Math.round(ninja.def * (1 + defPct / 100)) + equipDef;
  return {
    equipAtk,
    equipDef,
    totalAtk,
    totalDef,
    power: totalAtk + totalDef,
    role: totalAtk >= totalDef ? 'atk' : 'def',
  };
}

function decorateNinja(base, statRow, teamRow, rosterRow) {
  const atk = num(statRow?.Atk) ?? num(teamRow?.Atk) ?? 0;
  const def = num(statRow?.Def) ?? num(teamRow?.Def) ?? 0;
  const bonds = teamRow ? parseBonds(teamRow) : [];
  const equipment = teamRow ? equipmentFromTeamRow(teamRow) : [];
  const weapon = equipment.find((item) => item.type === 1) || null;
  const armor = equipment.find((item) => item.type === 2) || null;

  const activeBonds = bonds.filter((bond) => bond.active);
  const bondAtkPct = activeBonds
    .filter((bond) => bond.stat === 'atk')
    .reduce((sum, bond) => sum + bond.percent, 0);
  const bondDefPct = activeBonds
    .filter((bond) => bond.stat === 'def')
    .reduce((sum, bond) => sum + bond.percent, 0);

  const totals = estimateTotals(
    { atk, def },
    bondAtkPct,
    bondDefPct,
    weapon,
    armor,
  );

  const serverAtk = num(teamRow?.TotalAtk);
  const serverDef = num(teamRow?.TotalDef);
  const totalAtk = serverAtk ?? totals.totalAtk;
  const totalDef = serverDef ?? totals.totalDef;

  return {
    id: num(base.Id) ?? num(teamRow?.NinjaId) ?? num(rosterRow?.Id),
    templateId: num(teamRow?.Ninja),
    name: base.Name || teamRow?.NinjaName || rosterRow?.Name || 'Ninja',
    img: base.Img || teamRow?.NinjaImg || rosterRow?.Img || null,
    icon: imageUrl('ninja-head', base.Img || teamRow?.NinjaImg || rosterRow?.Img),
    art: imageUrl('ninja', base.Img || teamRow?.NinjaImg || rosterRow?.Img),
    level: num(base.Lv) ?? num(teamRow?.Lv) ?? num(rosterRow?.Lv) ?? 0,
    star: num(base.Star) ?? num(teamRow?.Star) ?? num(rosterRow?.Star) ?? 0,
    ascend: num(base.Ascend) ?? num(teamRow?.Ascend) ?? num(rosterRow?.Ascend) ?? 0,
    attribute: num(base.Attribute) ?? num(teamRow?.Attribute) ?? num(rosterRow?.Attribute),
    tier: num(base.Tier) ?? num(teamRow?.Tier) ?? num(rosterRow?.Tier) ?? 0,
    atk,
    def,
    totalAtk,
    totalDef,
    power: totalAtk + totalDef,
    role: totalAtk >= totalDef ? 'atk' : 'def',
    bondAtkPct,
    bondDefPct,
    equipAtk: totals.equipAtk,
    equipDef: totals.equipDef,
    bonds,
    equipment,
    weapon,
    armor,
    skills: teamRow
      ? [
          {
            id: num(teamRow.Skill1),
            name: teamRow.Skill1Name,
            img: teamRow.Skill1Img,
            icon: imageUrl('skill', teamRow.Skill1Img),
            tier: teamRow.Skill1Tier,
            tierIcon: skillTierUrl(teamRow.Skill1TierImg),
            info: teamRow.Skill1InfoVi || teamRow.Skill1Info,
          },
          {
            id: num(teamRow.Skill2),
            name: teamRow.Skill2Name,
            img: teamRow.Skill2Img,
            icon: imageUrl('skill', teamRow.Skill2Img),
            tier: teamRow.Skill2Tier,
            tierIcon: skillTierUrl(teamRow.Skill2TierImg),
            info: teamRow.Skill2InfoVi || teamRow.Skill2Info,
          },
        ].filter((skill) => skill.id || skill.name)
      : [],
    beast: num(teamRow?.Beast),
    inTeam: Boolean(teamRow),
    teamSlot: num(teamRow?.Slot),
    statsKnown: Boolean(statRow || teamRow),
  };
}

/** Doc toan bo trang thai doi hinh cua mot tai khoan. */
export async function readTeamState(game, token, { playerLevel = 1 } = {}) {
  const teamRows = asRows(await game.sql(token, 'P3Team', 'table'));
  await delay(READ_GAP_MS);

  const rosterRows = asRows(
    await readProcedure(game, token, 'P3TeamNinjaList', 'table'),
  );
  await delay(READ_GAP_MS);

  const statRows = asRows(
    await readProcedure(game, token, 'P3NinjaAttributePicker', 'table', { Mode: 0 }),
  );
  await delay(READ_GAP_MS);

  const slotRows = asRows(
    await readProcedure(game, token, 'P3SlotUnlock', 'table'),
  );
  await delay(READ_GAP_MS);

  const powerRow = await readProcedure(game, token, 'P3TeamPower', 'row');
  await delay(READ_GAP_MS);

  const battleRow = await readProcedure(game, token, 'P2BattleTeamStat', 'row');
  await delay(READ_GAP_MS);

  const weaponRows = asRows(
    await readProcedure(game, token, 'P3TeamEquipList', 'table', { EquipType: 1 }),
  );
  await delay(READ_GAP_MS);

  const armorRows = asRows(
    await readProcedure(game, token, 'P3TeamEquipList', 'table', { EquipType: 2 }),
  );

  const teamBySlot = new Map();
  const teamByNinja = new Map();
  for (const row of teamRows) {
    const slot = num(row.Slot);
    if (slot) teamBySlot.set(slot, row);
    const ninjaId = num(row.NinjaId);
    if (ninjaId) teamByNinja.set(ninjaId, row);
  }

  const statById = new Map();
  for (const row of statRows) {
    const id = num(row.Id);
    if (id) statById.set(id, row);
  }

  const rosterById = new Map();
  for (const row of rosterRows) {
    const id = num(row.Id);
    if (id) rosterById.set(id, row);
  }

  const ids = new Set([
    ...rosterById.keys(),
    ...statById.keys(),
    ...teamByNinja.keys(),
  ]);

  const ninjas = [];
  for (const id of ids) {
    const statRow = statById.get(id) || null;
    const teamRow = teamByNinja.get(id) || null;
    const rosterRow = rosterById.get(id) || null;
    const base = statRow || rosterRow || {};
    if (!base.Id && !teamRow) continue;
    ninjas.push(decorateNinja(base, statRow, teamRow, rosterRow));
  }

  ninjas.sort((a, b) => {
    if (a.inTeam !== b.inTeam) return a.inTeam ? -1 : 1;
    if (a.inTeam && b.inTeam) return (a.teamSlot || 0) - (b.teamSlot || 0);
    return b.power - a.power;
  });

  const ninjaById = new Map(ninjas.map((ninja) => [ninja.id, ninja]));

  const unlockBySlot = new Map();
  for (const row of slotRows) {
    const slot = num(row.Slots) ?? num(row.Slot);
    const level = num(row.Lv);
    if (slot) unlockBySlot.set(slot, level ?? 1);
  }

  const effectiveLevel = num(playerLevel) || 1;
  const slots = [];
  for (let slot = 1; slot <= UI_SLOT_COUNT; slot += 1) {
    const unlockLevel = unlockBySlot.get(slot) ?? (slot <= 3 ? 1 : 999);
    const teamRow = teamBySlot.get(slot) || null;
    const ninja = teamRow ? ninjaById.get(num(teamRow.NinjaId)) || null : null;
    slots.push({
      slot,
      unlocked: effectiveLevel >= unlockLevel,
      unlockLevel,
      ninja,
    });
  }

  const equipment = buildEquipmentCatalog(teamRows, weaponRows, armorRows);
  const equippedNinjaIds = new Set(
    equipment.map((item) => item.equippedBy).filter(Boolean),
  );

  const activeBondCount = ninjas.reduce(
    (sum, ninja) => sum + ninja.bonds.filter((bond) => bond.active).length,
    0,
  );

  return {
    playerLevel: effectiveLevel,
    slots,
    ninjas,
    equipment,
    teamPower: num(powerRow?.Power) ?? 0,
    battle: {
      atkSum: num(battleRow?.AtkSum) ?? 0,
      defSum: num(battleRow?.DefSum) ?? 0,
    },
    activeBondCount,
    unlockedSlots: slots.filter((slot) => slot.unlocked).length,
    filledSlots: slots.filter((slot) => slot.ninja).length,
    equippedNinjaIds: [...equippedNinjaIds],
    readAt: new Date().toISOString(),
  };
}

function combinations(items, size, visit) {
  if (size <= 0 || size > items.length) return;
  const indices = Array.from({ length: size }, (_, index) => index);

  while (true) {
    visit(indices.map((index) => items[index]));
    let cursor = size - 1;
    while (cursor >= 0 && indices[cursor] === items.length - size + cursor) {
      cursor -= 1;
    }
    if (cursor < 0) break;
    indices[cursor] += 1;
    for (let next = cursor + 1; next < size; next += 1) {
      indices[next] = indices[next - 1] + 1;
    }
  }
}

function combinationCount(total, size) {
  if (size <= 0 || size > total) return 0;
  let result = 1;
  for (let index = 1; index <= size; index += 1) {
    result = (result * (total - size + index)) / index;
    if (result > Number.MAX_SAFE_INTEGER) return Number.MAX_SAFE_INTEGER;
  }
  return Math.round(result);
}

function potentialBondPercent(ninja, rosterNames, equipmentNames) {
  let percent = 0;
  for (const bond of ninja.bonds) {
    if (bond.type === 1) {
      if (
        bond.partners.length > 0 &&
        bond.partners.every((name) => rosterNames.has(lower(name)))
      ) {
        percent += bond.percent;
      }
    } else if (bond.type === 2) {
      if (bond.partners[0] && equipmentNames.has(lower(bond.partners[0]))) {
        percent += bond.percent;
      }
    } else if (bond.type === 3 && bond.active) {
      percent += bond.percent;
    }
  }
  return percent;
}

function evaluateSet(set, mode) {
  const names = new Set(set.map((ninja) => lower(ninja.name)));
  const equippedNames = new Set();

  let bondPercent = 0;
  let statSum = 0;
  let powerSum = 0;
  const details = [];

  for (const ninja of set) {
    let atkPct = 0;
    let defPct = 0;
    for (const bond of ninja.bonds) {
      let active = false;
      if (bond.type === 1) {
        active =
          bond.partners.length > 0 &&
          bond.partners.every((name) => names.has(lower(name)));
      } else if (bond.type === 2) {
        active = Boolean(
          bond.partners[0] && equippedNames.has(lower(bond.partners[0])),
        );
      } else if (bond.type === 3) {
        active = bond.active;
      }
      if (active) {
        if (bond.stat === 'atk') atkPct += bond.percent;
        else if (bond.stat === 'def') defPct += bond.percent;
        bondPercent += bond.percent;
      }
    }

    const base = mode === 'atk' ? ninja.atk : ninja.def;
    const chosenPct = mode === 'atk' ? atkPct : defPct;
    statSum += base * (1 + chosenPct / 100);
    powerSum += ninja.atk + ninja.def;
    details.push({ ninja, atkPct, defPct });
  }

  return {
    set,
    details,
    bondPercent,
    statSum,
    powerSum,
    score: bondPercent * 1_000_000 + statSum * 100 + powerSum,
  };
}

function bestEquipmentFor(ninja, mode, equipment) {
  const statKey = mode === 'atk' ? 'atk' : 'def';
  let weapon = null;
  let armor = null;
  for (const item of equipment) {
    if (item.type === 1 && (!weapon || item[statKey] > weapon[statKey])) {
      weapon = item;
    }
    if (item.type === 2 && (!armor || item[statKey] > armor[statKey])) {
      armor = item;
    }
  }
  return (weapon?.[statKey] || 0) + (armor?.[statKey] || 0);
}

function assignEquipment(set, mode, equipment) {
  const statKey = mode === 'atk' ? 'atk' : 'def';
  const used = new Set();
  const plan = new Map(
    set.map((ninja) => [ninja.id, { weapon: null, armor: null }]),
  );

  // 1. Trang bi bat bond (uu tien bond truoc chi so).
  for (const ninja of set) {
    for (const bond of ninja.bonds) {
      if (bond.type !== 2 || !bond.partners[0]) continue;
      const required = lower(bond.partners[0]);
      const item = equipment.find(
        (candidate) => !used.has(candidate.id) && lower(candidate.name) === required,
      );
      if (!item) continue;
      const slot = plan.get(ninja.id);
      if (item.type === 1 && !slot.weapon) {
        slot.weapon = item;
        used.add(item.id);
      } else if (item.type === 2 && !slot.armor) {
        slot.armor = item;
        used.add(item.id);
      }
    }
  }

  // 2. Lap phan con lai theo chi so cua che do dang chon.
  // Van mac du 1 vu khi + 1 giap cho moi ninja neu kho con do.
  const weapons = equipment
    .filter((item) => item.type === 1 && !used.has(item.id))
    .sort((a, b) => b[statKey] - a[statKey]);
  const armors = equipment
    .filter((item) => item.type === 2 && !used.has(item.id))
    .sort((a, b) => b[statKey] - a[statKey]);

  const ordered = [...set].sort((a, b) => b[statKey] - a[statKey]);
  for (const ninja of ordered) {
    const slot = plan.get(ninja.id);
    if (!slot.weapon && weapons.length > 0) slot.weapon = weapons.shift();
    if (!slot.armor && armors.length > 0) slot.armor = armors.shift();
  }

  return plan;
}

function finalizePlan(set, mode, equipment, slots) {
  const equipmentPlan = assignEquipment(set, mode, equipment);
  const names = new Set(set.map((ninja) => lower(ninja.name)));
  const equippedNames = new Set();
  for (const assignment of equipmentPlan.values()) {
    if (assignment.weapon) equippedNames.add(lower(assignment.weapon.name));
    if (assignment.armor) equippedNames.add(lower(assignment.armor.name));
  }

  const decorated = set.map((ninja) => {
    const assignment = equipmentPlan.get(ninja.id) || { weapon: null, armor: null };
    const bondInfo = computeBondTotals(ninja, names, equippedNames);
    const totals = estimateTotals(
      ninja,
      bondInfo.atkPct,
      bondInfo.defPct,
      assignment.weapon,
      assignment.armor,
    );
    return {
      ...ninja,
      weapon: assignment.weapon,
      armor: assignment.armor,
      equipAtk: totals.equipAtk,
      equipDef: totals.equipDef,
      bondAtkPct: bondInfo.atkPct,
      bondDefPct: bondInfo.defPct,
      totalAtk: totals.totalAtk,
      totalDef: totals.totalDef,
      power: totals.power,
      role: totals.role,
      bonds: bondInfo.bonds,
    };
  });

  decorated.sort((a, b) =>
    mode === 'atk' ? b.totalAtk - a.totalAtk : b.totalDef - a.totalDef,
  );

  const plannedSlots = slots.slice(0, decorated.length).map((slot, index) => ({
    slot,
    ninja: decorated[index],
  }));

  const atkSum = decorated.reduce((sum, ninja) => sum + ninja.totalAtk, 0);
  const defSum = decorated.reduce((sum, ninja) => sum + ninja.totalDef, 0);
  const activeBonds = decorated.reduce(
    (sum, ninja) => sum + ninja.bonds.filter((bond) => bond.active).length,
    0,
  );

  return {
    mode,
    slots: plannedSlots,
    ninjaCount: decorated.length,
    bondCount: activeBonds,
    atkSum,
    defSum,
    power: atkSum + defSum,
    warnings: [],
  };
}

/**
 * Chon doi hinh manh nhat theo che do atk/def.
 * Thu tu uu tien: bond > chi so cua che do > luc chien.
 */
export function buildStrongestPlan(state, { mode = 'atk' } = {}) {
  const chosenMode = mode === 'def' ? 'def' : 'atk';
  const unlocked = state.slots.filter((slot) => slot.unlocked);
  const slotNumbers = unlocked.map((slot) => slot.slot);
  const pool = state.ninjas.filter((ninja) => ninja.id && ninja.statsKnown);

  if (pool.length === 0 || slotNumbers.length === 0) {
    return {
      mode: chosenMode,
      slots: [],
      ninjaCount: 0,
      bondCount: 0,
      atkSum: 0,
      defSum: 0,
      power: 0,
      warnings: [
        pool.length === 0
          ? 'Chưa đọc được danh sách ninja sở hữu.'
          : 'Chưa có slot đội hình nào được mở.',
      ],
    };
  }

  const equipmentNames = new Set(state.equipment.map((item) => lower(item.name)));
  const rosterNames = new Set(pool.map((ninja) => lower(ninja.name)));
  const statKey = chosenMode === 'atk' ? 'atk' : 'def';

  const ranked = pool
    .map((ninja) => {
      const bondPotential = potentialBondPercent(ninja, rosterNames, equipmentNames);
      const equipPotential = bestEquipmentFor(ninja, chosenMode, state.equipment);
      return {
        ninja,
        heuristic:
          bondPotential * 1000 + ninja[statKey] + equipPotential * 0.35,
      };
    })
    .sort((a, b) => b.heuristic - a.heuristic);

  let candidates = ranked.slice(0, MAX_CANDIDATES).map((entry) => entry.ninja);
  if (candidates.length < slotNumbers.length) candidates = pool;

  const size = Math.min(slotNumbers.length, candidates.length);
  const total = combinationCount(candidates.length, size);

  let best = null;
  if (total <= MAX_COMBINATIONS) {
    combinations(candidates, size, (set) => {
      const evaluation = evaluateSet(set, chosenMode);
      if (
        !best ||
        evaluation.score > best.score ||
        (evaluation.score === best.score &&
          evaluation.powerSum > best.powerSum)
      ) {
        best = evaluation;
      }
    });
  } else {
    // Voi roster qua lon: chon tham lam theo bond + chi so.
    const selected = [];
    const selectedNames = new Set();
    while (selected.length < size) {
      let bestEntry = null;
      for (const ninja of candidates) {
        if (selected.includes(ninja)) continue;
        const trial = [...selected, ninja];
        const evaluation = evaluateSet(trial, chosenMode);
        const score =
          evaluation.bondPercent * 1_000_000 +
          evaluation.statSum * 100 +
          evaluation.powerSum;
        if (!bestEntry || score > bestEntry.score) {
          bestEntry = { ninja, score };
        }
      }
      if (!bestEntry) break;
      selected.push(bestEntry.ninja);
      selectedNames.add(lower(bestEntry.ninja.name));
    }
    best = evaluateSet(selected, chosenMode);
  }

  if (!best) {
    return {
      mode: chosenMode,
      slots: [],
      ninjaCount: 0,
      bondCount: 0,
      atkSum: 0,
      defSum: 0,
      power: 0,
      warnings: ['Không tìm được đội hình phù hợp.'],
    };
  }

  const plan = finalizePlan(best.set, chosenMode, state.equipment, slotNumbers);
  const unknownBondCount = plan.slots.filter(
    (entry) => entry.ninja.bonds.length === 0,
  ).length;
  if (unknownBondCount > 0) {
    plan.warnings.push(
      `${unknownBondCount} ninja chưa có dữ liệu bond (chỉ ninja đang trong đội mới đọc được bond).`,
    );
  }
  const estimated = state.equipment.filter((item) => !item.statsKnown).length;
  if (estimated > 0) {
    plan.warnings.push(
      `${estimated} trang bị chưa rõ chỉ số, đang dùng ước lượng theo sao.`,
    );
  }

  return plan;
}

function resultOk(result) {
  if (result === null || result === undefined) return false;
  const rows = Array.isArray(result) ? result : [result];
  return rows.some((row) => {
    if (!row || typeof row !== 'object') return false;
    const value = row.Result ?? row.result;
    return value === 1 || value === '1' || value === true;
  });
}

function describeResult(result) {
  if (result === null || result === undefined) return 'không có phản hồi';
  return JSON.stringify(result).slice(0, 240);
}

function currentNinjaBySlot(state) {
  const map = new Map();
  for (const slot of state?.slots || []) {
    if (slot.ninja?.id) map.set(slot.slot, slot.ninja.id);
  }
  return map;
}

/**
 * Tinh cac buoc dua ninja ve dung slot.
 *
 * Server tu choi P1TeamSetNinja khi slot dich dang co ninja khac (Result 0),
 * nen phai doi cho bang P1TeamSwap thay vi dat lan luot. Cach nay xu ly ca
 * vong doi (vi du 2 -> 5 -> 4 -> 2) chi voi 2 lan swap.
 */
function planNinjaActions(state, plan) {
  const current = currentNinjaBySlot(state);
  const slotOf = new Map();
  for (const [slot, ninjaId] of current) slotOf.set(ninjaId, slot);

  const target = new Map();
  for (const entry of plan.slots) target.set(entry.slot, entry.ninja.id);
  const targetSlots = new Set(target.keys());

  const actions = [];
  const cur = new Map(current);

  for (const [slot, desired] of target) {
    if (cur.get(slot) === desired) continue;

    const from = slotOf.get(desired);
    if (from !== undefined && from !== slot) {
      actions.push({ kind: 'swap', slotA: slot, slotB: from });
      const displaced = cur.get(slot);
      cur.set(slot, desired);
      slotOf.set(desired, slot);
      if (displaced !== undefined) {
        cur.set(from, displaced);
        slotOf.set(displaced, from);
      } else {
        cur.delete(from);
      }
      continue;
    }

    if (cur.get(slot) === undefined) {
      actions.push({ kind: 'set', slot, ninjaId: desired });
      cur.set(slot, desired);
      slotOf.set(desired, slot);
      continue;
    }

    // Ninja chua co trong doi va slot dich dang bi chiem: tam dua ninja cu
    // sang slot trong, roi dat ninja moi vao.
    const empty = (state?.slots || []).find(
      (candidate) =>
        candidate.unlocked &&
        !targetSlots.has(candidate.slot) &&
        !cur.has(candidate.slot),
    );
    if (empty) {
      const displaced = cur.get(slot);
      actions.push({ kind: 'swap', slotA: slot, slotB: empty.slot });
      cur.set(empty.slot, displaced);
      slotOf.set(displaced, empty.slot);
      cur.delete(slot);
    }
    actions.push({ kind: 'set', slot, ninjaId: desired });
    const displaced = cur.get(slot);
    if (displaced !== undefined) slotOf.delete(displaced);
    cur.set(slot, desired);
    slotOf.set(desired, slot);
  }

  return actions;
}

/**
 * Tinh cac buoc mac trang bi.
 *
 * P1TeamSetEquip tra Result 0 khi mon do dang duoc mac o slot khac, nen phai
 * thao (EquipId = 0) khoi chu cu truoc khi mac cho chu moi.
 */
function planEquipActions(state, plan) {
  const targetByItem = new Map();
  const targetByKey = new Map();
  for (const entry of plan.slots) {
    for (const [equipSlot, item] of [
      [1, entry.ninja.weapon],
      [2, entry.ninja.armor],
    ]) {
      if (!item) continue;
      const target = { slot: entry.slot, equipSlot, item };
      targetByItem.set(item.id, target);
      targetByKey.set(`${entry.slot}:${equipSlot}`, target);
    }
  }

  const current = new Map();
  for (const item of state?.equipment || []) {
    const slot = Number(item.equippedSlot);
    if (!slot) continue;
    current.set(`${slot}:${item.type}`, item);
  }

  const actions = [];
  for (const item of state?.equipment || []) {
    const slot = Number(item.equippedSlot);
    if (!slot) continue;
    const curKey = `${slot}:${item.type}`;
    const targetHere = targetByKey.get(curKey);
    if (targetHere?.item.id === item.id) continue;

    const wantedElsewhere = targetByItem.get(item.id);
    // Khong thuoc ke hoach va slot nay cung khong can doi: giu nguyen.
    if (!targetHere && !wantedElsewhere) continue;

    actions.push({ kind: 'unequip', slot, equipSlot: item.type, item });
    current.delete(curKey);
  }

  for (const [key, target] of targetByKey) {
    const equipped = current.get(key);
    if (equipped?.id === target.item.id) continue;
    actions.push({
      kind: 'equip',
      slot: target.slot,
      equipSlot: target.equipSlot,
      item: target.item,
    });
    current.set(key, target.item);
  }

  return actions;
}

/**
 * Ap dung doi hinh: dua ninja ve slot (uu tien swap) roi mac trang bi
 * (thao mon dang o slot khac truoc). Tra ve danh sach buoc va loi.
 */
export async function applyTeamPlan(game, token, plan, { onStep, state } = {}) {
  const steps = [];
  const errors = [];

  const report = (step) => {
    steps.push(step);
    if (typeof onStep === 'function') onStep(step);
  };

  const baseState =
    state ||
    (await readTeamState(game, token, {
      playerLevel: plan.playerLevel || 1,
    }));

  const slotNinjaName = new Map();
  for (const slot of baseState.slots || []) {
    if (slot.ninja?.name) slotNinjaName.set(slot.slot, slot.ninja.name);
  }
  const nameForNinja = new Map(
    plan.slots.map((entry) => [entry.ninja.id, entry.ninja.name]),
  );

  for (const action of planNinjaActions(baseState, plan)) {
    let result;
    if (action.kind === 'swap') {
      result = await game.sql(token, 'P1TeamSwap', 'table', {
        SlotA: action.slotA,
        SlotB: action.slotB,
      });
      const nameA = slotNinjaName.get(action.slotA);
      const nameB = slotNinjaName.get(action.slotB);
      if (nameB) slotNinjaName.set(action.slotA, nameB);
      else slotNinjaName.delete(action.slotA);
      if (nameA) slotNinjaName.set(action.slotB, nameA);
      else slotNinjaName.delete(action.slotB);

      const ok = resultOk(result);
      report({
        phase: 'ninja',
        action: 'swap',
        slotA: action.slotA,
        slotB: action.slotB,
        ninjaName: nameB || null,
        ok,
        result: describeResult(result),
      });
      if (!ok) {
        errors.push(
          `Không đổi được slot ${action.slotA} và ${action.slotB}: ${describeResult(result)}`,
        );
      }
    } else {
      result = await game.sql(token, 'P1TeamSetNinja', 'table', {
        Slot: action.slot,
        NinjaId: action.ninjaId,
      });
      const ninjaName =
        nameForNinja.get(action.ninjaId) || `ninja ${action.ninjaId}`;
      slotNinjaName.set(action.slot, ninjaName);

      const ok = resultOk(result);
      report({
        phase: 'ninja',
        action: 'set',
        slot: action.slot,
        ninjaId: action.ninjaId,
        ninjaName,
        ok,
        result: describeResult(result),
      });
      if (!ok) {
        errors.push(
          `Không đặt được ${ninjaName} vào slot ${action.slot}: ${describeResult(result)}`,
        );
      }
    }
    await delay(MUTATE_GAP_MS);
  }

  for (const action of planEquipActions(baseState, plan)) {
    const result = await game.sql(token, 'P1TeamSetEquip', 'table', {
      Slot: action.slot,
      EquipId: action.kind === 'unequip' ? 0 : action.item.id,
      EquipSlot: action.equipSlot,
    });
    const ok = resultOk(result);
    const label = action.equipSlot === 1 ? 'vũ khí' : 'giáp';
    const ninjaName = slotNinjaName.get(action.slot) || null;
    report({
      phase: action.kind === 'unequip' ? 'unequip' : 'equip',
      slot: action.slot,
      equipSlot: action.equipSlot,
      equipId: action.item.id,
      equipName: action.item.name,
      ninjaName,
      ok,
      result: describeResult(result),
    });
    if (!ok) {
      errors.push(
        action.kind === 'unequip'
          ? `Không tháo được ${label} ${action.item.name} ở slot ${action.slot}: ${describeResult(result)}`
          : `Không mặc được ${label} ${action.item.name} cho ${ninjaName || `slot ${action.slot}`}: ${describeResult(result)}`,
      );
    }
    await delay(MUTATE_GAP_MS);
  }

  return { steps, errors };
}

export { bondTypeName, resultOk };

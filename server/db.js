import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const STATUSES = new Set(['new', 'active', 'error']);

/**
 * Lop truy cap du lieu cho bang accounts.
 * Mat khau va session token luu duoi dang da ma hoa, khong bao gio tra ra API.
 */
export function createStore({ dataDir, secretBox }) {
  mkdirSync(dataDir, { recursive: true });

  const db = new DatabaseSync(path.join(dataDir, 'bot.db'));
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS accounts (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      username       TEXT NOT NULL COLLATE NOCASE UNIQUE,
      password_enc   TEXT NOT NULL,
      label          TEXT NOT NULL DEFAULT '',
      server         TEXT NOT NULL DEFAULT 'S1',
      character_name TEXT NOT NULL DEFAULT '',
      character_id   TEXT,
      status         TEXT NOT NULL DEFAULT 'new',
      enabled        INTEGER NOT NULL DEFAULT 1,
      last_login_at  TEXT,
      last_error     TEXT,
      created_at     TEXT NOT NULL,
      updated_at     TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);

    CREATE TABLE IF NOT EXISTS activity_logs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id  INTEGER,
      username    TEXT NOT NULL DEFAULT '',
      action      TEXT NOT NULL,
      level       TEXT NOT NULL DEFAULT 'info',
      message     TEXT NOT NULL DEFAULT '',
      meta        TEXT,
      created_at  TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_logs_created ON activity_logs(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_logs_account ON activity_logs(account_id);

    CREATE TABLE IF NOT EXISTS story_stage_stats (
      account_id  INTEGER NOT NULL,
      scid        INTEGER NOT NULL,
      runs        INTEGER NOT NULL DEFAULT 0,
      wins        INTEGER NOT NULL DEFAULT 0,
      exp_sum     INTEGER NOT NULL DEFAULT 0,
      gold_sum    INTEGER NOT NULL DEFAULT 0,
      energy_sum  INTEGER NOT NULL DEFAULT 0,
      updated_at  TEXT NOT NULL,
      PRIMARY KEY (account_id, scid)
    );

    CREATE TABLE IF NOT EXISTS engine_settings (
      id                    INTEGER PRIMARY KEY CHECK (id = 1),
      dry_run               INTEGER NOT NULL DEFAULT 1,
      interval_seconds      INTEGER NOT NULL DEFAULT 300,
      max_actions           INTEGER NOT NULL DEFAULT 1,
      allow_daily           INTEGER NOT NULL DEFAULT 1,
      allow_story           INTEGER NOT NULL DEFAULT 0,
      allow_boss            INTEGER NOT NULL DEFAULT 0,
      allow_pvp             INTEGER NOT NULL DEFAULT 0,
      story_runs_per_day    INTEGER NOT NULL DEFAULT 20,
      pvp_battles_per_day   INTEGER NOT NULL DEFAULT 5,
      updated_at            TEXT NOT NULL
    );
  `);

  migrate();

  const now = () => new Date().toISOString();

  /** Bo sung cot cho DB tao tu phien ban truoc. */
  function migrate() {
    const existing = new Set(
      db.prepare('PRAGMA table_info(accounts)').all().map((column) => column.name),
    );

    const additions = [
      ['token_enc', 'TEXT'],
      ['token_updated_at', 'TEXT'],
      ['level', 'INTEGER'],
      ['power', 'INTEGER'],
      ['gold', 'INTEGER'],
      ['diamond', 'INTEGER'],
      ['guild_name', 'TEXT'],
      ['rank_no', 'INTEGER'],
      ['last_sync_at', 'TEXT'],
      ['auto_enabled', 'INTEGER NOT NULL DEFAULT 0'],
    ];

    for (const [name, type] of additions) {
      if (!existing.has(name)) {
        db.exec(`ALTER TABLE accounts ADD COLUMN ${name} ${type}`);
      }
    }
  }

  function toPublic(row) {
    return {
      id: Number(row.id),
      username: row.username,
      label: row.label,
      server: row.server,
      characterName: row.character_name,
      characterId: row.character_id ?? null,
      level: row.level === null ? null : Number(row.level),
      power: row.power === null ? null : Number(row.power),
      gold: row.gold === null ? null : Number(row.gold),
      diamond: row.diamond === null ? null : Number(row.diamond),
      guildName: row.guild_name ?? null,
      rankNo: row.rank_no === null ? null : Number(row.rank_no),
      status: row.enabled ? row.status : 'disabled',
      enabled: Boolean(row.enabled),
      autoEnabled: Boolean(row.auto_enabled),
      hasSession: Boolean(row.token_enc),
      lastLoginAt: row.last_login_at ?? null,
      lastSyncAt: row.last_sync_at ?? null,
      lastError: row.last_error ?? null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  function getRow(id) {
    return db.prepare('SELECT * FROM accounts WHERE id = ?').get(Number(id));
  }

  function getAccount(id) {
    const row = getRow(id);
    return row ? toPublic(row) : null;
  }

  function listAccounts({ q = '', status = '' } = {}) {
    const rows = db.prepare('SELECT * FROM accounts ORDER BY id DESC').all();

    const needle = String(q).trim().toLowerCase();
    const wanted = String(status).trim();

    return rows
      .map(toPublic)
      .filter((account) => {
        if (wanted && wanted !== 'all' && account.status !== wanted) {
          return false;
        }
        if (!needle) return true;
        return [
          account.username,
          account.label,
          account.characterName,
          account.guildName,
          account.server,
        ].some((value) => String(value ?? '').toLowerCase().includes(needle));
      });
  }

  function stats() {
    const rows = db
      .prepare(`
        SELECT status, enabled, auto_enabled, COUNT(*) AS total
        FROM accounts
        GROUP BY status, enabled, auto_enabled
      `)
      .all();

    const result = { total: 0, new: 0, active: 0, error: 0, disabled: 0, auto: 0 };
    for (const row of rows) {
      const total = Number(row.total);
      result.total += total;
      if (!row.enabled) {
        result.disabled += total;
      } else {
        const status = STATUSES.has(row.status) ? row.status : 'new';
        result[status] += total;
      }
      if (row.enabled && row.auto_enabled) {
        result.auto += total;
      }
    }
    return result;
  }

  function findByUsername(username) {
    return db
      .prepare('SELECT * FROM accounts WHERE username = ? COLLATE NOCASE')
      .get(String(username));
  }

  function createAccount(input) {
    const username = String(input.username ?? '').trim();
    const password = String(input.password ?? '');

    if (username.length < 2 || username.length > 64) {
      throw new ValidationError('Tên đăng nhập phải từ 2 đến 64 ký tự.');
    }
    if (!/^[A-Za-z0-9._@-]+$/.test(username)) {
      throw new ValidationError('Tên đăng nhập chỉ gồm chữ, số và các ký tự . _ @ -.');
    }
    if (!password) {
      throw new ValidationError('Mật khẩu không được để trống.');
    }
    if (password.length > 128) {
      throw new ValidationError('Mật khẩu tối đa 128 ký tự.');
    }
    if (findByUsername(username)) {
      throw new ConflictError('Tên đăng nhập này đã có trong danh sách.');
    }

    const timestamp = now();
    const info = db
      .prepare(`
        INSERT INTO accounts
          (username, password_enc, label, server, character_name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        username,
        secretBox.encrypt(password),
        String(input.label ?? '').trim().slice(0, 200),
        String(input.server ?? 'S1').trim().slice(0, 32) || 'S1',
        String(input.characterName ?? '').trim().slice(0, 64),
        timestamp,
        timestamp,
      );

    return getAccount(info.lastInsertRowid);
  }

  function updateAccount(id, input) {
    const row = getRow(id);
    if (!row) return null;

    const fields = [];
    const values = [];

    if (input.username !== undefined) {
      const username = String(input.username).trim();
      if (username.length < 2 || username.length > 64) {
        throw new ValidationError('Tên đăng nhập phải từ 2 đến 64 ký tự.');
      }
      if (!/^[A-Za-z0-9._@-]+$/.test(username)) {
        throw new ValidationError('Tên đăng nhập chỉ gồm chữ, số và các ký tự . _ @ -.');
      }
      const existing = findByUsername(username);
      if (existing && Number(existing.id) !== Number(id)) {
        throw new ConflictError('Tên đăng nhập này đã có trong danh sách.');
      }
      fields.push('username = ?');
      values.push(username);
    }

    if (input.password !== undefined && input.password !== '') {
      const password = String(input.password);
      if (password.length > 128) {
        throw new ValidationError('Mật khẩu tối đa 128 ký tự.');
      }
      fields.push('password_enc = ?');
      values.push(secretBox.encrypt(password));
      // Mat khau moi => phien cu va auto khong con y nghia.
      fields.push(
        "status = 'new'",
        'last_error = NULL',
        'last_login_at = NULL',
        'token_enc = NULL',
        'token_updated_at = NULL',
        'auto_enabled = 0',
      );
    }

    if (input.label !== undefined) {
      fields.push('label = ?');
      values.push(String(input.label).trim().slice(0, 200));
    }
    if (input.server !== undefined) {
      fields.push('server = ?');
      values.push(String(input.server).trim().slice(0, 32) || 'S1');
    }
    if (input.characterName !== undefined) {
      fields.push('character_name = ?');
      values.push(String(input.characterName).trim().slice(0, 64));
    }

    if (fields.length === 0) {
      return toPublic(row);
    }

    fields.push('updated_at = ?');
    values.push(now(), Number(id));

    db.prepare(`UPDATE accounts SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return getAccount(id);
  }

  function toggleAccount(id, enabled) {
    const row = getRow(id);
    if (!row) return null;
    const next = enabled === undefined ? !row.enabled : Boolean(enabled);

    const fields = ['enabled = ?', 'updated_at = ?'];
    const values = [next ? 1 : 0, now()];
    if (!next) {
      fields.push('auto_enabled = 0');
    }
    values.push(Number(id));

    db.prepare(`UPDATE accounts SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return getAccount(id);
  }

  function setAuto(id, enabled) {
    const row = getRow(id);
    if (!row) return null;

    const next = Boolean(enabled);
    if (next) {
      if (!row.enabled) {
        throw new ValidationError('Tài khoản đang tắt, không thể bật auto.');
      }
      if (row.status !== 'active' || !row.token_enc) {
        throw new ValidationError('Cần đăng nhập tài khoản trước khi bật auto.');
      }
    }

    db.prepare('UPDATE accounts SET auto_enabled = ?, updated_at = ? WHERE id = ?')
      .run(next ? 1 : 0, now(), Number(id));
    return getAccount(id);
  }

  function deleteAccount(id) {
    db.prepare('DELETE FROM story_stage_stats WHERE account_id = ?').run(Number(id));
    const info = db.prepare('DELETE FROM accounts WHERE id = ?').run(Number(id));
    return Number(info.changes) > 0;
  }

  function recordStoryRun(accountId, { scid, energy, exp, gold, won }) {
    const id = Number(accountId);
    const stage = Number(scid);
    const spent = Math.max(0, Number(energy) || 0);
    const gainedExp = Number(exp);
    const gainedGold = Math.max(0, Number(gold) || 0);
    if (!Number.isInteger(id) || id <= 0) return;
    if (!Number.isInteger(stage) || stage <= 0) return;
    if (!Number.isFinite(gainedExp) || gainedExp < 0 || spent <= 0) return;

    db.prepare(`
      INSERT INTO story_stage_stats
        (account_id, scid, runs, wins, exp_sum, gold_sum, energy_sum, updated_at)
      VALUES (?, ?, 1, ?, ?, ?, ?, ?)
      ON CONFLICT(account_id, scid) DO UPDATE SET
        runs = runs + 1,
        wins = wins + excluded.wins,
        exp_sum = exp_sum + excluded.exp_sum,
        gold_sum = gold_sum + excluded.gold_sum,
        energy_sum = energy_sum + excluded.energy_sum,
        updated_at = excluded.updated_at
    `).run(
      id,
      stage,
      won ? 1 : 0,
      Math.round(gainedExp),
      Math.round(gainedGold),
      Math.round(spent),
      now(),
    );
  }

  function getStoryStageStats(accountId) {
    const id = Number(accountId);
    if (!Number.isInteger(id) || id <= 0) return [];
    return db
      .prepare(`
        SELECT scid, runs, wins, exp_sum, gold_sum, energy_sum, updated_at
        FROM story_stage_stats
        WHERE account_id = ?
        ORDER BY scid
      `)
      .all(id)
      .map((row) => ({
        scid: Number(row.scid),
        runs: Number(row.runs),
        wins: Number(row.wins),
        expSum: Number(row.exp_sum),
        goldSum: Number(row.gold_sum),
        energySum: Number(row.energy_sum),
        updatedAt: row.updated_at,
      }));
  }

  /** Thong tin can thiet de dang nhap (mat khau da giai ma). */
  function getCredentials(id) {
    const row = getRow(id);
    if (!row) return null;
    return {
      id: Number(row.id),
      username: row.username,
      password: secretBox.decrypt(row.password_enc),
      enabled: Boolean(row.enabled),
    };
  }

  function getSessionToken(id) {
    const row = getRow(id);
    if (!row || !row.token_enc) return null;
    return secretBox.decrypt(row.token_enc);
  }

  function setSession(id, { token, profile }) {
    db.prepare(`
      UPDATE accounts SET
        token_enc = ?,
        token_updated_at = ?,
        status = 'active',
        last_error = NULL,
        last_login_at = ?,
        last_sync_at = ?,
        character_name = ?,
        character_id = ?,
        level = ?,
        power = ?,
        gold = ?,
        diamond = ?,
        guild_name = ?,
        rank_no = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      secretBox.encrypt(token),
      now(),
      now(),
      profile.syncedAt,
      profile.characterName ?? '',
      profile.characterId ?? null,
      profile.level ?? null,
      profile.power ?? null,
      profile.gold ?? null,
      profile.diamond ?? null,
      profile.guildName ?? null,
      profile.rankNo ?? null,
      now(),
      Number(id),
    );
    return getAccount(id);
  }

  function updateProfile(id, profile) {
    db.prepare(`
      UPDATE accounts SET
        status = 'active',
        last_error = NULL,
        last_sync_at = ?,
        character_name = ?,
        character_id = ?,
        level = ?,
        power = ?,
        gold = ?,
        diamond = ?,
        guild_name = ?,
        rank_no = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      profile.syncedAt,
      profile.characterName ?? '',
      profile.characterId ?? null,
      profile.level ?? null,
      profile.power ?? null,
      profile.gold ?? null,
      profile.diamond ?? null,
      profile.guildName ?? null,
      profile.rankNo ?? null,
      now(),
      Number(id),
    );
    return getAccount(id);
  }

  function clearSession(id, { status = 'new', error = null } = {}) {
    db.prepare(`
      UPDATE accounts SET
        token_enc = NULL,
        token_updated_at = NULL,
        auto_enabled = 0,
        status = ?,
        last_error = ?,
        updated_at = ?
      WHERE id = ?
    `).run(status, error, now(), Number(id));
    return getAccount(id);
  }

  function markError(id, message) {
    db.prepare('UPDATE accounts SET last_error = ?, updated_at = ? WHERE id = ?')
      .run(message, now(), Number(id));
    return getAccount(id);
  }

  function addLog({
    accountId = null,
    username = '',
    action,
    level = 'info',
    message = '',
    meta = null,
  }) {
    if (!action) throw new Error('Thiếu action cho nhật ký.');

    const info = db
      .prepare(`
        INSERT INTO activity_logs
          (account_id, username, action, level, message, meta, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        accountId === null ? null : Number(accountId),
        String(username || ''),
        String(action),
        String(level),
        String(message || ''),
        meta === null ? null : JSON.stringify(meta),
        now(),
      );

    db.prepare(`
      DELETE FROM activity_logs
      WHERE id NOT IN (SELECT id FROM activity_logs ORDER BY id DESC LIMIT 5000)
    `).run();

    return Number(info.lastInsertRowid);
  }

  function listLogs({ limit = 100, offset = 0, accountId = null, level = '' } = {}) {
    const where = [];
    const values = [];

    if (accountId !== null && accountId !== undefined) {
      where.push('account_id = ?');
      values.push(Number(accountId));
    }
    if (level) {
      where.push('level = ?');
      values.push(String(level));
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';
    const total = Number(
      db.prepare(`SELECT COUNT(*) AS total FROM activity_logs ${whereSql}`)
        .get(...values).total,
    );
    const rows = db
      .prepare(`
        SELECT * FROM activity_logs
        ${whereSql}
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `)
      .all(...values, Number(limit), Number(offset));

    return {
      logs: rows.map((row) => {
        let meta = null;
        if (row.meta) {
          try {
            meta = JSON.parse(row.meta);
          } catch {
            meta = null;
          }
        }
        return {
          id: Number(row.id),
          accountId: row.account_id === null ? null : Number(row.account_id),
          username: row.username,
          action: row.action,
          level: row.level,
          message: row.message,
          meta,
          createdAt: row.created_at,
        };
      }),
      total,
    };
  }

  /* ------------------------------ Bot engine ------------------------------ */

  const ENGINE_DEFAULTS = {
    dryRun: true,
    intervalSeconds: 300,
    maxActions: 1,
    allowDaily: true,
    allowStory: false,
    allowBoss: false,
    allowPvp: false,
    storyRunsPerDay: 20,
    pvpBattlesPerDay: 5,
  };

  function engineRow() {
    let row = db.prepare('SELECT * FROM engine_settings WHERE id = 1').get();
    if (!row) {
      db.prepare(`
        INSERT INTO engine_settings
          (id, dry_run, interval_seconds, max_actions, allow_daily, allow_story,
           allow_boss, allow_pvp, story_runs_per_day, pvp_battles_per_day, updated_at)
        VALUES (1, 1, 300, 1, 1, 0, 0, 0, 20, 5, ?)
      `).run(now());
      row = db.prepare('SELECT * FROM engine_settings WHERE id = 1').get();
    }
    return row;
  }

  function toEngineSettings(row) {
    return {
      dryRun: Boolean(row.dry_run),
      intervalSeconds: Number(row.interval_seconds),
      maxActions: Number(row.max_actions),
      allowDaily: Boolean(row.allow_daily),
      allowStory: Boolean(row.allow_story),
      allowBoss: Boolean(row.allow_boss),
      allowPvp: Boolean(row.allow_pvp),
      storyRunsPerDay: Number(row.story_runs_per_day),
      pvpBattlesPerDay: Number(row.pvp_battles_per_day),
      updatedAt: row.updated_at,
    };
  }

  function getEngineSettings() {
    return toEngineSettings(engineRow());
  }

  function clampInt(value, min, max, fallback) {
    const number = Math.trunc(Number(value));
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function updateEngineSettings(patch = {}) {
    const current = getEngineSettings();
    const next = {
      dryRun: patch.dryRun === undefined ? current.dryRun : Boolean(patch.dryRun),
      intervalSeconds:
        patch.intervalSeconds === undefined
          ? current.intervalSeconds
          : clampInt(patch.intervalSeconds, 30, 3600, current.intervalSeconds),
      maxActions:
        patch.maxActions === undefined
          ? current.maxActions
          : clampInt(patch.maxActions, 1, 5, current.maxActions),
      allowDaily: patch.allowDaily === undefined ? current.allowDaily : Boolean(patch.allowDaily),
      allowStory: patch.allowStory === undefined ? current.allowStory : Boolean(patch.allowStory),
      allowBoss: patch.allowBoss === undefined ? current.allowBoss : Boolean(patch.allowBoss),
      allowPvp: patch.allowPvp === undefined ? current.allowPvp : Boolean(patch.allowPvp),
      storyRunsPerDay:
        patch.storyRunsPerDay === undefined
          ? current.storyRunsPerDay
          : clampInt(patch.storyRunsPerDay, 0, 200, current.storyRunsPerDay),
      pvpBattlesPerDay:
        patch.pvpBattlesPerDay === undefined
          ? current.pvpBattlesPerDay
          : clampInt(patch.pvpBattlesPerDay, 0, 50, current.pvpBattlesPerDay),
    };

    db.prepare(`
      UPDATE engine_settings
      SET dry_run = ?, interval_seconds = ?, max_actions = ?, allow_daily = ?,
          allow_story = ?, allow_boss = ?, allow_pvp = ?,
          story_runs_per_day = ?, pvp_battles_per_day = ?, updated_at = ?
      WHERE id = 1
    `).run(
      next.dryRun ? 1 : 0,
      next.intervalSeconds,
      next.maxActions,
      next.allowDaily ? 1 : 0,
      next.allowStory ? 1 : 0,
      next.allowBoss ? 1 : 0,
      next.allowPvp ? 1 : 0,
      next.storyRunsPerDay,
      next.pvpBattlesPerDay,
      now(),
    );

    return getEngineSettings();
  }

  return {
    listAccounts,
    getAccount,
    getCredentials,
    getSessionToken,
    createAccount,
    updateAccount,
    toggleAccount,
    setAuto,
    deleteAccount,
    recordStoryRun,
    getStoryStageStats,
    setSession,
    updateProfile,
    clearSession,
    markError,
    addLog,
    listLogs,
    stats,
    getEngineSettings,
    updateEngineSettings,
    close: () => db.close(),
  };
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

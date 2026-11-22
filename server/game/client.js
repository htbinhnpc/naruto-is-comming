const VERSION_CACHE_MS = 10 * 60 * 1000;

export class GameApiError extends Error {
  constructor(message, { statusCode = 502, code = 'GAME_API', expose = true } = {}) {
    super(message);
    this.name = 'GameApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.expose = expose;
  }
}

const FATAL_CODES = new Set(['UNAUTHORIZED', 'VERSION', 'RATE_LIMIT', 'NETWORK']);

export function isFatalGameError(error) {
  return error instanceof GameApiError && FATAL_CODES.has(error.code);
}

/**
 * Client cho API cua Naruto Is Coming.
 * Tai lieu tham chieu: api.md (muc 4 va 5).
 */
export function createGameClient(gameConfig) {
  const base = String(gameConfig.baseUrl).replace(/\/+$/, '');
  let clientVersion = gameConfig.clientVersion;
  let versionCheckedAt = 0;

  async function resolveVersion() {
    if (Date.now() - versionCheckedAt < VERSION_CACHE_MS) {
      return clientVersion;
    }

    try {
      const response = await fetch(`${base}/api/api/version`, {
        method: 'POST',
        headers: {
          'X-Api-Key': gameConfig.apiKey,
          'Content-Type': 'application/json',
        },
        body: '{}',
        signal: AbortSignal.timeout(gameConfig.requestTimeoutMs),
      });
      if (response.ok) {
        const data = await response.json().catch(() => null);
        if (data?.version) clientVersion = String(data.version);
      }
    } catch {
      // Dung version cau hinh neu khong doc duoc.
    }

    versionCheckedAt = Date.now();
    return clientVersion;
  }

  async function request(path, { body = {}, token } = {}) {
    const headers = {
      'X-Api-Key': gameConfig.apiKey,
      'X-Client-Version': await resolveVersion(),
      'Content-Type': 'application/json',
    };
    if (token) headers['X-Session-Token'] = token;

    let response;
    try {
      response = await fetch(`${base}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(gameConfig.requestTimeoutMs),
      });
    } catch (error) {
      throw new GameApiError(
        error.name === 'TimeoutError'
          ? 'Server game không phản hồi, vui lòng thử lại.'
          : 'Không kết nối được tới server game.',
        { code: 'NETWORK' },
      );
    }

    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      if (response.status === 401) {
        throw new GameApiError('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.', {
          statusCode: 401,
          code: 'UNAUTHORIZED',
        });
      }
      if (response.status === 426) {
        throw new GameApiError('Phiên bản client không khớp với server game.', {
          statusCode: 409,
          code: 'VERSION',
        });
      }
      if (response.status === 429) {
        throw new GameApiError('Server game đang giới hạn tần suất, thử lại sau ít phút.', {
          statusCode: 429,
          code: 'RATE_LIMIT',
        });
      }
      throw new GameApiError(`Server game trả về lỗi ${response.status}.`, {
        code: 'HTTP',
      });
    }

    return data;
  }

  async function login(username, password) {
    const data = await request('/api/api/session/login', {
      body: { uname: username, password, remember: true },
    });

    if (!data || String(data.result) !== '1' || !data.token) {
      throw new GameApiError('Sai tên đăng nhập hoặc mật khẩu.', {
        statusCode: 400,
        code: 'AUTH',
      });
    }
    return String(data.token);
  }

  async function register(
    username,
    password,
    { email = '', phone = '', device = 'bot' } = {},
  ) {
    return request('/api/api/session/register', {
      body: {
        uname: String(username),
        password: String(password),
        email: String(email),
        phone: String(phone),
        device: String(device),
      },
    });
  }

  async function newUser(token, { name, ninja = 21, keepAlpha = false } = {}) {
    return request('/api1/api/session/new-user', {
      body: {
        name: String(name),
        ninja: Number(ninja),
        keepAlpha: Boolean(keepAlpha),
      },
      token,
    });
  }

  async function newUserInfo(token) {
    return request('/api1/api/session/new-user-info', { body: {}, token });
  }

  async function randomName(token) {
    return request('/api1/api/session/random-name', { body: {}, token });
  }

  async function selectServer(token) {
    const data = await request('/api1/api/session/select-server', { body: {}, token });
    return data?.result === undefined || data?.result === null ? null : String(data.result);
  }

  async function logout(token) {
    await request('/api1/api/session/logout', { body: {}, token });
  }

  function buildStatement(procedure, params = {}) {
    if (!/^[A-Za-z0-9_]+$/.test(procedure)) {
      throw new GameApiError('Tên procedure không hợp lệ.', { statusCode: 400 });
    }
    const args = Object.entries(params)
      .map(([name, value]) => `@${name} = ${formatParam(value)}`)
      .join(', ');
    return `EXECUTE dbo.${procedure}${args ? ` ${args}` : ''}`;
  }

  async function sql(token, procedure, kind = 'row', params = {}) {
    return request(`/api1/api/sql/${kind}`, {
      body: { sql: buildStatement(procedure, params) },
      token,
    });
  }

  /**
   * sql/table chi tra result set dau tien. Nhieu procedure (P4Bag*...) tra
   * set 0 la header tien te, set 1 moi la hang du lieu that.
   */
  async function sqlDataset(token, procedure, params = {}) {
    return request('/api1/api/sql/dataset', {
      body: { sql: buildStatement(procedure, params) },
      token,
    });
  }

  async function optionalSql(token, procedure, kind = 'row') {
    try {
      return await sql(token, procedure, kind);
    } catch (error) {
      if (isFatalGameError(error)) throw error;
      return null;
    }
  }

  async function useItem(token, item, quantity = 1) {
    return request('/api1/api/reward/use-item', {
      body: { item: Number(item), quantity: Number(quantity) },
      token,
    });
  }

  async function houseDraw(token, btn = 1) {
    return request('/api1/api/reward/house-draw', {
      body: { btn: Number(btn) },
      token,
    });
  }

  async function keyOpen(token, keyType = 1) {
    return request('/api1/api/reward/key-open', {
      body: { keyType: Number(keyType) },
      token,
    });
  }

  async function guildInfo(token) {
    return sql(token, 'P2MyGuildInfo', 'row');
  }

  async function guildList(token, name = '') {
    return sql(token, 'P3GuildList', 'table', { Name: String(name ?? '') });
  }

  async function guildRequests(token) {
    return sql(token, 'P3GuildRequestList', 'table');
  }

  async function guildCreate(token, name) {
    return sql(token, 'P1GuildCreate', 'table', { Name: String(name ?? '') });
  }

  async function guildJoin(token, guildId) {
    return sql(token, 'P1GuildRequestJoin', 'table', {
      GuildId: Number(guildId),
    });
  }

  async function guildAccept(token, targetUserId) {
    return sql(token, 'P1GuildAcceptMember', 'table', {
      TargetUserId: Number(targetUserId),
    });
  }

  async function guildLeave(token) {
    return sql(token, 'P1GuildLeave', 'table');
  }

  async function battle(token, { opponentId, isBot = true } = {}) {
    return request('/api1/api/battle', {
      body: { opponentId: Number(opponentId), isBot: Boolean(isBot) },
      token,
    });
  }

  async function battleLog(token, id = null) {
    return request('/api1/api/battle/9vs9/log', {
      body: id ? { id: Number(id) } : {},
      token,
    });
  }

  async function trainBattle(token, { cave, tier, mode, stageNo }) {
    return request('/api1/api/battle/train', {
      body: {
        cave: Number(cave),
        tier: Number(tier),
        mode: Number(mode),
        stageNo: Number(stageNo),
      },
      token,
    });
  }

  async function ultimateBattle(token, { mode, stageNo, star }) {
    return request('/api1/api/battle/ultimate', {
      body: {
        mode: Number(mode),
        stageNo: Number(stageNo),
        star: Number(star),
      },
      token,
    });
  }

  async function beastBattle(token) {
    return request('/api1/api/battle/boss', { body: {}, token });
  }

  async function guildBossBattle(token) {
    return request('/api1/api/battle/guildboss', { body: {}, token });
  }

  async function rankBattle(token, targetRankNo) {
    return request('/api1/api/battle/rank', {
      body: { targetRankNo: Number(targetRankNo) },
      token,
    });
  }

  async function plunderBattle(token, targetUserId) {
    return request('/api1/api/battle/plunder', {
      body: { targetUserId: Number(targetUserId) },
      token,
    });
  }

  async function plunderList(token) {
    return request('/api1/api/battle/plunder-list', { body: {}, token });
  }

  async function fetchProfile(token) {
    const info = await optionalSql(token, 'P2Info', 'row');
    const main = await optionalSql(token, 'P4MainLoad', 'row');

    if (!info && !main) {
      throw new GameApiError('Không đọc được thông tin nhân vật từ server game.', {
        statusCode: 502,
        code: 'PROFILE',
      });
    }

    const powerRow = await optionalSql(token, 'P3TeamPower', 'row');
    let power = extractPower(powerRow);

    if (power === null) {
      const team = await optionalSql(token, 'P3Team', 'table');
      power = extractPower(team);
    }

    const guild = await optionalSql(token, 'P2MyGuildInfo', 'row');
    const rankRows = await optionalSql(token, 'P2RankList', 'table');

    const characterName = String(main?.Name || info?.Name || '').trim();
    const characterId = info?.Id ?? null;

    return {
      characterName,
      characterId: characterId === null ? null : String(characterId),
      level: toNumber(main?.Lv ?? info?.Lv),
      power,
      gold: toNumber(main?.Gold),
      diamond: toNumber(main?.Diamond),
      guildName: guild?.GuildName ? String(guild.GuildName) : null,
      rankNo: findOwnRank(rankRows, characterId, characterName),
      syncedAt: new Date().toISOString(),
    };
  }

  return {
    login,
    register,
    newUser,
    newUserInfo,
    randomName,
    selectServer,
    logout,
    sql,
    sqlDataset,
    fetchProfile,
    useItem,
    houseDraw,
    keyOpen,
    guildInfo,
    guildList,
    guildRequests,
    guildCreate,
    guildJoin,
    guildAccept,
    guildLeave,
    battle,
    battleLog,
    trainBattle,
    ultimateBattle,
    beastBattle,
    guildBossBattle,
    rankBattle,
    plunderBattle,
    plunderList,
  };
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatParam(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('Tham số số không hợp lệ.');
    return String(Math.trunc(value));
  }
  return `N'${String(value).replace(/'/g, "''")}'`;
}

function extractPower(payload) {
  if (payload === null || payload === undefined) return null;
  if (typeof payload === 'number') return toNumber(payload);

  if (Array.isArray(payload)) {
    if (payload.length === 0) return null;
    if (payload.length === 1) return extractPower(payload[0]);

    let sum = 0;
    let found = false;
    for (const row of payload) {
      const value = extractPower(row);
      if (value !== null) {
        sum += value;
        found = true;
      }
    }
    return found ? sum : null;
  }

  if (typeof payload === 'object') {
    const preferred = [
      'Power',
      'TeamPower',
      'TotalPower',
      'FightPower',
      'PowerTotal',
      'TotalFightPower',
    ];
    for (const key of preferred) {
      if (payload[key] !== undefined && payload[key] !== null) {
        const value = toNumber(payload[key]);
        if (value !== null) return value;
      }
    }

    const key = Object.keys(payload).find(
      (name) => /power/i.test(name) && toNumber(payload[name]) !== null,
    );
    if (key) return toNumber(payload[key]);
  }

  return null;
}

function findOwnRank(rows, userId, name) {
  if (!Array.isArray(rows)) return null;

  let match = null;
  if (userId !== null && userId !== undefined) {
    match = rows.find((row) => String(row?.UserId) === String(userId));
  }
  if (!match && name) {
    match = rows.find((row) => String(row?.Name || '').toLowerCase() === name.toLowerCase());
  }

  return toNumber(match?.RankNo);
}

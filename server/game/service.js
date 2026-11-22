import { GameApiError } from './client.js';
import { ValidationError } from '../db.js';
/**
 * Dieu phoi dang nhap / dang xuat / dong bo ho so nguoi choi.
 *
 * Luu y tu api.md: token moi tu /session/login co the tra ve result "-1"
 * o /session/select-server (loi cua moi truong Alpha). Vi vay chi coi la
 * dang nhap thanh cong khi doc duoc ho so qua P2Info/P4MainLoad.
 */
export async function loginAccount(store, game, id) {
  const credentials = store.getCredentials(id);
  if (!credentials) {
    const error = new Error('Không tìm thấy tài khoản.');
    error.statusCode = 404;
    throw error;
  }
  if (!credentials.enabled) {
    throw new ValidationError('Tài khoản đang tắt, hãy bật lại trước khi đăng nhập.');
  }

  try {
    const token = await game.login(credentials.username, credentials.password);
    const selected = await game.selectServer(token);

    if (selected === '0') {
      throw new GameApiError('Tài khoản chưa có nhân vật trong game.', {
        statusCode: 400,
        code: 'NO_CHARACTER',
      });
    }

    let profile;
    try {
      profile = await game.fetchProfile(token);
    } catch (error) {
      if (error instanceof GameApiError && error.code === 'UNAUTHORIZED') {
        throw new GameApiError(
          'Không bind được phiên vào nhân vật. Thử đăng nhập lại sau ít phút.',
          { statusCode: 502, code: 'BIND_FAILED' },
        );
      }
      throw error;
    }

    return store.setSession(id, { token, profile });
  } catch (error) {
    store.clearSession(id, { status: 'error', error: error.message });
    throw error;
  }
}

export async function logoutAccount(store, game, id) {
  const token = store.getSessionToken(id);

  if (token) {
    try {
      await game.logout(token);
    } catch {
      // Server co the khong thu hoi token ngay; van xoa phien cuc bo.
    }
  }

  return store.clearSession(id, { status: 'new' });
}

export async function syncAccount(store, game, id) {
  const token = store.getSessionToken(id);
  if (!token) {
    throw new ValidationError('Tài khoản chưa đăng nhập.');
  }

  try {
    const profile = await game.fetchProfile(token);
    return store.updateProfile(id, profile);
  } catch (error) {
    if (error instanceof GameApiError && error.code === 'UNAUTHORIZED') {
      store.clearSession(id, {
        status: 'error',
        error: 'Phiên đã hết hạn, hãy đăng nhập lại.',
      });
    } else if (error instanceof GameApiError) {
      store.markError(id, error.message);
    }
    throw error;
  }
}

/** Chay tac vu voi session token hien tai, tu dong ha state khi phien het han. */
export async function withSession(store, game, id, task) {
  const token = store.getSessionToken(id);
  if (!token) {
    throw new ValidationError('Tài khoản chưa đăng nhập.');
  }

  try {
    return await task(token);
  } catch (error) {
    if (error instanceof GameApiError && error.code === 'UNAUTHORIZED') {
      store.clearSession(id, {
        status: 'error',
        error: 'Phiên đã hết hạn, hãy đăng nhập lại.',
      });
    }
    throw error;
  }
}

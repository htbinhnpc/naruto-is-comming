import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const config = {
  rootDir,
  publicDir: path.join(rootDir, 'public'),
  dataDir: process.env.DATA_DIR || path.join(rootDir, 'data'),
  host: process.env.HOST || '127.0.0.1',
  port: Number(process.env.PORT || 3000),
  // Gioi han kich thuoc body JSON (byte) de tranh request qua lon.
  maxBodyBytes: 64 * 1024,
  game: {
    // Doi GAME_API_BASE khi test voi mock server hoac server khac.
    baseUrl: process.env.GAME_API_BASE || 'https://naruto.id.vn',
    apiKey: process.env.GAME_API_KEY || 'ninja-local-dev-9f83ac21',
    clientVersion: process.env.GAME_CLIENT_VERSION || '26.11.21',
    requestTimeoutMs: Number(process.env.GAME_TIMEOUT_MS || 15000),
  },
};


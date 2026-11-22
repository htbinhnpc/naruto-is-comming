import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'node:crypto';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const ALGORITHM = 'aes-256-gcm';
const KEY_BYTES = 32;

/**
 * Ma hoa mat khau tai khoan truoc khi luu xuong SQLite.
 * Khoa duoc sinh mot lan va luu trong data/secret.key (chmod 600).
 */
export function createSecretBox(dataDir) {
  const keyPath = path.join(dataDir, 'secret.key');

  function loadKey() {
    if (existsSync(keyPath)) {
      const key = Buffer.from(readFileSync(keyPath, 'utf8').trim(), 'base64');
      if (key.length !== KEY_BYTES) {
        throw new Error(`Khoa bi hong: ${keyPath} phai dai ${KEY_BYTES} byte`);
      }
      return key;
    }

    mkdirSync(dataDir, { recursive: true });
    const key = randomBytes(KEY_BYTES);
    writeFileSync(keyPath, key.toString('base64'), { mode: 0o600 });
    try {
      chmodSync(keyPath, 0o600);
    } catch {
      // Windows khong ho tro chmod; bo qua.
    }
    return key;
  }

  const key = loadKey();

  function encrypt(plaintext) {
    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(String(plaintext), 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return [
      'v1',
      iv.toString('base64url'),
      tag.toString('base64url'),
      ciphertext.toString('base64url'),
    ].join('.');
  }

  function decrypt(payload) {
    const parts = String(payload).split('.');
    if (parts.length !== 4 || parts[0] !== 'v1') {
      throw new Error('Du lieu ma hoa khong hop le');
    }
    const [, ivPart, tagPart, dataPart] = parts;
    const decipher = createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(ivPart, 'base64url'),
    );
    decipher.setAuthTag(Buffer.from(tagPart, 'base64url'));
    return Buffer.concat([
      decipher.update(Buffer.from(dataPart, 'base64url')),
      decipher.final(),
    ]).toString('utf8');
  }

  return { encrypt, decrypt };
}

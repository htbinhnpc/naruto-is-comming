export function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

export function sendNoContent(res) {
  res.writeHead(204);
  res.end();
}

export async function readJsonBody(req, maxBytes) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) {
      const error = new Error('Dữ liệu gửi lên quá lớn.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  if (size === 0) return {};

  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('not an object');
    }
    return parsed;
  } catch {
    const error = new Error('Body phải là JSON hợp lệ.');
    error.statusCode = 400;
    throw error;
  }
}

export function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  const canExpose = error.expose || statusCode < 500;
  if (statusCode >= 500) {
    console.error('[server]', error);
  }
  sendJson(res, statusCode, {
    error: canExpose ? error.message : 'Lỗi máy chủ, vui lòng thử lại.',
  });
}

/**
 * Dinh dang nhat quan cho log cac luong chay (story, training, boss, pvp,
 * gacha, item...). Chi 4 dong: Tien trinh / Cost / Gain / Trang thai.
 */

const STOP_REASONS = {
  'max-runs': 'Đã chạy đủ số lượt yêu cầu',
  'no-run': 'Đã hết lượt',
  'no-target': 'Không còn mục tiêu phù hợp',
  'no-bp': 'Hết BP',
  'no-hits': 'Hết lượt đánh boss',
  'no-guild': 'Chưa tham gia guild',
  'no-free-spin': 'Không còn lượt miễn phí',
  'no-reward': 'Không có thưởng để nhận',
  'no-fuel': 'Không còn nguyên liệu để nâng cấp',
  'level-cap': 'Đã đạt cấp tối đa (theo cấp nhân vật)',
  'still-pending': 'Vẫn còn mục chưa nhận',
  'low-level': 'Chưa đủ cấp',
  energy: 'Hết năng lượng',
  'no-items': 'Không còn vật phẩm hồi năng lượng',
  'item-cap': 'Đã đạt giới hạn dùng vật phẩm hôm nay',
  'item-error': 'Lỗi khi dùng vật phẩm',
  'item-no-effect': 'Vật phẩm không hồi năng lượng',
  'insufficient-gold': 'Không đủ Vàng cho vòng tốt nhất',
  rejected: 'Server từ chối thao tác',
  'api-error': 'Lỗi kết nối tới server game',
  loss: 'Thua trận',
  defeated: 'Bị đánh bại',
  killed: 'Boss đã bị tiêu diệt',
  cooldown: 'Boss đang hồi chiêu',
  'window-ending': 'Sắp hết khung giờ boss',
  closed: 'Động đang đóng',
  pending: 'Cần nhận buff/thưởng trước khi chạy tiếp',
  locked: 'Stage đang khóa',
  'bad-stage': 'Stage không hợp lệ',
  'stage-missing': 'Không tìm thấy stage',
  'no-ninja': 'Chưa có đội hình',
  'low-level': 'Chưa đủ cấp',
  unverified: 'Không xác thực được kết quả trận',
  'progress-stalled': 'Cốt truyện không tiến thêm',
  stronger: 'Đối thủ mạnh hơn',
  'unknown-power': 'Không đọc được lực chiến đối thủ',
  unsafe: 'Không đủ điều kiện an toàn',
  stopped: 'Đã dừng theo yêu cầu',
  budget: 'Đã đạt ngân sách lệnh',
  'error:state': 'Không đọc được trạng thái từ server',
  unsupported: 'Tính năng chưa được hỗ trợ',
  'missing-account': 'Không tìm thấy tài khoản',
  'gold-outlier': 'Số Vàng bất thường, bỏ qua',
  error: 'Có lỗi xảy ra',
};

/** Lý do dừng: dùng text cụ thể nếu có, nếu không thì giữ nguyên mã. */
export function stopReasonText(reason) {
  if (!reason) return null;
  const key = String(reason);
  if (STOP_REASONS[key]) return STOP_REASONS[key];
  if (key.startsWith('error:')) return `Lỗi: ${key.slice(6)}`;
  return key;
}

/** Nối các phần Cost/Gain, bo qua phan rong. */
export function joinParts(...parts) {
  return parts.filter((part) => part !== null && part !== undefined && part !== '').join(' · ');
}

/**
 * @param {{done:number,total:number,cost?:string[],gain?:string[],stopReason?:string|null}} info
 */
export function formatRunLog({ done, total, cost = [], gain = [], stopReason = null }) {
  const lines = [`Tiến trình: ${done}/${total}`];
  if (cost.length) lines.push(`Cost: ${cost.join(' · ')}`);
  if (gain.length) lines.push(`Gain: ${gain.join(' · ')}`);
  // Chay đủ số lượt là hoàn thành, khong phai "dừng".
  const finished =
    !stopReason || stopReason === 'max-runs' || stopReason === 'complete';
  lines.push(finished ? 'Đã hoàn thành' : `Đã dừng: ${stopReasonText(stopReason)}`);
  return lines.join('\n');
}

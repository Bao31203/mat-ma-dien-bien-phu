import { validateSave } from './save-validation.js';

export const SAVE_KEY = 'mat-ma-dien-bien-phu:save:v1';
export function loadSave(storage) {
  try {
    const serialized = storage.getItem(SAVE_KEY);
    if (serialized === null) return { state: null, notice: null };
    const state = validateSave(JSON.parse(serialized));
    return { state, notice: state ? null : 'Tiến độ đã lưu không hợp lệ. Bạn có thể bắt đầu lượt chơi mới.' };
  } catch {
    return { state: null, notice: 'Không thể đọc tiến độ đã lưu. Bạn vẫn có thể chơi mới trong phiên này.' };
  }
}

export function writeSave(storage, state) {
  try {
    const sanitized = validateSave(state);
    if (!sanitized) return { ok: false, notice: 'Tiến độ chưa hợp lệ nên chưa được lưu.' };
    storage.setItem(SAVE_KEY, JSON.stringify(sanitized));
    return { ok: true, notice: null };
  } catch {
    return { ok: false, notice: 'Không thể lưu trên thiết bị này. Bạn vẫn có thể tiếp tục trong phiên hiện tại.' };
  }
}

export function clearSave(storage) {
  try {
    storage.removeItem(SAVE_KEY);
    return { ok: true, notice: null };
  } catch {
    return { ok: false, notice: 'Lượt chơi đã được làm mới trong phiên này; tiến độ cũ có thể còn khi tải lại trang.' };
  }
}

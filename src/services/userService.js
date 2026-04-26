import store from '../models/index.js';
import { writeCSV } from '../utils/csvLoader.js';
import { paginate } from '../utils/paginate.js';

const SAFE_FIELDS = ['id','userId','username','role','provinceId','districtId','stationId','linkedTukTukId','isActive','lastLogin','createdAt'];

const safeUser = u => Object.fromEntries(SAFE_FIELDS.map(f => [f, u[f]]));

export const userService = {
  getAll({ role, provinceId, districtId, stationId, isActive, page = 1, limit = 20 }) {
    let list = store.users.map(safeUser);
    if (role)       list = list.filter(u => u.role === role);
    if (provinceId) list = list.filter(u => String(u.provinceId) === String(provinceId));
    if (districtId) list = list.filter(u => String(u.districtId) === String(districtId));
    if (stationId)  list = list.filter(u => String(u.stationId) === String(stationId));
    if (isActive !== undefined) list = list.filter(u => String(u.isActive) === String(isActive));
    return paginate(list, page, limit);
  },

  getById(id) {
    const u = store.users.find(u => u.userId === id || String(u.id) === String(id));
    return u ? safeUser(u) : null;
  },

  update(id, data) {
    const idx = store.users.findIndex(u => u.userId === id || String(u.id) === String(id));
    if (idx === -1) return null;
    // Never allow password update here — use dedicated endpoint
    const { password, passwordHash, ...safe } = data;
    store.users[idx] = { ...store.users[idx], ...safe };
    writeCSV('users.csv', store.users);
    return safeUser(store.users[idx]);
  },

  deactivate(id) {
    return userService.update(id, { isActive: false });
  },

  activate(id) {
    return userService.update(id, { isActive: true });
  },
};

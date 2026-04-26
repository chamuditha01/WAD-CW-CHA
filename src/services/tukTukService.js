import { v4 as uuidv4 } from 'uuid';
import store from '../models/index.js';
import { writeCSV } from '../utils/csvLoader.js';
import { paginate } from '../utils/paginate.js';

export const tukTukService = {
  getAll({ provinceId, districtId, status, search, page = 1, limit = 20 }) {
    let list = [...store.tukTuks];

    if (provinceId) list = list.filter(t => String(t.provinceId) === String(provinceId));
    if (districtId) list = list.filter(t => String(t.districtId) === String(districtId));
    if (status)     list = list.filter(t => t.status === status);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.registrationNumber?.toLowerCase().includes(q) ||
        t.driverName?.toLowerCase().includes(q) ||
        t.ownerName?.toLowerCase().includes(q) ||
        t.driverNIC?.toLowerCase().includes(q)
      );
    }

    return paginate(list, page, limit);
  },

  getById(id) {
    return store.tukTuks.find(t => String(t.id) === String(id) || t.registrationNumber === id);
  },

  create(data) {
    const dup = store.tukTuks.find(t => t.registrationNumber === data.registrationNumber);
    if (dup) throw new Error('Registration number already exists');

    const now = new Date().toISOString();
    const rec = {
      id: String(store.tukTuks.length + 1),
      ...data,
      deviceId: data.deviceId || uuidv4(),
      status: data.status || 'active',
      lastLat: '',
      lastLng: '',
      lastSpeed: '',
      lastHeading: '',
      lastTimestamp: '',
      registeredAt: now,
      updatedAt: now,
    };
    store.tukTuks.push(rec);
    writeCSV('tuk_tuks.csv', store.tukTuks);
    return rec;
  },

  update(id, data) {
    const idx = store.tukTuks.findIndex(t => String(t.id) === String(id));
    if (idx === -1) return null;
    store.tukTuks[idx] = { ...store.tukTuks[idx], ...data, updatedAt: new Date().toISOString() };
    writeCSV('tuk_tuks.csv', store.tukTuks);
    return store.tukTuks[idx];
  },

  delete(id) {
    const idx = store.tukTuks.findIndex(t => String(t.id) === String(id));
    if (idx === -1) return false;
    store.tukTuks.splice(idx, 1);
    writeCSV('tuk_tuks.csv', store.tukTuks);
    return true;
  },

  // Live last-known location for all active vehicles, optionally scoped
  getLiveLocations({ provinceId, districtId }) {
    let list = store.tukTuks.filter(t => t.status === 'active' && t.lastLat && t.lastLng);
    if (provinceId) list = list.filter(t => String(t.provinceId) === String(provinceId));
    if (districtId) list = list.filter(t => String(t.districtId) === String(districtId));
    return list.map(t => ({
      id: t.id,
      registrationNumber: t.registrationNumber,
      driverName: t.driverName,
      districtId: t.districtId,
      provinceId: t.provinceId,
      lat: parseFloat(t.lastLat),
      lng: parseFloat(t.lastLng),
      speed: parseFloat(t.lastSpeed) || 0,
      heading: parseFloat(t.lastHeading) || 0,
      lastTimestamp: t.lastTimestamp,
      status: t.status,
    }));
  },
};

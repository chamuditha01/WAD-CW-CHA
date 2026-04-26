import { v4 as uuidv4 } from 'uuid';
import store from '../models/index.js';
import { writeCSV } from '../utils/csvLoader.js';

export const provinceService = {
  getAll() { return store.provinces; },

  getById(id) {
    return store.provinces.find(p => String(p.id) === String(id) || p.code === id);
  },

  getDistricts(provinceId) {
    return store.districts.filter(d => String(d.provinceId) === String(provinceId));
  },
};

export const districtService = {
  getAll({ provinceId } = {}) {
    let list = [...store.districts];
    if (provinceId) list = list.filter(d => String(d.provinceId) === String(provinceId));
    return list;
  },

  getById(id) {
    return store.districts.find(d => String(d.id) === String(id));
  },

  getStations(districtId) {
    return store.stations.filter(s => String(s.districtId) === String(districtId));
  },
};

export const stationService = {
  getAll({ districtId, provinceId } = {}) {
    let list = [...store.stations];
    if (districtId) {
      list = list.filter(s => String(s.districtId) === String(districtId));
    } else if (provinceId) {
      const dids = store.districts
        .filter(d => String(d.provinceId) === String(provinceId))
        .map(d => String(d.id));
      list = list.filter(s => dids.includes(String(s.districtId)));
    }
    return list;
  },

  getById(id) {
    return store.stations.find(s => String(s.id) === String(id));
  },

  create(data) {
    const rec = {
      id: String(store.stations.length + 1),
      ...data,
    };
    store.stations.push(rec);
    writeCSV('police_stations.csv', store.stations);
    return rec;
  },

  update(id, data) {
    const idx = store.stations.findIndex(s => String(s.id) === String(id));
    if (idx === -1) return null;
    store.stations[idx] = { ...store.stations[idx], ...data };
    writeCSV('police_stations.csv', store.stations);
    return store.stations[idx];
  },

  delete(id) {
    const idx = store.stations.findIndex(s => String(s.id) === String(id));
    if (idx === -1) return false;
    store.stations.splice(idx, 1);
    writeCSV('police_stations.csv', store.stations);
    return true;
  },
};

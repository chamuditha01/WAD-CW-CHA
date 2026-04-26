import { v4 as uuidv4 } from 'uuid';
import store from '../models/index.js';
import { appendCSV, writeCSV } from '../utils/csvLoader.js';
import { paginate } from '../utils/paginate.js';

export const locationService = {
  /**
   * Submit a location ping from a GPS device.
   * Updates the tuk-tuk's last-known location.
   */
  submitPing(tukTukId, data) {
    const tukTuk = store.tukTuks.find(t => String(t.id) === String(tukTukId));
    if (!tukTuk) throw new Error('Tuk-tuk not found');
    if (tukTuk.status === 'suspended') throw new Error('Vehicle is suspended');

    const ping = {
      id: String(store.locationPings.length + 1),
      pingId: uuidv4(),
      tukTukId: String(tukTukId),
      regNumber: tukTuk.registrationNumber,
      latitude: data.latitude,
      longitude: data.longitude,
      speed: data.speed ?? 0,
      heading: data.heading ?? 0,
      accuracy: data.accuracy ?? 0,
      batteryLevel: data.batteryLevel ?? 100,
      timestamp: data.timestamp || new Date().toISOString(),
    };

    store.locationPings.push(ping);
    appendCSV('location_pings.csv', ping);

    // Update tuk-tuk live location
    tukTuk.lastLat       = ping.latitude;
    tukTuk.lastLng       = ping.longitude;
    tukTuk.lastSpeed     = ping.speed;
    tukTuk.lastHeading   = ping.heading;
    tukTuk.lastTimestamp = ping.timestamp;
    tukTuk.updatedAt     = new Date().toISOString();
    writeCSV('tuk_tuks.csv', store.tukTuks);

    return ping;
  },

  /**
   * Get location history for a single tuk-tuk within a time window.
   */
  getHistory(tukTukId, { from, to, page = 1, limit = 50 }) {
    let pings = store.locationPings.filter(
      p => String(p.tukTukId) === String(tukTukId)
    );

    if (from) pings = pings.filter(p => new Date(p.timestamp) >= new Date(from));
    if (to)   pings = pings.filter(p => new Date(p.timestamp) <= new Date(to));

    // Sort newest first
    pings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return paginate(pings, page, limit);
  },

  /**
   * Get recent pings across all vehicles, optionally scoped by province/district.
   */
  getRecentPings({ provinceId, districtId, from, to, page = 1, limit = 50 }) {
    let scopedTukTuks = store.tukTuks;
    if (provinceId) scopedTukTuks = scopedTukTuks.filter(t => String(t.provinceId) === String(provinceId));
    if (districtId) scopedTukTuks = scopedTukTuks.filter(t => String(t.districtId) === String(districtId));

    const ids = new Set(scopedTukTuks.map(t => String(t.id)));
    let pings = store.locationPings.filter(p => ids.has(String(p.tukTukId)));

    if (from) pings = pings.filter(p => new Date(p.timestamp) >= new Date(from));
    if (to)   pings = pings.filter(p => new Date(p.timestamp) <= new Date(to));

    pings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return paginate(pings, page, limit);
  },

  /**
   * Get the single most recent ping per vehicle (live view snapshot).
   */
  getLatestPerVehicle({ provinceId, districtId }) {
    let tukTuks = store.tukTuks.filter(t => t.status === 'active');
    if (provinceId) tukTuks = tukTuks.filter(t => String(t.provinceId) === String(provinceId));
    if (districtId) tukTuks = tukTuks.filter(t => String(t.districtId) === String(districtId));

    const latest = {};
    for (const ping of store.locationPings) {
      const id = String(ping.tukTukId);
      if (!latest[id] || new Date(ping.timestamp) > new Date(latest[id].timestamp)) {
        latest[id] = ping;
      }
    }

    return tukTuks
      .map(t => ({ tukTuk: t, ping: latest[String(t.id)] || null }))
      .filter(r => r.ping !== null);
  },
};

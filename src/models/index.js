import { loadCSV } from '../utils/csvLoader.js';

/**
 * In-memory store.
 * All CSV files are loaded once at startup.
 * Writes go back to CSV via csvLoader helpers.
 */
const store = {
  provinces: [],
  districts: [],
  stations: [],
  tukTuks: [],
  locationPings: [],
  users: [],
};

export function initStore() {
  try { store.provinces      = loadCSV('provinces.csv');       } catch { store.provinces = []; }
  try { store.districts      = loadCSV('districts.csv');       } catch { store.districts = []; }
  try { store.stations       = loadCSV('police_stations.csv'); } catch { store.stations = []; }
  try { store.tukTuks        = loadCSV('tuk_tuks.csv');        } catch { store.tukTuks = []; }
  try { store.locationPings  = loadCSV('location_pings.csv'); } catch { store.locationPings = []; }
  try { store.users          = loadCSV('users.csv');           } catch { store.users = []; }

  console.log(`[Store] provinces=${store.provinces.length}, districts=${store.districts.length}, stations=${store.stations.length}, tukTuks=${store.tukTuks.length}, pings=${store.locationPings.length}, users=${store.users.length}`);
}

export default store;

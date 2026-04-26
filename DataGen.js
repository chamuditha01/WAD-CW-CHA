import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const writeCSV = (filename, rows) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(','), ...rows.map(r =>
    headers.map(h => {
      const v = String(r[h] ?? '');
      return v.includes(',') ? `"${v}"` : v;
    }).join(',')
  )];
  fs.writeFileSync(path.join(DATA_DIR, filename), lines.join('\n') + '\n');
  console.log(`✓ ${filename} — ${rows.length} rows`);
};

const rnd = (min, max) => Math.random() * (max - min) + min;
const rndInt = (min, max) => Math.floor(rnd(min, max + 1));
const pick = arr => arr[rndInt(0, arr.length - 1)];
const fmt = n => parseFloat(n.toFixed(6));

// ── PROVINCES ─────────────────────────────────────────────────────────────────
const provinces = [
  { id: '1', name: 'Western',        code: 'WP' },
  { id: '2', name: 'Central',        code: 'CP' },
  { id: '3', name: 'Southern',       code: 'SP' },
  { id: '4', name: 'Northern',       code: 'NP' },
  { id: '5', name: 'Eastern',        code: 'EP' },
  { id: '6', name: 'North Western',  code: 'NWP' },
  { id: '7', name: 'North Central',  code: 'NCP' },
  { id: '8', name: 'Uva',            code: 'UP' },
  { id: '9', name: 'Sabaragamuwa',   code: 'SGP' },
];
writeCSV('provinces.csv', provinces);

// ── DISTRICTS ─────────────────────────────────────────────────────────────────
const districtData = [
  // Western
  { name: 'Colombo',      provinceId: '1', lat: 6.9271,  lng: 79.8612, spread: 0.30 },
  { name: 'Gampaha',      provinceId: '1', lat: 7.0912,  lng: 80.0000, spread: 0.35 },
  { name: 'Kalutara',     provinceId: '1', lat: 6.5854,  lng: 79.9607, spread: 0.30 },
  // Central
  { name: 'Kandy',        provinceId: '2', lat: 7.2906,  lng: 80.6337, spread: 0.28 },
  { name: 'Matale',       provinceId: '2', lat: 7.4675,  lng: 80.6234, spread: 0.32 },
  { name: 'Nuwara Eliya', provinceId: '2', lat: 6.9497,  lng: 80.7891, spread: 0.25 },
  // Southern
  { name: 'Galle',        provinceId: '3', lat: 6.0535,  lng: 80.2210, spread: 0.30 },
  { name: 'Matara',       provinceId: '3', lat: 5.9485,  lng: 80.5353, spread: 0.28 },
  { name: 'Hambantota',   provinceId: '3', lat: 6.1241,  lng: 81.1185, spread: 0.35 },
  // Northern
  { name: 'Jaffna',       provinceId: '4', lat: 9.6615,  lng: 80.0255, spread: 0.32 },
  { name: 'Kilinochchi',  provinceId: '4', lat: 9.3803,  lng: 80.3770, spread: 0.38 },
  // Eastern
  { name: 'Batticaloa',   provinceId: '5', lat: 7.7170,  lng: 81.7000, spread: 0.30 },
  { name: 'Ampara',       provinceId: '5', lat: 7.2961,  lng: 81.6747, spread: 0.38 },
  { name: 'Trincomalee',  provinceId: '5', lat: 8.5874,  lng: 81.2152, spread: 0.32 },
  // North Western
  { name: 'Kurunegala',   provinceId: '6', lat: 7.4818,  lng: 80.3609, spread: 0.38 },
  { name: 'Puttalam',     provinceId: '6', lat: 8.0362,  lng: 79.8283, spread: 0.35 },
  // North Central
  { name: 'Anuradhapura', provinceId: '7', lat: 8.3114,  lng: 80.4037, spread: 0.42 },
  { name: 'Polonnaruwa',  provinceId: '7', lat: 7.9403,  lng: 81.0188, spread: 0.36 },
  // Uva
  { name: 'Badulla',      provinceId: '8', lat: 6.9934,  lng: 81.0550, spread: 0.30 },
  { name: 'Monaragala',   provinceId: '8', lat: 6.8727,  lng: 81.3507, spread: 0.38 },
  // Sabaragamuwa
  { name: 'Ratnapura',    provinceId: '9', lat: 6.6828,  lng: 80.3992, spread: 0.30 },
  { name: 'Kegalle',      provinceId: '9', lat: 7.2513,  lng: 80.3464, spread: 0.28 },
  // Extra Western
  { name: 'Negombo',      provinceId: '1', lat: 7.2083,  lng: 79.8358, spread: 0.22 },
  { name: 'Panadura',     provinceId: '1', lat: 6.7135,  lng: 79.9034, spread: 0.20 },
  { name: 'Horana',       provinceId: '1', lat: 6.7161,  lng: 80.0621, spread: 0.22 },
];

const districts = districtData.map((d, i) => ({ id: String(i + 1), ...d }));
writeCSV('districts.csv', districts);

// ── POLICE STATIONS ───────────────────────────────────────────────────────────
const stationNames = [
  'Fort', 'Pettah', 'Maradana', 'Borella', 'Wellawatte',
  'Dehiwala', 'Mt Lavinia', 'Moratuwa', 'Nugegoda', 'Kaduwela',
  'Kelaniya', 'Maharagama', 'Ratmalana', 'Kolonnawa', 'Kottawa',
  'Negombo', 'Wattala', 'Ja-Ela', 'Minuwangoda', 'Gampaha',
  'Kandy Central', 'Peradeniya', 'Galle Fort', 'Matara Central',
  'Jaffna Central',
];

const stations = stationNames.map((name, i) => {
  const districtId = String(rndInt(1, districts.length));
  return {
    id: String(i + 1),
    name: `${name} Police Station`,
    districtId,
    contact: `+9411${String(rndInt(1000000, 9999999))}`,
  };
});
writeCSV('police_stations.csv', stations);

// ── TUK-TUKS ─────────────────────────────────────────────────────────────────
const sinhalaFirstNames = ['Kamal','Sunil','Nimal','Ruwan','Chaminda','Priyantha',
  'Asanka','Janaka','Thilak','Lasantha','Sampath','Nuwan','Kasun','Dinesh','Mahesh',
  'Chathura','Tharanga','Isuru','Sachith','Lahiru','Bandara','Saman','Ranjith',
  'Prasad','Ajith','Gayan','Thusitha','Charith','Weerasekara','Dilrukshi'];
const sinhalaLastNames  = ['Perera','Silva','Fernando','Dissanayake','Wickramasinghe',
  'Jayasinghe','Bandara','Rajapaksa','Kumara','Gunawardena','Senanayake','Liyanage',
  'Seneviratne','Pathirana','Ranasinghe','Abeysekara','Wijesekara','Samarawickrama',
  'Jayawardena','Herath'];

const provincePrefixes = { '1':'WP','2':'CP','3':'SP','4':'NP','5':'EP','6':'NW','7':'NC','8':'UP','9':'SB' };
const statuses = ['active','active','active','active','inactive','suspended'];

const tukTuks = [];
for (let i = 1; i <= 200; i++) {
  const district  = pick(districts);
  const province  = provinces.find(p => p.id === district.provinceId);
  const prefix    = provincePrefixes[province.id] || 'WP';
  const regNum    = `${prefix} ${String.fromCharCode(65 + rndInt(0,25))}${String.fromCharCode(65 + rndInt(0,25))}-${String(rndInt(1000,9999))}`;
  const owner     = `${pick(sinhalaFirstNames)} ${pick(sinhalaLastNames)}`;
  const driver    = `${pick(sinhalaFirstNames)} ${pick(sinhalaLastNames)}`;
  const nic       = `${String(rndInt(196501, 200001))}${String(rndInt(1000000, 9999999))}`;

  const registeredAt = new Date(Date.now() - rndInt(30, 730) * 86400000).toISOString();

  tukTuks.push({
    id: String(i),
    registrationNumber: regNum,
    ownerName: owner,
    driverName: driver,
    driverNIC: nic,
    contactNumber: `+9477${String(rndInt(1000000, 9999999))}`,
    districtId: district.id,
    provinceId: district.provinceId,
    deviceId: uuidv4(),
    status: pick(statuses),
    lastLat: '',
    lastLng: '',
    lastSpeed: '',
    lastHeading: '',
    lastTimestamp: '',
    registeredAt,
    updatedAt: registeredAt,
  });
}
writeCSV('tuk_tuks.csv', tukTuks);

// ── LOCATION PINGS (1 week of history, ~15 min intervals) ────────────────────
const NOW    = Date.now();
const ONE_WK = 7 * 24 * 60 * 60 * 1000;
const INTERVAL_MS = 15 * 60 * 1000; // 15 min

const pings = [];
let pingSeq = 1;

const activeTukTuks = tukTuks.filter(t => t.status === 'active');

for (const tt of activeTukTuks) {
  const district   = districts.find(d => d.id === tt.districtId);
  if (!district) continue;

  const baseLat = district.lat;
  const baseLng = district.lng;
  const spread  = district.spread;

  // Simulate daily patterns: inactive overnight (23:00–05:00)
  let currentLat = fmt(baseLat + rnd(-spread / 2, spread / 2));
  let currentLng = fmt(baseLng + rnd(-spread / 2, spread / 2));
  let currentHeading = rndInt(0, 359);

  const startTime = NOW - ONE_WK;

  for (let t = startTime; t <= NOW; t += INTERVAL_MS) {
    const hour = new Date(t).getHours();
    if (hour >= 23 || hour < 5) continue; // driver resting

    // Random movement drift
    currentLat = fmt(currentLat + rnd(-0.005, 0.005));
    currentLng = fmt(currentLng + rnd(-0.005, 0.005));

    // Clamp within district spread
    currentLat = fmt(Math.min(Math.max(currentLat, baseLat - spread), baseLat + spread));
    currentLng = fmt(Math.min(Math.max(currentLng, baseLng - spread), baseLng + spread));

    currentHeading = (currentHeading + rndInt(-30, 30) + 360) % 360;
    const speed = hour >= 7 && hour <= 20 ? rnd(5, 45) : rnd(0, 10);

    pings.push({
      id: String(pingSeq++),
      pingId: uuidv4(),
      tukTukId: tt.id,
      regNumber: tt.registrationNumber,
      latitude: currentLat,
      longitude: currentLng,
      speed: parseFloat(speed.toFixed(1)),
      heading: currentHeading,
      accuracy: parseFloat(rnd(2, 8).toFixed(1)),
      batteryLevel: rndInt(30, 100),
      timestamp: new Date(t).toISOString(),
    });
  }

  // Update tuk-tuk's last known location
  const last = pings.filter(p => p.tukTukId === tt.id).at(-1);
  if (last) {
    tt.lastLat       = last.latitude;
    tt.lastLng       = last.longitude;
    tt.lastSpeed     = last.speed;
    tt.lastHeading   = last.heading;
    tt.lastTimestamp = last.timestamp;
    tt.updatedAt     = last.timestamp;
  }
}

// Re-write tuk_tuks with updated last locations
writeCSV('tuk_tuks.csv', tukTuks);
writeCSV('location_pings.csv', pings);

// ── USERS ─────────────────────────────────────────────────────────────────────
const HASH = await bcrypt.hash('Admin@1234', 12);
const DEVICE_HASH = await bcrypt.hash('Device@5678', 12);

const users = [
  // HQ Admin
  {
    id: '1', userId: uuidv4(), username: 'hq_admin', passwordHash: HASH,
    role: 'hq_admin', provinceId: '', districtId: '', stationId: '',
    linkedTukTukId: '', isActive: true, lastLogin: '', createdAt: new Date().toISOString(),
  },
  // Province admins (one per province)
  ...provinces.map((p, i) => ({
    id: String(i + 2), userId: uuidv4(),
    username: `prov_${p.code.toLowerCase()}`,
    passwordHash: HASH, role: 'province_admin',
    provinceId: p.id, districtId: '', stationId: '', linkedTukTukId: '',
    isActive: true, lastLogin: '', createdAt: new Date().toISOString(),
  })),
  // District admin samples
  ...districts.slice(0, 5).map((d, i) => ({
    id: String(provinces.length + i + 2), userId: uuidv4(),
    username: `dist_admin_${d.name.toLowerCase().replace(/\s/g, '_')}`,
    passwordHash: HASH, role: 'district_admin',
    provinceId: d.provinceId, districtId: d.id, stationId: '', linkedTukTukId: '',
    isActive: true, lastLogin: '', createdAt: new Date().toISOString(),
  })),
  // Station officer samples
  ...stations.slice(0, 5).map((s, i) => ({
    id: String(provinces.length + 5 + i + 2), userId: uuidv4(),
    username: `officer_${s.id}`,
    passwordHash: HASH, role: 'station_officer',
    provinceId: '', districtId: s.districtId, stationId: s.id, linkedTukTukId: '',
    isActive: true, lastLogin: '', createdAt: new Date().toISOString(),
  })),
  // Device users (one per first 10 active tuk-tuks)
  ...activeTukTuks.slice(0, 10).map((tt, i) => ({
    id: String(provinces.length + 10 + i + 2), userId: uuidv4(),
    username: `device_${tt.registrationNumber.replace(/[\s-]/g, '_').toLowerCase()}`,
    passwordHash: DEVICE_HASH, role: 'device',
    provinceId: '', districtId: '', stationId: '', linkedTukTukId: tt.id,
    isActive: true, lastLogin: '', createdAt: new Date().toISOString(),
  })),
];

writeCSV('users.csv', users);

console.log('\n✅  All simulation data generated successfully!');
console.log(`   Provinces      : ${provinces.length}`);
console.log(`   Districts      : ${districts.length}`);
console.log(`   Stations       : ${stations.length}`);
console.log(`   Tuk-Tuks       : ${tukTuks.length} (${activeTukTuks.length} active)`);
console.log(`   Location Pings : ${pings.length}`);
console.log(`   Users          : ${users.length}`);
console.log('\n📋  Default credentials:');
console.log('   HQ Admin  → username: hq_admin        password: Admin@1234');
console.log('   Province  → username: prov_wp          password: Admin@1234');
console.log('   Device    → username: device_<regnum>  password: Device@5678\n');

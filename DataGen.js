import fs from 'fs';
import path from 'path';

// ─── Helper Functions ───────────────────────────────────────────
const randomBetween = (min, max) => 
  Math.random() * (max - min) + min;

const randomInt = (min, max) => 
  Math.floor(randomBetween(min, max));

const randomFrom = (arr) => 
  arr[randomInt(0, arr.length)];

const toCSV = (headers, rows) => {
  const header = headers.join(',');
  const body = rows.map(row => 
    headers.map(h => `"${row[h] ?? ''}"`).join(',')
  ).join('\n');
  return `${header}\n${body}`;
};

const saveCSV = (filename, headers, rows) => {
  const dir = './seed/data';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), toCSV(headers, rows));
  console.log(`✅ ${filename} saved — ${rows.length} records`);
};

// ─── 1. Provinces ───────────────────────────────────────────────
const provinces = [
  { id: 1, name: 'Western',       code: 'WP'  },
  { id: 2, name: 'Central',       code: 'CP'  },
  { id: 3, name: 'Southern',      code: 'SP'  },
  { id: 4, name: 'Northern',      code: 'NP'  },
  { id: 5, name: 'Eastern',       code: 'EP'  },
  { id: 6, name: 'North Western', code: 'NWP' },
  { id: 7, name: 'North Central', code: 'NCP' },
  { id: 8, name: 'Uva',           code: 'UP'  },
  { id: 9, name: 'Sabaragamuwa',  code: 'SGP' },
];

saveCSV('provinces.csv', ['id', 'name', 'code'], provinces);

// ─── 2. Districts ───────────────────────────────────────────────
const districts = [
  { id: 1,  name: 'Colombo',      provinceId: 1, lat: 6.9271, lng: 79.8612, spread: 0.15 },
  { id: 2,  name: 'Gampaha',      provinceId: 1, lat: 7.0873, lng: 80.0144, spread: 0.20 },
  { id: 3,  name: 'Kalutara',     provinceId: 1, lat: 6.5854, lng: 79.9607, spread: 0.20 },
  { id: 4,  name: 'Kandy',        provinceId: 2, lat: 7.2906, lng: 80.6337, spread: 0.20 },
  { id: 5,  name: 'Matale',       provinceId: 2, lat: 7.4675, lng: 80.6234, spread: 0.20 },
  { id: 6,  name: 'Nuwara Eliya', provinceId: 2, lat: 6.9497, lng: 80.7891, spread: 0.15 },
  { id: 7,  name: 'Galle',        provinceId: 3, lat: 6.0535, lng: 80.2210, spread: 0.20 },
  { id: 8,  name: 'Matara',       provinceId: 3, lat: 5.9549, lng: 80.5550, spread: 0.20 },
  { id: 9,  name: 'Hambantota',   provinceId: 3, lat: 6.1429, lng: 81.1212, spread: 0.25 },
  { id: 10, name: 'Jaffna',       provinceId: 4, lat: 9.6615, lng: 80.0255, spread: 0.20 },
  { id: 11, name: 'Kilinochchi',  provinceId: 4, lat: 9.3803, lng: 80.3770, spread: 0.20 },
  { id: 12, name: 'Mannar',       provinceId: 4, lat: 8.9810, lng: 79.9044, spread: 0.20 },
  { id: 13, name: 'Vavuniya',     provinceId: 4, lat: 8.7514, lng: 80.4971, spread: 0.20 },
  { id: 14, name: 'Mullaitivu',   provinceId: 4, lat: 9.2671, lng: 80.8142, spread: 0.20 },
  { id: 15, name: 'Ampara',       provinceId: 5, lat: 7.2914, lng: 81.6747, spread: 0.25 },
  { id: 16, name: 'Batticaloa',   provinceId: 5, lat: 7.7170, lng: 81.6924, spread: 0.20 },
  { id: 17, name: 'Trincomalee',  provinceId: 5, lat: 8.5874, lng: 81.2152, spread: 0.25 },
  { id: 18, name: 'Kurunegala',   provinceId: 6, lat: 7.4818, lng: 80.3609, spread: 0.25 },
  { id: 19, name: 'Puttalam',     provinceId: 6, lat: 8.0362, lng: 79.8283, spread: 0.25 },
  { id: 20, name: 'Anuradhapura', provinceId: 7, lat: 8.3114, lng: 80.4037, spread: 0.30 },
  { id: 21, name: 'Polonnaruwa',  provinceId: 7, lat: 7.9403, lng: 81.0188, spread: 0.25 },
  { id: 22, name: 'Badulla',      provinceId: 8, lat: 6.9934, lng: 81.0550, spread: 0.25 },
  { id: 23, name: 'Monaragala',   provinceId: 8, lat: 6.8728, lng: 81.3507, spread: 0.30 },
  { id: 24, name: 'Ratnapura',    provinceId: 9, lat: 6.6828, lng: 80.3992, spread: 0.25 },
  { id: 25, name: 'Kegalle',      provinceId: 9, lat: 7.2513, lng: 80.3464, spread: 0.20 },
];

saveCSV('districts.csv', 
  ['id', 'name', 'provinceId', 'lat', 'lng', 'spread'], 
  districts
);

// ─── 3. Police Stations ─────────────────────────────────────────
const stations = [
  { id: 1,  name: 'Colombo Fort Police Station',   districtId: 1,  contact: '0112-123456' },
  { id: 2,  name: 'Gampaha Police Station',         districtId: 2,  contact: '0332-234567' },
  { id: 3,  name: 'Kalutara Police Station',        districtId: 3,  contact: '0342-345678' },
  { id: 4,  name: 'Kandy Central Police Station',   districtId: 4,  contact: '0812-456789' },
  { id: 5,  name: 'Matale Police Station',          districtId: 5,  contact: '0662-567890' },
  { id: 6,  name: 'Nuwara Eliya Police Station',    districtId: 6,  contact: '0522-678901' },
  { id: 7,  name: 'Galle Police Station',           districtId: 7,  contact: '0912-789012' },
  { id: 8,  name: 'Matara Police Station',          districtId: 8,  contact: '0412-890123' },
  { id: 9,  name: 'Hambantota Police Station',      districtId: 9,  contact: '0472-901234' },
  { id: 10, name: 'Jaffna Police Station',          districtId: 10, contact: '0212-012345' },
  { id: 11, name: 'Kilinochchi Police Station',     districtId: 11, contact: '0212-123456' },
  { id: 12, name: 'Mannar Police Station',          districtId: 12, contact: '0232-234567' },
  { id: 13, name: 'Vavuniya Police Station',        districtId: 13, contact: '0242-345678' },
  { id: 14, name: 'Mullaitivu Police Station',      districtId: 14, contact: '0212-456789' },
  { id: 15, name: 'Ampara Police Station',          districtId: 15, contact: '0632-567890' },
  { id: 16, name: 'Batticaloa Police Station',      districtId: 16, contact: '0652-678901' },
  { id: 17, name: 'Trincomalee Police Station',     districtId: 17, contact: '0262-789012' },
  { id: 18, name: 'Kurunegala Police Station',      districtId: 18, contact: '0372-890123' },
  { id: 19, name: 'Puttalam Police Station',        districtId: 19, contact: '0322-901234' },
  { id: 20, name: 'Anuradhapura Police Station',    districtId: 20, contact: '0252-012345' },
  { id: 21, name: 'Polonnaruwa Police Station',     districtId: 21, contact: '0272-123456' },
  { id: 22, name: 'Badulla Police Station',         districtId: 22, contact: '0552-234567' },
  { id: 23, name: 'Monaragala Police Station',      districtId: 23, contact: '0552-345678' },
  { id: 24, name: 'Ratnapura Police Station',       districtId: 24, contact: '0452-456789' },
  { id: 25, name: 'Kegalle Police Station',         districtId: 25, contact: '0352-567890' },
];

saveCSV('stations.csv', 
  ['id', 'name', 'districtId', 'contact'], 
  stations
);

// ─── 4. Name Pool ───────────────────────────────────────────────
const firstNames = [
  'Kamal','Sunil','Nimal','Ruwan','Chamara',
  'Dinesh','Pradeep','Lasith','Asanka','Gayan',
  'Kumari','Sandya','Dilini','Nadeeka','Chamari',
  'Thisara','Buddhika','Nuwan','Isuru','Tharindu'
];

const lastNames = [
  'Perera','Fernando','Silva','Jayasinghe','Wickramasinghe',
  'Bandara','Rajapaksa','Dissanayake','Gunasekara','Herath',
  'Weerasinghe','Seneviratne','Liyanage','Ranasinghe','Pathirana'
];

const randomName = () => 
  `${randomFrom(firstNames)} ${randomFrom(lastNames)}`;

const randomNIC = () => {
  const year = randomInt(1970, 2000).toString();
  const days = randomInt(1, 366).toString().padStart(3, '0');
  const suffix = randomInt(1000, 9999).toString();
  return `${year}${days}${suffix}`;
};

const randomPhone = () => 
  `07${randomInt(0,9)}${randomInt(1000000,9999999)}`;

// ─── 5. Tuk-Tuks ────────────────────────────────────────────────
const tuktukCounts = [
  { provinceId: 1, code: 'WP',  count: 40 },
  { provinceId: 2, code: 'CP',  count: 25 },
  { provinceId: 3, code: 'SP',  count: 25 },
  { provinceId: 4, code: 'NP',  count: 20 },
  { provinceId: 5, code: 'EP',  count: 20 },
  { provinceId: 6, code: 'NWP', count: 20 },
  { provinceId: 7, code: 'NCP', count: 15 },
  { provinceId: 8, code: 'UP',  count: 15 },
  { provinceId: 9, code: 'SGP', count: 20 },
];

// get districts per province
const districtsByProvince = {};
districts.forEach(d => {
  if (!districtsByProvince[d.provinceId]) 
    districtsByProvince[d.provinceId] = [];
  districtsByProvince[d.provinceId].push(d.id);
});

const tuktuks = [];
let tuktukSeq = 1;

for (const { provinceId, code, count } of tuktukCounts) {
  for (let i = 0; i < count; i++) {
    const num = String(tuktukSeq).padStart(4, '0');
    const districtId = randomFrom(districtsByProvince[provinceId]);
    tuktuks.push({
      id:                 tuktukSeq,
      registrationNumber: `${code}-TUK-${num}`,
      ownerName:          randomName(),
      driverName:         randomName(),
      driverNIC:          randomNIC(),
      contactNumber:      randomPhone(),
      districtId:         districtId,
      provinceId:         provinceId,
      deviceId:           `DEV-${num}`,
      status:             randomFrom(['ACTIVE','ACTIVE','ACTIVE','INACTIVE','SUSPENDED']),
      registeredAt:       `2024-0${randomInt(1,9)}-${String(randomInt(1,28)).padStart(2,'0')}T08:00:00Z`,
    });
    tuktukSeq++;
  }
}

saveCSV('tuktuks.csv', [
  'id','registrationNumber','ownerName','driverName',
  'driverNIC','contactNumber','districtId','provinceId',
  'deviceId','status','registeredAt'
], tuktuks);

// ─── 6. Users ───────────────────────────────────────────────────
const users = [];
let userSeq = 1;

// 1 HQ Admin
users.push({
  id: userSeq++, username: 'hq_admin_01',
  passwordHash: 'hashed_Admin@1234',
  role: 'HQ_ADMIN', provinceId: '', districtId: '',
  stationId: '', linkedTukTukId: '', isActive: true
});

// 9 Provincial Admins
provinces.forEach(p => {
  users.push({
    id: userSeq++,
    username: `prov_admin_${p.code.toLowerCase()}`,
    passwordHash: 'hashed_Prov@1234',
    role: 'PROVINCIAL_ADMIN',
    provinceId: p.id, districtId: '',
    stationId: '', linkedTukTukId: '', isActive: true
  });
});

// 25 Station Officers
stations.forEach(s => {
  users.push({
    id: userSeq++,
    username: `officer_stn_${String(s.id).padStart(2,'0')}`,
    passwordHash: 'hashed_Officer@1234',
    role: 'STATION_OFFICER',
    provinceId: '', districtId: s.districtId,
    stationId: s.id, linkedTukTukId: '', isActive: true
  });
});

// 200 Device Users
tuktuks.forEach(t => {
  users.push({
    id: userSeq++,
    username: `device_${t.deviceId.toLowerCase()}`,
    passwordHash: 'hashed_Device@1234',
    role: 'DEVICE',
    provinceId: t.provinceId, districtId: t.districtId,
    stationId: '', linkedTukTukId: t.id, isActive: true
  });
});

saveCSV('users.csv', [
  'id','username','passwordHash','role',
  'provinceId','districtId','stationId','linkedTukTukId','isActive'
], users);

// ─── 7. Location Pings ──────────────────────────────────────────
const pings = [];
let pingSeq = 1;

// district lookup map
const districtMap = {};
districts.forEach(d => { districtMap[d.id] = d; });

// 7 days back from today, ping every 30 mins, 06:00–22:00
const now = new Date();

for (const tuktuk of tuktuks) {
  if (tuktuk.status !== 'ACTIVE') continue;

  const district = districtMap[tuktuk.districtId];
  let lat = district.lat + randomBetween(-district.spread, district.spread);
  let lng = district.lng + randomBetween(-district.spread, district.spread);

  for (let day = 7; day >= 0; day--) {
    for (let hour = 6; hour < 22; hour++) {
      for (let min = 0; min < 60; min += 30) {

        const ts = new Date(now);
        ts.setDate(ts.getDate() - day);
        ts.setHours(hour, min, 0, 0);

        // simulate small movement
        lat += randomBetween(-0.002, 0.002);
        lng += randomBetween(-0.002, 0.002);

        // keep within district bounds
        lat = Math.max(district.lat - district.spread, 
              Math.min(district.lat + district.spread, lat));
        lng = Math.max(district.lng - district.spread, 
              Math.min(district.lng + district.spread, lng));

        pings.push({
          id:           pingSeq++,
          pingId:       `PING-${String(pingSeq).padStart(6,'0')}`,
          tukTukId:     tuktuk.id,
          regNumber:    tuktuk.registrationNumber,
          latitude:     lat.toFixed(6),
          longitude:    lng.toFixed(6),
          speed:        randomInt(0, 60),
          heading:      randomInt(0, 360),
          accuracy:     (randomBetween(3, 10)).toFixed(1),
          batteryLevel: randomInt(20, 100),
          timestamp:    ts.toISOString(),
        });
      }
    }
  }
}

saveCSV('location_pings.csv', [
  'id','pingId','tukTukId','regNumber',
  'latitude','longitude','speed','heading',
  'accuracy','batteryLevel','timestamp'
], pings);

console.log(`\n🎉 All CSV files generated in ./seed/data/`);
console.log(`📍 Total location pings: ${pings.length}`);
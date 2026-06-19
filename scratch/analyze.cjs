const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'Astram event data_anonymized - Astram event data_anonymizedb40ac87.csv');
const text = fs.readFileSync(csvPath, 'utf8');

// Simple CSV parse
function parseCSV(text) {
  const result = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') { cell += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === ',' && !inQuotes) {
      row.push(cell.trim()); cell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(cell.trim()); result.push(row); row = []; cell = '';
    } else {
      cell += char;
    }
  }
  if (cell || row.length > 0) { row.push(cell.trim()); result.push(row); }
  return result;
}

const rows = parseCSV(text);
const headers = rows[0];
console.log('Total rows (including header):', rows.length);
console.log('Headers:', headers.join(', '));

const junctionIdx = headers.indexOf('junction');
const causeIdx = headers.indexOf('event_cause');
const latIdx = headers.indexOf('latitude');
const lngIdx = headers.indexOf('longitude');
const startIdx = headers.indexOf('start_datetime');
const zoneIdx = headers.indexOf('zone');
const policeIdx = headers.indexOf('police_station');

// Count junctions
const junctionCounts = {};
const junctionLatLng = {};
for (let i = 1; i < rows.length; i++) {
  const j = rows[i][junctionIdx];
  if (j && j !== 'NULL' && j !== '') {
    junctionCounts[j] = (junctionCounts[j] || 0) + 1;
    if (!junctionLatLng[j]) {
      junctionLatLng[j] = { lat: parseFloat(rows[i][latIdx]), lng: parseFloat(rows[i][lngIdx]) };
    }
  }
}

const topJunctions = Object.entries(junctionCounts).sort((a,b) => b[1] - a[1]).slice(0, 25);
console.log('\n=== TOP 25 JUNCTIONS ===');
topJunctions.forEach(([name, count]) => {
  const ll = junctionLatLng[name];
  console.log(`${count} | ${name} | lat:${ll.lat} lng:${ll.lng}`);
});

// Count event causes
const causeCounts = {};
for (let i = 1; i < rows.length; i++) {
  const c = rows[i][causeIdx];
  if (c && c !== 'NULL' && c !== '') {
    causeCounts[c] = (causeCounts[c] || 0) + 1;
  }
}
console.log('\n=== EVENT CAUSES ===');
Object.entries(causeCounts).sort((a,b) => b[1] - a[1]).forEach(([name, count]) => {
  console.log(`${count} | ${name}`);
});

// Count by hour
const hourCounts = {};
for (let i = 1; i < rows.length; i++) {
  const dt = rows[i][startIdx];
  if (dt && dt !== 'NULL') {
    const d = new Date(dt);
    if (!isNaN(d.getTime())) {
      const h = d.getUTCHours(); // UTC hours
      // Convert to IST (UTC+5:30)
      const istH = (h + 5) % 24 + (30/60 > 0 ? 0 : 0); // simplified
      const adjustedH = (h + 5 + Math.floor((30)/60)) % 24;
      hourCounts[adjustedH] = (hourCounts[adjustedH] || 0) + 1;
    }
  }
}
console.log('\n=== INCIDENTS BY HOUR (IST) ===');
for (let h = 0; h < 24; h++) {
  console.log(`${String(h).padStart(2,'0')}:00 | ${hourCounts[h] || 0}`);
}

// Count zones
const zoneCounts = {};
for (let i = 1; i < rows.length; i++) {
  const z = rows[i][zoneIdx];
  if (z && z !== 'NULL' && z !== '') {
    zoneCounts[z] = (zoneCounts[z] || 0) + 1;
  }
}
console.log('\n=== ZONES ===');
Object.entries(zoneCounts).sort((a,b) => b[1] - a[1]).forEach(([name, count]) => {
  console.log(`${count} | ${name}`);
});

// Count police stations
const stationCounts = {};
for (let i = 1; i < rows.length; i++) {
  const p = rows[i][policeIdx];
  if (p && p !== 'NULL' && p !== '') {
    stationCounts[p] = (stationCounts[p] || 0) + 1;
  }
}
console.log('\n=== POLICE STATIONS (unique count):', Object.keys(stationCounts).length);

// Count corridors
const corridorIdx = headers.indexOf('corridor');
const corridorCounts = {};
for (let i = 1; i < rows.length; i++) {
  const c = rows[i][corridorIdx];
  if (c && c !== 'NULL' && c !== '' && c !== 'Non-corridor') {
    corridorCounts[c] = (corridorCounts[c] || 0) + 1;
  }
}
console.log('\n=== TOP CORRIDORS ===');
Object.entries(corridorCounts).sort((a,b) => b[1] - a[1]).slice(0, 15).forEach(([name, count]) => {
  console.log(`${count} | ${name}`);
});

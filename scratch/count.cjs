const fs = require('fs');
const path = require('path');

const csvPath = 'Astram event data_anonymized - Astram event data_anonymizedb40ac87.csv';
const fileContent = fs.readFileSync(csvPath, 'utf8');

function parseCSV(text) {
  const result = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
      row.push(cell.trim());
      result.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  
  if (cell || row.length > 0) {
    row.push(cell.trim());
    result.push(row);
  }
  
  return result;
}

const rows = parseCSV(fileContent);
const headers = rows[0];
const statusIdx = headers.indexOf('status');
const startIdx = headers.indexOf('start_datetime');

console.log('Status Header Index:', statusIdx);

let active = 0;
let completed = 0;
let scheduled = 0;
let skipped = 0;

const latIdx = headers.indexOf('latitude');
const lngIdx = headers.indexOf('longitude');

for (let i = 1; i < rows.length; i++) {
  const cols = rows[i];
  if (cols.length < headers.length) continue;
  
  const status = cols[statusIdx];
  const start_datetime = cols[startIdx];
  const latStr = cols[latIdx];
  const lngStr = cols[lngIdx];
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  
  if (isNaN(lat) || isNaN(lng) || lat < 12.0 || lat > 14.0 || lng < 77.0 || lng > 78.0) {
    skipped++;
    continue;
  }
  
  let mappedStatus = 'active';
  if (status === 'closed' || status === 'resolved') {
    mappedStatus = 'completed';
  } else if (status === 'active') {
    mappedStatus = 'active';
  } else {
    const startMs = Date.parse(start_datetime);
    if (!isNaN(startMs) && startMs > Date.now()) {
      mappedStatus = 'scheduled';
    }
  }
  
  if (mappedStatus === 'active') active++;
  else if (mappedStatus === 'completed') completed++;
  else if (mappedStatus === 'scheduled') scheduled++;
}

console.log({ active, completed, scheduled, skipped, total: rows.length });

import fs from 'fs';

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

const csvPath = 'Astram event data_anonymized - Astram event data_anonymizedb40ac87.csv';
const fileContent = fs.readFileSync(csvPath, 'utf8');
const rows = parseCSV(fileContent);
console.log('Total parsed rows:', rows.length);

const headers = rows[0];
console.log('Headers Count:', headers.length);
console.log('Headers:', headers);

let minLat = 90, maxLat = -90;
let minLng = 180, maxLng = -180;
const eventTypes = new Set();
const eventCauses = new Set();
const priorities = new Set();
const statusValues = new Set();

let validCoordsCount = 0;
let invalidCoordsCount = 0;

for (let i = 1; i < rows.length; i++) {
  const cols = rows[i];
  if (cols.length < headers.length) {
    // Some lines might be blank or incomplete
    if (cols.length === 1 && cols[0] === '') continue;
    // console.log(`Row ${i} is short: ${cols.length}`);
  }
  
  const event_type = cols[headers.indexOf('event_type')];
  const latStr = cols[headers.indexOf('latitude')];
  const lngStr = cols[headers.indexOf('longitude')];
  const event_cause = cols[headers.indexOf('event_cause')];
  const priority = cols[headers.indexOf('priority')];
  const status = cols[headers.indexOf('status')];

  if (event_type) eventTypes.add(event_type);
  if (event_cause) eventCauses.add(event_cause);
  if (priority) priorities.add(priority);
  if (status) statusValues.add(status);

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (!isNaN(lat) && !isNaN(lng) && lat > 12.0 && lat < 14.0 && lng > 77.0 && lng < 78.0) {
    validCoordsCount++;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  } else {
    invalidCoordsCount++;
  }
}

console.log('Valid coordinates inside Bangalore range:', validCoordsCount);
console.log('Invalid or out-of-range coordinates:', invalidCoordsCount);
console.log('Lat range:', minLat, 'to', maxLat);
console.log('Lng range:', minLng, 'to', maxLng);
console.log('Event types:', Array.from(eventTypes));
console.log('Event causes:', Array.from(eventCauses));
console.log('Priorities:', Array.from(priorities));
console.log('Status values:', Array.from(statusValues));

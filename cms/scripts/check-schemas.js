const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'src', 'api');

function normalizeName(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

const files = [];

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) walk(full);
    if (it.isFile() && it.name === 'schema.json') files.push(full);
  }
}

walk(apiDir);

const map = new Map();
for (const f of files) {
  try {
    const j = JSON.parse(fs.readFileSync(f, 'utf8'));
    const plural = j.info && j.info.pluralName ? j.info.pluralName : '<missing>';
    const coll = j.collectionName || '<missing>';
    const key = normalizeName(plural);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push({ file: f, plural, collectionName: coll });
  } catch (e) {
    console.error('Parse error', f, e.message);
  }
}

let dupFound = false;
for (const [k, arr] of map.entries()) {
  if (arr.length > 1) {
    dupFound = true;
    console.error('Duplicate pluralName (normalized):', k);
    for (const a of arr) console.error('  ', a.plural, '-', a.collectionName, '-', a.file);
  }
}
if (!dupFound) console.log('No duplicate pluralName found (normalized).');

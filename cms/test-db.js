const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const idx = line.indexOf('=');
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

const client = new Client({
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: Number(process.env.DATABASE_PORT || 5432),
  database: process.env.DATABASE_NAME || 'tehrani_cms',
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
});

console.log(
  `Testing PostgreSQL connection -> host=${client.host} port=${client.port} db=${client.database} user=${client.user}`
);

client.connect()
  .then(() => {
    console.log('✅ Connected successfully!');
    return client.end();
  })
  .catch(err => {
    console.error('❌ Connection failed:', err.message);
  });


  // cms admin : TehraniCms2026 -- mmdrzphzkr@gmail.com
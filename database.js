const { Pool } = require('pg');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';
const password = process.env.DB_PASSWORD;

if (!isTest && (!password || String(password).trim() === '')) {
  console.error('Database configuration error: DB_PASSWORD is missing or empty.');
  console.error('Fix: set DB_PASSWORD in your .env file, then restart the server.');
  process.exit(1);
}

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'groupmarketdb',
  user: process.env.DB_USER || 'postgres',
  password: isTest ? password || 'postgres' : password,
});

async function checkDbConnection() {
  const status = await getDbConnectionStatus();
  return status.ok;
}

async function getDbConnectionStatus() {
  try {
    await pool.query('SELECT 1');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      code: error && error.code ? error.code : 'UNKNOWN',
      message: error && error.message ? error.message : 'Database connection failed',
    };
  }
}

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (...args) => pool.query(...args),
  checkDbConnection,
  getDbConnectionStatus,
};


import pg from 'pg';
import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const { Pool } = pg;

// Determine database mode
const USE_POSTGRES = process.env.DB_HOST && process.env.DB_PASSWORD;
const DB_MODE = USE_POSTGRES ? 'PostgreSQL' : 'SQLite (In-Memory)';

console.log(`🗄️  Database Mode: ${DB_MODE}`);

// SQLite in-memory database setup
let sqliteDb = null;
let postgresPool = null;

if (USE_POSTGRES) {
  // PostgreSQL connection pool
  postgresPool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'logisync',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  postgresPool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL database');
  });

  postgresPool.on('error', (err) => {
    console.error('❌ PostgreSQL error:', err);
    console.log('⚠️  Falling back to SQLite...');
    initSQLite();
  });
} else {
  // Use SQLite by default
  initSQLite();
}

function initSQLite() {
  if (sqliteDb) return; // Already initialized

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const dbPath = join(__dirname, '..', '..', 'logisync.db');

  sqliteDb = new Database(dbPath);
  sqliteDb.pragma('journal_mode = WAL');

  console.log('✅ SQLite database initialized at:', dbPath);

  // Create tables for SQLite
  createSQLiteTables();
}

function createSQLiteTables() {
  if (!sqliteDb) return;

  // Users table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Products table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      description TEXT,
      category TEXT,
      price REAL DEFAULT 0,
      stock_quantity INTEGER DEFAULT 0,
      reorder_level INTEGER DEFAULT 10,
      supplier TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Warehouses table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS warehouses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      capacity INTEGER DEFAULT 0,
      current_stock INTEGER DEFAULT 0,
      manager TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Orders table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      status TEXT DEFAULT 'pending',
      total_amount REAL DEFAULT 0,
      shipping_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Customers table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      address TEXT,
      company TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ SQLite tables created');
}

// Universal query function that works with both PostgreSQL and SQLite
export const query = async (text, params = []) => {
  const start = Date.now();

  try {
    if (USE_POSTGRES && postgresPool) {
      // Use PostgreSQL
      const res = await postgresPool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query (PostgreSQL)', { duration, rows: res.rowCount });
      return res;
    } else {
      // Use SQLite - convert PostgreSQL query to SQLite
      if (!sqliteDb) initSQLite();

      const sqliteQuery = convertPostgresToSQLite(text, params);
      
      if (text.trim().toUpperCase().startsWith('SELECT')) {
        const rows = sqliteDb.prepare(sqliteQuery.text).all(...sqliteQuery.params);
        const duration = Date.now() - start;
        console.log('Executed query (SQLite)', { duration, rows: rows.length });
        return { rows, rowCount: rows.length };
      } else {
        const info = sqliteDb.prepare(sqliteQuery.text).run(...sqliteQuery.params);
        const duration = Date.now() - start;
        console.log('Executed query (SQLite)', { duration, changes: info.changes });
        return { 
          rows: [{ id: info.lastInsertRowid }], 
          rowCount: info.changes 
        };
      }
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Convert PostgreSQL syntax to SQLite syntax
function convertPostgresToSQLite(text, params) {
  let sqliteText = text;
  let sqliteParams = [...params];

  // Convert $1, $2, etc. to ? placeholders
  let paramIndex = 1;
  sqliteText = sqliteText.replace(/\$\d+/g, () => '?');

  // Convert RETURNING * to just return the query
  sqliteText = sqliteText.replace(/RETURNING \*/gi, '');

  // Convert NOW() to CURRENT_TIMESTAMP
  sqliteText = sqliteText.replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP');

  // Convert SERIAL to INTEGER PRIMARY KEY AUTOINCREMENT
  sqliteText = sqliteText.replace(/SERIAL/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT');

  // Convert BOOLEAN to INTEGER
  sqliteText = sqliteText.replace(/BOOLEAN/gi, 'INTEGER');

  return { text: sqliteText, params: sqliteParams };
}

// Helper function to get a client from the pool (for transactions)
export const getClient = async () => {
  if (USE_POSTGRES && postgresPool) {
    const client = await postgresPool.connect();
    const query = client.query.bind(client);
    const release = client.release.bind(client);

    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!');
    }, 5000);

    client.query = (...args) => {
      client.lastQuery = args;
      return query(...args);
    };

    client.release = () => {
      clearTimeout(timeout);
      client.query = query;
      client.release = release;
      return release();
    };

    return client;
  } else {
    // For SQLite, return a mock client
    return {
      query: async (text, params) => query(text, params),
      release: () => {},
    };
  }
};

// Get database info
export const getDatabaseInfo = () => {
  return {
    mode: DB_MODE,
    isPostgreSQL: USE_POSTGRES,
    isSQLite: !USE_POSTGRES,
  };
};

export default USE_POSTGRES ? postgresPool : sqliteDb;

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Determine database mode
const USE_POSTGRES = process.env.DB_HOST && process.env.DB_PASSWORD;
const DB_MODE = USE_POSTGRES ? 'PostgreSQL' : 'In-Memory (Mock Data)';

console.log(`🗄️  Database Mode: ${DB_MODE}`);

// In-memory data store (for when PostgreSQL is not available)
const inMemoryStore = {
  users: [],
  products: [],
  orders: [],
  customers: [],
  warehouses: []
};

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
  });
} else {
  console.log('✅ Using in-memory data store (no database configured)');
}

// Universal query function
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
      // Use in-memory store - return mock data
      const duration = Date.now() - start;
      console.log('Executed query (In-Memory)', { duration });

      // Return empty results for now - services will handle mock data
      return {
        rows: [],
        rowCount: 0
      };
    }
  } catch (error) {
    console.error('Database query error:', error);
    // Don't throw - return empty results
    return {
      rows: [],
      rowCount: 0
    };
  }
};

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
    // For in-memory, return a mock client
    return {
      query: async (text, params) => query(text, params),
      release: () => { },
    };
  }
};

// Get database info
export const getDatabaseInfo = () => {
  return {
    mode: DB_MODE,
    isPostgreSQL: USE_POSTGRES,
    isInMemory: !USE_POSTGRES,
  };
};

export default USE_POSTGRES ? postgresPool : null;

const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool for PostgreSQL
// Render provides DATABASE_URL, so we prioritize that
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Required for Render PostgreSQL
  } : false,
  // Fallback to individual config if DATABASE_URL is not set
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST || 'localhost',
  port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT || 5432,
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER || 'postgres',
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD || '',
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME || 'studybuddy',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL Database connected successfully');
    const result = await client.query('SELECT NOW()');
    console.log('📅 Database time:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('❌ PostgreSQL Database connection failed:', error.message);
    process.exit(1);
  }
};

// Helper function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

module.exports = { pool, query, testConnection };

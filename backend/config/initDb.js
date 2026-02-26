const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL if available (Render/production), otherwise use individual params
let pool;

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  pool = new Pool({
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    database: url.pathname.slice(1),
    user: url.username,
    password: decodeURIComponent(url.password),
    ssl: { rejectUnauthorized: false }
  });
} else {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'studybuddy',
    ssl: false
  });
}

const initDatabase = async () => {
  try {
    console.log('🚀 Starting database initialization...');
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected\n');

    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Create Subjects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ Subjects table created');

    // Create StudySessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS study_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        subject_id INTEGER NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
      );
    `);
    console.log('✅ StudySessions table created');

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_subjects_user_id ON subjects(user_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON study_sessions(user_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_subject_id ON study_sessions(subject_id);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_status ON study_sessions(status);
    `);
    console.log('✅ Indexes created');

    console.log('\n🎉 Database initialization completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
};

initDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed:', error.message);
    process.exit(1);
  });

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Error logging for pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Helper function to query database
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('Query executed:', { text, duration: `${duration}ms` });
    }
    return result;
  } catch (error) {
    console.error('Database query error:', { text, error: error.message });
    throw error;
  }
};

// Health check
const getConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    return res.rows[0];
  } catch (err) {
    console.error('Database connection error:', err.message);
    throw err;
  }
};

module.exports = {
  pool,
  query,
  getConnection
};

const pg = require('pg');
const logger = require('../utils/logger');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

const connectDatabase = async () => {
  try {
    const client = await pool.connect();
    logger.info('Database connected successfully');
    client.release();
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query,
  connectDatabase
};

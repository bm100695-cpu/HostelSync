require('dotenv').config();

const pool = require('./config/postgres');

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');

    console.log('Supabase connected successfully!');
    console.log('Database time:', result.rows[0].current_time);
  } catch (error) {
    console.error('Supabase connection failed:');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
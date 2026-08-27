const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URI,
    ssl: {
        rejectUnauthorized: false // This is crucial for Neon
    },
    max: 20, 
    idleTimeoutMillis: 30000,
});

pool.on('connect', () => {
    console.log('✅ PostgreSQL Pool Connected Successfully.');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle PostgreSQL client:', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
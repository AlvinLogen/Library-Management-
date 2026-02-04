const sql = require('mssql');

require('dotenv').config();

/**
 * Database configuration
 * Connection pool for SQL Server
*/

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000
    },
    pool: {
        max: 10,
        min:0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

async function getConnection() {
    try {
        if(!pool){
            pool = await sql.connect(config);
            console.log('Database connection established');
        }

        return pool;

    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
}

async function closeConnection() {
    try {
        if(pool){
            await pool.close();
            pool = null;
            console.log('Database connection closed.')
        }
    } catch (error) {
        console.error('Error closing database connection:', error.message);
        throw error;
    }
}

module.exports = {
    sql,
    getConnection,
    closeConnection
}
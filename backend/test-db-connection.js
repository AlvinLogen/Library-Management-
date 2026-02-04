const { getConnection, closeConnection } = require('./src/infrastructure/database/config');

async function testConnection() {
    try {
        console.log('Testing Database connection...');
        
        const pool = await getConnection();
        const result = await pool.request().query('SELECT DB_NAME() as DatabaseName, @@VERSION as Version');

        console.log('Database Info');
        console.log(` Database: ${result.recordset[0].DatabaseName}`);
        console.log(` Version: ${result.recordset[0].Version.split('\n')[0]}\n`);

        const tables = await pool.request().query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE' 
            AND TABLE_CATALOG = 'BookLibrary'
            ORDER BY TABLE_NAME
        `);

        console.log('Tables Found:');
        tables.recordset.forEach(t => console.log(`  - ${t.TABLE_NAME}`));

        await closeConnection();
        console.log('\n Connection test successful');

    } catch (error) {
        console.error('Connection test failed:', error.message);
        throw error;
    }
}

testConnection();
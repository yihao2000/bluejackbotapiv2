const mysql = require('mysql2/promise');
const config = require('../config');

// Create a connection pool
const pool = mysql.createPool(config.db);

// Wrap the query function to use the connection pool
async function query(sql, params) {
  const connection = await pool.getConnection();

  try {
    const [results, ] = await connection.execute(sql, params);
    console.log(results);
    return results;
  } finally {
    connection.release(); // Release the connection back to the pool
  }
}

module.exports = {
  query
};

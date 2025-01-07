const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();
// Create a MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
(async () => {
  try {
    // Execute a simple query to test the connection
    await db.query("SELECT 1");
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();

// Export the connection pool
module.exports = db;

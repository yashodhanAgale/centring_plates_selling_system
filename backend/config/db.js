// const mysql = require("mysql2/promise");
// const dotenv = require("dotenv");

// dotenv.config(); // Ensure environment variables are loaded

// (async () => {
//   try {
//     const connection = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//     });
//     console.log("DB_HOST:", process.env.DB_HOST);
//     console.log("DB_USER:", process.env.DB_USER);
//     console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
//     console.log("DB_NAME:", process.env.DB_NAME);

//     console.log("Connected to the database!");
//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//   }
// })();

const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config(); // Ensure environment variables are loaded

// Create a connection pool for better performance with multiple queries
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Ensures that queries wait for an available connection if all are busy
  connectionLimit: 10, // Adjust connection limit as needed
  queueLimit: 0, // No limit on waiting queries
});

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

console.log("Connected to the database!");

module.exports = pool; // Export the pool to use in other parts of the app

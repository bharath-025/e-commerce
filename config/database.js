const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./ecommerce.db", (err) => {
  if (err) console.error("Database connection error:", err.message);
  else console.log("Connected to SQLite database.");
});

db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            email TEXT
        )
    `);
  db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            campaign_name TEXT,
            ad_group_id TEXT,
            fsn_id TEXT,
            product_name TEXT,
            ad_spend REAL,
            views INTEGER,
            clicks INTEGER,
            direct_revenue REAL,
            indirect_revenue REAL,
            direct_units INTEGER,
            indirect_units INTEGER
        )
    `);
});

module.exports = db;

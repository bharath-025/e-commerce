const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("ecommerce.db");

const getUserByUsername = (username, callback) => {
  db.get(
    "SELECT id, username, password FROM users WHERE username = ?",
    [username],
    callback
  );
};

module.exports = { getUserByUsername };

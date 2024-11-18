const sqlite3 = require('sqlite3').verbose();

// Open the SQLite database
const db = new sqlite3.Database('ecommerce.db');

// Function to delete all data from all tables
const clearDatabase = () => {
  const tables = ['users', 'products'];  // List all tables that you want to clear data from

  tables.forEach((table) => {
    db.run(`DELETE FROM ${table}`, function(err) {
      if (err) {
        console.error(`Error clearing data from ${table}:`, err);
      } else {
        console.log(`All data removed from ${table}`);
      }
    });
  });
};

// Call the function to clear data
clearDatabase();

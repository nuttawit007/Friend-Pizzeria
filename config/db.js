const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create or open the SQLite database file
const db = new sqlite3.Database(path.join(__dirname, '..', 'database.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Database connected');
  }
});

// Create the 'user' table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    photoUrl TEXT
  )
`);

module.exports = db;
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a new user
const createUser = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).send('Missing required fields');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], function (err) {
    if (err) {
      console.error('Error creating user:', err);
      return res.status(500).send('Error creating user');
    }
    res.status(201).send({ id: this.lastID, username, email });
  });
};

// Login user and generate JWT token
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  db.get('SELECT id, username, password FROM users WHERE username = ?', [username], async (err, row) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (!row) {
      return res.status(401).send('Invalid username or password');
    }

    const match = await bcrypt.compare(password, row.password);
    if (!match) {
      return res.status(401).send('Invalid username or password');
    }

    const token = jwt.sign({ id: row.id, username: row.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ token });
  });
};

// Get user by ID
const getUserById = (req, res) => {
  const userId = req.params.id;

  db.get('SELECT id, username, email FROM users WHERE id = ?', [userId], (err, row) => {
    if (err) {
      console.error('Error retrieving user:', err);
      return res.status(500).send('Error retrieving user');
    }
    if (!row) {
      return res.status(404).send('User not found');
    }
    res.status(200).send(row);
  });
};

// Update user details
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, password, email } = req.body;

  if (!username && !password && !email) {
    return res.status(400).send('No fields to update');
  }

  let updates = [];
  let values = [];

  if (username) {
    updates.push('username = ?');
    values.push(username);
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updates.push('password = ?');
    values.push(hashedPassword);
  }

  if (email) {
    updates.push('email = ?');
    values.push(email);
  }

  values.push(userId);

  const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, values, function (err) {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).send('Error updating user');
    }
    if (this.changes === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User updated successfully');
  });
};

// Delete a user
const deleteUser = (req, res) => {
  const userId = req.params.id;

  db.run('DELETE FROM users WHERE id = ?', [userId], function (err) {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).send('Error deleting user');
    }
    if (this.changes === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('User deleted successfully');
  });
};

module.exports = { createUser, loginUser, getUserById, updateUser, deleteUser };

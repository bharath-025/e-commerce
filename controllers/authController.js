const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to send standardized error responses
const handleError = (res, message, status = 400, error = null) => {
  if (error) console.error(message, error);
  res.status(status).json({ success: false, message });
};

// Create a new user
const createUser = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return handleError(res, "Username, password, and email are required", 400);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
      [username, hashedPassword, email],
      function (err) {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") {
            return handleError(res, "Username or email already exists", 409, err);
          }
          return handleError(res, "Error creating user", 500, err);
        }
        res.status(201).json({
          success: true,
          message: "User created successfully",
          user: { id: this.lastID, username, email },
        });
      }
    );
  } catch (error) {
    handleError(res, "Error processing your request", 500, error);
  }
};

// Login user and generate JWT token
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return handleError(res, "Username and password are required", 400);
  }

  db.get(
    "SELECT id, username, password FROM users WHERE username = ?",
    [username],
    async (err, row) => {
      if (err) return handleError(res, "Internal server error", 500, err);
      if (!row) return handleError(res, "Invalid username or password", 401);

      try {
        const match = await bcrypt.compare(password, row.password);
        if (!match) return handleError(res, "Invalid username or password", 401);

        const token = jwt.sign(
          { id: row.id, username: row.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          success: true,
          message: "Login successful",
          token,
        });
      } catch (error) {
        handleError(res, "Error during login", 500, error);
      }
    }
  );
};

// Get user by ID
const getUserById = (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return handleError(res, "User ID is required", 400);
  }

  db.get(
    "SELECT id, username, email FROM users WHERE id = ?",
    [userId],
    (err, row) => {
      if (err) return handleError(res, "Error retrieving user", 500, err);
      if (!row) return handleError(res, "User not found", 404);
      res.status(200).json({ success: true, user: row });
    }
  );
};

// Update user details
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, password, email } = req.body;

  if (!userId) {
    return handleError(res, "User ID is required", 400);
  }
  if (!username && !password && !email) {
    return handleError(res, "No fields to update", 400);
  }

  let updates = [];
  let values = [];

  if (username) {
    updates.push("username = ?");
    values.push(username);
  }

  if (password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push("password = ?");
      values.push(hashedPassword);
    } catch (error) {
      return handleError(res, "Error hashing password", 500, error);
    }
  }

  if (email) {
    updates.push("email = ?");
    values.push(email);
  }

  values.push(userId);
  const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;

  db.run(sql, values, function (err) {
    if (err) {
      if (err.code === "SQLITE_CONSTRAINT") {
        return handleError(res, "Username or email already exists", 409, err);
      }
      return handleError(res, "Error updating user", 500, err);
    }
    if (this.changes === 0) return handleError(res, "User not found", 404);

    res.status(200).json({ success: true, message: "User updated successfully" });
  });
};

// Delete a user
const deleteUser = (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return handleError(res, "User ID is required", 400);
  }

  db.run("DELETE FROM users WHERE id = ?", [userId], function (err) {
    if (err) return handleError(res, "Error deleting user", 500, err);
    if (this.changes === 0) return handleError(res, "User not found", 404);

    res.status(200).json({ success: true, message: "User deleted successfully" });
  });
};

module.exports = { createUser, loginUser, getUserById, updateUser, deleteUser };

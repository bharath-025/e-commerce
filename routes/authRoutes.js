const express = require("express");
const {
  createUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/users", createUser);
router.post("/login", loginUser);
router.get("/users/:id", authenticateToken, getUserById);
router.put("/users/:id", authenticateToken, updateUser);
router.delete("/users/:id", authenticateToken, deleteUser);

module.exports = router;

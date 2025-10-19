const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// GET /api/users
router.get("/users", getUsers);
// ✅ chỉ cần "/users" vì đã prefix /api ở server.js
router.post("/users", addUser);

router.get("/users", getUsers);
router.post("/users", addUser);

// POST /api/users
router.post("/users", addUser);

// PUT /api/users/:id
router.put("/users/:id", updateUser);

// DELETE /api/users/:id
router.delete("/users/:id", deleteUser);

module.exports = router;

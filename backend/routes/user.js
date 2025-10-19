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

// POST /api/users
router.post("/users", addUser);

// PUT /api/users/:id
router.put("/users/:id", updateUser);

// DELETE /api/users/:id
router.delete("/users/:id", deleteUser);

module.exports = router;

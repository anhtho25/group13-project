const express = require("express");
const router = express.Router();
const { getUsers, addUser } = require("../controllers/userController");

// ✅ chỉ cần "/users" vì đã prefix /api ở server.js
router.get("/users", getUsers);
router.post("/users", addUser);

module.exports = router;

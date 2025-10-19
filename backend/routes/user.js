const express = require("express");
const router = express.Router();
const { getUsers, addUser } = require("../controllers/userController");

// ✅ Các route người dùng
// GET  /api/users  → lấy danh sách người dùng
router.get("/users", getUsers);

// POST /api/users  → thêm người dùng mới
router.post("/users", addUser);

// ✅ Xuất router để server.js sử dụng
module.exports = router;

const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');

// ✅ Đăng ký
router.post('/signup', signup);

// ✅ Đăng nhập
router.post('/login', login);

// ✅ Đăng xuất
router.post('/logout', logout);

module.exports = router;

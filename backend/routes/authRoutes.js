// routes/authRoutes.js
console.log('✅ authRoutes.js loaded');

const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  uploadAvatar
} = require('../controllers/authController');

// 📝 Đăng ký
router.post('/signup', signup);

// 🔐 Đăng nhập
router.post('/login', login);

// 🚪 Đăng xuất
router.post('/logout', logout);

// 🔑 Quên mật khẩu
router.post('/forgot-password', forgotPassword);

// ♻️ Đặt lại mật khẩu
router.post('/reset-password/:token', resetPassword);

// 🖼️ Upload avatar
router.post('/upload-avatar', uploadAvatar);

module.exports = router;

router.get('/test', (req, res) => {
  res.send('✅ auth route working!');
});

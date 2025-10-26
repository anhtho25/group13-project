const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController'); // ✅ đổi từ userController -> profileController
const verifyToken = require('../middleware/verifyToken');

// Xem thông tin cá nhân
router.get('/', verifyToken, getProfile);

// Cập nhật thông tin cá nhân
router.put('/', verifyToken, updateProfile);

module.exports = router;

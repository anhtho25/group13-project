const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar } = require('../controllers/profileController'); // ✅ đổi từ userController -> profileController
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer');

// cấu hình multer đơn giản lưu vào thư mục uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
	}
});
const upload = multer({ storage });

// Xem thông tin cá nhân
router.get('/', verifyToken, getProfile);

// Cập nhật thông tin cá nhân
router.put('/', verifyToken, updateProfile);

// Upload avatar
router.post('/avatar', verifyToken, upload.single('avatar'), uploadAvatar);

module.exports = router;

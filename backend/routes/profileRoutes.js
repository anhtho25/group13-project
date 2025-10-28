const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadAvatar,
} = require("../controllers/profileController");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const path = require("path");

// ===============================
// ⚙️ CẤU HÌNH MULTER - Lưu tạm ảnh vào thư mục /uploads
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // lưu tạm ảnh trước khi đẩy lên Cloudinary
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// Bộ lọc chỉ chấp nhận ảnh JPG, PNG
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(ext)) {
    return cb(new Error("Chỉ cho phép file .jpg, .jpeg, .png"), false);
  }
  cb(null, true);
};

// Tạo instance multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // giới hạn 5MB
});

// ===============================
// 🧩 ROUTES
// ===============================

// Xem thông tin cá nhân
router.get("/", verifyToken, getProfile);

// Cập nhật thông tin cá nhân
router.put("/", verifyToken, updateProfile);

// Upload avatar (Cloudinary)
router.post("/avatar", verifyToken, upload.single("avatar"), uploadAvatar);

module.exports = router;

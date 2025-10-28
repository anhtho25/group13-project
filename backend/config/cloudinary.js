// ===============================
// 📦 CONFIG CLOUDINARY
// ===============================

const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Load biến môi trường từ .env
dotenv.config();

// Kiểm tra các biến môi trường bắt buộc
if (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ Thiếu cấu hình Cloudinary trong file .env");
  process.exit(1);
}

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // đảm bảo trả về URL HTTPS
});

module.exports = cloudinary;

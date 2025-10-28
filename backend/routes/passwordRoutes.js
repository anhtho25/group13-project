const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

// ====================================
// 1️⃣  API: FORGOT PASSWORD
// ====================================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 phút
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    // cấu hình gửi mail (fake SMTP hoặc gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your_email@gmail.com",
        pass: "your_app_password", // dùng app password (Google)
      },
    });

    await transporter.sendMail({
      from: '"BLTY Support" <your_email@gmail.com>',
      to: user.email,
      subject: "Đặt lại mật khẩu",
      html: `
        <p>Xin chào ${user.name || "bạn"},</p>
        <p>Nhấn vào liên kết sau để đặt lại mật khẩu (hiệu lực 15 phút):</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({ message: "Email reset password đã được gửi!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// ====================================
// 2️⃣  API: RESET PASSWORD
// ====================================
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// ====================================
// 3️⃣  API: UPLOAD AVATAR (Cloudinary)
// ====================================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

router.post("/upload-avatar", verifyToken, upload.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.avatar = req.file.path;
    await user.save();

    res.json({ message: "Upload avatar thành công", avatar: req.file.path });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;

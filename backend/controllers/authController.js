const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// =============================
// ⚙️ Cấu hình Cloudinary
// =============================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =============================
// ⚙️ Cấu hình Multer lưu ảnh lên Cloudinary
// =============================
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'avatars',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Giới hạn 2MB
});

// =============================
// 🧩 Đăng ký
// =============================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email đã tồn tại' });

   const newUser = new User({ name, email, password, role: "user" });

    await newUser.save();

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('❌ Lỗi signup:', err.message);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
};
// =============================
// 🔐 Đăng nhập
// =============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });

    // ⚡ Lấy user có password (vì password bị select: false trong model)
    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(400).json({ message: 'Email không tồn tại' });

    // ⚡ So sánh mật khẩu
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Sai mật khẩu' });

    // ⚡ Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'supersecretkey',
      { expiresIn: '1h' }
    );

    // ⚡ Trả về thông tin (ẩn password)
    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Lỗi đăng nhập:', err.message);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
};
// =============================
// 🚪 Đăng xuất
// =============================
exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Đăng xuất thành công' });
};

// =============================
// 📩 Quên mật khẩu
// =============================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: 'Không tìm thấy người dùng với email này' });

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '15m' }
    );
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    console.log('🔗 Link reset password:', resetLink);

    res.status(200).json({
      message: 'Đã tạo link đặt lại mật khẩu (xem console để lấy link)',
      resetLink,
    });
  } catch (error) {
    console.error('❌ Lỗi forgotPassword:', error.message);
    res.status(500).json({ message: 'Lỗi server khi tạo token reset' });
  }
};
// =============================
// 🔑 Đặt lại mật khẩu (FINAL FIXED)
// =============================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // 🔹 Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // 🔹 Hash lại mật khẩu mới trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 🔹 Gán và lưu lại
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    // ⚡ RẤT QUAN TRỌNG: Bỏ validateBeforeSave để tránh lỗi rehash
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    console.error('❌ Lỗi resetPassword:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token đã hết hạn' });
    }
    return res.status(400).json({ message: 'Token không hợp lệ hoặc lỗi server' });
  }
};



// =============================
// 🖼️ Upload Avatar
// =============================
exports.uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      const { userId } = req.body;
      if (!req.file || !req.file.path)
        return res
          .status(400)
          .json({ message: 'Không có ảnh nào được tải lên' });

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });

      user.avatar = req.file.path || req.file.secure_url;
      await user.save();

      res.status(200).json({
        message: 'Cập nhật ảnh đại diện thành công',
        avatar: user.avatar,
      });
    } catch (error) {
      console.error('❌ Lỗi uploadAvatar:', error.message);
      res
        .status(500)
        .json({ message: 'Lỗi khi tải ảnh lên Cloudinary' });
    }
  },
];

module.exports = exports;

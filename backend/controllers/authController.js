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
const upload = multer({ storage });

// =============================
// 🧩 Đăng ký
// =============================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
        role: newUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

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
    res.status(500).json({ message: err.message });
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
      return res.status(404).json({ message: 'Không tìm thấy người dùng với email này' });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Không cần gửi mail thật, chỉ log ra để test MongoDB
    console.log('🔗 Link reset password:', resetLink);

    res.status(200).json({
      message: 'Đã tạo link đặt lại mật khẩu (xem console để lấy link)',
      resetLink
    });
  } catch (error) {
    console.error('❌ Lỗi forgotPassword:', error.message);
    res.status(500).json({ message: 'Lỗi server khi tạo token reset' });
  }
};

// =============================
// 🔑 Đặt lại mật khẩu
// =============================
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    console.error('❌ Lỗi resetPassword:', error.message);
    res.status(500).json({ message: 'Token hết hạn hoặc không hợp lệ' });
  }
};

// =============================
// 🖼️ Upload Avatar (Cloudinary)
// =============================
exports.uploadAvatar = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      const { userId } = req.body;
      if (!req.file || !req.file.path)
        return res.status(400).json({ message: 'Không có ảnh nào được tải lên' });

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });

      user.avatar = req.file.path;
      await user.save();

      res.status(200).json({
        message: 'Cập nhật ảnh đại diện thành công',
        avatar: user.avatar,
      });
    } catch (error) {
      console.error('❌ Lỗi uploadAvatar:', error.message);
      res.status(500).json({ message: 'Lỗi khi tải ảnh lên Cloudinary' });
    }
  },
];

// ✅ fix: export tất cả các hàm đã gán bằng exports.*
module.exports = exports;
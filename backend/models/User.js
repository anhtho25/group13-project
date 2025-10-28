// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // ✅ Dùng để tạo token reset mật khẩu

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },

    // ✅ Thêm 2 trường dùng cho quên mật khẩu
    resetToken: String,
    resetTokenExpire: Date,
  },
  { timestamps: true }
);

// 🔒 Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🧠 So sánh mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔑 Tạo token reset mật khẩu (dùng cho /forgot-password)
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Mã hóa token lưu trong DB
  this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Token hết hạn sau 15 phút
  this.resetTokenExpire = Date.now() + 15 * 60 * 1000;

  return resetToken; // return bản gốc (chưa hash) để gửi qua email
};

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Dùng để tạo token reset mật khẩu

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
      select: false, // ⚡Ẩn password khi query user (bảo mật)
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
    resetToken: String,
    resetTokenExpire: Date,
  },
  { timestamps: true }
);

// 🔒 Hash password trước khi lưu
userSchema.pre('save', async function (next) {
  // Nếu mật khẩu chưa được thay đổi hoặc đã được hash bên ngoài thì bỏ qua
  if (!this.isModified('password')) return next();

  // Nếu mật khẩu đã có dạng hash (bắt đầu bằng $2a$ hoặc $2b$) thì bỏ qua
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Hàm tìm user cho login (lấy cả password)
userSchema.statics.findUserForLogin = async function (email) {
  return await this.findOne({ email }).select('+password');
};

// 🧠 So sánh mật khẩu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔑 Token reset mật khẩu
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetTokenExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);

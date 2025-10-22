const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Đăng ký
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email không tồn tại' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Đăng nhập thành công', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đăng xuất
exports.logout = async (req, res) => {
  res.status(200).json({ message: 'Đăng xuất thành công' });
};

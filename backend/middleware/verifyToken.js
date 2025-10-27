const jwt = require('jsonwebtoken');
const User = require('../models/User'); // import model để tìm user trong DB

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm user trong DB để lấy role và thông tin khác
    const user = await User.findById(decoded.id).select('_id email role');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Gán user vào req để các controller dùng
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn', error: error.message });
  }
};

module.exports = verifyToken;

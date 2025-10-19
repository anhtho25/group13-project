const User = require("../models/User");

// ✅ GET /users - Lấy danh sách người dùng
const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Lấy toàn bộ user từ MongoDB
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách người dùng",
      error: error.message,
    });
  }
};

// ✅ POST /users - Thêm người dùng mới
const addUser = async (req, res) => {
  try {
    console.log("📥 req.body nhận được:", req.body);

    const { name, email } = req.body || {};

    // Kiểm tra dữ liệu gửi lên
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Vui lòng gửi JSON có name và email" });
    }

    // Tạo user mới và lưu vào MongoDB
    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm người dùng",
      error: error.message,
    });
  }
};

module.exports = { getUsers, addUser };

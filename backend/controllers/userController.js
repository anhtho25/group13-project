const User = require("../models/User");

// ✅ GET /users - Lấy danh sách người dùng
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
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
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Vui lòng gửi JSON có name và email" });
    }

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

// ✅ PUT /users/:id - Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật người dùng",
      error: error.message,
    });
  }
};

// ✅ DELETE /users/:id - Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Đã xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa người dùng",
      error: error.message,
    });
  }
};

// ✅ GET /profile - Xem thông tin cá nhân
const getProfile = async (req, res) => {
  try {
    // req.user được gán trong middleware verifyToken
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin cá nhân", error: error.message });
  }
};

// ✅ PUT /profile - Cập nhật thông tin cá nhân
const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Cập nhật thành công", user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin cá nhân", error: error.message });
  }
};

// ✅ Export tất cả hàm
module.exports = { getUsers, addUser, updateUser, deleteUser, getProfile, updateProfile };

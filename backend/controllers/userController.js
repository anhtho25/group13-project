const User = require("../models/User");

// ✅ [GET] /users - Admin xem danh sách người dùng
const getUsers = async (req, res) => {
  try {
    // Chỉ admin mới được xem danh sách user
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Chỉ admin mới được phép truy cập" });
    }

    const users = await User.find().select("-password"); // Ẩn mật khẩu
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách người dùng",
      error: error.message,
    });
  }
};

// ✅ [POST] /users - (Tùy chọn, chỉ admin được thêm user)
const addUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Chỉ admin mới được phép thêm user" });
    }

    const { name, email, role = "user" } = req.body || {};
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Vui lòng gửi JSON có name và email" });
    }

    const newUser = new User({ name, email, role });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm người dùng",
      error: error.message,
    });
  }
};

// ✅ [PUT] /users/:id - Admin hoặc chính chủ mới được cập nhật
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Nếu không phải admin và không phải chính chủ → cấm
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Không có quyền cập nhật user này" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

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

// ✅ [DELETE] /users/:id - Admin hoặc chính chủ mới được xóa
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Nếu không phải admin và không phải chính chủ → cấm
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Không có quyền xóa user này" });
    }

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

// ✅ [GET] /profile - Xem thông tin cá nhân
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin cá nhân",
      error: error.message,
    });
  }
};

// ✅ [PUT] /profile - Cập nhật thông tin cá nhân
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
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin cá nhân",
      error: error.message,
    });
  }
};

// ✅ Export tất cả hàm
module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
};

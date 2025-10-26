const User = require("../models/User");

// [GET] /profile - xem thông tin cá nhân
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [PUT] /profile - cập nhật thông tin cá nhân
const updateProfile = async (req, res) => {
  try {
    // Đồng bộ với schema User: trường 'name', 'email', 'avatar'
    const { name, email, avatar } = req.body;

    const update = {};
    if (typeof name !== 'undefined') update.name = name;
    if (typeof email !== 'undefined') update.email = email;
    if (typeof avatar !== 'undefined') update.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      update,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({
      message: 'Cập nhật thành công',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [POST] /profile/avatar - upload avatar image
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file upload' });
    }

    // xây dựng url truy cập file
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.status(200).json({ message: 'Upload avatar thành công', avatar: avatarUrl, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, uploadAvatar };

const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

// ⚠️ Kiểm tra cấu hình Cloudinary
if (!cloudinary.config().cloud_name) {
  console.warn("⚠️ Cloudinary chưa được cấu hình — kiểm tra .env!");
}

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
    const { name, email, avatar } = req.body;

    const update = {};
    if (typeof name !== "undefined") update.name = name;
    if (typeof email !== "undefined") update.email = email;
    if (typeof avatar !== "undefined") update.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      message: "Cập nhật thành công",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// [POST] /profile/avatar - upload avatar lên Cloudinary
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file upload" });
    }

    const filePath = req.file.path;
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: "File upload không tồn tại hoặc bị lỗi" });
    }

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "avatars",
      public_id: `user_${req.user.id}`,
      overwrite: true,
    });

    // Xóa file local
    const localPath = path.join(__dirname, "..", "uploads", req.file.filename);
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);

    // Cập nhật DB
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      message: "Upload avatar thành công",
      user: {
        ...user.toObject(),
        avatar: result.secure_url
      }
    });
  } catch (error) {
    console.error("❌ Lỗi upload Cloudinary:", error);
    res.status(500).json({ message: "Upload thất bại", error: error.message });
  }
};

module.exports = { getProfile, updateProfile, uploadAvatar };

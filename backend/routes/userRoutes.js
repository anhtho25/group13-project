  // backend/routes/userRoutes.js
  const express = require('express');
  const router = express.Router();
  const User = require('../models/User');
  const verifyToken = require('../middleware/verifyToken');
  const checkRole = require('../middleware/checkRole'); // ✅ import đúng kiểu export trực tiếp

  console.log("✅ userRoutes loaded");

  // =============================
  // 📌 GET /api/users
  // ✅ Chỉ Admin mới xem được danh sách tất cả người dùng
  // =============================
  router.get('/', verifyToken, checkRole(['admin']), async (req, res) => {
    console.log("📥 GET /api/users route hit");
    console.log("🧑‍💻 User trong token:", req.user);

    try {
      const users = await User.find().select('-password'); // bỏ password
      res.status(200).json(users);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách người dùng:", error.message);
      res.status(500).json({
        message: "Lỗi khi lấy danh sách người dùng",
        error: error.message,
      });
    }
  });

  // =============================
  // 📌 DELETE /api/users/:id
  // ✅ Admin có thể xóa bất kỳ user
  // ✅ Chính chủ có thể tự xóa tài khoản mình
  // =============================
  router.delete('/:id', verifyToken, async (req, res) => {
    console.log("📥 DELETE /api/users/:id route hit");

    try {
      const { id } = req.params;

      // Nếu không phải admin và không phải chính chủ => cấm
      if (req.user.role !== 'admin' && req.user.id !== id) {
        console.log("🚫 Người dùng không có quyền xóa tài khoản này");
        return res.status(403).json({ message: "Bạn không có quyền xóa tài khoản này" });
      }

      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.status(200).json({ message: "Đã xóa người dùng thành công" });
    } catch (error) {
      console.error("❌ Lỗi khi xóa người dùng:", error.message);
      res.status(500).json({
        message: "Lỗi khi xóa người dùng",
        error: error.message,
      });
    }
  });

  module.exports = router;

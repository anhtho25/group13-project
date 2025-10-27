// backend/middleware/checkRole.js

// 🧩 Log khi file được load (để kiểm tra Node có đọc đúng file không)
console.log("✅ checkRole middleware loaded");

module.exports = (roles) => {
  console.log("✅ checkRole invoked with roles:", roles); // log khi middleware được gọi

  return (req, res, next) => {
    if (!req.user) {
      console.log("⚠️ Không tìm thấy thông tin user trong req.user");
      return res.status(401).json({ message: "Chưa đăng nhập hoặc token không hợp lệ" });
    }

    console.log("🧑‍💻 Vai trò người dùng hiện tại:", req.user.role);

    if (!roles.includes(req.user.role)) {
      console.log("🚫 Quyền không hợp lệ:", req.user.role, "=> yêu cầu quyền:", roles);
      return res.status(403).json({ message: "Bạn không có quyền truy cập chức năng này" });
    }

    console.log("✅ Quyền hợp lệ, tiếp tục xử lý...");
    next();
  };
};

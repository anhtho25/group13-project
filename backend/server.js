// ✅ server.js — phiên bản sửa lỗi CORS triệt để

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");

dotenv.config(); // ✅ Đọc file .env
connectDB(); // ✅ Kết nối MongoDB

const app = express();

// ✅ Cho phép mọi origin (an toàn trong DEV)
app.use(cors());

// Hoặc nếu bạn chỉ muốn cho phép React app cụ thể:
// app.use(cors({
//   origin: ["http://localhost:3006", "http://localhost:3001", "http://localhost:3000"],
//   methods: ["GET", "POST"],
//   allowedHeaders: ["Content-Type"],
// }));

// ✅ Đọc JSON body từ request
app.use(express.json());

// ✅ Các routes API
app.use("/api", userRoutes);

// ✅ Route test backend
app.get("/", (req, res) => {
  res.send("✅ Backend is running and CORS is working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

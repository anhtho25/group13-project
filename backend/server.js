console.log('✅ server.js starting...');

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const cloudinary = require('cloudinary').v2; // ✅ Cloudinary SDK

// ===============================
// ⚙️ Load environment & connect MongoDB
// ===============================
dotenv.config();
connectDB();

const app = express();

// ===============================
// ☁️ Cloudinary Config
// ===============================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('✅ Cloudinary configured successfully');

// ===============================
// 🌐 Middleware
// ===============================
app.use(
  cors({
    origin: '*', // ⚠️ Có thể thay bằng ['http://localhost:3000'] nếu frontend cố định
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===============================
// 🧩 Routes
// ===============================
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);

console.log('✅ Routes loaded: /api/auth, /api/profile, /api/users');

// ===============================
// 🧪 Test Route
// ===============================
app.get('/', (req, res) => {
  res.send('✅ Backend is running successfully!');
});

// ===============================
// ⚠️ Global Error Handler (nên có để debug dễ)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ===============================
// 🚀 Start Server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

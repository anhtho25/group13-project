const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // ✅ đúng tên file

dotenv.config(); // load biến môi trường

// Kết nối MongoDB
connectDB();

const app = express();

// Cấu hình CORS để chấp nhận request từ frontend
app.use(cors({
  origin: '*',  // Cho phép tất cả các origin trong môi trường development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json()); // parse JSON body

// ✅ Route chính
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

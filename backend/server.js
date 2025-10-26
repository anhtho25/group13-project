const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import các route
const authRoutes = require('./routes/authRoutes'); 
const profileRoutes = require('./routes/profileRoutes');

dotenv.config(); // Load biến môi trường

// Kết nối MongoDB
connectDB();

const app = express();

// Cấu hình CORS
app.use(cors({
  origin: '*',  // Cho phép tất cả các origin trong môi trường development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json()); // Parse JSON body

// ✅ Route chính
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Route test
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

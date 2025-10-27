// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import các route
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes'); // ✅ route admin

dotenv.config(); 
connectDB();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// ✅ Mount route
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes); // 👈 route quản lý user

// ✅ Log để kiểm tra route load
console.log("✅ Routes loaded: /api/auth, /api/profile, /api/users");

// Test route
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/user');

dotenv.config();
const app = express();

// ✅ Cho phép React (port 3001 hoặc 3002) gọi API backend
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002']
}));

// ✅ Cho phép đọc JSON từ body
app.use(express.json());

// ✅ Đăng ký routes
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('✅ Backend is running! Go to /api/users');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

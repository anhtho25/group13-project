const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');

dotenv.config();
const app = express();

app.use(express.json());

// Routes
app.use('/api', userRoutes);

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

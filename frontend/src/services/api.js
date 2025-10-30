import axios from "axios";

// Cấu hình API với endpoint từ biến môi trường
const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL || "https://group13-project-backend.onrender.com"}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});


// Nếu cần gửi token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

import axios from "axios";

// Cấu hình API với endpoint chính xác
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  headers: {
    'Content-Type': 'application/json',
  }
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

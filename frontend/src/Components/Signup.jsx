import React, { useState } from "react";
import API from "../services/api";

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kiểm tra mật khẩu
      if (formData.password.length < 6) {
        setMessage("Mật khẩu phải có ít nhất 6 ký tự ❌");
        return;
      }

      // Kiểm tra email hợp lệ
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setMessage("Email không hợp lệ ❌");
        return;
      }

      const res = await API.post("/signup", formData);
      setMessage("Đăng ký thành công! 🎉");
      console.log(res.data);
      
      // Reset form sau khi đăng ký thành công
      setFormData({ name: "", email: "", password: "" });
      
      // Chuyển hướng đến trang đăng nhập sau 2 giây
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      if (error.response?.data?.message) {
        setMessage(error.response.data.message + " ❌");
      } else if (error.message === "Network Error") {
        setMessage("Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối ❌");
      } else {
        setMessage("Lỗi đăng ký. Vui lòng thử lại sau ❌");
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Tên" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} required />
        <button type="submit">Đăng ký</button>
      </form>
      {message && (
        <p className={message.includes("🎉") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Signup;

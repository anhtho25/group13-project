import React, { useState } from "react";
import API from "../services/api";
import "../styles/custom.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", formData);
      localStorage.setItem("token", res.data.token);
      setMessage("Đăng nhập thành công! ✅");
      console.log("Token:", res.data.token);
    } catch (error) {
      setMessage(error.response?.data?.message || "Sai email hoặc mật khẩu ❌");
    }
  };

  return (
    <div className="form-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} required />
        <button type="submit">Đăng nhập</button>
      </form>
      {message && (
        <p className={message.includes("✅") ? "success-message" : "error-message"}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Login;

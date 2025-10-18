import React, { useState } from "react";
import axios from "axios";

export default function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, email };

    try {
      console.log("📤 Gửi dữ liệu tới backend:", newUser);
      const res = await axios.post("http://localhost:3000/api/users", newUser);
      console.log("✅ Server trả về:", res.data);

      alert("Thêm user thành công!");
      setName("");
      setEmail("");
      if (onUserAdded) onUserAdded();
    } catch (error) {
      console.error("❌ Lỗi khi thêm user:", error);
      alert("Không thể thêm user!");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>Thêm User mới</h3>
      <div>
        <label>Tên: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên"
          required
        />
      </div>
      <div>
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email"
          required
        />
      </div>
      <button type="submit">Thêm user</button>
    </form>
  );
}

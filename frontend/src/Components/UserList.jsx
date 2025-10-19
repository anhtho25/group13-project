import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // ✅ Gọi API khi component load
  useEffect(() => {
    fetchUsers();
  }, []);

  // 📥 Hàm lấy danh sách users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users");
      console.log("📥 Nhận dữ liệu users:", res.data);
      setUsers(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách users:", error);
    }
  };

  // 🗑️ Xóa user
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa user này không?")) {
      try {
        await axios.delete(`http://localhost:3000/api/users/${id}`);
        alert("✅ Đã xóa user thành công!");
        fetchUsers(); // load lại danh sách
      } catch (error) {
        console.error("❌ Lỗi khi xóa user:", error);
        alert("❌ Không thể xóa user!");
      }
    }
  };

  // ✏️ Bắt đầu sửa user
  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  // 💾 Lưu thay đổi user (PUT)
  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/users/${id}`, {
        name: editName,
        email: editEmail,
      });
      alert("✅ Cập nhật user thành công!");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật user:", error);
      alert("❌ Không thể cập nhật user!");
    }
  };

  return (
    <div>
      <h3>Danh sách Users</h3>

      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {editingUser === user._id ? (
                // Nếu đang sửa user này
                <>
                  <label>
                    <strong>Tên: </strong>
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <br />
                  <label>
                    <strong>Email: </strong>
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                  <br />
                  <button onClick={() => handleSave(user._id)}>💾 Lưu</button>
                  <button onClick={() => setEditingUser(null)}>❌ Hủy</button>
                </>
              ) : (
                // Nếu đang hiển thị bình thường
                <>
                  <strong>ID:</strong> {user._id} <br />
                  <strong>Tên:</strong> {user.name} <br />
                  <strong>Email:</strong> {user.email} <br />
                  <button onClick={() => handleEdit(user)}>✏️ Sửa</button>
                  <button onClick={() => handleDelete(user._id)}>🗑️ Xóa</button>
                  <hr />
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có user nào!</p>
      )}
    </div>
  );
}

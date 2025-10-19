import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);

  // ✅ Gọi API khi component load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/users");
        console.log("📥 Nhận dữ liệu users:", res.data);
        setUsers(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h3>Danh sách Users</h3>

      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            // ✅ Dùng _id làm key (MongoDB)
            <li key={user._id}>
              <strong>ID:</strong> {user._id} <br />
              <strong>Tên:</strong> {user.name} <br />
              <strong>Email:</strong> {user.email}
              <hr />
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có user nào!</p>
      )}
    </div>
  );
}

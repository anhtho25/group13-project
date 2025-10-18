import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("❌ Lỗi khi lấy danh sách users:", err));
  }, []);

  return (
    <div>
      <h3>Danh sách Users</h3>
      {users.length === 0 ? (
        <p>Chưa có user nào</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.name} — {u.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import React, { useState } from "react";
import AddUser from "./Components/AddUser";
import UserList from "./Components/UserList";

function App() {
  const [refresh, setRefresh] = useState(false);

  const reloadUsers = () => setRefresh(!refresh);

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 App Quản lý Users - Backend chỉnh sửa bởi Thơ</h1>
      <AddUser onUserAdded={reloadUsers} />
      <UserList key={refresh} />
      <p style={{ color: "green" }}>Chức năng backend đã được hoàn thiện ✅</p>
    </div>
  );
}

export default App;
// ✅ Kết hợp Frontend + Backend version

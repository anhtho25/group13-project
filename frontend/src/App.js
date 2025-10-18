import React, { useState } from "react";
import AddUser from "./Components/AddUser";
import UserList from "./Components/UserList";

function App() {
  const [refresh, setRefresh] = useState(false);

  const reloadUsers = () => setRefresh(!refresh);

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 App Quản lý Users</h1>
      <AddUser onUserAdded={reloadUsers} />
      <UserList key={refresh} />
    </div>
  );
}

export default App;

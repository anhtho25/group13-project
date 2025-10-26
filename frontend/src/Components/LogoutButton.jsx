import React from "react";
import API from "../services/api";

function LogoutButton() {
  const handleLogout = async () => {
    try {
      await API.post("/logout");
    } catch (e) {
      console.log("Đã logout phía client");
    }
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Đăng xuất
    </button>
  );
}

export default LogoutButton;

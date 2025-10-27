import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import LogoutConfirm from "./Components/LogoutConfirm";
import BackButton from "./Components/BackButton";
import AdminPage from "./Components/AdminPage";
import "./styles/header.css";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="dna-waves"></div>
        <div className="dna-strand"></div>
        <header className="app-header">
          <h1 className="app-title">Quản lý người dùng</h1>
        </header>
    <BackButton />
        
  <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<LogoutConfirm />} />
          <Route path="/admin/users" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import Signup from "./Components/Signup";
import Login from "./Components/Login";
import LogoutButton from "./Components/LogoutButton";
import "./styles/header.css";

function App() {
  return (
    <div className="App">
      <div className="dna-waves"></div>
      <div className="dna-strand"></div>
      <header className="app-header">
        <h1 className="app-title">Authentication Demo</h1>
      </header>
      <Signup />
      <Login />
      <LogoutButton />
    </div>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // ✅ đúng rồi
import "./index.css"; // nếu bạn có file CSS, giữ lại; nếu không, có thể xóa

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

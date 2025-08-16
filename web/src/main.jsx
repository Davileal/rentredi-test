import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const style = document.createElement("style");
style.innerHTML = `
  * { box-sizing: border-box; }
  body { background: #f8fafc; color: #0f172a; }
  a { color: #2563eb; text-decoration: none; }
  a:hover { text-decoration: underline; }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

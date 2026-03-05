import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global spinner animation for AuthSuccess page
const style = document.createElement("style");
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }`;
document.head.appendChild(style);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

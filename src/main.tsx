import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Remove loading spinner
const spinner = rootElement.querySelector('.loading');
if (spinner) spinner.remove();

try {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to render app:", error);
  rootElement.innerHTML = `
    <div style="padding: 2rem; font-family: system-ui;">
      <h1 style="color: #D32F2F;">Failed to Load</h1>
      <pre style="background: #f5f5f5; padding: 1rem; border-radius: 8px; overflow: auto;">${error}</pre>
    </div>
  `;
}

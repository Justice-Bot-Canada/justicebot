import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Diagnostic check
if (!React || !React.createContext) {
  console.error("React failed to load properly. Clearing cache and reloading...");
  if ('caches' in window) {
    caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
  }
  setTimeout(() => window.location.reload(), 100);
  throw new Error("React module corrupted - reloading");
}

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

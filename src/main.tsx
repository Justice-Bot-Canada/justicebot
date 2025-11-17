import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Remove loading spinner immediately
const loadingSpinner = document.querySelector('.loading');
if (loadingSpinner) {
  loadingSpinner.remove();
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

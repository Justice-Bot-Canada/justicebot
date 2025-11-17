import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// Remove loading spinner
const spinner = rootElement.querySelector('.loading');
if (spinner) {
  spinner.remove();
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import React from "react";
import { createRoot } from "react-dom/client";

console.log("[MAIN] Starting...");
console.log("[MAIN] React loaded:", !!React);
console.log("[MAIN] React.createContext exists:", !!React.createContext);

// Import CSS first
import("./index.css").then(() => {
  console.log("[MAIN] CSS loaded");
  
  // Then import App
  return import("./App.tsx");
}).then((module) => {
  console.log("[MAIN] App module loaded:", !!module.default);
  const App = module.default;
  
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("[MAIN] App rendered");
}).catch((error) => {
  console.error("[MAIN] ERROR:", error);
  document.body.innerHTML = `<div style="padding:2rem;font-family:system-ui"><h1 style="color:red">Load Error</h1><pre>${error.message}\n\n${error.stack}</pre></div>`;
});

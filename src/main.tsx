import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Simple reflow optimization - add CSS containment
const style = document.createElement('style');
style.textContent = `
  /* Optimize animations to prevent forced reflows */
  .animate-fade-in {
    contain: layout;
    transform: translateZ(0);
  }
  
  /* GPU acceleration for common interactive elements */
  [class*="animate"], [class*="transition"] {
    will-change: transform;
    transform: translateZ(0);
  }
  
  /* Contain layout for modal/dropdown elements */
  .modal, .dropdown, .tooltip {
    contain: layout style;
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

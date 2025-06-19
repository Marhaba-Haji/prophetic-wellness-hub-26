// This file is deprecated in favor of the routes defined in App.tsx
// Keeping for backward compatibility but routes are now handled in App.tsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";

const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
  },
]);

export default router;

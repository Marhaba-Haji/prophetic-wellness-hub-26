
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Benefits from "./pages/Benefits";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import BookingAppointment from "./pages/BookingAppointment";
import BookingSuccess from "./pages/BookingSuccess";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/admin/Dashboard";
import BlogEditor from "./pages/admin/BlogEditor";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/services/:serviceId",
    element: <ServiceDetail />,
  },
  {
    path: "/benefits",
    element: <Benefits />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:blogSlug",
    element: <BlogDetail />,
  },
  {
    path: "/booking",
    element: <BookingAppointment />,
  },
  {
    path: "/booking/success",
    element: <BookingSuccess />,
  },
  {
    path: "/admin",
    element: <AdminAuth />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/blog/new",
    element: <BlogEditor />,
  },
  {
    path: "/admin/blog/edit/:blogId",
    element: <BlogEditor />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;

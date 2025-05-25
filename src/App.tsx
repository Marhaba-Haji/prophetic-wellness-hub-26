
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import ServicesPage from "./pages/Services";
import BenefitsPage from "./pages/Benefits";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import BookingAppointment from "./pages/BookingAppointment";
import BookingSuccess from "./pages/BookingSuccess";
import NotFound from "./pages/NotFound";
import ServiceDetail from "./pages/ServiceDetail";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/admin/Dashboard";
import BlogEditor from "./pages/admin/BlogEditor";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/service/:serviceId" element={<ServiceDetail />} />
            <Route path="/benefits" element={<BenefitsPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:blogSlug" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking-appointment" element={<BookingAppointment />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/admin" element={<AdminAuth />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/blog/new" element={<BlogEditor />} />
            <Route path="/admin/blog/edit/:blogId" element={<BlogEditor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;

// @ts-nocheck
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "@/components/providers/HelmetProvider";
import ScrollToTop from "@/components/ScrollToTop";

// Import pages
import Index from "./pages/Index.jsx";
import About from "./pages/About.jsx";
import Benefits from "./pages/Benefits.jsx";
import Contact from "./pages/Contact.jsx";
import BookingSuccess from "./pages/BookingSuccess.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminAuth from "./pages/AdminAuth.jsx";
import AdminDashboard from "./pages/admin/Dashboard";
import BlogEditor from "./pages/admin/BlogEditor.jsx";
import Blog from "./pages/Blog.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import BookingAppointment from "./pages/BookingAppointment.jsx";
import Services from "./pages/Services.jsx";
import ServiceDetail from "./pages/ServiceDetail.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import Refund from "./pages/Refund.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/services" element={<Services />} />
              <Route path="/service/:serviceId" element={<ServiceDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/booking" element={<BookingAppointment />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/booking/success" element={<BookingSuccess />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/admin" element={<AdminAuth />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/blog/new" element={<BlogEditor />} />
              <Route path="/admin/blog/edit/:blogId" element={<BlogEditor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;

// @ts-nocheck
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "@/components/providers/HelmetProvider";
import ScrollToTop from "@/components/ScrollToTop";
import PerformanceMonitor from "@/components/PerformanceMonitor";

// Import pages
import Index from "./pages/Index";
import About from "./pages/About";
import Benefits from "./pages/Benefits";
import Contact from "./pages/Contact";
import BookingSuccess from "./pages/BookingSuccess";
import NotFound from "./pages/NotFound.jsx";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/admin/Dashboard";
import BlogEditor from "./pages/admin/BlogEditor.jsx";
import Blog from "./pages/Blog.jsx";
import BlogDetail from "./pages/BlogDetail";
import BookingAppointment from "./pages/BookingAppointment";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import UnaniHealthCare from "./pages/UnaniHealthCare";
import AcupressureTherapy from "./pages/AcupressureTherapy";
import GreekRegimenTherapy from "./pages/GreekRegimenTherapy";
import FullBodyDetox from "./pages/FullBodyDetox";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import Products from "./pages/Products";
import ProductCategory from "./pages/ProductCategory";
import ProductDetail from "./pages/ProductDetail";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCustomers from "./pages/admin/AdminCustomers";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
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
            <PerformanceMonitor />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/cupping-therapy" element={<Services />} />
            <Route path="/greek-regimen-therapy" element={<GreekRegimenTherapy />} />
            <Route path="/full-body-detox" element={<FullBodyDetox />} />
              <Route path="/service/:serviceId" element={<ServiceDetail />} />
              <Route path="/unani-healthcare" element={<UnaniHealthCare />} />
              <Route path="/acupressure-therapy" element={<AcupressureTherapy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/booking" element={<BookingAppointment />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/booking/success" element={<BookingSuccess />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund" element={<Refund />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/category/:categoryId" element={<ProductCategory />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/admin" element={<AdminAuth />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="inventory" element={<AdminInventory />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="customers" element={<AdminCustomers />} />
              </Route>
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

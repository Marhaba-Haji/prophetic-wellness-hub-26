// @ts-nocheck
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "@/components/providers/HelmetProvider";
import ScrollToTop from "@/components/ScrollToTop";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import DeferredScripts from "@/components/DeferredScripts";

// Critical: Load homepage immediately for fast FCP
import Index from "./pages/Index";

// Lazy load all other routes for better TTI
const About = lazy(() => import("./pages/About"));
const Benefits = lazy(() => import("./pages/Benefits"));
const Contact = lazy(() => import("./pages/Contact"));
const BookingSuccess = lazy(() => import("./pages/BookingSuccess"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const UnaniHealthCare = lazy(() => import("./pages/UnaniHealthCare"));
const AcupressureTherapy = lazy(() => import("./pages/AcupressureTherapy"));
const GreekRegimenTherapy = lazy(() => import("./pages/GreekRegimenTherapy"));
const FullBodyDetox = lazy(() => import("./pages/FullBodyDetox"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Refund = lazy(() => import("./pages/Refund"));

// Lazy load blog and booking (less critical paths)
const Blog = lazy(() => import("./pages/Blog.jsx"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const BookingAppointment = lazy(() => import("./pages/BookingAppointment"));

// Lazy load admin routes (rarely accessed)
const AdminAuth = lazy(() => import("./pages/AdminAuth"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const BlogEditor = lazy(() => import("./pages/admin/BlogEditor.jsx"));

// Minimal loading fallback for better perceived performance
const PageLoader = () => (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: 'hsl(var(--background))'
  }}>
    <div style={{ 
      width: '40px', 
      height: '40px', 
      border: '3px solid hsl(var(--primary) / 0.3)',
      borderTop: '3px solid hsl(var(--primary))',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
  </div>
);

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
            <DeferredScripts />
            <Suspense fallback={<PageLoader />}>
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
                <Route path="/admin" element={<AdminAuth />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/blog/new" element={<BlogEditor />} />
                <Route path="/admin/blog/edit/:blogId" element={<BlogEditor />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;

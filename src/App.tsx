
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { HelmetProvider } from '@/components/providers/HelmetProvider';

// Import pages
import Index from './pages/Index';
import About from './pages/About';
import Benefits from './pages/Benefits';
import Contact from './pages/Contact';
import BookingSuccess from './pages/BookingSuccess';
import NotFound from './pages/NotFound';
import AdminAuth from './pages/AdminAuth';
import AdminDashboard from './pages/admin/Dashboard';
import BlogEditor from './pages/admin/BlogEditor';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';

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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
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

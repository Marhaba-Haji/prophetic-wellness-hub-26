
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
import Contact from "./pages/Contact";
import BookingAppointment from "./pages/BookingAppointment";
import BookingSuccess from "./pages/BookingSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/benefits" element={<BenefitsPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking-appointment" element={<BookingAppointment />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import AdminAppointments from "@/components/admin/AdminAppointments";
import AdminContacts from "@/components/admin/AdminContacts";
import AdminBlogs from "@/components/admin/AdminBlogs";
import {
  Users,
  MessageSquare,
  LogOut,
  BookOpen,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Admin } from "@/types/supabase-types";

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<
    "appointments" | "contacts" | "blogs"
  >("appointments");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // No session, redirect to login
          navigate("/admin");
          return;
        }

        // Check if user is a super admin first
        const isSuperAdmin =
          session.user.user_metadata?.is_super_admin === true;

        if (!isSuperAdmin) {
          // If not super admin, check if they're in the admins table
          const { data: adminData, error: adminError } = await supabase
            .from("admins")
            .select<string, Admin>("*")
            .eq("user_id", session.user.id)
            .single();

          if (adminError || !adminData) {
            // Not an admin, sign out and redirect
            await supabase.auth.signOut();
            navigate("/admin");
            return;
          }
        }

        // User is either super admin or regular admin
        setUser(session.user);
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/admin");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`hidden md:flex flex-col ${sidebarOpen ? "w-64" : "w-20"} bg-white border-r shadow-sm min-h-screen transition-all duration-300 relative`}
      >
        {/* Always show the toggle button at the top */}
        <div className="flex items-center h-16 border-b px-2 relative">
          {sidebarOpen && (
            <span className="text-xl font-bold text-brand-green transition-opacity duration-200">
              Admin Panel
            </span>
          )}
          <button
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-gray-100 transition-colors z-10`}
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>
        <nav className="flex-1 py-6 px-2 space-y-2">
          <button
            className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg text-left transition-colors font-medium ${activeModule === "appointments" ? "bg-brand-green/10 text-brand-green" : "hover:bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveModule("appointments")}
          >
            <Users className="h-5 w-5 mx-auto" />
            <span
              className={`transition-all duration-200 ${sidebarOpen ? "inline" : "hidden"}`}
            >
              Appointments
            </span>
          </button>
          <button
            className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg text-left transition-colors font-medium ${activeModule === "contacts" ? "bg-brand-green/10 text-brand-green" : "hover:bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveModule("contacts")}
          >
            <MessageSquare className="h-5 w-5 mx-auto" />
            <span
              className={`transition-all duration-200 ${sidebarOpen ? "inline" : "hidden"}`}
            >
              Contact Messages
            </span>
          </button>
          <button
            className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg text-left transition-colors font-medium ${activeModule === "blogs" ? "bg-brand-green/10 text-brand-green" : "hover:bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveModule("blogs")}
          >
            <BookOpen className="h-5 w-5 mx-auto" />
            <span
              className={`transition-all duration-200 ${sidebarOpen ? "inline" : "hidden"}`}
            >
              Blog Management
            </span>
          </button>
        </nav>
        <div className="mt-auto p-4 border-t">
          <div
            className={`flex items-center gap-2 justify-${sidebarOpen ? "between" : "center"}`}
          >
            {sidebarOpen && (
              <span className="text-xs text-gray-500 truncate">
                {user?.email}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              {sidebarOpen && "Sign Out"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow h-16 flex items-center px-6 border-b">
          <h1 className="text-2xl font-bold text-brand-green">
            Admin Dashboard
          </h1>
        </header>
        <main className="flex-1 p-6 md:p-10 bg-gray-50 overflow-y-auto">
          {activeModule === "appointments" && <AdminAppointments />}
          {activeModule === "contacts" && <AdminContacts />}
          {activeModule === "blogs" && <AdminBlogs />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

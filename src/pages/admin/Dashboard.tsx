
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';
import AdminAppointments from '@/components/admin/AdminAppointments';
import AdminContacts from '@/components/admin/AdminContacts';
import AdminBlogs from '@/components/admin/AdminBlogs';
import { Users, MessageSquare, LogOut, BookOpen } from 'lucide-react';
import { Admin } from '@/types/supabase-types';

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // No session, redirect to login
          navigate('/admin');
          return;
        }
        
        // Check if user is in admins table
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select<string, Admin>('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (adminError || !adminData) {
          // Not an admin, sign out and redirect
          await supabase.auth.signOut();
          navigate('/admin');
          return;
        }
        
        // User is authenticated and is an admin
        setUser(session.user);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/admin');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-green">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="appointments">
          <TabsList className="mb-8 bg-white">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Appointments
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Contact Messages
            </TabsTrigger>
            <TabsTrigger value="blogs" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Blog Management
            </TabsTrigger>
          </TabsList>
          <TabsContent value="appointments">
            <AdminAppointments />
          </TabsContent>
          <TabsContent value="contacts">
            <AdminContacts />
          </TabsContent>
          <TabsContent value="blogs">
            <AdminBlogs />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;

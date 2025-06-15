import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminBlogEditor from '@/components/admin/AdminBlogEditor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { BlogPost } from '@/types/supabase-types';

const BlogEditor = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin');
        return false;
      }
      return true;
    };

    // If in edit mode, fetch the blog data
    const fetchBlogData = async () => {
      if (!blogId) return;

      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', blogId)
          .single();

        if (error) {
          toast.error('Blog post not found');
          navigate('/admin/dashboard');
          return;
        }

      } catch (error) {
        console.error('Error fetching blog data:', error);
        toast.error('Failed to fetch blog data');
        navigate('/admin/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [blogId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <AdminBlogEditor />
      </div>
    </div>
  );
};

export default BlogEditor;

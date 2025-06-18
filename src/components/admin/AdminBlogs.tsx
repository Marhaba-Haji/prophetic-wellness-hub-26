
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Edit, Trash2, Plus, Power, PowerOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { BlogPost } from '@/types/supabase-types';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  
  useEffect(() => {
    fetchBlogs();
  }, []);
  
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setBlogs(data as BlogPost[] || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      setSelectedBlog(id);
      const { error } = await supabase
        .from('blogs')
        .update({ 
          published: !currentStatus,
          published_date: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setBlogs(blogs.map(blog => 
        blog.id === id 
          ? { ...blog, published: !currentStatus, published_date: !currentStatus ? new Date().toISOString() : null } 
          : blog
      ));
      
      toast.success(`Blog ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error updating blog status:', error);
      toast.error('Failed to update blog status');
    } finally {
      setSelectedBlog(null);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }
    
    try {
      setSelectedBlog(id);
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setBlogs(blogs.filter(blog => blog.id !== id));
      toast.success('Blog deleted successfully');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setSelectedBlog(null);
    }
  };
  
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Blog Management</CardTitle>
        <Link to="/admin/blog/new">
          <Button className="bg-brand-green hover:bg-brand-green-dark">
            <Plus className="w-4 h-4 mr-2" />
            Create New Blog
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-green"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No blog posts found</p>
            <Link to="/admin/blog/new">
              <Button variant="outline" className="border-brand-green text-brand-green">
                Create your first blog post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="font-medium">{blog.title}</div>
                      <div className="text-sm text-gray-500">/blog/{blog.slug}</div>
                    </TableCell>
                    <TableCell>{blog.author}</TableCell>
                    <TableCell>
                      {blog.category ? (
                        <Badge variant="outline" className="capitalize">
                          {blog.category.replace('-', ' ')}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">No category</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={blog.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {blog.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(blog.published_date)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {blog.published && (
                          <Link to={`/blog/${blog.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Link to={`/admin/blog/edit/${blog.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-8 w-8 p-0 ${blog.published ? 'text-orange-500' : 'text-green-500'}`}
                          onClick={() => handleStatusToggle(blog.id, blog.published)}
                          disabled={selectedBlog === blog.id}
                          title={blog.published ? 'Unpublish' : 'Publish'}
                        >
                          {blog.published ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500" 
                          onClick={() => handleDelete(blog.id)}
                          disabled={selectedBlog === blog.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBlogs;

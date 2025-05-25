import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Toggle } from '@/components/ui/toggle';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, Link as LinkIcon, Code, Image, Video, Save, Eye, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { nanoid } from 'nanoid';
import { BlogPost } from '@/types/supabase-types';

interface BlogEditorProps {
  editMode?: boolean;
  blogData?: BlogPost;
  onSave?: () => void;
}

const AdminBlogEditor = ({ editMode = false, blogData, onSave }: BlogEditorProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [blog, setBlog] = useState<Partial<BlogPost>>(blogData || {
    title: '',
    meta_description: '',
    slug: '',
    featured_image: '',
    featured_image_alt: '',
    content: '',
    author: '',
    tags: [],
    published: false,
    schema_markup: ''
  });
  
  const [tagInput, setTagInput] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlog(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContentChange = (content: string) => {
    setBlog(prev => ({ ...prev, content }));
  };
  
  const handleSlugGenerate = () => {
    if (blog.title) {
      const slug = blog.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      setBlog(prev => ({ ...prev, slug }));
    }
  };
  
  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!blog.tags?.includes(tagInput.trim())) {
        setBlog(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };
  
  const handleTagRemove = (tagToRemove: string) => {
    setBlog(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setImageUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${nanoid()}.${fileExt}`;
      
      // Check if storage bucket exists
      const { data: bucket } = await supabase.storage.getBucket('blog_images');
      
      if (!bucket) {
        const { error: bucketError } = await supabase.storage.createBucket('blog_images', {
          public: true,
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (bucketError) throw bucketError;
      }
      
      // Upload image
      const { data, error } = await supabase.storage
        .from('blog_images')
        .upload(`featured/${fileName}`, file);
      
      if (error) throw error;
      
      // Get public URL
      const imageUrl = supabase.storage.from('blog_images').getPublicUrl(`featured/${fileName}`).data.publicUrl;
      
      setBlog(prev => ({
        ...prev,
        featured_image: imageUrl
      }));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };
  
  const handleContentImageUpload = useCallback(async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);
  
  const saveBlog = async (publish = false) => {
    try {
      setIsLoading(true);
      
      if (!blog.title) {
        toast.error('Title is required');
        return;
      }
      
      if (!blog.slug) {
        toast.error('URL slug is required');
        return;
      }
      
      const blogData = {
        ...blog,
        published: publish,
        published_date: publish ? new Date().toISOString() : blog.published_date
      };
      
      const { data, error } = editMode 
        ? await supabase
            .from('blogs')
            .update(blogData)
            .eq('id', blog.id)
            .select()
        : await supabase
            .from('blogs')
            .insert(blogData)
            .select();
      
      if (error) throw error;
      
      toast.success(editMode ? 'Blog updated successfully' : 'Blog saved successfully');
      
      if (onSave) {
        onSave();
      } else {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePublish = () => saveBlog(true);
  
  const handleSaveDraft = () => saveBlog(false);
  
  const handleDelete = async () => {
    if (!editMode || !blog.id) return;
    
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blog.id);
      
      if (error) throw error;
      
      toast.success('Blog deleted successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Quill editor modules and formats
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['clean']
      ]
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editMode ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
              <TabsTrigger value="media">Featured Media</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={blog.title} 
                  onChange={handleChange} 
                  placeholder="Blog Title" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input 
                  id="author" 
                  name="author" 
                  value={blog.author} 
                  onChange={handleChange} 
                  placeholder="Author Name" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Press Enter to add)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {blog.tags?.map((tag, index) => (
                    <div 
                      key={index} 
                      className="bg-brand-green/10 text-brand-green px-2 py-1 rounded-full flex items-center"
                    >
                      {tag}
                      <button 
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <Input 
                  id="tagInput"
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)} 
                  onKeyDown={handleTagAdd}
                  placeholder="Add tag and press Enter" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <div className="h-96 border rounded-md">
                  <ReactQuill 
                    theme="snow" 
                    value={blog.content} 
                    onChange={handleContentChange} 
                    modules={modules}
                    className="h-80" 
                  />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex gap-2">
                  <Input 
                    id="slug" 
                    name="slug" 
                    value={blog.slug} 
                    onChange={handleChange} 
                    placeholder="url-slug" 
                  />
                  <Button type="button" onClick={handleSlugGenerate} variant="secondary">Generate</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea 
                  id="meta_description" 
                  name="meta_description" 
                  value={blog.meta_description} 
                  onChange={handleChange} 
                  placeholder="Meta description for SEO" 
                  className="h-20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schema_markup">Schema Markup (JSON-LD)</Label>
                <Textarea 
                  id="schema_markup" 
                  name="schema_markup" 
                  value={blog.schema_markup} 
                  onChange={handleChange} 
                  placeholder="Paste your article schema markup here" 
                  className="h-40 font-mono"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image</Label>
                <div className="flex flex-col gap-4">
                  {blog.featured_image && (
                    <div className="relative w-full max-w-md">
                      <img 
                        src={blog.featured_image} 
                        alt={blog.featured_image_alt || blog.title} 
                        className="w-full h-48 object-cover rounded-md border" 
                      />
                    </div>
                  )}
                  <Input 
                    id="featured_image_upload"
                    type="file" 
                    onChange={handleImageUpload} 
                    accept="image/*"
                    disabled={imageUploading}
                  />
                  <div className="text-sm text-gray-500">
                    {imageUploading ? 'Uploading...' : 'Max file size: 5MB'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="featured_image_alt">Image Alt Text</Label>
                <Input 
                  id="featured_image_alt" 
                  name="featured_image_alt" 
                  value={blog.featured_image_alt} 
                  onChange={handleChange} 
                  placeholder="Alt text for featured image" 
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-wrap gap-2 mt-8">
            <Button 
              onClick={handleSaveDraft}
              className="bg-white text-brand-green border border-brand-green shadow-md hover:shadow-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            
            <Button 
              onClick={handlePublish}
              className="bg-brand-green hover:bg-brand-green-dark text-white"
              disabled={isLoading}
            >
              {blog.published ? 'Update Published Post' : 'Publish Post'}
            </Button>
            
            {blog.published && (
              <Button 
                onClick={() => saveBlog(false)}
                variant="outline" 
                className="text-amber-500 border-amber-500 hover:bg-amber-50"
                disabled={isLoading}
              >
                Unpublish
              </Button>
            )}
            
            {editMode && (
              <Button 
                onClick={handleDelete}
                variant="outline" 
                className="text-red-500 border-red-500 hover:bg-red-50 ml-auto"
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogEditor;


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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Bold, Italic, Link as LinkIcon, Code, Image, Video, Save, Eye, Trash2, Search, Hash, Globe, Calendar, User, FileText, Settings } from 'lucide-react';
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
    schema_markup: '',
    // SEO Fields
    meta_title: '',
    meta_keywords: '',
    canonical_url: '',
    og_title: '',
    og_description: '',
    og_image: '',
    og_type: 'article',
    twitter_title: '',
    twitter_description: '',
    twitter_image: '',
    twitter_card: 'summary_large_image',
    // Content Settings
    excerpt: '',
    reading_time: 0,
    category: '',
    status: 'draft',
    featured: false,
    allow_comments: true,
    // Publishing Settings
    scheduled_date: '',
    visibility: 'public',
    password: '',
    // Advanced SEO
    robots_meta: 'index,follow',
    focus_keyword: '',
    readability_score: 0,
    seo_score: 0
  });
  
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlog(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setBlog(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setBlog(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleContentChange = (content: string) => {
    setBlog(prev => ({ ...prev, content }));
    // Calculate reading time (average 200 words per minute)
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    setBlog(prev => ({ ...prev, reading_time: readingTime }));
  };
  
  const handleSlugGenerate = () => {
    if (blog.title) {
      const slug = blog.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim('-');
      
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
  
  const handleKeywordAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keywordInput.trim() !== '') {
      e.preventDefault();
      const currentKeywords = blog.meta_keywords ? blog.meta_keywords.split(',').map(k => k.trim()) : [];
      if (!currentKeywords.includes(keywordInput.trim())) {
        const newKeywords = [...currentKeywords, keywordInput.trim()].join(', ');
        setBlog(prev => ({ ...prev, meta_keywords: newKeywords }));
      }
      setKeywordInput('');
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setImageUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${nanoid()}.${fileExt}`;
      
      const { data: bucket } = await supabase.storage.getBucket('blog_images');
      
      if (!bucket) {
        const { error: bucketError } = await supabase.storage.createBucket('blog_images', {
          public: true,
          fileSizeLimit: 5242880
        });
        
        if (bucketError) throw bucketError;
      }
      
      const { data, error } = await supabase.storage
        .from('blog_images')
        .upload(`featured/${fileName}`, file);
      
      if (error) throw error;
      
      const imageUrl = supabase.storage.from('blog_images').getPublicUrl(`featured/${fileName}`).data.publicUrl;
      
      setBlog(prev => ({
        ...prev,
        featured_image: imageUrl,
        og_image: imageUrl,
        twitter_image: imageUrl
      }));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };
  
  const saveBlog = async (publish = false) => {
    try {
      setIsLoading(true);
      
      if (!blog.title?.trim()) {
        toast.error('Title is required');
        return;
      }
      
      if (!blog.slug?.trim()) {
        toast.error('URL slug is required');
        return;
      }
      
      if (!blog.author?.trim()) {
        toast.error('Author is required');
        return;
      }
      
      if (!blog.content?.trim()) {
        toast.error('Content is required');
        return;
      }
      
      if (!blog.meta_description?.trim()) {
        toast.error('Meta description is required');
        return;
      }
      
      const blogData = {
        ...blog,
        published: publish,
        published_date: publish ? new Date().toISOString() : blog.published_date || null,
        status: publish ? 'published' : blog.status || 'draft'
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
  
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['blockquote', 'code-block'],
        ['clean']
      ]
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {editMode ? 'Edit Blog Post' : 'Create New Blog Post'}
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setPreviewMode(!previewMode)}
                size="sm"
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="content" className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-1">
                <Search className="w-4 h-4" />
                SEO
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                Social
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center gap-1">
                <Image className="w-4 h-4" />
                Media
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                Advanced
              </TabsTrigger>
            </TabsList>
            
            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={blog.title || ''} 
                      onChange={handleChange} 
                      placeholder="Enter blog title" 
                      className="text-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="slug" 
                        name="slug" 
                        value={blog.slug || ''} 
                        onChange={handleChange} 
                        placeholder="url-slug" 
                      />
                      <Button type="button" onClick={handleSlugGenerate} variant="secondary" size="sm">
                        Generate
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea 
                      id="excerpt" 
                      name="excerpt" 
                      value={blog.excerpt || ''} 
                      onChange={handleChange} 
                      placeholder="Brief description of the post" 
                      className="h-20"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input 
                      id="author" 
                      name="author" 
                      value={blog.author || ''} 
                      onChange={handleChange} 
                      placeholder="Author name" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={blog.category || ''} onValueChange={(value) => handleSelectChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                        <SelectItem value="therapy">Therapy Techniques</SelectItem>
                        <SelectItem value="cupping">Cupping Therapy</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="news">News & Updates</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reading_time">Reading Time (minutes)</Label>
                    <Input 
                      id="reading_time" 
                      name="reading_time" 
                      type="number"
                      value={blog.reading_time || 0} 
                      onChange={handleChange} 
                      placeholder="Auto-calculated"
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Press Enter to add)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {blog.tags?.map((tag, index) => (
                    <div 
                      key={index} 
                      className="bg-brand-green/10 text-brand-green px-3 py-1 rounded-full flex items-center text-sm"
                    >
                      <Hash className="w-3 h-3 mr-1" />
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
                <Label htmlFor="content">Content *</Label>
                <div className="h-96 border rounded-md">
                  <ReactQuill 
                    theme="snow" 
                    value={blog.content || ''} 
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
            
            {/* SEO Tab */}
            <TabsContent value="seo" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">SEO Title</Label>
                    <Input 
                      id="meta_title" 
                      name="meta_title" 
                      value={blog.meta_title || ''} 
                      onChange={handleChange} 
                      placeholder="Custom SEO title (defaults to post title)" 
                    />
                    <p className="text-xs text-gray-500">Recommended: 50-60 characters</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description *</Label>
                    <Textarea 
                      id="meta_description" 
                      name="meta_description" 
                      value={blog.meta_description || ''} 
                      onChange={handleChange} 
                      placeholder="Meta description for search engines" 
                      className="h-20"
                    />
                    <p className="text-xs text-gray-500">Recommended: 150-160 characters</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="focus_keyword">Focus Keyword</Label>
                    <Input 
                      id="focus_keyword" 
                      name="focus_keyword" 
                      value={blog.focus_keyword || ''} 
                      onChange={handleChange} 
                      placeholder="Primary keyword for this post" 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_keywords">Meta Keywords (Press Enter to add)</Label>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {blog.meta_keywords?.split(',').filter(k => k.trim()).map((keyword, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {keyword.trim()}
                        </span>
                      ))}
                    </div>
                    <Input 
                      id="keywordInput"
                      value={keywordInput} 
                      onChange={(e) => setKeywordInput(e.target.value)} 
                      onKeyDown={handleKeywordAdd}
                      placeholder="Add keyword and press Enter" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="canonical_url">Canonical URL</Label>
                    <Input 
                      id="canonical_url" 
                      name="canonical_url" 
                      value={blog.canonical_url || ''} 
                      onChange={handleChange} 
                      placeholder="https://example.com/canonical-url" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="robots_meta">Robots Meta</Label>
                    <Select value={blog.robots_meta || 'index,follow'} onValueChange={(value) => handleSelectChange('robots_meta', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="index,follow">Index, Follow</SelectItem>
                        <SelectItem value="noindex,follow">No Index, Follow</SelectItem>
                        <SelectItem value="index,nofollow">Index, No Follow</SelectItem>
                        <SelectItem value="noindex,nofollow">No Index, No Follow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Social Media Tab */}
            <TabsContent value="social" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Open Graph (Facebook)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="og_title">OG Title</Label>
                      <Input 
                        id="og_title" 
                        name="og_title" 
                        value={blog.og_title || ''} 
                        onChange={handleChange} 
                        placeholder="Facebook title (defaults to post title)" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="og_description">OG Description</Label>
                      <Textarea 
                        id="og_description" 
                        name="og_description" 
                        value={blog.og_description || ''} 
                        onChange={handleChange} 
                        placeholder="Facebook description" 
                        className="h-16"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="og_type">OG Type</Label>
                      <Select value={blog.og_type || 'article'} onValueChange={(value) => handleSelectChange('og_type', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">Article</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="blog">Blog</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Twitter Card</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="twitter_title">Twitter Title</Label>
                      <Input 
                        id="twitter_title" 
                        name="twitter_title" 
                        value={blog.twitter_title || ''} 
                        onChange={handleChange} 
                        placeholder="Twitter title (defaults to post title)" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="twitter_description">Twitter Description</Label>
                      <Textarea 
                        id="twitter_description" 
                        name="twitter_description" 
                        value={blog.twitter_description || ''} 
                        onChange={handleChange} 
                        placeholder="Twitter description" 
                        className="h-16"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="twitter_card">Twitter Card Type</Label>
                      <Select value={blog.twitter_card || 'summary_large_image'} onValueChange={(value) => handleSelectChange('twitter_card', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary</SelectItem>
                          <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                          <SelectItem value="app">App</SelectItem>
                          <SelectItem value="player">Player</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="featured_image">Featured Image</Label>
                  <div className="flex flex-col gap-4">
                    {blog.featured_image && (
                      <div className="relative w-full max-w-md">
                        <img 
                          src={blog.featured_image} 
                          alt={blog.featured_image_alt || blog.title || 'Featured image'} 
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
                      {imageUploading ? 'Uploading...' : 'Max file size: 5MB. Recommended: 1200x630px for social sharing'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="featured_image_alt">Image Alt Text</Label>
                  <Input 
                    id="featured_image_alt" 
                    name="featured_image_alt" 
                    value={blog.featured_image_alt || ''} 
                    onChange={handleChange} 
                    placeholder="Describe the image for accessibility" 
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="og_image">Open Graph Image URL</Label>
                    <Input 
                      id="og_image" 
                      name="og_image" 
                      value={blog.og_image || ''} 
                      onChange={handleChange} 
                      placeholder="Custom OG image URL" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter_image">Twitter Image URL</Label>
                    <Input 
                      id="twitter_image" 
                      name="twitter_image" 
                      value={blog.twitter_image || ''} 
                      onChange={handleChange} 
                      placeholder="Custom Twitter image URL" 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Publishing Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Post Status</Label>
                      <Select value={blog.status || 'draft'} onValueChange={(value) => handleSelectChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select value={blog.visibility || 'public'} onValueChange={(value) => handleSelectChange('visibility', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="password">Password Protected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {blog.visibility === 'password' && (
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          name="password" 
                          type="password"
                          value={blog.password || ''} 
                          onChange={handleChange} 
                          placeholder="Enter password" 
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="scheduled_date">Scheduled Date</Label>
                      <Input 
                        id="scheduled_date" 
                        name="scheduled_date" 
                        type="datetime-local"
                        value={blog.scheduled_date || ''} 
                        onChange={handleChange} 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Content Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="featured" 
                        checked={blog.featured || false}
                        onCheckedChange={(checked) => handleCheckboxChange('featured', checked as boolean)}
                      />
                      <Label htmlFor="featured">Featured Post</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="allow_comments" 
                        checked={blog.allow_comments !== false}
                        onCheckedChange={(checked) => handleCheckboxChange('allow_comments', checked as boolean)}
                      />
                      <Label htmlFor="allow_comments">Allow Comments</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>SEO Score</Label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${blog.seo_score || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{blog.seo_score || 0}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Readability Score</Label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${blog.readability_score || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{blog.readability_score || 0}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schema_markup">Schema Markup (JSON-LD)</Label>
                  <Textarea 
                    id="schema_markup" 
                    name="schema_markup" 
                    value={blog.schema_markup || ''} 
                    onChange={handleChange} 
                    placeholder="Paste your article schema markup here" 
                    className="h-40 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Add structured data markup for better search engine understanding
                  </p>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Auto-generated Schema Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-50 p-4 rounded text-xs overflow-auto max-h-40">
{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${blog.title || 'Your Blog Title'}",
  "description": "${blog.meta_description || 'Your blog description'}",
  "author": {
    "@type": "Person",
    "name": "${blog.author || 'Author Name'}"
  },
  "datePublished": "${blog.published_date || new Date().toISOString()}",
  "image": "${blog.featured_image || 'https://example.com/image.jpg'}",
  "publisher": {
    "@type": "Organization",
    "name": "Your Site Name"
  }
}`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t">
            <Button 
              onClick={handleSaveDraft}
              variant="outline"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
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
                className="text-amber-600 border-amber-600 hover:bg-amber-50"
                disabled={isLoading}
              >
                Unpublish
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={() => navigate('/admin/dashboard')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            
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

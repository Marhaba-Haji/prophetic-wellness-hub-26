import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/sonner';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/supabase-types';
import dynamic from 'next/dynamic';

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

// Import the CSS only on the client side
const QuillCSS = () => {
  useEffect(() => {
    // This will only run on the client
    import('react-quill/dist/quill.snow.css');
  }, []);
  
  return null;
};

const AdminBlogEditor = () => {
  // Basic fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState('');
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [status, setStatus] = useState('draft');
  
  // SEO fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [robotsMeta, setRobotsMeta] = useState('index, follow');
  
  // Open Graph fields
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogType, setOgType] = useState('article');
  
  // Twitter fields
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  
  // Schema markup
  const [schemaMarkup, setSchemaMarkup] = useState('');
  
  // Other states
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();

  // Rich text editor modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image', 'video', 'blockquote', 'code-block'
  ];

  useEffect(() => {
    if (blogId && initialLoad) {
      fetchBlog(blogId);
      setInitialLoad(false);
    }
  }, [blogId, initialLoad]);

  const fetchBlog = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setAuthor(data.author);
        setTags(data.tags || []);
        setContent(data.content);
        setExcerpt(data.excerpt || '');
        setCategory(data.category || '');
        setFeaturedImage(data.featured_image || '');
        setFeaturedImageAlt(data.featured_image_alt || '');
        setPublished(data.published);
        setFeatured(data.featured || false);
        setAllowComments(data.allow_comments !== false);
        setStatus(data.status || 'draft');
        
        // SEO fields
        setMetaTitle(data.meta_title || '');
        setMetaDescription(data.meta_description || '');
        setMetaKeywords(data.meta_keywords || '');
        setCanonicalUrl(data.canonical_url || '');
        setFocusKeyword(data.focus_keyword || '');
        setRobotsMeta(data.robots_meta || 'index, follow');
        
        // Open Graph fields
        setOgTitle(data.og_title || '');
        setOgDescription(data.og_description || '');
        setOgImage(data.og_image || '');
        setOgType(data.og_type || 'article');
        
        // Twitter fields
        setTwitterTitle(data.twitter_title || '');
        setTwitterDescription(data.twitter_description || '');
        setTwitterImage(data.twitter_image || '');
        setTwitterCard(data.twitter_card || 'summary_large_image');
        
        setSchemaMarkup(data.schema_markup || '');
      } else {
        toast.error('Blog post not found');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !slug || !author || !content || !metaDescription) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const blogPost: Omit<BlogPost, 'id' | 'created_at'> = {
        title,
        slug,
        author,
        tags,
        meta_description: metaDescription,
        content,
        excerpt,
        category,
        featured_image: featuredImage || null,
        featured_image_alt: featuredImageAlt || null,
        published,
        published_date: published ? new Date().toISOString() : null,
        featured,
        allow_comments: allowComments,
        status,
        
        // SEO fields
        meta_title: metaTitle || null,
        meta_keywords: metaKeywords || null,
        canonical_url: canonicalUrl || null,
        focus_keyword: focusKeyword || null,
        robots_meta: robotsMeta || null,
        
        // Open Graph fields
        og_title: ogTitle || null,
        og_description: ogDescription || null,
        og_image: ogImage || null,
        og_type: ogType || null,
        
        // Twitter fields
        twitter_title: twitterTitle || null,
        twitter_description: twitterDescription || null,
        twitter_image: twitterImage || null,
        twitter_card: twitterCard || null,
        
        schema_markup: schemaMarkup || null,
        reading_time: Math.ceil(content.split(' ').length / 200),
        visibility: 'public',
        readability_score: null,
        seo_score: null,
        scheduled_date: null,
        password: null
      };

      let data, error;
      if (blogId) {
        // UPDATE
        ({ data, error } = await supabase
          .from('blogs')
          .update(blogPost)
          .eq('id', blogId)
          .select()
          .single());
      } else {
        // INSERT
        ({ data, error } = await supabase
          .from('blogs')
          .insert(blogPost)
          .select()
          .single());
      }

      if (error) throw error;

      toast.success(`Blog post ${blogId ? 'updated' : 'created'} successfully!`);

      if (!blogId && data?.id) {
        navigate(`/admin/blog/edit/${data.id}`);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      toast.error('Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <QuillCSS />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{blogId ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewMode((p) => !p)}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="bg-brand-green hover:bg-brand-green-dark text-white"
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4 mt-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={previewMode}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={previewMode}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={previewMode}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={previewMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="treatment">Treatment</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="guidance">Guidance</SelectItem>
                  <SelectItem value="islamic-medicine">Islamic Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                disabled={previewMode}
                placeholder="Brief description of the blog post"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags.join(', ')}
                onChange={e =>
                  setTags(
                    e.target.value
                      .split(',')
                      .map(tag => tag.trim())
                      .filter(Boolean)
                  )
                }
                disabled={previewMode}
                placeholder="Add tags separated by comma"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="featuredImage">Featured Image URL</Label>
              <Input
                id="featuredImage"
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                disabled={previewMode}
                placeholder="Optional"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="featuredImageAlt">Featured Image Alt Text</Label>
              <Input
                id="featuredImageAlt"
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                disabled={previewMode}
                placeholder="Alt text for the featured image"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Content *</Label>
              {!previewMode && typeof window !== 'undefined' ? (
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  style={{ height: '400px', marginBottom: '50px' }}
                />
              ) : (
                <div 
                  className="min-h-[400px] p-4 border rounded-md bg-white prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }} 
                />
              )}
            </div>
            
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="published">Published</Label>
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={(checked) => setPublished(checked)}
                  disabled={previewMode}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="featured">Featured</Label>
                <Switch
                  id="featured"
                  checked={featured}
                  onCheckedChange={(checked) => setFeatured(checked)}
                  disabled={previewMode}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="allowComments">Allow Comments</Label>
                <Switch
                  id="allowComments"
                  checked={allowComments}
                  onCheckedChange={(checked) => setAllowComments(checked)}
                  disabled={previewMode}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="seo" className="space-y-4 mt-6">
            <div className="grid gap-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                disabled={previewMode}
                placeholder="SEO title (if different from main title)"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="metaDescription">Meta Description *</Label>
              <Textarea
                id="metaDescription"
                value={metaDescription}
                onChange={e => setMetaDescription(e.target.value)}
                disabled={previewMode}
                placeholder="Meta description for SEO"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
                disabled={previewMode}
                placeholder="SEO keywords separated by commas"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="focusKeyword">Focus Keyword</Label>
              <Input
                id="focusKeyword"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                disabled={previewMode}
                placeholder="Primary keyword for this post"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                disabled={previewMode}
                placeholder="Canonical URL (if different from default)"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="robotsMeta">Robots Meta</Label>
              <Select value={robotsMeta} onValueChange={setRobotsMeta} disabled={previewMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="index, follow">Index, Follow</SelectItem>
                  <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                  <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                  <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Open Graph (Facebook)</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="ogTitle">OG Title</Label>
              <Input
                id="ogTitle"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                disabled={previewMode}
                placeholder="Title for social media sharing"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ogDescription">OG Description</Label>
              <Textarea
                id="ogDescription"
                value={ogDescription}
                onChange={e => setOgDescription(e.target.value)}
                disabled={previewMode}
                placeholder="Description for social media sharing"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ogImage">OG Image</Label>
              <Input
                id="ogImage"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                disabled={previewMode}
                placeholder="Image URL for social media sharing"
              />
            </div>
            
            <h3 className="text-lg font-semibold mt-6">Twitter</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="twitterTitle">Twitter Title</Label>
              <Input
                id="twitterTitle"
                value={twitterTitle}
                onChange={(e) => setTwitterTitle(e.target.value)}
                disabled={previewMode}
                placeholder="Title for Twitter sharing"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="twitterDescription">Twitter Description</Label>
              <Textarea
                id="twitterDescription"
                value={twitterDescription}
                onChange={e => setTwitterDescription(e.target.value)}
                disabled={previewMode}
                placeholder="Description for Twitter sharing"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="twitterImage">Twitter Image</Label>
              <Input
                id="twitterImage"
                value={twitterImage}
                onChange={(e) => setTwitterImage(e.target.value)}
                disabled={previewMode}
                placeholder="Image URL for Twitter sharing"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="twitterCard">Twitter Card Type</Label>
              <Select value={twitterCard} onValueChange={setTwitterCard} disabled={previewMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 mt-6">
            <div className="grid gap-2">
              <Label htmlFor="schemaMarkup">Schema Markup (JSON-LD)</Label>
              <Textarea
                id="schemaMarkup"
                value={schemaMarkup}
                onChange={e => setSchemaMarkup(e.target.value)}
                disabled={previewMode}
                placeholder="JSON-LD structured data for rich snippets"
                rows={8}
                className="font-mono"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminBlogEditor;
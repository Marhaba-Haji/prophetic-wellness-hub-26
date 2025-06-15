
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from "@/components/ui/switch"
import { toast } from '@/components/ui/sonner';
import { Editor } from '@tinymce/tinymce-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/supabase-types';

const AdminBlogEditor = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState('');
  const [published, setPublished] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const editorRef = React.useRef<any>(null);
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();

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
        setMetaDescription(data.meta_description || '');
        setFeaturedImage(data.featured_image || '');
        setPublished(data.published);
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
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const blogPost: Omit<BlogPost, 'id' | 'created_at' | 'published_date'> = {
        title,
        slug,
        author,
        tags,
        meta_description: metaDescription,
        content,
        featured_image: featuredImage || null,
        published,
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{blogId ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPreviewMode((p) => !p)}
            className="ml-2"
          >
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="ml-2 bg-brand-green hover:bg-brand-green-dark text-white"
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={previewMode}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={previewMode}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={previewMode}
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
          <Label htmlFor="metaDesc">Meta Description</Label>
          <Textarea
            id="metaDesc"
            value={metaDescription}
            onChange={e => setMetaDescription(e.target.value)}
            disabled={previewMode}
            placeholder="Meta description for SEO"
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
          <Label htmlFor="content">Content</Label>
          {!previewMode ? (
            <Editor
              apiKey="YOUR_API_KEY"
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={content}
              onEditorChange={(newContent) => setContent(newContent)}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="published">Published</Label>
          <Switch
            id="published"
            checked={published}
            onCheckedChange={(checked) => setPublished(checked)}
            disabled={previewMode}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminBlogEditor;

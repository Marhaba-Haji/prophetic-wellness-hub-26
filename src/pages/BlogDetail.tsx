import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Tag, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/supabase-types';
import { toast } from '@/components/ui/sonner';

// Simplified interface for recent and related posts
interface SimpleBlogPost {
  id: string;
  title: string;
  slug: string;
  published_date: string | null;
  featured_image: string | null;
  category?: string | null;
}
const BlogDetail = () => {
  const {
    blogSlug
  } = useParams<{
    blogSlug: string;
  }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<SimpleBlogPost[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<SimpleBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  useEffect(() => {
    if (blogSlug) {
      fetchBlogPost();
      fetchRecentPosts();
    }
  }, [blogSlug]);
  useEffect(() => {
    if (blog) {
      fetchRelatedPosts();
    }
  }, [blog]);
  const fetchBlogPost = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('blogs').select('*').eq('slug', blogSlug).eq('published', true).single();
      if (error) throw error;
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Blog post not found');
    }
  };
  const fetchRecentPosts = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('blogs').select('id, title, slug, published_date, featured_image').eq('published', true).neq('slug', blogSlug).order('published_date', {
        ascending: false
      }).limit(5);
      if (error) throw error;
      setRecentPosts(data || []);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };
  const fetchRelatedPosts = async () => {
    if (!blog) return;
    try {
      const {
        data,
        error
      } = await supabase.from('blogs').select('id, title, slug, published_date, featured_image, category').eq('published', true).eq('category', blog.category).neq('slug', blogSlug).limit(3);
      if (error) throw error;
      setRelatedPosts(data || []);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Recently';
    }
  };
  const getValidImageUrl = (url: string | null) => {
    if (!url) return null;

    // Handle various image hosting services
    if (url.includes('imgbb.com')) {
      // For imgbb, ensure we have a direct image URL
      if (url.includes('/image/') && !url.includes('.jpg') && !url.includes('.png') && !url.includes('.jpeg') && !url.includes('.gif') && !url.includes('.webp')) {
        // Try to construct direct image URL by adding common extension
        return url + '.jpg';
      }
      // If it already has an extension or is a direct link, use as is
      if (url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg') || url.includes('.gif') || url.includes('.webp')) {
        return url;
      }
    }

    // Basic URL validation
    try {
      new URL(url);
      return url;
    } catch {
      return null;
    }
  };
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  const handleImageLoad = () => {
    setImageError(false);
    setImageLoading(false);
  };
  const generateSchemaMarkup = () => {
    if (!blog) return '';
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.meta_description || blog.excerpt,
      "image": getValidImageUrl(blog.featured_image) || getValidImageUrl(blog.og_image),
      "author": {
        "@type": "Person",
        "name": blog.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Hijama Healing"
      },
      "datePublished": blog.published_date,
      "dateModified": blog.created_at,
      "keywords": blog.meta_keywords || blog.tags?.join(', '),
      "url": `${window.location.origin}/blog/${blog.slug}`
    };
    return JSON.stringify(schema);
  };
  if (loading) {
    return <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
          </div>
        </div>
      </Layout>;
  }
  if (!blog) {
    return <Layout>
        <Helmet>
          <title>Blog post not found - Hijama Healing</title>
          <meta name="description" content="The requested blog post could not be found." />
        </Helmet>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog post not found</h1>
            <Link to="/blog">
              <Button variant="outline" className="border-brand-green text-brand-green">
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </Layout>;
  }
  const validImageUrl = getValidImageUrl(blog.featured_image);
  const currentUrl = `${window.location.origin}/blog/${blog.slug}`;
  return <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{blog.meta_title || `${blog.title} - Hijama Healing`}</title>
        <meta name="description" content={blog.meta_description || blog.excerpt || `Read about ${blog.title} on Hijama Healing`} />
        {blog.meta_keywords && <meta name="keywords" content={blog.meta_keywords} />}
        {blog.canonical_url && <link rel="canonical" href={blog.canonical_url} />}
        {!blog.canonical_url && <link rel="canonical" href={currentUrl} />}
        {blog.robots_meta && <meta name="robots" content={blog.robots_meta} />}
        {!blog.robots_meta && <meta name="robots" content="index, follow" />}
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={blog.og_title || blog.meta_title || blog.title} />
        <meta property="og:description" content={blog.og_description || blog.meta_description || blog.excerpt || `Read about ${blog.title} on Hijama Healing`} />
        <meta property="og:type" content={blog.og_type || 'article'} />
        <meta property="og:url" content={currentUrl} />
        {(blog.og_image || validImageUrl) && <meta property="og:image" content={blog.og_image || validImageUrl || ''} />}
        <meta property="og:site_name" content="Hijama Healing" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content={blog.twitter_card || 'summary_large_image'} />
        <meta name="twitter:title" content={blog.twitter_title || blog.meta_title || blog.title} />
        <meta name="twitter:description" content={blog.twitter_description || blog.meta_description || blog.excerpt || `Read about ${blog.title} on Hijama Healing`} />
        {(blog.twitter_image || blog.og_image || validImageUrl) && <meta name="twitter:image" content={blog.twitter_image || blog.og_image || validImageUrl || ''} />}
        
        {/* Article Specific Meta Tags */}
        <meta property="article:author" content={blog.author} />
        {blog.published_date && <meta property="article:published_time" content={blog.published_date} />}
        {blog.category && <meta property="article:section" content={blog.category} />}
        {blog.tags && blog.tags.map((tag, index) => <meta key={index} property="article:tag" content={tag} />)}
        
        {/* Schema Markup */}
        <script type="application/ld+json">
          {blog.schema_markup || generateSchemaMarkup()}
        </script>
      </Helmet>
      
      <Layout>
        
      </Layout>
    </>;
};
export default BlogDetail;
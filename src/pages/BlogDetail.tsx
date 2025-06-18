
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
  const { blogSlug } = useParams<{ blogSlug: string }>();
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
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', blogSlug)
        .eq('published', true)
        .single();

      if (error) throw error;
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Blog post not found');
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, published_date, featured_image')
        .eq('published', true)
        .neq('slug', blogSlug)
        .order('published_date', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentPosts(data || []);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

  const fetchRelatedPosts = async () => {
    if (!blog) return;

    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, title, slug, published_date, featured_image, category')
        .eq('published', true)
        .eq('category', blog.category)
        .neq('slug', blogSlug)
        .limit(3);

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
    
    // Handle imgbb URLs - ensure they end with image extension
    if (url.includes('imgbb.com')) {
      // If it's an imgbb URL but doesn't contain a direct image path, it's likely invalid
      if (!url.includes('.jpg') && !url.includes('.png') && !url.includes('.jpeg') && !url.includes('.gif') && !url.includes('.webp')) {
        return null;
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
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  const validImageUrl = getValidImageUrl(blog.featured_image);
  const currentUrl = `${window.location.origin}/blog/${blog.slug}`;

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{blog.meta_title || blog.title}</title>
        <meta name="description" content={blog.meta_description} />
        {blog.meta_keywords && <meta name="keywords" content={blog.meta_keywords} />}
        {blog.canonical_url && <link rel="canonical" href={blog.canonical_url} />}
        {blog.robots_meta && <meta name="robots" content={blog.robots_meta} />}
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={blog.og_title || blog.meta_title || blog.title} />
        <meta property="og:description" content={blog.og_description || blog.meta_description} />
        <meta property="og:type" content={blog.og_type || 'article'} />
        <meta property="og:url" content={currentUrl} />
        {(blog.og_image || validImageUrl) && (
          <meta property="og:image" content={blog.og_image || validImageUrl} />
        )}
        <meta property="og:site_name" content="Hijama Healing" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content={blog.twitter_card || 'summary_large_image'} />
        <meta name="twitter:title" content={blog.twitter_title || blog.meta_title || blog.title} />
        <meta name="twitter:description" content={blog.twitter_description || blog.meta_description} />
        {(blog.twitter_image || blog.og_image || validImageUrl) && (
          <meta name="twitter:image" content={blog.twitter_image || blog.og_image || validImageUrl} />
        )}
        
        {/* Article Specific Meta Tags */}
        <meta property="article:author" content={blog.author} />
        {blog.published_date && <meta property="article:published_time" content={blog.published_date} />}
        {blog.category && <meta property="article:section" content={blog.category} />}
        {blog.tags && blog.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* Schema Markup */}
        {(blog.schema_markup || generateSchemaMarkup()) && (
          <script type="application/ld+json">
            {blog.schema_markup || generateSchemaMarkup()}
          </script>
        )}
      </Helmet>
      
      <Layout>
        <div className="bg-gray-50 min-h-screen py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="mb-6">
                  <Link to="/blog" className="inline-flex items-center text-brand-green hover:text-brand-green-light transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blog
                  </Link>
                </div>

                <Card className="bg-white shadow-sm">
                  <CardContent className="p-8">
                    {validImageUrl && !imageError && (
                      <div className="mb-8 overflow-hidden rounded-lg">
                        {imageLoading && (
                          <div className="w-full h-64 md:h-80 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Loading image...</span>
                          </div>
                        )}
                        <img
                          src={validImageUrl}
                          alt={blog.featured_image_alt || blog.title}
                          className={`w-full h-64 md:h-80 object-cover transition-opacity duration-300 ${
                            imageLoading ? 'opacity-0 absolute' : 'opacity-100'
                          }`}
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                        />
                      </div>
                    )}

                    {(imageError || !validImageUrl) && blog.featured_image && (
                      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          <strong>Image URL Issue:</strong> The featured image URL appears to be invalid.
                        </p>
                        <p className="text-yellow-700 text-xs mt-1">
                          Current URL: {blog.featured_image}
                        </p>
                      </div>
                    )}

                    <div className="mb-6">
                      <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4">
                        <span className="flex items-center mr-6 mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(blog.published_date)}
                        </span>
                        <span className="flex items-center mr-6 mb-2">
                          <User className="h-4 w-4 mr-2" />
                          {blog.author}
                        </span>
                        {blog.reading_time && (
                          <span className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-2" />
                            {blog.reading_time} min read
                          </span>
                        )}
                      </div>

                      <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-4">
                        {blog.title}
                      </h1>

                      {blog.excerpt && (
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      )}

                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                          {blog.tags.map((tag, i) => (
                            <span 
                              key={i} 
                              className="inline-flex items-center text-sm bg-brand-green/10 text-brand-green px-3 py-1 rounded-full"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div 
                      className="prose prose-lg max-w-none prose-headings:text-brand-green prose-links:text-brand-green prose-links:no-underline hover:prose-links:underline"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* CTA Card */}
                  <Card className="bg-brand-green text-white">
                    <CardHeader>
                      <CardTitle className="text-white">Ready to Experience Hijama?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-green-100 mb-4">
                        Book your professional hijama therapy session today and start your journey to better health.
                      </p>
                      <Link to="/booking-appointment">
                        <Button className="w-full bg-white text-brand-green hover:bg-gray-100">
                          Book Appointment
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Recent Posts */}
                  {recentPosts.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-brand-green">Recent Articles</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {recentPosts.map((post) => (
                          <Link 
                            key={post.id} 
                            to={`/blog/${post.slug}`}
                            className="block group"
                          >
                            <div className="flex gap-3">
                              {getValidImageUrl(post.featured_image) && (
                                <img 
                                  src={getValidImageUrl(post.featured_image)!} 
                                  alt={post.title}
                                  className="w-16 h-16 object-cover rounded flex-shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 group-hover:text-brand-green transition-colors line-clamp-2">
                                  {post.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(post.published_date)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Related Posts by Category */}
                  {relatedPosts.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-brand-green">
                          More in {blog.category?.replace('-', ' ')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {relatedPosts.map((post) => (
                          <Link 
                            key={post.id} 
                            to={`/blog/${post.slug}`}
                            className="block group"
                          >
                            <div className="flex gap-3">
                              {getValidImageUrl(post.featured_image) && (
                                <img 
                                  src={getValidImageUrl(post.featured_image)!} 
                                  alt={post.title}
                                  className="w-16 h-16 object-cover rounded flex-shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 group-hover:text-brand-green transition-colors line-clamp-2">
                                  {post.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(post.published_date)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                        
                        <Link to={`/blog?category=${blog.category}`}>
                          <Button variant="outline" size="sm" className="w-full mt-4 border-brand-green text-brand-green">
                            View All in {blog.category?.replace('-', ' ')}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default BlogDetail;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/supabase-types";
import { toast } from "@/components/ui/sonner";

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
  const router = useNavigate();
  const location = useLocation();
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<SimpleBlogPost[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<SimpleBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
      fetchRecentPosts();
    }
  }, [slug]);

  useEffect(() => {
    if (blog) {
      fetchRelatedPosts();
    }
  }, [blog]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) throw error;

      setBlog(data);
      console.log("Blog data fetched:", data);
      console.log("Featured image URL from database:", data.featured_image);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      toast.error("Blog post not found");
    }
  };

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, published_date, featured_image")
        .eq("published", true)
        .neq("slug", slug)
        .order("published_date", { ascending: false })
        .limit(5);

      if (error) throw error;

      setRecentPosts(data || []);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
    }
  };

  const fetchRelatedPosts = async () => {
    if (!blog) return;

    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, published_date, featured_image, category")
        .eq("published", true)
        .eq("category", blog.category)
        .neq("slug", slug)
        .limit(3);

      if (error) throw error;

      setRelatedPosts(data || []);
    } catch (error) {
      console.error("Error fetching related posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Recently";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Recently";
    }
  };

  const fixImgBBUrl = (url: string) => {
    console.log("Original URL:", url);

    // If it's already a proper direct ImgBB URL, return as is
    if (url.includes("i.ibb.co/") && !url.includes("/f/")) {
      console.log("URL is already in correct format:", url);
      return url;
    }

    // Extract the image ID from various ImgBB URL formats
    let imageId = "";

    // Handle format: https://ibb.co/f/xxxxxxx
    const fMatch = url.match(/ibb\.co\/f\/([a-zA-Z0-9]+)/);
    if (fMatch) {
      imageId = fMatch[1];
      console.log("Extracted image ID from /f/ format:", imageId);
    }

    // Handle format: https://ibb.co/xxxxxxx
    const directMatch = url.match(/ibb\.co\/([a-zA-Z0-9]+)$/);
    if (directMatch && !imageId) {
      imageId = directMatch[1];
      console.log("Extracted image ID from direct format:", imageId);
    }

    // If we found an image ID, construct the direct URL
    if (imageId) {
      const directUrl = `https://i.ibb.co/${imageId}`;
      console.log("Converted to direct URL:", directUrl);
      return directUrl;
    }
    console.log("Could not convert URL, returning original:", url);
    return url;
  };

  const getValidImageUrl = (url: string | null) => {
    if (!url) {
      console.log("No URL provided");
      return null;
    }
    console.log("Processing image URL:", url);

    // Basic URL validation
    try {
      new URL(url);

      // Fix ImgBB URLs if needed
      if (url.includes("ibb.co")) {
        const fixedUrl = fixImgBBUrl(url);
        console.log("Fixed ImgBB URL:", fixedUrl);
        return fixedUrl;
      }
      console.log("Valid URL detected:", url);
      return url;
    } catch {
      console.log("Invalid URL format:", url);
      return null;
    }
  };

  const handleImageError = () => {
    console.log("Image failed to load");
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully");
    setImageError(false);
    setImageLoading(false);
  };

  const generateSchemaMarkup = () => {
    if (!blog) return "";
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      description: blog.meta_description || blog.excerpt,
      image:
        getValidImageUrl(blog.featured_image) ||
        getValidImageUrl(blog.og_image),
      author: {
        "@type": "Person",
        name: blog.author,
      },
      publisher: {
        "@type": "Organization",
        name: "Hijama Healing",
      },
      datePublished: blog.published_date,
      dateModified: blog.created_at,
      keywords: blog.meta_keywords || blog.tags?.join(", "),
      url: `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${blog.slug}`,
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
          <meta
            name="description"
            content="The requested blog post could not be found."
          />
        </Helmet>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Blog post not found
            </h1>
          </div>
        </div>
      </Layout>
    );
  }

  const validImageUrl = getValidImageUrl(blog.featured_image);
  const currentUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${blog.slug}`;

  console.log("SEO Debug - Blog data:", {
    meta_title: blog.meta_title,
    title: blog.title,
    meta_description: blog.meta_description,
    excerpt: blog.excerpt,
    og_title: blog.og_title,
    og_description: blog.og_description,
    featured_image: blog.featured_image,
    og_image: blog.og_image,
  });

  return (
    <Layout>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{blog.meta_title || `${blog.title} - Hijama Healing`}</title>
        <meta
          name="description"
          content={
            blog.meta_description ||
            blog.excerpt ||
            `Read about ${blog.title} on Hijama Healing`
          }
        />
        {blog.meta_keywords && (
          <meta name="keywords" content={blog.meta_keywords} />
        )}
        {blog.canonical_url && (
          <link rel="canonical" href={blog.canonical_url} />
        )}
        {!blog.canonical_url && <link rel="canonical" href={currentUrl} />}
        {blog.robots_meta && <meta name="robots" content={blog.robots_meta} />}
        {!blog.robots_meta && <meta name="robots" content="index, follow" />}

        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content={blog.og_title || blog.meta_title || blog.title}
        />
        <meta
          property="og:description"
          content={
            blog.og_description ||
            blog.meta_description ||
            blog.excerpt ||
            `Read about ${blog.title} on Hijama Healing`
          }
        />
        <meta property="og:type" content={blog.og_type || "article"} />
        <meta property="og:url" content={currentUrl} />
        {(blog.og_image || validImageUrl) && (
          <meta
            property="og:image"
            content={blog.og_image || validImageUrl || ""}
          />
        )}
        <meta property="og:site_name" content="Hijama Healing" />

        {/* Twitter Card Meta Tags */}
        <meta
          name="twitter:card"
          content={blog.twitter_card || "summary_large_image"}
        />
        <meta
          name="twitter:title"
          content={blog.twitter_title || blog.meta_title || blog.title}
        />
        <meta
          name="twitter:description"
          content={
            blog.twitter_description ||
            blog.meta_description ||
            blog.excerpt ||
            `Read about ${blog.title} on Hijama Healing`
          }
        />
        {(blog.twitter_image || blog.og_image || validImageUrl) && (
          <meta
            name="twitter:image"
            content={blog.twitter_image || blog.og_image || validImageUrl || ""}
          />
        )}

        {/* Article Specific Meta Tags */}
        <meta property="article:author" content={blog.author} />
        {blog.published_date && (
          <meta
            property="article:published_time"
            content={blog.published_date}
          />
        )}
        {blog.category && (
          <meta property="article:section" content={blog.category} />
        )}
        {blog.tags &&
          blog.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}

        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: blog.schema_markup || generateSchemaMarkup(),
          }}
        />
      </Helmet>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            {/* Blog Content */}
            <Card className="w-full mb-4">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(blog.published_date)}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {blog.author}
                  </div>
                  {blog.category && (
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      {blog.category}
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                  {blog.title}
                </CardTitle>
                {blog.excerpt && (
                  <p className="text-base sm:text-lg text-gray-600 mt-2 sm:mt-4">
                    {blog.excerpt}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-base sm:prose-lg max-w-none prose-headings:text-left prose-p:text-left prose-li:text-left prose-blockquote:text-left prose-td:text-left"
                  style={{ textAlign: "left" }}
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-xs sm:text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-8 sm:mt-12">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                  Related Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {relatedPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="hover:shadow-lg transition-shadow w-full"
                    >
                      <Link to={`/blog/${post.slug}`}>
                        {post.featured_image && (
                          <div className="h-32 sm:h-48 overflow-hidden rounded-t-lg">
                            <img
                              src={getValidImageUrl(post.featured_image) || ""}
                              alt={post.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <CardContent className="p-3 sm:p-4">
                          <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 line-clamp-2 text-sm sm:text-base">
                            {post.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {formatDate(post.published_date)}
                          </p>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2 mb-6 lg:mb-0">
            <div className="sticky top-24 z-20 space-y-4 sm:space-y-6">
              {/* Book Appointment Card */}
              <Card className="bg-gradient-to-br from-brand-green to-brand-green/80 text-white shadow-lg w-full">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl">
                    Book Your Hijama Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="mb-2 sm:mb-4 text-white/90 text-xs sm:text-sm">
                    Experience the healing benefits of traditional hijama
                    cupping therapy.
                  </p>
                  <Link to="/booking">
                    <Button className="w-full bg-white text-brand-green hover:bg-gray-50 font-medium">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              {recentPosts.length > 0 && (
                <Card className="shadow-lg w-full">
                  <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">
                      Recent Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-4 pt-0">
                    {recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-2 sm:gap-3">
                          {post.featured_image && (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                              <img
                                src={
                                  getValidImageUrl(post.featured_image) || ""
                                }
                                alt={post.title}
                                className="w-full h-full object-cover rounded"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="text-xs sm:text-sm font-medium text-gray-800 group-hover:text-brand-green line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                              {formatDate(post.published_date)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogDetail;

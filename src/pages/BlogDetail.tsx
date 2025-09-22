import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, User, Tag, Clock } from "lucide-react";
import { BlogPost } from "@/types/supabase-types";
import { toast } from "@/components/ui/sonner";
import { useBlogPost, useRecentPosts, useRelatedPosts } from "@/hooks/useBlogData";
import OptimizedImage from "@/components/ui/OptimizedImage";

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
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Use React Query hooks for optimized data fetching
  const { 
    data: blog, 
    isLoading: blogLoading, 
    error: blogError 
  } = useBlogPost(slug || '');

  const { 
    data: recentPosts = [], 
    isLoading: recentLoading 
  } = useRecentPosts(slug, 5);

  const { 
    data: relatedPosts = [], 
    isLoading: relatedLoading 
  } = useRelatedPosts(blog?.category || '', slug || '', 3);

  // Combined loading state
  const loading = blogLoading;

  // Handle blog error
  useEffect(() => {
    if (blogError) {
      console.error("Error fetching blog post:", blogError);
      toast.error("Blog post not found");
    }
  }, [blogError]);

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
      dateModified: blog.created_at || blog.published_date,
      keywords: blog.meta_keywords || blog.tags?.join(", "),
      url: `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${blog.slug}`,
    };
    return JSON.stringify(schema);
  };

  const createCta = (
    title: string,
    description: string,
    buttonText: string,
    link: string
  ) => {
    return `
      <div class="my-8 p-4 sm:p-6 bg-brand-green/5 border border-brand-green/20 rounded-lg text-center">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-800">${title}</h3>
        <p class="mt-2 text-sm sm:text-base text-gray-600">${description}</p>
        <a href="${link}" class="mt-4 inline-block bg-brand-green text-white px-6 py-2 rounded-md font-medium hover:bg-brand-green/90 transition-colors">
          ${buttonText}
        </a>
      </div>
    `;
  };

  // Memoize CTA injection to prevent re-processing on every render
  const processedContent = useMemo(() => {
    if (!blog?.content) return "";
    
    const ctas = [
      createCta(
        "Experience Cupping Therapy",
        "Discover the benefits of traditional Hijama cupping for pain relief and detoxification.",
        "Book a Session",
        "/booking?service=cupping"
      ),
      createCta(
        "Try Acupressure Therapy",
        "Relieve stress and improve your body's natural healing abilities with our expert therapists.",
        "Book an Appointment",
        "/booking"
      ),
      createCta(
        "Consult with a Unani Doctor",
        "Get a personalized consultation for holistic Unani health care from our renowned doctors.",
        "Book a Consultation",
        "/booking?service=unani-consultation"
      ),
    ];

    const paragraphs = blog.content.split("</p>");
    let newContent = "";
    let ctaIndex = 0;

    // Aim to inject after the 1st, 3rd, and 5th paragraphs if they exist
    const injectionPoints = [1, 3, 5];

    for (let i = 0; i < paragraphs.length; i++) {
      newContent += paragraphs[i] + "</p>";
      if (
        ctaIndex < ctas.length &&
        injectionPoints.includes(i)
      ) {
        newContent += ctas[ctaIndex];
        ctaIndex++;
      }
    }
    
    // If there were not enough paragraphs, append remaining CTAs at the end
    while (ctaIndex < ctas.length) {
      newContent += ctas[ctaIndex];
      ctaIndex++;
    }

    return newContent;
  }, [blog?.content]);

  // Loading skeleton component
  const BlogDetailSkeleton = () => (
    <Layout
      title="Loading Blog Post..."
      description="Please wait while we load the blog post."
      canonical=""
      image=""
      keywords=""
    >
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <Card className="w-full mb-4">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 order-1 lg:order-2 mb-6 lg:mb-0">
            <div className="sticky top-24 z-20 space-y-4 sm:space-y-6">
              <Card className="bg-gradient-to-br from-brand-green to-brand-green/80 text-white shadow-lg w-full">
                <CardHeader className="pb-2 sm:pb-4">
                  <Skeleton className="h-6 w-3/4 bg-white/20" />
                </CardHeader>
                <CardContent className="pt-0">
                  <Skeleton className="h-4 w-full mb-4 bg-white/20" />
                  <Skeleton className="h-10 w-full bg-white/20" />
                </CardContent>
              </Card>
              
              <Card className="shadow-lg w-full hidden sm:block">
                <CardHeader className="pb-2 sm:pb-4">
                  <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-16 h-16 flex-shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );

  if (loading) {
    return <BlogDetailSkeleton />;
  }

  if (!blog) {
    return (
      <Layout
        title="Blog Post Not Found"
        description="The blog post you are looking for does not exist."
        canonical=""
        image=""
        keywords=""
      >
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
  
  // SEO values with fallbacks
  const seoTitle = blog.meta_title || blog.og_title || blog.title || "Blog Post - RevivoHeal Bangalore";
  const seoDescription = blog.meta_description || blog.og_description || blog.excerpt || "Read our latest blog post about hijama cupping therapy and traditional healing.";
  const seoKeywords = blog.meta_keywords || blog.tags?.join(", ") || "hijama, cupping therapy, traditional healing, bangalore";
  const seoImage = getValidImageUrl(blog.og_image) || validImageUrl;

  console.log("SEO Debug - Final SEO values:", {
    seoTitle,
    seoDescription,
    seoKeywords,
    seoImage,
    currentUrl,
  });

  return (
    <>
      {/* Direct meta tag injection to ensure SEO works */}
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={currentUrl} />
        {seoImage && <meta property="og:image" content={seoImage} />}
        <meta property="og:site_name" content="RevivoHeal Bangalore" />

        {/* Article specific Open Graph tags */}
        {blog.author && <meta property="article:author" content={blog.author} />}
        {blog.published_date && <meta property="article:published_time" content={blog.published_date} />}
        {(blog as any).created_at && <meta property="article:modified_time" content={(blog as any).created_at} />}
        {blog.category && <meta property="article:section" content={blog.category} />}
        {blog.tags && blog.tags.map((tag, index) => (
          <meta key={`tag-${index}`} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {seoImage && <meta name="twitter:image" content={seoImage} />}

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow" />
        
        {/* Schema markup injection */}
        <script type="application/ld+json">
          {generateSchemaMarkup()}
        </script>
      </Helmet>

      <Layout
        title={seoTitle}
        description={seoDescription}
        canonical={currentUrl}
        image={seoImage}
        keywords={seoKeywords}
        disableDefaultSEO={true}
      >

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
                  dangerouslySetInnerHTML={{ __html: processedContent }}
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
            <div className="mt-8 sm:mt-12">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                Related Posts
              </h2>
              {relatedLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="w-full">
                      <Skeleton className="h-32 sm:h-48 w-full rounded-t-lg" />
                      <CardContent className="p-3 sm:p-4">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : relatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {relatedPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="hover:shadow-lg transition-shadow w-full"
                    >
                      <Link to={`/blog/${post.slug}`}>
                        {post.featured_image && (
                          <div className="h-32 sm:h-48 overflow-hidden rounded-t-lg">
                            <OptimizedImage
                              src={getValidImageUrl(post.featured_image) || ""}
                              alt={post.title}
                              width={400}
                              height={200}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              quality={85}
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
              ) : null}
            </div>
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
              <Card className="shadow-lg w-full hidden sm:block">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg">
                    Recent Posts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-4 pt-0">
                  {recentLoading ? (
                    <>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-2 sm:gap-3">
                          <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded" />
                          <div className="flex-1">
                            <Skeleton className="h-3 w-full mb-1" />
                            <Skeleton className="h-2 w-2/3" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : recentPosts.length > 0 ? (
                    recentPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-2 sm:gap-3">
                          {post.featured_image && (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                              <OptimizedImage
                                src={getValidImageUrl(post.featured_image) || ""}
                                alt={post.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover rounded"
                                sizes="64px"
                                quality={80}
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
                    ))
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </Layout>
    </>
  );
};

export default BlogDetail;

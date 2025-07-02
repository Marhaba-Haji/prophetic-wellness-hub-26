import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, User, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/supabase-types";
import PageSEO from "@/components/SEO/PageSEO";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    fetchBlogPosts();
  }, [currentPage]);

  const fetchBlogPosts = async () => {
    try {
      const from = (currentPage - 1) * postsPerPage;
      const to = from + postsPerPage - 1;

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("published_date", { ascending: false })
        .range(from, to);

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
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

  return (
    <Layout
      title="Blog - RevivoHeal Bangalore | Hijama Therapy Articles & Health Tips"
      description="Read our latest articles on Hijama cupping therapy, traditional healing methods, and wellness tips from certified professionals at RevivoHeal Bangalore."
      keywords="hijama therapy, cupping therapy, traditional healing, wellness articles, health tips, bangalore"
    >
      <PageSEO
        title="Blog - RevivoHeal Bangalore | Hijama Therapy Articles & Health Tips"
        description="Read our latest articles on Hijama cupping therapy, traditional healing methods, and wellness tips from certified professionals at RevivoHeal Bangalore."
        keywords="hijama therapy, cupping therapy, traditional healing, wellness articles, health tips, bangalore"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-green mb-4">
            Health & Wellness Blog
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Discover the benefits of traditional healing methods, Hijama therapy
            insights, and expert wellness advice from our certified
            practitioners.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="group border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="overflow-hidden">
                    <img
                      src={
                        post.featured_image ||
                        "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                      }
                      alt={post.featured_image_alt || post.title}
                      className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{formatDate(post.published_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-3.5 w-3.5 mr-1" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  {post.category && (
                    <div className="flex items-center mb-2">
                      <Tag className="h-3.5 w-3.5 mr-1 text-brand-green" />
                      <span className="text-sm text-brand-green font-medium">
                        {post.category}
                      </span>
                    </div>
                  )}

                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold text-brand-green mb-2 hover:text-brand-green-light transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-700 line-clamp-3">
                    {post.excerpt || post.meta_description}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-brand-green/10 text-brand-green rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Link to={`/blog/${post.slug}`}>
                    <Button
                      variant="link"
                      className="text-brand-green p-0 hover:text-brand-green-light"
                    >
                      Read More →
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No blog posts available yet.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLatestPosts } from "@/hooks/useBlogData";
import BlogCard from "@/components/blog/BlogCard";
import { ClientOnly } from "@/components/ui/ClientOnlyComponent";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPreview = () => {
  const { data: blogPosts = [], isLoading, error } = useLatestPosts(3);

  // Loading skeleton for homepage
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
          <Skeleton className="w-full h-48" />
          <div className="p-6 space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4">
            Latest Articles
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Learn more about hijama therapy, its benefits, and how it can help
            with various health conditions.
          </p>
        </div>

        <ClientOnly
          fallback={<LoadingSkeleton />}
        >
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error loading blog posts.</p>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} variant="compact" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No blog posts available yet.</p>
            </div>
          )}
        </ClientOnly>

        <div className="text-center mt-10">
          <Link to="/blog">
            <Button className="bg-white text-brand-green border border-brand-green shadow-md hover:shadow-lg hover:bg-gray-50">
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;

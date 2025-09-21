import React, { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useBlogPosts, useBlogCount } from "@/hooks/useBlogData";
import BlogCard from "@/components/blog/BlogCard";
import PageSEO from "@/components/SEO/PageSEO";
import { Skeleton } from "@/components/ui/skeleton";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  // Use React Query for optimized data fetching
  const { data: blogPosts = [], isLoading, error } = useBlogPosts(currentPage, postsPerPage);
  const { data: totalCount = 0 } = useBlogCount();

  // Calculate pagination info
  const totalPages = Math.ceil(totalCount / postsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Memoize pagination component to prevent unnecessary re-renders
  const PaginationComponent = useMemo(() => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-12">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="px-4 py-2"
        >
          Previous
        </Button>
        
        <div className="flex gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                onClick={() => handlePageChange(pageNum)}
                className="px-3 py-2 min-w-[40px]"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="px-4 py-2"
        >
          Next
        </Button>
      </div>
    );
  }, [currentPage, totalPages, hasNextPage, hasPrevPage]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: postsPerPage }, (_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
          <Skeleton className="w-full aspect-video" />
          <div className="p-6 space-y-3">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-24" />
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
    <Layout disableDefaultSEO>
      <PageSEO
        title="Blog - RevivoHeal Bangalore | Hijama Therapy Articles & Health Tips"
        description="Read our latest articles on Hijama cupping therapy, traditional healing methods, and wellness tips from certified professionals at RevivoHeal Bangalore."
        keywords="hijama therapy, cupping therapy, traditional healing, wellness articles, health tips, bangalore"
        image="https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        url={`${window.location.origin}/blog`}
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

        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">
              Error loading blog posts. Please try again later.
            </p>
          </div>
        ) : blogPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            {PaginationComponent}
          </>
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

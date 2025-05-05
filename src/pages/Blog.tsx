
import React from 'react';
import Layout from '@/components/layout/Layout';

const Blog = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-8 text-center">Blog</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-6">
            Explore our collection of articles about hijama therapy, Islamic medicine, wellness tips, and more.
          </p>
          <p className="text-lg mb-6">
            This page will contain our full blog with featured articles, category navigation, search functionality, and an archive of all posts.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;

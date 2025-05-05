
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    title: "The History and Science of Hijama Therapy",
    excerpt: "Explore the rich history of hijama therapy in Islamic medicine and the modern scientific research supporting its benefits.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "May 10, 2024",
    slug: "/blog/history-science-hijama"
  },
  {
    title: "7 Common Conditions That Respond Well to Hijama",
    excerpt: "Learn about specific health conditions that have shown significant improvement with regular hijama therapy sessions.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "April 23, 2024",
    slug: "/blog/conditions-respond-hijama"
  },
  {
    title: "Preparing for Your First Hijama Session: What to Expect",
    excerpt: "A comprehensive guide for newcomers about what to expect during your first hijama therapy appointment.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "April 12, 2024",
    slug: "/blog/preparing-first-hijama-session"
  }
];

const BlogPreview = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4">Latest Articles</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Learn more about hijama therapy, its benefits, and how it can help with various health conditions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                <h3 className="text-xl font-bold text-brand-green mb-2">{post.title}</h3>
                <p className="text-gray-700">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Link to={post.slug}>
                  <Button variant="link" className="text-brand-green p-0 hover:text-brand-green-light">
                    Read More →
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/blog">
            <Button className="border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
              View All Articles
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;

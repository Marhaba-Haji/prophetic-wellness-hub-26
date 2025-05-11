
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const blogPosts = [
  {
    id: "history-science-hijama",
    title: "The History and Science of Hijama Therapy",
    excerpt: "Explore the rich history of hijama therapy in Islamic medicine and the modern scientific research supporting its benefits.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "May 10, 2024",
    slug: "history-science-hijama"
  },
  {
    id: "conditions-respond-hijama",
    title: "7 Common Conditions That Respond Well to Hijama",
    excerpt: "Learn about specific health conditions that have shown significant improvement with regular hijama therapy sessions.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "April 23, 2024",
    slug: "conditions-respond-hijama"
  },
  {
    id: "preparing-first-hijama-session",
    title: "Preparing for Your First Hijama Session: What to Expect",
    excerpt: "A comprehensive guide for newcomers about what to expect during your first hijama therapy appointment.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "April 12, 2024",
    slug: "preparing-first-hijama-session"
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
            <Card key={index} className="group border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <Link to={`/blog/${post.slug}`}>
                <div className="overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
              <CardContent className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{post.date}</span>
                </div>
                <Link to={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-bold text-brand-green mb-2 hover:text-brand-green-light transition-colors">{post.title}</h3>
                </Link>
                <p className="text-gray-700">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Link to={`/blog/${post.slug}`}>
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


import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: "history-science-hijama",
    title: "The History and Science of Hijama Therapy",
    excerpt: "Explore the rich history of hijama therapy in Islamic medicine and the modern scientific research supporting its benefits.",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "May 10, 2024",
    author: "Dr. Ahmed Khan",
    tags: ["History", "Research", "Islamic Medicine"],
    slug: "history-science-hijama"
  },
  {
    id: "conditions-respond-hijama",
    title: "7 Common Conditions That Respond Well to Hijama",
    excerpt: "Learn about specific health conditions that have shown significant improvement with regular hijama therapy sessions.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "April 23, 2024",
    author: "Dr. Fatima Ahmed",
    tags: ["Health", "Treatment", "Conditions"],
    slug: "conditions-respond-hijama"
  },
  {
    id: "preparing-first-hijama-session",
    title: "Preparing for Your First Hijama Session: What to Expect",
    excerpt: "A comprehensive guide for newcomers about what to expect during your first hijama therapy appointment.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "April 12, 2024",
    author: "Maryam Hassan",
    tags: ["Guidance", "First-timers", "Preparation"],
    slug: "preparing-first-hijama-session"
  },
  {
    id: "hijama-points-guide",
    title: "Essential Hijama Points: A Comprehensive Guide",
    excerpt: "Learn about the most important hijama points and their corresponding health benefits in traditional Islamic medicine.",
    image: "https://images.unsplash.com/photo-1535914254981-b5012eebbd15?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "March 28, 2024",
    author: "Dr. Yusuf Rahman",
    tags: ["Technique", "Points", "Guidance"],
    slug: "hijama-points-guide"
  },
  {
    id: "children-hijama",
    title: "Is Hijama Suitable for Children? What Parents Should Know",
    excerpt: "A balanced look at the benefits, considerations, and precautions for hijama therapy in children according to Islamic medicine.",
    image: "https://images.unsplash.com/photo-1544611682-73c897c4ed0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "March 15, 2024",
    author: "Dr. Layla Najjar",
    tags: ["Children", "Pediatric", "Safety"],
    slug: "children-hijama"
  },
  {
    id: "modern-science-traditional-practice",
    title: "Modern Science Meets Traditional Practice: The Evidence Behind Hijama",
    excerpt: "Exploring the latest scientific research validating the ancient practice of hijama therapy for various health conditions.",
    image: "https://images.unsplash.com/photo-1581093196277-9f608af3b09b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "February 28, 2024",
    author: "Dr. Ahmed Khan",
    tags: ["Research", "Science", "Evidence"],
    slug: "modern-science-traditional-practice"
  }
];

const Blog = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-green mb-4">Our Blog</h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Explore our collection of articles about hijama therapy, Islamic medicine, wellness tips, and more.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-12 relative">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" className="rounded-full">All Topics</Button>
              <Button variant="outline" size="sm" className="rounded-full">Islamic Medicine</Button>
              <Button variant="outline" size="sm" className="rounded-full">Techniques</Button>
              <Button variant="outline" size="sm" className="rounded-full">Research</Button>
              <Button variant="outline" size="sm" className="rounded-full">Health</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="overflow-hidden h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center text-xs text-gray-600 mb-2">
                    <span className="flex items-center mr-4 mb-1">
                      <Calendar className="h-3 w-3 mr-1" /> {post.date}
                    </span>
                    <span className="flex items-center mb-1">
                      <User className="h-3 w-3 mr-1" /> {post.author}
                    </span>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`} className="block">
                    <h2 className="text-xl font-bold text-brand-green hover:text-brand-green-light transition-colors mb-2">{post.title}</h2>
                  </Link>
                  
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-brand-green/10 text-brand-green px-2 py-1 rounded-full flex items-center">
                        <Tag className="h-2.5 w-2.5 mr-1" /> {tag}
                      </span>
                    ))}
                  </div>
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
          
          <div className="mt-12 text-center">
            <Button className="gold-gradient text-white hover:opacity-90 px-8 py-2 rounded-full">
              Load More Articles
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;


import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  },
  // Additional posts for "Load More" functionality
  {
    id: "women-hijama-benefits",
    title: "Specific Benefits of Hijama for Women's Health",
    excerpt: "Discover how hijama therapy can address various women's health concerns including hormonal imbalances and reproductive health.",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "February 10, 2024",
    author: "Dr. Fatima Ahmed",
    tags: ["Women's Health", "Treatment", "Research"],
    slug: "women-hijama-benefits"
  },
  {
    id: "seasonal-hijama",
    title: "The Best Seasons for Hijama Therapy According to Islamic Medicine",
    excerpt: "Learn about the traditional Islamic timing for hijama therapy and how seasonal changes can influence treatment outcomes.",
    image: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "January 15, 2024",
    author: "Dr. Yusuf Rahman",
    tags: ["Islamic Medicine", "Seasonal", "Tradition"],
    slug: "seasonal-hijama"
  },
  {
    id: "immune-system-hijama",
    title: "How Hijama Therapy Strengthens Your Immune System",
    excerpt: "An exploration of the scientific mechanisms behind hijama's ability to boost immunity and improve overall health.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    date: "December 28, 2023",
    author: "Dr. Ahmed Khan",
    tags: ["Immunity", "Health", "Research"],
    slug: "immune-system-hijama"
  }
];

// Extract all unique tags from blog posts
const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All Topics");
  const [visiblePosts, setVisiblePosts] = useState(6);

  // Filter posts based on search query and selected tag
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === "All Topics" || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  // Posts to display based on current visibility limit
  const displayedPosts = filteredPosts.slice(0, visiblePosts);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle tag selection
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
  };

  // Handle load more articles
  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 3);
  };

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

          <div className="max-w-3xl mx-auto mb-16 relative">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
              <Tabs defaultValue="All Topics" className="w-full" onValueChange={handleTagChange}>
                <TabsList className="flex flex-wrap gap-2 justify-center bg-transparent h-auto p-0">
                  <TabsTrigger 
                    value="All Topics" 
                    className="rounded-full data-[state=active]:bg-brand-green data-[state=active]:text-white mb-2"
                  >
                    All Topics
                  </TabsTrigger>
                  {allTags.map((tag) => (
                    <TabsTrigger
                      key={tag}
                      value={tag}
                      className="rounded-full data-[state=active]:bg-brand-green data-[state=active]:text-white mb-2"
                    >
                      {tag}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {displayedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPosts.map((post) => (
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
                        <span 
                          key={i} 
                          className="text-xs bg-brand-green/10 text-brand-green px-2 py-1 rounded-full flex items-center cursor-pointer hover:bg-brand-green/20"
                          onClick={() => handleTagChange(tag)}
                        >
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
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-700">No articles found matching your search</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search terms or filter</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag("All Topics");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
          
          {filteredPosts.length > visiblePosts && (
            <div className="mt-12 text-center">
              <Button 
                className="gold-gradient text-white hover:opacity-90 px-8 py-2 rounded-full"
                onClick={handleLoadMore}
              >
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Blog;

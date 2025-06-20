import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, Calendar, User, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/supabase-types';
import { toast } from '@/components/ui/sonner';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [visiblePosts, setVisiblePosts] = useState(6);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('published_date', { ascending: false });

      if (error) throw error;

      setBlogPosts(data || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(
        data?.map(post => post.category).filter(Boolean) || []
      ));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search query and selected category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Topics" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Posts to display based on current visibility limit
  const displayedPosts = filteredPosts.slice(0, visiblePosts);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle load more articles
  const handleLoadMore = () => {
    setVisiblePosts(prev => prev + 3);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Recently';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-4xl font-bold text-brand-green mb-2">Our Blog</h1>
            <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
              Explore our collection of articles about hijama therapy, Islamic medicine, wellness tips, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Blog Cards */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              {/* Category Tabs */}
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
                <Tabs defaultValue="All Topics" className="w-full" onValueChange={handleCategoryChange}>
                  <TabsList className="flex flex-wrap gap-2 justify-center bg-transparent h-auto p-0">
                    <TabsTrigger 
                      value="All Topics" 
                      className="rounded-full data-[state=active]:bg-brand-green data-[state=active]:text-white mb-2"
                    >
                      All Topics
                    </TabsTrigger>
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="rounded-full data-[state=active]:bg-brand-green data-[state=active]:text-white mb-2 capitalize"
                      >
                        {category.replace('-', ' ')}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {displayedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {displayedPosts.map((post) => (
                    <Card key={post.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                      <Link href={`/blog/${post.slug}`} className="block">
                        <div className="overflow-hidden h-48">
                          <img
                            src={post.featured_image || "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                            alt={post.featured_image_alt || post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>
                      <CardContent className="p-6">
                        <div className="flex flex-wrap items-center text-xs text-gray-600 mb-2">
                          <span className="flex items-center mr-4 mb-1">
                            <Calendar className="h-3 w-3 mr-1" /> {formatDate(post.published_date)}
                          </span>
                          <span className="flex items-center mb-1">
                            <User className="h-3 w-3 mr-1" /> {post.author}
                          </span>
                        </div>
                        
                        <Link href={`/blog/${post.slug}`} className="block">
                          <h2 className="text-xl font-bold text-brand-green hover:text-brand-green-light transition-colors mb-2">{post.title}</h2>
                        </Link>
                        
                        <p className="text-gray-700 mb-4">{post.excerpt || post.meta_description}</p>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag, i) => (
                              <span 
                                key={i} 
                                className="text-xs bg-brand-green/10 text-brand-green px-2 py-1 rounded-full flex items-center"
                              >
                                <Tag className="h-2.5 w-2.5 mr-1" /> {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="px-6 pb-6 pt-0">
                        <Link href={`/blog/${post.slug}`}>
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
                      setSelectedCategory("All Topics");
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
            {/* Sidebar */}
            <div className="lg:col-span-1 order-1 lg:order-2 mb-8 lg:mb-0 space-y-6">
              <div className="sticky top-24 z-20 space-y-6">
                {/* Book Appointment Card */}
                <Card className="bg-gradient-to-br from-brand-green to-brand-green/80 text-white shadow-lg w-full">
                  <CardContent className="pt-4 pb-6">
                    <h3 className="text-lg font-semibold mb-2">Book Your Hijama Session</h3>
                    <p className="mb-4 text-white/90 text-sm">
                      Experience the healing benefits of traditional hijama cupping therapy.
                    </p>
                    <Link href="/booking">
                      <Button className="w-full bg-white text-brand-green hover:bg-gray-50 font-medium">
                        Book Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                {/* Featured Articles Card */}
                <Card className="shadow-lg w-full">
                  <CardContent className="pt-4 pb-6">
                    <h3 className="text-lg font-semibold mb-4">Featured Articles</h3>
                    <div className="space-y-4">
                      {blogPosts.slice(0, 3).map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="flex gap-3 group">
                          <div className="w-16 h-16 flex-shrink-0">
                            <img src={post.featured_image || ''} alt={post.title} className="w-full h-full object-cover rounded" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-800 group-hover:text-brand-green line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {formatDate(post.published_date)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
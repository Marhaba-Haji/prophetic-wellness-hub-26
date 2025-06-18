
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
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
          </div>

          {displayedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <Link to={`/blog/${post.slug}`} className="block">
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
                    
                    <Link to={`/blog/${post.slug}`} className="block">
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
      </div>
    </Layout>
  );
};

export default Blog;

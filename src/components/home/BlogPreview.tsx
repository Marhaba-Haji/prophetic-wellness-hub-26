
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/supabase-types';
import { ClientOnly } from '@/components/ui/ClientOnlyComponent';

const BlogPreview = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('published_date', { ascending: false })
        .limit(3);

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching latest posts:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4">Latest Articles</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Learn more about hijama therapy, its benefits, and how it can help with various health conditions.
          </p>
        </div>
        
        <ClientOnly fallback={
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
          </div>
        }>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="group border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <a href={`/blog/${post.slug}`}>
                    <div className="overflow-hidden">
                      <img 
                        src={post.featured_image || "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"} 
                        alt={post.featured_image_alt || post.title} 
                        className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-105"
                      />
                    </div>
                  </a>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{formatDate(post.published_date)}</span>
                    </div>
                    <a href={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold text-brand-green mb-2 hover:text-brand-green-light transition-colors">{post.title}</h3>
                    </a>
                    <p className="text-gray-700">{post.excerpt || post.meta_description}</p>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <a href={`/blog/${post.slug}`}>
                      <Button variant="link" className="text-brand-green p-0 hover:text-brand-green-light">
                        Read More →
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No blog posts available yet.</p>
            </div>
          )}
        </ClientOnly>
        
        <div className="text-center mt-10">
          <a href="/blog">
            <Button className="bg-white text-brand-green border border-brand-green shadow-md hover:shadow-lg hover:bg-gray-50">
              View All Articles
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/supabase-types';

interface BlogSEOData {
  title: string;
  description: string;
  image?: string;
  url: string;
  keywords?: string;
  author: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  tags?: string[];
}

export const useBlogSEO = (blogSlug: string): BlogSEOData | null => {
  const [seoData, setSeoData] = useState<BlogSEOData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogSEO = async () => {
      try {
        const { data: blog, error } = await supabase
          .from('blogs')
          .select(`
            title,
            meta_title,
            meta_description,
            excerpt,
            featured_image,
            og_image,
            meta_keywords,
            author,
            published_date,
            created_at,
            category,
            tags,
            slug,
            canonical_url,
            og_title,
            og_description
          `)
          .eq('slug', blogSlug)
          .eq('published', true)
          .single();

        if (error) throw error;

        if (blog) {
          const baseUrl = window.location.origin;
          const blogUrl = blog.canonical_url || `${baseUrl}/blog/${blog.slug}`;
          
          setSeoData({
            title: blog.meta_title || `${blog.title} - RevivoHeal Bangalore`,
            description: blog.meta_description || blog.excerpt || `Read about ${blog.title} on RevivoHeal Bangalore`,
            image: blog.og_image || blog.featured_image,
            url: blogUrl,
            keywords: blog.meta_keywords || blog.tags?.join(', '),
            author: blog.author,
            publishedTime: blog.published_date,
            modifiedTime: blog.created_at,
            category: blog.category,
            tags: blog.tags
          });
        }
      } catch (error) {
        console.error('Error fetching blog SEO data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (blogSlug) {
      fetchBlogSEO();
    }
  }, [blogSlug]);

  return loading ? null : seoData;
};

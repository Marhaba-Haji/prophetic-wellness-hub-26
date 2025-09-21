import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Tag } from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    meta_description?: string;
    featured_image?: string;
    featured_image_alt?: string;
    published_date?: string;
    author?: string;
    category?: string;
    tags?: string[];
    reading_time?: number;
  };
  variant?: 'default' | 'compact';
}

const BlogCard: React.FC<BlogCardProps> = ({ post, variant = 'default' }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Recently";
    }
  };

  const isCompact = variant === 'compact';

  return (
    <Card className="group border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="overflow-hidden">
          <OptimizedImage
            src={post.featured_image || ''}
            alt={post.featured_image_alt || post.title}
            width={isCompact ? 400 : 600}
            height={isCompact ? 200 : 300}
            className="w-full aspect-video sm:aspect-[1.9/1] transition-all duration-500 group-hover:scale-105"
            priority={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
          />
        </div>
      </Link>
      
      <CardContent className={`p-6 flex-1 flex flex-col ${isCompact ? 'p-4' : ''}`}>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{formatDate(post.published_date)}</span>
          </div>
          {post.author && (
            <div className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1" />
              <span>{post.author}</span>
            </div>
          )}
          {post.reading_time && (
            <div className="flex items-center">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {post.reading_time} min read
              </span>
            </div>
          )}
        </div>

        {post.category && (
          <div className="flex items-center mb-2">
            <Tag className="h-3.5 w-3.5 mr-1 text-brand-green" />
            <span className="text-sm text-brand-green font-medium">
              {post.category}
            </span>
          </div>
        )}

        <Link to={`/blog/${post.slug}`}>
          <h2 className={`font-bold text-brand-green mb-2 hover:text-brand-green-light transition-colors line-clamp-2 ${
            isCompact ? 'text-lg' : 'text-xl'
          }`}>
            {post.title}
          </h2>
        </Link>
        
        <p className={`text-gray-700 line-clamp-3 flex-1 ${
          isCompact ? 'text-sm' : ''
        }`}>
          {post.excerpt || post.meta_description}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-brand-green/10 text-brand-green rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className={`px-6 pb-6 pt-0 ${isCompact ? 'px-4 pb-4' : ''}`}>
        <Link to={`/blog/${post.slug}`}>
          <Button
            variant="link"
            className="text-brand-green p-0 hover:text-brand-green-light"
          >
            Read More →
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;

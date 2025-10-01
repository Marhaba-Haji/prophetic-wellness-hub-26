import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const BlogCard = ({ post, variant = "default" }) => {
  const isCompact = variant === "compact";
  
  // Format date
  const formattedDate = post.published_date 
    ? new Date(post.published_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'No date';

  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="group block border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white"
    >
      {/* Featured Image */}
      {post.featured_image && (
        <div className={`overflow-hidden ${isCompact ? 'h-48' : 'h-64'}`}>
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className={`p-6 ${isCompact ? 'space-y-3' : 'space-y-4'}`}>
        {/* Category Badge */}
        {post.category && (
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
        )}

        {/* Title */}
        <h3 className={`font-bold text-gray-900 group-hover:text-brand-green transition-colors ${
          isCompact ? 'text-lg line-clamp-2' : 'text-xl line-clamp-2'
        }`}>
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className={`text-gray-600 ${isCompact ? 'text-sm line-clamp-2' : 'text-base line-clamp-3'}`}>
            {post.excerpt}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          {post.author && (
            <span>By {post.author}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;

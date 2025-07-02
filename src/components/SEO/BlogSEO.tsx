import React from "react";
import { DynamicSEOHead, useDynamicSEO } from "@/hooks/useDynamicSEO";
import { useBlogSEO } from "@/hooks/useBlogSEO";

interface BlogSEOProps {
  blogSlug: string;
}

const BlogSEO: React.FC<BlogSEOProps> = ({ blogSlug }) => {
  const blogSEO = useBlogSEO(blogSlug);

  useDynamicSEO({
    title: blogSEO?.title,
    description: blogSEO?.description,
  });

  if (!blogSEO) {
    return null;
  }

  return (
    <DynamicSEOHead
      seoData={{
        title: blogSEO.title,
        description: blogSEO.description,
        image: blogSEO.image,
        url: blogSEO.url,
        type: "article",
        keywords: blogSEO.keywords,
        author: blogSEO.author,
        publishedTime: blogSEO.publishedTime,
        modifiedTime: blogSEO.modifiedTime,
      }}
    />
  );
};

export default BlogSEO;

import React from "react";
import { DynamicSEOHead, useDynamicSEO } from "@/hooks/useDynamicSEO";

interface PageSEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  image,
  url,
  type = "website",
  keywords,
}) => {
  useDynamicSEO({ title, description });

  return (
    <DynamicSEOHead
      seoData={{
        title,
        description,
        image,
        url,
        type,
        keywords,
      }}
    />
  );
};

export default PageSEO;

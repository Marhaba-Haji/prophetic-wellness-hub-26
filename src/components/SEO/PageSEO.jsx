import React from "react";
import { DynamicSEOHead, useDynamicSEO } from "@/hooks/useDynamicSEO";

const PageSEO = ({
  children,
  disableDefaultSEO = false,
  title,
  description,
  canonical,
  image,
  url,
  type = "website",
  keywords,
}) => {
  // If children are provided, render them instead of the SEO logic
  if (children) {
    return children;
  }
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

import React from "react";
import { DynamicSEOHead, useDynamicSEO } from "@/hooks/useDynamicSEO";

const PageSEO = ({
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

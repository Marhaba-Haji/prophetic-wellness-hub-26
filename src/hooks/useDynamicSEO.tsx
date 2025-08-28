import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

interface SEOData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const useDynamicSEO = (seoData: SEOData) => {
  useEffect(() => {
    // Update document title immediately for faster perceived performance
    if (seoData.title) {
      document.title = seoData.title;
    }
  }, [seoData.title]);

  return null;
};

export const DynamicSEOHead = ({ seoData }: { seoData: SEOData }) => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Helmet>
      {/* Basic Meta Tags - Override universal ones */}
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      {seoData.author && <meta name="author" content={seoData.author} />}

      {/* Open Graph Meta Tags - Override universal ones */}
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:type" content={seoData.type || "website"} />
      <meta property="og:url" content={seoData.url || currentUrl} />
      {seoData.image && <meta property="og:image" content={seoData.image} />}
      <meta property="og:site_name" content="RevivoHeal Bangalore" />

      {/* Twitter Card Meta Tags - Override universal ones */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      {seoData.image && <meta name="twitter:image" content={seoData.image} />}

      {/* Article Specific Meta Tags */}
      {seoData.publishedTime && (
        <meta
          property="article:published_time"
          content={seoData.publishedTime}
        />
      )}
      {seoData.modifiedTime && (
        <meta property="article:modified_time" content={seoData.modifiedTime} />
      )}
      {seoData.author && (
        <meta property="article:author" content={seoData.author} />
      )}

      {/* Additional SEO Meta Tags - Override universal ones */}
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={seoData.url || currentUrl} />
    </Helmet>
  );
};

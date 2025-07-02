export const generatePageTitle = (
  pageTitle: string,
  siteName: string = "RevivoHeal Bangalore",
): string => {
  return `${pageTitle} - ${siteName}`;
};

export const generateBlogTitle = (
  blogTitle: string,
  siteName: string = "RevivoHeal Bangalore",
): string => {
  return `${blogTitle} | ${siteName}`;
};

export const truncateDescription = (
  description: string,
  maxLength: number = 160,
): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + "...";
};

export const generateBreadcrumbSchema = (
  breadcrumbs: Array<{ name: string; url: string }>,
) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

export const generateArticleSchema = (article: {
  title: string;
  description: string;
  author: string;
  publishedDate?: string;
  modifiedDate?: string;
  image?: string;
  url: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "RevivoHeal Bangalore",
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate,
    image: article.image,
    url: article.url,
  };
};

export const generatePageTitle = (pageTitle, siteName = "RevivoHeal Bangalore") => {
  return `${pageTitle} - ${siteName}`;
};

export const generateBlogTitle = (blogTitle, siteName = "RevivoHeal Bangalore") => {
  return `${blogTitle} | ${siteName}`;
};

export const truncateDescription = (description, maxLength = 160) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + "...";
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
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

export const generateArticleSchema = (article) => {
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
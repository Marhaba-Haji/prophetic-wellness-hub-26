
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface DefaultSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

const DefaultSEO: React.FC<DefaultSEOProps> = ({
  title = "RevivoHeal Bangalore | Centre for Pain Relief & Healing with Cupping & Massage Therapies",
  description = "Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies. Natural healing by certified professionals. Book now.",
  keywords = "hijama therapy, cupping therapy, pain relief, natural healing, Islamic medicine, traditional therapy, back pain treatment, migraine relief, sports massage, wet cupping, dry cupping",
  canonicalUrl,
  noIndex = false
}) => {
  const currentUrl = canonicalUrl || window.location.href;
  const logoUrl = "https://i.ibb.co/TxLzP5H7/revivo-heal-logo.png";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="RevivoHeal" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={logoUrl} />
      <meta property="og:site_name" content="Revivoheal" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={logoUrl} />
    </Helmet>
  );
};

export default DefaultSEO;

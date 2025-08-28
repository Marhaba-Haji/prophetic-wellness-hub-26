
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { WhatsAppChat } from '@/components/ui/whatsapp-chat';
import { Helmet } from 'react-helmet-async';

interface LayoutProps {
  children: React.ReactNode;
  disableDefaultSEO?: boolean;
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  keywords?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  disableDefaultSEO = false,
  title,
  description,
  canonical,
  image,
  type = "website",
  keywords
}) => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  
  return (
    <div className="flex flex-col min-h-screen">
      {!disableDefaultSEO && (
        <Helmet>
          <title>{title || "RevivoHeal Bangalore | Centre for Pain Relief & Healing"}</title>
          <meta name="description" content={description || "Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies."} />
          {keywords && <meta name="keywords" content={keywords} />}
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="theme-color" content="#16a34a" />
          
          <meta property="og:title" content={title || "RevivoHeal Bangalore | Centre for Pain Relief & Healing"} />
          <meta property="og:description" content={description || "Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies."} />
          <meta property="og:type" content={type} />
          <meta property="og:url" content={canonical || currentUrl} />
          {image && <meta property="og:image" content={image} />}
          <meta property="og:site_name" content="RevivoHeal Bangalore" />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title || "RevivoHeal Bangalore | Centre for Pain Relief & Healing"} />
          <meta name="twitter:description" content={description || "Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies."} />
          {image && <meta name="twitter:image" content={image} />}
          
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={canonical || currentUrl} />
        </Helmet>
      )}
      
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <WhatsAppChat phoneNumber="+919480389296" />
      <Footer />
    </div>
  );
};

export default Layout;

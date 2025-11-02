import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { WhatsAppChat } from "@/components/ui/whatsapp-chat";
import { ClientOnly } from "@/components/ui/ClientOnlyComponent";

// interface LayoutProps {
//   children: React.ReactNode;
//   disableDefaultSEO?: boolean;
//   title?: string;
//   description?: string;
//   canonical?: string;
//   image?: string;
//   type?: string;
//   keywords?: string;
// }

const Layout = ({
  children,
  disableDefaultSEO = false,
  title = "RevivoHeal Bangalore | Centre for Pain Relief & Healing",
  description = "Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies.",
  canonical,
  image,
  type = "website",
  keywords,
}) => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const canonicalUrl = canonical || currentUrl;

  return (
    <>
      {!disableDefaultSEO && (
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          {keywords && <meta name="keywords" content={keywords} />}
          <link rel="canonical" href={canonicalUrl} />

          {/* Open Graph Meta Tags */}
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content={type} />
          <meta property="og:url" content={canonicalUrl} />
          {image && <meta property="og:image" content={image} />}
          <meta property="og:site_name" content="RevivoHeal Bangalore" />

          {/* Twitter Card Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          {image && <meta name="twitter:image" content={image} />}

          {/* Additional SEO Meta Tags */}
          <meta name="robots" content="index, follow" />
        </Helmet>
      )}
      
      {/* Always include essential meta tags */}
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#16a34a" />
        
        {/* Meta Pixel Code */}
        <script>
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2204610873364009');
          fbq('track', 'PageView');`}
        </script>
        {/* End Meta Pixel Code */}
      </Helmet>

      {/* Meta Pixel Noscript - must be in body, not head */}
      <noscript>
        <img height="1" width="1" style={{display:'none'}}
          src="https://www.facebook.com/tr?id=2204610873364009&ev=PageView&noscript=1"
        />
      </noscript>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <ClientOnly>
          <WhatsAppChat phoneNumber="+919480389296" />
        </ClientOnly>
        <Footer />
      </div>
    </>
  );
};

export default Layout;

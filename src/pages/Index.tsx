
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import Benefits from '@/components/home/Benefits';
import Services from '@/components/home/Services';
import Testimonials from '@/components/home/Testimonials';
import BlogPreview from '@/components/home/BlogPreview';
import CTA from '@/components/home/CTA';
import CuppingInfo from '@/components/home/CuppingInfo';

const Index = () => {
  const logoUrl = "https://i.ibb.co/TxLzP5H7/revivo-heal-logo.png";
  const currentUrl = "https://revivoheal.com/";

  return (
    <Layout>
      <Helmet>
        {/* SEO Meta Tags */}
        <title>RevivoHeal Bangalore | Centre for Pain Relief & Healing with Cupping & Massage Therapies</title>
        <meta name="description" content="Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies. Natural healing by certified professionals. Book now." />
        <meta name="keywords" content="hijama therapy, cupping therapy, pain relief, natural healing, Islamic medicine, traditional therapy, back pain treatment, migraine relief, sports massage, wet cupping, dry cupping" />
        <meta name="author" content="RevivoHeal" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="RevivoHeal Bangalore | Centre for Pain Relief & Healing with Cupping & Massage Therapies" />
        <meta property="og:description" content="Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies. Natural healing by certified professionals. Book now." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={logoUrl} />
        <meta property="og:site_name" content="Revivoheal" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RevivoHeal Bangalore | Centre for Pain Relief with Cupping & Massage" />
        <meta name="twitter:description" content="Get relief from chronic pain with RevivoHeal's cupping and traditional massage therapies. Now in Bangalore." />
        <meta name="twitter:image" content={logoUrl} />
        
        {/* Local Business Schema Markup */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HealthAndBeautyBusiness",
          "name": "Revivoheal",
          "alternateName": "Revivo Healing Clinic",
          "description": "Professional hijama and cupping therapy clinic specializing in pain relief, natural healing, and traditional medicine with expert massage therapies.",
          "@id": "https://revivoheal.com/",
          "url": "https://revivoheal.com",
          "logo": logoUrl,
          "image": logoUrl,
          "telephone": "+91-9480389296",
          "email": "info@revivoheal.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Paramount Avenue, 63/1, mosque road, frazer town",
            "addressLocality": "Bangalore",
            "addressRegion": "Karnataka",
            "postalCode": "560005",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "12.9989444",
            "longitude": "77.5800515"
          },
          "openingHours": [
            "Mo-Th 09:00-20:00",
            "Sa-Su 11:00-16:00"
          ],
          "priceRange": "₹₹",
          "currenciesAccepted": "INR",
          "paymentAccepted": "Cash, Credit Card, UPI",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Hijama Healing Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "MedicalTherapy",
                  "name": "Wet Cupping (Hijama)",
                  "description": "Traditional Islamic wet cupping therapy for detoxification and pain relief"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "MedicalTherapy",
                  "name": "Dry Cupping",
                  "description": "Non-invasive cupping therapy to improve blood flow and relieve muscle tension"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "MedicalTherapy",
                  "name": "Sports Injury Massage",
                  "description": "Specialized massage techniques for sports-related injuries and performance enhancement"
                }
              }
            ]
          },
          "areaServed": {
            "@type": "City",
            "name": "Bangalore"
          },
          "founder": {
            "@type": "Person",
            "name": "Harab",
            "jobTitle": "Managing Director"
          },
          "sameAs": [
            "https://www.facebook.com/hijama-healing",
            "https://www.instagram.com/hijama-healing",
            "https://www.linkedin.com/company/hijama-healing"
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127",
            "bestRating": "5",
            "worstRating": "1"
          },
          "review": [
            {
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": "Ahmed K."
              },
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5",
                "bestRating": "5"
              },
              "reviewBody": "After just three sessions of hijama therapy, my chronic back pain has reduced significantly. I've tried many treatments before, but this approach has been the most effective."
            }
          ]
        })}
        </script>

        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://revivoheal.com/"
            }
          ]
        })}
        </script>
      </Helmet>

      <Hero />
      <Benefits />
      <Services />
      <CuppingInfo />
      <Testimonials />
      <BlogPreview />
      <CTA />
    </Layout>
  );
};

export default Index;

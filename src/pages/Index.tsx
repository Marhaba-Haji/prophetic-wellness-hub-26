
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
        <title>RevivoHeal Bangalore | Centre for Pain Relief & Healing with Cupping & Massage Therapies</title>
        <meta name="description" content="Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies. Natural healing by certified professionals. Book now." />
        <meta name="keywords" content="hijama therapy, cupping therapy, pain relief, natural healing, Islamic medicine, traditional therapy, back pain treatment, migraine relief, sports massage, wet cupping, dry cupping" />
        <meta name="author" content="RevivoHeal" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={currentUrl} />

        <meta property="og:title" content="RevivoHeal Bangalore | Centre for Pain Relief & Healing with Cupping & Massage Therapies" />
        <meta property="og:description" content="Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies. Natural healing by certified professionals. Book now." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={logoUrl} />
        <meta property="og:site_name" content="Revivoheal" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RevivoHeal Bangalore | Centre for Pain Relief with Cupping & Massage" />
        <meta name="twitter:description" content="Get relief from chronic pain with RevivoHeal's cupping and traditional massage therapies. Now in Bangalore." />
        <meta name="twitter:image" content={logoUrl} />
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

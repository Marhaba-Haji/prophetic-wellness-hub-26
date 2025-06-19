
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import Benefits from '@/components/home/Benefits';

const BenefitsPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Benefits of Hijama Cupping Therapy - Natural Pain Relief & Healing</title>
        <meta name="description" content="Discover the proven benefits of Hijama cupping therapy for pain relief, detoxification, improved circulation, and overall wellness. Traditional Islamic healing methods." />
        <meta name="keywords" content="hijama benefits, cupping therapy benefits, natural pain relief, detoxification, blood circulation, traditional healing benefits, islamic medicine benefits" />
        <link rel="canonical" href="https://revivoheal.com/benefits" />
        
        <meta property="og:title" content="Benefits of Hijama Cupping Therapy - Natural Healing" />
        <meta property="og:description" content="Learn about the proven health benefits of Hijama cupping therapy for pain relief and natural healing." />
        <meta property="og:url" content="https://revivoheal.com/benefits" />
        
        <meta name="twitter:title" content="Hijama Cupping Therapy Benefits" />
        <meta name="twitter:description" content="Natural pain relief and healing through traditional Hijama cupping therapy." />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-8 text-center">Benefits of Hijama Therapy</h1>
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg mb-6">
            Hijama therapy offers numerous physical and mental health benefits backed by both traditional Islamic wisdom and modern research.
            The practice has been endorsed by Prophet Muhammad (PBUH) and has been part of Islamic medical tradition for centuries.
          </p>
          <p className="text-lg mb-6">
            Below you'll find detailed information about the specific benefits of hijama therapy for general health and specifically for women's health concerns.
          </p>
        </div>
        
        {/* Include the Benefits component */}
        <Benefits />
      </div>
    </Layout>
  );
};

export default BenefitsPage;

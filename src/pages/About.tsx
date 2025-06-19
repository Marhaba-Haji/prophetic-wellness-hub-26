
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';

const About = () => {
  return (
    <Layout>
      <Helmet>
        <title>About RevivoHeal - Professional Hijama & Cupping Therapy Center in Bangalore</title>
        <meta name="description" content="Learn about RevivoHeal's mission to provide authentic Hijama cupping therapy and traditional healing methods in Bangalore. Meet our certified professionals." />
        <meta name="keywords" content="about revivoheal, hijama center bangalore, cupping therapy clinic, traditional healing, islamic medicine center" />
        <link rel="canonical" href="https://revivoheal.com/about" />
        
        <meta property="og:title" content="About RevivoHeal - Professional Hijama & Cupping Therapy Center" />
        <meta property="og:description" content="Learn about RevivoHeal's mission to provide authentic Hijama cupping therapy and traditional healing methods in Bangalore." />
        <meta property="og:url" content="https://revivoheal.com/about" />
        
        <meta name="twitter:title" content="About RevivoHeal - Hijama Therapy Center" />
        <meta name="twitter:description" content="Professional Hijama cupping therapy and traditional healing in Bangalore." />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-8 text-center">About Us</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-6">
            Welcome to our Hijama Therapy clinic where we specialize in Islamic traditional healing methods (Tibb e Nabwi). 
            Our approach combines traditional Islamic wellness practices with modern therapeutic techniques to address a wide range of health concerns.
          </p>
          <p className="text-lg mb-6">
            This page will contain detailed information about our clinic's history, philosophy, team members, facility, and certifications.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;

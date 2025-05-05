
import React from 'react';
import Layout from '@/components/layout/Layout';

const ServicesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-8 text-center">Our Services</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-6">
            We offer a comprehensive range of professional hijama and complementary therapies to address various health concerns.
          </p>
          <p className="text-lg mb-6">
            This page will contain detailed information about all our services including dry cupping, wet cupping, sports injury massage, 
            deep tissue oil massage, steam bath therapy, leech therapy, and personalized diet plans.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ServicesPage;

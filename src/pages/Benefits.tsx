
import React from 'react';
import Layout from '@/components/layout/Layout';

const BenefitsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-8 text-center">Benefits of Hijama Therapy</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-6">
            Hijama therapy offers numerous physical and mental health benefits backed by both traditional wisdom and modern research.
          </p>
          <p className="text-lg mb-6">
            This page will contain detailed information about all the specific benefits of hijama therapy, conditions treated, 
            scientific evidence, and testimonials from previous clients.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default BenefitsPage;

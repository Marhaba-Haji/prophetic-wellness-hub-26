
import React from 'react';
import Layout from '@/components/layout/Layout';
import Benefits from '@/components/home/Benefits';

const BenefitsPage = () => {
  return (
    <Layout>
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

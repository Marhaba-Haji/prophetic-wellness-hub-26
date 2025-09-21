import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const TreatmentCards = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Traditional Detoxification Therapies
        </h2>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Munzij Mushil Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-64">
              <Image 
                src="/lovable-uploads/detox-card.jpg"
                alt="Full Body Detox"
                layout="fill"
                objectFit="cover"
                className="opacity-90"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Munzij Mushil</h3>
              <p className="text-gray-600 mb-6">
                Experience comprehensive detoxification through this traditional regimen that purifies 
                bodily humor and enhances natural healing mechanisms. Our three-phase program combines 
                herbal ingestion, therapeutic purging, and rejuvenation therapies.
              </p>
              <Link href="/full-body-detox" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Explore Protocol →
              </Link>
            </div>
          </div>

          {/* Regimen Therapy Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-64">
              <Image 
                src="/lovable-uploads/regimen-card.jpg"
                alt="Greek Regimen Therapy"
                layout="fill"
                objectFit="cover"
                className="opacity-90"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ilaj bil Tadbeer</h3>
              <p className="text-gray-600 mb-6">
                Ancient Greek-inspired regimen combining therapeutic diet, herbal remedies, and 
                environmental adjustments to restore optimal health balance. Personalized treatment 
                plans to address individual constitution and health goals.
              </p>
              <Link href="/greek-regimen-therapy" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Discover Regimen →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TreatmentCards;

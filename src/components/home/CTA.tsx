
import React from 'react';
import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-16 bg-brand-green text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience the Benefits of Hijama Therapy?</h2>
          <p className="text-lg mb-8 text-gray-100">
            Book your appointment today and take the first step towards better health and well-being through traditional Islamic medicine.
          </p>
          <Button className="gold-gradient text-white text-lg px-8 py-6 hover:opacity-90 transition-opacity">
            Book Your Appointment
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;

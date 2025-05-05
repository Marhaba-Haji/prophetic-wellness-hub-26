
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden islamic-pattern-bg">
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/80"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-green mb-6 leading-tight">
            Experience the Healing Power of Prophetic Medicine
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Traditional Islamic Hijama therapy for pain relief, improved circulation,
            and overall wellness in a professional, hygienic environment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="gold-gradient text-white text-lg px-8 py-6 hover:opacity-90 transition-opacity">
              Book Appointment
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6 border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

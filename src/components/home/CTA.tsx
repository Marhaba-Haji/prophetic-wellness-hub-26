import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-20 bg-brand-green text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="islamic-pattern-bg w-full h-full"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block p-2 bg-brand-gold bg-opacity-20 rounded-full text-brand-gold text-sm font-medium mb-6">Prophetic Medicine</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Benefits of Hijama Therapy?</h2>
          <div className="h-0.5 w-24 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-lg mb-8 text-gray-100">
            Book your appointment today and take the first step towards better health and well-being through traditional Islamic medicine.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/booking-appointment">
              <Button className="gold-gradient text-white text-lg px-8 py-6 hover:opacity-90 transition-opacity rounded-full">
                <Calendar className="h-5 w-5 mr-2" /> Book An Appointment
              </Button>
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-white/20 rounded-lg p-6 bg-white/5 backdrop-blur">
              <h3 className="font-bold text-xl mb-2">Professional Care</h3>
              <p className="text-sm text-gray-200">Certified practitioners trained in Islamic medicine</p>
            </div>
            <div className="border border-white/20 rounded-lg p-6 bg-white/5 backdrop-blur">
              <h3 className="font-bold text-xl mb-2">Hygienic Environment</h3>
              <p className="text-sm text-gray-200">Sterile equipment and clean treatment rooms</p>
            </div>
            <div className="border border-white/20 rounded-lg p-6 bg-white/5 backdrop-blur">
              <h3 className="font-bold text-xl mb-2">Personalized Approach</h3>
              <p className="text-sm text-gray-200">Customized treatment plans for your specific needs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
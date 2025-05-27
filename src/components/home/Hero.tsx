import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
const Hero = () => {
  return <section className="relative py-24 overflow-hidden islamic-pattern-bg">
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/80"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <div className="h-20 w-20 mx-auto rounded-full bg-white p-3 shadow-lg">
              <img alt="RevivoHeal Logo" className="h-full w-full object-contain" src="https://i.ibb.co/Mksk2rrK/revivoheal-favicon.png" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-green mb-6 leading-tight animate-fade-in">
            Experience the Healing Power of <span className="text-brand-gold">Traditional Medicine</span>
          </h1>
          <div className="h-0.5 w-24 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-700 mb-8">Cupping &amp; massage therapy for pain relief, improved circulation, and overall wellness in a professional, hygienic environment.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/booking-appointment">
              <Button className="gold-gradient text-white text-lg px-8 py-6 hover:opacity-90 transition-opacity rounded-full">
                <Heart className="h-5 w-5 mr-2" /> Book Appointment
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" className="text-lg px-8 py-6 border-brand-green text-brand-green hover:bg-brand-green hover:text-white rounded-full">
                <Calendar className="h-5 w-5 mr-2" /> View Services
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L60,106.7C120,117,240,139,360,133.3C480,128,600,96,720,90.7C840,85,960,107,1080,112C1200,117,1320,107,1380,101.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
    </section>;
};
export default Hero;
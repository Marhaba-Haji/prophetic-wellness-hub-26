import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const FeaturedServices = () => {
  const programs = [
    {
      id: "greek-regimen-therapy",
      title: "Greek Regimen Therapy",
      subtitle: "Ilaj bil Tadbeer",
      description: "Complete detox & healing through ancient Unani regimens. Eliminates chronic pain, restores balance, and naturally heals conditions.",
      icon: <Sparkles className="h-8 w-8" />,
      features: ["Pain Relief", "Detoxification", "Immune Boost", "Holistic Healing"],
      image: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758482343/regimenal_therapy_rilyte.jpg",
      link: "/greek-regimen-therapy",
      color: "primary"
    },
    {
      id: "full-body-detox",
      title: "Full Body Detox Program", 
      subtitle: "Munzij-Mushil Therapy",
      description: "Advanced natural detoxification that removes deep toxins, balances your system, and restores vitality through gentle purgation.",
      icon: <Shield className="h-8 w-8" />,
      features: ["Deep Cleansing", "Metabolic Balance", "Organ Function", "Natural Healing"],
      image: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758482711/MM_therapy_o4b22r.jpg",
      link: "/full-body-detox",
      color: "secondary"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header - Matching Home Theme */}
        <div className="text-center mb-14">
          <span className="text-brand-gold uppercase tracking-wider font-medium">
            Our Signature Programs
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4 mt-2">
            Premium Healing Experiences
          </h2>
          <div className="h-1 w-24 bg-brand-gold mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Our most transformative therapeutic programs, combining ancient Unani wisdom with modern clinical excellence to deliver exceptional healing results.
          </p>
        </div>

        {/* Compact Cards Grid - Always 2 columns on tablet+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {programs.map((program, index) => (
            <Card 
              key={program.id} 
              className="group overflow-hidden border border-gray-200 hover:border-brand-gold transition-all duration-300 hover:shadow-xl bg-white rounded-xl"
            >
              <div className="flex h-full">
                {/* Compact Image - Left side */}
                <div className="w-32 md:w-36 flex-shrink-0">
                  <img 
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  </div>
                  
                {/* Compact Content */}
                <div className="flex-1 p-4 flex flex-col justify-between min-h-0">
                  {/* Card Header - Matching Home Theme */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-10 h-10 rounded-lg bg-${program.color}/10 flex items-center justify-center flex-shrink-0`}>
                        <div className={`text-${program.color}`}>
                          {program.icon}
                        </div>
                      </div>
                      <span className={`text-sm font-semibold text-${program.color} bg-${program.color}/10 px-3 py-1 rounded-full`}>
                        {program.subtitle}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-brand-green group-hover:text-brand-gold transition-colors leading-tight">
                      {program.title}
                    </h3>
                  </div>

                  {/* Card Description - Matching Home Theme */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">
                    {program.description}
                  </p>

                  {/* Card Features - Matching Home Theme */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {program.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className={`h-4 w-4 text-${program.color} flex-shrink-0`} />
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button - Matching Home Theme */}
                  <Link to={program.link} className="block">
                    <Button 
                      className={`w-full h-10 text-sm font-semibold ${
                        program.color === 'primary' 
                          ? 'bg-brand-green hover:bg-brand-green/90 text-white' 
                          : 'bg-brand-gold hover:bg-brand-gold/90 text-white'
                      } rounded-lg group/btn`}
                    >
                      <span>Book Now</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Compact Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-green"></div>
            <span className="font-medium text-brand-green">Doctor Supervised</span>
            </div>
          <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
            <span className="font-medium text-brand-gold">100% Natural</span>
            </div>
          <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-green"></div>
            <span className="font-medium text-brand-green">Clinically Proven</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
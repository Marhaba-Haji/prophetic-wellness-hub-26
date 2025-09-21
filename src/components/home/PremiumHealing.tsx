import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Shield, ArrowRight, CheckCircle } from "lucide-react";

const PremiumHealing = () => {
  const programs = [
    {
      id: "greek-regimen-therapy",
      title: "Greek Regimen Therapy",
      subtitle: "Ilaj bil Tadbeer",
      description: "Complete detox, restoration & healing through time-tested Unani regimens designed to cleanse toxins, restore balance, and naturally heal chronic conditions.",
      icon: <Sparkles className="h-12 w-12" />,
      features: ["Pain Relief", "Detoxification", "Immune Strengthening", "Holistic Healing"],
      link: "/greek-regimen-therapy",
      color: "primary"
    },
    {
      id: "full-body-detox",
      title: "Full Body Detox Program", 
      subtitle: "Munzij-Mushil Therapy",
      description: "Clinically supervised Unani therapy that gently removes deep-rooted toxins, balances your system, and restores vitality through natural purgation.",
      icon: <Shield className="h-12 w-12" />,
      features: ["Deep Cleansing", "Metabolic Balance", "Organ Function", "Natural Healing"],
      link: "/full-body-detox",
      color: "secondary"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
            <Sparkles className="h-4 w-4" />
            Our Signature Programs
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-green mb-6 leading-tight">
            Premium <span className="text-brand-gold">Healing Experiences</span>
          </h2>
          <div className="h-0.5 w-24 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Our most sought-after therapeutic programs, meticulously crafted by combining{" "}
            <span className="text-primary font-semibold">ancient Unani wisdom</span> with{" "}
            <span className="text-secondary font-semibold">modern clinical excellence</span>
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {programs.map((program, index) => (
            <Card 
              key={program.id} 
              className="medical-card group overflow-hidden border border-gray-200 hover:border-brand-gold transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-brand-green-light/5 to-brand-green/5 p-8">
                {/* Program Header */}
                <div className="flex items-start gap-6 mb-6">
                  <div className={`p-4 rounded-full bg-${program.color}/20 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`text-${program.color}`}>
                      {program.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-green mb-2 group-hover:text-brand-gold transition-colors">
                      {program.title}
                    </h3>
                    <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold bg-${program.color}/15 text-${program.color} border border-${program.color}/30`}>
                      {program.subtitle}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed mb-6">
                  {program.description}
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {program.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-colors border border-gray-100"
                    >
                      <CheckCircle className={`h-5 w-5 text-${program.color} flex-shrink-0`} />
                      <span className="font-medium text-sm text-gray-800">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link to={program.link} className="block">
                  <Button 
                    className={`w-full h-14 text-lg font-semibold bg-${program.color} hover:bg-${program.color}/90 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group/btn`}
                  >
                    <span>Discover & Book Your Healing Journey</span>
                    <ArrowRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="inline-flex items-center gap-8 bg-white px-8 py-4 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              <span className="font-semibold text-gray-800">Doctor Supervised</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-secondary animate-pulse"></div>
              <span className="font-semibold text-gray-800">100% Natural</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              <span className="font-semibold text-gray-800">Clinically Proven</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumHealing;

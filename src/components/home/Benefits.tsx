
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Shield, BookOpen, Pill } from 'lucide-react';

const benefits = [
  {
    icon: <Heart className="h-10 w-10" />,
    title: "Improved Circulation",
    description: "Enhances blood flow throughout the body, promoting healing and oxygen delivery to tissues."
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Pain Relief",
    description: "Reduces various types of pain including back, neck, shoulder, and joint discomfort."
  },
  {
    icon: <BookOpen className="h-10 w-10" />,
    title: "Prophetic Tradition",
    description: "Following the Sunnah of Prophet Muhammad (PBUH) who recommended Hijama as a beneficial treatment."
  },
  {
    icon: <Pill className="h-10 w-10" />,
    title: "Detoxification",
    description: "Removes toxins and impurities from the body, supporting liver and kidney function."
  }
];

const Benefits = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-brand-gold uppercase tracking-wider font-medium">Why Choose Hijama</span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4 mt-2">Key Benefits of Hijama Therapy</h2>
          <div className="h-0.5 w-24 bg-brand-gold mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Discover how our professional hijama treatments can improve your health and well-being through these evidence-based benefits.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="medical-card border border-gray-100 hover:border-brand-gold transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="service-icon text-brand-green mx-auto mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-brand-green mb-2">{benefit.title}</h3>
                <div className="h-0.5 w-12 bg-brand-gold mx-auto mb-3"></div>
                <p className="text-gray-700">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;


import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { HeartPulse, BookOpen, BriefcaseMedical, Flame, DropletIcon, CheckCircle, Utensils } from 'lucide-react';

const ServicesPage = () => {
  const allServices = [
    {
      icon: <HeartPulse className="h-12 w-12" />,
      title: "Dry Cupping",
      description: "Non-invasive therapy that uses suction to improve blood flow and relieve muscle tension."
    },
    {
      icon: <BookOpen className="h-12 w-12" />,
      title: "Wet Cupping",
      description: "Traditional Hijama therapy that involves creating small incisions for detoxification and healing."
    },
    {
      icon: <BriefcaseMedical className="h-12 w-12" />,
      title: "Sports Injury Massage",
      description: "Specialized massage techniques to treat and prevent sports-related injuries and improve performance."
    },
    {
      icon: <Flame className="h-12 w-12" />,
      title: "Deep Tissue Oil Massage",
      description: "Therapeutic massage that targets deeper layers of muscle and connective tissue for chronic pain relief."
    },
    {
      icon: <DropletIcon className="h-12 w-12" />,
      title: "Leech Therapy",
      description: "Ancient medical treatment using medicinal leeches to improve blood circulation and relieve pain."
    },
    {
      icon: <CheckCircle className="h-12 w-12" />,
      title: "Steam Bath Therapy",
      description: "Relaxing steam treatment that opens pores, improves circulation, and detoxifies the body."
    },
    {
      icon: <Utensils className="h-12 w-12" />,
      title: "Personalized Diet Plans",
      description: "Customized nutritional guidance based on Islamic principles and your specific health needs."
    }
  ];
  
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-8 text-center">Our Services</h1>
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg mb-6">
            We offer a comprehensive range of professional hijama and complementary therapies to address various health concerns.
          </p>
          <p className="text-lg mb-6">
            Each treatment is performed following the highest standards of hygiene and safety by our qualified practitioners.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allServices.map((service, index) => (
            <Card key={index} className="medical-card border border-gray-100 hover:border-brand-gold overflow-hidden transition-all duration-300">
              <div className="h-2 bg-brand-green"></div>
              <CardContent className="p-8 text-center">
                <div className="service-icon text-brand-green mx-auto mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold text-brand-green mb-3">{service.title}</h3>
                <div className="h-0.5 w-12 bg-brand-gold mx-auto mb-4"></div>
                <p className="text-gray-700 mb-6">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ServicesPage;

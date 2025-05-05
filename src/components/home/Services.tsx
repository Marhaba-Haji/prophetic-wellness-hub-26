
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookOpen, HeartPulse, BriefcaseMedical } from 'lucide-react';

const services = [
  {
    id: "dry-cupping",
    icon: <HeartPulse className="h-12 w-12" />,
    title: "Dry Cupping",
    description: "Non-invasive therapy that uses suction to improve blood flow and relieve muscle tension."
  },
  {
    id: "wet-cupping",
    icon: <BookOpen className="h-12 w-12" />,
    title: "Wet Cupping",
    description: "Traditional Hijama therapy that involves creating small incisions for detoxification and healing."
  },
  {
    id: "sports-massage",
    icon: <BriefcaseMedical className="h-12 w-12" />,
    title: "Sports Injury Massage",
    description: "Specialized massage techniques to treat and prevent sports-related injuries and improve performance."
  }
];

const Services = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-brand-gold uppercase tracking-wider font-medium">Our Treatments</span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4 mt-2">Our Services</h2>
          <div className="h-0.5 w-24 bg-brand-gold mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We offer a range of professional hijama and complementary therapies to address various health concerns.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="medical-card border border-gray-100 hover:border-brand-gold overflow-hidden transition-all duration-300">
              <div className="h-2 bg-brand-green"></div>
              <CardContent className="p-8 text-center">
                <div className="service-icon text-brand-green mx-auto mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold text-brand-green mb-3">{service.title}</h3>
                <div className="h-0.5 w-12 bg-brand-gold mx-auto mb-4"></div>
                <p className="text-gray-700 mb-6">{service.description}</p>
                <Link to={`/service/${service.id}`}>
                  <Button variant="outline" className="text-brand-green border-brand-green hover:bg-brand-green hover:text-white rounded-full transition-all">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/services">
            <Button className="gold-gradient text-white hover:opacity-90 transition-opacity rounded-full px-8">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;

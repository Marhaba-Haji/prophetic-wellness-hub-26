import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Droplets, Hand } from "lucide-react";

const mainServices = [
  {
    id: "unani-healthcare",
    icon: <Heart className="h-16 w-16" />,
    title: "Unani Health Care",
    description: "Traditional Islamic medicine focusing on holistic healing through natural remedies, dietary therapy, and lifestyle modifications for complete wellness.",
    features: ["Natural Remedies", "Dietary Therapy", "Lifestyle Guidance", "Holistic Approach"],
    color: "from-emerald-500 to-teal-600",
    bgColor: "from-emerald-50 to-teal-50"
  },
  {
    id: "cupping-therapy",
    icon: <Droplets className="h-16 w-16" />,
    title: "Cupping Therapy",
    description: "Ancient healing technique using suction cups to improve blood circulation, relieve pain, and promote natural healing processes.",
    features: ["Pain Relief", "Improved Circulation", "Detoxification", "Muscle Relaxation"],
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50"
  },
  {
    id: "acupressure-therapy",
    icon: <Hand className="h-16 w-16" />,
    title: "Acupressure Therapy",
    description: "Traditional healing method using finger pressure on specific points to restore energy flow and promote natural healing.",
    features: ["Energy Balance", "Stress Relief", "Pain Management", "Wellness Enhancement"],
    color: "from-purple-500 to-violet-600",
    bgColor: "from-purple-50 to-violet-50"
  }
];

const MainServices = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-gold uppercase tracking-wider font-medium text-sm">
            Our Expertise
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-green mb-6 mt-4">
            Comprehensive Healing Services
          </h2>
          <div className="h-1 w-32 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Experience the power of traditional healing methods combined with modern care. 
            Our three core services work together to provide complete wellness solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {mainServices.map((service, index) => (
            <div key={index} className="group">
              <Card className="h-full overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 shadow-lg">
                <div className={`bg-gradient-to-br ${service.bgColor} p-8 text-center relative overflow-hidden`}>
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 right-4 w-20 h-20 border-2 border-current rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-current rounded-full"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`bg-gradient-to-r ${service.color} p-6 rounded-full inline-block mb-8 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <div className="text-white">{service.icon}</div>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-brand-green mb-4 group-hover:text-brand-gold transition-colors">
                      {service.title}
                    </h3>
                    
                    <div className={`h-1 w-20 bg-gradient-to-r ${service.color} mx-auto mb-6 group-hover:w-32 transition-all duration-300`}></div>
                  </div>
                </div>
                
                <CardContent className="p-8">
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="mb-8">
                    <h4 className="text-brand-green font-semibold mb-4 text-lg">Key Benefits:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <div className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full mr-3`}></div>
                          <span className="text-gray-600 text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Link to={service.id === "unani-healthcare" ? "/unani-healthcare" : service.id === "cupping-therapy" ? "/cupping-therapy" : service.id === "acupressure-therapy" ? "/acupressure-therapy" : `/services#${service.id}`}>
                      <Button
                        className={`bg-gradient-to-r ${service.color} text-white hover:opacity-90 transition-all duration-300 rounded-full px-8 py-3 text-lg font-medium shadow-md hover:shadow-lg group-hover:scale-105`}
                      >
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-brand-green mb-4">
              Ready to Begin Your Healing Journey?
            </h3>
            <p className="text-gray-700 mb-6 text-lg">
              Book a consultation to discover which service is right for you, or combine multiple therapies for optimal results.
            </p>
            <div className="flex justify-center">
              <Link to="/booking">
                <Button className="gold-gradient text-white hover:opacity-90 transition-opacity rounded-full px-8 py-4 text-lg font-medium shadow-md hover:shadow-lg">
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainServices;

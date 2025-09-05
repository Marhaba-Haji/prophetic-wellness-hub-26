import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HeartPulse, BookOpen, BriefcaseMedical } from "lucide-react";

const services = [
  {
    id: "dry-cupping",
    icon: <HeartPulse className="h-12 w-12" />,
    title: "Dry Cupping",
    description:
      "Non-invasive therapy that uses suction to improve blood flow and relieve muscle tension.",
  },
  {
    id: "wet-cupping",
    icon: <BookOpen className="h-12 w-12" />,
    title: "Wet Cupping",
    description:
      "Traditional Hijama therapy that involves creating small incisions for detoxification and healing.",
  },
  {
    id: "sports-massage",
    icon: <BriefcaseMedical className="h-12 w-12" />,
    title: "Sports Injury Massage",
    description:
      "Specialized massage techniques to treat and prevent sports-related injuries and improve performance.",
  },
];

const Services = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-brand-gold uppercase tracking-wider font-medium">
            Our Treatments
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4 mt-2">
            Our Services
          </h2>
          <div className="h-1 w-24 bg-brand-gold mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We offer a range of professional hijama and complementary therapies
            to address various health concerns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link to={`/service/${service.id}`} key={index} className="group">
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-t-4 border-t-brand-green group">
                <div className="bg-gradient-to-r from-brand-green-light/10 to-brand-green/10 p-6 text-center">
                  <div className="bg-white p-4 rounded-full inline-block mb-6 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all">
                    <div className="text-brand-green">{service.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-green mb-3">
                    {service.title}
                  </h3>
                  <div className="h-1 w-16 bg-brand-gold mx-auto mb-4 group-hover:w-24 transition-all"></div>
                </div>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  <Button
                    variant="outline"
                    className="rounded-full border-brand-green text-brand-green px-6 py-2 hover:bg-brand-green hover:text-white transition-colors group-hover:bg-brand-green group-hover:text-white"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/services">
            <Button className="gold-gradient text-white hover:opacity-90 transition-opacity rounded-full px-8 py-6 text-lg font-medium shadow-md hover:shadow-lg">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;

import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { HeartPulse, BookOpen, BriefcaseMedical, Flame, DropletIcon, CheckCircle, Utensils } from 'lucide-react';
const ServicesPage = () => {
  const allServices = [{
    id: "dry-cupping",
    icon: <HeartPulse className="h-12 w-12" />,
    title: "Dry Cupping",
    description: "Non-invasive therapy that uses suction to improve blood flow and relieve muscle tension."
  }, {
    id: "wet-cupping",
    icon: <BookOpen className="h-12 w-12" />,
    title: "Wet Cupping",
    description: "Traditional Hijama therapy that involves creating small incisions for detoxification and healing."
  }, {
    id: "sports-massage",
    icon: <BriefcaseMedical className="h-12 w-12" />,
    title: "Sports Injury Massage",
    description: "Specialized massage techniques to treat and prevent sports-related injuries and improve performance."
  }, {
    id: "deep-tissue-massage",
    icon: <Flame className="h-12 w-12" />,
    title: "Deep Tissue Oil Massage",
    description: "Therapeutic massage that targets deeper layers of muscle and connective tissue for chronic pain relief."
  }, {
    id: "leech-therapy",
    icon: <DropletIcon className="h-12 w-12" />,
    title: "Leech Therapy",
    description: "Ancient medical treatment using medicinal leeches to improve blood circulation and relieve pain."
  }, {
    id: "steam-bath",
    icon: <CheckCircle className="h-12 w-12" />,
    title: "Steam Bath Therapy",
    description: "Relaxing steam treatment that opens pores, improves circulation, and detoxifies the body."
  }, {
    id: "diet-plans",
    icon: <Utensils className="h-12 w-12" />,
    title: "Personalized Diet Plans",
    description: "Customized nutritional guidance based on Islamic principles and your specific health needs."
  }];
  const ServicePriceChart = () => <section className="my-16 mx-auto max-w-5xl px-4">
    <h2 className="text-2xl md:text-3xl font-bold text-brand-green text-center mb-6 tracking-tight">
      Service Price Chart
    </h2>
    <div className="flex flex-col md:flex-row gap-6">
      {/* Massage Therapy */}
      <div className="bg-white/90 rounded-lg shadow p-6 flex-1">
        <h3 className="text-xl font-semibold text-amber-900 mb-4 text-center">Massage Therapy</h3>
        <ul className="space-y-2 text-amber-900">
          <li className="flex justify-between border-b pb-2"><span>Dry Cupping Massage</span> <span>₹ 999</span></li>
          <li className="flex justify-between border-b pb-2"><span>Sports Gun Massage with dry cupping</span> <span>₹ 999</span></li>
          <li className="flex justify-between border-b pb-2"><span>Sports Scraping Massage with dry cupping</span> <span>₹ 1999</span></li>
          <li className="flex justify-between border-b pb-2"><span>Sports Combo Massage with dry cupping</span> <span>₹ 2499</span></li>
          <li className="flex justify-between"><span>Facial Massage</span> <span>₹ 499</span></li>
        </ul>
      </div>
      {/* Hijama Therapy */}
      <div className="bg-white/90 rounded-lg shadow p-6 flex-1">
        <h3 className="text-xl font-semibold text-amber-900 mb-4 text-center">Hijama Therapy</h3>
        <ul className="space-y-2 text-amber-900">
          <li className="flex justify-between border-b pb-2"><span>Wet Cupping</span> <span>₹ 999</span></li>
          <li className="flex justify-between border-b pb-2"><span>Unlimited Wet Cupping</span> <span>₹ 1499</span></li>
          <li className="flex justify-between border-b pb-2"><span>Unlimited Dry & Wet Cupping with Scraping</span> <span>₹ 2499</span></li>
          <li className="flex justify-between"><span>Facial Wet Cupping</span> <span>₹ 749</span></li>
        </ul>
      </div>
    </div>
    <div className="flex flex-col md:flex-row gap-6 mt-6">
      {/* Add Ons */}
      <div className="bg-white/90 rounded-lg shadow p-6 flex-1">
        <h3 className="text-xl font-semibold text-amber-900 mb-4 text-center">Add ons</h3>
        <ul className="space-y-2 text-amber-900">
          <li className="flex justify-between border-b pb-2"><span>Dry Cup</span> <span>₹ 99</span></li>
          <li className="flex justify-between"><span>Wet Cup</span> <span>₹ 149</span></li>
        </ul>
      </div>
      {/* Massage with Steam Therapy */}
      <div className="bg-emerald-900/90 rounded-lg shadow p-6 flex-1">
        <h3 className="text-xl font-semibold text-brand-gold mb-4 text-center">Massage with Steam Therapy</h3>
        <ul className="space-y-2 text-brand-gold">
          <li className="flex justify-between border-b pb-2"><span>Dry Cupping Massage</span> <span>₹ 1749</span></li>
          <li className="flex justify-between border-b pb-2"><span>Sports Gun Massage with full body steam</span> <span>₹ 1749</span></li>
          <li className="flex justify-between border-b pb-2"><span>Sports Scraping Massage with full body steam</span> <span>₹ 2749</span></li>
          <li className="flex justify-between"><span>Sports Combo Massage with full body steam</span> <span>₹ 2999</span></li>
        </ul>
      </div>
    </div>
    <div className="text-center text-gray-500 mt-8 text-xs">
      
      
    </div>
  </section>;
  return <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-5xl font-bold text-brand-green mb-2 text-center">Our Services</h1>
        <div className="h-1 w-24 bg-brand-gold mx-auto mb-8"></div>
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg mb-6 text-center">
            We offer a comprehensive range of professional hijama and complementary therapies to address various health concerns.
          </p>
          <p className="text-lg mb-6 text-center">
            Each treatment is performed following the highest standards of hygiene and safety by our qualified practitioners.
          </p>
        </div>
        {/* Insert price chart below header and intro */}
        <ServicePriceChart />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allServices.map((service, index) => <Link to={`/service/${service.id}`} key={index} className="group">
              <Card className="service-card border-t-4 border-brand-green overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl h-full">
                <div className="text-center px-4 pt-8">
                  <div className="flex justify-center">
                    <div className="service-icon bg-brand-green/10 p-6 rounded-full mb-6 group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                      <div className="text-brand-green group-hover:text-white transition-colors">{service.icon}</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-green mb-3">{service.title}</h3>
                  <div className="h-1 w-16 bg-brand-gold mx-auto mb-4 group-hover:w-24 transition-all"></div>
                </div>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  <Button variant="outline" className="rounded-full border-brand-green text-brand-green px-6 py-2 hover:bg-brand-green hover:text-white transition-colors group-hover:bg-brand-green group-hover:text-white">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Link>)}
        </div>
      </div>
    </Layout>;
};
export default ServicesPage;
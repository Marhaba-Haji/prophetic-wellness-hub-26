import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hand, Calendar, ArrowRight, Zap, Shield, Heart, Leaf } from "lucide-react";
import { Link } from "react-router-dom";

const acupressureServices = [
  {
    id: "sciatica-pain-therapy",
    name: "Sciatica Pain Therapy",
    category: "Pain Management",
    description: "Targeted pressure point therapy to relieve sciatic nerve pain and improve mobility through natural healing techniques.",
    icon: <Zap className="h-8 w-8" />,
    color: "from-blue-500 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50"
  },
  {
    id: "lumbar-pain-therapy",
    name: "Lumbar Pain Therapy",
    category: "Pain Management",
    description: "Lower back pain relief through strategic acupressure points that target muscle tension and spinal alignment.",
    icon: <Shield className="h-8 w-8" />,
    color: "from-green-500 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50"
  },
  {
    id: "varicose-veins-therapy",
    name: "Varicose Veins Therapy",
    category: "Circulatory",
    description: "Circulation improvement and vein health restoration through specialized pressure point techniques.",
    icon: <Heart className="h-8 w-8" />,
    color: "from-purple-500 to-violet-600",
    bgColor: "from-purple-50 to-violet-50"
  },
  {
    id: "general-reflexology",
    name: "General Reflexology",
    category: "Wellness",
    description: "Full-body wellness through foot and hand reflexology, promoting overall health and energy balance.",
    icon: <Hand className="h-8 w-8" />,
    color: "from-orange-500 to-amber-600",
    bgColor: "from-orange-50 to-amber-50"
  },
  {
    id: "facial-acne-therapy",
    name: "Facial & Acne Therapy",
    category: "Dermatological",
    description: "Natural skin healing and acne treatment through facial acupressure points and lymphatic drainage.",
    icon: <Leaf className="h-8 w-8" />,
    color: "from-pink-500 to-rose-600",
    bgColor: "from-pink-50 to-rose-50"
  },
  {
    id: "knee-pain-therapy",
    name: "Knee Pain Therapy",
    category: "Pain Management",
    description: "Knee joint pain relief and mobility improvement through targeted acupressure and meridian therapy.",
    icon: <Zap className="h-8 w-8" />,
    color: "from-teal-500 to-cyan-600",
    bgColor: "from-teal-50 to-cyan-50"
  },
  {
    id: "thyroid-management",
    name: "Thyroid Management",
    category: "Endocrine",
    description: "Thyroid function regulation and hormone balance through specialized acupressure techniques.",
    icon: <Shield className="h-8 w-8" />,
    color: "from-yellow-500 to-orange-600",
    bgColor: "from-yellow-50 to-orange-50"
  },
  {
    id: "cervical-spondylitis",
    name: "Cervical Spondylitis",
    category: "Musculoskeletal",
    description: "Neck pain and stiffness relief through cervical spine acupressure and muscle relaxation techniques.",
    icon: <Heart className="h-8 w-8" />,
    color: "from-red-500 to-pink-600",
    bgColor: "from-red-50 to-pink-50"
  },
  {
    id: "pcod-therapy",
    name: "PCOD Therapy",
    category: "Reproductive Health",
    description: "Polycystic ovary syndrome management through hormonal balance acupressure and lifestyle support.",
    icon: <Hand className="h-8 w-8" />,
    color: "from-violet-500 to-purple-600",
    bgColor: "from-violet-50 to-purple-50"
  },
  {
    id: "bulky-uterus-therapy",
    name: "Bulky Uterus Therapy",
    category: "Reproductive Health",
    description: "Uterine health improvement and size reduction through specialized reproductive acupressure therapy.",
    icon: <Leaf className="h-8 w-8" />,
    color: "from-indigo-500 to-blue-600",
    bgColor: "from-indigo-50 to-blue-50"
  }
];

const AcupressureTherapy = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("All Treatments");
  const categories = [...new Set(acupressureServices.map(service => service.category))];

  const filteredServices = selectedCategory === "All Treatments"
    ? acupressureServices
    : acupressureServices.filter(service => service.category === selectedCategory);

  return (
    <Layout
      title="Acupressure Therapy"
      description="Experience the ancient healing power of acupressure therapy. Our specialized treatments use finger pressure on specific meridian points to restore energy flow, relieve pain, and promote natural healing throughout your body."
      canonical="https://propheticwellness.in/acupressure-therapy"
      image="/lovable-uploads/lovable-logo.png"
      keywords="acupressure, therapy, prophetic wellness, healing, pain relief"
    >

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-gold uppercase tracking-wider font-medium text-sm">
              Our Treatments
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4 mt-2">
              Specialized Acupressure Services
            </h2>
            <div className="h-1 w-24 bg-brand-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our experienced practitioners provide targeted acupressure treatments for various health conditions.
              Each session is customized to address your specific needs and promote optimal healing.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge
              variant={selectedCategory === "All Treatments" ? "default" : "outline"}
              className="px-4 py-2 text-sm border-brand-green text-brand-green hover:bg-brand-green hover:text-white cursor-pointer"
              onClick={() => setSelectedCategory("All Treatments")}
            >
              All Treatments
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="px-4 py-2 text-sm border-brand-green text-brand-green hover:bg-brand-green hover:text-white cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <Card key={index} className="group h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 shadow-md">
                <div className={`bg-gradient-to-br ${service.bgColor} p-6 text-center relative overflow-hidden`}>
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-2 right-2 w-12 h-12 border-2 border-current rounded-full"></div>
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-2 border-current rounded-full"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`bg-gradient-to-r ${service.color} p-4 rounded-full inline-block mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <div className="text-white">{service.icon}</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-brand-green mb-2 group-hover:text-brand-gold transition-colors">
                      {service.name}
                    </h3>
                    
                    <Badge variant="secondary" className="mb-4 bg-white/80 text-gray-700 hover:bg-white">
                      {service.category}
                    </Badge>
                    
                    <div className={`h-1 w-16 bg-gradient-to-r ${service.color} mx-auto group-hover:w-24 transition-all duration-300`}></div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="text-center">
                    <Link to={`/booking?treatment=${service.id}`}>
                      <Button
                        className={`bg-gradient-to-r ${service.color} text-white hover:opacity-90 transition-all duration-300 rounded-full px-6 py-2 text-sm font-medium shadow-md hover:shadow-lg group-hover:scale-105 w-full`}
                      >
                        Book Treatment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-brand-green mb-4">
                Why Choose Acupressure Therapy?
              </h3>
              <div className="h-1 w-20 bg-brand-gold mx-auto mb-6"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-full inline-block mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-brand-green mb-2">Pain Relief</h4>
                <p className="text-gray-600 text-sm">Natural pain management without medication side effects</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-full inline-block mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-brand-green mb-2">Energy Balance</h4>
                <p className="text-gray-600 text-sm">Restore natural energy flow and vitality</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 rounded-full inline-block mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-brand-green mb-2">Stress Reduction</h4>
                <p className="text-gray-600 text-sm">Deep relaxation and mental clarity</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-4 rounded-full inline-block mb-4">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-brand-green mb-2">Holistic Healing</h4>
                <p className="text-gray-600 text-sm">Address root causes, not just symptoms</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-brand-green/5 to-brand-gold/5 rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-brand-green mb-4">
                Ready to Experience Natural Healing?
              </h3>
              <p className="text-gray-700 mb-6 text-lg">
                Our certified acupressure therapists will create a personalized treatment plan 
                to address your specific health concerns and promote lasting wellness.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/booking">
                  <Button className="gold-gradient text-white hover:opacity-90 transition-opacity rounded-full px-8 py-4 text-lg font-medium shadow-md hover:shadow-lg">
                    <Calendar className="h-5 w-5 mr-2" /> Book Consultation
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="text-lg px-8 py-4 border-brand-green text-brand-green hover:bg-brand-green hover:text-white rounded-full transition-colors"
                  >
                    Ask Questions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AcupressureTherapy;


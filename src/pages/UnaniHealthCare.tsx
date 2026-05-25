import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Leaf, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const unaniTreatments = [
  {
    id: "hypertension",
    name: "Hypertension",
    category: "Cardiovascular",
    description: "Natural blood pressure management through herbal remedies and lifestyle modifications.",
    icon: <Heart className="h-8 w-8" />,
    color: "from-red-500 to-pink-600",
    bgColor: "from-red-50 to-pink-50"
  },
  {
    id: "diabetes",
    name: "Diabetes",
    category: "Metabolic",
    description: "Blood sugar control using traditional herbs and dietary therapy.",
    icon: <Zap className="h-8 w-8" />,
    color: "from-blue-500 to-cyan-600",
    bgColor: "from-blue-50 to-cyan-50"
  },
  {
    id: "bronchitis",
    name: "Bronchitis",
    category: "Respiratory",
    description: "Respiratory healing with natural expectorants and anti-inflammatory herbs.",
    icon: <Leaf className="h-8 w-8" />,
    color: "from-green-500 to-emerald-600",
    bgColor: "from-green-50 to-emerald-50"
  },
  {
    id: "asthma",
    name: "Asthma",
    category: "Respiratory",
    description: "Breathing improvement through herbal bronchodilators and lung strengthening.",
    icon: <Shield className="h-8 w-8" />,
    color: "from-teal-500 to-green-600",
    bgColor: "from-teal-50 to-green-50"
  },
  {
    id: "cardiac-failure",
    name: "Cardiac Failure",
    category: "Cardiovascular",
    description: "Heart function support with cardiac tonics and circulation enhancers.",
    icon: <Heart className="h-8 w-8" />,
    color: "from-red-600 to-rose-700",
    bgColor: "from-red-50 to-rose-50"
  },
  {
    id: "varicose-veins",
    name: "Varicose Veins",
    category: "Circulatory",
    description: "Vein health improvement through circulation-boosting herbs and topical treatments.",
    icon: <Zap className="h-8 w-8" />,
    color: "from-purple-500 to-violet-600",
    bgColor: "from-purple-50 to-violet-50"
  },
  {
    id: "indigestion",
    name: "Indigestion",
    category: "Digestive",
    description: "Digestive health restoration with carminative herbs and digestive enzymes.",
    icon: <Leaf className="h-8 w-8" />,
    color: "from-orange-500 to-amber-600",
    bgColor: "from-orange-50 to-amber-50"
  },
  {
    id: "acidity",
    name: "Acidity",
    category: "Digestive",
    description: "Acid balance restoration using alkaline herbs and dietary modifications.",
    icon: <Shield className="h-8 w-8" />,
    color: "from-yellow-500 to-orange-600",
    bgColor: "from-yellow-50 to-orange-50"
  },
  {
    id: "jaundice",
    name: "Jaundice",
    category: "Hepatic",
    description: "Liver function support with hepatoprotective herbs and detoxification.",
    icon: <Heart className="h-8 w-8" />,
    color: "from-yellow-600 to-amber-700",
    bgColor: "from-yellow-50 to-amber-50"
  },
  {
    id: "gall-bladder-stones",
    name: "Gall Bladder Stones",
    category: "Hepatic",
    description: "Natural stone dissolution using lithotriptic herbs and bile flow enhancers.",
    icon: <Zap className="h-8 w-8" />,
    color: "from-lime-500 to-green-600",
    bgColor: "from-lime-50 to-green-50"
  },
  {
    id: "hemorrhoids-piles",
    name: "Hemorrhoids / Piles",
    category: "Digestive",
    description: "Pain relief and healing with astringent herbs and anti-inflammatory treatments.",
    icon: <Leaf className="h-8 w-8" />,
    color: "from-rose-500 to-pink-600",
    bgColor: "from-rose-50 to-pink-50"
  },
  {
    id: "creatinine",
    name: "Creatinine",
    category: "Renal",
    description: "Kidney function improvement with nephroprotective herbs and detoxification.",
    icon: <Shield className="h-8 w-8" />,
    color: "from-indigo-500 to-blue-600",
    bgColor: "from-indigo-50 to-blue-50"
  },
  {
    id: "psoriasis",
    name: "Psoriasis",
    category: "Dermatological",
    description: "Skin healing with anti-inflammatory herbs and immune system modulation.",
    icon: <Heart className="h-8 w-8" />,
    color: "from-slate-500 to-gray-600",
    bgColor: "from-slate-50 to-gray-50"
  },
  {
    id: "kidney-stones",
    name: "Kidney Stones",
    category: "Renal",
    description: "Natural stone prevention and treatment with diuretic and lithotriptic herbs.",
    icon: <Zap className="h-8 w-8" />,
    color: "from-cyan-500 to-blue-600",
    bgColor: "from-cyan-50 to-blue-50"
  },
  {
    id: "high-cholesterol",
    name: "High Cholesterol",
    category: "Metabolic",
    description: "Cholesterol management through lipid-lowering herbs and dietary therapy.",
    icon: <Leaf className="h-8 w-8" />,
    color: "from-emerald-500 to-teal-600",
    bgColor: "from-emerald-50 to-teal-50"
  },
  {
    id: "thyroidism",
    name: "Thyroidism",
    category: "Endocrine",
    description: "Thyroid function regulation with hormone-balancing herbs and minerals.",
    icon: <Shield className="h-8 w-8" />,
    color: "from-violet-500 to-purple-600",
    bgColor: "from-violet-50 to-purple-50"
  },
  {
    id: "osteoarthritis",
    name: "Osteoarthritis",
    category: "Musculoskeletal",
    description: "Joint health restoration with anti-inflammatory herbs and cartilage support.",
    icon: <Heart className="h-8 w-8" />,
    color: "from-amber-500 to-yellow-600",
    bgColor: "from-amber-50 to-yellow-50"
  },
  {
    id: "spondylitis",
    name: "Spondylitis",
    category: "Musculoskeletal",
    description: "Spinal health improvement with anti-inflammatory and analgesic herbs.",
    icon: <Zap className="h-8 w-8" />,
    color: "from-stone-500 to-gray-600",
    bgColor: "from-stone-50 to-gray-50"
  },
  {
    id: "back-pain",
    name: "Back Pain",
    category: "Musculoskeletal",
    description: "Pain relief and muscle relaxation with analgesic and anti-inflammatory herbs.",
    icon: <Leaf className="h-8 w-8" />,
    color: "from-neutral-500 to-stone-600",
    bgColor: "from-neutral-50 to-stone-50"
  },
  {
    id: "arthritis",
    name: "Arthritis",
    category: "Musculoskeletal",
    description: "Joint inflammation reduction with anti-rheumatic herbs and pain management.",
    icon: <Shield className="h-8 w-8" />,
    color: "from-orange-600 to-red-600",
    bgColor: "from-orange-50 to-red-50"
  },
  {
    id: "rhinitis",
    name: "Rhinitis",
    category: "Respiratory",
    description: "Nasal inflammation relief with anti-allergic herbs and immune support.",
    icon: <Heart className="h-8 w-8" />,
    color: "from-sky-500 to-blue-600",
    bgColor: "from-sky-50 to-blue-50"
  },
  {
    id: "sinusitis",
    name: "Sinusitis",
    category: "Respiratory",
    description: "Sinus health restoration with decongestant herbs and anti-inflammatory treatments.",
    icon: <Zap className="h-8 w-8" />,
    color: "from-blue-600 to-indigo-600",
    bgColor: "from-blue-50 to-indigo-50"
  },
  {
    id: "paralysis",
    name: "Paralysis",
    category: "Neurological",
    description: "Nerve function restoration with neuroprotective herbs and circulation enhancers.",
    icon: <Leaf className="h-8 w-8" />,
    color: "from-gray-600 to-slate-700",
    bgColor: "from-gray-50 to-slate-50"
  },
  {
    id: "migraine",
    name: "Migraine",
    category: "Neurological",
    description: "Headache relief with analgesic herbs and vasodilator treatments.",
    icon: <Shield className="h-8 w-8" />,
    color: "from-purple-600 to-violet-700",
    bgColor: "from-purple-50 to-violet-50"
  },
  {
    id: "kidney-failure",
    name: "Kidney Failure",
    category: "Renal",
    description: "Kidney function support with nephroprotective herbs and detoxification therapy.",
    icon: <Heart className="h-8 w-8" />,
    color: "from-blue-700 to-indigo-700",
    bgColor: "from-blue-50 to-indigo-50"
  },
  {
    id: "uric-acid",
    name: "Uric Acid",
    category: "Metabolic",
    description: "Uric acid balance with purine-reducing herbs and alkalizing treatments.",
    icon: <Zap className="h-8 w-8" />,
    color: "from-green-600 to-emerald-700",
    bgColor: "from-green-50 to-emerald-50"
  },
  {
    id: "eczema",
    name: "Eczema",
    category: "Dermatological",
    description: "Skin inflammation relief with anti-inflammatory herbs and moisturizing treatments.",
    icon: <Leaf className="h-8 w-8" />,
    color: "from-pink-600 to-rose-700",
    bgColor: "from-pink-50 to-rose-50"
  }
];

const UnaniHealthCare = () => {
  const categories = [...new Set(unaniTreatments.map(treatment => treatment.category))];
  const [selectedCategory, setSelectedCategory] = useState("All Treatments");

  // Filter treatments based on selected category
  const filteredTreatments = selectedCategory === "All Treatments" 
    ? unaniTreatments 
    : unaniTreatments.filter(treatment => treatment.category === selectedCategory);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Layout
      title="Unani Healthcare in Bangalore | RevivoHeal"
      description="Unani treatments at RevivoHeal Bangalore for hypertension, diabetes, asthma, bronchitis, and chronic conditions using traditional herbal medicine and lifestyle therapy."
      canonical="https://revivoheal.com/unani-healthcare"
      image="https://revivoheal.com/lovable-uploads/47141481-b66c-419d-aadb-9fe29f691c16.png"
      keywords="Unani healthcare, traditional medicine, natural healing, holistic treatment Bangalore"
    >

      {/* Treatments Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-gold uppercase tracking-wider font-medium text-sm">
              Our Treatments
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4 mt-2">
              Comprehensive Unani Treatments
            </h2>
            <div className="h-1 w-24 bg-brand-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              We provide specialized Unani treatments for various health conditions. Each treatment is 
              tailored to your specific needs using traditional herbs and natural healing methods.
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Showing {filteredTreatments.length} of {unaniTreatments.length} treatments
                {selectedCategory !== "All Treatments" && ` in ${selectedCategory}`}
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Badge 
              variant="outline" 
              className={`px-4 py-2 text-sm cursor-pointer transition-all duration-200 ${
                selectedCategory === "All Treatments" 
                  ? "bg-brand-green text-white border-brand-green" 
                  : "border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
              }`}
              onClick={() => handleCategoryFilter("All Treatments")}
            >
              All Treatments
            </Badge>
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="outline" 
                className={`px-4 py-2 text-sm cursor-pointer transition-all duration-200 ${
                  selectedCategory === category 
                    ? "bg-brand-green text-white border-brand-green" 
                    : "border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
                }`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Treatments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTreatments.map((treatment, index) => (
              <Card key={index} className="group h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 shadow-md">
                <div className={`bg-gradient-to-br ${treatment.bgColor} p-6 text-center relative overflow-hidden`}>
                  {/* Decorative background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-2 right-2 w-12 h-12 border-2 border-current rounded-full"></div>
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-2 border-current rounded-full"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`bg-gradient-to-r ${treatment.color} p-4 rounded-full inline-block mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <div className="text-white">{treatment.icon}</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-brand-green mb-2 group-hover:text-brand-gold transition-colors">
                      {treatment.name}
                    </h3>
                    
                    <Badge variant="secondary" className="mb-4 bg-white/80 text-gray-700 hover:bg-white">
                      {treatment.category}
                    </Badge>
                    
                    <div className={`h-1 w-16 bg-gradient-to-r ${treatment.color} mx-auto group-hover:w-24 transition-all duration-300`}></div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                    {treatment.description}
                  </p>
                  
                  <div className="text-center">
                    <Link to={`/booking?treatment=${treatment.id}`}>
                      <Button
                        className={`bg-gradient-to-r ${treatment.color} text-white hover:opacity-90 transition-all duration-300 rounded-full px-6 py-2 text-sm font-medium shadow-md hover:shadow-lg group-hover:scale-105 w-full`}
                      >
                        Book Treatment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-brand-green/5 to-brand-gold/5 rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-brand-green mb-4">
                Ready to Start Your Healing Journey?
              </h3>
              <p className="text-gray-700 mb-6 text-lg">
                Our experienced Unani practitioners will create a personalized treatment plan 
                tailored to your specific health needs and condition.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/booking">
                  <Button className="gold-gradient text-white hover:opacity-90 transition-opacity rounded-full px-8 py-4 text-lg font-medium shadow-md hover:shadow-lg">
                    Book Consultation
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

export default UnaniHealthCare;

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, HeartPulse, BookOpen, BriefcaseMedical, Flame, DropletIcon, CheckCircle, Utensils, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const servicesData = {
  "dry-cupping": {
    icon: <HeartPulse className="h-16 w-16" />,
    title: "Dry Cupping",
    description: "Non-invasive therapy that uses suction to improve blood flow and relieve muscle tension.",
    longDescription: "Dry cupping is a gentle, non-invasive therapy where cups are applied to the skin to create suction. This technique helps to increase blood circulation, relieve muscle tension, and promote relaxation. Unlike wet cupping, no incisions are made, making it suitable for individuals who prefer a less invasive approach.",
    benefits: [
      "Increases blood circulation to muscles and tissues",
      "Relieves tension and muscle stiffness",
      "Promotes relaxation and reduces stress",
      "Helps with back pain, neck pain, and headaches",
      "Improves mobility and flexibility"
    ],
    process: [
      "The practitioner places cups on specific areas of your body",
      "Suction is created using either heat or a suction pump",
      "Cups remain in place for 5-15 minutes",
      "The skin under the cup may redden due to the blood vessels expanding",
      "The cups are then removed, and you may experience immediate relief"
    ],
    price: "₹3,000 per session", 
    priceNumber: 3000
  },
  "wet-cupping": {
    icon: <BookOpen className="h-16 w-16" />,
    title: "Wet Cupping (Hijama)",
    description: "Traditional Hijama therapy that involves creating small incisions for detoxification and healing.",
    longDescription: "Wet cupping (Hijama) is a traditional Islamic therapy mentioned in many Prophetic traditions. It involves creating small, superficial incisions on the skin and then applying cups to draw out a small amount of blood. This process is believed to remove toxins from the body, improve blood circulation, and restore balance to bodily systems.",
    benefits: [
      "Helps remove toxins and impurities from the blood",
      "Reduces inflammation throughout the body",
      "Strengthens the immune system",
      "Helps with chronic conditions and persistent pain",
      "Promotes spiritual and physical wellness following Prophetic tradition"
    ],
    process: [
      "The practitioner disinfects the treatment area thoroughly",
      "Cups are applied to create initial suction (dry cupping first)",
      "The cups are removed, and small, superficial incisions are made",
      "The cups are reapplied to draw out a small amount of blood",
      "After removal, the area is cleaned and dressed appropriately"
    ],
    price: "₹4,500 per session",
    priceNumber: 4500
  },
  "sports-massage": {
    icon: <BriefcaseMedical className="h-16 w-16" />,
    title: "Sports Injury Massage",
    description: "Specialized massage techniques to treat and prevent sports-related injuries and improve performance.",
    longDescription: "Sports injury massage is a specialized form of therapy designed to prevent and treat injuries common to athletes. It focuses on areas of the body that are overused and stressed from repetitive movements. This therapy helps improve performance, prevent injury, and speed up recovery times.",
    benefits: [
      "Reduces muscle tension and pain",
      "Improves flexibility and range of motion",
      "Prevents injuries and aids in faster recovery",
      "Enhances athletic performance and endurance",
      "Helps break down scar tissue from previous injuries"
    ],
    process: [
      "Initial assessment of your condition and athletic needs",
      "Application of various massage techniques targeted to problem areas",
      "May include deep tissue work, trigger point therapy, and stretching",
      "Post-massage advice on stretches and exercises",
      "Recommendations for follow-up treatments and prevention strategies"
    ],
    price: "₹3,500 per session",
    priceNumber: 3500
  },
  "deep-tissue-massage": {
    icon: <Flame className="h-16 w-16" />,
    title: "Deep Tissue Oil Massage",
    description: "Therapeutic massage that targets deeper layers of muscle and connective tissue for chronic pain relief.",
    longDescription: "Deep tissue oil massage uses firm pressure and slow strokes to reach deeper layers of muscle and fascia. This technique is particularly effective for chronic muscle pain, rehabilitation from injuries, and reducing tension in the body. The addition of therapeutic oils enhances the massage experience and provides additional benefits.",
    benefits: [
      "Alleviates chronic pain in muscles and joints",
      "Breaks down adhesions and scar tissue",
      "Improves posture and flexibility",
      "Reduces stress and anxiety",
      "Promotes better circulation and healing"
    ],
    process: [
      "Pre-massage consultation to discuss problem areas and pressure preferences",
      "Application of therapeutic oils suited to your needs",
      "Progressive massage beginning with lighter pressure and gradually increasing",
      "Focus on areas of tension using various deep tissue techniques",
      "Post-massage hydration and self-care recommendations"
    ],
    price: "₹4,000 per session",
    priceNumber: 4000
  },
  "leech-therapy": {
    icon: <DropletIcon className="h-16 w-16" />,
    title: "Leech Therapy",
    description: "Ancient medical treatment using medicinal leeches to improve blood circulation and relieve pain.",
    longDescription: "Leech therapy is an ancient healing practice that uses medicinal leeches to improve blood circulation and reduce pain. The leeches secrete enzymes and compounds that thin the blood, relieve pressure from pooling blood, and provide anti-inflammatory effects. This therapy has a long history in Islamic medicine and continues to be used for various conditions today.",
    benefits: [
      "Improves blood flow in congested areas",
      "Reduces inflammation and swelling",
      "Relieves pain from arthritis and joint conditions",
      "Helps with varicose veins and venous congestion",
      "Supports healing after reconstructive surgery"
    ],
    process: [
      "Thorough consultation and assessment of suitability",
      "Careful preparation of the treatment area",
      "Application of medicinal leeches to specific points",
      "Monitoring during the treatment (typically 20-45 minutes)",
      "Post-treatment care instructions and follow-up"
    ],
    price: "₹5,000 per session",
    priceNumber: 5000
  },
  "steam-bath": {
    icon: <CheckCircle className="h-16 w-16" />,
    title: "Steam Bath Therapy",
    description: "Relaxing steam treatment that opens pores, improves circulation, and detoxifies the body.",
    longDescription: "Steam bath therapy involves exposing the body to steam in a contained environment to induce sweating and promote relaxation. This therapeutic practice helps open pores, cleanse the skin, improve circulation, and support the body's natural detoxification processes. It's an excellent complement to other treatments and has been used traditionally for centuries.",
    benefits: [
      "Promotes detoxification through perspiration",
      "Opens respiratory passages and relieves congestion",
      "Relaxes muscles and reduces stress",
      "Improves skin health and appearance",
      "Enhances circulation throughout the body"
    ],
    process: [
      "Pre-steam hydration and preparation",
      "Gradual introduction to the steam environment",
      "Regular temperature monitoring for your comfort and safety",
      "Typical session duration of 15-30 minutes",
      "Post-steam cool down and hydration"
    ],
    price: "₹2,500 per session",
    priceNumber: 2500
  },
  "diet-plans": {
    icon: <Utensils className="h-16 w-16" />,
    title: "Personalized Diet Plans",
    description: "Customized nutritional guidance based on Islamic principles and your specific health needs.",
    longDescription: "Our personalized diet plans combine modern nutritional science with traditional Islamic dietary principles. Each plan is tailored to your specific health needs, preferences, and lifestyle. We focus on whole, natural foods that nourish the body and support overall wellness, following the Prophetic advice on moderation and beneficial foods.",
    benefits: [
      "Customized to your specific health goals and needs",
      "Incorporates foods recommended in Islamic tradition",
      "Helps manage weight and improve energy levels",
      "Supports the body's natural healing processes",
      "Includes practical advice for sustainable eating habits"
    ],
    process: [
      "Comprehensive initial consultation about your health and dietary habits",
      "Assessment of your nutritional needs and health goals",
      "Development of a personalized meal plan",
      "Guidance on food preparation and healthy eating habits",
      "Regular follow-ups to adjust and optimize your plan"
    ],
    price: "₹5,500 for initial consultation and plan",
    priceNumber: 5500
  }
};

interface ServiceDetailProps {
  serviceId?: string;
}

const ServiceDetail = ({ serviceId }: ServiceDetailProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const service = serviceId ? servicesData[serviceId as keyof typeof servicesData] : null;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);
  
  if (!service) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-brand-green mb-6">Service Not Found</h1>
          <p className="mb-8">The service you are looking for does not exist.</p>
          <Link to="/services">
            <Button className="gold-gradient text-white hover:opacity-90 transition-opacity">
              Back to Services
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <Link to="/services" className="inline-flex items-center text-brand-green mb-8 hover:text-brand-gold transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Link>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="bg-brand-green/10 p-8 rounded-full inline-block mb-6">
              <div className="text-brand-green">{service.icon}</div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-4">{service.title}</h1>
            <div className="h-1 w-24 bg-brand-gold mx-auto mb-6"></div>
            <p className="text-lg text-gray-700">{service.longDescription}</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            <Card className="border-t-4 border-t-brand-green hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-brand-green mb-6">Benefits</h2>
                <ul className="space-y-3">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-brand-gold mr-2 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-brand-green hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-brand-green mb-6">Treatment Process</h2>
                <ol className="space-y-3">
                  {service.process.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-brand-green text-white rounded-full h-6 w-6 flex items-center justify-center mr-3 flex-shrink-0">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-brand-green bg-opacity-10 p-8 rounded-lg text-center mb-12">
            <h2 className="text-2xl font-bold text-brand-green mb-2">Pricing</h2>
            <p className="text-xl font-medium mb-1">{service.price}</p>
            <p className="text-gray-600 italic">*Starting price per session</p>
          </div>
          
          <div className="text-center">
            <Link to="/booking-appointment">
              <Button className="gold-gradient text-white text-lg px-8 py-6 hover:opacity-90 transition-opacity rounded-full">
                Book This Treatment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetail;
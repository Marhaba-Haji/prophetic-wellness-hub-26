
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Shield, BookOpen, Pill, ArrowLeft, ArrowRight } from 'lucide-react';

const generalBenefits = [
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
  },
  {
    icon: <Heart className="h-10 w-10" />,
    title: "Immune System Boost",
    description: "Strengthens the body's natural defenses against illnesses and infections."
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Stress Reduction",
    description: "Helps alleviate stress, anxiety, and promotes overall mental wellbeing."
  },
  {
    icon: <Pill className="h-10 w-10" />,
    title: "Improved Sleep",
    description: "Promotes better sleep quality and helps with insomnia and sleep disorders."
  },
  {
    icon: <BookOpen className="h-10 w-10" />,
    title: "Energy Balance",
    description: "Helps restore energy flow throughout the body, reducing fatigue and increasing vitality."
  }
];

const womenBenefits = [
  {
    icon: <Heart className="h-10 w-10" />,
    title: "Menstrual Relief",
    description: "Helps regulate menstrual cycles and reduce painful symptoms of menstruation."
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Fertility Support",
    description: "May improve fertility by improving blood circulation to reproductive organs."
  },
  {
    icon: <Pill className="h-10 w-10" />,
    title: "Hormonal Balance",
    description: "Helps balance hormones that may reduce symptoms of PCOS and endometriosis."
  },
  {
    icon: <Heart className="h-10 w-10" />,
    title: "Pregnancy Support",
    description: "When performed by specialists, can help with pregnancy-related discomforts."
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "PCOS Management",
    description: "May help alleviate symptoms of Polycystic Ovary Syndrome through hormone regulation."
  },
  {
    icon: <Pill className="h-10 w-10" />,
    title: "PCOD Relief",
    description: "Can assist in managing Polycystic Ovarian Disease symptoms through improved circulation."
  },
  {
    icon: <Heart className="h-10 w-10" />,
    title: "Thyroid Support",
    description: "May help regulate thyroid function and alleviate symptoms of thyroid disorders."
  }
];

const Benefits = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const [autoScrollActive, setAutoScrollActive] = useState(true);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollInterval: NodeJS.Timeout | null = null;
    
    // Start auto-scrolling with even faster speed (12.75ms instead of 15ms - 15% faster)
    if (autoScrollActive && scrollContainer) {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          scrollContainer.scrollLeft += 1;
          
          // Reset scroll position when it reaches the end
          if (scrollContainer.scrollLeft >= 
              scrollContainer.scrollWidth - scrollContainer.clientWidth) {
            scrollContainer.scrollLeft = 0;
          }
        }
      }, 12.75);
    }
    
    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [autoScrollActive]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrolling(true);
      setAutoScrollActive(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!scrolling) return;
    
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollRef.current.scrollLeft = scrollRef.current.scrollLeft - walk;
      setStartX(x);
    }
  };

  const handleMouseUp = () => {
    setScrolling(false);
    setTimeout(() => setAutoScrollActive(true), 4000); // Resume auto-scroll after 4 seconds of inactivity
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      setAutoScrollActive(false);
      scrollRef.current.scrollLeft -= 300;
      setTimeout(() => setAutoScrollActive(true), 4000);
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      setAutoScrollActive(false);
      scrollRef.current.scrollLeft += 300;
      setTimeout(() => setAutoScrollActive(true), 4000);
    }
  };

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
        
        <div className="mb-12">
          <div className="relative">
            <button 
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-brand-green hover:text-brand-green-light hover:scale-110 transition-all"
              onClick={handleScrollLeft}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            
            <div className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto pb-6 scrollbar-hide" 
              style={{ scrollBehavior: 'smooth' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="flex space-x-6">
                {generalBenefits.map((benefit, index) => (
                  <Card key={index} className="medical-card border border-gray-100 hover:border-brand-gold transition-all duration-300 min-w-[280px]">
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
            
            <button 
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-brand-green hover:text-brand-green-light hover:scale-110 transition-all"
              onClick={handleScrollRight}
            >
              <ArrowRight className="h-6 w-6" />
            </button>
            <div className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
          </div>
        </div>
        
        <div className="mt-20">
          <div className="text-center mb-14">
            <span className="text-brand-gold uppercase tracking-wider font-medium">Women's Health</span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-green mb-4 mt-2">Benefits for Women</h2>
            <div className="h-0.5 w-24 bg-brand-gold mx-auto mb-4"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Hijama therapy offers unique benefits for women's health and wellbeing.
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {womenBenefits.map((benefit, index) => (
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
        </div>
      </div>
    </section>
  );
};

export default Benefits;

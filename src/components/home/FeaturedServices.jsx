import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedServices = () => {
  const services = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Greek Regimen Therapy",
      subtitle: "Ilaj bil Tadbeer",
      description: "Complete detox, restoration & healing through time-tested Unani regimens designed to cleanse toxins, restore balance, and naturally heal chronic conditions.",
      features: ["Pain Relief", "Detoxification", "Immune Strengthening", "Holistic Healing"],
      link: "/greek-regimen-therapy",
      gradient: "from-primary/10 to-secondary/10"
    },
    {
      icon: <Shield className="h-8 w-8 text-accent" />,
      title: "Full Body Detox Program",
      subtitle: "Munzij-Mushil Therapy",
      description: "Clinically supervised Unani therapy that gently removes deep-rooted toxins, balances your system, and restores vitality through natural purgation.",
      features: ["Deep Cleansing", "Metabolic Balance", "Organ Function", "Natural Healing"],
      link: "/full-body-detox",
      gradient: "from-accent/10 to-primary/10"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Signature <span className="text-primary">Healing Programs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience our most sought-after therapeutic programs, rooted in ancient Unani wisdom 
            and enhanced with modern clinical expertise for profound healing results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`group relative overflow-hidden bg-gradient-to-br ${service.gradient} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-background/80 backdrop-blur-sm shadow-md">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-primary font-medium text-lg">
                      {service.subtitle}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link to={service.link}>
                  <Button 
                    className="w-full group/btn bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Learn More & Book Consultation
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            <span className="font-medium">Doctor-supervised</span> • <span className="font-medium">100% Natural</span> • <span className="font-medium">Clinically proven</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
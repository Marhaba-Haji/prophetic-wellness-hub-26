import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedServices = () => {
  const services = [
    {
      icon: <Sparkles className="h-10 w-10" />,
      title: "Greek Regimen Therapy",
      subtitle: "Ilaj bil Tadbeer",
      description: "Complete detox, restoration & healing through time-tested Unani regimens designed to cleanse toxins, restore balance, and naturally heal chronic conditions.",
      features: ["Pain Relief", "Detoxification", "Immune Strengthening", "Holistic Healing"],
      link: "/greek-regimen-therapy",
      iconBg: "bg-gradient-to-br from-primary/20 to-primary/10",
      iconColor: "text-primary",
      accentColor: "primary"
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "Full Body Detox Program",
      subtitle: "Munzij-Mushil Therapy",
      description: "Clinically supervised Unani therapy that gently removes deep-rooted toxins, balances your system, and restores vitality through natural purgation.",
      features: ["Deep Cleansing", "Metabolic Balance", "Organ Function", "Natural Healing"],
      link: "/full-body-detox",
      iconBg: "bg-gradient-to-br from-secondary/20 to-secondary/10",
      iconColor: "text-secondary",
      accentColor: "secondary"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background via-background/95 to-secondary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.05),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Signature Programs
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Signature </span>
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Healing Programs
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Experience our most sought-after therapeutic programs, rooted in ancient Unani wisdom 
            and enhanced with modern clinical expertise for profound healing results.
          </p>
        </div>

        {/* Enhanced Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-16">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-primary/20"
            >
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-[100px] opacity-50" />
              
              <CardHeader className="relative z-10 p-8 pb-6">
                {/* Enhanced icon section */}
                <div className="flex items-start gap-6 mb-6">
                  <div className={`p-4 rounded-2xl ${service.iconBg} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <div className={service.iconColor}>
                      {service.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </CardTitle>
                    <CardDescription className={`${service.accentColor === 'primary' ? 'text-primary bg-primary/10' : 'text-secondary bg-secondary/10'} font-semibold text-lg px-3 py-1 rounded-full inline-block`}>
                      {service.subtitle}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 px-8 pb-8 space-y-8">
                {/* Enhanced description */}
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {service.description}
                </p>

                {/* Enhanced features grid */}
                <div className="grid grid-cols-2 gap-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors duration-200">
                      <CheckCircle className={`h-5 w-5 ${service.accentColor === 'primary' ? 'text-primary' : 'text-secondary'} flex-shrink-0`} />
                      <span className="text-sm font-medium text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Enhanced CTA button */}
                <Link to={service.link} className="block">
                  <Button 
                    className={`w-full group/btn h-14 text-base font-semibold ${service.accentColor === 'primary' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'} shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl`}
                  >
                    Learn More & Book Consultation
                    <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced trust indicators */}
        <div className="text-center">
          <div className="inline-flex items-center gap-8 bg-card/60 backdrop-blur-sm border border-border/50 px-8 py-4 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Doctor-supervised</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">100% Natural</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Clinically Proven</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedServices = () => {
  const services = [
    {
      icon: <Sparkles className="h-12 w-12" />,
      title: "Greek Regimen Therapy",
      subtitle: "Ilaj bil Tadbeer",
      description: "Complete detox, restoration & healing through time-tested Unani regimens designed to cleanse toxins, restore balance, and naturally heal chronic conditions.",
      features: ["Pain Relief", "Detoxification", "Immune Strengthening", "Holistic Healing"],
      link: "/greek-regimen-therapy",
      iconBg: "bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5",
      iconColor: "text-primary",
      cardGradient: "from-primary/5 via-background to-primary/3",
      accentColor: "primary"
    },
    {
      icon: <Shield className="h-12 w-12" />,
      title: "Full Body Detox Program", 
      subtitle: "Munzij-Mushil Therapy",
      description: "Clinically supervised Unani therapy that gently removes deep-rooted toxins, balances your system, and restores vitality through natural purgation.",
      features: ["Deep Cleansing", "Metabolic Balance", "Organ Function", "Natural Healing"],
      link: "/full-body-detox",
      iconBg: "bg-gradient-to-br from-secondary/20 via-secondary/10 to-secondary/5", 
      iconColor: "text-secondary",
      cardGradient: "from-secondary/5 via-background to-secondary/3",
      accentColor: "secondary"
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-background via-background/98 to-secondary/3 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,hsl(var(--secondary)/0.08),transparent_60%)]" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-primary/20">
            <Star className="h-4 w-4 text-primary" />
            Our Signature Programs
            <Star className="h-4 w-4 text-secondary" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="text-foreground">Premium </span>
            <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Healing Experiences
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
            Our most sought-after therapeutic programs, meticulously crafted by combining 
            <span className="text-primary font-medium"> ancient Unani wisdom</span> with 
            <span className="text-secondary font-medium"> modern clinical excellence</span>
          </p>
        </div>

        {/* Premium Cards - Always 2 columns on tablet+ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-8xl mx-auto mb-20">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`group relative overflow-hidden bg-gradient-to-br ${service.cardGradient} backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.03] hover:-translate-y-2`}
            >
              {/* Premium Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/15 to-transparent rounded-bl-[120px] opacity-60" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/10 to-transparent rounded-tr-[100px] opacity-40" />
              
              <CardHeader className="relative z-10 p-10 pb-8">
                {/* Premium Icon Section */}
                <div className="flex items-start gap-8 mb-8">
                  <div className={`p-6 rounded-3xl ${service.iconBg} shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 border border-white/20`}>
                    <div className={service.iconColor}>
                      {service.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <CardTitle className="text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-500 leading-tight">
                      {service.title}
                    </CardTitle>
                    <CardDescription className={`${service.accentColor === 'primary' ? 'text-primary bg-primary/15 border-primary/30' : 'text-secondary bg-secondary/15 border-secondary/30'} font-bold text-lg px-4 py-2 rounded-xl inline-block border`}>
                      {service.subtitle}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 px-10 pb-10 space-y-8">
                {/* Premium Description */}
                <p className="text-muted-foreground leading-relaxed text-lg font-light">
                  {service.description}
                </p>

                {/* Premium Features Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-background/60 hover:bg-background/80 transition-all duration-300 border border-border/50 hover:border-primary/30 group/feature">
                      <CheckCircle className={`h-6 w-6 ${service.accentColor === 'primary' ? 'text-primary' : 'text-secondary'} flex-shrink-0 group-hover/feature:scale-110 transition-transform duration-300`} />
                      <span className="font-medium text-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Premium CTA Button */}
                <Link to={service.link} className="block pt-4">
                  <Button 
                    className={`w-full group/btn h-16 text-lg font-bold ${service.accentColor === 'primary' ? 'bg-primary hover:bg-primary/90 text-primary-foreground' : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'} shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative z-10">Discover & Book Your Healing Journey</span>
                    <ArrowRight className="ml-3 h-6 w-6 group-hover/btn:translate-x-3 group-hover/btn:scale-110 transition-all duration-300 relative z-10" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Trust Indicators */}
        <div className="text-center">
          <div className="inline-flex items-center gap-8 bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-xl border border-border/50 px-12 py-6 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="font-bold text-foreground text-lg">Doctor Supervised</span>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-border to-transparent" />
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
              <span className="font-bold text-foreground text-lg">100% Natural</span>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-border to-transparent" />
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="font-bold text-foreground text-lg">Clinically Proven</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
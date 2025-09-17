import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Heart, Stethoscope, Shield, Users, ArrowRight, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const GreekRegimenTherapy = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking-form');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDetails = () => {
    const element = document.getElementById('how-it-works');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const regimens = [
    { name: "Hijama (Cupping Therapy)", description: "For pain, detox, inflammation", icon: "🔥" },
    { name: "Dalak (Massage)", description: "For circulation, relaxation, recovery", icon: "💆" },
    { name: "Hammam (Steam Bath)", description: "For detox, joint pain, skin health", icon: "💨" },
    { name: "Tareeq (Sweating Therapy)", description: "For fever, toxin elimination", icon: "💧" },
    { name: "Imala (Counter-Irritant Therapy)", description: "For nerve pain, chronic issues", icon: "⚡" },
    { name: "Fasd (Venesection/Bloodletting)", description: "For hypertension, metabolic balance", icon: "🩸" }
  ];

  const conditions = [
    { category: "Pain & Musculoskeletal", items: ["Arthritis", "Back pain", "Sciatica", "Frozen shoulder"] },
    { category: "Neurological", items: ["Migraine", "Insomnia", "Stress", "Paralysis", "Anxiety"] },
    { category: "Metabolic Disorders", items: ["Obesity", "Hypertension", "Diabetes", "Cholesterol"] },
    { category: "Digestive Issues", items: ["Constipation", "Indigestion", "IBS", "Liver problems"] }
  ];

  return (
    <Layout 
      title="Greek Regimen Therapy - Complete Detox, Restoration & Healing | RevivoHeal Bangalore"
      description="Discover Greek Regimen Therapy (Ilaj bil Tadbeer) - a time-tested Unani regimen for natural detox, healing chronic conditions, and restoring balance."
      keywords="Greek Regimen Therapy, Ilaj bil Tadbeer, Unani therapy, detox therapy, cupping therapy, natural healing, chronic disease treatment, Bangalore"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Greek Regimen Therapy – Complete Detox, Restoration & Healing
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              A time-tested Unani regimen designed to cleanse toxins, restore balance, and naturally heal chronic conditions — safe, effective, and personalized for your body.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={scrollToBooking} className="text-lg px-8 py-6">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Consultation Today
              </Button>
              <Button variant="outline" size="lg" onClick={scrollToDetails} className="text-lg px-8 py-6">
                <ArrowRight className="mr-2 h-5 w-5" />
                Discover How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              What is Greek Regimen Therapy?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              Greek Regimen Therapy, known in Unani medicine as <strong>Ilaj bil Tadbeer (Regimental Therapy)</strong>, is a holistic system of natural treatments that uses carefully designed regimens to detoxify the body, balance the four humors, and strengthen the immune system. Unlike modern quick-fix methods, it works gently and deeply to restore long-term wellness.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              The Science of Balance: How Regimen Therapy Restores Health
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧹</span>
                </div>
                <CardTitle>Detoxification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Expels accumulated toxins & waste from the body naturally</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚖️</span>
                </div>
                <CardTitle>Balancing Humors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Restores natural equilibrium of blood, phlegm, yellow bile, black bile</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💪</span>
                </div>
                <CardTitle>Strengthening</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Improves organs & immunity, enhances natural healing capacity</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <CardTitle>Prevention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Builds long-term resilience against disease recurrence</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Types of Regimens */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Personalized Therapies Tailored for Your Condition
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regimens.map((regimen, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{regimen.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{regimen.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{regimen.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions We Treat */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Clinically Effective for a Wide Range of Chronic & Lifestyle Conditions
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conditions.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Ready to Begin Your Healing Journey?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking-appointment">
              <Button size="lg" className="text-lg px-8 py-6">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <Phone className="mr-2 h-5 w-5" />
              Call Us Today
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Book Your Consultation</CardTitle>
                <p className="text-muted-foreground">Start your healing journey with Greek Regimen Therapy</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input type="text" className="w-full px-3 py-2 border border-border rounded-md" placeholder="Enter your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <input type="tel" className="w-full px-3 py-2 border border-border rounded-md" placeholder="Enter phone number" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input type="email" className="w-full px-3 py-2 border border-border rounded-md" placeholder="Enter email address" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Condition/Concern</label>
                    <select className="w-full px-3 py-2 border border-border rounded-md">
                      <option>Select your primary concern</option>
                      <option>Pain & Musculoskeletal Issues</option>
                      <option>Neurological Conditions</option>
                      <option>Metabolic Disorders</option>
                      <option>Digestive Issues</option>
                    </select>
                  </div>
                  <Button className="w-full" size="lg">
                    <Calendar className="mr-2 h-5 w-5" />
                    Confirm My Consultation
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GreekRegimenTherapy;
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Shield, Heart, Stethoscope, Users, Calendar, Phone, ArrowRight, Clock, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const FullBodyDetox = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking-form');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDetails = () => {
    const element = document.getElementById('how-it-works');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    { title: "Deep Toxin Removal", description: "Removes toxins at the root level", icon: "🧹" },
    { title: "Pain Relief", description: "Joint pain, skin conditions, asthma relief", icon: "💆" },
    { title: "Metabolism Boost", description: "Aids weight balance naturally", icon: "⚡" },
    { title: "Organ Enhancement", description: "Improves liver, gut, lung function", icon: "🫁" },
    { title: "100% Herbal", description: "No harsh chemicals", icon: "🌿" },
    { title: "Doctor Monitored", description: "Safe & results-oriented", icon: "👨‍⚕️" }
  ];

  const suitableCandidates = [
    "Chronic joint pain or arthritis",
    "Respiratory issues (asthma, allergies)",
    "Skin disorders (eczema, psoriasis)",
    "Digestive issues, bloating, constipation",
    "Obesity or metabolic imbalance",
    "Stress, fatigue, lack of vitality"
  ];

  const notSuitable = [
    "Pregnant or breastfeeding women",
    "Frail elderly patients",
    "Patients with severe organ failure",
    "Those on strong allopathic medications without clearance"
  ];

  const trustBadges = [
    { text: "Doctor-Supervised", icon: <Stethoscope className="h-5 w-5" /> },
    { text: "Natural & Safe", icon: <Shield className="h-5 w-5" /> },
    { text: "ISO-Certified", icon: <CheckCircle className="h-5 w-5" /> },
    { text: "Patient-Centric Care", icon: <Heart className="h-5 w-5" /> }
  ];

  const steps = [
    { step: "1", title: "Initial Consultation", description: "Detailed health assessment", duration: "45 mins" },
    { step: "2", title: "Munzij Phase", description: "Herbal decoctions + diet regulation", duration: "1-2 weeks" },
    { step: "3", title: "Mushil Phase", description: "Toxin elimination via safe purgation", duration: "3-5 days" },
    { step: "4", title: "Supportive Therapies", description: "Hijama, massage, diet adjustments", duration: "Ongoing" },
    { step: "5", title: "Post-Care", description: "Strengthening tonics & lifestyle guidance", duration: "Follow-up" }
  ];

  const faqs = [
    { q: "How long does the program take?", a: "The complete program typically takes 3-4 weeks including consultation, preparation, detox, and recovery phases." },
    { q: "Are there any side effects?", a: "The therapy uses gentle herbal preparations. Mild digestive changes are normal during the detox phase and are monitored by our doctors." },
    { q: "Can I continue my allopathic medicines?", a: "Yes, but we recommend consulting with both your allopathic doctor and our Unani physician for the best approach." },
    { q: "Will I need to change my diet?", a: "Yes, we provide specific dietary guidelines during the program to enhance the detox process and ensure safety." },
    { q: "Is the detox painful or uncomfortable?", a: "The process is designed to be gentle. Any discomfort is minimal and temporary, with continuous medical supervision." },
    { q: "How soon will I see results?", a: "Many patients notice improvements within the first week, with significant benefits appearing after the complete program." }
  ];

  return (
    <Layout 
      title="RevivoHeal Signature Full Body Detox Program | Unani Munzij-Mushil Therapy"
      description="Experience our clinically supervised Unani detox therapy (Munzij-Mushil) that gently removes deep-rooted toxins, balances your system, and restores vitality."
      keywords="full body detox, Unani therapy, Munzij Mushil, toxin removal, natural detox, Bangalore, RevivoHeal"
      canonical="/full-body-detox"
      image="/lovable-uploads/a2f81c2e-c7fd-41be-bcee-e95c0e4202e5.png"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              RevivoHeal Signature Full Body Detox Program
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              A clinically supervised Unani therapy (known as Munzij-Mushil) that gently removes deep-rooted toxins, balances your system, and restores vitality.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {trustBadges.map((badge, index) => (
                <div key={index} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border">
                  {badge.icon}
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={scrollToBooking} className="text-lg px-8 py-6">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Free 15-Minute Consultation
              </Button>
              <Button variant="outline" size="lg" onClick={scrollToDetails} className="text-lg px-8 py-6">
                <ArrowRight className="mr-2 h-5 w-5" />
                Learn How This Detox Works
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
              What is the Signature Full Body Detox?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              Our detox program is based on the ancient Unani principle of <strong>Munzij-Mushil</strong> - a two-step scientific approach to cleanse your body naturally and safely.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌿</span>
                  </div>
                  <CardTitle>Step 1: Munzij</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Softens and ripens morbid matter (toxins, waste) using gentle herbal decoctions</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✨</span>
                  </div>
                  <CardTitle>Step 2: Mushil</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Safely expels these toxins through natural purgation under medical supervision</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12">
              <Button variant="outline" onClick={scrollToBooking}>
                Discover if This Program is Right for You →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Why Patients Choose Our Full Body Detox
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{benefit.icon}</span>
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Your Healing Journey, Step by Step
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suitable Candidates */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Is This Detox Right for You?
              </h2>
              <div className="space-y-4">
                {suitableCandidates.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Who May Not Be Suitable
              </h2>
              <div className="space-y-4">
                {notSuitable.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose RevivoHeal */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Why Our Patients Trust RevivoHeal
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Experienced Unani Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Certified practitioners with decades of experience in traditional Unani medicine</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Stethoscope className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Integrated Diagnostics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Modern & traditional diagnostic methods for comprehensive health assessment</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Personalized Protocols</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Customized treatment plans based on individual constitution and health needs</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
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
            Start Your Detox Journey Today
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking-appointment">
              <Button size="lg" className="text-lg px-8 py-6">
                <Calendar className="mr-2 h-5 w-5" />
                Book My Free Consultation
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <Phone className="mr-2 h-5 w-5" />
              Call Us Today
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Your details are safe with us. We respect patient privacy.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Book Your Free Consultation</CardTitle>
                <p className="text-muted-foreground">Start your detox journey with personalized assessment</p>
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
                    <label className="block text-sm font-medium mb-2">Primary Health Concern</label>
                    <select className="w-full px-3 py-2 border border-border rounded-md">
                      <option>Select your primary concern</option>
                      <option>Chronic joint pain or arthritis</option>
                      <option>Respiratory issues</option>
                      <option>Skin disorders</option>
                      <option>Digestive issues</option>
                      <option>Obesity or metabolic imbalance</option>
                      <option>Stress, fatigue, lack of vitality</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Appointment Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-border rounded-md" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="consent" className="rounded" />
                    <label htmlFor="consent" className="text-sm text-muted-foreground">
                      I consent to RevivoHeal contacting me about my health consultation
                    </label>
                  </div>
                  <Button className="w-full" size="lg">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book My Free Consultation
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground max-w-4xl mx-auto">
            <strong>Disclaimer:</strong> This content is for educational purposes only. Individual results vary. Treatment plans are personalized after doctor consultation. Please consult with our qualified Unani practitioners before starting any detox program.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default FullBodyDetox;
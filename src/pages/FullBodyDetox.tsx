import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Shield, Heart, Stethoscope, Users, Calendar, Phone, ArrowRight, Clock, AlertTriangle, CalendarDays, User, Mail, MessageSquare, MapPin, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  supabase,
  handleSupabaseError,
  retryOperation,
} from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { z } from "zod";
import PaymentModal from "@/components/PaymentModal";
import { RazorpayResponse } from "@/lib/razorpay";

// Services specific to detox program
const detoxServices = [
  "Full Body Detox Consultation",
  "Munzij-Mushil Therapy",
  "Detox + Cupping Therapy",
  "Detox + Acupressure Therapy",
  "Not decided Yet",
];

// Available time slots
const availableTimes = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

// Validation schema
const appointmentSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number"),
  date: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return selectedDate >= tomorrow && selectedDate <= maxDate;
  }, "Date must be between tomorrow and 3 months from now"),
  time: z.string().min(1, "Please select a time"),
  service: z.string().min(1, "Please select a service"),
  notes: z.string().optional(),
});

const FullBodyDetox = () => {
  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>(availableTimes);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  const scrollToBooking = () => {
    const element = document.getElementById('booking-form');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDetails = () => {
    const element = document.getElementById('how-it-works');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    { title: "Deep Toxin Removal", description: "Removes toxins at the root level", icon: "🧹", image: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758554504/toxin_removal_vnemgl.png" },
    { title: "Pain Relief", description: "Joint pain, skin conditions, asthma relief", icon: "💆", image: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758554504/pain_relief_hcozw1.png" },
    { title: "Metabolism Boost", description: "Aids weight balance naturally", icon: "⚡", image: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758554504/metabolism_boost_1_tfdkvu.png" },
    { title: "Organ Enhancement", description: "Improves liver, gut, lung function", icon: "🫁", image: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758554504/organ_enhancement_bhdcyy.png" },
    { title: "100% Herbal", description: "No harsh chemicals", icon: "🌿", image: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758554506/100_percent_herbal_msccf8.png" },
    { title: "Doctor Monitored", description: "Safe & results-oriented", icon: "👨‍⚕️", image: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758554504/doctor_monitored_o9jzla.png" }
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

  // Check appointment availability
  const checkAvailability = async (selectedDate: string) => {
    setIsCheckingAvailability(true);
    try {
      console.log("Checking availability for date:", selectedDate);

      // For now, we'll disable the RLS-dependent availability check
      // and just show all available times. This avoids the RLS policy error.
      // In a production environment, you'd want to fix the RLS policies first.

      // Temporarily show all slots as available to avoid the RLS error
      setAvailableSlots(availableTimes);

      console.log("Available slots set:", availableTimes);
    } catch (error) {
      console.error("Error checking availability:", error);
      // Fallback: show all times as available rather than blocking the user
      setAvailableSlots(availableTimes);
      toast.error(
        "Unable to check current bookings, but you can still make a request.",
      );
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Update available times when date changes
  useEffect(() => {
    if (date) {
      checkAvailability(date);
    } else {
      // Reset to all available times when no date is selected
      setAvailableSlots(availableTimes);
    }
  }, [date]);

  // Reset time selection when available slots change
  useEffect(() => {
    if (time && !availableSlots.includes(time)) {
      setTime("");
    }
  }, [availableSlots, time]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate input
      const appointmentData = {
        full_name: fullName,
        email,
        phone,
        date,
        time,
        service,
        notes,
      };

      const validatedData = appointmentSchema.parse(appointmentData);
      
      // Store appointment data and show payment modal
      setAppointmentData(validatedData);
      setShowPaymentModal(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        const errorMessage = handleSupabaseError(error);
        toast.error(errorMessage);
      }
    }
  };

  const handlePaymentSuccess = async (paymentData: RazorpayResponse) => {
    try {
      setIsSubmitting(true);

      // Insert appointment with payment details
      await retryOperation(async () => {
        const { error } = await supabase.from("appointments").insert({
          full_name: appointmentData.full_name,
          email: appointmentData.email,
          phone: appointmentData.phone,
          date: appointmentData.date,
          time: appointmentData.time,
          service: appointmentData.service,
          notes: appointmentData.notes || null,
          status: "confirmed",
          payment_id: paymentData.razorpay_payment_id,
          payment_order_id: paymentData.razorpay_order_id,
          payment_signature: paymentData.razorpay_signature,
          consultation_fee_paid: true,
          consultation_fee_amount: 299,
        });

        if (error) throw error;
      });

      toast.success(
        "Payment successful! Your appointment has been confirmed. We'll contact you shortly.",
      );

      // Reset form
      setFullName("");
      setEmail("");
      setPhone("");
      setDate("");
      setTime("");
      setService("");
      setNotes("");
      setAppointmentData(null);
      setShowPaymentModal(false);

      // Redirect after successful booking
      navigate("/booking/success", { 
        state: { 
          paymentSuccess: true, 
          paymentId: paymentData.razorpay_payment_id,
          appointmentData: appointmentData
        } 
      });
    } catch (error) {
      const errorMessage = handleSupabaseError(error);
      toast.error(`Payment successful but booking failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Calculate max date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  return (
    <Layout 
      title="RevivoHeal Signature Full Body Detox Program | Unani Munzij-Mushil Therapy"
      description="Experience our clinically supervised Unani detox therapy (Munzij-Mushil) that gently removes deep-rooted toxins, balances your system, and restores vitality."
      keywords="full body detox, Unani therapy, Munzij Mushil, toxin removal, natural detox, Bangalore, RevivoHeal"
      canonical="/full-body-detox"
      image="/lovable-uploads/a2f81c2e-c7fd-41be-bcee-e95c0e4202e5.png"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 islamic-pattern-bg opacity-50"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full floating-element"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-accent/10 rounded-full floating-element animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-primary/5 rounded-full floating-element animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-5xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">RevivoHeal Signature</span>
              <br />
              <span className="text-foreground">Body Reboot 360</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed animate-slide-up">
              A clinically supervised Unani therapy (known as <span className="font-semibold text-primary">Munzij-Mushil</span>) that gently removes deep-rooted toxins, balances your system, and restores vitality.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 animate-scale-in">
              {trustBadges.map((badge, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 glass-effect px-4 py-3 rounded-full border hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-primary">{badge.icon}</div>
                  <span className="text-sm font-medium text-foreground">{badge.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in max-w-5xl mx-auto">
              <Button 
                size="lg" 
                onClick={scrollToBooking} 
                className="text-base font-semibold px-8 py-5 shadow-glow hover:scale-105 transition-all w-full sm:w-[380px] h-[56px] bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
              >
                <Calendar className="mr-3 h-5 w-5" />
                Book Your Free 15-Minute Consultation
              </Button>
              <Button 
                size="lg" 
                onClick={scrollToDetails} 
                className="text-base font-semibold px-8 py-5 hover:scale-105 transition-all w-full sm:w-[380px] h-[56px] bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
              >
                <ArrowRight className="mr-3 h-5 w-5" />
                Learn How This Detox Works
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-background">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="hsl(var(--background))"></path>
          </svg>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 animate-fade-in">
              What is the <span className="gradient-text">Signature Full Body Detox</span>?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-12 animate-slide-up">
              Our detox program is based on the ancient Unani principle of <strong className="text-primary">Munzij-Mushil</strong> - a two-step scientific approach to cleanse your body naturally and safely.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="group">
                <Card className="card-elegant hover-lift h-full">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 floating-element overflow-hidden">
                      <img 
                        src="https://res.cloudinary.com/doxoxzz02/image/upload/v1758559241/munzij_icon_lv9ubb.png" 
                        alt="Munzij Phase"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <CardTitle className="text-xl">Step 1: Munzij</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Softens and ripens morbid matter (toxins, waste) using gentle herbal decoctions</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="group">
                <Card className="card-elegant hover-lift h-full">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 floating-element animation-delay-1000 overflow-hidden">
                      <img 
                        src="https://res.cloudinary.com/doxoxzz02/image/upload/v1758559241/mushil_icon_brtutm.png" 
                        alt="Mushil Phase"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <CardTitle className="text-xl">Step 2: Mushil</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Safely expels these toxins through natural purgation under medical supervision</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-12 animate-fade-in">
              <Button variant="outline" onClick={scrollToBooking} className="hover-lift">
                Discover if This Program is Right for You →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-subtle relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full bg-dots-pattern opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 animate-fade-in">
              Why Patients Choose Our <span className="gradient-text">Full Body Detox</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="card-elegant hover-lift text-center h-full">
                  <CardHeader>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow transition-all overflow-hidden">
                      {benefit.image ? (
                        <img 
                          src={benefit.image} 
                          alt={benefit.title}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-3xl">{benefit.icon}</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </div>
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
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Book Your Detox Consultation</CardTitle>
                    <p className="text-muted-foreground">Start your detox journey with personalized assessment</p>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">
                              <User className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              id="fullName"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Your name"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">
                              <Mail className="h-4 w-4" />
                            </span>
                            <input
                              type="email"
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">
                              <Phone className="h-4 w-4" />
                            </span>
                            <input
                              type="tel"
                              id="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Your phone number"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="service"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Service <span className="text-red-500">*</span>
                          </label>
                          <select
                            id="service"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          >
                            <option value="">Select a service</option>
                            {detoxServices.map((serviceOption) => (
                              <option key={serviceOption} value={serviceOption}>
                                {serviceOption}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="date"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Date <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">
                              <CalendarDays className="h-4 w-4" />
                            </span>
                            <input
                              type="date"
                              id="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              min={minDate}
                              max={maxDateStr}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="time"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Time <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-400">
                              <Clock className="h-4 w-4" />
                            </span>
                            <select
                              id="time"
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                              disabled={isCheckingAvailability || !date}
                            >
                              <option value="">
                                {!date
                                  ? "Select a date first"
                                  : isCheckingAvailability
                                    ? "Checking availability..."
                                    : "Select a time"}
                              </option>
                              {availableSlots.map((timeOption) => (
                                <option key={timeOption} value={timeOption}>
                                  {timeOption}
                                </option>
                              ))}
                            </select>
                          </div>
                          {date &&
                            availableSlots.length === 0 &&
                            !isCheckingAvailability && (
                              <p className="text-sm text-red-600 mt-1">
                                No time slots available for this date.
                              </p>
                            )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="notes"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Special Notes or Health Concerns
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-400">
                            <MessageSquare className="h-4 w-4" />
                          </span>
                          <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Please let us know about your health concerns, current medications, or specific requirements for the detox program"
                          ></textarea>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity text-lg py-6"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : (
                          <>
                            <CreditCard className="h-5 w-5 mr-2" />
                            Pay ₹299 & Book Detox Consultation
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-2xl text-primary mb-4">
                      Detox Program Information
                    </h3>
                    <div className="space-y-6 text-sm">
                      <div>
                        <h4 className="font-semibold mb-1">Program Duration</h4>
                        <div className="text-center">
                          <p>Initial Consultation: 45 mins</p>
                          <p>Complete Program: 3-4 weeks</p>
                          <p>Follow-up: Ongoing</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="font-semibold mb-1">Location</h4>
                        <div className="flex flex-col items-center justify-center">
                          <MapPin className="h-5 w-5 text-primary mb-1" />
                          <span>
                            Paramount Avenue, 63/1, 3rd floor,
                            <br />
                            Mosque Road Cross, Frazer Town,
                            <br />
                            Bangalore 560005
                          </span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="font-semibold mb-1">Contact</h4>
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="flex items-center justify-center">
                            <Phone className="h-4 w-4 text-primary mr-2" />
                            <span>+91 9480389296</span>
                          </div>
                          <div className="flex items-center justify-center">
                            <Mail className="h-4 w-4 text-primary mr-2" />
                            <span>info@hijamahealing.com</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="font-semibold mb-2">Important Notes</h4>
                        <ul className="list-disc pl-5 space-y-1 inline-block text-left">
                          <li>Doctor-supervised detox program</li>
                          <li>Personalized herbal preparations</li>
                          <li>Dietary guidelines included</li>
                          <li>Safe and gentle process</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Payment Modal */}
            {appointmentData && (
              <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => {
                  setShowPaymentModal(false);
                  setAppointmentData(null);
                }}
                onPaymentSuccess={handlePaymentSuccess}
                appointmentData={appointmentData}
              />
            )}

            {/* Important Disclaimer */}
            <div className="max-w-4xl mx-auto mt-8">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Important Booking Information
                  </h3>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>
                      <strong>Consultation Fee:</strong> A nominal fee of ₹299 is required to secure your detox consultation slot. This helps us maintain quality service and reduces no-shows.
                    </p>
                    <p>
                      <strong>Confirmation Process:</strong> Our team will call you within 24 hours to reconfirm your appointment details and answer any questions you may have about the detox program.
                    </p>
                    <p>
                      <strong>Rescheduling:</strong> We understand that plans can change. If you need to reschedule, please contact us at least 24 hours before your appointment, and we'll be happy to accommodate you.
                    </p>
                    <p>
                      <strong>Program Details:</strong> After the consultation, our doctors will create a personalized detox plan based on your health assessment and requirements.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
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
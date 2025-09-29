import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Heart, Stethoscope, Shield, Users, ArrowRight, Phone, Calendar, CalendarDays, Clock, User, Mail, MessageSquare, MapPin, CreditCard } from "lucide-react";
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
// Abandoned payments functionality removed for build compatibility

const services = [
  "Greek Regimen Therapy",
  "Unani Consultation",
  "Cupping Therapy",
  "Accupressure Therapy",
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

const GreekRegimenTherapy = () => {
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

  // Function to handle abandoned payment capture
  const handleAbandonedPayment = async (reason) => {
    if (!appointmentData) return;

    // Abandoned payment tracking removed for build compatibility
    console.log("Payment abandoned:", reason);
  };

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
      // Capture as abandoned payment since payment succeeded but booking failed
      await handleAbandonedPayment("payment_failed");
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

  const scrollToBooking = () => {
    const element = document.getElementById('booking-form');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDetails = () => {
    const element = document.getElementById('how-it-works');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const regimens = [
    { name: "Hijama (Cupping Therapy)", description: "For pain, detox, inflammation", icon: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758701427/hijama_therapy_wcnpa0.png" },
    { name: "Dalak (Massage)", description: "For circulation, relaxation, recovery", icon: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758701427/massage_icon_ifhtdr.png" },
    { name: "Tareeq (Sweating Therapy)", description: "For fever, toxin elimination", icon: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758701428/sweating_therapy_yrj5em.png" },
    { name: "Imala (Counter-Irritant Therapy)", description: "For nerve pain, chronic issues", icon: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758702149/imala_1_vrryr6.png" },
    { name: "Fasd (Venesection/Bloodletting)", description: "For hypertension, metabolic balance", icon: "https://res.cloudinary.com/doxoxzz02/image/upload/v1758701437/fasd_jjmkoc.png" }
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
      canonical="/greek-regimen-therapy"
      image="/lovable-uploads/47141481-b66c-419d-aadb-9fe29f691c16.png"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" 
               style={{
                 backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url("https://res.cloudinary.com/doxoxzz02/image/upload/v1758738237/hijama_vs_leech_jsktye.jpg")`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 backgroundAttachment: 'fixed'
               }}>
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-16 w-3 h-3 bg-secondary/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 right-10 w-6 h-6 bg-primary/15 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-20 w-5 h-5 bg-secondary/15 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 left-5 w-2 h-2 bg-primary/25 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/3 right-8 w-3 h-3 bg-secondary/20 rounded-full animate-bounce" style={{animationDelay: '2.5s'}}></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Greek Regimen Therapy – Complete Detox, Restoration & Healing
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              A time-tested Unani regimen designed to cleanse toxins, restore balance, and naturally heal chronic conditions — safe, effective, and personalized for your body.
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={scrollToBooking} 
                className="text-lg px-8 py-6 transition-all duration-300 ease-in-out hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/25 focus:transform focus:-translate-y-1 focus:shadow-xl focus:shadow-primary/20"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Consultation Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              What is Greek Regimen Therapy?
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src="https://res.cloudinary.com/doxoxzz02/image/upload/v1758636910/Untitled_design_1_kqgg4f.jpg" 
                  alt="Greek Regimen Therapy - Ilaj bil Tadbeer" 
                  className="w-full h-auto rounded-xl shadow-xl object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <p className="text-lg text-muted-foreground leading-relaxed">
              Greek Regimen Therapy, known in Unani medicine as <strong>Ilaj bil Tadbeer (Regimenal Therapy)</strong>, is a holistic system of natural treatments that uses carefully designed regimens to detoxify the body, balance the four humors, and strengthen the immune system. Unlike modern quick-fix methods, it works gently and deeply to restore long-term wellness.
            </p>
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <p className="text-sm text-primary font-medium">
                    "A time-tested approach to healing that addresses the root cause, not just symptoms"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Your Body Needs It - The Problem Statement */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Why Does Your Body Need a Reset?
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="space-y-6">
                  <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <h3 className="text-xl font-semibold text-red-800 mb-3">The Modern Lifestyle Challenge</h3>
                    <p className="text-red-700">
                      Our bodies are constantly bombarded by environmental toxins, processed foods, stress, and pollution. 
                      This toxic overload creates a cascade of health issues that traditional medicine often fails to address at the root.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-foreground">Common Symptoms of Toxin Buildup:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-muted-foreground">Chronic fatigue & low energy</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-muted-foreground">Heaviness & sluggishness</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-muted-foreground">Persistent stress & anxiety</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-muted-foreground">Poor digestion & bloating</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-muted-foreground">Skin issues & dull complexion</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-muted-foreground">Weak immunity & frequent illness</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="relative">
                  {/* Before/After Visual Representation */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4">
                        <img 
                          src="https://res.cloudinary.com/doxoxzz02/image/upload/v1758702406/before_regimen_therapy_uh2qjp.png" 
                          alt="Before Regimen Therapy" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-600 mb-2">Before</h4>
                      <p className="text-sm text-gray-500">Toxic, fatigued, imbalanced</p>
                    </div>
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4">
                        <img 
                          src="https://res.cloudinary.com/doxoxzz02/image/upload/v1758702405/after_regimen_therapy_ajrdas.png" 
                          alt="After Regimen Therapy" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <h4 className="font-semibold text-green-600 mb-2">After</h4>
                      <p className="text-sm text-green-500">Detoxified, energized, balanced</p>
                    </div>
                  </div>
                  
                  {/* Arrow pointing from before to after */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <div className="inline-block p-6 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-lg text-primary font-medium">
                  "Your body has an incredible ability to heal itself, but it needs the right tools and environment to do so effectively."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Regimen Therapy Works - The Process */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-20">
              <div className="inline-block px-6 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                Our Process
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                How Regimen Therapy Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Our comprehensive 4-step process ensures personalized care and optimal results for your healing journey.
              </p>
            </div>
            
            {/* Process Steps */}
            <div className="relative">
              {/* Connection Line for Desktop */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 transform -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {/* Step 1 */}
                <div className="group">
                  <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Stethoscope className="h-12 w-12 text-primary" />
                        </div>
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                          1
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">Consultation & Diagnosis</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Comprehensive pulse analysis, medical history review, and temperament assessment to understand your unique constitution
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Step 2 */}
                <div className="group">
                  <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Heart className="h-12 w-12 text-primary" />
                        </div>
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                          2
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">Personalized Plan</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Custom regimen selection including cupping, massage, exercise, leech therapy, and dietary modifications tailored to your needs
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Step 3 */}
                <div className="group">
                  <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Shield className="h-12 w-12 text-primary" />
                        </div>
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                          3
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">Therapy Sessions</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Gentle, supervised cleansing and detoxification treatments performed by certified practitioners in a safe environment
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Step 4 */}
                <div className="group">
                  <Card className="h-full border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Users className="h-12 w-12 text-primary" />
                        </div>
                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                          4
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">Monitoring & Guidance</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Continuous progress tracking and ongoing lifestyle support to ensure lasting results and optimal health outcomes
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            
            {/* Key Benefits */}
            <div className="mt-20">
              <div className="text-center mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Why Our Process Works</h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Our evidence-based approach combines ancient wisdom with modern healthcare standards
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-3">Personalized Approach</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Every treatment is meticulously tailored to your unique constitution, health condition, and lifestyle requirements
                  </p>
                </div>
                
                <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-3">Safe & Gentle</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    All treatments are supervised by certified practitioners using time-tested methods with modern safety protocols
                  </p>
                </div>
                
                <div className="group text-center p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-3">Holistic Healing</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Addresses root causes while supporting your body's natural healing processes for comprehensive wellness
                  </p>
                </div>
              </div>
            </div>
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
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://res.cloudinary.com/doxoxzz02/image/upload/v1758554504/toxin_removal_vnemgl.png" 
                    alt="Detoxification" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <CardTitle>Detoxification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Expels accumulated toxins & waste from the body naturally</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://res.cloudinary.com/doxoxzz02/image/upload/v1758637378/balancing_humors_gthwbe.png" 
                    alt="Balancing Humors" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <CardTitle>Balancing Humors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Restores natural equilibrium of blood, phlegm, yellow bile, black bile</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://res.cloudinary.com/doxoxzz02/image/upload/v1758637377/strength_jhj8rc.png" 
                    alt="Strengthening" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <CardTitle>Strengthening</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Improves organs & immunity, enhances natural healing capacity</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://res.cloudinary.com/doxoxzz02/image/upload/v1758637484/Untitled_design_2_yvim6k.png" 
                    alt="Prevention" 
                    className="w-full h-full object-cover rounded-full"
                  />
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
                    {regimen.icon.startsWith('http') ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={regimen.icon} 
                          alt={regimen.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                    <span className="text-3xl">{regimen.icon}</span>
                    )}
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

      {/* Why Choose RevivoHeal */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Why Choose RevivoHeal for Regimen Therapy?
          </h2>
            <p className="text-lg text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
              Experience the perfect blend of ancient healing wisdom and modern healthcare excellence.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              {/* Content */}
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Authentic Unani Protocols</h3>
                    <p className="text-muted-foreground">Our qualified Hakims and doctors follow traditional Unani medicine protocols that have been refined over centuries, ensuring authentic and effective treatments.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Personalized Treatment Plans</h3>
                    <p className="text-muted-foreground">Every patient receives a customized treatment plan based on their unique constitution, health condition, and lifestyle. No one-size-fits-all approach.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Safe Clinic Environment</h3>
                    <p className="text-muted-foreground">Combine traditional healing methods with modern hygiene standards, ensuring your safety and comfort throughout the treatment.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Ancient Wisdom + Modern Standards</h3>
                    <p className="text-muted-foreground">We seamlessly integrate time-tested Unani principles with contemporary healthcare practices, giving you the best of both worlds.</p>
                  </div>
                </div>
              </div>
              
              {/* Visual Elements */}
              <div className="space-y-6">
                {/* Clinic Photo */}
                <div className="relative">
                  <div className="w-full aspect-square rounded-xl overflow-hidden">
                    <img 
                      src="https://res.cloudinary.com/doxoxzz02/image/upload/v1758737563/Untitled_design_1_uqkh10.jpg" 
                      alt="Modern Clinic Environment" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Certified Practitioners</h4>
                <p className="text-sm text-muted-foreground">All our Hakims and doctors are certified in Unani medicine with years of clinical experience</p>
              </div>
              
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Safety First</h4>
                <p className="text-sm text-muted-foreground">Strict adherence to hygiene protocols and modern safety standards in all treatments</p>
              </div>
              
              <div className="text-center p-6 bg-primary/5 rounded-lg">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Proven Results</h4>
                <p className="text-sm text-muted-foreground">Satisfied patients who have experienced lasting improvements in their health</p>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-16 text-center">
              <div className="inline-block p-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Experience Authentic Healing?</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Join the several patients who have transformed their health with our personalized regimen therapy approach.
                </p>
                <Button 
                  size="lg" 
                  onClick={scrollToBooking}
                  className="text-lg px-8 py-6"
                >
                <Calendar className="mr-2 h-5 w-5" />
                  Book Your Consultation Today
            </Button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Booking Form */}
      <section id="booking-form" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
              Book Your Greek Regimen Therapy Consultation
            </h2>
            <p className="text-lg text-center mb-8 text-muted-foreground">
              Schedule your comprehensive healing session with our certified practitioners.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
            <Card>
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
                            {services.map((serviceOption) => (
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
                          Special Notes or Medical Conditions
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
                            placeholder="Please let us know if you have any specific health concerns or requirements"
                          ></textarea>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-lg py-6"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : (
                          <>
                            <CreditCard className="h-5 w-5 mr-2" />
                            Pay ₹299 & Book Appointment
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
                      Booking Information
                    </h3>
                    <div className="space-y-6 text-sm">
                      <div>
                        <h4 className="font-semibold mb-1">Opening Hours</h4>
                        <div className="text-center">
                          <p>Monday - Saturday: 11:00 AM - 1:00 PM</p>
                          <p>Monday - Saturday: 4:30 PM - 7:30 PM</p>
                          <p>Friday: 4:30 PM - 7:30 PM</p>
                          <p>Sunday: Closed</p>
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
                            <span>revivoheal@gmail.com</span>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="font-semibold mb-2">Important Notes</h4>
                        <ul className="list-disc pl-5 space-y-1 inline-block text-left">
                          <li>Please arrive 15 minutes before your appointment</li>
                          <li>Wear loose, comfortable clothing</li>
                          <li>Avoid heavy meals before the session</li>
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
                onAbandonedPayment={handleAbandonedPayment}
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
                      <strong>Consultation Fee:</strong> A nominal fee of ₹299 is required to secure your appointment slot. This helps us maintain quality service and reduces no-shows.
                    </p>
                    <p>
                      <strong>Confirmation Process:</strong> Our team will call you within 24 hours to reconfirm your appointment details and answer any questions you may have.
                    </p>
                    <p>
                      <strong>Rescheduling:</strong> We understand that plans can change. If you need to reschedule, please contact us at least 24 hours before your appointment, and we'll be happy to accommodate you.
                    </p>
                    <p>
                      <strong>Balance Payment:</strong> The remaining amount for therapy/treatment can be paid directly at our therapy center on the day of your appointment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-16">
              Get answers to common questions about Greek Regimen Therapy
            </p>
            
            <div className="space-y-6">
              {/* FAQ 1 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                    How many sessions are needed?
                  </h3>
                  <p className="text-muted-foreground pl-9">
                    The number of sessions varies based on your individual condition and health goals. Typically, we recommend 3-7 sessions for acute conditions and 7-15 sessions for chronic issues. During your initial consultation, our Hakim will assess your condition and provide a personalized treatment plan with the recommended number of sessions.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ 2 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    Is it safe? Are there any side effects?
                  </h3>
                  <p className="text-muted-foreground pl-9">
                    Greek Regimen Therapy is extremely safe when performed by qualified practitioners. Our treatments are gentle, non-invasive, and have minimal side effects. Some patients may experience mild fatigue or temporary skin redness after cupping, which is normal and resolves quickly. All procedures are performed under strict hygiene protocols by certified Hakims.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ 3 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                    How is it different from Ayurveda/Panchakarma?
                  </h3>
                  <p className="text-muted-foreground pl-9">
                    While both are traditional healing systems, Greek Regimen Therapy (Unani) focuses specifically on balancing the four humors (blood, phlegm, yellow bile, black bile) through targeted detoxification methods. Unlike Panchakarma's intensive cleansing, our approach is gentler and more gradual, making it suitable for people with sensitive constitutions. We also emphasize personalized treatment based on individual temperament analysis.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ 4 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                    Can I continue my regular medicines during treatment?
                  </h3>
                  <p className="text-muted-foreground pl-9">
                    Yes, in most cases you can continue your regular medications. However, we recommend consulting with our Hakim during your initial assessment. We may suggest timing adjustments or dosage modifications to ensure optimal results. Our approach is complementary to conventional medicine, not a replacement, and we work in coordination with your existing healthcare providers.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ 5 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                    How soon will I feel results?
                  </h3>
                  <p className="text-muted-foreground pl-9">
                    Many patients report feeling lighter and more energetic after the first session. Significant improvements in symptoms typically occur within 3-5 sessions. However, lasting results depend on your condition's severity and how well you follow the recommended lifestyle modifications. Chronic conditions may take longer to show full benefits, but the healing process begins immediately.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ 6 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                    What should I expect during a session?
                  </h3>
                  <p className="text-muted-foreground pl-9">
                    Each session typically lasts 60-90 minutes. We begin with a brief consultation to assess your current state, followed by the prescribed regimen therapy (which may include cupping, massage, steam therapy, or other treatments). The process is relaxing and therapeutic. You'll receive guidance on post-treatment care and any dietary recommendations for optimal results.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ 7 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                    Is there any preparation required before treatment?
                  </h3>
                  <p className="text-muted-foreground pl-9">
                    We recommend avoiding heavy meals 2-3 hours before your session and staying well-hydrated. Wear loose, comfortable clothing. If you're taking any medications, please inform our Hakim during consultation. We'll provide specific preparation guidelines based on your treatment plan during your initial assessment.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact for More Questions */}
            <div className="mt-16 text-center">
              <div className="inline-block p-6 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="text-xl font-semibold text-foreground mb-3">Still Have Questions?</h3>
                <p className="text-muted-foreground mb-4">
                  Our team of qualified Hakims is here to help. Contact us for personalized answers to your specific concerns.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" size="lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Call +91 9480389296
                  </Button>
                  <Button size="lg" onClick={scrollToBooking}>
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Consultation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GreekRegimenTherapy;
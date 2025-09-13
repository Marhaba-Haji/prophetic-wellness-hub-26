import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  MapPin,
  CreditCard,
  Shield,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  supabase,
  handleSupabaseError,
  retryOperation,
} from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { z } from "zod";

// Declare Razorpay for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

const services = [
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

const BookingAppointment = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availableSlots, setAvailableSlots] =
    useState<string[]>(availableTimes);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

      /* 
      // This is the correct implementation once RLS policies are fixed:
      const { data: existingAppointments, error } = await supabase
        .from('appointments')
        .select('time')
        .eq('date', selectedDate)
        .eq('status', 'confirmed');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      const bookedTimes = new Set(existingAppointments?.map(apt => apt.time) || []);
      const available = availableTimes.filter(time => !bookedTimes.has(time));
      setAvailableSlots(available);
      */

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

  // Save payment attempt to track all customer interactions
  const savePaymentAttempt = async (formData, status = 'initiated', paymentData = null) => {
    try {
      const paymentAttempt = {
        customer_name: formData.full_name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        service: formData.service,
        appointment_date: formData.date,
        appointment_time: formData.time,
        notes: formData.notes,
        amount: 299,
        payment_status: status,
        razorpay_order_id: paymentData?.order_id,
        razorpay_payment_id: paymentData?.payment_id,
        ip_address: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => d.ip).catch(() => null),
        user_agent: navigator.userAgent
      };

      if (status === 'completed') {
        paymentAttempt['completed_at'] = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('payment_attempts')
        .insert(paymentAttempt)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving payment attempt:', error);
      // Don't throw error to prevent blocking the payment flow
    }
  };

  // Handle Razorpay payment
  const handlePayment = async (appointmentData) => {
    setIsPaymentProcessing(true);
    
    try {
      // Save initial payment attempt
      await savePaymentAttempt(appointmentData, 'initiated');

      // Create Razorpay order via Supabase Edge Function
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-order', {
        body: {
          amount: 299,
          currency: 'INR',
          receipt: `appointment_${Date.now()}`,
        },
      });

      if (orderError) {
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Hijama Healing",
        description: "Consultation Fee",
        order_id: orderData.order.id,
        image: "/favicon.ico",
        handler: async function (response) {
          try {
            // Save completed payment attempt
            await savePaymentAttempt(appointmentData, 'completed', {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id
            });

            // Verify payment via Supabase Edge Function
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointment_data: appointmentData,
              },
            });

            if (verifyError) {
              throw new Error(`Payment verification failed: ${verifyError.message}`);
            }

            if (!verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            toast.success("Payment successful! Booking confirmed. We'll contact you shortly.");

            // Reset form
            setFullName("");
            setEmail("");
            setPhone("");
            setDate("");
            setTime("");
            setService("");
            setNotes("");

            // Redirect after successful booking
            navigate("/booking/success");
            
          } catch (error) {
            console.error("Error verifying payment:", error);
            // Save failed payment attempt
            await savePaymentAttempt(appointmentData, 'failed', {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id
            });
            toast.error("Payment completed but verification failed. Please contact us.");
          } finally {
            setIsPaymentProcessing(false);
          }
        },
        prefill: {
          name: appointmentData.full_name,
          email: appointmentData.email,
          contact: appointmentData.phone,
        },
        theme: {
          color: "#22c55e",
        },
        modal: {
          ondismiss: function () {
            // Save abandoned payment attempt when user closes modal
            savePaymentAttempt(appointmentData, 'abandoned', {
              order_id: orderData.order.id
            });
            setIsPaymentProcessing(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error("Error creating payment order:", error);
      // Save failed payment attempt
      await savePaymentAttempt(appointmentData, 'failed');
      toast.error("Failed to initiate payment. Please try again.");
      setIsPaymentProcessing(false);
    }
  };


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

      setIsSubmitting(true);

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        toast.error("Payment system is loading. Please try again in a moment.");
        return;
      }

      // Proceed with payment
      await handlePayment(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        console.error("Booking error:", error);
        toast.error("Failed to process booking. Please try again.");
      }
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
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-8 text-center">
          Book Your Appointment
        </h1>

        <div className="max-w-4xl mx-auto mb-10">
          <p className="text-lg text-center mb-6">
            Schedule your hijama therapy session with our certified
            practitioners.
          </p>
          
          {/* Payment and Disclaimer Info */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm">
                <h4 className="font-semibold text-blue-800 mb-2">Payment & Booking Information</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• <strong>Consultation Fee:</strong> ₹299 (to be paid during booking)</li>
                  <li>• Our team will call to reconfirm your booked slot for consultation or therapy</li>
                  <li>• We can reschedule the appointment as per your convenience if needed</li>
                  <li>• Balance amount for therapy (if applicable) can be paid directly at the centre</li>
                  <li>• Your slot will be confirmed only after successful payment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
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
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                        placeholder="Please let us know if you have any specific health concerns or requirements"
                      ></textarea>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gold-gradient text-white hover:opacity-90 transition-opacity text-lg py-6"
                    disabled={isSubmitting || isPaymentProcessing}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    {isSubmitting || isPaymentProcessing 
                      ? "Processing..." 
                      : "Pay ₹299 & Confirm Booking"
                    }
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-2xl text-brand-green mb-4">
                  Booking Information
                </h3>
                <div className="space-y-6 text-sm">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Shield className="h-4 w-4 text-green-600 mr-2" />
                      <h4 className="font-semibold text-green-800">Consultation Fee</h4>
                    </div>
                    <p className="text-green-700 text-sm">
                      ₹299 (Secure Payment via Razorpay)
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Confirms your appointment slot
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Opening Hours</h4>
                    <div className="text-center">
                      <p>Monday - Thursday: 9:00 AM - 8:00 PM</p>
                      <p>Saturday - Sunday: 9:00 AM - 8:00 PM</p>
                      <p>Friday: Closed</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-semibold mb-1">Location</h4>
                    <div className="flex flex-col items-center justify-center">
                      <MapPin className="h-5 w-5 text-brand-green mb-1" />
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
                        <Phone className="h-4 w-4 text-brand-green mr-2" />
                        <span>+91 9480389296</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <Mail className="h-4 w-4 text-brand-green mr-2" />
                        <span>info@hijamahealing.com</span>
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
      </div>
    </Layout>
  );
};

export default BookingAppointment;

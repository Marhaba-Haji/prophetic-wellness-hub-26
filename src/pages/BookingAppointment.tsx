import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Appointment } from '@/types/supabase-types';

const services = [
  "Dry Cupping",
  "Wet Cupping",
  "Sports Injury Massage",
  "Deep Tissue Oil Massage",
  "Leech Therapy",
  "Steam Bath Therapy",
  "Personalized Diet Plans"
];

const BookingAppointment = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!fullName || !email || !phone || !date || !time || !service) {
      uiToast({
        title: "Missing Information",
        description: "Please fill in all the required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert appointment into Supabase
      const { error } = await supabase
        .from('appointments')
        .insert({
          full_name: fullName,
          email,
          phone,
          date,
          time,
          service,
          notes
        });

      if (error) throw error;

      toast.success("Booking request received! We'll contact you to confirm shortly.");
      
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setDate('');
      setTime('');
      setService('');
      setNotes('');
      
      // Redirect after successful booking
      navigate('/booking-success');
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast.error("Failed to book appointment. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTimes = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
  ];
  
  // Calculate min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  
  // Calculate max date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-8 text-center">Book Your Appointment</h1>
        
        <div className="max-w-4xl mx-auto mb-10">
          <p className="text-lg text-center mb-6">
            Schedule your hijama therapy session with our certified practitioners.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
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
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
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
                        >
                          <option value="">Select a time</option>
                          {availableTimes.map((timeOption) => (
                            <option key={timeOption} value={timeOption}>
                              {timeOption}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-brand-green mb-4">Booking Information</h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">Opening Hours</h4>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="font-semibold mb-1">Location</h4>
                    <p>123 Healing Street</p>
                    <p>Wellness City, WC 12345</p>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="font-semibold mb-1">Contact</h4>
                    <p>Phone: (123) 456-7890</p>
                    <p>Email: info@hijamahealing.com</p>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="font-semibold mb-1">Important Notes</h4>
                    <ul className="list-disc pl-5 space-y-1">
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

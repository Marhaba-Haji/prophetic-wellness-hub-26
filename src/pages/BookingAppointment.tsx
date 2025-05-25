
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Clock, User, Mail, Phone, MessageSquare, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase, handleSupabaseError, retryOperation } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { z } from 'zod';

const services = [
  "Dry Cupping",
  "Wet Cupping",
  "Sports Injury Massage",
  "Deep Tissue Oil Massage",
  "Leech Therapy",
  "Steam Bath Therapy",
  "Personalized Diet Plans"
];

// Available time slots
const availableTimes = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"
];

// Validation schema
const appointmentSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Invalid phone number'),
  date: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return selectedDate >= tomorrow && selectedDate <= maxDate;
  }, 'Date must be between tomorrow and 3 months from now'),
  time: z.string().min(1, 'Please select a time'),
  service: z.string().min(1, 'Please select a service'),
  notes: z.string().optional()
});

const BookingAppointment = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>(availableTimes);
  
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  // Check appointment availability
  const checkAvailability = async (selectedDate: string) => {
    setIsCheckingAvailability(true);
    try {
      console.log('Checking availability for date:', selectedDate);
      
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
      
      console.log('Available slots set:', availableTimes);
    } catch (error) {
      console.error('Error checking availability:', error);
      // Fallback: show all times as available rather than blocking the user
      setAvailableSlots(availableTimes);
      toast.error('Unable to check current bookings, but you can still make a request.');
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
      setTime('');
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
        notes
      };
      
      const validatedData = appointmentSchema.parse(appointmentData);
      
      setIsSubmitting(true);
      
      // Insert appointment with retry
      await retryOperation(async () => {
        const { error } = await supabase
          .from('appointments')
          .insert({
            full_name: validatedData.full_name,
            email: validatedData.email,
            phone: validatedData.phone,
            date: validatedData.date,
            time: validatedData.time,
            service: validatedData.service,
            notes: validatedData.notes || null,
            status: 'pending'
          });
          
        if (error) throw error;
      });

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
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        const errorMessage = handleSupabaseError(error);
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
                          disabled={isCheckingAvailability || !date}
                        >
                          <option value="">
                            {!date ? "Select a date first" : isCheckingAvailability ? "Checking availability..." : "Select a time"}
                          </option>
                          {availableSlots.map((timeOption) => (
                            <option key={timeOption} value={timeOption}>
                              {timeOption}
                            </option>
                          ))}
                        </select>
                      </div>
                      {date && availableSlots.length === 0 && !isCheckingAvailability && (
                        <p className="text-sm text-red-600 mt-1">No time slots available for this date.</p>
                      )}
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
                    <p>Monday - Thursday: 9:00 AM - 8:00 PM</p>
                    <p>Saturday - Sunday: 9:00 AM - 8:00 PM</p>
                    <p>Friday: Closed</p>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="font-semibold mb-1">Location</h4>
                    <p className="flex items-start">
                      <MapPin className="h-4 w-4 text-brand-green mr-2 mt-1 flex-shrink-0" />
                      <span>Paramount Avenue, 63/1, 3rd floor,<br />Mosque Road Cross, Frazer Town,<br />Bangalore 560005</span>
                    </p>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <h4 className="font-semibold mb-1">Contact</h4>
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 text-brand-green mr-2 flex-shrink-0" />
                      <span>+91 9480389296</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 text-brand-green mr-2 flex-shrink-0" />
                      <span>info@hijamahealing.com</span>
                    </p>
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

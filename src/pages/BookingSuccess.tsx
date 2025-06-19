
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Calendar } from 'lucide-react';

const BookingSuccess = () => {
  return (
    <Layout>
      <Helmet>
        <title>Booking Confirmed - RevivoHeal Hijama Therapy Appointment</title>
        <meta name="description" content="Your Hijama cupping therapy appointment has been successfully booked at RevivoHeal Bangalore. Check your email for confirmation details." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://revivoheal.com/booking/success" />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-brand-green" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-6">Booking Confirmed!</h1>
          
          <div className="h-0.5 w-24 bg-brand-gold mx-auto mb-6"></div>
          
          <p className="text-lg mb-8 text-gray-700">
            Thank you for choosing Hijama Healing. Your appointment has been successfully booked. 
            We've sent a confirmation email with all the details. We look forward to seeing you soon!
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-xl text-brand-green mb-4">What's Next?</h2>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-brand-green">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span>Check your email for a booking confirmation with all the appointment details.</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-brand-green">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span>Arrive 15 minutes before your scheduled appointment time.</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-brand-green">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span>Wear loose, comfortable clothing for your session.</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-brand-green">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span>If you need to reschedule, please contact us at least 24 hours before your appointment.</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button variant="outline" className="px-6 border-brand-green text-brand-green hover:bg-brand-green hover:text-white">
                <Home className="h-5 w-5 mr-2" /> Return Home
              </Button>
            </Link>
            <Link to="/booking">
              <Button className="gold-gradient text-white px-6 hover:opacity-90 transition-opacity">
                <Calendar className="h-5 w-5 mr-2" /> Book Another Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingSuccess;

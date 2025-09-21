import React from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, Calendar, CreditCard, Phone, Clock } from "lucide-react";

const BookingSuccess = () => {
  const location = useLocation();
  const { paymentSuccess, paymentId, appointmentData } = location.state || {};

  return (
    <Layout
      title="Booking Confirmed - RevivoHeal Bangalore"
      description="Your appointment has been successfully booked with RevivoHeal. We'll contact you shortly to reconfirm your consultation details."
      canonical="https://www.revivoheal.com/booking/success"
      image="https://res.cloudinary.com/doxoxzz02/image/upload/v1756287517/revivoheal_poster_qz5kom.jpg"
      keywords="appointment confirmed, booking success, revivoheal appointment, hijama booking confirmed"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-brand-green" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-6">
            {paymentSuccess ? "Payment Successful & Booking Confirmed!" : "Booking Confirmed!"}
          </h1>

          <div className="h-0.5 w-24 bg-brand-gold mx-auto mb-6"></div>

          <p className="text-lg mb-8 text-gray-700">
            {paymentSuccess 
              ? "Thank you for choosing Revivoheal. Your consultation fee has been paid and your appointment has been confirmed. We'll contact you shortly to reconfirm the details."
              : "Thank you for choosing Revivoheal. Your appointment has been successfully booked. We've sent a confirmation email with all the details. We look forward to seeing you soon!"
            }
          </p>

          {/* Payment Confirmation Card */}
          {paymentSuccess && (
            <Card className="mb-8 bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-green-600 mr-2" />
                  <h2 className="font-semibold text-xl text-green-800">Payment Confirmed</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Payment ID:</span>
                    <span className="font-mono text-green-800">{paymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Amount Paid:</span>
                    <span className="font-semibold text-green-800">₹299</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Payment Status:</span>
                    <span className="text-green-800">✅ Successful</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appointment Details */}
          {appointmentData && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="font-semibold text-xl text-brand-green mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Appointment Details
                </h2>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{appointmentData.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{appointmentData.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{appointmentData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{appointmentData.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-xl text-brand-green mb-4">
              What's Next?
            </h2>
            <ul className="text-left space-y-2">
              {paymentSuccess && (
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-brand-green">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span>
                    <strong>Our team will call you within 24 hours</strong> to reconfirm your appointment and answer any questions.
                  </span>
                </li>
              )}
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-brand-green">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <span>
                  Check your email for a booking confirmation with all the
                  appointment details.
                </span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-brand-green">
                  <Clock className="h-5 w-5" />
                </div>
                <span>
                  Arrive 15 minutes before your scheduled appointment time.
                </span>
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
                <span>
                  {paymentSuccess 
                    ? "Balance payment for therapy/treatment can be made at our center on the day of appointment."
                    : "If you need to reschedule, please contact us at least 24 hours before your appointment."
                  }
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button
                variant="outline"
                className="px-6 border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
              >
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

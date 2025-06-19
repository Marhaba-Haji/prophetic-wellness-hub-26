
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  return (
    <Layout>
      <Helmet>
        <title>Contact RevivoHeal - Book Hijama Cupping Therapy in Bangalore</title>
        <meta name="description" content="Contact RevivoHeal for Hijama cupping therapy appointments in Bangalore. Call +91 9480389296 or visit us at Frazer Town. Professional healing services." />
        <meta name="keywords" content="contact revivoheal, book hijama appointment, cupping therapy bangalore, hijama center contact, frazer town clinic" />
        <link rel="canonical" href="https://revivoheal.com/contact" />
        
        <meta property="og:title" content="Contact RevivoHeal - Book Hijama Cupping Therapy" />
        <meta property="og:description" content="Contact RevivoHeal for professional Hijama cupping therapy appointments in Bangalore." />
        <meta property="og:url" content="https://revivoheal.com/contact" />
        
        <meta name="twitter:title" content="Contact RevivoHeal - Hijama Therapy Bangalore" />
        <meta name="twitter:description" content="Book your Hijama cupping therapy session in Bangalore. Professional healing services." />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-8 text-center">Contact Us</h1>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold text-brand-green mb-4">Get In Touch</h2>
            <p className="mb-6 text-gray-700">
              We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
            </p>
            
            <ContactForm />
          </div>
          
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold text-brand-green mb-6 text-center w-full">Contact Information</h2>
            
            <div className="flex flex-col items-center space-y-8 w-full max-w-md">
              <div className="flex items-start w-full">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-gold/10 mr-4 mt-1">
                  <MapPin className="h-6 w-6 text-brand-gold" />
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Address</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Paramount Avenue, 63/1, 3rd floor,<br />
                    Mosque Road Cross, Frazer Town,<br />
                    Bangalore 560005
                  </p>
                </div>
              </div>
              
              <div className="flex items-start w-full">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-gold/10 mr-4 mt-1">
                  <Phone className="h-6 w-6 text-brand-gold" />
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Phone</h3>
                  <p className="text-gray-700">+91 9480389296</p>
                </div>
              </div>
              
              <div className="flex items-start w-full">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-gold/10 mr-4 mt-1">
                  <Mail className="h-6 w-6 text-brand-gold" />
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-gray-700">revivoheal@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start w-full">
                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-gold/10 mr-4 mt-1">
                  <Clock className="h-6 w-6 text-brand-gold" />
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Hours</h3>
                  <p className="text-gray-700">
                    Monday - Thursday: 9:00 AM - 8:00 PM<br />
                    Saturday - Sunday: 9:00 AM - 8:00 PM<br />
                    Friday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Google Map Section - new row, full width */}
        <div className="w-full mt-12">
          <iframe
            title="RevivoHeal Location"
            width="100%"
            height="350"
            style={{ border: 0, borderRadius: '0.75rem' }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497.05757866732126!2d77.61543344582613!3d13.002756157392625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17b1d7539715%3A0x19f5df3a9f3ea1ad!2sSOCH%20Factory%20Outlet!5e0!3m2!1sen!2sin!4v1709799512364!5m2!1sen!2sin"
          ></iframe>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

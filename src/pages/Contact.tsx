
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import ContactMap from '@/components/ContactMap';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  return (
    <Layout>
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
          
          <div>
            <h2 className="text-2xl font-semibold text-brand-green mb-4">Contact Information</h2>
            
            <div className="space-y-6 mb-6">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-gold mr-2 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Address</h3>
                  <p className="text-gray-700">
                    Paramount Avenue, 63/1, 3rd floor,<br />
                    Mosque Road Cross, Frazer Town,<br />
                    Bangalore 560005
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-brand-gold mr-2 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-gray-700">+91 9480389296</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-brand-gold mr-2 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-gray-700">info@hijamahealing.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-brand-gold mr-2 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">Hours</h3>
                  <p className="text-gray-700">
                    Monday - Thursday: 9:00 AM - 8:00 PM<br />
                    Saturday - Sunday: 9:00 AM - 8:00 PM<br />
                    Friday: Closed
                  </p>
                </div>
              </div>
            </div>
            
            <ContactMap />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

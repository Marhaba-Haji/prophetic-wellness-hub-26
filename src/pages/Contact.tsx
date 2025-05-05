
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

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
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="Your email"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <div>
                <Button className="w-full gold-gradient text-white hover:opacity-90 transition-opacity">
                  Send Message
                </Button>
              </div>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-brand-green mb-4">Contact Information</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-1">Address</h3>
                <p className="text-gray-700">
                  123 Healing Street<br />
                  Wellness City, WC 12345
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">Phone</h3>
                <p className="text-gray-700">(123) 456-7890</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">Email</h3>
                <p className="text-gray-700">info@hijamahealing.com</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">Hours</h3>
                <p className="text-gray-700">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
            
            <div className="mt-8 h-64 bg-gray-200 rounded-md">
              {/* Map placeholder */}
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Interactive map will be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;

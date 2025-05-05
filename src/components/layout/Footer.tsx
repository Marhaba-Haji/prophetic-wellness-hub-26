
import React from "react";
import { Link } from "react-router-dom";
import { Mosque, MapPin, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-green text-white pt-16 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Mosque className="h-8 w-8 text-brand-gold mr-2" />
              <h3 className="text-xl font-bold">Hijama Healing</h3>
            </div>
            <p className="mb-6 text-gray-200 leading-relaxed">
              Experience the healing power of traditional Islamic medicine with our professional hijama therapy services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="h-0.5 w-6 bg-brand-gold mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-200 hover:text-brand-gold flex items-center">
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-200 hover:text-brand-gold flex items-center">
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-200 hover:text-brand-gold flex items-center">
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/benefits" className="text-gray-200 hover:text-brand-gold flex items-center">
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Benefits
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-200 hover:text-brand-gold flex items-center">
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-200 hover:text-brand-gold flex items-center">
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="h-0.5 w-6 bg-brand-gold mr-2"></span>
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-200 hover:text-brand-gold flex items-center">
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Dry Cupping
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-brand-gold flex items-center">
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Wet Cupping
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-brand-gold flex items-center">
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Sports Injury Massage
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-brand-gold flex items-center">
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Deep Tissue Oil Massage
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-brand-gold flex items-center">
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Steam Bath Therapy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <span className="h-0.5 w-6 bg-brand-gold mr-2"></span>
              Contact Us
            </h3>
            <address className="not-italic text-gray-200 space-y-4">
              <p className="flex items-start">
                <MapPin className="h-5 w-5 text-brand-gold mr-2 mt-1 flex-shrink-0" />
                <span>123 Healing Street<br />Wellness City, WC 12345</span>
              </p>
              <p className="flex items-center">
                <Phone className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                <span>(123) 456-7890</span>
              </p>
              <p className="flex items-center">
                <Mail className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                <span>info@hijamahealing.com</span>
              </p>
              <p className="flex items-start">
                <Clock className="h-5 w-5 text-brand-gold mr-2 mt-1 flex-shrink-0" />
                <span>
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </span>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-6">
          <p className="text-center text-gray-200">
            &copy; {new Date().getFullYear()} Hijama Healing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

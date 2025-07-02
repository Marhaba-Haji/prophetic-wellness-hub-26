import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
} from "lucide-react";
import AdminFooterLink from "./AdminFooterLink";
const Footer = () => {
  return (
    <footer className="bg-brand-green text-white pt-16 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BookOpen className="h-8 w-8 text-brand-gold mr-2" />
              <h3 className="text-xl font-bold">Hijama Healing</h3>
            </div>
            <p className="mb-6 text-gray-200 leading-relaxed">
              Experience the healing power of traditional Islamic medicine with
              our professional hijama therapy services.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/RevivoHeal"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors duration-200"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/revivoheal/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors duration-200"
              >
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
                <Link
                  to="/"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/benefits"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Benefits
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Refund and Return Policy
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
                <Link
                  to="/service/dry-cupping"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Dry Cupping
                </Link>
              </li>
              <li>
                <Link
                  to="/service/wet-cupping"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Wet Cupping
                </Link>
              </li>
              <li>
                <Link
                  to="/service/sports-massage"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Sports Injury Massage
                </Link>
              </li>
              <li>
                <Link
                  to="/service/oil-massage"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Deep Tissue Oil Massage
                </Link>
              </li>
              <li>
                <Link
                  to="/service/steam-bath"
                  className="text-gray-200 hover:text-brand-gold flex items-center"
                >
                  <span className="h-1 w-1 bg-brand-gold rounded-full mr-2"></span>
                  Steam Bath Therapy
                </Link>
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
                <span className="text-left">
                  Paramount Avenue, 63/1, 3rd floor,
                  <br />
                  Mosque Road Cross, Frazer Town,
                  <br />
                  Bangalore 560005
                </span>
              </p>
              <p className="flex items-center">
                <Phone className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                <span>+91 9480389296</span>
              </p>
              <p className="flex items-center">
                <Mail className="h-5 w-5 text-brand-gold mr-2 flex-shrink-0" />
                <span>revivoheal@gmail.com</span>
              </p>
              <p className="flex items-start">
                <Clock className="h-5 w-5 text-brand-gold mr-2 mt-1 flex-shrink-0" />
                <span>
                  Monday - Thursday: 9:00 AM - 8:00 PM
                  <br />
                  Saturday - Sunday: 9:00 AM - 8:00 PM
                  <br />
                  Friday: Closed
                </span>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-0">
            <p className="text-gray-200 text-center md:text-left w-full md:w-auto">
              &copy; {new Date().getFullYear()} Hijama Healing. All rights
              reserved.
            </p>
            <span className="text-xs text-gray-300 text-center w-full md:w-auto">
              A unit of Marhaba Ventures Private Limited
            </span>
            <div className="flex items-center space-x-4 justify-center md:justify-end w-full md:w-auto">
              <AdminFooterLink />
              <a
                href="https://facelyft.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 text-sm flex items-center"
              >
                Powered by{" "}
                <span className="text-brand-gold ml-1">FaceLyft.in</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

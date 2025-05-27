
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b sticky top-0 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <img 
                src="/lovable-uploads/47141481-b66c-419d-aadb-9fe29f691c16.png" 
                alt="RevivoHeal Logo" 
                className="h-10 w-10 mr-3"
              />
              <div>
                <span className="text-brand-green font-bold text-xl">RevivoHeal</span>
                <span className="text-brand-gold text-xs block">Centre for Pain Relief & Healing</span>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <NavLinks />
          </nav>
          <div className="hidden md:flex items-center">
            <Link to="/booking-appointment">
              <Button className="gold-gradient text-white hover:opacity-90 transition-opacity rounded-full">
                <Heart className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-green"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden absolute w-full bg-white border-b z-50`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <div className="flex flex-col space-y-3">
            <MobileNavLinks closeMenu={closeMenu} />
            <div className="pt-2 pb-4 px-4">
              <Link to="/booking-appointment" onClick={closeMenu}>
                <Button className="gold-gradient w-full text-white hover:opacity-90 transition-opacity rounded-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLinks = () => (
  <>
    <Link to="/" className="text-brand-green hover:text-brand-green-light font-medium border-b-2 border-transparent hover:border-brand-gold transition-all duration-200">
      Home
    </Link>
    <Link to="/about" className="text-brand-green hover:text-brand-green-light font-medium border-b-2 border-transparent hover:border-brand-gold transition-all duration-200">
      About Us
    </Link>
    <Link to="/services" className="text-brand-green hover:text-brand-green-light font-medium border-b-2 border-transparent hover:border-brand-gold transition-all duration-200">
      Services
    </Link>
    <Link to="/benefits" className="text-brand-green hover:text-brand-green-light font-medium border-b-2 border-transparent hover:border-brand-gold transition-all duration-200">
      Benefits
    </Link>
    <Link to="/blog" className="text-brand-green hover:text-brand-green-light font-medium border-b-2 border-transparent hover:border-brand-gold transition-all duration-200">
      Blog
    </Link>
    <Link to="/contact" className="text-brand-green hover:text-brand-green-light font-medium border-b-2 border-transparent hover:border-brand-gold transition-all duration-200">
      Contact
    </Link>
  </>
);

const MobileNavLinks = ({ closeMenu }: { closeMenu: () => void }) => (
  <>
    <Link to="/" className="text-brand-green hover:text-brand-green-light px-3 py-2 font-medium border-l-4 border-transparent hover:border-brand-gold" onClick={closeMenu}>
      Home
    </Link>
    <Link to="/about" className="text-brand-green hover:text-brand-green-light px-3 py-2 font-medium border-l-4 border-transparent hover:border-brand-gold" onClick={closeMenu}>
      About Us
    </Link>
    <Link to="/services" className="text-brand-green hover:text-brand-green-light px-3 py-2 font-medium border-l-4 border-transparent hover:border-brand-gold" onClick={closeMenu}>
      Services
    </Link>
    <Link to="/benefits" className="text-brand-green hover:text-brand-green-light px-3 py-2 font-medium border-l-4 border-transparent hover:border-brand-gold" onClick={closeMenu}>
      Benefits
    </Link>
    <Link to="/blog" className="text-brand-green hover:text-brand-green-light px-3 py-2 font-medium border-l-4 border-transparent hover:border-brand-gold" onClick={closeMenu}>
      Blog
    </Link>
    <Link to="/contact" className="text-brand-green hover:text-brand-green-light px-3 py-2 font-medium border-l-4 border-transparent hover:border-brand-gold" onClick={closeMenu}>
      Contact
    </Link>
  </>
);

export default Navbar;

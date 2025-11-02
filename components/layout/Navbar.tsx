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
  return <header className="border-b sticky top-0 bg-white z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18 gap-2 sm:gap-4">
          <div className="flex items-center min-w-0 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 sm:gap-3" onClick={closeMenu}>
              <img alt="RevivoHeal Logo" className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0" src="https://i.ibb.co/zhP9ZM9z/revivo-heal-logo.png" />
              <div className="min-w-0">
                <span className="text-brand-green font-bold text-base sm:text-xl leading-tight block">RevivoHeal</span>
                <span className="text-brand-gold text-[10px] sm:text-xs block leading-tight">Pain Relief &amp; Healing</span>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8">
            <NavLinks />
          </nav>
          <div className="hidden md:flex items-center flex-shrink-0">
            <Link to="/booking">
              <Button className="gold-gradient text-white hover:opacity-90 transition-opacity rounded-full text-sm lg:text-base px-4 lg:px-6">
                <Heart className="h-3.5 w-3.5 lg:h-4 lg:w-4 mr-1.5 lg:mr-2" />
                <span className="hidden lg:inline">Book Appointment</span>
                <span className="lg:hidden">Book</span>
              </Button>
            </Link>
          </div>
          <div className="md:hidden flex-shrink-0">
            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-brand-green" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="block h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" /> : <Menu className="block h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden absolute w-full bg-white border-b z-50 shadow-lg`}>
        <div className="px-3 pt-3 pb-4 space-y-1 sm:px-4">
          <div className="flex flex-col space-y-2">
            <MobileNavLinks closeMenu={closeMenu} />
            <div className="pt-3 pb-2 px-2">
              <Link to="/booking" onClick={closeMenu}>
                <Button className="gold-gradient w-full text-white hover:opacity-90 transition-opacity rounded-full py-2.5">
                  <Heart className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>;
};
const NavLinks = () => <>
    <Link to="/" className="text-brand-green hover:text-brand-green-light font-medium text-sm lg:text-base border-b-2 border-transparent hover:border-brand-gold transition-all duration-200 whitespace-nowrap">
      Home
    </Link>
    <Link to="/about" className="text-brand-green hover:text-brand-green-light font-medium text-sm lg:text-base border-b-2 border-transparent hover:border-brand-gold transition-all duration-200 whitespace-nowrap">
      About Us
    </Link>
    <Link to="/services" className="text-brand-green hover:text-brand-green-light font-medium text-sm lg:text-base border-b-2 border-transparent hover:border-brand-gold transition-all duration-200 whitespace-nowrap">
      Services
    </Link>
    <Link to="/benefits" className="text-brand-green hover:text-brand-green-light font-medium text-sm lg:text-base border-b-2 border-transparent hover:border-brand-gold transition-all duration-200 whitespace-nowrap">
      Benefits
    </Link>
    <Link to="/blog" className="text-brand-green hover:text-brand-green-light font-medium text-sm lg:text-base border-b-2 border-transparent hover:border-brand-gold transition-all duration-200 whitespace-nowrap">
      Blog
    </Link>
    <Link to="/contact" className="text-brand-green hover:text-brand-green-light font-medium text-sm lg:text-base border-b-2 border-transparent hover:border-brand-gold transition-all duration-200 whitespace-nowrap">
      Contact
    </Link>
  </>;
const MobileNavLinks = ({
  closeMenu
}: {
  closeMenu: () => void;
}) => <>
    <Link to="/" className="text-brand-green hover:text-brand-green-light px-3 py-2.5 font-medium text-base border-l-4 border-transparent hover:border-brand-gold transition-all" onClick={closeMenu}>
      Home
    </Link>
    <Link to="/about" className="text-brand-green hover:text-brand-green-light px-3 py-2.5 font-medium text-base border-l-4 border-transparent hover:border-brand-gold transition-all" onClick={closeMenu}>
      About Us
    </Link>
    <Link to="/services" className="text-brand-green hover:text-brand-green-light px-3 py-2.5 font-medium text-base border-l-4 border-transparent hover:border-brand-gold transition-all" onClick={closeMenu}>
      Services
    </Link>
    <Link to="/benefits" className="text-brand-green hover:text-brand-green-light px-3 py-2.5 font-medium text-base border-l-4 border-transparent hover:border-brand-gold transition-all" onClick={closeMenu}>
      Benefits
    </Link>
    <Link to="/blog" className="text-brand-green hover:text-brand-green-light px-3 py-2.5 font-medium text-base border-l-4 border-transparent hover:border-brand-gold transition-all" onClick={closeMenu}>
      Blog
    </Link>
    <Link to="/contact" className="text-brand-green hover:text-brand-green-light px-3 py-2.5 font-medium text-base border-l-4 border-transparent hover:border-brand-gold transition-all" onClick={closeMenu}>
      Contact
    </Link>
  </>;
export default Navbar;
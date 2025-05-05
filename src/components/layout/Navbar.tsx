
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <span className="text-brand-green font-bold text-xl">Hijama Healing</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <NavLinks />
          </nav>
          <div className="hidden md:flex items-center">
            <Button className="gold-gradient text-white hover:opacity-90 transition-opacity">
              Book Appointment
            </Button>
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
              <Button className="gold-gradient w-full text-white hover:opacity-90 transition-opacity">
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLinks = () => (
  <>
    <Link to="/" className="text-brand-green hover:text-brand-green-light font-medium">
      Home
    </Link>
    <Link to="/about" className="text-brand-green hover:text-brand-green-light font-medium">
      About Us
    </Link>
    <Link to="/services" className="text-brand-green hover:text-brand-green-light font-medium">
      Services
    </Link>
    <Link to="/benefits" className="text-brand-green hover:text-brand-green-light font-medium">
      Benefits
    </Link>
    <Link to="/blog" className="text-brand-green hover:text-brand-green-light font-medium">
      Blog
    </Link>
    <Link to="/contact" className="text-brand-green hover:text-brand-green-light font-medium">
      Contact
    </Link>
  </>
);

const MobileNavLinks = ({ closeMenu }: { closeMenu: () => void }) => (
  <>
    <Link to="/" className="text-brand-green hover:text-brand-green-light px-3 py-2 font-medium" onClick={closeMenu}>
      Home
    </Link>
    <Link to="/about" className="text-brand-green hover:text-brand-green-light px-3 py-2 font-medium" onClick={closeMenu}>
      About Us
    </Link>
    <Link to="/services" className="text-brand-green hover:text-brand-green-light px-3 py-2 font-medium" onClick={closeMenu}>
      Services
    </Link>
    <Link to="/benefits" className="text-brand-green hover:text-brand-green-light px-3 py-2 font-medium" onClick={closeMenu}>
      Benefits
    </Link>
    <Link to="/blog" className="text-brand-green hover:text-brand-green-light px-3 py-2 font-medium" onClick={closeMenu}>
      Blog
    </Link>
    <Link to="/contact" className="text-brand-green hover:text-brand-green-light px-3 py-2 font-medium" onClick={closeMenu}>
      Contact
    </Link>
  </>
);

export default Navbar;

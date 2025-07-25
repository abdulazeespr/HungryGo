'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate navbar items on load
    gsap.fromTo(
      '.nav-item',
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out' }
    );

    // Animate logo
    gsap.fromTo(
      '.logo',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    );
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);

    if (!isMobileMenuOpen) {
      // Animate mobile menu opening
      gsap.fromTo(
        '.mobile-nav-item',
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 0.3, ease: 'power2.out' }
      );
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background shadow-md py-2' : 'bg-transparent py-4'}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="logo font-bold text-2xl text-primary-alt">
          HungryGo
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <Link href="/meal-plans" className="nav-item hover:text-primary transition-colors">
            Meal Plans
          </Link>
          <Link href="/how-it-works" className="nav-item hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="/about" className="nav-item hover:text-primary transition-colors">
            About Us
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link 
            href="/login" 
            className="nav-item px-4 py-2 rounded hover:bg-secondary transition-colors"
          >
            Log In
          </Link>
          <Link 
            href="/signup" 
            className="nav-item px-4 py-2 bg-primary text-foreground rounded hover:bg-opacity-90 transition-colors"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background shadow-lg absolute w-full py-4">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link 
              href="/meal-plans" 
              className="mobile-nav-item py-2 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Meal Plans
            </Link>
            <Link 
              href="/how-it-works" 
              className="mobile-nav-item py-2 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="/about" 
              className="mobile-nav-item py-2 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-secondary">
              <Link 
                href="/login" 
                className="mobile-nav-item py-2 text-center rounded hover:bg-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link 
                href="/signup" 
                className="mobile-nav-item py-2 text-center bg-primary text-foreground rounded hover:bg-opacity-90 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
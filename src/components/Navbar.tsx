import React, { useState, useEffect } from 'react';
import { Gamepad2, Search, Menu, X, Shield } from 'lucide-react';
import { WebsiteSettings } from '../types.js';
import { Logo } from './Logo.js';

interface NavbarProps {
  settings: WebsiteSettings;
  onOpenBooking: () => void;
  onOpenStatusLookup: () => void;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
  onNavigateToAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  onOpenBooking,
  onOpenStatusLookup,
  onOpenAdminLogin,
  isAdminLoggedIn,
  onNavigateToAdmin
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 py-3 shadow-xl shadow-black/40'
          : 'bg-gradient-to-b from-neutral-950/90 via-neutral-950/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <Logo size="md" showBadge />
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white flex items-center gap-1.5 font-['Outfit']">
                {settings.businessName || 'GAME MASTER MATARAM'}
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              </span>
              <span className="text-[11px] text-neutral-400 font-medium tracking-tight">
                Rental PlayStation & Console Mataram
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('katalog')}
              className="text-sm font-medium text-neutral-300 hover:text-blue-400 transition-colors"
            >
              Katalog
            </button>
            <button
              onClick={() => scrollToSection('cara-rental')}
              className="text-sm font-medium text-neutral-300 hover:text-blue-400 transition-colors"
            >
              Cara Rental
            </button>
            <button
              onClick={() => scrollToSection('keunggulan')}
              className="text-sm font-medium text-neutral-300 hover:text-blue-400 transition-colors"
            >
              Kenapa Kami
            </button>
            <button
              onClick={() => scrollToSection('review')}
              className="text-sm font-medium text-neutral-300 hover:text-blue-400 transition-colors"
            >
              Review
            </button>
            <button
              onClick={() => scrollToSection('kontak')}
              className="text-sm font-medium text-neutral-300 hover:text-blue-400 transition-colors"
            >
              Kontak
            </button>
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Cek Booking Status */}
            <button
              id="btn-cek-booking"
              onClick={onOpenStatusLookup}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-700/70 rounded-lg transition-colors flex items-center gap-1.5"
              title="Lacak status pesanan dengan Booking ID"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cek Booking</span>
            </button>

            {/* Admin Portal Button */}
            {isAdminLoggedIn ? (
              <button
                onClick={onNavigateToAdmin}
                className="px-3 py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/50 border border-blue-800/60 rounded-lg transition-colors flex items-center gap-1.5"
                title="Buka Dashboard Admin"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 rounded-lg transition-colors"
                title="Login Admin"
              >
                <Shield className="w-4 h-4" />
              </button>
            )}

            {/* Main CTA Button */}
            <button
              id="btn-nav-booking"
              onClick={onOpenBooking}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold tracking-wide uppercase bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 flex items-center gap-2 border border-blue-500/30"
            >
              <Gamepad2 className="w-4 h-4 text-blue-200" />
              <span>BOOKING SEKARANG</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="px-3 py-1.5 text-xs font-bold uppercase bg-blue-600 text-white rounded-lg shadow shadow-blue-600/30"
            >
              Booking
            </button>
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-neutral-950 border-b border-neutral-800 px-4 pt-4 pb-6 space-y-3 animate-fadeIn">
          <div className="flex flex-col space-y-2 border-b border-neutral-800/80 pb-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-neutral-200 hover:bg-neutral-900"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('katalog')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-neutral-200 hover:bg-neutral-900"
            >
              Katalog Rental
            </button>
            <button
              onClick={() => scrollToSection('cara-rental')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-neutral-200 hover:bg-neutral-900"
            >
              Cara Rental
            </button>
            <button
              onClick={() => scrollToSection('keunggulan')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-neutral-200 hover:bg-neutral-900"
            >
              Kenapa Game Master
            </button>
            <button
              onClick={() => scrollToSection('review')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-neutral-200 hover:bg-neutral-900"
            >
              Review Pelanggan
            </button>
            <button
              onClick={() => scrollToSection('kontak')}
              className="text-left px-3 py-2 rounded-lg text-sm font-medium text-neutral-200 hover:bg-neutral-900"
            >
              Kontak & Lokasi
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStatusLookup();
              }}
              className="w-full py-2.5 px-4 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-medium text-neutral-200 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Cek Status Booking ID</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <Gamepad2 className="w-4 h-4 text-blue-200" />
              <span>BOOKING SEKARANG</span>
            </button>

            <div className="flex items-center justify-end pt-2 text-xs text-neutral-400 px-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isAdminLoggedIn) onNavigateToAdmin();
                  else onOpenAdminLogin();
                }}
                className="text-neutral-500 hover:text-neutral-300 flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{isAdminLoggedIn ? 'Dashboard Admin' : 'Login Admin'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

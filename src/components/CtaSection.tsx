import React from 'react';
import { Gamepad2, ArrowRight } from 'lucide-react';
import { WebsiteSettings } from '../types.js';

interface CtaSectionProps {
  settings: WebsiteSettings;
  onOpenBooking: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ settings, onOpenBooking }) => {
  return (
    <section id="cta-section" className="py-20 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-t border-neutral-850 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Mataram Gaming Experience</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-['Outfit'] mb-4 uppercase">
          {settings.ctaTitle || 'SIAP MAIN?'}
        </h2>

        <p className="text-lg sm:text-xl text-neutral-300 max-w-xl mx-auto mb-8 font-medium">
          {settings.ctaSubtitle || 'Booking PlayStation favoritmu sekarang.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="cta-btn-booking"
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase rounded-xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2.5"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>BOOKING SEKARANG</span>
          </button>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Gamepad2, MapPin, Phone, MessageSquare, Instagram, Shield, Heart } from 'lucide-react';
import { WebsiteSettings } from '../types.js';
import { generateDirectAdminWhatsAppUrl, formatPhoneDisplay } from '../utils/formatters.js';
import { Logo } from './Logo.js';

interface FooterProps {
  settings: WebsiteSettings;
  onOpenBooking: () => void;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenBooking,
  onOpenAdminLogin,
  isAdminLoggedIn,
  onNavigateToAdmin
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="kontak" className="bg-neutral-950 border-t border-neutral-850 pt-16 pb-12 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="lg" showBadge />
              <div>
                <span className="font-extrabold text-lg text-white block font-['Outfit']">
                  {settings.businessName || 'GAME MASTER MATARAM'}
                </span>
                <span className="text-xs text-blue-400 font-semibold">
                  {settings.tagline || '"Your Game is Game Master"'}
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {settings.footerText || 'Rental PlayStation dan gaming console terpercaya di Mataram dan sekitarnya. Unit terawat, stick original, full game terupdate, siap antar ke lokasimu.'}
            </p>
            <div className="inline-block text-[11px] font-mono px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
              {settings.consolesSummary || 'PS4 • PS3 • Nintendo Switch • PS2 • TV'}
            </div>
          </div>

          {/* Quick Menu */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-['Outfit']">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-blue-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('katalog')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Katalog Rental
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('cara-rental')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Cara Rental
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('keunggulan')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Kenapa Game Master
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('review')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Review Pelanggan
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-['Outfit']">
              Kontak & Lokasi
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-300 leading-relaxed">
                  {settings.address || 'Jl. Majapahit No. 88, Kekalik Jaya, Kec. Sekarbela, Kota Mataram, NTB'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a
                  href={generateDirectAdminWhatsAppUrl(settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-blue-400 transition-colors"
                >
                  {formatPhoneDisplay(settings.whatsappNumber)}
                </a>
              </li>
              <li className="text-neutral-400 text-[11px] pt-1">
                Layanan antar: <span className="text-neutral-200">Mataram, Ampenan, Cakranegara, Sandubaya & Sekitarnya</span>
              </li>
            </ul>
          </div>

          {/* Social Media & Action */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-['Outfit']">
              Social Media
            </h4>
            <div className="space-y-2.5 mb-6 text-xs">
              <a
                href={`https://instagram.com/${(settings.instagramHandle || 'gamemaster.mataram').replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-blue-400 transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram: {settings.instagramHandle || '@gamemaster.mataram'}</span>
              </a>
              <a
                href={`https://tiktok.com/@${(settings.tiktokHandle || 'gamemastermataram').replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-blue-400 transition-colors"
              >
                <span className="text-xs font-bold text-cyan-400">TT</span>
                <span>TikTok: {settings.tiktokHandle || '@gamemastermataram'}</span>
              </a>
              <a
                href={generateDirectAdminWhatsAppUrl(settings.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-blue-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp: Chat Admin Langsung</span>
              </a>
            </div>

            <button
              onClick={onOpenBooking}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-600/30"
            >
              Booking Online Sekarang
            </button>
          </div>
        </div>

        {/* Bottom copyright & admin portal trigger */}
        <div className="pt-8 border-t border-neutral-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-neutral-500">
            &copy; {new Date().getFullYear()} {settings.businessName || 'GAME MASTER MATARAM'}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-neutral-600 text-[11px]">
              PlayStation, Nintendo Switch & all console trademarks belong to their respective owners.
            </span>
            <button
              onClick={isAdminLoggedIn ? onNavigateToAdmin : onOpenAdminLogin}
              className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-500 hover:text-neutral-300 text-[11px] flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>{isAdminLoggedIn ? 'Dashboard Admin' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

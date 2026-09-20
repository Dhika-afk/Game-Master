import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { WebsiteSettings } from '../types.js';
import { generateDirectAdminWhatsAppUrl } from '../utils/formatters.js';

interface FloatingWhatsAppProps {
  settings: WebsiteSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const waUrl = generateDirectAdminWhatsAppUrl(
    settings.whatsappNumber,
    `Halo Admin ${settings.businessName || 'GAME MASTER MATARAM'}, saya ingin bertanya tentang rental PlayStation & Console.`
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Speech Bubble / Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl shadow-black/50 animate-bounce duration-1000">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold">Chat Admin GAME MASTER MATARAM</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-neutral-500 hover:text-neutral-300 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        id="btn-floating-whatsapp"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all duration-300"
        title="Chat Admin GAME MASTER MATARAM"
      >
        {/* Pulsing Outer Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none"></span>

        <MessageCircle className="w-7 h-7 fill-white text-white group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
};

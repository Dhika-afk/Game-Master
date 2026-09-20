import React from 'react';
import { Check, Tag, CheckCircle2, Truck, Gamepad2, Zap, Smile, Shield } from 'lucide-react';
import { WebsiteSettings } from '../types.js';

interface KenapaKamiSectionProps {
  settings: WebsiteSettings;
}

export const KenapaKamiSection: React.FC<KenapaKamiSectionProps> = ({ settings }) => {
  const features = settings.features || [
    { id: 'f1', title: 'Harga transparan', description: 'Semua harga tertera jelas tanpa ada biaya tersembunyi.', icon: 'Tag' },
    { id: 'f2', title: 'Booking mudah', description: 'Cukup pilih unit dan durasi, langsung konfirmasi WhatsApp.', icon: 'CheckCircle2' },
    { id: 'f3', title: 'Antar–jemput', description: 'Layanan antar dan jemput unit langsung ke lokasi Anda.', icon: 'Truck' },
    { id: 'f4', title: 'Pilihan console lengkap', description: 'Tersedia PS4, PS3, Nintendo Switch, PS2, hingga paket TV 32 inch.', icon: 'Gamepad2' },
    { id: 'f5', title: 'Proses cepat', description: 'Konfirmasi ketersediaan dan pengiriman unit kilat dan tepat waktu.', icon: 'Zap' },
    { id: 'f6', title: 'Pelayanan ramah', description: 'Customer service ramah dan siap membantu kebutuhan gaming Anda.', icon: 'Smile' }
  ];

  const getFeatureIcon = (iconName: string, idx: number) => {
    const iconColors = ['text-red-400', 'text-amber-400', 'text-cyan-400', 'text-blue-400', 'text-indigo-400', 'text-amber-400'];
    const color = iconColors[idx % iconColors.length];
    switch (iconName) {
      case 'Tag': return <Tag className={`w-5 h-5 ${color}`} />;
      case 'CheckCircle2': return <CheckCircle2 className={`w-5 h-5 ${color}`} />;
      case 'Truck': return <Truck className={`w-5 h-5 ${color}`} />;
      case 'Gamepad2': return <Gamepad2 className={`w-5 h-5 ${color}`} />;
      case 'Zap': return <Zap className={`w-5 h-5 ${color}`} />;
      case 'Smile': return <Smile className={`w-5 h-5 ${color}`} />;
      default: return <Check className={`w-5 h-5 ${color}`} />;
    }
  };

  return (
    <section id="keunggulan" className="py-20 bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Kualitas Terjamin</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] mb-3">
            KENAPA {settings.businessName || 'GAME MASTER MATARAM'}?
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            Kami berkomitmen memberikan pengalaman bermain game terbaik dengan unit terawat, respon cepat, dan harga bersahabat.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-blue-500/40 transition-all flex items-start gap-4 group shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:border-blue-500/30 transition-transform">
                {getFeatureIcon(item.icon, idx)}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] mb-1 flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 inline" />
                  <span>{item.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

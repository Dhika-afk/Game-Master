import React from 'react';
import { Gamepad2, Clock, FileEdit, MessageSquare, Truck, ArrowRight } from 'lucide-react';
import { WebsiteSettings } from '../types.js';

interface CaraRentalSectionProps {
  settings: WebsiteSettings;
  onOpenBooking: () => void;
}

export const CaraRentalSection: React.FC<CaraRentalSectionProps> = ({
  settings,
  onOpenBooking
}) => {
  const steps = settings.rentalSteps || [
    { step: 'STEP 01', title: 'Pilih perangkat', description: 'Pilih PlayStation 4, PS3, Nintendo Switch, atau paket komplit TV.', icon: 'Gamepad2' },
    { step: 'STEP 02', title: 'Pilih durasi', description: 'Tentukan lama sewa mulai dari harian hingga paket hemat mingguan.', icon: 'Clock' },
    { step: 'STEP 03', title: 'Isi data booking', description: 'Isi formulir nama, nomor WhatsApp, dan alamat pengantaran Mataram.', icon: 'FileEdit' },
    { step: 'STEP 04', title: 'Konfirmasi WhatsApp', description: 'Dapatkan Booking ID dan kirim rincian booking langsung ke admin.', icon: 'MessageSquare' },
    { step: 'STEP 05', title: 'Perangkat diantar', description: 'Unit siap main diantar tepat waktu langsung ke lokasi Anda.', icon: 'Truck' }
  ];

  const stepColorStyles = [
    { text: 'text-red-400', badge: 'bg-red-950/50 border-red-500/30 text-red-400', border: 'hover:border-red-500/50' },
    { text: 'text-amber-400', badge: 'bg-amber-950/50 border-amber-500/30 text-amber-400', border: 'hover:border-amber-500/50' },
    { text: 'text-cyan-400', badge: 'bg-cyan-950/50 border-cyan-500/30 text-cyan-400', border: 'hover:border-cyan-500/50' },
    { text: 'text-blue-400', badge: 'bg-blue-950/50 border-blue-500/30 text-blue-400', border: 'hover:border-blue-500/50' },
    { text: 'text-indigo-400', badge: 'bg-indigo-950/50 border-indigo-500/30 text-indigo-400', border: 'hover:border-indigo-500/50' }
  ];

  const getStepIcon = (idx: number) => {
    const color = stepColorStyles[idx % stepColorStyles.length].text;
    switch (idx) {
      case 0: return <Gamepad2 className={`w-6 h-6 ${color}`} />;
      case 1: return <Clock className={`w-6 h-6 ${color}`} />;
      case 2: return <FileEdit className={`w-6 h-6 ${color}`} />;
      case 3: return <MessageSquare className={`w-6 h-6 ${color}`} />;
      case 4: return <Truck className={`w-6 h-6 ${color}`} />;
      default: return <Gamepad2 className={`w-6 h-6 ${color}`} />;
    }
  };

  return (
    <section id="cara-rental" className="py-20 bg-neutral-900/60 border-t border-neutral-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Alur Mudah & Cepat</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] mb-3">
            CARA RENTAL
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            Hanya 5 langkah sederhana dari pilih konsol hingga perangkat siap kamu mainkan di rumah atau kosan.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((item, idx) => {
            const style = stepColorStyles[idx % stepColorStyles.length];
            return (
              <div
                key={idx}
                className={`relative p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 ${style.border} transition-all flex flex-col justify-between group shadow-lg`}
              >
                <div>
                  {/* Step badge & icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border ${style.badge}`}>
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {getStepIcon(idx)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold text-white font-['Outfit'] mb-2 group-hover:${style.text} transition-colors`}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-neutral-600">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Quick Action */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenBooking}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 hover:scale-105"
          >
            <span>Mulai Booking Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

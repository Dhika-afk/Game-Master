import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle, AlertTriangle, XCircle, ArrowRight, Truck, MessageCircle } from 'lucide-react';
import { Booking, WebsiteSettings } from '../types.js';
import { fetchBookingById } from '../api.js';
import { formatRupiah, getStatusBadge, generateDirectAdminWhatsAppUrl } from '../utils/formatters.js';

interface BookingStatusLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebsiteSettings;
}

export const BookingStatusLookupModal: React.FC<BookingStatusLookupModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  if (!isOpen) return null;

  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetchBookingById(searchId.trim());
      setBooking(res);
    } catch (err: any) {
      setBooking(null);
      setError('Booking ID tidak ditemukan. Pastikan format penulisan benar (contoh: GM-20260918-001).');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-amber-400" />;
      case 'Confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
      case 'On Rental':
        return <Truck className="w-5 h-5 text-indigo-400" />;
      case 'Completed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Clock className="w-5 h-5 text-neutral-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="lookup-modal-container"
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-950/80 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400" />
            <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
              Cek Status Booking
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              id="lookup-booking-id-input"
              type="text"
              required
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Masukkan Booking ID (misal: GM-20260918-001)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md shadow-blue-600/30 flex items-center gap-1.5"
            >
              {loading ? 'Mencari...' : 'Cek'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Booking Found */}
          {booking && (
            <div className="space-y-4 pt-2 animate-fadeIn">
              {/* Status Header Box */}
              {(() => {
                const badge = getStatusBadge(booking.status);
                return (
                  <div className={`p-4 rounded-2xl border ${badge.bg} ${badge.border} flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(booking.status)}
                      <div>
                        <span className="text-[11px] text-neutral-400 uppercase tracking-wider block font-bold">
                          Status Booking:
                        </span>
                        <span className={`text-base font-extrabold ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 bg-neutral-950/70 border border-neutral-800 rounded-lg text-neutral-300">
                      {booking.bookingId}
                    </span>
                  </div>
                );
              })()}

              {/* Booking Details Table */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-3 text-xs">
                <div className="flex justify-between border-b border-neutral-850 pb-2">
                  <span className="text-neutral-500">Nama Pelanggan:</span>
                  <span className="font-semibold text-white">{booking.customerName}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-850 pb-2">
                  <span className="text-neutral-500">Perangkat:</span>
                  <span className="font-bold text-blue-400">{booking.productName}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-850 pb-2">
                  <span className="text-neutral-500">Durasi Sewa:</span>
                  <span className="font-semibold text-white">{booking.duration}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-850 pb-2">
                  <span className="text-neutral-500">Periode:</span>
                  <span className="font-semibold text-white">{booking.startDate} s/d {booking.endDate}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-850 pb-2">
                  <span className="text-neutral-500">Total Tarif:</span>
                  <span className="font-bold text-blue-400 text-sm">{formatRupiah(booking.price)}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-0.5">Alamat Pengantaran:</span>
                  <span className="text-neutral-300">{booking.customerAddress}</span>
                </div>
                {booking.adminNotes && (
                  <div className="pt-2 border-t border-neutral-850">
                    <span className="text-blue-400 font-bold block mb-0.5">Catatan Admin:</span>
                    <span className="text-neutral-300 italic">{booking.adminNotes}</span>
                  </div>
                )}
              </div>

              {/* Contact Admin via WA */}
              <a
                href={generateDirectAdminWhatsAppUrl(
                  settings.whatsappNumber,
                  `Halo Admin ${settings.businessName}, saya mau tanya update untuk pesanan saya dengan Booking ID: ${booking.bookingId}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-blue-400" />
                <span>Hubungi Admin Tentang Booking Ini</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

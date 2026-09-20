import React, { useState, useEffect } from 'react';
import { X, Check, Gamepad2, Send, Copy, AlertCircle, Calendar, Phone, MapPin, User, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, ProductPrice, Booking, WebsiteSettings } from '../types.js';
import { createBookingApi } from '../api.js';
import { formatRupiah, generateWhatsAppUrl, generateWhatsAppMessage } from '../utils/formatters.js';
import { Logo } from './Logo.js';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialProduct?: Product | null;
  initialPrice?: ProductPrice | null;
  settings: WebsiteSettings;
  onBookingCreated?: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  products,
  initialProduct,
  initialPrice,
  settings,
  onBookingCreated
}) => {
  if (!isOpen) return null;

  // Active products only
  const activeProducts = products.filter(p => p.isActive);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProduct?.id || activeProducts[0]?.id || ''
  );
  const [selectedDuration, setSelectedDuration] = useState<string>(
    initialPrice?.duration || ''
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Find currently selected product object
  const currentProduct = activeProducts.find(p => p.id === selectedProductId) || activeProducts[0];

  // Duration prices for current product
  const availablePrices = currentProduct?.prices || [];

  // Update duration when product changes if current duration isn't in new product
  useEffect(() => {
    if (initialProduct) {
      setSelectedProductId(initialProduct.id);
    }
  }, [initialProduct]);

  useEffect(() => {
    if (initialPrice) {
      setSelectedDuration(initialPrice.duration);
    } else if (availablePrices.length > 0 && !availablePrices.some(p => p.duration === selectedDuration)) {
      setSelectedDuration(availablePrices[0].duration);
    }
  }, [selectedProductId, initialPrice, availablePrices]);

  // Determine current price value
  const matchedPriceObj = availablePrices.find(p => p.duration === selectedDuration) || availablePrices[0];
  const calculatedPrice = matchedPriceObj ? matchedPriceObj.price : 0;

  // Compute end date suggestion based on duration
  useEffect(() => {
    if (!startDate) return;
    const start = new Date(startDate);
    let daysToAdd = 1;
    if (selectedDuration.includes('1 Hari')) daysToAdd = 1;
    else if (selectedDuration.includes('2 Hari')) daysToAdd = 2;
    else if (selectedDuration.includes('3 Hari')) daysToAdd = 3;
    else if (selectedDuration.includes('4 Hari')) daysToAdd = 4;
    else if (selectedDuration.includes('1 Minggu')) daysToAdd = 7;
    else if (selectedDuration.toLowerCase().includes('minggu')) daysToAdd = 7;

    const end = new Date(start.getTime() + daysToAdd * 86400000);
    setEndDate(end.toISOString().split('T')[0]);
  }, [startDate, selectedDuration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 8) {
      setErrorMsg('Nomor WhatsApp tidak valid (minimal 8 angka).');
      return;
    }
    if (!customerAddress.trim()) {
      setErrorMsg('Alamat lengkap wajib diisi untuk keperluan antar-jemput.');
      return;
    }
    if (!currentProduct) {
      setErrorMsg('Silakan pilih perangkat console.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newBooking = await createBookingApi({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        productId: currentProduct.id,
        productName: currentProduct.name,
        duration: selectedDuration || matchedPriceObj?.duration || '1 Hari',
        price: calculatedPrice,
        startDate,
        endDate,
        notes: notes.trim()
      });

      setCompletedBooking(newBooking);
      if (onBookingCreated) {
        onBookingCreated(newBooking);
      }

      // Celebrate with confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback if confetti blocked
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan booking. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyMessage = () => {
    if (!completedBooking) return;
    const msg = generateWhatsAppMessage(completedBooking, settings.businessName);
    navigator.clipboard.writeText(msg);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        id="booking-modal-container"
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl my-8 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-950/80 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                {completedBooking ? 'Booking Berhasil Dibuat!' : 'Formulir Booking Rental'}
              </h3>
              <p className="text-xs text-neutral-400">
                {completedBooking
                  ? 'Simpan Booking ID dan kirim ke WhatsApp Admin'
                  : 'Isi data dengan benar untuk konfirmasi kilat'}
              </p>
            </div>
          </div>
          <button
            id="close-booking-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {completedBooking ? (
            /* STEP 2: SUMMARY & WHATSAPP REDIRECT */
            <div className="space-y-6 text-center">
              {/* Success Badge & Booking ID */}
              <div className="p-6 rounded-2xl bg-blue-950/30 border border-blue-500/30 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 mb-3 shadow-lg shadow-blue-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs uppercase font-bold text-blue-400 tracking-wider mb-1">
                  Status: Menunggu Konfirmasi
                </span>
                <span className="text-xs text-neutral-400 mb-2">Kode Booking Anda:</span>
                <div className="px-5 py-2.5 rounded-xl bg-neutral-950 border border-blue-500/40 font-mono text-2xl font-black text-blue-300 tracking-wider shadow-inner">
                  {completedBooking.bookingId}
                </div>
              </div>

              {/* Booking Summary Box */}
              <div className="p-5 rounded-2xl bg-neutral-950/70 border border-neutral-800 text-left space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
                  Ringkasan Booking:
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-neutral-500 block">Nama Pemesan:</span>
                    <span className="font-semibold text-white">{completedBooking.customerName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">No. WhatsApp:</span>
                    <span className="font-semibold text-white">{completedBooking.customerPhone}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Perangkat:</span>
                    <span className="font-semibold text-blue-400">{completedBooking.productName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Durasi Sewa:</span>
                    <span className="font-semibold text-white">{completedBooking.duration}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Periode Sewa:</span>
                    <span className="font-semibold text-white">
                      {completedBooking.startDate} s/d {completedBooking.endDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Estimasi Tarif:</span>
                    <span className="font-bold text-blue-400 text-base">
                      {formatRupiah(completedBooking.price)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-850">
                  <span className="text-neutral-500 text-xs block">Alamat Pengantaran:</span>
                  <p className="text-xs text-neutral-200 mt-0.5">{completedBooking.customerAddress}</p>
                </div>
                {completedBooking.notes && (
                  <div>
                    <span className="text-neutral-500 text-xs block">Catatan:</span>
                    <p className="text-xs text-neutral-300 italic">{completedBooking.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  id="btn-send-whatsapp"
                  href={generateWhatsAppUrl(settings.whatsappNumber, completedBooking, settings.businessName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-bold text-sm uppercase tracking-wide rounded-xl shadow-xl shadow-green-500/25 flex items-center justify-center gap-2.5 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Detail Booking ke WhatsApp Admin</span>
                </a>

                <button
                  onClick={handleCopyMessage}
                  className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-blue-400 font-bold">Pesan Tersalin ke Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Format Pesan WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* STEP 1: FORM INPUT */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Nama Lengkap *
                </label>
                <input
                  id="booking-name-input"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Muhammad Aditya"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  Nomor WhatsApp *
                </label>
                <input
                  id="booking-phone-input"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Contoh: 081912345678"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  Alamat Lengkap (Mataram & Sekitarnya) *
                </label>
                <textarea
                  id="booking-address-input"
                  required
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Contoh: Jl. Majapahit No. 45, Kekalik Jaya, Mataram (dekat kampus Unram)"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Product & Duration Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Gamepad2 className="w-3.5 h-3.5 text-blue-400" />
                    Pilih Produk *
                  </label>
                  <select
                    id="booking-product-select"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    {activeProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Pilih Durasi Sewa *
                  </label>
                  <select
                    id="booking-duration-select"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  >
                    {availablePrices.map((pr) => (
                      <option key={pr.id} value={pr.duration}>
                        {pr.duration} — {formatRupiah(pr.price)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    Tanggal Mulai Sewa *
                  </label>
                  <input
                    id="booking-start-date"
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    Tanggal Selesai Sewa *
                  </label>
                  <input
                    id="booking-end-date"
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  id="booking-notes-input"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Minta game bola terupdate, antar jam 19.00"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Price Calculation Display */}
              <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-400 block">Estimasi Total Biaya:</span>
                  <span className="text-xl sm:text-2xl font-black text-blue-400 font-['Outfit']">
                    {formatRupiah(calculatedPrice)}
                  </span>
                </div>
                <span className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800">
                  {selectedDuration || '1 Hari'}
                </span>
              </div>

              {/* Submit Button */}
              <button
                id="submit-booking-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95"
              >
                {isSubmitting ? (
                  <span>Memproses Booking...</span>
                ) : (
                  <>
                    <Gamepad2 className="w-4 h-4" />
                    <span>SUBMIT BOOKING & DAPATKAN ID</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

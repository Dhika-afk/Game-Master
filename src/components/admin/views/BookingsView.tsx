import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  Phone,
  MessageSquare,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ChevronDown,
  User,
  MapPin,
  FileText
} from 'lucide-react';
import { Booking, BookingStatus } from '../../../types.js';
import { updateBookingStatusApi, deleteBookingApi } from '../../../api.js';
import { formatRupiah, getStatusBadge, sanitizeWhatsAppNumber } from '../../../utils/formatters.js';

interface BookingsViewProps {
  bookings: Booking[];
  onBookingsUpdated: () => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ bookings, onBookingsUpdated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Editing status modal
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [newStatus, setNewStatus] = useState<BookingStatus>('Pending');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.bookingId.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.productName.toLowerCase().includes(q) ||
        b.customerAddress.toLowerCase().includes(q);

      if (!matchSearch) return false;

      // Status
      if (selectedStatus !== 'ALL' && b.status !== selectedStatus) {
        return false;
      }

      // Date
      if (selectedDate && !b.startDate.startsWith(selectedDate) && !b.createdAt.startsWith(selectedDate)) {
        return false;
      }

      return true;
    });
  }, [bookings, searchQuery, selectedStatus, selectedDate]);

  const handleOpenStatusEdit = (b: Booking) => {
    setEditingBooking(b);
    setNewStatus(b.status);
    setAdminNotes(b.adminNotes || '');
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    try {
      setUpdating(true);
      await updateBookingStatusApi(editingBooking.id, newStatus, adminNotes);
      setEditingBooking(null);
      onBookingsUpdated();
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string, bookingId: string) => {
    if (!window.confirm(`Yakin ingin menghapus pesanan ${bookingId}? Data tidak dapat dikembalikan.`)) {
      return;
    }
    try {
      await deleteBookingApi(id);
      onBookingsUpdated();
    } catch (err) {
      console.error('Failed to delete booking', err);
    }
  };

  const handleOpenCustomerWhatsApp = (b: Booking) => {
    const cleanPhone = sanitizeWhatsAppNumber(b.customerPhone);
    const text = encodeURIComponent(
      `Halo Kak ${b.customerName}, kami dari GAME MASTER MATARAM terkait rental console dengan Booking ID ${b.bookingId} (${b.productName}). Status pesanan Anda saat ini: ${b.status}.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Title & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-['Outfit']">
            Manajemen Booking Pelanggan
          </h2>
          <p className="text-xs text-neutral-400">
            Total {filteredBookings.length} booking ditampilkan
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID, nama, no WA..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="Pending">Menunggu Konfirmasi</option>
            <option value="Confirmed">Dikonfirmasi</option>
            <option value="On Rental">Sedang Disewa</option>
            <option value="Completed">Selesai</option>
            <option value="Cancelled">Dibatalkan</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          />

          {(searchQuery || selectedStatus !== 'ALL' || selectedDate) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('ALL');
                setSelectedDate('');
              }}
              className="px-3 py-2 text-xs text-neutral-400 hover:text-white bg-neutral-850 rounded-xl"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bookings List Cards / Table */}
      {filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800 text-neutral-400 text-xs">
          Tidak ada data booking yang sesuai dengan kriteria filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => {
            const badge = getStatusBadge(b.status);
            return (
              <div
                key={b.id}
                className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Booking ID & Customer Info */}
                <div className="space-y-1.5 min-w-[240px]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-emerald-400 tracking-wider">
                      {b.bookingId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.border} ${badge.text}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-white font-semibold">
                    <User className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{b.customerName}</span>
                    <span className="text-neutral-500 font-normal">({b.customerPhone})</span>
                  </div>

                  <div className="flex items-start gap-1.5 text-[11px] text-neutral-400">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{b.customerAddress}</span>
                  </div>
                </div>

                {/* Middle: Product & Duration Info */}
                <div className="space-y-1 text-xs text-neutral-300 lg:px-4 lg:border-x lg:border-neutral-800/80 flex-1">
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    <span className="font-bold text-white text-sm">{b.productName}</span>
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300">
                      {b.duration}
                    </span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {formatRupiah(b.price)}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span>Mulai: {b.startDate} s/d {b.endDate}</span>
                  </div>
                  {b.notes && (
                    <div className="text-[11px] text-neutral-400 italic flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-neutral-500 flex-shrink-0" />
                      <span className="truncate">"{b.notes}"</span>
                    </div>
                  )}
                  {b.adminNotes && (
                    <div className="text-[11px] text-emerald-400">
                      <span className="font-bold">Admin note:</span> {b.adminNotes}
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-800">
                  {/* WhatsApp Customer Button */}
                  <button
                    onClick={() => handleOpenCustomerWhatsApp(b)}
                    className="p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-800/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Hubungi Customer via WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">WA Customer</span>
                  </button>

                  {/* Change Status Button */}
                  <button
                    onClick={() => handleOpenStatusEdit(b)}
                    className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Ubah Status</span>
                  </button>

                  {/* Delete Booking Button */}
                  <button
                    onClick={() => handleDelete(b.id, b.bookingId)}
                    className="p-2 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    title="Hapus Booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Status Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Update Status Booking
            </h3>
            <p className="text-xs text-neutral-400">
              Ubah status untuk pesanan <span className="font-mono text-emerald-400 font-bold">{editingBooking.bookingId}</span> ({editingBooking.customerName})
            </p>

            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1.5">
                  Pilih Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Pending">Menunggu Konfirmasi (Pending)</option>
                  <option value="Confirmed">Dikonfirmasi (Confirmed)</option>
                  <option value="On Rental">Sedang Disewa / Diantar (On Rental)</option>
                  <option value="Completed">Selesai (Completed)</option>
                  <option value="Cancelled">Dibatalkan (Cancelled)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1.5">
                  Catatan Admin (Tampil di Cek Status Pelanggan)
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Misal: Kurir sedang menuju lokasi Anda / Unit sudah selesai dan dijemput."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider"
                >
                  {updating ? 'Menyimpan...' : 'Simpan Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  Truck,
  TrendingUp,
  DollarSign,
  Gamepad2,
  Phone,
  ArrowUpRight
} from 'lucide-react';
import { AdminStats, Booking } from '../../../types.js';
import { formatRupiah, getStatusBadge } from '../../../utils/formatters.js';

interface DashboardViewProps {
  stats: AdminStats | null;
  onNavigateTab: (tab: string) => void;
  onSelectBooking?: (booking: Booking) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ stats, onNavigateTab }) => {
  if (!stats) {
    return (
      <div className="p-8 text-center text-neutral-400">
        Memuat data statistik dashboard...
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Booking',
      value: stats.totalBookings,
      subtitle: 'Semua pesanan masuk',
      icon: <Calendar className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-950/20'
    },
    {
      title: 'Booking Hari Ini',
      value: stats.bookingsToday,
      subtitle: 'Pesanan baru hari ini',
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-950/20'
    },
    {
      title: 'Booking Pending',
      value: stats.pendingBookings,
      subtitle: 'Perlu konfirmasi WA',
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/30 bg-amber-950/20',
      actionTab: 'bookings'
    },
    {
      title: 'Booking Aktif (On Rental)',
      value: stats.activeBookings,
      subtitle: 'Unit sedang disewa',
      icon: <Truck className="w-5 h-5 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-950/20',
      actionTab: 'bookings'
    },
    {
      title: 'Booking Selesai',
      value: stats.completedBookings,
      subtitle: 'Unit sudah kembali',
      icon: <CheckCircle className="w-5 h-5 text-teal-400" />,
      color: 'border-teal-500/30 bg-teal-950/20'
    },
    {
      title: 'Estimasi Pendapatan',
      value: formatRupiah(stats.estimatedRevenue),
      subtitle: 'Total dari booking aktif/selesai',
      icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/40 bg-emerald-950/30'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Outfit']">
            Ringkasan Bisnis Rental
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Pantau performa rental PlayStation, armada konsol, dan pesanan pelanggan secara realtime.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigateTab('bookings')}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            <span>Kelola Booking</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((c, idx) => (
          <div
            key={idx}
            onClick={() => c.actionTab && onNavigateTab(c.actionTab)}
            className={`p-5 rounded-2xl border ${c.color} transition-all duration-200 ${
              c.actionTab ? 'cursor-pointer hover:scale-[1.02]' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                {c.title}
              </span>
              <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800">
                {c.icon}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] mb-1">
              {c.value}
            </div>
            <span className="text-xs text-neutral-400 block">{c.subtitle}</span>
          </div>
        ))}
      </div>

      {/* Recent Bookings Section */}
      <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Booking Terbaru
            </h3>
            <p className="text-xs text-neutral-400">
              5 pesanan terakhir yang masuk ke sistem
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Lihat Semua Booking</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.recentBookings && stats.recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="border-b border-neutral-800 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-2">Booking ID</th>
                  <th className="py-3 px-2">Pelanggan</th>
                  <th className="py-3 px-2">Perangkat</th>
                  <th className="py-3 px-2">Durasi</th>
                  <th className="py-3 px-2">Tarif</th>
                  <th className="py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {stats.recentBookings.map((b) => {
                  const badge = getStatusBadge(b.status);
                  return (
                    <tr key={b.id} className="hover:bg-neutral-850/50 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-white">
                        {b.bookingId}
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-semibold text-white block">{b.customerName}</span>
                        <span className="text-[11px] text-neutral-500">{b.customerPhone}</span>
                      </td>
                      <td className="py-3 px-2 font-medium text-emerald-400">
                        {b.productName}
                      </td>
                      <td className="py-3 px-2 text-neutral-300">
                        {b.duration}
                      </td>
                      <td className="py-3 px-2 font-bold text-white">
                        {formatRupiah(b.price)}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.border} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-neutral-500">
            Belum ada booking tercatat.
          </div>
        )}
      </div>
    </div>
  );
};

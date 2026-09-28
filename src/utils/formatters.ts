import { Booking, Product } from '../types.js';

export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatCompactRupiah(amount: number): string {
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)} jt`;
  }
  if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)} rb`;
  }
  return formatRupiah(amount);
}

export function getLowestPrice(product: Product): number {
  if (product.price && product.price > 0) return Number(product.price);
  if (!product.prices || product.prices.length === 0) return 0;
  return Math.min(...product.prices.map(p => p.price));
}

export function sanitizeWhatsAppNumber(phone: string): string {
  // Clean non-digits
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } else if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

export function formatPhoneDisplay(phone: string): string {
  if (!phone) return '+62 819-3677-4036';
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('62')) {
    const local = digits.slice(2);
    if (local.length >= 10) {
      return `+62 ${local.slice(0, 3)}-${local.slice(3, 7)}-${local.slice(7)}`;
    }
    return `+62 ${local}`;
  }
  if (digits.startsWith('0')) {
    const local = digits.slice(1);
    if (local.length >= 10) {
      return `+62 ${local.slice(0, 3)}-${local.slice(3, 7)}-${local.slice(7)}`;
    }
    return `+62 ${local}`;
  }
  return phone.startsWith('+') ? phone : `+${phone}`;
}

export function generateWhatsAppMessage(booking: Booking, businessName: string = 'GAME MASTER MATARAM'): string {
  return (
`Halo Admin ${businessName},

Saya ingin melakukan booking rental.

Booking ID: ${booking.bookingId}
Nama: ${booking.customerName}
No. WhatsApp: ${booking.customerPhone}
Produk: ${booking.productName}
Durasi: ${booking.duration}
Tanggal Mulai: ${booking.startDate}
Tanggal Selesai: ${booking.endDate}
Alamat: ${booking.customerAddress}
Catatan: ${booking.notes || '-'}

Mohon konfirmasi ketersediaannya.`
  );
}

export function generateWhatsAppUrl(
  adminPhone: string,
  booking: Booking,
  businessName: string = 'GAME MASTER MATARAM'
): string {
  const cleanPhone = sanitizeWhatsAppNumber(adminPhone);
  const message = generateWhatsAppMessage(booking, businessName);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateDirectAdminWhatsAppUrl(
  adminPhone: string,
  customText: string = 'Halo Admin GAME MASTER MATARAM, saya mau tanya seputar rental PlayStation.'
): string {
  const cleanPhone = sanitizeWhatsAppNumber(adminPhone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customText)}`;
}

export function getStatusBadge(status: Booking['status']): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'Pending':
      return {
        label: 'Menunggu Konfirmasi',
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/20'
      };
    case 'Confirmed':
      return {
        label: 'Dikonfirmasi',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/20'
      };
    case 'On Rental':
      return {
        label: 'Sedang Disewa',
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-400',
        border: 'border-indigo-500/20'
      };
    case 'Completed':
      return {
        label: 'Selesai',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20'
      };
    case 'Cancelled':
      return {
        label: 'Dibatalkan',
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/20'
      };
    default:
      return {
        label: status,
        bg: 'bg-neutral-800',
        text: 'text-neutral-400',
        border: 'border-neutral-700'
      };
  }
}

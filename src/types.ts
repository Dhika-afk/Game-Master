export type CategoryType =
  | 'ALL'
  | 'PS4'
  | 'PS4 + TV'
  | 'PS4 BOX'
  | 'PS3'
  | 'PS3 + TV'
  | 'PS3 BOX'
  | 'Nintendo Switch'
  | 'Nintendo Switch Lite'
  | 'PS2'
  | 'TV 32 INCH';

export interface ProductPrice {
  id: string;
  productId?: string;
  duration: string; // e.g. "1 Hari", "2 Hari", "3 Hari", "4 Hari", "1 Minggu", "Minimal 2 Hari"
  price: number; // in IDR, e.g. 110000
  label?: string; // e.g. "Paling Populer", "Hemat 15%"
  sortOrder?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string; // e.g. "PS4", "PS4 + TV"
  category: CategoryType;
  shortDesc: string; // e.g. "PlayStation 4 Rental"
  description: string;
  badge?: string; // e.g. "Terpopuler", "Best Value", "Unit Baru", "Paket Komplit"
  mainImage: string;
  galleryImages: string[];
  thumbnail: string;
  includedItems: string[]; // e.g. ["Console PS4 Slim", "2 Stick Wireless Original", "Kabel HDMI High Speed", "Kabel Power & USB Charger", "Full Game Terupdate"]
  features: string[]; // e.g. ["Rental PlayStation", "Antar–jemput", "Wilayah Mataram dan sekitarnya", "Peralatan lengkap"]
  isPopular?: boolean;
  isActive: boolean;
  sortOrder: number;
  prices?: ProductPrice[];
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'On Rental' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  bookingId: string; // e.g. "GM-20260920-001"
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productId: string;
  productName: string;
  duration: string;
  price: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  notes?: string;
  status: BookingStatus;
  createdAt: string; // ISO string
  adminNotes?: string;
}

export interface HeroVideo {
  id: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  customerPhoto: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  location?: string;
  isVerified: boolean;
  isApproved: boolean;
  showOnHomepage: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  category: 'product' | 'hero' | 'review' | 'branding' | 'other';
  createdAt: string;
}

export interface WebsiteSettings {
  businessName: string;
  logoUrl?: string;
  tagline: string;
  description: string;
  locationArea?: string;
  consolesSummary: string;
  whatsappNumber: string;
  operationalHours?: string;
  instagramHandle: string;
  tiktokHandle: string;
  address: string;
  heroTitle: string;
  heroTagline: string;
  heroDescription: string;
  ctaTitle: string;
  ctaSubtitle: string;
  footerText: string;
  accentColor: string; // hex, e.g. "#10B981"
  features: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  rentalSteps: Array<{
    step: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface AdminStats {
  totalBookings: number;
  bookingsToday: number;
  pendingBookings: number;
  activeBookings: number; // On Rental
  completedBookings: number;
  cancelledBookings: number;
  estimatedRevenue: number;
  dailyRevenue: number;
  recentBookings: Booking[];
}

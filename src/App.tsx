import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchProducts,
  fetchHeroVideos,
  fetchReviews,
  fetchSettings,
  fetchBookings,
  fetchAdminStats,
  fetchMedia
} from './api.js';
import {
  Product,
  ProductPrice,
  HeroVideo,
  CustomerReview,
  WebsiteSettings,
  Booking,
  AdminStats,
  MediaItem,
  CategoryType
} from './types.js';

// Customer Components
import { Navbar } from './components/Navbar.js';
import { HeroSection } from './components/HeroSection.js';
import { CategorySection } from './components/CategorySection.js';
import { CatalogSection } from './components/CatalogSection.js';
import { ProductDetailModal } from './components/ProductDetailModal.js';
import { BookingModal } from './components/BookingModal.js';
import { BookingStatusLookupModal } from './components/BookingStatusLookupModal.js';
import { CaraRentalSection } from './components/CaraRentalSection.js';
import { KenapaKamiSection } from './components/KenapaKamiSection.js';
import { ReviewsSection } from './components/ReviewsSection.js';
import { CtaSection } from './components/CtaSection.js';
import { Footer } from './components/Footer.js';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.js';

// Admin Components
import { AdminLoginModal } from './components/admin/AdminLoginModal.js';
import { AdminLayout } from './components/admin/AdminLayout.js';

export default function App() {
  // Navigation View: 'customer' or 'admin'
  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer');

  // Application Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>({
    businessName: 'GAME MASTER MATARAM',
    logoUrl: '/logo.jpg',
    tagline: '"Your Game is Game Master"',
    description: 'Rental PlayStation dan gaming console terpercaya di Mataram dan sekitarnya.',
    locationArea: 'Mataram dan sekitarnya',
    address: 'Jl. Majapahit No. 88, Kekalik Jaya, Kec. Sekarbela, Kota Mataram, NTB',
    whatsappNumber: '6281936774036',
    operationalHours: 'Setiap Hari: 09:00 - 23:00 WITA',
    instagramHandle: '@gamemaster.mataram',
    tiktokHandle: '@gamemastermataram',
    accentColor: '#10b981',
    heroTitle: 'GAME MASTER MATARAM',
    heroTagline: '"Your Game is Game Master"',
    heroDescription: 'Rental PlayStation & Gaming Console Mataram dan Sekitarnya',
    consolesSummary: 'PS4 • PS3 • Nintendo Switch • PS2 • TV',
    ctaTitle: 'SIAP MAIN?',
    ctaSubtitle: 'Booking PlayStation favoritmu sekarang.',
    footerText: 'Rental PlayStation dan gaming console terpercaya di Mataram dan sekitarnya. Unit terawat, stick original, full game terupdate, siap antar ke lokasimu.',
    features: [
      { id: 'f1', title: 'Harga transparan', description: 'Semua harga tertera jelas tanpa ada biaya tersembunyi.', icon: 'Tag' },
      { id: 'f2', title: 'Booking mudah', description: 'Cukup pilih unit dan durasi, langsung konfirmasi WhatsApp.', icon: 'CheckCircle2' },
      { id: 'f3', title: 'Antar–jemput', description: 'Layanan antar dan jemput unit langsung ke lokasi Anda.', icon: 'Truck' },
      { id: 'f4', title: 'Pilihan console lengkap', description: 'Tersedia PS4, PS3, Nintendo Switch, PS2, hingga paket TV 32 inch.', icon: 'Gamepad2' },
      { id: 'f5', title: 'Proses cepat', description: 'Konfirmasi ketersediaan dan pengiriman unit kilat dan tepat waktu.', icon: 'Zap' },
      { id: 'f6', title: 'Pelayanan ramah', description: 'Customer service ramah dan siap membantu kebutuhan gaming Anda.', icon: 'Smile' }
    ],
    rentalSteps: [
      { step: 'STEP 01', title: 'Pilih perangkat', description: 'Pilih PlayStation 4, PS3, Nintendo Switch, atau paket komplit TV.', icon: 'Gamepad2' },
      { step: 'STEP 02', title: 'Pilih durasi', description: 'Tentukan lama sewa mulai dari harian hingga paket hemat mingguan.', icon: 'Clock' },
      { step: 'STEP 03', title: 'Isi data booking', description: 'Isi formulir nama, nomor WhatsApp, dan alamat pengantaran Mataram.', icon: 'FileEdit' },
      { step: 'STEP 04', title: 'Konfirmasi WhatsApp', description: 'Dapatkan Booking ID dan kirim rincian booking langsung ke admin.', icon: 'MessageSquare' },
      { step: 'STEP 05', title: 'Perangkat diantar', description: 'Unit siap main diantar tepat waktu langsung ke lokasi Anda.', icon: 'Truck' }
    ]
  });
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('ALL');

  // Modals
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProductForBooking, setSelectedProductForBooking] = useState<Product | null>(null);
  const [selectedPriceForBooking, setSelectedPriceForBooking] = useState<ProductPrice | null>(null);

  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isStatusLookupOpen, setIsStatusLookupOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<{ id: string; username: string; name: string } | null>(() => {
    try {
      const stored = localStorage.getItem('gm_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loadingInitial, setLoadingInitial] = useState(true);

  // Load public data
  const loadPublicData = useCallback(async () => {
    try {
      const [prodsRes, videosRes, revsRes, settingsRes, mediaRes] = await Promise.all([
        fetchProducts(),
        fetchHeroVideos(),
        fetchReviews(),
        fetchSettings(),
        fetchMedia()
      ]);
      setProducts(prodsRes);
      setHeroVideos(videosRes);
      setReviews(revsRes);
      setSettings(settingsRes);
      setMedia(mediaRes);
    } catch (err) {
      console.error('Error loading public data:', err);
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  // Load admin data
  const loadAdminData = useCallback(async () => {
    try {
      const [bRes, sRes] = await Promise.all([
        fetchBookings(),
        fetchAdminStats()
      ]);
      setBookings(bRes);
      setStats(sRes);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  // If admin is active, load bookings and stats
  useEffect(() => {
    if (adminUser) {
      loadAdminData();
    }
  }, [adminUser, loadAdminData]);

  // Handler to open booking with a specific product and optional duration
  const handleOpenBooking = (product?: Product, price?: ProductPrice | null) => {
    setSelectedProductForBooking(product || null);
    setSelectedPriceForBooking(price || null);
    setDetailProduct(null); // close detail if opened
    setIsBookingModalOpen(true);
  };

  const handleOpenProductDetail = (product: Product) => {
    setDetailProduct(product);
  };

  const handleBookFromDetail = (product: Product, selectedPrice: ProductPrice | null) => {
    handleOpenBooking(product, selectedPrice);
  };

  const handleReviewSubmitted = (newReview: CustomerReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  const handleAdminLoginSuccess = (user: { id: string; username: string; name: string }) => {
    setAdminUser(user);
    setCurrentView('admin');
    loadAdminData();
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('gm_admin_token');
    localStorage.removeItem('gm_admin_user');
    setAdminUser(null);
    setCurrentView('customer');
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('katalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="font-extrabold text-lg tracking-wide font-['Outfit']">GAME MASTER MATARAM</span>
        <span className="text-xs text-neutral-400 mt-1">Memuat katalog PlayStation...</span>
      </div>
    );
  }

  // If Admin View is active
  if (currentView === 'admin' && adminUser) {
    return (
      <AdminLayout
        user={adminUser}
        onLogout={handleAdminLogout}
        onBackToCustomerSite={() => setCurrentView('customer')}
        stats={stats}
        bookings={bookings}
        products={products}
        heroVideos={heroVideos}
        reviews={reviews}
        media={media}
        settings={settings}
        onRefreshAll={() => {
          loadPublicData();
          loadAdminData();
        }}
      />
    );
  }

  // Customer View
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-emerald-500 selection:text-neutral-950 font-['Plus_Jakarta_Sans']">
      {/* Admin quick indicator banner if logged in */}
      {adminUser && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/30 px-4 py-1.5 text-xs text-emerald-300 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Anda sedang login sebagai Admin ({adminUser.name})</span>
          </div>
          <button
            onClick={() => setCurrentView('admin')}
            className="font-bold underline hover:text-white"
          >
            Buka Admin Dashboard &rarr;
          </button>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        settings={settings}
        onOpenBooking={() => handleOpenBooking()}
        onOpenStatusLookup={() => setIsStatusLookupOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdminLoggedIn={!!adminUser}
        onNavigateToAdmin={() => setCurrentView('admin')}
      />

      {/* Hero Video Carousel Section */}
      <HeroSection
        videos={heroVideos}
        settings={settings}
        onOpenBooking={() => handleOpenBooking()}
        onExploreCatalog={scrollToCatalog}
      />

      {/* Visual Category Filters */}
      <CategorySection
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Catalog Grid Section */}
      <CatalogSection
        products={products}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onViewProductDetail={handleOpenProductDetail}
        onBookProduct={(p) => handleOpenBooking(p)}
      />

      {/* Cara Rental Steps Section */}
      <CaraRentalSection
        settings={settings}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Keunggulan (Kenapa Game Master Mataram) Section */}
      <KenapaKamiSection
        settings={settings}
      />

      {/* Customer Reviews Section */}
      <ReviewsSection
        reviews={reviews}
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* CTA Section */}
      <CtaSection
        settings={settings}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdminLoggedIn={!!adminUser}
        onNavigateToAdmin={() => setCurrentView('admin')}
      />

      {/* Floating WhatsApp Contact Button */}
      <FloatingWhatsApp
        settings={settings}
      />

      {/* Modal: Product Detail */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onBookWithDuration={handleBookFromDetail}
      />

      {/* Modal: Booking System */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        products={products}
        initialProduct={selectedProductForBooking}
        initialPrice={selectedPriceForBooking}
        settings={settings}
        onBookingCreated={() => {
          if (adminUser) loadAdminData();
        }}
      />

      {/* Modal: Cek Status Booking */}
      <BookingStatusLookupModal
        isOpen={isStatusLookupOpen}
        onClose={() => setIsStatusLookupOpen(false)}
        settings={settings}
      />

      {/* Modal: Admin Login */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}

import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Gamepad2,
  DollarSign,
  Video,
  Star,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  Sparkles,
  Database
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase.js';
import {
  Booking,
  Product,
  HeroVideo,
  CustomerReview,
  MediaItem,
  WebsiteSettings,
  AdminStats
} from '../../types.js';
import { DashboardView } from './views/DashboardView.js';
import { BookingsView } from './views/BookingsView.js';
import { CatalogView } from './views/CatalogView.js';
import { PricesView } from './views/PricesView.js';
import { HeroVideosView } from './views/HeroVideosView.js';
import { ReviewsView } from './views/ReviewsView.js';
import { MediaView } from './views/MediaView.js';
import { SettingsView } from './views/SettingsView.js';
import { Logo } from '../Logo.js';

interface AdminLayoutProps {
  user: { id: string; username: string; name: string } | null;
  onLogout: () => void;
  onBackToCustomerSite: () => void;
  stats: AdminStats | null;
  bookings: Booking[];
  products: Product[];
  heroVideos: HeroVideo[];
  reviews: CustomerReview[];
  media: MediaItem[];
  settings: WebsiteSettings;
  onRefreshAll: () => void;
}

type AdminTab =
  | 'dashboard'
  | 'bookings'
  | 'catalog'
  | 'prices'
  | 'videos'
  | 'reviews'
  | 'media'
  | 'settings';

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  onLogout,
  onBackToCustomerSite,
  stats,
  bookings,
  products,
  heroVideos,
  reviews,
  media,
  settings,
  onRefreshAll
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pendingCount = bookings.filter(b => b.status === 'Pending').length;

  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'bookings' as AdminTab,
      label: 'Booking Pelanggan',
      icon: <CalendarCheck className="w-4 h-4" />,
      badge: pendingCount > 0 ? `${pendingCount} Baru` : undefined
    },
    {
      id: 'catalog' as AdminTab,
      label: 'Katalog Perangkat',
      icon: <Gamepad2 className="w-4 h-4" />
    },
    {
      id: 'prices' as AdminTab,
      label: 'Tarif & Durasi',
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      id: 'videos' as AdminTab,
      label: 'Video Hero Carousel',
      icon: <Video className="w-4 h-4" />
    },
    {
      id: 'reviews' as AdminTab,
      label: 'Review Pelanggan',
      icon: <Star className="w-4 h-4" />
    },
    {
      id: 'media' as AdminTab,
      label: 'Pustaka Media',
      icon: <ImageIcon className="w-4 h-4" />
    },
    {
      id: 'settings' as AdminTab,
      label: 'Website Settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Logo size="xs" />
          <span className="font-extrabold text-sm font-['Outfit']">ADMIN PORTAL</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToCustomerSite}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-800 text-[11px] text-blue-400 font-semibold"
          >
            Website
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-auto md:h-screen w-64 bg-neutral-950/95 md:bg-neutral-900/90 border-r border-neutral-850 z-40 flex flex-col justify-between transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0 inset-0 md:inset-auto' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Logo size="sm" showBadge />
              <div>
                <span className="font-extrabold text-sm text-white block font-['Outfit'] tracking-wide">
                  GAME MASTER
                </span>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block">
                  Admin Panel
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info Card */}
          <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-neutral-950/80 border border-neutral-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/30">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-white block leading-tight">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  @{user?.username || 'admin'}
                </span>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          </div>

          {/* Supabase Status Pill */}
          <div className="mx-3 mb-3 px-3 py-1.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-400 font-medium">Database:</span>
            </div>
            {isSupabaseConfigured() ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Supabase
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                Local Mock
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive
                          ? 'bg-blue-900 text-blue-100'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-800/80 space-y-2">
          {/* Back to Customer Website Button */}
          <button
            onClick={onBackToCustomerSite}
            className="w-full py-2.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-neutral-700/60"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>Lihat Website Customer</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 min-h-screen p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
            />
          )}
          {activeTab === 'bookings' && (
            <BookingsView
              bookings={bookings}
              onBookingsUpdated={onRefreshAll}
            />
          )}
          {activeTab === 'catalog' && (
            <CatalogView
              products={products}
              onProductsUpdated={onRefreshAll}
            />
          )}
          {activeTab === 'prices' && (
            <PricesView
              products={products}
              onProductsUpdated={onRefreshAll}
            />
          )}
          {activeTab === 'videos' && (
            <HeroVideosView
              videos={heroVideos}
              onVideosUpdated={onRefreshAll}
            />
          )}
          {activeTab === 'reviews' && (
            <ReviewsView
              reviews={reviews}
              onReviewsUpdated={onRefreshAll}
            />
          )}
          {activeTab === 'media' && (
            <MediaView
              media={media}
              onMediaUpdated={onRefreshAll}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              onSettingsUpdated={onRefreshAll}
            />
          )}
        </div>
      </main>
    </div>
  );
};
